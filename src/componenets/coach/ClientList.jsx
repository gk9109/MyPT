import React, { useState } from "react";

export default function ClientList() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", query);
    // later: query Firestore for clients matching this
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Clients</h2>

      <div className="input-group mb-3" style={{ maxWidth: "400px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search clients by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* here you’ll later render the search results */}
    </div>
  );
}
