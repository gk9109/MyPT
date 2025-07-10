import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase/config";
import { db } from "../../firebase/config";



export default function Sidebar() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
        } else {
          const subClientRef = doc(db, "sub-clients", user.uid);
          const subClientSnap = await getDoc(subClientRef);
          if (subClientSnap.exists()) {
            setRole(subClientSnap.data().role);
          }
        }
      }
    });

    return () => unsub();
  }, []);

  return (
    <div
      className="bg-light border-end vh-100 p-3 shadow-sm"
      style={{ width: "220px" }}
    >
      <h5 className="text-primary mb-4">
        {role === "coach" ? "Coach Panel" : "Trainee Panel"}
      </h5>

      <ul className="nav flex-column gap-2">
        {role === "coach" && (
          <>
            <li className="nav-item">
              <Link to="/coach/profile" className="nav-link text-dark fw-semibold">
                <i className="bi bi-person me-2"></i> Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/coach/clients" className="nav-link text-dark fw-semibold">
                <i className="bi bi-people me-2"></i> Clients
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/coach-nutrition" className="nav-link text-dark fw-semibold">
                <i className="bi bi-egg me-2"></i> Nutrition
              </Link>
            </li>
          </>
        )}

        {role === "client" || role === "sub-client" ? (
          <>
            <li className="nav-item">
              <Link to="/trainee-nutrition" className="nav-link text-dark fw-semibold">
                <i className="bi bi-egg-fried me-2"></i> My Nutrition
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link text-dark fw-semibold">
                <i className="bi bi-person me-2"></i> Profile
              </Link>
            </li>
          </>
        ) : null}
      </ul>
    </div>
  );
}
