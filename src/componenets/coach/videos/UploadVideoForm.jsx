import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../../../firebase/config"; 
import { useAuth } from "../../../firebase/AuthContext";  

export default function UploadVideoForm() {
  const { user } = useAuth(); // -> get logged in coach
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  // Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !name.trim()) {
      setMessage("Please choose a file and enter a name.");
      return;
    }
    if (!user) {
      setMessage("You must be logged in as a coach to upload.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Uploading...");

      // Create reference in Firebase Storage
      const storageRef = ref(storage, `videos/${user.uid}/${file.name}`);

      // Upload the file
      await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save metadata in Firestore
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

      setMessage("✅ Uploaded successfully!");
      console.log("Storage bucket:", storage.bucket);
      console.log("✅ Uploaded successfully!");
      console.log("User:", user);
      setName("");
      setTag("");
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("❌ Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

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

      <input type="file" accept="video/*" onChange={handleFileChange} />

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <small className="text-center mt-2">{message}</small>}
    </form>
  );
}
