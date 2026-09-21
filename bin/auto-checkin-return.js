#!/usr/bin/env node

/**
 * AUTOMATED RETURN FLIGHT CHECK-IN (DL 228 DTW ➔ CDG)
 * 
 * Traveler: Benjamin Prentiss
 * Confirmation: G82B6L
 * Ticket: 0062455565576
 * Scheduled Departure: Thu Sep 24, 2026 @ 6:40 PM EDT (DTW McNamara Terminal)
 * Check-In Window Opens: Wed Sep 23, 2026 @ 6:40 PM EDT (T-24 Hours)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const PASSENGER = {
  first: 'Benjamin',
  last: 'Prentiss',
  confirmation: 'G82B6L',
  ticket: '0062455565576',
  flight: 'DL228',
  origin: 'DTW',
  destination: 'CDG',
  checkInOpensISO: '2026-09-23T18:40:00-04:00',
  departureISO: '2026-09-24T18:40:00-04:00'
};

const args = process.argv.slice(2);
const force = args.includes('--force');

function playSound(sound = 'Sosumi.aiff') {
  try {
    const p = `/System/Library/Sounds/${sound}`;
    if (fs.existsSync(p)) execSync(`afplay "${p}"`, { stdio: 'ignore' });
  } catch (e) {}
}

function notify(title, subtitle, msg) {
  try {
    const s = `display notification "${msg}" with title "${title}" subtitle "${subtitle}" sound name "Sosumi"`;
    execSync(`osascript -e '${s}'`, { stdio: 'ignore' });
  } catch (e) {}
}

async function run() {
  const now = new Date();
  const checkInTarget = new Date(PASSENGER.checkInOpensISO);
  const diffMs = checkInTarget.getTime() - now.getTime();

  console.log('====================================================');
  console.log('✈ DELTA DL 228 RETURN FLIGHT CHECK-IN AUTOMATION');
  console.log('====================================================');
  console.log(`Passenger       : ${PASSENGER.first} ${PASSENGER.last}`);
  console.log(`Confirmation    : ${PASSENGER.confirmation}`);
  console.log(`Ticket #        : ${PASSENGER.ticket}`);
  console.log(`Flight Segment  : DL 228 (Detroit DTW ➔ Paris CDG)`);
  console.log(`Scheduled Dep.  : Thu Sep 24, 2026 @ 6:40 PM EDT`);
  console.log(`Check-In Window : Wed Sep 23, 2026 @ 6:40 PM EDT (T-24h)`);
  console.log('----------------------------------------------------');

  if (diffMs > 0 && !force) {
    const totalSec = Math.floor(diffMs / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);

    console.log(`⏳ STATUS: CHECK-IN WINDOW IS NOT OPEN YET`);
    console.log(`Time Remaining  : ${d} days, ${h} hours, ${m} minutes.`);
    console.log(`Target Time     : Wednesday Sep 23 @ 6:40 PM EDT`);
    console.log('');
    console.log('Delta Air Lines strictly enforces international check-in opening');
    console.log('at exactly 24 hours prior to departure. Passing --force attempts anyway.');
    console.log('====================================================');
    return;
  }

  console.log('⚡ EXECUTING LIVE DELTA CHECK-IN SEQUENCE...');
  const outputDir = path.join(__dirname, '../diagnostics');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const profileDir = path.join(process.env.HOME, '.antigravity/airline-checkin-profile');
  const context = await chromium.launchPersistentContext(profileDir, {
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: ['--disable-blink-features=AutomationControlled']
  });

  const page = context.pages()[0] || await context.newPage();

  try {
    console.log('Navigating to Delta Check-In portal...');
    await page.goto('https://www.delta.com/check-in', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(2500);

    const cookieBtn = page.locator('#onetrust-accept-btn-handler');
    if (await cookieBtn.isVisible().catch(() => false)) {
      await cookieBtn.click().catch(() => {});
      await page.waitForTimeout(800);
    }

    const confInput = page.locator('input[name="confirmationNo"], input#confirmationNo').first();
    const originInput = page.locator('input[name="origin"], input#origin, input[aria-label*="Airport"]').first();

    if (await confInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('Entering confirmation code and origin airport DTW...');
      await confInput.fill(PASSENGER.confirmation);
      if (await originInput.isVisible().catch(() => false)) {
        await originInput.fill('DTW');
      }

      const submitBtn = page.locator('button[type="submit"]:has-text("Search"), #checkInSubmit').first();
      await submitBtn.click();
      await page.waitForTimeout(8000);

      const shot = path.join(outputDir, 'delta_checkin_live_result.png');
      await page.screenshot({ path: shot, fullPage: true });
      console.log(`Saved screenshot: ${shot}`);

      const text = await page.evaluate(() => document.body.innerText);
      if (text.includes('Boarding Pass') || text.includes('Checked In') || text.includes('Success')) {
        console.log('🎉 CHECK-IN SUCCESSFULLY COMPLETED!');
        playSound('Hero.aiff');
        notify('DELTA CHECK-IN SUCCESSFUL', 'DL 228 Boarding Pass Ready', 'Check-in completed. Verification screenshot saved.');
      } else {
        console.log('Current Delta Status:\n', text.slice(0, 600));
      }
    }
  } catch (e) {
    console.error('Check-in attempt error:', e.message);
  } finally {
    await context.close();
  }
}

run().catch(err => {
  console.error('Uncaught runner error:', err);
});
