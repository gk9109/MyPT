import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // runs every time the page loads
    // runs every time the login state changes
    // if theres a user -> fetch its data from firestore, else set user as null
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;

        // first check in "users" (coaches)
        let docRef = doc(db, "users", uid);
        let userSnap = await getDoc(docRef);

        if (!userSnap.exists()) {
          // then check in "sub-clients"
          docRef = doc(db, "sub-clients", uid);
          userSnap = await getDoc(docRef);
        }

        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  
  const logout = () => {
    //sign out -> firebase function -->
    signOut(auth);
    setUser(null);
  };

  return (
    //authContext -> above this rfc
    //used to share these values with other components
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
