import React, { useState } from "react";
import UploadVideoForm from "../../componenets/coach/videos/UploadVideoForm";
import VideoSearchBar from "../../componenets/coach/videos/VideoSearchBar";
import VideoList from "../../componenets/coach/videos/VideoList";

export default function UploadVideosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container py-4">
      <h2>My Videos</h2>

      <UploadVideoForm />
      <VideoSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <VideoList mode="coach" searchTerm={searchTerm} />
    </div>
  );
}
