// ----------------------------------------------------------
// This component receives an array of coaches (results)
// from the parent and displays them as a list of CoachCards.
// If there are no matches, it shows a simple "No coaches found" message.
// ----------------------------------------------------------

import CoachCard from "./CoachCard";
import DataGate from "../shared/DataGate";

export default function SearchResults({ results }) {
  return (
    <DataGate data={results}>
      {results.length === 0 ? (
        <p className="mt-3">No coaches found.</p>
      ) : (
        <div className="d-flex flex-wrap gap-3 mt-3">
          {results.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      )}
    </DataGate>
  );
}
