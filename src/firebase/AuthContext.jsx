import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext({ user: null, loading: true, logout: async () => {} });

/** Try to locate the logged-in user's profile and role. */
async function resolveProfileAndRole(uid) {
  // 1) Coaches live in "users" (doc id = uid)
  const coachSnap = await getDoc(doc(db, "users", uid));
  if (coachSnap.exists()) {
    return { role: "coach", profile: coachSnap.data() };
  }

  // 2) Trainees live in a sub-clients collection
  const subCols = ["sub-clients"];
  for (const colName of subCols) {
    // Try by doc id = uid
    const byId = await getDoc(doc(db, colName, uid));
    if (byId.exists()) return { role: "sub-clients", profile: byId.data() };

    // Fallback: query by an authUid field if your doc ids aren’t the uid
    const q = query(collection(db, colName), where("authUid", "==", uid), limit(1));
    const qs = await getDocs(q);
    if (!qs.empty) return { role: "sub-clients", profile: qs.docs[0].data() };
  }

  // Not found → treat as no role
  return { role: null, profile: {} };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const { role, profile } = await resolveProfileAndRole(fbUser.uid);
        // Keep your current shape; just add role + merge profile
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          role,           // <-- used by <ProtectedRoute allow="...">
          ...profile,     // your existing profile fields
        });
      } catch (e) {
        console.error("AuthContext resolve error:", e);
        setUser({ uid: fbUser.uid, email: fbUser.email, role: null });
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const logout = async () => { await signOut(auth); };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
