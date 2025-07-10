// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔐 Your own Firebase config from the Firebase Console
const firebaseConfig = {
  //Authenticates requests from your app to Firebase services. 
  apiKey: "AIzaSyASSS-mrtP8s0CBc5Cu6XCufALLyd3tbls", 
  //The domain Firebase Auth uses to handle sign-ins.
  authDomain: "mypt-53389.firebaseapp.com",
  //ID of your Firebase project — used across all Firebase services.
  projectId: "mypt-53389",
  //Used for file uploads/downloads via Firebase Storage.
  storageBucket: "mypt-53389.appspot.com",
  //Required for Firebase Cloud Messaging (push notifications).
  messagingSenderId: "429035927757",
  //Uniquely identifies your app — used internally by Firebase.
  appId: "1:429035927757:web:78fdd427ae408771c89184",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firestore instance
export const db = getFirestore(app);

export const auth = getAuth(app); 

