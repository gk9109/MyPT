// src/Services/subscriptions.js   (service layer for Firestore user profiles)
import { db } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { makeUserProfile } from "../Models/user";

/** choose the correct collection by role */
function colByRole(role) {
  const r = String(role || "").toLowerCase();
  return r === "coach" ? "users" : "sub-clients"; // clients -> "sub-clients"
}

/** Create the Firestore user profile and return it. */
export async function createUserProfile({ uid, email, role, firstName, lastName, phone, location }) {
  // pick collection by role (this was hardcoded to "users" before)
  const col = colByRole(role);
  const ref = doc(db, col, uid);

  const profile = makeUserProfile({ uid, email, role, firstName, lastName, phone, location });
  await setDoc(ref, profile, { merge: false }); // keep a clean shape
  return profile;
}

/** Get a profile by uid. Tries coaches first, then sub-clients. */
export async function getUserProfile(uid) {
  // try coaches ("users")
  let ref = doc(db, "users", uid);
  let snap = await getDoc(ref);
  if (snap.exists()) return snap.data();

  // fallback to sub-clients
  ref = doc(db, "sub-clients", uid);
  snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/** Update a profile. If role is known, we use it; otherwise try both collections. */
export async function updateUserProfile(uid, patch, role) {
  const knownCol = role ? colByRole(role) : null;

  if (knownCol) {
    await updateDoc(doc(db, knownCol, uid), patch);
    return;
  }

  // attempt update in "users", then in "sub-clients"
  try {
    await updateDoc(doc(db, "users", uid), patch);
  } catch {
    await updateDoc(doc(db, "sub-clients", uid), patch);
  }
}
