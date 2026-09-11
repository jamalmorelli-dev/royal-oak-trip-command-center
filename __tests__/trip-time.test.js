import { describe, it, expect } from "vitest";
import {
  TRIP_TIMEZONES,
  KEY_DATES,
  getTimeRemaining,
  formatTimeInTz,
  formatDateInTz,
  getTripPhase,
} from "../app/lib/tripTime.js";

describe("Trip Time and Phase Utilities", () => {
  it("defines all 3 primary trip timezones", () => {
    expect(TRIP_TIMEZONES).toHaveLength(3);
    const cities = TRIP_TIMEZONES.map((t) => t.city);
    expect(cities).toContain("Fès / Rabat");
    expect(cities).toContain("Paris (CDG)");
    expect(cities).toContain("Detroit / Royal Oak");
  });

  it("calculates time remaining correctly for future target", () => {
    const target = new Date("2026-09-13T10:35:00+01:00");
    const now = new Date("2026-09-11T10:35:00+01:00"); // 2 exact days earlier
    const res = getTimeRemaining(target, now);
    expect(res.days).toBe(2);
    expect(res.hours).toBe(0);
    expect(res.minutes).toBe(0);
    expect(res.isPast).toBe(false);
  });

  it("handles past target gracefully", () => {
    const target = new Date("2026-09-10T10:00:00Z");
    const now = new Date("2026-09-11T10:00:00Z");
    const res = getTimeRemaining(target, now);
    expect(res.isPast).toBe(true);
    expect(res.total).toBe(0);
  });

  it("formats time and date in specified timezone", () => {
    const date = new Date("2026-09-14T10:35:00+01:00"); // 09:35 UTC
    const timeMorocco = formatTimeInTz(date, "Africa/Casablanca");
    expect(timeMorocco).toContain("10:35");

    const dateMorocco = formatDateInTz(date, "Africa/Casablanca");
    expect(dateMorocco).toContain("Sep 14");
  });

  it("identifies PRE_CHECKIN phase on Sep 11, 2026", () => {
    const now = new Date("2026-09-11T11:24:00+01:00");
    const phase = getTripPhase(now);
    expect(phase.id).toBe("PRE_CHECKIN");
    expect(phase.step).toBe(1);
    expect(phase.targetTab).toBe("Plane Checklist");
  });

  it("identifies CHECKIN_WINDOW phase on Sun Sep 13 @ 11:00 AM", () => {
    const now = new Date("2026-09-13T11:00:00+01:00");
    const phase = getTripPhase(now);
    expect(phase.id).toBe("CHECKIN_WINDOW");
    expect(phase.step).toBe(2);
    expect(phase.targetTab).toBe("Plane Checklist");
  });

  it("identifies OUTBOUND_TRAVEL phase on Mon Sep 14 @ 12:00 PM", () => {
    const now = new Date("2026-09-14T12:00:00+01:00");
    const phase = getTripPhase(now);
    expect(phase.id).toBe("OUTBOUND_TRAVEL");
    expect(phase.step).toBe(3);
  });

  it("identifies RESIDENCY phase on Sat Sep 19 @ 10:00 AM Detroit time", () => {
    const now = new Date("2026-09-19T10:00:00-04:00");
    const phase = getTripPhase(now);
    expect(phase.id).toBe("RESIDENCY");
    expect(phase.step).toBe(4);
    expect(phase.targetTab).toBe("Today");
  });

  it("identifies RETURN_TRAVEL phase on Sep 25 @ 09:00 AM Paris time", () => {
    const now = new Date("2026-09-25T09:00:00+02:00");
    const phase = getTripPhase(now);
    expect(phase.id).toBe("RETURN_TRAVEL");
    expect(phase.step).toBe(5);
  });

  it("identifies POST_TRIP phase on Sep 26, 2026", () => {
    const now = new Date("2026-09-26T12:00:00Z");
    const phase = getTripPhase(now);
    expect(phase.id).toBe("POST_TRIP");
    expect(phase.step).toBe(6);
  });
});
