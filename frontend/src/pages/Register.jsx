import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/register.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
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
      const res = await API.post("/register", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password
      });

      console.log("Server response:", res.data);
      alert("Registration successful!");
      navigate("/login"); // Redirect to login page after success
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Something went wrong.";
      alert("Registration failed: " + errorMessage);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="profile-circle">
          <img src="/logo512.png" alt="Logo" className="logo-image" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="text"
              name="first_name"
              placeholder="First name"
              className="input-field half-width"
              onChange={handleChange}
              value={formData.first_name}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last name"
              className="input-field half-width"
              onChange={handleChange}
              value={formData.last_name}
              required
            />
          </div>

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
            Register
          </button>
        </form>

        <p className="signin-text">
          Already have an account? <a href="/login">Sign in.</a>
        </p>
      </div>
    </div>
  );
}
