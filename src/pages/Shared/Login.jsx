import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../firebase/AuthContext";
import { Link } from "react-router-dom";

// Login
// What this component does:
// -> Provides email/password login using Firebase Auth.
// -> Validates basic input before attempting login.
// -> Checks which Firestore collection the user belongs to (coach/client/admin).
// -> Displays errors and loading state during sign-in.
//
// Where it's used:
// -> Public route (/login).
// -> Entry point for all user roles.
//
// Notes:
// -> Actual navigation after login is handled elsewhere (AuthGate / role-based routes).
// -> This file only authenticates and verifies user existence in Firestore.
export default function Login() {
  // Global auth state (not directly used here, but kept for consistency)
  const { user } = useAuth();
  // Refs for uncontrolled form inputs
  const emailRef = useRef();
  const passwordRef = useRef();
  // UI state
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  // Router navigation helper
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Read values from input refs
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // Basic client-side validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsSigningIn(true);

      // signInWithEmailAndPassword(auth, email, password)
      // -> Authenticates the user with Firebase Auth
      // -> Returns: UserCredential
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Check if user exists in "coaches" collection
      // -> Used to determine role and route access
      const coachDocRef = doc(db, "coaches", user.uid);
      const coachDoc = await getDoc(coachDocRef);
      if (coachDoc.exists()) {
        // navigate("/profile", { state: { user: coachDoc.data() } });
        // return;
      }

      // Check if user exists in "clients" collection
      const clientDocRef = doc(db, "clients", user.uid);
      const clientDoc = await getDoc(clientDocRef);
      if (clientDoc.exists()) {
        // navigate("/client/profile", { state: { user: clientDoc.data() } });
        // return;
      }

      // Check if user exists in "admins" collection
      console.log("Checking admin:", user.uid);
      const adminDocRef = doc(db, "admins", user.uid);
      const adminDoc = await getDoc(adminDocRef);
      console.log("Admin doc exists:", adminDoc.exists());
      if (adminDoc.exists()) {
        // navigate("/admin/dashboard"); // go to admin dashboard page
        // return;
      }

      // If user exists in Auth but not in any Firestore role collection
      setError("User data not found in any collection.");

    } catch (err) {
      console.error(err);
      setError("Login failed: " + err.message);
    } finally {
      // Reset loading state
      setIsSigningIn(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Login to Your Account</h3>
              {/* Error message */}
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Login form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    ref={emailRef}
                    type="email"
                    className="form-control"
                    placeholder="Email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    ref={passwordRef}
                    type="password"
                    className="form-control"
                    placeholder="Password"
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSigningIn}
                  >
                    {isSigningIn ? "Logging in..." : "Login"}
                  </button>
                </div>
                
                {/* Password reset navigation */}
                <div className="text-center mt-3">
                  <Link to="/PasswordReset" className="text-muted">
                    Forgot/reset password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
