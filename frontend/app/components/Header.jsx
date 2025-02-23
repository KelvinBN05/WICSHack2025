// components/Header.js
"use client";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <img src="/Rectangle.png" alt="Background" className="header-bg" />
        <img src="/dbL.png" alt="Left Dumbbell" className="dumbbell" />
        <img src="/gainsville.png" alt="GainsVille Logo" className="gainsville-text" />
        <img src="/dbR.png" alt="Right Dumbbell" className="dumbbell" />
      </div>
      <Navbar />
    </header>
  );
};

export default Header;
