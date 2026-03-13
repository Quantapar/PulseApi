import { useState, useEffect, useRef } from "react";
import { authClient, signUp, signIn, useSession } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { API_URL } from "../lib/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSigningUp = useRef(false);
  const navigate = useNavigate();

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session && !isSigningUp.current) {
      navigate("/dashboard");
    }
  }, [session, isPending, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const checkRes = await fetch(`${API_URL}/api/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const { exists } = await checkRes.json();
      if (exists) {
        setLoading(false);
        setError("An account with this email already exists. Please sign in instead.");
        return;
      }
    } catch {
      // If check fails, let signup proceed and handle errors there
    }

    isSigningUp.current = true;
    const { data, error: signUpErr } = await signUp.email({
      email,
      password,
      name,
    });
    if (signUpErr) {
      isSigningUp.current = false;
      setLoading(false);
      const msg = signUpErr.message || "An unknown error occurred";
      if (
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("exists")
      ) {
        setError(
          "An account with this email already exists. Please sign in instead.",
        );
      } else {
        setError(msg);
      }
    } else if (!data) {
      isSigningUp.current = false;
      setLoading(false);
      setError(
        "An account with this email already exists. Please sign in instead.",
      );
    } else {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
      navigate("/verify-email", { state: { email, password } });
    }
  };

  const handleGoogleSignUp = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  };

  return (
    <div className="auth-container">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <div className="glass-panel auth-card">
        <div className="auth-header">
          <Link
            to="/"
            className="logo"
            style={{
              justifyContent: "center",
              marginBottom: "1.5rem",
              textDecoration: "none",
            }}
          >
            <Activity size={22} color="var(--accent-primary)" />
            <span style={{ color: "var(--text-main)" }}>Pulse</span>
            <span style={{ color: "var(--accent-primary)" }}>API</span>
          </Link>
          <h2>Create Account</h2>
          <p>Start monitoring your APIs in seconds.</p>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div
          style={{
            margin: "2rem 0",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            color: "var(--text-secondary)",
          }}
        >
          <hr style={{ flex: 1, borderColor: "var(--border-color)" }} />
          <span style={{ fontSize: "0.85rem" }}>OR</span>
          <hr style={{ flex: 1, borderColor: "var(--border-color)" }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="btn btn-secondary"
          style={{
            width: "100%",
            marginBottom: "1.5rem",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            width={20}
            alt="Google"
          />
          Sign Up with Google
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
