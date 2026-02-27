const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const filePath = 'file://' + path.resolve('index.html');
    await page.goto(filePath);
    await page.waitForTimeout(2000);

    // Test Config View
    await page.click('text=Configuración');
    await page.waitForTimeout(1000);

    // Screenshot of the initial setup
    await page.screenshot({ path: 'config_dropdowns_initial.png', fullPage: true });

    // Open dropdown for Medio de Cobro and select "➕ Agregar nuevo..."
    await page.selectOption('select >> nth=0', '__NEW__');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'config_dropdown_custom_input.png' });

    // Fill in a custom value and save
    await page.fill('input[placeholder="Ej: NAVE"]', 'Mi Nuevo Medio');
    await page.click('button:has-text("Agregar Medio de Pago")');
    await page.waitForTimeout(1000);

    // Check if it saved with an "Actualizado" timestamp in the table
    await page.screenshot({ path: 'config_saved_timestamp.png', fullPage: true });

    await browser.close();
})();
