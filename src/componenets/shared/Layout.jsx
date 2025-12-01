import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";
import AuthGate from "./AuthGate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <AuthGate>
      <div className="d-flex flex-column min-vh-100" id="layout">
        {/* pass toggle */}
        <Header toggleSidebar={() => setShowSidebar(!showSidebar)}/>

        <div className="flex-fill d-flex">
          {/* only render if true */}
          { showSidebar && <Sidebar /> } 
          <main className="flex-fill container py-4" id="layout-children">{children}</main>
        </div>

        <Footer />
      </div>
      <ToastContainer position="bottom-center" autoClose={2500} />
    </AuthGate>
  );
}
