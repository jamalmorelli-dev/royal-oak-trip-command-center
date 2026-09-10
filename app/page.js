'use client';
import './globals.css';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import PlaneChecklist from './components/PlaneChecklist';
import TodayView from './components/TodayView';
import DailyPlan from './components/DailyPlan';
import Flights from './components/Flights';
import FoodShopping from './components/FoodShopping';
import Transport from './components/Transport';
import Budget from './components/Budget';
import AIConcierge from './components/AIConcierge';

const tabs = ['Dashboard', 'Plane Checklist', 'Today', 'Daily Plan', 'Flights', 'Food & Shopping', 'Transport', 'Budget', 'AI Concierge'];

export default function Home() {
  const [tab, setTab] = useState('Dashboard');

  return (
    <main className="wrap">
      <a href="#main-content" className="skip-link">Skip to content</a>

      <div className="hero">
        <div className="label">ROYAL OAK • SEPTEMBER 2026</div>
        <h1>Trip Command Center</h1>
        <div className="muted">
          One screen for flights, budget, food, clothes, school transport, daily execution and an AI trip concierge.
        </div>
      </div>

      <nav className="tabs" role="tablist" aria-label="Trip sections">
        {tabs.map((t) => (
          <button
            role="tab"
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
            key={t}
            tabIndex={tab === t ? 0 : -1}
          >
            {t}
          </button>
        ))}
      </nav>

      <div id="main-content" role="tabpanel" aria-label={tab}>
        {tab === 'Dashboard' && <Dashboard />}
        {tab === 'Plane Checklist' && <PlaneChecklist />}
        {tab === 'Today' && <TodayView />}
        {tab === 'Daily Plan' && <DailyPlan />}
        {tab === 'Flights' && <Flights />}
        {tab === 'Food & Shopping' && <FoodShopping />}
        {tab === 'Transport' && <Transport />}
        {tab === 'Budget' && <Budget />}
        {tab === 'AI Concierge' && <AIConcierge />}
      </div>
    </main>
  );
}
