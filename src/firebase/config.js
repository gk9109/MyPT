// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 

// ** Initializes Firebase once and exports auth and db
// so the rest of the app can talk to Firebase Auth + Firestore.
// Everything else imports from here. **

// Firebase config from the Firebase Console
const firebaseConfig = {
  //Authenticates requests from your app to Firebase services. 
  apiKey: "AIzaSyASSS-mrtP8s0CBc5Cu6XCufALLyd3tbls", 
  //The domain Firebase Auth uses to handle sign-ins.
  authDomain: "mypt-53389.firebaseapp.com",
  //ID of your Firebase project — used across all Firebase services.
  projectId: "mypt-53389",
  //Used for file uploads/downloads via Firebase Storage.
  storageBucket: "mypt-53389.firebasestorage.app",
  //Required for Firebase Cloud Messaging (push notifications).
  messagingSenderId: "429035927757",
  //Uniquely identifies your app — used internally by Firebase.
  appId: "1:429035927757:web:78fdd427ae408771c89184",
};

// Initialize the Firebase App with your project's config object.
// This connects your local React app to your Firebase project in the cloud.
// All Firebase services (Auth, Firestore, Storage, etc.) are attached to this app.
const app = initializeApp(firebaseConfig);

// Firestore instance: your entry point to the Firestore database service.
// Use this `db` object to read and write documents and collections in Firestore.
export const db = getFirestore(app);

// Auth instance: your entry point to the Firebase Authentication service.
// Use this `auth` object for creating accounts, signing in/out, and listening
// to login state changes (onAuthStateChanged).
export const auth = getAuth(app);

// Storage instance: your entry point to Firebase Storage service.
// Use this `storage` object to upload and download files (videos, images, etc.)
// from Firebase Storage. It connects the app to your project's storage bucket.
export const storage = getStorage(app);

