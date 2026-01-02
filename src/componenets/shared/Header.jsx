import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';

// What this component does:
// -> Renders the main application header / top navigation bar.
// -> Shows different navigation options based on authentication state.
// -> Provides logout functionality and optional sidebar toggle.
//
// Where it's used:
// -> Part of the main layout, displayed at the top of the app.
//
// Props:
// toggleSidebar (function, optional)
// -> Callback used to open/close the sidebar.
// -> Only relevant when a user is logged in.
//
// Notes:
// -> Navigation options are conditional based on whether a user exists.
// -> This component does not fetch data; it only reflects auth state.
export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Logs the user out and redirects to /home
  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <header className="bg-light border-bottom">
      <nav className="container d-flex justify-content-between align-items-center py-3">
        {/* Sidebar toggle button (only visible when logged in) */}
        {user && (
          <button className="btn btn-outline-primary btn-sm" onClick={toggleSidebar}>
            ☰ Menu
          </button>
        )}
        {/* App title / logo */}
        <h4 className="m-0 text-primary">MyPT</h4>

        <div>
          {/* Right-side navigation actions */}
          {!user ? (
            <>
              <Link to="/home" className="btn btn-link">Home</Link>
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          ) : (
            <>
              {/* Authenticated user navigation */}
              <Link to="/profile" className="btn btn-outline-primary me-2">Profile</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
