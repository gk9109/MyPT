import React, { useState, useEffect } from "react";
import UploadVideoForm from "../../componenets/coach/videos/UploadVideoForm";
import VideoList from "../../componenets/coach/videos/VideoList";
import LoaClipLoader from "../../componenets/shared/Loader2";
import { useAuth } from "../../firebase/AuthContext";
import { getCoachVideos } from "../../Services/videos";

// UploadVideosPage
// What this component does:
// -> Coach-facing page for managing uploaded exercise videos.
// -> Fetches all videos uploaded by the logged-in coach.
// -> Allows uploading new videos and immediately updating the list.
//
// Where it's used:
// -> Coach routes/pages (video library / uploads).
//
// Notes:
// -> Firestore/Storage logic is abstracted into Services/videos.js.
// -> UploadVideoForm handles the upload UI and Storage interaction.
// -> VideoList handles display and deletion/editing (if enabled).
export default function UploadVideosPage() {
  // Logged-in coach (uid used to fetch videos)
  const { user } = useAuth();
  // List of videos belonging to this coach
  const [videos, setVideos] = useState([]);
  // Page-level loading flag while fetching videos
  const [loading, setLoading] = useState(true);
  // const [searchTerm, setSearchTerm] = useState("");

  // Fetch coach videos on mount / when user changes
  useEffect(() => {
    if (!user) return;

    const fetchVideos = async () => {
      try {
        setLoading(true);
        // getCoachVideos(uid)
        // -> Service function that fetches all videos uploaded by this coach.
        // -> Returns: array of video objects (plain JS objects).
        const list = await getCoachVideos(user.uid);
        setVideos(list);
      } catch (error) {
        console.error("Error fetching coach videos:", error);
      } finally {
        // Fetch finished (success or error)
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user]);

  // Called when a new video is successfully uploaded
  // -> Adds the new video to the top of the list for instant UI update
  const handleVideoAdded = (video) => {
    // add new video to the top of the list
    setVideos((prev) => [video, ...prev]);
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="container py-4">
        <h2>My Videos</h2>
        <LoaClipLoader />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2>My Videos</h2>
      {/* UploadVideoForm:
        -> Handles video upload (Storage + Firestore).
        -> Calls onVideoAdded(video) after successful upload */}
      <UploadVideoForm onVideoAdded={handleVideoAdded} />
      
      {/* VideoList:
        -> Displays all coach videos.
        -> mode="coach" enables coach-specific actions */}
      <VideoList mode="coach" videos={videos} setVideos={setVideos} />
    </div>
  );
}
