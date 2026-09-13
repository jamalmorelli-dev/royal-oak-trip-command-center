'use client';
import { useEffect, useMemo, useState } from 'react';
import { trip } from '../data';
import CopyButton from './CopyButton';
import PWAInstall from './PWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { formatTimeInTz } from '../lib/tripTime';

function remaining(target, now){
  const ms=Math.max(0,target.getTime()-now.getTime());
  const s=Math.floor(ms/1000);
  return {hours:Math.floor(s/3600),minutes:Math.floor((s%3600)/60),seconds:s%60};
}

export default function CurrentTravelHUD({onSelectTab}){
  const [now,setNow]=useState(()=>new Date());
  const online=useOnlineStatus();
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
  const departure=useMemo(()=>new Date('2026-09-14T10:35:00+01:00'),[]);
  const left=useMemo(()=>remaining(departure,now),[departure,now]);
  return <header className="hud-container" role="banner" aria-label="Live Travel Heads-Up Display">
    <div className="hud-credentials-bar">
      <div className="hud-identity"><span className="hud-label">TRAVELER</span><div className="hud-name"><strong>{trip.traveler.toUpperCase()}</strong><span className="hud-verified-tag">✓ CHECKED IN</span><span className={`pill ${online?'good':'warn'}`} style={{fontSize:10}}>{online?'ONLINE':'OFFLINE'}</span></div></div>
      <div className="hud-codes"><div className="hud-code-item"><span className="hud-label">DELTA CONFIRMATION</span><div className="hud-code-val"><span className="mono-code">{trip.confirmation}</span><CopyButton text={trip.confirmation} label="confirmation code"/></div></div><div className="hud-code-item"><span className="hud-label">OUTBOUND</span><div className="hud-code-val"><span className="mono-code">DL8491 • RBA→CDG→DTW</span></div></div></div>
      <div className="hud-actions no-print"><PWAInstall /><button type="button" className="hud-btn hud-btn-primary" onClick={()=>onSelectTab?.('Airport Docs')}>Airport Docs</button><button type="button" className="hud-btn hud-btn-secondary" onClick={()=>onSelectTab?.('Plane Checklist')}>Plane Checklist</button></div>
    </div>
    <div className="hud-clocks-bar"><div className="hud-clock-title"><span className="hud-live-dot"/><span className="hud-clock-heading">LIVE TRIP CLOCKS</span></div><div className="hud-clocks-grid"><div className="hud-clock-card active-zone"><div className="hud-clock-header"><span className="hud-flag">🇲🇦</span><span className="hud-city">Rabat / Salé</span><span className="hud-zone-pill">ACTIVE</span></div><div className="hud-time">{formatTimeInTz(now,'Africa/Casablanca')}</div></div><div className="hud-clock-card"><div className="hud-clock-header"><span className="hud-flag">🇺🇸</span><span className="hud-city">Detroit / Royal Oak</span></div><div className="hud-time">{formatTimeInTz(now,'America/Detroit')}</div></div></div></div>
    <div className="hud-phase-banner status-action"><div className="hud-phase-main"><div className="hud-phase-header"><span className="hud-step-tag">AIRPORT READY</span><span className="hud-phase-badge">CHECKED IN</span></div><h2 className="hud-phase-title">Next required action: Air France counter at RBA</h2><p className="hud-phase-desc">Leave Marina Rabat Suites / Salé about <strong>06:30–06:45</strong>. Target RBA <strong>07:00–07:15</strong>. Air France must issue the boarding pass at the airport.</p></div><div className="hud-phase-timing"><span className="hud-timer-label">FLIGHT DEPARTURE COUNTDOWN</span><div className="timer-grid"><div className="timer-unit"><span className="timer-val">{left.hours}</span><span className="timer-lbl">Hours</span></div><div className="timer-unit"><span className="timer-val">{left.minutes}</span><span className="timer-lbl">Mins</span></div><div className="timer-unit"><span className="timer-val">{left.seconds}</span><span className="timer-lbl">Secs</span></div></div><button type="button" className="hud-quick-btn no-print" onClick={()=>onSelectTab?.('Airport Docs')}>Open Airport Docs →</button></div></div>
  </header>;
}
