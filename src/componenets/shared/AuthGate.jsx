import { useAuth } from "../../firebase/AuthContext";
import { RotateLoader } from "react-spinners";

// What this component does:
// -> Acts as a wrapper that blocks rendering until authentication state is ready.
// -> Shows a full-screen loading spinner while auth data is being initialized.
//
// Where it's used:
// -> Wraps protected parts of the app (routes or layouts).
// -> Ensures children components are rendered only after auth state is resolved.
//
// Props:
// children (ReactNode)
// -> Any components that should wait for authentication to finish loading.
//
// Notes:
// -> This component does NOT handle authorization (roles/permissions).
// -> It only handles the "auth still loading" state
export default function AuthGate({ children }) {
  const { loading } = useAuth();
  // While authentication state is loading, block UI and show spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <RotateLoader color="#0d6efd" size={15} margin={2} />
      </div>
    );
  }
  // Once auth is ready, render wrapped content
  return children;
}
