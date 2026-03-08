import { useState, useEffect } from "react";
import { useSession, signOut } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function Me() {
  const { data: session, isPending } = useSession();
  const [apiData, setApiData] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  const handleGetMe = async () => {
    try {
      const res = await fetch("http://localhost:4040/api/me", {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setApiData(data.data);
      setError("");
    } catch (err: any) {
      setError(`Error fetching /me: ${err.message || 'Unauthorized'}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (isPending) return <div>Loading...</div>;
  if (!session) return null; // Wait for redirect

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome, {session.user.name}!</h2>
        <p>Email: {session.user.email}</p>
        
        <div className="actions">
          <button onClick={handleGetMe} className="btn-primary">
            Test GET /api/me
          </button>
          <button onClick={handleSignOut} className="btn-danger">
            Sign Out
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {apiData && (
          <div className="response-box">
            <h3>/api/me Response:</h3>
            <pre>
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
