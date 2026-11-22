// Captures d'écran de la démo pour le site (données fictives Nova Studio). Lancer : node site/outils/captures.js
const path = require('path');
const { chromium } = require('playwright');
const DEMO = 'file://' + path.join(__dirname, '..', '..', 'logiciel-rh-v3', 'demo.html');
const OUT = path.join(__dirname, '..', 'img');
const CACHE = '.toast,.toasts,#toasts,.avis-fab,.tour-fab,.help-fab,.org-warn{display:none!important}';

async function page(b, ui, opts = {}) {
  const p = await b.newPage(Object.assign({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, opts));
  await p.goto(DEMO);
  await p.evaluate((u) => { localStorage.clear(); localStorage.setItem('teamora-v3-news', '1'); localStorage.setItem('teamora-demo-tour', '1'); if (u) localStorage.setItem('teamora-ui-v3', JSON.stringify(u)); }, ui);
  await p.reload(); await p.waitForTimeout(1500); await p.addStyleTag({ content: CACHE });
  return p;
}
(async () => {
  const b = await chromium.launch();
  // 1. Accueil : « Aujourd'hui » et la roue déployée.
  let p = await page(b, null);
  await p.mouse.move(1000, 470); await p.waitForTimeout(1600);
  await p.screenshot({ path: `${OUT}/accueil.jpg`, type: 'jpeg', quality: 82 });
  // 2. « À traiter » classé par urgence.
  await p.mouse.move(10, 10); await p.click('.todo-btn'); await p.waitForTimeout(600);
  const box = await p.evaluate(() => { const r = document.querySelector('.modal-box').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 640) }; });
  await p.screenshot({ path: `${OUT}/a-traiter.jpg`, type: 'jpeg', quality: 82, clip: box });
  await p.close();
  // 3. Obligations : effectif simulé à 52 depuis un an.
  p = await page(b, { profile: 'rh', view: 'obligations' }, { viewport: { width: 1440, height: 1000 } });
  await p.fill('#obl-sim-n', '52'); await p.selectOption('#obl-sim-s', '1an'); await p.click('[data-act="obl-sim"]'); await p.waitForTimeout(600);
  await p.addStyleTag({ content: CACHE }); await p.waitForTimeout(200);
  await p.screenshot({ path: `${OUT}/obligations.jpg`, type: 'jpeg', quality: 82 });
  await p.close();
  // 4. Téléphone : l'espace salarié.
  p = await page(b, { profile: 'salarie' }, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await p.screenshot({ path: `${OUT}/mobile.jpg`, type: 'jpeg', quality: 84 });
  await p.close();
  await b.close();
})();
