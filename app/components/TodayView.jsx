'use client';
import { useMemo } from "react";
import { trip } from "../data";
import { getTimeRemaining, KEY_DATES } from "../lib/tripTime";
import CopyButton from "./CopyButton";
import MapLink from "./MapLink";

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

      {isPreTrip && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Pre-Trip Hero Card */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, rgba(88, 166, 255, 0.12) 0%, rgba(14, 21, 38, 0.9) 100%)",
              border: "1px solid var(--accent)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <span className="pill warn" style={{ fontSize: 11, fontWeight: 800 }}>
                  PRE-DEPARTURE READINESS PHASE
                </span>
                <h3 style={{ margin: "6px 0 4px", fontSize: 20 }}>
                  T-Minus {timeToCheckIn.days} Days to Check-In
                </h3>
                <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                  Outbound flight departs <strong>Monday, Sep 14 @ 10:35 AM</strong> from Rabat RBA.
                  Online check-in opens <strong>Sunday, Sep 13 @ 10:35 AM</strong> (Morocco GMT+1).
                </p>
              </div>

              {onSelectTab && (
                <button
                  type="button"
                  className="hud-quick-btn no-print"
                  onClick={() => onSelectTab("Plane Checklist")}
                >
                  Open Plane Checklist &amp; Rules →
                </button>
              )}
            </div>

            <div className="grid" style={{ marginTop: 16 }}>
              <div className="card" style={{ background: "rgba(0, 0, 0, 0.25)" }}>
                <div className="label">CHECK-IN OPENS IN</div>
                <div className="kpi warn" style={{ fontSize: 22, marginTop: 4 }}>
                  {timeToCheckIn.days}d {timeToCheckIn.hours}h {timeToCheckIn.minutes}m
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  Sunday Sep 13 @ 10:35 AM (GMT+1)
                </div>
              </div>

              <div className="card" style={{ background: "rgba(0, 0, 0, 0.25)" }}>
                <div className="label">WHEELS UP IN</div>
                <div className="kpi" style={{ fontSize: 22, marginTop: 4 }}>
                  {timeToDeparture.days}d {timeToDeparture.hours}h {timeToDeparture.minutes}m
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  Monday Sep 14 @ 10:35 AM (DL 8491)
                </div>
              </div>

              <div className="card" style={{ background: "rgba(0, 0, 0, 0.25)" }}>
                <div className="label">FÈS DEPARTURE TARGET</div>
                <div className="kpi good" style={{ fontSize: 22, marginTop: 4 }}>
                  04:45–05:00 AM
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  Target RBA desk by 07:00–07:30 AM
                </div>
              </div>
            </div>
          </div>

          {/* Today's 3 High-Priority Actions */}
          <div className="card">
            <h3 style={{ margin: "0 0 12px", fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚡</span>
              <span>Action Items for Today</span>
            </h3>
            <div className="grid">
              <div style={{ background: "rgba(14, 21, 38, 0.6)", padding: 12, borderRadius: 12, border: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 700, color: "var(--ink-bright)", marginBottom: 4 }}>
                  1. Physical Passport &amp; Travel Wallet
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Verify original physical passport is in travel wallet under <strong>BENJAMIN PRENTISS</strong>. Never place in checked bag.
                </div>
              </div>

              <div style={{ background: "rgba(14, 21, 38, 0.6)", padding: 12, borderRadius: 12, border: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 700, color: "var(--ink-bright)", marginBottom: 4 }}>
                  2. Baggage Weigh-In &amp; Tags
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  First and second checked bags are free up to <strong>23 kg / 50 lb each</strong>. Tag bags with full contact info.
                </div>
              </div>

              <div style={{ background: "rgba(14, 21, 38, 0.6)", padding: 12, borderRadius: 12, border: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 700, color: "var(--ink-bright)", marginBottom: 4 }}>
                  3. Carry-On Electronics Rules
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Keep phone chargers, medications, and <strong>power banks / battery packs</strong> inside carry-on luggage only.
                </div>
              </div>
            </div>
          </div>

          {/* Outbound Itinerary Preview */}
          <div className="card">
            <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>🛫 Monday Sep 14 Travel Schedule</h3>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Flight</th>
                    <th>Carrier</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>DL 8491</strong></td>
                    <td>Air France</td>
                    <td>Rabat RBA • 10:35 AM</td>
                    <td>Paris CDG • 2:40 PM</td>
                    <td><span className="pill">Economy X</span></td>
                  </tr>
                  <tr>
                    <td><strong>DL 8719</strong></td>
                    <td>Air France</td>
                    <td>Paris CDG • 4:05 PM</td>
                    <td>Detroit DTW • 6:50 PM</td>
                    <td><span className="pill">Economy X</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
