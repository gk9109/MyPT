import React, { useEffect, useState } from "react";
import { subscribeToCoach, unsubscribeFromCoach } from '../../Services/subscriptions'
import { useAuth } from "../../firebase/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { SUBS_COLLECTION, subId } from "../../Models/subscriptions";

export default function CoachCard({ coach, onView }) {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!coach) return null;

  const {
    firstName = "",
    lastName = "",
    location = "",
    email = "",
    phone = "",
    role = "",
    uid = "",
    createdAt,
  } = coach;

  // check subscription status on mount / when user or coach changes
  useEffect(() => {
    const checkSub = async () => {
      if (!user?.uid || !uid) return setLoading(false);
      try {
        const ref = doc(db, SUBS_COLLECTION, subId(uid, user.uid));
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().status === "active") {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
        setIsSubscribed(false);
      }
      setLoading(false);
    };
    checkSub();
  }, [user?.uid, uid]);

  // handle subscribe/unsubscribe
  const toggleSubscription = async () => {
    if (!user?.uid || !uid) return;
    try {
      if (isSubscribed) {
        await unsubscribeFromCoach({ coachUid: uid, clientUid: user.uid });
        setIsSubscribed(false);
      } else {
        await subscribeToCoach({ coachUid: uid, clientUid: user.uid });
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error("Error toggling subscription:", err);
    }
  };

  // format createdAt
  let created = "";
  try {
    const d =
      createdAt?.seconds
        ? new Date(createdAt.seconds * 1000)
        : createdAt instanceof Date
        ? createdAt
        : createdAt
        ? new Date(createdAt)
        : null;
    created = d ? d.toLocaleDateString() : "";
  } catch (_) {}

  const name = `${firstName} ${lastName}`.trim() || "(Unnamed)";
  const initials =
    (firstName?.[0] || "").toUpperCase() + (lastName?.[0] || "").toUpperCase();

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex">
        {/* Avatar */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{ width: 56, height: 56, background: "#eef2ff", fontWeight: 600 }}
        >
          {initials || "?"}
        </div>

        <div className="flex-grow-1">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0">{name}</h5>
            {role && <span className="badge bg-primary">{role}</span>}
          </div>

          {location && <div className="text-muted small mt-1">{location}</div>}

          <div className="mt-2">
            {email && (
              <div className="small">
                <i className="bi bi-envelope me-1" /> {email}
              </div>
            )}
            {phone && (
              <div className="small">
                <i className="bi bi-telephone me-1" /> {phone}
              </div>
            )}
            {uid && (
              <div className="small text-muted">
                <i className="bi bi-hash me-1" /> {uid}
              </div>
            )}
            {created && (
              <div className="small text-muted">
                <i className="bi bi-calendar me-1" /> Joined {created}
              </div>
            )}
          </div>

          <div className="mt-3 d-flex gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onView?.(coach)}
            >
              View
            </button>
            {!loading && (
              <button
                className={`btn btn-sm ${isSubscribed ? "btn-danger" : "btn-outline-secondary"}`}
                onClick={toggleSubscription}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
