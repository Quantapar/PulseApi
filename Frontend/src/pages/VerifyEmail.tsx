import { useState } from "react";
import { authClient, signIn } from "../lib/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Activity, Mail } from "lucide-react";

export default function VerifyEmail() {
  const location = useLocation();
  const passedEmail = (location.state as any)?.email || "";
  const passedPassword = (location.state as any)?.password || "";
  const [email, setEmail] = useState(passedEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error: verifyErr } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (verifyErr) {
      setLoading(false);
      setError(verifyErr.message || "Failed to verify email. Please check your OTP.");
    } else {
      if (passedPassword) {
        await signIn.email({ email, password: passedPassword });
      }
      navigate("/dashboard");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setResending(true);
    const { error: resendErr } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
    setResending(false);

    if (resendErr) {
      setError(resendErr.message || "Failed to resend code.");
    } else {
      setMessage("A new code has been sent!");
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
          <h2>Verify your email</h2>
          <p>
            {passedEmail
              ? <>Enter the code sent to <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{passedEmail}</span></>
              : "Enter the verification code sent to your email"
            }
          </p>
        </div>

        {error && <div className="error">{error}</div>}
        {message && (
          <div style={{ background: "rgba(82, 179, 101, 0.1)", border: "1px solid rgba(82, 179, 101, 0.2)", color: "var(--accent-primary)", padding: "0.75rem", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleVerify}>
          {!passedEmail && (
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Verification Code</label>
            <input
              type="text"
              placeholder="******"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              autoFocus
              style={{ letterSpacing: "0.15em", textAlign: "center", fontSize: "1.05rem" }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", marginTop: "0.5rem" }}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontFamily: "var(--font-body)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "var(--transition-fast)",
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = "var(--text-main)"; }}
            onMouseOut={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <Mail size={14} />
            {resending ? "Sending..." : "Resend code"}
          </button>
        </div>

        <div className="auth-footer">
          Already verified? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
