import { describe, it, expect } from 'vitest';
import { trip } from '../app/data.js';

describe('Plane Checklist Data Integrity', () => {
  it('has valid traveler identity and flight codes', () => {
    expect(trip.traveler).toBe('Benjamin Prentiss');
    expect(trip.confirmation).toBe('G82B6L');
    expect(trip.ticket).toBe('0062455565576');
  });

  it('contains the plane checklist object with all required sections', () => {
    expect(trip.plane).toBeDefined();
    expect(trip.plane.checkInOpens).toContain('Sun Sep 13');
    expect(trip.plane.departureTarget).toContain('Mon Sep 14');
    expect(trip.plane.airportRule).toContain('Air France airport desk');
    expect(trip.plane.primaryFlight).toContain('DL 8491');
    expect(trip.plane.connection).toContain('DL 8719');
  });

  it('includes Physical passport as a CRITICAL check-in item', () => {
    const passportItem = trip.plane.checkin.find((item) => item[0] === 'Physical passport');
    expect(passportItem).toBeDefined();
    expect(passportItem[1]).toBe('CRITICAL');
    expect(passportItem[2]).toContain('Never place passport in checked baggage');
  });

  it('includes carry-on essentials and power bank rules', () => {
    const carryonItem = trip.plane.checkin.find((item) => item[0] === 'Carry-on essentials');
    expect(carryonItem).toBeDefined();
    expect(carryonItem[1]).toBe('CRITICAL');

    const securityItem = trip.plane.checkin.find((item) => item[0] === 'Security prep');
    expect(securityItem).toBeDefined();
    expect(securityItem[2]).toContain('power banks stay in carry-on');
  });

  it('contains all 8 night-before packing checklist items', () => {
    expect(trip.plane.nightBefore).toHaveLength(8);
    expect(trip.plane.nightBefore).toContain('Passport physically in travel wallet');
    expect(trip.plane.nightBefore).toContain('Phone fully charged');
    expect(trip.plane.nightBefore).toContain('Alarm(s) set for Fès departure');
  });

  it('contains the step-by-step RBA airport execution sequence ending in 10:35 AM departure', () => {
    expect(trip.plane.rbaSequence.length).toBeGreaterThanOrEqual(5);
    const lastStep = trip.plane.rbaSequence[trip.plane.rbaSequence.length - 1];
    expect(lastStep[0]).toBe('10:35 AM');
    expect(lastStep[1]).toContain('DL8491 scheduled departure');
  });
});
