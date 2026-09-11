'use client';
import { useState, useEffect, useMemo } from 'react';
import { trip } from '../data';
import CopyButton from './CopyButton';
import { usePersistedState } from '../hooks/usePersistedState';

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
  const plane = trip.plane;

  // Persisted state for night-before checklist
  const [nightChecked, setNightChecked] = usePersistedState('ro-plane-nightbefore-checked', {});
  // Persisted state for user manual check-in status override
  const [userCheckedIn, setUserCheckedIn] = usePersistedState('ro-plane-user-checked-in', false);

  // Live timer tick for real-time countdowns
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Outbound flight DL8491 departs Mon Sep 14, 2026 at 10:35 AM Morocco time (Africa/Casablanca = UTC+1).
  // Check-in opens 24h before: Sun Sep 13, 2026 at 10:35 AM Africa/Casablanca.
  const checkInOpenTime = useMemo(() => new Date('2026-09-13T10:35:00+01:00'), []);
  const departureTime = useMemo(() => new Date('2026-09-14T10:35:00+01:00'), []);

  const timeToCheckIn = useMemo(() => getTimeRemaining(checkInOpenTime, now), [checkInOpenTime, now]);
  const timeToDeparture = useMemo(() => getTimeRemaining(departureTime, now), [departureTime, now]);

  // Determine check-in window status:
  const checkInStatus = useMemo(() => {
    if (userCheckedIn) {
      return {
        label: 'CHECKED IN',
        cls: 'good',
        detail: 'You have marked check-in as completed.',
      };
    }

    if (now < checkInOpenTime) {
      return {
        label: 'NOT OPEN',
        cls: 'muted',
        detail: 'Opens Sunday Sep 13 at ~10:35 AM Morocco time (24h before RBA departure).',
      };
    } else if (now >= checkInOpenTime && now <= departureTime) {
      return {
        label: 'OPEN — CHECK IN NOW',
        cls: 'warn pulse-badge',
        detail: 'Airline check-in window is OPEN. Check in online immediately and save boarding passes.',
      };
    } else {
      return {
        label: 'DEPARTED / PAST',
        cls: 'muted',
        detail: 'Flight scheduled departure time has passed.',
      };
    }
  }, [userCheckedIn, now, checkInOpenTime, departureTime]);

  function toggleNight(index) {
    setNightChecked((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  const nightCompletedCount = useMemo(() => {
    if (!plane?.nightBefore) return 0;
    return plane.nightBefore.filter((_, i) => !!nightChecked[i]).length;
  }, [plane?.nightBefore, nightChecked]);

  if (!plane) return null;

  return (
    <section className="section" role="region" aria-label="Plane Checklist">
      {/* Flight & Identity Bar */}
      <div className="card" style={{ marginBottom: 16, borderColor: 'var(--accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div className="label">PASSENGER</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{trip.traveler.toUpperCase()}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span className="pill good" style={{ fontSize: 11, fontWeight: 700 }}>✔ DELTA RECORDS AUDITED &amp; CONFIRMED</span>
              <span className="pill good" style={{ fontSize: 11 }}>ALL TRIP REQUIREMENTS COMPLETE</span>
            </div>
          </div>
          <div className="flight-refs">
            <div>
              <span className="label">Confirmation: </span>
              <strong>{trip.confirmation}</strong>
              <CopyButton text={trip.confirmation} label="confirmation number" />
            </div>
            <div style={{ marginLeft: 10 }}>
              <span className="label">First: </span>
              <strong>Benjamin</strong>
              <CopyButton text="Benjamin" label="first name" />
            </div>
            <div style={{ marginLeft: 10 }}>
              <span className="label">Last: </span>
              <strong>Prentiss</strong>
              <CopyButton text="Prentiss" label="last name" />
            </div>
            <div style={{ marginLeft: 10 }}>
              <span className="label">Ticket: </span>
              <strong>{trip.ticket}</strong>
              <CopyButton text={trip.ticket} label="ticket number" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a
              href="https://www.delta.com/my-trips/search?staticurl=t"
              target="_blank"
              rel="noopener noreferrer"
              className="toolbar button"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                background: 'var(--accent)',
                color: '#071225',
                fontWeight: 700,
                fontSize: 13,
              }}
              title="Open Delta Find Your Trip search form in new tab"
            >
              Delta Find Your Trip ↗
            </a>
            <a
              href="https://wwws.airfrance.com/check-in"
              target="_blank"
              rel="noopener noreferrer"
              className="toolbar button btn-secondary"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
              }}
              title="Open Air France Check-in in new tab"
            >
              Air France Check-in ↗
            </a>
            <button
              type="button"
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="toolbar button btn-secondary no-print"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
              title="Print physical travel one-pager emergency backup"
            >
              🖨 Print Travel One-Pager
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="label">CHECK-IN WINDOW</div>
          <div className={`kpi ${checkInStatus.cls}`} style={{ fontSize: 22, marginTop: 4 }}>
            {checkInStatus.label}
          </div>
          {timeToCheckIn.total > 0 && !userCheckedIn && (
            <div className="timer-grid">
              <div className="timer-unit">
                <span className="timer-val">{timeToCheckIn.days}</span>
                <span className="timer-lbl">Days</span>
              </div>
              <div className="timer-unit">
                <span className="timer-val">{timeToCheckIn.hours}</span>
                <span className="timer-lbl">Hours</span>
              </div>
              <div className="timer-unit">
                <span className="timer-val">{timeToCheckIn.minutes}</span>
                <span className="timer-lbl">Mins</span>
              </div>
              <div className="timer-unit">
                <span className="timer-val">{timeToCheckIn.seconds}</span>
                <span className="timer-lbl">Secs</span>
              </div>
            </div>
          )}
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            {checkInStatus.detail}
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={userCheckedIn}
                onChange={(e) => setUserCheckedIn(e.target.checked)}
              />
              <span>Mark as Checked In</span>
            </label>
          </div>
        </div>

        <div className="card">
          <div className="label">MONDAY DEPARTURE</div>
          <div className="kpi">10:35 AM</div>
          {timeToDeparture.total > 0 ? (
            <div className="timer-grid">
              <div className="timer-unit">
                <span className="timer-val">{timeToDeparture.days}</span>
                <span className="timer-lbl">Days</span>
              </div>
              <div className="timer-unit">
                <span className="timer-val">{timeToDeparture.hours}</span>
                <span className="timer-lbl">Hours</span>
              </div>
              <div className="timer-unit">
                <span className="timer-val">{timeToDeparture.minutes}</span>
                <span className="timer-lbl">Mins</span>
              </div>
              <div className="timer-unit">
                <span className="timer-val">{timeToDeparture.seconds}</span>
                <span className="timer-lbl">Secs</span>
              </div>
            </div>
          ) : (
            <span className="pill muted" style={{ marginTop: 6, display: 'inline-block' }}>Wheels Up</span>
          )}
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            {plane.primaryFlight}
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
            Connection: {plane.connection}
          </div>
        </div>

        <div className="card">
          <div className="label">FÈS → RBA TIMING</div>
          <div className="kpi">04:45–05:00</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {plane.departureTarget}
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
            Target arrival at RBA airport: 7:00–7:30 AM (3h buffer).
          </div>
        </div>

        <div className="card">
          <div className="label">RBA AIRPORT DESK RULE</div>
          <div className="kpi warn" style={{ fontSize: 22 }}>Desk first</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {plane.airportRule}
          </div>
        </div>
      </div>

      {/* Highest Priority: Passport Callout & Carry-on Rule */}
      <div
        className="card"
        style={{
          marginBottom: 16,
          background: 'rgba(255, 123, 123, 0.08)',
          border: '2px solid var(--bad)',
          borderRadius: 16,
          padding: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }} aria-hidden="true">🛂</span>
          <div>
            <span className="pill bad" style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.06em' }}>
              HIGHEST PRIORITY ITEM
            </span>
            <h3 style={{ margin: '4px 0 0', fontSize: 18, color: '#fff' }}>
              Physical Passport in Travel Wallet
            </h3>
          </div>
        </div>
        <p style={{ margin: '6px 0', fontSize: 14 }}>
          <strong>Name on Ticket:</strong> <code>BENJAMIN PRENTISS</code>. Carry your original physical passport on your person at all times.
        </p>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderLeft: '4px solid var(--warn)',
            padding: '10px 14px',
            borderRadius: '0 8px 8px 0',
            marginTop: 8,
            fontSize: 13,
          }}
        >
          <strong>⚠️ ZERO-TOLERANCE CARRY-ON RULE:</strong> Passport, prescription medication, cash/cards, phone, and <strong>power banks / lithium battery packs</strong> MUST stay inside your carry-on luggage. <strong>Never</strong> pack power banks or passports into checked baggage.
        </div>
      </div>

      {/* Zero-Miss Plane Checklist Table */}
      <section className="card section">
        <h2>Zero-miss document &amp; flight checklist</h2>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Item</th>
                <th style={{ width: '15%' }}>Status</th>
                <th>Exactly what to do</th>
              </tr>
            </thead>
            <tbody>
              {plane.checkin.map((row, i) => {
                const isCritical = row[1] === 'CRITICAL';
                return (
                  <tr
                    key={i}
                    style={{
                      background: isCritical ? 'rgba(255, 123, 123, 0.04)' : undefined,
                    }}
                  >
                    <td>
                      <strong>{row[0]}</strong>
                      {isCritical && (
                        <span className="pill bad" style={{ marginLeft: 6, fontSize: 10 }}>
                          CRITICAL
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`pill ${isCritical ? 'bad' : 'warn'}`}>
                        {row[1]}
                      </span>
                    </td>
                    <td>{row[2]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Night Before Checklist with LocalStorage */}
      <section className="card section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <h2>Night before departure (Sunday Sep 13)</h2>
          <span className="pill good" style={{ fontSize: 12 }}>
            {nightCompletedCount} of {plane.nightBefore.length} packed
          </span>
        </div>
        <div className="muted" style={{ marginBottom: 12, fontSize: 13 }}>
          Interactive checklist. Check off tasks as you pack and prepare in Fès. State persists automatically on refresh.
        </div>
        <div className="checklist">
          {plane.nightBefore.map((item, i) => (
            <label
              key={i}
              style={{
                cursor: 'pointer',
                background: nightChecked[i] ? 'rgba(117, 211, 155, 0.08)' : undefined,
                borderColor: nightChecked[i] ? 'var(--good)' : undefined,
              }}
            >
              <input
                type="checkbox"
                checked={!!nightChecked[i]}
                onChange={() => toggleNight(i)}
                aria-label={item}
              />
              <span style={{ textDecoration: nightChecked[i] ? 'line-through' : 'none', opacity: nightChecked[i] ? 0.7 : 1 }}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* RBA Execution Order Table */}
      <section className="card section">
        <h2>RBA Airport departure sequence (Mon Sep 14)</h2>
        <div className="muted" style={{ marginBottom: 12, fontSize: 13 }}>
          Step-by-step airport execution from arrival to gate.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Time / Stage</th>
                <th>Action &amp; Rule</th>
              </tr>
            </thead>
            <tbody>
              {plane.rbaSequence.map((seq, i) => (
                <tr key={i}>
                  <td><strong>{seq[0]}</strong></td>
                  <td>
                    {seq[1]}
                    {seq[0].includes('Bag') && (
                      <div className="warn" style={{ marginTop: 4, fontSize: 13 }}>
                        <strong>⚠️ CRITICAL CHECK:</strong> Inspect paper bag tag before it goes onto the belt. Ensure printed destination is <strong>DTW</strong> (Detroit), NOT CDG (Paris).
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AF1258 Return Warning */}
      <div className="warn-box" role="alert" style={{ marginTop: 16 }}>
        <p className="warn" style={{ margin: 0 }}>
          <strong>⚠️ Return flight warning (AF1258 / DL8271):</strong> Air France confirmed that the Sep 25 schedule changed due to legal-time adjustments, but did not supply a confirmed new itinerary in the original email. Do NOT treat the old 11:15 AM CDG departure as authoritative. Re-check <em>My Bookings</em> 24–48 hours before return.
        </p>
      </div>
    </section>
  );
}
