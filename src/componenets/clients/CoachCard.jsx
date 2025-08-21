import React from "react";
import { subscribeToCoach, unsubscribeFromCoach } from '../../Services/subscriptions'
import { useAuth } from "../../firebase/AuthContext";

export default function CoachCard({ coach, onView }) {
  const { user } = useAuth()

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

  // handle Firestore Timestamp or plain date/string
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
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => subscribeToCoach(coach.uid, user.uid)}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
