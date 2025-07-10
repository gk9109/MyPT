import React, { useContext, useEffect, useState } from "react";
import { auth  } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}


export function AuthProvider({ children }){
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsebscribe = onAuthStateChanged(auth, initializeUser);
        return unsebscribe;
    },[])

    async function initializeUser(user) {
        if (user) {
            //spreading out the user properties into a new object ({...user}) to not maintain any references to this user rgument
            setCurrentUser({...user});
            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const value = {
        currentUser,
        userLoggedIn,
        loading
    }

    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
  
}

