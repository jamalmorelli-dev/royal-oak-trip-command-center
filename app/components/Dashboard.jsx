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
          <div className="label">Return flight</div>
          <div className="kpi good">AF1258: 1:10 PM</div>
          <div className="muted">Verified: CDG 11:15 AM → RBA 1:10 PM (Morocco UTC+1).</div>
        </div>
      </section>

      <section className="card section" role="region" aria-label="Detroit strategy & transit rules">
        <h2>Strategic Execution Rules</h2>
        <div className="grid">
          <div>
            <b>Woodward Transit Spine</b>
            <div className="muted">Default to FAST Woodward bus + free QLINE. Susu rides free with student ID. Uber is emergency backup only.</div>
          </div>
          <div>
            <b>Fri Sep 18: DIA + Dance City</b>
            <div className="muted">DIA open till 9 PM Fri. 5 PM Rivera Court performance. Free general admission with Tri-County / student ID.</div>
          </div>
          <div>
            <b>Sat Sep 19: Full Detroit Loop</b>
            <div className="muted">FAST Woodward → Guardian Bldg → Campus Martius → Riverwalk → Free QLINE → opt. Eastern Market. Zero Uber waste.</div>
          </div>
          <div>
            <b>Tue Sep 22: Detroit Evening (No DIA)</b>
            <div className="muted">DIA closes 4 PM Tue. Evening is reserved for casual Midtown/downtown/Riverwalk via SMART + QLINE.</div>
          </div>
          <div>
            <b>Groceries & Meals</b>
            <div className="muted">2 grocery runs (main stock-up + top-up). Max 4 takeout orders. Reserve cash for Detroit dining.</div>
          </div>
          <div>
            <b>Clothes & Essentials</b>
            <div className="muted">Target + Meijer on Tue Sep 15. Salvation Army / Citi Trends fallback.</div>
          </div>
        </div>
      </section>
    </>
  );
}
