'use client';
import { useState, useEffect, useCallback } from "react";

const INITIAL_READINESS_ITEMS = [
  {
    id: "passport",
    num: 1,
    priority: "CRITICAL",
    title: "Physical Passport in Hand (BENJAMIN PRENTISS)",
    description: "Verify original physical passport is secure in personal travel wallet. Never place in checked baggage.",
    defaultChecked: true,
  },
  {
    id: "itinerary_offline",
    num: 2,
    priority: "CRITICAL",
    title: "Offline Delta PNR G82B6L & Ticket 0062455565576",
    description: "Save offline PDF and screenshot of return itinerary (DL 228 DTW→CDG and AF 1258 CDG→RBA).",
    defaultChecked: true,
  },
  {
    id: "checkin_alarm",
    num: 3,
    priority: "URGENT",
    title: "Return Check-In Alarm Set (Wed Sep 23 @ 6:40 PM EDT)",
    description: "Delta online check-in opens exactly 24h prior to DL 228 departure. Phone alarm must be set.",
    defaultChecked: false,
  },
  {
    id: "luggage_weight",
    num: 4,
    priority: "WARNING",
    title: "Luggage Weighed (2 Checked Bags <= 23 kg / 50 lb each)",
    description: "Verify weight of checked luggage before leaving Royal Oak to avoid $100+ excess baggage fees.",
    defaultChecked: false,
  },
  {
    id: "lithium_batteries",
    num: 5,
    priority: "ZERO-TOLERANCE",
    title: "Power Banks & Lithium Batteries in Carry-On ONLY",
    description: "FAA/TSA safety compliance: Loose lithium batteries and portable power banks prohibited in checked luggage.",
    defaultChecked: true,
  },
  {
    id: "tuesday_outing_rule",
    num: 6,
    priority: "RESTRICTION",
    title: "Tue Sep 22 Outing Rule: DIA CLOSED at 4 PM (NO DIA)",
    description: "Detroit evening via FAST Woodward + Free QLINE. Stick to Midtown, Downtown, and Riverwalk.",
    defaultChecked: true,
  },
  {
    id: "dtw_ground_transport",
    num: 7,
    priority: "CRITICAL",
    title: "DTW Airport Ride Arranged for Thu Sep 24 @ 3:15 PM",
    description: "Leave Royal Oak base ~3:15–3:30 PM for DTW McNamara Terminal (target arrival 4:15 PM for 6:40 PM departure).",
    defaultChecked: false,
  },
  {
    id: "bag_tags_rba",
    num: 8,
    priority: "VERIFICATION",
    title: "Bag Tag Routing Destination Verified to RBA (Not CDG)",
    description: "At DTW Delta bag drop counter, inspect physical baggage tag to verify destination code is RBA.",
    defaultChecked: false,
  },
];

const STORAGE_KEY = "trip_readiness_state_v1";

function playAudioTone(type = "alarm") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "alarm") {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.linearRampToValueAtTime(1760, now + 0.15);
      osc1.frequency.linearRampToValueAtTime(880, now + 0.3);
      osc1.frequency.linearRampToValueAtTime(1760, now + 0.45);
      osc1.frequency.linearRampToValueAtTime(880, now + 0.6);

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.linearRampToValueAtTime(880, now + 0.3);
      osc2.frequency.linearRampToValueAtTime(440, now + 0.6);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } else {
      // Pleasant checkoff chime
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // AudioContext blocked or unavailable
  }
}

