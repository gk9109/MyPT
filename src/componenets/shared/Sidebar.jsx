// src/components/shared/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";

export default function Sidebar() {
  const { user, loading } = useAuth();
  // useLocation() (React Router) returns the current URL info: { pathname, search, hash, state, key }
  // We destructure to grab only pathname (e.g. "/search").
  const { pathname } = useLocation();

  // While auth is resolving, or if there's no user -> no sidebar at all.
  if (loading || !user) return null;

  
  const role = user.role; // 'client' | 'coach' | 'admin'

  // Menu config
  //arrays of objects, each object describes one sidebar link
  
  // menu items that every logged in user should see
  const COMMON = [
    { to: "/profile", label: "Profile" }
  ];

  // menu items only clients should see 
  const CLIENT = [
    { to: "/search",   label: "Search" },
    { to: "/coach-list",   label: "Coach List" },
    // { to: "/daily-article",   label: "Daily Article" },
    // { to: "/diet",     label: "Nutrition Plan" },
    // { to: "/workout",  label: "Workout Plan" },
    // { to: "/progress", label: "Progress" }
  ];

  // menu items only coaches should see
  const COACH = [
    { to: "/clients",          label: "Clients" },
    { to: "/videos",          label: "Videos" },
    { to: "/schedule",          label: "Schedule" },
  ];

  // sum of items each role should see
  // both can see common 
  const items = role === "coach" ? [...COMMON, ...COACH] : [...COMMON, ...CLIENT];

  return (
    <div className="bg-white border-end h-100 p-3 shadow-sm" style={{ width: 220 }}>
      <h5 className="text-primary mb-4">Navigation</h5>
      <ul className="nav flex-column gap-2">
        {items.map(({ to, label }) => (
          <li key={to} className="nav-item">
            <Link
              to={to}
              className={`nav-link fw-semibold ${pathname === to ? "active text-primary" : "text-dark"}`}
            >
              <i className={`bi me-2`} /> {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
