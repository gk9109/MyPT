import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";

// What this component does:
// -> Displays a single client as a card for the coach.
// -> Shows basic client info (name, status, contact details, dates).
// -> Allows the coach to:
//    - select a client and open their profile
//    - start a chat with the client
//
// Where it's used:
// -> In coach-facing pages that list all assigned clients.
//
// Props:
// client (object)
// -> Client data fetched from Firestore.
// -> Expected to include fields like:
//    { uid / clientUid, firstName, lastName, searchName, email, phone, status, createdAt, updatedAt }
//
// Data flow & state usage:
// -> Selected client is stored in global AuthContext
// -> Also persisted in localStorage to survive page refreshes
export default function ClientCard({ client }) {
  const navigate = useNavigate();
  const { setSelectedClient, user } = useAuth(); 
  // Guard: component should not render without valid client data
  if (!client) return "no clients";
  console.log(client);

  // Select client:
  // -> Save client in global context for easy access across pages
  // -> Persist in localStorage so refresh doesn't lose selection
  // -> Navigate to client profile page
  const onSelect = () => {
    setSelectedClient(client);
    localStorage.setItem("selectedClient", JSON.stringify(client));
    navigate("/client-profile");
  }

  // Open chat with client:
  // -> Same selection logic as onSelect
  // -> Build subscriptionId using pattern: coachUid_clientUid
  // -> Navigate to chat route
  const onChat = () => {
    setSelectedClient(client);
    localStorage.setItem("selectedClient", JSON.stringify(client));
    // subscription ID pattern: coachUid_clientUid
    const subscriptionId = `${user.uid}_${clientUid}`;
    navigate(`/chat/${subscriptionId}`);
  };

  // Destructure client fields for easier use in JSX
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

  // Resolve a display-friendly name:
  // -> Prefer normalized searchName if exists
  // -> Otherwise combine first + last name
  // -> Fallback to "(Unnamed)" if nothing exists
  const name = searchName || `${firstName || ""} ${lastName || ""}`.trim() || "(Unnamed)";

  // Convert Firestore Timestamp or Date into readable string
  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.seconds ? new Date(ts.seconds * 1000) : ts;
    return date.toLocaleDateString();
  };

  return (
    <div className="card shadow-sm h-100" id="ClientCrad">
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
            phone: {phone}
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
          onClick={() => onChat()}
          >
            Chat
          </button>
          <button
            className="btn btn-sm btn-primary ms-2"
            onClick={() => onSelect()}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
