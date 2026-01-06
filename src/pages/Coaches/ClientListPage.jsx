import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import ClientList from "../../componenets/coach/ClientList";
import SearchBar from "../../componenets/coach/SearchBar";
import  Loader from '../../componenets/shared/Loader'

// ClientsPage
// What this component does:
// -> Coach-facing page that displays all active clients.
// -> Fetches active subscriptions from Firestore.
// -> Allows filtering clients using a search bar.
// -> Renders a list of ClientCards via ClientList.
//
// Where it's used:
// -> Coach routes/pages (clients management).
//
// Notes:
// -> Firestore query logic lives in this page (not a service).
// -> SearchBar only filters local state (no Firestore re-fetch).
export default function ClientsPage() {
  // All active clients fetched from Firestore
  const [allClients, setAllClients] = useState([]);
  // Clients currently visible after search/filter
  const [visibleClients, setVisibleClients] = useState([]);
  // Page-level loading flag
  const [loading, setLoading] = useState(true);
  // Logged-in coach from AuthContext
  const { user } = useAuth();

  // Fetch active client subscriptions once on page load
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        // query(collection, ...conditions)
        // -> Builds a Firestore query (does NOT fetch yet)
        const q = query(
          collection(db, "subscriptions"),
          where("coachUid", "==", user.uid),
          where("status", "==", "active")
        );
        // getDocs(query)
        // -> Executes the query and fetches matching documents
        // -> Returns: QuerySnapshot
        const snap = await getDocs(q);
        // Map Firestore docs into plain JS objects
        const data = snap.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
        
        // Sort alphabetically by client search name (once on load)
        const ordered = data.sort((a, b) =>
          (a.searchName || "").localeCompare(b.searchName || "")
        );
        // Store both full list and visible list
        setAllClients(ordered);
        setVisibleClients(ordered);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        // Data fetch finished
    setLoading(false);
      }
    };
    if (user) fetchSubs();
  }, [user]);

  // Show loader while data is loading
  if (loading) return <Loader />;
  
  return (
    <>
      {/* SearchBar:
        -> Filters clients locally (no Firestore calls)
        -> Updates visibleClients based on search input */}
      <SearchBar allClients={allClients}  setVisibleClients={setVisibleClients}/>
      {/* ClientList:
        -> Displays the filtered list of clients */}
      <ClientList clients={visibleClients} />
    </>
  );
}
