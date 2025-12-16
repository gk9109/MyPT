import React, { useState, useEffect } from "react";
import UploadVideoForm from "../../componenets/coach/videos/UploadVideoForm";
import VideoList from "../../componenets/coach/videos/VideoList";
import LoaClipLoader from "../../componenets/shared/Loader2";
import { useAuth } from "../../firebase/AuthContext";
import { getCoachVideos } from "../../Services/videos";

export default function UploadVideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchVideos = async () => {
      try {
        setLoading(true);
        const list = await getCoachVideos(user.uid);
        setVideos(list);
      } catch (error) {
        console.error("Error fetching coach videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user]);

  const handleVideoAdded = (video) => {
    // add new video to the top of the list
    setVideos((prev) => [video, ...prev]);
  };

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

      <UploadVideoForm onVideoAdded={handleVideoAdded} />
      {/* <VideoSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
      <VideoList mode="coach" videos={videos} setVideos={setVideos} />
    </div>
  );
}
