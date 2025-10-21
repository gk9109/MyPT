import React, { useEffect, useState } from 'react'
import { useAuth } from '../../firebase/AuthContext'
import CoachCard from '../../componenets/clients/CoachCard'
import { client_CoachList } from '../../Services/subscriptions'

export default function CoachListPage() {
  const [allCoaches, setAllCoaches] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCoaches = async () => {
      if (!user) return
      try {
        // Fetch all active coaches for this client (from subscriptions collection)
        const coaches = await client_CoachList(user.uid)

        // Sort alphabetically by searchName (if available)
        const ordered = (coaches || []).sort((a, b) =>
          (a.searchName || "").localeCompare(b.searchName || "")
        )

        setAllCoaches(ordered)
      } catch (error) {
        console.error("Error fetching client’s coaches:", error)
      }
    }

    fetchCoaches()
  }, [user])

  return (
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
  )
}
