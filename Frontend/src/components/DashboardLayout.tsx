import { useState } from "react";
import { useSession, signOut } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  Activity,
  LogOut,
  Settings,
  Server,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  activePage: "Endpoints" | "Activity Logs" | "Settings";
  children: React.ReactNode;
}

const navItems = [
  { name: "Endpoints" as const, icon: <Server size={18} />, path: "/dashboard" },
  { name: "Activity Logs" as const, icon: <Activity size={18} />, path: "/logs" },
  { name: "Settings" as const, icon: <Settings size={18} />, path: "/settings" },
];

export default function DashboardLayout({ activePage, children }: DashboardLayoutProps) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="logo" style={{ fontSize: "1.2rem" }}>
          <span style={{ color: "var(--text-main)" }}>Pulse</span>
          <span style={{ color: "var(--accent-primary)" }}>API</span>
        </Link>
        <div style={{ width: "36px" }} />
      </div>

      <div className="dashboard-inner">
        {/* Sidebar overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem", paddingLeft: "0.5rem" }}>
            <Link to="/" className="logo">
              <span style={{ color: "var(--text-main)" }}>Pulse</span>
              <span style={{ color: "var(--accent-primary)" }}>API</span>
            </Link>
            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
            {navItems.map((item) => {
              const isActive = item.name === activePage;
              return (
                <Link
                  to={item.path}
                  key={item.name}
                  style={{ textDecoration: "none" }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      borderRadius: "var(--radius-sm)",
                      background: isActive ? "rgba(255, 255, 255, 0.05)" : "transparent",
                      color: isActive ? "white" : "var(--text-secondary)",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {item.icon} {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div style={{ borderTop: "1px solid var(--border-strong)", paddingTop: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--accent-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 600,
                  fontFamily: "var(--font-display)",
                  flexShrink: 0,
                }}
              >
                {isPending ? "..." : session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: "0.95rem", color: "var(--text-main)" }}>
                  {isPending ? "Loading..." : session?.user?.name}
                </div>
                <div
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.8rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isPending ? "Please wait" : session?.user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "transparent",
                border: "1px solid var(--border-strong)",
                color: "var(--text-secondary)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "var(--font-body)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#ef4444";
                e.currentTarget.style.borderColor = "#ef4444";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "var(--border-strong)";
              }}
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
}
