import React from "react";
import VideoCard from "../videos/VideoCrad";

export default function VideoList({ mode = "coach", searchTerm = "", videos = [], setVideos }) {
  const handleDelete = (videoId) => {
    if (!setVideos) return;
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  const filteredVideos = videos.filter((v) => {
    const term = searchTerm.toLowerCase();
    return (
      v.name.toLowerCase().includes(term) ||
      (v.tag && v.tag.toLowerCase().includes(term))
    );
  });

  if (!videos.length) return <p>No videos uploaded yet.</p>;

  return (
    <div className="video-grid mt-4" id="VideoList">
      {filteredVideos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          coachUid={video.coachUid}
          mode={mode}
          onDelete={handleDelete}
        />
      ))}
      {!filteredVideos.length && <p>No videos match your search.</p>}
    </div>
  );
}
