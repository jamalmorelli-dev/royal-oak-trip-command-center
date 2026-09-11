'use client';
import { useState, useEffect, useMemo } from "react";
import { trip } from "../data";
import CopyButton from "./CopyButton";
import {
  TRIP_TIMEZONES,
  KEY_DATES,
  getTimeRemaining,
  formatTimeInTz,
  formatDateInTz,
  getTripPhase,
} from "../lib/tripTime";

export default function TravelHUD({ onSelectTab, activeTab }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const phase = useMemo(() => getTripPhase(now), [now]);

  // Next milestone countdown
  const checkInTarget = useMemo(() => new Date(KEY_DATES.checkInOpen), []);
  const departureTarget = useMemo(() => new Date(KEY_DATES.departure), []);

  const timeToCheckIn = useMemo(() => getTimeRemaining(checkInTarget, now), [checkInTarget, now]);
  const timeToDeparture = useMemo(() => getTimeRemaining(departureTarget, now), [departureTarget, now]);

  const phasesList = [
    { num: 1, label: "Packing & Prep", dates: "Sep 11–12", id: "PRE_CHECKIN" },
    { num: 2, label: "Check-In Window", dates: "Sun Sep 13", id: "CHECKIN_WINDOW" },
    { num: 3, label: "Travel RBA→DTW", dates: "Mon Sep 14", id: "OUTBOUND_TRAVEL" },
    { num: 4, label: "Royal Oak & Detroit", dates: "Sep 14–24", id: "RESIDENCY" },
    { num: 5, label: "Return to Rabat", dates: "Sep 24–25", id: "RETURN_TRAVEL" },
  ];

  return (
    <header className="hud-container" role="banner" aria-label="Live Travel Heads-Up Display">
      {/* Top Credentials & Quick Action HUD */}
      <div className="hud-credentials-bar">
        <div className="hud-identity">
          <span className="hud-label">TRAVELER</span>
          <div className="hud-name">
            <strong>{trip.traveler.toUpperCase()}</strong>
            <span className="hud-verified-tag" title="Delta booking audited and active">✔ VERIFIED</span>
          </div>
        </div>

        <div className="hud-codes">
          <div className="hud-code-item">
            <span className="hud-label">DELTA CONFIRMATION</span>
            <div className="hud-code-val">
              <span className="mono-code">{trip.confirmation}</span>
              <CopyButton text={trip.confirmation} label="confirmation code" />
            </div>
          </div>
          <div className="hud-code-item">
            <span className="hud-label">TICKET NUMBER</span>
            <div className="hud-code-val">
              <span className="mono-code">{trip.ticket}</span>
              <CopyButton text={trip.ticket} label="ticket number" />
            </div>
          </div>
          <div className="hud-code-item">
            <span className="hud-label">OUTBOUND</span>
            <div className="hud-code-val">
              <span className="mono-code">DL 8491 • RBA→CDG→DTW</span>
            </div>
          </div>
        </div>

        <div className="hud-actions no-print">
          <a
            href="https://www.delta.com/my-trips/search?staticurl=t"
            target="_blank"
            rel="noopener noreferrer"
            className="hud-btn hud-btn-primary"
            title="Open Delta Find Your Trip search form in a new tab"
          >
            Delta Trip Lookup ↗
          </a>
          <a
            href="https://wwws.airfrance.com/check-in"
            target="_blank"
            rel="noopener noreferrer"
            className="hud-btn hud-btn-secondary"
            title="Open Air France Check-in in a new tab"
          >
            Air France Check-in ↗
          </a>
          <button
            type="button"
            onClick={() => typeof window !== "undefined" && window.print()}
            className="hud-btn hud-btn-outline"
            title="Print emergency travel one-pager"
          >
            🖨 Print One-Pager
          </button>
        </div>
      </div>

      {/* Real-time World Clock Bar */}
      <div className="hud-clocks-bar" aria-label="Trip Timezones">
        <div className="hud-clock-title">
          <span className="hud-live-dot" aria-hidden="true" />
          <span className="hud-clock-heading">LIVE TRIP CLOCKS</span>
        </div>
        <div className="hud-clocks-grid">
          {TRIP_TIMEZONES.map((item) => {
            const timeStr = formatTimeInTz(now, item.tz);
            const dateStr = formatDateInTz(now, item.tz);
            const isCurrentLocation = item.tz === phase.activeLocationTz;
            return (
              <div
                key={item.id}
                className={"hud-clock-card" + (isCurrentLocation ? " active-zone" : "")}
              >
                <div className="hud-clock-header">
                  <span className="hud-flag">{item.flag}</span>
                  <span className="hud-city">{item.city}</span>
                  {isCurrentLocation && <span className="hud-zone-pill">ACTIVE</span>}
                </div>
                <div className="hud-time">{timeStr}</div>
                <div className="hud-date">
                  {dateStr} • <span className="hud-code">{item.code}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Trip Status & Progress Hero */}
      <div className={"hud-phase-banner " + phase.statusClass}>
        <div className="hud-phase-main">
          <div className="hud-phase-header">
            <span className="hud-step-tag">STEP {phase.step} OF 5</span>
            <span className="hud-phase-badge">{phase.shortLabel}</span>
          </div>
          <h2 className="hud-phase-title">{phase.headline}</h2>
          <p className="hud-phase-desc">{phase.description}</p>
        </div>

        <div className="hud-phase-timing">
          {phase.id === "PRE_CHECKIN" && (
            <div className="hud-timer-block">
              <span className="hud-timer-label">DELTA CHECK-IN COUNTDOWN</span>
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
              <div className="hud-subcountdown">
                Wheels up in: <strong>{timeToDeparture.days}d {timeToDeparture.hours}h {timeToDeparture.minutes}m</strong>
              </div>
            </div>
          )}

          {phase.id === "CHECKIN_WINDOW" && (
            <div className="hud-timer-block">
              <span className="hud-timer-label pulse-badge" style={{ color: "var(--warn)", fontWeight: 800 }}>
                ⚠️ FLIGHT DEPARTURE COUNTDOWN
              </span>
              <div className="timer-grid">
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
              <div className="hud-subcountdown">
                Leave Fès by <strong>4:45 AM</strong>; arrive RBA desk by <strong>7:30 AM</strong>
              </div>
            </div>
          )}

          {onSelectTab && (
            <button
              type="button"
              className="hud-quick-btn no-print"
              onClick={() => onSelectTab(phase.targetTab)}
            >
              {phase.primaryActionText} →
            </button>
          )}
        </div>
      </div>

      {/* Visual Trip Progress Stepper */}
      <nav className="hud-stepper no-print" aria-label="Trip progress milestones">
        {phasesList.map((st) => {
          const isDone = phase.step > st.num;
          const isCurrent = phase.step === st.num;
          return (
            <div
              key={st.num}
              className={
                "hud-step" +
                (isDone ? " step-done" : "") +
                (isCurrent ? " step-current" : "")
              }
            >
              <div className="hud-step-num">
                {isDone ? "✓" : st.num}
              </div>
              <div className="hud-step-info">
                <span className="hud-step-title">{st.label}</span>
                <span className="hud-step-date">{st.dates}</span>
              </div>
            </div>
          );
        })}
      </nav>
    </header>
  );
}
