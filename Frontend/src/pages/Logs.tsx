import { useState, useEffect } from "react";
import { useSession, signOut } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { Activity, LogOut, Settings, Server, AlertCircle, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function Logs() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>("");
  const [endpointDetails, setEndpointDetails] = useState<any>(null);
  const [pings, setPings] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    if (session) {
      fetchEndpoints();
    }
  }, [session]);

  useEffect(() => {
    if (selectedEndpointId) {
      fetchEndpointData(selectedEndpointId);
    } else {
      setEndpointDetails(null);
      setPings([]);
    }
  }, [selectedEndpointId]);

  const fetchEndpoints = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/endpoints", {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch endpoints");
      const data = await res.json();
      setEndpoints(data.data || []);
      
      if (data.data && data.data.length > 0 && !selectedEndpointId) {
        setSelectedEndpointId(data.data[0].id);
      }
    } catch (err: any) {
      setError(`Error fetching endpoints: ${err.message}`);
    }
  };

  const fetchEndpointData = async (id: string) => {
    setLoading(true);
    try {
      const detailsRes = await fetch(`http://localhost:3000/api/endpoints/${id}`, {
        credentials: "include"
      });
      if (!detailsRes.ok) throw new Error("Failed to fetch endpoint details");
      const detailsData = await detailsRes.json();
      setEndpointDetails(detailsData.data);

      const pingsRes = await fetch(`http://localhost:3000/api/endpoints/${id}/pings`, {
        credentials: "include"
      });
      if (!pingsRes.ok) throw new Error("Failed to fetch ping history");
      const pingsData = await pingsRes.json();
      setPings(pingsData.data || []);
      
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
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

      {/* Spacer for floating navbar */}
      <div style={{ height: '7.5rem', flexShrink: 0 }}></div>

      <div style={{ display: 'flex', flex: 1, borderTop: '1px solid var(--border-strong)', overflow: 'hidden' }}>
        <aside style={{ width: '280px', borderRight: '1px solid var(--border-strong)', background: 'rgba(10, 10, 10, 0.4)', backdropFilter: 'blur(20px)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {[
                  { name: "Endpoints", icon: <Server size={18} />, path: "/dashboard" },
                  { name: "Activity Logs", icon: <Activity size={18} />, path: "/logs" },
                  { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
              ].map((item) => {
                  const isActive = item.name === "Activity Logs";
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
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>Activity Logs</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Monitor API performance, uptime, and latency over time.</p>
            </div>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column' }}>
              <label style={{ width: '100%', boxSizing: 'border-box', textAlign: 'left', fontSize: '0.75rem', color: '#ffffff', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.75rem' }}>SWITCH API ENDPOINT</label>
              <select 
                  className="input-field" 
                  value={selectedEndpointId}
                  onChange={(e) => setSelectedEndpointId(e.target.value)}
                  style={{ 
                      width: '100%',
                      boxSizing: 'border-box',
                      background: 'var(--bg-surface-elevated)', 
                      border: '1px solid var(--accent-primary)', 
                      color: 'var(--accent-primary)', 
                      fontSize: '1rem', 
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700, 
                      padding: '0.75rem 1rem', 
                      cursor: 'pointer', 
                      boxShadow: '0 0 15px rgba(82, 179, 101, 0.1)', 
                      outline: 'none',
                      borderRadius: '8px'
                  }}
              >
                  <option value="" disabled style={{ color: 'var(--text-muted)' }}>Select an endpoint...</option>
                  {endpoints.map(ep => (
                      <option key={ep.id} value={ep.id} style={{ color: '#ffffff', background: '#111', fontSize: '0.9rem' }}>
                          {ep.name} • {ep.method}
                      </option>
                  ))}
              </select>
            </div>
        </header>

        {error && (
            <div className="toast-notification">
                <AlertCircle size={18} />
                <span>{error}</span>
                <button type="button" onClick={() => setError("")} className="toast-close" aria-label="Close error">
                    <XCircle size={16} />
                </button>
            </div>
        )}

        {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>Loading logs data...</div>
        ) : !selectedEndpointId ? (
             <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>
                Please select an endpoint from the dropdown above to view its activity logs.
            </div>
        ) : (
             <>
                {endpointDetails && (
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                        <div style={{ flex: 1 }}>
                             <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Activity size={20} className="text-accent-gradient" /> Endpoint Health
                             </h2>
                             <div style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                {endpointDetails.url}
                             </div>
                             
                             <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
                                 <div>
                                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Uptime</div>
                                     <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: endpointDetails.uptime >= 95 ? '#52B365' : endpointDetails.uptime >= 80 ? '#fbbf24' : '#ef4444' }}>
                                         {endpointDetails.uptime}%
                                     </div>
                                 </div>
                                 <div>
                                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Current Status</div>
                                     <div style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: endpointDetails.status === 'UP' ? '#52B365' : endpointDetails.status === 'DOWN' ? '#ef4444' : 'var(--text-muted)' }}>
                                         {endpointDetails.status === 'UP' ? <CheckCircle2 size={24} /> : endpointDetails.status === 'DOWN' ? <XCircle size={24} /> : <AlertCircle size={24} />}
                                         {endpointDetails.status}
                                     </div>
                                 </div>
                             </div>
                        </div>

                        <div style={{ width: '1px', height: '100px', background: 'var(--border-strong)' }}></div>

                        <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Ping Configuration</div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                     <span style={{ color: 'var(--text-secondary)' }}>Method</span>
                                     <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{endpointDetails.method}</span>
                                 </div>
                                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                     <span style={{ color: 'var(--text-secondary)' }}>Interval</span>
                                     <span style={{ fontFamily: 'monospace' }}>Every {endpointDetails.interval / 60}m</span>
                                 </div>
                                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                     <span style={{ color: 'var(--text-secondary)' }}>Expected Status</span>
                                     <span style={{ fontFamily: 'monospace' }}>{endpointDetails.expectedStatus}</span>
                                 </div>
                                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                     <span style={{ color: 'var(--text-secondary)' }}>Last Checked</span>
                                     <span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                                         {endpointDetails.lastCheckedAt ? new Date(endpointDetails.lastCheckedAt).toLocaleString() : 'Never'}
                                     </span>
                                 </div>
                             </div>
                        </div>
                    </div>
                )}

                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} /> Recent Checks
                </h3>

                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    {pings.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No ping history available yet. The monitor will run soon!
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-strong)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: 600 }}>Code</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: 600 }}>Response Time</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: 600 }}>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pings.map((ping) => (
                                    <tr key={ping.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: ping.status === 'UP' ? 'rgba(82, 179, 101, 0.05)' : 'rgba(239, 68, 68, 0.05)', color: ping.status === 'UP' ? 'var(--accent-primary)' : '#ef4444', border: `1px solid ${ping.status === 'UP' ? 'rgba(82, 179, 101, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                                                {ping.status === 'UP' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {ping.status}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                                            {ping.statusCode || 'N/A'}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: ping.responseTime > 1000 ? '#fbbf24' : 'var(--text-main)' }}>
                                            {ping.responseTime} ms
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            {new Date(ping.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
             </>
        )}
        </main>
      </div>
    </div>
  );
}
