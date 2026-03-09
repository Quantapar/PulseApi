import { useState } from "react";
import { signIn } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await signIn.email({
      email,
      password,
    });
    if (error) {
      setError(error.message || "An error occurred");
    } else {
      navigate("/me");
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173/me",
    });
  };

  return (
    <div className="container">
      <h2>Sign In</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSignIn}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
      </form>
      
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <button type="button" onClick={handleGoogleSignIn} style={{ backgroundColor: "#db4437", color: "white" }}>
          Sign In with Google
        </button>
      </div>

      <p><Link to="/forgot-password" style={{ color: "gray" }}>Forgot your password?</Link></p>
      <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
  );
}
