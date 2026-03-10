const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to dev server
  console.log(`Navigating to http://localhost:3000`);
  await page.goto('http://localhost:3000');

  // Login as Admin to access everything
  await page.click("text=Soy Administrador");
  await page.waitForTimeout(500);
  await page.fill("input[type=\"password\"]", "admin123");
  await page.click("button[type=\"submit\"]");
  await page.waitForTimeout(1000); // Wait for login and transition

  // Wait for React to mount and render
  await page.waitForSelector('text=Calculadora de Precio de Venta');

  // Fill in inputs to calculate some values
  await page.fill('input[placeholder="Ej: 15000"]', '10000');
  await page.fill('input[placeholder="Ej: 20"]', '0'); // No inflation

  // Click on "Ver 1 opción más" if it exists
  const expandButton = await page.$('text=/Ver .* más/');
  if (expandButton) {
      await expandButton.click();
      console.log('Expanded alternative options.');
  } else {
      console.log('No alternatives found to expand. Please ensure data is loaded via server.');
  }

  // Wait for expansion animation or render
  await page.waitForTimeout(500);

  // Take a screenshot
  await page.screenshot({ path: 'calculator_alternatives.png', fullPage: true });
  console.log('Saved screenshot to calculator_alternatives.png');

  await browser.close();
})();
