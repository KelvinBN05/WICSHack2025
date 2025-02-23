// pages/index.js
"use client";
import Header from "../components/Header";
import Profile from "../components/Profile";
import ChallengeCard from "../components/ChallengeCard";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetch("/api/challenges") // Adjust API route
      .then((res) => res.json())
      .then((data) => setChallenges(data))
      .catch((err) => console.error("Error fetching challenges:", err));
  }, []);

  return (
    <div className="container">
      <Header />
      <Profile />
      <div className="challenges">
        {challenges.length > 0 ? (
          challenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)
        ) : (
          <p>No challenges yet!</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
