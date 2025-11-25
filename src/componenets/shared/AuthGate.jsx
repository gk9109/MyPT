import { useAuth } from "../../firebase/AuthContext";
import { RotateLoader } from "react-spinners";

export default function AuthGate({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <RotateLoader color="#0d6efd" size={15} margin={2} />
      </div>
    );
  }

  return children;
}
