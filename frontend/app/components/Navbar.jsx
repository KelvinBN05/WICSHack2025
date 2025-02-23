// components/Navbar.js
"use client";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="navbar">
      <ul>
        <li onClick={() => router.push("/")}>Home</li>
        <li onClick={() => router.push("/create")}>Create</li>
        <li onClick={() => router.push("/leaderboard")}>Leaderboard</li>
        <li onClick={() => router.push("/profile")}>Profile</li>
      </ul>
    </nav>
  );
};

export default Navbar;
