import { useAuth } from "../firebase/AuthContext";

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!user) return <div className="text-center mt-5">No user data found.</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4 p-4">
            <div className="text-center mb-4">
              <div className="mb-3">
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  className="rounded-circle border border-3"
                  alt="Profile"
                  style={{ width: "110px", height: "110px", objectFit: "cover" }}
                />
              </div>
              <h3>{user.name}</h3>
              <span className="badge bg-success">Role: {user.role}</span>
            </div>

            <hr />

            <div className="mb-3">
              <div className="fw-bold text-muted">Email:</div>
              {user.email}
            </div>

            <div className="mb-3">
              <div className="fw-bold text-muted">Phone Number:</div>
              {user.phone}
            </div>

            <div className="mb-3">
              <div className="fw-bold text-muted">Location:</div>
              {user.location}
            </div>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-primary flex-fill">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
