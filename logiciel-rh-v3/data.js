// Teamora — données de démonstration (toutes fictives).
// Chargées au premier lancement puis conservées dans le navigateur (localStorage).

window.TEAMORA_STAGES = [
  { short: 'Besoin RH', title: 'Expression du besoin RH', icon: 'target', module: 'recrutement',
    steps: ['Identification du besoin', 'Définition du poste et du profil recherché', 'Validation du besoin'] },
  { short: 'Recrutement', title: 'Recrutement', icon: 'search', module: 'recrutement',
    steps: ["Publication de l'offre", 'Réception et sélection des candidatures', 'Entretiens et évaluations', 'Choix du candidat', "Proposition d'embauche"] },
  { short: 'Pré-embauche', title: 'Pré-embauche', icon: 'docCheck', module: 'collaborateurs',
    steps: ['Collecte des informations et documents nécessaires', 'Établissement et signature du contrat', "Préparation de l'arrivée"] },
  { short: 'Embauche', title: 'Embauche', icon: 'idCard', module: 'collaborateurs',
    steps: ["Formalités d'embauche", 'Création du dossier administratif', 'Affectation au poste, au service et au manager', "Mise en place des dispositifs liés à l'emploi"] },
  { short: 'Intégration', title: 'Intégration / Onboarding', icon: 'rocket', module: 'collaborateurs',
    steps: ['Accueil du collaborateur', "Présentation de l'entreprise et de l'équipe", 'Prise en main du poste et des outils', 'Formation initiale', "Suivi de l'intégration", "Fin de période d'essai"] },
  { short: 'Vie administrative', title: 'Vie administrative du collaborateur', icon: 'folder', module: 'collaborateurs',
    steps: ['Gestion du contrat et des avenants', 'Mise à jour de la situation personnelle et professionnelle', 'Gestion des documents RH', 'Suivi des changements de situation'] },
  { short: 'Temps & absences', title: 'Temps de travail et absences', icon: 'clock', module: 'absences',
    steps: ['Gestion du temps de travail', 'Congés et RTT', 'Absences et arrêts', 'Télétravail et autres modalités de travail'] },
  { short: 'Rémunération', title: 'Rémunération et avantages', icon: 'euro', module: 'paie',
    steps: ['Salaire et évolution de la rémunération', 'Primes et variables', 'Avantages sociaux', 'Épargne salariale et dispositifs collectifs'] },
  { short: 'Performance', title: 'Performance et entretiens', icon: 'star', module: 'entretiens',
    steps: ['Fixation des objectifs', 'Entretiens de suivi', 'Entretien annuel', 'Entretien professionnel', 'Évaluation et feedback'] },
  { short: 'Formation', title: 'Formation et développement des compétences', icon: 'cap', module: 'formation',
    steps: ['Identification des besoins', 'Planification des formations', 'Réalisation et suivi des formations', 'Évaluation des acquis', 'Développement des compétences'] },
  { short: 'Mobilité', title: 'Mobilité et évolution professionnelle', icon: 'trend', module: 'mobilite',
    steps: ["Identification des souhaits d'évolution", 'Mobilité interne', 'Changement de poste ou de responsabilités', 'Évolution de carrière'] },
  { short: 'Santé & QVT', title: 'Santé, sécurité et qualité de vie au travail', icon: 'heart', module: 'sante',
    steps: ['Suivi de la santé au travail', 'Prévention des risques', 'Accidents et incidents', 'Aménagements éventuels du poste', 'Actions de qualité de vie et des conditions de travail'] },
  { short: 'Relations indiv.', title: 'Relations individuelles et disciplinaires', icon: 'chat', module: 'relations',
    steps: ['Gestion des situations individuelles', 'Entretiens et échanges avec le collaborateur', 'Mesures disciplinaires éventuelles', 'Suivi des procédures'] },
  { short: 'Prépa. départ', title: 'Préparation du départ', icon: 'hourglass', module: 'collaborateurs',
    steps: ['Identification du motif de départ', 'Gestion du préavis', 'Organisation de la fin de contrat', 'Préparation des documents de sortie', 'Organisation de la restitution du matériel et des accès'] },
  { short: 'Départ', title: 'Départ / Offboarding', icon: 'door', module: 'collaborateurs',
    steps: ['Entretien de départ', 'Transmission des dossiers et connaissances', 'Restitution du matériel', 'Fin des accès et des dispositifs', 'Remise des documents de fin de contrat'] },
  { short: 'Après le départ', title: 'Après le départ', icon: 'archive', module: 'collaborateurs',
    steps: ['Archivage du dossier', 'Conservation des documents selon les obligations applicables', 'Gestion des demandes postérieures au départ', "Possibilité de réembauche ou de maintien du lien avec l'ancien collaborateur"] },
];

