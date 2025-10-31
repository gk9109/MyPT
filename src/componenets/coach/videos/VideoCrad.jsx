import React, { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage"; // ✅ for deleting file from Storage
import { db, storage } from "../../../firebase/config"; // ✅ make sure storage is exported here
import { useAuth } from "../../../firebase/AuthContext";

/*
  COMPONENT PURPOSE:
  ------------------
  - Displays a single uploaded video (coach or client view).
  - Allows coaches to edit video name/tag and delete videos.
  - Clients can only view videos (no edit/delete).
  - When deleting, it removes BOTH the Firestore doc and the actual file from Firebase Storage.
*/

export default function VideoCard({ video, coachUid, onDelete, mode = "coach" }) {
  // mode -> "coach" = full access | "client" = view-only
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(video.name);
  const [newTag, setNewTag] = useState(video.tag || "");
  const [loading, setLoading] = useState(false);

  // --- Update video name/tag ---
  const handleSave = async () => {
    if (!user || mode === "client") return; // protect client side
    try {
      setLoading(true);

      // Reference to the Firestore document of this video
      const videoRef = doc(db, "videos", coachUid, "exercises", video.id);

      // Update the video's name and tag
      await updateDoc(videoRef, {
        name: newName.trim(),
        tag: newTag.trim(),
      });

      // Close edit mode
      setEditing(false);
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Delete video from both Firestore and Storage ---
  const handleDelete = async () => {
    if (!user || mode === "client") return; // only allow coaches to delete

    // Ask for confirmation before deleting permanently
    const confirmDelete = window.confirm("Delete this video permanently?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      // 1️⃣ Extract the filename from the video's download URL
      // The URL looks like: https://firebasestorage.googleapis.com/v0/b/.../o/videos%2FcoachUid%2FfileName.mp4?...
      // So we split and decode the part after the last "%2F"
      const fileName = video.videoUrl.split("%2F").pop().split("?")[0];

      // 2️⃣ Reference the exact file in Firebase Storage
      const storageRef = ref(storage, `videos/${coachUid}/${fileName}`);

      // 3️⃣ Delete the actual video file from Firebase Storage
      await deleteObject(storageRef);

      // 4️⃣ Delete the video metadata (document) from Firestore
      const videoRef = doc(db, "videos", coachUid, "exercises", video.id);
      await deleteDoc(videoRef);

      // 5️⃣ Update local UI list via parent callback
      if (onDelete) onDelete(video.id);

      alert("✅ Video deleted successfully.");
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("❌ Failed to delete video. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 mb-3 shadow-sm" id="VideoCard">
      {/* --- Video player preview --- */}
      <video
        src={video.videoUrl}
        controls
        className="w-100 rounded mb-2"
        style={{ maxHeight: "600px", objectFit: "contain" }}
      />

      {/* --- Edit mode section --- */}
      {editing ? (
        <>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="form-control mb-2"
          />
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Tag"
            className="form-control mb-2"
          />

          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* --- Regular (view) mode --- */}
          <h5>{video.name}</h5>
          {video.tag && <p className="text-muted mb-1">Tag: {video.tag}</p>}
          <small className="text-secondary">
            Uploaded:{" "}
            {video.createdAt?.toDate
              ? video.createdAt.toDate().toLocaleDateString()
              : "N/A"}
          </small>

          {/* --- Buttons for coach only --- */}
          {mode === "coach" && (
            <div className="mt-2 d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
