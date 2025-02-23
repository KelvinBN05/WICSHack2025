"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { auth } from "../lib/firebase"; //  Import Firebase auth
import "./styles/Navbar.css"; //  Import styles

const Navbar = () => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState("");

  //  Get logged-in user's username
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUser(user.email.split("@")[0]); // Extract username from email
      }
    });
  }, []);

  //  Function to navigate & force reload for Feed and Profile
  const handleReloadAndNavigate = (path) => {
    router.push(path); // Navigate
    setTimeout(() => {
      window.location.reload(); //  Forces styles to reapply
    }, 100); // Small delay ensures smooth transition
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => handleReloadAndNavigate("/feed")}>🏠 Home</button>
        
        {/*  Profile Button redirects to user's own profile */}
        <button className="nav-btn" onClick={() => handleReloadAndNavigate(`/user/${loggedInUser}`)}>
          👤 Profile
        </button>

        <button className="nav-btn" onClick={() => router.push("/login")}>🚪 Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
