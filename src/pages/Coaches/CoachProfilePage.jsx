import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { db } from "../../firebase/config";
import { useAuth } from "../../firebase/AuthContext";
import { toast } from "react-toastify";

// CoachProfilePage
// What this component does:
// -> Displays and edits the logged-in coach's profile.
// -> Loads profile data from Firestore.
// -> Allows updating profile fields (name, email, phone, location).
// -> Syncs email changes with Firebase Auth and Firestore.
//
// Where it's used:
// -> Coach routes/pages (profile settings).
//
// Notes:
// -> Email is stored in BOTH Firebase Auth and Firestore.
// -> updateEmail updates Auth, updateDoc updates Firestore.
// -> searchName is updated for search/filter functionality.
export default function CoachProfilePage() {
  // Logged-in coach from AuthContext
  const { user } = useAuth();
  // Page-level loading flag
  const [loading, setLoading] = useState(true);

  // Local form state (controlled inputs)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: ""
  });

  // Fetch coach profile data on mount
  useEffect(() => {
    const fetchCoach = async () => {
      try {
        // doc(db, "coaches", uid)
        // -> Reference to this coach's Firestore document
        const ref = doc(db, "coaches", user.uid);

        // getDoc(docRef)
        // -> Fetches the coach document
        // -> Returns: DocumentSnapshot
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          // Populate form with existing Firestore data
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.phone || "",
            location: data.location || "",
            email: data.email || user.email
          });
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchCoach();
  }, [user.uid, user.email]);

  // Update form state as the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      const ref = doc(db, "coaches", user.uid);

      // If email was changed, update Firebase Auth as well
      if (form.email !== user.email) {
        // updateEmail(user, newEmail)
        // -> Updates the email in Firebase Auth
        // -> Returns: Promise<void>
        await updateEmail(user, form.email);
      }

      // updateDoc(docRef, data)
      // -> Updates specific fields in Firestore
      await updateDoc(ref, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        location: form.location,
        email: form.email,
        searchName: `${form.firstName} ${form.lastName}`.toLowerCase()
      });

      toast.success("Profile updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    }
  };

  // Loading state
  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">Coach Profile</h2>

      <div className="card p-4 shadow-sm">

        <label className="mb-1">First Name</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          className="form-control mb-3"
        />

        <label className="mb-1">Last Name</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          className="form-control mb-3"
        />

        <label className="mb-1">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="form-control mb-3"
        />

        <label className="mb-1">Phone Number</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="form-control mb-3"
        />

        <label className="mb-1">Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="form-control mb-4"
        />

        <button className="btn btn-primary w-100" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
