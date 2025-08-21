// src/pages/coach/ClientsPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { coach_ClientList } from "../../Services/subscriptions";
import ClientList from "../../componenets/coach/ClientList"

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      const list = await coach_ClientList(user.uid);
      setClients(list);
    })();
  }, [user]);

  const filtered = clients.filter(c =>
    `${c.firstName || ""} ${c.lastName || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Clients</h2>

      {/* Search bar */}
      <form
        className="d-flex mb-4"
        onSubmit={e => e.preventDefault()}
        style={{ maxWidth: 400 }}
      >
        <input
          type="search"
          placeholder="Search a client..."
          className="form-control me-2"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="btn btn-outline-primary" type="submit">
          Search
        </button>
      </form>

      {/* Clients list */}
      {filtered.length > 0 ? (
        <ClientList clients={filtered} />
      ) : (
        <div className="alert alert-info">No clients found.</div>
      )}
    </div>
  );
}
