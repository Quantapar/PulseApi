import { useState, useEffect } from "react";
import { useSession, signOut } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { Activity, LogOut, Code, User, Settings, Database, Server } from "lucide-react";

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
      const res = await fetch("http://localhost:3000/api/me", {
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

  if (isPending) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)' }}>Loading your workspace...</div>;
  if (!session) return null; 

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      <aside style={{ width: '260px', borderRight: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'white', fontSize: '1.25rem', fontWeight: 700, marginBottom: '2.5rem' }}>
            <Activity color="var(--accent-primary)" size={24} />
            PulseAPI
        </Link>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)', color: 'white', fontWeight: 500, cursor: 'pointer' }}>
                <Server size={18} /> Endpoints
            </div>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}>
                <Activity size={18} /> Activity Logs
            </div>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}>
                <Database size={18} /> API Keys
            </div>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}>
                <Settings size={18} /> Settings
            </div>
        </nav>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                   <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{session.user.name}</div>
                   <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.user.email}</div>
                </div>
            </div>
            <button onClick={handleSignOut} style={{ width: '100%', padding: '0.75rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}>
                <LogOut size={16} /> Sign out
            </button>
        </div>
      </aside>


      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your monitoring endpoints and API settings.</p>
            </div>
        </header>

        {error && <div className="error">{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    <User size={20} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Account Details</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Name</div>
                        <div style={{ fontWeight: 500 }}>{session.user.name}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Email</div>
                        <div style={{ fontWeight: 500 }}>{session.user.email}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Status</div>
                        <div style={{ display: 'inline-flex', padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Active Workspace</div>
                    </div>
                </div>
            </div>


            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    <Code size={20} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Developer Tools</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Test your backend connection to verify authenticated API calls are passing JWT session tokens correctly.
                </p>
                <button onClick={handleGetMe} className="btn btn-primary" style={{ width: '100%' }}>
                    Ping /api/me
                </button>
            </div>
        </div>


        {apiData && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Response Payload</h3>
                    <div style={{ padding: '0.25rem 0.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace' }}>200 OK</div>
                </div>
                <pre style={{ margin: 0, background: '#0a0a0a', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', overflowX: 'auto', color: '#a855f7', fontSize: '0.9rem' }}>
                    {JSON.stringify(apiData, null, 2)}
                </pre>
            </div>
        )}

      </main>
    </div>
  );
}
