const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  // Resolve absolute path
  const fileUrl = `file://${path.resolve('/app/index.html')}`;
  await page.goto(fileUrl);

  await page.waitForSelector('nav');
  await page.click('button:has-text("Manual")');
  await page.waitForSelector('text=Manual de Usuario');

  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const b of buttons) {
      if (b.innerText.includes('Calculadora') && b.closest('.max-w-4xl')) {
         b.click();
         break;
      }
    }
  });

  await page.waitForTimeout(1000);
  await browser.close();
})();
