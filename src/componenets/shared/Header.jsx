import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-light border-bottom">
      <nav className="container d-flex justify-content-between align-items-center py-3">
        <h4 className="m-0 text-primary">FitConnect</h4>
        <div>
          {/* if no user is logged in */}
          {!user ? (
            <>
              <Link to="/" className="btn btn-link">Home</Link>
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          ) : (
            // if user is logged in
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
