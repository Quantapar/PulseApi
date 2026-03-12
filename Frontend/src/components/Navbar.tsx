import { Link } from "react-router-dom";
import { useSession } from "../lib/auth";

export default function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <nav className="landing-nav">
      <Link to="/" className="logo">
        <span style={{ color: "var(--text-main)" }}>Pulse</span>
        <span style={{ color: "var(--accent-primary)" }}>API</span>
      </Link>
      <div className="landing-nav-links">
        <a href="#features">Features</a>
        <a href="#demo">Demo</a>
        <a
          href="https://github.com/Quantapar/PulseApi"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {isPending ? (
          <div style={{ width: "40px", height: "40px" }} />
        ) : session ? (
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--accent-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 600,
                fontSize: "1.1rem",
                fontFamily: "var(--font-display)",
                border: "2px solid rgba(255,255,255,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 0 15px rgba(82, 179, 101, 0.2)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(82, 179, 101, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 0 15px rgba(82, 179, 101, 0.2)";
              }}
              title="Dashboard"
            >
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </Link>
        ) : (
          <Link to="/login" className="btn btn-secondary nav-login-btn">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
