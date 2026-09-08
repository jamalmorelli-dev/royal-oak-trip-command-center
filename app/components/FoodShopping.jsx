'use client';
import { useState, useMemo } from 'react';
import { trip } from '../data';
import CopyButton from './CopyButton';
import MapLink from './MapLink';

const CATEGORIES = ['All', 'Detroit & Culture', 'Groceries', 'Prepared/specialty', 'Clothes', 'Delivery'];

function categorize(type) {
  const t = type.toLowerCase();
  if (t.includes('culture') || t.includes('art') || t.includes('waterfront') || t.includes('architecture') || t.includes('event')) return 'Detroit & Culture';
  if (t.includes('grocer')) return 'Groceries';
  if (t.includes('prepared') || t.includes('specialty') || t.includes('market')) return 'Prepared/specialty';
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
      <h2>Local operating shortlist &amp; Detroit cultural stops</h2>

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
              <th>Area / Address</th>
              <th>Highlights &amp; Operating Use</th>
              <th>Target / Economics</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
                <td><span className="pill">{row[0]}</span></td>
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
                  <span className={row[4]?.includes('FREE') ? 'good' : 'muted'}>{row[4]}</span>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted" style={{ marginTop: 12 }}>
        <strong>Note on DIA admission:</strong> Residents of Oakland, Wayne, and Macomb counties receive FREE general admission with qualifying ID. Susu attends Royal Oak High School (Oakland County), so show student documentation or Oakland County proof at the front desk.
        <br />
        <em>Delivery and shopping prices shown are estimates, not live quotes.</em>
      </p>
    </section>
  );
}
