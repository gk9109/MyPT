import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import ClientList from "../../componenets/coach/ClientList";
import SearchBar from "../../componenets/coach/SearchBar";

export default function ClientsPage() {
  const [allClients, setAllClients] = useState([]);
  const [visibleClients, setVisibleClients] = useState([]);

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
    if (user?.uid) fetchSubs();
  }, [user]);

  return (
    <>
      <SearchBar allClients={allClients}  setVisibleClients={setVisibleClients}/>
      <ClientList clients={visibleClients} />
    </>
  );
}
