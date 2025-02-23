"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { auth } from "../../lib/firebase";
import "./styles/userProfile.css"; // ✅ Import styles

export default function UserProfilePage() {
  const { username } = useParams(); // ✅ Get username from URL
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState(null);
  const [bio, setBio] = useState(""); // Editable bio
  const [profilePicture, setProfilePicture] = useState(""); // Editable profile picture
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch Logged-In User
  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const emailUsername = currentUser.email.split("@")[0]; // Extract username from email
        setLoggedInUser(emailUsername);
      }
    });
  }, []);

  // ✅ Fetch User Profile
  useEffect(() => {
    if (!username) return;

    const fetchUserProfile = async () => {
      try {
        console.log("🔍 Fetching profile for:", username);
        const response = await fetch(`http://localhost:5001/api/users/${username}`);
        
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        console.log("✅ Fetched User:", data);
        
        setUser(data);
        setBio(data.bio);
        setProfilePicture(data.profilePicture);
      } catch (error) {
        console.error("🔥 Error fetching profile:", error);
        setError("Failed to load profile.");
      }
    };

    fetchUserProfile();
  }, [username]);

  // ✅ Handle Profile Update
  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("bio", bio);
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    console.log("🔍 Sending request:", formData.get("bio"), formData.get("profilePicture"));

    try {
      const response = await fetch(`http://localhost:5001/api/users/${username}`, {
        method: "PUT",
        body: formData,
      });

      console.log("📡 Response Status:", response.status);
      const updatedUser = await response.json();
      console.log("✅ Response Data:", updatedUser);

      if (!response.ok) throw new Error("Failed to update profile");

      setUser(updatedUser.user);
      setProfilePicture(updatedUser.user.profilePicture);
      setIsEditing(false);
    } catch (error) {
      console.error("🔥 Error updating profile:", error);
    }
  };

  // ✅ Handle Image Preview Before Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setProfilePicture(previewURL);
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p className="loading-message">Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-info">
        {/* ✅ Profile Picture */}
        {user.profilePicture ? (
          <img
            src={selectedFile ? profilePicture : `http://localhost:5001${user.profilePicture}`} 
            alt="Profile"
            className="profile-pic"
          />
        ) : (
          <img 
            src="/default-profile.png" 
            alt="Default Profile" 
            className="profile-pic" 
          />
        )}

        <h1>{user.username}</h1>

        {/* ✅ Show Edit Button ONLY if Logged-In User is Viewing Their Own Profile */}
        {user.username === loggedInUser && (
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}

        {/* ✅ Show Editing Options Only If the User Clicks Edit */}
        {isEditing && (
          <>
            <input 
              type="text" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="edit-bio" 
            />
            
            {/* ✅ Upload Profile Picture */}
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="edit-profile-pic"
            />

            <button onClick={handleUpdateProfile}>Save</button>
          </>
        )}

        <p>{user.bio || "No bio available."}</p>
      </div>

      {/* ✅ Challenges Completed */}
      <div className="challenges">
        <h2>Challenges Completed</h2>
        {user.completedChallenges && user.completedChallenges.length > 0 ? (
          user.completedChallenges.map((challenge) => (
            <div key={challenge._id} className="challenge-card">
              <h3>{challenge.title}</h3>
              <p>{challenge.weight} lbs x {challenge.reps} reps</p>
            </div>
          ))
        ) : (
          <p>No challenges completed yet!</p>
        )}
      </div>
    </div>
  );
}
