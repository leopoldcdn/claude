// Accueil « Aujourd'hui », liste « À traiter » classée par urgence, menu des rubriques. Sur la démo (46 salariés, vue du
// gestionnaire des RH, 6 octobre 2026) : dix actions, 1 en retard, 5 cette semaine, 4 plus tard.
const { chromium, ouvrir, compteur } = require('./outils');
(async () => {
  const b = await chromium.launch(), t = compteur('accueil_a_traiter');
  let p = await ouvrir(b);

  // 1. Accueil « Aujourd'hui » : 5 actions, les plus urgentes d'abord ; la roue, repliée au repos, se déploie au survol.
  const home = await p.evaluate(() => ({ lignes: [...document.querySelectorAll('.today .task')].map((x) => ({ texte: x.querySelector('.t b').textContent, date: x.querySelector('.due').textContent, classe: x.className })),
    resume: document.querySelector('.today-sum').textContent, jour: document.querySelector('.today-h small').textContent,
    noeuds: [...document.querySelectorAll('.node')].map((n) => getComputedStyle(n).opacity), labels: [...document.querySelectorAll('.lab-in')].map((l) => getComputedStyle(l).opacity), centreBouton: document.querySelector('.hub').tagName }));
  t.ok(home.lignes.length === 5, `5 actions sur l’accueil (${home.lignes.length})`);
  t.ok(/mardi 6 octobre/i.test(home.jour), `date du jour affichée : ${home.jour}`);
  t.ok(/u-late/.test(home.lignes[0].classe) && /retard de 1 jour/.test(home.lignes[0].date) && home.lignes.slice(1).every((x) => /u-week/.test(x.classe)), `les plus urgentes en premier : ${home.lignes[0].texte} · ${home.lignes[0].date}`);
  t.ok(/1 action en retard · 5 cette semaine · 4 plus tard/.test(home.resume), `résumé : ${home.resume}`);
  const roue = () => p.evaluate(() => ({ noeuds: [...document.querySelectorAll('.node')].map((n) => getComputedStyle(n).opacity), labels: [...document.querySelectorAll('.lab-in')].map((l) => getComputedStyle(l).opacity),
    focus: [...document.querySelectorAll('.node')].map((n) => n.tabIndex), centre: document.querySelector('.hub').getAttribute('aria-expanded'), aide: document.getElementById('wheel-hint').textContent }));
  t.ok(home.noeuds.length === 12 && home.noeuds.every((o) => o === '0') && home.labels.every((o) => o === '0') && home.centreBouton === 'BUTTON', 'au repos, la roue est repliée sur son centre');
  t.ok(/Survolez/.test((await roue()).aide), 'une aide invite à survoler la roue');
  await p.hover('.wheel-box', { position: { x: 30, y: 30 } }); await p.waitForTimeout(200);
  let r = await roue();
  t.ok(r.noeuds.every((o) => o === '1') && r.labels.every((o) => o === '1') && r.focus.every((x) => x === 0) && r.centre === 'true' && /Cliquez/.test(r.aide), 'au survol, la roue se déploie (12 rubriques et leurs noms)');
  await p.mouse.move(5, 880); await p.waitForTimeout(1000);
  r = await roue();
  t.ok(r.noeuds.every((o) => o === '0') && r.focus.every((x) => x === -1) && r.centre === 'false', 'la souris partie, la roue se replie');
  await p.click('.hub'); await p.waitForTimeout(600); // un toucher déclenche aussi le survol : le clic qui suit de près est ignoré
  t.ok((await roue()).noeuds.every((o) => o === '1'), 'un clic (ou un toucher) sur le centre la déploie');
  await p.click('.hub'); await p.waitForTimeout(700);
  t.ok((await roue()).noeuds.every((o) => o === '0'), 'un second clic sur le centre la replie');

  // 2. Pastilles : seulement les retards, et leur total égale le nombre d'actions en retard.
  const past = await p.evaluate(() => ({ roue: [...document.querySelectorAll('.node .badge')].map((x) => Number(x.textContent)), bouton: document.querySelector('.todo-btn').getAttribute('aria-label'), pastille: document.querySelector('.todo-btn .todo-n').textContent }));
  const retards = Number(/(\d+) en retard/.exec(past.bouton)[1]);
  t.ok(retards === 1 && past.pastille === '1', `bouton « À traiter » : ${past.bouton}`);
  await p.mouse.move(5, 880); await p.waitForTimeout(100);
  await p.hover('.wheel-box', { position: { x: 30, y: 30 } }); await p.waitForTimeout(150);
  await p.click('.node[data-i="6"]'); await p.waitForTimeout(200);
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
  t.ok(g[0].n === 1 && g[1].n === 5 && g[2].n === 4, 'répartition 1 / 5 / 4 (les dix actions de la démo)');
  t.ok(g.every((x) => x.lignes === x.boutons) && g[0].lignes === 1 && g[1].lignes === 5, 'une ligne et un bouton par action');
  t.ok(g[0].classes.join() === 'due u-late' && g[1].classes.join() === 'due u-week', 'chaque groupe ne contient que ses échéances');
  t.ok(g[2].lignes === 4 && !g[2].plus, '« Plus tard » : ses 4 actions affichées, rien à déplier');
  t.ok(await p.locator('.task:has-text("Paie d’octobre 2026")').count() === 1, 'la paie du mois compte pour une seule action');
  const nathan = await p.evaluate(() => [...document.querySelectorAll('.task')].filter((x) => /Nathan Lefebvre/.test(x.querySelector('.t small').textContent)).map((x) => x.querySelector('.t b').textContent));
  t.ok(nathan.length === 1 && /DPAE/.test(nathan[0]) && !/,/.test(nathan[0]), `la recrue Nathan Lefebvre : ${nathan.join(' | ')} (une ligne par action)`);

  // 5. Le bouton d'une action ouvre le bon écran.
  await p.click('.task:has-text("Nathan Lefebvre") [data-act="todo-do"] >> nth=0'); await p.waitForTimeout(300);
  t.ok(await p.locator('.top h1').textContent() === 'Arrivées' && /Nathan Lefebvre/.test(await p.locator('#view').innerText()) && await p.locator('[data-act="arr-dpae"]').count() === 1 && await p.locator('.modal-box').count() === 0, 'action d’arrivée : le dossier s’ouvre sur l’onglet de la DPAE');
  await p.click('.todo-btn'); await p.waitForTimeout(150);
  await p.click('.task:has-text("Seuil de 50 salariés") [data-act="todo-do"]'); await p.waitForTimeout(300);
  t.ok(await p.locator('.top h1').textContent() !== 'Arrivées', `obligation : ouvre l’écran « ${await p.locator('.top h1').textContent()} »`);
  await p.click('.todo-btn'); await p.waitForTimeout(150);
  await p.click('.task:has-text("Candidature à trier") [data-act="todo-do"] >> nth=0'); await p.waitForTimeout(400);
  t.ok(await p.locator('.top h1').textContent() === 'Recrutement' && await p.locator('.drawer').count() === 1, 'candidature : la fiche du candidat s’ouvre');
  t.ok(!p.erreurs.length, `GRH : aucune erreur de script ${p.erreurs.join(' | ')}`);
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
  await p.hover('.wheel-box', { position: { x: 30, y: 30 } }); await p.waitForTimeout(150);
  await p.click('.node >> nth=1'); await p.waitForTimeout(200);
  const sal = await p.evaluate(() => [...document.querySelectorAll('.rail-t')].map((x) => x.textContent));
  t.ok(sal.includes('Au quotidien') && !sal.includes('Piloter'), `salarié : familles ${sal.join(', ')}`);
  t.ok(!p.erreurs.length, 'salarié : aucune erreur'); await p.close();

  // 8. Visite guidée : elle présente « Aujourd'hui ».
  p = await ouvrir(b, { page: 'demo.html?effectif=20&poste=rh', visite: true }); await p.waitForTimeout(900);
  let vu = false; for (let k = 0; k < 14 && !vu; k++) { vu = /Aujourd’hui/.test(await p.locator('#tour').innerText()); if (!vu) { await p.click('#tour [data-tour="next"], #tour .btn.primary'); await p.waitForTimeout(250); } }
  t.ok(vu && !p.erreurs.length, 'démo : la visite guidée présente « Aujourd’hui »');
  await p.click('#tour [data-tour="next"]'); await p.waitForTimeout(900);
  const etape = await p.evaluate(() => ({ titre: document.getElementById('tour-t').textContent, noeuds: [...document.querySelectorAll('.node')].map((n) => getComputedStyle(n).opacity) }));
  t.ok(/roue/.test(etape.titre) && etape.noeuds.length && etape.noeuds.every((o) => o === '1'), `visite : l’étape « ${etape.titre} » déploie la roue`);
  await p.click('#tour [data-tour="next"]'); await p.waitForTimeout(300);
  t.ok(await p.evaluate(() => [...document.querySelectorAll('.node')].every((n) => getComputedStyle(n).opacity === '0')) && !p.erreurs.length, 'visite : à l’étape suivante, la roue se replie');
  await p.close();

  // 9. La démo vit à la date du jour : ouverte le 16 novembre, elle garde ses dix actions, recalées sur ce jour.
  p = await ouvrir(b, { jour: '2026-11-16' });
  const d = await p.evaluate(() => ({ jour: document.querySelector('.today-h small').textContent, resume: document.querySelector('.today-sum').textContent, etiquette: !!document.querySelector('.today-h .demo-day') }));
  t.ok(/16 novembre/i.test(d.jour) && !d.etiquette && /1 action en retard · 5 cette semaine · 4 plus tard/.test(d.resume), `ouverte le 16 novembre : ${d.jour} · ${d.resume}`);
  t.ok(!p.erreurs.length, 'le 16 novembre : aucune erreur'); await p.close();
  await b.close(); t.fin();
})();
