'use client';
import { useEffect, useMemo, useState } from 'react';
import { trip } from '../data';
import CopyButton from './CopyButton';
import { usePersistedState } from '../hooks/usePersistedState';

function remaining(target,now){const ms=Math.max(0,target-now);const s=Math.floor(ms/1000);return {hours:Math.floor(s/3600),minutes:Math.floor((s%3600)/60),seconds:s%60,total:ms}}

export default function CurrentPlaneChecklist(){
  const plane=trip.plane;
  const [now,setNow]=useState(()=>new Date());
  const [checked,setChecked]=usePersistedState('ro-plane-nightbefore-checked-v2',{});
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
  const departure=useMemo(()=>new Date('2026-09-14T10:35:00+01:00'),[]);
  const left=useMemo(()=>remaining(departure,now),[departure,now]);
  const done=plane.nightBefore.filter((_,i)=>checked[i]).length;
  const toggle=i=>setChecked(prev=>({...prev,[i]:!prev[i]}));
  return <section className="section" role="region" aria-label="Plane Checklist">
    <div className="grid" style={{marginBottom:16}}>
      <div className="card"><div className="label">CHECK-IN</div><div className="kpi good">DONE</div><div className="muted">{plane.checkInCompleted}</div></div>
      <div className="card"><div className="label">BOARDING PASS</div><div className="kpi warn">RBA DESK</div><div className="muted">Air France must issue it at the airport.</div></div>
      <div className="card"><div className="label">HOTEL → RBA</div><div className="kpi">06:30–06:45</div><div className="muted">{plane.departureTarget}</div></div>
      <div className="card"><div className="label">DEPARTURE COUNTDOWN</div><div className="kpi">{left.hours}h {left.minutes}m</div><div className="muted">DL8491 departs RBA 10:35.</div></div>
    </div>
    <div className="card" style={{marginBottom:16,border:'2px solid var(--bad)'}}><div className="label">HIGHEST PRIORITY</div><h2 style={{margin:'4px 0'}}>Original U.S. passport physically in your travel wallet</h2><p>Ticket/travel identity is Benjamin Prentiss. Passport, medication, cards/cash, phone and power banks stay in carry-on.</p></div>
    <section className="card section"><h2>Airport references</h2><div className="flight-refs"><div><span className="label">Delta: </span><strong>{trip.confirmation}</strong><CopyButton text={trip.confirmation} label="confirmation code"/></div><div><span className="label">Original ticket: </span><strong>{trip.ticket}</strong><CopyButton text={trip.ticket} label="ticket number"/></div></div><p className="muted">Air France booking and current check-in ticket are inside the Private Travel Vault rather than exposed in the public source.</p></section>
    <section className="card section"><h2>Zero-miss checklist</h2><div style={{overflowX:'auto'}}><table><thead><tr><th>Item</th><th>Status</th><th>Exactly what to do</th></tr></thead><tbody>{plane.checkin.map((r,i)=><tr key={i}><td><strong>{r[0]}</strong></td><td><span className={`pill ${r[1]==='CRITICAL'?'bad':r[1]==='DONE'||r[1]==='READY'?'good':'warn'}`}>{r[1]}</span></td><td>{r[2]}</td></tr>)}</tbody></table></div></section>
    <section className="card section"><div style={{display:'flex',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}><h2>Night before / before sleep</h2><span className="pill good">{done} of {plane.nightBefore.length} done</span></div><div className="checklist">{plane.nightBefore.map((x,i)=><label key={i} className={checked[i]?'checked':''}><input type="checkbox" checked={!!checked[i]} onChange={()=>toggle(i)}/><span>{x}</span></label>)}</div></section>
    <section className="card section"><h2>RBA execution order</h2><div style={{overflowX:'auto'}}><table><thead><tr><th>Time / stage</th><th>Action</th></tr></thead><tbody>{plane.rbaSequence.map((r,i)=><tr key={i}><td><strong>{r[0]}</strong></td><td>{r[1]}</td></tr>)}</tbody></table></div></section>
    <section className="card section" style={{borderColor:'var(--warn)'}}><h2>Printing rule</h2><p><strong>Flight:</strong> nothing needs to be self-printed; Air France issues the required boarding pass at RBA. <strong>PennDOT:</strong> the temporary license/camera-card PDF separately says to print it for your records and has a signature line.</p></section>
  </section>;
}
