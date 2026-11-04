// Rendu image par image avec Playwright (Chromium headless), puis assemblage ffmpeg (voir build.sh).
// Usage : node render.js still 0.2,6.5,12   -> PNG de contrôle dans ../_stills
//         node render.js video [workers]    -> frames JPEG 15 i/s dans ../_frames
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/index.html')); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(d); } }); });
async function openPage(browser, port) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGEERROR', e.message)); page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto(`http://127.0.0.1:${port}/index.html`); await page.waitForFunction('window.READY||window.BOOT_ERROR', null, { timeout: 60000 });
  const err = await page.evaluate('window.BOOT_ERROR'); if (err) throw new Error(err);
  return page;
}
(async () => {
  const mode = process.argv[2] || 'still';
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const port = srv.address().port;
  const browser = await chromium.launch();
  const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'timing.json'), 'utf8'));
  if (mode === 'still') {
    const out = path.join(ROOT, '..', '_stills'); fs.mkdirSync(out, { recursive: true });
    const page = await openPage(browser, port); const times = (process.argv[3] || '0.1').split(',').map(Number);
    for (const t of times) { await page.evaluate(t => renderAt(t), t); await page.locator('#c').screenshot({ path: path.join(out, `t${t.toFixed(2).padStart(6, '0')}.png`) }); console.log('still', t); }
  } else if (mode === 'cover') {
    const page = await openPage(browser, port); await page.evaluate(() => renderCover()); const out = process.argv[3] || path.join(ROOT, '..', 'couverture.png');
    await page.locator('#c').screenshot({ path: out }); console.log('cover ->', out);
  } else {
    const workers = Number(process.argv[3] || 4), out = path.join(ROOT, '..', '_frames'); fs.mkdirSync(out, { recursive: true });
    const n = Math.ceil(T.video_end * 15); let next = 0; const t0 = Date.now();
    await Promise.all(Array.from({ length: workers }, async () => {
      const page = await openPage(browser, port);
      while (true) { const k = next++; if (k >= n) break; await page.evaluate(t => renderAt(t), k / 15 + 1e-4);
        await page.locator('#c').screenshot({ path: path.join(out, `f${String(k).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
        if (k % 60 === 0) console.log(`frame ${k}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`); }
    }));
    console.log('done', n, 'frames');
  }
  await browser.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
