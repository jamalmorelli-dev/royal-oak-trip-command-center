'use client';
import { useState } from 'react';
import { trip } from '../data';
import CopyButton from './CopyButton';

export default function Flights() {
  const [showArchived, setShowArchived] = useState(false);
  const headers = ['Date', 'Flight', 'Operator', 'From', 'Depart', 'To', 'Arrive', 'Notes'];

  const returnFlights = trip.flights.filter(f => f[0].includes('Sep 24') || f[0].includes('Sep 25'));
  const outboundFlights = trip.flights.filter(f => f[0].includes('Sep 14'));

  return (
    <section className="card section" role="region" aria-label="Flights">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        <div>
          <div className="label">ACTIVE RETURN ITINERARY</div>
          <h2 style={{ margin: '2px 0 0', fontSize: 22 }}>Return Flights: DTW ➔ CDG ➔ RBA</h2>
        </div>
        <span className="pill good" style={{ fontSize: 11, fontWeight: 700 }}>
          ● Departs Thu Sep 24 @ 6:40 PM EDT
        </span>
      </div>

      <div className="flight-refs" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span className="label">Confirmation: </span>
            <strong>{trip.confirmation}</strong>
            <CopyButton text={trip.confirmation} label="confirmation number" />
          </div>
          <div>
            <span className="label">Passenger: </span>
            <strong>Benjamin Prentiss</strong>
          </div>
          <div>
            <span className="label">Ticket: </span>
            <strong>{trip.ticket}</strong>
            <CopyButton text={trip.ticket} label="ticket number" />
          </div>
        </div>
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
            padding: '7px 12px',
            borderRadius: 10,
            background: 'var(--accent)',
            color: '#071225',
            fontWeight: 700,
            fontSize: 13,
          }}
          title="Open Delta Find Your Trip search form in new tab"
        >
          Delta Trip Lookup ↗
        </a>
      </div>

      {/* Active Return Flights Table */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {returnFlights.map((row, i) => {
              const isWarning = row[7]?.includes('verify') || row[7]?.includes('CHANGED');
              return (
                <tr key={i} className={isWarning ? 'row-warn' : ''} style={{ fontWeight: 600 }}>
                  <td><strong style={{ color: 'var(--accent)' }}>{row[0]}</strong></td>
                  <td><strong>{row[1]}</strong></td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                  <td>{row[5]}</td>
                  <td>{row[6]}</td>
                  <td className={isWarning ? 'warn' : 'muted'} style={{ fontSize: 13 }}>
                    {row[7]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="warn-box" role="alert" style={{ marginTop: 16 }}>
        <p className="warn" style={{ margin: 0 }}>
          <strong>⚠ Connection Notice:</strong> AF1258 (CDG → RBA) arrival is confirmed at{' '}
          <strong>1:10 PM GMT+1</strong> on Friday Sep 25 (Morocco UTC+1 legal-time schedule).
          Re-check booking on Delta / Air France app when check-in opens on Wednesday Sep 23 @ 6:40 PM EDT.
        </p>
      </div>

      <p style={{ marginTop: 12 }}>{trip.baggage}</p>

      {/* Collapsible Archived Outbound Flights */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
        <button
          type="button"
          onClick={() => setShowArchived(!showArchived)}
          className="hud-btn"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'var(--line)',
            color: 'var(--muted)',
            fontSize: 13,
            padding: '8px 14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>📁</span>
          <span>{showArchived ? 'Hide Archived Outbound Flight (Sep 14)' : 'View Archived Outbound Flight (Sep 14 • Completed)'}</span>
          <span style={{ fontSize: 10 }}>{showArchived ? '▲' : '▼'}</span>
        </button>

        {showArchived && (
          <div style={{ marginTop: 14, overflowX: 'auto' }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
              Archived outbound flights from Rabat to Detroit completed on Monday, Sep 14.
            </div>
            <table>
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {outboundFlights.map((row, i) => (
                  <tr key={i} style={{ opacity: 0.65 }}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>{row[4]}</td>
                    <td>{row[5]}</td>
                    <td>{row[6]}</td>
                    <td><span className="pill good" style={{ fontSize: 10 }}>COMPLETED (SEP 14)</span></td>
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
