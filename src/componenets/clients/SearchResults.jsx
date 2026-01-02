import CoachCard from "./CoachCard";
import DataGate from "../shared/DataGate";

// -----------------------------------------------------------------------------
// What this component does:
// -> Receives an array of coaches (results) from a parent component.
// -> Handles all UI states for displaying search results:
//    - loading / empty / valid data (via DataGate)
//    - "no results found" message
//    - list of CoachCard components
//
// Where it's used:
// -> Rendered by the coaches search page (parent controls the search logic).
// -> This component is ONLY responsible for presentation, not data fetching.
//
// Responsibility split:
// -> Parent: fetches + filters data, passes results
// -> SearchResults: decides how to display those results
// -----------------------------------------------------------------------------

export default function SearchResults({ results }) {
  return (
    // DataGate handles generic data states:
    // -> loading
    // -> null / undefined
    // -> empty arrays
    // This keeps this component focused only on UI logic.
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
