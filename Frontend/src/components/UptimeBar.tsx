import { useState } from "react";

interface Ping {
  status: string;
  createdAt: string;
}

interface DayData {
  date: string;
  label: string;
  total: number;
  up: number;
  uptime: number;
}

function buildDayData(pings: Ping[]): DayData[] {
  const days: DayData[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    days.push({ date: key, label, total: 0, up: 0, uptime: -1 });
  }

  for (const ping of pings) {
    const key = new Date(ping.createdAt).toISOString().split("T")[0];
    const day = days.find((d) => d.date === key);
    if (day) {
      day.total++;
      if (ping.status === "UP") day.up++;
    }
  }

  for (const day of days) {
    if (day.total > 0) {
      day.uptime = Math.round((day.up / day.total) * 100);
    }
  }

  return days;
}

function getBarColor(uptime: number): string {
  if (uptime === -1) return "rgba(255, 255, 255, 0.06)";
  if (uptime >= 95) return "var(--accent-primary)";
  if (uptime >= 80) return "#fbbf24";
  return "#ef4444";
}

function getBarOpacity(uptime: number): number {
  if (uptime === -1) return 1;
  if (uptime === 100) return 1;
  if (uptime >= 95) return 0.8;
  return 1;
}

export default function UptimeBar({ pings }: { pings: Ping[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const days = buildDayData(pings);

  const totalPings = days.reduce((s, d) => s + d.total, 0);
  const totalUp = days.reduce((s, d) => s + d.up, 0);
  const overallUptime = totalPings > 0 ? ((totalUp / totalPings) * 100).toFixed(2) : "N/A";

  const getTooltipLeft = (index: number): string => {
    const pct = (index / 29) * 100;
    if (pct < 10) return "0%";
    if (pct > 90) return "100%";
    return `${pct}%`;
  };

  const getTooltipTransform = (index: number): string => {
    const pct = (index / 29) * 100;
    if (pct < 10) return "translateX(0)";
    if (pct > 90) return "translateX(-100%)";
    return "translateX(-50%)";
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem 2rem", marginBottom: "2rem", overflow: "visible" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          30-Day Uptime
        </span>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: overallUptime === "N/A" ? "var(--text-dim)" : Number(overallUptime) >= 95 ? "var(--accent-primary)" : Number(overallUptime) >= 80 ? "#fbbf24" : "#ef4444" }}>
          {overallUptime === "N/A" ? "No data" : `${overallUptime}% uptime`}
        </span>
      </div>

      <div style={{ position: "relative", overflow: "visible" }}>
        <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "40px" }}>
          {days.map((day, i) => (
            <div
              key={day.date}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                flex: 1,
                height: day.uptime === -1 ? "40%" : `${Math.max(40, day.uptime)}%`,
                background: getBarColor(day.uptime),
                opacity: getBarOpacity(day.uptime),
                borderRadius: "2px",
                cursor: "pointer",
                transition: "opacity 0.15s ease",
                filter: hoveredIndex === i ? "brightness(1.3)" : "none",
              }}
            />
          ))}
        </div>

        {hoveredIndex !== null && (
          <div style={{
            position: "absolute",
            top: "-44px",
            left: getTooltipLeft(hoveredIndex),
            transform: getTooltipTransform(hoveredIndex),
            background: "var(--bg-surface-elevated)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            padding: "0.35rem 0.6rem",
            fontSize: "0.7rem",
            fontFamily: "var(--font-mono)",
            color: "var(--text-main)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 20,
          }}>
            {days[hoveredIndex].label} — {days[hoveredIndex].uptime === -1 ? "No data" : `${days[hoveredIndex].uptime}%`}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
        <span style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>30 days ago</span>
        <span style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>Today</span>
      </div>
    </div>
  );
}
