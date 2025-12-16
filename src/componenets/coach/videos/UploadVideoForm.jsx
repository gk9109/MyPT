import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../../../firebase/config";
import { useAuth } from "../../../firebase/AuthContext";
import LoaClipLoader from "../../shared/Loader2";
import { toast } from "react-toastify";

export default function UploadVideoForm({ onVideoAdded }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

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
      // ref creation and data fetching from google cloud storage
      const storageRef = ref(storage, `videos/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // adding related doc to firebase video collection
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
    
      // notify parent so list updates instantly
      if (onVideoAdded) {
        onVideoAdded({
          id: docRef.id,
          coachUid: user.uid,
          name: name.trim(),
          tag: tag.trim(),
          videoUrl: downloadURL,
          // local fallback; Firestore also has serverTimestamp
          createdAt: new Date(),
        });
      }
    
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

  if (loading) return <LoaClipLoader />;

  return (
    <form
      onSubmit={handleUpload}
      className="p-3 border rounded shadow-sm d-flex flex-column gap-2"
    >
      <h4>Upload New Video</h4>

      <input
        type="text"
        placeholder="Video name (e.g., Barbell Squat)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="form-control"
      />

      <input
        type="text"
        placeholder="Tag (optional, e.g., legs)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="form-control"
      />
      {/* input */}
      <input type="file" accept="video/*" onChange={handleFileChange} />

      <button type="submit" className="btn btn-primary" disabled={loading}>
        Upload
      </button>
    </form>
  );
}
