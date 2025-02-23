"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Track whether the user is signing up or logging in
  const [user, setUser] = useState<null | User>(null); // Store user authentication state
  const router = useRouter();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
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
      if (isSignup) {
        // Sign up a new user
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/"); // Redirect to home after successful signup
      } else {
        // Log in existing user
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/"); // Redirect to home after successful login
      }
    } catch (err: any) {
      setError(isSignup ? "Error signing up. Please try again." : "Failed to log in. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login page after logout
    } catch (err: any) {
      setError("Error logging out. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      {!user ? (
        <>
          <h1>{isSignup ? "Sign Up" : "Log In"}</h1>
          <form onSubmit={handleAuth}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? (isSignup ? "Signing Up..." : "Logging In...") : (isSignup ? "Sign Up" : "Log In")}
            </button>
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
  );
}
