"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { auth } from "../../lib/firebase";
import "./styles/userProfile.css";

export default function UserProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState(null);
  const [bio, setBio] = useState(""); 
  const [profilePicture, setProfilePicture] = useState(""); 
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setLoggedInUser(currentUser.email);
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
        setProfilePicture(data.profilePicture || "/defaultprofile.png"); // ✅ Use default image if empty
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
        {profilePicture && (
          <img src={profilePicture} alt="Profile" className="profile-pic" />
        )}
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

        {user.username === loggedInUser && ( 
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
