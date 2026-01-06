import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

// AuthContext.jsx
// What this file does:
// -> Listens to Firebase Auth login/logout changes.
// -> Fetches the user's profile + role from Firestore.
// -> Merges Auth data + Firestore data into ONE global user object.
// -> Exposes { user, loading, logout } to the entire app via React Context.

// Creates a global context object.
// Default values are only used BEFORE AuthProvider runs.
const AuthContext = createContext({
  user: null,
  loading: true,
  logout: async () => {},
  selectedClient: null,
  setSelectedClient: () => {}
});

// Resolve role + profile from Firestore
async function resolveProfileAndRole(uid) {
  const coachSnap = await getDoc(doc(db, "coaches", uid));
  if (coachSnap.exists()) {
    return { role: "coach", profile: coachSnap.data() };
  }

  const clientSnap = await getDoc(doc(db, "clients", uid));
  if (clientSnap.exists()) {
    return { role: "client", profile: clientSnap.data() };
  }

  const adminSnap = await getDoc(doc(db, "admins", uid));
  if (adminSnap.exists()) {
    return { role: "admin", profile: adminSnap.data() };
  }
  return { role: null, profile: {} };
}

// Listens for login/logout with onAuthStateChanged.
// Resolves role + profile from Firestore.
// Stores merged user object in context.
// Provides { user, loading, logout } to the app.
export function AuthProvider({ children }) {
  // Global user object (merged Auth + Firestore)
  const [user, setUser] = useState(null);
  // While Firebase is still checking auth state
  const [loading, setLoading] = useState(true);
  // these are passed to "/componenets/coach/clentCard" and "/pages/coaches/coacheSideClientProfile"
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);

  // Run once when the component mounts
  useEffect(() => {
    // onAuthStateChanged(auth, callback)
    // -> Subscribes to Firebase Auth state changes.
    // -> Triggered on: page refresh, login, logout.
    // -> Returns: unsubscribe function.
    
    // "user" parameter here is a Firebase User object OR null.
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Case 1: no user is logged in
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Case 2: user is logged in -> resolve role/profile from Firestore
        const { role, profile } = await resolveProfileAndRole(user.uid);

        // Merge Firebase Auth data + Firestore profile into one object
        setUser({
          uid: user.uid,     // always the Auth uid
          email: user.email, // email from Auth
          role,                // "coach" | "client" | "admin" | null
          ...profile,          // any extra fields from Firestore
        });
      } catch (e) {
        console.error("AuthContext resolve error:", e);
        // fallback user if Firestore lookup failed
        setUser({ uid: user.uid, email: user.email, role: null });
      } finally {
        // Auth check finished
        setLoading(false);
      }
    });

    // Cleanup: unsubscribe on unmount
    return unsub;
  }, []);

  // Simple wrapper for Firebase logout
  const logout = async () => { await signOut(auth); };

  // Provide user, loading, and logout to the rest of the app
  // this wrapper takes place in main.jsx
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      logout,
      selectedClient,
      setSelectedClient: (client) => {
        // copying the object and setting uid to the first value out of thsese to normalize the use
        const normalized = { ...client, uid: client.uid || client.clientUid };
        setSelectedClient(normalized);
      },
      selectedCoach,
      setSelectedCoach
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
