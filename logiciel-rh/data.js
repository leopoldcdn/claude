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
  { short: 'Performance', title: 'Performance et entretiens', icon: 'star', module: null,
    steps: ['Fixation des objectifs', 'Entretiens de suivi', 'Entretien annuel', 'Entretien professionnel', 'Évaluation et feedback'] },
  { short: 'Formation', title: 'Formation et développement des compétences', icon: 'cap', module: null,
    steps: ['Identification des besoins', 'Planification des formations', 'Réalisation et suivi des formations', 'Évaluation des acquis', 'Développement des compétences'] },
  { short: 'Mobilité', title: 'Mobilité et évolution professionnelle', icon: 'trend', module: null,
    steps: ["Identification des souhaits d'évolution", 'Mobilité interne', 'Changement de poste ou de responsabilités', 'Évolution de carrière'] },
  { short: 'Santé & QVT', title: 'Santé, sécurité et qualité de vie au travail', icon: 'heart', module: null,
    steps: ['Suivi de la santé au travail', 'Prévention des risques', 'Accidents et incidents', 'Aménagements éventuels du poste', 'Actions de qualité de vie et des conditions de travail'] },
  { short: 'Relations indiv.', title: 'Relations individuelles et disciplinaires', icon: 'chat', module: null,
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
    E('e18', 'Nathan', 'Lefebvre', 'Développeur back-end', 'Tech', 'e6', 3, '2026-10-01', 'CDI', 46000, { cp: 0, rtt: 0 }),
    E('e19', 'Julie', 'Bernard', 'Alternante marketing', 'Marketing', 'e7', 4, '2026-09-07', 'Alternance', 21000, { cp: 2, rtt: 0 }),
  ];
  // Some checklist progress so the stage panels look lived-in.
  const journey = {
    e3: { 6: [true, true, false, false] }, e10: { 4: [true, true, true, false, false, false] }, e12: { 2: [true, false, false] },
    e18: { 3: [true, true, false, false] }, e16: { 13: [true, true, false, false, false] }, e19: { 4: [true, true, true, true, false, false] },
  };
  const leaves = [
    { id: 'l1', empId: 'e3', type: 'Congés payés', start: '2026-08-10', end: '2026-08-21', days: 10, status: 'Approuvée', comment: 'Vacances d’été', createdAt: '2026-06-02' },
    { id: 'l2', empId: 'e4', type: 'Congés payés', start: '2026-10-26', end: '2026-10-30', days: 5, status: 'En attente', comment: 'Vacances de la Toussaint', createdAt: '2026-09-28' },
    { id: 'l3', empId: 'e10', type: 'Télétravail', start: '2026-10-08', end: '2026-10-09', days: 2, status: 'En attente', comment: '', createdAt: '2026-10-01' },
    { id: 'l4', empId: 'e13', type: 'RTT', start: '2026-10-16', end: '2026-10-16', days: 1, status: 'En attente', comment: 'Pont personnel', createdAt: '2026-10-02' },
    { id: 'l5', empId: 'e7', type: 'Congés payés', start: '2026-10-05', end: '2026-10-09', days: 5, status: 'Approuvée', comment: '', createdAt: '2026-09-10' },
    { id: 'l6', empId: 'e6', type: 'Congés payés', start: '2026-11-02', end: '2026-11-06', days: 5, status: 'Approuvée', comment: '', createdAt: '2026-09-15' },
    { id: 'l7', empId: 'e11', type: 'Maladie', start: '2026-10-05', end: '2026-10-06', days: 2, status: 'Approuvée', comment: 'Arrêt de travail transmis', createdAt: '2026-10-05' },
    { id: 'l8', empId: 'e2', type: 'RTT', start: '2026-10-23', end: '2026-10-23', days: 1, status: 'Approuvée', comment: '', createdAt: '2026-09-20' },
    { id: 'l9', empId: 'e15', type: 'Congés payés', start: '2026-12-21', end: '2026-12-31', days: 8, status: 'En attente', comment: 'Fêtes de fin d’année', createdAt: '2026-10-03' },
  ];
  const jobs = [
    { id: 'j1', title: 'UX Designer Senior', dept: 'Design', contract: 'CDI', location: 'Paris', status: 'Ouverte', createdAt: '2026-09-01', budget: '48 000 – 54 000 €', reason: 'Création de poste', description: 'Concevoir les parcours clés de nos applications, du besoin utilisateur au prototype testé.' },
    { id: 'j2', title: 'Développeur·se Full-stack', dept: 'Tech', contract: 'CDI', location: 'Lyon · hybride', status: 'Ouverte', createdAt: '2026-09-12', budget: '45 000 – 52 000 €', reason: 'Remplacement', description: 'Faire évoluer notre plateforme (TypeScript, Node.js, PostgreSQL) au sein d’une équipe de 6 personnes.' },
    { id: 'j3', title: 'Chargé·e de marketing digital', dept: 'Marketing', contract: 'Alternance', location: 'Paris', status: 'Ouverte', createdAt: '2026-09-20', budget: 'Grille alternance', reason: 'Création de poste', description: 'Piloter nos campagnes d’acquisition et nos contenus sur les réseaux sociaux.' },
    { id: 'j4', title: 'Designer produit (UI)', dept: 'Design', contract: 'CDD', location: 'Paris', status: 'Brouillon', createdAt: '2026-10-02', budget: '40 000 – 44 000 €', reason: 'Surcroît d’activité', description: 'Renfort de 9 mois pour la refonte de l’application mobile.' },
    { id: 'j5', title: 'Account Executive', dept: 'Sales', contract: 'CDI', location: 'Paris', status: 'Pourvue', createdAt: '2026-06-03', budget: '42 000 € + variable', reason: 'Remplacement', description: 'Développer le portefeuille de clients grands comptes.' },
  ];
  const C = (id, jobId, name, stage, score, source, extra = {}) => ({ id, jobId, name, stage, score, source,
    email: name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, '').replace(' ', '.') + '@mail.fr',
    phone: extra.phone || '07 00 00 00 00', experience: extra.experience || '', notes: extra.notes || '', interviews: extra.interviews || [], appliedAt: extra.appliedAt || '2026-09-15' });
  const candidates = [
    C('c1', 'j1', 'Manon Lefèvre', 'Entretien', 4, 'Site carrière', { experience: '7 ans · agence et produit SaaS', notes: 'Très bon portfolio, à l’aise en recherche utilisateur.', interviews: [{ date: '2026-10-08T10:00', with: 'e2', kind: 'Entretien manager' }] }),
    C('c2', 'j1', 'Karim Benali', 'Présélection', 3, 'Jobboard', { experience: '5 ans · e-commerce' }),
    C('c3', 'j1', 'Chloé Garnier', 'Reçue', 0, 'Réseaux sociaux', { experience: '6 ans · fintech' }),
    C('c4', 'j1', 'Antoine Mercier', 'Proposition', 5, 'Cooptation', { experience: '8 ans · design system', notes: 'Coopté par Hugo. Excellent entretien final.', interviews: [{ date: '2026-09-25T14:00', with: 'e2', kind: 'Entretien manager' }, { date: '2026-09-30T11:00', with: 'e1', kind: 'Entretien RH' }] }),
    C('c5', 'j1', 'Lina Moreau', 'Reçue', 0, 'Site carrière', { experience: '4 ans · startup santé' }),
    C('c6', 'j2', 'Hamza Diallo', 'Entretien', 4, 'Jobboard', { experience: '6 ans · Node.js, React', interviews: [{ date: '2026-10-07T09:30', with: 'e6', kind: 'Test technique' }] }),
    C('c7', 'j2', 'Elise Fontaine', 'Présélection', 3, 'Site carrière', { experience: '3 ans · TypeScript' }),
    C('c8', 'j2', 'Rayan Masson', 'Reçue', 0, 'Jobboard', { experience: '2 ans · PHP, Vue' }),
    C('c9', 'j2', 'Maëlle Robin', 'Refusé', 2, 'Réseaux sociaux', { experience: 'Profil junior' }),
    C('c10', 'j3', 'Tom Girard', 'Présélection', 3, 'École', { experience: 'Master marketing digital' }),
    C('c11', 'j3', 'Zoé Lambert', 'Reçue', 0, 'École', { experience: 'Bachelor communication' }),
    C('c12', 'j5', 'Liam O’Connor', 'Embauché', 5, 'Jobboard', { experience: 'Recruté en 2022' }),
  ];
  const notifications = [
    { id: 'n1', to: 'e2', text: 'Hugo Laurent demande 5 jours de congés payés du 26 au 30 octobre.', date: '2026-09-28', read: false },
    { id: 'n2', to: 'e1', text: 'Thomas Petit a créé un besoin de recrutement : Designer produit (UI).', date: '2026-10-02', read: false },
    { id: 'n3', to: 'e3', text: 'Votre bulletin de paie de septembre 2026 est disponible.', date: '2026-09-30', read: false },
  ];
  // Months already closed (payslips available), with optional bonuses per employee.
  const payroll = {
    '2026-07': { closed: true, bonus: {} },
    '2026-08': { closed: true, bonus: { e8: 1200 } },
    '2026-09': { closed: true, bonus: { e8: 900, e6: 500 } },
  };
  return { version: 1, employees, journey, leaves, jobs, candidates, notifications, payroll };
};
