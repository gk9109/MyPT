import React, { useEffect, useState } from 'react'
import { useAuth } from '../../firebase/AuthContext'
import CoachCard from '../../componenets/clients/CoachCard'
import { client_CoachList } from '../../Services/subscriptions'
import  Loader  from '../../componenets/shared/Loader'
import DataGate from '../../componenets/shared/DataGate'

// CoachListPage
// What this component does:
// -> Displays a list of coaches available to the logged-in client.
// -> Fetches the client’s associated / available coaches from Firestore (via Services).
// -> Sorts coaches alphabetically for consistent display.
// -> Renders one CoachCard per coach.
//
// Where it's used:
// -> Client-side page (coach discovery / coach list).
// -> Accessible only to logged-in clients.
//
// Notes:
// -> Firestore logic is abstracted into Services/subscriptions.js.
// -> Loading and empty states are handled via DataGate.
export default function CoachListPage() {
  // List of coaches fetched from Firestore
  const [allCoaches, setAllCoaches] = useState([]);
  // Page-level loading flag
  const [loading, setLoading] = useState(true); 
  // Logged-in user from AuthContext
  const { user } = useAuth(); 

  // Fetch coaches once when the page mounts (or when user changes)
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        // client_CoachList(uid)
        // -> Service function that fetches coaches available to this client.
        // -> Returns: array of coach objects (plain JS objects from Firestore).
        const coaches = await client_CoachList(user.uid)

        // Sort coaches alphabetically by searchName (fallback to empty string)
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

  return (
    // DataGate:
    // -> Shows loader while "loading" is true.
    // -> Renders children only when data is ready.
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
