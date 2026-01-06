import { db } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

// SERVICES: users.js
// -> Firestore helper functions for user profiles.
// -> Users are stored in different collections based on role:
//    -> "coaches" collection
//    -> "clients" collection
// -> This file builds and manages user profile objects.

// makeUserProfile
// -> Builds a clean user object using a unified schema.
// -> Used when creating a new user profile.
// -> searchName is used for filtering/searching users later.

export function makeUserProfile({
  uid,
  email,
  role = "client",
  firstName = "",
  lastName = "",
  phone = "",
  location = "",
}) {
  // Build a normalized "first last" string for search
  // -> lowercase, trimmed, single spaces only
  const searchName = `${firstName} ${lastName}`
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

  // Final user object saved in Firestore
  return {
    uid,
    role,
    email,
    firstName,
    lastName,
    searchName,
    phone,
    location,
    createdAt: serverTimestamp(), // server-side timestamp
  };
}

// collectionByRole
// -> Returns the correct collection name based on user role.
// -> coach -> "coaches"
// -> anything else -> "clients"
const collectionByRole = (role) => String(role || "").toLowerCase() === "coach" ? "coaches" : "clients";

// createUserProfile
// -> Creates a new user profile document.
// -> Writes to: coaches/{uid} OR clients/{uid}
// -> Overwrites any existing doc to ensure a clean schema.
export async function createUserProfile({ uid, email, role, firstName, lastName, phone, location }) {
  // Build document reference based on role
  const ref = doc(db, collectionByRole(role), uid);
  // Build user object using shared schema
  const profile = makeUserProfile({ uid, email, role, firstName, lastName, phone, location });
  // Save profile (no merge -> enforce schema)
  await setDoc(ref, profile, { merge: false });
  //return user object
  return profile;
}

// getUserProfile
// -> Fetches a user profile regardless of role.
// -> Tries "coaches" first, then "clients".
// -> Returns user object or null if not found.
export async function getUserProfile(uid) {
  // Try coach collection first
  let ref = doc(db, "coaches", uid);
  let snap = await getDoc(ref);

  if (snap.exists()) return snap.data();

  // Fallback to client collection
  ref = doc(db, "clients", uid);
  snap = await getDoc(ref);

  // if doc exists, return its data, else return null
  return snap.exists() ? snap.data() : null;
}

// updateUserProfile
// -> Updates an existing user profile.
// -> Uses role to decide which collection to update.
export async function updateUserProfile(uid, patch, role) {
  // if role has value, call collectionByRole and set col to "coaches" or "ckients", if not then null
  const col = role ? collectionByRole(role) : null;
  return updateDoc(doc(db, col, uid), patch);
}
