import React from "react";
import VideoCard from "../videos/VideoCrad";

// What this component does:
// -> Displays a list/grid of exercise demo videos.
// -> Supports text-based filtering by video name or tag.
// -> Handles local removal of videos after deletion (UI update).
//
// Where it's used:
// -> Coach-side video management pages.
// -> Client-side views that display available exercise videos (read-only mode).
//
// Props:
// mode (string, default = "coach")
// -> Determines how VideoCard behaves.
// -> "coach": edit/delete actions enabled.
// -> "client": read-only view.
//
// searchTerm (string, optional)
// -> Text entered by the user to filter videos.
// -> Matches against video name and tag.
//
// videos (array, default = [])
// -> List of video objects to display.
// -> Each video is passed directly to VideoCard.
//
// setVideos (function, optional)
// -> State setter provided by the parent.
// -> Used to remove a video from the list after deletion.
// -> If not provided, delete will still work in Firestore, but UI won't auto-update.
//
// Notes:
// -> This component does not fetch data.
// -> All filtering and UI updates are done locally.
export default function VideoList({ mode = "coach", searchTerm = "", videos = [], setVideos }) {

  // Remove a video from local state after successful deletion
  const handleDelete = (videoId) => {
    if (!setVideos) return;
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  // Filter videos by name or tag (case-insensitive)
  const filteredVideos = videos.filter((v) => {
    const term = searchTerm.toLowerCase();
    return (
      v.name.toLowerCase().includes(term) ||
      (v.tag && v.tag.toLowerCase().includes(term))
    );
  });

  // Guard:
  // -> If no videos exist at all, show empty-state message
  if (!videos.length) return <p>No videos uploaded yet.</p>;

  return (
    <div className="video-grid mt-4" id="VideoList">
      {/* Render one VideoCard per filtered video */}
      {filteredVideos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          coachUid={video.coachUid}
          mode={mode}
          onDelete={handleDelete}
        />
      ))}
      {/* Case where videos exist, but none match the search term */}
      {!filteredVideos.length && <p>No videos match your search.</p>}
    </div>
  );
}