window.TEAMORA_SEED = function () {
  const E = (id, firstName, lastName, title, dept, managerId, stage, startDate, contract, salary, extra = {}) => ({
    id, firstName, lastName, title, dept, managerId, stage, startDate, contract, salary,
    email: `${firstName}.${lastName}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z.]/g, '') + '@novastudio.fr',
    phone: extra.phone || '06 12 34 56 78', location: extra.location || 'Paris', birthDate: extra.birthDate || '1990-01-01',
    address: extra.address || '', emergency: extra.emergency || '',
    cp: extra.cp ?? 18, rtt: extra.rtt ?? 6, status: extra.status || null, exit: extra.exit || null,
    category: extra.category || (contract === 'Alternance' ? 'Employé' : salary >= 45000 ? 'Cadre' : 'Employé'), nationality: extra.nationality || 'Française', zone: extra.zone || 'France',
    registeredAt: stage >= 3 ? startDate : null, family: extra.family || 'Célibataire', iban: `FR76 •••• •••• •••• ${String(1000 + Number(id.slice(1)) * 37).slice(-4)}`,
    titreEnd: extra.titreEnd || null, endDate: extra.endDate || null,
  });
  const employees = [
    E('e1', 'Olivia', 'Bennett', 'Responsable RH', 'RH', 'e5', 7, '2019-01-14', 'CDI', 62000, { phone: '06 21 44 18 90', cp: 21, rtt: 7 }),
    E('e2', 'Thomas', 'Petit', 'Manager Design', 'Design', 'e5', 8, '2020-03-02', 'CDI', 68000, { phone: '06 33 10 72 41', cp: 15, rtt: 5 }),
    E('e3', 'Léa', 'Martin', 'UX Designer', 'Design', 'e2', 6, '2024-11-04', 'CDI', 41400, { phone: '06 48 25 61 07', address: '18 rue des Martyrs, 75009 Paris', emergency: 'Julien Martin · 06 11 22 33 44', cp: 20, rtt: 6, birthDate: '1996-05-12' }),
    E('e4', 'Hugo', 'Laurent', 'Senior Product Designer', 'Design', 'e2', 9, '2021-09-06', 'CDI', 54000, { cp: 12, rtt: 4 }),
    E('e5', 'Claire', 'Durand', 'Directrice générale', 'Direction', null, 7, '2017-06-01', 'CDI', 120000, { cp: 25, rtt: 8 }),
    E('e6', 'James', 'Carter', 'Lead Developer', 'Tech', 'e5', 8, '2020-06-22', 'CDI', 72000, { location: 'Lyon', cp: 9, rtt: 3 }),
    E('e7', 'Sofia', 'Ramirez', 'Responsable marketing', 'Marketing', 'e5', 6, '2021-02-01', 'CDI', 58000, { cp: 4, rtt: 2 }),
    E('e8', 'Liam', 'O’Connor', 'Account Executive', 'Sales', 'e5', 7, '2022-02-14', 'CDI', 46000, { cp: 16, rtt: 6 }),
    E('e9', 'Noah', 'Williams', 'Contrôleur de gestion', 'Finance', 'e5', 5, '2021-11-15', 'CDI', 52000, { cp: 19, rtt: 6 }),
    E('e10', 'Emma', 'Dubois', 'Brand Designer', 'Design', 'e2', 4, '2026-08-31', 'CDI', 43000, { cp: 3, rtt: 1 }),
    E('e11', 'Lucas', 'Silva', 'Ingénieur DevOps', 'Tech', 'e6', 10, '2022-07-04', 'CDI', 61000, { location: 'Lyon', cp: 14, rtt: 5 }),
    E('e12', 'Aisha', 'Patel', 'UX Researcher', 'Design', 'e2', 2, '2026-11-02', 'CDI', 45000, { cp: 0, rtt: 0 }),
    E('e13', 'Inès', 'Haddad', 'Développeuse front-end', 'Tech', 'e6', 6, '2023-04-03', 'CDI', 47000, { cp: 11, rtt: 5 }),
    E('e14', 'Marc', 'Dupont', 'Chargé de recrutement', 'RH', 'e1', 8, '2022-10-10', 'CDI', 42000, { cp: 17, rtt: 6 }),
    E('e15', 'Sarah', 'Cohen', 'Comptable', 'Finance', 'e9', 11, '2020-01-06', 'CDI', 44000, { cp: 22, rtt: 6 }),
    E('e16', 'Yanis', 'Morel', 'Business Developer', 'Sales', 'e8', 13, '2023-09-04', 'CDI', 40000, { cp: 8, rtt: 3, exit: { reason: 'Démission', lastDay: '2026-11-27' } }),
    E('e17', 'Camille', 'Roux', 'Office Manager', 'RH', 'e1', 12, '2021-05-17', 'CDI', 36000, { cp: 13, rtt: 5 }),
    E('e18', 'Nathan', 'Lefebvre', 'Développeur back-end', 'Tech', 'e6', 2, '2026-10-01', 'CDI', 46000, { cp: 0, rtt: 0 }),
    E('e19', 'Julie', 'Bernard', 'Alternante marketing', 'Marketing', 'e7', 4, '2026-09-07', 'Alternance', 21000, { cp: 2, rtt: 0 }),
    E('e20', 'Clara', 'Fontaine', 'Product Designer', 'Design', 'e2', 15, '2021-01-04', 'CDI', 47000, { cp: 0, rtt: 0, exit: { reason: 'Démission', lastDay: '2025-06-30' } }),
    E('e21', 'Mehdi', 'Bouaziz', 'Key Account Manager', 'Sales', 'e8', 14, '2021-03-01', 'CDI', 48000, { cp: 9, rtt: 2, exit: { reason: 'Rupture conventionnelle', lastDay: '2026-10-09' } }),
    // V2 : une stagiaire, pour montrer une arrivée sans contrat de travail ni période d'essai.
    E('e22', 'Maëlle', 'Roussel', 'Stagiaire UX research', 'Design', 'e2', 4, '2026-09-14', 'Stage', 7920, { cp: 0, rtt: 0, endDate: '2027-02-26' }),
  ];
  // Sexe (mention obligatoire du registre unique du personnel) et nationalités particulières.
  const MALE = ['e2', 'e4', 'e6', 'e8', 'e9', 'e11', 'e14', 'e16', 'e18', 'e21'];
  employees.forEach((e) => { e.sex = MALE.includes(e.id) ? 'H' : 'F'; });
  Object.assign(employees.find((e) => e.id === 'e12'), { nationality: 'Indienne', zone: 'Hors UE', birthDate: '1995-03-21' });
  Object.assign(employees.find((e) => e.id === 'e6'), { nationality: 'Britannique', zone: 'Hors UE' });
  Object.assign(employees.find((e) => e.id === 'e5'), { birthDate: '1981-03-14' });
  Object.assign(employees.find((e) => e.id === 'e9'), { birthDate: '1967-11-02' });
  Object.assign(employees.find((e) => e.id === 'e8'), { nationality: 'Irlandaise', zone: 'UE' });
  Object.assign(employees.find((e) => e.id === 'e7'), { nationality: 'Espagnole', zone: 'UE' });
  employees.find((e) => e.id === 'e18').registeredAt = null;
  Object.assign(employees.find((e) => e.id === 'e6'), { titreEnd: '2026-12-15' });
  Object.assign(employees.find((e) => e.id === 'e12'), { titreEnd: '2027-09-30' });
  Object.assign(employees.find((e) => e.id === 'e19'), { endDate: '2028-08-31' });
  Object.assign(employees.find((e) => e.id === 'e3'), { family: 'Pacsé·e' });
  // Vie administrative : demandes de modification soumises à validation RH.
  const changeReqs = [
    { id: 'cr1', empId: 'e3', field: 'address', label: 'Adresse postale', from: '18 rue des Martyrs, 75009 Paris', to: '7 avenue Jean Jaurès, 75019 Paris', proof: 'justificatif-domicile.pdf', status: 'En attente', createdAt: '2026-10-03' },
    { id: 'cr2', empId: 'e4', field: 'family', label: 'Situation familiale', from: 'Célibataire', to: 'Pacsé·e', proof: 'attestation-pacs.pdf', status: 'En attente', createdAt: '2026-10-01' },
  ];
  // Temps de travail : feuilles de temps hebdomadaires des salariés en heures (les cadres sont au forfait de 218 jours).
  const T = (id, empId, week, hours, status, extra = {}) => Object.assign({ id, empId, week, hours, status, submittedAt: status !== 'Brouillon' ? week : null }, extra);
  const timesheets = [
    T('t1', 'e3', '2026-09-21', [7.5, 8, 7.5, 8, 7, 0], 'Validée', { validatedAt: '2026-09-28', by: 'e2' }),
    T('t2', 'e3', '2026-09-28', [8, 9, 8.5, 8, 7.5, 0], 'Soumise'),
    T('t3', 'e10', '2026-09-28', [7.5, 7.5, 8, 7.5, 7, 0], 'Soumise'),
    T('t4', 'e14', '2026-09-21', [9, 9.5, 9, 9, 8, 0], 'Validée', { validatedAt: '2026-09-28', by: 'e1' }),
    T('t5', 'e14', '2026-09-28', [11, 9.5, 10, 9.5, 7, 0], 'Soumise'),
    T('t6', 'e15', '2026-09-28', [7, 7, 7, 7, 7, 0], 'Validée', { validatedAt: '2026-10-02', by: 'e9' }),
  ];
  // Rémunération : campagne de révision salariale et partage de la valeur.
  const raises = { year: 2027, budgetPct: 3, effective: '2027-01-01', deadline: '2026-11-13', status: 'Ouverte', proposals: {
    e4: { pct: 4, reason: 'Performance', by: 'e2', status: 'Proposée', date: '2026-10-02' },
    e3: { pct: 3, reason: 'Performance', by: 'e2', status: 'Proposée', date: '2026-10-02' },
    e13: { pct: 2.5, reason: 'Marché', by: 'e6', status: 'Validée', date: '2026-09-30' },
    e15: { pct: 4.5, reason: 'Rattrapage égalité', by: 'e9', status: 'Proposée', date: '2026-10-01' } } };
  const valueShare = { years: [[2023, 1800000, 40000], [2024, 2100000, 52000], [2025, 2400000, 61000]], total: 12000, rule: 'salaire', paidMonth: null };
  const payInfoReqs = [];
  // Départs : dossiers de préparation, de départ et d'après-départ.
  const offboarding = {
    e16: { notifiedAt: '2026-09-28' },
    e21: { notifiedAt: '2026-08-25', rc: { interview: '2026-08-25', signed: '2026-08-28' }, noticeOk: '2026-08-28', calcOk: '2026-09-01', returnPlan: '2026-09-15', docsReady: '2026-10-01' },
    e20: { notifiedAt: '2025-04-28', noticeOk: '2025-04-28', calcOk: '2025-06-01', returnPlan: '2025-06-02', docsReady: '2025-06-25', successor: 'e4', transfer: { dossiers: '2025-06-20', acces: '2025-06-27', doc: '2025-06-27' },
      returned: { ordinateur: '2025-06-30', badge: '2025-06-30', telephone: '2025-06-30' }, accessOff: '2025-06-30', portability: '2025-06-30', docsGiven: '2025-06-30',
      exitInterview: { date: '2025-06-20', reason: 'Évolution de carrière', enps: 8, good: 'Équipe bienveillante et projets variés.', improve: 'Peu de perspectives vers le management.', back: 'Oui' },
      requests: [{ id: 'pr1', kind: 'attestation', label: 'Attestation employeur', date: '2026-09-30', status: 'En attente' }] },
  };
  // Revue des talents (performance × potentiel) et plan de succession des postes clés.
  const talent = { e4: { pot: 3, risk: 'Moyen' }, e13: { pot: 3, risk: 'Faible' }, e3: { pot: 2, risk: 'Faible' }, e14: { pot: 2, risk: 'Élevé' }, e11: { pot: 2, risk: 'Moyen' } };
  const succession = { e2: { succ: 'e4', ready: 'D’ici 1 à 2 ans' }, e6: { succ: 'e13', ready: 'D’ici 3 ans ou plus' }, e1: { succ: null, ready: null } };
  const duerp = [{ date: '2024-09-12', by: 'e1', note: 'Mise à jour annuelle' }, { date: '2025-09-15', by: 'e1', note: 'Mise à jour annuelle · ajout du risque routier' }];
  // Dossiers d'arrivée (pré-embauche, embauche, intégration) des recrues en cours.
  const ALLDOCS = (d) => ({ identite: d, secu: d, rib: d, domicile: d, diplome: d });
  const onboarding = {
    e12: { docs: { identite: '2026-10-02', rib: '2026-10-02' }, files: { identite: { name: 'passeport-patel.pdf', date: '2026-10-01' }, rib: { name: 'rib-patel.pdf', date: '2026-10-01' }, secu: { name: 'attestation-vitale.pdf', date: '2026-10-05' } }, titreCheck: null, contract: { status: 'À préparer' }, prep: {}, buddy: null },
    e18: { docs: ALLDOCS('2026-09-15'), contract: { status: 'Signé', sentAt: '2026-09-18', signedAt: '2026-09-22' }, prep: { poste: '2026-09-25', ordinateur: '2026-09-29', comptes: '2026-09-29', badge: '2026-09-30', bienvenue: '2026-09-26' }, buddy: 'e13',
      dpae: { date: '2026-09-28', ref: 'DPAE-75-2026-0918' } },
    e10: { docs: ALLDOCS('2026-08-10'), contract: { status: 'Signé', sentAt: '2026-08-05', signedAt: '2026-08-07' }, prep: { poste: '2026-08-25', ordinateur: '2026-08-28', comptes: '2026-08-28', badge: '2026-08-28', bienvenue: '2026-08-26' }, buddy: 'e4',
      dpae: { date: '2026-08-26', ref: 'DPAE-75-2026-0831' }, info7: '2026-09-02', info1m: '2026-09-21', mutuelle: 'Affiliation', prevoyance: true, assignedAt: '2026-08-31',
      plan: { accueil: '2026-08-31', materiel: '2026-08-31', entreprise: '2026-09-02', equipe: '2026-09-04', mission: '2026-09-11', formation: '2026-09-18' },
      checkins: { j30: { date: '2026-09-30', note: 'Bonne prise en main des outils, autonome sur les supports print. À accompagner sur le design system.' } } },
    e19: { docs: ALLDOCS('2026-08-20'), contract: { status: 'Signé', sentAt: '2026-08-21', signedAt: '2026-08-25' }, prep: { poste: '2026-09-03', ordinateur: '2026-09-04', comptes: '2026-09-04', badge: '2026-09-04', bienvenue: '2026-09-01' }, buddy: 'e17',
      dpae: { date: '2026-09-01', ref: 'DPAE-75-2026-0907' }, info7: '2026-09-10', info1m: '2026-10-01', mutuelle: 'Dispense', assignedAt: '2026-09-07',
      plan: { accueil: '2026-09-07', materiel: '2026-09-07', entreprise: '2026-09-09', equipe: '2026-09-11' } },
    e22: { docs: ALLDOCS('2026-09-01'), contract: { status: 'Signé', sentAt: '2026-09-02', signedAt: '2026-09-04', paper: true }, prep: { poste: '2026-09-10', ordinateur: '2026-09-11', comptes: '2026-09-11', badge: '2026-09-11', bienvenue: '2026-09-08' }, buddy: 'e4',
      convention: '2026-09-04', assignedAt: '2026-09-10', checkins: { j30: { date: '2026-10-05', note: 'Bonne intégration dans l’équipe research ; premiers entretiens utilisateurs menés en autonomie. Objectif : synthèse de l’étude d’ici fin novembre.', by: 'e2' } },
      plan: { accueil: '2026-09-14', materiel: '2026-09-14', entreprise: '2026-09-16', equipe: '2026-09-18', mission: '2026-09-25', formation: '2026-09-28' } },
  };
  // Programme d'intégration : modèle commun à toute l'entreprise, modifiable par les RH (jour = J+n après l'arrivée).
  const onboardingPlan = [
    { k: 'accueil', label: 'Accueil par le manager et visite des locaux', day: 0, owner: 'manager' }, { k: 'materiel', label: 'Remise du matériel et des accès', day: 0, owner: 'rh' },
    { k: 'entreprise', label: 'Présentation de l’entreprise, des valeurs et de l’organisation', day: 2, owner: 'rh' }, { k: 'equipe', label: 'Déjeuner d’équipe et rencontre des interlocuteurs clés', day: 4, owner: 'parrain' },
    { k: 'mission', label: 'Première mission courte et valorisante', day: 10, owner: 'manager' }, { k: 'formation', label: 'Formations de prise de poste (outils, sécurité, RGPD)', day: 15, owner: 'rh' },
  ];
  // Some checklist progress so the stage panels look lived-in.
  const journey = {
    e3: { 6: [true, true, false, false] }, e10: { 4: [true, true, true, false, false, false] }, e12: { 2: [true, false, false] },
    e16: { 13: [true, true, false, false, false] }, e19: { 4: [true, true, true, true, false, false] },
  };
  const leaves = [
    { id: 'l1', empId: 'e3', type: 'Congés payés', start: '2026-08-10', end: '2026-08-21', days: 10, status: 'Approuvée', comment: 'Vacances d’été', createdAt: '2026-06-02' },
    { id: 'l2', empId: 'e4', type: 'Congés payés', start: '2026-10-26', end: '2026-10-30', days: 5, status: 'En attente', comment: 'Vacances de la Toussaint', createdAt: '2026-09-28' },
    { id: 'l3', empId: 'e10', type: 'Télétravail', start: '2026-10-08', end: '2026-10-09', days: 2, status: 'En attente', comment: '', createdAt: '2026-10-01' },
    { id: 'l4', empId: 'e13', type: 'RTT', start: '2026-10-16', end: '2026-10-16', days: 1, status: 'En attente', comment: 'Pont personnel', createdAt: '2026-10-02' },
    { id: 'l5', empId: 'e7', type: 'Congés payés', start: '2026-10-05', end: '2026-10-09', days: 5, status: 'Approuvée', comment: '', createdAt: '2026-09-10' },
    { id: 'l6', empId: 'e6', type: 'Congés payés', start: '2026-11-02', end: '2026-11-06', days: 5, status: 'Approuvée', comment: '', createdAt: '2026-09-15' },
    { id: 'l7', empId: 'e11', type: 'Maladie', start: '2026-10-05', end: '2026-10-06', days: 2, status: 'Approuvée', comment: 'Arrêt de travail transmis', createdAt: '2026-10-05', receivedAt: '2026-10-05', dsnAt: null, subrogation: false },
    { id: 'l11', empId: 'e17', type: 'Maladie', start: '2026-07-06', end: '2026-09-18', days: 54, status: 'Approuvée', comment: 'Arrêt de travail', createdAt: '2026-07-06', receivedAt: '2026-07-06', dsnAt: '2026-07-08', subrogation: true },
    { id: 'l10', empId: 'e15', type: 'Maladie', start: '2026-09-14', end: '2026-09-25', days: 10, status: 'Approuvée', comment: 'Arrêt de travail', createdAt: '2026-09-15', receivedAt: '2026-09-15', dsnAt: '2026-09-17', subrogation: true },
    { id: 'l8', empId: 'e2', type: 'RTT', start: '2026-10-23', end: '2026-10-23', days: 1, status: 'Approuvée', comment: '', createdAt: '2026-09-20' },
    { id: 'l9', empId: 'e15', type: 'Congés payés', start: '2026-12-21', end: '2026-12-31', days: 8, status: 'En attente', comment: 'Fêtes de fin d’année', createdAt: '2026-10-03' },
  ];
  // Besoins de recrutement et offres. Un besoin suit le circuit Demande → RH → Direction (création de poste ou hors budget) → Publication.
  const SC = (must, nice, rounds) => ({ must, nice, rounds });
  const A = (step, by, decision, date, comment = '') => ({ step, by, decision, date, comment });
  const J = (id, o) => Object.assign({ id, contract: 'CDI', location: 'Paris', priority: 'Normale', budgeted: true, replaces: null, pending: null, refusedAt: null,
    alternatives: { mobilite: true, taches: false, interim: false, auto: false, note: '' }, scorecard: null, approvals: [], comments: [], log: [], reviewers: [] }, o,
    { managerId: o.managerId || o.requestedBy },
    { budget: o.budget || `${new Intl.NumberFormat('fr-FR').format(o.salaryMin)} – ${new Intl.NumberFormat('fr-FR').format(o.salaryMax)} €` });
  const jobs = [
    J('j1', { title: 'UX Designer Senior', dept: 'Design', status: 'Ouverte', createdAt: '2026-09-01', requestedBy: 'e2', salaryMin: 48000, salaryMax: 54000, startWanted: '2026-12-01', reason: 'Création de poste', budgeted: true,
      description: 'Concevoir les parcours clés de nos applications, du besoin utilisateur au prototype testé.',
      alternatives: { mobilite: true, taches: true, interim: false, auto: false, note: 'Aucun profil interne disponible sur la recherche utilisateur.' },
      scorecard: SC(['Recherche utilisateur', 'Prototypage et tests', 'Travail avec un design system'], ['Animation d’ateliers', 'Notions d’accessibilité'], 3),
      approvals: [A('demande', 'e2', 'Soumise', '2026-08-25'), A('rh', 'e1', 'Validée', '2026-08-27'), A('direction', 'e5', 'Validée', '2026-08-29', 'Prévu dans le plan 2026.'), A('publication', 'e1', 'Publiée', '2026-09-01')] }),
    J('j2', { title: 'Développeur·se Full-stack', dept: 'Tech', location: 'Lyon · hybride', status: 'Ouverte', createdAt: '2026-09-12', requestedBy: 'e6', salaryMin: 45000, salaryMax: 52000, startWanted: '2026-11-15', reason: 'Remplacement', replaces: 'e13', priority: 'Urgente',
      description: 'Faire évoluer notre plateforme (TypeScript, Node.js, PostgreSQL) au sein d’une équipe de 6 personnes.',
      scorecard: SC(['TypeScript et Node.js', 'Bases de données SQL', 'Tests automatisés'], ['React', 'Culture DevOps'], 3),
      approvals: [A('demande', 'e6', 'Soumise', '2026-09-08'), A('rh', 'e1', 'Validée', '2026-09-10'), A('publication', 'e1', 'Publiée', '2026-09-12')] }),
    J('j3', { title: 'Chargé·e de marketing digital', dept: 'Marketing', contract: 'Alternance', status: 'Ouverte', createdAt: '2026-09-20', requestedBy: 'e7', salaryMin: 14000, salaryMax: 18000, budget: 'Grille alternance', startWanted: '2026-10-15', reason: 'Création de poste',
      description: 'Piloter nos campagnes d’acquisition et nos contenus sur les réseaux sociaux.',
      scorecard: SC(['Réseaux sociaux', 'Rédaction web', 'Analyse des performances'], ['Montage vidéo'], 2),
      approvals: [A('demande', 'e7', 'Soumise', '2026-09-14'), A('rh', 'e1', 'Validée', '2026-09-15'), A('direction', 'e5', 'Validée', '2026-09-17'), A('publication', 'e1', 'Publiée', '2026-09-20')] }),
    J('j4', { title: 'Designer produit (UI)', dept: 'Design', contract: 'CDD', status: 'En validation', pending: 'rh', createdAt: '2026-10-02', requestedBy: 'e2', salaryMin: 40000, salaryMax: 44000, startWanted: '2026-11-16', reason: 'Surcroît d’activité', budgeted: false, priority: 'Urgente',
      description: 'Renfort de 9 mois pour la refonte de l’application mobile : maquettes UI, bibliothèque de composants, suivi avec les développeurs.',
      alternatives: { mobilite: true, taches: true, interim: true, auto: false, note: 'L’équipe est déjà à pleine charge ; l’intérim ne propose pas de profil UI.' },
      scorecard: SC(['Design d’interface mobile', 'Figma et composants', 'Collaboration avec les développeurs'], ['Motion design'], 2),
      approvals: [A('demande', 'e2', 'Soumise', '2026-10-02', 'Refonte de l’app prévue en janvier.')] }),
    J('j5', { title: 'Account Executive', dept: 'Sales', status: 'Pourvue', createdAt: '2026-06-03', requestedBy: 'e8', salaryMin: 42000, salaryMax: 42000, budget: '42 000 € + variable', startWanted: '2026-07-01', reason: 'Remplacement',
      description: 'Développer le portefeuille de clients grands comptes.', scorecard: SC(['Prospection grands comptes', 'Négociation', 'Suivi CRM'], [], 2),
      approvals: [A('demande', 'e8', 'Soumise', '2026-05-28'), A('rh', 'e1', 'Validée', '2026-05-30'), A('publication', 'e1', 'Publiée', '2026-06-03')] }),
    J('j6', { title: 'Chef de projet digital', dept: 'Marketing', status: 'Validée', createdAt: '2026-09-22', requestedBy: 'e7', salaryMin: 46000, salaryMax: 50000, startWanted: '2027-01-04', reason: 'Création de poste',
      description: 'Nous recherchons un jeune chef de projet dynamique, de langue maternelle française, pour coordonner le lancement de notre nouveau site et le suivi des agences.',
      alternatives: { mobilite: true, taches: true, interim: false, auto: false, note: '' },
      scorecard: SC(['Gestion de projet web', 'Pilotage de prestataires', 'Suivi budgétaire'], ['SEO', 'Anglais professionnel'], 3),
      approvals: [A('demande', 'e7', 'Soumise', '2026-09-22'), A('rh', 'e1', 'Validée', '2026-09-24'), A('direction', 'e5', 'Validée', '2026-09-30', 'Accord pour un démarrage en janvier.')] }),
    J('j7', { title: 'Développeur·se mobile', dept: 'Tech', location: 'Lyon · hybride', status: 'En validation', pending: 'direction', createdAt: '2026-09-25', requestedBy: 'e6', salaryMin: 47000, salaryMax: 53000, startWanted: '2027-02-01', reason: 'Création de poste',
      description: 'Développer nos applications iOS et Android en React Native, en lien avec l’équipe produit.',
      alternatives: { mobilite: true, taches: false, interim: false, auto: false, note: 'Inès Haddad a été sollicitée mais préfère rester sur le front-end web.' },
      scorecard: SC(['React Native', 'Publication sur les stores', 'Tests et qualité'], ['Swift ou Kotlin'], 3),
      approvals: [A('demande', 'e6', 'Soumise', '2026-09-25'), A('rh', 'e1', 'Validée', '2026-09-29', 'Budget à confirmer par la direction.')] }),
    J('j8', { title: 'Stagiaire UX research', dept: 'Design', contract: 'Stage', status: 'À modifier', createdAt: '2026-09-29', requestedBy: 'e2', salaryMin: 7200, salaryMax: 7200, startWanted: '2027-02-15', reason: 'Création de poste', priority: 'Anticipée',
      description: 'Aider l’équipe sur les études utilisateurs.',
      scorecard: SC(['Méthodes d’entretien utilisateur'], [], 2),
      approvals: [A('demande', 'e2', 'Soumise', '2026-09-29'), A('rh', 'e1', 'À modifier', '2026-10-01', 'Merci de préciser les missions, la durée du stage et le tuteur.')] }),
    J('j9', { title: 'Business Developer', dept: 'Sales', status: 'Refusée', refusedAt: 'direction', createdAt: '2026-09-05', requestedBy: 'e8', salaryMin: 38000, salaryMax: 42000, startWanted: '2026-11-02', reason: 'Création de poste', budgeted: false,
      description: 'Prospecter les PME de la région lyonnaise.', scorecard: SC(['Prospection téléphonique', 'Connaissance des PME'], [], 2),
      approvals: [A('demande', 'e8', 'Soumise', '2026-09-05'), A('rh', 'e1', 'Validée', '2026-09-08'), A('direction', 'e5', 'Refusée', '2026-09-12', 'Hors budget 2026 : à représenter lors du plan 2027.')] }),
    J('j10', { title: 'Illustrateur·rice', dept: 'Design', status: 'Validée', createdAt: '2026-10-05', requestedBy: 'e2', salaryMin: 38000, salaryMax: 42000, startWanted: '2027-01-11', reason: 'Surcroît d’activité',
      description: 'Illustrations pour l’application et les supports clients, en lien avec l’équipe produit.',
      scorecard: SC(['Illustration vectorielle', 'Déclinaison d’une charte graphique'], ['Animation'], 2),
      approvals: [A('demande', 'e2', 'Soumise', '2026-10-05'), A('rh', 'e1', 'Validée', '2026-10-08')],
      ad: { title: 'Illustrateur·rice (CDI)', description: 'Au sein de l’équipe Design (6 personnes), tu crées les illustrations de l’application et des supports clients.\n\nCompétences recherchées : illustration vectorielle, déclinaison d’une charte graphique.', by: 'e2', at: '2026-10-09', ready: false, edits: [{ by: 'e2', at: '2026-10-09' }] } }),
  ];
  // Référence BES-AAAA-NNN (besoin) / OFF-AAAA-NNN (offre publiée) : numéro attribué à l'émission du besoin.
  jobs.slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt)).forEach((j, k) => { j.num = k + 1; });
  jobs.find((j) => j.id === 'j1').reviewers = ['e4'];
  jobs.find((j) => j.id === 'j4').comments = [{ by: 'e1', date: '2026-10-03', text: 'Peux-tu confirmer la durée exacte du renfort (9 mois) ? Je prépare le passage en direction.' }];
  // Candidats. Chaque entretien passé porte une évaluation structurée (note + preuve par compétence de la fiche de cadrage).
  // Les messages tracent les échanges ; un candidat non embauché est supprimé automatiquement 2 ans après le dernier contact.
  const ACK = (date) => ({ date, kind: 'ack', subject: 'Nous avons bien reçu votre candidature' });
  const EV = (date, ratings, evidence, reco, comment = '') => ({ date, ratings, evidence, reco, comment });
  const C = (id, jobId, name, stage, score, source, extra = {}) => ({ id, jobId, name, stage, score, source,
    email: name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, '').replace(' ', '.') + '@mail.fr',
    phone: extra.phone || '07 00 00 00 00', experience: extra.experience || '', notes: extra.notes || '', interviews: extra.interviews || [],
    appliedAt: extra.appliedAt || '2026-09-15', messages: extra.messages || [ACK(extra.appliedAt || '2026-09-15')],
    offer: extra.offer || null, refusal: extra.refusal || null, pool: !!extra.pool, hiredAt: extra.hiredAt || null, log: [],
    files: extra.files || [{ kind: 'cv', name: `CV-${name.split(' ').pop()}.pdf` }, { kind: 'lm', name: `Lettre-motivation-${name.split(' ').pop()}.pdf` }] });
  const candidates = [
    C('c1', 'j1', 'Manon Lefèvre', 'Entretien', 4, 'Site carrière', { appliedAt: '2026-09-12', files: [{ kind: 'cv', name: 'CV-Lefevre.pdf' }, { kind: 'lm', name: 'Lettre-motivation-Lefevre.pdf' }, { kind: 'autre', name: 'Portfolio-Lefevre.pdf', label: 'Portfolio' }], experience: '7 ans · agence et produit SaaS', notes: 'Très bon portfolio, à l’aise en recherche utilisateur.',
      interviews: [{ id: 'i1', date: '2026-09-29T14:00', with: 'e1', kind: 'Entretien RH', eval: EV('2026-09-29', [5, 4, 3], ['A mené 12 tests utilisateurs sur son dernier projet, méthode claire.', 'Montre des prototypes Figma testés en itérations courtes.', 'Connaît les design systems sans en avoir construit un.'], 'Favorable') },
        { id: 'i2', date: '2026-10-08T10:00', with: 'e2', kind: 'Entretien manager', eval: null }],
      messages: [ACK('2026-09-12'), { date: '2026-09-24', kind: 'convocation', subject: 'Invitation à un entretien RH' }, { date: '2026-10-01', kind: 'convocation', subject: 'Invitation à un entretien manager' }] }),
    C('c2', 'j1', 'Karim Benali', 'Présélection', 3, 'Jobboard', { appliedAt: '2026-09-16', experience: '5 ans · e-commerce' }),
    C('c3', 'j1', 'Chloé Garnier', 'Reçue', 0, 'Réseaux sociaux', { appliedAt: '2026-10-03', experience: '6 ans · fintech', files: [{ kind: 'cv', name: 'CV-Garnier.pdf' }] }),
    C('c4', 'j1', 'Antoine Mercier', 'Proposition', 5, 'Cooptation', { appliedAt: '2026-09-08', files: [{ kind: 'cv', name: 'CV-Mercier.pdf' }, { kind: 'lm', name: 'Lettre-motivation-Mercier.pdf' }, { kind: 'autre', name: 'Portfolio-Mercier.pdf', label: 'Portfolio' }], experience: '8 ans · design system', notes: 'Coopté par Hugo. Excellent entretien final.',
      interviews: [{ id: 'i3', date: '2026-09-25T14:00', with: 'e2', kind: 'Entretien manager', eval: EV('2026-09-25', [5, 5, 5], ['Présente une étude de 30 entretiens qui a réorienté une roadmap.', 'Prototype interactif testé en direct pendant l’entretien.', 'A construit et maintenu le design system de son employeur actuel.'], 'Favorable') },
        { id: 'i4', date: '2026-09-30T11:00', with: 'e1', kind: 'Entretien RH', eval: EV('2026-09-30', [5, 4, 5], ['Exemples concrets de recherche avec des utilisateurs B2B.', 'Bon niveau, moins d’expérience des tests à distance.', 'Anime la guilde design de 15 personnes.'], 'Favorable', 'Disponible début décembre, préavis de 2 mois.') }],
      messages: [ACK('2026-09-08'), { date: '2026-09-18', kind: 'convocation', subject: 'Invitation à un entretien manager' }, { date: '2026-09-26', kind: 'convocation', subject: 'Invitation à un entretien RH' }, { date: '2026-10-01', kind: 'proposition', subject: 'Notre proposition d’embauche' }],
      offer: { title: 'UX Designer Senior', contract: 'CDI', salary: 53000, startDate: '2026-12-01', managerId: 'e2', deadline: '2026-10-09', status: 'Envoyée', sentAt: '2026-10-01' } }),
    C('c5', 'j1', 'Lina Moreau', 'Reçue', 0, 'Site carrière', { appliedAt: '2026-09-18', experience: '4 ans · startup santé' }),
    C('c6', 'j2', 'Hamza Diallo', 'Entretien', 4, 'Jobboard', { appliedAt: '2026-09-19', experience: '6 ans · Node.js, React',
      interviews: [{ id: 'i5', date: '2026-09-30T10:00', with: 'e1', kind: 'Entretien RH', eval: null }, { id: 'i6', date: '2026-10-07T09:30', with: 'e6', kind: 'Test technique', eval: null }],
      messages: [ACK('2026-09-19'), { date: '2026-09-25', kind: 'convocation', subject: 'Invitation à un entretien RH' }, { date: '2026-10-01', kind: 'convocation', subject: 'Invitation à un test technique' }] }),
    C('c7', 'j2', 'Elise Fontaine', 'Présélection', 3, 'Site carrière', { appliedAt: '2026-09-29', experience: '3 ans · TypeScript' }),
    C('c8', 'j2', 'Rayan Masson', 'Reçue', 0, 'Jobboard', { appliedAt: '2026-09-22', experience: '2 ans · PHP, Vue' }),
    C('c9', 'j2', 'Maëlle Robin', 'Refusé', 2, 'Réseaux sociaux', { appliedAt: '2026-09-14', experience: '1 an · stage en agence', pool: true,
      refusal: { date: '2026-09-28', reason: 'L’expérience ne correspond pas encore au poste', from: 'Présélection' },
      messages: [ACK('2026-09-14'), { date: '2026-09-28', kind: 'refus', subject: 'Votre candidature chez Nova Studio' }] }),
    C('c10', 'j3', 'Tom Girard', 'Présélection', 3, 'École', { appliedAt: '2026-09-24', experience: 'Master marketing digital' }),
    C('c11', 'j3', 'Zoé Lambert', 'Reçue', 0, 'École', { appliedAt: '2026-10-02', experience: 'Bachelor communication' }),
    C('c12', 'j5', 'Liam O’Connor', 'Embauché', 5, 'Jobboard', { appliedAt: '2026-06-10', experience: 'Recruté en 2022', hiredAt: '2026-06-28' }),
    C('c13', 'j5', 'Hélène Marchand', 'Refusé', 4, 'Site carrière', { appliedAt: '2024-11-04', experience: '6 ans · vente SaaS', pool: true,
      refusal: { date: '2024-11-20', reason: 'Un autre candidat a été retenu', from: 'Entretien' }, messages: [ACK('2024-11-04'), { date: '2024-11-20', kind: 'refus', subject: 'Votre candidature chez Nova Studio' }] }),
    // Dernier contact il y a plus de 2 ans : supprimés automatiquement au premier chargement.
    C('c14', 'j5', 'Paul Garnier', 'Refusé', 2, 'Jobboard', { appliedAt: '2024-05-02', experience: '3 ans · retail', refusal: { date: '2024-06-10', reason: 'Les compétences indispensables ne sont pas réunies', from: 'Présélection' },
      messages: [ACK('2024-05-02'), { date: '2024-06-10', kind: 'refus', subject: 'Votre candidature chez Nova Studio' }] }),
    C('c15', 'j5', 'Nadia Morel', 'Refusé', 3, 'Cooptation', { appliedAt: '2024-08-19', experience: '4 ans · inside sales', pool: true, refusal: { date: '2024-09-03', reason: 'Un autre candidat a été retenu', from: 'Entretien' },
      messages: [ACK('2024-08-19'), { date: '2024-09-03', kind: 'refus', subject: 'Votre candidature chez Nova Studio' }] }),
  ];
  const notifications = [
    { id: 'n1', to: 'e2', text: 'Hugo Laurent demande 5 jours de congés payés du 26 au 30 octobre.', date: '2026-09-28', read: false },
    { id: 'n2', to: 'e1', text: 'Thomas Petit a créé un besoin de recrutement : Designer produit (UI).', date: '2026-10-02', read: false },
    { id: 'n4', to: 'e2', text: 'Olivia Bennett demande des précisions sur votre besoin « Stagiaire UX research ».', date: '2026-10-01', read: false },
    { id: 'n3', to: 'e3', text: 'Votre bulletin de paie de septembre 2026 est disponible.', date: '2026-09-30', read: false },
  ];
  // Months already closed (payslips available), with optional bonuses per employee.
  const payroll = {
    '2026-07': { closed: true, bonus: {} },
    '2026-08': { closed: true, bonus: { e8: 1200 } },
    '2026-09': { closed: true, bonus: { e8: 900, e6: 500 } },
  };

  // ---- Performance & entretiens
  const lastPro = { e1: '2025-02-10', e2: '2024-06-12', e4: '2023-05-30', e5: '2025-01-15', e6: '2024-09-03', e7: '2023-03-20', e8: '2024-02-14', e9: '2024-11-20',
    e11: '2024-07-04', e13: '2025-04-03', e14: '2024-10-10', e15: '2022-01-10', e16: '2025-09-04', e17: '2025-05-17' };
  employees.forEach((e) => { e.lastPro = lastPro[e.id] || null; });
  const objectives = [
    { id: 'o1', empId: 'e3', title: 'Refondre le parcours d’inscription de l’app mobile', due: '2026-12-15', progress: 70 },
    { id: 'o2', empId: 'e3', title: 'Livrer 20 composants du design system', due: '2026-12-31', progress: 45 },
    { id: 'o3', empId: 'e3', title: 'Mener 8 sessions de tests utilisateurs', due: '2026-11-30', progress: 50 },
    { id: 'o4', empId: 'e4', title: 'Lancer la version 2 du design system', due: '2026-12-31', progress: 80 },
    { id: 'o5', empId: 'e4', title: 'Accompagner Emma pendant sa période d’essai', due: '2026-11-30', progress: 60 },
    { id: 'o6', empId: 'e10', title: 'Refondre la charte graphique', due: '2027-01-31', progress: 20 },
    { id: 'o7', empId: 'e13', title: 'Migrer le front-end vers la nouvelle architecture', due: '2026-12-31', progress: 35 },
    { id: 'o8', empId: 'e8', title: 'Signer 12 nouveaux comptes', due: '2026-12-31', progress: 75 },
  ];
  const reviews = [
    { id: 'r1', empId: 'e3', kind: 'Entretien annuel', year: 2026, date: '2026-11-18', status: 'Planifié', self: null, mgr: null },
    { id: 'r2', empId: 'e4', kind: 'Entretien annuel', year: 2026, date: '2026-11-12', status: 'Auto-évaluation faite', self: { rating: 4, comment: 'Lancement réussi du design system v1, j’aimerais encadrer davantage.' }, mgr: null },
    { id: 'r3', empId: 'e10', kind: 'Entretien annuel', year: 2026, date: null, status: 'À planifier', self: null, mgr: null },
    { id: 'r4', empId: 'e9', kind: 'Entretien annuel', year: 2026, date: '2026-09-29', status: 'Signé', self: { rating: 4, comment: 'Clôtures mensuelles tenues dans les délais.' }, mgr: { rating: 4, comment: 'Fiable et rigoureux. Prochaine étape : piloter le budget 2027.', proposal: 'Augmentation' }, signedAt: '2026-10-01' },
    { id: 'r5', empId: 'e13', kind: 'Entretien annuel', year: 2026, date: '2026-10-21', status: 'À signer', self: { rating: 4, comment: 'Montée en compétence sur l’architecture front.' }, mgr: { rating: 5, comment: 'Excellente année, référente technique de l’équipe.', proposal: 'Promotion' } },
    { id: 'r6', empId: 'e4', kind: 'Entretien professionnel', year: 2026, date: '2026-11-12', status: 'Planifié', self: null, mgr: null },
  ];
  const feedback = [
    { id: 'fb1', from: 'e4', to: 'e3', text: 'Merci pour l’organisation des tests utilisateurs, les retours ont changé notre façon de voir l’onboarding.', date: '2026-09-30' },
    { id: 'fb2', from: 'e2', to: 'e3', text: 'Très belle présentation au comité produit, claire et bien argumentée.', date: '2026-09-12' },
    { id: 'fb3', from: 'e3', to: 'e10', text: 'Bienvenue Emma ! Ta proposition de moodboard a mis tout le monde d’accord.', date: '2026-09-18' },
  ];
  // ---- Formation
  const trainings = [
    { id: 't1', title: 'Recherche utilisateur avancée', provider: 'UX Academy', category: 'Métier', hours: 14, cost: 1200, mode: 'Présentiel', sessions: ['2026-11-16', '2026-12-07'] },
    { id: 't2', title: 'Accessibilité numérique (RGAA)', provider: 'Access Formation', category: 'Métier', hours: 7, cost: 650, mode: 'Distanciel', sessions: ['2026-10-22', '2026-11-26'] },
    { id: 't3', title: 'Manager en situation hybride', provider: 'Leadership & Co', category: 'Management', hours: 21, cost: 1800, mode: 'Présentiel', sessions: ['2026-11-09', '2027-01-18'] },
    { id: 't4', title: 'Anglais professionnel', provider: 'Lingua Pro', category: 'Langues', hours: 30, cost: 1500, mode: 'Distanciel', sessions: ['2026-11-02', '2027-01-04'] },
    { id: 't5', title: 'Sauveteur secouriste du travail (SST)', provider: 'Prévention Santé', category: 'Sécurité', hours: 14, cost: 300, mode: 'Présentiel', sessions: ['2026-10-29', '2026-12-03'] },
    { id: 't6', title: 'Prise de parole en public', provider: 'Oratio', category: 'Compétences transverses', hours: 7, cost: 690, mode: 'Présentiel', sessions: ['2026-11-19', '2027-02-04'] },
  ];
  const enrollments = [
    { id: 'f9', empId: 'e14', trainingId: 't2', session: '2026-05-12', status: 'Terminée', reason: 'Rendre nos offres accessibles', createdAt: '2026-04-02', rating: 4, fund: 'OPCO' },
    { id: 'f1', empId: 'e4', trainingId: 't3', session: '2026-11-09', status: 'Validée', reason: 'Préparer une évolution vers le management', createdAt: '2026-09-15' },
    { id: 'f2', empId: 'e13', trainingId: 't2', session: '2026-10-22', status: 'Demandée', reason: 'Rendre nos écrans conformes', createdAt: '2026-10-01' },
    { id: 'f3', empId: 'e10', trainingId: 't1', session: '2026-12-07', status: 'Validée manager', reason: 'Monter en compétence sur la recherche', createdAt: '2026-09-25' },
    { id: 'f4', empId: 'e11', trainingId: 't5', session: '2026-06-04', status: 'Terminée', reason: 'Devenir SST du site de Lyon', createdAt: '2026-04-10', rating: 5 },
    { id: 'f5', empId: 'e3', trainingId: 't2', session: '2026-04-16', status: 'Terminée', reason: 'Bonnes pratiques d’accessibilité', createdAt: '2026-03-02', rating: 4 },
    { id: 'f6', empId: 'e7', trainingId: 't6', session: '2026-11-19', status: 'Validée', reason: 'Conférences clients 2027', createdAt: '2026-09-02' },
  ];
  // ---- Mobilité
  const wishes = [
    { id: 'w1', empId: 'e4', kind: 'Évolution de poste', target: 'Lead Designer avec encadrement', horizon: 'Dans 12 mois', comment: 'Je souhaite encadrer une petite équipe.', status: 'En étude', mgrOpinion: 'Favorable', createdAt: '2026-06-20' },
    { id: 'w2', empId: 'e15', kind: 'Changement de service', target: 'Contrôle de gestion', horizon: 'Dans 6 mois', comment: 'Envie d’évoluer vers l’analyse financière.', status: 'Exprimé', mgrOpinion: null, createdAt: '2026-09-08' },
    { id: 'w3', empId: 'e11', kind: 'Mobilité géographique', target: 'Bureaux de Paris', horizon: 'En 2027', comment: 'Rapprochement familial.', status: 'Exprimé', mgrOpinion: null, createdAt: '2026-09-21' },
  ];
  const history = [
    { id: 'h1', empId: 'e4', date: '2024-01-01', label: 'Promotion', detail: 'Product Designer → Senior Product Designer · salaire 48 000 € → 54 000 €' },
    { id: 'h2', empId: 'e13', date: '2025-01-01', label: 'Augmentation', detail: 'Salaire 43 500 € → 47 000 €' },
    { id: 'h3', empId: 'e14', date: '2024-03-01', label: 'Mobilité interne', detail: 'Assistant RH → Chargé de recrutement' },
  ];
  // ---- Santé & QVT
  const visits = [
    { id: 'v1', empId: 'e3', kind: "Visite d'information et de prévention", date: '2024-12-10', status: 'Réalisée', result: 'Apte' },
    { id: 'v2', empId: 'e19', kind: "Visite d'information et de prévention", date: '2026-10-14', status: 'Planifiée', result: null },
    { id: 'v3', empId: 'e15', kind: 'Visite périodique', date: '2021-03-01', status: 'Réalisée', result: 'Apte' },
    { id: 'v4', empId: 'e11', kind: 'Visite périodique', date: '2024-05-14', status: 'Réalisée', result: 'Apte avec aménagement' },
  ];
  employees.forEach((e, k) => {
    if (['e3', 'e10', 'e12', 'e15', 'e18', 'e19', 'e11'].includes(e.id)) return;
    const d = e.startDate > '2022-06-01' ? e.startDate.slice(0, 8) + '28' : `202${3 + (k % 3)}-0${1 + (k % 8)}-15`;
    visits.push({ id: 'v' + (10 + k), empId: e.id, kind: e.startDate > '2022-06-01' ? "Visite d'information et de prévention" : 'Visite périodique', date: d, status: 'Réalisée', result: 'Apte' });
  });
  const incidents = [
    { id: 'i1', empId: 'e11', date: '2026-10-02', kind: 'Accident de trajet', description: 'Chute à vélo sur le trajet domicile-travail, entorse du poignet.', stopDays: 2, status: 'Déclaré', createdAt: '2026-10-02' },
    { id: 'i2', empId: 'e17', date: '2026-06-11', kind: 'Accident du travail', description: 'Coupure légère en déballant une livraison.', stopDays: 0, status: 'Clos', createdAt: '2026-06-11' },
  ];
  const risks = [
    { id: 'k1', unit: 'Bureaux · Paris', risk: 'Travail prolongé sur écran', g: 2, p: 4, measure: 'Écrans réglables, pauses, formation aux postures', status: 'En place' },
    { id: 'k2', unit: 'Toutes équipes', risk: 'Charge de travail et risques psychosociaux', g: 3, p: 3, measure: 'Baromètre QVT mensuel, entretiens de charge', status: 'En cours' },
    { id: 'k3', unit: 'Commerciaux', risk: 'Risque routier lors des déplacements', g: 4, p: 2, measure: 'Politique voyage, train privilégié', status: 'En place' },
    { id: 'k4', unit: 'Bureaux · Lyon', risk: 'Chute de plain-pied (escaliers)', g: 2, p: 2, measure: 'Bandes antidérapantes', status: 'À lancer' },
    { id: 'k5', unit: 'Télétravail', risk: 'Isolement', g: 2, p: 3, measure: 'Jour d’équipe hebdomadaire sur site', status: 'En cours' },
  ];
  const survey = [];
  employees.forEach((e, k) => {
    if (e.stage < 3 || e.stage > 13) return;
    survey.push({ id: 'q9' + k, empId: e.id, month: '2026-09', answers: [3 + (k % 3 === 0 ? -1 : k % 2), 4 + (k % 4 === 0 ? -1 : 0), 3 + (k % 2), 4 + (k % 5 === 0 ? 1 : 0) - (k % 7 === 0 ? 1 : 0)] });
    if (k % 3 !== 1 && e.id !== 'e3') survey.push({ id: 'q10' + k, empId: e.id, month: '2026-10', answers: [3 + (k % 2), 4, 3 + (k % 3 === 0 ? 1 : 0), 4] });
  });
  const adjustments = [
    { id: 'a1', empId: 'e9', kind: 'Siège ergonomique', comment: 'Douleurs lombaires, préconisé par la médecine du travail.', status: 'Demandé', createdAt: '2026-09-29' },
    { id: 'a2', empId: 'e11', kind: 'Horaires aménagés', comment: 'Suite à la visite périodique.', status: 'Accordé', createdAt: '2024-05-20' },
  ];
  // ---- Relations individuelles (dossiers confidentiels RH)
  const cases = [
    { id: 'd1', empId: 'e15', kind: 'Situation individuelle', title: 'Aménagement horaire · proche aidant', openedAt: '2026-09-10', status: 'En cours', facts: null, interview: null, measure: null, openedBy: 'e1',
      events: [{ date: '2026-09-10', type: 'Échange', note: 'Sarah explique accompagner un parent dépendant.', by: 'e1', visible: false }, { date: '2026-09-17', type: 'Réponse au collaborateur', note: 'Proposition : départ à 16h30 deux jours par semaine pendant 6 mois.', by: 'e1', visible: true }] },
    { id: 'd2', empId: 'e8', kind: 'Procédure disciplinaire', title: 'Non-respect répété de la procédure de facturation', openedAt: '2026-09-30', status: 'En cours', facts: '2026-09-28', interview: '2026-10-13', measure: null, openedBy: 'e1',
      events: [{ date: '2026-10-01', type: 'Convocation envoyée', note: 'Lettre remise en main propre contre décharge, entretien préalable le 13 octobre.', by: 'e1', visible: false }] },
    { id: 'd3', empId: 'e3', kind: 'Demande d’échange', title: 'Échanger sur ma charge de travail', openedAt: '2026-10-02', status: 'Ouvert', facts: null, interview: null, measure: null, openedBy: 'e3',
      events: [{ date: '2026-10-02', type: 'Demande du collaborateur', note: 'Beaucoup de projets en parallèle depuis septembre, j’aimerais en parler.', by: 'e3', visible: true }] },
  ];
  // ---- Documents RH
  const documents = [
    { id: 'doc-e21a', empId: 'e21', kind: 'certificat', title: 'Certificat de travail', date: '2026-10-01' }, { id: 'doc-e21b', empId: 'e21', kind: 'solde', title: 'Reçu pour solde de tout compte', date: '2026-10-01' },
    { id: 'doc-e21c', empId: 'e21', kind: 'france-travail', title: 'Attestation employeur France Travail', date: '2026-10-01' },
    { id: 'doc-e20a', empId: 'e20', kind: 'certificat', title: 'Certificat de travail', date: '2025-06-30' }, { id: 'doc-e20b', empId: 'e20', kind: 'solde', title: 'Reçu pour solde de tout compte', date: '2025-06-30' },
    { id: 'doc1', empId: 'e3', kind: 'contrat', title: 'Contrat de travail · CDI', date: '2024-10-20' },
    { id: 'doc2', empId: 'e3', kind: 'attestation', title: 'Attestation employeur', date: '2026-02-03' },
    { id: 'doc3', empId: 'e4', kind: 'avenant', title: 'Avenant · Senior Product Designer', date: '2023-12-15', data: { title: 'Senior Product Designer', dept: 'Design', salary: 54000, effective: '2024-01-01' } },
  ];
  // V3 : conformité liée à l'effectif — CSE élu en 2024 (2 élus), réunions mensuelles, affichages presque tous faits.
  const compliance = { cse: { mandate: { start: '2024-03-12', end: '2028-03-11', carence: false }, election: {}, members: [{ empId: 'e15', role: 'Titulaire', from: '2024-03-12', to: '2028-03-11' }, { empId: 'e14', role: 'Suppléant', from: '2024-03-12', to: '2028-03-11' }],
      meetings: ['2026-01-20', '2026-02-17', '2026-03-17', '2026-04-21', '2026-05-19', '2026-06-16', '2026-07-21', '2026-09-15'].map((date, i) => ({ id: `cm${i + 1}`, date, kind: 'Réunion ordinaire', agenda: ['Questions des salariés', 'Organisation du télétravail', 'Plan de formation', 'Congés d’été', 'Sécurité des déplacements', 'Bilan du semestre', 'Rentrée et recrutements', 'Mutuelle et prévoyance'][i], minutes: 'Compte rendu diffusé' })),
      hours: {}, consult: {}, nao: {}, ds: false, ascPct: 0.5 },
    displays: { inspection: '2024-01-08', medecine: '2024-01-08', secours: '2024-01-08', harcelement: '2024-01-08', egalite: '2024-01-08', horaires: '2024-01-08', convention: '2024-01-08', conges: '2026-02-02' }, referents: { cse: 'e15' } };
  return { version: 8, compliance, onboardingPlan, employees, journey, leaves, jobs, candidates, notifications, payroll, objectives, reviews, feedback, trainings, enrollments, trainingBudget: 25000, purgeLog: [], onboarding, changeReqs, timesheets, raises, valueShare, payInfoReqs, offboarding, talent, succession, duerp,
    wishes, history, visits, incidents, risks, survey, adjustments, cases, documents };
};
