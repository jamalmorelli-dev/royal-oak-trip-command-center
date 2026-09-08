'use client';
import { useState, useMemo } from 'react';
import { trip } from '../data';
import CopyButton from './CopyButton';

const TRANSPORT_CATS = ['All', 'Bus / Transit Spine', 'School Contract / Private', 'Rideshare Fallback'];

function categorizeTrans(option) {
  const o = option.toLowerCase();
  if (o.includes('smart') || o.includes('bus') || o.includes('woodward') || o.includes('qline') || o.includes('fast')) return 'Bus / Transit Spine';
  if (o.includes('uber') || o.includes('lyft')) return 'Rideshare Fallback';
  return 'School Contract / Private';
}

/**
 * Extract phone numbers from notes text.
 */
function extractPhone(text) {
  if (!text) return null;
  const match = text.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/);
  return match ? match[0] : null;
}

export default function Transport() {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return trip.transport;
    return trip.transport.filter((row) => categorizeTrans(row[0]) === filter);
  }, [filter]);

  return (
    <section className="card section" role="region" aria-label="Transport options">
      <h2>School &amp; Woodward corridor transit</h2>

      <div className="card" style={{ marginBottom: 16, borderColor: 'var(--accent)', background: 'rgba(120, 166, 255, 0.08)' }}>
        <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>🚆 Woodward Transit Spine Strategy</div>
        <div style={{ fontSize: 14 }}>
          Detroit is <strong>not</strong> an expensive $40–80 Uber trip. FAST Woodward (Route 461/462) runs straight down Woodward from Royal Oak to Downtown Detroit for $2.00 (Susu rides free with Royal Oak High School ID). In Detroit, the QLINE streetcar connects Downtown, Campus Martius, Midtown, and the DIA for <strong>$0 (100% free)</strong>. Uber/Lyft is strictly an emergency/late-night fallback.
        </div>
      </div>

      <div className="filter-chips" role="group" aria-label="Filter transport type">
        {TRANSPORT_CATS.map((cat) => (
          <button
            key={cat}
            className={filter === cat ? 'chip active' : 'chip'}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="muted" style={{ marginBottom: 8 }}>
        School: <strong>{trip.school}</strong>
        <CopyButton text={trip.school} label="school address" />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Price</th>
              <th>Route / Scope</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              const phone = extractPhone(row[3]);
              const isSpine = row[0].includes('FAST') || row[0].includes('QLINE') || row[0].includes('Student');
              return (
                <tr key={i} className={isSpine ? 'row-spine' : ''}>
                  <td>
                    <strong>{row[0]}</strong>
                    {isSpine && <span className="pill good" style={{ marginLeft: 6, fontSize: 11 }}>Recommended Spine</span>}
                  </td>
                  <td className={row[1]?.includes('FREE') ? 'good' : ''}>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>
                    {row[3]}
                    {phone && (
                      <>
                        {' '}
                        <CopyButton text={phone} label={`${row[0]} phone`} />
                        <a href={`tel:${phone}`} className="map-link" aria-label={`Call ${row[0]}`}>📞</a>
                      </>
                    )}
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
