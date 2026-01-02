import React, { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../../firebase/config";
import { useAuth } from "../../../firebase/AuthContext";
import { toast } from "react-toastify";

// What this component does:
// -> Displays a single exercise/demo video in a card layout.
// -> Allows coaches to edit video metadata (name, tag).
// -> Allows coaches to delete videos (both Storage file + Firestore document).
// -> In client mode, the card is read-only (no edit/delete actions).
//
// Where it's used:
// -> Coach-side video management pages.
// -> Client-side workout views (read-only mode).
//
// Props:
// video (object)
// -> Video metadata object from Firestore.
// -> Expected fields: { id, name, tag?, videoUrl, createdAt }
//
// coachUid (string)
// -> UID of the coach who owns the video.
// -> Used to locate the correct Storage path and Firestore document.
//
// onDelete (function, optional)
// -> Callback fired after a successful delete.
// -> Receives the deleted video id.
// -> Allows parent to update UI without refetching.
//
// mode (string, default = "coach")
// -> "coach": edit & delete controls enabled.
// -> "client": read-only view (no mutations allowed).
//
// Notes:
// -> This component handles its own edit/delete logic.
// -> Firestore and Storage are kept in sync when deleting.
export default function VideoCard({ video, coachUid, onDelete, mode = "coach" }) {
  const { user } = useAuth();
  // Local UI state
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(video.name);
  const [newTag, setNewTag] = useState(video.tag || "");
  const [loading, setLoading] = useState(false);

  // Normalize createdAt:
  // -> Firestore Timestamp (has toDate())
  // -> or plain JS Date (local fallback)
  // -> Convert both into a readable string
  const createdAt = video.createdAt;
  let dateText = "N/A";

  if (createdAt?.toDate) {
    // Firestore Timestamp case
    dateText = createdAt.toDate().toLocaleDateString();
  } else if (createdAt instanceof Date) {
    // Plain JS Date case 
    dateText = createdAt.toLocaleDateString();
  }

  // Save edited metadata (coach only):
  // -> Updates name/tag in Firestore
  // -> Does NOT touch the video file itself
  const handleSave = async () => {
    if (!user || mode === "client") return;
    try {
      setLoading(true);

      const videoRef = doc(db, "videos", coachUid, "exercises", video.id);

      await updateDoc(videoRef, {
        name: newName.trim(),
        tag: newTag.trim(),
      });

      toast.success("Video updated");
      setEditing(false);
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Failed to update video");
    } finally {
      setLoading(false);
    }
  };

  // Delete video (coach only):
  // -> Confirm action with user
  // -> Delete file from Firebase Storage
  // -> Delete corresponding Firestore document
  // -> Notify parent component
  const handleDelete = async () => {
    if (!user || mode === "client") return;

    const confirmDelete = window.confirm("Delete this video permanently?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      // Extract file name from download URL
      const fileName = video.videoUrl.split("%2F").pop().split("?")[0];
      // Delete video file from Storage
      const storageRef = ref(storage, `videos/${coachUid}/${fileName}`);
      await deleteObject(storageRef);
      // Delete Firestore document
      const videoRef = doc(db, "videos", coachUid, "exercises", video.id);
      await deleteDoc(videoRef);
      // Inform parent so UI updates instantly
      if (onDelete) onDelete(video.id);

      toast.success("Video deleted");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 mb-3 shadow-sm" id="VideoCard">
      <video
        src={video.videoUrl}
        controls
        className="w-100 rounded mb-2"
        style={{ maxHeight: "600px", objectFit: "contain" }}
      />

      {editing ? (
        <>
          {/* Edit mode inputs */}
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
          {/* View mode */}
          <h5>{video.name}</h5>
          {video.tag && <p className="text-muted mb-1">Tag: {video.tag}</p>}
          <small className="text-secondary">
            Uploaded:{ dateText }
          </small>
          {/* Coach-only actions */}
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
