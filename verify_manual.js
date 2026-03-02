const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Resolve absolute path
  const fileUrl = `file://${path.resolve('/app/index.html')}`;
  console.log(`Navigating to ${fileUrl}`);
  await page.goto(fileUrl);

  // Wait for React to mount and the header to appear
  await page.waitForSelector('nav');

  // Click on the Manual tab.
  await page.click('button:has-text("Manual")');

  // Wait for the manual view container to appear
  await page.waitForSelector('text=Manual de Usuario');

  console.log("Taking collapsed screenshot...");
  await page.screenshot({ path: '/home/jules/verification/manual_collapsed_final3.png', fullPage: true });

  // Expanding the first section with specific text content inside the manual view
  console.log("Expanding first section...");
  await page.evaluate(() => {
    // Find all buttons
    const buttons = document.querySelectorAll('button');
    // Filter for ones inside the manual view that have title "Calculadora"
    for (const b of buttons) {
      if (b.innerText.includes('Calculadora') && b.closest('.max-w-4xl')) {
         b.click();
         break;
      }
    }
  });

  await page.waitForTimeout(1000); // Wait for the transition

  console.log("Taking expanded screenshot...");
  await page.screenshot({ path: '/home/jules/verification/manual_expanded_final3.png', fullPage: true });

  await browser.close();
})();
