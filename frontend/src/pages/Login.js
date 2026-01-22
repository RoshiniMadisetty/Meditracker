import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import nurse from "../assets/nurse.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login error");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>Welcome back !!</h1>
        <p>Your health journey continues....</p>
      </div>

      <div className="login-image">
        <img src={nurse} alt="nurse" />
      </div>

      <div className="login-card">
        <div className="login-tabs">
          <span className="active-tab">Login</span>
          <Link to="/signup" className="inactive-tab">Sign Up</Link>
        </div>

        <form onSubmit={submit}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" className="login-btn">Login</button>

          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
