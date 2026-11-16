// Test de parcours : chaque profil ouvre l'accueil, « À traiter » et toutes ses rubriques, sans erreur ni écran vide.
const { chromium, ouvrir, compteur } = require('./outils');
(async () => {
  const b = await chromium.launch(), t = compteur('parcours');
  for (const profil of ['rh', 'manager', 'salarie']) {
    const p = await ouvrir(b, { ui: { profile: profil } });
    t.ok(await p.locator('.today').count() === 1 && await p.locator('.node').count() >= 2, `${profil} : accueil avec « Aujourd’hui » et la roue`);
    await p.click('.todo-btn'); await p.waitForTimeout(150);
    t.ok(await p.locator('.modal-box').count() === 1, `${profil} : « À traiter » s’ouvre`);
    await p.click('[data-act="modal-close"] >> nth=0'); await p.waitForTimeout(100);
    const n = await p.locator('.node').count(); let vides = [];
    for (let k = 0; k < n; k++) {
      await p.evaluate(() => document.querySelector('[data-act="go"][data-v="accueil"]').click()); await p.waitForTimeout(120);
      const nom = await p.locator('.node').nth(k).getAttribute('aria-label');
      await p.locator('.node').nth(k).click({ force: true }); await p.waitForTimeout(200);
      const etat = await p.evaluate(() => ({ texte: document.getElementById('view').innerText.trim().length, menu: !!document.querySelector('.rail [aria-current]'), large: document.documentElement.scrollWidth > innerWidth + 2 }));
      if (etat.texte < 20 || !etat.menu || etat.large) vides.push(`${nom} ${JSON.stringify(etat)}`);
    }
    t.ok(!vides.length, `${profil} : ${n} rubriques s’ouvrent, avec le menu, sans débordement horizontal ${vides.join(' | ')}`);
    if (profil === 'rh') for (const v of ['obligations', 'reporting', 'modeles', 'parametres']) {
      await p.click(`.rail [data-v="${v}"]`); await p.waitForTimeout(200);
      t.ok(await p.evaluate(() => document.getElementById('view').innerText.trim().length > 50) && await p.locator(`.rail [data-v="${v}"][aria-current]`).count() === 1, `rh : écran « ${v} » depuis le menu`);
    }
    t.ok(!p.erreurs.length, `${profil} : aucune erreur de script ${p.erreurs.join(' | ')}`);
    await p.close();
  }
  // Téléphone : l'espace salarié garde sa propre navigation.
  const m = await ouvrir(b, { ui: { profile: 'salarie' }, largeur: 390, hauteur: 844, mobile: true });
  t.ok(await m.locator('.mob-nav').count() === 1 && await m.locator('.rail').count() === 0 && !m.erreurs.length, 'téléphone : accueil salarié, sans menu latéral, sans erreur');
  // Version démo : elle se charge et la visite guidée démarre.
  const d = await ouvrir(b, { page: 'demo.html', visite: true }); await d.waitForTimeout(900);
  t.ok(await d.locator('#tour').count() === 1 && !d.erreurs.length, `démo : visite guidée lancée, sans erreur ${d.erreurs.join(' | ')}`);
  await b.close(); t.fin();
})();
