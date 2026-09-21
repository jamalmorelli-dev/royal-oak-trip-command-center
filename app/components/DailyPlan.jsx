'use client';
import { useState, useMemo } from "react";
import { trip } from "../data";
import { usePersistedState } from "../hooks/usePersistedState";

export default function DailyPlan() {
  const [completed, setCompleted] = usePersistedState("ro-daily-completed", {});
  const [showArchived, setShowArchived] = useState(false);

  function toggle(dayIdx) {
    setCompleted((prev) => ({
      ...prev,
      [dayIdx]: !prev[dayIdx],
    }));
  }

  // Detect current day in America/Detroit
  const todayPrefix = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Detroit",
      month: "short",
      day: "numeric",
    });
    return formatter.format(now); // e.g. "Sep 21"
  }, []);

  // Split into active (Sep 21+) and past archived (before Sep 21)
  const { activeDays, pastDays } = useMemo(() => {
    const active = [];
    const past = [];
    trip.days.forEach((d, idx) => {
      // Days from Sep 21 onwards
      const isPast = [
        "Sep 14", "Sep 15", "Sep 16", "Sep 17", "Sep 18", "Sep 19", "Sep 20"
      ].some(p => d[0].startsWith(p));
      if (isPast) {
        past.push({ data: d, index: idx });
      } else {
        active.push({ data: d, index: idx });
      }
    });
    return { activeDays: active, pastDays: past };
  }, []);

  const completedCount = useMemo(() => {
    return trip.days.filter((_, i) => !!completed[i]).length;
  }, [completed]);

  const progressPercent = Math.round((completedCount / trip.days.length) * 100);

  return (
    <section className="card section" role="region" aria-label="Daily plan">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <div>
          <div className="label">ACTIVE OPERATIONAL RUNWAY (SEP 21–25)</div>
          <h2 style={{ margin: "2px 0 0", fontSize: 22 }}>Upcoming &amp; Current Days</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pill good" style={{ fontSize: 12 }}>
            ● Active Runway: 5 Days Remaining (Sep 21–25)
          </span>
        </div>
      </div>

      <div className="muted" style={{ marginBottom: 14, fontSize: 13 }}>
        Focusing strictly on current and upcoming operations. Past days (Sep 14–20) are safely archived below.
      </div>

      {/* Active & Upcoming Days Table */}
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "4%" }}>✓</th>
              <th style={{ width: "14%" }}>Day</th>
              <th style={{ width: "22%" }}>Base Plan</th>
              <th style={{ width: "14%" }}>Food</th>
              <th style={{ width: "14%" }}>Shopping</th>
              <th style={{ width: "16%" }}>Activity</th>
              <th style={{ width: "14%" }}>Transport</th>
              <th style={{ width: "8%" }}>Budget</th>
            </tr>
          </thead>
          <tbody>
            {activeDays.map(({ data: row, index: i }) => {
              const isToday = row[0].startsWith(todayPrefix);
              const isTue22 = row[0].includes("Sep 22");
              const isWed23 = row[0].includes("Sep 23");
              const isThu24 = row[0].includes("Sep 24");
              const isFri25 = row[0].includes("Sep 25");

              let rowClass = completed[i] ? "row-done" : "";
              if (isToday) rowClass += " row-spine";

              return (
                <tr key={i} className={rowClass}>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!completed[i]}
                      onChange={() => toggle(i)}
                      aria-label={"Mark " + row[0] + " as completed"}
                    />
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <strong style={{ color: isToday ? "var(--accent)" : "var(--ink-bright)" }}>
                        {row[0]}
                      </strong>
                      {isToday && <span className="pill good" style={{ fontSize: 9, padding: "1px 5px", width: "fit-content" }}>TODAY (SEP 21)</span>}
                      {isTue22 && <span className="pill warn" style={{ fontSize: 9, padding: "1px 5px", width: "fit-content" }}>NO DIA</span>}
                      {isWed23 && <span className="pill warn" style={{ fontSize: 9, padding: "1px 5px", width: "fit-content" }}>CHECK-IN 6:40 PM</span>}
                      {isThu24 && <span className="pill bad" style={{ fontSize: 9, padding: "1px 5px", width: "fit-content" }}>TRAVEL DAY (DTW)</span>}
                      {isFri25 && <span className="pill good" style={{ fontSize: 9, padding: "1px 5px", width: "fit-content" }}>TOUCHDOWN RBA</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{row[1]}</div>
                  </td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                  <td>{row[5]}</td>
                  <td>
                    <span className="mono-code" style={{ fontSize: 13 }}>{row[6]}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Collapsible Archived Past Days (Sep 14–20) */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
        <button
          type="button"
          onClick={() => setShowArchived(!showArchived)}
          className="hud-btn"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--line)",
            color: "var(--muted)",
            fontSize: 13,
            padding: "8px 14px",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>📁</span>
          <span>{showArchived ? "Hide Archived Past Days (Sep 14–20)" : `View Archived Past Days (Sep 14–20 • ${pastDays.length} Days Completed)`}</span>
          <span style={{ fontSize: 10 }}>{showArchived ? "▲" : "▼"}</span>
        </button>

        {showArchived && (
          <div style={{ marginTop: 14, overflowX: "auto" }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
              Archived historical records for days prior to September 21.
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "14%" }}>Day</th>
                  <th style={{ width: "22%" }}>Plan</th>
                  <th style={{ width: "14%" }}>Food</th>
                  <th style={{ width: "16%" }}>Activity</th>
                  <th style={{ width: "14%" }}>Transport</th>
                  <th style={{ width: "8%" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {pastDays.map(({ data: row, index: i }) => (
                  <tr key={i} style={{ opacity: 0.7 }}>
                    <td><strong>{row[0]}</strong></td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[4]}</td>
                    <td>{row[5]}</td>
                    <td><span className="pill good" style={{ fontSize: 10 }}>COMPLETED</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
