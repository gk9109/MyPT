import React, { useRef, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { doSignInWithGoogle } from '../firebase/auth';

export default function UserReg() {
  const [role, setRole] = useState('client');
  
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const certsRef = useRef();
  const specializationRef = useRef();
  const experienceRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const firstName = firstNameRef.current.value;
      const lastName = lastNameRef.current.value;
      const email = emailRef.current.value;
      const phone = phoneRef.current.value;
      const password = passwordRef.current.value;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email,
        firstName,
        lastName,
        phone,
        role,
        createdAt: new Date()
      };

      if (role === 'coach') {
        userData.certifications = certsRef.current.value;
        userData.specialization = specializationRef.current.value;
        userData.experience = experienceRef.current.value;
      }

      const collectionName = role === 'coach' ? 'users' : 'sub-clients';

      await setDoc(doc(db, "collectionName", user.uid), userData);

      alert(`${role} account created!`);
    } catch (err) {
      console.error('Signup error:', err);
      alert('Signup failed: ' + err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await doSignInWithGoogle();
      const user = result.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role,
        createdAt: new Date()
      };

      if (role === 'coach') {
        userData.certifications = certsRef.current.value;
        userData.specialization = specializationRef.current.value;
        userData.experience = experienceRef.current.value;
      }

      const collectionName = role === 'coach' ? 'users' : 'sub-clients';

      await setDoc(doc(db, collectionName, user.uid), userData);

      alert('Account created with Google!');
    } catch (err) {
      console.error('Google sign-in error:', err);
      alert('Google sign-in failed: ' + err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5">
      <div className="card shadow p-4" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Account Type</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="client">Client</option>
              <option value="coach">Coach</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input type="text" ref={firstNameRef} className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input type="text" ref={lastNameRef} className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" ref={emailRef} className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input type="text" ref={phoneRef} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" ref={passwordRef} className="form-control" required />
          </div>

          {role === 'coach' && (
            <>
              <div className="mb-3">
                <label className="form-label">Certifications</label>
                <input type="text" ref={certsRef} className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Specialization</label>
                <input type="text" ref={specializationRef} className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Years of Experience</label>
                <input type="number" ref={experienceRef} className="form-control" />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <p>or</p>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn btn-danger w-100"
          >
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}
