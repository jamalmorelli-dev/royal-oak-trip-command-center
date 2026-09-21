'use client';
import { useState, useEffect, useMemo } from "react";
import { trip } from "../data";
import CopyButton from "./CopyButton";
import { usePersistedState } from "../hooks/usePersistedState";
import FlightCountdown from "./FlightCountdown";

function getTimeRemaining(targetDate, nowDate) {
  const ms = targetDate.getTime() - nowDate.getTime();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, total: ms };
}

export default function PlaneChecklist() {
  const [activeLeg, setActiveLeg] = useState("return"); // "return" or "outbound"
  const plane = trip.plane;
  const returnPlane = trip.returnPlane;

  // Persisted state for return packing checklist
  const [returnChecked, setReturnChecked] = usePersistedState("ro-plane-return-checked", {});
  // Persisted state for outbound night-before checklist
  const [nightChecked, setNightChecked] = usePersistedState("ro-plane-nightbefore-checked", {});
  // Persisted state for user manual check-in status override
  const [returnCheckedIn, setReturnCheckedIn] = usePersistedState("ro-plane-user-return-checked-in", false);
  const [outboundCheckedIn, setOutboundCheckedIn] = usePersistedState("ro-plane-user-checked-in", true);

  // Live timer tick
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Return flight dates: DL 228 departs Thu Sep 24, 2026 @ 6:40 PM EDT
  const returnCheckInOpen = useMemo(() => new Date("2026-09-23T18:40:00-04:00"), []);
  const returnDeparture = useMemo(() => new Date("2026-09-24T18:40:00-04:00"), []);
  const timeToReturnCheckIn = useMemo(() => getTimeRemaining(returnCheckInOpen, now), [returnCheckInOpen, now]);
  const timeToReturnDeparture = useMemo(() => getTimeRemaining(returnDeparture, now), [returnDeparture, now]);

  // Outbound dates: DL 8491 departed Mon Sep 14, 2026 @ 10:35 AM GMT+1
  const outboundCheckInOpen = useMemo(() => new Date("2026-09-13T10:35:00+01:00"), []);
  const outboundDeparture = useMemo(() => new Date("2026-09-14T10:35:00+01:00"), []);
  const timeToOutboundCheckIn = useMemo(() => getTimeRemaining(outboundCheckInOpen, now), [outboundCheckInOpen, now]);
  const timeToOutboundDeparture = useMemo(() => getTimeRemaining(outboundDeparture, now), [outboundDeparture, now]);

  // Return check-in status
  const returnStatus = useMemo(() => {
    if (returnCheckedIn) {
      return { label: "CHECKED IN", cls: "good", detail: "Return check-in marked as completed." };
    }
    if (now < returnCheckInOpen) {
      return {
        label: "NOT OPEN YET",
        cls: "muted",
        detail: "Opens Wednesday Sep 23 @ 6:40 PM EDT (24 hours before DTW departure).",
      };
    } else if (now >= returnCheckInOpen && now <= returnDeparture) {
      return {
        label: "OPEN — CHECK IN NOW",
        cls: "warn pulse-badge",
        detail: "Delta online check-in window is OPEN! Check in immediately via app or delta.com.",
      };
    } else {
      return { label: "DEPARTED", cls: "muted", detail: "Flight DL 228 scheduled departure has passed." };
    }
  }, [returnCheckedIn, now, returnCheckInOpen, returnDeparture]);

  function toggleReturnItem(i) {
    setReturnChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  function toggleNight(i) {
    setNightChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  const returnCompletedCount = useMemo(() => {
    if (!returnPlane?.packingChecklist) return 0;
    return returnPlane.packingChecklist.filter((_, i) => !!returnChecked[i]).length;
  }, [returnPlane?.packingChecklist, returnChecked]);

  return (
    <section className="section" role="region" aria-label="Plane Checklist">
      {/* Flight Leg Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }} className="no-print">
        <button
          type="button"
          className={"chip " + (activeLeg === "return" ? "active" : "")}
          onClick={() => setActiveLeg("return")}
          style={{ padding: "8px 16px", fontSize: 14, fontWeight: 700 }}
        >
          ✈️ Return Leg: DTW ➔ CDG ➔ RBA (Sep 24–25) • ACTIVE
        </button>
        <button
          type="button"
          className={"chip " + (activeLeg === "outbound" ? "active" : "")}
          onClick={() => setActiveLeg("outbound")}
          style={{ padding: "8px 16px", fontSize: 14 }}
        >
          🗄️ Outbound Leg: RBA ➔ CDG ➔ DTW (Sep 14 Archive)
        </button>
      </div>

      {activeLeg === "return" && (
        <>
          {/* Top Return Flight KPI Cards */}
          <div className="grid" style={{ marginBottom: 16 }}>
            <div className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
              <div className="label">RETURN CHECK-IN WINDOW</div>
              <div className={"kpi " + returnStatus.cls} style={{ fontSize: 22, marginTop: 4 }}>
                {returnStatus.label}
              </div>
              {timeToReturnCheckIn.total > 0 && !returnCheckedIn && (
                <div className="timer-grid">
                  <div className="timer-unit">
                    <span className="timer-val">{timeToReturnCheckIn.days}</span>
                    <span className="timer-lbl">Days</span>
                  </div>
                  <div className="timer-unit">
                    <span className="timer-val">{timeToReturnCheckIn.hours}</span>
                    <span className="timer-lbl">Hours</span>
                  </div>
                  <div className="timer-unit">
                    <span className="timer-val">{timeToReturnCheckIn.minutes}</span>
                    <span className="timer-lbl">Mins</span>
                  </div>
                  <div className="timer-unit">
                    <span className="timer-val">{timeToReturnCheckIn.seconds}</span>
                    <span className="timer-lbl">Secs</span>
                  </div>
                </div>
              )}
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                {returnStatus.detail}
              </div>
              <div style={{ marginTop: 8 }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={returnCheckedIn}
                    onChange={(e) => setReturnCheckedIn(e.target.checked)}
                  />
                  <span>Mark Return as Checked In</span>
                </label>
              </div>
            </div>

            <div className="card">
              <div className="label">THURSDAY DTW DEPARTURE</div>
              <div className="kpi">6:40 PM EDT</div>
              {timeToReturnDeparture.total > 0 ? (
                <div className="timer-grid">
                  <div className="timer-unit">
                    <span className="timer-val">{timeToReturnDeparture.days}</span>
                    <span className="timer-lbl">Days</span>
                  </div>
                  <div className="timer-unit">
                    <span className="timer-val">{timeToReturnDeparture.hours}</span>
                    <span className="timer-lbl">Hours</span>
                  </div>
                  <div className="timer-unit">
                    <span className="timer-val">{timeToReturnDeparture.minutes}</span>
                    <span className="timer-lbl">Mins</span>
                  </div>
                  <div className="timer-unit">
                    <span className="timer-val">{timeToReturnDeparture.seconds}</span>
                    <span className="timer-lbl">Secs</span>
                  </div>
                </div>
              ) : (
                <span className="pill muted" style={{ marginTop: 6, display: "inline-block" }}>Wheels Up</span>
              )}
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                {returnPlane.primaryFlight}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                Connection: {returnPlane.connection}
              </div>
            </div>

            <div className="card">
              <div className="label">ROYAL OAK → DTW TIMING</div>
              <div className="kpi">~3:15–3:30 PM</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                Leave base ~3:15 PM Thu Sep 24.
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                Arrive DTW McNamara Terminal by ~4:15 PM (2h 25m buffer).
              </div>
            </div>

            <div className="card">
              <div className="label">DTW AIRPORT TERMINAL</div>
              <div className="kpi good" style={{ fontSize: 22 }}>McNamara</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                Delta World Gateway Terminal at DTW.
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                2 checked bags free (up to 23 kg / 50 lb each).
              </div>
            </div>
          </div>

          {/* Highest Priority: Return Document & Carry-On Safety Card */}
          <div
            className="card"
            style={{
              marginBottom: 16,
              background: "rgba(255, 123, 123, 0.08)",
              border: "2px solid var(--bad)",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }} aria-hidden="true">🛂</span>
              <div>
                <span className="pill bad" style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.06em" }}>
                  HIGHEST PRIORITY: RETURN BAGGAGE &amp; PASSPORT
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: 18, color: "#fff" }}>
                  Physical Passport &amp; Tag Through to Rabat (RBA)
                </h3>
              </div>
            </div>
            <p style={{ margin: "6px 0", fontSize: 14 }}>
              <strong>Name on Ticket:</strong> <code>BENJAMIN PRENTISS</code>. Carry your original physical passport on your person at all times.
            </p>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                borderLeft: "4px solid var(--warn)",
                padding: "10px 14px",
                borderRadius: "0 8px 8px 0",
                marginTop: 8,
                fontSize: 13,
              }}
            >
              <strong>⚠️ CRITICAL CHECK AT DTW BAG DROP:</strong> When handing bags to Delta agents at DTW McNamara Terminal, ensure the bag tag is printed through to <strong>RBA</strong> (Rabat), NOT Paris (CDG). Both checked bags (up to 23 kg / 50 lb each) are free.
              <br />
              <strong>⚠️ ZERO-TOLERANCE CARRY-ON RULE:</strong> Passports, medications, house keys, and <strong>power banks / lithium battery packs</strong> MUST stay in your carry-on luggage. Never pack battery packs into checked baggage.
            </div>
          </div>

          {/* Interactive Return Packing & Weigh Checklist */}
          <section className="card section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Return Packing &amp; Bag Weigh Checklist</h2>
              <span className="pill good" style={{ fontSize: 12 }}>
                {returnCompletedCount} of {returnPlane.packingChecklist.length} completed
              </span>
            </div>
            <div className="muted" style={{ marginBottom: 12, fontSize: 13 }}>
              Prepare your luggage in Royal Oak before Thursday departure. State persists automatically across refreshes.
            </div>
            <div className="checklist">
              {returnPlane.packingChecklist.map((item, i) => (
                <label
                  key={i}
                  style={{
                    cursor: "pointer",
                    background: returnChecked[i] ? "rgba(117, 211, 155, 0.08)" : undefined,
                    borderColor: returnChecked[i] ? "var(--good)" : undefined,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!returnChecked[i]}
                    onChange={() => toggleReturnItem(i)}
                    aria-label={item}
                  />
                  <span style={{ textDecoration: returnChecked[i] ? "line-through" : "none", opacity: returnChecked[i] ? 0.7 : 1 }}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Master Mission Countdown Timer */}
          <div style={{ marginBottom: 16 }}>
            <FlightCountdown defaultMilestone="checkin" />
          </div>

          {/* Hour-by-Hour Flight Timeline Leading Up to Departure */}
          <section className="card section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
              <div>
                <span className="label">HOUR-BY-HOUR DEPARTURE RUNWAY</span>
                <h2 style={{ margin: "2px 0 0" }}>⏱️ Hour-by-Hour Timeline Leading Up to DL 228 Departure</h2>
              </div>
              <span className="pill good" style={{ fontSize: 11, fontWeight: 700 }}>
                DTW McNamara ➔ Paris CDG ➔ Rabat RBA
              </span>
            </div>

            <div className="muted" style={{ marginBottom: 16, fontSize: 13 }}>
              Chronological operational sequence from T-24h check-in, morning luggage staging, DTW airport arrival, TSA security, boarding, pushback, to Rabat touchdown.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(returnPlane.hourByHourTimeline || []).map((step, idx) => {
                const [time, phase, action, detail] = step;
                const isCritical = phase.includes("CHECK-IN") || phase.includes("BAG DROP") || phase.includes("ZERO") || phase.includes("WHEELS");
                const isWarning = phase.includes("BAG DROP");
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      background: isCritical ? "rgba(22, 33, 62, 0.85)" : "rgba(14, 21, 38, 0.5)",
                      border: isWarning ? "1px solid var(--warn)" : isCritical ? "1px solid rgba(88, 166, 255, 0.4)" : "1px solid var(--line)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ minWidth: 165, flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: "var(--ink-bright)" }}>{time}</div>
                      <span
                        className={`pill ${phase.includes("CHECK-IN") || phase.includes("BAG DROP") ? "warn" : phase.includes("ZERO") || phase.includes("WHEELS UP") ? "bad" : phase.includes("HOME") ? "good" : ""}`}
                        style={{ fontSize: 10, padding: "2px 6px", marginTop: 4, display: "inline-block", fontWeight: 700 }}
                      >
                        {phase}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-bright)" }}>{action}</div>
                      <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>{detail}</div>
                      {isWarning && (
                        <div className="warn" style={{ marginTop: 6, fontSize: 12, fontWeight: 700 }}>
                          ⚠️ CRITICAL CHECK: Inspect printed bag tag destination before it rolls away. Confirm destination code is RBA (Rabat), NOT CDG.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* AF1258 Schedule Verification Notice */}
          <div className="warn-box" role="alert" style={{ marginTop: 16 }}>
            <p className="warn" style={{ margin: 0 }}>
              <strong>⚠️ Air France Connection Notice (AF1258 / DL8271):</strong> Verified arrival time at Rabat RBA is <strong>1:10 PM GMT+1</strong> on Friday Sep 25 (Morocco UTC+1 legal-time schedule). Re-check booking on the Delta / Air France app when check-in opens on Wednesday Sep 23 @ 6:40 PM.
            </p>
          </div>
        </>
      )}

      {activeLeg === "outbound" && (
        <>
          {/* Outbound Archive */}
          <div className="card" style={{ marginBottom: 16, borderColor: "var(--good)" }}>
            <span className="pill good" style={{ fontWeight: 800 }}>✔ OUTBOUND COMPLETED (SEP 14)</span>
            <h3 style={{ margin: "6px 0 2px" }}>Rabat (RBA) ➔ Paris (CDG) ➔ Detroit (DTW)</h3>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              DL 8491 (RBA 10:35 AM → CDG 2:40 PM) + DL 8719 (CDG 4:05 PM → DTW 6:50 PM). Arrived safely in Detroit on Sep 14.
            </p>
          </div>

          <section className="card section">
            <h2>Outbound flight &amp; document checklist (Archived)</h2>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>Item</th>
                    <th style={{ width: "15%" }}>Status</th>
                    <th>Guidance</th>
                  </tr>
                </thead>
                <tbody>
                  {plane.checkin.map((row, i) => (
                    <tr key={i}>
                      <td><strong>{row[0]}</strong></td>
                      <td><span className="pill good">COMPLETED</span></td>
                      <td>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
