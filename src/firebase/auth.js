import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, GoogleAuthProvider, signInWithPopup, updatePassword } from "firebase/auth";
import { auth } from "./config";
// auth.js
// -> Thin wrappers around Firebase Auth SDK functions.
// -> Keeps auth logic consistent and centralized.

// Create user (email + password)
export const docCreateUserWithEmailAndPassword = async (email, password) => {
  // createUserWithEmailAndPassword(auth, email, password)
  // -> Creates a new account in Firebase Auth.
  // -> Returns: Promise<UserCredential>
  //
  // UserCredential important fields:
  // -> user (User)           : the created/logged-in user object
  // -> operationType (string): usually "signIn" for email/pass create
  // -> providerId (string)   : usually "password"
  //
  // User important fields (user object):
  // -> uid (string)          : unique id for this user (you use this a lot)
  // -> email (string|null)
  // -> displayName (string|null)
  // -> emailVerified (boolean)
  // -> photoURL (string|null)
  // -> metadata (object)     : creationTime, lastSignInTime
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in (email + password)
export const doSignInWithEmailAndPassword = (email, password) => {
  // signInWithEmailAndPassword(auth, email, password)
  // -> Logs in a user.
  // -> Returns: Promise<UserCredential> (same structure as above)
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out
export const doSignOut = () => {
  // auth.signOut()
  // -> Logs out the current user (clears auth session in this browser).
  // -> Returns: Promise<void>
  return auth.signOut();
};

// Reset password (email link)
export const doPasswordReset = (email) => {
  // sendPasswordResetEmail(auth, email)
  // -> Sends a "reset password" email to that address (if it exists).
  // -> Returns: Promise<void>
  return sendPasswordResetEmail(auth, email);
};

// Send email verification (to current logged in user)
export const doSendEmailVerification = () => {
  // sendEmailVerification(user, actionCodeSettings?)
  // -> Sends verification email to auth.currentUser.
  // -> Returns: Promise<void>
  //
  // auth.currentUser:
  // -> The currently signed-in user (User object) or null if not logged in.
  // -> Same important fields: uid, email, emailVerified, etc.
  return sendEmailVerification(auth.currentUser, {
    // After clicking verification link, Firebase can redirect back here
    url: `${window.location.origin}/home`,
  });
};
