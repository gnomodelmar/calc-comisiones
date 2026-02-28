const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load local file
  const filePath = `file://${path.resolve('index.html')}`;
  console.log(`Navigating to ${filePath}`);
  await page.goto(filePath);

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
      console.log('No alternatives found to expand. Using default data.');
      // Need to add data to test.
      await page.evaluate(() => {
          const m1 = {
              id: 3,
              medioCobro: "Mercado Pago",
              medioPago: "Tarjeta de Crédito",
              cuotas: 1,
              banco: "Todos",
              comisionBase: 5.99,
              comisionFinanc: 0,
              incluyeIVA: false,
              diasAcreditacion: 0,
              instrucciones: "",
              fecha_inicio: "",
              fecha_fin: "",
              dias_semana: [0, 1, 2, 3, 4, 5, 6],
              categoriaProducto: "",
              porcentaje_descuento_cliente: 0,
              tope_reintegro: 0,
              tipo_tope: "por_transaccion",
              fecha_ultima_edicion: new Date().toISOString(),
              esPromocion: false,
          };
          const currentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
          currentMethods.push(m1);
          localStorage.setItem('paymentMethods', JSON.stringify(currentMethods));
          window.location.reload();
      });

      await page.waitForSelector('text=Calculadora de Precio de Venta');
      await page.fill('input[placeholder="Ej: 15000"]', '10000');

      const newExpandButton = await page.waitForSelector('text=/Ver .* más/');
      if(newExpandButton) {
          await newExpandButton.click();
          console.log('Expanded alternative options after adding data.');
      }
  }

  // Wait for expansion animation or render
  await page.waitForTimeout(500);

  // Take a screenshot
  await page.screenshot({ path: 'calculator_alternatives.png', fullPage: true });
  console.log('Saved screenshot to calculator_alternatives.png');

  await browser.close();
})();
