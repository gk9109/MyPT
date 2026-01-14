import React, { useEffect, useState } from "react";
import { subscribeToCoach, unsubscribeFromCoach } from '../../Services/subscriptions'
import { useAuth } from "../../firebase/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { SUBS_COLLECTION, subId } from "../../Services/subscriptions";
import { useNavigate } from "react-router-dom";
import CoachAvatar from "../coach/CoachAvater";

// CoachCard is rendered in the client coach list.
// This componenet will be associated with each coach in the system and displayed with their details,
// as clients browse coaches

export default function CoachCard({ coach, mode }) {
  // user -> current logged-in user, selectedCoach -> reference to the coach the client selected 
  const { user, setSelectedCoach } = useAuth(); 
  const [isSubscribed, setIsSubscribed] = useState(false); // state to controll subscriptions
  const [loading, setLoading] = useState(true); // state for loading
  const navigate = useNavigate(); // hook to navigate to other pages in code

  // On coach selection save data in state and localStorage for later use
  const onSelect = () => {
    setSelectedCoach(coach);
    localStorage.setItem("selectedCoach", JSON.stringify(coach)); // persist coach
    navigate("/plans") // navigate to clients plans made by selected coach
  };

  // On coach selection save data in state and localStorage for later use
  const onChat = () => {
    setSelectedCoach(coach);
    localStorage.setItem("selectedCoach", JSON.stringify(coach)); // persist coach
    const subscriptionId = `${coach.uid || coach.coachUid}_${user.uid}`; // subId for mutual chats
    navigate(`/chat/${subscriptionId}`); // navigation to chat
  };

  const onViewProfile = () => {
    setSelectedCoach(coach);
    localStorage.setItem("selectedCoach", JSON.stringify(coach));
    navigate(`/coach-profile/${coach.uid}`);
  };


  if (!coach) return <p>no coaches in list</p>;

  // pull common fields out of the coach object (with safe defaults)
  const {
    firstName = "",
    lastName = "",
    location = "",
    email = "",
    phone = "",
    role = "",
    uid = "",
    createdAt,
    profilePicUrl = "",
    aboutMe = "",
  } = coach;

  // check subscription status on mount / when user or coach changes
  useEffect(() => {
    const checkSub = async () => {
      if (!user?.uid || !uid) return setLoading(false);
      
      try { // creating reference and fetching doc
        const ref = doc(db, SUBS_COLLECTION, subId(uid, user.uid));  
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().status === "active") {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (err) { // logging error in console
        console.error("Error checking subscription:", err);
        setIsSubscribed(false);
      }
      setLoading(false);
    };
    checkSub();
  }, [user?.uid, uid]);

  // updating subscription doc based on subscriptions current status -> active/cancled
  const toggleSubscription = async () => {
    if (!user?.uid || !uid) return;
    console.log("coachUid:", uid, "clientUid:", user?.uid, "user:", user); // check log

    try {  
      if (isSubscribed) {
        await unsubscribeFromCoach({ coachUid: uid, clientUid: user.uid });
        setIsSubscribed(false);
        setSelectedCoach(null);   // clear context if unsubscribed
      } else {
        await subscribeToCoach({ coachUid: uid, clientUid: user.uid });
        setIsSubscribed(true);
        setSelectedCoach(coach);  // store full coach object in context
      }
    } catch (err) {
      console.error("Error toggling subscription:", err);
    }
  };

  // dont get what this is for 
  // format createdAt
  let created = "";
  if (createdAt) {
    try {
      // Firestore Timestamp has toDate(), Date/string does not
      const date =
        typeof createdAt.toDate === "function"
          ? createdAt.toDate()
          : new Date(createdAt);

      created = date.toLocaleDateString();
    } catch (error) {
        console.log(error);
    }
  }

  // full name + initials for the avatar circle 
  const name = `${firstName} ${lastName}`.trim() || "(Unnamed)";
  const initials = (firstName?.[0] || "").toUpperCase() + (lastName?.[0] || "").toUpperCase();

  // aboutMe preview (first ~90 chars)
  const aboutPreview = aboutMe?.trim()
    ? aboutMe.trim().length > 90
      ? aboutMe.trim().slice(0, 90) + "..."
      : aboutMe.trim()
    : "";

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header">
        <div className="card-body d-flex">
          {/* Avatar */}
          <div className="me-3" style={{ width: 60, height: 60 }}>
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt={name}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              // fallback to your avatar component (or initials if needed)
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 56, height: 56, background: "#eef2ff", fontWeight: 600 }}
              >
                {/* if your CoachAvatar is good, use it. if not, initials still work */}
                <CoachAvatar firstName={firstName} lastName={lastName} />
              </div>
            )}
          </div>

          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">{name}</h5>
              {role && <span className="badge bg-primary">{role}</span>}
            </div>

            {location && <div className="text-muted small mt-1">{location}</div>}

            <div className="mt-2">
              {email && (
                <div className="small">
                  <i className="bi bi-envelope me-1" /> {email}
                </div>
              )}
              {phone && (
                <div className="small">
                  <i className="bi bi-telephone me-1" /> {phone}
                </div>
              )}

              {created && (
                <div className="small text-muted">
                  <i className="bi bi-calendar me-1" /> Joined {created}
                </div>
              )}
            </div>

            {/* About Me preview */}
            {aboutPreview && <div className="small text-muted mt-2">{aboutPreview}</div>}

            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-sm btn-primary" onClick={() => onViewProfile()}>
                View profile
              </button>
            
              <button
                className={`btn btn-sm ${isSubscribed ? "btn-danger" : "btn-outline-secondary"}`}
                onClick={toggleSubscription}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
          
              <button className="btn btn-sm btn-primary" onClick={() => onSelect()}>
                View plans
              </button>

              <button className="btn btn-sm btn-primary" onClick={() => onChat()}>
                Chat
              </button>
            
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
