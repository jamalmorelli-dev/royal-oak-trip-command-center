import { describe, it, expect } from "vitest";
import { generateTripICS } from "../app/lib/calendar.js";

describe("Calendar .ics Generator", () => {
  it("generates valid iCalendar RFC 5545 format", () => {
    const ics = generateTripICS();
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("includes critical check-in reminder event with alarm", () => {
    const ics = generateTripICS();
    expect(ics).toContain("Delta Check-In Window Opens (G82B6L)");
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics).toContain("TRIGGER:-PT15M");
    expect(ics).toContain("G82B6L");
  });

  it("includes all flight events with correct dates", () => {
    const ics = generateTripICS();
    expect(ics).toContain("DL8491");
    expect(ics).toContain("DL8719");
    expect(ics).toContain("DL228");
    expect(ics).toContain("AF1258");
    expect(ics).toContain("20260914T093500Z");
  });

  it("includes Detroit highlights (DIA + Dance City and Detroit Loop)", () => {
    const ics = generateTripICS();
    expect(ics).toContain("DIA + Dance City Festival");
    expect(ics).toContain("Main Detroit Excursion Loop");
  });

  it("strictly excludes ROHS, Ravens, Blue & Silver, and personal reimbursements", () => {
    const ics = generateTripICS().toLowerCase();
    expect(ics).not.toContain("rohs");
    expect(ics).not.toContain("ravens");
    expect(ics).not.toContain("blue & silver");
    expect(ics).not.toContain("53.75");
    expect(ics).not.toContain("24.30");
  });
});
