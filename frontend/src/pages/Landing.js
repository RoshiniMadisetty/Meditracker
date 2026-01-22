import React from "react";
import { Link } from "react-router-dom";
import landing from "../assets/landing.png";

export default function Landing() {
  return (
    <div className="landing-wrapper">
      {/* Navbar */}
      <nav className="hero-nav">
        <div className="nav-left">
          <img src={require("../assets/logo.png")} alt="logo" className="hero-logo" />
          <span className="hero-title">MediTracker</span>
          <span className="hero-tagline">—  Your health , on schedule</span>
        </div>
        <Link to="/login" className="hero-login-btn">Login</Link>
      </nav>

      {/* Main Landing Content */}
      <div className="landing-main">
        <div className="landing-text">
          <h1 className="hero-heading">
            Never <br />
            forget a <br />
            <span className="highlight">DOSE</span> again
          </h1>

          <p className="hero-sub">
            Your personal medicine tracker and health companion
          </p>

          <Link to="/signup" className="hero-btn">Get Started</Link>
        </div>

        <div className="landing-image">
          <img src={landing} alt="App preview" />
        </div>
      </div>
    </div>
  );
}
