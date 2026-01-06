import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";

// Sidebar
// What this component does:
// -> Displays a role-based navigation sidebar.
// -> Shows different menu items depending on the logged-in user's role.
//
// Where it's used:
// -> Rendered inside the main Layout component.
// -> Appears on protected pages after authentication is resolved.
//
// Notes:
// -> Uses Firebase Auth to determine if a user is logged in and their role.
// -> Uses React Router to highlight the active route.
export default function Sidebar() {
  const { user, loading } = useAuth();
  // -> Provides information about the current URL.
  // -> We only use "pathname" to highlight the active menu item.
  const { pathname } = useLocation();

  // While auth is still resolving, or if no user exists -> do not render sidebar
  if (loading || !user) return null;

  
  const role = user.role; // User role: "client" | "coach" | "admin"

  // Sidebar menu configuration
  // Each array contains objects describing sidebar links for a specific role
  
  // Menu items visible to all logged-in users
  const COMMON = [
    { to: "/profile", label: "Profile" }
  ];

  // Menu items only clients should see 
  const CLIENT = [
    { to: "/search",   label: "Search" },
    { to: "/coach-list",   label: "Coach List" },
  ];

  // Menu items only coaches should see
  const COACH = [
    { to: "/clients",          label: "Clients" },
    { to: "/videos",          label: "Videos" },
    { to: "/schedule",          label: "Schedule" },
  ];

  // Combine common items with role-specific items
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
