'use client';
import { useState } from 'react';
import { trip } from '../data';
import { usePersistedState } from '../hooks/usePersistedState';

export default function AIConcierge() {
  const [q, setQ] = useState('');
  const [ans, setAns] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Get current edited state to send to the AI
  const [actuals] = usePersistedState('ro-budget-actuals', {});
  const [completed] = usePersistedState('ro-daily-completed', {});

  async function ask() {
    const question = q.trim();
    if (!question) return;

    setBusy(true);
    setAns('');
    setError('');

    try {
      // Build payload with current state, not stale constants
      const currentTrip = {
        ...trip,
        _currentBudgetActuals: actuals,
        _completedDays: completed,
      };

      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, trip: currentTrip }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Server error (${res.status})`);
      } else {
        setAns(data.answer || 'No answer returned.');
      }
    } catch (e) {
      setError('Request failed: ' + e.message);
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      ask();
    }
  }

  return (
    <section className="card section ai" role="region" aria-label="AI Trip Concierge">
      <h2>AI Trip Concierge</h2>
      <p className="muted">
        Server-side OpenAI call. Key comes only from <code>OPENAI_API_KEY</code>.
        Press <kbd>⌘</kbd>+<kbd>Enter</kbd> to send.
      </p>

      <label htmlFor="concierge-input" className="sr-only">
        Ask the concierge a question about your trip
      </label>
      <textarea
        id="concierge-input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Example: What should I do Tuesday if I need cheap clothes, groceries and one good dinner without wasting rides?"
        aria-label="Trip question"
        disabled={busy}
      />

      <div className="toolbar">
        <button onClick={ask} disabled={busy || !q.trim()} aria-busy={busy}>
          {busy ? (
            <span>
              <span className="spinner" aria-hidden="true">⟳</span> Thinking…
            </span>
          ) : (
            'Ask concierge'
          )}
        </button>
        {q.trim() && !busy && (
          <button
            onClick={() => { setQ(''); setAns(''); setError(''); }}
            className="btn-secondary"
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="answer error-box" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {ans && (
        <div className="answer" role="status">
          {ans}
        </div>
      )}
    </section>
  );
}
