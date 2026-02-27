const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const filePath = 'file://' + path.resolve('index.html');
    await page.goto(filePath);
    await page.waitForTimeout(2000);

    // Enter Base Price
    await page.fill('input[placeholder="Ej: 15000"]', '10000');
    await page.waitForTimeout(500);

    // Enter Inflated Percentage (e.g. 20%)
    await page.fill('input[placeholder="Ej: 20"]', '20');
    await page.waitForTimeout(1000);

    // Take screenshot of the Calculator View with new fields
    await page.screenshot({ path: 'calculator_discounts_applied.png', fullPage: true });

    await browser.close();
})();
