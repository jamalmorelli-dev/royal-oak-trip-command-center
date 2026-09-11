'use client';
import { useMemo } from "react";
import { trip } from "../data";
import { usePersistedState } from "../hooks/usePersistedState";

export default function DailyPlan() {
  const [completed, setCompleted] = usePersistedState("ro-daily-completed", {});

  function toggle(dayIdx) {
    setCompleted((prev) => ({
      ...prev,
      [dayIdx]: !prev[dayIdx],
    }));
  }

  // Detect current day in America/Detroit or trip calendar
  const todayPrefix = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Detroit",
      month: "short",
      day: "numeric",
    });
    return formatter.format(now); // e.g. "Sep 15"
  }, []);

  const completedCount = useMemo(() => {
    return trip.days.filter((_, i) => !!completed[i]).length;
  }, [completed]);

  const progressPercent = Math.round((completedCount / trip.days.length) * 100);

  return (
    <section className="card section" role="region" aria-label="Daily plan">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <div>
          <div className="label">12-DAY EXECUTION CALENDAR</div>
          <h2 style={{ margin: "2px 0 0", fontSize: 22 }}>Every Day Mapped</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pill good" style={{ fontSize: 12 }}>
            {completedCount} of {trip.days.length} days completed ({progressPercent}%)
          </span>
        </div>
      </div>

      <div className="muted" style={{ marginBottom: 14, fontSize: 13 }}>
        Track daily execution. Highlights distinguish primary Detroit excursion days from standard school routines. State persists automatically.
      </div>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "4%" }}>✓</th>
              <th style={{ width: "12%" }}>Day</th>
              <th style={{ width: "22%" }}>Base Plan</th>
              <th style={{ width: "14%" }}>Food</th>
              <th style={{ width: "14%" }}>Shopping</th>
              <th style={{ width: "16%" }}>Activity</th>
              <th style={{ width: "14%" }}>Transport</th>
              <th style={{ width: "8%" }}>Budget</th>
            </tr>
          </thead>
          <tbody>
            {trip.days.map((row, i) => {
              const isToday = row[0].startsWith(todayPrefix);
              const isFri18 = row[0].includes("Sep 18");
              const isSat19 = row[0].includes("Sep 19");
              const isTue22 = row[0].includes("Sep 22");

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
                      {isToday && <span className="pill good" style={{ fontSize: 9, padding: "1px 5px", width: "fit-content" }}>TODAY</span>}
                      {isFri18 && <span className="pill" style={{ fontSize: 9, padding: "1px 5px", width: "fit-content" }}>DIA + DANCE</span>}
                      {isSat19 && <span className="pill" style={{ fontSize: 9, padding: "1px 5px", width: "fit-content", background: "rgba(255, 209, 102, 0.2)", borderColor: "var(--warn)", color: "var(--warn)" }}>MAIN DETROIT</span>}
                      {isTue22 && <span className="pill" style={{ fontSize: 9, padding: "1px 5px", width: "fit-content" }}>NO DIA</span>}
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
    </section>
  );
}
