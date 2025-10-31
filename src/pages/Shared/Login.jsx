import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../firebase/AuthContext";

export default function Login() {
  const { user } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsSigningIn(true);
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Check if user is a coach
      const coachDocRef = doc(db, "coaches", user.uid);
      const coachDoc = await getDoc(coachDocRef);
      if (coachDoc.exists()) {
        navigate("/profile", { state: { user: coachDoc.data() } });
        return;
      }

      // Check if user is a client
      const clientDocRef = doc(db, "clients", user.uid);
      const clientDoc = await getDoc(clientDocRef);
      if (clientDoc.exists()) {
        navigate("/profile", { state: { user: clientDoc.data() } });
        return;
      }

      // Check if user is an admin (fixed collection name)
      console.log("Checking admin:", user.uid);
      const adminDocRef = doc(db, "admins", user.uid);
      const adminDoc = await getDoc(adminDocRef);
      console.log("Admin doc exists:", adminDoc.exists());
      if (adminDoc.exists()) {
        navigate("/admin/dashboard"); // go to admin dashboard page
        return;
      }

      // No match found
      setError("User data not found in any collection.");

    } catch (err) {
      console.error(err);
      setError("Login failed: " + err.message);
    } finally {
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
              {error && <div className="alert alert-danger">{error}</div>}

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

                <div className="text-center mt-3">
                  <a href="#" className="text-muted">
                    Forgot password? ADD THIS PART
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
