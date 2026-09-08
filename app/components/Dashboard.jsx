'use client';
import { trip } from '../data';
import CopyButton from './CopyButton';

export default function Dashboard() {
  const total = trip.budget.reduce((a, b) => a + b[1], 0);

  return (
    <>
      <section className="grid section" role="region" aria-label="Trip overview">
        <div className="card">
          <div className="label">Trip</div>
          <div className="kpi">Sep 14–25</div>
          <div className="muted">Rabat → Paris → Detroit → Paris → Rabat</div>
        </div>
        <div className="card">
          <div className="label">Confirmation</div>
          <div className="kpi">
            {trip.confirmation}
            <CopyButton text={trip.confirmation} label="confirmation number" />
          </div>
          <div className="muted">
            Ticket: {trip.ticket}
            <CopyButton text={trip.ticket} label="ticket number" />
          </div>
        </div>
        <div className="card">
          <div className="label">Flight cost</div>
          <div className="kpi">13,231 MAD</div>
          <div className="muted">≈ ${trip.ticketUSD.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="label">Working total</div>
          <div className="kpi">${total.toFixed(0)}</div>
          <div className="muted">Includes airfare + current local assumptions</div>
        </div>
        <div className="card">
          <div className="label">Flight warning</div>
          <div className="kpi warn">⚠ AF1258</div>
          <div className="muted">Return CDG → RBA schedule changed. Verify exact time before departure.</div>
        </div>
      </section>

      <section className="card section" role="region" aria-label="Execution rules">
        <h2>Execution rules</h2>
        <div className="grid">
          <div><b>Groceries</b><div className="muted">2 runs: main stock-up + top-up.</div></div>
          <div><b>Uber Eats</b><div className="muted">Max 4 orders. Prefer pickup if already out.</div></div>
          <div><b>Paid outings</b><div className="muted">Max 2 major paid days.</div></div>
          <div><b>Clothes</b><div className="muted">One primary run; one fallback only.</div></div>
        </div>
      </section>
    </>
  );
}
