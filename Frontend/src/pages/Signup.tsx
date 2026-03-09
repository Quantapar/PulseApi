import { useState, useEffect } from "react";
import { authClient, signUp, signIn, useSession } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { Activity } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) {
      navigate("/me");
    }
  }, [session, isPending, navigate]);


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error: signUpErr } = await signUp.email({
      email,
      password,
      name,
    });
    if (signUpErr) {
      setError(signUpErr.message || "An unknown error occurred");
    } else {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
      navigate("/verify-email");
    }
  };

  const handleGoogleSignUp = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173/me",
    });
  };

  if (isPending) return null;

  return (
    <div className="auth-container">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <div className="glass-panel auth-card">
         <div className="auth-header">
            <Link to="/" className="logo-link">
                <Activity color="var(--accent-primary)" size={24} />
                PulseAPI
            </Link>
            <h2>Create Account</h2>
            <p>Start monitoring your APIs in seconds.</p>
        </div>

        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Sign Up</button>
        </form>
        
        <div style={{ margin: "2rem 0", display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
           <hr style={{ flex: 1, borderColor: 'var(--border-color)' }} />
           <span style={{ fontSize: '0.85rem' }}>OR</span>
           <hr style={{ flex: 1, borderColor: 'var(--border-color)' }} />
        </div>

        <button type="button" onClick={handleGoogleSignUp} className="btn btn-secondary" style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} alt="Google" />
          Sign Up with Google
        </button>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
