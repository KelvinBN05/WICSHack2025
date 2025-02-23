"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Track whether the user is signing up or logging in
  const [user, setUser] = useState(null); // Store user authentication state
  const router = useRouter();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(""); // Reset any previous errors
    setLoading(true); // Show loading state

    // Basic email format validation using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Password cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      let userCredential;
      if (isSignup) {
        // ✅ Sign up a new user
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // ✅ Log in existing user
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;

      // ✅ Automatically extract username from email before '@'
      const username = email.split("@")[0];

      // ✅ Default profile values
      const profilePicture = "/defaultprofile.png"; // Set default profile picture
      const bio = "New to GainsVille!"; // Set default bio

      // ✅ Send user data to backend
      const response = await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          username, // ✅ Username set automatically
          profilePicture,
          bio,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        router.push("/feed"); // Redirect to home or user dashboard
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }

    } catch (err) {
      setError(isSignup ? "Error signing up. Please try again." : "Failed to log in. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login page after logout
    } catch (err) {
      setError("Error logging out. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <header className="header">
        <div className="header-container">
          <img src="/Rectangle.png" alt="Background" className="header-bg" />
          <img src="/dbL.png" alt="Left Dumbbell" className="dumbbell" />
          <img src="/gainsville.png" alt="GainsVille Logo" className="gainsville-text" />
          <img src="/dbR.png" alt="Right Dumbbell" className="dumbbell" />
        </div>
      </header>
      <div className="login-box">
        {!user ? (
          <>
            <h1>{isSignup ? "Sign Up" : "Log In"}</h1>
            <form onSubmit={handleAuth}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />

              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              {error && <p className="error">{error}</p>}
              <button type="submit" disabled={loading}>
                {loading ? (isSignup ? "Signing Up..." : "Logging In...") : (isSignup ? "Sign Up" : "Log In")}
              </button>

              <a href="#">Forgot password?</a>
            </form>
            <div className="toggle-auth">
              <p>
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => setIsSignup(!isSignup)}>
                  {isSignup ? "Log In" : "Sign Up"}
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="logged-in">
            <h2>Welcome, {user?.email}</h2>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
