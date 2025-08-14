export default function SearchResults({ results = [] }) {
  if (!results.length) return null;

  return (
    <div className="d-flex flex-column align-items-center">
      {results.map((u, i) => (
        <div
          key={i}
          className="card p-3 mb-3"
          style={{ width: "100%", maxWidth: "500px" }}
        >
          {/* Your original card content */}
          <h5>{`${u.firstName || ""} ${u.lastName || ""}`}</h5>
          {u.location && <p>{u.location}</p>}
          <p>{u.email}</p>
          <p>{u.phone}</p>
          <p>{u.uid}</p>
          <p>Joined {new Date(u.createdAt.seconds * 1000).toLocaleDateString()}</p>

          <div>
            <button className="btn btn-primary me-2">View</button>
            <button className="btn btn-outline-secondary">Subscribe</button>
          </div>
        </div>
      ))}
    </div>
  );
}
