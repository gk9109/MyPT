import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";

// ProtectedRoute
// What this component does:
// -> Acts as a route guard for protected pages.
// -> Blocks access if the user is not logged in.
// -> Optionally restricts access based on user role.
// -> Redirects users to the correct page if access is denied.
//
// Where it's used:
// -> Wrapped around protected routes in the router configuration.
// -> Used for role-based access (admin / coach / client).
//
// Props:
// allow (string | undefined)
// -> Optional role required to access the route (e.g. "admin", "coach", "client").
//
// children (ReactNode)
// -> Optional content to render instead of <Outlet />.
//
// Notes:
// -> Uses Firebase Auth state from AuthContext.
// -> Uses react-router's <Navigate /> for redirects.
// -> Supports both nested routes (<Outlet />) and direct children rendering.
export default function ProtectedRoute({ allow, children }) {
  const { user, loading } = useAuth();
  // -> Gives the current route info (current URL/location object).
  // -> We save it so we can remember where the user tried to go before login.
  const loc = useLocation();

  // Wait until Firebase finishes resolving auth state
  if (loading) return null;

  // If user is not logged in -> redirect to login
  // "replace" avoids keeping the blocked page in browser history
  // "state.from" remembers the original page for post-login redirect
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;

  // If a role restriction exists -> validate user role
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
