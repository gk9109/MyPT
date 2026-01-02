import { useEffect, useState } from "react";

// What this component does:
// -> Provides a text-based search input for filtering a coach's subscribed clients.
// -> Filters the client list locally as the user types (debounced).
//
// Where it's used:
// -> Coach-facing pages that display a list of subscribed clients.
//
// Props:
// allClients (array, default = [])
// -> Full list of client objects available to the coach.
// -> Each client is expected to have a searchable field like "searchName".
//
// setVisibleClients (function)
// -> Setter provided by the parent.
// -> Used to update which clients are currently displayed based on search results.
//
// Notes:
// -> This component does NOT fetch data.
// -> All filtering is done locally for responsiveness.
// -> A small debounce is used to avoid filtering on every keystroke.
export default function SearchBar({ allClients = [], setVisibleClients }) {
  // Current text entered by the user in the search input
  const [queryText, setQueryText] = useState("");
  

  // Debounced search effect:
  // -> Runs when queryText or allClients changes
  // -> Waits 250ms after typing stops before filtering
  // -> Prevents unnecessary recalculations on rapid typing
  useEffect(() => {
    const t = setTimeout(() => {
        const text = queryText.trim().toLowerCase();
        // If search box is empty:
        // -> Reset list to all clients
        // -> Sort alphabetically by searchName for consistent display
        if(!text){
            setVisibleClients(
                [...allClients].sort((a, b) =>{
                    (a.searchName || "").localeCompare(b.searchName || "")
                })
            );
            return;
        };
        // Otherwise:
        // -> Filter clients whose searchName starts with the entered text
        const filtered = allClients.filter(s => (s.searchName || "").startsWith(text));
        setVisibleClients(filtered);
    }, 250);
    // Cleanup:
    // -> Clears the timeout if dependencies change
    // -> Prevents outdated searches from running
    return () => clearTimeout(t);
  }, [queryText, allClients, setVisibleClients]);

  return (
    <form
      className="d-flex position-relative mb-3"
      onSubmit={e => e.preventDefault()}
      style={{ minWidth: 320 }}
    >
      {/* Search input */}
      <input
        type="search"
        name="searchInput"
        className="form-control me-2"
        placeholder="Search subscribed clients..."
        autoComplete="off"
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
      />
      {/* Button kept for UI consistency (search is live) */}
      <button className="btn btn-outline-success" type="submit">Search</button>
    </form>
  );
}
