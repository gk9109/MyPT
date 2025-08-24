import ClientCard from "./ClientCard";

export default function ClientList({ clients = [], onSelect }) {
  if (!clients.length) return <p>No clients found.</p>;

  return (
    <div className="row g-3">
      {clients.map(client => (
        <div key={client.docId || client.uid} className="col-md-4">
          <ClientCard client={client} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
}
