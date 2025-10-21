import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useAuth } from "../../../firebase/AuthContext";
import VideoCard from "../videos/VideoCrad";

export default function VideoList({ mode = "coach", searchTerm = "" }) {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch all videos for this coach ---
  useEffect(() => {
    if (!user) return;
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "videos", user.uid, "exercises"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(list);
      } catch (error) {
        console.error("Error loading videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user, ]);

  // --- Handle delete from child card ---
  const handleDelete = (videoId) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  // --- Filter by search term (name or tag) ---
  const filteredVideos = videos.filter((v) => {
    const term = searchTerm.toLowerCase();
    return (
      v.name.toLowerCase().includes(term) ||
      (v.tag && v.tag.toLowerCase().includes(term))
    );
  });

  if (loading) return <p>Loading videos...</p>;
  if (!videos.length) return <p>No videos uploaded yet.</p>;

  return (
    <div className="video-grid mt-4" id="VideoList">
      {filteredVideos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          coachUid={user.uid}
          mode={mode}
          onDelete={handleDelete}
        />
      ))}
      {!filteredVideos.length && <p>No videos match your search.</p>}
    </div>
  );
}
