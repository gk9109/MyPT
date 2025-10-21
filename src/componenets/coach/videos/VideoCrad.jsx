import React, { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useAuth } from "../../../firebase/AuthContext";

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
      const videoRef = doc(db, "videos", coachUid, "exercises", video.id);
      await updateDoc(videoRef, {
        name: newName.trim(),
        tag: newTag.trim(),
      });
      setEditing(false);
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Delete video ---
  const handleDelete = async () => {
    if (!user || mode === "client") return;
    const confirmDelete = window.confirm("Delete this video?");
    if (!confirmDelete) return;
    try {
      const videoRef = doc(db, "videos", coachUid, "exercises", video.id);
      await deleteDoc(videoRef);
      if (onDelete) onDelete(video.id); // notify parent to refresh
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="card p-3 mb-3 shadow-sm" id="VideoCrad">
      <video
        src={video.videoUrl}
        controls
        className="w-100 rounded mb-2"
        style={{ maxHeight: "600px", objectFit: "conatain" }}
      />

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
          <h5>{video.name}</h5>
          {video.tag && <p className="text-muted mb-1">Tag: {video.tag}</p>}
          <small className="text-secondary">
            Uploaded:{" "}
            {video.createdAt?.toDate
              ? video.createdAt.toDate().toLocaleDateString()
              : "N/A"}
          </small>

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
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
