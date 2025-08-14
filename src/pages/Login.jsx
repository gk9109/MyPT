import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../firebase/AuthContext";

export default function Login() {
  const { user } = useAuth();
  // refs to get user info
  const emailRef = useRef();
  const passwordRef = useRef();
  //states for signing in and error
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  //nav initalization
  const navigate = useNavigate();

  //handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    //user info
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    //error handling
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      //after user enters info -> set signing in -> true
      setIsSigningIn(true);
      //getting user credentials
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      //extracting user
      const user = userCred.user;

      
      const userDocRef = doc(db, "users", user.uid);
      const userDataObj = await getDoc(userDocRef);

      if (userDataObj.exists()) {
        //navigates to users profile
        navigate("/profile");
      } else {
        const subClientDocRef = doc(db, "sub-clients", user.uid);
        const clientUserDataObj = await getDoc(subClientDocRef);
        if (clientUserDataObj.exists()) {
          navigate("/profile", { state: { user: clientUserDataObj.data() } });
        } else {
          setError("User data not found.");
        }
      }
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
                    Forgot password?
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
