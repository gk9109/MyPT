import React, { useState } from "react";
import SearchBar from "../../componenets/clients/SearchBar";
import SearchResults from "../../componenets/clients/SearchResults";

// SearchPage
// What this component does:
// -> Client-facing page for searching coaches.
// -> Holds the search results state.
// -> Coordinates between SearchBar (input/search logic) and SearchResults (display).
//
// Where it's used:
// -> Client routes/pages (coach discovery).
//
// Notes:
// -> Search logic is handled inside SearchBar.
// -> This page only stores results and passes them down to SearchResults.
export default function SearchPage() {
  // Array of coaches returned from the search
  const [results, setResults] = useState([]);

  return (
    <div>
      {/* SearchBar:
        -> Handles user input and filtering logic.
        -> Updates results state via setResults */}
      <SearchBar setResults={setResults} />

      {/* SearchResults:
        -> Displays matching coaches based on results */}
      <SearchResults results={results} />
    </div>
  );
}
