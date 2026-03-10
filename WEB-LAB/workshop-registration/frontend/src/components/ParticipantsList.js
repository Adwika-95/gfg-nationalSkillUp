import React, { useState, useEffect } from "react";
import "./ParticipantsList.css";

export default function ParticipantsList({ onBack }) {
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const fetchParticipants = async () => {
    setStatus("loading");
    try {
      const res = await fetch("http://localhost:5000/participants");
      const data = await res.json();
      if (res.ok) {
        setParticipants(data.participants);
        setStatus("done");
      } else {
        setError(data.error || "Failed to fetch participants.");
        setStatus("error");
      }
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <div className="participants-card">
      <div className="p-header">
        <div>
          <h2 className="p-title">Registered Participants</h2>
          <p className="p-count">
            {status === "done" ? `${participants.length} student${participants.length !== 1 ? "s" : ""} enrolled` : "Loading..."}
          </p>
        </div>
        <div className="p-actions">
          <button className="refresh-btn" onClick={fetchParticipants} title="Refresh">↻</button>
          <button className="back-btn" onClick={onBack}>← Register</button>
        </div>
      </div>

      {status === "loading" && (
        <div className="p-loading">
          <div className="load-orbit">
            <div className="load-dot" />
          </div>
          <p>Fetching participants...</p>
        </div>
      )}

      {status === "error" && (
        <div className="p-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {status === "done" && participants.length === 0 && (
        <div className="p-empty">
          <span>🚀</span>
          <p>No participants yet. Be the first to register!</p>
        </div>
      )}

      {status === "done" && participants.length > 0 && (
        <div className="p-list">
          {participants.map((p, i) => (
            <div key={p.id} className="p-item" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="p-avatar">{p.name.charAt(0).toUpperCase()}</div>
              <div className="p-info">
                <span className="p-name">{p.name}</span>
                <span className="p-dept">{p.department}</span>
              </div>
              <div className="p-badge">#{String(p.id).padStart(3, "0")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
