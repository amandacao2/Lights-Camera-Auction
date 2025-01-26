import React from "react";
import "./landing.css";

const Landing = () => {
  return (
    <div>
      {/* Teapot Section */}
      <spline-viewer url="https://prod.spline.design/p52NtYAzfE9p1O1v/scene.splinecode"></spline-viewer>
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

      {/* Main Content Section */}
      <main className="mainarea">
        <h1 className="text1" style={{ textAlign: "right" }}>
          A New Way <br /> To Auction.
        </h1>
      </main>
    </div>
  );
};

export default Landing;
