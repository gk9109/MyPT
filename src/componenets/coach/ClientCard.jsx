import React from "react";

export default function ClientCard({ client, onSelect }) {
  if (!client) return null;

  const {
    searchName,
    firstName,
    lastName,
    email,
    phone,
    uid,
    clientUid,
    status,
    createdAt,
    updatedAt,
  } = client;

  const name =
    searchName || `${firstName || ""} ${lastName || ""}`.trim() || "(Unnamed)";

  // format Firestore timestamp → readable date
  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.seconds ? new Date(ts.seconds * 1000) : ts;
    return date.toLocaleDateString();
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{name}</h5>
          {status && (
            <span
              className={`badge ${
                status === "active" ? "bg-success" : "bg-secondary"
              }`}
            >
              {status}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="mb-2 text-muted small">
          <i className="bi bi-hash me-1" />
          <strong>UID:</strong> {clientUid || uid}
        </div>

        {email && (
          <div className="mb-1 text-muted small">
            <i className="bi bi-envelope me-1" />
            {email}
          </div>
        )}
        {phone && (
          <div className="mb-1 text-muted small">
            <i className="bi bi-telephone me-1" />
            {phone}
          </div>
        )}

        {createdAt && (
          <div className="mb-1 text-muted small">
            <i className="bi bi-calendar me-1" />
            Joined: {formatDate(createdAt)}
          </div>
        )}

        {updatedAt && (
          <div className="mb-3 text-muted small">
            <i className="bi bi-clock-history me-1" />
            Updated: {formatDate(updatedAt)}
          </div>
        )}

        {/* Actions */}
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onSelect?.(client)}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
