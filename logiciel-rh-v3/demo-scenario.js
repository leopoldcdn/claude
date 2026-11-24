// Teamora · démo : Nova Studio à la taille choisie par le visiteur (questionnaire du site ou questions posées à l'ouverture).
// Chargé par demo.html seulement : la version de travail garde ses 22 salariés et tous ses cas de test.
//
// Une base de 250 salariés fictifs : les 22 de Nova Studio (dont ceux qui portent les actions de la démo) puis 232 salariés
// générés de façon fixe (mêmes noms à chaque ouverture). Pour un effectif N, la démo garde les N premiers : d'abord les
// personnes concernées par une action « À traiter », puis les autres. Toutes les données sont fictives.
//
// « À traiter » est volontairement court : dix actions pour les RH, choisies parmi les plus fréquentes dans la vie d'un
// gestionnaire RH (congés, paie, arrêt de travail, arrivée, période d'essai, entretien professionnel, visite médicale,
// changement de RIB, candidature), plus une alerte liée à l'effectif. Tout le reste est à jour.
(function () {
  'use strict';
  // Tranche du questionnaire → effectif affiché.
  window.TEAMORA_DEMO_SIZES = { 0: 9, 11: 18, 20: 46, 50: 120, 250: 250 };
  window.TEAMORA_DEMO_POSTES = ['dirigeant', 'rh', 'manager', 'comptable'];

  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d || 1); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  // Générateur pseudo-aléatoire à graine fixe : la même entreprise à chaque ouverture.
  const rnd = (() => { let x = 20261006; return () => { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; }; })();
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const between = (a, b) => a + Math.floor(rnd() * (b - a + 1));

  // ---------------------------------------------------------------- Salariés générés
  const PRENOMS_F = ['Camille', 'Chloé', 'Inès', 'Manon', 'Sarah', 'Jade', 'Louise', 'Alice', 'Lina', 'Léna', 'Zoé', 'Juliette', 'Anaïs', 'Mathilde', 'Pauline', 'Margaux', 'Clémence', 'Élodie', 'Nina', 'Amandine',
    'Héloïse', 'Romane', 'Laura', 'Aurélie', 'Céline', 'Sophie', 'Émilie', 'Marion', 'Noémie', 'Agathe', 'Yasmine', 'Salomé', 'Océane', 'Eva', 'Charlotte', 'Fanny', 'Lucie', 'Justine', 'Maëlys', 'Amira',
    'Rose', 'Victoire', 'Hanna', 'Leïla', 'Mélissa', 'Ophélie', 'Elsa', 'Coralie', 'Estelle', 'Myriam'];
  const PRENOMS_H = ['Thibault', 'Antoine', 'Maxime', 'Julien', 'Nicolas', 'Romain', 'Clément', 'Adrien', 'Baptiste', 'Florian', 'Quentin', 'Guillaume', 'Alexis', 'Mathis', 'Raphaël', 'Bastien', 'Jérémy', 'Kevin', 'Samir', 'Yassine',
    'Arthur', 'Victor', 'Léo', 'Gabriel', 'Paul', 'Louis', 'Jules', 'Théo', 'Axel', 'Benjamin', 'Damien', 'Sébastien', 'Olivier', 'Vincent', 'Cédric', 'Mehdi', 'Ismaël', 'Rémi', 'Simon', 'Valentin',
    'Hugo', 'Matthieu', 'Pierre', 'Étienne', 'Martin', 'Loïc', 'Félix', 'Gaspard', 'Malik', 'Corentin'];
  const NOMS = ['Arnaud', 'Barbier', 'Benoît', 'Blanchard', 'Bonnet', 'Bourgeois', 'Boyer', 'Brun', 'Caron', 'Carpentier', 'Charpentier', 'Chevalier', 'Clément', 'Colin', 'Collet', 'Da Costa', 'Daniel', 'David', 'Delmas', 'Deschamps',
    'Durand-Fabre', 'Duval', 'Fabre', 'Faure', 'Fernandez', 'Fleury', 'Fournier', 'François', 'Gauthier', 'Gautier', 'Gérard', 'Gilbert', 'Giraud', 'Guérin', 'Guillaume', 'Hamon', 'Henry', 'Hoarau', 'Huet', 'Jacob',
    'Joly', 'Julien', 'Kaci', 'Lacroix', 'Lambert-Roy', 'Laporte', 'Leblanc', 'Lebrun', 'Leclerc', 'Lecomte', 'Lemaire', 'Lemoine', 'Leroux', 'Leroy', 'Lopez', 'Lucas', 'Mallet', 'Marchal', 'Marie', 'Martinez',
    'Masson-Rey', 'Mathieu', 'Mercier-Lenoir', 'Meunier', 'Meyer', 'Michel', 'Moulin', 'Muller', 'Nguyen', 'Nicolas', 'Noël', 'Olivier', 'Paris', 'Payet', 'Perrin', 'Philippe', 'Picard', 'Pierre', 'Poirier', 'Prévost',
    'Renard', 'Renaud', 'Rey', 'Rivière', 'Robert', 'Roche', 'Rolland', 'Roussel-Diaz', 'Roy', 'Sanchez', 'Schmitt', 'Simon', 'Tessier', 'Thomas', 'Vasseur', 'Vidal', 'Vincent', 'Weber', 'Zimmermann', 'Benhamou'];
  // Services : la répartition d'un studio de design et de développement qui grandit.
  const ORDRE = ['Tech', 'Design', 'Sales', 'Tech', 'Marketing', 'Tech', 'Design', 'Sales', 'Finance', 'Tech', 'Design', 'Sales', 'Tech', 'RH', 'Tech', 'Design', 'Marketing', 'Sales', 'Tech', 'Finance'];
  const METIERS = {
    Tech: { lead: ['Lead développeur', 'Lead développeuse'], postes: [['Développeur back-end', 'Développeuse back-end', 44000, 56000], ['Développeur front-end', 'Développeuse front-end', 42000, 54000], ['Ingénieur DevOps', 'Ingénieure DevOps', 50000, 62000], ['Ingénieur QA', 'Ingénieure QA', 40000, 50000], ['Technicien support', 'Technicienne support', 28000, 33000], ['Data analyst', 'Data analyst', 42000, 52000]] },
    Design: { lead: ['Lead designer', 'Lead designer'], postes: [['UX Designer', 'UX Designer', 40000, 50000], ['UI Designer', 'UI Designer', 38000, 47000], ['Product Designer', 'Product Designer', 45000, 56000], ['Motion designer', 'Motion designer', 36000, 44000], ['Graphiste', 'Graphiste', 30000, 36000]] },
    Sales: { lead: ['Responsable commercial', 'Responsable commerciale'], postes: [['Account Executive', 'Account Executive', 40000, 50000], ['Business Developer', 'Business Developer', 36000, 44000], ['Chargé de clientèle', 'Chargée de clientèle', 28000, 33000], ['Customer Success Manager', 'Customer Success Manager', 40000, 48000]] },
    Marketing: { lead: ['Responsable acquisition', 'Responsable acquisition'], postes: [['Chargé de communication', 'Chargée de communication', 32000, 38000], ['Content manager', 'Content manager', 34000, 40000], ['Chargé de marketing digital', 'Chargée de marketing digital', 34000, 41000]] },
    Finance: { lead: ['Responsable comptable', 'Responsable comptable'], postes: [['Comptable', 'Comptable', 34000, 40000], ['Assistant de gestion', 'Assistante de gestion', 28000, 32000], ['Contrôleur de gestion', 'Contrôleuse de gestion', 44000, 52000]] },
    RH: { lead: ['Responsable du développement RH', 'Responsable du développement RH'], postes: [['Chargé de recrutement', 'Chargée de recrutement', 36000, 42000], ['Gestionnaire paie et administration', 'Gestionnaire paie et administration', 32000, 38000], ['Assistant RH', 'Assistante RH', 28000, 32000]] },
  };
  const HEAD = { Tech: 'e6', Design: 'e2', Sales: 'e8', Marketing: 'e7', Finance: 'e9', RH: 'e1', Direction: 'e5' };
  // Embauche : jamais dans les fenêtres où un état des lieux à 8 ans tomberait aujourd'hui (il serait en retard ou imminent).
  const startDate = () => { for (;;) { const y = between(2012, 2025), d = `${y}-${pad(between(1, 12))}-${pad(between(1, 28))}`;
    if (d <= '2025-09-30' && !(d >= '2017-09-01' && d <= '2019-05-31') && !(d >= '2009-09-01' && d <= '2011-05-31')) return d; } };
  const iban = (id) => { const n = Number(id.slice(1)); return `FR76 3000 4028 ${String(1000 + n * 53).slice(-4)} ${String(2000 + n * 71).slice(-4)} 0${String(10 + n).slice(-2)}${String(1000 + n * 37).slice(-4).slice(0, 1)} ${String(1000 + n * 37).slice(-3)}`; };
  const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
  function salarie(id, o) {
    const cadre = o.salary >= 45000;
    return Object.assign({ id, phone: '06 12 34 56 78', address: '', emergency: '', status: null, exit: null, nationality: 'Française', zone: 'France', family: pick(['Célibataire', 'Célibataire', 'Marié·e', 'Pacsé·e']),
      titreEnd: null, endDate: null, cp: between(4, 22), rtt: between(1, 7), category: o.contract === 'Alternance' ? 'Employé' : cadre ? 'Cadre' : 'Employé', iban: iban(id),
      email: `${slug(o.firstName)}.${slug(o.lastName)}@novastudio.fr`, registeredAt: o.startDate, lastPro: `202${between(3, 5)}-${pad(between(1, 12))}-${pad(between(1, 28))}` },
    o, cadre && o.contract !== 'Alternance' ? { forfait: { date: o.startDate } } : {});
  }
  function generer() {
    const out = [], vus = new Set(['Olivia Bennett', 'Thomas Petit', 'Léa Martin', 'Hugo Laurent', 'Claire Durand', 'James Carter', 'Sofia Ramirez', 'Noah Williams', 'Emma Dubois', 'Lucas Silva', 'Inès Haddad', 'Marc Dupont', 'Sarah Cohen', 'Camille Roux', 'Jade Morin']);
    const lead = {}, n = {};
    let compte = 0;
    for (let k = 0; compte < 232; k++) {
      const dept = ORDRE[k % ORDRE.length], f = rnd() < 0.5;
      let first, last; do { first = pick(f ? PRENOMS_F : PRENOMS_H); last = pick(NOMS); } while (vus.has(`${first} ${last}`)); vus.add(`${first} ${last}`);
      const i = n[dept] = (n[dept] || 0) + 1, m = METIERS[dept], estLead = i % 9 === 1 && i > 1;
      // Une alternance de temps en temps (hors effectif) ; les autres en CDI, quelques CDD.
      const alt = !estLead && i % 17 === 5, p = pick(m.postes), id = `e${101 + out.length}`;
      const title = alt ? `Alternant${f ? 'e' : ''} ${dept === 'Tech' ? 'développement' : dept === 'Design' ? 'design' : dept === 'Sales' ? 'commercial' : dept === 'Marketing' ? 'marketing' : dept === 'Finance' ? 'comptabilité' : 'RH'}` : estLead ? m.lead[f ? 1 : 0] : p[f ? 1 : 0];
      const salary = alt ? between(14, 19) * 1000 : estLead ? between(56, 68) * 1000 : Math.round(between(p[2], p[3]) / 500) * 500;
      const e = salarie(id, { firstName: first, lastName: last, sex: f ? 'F' : 'H', title, dept, managerId: estLead ? HEAD[dept] : lead[dept] || HEAD[dept], stage: between(5, 11), startDate: alt ? `2025-09-${pad(between(1, 15))}` : startDate(),
        contract: alt ? 'Alternance' : rnd() < 0.06 ? 'CDD' : 'CDI', salary, location: dept === 'Tech' && rnd() < 0.4 ? 'Lyon' : 'Paris', birthDate: `${alt ? between(2002, 2006) : between(1966, 2000)}-${pad(between(1, 12))}-${pad(between(1, 28))}` });
      if (alt) e.endDate = '2027-08-31';
      if (e.contract === 'CDD') e.endDate = `2027-${pad(between(3, 9))}-30`;
      if (estLead) lead[dept] = id;
      out.push(e); if (!alt) compte++;
    }
    return out;
  }

  // ---------------------------------------------------------------- Construction d'un scénario
  // db : données de Nova Studio (TEAMORA_SEED) déjà normalisées par l'application ; sc = { effectif, poste }.
  window.TEAMORA_DEMO_SCENARIO = function (db, sc) {
    const N = sc.effectif, find = (id) => db.employees.find((e) => e.id === id), TODAY = window.TEAMORA_DEMO_DATE;
    const settle = (arr, id, o) => { const x = (arr || []).find((y) => y.id === id); if (x) Object.assign(x, o); return x; };

    // 1. Tout ce qui n'est pas une des dix actions est à jour.
    // Départs en cours : Mehdi et Yanis restent ; Clara, partie en 2025, a un dossier archivé.
    ['e16', 'e21'].forEach((id) => { Object.assign(find(id), { exit: null, stage: 7 }); delete db.offboarding[id]; delete db.journey[id]; });
    db.documents = db.documents.filter((d) => d.empId !== 'e21');
    Object.assign(db.offboarding.e20, { archivedAt: '2025-07-15', retentionOk: '2025-07-15', rehire: 'Oui' });
    db.offboarding.e20.requests.forEach((r) => { r.status = 'Traitée'; r.doneAt = '2026-10-01'; });
    find('e6').titreEnd = '2029-12-15';
    // Congés : une seule demande en attente (Hugo, Toussaint), envoyée vendredi dernier.
    settle(db.leaves, 'l2', { createdAt: '2026-10-02' }); ['l3', 'l4', 'l9'].forEach((id) => settle(db.leaves, id, { status: 'Approuvée' }));
    settle(db.notifications, 'n1', { date: '2026-10-02' }); db.notifications = db.notifications.filter((x) => !['n2', 'n4'].includes(x.id));
    db.timesheets.forEach((t) => { if (t.status === 'Soumise') Object.assign(t, { status: 'Validée', validatedAt: '2026-10-05', by: (find(t.empId) || {}).managerId || 'e1' }); });
    // Vie administrative : Léa change de banque (RIB à valider) ; la situation familiale de Hugo est déjà validée.
    const lea = find('e3');
    Object.assign(db.changeReqs.find((r) => r.id === 'cr1'), { field: 'iban', label: 'Coordonnées bancaires (RIB)', from: lea.iban, to: 'FR76 1027 8060 4100 0204 5560 128', proof: 'rib-martin.pdf', createdAt: '2026-10-03' });
    Object.assign(db.changeReqs.find((r) => r.id === 'cr2'), { status: 'Validée', decidedAt: '2026-10-02', by: 'e1' }); find('e4').family = 'Pacsé·e';
    // Rémunération : la campagne de révision 2027 n'est pas encore ouverte, les propositions déjà faites sont validées.
    db.raises.status = 'Préparation'; Object.values(db.raises.proposals).forEach((p) => { p.status = 'Validée'; });
    // Recrutement : les besoins en cours sont devenus des offres ou ont été traités ; une seule candidature à trier (UX Designer Senior).
    db.jobs = db.jobs.filter((j) => !['j4', 'j6', 'j7', 'j8', 'j10'].includes(j.id));
    db.candidates.forEach((c) => {
      if (c.id !== 'c3' && c.stage === 'Reçue') c.stage = 'Présélection';
      if (c.stage === 'Présélection' && !c.messages.some((m) => m.date >= '2026-10-01')) c.messages.push({ date: '2026-10-02', kind: 'info', subject: 'Votre candidature est à l’étude' });
      (c.interviews || []).forEach((iv) => { if (!iv.eval && iv.date.slice(0, 10) < TODAY) iv.eval = { date: iv.date.slice(0, 10), ratings: [4, 4, 3], evidence: ['Expérience solide sur le périmètre du poste.', 'Exemples concrets et chiffrés.', 'À approfondir lors de l’entretien suivant.'], reco: 'Favorable', comment: '' }; });
    });
    settle(db.enrollments, 'f3', { status: 'Validée' });
    db.wishes.forEach((w) => { if (w.status === 'Exprimé') Object.assign(w, { status: 'En étude', mgrOpinion: 'Favorable' }); });
    settle(db.incidents, 'i1', { status: 'Transmis CPAM', sentAt: '2026-10-03' });
    db.adjustments.forEach((a) => { if (a.status === 'Demandé') Object.assign(a, { status: 'Accordé', decidedAt: '2026-10-01' }); });
    db.cases.forEach((c) => { if (c.status === 'Ouvert') c.status = 'En cours'; });
    // Entretiens : celui d'Emma est planifié ; l'entretien professionnel de James est à planifier.
    settle(db.reviews, 'r3', { status: 'Planifié', date: '2026-11-24' });
    db.reviews.push({ id: 'r7', empId: 'e6', kind: 'Entretien professionnel', year: 2026, date: '2026-11-20', status: 'À planifier', self: null, mgr: null });
    settle(db.visits, 'v3', { date: '2026-02-24' });
    db.duerp.push({ date: '2026-09-14', by: 'e1', note: 'Mise à jour annuelle' });
    // Arrivées : Nathan arrive lundi (contrat envoyé, DPAE à faire) ; Aisha arrive le 2 novembre (dossier prêt).
    const ALL = (d) => ({ identite: d, secu: d, rib: d, domicile: d, diplome: d, titre: d });
    const PREP = (d) => ({ poste: d, ordinateur: d, comptes: d, badge: d, bienvenue: d });
    Object.assign(find('e18'), { startDate: '2026-10-12', stage: 2, registeredAt: null });
    db.onboarding.e18 = { docs: ALL('2026-09-25'), files: {}, contract: { status: 'Envoyé', sentAt: '2026-10-02' }, prep: PREP('2026-10-05'), plan: {}, checkins: {}, buddy: 'e13', mutuelle: 'Affiliation', prevoyance: true, assignedAt: '2026-10-05' };
    db.onboarding.e12 = { docs: ALL('2026-10-02'), files: {}, titreCheck: '2026-10-02', contract: { status: 'Signé', sentAt: '2026-10-01', signedAt: '2026-10-03' }, prep: PREP('2026-10-05'), plan: {}, checkins: {}, buddy: 'e4' };
    Object.assign(db.onboarding.e19.plan, { mission: '2026-09-17', formation: '2026-09-22' });
    // Jade, développeuse arrivée en juillet : sa visite d'information et de prévention est à organiser avant le 9 octobre.
    db.employees.push(salarie('e23', { firstName: 'Jade', lastName: 'Morin', sex: 'F', title: 'Développeuse back-end', dept: 'Tech', managerId: 'e6', stage: 5, startDate: '2026-07-09', contract: 'CDI', salary: 42000, location: 'Paris', birthDate: '1998-04-17', family: 'Célibataire', cp: 7, rtt: 2, lastPro: null }));

    // 2. Les salariés générés, et ceux que garde la démo (les N premiers dans l'ordre ci-dessous, hors alternants et stagiaires).
    const gen = generer();
    const ORDRE_BASE = ['e5', 'e1', 'e2', 'e3', 'e4', 'e10', 'e11', 'e6', 'e23', 'e13', 'e7', 'e8', 'e9', 'e14', 'e15', 'e17', 'e16', 'e21'];
    const counts = (e) => !['Stage', 'Alternance'].includes(e.contract);
    const keep = new Set(), present = ORDRE_BASE.map(find).concat(gen);
    let n = 0; for (const e of present) { if (n >= N && counts(e)) break; if (counts(e)) n++; keep.add(e.id); }
    // Alternante, stagiaire et ancienne salariée de Nova Studio : présentes dès que leur service l'est ; arrivées de Nathan et Aisha toujours.
    ['e19', 'e22'].forEach((id) => { if (keep.has(find(id).managerId) && N >= 18) keep.add(id); });
    if (N >= 18) keep.add('e20');
    keep.add('e18'); keep.add('e12');
    db.employees = db.employees.filter((e) => keep.has(e.id)).concat(gen.filter((e) => keep.has(e.id)));
    // À 46 salariés : deux autres recrues déjà prêtes portent l'effectif prévu à 50 en décembre.
    if (N === 46) [['e401', 'Romane', 'Fleury', 'F', 'Développeuse front-end', 'Tech', 'e6', '2026-11-16', 45000], ['e402', 'Valentin', 'Caron', 'H', 'Account Executive', 'Sales', 'e8', '2026-12-01', 44000]].forEach(([id, fn, ln, sex, title, dept, mgr, start, salary]) => {
      db.employees.push(salarie(id, { firstName: fn, lastName: ln, sex, title, dept, managerId: mgr, stage: 2, startDate: start, contract: 'CDI', salary, location: 'Paris', birthDate: '1994-06-12', registeredAt: null, lastPro: null }));
      db.onboarding[id] = { docs: ALL('2026-10-01'), files: {}, contract: { status: 'Signé', sentAt: '2026-09-28', signedAt: '2026-10-01' }, prep: PREP('2026-10-02'), plan: {}, checkins: {}, buddy: mgr };
    });
    // À partir de 120 salariés : deux départs de l'été, dossiers archivés (ils comptent dans l'effectif moyen des 12 derniers mois).
    if (N >= 120) [['e403', 'Florian', 'Gilbert', 'H', 'Développeur back-end', 'Tech', '2019-09-02', 47000], ['e404', 'Élodie', 'Vasseur', 'F', 'Chargée de clientèle', 'Sales', '2021-03-15', 31000]].forEach(([id, fn, ln, sex, title, dept, start, salary]) => {
      db.employees.push(salarie(id, { firstName: fn, lastName: ln, sex, title, dept, managerId: HEAD[dept], stage: 15, startDate: start, contract: 'CDI', salary, location: 'Paris', birthDate: '1990-02-02', exit: { reason: 'Démission', lastDay: '2026-08-31' }, lastPro: '2024-05-10' }));
      db.offboarding[id] = { notifiedAt: '2026-07-31', noticeOk: '2026-07-31', calcOk: '2026-08-20', returnPlan: '2026-08-21', docsReady: '2026-08-28', successor: HEAD[dept], transfer: { dossiers: '2026-08-25', acces: '2026-08-31', doc: '2026-08-31' },
        returned: { ordinateur: '2026-08-31', badge: '2026-08-31', telephone: '2026-08-31' }, accessOff: '2026-08-31', portability: '2026-08-31', docsGiven: '2026-08-31', dsnFin: '2026-09-02',
        exitInterview: { date: '2026-08-27', reason: 'Évolution de carrière', enps: 7, good: 'Bonne ambiance d’équipe.', improve: 'Plus de visibilité sur les évolutions.', back: 'Oui' }, archivedAt: '2026-09-15', retentionOk: '2026-09-15', requests: [], rehire: 'Oui' };
    });
    // Visites médicales des salariés générés : à jour (embauche récente ou visite périodique de moins de 5 ans).
    db.employees.filter((e) => /^e[1-4]\d\d$/.test(e.id) && e.stage !== 2).forEach((e, k) => {
      const d = e.startDate > '2021-12-31' ? e.startDate : `202${2 + (k % 4)}-${pad(1 + (k % 9))}-${pad(10 + (k % 15))}`;
      db.visits.push({ id: `vg${e.id}`, empId: e.id, kind: e.startDate > '2021-12-31' ? "Visite d'information et de prévention" : 'Visite périodique', date: d, status: 'Réalisée', result: 'Apte' });
    });
    // Personne ne rend compte à quelqu'un qui n'est pas dans l'entreprise choisie : sinon, à la direction.
    const ids = new Set(db.employees.map((e) => e.id));
    db.employees.forEach((e) => { if (e.managerId && !ids.has(e.managerId)) e.managerId = 'e5'; });
    const services = db.settings.services.filter((s) => db.employees.some((e) => e.dept === s.nom && e.stage < 15));
    services.forEach((s) => { if (!ids.has(s.head)) s.head = 'e5'; }); db.settings.services = services;
    // Données qui citent des personnes absentes de cette taille d'entreprise.
    const has = (id) => ids.has(id);
    ['leaves', 'reviews', 'objectives', 'enrollments', 'wishes', 'visits', 'incidents', 'adjustments', 'cases', 'documents', 'timesheets', 'changeReqs', 'history', 'survey'].forEach((k) => { db[k] = (db[k] || []).filter((x) => !x.empId || has(x.empId)); });
    db.feedback = db.feedback.filter((x) => has(x.from) && has(x.to));
    db.notifications = db.notifications.filter((x) => has(x.to));
    Object.keys(db.raises.proposals).forEach((id) => { if (!has(id)) delete db.raises.proposals[id]; });
    ['talent', 'succession', 'onboarding', 'offboarding', 'journey'].forEach((k) => { if (db[k]) Object.keys(db[k]).forEach((id) => { if (!has(id)) delete db[k][id]; }); });
    db.candidates.forEach((c) => (c.interviews || []).forEach((iv) => { if (iv.with && !has(iv.with)) iv.with = 'e1'; }));
    db.jobs.forEach((j) => { ['requestedBy', 'managerId'].forEach((f) => { if (j[f] && !has(j[f])) j[f] = 'e5'; }); j.reviewers = (j.reviewers || []).filter(has); });

    // 3. Effectif, historique et obligations selon la taille.
    const C = db.compliance, S = db.settings;
    S.effectifs = { 9: { 2021: 6, 2022: 7, 2023: 7, 2024: 8, 2025: 9 }, 18: { 2021: 12, 2022: 14, 2023: 15, 2024: 17, 2025: 18 }, 46: { 2021: 38, 2022: 41, 2023: 43, 2024: 45, 2025: 46 },
      120: { 2021: 104, 2022: 110, 2023: 115, 2024: 118, 2025: 120 }, 250: { 2021: 228, 2022: 236, 2023: 242, 2024: 248, 2025: 251 } }[N];
    const k = N / 46; S.finances = { 2023: { ca: Math.round(5400000 * k), res: Math.round(216000 * k) }, 2024: { ca: Math.round(6100000 * k), res: Math.round(305000 * k) }, 2025: { ca: Math.round(7000000 * k), res: Math.round(280000 * k) } };
    db.valueShare.years = db.valueShare.years.map(([y, ca, res]) => [y, Math.round(ca * N / 18), Math.round(res * N / 18)]);
    C.displays = { inspection: '2024-01-08', medecine: '2024-01-08', secours: '2024-01-08', harcelement: '2024-01-08', egalite: '2024-01-08', discrimination: '2024-01-08', horaires: '2024-01-08', convention: '2024-01-08', conges: '2026-02-02', tabac: '2024-01-08' };
    C.whistleOn = true; C.alerts = [];
    C.ri = { redaction: '2023-01-16', cse: '2023-02-14', greffe: '2023-02-27', inspection: '2023-02-27', affichage: '2023-03-01' };
    Object.assign(C.accords, { participation: '2023-06-12', restauration: '2023-01-09', penibilite: 'moins' });
    C.cse.consult = { 2026: { strategie: '2026-03-17', eco: '2026-06-16', social: '2026-09-15' } };
    if (N < 11) { C.cse.mandate = null; C.cse.members = []; C.cse.meetings = []; C.referents = {}; }
    else C.referents = { cse: 'e15' };
    if (N >= 250) C.index = { 2026: { publishedAt: '2026-02-26', score: 89 } };
    // Bénéficiaires de l'obligation d'emploi des travailleurs handicapés : 6 % de l'effectif.
    const pool = db.employees.filter((e) => /^e1\d\d$/.test(e.id) && counts(e) && e.stage < 15);
    C.rqth = pool.slice(0, Math.floor(N * 0.06) + 1).map((e, i) => ({ id: `rq${i + 1}`, empId: e.id, from: '2024-01-01', to: null }));
    // Sous 20 salariés, Olivia s'occupe aussi de l'administratif.
    if (N < 20) find('e1').title = 'Responsable administrative et RH';

    // 4. Le dirigeant voit Teamora sous les traits de la dirigeante : Claire prend la place du compte RH (e1), Olivia celle de e5.
    if (sc.poste === 'dirigeant') {
      const swap = (v) => (v === 'e1' ? 'e5' : v === 'e5' ? 'e1' : v);
      const walk = (o) => { if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) o[i] = typeof o[i] === 'object' && o[i] ? walk(o[i]) : swap(o[i]); return o; }
        if (o && typeof o === 'object') { const out = {}; Object.keys(o).forEach((key) => { const v = o[key]; out[swap(key)] = v && typeof v === 'object' ? walk(v) : swap(v); }); return out; } return o; };
      Object.keys(db).forEach((key) => { if (db[key] && typeof db[key] === 'object') db[key] = walk(db[key]); });
    }

    // 5. Paie d'octobre : les contrôles de routine sont vérifiés et les managers ont validé leurs variables, sauf Thomas.
    const pr = db.payroll['2026-10'] = Object.assign({ closed: false, bonus: {} }, db.payroll['2026-10'] || {});
    pr.acks = Object.assign({}, pr.acks); pr.mgrOk = Object.assign({}, pr.mgrOk);
    db.employees.forEach((e) => { ['tsmiss', 'conv', 'ecart'].forEach((t) => { pr.acks[`${t}-${e.id}`] = true; }); if (e.managerId && e.managerId !== 'e2') pr.mgrOk[e.managerId] = '2026-10-05'; });
    db.demo = { effectif: N, poste: sc.poste };
    return db;
  };
})();
