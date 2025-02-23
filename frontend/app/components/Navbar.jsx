"use client"; // ✅ Required for client-side rendering in Next.js

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "../lib/firebase";
import "./styles/Navbar.css";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Get the current page
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ✅ Fetch Logged-In User
  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const emailUsername = currentUser.email.split("@")[0]; // Extract username from email
        setLoggedInUser(emailUsername);
      } else {
        setLoggedInUser(null);
      }
    });
  }, []);

  // ✅ Fix UI Glitch: Use `router.replace()` instead of `push()`
  const navigateTo = (route) => {
    if (pathname !== route) {
      router.replace(route); // ✅ Prevent unnecessary page reloading
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login"); // ✅ Redirect to login
  };

  return (
    <nav className="navbar">
      <button onClick={() => navigateTo("/feed")}>🏠 Home</button>
      {loggedInUser && (
        <button onClick={() => navigateTo(`/user/${loggedInUser}`)}>👤 Profile</button>
      )}
      <button onClick={handleLogout}>🚪 Logout</button>
    </nav>
  );
};

export default Navbar;
