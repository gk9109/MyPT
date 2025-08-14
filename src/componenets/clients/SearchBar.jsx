import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config"; // adjust path if needed
import { collection, getDocs } from "firebase/firestore";

export default function SearchBar({ onSearch, setResults }) {
  const [query, setQuery] = useState("");
  const [allCoaches, setAllCoaches] = useState([]);
  const [allResults, setAllResults] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = e.target.elements.searchInput.value.trim();
    if (onSearch) onSearch(q);
  };

  useEffect(() => {
    // an empty array [] means "do this task only once, when I first arrive."
    // leaving out the array entirely means "do this task every time I change or update."
    // An array with variables [variable1, variable2] means "do this task whenever variable1 or variable2 changes"
    (async () => {
      const coachCollRef = collection(db, "users"); // collection with coaches
      const snap = await getDocs(coachCollRef);     // <-- get MANY docs
      const coachList = snap.docs.map((d) => ({ id: d.id, ...d.data() })); // to plain objects
      setAllCoaches(coachList);
    })();
  }, []);

  // Live filter with a small debounce
  useEffect(() => {
    const t = setTimeout(() => {
      const text = query.trim().toLowerCase();
      if (!text) return setResults([]);

      // NOTE: Firestore fields use firstName/lastName (camelCase)
      const filtered = allCoaches.filter((u) =>
        `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().startsWith(text)
      );
      setResults(filtered);
      setAllResults(filtered);
    }, 300);
    return () => clearTimeout(t);
  }, [query, allCoaches]);

  return (
    <form className="d-flex position-relative mb-3" onSubmit={handleSubmit} style={{ minWidth: 320 }}>
      <input
        type="search"
        name="searchInput"
        className="form-control me-2"
        placeholder="Search coaches..."
        aria-label="Search"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-outline-success" type="submit">Search</button>

      {/* Simple results dropdown (Bootstrap-ish) */}
      {/* {query && allResults.length > 0 && (
        <ul className="dropdown-menu show" style={{ top: "100%", left: 0 }}>
          {allResults.map((u) => (
            <li key={u.id}>
              <button type="button" className="dropdown-item">
                {(u.firstName || "") + " " + (u.lastName || "")}
              </button>
            </li>
          ))}
        </ul>
      )} */}
      {query && allResults.length === 0 && (
        <div className="dropdown-menu show text-muted" style={{ top: "100%", left: 0 }}>
          <div className="dropdown-item-text">No matches</div>
        </div>
      )}
    </form>
  );
}
