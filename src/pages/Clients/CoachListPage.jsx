import React, { useEffect, useState } from 'react'
import { useAuth } from '../../firebase/AuthContext'
import CoachCard from '../../componenets/clients/CoachCard'
import { client_CoachList } from '../../Services/subscriptions'
import  Loader  from '../../componenets/shared/Loader'
import DataGate from '../../componenets/shared/DataGate'

export default function CoachListPage() {
  const [allCoaches, setAllCoaches] = useState([]); // state to store all coaches from firebase collection
  const [loading, setLoading] = useState(true); 
  const { user } = useAuth(); // current logged-ib user

  // Happens once on mount, fetching and sorting all coaches to do later displayed in a list on client side
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        // Fetch all active coaches for this client (from subscriptions collection)
        const coaches = await client_CoachList(user.uid)

        // Sort alphabetically by searchName (if available)
        const ordered = (coaches || []).sort((a, b) =>
          (a.searchName || "").localeCompare(b.searchName || "")
        )

        setAllCoaches(ordered)
      } catch (error) { // error handling
        console.error("Error fetching client’s coaches:", error)
      } finally {
        setLoading(false);
      }
    }
    fetchCoaches()
  }, [user])

  // if(loading) return <Loader />

  return (
    // DataGate shows a spinner while loading is true,
    // and only renders this list once the coaches data is ready
    <DataGate data={allCoaches} loading={loading}> 
      <div className="d-flex flex-column align-items-center gap-3">
        {/* If no coaches are found, display a fallback message */}
        {allCoaches.length === 0 ? (
          <p>No coaches found.</p>
        ) : (
          // Otherwise, render a grid of CoachCards
          allCoaches.map(coach => (
            <div key={coach.uid} className="col-md-12">
              <CoachCard coach={coach} />
            </div>
          ))
        )}
      </div>
    </DataGate>
  )
}
