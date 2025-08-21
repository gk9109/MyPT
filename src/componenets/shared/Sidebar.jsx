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
    { to: "/profile", label: "Profile", icon: "bi-person" },
  ];

  // menu items only clients should see 
  const CLIENT = [
    { to: "/search",   label: "Search",       icon: "bi-search" },
    { to: "/diet",     label: "Diet Plan",    icon: "bi-egg" },
    { to: "/workout",  label: "Workout Plan", icon: "bi-heart-pulse" },
    { to: "/progress", label: "Progress",     icon: "bi-bar-chart-line" },
  ];

  // menu items only coaches should see
  const COACH = [
    { to: "/clients",          label: "Clients",        icon: "bi-people" },
    { to: "/nutrition",        label: "Nutrition",      icon: "bi-clipboard-heart" },
    { to: "/workout",          label: "workout",        icon: "bi-clipboard-heart" },
  ];

  // sum of items each role should see
  // both can see common 
  const items = role === "coach" ? [...COMMON, ...COACH] : [...COMMON, ...CLIENT];

  return (
    <div className="bg-white border-end vh-100 p-3 shadow-sm" style={{ width: 220 }}>
      <h5 className="text-primary mb-4">Navigation</h5>
      <ul className="nav flex-column gap-2">
        {items.map(({ to, label, icon }) => (
          <li key={to} className="nav-item">
            <Link
              to={to}
              className={`nav-link fw-semibold ${pathname === to ? "active text-primary" : "text-dark"}`}
            >
              <i className={`bi ${icon} me-2`} /> {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
