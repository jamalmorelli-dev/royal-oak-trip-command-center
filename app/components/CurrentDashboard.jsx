'use client';
import { trip } from '../data';
import CopyButton from './CopyButton';

export default function CurrentDashboard({onSelectTab}){
  const total=trip.budget.reduce((a,b)=>a+b[1],0);
  const phase=trip.currentPhase||{};
  return <>
    <section className="grid section" role="region" aria-label="Current trip status">
      <div className="card"><div className="label">CURRENT PHASE</div><div className="kpi good">ROYAL OAK</div><div className="muted">Sunday Sep 20 • in-town day</div></div>
      <div className="card"><div className="label">TODAY'S WINDOW</div><div className="kpi">8–3</div><div className="muted">Antiques & Collectibles Market</div></div>
      <div className="card"><div className="label">SUSU LATER</div><div className="kpi">6–7 PM</div><div className="muted">Flag-football film study</div></div>
      <div className="card"><div className="label">RETURN FLIGHT</div><div className="kpi">SEP 24</div><div className="muted">DL228 • DTW 6:40 PM</div></div>
      <div className="card"><div className="label">DELTA CONFIRMATION</div><div className="kpi" style={{display:'flex',alignItems:'center',gap:6}}><span>{trip.confirmation}</span><CopyButton text={trip.confirmation} label="confirmation code"/></div></div>
      <div className="card"><div className="label">WORKING BUDGET</div><div className="kpi">{'$'}{total.toFixed(0)}</div><div className="muted">Airfare + current local envelope</div></div>
    </section>
    <section className="card section" style={{border:'2px solid var(--accent)'}}><h2 style={{marginTop:0}}>Today — get out the door</h2><p><strong>{phase.next||'Royal Oak Farmers Market, 316 E 11 Mile Rd.'}</strong> Keep today light: market, reset/laundry/admin, grocery top-up only if needed, then protect the <strong>6:00–7:00 PM</strong> film-study window.</p><div className="toolbar no-print"><button onClick={()=>onSelectTab?.('Today')}>Open Today</button><button className="btn-secondary" onClick={()=>onSelectTab?.('Daily Plan')}>Daily Plan</button></div></section>
    <section className="grid section">
      <div className="card"><div className="label">RETURN PREP</div><div className="kpi warn">SEP 24</div><div className="muted">Target leaving Royal Oak 3:15–3:30 PM for DTW.</div></div>
      <div className="card"><div className="label">BAGGAGE</div><div className="kpi">2 × 23 kg</div><div className="muted">First + second checked bags free on original Delta receipt.</div></div>
      <div className="card"><div className="label">RETURN WARNING</div><div className="kpi warn">AF1258</div><div className="muted">CDG→RBA schedule changed; reverify before departure.</div></div>
    </section>
  </>;
}
