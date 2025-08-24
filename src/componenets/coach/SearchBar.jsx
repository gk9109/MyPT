import { useEffect, useState } from "react";

export default function SearchBar({ allClients = [], setVisibleClients }) {
  const [queryText, setQueryText] = useState("");

  // runs once the page poads
  useEffect(() => {
    //handles text based search
    const t = setTimeout(() => {
        const text = queryText.trim().toLowerCase();
        if(!text){
            setVisibleClients(
                [...allClients].sort((a, b) =>{
                    (a.searchName || "").localeCompare(b.searchName || "")
                })
            );
            return;
        };

        const filtered = allClients.filter(s => (s.searchName || "").startsWith(text));
        setVisibleClients(filtered);
    }, 250);

    return () => clearTimeout(t);
    // runs the code above on page load and every time any of these change: 
  }, [queryText, allClients, setVisibleClients]);

  return (
    <form
      className="d-flex position-relative mb-3"
      onSubmit={e => e.preventDefault()}
      style={{ minWidth: 320 }}
    >
      <input
        type="search"
        name="searchInput"
        className="form-control me-2"
        placeholder="Search subscribed clients..."
        autoComplete="off"
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
      />
      <button className="btn btn-outline-success" type="submit">Search</button>
    </form>
  );
}
