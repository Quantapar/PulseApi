import { useState, useEffect } from "react";
import { signIn, useSession } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) {
      navigate("/dashboard");
    }
  }, [session, isPending, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error: signInErr } = await signIn.email({
      email,
      password,
    });
    if (signInErr) {
      setError(signInErr.message || "An error occurred");
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  };

  if (isPending) return null; 

  return (
    <div className="auth-container">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="glass-panel auth-card">
        <div className="auth-header">
            <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: '1.5rem', textDecoration: 'none' }}>
                <span style={{ color: 'var(--text-main)' }}>Pulse</span>
                <span style={{ color: 'var(--accent-primary)' }}>API</span>
            </Link>
            <h2>Welcome back</h2>
            <p>Log into your account to continue</p>
        </div>

        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem' }}>Forgot password?</Link>
            </div>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Sign In</button>
        </form>
        
        <div style={{ margin: "2rem 0", display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
           <hr style={{ flex: 1, borderColor: 'var(--border-color)' }} />
           <span style={{ fontSize: '0.85rem' }}>OR</span>
           <hr style={{ flex: 1, borderColor: 'var(--border-color)' }} />
        </div>

        <button type="button" onClick={handleGoogleSignIn} className="btn btn-secondary" style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} alt="Google" />
          Sign In with Google
        </button>

        <div className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
        </div>
      </div>
    </div>
  );
}
