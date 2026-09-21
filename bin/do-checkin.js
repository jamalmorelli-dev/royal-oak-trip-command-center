#!/usr/bin/env node
/**
 * Live Air France / Delta check-in for Benjamin Swayne Prentiss / G82B6L
 * Headed Chrome, dedicated profile. Does NOT attach to WA CDP :9222.
 *
 * Rules:
 * - Do not buy anything
 * - Do not change seats / bags unless the flow cannot continue otherwise
 * - Prefer existing assigned seats
 * - Pause on CAPTCHA / MFA / payment
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const PASSENGER = {
  legalName: 'Benjamin Swayne Prentiss',
  first: 'Benjamin',
  middle: 'Swayne',
  last: 'Prentiss',
  confirmation: 'G82B6L',
  ticket: '0062455565576',
  afFlight: 'AF1859',
  dlOutbound: 'DL8491',
  dlConnection: 'DL8719',
  passportNumber: '577895498',
  passportNationality: 'USA',
  dob: '1973-08-15',
  dobDay: '15',
  dobMonth: '08',
  dobYear: '1973',
  expiry: '2028-04-22',
  expiryDay: '22',
  expiryMonth: '04',
  expiryYear: '2028',
  sex: 'M',
  issuingCountry: 'USA',
};

const OUT = path.join(__dirname, '../diagnostics/checkin-2026-09-13');
const PROFILE = path.join(process.env.HOME, '.antigravity/airline-checkin-profile');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const STEP = process.env.CHECKIN_STEP || 'af-lookup';

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PROFILE, { recursive: true });

function dump(name, data) {
  const p = path.join(OUT, name);
  fs.writeFileSync(p, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  return p;
}

async function shot(page, name) {
  const p = path.join(OUT, name);
  await page.screenshot({ path: p, fullPage: true }).catch(async () => {
    await page.screenshot({ path: p, fullPage: false });
  });
  console.log('SHOT', p);
  return p;
}

async function acceptCookies(page) {
  const sels = [
    '#onetrust-accept-btn-handler',
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("I accept")',
    'button:has-text("Agree")',
    '[data-testid="cookie-accept"]',
    'button:has-text("Tout accepter")',
    'button:has-text("Accept")',
    'button:has-text("Accepter")',
  ];
  for (const s of sels) {
    const loc = page.locator(s).first();
    if (await loc.isVisible({ timeout: 1500 }).catch(() => false)) {
      await loc.click({ timeout: 2000, force: true }).catch(() => {});
      await page.waitForTimeout(800);
      return s;
    }
  }
  return null;
}

async function pageState(page) {
  return page.evaluate(() => {
    const text = (document.body && document.body.innerText) ? document.body.innerText.slice(0, 12000) : '';
    const inputs = [...document.querySelectorAll('input, textarea, select')].map((el) => ({
      tag: el.tagName,
      type: el.type || '',
      name: el.name || '',
      id: el.id || '',
      placeholder: el.placeholder || '',
      aria: el.getAttribute('aria-label') || '',
      value: (el.type === 'password' || el.type === 'hidden') ? '' : String(el.value || '').slice(0, 80),
    }));
    const buttons = [...document.querySelectorAll('button, [role="button"], a.button, input[type="submit"]')].slice(0, 40).map((el) => ({
      tag: el.tagName,
      type: el.type || '',
      id: el.id || '',
      name: el.name || '',
      text: (el.innerText || el.value || '').trim().slice(0, 80),
      disabled: !!el.disabled,
    }));
    return {
      url: location.href,
      title: document.title,
      text,
      inputs,
      buttons,
    };
  });
}

async function fillFirstVisible(page, selectors, value) {
  for (const s of selectors) {
    const loc = page.locator(s).first();
    if (await loc.count().catch(() => 0)) {
      try {
        await loc.waitFor({ state: 'visible', timeout: 2500 });
        await loc.fill(value, { timeout: 4000 });
        return s;
      } catch (_) { /* try next */ }
    }
  }
  return null;
}

async function clickFirst(page, selectors) {
  for (const s of selectors) {
    const loc = page.locator(s).first();
    const visible = await loc.isVisible({ timeout: 1500 }).catch(() => false);
    if (!visible) continue;
    const disabled = await loc.isDisabled().catch(() => false);
    if (disabled) continue;
    await loc.click({ timeout: 4000 });
    return s;
  }
  return null;
}

