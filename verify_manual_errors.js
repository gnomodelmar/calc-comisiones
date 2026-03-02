const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.text().startsWith('ICONS_LIST:')) {
        console.log(msg.text());
    }
  });

  const fileUrl = `file://${path.resolve('/app/index.html')}`;
  await page.goto(fileUrl);

  await page.waitForSelector('nav');

  await page.evaluate(() => {
     const icons = Object.keys(window.lucide?.icons || window.lucide || {});
     const bookIcons = icons.filter(i => i.toLowerCase().includes('book'));
     console.log('ICONS_LIST:', bookIcons.join(', '));
  });

  await browser.close();
})();
