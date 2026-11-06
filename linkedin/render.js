// Rend chaque élément .shot de source.html en PNG (×2 pour la netteté, sauf demande contraire).
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1700, height: 1400 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, 'source.html')); await p.waitForTimeout(1500);
  console.log('Sora chargée :', await p.evaluate(() => document.fonts.check('800 20px Sora')));
  for (const id of ['logo', 'logo-rond', 'banniere-page', 'banniere-profil']) await (await p.$('#' + id)).screenshot({ path: path.join(__dirname, `${id}.png`) });
  await b.close(); })();
