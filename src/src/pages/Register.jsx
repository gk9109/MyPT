import React, { useRef, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const locationRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const phone = phoneRef.current.value;
    const location = locationRef.current.value;

    if (!name || !email || !password || !phone || !location || !role) {
      setError("All fields are required");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, role === "coach" ? "users" : "sub-clients", user.uid), {
        uid: user.uid,
        name,
        email,
        role,
        phone,
        location,
        createdAt: new Date(),
      });

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Register</h2>

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "400px" }}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" ref={nameRef} className="form-control" placeholder="Your Name" />
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
          <input type="text" ref={phoneRef} className="form-control" placeholder="+1 234 567 890" />
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
