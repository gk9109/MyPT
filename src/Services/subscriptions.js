import { db } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { SUBS_COLLECTION, subId } from "../Models/subscriptions";

// this file contain subscription related functions.
// subscription between a client and a coach works by creating a documen with a unique id.
// this id is a product of the coach's and cliet's id's unified.

// Create doc ref with coach and user id and set status to "active" activate
export async function subscribeToCoach({ coachUid, clientUid }) {
  // The subId is a unique identifier for the document in the "subscriptions" collection.
  // It's created by combining the coachId and clientId,
  // which ensures that each subscription document is uniquely identifiable based on the specific
  // coach-client pairing.
  const ref = doc(db, SUBS_COLLECTION, subId(coachUid, clientUid));
  
  // doing this before setting doc preserves createdAt when reactivating the same pair.
  // if the doc exists we keep its original createdAt and only bump updatedAt.
  const snap = await getDoc(ref);

  // setting doc with data
  await setDoc(ref, {
    coachUid,
    clientUid,
    status: "active",
    createdAt: snap.exists() ? snap.data().createdAt : serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: clientUid,
    // merge: true → updates only the fields you pass, leaving others untouched.
    // no merge → replaces the whole document.
  }, { merge: true });
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
  const query = query(
    collection(db, SUBS_COLLECTION),
    where("coachUid", "==", coachUid),
    where("status", "==", "active")
  );
  
  // array of matching docs by query
  const snap = await getDocs(query);
  // return an array of obejects containing doc id's and data objects 
  return snap.docs.map(d => ({ ...d.data(), docId: d.id }));
}

// for a client. Returns an array of that client’s coach UIDs.
export async function client_CoachList(clientUid) {
  // setting a query for searching in collection
  const query = query(
    collection(db, SUBS_COLLECTION),
    where("clientUid", "==", clientUid),
    where("status", "==", "active")
  );

  // array of matching docs
  const snap = await getDocs(query);
  // return an array of obejects containing doc id's and data objects
  return snap.docs.map(d => ({ ...d.data(), docId: d.id }));
}
