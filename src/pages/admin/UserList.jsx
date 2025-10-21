import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";

function toDateString(createdAt) {
  try {
    if (!createdAt) return "—";
    if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleString();
    if (createdAt instanceof Date) return createdAt.toLocaleString();
    return new Date(createdAt).toLocaleString();
  } catch {
    return "—";
  }
}

export default function UserList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingIds, setWorkingIds] = useState({}); // מציין מי בעדכון כדי לנעול כפתורים

  const load = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const admins = usersSnap.docs.map((d) => ({
        id: d.id,
        role: (d.data().role || "admin").toLowerCase(),
        email: d.data().email || "",
        firstName: d.data().firstName || "",
        lastName: d.data().lastName || "",
        phone: d.data().phone || "",
        location: d.data().location || "",
        createdAt: d.data().createdAt,
        status: (d.data().status || "active").toLowerCase(),
        suspendedUntil: d.data().suspendedUntil || null,
        reason: d.data().reason || "",
        sourceCollection: "users",
      }));

      const coachesSnap = await getDocs(collection(db, "coaches"));
      const coaches = coachesSnap.docs.map((d) => ({
        id: d.id,
        role: "coach",
        email: d.data().email || "",
        firstName: d.data().firstName || "",
        lastName: d.data().lastName || "",
        phone: d.data().phone || "",
        location: d.data().location || "",
        createdAt: d.data().createdAt,
        status: (d.data().status || "active").toLowerCase(),
        suspendedUntil: d.data().suspendedUntil || null,
        reason: d.data().reason || "",
        sourceCollection: "coaches",
      }));

      const clientsSnap = await getDocs(collection(db, "clients"));
      const clients = clientsSnap.docs.map((d) => ({
        id: d.id,
        role: "client",
        email: d.data().email || "",
        firstName: d.data().firstName || "",
        lastName: d.data().lastName || "",
        phone: d.data().phone || "",
        location: d.data().location || "",
        createdAt: d.data().createdAt,
        status: (d.data().status || "active").toLowerCase(),
        suspendedUntil: d.data().suspendedUntil || null,
        reason: d.data().reason || "",
        sourceCollection: "clients",
      }));

      const all = [...admins, ...coaches, ...clients].sort((a, b) => {
        const ta = new Date(a.createdAt || 0).getTime();
        const tb = new Date(b.createdAt || 0).getTime();
        return tb - ta;
      });

      setRows(all);
    } catch (e) {
      console.error("Failed loading users:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logAction = async (target, action, extra = {}) => {
    // אופציונלי: לוג פעולות מנהל
    try {
      await addDoc(collection(db, "adminActions"), {
        action,
        target,
        extra,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      // לא חוסם את ה־UI אם נכשל
      console.warn("logAction failed:", e);
    }
  };

  const withWorking = async (key, fn) => {
    setWorkingIds((prev) => ({ ...prev, [key]: true }));
    try {
      await fn();
    } finally {
      setWorkingIds((prev) => {
        const n = { ...prev };
        delete n[key];
        return n;
      });
    }
  };

  const setStatus = async (row, status, opts = {}) =>
    withWorking(`${row.sourceCollection}:${row.id}`, async () => {
      const ref = doc(db, row.sourceCollection, row.id);
      const payload = { status };

      if (status === "suspended") {
        payload.suspendedUntil = opts.suspendedUntil || null;
        payload.reason = opts.reason || "";
      } else {
        payload.suspendedUntil = null;
        payload.reason = "";
      }

      await updateDoc(ref, payload);
      await logAction(
        { id: row.id, source: row.sourceCollection, email: row.email },
        "setStatus",
        { status, ...opts }
      );

      await load();
    });

  const blockUser = (row) => {
    const reason = window.prompt("סיבת חסימה (אופציונלי):", row.reason || "");
    return setStatus(row, "blocked", { reason });
  };

  const suspendUser = (row) => {
    const reason = window.prompt("סיבת השעייה (אופציונלי):", row.reason || "");
    const untilStr = window.prompt(
      "תאריך סיום השעייה (ISO) לדוגמה 2025-12-31T23:59:59:",
      ""
    );
    let suspendedUntil = null;
    if (untilStr && untilStr.trim()) {
      const t = new Date(untilStr.trim());
      if (!isNaN(t.getTime())) suspendedUntil = t.toISOString();
      else alert("תאריך לא תקין – נשמר ללא תאריך סיום.");
    }
    return setStatus(row, "suspended", { reason, suspendedUntil });
  };

  const activateUser = (row) => setStatus(row, "active");

  const deleteUser = (row) =>
    withWorking(`${row.sourceCollection}:${row.id}`, async () => {
      if (
        !window.confirm(
          `למחוק לצמיתות את ${row.email || row.firstName || row.id}? פעולה זו בלתי הפיכה.`
        )
      )
        return;
      await deleteDoc(doc(db, row.sourceCollection, row.id));
      await logAction(
        { id: row.id, source: row.sourceCollection, email: row.email },
        "deleteUser"
      );
      await load();
    });

  if (loading) return <div style={{ padding: 20 }}>Loading users…</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>👥 Users management</h2>
      <p>תצוגה מאוחדת של users / coaches / clients, כולל פעולות ניהול.</p>

      {rows.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #e5e5e5",
            marginTop: 12,
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: "#f8f8f8" }}>
              <th style={th}>Role</th>
              <th style={th}>Email</th>
              <th style={th}>First name</th>
              <th style={th}>Last name</th>
              <th style={th}>Phone</th>
              <th style={th}>Location</th>
              <th style={th}>Created</th>
              <th style={th}>Source</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => {
              const key = `${u.sourceCollection}:${u.id}`;
              const busy = !!workingIds[key];
              const statusDetails =
                u.status === "suspended"
                  ? `suspended${u.suspendedUntil ? ` until ${u.suspendedUntil}` : ""}${
                      u.reason ? ` (${u.reason})` : ""
                    }`
                  : u.status === "blocked"
                  ? `blocked${u.reason ? ` (${u.reason})` : ""}`
                  : "active";

              return (
                <tr key={key}>
                  <td style={td}>{u.role}</td>
                  <td style={td}>{u.email || "—"}</td>
                  <td style={td}>{u.firstName || "—"}</td>
                  <td style={td}>{u.lastName || "—"}</td>
                  <td style={td}>{u.phone || "—"}</td>
                  <td style={td}>{u.location || "—"}</td>
                  <td style={td}>{toDateString(u.createdAt)}</td>
                  <td style={td}>{u.sourceCollection}</td>
                  <td style={td}>
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: 6,
                        background:
                          u.status === "active"
                            ? "#e6f7e6"
                            : u.status === "blocked"
                            ? "#fdeeee"
                            : "#fff7e6",
                        border:
                          u.status === "active"
                            ? "1px solid #a5d6a7"
                            : u.status === "blocked"
                            ? "1px solid #ef9a9a"
                            : "1px solid #ffcc80",
                      }}
                      title={u.reason || ""}
                    >
                      {statusDetails}
                    </span>
                  </td>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>
                    {u.status !== "active" && (
                      <button
                        disabled={busy}
                        onClick={() => activateUser(u)}
                        style={btn}
                        title="Activate"
                      >
                        Activate
                      </button>
                    )}
                    {u.status !== "blocked" && (
                      <button
                        disabled={busy}
                        onClick={() => blockUser(u)}
                        style={btnWarn}
                        title="Block"
                      >
                        Block
                      </button>
                    )}
                    {u.status !== "suspended" && (
                      <button
                        disabled={busy}
                        onClick={() => suspendUser(u)}
                        style={btnWarn}
                        title="Suspend"
                      >
                        Suspend
                      </button>
                    )}
                    <button
                      disabled={busy}
                      onClick={() => deleteUser(u)}
                      style={btnDanger}
                      title="Delete permanently"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "10px 8px",
  borderBottom: "1px solid #e5e5e5",
};

const td = {
  padding: "8px",
  borderBottom: "1px solid #f0f0f0",
};

const btn = {
  marginRight: 6,
  padding: "5px 10px",
  borderRadius: 6,
  border: "1px solid #d0d0d0",
  background: "#fff",
  cursor: "pointer",
};

const btnWarn = {
  ...btn,
  border: "1px solid #ffcc80",
  background: "#fff9e6",
};

const btnDanger = {
  ...btn,
  border: "1px solid #ef9a9a",
  background: "#ffeded",
};
