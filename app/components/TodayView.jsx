'use client';
import { useMemo } from 'react';
import { trip } from '../data';

/**
 * Determine which timezone applies for a given date during the trip.
 * Sep 14 morning: Africa/Casablanca (departure from Rabat)
 * Sep 14 afternoon–evening: Europe/Paris then America/Detroit
 * Sep 15–24: America/Detroit
 * Sep 25: Europe/Paris then Africa/Casablanca
 */
function getTripTimezone(dateStr) {
  const d = new Date(dateStr);
  const month = d.getMonth(); // 0-indexed, Sep = 8
  const day = d.getDate();
  if (month === 8 && day === 14) return 'Africa/Casablanca';
  if (month === 8 && day === 25) return 'Europe/Paris';
  if (month === 8 && day >= 15 && day <= 24) return 'America/Detroit';
  return 'America/Detroit';
}

/**
 * Get today's date string in the primary trip timezone.
 */
function getTodayInTrip() {
  // During Sep 15–24, primary zone is Detroit
  const now = new Date();
  const month = now.getMonth();
  const approxDay = now.getDate();

  // Determine which timezone to use for "today"
  let tz = 'America/Detroit';
  if (month === 8 && approxDay === 14) tz = 'Africa/Casablanca';
  if (month === 8 && approxDay === 25) tz = 'Europe/Paris';
  if (month === 8 && approxDay < 14) tz = 'Africa/Casablanca';
  if (month === 8 && approxDay > 25) tz = 'Africa/Casablanca';
  if (month !== 8) tz = 'Africa/Casablanca'; // Outside September

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return { dateStr: formatter.format(now), tz };
}

/**
 * Parse "Sep 14" or "Sep 14 Mon" to a day number.
 */
function parseDayNum(label) {
  const m = label.match(/Sep\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
}

export default function TodayView() {
  const { dateStr, tz } = useMemo(() => getTodayInTrip(), []);

  const todayMatch = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      month: 'short',
      day: 'numeric',
    });
    const todayShort = formatter.format(now); // e.g. "Sep 15"

    // Find matching day in plan
    const dayIndex = trip.days.findIndex((d) => {
      const dayLabel = d[0]; // "Sep 15 Tue"
      return dayLabel.startsWith(todayShort);
    });

    return dayIndex;
  }, [tz]);

  // Find matching flights
  const todayFlights = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      month: 'short',
      day: 'numeric',
    });
    const todayShort = formatter.format(now);
    return trip.flights.filter((f) => f[0].startsWith(todayShort));
  }, [tz]);

  const dayData = todayMatch >= 0 ? trip.days[todayMatch] : null;
  const isPreTrip = !dayData && new Date() < new Date('2026-09-14');
  const isPostTrip = !dayData && new Date() > new Date('2026-09-25T23:59:59');

  return (
    <section className="card section" role="region" aria-label="Today's plan">
      <h2>📅 Today — {dateStr}</h2>
      <div className="muted" style={{ marginBottom: 12 }}>
        Timezone: {tz}
      </div>

      {isPreTrip && (
        <div className="card" style={{ borderColor: 'var(--accent)' }}>
          <div className="kpi" style={{ fontSize: 22 }}>Trip hasn&apos;t started yet</div>
          <div className="muted">
            Departure: Sep 14, 2026 — DL8491 RBA 10:35 AM → CDG
          </div>
        </div>
      )}

      {isPostTrip && (
        <div className="card" style={{ borderColor: 'var(--good)' }}>
          <div className="kpi good" style={{ fontSize: 22 }}>Trip complete ✓</div>
          <div className="muted">Sep 14–25, 2026</div>
        </div>
      )}

      {dayData && (
        <>
          <div className="grid" style={{ marginBottom: 16 }}>
            <div className="card" style={{ borderColor: 'var(--accent)' }}>
              <div className="label">Base Plan</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{dayData[1]}</div>
            </div>
            <div className="card">
              <div className="label">Day Budget</div>
              <div className="kpi" style={{ fontSize: 24 }}>{dayData[6]}</div>
            </div>
          </div>

          <div className="grid">
            <div>
              <div className="label">🍽 Food</div>
              <div>{dayData[2]}</div>
            </div>
            <div>
              <div className="label">🛍 Shopping</div>
              <div>{dayData[3] || 'None'}</div>
            </div>
            <div>
              <div className="label">🎯 Activity</div>
              <div>{dayData[4]}</div>
            </div>
            <div>
              <div className="label">🚗 Transport</div>
              <div>{dayData[5]}</div>
            </div>
          </div>
        </>
      )}

      {todayFlights.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>✈ Today&apos;s Flights</h3>
          {todayFlights.map((f, i) => (
            <div key={i} className="card" style={{ marginBottom: 8, borderColor: f[7]?.includes('verify') ? 'var(--warn)' : 'var(--line)' }}>
              <div style={{ fontWeight: 700 }}>{f[1]} — {f[2]}</div>
              <div>{f[3]} {f[4]} → {f[5]} {f[6]}</div>
              {f[7] && <div className={f[7].includes('verify') || f[7].includes('CHANGED') ? 'warn' : 'muted'}>{f[7]}</div>}
            </div>
          ))}
        </div>
      )}

      {!dayData && !isPreTrip && !isPostTrip && (
        <div className="card">
          <div className="muted">No matching day found in the plan for today.</div>
        </div>
      )}
    </section>
  );
}
