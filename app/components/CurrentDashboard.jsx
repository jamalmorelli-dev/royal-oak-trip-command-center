'use client';
import { trip } from '../data';
import CopyButton from './CopyButton';

export default function CurrentDashboard({onSelectTab}){
  const total=trip.budget.reduce((a,b)=>a+b[1],0);
  return <>
    <section className="grid section" role="region" aria-label="Current trip status">
      <div className="card"><div className="label">AIR FRANCE CHECK-IN</div><div className="kpi good">COMPLETE</div><div className="muted">Seats 22D + 38H</div></div>
      <div className="card"><div className="label">BOARDING PASS</div><div className="kpi warn">RBA DESK</div><div className="muted">Must be issued by Air France at the airport.</div></div>
      <div className="card"><div className="label">LEAVE HOTEL</div><div className="kpi">06:30–06:45</div><div className="muted">Target RBA 07:00–07:15.</div></div>
      <div className="card"><div className="label">OUTBOUND</div><div className="kpi">10:35</div><div className="muted">RBA → CDG → DTW</div></div>
      <div className="card"><div className="label">DELTA CONFIRMATION</div><div className="kpi" style={{display:'flex',alignItems:'center',gap:6}}><span>{trip.confirmation}</span><CopyButton text={trip.confirmation} label="confirmation code"/></div></div>
      <div className="card"><div className="label">WORKING BUDGET</div><div className="kpi">${total.toFixed(0)}</div><div className="muted">Airfare + current local envelope</div></div>
    </section>
    <section className="card section" style={{border:'2px solid var(--warn)'}}><h2 style={{marginTop:0}}>Tomorrow morning — zero ambiguity</h2><p><strong>Original U.S. passport in hand.</strong> Go directly to the Air France counter. Online check-in is complete, but the boarding pass was not issued online. Collect the airport-issued boarding pass(es) and verify all checked bags are tagged through to <strong>DTW</strong>.</p><div className="toolbar no-print"><button onClick={()=>onSelectTab?.('Airport Docs')}>Open Airport Docs</button><button className="btn-secondary" onClick={()=>onSelectTab?.('Plane Checklist')}>Plane Checklist</button></div></section>
    <section className="grid section">
      <div className="card"><div className="label">PHYSICAL MUST-HAVE</div><div className="kpi warn">PASSPORT</div><div className="muted">Original U.S. passport; phone copy is backup only.</div></div>
      <div className="card"><div className="label">BAGGAGE</div><div className="kpi">2 × 23 kg</div><div className="muted">First + second checked bags free on original Delta receipt.</div></div>
      <div className="card"><div className="label">RETURN WARNING</div><div className="kpi warn">AF1258</div><div className="muted">Schedule changed. Old return time is stale until reverified in My Bookings.</div></div>
    </section>
  </>;
}
