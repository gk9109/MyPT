import { db } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { SUBS_COLLECTION, subId } from "../Models/subscriptions";

export async function subscribeToCoach({ coachUid, clientUid }) {
  let searchName = "";

  try {
    const ref = doc(db, SUBS_COLLECTION, subId(coachUid, clientUid));
    const snap = await getDoc(ref);

    // safely get client data if exists
    try {
      const clientRef = doc(db, "clients", clientUid);
      const clientSnap = await getDoc(clientRef);
      const data = clientSnap.data();

      if (data && typeof data.searchName === "string") {
        searchName = data.searchName.trim().replace(/\s+/g, " ").toLowerCase();
      }
    } catch (error) {
      console.log("Error fetching client data:", error);
    }

    // actually create/update the subscription doc
    await setDoc(
      ref,
      {
        coachUid,
        clientUid,
        status: "active",
        createdAt: snap.exists() ? snap.data().createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: clientUid,
        searchName,
      },
      { merge: true }
    );

    console.log("Subscription created successfully");
  } catch (error) {
    console.log("Error subscribing:", error);
  }
}



// cancel subscription (soft delete)
export async function unsubscribeFromCoach({ coachUid, clientUid }) {
  //doc ref
  const ref = doc(db, SUBS_COLLECTION, subId(coachUid, clientUid));

  // checking if doc exists, returns if not
  if (!(await getDoc(ref)).exists()){
    console.log("doc does not exist");
    return;
  }
  // update doc to change status from "active" to "canceled"
  await updateDoc(ref, { status: "canceled", updatedAt: serverTimestamp() });
  console.log("doc updated, subscription canceled")
}

// for a coach. Returns an array of that coach’s client UIDs.
export async function coach_ClientList(coachUid) {
   // setting a query for searching in collection
  const q = query(
    collection(db, SUBS_COLLECTION),
    where("coachUid", "==", coachUid),
    where("status", "==", "active")
  );
  
  // array of matching docs by query
  const snap = await getDocs(q);
  // return an array of obejects containing doc id's and data objects 
  return snap.docs.map(d => ({ ...d.data(), docId: d.id }));
}

// for a client. Returns an array of that client’s coach UIDs.
export async function client_CoachList(clientUid) {
  try {
    const q = query(
      collection(db, SUBS_COLLECTION),
      where("clientUid", "==", clientUid),
      where("status", "==", "active")
    );

    // getting subscription docs for coach uid
    const snap = await getDocs(q);

    // instead of keeping subs, fetch each coach directly
    // promise.all -> lets you run many async tasks in parallel (one per sub).
    const coaches = await Promise.all(
      snap.docs.map(async (subDoc) => {

        const { coachUid } = subDoc.data();          // extract coach id
        const coachRef = doc(db, "coaches", coachUid);
        const coachSnap = await getDoc(coachRef);
        // pure coach object
        return coachSnap.exists() ? { docId: coachSnap.id, ...coachSnap.data() } : null;
      })
    );

    // filter out nulls if any coach doc was missing
    return coaches.filter(Boolean);
  } catch (err) {
    console.error("Error fetching client coaches:", err);
    return [];
  }
}


export function getClient(clients = [], clientUid){
  const selectedClient = clients.find(c => c.clientUid === clientUid) || null; 
  return selectedClient;
  
}
