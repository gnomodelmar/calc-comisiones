const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const filePath = 'file://' + path.resolve('index.html');

    // Seed localStorage with a couple of active promos
    await page.addInitScript(() => {
        const methods = [
            {
                id: 1,
                medioCobro: 'Promo Verano',
                medioPago: 'Tarjeta de Crédito',
                cuotas: 3,
                banco: 'Santander',
                comisionBase: 4.5,
                comisionFinanc: 0,
                incluyeIVA: false,
                diasAcreditacion: 0,
                instrucciones: '',
                fecha_inicio: '',
                fecha_fin: '2050-12-31',
                dias_semana: [5, 6], // Fri, Sat
                categoriaProducto: '',
                porcentaje_descuento_cliente: 30,
                tope_reintegro: 15000,
                tipo_tope: 'por_mes',
                fecha_ultima_edicion: new Date().toISOString(),
                esPromocion: true
            },
            {
                id: 2,
                medioCobro: 'Especial Indumentaria',
                medioPago: 'Transferencia',
                cuotas: 1,
                banco: 'Galicia',
                comisionBase: 1.0,
                comisionFinanc: 0,
                incluyeIVA: false,
                diasAcreditacion: 0,
                instrucciones: '',
                fecha_inicio: '',
                fecha_fin: '',
                dias_semana: [0, 1, 2, 3, 4, 5, 6],
                categoriaProducto: 'Indumentaria',
                porcentaje_descuento_cliente: 15,
                tope_reintegro: 0,
                tipo_tope: 'por_transaccion',
                fecha_ultima_edicion: new Date().toISOString(),
                esPromocion: true
            }
        ];
        localStorage.setItem('paymentMethods', JSON.stringify(methods));
    });

    await page.goto(filePath);
    await page.waitForTimeout(2000);

    // Test Promos View
    await page.click('text=Promociones');
    await page.waitForTimeout(1000);

    // Screenshot of the Promos
    await page.screenshot({ path: 'promotions_tab.png', fullPage: true });

    await browser.close();
})();
