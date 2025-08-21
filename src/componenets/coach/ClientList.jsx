// src/components/clients/ClientList.jsx
import ClientCard from "./ClientCard";

export default function ClientList({ clients = [], onSelect }) {
  if (!clients.length) return <p>No clients found.</p>;

  const sorted = [...clients].sort((a, b) =>
    (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName)
  );

  return (
    <div className="row g-3">
      {sorted.map(client => (
        <div key={client.uid || client.id} className="col-md-4">
          <ClientCard client={client} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
}
