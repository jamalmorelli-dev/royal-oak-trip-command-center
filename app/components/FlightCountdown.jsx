'use client';
import { useState, useEffect, useMemo } from "react";

const MILESTONES = [
  {
    id: "checkin",
    label: "Check-In Opens",
    shortLabel: "Check-In",
    icon: "🎟️",
    targetDate: new Date("2026-09-23T18:40:00-04:00"),
    dateStr: "Wed Sep 23 @ 6:40 PM EDT",
    urgency: "high",
    desc: "Delta online check-in opens exactly 24h before DL 228 departure. PNR: G82B6L.",
  },
  {
    id: "leave",
    label: "Leave for DTW",
    shortLabel: "Depart Base",
    icon: "🚗",
    targetDate: new Date("2026-09-24T15:15:00-04:00"),
    dateStr: "Thu Sep 24 @ 3:15 PM EDT",
    urgency: "critical",
    desc: "Depart Royal Oak base (4322 Buckingham Rd) for DTW McNamara Terminal (35–45m drive).",
  },
  {
    id: "wheelsup",
    label: "DL 228 Wheels Up",
    shortLabel: "Wheels Up",
    icon: "🛫",
    targetDate: new Date("2026-09-24T18:40:00-04:00"),
    dateStr: "Thu Sep 24 @ 6:40 PM EDT",
    urgency: "critical",
    desc: "Delta DL 228 departs DTW McNamara Terminal for Paris CDG Terminal 2E (8h flight).",
  },
  {
    id: "touchdown",
    label: "Rabat Touchdown",
    shortLabel: "Rabat Arrival",
    icon: "🇲🇦",
    targetDate: new Date("2026-09-25T13:10:00+01:00"),
    dateStr: "Fri Sep 25 @ 1:10 PM GMT+1",
    urgency: "normal",
    desc: "Air France AF 1258 touches down at Rabat-Salé Airport (RBA). Trip complete.",
  },
];

function getTimeDiff(target, now) {
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, passed: true };
  }
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, total: ms, passed: false };
}

// Deterministic baseline date for SSR hydration parity
const BASELINE_DATE = new Date("2026-09-21T12:00:00-04:00");

export default function FlightCountdown({ defaultMilestone = "checkin" }) {
  const [selectedId, setSelectedId] = useState(defaultMilestone);
  const [now, setNow] = useState(BASELINE_DATE);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeMilestone = useMemo(() => {
    return MILESTONES.find((m) => m.id === selectedId) || MILESTONES[0];
  }, [selectedId]);

  const diff = useMemo(() => {
    return getTimeDiff(activeMilestone.targetDate, now);
  }, [activeMilestone, now]);

  return (
    <div
      className="card"
      style={{
        background: "linear-gradient(135deg, rgba(16, 28, 56, 0.95) 0%, rgba(9, 14, 28, 0.98) 100%)",
        border: "1px solid rgba(88, 166, 255, 0.3)",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.45)",
      }}
      role="region"
      aria-label="Live Flight Countdown Timer"
    >
      {/* Header & Milestone Selector Chips */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div>
          <span className="label" style={{ color: "var(--accent)" }}>
            LIVE MISSION COUNTDOWN
          </span>
          <h3 style={{ margin: "2px 0 0", fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <span>{activeMilestone.icon}</span>
            <span>T-Minus Countdown to {activeMilestone.label}</span>
          </h3>
        </div>

        {/* Milestone Switcher */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} className="no-print">
          {MILESTONES.map((m) => {
            const isSelected = m.id === selectedId;
            return (
              <button
                key={m.id}
                type="button"
                className={"chip " + (isSelected ? "active" : "")}
                onClick={() => setSelectedId(m.id)}
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: isSelected ? 800 : 500,
                  borderColor: isSelected ? "var(--accent)" : "var(--line)",
                }}
              >
                {m.icon} {m.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Big Digital Countdown Blocks */}
      {!diff.passed ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            margin: "12px 0",
            textAlign: "center",
          }}
          suppressHydrationWarning
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(88, 166, 255, 0.2)",
              borderRadius: 12,
              padding: "12px 8px",
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 34,
                fontWeight: 800,
                color: "var(--accent)",
                lineHeight: 1,
              }}
              suppressHydrationWarning
            >
              {String(diff.days).padStart(2, "0")}
            </div>
            <div className="label" style={{ fontSize: 10, marginTop: 4, letterSpacing: "0.1em" }}>
              DAYS
            </div>
          </div>

          <div
            style={{
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(88, 166, 255, 0.2)",
              borderRadius: 12,
              padding: "12px 8px",
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 34,
                fontWeight: 800,
                color: "var(--ink-bright)",
                lineHeight: 1,
              }}
              suppressHydrationWarning
            >
              {String(diff.hours).padStart(2, "0")}
            </div>
            <div className="label" style={{ fontSize: 10, marginTop: 4, letterSpacing: "0.1em" }}>
              HOURS
            </div>
          </div>

          <div
            style={{
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(88, 166, 255, 0.2)",
              borderRadius: 12,
              padding: "12px 8px",
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 34,
                fontWeight: 800,
                color: "var(--ink-bright)",
                lineHeight: 1,
              }}
              suppressHydrationWarning
            >
              {String(diff.minutes).padStart(2, "0")}
            </div>
            <div className="label" style={{ fontSize: 10, marginTop: 4, letterSpacing: "0.1em" }}>
              MINUTES
            </div>
          </div>

          <div
            style={{
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(88, 166, 255, 0.2)",
              borderRadius: 12,
              padding: "12px 8px",
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 34,
                fontWeight: 800,
                color: "var(--good)",
                lineHeight: 1,
              }}
              suppressHydrationWarning
            >
              {String(diff.seconds).padStart(2, "0")}
            </div>
            <div className="label" style={{ fontSize: 10, marginTop: 4, letterSpacing: "0.1em" }}>
              SECONDS
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: 16,
            background: "rgba(72, 213, 151, 0.15)",
            border: "1px solid var(--good)",
            borderRadius: 12,
            textAlign: "center",
            margin: "12px 0",
          }}
          suppressHydrationWarning
        >
          <div className="good" style={{ fontSize: 20, fontWeight: 800 }}>
            ✔ MILESTONE ACTIVE / COMPLETED
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {activeMilestone.label} milestone target reached.
          </div>
        </div>
      )}

      {/* Target Details Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          paddingTop: 10,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          fontSize: 12,
        }}
      >
        <div>
          <span className="muted">Target: </span>
          <strong style={{ color: "var(--ink-bright)" }}>{activeMilestone.dateStr}</strong>
        </div>
        <div className="muted" style={{ fontSize: 12 }}>
          {activeMilestone.desc}
        </div>
      </div>
    </div>
  );
}
