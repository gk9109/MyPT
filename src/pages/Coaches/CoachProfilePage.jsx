import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { db } from "../../firebase/config";
import { useAuth } from "../../firebase/AuthContext";
import { toast } from "react-toastify";

export default function CoachProfilePage() {
  const { user } = useAuth(); // -> logged in coach from AuthContext
  const [loading, setLoading] = useState(true);

  // local state for the form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: ""
  });

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        // reference to the coach document
        const ref = doc(db, "coaches", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          // fill the form with existing data
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

  // update form fields as the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const ref = doc(db, "coaches", user.uid);

      // if email changed, update in Firebase Auth
      if (form.email !== user.email) {
        await updateEmail(user, form.email);
      }

      // update Firestore fields
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
