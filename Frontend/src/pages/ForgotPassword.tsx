import { useState } from "react";
import { authClient } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { Activity } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error: resetErr } = await authClient.emailOtp.requestPasswordReset({
      email,
    });

    setLoading(false);

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
    setMessage("");
    setLoading(true);

    const { error: resetErr } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password: newPassword,
    });

    setLoading(false);

    if (resetErr) {
      setError(resetErr.message || "Failed to reset password. Check your OTP.");
    } else {
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="auth-container">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <Link to="/" className="logo" style={{ justifyContent: "center", marginBottom: "1.5rem", textDecoration: "none" }}>
            <Activity size={22} color="var(--accent-primary)" />
            <span style={{ color: "var(--text-main)" }}>Pulse</span>
            <span style={{ color: "var(--accent-primary)" }}>API</span>
          </Link>
          <h2>{step === 1 ? "Reset password" : "Set new password"}</h2>
          <p>
            {step === 1
              ? "Enter your email and we'll send you a reset code"
              : <>Enter the code sent to <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{email}</span></>
            }
          </p>
        </div>

        {error && <div className="error">{error}</div>}
        {message && (
          <div style={{ background: "rgba(82, 179, 101, 0.1)", border: "1px solid rgba(82, 179, 101, 0.2)", color: "var(--accent-primary)", padding: "0.75rem", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", marginTop: "0.5rem" }}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoFocus
                style={{ letterSpacing: "0.15em", textAlign: "center", fontSize: "1.05rem" }}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", marginTop: "0.5rem" }}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
