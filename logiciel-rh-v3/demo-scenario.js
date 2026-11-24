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
  // Version des données de la démo : une démo enregistrée d'une version antérieure est refaite (mêmes réponses).
  // 2 : logo de Nova Studio dans Paramètres > Entreprise.
  window.TEAMORA_DEMO_VERSION = 2;

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
  // Logo de Nova Studio (charte : nova-studio/charte.html ; source : nova-studio/nova-studio-logo.svg).
  const LOGO_NOVA = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 284 64" width="568" height="128" role="img" aria-label="Nova Studio"><title>Nova Studio</title><g><rect width="64" height="64" rx="15" fill="#1C1A33"/><path d="M19.5 50V33.5a12.5 12.5 0 0 1 25 0V50" fill="none" stroke="#F25440" stroke-width="9"/><circle cx="32" cy="40" r="4.6" fill="#FFFFFF"/></g><path d="M82.52 45V27.14H86.98V29.48H87.63Q88.06 28.55 89.25 27.7Q90.44 26.86 92.85 26.86Q94.94 26.86 96.51 27.81Q98.07 28.76 98.94 30.44Q99.8 32.11 99.8 34.34V45H95.26V34.7Q95.26 32.69 94.27 31.68Q93.28 30.67 91.45 30.67Q89.36 30.67 88.21 32.06Q87.06 33.44 87.06 35.93V45Z M112.65 45.5Q109.99 45.5 107.86 44.42Q105.74 43.34 104.52 41.29Q103.29 39.24 103.29 36.36V35.78Q103.29 32.9 104.52 30.85Q105.74 28.8 107.86 27.72Q109.99 26.64 112.65 26.64Q115.32 26.64 117.44 27.72Q119.56 28.8 120.79 30.85Q122.01 32.9 122.01 35.78V36.36Q122.01 39.24 120.79 41.29Q119.56 43.34 117.44 44.42Q115.32 45.5 112.65 45.5ZM112.65 41.47Q114.74 41.47 116.11 40.12Q117.48 38.77 117.48 36.25V35.89Q117.48 33.37 116.13 32.02Q114.78 30.67 112.65 30.67Q110.56 30.67 109.2 32.02Q107.83 33.37 107.83 35.89V36.25Q107.83 38.77 109.2 40.12Q110.56 41.47 112.65 41.47Z M129.39 45 123.7 27.14H128.53L132.67 41.69H133.32L137.46 27.14H142.28L136.59 45Z M150.38 45.5Q148.47 45.5 146.96 44.84Q145.45 44.17 144.57 42.89Q143.68 41.62 143.68 39.78Q143.68 37.94 144.57 36.7Q145.45 35.46 147.01 34.83Q148.58 34.2 150.6 34.2H155.49V33.19Q155.49 31.93 154.7 31.12Q153.91 30.31 152.18 30.31Q150.49 30.31 149.66 31.09Q148.83 31.86 148.58 33.08L144.4 31.68Q144.84 30.31 145.79 29.18Q146.74 28.04 148.35 27.34Q149.95 26.64 152.25 26.64Q155.78 26.64 157.83 28.4Q159.88 30.17 159.88 33.52V40.18Q159.88 41.26 160.89 41.26H162.33V45H159.31Q157.98 45 157.11 44.35Q156.25 43.7 156.25 42.62V42.59H155.56Q155.42 43.02 154.92 43.72Q154.41 44.42 153.33 44.96Q152.25 45.5 150.38 45.5ZM151.17 41.83Q153.08 41.83 154.29 40.77Q155.49 39.71 155.49 37.94V37.58H150.92Q149.66 37.58 148.94 38.12Q148.22 38.66 148.22 39.64Q148.22 40.61 148.98 41.22Q149.73 41.83 151.17 41.83Z" fill="#1C1A33"/><path d="M182.2 45.5Q178.93 45.5 176.68 43.99Q174.43 42.48 173.96 39.2L176.66 38.59Q176.95 40.32 177.74 41.31Q178.53 42.3 179.7 42.71Q180.87 43.13 182.2 43.13Q184.18 43.13 185.34 42.34Q186.49 41.54 186.49 40.21Q186.49 38.84 185.39 38.29Q184.29 37.73 182.38 37.37L180.91 37.12Q179.22 36.83 177.81 36.22Q176.41 35.6 175.58 34.56Q174.75 33.52 174.75 31.93Q174.75 29.56 176.59 28.22Q178.42 26.89 181.45 26.89Q184.44 26.89 186.29 28.24Q188.14 29.59 188.68 32.04L186.02 32.72Q185.7 30.82 184.47 30.04Q183.25 29.27 181.45 29.27Q179.65 29.27 178.6 29.93Q177.56 30.6 177.56 31.9Q177.56 33.16 178.55 33.75Q179.54 34.34 181.2 34.63L182.67 34.88Q184.54 35.21 186.04 35.77Q187.53 36.32 188.41 37.37Q189.3 38.41 189.3 40.1Q189.3 42.7 187.37 44.1Q185.44 45.5 182.2 45.5Z M200.2 45Q198.69 45 197.88 44.17Q197.07 43.34 197.07 41.9V29.88H191.78V27.4H197.07V21.13H199.92V27.4H205.68V29.88H199.92V41.47Q199.92 42.55 200.96 42.55H204.88V45Z M216.66 45.32Q214.75 45.32 213.15 44.5Q211.54 43.67 210.63 42.03Q209.71 40.39 209.71 38.05V27.4H212.55V37.84Q212.55 40.46 213.87 41.65Q215.18 42.84 217.41 42.84Q219.93 42.84 221.55 41.18Q223.17 39.53 223.17 36.25V27.4H226.02V45H223.24V42.01H222.74Q222.16 43.27 220.76 44.3Q219.36 45.32 216.66 45.32Z M239.05 45.5Q236.78 45.5 234.87 44.42Q232.96 43.34 231.85 41.29Q230.73 39.24 230.73 36.43V35.96Q230.73 33.16 231.85 31.12Q232.96 29.09 234.85 27.99Q236.74 26.89 239.05 26.89Q240.88 26.89 242.16 27.38Q243.44 27.86 244.23 28.6Q245.02 29.34 245.46 30.17H245.96V19.8H248.8V45H246.03V42.08H245.53Q244.81 43.42 243.3 44.46Q241.78 45.5 239.05 45.5ZM239.8 42.98Q242.54 42.98 244.25 41.24Q245.96 39.49 245.96 36.36V36.04Q245.96 32.9 244.25 31.16Q242.54 29.41 239.8 29.41Q237.1 29.41 235.36 31.16Q233.61 32.9 233.61 36.04V36.36Q233.61 39.49 235.36 41.24Q237.1 42.98 239.8 42.98Z M254.42 45V27.4H257.26V45ZM255.86 24.66Q254.92 24.66 254.29 24.05Q253.66 23.44 253.66 22.5Q253.66 21.53 254.29 20.92Q254.92 20.3 255.86 20.3Q256.8 20.3 257.41 20.92Q258.02 21.53 258.02 22.5Q258.02 23.44 257.41 24.05Q256.8 24.66 255.86 24.66Z M271.02 45.5Q268.35 45.5 266.32 44.39Q264.28 43.27 263.15 41.24Q262.02 39.2 262.02 36.43V35.96Q262.02 33.23 263.15 31.18Q264.28 29.12 266.32 28.01Q268.35 26.89 271.02 26.89Q273.68 26.89 275.71 28.01Q277.75 29.12 278.88 31.18Q280.02 33.23 280.02 35.96V36.43Q280.02 39.2 278.88 41.24Q277.75 43.27 275.71 44.39Q273.68 45.5 271.02 45.5ZM271.02 42.95Q273.82 42.95 275.5 41.17Q277.17 39.38 277.17 36.36V36.04Q277.17 33.01 275.5 31.23Q273.82 29.45 271.02 29.45Q268.24 29.45 266.55 31.23Q264.86 33.01 264.86 36.04V36.36Q264.86 39.38 266.55 41.17Q268.24 42.95 271.02 42.95Z" fill="#F25440"/></svg>';
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

    // 2. Les salariés générés, et ceux que garde la démo : les N premiers dans l'ordre ci-dessous. Pas d'alternant ni de
    // stagiaire : les personnes présentes sont exactement l'effectif choisi (que l'annuaire, le reporting et les obligations affichent).
    const gen = generer();
    const ORDRE_BASE = ['e5', 'e1', 'e2', 'e3', 'e4', 'e10', 'e11', 'e6', 'e23', 'e13', 'e7', 'e8', 'e9', 'e14', 'e15', 'e17', 'e16', 'e21'];
    const counts = (e) => !['Stage', 'Alternance'].includes(e.contract);
    const keep = new Set(), present = ORDRE_BASE.map(find).concat(gen);
    for (const e of present) { if (keep.size >= N) break; if (counts(e)) keep.add(e.id); }
    // Ancienne salariée de Nova Studio (partie en 2025) dès 18 salariés ; arrivées de Nathan et Aisha toujours.
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

    // 3. Effectif, historique et obligations selon la taille ; le logo de Nova Studio en tête des documents.
    const C = db.compliance, S = db.settings;
    S.company.logo = 'data:image/svg+xml;base64,' + btoa(LOGO_NOVA);
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

    // 6. La démo vit à la date du jour : tout est recalé sur sc.today (voir recaler ci-dessous).
    const T = sc.today || TODAY;
    recaler(db, T, N);
    db.demo = { effectif: N, poste: sc.poste, built: T, v: window.TEAMORA_DEMO_VERSION };
    return db;
  };

  // ---------------------------------------------------------------- Recalage à la date du jour
  // Les données sont écrites pour le mardi 6 octobre 2026. Pour une autre date T :
  // - chaque date avance du nombre exact de jours qui séparent T de cette date : les échéances gardent leur distance à
  //   aujourd'hui (les dix actions restent les mêmes, avec la même urgence) ;
  // - les mois (paie, baromètre) avancent de mois entiers, les années (historique d'effectif, campagne) d'années entières ;
  // - congés, feuilles de temps, réunions, entretiens et visites gardent leur jour de la semaine (écart de 3 jours au plus) ;
  // - ce qui dépend du calendrier est replacé : arrivée de Nathan lundi prochain, autres recrues au mois où l'effectif
  //   franchit le seuil, clôture de la paie du mois en cours, publication de l'index ;
  // - les textes datés suivent (« fin novembre », « bulletin de septembre 2026 », « le 13 octobre »).
  const ANCRE = '2026-10-06';
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const jours = (a, b) => Math.round((parse(a) - parse(b)) / 864e5);
  const dow = (s) => parse(s).getDay();
  const addMonths = (s, n) => { const d = parse(s); d.setMonth(d.getMonth() + n); return iso(d); };
  const moisDe = (m, n) => { const d = new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)) - 1 + n, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
  // Fériés légaux (mêmes règles que l'application) : une arrivée ne tombe pas un jour férié.
  const paques = (y) => { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), n = h + l - 7 * m + 114;
    return `${y}-${pad(Math.floor(n / 31))}-${pad((n % 31) + 1)}`; };
  const ferie = (s) => { const y = Number(s.slice(0, 4)), p = paques(y); return ['01-01', '05-01', '05-08', '07-14', '08-15', '11-01', '11-11', '12-25'].includes(s.slice(5)) || [addDays(p, 1), addDays(p, 39), addDays(p, 50)].includes(s); };
  const ouvre = (s) => { let d = s; while (dow(d) === 0 || dow(d) === 6 || ferie(d)) d = addDays(d, 1); return d; };
  const lundiApres = (s) => addDays(s, ((8 - dow(s)) % 7) || 7);
  const fmtJour = (s) => `${Number(s.slice(8))}${s.slice(8) === '01' ? 'er' : ''} ${MOIS[Number(s.slice(5, 7)) - 1]}`;

  function recaler(db, T, N) {
    const D = jours(T, ANCRE), M = (Number(T.slice(0, 4)) * 12 + Number(T.slice(5, 7))) - (2026 * 12 + 10), Y = Number(T.slice(0, 4)) - 2026;
    const jour = (s) => addDays(s, D), mois = (s) => moisDe(s, M);
    // Textes : « 13 octobre » avance de D jours, « septembre 2026 » de M mois, « fin novembre » de M mois, « plan 2026 » de Y ans.
    const texte = (t) => t.replace(/(\b\d{1,2}(?:er)? )?\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b( \d{4})?|\b(20[12]\d)\b/g, (m0, j, mo, an, y) => {
      if (y) return String(Number(y) + Y);
      const k = MOIS.indexOf(mo), yy = an ? Number(an) : 2026;
      if (j) { const d = jour(`${yy}-${pad(k + 1)}-${pad(parseInt(j, 10))}`); return `${fmtJour(d)}${an ? ` ${d.slice(0, 4)}` : ''}`; }
      const m = moisDe(`${yy}-${pad(k + 1)}`, M); return `${MOIS[Number(m.slice(5)) - 1]}${an ? ` ${m.slice(0, 4)}` : ''}`;
    });
    const TEXTES = ['text', 'note', 'comment', 'notes', 'experience', 'detail', 'description', 'subject', 'title'];
    const val = (v, key) => {
      if (typeof v === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return jour(v);
        if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return jour(v.slice(0, 10)) + v.slice(10);
        if (/^\d{4}-\d{2}$/.test(v)) return mois(v);
        if (/^\d{4}-\d{2}:/.test(v)) return mois(v.slice(0, 7)) + v.slice(7);
        if (TEXTES.includes(key) && /\d{4}|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre/.test(v)) return texte(v);
        return v;
      }
      if (typeof v === 'number' && key === 'year') return v + Y;
      if (v && typeof v === 'object') return walk(v);
      return v;
    };
    const cle = (k) => (/^\d{4}-\d{2}$/.test(k) ? mois(k) : /^\d{4}$/.test(k) ? String(Number(k) + Y) : /_\d{4}-\d{2}-\d{2}$/.test(k) ? k.slice(0, -10) + jour(k.slice(-10)) : k);
    function walk(o) {
      if (Array.isArray(o)) return o.map((x) => val(x, null));
      const out = {}; Object.keys(o).forEach((k) => { out[cle(k)] = val(o[k], k); }); return out;
    }
    if (D) Object.keys(db).forEach((k) => { db[k] = val(db[k], k); });
    db.valueShare.years = db.valueShare.years.map(([y, ca, res]) => [Number(y) + Y, ca, res]);

    // Jour de la semaine conservé (décalage de 3 jours au plus) pour ce qui se planifie un jour précis.
    // futur : un rendez-vous qui était à venir le reste (une semaine plus tard s'il tombait aujourd'hui ou avant).
    const garde = (s, futur) => { if (!s || !D) return s; const d = s.slice(0, 10), avant = addDays(d, -D), k = ((dow(avant) - dow(d) + 10) % 7) - 3; let r = addDays(d, k);
      if (futur && avant > ANCRE && r <= T) r = addDays(r, 7); return r + s.slice(10); };
    const EXACTS = ['l2', 'l7'];
    db.leaves.forEach((l) => { if (EXACTS.includes(l.id)) return; const s = garde(l.start), k = jours(s, l.start); l.start = s; l.end = addDays(l.end, k); });
    db.timesheets.forEach((t) => { t.week = garde(t.week); });
    db.compliance.cse.meetings.forEach((x) => { x.date = garde(x.date); });
    db.candidates.forEach((c) => (c.interviews || []).forEach((iv) => { iv.date = garde(iv.date, true); }));
    db.reviews.forEach((r) => { if (r.date) r.date = garde(r.date, true); });
    db.visits.forEach((v) => { if (v.status === 'Planifiée') v.date = garde(v.date, true); });
    db.trainings.forEach((t) => { t.sessions = (t.sessions || []).map((x) => garde(x, true)); });
    const PLACES = ['e10', 'e12', 'e18', 'e19', 'e22', 'e23', 'e401', 'e402'];
    db.employees.forEach((e) => { if (!PLACES.includes(e.id) && e.stage !== 2) e.startDate = garde(e.startDate); });

    // Ce qui est passé depuis : entretiens évalués, visites faites.
    db.candidates.forEach((c) => (c.interviews || []).forEach((iv) => { if (!iv.eval && iv.date.slice(0, 10) < T) iv.eval = { date: iv.date.slice(0, 10), ratings: [4, 4, 3], evidence: ['Expérience solide sur le périmètre du poste.', 'Exemples concrets et chiffrés.', 'À approfondir lors de l’entretien suivant.'], reco: 'Favorable', comment: '' }; }));
    db.visits.forEach((v) => { if (v.status === 'Planifiée' && v.date < T) Object.assign(v, { status: 'Réalisée', result: 'Apte' }); });

    // Congés de Hugo : une semaine complète, du lundi au vendredi, environ trois semaines plus tard.
    const l2 = db.leaves.find((l) => l.id === 'l2');
    if (l2) { l2.start = garde(l2.start); l2.end = addDays(l2.start, 4); l2.comment = 'Congés';
      const n1 = db.notifications.find((n) => n.id === 'n1'); if (n1) n1.text = `Hugo Laurent demande 5 jours de congés payés du ${fmtJour(l2.start)} au ${fmtJour(l2.end)}.`; }
    db.leaves.forEach((l) => { if (/Toussaint|fin d’année/.test(l.comment || '')) l.comment = 'Congés'; });

    // Arrivées : Nathan lundi prochain ; Aisha (et, à 46 salariés, deux autres recrues) le mois où l'effectif franchit le seuil.
    const set = (id, o) => { const e = db.employees.find((x) => x.id === id); if (e) Object.assign(e, o); return e; };
    // (Si le lundi suivant est férié et tombe à plus de 7 jours, Nathan arrive dès le lendemain.)
    let nathan = ouvre(lundiApres(T)); if (jours(nathan, T) > 7) nathan = ouvre(addDays(T, 1)); set('e18', { startDate: nathan });
    const prochain = moisDe(T.slice(0, 7), 1), m = `${prochain}-01` > addDays(T, 7) ? prochain : moisDe(T.slice(0, 7), 2);
    const aisha = ouvre(lundiApres(addDays(`${m}-01`, -1)));
    [['e12', aisha], ['e401', addDays(aisha, 14)], ['e402', addDays(aisha, 21)]].forEach(([id, d]) => {
      if (!set(id, { startDate: d })) return;
      Object.assign(db.onboarding[id] = db.onboarding[id] || {}, { dpae: { date: addDays(T, -1), ref: `DPAE-${id.toUpperCase()}` }, mutuelle: 'Affiliation', prevoyance: true, assignedAt: addDays(T, -1) });
    });

    // Paie du mois en cours : clôture des variables le 20, ou au moins 10 jours plus tard.
    const pm = T.slice(0, 7), pr = db.payroll[pm];
    if (pr) { const vingt = `${pm}-20`; pr.cutoff = addDays(T, 10) > vingt ? addDays(T, 10) : vingt; }

    // Obligations datées de l'année en cours.
    const C = db.compliance, YEAR = String(T.slice(0, 4));
    const cons = C.cse.consult[YEAR]; if (cons) ['strategie', 'eco', 'social'].forEach((k, i) => { if (cons[k] > T) cons[k] = addDays(T, -10 * (3 - i)); });
    if (C.index[YEAR] && C.index[YEAR].publishedAt > T) C.index[YEAR].publishedAt = addDays(T, -10);
    // À 120 salariés, l'alerte porte sur l'index… sauf la dernière semaine avant le 1er mars : l'accord de participation prend le relais.
    if (N >= 50 && N < 250) { const due = `${Number(YEAR) + (T.slice(5) > '03-01' ? 1 : 0)}-03-01`;
      if (jours(due, T) <= 7) { C.index[YEAR] = { publishedAt: addDays(T, -3), score: 86 }; delete C.accords.participation; } }
  }
})();
