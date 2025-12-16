import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";

// Role-based route guard
// - Blocks access if user is not logged in
// - Optionally checks user.role against the required role
// - Redirects to /login (if not logged in) or /profile (if role mismatch)

export default function ProtectedRoute({ allow, children }) {
  const { user, loading } = useAuth();
  // The useLocation hook in React is part of the react-router-dom library and provides
  // access to the current location object.
  // This object represents the current URL and contains various properties related to it.
  const loc = useLocation();

  // Don’t render until Firebase finishes checking auth state
  if (loading) return null;

  // If no user -> send to login
  // "replace" prevents the blocked page from staying in browser history
  // "state={{ from: loc }}" remembers the page user wanted -> can redirect after login
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;

  // If a role is required -> check it
  const role = user.role?.toLowerCase();
  console.log("ProtectedRoute role:", role, "allow:", allow);
  if (allow && role !== allow.toLowerCase()) {
    // redirect admins (or anyone else) to their default dashboard
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "coach") return <Navigate to="/profile" replace />;
    if (role === "client") return <Navigate to="/client/profile" replace />;
  }

  // Render nested routes (<Outlet/>) or direct children
  return children ?? <Outlet />;
}
