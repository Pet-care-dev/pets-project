import React, { useState, useEffect } from "react";
import API from "../api";
import "../styles/forgotPassword.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email → 2: OTP → 3: Reset
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [resending, setResending] = useState(false); // ⛔ prevent OTP spam
  const navigate = useNavigate();

  // ⏱ Countdown timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 🔘 Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await API.post("/password/send-otp", { email });
      setStep(2);
      setMessage("OTP sent to your email.");
      setTimer(30); // Start 30s timer
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP.");
    }
  };

  // 🔘 Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await API.post("/password/verify-otp", { email, otp });
      setStep(3);
      setMessage("OTP verified. Please enter your new password.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "OTP verification failed.");
    }
  };

  // 🔘 Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await API.post("/password/reset", {
        email,
        otp,
        new_password: newPassword,
      });
      setMessage("Password reset successful! Logging you in...");
      setError("");

      setTimeout(() => {
        navigate("/dashboard"); // Redirect after success
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password.");
    }
  };

  // ♻️ Resend OTP
  const handleResendOtp = async () => {
    if (resending || timer > 0) return;
    setResending(true);
    try {
      await API.post("/password/send-otp", { email });
      setMessage("OTP resent to your email.");
      setTimer(30);
      setError("");
    } catch (err) {
      setError("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="profile-circle">
          <img src="/logo512.png" alt="Logo" className="logo-image" />
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field full-width"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="submit-button full-width">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              className="input-field full-width"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="submit-button full-width">
              Verify OTP
            </button>
            <button
              type="button"
              className="submit-button full-width"
              onClick={handleResendOtp}
              disabled={timer > 0 || resending}
              style={{ backgroundColor: timer > 0 || resending ? "#999" : "#007BFF" }}
            >
              {timer > 0
                ? `Resend OTP in ${timer}s`
                : resending
                ? "Resending..."
                : "Resend OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Enter new password"
              className="input-field full-width"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="submit-button full-width">
              Reset Password
            </button>
          </form>
        )}

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <p className="signin-text">
          Back to <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
