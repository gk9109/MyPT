// src/Services/users.js
import { db } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { makeUserProfile } from "../Models/user";

//this file is for user handling functions

//gets a role (string), if role == coach return "coaches", else, return "clients"
const collectionByRole = (role) =>
  String(role || "").toLowerCase() === "coach" ? "coaches" : "clients";

//creates user obj user user schema, setting it in correct collection and returning user object
export async function createUserProfile({ uid, email, role, firstName, lastName, phone, location }) {
  // setting a doc ref
  const ref = doc(db, collectionByRole(role), uid);
  // creates user profile with schema from /models/users
  const profile = makeUserProfile({ uid, email, role, firstName, lastName, phone, location });
  // overwrite doc with a clean profile object
  await setDoc(ref, profile, { merge: false });
  //return user object
  return profile;
}

// getting user obj from right collection, if doesnt exist, return null
export async function getUserProfile(uid) {
  // creating doc ref
  let ref = doc(db, "coaches", uid);
  // getting doc
  let snap = await getDoc(ref);
  // returning doc data if do exists
  if (snap.exists()) return snap.data();

  //if doc doenst exist, user different ref
  ref = doc(db, "clients", uid);
  // get doc
  snap = await getDoc(ref);
  // if doc exists, return its data, else return null
  return snap.exists() ? snap.data() : null;
}

// update file in collection based on role
export async function updateUserProfile(uid, patch, role) {
  // if role has value, call collectionByRole and set col to "coaches" or "ckients", if not then null
  const col = role ? collectionByRole(role) : null;
  // update doc
  return updateDoc(doc(db, col, uid), patch);
}
