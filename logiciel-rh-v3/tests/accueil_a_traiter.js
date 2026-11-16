// Accueil « Aujourd'hui », liste « À traiter » classée par urgence, menu avec libellés.
const { chromium, ouvrir, compteur } = require('./outils');
(async () => {
  const b = await chromium.launch(), t = compteur('accueil_a_traiter');
  let p = await ouvrir(b);

  // 1. Accueil « Aujourd'hui » : 5 actions, les plus urgentes d'abord, la roue ouverte sans survol.
  const home = await p.evaluate(() => ({ lignes: [...document.querySelectorAll('.today .task')].map((x) => ({ texte: x.querySelector('.t b').textContent, date: x.querySelector('.due').textContent, classe: x.className })),
    resume: document.querySelector('.today-sum').textContent, jour: document.querySelector('.today-h small').textContent,
    noeuds: [...document.querySelectorAll('.node')].map((n) => getComputedStyle(n).opacity), labels: [...document.querySelectorAll('.lab-in')].map((l) => getComputedStyle(l).opacity), centreBouton: document.querySelector('.hub').tagName }));
  t.ok(home.lignes.length === 5, `5 actions sur l’accueil (${home.lignes.length})`);
  t.ok(/mardi 6 octobre/i.test(home.jour), `date du jour affichée : ${home.jour}`);
  t.ok(home.lignes.every((x) => /u-late/.test(x.classe)) && /retard de 219 jours/.test(home.lignes[0].date), `les plus en retard en premier : ${home.lignes[0].texte} · ${home.lignes[0].date}`);
  t.ok(/22 actions en retard · 19 cette semaine · 21 plus tard/.test(home.resume), `résumé : ${home.resume}`);
  t.ok(home.noeuds.length === 12 && home.noeuds.every((o) => o === '1') && home.labels.every((o) => o === '1'), 'la roue est ouverte dès l’arrivée (12 rubriques et leurs noms visibles)');
  t.ok(home.centreBouton === 'DIV', 'le centre de la roue ne replie plus le menu');

  // 2. Pastilles : seulement les retards, et leur total égale le nombre d'actions en retard.
  const past = await p.evaluate(() => ({ roue: [...document.querySelectorAll('.node .badge')].map((x) => Number(x.textContent)), bouton: document.querySelector('.todo-btn').getAttribute('aria-label'), pastille: document.querySelector('.todo-btn .todo-n').textContent }));
  const retards = Number(/(\d+) en retard/.exec(past.bouton)[1]);
  t.ok(retards === 22 && past.pastille === '22', `bouton « À traiter » : ${past.bouton}`);
  await p.click('.node[data-i="6"]', { force: true }); await p.waitForTimeout(200);
  const menu = await p.evaluate(() => ({ familles: [...document.querySelectorAll('.rail-t')].map((x) => x.textContent), items: [...document.querySelectorAll('.rail-i')].map((x) => ({ nom: x.querySelector('.rail-l').textContent.trim(), pastille: x.querySelector('.badge') ? Number(x.querySelector('.badge').textContent) : 0, courant: x.hasAttribute('aria-current') })) }));
  const somme = menu.items.reduce((s, x) => s + x.pastille, 0);
  t.ok(somme === retards, `total des pastilles du menu (${somme}) = actions en retard (${retards})`);
  t.ok(past.roue.reduce((s, x) => s + x, 0) + menu.items.find((x) => x.nom === 'Obligations').pastille === retards, 'pastilles de la roue + obligations = actions en retard');

  // 3. Menu : un nom par rubrique, quatre familles, la rubrique ouverte repérée.
  t.ok(menu.familles.join(',') === 'Recruter,Gérer,Développer,Départ,Piloter', `familles : ${menu.familles.join(', ')}`);
  t.ok(menu.items.length === 17 && menu.items.every((x) => x.nom.length > 3), `17 entrées, chacune avec son nom (${menu.items.map((x) => x.nom).join(', ')})`);
  t.ok(menu.items.filter((x) => x.courant).map((x) => x.nom).join() === 'Temps & absences', 'la rubrique ouverte est marquée');
  await p.click('.rail-i:has-text("Formation")'); await p.waitForTimeout(200);
  t.ok(await p.locator('.top h1').textContent() === 'Formation', 'un clic sur un nom ouvre la rubrique');
  t.ok(await p.evaluate(() => { const r = document.querySelector('.rail').getBoundingClientRect(), f = document.querySelector('.avis-fab').getBoundingClientRect(); return [...document.querySelectorAll('.rail-i')].every((x) => { const q = x.getBoundingClientRect(); return q.bottom <= f.top || q.top >= f.bottom || q.right <= f.left || q.bottom > r.bottom - 76; }); }), 'le bouton « Donner mon avis » ne recouvre aucune entrée du menu');

  // 4. « À traiter » : trois groupes, une ligne et un bouton par action.
  await p.click('.todo-btn'); await p.waitForTimeout(200);
  let g = await p.evaluate(() => [...document.querySelectorAll('.task-g')].map((s) => ({ titre: s.querySelector('h3').firstChild.textContent, n: Number(s.querySelector('.count').textContent), lignes: s.querySelectorAll('.task').length, boutons: s.querySelectorAll('.task [data-act="todo-do"]').length, classes: [...new Set([...s.querySelectorAll('.task .due')].map((d) => d.className))], plus: !!s.querySelector('[data-act="todo-all"]') })));
  t.ok(g.map((x) => x.titre).join(',') === 'En retard,Cette semaine,Plus tard', `groupes : ${g.map((x) => `${x.titre} ${x.n}`).join(' · ')}`);
  t.ok(g[0].n === 22 && g[1].n === 19 && g[2].n === 21, 'répartition 22 / 19 / 21 au 6 octobre 2026');
  t.ok(g.every((x) => x.lignes === x.boutons) && g[0].lignes === 22 && g[1].lignes === 19, 'une ligne et un bouton par action');
  t.ok(g[0].classes.join() === 'due u-late' && g[1].classes.join() === 'due u-week', 'chaque groupe ne contient que ses échéances');
  t.ok(g[2].lignes === 6 && g[2].plus, '« Plus tard » replié à 6 lignes');
  t.ok(await p.locator('.task:has-text("Paie d’octobre 2026")').count() === 1, 'la paie du mois compte pour une seule action');
  await p.click('[data-act="todo-all"]'); await p.waitForTimeout(150);
  t.ok(await p.locator('.task-g.u-later .task').count() === 21, '« Afficher les autres » déplie le groupe');
  const aisha = await p.evaluate(() => [...document.querySelectorAll('.task')].filter((x) => /Aisha Patel/.test(x.querySelector('.t small').textContent)).map((x) => x.querySelector('.t b').textContent));
  t.ok(aisha.length >= 4 && aisha.every((x) => !/,/.test(x)), `la recrue Aisha Patel a ${aisha.length} lignes séparées (plus de liste à virgules)`);

  // 5. Le bouton d'une action ouvre le bon écran.
  await p.click('.task:has-text("Aisha Patel") [data-act="todo-do"] >> nth=0'); await p.waitForTimeout(300);
  t.ok(await p.locator('.top h1').textContent() === 'Arrivées' && /Aisha Patel/.test(await p.locator('#view').innerText()) && await p.locator('.modal-box').count() === 0, 'action d’arrivée : le dossier de la personne s’ouvre');
  await p.click('.todo-btn'); await p.waitForTimeout(150);
  await p.click('.task:has-text("Document unique") [data-act="todo-do"]'); await p.waitForTimeout(300);
  t.ok(await p.locator('.top h1').textContent() !== 'Arrivées', `obligation : ouvre l’écran « ${await p.locator('.top h1').textContent()} »`);
  await p.click('.todo-btn'); await p.waitForTimeout(150);
  await p.click('.task:has-text("Candidature à trier") [data-act="todo-do"] >> nth=0'); await p.waitForTimeout(400);
  t.ok(await p.locator('.top h1').textContent() === 'Recrutement' && await p.locator('.drawer').count() === 1, 'candidature : la fiche du candidat s’ouvre');
  t.ok(!p.erreurs.length, `RH : aucune erreur de script ${p.erreurs.join(' | ')}`);
  await p.close();

  // 6. Écran plus étroit : le menu passe en bandeau, l'accueil empile les deux blocs.
  p = await ouvrir(b, { ui: { profile: 'rh', view: 'absences', stage: 6 }, largeur: 1200, hauteur: 800 });
  t.ok(await p.evaluate(() => { const r = document.querySelector('.rail').getBoundingClientRect(); return r.width > 1000 && r.height < 90 && document.documentElement.scrollWidth <= innerWidth + 2; }), 'à 1200 px : menu en bandeau horizontal, sans débordement de page');
  await p.close();
  p = await ouvrir(b, { largeur: 1100, hauteur: 800 });
  t.ok(await p.evaluate(() => document.querySelector('.today').getBoundingClientRect().bottom <= document.querySelector('.wheel-box').getBoundingClientRect().top), 'à 1100 px : « Aujourd’hui » au-dessus de la roue');
  await p.close();

  // 7. Manager et salarié : leurs propres actions, les familles nommées de leur point de vue.
  p = await ouvrir(b, { ui: { profile: 'manager' } });
  const mgr = await p.evaluate(() => ({ lignes: document.querySelectorAll('.today .task').length, bouton: document.querySelector('.todo-btn').getAttribute('aria-label') }));
  t.ok(mgr.lignes > 0 && mgr.lignes <= 5, `manager : ${mgr.lignes} actions sur l’accueil (${mgr.bouton})`);
  t.ok(!p.erreurs.length, 'manager : aucune erreur'); await p.close();
  p = await ouvrir(b, { ui: { profile: 'salarie' } });
  await p.click('.node >> nth=1', { force: true }); await p.waitForTimeout(200);
  const sal = await p.evaluate(() => [...document.querySelectorAll('.rail-t')].map((x) => x.textContent));
  t.ok(sal.includes('Au quotidien') && !sal.includes('Piloter'), `salarié : familles ${sal.join(', ')}`);
  t.ok(!p.erreurs.length, 'salarié : aucune erreur'); await p.close();

  // 8. Visite guidée de la démo : elle présente « Aujourd'hui ».
  p = await ouvrir(b, { page: 'demo.html', visite: true }); await p.waitForTimeout(900);
  let vu = false; for (let k = 0; k < 14 && !vu; k++) { vu = /Aujourd’hui/.test(await p.locator('#tour').innerText()); if (!vu) { await p.click('#tour [data-tour="next"], #tour .btn.primary'); await p.waitForTimeout(250); } }
  t.ok(vu && !p.erreurs.length, 'démo : la visite guidée présente « Aujourd’hui »');
  await p.close();

  // 9. La démo reste au 6 octobre 2026 quand la date réelle avance ; une « nouvelle entreprise » suit la date réelle.
  for (const page of ['index.html', 'demo.html']) {
    p = await ouvrir(b, { page, jour: '2026-11-16' });
    const d = await p.evaluate(() => ({ jour: document.querySelector('.today-h small').textContent, resume: document.querySelector('.today-sum').textContent, etiquette: !!document.querySelector('.today-h .demo-day') }));
    t.ok(/mardi 6 octobre 2026/i.test(d.jour) && d.etiquette && /22 actions en retard · 19 cette semaine · 21 plus tard/.test(d.resume), `${page} ouverte le 16 novembre : ${d.jour} · ${d.resume}`);
    if (page === 'demo.html') { t.ok(!p.erreurs.length, 'démo : aucune erreur'); await p.close(); }
  }
  p = await ouvrir(b, { jour: '2026-11-16' });
  await p.click('[data-act="tenant-new"]'); await p.click('[data-act="tenant-new-ok"]'); await p.waitForTimeout(300);
  const neuve = await p.evaluate(() => window.__teamoraTest.today());
  t.ok(neuve === '2026-11-16', `nouvelle entreprise : date réelle (${neuve})`);
  await p.click('[data-act="tenant-nova"] >> nth=0'); await p.waitForTimeout(300);
  const retour = await p.evaluate(() => ({ jour: window.__teamoraTest.today(), ecran: (document.querySelector('.today-h small') || {}).textContent || '' }));
  t.ok(retour.jour === '2026-10-06' && /mardi 6 octobre 2026/i.test(retour.ecran) && !p.erreurs.length, `retour à la démo : ${retour.jour} · ${retour.ecran}`);
  await b.close(); t.fin();
})();
