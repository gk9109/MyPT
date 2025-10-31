// SearchBar.jsx
// ----------------------------------------------------------
// This version loads all coaches once on mount
// and then filters them locally in real time as the user types.
// No need for a "Search" button anymore.
// ----------------------------------------------------------

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function SearchBar({ setResults }) {
  // all coaches fetched from Firestore
  const [allCoaches, setAllCoaches] = useState([]);
  // user input
  const [searchTerm, setSearchTerm] = useState("");
  // selected filter type
  const [filter, setFilter] = useState("name");

  // ----------------------------------------------------------
  // Fetch all coaches on first load (runs once)
  // ----------------------------------------------------------
  useEffect(() => {
    const fetchCoaches = async () => {
      const snapshot = await getDocs(collection(db, "coaches"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllCoaches(data);
      setResults(data); // show all by default
    };
    fetchCoaches();
  }, [setResults]);

  // ----------------------------------------------------------
  // Whenever user types or changes filter,
  // run a local filter on the already loaded data
  // ----------------------------------------------------------
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = allCoaches.filter((coach) => {
      if (filter === "name") {
        return coach.searchName?.toLowerCase().includes(term);
      } else if (filter === "location") {
        return coach.location?.toLowerCase().includes(term);
      } else if (filter === "price") {
        // placeholder until price field exists
        return true;
      }
      return false;
    });

    setResults(filtered);
  }, [searchTerm, filter, allCoaches, setResults]);

  return (
    // Flex container keeps all elements on one line
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* text input for live search */}
      <input
        type="text"
        placeholder={`Search by ${filter}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control"
        style={{ maxWidth: "250px" }}
      />

      {/* dropdown to choose what to filter by */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="form-select"
        style={{ maxWidth: "150px" }}
      >
        <option value="name">Name</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
      </select>
    </div>
  );
}
