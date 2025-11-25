import { useState, useEffect, useRef } from "react";
import { searchProductsByName } from "../../Services/foodApi";
import Loader from "../shared/Loader";

// A reusable food search component with live dropdown suggestions.
// Accepts an "onSelect" prop that is called when the user picks a product.
export default function FoodSearchBar({ onSelect }) {
  // 🔹 Local state
  const [query, setQuery] = useState(""); // user input from the search bar
  const [results, setResults] = useState([]); // fetched list of food items
  const [loading, setLoading] = useState(false); // true when waiting for API response
  const [showDropdown, setShowDropdown] = useState(false); // controls dropdown visibility

  //  Reference to the wrapper (used to detect clicks outside the dropdown)
  const wrapperRef = useRef(null);

  //  1. Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // if clicked element is not inside this component → close dropdown
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // cleanup listener when component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  2. Debounced search logic

    useEffect(() => {
        // If query is empty → clear results and skip API call
        if (!query.trim()) {
          setResults([]);
          return;
        }

        // Wait 400ms after user stops typing before making the API request
        // This prevents excessive requests on every keystroke.
        const timeout = setTimeout(async () => {
          setLoading(true); // show loader
          const res = await searchProductsByName(query); // call our service function
          setResults(res); // store results in state
          setLoading(false); // hide loader
          setShowDropdown(true); // open dropdown with results
        }, 400);

        // If user types again within 400ms → cancel previous timeout
        return () => clearTimeout(timeout);
    } ,    [query]);

  //  3. Handle user selecting a product
  const handleSelect = (product) => {
    onSelect(product); // send selected item to parent
    setQuery(""); // clear search field
    setResults([]); // clear results
    setShowDropdown(false); // close dropdown
  };

  //  4. Render component
  return (
    <div ref={wrapperRef} className="position-relative mb-3">
      {/* Input field */}
      <input
        type="text"
        placeholder="Search for food or product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="form-control"
      />

      {/* Loader (appears while fetching data) */}
      {loading && (
        <div className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted small">
          <Loader />
        </div>
      )}

      {/* Dropdown with results */}
      {showDropdown && results.length > 0 && (
        <ul
          className="list-group position-absolute w-100 mt-1 shadow-sm"
          style={{
            zIndex: 10,
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          {results.map((item) => (
            <li
              key={item.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelect(item)}
            >
              {/* Product name, brand, and calories */}
              <div>
                <strong>{item.name}</strong>{" "}
                <small className="text-muted">
                  {item.brand && `(${item.brand})`}
                </small>
                <div className="small text-muted">
                  {item.calories} kcal / 100g
                </div>
              </div>

              {/* Optional product image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  width="40"
                  height="40"
                  className="rounded"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
