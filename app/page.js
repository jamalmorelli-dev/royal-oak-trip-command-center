'use client';
import "./globals.css";
import { useState } from "react";
import TravelHUD from "./components/TravelHUD";
import Dashboard from "./components/Dashboard";
import PlaneChecklist from "./components/PlaneChecklist";
import TodayView from "./components/TodayView";
import DailyPlan from "./components/DailyPlan";
import Flights from "./components/Flights";
import FoodShopping from "./components/FoodShopping";
import Transport from "./components/Transport";
import Budget from "./components/Budget";
import AIConcierge from "./components/AIConcierge";

const TAB_ITEMS = [
  { id: "Dashboard", label: "Dashboard", icon: "📊" },
  { id: "Plane Checklist", label: "Plane Checklist", icon: "✈️", badge: "T-2d" },
  { id: "Today", label: "Today", icon: "📅", live: true },
  { id: "Daily Plan", label: "Daily Plan", icon: "🗺️" },
  { id: "Flights", label: "Flights", icon: "🛫" },
  { id: "Food & Shopping", label: "Food & Spots", icon: "🛍️" },
  { id: "Transport", label: "Transport", icon: "🚌" },
  { id: "Budget", label: "Budget", icon: "💳" },
  { id: "AI Concierge", label: "AI Concierge", icon: "🤖" },
];

export default function Home() {
  const [tab, setTab] = useState("Dashboard");

  return (
    <main className="wrap">
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Persistent Live Travel Heads-Up Display */}
      <TravelHUD onSelectTab={setTab} activeTab={tab} />

      {/* Floating Modern Tab Navigation */}
      <nav className="tabs" role="tablist" aria-label="Trip sections">
        {TAB_ITEMS.map((item) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={"panel-" + item.id}
              className={isActive ? "active" : ""}
              onClick={() => setTab(item.id)}
              tabIndex={isActive ? 0 : -1}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="tab-badge">{item.badge}</span>}
              {item.live && <span className="tab-live-pulse" title="Live today view" />}
            </button>
          );
        })}
      </nav>

      {/* Main Tab Panels */}
      <div id="main-content" role="tabpanel" aria-label={tab}>
        {tab === "Dashboard" && <Dashboard onSelectTab={setTab} />}
        {tab === "Plane Checklist" && <PlaneChecklist />}
        {tab === "Today" && <TodayView onSelectTab={setTab} />}
        {tab === "Daily Plan" && <DailyPlan />}
        {tab === "Flights" && <Flights />}
        {tab === "Food & Shopping" && <FoodShopping />}
        {tab === "Transport" && <Transport />}
        {tab === "Budget" && <Budget />}
        {tab === "AI Concierge" && <AIConcierge />}
      </div>
    </main>
  );
}
