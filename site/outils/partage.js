// Rend l'image de partage du site (img/partage.png, 1200 × 630). Lancer : node site/outils/partage.js
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(__dirname, 'partage.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(__dirname, '..', 'img', 'partage.png') });
  await b.close();
})();
