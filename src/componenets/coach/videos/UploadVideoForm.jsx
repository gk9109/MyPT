import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../../../firebase/config";
import { useAuth } from "../../../firebase/AuthContext";
import LoaClipLoader from "../../shared/Loader2";
import { toast } from "react-toastify";

// What this component does:
// -> Allows a coach to upload exercise demo videos.
// -> Uploads the video file to Firebase Storage.
// -> Saves video metadata (name, tag, URL) in Firestore.
// -> Notifies the parent component so the video list updates instantly.
//
// Where it's used:
// -> Coach-side pages for managing exercise/demo videos.
//
// Props:
// onVideoAdded (function, optional)
// -> Callback fired after a successful upload.
// -> Receives the newly created video object.
// -> Used by the parent to update UI without refetching from Firestore.
//
// Notes:
// -> This component handles both Storage and Firestore operations.
// -> A loading state is shown while the upload is in progress.
export default function UploadVideoForm({ onVideoAdded }) {
  const { user } = useAuth();
  // Local form state
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection from input
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  // Upload handler:
  // -> Validate inputs and user authentication
  // -> Upload video file to Firebase Storage
  // -> Store metadata in Firestore
  // -> Notify parent component on success
  const handleUpload = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!file || !name.trim()) {
      toast.error("Please choose a file and enter a video name.");
      return;
    }
    if (!user) {
      toast.error("You must be logged in as a coach to upload.");
      return;
    }

    try {
      setLoading(true);
      // Create a Storage reference under the coach's folder
      const storageRef = ref(storage, `videos/${user.uid}/${file.name}`);
      // Upload raw video file to Firebase Storage
      await uploadBytes(storageRef, file);
      // Get public download URL for playback
      const downloadURL = await getDownloadURL(storageRef);

      // Save video metadata in Firestore (linked to coach)
      const docRef = await addDoc(
        collection(db, "videos", user.uid, "exercises"),
        {
          coachUid: user.uid,
          name: name.trim(),
          tag: tag.trim(),
          videoUrl: downloadURL,
          createdAt: serverTimestamp(),
        }
      );
    
      // Inform parent so UI updates immediately (no refetch needed)
      if (onVideoAdded) {
        onVideoAdded({
          id: docRef.id,
          coachUid: user.uid,
          name: name.trim(),
          tag: tag.trim(),
          videoUrl: downloadURL,
          // Local timestamp fallback (Firestore also stores serverTimestamp)
          createdAt: new Date(),
        });
      }
      // Reset form state
      toast.success("Video uploaded successfully");
      setName("");
      setTag("");
      setFile(null);
    } catch (error) {
      console.log("error:", error);
      toast.error('There was an error', error);
    } finally {
      setLoading(false);
    }
  }

  // Show loader while upload is in progress
  if (loading) return <LoaClipLoader />;

  return (
    <form
      onSubmit={handleUpload}
      className="p-3 border rounded shadow-sm d-flex flex-column gap-2"
    >
      <h4>Upload New Video</h4>
      {/* Video display name */}
      <input
        type="text"
        placeholder="Video name (e.g., Barbell Squat)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="form-control"
      />
      {/* Optional tag for filtering / grouping */}
      <input
        type="text"
        placeholder="Tag (optional, e.g., legs)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="form-control"
      />
      {/* Video file input */}
      <input type="file" accept="video/*" onChange={handleFileChange} />
      {/* Submit upload */}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Upload
      </button>
    </form>
  );
}
