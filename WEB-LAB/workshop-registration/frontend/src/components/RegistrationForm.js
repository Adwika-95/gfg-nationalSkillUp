import React, { useState } from "react";
import "./RegistrationForm.css";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other",
];

export default function RegistrationForm({ onViewParticipants }) {
  const [form, setForm] = useState({ name: "", department: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async () => {
    const { name, department } = form;
    if (!name.trim() || !department) {
      setStatus("error");
      setMessage("Please fill in your name and department.");
      return;
    }
    if (!agreed) {
      setStatus("error");
      setMessage("Please agree to the terms before registering.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), department }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(`You're in, ${name.trim().split(" ")[0]}! See you at the workshop.`);
        setForm({ name: "", department: "" });
        setAgreed(false);
      } else {
        setStatus("error");
        setMessage(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Server unreachable — make sure the backend is running on port 5000.");
    }
  };

  return (
    <div className="card">

      <div className="card-eyebrow">
        <span className="eyebrow-dot" />
        DevOps &amp; Web Dev Workshop
      </div>

      <h2 className="card-title">Join the Workshop</h2>
      <p className="card-subtitle">
        Reserve your spot — just your name and department, nothing else.
      </p>

      <div className="fields-wrap">
        <div className="field">
          <label htmlFor="name">Full Name <span className="required">*</span></label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Adwika"
            value={form.name}
            onChange={handleChange}
            disabled={status === "loading"}
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label htmlFor="department">Department <span className="required">*</span></label>
          <div className="select-wrap">
            <select
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              disabled={status === "loading"}
            >
              <option value="">— choose your department —</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <span className="select-arrow">▾</span>
          </div>
        </div>
      </div>

      {status === "success" && (
        <div className="alert success">
          <span className="alert-icon">✓</span>
          <div>
            <strong>Registered!</strong>
            <p>{message}</p>
            <button className="inline-link" onClick={onViewParticipants}>
              See all participants →
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="alert error">
          <span className="alert-icon">!</span>
          <p>{message}</p>
        </div>
      )}

      <label className="terms-row">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          disabled={status === "loading"}
        />
        <span>I agree to the terms &amp; Privacy Policy</span>
      </label>

      <button
        className={`submit-btn ${status === "loading" ? "loading" : ""}`}
        onClick={handleSubmit}
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <><span className="spinner" /> Registering…</>
        ) : (
          "Register Now →"
        )}
      </button>

      <p className="view-link">
        Already registered?{" "}
        <button className="inline-link" onClick={onViewParticipants}>
          View participant list
        </button>
      </p>
    </div>
  );
}