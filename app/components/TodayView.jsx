'use client';
import { useMemo } from "react";
import { trip } from "../data";
import { getTimeRemaining, KEY_DATES } from "../lib/tripTime";
import CopyButton from "./CopyButton";
import MapLink from "./MapLink";
import ReadinessSentinel from "./ReadinessSentinel";
import FlightCountdown from "./FlightCountdown";

/**
 * Determine which timezone applies for a given date during the trip.
 */
function getTripTimezone(dateStr) {
  const d = new Date(dateStr);
  const month = d.getMonth(); // 0-indexed, Sep = 8
  const day = d.getDate();
  if (month === 8 && day === 14) return "Africa/Casablanca";
  if (month === 8 && day === 25) return "Europe/Paris";
  if (month === 8 && day >= 15 && day <= 24) return "America/Detroit";
  return "America/Detroit";
}

function getTodayInTrip() {
  const now = new Date();
  const month = now.getMonth();
  const approxDay = now.getDate();

  let tz = "America/Detroit";
  if (month === 8 && approxDay === 14) tz = "Africa/Casablanca";
  if (month === 8 && approxDay === 25) tz = "Europe/Paris";
  if (month === 8 && approxDay < 14) tz = "Africa/Casablanca";
  if (month === 8 && approxDay > 25) tz = "Africa/Casablanca";
  if (month !== 8) tz = "Africa/Casablanca";

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return { dateStr: formatter.format(now), tz };
}

