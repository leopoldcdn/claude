// Outils communs aux tests : navigateur, page de l'application à une date fixe, compteur OK / FAIL.
// Lancer un test : node tests/<fichier>.js (Playwright doit être installé ; il l'est dans les sessions cloud de Claude Code).
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('playwright-core')); }

// La démo Nova Studio se déroule toujours le 6 octobre 2026 (TEAMORA_DEMO_DATE). L'horloge du navigateur est figée au même
// jour par défaut ; « jour » la déplace, ce qui ne change que la date d'une « nouvelle entreprise » (date réelle).
const JOUR = '2026-10-06';
const fichier = (nom) => 'file://' + path.join(__dirname, '..', nom);

async function ouvrir(browser, { ui = null, largeur = 1440, hauteur = 900, mobile = false, page = 'index.html', jour = JOUR, visite = false } = {}) {
  const p = await browser.newPage({ viewport: { width: largeur, height: hauteur }, isMobile: mobile, hasTouch: mobile });
  p.erreurs = []; p.on('pageerror', (e) => p.erreurs.push(e.message));
  await p.clock.install({ time: new Date(`${jour}T09:00:00`) });
  await p.addInitScript(() => { window.TEAMORA_TEST = true; }); // expose window.__teamoraTest (dont today())
  await p.route(/fonts|cdnjs/, (r) => r.abort());
  await p.goto(fichier(page));
  await p.evaluate(([u, v]) => { localStorage.clear(); localStorage.setItem('teamora-v3-news', '1'); if (!v) localStorage.setItem('teamora-demo-tour', '1'); if (u) localStorage.setItem('teamora-ui-v3', JSON.stringify(u)); }, [ui, visite]);
  await p.reload(); await p.waitForTimeout(500);
  return p;
}

function compteur(nom) {
  let fail = 0, ok = 0;
  return { ok(cond, label) { if (cond) { ok++; console.log('OK  ', label); } else { fail++; console.log('FAIL', label); } },
    fin() { console.log(`${nom} : ${ok} OK, ${fail} FAIL`); process.exitCode = fail ? 1 : 0; } };
}

module.exports = { chromium, ouvrir, compteur, JOUR };
