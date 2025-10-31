import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import ClientList from "../../componenets/coach/ClientList";
import SearchBar from "../../componenets/coach/SearchBar";
import  Loader from '../../componenets/shared/Loader'

// this page displays a search bar componenet and the list of results below
// currently showing a coach all active subscriptions -> clients,
// and lets you filter from that list using the search bar
export default function ClientsPage() {
  const [allClients, setAllClients] = useState([]);
  const [visibleClients, setVisibleClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  

  // fetch data once on page load
  // sets an alphabetically ordered listed of active subscription clients
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const q = query(
          collection(db, "subscriptions"),
          where("coachUid", "==", user.uid),
          where("status", "==", "active")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
        
        // sort alphabetically by searchName once on load
        const ordered = data.sort((a, b) =>
          (a.searchName || "").localeCompare(b.searchName || "")
        );
        setAllClients(ordered);
        setVisibleClients(ordered);
      } catch (error) {
        console.error(error);
      }
    };
    if (user) fetchSubs();
    console.log("done fetching")
    setLoading(false);
  }, [user]);

  if (loading) return <Loader />;
  
  return (
    <>
      <SearchBar allClients={allClients}  setVisibleClients={setVisibleClients}/>
      <ClientList clients={visibleClients} />
    </>
  );
}
