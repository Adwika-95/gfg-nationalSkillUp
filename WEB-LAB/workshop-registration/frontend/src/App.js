import React, { useState } from "react";
import RegistrationForm from "./components/RegistrationForm";
import ParticipantsList from "./components/ParticipantsList";
import "./App.css";

export default function App() {
  const [view, setView] = useState("register"); // "register" | "participants"

  return (
    <div className="app">
      {/* Floating stars */}
      <div className="stars" aria-hidden="true">
        {[...Array(40)].map((_, i) => (
          <span key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
          }} />
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-badge">ASTRO</div>
          <span className="header-tagline">Beyond Earth's Grasp</span>
        </div>
        <nav className="header-nav">
          <button
            className={`nav-btn ${view === "register" ? "active" : ""}`}
            onClick={() => setView("register")}
          >
            Register
          </button>
          <button
            className={`nav-btn ${view === "participants" ? "active" : ""}`}
            onClick={() => setView("participants")}
          >
            Participants
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="main">
        <div className="hero-side">
          {/* Planet is top-left; astronaut overlaps it from bottom-right */}
          <div className="hero-image-wrap">
            <div className="planet" />
          </div>
          <h1 className="hero-title">
            Exploring new<br />
            <span className="gradient-text">frontiers,</span><br />
            one step at a time.
          </h1>
          <p className="hero-sub">
            DevOps & Web Development Workshop.<br />
            Register below to secure your spot.
          </p>
          <div className="hero-stats">
            <div className="stat"><span>2</span><small>Days</small></div>
            <div className="stat-div" />
            <div className="stat"><span>8+</span><small>Sessions</small></div>
            <div className="stat-div" />
            <div className="stat"><span>Free</span><small>Entry</small></div>
          </div>
        </div>

        <div className="form-side">
          {view === "register" ? (
            <RegistrationForm onViewParticipants={() => setView("participants")} />
          ) : (
            <ParticipantsList onBack={() => setView("register")} />
          )}
        </div>
      </main>
    </div>
  );
}