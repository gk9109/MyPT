// SearchPage.jsx
// ----------------------------------------------------------
// This is the main page for clients to search for coaches.
// It holds the search results state and connects the
// SearchBar (input + filter) with SearchResults (output).
// ----------------------------------------------------------

import React, { useState } from "react";
import SearchBar from "../../componenets/clients/SearchBar";
import SearchResults from "../../componenets/clients/SearchResults";

export default function SearchPage() {
  // stores the array of results returned from the SearchBar
  const [results, setResults] = useState([]);

  return (
    <div>
      {/* search section (input + filter + button) */}
      <SearchBar setResults={setResults} />

      {/* results section (cards of matching coaches) */}
      <SearchResults results={results} />
    </div>
  );
}
