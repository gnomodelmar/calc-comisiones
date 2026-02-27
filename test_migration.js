const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const filePath = 'file://' + path.resolve('index.html');

    // Seed localStorage with OLD data format BEFORE the page renders
    await page.addInitScript(() => {
        const oldMethods = [
            {
                id: 1,
                medioCobro: 'ViejoNAVE',
                medioPago: 'Tarjeta de Crédito',
                cuotas: 1,
                banco: 'Todos',
                comisionBase: 4.5,
                comisionFinanc: 0,
                incluyeIVA: false,
                diasAcreditacion: 0,
                instrucciones: 'Link'
                // NO fecha_inicio, dias_semana, etc.
            }
        ];
        localStorage.setItem('paymentMethods', JSON.stringify(oldMethods));
    });

    await page.goto(filePath);
    await page.waitForTimeout(2000);

    // Test Calculator
    await page.fill('input[type="number"]', '10000');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'calculator_migrated.png' });

    // Test Config View
    await page.click('text=Configuración');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'config_migrated.png' });

    console.log("Screenshots captured. Old data did not crash the app.");
    await browser.close();
})();
