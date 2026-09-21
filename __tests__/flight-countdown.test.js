import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

describe("FlightCountdown Component Integrity", () => {
  const root = join(__dirname, "..");
  const componentPath = join(root, "app/components/FlightCountdown.jsx");

  it("exists and defines interactive countdown logic", () => {
    expect(existsSync(componentPath)).toBe(true);
    const code = readFileSync(componentPath, "utf8");
    expect(code).toContain("export default function FlightCountdown");
    expect(code).toContain("setInterval");
    expect(code).toContain("DAYS");
    expect(code).toContain("HOURS");
    expect(code).toContain("MINUTES");
    expect(code).toContain("SECONDS");
  });

  it("contains all 4 key flight milestones", () => {
    const code = readFileSync(componentPath, "utf8");
    expect(code).toContain("checkin");
    expect(code).toContain("leave");
    expect(code).toContain("wheelsup");
    expect(code).toContain("touchdown");
    expect(code).toContain("2026-09-23T18:40:00-04:00"); // Return check-in
    expect(code).toContain("2026-09-24T18:40:00-04:00"); // Wheels up DL 228
  });

  it("strictly omits forbidden negative terms", () => {
    const code = readFileSync(componentPath, "utf8");
    expect(code).not.toMatch(/\bROHS\b/);
    expect(code).not.toMatch(/\bRavens\b/i);
    expect(code).not.toMatch(/Blue\s*&\s*Silver/i);
    expect(code).not.toContain("53.75");
    expect(code).not.toContain("24.30");
  });
});
