'use client';
import { useState, useMemo } from 'react';
import { trip } from '../data';
import CopyButton from './CopyButton';
import MapLink from './MapLink';

const CATEGORIES = ['All', 'Groceries', 'Prepared/specialty', 'Clothes', 'Delivery'];

function categorize(type) {
  const t = type.toLowerCase();
  if (t.includes('grocer')) return 'Groceries';
  if (t.includes('prepared') || t.includes('specialty')) return 'Prepared/specialty';
  if (t.includes('cloth') || t.includes('discount') || t.includes('cheap')) return 'Clothes';
  if (t.includes('delivery') || t.includes('food delivery')) return 'Delivery';
  return 'Other';
}

export default function FoodShopping() {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return trip.local;
    return trip.local.filter((row) => categorize(row[0]) === filter);
  }, [filter]);

  return (
    <section className="card section" role="region" aria-label="Food and shopping">
      <h2>Local operating shortlist</h2>

      <div className="filter-chips" role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
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

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Place</th>
              <th>Area</th>
              <th>Use</th>
              <th>Target</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
                <td>{row[0]}</td>
                <td><strong>{row[1]}</strong></td>
                <td>
                  {row[2]}
                  {row[2] && (
                    <>
                      <CopyButton text={row[2]} label={`${row[1]} address`} />
                      <MapLink address={`${row[1]}, ${row[2]}`} />
                    </>
                  )}
                </td>
                <td>{row[3]}</td>
                <td>
                  <span className="muted">{row[4]}</span>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted" style={{ marginTop: 12 }}>
        Delivery pricing and availability can change. In-store or pickup is usually the cleaner budget move.
        <br />
        <em>Prices shown are estimates, not live quotes.</em>
      </p>
    </section>
  );
}
