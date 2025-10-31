// SearchResults.jsx
// ----------------------------------------------------------
// This component receives an array of coaches (results)
// from the parent and displays them as a list of CoachCards.
// If there are no matches, it shows a simple "No coaches found" message.
// ----------------------------------------------------------

import React from "react";
import CoachCard from "./CoachCard";

export default function SearchResults({ results }) {
  // if there are no results, show a message
  if (!results || results.length === 0)
    return <p className="mt-3">No coaches found.</p>;

  // otherwise, map through results and display each coach card
  return (
    <div className="d-flex flex-wrap gap-3 mt-3">
      {results.map((coach) => (
        <CoachCard key={coach.id} coach={coach} />
      ))}
    </div>
  );
}
