// Captures réelles de la démo pour les aperçus animés du site, avec la position des éléments cliqués.
// Lancer : node site/outils/apercus.js  →  site/img/apercus/*.webp et site/img/apercus/images.js
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const DEMO = 'file://' + path.join(__dirname, '..', '..', 'logiciel-rh-v3', 'demo.html');
const OUT = path.join(__dirname, '..', 'img', 'apercus');
const frames = {};

async function ouvrir(b, ui, mobile) {
  const opts = mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 };
  const p = await b.newPage(opts);
  await p.goto(DEMO);
  await p.evaluate((u) => { localStorage.clear(); localStorage.setItem('teamora-v3-news', '1'); localStorage.setItem('teamora-demo-tour', '1'); if (u) localStorage.setItem('teamora-ui-v3', JSON.stringify(u)); }, ui);
  await p.reload(); await p.waitForTimeout(1800);
  return p;
}
// Position d'un élément en fraction de l'écran (x, y, largeur, hauteur).
async function boite(p, sel) {
  const el = typeof sel === 'string' ? p.locator(sel).first() : sel;
  const r = await el.boundingBox(); const v = p.viewportSize();
  if (!r) throw new Error('introuvable : ' + sel);
  return [r.x / v.width, r.y / v.height, r.width / v.width, r.height / v.height].map((n) => Math.round(n * 10000) / 10000);
}
async function cliche(p, nom, boites) {
  const png = path.join(OUT, nom + '.png');
  await p.screenshot({ path: png });
  execFileSync('python3', ['-c', `from PIL import Image; im = Image.open(r'${png}').convert('RGB'); im.save(r'${path.join(OUT, nom + '.webp')}', 'WEBP', quality=82, method=6)`]);
  fs.unlinkSync(png);
  const v = p.viewportSize();
  frames[nom] = { img: `img/apercus/${nom}.webp`, w: v.width, h: v.height, boites };
  console.log('capture', nom, JSON.stringify(boites));
}

(async () => {
  const b = await chromium.launch();
  // 1. Chaque matin (RH, ordinateur)
  let p = await ouvrir(b, null);
  await cliche(p, 'matin-1', { roue: await boite(p, '.wheel-box'), aujourdhui: await boite(p, '.today') });
  await p.mouse.move(1000, 470); await p.waitForTimeout(1800);
  await cliche(p, 'matin-2', { toutVoir: await boite(p, '.today [data-act="todo-open"]'), roue: await boite(p, '.wheel-box') });
  await p.mouse.move(10, 10); await p.click('.today [data-act="todo-open"]'); await p.waitForTimeout(700);
  const conge = p.locator('.task:has-text("Congés payés du 26 oct.")').first();
  await conge.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  await cliche(p, 'matin-3', { tache: await boite(p, conge), bouton: await boite(p, conge.locator('[data-act="todo-do"]')), retard: await boite(p, '.task-g.u-late h3') });
  await conge.locator('[data-act="todo-do"]').click(); await p.waitForTimeout(900);
  // Le bouton « Valider » de la ligne de Hugo Laurent : le plus proche parent qui contient son nom.
  await p.evaluate(() => { const bs = [...document.querySelectorAll('#view button')].filter((x) => x.textContent.trim() === 'Valider');
    let best = null, bestD = 99; bs.forEach((x) => { let c = x, d = 0; while (c && d < 8 && !/Hugo Laurent/.test(c.textContent)) { c = c.parentElement; d++; } if (c && d < bestD) { best = x; bestD = d; } });
    best.setAttribute('data-cible', 'valider'); });
  const valider = p.locator('[data-cible="valider"]');
  await cliche(p, 'matin-4', { valider: await boite(p, valider) });
  await valider.click(); await p.waitForTimeout(500);
  const toast = p.locator('#toasts > *').first();
  console.log('message :', await toast.textContent().catch(() => '(aucun)'));
  await cliche(p, 'matin-5', { toast: await boite(p, toast) });
  await p.close();

  // 2. Les obligations (RH, effectif simulé à 52 avec la fonction de la démo)
  p = await ouvrir(b, { profile: 'rh', view: 'obligations' });
  await p.fill('#obl-sim-n', '52'); await p.selectOption('#obl-sim-s', '1an'); await p.click('[data-act="obl-sim"]'); await p.waitForTimeout(900);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.evaluate(() => {
    const kpi = [...document.querySelectorAll('#view *')].filter((x) => x.children.length && /^Effectif moyen \(12 mois\)/.test(x.textContent.trim()) && x.getBoundingClientRect().width < 400).pop();
    kpi.setAttribute('data-cible', 'effectif');
    const carte = [...document.querySelectorAll('#view .card')].find((c) => /^Alertes/.test(c.textContent.trim()));
    const b = [...carte.querySelectorAll('b, strong')].find((x) => /Index de l’égalité professionnelle/.test(x.textContent));
    let row = b; while (row && !row.querySelector('button')) row = row.parentElement;
    row.setAttribute('data-cible', 'index'); row.querySelector('button').setAttribute('data-cible', 'ouvrir');
  });
  const kpi = p.locator('[data-cible="effectif"]'), index = p.locator('[data-cible="index"]');
  await cliche(p, 'obligations-1', { effectif: await boite(p, kpi), index: await boite(p, index), ouvrir: await boite(p, '[data-cible="ouvrir"]') });
  await p.locator('[data-cible="ouvrir"]').click(); await p.waitForTimeout(900);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  await cliche(p, 'obligations-2', { onglet: await boite(p, '[aria-selected="true"], .tabs .on, .tab.on') });
  await p.close();

  // 3. Sur téléphone (salariée)
  p = await ouvrir(b, { profile: 'salarie' }, true);
  await cliche(p, 'telephone-1', { absence: await boite(p, '.mob-quick button >> nth=0'), bulletin: await boite(p, '.mob-quick button >> nth=1') });
  await p.locator('.mob-quick button').first().click(); await p.waitForTimeout(900);
  await cliche(p, 'telephone-2', {});
  await p.close();
  p = await ouvrir(b, { profile: 'salarie' }, true);
  await p.locator('.mob-quick button').nth(1).click(); await p.waitForTimeout(900);
  await cliche(p, 'telephone-3', {});
  await p.close();
  await b.close();
  fs.writeFileSync(path.join(OUT, 'images.js'), '// Généré par site/outils/apercus.js : captures de la démo et position des éléments (fractions de l’écran).\nwindow.TEAMORA_IMAGES = ' + JSON.stringify(frames, null, 1) + ';\n');
})();
