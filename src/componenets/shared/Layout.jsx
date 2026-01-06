import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";
import AuthGate from "./AuthGate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout
// What this component does:
// -> Main page shell used across the app.
// -> Renders Header + (optional) Sidebar + page content + Footer.
// -> Provides a global ToastContainer for notifications.
// -> Wraps everything with AuthGate so UI waits for Firebase Auth to finish loading.
//
// Where it's used:
// -> Usually wrapped around most pages/routes (top-level layout component).
// -> Acts as the "common UI" so pages only focus on their own content.
//
// Props:
// children (ReactNode)
// -> The current page content rendered inside the <main> area.
//
// Notes:
// -> Sidebar visibility is controlled here and toggled from Header (via a prop callback).
// -> ToastContainer is placed once here so any page/component can call toast().
export default function Layout({ children }) {
  // Controls whether the sidebar is shown or hidden
  const [showSidebar, setShowSidebar] = useState(true);

  // Called when Header wants to toggle the sidebar open/close
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <AuthGate>
      <div className="d-flex flex-column min-vh-100" id="layout">
        {/* Header controls sidebar toggle (button/menu icon is inside Header) */}
        <Header toggleSidebar={toggleSidebar}/>

        <div className="flex-fill d-flex">
          {/* Only render Sidebar if it's enabled */}
          { showSidebar && <Sidebar /> } 
          {/* Main page content (whatever was passed as children) */}
          <main className="flex-fill container py-4" id="layout-children">{children}</main>
        </div>

        <Footer />
      </div>
      {/* Global toast notifications (used across the whole app) */}
      <ToastContainer position="bottom-center" autoClose={2500} />
    </AuthGate>
  );
}
