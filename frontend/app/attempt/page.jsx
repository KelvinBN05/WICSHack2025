"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase"; //  Ensure correct import
import "./styles/attempt.css"; 

export default function AttemptPage() {
  const { challengeId } = useParams(); //  Get challengeId from URL
  const [user, setUser] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");
  const router = useRouter(); //  Handle navigation

  useEffect(() => {
    //  Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login"); //  Redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]); //  Store selected video file
  };

  const handleSubmitAttempt = async () => {
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("caption", caption);
    formData.append("username", user?.email.split("@")[0]); //  Extract username from email

    try {
      const response = await fetch(`http://localhost:5001/api/challenges/${challengeId}/attempt`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload attempt");
      alert("Attempt uploaded successfully!");
      router.push("/feed"); //  Redirect after successful upload
    } catch (error) {
      console.error("🔥 Error uploading attempt:", error);
    }
  };

  return (
    <div className="attempt-container">
      <h1>Attempt Challenge</h1>
      {user ? <p>Logged in as {user.email}</p> : <p>Redirecting to login...</p>}
      
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Enter caption" />
      <button onClick={handleSubmitAttempt}>Upload Attempt</button>
    </div>
  );
}
