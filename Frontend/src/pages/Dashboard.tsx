import { useState, useEffect } from "react";
import { useSession, signOut } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { Activity, LogOut, Settings, Server, AlertCircle, X, CheckCircle2, XCircle } from "lucide-react";

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [newEndpoint, setNewEndpoint] = useState({ name: "", url: "", method: "GET", interval: 60 });
  const [loading, setLoading] = useState(false);
  const [fetchingEndpoints, setFetchingEndpoints] = useState(true);

  useEffect(() => {
    if (session) {
      fetchEndpoints();
      const interval = setInterval(fetchEndpoints, 15000);
      return () => clearInterval(interval);
    }
  }, [session]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchEndpoints = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/endpoints", {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch endpoints");
      const data = await res.json();
      setEndpoints(data.data || []);
      setError("");
    } catch (err: any) {
      setError(`Error fetching endpoints: ${err.message}`);
    } finally {
      setFetchingEndpoints(false);
    }
  };

  const handleCreateEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEndpoint.name || !newEndpoint.url) {
      setError("Please provide both name and URL for the endpoint.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newEndpoint)
      });
      if (!res.ok) throw new Error("Failed to create endpoint");
      
      setNewEndpoint({ name: "", url: "", method: "GET", interval: 60 });
      setError("");
      await fetchEndpoints();
      setTimeout(fetchEndpoints, 5000);
    } catch (err: any) {
      setError(`Error creating endpoint: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEndpoint = async (id: string) => {
    if (!confirm("Are you sure you want to delete this endpoint and all its history?")) return;
    
    try {
      const res = await fetch(`http://localhost:3000/api/endpoints/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to delete endpoint");
      
      await fetchEndpoints(); 
    } catch (err: any) {
      setError(`Error deleting endpoint: ${err.message}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (!session && !isPending) return null; 

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <div style={{ display: 'flex', flex: 1, borderTop: '1px solid var(--border-strong)', overflow: 'hidden' }}>
        <aside style={{ width: '280px', borderRight: '1px solid var(--border-strong)', background: 'var(--bg-surface)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
          
          <Link to="/" className="logo" style={{ marginBottom: '3rem', paddingLeft: '0.5rem' }}>
            <span style={{ color: "var(--text-main)" }}>Pulse</span>
            <span style={{ color: "var(--accent-primary)" }}>API</span>
          </Link>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {[
                { name: "Endpoints", icon: <Server size={18} />, path: "/dashboard" },
                { name: "Activity Logs", icon: <Activity size={18} />, path: "/logs" },
                { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
              ].map((item) => {
                  const isActive = item.name === "Endpoints";
                  return (
                      <Link to={item.path} key={item.name} style={{ textDecoration: 'none' }}>
                          <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-sm)', background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: isActive ? 'white' : 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                              {item.icon} {item.name}
                          </div>
                      </Link>
                  );
              })}
          </nav>

          <div style={{ borderTop: '1px solid var(--border-strong)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                      {isPending ? "..." : (session?.user?.name?.charAt(0).toUpperCase() || 'U')}
                  </div>
                  <div>
                     <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)' }}>{isPending ? "Loading..." : session?.user?.name}</div>
                     <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isPending ? "Please wait" : session?.user?.email}</div>
                  </div>
              </div>
              <button onClick={handleSignOut} style={{ width: '100%', padding: '0.75rem 1rem', background: 'transparent', border: '1px solid var(--border-strong)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}>
                  <LogOut size={16} /> Sign out
              </button>
          </div>
        </aside>

        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem 4rem', position: 'relative', zIndex: 10 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)', fontWeight: 600 }}>API Endpoints</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Manage and monitor your API endpoints.</p>
            </div>
        </header>

        {error && (
            <div className="toast-notification">
                <AlertCircle size={18} />
                <span>{error}</span>
                <button type="button" onClick={() => setError("")} className="toast-close" aria-label="Close error">
                    <X size={16} />
                </button>
            </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    <Server size={20} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Add New Endpoint</h3>
                </div>
                
                <form onSubmit={handleCreateEndpoint} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Endpoint Name</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="e.g. Production API"
                            value={newEndpoint.name}
                            onChange={(e) => setNewEndpoint({...newEndpoint, name: e.target.value})}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target URL</label>
                        <input 
                            type="url" 
                            className="input-field" 
                            placeholder="https://api.example.com/health"
                            value={newEndpoint.url}
                            onChange={(e) => setNewEndpoint({...newEndpoint, url: e.target.value})}
                            style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'monospace' }}
                            disabled={loading}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Method</label>
                            <select 
                                className="input-field" 
                                value={newEndpoint.method}
                                onChange={(e) => setNewEndpoint({...newEndpoint, method: e.target.value})}
                                style={{ width: '100%', boxSizing: 'border-box' }}
                                disabled={loading}
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ping Interval</label>
                            <select 
                                className="input-field" 
                                value={newEndpoint.interval}
                                onChange={(e) => setNewEndpoint({...newEndpoint, interval: Number(e.target.value)})}
                                style={{ width: '100%', boxSizing: 'border-box' }}
                                disabled={loading}
                            >
                                <option value={60}>Every 1 Minute</option>
                                <option value={300}>Every 5 Minutes</option>
                                <option value={3600}>Every 1 Hour</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                        {loading ? 'Adding Endpoint...' : 'Start Monitoring'}
                    </button>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    <Activity size={20} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Monitored Endpoints</h3>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                    {fetchingEndpoints ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Loading endpoints...
                        </div>
                    ) : endpoints.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
                            No endpoints are currently being monitored. Let's add one.
                        </div>
                    ) : (
                        endpoints.map((ep) => (
                            <div key={ep.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                                        {ep.status === 'UP' ? <CheckCircle2 size={16} color="#52B365" /> : ep.status === 'DOWN' ? <XCircle size={16} color="#ef4444" /> : <AlertCircle size={16} color="#fbbf24" />}
                                        <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>{ep.name}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{ep.method}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.url}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteEndpoint(ep.id)}
                                    style={{ background: 'transparent', color: '#ef4444', border: 'none', padding: '0.5rem', cursor: 'pointer', opacity: 0.6, transition: 'all 0.2s' }}
                                    onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.opacity = '0.6'; }}
                                >
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase' }}>Delete</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>

        </main>
      </div>
    </div>
  );
}
