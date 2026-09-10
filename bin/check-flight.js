#!/usr/bin/env node

/**
 * Universal Flight Check-In & Status Auditor
 * 
 * Works for current Royal Oak trip (Benjamin Prentiss / G82B6L)
 * and all future trips by passing CLI arguments or reading app/data.js.
 * 
 * Usage:
 *   node bin/check-flight.js
 *   node bin/check-flight.js --conf <CODE> --first <FIRST> --last <LAST> --airline <delta|airfrance>
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Parse CLI args
const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const index = args.indexOf(flag);
  return (index !== -1 && args[index + 1]) ? args[index + 1] : fallback;
}

// Read defaults from data.js if not provided
let defaultConf = 'G82B6L';
let defaultFirst = 'Benjamin';
let defaultLast = 'Prentiss';
let defaultTicket = '0062455565576';

try {
  const dataPath = path.join(__dirname, '../app/data.js');
  if (fs.existsSync(dataPath)) {
    const raw = fs.readFileSync(dataPath, 'utf8');
    const confMatch = raw.match(/confirmation:\s*['"]([^'"]+)['"]/);
    const travelerMatch = raw.match(/traveler:\s*['"]([^'"]+)['"]/);
    const ticketMatch = raw.match(/ticket:\s*['"]([^'"]+)['"]/);

    if (confMatch) defaultConf = confMatch[1];
    if (ticketMatch) defaultTicket = ticketMatch[1];
    if (travelerMatch) {
      const parts = travelerMatch[1].split(' ');
      defaultFirst = parts[0];
      defaultLast = parts.slice(1).join(' ');
    }
  }
} catch (e) {
  // Ignore fallback to defaults
}

const confirmation = getArg('--conf', defaultConf);
const firstName = getArg('--first', defaultFirst);
const lastName = getArg('--last', defaultLast);
const ticketNumber = getArg('--ticket', defaultTicket);
const airline = getArg('--airline', 'delta').toLowerCase();

console.log('====================================================');
console.log('✈  UNIVERSAL FLIGHT CHECK-IN & STATUS AUDITOR');
console.log('====================================================');
console.log(`Passenger    : ${firstName} ${lastName}`);
console.log(`Confirmation : ${confirmation}`);
console.log(`Ticket #     : ${ticketNumber}`);
console.log(`Airline      : ${airline.toUpperCase()}`);
console.log(`Audited At   : ${new Date().toISOString()}`);
console.log('----------------------------------------------------');

async function auditDelta() {
  const outputDir = path.join(__dirname, '../diagnostics');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1400, height: 1100 }
  });

  const page = await context.newPage();

  try {
    console.log('Connecting to Delta Find Your Trip portal...');
    await page.goto('https://www.delta.com/my-trips/search?staticurl=t', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);

    // Accept cookies if present
    const cookieBtn = page.locator('#onetrust-accept-btn-handler');
    if (await cookieBtn.isVisible().catch(() => false)) {
      await cookieBtn.click().catch(() => {});
      await page.waitForTimeout(500);
    }

    console.log(`Submitting reservation lookup for ${confirmation}...`);
    await page.locator('input[name="confirmationNo"]').fill(confirmation);
    await page.locator('input[name="firstName"]').fill(firstName);
    await page.locator('input[name="lastName"]').fill(lastName);

    await Promise.all([
      page.waitForNavigation({ timeout: 20000 }).catch(() => {}),
      page.locator('#findTripSearch').click()
    ]);

    await page.waitForTimeout(4000);

    // Save screenshot
    const screenshotPath = path.join(outputDir, `delta_${confirmation}_latest.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✔ Screenshot captured: ${screenshotPath}`);

    // Extract page body text
    const text = await page.evaluate(() => document.body.innerText);

    // Parse status points
    const isRequirementsComplete = text.includes('All Trip Requirements Complete');
    const checkinCountdownMatch = text.match(/(\d+\s+DAYS?\s+UNTIL\s+CHECK-IN)/i);
    const isFlightRebooked = text.includes('Flight Rebooked');
    const isScheduleChange = text.includes('Schedule Change');

    const statusReport = {
      auditedAt: new Date().toISOString(),
      confirmation,
      passenger: `${firstName} ${lastName}`,
      ticketNumber,
      url: page.url(),
      title: await page.title(),
      tripRequirementsComplete: isRequirementsComplete,
      checkInTiming: checkinCountdownMatch ? checkinCountdownMatch[1] : 'Check-in window active or passed',
      flightRebooked: isFlightRebooked,
      scheduleChange: isScheduleChange,
      screenshot: screenshotPath,
    };

    const reportPath = path.join(outputDir, `flight_status_${confirmation}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(statusReport, null, 2));
    console.log(`✔ JSON report saved: ${reportPath}`);

    console.log('----------------------------------------------------');
    console.log('📋 AUDIT FINDINGS:');
    console.log(`- Trip Requirements : ${isRequirementsComplete ? '✔ COMPLETE' : 'ACTION NEEDED'}`);
    console.log(`- Check-In Status   : ${statusReport.checkInTiming}`);
    console.log(`- Schedule Changes  : ${isScheduleChange ? '⚠ SCHEDULE CHANGE NOTED' : '✔ Normal schedule'}`);
    console.log(`- Rebooked Status   : ${isFlightRebooked ? '✔ Rebooked & confirmed' : 'Original flights'}`);
    console.log('----------------------------------------------------');
    console.log('🚀 NEXT ACTION:');
    if (checkinCountdownMatch) {
      console.log(`Check-in is not open yet (${checkinCountdownMatch[1]}).`);
      console.log('Window opens 24h prior to flight departure. Have passport & carry-on ready.');
    } else {
      console.log('CHECK-IN WINDOW IS ACTIVE! Check in immediately via the app or delta.com.');
    }
    console.log('====================================================');

  } catch (err) {
    console.error('Audit failed:', err.message);
  } finally {
    await browser.close();
  }
}

auditDelta();
