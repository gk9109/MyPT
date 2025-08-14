import React, { useState } from 'react'
import SearchBar from '../../componenets/clients/SearchBar'
import SearchResults from '../../componenets/clients/SearchResults'

export default function SearchPage() {
    const [results, setResults] = useState([]);

  return (
    <>
        <SearchBar setResults={setResults}/>
        <SearchResults results={results}/>
    </>
  )
}
