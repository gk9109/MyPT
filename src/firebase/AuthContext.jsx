import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

// AuthContext.jsx
// Watches Firebase Auth state (login/logout).
// Uses helper (resolveProfileAndRole) to fetch the user’s Firestore doc and role.
// Stores the merged user { uid, email, role, ...profile } in React context.
// Makes this user object global across the app via AuthProvider.
// Provides: { user, loading, logout } that any component can access with useAuth().


//this creates aglobal var (AuthContext) that can contain user objexts, loading bools, and logout functions
const AuthContext = createContext({
  user: null,
  loading: true,
  logout: async () => {},
  selectedClient: null,
  setSelectedClient: () => {}
});



// Check Firestore profile and return role + profile data
async function resolveProfileAndRole(uid) {
  // 1. Look in coaches
  const coachSnap = await getDoc(doc(db, "coaches", uid));
  if (coachSnap.exists()) {
    return { role: "coach", profile: coachSnap.data() };
  }

  // 2. Look in clients
  const clientSnap = await getDoc(doc(db, "clients", uid));
  if (clientSnap.exists()) {
    return { role: "client", profile: clientSnap.data() };
  }

  // 3. Look in admins
  const adminSnap = await getDoc(doc(db, "admins", uid));
  if (adminSnap.exists()) {
    return { role: "admin", profile: adminSnap.data() };
  }

  // 4. Not found
  return { role: null, profile: {} };
}


//Listens for login/logout with onAuthStateChanged.
//Resolves role + profile from Firestore.
//Stores merged user object in context.
//Provides { user, loading, logout } to the app.

export function AuthProvider({ children }) {
  // Local state for the current user and a loading flag
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // these are passed to "/componenets/coach/clentCard" and "/pages/coaches/coacheSideClientProfile"
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);

  // Run once when the component mounts
  useEffect(() => {
    // onAuthStateChanged -> Subscribe to Firebase Auth changes (login/logout)
    // auth from config.js
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Case 1: no user is logged in
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Case 2: user is logged in → resolve role/profile from Firestore
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
