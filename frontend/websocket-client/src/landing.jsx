import React from "react";
import "./landing.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Landing = () => {
  const navigate = useNavigate(); // Initialize navigate
  const handleLoginClick = () => {
    navigate("/login"); // Navigate to the login page
  };
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
      <img src="logo.png" width="100" height="65"/>
        <ul className="menu">
          <li>Home</li>
          <li>About</li>
          <li>Start Bidding</li>
        </ul>
        <button className="btn1" onClick={handleLoginClick}>Login</button>
      </nav>

      {/* Main Content */}
      <div className="main-container">
        <spline-viewer
          className="spline-viewer"
          url="https://prod.spline.design/p52NtYAzfE9p1O1v/scene.splinecode"
        ></spline-viewer>
        <div className="text-container">
          <h1 className="text1">
            A New Way <br /> To Auction.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Landing;