async function launch() {
  const browser = await chromium.launchPersistentContext(PROFILE, {
    headless: false,
    executablePath: CHROME,
    viewport: { width: 1440, height: 1100 },
    acceptDownloads: true,
    downloadsPath: path.join(OUT, 'downloads'),
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-first-run',
      '--no-default-browser-check',
    ],
    locale: 'en-US',
  });
  fs.mkdirSync(path.join(OUT, 'downloads'), { recursive: true });
  const page = browser.pages()[0] || await browser.newPage();
  page.setDefaultTimeout(20000);
  return { browser, page };
}

async function gotoFollow(page, url, timeout = 45000) {
  console.log('GOTO', url);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  } catch (e) {
    console.log('goto interrupted, waiting for settle:', e.message.slice(0, 180));
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  }
  await page.waitForTimeout(2500);
  return page.url();
}

async function airFranceLookup(page) {
  const urls = [
    'https://wwws.airfrance.us/check-in',
    'https://www.airfrance.com/us/en/check-in',
    'https://wwws.airfrance.fr/check-in',
    'https://www.airfrance.fr/s-enregistrer',
  ];
  let lastErr = null;
  for (const url of urls) {
    try {
      const landed = await gotoFollow(page, url);
      console.log('LANDED', landed);
      const cookie = await acceptCookies(page);
      console.log('cookies', cookie);
      const host = (() => { try { return new URL(landed).hostname; } catch { return 'unknown'; } })();
      await shot(page, `01_af_open_${host}.png`);
      const state = await pageState(page);
      dump(`01_af_open_${host}.json`, state);
      if (state.inputs.length || /check.?in|s.enregistrer|booking|pnr|last name|nom de famille|r[ée]servation/i.test(state.text)) {
        return { url: landed, state };
      }
    } catch (e) {
      lastErr = e;
      console.log('AF URL failed', url, e.message);
    }
  }
  throw lastErr || new Error('Air France check-in pages failed to load');
}

async function expandBookingPanel(page) {
  const panel = page.getByText('Enter my booking details', { exact: false }).first();
  if (await panel.isVisible({ timeout: 3000 }).catch(() => false)) {
    await panel.click({ timeout: 4000 });
    await page.waitForTimeout(800);
    return 'Enter my booking details';
  }
  const alt = page.locator('#mat-expansion-panel-header-server-app0, mat-expansion-panel-header').first();
  if (await alt.isVisible({ timeout: 1500 }).catch(() => false)) {
    await alt.click({ timeout: 4000 });
    await page.waitForTimeout(800);
    return 'expansion-header';
  }
  return null;
}

async function fillAfForm(page, bookingValue, label) {
  const pnr = page.locator('#bw-check-in__pnr-form-ticket-number-pnr');
  const last = page.locator('#bw-check-in__pnr-form-last-name');
  await pnr.waitFor({ state: 'attached', timeout: 8000 });
  await pnr.click({ force: true });
  await pnr.fill('');
  await pnr.fill(bookingValue);
  await last.click({ force: true });
  await last.fill('');
  await last.fill(PASSENGER.last);
  const flight = page.locator('#mat-input-server-app2, input[placeholder*="AF1234"], input[id*="flight"]');
  if (await flight.count()) {
    await flight.first().click({ force: true });
    await flight.first().fill('');
    await flight.first().fill(PASSENGER.afFlight);
  }
  const pnrVal = await pnr.inputValue();
  const lastVal = await last.inputValue();
  const flightVal = await flight.first().inputValue().catch(() => '');
  console.log('AF form values', { label, pnrVal, lastVal, flightVal });
  await shot(page, `02_af_filled_${label}.png`);
  return { pnrVal, lastVal };
}

async function submitAfForm(page) {
  const submitSels = [
    'form:has(#bw-check-in__pnr-form-ticket-number-pnr) button[type="submit"]',
    'button[type="submit"]:not([aria-label="Log in"])',
    'button:has-text("Search")',
    'button:has-text("Check in")',
    'button:has-text("Check-in")',
    'button:has-text("Find")',
    '[data-testid*="submit"]',
  ];
  const clicked = await clickFirst(page, submitSels);
  if (!clicked) {
    await page.locator('#bw-check-in__pnr-form-last-name').press('Enter').catch(() => {});
    return 'enter-key';
  }
  return clicked;
}

