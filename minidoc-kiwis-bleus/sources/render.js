// Rendu des images avec Chromium (Playwright).
// node render.js info                      -> durée et repères (JSON)
// node render.js still <dossier> t1 t2 ... -> images fixes aux instants donnés (secondes)
// node render.js range <dossier> a b       -> images a..b-1 (JPEG haute qualité)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const [mode, out, ...rest] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', (e) => console.error('ERREUR PAGE', e.message));
  await p.goto('file://' + path.join(__dirname, 'film.html'));
  await p.waitForFunction('window.READY === true');
  if (mode === 'info') { console.log(JSON.stringify({ info: await p.evaluate('window.INFO()'), sfx: await p.evaluate('window.SFX()') })); }
  else if (mode === 'still') {
    fs.mkdirSync(out, { recursive: true });
    for (const t of rest) { await p.evaluate((x) => window.renderAt(x), parseFloat(t)); await p.screenshot({ path: path.join(out, `t${String(t).padStart(6, '0')}.png`) }); }
  } else if (mode === 'range') {
    fs.mkdirSync(out, { recursive: true });
    const a = parseInt(rest[0]), z = parseInt(rest[1]);
    for (let n = a; n < z; n++) { await p.evaluate((x) => window.renderFrame(x), n); await p.screenshot({ path: path.join(out, `f${String(n).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 96 }); }
  }
  await b.close();
})();
