import React from "react";
import "./landing.css";

const Landing = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <h3 className="logo">Logo</h3>
        <ul className="menu">
          <li>Home</li>
          <li>About</li>
          <li>Start Bidding</li>
        </ul>
        <button className="btn1">Login</button>
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
