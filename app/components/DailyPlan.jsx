'use client';
import { trip } from '../data';
import { usePersistedState } from '../hooks/usePersistedState';

export default function DailyPlan() {
  const [completed, setCompleted] = usePersistedState('ro-daily-completed', {});

  function toggle(dayIdx) {
    setCompleted((prev) => ({
      ...prev,
      [dayIdx]: !prev[dayIdx],
    }));
  }

  return (
    <section className="card section" role="region" aria-label="Daily plan">
      <h2>Every day mapped</h2>
      <div className="muted" style={{ marginBottom: 12 }}>
        Check off days as you complete them. State persists across refreshes.
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>✓</th>
              <th>Day</th>
              <th>Base plan</th>
              <th>Food</th>
              <th>Shopping</th>
              <th>Activity</th>
              <th>Transport</th>
              <th>Budget</th>
            </tr>
          </thead>
          <tbody>
            {trip.days.map((row, i) => (
              <tr key={i} className={completed[i] ? 'row-done' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={!!completed[i]}
                    onChange={() => toggle(i)}
                    aria-label={`Mark ${row[0]} as completed`}
                  />
                </td>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
