import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';
import SearchBar from '../clients/SearchBar'; // adjust path if needed

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  //logs the user out and navigate to /home
  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <header className="bg-light border-bottom">
      <nav className="container d-flex justify-content-between align-items-center py-3">
        {user && (
          <button className="btn btn-outline-primary btn-sm" onClick={toggleSidebar}>
            ☰ Menu
          </button>
        )}
        <h4 className="m-0 text-primary">MyPT</h4>

        
        {/* Show search bar only for logged-in clients */}
        {/* {user?.role === "client" && <SearchBar />} */}

        <div>
          {!user ? (
            <>
              <Link to="/home" className="btn btn-link">Home</Link>
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn btn-outline-primary me-2">Profile</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
