// src/components/search/SearchBar.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function SearchBar({ setResults }) {
  const [query, setQuery] = useState("");
  const [coaches, setCoaches] = useState([]);

  //once the page loads, fetch every coach from db
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "coaches"));
      setCoaches(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const text = query.trim().toLowerCase();
      if (!text) return setResults?.([]);
      const filtered = coaches.filter(u =>
        `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().startsWith(text)
      );
      setResults?.(filtered);
    }, 250);
    return () => clearTimeout(t);
  }, [query, coaches, setResults]);

  return (
    <form className="d-flex position-relative mb-3" onSubmit={e => e.preventDefault()} style={{ minWidth: 320 }}>
      <input
        type="search"
        name="searchInput"
        className="form-control me-2"
        placeholder="Search coaches..."
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-outline-success" type="submit">Search</button>
    </form>
  );
}
