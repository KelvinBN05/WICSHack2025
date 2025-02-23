"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { auth } from "../../lib/firebase"; // ✅ Firebase for authentication
import "./styles/userProfile.css"; // ✅ Import styles

export default function UserProfilePage() {
  const { username } = useParams(); // ✅ Get username from URL
  const [user, setUser] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [error, setError] = useState(null);
  const [bio, setBio] = useState(""); // Editable bio
  const [profilePicture, setProfilePicture] = useState(""); // Editable profile picture
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // ✅ Fetch logged-in user's username from Firebase Auth
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setLoggedInUsername(currentUser.email.split("@")[0]); // ✅ Extract username from email
      }
    });

    if (!username) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${username}`);
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setUser(data);
        setBio(data.bio);
        setProfilePicture(data.profilePicture || "/default-profile.png"); // ✅ Use default if empty
      } catch (error) {
        console.error("🔥 Error fetching profile:", error);
        setError("Failed to load profile.");
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, profilePicture }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      const updatedUser = await response.json();
      setUser(updatedUser.user);
      setIsEditing(false);
    } catch (error) {
      console.error("🔥 Error updating profile:", error);
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p className="loading-message">Loading...</p>;

  return (
    <div className="profile-container">
      {/* ✅ Profile Section */}
      <div className="profile-info">
        <img src={profilePicture} alt="Profile" className="profile-pic" />

        <h1>{user.username}</h1>

        {isEditing ? (
          <>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="edit-bio"
            />
            <input
              type="text"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              className="edit-profile-pic"
              placeholder="Enter image URL"
            />
          </>
        ) : (
          <p>{user.bio}</p>
        )}

        {/* ✅ Show Edit Button if Logged-In User is Viewing Their Own Profile */}
        {username === loggedInUsername && ( 
          isEditing ? (
            <button onClick={handleUpdateProfile}>Save</button>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )
        )}
      </div>

      {/* ✅ Challenges Completed */}
      <div className="challenges">
        <h2>Challenges Completed</h2>
        {user.completedChallenges.length > 0 ? (
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
