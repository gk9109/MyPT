import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function SearchBar({ setResults }) {
  const [query, setQuery] = useState("");
  const [coaches, setCoaches] = useState([]);
  const [filterType, setFilterType] = useState("none");
  const [filterValue, setFilterValue] = useState("");

  // Fetch all coaches from Firestore once
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "coaches"));
      setCoaches(snap.docs.map(d => ({ docId: d.id, ...d.data() })));
    })();
  }, []);

  // Reactive filtering
  useEffect(() => {
  const t = setTimeout(() => {
    let filtered = coaches;

    // --- 1. Name filter ---
    const text = query.trim().toLowerCase();
    if (text) {
      filtered = filtered.filter(u => {
        const full = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
        return full.includes(text);
      });
    }

    // --- 2. Location filter ---
    if (filterType === "location" && filterValue) {
      filtered = filtered.filter(u =>
        (u.location ?? "").toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // --- 3. (Future) Price range or other filters ---
    if (filterType === "price" && filterValue) {
      const [min, max] = filterValue.split("-").map(Number);
      filtered = filtered.filter(u => {
        const price = u.price ?? 0;
        return (!min || price >= min) && (!max || price <= max);
      });
    }

    // --- 4. If no filters at all, show nothing ---
    const noFilters = !text && !filterValue;
    setResults?.(noFilters ? [] : filtered);
  }, 250);

  return () => clearTimeout(t);
}, [query, coaches, setResults, filterType, filterValue]);


  return (
    <div className="mb-3">
      {/* Search input */}
      <input
        type="search"
        className="form-control mb-2"
        placeholder="Search coaches..."
        autoComplete="off"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* Dynamic filter controls */}
      <div className="d-flex gap-2">
        <select
          className="form-select"
          style={{ maxWidth: 150 }}
          value={filterType}
          onChange={e => {
            setFilterType(e.target.value);
            setFilterValue(""); // reset when changing type
          }}
        >
          <option value="none">No filter</option>
          <option value="location">Location</option>
          <option value="price">Price range</option>
        </select>

        {filterType === "location" && (
          <input
            type="text"
            className="form-control"
            placeholder="Type location..."
            value={filterValue}
            onChange={e => setFilterValue(e.target.value)}
            style={{ maxWidth: 200 }}
          />
        )}

        {filterType === "price" && (
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 50-100"
            value={filterValue}
            onChange={e => setFilterValue(e.target.value)}
            style={{ maxWidth: 200 }}
          />
        )}
      </div>
    </div>
  );
}
