import ClientCard from "./ClientCard";

// -----------------------------------------------------------------------------
// What this component does:
// -> Displays a grid/list of clients that belong to a coach.
// -> Renders one ClientCard per client.
//
// Where it's used:
// -> Coach-facing pages that show all subscribed/assigned clients.
//
// Props:
// clients (array, default = [])
// -> Array of client objects fetched from Firestore.
// -> Each client object is passed directly to ClientCard.
//
// Notes:
// -> This is a presentation-only component.
// -> It does not fetch data or manage global state.
// -----------------------------------------------------------------------------

export default function ClientList({ clients = [] }) {
  // Guard:
  // -> If the coach has no clients yet, show a simple empty-state message
  if (!clients.length) return <p>No clients found.</p>;

  return (
    <div className="row g-3">
      {/* Render one ClientCard per client */}
      {clients.map((client) => (
        <div
          key={client.docId || client.uid}
          className="col-md-4"
        >
          <ClientCard client={client} />
        </div>
      ))}
    </div>
  );
}
