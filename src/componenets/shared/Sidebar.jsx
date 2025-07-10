import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ role }) {
  return (
    <div
      className="bg-white border-end vh-100 p-3 shadow-sm"
      style={{ width: '220px' }}
    >
      <h5 className="text-primary mb-4">Navigation</h5>

      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <Link to="/profile" className="nav-link text-dark fw-semibold">
            <i className="bi bi-house me-2"></i> Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/diet" className="nav-link text-dark fw-semibold">
            <i className="bi bi-egg me-2"></i> Diet Plan
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/workout" className="nav-link text-dark fw-semibold">
            <i className="bi bi-heart-pulse me-2"></i> Workout Plan
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/progress" className="nav-link text-dark fw-semibold">
            <i className="bi bi-bar-chart-line me-2"></i> Progress
          </Link>
        </li>
      </ul>

      {role === 'coach' && (
        <>
          <hr />
          <h6 className="text-secondary mt-3">Coach Tools</h6>
          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <Link to="/clients" className="nav-link text-dark fw-semibold">
                <i className="bi bi-people me-2"></i> Manage Clients
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