async function submitAirFrance(page) {
  await acceptCookies(page);
  const closeBanner = page.locator('button[aria-label="Close"], button:has-text("×"), [class*="banner"] button').first();
  if (await closeBanner.isVisible({ timeout: 1000 }).catch(() => false)) {
    await closeBanner.click({ force: true }).catch(() => {});
  }
  const expanded = await expandBookingPanel(page);
  console.log('expanded', expanded);
  await shot(page, '01b_af_panel.png');

  await fillAfForm(page, PASSENGER.confirmation, 'pnr');
  const clicked = await submitAfForm(page);
  console.log('clicked submit', clicked);
  await page.waitForTimeout(5000);
  await shot(page, '03_af_after_pnr_submit.png');
  let state = await pageState(page);
  dump('03_af_after_pnr_submit.json', state);

  const recaptcha = /captcha|unusual traffic|verify you are human/i.test(state.text)
    || state.inputs.some((i) => i.name === 'g-recaptcha-response' && /iframe|challenge/i.test(state.text));
  const notFound = /not found|no booking|unable to find|we couldn.?t find|invalid|inconnu|introuvable|does not match/i.test(state.text);
  const stillOnForm = await page.locator('#bw-check-in__pnr-form-ticket-number-pnr').isVisible().catch(() => false);

  if (recaptcha) {
    dump('CAPTCHA_BLOCK.json', { at: new Date().toISOString(), url: page.url() });
    console.log('CAPTCHA detected — leaving headed browser open');
  }

  if ((notFound || stillOnForm) && !recaptcha) {
    console.log('PNR lookup may have failed; retrying with e-ticket number');
    await fillAfForm(page, PASSENGER.ticket, 'ticket');
    await submitAfForm(page);
    await page.waitForTimeout(5000);
    await shot(page, '05_af_after_ticket_submit.png');
    state = await pageState(page);
    dump('05_af_after_ticket_submit.json', state);
  }
  return state;
}

async function deltaLookup(page) {
  const url = 'https://www.delta.com/my-trips/search?staticurl=t';
  console.log('GOTO', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);
  await acceptCookies(page);
  await shot(page, '10_delta_open.png');
  dump('10_delta_open.json', await pageState(page));

  await fillFirstVisible(page, ['input[name="confirmationNo"]', '#confirmationNo', 'input[id*="confirmation"]'], PASSENGER.confirmation);
  await fillFirstVisible(page, ['input[name="firstName"]', '#firstName'], PASSENGER.first);
  await fillFirstVisible(page, ['input[name="lastName"]', '#lastName'], PASSENGER.last);
  await shot(page, '11_delta_filled.png');
  const clicked = await clickFirst(page, ['#findTripSearch', 'button:has-text("Find Your Trip")', 'button[type="submit"]', 'button:has-text("Search")']);
  console.log('delta submit', clicked);
  await page.waitForTimeout(5000);
  await shot(page, '12_delta_after_submit.png');
  const state = await pageState(page);
  dump('12_delta_after_submit.json', state);
  return state;
}

async function main() {
  console.log('====================================================');
  console.log('CHECK-IN RUNNER', STEP);
  console.log(PASSENGER.legalName, PASSENGER.confirmation, PASSENGER.ticket);
  console.log('OUT', OUT);
  console.log('====================================================');

  const { browser, page } = await launch();
  const report = {
    startedAt: new Date().toISOString(),
    step: STEP,
    passenger: PASSENGER.legalName,
    confirmation: PASSENGER.confirmation,
    ticket: PASSENGER.ticket,
  };

  try {
    if (STEP === 'af-lookup' || STEP === 'all') {
      await airFranceLookup(page);
      report.afAfterSubmit = await submitAirFrance(page);
    }
    if (STEP === 'delta-lookup' || STEP === 'all') {
      report.delta = await deltaLookup(page);
    }
    report.finalUrl = page.url();
    report.finalTitle = await page.title();
    report.endedAt = new Date().toISOString();
    dump('00_run_report.json', report);
    console.log('FINAL URL', report.finalUrl);
    console.log('FINAL TITLE', report.finalTitle);
    console.log('KEEPING BROWSER OPEN 90s for next step / CAPTCHA');
    await page.waitForTimeout(90000);
  } catch (err) {
    report.error = err.message;
    report.stack = err.stack;
    dump('00_run_error.json', report);
    await shot(page, '99_error.png').catch(() => {});
    console.error('FAILED', err);
    await page.waitForTimeout(30000);
  } finally {
    // Keep the persistent profile; close this run.
    await browser.close().catch(() => {});
  }
}

main();
