"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation"; // ✅ Read challenge details from URL
import "./styles/attempt.css"; // ✅ Import styles

export default function AttemptPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const weight = searchParams.get("weight");
  const reps = searchParams.get("reps");

  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");

  // ✅ Handle Video Selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  // ✅ Handle Attempt Submission
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please upload a video!");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("caption", caption);
    formData.append("title", title); // Attach challenge details
    formData.append("weight", weight);
    formData.append("reps", reps);

    try {
      const response = await fetch("http://localhost:5001/api/attempts", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Video uploaded successfully!");
        setVideoFile(null);
        setCaption("");
      } else {
        console.error("Error uploading video");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="attempt-container">
      {/* ✅ Header (Unchanged) */}
      <header className="header">
        <div className="header-container">
          <img src="/Rectangle.png" alt="Background" className="header-bg" />
          <img src="/dbL.png" alt="Left Dumbbell" className="dumbbell" />
          <img src="/gainsville.png" alt="GainsVille Logo" className="gainsville-text" />
          <img src="/dbR.png" alt="Right Dumbbell" className="dumbbell" />
        </div>
      </header>

      {/* ✅ Challenge Details */}
      <div className="challenge-info">
        <h1>{title}</h1>
        <p><strong>Weight:</strong> {weight} lbs</p>
        <p><strong>Reps:</strong> {reps}</p>
      </div>

      {/* ✅ Upload Form */}
      <form className="upload-form" onSubmit={handleUpload}>
        <label className="video-upload">
          <input type="file" accept="video/*" onChange={handleVideoChange} hidden />
          <div className="upload-box">🎥 Tap to Upload New Attempt</div>
        </label>

        <input
          type="text"
          placeholder="Enter Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="caption-input"
        />

        <button type="submit" className="upload-btn">Upload</button>
      </form>
    </div>
  );
}
