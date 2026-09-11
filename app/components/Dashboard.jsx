'use client';
import { trip } from "../data";
import CopyButton from "./CopyButton";

export default function Dashboard({ onSelectTab }) {
  const total = trip.budget.reduce((a, b) => a + b[1], 0);

  return (
    <>
      {/* Top Executive KPI Row */}
      <section className="grid section" role="region" aria-label="Trip overview">
        <div className="card">
          <div className="label">TRIP WINDOW</div>
          <div className="kpi">Sep 14–25</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            Rabat (RBA) ⇄ Paris (CDG) ⇄ Detroit (DTW)
          </div>
        </div>

        <div className="card">
          <div className="label">DELTA BOOKING</div>
          <div className="kpi" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>{trip.confirmation}</span>
            <CopyButton text={trip.confirmation} label="confirmation code" />
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            Ticket: <span className="mono-code" style={{ fontSize: 12 }}>{trip.ticket}</span>
            <CopyButton text={trip.ticket} label="ticket number" />
          </div>
        </div>

        <div className="card">
          <div className="label">CONFIRMED AIRFARE</div>
          <div className="kpi">13,231 MAD</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            ≈ $${trip.ticketUSD.toLocaleString()} (Paid &amp; Ticketed)
          </div>
        </div>

        <div className="card">
          <div className="label">PLANNED BUDGET TOTAL</div>
          <div className="kpi">$${total.toFixed(0)}</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            Airfare + local operating envelope
          </div>
        </div>

        <div className="card">
          <div className="label">RETURN LEG VERIFIED</div>
          <div className="kpi good">AF1258 • 1:10 PM</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            CDG 11:15 AM → RBA 1:10 PM (Morocco GMT+1)
          </div>
        </div>
      </section>

      {/* Detroit Fall Weather & Packing Advisory */}
      <section
        className="card section"
        role="region"
        aria-label="Detroit Fall Weather & Walking Advisory"
        style={{
          borderLeft: "4px solid var(--accent)",
          background: "linear-gradient(135deg, rgba(88, 166, 255, 0.08) 0%, rgba(16, 24, 46, 0.85) 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 26 }} aria-hidden="true">🌤️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, color: "var(--ink-bright)" }}>
              Detroit Fall Weather &amp; Walking Advisory
            </h3>
            <span className="muted" style={{ fontSize: 13 }}>Mid-September transition climate</span>
          </div>
        </div>
        <div className="grid" style={{ marginTop: 12 }}>
          <div>
            <strong>Temperatures: 55°F – 72°F (13°C – 22°C)</strong>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
              Warm, pleasant sunny afternoons with crisp mornings and rapid evening temperature drops once sun sets.
            </div>
          </div>
          <div>
            <strong>Outerwear: Layers &amp; Windbreaker</strong>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
              Detroit Riverwalk has active river breezes. Carry a light jacket or packable layer for evening Woodward/downtown walks.
            </div>
          </div>
          <div>
            <strong>Footwear: Comfortable Walking Shoes</strong>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
              Riverwalk loop, DIA Rivera Court, and Campus Martius explore require durable walking shoes.
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Execution Rules */}
      <section className="card section" role="region" aria-label="Detroit strategy & transit rules">
        <h2 style={{ margin: "0 0 14px", fontSize: 18 }}>Strategic Execution Rules</h2>
        <div className="grid">
          <div style={{ background: "rgba(14, 21, 38, 0.6)", padding: 14, borderRadius: 12, border: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>
              🚆 Woodward Transit Spine
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              Default to FAST Woodward bus + free QLINE. Susu rides free with student ID. Uber is emergency backup only.
            </div>
          </div>

          <div style={{ background: "rgba(14, 21, 38, 0.6)", padding: 14, borderRadius: 12, border: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>
              🎭 Fri Sep 18: DIA + Dance City
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              DIA open till 9 PM Fri. 5 PM Rivera Court performance. Free general admission with Tri-County / student ID.
            </div>
          </div>

          <div style={{ background: "rgba(14, 21, 38, 0.6)", padding: 14, borderRadius: 12, border: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>
              🌟 Sat Sep 19: Full Detroit Loop
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              FAST Woodward → Guardian Bldg → Campus Martius → Riverwalk → Free QLINE → opt. Eastern Market. Zero Uber waste.
            </div>
          </div>

          <div style={{ background: "rgba(14, 21, 38, 0.6)", padding: 14, borderRadius: 12, border: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>
              ℹ️ Tue Sep 22: Detroit Evening (No DIA)
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              DIA closes 4 PM Tue. Evening is reserved for casual Midtown/downtown/Riverwalk via SMART + QLINE.
            </div>
          </div>

          <div style={{ background: "rgba(14, 21, 38, 0.6)", padding: 14, borderRadius: 12, border: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>
              🛒 Groceries &amp; Meals
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              2 grocery runs (main Meijer stock-up + top-up). Max 4 takeout orders. Reserve cash for Detroit dining.
            </div>
          </div>

          <div style={{ background: "rgba(14, 21, 38, 0.6)", padding: 14, borderRadius: 12, border: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>
              👕 Clothes &amp; Essentials
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              Target + Meijer on Tue Sep 15. Salvation Army / Citi Trends fallback.
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cockpit Launchers */}
      {onSelectTab && (
        <section className="section no-print" role="region" aria-label="Quick launch section">
          <h3 style={{ margin: "0 0 10px", fontSize: 15, color: "var(--muted)" }}>QUICK NAVIGATION</h3>
          <div className="grid">
            <button
              type="button"
              className="card"
              onClick={() => onSelectTab("Plane Checklist")}
              style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--card-border)" }}
            >
              <div style={{ fontSize: 20 }}>✈️</div>
              <div style={{ fontWeight: 700, color: "var(--ink-bright)", marginTop: 4 }}>Plane Checklist</div>
              <div className="muted" style={{ fontSize: 12 }}>Check-in status, passport rules, packing list</div>
            </button>

            <button
              type="button"
              className="card"
              onClick={() => onSelectTab("Today")}
              style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--card-border)" }}
            >
              <div style={{ fontSize: 20 }}>📅</div>
              <div style={{ fontWeight: 700, color: "var(--ink-bright)", marginTop: 4 }}>Today's Briefing</div>
              <div className="muted" style={{ fontSize: 12 }}>Active schedule, countdowns &amp; day budget</div>
            </button>

            <button
              type="button"
              className="card"
              onClick={() => onSelectTab("Food & Shopping")}
              style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--card-border)" }}
            >
              <div style={{ fontSize: 20 }}>🛍️</div>
              <div style={{ fontWeight: 700, color: "var(--ink-bright)", marginTop: 4 }}>Detroit &amp; Food Shortlist</div>
              <div className="muted" style={{ fontSize: 12 }}>DIA, Guardian, Riverwalk, groceries &amp; search</div>
            </button>

            <button
              type="button"
              className="card"
              onClick={() => onSelectTab("Transport")}
              style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--card-border)" }}
            >
              <div style={{ fontSize: 20 }}>🚌</div>
              <div style={{ fontWeight: 700, color: "var(--ink-bright)", marginTop: 4 }}>Woodward Transit Cheat Sheet</div>
              <div className="muted" style={{ fontSize: 12 }}>FAST bus routes, QLINE, SMART student free fare</div>
            </button>
          </div>
        </section>
      )}
    </>
  );
}
