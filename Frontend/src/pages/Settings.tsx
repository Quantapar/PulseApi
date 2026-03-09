
import { useEffect } from "react";
import { useSession, signOut } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { Activity, LogOut, Settings as SettingsIcon, Server, User, Bell, Shield } from "lucide-react";

export default function Settings() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

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
                { name: "Settings", icon: <SettingsIcon size={18} />, path: "/settings" },
              ].map((item) => {
                  const isActive = item.name === "Settings";
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
          <header style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>Settings</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your account preferences and application settings.</p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
            <section className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={20} className="text-accent-gradient" /> Profile Information
              </h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Display Name</label>
                  <input type="text" className="input-field" defaultValue={session?.user?.name || ""} style={{ width: '100%' }} readOnly />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email Address</label>
                  <input type="email" className="input-field" defaultValue={session?.user?.email || ""} style={{ width: '100%' }} readOnly />
                </div>
              </div>
            </section>

            <section className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={20} className="text-accent-gradient" /> Notifications
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Configure how you want to receive alerts for your endpoints.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>Email Alerts</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Get notified when an endpoint goes down.</div>
                  </div>
                  <div style={{ width: '40px', height: '20px', background: 'var(--accent-primary)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield size={20} /> Security
              </h2>
              <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border-strong)', color: 'var(--text-main)' }}>Change Password</button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
