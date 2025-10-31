import React, { useRef, useState } from "react";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { createUserProfile } from "../../Services/users";

export default function Register() {
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const locationRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const location = locationRef.current.value.trim();

    // validate all inputs were entered
    if (!firstName || !lastName || !email || !password || !phone || !location || !role) {
      setError("All fields are required");
      return;
    }

    try {
      // Create the auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      try {
        // Create the Firestore user profile (uniform schema under users/{uid})
        await createUserProfile({
          uid,
          email,
          role,        // "client" or "coach"
          firstName,
          lastName,
          phone,
          location,
        });

        navigate("/profile");

      } catch (e) {
        await deleteUser(cred.user);
        throw e;
      }
    } catch (err) {
      if (err.code ==="auth/email-already-in-use"){
        setError("Email already in use. Try logging in.");
      } else {
        console.error(err);
      setError(err.message);
      }
      
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Register</h2>

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "400px" }}>
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
          <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
            <option value="client">Client</option>
            <option value="coach">Coach</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}
