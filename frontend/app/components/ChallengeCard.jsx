"use client";
import React from "react";
import { useRouter } from "next/navigation"; // ✅ Use Next.js Router for Redirect
import "./ChallengeCard.css"; // Keep this import if styles exist

const ChallengeCard = ({ challenge }) => {
  const router = useRouter();

  // ✅ Redirect to Attempt Page with Challenge Info in URL
  const handleAttemptClick = () => {
    router.push(`/attempt?title=${encodeURIComponent(challenge.title)}&weight=${challenge.weight}&reps=${challenge.reps}`);
  };

  return (
    <div className="challenge-card">
      <img src="/challengebackground.png" alt="Background" className="challenge-bg" />

      <div className="challenge-content">
        <h2 className="challenge-title">{challenge.title}</h2>

        <div className="challenge-user">
          <div className="profile-pic"></div>
          <span>@{challenge.username}</span>
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
