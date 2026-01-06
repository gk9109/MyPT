import React, { useRef, useState } from "react";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { createUserProfile } from "../../Services/users";

// Register
// What this component does:
// -> Handles new user registration (client or coach).
// -> Creates a Firebase Auth user using email/password.
// -> Saves additional profile data in Firestore.
// -> Cleans up Auth user if Firestore write fails.
//
// Where it's used:
// -> Public route (/register).
//
// Notes:
// -> Firebase Auth handles authentication only.
// -> Firestore stores user profile + role-specific data.
// -> Orphan Auth users are prevented by deleting on Firestore failure.
export default function Register() {
  // Selected role (default is "client" so dropdown has an initial value)
  const [role, setRole] = useState("client");
  // Used to display validation or Firebase errors to the user
  const [error, setError] = useState("");
  // Used to redirect the user after successful registration
  const navigate = useNavigate();

  // Uncontrolled input refs (simpler than controlled inputs for this form)
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const locationRef = useRef();

  // Basic email validation helper
  function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // test -> returns true or false based on the regex match
    return pattern.test(email);
  }

  // Handle registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Read and normalize input values
    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const location = locationRef.current.value.trim();

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone || !location || !role) {
      setError("All fields are required");
      return;
    }

    // Validate email format before calling Firebase
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // createUserWithEmailAndPassword(auth, email, password)
      // -> Creates a new Firebase Auth user
      // -> Returns: UserCredential
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      try {
        // createUserProfile(profileData)
        // -> Service function that saves user data in Firestore
        // -> Keeps Auth (login) and Firestore (profile) separ
        await createUserProfile({
          uid,
          email,
          role, // determines client vs coach behavior throughout the app
          firstName,
          lastName,
          phone,
          location,
        });

        // Registration completed successfully
        navigate("/profile");

      } catch (e) {
        // If Firestore write fails:
        // -> Delete the newly created Auth user
        // -> Prevents orphan Auth accounts without profile data
        await deleteUser(cred.user);
        throw e;
      }
    } catch (err) {
      // Firebase-specific error handling
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Try logging in.");
      } else {
        // any other unexpected error gets printed + shown to the user
        console.error(err);
        setError(err.message);
      }
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Register</h2>

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "400px" }}>
        {/* Displays validation or Firebase errors */}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input type="text" ref={firstNameRef} className="form-control" placeholder="First Name" />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input type="text" ref={lastNameRef} className="form-control" placeholder="Last Name" />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          {/* type="email" gives basic browser validation */}
          <input type="email" ref={emailRef} className="form-control" placeholder="you@example.com" />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" ref={passwordRef} className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input type="text" ref={phoneRef} className="form-control" placeholder="+972 50-000-0000" />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" ref={locationRef} className="form-control" placeholder="City, Country" />
        </div>

        <div className="mb-4">
          <label className="form-label">Role</label>
          {/* Determines whether the user is registered as a client or a coach */}
          <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
            <option value="client">Client</option>
            <option value="coach">Coach</option>
          </select>
        </div>

        {/* Submits the registration form */}
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}
