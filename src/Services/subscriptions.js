import { db } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";

// SERVICES: subscriptions.js
// -> Firestore helper functions for coach-client subscriptions.
// -> A subscription represents a relationship between ONE coach and ONE client.
// -> Other features (plans, chat, progress access) depend on this relationship.

// Name of the Firestore collection 
export const SUBS_COLLECTION = "subscriptions";

// subId
// -> Generates a deterministic subscription document id.
// -> Combines coachUid + clientUid so:
//    -> only ONE subscription exists per pair
//    -> both sides always reference the same doc
export const subId = (coachUid, clientUid) => `${coachUid}_${clientUid}`;

// subscribeToCoach
// -> Creates or re-activates a subscription between a coach and a client.
// -> Writes to: subscriptions/{coachUid_clientUid}
// -> Uses merge:true so re-subscribing does not overwrite existing data.
export async function subscribeToCoach({ coachUid, clientUid }) {
  let searchName = "";
  
  try {
    const ref = doc(db, SUBS_COLLECTION, subId(coachUid, clientUid));
    const snap = await getDoc(ref);

    // Fetch client data in order to build a searchable name string
    // -> Used later for filtering/searching subscriptions
    try {
      const clientRef = doc(db, "clients", clientUid);
      const clientSnap = await getDoc(clientRef);
      const data = clientSnap.data();

      // Normalize name: trim, collapse spaces, lowercase
      if (data && typeof data.searchName === "string") {
        searchName = data.searchName.trim().replace(/\s+/g, " ").toLowerCase();
      }
    } catch (error) {
      console.log("Error fetching client data:", error);
    }

    // Create or update the subscription document
    await setDoc(
      ref,
      {
        coachUid,
        clientUid,
        status: "active", // subscription is active
        createdAt: snap.exists() ? snap.data().createdAt : serverTimestamp(), // keep original creation time
        updatedAt: serverTimestamp(), // always update timestamp
        createdBy: clientUid,
        searchName,
      },
      { merge: true } // prevent overwriting other fields
    );

    console.log("Subscription created successfully");
  } catch (error) {
    console.log("Error subscribing:", error);
  }
}

// unsubscribeFromCoach
// -> Soft-deletes a subscription.
// -> Does NOT remove the document (history is preserved).
// -> Updates status from "active" -> "canceled".
export async function unsubscribeFromCoach({ coachUid, clientUid }) {
  const ref = doc(db, SUBS_COLLECTION, subId(coachUid, clientUid));

  // If subscription does not exist, exit early
  if (!(await getDoc(ref)).exists()){
    console.log("doc does not exist");
    return;
  }
  //Soft cancel ->  update doc to change status from "active" to "canceled"
  await updateDoc(ref, { status: "canceled", updatedAt: serverTimestamp() });
  console.log("doc updated, subscription canceled")
}

// coach_ClientList
// -> Fetches all ACTIVE clients of a specific coach.
// -> Used in coach dashboards.
// -> Returns subscription docs with client info inside.
export async function coach_ClientList(coachUid) {
  // Query subscriptions by coach uid + active status
  const q = query(
    collection(db, SUBS_COLLECTION),
    where("coachUid", "==", coachUid),
    where("status", "==", "active")
  );
  
  const snap = await getDocs(q);
  // Return subscription data + docId 
  return snap.docs.map(d => ({ ...d.data(), docId: d.id }));
}

// client_CoachList
// -> Fetches all ACTIVE coaches of a specific client.
// -> Used in client dashboards.
export async function client_CoachList(clientUid) {
  try {
    const q = query(
      collection(db, SUBS_COLLECTION),
      where("clientUid", "==", clientUid),
      where("status", "==", "active")
    );

    // getting subscription docs for coach uid
    const snap = await getDocs(q);

    // For each subscription:
    // -> fetch the actual coach document
    // -> Promise.all allows parallel fetching
    const coaches = await Promise.all(
      snap.docs.map(async (subDoc) => {

        const { coachUid } = subDoc.data();          // extract coach id
        const coachRef = doc(db, "coaches", coachUid);
        const coachSnap = await getDoc(coachRef);
        // Return pure coach object or null if missing
        return coachSnap.exists() ? { docId: coachSnap.id, ...coachSnap.data() } : null;
      })
    );

    // Remove null entries (in case a coach doc was deleted)
    return coaches.filter(Boolean);
  } catch (err) {
    console.error("Error fetching client coaches:", err);
    return [];
  }
}

// getClient
// -> Helper function to find a specific client from a list.
// -> Used mainly in UI selection logic.
export function getClient(clients = [], clientUid){
  const selectedClient = clients.find(c => c.clientUid === clientUid) || null; 
  return selectedClient;
  
}
