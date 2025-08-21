import { serverTimestamp } from "firebase/firestore";

// ** BUILDS A NORMALIZED USER PROFILE OBJECT **

/**
 * This section uses JSDoc to define a custom type named AppUser. 
 * @typedef {Object} AppUser
 * 
 * @property {string} uid
 * @property {'client'|'coach'|'admin'} role //only 3 valid strings for this property
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} searchName 
 * @property {string=} phone    //= mean optional
 * @property {string=} location //= mean optional
 * @property {*} createdAt   // Firestore Timestamp
 * the * indicates the type is a wildcard because it's a special serverTimestamp object,
 * which isn't a standard JavaScript type.
 */

/** Build a normalized user profile with defaults */
export function makeUserProfile({
  uid,
  email,
  role = "client",
  firstName = "",
  lastName = "",
  phone = "",
  location = "",
}) {

  // derive once, consistently
  const searchName = `${firstName} ${lastName}`
    .trim()
    .replace(/\s+/g, " ") //removes ALL white spaces to create
    .toLowerCase();

  /** @type {AppUser} */
  // create a user by schema
  const user = {
    uid,
    role,
    email,
    firstName,
    lastName,
    searchName,
    phone,
    location,
    createdAt: serverTimestamp(),
  };
  
  return user;
}
