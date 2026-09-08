'use client';
import { useState, useMemo } from 'react';
import { trip } from '../data';
import CopyButton from './CopyButton';

const TRANSPORT_CATS = ['All', 'Bus/public', 'Private/contract', 'Rideshare'];

function categorizeTrans(option) {
  const o = option.toLowerCase();
  if (o.includes('smart') || o.includes('bus')) return 'Bus/public';
  if (o.includes('uber') || o.includes('lyft')) return 'Rideshare';
  return 'Private/contract';
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
      <h2>School + local transport</h2>

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
              <th>Monthly / context</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              const phone = extractPhone(row[3]);
              return (
                <tr key={i}>
                  <td><strong>{row[0]}</strong></td>
                  <td>{row[1]}</td>
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
