import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";

// What this component does:
// -> Restricts access to routes that should only be visible to guests
//    (users who are NOT logged in).
// -> Redirects authenticated users away from guest-only pages.
//
// Where it's used:
// -> Wraps routes like login / register / landing pages.
//
// Props:
// children (ReactNode, optional)
// -> Explicit child components to render for guest users.
// -> If not provided, <Outlet /> is used for nested routes.
//
// Notes:
// -> This component relies on AuthContext to determine auth state.
// -> It does NOT handle loading UI; it only gates routing behavior.
export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until auth state is resolved
  if (loading) return null;

  // If logged in -> redirect to /profile
  // "replace" prevents sending user back here with Back button
  return user ? <Navigate to="/profile" replace /> : (children ?? <Outlet />);
  // <Outlet /> is from React Router: it renders the matched nested route here.
  // children ?? <Outlet /> = render children if provided; otherwise render <Outlet />.
}
