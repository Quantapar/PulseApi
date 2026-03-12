import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Activity, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import UptimeBar from "../components/UptimeBar";

interface Ping {
  id: string;
  status: string;
  statusCode: number | null;
  responseTime: number;
  createdAt: string;
}

interface StatusData {
  name: string;
  url: string;
  method: string;
  status: string;
  expectedStatus: number;
  interval: number;
  lastCheckedAt: string | null;
  uptime: number;
  owner: string;
  pings: Ping[];
}

export default function StatusPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shareToken) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/public/status/${shareToken}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("This status page does not exist or has been removed.");
          } else {
            setError("Failed to load status page.");
          }
          return;
        }
        const json = await res.json();
        setData(json.data);
      } catch {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [shareToken]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
        Loading status page...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <AlertCircle size={48} color="var(--text-muted)" />
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", fontFamily: "var(--font-body)" }}>{error}</p>
        <Link to="/" style={{ color: "var(--accent-primary)", textDecoration: "none", fontSize: "0.9rem", fontFamily: "var(--font-body)" }}>
          Go to PulseAPI
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const statusColor = data.status === "UP" ? "var(--accent-primary)" : data.status === "DOWN" ? "#ef4444" : "var(--text-muted)";
  const uptimeColor = data.uptime >= 95 ? "var(--accent-primary)" : data.uptime >= 80 ? "#fbbf24" : "#ef4444";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", position: "relative", overflow: "hidden" }}>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 1.5rem", position: "relative", zIndex: 10 }}>


        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={20} color="var(--accent-primary)" />
            <span style={{ fontWeight: 800, fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
              <span style={{ color: "var(--text-main)" }}>Pulse</span>
              <span style={{ color: "var(--accent-primary)" }}>API</span>
            </span>
          </Link>
          <span style={{ color: "var(--text-dim)", fontSize: "0.75rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Public Status
          </span>
        </div>


        <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-main)", margin: "0 0 0.5rem 0", letterSpacing: "-0.03em" }}>
                {data.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <span style={{ background: "rgba(255,255,255,0.06)", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                  {data.method}
                </span>
                {data.url}
              </div>
              {data.owner && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--text-dim)", fontFamily: "var(--font-body)" }}>
                  Monitored by {data.owner}
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)", background: data.status === "UP" ? "rgba(82, 179, 101, 0.08)" : data.status === "DOWN" ? "rgba(239, 68, 68, 0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${data.status === "UP" ? "rgba(82, 179, 101, 0.25)" : data.status === "DOWN" ? "rgba(239, 68, 68, 0.25)" : "var(--border-strong)"}` }}>
              {data.status === "UP" ? <CheckCircle2 size={20} color={statusColor} /> : data.status === "DOWN" ? <XCircle size={20} color={statusColor} /> : <AlertCircle size={20} color={statusColor} />}
              <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)", color: statusColor, fontSize: "0.85rem", letterSpacing: "0.05em" }}>
                {data.status === "UP" ? "Operational" : data.status === "DOWN" ? "Down" : "Unknown"}
              </span>
            </div>
          </div>
        </div>


        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem", fontFamily: "var(--font-mono)" }}>Uptime</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-display)", color: uptimeColor }}>
              {data.uptime}%
            </div>
          </div>
          <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem", fontFamily: "var(--font-mono)" }}>Check Interval</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-main)" }}>
              {data.interval >= 60 ? `${Math.round(data.interval / 60)} Min` : `${data.interval} Sec`}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem", fontFamily: "var(--font-mono)" }}>Last Checked</div>
            <div style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--accent-primary)", marginTop: "0.5rem" }}>
              {data.lastCheckedAt ? new Date(data.lastCheckedAt).toLocaleString() : "Never"}
            </div>
          </div>
        </div>


        <UptimeBar pings={data.pings} />

        <h3 style={{ fontSize: "1.1rem", color: "var(--text-main)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-display)", fontWeight: 600 }}>
          <Clock size={16} /> Recent Checks
        </h3>

        <div className="glass-panel" style={{ overflow: "hidden" }}>
          {data.pings.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              No checks recorded yet. Monitoring will begin shortly.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-strong)" }}>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>Status</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>Code</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>Response Time</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.pings.map((ping) => (
                  <tr key={ping.id} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: ping.status === "UP" ? "rgba(82, 179, 101, 0.05)" : "rgba(239, 68, 68, 0.05)", color: ping.status === "UP" ? "var(--accent-primary)" : "#ef4444", border: `1px solid ${ping.status === "UP" ? "rgba(82, 179, 101, 0.2)" : "rgba(239, 68, 68, 0.2)"}`, padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
                        {ping.status === "UP" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {ping.status}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontFamily: "var(--font-mono)", color: "var(--text-main)" }}>
                      {ping.statusCode || "N/A"}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontFamily: "var(--font-mono)", color: ping.responseTime > 1000 ? "#fbbf24" : "var(--text-main)" }}>
                      {ping.responseTime} ms
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.9rem", fontFamily: "var(--font-body)" }}>
                      {new Date(ping.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>


        <div style={{ marginTop: "3rem", textAlign: "center", color: "var(--text-dim)", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
          <span>Powered by </span>
          <Link to="/" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>PulseAPI</Link>
          <span> — Auto-refreshes every 30s</span>
        </div>
      </div>
    </div>
  );
}
