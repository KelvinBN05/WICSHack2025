import React from "react";
import "./ChallengeCard.css"; // Import styles

const ChallengeCard = ({ challenge }) => {
  return (
    <div className="challenge-card">
      {/* Background Image */}
      <img src="/challengebackground.png" alt="Background" className="challenge-bg" />

      {/* Content */}
      <div className="challenge-content">
        {/* Title */}
        <h2 className="challenge-title">{challenge.title}</h2>

        {/* User Info */}
        <div className="challenge-user">
          <div className="profile-pic"></div>
          <span>@{challenge.username}</span>
        </div>

        {/* Details */}
        <p className="challenge-details">
          <strong>Weight:</strong> {challenge.weight} lbs <br />
          <strong>Reps:</strong> {challenge.reps}
        </p>

        {/* Buttons */}
        <div className="challenge-actions">
          <button className="attempt-btn">Attempt</button>
          <button className="like-btn">❤️</button>
          <button className="comment-btn">💬</button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
