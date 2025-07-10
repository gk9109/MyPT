import { Link } from "react-router-dom";

export default function CoachSidebar() {
  return (
    <div
      className="bg-light border-end vh-100 p-3 shadow-sm"
      style={{ width: "220px" }}
    >
      <h5 className="text-primary mb-4">Coach Panel</h5>

      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <Link to="/coach/profile" className="nav-link text-dark fw-semibold">
            <i className="bi bi-person me-2"></i> Profile
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/coach/clients" className="nav-link text-dark fw-semibold">
            <i className="bi bi-people me-2"></i> Clients
          </Link>
        </li>
      </ul>
    </div>
  );
}
