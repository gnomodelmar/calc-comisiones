const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const filePath = 'file://' + path.resolve('index.html');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Login as Admin to access everything
    await page.click("text=Soy Administrador");
    await page.waitForTimeout(500);
    await page.fill("input[type=\"password\"]", "admin123");
    await page.click("button[type=\"submit\"]");
    await page.waitForTimeout(1000); // Wait for login and transition

    // Type amount to see the calculator view
    await page.fill('input[type="number"]', '10000');
    await page.waitForTimeout(1000); // Wait for calculations

    await page.screenshot({ path: 'calculator_view_updated.png', fullPage: true });

    // Navigate to Config View
    await page.click('text=Configuración');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'config_view_updated.png', fullPage: true });

    await browser.close();
})();
