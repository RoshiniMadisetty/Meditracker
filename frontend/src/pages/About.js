import React from "react";
import hero from "../assets/nurse.png"; // or use your landing image

export default function About() {
  return (
    <div className="about-container">

      {/* Header Hero */}
      <div className="about-hero">
        <div className="hero-text">
          <h1>About MediTracker</h1>
          <p>Your personal medicine schedule & reminder companion.</p>
        </div>
        <img src={hero} alt="MediTracker assistant" className="about-img" />
      </div>

      {/* What app does */}
      <section className="about-section">
        <h2>Why MediTracker?</h2>
        <p>
          MediTracker helps you take medicines on time, avoid missed doses, and maintain better health.  
          Designed for students, elderly users, and patients on regular medication.
        </p>

        <div className="feature-grid">

          <div className="feature-card">
            <span className="icon">⏰</span>
            <h3>Smart Reminders</h3>
            <p>Never miss a dose with timely alerts.</p>
          </div>

          <div className="feature-card">
            <span className="icon">📋</span>
            <h3>Schedule Medicines</h3>
            <p>Set medicines with time, dates, and frequency.</p>
          </div>

          <div className="feature-card">
            <span className="icon">✅</span>
            <h3>Track Progress</h3>
            <p>Mark doses as taken to stay consistent.</p>
          </div>

          <div className="feature-card">
            <span className="icon">🔔</span>
            <h3>Notifications</h3>
            <p>Receive alerts when it's medicine time.</p>
          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="steps-section">
        <h2>How It Works?</h2>
        <ol>
          <li>Add your medicines</li>
          <li>Set dosage time & dates</li>
          <li>Receive reminder alerts</li>
          <li>Mark doses as taken ✅</li>
        </ol>
      </section>

      {/* Support */}
      <section className="support-card">
        <h3>Need Help?</h3>
        <p>If you have any questions or suggestions, contact us:</p>
        <p><b>Email:</b> meditracker.support@gmail.com</p>
      </section>
    </div>
  );
}
