import { useState } from "react";
import { authClient } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const { error: resetErr } = await authClient.emailOtp.requestPasswordReset({
      email,
    });
    
    if (resetErr) {
      setError(resetErr.message || "Failed to send reset code.");
    } else {
      setMessage("A verification code has been sent to your email.");
      setStep(2);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const { error: resetErr } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password: newPassword,
    });

    if (resetErr) {
      setError(resetErr.message || "Failed to reset password. Check your OTP.");
    } else {
      setMessage("Password successfully reset! You can now log in.");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      {error && <div className="error">{error}</div>}
      {message && <div style={{ color: "green", marginBottom: "1rem" }}>{message}</div>}
      
      {step === 1 ? (
        <form onSubmit={handleRequestOtp}>
          <p>Enter your email to receive a password reset code.</p>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button type="submit">Send Code</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input 
            type="text" 
            placeholder="Verification OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="New Password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
}
