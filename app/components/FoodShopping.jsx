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
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    let list = trip.local;
    if (filter !== 'All') {
      list = list.filter((row) => categorize(row[0]) === filter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((row) =>
        row.some((field) => typeof field === 'string' && field.toLowerCase().includes(q))
      );
    }
    return list;
  }, [filter, searchTerm]);

  return (
    <section className="card section" role="region" aria-label="Food and shopping">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Local operating shortlist &amp; Detroit cultural stops</h2>
        <span className="pill" style={{ fontSize: 12 }}>
          Showing {filtered.length} of {trip.local.length} spots
        </span>
      </div>

      <div className="search-bar no-print">
        <span aria-hidden="true" style={{ opacity: 0.6 }}>🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search places, addresses, highlights, food, coffee, art, transit..."
          aria-label="Search spots and places"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: 14,
              padding: '0 4px',
            }}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

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
