"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./ChallengeCard.css"; //  Keep styling import

const ChallengeCard = ({ challenge }) => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState("/default-profile.png"); // Default PFP

  //  Fetch user profile to get correct profile picture
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${challenge.username}`);
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfilePicture(data.profilePicture ? `http://localhost:5001${data.profilePicture}` : "/default-profile.png");
      } catch (error) {
        console.error("🔥 Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [challenge.username]); //  Runs when challenge username changes

  //  Redirect & Force Reload to Fix UI Bugs
  const handleProfileRedirect = (username) => {
    router.push(`/user/${username}`); // Navigate to user profile
    setTimeout(() => {
      window.location.reload(); //  Forces styles to reapply
    }, 100);
  };

  //  Redirect to Attempt Page with Challenge Info in URL
  const handleAttemptClick = () => {
    router.push(`/attempt?title=${encodeURIComponent(challenge.title)}&weight=${challenge.weight}&reps=${challenge.reps}`);
  };

  return (
    <div className="challenge-card">
      <img src="/challengebackground.png" alt="Background" className="challenge-bg" />

      <div className="challenge-content">
        <h2 className="challenge-title">{challenge.title}</h2>

        <div className="challenge-user">
          {/*  Correct Profile Picture from User Schema */}
          <img 
            src={profilePicture} 
            alt="Profile" 
            className="profile-pic"
          />

          {/*  Clickable Username Redirects to Profile */}
          <span 
            className="challenge-username"
            onClick={() => handleProfileRedirect(challenge.username)}
            style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }} //  Clickable style
          >
            @{challenge.username}
          </span>
        </div>

        <p className="challenge-details">
          <strong>Weight:</strong> {challenge.weight} lbs <br />
          <strong>Reps:</strong> {challenge.reps}
        </p>

        <div className="challenge-actions">
          <button className="attempt-btn" onClick={handleAttemptClick}>Attempt</button>
          <button className="like-btn">❤️</button>
          <button className="comment-btn">💬</button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
