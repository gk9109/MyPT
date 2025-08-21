import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";

// Restricts access to pages meant for guests (not logged in).
// - If user IS logged in -> redirect to /profile
// - If user is NOT logged in -> render the guest page (children or <Outlet/>)

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until auth state is resolved
  if (loading) return null;

  // If logged in -> redirect to /profile
  // "replace" prevents sending user back here with Back button
  return user ? <Navigate to="/profile" replace /> : (children ?? <Outlet />);
}
