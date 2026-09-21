import { describe, it, expect } from "vitest";
import { trip } from "../app/data.js";

describe("Return Flight Data Integrity", () => {
  it("contains complete returnPlane specifications", () => {
    expect(trip.returnPlane).toBeDefined();
    expect(trip.returnPlane.checkInOpens).toContain("Wed Sep 23");
    expect(trip.returnPlane.departureTarget).toContain("Thu Sep 24");
    expect(trip.returnPlane.primaryFlight).toContain("DL 0228");
    expect(trip.returnPlane.connection).toContain("AF 1258");
    expect(trip.returnPlane.airport).toContain("McNamara Terminal");
  });

  it("contains DTW airport execution sequence ending in Rabat RBA arrival", () => {
    expect(trip.returnPlane.airportSequence.length).toBeGreaterThanOrEqual(8);
    const lastStep = trip.returnPlane.airportSequence[trip.returnPlane.airportSequence.length - 1];
    expect(lastStep[0]).toContain("Sep 25");
    expect(lastStep[1]).toContain("Rabat-Salé Airport (RBA");
  });

  it("contains return packing checklist with 9 items", () => {
    expect(trip.returnPlane.packingChecklist).toHaveLength(9);
    expect(trip.returnPlane.packingChecklist).toContain("Original physical passport in personal travel wallet (BENJAMIN PRENTISS)");
  });

  it("strictly omits ROHS, Ravens, Blue & Silver, and personal reimbursements", () => {
    const raw = JSON.stringify(trip.returnPlane).toLowerCase();
    expect(raw).not.toContain("rohs");
    expect(raw).not.toContain("ravens");
    expect(raw).not.toContain("blue & silver");
    expect(raw).not.toContain("53.75");
    expect(raw).not.toContain("24.30");
  });
});
