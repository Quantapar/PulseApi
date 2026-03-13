import { useState, useEffect } from "react";
import { useSession } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Server,
  AlertCircle,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { API_URL } from "../lib/api";
import DashboardLayout from "../components/DashboardLayout";

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
  const [newEndpoint, setNewEndpoint] = useState({
    name: "",
    url: "",
    method: "GET",
    interval: 60,
  });
  const [loading, setLoading] = useState(false);
  const [fetchingEndpoints, setFetchingEndpoints] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      const res = await fetch(`${API_URL}/api/endpoints`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
      const res = await fetch(`${API_URL}/api/endpoints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newEndpoint),
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/endpoints/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete endpoint");
      await fetchEndpoints();
    } catch (err: any) {
      setError(`Error deleting endpoint: ${err.message}`);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (isPending || !session) return null;

  return (
    <DashboardLayout activePage="Endpoints">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "3rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              marginBottom: "0.5rem",
              fontFamily: "var(--font-display)",
              color: "var(--text-main)",
              fontWeight: 600,
            }}
          >
            API Endpoints
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
            }}
          >
            Manage and monitor your API endpoints.
          </p>
        </div>
      </header>

      {error && (
        <div className="toast-notification">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="toast-close"
            aria-label="Close error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              color: "var(--text-secondary)",
            }}
          >
            <Server size={20} />
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
              Add New Endpoint
            </h3>
          </div>

          <form
            onSubmit={handleCreateEndpoint}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Endpoint Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Production API"
                value={newEndpoint.name}
                onChange={(e) =>
                  setNewEndpoint({ ...newEndpoint, name: e.target.value })
                }
                style={{ width: "100%", boxSizing: "border-box" }}
                disabled={loading}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Target URL
              </label>
              <input
                type="url"
                className="input-field"
                placeholder="https://api.example.com/health"
                value={newEndpoint.url}
                onChange={(e) =>
                  setNewEndpoint({ ...newEndpoint, url: e.target.value })
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  fontFamily: "monospace",
                }}
                disabled={loading}
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.5rem",
                    fontFamily: "var(--font-display)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Method
                </label>
                <select
                  className="input-field"
                  value={newEndpoint.method}
                  onChange={(e) =>
                    setNewEndpoint({
                      ...newEndpoint,
                      method: e.target.value,
                    })
                  }
                  style={{ width: "100%", boxSizing: "border-box" }}
                  disabled={loading}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.5rem",
                    fontFamily: "var(--font-display)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Ping Interval
                </label>
                <select
                  className="input-field"
                  value={newEndpoint.interval}
                  onChange={(e) =>
                    setNewEndpoint({
                      ...newEndpoint,
                      interval: Number(e.target.value),
                    })
                  }
                  style={{ width: "100%", boxSizing: "border-box" }}
                  disabled={loading}
                >
                  <option value={60}>Every 1 Minute</option>
                  <option value={300}>Every 5 Minutes</option>
                  <option value={3600}>Every 1 Hour</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              {loading ? "Adding Endpoint..." : "Start Monitoring"}
            </button>
          </form>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              color: "var(--text-secondary)",
            }}
          >
            <Activity size={20} />
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
              Monitored Endpoints
            </h3>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              overflowY: "auto",
            }}
          >
            {fetchingEndpoints ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                }}
              >
                Loading endpoints...
              </div>
            ) : endpoints.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px dashed var(--border-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                No endpoints are currently being monitored. Let's add one.
              </div>
            ) : (
              endpoints.map((ep) => (
                <div
                  key={ep.id}
                  className="endpoint-card"
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {ep.status === "UP" ? (
                        <CheckCircle2 size={16} color="#52B365" />
                      ) : ep.status === "DOWN" ? (
                        <XCircle size={16} color="#ef4444" />
                      ) : (
                        <AlertCircle size={16} color="#fbbf24" />
                      )}
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "1rem",
                          color: "var(--text-main)",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {ep.name}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.1rem 0.3rem",
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: "4px",
                          fontFamily: "monospace",
                          color: "var(--text-secondary)",
                          flexShrink: 0,
                        }}
                      >
                        {ep.method}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          fontFamily: "monospace",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ep.url}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteTarget({ id: ep.id, name: ep.name })}
                    style={{
                      background: "transparent",
                      color: "#ef4444",
                      border: "none",
                      padding: "0.5rem",
                      cursor: "pointer",
                      opacity: 0.6,
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = "0.6";
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Delete
                    </span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="glass-panel"
            style={{
              padding: "2rem",
              maxWidth: "420px",
              width: "100%",
              animation: "fadeIn 0.15s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(239, 68, 68, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <AlertCircle size={20} color="#ef4444" />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text-main)", fontFamily: "var(--font-display)" }}>
                Delete Endpoint
              </h3>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 0.5rem", lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: "var(--text-main)" }}>{deleteTarget.name}</strong>? This will permanently remove the endpoint and all its ping history.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0 0 1.5rem" }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                style={{
                  padding: "0.6rem 1.2rem",
                  background: "transparent",
                  border: "1px solid var(--border-strong)",
                  color: "var(--text-secondary)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-body)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                style={{
                  padding: "0.6rem 1.2rem",
                  background: "#ef4444",
                  border: "none",
                  color: "white",
                  borderRadius: "var(--radius-sm)",
                  cursor: deleting ? "not-allowed" : "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  opacity: deleting ? 0.7 : 1,
                  transition: "all 0.2s",
                  fontFamily: "var(--font-body)",
                }}
              >
                {deleting ? "Deleting..." : "Delete Endpoint"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
