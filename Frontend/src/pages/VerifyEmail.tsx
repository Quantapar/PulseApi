import { useState } from "react";
import { authClient } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error: verifyErr } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (verifyErr) {
      setError(verifyErr.message || "Failed to verify email. Please check your OTP.");
    } else {
      setMessage("Email verified successfully!");
      setTimeout(() => navigate("/me"), 2000);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    const { error: resendErr } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    if (resendErr) {
      setError(resendErr.message || "Failed to resend code.");
    } else {
      setMessage("A new code has been sent!");
    }
  };

  return (
    <div className="container">
      <h2>Verify Email</h2>
      <p>Please enter the OTP sent to your email address.</p>
      {error && <div className="error">{error}</div>}
      {message && <div style={{ color: "green", marginBottom: "1rem" }}>{message}</div>}
      
      <form onSubmit={handleVerify}>
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="OTP Code" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
          required 
        />
        <button type="submit">Verify Email</button>
      </form>
      <div style={{ marginTop: "1rem" }}>
        <button className="btn-secondary" type="button" onClick={handleResendOtp}>
          Resend Code
        </button>
      </div>
    </div>
  );
}
