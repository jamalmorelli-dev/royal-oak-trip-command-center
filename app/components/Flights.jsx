'use client';
import { trip } from '../data';
import CopyButton from './CopyButton';

export default function Flights() {
  const headers = ['Date', 'Flight', 'Operator', 'From', 'Depart', 'To', 'Arrive', 'Notes'];

  return (
    <section className="card section" role="region" aria-label="Flights">
      <h2>Confirmed itinerary</h2>

      <div className="flight-refs" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span className="label">Confirmation: </span>
            <strong>{trip.confirmation}</strong>
            <CopyButton text={trip.confirmation} label="confirmation number" />
          </div>
          <div>
            <span className="label">First: </span>
            <strong>Benjamin</strong>
            <CopyButton text="Benjamin" label="first name" />
          </div>
          <div>
            <span className="label">Last: </span>
            <strong>Prentiss</strong>
            <CopyButton text="Prentiss" label="last name" />
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
          Delta Find Your Trip ↗
        </a>
      </div>

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
            {trip.flights.map((row, i) => {
              const isWarning = row[7]?.includes('verify') || row[7]?.includes('CHANGED');
              return (
                <tr key={i} className={isWarning ? 'row-warn' : ''}>
                  {row.map((cell, j) => (
                    <td key={j} className={j === 7 && isWarning ? 'warn' : ''}>
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="warn-box" role="alert" style={{ marginTop: 16 }}>
        <p className="warn">
          <strong>⚠ Return warning:</strong> AF1258 (CDG → RBA) arrival time updated to{' '}
          <strong>1:10 PM</strong> (was 12:10 PM). Departure remains 11:15 AM.
          Change due to Morocco UTC+1 legal-time adjustment.
          <br />
          <em>Source: FlightAware AFR1258 schedule, verified 2026-09-08.</em>
          <br />
          Still recommended to re-verify in My Bookings 24–48 hours before return.
        </p>
      </div>

      <p style={{ marginTop: 12 }}>{trip.baggage}</p>
    </section>
  );
}
