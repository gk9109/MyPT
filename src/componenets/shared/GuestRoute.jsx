// routes/GuestRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";

export default function GuestRoute({ children }) {
  //object deconstructing pulls named properties into vars:
  // const auth = useAuth();
  // const user = auth.user;
  // const loading = auth.loading;
  //is the same as:
  // const { user, loading } = useAuth();
  const { user, loading } = useAuth();

  if (loading) return null;
  //replace tells React Router to replace the current history entry instead of pushing a new one.
  //Why its needed:
  //after redirecting, pressing Back won’t bounce the user back to the blocked page,
  //and then forward again—better UX.
  return user ? <Navigate to="/profile" replace /> : (children ?? <Outlet />);
}