export default function ReadinessSentinel() {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return INITIAL_READINESS_ITEMS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return INITIAL_READINESS_ITEMS.map((item) => ({
          ...item,
          checked: parsed[item.id] !== undefined ? parsed[item.id] : item.defaultChecked,
        }));
      }
    } catch (e) {}
    return INITIAL_READINESS_ITEMS.map((item) => ({
      ...item,
      checked: item.defaultChecked,
    }));
  });

  const [alarmActive, setAlarmActive] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      const stateToSave = {};
      items.forEach((item) => {
        stateToSave[item.id] = !!item.checked;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {}
  }, [items]);

  const toggleItem = useCallback((id) => {
    setItems((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          const newChecked = !item.checked;
          if (newChecked) {
            playAudioTone("chime");
          }
          return { ...item, checked: newChecked };
        }
        return item;
      });
      return next;
    });
  }, []);

  const checkAll = useCallback(() => {
    playAudioTone("chime");
    setItems((prev) => prev.map((item) => ({ ...item, checked: true })));
  }, []);

  const resetChecks = useCallback(() => {
    setItems(
      INITIAL_READINESS_ITEMS.map((item) => ({
        ...item,
        checked: item.defaultChecked,
      }))
    );
  }, []);

  const triggerAlarm = useCallback(() => {
    setAlarmActive(true);
    playAudioTone("alarm");

    // Try browser notification if granted
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("🚨 TRIP READINESS ALARM", {
          body: "DL 228 departure in 72h. Check off pending readiness alerts!",
          icon: "./icon.svg",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification("🚨 TRIP READINESS ALARM", {
              body: "DL 228 departure in 72h. Check off pending readiness alerts!",
              icon: "./icon.svg",
            });
          }
        });
      }
    }

    setTimeout(() => {
      setAlarmActive(false);
    }, 2000);
  }, []);

  const completedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;
  const pendingCount = totalCount - completedCount;
  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      className={`card ${alarmActive ? "pulse-border-alert" : ""}`}
      style={{
        marginTop: 16,
        background: "linear-gradient(135deg, rgba(255, 68, 68, 0.08) 0%, rgba(14, 21, 38, 0.95) 100%)",
        border: pendingCount > 0 ? "1px solid rgba(255, 107, 107, 0.4)" : "1px solid var(--good)",
        borderRadius: 16,
        padding: 18,
        position: "relative",
      }}
      role="region"
      aria-label="Aggressive Readiness Sentinel and Alarms"
    >
      {/* Sentinel Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🚨</span>
            <span className="label" style={{ color: pendingCount > 0 ? "var(--bad)" : "var(--good)" }}>
              AGGRESSIVE READINESS SENTINEL
            </span>
            <span
              className={`pill ${pendingCount > 0 ? "bad pulse-badge" : "good"}`}
              style={{ fontSize: 10, fontWeight: 800 }}
            >
              {pendingCount > 0 ? `${pendingCount} ALERTS PENDING` : "100% READY"}
            </span>
          </div>
          <h3 style={{ margin: "4px 0 0", fontSize: 19 }}>
            Pre-Flight Readiness &amp; Return Alarms ({completedCount}/{totalCount} Completed • {percent}%)
          </h3>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }} className="no-print">
          <button
            type="button"
            className="hud-btn"
            style={{
              background: "linear-gradient(135deg, #e63946 0%, #b7094c 100%)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 12,
              padding: "7px 14px",
              boxShadow: "0 2px 10px rgba(230, 57, 70, 0.35)",
            }}
            onClick={triggerAlarm}
            title="Sound audio alarm siren and trigger desktop alert"
          >
            🔊 ALARM ME NOW
          </button>

          <button
            type="button"
            className="hud-btn"
            style={{
              background: "rgba(56, 189, 248, 0.15)",
              borderColor: "var(--accent)",
              color: "var(--accent)",
              fontSize: 12,
              padding: "7px 12px",
            }}
            onClick={checkAll}
            title="Mark all readiness alerts as checked"
          >
            ✔ Check Off All
          </button>

          <button
            type="button"
            className="hud-btn"
            style={{
              background: "transparent",
              borderColor: "var(--line)",
              color: "var(--muted)",
              fontSize: 12,
              padding: "7px 10px",
            }}
            onClick={resetChecks}
            title="Reset to initial baseline"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Visual Progress Meter */}
      <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: percent === 100 ? "var(--good)" : percent >= 60 ? "var(--warn)" : "var(--bad)",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Readiness Items Grid */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            style={{
              background: item.checked ? "rgba(14, 21, 38, 0.45)" : "rgba(30, 15, 20, 0.6)",
              border: item.checked ? "1px solid rgba(63, 185, 80, 0.3)" : "1px solid rgba(255, 107, 107, 0.4)",
              borderRadius: 12,
              padding: 12,
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
            role="checkbox"
            aria-checked={item.checked}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleItem(item.id);
              }
            }}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              style={{
                marginTop: 3,
                width: 18,
                height: 18,
                cursor: "pointer",
                accentColor: "#3fb950",
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "1px 6px",
                    borderRadius: 4,
                    background:
                      item.priority === "CRITICAL"
                        ? "rgba(255, 68, 68, 0.2)"
                        : item.priority === "URGENT"
                        ? "rgba(255, 170, 0, 0.2)"
                        : "rgba(56, 189, 248, 0.15)",
                    color:
                      item.priority === "CRITICAL"
                        ? "var(--bad)"
                        : item.priority === "URGENT"
                        ? "var(--warn)"
                        : "var(--accent)",
                  }}
                >
                  #{item.num} • {item.priority}
                </span>
                <span style={{ fontSize: 11, color: item.checked ? "var(--good)" : "var(--bad)", fontWeight: 700 }}>
                  {item.checked ? "✔ READY" : "🚨 ACTION NEEDED"}
                </span>
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: item.checked ? "var(--ink-bright)" : "#ffb4b4",
                  textDecoration: item.checked ? "line-through" : "none",
                  opacity: item.checked ? 0.8 : 1,
                }}
              >
                {item.title}
              </div>
              <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mac Native Terminal Sentinel Note */}
      <div
        style={{
          marginTop: 12,
          padding: "8px 12px",
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: 8,
          fontSize: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ color: "var(--muted)" }}>
          🖥️ <strong>macOS Native Alarms Active:</strong> Run <code className="mono-code">npm run alarm</code> in terminal for speech + system sound alarm.
        </div>
        <div style={{ fontSize: 11, color: "var(--accent)" }}>
          Target: DTW McNamara Terminal • Sep 24 @ 6:40 PM
        </div>
      </div>
    </div>
  );
}
