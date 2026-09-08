'use client';
import { useMemo } from 'react';
import { trip } from '../data';
import { usePersistedState } from '../hooks/usePersistedState';
import { buildBudgetSummary } from '../lib/budget';

export default function Budget() {
  const [actuals, setActuals] = usePersistedState('ro-budget-actuals', {});

  const summary = useMemo(
    () => buildBudgetSummary(trip.budget, actuals),
    [actuals]
  );

  function handleActualChange(category, value) {
    const num = parseFloat(value);
    setActuals((prev) => ({
      ...prev,
      [category]: Number.isFinite(num) ? num : 0,
    }));
  }

  return (
    <section className="card section" role="region" aria-label="Budget tracker">
      <h2>Working budget</h2>
      <div className="muted" style={{ marginBottom: 12 }}>
        Enter actual spending per category. Variance updates live. State persists across refreshes.
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget</th>
              <th>Actual</th>
              <th>Remaining</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            {summary.rows.map((row) => (
              <tr key={row.category}>
                <td>{row.category}</td>
                <td>${row.budgeted.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="actual-input"
                    value={actuals[row.category] ?? ''}
                    onChange={(e) => handleActualChange(row.category, e.target.value)}
                    placeholder="0.00"
                    aria-label={`Actual spending for ${row.category}`}
                  />
                </td>
                <td className={row.remaining < 0 ? 'bad' : row.remaining < 20 ? 'warn' : 'good'}>
                  ${row.remaining.toFixed(2)}
                </td>
                <td className={row.cls}>
                  {row.variance > 0 ? '+' : ''}{row.variance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 700 }}>
              <td>Total</td>
              <td>${summary.totalBudget.toFixed(2)}</td>
              <td>${summary.totalActual.toFixed(2)}</td>
              <td className={summary.totalRemaining < 0 ? 'bad' : 'good'}>
                ${summary.totalRemaining.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="muted" style={{ marginTop: 12, fontSize: 13 }}>
        <strong>Note:</strong> Budget amounts are from <code>app/data.js</code>.
        The reference XLSX workbook uses slightly different category totals
        (e.g. Dining $390 vs $450, Shopping $170 vs $220).
        See <code>ANTIGRAVITY_COMPLETION.md</code> for the full reconciliation.
      </div>
    </section>
  );
}
