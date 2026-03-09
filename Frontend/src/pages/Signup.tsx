import { useState } from "react";
import { authClient, signUp, signIn } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      // Auto-send verification OTP
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

  return (
    <div className="container">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSignUp}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <button type="button" onClick={handleGoogleSignUp} style={{ backgroundColor: "#db4437", color: "white" }}>
          Sign Up with Google
        </button>
      </div>

      <p>Already have an account? <Link to="/login">Sign in here</Link></p>
    </div>
  );
}
