/**
 * Trip Time & Phase Utilities
 * Provides timezone formatting, live countdown math, and trip phase detection.
 */

export const TRIP_TIMEZONES = [
  { id: "morocco", city: "Fès / Rabat", tz: "Africa/Casablanca", code: "GMT+1", flag: "🇲🇦" },
  { id: "paris", city: "Paris (CDG)", tz: "Europe/Paris", code: "CEST", flag: "🇫🇷" },
  { id: "detroit", city: "Detroit / Royal Oak", tz: "America/Detroit", code: "EDT", flag: "🇺🇸" },
];

export const KEY_DATES = {
  checkInOpen: "2026-09-13T10:35:00+01:00",
  departure: "2026-09-14T10:35:00+01:00",
  detroitArrival: "2026-09-14T18:50:00-04:00",
  returnDeparture: "2026-09-24T18:40:00-04:00",
  tripEnd: "2026-09-25T13:10:00+01:00",
};

export function getTimeRemaining(targetDate, nowDate = new Date()) {
  const target = targetDate instanceof Date ? targetDate : new Date(targetDate);
  const now = nowDate instanceof Date ? nowDate : new Date(nowDate);
  const ms = target.getTime() - now.getTime();

  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isPast: true };
  }

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, total: ms, isPast: false };
}

export function formatTimeInTz(date = new Date(), tz = "Africa/Casablanca") {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return formatter.format(date);
  } catch (err) {
    return date.toLocaleTimeString();
  }
}

export function formatDateInTz(date = new Date(), tz = "Africa/Casablanca") {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return formatter.format(date);
  } catch (err) {
    return date.toLocaleDateString();
  }
}

export function getTripPhase(nowDate = new Date()) {
  const now = nowDate instanceof Date ? nowDate : new Date(nowDate);
  const checkInOpen = new Date(KEY_DATES.checkInOpen);
  const departure = new Date(KEY_DATES.departure);
  const returnFlight = new Date(KEY_DATES.returnDeparture);
  const tripEnd = new Date(KEY_DATES.tripEnd);

  if (now < checkInOpen) {
    const remaining = getTimeRemaining(checkInOpen, now);
    return {
      id: "PRE_CHECKIN",
      step: 1,
      name: "Pre-Flight Preparation",
      shortLabel: "T-Minus",
      statusClass: "status-prep",
      headline: "T-" + remaining.days + "d until Delta Check-In Opens",
      description: "Opens Sunday Sep 13 @ 10:35 AM Morocco time (" + remaining.days + "d " + remaining.hours + "h remaining).",
      primaryActionText: "Review Plane Checklist",
      targetTab: "Plane Checklist",
      activeLocationTz: "Africa/Casablanca",
    };
  }

  if (now >= checkInOpen && now < departure) {
    const remaining = getTimeRemaining(departure, now);
    return {
      id: "CHECKIN_WINDOW",
      step: 2,
      name: "Check-In Window Open",
      shortLabel: "ACTION REQUIRED",
      statusClass: "status-action",
      headline: "Check-In Window is Active",
      description: "Check in now on Delta or Air France. Flight departs in " + remaining.hours + "h " + remaining.minutes + "m.",
      primaryActionText: "Open Check-In Links",
      targetTab: "Plane Checklist",
      activeLocationTz: "Africa/Casablanca",
    };
  }

  const endOfTravelDay = new Date("2026-09-14T23:59:59-04:00");
  if (now >= departure && now < endOfTravelDay) {
    return {
      id: "OUTBOUND_TRAVEL",
      step: 3,
      name: "Outbound Travel Day",
      shortLabel: "EN ROUTE",
      statusClass: "status-travel",
      headline: "Transit: RBA → CDG → DTW",
      description: "DL8491 (10:35 AM RBA) → CDG (2:40 PM) → DL8719 (4:05 PM CDG) → DTW (6:50 PM EDT).",
      primaryActionText: "View Flight Details",
      targetTab: "Flights",
      activeLocationTz: "Europe/Paris",
    };
  }

  if (now >= endOfTravelDay && now < returnFlight) {
    return {
      id: "RESIDENCY",
      step: 4,
      name: "Royal Oak & Detroit Residency",
      shortLabel: "ON THE GROUND",
      statusClass: "status-live",
      headline: "Royal Oak Operating Residency",
      description: "Daily school coordination, family life, and curated Detroit cultural excursions via Woodward.",
      primaryActionText: "View Today's Plan",
      targetTab: "Today",
      activeLocationTz: "America/Detroit",
    };
  }

  if (now >= returnFlight && now <= tripEnd) {
    return {
      id: "RETURN_TRAVEL",
      step: 5,
      name: "Return Travel to Morocco",
      shortLabel: "HEADING HOME",
      statusClass: "status-travel",
      headline: "Return Transit: DTW → CDG → RBA",
      description: "DL228 DTW 6:40 PM → CDG 8:40 AM → AF1258 CDG 11:15 AM → RBA 1:10 PM.",
      primaryActionText: "View Return Flights",
      targetTab: "Flights",
      activeLocationTz: "Europe/Paris",
    };
  }

  return {
    id: "POST_TRIP",
    step: 6,
    name: "Trip Concluded",
    shortLabel: "COMPLETED",
    statusClass: "status-done",
    headline: "Trip Successfully Completed",
    description: "All flights, itineraries, and receipts concluded.",
    primaryActionText: "View Final Budget",
    targetTab: "Budget",
    activeLocationTz: "Africa/Casablanca",
  };
}
