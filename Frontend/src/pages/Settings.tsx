import { useEffect, useState } from "react";
import { useSession } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { Bell, User, CheckCircle2, AlertCircle } from "lucide-react";
import { API_URL } from "../lib/api";
import DashboardLayout from "../components/DashboardLayout";

export default function Settings() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const [emailAlerts, setEmailAlerts] = useState(true);

  const [successMsg] = useState("");
  const [errorMsg] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/login");
    } else if (session?.user) {
      fetchSettings();
    }
  }, [session, isPending, navigate]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setEmailAlerts(data.data.emailAlerts);
      }
    } catch(e) {}
  };

  const handleToggleAlerts = async () => {
    const newVal = !emailAlerts;
    setEmailAlerts(newVal);
    try {
      await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ emailAlerts: newVal })
      });
    } catch(e) {
      setEmailAlerts(!newVal);
    }
  };

  if (!session && !isPending) return null;

  return (
    <DashboardLayout activePage="Settings">
      {/* Toast Notifications */}
      {successMsg && (
        <div className="toast-notification" style={{ border: '1px solid rgba(82, 179, 101, 0.4)' }}>
           <CheckCircle2 size={16} color="var(--accent-primary)" />
           <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="toast-notification">
           <AlertCircle size={16} />
           <span>{errorMsg}</span>
        </div>
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)', fontWeight: 600 }}>Settings</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Manage your account preferences and application settings.</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>

        {/* Profile Information */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <User size={20} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Profile Information</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Display Name (Read-Only)</label>
              <input type="text" className="input-field" value={session?.user?.name || ""} disabled style={{ width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address (Read-Only)</label>
              <input type="email" className="input-field" value={session?.user?.email || ""} disabled style={{ width: '100%', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <Bell size={20} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Notifications</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>Configure how you want to receive alerts for your endpoints.</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', gap: '1rem' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>Email Alerts</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Get notified immediately when an endpoint goes down.</div>
            </div>
            <div onClick={handleToggleAlerts} style={{ width: '40px', minWidth: '40px', height: '22px', background: emailAlerts ? 'var(--accent-primary)' : 'var(--border-strong)', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'var(--transition-fast)' }}>
              <div style={{ width: '16px', height: '16px', background: emailAlerts ? 'var(--bg-base)' : 'var(--text-muted)', borderRadius: '50%', position: 'absolute', right: emailAlerts ? '3px' : 'auto', left: emailAlerts ? 'auto' : '3px', top: '3px', transition: 'var(--transition-fast)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
