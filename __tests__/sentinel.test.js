import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Trip Readiness Sentinel & Alarm System', () => {
  const root = join(__dirname, '..');
  const sentinelPath = join(root, 'bin/trip-sentinel.js');
  const componentPath = join(root, 'app/components/ReadinessSentinel.jsx');

  it('has executable CLI sentinel script', () => {
    expect(existsSync(sentinelPath)).toBe(true);
    const script = readFileSync(sentinelPath, 'utf8');
    expect(script).toContain('#!/usr/bin/env node');
    expect(script).toContain('READINESS_ITEMS');
    expect(script).toContain('osascript');
    expect(script).toContain('afplay');
    expect(script).toContain('say');
  });

  it('has web ReadinessSentinel component with audio alarm tone generator', () => {
    expect(existsSync(componentPath)).toBe(true);
    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('AudioContext');
    expect(code).toContain('playAudioTone');
    expect(code).toContain('ALARM ME NOW');
    expect(code).toContain('trip_readiness_state_v1');
  });

  it('contains the 8 critical flight and trip readiness requirements', () => {
    const script = readFileSync(sentinelPath, 'utf8');
    expect(script).toContain('passport');
    expect(script).toContain('itinerary_offline');
    expect(script).toContain('checkin_alarm');
    expect(script).toContain('luggage_weight');
    expect(script).toContain('lithium_batteries');
    expect(script).toContain('tuesday_outing_rule');
    expect(script).toContain('dtw_ground_transport');
    expect(script).toContain('bag_tags_rba');
  });

  it('enforces negative constraints across sentinel code and component', () => {
    const script = readFileSync(sentinelPath, 'utf8');
    const component = readFileSync(componentPath, 'utf8');

    for (const content of [script, component]) {
      expect(content).not.toMatch(/\bROHS\b/);
      expect(content).not.toMatch(/\bRavens\b/i);
      expect(content).not.toMatch(/Blue\s*&\s*Silver/i);
      expect(content).not.toContain('53.75');
      expect(content).not.toContain('24.30');
    }
  });
});
