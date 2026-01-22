import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import nurse from "../assets/nurse.png";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Corrected endpoint
      const res = await API.post("/auth/signup", form);

      // Save token & user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate to dashboard after signup
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Signup error");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>Join MediTracker</h1>
        <p>Your health companion starts here…</p>
      </div>

      <div className="login-image">
        <img src={nurse} alt="nurse" />
      </div>

      <div className="login-card">
        <div className="login-tabs">
          <Link to="/login" className="inactive-tab">Login</Link>
          <span className="active-tab">Sign Up</span>
        </div>

        <form onSubmit={submit}>
          <label>Name:</label>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit" className="login-btn">Sign Up</button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
