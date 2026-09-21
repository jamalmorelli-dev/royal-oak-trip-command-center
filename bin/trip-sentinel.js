#!/usr/bin/env node

/**
 * AGGRESSIVE TRIP READINESS SENTINEL & ALARM SYSTEM
 * 
 * Runs directly on macOS. Alarms via native audio (afplay), voice (say),
 * and desktop notifications (osascript).
 * 
 * Usage:
 *   node bin/trip-sentinel.js                # Full readiness audit & audible alarm if items pending
 *   node bin/trip-sentinel.js --alarm        # Trigger immediate aggressive alarm & voice alert
 *   node bin/trip-sentinel.js --status       # Display current checklist & countdowns
 *   node bin/trip-sentinel.js --check <id>   # Check off item 1-8 or "all"
 *   node bin/trip-sentinel.js --uncheck <id> # Uncheck item 1-8 or "all"
 *   node bin/trip-sentinel.js --voice        # Voice-only status briefing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const STATE_FILE = path.join(os.homedir(), '.antigravity/trip_readiness.json');

const READINESS_ITEMS = [
  {
    id: 'passport',
    num: 1,
    priority: 'CRITICAL',
    title: 'Physical Passport in Hand (BENJAMIN PRENTISS)',
    description: 'Verify physical passport is on your person/travel wallet. NEVER place in checked luggage.',
    defaultChecked: true // Usually checked once in Royal Oak
  },
  {
    id: 'itinerary_offline',
    num: 2,
    priority: 'CRITICAL',
    title: 'Offline Delta PNR G82B6L & Ticket 0062455565576',
    description: 'Screenshots and offline PDF saved to phone for DL 228 and AF 1258 connections.',
    defaultChecked: true
  },
  {
    id: 'checkin_alarm',
    num: 3,
    priority: 'URGENT',
    title: 'Return Check-In Alarm Set (Wed Sep 23 @ 6:40 PM EDT)',
    description: 'Check-in opens exactly 24h before DTW departure. Alarm must be active.',
    defaultChecked: false
  },
  {
    id: 'luggage_weight',
    num: 4,
    priority: 'WARNING',
    title: 'Luggage Weighed (2 Checked Bags <= 23 kg / 50 lb each)',
    description: 'Weigh both bags before departure to avoid $100+ overweight baggage fees.',
    defaultChecked: false
  },
  {
    id: 'lithium_batteries',
    num: 5,
    priority: 'ZERO-TOLERANCE',
    title: 'Power Banks & Lithium Batteries in Carry-On ONLY',
    description: 'Strict FAA/TSA rule: No loose lithium batteries or portable power banks in checked bags.',
    defaultChecked: true
  },
  {
    id: 'tuesday_outing_rule',
    num: 6,
    priority: 'RESTRICTION',
    title: 'Tue Sep 22 Outing Rule: DIA CLOSED at 4 PM (NO DIA)',
    description: 'Detroit evening via FAST Woodward + Free QLINE. Stick to Midtown, Downtown, and Riverwalk.',
    defaultChecked: true
  },
  {
    id: 'dtw_ground_transport',
    num: 7,
    priority: 'CRITICAL',
    title: 'DTW Airport Ride Arranged for Thu Sep 24 @ 3:15 PM',
    description: 'Leave Royal Oak base ~3:15–3:30 PM for DTW McNamara Terminal (target arrival 4:15 PM).',
    defaultChecked: false
  },
  {
    id: 'bag_tags_rba',
    num: 8,
    priority: 'VERIFICATION',
    title: 'Bag Tag Routing Destination Verified to RBA (Not CDG)',
    description: 'At DTW bag drop counter, confirm baggage tag destination is Rabat (RBA).',
    defaultChecked: false
  }
];

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (e) {}
  const initial = {};
  for (const item of READINESS_ITEMS) {
    initial[item.id] = item.defaultChecked;
  }
  saveState(initial);
  return initial;
}

function saveState(state) {
  try {
    const dir = path.dirname(STATE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {}
}

function playSound(soundName = 'Sosumi.aiff') {
  try {
    const soundPath = `/System/Library/Sounds/${soundName}`;
    if (fs.existsSync(soundPath)) {
      execSync(`afplay "${soundPath}"`, { stdio: 'ignore' });
    }
  } catch (e) {}
}

function notify(title, subtitle, message, sound = 'Sosumi') {
  try {
    const script = `display notification "${message.replace(/"/g, '\\"')}" with title "${title.replace(/"/g, '\\"')}" subtitle "${subtitle.replace(/"/g, '\\"')}" sound name "${sound}"`;
    execSync(`osascript -e '${script}'`, { stdio: 'ignore' });
  } catch (e) {}
}

function speak(text) {
  try {
    execSync(`say "${text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
  } catch (e) {}
}

// Parse args
const args = process.argv.slice(2);
const state = loadState();

if (args.includes('--check')) {
  const target = args[args.indexOf('--check') + 1];
  if (target === 'all') {
    READINESS_ITEMS.forEach(i => state[i.id] = true);
    console.log('✅ ALL readiness items marked CHECKED.');
  } else {
    const item = READINESS_ITEMS.find(i => String(i.num) === target || i.id === target);
    if (item) {
      state[item.id] = true;
      console.log(`✅ Checked off: [${item.num}] ${item.title}`);
    } else {
      console.log(`❌ Item "${target}" not found.`);
    }
  }
  saveState(state);
  playSound('Tink.aiff');
  notify('TRIP READINESS UPDATED', 'Item Checked Off', 'Readiness state saved successfully.', 'Hero');
  process.exit(0);
}

if (args.includes('--uncheck')) {
  const target = args[args.indexOf('--uncheck') + 1];
  if (target === 'all') {
    READINESS_ITEMS.forEach(i => state[i.id] = false);
    console.log('⚠️ ALL readiness items marked UNCHECKED.');
  } else {
    const item = READINESS_ITEMS.find(i => String(i.num) === target || i.id === target);
    if (item) {
      state[item.id] = false;
      console.log(`⚠️ Unchecked: [${item.num}] ${item.title}`);
    } else {
      console.log(`❌ Item "${target}" not found.`);
    }
  }
  saveState(state);
  process.exit(0);
}

const checkedCount = READINESS_ITEMS.filter(i => state[i.id]).length;
const totalCount = READINESS_ITEMS.length;
const pendingItems = READINESS_ITEMS.filter(i => !state[i.id]);
const pct = Math.round((checkedCount / totalCount) * 100);

console.log('\n======================================================================');
console.log('🚨 ROYAL OAK TRIP COMMAND CENTER — AGGRESSIVE READINESS SENTINEL');
console.log('======================================================================');
console.log(`STATUS: ${checkedCount}/${totalCount} Complete (${pct}%) | PENDING ALERTS: ${pendingItems.length}`);
console.log('----------------------------------------------------------------------');

READINESS_ITEMS.forEach(item => {
  const isChecked = state[item.id];
  const icon = isChecked ? '✅ [DONE]' : '🚨 [ALERT]';
  console.log(`${icon} #${item.num} [${item.priority}] ${item.title}`);
  if (!isChecked) {
    console.log(`   ↳ ACTION: ${item.description}`);
  }
});

console.log('======================================================================\n');

if (args.includes('--alarm') || pendingItems.length > 0) {
  // Aggressive alert
  console.log('⚡ TRIGGERING HIGH-URGENCY ALERT TO USER...');
  playSound('Sosumi.aiff');
  
  const alertSubtitle = pendingItems.length > 0 
    ? `${pendingItems.length} READINESS ALERTS PENDING (${pct}% READY)` 
    : 'ALL READINESS CHECKS VERIFIED (100%)';
  const alertBody = pendingItems.length > 0 
    ? `Next Action: ${pendingItems[0].title}. Return departure in 72h.` 
    : 'All pre-flight readiness checks are green. DL 228 departure runway active.';

  notify('🚨 TRIP COMMAND CENTER ALARM', alertSubtitle, alertBody, 'Sosumi');

  if (args.includes('--alarm') || args.includes('--voice')) {
    speak(`Attention Benjamin. Trip readiness sentinel alert. You have ${pendingItems.length} pending items before DTW departure. Next action: ${pendingItems[0] ? pendingItems[0].title : 'All clear'}.`);
  }
}