export default function TodayView({ onSelectTab }) {
  const { dateStr, tz } = useMemo(() => getTodayInTrip(), []);

  const todayMatch = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      month: "short",
      day: "numeric",
    });
    const todayShort = formatter.format(now); // e.g. "Sep 15"

    const dayIndex = trip.days.findIndex((d) => {
      const dayLabel = d[0]; // "Sep 15 Tue"
      return dayLabel.startsWith(todayShort);
    });

    return dayIndex;
  }, [tz]);

  const todayFlights = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      month: "short",
      day: "numeric",
    });
    const todayShort = formatter.format(now);
    return trip.flights.filter((f) => f[0].startsWith(todayShort));
  }, [tz]);

  const dayData = todayMatch >= 0 ? trip.days[todayMatch] : null;
  const isPreTrip = !dayData && new Date() < new Date("2026-09-14T00:00:00+01:00");
  const isPostTrip = !dayData && new Date() > new Date("2026-09-25T23:59:59+01:00");

  // Countdown calculations
  const checkInTarget = new Date(KEY_DATES.checkInOpen);
  const departureTarget = new Date(KEY_DATES.departure);
  const timeToCheckIn = getTimeRemaining(checkInTarget);
  const timeToDeparture = getTimeRemaining(departureTarget);

  return (
    <section className="card section" role="region" aria-label="Today's plan">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <div>
          <div className="label">ACTIVE OPERATIONAL BRIEFING</div>
          <h2 style={{ margin: "2px 0 0", fontSize: 24 }}>📅 {dateStr}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="pill good" style={{ fontSize: 11 }}>● LIVE TIMEZONE: {tz}</span>
        </div>
      </div>

      {/* MASTER MISSION COUNTDOWN TIMER — FRONT & CENTER */}
      <div style={{ marginBottom: 16 }}>
        <FlightCountdown defaultMilestone="checkin" />
      </div>

      {/* Aggressive Readiness Sentinel & Return Alarms */}
      <ReadinessSentinel />

      {isPostTrip && (
        <div className="card" style={{ borderColor: "var(--good)" }}>
          <div className="kpi good" style={{ fontSize: 22 }}>Trip Complete ✓</div>
          <div className="muted">Sep 14–25, 2026. All flights and receipts successfully concluded.</div>
        </div>
      )}

      {dayData && (
        <>
          <div className="grid" style={{ marginBottom: 16 }}>
            <div className="card" style={{ borderColor: "var(--accent)" }}>
              <div className="label">Base Plan</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{dayData[1]}</div>
            </div>
            <div className="card">
              <div className="label">Day Budget Target</div>
              <div className="kpi" style={{ fontSize: 26, marginTop: 4 }}>{dayData[6]}</div>
              <div className="muted" style={{ fontSize: 12 }}>Estimated daily operating target</div>
            </div>
          </div>

          <div className="grid">
            <div className="card">
              <div className="label">🍽 Food &amp; Dining</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{dayData[2]}</div>
            </div>
            <div className="card">
              <div className="label">🛍 Shopping &amp; Errands</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{dayData[3] || "None"}</div>
            </div>
            <div className="card">
              <div className="label">🎯 Activity / Outing</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{dayData[4]}</div>
            </div>
            <div className="card">
              <div className="label">🚗 Transportation</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{dayData[5]}</div>
            </div>
          </div>

          {/* Active Local Reference & Morning Commute Bar */}
          <div className="card" style={{ marginTop: 16, background: "rgba(14, 21, 38, 0.75)", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span className="label">COMMUTE &amp; SCHOOL REFERENCE</span>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>
                  {trip.school}
                  <CopyButton text={trip.school} label="school address" />
                  <MapLink address={trip.school} />
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                SMART Fixed Route: <span className="good" style={{ fontWeight: 700 }}>$0 (Free for Susu w/ student ID)</span>
              </div>
            </div>
          </div>

          {/* Upcoming 72-Hour Runway & Key Excursions */}
          <div className="card" style={{ marginTop: 16, borderLeft: "4px solid var(--accent)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🧭</span>
              <h3 style={{ margin: 0, fontSize: 16 }}>Upcoming 72-Hour Excursion &amp; Return Runway</h3>
            </div>
            <div className="grid">
              <div style={{ background: "rgba(10, 16, 32, 0.6)", padding: 12, borderRadius: 12, border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span className="pill" style={{ fontSize: 10 }}>TOMORROW</span>
                  <strong>Tue Sep 22 • Detroit Evening</strong>
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Casual Midtown, Downtown, Campus Martius &amp; Riverwalk stroll via FAST Woodward + Free QLINE.
                </div>
                <div className="warn" style={{ fontSize: 12, marginTop: 6, fontWeight: 700 }}>
                  ⚠️ DIA closed at 4:00 PM (NO DIA). Keep evening casual.
                </div>
              </div>

              <div style={{ background: "rgba(10, 16, 32, 0.6)", padding: 12, borderRadius: 12, border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span className="pill warn" style={{ fontSize: 10 }}>CHECK-IN OPENS</span>
                  <strong>Wed Sep 23 • Final Full Day</strong>
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Celebratory dinner &amp; family evening.
                </div>
                <div className="good" style={{ fontSize: 12, marginTop: 6, fontWeight: 700 }}>
                  ✈️ 6:40 PM EDT: Delta check-in opens for return flight DL 228.
                </div>
              </div>

              <div style={{ background: "rgba(10, 16, 32, 0.6)", padding: 12, borderRadius: 12, border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span className="pill bad" style={{ fontSize: 10 }}>TRAVEL DAY</span>
                  <strong>Thu Sep 24 • Departure</strong>
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Pack &amp; weigh bags (2x 23kg free). Leave Royal Oak ~3:15–3:30 PM for DTW.
                </div>
                <div style={{ fontSize: 12, marginTop: 6, color: "var(--ink-bright)" }}>
                  DL 228 wheels up @ 6:40 PM EDT to Paris CDG.
                </div>
                {onSelectTab && (
                  <button
                    type="button"
                    className="hud-quick-btn no-print"
                    style={{ marginTop: 8, fontSize: 11, padding: "4px 8px", width: "100%", justifyContent: "center" }}
                    onClick={() => onSelectTab("Return Flight (DTW)")}
                  >
                    ⏱️ View Hour-by-Hour Timeline →
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {todayFlights.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>✈ Today's Scheduled Flights</h3>
          {todayFlights.map((f, i) => (
            <div key={i} className="card" style={{ marginBottom: 8, borderColor: f[7]?.includes("verify") ? "var(--warn)" : "var(--line)" }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{f[1]} — {f[2]}</div>
              <div style={{ fontSize: 14, margin: "4px 0" }}>{f[3]} {f[4]} → {f[5]} {f[6]}</div>
              {f[7] && <div className={f[7].includes("verify") || f[7].includes("CHANGED") ? "warn" : "muted"} style={{ fontSize: 13 }}>{f[7]}</div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
