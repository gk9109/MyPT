import { Link } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";


function AdminDashboard() {
  const { currentUser, role } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h2>👑 Admin Dashboard</h2>
      <p>Welcome {currentUser?.email}</p>
      <p>Role: {role}</p>

      <hr />
      <ul>
        <li>
          <Link to="/admin/users">Users management</Link>
        </li>
        <li>
          <Link to="/admin/reports">Reports</Link>
        </li>
        <li>
          <Link to="/profile">Settings</Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminDashboard;
