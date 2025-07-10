import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CoachSidebar from "../coach/CoachSidebar";
import { useAuth } from "../../firebase/AuthContext";

export default function Layout({ children }) {
  const { user, loading } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="flex-fill d-flex">
        {/* Sidebar only if logged in */}
        {loading ? (
          <div className="text-center mt-5">Loading...</div>
        ) : user ? (
          user.role === "coach" ? (
            <CoachSidebar role={user.role} />
          ) : (
            <Sidebar role={user.role} />
          )
        ) : null}

        <main className="flex-fill container py-4">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
