// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", {
        email: formData.email,
        password: formData.password
      });

      console.log("Login success:", res.data);
      localStorage.setItem("token", res.data.access_token);
      alert("Login successful!");
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.detail || "Login failed!";
      alert(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="profile-circle">
          <img src="/logo512.png" alt="Logo" className="logo-image" />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field full-width"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field full-width"
            onChange={handleChange}
            value={formData.password}
            required
          />

          <button type="submit" className="submit-button full-width">
            Login
          </button>
        </form>

        <p className="forgot-text">
          <a href="/forgot-password">Forgot password?</a>
        </p>

        <p className="signin-text">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}
