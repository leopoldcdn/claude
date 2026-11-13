// node cover.js sortie.png  -> image de couverture
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(__dirname, 'film.html'));
  await p.waitForFunction('window.READY === true');
  await p.evaluate('window.renderCover()');
  await p.screenshot({ path: process.argv[2] });
  await b.close();
})();
