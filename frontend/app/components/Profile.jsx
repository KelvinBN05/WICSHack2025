"use client";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    if (!user) return; // Wait until user state is available
  
    fetch(`/api/users/${user.id}`) // Replace :id with actual user ID
      .then((res) => {
        if (!res.ok) {
          setError(`HTTP error! Status: ${res.status}`);
          return res.text(); // Read response as text to inspect the error page
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Error fetching user data");
      });
  }, [user]);

  return (
    <div className="profile">
      {error ? (
        <p>Error: {error}</p> // Display error message
      ) : user ? (
        <>
          <img src={user.profilePicture || "/default-avatar.png"} alt="Profile" className="profile-pic" />
          <h2>@{user.username}</h2>
          <p>{user.bio || "No bio yet!"}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
