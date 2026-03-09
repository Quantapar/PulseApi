import { useState, useEffect } from "react";
import { useSession, signOut } from "../lib/auth";
import { useNavigate, Link, } from "react-router-dom";
import { Activity, LogOut, Settings, Database, Server, Plus, Trash2, Key } from "lucide-react";

export default function ApiKeys() {
  const { data: session, isPending } = useSession();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [keyName, setKeyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    if (session) {
      fetchApiKeys();
    }
  }, [session]);

  const fetchApiKeys = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/keys", {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch API keys");
      const data = await res.json();
      setApiKeys(data.data || []);
      setError("");
    } catch (err: any) {
      setError(`Error fetching keys: ${err.message}`);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      setError("Please enter a name for the API key.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: keyName })
      });
      if (!res.ok) throw new Error("Failed to generate API key");
      
      setKeyName("");
      setError("");
      await fetchApiKeys(); // Refresh the list
    } catch (err: any) {
      setError(`Error generating key: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API Key? Any application using it will break.")) return;
    
    try {
      const res = await fetch(`http://localhost:3000/api/keys/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to delete API key");
      
      await fetchApiKeys(); // Refresh the list
    } catch (err: any) {
      setError(`Error deleting key: ${err.message}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (isPending) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)' }}>Loading your workspace...</div>;
  if (!session) return null; 

  const navItems = [
    { name: "Endpoints", icon: <Server size={18} />, path: "/dashboard" },
    { name: "Activity Logs", icon: <Activity size={18} />, path: "/logs" },
    { name: "API Keys", icon: <Database size={18} />, path: "/api-keys" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <aside style={{ width: '280px', borderRight: '1px solid var(--border-strong)', background: 'rgba(10, 10, 10, 0.6)', backdropFilter: 'blur(20px)', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 700, marginBottom: '2.5rem' }}>
            <span style={{ color: 'var(--text-main)' }}>Pulse</span>
            <span style={{ color: 'var(--accent-primary)' }}>API</span>
        </Link>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            {navItems.map((item) => {
                const isActive = item.name === "API Keys"; // Hardcoding for simplicity right now
                return (
                    <Link to={item.path} key={item.name} style={{ textDecoration: 'none' }}>
                        <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-sm)', background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: isActive ? 'white' : 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                            {item.icon} {item.name}
                        </div>
                    </Link>
                );
            })}
        </nav>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                   <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)' }}>{session?.user?.name}</div>
                   <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session?.user?.email}</div>
                </div>
            </div>
            <button onClick={handleSignOut} style={{ width: '100%', padding: '0.75rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}>
                <LogOut size={16} /> Sign out
            </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem', position: 'relative', zIndex: 10 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>API Keys</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage the access keys used to authenticate API requests.</p>
            </div>
        </header>

        {error && <div className="error" style={{ marginBottom: '2rem' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* Generate Key Form */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    <Key size={20} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>Create New API Key</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Generate a new API key. Keep this key safe and do not share it.
                </p>
                
                <form onSubmit={handleGenerateKey} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="e.g. Production Frontend App"
                            value={keyName}
                            onChange={(e) => setKeyName(e.target.value)}
                            style={{ width: '100%' }}
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                        {loading ? 'Generating...' : <><Plus size={16} /> Generate Key</>}
                    </button>
                </form>
            </div>

            {/* Existing Keys Table */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    <Database size={20} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>Active API Keys</h3>
                </div>
                
                {apiKeys.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
                        You haven't generated any API keys yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {apiKeys.map((key) => (
                            <div key={key.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>{key.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <code style={{ background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            {key.key.substring(0, 10)}...{key.key.substring(key.key.length - 4)}
                                        </code>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                            Created {new Date(key.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => handleDeleteKey(key.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Revoke Key"
                                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </main>
    </div>
  );
}
