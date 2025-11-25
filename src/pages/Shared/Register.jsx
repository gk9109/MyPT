import React, { useRef, useState } from "react";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { createUserProfile } from "../../Services/users";

export default function Register() {
  // role starts as "client" so the dropdown has a default
  const [role, setRole] = useState("client");
  // used to show any registration errors to the user
  const [error, setError] = useState("");
  // used to redirect the user after successful registration
  const navigate = useNavigate();

  // using refs because the inputs are uncontrolled (simpler than controlled state)
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const locationRef = useRef();

  // simple regex that checks basic email structure
  function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // test -> returns true/false depending on whether the email matches the pattern
    return pattern.test(email);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // reading input values directly from refs
    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const location = locationRef.current.value.trim();

    // making sure nothing is empty
    if (!firstName || !lastName || !email || !password || !phone || !location || !role) {
      setError("All fields are required");
      return;
    }

    // basic email validation before calling Firebase
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // creates a new Firebase Auth user (email + password)
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      try {
        // saving additional user details inside Firestore under users/{uid}
        // so Auth handles login, and Firestore stores profile data
        await createUserProfile({
          uid,
          email,
          role,        // stored so the system knows if it's a coach or a client
          firstName,
          lastName,
          phone,
          location,
        });

        // after registration and saving profile -> move user to profile page
        navigate("/profile");

      } catch (e) {
        // if Firestore write fails, delete the newly created Auth user
        // prevents "orphan" Auth accounts with no profile
        await deleteUser(cred.user);
        throw e;
      }
    } catch (err) {
      // Firebase gives a specific error when email already exists
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
        {/* shows validation or Firebase errors above the form */}
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
          {/* type=email gives minimal browser validation, but we still do our own check */}
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
          {/* selecting between client/coach determines how profile is stored later */}
          <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
            <option value="client">Client</option>
            <option value="coach">Coach</option>
          </select>
        </div>

        {/* triggers handleSubmit */}
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}
