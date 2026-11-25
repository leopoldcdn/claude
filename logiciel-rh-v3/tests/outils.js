// Outils communs aux tests : navigateur, page de l'application à une date fixe, compteur OK / FAIL.
// Lancer un test : node tests/<fichier>.js (Playwright doit être installé ; il l'est dans les sessions cloud de Claude Code).
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('playwright-core')); }

// Les tests ouvrent la démo (seule version de Teamora) : Nova Studio à 46 salariés, vue du gestionnaire des RH.
// La démo vit à la date du jour : l'horloge du navigateur est figée au 6 octobre 2026 par défaut ; « jour » la déplace.
// « ui » choisit ensuite le profil (sélecteur de profil) et l'écran (menu), que la démo règle elle-même au chargement.
const JOUR = '2026-10-06';
const fichier = (nom) => 'file://' + path.join(__dirname, '..', nom);

async function ouvrir(browser, { ui = null, largeur = 1440, hauteur = 900, mobile = false, page = 'demo.html?effectif=20&poste=rh', jour = JOUR, visite = false } = {}) {
  const p = await browser.newPage({ viewport: { width: largeur, height: hauteur }, isMobile: mobile, hasTouch: mobile });
  p.erreurs = []; p.on('pageerror', (e) => p.erreurs.push(e.message));
  await p.clock.install({ time: new Date(`${jour}T09:00:00`) });
  await p.addInitScript(() => { window.TEAMORA_TEST = true; }); // expose window.__teamoraTest (dont today())
  await p.route(/fonts|cdnjs/, (r) => r.abort());
  await p.goto(fichier(page));
  await p.evaluate((v) => { localStorage.clear(); if (!v) localStorage.setItem('teamora-demo-tour', '1'); }, visite);
  await p.reload(); await p.waitForTimeout(500);
  if (ui) {
    // Sur téléphone, la démo s'ouvre déjà dans l'espace salarié (pas de sélecteur de profil dans le bandeau).
    const choix = `.persona [data-p="${ui.profile}"]`;
    if (ui.profile && ui.profile !== 'rh' && await p.locator(choix).count()) { await p.click(choix); await p.waitForTimeout(200); }
    if (ui.view && ui.view !== 'accueil') {
      await p.evaluate(([v, st]) => { const b = document.createElement('button'); if (st !== null && st !== undefined) { b.dataset.act = 'stage'; b.dataset.i = String(st); } else { b.dataset.act = 'go'; b.dataset.v = v; } document.body.appendChild(b); b.click(); b.remove(); }, [ui.view, ui.stage]);
      await p.waitForTimeout(200);
    }
  }
  return p;
}

function compteur(nom) {
  let fail = 0, ok = 0;
  return { ok(cond, label) { if (cond) { ok++; console.log('OK  ', label); } else { fail++; console.log('FAIL', label); } },
    fin() { console.log(`${nom} : ${ok} OK, ${fail} FAIL`); process.exitCode = fail ? 1 : 0; } };
}

module.exports = { chromium, ouvrir, compteur, JOUR };
