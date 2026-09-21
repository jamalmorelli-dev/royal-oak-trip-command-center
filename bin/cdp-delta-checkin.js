const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  console.log('Connecting to active Chrome over CDP (http://localhost:9222)...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const defaultContext = browser.contexts()[0];
  const pages = defaultContext.pages();
  console.log(`Found ${pages.length} open pages in Chrome.`);
  
  let targetPage = pages.find(p => p.url().includes('delta.com'));
  if (!targetPage) {
    console.log('Target page not found in list, looking up tabs...');
    targetPage = pages[0];
  }
  
  console.log(`Target page URL: ${targetPage.url()}`);
  console.log(`Target page Title: ${await targetPage.title()}`);

  const outputDir = path.join(__dirname, '../diagnostics');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Accept cookies if present
  const cookieBtn = targetPage.locator('#onetrust-accept-btn-handler');
  if (await cookieBtn.isVisible().catch(() => false)) {
    console.log('Dismissing cookie banner...');
    await cookieBtn.click().catch(() => {});
    await targetPage.waitForTimeout(1000);
  }

  // Inspect visible inputs
  const inputs = await targetPage.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map(i => ({
      name: i.name,
      id: i.id,
      placeholder: i.placeholder,
      aria: i.getAttribute('aria-label')
    }));
  });
  console.log('Detected inputs on Delta page:', JSON.stringify(inputs, null, 2));

  // Fill Confirmation Code and Name
  console.log('Filling confirmation code G82B6L and name Benjamin Prentiss...');
  const confInput = targetPage.locator('input[name="confirmationNo"], input#confirmationNo, input[aria-label*="Confirmation"]').first();
  const firstInput = targetPage.locator('input[name="firstName"], input#firstName, input[aria-label*="First"]').first();
  const lastInput = targetPage.locator('input[name="lastName"], input#lastName, input[aria-label*="Last"]').first();

  if (await confInput.isVisible().catch(() => false)) {
    await confInput.fill('G82B6L');
    await firstInput.fill('Benjamin');
    await lastInput.fill('Prentiss');
    console.log('Form inputs populated.');

    // Save screenshot before submit
    await targetPage.screenshot({ path: path.join(outputDir, 'delta_form_filled.png') });

    const submitBtn = targetPage.locator('#findTripSearch, button[type="submit"]:has-text("Search"), button:has-text("Search")').first();
    console.log('Submitting lookup form...');
    await submitBtn.click();

    console.log('Waiting for response / navigation...');
    await targetPage.waitForTimeout(6000);

    const shotPath = path.join(outputDir, 'delta_lookup_result.png');
    await targetPage.screenshot({ path: shotPath, fullPage: true });
    console.log(`Result screenshot saved: ${shotPath}`);

    const resultUrl = targetPage.url();
    const resultTitle = await targetPage.title();
    const bodyText = await targetPage.evaluate(() => document.body.innerText.slice(0, 4000));
    console.log(`Landed on: ${resultUrl} ("${resultTitle}")`);
    console.log('Page excerpt:\n', bodyText.slice(0, 1000));
  } else {
    console.log('Confirmation input not visible. Dumping page HTML snapshot...');
    const bodyText = await targetPage.evaluate(() => document.body.innerText.slice(0, 2000));
    console.log(bodyText);
  }

  // Do not close browser since user is running it!
}

run().catch(err => {
  console.error('CDP script error:', err);
});
