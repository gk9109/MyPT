// src/pages/admin/Reports.jsx
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ total: 0, admin: 0, coach: 0, client: 0 });
  const [last7Days, setLast7Days] = useState([]); // [{day: "2025-10-08", count: 2}, ...]
  const [error, setError] = useState("");

  const usersCol = useMemo(() => collection(db, "users"), []);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError("");
      try {
        const snap = await getDocs(usersCol);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const admin = list.filter((x) => x.role === "admin").length;
        const coach = list.filter((x) => x.role === "coach").length;
        const client = list.filter((x) => x.role === "client").length;

        setCounts({ total: list.length, admin, coach, client });

        // הרשמות לפי יום (אם יש createdAt / Timestamp)
        const now = new Date();
        const days = Array.from({ length: 7 }).map((_, idx) => {
          const d = new Date(now);
          d.setDate(d.getDate() - (6 - idx));
          const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
          return { key, count: 0 };
        });

        list.forEach((u) => {
          const t = u?.createdAt?.toDate ? u.createdAt.toDate() : null;
          if (!t) return; // אין שדה => לא נספור
          const key = t.toISOString().slice(0, 10);
          const target = days.find((x) => x.key === key);
          if (target) target.count++;
        });

        setLast7Days(days);
      } catch (e) {
        console.error(e);
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [usersCol]);

  return (
    <div style={{ maxWidth: 980, margin: "40px auto", padding: 16 }}>
      <h2>📊 Reports</h2>
      <p style={{ color: "#666" }}>תמונת מצב כללית על משתמשים במערכת.</p>

      {error && (
        <div style={{ background: "#fee", border: "1px solid #f99", padding: 10, margin: "10px 0" }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <Stat title="Total users" value={counts.total} />
            <Stat title="Admins" value={counts.admin} />
            <Stat title="Coaches" value={counts.coach} />
            <Stat title="Clients" value={counts.client} />
          </section>

          <h3 style={{ marginTop: 28 }}>Signups – last 7 days</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 160 }}>
            {last7Days.map((d) => (
              <div key={d.key} style={{ textAlign: "center", width: 50 }}>
                <div
                  title={`${d.key}: ${d.count}`}
                  style={{
                    height: 8 + d.count * 20,
                    background: "#4f46e5",
                    borderRadius: 4,
                    marginBottom: 6,
                    transition: "height .2s",
                  }}
                />
                <div style={{ fontSize: 12 }}>{d.key.slice(5)}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{d.count}</div>
              </div>
            ))}
          </div>
          {last7Days.every((x) => x.count === 0) && (
            <p style={{ color: "#999" }}>
              לא נמצאו הרשמות עם{" "}
              <code>createdAt</code>. אם תרצה, נוכל לעדכן את ההרשמה כך שתוסיף שדה זה.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={{ border: "1px solid #eee", padding: 14, borderRadius: 8, background: "#fafafa" }}>
      <div style={{ color: "#666", fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
