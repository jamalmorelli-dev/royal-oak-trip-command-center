const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function check() {
  const profileDir = path.join(process.env.HOME, '.antigravity/airline-checkin-profile');
  const outputDir = path.join(__dirname, '../diagnostics');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log('Launching headed Chrome with airline profile...');
  const context = await chromium.launchPersistentContext(profileDir, {
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: ['--disable-blink-features=AutomationControlled']
  });

  const page = context.pages()[0] || await context.newPage();

  // Listen to network responses for trip details
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('trip') || url.includes('pnr') || url.includes('checkin') || url.includes('passenger') || url.includes('booking')) {
      try {
        const ct = res.headers()['content-type'] || '';
        if (ct.includes('json')) {
          const json = await res.json();
          fs.writeFileSync(path.join(outputDir, `delta_api_${Date.now()}.json`), JSON.stringify({ url, json }, null, 2));
          console.log(`[API CAPTURED] ${url.slice(0, 80)}`);
        }
      } catch (e) {}
    }
  });

  try {
    console.log('Navigating to Delta Find Your Trip...');
    await page.goto('https://www.delta.com/my-trips/search?staticurl=t', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(3000);

    const cookieBtn = page.locator('#onetrust-accept-btn-handler');
    if (await cookieBtn.isVisible().catch(() => false)) {
      await cookieBtn.click().catch(() => {});
      await page.waitForTimeout(1000);
    }

    console.log('Filling confirmation G82B6L and name Benjamin Prentiss...');
    const confInput = page.locator('input[name="confirmationNo"], input#confirmationNo').first();
    const firstInput = page.locator('input[name="firstName"], input#firstName').first();
    const lastInput = page.locator('input[name="lastName"], input#lastName').first();

    if (await confInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await confInput.fill('G82B6L');
      await firstInput.fill('Benjamin');
      await lastInput.fill('Prentiss');

      const submitBtn = page.locator('#findTripSearch, button[type="submit"]:has-text("Search")').first();
      await submitBtn.click();
      console.log('Submitted search form. Waiting for trip content to render...');
      
      // Wait up to 15s for skeleton to disappear or real trip content
      for (let i = 0; i < 15; i++) {
        await page.waitForTimeout(1000);
        const text = await page.evaluate(() => document.body.innerText);
        if (text.includes('DL 228') || text.includes('Paris') || text.includes('Check-in') || text.includes('Days until') || text.includes('Confirmation Code') || text.includes('We are unable to find')) {
          console.log(`Content rendered after ${i + 1}s!`);
          break;
        }
      }

      await page.waitForTimeout(2000);

      const shotPath = path.join(outputDir, 'delta_my_trip_rendered.png');
      await page.screenshot({ path: shotPath, fullPage: true });
      console.log(`Saved screenshot: ${shotPath}`);

      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 4000));
      console.log('Page body text:\n', bodyText.slice(0, 1200));

      // Check for Check-in button specifically
      const checkinBtn = page.locator('button:has-text("Check in"), a:has-text("Check in"), button:has-text("Check-in")').first();
      if (await checkinBtn.isVisible().catch(() => false)) {
        console.log('🔥 ACTIVE CHECK-IN BUTTON DETECTED ON DELTA!');
      } else {
        console.log('No active Check-In button visible yet.');
      }
    }
  } catch (e) {
    console.error('Error during check:', e.message);
  } finally {
    await context.close();
  }
}

check();
