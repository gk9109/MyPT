import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getCoachProfile } from "../../Services/coachProfileService";
import CoachAvatar from "../../componenets/coach/CoachAvater";

export default function ClientCoachProfileView() {
  const { coachUid } = useParams();

  const [loading, setLoading] = useState(true);

  const [coach, setCoach] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    aboutMe: "",
    profilePicUrl: "",
    gallery: []
  });

  // Fetch coach profile by uid (view only)
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const data = await getCoachProfile(coachUid);

        if (!data) {
          toast.error("Coach not found");
          setLoading(false);
          return;
        }

        setCoach({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          aboutMe: data.aboutMe || "",
          profilePicUrl: data.profilePicUrl || "",
          gallery: Array.isArray(data.gallery) ? data.gallery : []
        });
      } catch (err) {
        console.log(err);
        toast.error("Failed to load coach profile");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [coachUid]);

  if (loading) return <p className="p-3">Loading...</p>;

  const coachTitle = coach.firstName
    ? `${coach.firstName} ${coach.lastName}`.trim()
    : "Coach Profile";

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      {/* Top header */}
      <div className="card shadow-sm mb-3">
        
        
      </div>

      {/* Details card (optional, only if something exists) */}
      {(coach.location || coach.phone || coach.email) && (
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <div className="card-body d-flex align-items-center flex-column gap-3 mb-3 border-bottom border-black">
              <CoachAvatar src={coach.profilePicUrl} size={110} />
              <h2 className="fw-bold mb-1">{coachTitle}</h2>
            </div>
            <h5 className="fw-bold mb-3">Details</h5>

            <div className="row">
              <div className="col-12 col-md-6 mb-2">
                <div className="text-muted small"><strong>Location</strong></div>
                <div><strong>{coach.location || "-"}</strong></div>
              </div>

              <div className="col-12 col-md-6 mb-2">
                <div className="text-muted small"><strong>Phone</strong></div>
                <div><strong>{coach.phone || "-"}</strong></div>
              </div>

              <div className="col-12 col-md-6 mb-2">
                <div className="text-muted small"><strong>Email</strong></div>
                <div><strong>{coach.email || "-"}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h5 className="fw-bold mb-3">About</h5>

          {coach.aboutMe ? (
            <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {coach.aboutMe}
            </p>
          ) : (
            <p className="text-muted mb-0">No about section yet.</p>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Gallery</h5>

          {coach.gallery.length === 0 ? (
            <p className="text-muted mb-0">No gallery images yet.</p>
          ) : (
            <div className="row g-2">
              {coach.gallery.map((item, idx) => (
                <div className="col-6 col-md-4 col-lg-3" key={item.path || item.url || idx}>
                  <div className="border rounded p-1">
                    <img
                      src={item.url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-100"
                      style={{ aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
