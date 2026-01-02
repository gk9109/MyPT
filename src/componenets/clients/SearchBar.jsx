import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

// SearchBar.jsx
// purpose:
// -> Loads the full list of coaches once from Firestore.
// -> Lets the user search in real-time (as they type) by a selected field (name/location).
// -> Sends the filtered results back to the parent via setResults().
//
// Where it's used:
// -> In a parent page/component that renders a coaches list/grid.
// -> Parent owns the displayed list state, SearchBar only updates it through setResults().
export default function SearchBar({ setResults }) {
  // Holds the original (unfiltered) list fetched from Firestore.
  const [allCoaches, setAllCoaches] = useState([]);
  // What the user typed into the search input.
  const [searchTerm, setSearchTerm] = useState("");
  // Which field we search by (name/location).
  const [filter, setFilter] = useState("name");

  // On mount:
  // -> Fetch all coaches from Firestore once
  // -> Store them in local state
  // -> Also tell the parent to display all coaches initially
  useEffect(() => {
    const fetchCoaches = async () => {
      const snapshot = await getDocs(collection(db, "coaches"));
      // Convert Firestore docs to plain JS objects (keep doc.id as "id")
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllCoaches(data);
      setResults(data); // show all by default
    };
    fetchCoaches();
  }, [setResults]);

  // Live filtering:
  // Runs whenever:
  // -> searchTerm changes (user types)
  // -> filter changes (user changes dropdown)
  // -> allCoaches changes (after initial fetch)
  //
  // Result:
  // -> compute a filtered array
  // -> pass it to parent using setResults(filtered)
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = allCoaches.filter((coach) => {
      if (filter === "name") {
        // "searchName" is usually a normalized/lowercased name field for easier search
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
        {/* <option value="price">Price</option> */}
      </select>
    </div>
  );
}
