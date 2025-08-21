import React from "react";

export default function ClientCard({ client, onSelect }) {
  if (!client) return null;

  const { firstName = "", lastName = "", email = "", uid = "" } = client;
  const name = `${firstName} ${lastName}`.trim() || "(Unnamed)";

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title mb-0">{name}</h5>
          {email && <div className="text-muted small">{email}</div>}
          <div className="small text-muted"><i className="bi bi-hash me-1" /> {uid}</div>
        </div>
        <button className="btn btn-sm btn-primary" onClick={() => onSelect?.(client)}>
          Select
        </button>
      </div>
    </div>
  );
}
