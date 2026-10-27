// Teamora — aperçu fonctionnel du logiciel RH (sans base de données).
// Rendu par chaînes HTML + délégation d'événements ; état persistant dans localStorage.
(function () {
  'use strict';

  const STAGES = window.TEAMORA_STAGES;
  const STAGE_COLORS = ['#6366f1', '#7c3aed', '#a855f7', '#c026d3', '#db2777', '#e11d48', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a', '#059669', '#0d9488', '#0891b2', '#0284c7', '#2563eb'];
  const P = {
    chart: '<path d="M4 20V11M10 20V5M16 20v-8M21 20H3"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2c2.6-.4 4.4 1.2 5 4.3"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    wallet: '<rect x="2.5" y="6" width="19" height="13" rx="2"/><path d="M2.5 10h19M7 15h3"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-8 8"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    shrink: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
    sort: '<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    docCheck: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 16l2.5 2 5-5"/>',
    idCard: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16.5c.6-1.6 1.7-2.5 3.2-2.5s2.6.9 3.2 2.5M14.5 10h4M14.5 13.5h3"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 15l-3-3c1-4 4.5-8.5 12-9 0 7.5-5 11-9 12z"/><circle cx="14.5" cy="9.5" r="1.6"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    euro: '<path d="M17 6.5A6.5 6.5 0 1 0 17 17.5"/><path d="M4 10.5h9M4 13.5h9"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    heart: '<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/>',
    hourglass: '<path d="M6 3h12M6 21h12"/><path d="M7 3v3l5 6-5 6v3M17 3v3l-5 6 5 6v3"/>',
    door: '<path d="M14 3H6v18h8"/><path d="M14 3l6 2v16l-6-2z"/><path d="M10 12h.01"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/>',
  };
  const ic = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
  const STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
  const LOGO = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P.users + '</svg>';

  // ---------------------------------------------------------------- Storage
  // V2 : deux entreprises coexistent dans le navigateur — la démo Nova Studio et une « nouvelle entreprise » à installer de zéro.
  let TENANT = (() => { try { return localStorage.getItem('teamora-v3-tenant') === 'new' ? 'new' : 'nova'; } catch (e) { return 'nova'; } })();
  let STORE, UI_STORE;
  const setStores = () => { STORE = TENANT === 'new' ? 'teamora-demo-v3-new' : 'teamora-demo-v3'; UI_STORE = TENANT === 'new' ? 'teamora-ui-v3-new' : 'teamora-ui-v3'; };
  setStores();
  function load() {
    try { const d = JSON.parse(localStorage.getItem(STORE)); if (d && d.version === 8) return d; } catch (e) { /* ignore */ }
    return TENANT === 'new' ? blankSeed() : window.TEAMORA_SEED();
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) { /* storage unavailable */ } }
  function loadUI() { try { return JSON.parse(localStorage.getItem(UI_STORE)) || {}; } catch (e) { return {}; } }
  function saveUI() { try { localStorage.setItem(UI_STORE, JSON.stringify({ profile: ui.profile, view: ui.view, stage: ui.stage, setSec: ui.setSec || null, wizStep: ui.wizStep || null, asEmp: ui.asEmp, asMgr: ui.asMgr || null, selfOf: ui.selfOf || null, orgZoom: ui.orgZoom, orgFold: ui.orgFold })); } catch (e) { /* ignore */ } }

  let db = load();
  const PROFILES = {
    rh: { emp: 'e1', label: 'RH' },
    manager: { emp: 'e2', label: 'Manager' },
    salarie: { emp: 'e3', label: 'Salarié' },
  };
  const freshUI = () => ({ tplSel: null, tplDraft: null, wheelOpen: false, selPerson: null, q: '', fDept: '', fStatus: '', sort: 'name', sortDir: 1,
    absTab: 'valider', histStatus: '', planMonth: null, payMonth: null, recJob: null, drawer: null, modal: null, notif: false,
    nSort: 'since', nDir: -1, recTab: 'todo', offerTab: 'cands', colOpen: {}, oSort: 'status', oDir: 1, nq: '', nDept: '', nStatus: 'auto', nFrom: '', rq: '', rDept: '', rStatus: '', rFrom: '', adminTab: 'annuaire', payTab: 'paie', payStep: null, procTab: 'cours', procSel: null, procPhase: null, orgQ: '', orgDept: '', orgSite: '', profTab: 'profil', tsWeek: null, revTab: '', trTab: '', mobTab: '', healthTab: '', qvtMonth: null, caseStatus: '' });
  // Deux versions : « travail » (index.html, toutes les options) et « démo » (demo.html, lien partagé aux PME testeuses).
  const DEMO = window.TEAMORA_MODE === 'demo';
  let ui = Object.assign({ profile: 'rh', view: 'accueil', stage: null }, loadUI(), freshUI());
  if (!PROFILES[ui.profile]) ui.profile = 'rh';
  ui.orgZoom = Number(ui.orgZoom) || 1; ui.orgFold = ui.orgFold || {};
  if (ui.profile !== 'salarie' || !['rh', 'manager'].includes(ui.selfOf)) ui.selfOf = null;

  // ---------------------------------------------------------------- Helpers
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d || 1); };
  const TODAY = iso(new Date());
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const fmtDate = (s, o = { day: 'numeric', month: 'short', year: 'numeric' }) => (s ? new Intl.DateTimeFormat('fr-FR', o).format(parse(s)) : '—');
  const fmtShort = (s) => fmtDate(s, { day: 'numeric', month: 'short' });
  const monthKey = (s) => s.slice(0, 7);
  const monthLabel = (m) => { const t = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(parse(m + '-01')); return t[0].toUpperCase() + t.slice(1); };
  const monthEnd = (m) => { const d = parse(m + '-01'); return iso(new Date(d.getFullYear(), d.getMonth() + 1, 0)); };
  const shiftMonth = (m, n) => { const d = parse(m + '-01'); d.setMonth(d.getMonth() + n); return iso(d).slice(0, 7); };
  const HOLIDAYS = new Set(['2026-01-01', '2026-04-06', '2026-05-01', '2026-05-08', '2026-05-14', '2026-05-25', '2026-07-14', '2026-08-15', '2026-11-01', '2026-11-11', '2026-12-25',
    '2027-01-01', '2027-03-29', '2027-05-01', '2027-05-06', '2027-05-08', '2027-05-17', '2027-07-14', '2027-08-15', '2027-11-01', '2027-11-11', '2027-12-25']);
  const isWork = (s) => { const d = parse(s).getDay(); return d !== 0 && d !== 6 && !HOLIDAYS.has(s); };
  function workDays(a, b) { if (!a || !b || b < a) return 0; let n = 0; for (let s = a; s <= b; s = addDays(s, 1)) if (isWork(s)) n++; return n; }
  const eur = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
  const eur0 = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const uid = (p) => p + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
  // Lit un fichier joint : gardé dans le navigateur s'il est léger (pour l'aperçu), sinon seul son nom l'est.
  const readFile = (f) => new Promise((ok) => {
    const base = { name: f.name, type: f.type, date: TODAY, data: null };
    if (f.size > 700 * 1024 || !/^(image\/|application\/pdf)/.test(f.type)) { ok(base); return; }
    const r = new FileReader(); r.onload = () => ok(Object.assign(base, { data: r.result })); r.onerror = () => ok(base); r.readAsDataURL(f);
  });
  const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;
  function seniority(start) {
    if (start > TODAY) return 'Arrivée prévue';
    const a = parse(start), b = parse(TODAY);
    let m = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth(); if (b.getDate() < a.getDate()) m--;
    const y = Math.floor(m / 12); m %= 12;
    return [y ? plural(y, 'an', 'ans') : '', m ? `${m} mois` : ''].filter(Boolean).join(' et ') || 'Moins d’un mois';
  }
  function nextMonday(from, weeks = 0) { let s = addDays(from, 1); while (parse(s).getDay() !== 1) s = addDays(s, 1); return addDays(s, weeks * 7); }

  const emp = (id) => db.employees.find((e) => e.id === id);
  // Le profil « Salarié » peut être vu sous les traits de n'importe quel collaborateur, dont une nouvelle recrue.
  // V2 : le profil « Manager » peut être vu sous les traits de n'importe quel manager, dont la Direction (Claire Durand).
  // Dans une entreprise fraîchement installée, les profils de démonstration prennent les traits d'un manager et d'un salarié importés.
  function profileBase(k) {
    const id = PROFILES[k].emp; if (emp(id)) return id;
    const act = db.employees.filter((e) => e.stage < 15 && e.id !== 'e1'), hasRep = (e) => db.employees.some((y) => y.managerId === e.id && y.stage < 15);
    const f = k === 'manager' ? act.find((e) => hasRep(e) && e.managerId) || act.find(hasRep) : k === 'salarie' ? act.find((e) => !hasRep(e)) : null; return f ? f.id : 'e1';
  }
  const profileOk = (k) => k === 'rh' || profileBase(k) !== 'e1';
  const profileEmp = (k) => emp(k === 'salarie' && ui.asEmp && emp(ui.asEmp) ? ui.asEmp : k === 'manager' && ui.asMgr && emp(ui.asMgr) ? ui.asMgr : profileBase(k));
  // RH et managers ont aussi leur espace personnel : le profil « salarié » s'affiche alors sous leurs propres traits (ui.selfOf).
  const persona = () => ui.selfOf || ui.profile;
  const meOf = (k) => (k === 'salarie' && ui.selfOf ? profileEmp(ui.selfOf) : profileEmp(k));
  const me = () => meOf(ui.profile);
  const fullName = (e) => (e ? `${e.firstName} ${e.lastName}` : '—');
  const initials = (e) => (e.firstName[0] + e.lastName[0]).toUpperCase();
  const AV_COLORS = ['#6366f1', '#db2777', '#0891b2', '#d97706', '#059669', '#7c3aed', '#e11d48', '#0284c7', '#c026d3', '#0d9488'];
  const avColor = (id) => { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return AV_COLORS[h % AV_COLORS.length]; };
  const avatar = (e, cls = '') => `<span class="av ${cls}" style="background:${avColor(e.id)}" aria-hidden="true">${esc(initials(e))}</span>`;
  const avatarName = (id, name, cls = '') => `<span class="av ${cls}" style="background:${avColor(id)}" aria-hidden="true">${esc(name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase())}</span>`;
  const DEPTS = ['Direction', 'RH', 'Design', 'Tech', 'Marketing', 'Sales', 'Finance'];
  const DEPT_HEAD = { Direction: 'e5', RH: 'e1', Design: 'e2', Tech: 'e6', Marketing: 'e7', Sales: 'e8', Finance: 'e9' };
  // Direction : réglable dans Paramètres (Nova Studio : Claire Durand).
  const DIR_ID = () => (db.settings && db.settings.directionId) || 'e5';

  const leaveOn = (e, day) => db.leaves.find((l) => l.empId === e.id && l.status === 'Approuvée' && l.start <= day && l.end >= day);
  // V2 : statut calculé à partir des faits (dates, période d'essai, absence du jour), pas d'une étape.
  // Renvoie [libellé affiché, couleur, catégorie utilisée par les filtres].
  function statusOf(e) {
    if (e.stage >= 15) return ['Sorti', 'neutral', 'Sorti'];
    if (e.stage >= 13) { const x = e.exit || {}; return [x.lastDay ? `Départ le ${fmtShort(x.lastDay)}${x.reason ? ` · ${x.reason.toLowerCase()}` : ''}` : 'Départ en cours', 'bad', 'Départ en cours']; }
    if (inArrival(e) && e.startDate > TODAY) return [`Arrivée le ${fmtShort(e.startDate)}`, 'accent', 'Arrivée prévue'];
    if (e.stage <= 4) { const t = trialInfo(e), dec = dossier(e).trialDecision;
      if (t && dec !== 'Confirmée' && t.end >= TODAY) return [`Essai jusqu’au ${fmtShort(t.end)}`, 'accent', 'Période d’essai'];
      return ['En intégration', 'info', 'En intégration']; }
    const l = leaveOn(e, TODAY);
    if (l) return l.type === 'Télétravail' ? ['Télétravail', 'info', 'Télétravail'] : ['Absent', 'warn', 'Absent'];
    return ['En poste', 'ok', 'En poste'];
  }
  const statusPill = (e) => { const [t, c] = statusOf(e); return `<span class="pill ${c}">${t}</span>`; };
  // Pendant l'arrivée (étape 2 : pré-embauche et embauche menées en parallèle), la recrue est salariée dès son premier jour.
  const isEmployed = (e) => (e.stage >= 3 && e.stage < 15) || (e.stage === 2 && e.startDate <= TODAY);
  const inArrival = (e) => e.stage === 2 || e.stage === 3;
  const isIntern = (e) => e.contract === 'Stage';
  // Avant son premier jour, une recrue n'a accès qu'à la pré-embauche et à l'embauche.
  const locked = (e) => inArrival(e) && e.startDate > TODAY;

  function scopeEmployees() {
    const m = me();
    if (ui.profile === 'rh') return db.employees;
    if (ui.profile === 'manager') return db.employees.filter((e) => e.managerId === m.id);
    return [m];
  }
  // Un manager ne voit que ses propres besoins ; en recrutement, il voit aussi les offres où il est évaluateur invité.
  const jobManager = (j) => j.managerId || j.requestedBy;
  const scopeNeeds = () => (ui.profile === 'rh' ? db.jobs : ui.profile === 'manager' ? db.jobs.filter((j) => jobManager(j) === me().id || j.requestedBy === me().id) : []);
  const scopeJobs = () => (ui.profile === 'rh' ? db.jobs : ui.profile === 'manager' ? db.jobs.filter((j) => jobManager(j) === me().id || j.requestedBy === me().id || (j.reviewers || []).includes(me().id)) : []);
  const jobRef = (j) => `${NEED_OPEN.includes(j.status) ? 'OFF' : 'BES'}-${j.createdAt.slice(0, 4)}-${String(j.num || 0).padStart(3, '0')}`;
  const activeCand = (c) => !['Embauché', 'Refusé'].includes(c.stage);
  const scopeCandidates = () => { const ids = new Set(scopeJobs().filter((j) => j.status === 'Ouverte').map((j) => j.id)); return db.candidates.filter((c) => ids.has(c.jobId)); };
  function pendingForMe() {
    if (ui.profile === 'rh') return db.leaves.filter((l) => l.status === 'En attente' && l.empId !== me().id);
    if (ui.profile === 'manager') { const team = new Set(scopeEmployees().map((e) => e.id).concat(backupFor(me()).map((e) => e.id))); team.delete(me().id); return db.leaves.filter((l) => l.status === 'En attente' && team.has(l.empId)); }
    return [];
  }
  const approverOf = (e) => (e.managerId ? emp(e.managerId) : emp('e1'));
  // V2 · valideur de secours : quand un manager est absent aujourd'hui, son propre manager valide les demandes de son équipe.
  const isAway = (e) => { const l = e && leaveOn(e, TODAY); return !!l && l.type !== 'Télétravail'; };
  const backupFor = (m) => (db.settings && db.settings.conges.backup === false ? [] : db.employees.filter((x) => x.managerId === m.id && isAway(x)).flatMap((x) => db.employees.filter((y) => y.managerId === x.id && y.stage < 15)));
  const backupOf = (e) => { const ap = approverOf(e); if (db.settings && db.settings.conges.backup === false) return null; return isAway(ap) && ap.managerId ? emp(ap.managerId) : null; };

  function notify(to, text) { if (to) db.notifications.unshift({ id: uid('n'), to, text, date: TODAY, read: false }); }
  function toast(msg, kind = 'ok') {
    const box = document.getElementById('toasts');
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = (kind === 'ok' ? ic('check') : '') + `<span>${esc(msg)}</span>`;
    box.appendChild(t); while (box.children.length > 3) box.firstChild.remove(); setTimeout(() => t.remove(), 3600);
  }
  // Points à suivre d'une rubrique d'arrivée ou de départ ; ceux de l'intégration suivent le programme défini par les RH.
  const CHECK_STEPS = ['Point de suivi à 30 jours', 'Rapport d’étonnement', 'Décision sur la période d’essai (ou bilan s’il n’y en a pas)'];
  const stageSteps = (i) => (i === 4 ? (db.onboardingPlan || []).map((x) => x.label).concat(CHECK_STEPS) : STAGES[i].steps);
  function journeyOf(id, stage) {
    const who = emp(id), n = stageSteps(stage).length;
    if (who && ((who.stage === 2 && (stage === 2 || stage === 3)) || (who.stage === 4 && stage === 4))) return arrivalSteps(who, stage);
    if (who && who.stage === stage && stage >= 13) return departSteps(who, stage);
    const arr = (db.journey[id] && db.journey[id][stage]) || [];
    return Array.from({ length: n }, (_, k) => !!arr[k]);
  }

  // ---------------------------------------------------------------- Payroll
  const PAY_FIRST = '2026-07';
  function payMonths() { const last = monthKey(TODAY) > '2026-10' ? monthKey(TODAY) : '2026-10'; const out = []; for (let m = PAY_FIRST; m <= last; m = shiftMonth(m, 1)) out.push(m); return out; }
  const payrollOf = (m) => (db.payroll[m] = db.payroll[m] || { closed: false, bonus: {} });
  function inPayroll(e, m) { const start = m + '-01', end = monthEnd(m); if (e.startDate > end) return false; if (e.exit && e.exit.lastDay < start) return false; return e.stage >= 2 || e.startDate <= end; }
  // A raise or a job change can take effect later: until then the current salary applies.
  const salaryAt = (e, m) => (e.salaryNext && `${m}-01` >= e.salaryNext.from ? e.salaryNext.amount : e.salary);
  function normalizeEmployees() {
    db.employees.forEach((e) => {
      // Plus de chronologie entre l'intégration et le départ : un collaborateur en poste a un seul état.
      if (e.stage > 5 && e.stage < 13) e.stage = 5;
      if (!e.category) e.category = e.contract === 'Alternance' || e.contract === 'Stage' ? 'Employé' : e.salary >= 45000 ? 'Cadre' : 'Employé';
      if (e.zone === undefined) e.zone = 'France'; if (e.nationality === undefined) e.nationality = '';
      if (e.sex === undefined) e.sex = null; if (!e.family) e.family = 'Célibataire'; if (e.iban === undefined) e.iban = '—';
      if (e.registeredAt === undefined) e.registeredAt = e.stage >= 3 ? e.startDate : null;
    });
  }
  // Un contrat déclaré signé sans document (données importées ou signature sur papier ancienne) reçoit son exemplaire, figé, pour rester consultable.
  function ensureSignedContracts() {
    Object.entries(db.onboarding || {}).forEach(([id, d]) => {
      const c = d && d.contract, e = emp(id);
      if (!e || !c || c.status !== 'Signé' || (c.docId && db.documents.some((x) => x.id === c.docId))) return;
      const doc = addDoc(id, 'contrat', { date: c.sentAt || c.signedAt || e.startDate });
      Object.assign(doc, { status: 'Signé', signedAt: c.signedAt || doc.date, issuedAt: c.sentAt || c.signedAt || doc.date, html: unmark(doc.html || '') });
      c.docId = doc.id; if (!c.signedAt) c.signedAt = doc.signedAt; if (c.paper === undefined) c.paper = true;
    });
  }
  // Statut des documents de départ : remis ou signés, sauf contrat en attente et documents de sortie pas encore remis.
  function normalizeDocs() {
    db.documents.forEach((d) => {
      const sc = d.kind === 'contrat' && db.onboarding && db.onboarding[d.empId] && db.onboarding[d.empId].contract;
      if (sc && sc.docId === d.id && sc.status === 'Signé' && d.status !== 'Signé') Object.assign(d, { status: 'Signé', signedAt: d.signedAt || sc.signedAt || TODAY });
      if (d.status) { if (!docLocked(d)) ensureDocHtml(d); return; }
      const c = db.onboarding && db.onboarding[d.empId] && db.onboarding[d.empId].contract, o = db.offboarding && db.offboarding[d.empId];
      d.status = d.kind === 'contrat' && c && c.docId === d.id && c.status !== 'Signé' ? (c.status === 'Envoyé' ? 'Envoyé' : 'Brouillon')
        : ['certificat', 'solde', 'france-travail'].includes(d.kind) && o && !o.docsGiven ? 'Brouillon' : d.kind === 'contrat' ? 'Signé' : 'Remis';
      if (!docLocked(d)) ensureDocHtml(d);
    });
  }
  function applyDueSalaries() { db.employees.forEach((e) => { if (e.salaryNext && e.salaryNext.from <= TODAY) { e.salary = e.salaryNext.amount; delete e.salaryNext; } }); }
  // ---- Moteur de bulletin (valeurs de démonstration ; le calcul réel est fait par le prestataire de paie).
  // Bulletin clarifié : rubriques Santé, Accidents du travail, Retraite, Famille, Assurance chômage, Autres contributions, CSG-CRDS, allègements.
  const PSS = 4005, SMIC_M = 1801.80, HOURS_M = 151.67;
  let TR_VALUE = 10, TR_EMPLOYER = 6, TT_DAY = 2.70, TT_ALLOW_MAX = 59.40, MUT_S = 30, MUT_P = 45, PAY_CUTOFF = 20;
  const STAGE_FREE = 659.76;
  const TRANSPORT = { Paris: 88.80, Lyon: 74.70 };
  const COMPANY_PAY = { naf: '7410Z · Activités spécialisées de design', urssaf: 'Urssaf Île-de-France', idcc: 'Syntec (IDCC 1486)', paidOn: (m) => { let d = monthEnd(m); while (!isWork(d)) d = addDays(d, -1); return d; } };
  // Taux de prélèvement à la source transmis par l'administration fiscale (démonstration).
  const pasRate = (e) => [0, 0.031, 0.052, 0.075, 0.094, 0.118][hashPay(e.id) % 6];
  const hashPay = (s) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  const classification = (e) => (e.contract === 'Stage' ? 'Stagiaire (gratification)' : e.contract === 'Alternance' ? 'Apprenti' : e.category === 'Cadre' ? `Cadre · position ${e.salary >= 70000 ? '3.1 · coefficient 170' : e.salary >= 55000 ? '2.3 · coefficient 150' : '2.2 · coefficient 130'}` : `ETAM · position ${e.salary >= 40000 ? '3.2 · coefficient 450' : '2.3 · coefficient 400'}`);
  // Variables saisies du mois (notes de frais, acompte) et éléments calculés depuis le reste du logiciel.
  const payExtra = (m, id) => ((payrollOf(m).extra || {})[id] || {});
  function absencesOf(e, m) {
    const start = m + '-01', end = monthEnd(m), clip = (l) => [l.start < start ? start : l.start, l.end > end ? end : l.end];
    const list = db.leaves.filter((l) => l.empId === e.id && l.status === 'Approuvée' && l.start <= end && l.end >= start);
    const days = (t) => list.filter((l) => l.type === t).reduce((s, l) => { const [a, b] = clip(l); return s + workDays(a, b); }, 0);
    const sick = list.filter((l) => IJ_TYPES.includes(l.type)).map((l) => { const [a, b] = clip(l), carenceEnd = addDays(l.start, 2);
      // Carence de 3 jours pour la maladie seulement (accident du travail, maternité et paternité : aucune).
      const cal = dayDiff(a, b) + 1, carence = l.type !== 'Maladie' ? 0 : Math.max(0, Math.min(cal, dayDiff(a, carenceEnd < b ? carenceEnd : b) + 1)) * (a <= carenceEnd ? 1 : 0);
      return { l, from: a, to: b, work: workDays(a, b), cal, carence, paid: cal - carence }; });
    return { cp: days('Congés payés'), rtt: days('RTT'), tt: days('Télétravail'), unpaid: days('Sans solde') + days('Congé parental') + days('Enfant malade'), fam: days('Événement familial'), sick };
  }
  function calcPay(e, m) {
    const start = m + '-01', end = monthEnd(m), quot = ((e.changeNext && e.changeNext.from <= `${m}-01` ? e.changeNext.quotite : e.quotite) || 100) / 100, sal = salaryAt(e, m) * quot, monthly = sal / 12, wd = Math.max(1, workDays(start, end));
    let base = monthly;
    if (e.startDate > start) base *= workDays(e.startDate, end) / wd;
    if (e.exit && e.exit.lastDay < end) base *= workDays(start, e.exit.lastDay) / wd;
    const x = payExtra(m, e.id), pr = payrollOf(m), d = dossierLight(e);
    const bonus = Number(pr.bonus[e.id] || 0), ppv = Number((pr.ppv || {})[e.id] || 0);
    const ot = overtimePay(Object.assign({}, e, { salary: sal }), m), abs = absencesOf(e, m);
    // Absences : retenue, indemnités journalières (50 % du salaire journalier, après 3 jours de carence) et maintien de salaire après l'ancienneté prévue par la convention (1 an au plus).
    const daily = monthly / wd, ijDay = Math.min((sal / 365) * 0.5, (1.8 * SMIC_M * 3 / 91.25) * 0.5), senior = start >= addMonths(e.startDate, CONV().rules.maintien);
    const earn = [[quot < 1 ? `Salaire de base · temps partiel ${Math.round(quot * 100)} %` : 'Salaire de base', e.category === 'Cadre' ? `Forfait ${Math.round(218 * quot)} jours` : `${String(Math.round(HOURS_M * quot * 100) / 100).replace('.', ',')} h`, '', base]];
    let ij = 0;
    abs.sick.forEach((s) => {
      const ret = daily * s.work, ijs = ijDay * s.paid; ij += s.l.subrogation ? ijs : 0;
      earn.push([`Absence ${{ Maladie: 'maladie', 'Accident du travail': 'accident du travail', Maternité: 'congé de maternité', 'Paternité et accueil de l’enfant': 'congé de paternité' }[s.l.type] || 'maladie'} du ${fmtShort(s.from)} au ${fmtShort(s.to)}`, `${plural(s.work, 'jour', 'jours')}`, '', -ret]);
      if (senior) earn.push([`Complément employeur (maintien de salaire${CONV().kind === 'code' ? ' légal' : ` ${CONV().short}`})`, '', '', Math.max(0, ret - ijs)]);
    });
    if (abs.unpaid) earn.push(['Absence non rémunérée (sans solde, congé parental, enfant malade)', `${plural(abs.unpaid, 'jour', 'jours')}`, '', -daily * abs.unpaid]);
    if (ot.amount) earn.push([`Heures supplémentaires (${fmtH(ot.h25)} à 25 %${ot.h50 ? `, ${fmtH(ot.h50)} à 50 %` : ''})`, fmtH(ot.h25 + ot.h50), '', ot.amount]);
    if (bonus) earn.push(['Prime exceptionnelle', '', '', bonus]);
    // V2 · sortie dans le mois : indemnités soumises dans le brut, indemnité de rupture (exonérée dans la limite légale) dans les éléments non soumis.
    const xOut = e.exit && e.exit.lastDay >= start && e.exit.lastDay <= end && e.stage >= 13 ? exitIndemnities(e) : null;
    if (xOut && xOut.cpPay) earn.push([`Indemnité compensatrice de congés payés (${e.cp} j)`, '', '', xOut.cpPay]);
    if (xOut && xOut.precarite) earn.push(['Indemnité de fin de contrat (10 %)', '', '', xOut.precarite]);
    const gross = Math.max(0, earn.reduce((s, r) => s + r[3], 0));
    // Tranches
    const T1 = Math.min(gross, PSS), T2 = Math.max(0, Math.min(gross, 8 * PSS) - PSS), cad = e.category === 'Cadre';
    const stage = e.contract === 'Stage', appr = e.contract === 'Alternance';
    const salBase = stage ? Math.max(0, gross - STAGE_FREE) : appr ? Math.max(0, gross - 0.5 * SMIC_M) : gross; // exonérations salariales stagiaire et apprenti
    const k = salBase / Math.max(1, gross); // part de la rémunération soumise côté salarié
    const mut = d.mutuelle === 'Dispense' || stage ? null : { s: MUT_S, p: MUT_P };
    const rows = [];
    const R = (group, label, baseV, ts, tp, fs = null, fp = null) => rows.push({ group, label, base: baseV, ts, tp, s: fs !== null ? fs : baseV * ts, p: fp !== null ? fp : baseV * tp });
    if (!stage || gross > STAGE_FREE) {
      const g = stage ? gross - STAGE_FREE : gross;
      R('Santé', 'Sécurité sociale · maladie, maternité, invalidité, décès', g, 0, gross > 2.5 * SMIC_M ? 0.13 : 0.07);
      if (mut) R('Santé', 'Complémentaire santé (mutuelle)', null, 0, 0, mut.s, mut.p);
      if (cad) R('Santé', 'Prévoyance des cadres', T1, 0, 0.015);
      R('Accidents du travail · maladies professionnelles', 'Accidents du travail · maladies professionnelles', g, 0, 0.009);
      R('Retraite', 'Sécurité sociale plafonnée', Math.min(g, PSS), 0.069 * k, 0.0855);
      R('Retraite', 'Sécurité sociale déplafonnée', g, 0.004 * k, 0.0202);
      R('Retraite', 'Complémentaire tranche 1 (Agirc-Arrco)', Math.min(g, PSS), 0.0315 * k, 0.0472);
      R('Retraite', 'Contribution d’équilibre général tranche 1', Math.min(g, PSS), 0.0086 * k, 0.0129);
      if (T2) { R('Retraite', 'Complémentaire tranche 2 (Agirc-Arrco)', T2, 0.0864, 0.1295); R('Retraite', 'Contribution d’équilibre général tranche 2', T2, 0.0108, 0.0162); R('Retraite', 'Contribution d’équilibre technique', Math.min(gross, 8 * PSS), 0.0014, 0.0021); }
      if (cad) R('Retraite', 'Apec (cadres)', Math.min(gross, 4 * PSS), 0.00024, 0.00036);
      R('Famille', 'Famille', g, 0, gross > 3.5 * SMIC_M ? 0.0525 : 0.0345);
      R('Assurance chômage', 'Assurance chômage', Math.min(g, 4 * PSS), 0, 0.0405);
      R('Assurance chômage', 'Garantie des salaires (AGS)', Math.min(g, 4 * PSS), 0, 0.0025);
      const vm = e.location === 'Lyon' ? 0.02 : 0.032;
      R('Autres contributions dues par l’employeur', 'Autres contributions dues par l’employeur', g, 0, 0.001 + 0.003 + vm + 0.01 + 0.0068);
      const csgBase = salBase * 0.9825 + (mut ? mut.p : 0) + (cad ? T1 * 0.015 : 0) * k;
      R('CSG · CRDS', 'CSG déductible de l’impôt sur le revenu', csgBase, 0.068, 0);
      R('CSG · CRDS', 'CSG et CRDS non déductibles de l’impôt sur le revenu', csgBase, 0.029, 0);
    }
    // Réduction générale des cotisations patronales (salaires inférieurs à 1,6 SMIC).
    const rg = gross > 0 && gross < 1.6 * SMIC_M && !stage ? Math.min(0.3194, (0.3194 / 0.6) * (1.6 * SMIC_M / gross - 1)) * gross : 0;
    const salTot = rows.reduce((s, r) => s + r.s, 0), empTot = rows.reduce((s, r) => s + r.p, 0) - rg;
    const csgNd = rows.filter((r) => /non déductibles/.test(r.label)).reduce((s, r) => s + r.s, 0);
    const empHealth = (mut ? mut.p : 0);
    const netSocial = gross - salTot + empHealth;
    const netImposable = gross - salTot + csgNd + empHealth;
    // Éléments non soumis : remboursements, titres-restaurant, frais, acompte, prime de partage de la valeur.
    const workedDays = Math.max(0, wd - abs.cp - abs.rtt - abs.unpaid - abs.sick.reduce((s, x) => s + x.work, 0) - (e.startDate > start ? workDays(start, addDays(e.startDate, -1)) : 0) - (e.exit && e.exit.lastDay < end ? workDays(addDays(e.exit.lastDay, 1), end) : 0));
    const trN = stage ? 0 : workedDays, trSal = trN * (TR_VALUE - TR_EMPLOYER);
    const transport = (TRANSPORT[siteOf(e)] || 0) / 2, tele = Math.min(TT_ALLOW_MAX, abs.tt * TT_DAY);
    const ndf = Number(x.ndf || 0), acompte = Number(x.acompte || 0), ppvNet = ppv * (1 - 0.097);
    const extras = [ij ? ['Indemnités journalières de Sécurité sociale (subrogation, nettes de CSG-CRDS)', ij * 0.933] : null, transport ? ['Remboursement des transports en commun (50 %)', transport] : null,
      tele ? [`Allocation forfaitaire de télétravail (${plural(abs.tt, 'jour', 'jours')})`, tele] : null, ndf ? ['Remboursement de notes de frais', ndf] : null, ppv ? ['Prime de partage de la valeur (nette de CSG-CRDS 9,7 %)', ppvNet] : null, xOut && xOut.legal ? [`Indemnité de rupture (${e.exit.reason.toLowerCase()})`, xOut.legal] : null,
      trN ? [`Titres-restaurant (${trN} × ${eur(TR_VALUE)}, part salariale)`, -trSal] : null, acompte ? ['Acompte versé', -acompte] : null].filter(Boolean);
    const netBefore = gross - salTot + extras.reduce((s, r) => s + r[1], 0), rate = pasRate(e), tax = netImposable * rate;
    return { ijNet: ij * 0.933, base, bonus, ot, ppv, ppvNet, gross, earn, rows, rg, salTot, empTot, contrib: salTot, netSocial, netImposable, extras, netBefore, rate, tax, net: netBefore - tax,
      cost: gross + empTot, leaveDays: abs.cp + abs.rtt, abs, trN, trEmployer: trN * TR_EMPLOYER, transport, tele, ndf, acompte, workedDays, lines: rows.map((r) => [r.label, r.ts, r.s]) };
  }
  const dossierLight = (e) => (db.onboarding && db.onboarding[e.id]) || {};

  // ---------------------------------------------------------------- Shell
  // The wheel is the main menu: each stage of the journey opens a module. A profile only sees the stages it needs.
  // 'etape' = the stage page itself (people at this stage and their tasks); 'etape-moi' = shown to an employee on their current stage only.
  const STAGE_VIEW = {
    // V2 : pré-embauche, embauche et intégration forment un seul dossier « Arrivées » ; les trois temps du départ, un dossier « Départs ».
    rh: ['besoins', 'recrutement', 'arrivees', null, null, 'collaborateurs', 'absences', 'paie', 'entretiens', 'formation', 'mobilite', 'sante', 'relations', 'departs', null, null],
    manager: ['besoins', 'recrutement', 'arrivees', null, null, 'collaborateurs', 'absences', 'paie', 'entretiens', 'formation', 'mobilite', 'sante', 'relations', 'departs', null, null],
    salarie: [null, null, 'arrivee', 'contrat', 'etape-moi', 'profil', 'absences', 'bulletins', 'entretiens', 'formation', 'mobilite', 'sante', 'relations', 'etape-moi', 'etape-moi', 'etape-moi'],
  };
  const VIEW_LABELS = {
    rh: { arrivees: 'Arrivées', departs: 'Départs', accueil: 'Accueil', reporting: 'Reporting RH', modeles: 'Modèles de documents', parametres: 'Paramètres', obligations: 'Obligations selon l’effectif', besoins: 'Besoins de recrutement', collaborateurs: 'Collaborateurs', absences: 'Absences', paie: 'Paie', recrutement: 'Recrutement', entretiens: 'Entretiens', formation: 'Formation', mobilite: 'Mobilité', sante: 'Santé & QVT', relations: 'Relations individuelles' },
    manager: { arrivees: 'Arrivées', departs: 'Départs', accueil: 'Accueil', besoins: 'Besoins de recrutement', collaborateurs: 'Mon équipe', absences: 'Absences', paie: 'Rémunération de l’équipe', recrutement: 'Recrutement', entretiens: 'Entretiens', formation: 'Formation', mobilite: 'Mobilité', sante: 'Santé & QVT', relations: 'Signalements' },
    salarie: { accueil: 'Accueil', arrivee: 'Mon arrivée', contrat: 'Contrat de travail', profil: 'Mon profil', absences: 'Mes absences', bulletins: 'Mes bulletins', entretiens: 'Mes entretiens', formation: 'Formations', mobilite: 'Mobilité', sante: 'Santé & QVT', relations: 'Échanges RH' },
  };
  // Stage indexes shown in the wheel for the current profile, in journey order.
  function visibleStages() {
    const m = me();
    if (ui.profile === 'salarie' && locked(m)) return [2, 3];
    return STAGES.map((s, i) => i).filter((i) => { const v = STAGE_VIEW[ui.profile][i]; return v === 'etape-moi' ? m.stage === i : v === 'arrivee' ? inArrival(m) : !!v; });
  }
  const stageView = (i) => (STAGE_VIEW[ui.profile][i] === 'etape-moi' ? 'etape' : STAGE_VIEW[ui.profile][i]);
  const canView = (v) => v === 'accueil' || (['reporting', 'modeles', 'parametres', 'obligations'].includes(v) && ui.profile === 'rh') || (v === 'etape' ? visibleStages().includes(ui.stage) : visibleStages().some((i) => stageView(i) === v));
  function navCount(v) {
    const p = ui.profile, m = me(), ids = new Set(scopeEmployees().map((e) => e.id));
    if (v === 'absences') return pendingForMe().length + pendingSheets().length + (p === 'rh' ? db.leaves.filter((l) => IJ_TYPES.includes(l.type) && !l.dsnAt).length : 0);
    if (v === 'paie') { const pm = payCurrent(), prep = payStatus(pm) === 'Préparation';
      return p === 'rh' ? Object.values(db.raises.proposals).filter((x) => x.status === 'Proposée').length + (prep ? openChecks(pm).length : 0) + (payStatus(pm) === 'Reçue' ? 1 : 0)
        : p === 'manager' ? (db.raises.status === 'Ouverte' ? scopeEmployees().filter((e) => raiseEligible(e) && !db.raises.proposals[e.id]).length : 0) + (prep && teamOf(me(), pm).length && !(payrollOf(pm).mgrOk || {})[me().id] ? 1 : 0) : 0; }
    if (v === 'besoins') return needsToDo().length;
    if (v === 'recrutement') return recTodo().size;
    if (v === 'collaborateurs') return p === 'rh' ? pendingChanges().length + adminDeadlines(db.employees).filter((x) => x.date <= addDays(TODAY, 14)).length : 0;
    if (v === 'arrivee') return myArrivalTodo(m);
    if (v === 'contrat') return m.stage === 2 && dossier(m).contract.status === 'Envoyé' ? 1 : 0;
    if (v === 'entretiens') return db.reviews.filter((r) => (p === 'salarie' ? r.empId === m.id && ['Planifié', 'À signer'].includes(r.status)
      : p === 'manager' ? ids.has(r.empId) && ['À planifier', 'Auto-évaluation faite'].includes(r.status) : r.status === 'À planifier')).length;
    if (v === 'formation') return p === 'rh' ? db.enrollments.filter((x) => x.status === 'Validée manager').length : p === 'manager' ? db.enrollments.filter((x) => x.status === 'Demandée' && ids.has(x.empId)).length : 0;
    if (v === 'mobilite') return p === 'rh' ? db.wishes.filter((w) => w.status === 'Exprimé').length : p === 'manager' ? db.wishes.filter((w) => ids.has(w.empId) && !w.mgrOpinion && ['Exprimé', 'En étude'].includes(w.status)).length : 0;
    if (v === 'sante') return p === 'rh' ? db.incidents.filter((x) => x.status === 'Déclaré').length + db.adjustments.filter((x) => x.status === 'Demandé').length
      : p === 'salarie' && !locked(m) && !db.survey.some((x) => x.empId === m.id && x.month === monthKey(TODAY)) ? 1 : 0;
    if (v === 'relations') return p === 'rh' ? db.cases.filter((c) => c.status === 'Ouvert').length : 0;
    return 0;
  }
  // Pastille d'une étape : le nombre de sujets qui attendent le profil courant (c'est la seule alerte de l'application).
  function stageTodo(i) {
    const v = stageView(i);
    if (v === 'arrivees' || v === 'departs') return procPeople(v).filter((e) => procActions(e).length).length;
    if (v !== 'etape') return navCount(v);
    if (ui.profile === 'salarie') return i === 4 && me().stage === 4 && !dossier(me()).astonish && TODAY >= addDays(me().startDate, 20) ? 1 : 0;
    return scopeEmployees().filter((e) => atStage(e, i) && (i <= 4 ? arrivalActions(e, i).length : ui.profile === 'rh' && departActions(e).length)).length;
  }
  function stageBadge(i) { const n = stageTodo(i); return n ? `<span class="badge todo num" title="À traiter">${n}</span>` : ''; }
  function topbar() {
    const st = ui.view === 'accueil' ? null : ui.stage;
    const title = ui.view === 'etape' ? esc(STAGES[st].title) : VIEW_LABELS[ui.profile][ui.view];
    const crumb = st === null ? `${esc(COMPANY.nom)} · ${esc(fullName(me()))}` : `<b style="color:${STAGE_COLORS[st]}">${esc(stageDef(st).title)}</b>`;
    const mine = db.notifications.filter((n) => n.to === me().id);
    const unread = mine.filter((n) => !n.read).length;
    return `<header class="top"><button type="button" class="brand" data-act="go" data-v="accueil" aria-label="Teamora · retour à l’accueil" title="Teamora · retour à l’accueil"><span class="brand-mark">${LOGO}</span></button>
      <div class="top-title"><div class="crumb">${crumb}</div><h1>${title}</h1></div>
      <div class="top-right">${TENANT === 'new' ? '' : `<div class="persona" role="group" aria-label="Voir l’application en tant que">${Object.entries(PROFILES).filter(([k]) => profileOk(k)).map(([k, p]) => { const e = profileEmp(k);
        return `<button type="button" data-act="persona" data-p="${k}" aria-pressed="${persona() === k}" title="${esc(fullName(e))} · ${p.label}">${avatar(e)}<span class="p-l"><span class="who-name">${esc(e.firstName)} ·</span> ${p.label}</span></button>`; }).join('')}</div>`}
      ${ui.profile === 'salarie' && !ui.selfOf ? asEmpSelect() : ''}${persona() === 'manager' ? asMgrSelect() : ''}${spaceSwitch()}
      ${todoBtn()}
      <button type="button" class="icon-btn" data-act="notif" aria-label="Notifications (${unread} non lues)" aria-expanded="${ui.notif}">${ic('bell')}${unread ? `<span class="dot num">${unread}</span>` : ''}</button></div>
      ${ui.notif ? `<div class="card notif-pop" data-act="noop"><div class="card-h"><h3>Notifications</h3>${unread ? '<button type="button" class="btn ghost sm" data-act="notif-read">Tout marquer comme lu</button>' : ''}</div>
        ${mine.length ? mine.slice(0, 8).map((n) => `<div class="notif ${n.read ? '' : 'unread'}"><div>${esc(n.text)}<small>${fmtDate(n.date)}</small></div></div>`).join('') : '<div class="empty">Aucune notification.</div>'}</div>` : ''}</header>`;
  }
  // Bascule entre la gestion (salariés ou équipe) et l'espace personnel, avec le nombre de choses à traiter de l'autre côté.
  function inSpace(profile, selfOf, fn) { const s = [ui.profile, ui.selfOf]; ui.profile = profile; ui.selfOf = selfOf; try { return fn(); } finally { [ui.profile, ui.selfOf] = s; } }
  const spaceTodo = (perso) => inSpace(perso ? 'salarie' : persona(), perso ? persona() : null, () => visibleStages().reduce((s, i) => s + stageTodo(i), 0));
  function spaceSwitch() {
    const p = persona(); if (!['rh', 'manager'].includes(p)) return '';
    const perso = !!ui.selfOf, other = spaceTodo(!perso), b = (on, s, label) => `<button type="button" data-act="space" data-s="${s}" aria-pressed="${on}">${label}${!on && other ? `<span class="badge todo num" title="À traiter">${other}</span>` : ''}</button>`;
    return `<div class="space-sw" role="group" aria-label="Espace affiché">${b(!perso, 'gestion', p === 'rh' ? 'Salariés' : 'Mon équipe')}${b(perso, 'perso', 'Mon espace')}</div>`;
  }
  // Outside the home page, the wheel's stages stay reachable as a strip, in the same order and colours.
  function stageRail() {
    if (ui.view === 'accueil') return '';
    return `<nav class="rail" aria-label="Rubriques"><button type="button" class="rail-home" data-act="go" data-v="accueil" aria-label="Retour à la roue" title="Retour à la roue">${ic('home')}</button>${ui.profile === 'rh' ? `<button type="button" class="rail-home rail-rep" data-act="go" data-v="reporting" aria-label="Reporting RH" title="Reporting RH" ${ui.view === 'reporting' ? 'aria-current="page"' : ''}>${ic('chart')}</button><button type="button" class="rail-home rail-rep" data-act="go" data-v="modeles" aria-label="Modèles de documents" title="Modèles de documents" ${ui.view === 'modeles' ? 'aria-current="page"' : ''}>${ic('file')}</button><button type="button" class="rail-home rail-rep" data-act="go" data-v="obligations" aria-label="Obligations selon l’effectif" title="Obligations selon l’effectif" ${ui.view === 'obligations' ? 'aria-current="page"' : ''}>${ic('docCheck')}${(() => { const n = complianceTodo().length; return n ? `<span class="badge todo num" title="À traiter">${n}</span>` : ''; })()}</button><button type="button" class="rail-home rail-rep" data-act="go" data-v="parametres" aria-label="Paramètres" title="Paramètres" ${ui.view === 'parametres' ? 'aria-current="page"' : ''}>${ic('gear')}</button><span class="rail-sep"></span>` : ''}
      ${visibleStages().map((i) => { const name = stageDef(i).short;
        return `<button type="button" data-act="stage" data-i="${i}" style="--c:${STAGE_COLORS[i]}" aria-label="${esc(name)}" title="${esc(name)}" ${ui.stage === i ? 'aria-current="page"' : ''}>${ic(stageDef(i).icon)}${stageBadge(i)}</button>`; }).join('')}</nav>`;
  }
  // V2 : tout ce qui attend le profil courant, rassemblé en un seul endroit (les pastilles de la roue en donnent le détail par rubrique).
  function todoItems() {
    return visibleStages().map((i) => { const n = stageTodo(i), v = stageView(i); if (!n) return null;
      const people = (v === 'arrivees' || v === 'departs') ? procPeople(v).map((e) => [e, procActions(e)]).filter(([, a]) => a.length) : [];
      return { i, v, n, name: stageDef(i).short, people }; }).filter(Boolean);
  }
  function todoBtn() { const n = todoItems().reduce((s, x) => s + x.n, 0) + complianceTodo().length;
    return `<button type="button" class="btn ${n ? 'primary' : 'ghost'} sm todo-btn" data-act="todo-open" aria-label="À traiter : ${n}">${ic('check')}<span class="todo-l">À traiter</span>${n ? `<span class="todo-n num">${n}</span>` : ''}</button>`; }
  const footer = () => (DEMO ? `<footer class="foot"><p class="demo-note">Démo de Teamora : toutes les données sont fictives et restent dans ton navigateur. N’y saisis aucune donnée réelle.</p></footer>` : footerWork());
  const footerWork = () => `<footer class="foot">${TENANT === 'new' ? `<button type="button" class="btn ghost sm" data-act="tenant-nova">${ic('left')}Revenir à la démo Nova Studio</button><button type="button" class="btn ghost sm" data-act="reset">${ic('refresh')}Recommencer l’installation</button>`
      : `<button type="button" class="btn ghost sm" data-act="reset">${ic('refresh')}Réinitialiser la démo</button><button type="button" class="btn ghost sm" data-act="tenant-new">${ic('plus')}Tester l’installation (nouvelle entreprise)</button>`}<button type="button" class="btn ghost sm" data-act="v3-news">${ic('star')}Nouveautés de la V3</button>
    <p class="demo-note">Aperçu de démonstration : toutes les données sont fictives et enregistrées uniquement dans ce navigateur.</p></footer>`;

  // ---------------------------------------------------------------- V3 · Vue mobile de l'espace salarié
  // Sur téléphone : barre du haut compacte, onglets en bas, accueil en cartes. La gestion RH et manager reste sur ordinateur.
  const MOB_Q = window.matchMedia ? window.matchMedia('(max-width: 760px)') : { matches: false };
  const isMob = () => !!MOB_Q.matches;
  // Tri validé : sur téléphone, le salarié garde les actions rapides ; la mobilité, l'aménagement de poste, le détail de la paie,
  // l'auto-évaluation, le catalogue de formations, la signature du contrat et Teamo restent sur ordinateur.
  const mobSal = () => isMob() && ui.profile === 'salarie';
  const MOB_OFF = ['mobilite'];
  const desktopHint = (what) => `<p class="hint mob-desk">${ic('lock')}${what} sur ordinateur.</p>`;
  const MOB_LABEL = { arrivee: 'Arrivée', contrat: 'Contrat', profil: 'Profil', absences: 'Absences', bulletins: 'Paie', entretiens: 'Entretiens', formation: 'Formations', mobilite: 'Mobilité', sante: 'Santé', relations: 'Échanges', etape: 'Mon étape' };
  const MOB_TABS = ['absences', 'bulletins', 'relations'];
  function mobItems() { return visibleStages().map((i) => ({ i, v: stageView(i), name: stageDef(i).short, label: MOB_LABEL[stageView(i)] || stageDef(i).short, icon: stageDef(i).icon, n: stageTodo(i) })).filter((x) => x.v && !MOB_OFF.includes(x.v)); }
  function mobSplit() { const items = mobItems(), pref = MOB_TABS.map((v) => items.find((x) => x.v === v)).filter(Boolean), main = (pref.length ? pref : items).slice(0, 3);
    return { items, main, rest: items.filter((x) => !main.includes(x)) }; }
  function mobTop() {
    const title = ui.view === 'accueil' ? 'Accueil' : ui.view === 'etape' ? esc(STAGES[ui.stage].title) : VIEW_LABELS.salarie[ui.view] || '';
    const mine = db.notifications.filter((n) => n.to === me().id), unread = mine.filter((n) => !n.read).length;
    return `<header class="mob-top"><button type="button" class="brand" data-act="go" data-v="accueil" aria-label="Teamora · retour à l’accueil"><span class="brand-mark">${LOGO}</span></button>
      <div class="mob-title"><small>${esc(COMPANY.nom)}</small><h1>${title}</h1></div>
      <button type="button" class="icon-btn" data-act="notif" aria-label="Notifications (${unread} non lues)" aria-expanded="${ui.notif}">${ic('bell')}${unread ? `<span class="dot num">${unread}</span>` : ''}</button>
      <button type="button" class="mob-me" data-act="mob-more" aria-label="Menu et compte">${avatar(me())}</button>
      ${ui.notif ? `<div class="card notif-pop" data-act="noop"><div class="card-h"><h3>Notifications</h3>${unread ? '<button type="button" class="btn ghost sm" data-act="notif-read">Tout marquer comme lu</button>' : ''}</div>
        ${mine.length ? mine.slice(0, 8).map((n) => `<div class="notif ${n.read ? '' : 'unread'}"><div>${esc(n.text)}<small>${fmtDate(n.date)}</small></div></div>`).join('') : '<div class="empty">Aucune notification.</div>'}</div>` : ''}</header>`;
  }
  function mobNav() {
    const { main, rest } = mobSplit(), more = rest.reduce((a, x) => a + x.n, 0);
    const b = (on, attrs, icon, label, n) => `<button type="button" ${attrs} ${on ? 'aria-current="page"' : ''}>${ic(icon)}<span>${label}</span>${n ? `<i class="badge todo num">${n}</i>` : ''}</button>`;
    return `<nav class="mob-nav" aria-label="Navigation principale">${b(ui.view === 'accueil' && !ui.mobMore, 'data-act="go" data-v="accueil"', 'home', 'Accueil')}
      ${main.map((x) => b(ui.view !== 'accueil' && ui.stage === x.i && !ui.mobMore, `data-act="stage" data-i="${x.i}"`, x.icon, x.label, x.n)).join('')}
      ${rest.length ? b(!!ui.mobMore || rest.some((x) => ui.stage === x.i && ui.view !== 'accueil'), 'data-act="mob-more" aria-haspopup="dialog"', 'chart', 'Plus', more) : ''}</nav>`;
  }
  function mobHome() {
    const m = me(), { items } = mobSplit(), todo = items.filter((x) => x.n);
    const has = (v) => items.find((x) => x.v === v), pay = has('bulletins') && payMonths().filter((k) => db.payroll[k] && db.payroll[k].closed && inPayroll(m, k)).slice(-1)[0];
    const quick = [has('absences') && ['absence', 'clock', 'Poser une absence'], pay && ['bulletin', 'file', `Bulletin de ${monthLabel(pay).split(' ')[0].toLowerCase()}`], has('relations') && ['rh', 'chat', 'Écrire aux RH']].filter(Boolean);
    return `<section class="mob-hello"><h2>Bonjour ${esc(m.firstName)}</h2><p>${esc(m.title)} · ${esc(m.dept)}</p></section>
      ${quick.length ? `<section class="mob-quick" aria-label="Actions rapides">${quick.map(([k, icon, l]) => `<button type="button" data-act="mob-quick" data-k="${k}">${ic(icon)}<span>${l}</span></button>`).join('')}</section>` : ''}
      ${todo.length ? `<section class="card mob-todo"><div class="card-h"><h3>À faire</h3></div>${todo.map((x) => `<button type="button" class="mob-row" data-act="stage" data-i="${x.i}"><span class="mob-ic" style="--c:${STAGE_COLORS[x.i]}">${ic(x.icon)}</span><span class="t"><b>${esc(x.name)}</b><small>${plural(x.n, 'action en attente', 'actions en attente')}</small></span>${ic('right')}</button>`).join('')}</section>` : ''}
      <button type="button" class="card mob-avis" data-act="avis-open">${ic('chat')}<span><b>Donner mon avis sur Teamora</b><small>2 minutes, sans ton nom</small></span>${ic('right')}</button>
      <section><h4 class="sub">Mon espace</h4><div class="mob-grid">${items.map((x) => `<button type="button" class="mob-tile" data-act="stage" data-i="${x.i}" style="--c:${STAGE_COLORS[x.i]}"><span class="mob-ic">${ic(x.icon)}</span><b>${esc(x.name)}</b>${x.n ? `<i class="badge todo num">${x.n}</i>` : ''}</button>`).join('')}</div></section>`;
  }
  // « Plus » : les autres rubriques, et le changement de profil de la démo.
  function mobMoreSheet() {
    const { rest } = mobSplit();
    return `<div class="scrim on" data-act="mob-more"></div><div class="mob-sheet" role="dialog" aria-modal="true" aria-label="Plus de rubriques"><div class="mob-grab"></div>
      ${rest.length ? `<h4 class="sub">Autres rubriques</h4>${rest.map((x) => `<button type="button" class="mob-row" data-act="stage" data-i="${x.i}"><span class="mob-ic" style="--c:${STAGE_COLORS[x.i]}">${ic(x.icon)}</span><span class="t"><b>${esc(x.name)}</b></span>${x.n ? `<i class="badge todo num">${x.n}</i>` : ''}${ic('right')}</button>`).join('')}` : ''}
      ${DEMO ? `<button type="button" class="mob-row" data-act="tour-start"><span class="mob-ic">${ic('star')}</span><span class="t"><b>Revoir la visite guidée</b><small>Teamo te montre l’essentiel</small></span>${ic('right')}</button>` : ''}
      <button type="button" class="mob-row" data-act="avis-open"><span class="mob-ic">${ic('chat')}</span><span class="t"><b>Donner mon avis</b><small>Ce qui t’aide, ce qui manque, ce qui bloque</small></span>${ic('right')}</button>
      <h4 class="sub">Démo : voir l’application en tant que</h4>
      ${TENANT === 'new' ? '' : `<div class="mob-persona">${Object.entries(PROFILES).filter(([k]) => profileOk(k)).map(([k, pr]) => { const e = profileEmp(k); return `<button type="button" class="btn ${persona() === k ? 'primary' : 'ghost'} sm" data-act="persona" data-p="${k}">${avatar(e)}${esc(e.firstName)} · ${pr.label}</button>`; }).join('')}</div>`}
      ${!ui.selfOf ? `<div class="field" style="margin-top:10px">${asEmpSelect().replace('class="sr"', 'class="lbl"')}</div>` : `<button type="button" class="btn ghost sm" data-act="space" data-s="gestion" style="margin-top:10px">${ic('left')}Revenir à la gestion (ordinateur)</button>`}
      <p class="hint" style="margin:12px 0 0">Sur téléphone, Teamora affiche l’espace salarié. La gestion RH et manager s’utilise sur ordinateur.</p></div>`;
  }
  // RH et managers sur téléphone : la gestion demande un écran d'ordinateur ; leur espace personnel reste accessible.
  function mobGate() {
    const setup = ui.view === 'setup';
    return `<div class="app mob gate"><div class="gate-box"><span class="brand-mark">${LOGO}</span><h1>Teamora sur téléphone</h1>
      <p>${setup ? 'L’installation de Teamora se fait sur ordinateur (écran de 1 024 px de large au moins).' : `La gestion ${ui.profile === 'rh' ? 'RH' : 'de l’équipe'} s’utilise sur ordinateur. Sur téléphone, tu retrouves l’espace salarié : absences, bulletins, entretiens, échanges avec les RH…`}</p>
      ${setup ? '' : `<button type="button" class="btn primary" data-act="space" data-s="perso">${avatar(me())}Ouvrir mon espace personnel</button>
      ${TENANT === 'new' ? '' : `<button type="button" class="btn ghost" data-act="persona" data-p="salarie">Voir l’espace d’un salarié (démo)</button>`}`}</div></div>`;
  }
  if (MOB_Q.addEventListener) MOB_Q.addEventListener('change', () => { ui.mobMore = false; render(); });

  // ---------------------------------------------------------------- Home (wheel)
  const W = { cx: 430, cy: 380, R: 250, LR: 310 };
  let wheelN = 16; // number of stages shown in the wheel for the current profile
  const ang = (k) => (-90 + k * 360 / wheelN) * Math.PI / 180;
  const nodePos = (i, r = W.R) => ({ x: Math.cos(ang(i)) * r, y: Math.sin(ang(i)) * r });
  const atStage = (e, i) => (i === 3 ? e.stage === 2 : e.stage === i);
  // Profil Salarié : choisir le collaborateur dont on voit l'espace (une nouvelle recrue y a accès dès son embauche).
  function asMgrSelect() {
    const cur = profileEmp('manager').id, mgrs = db.employees.filter((x) => x.stage < 15 && x.id !== 'e1' && db.employees.some((y) => y.managerId === x.id && y.stage < 15)).sort((x, y) => (x.managerId ? 1 : 0) - (y.managerId ? 1 : 0) || x.lastName.localeCompare(y.lastName, 'fr'));
    return `<label class="sr" for="as-mgr">Manager affiché</label><select id="as-mgr" class="select as-emp" data-change="as-mgr">${mgrs.map((x) => `<option value="${x.id}" ${x.id === cur ? 'selected' : ''}>${esc(fullName(x))}${x.managerId ? '' : ' · Direction'}</option>`).join('')}</select>`;
  }
  function asEmpSelect() {
    const cur = me().id, base = db.employees.filter((e) => e.id === profileBase('salarie')), arrivals = db.employees.filter((e) => e.stage >= 2 && e.stage <= 4 && e.id !== profileBase('salarie')).sort((x, y) => y.startDate.localeCompare(x.startDate));
    const o = (e) => `<option value="${e.id}" ${e.id === cur ? 'selected' : ''}>${esc(fullName(e))}${e.stage === 2 ? ` · arrivée le ${fmtShort(e.startDate)}` : ''}</option>`;
    return `<label class="sr" for="as-emp">Espace du collaborateur</label><select id="as-emp" class="select as-emp" data-change="as-emp">${base.map(o).join('')}<optgroup label="Nouvelles recrues">${arrivals.map(o).join('')}</optgroup></select>`;
  }
  function wheelHTML() {
    const sal = ui.profile === 'salarie', m = me(), vis = visibleStages();
    wheelN = vis.length;
    const nodes = vis.map((i) => {
      const s = stageDef(i), cls = '';
      return `<button type="button" class="node ${cls}" data-act="stage" data-i="${i}" style="background:${STAGE_COLORS[i]}" aria-label="${esc(s.title)} · ${esc(stageView(i) === 'etape' ? 'suivi' : VIEW_LABELS[ui.profile][stageView(i)])}" tabindex="${ui.wheelOpen ? 0 : -1}">${ic(s.icon)}${stageBadge(i)}</button>`;
    }).join('');
    const labels = vis.map((i, k) => {
      const s = stageDef(i), p = nodePos(k, W.LR), c = Math.cos(ang(k)), sn = Math.sin(ang(k));
      let tr, align;
      if (c > 0.3) { tr = 'translate(0,-50%)'; align = 'left'; } else if (c < -0.3) { tr = 'translate(-100%,-50%)'; align = 'right'; } else { tr = sn < 0 ? 'translate(-50%,-100%)' : 'translate(-50%,0)'; align = 'center'; }
      return `<div class="lab" style="left:${W.cx + p.x}px;top:${W.cy + p.y}px;transform:${tr};text-align:${align}"><div class="lab-in"><b>${esc(s.short)}</b></div></div>`;
    }).join('');
    // Recrue pas encore arrivée : date d'arrivée et compte à rebours ; ensuite, « Mon espace RH ».
    const hubText = sal && locked(m) ? `<small>MON ARRIVÉE</small><b>${esc(fmtDate(m.startDate, { day: 'numeric', month: 'long' }))}</b><span class="hub-n num">J-${dayDiff(TODAY, m.startDate)}</span>`
      : sal ? '<b>Mon espace<br>RH</b>'
      : ui.profile === 'manager' ? `<small>MON ÉQUIPE</small><b>${esc(m.dept)}</b><span class="hub-n num">${plural(scopeEmployees().filter(isEmployed).length, 'personne', 'personnes')}</span>`
        : `<small>NOVA STUDIO</small><b>Collaborateurs</b><span class="hub-n num">${plural(db.employees.filter(isEmployed).length, 'collaborateur', 'collaborateurs')}</span>`;
    return `<div class="wheel-box" id="wheel-box"><div class="wheel" id="wheel">${labels}${nodes}
      <button type="button" class="hub" data-act="hub" aria-expanded="${ui.wheelOpen}" aria-label="${ui.wheelOpen ? 'Replier' : 'Déplier'} le menu">${hubText}</button></div></div>
      <p class="wheel-hint" id="wheel-hint">${ui.wheelOpen ? HINT_OPEN : HINT_CLOSED}</p>`;
  }
  const HINT_OPEN = 'Cliquez sur une rubrique pour l’ouvrir';
  const HINT_CLOSED = 'Survolez ou touchez la roue pour afficher le menu';
  function stepsList(arr, steps, editable, empId, stage) {
    return `<div class="steps">${steps.map((t, k) => `<div class="step ${arr[k] ? 'done' : ''}">${editable
      ? `<button type="button" class="ckbox" role="checkbox" aria-checked="${arr[k]}" data-act="jcheck" data-id="${empId}" data-s="${stage}" data-k="${k}" aria-label="${esc(t)}">${ic('check')}</button>`
      : `<span class="ckbox" aria-checked="${arr[k]}">${ic('check')}</span>`}<span>${esc(t)}</span></div>`).join('')}</div>`;
  }
  function stageHead(i, closable = false) {
    const s = STAGES[i], c = STAGE_COLORS[i];
    return `<div class="stage-head"><span class="stage-ic" style="background:${c}">${ic(s.icon)}</span><div style="flex:1;min-width:0"><small style="color:${c}">${i <= 4 ? 'ARRIVÉE DES COLLABORATEURS' : i >= 13 ? 'DÉPART DES COLLABORATEURS' : 'RUBRIQUE'}</small><h2>${esc(s.title)}</h2></div>
      ${closable ? `<button type="button" class="icon-btn" data-act="stage" data-i="${i}" aria-label="Fermer">${ic('x')}</button>` : ''}</div>`;
  }
  const MODULE_LINK = { recrutement: ['recrutement', 'Ouvrir le recrutement'], absences: ['absences', 'Ouvrir les absences'], paie: ['paie', 'Ouvrir la paie'], collaborateurs: ['collaborateurs', 'Ouvrir les collaborateurs'],
    entretiens: ['entretiens', 'Ouvrir les entretiens'], formation: ['formation', 'Ouvrir la formation'], mobilite: ['mobilite', 'Ouvrir la mobilité'], sante: ['sante', 'Ouvrir Santé & QVT'], relations: ['relations', 'Ouvrir les relations individuelles'] };
  function moduleBtn(i) {
    const mod = STAGES[i].module; if (!mod) return '';
    let [v, label] = MODULE_LINK[mod];
    if (ui.profile === 'salarie') { const map = { absences: ['absences', 'Mes absences'], paie: ['bulletins', 'Mes bulletins'], collaborateurs: ['profil', 'Mon profil'], entretiens: ['entretiens', 'Mes entretiens'], formation: ['formation', 'Formations'], mobilite: ['mobilite', 'Mobilité'], sante: ['sante', 'Santé & QVT'], relations: ['relations', 'Échanges RH'] }; if (!map[mod]) return ''; [v, label] = map[mod]; }
    if (!canView(v)) return '';
    return `<button type="button" class="btn ghost" data-act="go" data-v="${v}">${label}${ic('arrow')}</button>`;
  }
  function stagePanel(i) {
    const s = STAGES[i], steps = stageSteps(i);
    if (ui.profile === 'salarie') {
      const e = me();
      const arr = journeyOf(e.id, i);
      return `<div class="card card-b">${stageHead(i)}</div><div class="card"><div class="card-h"><h3>Points à suivre</h3><span class="muted" style="font-size:13px">${arr.filter(Boolean).length} sur ${arr.length}</span></div><div class="card-b">${stepsList(arr, steps, false)}</div></div>${i === 4 ? myIntegration(e) : ''}${moduleBtn(i) ? `<div>${moduleBtn(i)}</div>` : ''}`;
    }
    const rh = ui.profile === 'rh', arrival = i >= 2 && i <= 4;
    const people = scopeEmployees().filter((e) => atStage(e, i));
    const body = `<div class="card"><div class="card-h"><h3>Collaborateurs concernés</h3><span class="pill accent num">${people.length}</span></div><div class="card-b"><div class="people">${people.length ? people.map((e) => {
      const arr = journeyOf(e.id, i), done = arr.filter(Boolean).length, open = ui.selPerson === e.id, todo = i <= 4 ? arrivalActions(e, i).length : rh && departActions(e).length;
      // Seul le départ s'enchaîne en plusieurs temps (préparation, formalités de sortie, archivage) ; l'intégration se termine avec la confirmation de la période d'essai.
      const next = rh && (i === 13 || i === 14) ? `<button type="button" class="btn ${done === arr.length ? 'primary' : 'ghost'} sm" data-act="advance" data-id="${e.id}">Passer à « ${esc(STAGES[i + 1].short)} »${ic('arrow')}</button>` : '';
      return `<button type="button" class="person-row" data-act="person" data-id="${e.id}" aria-expanded="${open}">${avatar(e)}<span class="who"><b>${esc(fullName(e))}</b><small>${esc(e.title)} · ${done}/${arr.length} points${i === 2 || i === 3 ? ` · arrivée le ${fmtShort(e.startDate)}` : ''}</small></span>${todo ? `<span class="badge-dot num" title="À traiter">${todo}</span>` : ''}<span class="mini-bar"><i style="width:${(done / arr.length) * 100}%"></i></span></button>
        ${open ? `<div class="card card-b">${stepsList(arr, steps, !arrival && i < 13, e.id, i)}${arrival ? arrivalDossier(e, i) : i >= 13 ? departDossier(e, i) : ''}<div class="toolbar" style="margin-top:16px">
          ${next}<button type="button" class="btn ghost sm" data-act="open-emp" data-id="${e.id}">Ouvrir la fiche</button>${done < arr.length ? `<span class="hint">${plural(arr.length - done, 'point restant', 'points restants')}</span>` : ''}</div>
          ${i === 2 || i === 3 ? `<p class="hint" style="margin:10px 0 0">La pré-embauche et l’embauche avancent en parallèle. ${esc(e.firstName)} passe automatiquement en intégration quand les deux sont terminées et le contrat signé.</p>`
            : i === 4 ? '<p class="hint" style="margin:10px 0 0">L’intégration se termine quand la période d’essai est confirmée.</p>' : ''}</div>` : ''}`; }).join('')
      : '<p class="muted" style="margin:0">Personne n’est concerné pour le moment.</p>'}</div></div></div>
      ${i === 14 ? exitStats() : ''}${i === 4 && rh ? planConfig() : ''}${people.length ? '' : `<div class="card"><div class="card-h"><h3>Points à suivre</h3></div><div class="card-b">${stepsList(steps.map(() => false), steps, false)}</div></div>`}${moduleBtn(i)}`;
    return `<div class="card card-b">${stageHead(i)}</div>${body}`;
  }
  const viewHome = () => `<div class="home-bg" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="home">${wheelHTML()}</div>`;
  // Stage page (pre-hire, hiring, onboarding, departure…): who is at this stage and their tasks.
  const viewStage = () => `<div class="panel stage-page" id="panel">${stagePanel(ui.stage)}</div>`;

  // Wheel animation (GSAP when available, plain styles otherwise).
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Without GSAP, apply the end state directly and remember it, so a partial update (e.g. scale only) keeps x/y.
  function applyPlain(el, vars) {
    const s = el._tw = Object.assign({ x: 0, y: 0, scale: 1 }, el._tw, vars);
    if (s.opacity !== undefined) el.style.opacity = s.opacity;
    el.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.scale})`;
  }
  function tw(el, vars) {
    // overwrite : une nouvelle animation (ouverture, fermeture) remplace celle en cours au lieu de se superposer.
    if (window.gsap) return window.gsap.to(el, Object.assign({ overwrite: true }, vars, reduce ? { duration: 0, delay: 0 } : {}));
    applyPlain(el, vars);
  }
  function setNode(el, vars) { if (window.gsap) window.gsap.set(el, vars); else applyPlain(el, vars); }
  function placeWheel() {
    const nodes = document.querySelectorAll('.node'), labs = document.querySelectorAll('.lab-in');
    nodes.forEach((n, i) => { const p = nodePos(i); setNode(n, ui.wheelOpen ? { x: p.x, y: p.y, opacity: 1, scale: 1 } : { x: 0, y: 0, opacity: 0, scale: 0.4 }); });
    labs.forEach((l) => { l.style.opacity = ui.wheelOpen ? 1 : 0; });
  }
  let closeTimer = null, openedAt = 0;
  function openWheel() {
    if (ui.wheelOpen) return; ui.wheelOpen = true; openedAt = Date.now();
    document.querySelectorAll('.node').forEach((n, i) => { const p = nodePos(i); n.tabIndex = 0; tw(n, { x: p.x, y: p.y, opacity: 1, scale: 1, duration: 0.75, delay: i * 0.035, ease: 'back.out(1.5)' }); });
    document.querySelectorAll('.lab-in').forEach((l, i) => tw(l, { opacity: 1, duration: 0.35, delay: 0.35 + i * 0.035 }));
    const hint = document.getElementById('wheel-hint'); if (hint) hint.textContent = HINT_OPEN;
    const hub = document.querySelector('.hub'); if (hub) { hub.setAttribute('aria-expanded', 'true'); tw(hub, { scale: 1.03, duration: 0.4 }); }
  }
  function closeWheel() {
    if (!ui.wheelOpen) return; ui.wheelOpen = false;
    const nodes = [...document.querySelectorAll('.node')];
    nodes.forEach((n, i) => { n.tabIndex = -1; tw(n, { x: 0, y: 0, opacity: 0, scale: 0.4, duration: 0.45, delay: (nodes.length - 1 - i) * 0.02, ease: 'power3.in' }); });
    document.querySelectorAll('.lab-in').forEach((l) => tw(l, { opacity: 0, duration: 0.2 }));
    const hint = document.getElementById('wheel-hint'); if (hint) hint.textContent = HINT_CLOSED;
    const hub = document.querySelector('.hub'); if (hub) { hub.setAttribute('aria-expanded', 'false'); tw(hub, { scale: 1, duration: 0.4 }); }
  }
  function fitWheel() { const box = document.getElementById('wheel-box'), w = document.getElementById('wheel'); if (box && w) w.style.transform = `scale(${box.clientWidth / 860})`; }
  function bindWheel() {
    const box = document.getElementById('wheel-box'); if (!box) return;
    fitWheel(); placeWheel();
    // Survol : léger agrandissement sur place ; « auto » n'interrompt que l'échelle, jamais le déplacement en cours.
    box.querySelectorAll('.node').forEach((n) => {
      n.addEventListener('mouseenter', () => tw(n, { scale: 1.14, duration: 0.2, overwrite: 'auto' }));
      n.addEventListener('mouseleave', () => tw(n, { scale: 1, duration: 0.2, overwrite: 'auto' }));
    });
    box.addEventListener('mouseenter', () => { clearTimeout(closeTimer); openWheel(); });
    box.addEventListener('mouseleave', () => { closeTimer = setTimeout(closeWheel, 700); });
    box.addEventListener('focusin', () => { clearTimeout(closeTimer); openWheel(); });
  }

  // ---------------------------------------------------------------- Collaborateurs
  function filteredEmployees() {
    const q = ui.q.trim().toLowerCase();
    const list = scopeEmployees().filter((e) => (!q || `${fullName(e)} ${e.title} ${e.email} ${e.dept}`.toLowerCase().includes(q))
      && (!ui.fDept || e.dept === ui.fDept) && (!ui.fStatus || statusOf(e)[2] === ui.fStatus));
    const key = { name: (e) => e.lastName, dept: (e) => e.dept, start: (e) => e.startDate }[ui.sort];
    return list.sort((a, b) => key(a).localeCompare(key(b), 'fr') * ui.sortDir);
  }
  function empTable(list) {
    if (!list.length) return '<div class="empty">Aucun collaborateur ne correspond à votre recherche.</div>';
    const th = (k, l) => `<th><button type="button" data-act="sort" data-k="${k}">${l}${ui.sort === k ? (ui.sortDir > 0 ? ' ↑' : ' ↓') : ''}</button></th>`;
    return `<table><thead><tr>${th('name', 'Collaborateur')}<th>Poste</th>${th('dept', 'Service')}<th>Statut</th>${th('start', 'Entrée')}<th>Manager</th></tr></thead><tbody>
      ${list.map((e) => `<tr class="click" data-act="open-emp" data-id="${e.id}" tabindex="0"><td><div class="who-cell">${avatar(e)}<div><b>${esc(fullName(e))}</b><small>${esc(e.email)}</small></div></div></td>
        <td>${esc(e.title)}</td><td>${esc(e.dept)}</td><td>${statusPill(e)}</td><td class="num">${fmtDate(e.startDate)}</td><td>${e.managerId ? esc(fullName(emp(e.managerId))) : '—'}</td></tr>`).join('')}</tbody></table>`;
  }
  function viewEmployees() {
    const list = filteredEmployees();
    const statuses = ['En poste', 'Absent', 'Télétravail', 'Arrivée prévue', 'Période d’essai', 'En intégration', 'Départ en cours', 'Sorti'];
    return `<div class="toolbar"><div class="search">${ic('search')}<label class="sr" for="emp-q">Rechercher</label><input id="emp-q" class="input" type="search" placeholder="Nom, poste, e-mail…" value="${esc(ui.q)}" data-input="q"></div>
      ${ui.profile === 'rh' ? `<label class="sr" for="f-dept">Service</label><select id="f-dept" class="select" data-change="fDept"><option value="">Tous les services</option>${DEPTS.map((d) => `<option ${ui.fDept === d ? 'selected' : ''}>${d}</option>`).join('')}</select>` : ''}
      <label class="sr" for="f-status">Statut</label><select id="f-status" class="select" data-change="fStatus"><option value="">Tous les statuts</option>${statuses.map((s) => `<option ${ui.fStatus === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <span class="muted" id="emp-count">${plural(list.length, 'collaborateur', 'collaborateurs')}</span>
      ${ui.profile === 'rh' ? `<button type="button" class="btn primary" style="margin-left:auto" data-act="emp-new">${ic('plus')}Ajouter un collaborateur</button>` : ''}</div>
      <div class="card"><div class="table-wrap" id="emp-table">${empTable(list)}</div></div>`;
  }

  // Arrivée ou départ en cours : accès direct au dossier correspondant.
  function procCard(e) {
    const k = inArrival(e) ? 'arrivée' : e.stage === 4 ? 'intégration' : e.stage >= 13 && e.stage < 15 ? 'départ' : null;
    if (!k || ui.profile === 'salarie') return '';
    const label = { arrivée: `Arrivée le ${fmtDate(e.startDate)} · pré-embauche et embauche en cours`, intégration: 'Intégration et période d’essai en cours', départ: `${STAGES[e.stage].title} en cours` }[k];
    return `<div class="card card-b proc-card"><div><b>${label}</b><small>Suivi des formalités dans le dossier ${k === 'départ' ? 'de départ' : k === 'arrivée' ? 'd’arrivée' : 'd’intégration'}</small></div><button type="button" class="btn primary sm" data-act="open-dossier" data-id="${e.id}">Ouvrir le dossier${ic('arrow')}</button></div>`;
  }
  function empDrawer(e) {
    const tab = ui.drawer.tab || 'infos', rh = ui.profile === 'rh';
    const tabs = [['infos', 'Informations'], ['absences', 'Absences']].concat(rh ? [['remu', 'Rémunération'], ['documents', 'Documents'], ['journal', 'Journal']] : []);
    const mgr = e.managerId ? emp(e.managerId) : null;
    let body = '';
    if (tab === 'infos') {
      body = `<div class="info-grid"><div><span>E-mail</span>${esc(e.email)}</div><div><span>Téléphone</span>${esc(e.phone)}</div><div><span>Poste</span>${esc(e.title)}</div><div><span>Service</span>${esc(e.dept)}</div>
        <div><span>Manager</span>${mgr ? esc(fullName(mgr)) : '—'}</div><div><span>Contrat</span>${esc(e.contract)}</div><div><span>Date d’entrée</span>${fmtDate(e.startDate)}</div><div><span>Ancienneté</span>${seniority(e.startDate)}</div>
        <div><span>Lieu de travail</span>${esc(e.location)}</div><div><span>Temps de travail</span>${(e.quotite || 100) === 100 ? 'Temps plein' : `Temps partiel ${e.quotite} %`}</div>${rh ? `<div><span>Date de naissance</span>${fmtDate(e.birthDate)}</div><div><span>Adresse</span>${esc(e.address) || '—'}</div>` : ''}<div><span>Contact d’urgence</span>${esc(e.emergency) || '—'}</div></div>
        ${(() => { const h = db.history.filter((x) => x.empId === e.id).sort((a, b) => b.date.localeCompare(a.date)); return h.length ? `<div class="card card-b"><b>Historique de carrière</b><ol class="timeline" style="margin-top:10px">${h.map((x) => `<li><small>${fmtDate(x.date)} · ${esc(x.label)}</small><p>${esc(x.detail)}</p></li>`).join('')}</ol></div>` : ''; })()}
        ${procCard(e)}${e.changeNext ? `<div class="card card-b proc-card"><div><b>Changement programmé au ${fmtDate(e.changeNext.from)} · ${esc(e.changeNext.label || '')}</b><small>${esc(situationDiff(e, e.changeNext).join(' · '))}</small></div></div>` : ''}
        ${e.exit ? `<div class="card card-b"><b>Départ prévu</b><p class="muted" style="margin:4px 0 0">${esc(e.exit.reason)} · dernier jour le ${fmtDate(e.exit.lastDay)}${e.exit.comment ? ` · ${esc(e.exit.comment)}` : ''}</p></div>` : ''}`;
    } else if (tab === 'absences') {
      const ls = db.leaves.filter((l) => l.empId === e.id).sort((a, b) => b.start.localeCompare(a.start));
      body = `<div class="balances"><div class="card bal"><span class="l">Congés payés</span><div class="v num">${e.cp} <small>j</small></div></div><div class="card bal"><span class="l">RTT</span><div class="v num">${e.rtt} <small>j</small></div></div><div class="card bal"><span class="l">Demandes</span><div class="v num">${ls.length}</div></div></div>
        <div class="card"><div class="req-list">${ls.length ? ls.map((l) => `<div class="req"><div class="what"><b>${esc(l.type)}</b><small>${fmtShort(l.start)} → ${fmtDate(l.end)} · ${plural(l.days, 'jour', 'jours')}</small></div>${leavePill(l)}</div>`).join('') : '<div class="empty">Aucune absence enregistrée.</div>'}</div></div>`;
    } else if (tab === 'documents') {
      body = docsList(e, true);
    } else if (tab === 'journal') {
      body = journalTab(e);
    } else {
      const months = payMonths().filter((m) => db.payroll[m] && db.payroll[m].closed && inPayroll(e, m)).reverse();
      body = `<div class="info-grid"><div><span>Salaire annuel brut</span><span class="num" style="font-size:20px;color:var(--fg);font-weight:700">${eur0(e.salary)}</span></div><div><span>Mensuel brut</span><span class="num" style="font-size:20px;color:var(--fg);font-weight:700">${eur(e.salary / 12)}</span></div></div>
        <div class="card"><div class="card-h"><h3>Bulletins de paie</h3></div><div class="req-list">${months.length ? months.map((m) => `<div class="req"><div class="what"><b>${monthLabel(m)}</b><small class="num">Net payé : ${eur(calcPay(e, m).net)}</small></div><button type="button" class="btn ghost sm" data-act="payslip" data-id="${e.id}" data-m="${m}">Voir le bulletin</button></div>`).join('') : '<div class="empty">Aucun bulletin pour le moment.</div>'}</div></div>`;
    }
    return `<div class="drawer-h">${avatar(e, 'lg')}<div style="min-width:0"><h2>${esc(fullName(e))}</h2><p>${esc(e.title)} · ${esc(e.dept)}</p><div style="margin-top:6px">${statusPill(e)}</div></div>
      <button type="button" class="icon-btn drawer-x" data-act="close-drawer" aria-label="Fermer">${ic('x')}</button></div>
      <div class="drawer-b">${rh ? `<div class="toolbar"><button type="button" class="btn ghost sm" data-act="emp-edit" data-id="${e.id}">${ic('edit')}Modifier</button>${e.stage < 13 && e.stage >= 4 ? `<button type="button" class="btn ghost sm" data-act="move-new" data-id="${e.id}">${ic('arrow')}Changement de situation</button>` : ''}${e.stage < 13 ? `<button type="button" class="btn bad sm" data-act="exit" data-id="${e.id}">Démarrer un départ</button>` : ''}</div>` : ''}
      <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" role="tab" aria-selected="${tab === k}" data-act="dtab" data-t="${k}">${l}</button>`).join('')}</div>${body}</div>`;
  }

  // ---------------------------------------------------------------- Absences
  // V2 : absences légales complètes ; le télétravail est un mode de travail, pas une absence.
  const LEAVE_GROUPS = [['Congés et repos', ['Congés payés', 'RTT', 'Sans solde', 'Congé parental']],
    ['Arrêts et événements', ['Maladie', 'Accident du travail', 'Maternité', 'Paternité et accueil de l’enfant', 'Événement familial', 'Enfant malade']],
    ['Organisation du travail', ['Télétravail']]];
  const LEAVE_TYPES = LEAVE_GROUPS.flatMap(([, l]) => l);
  const ABS_TYPES = LEAVE_TYPES.filter((t) => t !== 'Télétravail');
  // Secret médical : selon les paramètres, le manager ne voit qu'« Absence » à la place du motif d'un arrêt.
  const typeLabel = (l) => (ui.profile === 'manager' && !ui.selfOf && IJ_TYPES.includes(l.type) && !(db.settings && db.settings.droits.motifAbsence) ? 'Absence' : l.type);
  // Indemnisés par la Sécurité sociale (attestation de salaire à transmettre) ; enregistrés directement, sans validation (ce sont des droits).
  const IJ_TYPES = ['Maladie', 'Accident du travail', 'Maternité', 'Paternité et accueil de l’enfant'];
  const DECLARED = IJ_TYPES.concat(['Événement familial', 'Enfant malade']);
  // Congés pour événements familiaux (art. L3142-4), en jours ouvrables ramenés ici en jours ouvrés.
  const FAMILY_EVENTS = [['Mariage ou PACS du salarié', 4], ['Mariage d’un enfant', 1], ['Naissance ou adoption', 3], ['Décès d’un enfant', 12], ['Décès du conjoint, partenaire ou concubin', 3], ['Décès d’un parent, beau-parent, frère ou sœur', 3], ['Annonce du handicap ou d’une maladie grave d’un enfant', 5]];
  const TYPE_CLASS = { 'Congés payés': 't-cp', RTT: 't-rtt', Maladie: 't-mal', Télétravail: 't-tt', 'Sans solde': 't-uns', 'Congé parental': 't-uns', 'Accident du travail': 't-mal', Maternité: 't-fam', 'Paternité et accueil de l’enfant': 't-fam', 'Événement familial': 't-fam', 'Enfant malade': 't-fam' };
  const leavePill = (l) => `<span class="pill ${{ 'En attente': 'warn', Approuvée: 'ok', Refusée: 'bad' }[l.status]}">${l.status}</span>`;
  const balanceKey = (type) => (type === 'Congés payés' ? 'cp' : type === 'RTT' ? 'rtt' : null);
  function reqRow(l, actions) {
    const e = emp(l.empId);
    return `<div class="req"><div class="who-cell">${avatar(e)}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)} · solde CP ${e.cp} j · RTT ${e.rtt} j</small>${ui.profile === 'manager' && e.managerId && e.managerId !== me().id ? `<span class="pill info" style="margin-top:4px">En remplacement de ${esc(fullName(emp(e.managerId)))}, absent·e</span>` : ''}</div></div>
      <div class="what"><b>${esc(typeLabel(l))} · ${plural(l.days, 'jour', 'jours')}</b><small>${fmtShort(l.start)} → ${fmtDate(l.end)}${l.comment && typeLabel(l) === l.type ? ` · « ${esc(l.comment)} »` : ''}</small></div>
      ${actions ? `<div class="acts"><button type="button" class="btn ok sm" data-act="leave-ok" data-id="${l.id}">${ic('check')}Valider</button><button type="button" class="btn bad sm" data-act="leave-ko" data-id="${l.id}">Refuser</button></div>` : leavePill(l)}</div>`;
  }
  function myAbsences(e) {
    const mine = db.leaves.filter((l) => l.empId === e.id).sort((a, b) => b.start.localeCompare(a.start));
    const taken = mine.filter((l) => l.status === 'Approuvée' && balanceKey(l.type) && l.start.slice(0, 4) === TODAY.slice(0, 4)).reduce((s, l) => s + l.days, 0);
    const start = nextMonday(TODAY, 2), end = addDays(start, 4);
    return `${myTimeHTML(e)}
      <form class="card" data-form="leave" novalidate><div class="card-h"><h3>Nouvelle demande</h3><span class="muted" style="font-size:13px">Validée par ${esc(fullName(approverOf(e)))}</span></div><div class="card-b"><div class="form-grid">
        <div class="field"><label for="lv-type">Type</label><select id="lv-type" name="type" class="select" data-live="leave">${LEAVE_GROUPS.map(([g, l]) => [g, l.filter(leaveTypeOn)]).filter(([, l]) => l.length).map(([g, l]) => `<optgroup label="${g}">${l.map((t) => `<option>${t}</option>`).join('')}</optgroup>`).join('')}</select></div>
        <div class="field" id="lv-event-f" hidden><label for="lv-event">Événement</label><select id="lv-event" name="event" class="select" data-live="leave">${FAMILY_EVENTS.map(([t, n]) => `<option value="${esc(t)}">${t} · ${plural(n, 'jour', 'jours')}</option>`).join('')}</select></div>
        <div class="field"><label for="lv-comment">Commentaire (facultatif)</label><input id="lv-comment" name="comment" class="input" maxlength="120" placeholder="Ex. vacances en famille"></div>
        <div class="field"><label for="lv-start">Du</label><input id="lv-start" name="start" type="date" class="input" value="${start}" data-live="leave"></div>
        <div class="field"><label for="lv-end">Au (inclus)</label><input id="lv-end" name="end" type="date" class="input" value="${end}" data-live="leave"></div></div>
        <div class="toolbar" style="margin-top:16px"><span id="lv-preview" class="hint" aria-live="polite">${leavePreview('Congés payés', start, end, e)}</span><button class="btn primary" style="margin-left:auto">Envoyer la demande</button></div></div></form>
      <div class="card"><div class="card-h"><h3>Mes demandes</h3></div><div class="req-list">${mine.length ? mine.map((l) => `<div class="req"><div class="what"><b>${esc(l.type)} · ${plural(l.days, 'jour', 'jours')}</b><small>${fmtShort(l.start)} → ${fmtDate(l.end)}${l.comment ? ` · « ${esc(l.comment)} »` : ''}${l.refusal ? ` · Motif du refus : ${esc(l.refusal)}` : ''}</small></div>${leavePill(l)}
        ${l.status === 'En attente' ? `<button type="button" class="btn ghost sm" data-act="leave-cancel" data-id="${l.id}">Annuler</button>` : ''}</div>`).join('') : '<div class="empty">Vous n’avez encore fait aucune demande.</div>'}</div></div>`;
  }
  function leavePreview(type, start, end, e, ev) {
    const d = workDays(start, end);
    if (!start || !end) return 'Choisissez les dates de début et de fin.';
    if (end < start) return '<span class="err">La date de fin doit être après la date de début.</span>';
    if (!d) return '<span class="err">Cette période ne contient aucun jour ouvré.</span>';
    const k = balanceKey(type);
    if (k && d > e[k]) return `<span class="err">${plural(d, 'jour ouvré', 'jours ouvrés')} : votre solde (${e[k]} j) est insuffisant.</span>`;
    if (type === 'Maladie') return `<b class="num">${plural(d, 'jour ouvré', 'jours ouvrés')}</b> · arrêt enregistré directement ; transmettez votre avis d’arrêt sous 48 h`;
    if (type === 'Accident du travail') return `<b class="num">${plural(d, 'jour ouvré', 'jours ouvrés')}</b> · enregistré directement ; l’employeur déclare l’accident sous 48 h, sans délai de carence`;
    if (type === 'Maternité') return `<b class="num">${plural(d, 'jour ouvré', 'jours ouvrés')}</b> · droit (16 semaines pour un premier ou deuxième enfant) ; enregistré directement, pas de validation`;
    if (type === 'Paternité et accueil de l’enfant') return `<b class="num">${plural(d, 'jour ouvré', 'jours ouvrés')}</b> · droit (25 jours calendaires, 4 obligatoires après la naissance) ; prévenir l’employeur 1 mois avant`;
    if (type === 'Enfant malade') return `<b class="num">${plural(d, 'jour ouvré', 'jours ouvrés')}</b> · droit à 3 jours par an (5 si l’enfant a moins d’un an), non rémunérés ; certificat médical à joindre`;
    if (type === 'Événement familial') { const max = (FAMILY_EVENTS.find(([t]) => t === ev) || FAMILY_EVENTS[0])[1];
      return d > max ? `<span class="err">${plural(d, 'jour ouvré', 'jours ouvrés')} : ce congé est de ${plural(max, 'jour', 'jours')} au plus.</span>` : `<b class="num">${plural(d, 'jour ouvré', 'jours ouvrés')}</b> · congé rémunéré de droit (${plural(max, 'jour', 'jours')} au plus), justificatif à joindre`; }
    if (type === 'Congé parental') return `<b class="num">${plural(d, 'jour ouvré', 'jours ouvrés')}</b> · non rémunéré ; demande à faire 2 mois avant, de droit après 1 an d’ancienneté`;
    if (type === 'Télétravail') {
      const wk = mondayOf(start), we = addDays(wk, 6), already = db.leaves.filter((l) => l.empId === e.id && l.type === 'Télétravail' && l.status !== 'Refusée' && l.start <= we && l.end >= wk).reduce((s, l) => s + workDays(l.start < wk ? wk : l.start, l.end > we ? we : l.end), 0);
      if (already + workDays(start, end < we ? end : we) > TT_MAX) return `<b class="num">${plural(d, 'jour ouvré', 'jours ouvrés')}</b> · <span class="warn-t">au-delà de ${TT_MAX} jours de télétravail par semaine prévus par la charte</span>`;
    }
    return `<b class="num">${plural(d, 'jour ouvré', 'jours ouvrés')}</b>${k ? ` · solde après validation : ${e[k] - d} j` : ''}`;
  }
  function planning(people) {
    const m = ui.planMonth || monthKey(TODAY);
    const days = []; for (let s = m + '-01'; s <= monthEnd(m); s = addDays(s, 1)) days.push(s);
    const cols = `minmax(170px, 210px) repeat(${days.length}, minmax(24px, 1fr))`;
    const cover = (e, s) => db.leaves.find((l) => l.empId === e.id && l.status !== 'Refusée' && l.start <= s && l.end >= s);
    let html = `<div class="pday"></div>${days.map((s) => `<div class="pday ${isWork(s) ? '' : 'we'} ${s === TODAY ? 'today' : ''}">${parse(s).getDate()}</div>`).join('')}`;
    people.forEach((e) => {
      html += `<div class="pn">${avatar(e, 'sm')}${esc(fullName(e))}</div>`;
      days.forEach((s, k) => {
        const l = isWork(s) ? cover(e, s) : null;
        let inner = '';
        if (l) {
          const sameAt = (d) => d && isWork(d) && cover(e, d) === l;
          let pv = k - 1; while (pv >= 0 && !isWork(days[pv])) pv--;
          let nx = k + 1; while (nx < days.length && !isWork(days[nx])) nx++;
          const st = !(pv >= 0 && sameAt(days[pv])) ? 's' : '', en = !(nx < days.length && sameAt(days[nx])) ? 'e' : '';
          inner = `<i class="${l.status === 'En attente' ? 't-pend' : TYPE_CLASS[l.type]} ${st} ${en}" title="${esc(fullName(e))} · ${esc(typeLabel(l))} (${l.status})"></i>`;
        }
        html += `<div class="pc ${isWork(s) ? '' : 'we'}">${inner}</div>`;
      });
    });
    return `<div class="card"><div class="card-h"><div class="toolbar"><button type="button" class="icon-btn" data-act="plan" data-d="-1" aria-label="Mois précédent">${ic('left')}</button><h3 style="min-width:150px;text-align:center">${monthLabel(m)}</h3><button type="button" class="icon-btn" data-act="plan" data-d="1" aria-label="Mois suivant">${ic('right')}</button></div>
      <div class="legend"><span><i class="t-cp"></i>Congés payés</span><span><i class="t-rtt"></i>RTT</span><span><i class="t-tt"></i>Télétravail</span><span><i class="t-mal"></i>Maladie · accident du travail</span><span><i class="t-fam"></i>Famille (maternité, paternité, événement, enfant malade)</span><span><i class="t-uns"></i>Sans solde · congé parental</span><span><i class="t-pend"></i>En attente</span></div></div>
      <div class="planning"><div class="plan-grid" style="grid-template-columns:${cols}">${html}</div></div></div>`;
  }
  function viewAbsences() {
    if (ui.profile === 'salarie') return myAbsences(me());
    const pending = pendingForMe();
    const sheets = pendingSheets(), sickTodo = db.leaves.filter((l) => IJ_TYPES.includes(l.type) && !l.dsnAt).length;
    const tabs = ui.profile === 'rh' ? [['valider', 'À valider', pending.length], ['temps', 'Temps de travail', sheets.length], ['arrets', 'Arrêts de travail', sickTodo], ['compteurs', 'Compteurs'], ['planning', 'Planning'], ['historique', 'Historique']]
      : [['valider', 'À valider', pending.length], ['temps', 'Temps de l’équipe', sheets.length], ['planning', 'Planning de l’équipe'], ['compteurs', 'Compteurs de l’équipe'], ['moi', 'Mes absences']];
    if (!tabs.some((t) => t[0] === ui.absTab)) ui.absTab = 'valider';
    let body;
    if (ui.absTab === 'valider') body = `<div class="card"><div class="req-list">${pending.length ? pending.sort((a, b) => a.start.localeCompare(b.start)).map((l) => reqRow(l, true)).join('') : '<div class="empty">Toutes les demandes ont été traitées.</div>'}</div></div>`;
    else if (ui.absTab === 'planning') body = planning(scopeEmployees().filter(isEmployed).concat(ui.profile === 'manager' ? [me()] : []));
    else if (ui.absTab === 'moi') body = myAbsences(me());
    else if (ui.absTab === 'temps') { const team = new Set(scopeEmployees().map((e) => e.id)), recent = db.timesheets.filter((t) => t.status !== 'Soumise' && (ui.profile === 'rh' || team.has(t.empId))).sort((a, b) => b.week.localeCompare(a.week)).slice(0, 8);
      body = `${card('Feuilles de temps à valider', `<span class="muted num">${sheets.length}</span>`, `<div class="req-list">${sheets.length ? sheets.map((t) => sheetRow(t, true)).join('') : '<div class="empty">Aucune feuille de temps en attente.</div>'}</div>`)}
        ${card('Dernières semaines', '', `<div class="req-list">${recent.map((t) => sheetRow(t, false)).join('') || '<div class="empty">Rien pour le moment.</div>'}</div>`)}<p class="hint">Les heures validées sont payées avec la paie du mois : majoration de 25 % de la 36e à la 43e heure, de 50 % au-delà. Contingent annuel : ${HS_QUOTA} heures.</p>`; }
    else if (ui.absTab === 'arrets') body = sickRows();
    else if (ui.absTab === 'compteurs') body = countersTable();
    else {
      const all = db.leaves.filter((l) => !ui.histStatus || l.status === ui.histStatus).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      body = `<div class="toolbar"><label class="sr" for="h-status">Statut</label><select id="h-status" class="select" data-change="histStatus"><option value="">Tous les statuts</option>${['En attente', 'Approuvée', 'Refusée'].map((s) => `<option ${ui.histStatus === s ? 'selected' : ''}>${s}</option>`).join('')}</select><span class="muted">${plural(all.length, 'demande', 'demandes')}</span></div>
        <div class="card"><div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Type</th><th>Période</th><th class="r">Jours</th><th>Demandée le</th><th>Statut</th></tr></thead><tbody>${all.map((l) => { const e = emp(l.empId);
          return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<b>${esc(fullName(e))}</b></div></td><td>${esc(typeLabel(l))}</td><td>${fmtShort(l.start)} → ${fmtDate(l.end)}</td><td class="r num">${l.days}</td><td>${fmtDate(l.createdAt)}</td><td>${leavePill(l)}</td></tr>`; }).join('')}</tbody></table></div></div>`;
    }
    return `<div class="tabs" role="tablist">${tabs.map(([k, l, n]) => `<button type="button" role="tab" aria-selected="${ui.absTab === k}" data-act="abs-tab" data-t="${k}">${l}${n !== undefined ? `<span class="count num">${n}</span>` : ''}</button>`).join('')}</div>${body}`;
  }

  // ---------------------------------------------------------------- Paie
  // ---- Paie du mois (voie « préparation ») : variables → contrôles → envoi au prestataire → bulletins reçus et diffusés.
  const PAY_STEPS = [['variables', 'Variables du mois'], ['controles', 'Contrôles'], ['envoi', 'Envoi au prestataire'], ['bulletins', 'Bulletins']];
  const PAY_STATUS = { Préparation: 'warn', Envoyée: 'info', Reçue: 'accent', Diffusée: 'ok' };
  let PROVIDER = 'Silae (cabinet Expert & Paie)';
  const payStatus = (m) => { const pr = payrollOf(m); return pr.closed ? 'Diffusée' : pr.status || 'Préparation'; };
  const payPeople = (m) => db.employees.filter((e) => inPayroll(e, m)).sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
  // Managers dont l'équipe figure dans la paie du mois : ils valident les variables de leur équipe (l'équipe RH et la direction sont validées par les RH).
  const payManagers = (m) => [...new Set(payPeople(m).map((e) => e.managerId).filter(Boolean))].map(emp).filter((x) => x && !['e1', DIR_ID()].includes(x.id));
  const teamOf = (mgr, m) => payPeople(m).filter((e) => e.managerId === mgr.id);
  // Contrôles avant envoi : chaque anomalie est corrigée à la source ou marquée « vérifiée ».
  function payChecks(m) {
    const start = m + '-01', end = monthEnd(m), pr = payrollOf(m), out = [], add = (id, level, text, sub, link) => out.push({ id, level, text, sub, link, ack: (pr.acks || {})[id] });
    const prev = shiftMonth(m, -1);
    payPeople(m).forEach((e) => {
      const p = calcPay(e, m), full = !(e.startDate > start) && !(e.exit && e.exit.lastDay < end);
      if (full && !['Stage', 'Alternance'].includes(e.contract) && p.gross < SMIC_M * ((e.quotite || 100) / 100)) add(`smic-${e.id}`, 'bad', `${fullName(e)} : brut inférieur au SMIC`, `${eur(p.gross)} pour un SMIC mensuel de ${eur(SMIC_M)}`, null);
      if (e.category === 'Cadre' && full && salaryAt(e, m) < 12 * 3400 * 0.78) add(`conv-${e.id}`, 'warn', `${fullName(e)} : salaire proche du minimum conventionnel cadre`, `Vérifier la grille de classification (${CONV().short}) de sa position`, null);
      if (full && db.payroll[prev] && inPayroll(e, prev) && !(e.startDate > prev + '-01')) { const q = calcPay(e, prev); if (q.gross && Math.abs(p.gross - q.gross) / q.gross > 0.2) add(`ecart-${e.id}`, 'warn', `${fullName(e)} : brut en écart de ${Math.round(((p.gross - q.gross) / q.gross) * 100)} % sur le mois précédent`, `${eur(q.gross)} → ${eur(p.gross)}`, null); }
      if (e.startDate >= start && e.startDate <= end && (!e.iban || e.iban === '—')) add(`rib-${e.id}`, 'bad', `${fullName(e)} : entrée dans le mois sans RIB`, 'Le virement du salaire ne pourra pas être fait', 'open-dossier');
      if (e.startDate >= start && e.startDate <= end && !isIntern(e) && !(dossierLight(e).dpae)) add(`dpae-${e.id}`, 'bad', `${fullName(e)} : DPAE non faite`, 'Obligatoire avant la prise de poste', 'open-dossier');
      if (e.exit && e.exit.lastDay >= start && e.exit.lastDay <= end) add(`exit-${e.id}`, 'warn', `${fullName(e)} : sortie le ${fmtShort(e.exit.lastDay)}`, 'Indemnités de sortie calculées et ajoutées aux variables du mois', null);
    });
    db.leaves.filter((l) => l.status === 'En attente' && l.start <= end && l.end >= start && payPeople(m).some((e) => e.id === l.empId)).forEach((l) => add(`leave-${l.id}`, 'warn', `Absence en attente de validation : ${fullName(emp(l.empId))}`, `${l.type} du ${fmtShort(l.start)} au ${fmtShort(l.end)}`, 'leaves'));
    db.leaves.filter((l) => IJ_TYPES.includes(l.type) && !l.dsnAt && l.start <= end && l.end >= start).forEach((l) => add(`ij-${l.id}`, 'warn', `Arrêt de travail sans attestation de salaire : ${fullName(emp(l.empId))}`, 'Les indemnités journalières ne seront pas versées', 'leaves'));
    (db.timesheets || []).filter((t) => t.status === 'Soumise' && t.week.slice(0, 7) === m).forEach((t) => add(`ts-${t.id}`, 'warn', `Heures non validées : ${fullName(emp(t.empId))}`, `Semaine du ${fmtShort(t.week)}`, 'leaves'));
    payManagers(m).filter((g) => !(pr.mgrOk || {})[g.id]).forEach((g) => add(`mgr-${g.id}`, 'warn', `Variables non validées par ${fullName(g)}`, `${plural(teamOf(g, m).length, 'collaborateur', 'collaborateurs')} · à valider avant le ${fmtShort(pr.cutoff || `${m}-${String(PAY_CUTOFF).padStart(2, '0')}`)}`, 'remind'));
    return out;
  }
  const openChecks = (m) => payChecks(m).filter((c) => !c.ack);
  const payCurrent = () => { const ms = payMonths(); return ms.find((x) => payStatus(x) !== 'Diffusée') || ms[ms.length - 1]; };
  function viewPay() {
    const months = payMonths();
    const m = ui.payMonth && months.includes(ui.payMonth) ? ui.payMonth : payCurrent(); ui.payMonth = m;
    const pr = payrollOf(m), st = payStatus(m), edit = st === 'Préparation', idx = months.indexOf(m), people = payPeople(m);
    const defStep = { Préparation: 'variables', Envoyée: 'envoi', Reçue: 'bulletins', Diffusée: 'bulletins' }[st];
    const step = PAY_STEPS.some(([k]) => k === ui.payStep) ? ui.payStep : defStep, checks = payChecks(m), open = checks.filter((c) => !c.ack);
    const done = { variables: st !== 'Préparation' || payManagers(m).every((g) => (pr.mgrOk || {})[g.id]), controles: st !== 'Préparation' || !open.length, envoi: ['Reçue', 'Diffusée'].includes(st), bulletins: st === 'Diffusée' };
    const head = `<div class="card"><div class="card-h" style="flex-wrap:wrap"><div class="toolbar"><button type="button" class="icon-btn" data-act="pay-month" data-m="${months[idx - 1] || ''}" ${idx ? '' : 'disabled'} aria-label="Mois précédent">${ic('left')}</button>
      <h3 style="min-width:170px;text-align:center">Paie de ${monthLabel(m).toLowerCase()}</h3><button type="button" class="icon-btn" data-act="pay-month" data-m="${months[idx + 1] || ''}" ${idx < months.length - 1 ? '' : 'disabled'} aria-label="Mois suivant">${ic('right')}</button>
      <span class="pill ${PAY_STATUS[st]}">${st === 'Préparation' ? 'En préparation' : st === 'Envoyée' ? `Envoyée au prestataire le ${fmtShort(pr.sentAt)}` : st === 'Reçue' ? 'Bulletins reçus · à diffuser' : 'Bulletins diffusés'}</span></div>
      <span class="hint">${edit ? `Clôture des variables le ${fmtDate(pr.cutoff || `${m}-${String(PAY_CUTOFF).padStart(2, '0')}`)} · ` : ''}${plural(people.length, 'collaborateur', 'collaborateurs')} · prestataire : ${PROVIDER}</span></div>
      <ol class="pay-steps">${PAY_STEPS.map(([k, l], i) => `<li class="${k === step ? 'now' : done[k] ? 'ok' : ''}"><button type="button" data-act="pay-step" data-s="${k}"><i class="num">${done[k] && k !== step ? '✓' : i + 1}</i>${l}${k === 'controles' && open.length && edit ? `<span class="badge-dot">${open.length}</span>` : ''}</button></li>`).join('')}</ol></div>`;
    let body = '';
    if (step === 'variables') {
      const rows = people.map((e) => { const p = calcPay(e, m), a = p.abs, sick = a.sick.reduce((s, x) => s + x.work, 0), x = payExtra(m, e.id), ok = !payManagers(m).some((g) => g.id === e.managerId) || (pr.mgrOk || {})[e.managerId];
        const absTxt = [a.cp ? `${a.cp} j CP` : '', a.rtt ? `${a.rtt} j RTT` : '', sick ? `${sick} j maladie` : '', a.unpaid ? `${a.unpaid} j sans solde` : '', a.tt ? `${a.tt} j télétravail` : ''].filter(Boolean).join(' · ') || '—';
        const inp = (k, v, label) => (edit ? `<label class="sr" for="v-${k}-${e.id}">${label} · ${esc(fullName(e))}</label><input id="v-${k}-${e.id}" class="input cell-input num" type="number" min="0" step="10" value="${v || ''}" placeholder="0" data-change="pay-var" data-id="${e.id}" data-k="${k}">` : `<span class="num">${v ? eur(v) : '—'}</span>`);
        return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)}${e.startDate.slice(0, 7) === m ? ' · entrée' : ''}${e.exit && e.exit.lastDay.slice(0, 7) === m ? ' · sortie' : ''}</small></div></div></td>
          <td><small>${absTxt}</small></td><td class="r num">${p.ot.amount ? fmtH(p.ot.h25 + p.ot.h50) : '—'}</td><td class="r">${inp('bonus', pr.bonus[e.id], 'Prime')}</td><td class="r num">${p.transport ? eur(p.transport) : '—'}</td><td class="r num">${p.trN || '—'}</td>
          <td class="r">${inp('ndf', x.ndf, 'Notes de frais')}</td><td class="r">${inp('acompte', x.acompte, 'Acompte')}</td><td>${ok ? '<span class="pill ok">Validé</span>' : '<span class="pill warn">À valider</span>'}</td></tr>`; }).join('');
      const mgrs = payManagers(m).map((g) => { const okd = (pr.mgrOk || {})[g.id];
        return `<span class="who-chip">${avatar(g, 'sm')}${esc(fullName(g))} · ${okd ? `validé le ${fmtShort(okd)}` : 'en attente'}${!okd && edit ? `<button type="button" class="linkish" data-act="pay-remind" data-id="${g.id}">Relancer</button>` : ''}</span>`; }).join('');
      body = `<div class="card"><div class="card-h"><h3>Éléments variables</h3><span class="muted" style="font-size:13px">Absences, heures et entrées-sorties remontent automatiquement de Teamora</span></div>
        <div class="card-b" style="border-bottom:1px solid var(--line)"><div class="team"><span class="team-l">Validation des managers</span>${mgrs}</div></div>
        <div class="table-wrap"><table class="pay-vars"><thead><tr><th>Collaborateur</th><th>Absences</th><th class="r">Heures sup.</th><th class="r">Prime</th><th class="r">Transport (50 %)</th><th class="r">Titres-resto</th><th class="r">Notes de frais</th><th class="r">Acompte</th><th>Manager</th></tr></thead><tbody>${rows}</tbody></table></div></div>
        <div class="toolbar" style="justify-content:flex-end"><button type="button" class="btn primary" data-act="pay-step" data-s="controles">Passer aux contrôles${ic('arrow')}</button></div>`;
    }
    if (step === 'controles') {
      body = `<div class="card"><div class="card-h"><h3>Contrôles avant envoi</h3><span class="pill ${open.length ? 'warn' : 'ok'}">${open.length ? plural(open.length, 'point à lever', 'points à lever') : 'Tout est vérifié'}</span></div><div class="card-b">
        ${checks.length ? checks.map((c) => `<div class="todo ${c.ack ? 'acked' : ''}"><span class="chk-dot ${c.ack ? 'ok' : c.level}"></span><div class="t"><b>${esc(c.text)}</b><small>${esc(c.sub)}${c.ack ? ` · vérifié par ${esc(fullName(emp(c.ack.by)))} le ${fmtShort(c.ack.date)}` : ''}</small></div>
          ${!c.ack && edit ? `${c.link === 'leaves' ? '<button type="button" class="btn ghost sm" data-act="go" data-v="absences">Ouvrir les absences</button>' : c.link === 'remind' ? `<button type="button" class="btn ghost sm" data-act="pay-remind" data-id="${c.id.slice(4)}">Relancer</button>` : c.link === 'open-dossier' ? `<button type="button" class="btn ghost sm" data-act="open-dossier" data-id="${c.id.split('-')[1]}">Ouvrir le dossier</button>` : ''}<button type="button" class="btn ghost sm" data-act="pay-ack" data-id="${c.id}">${ic('check')}Vérifié</button>` : ''}</div>`).join('')
          : '<p class="muted" style="margin:0">Aucune anomalie détectée.</p>'}
        <p class="hint" style="margin:12px 0 0">Corrige l’anomalie à la source (absence, heures, dossier) ou marque-la comme vérifiée si elle est justifiée. L’envoi est possible quand tous les points sont levés.</p></div></div>
        ${edit ? `<div class="toolbar" style="justify-content:flex-end"><button type="button" class="btn primary" data-act="pay-step" data-s="envoi" ${open.length ? 'disabled' : ''}>Passer à l’envoi${ic('arrow')}</button></div>` : ''}`;
    }
    if (step === 'envoi') {
      const tot = people.reduce((s, e) => s + calcPay(e, m).gross, 0);
      body = `<div class="card"><div class="card-h"><h3>Envoi des variables au prestataire de paie</h3><span class="muted" style="font-size:13px">${PROVIDER}</span></div><div class="card-b">
        <div class="info-grid"><div><span>Collaborateurs</span>${people.length}</div><div><span>Masse brute estimée</span><span class="num">${eur0(tot)}</span></div><div><span>Points de contrôle levés</span>${checks.length - open.length} sur ${checks.length}</div><div><span>Fichier</span><span class="num">variables-paie-${m}.csv</span></div></div>
        <div class="toolbar" style="margin-top:16px">${edit ? `<button type="button" class="btn primary" data-act="pay-send" ${open.length ? 'disabled' : ''}>${ic('arrow')}Envoyer au prestataire</button>${open.length ? `<span class="hint">${plural(open.length, 'point de contrôle reste', 'points de contrôle restent')} à lever.</span>` : ''}`
          : `<span class="pill ok">Envoyé le ${fmtDate(pr.sentAt)} par ${esc(fullName(emp(pr.sentBy || 'e1')))}</span>`}<button type="button" class="btn ghost" data-act="pay-csv" data-m="${m}">${ic('file')}Télécharger l’export</button>
          ${st === 'Envoyée' ? '<button type="button" class="btn primary" data-act="pay-receive">Bulletins reçus du prestataire</button><span class="hint">Démo : simule le retour des bulletins calculés et de la DSN déposée.</span>' : ''}</div>
        <p class="hint" style="margin:14px 0 0">Le prestataire calcule la paie, dépose la déclaration sociale nominative (DSN) et renvoie les bulletins ; Teamora les diffuse ensuite aux salariés.</p></div></div>`;
    }
    if (step === 'bulletins') {
      if (st === 'Préparation' || st === 'Envoyée') body = '<div class="card empty">Les bulletins apparaîtront ici dès leur retour du prestataire.</div>';
      else {
        const rows = people.map((e) => [e, calcPay(e, m)]), T = rows.reduce((s, [, p]) => { ['gross', 'salTot', 'empTot', 'netImposable', 'tax', 'net', 'cost'].forEach((k) => { s[k] = (s[k] || 0) + p[k]; }); return s; }, {});
        body = `<div class="card"><div class="card-h"><h3>Journal de paie</h3>${st === 'Reçue' ? `<button type="button" class="btn primary" data-act="pay-publish">${ic('check')}Diffuser les bulletins aux salariés</button>` : `<span class="pill ok">Diffusés le ${fmtDate(pr.publishedAt || monthEnd(m))}</span>`}</div>
          <div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th class="r">Brut</th><th class="r">Cotisations salariales</th><th class="r">Cotisations patronales</th><th class="r">Net imposable</th><th class="r">Impôt à la source</th><th class="r">Net payé</th><th class="r">Coût employeur</th><th></th></tr></thead><tbody>
          ${rows.map(([e, p]) => `<tr><td><div class="who-cell">${avatar(e, 'sm')}<div><b>${esc(fullName(e))}</b><small>${esc(classification(e))}</small></div></div></td><td class="r num">${eur(p.gross)}</td><td class="r num">${eur(p.salTot)}</td><td class="r num">${eur(p.empTot)}</td><td class="r num">${eur(p.netImposable)}</td><td class="r num">${eur(p.tax)}</td><td class="r num"><b>${eur(p.net)}</b></td><td class="r num">${eur(p.cost)}</td>
            <td><button type="button" class="btn ghost sm" data-act="payslip" data-id="${e.id}" data-m="${m}">Bulletin</button></td></tr>`).join('')}</tbody>
          <tfoot><tr><td>Total</td><td class="r num">${eur(T.gross)}</td><td class="r num">${eur(T.salTot)}</td><td class="r num">${eur(T.empTot)}</td><td class="r num">${eur(T.netImposable)}</td><td class="r num">${eur(T.tax)}</td><td class="r num">${eur(T.net)}</td><td class="r num">${eur(T.cost)}</td><td></td></tr></tfoot></table></div></div>`;
      }
    }
    return `${head}${body}<p class="hint">Simulation : taux et plafonds de démonstration (plafond mensuel de la Sécurité sociale ${eur0(PSS)}, SMIC ${eur(SMIC_M)}). Le calcul officiel est réalisé par le prestataire de paie.</p>`;
  }
  // Manager : validation des variables de son équipe avant la clôture.
  function mgrPayCard() {
    const m = payCurrent(), pr = payrollOf(m), team = teamOf(me(), m), okd = (pr.mgrOk || {})[me().id];
    if (!team.length || payStatus(m) !== 'Préparation') return '';
    return card(`Variables de paie de l’équipe · ${monthLabel(m).toLowerCase()}`, okd ? `<span class="pill ok">Validées le ${fmtShort(okd)}</span>` : `<span class="pill warn">À valider avant le ${fmtShort(pr.cutoff || `${m}-${String(PAY_CUTOFF).padStart(2, '0')}`)}</span>`, `<div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Absences</th><th class="r">Heures sup.</th><th class="r">Prime</th></tr></thead><tbody>
      ${team.map((e) => { const p = calcPay(e, m), a = p.abs, sick = a.sick.reduce((s, x) => s + x.work, 0); return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)}</small></div></div></td><td><small>${[a.cp ? `${a.cp} j CP` : '', a.rtt ? `${a.rtt} j RTT` : '', sick ? `${sick} j maladie` : '', a.tt ? `${a.tt} j télétravail` : ''].filter(Boolean).join(' · ') || '—'}</small></td><td class="r num">${p.ot.amount ? fmtH(p.ot.h25 + p.ot.h50) : '—'}</td><td class="r num">${p.bonus ? eur(p.bonus) : '—'}</td></tr>`; }).join('')}</tbody></table></div>
      <div class="card-b"><div class="toolbar"><span class="hint">Vérifie les absences, heures et primes de ton équipe : une erreur signalée après la clôture se corrige le mois suivant.</span>${okd ? '' : `<button type="button" class="btn primary" data-act="pay-mgr-ok" style="margin-left:auto">${ic('check')}Valider les variables</button>`}</div></div>`);
  }
  // Bulletin de paie clarifié (arrêté du 25 février 2016, montant net social depuis juillet 2023), présenté comme un bulletin papier.
  function payslipHTML(e, m) {
    const p = calcPay(e, m), pr = payrollOf(m), y = m.slice(0, 4), d = dossierLight(e), cad = e.category === 'Cadre';
    const num = (v, dec = 2) => (v === null || v === undefined || v === '' ? '' : typeof v === 'string' ? v : v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }));
    const pct = (v) => (v ? num(v * 100, v * 100 < 1 ? 3 : 2) : '');
    const ytd = payMonths().filter((x) => x.slice(0, 4) === y && x <= m && (payStatus(x) !== 'Préparation' || x === m) && inPayroll(e, x)).reduce((s, x) => { const q = calcPay(e, x);
      s.h += cad ? 0 : HOURS_M; s.hs += q.ot.h25 + q.ot.h50; s.g += q.gross; s.pss += PSS; s.ni += q.netImposable; s.cp += q.empTot; s.cost += q.cost; s.rg += q.rg; return s; }, { h: 0, hs: 0, g: 0, pss: 0, ni: 0, cp: 0, cost: 0, rg: 0 });
    // Ligne : libellé · base · taux · à déduire · à payer · base patronale · taux patronal · montant patronal
    const L = (l, b, t, ded, pay, pb, pt, pm, cls = '') => `<tr class="${cls}"><td>${l}</td><td class="r">${num(b)}</td><td class="r">${t || ''}</td><td class="r">${ded ? num(ded) : ''}</td><td class="r">${pay ? num(pay) : ''}</td><td class="r pat">${num(pb)}</td><td class="r pat">${pt || ''}</td><td class="r pat">${pm ? num(pm) : ''}</td></tr>`;
    const hourly = salaryAt(e, m) / 12 / HOURS_M, daily = salaryAt(e, m) / 12 / Math.max(1, workDays(m + '-01', monthEnd(m)));
    const earn = p.earn.map(([l, , , v], i) => {
      if (i === 0) return L(l, cad ? 'forfait' : HOURS_M, cad ? '' : num(hourly, 4), '', v);
      if (/^Absence/.test(l)) { const days = Math.round(-v / daily); return L(esc(l), days, num(daily, 4), -v, ''); }
      if (/^Heures/.test(l)) return L(esc(l), p.ot.h25 + p.ot.h50, '', '', v);
      return L(esc(l), '', '', '', v);
    }).join('');
    const groups = [...new Set(p.rows.map((r) => r.group))];
    const contrib = groups.map((g) => { const rs = p.rows.filter((r) => r.group === g);
      if (rs.length === 1 && rs[0].label === g) { const r = rs[0]; return L(`<b>${g}</b>`, r.ts ? r.base : '', pct(r.ts), r.s, '', r.base, pct(r.tp), r.p); }
      return `<tr class="grp"><td colspan="8"><b>${g}</b></td></tr>${rs.map((r) => L(r.label, r.ts || r.s ? r.base : '', pct(r.ts), r.s, '', r.base, pct(r.tp), r.p, 'sub')).join('')}`; }).join('');
    const below = [p.trN ? L('Titres-restaurant', p.trN, num(TR_VALUE - TR_EMPLOYER), p.trN * (TR_VALUE - TR_EMPLOYER), '', p.trN, num(TR_EMPLOYER), p.trEmployer) : '',
      p.tele ? L('Allocation forfaitaire de télétravail', p.abs.tt, num(TT_DAY), '', p.tele) : '',
      p.transport ? L(`Remboursement transports en commun (abonnement ${(e.location || '').split(' ')[0]})`, p.transport * 2, '50,00', '', p.transport) : '',
      p.ijNet ? L('Indemnités journalières de Sécurité sociale (subrogation)', '', '', '', p.ijNet) : '',
      p.ndf ? L('Remboursement de notes de frais', '', '', '', p.ndf) : '',
      p.ppv ? L('Prime de partage de la valeur (nette de CSG-CRDS)', p.ppv, '9,70', '', p.ppvNet) : '',
      p.acompte ? L('Acompte versé', '', '', p.acompte, '') : ''].join('');
    // Congés : période de référence du 1er juin au 31 mai.
    const refStart = `${m.slice(5) >= '06' ? y : y - 1}-06-01`, monthsN = Math.max(0, (Number(m.slice(0, 4)) - Number(refStart.slice(0, 4))) * 12 + Number(m.slice(5)) - 5);
    const takenN1 = db.leaves.filter((l) => l.empId === e.id && l.type === 'Congés payés' && l.status === 'Approuvée' && l.start >= refStart && l.start <= monthEnd(m)).reduce((s, l) => s + l.days, 0);
    const acqN = Math.min(25, monthsN * 2.08), paid = COMPANY_PAY.paidOn(m), [mm, yy] = [m.slice(5), y];
    const statut = e.contract === 'Stage' ? 'Stagiaire' : e.contract === 'Alternance' ? 'Apprenti' : cad ? 'Cadre' : 'Employé (ETAM)';
    const cls = classification(e).split('·').map((s) => s.trim()), niveau = (cls[1] || '').replace('position ', ''), coef = (cls[2] || '').replace('coefficient ', '');
    const kv = (k, v) => `<div><span>${k}</span><b>${v || '—'}</b></div>`;
    return `<div class="bs"><div class="bs-top"><div class="bs-emp"><b class="bs-co">${COMPANY.entreprise}</b><span>${COMPANY.entreprise_adresse.replace(', ', '<br>')}</span>
        <div class="bs-kv">${kv('Siret', COMPANY.siret)}${kv('Code NAF', COMPANY_PAY.naf.split(' ·')[0])}${kv('Urssaf', COMPANY_PAY.urssaf)}${kv('Matricule', String(e.id.slice(1)).padStart(5, '0'))}
          ${kv('N° SS', `${e.sex === 'H' ? '1' : '2'} ${(e.birthDate || '1990-01-01').slice(2, 7).replace('-', ' ')} •• ••• ••• ••`)}${kv('IBAN', esc(e.iban))}${kv('Emploi', esc(e.title))}${kv('Statut professionnel', statut)}
          ${kv('Niveau', niveau)}${kv('Coefficient', coef)}${kv('Entrée', fmtDate(e.startDate))}${kv('Ancienneté', seniority(e.startDate).toLowerCase())}${kv('Convention collective', COMPANY_PAY.idcc)}</div></div>
      <div class="bs-right"><h2>BULLETIN DE SALAIRE</h2><p>Période : <b>${mm} / ${yy}</b> · du ${fmtDate(m + '-01')} au ${fmtDate(monthEnd(m))}</p>
        <div class="bs-addr"><b>${e.sex === 'H' ? 'Monsieur' : 'Madame'} ${esc(e.firstName)} ${esc(e.lastName.toUpperCase())}</b><span>${esc(e.address || 'Adresse non renseignée').replace(/, /g, '<br>')}</span></div></div></div>
      <table class="bs-t"><colgroup><col class="c-l"><col><col><col><col><col><col><col></colgroup>
        <thead><tr><th rowspan="2">Éléments de paie</th><th rowspan="2" class="r">Base</th><th rowspan="2" class="r">Taux</th><th rowspan="2" class="r">À déduire</th><th rowspan="2" class="r">À payer</th><th colspan="3">Charges patronales</th></tr><tr><th class="r">Base</th><th class="r">Taux</th><th class="r">Montant</th></tr></thead>
        <tbody>${earn}${L('<b>Salaire brut</b>', '', '', '', p.gross, '', '', '', 'strong')}
          <tr class="gap"><td colspan="8"></td></tr>${contrib}
          ${p.rg ? L('Réduction générale des cotisations patronales', '', '', '', '', '', '', -p.rg, 'sub') : ''}
          ${L('<b>Total des cotisations et contributions</b>', '', '', p.salTot, '', '', '', p.empTot, 'strong')}
          ${below ? `<tr class="gap"><td colspan="8"></td></tr>${below}` : ''}
          <tr class="gap"><td colspan="8"></td></tr>
          <tr class="big"><td>Net à payer avant impôt sur le revenu</td><td></td><td></td><td></td><td class="r">${num(p.netBefore)}</td><td colspan="3"></td></tr>
          ${L('Impôt sur le revenu prélevé à la source · PAS<br><small>Taux personnalisé</small>', p.netImposable, pct(p.rate) || '0,00', p.tax, '')}
          ${L('<b>Net payé</b>', '', '', '', p.net, '', '', '', 'strong')}</tbody></table>
      <table class="bs-sum"><thead><tr><th></th><th>Heures</th><th>Heures suppl.</th><th>Brut</th><th>Plafond S.S.</th><th>Net imposable</th><th>Ch. patronales</th><th>Coût global</th><th>Allègements</th></tr></thead>
        <tbody><tr><th>Mensuel</th><td>${cad ? 'forfait' : num(HOURS_M)}</td><td>${num(p.ot.h25 + p.ot.h50)}</td><td>${num(p.gross)}</td><td>${num(PSS)}</td><td>${num(p.netImposable)}</td><td>${num(p.empTot)}</td><td>${num(p.cost)}</td><td>${num(p.rg)}</td></tr>
          <tr><th>Annuel</th><td>${cad ? 'forfait' : num(ytd.h)}</td><td>${num(ytd.hs)}</td><td>${num(ytd.g)}</td><td>${num(ytd.pss)}</td><td>${num(ytd.ni)}</td><td>${num(ytd.cp)}</td><td>${num(ytd.cost)}</td><td>${num(ytd.rg)}</td></tr></tbody></table>
      <div class="bs-bottom"><table class="bs-cp"><thead><tr><th></th><th>Congés N-1</th><th>Congés N</th></tr></thead><tbody>
          <tr><th>Acquis</th><td>${num(e.cp + takenN1)}</td><td>${num(acqN)}</td></tr><tr><th>Pris</th><td>${num(takenN1)}</td><td>${num(0)}</td></tr><tr><th>Solde</th><td>${num(e.cp)}</td><td>${num(acqN)}</td></tr></tbody></table>
        <div class="bs-social"><span>Montant net social</span><b>${num(p.netSocial)} €</b><small>À déclarer pour la prime d’activité et le RSA</small></div>
        <div class="bs-net"><div><span>Net payé :</span><b>${num(p.net)} €</b></div><small>Paiement le ${fmtDate(paid)} par virement</small></div></div>
      <p class="bs-legal">Dans votre intérêt et pour vous aider à faire valoir vos droits, conservez ce bulletin de paie sans limitation de durée. Rubrique dédiée au bulletin de paie sur le portail www.service-public.fr.${d.mutuelle === 'Dispense' ? ' Dispense d’adhésion à la complémentaire santé.' : ''}${pr.closed ? '' : ' Aperçu : bulletin pas encore diffusé.'} Bulletin de démonstration, taux indicatifs.</p></div>`;
  }
  function viewPayslips() {
    const e = me(), mob = mobSal();
    const months = payMonths().filter((m) => db.payroll[m] && db.payroll[m].closed && inPayroll(e, m)).reverse();
    return `<div class="card"><div class="card-h"><h3>Mes bulletins de paie</h3><span class="muted">${plural(months.length, 'bulletin', 'bulletins')}</span></div><div class="req-list">${months.length ? months.map((m) => { const p = calcPay(e, m);
      return `<div class="req"><div class="what"><b>${monthLabel(m)}</b><small class="num">Brut ${eur(p.gross)} · net social ${eur(p.netSocial)} · net payé ${eur(p.net)}</small></div><button type="button" class="btn ghost sm" data-act="payslip" data-id="${e.id}" data-m="${m}">${ic('file')}Voir le bulletin</button></div>`; }).join('') : '<div class="empty">Aucun bulletin pour le moment.</div>'}</div>
      ${mob ? '' : `<div class="card-b" style="border-top:1px solid var(--line)"><label class="agree"><input type="checkbox" data-change="paper-slip" ${e.paperSlip ? 'checked' : ''}> Je préfère recevoir mes bulletins en version papier</label><p class="hint" style="margin:6px 0 0">Les bulletins sont remis sous forme électronique ; tu peux t’y opposer à tout moment (article L3243-2 du Code du travail). Ils restent consultables ici.</p></div>`}</div>
      <p class="hint">Le bulletin du mois apparaît ici dès que les RH le diffusent${mob ? '' : ' (essaie depuis le profil RH, menu Paie)'}.</p>`;
  }
  function payCsv(m) {
    const head = ['Matricule', 'Nom', 'Prénom', 'Contrat', 'Salaire mensuel', 'Jours CP', 'Jours RTT', 'Jours maladie', 'Jours sans solde', 'Jours télétravail', 'Heures sup 25 %', 'Heures sup 50 %', 'Prime', 'Prime partage valeur', 'Transport', 'Titres-restaurant', 'Notes de frais', 'Acompte', 'Entrée', 'Sortie', 'Motif de sortie', 'Indemnité CP', 'Indemnité de rupture', 'Indemnité de fin de contrat'];
    const rows = payPeople(m).map((e) => { const p = calcPay(e, m), a = p.abs; return [e.id, e.lastName, e.firstName, e.contract, (salaryAt(e, m) / 12).toFixed(2), a.cp, a.rtt, a.sick.reduce((s, x) => s + x.work, 0), a.unpaid, a.tt, p.ot.h25, p.ot.h50, p.bonus, p.ppv, p.transport.toFixed(2), p.trN, p.ndf, p.acompte, e.startDate.slice(0, 7) === m ? e.startDate : '', e.exit && e.exit.lastDay.slice(0, 7) === m ? e.exit.lastDay : ''].concat((() => { const x = e.exit && e.exit.lastDay.slice(0, 7) === m ? exitIndemnities(e) : null; return x ? [e.exit.reason, x.cpPay.toFixed(2), x.legal.toFixed(2), x.precarite.toFixed(2)] : ['', '', '', '']; })()); });
    return [head].concat(rows).map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');
  }

  // ---------------------------------------------------------------- Recrutement
  const CAND_STAGES = ['Reçue', 'Présélection', 'Entretien', 'Proposition', 'Embauché', 'Refusé'];
  const JOB_PILL = { Brouillon: ['neutral', 'Brouillon'], 'En validation': ['warn', 'En validation'], 'À modifier': ['warn', 'À modifier'], Validée: ['accent', 'Validé · à publier'], Refusée: ['bad', 'Refusé'], Ouverte: ['ok', 'Offre publiée'], Pourvue: ['info', 'Pourvue'], Clôturée: ['neutral', 'Clôturée'] };
  const jobPill = (j) => (j.status === 'Validée' ? `<span class="pill accent">${j.ad && j.ad.ready ? 'Offre à valider' : 'Offre en rédaction'}</span>` : `<span class="pill ${JOB_PILL[j.status][0]}">${JOB_PILL[j.status][1]}</span>`);
  const stars = (n, id) => `<span class="stars ${id ? 'lg' : ''}" ${id ? 'role="group" aria-label="Note du candidat"' : `aria-label="Note ${n} sur 5"`}>${[1, 2, 3, 4, 5].map((k) => id
    ? `<button type="button" data-act="cand-score" data-id="${id}" data-v="${k}" class="${k <= n ? '' : 'off'}" aria-label="${k} sur 5" aria-pressed="${k === n}">${STAR}</button>` : `<span class="${k <= n ? '' : 'off'}">${STAR}</span>`).join('')}</span>`;
  // ---------------------------------------------------------------- Mon profil
  // Salarié : son dossier et l'organigramme de l'entreprise.
  function viewMyAdmin() {
    const orgOk = ui.profile !== 'salarie' || !!ui.selfOf || db.settings.droits.orgSalarie, t = ui.profTab === 'organigramme' && orgOk ? 'organigramme' : 'profil';
    if (!orgOk) return viewProfile();
    const mob = mobSal();
    return `<div class="tabs" role="tablist">${[['profil', 'Mon profil'], ['organigramme', mob ? 'Annuaire' : 'Organigramme']].map(([k, l]) => `<button type="button" role="tab" aria-selected="${t === k}" data-act="prof-tab" data-t="${k}">${l}</button>`).join('')}</div>${t === 'profil' ? viewProfile() : mob ? mobDirectory() : orgChart()}`;
  }
  // Annuaire (téléphone) : qui est qui, par service, avec l'e-mail professionnel ; l'organigramme complet reste sur ordinateur.
  function mobDirectory() {
    const people = db.employees.filter(isEmployed), by = {};
    people.forEach((e) => { (by[e.dept] = by[e.dept] || []).push(e); });
    return Object.keys(by).sort((a, b) => a.localeCompare(b, 'fr')).map((d) => card(esc(d), `<span class="muted num" style="font-size:13px">${by[d].length}</span>`, `<div class="mob-dir">${by[d].sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr')).map((e) => `<div class="mob-person">${avatar(e)}<div class="t"><b>${esc(fullName(e))}</b><small>${esc(e.title)}</small><small class="mail">${esc(e.email)}</small></div></div>`).join('')}</div>`)).join('');
  }
  function viewProfile() {
    const e = me(), mgr = emp(e.managerId);
    return `<div class="card"><div class="drawer-h" style="padding:22px 24px">${avatar(e, 'lg')}<div><h2>${esc(fullName(e))}</h2><p>${esc(e.title)} · ${esc(e.dept)} · ${statusPill(e)}</p></div></div>
      <div class="card-b" style="border-top:1px solid var(--line)"><div class="info-grid"><div><span>E-mail professionnel</span>${esc(e.email)}</div><div><span>Manager</span>${mgr ? esc(fullName(mgr)) : '—'}</div><div><span>Contrat</span>${esc(e.contract)}</div>
        <div><span>Date d’entrée</span>${fmtDate(e.startDate)} · ${seniority(e.startDate)}</div><div><span>Salaire annuel brut</span><span class="num">${eur0(e.salary)}</span></div>
        <div><span>Adresse postale</span>${esc(e.address) || '—'}</div><div><span>Coordonnées bancaires</span><span class="num">${esc(e.iban)}</span></div><div><span>Situation familiale</span>${esc(e.family || '—')}</div></div></div></div>
      <form class="card" data-form="profile" novalidate><div class="card-h"><h3>Mes informations personnelles</h3><span class="muted" style="font-size:13px">Les RH sont prévenus de chaque modification</span></div><div class="card-b"><div class="form-grid">
        <div class="field"><label for="p-phone">Téléphone</label><input id="p-phone" name="phone" type="tel" inputmode="tel" class="input" value="${esc(e.phone)}" autocomplete="tel"></div>
        <div class="field"><label for="p-loc">Lieu de travail</label><select id="p-loc" name="location" class="select">${SITES().concat(['Télétravail majoritaire']).map((l) => `<option ${l === e.location ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
        <div class="field full"><label for="p-emerg">Contact d’urgence</label><input id="p-emerg" name="emergency" class="input" value="${esc(e.emergency)}" placeholder="Nom · téléphone"></div></div>
        <div class="toolbar" style="margin-top:16px"><span class="err" id="p-err"></span><button class="btn primary" style="margin-left:auto">Enregistrer</button></div></div></form>
      ${myChangesHTML(e)}
      <h3 style="font-size:16px;margin-top:4px">Mes documents</h3>${docsList(e, true)}`;
  }

  // ================================================================ Modules : développement, suivi, documents
  const MOD_ACT = {}, MOD_CHG = {}, MOD_FORMS = {}, MODALS = {}, DRAWERS = {}, MOD_LIVE = {}, MOD_INP = {};
  // ---------------------------------------------------------------- V3 · « Donner mon avis » (tests avec des PME)
  // Chaque avis est enregistré dans la base de la page (avis/<id du testeur>/r/<avis>), lisible par le seul propriétaire.
  // Sans accès à la base (testeur extérieur, page ouverte hors de claude.ai), l'avis se publie en commentaire ou se copie.
  const AVIS = { db: null, user: null, comments: null, owner: false, ready: false };
  const AVIS_TYPES = [['aide', 'Ça m’aide'], ['manque', 'Il manque quelque chose'], ['confus', 'Ce n’est pas clair'], ['bug', 'Quelque chose ne marche pas']];
  const AVIS_SIZES = ['1 à 10 salariés', '11 à 49 salariés', '50 à 249 salariés', '250 salariés et plus'];
  (function initAvis() {
    const C = window.claude; if (!C || typeof C.use !== 'function') { AVIS.ready = true; return; }
    const safe = (n) => Promise.resolve().then(() => C.use(n)).catch(() => null);
    Promise.all([safe('db'), safe('user'), safe('comments')]).then(async ([d, u, c]) => {
      Object.assign(AVIS, { db: d, user: u, comments: c, ready: true });
      AVIS.owner = u ? await u.isOwner().catch(() => false) : false;
      if (ui.modal && ui.modal.type === 'avis') render();
    });
  })();
  const avisScreen = () => `${PROFILES[persona()].label}${ui.selfOf ? ' (espace personnel)' : ''} · ${ui.view === 'etape' && STAGES[ui.stage] ? STAGES[ui.stage].title : (VIEW_LABELS[ui.profile] || {})[ui.view] || (ui.view === 'setup' ? 'Installation' : ui.view)}`;
  const avisText = (r) => `Avis sur Teamora (V3) · ${r.appareil}\nÉcran : ${r.ecran}\nAvis : ${(AVIS_TYPES.find(([k]) => k === r.type) || ['', r.type])[1]}${r.note ? ` · utilité ${r.note}/5` : ''}${r.entreprise || r.taille ? `\nEntreprise : ${[r.entreprise, r.taille].filter(Boolean).join(' · ')}` : ''}\n\n${r.message}`;
  async function avisLoad() {
    try {
      const people = await AVIS.db.collection('avis').get(), rows = [];
      for (const d of people.docs) { const r = await AVIS.db.doc(`avis/${d.id}`).collection('r').get(); r.docs.forEach((x) => { if (x.exists) rows.push(x.data()); }); }
      rows.sort((a, b) => String(b.date).localeCompare(String(a.date)));
      if (ui.modal && ui.modal.type === 'avis' && ui.modal.list) { ui.modal.rows = rows; render(); }
    } catch (e) { if (ui.modal && ui.modal.list) { ui.modal.rows = []; ui.modal.err = 'Lecture des avis impossible pour le moment.'; render(); } }
  }
  MODALS.avis = (m, shell) => {
    const close = '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>';
    if (m.done) return shell('Merci pour ton avis', `<div class="modal-b avis-done">${ic('check')}<p>Ton avis est bien enregistré. Il sera lu pour améliorer Teamora.</p><button type="button" class="btn ghost" data-act="avis-open">Donner un autre avis</button></div>`, close);
    if (m.fallback) return shell('Envoyer ton avis', `<div class="modal-b"><p style="margin:0 0 10px">${m.why || 'Ton avis n’a pas pu être enregistré automatiquement depuis ce navigateur.'} ${AVIS.comments ? 'Tu peux le publier en commentaire sur la page, ou le copier pour l’envoyer à la personne qui t’a transmis le lien.' : 'Copie-le pour l’envoyer par e-mail ou message à la personne qui t’a transmis le lien.'}</p>
      <label class="lbl" for="avis-copy">Ton avis</label><textarea id="avis-copy" class="input" readonly style="min-height:160px">${esc(m.fallback)}</textarea>
      <div class="toolbar" style="margin-top:12px"><button type="button" class="btn primary" data-act="avis-copy">${ic('file')}Copier mon avis</button>${AVIS.comments ? `<button type="button" class="btn ghost" data-act="avis-comment">${ic('chat')}Publier en commentaire</button>` : ''}</div></div>`, close);
    if (m.list) return shell('Avis reçus', `<div class="modal-b">${!m.rows ? '<p class="muted">Chargement des avis…</p>' : m.err ? `<p class="err">${esc(m.err)}</p>` : m.rows.length ? `<p class="hint" style="margin:0 0 10px">${plural(m.rows.length, 'avis', 'avis')} · visibles par toi seul.</p>${m.rows.map((r) => `<div class="avis-row"><div class="toolbar"><span class="pill ${r.type === 'bug' ? 'bad' : r.type === 'aide' ? 'ok' : 'warn'}">${esc((AVIS_TYPES.find(([k]) => k === r.type) || ['', r.type])[1])}</span>${r.note ? `<span class="pill neutral num">${esc(r.note)}/5</span>` : ''}<small class="muted">${esc(fmtDate(String(r.date).slice(0, 10)))} · ${esc(r.appareil || '')}</small></div>
        <b>${esc(r.ecran || '')}</b><p>${esc(r.message || '')}</p>${r.entreprise || r.taille ? `<small class="muted">${esc([r.entreprise, r.taille].filter(Boolean).join(' · '))}</small>` : ''}</div>`).join('')}` : '<p class="muted">Aucun avis pour le moment.</p>'}</div>`, close, true);
    const types = AVIS_TYPES.map(([k, l]) => `<label class="avis-chip"><input type="radio" name="type" value="${k}" ${k === 'aide' ? 'checked' : ''}><span>${l}</span></label>`).join('');
    const notes = [1, 2, 3, 4, 5].map((n) => `<label class="avis-note"><input type="radio" name="note" value="${n}"><span class="num">${n}</span></label>`).join('');
    return shell('Donner mon avis', `<form data-form="avis" novalidate><div class="modal-b">
      <p class="hint" style="margin:0 0 12px">Ton avis aide à décider ce que Teamora doit faire avant d’aller plus loin. Il ne contient pas ton nom.${AVIS.owner ? ' <button type="button" class="linkish" data-act="avis-list">Voir les avis reçus</button>' : ''}</p>
      <div class="field full"><label for="avis-ecran">Écran concerné</label><input id="avis-ecran" name="ecran" class="input" maxlength="120" value="${esc(m.ecran || avisScreen())}"></div>
      <fieldset class="avis-set"><legend class="lbl">Ton avis en un mot</legend><div class="avis-chips">${types}</div></fieldset>
      <fieldset class="avis-set"><legend class="lbl">Utilité pour ton entreprise <small class="muted">(1 = inutile, 5 = indispensable)</small></legend><div class="avis-notes">${notes}</div></fieldset>
      <div class="field full"><label for="avis-msg">Ce que tu en penses *</label><textarea id="avis-msg" name="message" class="input" maxlength="2000" placeholder="Ce qui t’a plu, ce qui t’a bloqué, ce que tu attendais…"></textarea></div>
      <div class="form-grid"><div class="field"><label for="avis-ent">Entreprise <small class="muted">(facultatif)</small></label><input id="avis-ent" name="entreprise" class="input" maxlength="80" autocomplete="organization"></div>
        <div class="field"><label for="avis-taille">Taille <small class="muted">(facultatif)</small></label><select id="avis-taille" name="taille" class="select"><option value="">—</option>${AVIS_SIZES.map((x) => `<option>${x}</option>`).join('')}</select></div></div>
      <p class="hint" style="margin:12px 0 0">N’indique aucune donnée personnelle réelle (nom de salarié, salaire…) : c’est une démo.</p><p class="err" id="m-err" aria-live="polite"></p></div>
      <div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Annuler</button><button class="btn primary" id="avis-send">Envoyer mon avis</button></div></form>`, '', true);
  };
  Object.assign(MOD_ACT, {
    'avis-open'() { ui.mobMore = false; ui.notif = false; ui.modal = { type: 'avis', ecran: avisScreen() }; render(); },
    'avis-list'() { if (!AVIS.db || !AVIS.owner) return; ui.modal = { type: 'avis', list: true, rows: null }; render(); avisLoad(); },
    'avis-copy'() {
      const t = document.getElementById('avis-copy'); if (!t) return;
      const pick = () => { t.focus(); t.select(); toast('Texte sélectionné : copie-le avec le menu de ton appareil', 'info'); };
      try { navigator.clipboard.writeText(t.value).then(() => toast('Avis copié'), pick); } catch (e) { pick(); }
    },
    'avis-comment'() {
      const t = document.getElementById('avis-copy'), view = document.getElementById('view') || document.body;
      try { if (t) navigator.clipboard.writeText(t.value).catch(() => {}); } catch (e) { /* ignore */ }
      ui.modal = null; render();
      AVIS.comments.openComposer({ element: document.getElementById('view') || view }).then((r) => { toast(r && r.opened ? 'Colle ton avis dans le commentaire (il est copié)' : 'Ouvre le mode commentaire de la page pour publier ton avis', 'info'); })
        .catch(() => toast('Les commentaires ne sont pas disponibles ici : copie ton avis pour l’envoyer', 'info'));
    },
  });
  Object.assign(MOD_FORMS, {
    avis(v) {
      const message = (v.message || '').trim(); if (message.length < 3) return formError('Écris en quelques mots ce que tu en penses.');
      const r = { date: new Date().toISOString(), ecran: (v.ecran || '').trim() || avisScreen(), type: v.type || 'aide', note: Number(v.note) || null, message, entreprise: (v.entreprise || '').trim(), taille: v.taille || '', profil: persona(), appareil: isMob() ? 'téléphone' : 'ordinateur', version: 'V3' };
      const fallback = (why) => { ui.modal = { type: 'avis', fallback: avisText(r), why }; render(); };
      if (!AVIS.db || !AVIS.user) return fallback(AVIS.ready ? '' : 'La connexion à l’enregistrement des avis n’est pas encore prête.');
      const btn = document.getElementById('avis-send'); if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }
      AVIS.user.id().then(async (uid) => {
        if (!uid) throw new Error('no id');
        const me_ = AVIS.db.doc(`avis/${uid}`);
        await me_.collection('r').add(r); await me_.set({ last: r.date });
        ui.modal = { type: 'avis', done: true }; render();
      }).catch(() => fallback(''));
    },
  });
  // ---------------------------------------------------------------- V3 démo · Visite guidée par Teamo
  // Teamo balaie un par un les points phares ; chaque étape met en lumière un élément de l'écran (ou s'affiche au centre).
  const TOUR_KEY = 'teamora-demo-tour';
  let tour = null;
  const tourGo = (o) => () => { Object.assign(ui, { drawer: null, modal: null, notif: false, mobMore: false, selfOf: null }, o); };
  function tourSteps() {
    if (isMob()) return [
      { title: 'Bonjour, je suis Teamo', text: 'Je te fais visiter Teamora sur téléphone en une minute : c’est l’espace du salarié, celui que chacun utilise au quotidien.', go: tourGo({ profile: 'salarie', view: 'accueil', stage: null }) },
      { sel: '.mob-quick', title: 'Les actions rapides', text: 'Les trois gestes les plus fréquents, à portée de pouce : poser une absence, ouvrir son dernier bulletin, écrire aux RH.' },
      { sel: '.mob-todo', title: 'À faire', text: 'Ce qui attend une action de ta part : une auto-évaluation, un baromètre, une pièce à déposer…' },
      { sel: '.mob-nav', title: 'La navigation', text: 'Touche un onglet pour ouvrir Absences, Paie ou Échanges RH. L’accueil est toujours à gauche.' },
      { sel: '.mob-nav [data-act="mob-more"]', title: 'Plus', text: 'Les autres rubriques (profil, santé, entretiens, formations) et le changement de profil de la démo : RH, manager ou salarié.' },
      { sel: '.mob-avis', title: 'Ton avis compte', text: 'Après ton essai, dis-nous ce qui t’aide, ce qui manque ou ce qui bloque : deux minutes, sans ton nom.' },
      { title: 'À toi de jouer', text: 'La gestion RH et manager se découvre sur ordinateur. Tu peux revoir cette visite depuis le menu « Plus ».' }];
    return [
      { title: 'Bonjour, je suis Teamo', text: 'Je te fais visiter Teamora en deux minutes. Tu es dans la peau d’Olivia, responsable RH de Nova Studio, une entreprise fictive.', go: tourGo({ profile: 'rh', view: 'accueil', stage: null }) },
      { sel: '.home', title: 'La roue du collaborateur', text: 'Chaque secteur est une étape de la vie du collaborateur, du besoin de recrutement au départ. Clique sur une étape pour ouvrir son module ; les pastilles indiquent ce qui attend une action.' },
      { sel: '.persona', title: 'Change de point de vue', text: 'Teamora s’adapte à chaque rôle. Passe de la RH au manager ou au salarié pour voir ce que chacun voit et fait.' },
      { sel: '.space-sw', title: 'Gestion ou espace personnel', text: 'La RH et les managers ont aussi leur propre espace salarié : leurs absences, leurs bulletins, leurs entretiens.' },
      { sel: '.todo-btn', title: 'À traiter', text: 'Toutes les actions qui t’attendent, rassemblées en un seul endroit : validations, relances, échéances légales.' },
      { sel: '[data-act="notif"]', title: 'Les notifications', text: 'Les nouvelles du jour : une demande d’absence, un document déposé, une obligation qui approche.' },
      { sel: '.rail', title: 'Passer d’un module à l’autre', text: 'Dans un module, cette barre permet de changer de rubrique ; la maison ramène à la roue. Ici, nous sommes dans les absences.', go: tourGo({ profile: 'rh', view: 'absences', stage: 6 }) },
      { sel: '#view .tabs', title: 'Les onglets', text: 'Chaque module est organisé en onglets : clique sur un onglet pour passer des demandes à valider au planning ou aux compteurs.' },
      { sel: '.rail [data-v="obligations"]', title: 'Les obligations selon l’effectif', text: 'Le cœur de Teamora : l’effectif est calculé automatiquement et les obligations légales apparaissent à chaque seuil (11, 20, 50, 250 salariés), avec des alertes avant.' },
      { sel: '.avis-fab', title: 'Ton avis compte', text: 'Après ton essai, dis-nous ce qui t’aide, ce qui manque ou ce qui bloque : deux minutes, sans ton nom.' },
      { sel: '.tour-fab', title: 'À toi de jouer', text: 'Explore librement : toutes les données sont fictives. Tu peux relancer cette visite à tout moment avec ce bouton.', go: tourGo({ view: 'accueil', stage: null }) }];
  }
  function tourStart() { tour = { i: 0, steps: tourSteps() }; tourShow(); }
  function tourEnd() { tour = null; try { localStorage.setItem(TOUR_KEY, '1'); } catch (e) { /* ignore */ } const el = document.getElementById('tour'); if (el) el.remove(); }
  function tourShow() {
    const st = tour.steps[tour.i]; if (st.go) st.go();
    window.scrollTo(0, 0); render(); requestAnimationFrame(tourPlace);
  }
  function tourPlace() {
    if (!tour) return;
    let box = document.getElementById('tour'); if (!box) { box = document.createElement('div'); box.id = 'tour'; document.body.appendChild(box); }
    const st = tour.steps[tour.i], n = tour.steps.length, el = st.sel && [...document.querySelectorAll(st.sel)].find((x) => x.getBoundingClientRect().width > 0);
    if (el) el.scrollIntoView({ block: 'nearest' });
    const r = el ? el.getBoundingClientRect() : null, pad = 6, W = window.innerWidth, H = window.innerHeight;
    box.innerHTML = `<div class="tour-block"></div>${r ? `<div class="tour-hole" style="left:${r.left - pad}px;top:${r.top - pad}px;width:${r.width + pad * 2}px;height:${r.height + pad * 2}px"></div>` : '<div class="tour-dim"></div>'}
      <div class="tour-tip" role="dialog" aria-modal="true" aria-labelledby="tour-t" tabindex="-1"><div class="tour-h">${teamoSVG('tour-av')}<div><small>Visite guidée · ${tour.i + 1} / ${n}</small><b id="tour-t">${esc(st.title)}</b></div></div>
        <p>${esc(st.text)}</p><div class="tour-f"><button type="button" class="tour-skip" data-tour="skip">${tour.i === n - 1 ? 'Fermer' : 'Passer'}</button><span class="grow"></span>
        ${tour.i ? '<button type="button" class="btn ghost sm" data-tour="prev">Précédent</button>' : ''}<button type="button" class="btn primary sm" data-tour="next">${tour.i === n - 1 ? 'Terminer' : 'Suivant'}</button></div></div>`;
    const tip = box.querySelector('.tour-tip'), tw = Math.min(380, W - 32); tip.style.width = `${tw}px`;
    // Le bas de l'écran reste libre : la plateforme peut y afficher son propre bandeau (« Connectez-vous… »).
    const th = tip.offsetHeight, safe = H - (isMob() ? 96 : 120); let top, left;
    if (!r) { top = Math.max(12, (safe - th) / 2); left = (W - tw) / 2; }
    else { const below = r.bottom + 14, above = r.top - th - 14;
      top = below + th <= safe ? below : above >= 12 ? above : Math.max(12, Math.min(r.top + 24, safe - th));
      top = Math.max(12, Math.min(top, safe - th));
      left = Math.min(Math.max(16, r.left + r.width / 2 - tw / 2), W - tw - 16); }
    tip.style.top = `${Math.round(top)}px`; tip.style.left = `${Math.round(left)}px`;
    const nx = box.querySelector('[data-tour="next"]'); if (nx && !box.contains(document.activeElement)) nx.focus({ preventScroll: true });
  }
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-tour]'); if (!b || !tour) return;
    const a = b.dataset.tour;
    if (a === 'skip') tourEnd();
    else if (a === 'next') { if (tour.i >= tour.steps.length - 1) tourEnd(); else { tour.i += 1; tourShow(); } }
    else if (a === 'prev' && tour.i > 0) { tour.i -= 1; tourShow(); }
  });
  document.addEventListener('keydown', (ev) => { if (tour && ev.key === 'Escape') { ev.stopPropagation(); tourEnd(); } }, true);
  window.addEventListener('resize', () => { if (tour) tourPlace(); });
  Object.assign(MOD_ACT, { 'tour-start'() { ui.mobMore = false; tourStart(); } });

  const avisFab = () => (isMob() ? '' : `<button type="button" class="avis-fab" data-act="avis-open">${ic('chat')}Donner mon avis</button>${DEMO ? `<button type="button" class="tour-fab" data-act="tour-start">${teamoSVG('fab-av')}<span>Visite guidée</span></button>` : ''}`);

  // ================================================================ V2 · Paramètres de l'entreprise et assistant de démarrage
  // Tout ce qui était propre à Nova Studio (identité, convention, sites, services, règles de temps et de paie…) vit dans db.settings.
  // V3 : toutes les conventions collectives (liste IDCC de conventions.js). Syntec garde ses règles intégrées ;
  // pour les autres, les minima du Code du travail s'appliquent tant que la RH n'a pas saisi les règles de la convention.
  const CONV_SYNTEC = '1486', CODE_RULES = { essaiE: 2, essaiAM: 3, essaiC: 4, renouv: false, demNC: 1, demC: 1, licNC: 0, licC: 0, maintien: 12 };
  const CONV_LIST = () => window.TEAMORA_CONVENTIONS || [];
  const convRow = (n) => CONV_LIST().find((x) => x[0] === n);
  const convName = (t) => (/^convention collective\s+/i.test(t) ? t.replace(/^convention collective\s+/i, '') : `« ${t} »`);
  const convRules = (s, n) => { const r = s.convRules; return r && r.idcc === n ? Object.assign({}, CODE_RULES, r) : Object.assign({}, CODE_RULES, { ok: false }); };
  function convOf(n, s = db.settings || {}) {
    if (!n || n === 'code') return { key: 'code', kind: 'code', idcc: '', short: 'Code du travail', label: 'Aucune convention collective : règles du Code du travail', idccLabel: 'Aucune (Code du travail)', convention: 'du Code du travail (aucune convention collective applicable)', mention: 'règles du Code du travail (aucune convention collective)',
      rules: Object.assign({}, CODE_RULES), ok: true,
      presets: ['Période d’essai : durées maximales légales (2, 3 ou 4 mois selon la catégorie), sans renouvellement', 'Préavis de licenciement légal : 1 mois de 6 mois à 2 ans d’ancienneté, 2 mois au-delà ; démission selon l’usage', 'Maintien de salaire légal (art. L1226-1) après 1 an d’ancienneté, à partir du 8e jour', 'Classifications à définir par l’entreprise'] };
    if (n === CONV_SYNTEC) return { key: n, kind: 'syntec', idcc: n, short: 'Syntec', label: 'Syntec : bureaux d’études techniques, ingénieurs-conseils, sociétés de conseil (IDCC 1486)', idccLabel: 'Syntec (IDCC 1486)', convention: 'nationale des bureaux d’études techniques (Syntec, IDCC 1486)', mention: 'convention collective Syntec (IDCC 1486)',
      rules: { essaiE: 2, essaiAM: 3, essaiC: 4, renouv: true, maintien: 12 }, ok: true,
      presets: ['Période d’essai : 2 mois (employés), 3 mois (agents de maîtrise), 4 mois (cadres), renouvelable une fois', 'Préavis : 1 à 2 mois (ETAM selon l’ancienneté), 3 mois (cadres)', 'Maintien de salaire en cas de maladie après 1 an d’ancienneté', 'Classifications ETAM et cadres (positions et coefficients)'] };
    const row = convRow(n) || [n, `Convention IDCC ${n}`, `Convention collective IDCC ${n}`], rules = convRules(s, n);
    return { key: n, kind: 'other', idcc: n, short: row[1], label: `${row[1]} (IDCC ${n})`, idccLabel: `${row[1]} (IDCC ${n})`, convention: `${convName(row[2])} (IDCC ${n})`, mention: `convention collective ${row[1]} (IDCC ${n})`, title: row[2],
      rules, ok: !!rules.ok, presets: [] };
  }
  const CONV = () => convOf((db.settings || {}).convention);
  const LEAVE_OPTIONAL = ['RTT', 'Sans solde', 'Télétravail'];
  function defaultSettings() {
    return { company: { nom: 'Nova Studio', raison: 'Nova Studio SAS', adresse: '12 rue de la Paix', cp: '75002', ville: 'Paris', siret: '000 000 000 00000', naf: '7410Z · Activités spécialisées de design', urssaf: 'Urssaf Île-de-France', domaine: 'novastudio.fr', logo: null, signataire: 'e1' },
      convention: '1486', convRules: null, directionId: 'e5',
      sites: [{ id: 's1', nom: 'Paris', adresse: '12 rue de la Paix, 75002 Paris', transport: 88.8 }, { id: 's2', nom: 'Lyon', adresse: '24 quai Saint-Antoine, 69002 Lyon', transport: 74.7 }],
      services: [['Direction', 'e5'], ['RH', 'e1'], ['Design', 'e2'], ['Tech', 'e6'], ['Marketing', 'e7'], ['Sales', 'e8'], ['Finance', 'e9']].map(([nom, head]) => ({ nom, head })),
      temps: { heures: 35, forfait: 218, ttMax: 2 }, conges: { decompte: 'ouvrés', off: [], backup: true },
      paie: { prestataire: 'Silae (cabinet Expert & Paie)', cloture: 20, trValeur: 10, trEmployeur: 6, mutSal: 30, mutEmp: 45, ttJour: 2.7, vmTaux: 3.2 },
      recrutement: { conservation: 2, relance: 7 }, droits: { motifAbsence: false, orgSalarie: true }, setupDone: true,
      // V3 : effectifs moyens des années passées (règle des 5 ans) et résultats (partage de la valeur).
      effectifs: { 2021: 11, 2022: 13, 2023: 15, 2024: 17, 2025: 18 }, finances: { 2023: { ca: 2400000, res: 96000 }, 2024: { ca: 2700000, res: 135000 }, 2025: { ca: 3100000, res: 124000 } } };
  }
  function blankSettings() {
    const s = defaultSettings();
    return Object.assign(s, { company: { nom: '', raison: '', adresse: '', cp: '', ville: '', siret: '', naf: '', urssaf: '', domaine: '', logo: null, signataire: 'e1' }, directionId: 'e1', effectifs: {}, finances: {}, sites: [], services: [], setupDone: false,
      paie: Object.assign(s.paie, { prestataire: '' }) });
  }
  // Applique les réglages aux constantes utilisées partout (documents, paie, temps, recrutement…).
  function applySettings() {
    const s = db.settings, c = s.company, cv = CONV();
    Object.assign(COMPANY, { nom: c.nom || 'Mon entreprise', entreprise: c.raison || c.nom || 'Mon entreprise', entreprise_adresse: [c.adresse, [c.cp, c.ville].filter(Boolean).join(' ')].filter(Boolean).join(', '), siret: c.siret || '—', convention: cv.convention, ville: c.ville || '', domaine: c.domaine || 'entreprise.fr', logo: c.logo || null });
    Object.assign(COMPANY_PAY, { naf: c.naf || '—', urssaf: c.urssaf || '—', idcc: cv.idccLabel });
    DEPTS.splice(0, DEPTS.length, ...s.services.map((x) => x.nom)); Object.keys(DEPT_HEAD).forEach((k) => delete DEPT_HEAD[k]); s.services.forEach((x) => { DEPT_HEAD[x.nom] = x.head || DIR_ID(); });
    Object.keys(TRANSPORT).forEach((k) => delete TRANSPORT[k]); s.sites.forEach((x) => { TRANSPORT[x.nom] = Number(x.transport) || 0; });
    ({ trValeur: TR_VALUE, trEmployeur: TR_EMPLOYER, mutSal: MUT_S, mutEmp: MUT_P, ttJour: TT_DAY, cloture: PAY_CUTOFF } = s.paie); PROVIDER = s.paie.prestataire || 'prestataire de paie'; TT_ALLOW_MAX = Math.round(TT_DAY * 22 * 100) / 100;
    TT_MAX = s.temps.ttMax; FORFAIT_DAYS = s.temps.forfait; RETENTION_YEARS = s.recrutement.conservation; ANSWER_DAYS = s.recrutement.relance;
    SIGN = `\n\nL’équipe RH de ${COMPANY.nom}`;
    RGPD_NOTE = `Vos données sont utilisées uniquement pour nos recrutements. Elles sont supprimées automatiquement ${plural(RETENTION_YEARS, 'an', 'ans')} après notre dernier échange. Vous pouvez à tout moment demander leur suppression ou vous opposer à leur conservation en écrivant à rh@${COMPANY.domaine}.`;
  }
  const SITES = () => ((db.settings && db.settings.sites.length) ? db.settings.sites.map((x) => x.nom) : ['Siège']);
  const siteOf = (e) => SITES().find((s) => (e.location || '').startsWith(s)) || SITES()[0];
  const leaveTypeOn = (t) => !((db.settings && db.settings.conges.off) || []).includes(t);
  function normalizeSettings() {
    const d = defaultSettings(); db.settings = db.settings || d; db.settingsLog = db.settingsLog || [];
    ['company', 'temps', 'conges', 'paie', 'recrutement', 'droits'].forEach((k) => { db.settings[k] = Object.assign({}, d[k], db.settings[k]); });
    ['effectifs', 'finances'].forEach((k) => { if (!db.settings[k] || typeof db.settings[k] !== 'object') db.settings[k] = d[k]; });
    ['sites', 'services'].forEach((k) => { if (!Array.isArray(db.settings[k])) db.settings[k] = d[k]; });
    if (db.settings.convention !== 'code' && !/^\d{4}$/.test(db.settings.convention || '')) db.settings.convention = '1486'; // V2 : « syntec »
    db.employees.forEach((e) => { if (e.id === 'e1') e.admin = true; });
  }
  // ---- Complétude : ce qu'il reste à régler pour que Teamora fonctionne pleinement.
  function setupChecks() {
    const s = db.settings, c = s.company, emps = db.employees.filter((e) => e.stage < 15);
    return [['entreprise', 'Identité de l’entreprise (nom, raison sociale, adresse, SIRET, NAF, Urssaf)', !!(c.nom && c.raison && c.adresse && c.ville && sirenDigits(c.siret).length === 14 && c.naf && c.urssaf)],
      ['entreprise', 'Logo de l’entreprise (documents)', !!c.logo], ['convention', 'Convention collective et temps de travail', !!s.convention], ...(CONV().kind === 'other' ? [['convention', 'Règles de la convention collective vérifiées (essai, préavis, maintien de salaire)', CONV().ok]] : []),
      ['sites', 'Au moins un site', s.sites.length > 0], ['services', 'Services avec un responsable', s.services.length > 0 && s.services.every((x) => x.head && emp(x.head))],
      ['services', 'Direction désignée', !!emp(s.directionId)], ['services', 'Responsables cohérents avec l’organigramme', !orgIssues().length], ['import', 'Collaborateurs enregistrés (au moins 2)', emps.length >= 2],
      ['utilisateurs', 'Au moins un administrateur RH', db.employees.some((e) => e.admin && e.stage < 15)], ['paie', 'Prestataire de paie et règles de paie', !!s.paie.prestataire]];
  }
  const sirenDigits = (s) => String(s || '').replace(/\D/g, '');
  const luhnOk = (n) => { let sum = 0; [...n].reverse().forEach((ch, i) => { let d = Number(ch); if (i % 2) { d *= 2; if (d > 9) d -= 9; } sum += d; }); return sum % 10 === 0; };
  const SET_SECTIONS = [['entreprise', 'Entreprise', 'folder'], ['convention', 'Convention et temps de travail', 'clock'], ['sites', 'Sites', 'target'], ['services', 'Services et Direction', 'users'],
    ['import', 'Collaborateurs (import)', 'idCard'], ['utilisateurs', 'Utilisateurs et droits', 'lock'], ['absences', 'Absences', 'heart'], ['paie', 'Paie', 'euro'], ['recrutement', 'Recrutement', 'search'], ['historique', 'Historique des modifications', 'refresh']];
  const fld = (id, label, input, full, hint) => `<div class="field${full ? ' full' : ''}"><label for="${id}">${label}</label>${input}${hint ? `<small class="field-hint">${hint}</small>` : ''}</div>`;
  const inp = (id, name, val, attrs = '') => `<input id="${id}" name="${name}" class="input" value="${esc(val == null ? '' : String(val))}" ${attrs}>`;
  const empOpt = (cur, list, none) => `${none ? `<option value="">${none}</option>` : ''}${list.map((e) => `<option value="${e.id}" ${e.id === cur ? 'selected' : ''}>${esc(fullName(e))} · ${esc(e.title)}</option>`).join('')}`;
  // Règles de la convention choisie : rappel pour Syntec et le Code du travail, saisie manuelle pour les autres conventions.
  function convInfo(cv) {
    if (cv.kind !== 'other') return `<div class="conv-card"><b>${esc(cv.label)}</b><ul>${cv.presets.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>
      <p class="hint" style="margin:8px 0 14px">Teamora applique ces règles (essai, préavis, maintien de salaire) ; elles restent ajustables plus favorablement au salarié, jamais en dessous du minimum. Convention choisie : <b id="conv-cur">${esc(cv.short)}</b>.</p>`;
    const r = cv.rules, n = (id, name, label, max) => `<input id="${id}" name="${name}" class="input num" type="number" min="0" max="${max}" step="1" value="${esc(String(r[name]))}" aria-label="${label}">`;
    const row = (t, hint, cells) => `<tr><th scope="row">${t}<small>${hint}</small></th>${cells}</tr>`;
    return `<div class="conv-card"><b>${esc(cv.short)} · IDCC ${cv.idcc}</b><small class="muted">${esc(cv.title)}</small>
        <div class="conv-warn ${cv.ok ? 'ok' : ''}">${ic(cv.ok ? 'check' : 'bell')}${cv.ok ? 'Règles de la convention vérifiées et saisies par l’entreprise.' : 'Règles de la convention à vérifier : Teamora applique en attendant les minima du Code du travail.'}</div></div>
      <div class="conv-rules"><h4>Règles de la convention</h4><p class="hint" style="margin:0 0 10px">À reprendre du texte de la convention (Légifrance ou avenants de la branche), en mois. Préavis de licenciement : 0 = minimum légal ; Teamora retient toujours le plus favorable au salarié.</p>
        <table class="conv-tbl"><thead><tr><th></th><th scope="col">Employés, ouvriers</th><th scope="col">Agents de maîtrise</th><th scope="col">Cadres</th></tr></thead><tbody>
          ${row('Période d’essai', 'Légal : 2, 3 et 4 mois au plus', `<td>${n('cr-e', 'essaiE', 'Essai employés et ouvriers (mois)', 8)}</td><td>${n('cr-am', 'essaiAM', 'Essai agents de maîtrise (mois)', 8)}</td><td>${n('cr-c', 'essaiC', 'Essai cadres (mois)', 8)}</td>`)}
          ${row('Préavis de démission', 'Non-cadres, puis cadres · aucun minimum légal', `<td colspan="2">${n('cr-dn', 'demNC', 'Préavis de démission non-cadres (mois)', 6)}</td><td>${n('cr-dc', 'demC', 'Préavis de démission cadres (mois)', 6)}</td>`)}
          ${row('Préavis de licenciement', 'Non-cadres, puis cadres · légal : 1 mois de 6 mois à 2 ans, 2 mois au-delà', `<td colspan="2">${n('cr-ln', 'licNC', 'Préavis de licenciement non-cadres (mois)', 6)}</td><td>${n('cr-lc', 'licC', 'Préavis de licenciement cadres (mois)', 6)}</td>`)}
          ${row('Maintien de salaire', 'Ancienneté requise ; légal : 12 mois au plus', `<td colspan="3">${n('cr-m', 'maintien', 'Maintien de salaire : ancienneté requise (mois)', 12)}</td>`)}
          ${row('Renouvellement de l’essai', 'Seulement si un accord de branche étendu le prévoit', `<td colspan="3"><label class="agree"><input type="checkbox" name="renouv" value="1" ${r.renouv ? 'checked' : ''}>Prévu par la convention</label></td>`)}
        </tbody></table>
        <label class="agree" style="margin-top:10px"><input type="checkbox" name="convOk" value="1" ${cv.ok ? 'checked' : ''}>J’ai vérifié ces règles dans le texte de la convention</label></div>`;
  }
  function setSection(k, wiz) {
    const s = db.settings, c = s.company, people = db.employees.filter((e) => e.stage < 15).sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
    if (k === 'entreprise') return `<div class="form-grid">${fld('st-nom', 'Nom d’usage', inp('st-nom', 'nom', c.nom, 'maxlength="60" required'), false, 'Affiché dans Teamora et les courriers')}${fld('st-raison', 'Raison sociale', inp('st-raison', 'raison', c.raison, 'maxlength="80"'), false, 'Ex. Nova Studio SAS')}
      ${fld('st-adr', 'Adresse du siège', inp('st-adr', 'adresse', c.adresse, 'maxlength="120"'), true)}${fld('st-cp', 'Code postal', inp('st-cp', 'cp', c.cp, 'maxlength="5" inputmode="numeric"'))}${fld('st-ville', 'Ville', inp('st-ville', 'ville', c.ville, 'maxlength="60"'))}
      ${fld('st-siret', 'SIRET', inp('st-siret', 'siret', c.siret, 'maxlength="20" inputmode="numeric" placeholder="14 chiffres"'), false, 'Sur l’avis de situation Insee ou un extrait Kbis')}${fld('st-naf', 'Code NAF / APE', inp('st-naf', 'naf', c.naf, 'maxlength="80" placeholder="Ex. 7410Z"'))}
      ${fld('st-urssaf', 'Organisme de recouvrement', inp('st-urssaf', 'urssaf', c.urssaf, 'maxlength="60" placeholder="Ex. Urssaf Île-de-France"'))}${fld('st-dom', 'Domaine des adresses e-mail', inp('st-dom', 'domaine', c.domaine, 'maxlength="60" placeholder="entreprise.fr"'), false, 'Utilisé pour créer l’adresse des nouveaux arrivants')}
      ${wiz ? '' : fld('st-sign', 'Signataire des documents', `<select id="st-sign" name="signataire" class="select">${empOpt(c.signataire, people)}</select>`, false, 'Apparaît dans les contrats et attestations')}
      <div class="field full"><span class="lbl">Logo</span><div class="logo-row">${c.logo ? `<img class="logo-prev" src="${c.logo}" alt="Logo de l’entreprise">` : '<span class="logo-prev empty">Aucun logo</span>'}<label class="btn ghost sm upload">${ic('image')}${c.logo ? 'Remplacer' : 'Ajouter un logo'}<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" data-change="set-logo" aria-label="Logo de l’entreprise"></label>${c.logo ? '<button type="button" class="btn ghost sm" data-act="set-logo-del">Retirer</button>' : ''}</div><small class="field-hint">En tête des documents (contrats, attestations, certificats)</small></div></div>${effFields()}`;
    if (k === 'convention') { const cv = CONV();
      return `<div class="field full conv-search"><label for="st-conv">Convention collective applicable</label><select id="st-conv" name="convention" class="select" data-search="1" data-placeholder="Rechercher par nom, mot-clé ou numéro IDCC…" data-change="set-conv"><option value="" ${cv.kind === 'code' ? 'selected' : ''}>Aucune convention : Code du travail</option>${CONV_LIST().map((x) => `<option value="${x[0]}" data-sub="IDCC ${x[0]} · ${esc(x[2])}" ${cv.idcc === x[0] ? 'selected' : ''}>${esc(x[1])}</option>`).join('')}</select>
        <small class="field-hint">${CONV_LIST().length} conventions (liste Légifrance). Le numéro IDCC figure sur les bulletins de paie ; en production, il sera proposé à partir du SIRET.</small></div>
        <div id="conv-info">${convInfo(cv)}</div>
      <div class="form-grid">${fld('st-h', 'Durée hebdomadaire collective (heures)', inp('st-h', 'heures', s.temps.heures, 'type="number" min="1" max="48" step="0.5"'), false, 'Durée légale : 35 h ; maximum absolu : 48 h')}${fld('st-fj', 'Forfait annuel en jours (cadres)', inp('st-fj', 'forfait', s.temps.forfait, 'type="number" min="100" max="218"'), false, 'Au plus 218 jours (art. L3121-64)')}
          ${fld('st-tt', 'Télétravail : jours maximum par semaine', inp('st-tt', 'ttMax', s.temps.ttMax, 'type="number" min="0" max="5"'), false, 'Selon la charte ou l’accord télétravail')}</div>`; }
    if (k === 'sites') return `<div class="set-list">${s.sites.map((x, i) => `<div class="set-row"><div class="form-grid">${fld(`st-sn${i}`, 'Nom du site', inp(`st-sn${i}`, `nom_${i}`, x.nom, 'maxlength="40"'))}${fld(`st-sa${i}`, 'Adresse', inp(`st-sa${i}`, `adresse_${i}`, x.adresse, 'maxlength="120"'))}
        ${fld(`st-st${i}`, 'Abonnement transport mensuel (€)', inp(`st-st${i}`, `transport_${i}`, x.transport, 'type="number" min="0" step="0.1"'), false, 'L’employeur en rembourse 50 %')}</div><input type="hidden" name="id_${i}" value="${x.id}">
        <button type="button" class="icon-btn" data-act="set-del" data-k="sites" data-i="${i}" aria-label="Supprimer le site ${esc(x.nom)}" title="Supprimer">${ic('x')}</button></div>`).join('') || '<p class="muted" style="margin:0">Aucun site pour l’instant.</p>'}</div>
      <button type="button" class="btn ghost sm" data-act="set-add" data-k="sites">${ic('plus')}Ajouter un site</button>`;
    if (k === 'services') return `<div class="set-list">${s.services.map((x, i) => `<div class="set-row"><div class="form-grid">${fld(`st-vn${i}`, 'Service', inp(`st-vn${i}`, `nom_${i}`, x.nom, 'maxlength="40"'))}${fld(`st-vh${i}`, 'Responsable', `<select id="st-vh${i}" name="head_${i}" class="select">${empOpt(x.head, people, 'À désigner')}</select>`)}</div>
        <button type="button" class="icon-btn" data-act="set-del" data-k="services" data-i="${i}" aria-label="Supprimer le service ${esc(x.nom)}" title="Supprimer">${ic('x')}</button></div>`).join('') || '<p class="muted" style="margin:0">Aucun service pour l’instant.</p>'}</div>
      <button type="button" class="btn ghost sm" data-act="set-add" data-k="services">${ic('plus')}Ajouter un service</button>
      <div class="form-grid" style="margin-top:16px">${fld('st-dir', 'Direction (valide les besoins hors budget et les demandes des RH)', `<select id="st-dir" name="directionId" class="select">${empOpt(s.directionId, people, 'À désigner')}</select>`, true)}</div>${wiz ? '' : orgCoherence()}`;
    if (k === 'import') return importSection(wiz);
    if (k === 'utilisateurs') { const admins = db.employees.filter((e) => e.admin && e.stage < 15);
      return `<h4 class="sub">Administrateurs RH</h4><div class="set-list">${admins.map((e) => `<div class="set-row simple">${avatar(e, 'sm')}<div class="t"><b>${esc(fullName(e))}</b><small>${esc(e.email)} · accès complet aux dossiers</small></div>${admins.length > 1 ? `<button type="button" class="btn ghost sm" data-act="set-admin" data-id="${e.id}" data-v="0">Retirer</button>` : '<span class="pill neutral">Administrateur principal</span>'}</div>`).join('')}</div>
        <div class="toolbar" style="margin-top:8px"><label class="sr" for="st-adm">Ajouter un administrateur</label><select id="st-adm" class="select">${empOpt('', people.filter((e) => !e.admin), 'Choisir un collaborateur…')}</select><button type="button" class="btn ghost sm" data-act="set-admin" data-v="1">${ic('plus')}Ajouter</button></div>
        <p class="hint">Les managers sont reconnus automatiquement à partir de l’organigramme ; chaque collaborateur reçoit une invitation à son adresse e-mail pour accéder à son espace.</p>
        <h4 class="sub" style="margin-top:18px">Droits</h4>
        <label class="agree"><input type="checkbox" name="motifAbsence" ${s.droits.motifAbsence ? 'checked' : ''}> Les managers voient le motif des arrêts (maladie, accident du travail…) de leur équipe</label>
        <p class="hint" style="margin:2px 0 10px 26px">Décoché (recommandé) : le manager voit seulement « Absence », sans le motif médical.</p>
        <label class="agree"><input type="checkbox" name="orgSalarie" ${s.droits.orgSalarie ? 'checked' : ''}> Les salariés voient l’organigramme complet de l’entreprise</label>`; }
    if (k === 'absences') { const off = s.conges.off;
      return `<div class="form-grid">${fld('st-dec', 'Décompte des congés payés', `<select id="st-dec" name="decompte" class="select">${['ouvrés', 'ouvrables'].map((x) => `<option ${x === s.conges.decompte ? 'selected' : ''}>${x}</option>`).join('')}</select>`, false, 'Ouvrés : 25 jours par an ; ouvrables : 30 jours (même durée)')}</div>
        <h4 class="sub" style="margin-top:14px">Types d’absence proposés</h4><div class="type-grid">${LEAVE_TYPES.map((t) => { const opt = LEAVE_OPTIONAL.includes(t);
          return `<label class="agree ${opt ? '' : 'locked'}"><input type="checkbox" name="type_${t}" ${opt ? (off.includes(t) ? '' : 'checked') : 'checked disabled'}> ${esc(t)}${opt ? '' : ' <small>· droit légal, toujours proposé</small>'}</label>`; }).join('')}</div>
        <label class="agree" style="margin-top:12px"><input type="checkbox" name="backup" ${s.conges.backup ? 'checked' : ''}> Quand un manager est absent, son propre manager peut valider à sa place</label>`; }
    if (k === 'paie') return `<div class="form-grid">${fld('st-pp', 'Prestataire ou logiciel de paie', inp('st-pp', 'prestataire', s.paie.prestataire, 'maxlength="80" placeholder="Ex. cabinet comptable, Silae, Sage…"'), true)}
      ${fld('st-pc', 'Clôture des variables (jour du mois)', inp('st-pc', 'cloture', s.paie.cloture, 'type="number" min="1" max="28"'), false, 'Les managers valident leurs variables avant cette date')}
      ${fld('st-trv', 'Titre-restaurant : valeur (€)', inp('st-trv', 'trValeur', s.paie.trValeur, 'type="number" min="0" max="25" step="0.5"'), false, '0 si l’entreprise n’en propose pas')}${fld('st-tre', 'Titre-restaurant : part employeur (€)', inp('st-tre', 'trEmployeur', s.paie.trEmployeur, 'type="number" min="0" step="0.1"'), false, 'Entre 50 % et 60 % de la valeur pour l’exonération')}
      ${fld('st-ms', 'Mutuelle : part salarié (€ / mois)', inp('st-ms', 'mutSal', s.paie.mutSal, 'type="number" min="0" step="0.5"'))}${fld('st-me', 'Mutuelle : part employeur (€ / mois)', inp('st-me', 'mutEmp', s.paie.mutEmp, 'type="number" min="0" step="0.5"'), false, 'Au moins 50 % de la cotisation (art. L911-7)')}
      ${fld('st-tj', 'Allocation télétravail (€ par jour)', inp('st-tj', 'ttJour', s.paie.ttJour, 'type="number" min="0" step="0.1"'), false, 'Exonérée jusqu’à 2,70 € par jour (barème Urssaf)')}${fld('st-vm', 'Versement mobilité (taux en %)', inp('st-vm', 'vmTaux', s.paie.vmTaux || '', 'type="number" min="0" max="5" step="0.01" placeholder="0"'), false, 'À partir de 11 salariés, selon la commune (ex. Paris : 3,20 %)')}</div>`;
    if (k === 'recrutement') return `<div class="form-grid">${fld('st-rc', 'Conservation des candidatures non retenues (années)', inp('st-rc', 'conservation', s.recrutement.conservation, 'type="number" min="1" max="2"'), false, 'Recommandation de la CNIL : 2 ans au plus après le dernier contact')}
      ${fld('st-rr', 'Relance d’un candidat sans nouvelles (jours)', inp('st-rr', 'relance', s.recrutement.relance, 'type="number" min="1" max="30"'))}</div>`;
    return '';
  }
  // ---- Import des collaborateurs (fichier CSV exporté d'un tableur).
  const IMPORT_COLS = ['prenom', 'nom', 'email', 'poste', 'service', 'contrat', 'entree', 'salaire', 'manager', 'site'];
  const IMPORT_SAMPLE = 'prenom;nom;email;poste;service;contrat;entree;salaire;manager;site\nCamille;Martin;camille.martin@exemple.fr;Directrice générale;Direction;CDI;01/03/2019;85000;;Paris\nYanis;Lopez;yanis.lopez@exemple.fr;Développeur;Tech;CDI;15/09/2023;45000;camille.martin@exemple.fr;Paris';
  function parseImport(text) {
    const lines = String(text || '').replace(/\r/g, '').split('\n').filter((l) => l.trim()); if (!lines.length) return { rows: [], err: 'Colle ou dépose un fichier.' };
    const sep = (lines[0].match(/;/g) || []).length >= (lines[0].match(/,/g) || []).length ? ';' : ',';
    const norm = (h) => h.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
    const alias = { prenom: 'prenom', nom: 'nom', email: 'email', mail: 'email', courriel: 'email', poste: 'poste', fonction: 'poste', service: 'service', departement: 'service', contrat: 'contrat', entree: 'entree', datedentree: 'entree', dateentree: 'entree', salaire: 'salaire', salaireannuel: 'salaire', manager: 'manager', responsable: 'manager', site: 'site', lieu: 'site' };
    const head = lines[0].split(sep).map((h) => alias[norm(h)] || null);
    if (!['prenom', 'nom', 'email'].every((k) => head.includes(k))) return { rows: [], err: 'La première ligne doit nommer les colonnes : prenom, nom, email (au minimum).' };
    const known = new Set(db.employees.map((e) => e.email.toLowerCase())), seen = new Set();
    const rows = lines.slice(1).map((l, n) => { const cells = l.split(sep), r = {}; head.forEach((k, i) => { if (k) r[k] = (cells[i] || '').trim(); });
      const errs = [], d = (r.entree || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/), date = d ? `${d[3]}-${d[2].padStart(2, '0')}-${d[1].padStart(2, '0')}` : /^\d{4}-\d{2}-\d{2}$/.test(r.entree || '') ? r.entree : '';
      if (!r.prenom || !r.nom) errs.push('prénom et nom'); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email || '')) errs.push('e-mail invalide');
      const em = (r.email || '').toLowerCase(); if (known.has(em)) errs.push('déjà enregistré'); if (seen.has(em)) errs.push('en double'); seen.add(em);
      const nk = nameKey({ firstName: r.prenom || '', lastName: r.nom || '' }), twin = !known.has(em) && db.employees.find((e) => e.stage < 15 && nameKey(e) === nk);
      if (twin && nk) errs.push(`${fullName(twin)} a déjà un dossier (${twin.email})`);
      const contrat = ({ cdi: 'CDI', cdd: 'CDD', alternance: 'Alternance', apprentissage: 'Alternance', stage: 'Stage' })[(r.contrat || 'CDI').toLowerCase()] || null; if (!contrat) errs.push('contrat inconnu (CDI, CDD, Alternance, Stage)');
      if (r.entree && !date) errs.push('date d’entrée (JJ/MM/AAAA)'); const sal = Number(String(r.salaire || '').replace(/\s/g, '').replace(',', '.')) || 0;
      return { n: n + 2, r, contrat, date: date || TODAY, sal, errs }; });
    return { rows, sep };
  }
  const importReady = () => { const st = ui.importText && ui.importText.trim() ? parseImport(ui.importText) : null; return st && st.rows ? st.rows.filter((x) => !x.errs.length).length : 0; };
  const importNextLabel = () => (importReady() ? `Importer ${plural(importReady(), 'collaborateur', 'collaborateurs')} et continuer` : 'Continuer');
  function importSection(wiz) {
    const st = ui.importText != null ? parseImport(ui.importText) : null, ok = st && st.rows ? st.rows.filter((x) => !x.errs.length) : [];
    const count = db.employees.filter((e) => e.stage < 15).length;
    return `<p style="margin:0 0 10px">Importe tes collaborateurs depuis un tableur (Excel, Google Sheets…) enregistré au format CSV. Colonnes reconnues : <b>${IMPORT_COLS.join(', ')}</b>. Le manager se désigne par son e-mail ; les services et sites inconnus sont créés.</p>
      <div class="toolbar imp-tools"><label class="btn ghost sm upload">${ic('file')}Choisir un fichier CSV<input type="file" accept=".csv,text/csv,text/plain" data-change="set-import-file" aria-label="Fichier CSV"></label><button type="button" class="btn ghost sm" data-act="set-import-sample">Voir un exemple</button><span class="muted" style="font-size:13px">${plural(count, 'collaborateur enregistré', 'collaborateurs enregistrés')}</span></div>
      <label class="sr" for="st-imp">Contenu CSV</label><textarea id="st-imp" class="input mono" rows="5" placeholder="Ou colle ici le contenu du fichier…" data-input="set-import">${esc(ui.importText || '')}</textarea>
      <div id="imp-prev">${importPreview(st)}</div>
      ${wiz ? '<p class="hint" style="margin:8px 0 0">Tu peux aussi passer cette étape et ajouter les collaborateurs plus tard depuis Vie administrative.</p>' : ''}`;
  }
  function importPreview(st) {
    if (!st) return '';
    if (st.err) return `<p class="lint warn" style="margin:8px 0 0">${esc(st.err)}</p>`;
    const ok = st.rows.filter((x) => !x.errs.length);
    return `<div class="table-wrap imp-table"><table><thead><tr><th>Ligne</th><th>Collaborateur</th><th>Poste · service</th><th>Contrat · entrée</th><th>Contrôle</th></tr></thead><tbody>${st.rows.map((x) => `<tr class="${x.errs.length ? 'bad' : ''}"><td class="num">${x.n}</td><td><b>${esc(`${x.r.prenom || ''} ${x.r.nom || ''}`)}</b><small>${esc(x.r.email || '')}</small></td><td>${esc(x.r.poste || '—')} · ${esc(x.r.service || '—')}${x.r.manager ? `<small>Manager : ${esc(x.r.manager)}</small>` : ''}</td><td>${esc(x.contrat || x.r.contrat || '')} · ${fmtDate(x.date)}</td><td>${x.errs.length ? `<span class="pill bad">${esc(x.errs.join(', '))}</span>` : '<span class="pill ok">Prêt</span>'}</td></tr>`).join('')}</tbody></table></div>
      <div class="toolbar" style="margin-top:10px"><button type="button" class="btn primary sm" data-act="set-import-go" ${ok.length ? '' : 'disabled'}>${ic('check')}Importer ${plural(ok.length, 'collaborateur', 'collaborateurs')}</button>${ok.length < st.rows.length ? `<span class="hint">${plural(st.rows.length - ok.length, 'ligne sera ignorée', 'lignes seront ignorées')} : corrige-les dans le fichier.</span>` : ''}</div>`;
  }
  function runImport() {
    const st = parseImport(ui.importText), ok = st.rows.filter((x) => !x.errs.length), s = db.settings, byMail = {};
    ok.forEach((x) => { const id = uid('e'), svc = x.r.service || 'Direction', site = x.r.site || (s.sites[0] && s.sites[0].nom) || 'Siège';
      if (!s.services.some((v) => v.nom === svc)) s.services.push({ nom: svc, head: null }); if (!s.sites.some((v) => v.nom === site)) s.sites.push({ id: uid('s'), nom: site, adresse: '', transport: 0 });
      const started = x.date <= TODAY, e = { id, firstName: x.r.prenom, lastName: x.r.nom, title: x.r.poste || 'Collaborateur', dept: svc, managerId: null, stage: started ? 5 : 2, startDate: x.date, contract: x.contrat, salary: x.sal,
        email: x.r.email.toLowerCase(), phone: '', location: site, birthDate: null, address: '', emergency: '', cp: 0, rtt: 0, status: null, exit: null, category: x.contrat === 'Alternance' || x.contrat === 'Stage' ? 'Employé' : x.sal >= 45000 ? 'Cadre' : 'Employé',
        nationality: '', zone: 'France', registeredAt: started ? x.date : null, family: 'Célibataire', iban: '—', titreEnd: null, endDate: null, importedAt: TODAY };
      db.employees.push(e); byMail[e.email] = e; e._mgr = (x.r.manager || '').toLowerCase(); });
    const all = Object.fromEntries(db.employees.map((e) => [e.email.toLowerCase(), e]));
    Object.values(byMail).forEach((e) => { const m = all[e._mgr]; if (m && m.id !== e.id) e.managerId = m.id; delete e._mgr; });
    s.services.forEach((v) => { if (!v.head) { const h = db.employees.find((e) => e.dept === v.nom && e.stage < 15 && !db.employees.some((x) => x.id === e.managerId && x.dept === v.nom)); if (h) v.head = h.id; } });
    if (!emp(s.directionId) || (s.directionId === 'e1' && !s.dirChosen)) { const top = db.employees.find((e) => !e.managerId && e.id !== 'e1' && e.stage < 15); if (top) s.directionId = top.id; }
    db.settingsLog.unshift({ at: TODAY, by: me() ? me().id : 'e1', section: 'Collaborateurs (import)', changes: [`${plural(ok.length, 'collaborateur importé', 'collaborateurs importés')}`] });
    ui.importText = null; applySettings(); toast(`${plural(ok.length, 'collaborateur importé', 'collaborateurs importés')} · invitations prêtes à partir`); commit();
  }
  // ---- Enregistrement d'une section, avec garde-fous légaux (erreur bloquante) et points d'attention (avertissement).
  function saveSection(k, v) {
    const s = db.settings, num = (x) => Number(String(x).replace(',', '.')), errs = [], warns = [], before = JSON.stringify(s);
    const label = (SET_SECTIONS.find((x) => x[0] === k) || [k, k])[1];
    if (k === 'entreprise') {
      const n = sirenDigits(v.siret), Y = Number(TODAY.slice(0, 4));
      for (let y = Y - 5; y < Y; y++) { const x = v[`eff_${y}`]; if (x !== undefined) { if (x === '') delete s.effectifs[y]; else if (!(num(x) >= 0)) errs.push(`Effectif ${y} : nombre positif attendu.`); else s.effectifs[y] = num(x); } }
      for (let y = Y - 3; y < Y; y++) { const ca = v[`ca_${y}`], res = v[`res_${y}`]; if (ca !== undefined) { if (ca === '' && res === '') delete s.finances[y]; else s.finances[y] = { ca: num(ca) || 0, res: num(res) || 0 }; } }
      if (!v.nom.trim()) errs.push('Indique le nom d’usage de l’entreprise.'); if (v.siret && n.length !== 14) errs.push('Le SIRET compte 14 chiffres.'); else if (n && !luhnOk(n)) warns.push('Le SIRET ne passe pas la clé de contrôle : vérifie-le.');
      if (v.cp && !/^\d{5}$/.test(v.cp.trim())) errs.push('Le code postal compte 5 chiffres.'); if (v.naf && !/^\d{2}\.?\d{2}[A-Za-z]/.test(v.naf.trim())) errs.push('Le code NAF a la forme 7410Z.');
      if (v.domaine && !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(v.domaine.trim())) errs.push('Le domaine e-mail a la forme entreprise.fr.');
      if (!errs.length) Object.assign(s.company, { nom: v.nom.trim(), raison: v.raison.trim(), adresse: v.adresse.trim(), cp: v.cp.trim(), ville: v.ville.trim(), siret: v.siret.trim(), naf: v.naf.trim().toUpperCase(), urssaf: v.urssaf.trim(), domaine: v.domaine.trim().toLowerCase() }, v.signataire ? { signataire: v.signataire } : {});
    }
    if (k === 'convention') { const h = num(v.heures), f = num(v.forfait), t = num(v.ttMax);
      if (!(h >= 1 && h <= 48)) errs.push('La durée hebdomadaire doit être comprise entre 1 et 48 heures (maximum légal).'); else if (h > 35) warns.push(`Au-delà de 35 h, les ${h - 35} h par semaine sont des heures supplémentaires majorées.`);
      if (!(f >= 100 && f <= 218)) errs.push('Le forfait annuel ne peut pas dépasser 218 jours (art. L3121-64).'); if (!(t >= 0 && t <= 5)) errs.push('Le télétravail est compris entre 0 et 5 jours par semaine.');
      const key = v.convention === undefined ? s.convention : (v.convention || 'code'), rules = {};
      if (key !== 'code' && key !== CONV_SYNTEC && v.essaiE !== undefined) {
        ['essaiE', 'essaiAM', 'essaiC', 'demNC', 'demC', 'licNC', 'licC', 'maintien'].forEach((x) => { rules[x] = num(v[x] || 0); if (!(rules[x] >= 0) || !Number.isInteger(rules[x])) { const m = 'Les règles de la convention sont des nombres entiers de mois, positifs.'; if (!errs.includes(m)) errs.push(m); } });
        if (rules.maintien > 12) errs.push('Le maintien de salaire ne peut pas exiger plus d’un an d’ancienneté (art. L1226-1).');
        [['essaiE', 2, 'employés'], ['essaiAM', 3, 'agents de maîtrise'], ['essaiC', 4, 'cadres']].forEach(([x, m, l]) => { if (rules[x] > m) warns.push(`Essai ${l} au-delà de ${m} mois : possible seulement si la convention date d’avant le 26 juin 2008 (à vérifier).`); });
        Object.assign(rules, { idcc: key, renouv: !!v.renouv, ok: !!v.convOk }); }
      if (!errs.length) Object.assign(s, { convention: key, temps: { heures: h, forfait: f, ttMax: t } }, rules.idcc ? { convRules: rules } : {}); }
    if (k === 'sites') { const list = []; Object.keys(v).filter((x) => x.startsWith('nom_')).forEach((x) => { const i = x.slice(4); list.push({ id: v[`id_${i}`] || uid('s'), nom: v[x].trim(), adresse: (v[`adresse_${i}`] || '').trim(), transport: num(v[`transport_${i}`]) || 0 }); });
      if (!list.length) errs.push('Il faut au moins un site.'); if (list.some((x) => !x.nom)) errs.push('Chaque site a un nom.'); if (new Set(list.map((x) => x.nom.toLowerCase())).size < list.length) errs.push('Deux sites portent le même nom.');
      if (list.some((x) => x.transport < 0)) errs.push('Le prix d’un abonnement ne peut pas être négatif.');
      if (!errs.length) { const old = s.sites; list.forEach((x) => { const o = old.find((y) => y.id === x.id); if (o && o.nom && o.nom !== x.nom) db.employees.forEach((e) => { if ((e.location || '').startsWith(o.nom)) e.location = e.location.replace(o.nom, x.nom); }); }); s.sites = list; } }
    if (k === 'services') { const list = []; Object.keys(v).filter((x) => x.startsWith('nom_')).forEach((x) => { const i = x.slice(4); list.push({ nom: v[x].trim(), head: v[`head_${i}`] || null }); });
      if (list.some((x) => !x.nom)) errs.push('Chaque service a un nom.');
      if (!errs.length) { s.services.forEach((o, i) => { const nw = list[i]; if (nw && o.nom && o.nom !== nw.nom) db.employees.forEach((e) => { if (e.dept === o.nom) e.dept = nw.nom; }); }); s.services = list; if (v.directionId) { if (v.directionId !== s.directionId) s.dirChosen = true; s.directionId = v.directionId; }
        if (list.some((x) => !x.head)) warns.push('Un service sans responsable : ses demandes remonteront à la Direction.'); } }
    if (k === 'services' && !errs.length) { applySettings(); const n = orgIssues().length; if (n) warns.push(`${plural(n, 'incohérence', 'incohérences')} avec l’organigramme : voir « Cohérence avec l’organigramme » ci-dessous.`); }
    if (k === 'utilisateurs') Object.assign(s.droits, { motifAbsence: !!v.motifAbsence, orgSalarie: !!v.orgSalarie });
    if (k === 'absences') Object.assign(s.conges, { decompte: v.decompte, backup: !!v.backup, off: LEAVE_OPTIONAL.filter((t) => !v[`type_${t}`]) });
    if (k === 'paie') { const p = { vmTaux: Math.max(0, num(v.vmTaux) || 0), prestataire: (v.prestataire || '').trim(), cloture: Math.round(num(v.cloture)), trValeur: num(v.trValeur), trEmployeur: num(v.trEmployeur), mutSal: num(v.mutSal), mutEmp: num(v.mutEmp), ttJour: num(v.ttJour) };
      if (!(p.cloture >= 1 && p.cloture <= 28)) errs.push('Le jour de clôture est compris entre 1 et 28.'); if ([p.trValeur, p.trEmployeur, p.mutSal, p.mutEmp, p.ttJour].some((x) => !(x >= 0))) errs.push('Les montants sont des nombres positifs.');
      if (p.trEmployeur > p.trValeur) errs.push('La part employeur du titre-restaurant ne peut pas dépasser sa valeur.');
      if (p.mutEmp + p.mutSal > 0 && p.mutEmp < p.mutSal) errs.push('L’employeur doit financer au moins 50 % de la complémentaire santé (art. L911-7).');
      if (p.trValeur > 0 && (p.trEmployeur / p.trValeur < 0.5 || p.trEmployeur / p.trValeur > 0.6)) warns.push('Hors de 50 à 60 % de la valeur, la part employeur du titre-restaurant n’est pas exonérée de cotisations.');
      if (p.ttJour > 2.7) warns.push('Au-delà de 2,70 € par jour, l’allocation de télétravail doit être justifiée pour rester exonérée.');
      if (!p.prestataire) warns.push('Sans prestataire, l’export des variables reste possible mais l’envoi n’est pas tracé.');
      if (!errs.length) s.paie = p; }
    if (k === 'recrutement') { const c = Math.round(num(v.conservation)), r = Math.round(num(v.relance));
      if (!(c >= 1 && c <= 2)) errs.push('La CNIL recommande de ne pas conserver une candidature plus de 2 ans sans l’accord du candidat.'); if (!(r >= 1 && r <= 30)) errs.push('La relance est comprise entre 1 et 30 jours.');
      if (!errs.length) s.recrutement = { conservation: c, relance: r }; }
    if (errs.length) return { errs, warns };
    if (JSON.stringify(s) !== before) { const diff = settingsDiff(JSON.parse(before), s); db.settingsLog.unshift({ at: `${TODAY} ${new Date().toTimeString().slice(0, 5)}`, by: me() ? me().id : 'e1', section: label, changes: diff.length ? diff : ['Mise à jour'] }); if (db.settingsLog.length > 300) db.settingsLog.length = 300; }
    applySettings(); return { errs: [], warns };
  }
  function settingsDiff(a, b) {
    const out = [], walk = (x, y, path) => { if (typeof y !== 'object' || y === null || Array.isArray(y)) { const sx = JSON.stringify(x), sy = JSON.stringify(y); if (sx !== sy) out.push(Array.isArray(y) ? `${path} modifié` : `${path} : ${x === undefined || x === '' ? '—' : String(x).slice(0, 40)} → ${y === '' ? '—' : String(y).slice(0, 40)}`); return; } Object.keys(y).forEach((k) => walk(x ? x[k] : undefined, y[k], path ? `${path}.${k}` : k)); };
    walk(a, b, ''); return out.filter((x) => !/^company\.logo/.test(x)).slice(0, 8);
  }
  function viewSettings() {
    const k = SET_SECTIONS.some(([x]) => x === ui.setSec) ? ui.setSec : 'entreprise', checks = setupChecks(), done = checks.filter((x) => x[2]).length, pct = Math.round((done / checks.length) * 100);
    const todoBy = (sec) => checks.filter((x) => x[0] === sec && !x[2]).length;
    const body = k === 'historique' ? `<div class="req-list">${db.settingsLog.length ? db.settingsLog.map((x) => `<div class="req"><span class="doc-ic">${ic('refresh')}</span><div class="what"><b>${esc(x.section)}</b><small>${esc(x.at)} · ${esc(fullName(emp(x.by)))}</small><small>${x.changes.map(esc).join(' · ')}</small></div></div>`).join('') : '<div class="empty">Aucune modification pour l’instant.</div>'}</div>`
      : k === 'import' || k === 'utilisateurs' && false ? setSection(k) : `<form data-form="settings" data-sec="${k}" novalidate>${setSection(k)}<div id="set-msg" aria-live="polite"></div><div class="toolbar" style="margin-top:16px;justify-content:flex-end"><button class="btn primary">${ic('check')}Enregistrer</button></div></form>`;
    return `<div class="set-head card card-b"><div><b>Paramètres de ${esc(COMPANY.nom)}</b><small>Ces réglages s’appliquent à toute l’entreprise. Chaque modification est tracée dans l’historique.</small></div>
        <div class="set-meter" title="${done} sur ${checks.length}"><span>Espace prêt à <b class="num">${pct} %</b></span><i><b style="width:${pct}%"></b></i></div></div>
      <div class="set-grid"><nav class="card set-nav" aria-label="Sections des paramètres">${SET_SECTIONS.map(([x, l, icn]) => `<button type="button" data-act="set-sec" data-k="${x}" aria-current="${x === k}">${ic(icn)}<span>${l}</span>${todoBy(x) ? `<span class="badge-dot">${todoBy(x)}</span>` : ''}</button>`).join('')}</nav>
        <section class="card set-main"><div class="card-h"><h3>${(SET_SECTIONS.find(([x]) => x === k) || [])[1]}</h3>${k === 'import' ? '' : ''}</div><div class="card-b">${body}</div></section></div>
      ${pct < 100 ? `<div class="card card-b"><h4 class="sub">Reste à régler</h4>${checks.filter((x) => !x[2]).map(([sec, l]) => `<div class="todo"><span class="chk-dot warn"></span><div class="t"><b>${esc(l)}</b></div><button type="button" class="btn ghost sm" data-act="set-sec" data-k="${sec}">Régler</button></div>`).join('')}</div>` : ''}`;
  }
  // ---- Assistant de démarrage : une nouvelle entreprise est opérationnelle en quelques écrans.
  const WIZ = [['bienvenue', 'Bienvenue'], ['entreprise', 'Entreprise'], ['convention', 'Convention'], ['sites', 'Sites'], ['services', 'Services'], ['import', 'Collaborateurs'], ['paie', 'Paie'], ['fin', 'C’est prêt']];
  function viewSetup() {
    const i = Math.max(0, WIZ.findIndex(([k]) => k === ui.wizStep)), [k, l] = WIZ[i], admin = emp('e1');
    let inner = '';
    if (k === 'bienvenue') inner = `<p class="wiz-lead">Bienvenue dans Teamora ! En quelques minutes, on configure ton entreprise : identité, convention collective, sites, services, collaborateurs et paie. Chaque étape peut être complétée plus tard dans <b>Paramètres</b>.</p>
      <form data-form="wiz-admin" novalidate><h4 class="sub">Ton compte administrateur</h4><div class="form-grid">${fld('wz-fn', 'Prénom', inp('wz-fn', 'firstName', admin ? admin.firstName : '', 'maxlength="40" autocomplete="given-name"'))}${fld('wz-ln', 'Nom', inp('wz-ln', 'lastName', admin ? admin.lastName : '', 'maxlength="40" autocomplete="family-name"'))}
        ${fld('wz-em', 'E-mail professionnel', inp('wz-em', 'email', admin ? admin.email : '', 'type="email" maxlength="80" autocomplete="email"'))}${fld('wz-ti', 'Fonction', inp('wz-ti', 'title', admin ? admin.title : 'Responsable RH', 'maxlength="60"'))}
        ${fld('wz-co', 'Nom de l’entreprise', inp('wz-co', 'company', db.settings.company.nom, 'maxlength="60"'), true)}</div>
        <label class="agree" style="margin-top:12px"><input type="checkbox" name="dirigeant" ${db.settings.dirChosen && db.settings.directionId === 'e1' ? 'checked' : ''}> Je dirige l’entreprise (gérant, président, directeur général) : je suis en haut de l’organigramme</label><div id="set-msg" aria-live="polite"></div>
        <div class="wiz-nav"><span></span><button class="btn primary">Commencer${ic('arrow')}</button></div></form>`;
    else if (k === 'fin') { const checks = setupChecks(), done = checks.filter((x) => x[2]).length;
      inner = `<div class="wiz-done">${ic('check')}<h3>${esc(COMPANY.nom)} est prêt à utiliser Teamora</h3><p>${done} réglages sur ${checks.length} sont faits. Tu pourras compléter le reste à tout moment dans Paramètres.</p></div>
        <div class="card card-b">${checks.map(([, lab, ok]) => `<div class="todo"><span class="chk-dot ${ok ? 'ok' : 'warn'}"></span><div class="t"><b>${esc(lab)}</b></div><span class="pill ${ok ? 'ok' : 'neutral'}">${ok ? 'Fait' : 'Plus tard'}</span></div>`).join('')}</div>
        <div class="wiz-nav"><button type="button" class="btn ghost" data-act="wiz-go" data-s="paie">${ic('left')}Retour</button><button type="button" class="btn primary" data-act="wiz-finish">${ic('check')}Lancer Teamora</button></div>`; }
    else inner = `<form data-form="settings" data-sec="${k}" data-wiz="1" novalidate>${setSection(k, true)}<div id="set-msg" aria-live="polite"></div>
        <div class="wiz-nav"><button type="button" class="btn ghost" data-act="wiz-go" data-s="${WIZ[i - 1][0]}">${ic('left')}Retour</button><span class="wiz-r">${k === 'import' ? '' : `<button type="button" class="btn ghost" data-act="wiz-go" data-s="${WIZ[i + 1][0]}">Passer</button>`}<button class="btn primary" id="wiz-next">${k === 'import' ? importNextLabel() : 'Enregistrer et continuer'}${ic('arrow')}</button></span></div></form>`;
    return `<div class="wiz-page"><header class="wiz-top"><span class="brand-mark">${LOGO}</span><div><b>Installation de Teamora</b><small>${esc(COMPANY.nom || 'Nouvelle entreprise')}</small></div><button type="button" class="btn ghost sm" data-act="tenant-nova">Revenir à la démo Nova Studio</button></header>
      <ol class="wiz-steps">${WIZ.map(([x, lab], n) => `<li class="${n < i ? 'ok' : n === i ? 'now' : ''}"><i class="num">${n < i ? '✓' : n + 1}</i><span>${lab}</span></li>`).join('')}</ol>
      <section class="card wiz-card"><div class="card-h"><h3>${k === 'bienvenue' ? 'Créons ton espace' : k === 'fin' ? 'Récapitulatif' : l}</h3><span class="muted num" style="font-size:13px">Étape ${i + 1} sur ${WIZ.length}</span></div><div class="card-b">${inner}</div></section></div>`;
  }
  // ---- Entreprise de démonstration vierge (« Nouvelle entreprise ») ou retour à Nova Studio.
  function blankSeed() {
    const d = window.TEAMORA_SEED();
    Object.assign(d, { employees: [], journey: {}, leaves: [], jobs: [], candidates: [], notifications: [], payroll: {}, objectives: [], reviews: [], feedback: [], enrollments: [], purgeLog: [], onboarding: {}, changeReqs: [], timesheets: [], payInfoReqs: [], offboarding: {}, talent: {}, succession: {}, duerp: [], wishes: [], history: [], visits: [], incidents: [], risks: [], survey: [], adjustments: [], cases: [], documents: [], journal: [] });
    d.raises = Object.assign({}, d.raises, { proposals: {}, status: 'Fermée' }); d.valueShare = Object.assign({}, d.valueShare, { years: [], total: 0 }); d.settings = blankSettings(); d.settingsLog = []; return d;
  }
  Object.assign(MOD_ACT, {
    'set-sec'(d) { ui.setSec = d.k; ui.importText = null; window.scrollTo(0, 0); render(); },
    'set-add'(d) { const s = db.settings; if (d.k === 'sites') s.sites.push({ id: uid('s'), nom: '', adresse: '', transport: 0 }); else s.services.push({ nom: '', head: null }); render(); const last = [...document.querySelectorAll('.set-row input[name^="nom_"]')].pop(); if (last) last.focus(); },
    'set-del'(d) { const s = db.settings, i = Number(d.i), x = s[d.k][i]; if (!x) return;
      const used = d.k === 'sites' ? db.employees.filter((e) => e.stage < 15 && siteOf(e) === x.nom && (e.location || '').startsWith(x.nom)).length : db.employees.filter((e) => e.stage < 15 && e.dept === x.nom).length;
      if (used && x.nom) { toast(`${plural(used, 'collaborateur est rattaché', 'collaborateurs sont rattachés')} à « ${x.nom} » : change d’abord leur ${d.k === 'sites' ? 'site' : 'service'}.`, 'info'); return; }
      s[d.k].splice(i, 1); applySettings(); save(); render(); },
    'set-admin'(d) { const id = d.v === '1' ? (document.getElementById('st-adm') || {}).value : d.id, e = emp(id); if (!e) { toast('Choisis un collaborateur.', 'info'); return; }
      if (d.v !== '1' && db.employees.filter((x) => x.admin && x.stage < 15).length <= 1) { toast('Il faut au moins un administrateur.', 'info'); return; }
      e.admin = d.v === '1'; db.settingsLog.unshift({ at: TODAY, by: me().id, section: 'Utilisateurs et droits', changes: [`${fullName(e)} ${e.admin ? 'devient administrateur' : 'n’est plus administrateur'}`] }); if (e.admin) notify(e.id, 'Tu es désormais administrateur RH de Teamora.'); toast(e.admin ? `${fullName(e)} est administrateur` : 'Administrateur retiré'); commit(); },
    'set-logo-del'() { db.settings.company.logo = null; applySettings(); db.settingsLog.unshift({ at: TODAY, by: me().id, section: 'Entreprise', changes: ['Logo retiré'] }); commit(); },
    'set-import-sample'() { ui.importText = IMPORT_SAMPLE; render(); },
    'set-import-go'() { runImport(); },
    'wiz-go'(d) { ui.wizStep = d.s; ui.importText = null; window.scrollTo(0, 0); render(); },
    'wiz-finish'() { db.settings.setupDone = true; Object.assign(ui, { view: 'accueil', stage: null, profile: 'rh', selfOf: null, wizStep: null }); save(); toast(`Bienvenue dans Teamora, ${me().firstName} !`); render(); },
    'tenant-new'() { ui.modal = { type: 'tenant-new' }; render(); },
    'tenant-new-ok'() { switchTenant('new', true); },
    'tenant-nova'() { switchTenant('nova'); },
  });
  MODALS['tenant-new'] = (m, shell) => shell('Tester l’installation', `<div class="modal-b"><p style="margin:0 0 8px">Teamora va s’ouvrir sur une <b>entreprise vierge</b>, comme pour un nouveau client : l’assistant de démarrage te guide pour tout paramétrer.</p><p class="hint" style="margin:0">La démo Nova Studio est conservée : tu peux y revenir à tout moment depuis le bas de page.</p></div>`,
    '<div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Annuler</button><button type="button" class="btn primary" data-act="tenant-new-ok">Créer une entreprise vierge</button></div>');
  Object.assign(MOD_CHG, {
    'set-logo': async (v, d, t) => { const f = t.files && t.files[0]; if (!f) return; try {
      // Un logo n'a pas besoin de plus de 400 px : on réduit puis on compresse (WebP garde la transparence) jusqu'à tenir dans la limite.
      let src = await readImage(f, 400);
      for (const side of [400, 300, 200]) { if (src.length <= 400000 || /^data:image\/(svg|gif)/.test(src)) break; src = await shrinkImage(src, side); }
      t.value = '';
      if (src.length > 400000) { toast(/svg/.test(src) ? 'Ce SVG est trop lourd (plus de 300 Ko) : exporte le logo en PNG.' : 'Logo trop lourd même après réduction : choisis une autre image.', 'info'); return; }
      db.settings.company.logo = src; applySettings(); db.settingsLog.unshift({ at: TODAY, by: me() ? me().id : 'e1', section: 'Entreprise', changes: ['Logo modifié'] }); toast('Logo enregistré'); commit(); } catch (e) { toast(e.message, 'info'); } },
    // Aperçu immédiat du choix (enregistré avec le formulaire).
    'set-conv'(v) { const box = document.getElementById('conv-info'); if (box) box.innerHTML = convInfo(convOf(v || 'code')); },
    'set-import-file'(v, d, t) { const f = t.files && t.files[0]; if (!f) return; const fr = new FileReader(); fr.onload = () => { ui.importText = String(fr.result || ''); render(); }; fr.readAsText(f, 'utf-8'); },
  });
  Object.assign(MOD_FORMS, {
    settings(v, form) {
      const k = form.dataset.sec, wiz = form.dataset.wiz === '1', box = form.querySelector('#set-msg');
      if (k === 'import') {
        // Des lignes valides attendent dans l'aperçu : « Continuer » les importe plutôt que de les perdre.
        const st = ui.importText && ui.importText.trim() ? parseImport(ui.importText) : null, ready = st && st.rows ? st.rows.filter((x) => !x.errs.length).length : 0;
        if (st && !ready && wiz) { box.innerHTML = `<div class="lint bad"><b>${ic('x')}Aucune ligne importable</b><p>Corrige le fichier ou vide la zone de texte pour passer cette étape.</p></div>`; return; }
        if (ready) runImport();
        if (wiz) { ui.wizStep = WIZ[WIZ.findIndex(([x]) => x === 'import') + 1][0]; window.scrollTo(0, 0); render(); } return; }
      const r = saveSection(k, v);
      if (r.errs.length) { box.innerHTML = `<div class="lint bad"><b>${ic('x')}À corriger avant d’enregistrer</b>${r.errs.map((x) => `<p>${esc(x)}</p>`).join('')}</div>`; return; }
      if (wiz) { ui.wizStep = WIZ[WIZ.findIndex(([x]) => x === k) + 1][0]; if (r.warns.length) toast(r.warns[0], 'info'); commit(); window.scrollTo(0, 0); return; }
      toast(r.warns.length ? `Enregistré · ${r.warns[0]}` : 'Paramètres enregistrés', r.warns.length ? 'info' : 'ok'); commit();
      if (r.warns.length) { const b = document.getElementById('set-msg'); if (b) b.innerHTML = `<div class="lint warn"><b>Points d’attention</b>${r.warns.map((x) => `<p>${esc(x)}</p>`).join('')}</div>`; }
    },
    'wiz-admin'(v, form) {
      const box = form.querySelector('#set-msg'), errs = [];
      if (!v.firstName.trim() || !v.lastName.trim()) errs.push('Indique ton prénom et ton nom.'); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.trim())) errs.push('Indique une adresse e-mail valide.'); if (!v.company.trim()) errs.push('Indique le nom de l’entreprise.');
      if (errs.length) { box.innerHTML = `<div class="lint bad"><b>${ic('x')}À compléter</b>${errs.map((x) => `<p>${esc(x)}</p>`).join('')}</div>`; return; }
      let a = emp('e1'); const domain = v.email.trim().split('@')[1].toLowerCase();
      if (!a) { a = { id: 'e1', stage: 5, startDate: TODAY, contract: 'CDI', salary: 0, dept: 'RH', managerId: null, phone: '', location: 'Siège', birthDate: null, address: '', emergency: '', cp: 0, rtt: 0, status: null, exit: null, category: 'Cadre', nationality: '', zone: 'France', registeredAt: TODAY, family: 'Célibataire', iban: '—', titreEnd: null, endDate: null, admin: true }; db.employees.push(a); }
      Object.assign(a, { firstName: v.firstName.trim(), lastName: v.lastName.trim(), email: v.email.trim().toLowerCase(), title: v.title.trim() || 'Responsable RH', admin: true });
      Object.assign(db.settings.company, { nom: v.company.trim(), raison: db.settings.company.raison || v.company.trim(), domaine: db.settings.company.domaine || domain, signataire: 'e1' });
      if (!db.settings.services.length) db.settings.services = [{ nom: 'Direction', head: null }, { nom: 'RH', head: 'e1' }];
      // Le dirigeant est la Direction et le haut de l'organigramme ; sinon, la Direction sera déduite de l'import.
      if (v.dirigeant) { Object.assign(db.settings, { directionId: 'e1', dirChosen: true }); a.dept = 'Direction'; a.managerId = null; if (!v.title.trim()) a.title = 'Directeur général';
        const dir = db.settings.services.find((x) => x.nom === 'Direction'); if (dir) dir.head = 'e1'; const rhs = db.settings.services.find((x) => x.nom === 'RH'); if (rhs && rhs.head === 'e1') rhs.head = null; }
      else if (db.settings.dirChosen && db.settings.directionId === 'e1') { db.settings.dirChosen = false; }
      applySettings(); ui.wizStep = 'entreprise'; save(); render(); window.scrollTo(0, 0);
    },
  });
  MOD_INP['set-import'] = (val) => { ui.importText = val; const box = document.getElementById('imp-prev'); if (box) box.innerHTML = importPreview(val.trim() ? parseImport(val) : null);
    const nx = document.getElementById('wiz-next'); if (nx) nx.innerHTML = `${importNextLabel()}${ic('arrow')}`; };

  // ---- Cohérence entre les responsables des paramètres, le service et le manager des dossiers, et l'organigramme.
  // Règle : le responsable d'un service en fait partie, il est en haut de sa branche, et tous les membres du service sont dans son équipe.
  const svcMembers = (svc) => db.employees.filter((e) => e.stage >= 2 && e.stage < 15 && e.dept === svc);
  function orgIssues() {
    if (!db.settings) return [];
    const out = [], heads = {};
    db.settings.services.forEach((sv) => { if (sv.head) (heads[sv.head] = heads[sv.head] || []).push(sv.nom); });
    db.settings.services.forEach((sv) => {
      const h = sv.head && emp(sv.head), members = svcMembers(sv.nom);
      if (!h || h.stage >= 15) {
        if (!members.length) return;
        const tops = members.filter((m) => !members.some((o) => o.id !== m.id && isUnder(m.id, o.id)));
        out.push({ t: 'no-head', svc: sv.nom, msg: `Aucun responsable désigné pour « ${sv.nom} »${tops.length === 1 ? ` : ${fullName(tops[0])} est en haut de la branche` : ''}.`, fix: tops.length === 1 ? { a: 'head', id: tops[0].id, l: `Désigner ${fullName(tops[0])}` } : null });
        return;
      }
      // Une personne peut diriger plusieurs services : il suffit qu'elle appartienne à l'un d'eux.
      if (!heads[h.id].includes(h.dept)) out.push({ t: 'head-dept', svc: sv.nom, msg: `${fullName(h)}, responsable de « ${sv.nom} », est rattaché·e au service « ${h.dept} » dans son dossier.`, fix: { a: 'dept', id: h.id, l: `Passer ${h.firstName} dans « ${sv.nom} »` } });
      const others = members.filter((m) => m.id !== h.id), above = others.filter((m) => isUnder(h.id, m.id));
      if (above.length) { const top = above.find((m) => !above.some((o) => o.id !== m.id && isUnder(m.id, o.id))) || above[0];
        out.push({ t: 'head-low', svc: sv.nom, msg: `${fullName(top)} (même service) est au-dessus de ${fullName(h)}, le responsable, dans l’organigramme.`, fix: { a: 'head', id: top.id, l: `Désigner ${top.firstName} responsable` } }); }
      others.filter((m) => !isUnder(m.id, h.id) && !isUnder(h.id, m.id)).forEach((m) => out.push({ t: 'outside', svc: sv.nom, msg: `${fullName(m)} est dans « ${sv.nom} » mais ne fait pas partie de l’équipe de ${fullName(h)} (manager : ${m.managerId && emp(m.managerId) ? fullName(emp(m.managerId)) : 'aucun'}).`, fix: { a: 'attach', id: m.id, to: h.id, l: `Rattacher à ${h.firstName}` } }));
    });
    // Doublons : deux dossiers actifs pour la même personne (même nom), qui apparaît donc deux fois dans l'organigramme.
    dupGroups().forEach((g) => { const spare = g.find((x) => !empHasData(x)) && g.slice().sort((a, z) => Number(empHasData(a)) - Number(empHasData(z)) || String(z.id).localeCompare(String(a.id)))[0], keep = spare && g.find((x) => x.id !== spare.id);
      out.unshift({ t: 'dup', svc: g[0].dept, msg: `${fullName(g[0])} a ${g.length} dossiers (${g.map((x) => `${x.email} · ${x.dept}`).join(' ; ')}) : la personne apparaît ${g.length} fois dans l’organigramme.`, fix: spare && keep ? { a: 'merge', id: spare.id, to: keep.id, l: `Supprimer le doublon (${spare.email})` } : null }); });
    // Boucle de rattachements (A dépend de B qui dépend de A) : on propose de rattacher le premier à la Direction.
    const loopSeen = new Set(); db.employees.filter((e) => e.stage >= 2 && e.stage < 15 && e.managerId && emp(e.managerId) && inLoop(e)).forEach((e) => {
      if (loopSeen.has(e.id)) return;
      const cyc = []; let x = e; while (x && !cyc.includes(x.id) && cyc.length < 60) { cyc.push(x.id); x = emp(x.managerId); } cyc.forEach((i) => loopSeen.add(i));
      const d = emp(DIR_ID()), first = emp(cyc.find((i) => Object.values(DEPT_HEAD).includes(i)) || cyc[0]);
      out.unshift({ t: 'loop', svc: first.dept, msg: `Boucle de rattachements : ${cyc.map((i) => fullName(emp(i))).join(' → ')} → ${fullName(first)}.`, fix: d && !cyc.includes(d.id) ? { a: 'attach', id: first.id, to: d.id, l: `Rattacher ${first.firstName} à ${d.firstName} (Direction)` } : { a: 'attach', id: first.id, to: null, l: `Retirer le manager de ${first.firstName}` } }); });
    // Un seul sommet : toute personne sans manager, hors Direction, forme un arbre à part.
    const dir = emp(DIR_ID()); if (dir) db.employees.filter((e) => e.stage >= 2 && e.stage < 15 && e.id !== dir.id && (!e.managerId || !emp(e.managerId))).forEach((e) => out.push({ t: 'root', svc: e.dept, msg: `${fullName(e)} n’a pas de manager : sa carte apparaît à part, en haut de l’organigramme.`, fix: { a: 'attach', id: e.id, to: dir.id, l: `Rattacher à ${dir.firstName} (Direction)` }, alt: { a: 'dir', id: e.id, l: `${e.firstName} dirige l’entreprise` } }));
    return out;
  }
  const nameKey = (e) => pickNorm(`${e.firstName} ${e.lastName}`).replace(/[^a-z]/g, '');
  function dupGroups() {
    const by = {}; db.employees.filter((e) => e.stage >= 2 && e.stage < 15).forEach((e) => { (by[nameKey(e)] = by[nameKey(e)] || []).push(e); });
    return Object.values(by).filter((g) => g.length > 1);
  }
  // Un dossier « vide » (rien d'enregistré à son nom) peut être supprimé sans rien perdre.
  const empHasData = (e) => db.leaves.some((l) => l.empId === e.id) || db.documents.some((d) => d.empId === e.id) || db.reviews.some((r) => r.empId === e.id) || db.history.some((h) => h.empId === e.id) || e.id === 'e1';
  function orgCoherence() {
    const list = orgIssues();
    return `<div class="coh ${list.length ? 'warn' : 'ok'}"><h4 class="sub">Cohérence avec l’organigramme</h4>${list.length ? `<p class="hint" style="margin:0 0 8px">Le responsable d’un service en fait partie, il est en haut de sa branche, et tous les membres du service sont dans son équipe (directement ou non) ; chacun remonte jusqu’à la Direction. Les corrections s’appliquent aujourd’hui et sont tracées dans l’historique des collaborateurs.</p>
      ${list.map((x, i) => `<div class="todo"><span class="chk-dot warn"></span><div class="t"><b>${esc(x.msg)}</b></div>${x.alt ? `<button type="button" class="btn ghost sm" data-act="coh-fix" data-i="${i}" data-alt="1">${esc(x.alt.l)}</button>` : ''}${x.fix ? `<button type="button" class="btn ghost sm" data-act="coh-fix" data-i="${i}">${esc(x.fix.l)}</button>` : '<span class="pill neutral">À corriger dans les dossiers</span>'}</div>`).join('')}
      ${list.filter((x) => x.fix).length > 1 ? `<div class="toolbar" style="margin-top:8px"><button type="button" class="btn primary sm" data-act="coh-fix-all">${ic('check')}Tout corriger</button></div>` : ''}`
      : `<p class="ok-line">${ic('check')}Responsables, services et organigramme concordent.</p>`}</div>`;
  }
  function cohApply(x) {
    const f = x.fix, e = emp(f.id); if (!e) return;
    const cur = { title: e.title, dept: e.dept, managerId: e.managerId, salary: e.salary, quotite: e.quotite || 100 };
    if (f.a === 'attach') applySituation(e, Object.assign(cur, { managerId: f.to }), TODAY, 'Changement de manager');
    if (f.a === 'dept') applySituation(e, Object.assign(cur, { dept: x.svc }), TODAY, 'Changement de service');
    if (f.a === 'head') { const sv = db.settings.services.find((v) => v.nom === x.svc); if (sv) sv.head = e.id; }
    // Désigner le dirigeant : il devient la Direction et le sommet (le contrôle proposera ensuite de rattacher les autres).
    if (f.a === 'dir') { const old = emp(DIR_ID()); Object.assign(db.settings, { directionId: e.id, dirChosen: true }); applySettings();
      const dsv = db.settings.services.find((v) => v.nom === 'Direction'); if (dsv && (!dsv.head || dsv.head === (old && old.id))) dsv.head = e.id; }
    if (f.a === 'merge') { const k = emp(f.to); // l'équipe et les responsabilités du doublon passent au dossier conservé
      db.employees.forEach((y) => { if (y.managerId === e.id) y.managerId = y.id === k.id ? (e.managerId && e.managerId !== k.id ? e.managerId : null) : k.id; }); db.settings.services.forEach((v) => { if (v.head === e.id) v.head = k.id; });
      if (db.settings.directionId === e.id) db.settings.directionId = k.id; if (e.admin) k.admin = true;
      db.employees = db.employees.filter((y) => y.id !== e.id); if (db.onboarding) delete db.onboarding[e.id]; db.notifications = db.notifications.filter((n) => n.to !== e.id); }
    db.settingsLog.unshift({ at: TODAY, by: me().id, section: 'Services et Direction', changes: [`Cohérence : ${f.l}${f.a === 'merge' ? ` (${fullName(emp(f.to))})` : ''}`] });
  }
  Object.assign(MOD_ACT, {
    'coh-open'() { Object.assign(ui, { view: 'parametres', stage: null, setSec: 'services', orgFull: false }); document.documentElement.classList.remove('org-full-on'); window.scrollTo(0, 0); render(); },
    'coh-fix'(d) { const x = orgIssues()[Number(d.i)]; if (!x || !x.fix) return; if (d.alt && x.alt) x.fix = x.alt; cohApply(x); applySettings(); toast(`${x.fix.l} : fait`); commit(); },
    'coh-fix-all'() { let n = 0, x; while ((x = orgIssues().find((y) => y.fix)) && n < 50) { cohApply(x); applySettings(); n++; } toast(`${plural(n, 'correction appliquée', 'corrections appliquées')}`); commit(); },
  });
  // ================================================================ V3 · Obligations selon l'effectif
  // Teamora calcule l'effectif à partir des dossiers, applique les règles de franchissement des seuils et adapte les écrans
  // et les alertes aux obligations en vigueur. Calculs indicatifs : les règles doivent être validées par un juriste.
  const SEUILS = [11, 20, 50, 250, 300, 1000];
  // Paramètres > Entreprise : effectifs moyens des 5 années passées (règle des 5 ans) et résultats des 3 dernières années.
  function effFields() {
    const Y = Number(TODAY.slice(0, 4)), s = db.settings;
    return `<h4 class="sub" style="margin:18px 0 8px">Effectif moyen des années passées</h4><p class="hint" style="margin:0 0 8px">En équivalent temps plein, hors alternants et stagiaires. Sert à appliquer la règle des 5 ans pour les seuils de 11, 20, 50 et 250 salariés.</p>
      <div class="form-grid eff-grid">${Array.from({ length: 5 }, (_, i) => Y - 5 + i).map((y) => fld(`st-eff${y}`, String(y), inp(`st-eff${y}`, `eff_${y}`, s.effectifs[y] ?? '', 'type="number" min="0" step="0.1"'))).join('')}</div>
      <h4 class="sub" style="margin:18px 0 8px">Chiffre d’affaires et résultat net</h4><p class="hint" style="margin:0 0 8px">De 11 à 49 salariés, un dispositif de partage de la valeur devient obligatoire si le résultat atteint 1 % du chiffre d’affaires 3 années de suite.</p>
      <div class="fin-grid"><span></span><span class="lbl">Chiffre d’affaires (€)</span><span class="lbl">Résultat net (€)</span>${Array.from({ length: 3 }, (_, i) => Y - 3 + i).map((y) => `<b class="num">${y}</b>${inp(`st-ca${y}`, `ca_${y}`, (s.finances[y] || {}).ca ?? '', `type="number" min="0" step="1000" aria-label="Chiffre d’affaires ${y}"`)}${inp(`st-res${y}`, `res_${y}`, (s.finances[y] || {}).res ?? '', `type="number" step="1000" aria-label="Résultat net ${y}"`)}`).join('')}</div>`;
  }
  const PASS_Y = PSS * 12;
  const COMP_DEFAULT = () => ({ sim: null, known: null, displays: {}, ri: {}, accords: {}, referents: {}, bilans: {}, rqth: [], alerts: [], whistleOn: false,
    cse: { mandate: null, election: {}, members: [], meetings: [], hours: {}, consult: {}, nao: {}, ds: false, ascPct: 0.5 }, index: {} });
  function normalizeCompliance() {
    const d = COMP_DEFAULT(); db.compliance = Object.assign(d, db.compliance || {}); db.compliance.cse = Object.assign(COMP_DEFAULT().cse, db.compliance.cse || {});
    const s = db.settings; s.effectifs = s.effectifs || {}; s.finances = s.finances || {};
  }
  // Effectif : équivalents temps plein présents le dernier jour du mois, hors apprentis, alternants et stagiaires (art. L1111-2 et L1111-3).
  const countsInEff = (e) => !['Stage', 'Alternance'].includes(e.contract);
  const presentOn = (e, day) => e.startDate <= day && !(e.exit && e.exit.lastDay && e.exit.lastDay < day) && !(e.stage === 15 && !(e.exit && e.exit.lastDay));
  const etpAt = (day) => Math.round(db.employees.filter((e) => countsInEff(e) && presentOn(e, day)).reduce((s, e) => s + (e.quotite || 100) / 100, 0) * 10) / 10;
  const monthDay = (m) => (m === monthKey(TODAY) ? TODAY : monthEnd(m));
  const YEAR = Number(TODAY.slice(0, 4));
  function effState() {
    const c = db.compliance, sim = c.sim, cur = monthKey(TODAY);
    const months = Array.from({ length: 12 }, (_, i) => shiftMonth(cur, i - 11)).map((m) => ({ m, v: etpAt(monthDay(m)) }));
    const proj = Array.from({ length: 12 }, (_, i) => shiftMonth(cur, i + 1)).map((m) => ({ m, v: etpAt(monthEnd(m)) }));
    const yearAvg = (y) => { const ms = Array.from({ length: 12 }, (_, i) => `${y}-${String(i + 1).padStart(2, '0')}`).filter((m) => m <= cur); return ms.length ? Math.round(ms.reduce((s, m) => s + etpAt(monthDay(m)), 0) / ms.length * 10) / 10 : 0; };
    const years = {}; for (let y = YEAR - 5; y <= YEAR; y++) { const v = db.settings.effectifs[y]; years[y] = y < YEAR && v !== undefined && v !== '' && v !== null ? Number(v) : y === YEAR ? yearAvg(y) : null; }
    if (sim) { const n = Number(sim.n) || 0; months.forEach((x, i) => { if (sim.since !== 'recent' || i >= 9) x.v = n; }); proj.forEach((x) => { x.v = n; }); if (sim.since === '5ans') for (let y = YEAR - 5; y <= YEAR; y++) years[y] = n; else years[YEAR] = n; }
    const avg12 = Math.round(months.reduce((s, x) => s + x.v, 0) / 12 * 10) / 10;
    return { months, proj, years, avg12, now: months[11].v, sim: !!sim };
  }
  // Règle de franchissement : « now » = moyenne des 12 derniers mois ; « m12 » = 12 mois consécutifs (CSE, délégué syndical) ;
  // « y5 » = 5 années civiles consécutives (loi PACTE, art. L130-1 du Code de la sécurité sociale) ; « any » = dès le 1er salarié.
  function ruleState(rule, seuil, st = effState()) {
    if (rule === 'any' || !seuil) return { on: true, txt: 'Dès le premier salarié' };
    if (rule === 'now') return st.avg12 >= seuil ? { on: true, txt: `Effectif moyen ${fmtN(st.avg12)} ≥ ${seuil}` } : { on: false, txt: `Effectif moyen ${fmtN(st.avg12)} < ${seuil}`, soon: projCross(seuil, st) };
    if (rule === 'm12') { let k = 0; for (let i = 11; i >= 0 && st.months[i].v >= seuil; i--) k++;
      if (k >= 12) return { on: true, txt: `${seuil} salariés ou plus depuis 12 mois consécutifs` };
      if (k > 0) return { on: false, txt: `${seuil} atteint depuis ${plural(k, 'mois', 'mois')} sur 12 consécutifs`, soon: { m: shiftMonth(monthKey(TODAY), 12 - k), why: `${seuil} salariés pendant 12 mois consécutifs` } };
      return { on: false, txt: `Moins de ${seuil} salariés`, soon: projCross(seuil, st) }; }
    let k = 0; for (let y = YEAR - 1; y >= YEAR - 5 && (st.years[y] || 0) >= seuil; y--) k++;
    if (k >= 5) return { on: true, txt: `${seuil} salariés ou plus 5 années civiles de suite` };
    if ((st.years[YEAR] || 0) >= seuil || st.avg12 >= seuil) return { on: false, txt: `Seuil de ${seuil} atteint, ${k ? `${plural(k, 'année', 'années')} déjà comptée${k > 1 ? 's' : ''}` : 'première année'} sur 5`, soon: { m: `${YEAR + 5 - k}-01`, why: `5 années civiles consécutives à ${seuil} ou plus` } };
    return { on: false, txt: `Moins de ${seuil} salariés`, soon: projCross(seuil, st) };
  }
  const fmtN = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
  const projCross = (seuil, st) => { const x = st.proj.find((p) => p.v >= seuil); return x ? { m: x.m, why: `effectif prévu de ${fmtN(x.v)} avec les arrivées et départs connus`, cross: true } : null; };
  const isOn = (seuil, rule) => ruleState(rule, seuil).on;
  // ---- Calculs propres à certaines obligations
  const DISPLAYS = [['inspection', 'Coordonnées de l’inspection du travail'], ['medecine', 'Coordonnées du service de prévention et de santé au travail'], ['secours', 'Consignes de sécurité et numéros d’urgence'],
    ['harcelement', 'Harcèlement moral et sexuel : textes et recours'], ['egalite', 'Égalité de rémunération femmes-hommes'], ['discrimination', 'Lutte contre les discriminations à l’embauche'],
    ['horaires', 'Horaires collectifs et repos hebdomadaire'], ['convention', 'Convention collective applicable et accords d’entreprise'], ['conges', 'Période et ordre des départs en congés payés'], ['tabac', 'Interdiction de fumer et de vapoter']];
  const lastDuerp = () => (db.duerp || []).map((x) => x.date).sort().pop() || null;
  function bilanRows() {
    const out = [];
    db.employees.filter((e) => isEmployed(e) && ['CDI', 'CDD'].includes(e.contract)).forEach((e) => {
      for (let k = 1; k < 8; k++) {
        // Loi du 24 octobre 2025 : entretien de parcours professionnel tous les 4 ans, état des lieux récapitulatif tous les 8 ans.
        const due = addMonths(e.startDate, 96 * k); if (due > addDays(TODAY, 183)) break; if (due < addDays(TODAY, -365)) continue;
        const from = addMonths(due, -96), dates = new Set(db.reviews.filter((r) => r.empId === e.id && r.kind === 'Entretien professionnel' && r.date && r.date > from && r.date <= due && ['Signé', 'Refusé par le salarié'].includes(r.status)).map((r) => r.date));
        if (e.lastPro && e.lastPro > from && e.lastPro <= due) dates.add(e.lastPro); const pro = dates.size;
        const trn = db.enrollments.filter((x) => x.empId === e.id && x.status === 'Terminée' && x.session > from && x.session <= due).length, key = `${e.id}_${due}`;
        out.push({ e, due, pro, trn, key, done: db.compliance.bilans[key] || null, late: due < TODAY && !db.compliance.bilans[key] });
      }
    });
    return out.sort((a, b) => a.due.localeCompare(b.due));
  }
  const rqthActive = () => db.compliance.rqth.filter((r) => emp(r.empId) && isEmployed(emp(r.empId)) && (!r.to || r.to >= TODAY));
  function oethState(st = effState()) {
    const due = Math.floor(st.avg12 * 0.06), have = rqthActive().length, miss = Math.max(0, due - have), rate = st.avg12 >= 750 ? 600 : st.avg12 >= 250 ? 500 : 400;
    return { due, have, miss, contrib: Math.round(miss * rate * SMIC_M / HOURS_M), rate };
  }
  const payroll = () => db.employees.filter((e) => isEmployed(e)).reduce((s, e) => s + e.salary * (e.quotite || 100) / 100, 0);
  const altShare = () => { const all = db.employees.filter(isEmployed); return all.length ? all.filter((e) => e.contract === 'Alternance').length / all.length : 0; };
  // Index de l'égalité professionnelle (calcul indicatif, à vérifier sur Egapro) : barèmes officiels simplifiés.
  function indexState(st = effState()) {
    const big = st.avg12 >= 250, pop = db.employees.filter((e) => isEmployed(e) && countsInEff(e) && (e.sex === 'F' || e.sex === 'H') && dayDiff(e.startDate, TODAY) >= 183);
    const age = (e) => { const a = e.birthDate ? Math.floor(dayDiff(e.birthDate, TODAY) / 365.25) : 35; return a < 30 ? '<30' : a < 40 ? '30-39' : a < 50 ? '40-49' : '50+'; };
    const groups = {}; pop.forEach((e) => { const g = groups[`${e.category}|${age(e)}`] = groups[`${e.category}|${age(e)}`] || { F: [], H: [] }; g[e.sex].push(e.salary * 100 / (e.quotite || 100)); });
    const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length; let cov = 0, gapW = 0;
    Object.values(groups).forEach((g) => { if (g.F.length >= 3 && g.H.length >= 3) { const n = g.F.length + g.H.length, gap = (avg(g.H) - avg(g.F)) / avg(g.H) * 100, adj = Math.abs(gap) > 5 ? (Math.abs(gap) - 5) * Math.sign(gap) : 0; cov += n; gapW += adj * n; } });
    const ind = [];
    const SC1 = [40, 39, 38, 37, 36, 35, 34, 33, 31, 29, 27, 25, 23, 21, 19, 17, 14, 11, 8, 5, 2];
    if (pop.length && cov / pop.length >= 0.4) { const g = Math.abs(gapW / cov); ind.push({ k: 'remu', l: 'Écart de rémunération', v: `${fmtN(g)} %`, pts: g > 20 ? 0 : SC1[Math.ceil(g)], max: 40 }); }
    else ind.push({ k: 'remu', l: 'Écart de rémunération', v: 'Non calculable', note: 'Moins de 40 % de l’effectif dans des groupes (catégorie × âge) d’au moins 3 femmes et 3 hommes', pts: null, max: 40 });
    const raised = new Set(Object.entries(db.raises.proposals || {}).filter(([, p]) => ['Validée', 'Appliquée'].includes(p.status)).map(([id]) => id).concat(db.history.filter((h) => /Augmentation|Promotion/.test(h.label) && h.date >= addDays(TODAY, -365)).map((h) => h.empId)));
    const F = pop.filter((e) => e.sex === 'F'), H = pop.filter((e) => e.sex === 'H'), rate = (l) => (l.length ? l.filter((e) => raised.has(e.id)).length / l.length * 100 : 0);
    const pctGap = (fn, scale) => { if (F.length < 5 || H.length < 5) return { v: 'Non calculable', note: 'Moins de 5 femmes ou de 5 hommes', pts: null }; const g = Math.abs(fn(F) - fn(H)); return { v: `${fmtN(g)} points`, pts: scale(g) }; };
    if (!big) ind.push(Object.assign({ k: 'aug', l: 'Écart de taux d’augmentations individuelles', max: 35 }, pctGap(rate, (g) => (g <= 2 ? 35 : g <= 5 ? 25 : g <= 10 ? 15 : 0))));
    else {
      const promo = new Set(db.history.filter((h) => h.label === 'Promotion' && h.date >= addDays(TODAY, -365)).map((h) => h.empId)), rp = (l) => (l.length ? l.filter((e) => promo.has(e.id)).length / l.length * 100 : 0);
      ind.push(Object.assign({ k: 'aug', l: 'Écart de taux d’augmentations (hors promotions)', max: 20 }, pctGap(rate, (g) => (g <= 2 ? 20 : g <= 5 ? 10 : g <= 10 ? 5 : 0))));
      ind.push(Object.assign({ k: 'promo', l: 'Écart de taux de promotions', max: 15 }, pctGap(rp, (g) => (g <= 2 ? 15 : g <= 5 ? 10 : g <= 10 ? 5 : 0))));
    }
    const back = db.leaves.filter((l) => l.type === 'Maternité' && l.end < TODAY && l.end >= addDays(TODAY, -365));
    ind.push(back.length ? { k: 'mat', l: 'Augmentation au retour de congé maternité', v: `${back.filter((l) => raised.has(l.empId)).length} sur ${back.length}`, pts: back.every((l) => raised.has(l.empId)) ? 15 : 0, max: 15 }
      : { k: 'mat', l: 'Augmentation au retour de congé maternité', v: 'Non calculable', note: 'Aucun retour de congé maternité sur la période', pts: null, max: 15 });
    const top = pop.slice().sort((a, b) => b.salary - a.salary).slice(0, 10), nf = top.filter((e) => e.sex === 'F').length, under = Math.min(nf, top.length - nf);
    ind.push({ k: 'top', l: 'Sexe sous-représenté parmi les 10 plus hautes rémunérations', v: `${under} sur ${top.length}`, pts: top.length < 10 ? null : under >= 4 ? 10 : under >= 2 ? 5 : 0, note: top.length < 10 ? 'Moins de 10 salariés' : '', max: 10 });
    const calc = ind.filter((x) => x.pts !== null), max = calc.reduce((s, x) => s + x.max, 0), pts = calc.reduce((s, x) => s + x.pts, 0);
    return { ind, score: max >= 75 ? Math.round(pts / max * 100) : null, max, pop: pop.length };
  }
  // Heures de délégation mensuelles d'un titulaire (art. R2314-1, barème simplifié).
  const delegHours = (n) => (n < 50 ? 10 : n < 75 ? 18 : n < 100 ? 19 : n < 400 ? 21 : n < 1500 ? 22 : 24);
  const cseOn = () => { const m = db.compliance.cse.mandate; return !!(m && !m.carence && m.end >= TODAY); };
  // ---- Registre des obligations : seuil, règle de franchissement, état calculé, écran où les traiter.
  function obligations() {
    const st = effState(), c = db.compliance, s = db.settings, y = String(YEAR), o = [];
    const add = (seuil, rule, k, title, desc, state, go) => o.push(Object.assign({ seuil, rule, k, title, desc, go }, ruleState(rule, seuil, st), { state }));
    const dl = lastDuerp(), duerpLate = !dl || dl < addDays(TODAY, -365), bil = bilanRows(), bilLate = bil.filter((b) => b.late), bilSoon = bil.filter((b) => !b.done && !b.late);
    const dispOk = DISPLAYS.every(([k]) => c.displays[k]);
    add(0, 'any', 'dpae', 'DPAE avant chaque embauche', 'Déclaration préalable à l’embauche auprès de l’Urssaf, au plus tôt 8 jours avant l’arrivée.', { s: 'ok', l: 'Intégrée aux arrivées' }, { v: 'arrivees' });
    add(0, 'any', 'registre', 'Registre unique du personnel', 'Tenu à jour à chaque entrée et sortie, consultable par l’inspection du travail.', { s: 'ok', l: 'Tenu automatiquement' }, { v: 'collaborateurs' });
    add(0, 'any', 'duerp', 'Document unique d’évaluation des risques', 'Mis à jour au moins une fois par an à partir de 11 salariés, et à chaque changement important.', isOn(11, 'now') && duerpLate ? { s: 'todo', l: `Mise à jour annuelle en retard${dl ? ` (dernière : ${fmtDate(dl)})` : ''}` } : { s: 'ok', l: dl ? `Mis à jour le ${fmtDate(dl)}` : 'À rédiger' }, { v: 'sante' });
    add(0, 'any', 'affichages', 'Affichages obligatoires', 'Informations à afficher ou à diffuser par tout moyen aux salariés.', dispOk ? { s: 'ok', l: 'Tous en place' } : { s: 'todo', l: `${DISPLAYS.filter(([k]) => !c.displays[k]).length} sur ${DISPLAYS.length} à faire` }, { tab: 'conformite' });
    add(0, 'any', 'medical', 'Suivi médical des salariés', 'Visite d’information et de prévention à l’embauche, puis suivi périodique.', { s: 'ok', l: 'Suivi dans Santé & QVT' }, { v: 'sante' });
    add(0, 'any', 'entretienpro', 'Entretien de parcours professionnel et état des lieux', 'Entretien tous les 4 ans (loi du 24 octobre 2025) ; tous les 8 ans d’ancienneté, un état des lieux vérifie les entretiens et les formations suivies.',
      bilLate.length ? { s: 'todo', l: `${plural(bilLate.length, 'état des lieux en retard', 'états des lieux en retard')}` } : bilSoon.length ? { s: 'warn', l: `${plural(bilSoon.length, 'état des lieux à préparer', 'états des lieux à préparer')} dans les 6 mois` } : { s: 'ok', l: 'À jour' }, { tab: 'bilans' });
    add(0, 'any', 'mutuelle', 'Complémentaire santé collective', 'Financée au moins à 50 % par l’employeur.', s.paie.mutEmp >= s.paie.mutSal ? { s: 'ok', l: `Part employeur ${eur0(s.paie.mutEmp)} / mois` } : { s: 'todo', l: 'Part employeur inférieure à 50 %' }, { v: 'parametres', sec: 'paie' });
    add(11, 'm12', 'cse', 'Comité social et économique (CSE)', 'Élections à organiser dans les 90 jours qui suivent l’information des salariés ; mandats de 4 ans ; réunion au moins une fois par mois sous 50 salariés.',
      cseOn() ? { s: 'ok', l: `Mandat jusqu’au ${fmtDate(c.cse.mandate.end)}` } : c.cse.mandate && c.cse.mandate.carence && c.cse.mandate.end >= TODAY ? { s: 'ok', l: 'Procès-verbal de carence (élections à refaire dans 4 ans)' } : { s: 'todo', l: 'Élections à organiser' }, { tab: 'social' });
    add(11, 'y5', 'formation1', 'Contribution formation à 1 %', 'Au lieu de 0,55 % de la masse salariale sous 11 salariés.', { s: 'info', l: `≈ ${eur0(payroll() * 0.01)} par an` }, { tab: 'conformite' });
    add(11, 'y5', 'mobilite', 'Versement mobilité', 'Dû dans les zones où une autorité organisatrice des transports l’a instauré ; taux fixé localement.', s.paie.vmTaux ? { s: 'info', l: `Taux ${fmtN(s.paie.vmTaux)} % · ≈ ${eur0(payroll() * s.paie.vmTaux / 100)} par an` } : { s: 'warn', l: 'Taux à renseigner dans Paramètres > Paie' }, { v: 'parametres', sec: 'paie' });
    const fin = [YEAR - 3, YEAR - 2, YEAR - 1].map((x) => s.finances[x]), profit3 = fin.every((f) => f && Number(f.ca) > 0 && Number(f.res) >= Number(f.ca) * 0.01);
    if (st.avg12 < 50) add(11, 'y5', 'partage', 'Dispositif de partage de la valeur (11 à 49 salariés)', 'Obligatoire si le bénéfice net atteint au moins 1 % du chiffre d’affaires 3 années de suite : participation, intéressement, prime de partage de la valeur ou abondement à un plan d’épargne.',
      !fin.every(Boolean) ? { s: 'warn', l: 'Chiffre d’affaires et résultat des 3 dernières années à renseigner' } : !profit3 ? { s: 'na', l: 'Condition de bénéfice non remplie' } : (c.accords.partage || (db.valueShare.years || []).length) ? { s: 'ok', l: (db.valueShare.years || []).length ? 'Prime de partage de la valeur versée' : `Mis en place le ${fmtDate(c.accords.partage)}` } : { s: 'todo', l: 'Dispositif à mettre en place' }, { tab: 'conformite' });
    const oe = oethState(st);
    add(20, 'y5', 'oeth', 'Obligation d’emploi des travailleurs handicapés (6 %)', 'Déclaration annuelle dans la DSN ; contribution pour chaque bénéficiaire manquant.', oe.miss ? { s: 'todo', l: `${oe.have} sur ${oe.due} · contribution estimée ${eur0(oe.contrib)}` } : { s: 'ok', l: `${oe.have} bénéficiaire${oe.have > 1 ? 's' : ''} pour ${oe.due} requis` }, { tab: 'handicap' });
    const cons = c.cse.consult[y] || {}, consDone = ['strategie', 'eco', 'social'].filter((x) => cons[x]).length;
    add(50, 'm12', 'cse50', 'CSE aux attributions élargies', 'Personnalité morale, budgets (fonctionnement 0,20 % et activités sociales), 3 consultations annuelles, BDESE, au moins 6 réunions par an.',
      !cseOn() ? { s: 'todo', l: 'CSE à élire' } : consDone < 3 ? { s: 'todo', l: `${consDone} consultation${consDone > 1 ? 's' : ''} sur 3 en ${y}` } : { s: 'ok', l: `3 consultations faites en ${y}` }, { tab: 'social' });
    const nao = c.cse.nao[y] || {};
    add(50, 'm12', 'nao', 'Délégué syndical et négociations obligatoires', 'Un syndicat représentatif peut désigner un délégué ; négociations annuelles sur la rémunération et sur l’égalité professionnelle et la qualité de vie au travail.',
      !c.cse.ds ? { s: 'info', l: 'Aucun délégué syndical désigné' } : nao.remu && nao.egalite ? { s: 'ok', l: `Négociations ${y} faites` } : { s: 'todo', l: `Négociations ${y} à ouvrir` }, { tab: 'social' });
    const ix = c.index[y];
    add(50, 'now', 'index', 'Index de l’égalité professionnelle', 'Calculé et publié chaque année au plus tard le 1er mars ; mesures de correction sous 75 points.', ix && ix.publishedAt ? { s: 'ok', l: `Publié le ${fmtDate(ix.publishedAt)}${ix.score !== null && ix.score !== undefined ? ` · ${ix.score}/100` : ''}` } : { s: 'todo', l: `Index ${y} à publier avant le 1er mars ${YEAR + (TODAY.slice(5) > '03-01' ? 1 : 0)}` }, { tab: 'index' });
    const riSteps = ['redaction', 'cse', 'greffe', 'inspection', 'affichage'], riDone = riSteps.filter((x) => c.ri[x]).length;
    add(50, 'y5', 'ri', 'Règlement intérieur', 'Hygiène et sécurité, discipline et sanctions, harcèlement, lanceurs d’alerte ; consultation du CSE, dépôt au greffe du conseil de prud’hommes, envoi à l’inspection, affichage.', riDone === 5 ? { s: 'ok', l: `En vigueur depuis le ${fmtDate(c.ri.affichage)}` } : { s: 'todo', l: `${riDone} étape${riDone > 1 ? 's' : ''} sur 5` }, { tab: 'conformite' });
    add(50, 'y5', 'participation', 'Participation aux résultats', 'Accord de participation à conclure dans l’année qui suit l’obligation.', c.accords.participation ? { s: 'ok', l: `Accord conclu le ${fmtDate(c.accords.participation)}` } : { s: 'todo', l: 'Accord à conclure' }, { tab: 'conformite' });
    add(50, 'now', 'alerte', 'Procédure interne des lanceurs d’alerte', 'Canal de signalement confidentiel ; accusé de réception sous 7 jours, retour sous 3 mois.', c.whistleOn ? { s: 'ok', l: `Canal ouvert · ${plural(c.alerts.length, 'signalement', 'signalements')}` } : { s: 'todo', l: 'Canal à ouvrir' }, { tab: 'alerte' });
    add(50, 'now', 'abondement', 'Abondement du CPF', 'Dû si, à l’état des lieux, le salarié n’a pas eu ses entretiens et aucune formation non obligatoire (modalités à vérifier depuis la loi de 2025).',
      bil.filter((b) => b.due <= TODAY && b.pro < 2 && !b.trn).length ? { s: 'todo', l: `${bil.filter((b) => b.due <= TODAY && b.pro < 2 && !b.trn).length} salarié(s) concerné(s)` } : { s: 'ok', l: 'Aucun abondement dû' }, { tab: 'bilans' });
    add(50, 'y5', 'restauration', 'Local de restauration', 'Sous 50 salariés, un emplacement permettant de se restaurer suffit.', c.accords.restauration ? { s: 'ok', l: 'En place' } : { s: 'todo', l: 'À aménager' }, { tab: 'conformite' });
    add(50, 'now', 'penibilite', 'Prévention de la pénibilité', 'Accord ou plan d’action si au moins 25 % des salariés sont exposés à des facteurs de risques professionnels.', c.accords.penibilite === 'accord' ? { s: 'ok', l: 'Accord ou plan d’action en place' } : c.accords.penibilite === 'moins' ? { s: 'ok', l: 'Moins de 25 % de salariés exposés' } : { s: 'warn', l: 'Exposition à évaluer' }, { tab: 'conformite' });
    add(50, 'y5', 'logement', 'Participation à l’effort de construction (PEEC) et FNAL à 0,50 %', 'Cotisations patronales assises sur la masse salariale.', { s: 'info', l: `≈ ${eur0(payroll() * 0.0045)} (PEEC) et ${eur0(payroll() * 0.005)} (FNAL) par an` }, { tab: 'conformite' });
    add(50, 'now', 'pse', 'Plan de sauvegarde de l’emploi', 'Obligatoire pour 10 licenciements économiques ou plus sur 30 jours ; Teamora alerte au lancement d’un départ.', { s: 'info', l: 'Contrôlé dans les départs' }, { v: 'departs' });
    const ref = c.referents;
    add(11, 'm12', 'refcse', 'Référent harcèlement du CSE', 'Désigné par le CSE parmi ses membres.', !cseOn() ? { s: 'na', l: 'Après l’élection du CSE' } : ref.cse && emp(ref.cse) ? { s: 'ok', l: fullName(emp(ref.cse)) } : { s: 'todo', l: 'À désigner' }, { tab: 'conformite' });
    add(250, 'now', 'index5', 'Index égalité à 5 indicateurs', 'Augmentations et promotions mesurées séparément.', { s: 'info', l: 'Appliqué automatiquement au calcul de l’index' }, { tab: 'index' });
    add(250, 'now', 'refemp', 'Référents harcèlement et handicap de l’employeur', 'Un référent harcèlement désigné par l’employeur, en plus de celui du CSE, et un référent handicap.', ref.harcelement && ref.handicap ? { s: 'ok', l: `${fullName(emp(ref.harcelement))} · ${fullName(emp(ref.handicap))}` } : { s: 'todo', l: 'À désigner' }, { tab: 'conformite' });
    add(250, 'y5', 'alternants', '5 % d’alternants', 'Sinon, contribution supplémentaire à l’apprentissage.', altShare() >= 0.05 ? { s: 'ok', l: `${fmtN(altShare() * 100)} % d’alternants` } : { s: 'todo', l: `${fmtN(altShare() * 100)} % d’alternants : contribution supplémentaire due` }, { v: 'recrutement' });
    add(300, 'm12', 'cssct', 'Commissions du CSE (dont CSSCT)', 'Commission santé, sécurité et conditions de travail, et commissions formation, égalité professionnelle, logement.', c.accords.cssct ? { s: 'ok', l: `Mises en place le ${fmtDate(c.accords.cssct)}` } : { s: 'todo', l: 'À mettre en place' }, { tab: 'social' });
    add(300, 'now', 'gepp', 'Gestion des emplois et des parcours professionnels (GEPP)', 'Négociation tous les 3 ans ; s’appuie sur la revue des talents et le plan de succession.', c.accords.gepp ? { s: 'ok', l: `Accord du ${fmtDate(c.accords.gepp)}` } : { s: 'todo', l: 'Négociation à ouvrir' }, { v: 'mobilite' });
    add(1000, 'now', 'rixain', 'Femmes parmi les cadres dirigeants (loi Rixain)', 'Écarts publiés chaque année ; objectif de 40 % à terme.', c.accords.rixain ? { s: 'ok', l: `Publié le ${fmtDate(c.accords.rixain)}` } : { s: 'todo', l: 'Écarts à publier' }, { tab: 'conformite' });
    return o;
  }
  // Ce qui attend les RH, pour « À traiter » et les alertes : obligations en vigueur à traiter, seuils qui approchent, échéances.
  function complianceTodo() {
    if (!db.compliance || ui.profile !== 'rh' || ui.selfOf) return [];
    const out = [], st = effState(), mand = db.compliance.cse.mandate, obl = obligations();
    obl.filter((x) => x.on && x.state.s === 'todo').forEach((x) => out.push({ k: x.k, l: x.title, sub: x.state.l, go: x.go }));
    SEUILS.filter((n) => st.avg12 < n).forEach((n) => { const x = projCross(n, st); if (x) out.push({ k: `seuil${n}`, l: `Seuil de ${n} salariés en ${monthLabel(x.m).toLowerCase()}`, sub: `${x.why} : ${plural(obl.filter((o) => o.seuil === n).length, 'obligation', 'obligations')} à préparer`, go: { tab: 'apercu' } }); });
    if (mand && mand.end >= TODAY && mand.end <= addMonths(TODAY, 6)) out.push({ k: 'mandat', l: 'Fin des mandats du CSE', sub: `Le ${fmtDate(mand.end)} : lancer les élections au moins 90 jours avant`, go: { tab: 'social' } });
    db.compliance.alerts.filter((a) => !a.ackAt && dayDiff(a.date, TODAY) >= 5).forEach((a) => out.push({ k: `al${a.id}`, l: 'Signalement à accuser réception', sub: `Reçu le ${fmtDate(a.date)} · accusé de réception sous 7 jours`, go: { tab: 'alerte' } }));
    return out;
  }
  // Une obligation qui entre en vigueur prévient les RH et la Direction (une seule fois).
  function complianceSync() {
    if (!db.compliance || db.compliance.sim) return; const on = obligations().filter((x) => x.on && x.seuil > 0).map((x) => x.k);
    if (db.compliance.known === null) { db.compliance.known = on; return; }
    on.filter((k) => !db.compliance.known.includes(k)).forEach((k) => { const x = obligations().find((y) => y.k === k); ['e1', DIR_ID()].filter((v, i, a) => emp(v) && a.indexOf(v) === i).forEach((to) => notify(to, `Nouvelle obligation liée à l’effectif : ${x.title}.`)); });
    db.compliance.known = on;
  }
  // ---- Écrans
  const OBL_TABS = [['apercu', 'Effectif et obligations'], ['social', 'Dialogue social'], ['index', 'Index égalité'], ['handicap', 'Handicap (6 %)'], ['bilans', 'États des lieux'], ['alerte', 'Lanceurs d’alerte'], ['conformite', 'Affichages et accords']];
  const PILL_S = { ok: ['ok', 'En place'], todo: ['warn', 'À faire'], warn: ['warn', 'À vérifier'], info: ['neutral', 'Information'], na: ['neutral', 'Non concerné'] };
  const SEUIL_LABEL = (n) => (n ? `${n} salariés` : 'Dès le 1er salarié');
  const RULE_LABEL = { any: 'immédiat', now: 'effectif moyen sur 12 mois', m12: '12 mois consécutifs', y5: '5 années civiles consécutives (loi PACTE)' };
  function viewObligations() {
    const st = effState(), tabs = OBL_TABS.map(([k, l]) => [k, l, k === 'apercu' ? complianceTodo().length : 0]); pickTab('oblTab', tabs);
    const simBar = st.sim ? `<div class="org-warn">${ic('target')}<span>Simulation : effectif de ${fmtN(db.compliance.sim.n)} ${({ recent: 'depuis quelques mois', '1an': 'depuis plus d’un an', '5ans': 'depuis 5 ans et plus' })[db.compliance.sim.since]} — les obligations ne reflètent pas vos données réelles.</span><button type="button" class="btn ghost sm" data-act="obl-sim-off">Arrêter la simulation</button></div>` : '';
    const body = { apercu: oblOverview, social: oblSocial, index: oblIndex, handicap: oblHandicap, bilans: oblBilans, alerte: oblAlerte, conformite: oblConformite }[ui.oblTab](st);
    return `<p class="hint" style="margin:0">Teamora calcule l’effectif à partir des dossiers et adapte les obligations à chaque seuil. Calculs indicatifs, à faire valider par un professionnel du droit social.</p>${simBar}<div class="obl-tabs">${tabsBar('oblTab', tabs)}</div>${body}`;
  }
  const oblGo = (go) => (go.tab ? `data-act="obl-go" data-t="${go.tab}"` : `data-act="obl-view" data-v="${go.v}"${go.sec ? ` data-s="${go.sec}"` : ''}`);
  function oblOverview(st) {
    const list = obligations(), next = SEUILS.find((n) => st.avg12 < n), todo = complianceTodo(), mx = Math.max(...st.months.map((x) => x.v), ...st.proj.map((x) => x.v), next || 0, 1);
    const bar = (x, f) => `<div class="eff-b ${f ? 'f' : ''}" title="${monthLabel(x.m)} : ${fmtN(x.v)}"><i style="height:${Math.max(4, x.v / mx * 100)}%"></i><small>${monthLabel(x.m).slice(0, 3)}</small></div>`;
    // Vue d'ensemble : seulement les paliers qui concernent l'effectif — atteints, ou prévus dans les 12 mois (les onglets restent ouverts pour anticiper).
    const horizon = shiftMonth(monthKey(TODAY), 12), concerned = (n, l) => !n || st.avg12 >= n || l.some((x) => x.on || (x.soon && x.soon.cross && x.soon.m <= horizon));
    const all = [0].concat(SEUILS).map((n) => [n, list.filter((x) => x.seuil === n)]).filter(([, l]) => l.length), groups = all.filter(([n, l]) => concerned(n, l)), later = all.filter(([n, l]) => !concerned(n, l));
    return `<div class="kpis">${[['Effectif moyen (12 mois)', fmtN(st.avg12), 'En équivalent temps plein, hors alternants et stagiaires'], ['Effectif aujourd’hui', fmtN(st.now), `${db.employees.filter(isEmployed).length} personnes présentes`],
        ['Prochain seuil', next ? `${next}` : '—', next ? (projCross(next, st) ? `Prévu en ${monthLabel(projCross(next, st).m).toLowerCase()}` : 'Pas dans les 12 prochains mois') : 'Tous les seuils sont franchis'], ['À traiter', todo.length, 'Obligations en vigueur et échéances']].map(([l, v, s]) => `<div class="card kpi"><span class="l">${l}</span><span class="v num">${v}</span><span class="s">${s}</span></div>`).join('')}</div>
      <div class="two">${card('Évolution de l’effectif', '<span class="muted" style="font-size:13px">12 mois passés · 12 mois prévus</span>', `<div class="card-b"><div class="eff-chart">${st.months.map((x) => bar(x)).join('')}<span class="eff-sep" title="Aujourd’hui"></span>${st.proj.map((x) => bar(x, true)).join('')}</div>
          <p class="hint" style="margin:8px 0 0">Les mois à venir tiennent compte des arrivées et des départs déjà enregistrés.${next ? ` Seuil suivant : ${next} salariés.` : ''}</p>
          <div class="eff-years">${Object.entries(st.years).map(([y, v]) => `<span><b class="num">${v === null ? '—' : fmtN(v)}</b><small>${y}${Number(y) === YEAR ? ' (en cours)' : ''}</small></span>`).join('')}</div>
          <p class="hint" style="margin:6px 0 0">Effectifs des années passées : <button type="button" class="linkish" data-act="obl-view" data-v="parametres" data-s="entreprise">à renseigner dans Paramètres</button> (règle des 5 ans).</p></div>`)}
        ${card('Alertes', '', `<div class="card-b">${todo.length ? todo.map((x) => `<div class="todo"><span class="chk-dot warn"></span><div class="t"><b>${esc(x.l)}</b><small>${esc(x.sub)}</small></div><button type="button" class="btn ghost sm" ${oblGo(x.go)}>Ouvrir</button></div>`).join('') : '<p class="ok-line">Rien à signaler.</p>'}
          <h4 class="sub" style="margin-top:14px">Démo : simuler un effectif</h4><div class="toolbar"><label class="sr" for="obl-sim-n">Effectif simulé</label><input id="obl-sim-n" type="number" min="1" max="5000" class="input num" style="width:96px" value="${db.compliance.sim ? db.compliance.sim.n : ''}" placeholder="ex. 60">
            <label class="sr" for="obl-sim-s">Depuis</label><select id="obl-sim-s" class="select" style="width:auto">${[['recent', 'depuis quelques mois'], ['1an', 'depuis plus d’un an'], ['5ans', 'depuis 5 ans et plus']].map(([k, l]) => `<option value="${k}" ${db.compliance.sim && db.compliance.sim.since === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
            <button type="button" class="btn ghost sm" data-act="obl-sim">Simuler</button></div></div>`)}</div>
      ${groups.map(([n, l]) => { const rs = n ? ruleState('now', n, st) : { on: true }, any = l.some((x) => x.on);
        return `<div class="card obl-g"><div class="card-h"><h3>${n && !any && !rs.on ? `Ce qui arrive à ${n} salariés` : SEUIL_LABEL(n)}</h3><span class="pill ${any ? 'accent' : rs.on ? 'warn' : 'info'}">${n ? (any ? 'Seuil atteint' : rs.on ? 'Seuil atteint · obligations à venir' : 'Seuil prévu dans les 12 mois') : 'Toutes les entreprises'}</span></div><div class="card-b">
          ${l.map((x) => { const [pc, pl] = x.on ? PILL_S[x.state.s] : x.soon ? ['info', `À venir · ${monthLabel(x.soon.m).toLowerCase()}`] : ['neutral', 'Non applicable'];
            return `<div class="todo obl ${x.on ? '' : 'off'}"><div class="t"><b>${esc(x.title)}</b><small>${esc(x.desc)}</small><small class="obl-rule">${n ? `Règle : ${RULE_LABEL[x.rule]} · ${esc(x.txt)}${!x.on && x.soon ? ` · applicable en ${monthLabel(x.soon.m).toLowerCase()} (${esc(x.soon.why)})` : ''}` : ''}${x.on ? ` · ${esc(x.state.l)}` : ''}</small></div><span class="pill ${pc}">${pl}</span><button type="button" class="btn ghost sm" ${oblGo(x.go)}>Ouvrir</button></div>`; }).join('')}</div></div>`; }).join('')}
      ${later.length ? `<p class="hint" style="margin:0">Seuils suivants (${later.map(([n]) => n).join(', ')} salariés) : pas encore concernés. Leurs obligations restent consultables dans les onglets pour prendre de l’avance.</p>` : ''}`;
  }
  const oblNotYet = (seuil, rule, what) => { const r = ruleState(rule, seuil); return r.on ? '' : `<div class="lint warn" style="margin-bottom:12px"><b>${esc(what)} n’est pas encore obligatoire</b><p>${esc(r.txt)}${r.soon ? ` · applicable en ${monthLabel(r.soon.m).toLowerCase()}` : ''}. Tu peux déjà l’utiliser.</p></div>`; };
  const dateIn = (act, val, extra = '', label = 'Date') => `<input type="date" class="input" style="width:auto" value="${esc(val || '')}" data-change="${act}" ${extra} aria-label="${esc(label)}">`;
  function oblSocial(st) {
    const c = db.compliance.cse, m = c.mandate, big = isOn(50, 'm12') || st.avg12 >= 50, y = String(YEAR), el = c.election || {}, n = st.avg12;
    const members = c.members.filter((x) => emp(x.empId)), tit = members.filter((x) => x.role === 'Titulaire'), ym = monthKey(TODAY), hrs = c.hours[ym] || {};
    const meetings = c.meetings.filter((x) => x.date.slice(0, 4) === y), need = n >= 300 ? 12 : n >= 50 ? 6 : 12;
    const people = db.employees.filter((e) => isEmployed(e) && !members.some((x) => x.empId === e.id)).sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
    const STEPS = [['info', 'Information des salariés', 'Tous les 4 ans ; le 1er tour a lieu au plus tard 90 jours après'], ['invitation', 'Invitation des syndicats à négocier le protocole', 'Au moins 15 jours avant la première réunion'], ['protocole', 'Protocole d’accord préélectoral signé', 'Nombre de sièges, listes, modalités du vote'], ['tour1', '1er tour', 'Candidatures réservées aux syndicats'], ['tour2', '2nd tour (si besoin)', 'Dans les 15 jours, candidatures libres'], ['pv', 'Procès-verbaux transmis', 'Au prestataire du ministère, sous 15 jours']];
    const deadline = el.info ? addDays(el.info, 90) : null;
    return `${oblNotYet(11, 'm12', 'Le CSE')}
      <div class="two">${card('Mandat en cours', m ? `<span class="pill ${m.carence ? 'neutral' : cseOn() ? 'ok' : 'bad'}">${m.carence ? 'Carence' : cseOn() ? 'En cours' : 'Expiré'}</span>` : '<span class="pill warn">Aucun CSE</span>', `<div class="card-b">
          ${m ? `<p style="margin:0 0 10px">${m.carence ? 'Procès-verbal de carence établi' : 'CSE élu'} le ${fmtDate(m.start)} · ${m.carence ? 'nouvelle élection à organiser' : 'fin des mandats'} le <b>${fmtDate(m.end)}</b>.</p>` : '<p class="muted" style="margin:0 0 10px">Aucune élection enregistrée.</p>'}
          ${m && !m.carence ? `<h4 class="sub">Élus</h4><div class="set-list">${members.map((x) => `<div class="set-row simple">${avatar(emp(x.empId), 'sm')}<div class="t"><b>${esc(fullName(emp(x.empId)))}</b><small>${x.role} · ${esc(emp(x.empId).title)}</small></div><button type="button" class="btn ghost sm" data-act="cse-del" data-id="${x.empId}">Retirer</button></div>`).join('') || '<p class="muted" style="margin:0">Ajoute les élus titulaires et suppléants.</p>'}</div>
            <div class="toolbar" style="margin-top:8px"><select id="cse-who" class="select" aria-label="Élu"><option value="">Rechercher un salarié…</option>${people.map((e) => `<option value="${e.id}">${esc(fullName(e))}</option>`).join('')}</select><select id="cse-role" class="select" style="width:auto" aria-label="Rôle"><option>Titulaire</option><option>Suppléant</option></select><button type="button" class="btn ghost sm" data-act="cse-add">${ic('plus')}Ajouter</button></div>` : ''}</div>`)}
        ${m && !m.carence && m.end > addMonths(TODAY, 6) && !el.info && !ui.cseElect ? card('Prochaines élections', '', `<div class="card-b"><p style="margin:0">Les mandats prennent fin le <b>${fmtDate(m.end)}</b>. Teamora te préviendra 6 mois avant pour lancer les élections : information des salariés au plus tard le <b>${fmtDate(addDays(m.end, -90))}</b>, pour un 1er tour avant la fin des mandats.</p>
          <div class="toolbar" style="margin-top:12px"><button type="button" class="btn ghost sm" data-act="cse-plan">Préparer les élections maintenant</button></div></div>`) : card('Élections', deadline ? `<span class="muted" style="font-size:13px">1er tour au plus tard le ${fmtDate(deadline)}</span>` : '', `<div class="card-b">${STEPS.map(([k, l, h]) => `<div class="todo"><span class="chk-dot ${el[k] ? 'ok' : ''}"></span><div class="t"><b>${l}</b><small>${h}</small></div>${dateIn('cse-step', el[k], `data-k="${k}"`, l)}</div>`).join('')}
          ${el.tour1 && deadline && el.tour1 > deadline ? '<p class="lint bad" style="margin:8px 0 0">Le 1er tour dépasse le délai de 90 jours après l’information des salariés.</p>' : ''}
          <div class="toolbar" style="margin-top:12px"><button type="button" class="btn primary sm" data-act="cse-result" ${el.tour1 ? '' : 'disabled'}>${ic('check')}Enregistrer le résultat (mandat de 4 ans)</button><button type="button" class="btn ghost sm" data-act="cse-carence" ${el.tour1 ? '' : 'disabled'}>Aucun candidat : procès-verbal de carence</button></div></div>`)}</div>
      <div class="two">${card(`Réunions ${y}`, `<span class="pill ${meetings.length >= Math.round(need * (Number(TODAY.slice(5, 7)) / 12)) ? 'ok' : 'warn'} num">${meetings.length} / ${need} par an</span>`, `<div class="card-b"><div class="req-list">${meetings.slice().reverse().map((x) => `<div class="req"><div class="what"><b>${fmtDate(x.date)} · ${esc(x.kind)}</b><small>${esc(x.agenda)}${x.minutes ? ` · ${esc(x.minutes)}` : ''}</small></div></div>`).join('') || '<div class="empty">Aucune réunion cette année.</div>'}</div>
          <form data-form="cse-meeting" class="form-grid" style="margin-top:10px" novalidate><div class="field"><label for="cm-d">Date</label><input id="cm-d" name="date" type="date" class="input" value="${TODAY}"></div><div class="field"><label for="cm-k">Type</label><select id="cm-k" name="kind" class="select"><option>Réunion ordinaire</option><option>Réunion extraordinaire</option>${big ? '<option>Consultation</option>' : ''}</select></div>
            <div class="field full"><label for="cm-a">Ordre du jour</label><input id="cm-a" name="agenda" class="input" maxlength="200"></div><div class="field full"><label for="cm-m">Compte rendu (facultatif)</label><input id="cm-m" name="minutes" class="input" maxlength="300"></div>
            <div class="toolbar full"><span class="err" id="cm-err"></span><button class="btn ghost sm" style="margin-left:auto">${ic('plus')}Ajouter la réunion</button></div></form>
          <p class="hint" style="margin:8px 0 0">${n >= 300 ? 'Au moins une réunion par mois.' : n >= 50 ? 'Au moins 6 réunions par an, dont 4 sur la santé, la sécurité et les conditions de travail.' : 'Les élus sont reçus au moins une fois par mois.'}</p></div>`)}
        ${card(`Heures de délégation · ${monthLabel(ym).toLowerCase()}`, `<span class="muted" style="font-size:13px">${delegHours(n)} h par titulaire et par mois</span>`, `<div class="card-b">${tit.length ? tit.map((x) => { const u = Number(hrs[x.empId] || 0);
            return `<div class="todo"><div class="t"><b>${esc(fullName(emp(x.empId)))}</b><small>${u} h utilisées sur ${delegHours(n)} h</small></div><input type="number" min="0" step="0.5" class="input num" style="width:80px" value="${u || ''}" data-change="cse-hours" data-id="${x.empId}" aria-label="Heures utilisées"><span class="pill ${u > delegHours(n) ? 'bad' : 'ok'}">${u > delegHours(n) ? 'Dépassement' : 'OK'}</span></div>`; }).join('') : '<p class="muted" style="margin:0">Aucun titulaire.</p>'}
          <p class="hint" style="margin:8px 0 0">Les heures de délégation sont payées comme du temps de travail ; un dépassement doit être justifié par des circonstances exceptionnelles.</p></div>`)}</div>
      ${big ? `<div class="two">${card(`Consultations récurrentes ${y}`, '', `<div class="card-b">${[['strategie', 'Orientations stratégiques'], ['eco', 'Situation économique et financière'], ['social', 'Politique sociale, conditions de travail et emploi']].map(([k, l]) => `<div class="todo"><span class="chk-dot ${(c.consult[y] || {})[k] ? 'ok' : 'warn'}"></span><div class="t"><b>${l}</b><small>Avis du CSE</small></div>${dateIn('cse-consult', (c.consult[y] || {})[k], `data-k="${k}"`, l)}</div>`).join('')}</div>`)}
        ${card('Budgets du CSE', '', `<div class="card-b"><div class="crit-row"><span>Masse salariale brute annuelle</span><b class="num">${eur0(payroll())}</b></div><div class="crit-row"><span>Fonctionnement (${n >= 2000 ? '0,22' : '0,20'} %)</span><b class="num">${eur0(payroll() * (n >= 2000 ? 0.0022 : 0.002))}</b></div>
          <div class="crit-row"><span>Activités sociales et culturelles (<input type="number" min="0" max="10" step="0.1" class="input num" style="width:70px;display:inline-block" value="${c.ascPct}" data-change="cse-asc" aria-label="Taux des activités sociales"> %)</span><b class="num">${eur0(payroll() * c.ascPct / 100)}</b></div>
          <p class="hint" style="margin:8px 0 0">Le taux des activités sociales est fixé par accord ; il ne peut pas baisser d’une année sur l’autre sans accord.</p></div>`)}</div>
      <div class="two">${card('Délégué syndical et négociations', '', `<div class="card-b"><label class="agree"><input type="checkbox" data-change="cse-ds" ${c.ds ? 'checked' : ''}> Un syndicat représentatif a désigné un délégué syndical</label>
          ${c.ds ? [['remu', 'Rémunération, temps de travail, partage de la valeur'], ['egalite', 'Égalité professionnelle et qualité de vie au travail']].map(([k, l]) => `<div class="todo"><span class="chk-dot ${(c.nao[y] || {})[k] ? 'ok' : 'warn'}"></span><div class="t"><b>Négociation ${y} · ${l}</b></div>${dateIn('cse-nao', (c.nao[y] || {})[k], `data-k="${k}"`, l)}</div>`).join('') : '<p class="hint" style="margin:8px 0 0">Sans délégué syndical, des accords peuvent être conclus avec les élus du CSE.</p>'}
          ${n >= 300 ? `<div class="todo"><span class="chk-dot ${db.compliance.accords.cssct ? 'ok' : 'warn'}"></span><div class="t"><b>Commissions du CSE, dont la CSSCT</b><small>Obligatoires à partir de 300 salariés</small></div>${dateIn('obl-accord', db.compliance.accords.cssct, 'data-k="cssct"', 'Commissions')}</div>` : ''}</div>`)}
        ${card('Base de données économiques, sociales et environnementales', '<span class="muted" style="font-size:13px">alimentée par Teamora</span>', `<div class="card-b">${bdese().map(([l, v]) => `<div class="crit-row"><span>${l}</span><b class="num">${v}</b></div>`).join('')}<p class="hint" style="margin:8px 0 0">Mise à disposition des élus ; ${n >= 300 ? 'contenu détaillé à partir de 300 salariés' : 'contenu simplifié sous 300 salariés'}.</p></div>`)}</div>` : ''}`;
  }
  function bdese() {
    const all = db.employees.filter(isEmployed), F = all.filter((e) => e.sex === 'F'), H = all.filter((e) => e.sex === 'H'), avg = (l) => (l.length ? eur0(l.reduce((s, e) => s + e.salary, 0) / l.length) : '—');
    const y = String(YEAR), hires = db.employees.filter((e) => e.startDate.slice(0, 4) === y).length, exits = db.employees.filter((e) => e.exit && e.exit.lastDay && e.exit.lastDay.slice(0, 4) === y).length;
    const absDays = db.leaves.filter((l) => l.status !== 'Refusée' && l.start.slice(0, 4) === y && l.type !== 'Télétravail' && l.type !== 'Congés payés' && l.type !== 'RTT').reduce((s, l) => s + (l.days || 0), 0);
    return [['Effectif (personnes)', all.length], ['Femmes · hommes', `${F.length} · ${H.length}`], ['CDI · CDD · alternants · stagiaires', ['CDI', 'CDD', 'Alternance', 'Stage'].map((k) => all.filter((e) => e.contract === k).length).join(' · ')],
      ['Salaire moyen femmes · hommes', `${avg(F)} · ${avg(H)}`], ['Masse salariale brute', eur0(payroll())], [`Embauches · départs ${y}`, `${hires} · ${exits}`], [`Jours d’absence ${y} (hors congés)`, absDays], [`Heures de formation ${y}`, db.enrollments.filter((x) => x.status === 'Terminée' && x.session.slice(0, 4) === y).reduce((s, x) => s + training(x.trainingId).hours, 0)]];
  }
  function oblIndex(st) {
    const ix = indexState(st), y = String(YEAR), pub = db.compliance.index[y] || {}, big = st.avg12 >= 250;
    return `${oblNotYet(50, 'now', 'L’index de l’égalité professionnelle')}
      <div class="two">${card(`Index ${y} · calcul indicatif`, ix.score === null ? '<span class="pill neutral">Non calculable</span>' : `<span class="pill ${ix.score >= 85 ? 'ok' : ix.score >= 75 ? 'warn' : 'bad'} num">${ix.score} / 100</span>`, `<div class="card-b">
          <div class="table-wrap obl-ix"><table><thead><tr><th>Indicateur</th><th>Résultat</th><th class="r">Points</th></tr></thead><tbody>${ix.ind.map((x) => `<tr><td><b>${esc(x.l)}</b>${x.note ? `<small>${esc(x.note)}</small>` : ''}</td><td>${esc(x.v)}</td><td class="r num">${x.pts === null ? '—' : `${x.pts} / ${x.max}`}</td></tr>`).join('')}</tbody></table></div>
          <p class="hint" style="margin:10px 0 0">${big ? '5 indicateurs (250 salariés et plus).' : '4 indicateurs (50 à 250 salariés).'} Population : ${ix.pop} salariés présents depuis au moins 6 mois, hors alternants et stagiaires. ${ix.score === null ? 'Moins de 75 points calculables : l’index n’est pas calculable cette année, ce qui doit aussi être déclaré.' : ix.score < 75 ? 'Sous 75 points : mesures de correction à définir, à atteindre en 3 ans.' : ix.score < 85 ? 'Sous 85 points : objectifs de progression à publier par indicateur.' : ''} À vérifier sur le simulateur officiel Egapro.</p></div>`)}
        ${card('Publication', pub.publishedAt ? `<span class="pill ok">Publié le ${fmtDate(pub.publishedAt)}</span>` : '<span class="pill warn">À publier</span>', `<div class="card-b"><p style="margin:0 0 10px">Chaque année, au plus tard le <b>1er mars</b> : publication de la note globale sur le site de l’entreprise (ou à défaut aux salariés), communication des résultats au CSE et déclaration sur Egapro.</p>
          <div class="toolbar"><button type="button" class="btn primary sm" data-act="index-pub">${ic('check')}Marquer l’index ${y} comme publié</button></div></div>`)}</div>
      ${card('Écarts de rémunération par catégorie', '', `<div class="card-b">${gapTable(payGap(db.employees))}</div>`)}`;
  }
  function oblHandicap(st) {
    const o = oethState(st), list = rqthActive(), people = db.employees.filter((e) => isEmployed(e) && !list.some((r) => r.empId === e.id)).sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
    return `${oblNotYet(20, 'y5', 'L’obligation d’emploi des travailleurs handicapés')}
      <div class="kpis">${[['Effectif d’assujettissement', fmtN(st.avg12), 'Moyenne des 12 derniers mois'], ['Bénéficiaires requis (6 %)', o.due, 'Arrondi à l’entier inférieur'], ['Bénéficiaires employés', o.have, 'Reconnaissance en cours de validité'], ['Contribution estimée', eur0(o.contrib), o.miss ? `${o.miss} × ${o.rate} fois le SMIC horaire` : 'Obligation remplie']].map(([l, v, s]) => `<div class="card kpi"><span class="l">${l}</span><span class="v num">${v}</span><span class="s">${s}</span></div>`).join('')}</div>
      ${card('Bénéficiaires de l’obligation d’emploi', '<span class="muted" style="font-size:13px">Donnée de santé : visible des seuls RH</span>', `<div class="card-b"><div class="set-list">${list.map((r) => `<div class="set-row simple">${avatar(emp(r.empId), 'sm')}<div class="t"><b>${esc(fullName(emp(r.empId)))}</b><small>Reconnaissance du ${fmtDate(r.from)}${r.to ? ` au ${fmtDate(r.to)}` : ' · sans limite'}</small></div><button type="button" class="btn ghost sm" data-act="rqth-del" data-id="${r.empId}">Retirer</button></div>`).join('') || '<p class="muted" style="margin:0">Aucun bénéficiaire déclaré. La reconnaissance n’est connue que si le salarié choisit de la communiquer.</p>'}</div>
        <form data-form="rqth" class="toolbar" style="margin-top:10px" novalidate><select name="empId" class="select" aria-label="Salarié"><option value="">Rechercher un salarié…</option>${people.map((e) => `<option value="${e.id}">${esc(fullName(e))}</option>`).join('')}</select><label class="sr" for="rq-f">Depuis</label><input id="rq-f" name="from" type="date" class="input" style="width:auto" value="${TODAY}"><label class="sr" for="rq-t">Jusqu’au</label><input id="rq-t" name="to" type="date" class="input" style="width:auto" title="Fin de validité (facultatif)"><button class="btn ghost sm">${ic('plus')}Ajouter</button></form>
        <p class="hint" style="margin:10px 0 0">Déclaration annuelle dans la DSN. L’obligation peut aussi être remplie par des contrats avec des entreprises adaptées ou des ESAT, ou par un accord agréé.</p></div>`)}`;
  }
  function oblBilans() {
    const rows = bilanRows(), big = isOn(50, 'now');
    return `<p class="hint" style="margin:0">Depuis la loi du 24 octobre 2025, l’entretien de parcours professionnel a lieu tous les 4 ans ; tous les 8 ans d’ancienneté, un état des lieux récapitulatif vérifie que le salarié a eu ses entretiens et suivi au moins une formation non obligatoire.${big ? ' À partir de 50 salariés, à défaut, un abondement de son compte personnel de formation est dû (3 000 € jusqu’ici ; montant et conditions à vérifier).' : ''} Liste : états des lieux échus depuis moins d’un an et ceux des 6 prochains mois.</p>
      ${card('États des lieux récapitulatifs', '', `<div class="req-list">${rows.length ? rows.map((b) => { const ok = b.pro >= 2, pen = big && b.pro < 2 && !b.trn;
        return `<div class="req">${avatar(b.e, 'sm')}<div class="what"><b>${esc(fullName(b.e))} · état des lieux du ${fmtDate(b.due)}</b><small>Entrée le ${fmtDate(b.e.startDate)} · entretiens de parcours : ${b.pro} sur 2 · formations suivies : ${b.trn}${pen ? ' · abondement du CPF dû' : ''}</small></div>
          <span class="pill ${b.done ? 'ok' : b.late ? 'bad' : 'warn'}">${b.done ? `Fait le ${fmtShort(b.done)}` : b.late ? 'En retard' : `Dans ${dayDiff(TODAY, b.due)} j`}</span><span class="pill ${ok ? 'ok' : 'warn'}">${ok ? 'Entretiens complets' : 'Entretiens manquants'}</span>${b.done ? '' : `<button type="button" class="btn ghost sm" data-act="bilan-done" data-k="${b.key}">État des lieux fait</button>`}</div>`; }).join('') : '<div class="empty">Aucun état des lieux dans la période.</div>'}</div>`)}`;
  }
  function oblAlerte() {
    const c = db.compliance, list = c.alerts.slice().reverse();
    return `${oblNotYet(50, 'now', 'La procédure interne des lanceurs d’alerte')}
      ${card('Canal de signalement', `<label class="agree"><input type="checkbox" data-change="whistle-on" ${c.whistleOn ? 'checked' : ''}> Canal ouvert aux salariés</label>`, `<div class="card-b"><p style="margin:0">Quand le canal est ouvert, chaque salarié peut signaler, de façon confidentielle et s’il le souhaite anonyme, des faits constituant un crime, un délit ou une violation de la loi, depuis « Échanges RH » dans son espace. Accusé de réception sous <b>7 jours</b>, retour sur les suites données sous <b>3 mois</b>. Le lanceur d’alerte est protégé contre toute mesure de représailles.</p></div>`)}
      ${card('Signalements reçus', '', `<div class="req-list">${list.length ? list.map((a) => { const ackLate = !a.ackAt && dayDiff(a.date, TODAY) > 7, ansLate = !a.answeredAt && dayDiff(a.date, TODAY) > 91;
        return `<div class="req" style="align-items:flex-start"><div class="what"><b>${esc(a.subject)}</b><small>Reçu le ${fmtDate(a.date)} · ${a.empId && emp(a.empId) ? esc(fullName(emp(a.empId))) : 'anonyme'}</small><small>${esc(a.facts)}</small></div>
          ${a.answeredAt ? `<span class="pill ok">Clos le ${fmtShort(a.answeredAt)}</span>` : `<span class="pill ${ackLate || ansLate ? 'bad' : 'warn'}">${a.ackAt ? `Retour avant le ${fmtShort(addDays(a.date, 91))}` : `Accusé avant le ${fmtShort(addDays(a.date, 7))}`}</span>${a.ackAt ? `<button type="button" class="btn ghost sm" data-act="alert-close" data-id="${a.id}">Clore avec retour</button>` : `<button type="button" class="btn primary sm" data-act="alert-ack" data-id="${a.id}">Accuser réception</button>`}`}</div>`; }).join('') : '<div class="empty">Aucun signalement.</div>'}</div>`)}`;
  }
  function oblConformite(st) {
    const c = db.compliance, ref = c.referents, people = db.employees.filter(isEmployed).sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr')), mem = c.cse.members.filter((x) => emp(x.empId)).map((x) => emp(x.empId));
    const pick = (k, list, cur) => `<select class="select" style="width:240px" data-change="obl-ref" data-k="${k}" aria-label="Référent"><option value="">Rechercher un salarié…</option>${list.map((e) => `<option value="${e.id}" ${e.id === cur ? 'selected' : ''}>${esc(fullName(e))}</option>`).join('')}</select>`;
    const row = (on, l, h, ctl) => `<div class="todo ${on ? '' : 'off'}"><div class="t"><b>${l}</b><small>${h}</small></div>${ctl}</div>`;
    const fin = db.settings.finances;
    return `<div class="two">${card('Affichages obligatoires', `<span class="muted num" style="font-size:13px">${DISPLAYS.filter(([k]) => c.displays[k]).length} / ${DISPLAYS.length}</span>`, `<div class="card-b">${DISPLAYS.map(([k, l]) => `<label class="agree"><input type="checkbox" data-change="obl-disp" data-k="${k}" ${c.displays[k] ? 'checked' : ''}> ${l}${c.displays[k] ? ` <small class="muted">· depuis le ${fmtDate(c.displays[k])}</small>` : ''}</label>`).join('')}<p class="hint" style="margin:8px 0 0">Sur un panneau accessible ou par tout moyen (intranet, e-mail).</p></div>`)}
      ${card('Règlement intérieur', isOn(50, 'y5') ? '<span class="pill accent">Obligatoire</span>' : '<span class="pill neutral">À partir de 50 salariés</span>', `<div class="card-b">${[['redaction', 'Rédaction', 'Hygiène et sécurité, discipline et échelle des sanctions, harcèlement, lanceurs d’alerte'], ['cse', 'Avis du CSE', 'Consultation obligatoire'], ['greffe', 'Dépôt au greffe du conseil de prud’hommes', ''], ['inspection', 'Envoi à l’inspection du travail', 'En deux exemplaires, avec l’avis du CSE'], ['affichage', 'Affichage et entrée en vigueur', 'Au moins un mois après le dépôt']].map(([k, l, h]) => row(true, l, h, dateIn('obl-ri', c.ri[k], `data-k="${k}"`, l))).join('')}
        <div class="toolbar" style="margin-top:8px"><button type="button" class="btn ghost sm" data-act="obl-view" data-v="modeles">Modèles de documents</button></div></div>`)}</div>
      <div class="two">${card('Accords et dispositifs', '', `<div class="card-b">
        ${row(isOn(50, 'y5'), 'Accord de participation', 'Obligatoire à partir de 50 salariés (5 ans)', dateIn('obl-accord', c.accords.participation, 'data-k="participation"', 'Participation'))}
        ${row(st.avg12 >= 11 && st.avg12 < 50, 'Dispositif de partage de la valeur (11 à 49 salariés)', `Si le bénéfice atteint 1 % du chiffre d’affaires 3 ans de suite${(db.valueShare.years || []).length ? ' · prime de partage de la valeur déjà versée (voir Rémunération)' : ''}`, dateIn('obl-accord', c.accords.partage, 'data-k="partage"', 'Partage de la valeur'))}
        ${row(isOn(50, 'y5'), 'Local de restauration', 'À partir de 50 salariés', `<input type="checkbox" data-change="obl-flag" data-k="restauration" ${c.accords.restauration ? 'checked' : ''} aria-label="Local de restauration">`)}
        ${row(isOn(50, 'now'), 'Pénibilité', 'Accord ou plan d’action si 25 % des salariés sont exposés', `<select class="select" style="width:auto" data-change="obl-pen" aria-label="Pénibilité"><option value="">À évaluer</option><option value="moins" ${c.accords.penibilite === 'moins' ? 'selected' : ''}>Moins de 25 % exposés</option><option value="accord" ${c.accords.penibilite === 'accord' ? 'selected' : ''}>Accord ou plan en place</option></select>`)}
        ${row(st.avg12 >= 300, 'Accord de gestion des emplois et des parcours (GEPP)', 'À partir de 300 salariés, tous les 3 ans', dateIn('obl-accord', c.accords.gepp, 'data-k="gepp"', 'GEPP'))}
        ${row(st.avg12 >= 1000, 'Publication des écarts parmi les cadres dirigeants (loi Rixain)', 'À partir de 1 000 salariés', dateIn('obl-accord', c.accords.rixain, 'data-k="rixain"', 'Rixain'))}</div>`)}
      ${card('Référents', '', `<div class="card-b">
        ${row(cseOn(), 'Référent harcèlement du CSE', 'Désigné par le CSE parmi ses membres', pick('cse', mem, ref.cse))}
        ${row(st.avg12 >= 250, 'Référent harcèlement de l’employeur', 'À partir de 250 salariés', pick('harcelement', people, ref.harcelement))}
        ${row(st.avg12 >= 250, 'Référent handicap', 'À partir de 250 salariés', pick('handicap', people, ref.handicap))}</div>`)}</div>
      ${card('Contributions liées à l’effectif', '<span class="muted" style="font-size:13px">estimations sur la masse salariale annuelle</span>', `<div class="card-b">
        ${[[`Formation professionnelle (${isOn(11, 'y5') ? '1' : '0,55'} %)`, payroll() * (isOn(11, 'y5') ? 0.01 : 0.0055)], [`FNAL (${isOn(50, 'y5') ? '0,50 % sur tout le salaire' : '0,10 % dans la limite du plafond'})`, isOn(50, 'y5') ? payroll() * 0.005 : db.employees.filter(isEmployed).reduce((s, e) => s + Math.min(e.salary, PASS_Y), 0) * 0.001],
          ['Participation à l’effort de construction (0,45 %)', isOn(50, 'y5') ? payroll() * 0.0045 : 0], [`Versement mobilité (${fmtN(db.settings.paie.vmTaux || 0)} %)`, isOn(11, 'y5') ? payroll() * (db.settings.paie.vmTaux || 0) / 100 : 0]].map(([l, v]) => `<div class="crit-row"><span>${l}</span><b class="num">${v ? eur0(v) : 'Non dû'}</b></div>`).join('')}
        <p class="hint" style="margin:8px 0 0">Ces montants sont des estimations : ils sont transmis à votre prestataire de paie (${esc(PROVIDER)}), qui les calcule sur les bulletins.${Object.keys(fin).length ? '' : ' Chiffre d’affaires et résultat à renseigner dans Paramètres > Entreprise pour le partage de la valeur.'}</p></div>`)}`;
  }
  Object.assign(MOD_ACT, {
    'obl-go'(d) { if (d.t === 'besoins') { Object.assign(ui, { modal: null, view: 'besoins', stage: null }); window.scrollTo(0, 0); render(); return; } if (d.t === 'param') { Object.assign(ui, { modal: null, view: 'parametres', stage: null, setSec: 'convention' }); window.scrollTo(0, 0); render(); return; } ui.oblTab = d.t; ui.modal = null; if (ui.view !== 'obligations') { ui.view = 'obligations'; ui.stage = null; } window.scrollTo(0, 0); render(); },
    'obl-view'(d) { ui.modal = null; if (d.s) ui.setSec = d.s; if (d.v === 'parametres' || d.v === 'modeles' || d.v === 'reporting' || d.v === 'obligations') { ACT.go({ v: d.v }); return; } const i = visibleStages().find((x) => stageView(x) === d.v); if (i !== undefined) ACT.stage({ i }); else ACT.go({ v: 'accueil' }); },
    'obl-sim'() { const n = Number((document.getElementById('obl-sim-n') || {}).value), since = (document.getElementById('obl-sim-s') || {}).value || '5ans'; if (!(n >= 1)) { toast('Indique un effectif à simuler.', 'info'); return; } db.compliance.sim = { n, since }; toast(`Simulation : ${n} salariés`); save(); render(); },
    'obl-sim-off'() { db.compliance.sim = null; toast('Simulation arrêtée'); save(); render(); },
    'cse-add'() { const id = (document.getElementById('cse-who') || {}).value, role = (document.getElementById('cse-role') || {}).value; if (!emp(id)) { toast('Choisis un salarié.', 'info'); return; } const m = db.compliance.cse.mandate; db.compliance.cse.members.push({ empId: id, role, from: m.start, to: m.end }); notify(id, `Tu es élu·e ${role.toLowerCase()} au CSE jusqu’au ${fmtDate(m.end)}.`); toast(`${fullName(emp(id))} : ${role.toLowerCase()}`); commit(); },
    'cse-plan'() { ui.cseElect = true; render(); },
    'cse-del'(d) { db.compliance.cse.members = db.compliance.cse.members.filter((x) => x.empId !== d.id); commit(); },
    'cse-result'() { const el = db.compliance.cse.election; db.compliance.cse.mandate = { start: el.tour2 || el.tour1, end: addDays(addMonths(el.tour2 || el.tour1, 48), -1), carence: false }; db.compliance.cse.election = {}; db.compliance.cse.members = []; toast('CSE élu pour 4 ans : ajoute les élus'); commit(); },
    'cse-carence'() { const el = db.compliance.cse.election; db.compliance.cse.mandate = { start: el.tour1, end: addDays(addMonths(el.tour1, 48), -1), carence: true }; db.compliance.cse.election = {}; toast('Procès-verbal de carence enregistré (à transmettre et afficher)'); commit(); },
    'index-pub'() { const y = String(YEAR), ix = indexState(); db.compliance.index[y] = { publishedAt: TODAY, score: ix.score }; toast(`Index ${y} publié${ix.score !== null ? ` : ${ix.score}/100` : ' (non calculable)'}`); commit(); },
    'rqth-del'(d) { db.compliance.rqth = db.compliance.rqth.filter((r) => r.empId !== d.id); commit(); },
    'bilan-done'(d) { db.compliance.bilans[d.k] = TODAY; toast('État des lieux enregistré'); commit(); },
    'alert-ack'(d) { const a = db.compliance.alerts.find((x) => x.id === d.id); a.ackAt = TODAY; if (a.empId) notify(a.empId, 'Ton signalement a bien été reçu ; un retour te sera fait sous 3 mois.'); toast('Accusé de réception enregistré'); commit(); },
    'alert-close'(d) { const a = db.compliance.alerts.find((x) => x.id === d.id); a.answeredAt = TODAY; if (a.empId) notify(a.empId, 'Les suites données à ton signalement t’ont été communiquées ; il est clos.'); toast('Signalement clos'); commit(); },
    'todo-obl'(d) { ui.modal = null; ACT['obl-go']({ t: d.t }); },
  });
  Object.assign(MOD_CHG, {
    'cse-step'(v, d) { db.compliance.cse.election[d.k] = v || null; commit(); },
    'cse-hours'(v, d) { const ym = monthKey(TODAY); db.compliance.cse.hours[ym] = Object.assign({}, db.compliance.cse.hours[ym], { [d.id]: Number(v) || 0 }); commit(); },
    'cse-consult'(v, d) { const y = String(YEAR); db.compliance.cse.consult[y] = Object.assign({}, db.compliance.cse.consult[y], { [d.k]: v || null }); commit(); },
    'cse-nao'(v, d) { const y = String(YEAR); db.compliance.cse.nao[y] = Object.assign({}, db.compliance.cse.nao[y], { [d.k]: v || null }); commit(); },
    'cse-ds'(v, d, t) { db.compliance.cse.ds = t.checked; commit(); },
    'cse-asc'(v) { db.compliance.cse.ascPct = Math.max(0, Number(v) || 0); commit(); },
    'obl-disp'(v, d, t) { db.compliance.displays[d.k] = t.checked ? TODAY : null; commit(); },
    'obl-ri'(v, d) { db.compliance.ri[d.k] = v || null; commit(); },
    'obl-accord'(v, d) { db.compliance.accords[d.k] = v || null; commit(); },
    'obl-flag'(v, d, t) { db.compliance.accords[d.k] = t.checked ? TODAY : null; commit(); },
    'obl-pen'(v) { db.compliance.accords.penibilite = v || null; commit(); },
    'obl-ref'(v, d) { db.compliance.referents[d.k] = v || null; if (v) notify(v, 'Tu es désigné·e référent·e dans Teamora.'); commit(); },
    'whistle-on'(v, d, t) { db.compliance.whistleOn = t.checked; toast(t.checked ? 'Canal de signalement ouvert aux salariés' : 'Canal fermé'); commit(); },
  });
  Object.assign(MOD_FORMS, {
    'cse-meeting'(v) { if (!v.date || !v.agenda.trim()) { document.getElementById('cm-err').textContent = 'Indique la date et l’ordre du jour.'; return; } db.compliance.cse.meetings.push({ id: uid('m'), date: v.date, kind: v.kind, agenda: v.agenda.trim(), minutes: (v.minutes || '').trim() }); toast('Réunion enregistrée'); commit(); },
    rqth(v) { if (!emp(v.empId)) { toast('Choisis un salarié.', 'info'); return; } db.compliance.rqth.push({ empId: v.empId, from: v.from || TODAY, to: v.to || null }); toast('Bénéficiaire ajouté'); commit(); },
    whistle(v, form) { const err = form.querySelector('.err'); if (!v.subject.trim() || v.facts.trim().length < 20) { err.textContent = 'Indique l’objet et décris les faits (20 caractères au moins).'; return; }
      db.compliance.alerts.push({ id: uid('a'), date: TODAY, empId: v.anonymous ? null : me().id, subject: v.subject.trim(), facts: v.facts.trim(), ackAt: null, answeredAt: null });
      notify('e1', 'Nouveau signalement reçu par le canal des lanceurs d’alerte : accusé de réception sous 7 jours.'); toast('Signalement transmis de façon confidentielle'); commit(); },
  });
  // Formulaire de signalement dans l'espace salarié (Échanges RH), quand le canal est ouvert.
  const whistleCard = () => (db.compliance && db.compliance.whistleOn ? `<form class="card" data-form="whistle" novalidate><div class="card-h"><h3>Signaler une alerte (lanceur d’alerte)</h3><span class="muted" style="font-size:13px">Confidentiel · protégé contre les représailles</span></div><div class="card-b"><div class="form-grid">
      <div class="field full"><label for="wb-s">Objet</label><input id="wb-s" name="subject" class="input" maxlength="120" placeholder="Ex. non-respect des règles de sécurité"></div><div class="field full"><label for="wb-f">Faits</label><textarea id="wb-f" name="facts" class="input" maxlength="2000" placeholder="Ce qui s’est passé, quand, où, les personnes concernées"></textarea></div></div>
      <label class="agree" style="margin-top:8px"><input type="checkbox" name="anonymous"> Rester anonyme</label><div class="toolbar" style="margin-top:12px"><span class="err"></span><button class="btn primary" style="margin-left:auto">Envoyer le signalement</button></div></div></form>` : '');
  // Plan de sauvegarde de l'emploi : licenciements économiques notifiés sur 30 jours glissants.
  function pseHint(e) {
    const st = effState(), n = db.employees.filter((x) => x.id !== e.id && x.exit && x.exit.reason === 'Licenciement économique' && offb(x).notifiedAt && dayDiff(offb(x).notifiedAt, TODAY) <= 30).length + 1;
    if (n >= 10 && st.avg12 >= 50) return ` ${n} licenciements économiques sur 30 jours dans une entreprise d’au moins 50 salariés : un plan de sauvegarde de l’emploi est obligatoire.`;
    if (n >= 2) return ` ${n} licenciements économiques sur 30 jours : consultation préalable du CSE et information de la DREETS.`;
    return '';
  }
  // ---- V2 · liste « À traiter » et nouveautés de la version
  MODALS.todo = (m, shell) => { const items = todoItems(), comp = complianceTodo();
    const compHtml = comp.length ? `<div class="todo-sec"><div class="todo-sec-h"><span class="stage-dot" style="background:#475569">${ic('docCheck')}</span><b>Obligations selon l’effectif</b><span class="pill warn num">${comp.length}</span><button type="button" class="btn ghost sm" data-act="todo-obl" data-t="apercu">Ouvrir${ic('arrow')}</button></div>
      <ul class="todo-people">${comp.map((x) => `<li><button type="button" class="linkish" ${x.go.tab ? `data-act="todo-obl" data-t="${x.go.tab}"` : `data-act="obl-view" data-v="${x.go.v}"`}>${esc(x.l)}</button> · ${esc(x.sub)}</li>`).join('')}</ul></div>` : '';
    return shell('À traiter', `<div class="modal-b">${compHtml}${items.length || comp.length ? items.map((x) => `<div class="todo-sec"><div class="todo-sec-h"><span class="stage-dot" style="background:${STAGE_COLORS[x.i]}">${ic(stageDef(x.i).icon)}</span><b>${esc(x.name)}</b><span class="badge-dot">${x.n}</span>
        <button type="button" class="btn ghost sm" data-act="todo-go" data-i="${x.i}">Ouvrir${ic('arrow')}</button></div>
        ${x.people.length ? `<ul class="todo-people">${x.people.map(([e, acts]) => `<li><button type="button" class="linkish" data-act="todo-person" data-id="${e.id}">${esc(fullName(e))}</button> · ${esc(acts.join(', '))}</li>`).join('')}</ul>` : ''}</div>`).join('')
      : '<p class="muted" style="margin:0">Rien ne t’attend pour le moment.</p>'}</div>`, '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>'); };
  const V2_NEWS = [
    ['Organisation', [['Arrivées et Départs regroupés', 'Pré-embauche, embauche et intégration forment un seul dossier par recrue, en onglets ; idem pour les trois temps du départ. La roue passe de 16 à 12 rubriques.', 'arrivees'],
      ['Liste « À traiter »', 'Un bouton en haut rassemble tout ce qui t’attend, rubrique par rubrique et personne par personne.', null],
      ['Teamo, l’assistant', 'Bouton « Teamo » en bas à droite : pose tes questions sur l’utilisation de Teamora ; Teamo (propulsé par Claude) tient compte de l’écran ouvert et propose un lien vers la bonne rubrique. Disponible sur la page publiée.', null],
      ['Paramètres de l’entreprise', 'Pictogramme engrenage (RH) : identité et logo, convention collective (recherche parmi toutes les conventions par nom ou IDCC, règles à saisir hors Syntec), temps de travail, sites, services et Direction, import des collaborateurs (CSV), administrateurs et droits, absences, paie, recrutement. Garde-fous légaux et historique des modifications.', 'parametres'],
      ['Installation d’une nouvelle entreprise', 'En bas de page, « Tester l’installation » ouvre une entreprise vierge et son assistant de démarrage en 8 étapes ; la démo Nova Studio reste disponible.', null],
      ['Barre du haut allégée', 'Modèles et Reporting restent dans le bandeau de gauche ; la barre du haut garde le profil, l’espace, « À traiter » et les notifications.', null]]],
    ['Arrivée', [['Statuts réels', '« Arrivée le … », « Essai jusqu’au … », « En intégration », « En poste », « Départ le … · motif » remplacent les libellés génériques.', 'collaborateurs'],
      ['Stagiaires', 'Convention de stage tripartite au lieu de la DPAE et du contrat de travail, tuteur, gratification, pas de période d’essai.', 'arrivees'],
      ['Période d’essai d’un CDD', '1 jour par semaine de contrat, 2 semaines au plus pour 6 mois ou moins, 1 mois au-delà.', 'arrivees'],
      ['Fin d’intégration', 'La période d’essai (juridique) et l’intégration (managériale) se terminent séparément : un bilan clôt l’intégration, même sans période d’essai.', 'arrivees']]],
    ['Vie dans l’entreprise', [['Changement de situation', 'Poste, service, manager, salaire et temps de travail se modifient en une fois, avec date d’effet, avenant et historique.', 'collaborateurs'],
      ['Temps partiel', 'Quotité de travail sur la fiche, prise en compte dans la paie.', 'collaborateurs'],
      ['Absences légales', 'Maternité, paternité et accueil de l’enfant, événements familiaux, enfant malade, accident du travail, congé parental ; le télétravail devient un mode de travail, plus une absence.', 'absences'],
      ['Direction et remplaçant', 'Claire Durand (Direction) valide pour les managers et les RH ; quand un manager est absent, son propre manager peut valider à sa place.', 'absences'],
      ['Liens entre modules', 'Depuis un entretien : proposer une formation ou noter un souhait de mobilité. Les arrêts longs déclenchent la visite de reprise.', 'entretiens'],
      ['Journal des actions', 'Chaque fiche garde la trace de qui a fait quoi et quand.', 'collaborateurs']]],
    ['Départ', [['Motifs complets', 'Licenciement économique, mise à la retraite, fin d’apprentissage ou de stage, prise d’acte, présomption de démission, décès…', 'departs'],
      ['Sortie dans la paie', 'Indemnité compensatrice de congés payés et indemnités de rupture remontent dans les variables du mois de sortie.', 'paie']]],
  ];
  // V3 : le logiciel s'adapte à la taille de l'entreprise.
  const V3_NEWS = [['Effectif et seuils', [['Calcul de l’effectif', 'Moyenne des 12 derniers mois en équivalent temps plein, hors alternants et stagiaires, à partir des dossiers ; historique des années passées pour la règle des 5 ans ; projection à 12 mois avec les arrivées et départs prévus.', 'apercu'],
      ['Obligations selon l’effectif', 'Pictogramme dans le bandeau (RH) : chaque obligation avec son seuil, sa règle de franchissement (immédiat, 12 mois consécutifs, 5 ans), son état et l’écran où la traiter.', 'apercu'],
      ['Alertes', 'Seuil qui approche, obligation qui entre en vigueur (notification aux RH et à la Direction), échéances : elles arrivent dans « À traiter ».', 'apercu'],
      ['Simulation', 'Pour la démo : simuler un effectif (60, 300, 1 200…) et voir le logiciel s’adapter.', 'apercu']]],
    ['Sur téléphone', [['Espace salarié mobile', 'Sur téléphone, le salarié retrouve l’essentiel : absences et heures, bulletins, profil, documents et annuaire, échanges RH et alerte, baromètre, visites médicales, accidents ; la nouvelle recrue dépose ses pièces en photo. Entretiens, formations et contrat s’y consultent ; le reste et la gestion RH ou manager restent sur ordinateur.', '']]],
    ['Recrutement', [['Rédaction partagée de l’offre', 'Le manager qui a émis le besoin et les RH rédigent ensemble l’offre ; le manager l’envoie aux RH, qui seuls la valident et la publient.', 'besoins']]],
    ['Paramètres', [['Toutes les conventions collectives', 'Recherche parmi 673 conventions par nom ou numéro IDCC (Paramètres > Convention). Hors Syntec, les minima du Code du travail s’appliquent jusqu’à la saisie des règles de la convention (essai, préavis, maintien de salaire).', 'param']]],
    ['Nouveaux écrans', [['Dialogue social', 'Élections du CSE pas à pas (délais légaux, carence), élus, réunions, heures de délégation ; à 50 : consultations, budgets, BDESE, délégué syndical et négociations ; à 300 : commissions.', 'social'],
      ['Index égalité', 'Calcul indicatif à 4 ou 5 indicateurs selon l’effectif, publication avant le 1er mars.', 'index'],
      ['Travailleurs handicapés', 'Taux d’emploi, bénéficiaires (données réservées aux RH), contribution estimée.', 'handicap'],
      ['États des lieux à 8 ans', 'Entretiens de parcours et formations suivis, abondement du CPF à partir de 50 salariés.', 'bilans'],
      ['Lanceurs d’alerte', 'Canal confidentiel (anonyme possible) dans l’espace salarié, délais de 7 jours et 3 mois.', 'alerte'],
      ['Affichages, accords et référents', 'Affichages obligatoires, règlement intérieur, participation, partage de la valeur, pénibilité, référents, contributions liées à l’effectif.', 'conformite']]]];
  MODALS['v3-news'] = (m, shell) => shell('Nouveautés de la V3', `<div class="modal-b"><p class="hint" style="margin:0 0 14px">La V3 adapte Teamora à la taille de l’entreprise : les obligations apparaissent quand l’effectif franchit un seuil, et des alertes préviennent avant. La V2 reste disponible telle quelle.</p>
    ${V3_NEWS.map(([g, list]) => `<h4 class="sub">${g}</h4><ul class="news">${list.map(([t, d, v]) => `<li><div><b>${t}</b><small>${d}</small></div>${v && ui.profile === 'rh' && !ui.selfOf ? `<button type="button" class="btn ghost sm" data-act="obl-go" data-t="${v}">Voir${ic('arrow')}</button>` : ''}</li>`).join('')}</ul>`).join('')}</div>`,
    '<div class="modal-f"><button type="button" class="btn ghost" data-act="v2-news">Nouveautés de la V2</button><button type="button" class="btn primary" data-act="modal-close">C’est parti</button></div>', true);
  MODALS['v2-news'] = (m, shell) => shell('Nouveautés de la V2', `<div class="modal-b"><p class="hint" style="margin:0 0 14px">Cette version applique les recommandations de l’audit RH. La V1 reste disponible à son adresse d’origine.</p>
    ${V2_NEWS.map(([g, list]) => `<h4 class="sub">${g}</h4><ul class="news">${list.map(([t, d, v]) => `<li><div><b>${t}</b><small>${d}</small></div>${v ? `<button type="button" class="btn ghost sm" data-act="news-go" data-v="${v}">Voir</button>` : ''}</li>`).join('')}</ul>`).join('')}</div>`,
    '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">C’est parti</button></div>', true);
  Object.assign(MOD_ACT, {
    'todo-open'() { ui.modal = { type: 'todo' }; ui.notif = false; render(); },
    'todo-go'(d) { ui.modal = null; ACT.stage(d); },
    'todo-person'(d) { ui.modal = null; ACT['open-dossier'](d); },
    'v2-news'() { ui.modal = { type: 'v2-news' }; render(); },
    'v3-news'() { ui.modal = { type: 'v3-news' }; render(); },
    'news-go'(d) { ui.modal = null; if (d.v === 'parametres') { if (ui.profile !== 'rh') { toast('Les paramètres sont réservés aux RH.', 'info'); render(); return; } ACT.go({ v: 'parametres' }); return; } const i = visibleStages().find((k) => stageView(k) === d.v); if (i === undefined) { toast('Rubrique non disponible pour ce profil.', 'info'); render(); return; } ACT.stage({ i }); },
  });
  // ================================================================ V2 · Arrivées et Départs : un dossier unique par personne
  const PROC = {
    arrivees: { node: 2, title: 'Arrivées', icon: 'docCheck', label: 'ARRIVÉE DES COLLABORATEURS', phases: [[2, 'Pré-embauche'], [3, 'Embauche'], [4, 'Intégration']] },
    departs: { node: 13, title: 'Départs', icon: 'door', label: 'DÉPART DES COLLABORATEURS', phases: [[13, 'Préparation'], [14, 'Formalités de sortie'], [15, 'Après le départ']] },
  };
  // Nom et pictogramme d'une rubrique de la roue : les deux dossiers regroupés prennent leur propre nom pour les RH et les managers.
  function stageDef(i) {
    const k = ui.profile !== 'salarie' && (i === 2 ? 'arrivees' : i === 13 ? 'departs' : null);
    return k ? Object.assign({}, STAGES[i], { short: PROC[k].title, title: PROC[k].title, icon: PROC[k].icon }) : STAGES[i];
  }
  const procOf = (e) => (e.stage >= 2 && e.stage <= 4 ? 'arrivees' : e.stage >= 13 ? 'departs' : null);
  const procPeople = (k) => scopeEmployees().filter((e) => procOf(e) === k && (k === 'arrivees' || ui.profile === 'rh' || e.stage < 15));
  // Phase en cours : pré-embauche et embauche avancent en parallèle (la recrue est à l'étape 2 pour les deux).
  const curPhases = (e) => (inArrival(e) ? [2, 3] : [e.stage]);
  const phaseOpen = (e, i) => (procOf(e) === 'arrivees' ? (i === 4 ? e.stage === 4 : true) : i <= e.stage);
  // Un temps déjà franchi est complet ; le temps en cours suit le dossier ; un temps à venir est vide.
  const phaseSteps = (e, i) => (curPhases(e).includes(i) ? journeyOf(e.id, i) : i < Math.min(...curPhases(e)) ? stageSteps(i).map(() => true) : stageSteps(i).map(() => false));
  function procActions(e) {
    if (procOf(e) === 'arrivees') return e.stage === 4 ? arrivalActions(e, 4) : arrivalActions(e, 2).concat(arrivalActions(e, 3));
    return departActions(e);
  }
  function procRow(e, k) {
    const sel = ui.procSel === e.id, todo = procActions(e);
    const bars = PROC[k].phases.map(([i, l]) => { const s = phaseSteps(e, i), n = s.filter(Boolean).length, cur = curPhases(e).includes(i);
      return `<span class="ph ${cur ? 'cur' : ''} ${n === s.length && s.length ? 'done' : ''}" title="${esc(l)} : ${n}/${s.length}"><i style="width:${s.length ? (n / s.length) * 100 : 0}%"></i></span>`; }).join('');
    return `<button type="button" class="proc-row" data-act="proc-sel" data-id="${e.id}" aria-pressed="${sel}">${avatar(e)}<span class="who"><b>${esc(fullName(e))}</b><small>${esc(e.title)} · ${statusOf(e)[0]}</small><span class="phs">${bars}</span></span>${todo.length ? `<span class="badge-dot" title="${esc(todo.join(', '))}">${todo.length}</span>` : ''}</button>`;
  }
  function procDossier(e, k) {
    const rh = ui.profile === 'rh', phases = PROC[k].phases;
    const cur = curPhases(e), ph = phases.some(([i]) => i === ui.procPhase) && phaseOpen(e, ui.procPhase) ? ui.procPhase : (k === 'arrivees' && e.stage === 2 && arrivalSteps(e, 2).every(Boolean) ? 3 : cur[0]);
    const tabs = phases.map(([i, l]) => { const s = phaseSteps(e, i), n = s.filter(Boolean).length, open = phaseOpen(e, i), done = s.length && n === s.length;
      return `<button type="button" role="tab" aria-selected="${ph === i}" data-act="proc-phase" data-i="${i}" ${open ? '' : 'disabled title="Pas encore commencé"'}>${done ? ic('check') : ''}${l}<span class="count num">${n}/${s.length}</span></button>`; }).join('');
    const steps = phaseSteps(e, ph), arrival = k === 'arrivees';
    const next = rh && !arrival && (ph === 13 || ph === 14) && e.stage === ph ? `<button type="button" class="btn ${steps.every(Boolean) ? 'primary' : 'ghost'} sm" data-act="advance" data-id="${e.id}">Passer aux « ${esc(phases.find(([i]) => i === ph + 1)[1].toLowerCase())} »${ic('arrow')}</button>` : '';
    const hint = arrival && ph !== 4 ? `<p class="hint" style="margin:10px 0 0">La pré-embauche et l’embauche avancent en parallèle. ${esc(e.firstName)} passe en intégration quand les deux sont terminées et le contrat signé.</p>` : '';
    return `<div class="card proc-dossier"><div class="proc-head">${avatar(e, 'lg')}<div style="flex:1;min-width:0"><h2>${esc(fullName(e))}</h2><p>${esc(e.title)} · ${esc(e.dept)} · ${statusPill(e)}</p></div>
        <button type="button" class="btn ghost sm" data-act="open-emp" data-id="${e.id}">Ouvrir la fiche</button></div>
      <div class="tabs proc-tabs" role="tablist" aria-label="Temps du dossier">${tabs}</div>
      <div class="card-b">${stepsList(steps, stageSteps(ph), false)}${arrival ? arrivalDossier(e, ph) : departDossier(e, ph)}${next ? `<div class="toolbar" style="margin-top:16px">${next}</div>` : ''}${hint}</div></div>`;
  }
  function viewProc(k) {
    const P = PROC[k], rh = ui.profile === 'rh', all = procPeople(k), c = STAGE_COLORS[P.node];
    const tabs = k === 'arrivees' ? [['cours', 'Recrues', all.length]].concat(rh ? [['programme', 'Programme d’intégration']] : [])
      : [['cours', 'En cours', all.filter((e) => e.stage < 15).length]].concat(rh ? [['apres', 'Après le départ', all.filter((e) => e.stage === 15).length], ['stats', 'Analyse des départs']] : []);
    const tab = tabs.some(([t]) => t === ui.procTab) ? ui.procTab : 'cours';
    const head = `<div class="card card-b"><div class="stage-head"><span class="stage-ic" style="background:${c}">${ic(P.icon)}</span><div style="flex:1;min-width:0"><small style="color:${c}">${P.label}</small><h2>${P.title}</h2></div></div></div>
      <div class="tabs" role="tablist">${tabs.map(([t, l, n]) => `<button type="button" role="tab" aria-selected="${tab === t}" data-act="proc-tab" data-t="${t}">${l}${n !== undefined ? `<span class="count num">${n}</span>` : ''}</button>`).join('')}</div>`;
    if (tab === 'programme') return head + planConfig();
    if (tab === 'stats') return head + exitStats();
    const people = all.filter((e) => (k === 'arrivees' ? true : tab === 'apres' ? e.stage === 15 : e.stage < 15))
      .sort((a, b) => procActions(b).length - procActions(a).length || (k === 'arrivees' ? a.startDate.localeCompare(b.startDate) : ((a.exit || {}).lastDay || '').localeCompare((b.exit || {}).lastDay || '')));
    const sel = people.find((e) => e.id === ui.procSel);
    const legend = `<p class="hint" style="margin:8px 0 0">Barres : ${P.phases.map(([, l]) => l.toLowerCase()).join(', ')}.</p>`;
    return `${head}<div class="proc-grid"><div class="card proc-list"><div class="card-h"><h3>${k === 'arrivees' ? 'Recrues' : tab === 'apres' ? 'Anciens collaborateurs' : 'Départs en cours'}</h3><span class="pill accent num">${people.length}</span>${k === 'arrivees' && rh ? `<button type="button" class="btn primary sm" style="margin-left:auto" data-act="arr-new">${ic('plus')}Nouvelle arrivée</button>` : ''}</div>
        <div class="card-b">${people.length ? people.map((e) => procRow(e, k)).join('') + legend : `<p class="muted" style="margin:0">${k === 'arrivees' ? 'Aucune arrivée en cours.' : 'Aucun départ en cours.'}</p>`}</div></div>
      <div>${sel ? procDossier(sel, k) : `<div class="card empty proc-empty">${people.length ? 'Choisis une personne pour ouvrir son dossier.' : k === 'arrivees' ? `Les recrues apparaissent ici dès qu’un candidat est embauché${rh ? ', ou avec « Nouvelle arrivée » pour une entrée hors offre (cooptation, candidature spontanée, réembauche…)' : ''}.` : 'Les départs apparaissent ici dès qu’un départ est lancé depuis la fiche du collaborateur.'}</div>`}</div></div>`;
  }
  Object.assign(MOD_ACT, {
    'proc-sel'(d) { if (ui.procSel !== d.id) ui.procPhase = null; ui.procSel = d.id; render(); },
    'proc-phase'(d) { ui.procPhase = Number(d.i); render(); },
    'proc-tab'(d) { ui.procTab = d.t; ui.procSel = null; ui.procPhase = null; render(); },
    'arr-new'() { ui.modal = { type: 'arr-new' }; render(); },
  });
  // ---- Arrivée hors offre : cooptation, candidature spontanée, réembauche, stagiaire ou alternant recruté directement…
  const ARR_SOURCES = ['Candidature spontanée', 'Cooptation', 'Réembauche d’un ancien salarié', 'Ancien stagiaire ou alternant', 'Recrutement direct (réseau, salon…)', 'Reprise de personnel (transfert)'];
  MODALS['arr-new'] = (m, shell, formShell, opt, f) => {
    const mgrs = db.employees.filter((x) => isEmployed(x) && x.stage >= 4).sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr')).map((x) => [x.id, `${fullName(x)} · ${x.title}`]);
    return formShell('Nouvelle arrivée', 'arr-new', `<p class="hint" style="margin:0 0 12px">Pour une entrée qui ne passe pas par une offre. La recrue rejoint le parcours d’arrivée : pré-embauche (pièces), embauche (contrat, DPAE) puis intégration.</p><div class="form-grid">
      ${f('an-first', 'Prénom', '<input id="an-first" name="firstName" class="input" maxlength="40" required>')}${f('an-last', 'Nom', '<input id="an-last" name="lastName" class="input" maxlength="40" required>')}
      ${f('an-mail', 'E-mail personnel (invitation à l’espace)', '<input id="an-mail" name="personalEmail" type="email" class="input" maxlength="80" placeholder="prenom.nom@exemple.fr">')}${f('an-phone', 'Téléphone', '<input id="an-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" class="input" maxlength="20">')}
      ${f('an-src', 'Origine de l’entrée', `<select id="an-src" name="source" class="select">${opt(ARR_SOURCES, ARR_SOURCES[0])}</select>`, true)}
      ${f('an-title', 'Poste', '<input id="an-title" name="title" class="input" maxlength="60" required>')}${f('an-dept', 'Service', `<select id="an-dept" name="dept" class="select">${opt(DEPTS, DEPTS[0])}</select>`)}
      ${f('an-mgr', 'Manager (ou tuteur pour un stage)', `<select id="an-mgr" name="managerId" class="select"><option value="">À désigner</option>${opt(mgrs, '')}</select>`)}${f('an-cat', 'Catégorie', `<select id="an-cat" name="category" class="select">${opt(['Employé', 'Agent de maîtrise', 'Cadre'], 'Employé')}</select>`)}
      ${f('an-contract', 'Contrat', `<select id="an-contract" name="contract" class="select">${opt(['CDI', 'CDD', 'Alternance', 'Stage'], 'CDI')}</select>`)}${f('an-site', 'Lieu de travail', `<select id="an-site" name="location" class="select">${opt(SITES().concat(['Télétravail majoritaire']), SITES()[0])}</select>`)}
      ${f('an-start', 'Date d’arrivée', `<input id="an-start" name="startDate" type="date" class="input" value="${nextMonday(TODAY, 3)}" required>`)}${f('an-end', 'Date de fin (CDD, alternance, stage)', '<input id="an-end" name="endDate" type="date" class="input">')}
      ${f('an-sal', 'Salaire annuel brut (€) · gratification annuelle pour un stage', '<input id="an-sal" name="salary" type="number" min="0" step="100" class="input num" required>', true)}</div>`, 'Créer l’arrivée', true);
  };
  Object.assign(MOD_FORMS, {
    'arr-new'(v) {
      const salary = Number(v.salary), fixed = v.contract !== 'CDI';
      if (!v.firstName.trim() || !v.lastName.trim() || !v.title.trim()) return formError('Renseigne le prénom, le nom et le poste.');
      if (v.personalEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.personalEmail.trim())) return formError('L’e-mail personnel n’est pas valide.');
      if (!v.startDate) return formError('Indique la date d’arrivée.');
      if (fixed && !v.endDate) return formError(`Un contrat ${v.contract === 'Stage' ? 'de stage' : v.contract === 'CDD' ? 'à durée déterminée' : 'd’alternance'} a une date de fin.`);
      if (fixed && v.endDate <= v.startDate) return formError('La date de fin doit suivre la date d’arrivée.');
      if (v.contract === 'CDD' && v.endDate > addDays(addMonths(v.startDate, 18), -1)) return formError('Un CDD ne peut pas dépasser 18 mois, renouvellements compris (cas général).');
      if (v.contract === 'Stage' && v.endDate > addDays(addMonths(v.startDate, 6), -1)) return formError('Un stage ne peut pas dépasser 6 mois par année d’enseignement.');
      if (!(salary >= 0) || (v.contract !== 'Stage' && !(salary > 0))) return formError('Indique un salaire annuel brut supérieur à 0 €.');
      if (v.contract === 'Stage' && v.endDate > addDays(addMonths(v.startDate, 2), -1) && salary / 12 < STAGE_FREE) return formError(`Stage de plus de 2 mois : gratification obligatoire d’au moins ${eur(STAGE_FREE)} par mois, soit ${eur0(STAGE_FREE * 12)} par an.`);
      if (v.startDate < TODAY) toast('Date d’arrivée passée : pense à faire la DPAE au plus vite (elle doit précéder l’embauche).', 'info');
      const id = uid('e'), first = v.firstName.trim(), last = v.lastName.trim();
      const twin = db.employees.find((x) => x.stage < 15 && nameKey(x) === nameKey({ firstName: first, lastName: last }));
      if (twin && !ui.modal.twinOk) { ui.modal.twinOk = true; return formError(`${fullName(twin)} a déjà un dossier (${twin.title} · ${twin.dept}). Pour lui confier un service de plus, désigne-le responsable dans Paramètres > Services. S’il s’agit d’un homonyme, clique à nouveau sur « Créer l’arrivée ».`); }
      const email = `${first}.${last}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z.]/g, '') + `@${COMPANY.domaine}`, taken = (x) => db.employees.some((y) => y.email === x);
      let mail = email; for (let n = 2; taken(mail); n++) mail = email.replace('@', n + '@');
      db.employees.push({ id, firstName: first, lastName: last, title: v.title.trim(), dept: v.dept, managerId: v.managerId || null, stage: 2, startDate: v.startDate, endDate: fixed ? v.endDate : null, contract: v.contract, category: v.category, salary,
        email: mail, personalEmail: (v.personalEmail || '').trim().toLowerCase(), phone: (v.phone || '').trim(), location: v.location, birthDate: '', address: '', emergency: '', cp: 0, rtt: 0, exit: null, source: v.source, registeredAt: null });
      normalizeEmployees();
      if (v.managerId) notify(v.managerId, `${first} ${last} rejoint ton équipe le ${fmtDate(v.startDate)} (${v.title.trim()}).`);
      notify(id, `Bienvenue chez ${COMPANY.nom} ! Dépose tes documents dans « Mon arrivée » : ton contrat suivra.`);
      ui.modal = null; ui.procTab = 'cours'; ui.procSel = id; ui.procPhase = null;
      toast(`${first} ${last} : arrivée créée${v.personalEmail ? ' · invitation envoyée' : ''}`); commit();
    },
  });
  // ---------------------------------------------------------------- Organigramme
  // Arbre de haut en bas : une équipe qui n'a que des collaborateurs sans équipe s'empile en colonne pour rester lisible.
  const DEPT_HUE = { Direction: '#475569', RH: '#6366f1', Design: '#db2777', Tech: '#0891b2', Marketing: '#d97706', Sales: '#059669', Finance: '#7c3aed' };
  // Couleur d'un service créé dans les paramètres : stable, tirée de son nom.
  const deptHue = (d) => DEPT_HUE[d] || ['#0d9488', '#c026d3', '#ea580c', '#2563eb', '#65a30d', '#be123c', '#0284c7', '#a16207'][[...String(d || '')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 8];
  const orgPeople = () => db.employees.filter((e) => e.stage >= 2 && e.stage < 15);
  // Aperçu d'un changement de rattachement (glisser en cours ou fenêtre ouverte) : la personne est dessinée chez son nouveau manager.
  const orgMgr = (x) => (ui.orgPreview && ui.orgPreview.id === x.id ? ui.orgPreview.to : x.managerId);
  const reportsOf = (id) => orgPeople().filter((x) => orgMgr(x) === id && x.id !== id).sort((a, b) => ownTeam(b.id) - ownTeam(a.id) || a.lastName.localeCompare(b.lastName, 'fr'));
  // Ordre des colonnes calculé sur les rattachements réels, pour que l'aperçu ne déplace pas les équipes sous la souris.
  const ownTeam = (id) => orgPeople().filter((x) => x.managerId === id).length;
  const teamSize = (id, seen = new Set()) => reportsOf(id).reduce((s, k) => (seen.has(k.id) ? s : (seen.add(k.id), s + 1 + teamSize(k.id, seen))), 0);
  const isUnder = (id, bossId) => { let e = emp(id), n = 0; while (e && e.managerId && n++ < 30) { if (e.managerId === bossId) return true; e = emp(e.managerId); } return false; };
  const orgSite = (e) => siteOf(e);
  const orgFiltered = () => !!(ui.orgQ || ui.orgDept || ui.orgSite);
  const orgMatch = (e) => { const q = (ui.orgQ || '').trim().toLowerCase();
    return (!q || `${fullName(e)} ${e.title} ${e.dept}`.toLowerCase().includes(q)) && (!ui.orgDept || e.dept === ui.orgDept) && (!ui.orgSite || orgSite(e) === ui.orgSite); };
  const canOpenEmp = (e) => ui.profile === 'rh' || (ui.profile === 'manager' && (e.id === me().id || scopeEmployees().some((x) => x.id === e.id)));
  // Le nom du service s'affiche sur la carte qui ouvre sa branche : sommet de l'arbre, ou personne d'un autre service que son manager.
  const orgDeptHead = (e) => { const m = emp(orgMgr(e)); return !!e.dept && (!m || m.dept !== e.dept); };
  function orgCard(e, kids) {
    const n = teamSize(e.id), fold = (ui.orgFold || {})[e.id] && !(orgFiltered() && kids.some((k) => orgMatch(k) || teamHas(k.id))), rh = ui.profile === 'rh', nx = e.managerNext && emp(e.managerNext.id);
    const pv = ui.orgPreview, cls = [orgFiltered() ? (orgMatch(e) ? 'hit' : 'dim') : '', e.id === me().id ? 'me' : '', pv && pv.id === e.id ? 'mv' : '', pv && pv.to === e.id ? 'tgt' : ''].join(' ');
    return `<div class="oc ${cls}" style="--d:${deptHue(e.dept)}" data-oid="${e.id}" ${rh && e.managerId ? 'data-drag="1"' : ''}>${pv && pv.id === e.id ? '<span class="oc-new">Nouvelle place</span>' : ''}${orgDeptHead(e) ? `<div class="oc-dept">${esc(e.dept)}${DEPT_HEAD[e.dept] === e.id ? '<small> · responsable</small>' : ''}</div>` : ''}
      <button type="button" class="oc-b" data-act="org-open" data-id="${e.id}">${avatar(e, 'sm')}<span><b>${esc(fullName(e))}</b><small>${esc(e.title)}</small><i>${esc(e.dept)}${orgSite(e) !== SITES()[0] ? ` · ${esc(orgSite(e))}` : ''}</i></span></button>
      ${e.stage < 3 ? `<span class="pill info oc-tag">Arrivée le ${fmtShort(e.startDate)}</span>` : ''}${rh && nx ? `<span class="pill warn oc-tag" title="Changement de manager programmé">→ ${esc(nx.firstName)} au ${fmtShort(e.managerNext.from)}</span>` : ''}${rh && e.changeNext && !nx ? `<span class="pill warn oc-tag" title="${esc(situationDiff(e, e.changeNext).join(' · '))}">${esc(e.changeNext.dept !== e.dept ? `→ ${e.changeNext.dept}` : e.changeNext.managerId !== e.managerId && emp(e.changeNext.managerId) ? `→ ${emp(e.changeNext.managerId).firstName}` : e.changeNext.label)} au ${fmtShort(e.changeNext.from)}</span>` : ''}${e.id === me().id ? '<span class="oc-me">Moi</span>' : ''}
      ${kids.length ? `<button type="button" class="oc-n" data-act="org-fold" data-id="${e.id}" aria-expanded="${!fold}" title="${fold ? 'Déplier' : 'Replier'} l’équipe"><span class="num">${kids.length}</span> direct${kids.length > 1 ? 's' : ''}${n !== kids.length ? ` · <span class="num">${n}</span> au total` : ''}${ic('right').replace('<svg', '<svg class="chev"')}</button>` : ''}</div>`;
  }
  const teamHas = (id) => reportsOf(id).some((k) => orgMatch(k) || teamHas(k.id));
  function orgNode(e, seen = new Set()) {
    seen.add(e.id);
    const kids = reportsOf(e.id).filter((k) => !seen.has(k.id)), fold = (ui.orgFold || {})[e.id] && !(orgFiltered() && teamHas(e.id));
    const stack = kids.length > 1 && kids.every((k) => !reportsOf(k.id).length);
    return `<li class="${ui.orgPreview && ui.orgPreview.id === e.id ? 'mv' : ''}">${orgCard(e, kids)}${kids.length && !fold ? `<ul class="${stack ? 'stack' : ''}">${kids.map((k) => orgNode(k, seen)).join('')}</ul>` : ''}</li>`;
  }
  // Sommets de l'arbre : sans manager valide, ou pris dans une boucle de rattachements (sinon ils disparaîtraient).
  const inLoop = (e) => { let x = e, n = 0; while (x && x.managerId && n++ < 60) { x = emp(x.managerId); if (x && x.id === e.id) return true; } return false; };
  function orgRoots(people) {
    const r = people.filter((e) => !orgMgr(e) || !emp(orgMgr(e)) || orgMgr(e) === e.id), seen = new Set();
    const walk = (id) => { if (seen.has(id)) return; seen.add(id); reportsOf(id).forEach((k) => walk(k.id)); };
    r.forEach((e) => walk(e.id));
    people.forEach((e) => { if (!seen.has(e.id)) { r.push(e); walk(e.id); } }); // une boucle : son premier membre devient un sommet
    return r;
  }
  function orgChart() {
    const people = orgPeople(), roots = orgRoots(people), rh = ui.profile === 'rh';
    const depts = [...new Set(people.map((e) => e.dept))], hits = orgFiltered() ? people.filter(orgMatch).length : null;
    const sel = (id, k, label, list) => `<label class="sr" for="${id}">${label}</label><select id="${id}" class="select" data-change="org-filter" data-k="${k}"><option value="">${label}</option>${list.map((x) => `<option ${ui[k] === x ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
    return `<div class="card org-card-wrap ${ui.orgFull ? 'full' : ''}" ${ui.orgFull ? 'role="dialog" aria-label="Organigramme en plein écran"' : ''}><div class="card-h org-bar"><div class="toolbar">
        <div class="search">${ic('search')}<label class="sr" for="org-q">Rechercher une personne</label><input id="org-q" class="input" type="search" placeholder="Nom, poste, service…" value="${esc(ui.orgQ || '')}" data-input="orgq" autocomplete="off"></div>
        ${sel('org-dept', 'orgDept', 'Tous les services', depts.sort((a, b) => DEPTS.indexOf(a) - DEPTS.indexOf(b)))}${sel('org-site', 'orgSite', 'Tous les sites', SITES())}
        <span class="muted" id="org-count" style="font-size:13px">${hits === null ? `${plural(people.length, 'personne', 'personnes')} · ${plural(depts.length, 'service', 'services')}` : plural(hits, 'résultat', 'résultats')}</span></div>
        <div class="toolbar"><div class="zoom" role="group" aria-label="Zoom"><button type="button" class="icon-btn" data-act="org-zoom" data-z="-1" aria-label="Dézoomer">−</button><span class="num" id="org-z">${Math.round((ui.orgZoom || 1) * 100)} %</span><button type="button" class="icon-btn" data-act="org-zoom" data-z="1" aria-label="Zoomer">+</button><button type="button" class="btn ghost sm" data-act="org-zoom" data-z="fit">Ajuster</button></div>
          <button type="button" class="btn ghost sm" data-act="org-unfold">Tout déplier</button>${ui.orgFull ? `<button type="button" class="btn ghost sm" data-act="org-full" aria-pressed="true" title="Quitter le plein écran (Échap)">${ic('shrink')}Quitter le plein écran</button>` : `<button type="button" class="icon-btn org-fs" data-act="org-full" aria-pressed="false" aria-label="Afficher en plein écran" data-tip="Plein écran">${ic('expand')}</button>`}${rh ? `<button type="button" class="btn primary sm" data-act="org-move">${ic('arrow')}Changer un rattachement</button>` : ''}</div></div>
      ${rh && orgIssues().length ? `<div class="org-warn">${ic('target')}<span>${plural(orgIssues().length, 'incohérence', 'incohérences')} entre les responsables de service (Paramètres) et l’organigramme.</span><button type="button" class="btn ghost sm" data-act="coh-open">Vérifier</button></div>` : ''}
      <div class="org-vp" id="org-vp"><div class="org-canvas" id="org-canvas" style="zoom:${ui.orgZoom || 1}"><ul class="ot">${roots.map((r) => orgNode(r)).join('')}</ul></div></div>
      <p class="hint org-hint">${rh ? 'Pour changer quelqu’un d’équipe, fais glisser sa carte sur un manager : l’aperçu montre sa nouvelle place en vert, lâche pour confirmer (Échap ou lâcher ailleurs pour annuler). ' : ''}Clique sur une personne pour voir sa fiche · fais glisser le fond pour te déplacer.</p></div>`;
  }
  function refreshOrg() {
    const c = document.getElementById('org-canvas'); if (!c) return;
    c.innerHTML = `<ul class="ot">${orgRoots(orgPeople()).map((r) => orgNode(r)).join('')}</ul>`;
    const n = document.getElementById('org-count'), people = orgPeople();
    if (n) n.textContent = orgFiltered() ? plural(people.filter(orgMatch).length, 'résultat', 'résultats') : `${plural(people.length, 'personne', 'personnes')} · ${plural(new Set(people.map((e) => e.dept)).size, 'service', 'services')}`;
    bindOrg(true);
  }
  let orgCentered = false;
  function bindOrg(keep) {
    const vp = document.getElementById('org-vp'); if (!vp) { orgCentered = false; if (ui.orgFull) { ui.orgFull = false; document.documentElement.classList.remove('org-full-on'); } return; }
    const hit = orgFiltered() && vp.querySelector('.oc.hit'), mine = vp.querySelector('.oc.me');
    const focus = (el) => { const r = el.getBoundingClientRect(), v = vp.getBoundingClientRect(); vp.scrollLeft += r.left + r.width / 2 - (v.left + v.width / 2); vp.scrollTop += r.top - v.top - 40; };
    if (hit) focus(hit); else if (!keep && !orgCentered) { orgCentered = true; if (mine && ui.profile !== 'rh') focus(mine); else vp.scrollLeft = (vp.scrollWidth - vp.clientWidth) / 2; }
    if (vp._bound) return; vp._bound = true;
    // Déplacement à la souris sur le fond.
    let drag = null;
    vp.addEventListener('pointerdown', (ev) => { if (ev.target.closest('.oc') || ev.button !== 0) return; drag = { x: ev.clientX, y: ev.clientY, l: vp.scrollLeft, t: vp.scrollTop }; vp.classList.add('grab'); vp.setPointerCapture(ev.pointerId); });
    vp.addEventListener('pointermove', (ev) => { if (!drag) return; vp.scrollLeft = drag.l - (ev.clientX - drag.x); vp.scrollTop = drag.t - (ev.clientY - drag.y); });
    const end = () => { drag = null; vp.classList.remove('grab'); }; vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end);
    vp.addEventListener('wheel', (ev) => { if (!ev.ctrlKey) return; ev.preventDefault(); setOrgZoom((ui.orgZoom || 1) * (ev.deltaY < 0 ? 1.1 : 0.9)); }, { passive: false });
    // RH : glisser une carte. Survoler un manager redessine l'arbre avec la personne à sa nouvelle place (liens en vert) ;
    // lâcher sur ce manager ouvre la confirmation, lâcher ailleurs annule l'aperçu.
    vp.addEventListener('pointerdown', (ev) => {
      const c = ev.target.closest('.oc[data-drag]'); if (!c || ev.button !== 0 || ev.target.closest('.oc-n')) return;
      orgDrag = { id: c.dataset.oid, x: ev.clientX, y: ev.clientY, on: false, src: c, lx: 0, ly: 0, t: null };
    });
  }
  let orgDrag = null;
  const ORG_HOVER_MS = 120;
  const orgValidTarget = (id, to) => to && to !== id && !isUnder(to, id) && emp(id) && emp(id).managerId !== to;
  function orgSetPreview(to) {
    const d = orgDrag; if (!d) return;
    const next = to && orgValidTarget(d.id, to) ? { id: d.id, to } : null;
    if (JSON.stringify(next) === JSON.stringify(ui.orgPreview || null)) return;
    ui.orgPreview = next; d.lx = d.cx; d.ly = d.cy; refreshOrg();
    const hint = document.querySelector('.org-ghost small'); if (hint) hint.textContent = next ? `Lâcher pour rattacher à ${fullName(emp(to))}` : 'Survole un manager pour voir la nouvelle place';
  }
  document.addEventListener('pointermove', (ev) => {
    const d = orgDrag; if (!d) return;
    d.cx = ev.clientX; d.cy = ev.clientY;
    if (!d.on) { if (Math.hypot(ev.clientX - d.x, ev.clientY - d.y) < 6) return; d.on = true; d.lx = ev.clientX; d.ly = ev.clientY;
      const e = emp(d.id), g = document.createElement('div'); g.className = 'org-ghost'; g.innerHTML = `${avatar(e, 'sm')}<span><b>${esc(fullName(e))}</b><small>Survole un manager pour voir la nouvelle place</small></span>`;
      document.body.appendChild(g); d.ghost = g; document.documentElement.classList.add('org-dragging'); const src = document.querySelector(`.oc[data-oid="${d.id}"]`); if (src) src.classList.add('dragging'); }
    const gw = d.ghost.offsetWidth, gh = d.ghost.offsetHeight, gx = ev.clientX + 14 + gw > innerWidth - 8 ? ev.clientX - gw - 14 : ev.clientX + 14, gy = Math.min(ev.clientY + 12, innerHeight - gh - 8);
    d.ghost.style.transform = `translate(${gx}px, ${gy}px)`;
    // Le redessin déplace les cartes : on attend un vrai mouvement de la souris avant de changer de cible.
    if (Math.hypot(ev.clientX - d.lx, ev.clientY - d.ly) < 10 && ui.orgPreview) return;
    const el = document.elementFromPoint(ev.clientX, ev.clientY), c = el && el.closest('.oc'), vp = el && el.closest('#org-vp');
    const to = c && c.dataset.oid !== d.id ? c.dataset.oid : null;
    // Aperçu après un court survol de la carte (le minuteur ne repart pas à chaque mouvement sur la même carte) :
    // traverser une carte en chemin ne redessine rien, s'y arrêter un instant suffit.
    const want = to || (c && c.dataset.oid === d.id ? (ui.orgPreview && ui.orgPreview.to) || null : null);
    const cur = (ui.orgPreview && ui.orgPreview.to) || null;
    if (want === cur) { clearTimeout(d.t); d.pending = undefined; return; }
    if (d.pending === want) return;
    clearTimeout(d.t); d.pending = want;
    d.t = setTimeout(() => { d.pending = undefined; orgSetPreview(want); }, want ? ORG_HOVER_MS : vp ? 250 : 80);
  });
  function orgDragEnd(drop) {
    const d = orgDrag; if (!d) return; orgDrag = null; clearTimeout(d.t);
    if (d.ghost) d.ghost.remove(); document.documentElement.classList.remove('org-dragging');
    if (!d.on) return;
    orgSuppressClick = true; setTimeout(() => { orgSuppressClick = false; }, 0);
    const pv = ui.orgPreview;
    if (drop && pv) { ui.modal = { type: 'org-move', id: pv.id, to: pv.to }; render(); }
    else { ui.orgPreview = null; refreshOrg(); }
  }
  let orgSuppressClick = false;
  document.addEventListener('pointerup', (ev) => { if (!orgDrag || !orgDrag.on) { orgDrag = null; return; }
    const el = document.elementFromPoint(ev.clientX, ev.clientY), c = el && el.closest('.oc');
    // Lâcher sur la carte du manager visé, ou sur la carte déplacée dans son aperçu, confirme.
    orgDragEnd(!!(c && ui.orgPreview && [ui.orgPreview.to, ui.orgPreview.id].includes(c.dataset.oid))); });
  document.addEventListener('pointercancel', () => orgDragEnd(false));
  document.addEventListener('click', (ev) => { if (orgSuppressClick) { ev.stopPropagation(); ev.preventDefault(); orgSuppressClick = false; } }, true);
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && orgDrag && orgDrag.on) { ev.stopImmediatePropagation(); orgDragEnd(false); } }, true);
  // Plein écran : l'organigramme couvre la fenêtre (et l'écran entier quand le navigateur l'autorise) ; fiches et fenêtres restent au-dessus.
  function setOrgFull(on) {
    ui.orgFull = on; orgCentered = false; document.documentElement.classList.toggle('org-full-on', on);
    try { if (on && document.fullscreenEnabled && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); else if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch (e) { /* plein écran du navigateur indisponible */ }
    render();
  }
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && ui.orgFull) setOrgFull(false); });
  function setOrgZoom(z) { ui.orgZoom = Math.min(1.4, Math.max(0.4, Math.round(z * 100) / 100)); const c = document.getElementById('org-canvas'), l = document.getElementById('org-z'); if (c) c.style.zoom = ui.orgZoom; if (l) l.textContent = `${Math.round(ui.orgZoom * 100)} %`; saveUI(); }
  function applyDueManagers() {
    db.employees.forEach((e) => { const nx = e.managerNext; if (!nx || nx.from > TODAY) return; moveManager(e, nx.id, nx.from, nx.reason, nx.dept, nx.by); delete e.managerNext; });
  }
  function moveManager(e, to, date, reason, dept, by) {
    const old = emp(e.managerId), nw = emp(to), d0 = e.dept;
    e.managerId = to; if (dept && nw) e.dept = nw.dept;
    db.history.push({ id: uid('h'), empId: e.id, date, label: 'Changement de manager', detail: `${old ? fullName(old) : '—'} → ${fullName(nw)}${dept && nw && nw.dept !== d0 ? ` · service ${d0} → ${nw.dept}` : ''}${reason ? ` · ${reason}` : ''}` });
    notify(e.id, `À partir du ${fmtDate(date)}, ton manager est ${fullName(nw)}.`);
    if (nw) notify(nw.id, `${fullName(e)} rejoint ton équipe à partir du ${fmtDate(date)}.`);
    if (old) notify(old.id, `${fullName(e)} quitte ton équipe le ${fmtDate(date)} et rejoint celle de ${fullName(nw)}.`);
  }
  MODALS['org-person'] = (m, shell) => { const e = emp(m.id), mgr = emp(e.managerId), team = reportsOf(e.id);
    return shell(esc(fullName(e)), `<div class="modal-b"><div class="drawer-h" style="padding:0 0 14px">${avatar(e, 'lg')}<div><h2>${esc(fullName(e))}</h2><p>${esc(e.title)} · ${esc(e.dept)}</p></div></div>
      <div class="info-grid"><div><span>E-mail professionnel</span>${esc(e.email)}</div><div><span>Site</span>${esc(e.location || 'Paris')}</div><div><span>Manager</span>${mgr ? esc(fullName(mgr)) : '—'}</div><div><span>Dans l’entreprise depuis</span>${fmtDate(e.startDate)}</div></div>
      ${team.length ? `<div class="team" style="margin-top:14px"><span class="team-l">Équipe</span>${team.map((k) => `<span class="who-chip">${avatar(k, 'sm')}${esc(fullName(k))}</span>`).join('')}</div>` : ''}</div>`,
      '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>'); };
  const orgMoveInfo = (e, to) => (e ? `Manager actuel : <b>${esc(fullName(emp(e.managerId)))}</b>${to ? ` → nouveau : <b>${esc(fullName(to))}</b>` : ''}` : 'Astuce : tu peux aussi glisser une carte sur un manager dans l’organigramme.');
  const orgDeptLabel = (e, to) => `Rattacher aussi au service du nouveau manager${e && to && e.dept !== to.dept ? ` (${esc(e.dept)} → ${esc(to.dept)})` : ''}`;
  MOD_LIVE.orgmove = (form) => { const e = emp(form.elements.namedItem('id').value), to = emp(form.elements.namedItem('to').value), cb = document.getElementById('om-dept');
    document.getElementById('om-info').innerHTML = orgMoveInfo(e, to); document.getElementById('om-dept-l').innerHTML = orgDeptLabel(e, to); if (cb) cb.checked = !!(e && to && e.dept !== to.dept);
    ui.orgPreview = e && to && orgValidTarget(e.id, to.id) ? { id: e.id, to: to.id } : null; refreshOrg(); };
  MODALS['org-move'] = (m, shell, formShell, opt, f) => {
    const people = orgPeople().sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr')), e = m.id && emp(m.id), o = (list, cur, ph) => `${ph ? `<option value="">${ph}</option>` : ''}${list.map((x) => `<option value="${x.id}" ${x.id === cur ? 'selected' : ''}>${esc(fullName(x))} · ${esc(x.title)}</option>`).join('')}`;
    const to = m.to && emp(m.to), diff = e && to && e.dept !== to.dept;
    return formShell('Changer un rattachement', 'org-move', `<div class="form-grid">${f('om-emp', 'Collaborateur', `<select id="om-emp" name="id" class="select" data-live="orgmove">${o(people.filter((x) => x.managerId), m.id, 'Choisir…')}</select>`)}
      ${f('om-to', 'Nouveau manager', `<select id="om-to" name="to" class="select" data-live="orgmove">${o(people, m.to, 'Choisir…')}</select>`)}
      <p class="hint full" id="om-info" style="margin:0">${orgMoveInfo(e, to)}</p>
      ${f('om-date', 'Date d’effet', `<input id="om-date" name="date" type="date" class="input" value="${TODAY}">`)}${f('om-reason', 'Motif (facultatif)', '<input id="om-reason" name="reason" class="input" maxlength="120" placeholder="Ex. réorganisation, mobilité interne">')}
      <label class="full agree"><input type="checkbox" name="dept" id="om-dept" ${diff ? 'checked' : ''}> <span id="om-dept-l">${orgDeptLabel(e, to)}</span></label></div>
      <p class="hint" style="margin:10px 0 0">Le collaborateur, l’ancien et le nouveau manager sont prévenus ; le changement est tracé dans l’historique du collaborateur. Un changement de fonction ou de rémunération passe par un avenant.</p>`, 'Enregistrer');
  };
  Object.assign(MOD_ACT, {
    'org-open'(d) { const e = emp(d.id); if (canOpenEmp(e)) { ui.drawer = { type: 'emp', id: e.id, tab: 'infos' }; drawerAnim = true; render(); } else { ui.modal = { type: 'org-person', id: e.id }; render(); } },
    'org-fold'(d) { ui.orgFold = Object.assign({}, ui.orgFold || {}, { [d.id]: !(ui.orgFold || {})[d.id] }); refreshOrg(); saveUI(); },
    'org-full'() { setOrgFull(!ui.orgFull); },
    'org-unfold'() { ui.orgFold = {}; refreshOrg(); saveUI(); },
    'org-zoom'(d) { const z = ui.orgZoom || 1; if (d.z === 'fit') { const vp = document.getElementById('org-vp'), t = vp && vp.querySelector('.ot'); if (t) setOrgZoom(Math.min(1, (vp.clientWidth - 32) / (t.getBoundingClientRect().width / z))); } else setOrgZoom(z + Number(d.z) * 0.1); },
    'org-move'() { ui.modal = { type: 'org-move' }; render(); },
    'prof-tab'(d) { ui.profTab = d.t; render(); },
  });
  Object.assign(MOD_CHG, { 'org-filter'(v, d) { ui[d.k] = v; refreshOrg(); } });
  Object.assign(MOD_FORMS, {
    'org-move'(v) {
      const e = emp(v.id), to = emp(v.to);
      if (!e || !to) return formError('Choisis le collaborateur et son nouveau manager.');
      if (e.id === to.id) return formError('Un collaborateur ne peut pas être son propre manager.');
      if (isUnder(to.id, e.id)) return formError(`${fullName(to)} fait partie de l’équipe de ${fullName(e)} : ce rattachement créerait une boucle.`);
      if (e.managerId === to.id) return formError(`${fullName(to)} est déjà le manager de ${fullName(e)}.`);
      if (!v.date) return formError('Indique la date d’effet.');
      const reason = (v.reason || '').trim(), dept = !!v.dept;
      if (v.date <= TODAY) { moveManager(e, to.id, v.date, reason, dept, me().id); delete e.managerNext; toast(`${fullName(e)} est rattaché·e à ${fullName(to)}`); }
      else { e.managerNext = { id: to.id, from: v.date, reason, dept, by: me().id }; toast(`Changement programmé au ${fmtDate(v.date)}`); }
      ui.modal = null; commit();
    },
  });
  Object.assign(MOD_ACT, {
    'pay-step'(d) { ui.payStep = d.s; render(); },
    'pay-ack'(d) { const pr = payrollOf(ui.payMonth); pr.acks = Object.assign({}, pr.acks, { [d.id]: { by: me().id, date: TODAY } }); toast('Point marqué comme vérifié'); commit(); },
    'pay-remind'(d) { notify(d.id, `Les variables de paie de ton équipe sont à valider avant le ${fmtDate(payrollOf(ui.payMonth).cutoff || `${ui.payMonth}-${String(PAY_CUTOFF).padStart(2, '0')}`)}.`); toast(`${fullName(emp(d.id))} est relancé`); commit(); },
    'pay-mgr-ok'() { const m = payCurrent(), pr = payrollOf(m); pr.mgrOk = Object.assign({}, pr.mgrOk, { [me().id]: TODAY }); notify('e1', `${fullName(me())} a validé les variables de paie de son équipe (${monthLabel(m).toLowerCase()}).`); toast('Variables validées · les RH sont prévenus'); commit(); },
    'pay-send'() { const m = ui.payMonth, pr = payrollOf(m); if (openChecks(m).length) { toast('Des points de contrôle restent à lever.', 'info'); return; } Object.assign(pr, { status: 'Envoyée', sentAt: TODAY, sentBy: me().id }); ui.payStep = 'envoi'; toast(`Variables envoyées à ${PROVIDER}`); commit(); },
    'pay-receive'() { const pr = payrollOf(ui.payMonth); Object.assign(pr, { status: 'Reçue', receivedAt: TODAY }); ui.payStep = 'bulletins'; toast('Bulletins reçus · DSN déposée par le prestataire'); commit(); },
    'pay-publish'() { const m = ui.payMonth, pr = payrollOf(m), people = payPeople(m); Object.assign(pr, { status: 'Diffusée', closed: true, publishedAt: TODAY }); people.forEach((e) => notify(e.id, `Ton bulletin de paie de ${monthLabel(m).toLowerCase()} est disponible.`)); toast(`${plural(people.length, 'bulletin diffusé', 'bulletins diffusés')}`); commit(); },
    'pay-csv'(d) { const blob = new Blob(['﻿' + payCsv(d.m)], { type: 'text/csv;charset=utf-8' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `variables-paie-${d.m}.csv`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Export téléchargé'); },
  });
  Object.assign(MOD_CHG, {
    'pay-var'(v, d) { const pr = payrollOf(ui.payMonth), n = Math.max(0, Number(v) || 0); if (d.k === 'bonus') pr.bonus[d.id] = n; else { pr.extra = pr.extra || {}; pr.extra[d.id] = Object.assign({}, pr.extra[d.id], { [d.k]: n }); } commit(); },
    'paper-slip'(v, d, t) { const e = me(); e.paperSlip = t.checked; notify('e1', `${fullName(e)} ${t.checked ? 'demande des bulletins papier' : 'accepte les bulletins électroniques'}.`); toast(t.checked ? 'Les RH t’enverront tes bulletins en version papier' : 'Bulletins électroniques'); commit(); },
  });
  const tabsBar = (key, list) => `<div class="tabs" role="tablist">${list.map(([k, l, n]) => `<button type="button" role="tab" aria-selected="${ui[key] === k}" data-act="tab" data-k="${key}" data-t="${k}">${l}${n ? `<span class="count num">${n}</span>` : ''}</button>`).join('')}</div>`;
  const pickTab = (key, list) => { if (!list.some((t) => t[0] === ui[key])) ui[key] = list[0][0]; };
  const card = (title, right, body) => `<div class="card"><div class="card-h"><h3>${title}</h3>${right || ''}</div>${body}</div>`;
  const empOptions = (list, sel) => list.map((e) => `<option value="${e.id}" ${e.id === sel ? 'selected' : ''}>${esc(fullName(e))}</option>`).join('');
  const employed = () => db.employees.filter(isEmployed);
  const scopeSet = () => new Set(scopeEmployees().map((e) => e.id));
  const addYears = (s, n) => { const d = parse(s); d.setFullYear(d.getFullYear() + n); return iso(d); };
  const addMonths = (s, n) => { const d = parse(s); d.setMonth(d.getMonth() + n); return iso(d); };
  // Jours ouvrables : tous les jours sauf le dimanche et les jours fériés.
  function addOuvrables(s, n) { let d = s; while (n > 0) { d = addDays(d, 1); if (parse(d).getDay() !== 0 && !HOLIDAYS.has(d)) n--; } return d; }
  const RATING = ['', 'Insuffisant', 'À améliorer', 'Conforme aux attentes', 'Dépasse les attentes', 'Exceptionnel'];
  const ratingSelect = (id, name, v) => `<select id="${id}" name="${name}" class="select">${[5, 4, 3, 2, 1].map((k) => `<option value="${k}" ${k === (v || 3) ? 'selected' : ''}>${k} · ${RATING[k]}</option>`).join('')}</select>`;
  const hbar = (v, max = 5, color = 'var(--accent)') => `<span class="hbar"><i style="width:${Math.max(0, Math.min(100, (v / max) * 100))}%;background:${color}"></i></span>`;
  function tickJourney(empId, stage, k) {
    const e = emp(empId); if (!e || e.stage !== stage) return;
    db.journey[empId] = db.journey[empId] || {};
    const arr = journeyOf(empId, stage); arr[k] = true; db.journey[empId][stage] = arr;
  }
  MOD_ACT.tab = (d) => { ui[d.k] = d.t; render(); };

  // ---------------------------------------------------------------- Performance & entretiens
  const CAMPAIGN = 2026;
  const REVIEW_FLOW = ['À planifier', 'Planifié', 'Auto-évaluation faite', 'À signer', 'Signé'];
  const REVIEW_PILL = { 'À planifier': 'warn', Planifié: 'info', 'Auto-évaluation faite': 'accent', 'À signer': 'accent', Signé: 'ok' };
  const reviewPill = (r) => `<span class="pill ${REVIEW_PILL[r.status]}">${r.status}</span>`;
  const proDue = (e) => addYears(e.lastPro || e.startDate, 4);
  function proState(e) { const due = proDue(e); if (due < TODAY) return ['En retard', 'bad']; if (due < addDays(TODAY, 90)) return ['À prévoir', 'warn']; return ['À jour', 'ok']; }
  const stepper = (r) => { const k = REVIEW_FLOW.indexOf(r.status); return `<ol class="stepper">${REVIEW_FLOW.map((s, i) => `<li class="${i < k ? 'done' : i === k ? 'now' : ''}">${s}</li>`).join('')}</ol>`; };
  const annualOf = (empId) => db.reviews.find((r) => r.empId === empId && r.kind === 'Entretien annuel' && r.year === CAMPAIGN);
  function objectivesList(list, editable) {
    if (!list.length) return '<p class="muted" style="margin:0">Aucun objectif pour le moment.</p>';
    return `<div class="objs">${list.map((o) => `<div class="obj"><div class="obj-t"><b>${esc(o.title)}</b><small>Échéance : ${fmtDate(o.due)}</small></div>
      ${editable ? `<label class="sr" for="op-${o.id}">Avancement</label><input id="op-${o.id}" type="range" min="0" max="100" step="5" value="${o.progress}" data-change="obj-progress" data-id="${o.id}">` : hbar(o.progress, 100, 'var(--ok)')}
      <span class="num obj-p">${o.progress} %</span></div>`).join('')}</div>`;
  }
  function feedbackTab() {
    const m = me();
    const got = db.feedback.filter((f) => f.to === m.id), sent = db.feedback.filter((f) => f.from === m.id);
    const fbList = (list, who) => list.length ? list.slice().sort((a, b) => b.date.localeCompare(a.date)).map((f) => { const o = emp(f[who]);
      return `<div class="req">${avatar(o, 'sm')}<div class="what"><b>${who === 'from' ? 'De' : 'À'} ${esc(fullName(o))}</b><small>${fmtDate(f.date)}</small><p style="margin:4px 0 0">${esc(f.text)}</p></div></div>`; }).join('') : '<div class="empty">Rien pour le moment.</div>';
    return `<form class="card" data-form="feedback" novalidate><div class="card-h"><h3>Envoyer un feedback</h3></div><div class="card-b"><div class="form-grid">
      <div class="field"><label for="fb-to">À</label><select id="fb-to" name="to" class="select">${empOptions(employed().filter((e) => e.id !== m.id))}</select></div>
      <div class="field full"><label for="fb-text">Message</label><textarea id="fb-text" name="text" class="input" maxlength="400" placeholder="Ce que vous avez apprécié, concrètement…"></textarea></div></div>
      <div class="toolbar" style="margin-top:12px"><span class="err" id="fb-err"></span><button class="btn primary" style="margin-left:auto">Envoyer</button></div></div></form>
      <div class="two">${card('Reçus', `<span class="pill accent num">${got.length}</span>`, `<div class="req-list">${fbList(got, 'from')}</div>`)}${card('Envoyés', `<span class="pill neutral num">${sent.length}</span>`, `<div class="req-list">${fbList(sent, 'to')}</div>`)}</div>`;
  }
  function viewReviews() {
    const p = ui.profile, m = me();
    if (p === 'salarie') {
      const mine = db.reviews.filter((r) => r.empId === m.id).sort((a, b) => (b.date || '9').localeCompare(a.date || '9'));
      const todo = mine.filter((r) => ['Planifié', 'À signer'].includes(r.status)).length;
      const mob = mobSal(), tabs = [['mon', 'Mes entretiens', todo], ['objectifs', 'Mes objectifs'], ...(mob ? [] : [['feedback', 'Feedback']])]; pickTab('revTab', tabs);
      let body;
      if (ui.revTab === 'mon') {
        const [st, cls] = proState(m);
        body = `${mine.length ? mine.map((r) => `<div class="card"><div class="card-h"><h3>${r.kind} ${r.year}</h3>${reviewPill(r)}</div><div class="card-b">${stepper(r)}
          <div class="toolbar" style="margin-top:14px"><span class="muted">${r.date ? `Prévu le ${fmtDate(r.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} avec ${esc(fullName(emp(m.managerId)))}` : 'Date à fixer par votre manager'}</span>
          ${mob ? '' : `<button type="button" class="btn ${['Planifié', 'À signer'].includes(r.status) ? 'primary' : 'ghost'}" style="margin-left:auto" data-act="review" data-id="${r.id}">${r.status === 'Planifié' ? 'Faire mon auto-évaluation' : r.status === 'À signer' ? 'Relire et signer' : 'Ouvrir'}</button>`}</div>
          ${mob && ['Planifié', 'À signer'].includes(r.status) ? desktopHint(r.status === 'Planifié' ? 'L’auto-évaluation se fait' : 'La relecture et la signature se font') : ''}</div></div>`).join('') : '<div class="card empty">Aucun entretien programmé.</div>'}
          <div class="card card-b"><b>Entretien de parcours professionnel</b><p class="muted" style="margin:4px 0 0">Tous les 4 ans (loi du 24 octobre 2025), pour parler de vos perspectives d’évolution et de formation. Dernier : ${m.lastPro ? fmtDate(m.lastPro) : 'aucun'} · prochain avant le ${fmtDate(proDue(m))} <span class="pill ${cls}">${st}</span></p></div>`;
      } else if (ui.revTab === 'objectifs') {
        const list = db.objectives.filter((o) => o.empId === m.id);
        const avg = list.length ? Math.round(list.reduce((s, o) => s + o.progress, 0) / list.length) : 0;
        body = card('Mes objectifs 2026', `<span class="pill ok num">Avancement moyen ${avg} %</span>`, `<div class="card-b">${objectivesList(list, !mob)}<p class="hint" style="margin:12px 0 0">${mob ? 'La mise à jour de l’avancement se fait sur ordinateur.' : 'Faites glisser le curseur pour mettre à jour l’avancement : votre manager le voit aussitôt.'}</p></div>`);
      } else body = feedbackTab();
      return tabsBar('revTab', tabs) + body;
    }
    if (p === 'manager') {
      const team = scopeEmployees().filter(isEmployed);
      const action = team.filter((e) => { const r = annualOf(e.id); return r && ['À planifier', 'Auto-évaluation faite'].includes(r.status); }).length;
      const tabs = [['equipe', 'Entretiens de l’équipe', action], ['objectifs', 'Objectifs de l’équipe'], ['feedback', 'Feedback']]; pickTab('revTab', tabs);
      let body;
      if (ui.revTab === 'equipe') {
        body = card(`Campagne ${CAMPAIGN}`, '', `<div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Entretien annuel</th><th>Date</th><th>Entretien professionnel</th><th></th></tr></thead><tbody>${team.map((e) => {
          const r = annualOf(e.id), [st, cls] = proState(e);
          const btn = !r ? '<span class="muted">Non lancé par les RH</span>' : `<button type="button" class="btn ${['À planifier', 'Auto-évaluation faite'].includes(r.status) ? 'primary' : 'ghost'} sm" data-act="review" data-id="${r.id}">${r.status === 'À planifier' ? 'Planifier' : r.status === 'Auto-évaluation faite' ? 'Compléter mon évaluation' : 'Ouvrir'}</button>`;
          return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)}</small></div></div></td><td>${r ? reviewPill(r) : '—'}</td><td>${r && r.date ? fmtDate(r.date) : '—'}</td><td><span class="pill ${cls}">${st}</span> <small class="muted">avant le ${fmtDate(proDue(e))}</small></td><td class="r">${btn}</td></tr>`; }).join('')}</tbody></table></div>`);
      } else if (ui.revTab === 'objectifs') {
        body = `<div class="toolbar"><button type="button" class="btn primary" data-act="objective-new">${ic('plus')}Fixer un objectif</button></div>${team.map((e) => card(`${avatar(e, 'sm')} ${esc(fullName(e))}`, `<span class="muted">${esc(e.title)}</span>`, `<div class="card-b">${objectivesList(db.objectives.filter((o) => o.empId === e.id), false)}</div>`)).join('')}`;
      } else body = feedbackTab();
      return tabsBar('revTab', tabs) + body;
    }
    // RH
    const annual = db.reviews.filter((r) => r.kind === 'Entretien annuel' && r.year === CAMPAIGN);
    const missing = employed().filter((e) => e.stage >= 5 && e.stage < 13 && !annualOf(e.id));
    const late = employed().filter((e) => proState(e)[0] !== 'À jour').length;
    const tabs = [['campagne', `Campagne ${CAMPAIGN}`], ['pro', 'Entretiens de parcours professionnel', late], ['objectifs', 'Objectifs']]; pickTab('revTab', tabs);
    let body;
    if (ui.revTab === 'campagne') {
      const signed = annual.filter((r) => r.status === 'Signé').length;
      body = `<div class="kpis">${[['Entretiens créés', annual.length, missing.length ? `${missing.length} collaborateur(s) sans entretien` : 'Tous les collaborateurs concernés'], ['Signés', signed, `${annual.length ? Math.round((signed / annual.length) * 100) : 0} % de la campagne`],
        ['En cours', annual.filter((r) => !['Signé', 'À planifier'].includes(r.status)).length, 'Auto-évaluation ou signature'], ['À planifier', annual.filter((r) => r.status === 'À planifier').length, 'Date à fixer par le manager']].map(([l, v, s]) => `<div class="card kpi"><span class="l">${l}</span><span class="v num">${v}</span><span class="s">${s}</span></div>`).join('')}</div>
        ${missing.length ? `<div class="card card-b toolbar"><span>${missing.length} collaborateur(s) n’ont pas encore d’entretien annuel ${CAMPAIGN}.</span><button type="button" class="btn primary" style="margin-left:auto" data-act="campaign">${ic('plus')}Lancer la campagne pour eux</button></div>` : ''}
        ${card('Suivi de la campagne', '', `<div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Manager</th><th>Date</th><th>Statut</th><th></th></tr></thead><tbody>${annual.map((r) => { const e = emp(r.empId);
          return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<b>${esc(fullName(e))}</b></div></td><td>${esc(fullName(emp(e.managerId)))}</td><td>${r.date ? fmtDate(r.date) : '—'}</td><td>${reviewPill(r)}${e.category === 'Cadre' ? (r.workload ? ' <span class="pill ok">Charge de travail abordée</span>' : ` <button type="button" class="btn ghost sm" data-act="workload" data-id="${r.id}" title="Obligatoire chaque année pour les salariés au forfait jours (art. L3121-65)">Volet forfait jours fait</button>`) : ''}</td><td class="r"><button type="button" class="btn ghost sm" data-act="review" data-id="${r.id}">Ouvrir</button></td></tr>`; }).join('') || '<tr><td colspan="5" class="empty">Aucun entretien.</td></tr>'}</tbody></table></div>`)}`;
    } else if (ui.revTab === 'pro') {
      const list = employed().map((e) => [e, proState(e)]).sort((a, b) => proDue(a[0]).localeCompare(proDue(b[0])));
      body = `<p class="hint" style="margin:0">Depuis la loi du 24 octobre 2025, l’entretien de parcours professionnel a lieu tous les 4 ans, avec un état des lieux récapitulatif tous les 8 ans. Deux rendez-vous s’ajoutent : à mi-carrière (vers 45 ans) et en fin de carrière (avant 60 ans).</p>
        ${card('Échéances', '', `<div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Dernier entretien</th><th>À réaliser avant le</th><th>Statut</th><th></th></tr></thead><tbody>${list.map(([e, [st, cls]]) => { const open = db.reviews.find((r) => r.empId === e.id && r.kind === 'Entretien professionnel' && r.status !== 'Signé');
          return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)}${careerMeeting(e) ? ` · <b class="warn-t">${careerMeeting(e)}</b>` : ''}</small></div></div></td><td>${e.lastPro ? fmtDate(e.lastPro) : 'Aucun'}</td><td class="num">${fmtDate(proDue(e))}</td><td><span class="pill ${cls}">${st}</span></td>
          <td class="r">${open ? `<button type="button" class="btn ghost sm" data-act="review" data-id="${open.id}">${open.status}</button>` : `<button type="button" class="btn ghost sm" data-act="pro-new" data-id="${e.id}">Programmer</button>`}</td></tr>`; }).join('')}</tbody></table></div>`)}`;
    } else {
      body = `<div class="toolbar"><button type="button" class="btn primary" data-act="objective-new">${ic('plus')}Fixer un objectif</button></div>${employed().filter((e) => db.objectives.some((o) => o.empId === e.id)).map((e) => card(`${avatar(e, 'sm')} ${esc(fullName(e))}`, `<span class="muted">${esc(e.title)} · manager : ${esc(fullName(emp(e.managerId)))}</span>`, `<div class="card-b">${objectivesList(db.objectives.filter((o) => o.empId === e.id), false)}</div>`)).join('')}`;
    }
    return tabsBar('revTab', tabs) + body;
  }
  // V2 · suites d'un entretien : la formation et la mobilité évoquées deviennent de vraies demandes ; le refus d'un entretien professionnel est tracé.
  function reviewFollow(r, e, can) {
    if (!can) return '';
    const pro = r.kind === 'Entretien professionnel', open = !['Signé', 'Refusé par le salarié'].includes(r.status);
    const refuse = pro && open && !r.mgr ? `<div class="card card-b"><h3 style="font-size:15px;margin-bottom:6px">Refus du salarié</h3><p class="hint" style="margin:0 0 8px">L’obligation de l’employeur porte sur la proposition : si ${esc(e.firstName)} refuse l’entretien, trace-le pour ne pas paraître en défaut.</p><button type="button" class="btn ghost sm" data-act="review-refused" data-id="${r.id}">Le salarié refuse l’entretien</button></div>` : '';
    if (r.status === 'Refusé par le salarié') return `<div class="card card-b"><span class="pill warn">Proposé, refusé par le salarié le ${fmtDate(r.refusedAt)}</span></div>`;
    if (!r.mgr) return refuse;
    const fu = r.follow || {}, prop = r.mgr.proposal, tr = fu.train && db.enrollments.find((x) => x.id === fu.train), wi = fu.wish && db.wishes.find((x) => x.id === fu.wish);
    return `<div class="card card-b"><h3 style="font-size:15px;margin-bottom:8px">Suites de l’entretien</h3><div class="toolbar">
      ${tr ? `<span class="pill ok">Formation proposée : ${esc(training(tr.trainingId).title)} · ${esc(tr.status)}</span>` : `<button type="button" class="btn ${prop === 'Formation' ? 'primary' : 'ghost'} sm" data-act="review-train" data-id="${r.id}">${ic('plus')}Proposer une formation</button>`}
      ${wi ? `<span class="pill ok">Souhait de mobilité noté : ${esc(wi.target)}</span>` : `<button type="button" class="btn ${prop === 'Mobilité' || prop === 'Promotion' ? 'primary' : 'ghost'} sm" data-act="review-wish" data-id="${r.id}">${ic('plus')}Noter un souhait d’évolution</button>`}</div>
      <p class="hint" style="margin:8px 0 0">La formation part directement aux RH (déjà validée par le manager) ; le souhait apparaît dans Mobilité.</p></div>`;
  }
  MODALS['review-train'] = (m, shell, formShell, opt, f) => { const r = db.reviews.find((x) => x.id === m.id), e = emp(r.empId), list = db.trainings.filter((t) => t.sessions.some((s) => s >= TODAY));
    return formShell(`Proposer une formation à ${esc(fullName(e))}`, 'review-train', `<div class="form-grid">${f('rt-t', 'Formation', `<select id="rt-t" name="t" class="select">${list.map((t) => `<option value="${t.id}">${esc(t.title)} · ${t.hours} h</option>`).join('')}</select>`, true)}
      ${f('rt-why', 'Besoin identifié', `<input id="rt-why" name="why" class="input" maxlength="200" value="Besoin identifié lors de l’${esc(r.kind.toLowerCase())} ${r.year}">`, true)}</div>`, 'Proposer'); };
  MODALS['review-wish'] = (m, shell, formShell, opt, f) => { const r = db.reviews.find((x) => x.id === m.id), e = emp(r.empId);
    return formShell(`Souhait d’évolution de ${esc(fullName(e))}`, 'review-wish', `<div class="form-grid">${f('rw-k', 'Type', `<select id="rw-k" name="kind" class="select">${opt(['Évolution de poste', 'Changement de service', 'Mobilité géographique', 'Reconversion'], r.mgr.proposal === 'Promotion' ? 'Évolution de poste' : 'Changement de service')}</select>`)}
      ${f('rw-h', 'Horizon', `<select id="rw-h" name="horizon" class="select">${opt(['Moins d’un an', '1 à 2 ans', 'Plus de 2 ans'], '1 à 2 ans')}</select>`)}${f('rw-t', 'Poste ou service visé', '<input id="rw-t" name="target" class="input" maxlength="120">', true)}</div>`, 'Enregistrer'); };
  Object.assign(MOD_ACT, {
    'review-train'(d) { ui.modal = { type: 'review-train', id: d.id }; render(); },
    'review-wish'(d) { ui.modal = { type: 'review-wish', id: d.id }; render(); },
    'review-refused'(d) { const r = db.reviews.find((x) => x.id === d.id), e = emp(r.empId); Object.assign(r, { status: 'Refusé par le salarié', refusedAt: TODAY }); if (r.kind === 'Entretien professionnel') e.lastPro = TODAY;
      db.history.push({ id: uid('h'), empId: e.id, date: TODAY, label: 'Entretien professionnel', detail: 'Proposé par l’employeur, refusé par le salarié' }); toast('Refus tracé · l’obligation de proposer est remplie'); commit(); },
  });
  Object.assign(MOD_FORMS, {
    'review-train'(v) { const r = db.reviews.find((x) => x.id === ui.modal.id), e = emp(r.empId), t = training(v.t);
      if (!t) return formError('Choisis une formation.');
      const en = { id: uid('f'), empId: e.id, trainingId: t.id, session: t.sessions.find((s) => s >= TODAY), status: 'Validée manager', reason: (v.why || '').trim(), createdAt: TODAY, fromReview: r.id };
      db.enrollments.push(en); r.follow = Object.assign({}, r.follow, { train: en.id });
      notify('e1', `Formation « ${t.title} » proposée à ${fullName(e)} lors de son entretien : à valider.`); notify(e.id, `Ton manager te propose la formation « ${t.title} ».`);
      ui.modal = { type: 'review', id: r.id }; toast('Formation proposée · les RH la valident'); commit(); },
    'review-wish'(v) { const r = db.reviews.find((x) => x.id === ui.modal.id), e = emp(r.empId);
      if (!v.target.trim()) return formError('Indique le poste ou le service visé.');
      const w = { id: uid('w'), empId: e.id, kind: v.kind, target: v.target.trim(), horizon: v.horizon, comment: `Exprimé lors de l’${r.kind.toLowerCase()} ${r.year}`, status: 'Exprimé', mgrOpinion: 'Favorable', createdAt: TODAY, fromReview: r.id };
      db.wishes.push(w); r.follow = Object.assign({}, r.follow, { wish: w.id }); notify('e1', `Souhait d’évolution de ${fullName(e)} noté lors de son entretien : ${w.target}.`);
      ui.modal = { type: 'review', id: r.id }; toast('Souhait enregistré dans Mobilité'); commit(); },
  });
  MODALS.review = (m, shell) => {
    const r = db.reviews.find((x) => x.id === m.id), e = emp(r.empId), mgr = emp(e.managerId);
    const isEmp = me().id === e.id, isMgr = !!mgr && me().id === mgr.id, rh = ui.profile === 'rh';
    const signed = r.status === 'Signé';
    const dateBlock = !signed && (isMgr || rh)
      ? `<form data-form="review-date" class="toolbar" novalidate><div class="field" style="flex:1"><label for="rv-date">Date de l’entretien</label><input id="rv-date" name="date" type="date" class="input" value="${r.date || nextMonday(TODAY, 1)}"></div><button class="btn ghost" style="align-self:flex-end">${r.date ? 'Modifier la date' : 'Planifier'}</button></form>`
      : `<p style="margin:0"><b>Date :</b> ${r.date ? fmtDate(r.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'à fixer'}</p>`;
    const selfBlock = isEmp && r.status === 'Planifié'
      ? `<form data-form="review-self" novalidate><div class="form-grid"><div class="field"><label for="rs-rating">Mon appréciation globale</label>${ratingSelect('rs-rating', 'rating', 3)}</div>
        <div class="field full"><label for="rs-comment">Mes réussites, mes difficultés, mes envies</label><textarea id="rs-comment" name="comment" class="input" maxlength="800"></textarea></div></div><div class="toolbar" style="margin-top:10px"><span class="err" id="m-err"></span><button class="btn primary" style="margin-left:auto">Envoyer mon auto-évaluation</button></div></form>`
      : r.self ? `<p style="margin:0"><b>${r.self.rating} · ${RATING[r.self.rating]}</b></p><p class="muted" style="margin:4px 0 0">${esc(r.self.comment) || '—'}</p>` : `<p class="muted" style="margin:0">En attente de l’auto-évaluation de ${esc(e.firstName)}.</p>`;
    const mgrBlock = isMgr && r.status === 'Auto-évaluation faite'
      ? `<form data-form="review-mgr" novalidate><div class="form-grid"><div class="field"><label for="rm-rating">Appréciation du manager</label>${ratingSelect('rm-rating', 'rating', r.self ? r.self.rating : 3)}</div>
        <div class="field"><label for="rm-prop">Proposition</label><select id="rm-prop" name="proposal" class="select">${['Aucune', 'Augmentation', 'Promotion', 'Formation', 'Mobilité'].map((x) => `<option>${x}</option>`).join('')}</select></div>
        <div class="field full"><label for="rm-comment">Synthèse et objectifs pour l’an prochain</label><textarea id="rm-comment" name="comment" class="input" maxlength="800"></textarea></div></div><div class="toolbar" style="margin-top:10px"><span class="err" id="m-err"></span><button class="btn primary" style="margin-left:auto">Envoyer pour signature</button></div></form>`
      : r.mgr ? `<p style="margin:0"><b>${r.mgr.rating} · ${RATING[r.mgr.rating]}</b>${r.mgr.proposal && r.mgr.proposal !== 'Aucune' ? ` · <span class="pill accent">Proposition : ${esc(r.mgr.proposal)}</span>` : ''}</p><p class="muted" style="margin:4px 0 0">${esc(r.mgr.comment) || '—'}</p>`
        : `<p class="muted" style="margin:0">${r.status === 'Auto-évaluation faite' ? `À compléter par ${esc(fullName(mgr))}.` : 'Après l’auto-évaluation.'}</p>`;
    const sign = signed ? `<span class="pill ok">Signé le ${fmtDate(r.signedAt)}</span>` : isEmp && r.status === 'À signer' ? `<button type="button" class="btn primary" data-act="review-sign" data-id="${r.id}">${ic('check')}Signer l’entretien</button>` : '';
    return shell(`${r.kind} ${r.year} · ${esc(fullName(e))}`, `<div class="modal-b">${stepper(r)}${dateBlock}
      <div class="card card-b"><h3 style="font-size:15px;margin-bottom:8px">Auto-évaluation</h3>${selfBlock}</div>
      <div class="card card-b"><h3 style="font-size:15px;margin-bottom:8px">Évaluation du manager</h3>${mgrBlock}</div>
      ${r.kind === 'Entretien annuel' ? `<div class="card card-b"><h3 style="font-size:15px;margin-bottom:8px">Objectifs de l’année</h3>${objectivesList(db.objectives.filter((o) => o.empId === e.id), false)}</div>` : ''}${reviewFollow(r, e, isMgr || rh)}</div>`,
    `<div class="modal-f">${sign}<button type="button" class="btn ghost" data-act="modal-close">Fermer</button></div>`, true);
  };
  MODALS.objective = (m, shell, formShell, opt, f) => {
    const list = ui.profile === 'rh' ? employed() : scopeEmployees().filter(isEmployed);
    return formShell('Fixer un objectif', 'objective', `<div class="form-grid">${f('ob-emp', 'Collaborateur', `<select id="ob-emp" name="empId" class="select">${empOptions(list)}</select>`)}${f('ob-due', 'Échéance', `<input id="ob-due" name="due" type="date" class="input" value="${TODAY.slice(0, 4)}-12-31">`)}
      ${f('ob-title', 'Objectif (mesurable)', '<input id="ob-title" name="title" class="input" maxlength="140" placeholder="Ex. Réduire de 20 % le temps de réponse support">', true)}</div>`, 'Ajouter l’objectif');
  };
  Object.assign(MOD_ACT, {
    review(d) { ui.modal = { type: 'review', id: d.id }; render(); },
    'objective-new'() { ui.modal = { type: 'objective' }; render(); },
    campaign() {
      const missing = employed().filter((e) => e.stage >= 5 && e.stage < 13 && !annualOf(e.id));
      missing.forEach((e) => { db.reviews.push({ id: uid('r'), empId: e.id, kind: 'Entretien annuel', year: CAMPAIGN, date: null, status: 'À planifier', self: null, mgr: null }); notify(e.managerId, `Campagne ${CAMPAIGN} : planifiez l’entretien annuel de ${fullName(e)}.`); });
      toast(`${missing.length} entretien(s) annuel(s) créé(s), les managers sont prévenus`); commit();
    },
    'pro-new'(d) {
      const e = emp(d.id); const r = { id: uid('r'), empId: e.id, kind: 'Entretien professionnel', year: Number(TODAY.slice(0, 4)), date: null, status: 'À planifier', self: null, mgr: null };
      db.reviews.push(r); notify(e.managerId, `Entretien professionnel à planifier avec ${fullName(e)} (avant le ${fmtDate(proDue(e))}).`);
      ui.modal = { type: 'review', id: r.id }; toast('Entretien professionnel programmé'); commit();
    },
    'review-sign'(d) {
      const r = db.reviews.find((x) => x.id === d.id), e = emp(r.empId);
      r.status = 'Signé'; r.signedAt = TODAY;
      if (r.kind === 'Entretien professionnel') { e.lastPro = r.date || TODAY; tickJourney(e.id, 8, 3); } else tickJourney(e.id, 8, 2);
      notify(e.managerId, `${fullName(e)} a signé son ${r.kind.toLowerCase()}.`);
      if (r.mgr && r.mgr.proposal && r.mgr.proposal !== 'Aucune') notify('e1', `${r.kind} de ${fullName(e)} signé · proposition : ${r.mgr.proposal}.`);
      toast('Entretien signé'); commit();
    },
  });
  Object.assign(MOD_CHG, {
    'obj-progress'(v, d) { const o = db.objectives.find((x) => x.id === d.id); o.progress = Number(v); const emEl = document.querySelector(`#op-${o.id} + .obj-p`); if (emEl) emEl.textContent = `${o.progress} %`; save(); toast('Avancement mis à jour'); },
  });
  Object.assign(MOD_FORMS, {
    'review-date'(v) {
      if (!v.date) return toast('Choisissez une date.', 'info');
      const r = db.reviews.find((x) => x.id === ui.modal.id), e = emp(r.empId);
      r.date = v.date; if (r.status === 'À planifier') r.status = 'Planifié';
      notify(e.id, `${r.kind} prévu le ${fmtDate(v.date)} : pensez à faire votre auto-évaluation.`); toast('Date enregistrée'); commit();
    },
    'review-self'(v) {
      const r = db.reviews.find((x) => x.id === ui.modal.id), e = emp(r.empId);
      if (!v.comment.trim()) return formError('Ajoutez quelques mots sur votre année.');
      r.self = { rating: Number(v.rating), comment: v.comment.trim() }; r.status = 'Auto-évaluation faite';
      notify(e.managerId, `${fullName(e)} a rempli son auto-évaluation.`); toast('Auto-évaluation envoyée à votre manager'); commit();
    },
    'review-mgr'(v) {
      const r = db.reviews.find((x) => x.id === ui.modal.id), e = emp(r.empId);
      if (!v.comment.trim()) return formError('Rédigez une synthèse pour le collaborateur.');
      r.mgr = { rating: Number(v.rating), comment: v.comment.trim(), proposal: v.proposal }; r.status = 'À signer';
      notify(e.id, `Votre ${r.kind.toLowerCase()} est prêt : relisez-le et signez-le.`); toast('Évaluation envoyée pour signature'); commit();
    },
    objective(v) {
      if (!v.title.trim()) return formError('Décrivez l’objectif.');
      db.objectives.push({ id: uid('o'), empId: v.empId, title: v.title.trim(), due: v.due || `${TODAY.slice(0, 4)}-12-31`, progress: 0 });
      notify(v.empId, `Nouvel objectif : ${v.title.trim()}.`); tickJourney(v.empId, 8, 0);
      ui.modal = null; toast('Objectif ajouté'); commit();
    },
    feedback(v, form) {
      if (!v.text.trim()) { form.querySelector('#fb-err').textContent = 'Écrivez votre message.'; return; }
      db.feedback.push({ id: uid('fb'), from: me().id, to: v.to, text: v.text.trim(), date: TODAY });
      notify(v.to, `${fullName(me())} vous a envoyé un feedback.`); toast('Feedback envoyé'); commit();
    },
  });

  // ---------------------------------------------------------------- Formation
  const TR_PILL = { Demandée: 'warn', 'Validée manager': 'info', Validée: 'accent', Terminée: 'ok', Refusée: 'bad' };
  const trPill = (x) => `<span class="pill ${TR_PILL[x.status]}">${x.status === 'Validée' ? 'Inscrit·e' : x.status}</span>`;
  const training = (id) => db.trainings.find((t) => t.id === id);
  function budgetState() {
    const y = TODAY.slice(0, 4), cost = (st) => db.enrollments.filter((x) => st.includes(x.status) && x.session.slice(0, 4) === y).reduce((s, x) => s + training(x.trainingId).cost, 0);
    const used = cost(['Terminée']), engaged = cost(['Validée']), pending = cost(['Demandée', 'Validée manager']);
    return { total: db.trainingBudget, used, engaged, pending, left: db.trainingBudget - used - engaged };
  }
  function enrRow(x, actions) {
    const e = emp(x.empId), t = training(x.trainingId);
    return `<div class="req"><div class="who-cell">${avatar(e)}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)}</small></div></div><div class="what"><b>${esc(t.title)}</b><small>Session du ${fmtDate(x.session)} · ${t.hours} h · ${eur0(t.cost)}${x.reason ? ` · « ${esc(x.reason)} »` : ''}</small></div>${trPill(x)}${actions || ''}</div>`;
  }
  function catalogue() {
    const showCost = ui.profile !== 'salarie';
    return `${ui.profile === 'rh' ? `<div class="toolbar"><button type="button" class="btn primary" data-act="training-new">${ic('plus')}Ajouter une formation au catalogue</button></div>` : ''}
      <div class="cat-grid">${db.trainings.map((t) => { const next = t.sessions.filter((s) => s >= TODAY);
        return `<div class="card cat"><span class="pill neutral">${esc(t.category)}</span><h3>${esc(t.title)}</h3><p class="muted">${esc(t.provider)} · ${esc(t.mode)} · ${t.hours} h${showCost ? ` · ${eur0(t.cost)}` : ''}</p>
        <p class="muted" style="font-size:13px">${next.length ? `Prochaines sessions : ${next.map((s) => fmtShort(s)).join(', ')}` : 'Pas de session programmée'}</p>
        <button type="button" class="btn ghost" data-act="enroll" data-id="${t.id}" ${next.length ? '' : 'disabled'}>Demander cette formation</button></div>`; }).join('')}</div>`;
  }
  function myTrainings(e, readOnly) {
    const mine = db.enrollments.filter((x) => x.empId === e.id).sort((a, b) => b.session.localeCompare(a.session));
    return card('Mes formations', '', `<div class="req-list">${mine.length ? mine.map((x) => enrRow(x, readOnly ? '' : x.status === 'Terminée'
      ? `<label class="sr" for="tr-${x.id}">Mon évaluation</label><select id="tr-${x.id}" class="select" data-change="train-rate" data-id="${x.id}"><option value="">Évaluer la formation</option>${[5, 4, 3, 2, 1].map((k) => `<option value="${k}" ${x.rating === k ? 'selected' : ''}>${'★'.repeat(k)} ${k}/5</option>`).join('')}</select>`
      : x.status === 'Demandée' ? `<button type="button" class="btn ghost sm" data-act="train-cancel" data-id="${x.id}">Annuler</button>` : '')).join('') : '<div class="empty">Aucune formation pour le moment. Parcourez le catalogue.</div>'}</div>`);
  }
  function viewTraining() {
    const p = ui.profile, m = me();
    let tabs;
    if (p === 'salarie' && mobSal()) return `${myTrainings(m, true)}${desktopHint('Le catalogue et les demandes de formation sont')}`;
    if (p === 'salarie') tabs = [['catalogue', 'Catalogue'], ['mes', 'Mes formations']];
    else if (p === 'manager') { const ids = scopeSet(); tabs = [['valider', 'À valider', db.enrollments.filter((x) => x.status === 'Demandée' && ids.has(x.empId)).length], ['equipe', 'Formations de l’équipe'], ['impact', 'Efficacité', db.enrollments.filter((x) => coldDue(x) && ids.has(x.empId)).length], ['catalogue', 'Catalogue'], ['mes', 'Mes formations']]; }
    else tabs = [['plan', 'Plan de formation'], ['valider', 'À valider', db.enrollments.filter((x) => ['Demandée', 'Validée manager'].includes(x.status)).length], ['impact', 'Efficacité et financement', db.enrollments.filter(coldDue).length], ['catalogue', 'Catalogue']];
    pickTab('trTab', tabs);
    let body;
    if (ui.trTab === 'impact') body = trainingImpact();
    else if (ui.trTab === 'catalogue') body = catalogue();
    else if (ui.trTab === 'mes') body = myTrainings(m);
    else if (ui.trTab === 'valider') {
      const ids = scopeSet();
      const list = p === 'rh' ? db.enrollments.filter((x) => ['Demandée', 'Validée manager'].includes(x.status)) : db.enrollments.filter((x) => x.status === 'Demandée' && ids.has(x.empId));
      body = `${p === 'rh' ? `<p class="hint" style="margin:0">Budget restant : <b class="num">${eur0(budgetState().left)}</b>. La validation RH inscrit le collaborateur à la session.</p>` : ''}
        ${card('Demandes à valider', '', `<div class="req-list">${list.length ? list.map((x) => enrRow(x, `<div class="acts"><button type="button" class="btn ok sm" data-act="train-ok" data-id="${x.id}">${ic('check')}Valider</button><button type="button" class="btn bad sm" data-act="train-ko" data-id="${x.id}">Refuser</button></div>`)).join('') : '<div class="empty">Aucune demande en attente.</div>'}</div>`)}`;
    } else if (ui.trTab === 'equipe') {
      const ids = scopeSet(); const list = db.enrollments.filter((x) => ids.has(x.empId)).sort((a, b) => b.session.localeCompare(a.session));
      body = card('Formations de l’équipe', '', `<div class="req-list">${list.map((x) => enrRow(x)).join('') || '<div class="empty">Aucune formation.</div>'}</div>`);
    } else {
      const b = budgetState(), pct = (v) => `${(v / b.total) * 100}%`;
      const list = db.enrollments.slice().sort((a, b2) => b2.session.localeCompare(a.session));
      body = `<div class="card card-b"><div class="toolbar"><h3>Budget formation ${TODAY.slice(0, 4)}</h3><span class="muted num" style="margin-left:auto">${eur0(b.total)}</span></div>
        <div class="budget" style="margin-top:12px"><i style="width:${pct(b.used)};background:var(--ok)"></i><i style="width:${pct(b.engaged)};background:var(--accent)"></i><i style="width:${pct(b.pending)};background:var(--warn);opacity:.55"></i></div>
        <div class="legend" style="margin-top:10px"><span><i style="background:var(--ok)"></i>Réalisé ${eur0(b.used)}</span><span><i style="background:var(--accent)"></i>Engagé ${eur0(b.engaged)}</span><span><i style="background:var(--warn)"></i>En attente ${eur0(b.pending)}</span><span><b class="num">Restant ${eur0(b.left)}</b></span></div></div>
        ${card('Toutes les formations', '', `<div class="req-list">${list.map((x) => enrRow(x, x.status === 'Validée' ? `<button type="button" class="btn ghost sm" data-act="train-done" data-id="${x.id}">Marquer comme réalisée</button>` : '')).join('')}</div>`)}`;
    }
    return tabsBar('trTab', tabs) + body;
  }
  MODALS.enroll = (m, shell, formShell, opt, f) => {
    const t = training(m.id), next = t.sessions.filter((s) => s >= TODAY);
    return formShell(esc(t.title), 'enroll', `<p class="muted" style="margin:0">${esc(t.provider)} · ${esc(t.mode)} · ${t.hours} h. Votre demande sera validée par ${esc(fullName(approverOf(me())))}, puis par les RH.</p><div class="form-grid">
      ${f('en-session', 'Session', `<select id="en-session" name="session" class="select">${next.map((s) => `<option value="${s}">${fmtDate(s, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</option>`).join('')}</select>`, true)}
      ${f('en-reason', 'Pourquoi cette formation ?', '<textarea id="en-reason" name="reason" class="input" maxlength="300" placeholder="Ex. besoin identifié lors de mon entretien annuel"></textarea>', true)}</div>`, 'Envoyer la demande');
  };
  MODALS.training = (m, shell, formShell, opt, f) => formShell('Ajouter une formation', 'training', `<div class="form-grid">${f('tn-title', 'Intitulé', '<input id="tn-title" name="title" class="input" required>', true)}
    ${f('tn-prov', 'Organisme', '<input id="tn-prov" name="provider" class="input">')}${f('tn-cat', 'Catégorie', `<select id="tn-cat" name="category" class="select">${opt(['Métier', 'Management', 'Langues', 'Sécurité', 'Compétences transverses'])}</select>`)}
    ${f('tn-mode', 'Modalité', `<select id="tn-mode" name="mode" class="select">${opt(['Présentiel', 'Distanciel', 'Mixte'])}</select>`)}${f('tn-hours', 'Durée (heures)', '<input id="tn-hours" name="hours" type="number" min="1" class="input num" value="7">')}
    ${f('tn-cost', 'Coût par participant (€)', '<input id="tn-cost" name="cost" type="number" min="0" step="10" class="input num" value="500">')}${f('tn-s1', 'Session 1', `<input id="tn-s1" name="s1" type="date" class="input" value="${nextMonday(TODAY, 4)}">`)}
    ${f('tn-s2', 'Session 2 (facultatif)', '<input id="tn-s2" name="s2" type="date" class="input">')}</div>`, 'Ajouter au catalogue');
  Object.assign(MOD_ACT, {
    enroll(d) { ui.modal = { type: 'enroll', id: d.id }; render(); },
    'training-new'() { ui.modal = { type: 'training' }; render(); },
    'train-ok'(d) {
      const x = db.enrollments.find((y) => y.id === d.id), e = emp(x.empId), t = training(x.trainingId);
      if (ui.profile === 'rh') {
        if (budgetState().left < t.cost) { toast(`Budget insuffisant : il reste ${eur0(budgetState().left)}.`, 'info'); return; }
        x.status = 'Validée'; tickJourney(e.id, 9, 1);
        notify(e.id, `Vous êtes inscrit·e à « ${t.title} » le ${fmtDate(x.session)}.`); toast(`${fullName(e)} est inscrit·e`);
      } else {
        x.status = 'Validée manager'; notify('e1', `${fullName(me())} a validé la demande de formation de ${fullName(e)} (« ${t.title} »).`); toast('Demande transmise aux RH');
      }
      commit();
    },
    'train-ko'(d) { const x = db.enrollments.find((y) => y.id === d.id); x.status = 'Refusée'; notify(x.empId, `Votre demande de formation « ${training(x.trainingId).title} » n’a pas été retenue.`); toast('Demande refusée'); commit(); },
    'train-done'(d) { const x = db.enrollments.find((y) => y.id === d.id); x.status = 'Terminée'; tickJourney(x.empId, 9, 2); notify(x.empId, `Formation « ${training(x.trainingId).title} » réalisée : donnez votre avis.`); toast('Formation marquée comme réalisée'); commit(); },
    'train-cancel'(d) { db.enrollments = db.enrollments.filter((y) => y.id !== d.id); toast('Demande annulée'); commit(); },
  });
  MOD_CHG['train-rate'] = (v, d) => { if (!v) return; const x = db.enrollments.find((y) => y.id === d.id); x.rating = Number(v); tickJourney(x.empId, 9, 3); save(); toast('Merci pour votre évaluation'); };
  Object.assign(MOD_FORMS, {
    enroll(v) {
      const e = me(), t = training(ui.modal.id);
      if (db.enrollments.some((x) => x.empId === e.id && x.trainingId === t.id && !['Refusée', 'Terminée'].includes(x.status))) return formError('Vous avez déjà une demande en cours pour cette formation.');
      db.enrollments.push({ id: uid('f'), empId: e.id, trainingId: t.id, session: v.session, status: 'Demandée', reason: (v.reason || '').trim(), createdAt: TODAY });
      notify(approverOf(e).id, `${fullName(e)} demande la formation « ${t.title} » (${fmtShort(v.session)}).`); tickJourney(e.id, 9, 0);
      ui.modal = null; ui.trTab = 'mes'; toast(`Demande envoyée à ${fullName(approverOf(e))}`); commit();
    },
    training(v) {
      if (!v.title.trim()) return formError('Indiquez l’intitulé.');
      if (!v.s1) return formError('Indiquez au moins une session.');
      db.trainings.push({ id: uid('t'), title: v.title.trim(), provider: v.provider.trim() || 'Interne', category: v.category, hours: Number(v.hours) || 7, cost: Number(v.cost) || 0, mode: v.mode, sessions: [v.s1, v.s2].filter(Boolean).sort() });
      ui.modal = null; toast('Formation ajoutée au catalogue'); commit();
    },
  });

  // ---------------------------------------------------------------- Mobilité
  const WISH_PILL = { Exprimé: 'warn', 'En étude': 'info', Accepté: 'accent', Refusé: 'bad', Réalisé: 'ok' };
  const wishPill = (w) => `<span class="pill ${WISH_PILL[w.status]}">${w.status}</span>`;
  function wishRow(w, extra) {
    const e = emp(w.empId);
    return `<div class="req"><div class="who-cell">${avatar(e)}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)} · ${esc(e.dept)}</small></div></div>
      <div class="what"><b>${esc(w.kind)} : ${esc(w.target)}</b><small>${esc(w.horizon)} · exprimé le ${fmtDate(w.createdAt)}${w.comment ? ` · « ${esc(w.comment)} »` : ''}</small>${w.mgrOpinion ? `<small>Avis du manager : <b>${esc(w.mgrOpinion)}</b></small>` : ''}</div>${wishPill(w)}${extra || ''}</div>`;
  }
  function internalOffers() {
    const jobs = db.jobs.filter((j) => j.status === 'Ouverte');
    return `<div class="cat-grid">${jobs.map((j) => {
      const mine = db.candidates.find((c) => c.jobId === j.id && c.empId === me().id);
      const internal = db.candidates.filter((c) => c.jobId === j.id && c.source === 'Mobilité interne').length;
      return `<div class="card cat"><span class="pill ok">Offre interne</span><h3>${esc(j.title)}</h3><p class="muted">${esc(j.dept)} · ${esc(j.contract)} · ${esc(j.location)}</p><p style="margin:0;font-size:14px">${esc(j.description)}</p>
        ${ui.profile === 'rh' ? `<p class="muted" style="font-size:13px">${plural(internal, 'candidature interne', 'candidatures internes')}</p><button type="button" class="btn ghost" data-act="open-job" data-id="${j.id}">Voir le recrutement</button>`
          : mine ? `<span class="pill accent">Candidature envoyée · ${esc(mine.stage)}</span>` : `<button type="button" class="btn primary" data-act="apply-internal" data-id="${j.id}">Postuler en interne</button>`}</div>`; }).join('') || '<div class="card empty">Aucune offre ouverte pour le moment.</div>'}</div>`;
  }
  function viewMobility() {
    const p = ui.profile, m = me();
    let tabs;
    if (p === 'salarie') tabs = [['offres', 'Offres internes'], ['souhaits', 'Mes souhaits d’évolution']];
    else if (p === 'manager') { const ids = scopeSet(); tabs = [['souhaits', 'Souhaits de l’équipe', db.wishes.filter((w) => ids.has(w.empId) && !w.mgrOpinion && ['Exprimé', 'En étude'].includes(w.status)).length], ['offres', 'Offres internes'], ['talents', 'Revue des talents']]; }
    else tabs = [['souhaits', 'Souhaits d’évolution', db.wishes.filter((w) => w.status === 'Exprimé').length], ['changements', 'Changements de poste'], ['talents', 'Revue des talents'], ['succession', 'Plan de succession', employed().filter((e) => !e.exit && db.employees.some((x) => x.managerId === e.id && x.stage < 15) && !((db.succession || {})[e.id] || {}).succ).length], ['offres', 'Offres internes']];
    pickTab('mobTab', tabs);
    let body;
    if (ui.mobTab === 'talents') body = talentReview();
    else if (ui.mobTab === 'succession') body = successionView();
    else if (ui.mobTab === 'offres') body = internalOffers();
    else if (ui.mobTab === 'changements') {
      const h = db.history.slice().sort((a, b) => b.date.localeCompare(a.date));
      body = `<div class="toolbar"><button type="button" class="btn primary" data-act="move-new">${ic('plus')}Enregistrer un changement de poste</button><span class="hint">Un avenant est généré automatiquement dans les documents du collaborateur.</span></div>
        ${card('Historique des évolutions', '', `<div class="table-wrap"><table><thead><tr><th>Date d’effet</th><th>Collaborateur</th><th>Type</th><th>Détail</th></tr></thead><tbody>${h.map((x) => { const e = emp(x.empId);
          return `<tr><td class="num">${fmtDate(x.date)}</td><td><div class="who-cell">${avatar(e, 'sm')}<b>${esc(fullName(e))}</b></div></td><td><span class="pill accent">${esc(x.label)}</span></td><td>${esc(x.detail)}</td></tr>`; }).join('')}</tbody></table></div>`)}`;
    } else if (p === 'salarie') {
      const mine = db.wishes.filter((w) => w.empId === m.id);
      body = `<form class="card" data-form="wish" novalidate><div class="card-h"><h3>Exprimer un souhait d’évolution</h3><span class="muted" style="font-size:13px">Transmis à votre manager et aux RH</span></div><div class="card-b"><div class="form-grid">
        <div class="field"><label for="w-kind">Type</label><select id="w-kind" name="kind" class="select">${['Évolution de poste', 'Changement de service', 'Mobilité géographique', 'Reconversion'].map((x) => `<option>${x}</option>`).join('')}</select></div>
        <div class="field"><label for="w-hz">Horizon</label><select id="w-hz" name="horizon" class="select">${['Dans 6 mois', 'Dans 12 mois', 'Dans 2 ans'].map((x) => `<option>${x}</option>`).join('')}</select></div>
        <div class="field full"><label for="w-target">Poste ou service visé</label><input id="w-target" name="target" class="input" maxlength="100" placeholder="Ex. Lead UX Designer"></div>
        <div class="field full"><label for="w-comment">Pourquoi ? (facultatif)</label><textarea id="w-comment" name="comment" class="input" maxlength="400"></textarea></div></div>
        <div class="toolbar" style="margin-top:12px"><span class="err" id="w-err"></span><button class="btn primary" style="margin-left:auto">Envoyer</button></div></div></form>
        ${card('Mes souhaits', '', `<div class="req-list">${mine.map((w) => wishRow(w)).join('') || '<div class="empty">Aucun souhait exprimé.</div>'}</div>`)}`;
    } else if (p === 'manager') {
      const ids = scopeSet(); const list = db.wishes.filter((w) => ids.has(w.empId));
      body = card('Souhaits de l’équipe', '', `<div class="req-list">${list.map((w) => wishRow(w, !w.mgrOpinion && ['Exprimé', 'En étude'].includes(w.status) ? `<div class="acts"><button type="button" class="btn ok sm" data-act="wish-opinion" data-id="${w.id}" data-v="Favorable">Avis favorable</button><button type="button" class="btn ghost sm" data-act="wish-opinion" data-id="${w.id}" data-v="Réservé">Avis réservé</button></div>` : '')).join('') || '<div class="empty">Aucun souhait dans votre équipe.</div>'}</div>`);
    } else {
      body = card('Souhaits d’évolution', '', `<div class="req-list">${db.wishes.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((w) => wishRow(w, `<div class="acts"><label class="sr" for="ws-${w.id}">Statut</label><select id="ws-${w.id}" class="select" data-change="wish-status" data-id="${w.id}">${Object.keys(WISH_PILL).map((s) => `<option ${s === w.status ? 'selected' : ''}>${s}</option>`).join('')}</select>
        ${w.status === 'Accepté' ? `<button type="button" class="btn primary sm" data-act="move-new" data-id="${w.empId}" data-w="${w.id}">Appliquer</button>` : ''}</div>`)).join('') || '<div class="empty">Aucun souhait.</div>'}</div>`);
    }
    return tabsBar('mobTab', tabs) + body;
  }
  // V2 · changement de situation : différences, application immédiate ou à date.
  function situationDiff(e, ch) {
    const out = [], q0 = e.quotite || 100;
    if (ch.title !== e.title) out.push(`${e.title} → ${ch.title}`);
    if (ch.dept !== e.dept) out.push(`service ${e.dept} → ${ch.dept}`);
    if ((ch.managerId || null) !== (e.managerId || null)) out.push(`manager ${e.managerId ? fullName(emp(e.managerId)) : '—'} → ${ch.managerId ? fullName(emp(ch.managerId)) : '—'}`);
    if (ch.salary !== e.salary) out.push(`salaire ${eur0(e.salary)} → ${eur0(ch.salary)}`);
    if (ch.quotite !== q0) out.push(`temps de travail ${q0 === 100 ? 'plein' : `${q0} %`} → ${ch.quotite === 100 ? 'plein' : `${ch.quotite} %`}`);
    return out;
  }
  function applySituation(e, ch, date, label) {
    const parts = situationDiff(e, ch), oldMgr = e.managerId;
    Object.assign(e, { title: ch.title, dept: ch.dept, managerId: ch.managerId, salary: ch.salary, quotite: ch.quotite }); delete e.salaryNext; delete e.changeNext;
    db.history.push({ id: uid('h'), empId: e.id, date, label: label || 'Changement de situation', detail: parts.join(' · ') });
    if (oldMgr !== ch.managerId) { if (oldMgr) notify(oldMgr, `${fullName(e)} quitte ton équipe le ${fmtDate(date)}.`); if (ch.managerId) notify(ch.managerId, `${fullName(e)} rejoint ton équipe le ${fmtDate(date)}.`); }
  }
  function applyDueChanges() { db.employees.forEach((e) => { const c = e.changeNext; if (c && c.from <= TODAY) applySituation(e, c, c.from, c.label); }); }
  MODALS.move = (m, shell, formShell, opt, f) => {
    const e = m.empId ? emp(m.empId) : employed()[0], w = m.wishId ? db.wishes.find((x) => x.id === m.wishId) : null;
    const q = e.quotite || 100;
    return formShell('Changement de situation', 'move', `<p class="hint" style="margin:0 0 12px">Un seul formulaire pour tout ce qui change dans la situation du collaborateur. Les éléments du contrat (poste, salaire, temps de travail) donnent lieu à un avenant ; une date future programme le changement.</p><div class="form-grid">
      ${f('mv-emp', 'Collaborateur', m.empId ? `<input class="input" value="${esc(fullName(e))}" readonly><input type="hidden" name="empId" value="${e.id}">` : `<select id="mv-emp" name="empId" class="select">${empOptions(employed(), e.id)}</select>`)}
      ${f('mv-label', 'Type', `<select id="mv-label" name="label" class="select">${opt(['Promotion', 'Mobilité interne', 'Changement de service', 'Changement de manager', 'Augmentation', 'Passage à temps partiel', 'Retour à temps plein', 'Temps partiel thérapeutique', 'Réorganisation'], m.label || (w && w.kind === 'Changement de service' ? 'Changement de service' : 'Promotion'))}</select>`)}
      ${f('mv-title', 'Nouveau poste', `<input id="mv-title" name="title" class="input" value="${esc(w && w.kind === 'Évolution de poste' ? w.target : e.title)}">`)}${f('mv-dept', 'Service', `<select id="mv-dept" name="dept" class="select">${opt(DEPTS, e.dept)}</select>`)}
      ${f('mv-mgr', 'Manager', `<select id="mv-mgr" name="managerId" class="select"><option value="">Aucun</option>${empOptions(employed(), e.managerId)}</select>`)}${f('mv-salary', 'Salaire annuel brut (€)', `<input id="mv-salary" name="salary" type="number" min="0" step="100" class="input num" value="${e.salary}">`)}
      ${f('mv-q', 'Temps de travail', `<select id="mv-q" name="quotite" class="select">${[100, 90, 80, 70, 60, 50].map((x) => `<option value="${x}" ${x === q ? 'selected' : ''}>${x === 100 ? 'Temps plein' : `Temps partiel ${x} %`}</option>`).join('')}</select>`)}
      <p class="hint full" style="margin:0">Le salaire est exprimé sur la base d’un temps plein ; la paie applique la quotité.</p>
      ${f('mv-date', 'Date d’effet', `<input id="mv-date" name="date" type="date" class="input" value="${shiftMonth(monthKey(TODAY), 1)}-01">`, true)}
      <p class="hint full" style="margin:0">Date future : le changement est programmé ; la fiche et l’organigramme se mettent à jour à cette date. Date du jour ou passée : effet immédiat.</p></div>`, 'Enregistrer et générer l’avenant');
  };
  Object.assign(MOD_ACT, {
    'apply-internal'(d) {
      const j = db.jobs.find((x) => x.id === d.id), e = me();
      db.candidates.push({ id: uid('c'), jobId: j.id, name: fullName(e), email: e.email, phone: e.phone, source: 'Mobilité interne', experience: `${e.title} · ${e.dept} (en interne depuis ${seniority(e.startDate)})`, stage: 'Présélection', score: 0, notes: '', interviews: [], appliedAt: TODAY, empId: e.id, messages: [], offer: null, refusal: null, pool: false });
      notify('e1', `Candidature interne de ${fullName(e)} sur « ${j.title} ».`); if (DEPT_HEAD[j.dept] !== e.id) notify(DEPT_HEAD[j.dept], `Candidature interne de ${fullName(e)} sur « ${j.title} ».`);
      tickJourney(e.id, 10, 1); toast('Candidature interne envoyée aux RH'); commit();
    },
    'wish-opinion'(d) { const w = db.wishes.find((x) => x.id === d.id); w.mgrOpinion = d.v; if (w.status === 'Exprimé') w.status = 'En étude'; notify('e1', `${fullName(me())} donne un avis ${d.v.toLowerCase()} au souhait de ${fullName(emp(w.empId))}.`); toast('Avis transmis aux RH'); commit(); },
    'move-new'(d) { ui.modal = { type: 'move', empId: d.id || null, wishId: d.w || null }; render(); },
  });
  MOD_CHG['wish-status'] = (v, d) => { const w = db.wishes.find((x) => x.id === d.id); w.status = v; notify(w.empId, `Votre souhait d’évolution (« ${w.target} ») est maintenant : ${v}.`); toast('Statut mis à jour'); commit(); };
  Object.assign(MOD_FORMS, {
    wish(v, form) {
      if (!v.target.trim()) { form.querySelector('#w-err').textContent = 'Indiquez le poste ou le service visé.'; return; }
      const e = me(); db.wishes.push({ id: uid('w'), empId: e.id, kind: v.kind, target: v.target.trim(), horizon: v.horizon, comment: (v.comment || '').trim(), status: 'Exprimé', mgrOpinion: null, createdAt: TODAY });
      notify(e.managerId, `${fullName(e)} a exprimé un souhait d’évolution : ${v.target.trim()}.`); notify('e1', `Nouveau souhait d’évolution de ${fullName(e)}.`); tickJourney(e.id, 10, 0);
      toast('Souhait transmis à votre manager et aux RH'); commit();
    },
    move(v) {
      const e = emp(v.empId), salary = Number(v.salary);
      if (!v.title.trim()) return formError('Indiquez le nouveau poste.');
      if (!(salary > 0)) return formError('Indiquez un salaire supérieur à 0 €.');
      if (!v.date) return formError('Indiquez la date d’effet.');
      const ch = { title: v.title.trim(), dept: v.dept, managerId: v.managerId || null, salary, quotite: Number(v.quotite) || 100 }, parts = situationDiff(e, ch);
      if (!parts.length) return formError('Rien ne change : modifie au moins un élément.');
      if (ch.managerId && (ch.managerId === e.id || isUnder(ch.managerId, e.id))) return formError('Ce rattachement créerait une boucle dans l’organigramme.');
      const contractual = ch.title !== e.title || ch.salary !== e.salary || ch.quotite !== (e.quotite || 100);
      // Date future : tout le changement est programmé (et plus seulement le salaire) ; il s'applique à sa date.
      if (v.date > TODAY) { e.changeNext = Object.assign({ from: v.date, label: v.label }, ch); if (ch.salary !== e.salary) e.salaryNext = { amount: ch.salary, from: v.date }; }
      else applySituation(e, ch, v.date, v.label);
      if (!contractual) { if (ui.modal.wishId) db.wishes.find((x) => x.id === ui.modal.wishId).status = 'Réalisé'; ui.modal = null; toast(v.date > TODAY ? `Changement programmé au ${fmtDate(v.date)} : la fiche et l’organigramme seront mis à jour à cette date` : 'Changement enregistré'); commit(); return; }
      const av = addDoc(e.id, 'avenant', { title: `Avenant · ${ch.title}`, data: { title: ch.title, dept: ch.dept, salary, effective: v.date } }); av.html = fillTpl(tplOf('avenant').body, docCtx(e, av), tplOf('avenant').fields);
      if (ui.modal.wishId) db.wishes.find((x) => x.id === ui.modal.wishId).status = 'Réalisé';
      tickJourney(e.id, 10, 2); tickJourney(e.id, 5, 0);
      notify(e.id, `${v.label} à compter du ${fmtDate(v.date)} : votre avenant vous sera remis par les RH.`); if (e.managerId) notify(e.managerId, `${v.label} de ${fullName(e)} au ${fmtDate(v.date)}.`);
      ui.modal = { type: 'doc-edit', id: av.id }; toast(v.date > TODAY ? `Changement programmé au ${fmtDate(v.date)} · relisez l’avenant avant de le remettre` : 'Changement enregistré · relisez l’avenant avant de le remettre'); commit();
    },
  });

  // ---------------------------------------------------------------- Santé & QVT
  const QVT_Q = ['Ma charge de travail est soutenable', 'L’ambiance dans mon équipe est bonne', 'Je concilie bien vie pro et vie perso', 'Mon travail a du sens pour moi'];
  const VISIT_KINDS = ["Visite d'information et de prévention", 'Visite périodique', 'Visite de reprise', 'Visite de pré-reprise', 'Visite à la demande'];
  const INC_PILL = { Déclaré: 'warn', 'Transmis CPAM': 'info', Clos: 'ok' };
  const ADJ_PILL = { Demandé: 'warn', Accordé: 'ok', Refusé: 'bad' };
  function visitsDue(list) {
    const out = [];
    list.filter((e) => e.stage >= 2 && e.stage < 15).forEach((e) => {
      const vs = db.visits.filter((v) => v.empId === e.id);
      if (vs.some((v) => v.status === 'Planifiée')) return;
      const done = vs.filter((v) => v.status === 'Réalisée').sort((a, b) => b.date.localeCompare(a.date));
      if (!done.length) out.push({ e, kind: "Visite d'information et de prévention", deadline: addMonths(e.startDate, 3), why: `Embauche le ${fmtDate(e.startDate)} : visite dans les 3 mois` });
      else if (addYears(done[0].date, 5) < addDays(TODAY, 60)) out.push({ e, kind: 'Visite périodique', deadline: addYears(done[0].date, 5), why: `Dernière visite le ${fmtDate(done[0].date)} : renouvellement au plus tard tous les 5 ans` });
    });
    return out.sort((a, b) => a.deadline.localeCompare(b.deadline));
  }
  // Déclaration d'accident du travail à la CPAM : 48 h, dimanches et jours fériés non compris.
  const cpamDeadline = (d) => addOuvrables(d, 2);
  function qvtStats(month, ids) {
    const rs = db.survey.filter((s) => s.month === month && (!ids || ids.has(s.empId)));
    const avg = QVT_Q.map((_, k) => (rs.length ? rs.reduce((s, r) => s + r.answers[k], 0) / rs.length : 0));
    return { n: rs.length, avg, overall: rs.length ? avg.reduce((a, b) => a + b, 0) / avg.length : 0 };
  }
  function qvtResults(ids, label) {
    const months = [...new Set(db.survey.map((s) => s.month).concat(monthKey(TODAY)))].sort();
    const m = ui.qvtMonth && months.includes(ui.qvtMonth) ? ui.qvtMonth : months[months.length - 1]; ui.qvtMonth = m;
    const prev = months[months.indexOf(m) - 1];
    const cur = qvtStats(m, ids), before = prev ? qvtStats(prev, ids) : null;
    const pop = (ids ? scopeEmployees() : employed()).filter(isEmployed).length;
    const nav = `<div class="toolbar"><button type="button" class="icon-btn" data-act="qvt-month" data-m="${prev || ''}" ${prev ? '' : 'disabled'} aria-label="Mois précédent">${ic('left')}</button><h3 style="min-width:150px;text-align:center">${monthLabel(m)}</h3><button type="button" class="icon-btn" data-act="qvt-month" data-m="${months[months.indexOf(m) + 1] || ''}" ${months.indexOf(m) < months.length - 1 ? '' : 'disabled'} aria-label="Mois suivant">${ic('right')}</button></div>`;
    if (cur.n < 3) return card(`Baromètre QVT · ${label}`, nav, `<div class="empty">Résultats masqués : moins de 3 réponses (${cur.n}) ce mois-ci, pour préserver l’anonymat.</div>`);
    const delta = (k) => { if (!before || before.n < 3) return ''; const dd = cur.avg[k] - before.avg[k]; return `<small class="${dd >= 0 ? 'up' : 'down'} num">${dd >= 0 ? '+' : ''}${dd.toFixed(1).replace('.', ',')}</small>`; };
    let depts = '';
    if (!ids) depts = card('Par service', '<span class="muted" style="font-size:13px">Services de moins de 3 répondants masqués</span>', `<div class="table-wrap"><table><thead><tr><th>Service</th><th class="r">Réponses</th><th>Note moyenne</th></tr></thead><tbody>${DEPTS.map((dpt) => { const s = qvtStats(m, new Set(db.employees.filter((e) => e.dept === dpt).map((e) => e.id)));
      return `<tr><td>${dpt}</td><td class="r num">${s.n}</td><td>${s.n >= 3 ? `<span class="qv">${hbar(s.overall)}<b class="num">${s.overall.toFixed(1).replace('.', ',')}</b></span>` : '<span class="muted">Masqué</span>'}</td></tr>`; }).join('')}</tbody></table></div>`);
    return card(`Baromètre QVT · ${label}`, nav, `<div class="card-b"><p class="muted" style="margin:0 0 12px">Participation : <b class="num">${cur.n} / ${pop}</b> (${Math.round((cur.n / Math.max(1, pop)) * 100)} %) · note globale <b class="num">${cur.overall.toFixed(1).replace('.', ',')} / 5</b></p>
      ${QVT_Q.map((q, k) => `<div class="qrow"><span>${q}</span><span class="qv">${hbar(cur.avg[k], 5, cur.avg[k] < 3 ? 'var(--bad)' : cur.avg[k] < 3.6 ? 'var(--warn)' : 'var(--ok)')}<b class="num">${cur.avg[k].toFixed(1).replace('.', ',')}</b>${delta(k)}</span></div>`).join('')}</div>`) + depts;
  }
  function viewHealth() {
    const p = ui.profile, m = me();
    let tabs;
    const answered = db.survey.some((s) => s.empId === m.id && s.month === monthKey(TODAY));
    if (p === 'salarie') tabs = [['qvt', 'Baromètre du mois', answered ? 0 : 1], ['visites', 'Mes visites médicales'], ['accidents', 'Accidents et incidents'], ...(mobSal() ? [] : [['amenagements', 'Aménagement de poste']])];
    else if (p === 'manager') tabs = [['qvt', 'Baromètre de l’équipe'], ['accidents', 'Accidents et incidents'], ['amenagements', 'Aménagements de poste']];
    else tabs = [['visites', 'Visites médicales', visitsDue(db.employees).filter((x) => x.deadline < TODAY).length], ['accidents', 'Accidents et incidents', db.incidents.filter((x) => x.status === 'Déclaré').length], ['risques', 'Document unique (DUERP)'], ['qvt', 'Baromètre QVT'], ['amenagements', 'Aménagements de poste', db.adjustments.filter((x) => x.status === 'Demandé').length], ['retours', 'Retours d’absence', longAbsences().filter((a) => a.need && !db.visits.some((x) => x.empId === a.e.id && x.kind === 'Visite de reprise' && x.date >= a.start)).length]];
    pickTab('healthTab', tabs);
    const ids = p === 'rh' ? null : p === 'manager' ? scopeSet() : new Set([m.id]);
    const inScope = (id) => !ids || ids.has(id) || (p === 'manager' && id === m.id);
    let body;
    if (ui.healthTab === 'retours') body = returnsView();
    else if (ui.healthTab === 'qvt') {
      if (p === 'salarie') {
        body = answered ? `<div class="card card-b"><b>Merci, votre réponse de ${monthLabel(monthKey(TODAY)).toLowerCase()} est enregistrée.</b><p class="muted" style="margin:4px 0 0">Les réponses sont anonymes : les RH ne voient que des moyennes, jamais en dessous de 3 répondants.</p></div>${qvtResults(null, 'toute l’entreprise')}`
          : `<form class="card" data-form="survey" novalidate><div class="card-h"><h3>Baromètre de ${monthLabel(monthKey(TODAY)).toLowerCase()}</h3><span class="muted" style="font-size:13px">Anonyme · 1 minute</span></div><div class="card-b">${QVT_Q.map((q, k) => `<fieldset class="likert"><legend>${q}</legend><div>${[1, 2, 3, 4, 5].map((v) => `<label><input type="radio" name="q${k}" value="${v}" ${v === 4 ? 'checked' : ''}><span>${v}</span></label>`).join('')}</div><small class="muted">1 = pas du tout d’accord · 5 = tout à fait d’accord</small></fieldset>`).join('')}
            <div class="toolbar" style="margin-top:8px"><button class="btn primary" style="margin-left:auto">Envoyer mes réponses</button></div></div></form>`;
      } else body = qvtResults(ids, p === 'manager' ? `équipe ${m.dept}` : 'toute l’entreprise');
    } else if (ui.healthTab === 'visites') {
      const planned = db.visits.filter((v) => v.status === 'Planifiée' && inScope(v.empId)).sort((a, b) => a.date.localeCompare(b.date));
      const done = db.visits.filter((v) => v.status === 'Réalisée' && inScope(v.empId)).sort((a, b) => b.date.localeCompare(a.date));
      const due = visitsDue(p === 'rh' ? db.employees : [m]);
      body = `${card('À organiser', `<span class="pill ${due.some((x) => x.deadline < TODAY) ? 'bad' : 'warn'} num">${due.length}</span>`, `<div class="req-list">${due.map((x) => `<div class="req"><div class="who-cell">${avatar(x.e)}<div><b>${esc(fullName(x.e))}</b><small>${esc(x.why)}</small></div></div><div class="what"><b>${esc(x.kind)}</b><small>Avant le ${fmtDate(x.deadline)}</small></div>${x.deadline < TODAY ? '<span class="pill bad">En retard</span>' : '<span class="pill warn">À planifier</span>'}${p === 'rh' ? `<button type="button" class="btn primary sm" data-act="visit-new" data-id="${x.e.id}" data-k="${esc(x.kind)}">Planifier</button>` : ''}</div>`).join('') || '<div class="empty">Toutes les visites sont à jour.</div>'}</div>`)}
        ${card('Visites planifiées', '', `<div class="req-list">${planned.map((v) => { const e = emp(v.empId); return `<div class="req"><div class="who-cell">${avatar(e)}<b>${esc(fullName(e))}</b></div><div class="what"><b>${esc(v.kind)}</b><small>${fmtDate(v.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</small></div>
          ${p === 'rh' ? `<label class="sr" for="vr-${v.id}">Résultat</label><select id="vr-${v.id}" class="select" data-change="visit-result" data-id="${v.id}"><option value="">Saisir le résultat</option><option>Apte</option><option>Apte avec aménagement</option></select>` : '<span class="pill info">Planifiée</span>'}</div>`; }).join('') || '<div class="empty">Aucune visite planifiée.</div>'}</div>`)}
        ${card('Historique', '', `<div class="req-list">${done.slice(0, 8).map((v) => { const e = emp(v.empId); return `<div class="req"><div class="who-cell">${avatar(e, 'sm')}<b>${esc(fullName(e))}</b></div><div class="what"><b>${esc(v.kind)}</b><small>${fmtDate(v.date)}</small></div><span class="pill ${v.result === 'Apte' ? 'ok' : 'info'}">${esc(v.result)}</span></div>`; }).join('') || '<div class="empty">Aucune visite réalisée.</div>'}</div>`)}`;
    } else if (ui.healthTab === 'accidents') {
      const list = db.incidents.filter((x) => inScope(x.empId)).sort((a, b) => b.date.localeCompare(a.date));
      body = `<div class="toolbar"><button type="button" class="btn primary" data-act="incident-new">${ic('plus')}Déclarer un accident ou un incident</button>${p === 'rh' ? '<span class="hint">Un accident du travail ou de trajet se déclare à la CPAM sous 48 h (dimanches et jours fériés non compris).</span>' : ''}</div>
        ${card('Déclarations', '', `<div class="req-list">${list.map((x) => { const e = emp(x.empId), needCpam = ['Accident du travail', 'Accident de trajet'].includes(x.kind);
          const acts = p !== 'rh' ? '' : x.status === 'Déclaré' ? `<div class="acts">${needCpam ? `<button type="button" class="btn primary sm" data-act="incident-step" data-id="${x.id}" data-s="Transmis CPAM">Déclaration CPAM envoyée</button>` : ''}<button type="button" class="btn ghost sm" data-act="incident-step" data-id="${x.id}" data-s="Clos">Clore</button></div>` : x.status === 'Transmis CPAM' ? `<button type="button" class="btn ghost sm" data-act="incident-step" data-id="${x.id}" data-s="Clos">Clore</button>` : '';
          return `<div class="req"><div class="who-cell">${avatar(e)}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)}</small></div></div><div class="what"><b>${esc(x.kind)} · ${fmtDate(x.date)}</b><small>${esc(x.description)}${x.stopDays ? ` · arrêt de ${plural(x.stopDays, 'jour', 'jours')}` : ' · sans arrêt'}</small>
            ${needCpam && x.status === 'Déclaré' ? `<small class="${cpamDeadline(x.date) < TODAY ? 'err' : ''}">Déclaration CPAM avant le ${fmtDate(cpamDeadline(x.date))}</small>` : ''}</div><span class="pill ${INC_PILL[x.status]}">${x.status}</span>${acts}</div>`; }).join('') || '<div class="empty">Aucune déclaration.</div>'}</div>`)}`;
    } else if (ui.healthTab === 'risques') {
      const score = (r) => r.g * r.p, lvl = (s) => (s >= 9 ? ['bad', 'Prioritaire'] : s >= 5 ? ['warn', 'À surveiller'] : ['ok', 'Maîtrisé']);
      const list = db.risks.slice().sort((a, b) => score(b) - score(a));
      body = `<div class="toolbar"><button type="button" class="btn primary" data-act="risk-new">${ic('plus')}Ajouter un risque</button><span class="hint">Score = gravité × probabilité (1 à 4 chacune). Le document unique est mis à jour au moins une fois par an.</span></div>
        ${card('Document unique d’évaluation des risques', `<span class="muted num">${list.length} risques</span>`, `<div class="table-wrap"><table><thead><tr><th>Unité de travail</th><th>Risque</th><th class="r">G</th><th class="r">P</th><th>Score</th><th>Mesures de prévention</th><th>Statut</th></tr></thead><tbody>${list.map((r) => { const [c, l] = lvl(score(r));
          return `<tr><td>${esc(r.unit)}</td><td><b>${esc(r.risk)}</b></td><td class="r num">${r.g}</td><td class="r num">${r.p}</td><td><span class="pill ${c} num">${score(r)} · ${l}</span></td><td>${esc(r.measure)}</td>
          <td><label class="sr" for="rk-${r.id}">Statut</label><select id="rk-${r.id}" class="select" data-change="risk-status" data-id="${r.id}">${['À lancer', 'En cours', 'En place'].map((s) => `<option ${s === r.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td></tr>`; }).join('')}</tbody></table></div>`)}`;
    } else {
      const list = db.adjustments.filter((x) => inScope(x.empId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      body = `${p !== 'manager' ? `<div class="toolbar"><button type="button" class="btn primary" data-act="adjust-new">${ic('plus')}${p === 'rh' ? 'Enregistrer un aménagement' : 'Demander un aménagement'}</button></div>` : ''}
        ${card('Aménagements de poste', '', `<div class="req-list">${list.map((x) => { const e = emp(x.empId);
          return `<div class="req"><div class="who-cell">${avatar(e)}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)}</small></div></div><div class="what"><b>${esc(x.kind)}</b><small>${fmtDate(x.createdAt)}${x.comment ? ` · « ${esc(x.comment)} »` : ''}</small></div><span class="pill ${ADJ_PILL[x.status]}">${x.status}</span>
          ${p === 'rh' && x.status === 'Demandé' ? `<div class="acts"><button type="button" class="btn ok sm" data-act="adjust-step" data-id="${x.id}" data-s="Accordé">Accorder</button><button type="button" class="btn bad sm" data-act="adjust-step" data-id="${x.id}" data-s="Refusé">Refuser</button></div>` : ''}</div>`; }).join('') || '<div class="empty">Aucune demande.</div>'}</div>`)}`;
    }
    if (ui.healthTab === 'risques') body = duerpCard() + body;
    return tabsBar('healthTab', tabs) + body;
  }
  MODALS.visit = (m, shell, formShell, opt, f) => formShell(`Planifier une visite · ${esc(fullName(emp(m.id)))}`, 'visit', `<div class="form-grid">${f('vi-kind', 'Type de visite', `<select id="vi-kind" name="kind" class="select">${opt(VISIT_KINDS, m.kind)}</select>`, true)}
    ${f('vi-date', 'Date', `<input id="vi-date" name="date" type="date" class="input" value="${nextMonday(TODAY, 1)}">`)}${f('vi-time', 'Heure', '<input id="vi-time" name="time" type="time" class="input" value="09:30">')}</div><p class="hint" style="margin:0">Le collaborateur reçoit une notification avec la date de convocation.</p>`, 'Planifier la visite');
  MODALS.incident = (m, shell, formShell, opt, f) => {
    const list = ui.profile === 'rh' ? db.employees.filter((e) => e.stage >= 3 && e.stage < 15) : ui.profile === 'manager' ? [me()].concat(scopeEmployees().filter(isEmployed)) : [me()];
    return formShell('Déclarer un accident ou un incident', 'incident', `<div class="form-grid">${f('in-emp', 'Personne concernée', `<select id="in-emp" name="empId" class="select">${empOptions(list, me().id)}</select>`)}${f('in-date', 'Date', `<input id="in-date" name="date" type="date" class="input" value="${TODAY}">`)}
      ${f('in-kind', 'Type', `<select id="in-kind" name="kind" class="select">${opt(['Accident du travail', 'Accident de trajet', 'Incident sans arrêt', 'Presque-accident'])}</select>`)}${f('in-stop', 'Jours d’arrêt prescrits', '<input id="in-stop" name="stopDays" type="number" min="0" class="input num" value="0">')}
      ${f('in-desc', 'Circonstances', '<textarea id="in-desc" name="description" class="input" maxlength="400" placeholder="Lieu, heure, ce qui s’est passé, témoins…"></textarea>', true)}</div>`, 'Envoyer la déclaration');
  };
  MODALS.risk = (m, shell, formShell, opt, f) => formShell('Ajouter un risque', 'risk', `<div class="form-grid">${f('rk-unit', 'Unité de travail', '<input id="rk-unit" name="unit" class="input" placeholder="Ex. Bureaux · Paris">')}${f('rk-risk', 'Risque', '<input id="rk-risk" name="risk" class="input" placeholder="Ex. Port de charges">')}
    ${f('rk-g', 'Gravité (1 à 4)', `<select id="rk-g" name="g" class="select">${opt(['1', '2', '3', '4'], '2')}</select>`)}${f('rk-p', 'Probabilité (1 à 4)', `<select id="rk-p" name="p" class="select">${opt(['1', '2', '3', '4'], '2')}</select>`)}
    ${f('rk-measure', 'Mesures de prévention', '<input id="rk-measure" name="measure" class="input">', true)}</div>`, 'Ajouter');
  MODALS.adjust = (m, shell, formShell, opt, f) => formShell(ui.profile === 'rh' ? 'Enregistrer un aménagement' : 'Demander un aménagement de poste', 'adjust', `<div class="form-grid">
    ${ui.profile === 'rh' ? f('ad-emp', 'Collaborateur', `<select id="ad-emp" name="empId" class="select">${empOptions(employed())}</select>`, true) : ''}
    ${f('ad-kind', 'Aménagement', `<select id="ad-kind" name="kind" class="select">${opt(['Siège ergonomique', 'Écran supplémentaire', 'Bureau assis-debout', 'Horaires aménagés', 'Télétravail renforcé', 'Autre'])}</select>`, true)}
    ${f('ad-comment', 'Précisions', '<textarea id="ad-comment" name="comment" class="input" maxlength="300" placeholder="Ex. préconisation de la médecine du travail"></textarea>', true)}</div>`, ui.profile === 'rh' ? 'Enregistrer' : 'Envoyer la demande');
  Object.assign(MOD_ACT, {
    'qvt-month'(d) { if (d.m) { ui.qvtMonth = d.m; render(); } },
    'visit-new'(d) { ui.modal = { type: 'visit', id: d.id, kind: d.k }; render(); },
    'incident-new'() { ui.modal = { type: 'incident' }; render(); },
    'incident-step'(d) { const x = db.incidents.find((y) => y.id === d.id); x.status = d.s; toast(d.s === 'Clos' ? 'Déclaration close' : 'Transmission à la CPAM enregistrée'); commit(); },
    'risk-new'() { ui.modal = { type: 'risk' }; render(); },
    'adjust-new'() { ui.modal = { type: 'adjust' }; render(); },
    'adjust-step'(d) { const x = db.adjustments.find((y) => y.id === d.id); x.status = d.s; if (d.s === 'Accordé') tickJourney(x.empId, 11, 3); notify(x.empId, `Votre demande d’aménagement (${x.kind}) est ${d.s.toLowerCase()}e.`); toast(`Demande ${d.s.toLowerCase()}e`); commit(); },
  });
  Object.assign(MOD_CHG, {
    'visit-result'(v, d) { if (!v) return; const x = db.visits.find((y) => y.id === d.id); x.status = 'Réalisée'; x.result = v; tickJourney(x.empId, 11, 0); notify(x.empId, `Résultat de votre visite médicale : ${v}.`); toast('Résultat enregistré'); commit(); },
    'risk-status'(v, d) { db.risks.find((y) => y.id === d.id).status = v; save(); toast('Statut du risque mis à jour'); },
  });
  Object.assign(MOD_FORMS, {
    visit(v) {
      if (!v.date) return formError('Choisissez une date.');
      const e = emp(ui.modal.id); db.visits.push({ id: uid('v'), empId: e.id, kind: v.kind, date: v.date, status: 'Planifiée', result: null });
      notify(e.id, `Convocation : ${v.kind.toLowerCase()} le ${fmtDate(v.date)} à ${v.time || '09:30'}.`); ui.modal = null; toast('Visite planifiée, convocation envoyée'); commit();
    },
    incident(v) {
      if (!v.description.trim()) return formError('Décrivez les circonstances.');
      if (!v.date || v.date > TODAY) return formError('La date ne peut pas être dans le futur.');
      db.incidents.push({ id: uid('i'), empId: v.empId, date: v.date, kind: v.kind, description: v.description.trim(), stopDays: Number(v.stopDays) || 0, status: 'Déclaré', createdAt: TODAY });
      notify('e1', `${v.kind} déclaré pour ${fullName(emp(v.empId))} le ${fmtDate(v.date)}.`); tickJourney(v.empId, 11, 2);
      ui.modal = null; toast('Déclaration transmise aux RH'); commit();
    },
    risk(v) {
      if (!v.unit.trim() || !v.risk.trim()) return formError('Indiquez l’unité de travail et le risque.');
      db.risks.push({ id: uid('k'), unit: v.unit.trim(), risk: v.risk.trim(), g: Number(v.g), p: Number(v.p), measure: v.measure.trim() || 'À définir', status: 'À lancer' });
      ui.modal = null; toast('Risque ajouté au document unique'); commit();
    },
    adjust(v) {
      const empId = v.empId || me().id;
      db.adjustments.push({ id: uid('a'), empId, kind: v.kind, comment: (v.comment || '').trim(), status: ui.profile === 'rh' ? 'Accordé' : 'Demandé', createdAt: TODAY });
      if (ui.profile !== 'rh') notify('e1', `${fullName(me())} demande un aménagement de poste : ${v.kind}.`);
      ui.modal = null; toast(ui.profile === 'rh' ? 'Aménagement enregistré' : 'Demande envoyée aux RH'); commit();
    },
    survey(v) {
      db.survey.push({ id: uid('q'), empId: me().id, month: monthKey(TODAY), answers: QVT_Q.map((_, k) => Number(v['q' + k]) || 3) });
      tickJourney(me().id, 11, 4); toast('Merci ! Vos réponses sont anonymes.'); commit();
    },
  });

  // ---------------------------------------------------------------- Relations individuelles
  const CASE_PILL = { Ouvert: 'warn', 'En cours': 'info', Clos: 'ok' };
  const CASE_KINDS = ['Situation individuelle', 'Procédure disciplinaire', 'Médiation', 'Demande d’échange', 'Signalement manager'];
  const MEASURES = ['Aucune', 'Avertissement', 'Blâme', 'Mise à pied disciplinaire', 'Mutation disciplinaire', 'Licenciement'];
  function viewRelations() {
    const p = ui.profile, m = me();
    if (p === 'salarie') {
      const mine = db.cases.filter((c) => c.empId === m.id && c.openedBy === m.id);
      return `${whistleCard()}<form class="card" data-form="case-ask" novalidate><div class="card-h"><h3>Demander un échange avec les RH</h3><span class="muted" style="font-size:13px">Confidentiel · seuls les RH voient votre demande</span></div><div class="card-b"><div class="form-grid">
        <div class="field full"><label for="ca-title">Sujet</label><input id="ca-title" name="title" class="input" maxlength="100" placeholder="Ex. organisation de mon temps de travail"></div>
        <div class="field full"><label for="ca-msg">Message</label><textarea id="ca-msg" name="message" class="input" maxlength="800"></textarea></div></div>
        <div class="toolbar" style="margin-top:12px"><span class="err" id="ca-err"></span><button class="btn primary" style="margin-left:auto">Envoyer</button></div></div></form>
        ${card('Mes demandes', '', `<div class="req-list">${mine.map((c) => `<div class="req" style="align-items:flex-start"><div class="what"><b>${esc(c.title)}</b><small>Envoyée le ${fmtDate(c.openedAt)}</small>
          ${c.events.filter((ev) => ev.visible && ev.by !== m.id).map((ev) => `<div class="reply"><small>Réponse des RH · ${fmtDate(ev.date)}</small>${esc(ev.note)}</div>`).join('')}</div><span class="pill ${CASE_PILL[c.status]}">${c.status}</span></div>`).join('') || '<div class="empty">Aucune demande.</div>'}</div>`)}`;
    }
    if (p === 'manager') {
      const mine = db.cases.filter((c) => c.openedBy === m.id);
      return `<form class="card" data-form="case-report" novalidate><div class="card-h"><h3>Signaler une situation aux RH</h3><span class="muted" style="font-size:13px">Conflit, difficulté, comportement à traiter</span></div><div class="card-b"><div class="form-grid">
        <div class="field"><label for="cr-emp">Collaborateur concerné</label><select id="cr-emp" name="empId" class="select">${empOptions(scopeEmployees().filter(isEmployed))}</select></div>
        <div class="field"><label for="cr-date">Date des faits</label><input id="cr-date" name="facts" type="date" class="input" value="${TODAY}"></div>
        <div class="field full"><label for="cr-title">Objet</label><input id="cr-title" name="title" class="input" maxlength="100"></div>
        <div class="field full"><label for="cr-desc">Description factuelle</label><textarea id="cr-desc" name="description" class="input" maxlength="800" placeholder="Faits datés et observables, sans jugement"></textarea></div></div>
        <div class="toolbar" style="margin-top:12px"><span class="err" id="cr-err"></span><button class="btn primary" style="margin-left:auto">Transmettre aux RH</button></div></div></form>
        ${card('Mes signalements', '', `<div class="req-list">${mine.map((c) => { const e = emp(c.empId); return `<div class="req"><div class="who-cell">${avatar(e, 'sm')}<b>${esc(fullName(e))}</b></div><div class="what"><b>${esc(c.title)}</b><small>Transmis le ${fmtDate(c.openedAt)} · le suivi détaillé reste confidentiel</small></div><span class="pill ${CASE_PILL[c.status]}">${c.status}</span></div>`; }).join('') || '<div class="empty">Aucun signalement.</div>'}</div>`)}`;
    }
    const list = db.cases.filter((c) => !ui.caseStatus || c.status === ui.caseStatus).sort((a, b) => b.openedAt.localeCompare(a.openedAt));
    return `<div class="card card-b toolbar"><span class="pill bad">Confidentiel</span><span class="muted">Ces dossiers ne sont visibles que par les RH. Le collaborateur ne voit que les réponses qui lui sont adressées.</span></div>
      <div class="toolbar"><label class="sr" for="cs-f">Statut</label><select id="cs-f" class="select" data-change="caseStatus"><option value="">Tous les dossiers</option>${Object.keys(CASE_PILL).map((s) => `<option ${ui.caseStatus === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <button type="button" class="btn primary" style="margin-left:auto" data-act="case-new">${ic('plus')}Ouvrir un dossier</button></div>
      ${card('Dossiers', `<span class="muted num">${list.length}</span>`, `<div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Nature</th><th>Objet</th><th>Ouvert le</th><th>Statut</th><th></th></tr></thead><tbody>${list.map((c) => { const e = emp(c.empId);
        return `<tr class="click" data-act="case-open" data-id="${c.id}" tabindex="0"><td><div class="who-cell">${avatar(e, 'sm')}<b>${esc(fullName(e))}</b></div></td><td>${esc(c.kind)}</td><td>${esc(c.title)}</td><td class="num">${fmtDate(c.openedAt)}</td><td><span class="pill ${CASE_PILL[c.status]}">${c.status}</span></td><td class="r">${ic('right').replace('<svg', '<svg style="width:16px;height:16px"')}</td></tr>`; }).join('') || '<tr><td colspan="6" class="empty">Aucun dossier.</td></tr>'}</tbody></table></div>`)}`;
  }
  DRAWERS.case = (c) => {
    const e = emp(c.empId), disc = c.kind === 'Procédure disciplinaire';
    const dl = disc ? `<div class="card card-b"><h3 style="font-size:15px">Repères de procédure</h3><div class="info-grid" style="margin-top:8px">
      <div><span>Faits connus le</span>${c.facts ? fmtDate(c.facts) : '—'}</div><div><span>Engager la procédure avant le</span>${c.facts ? `<b class="${addMonths(c.facts, 2) < TODAY ? 'err' : ''}">${fmtDate(addMonths(c.facts, 2))}</b>` : '—'}</div>
      <div><span>Convocation présentée le</span><input type="date" class="input" value="${c.convocAt || ''}" data-change="case-convoc" data-id="${c.id}" aria-label="Date de présentation de la convocation"></div>
      <div><span>Entretien préalable</span>${c.interview ? fmtDate(c.interview) : 'À fixer'}${c.convocAt && c.interview && c.interview < addOuvrables(c.convocAt, 5) ? `<small class="warn-t" style="display:block">Pour un licenciement, au moins 5 jours ouvrables après la présentation de la convocation (au plus tôt le ${fmtDate(addOuvrables(c.convocAt, 5))})</small>` : ''}</div><div><span>Sanction notifiable</span>${c.interview ? `du ${fmtDate(addOuvrables(c.interview, 2))} au ${fmtDate(addMonths(c.interview, 1))}` : '—'}</div></div>
      <form data-form="case-interview" class="toolbar" style="margin-top:12px" novalidate><div class="field" style="flex:1"><label for="ci-date">Date de l’entretien préalable</label><input id="ci-date" name="interview" type="date" class="input" value="${c.interview || addOuvrables(TODAY, 6)}"></div><button class="btn ghost" style="align-self:flex-end">Enregistrer</button></form>
      <p class="hint" style="margin:10px 0 0">Repères indicatifs (Code du travail, art. L1332-2 et L1332-4) : prescription de 2 mois, sanction au plus tôt 2 jours ouvrables et au plus tard 1 mois après l’entretien. À valider avec votre conseil juridique.</p></div>` : '';
    return `<div class="drawer-h">${avatar(e, 'lg')}<div style="min-width:0"><h2>${esc(c.title)}</h2><p>${esc(fullName(e))} · ${esc(e.title)}</p><div class="toolbar" style="margin-top:6px"><span class="pill neutral">${esc(c.kind)}</span><span class="pill ${CASE_PILL[c.status]}">${c.status}</span></div></div>
      <button type="button" class="icon-btn drawer-x" data-act="close-drawer" aria-label="Fermer">${ic('x')}</button></div>
      <div class="drawer-b"><div class="toolbar"><label for="cs-st" class="muted">Statut</label><select id="cs-st" class="select" data-change="case-status" data-id="${c.id}">${Object.keys(CASE_PILL).map((s) => `<option ${s === c.status ? 'selected' : ''}>${s}</option>`).join('')}</select>
        ${disc ? `<label for="cs-me" class="muted">Mesure</label><select id="cs-me" class="select" data-change="case-measure" data-id="${c.id}">${MEASURES.map((s) => `<option ${s === (c.measure || 'Aucune') ? 'selected' : ''}>${s}</option>`).join('')}</select>` : ''}</div>
      ${dl}
      <div class="card"><div class="card-h"><h3>Chronologie</h3></div><div class="card-b"><ol class="timeline">${c.events.slice().sort((a, b) => a.date.localeCompare(b.date)).map((ev) => `<li><small>${fmtDate(ev.date)} · ${esc(ev.type)} · ${esc(fullName(emp(ev.by)))}${ev.visible ? ' · <span class="pill info">Visible par le collaborateur</span>' : ''}</small><p>${esc(ev.note)}</p></li>`).join('')}</ol>
        <form data-form="case-event" style="margin-top:14px" novalidate><div class="form-grid"><div class="field"><label for="ce-type">Type</label><select id="ce-type" name="type" class="select">${['Note interne', 'Entretien', 'Convocation envoyée', 'Échange', 'Réponse au collaborateur'].map((x) => `<option>${x}</option>`).join('')}</select></div>
        <div class="field"><label for="ce-date">Date</label><input id="ce-date" name="date" type="date" class="input" value="${TODAY}"></div>
        <div class="field full"><label for="ce-note">Contenu</label><textarea id="ce-note" name="note" class="input" maxlength="800"></textarea></div></div>
        <div class="toolbar" style="margin-top:10px"><span class="hint">« Réponse au collaborateur » est visible par ${esc(e.firstName)} ; les autres entrées restent internes.</span><span class="err" id="ce-err"></span><button class="btn primary" style="margin-left:auto">Ajouter</button></div></form></div></div></div>`;
  };
  MODALS['case-new'] = (m, shell, formShell, opt, f) => formShell('Ouvrir un dossier', 'case-new', `<div class="form-grid">${f('cn-emp', 'Collaborateur', `<select id="cn-emp" name="empId" class="select">${empOptions(employed())}</select>`)}
    ${f('cn-kind', 'Nature', `<select id="cn-kind" name="kind" class="select">${opt(CASE_KINDS.slice(0, 3))}</select>`)}${f('cn-title', 'Objet', '<input id="cn-title" name="title" class="input" maxlength="100">', true)}
    ${f('cn-facts', 'Date des faits (procédure disciplinaire)', `<input id="cn-facts" name="facts" type="date" class="input" value="${TODAY}">`)}${f('cn-note', 'Premiers éléments', '<textarea id="cn-note" name="note" class="input" maxlength="800"></textarea>', true)}</div>`, 'Ouvrir le dossier');
  Object.assign(MOD_ACT, {
    'case-new'() { ui.modal = { type: 'case-new' }; render(); },
    'case-open'(d) { ui.drawer = { type: 'case', id: d.id }; drawerAnim = true; render(); },
  });
  MOD_CHG.caseStatus = (v) => { ui.caseStatus = v; render(); };
  MOD_CHG['case-status'] = (v, d) => { const c = db.cases.find((x) => x.id === d.id); c.status = v; if (v === 'Clos') tickJourney(c.empId, 12, 3); toast(`Dossier : ${v}`); commit(); };
  MOD_CHG['case-measure'] = (v, d) => { const c = db.cases.find((x) => x.id === d.id); c.measure = v === 'Aucune' ? null : v; c.events.push({ date: TODAY, type: 'Mesure', note: v === 'Aucune' ? 'Aucune sanction retenue.' : `Mesure retenue : ${v}.`, by: me().id, visible: false }); tickJourney(c.empId, 12, 2); toast('Mesure enregistrée'); commit(); };
  Object.assign(MOD_FORMS, {
    'case-new'(v) {
      if (!v.title.trim()) return formError('Indiquez l’objet du dossier.');
      const c = { id: uid('d'), empId: v.empId, kind: v.kind, title: v.title.trim(), openedAt: TODAY, status: 'Ouvert', facts: v.kind === 'Procédure disciplinaire' ? v.facts : null, interview: null, measure: null, openedBy: me().id,
        events: v.note.trim() ? [{ date: TODAY, type: 'Note interne', note: v.note.trim(), by: me().id, visible: false }] : [] };
      db.cases.push(c); tickJourney(v.empId, 12, 0);
      ui.modal = null; ui.drawer = { type: 'case', id: c.id }; drawerAnim = true; toast('Dossier ouvert'); commit();
    },
    'case-event'(v, form) {
      if (!v.note.trim()) { form.querySelector('#ce-err').textContent = 'Le contenu est vide.'; return; }
      const c = db.cases.find((x) => x.id === ui.drawer.id), visible = v.type === 'Réponse au collaborateur';
      c.events.push({ date: v.date || TODAY, type: v.type, note: v.note.trim(), by: me().id, visible });
      if (c.status === 'Ouvert') c.status = 'En cours';
      if (visible) notify(c.empId, `Les RH ont répondu à votre demande « ${c.title} ».`);
      if (v.type === 'Entretien') tickJourney(c.empId, 12, 1);
      toast(visible ? 'Réponse envoyée au collaborateur' : 'Entrée ajoutée au dossier'); commit();
    },
    'case-interview'(v) {
      const c = db.cases.find((x) => x.id === ui.drawer.id);
      if (!v.interview) return toast('Choisissez une date.', 'info');
      c.interview = v.interview; c.events.push({ date: TODAY, type: 'Convocation envoyée', note: `Entretien préalable fixé au ${fmtDate(v.interview)}.`, by: me().id, visible: false });
      if (c.status === 'Ouvert') c.status = 'En cours'; toast('Entretien préalable enregistré'); commit();
    },
    'case-ask'(v, form) {
      if (!v.title.trim() || !v.message.trim()) { form.querySelector('#ca-err').textContent = 'Indiquez un sujet et un message.'; return; }
      const e = me(); db.cases.push({ id: uid('d'), empId: e.id, kind: 'Demande d’échange', title: v.title.trim(), openedAt: TODAY, status: 'Ouvert', facts: null, interview: null, measure: null, openedBy: e.id,
        events: [{ date: TODAY, type: 'Demande du collaborateur', note: v.message.trim(), by: e.id, visible: true }] });
      notify('e1', `${fullName(e)} demande un échange : « ${v.title.trim()} ».`); toast('Demande envoyée aux RH'); commit();
    },
    'case-report'(v, form) {
      if (!v.title.trim() || !v.description.trim()) { form.querySelector('#cr-err').textContent = 'Indiquez l’objet et décrivez les faits.'; return; }
      db.cases.push({ id: uid('d'), empId: v.empId, kind: 'Signalement manager', title: v.title.trim(), openedAt: TODAY, status: 'Ouvert', facts: v.facts || TODAY, interview: null, measure: null, openedBy: me().id,
        events: [{ date: TODAY, type: 'Signalement', note: v.description.trim(), by: me().id, visible: false }] });
      notify('e1', `${fullName(me())} signale une situation concernant ${fullName(emp(v.empId))}.`); toast('Signalement transmis aux RH'); commit();
    },
  });

  // ================================================================ Besoins de recrutement (étape « Besoin RH » de la roue)
  // Circuit : Demande → Validation RH → Validation direction (création de poste ou poste hors budget) → Rédaction de l'offre (manager demandeur et RH) → Validation et publication (RH seuls).
  const NEED_OPEN = ['Ouverte', 'Pourvue', 'Clôturée'];
  const isNeed = (j) => !NEED_OPEN.includes(j.status);
  const needsDirection = (j) => j.reason === 'Création de poste' || !j.budgeted;
  const needSteps = (j) => [['demande', 'Demande', j.requestedBy], ['rh', 'Validation RH', 'e1']]
    .concat(needsDirection(j) ? [['direction', 'Validation direction', DIR_ID()]] : []).concat([['redaction', 'Rédaction de l’offre', j.requestedBy], ['publication', 'Validation et publication', 'e1']]);
  // Le manager modifie son besoin tant qu'il est en brouillon ou renvoyé « À modifier » ; une fois envoyé, seuls les RH le modifient (jusqu'à la publication).
  const draftLike = (j) => ['Brouillon', 'À modifier'].includes(j.status);
  // Rédaction de l'offre partagée : le manager demandeur (ou le manager rattaché) et les RH écrivent le projet ; seuls les RH le valident et le publient.
  const adReady = (j) => !!(j.ad && j.ad.ready);
  const canWriteAd = (j) => j.status === 'Validée' && (ui.profile === 'rh' || (ui.profile === 'manager' && (j.requestedBy === me().id || jobManager(j) === me().id)));
  const canEditNeed = (j) => (ui.profile === 'rh' ? ['Brouillon', 'À modifier', 'En validation', 'Validée'].includes(j.status) : ui.profile === 'manager' && draftLike(j) && (jobManager(j) === me().id || j.requestedBy === me().id));
  function needsToDo() {
    if (ui.profile === 'rh') return db.jobs.filter((j) => ['En validation', 'Validée'].includes(j.status));
    if (ui.profile === 'manager') return scopeNeeds().filter((j) => draftLike(j) || (j.status === 'Validée' && !adReady(j) && canWriteAd(j)));
    return [];
  }
  const pubDate = (j) => j.publishedAt || ((j.approvals || []).find((a) => a.step === 'publication') || {}).date || null;
  // Recherche commune aux besoins et aux offres : référence (BES ou OFF), intitulé, demandeur ; service ; date d'émission ou de publication.
  function jobSearch(j, q, dept, from) {
    const t = q.trim().toLowerCase(), num = String(j.num || 0).padStart(3, '0');
    if (t && ![j.title, `bes-${j.createdAt.slice(0, 4)}-${num}`, `off-${j.createdAt.slice(0, 4)}-${num}`, fullName(emp(j.requestedBy))].some((x) => x.toLowerCase().includes(t))) return false;
    if (dept && j.dept !== dept) return false;
    if (from && (pubDate(j) || j.createdAt) < from) return false;
    return true;
  }
  function searchBar(pfx, opts = {}) {
    return `<div class="search-bar card"><label class="search-q">${ic('search')}<span class="sr">Rechercher</span><input class="input" type="search" value="${esc(ui[pfx + 'q'])}" placeholder="${opts.placeholder || 'Référence ou intitulé'}" data-input="${pfx}q"></label>
      ${ui.profile === 'rh' ? `<label class="sr" for="${pfx}-dept">Service</label><select id="${pfx}-dept" class="select" data-change="${pfx}Dept"><option value="">Tous les services</option>${DEPTS.map((d) => `<option ${d === ui[pfx + 'Dept'] ? 'selected' : ''}>${d}</option>`).join('')}</select>` : ''}
      ${opts.statuses ? `<label class="sr" for="${pfx}-st">Statut</label><select id="${pfx}-st" class="select" data-change="${pfx}Status"><option value="">Tous les statuts</option>${opts.statuses.map(([v, l]) => `<option value="${v}" ${v === ui[pfx + 'Status'] ? 'selected' : ''}>${l}</option>`).join('')}</select>` : ''}
      <label class="search-from">${opts.fromLabel || 'Depuis le'}<input class="input" type="date" value="${esc(ui[pfx + 'From'])}" data-change="${pfx}From"></label>
      ${ui[pfx + 'q'] || ui[pfx + 'Dept'] || ui[pfx + 'Status'] || ui[pfx + 'From'] ? `<button type="button" class="btn ghost sm" data-act="search-clear" data-p="${pfx}">Effacer</button>` : ''}</div>`;
  }
  // Journal : qui a fait quoi et quand, sur un besoin ou un candidat.
  const logTo = (o, text) => { o.log = o.log || []; o.log.push({ date: TODAY, by: me().id, text }); };
  const ALT_LABELS = { mobilite: 'Mobilité interne', taches: 'Répartition des tâches dans l’équipe', interim: 'Intérim, freelance ou sous-traitance', auto: 'Automatisation ou nouvel outil' };
  const DECISION_LABEL = { Soumise: 'Demande envoyée', Rédigée: 'Projet d’offre envoyé aux RH', Validée: 'Validée', 'À modifier': 'Modification demandée', Refusée: 'Refusée', Publiée: 'Offre publiée' };
  const flowText = (reason, budgeted) => {
    const dir = reason === 'Création de poste' || !budgeted;
    return `<p class="hint" style="margin:0">Circuit de validation : <b>RH</b>${dir ? ` → <b>Direction</b> (${reason === 'Création de poste' ? 'création de poste' : 'poste hors budget'})` : ''} → publication de l’offre.</p>`;
  };

  // Annonce : mentions interdites par le Code du travail (art. L.1132-1 et L.5321-2).
  const AD_RULES = [
    ['Âge', 'Critère d’âge interdit : décrivez plutôt l’expérience attendue (ex. « 5 ans d’expérience »).',
      ['jeunes?(?!\\s+(?:entreprise|start-?up|société|équipe|pousse))', 'junior', 'senior', 'âgée?s? de', 'moins de \\d+ ans(?!\\s*d[’\']exp)', 'plus de \\d+ ans(?!\\s*d[’\']exp)', '\\d+\\s*(?:-|à)\\s*\\d+\\s*ans']],
    ['Sexe', 'Mot genré : utilisez une forme neutre ou inclusive (ex. « assistant·e »), ou ajoutez « H/F ».',
      ['un homme', 'une femme', 'hommes? uniquement', 'femmes? uniquement', 'assistante', 'hôtesse', 'vendeuse', 'serveuse', 'développeuse']],
    ['Origine', 'Mention liée à l’origine ou à la nationalité interdite : précisez plutôt le niveau de langue (ex. « français courant »).',
      ['langue maternelle', '(?<!react\\s)(?<!applications?\\s)(?<!apps?\\s)(?<!code\\s)natifs?', '(?<!react\\s)(?<!applications?\\s)(?<!apps?\\s)(?<!code\\s)natives?', 'sans accent', 'de nationalité', 'nationalité française', 'européen(?:ne)?s?']],
    ['Santé et apparence', 'Critère lié à la santé ou à l’apparence interdit : décrivez les exigences réelles du poste.',
      ['bonne santé', 'bonne condition physique', 'physique agréable', 'bonne présentation', 'apparence']],
    ['Situation de famille', 'Critère lié à la situation de famille interdit.', ['célibataire', 'sans enfants?', 'mariée?', 'situation de famille', 'enceinte']],
  ].map(([cat, why, alts]) => ({ cat, why, re: new RegExp(`(?<!\\p{L})(?:${alts.join('|')})(?!\\p{L})`, 'giu') }));
  function lintAd(title, desc) {
    const text = `${title || ''}\n${desc || ''}`;
    const issues = AD_RULES.map((r) => ({ cat: r.cat, why: r.why, words: [...new Set((text.match(r.re) || []).map((w) => w.toLowerCase()))] })).filter((r) => r.words.length);
    return { issues, inclusive: /[hf]\s*\/\s*[hf]|·|\(e\)/i.test(title || '') };
  }
  function adLintHTML(title, desc, publishing) {
    const l = lintAd(title, desc);
    // Alerte, jamais blocage : l'analyse est automatique et peut se tromper (ex. « React Native »).
    const n = l.issues.reduce((x, i) => x + i.words.length, 0);
    const head = l.issues.length ? `<b>${ic('x')}${plural(n, 'terme à vérifier', 'termes à vérifier')}</b><p class="muted">Ces mots peuvent être discriminants selon le contexte. L’analyse est automatique et peut se tromper : relis-les, puis corrige-les ou publie tel quel.</p>` : `<b>${ic('check')}Aucune mention discriminatoire détectée</b>`;
    return `<div class="lint ${l.issues.length ? 'warn' : 'ok'}">${head}${l.issues.map((i) => `<p><b>${esc(i.cat)}</b> · « ${i.words.map(esc).join(' », « ')} » — ${esc(i.why)}</p>`).join('')}
      ${l.inclusive ? '' : '<p class="muted">Conseil : ajoutez « H/F » ou une forme inclusive à l’intitulé (ex. « Chef·fe de projet »).</p>'}</div>`;
  }

  // Talents internes : souhaits d'évolution (module Mobilité) qui correspondent au poste ou au service.
  function internalTalents(title, dept) {
    const words = String(title || '').toLowerCase().split(/[^\p{L}]+/u).filter((w) => w.length > 3);
    return db.wishes.filter((w) => ['Exprimé', 'En étude', 'Accepté'].includes(w.status)).map((w) => ({ w, e: emp(w.empId) })).filter(({ w, e }) => {
      if (!e || !isEmployed(e)) return false;
      const t = `${w.target} ${w.kind}`.toLowerCase();
      return t.includes(String(dept || '').toLowerCase()) || words.some((x) => t.includes(x)) || (w.kind === 'Évolution de poste' && e.dept === dept);
    });
  }
  function talentsHTML(title, dept) {
    const list = internalTalents(title, dept);
    return list.length ? `<div class="talents"><b>${plural(list.length, 'talent interne à considérer', 'talents internes à considérer')}</b>${list.map(({ w, e }) => `<div class="todo">${avatar(e, 'sm')}<div class="t"><b>${esc(fullName(e))}</b><small>${esc(e.title)} · ${esc(e.dept)} · souhaite : ${esc(w.target)} (${esc(w.horizon.toLowerCase())})</small></div></div>`).join('')}</div>`
      : '<p class="hint" style="margin:0">Aucun souhait de mobilité interne ne correspond à ce poste pour le moment.</p>';
  }

  function needError(j) {
    if (!j.title) return 'Indiquez l’intitulé du poste.';
    if (!(j.salaryMin > 0) || !(j.salaryMax > 0)) return 'Indiquez la fourchette de salaire annuel brut.';
    if (j.salaryMax < j.salaryMin) return 'Le salaire maximum doit être supérieur ou égal au minimum.';
    if (!j.startWanted) return 'Indiquez la date d’arrivée souhaitée.';
    if (j.reason === 'Remplacement' && !j.replaces) return 'Indiquez la personne remplacée.';
    if (j.reason === 'Création de poste' && !Object.keys(ALT_LABELS).some((k) => j.alternatives[k])) return 'Pour une création de poste, indiquez les alternatives étudiées avant de recruter.';
    if (!j.scorecard || !j.scorecard.must.length) return 'Indiquez au moins une compétence indispensable dans la fiche de cadrage.';
    if ((j.description || '').length < 20) return 'Décrivez les missions et le profil recherché.';
    return '';
  }
  function submitNeed(j) {
    j.status = 'En validation'; j.pending = 'rh'; j.refusedAt = null;
    j.approvals.push({ step: 'demande', by: me().id, decision: 'Soumise', date: TODAY, comment: '' });
    if (ui.profile === 'rh') decideNeed(j, 'Validée', 'Besoin émis par les RH.', me().id);
    else notify('e1', `${fullName(me())} a envoyé un besoin de recrutement à valider : ${j.title} (${j.dept}).`);
  }
  function decideNeed(j, decision, comment, by, reason) {
    const step = j.pending;
    j.approvals.push({ step, by, decision, date: TODAY, comment: reason ? `${reason}${comment ? ` · ${comment}` : ''}` : comment });
    comment = reason ? `${reason}${comment ? ` (${comment})` : ''}` : comment;
    const who = step === 'direction' ? 'La direction' : 'Les RH';
    if (decision === 'Validée') {
      if (step === 'rh' && needsDirection(j)) { j.pending = 'direction'; notify(j.requestedBy, `Votre besoin « ${j.title} » est validé par les RH et transmis à la direction.`); }
      else { j.pending = null; j.status = 'Validée'; notify(j.requestedBy, `Votre besoin « ${j.title} » est validé : rédigez l’offre avec les RH, qui la valideront et la publieront.`); }
    } else if (decision === 'À modifier') { j.pending = null; j.status = 'À modifier'; notify(j.requestedBy, `${who} demandent une modification de votre besoin « ${j.title} » : ${comment}`); }
    else { j.pending = null; j.status = 'Refusée'; j.refusedAt = step; notify(j.requestedBy, `${who} ont refusé votre besoin « ${j.title} » : ${comment}`); }
  }

  function needStepState(j, k, steps) {
    const order = (x) => steps.findIndex((s) => s[0] === x);
    const last = j.approvals.filter((a) => a.step === k).slice(-1)[0];
    if (k === 'demande') return ['Brouillon', 'À modifier'].includes(j.status) ? 'current' : 'done';
    if (j.status === 'Refusée') return j.refusedAt === k ? 'refused' : order(k) < order(j.refusedAt) ? 'done' : 'todo';
    if (j.status === 'À modifier') return last && last.decision === 'À modifier' && j.approvals[j.approvals.length - 1] === last ? 'returned' : 'todo';
    if (k === 'redaction') return NEED_OPEN.includes(j.status) || (j.status === 'Validée' && adReady(j)) ? 'done' : j.status === 'Validée' ? 'current' : 'todo';
    if (k === 'publication') return NEED_OPEN.includes(j.status) ? 'done' : j.status === 'Validée' && adReady(j) ? 'current' : 'todo';
    if (['Validée', ...NEED_OPEN].includes(j.status)) return 'done';
    if (j.status === 'En validation') return j.pending === k ? 'current' : order(k) < order(j.pending) ? 'done' : 'todo';
    return 'todo';
  }
  const STEP_PILL = { done: ['ok', 'Fait'], current: ['warn', 'En attente'], refused: ['bad', 'Refusée'], returned: ['warn', 'Modification demandée'], todo: ['neutral', 'À venir'] };
  function needFlowHTML(j) {
    const steps = needSteps(j);
    return `<ol class="flow">${steps.map(([k, label, by]) => {
      const st = needStepState(j, k, steps), last = j.approvals.filter((a) => a.step === k).slice(-1)[0], who = emp(last && st !== 'todo' && st !== 'current' ? last.by : by);
      const why = k === 'direction' ? ` · ${j.reason === 'Création de poste' ? 'création de poste' : 'poste hors budget'}` : '';
      const detail = last && ['done', 'refused', 'returned'].includes(st) ? `${DECISION_LABEL[last.decision]} par ${esc(fullName(who))} le ${fmtDate(last.date)}` : `${esc(fullName(who))}${st === 'current' ? ' · à traiter' : ''}`;
      return `<li class="s-${st}"><span class="flow-dot">${st === 'done' ? ic('check') : st === 'refused' ? ic('x') : ''}</span><div><div class="flow-t"><b>${label}</b><span class="pill ${STEP_PILL[st][0]}">${STEP_PILL[st][1]}</span></div>
        <small>${detail}${why}</small>${last && last.comment && st !== 'todo' ? `<q>${esc(last.comment)}</q>` : ''}</div></li>`; }).join('')}</ol>`;
  }
  // ---- Qui doit agir sur un besoin, et depuis combien de jours ouvrés
  const NEED_SLA = 5;
  const sinceTxt = (n) => (n ? `depuis ${plural(n, 'jour ouvré', 'jours ouvrés')}` : 'depuis aujourd’hui');
  function needWait(j) {
    const last = (j.approvals || []).slice(-1)[0], since = last ? last.date : j.createdAt;
    let who = null, label = '';
    if (j.status === 'Brouillon') { who = j.requestedBy; label = 'Envoi du brouillon'; }
    else if (j.status === 'À modifier') { who = j.requestedBy; label = 'Correction par le demandeur'; }
    else if (j.status === 'En validation') { who = j.pending === 'direction' ? DIR_ID() : 'e1'; label = j.pending === 'direction' ? 'Validation direction' : 'Validation RH'; }
    else if (j.status === 'Validée' && !adReady(j)) { who = j.requestedBy; label = 'Rédaction de l’offre (avec les RH)'; }
    else if (j.status === 'Validée') { who = 'e1'; label = 'Validation et publication de l’offre'; }
    const days = who ? workDays(addDays(since, 1), TODAY) : 0;
    return { who, label, since, days, late: !!who && j.status !== 'Brouillon' && days > NEED_SLA };
  }
  // Relance : un besoin qui attend une action depuis plus de 5 jours ouvrés (une fois par étape).
  function needReminders() {
    db.jobs.forEach((j) => {
      const w = needWait(j); if (!w.late || (j.remindAt && j.remindAt >= w.since)) return;
      j.remindAt = TODAY; const to = w.who === DIR_ID() ? 'e1' : w.who;
      notify(to, `Relance : le besoin « ${j.title} » (${jobRef(j)}) attend « ${w.label} » depuis ${w.days} jours ouvrés.`);
      if (to !== jobManager(j)) notify(jobManager(j), `Votre besoin « ${j.title} » attend « ${w.label} » depuis ${w.days} jours ouvrés : les RH sont relancés.`);
    });
  }
  const NEED_FILTERS = [['todo', 'À traiter par moi'], ['cours', 'En cours'], ['Brouillon', 'Brouillons'], ['En validation', 'En attente de validation'], ['À modifier', 'À modifier'], ['Validée', 'Validés, à publier'], ['publies', 'Publiés'], ['Refusée', 'Refusés']];
  const needMatch = (j, k) => !k || (k === 'todo' ? needsToDo().includes(j) : k === 'cours' ? !NEED_OPEN.includes(j.status) && j.status !== 'Refusée' : k === 'publies' ? NEED_OPEN.includes(j.status) : j.status === k);
  const STATUS_ORDER = ['Brouillon', 'À modifier', 'En validation', 'Validée', 'Ouverte', 'Pourvue', 'Clôturée', 'Refusée'];
  const PRIO_ORDER = { Urgente: 0, Normale: 1, Anticipée: 2 };
  const NEED_SORT = { ref: (j) => j.num || 0, title: (j) => j.title.toLowerCase(), dept: (j) => j.dept, req: (j) => fullName(emp(j.requestedBy)), status: (j) => STATUS_ORDER.indexOf(j.status),
    wait: (j) => needWait(j).label, since: (j) => (needWait(j).who ? needWait(j).days : -1), prio: (j) => PRIO_ORDER[j.priority] ?? 1 };
  const needFiltered = () => scopeNeeds().filter((j) => needMatch(j, ui.nStatus) && jobSearch(j, ui.nq, ui.nDept, ui.nFrom))
    .sort((a, b) => { const f = NEED_SORT[ui.nSort] || NEED_SORT.since, x = f(a), y = f(b); return (x < y ? -1 : x > y ? 1 : b.createdAt.localeCompare(a.createdAt)) * ui.nDir; });
  const historyRows = (rows) => rows.slice().sort((a, b) => b.date.localeCompare(a.date)).map((a) => `<div class="todo">${avatar(emp(a.by), 'sm')}<div class="t"><b>${esc(a.text)}</b><small>${esc(fullName(emp(a.by)))} · ${fmtDate(a.date)}</small></div></div>`).join('');
  const waitCell = (j) => { const w = needWait(j); return w.who ? `<span class="${w.late ? 'late' : ''}">${w.days ? plural(w.days, 'jour', 'jours') : 'aujourd’hui'}</span>` : '<span class="muted">—</span>'; };
  function needTable(list) {
    const th = (k, l, cls = '') => `<th class="${cls}" aria-sort="${ui.nSort === k ? (ui.nDir > 0 ? 'ascending' : 'descending') : 'none'}"><button type="button" class="th-sort" data-act="need-sort" data-k="${k}">${l}<span aria-hidden="true">${ui.nSort === k ? (ui.nDir > 0 ? '▲' : '▼') : ''}</span></button></th>`;
    const todo = needsToDo();
    return list.length ? `<table class="need-table"><thead><tr>${th('ref', 'Référence')}${th('title', 'Poste')}${th('dept', 'Service')}${th('req', 'Demandeur')}${th('status', 'Statut')}${th('wait', 'En attente de')}${th('since', 'Depuis', 'r')}${th('prio', 'Priorité')}</tr></thead>
      <tbody>${list.map((j) => { const w = needWait(j), mine = todo.includes(j);
        return `<tr class="click ${mine ? 'mine' : ''}" data-act="need-open" data-id="${j.id}" tabindex="0" aria-label="Ouvrir ${esc(j.title)}"><td class="num"><span class="ref">${jobRef(j)}</span></td><td><b>${esc(j.title)}</b><br><small class="muted">${esc(j.contract)} · ${esc(j.location)}</small></td><td>${esc(j.dept)}</td>
          <td>${esc(fullName(emp(j.requestedBy)))}</td><td>${jobPill(j)}</td><td>${w.who ? `${mine ? '<b class="you">Vous</b>' : esc(fullName(emp(w.who)))}<br><small class="muted">${esc(w.label)}</small>` : '<span class="muted">—</span>'}</td>
          <td class="r num">${waitCell(j)}</td><td><span class="pill ${j.priority === 'Urgente' ? 'bad' : j.priority === 'Anticipée' ? 'info' : 'neutral'}">${j.priority}</span></td></tr>`; }).join('')}</tbody></table>`
      : '<div class="empty">Aucun besoin ne correspond à ces critères.</div>';
  }
  // Frise courte du circuit (vue manager).
  function miniFlow(j) {
    const steps = needSteps(j);
    return `<ol class="mflow">${steps.map(([k, label]) => { const st = needStepState(j, k, steps); const short = { demande: 'Demande', rh: 'RH', direction: 'Direction', redaction: 'Offre', publication: 'Publication' }[k] || label; return `<li class="s-${st}"><i>${st === 'done' ? ic('check') : st === 'refused' ? ic('x') : ''}</i><span>${short}</span></li>`; }).join('')}</ol>`;
  }
  function viewNeeds() {
    if (ui.profile === 'manager') {
      const mine = scopeNeeds().sort((a, b) => b.createdAt.localeCompare(a.createdAt)), open = mine.filter((j) => !NEED_OPEN.includes(j.status) && j.status !== 'Refusée'), done = mine.filter((j) => !open.includes(j));
      const cardOf = (j) => { const w = needWait(j), me_ = w.who === me().id;
        return `<button type="button" class="need-card ${me_ ? 'mine' : ''}" data-act="need-open" data-id="${j.id}"><div class="toolbar"><span class="ref num">${jobRef(j)}</span>${jobPill(j)}${me_ ? '<span class="pill warn">À vous</span>' : ''}</div><b>${esc(j.title)}</b><small>${esc(j.contract)} · émis le ${fmtShort(j.createdAt)}</small>${miniFlow(j)}
          <small class="${w.late ? 'late' : ''}">${w.who ? `${me_ ? 'À vous' : `En attente de ${esc(fullName(emp(w.who)))}`} · ${esc(w.label)} · ${sinceTxt(w.days)}` : j.status === 'Refusée' ? 'Refusé' : 'Offre publiée : à suivre dans Recrutement'}</small></button>`; };
      return `<div class="need-head"><div><h2>Mes demandes</h2><p class="muted">Suivez où en est chacun de vos besoins de recrutement.</p></div><button type="button" class="btn primary" data-act="need-new">${ic('plus')}Exprimer un besoin</button></div>
        <h4 class="sub">En cours · ${open.length}</h4><div class="need-cards">${open.map(cardOf).join('') || '<div class="card empty">Aucune demande en cours.</div>'}</div>
        ${done.length ? `<h4 class="sub">Terminées · ${done.length}</h4><div class="need-cards">${done.map(cardOf).join('')}</div>` : ''}`;
    }
    if (ui.nStatus === 'auto') ui.nStatus = needsToDo().length ? 'todo' : 'cours';
    const list = needFiltered();
    return `${searchBar('n', { statuses: NEED_FILTERS, placeholder: 'Référence, intitulé ou demandeur', fromLabel: 'Émis ou publié depuis le' })}
      <div class="card"><div class="card-h"><h3><span id="need-count">${plural(list.length, 'besoin', 'besoins')}</span></h3><button type="button" class="btn primary sm" data-act="need-new">${ic('plus')}Exprimer un besoin</button></div><div class="table-wrap" id="need-list">${needTable(list)}</div></div>
      <p class="hint">Les besoins qui attendent depuis plus de ${NEED_SLA} jours ouvrés sont en orange, et la personne attendue est relancée automatiquement.</p>`;
  }
  // ---- Panneau latéral d'un besoin
  const needNavList = () => (ui.profile === 'manager' ? scopeNeeds().sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : needFiltered());
  const unreadOf = (j) => { const seen = (j.seen || {})[me().id] || 0; return (j.comments || []).slice(seen).filter((c) => c.by !== me().id).length; };
  DRAWERS.need = (j) => {
    const rh = ui.profile === 'rh', w = needWait(j), mine = needsToDo().includes(j), sc = j.scorecard || { must: [], nice: [], rounds: 0 }, tab = ui.drawer.tab || 'besoin';
    const list = needNavList(), idx = list.indexOf(j), prev = list[idx - 1], next = list[idx + 1];
    const nav = idx >= 0 ? `<div class="cand-nav"><button type="button" class="icon-btn" data-act="need-go" data-id="${prev ? prev.id : ''}" ${prev ? '' : 'disabled'} aria-label="Besoin précédent" title="Besoin précédent (←)">${ic('left')}</button><span class="num">${idx + 1} / ${list.length}</span><button type="button" class="icon-btn" data-act="need-go" data-id="${next ? next.id : ''}" ${next ? '' : 'disabled'} aria-label="Besoin suivant" title="Besoin suivant (→)">${ic('right')}</button></div>` : '';
    // Une action principale, les autres en second plan.
    let main = '', more = '';
    const edit = canEditNeed(j) ? `<button type="button" class="btn ghost sm" data-act="need-edit" data-id="${j.id}">${ic('edit')}Modifier</button>` : '';
    if (canEditNeed(j) && draftLike(j)) main = `<button type="button" class="btn primary" data-act="need-submit" data-id="${j.id}">${ic('arrow')}${rh ? 'Valider le besoin' : 'Envoyer en validation'}</button>`;
    else if (rh && j.status === 'En validation') { main = `<button type="button" class="btn primary" data-act="need-decide" data-id="${j.id}" data-d="Validée">${ic('check')}Valider${j.pending === 'direction' ? ' pour la direction' : ''}</button>`; more = `<button type="button" class="btn ghost sm" data-act="need-decide" data-id="${j.id}" data-d="À modifier">Demander une modification</button><button type="button" class="btn ghost sm bad-t" data-act="need-decide" data-id="${j.id}" data-d="Refusée">Refuser</button>`; }
    else if (canWriteAd(j)) main = `<button type="button" class="btn primary" data-act="need-publish" data-id="${j.id}">${ic('file')}${rh ? (adReady(j) ? 'Relire, valider et publier l’offre' : 'Rédiger l’offre') : adReady(j) ? 'Modifier le projet d’offre' : 'Rédiger l’offre'}</button>`;
    else if (NEED_OPEN.includes(j.status)) main = `<button type="button" class="btn primary" data-act="open-job" data-id="${j.id}">Voir l’offre et les candidats${ic('arrow')}</button>`;
    const refusal = j.status === 'Refusée' ? j.approvals.filter((a) => a.decision === 'Refusée').slice(-1)[0] : null;
    const banner = w.who ? `<div class="next-step ${mine ? 'mine' : ''} ${w.late ? 'late' : ''}"><div><small>PROCHAINE ÉTAPE</small><b>${esc(w.label)}</b><span>${mine ? 'À vous' : `En attente de ${esc(fullName(emp(w.who)))}`} · ${sinceTxt(w.days)}${w.late ? ' · relance envoyée' : ''}</span>
        ${j.pending === 'direction' && rh ? '<span class="hint">La direction n’a pas de profil dans cette démo : vous saisissez la décision de Claire Durand.</span>' : ''}</div><div class="toolbar">${main}${more}${edit}</div></div>`
      : `<div class="next-step done"><div><small>${j.status === 'Refusée' ? 'BESOIN REFUSÉ' : 'OFFRE PUBLIÉE'}</small><b>${j.status === 'Refusée' ? esc(refusal && refusal.comment || 'Refusé') : `${jobRef(j)} · ${JOB_PILL[j.status][1]}`}</b><span>${j.status === 'Refusée' ? `par ${esc(fullName(emp(refusal ? refusal.by : 'e1')))} le ${fmtDate(refusal ? refusal.date : j.createdAt)}` : 'Le besoin reste consultable ici ; l’offre se suit dans Recrutement.'}</span></div><div class="toolbar">${main}</div></div>`;
    const lock = !rh && !draftLike(j) && !NEED_OPEN.includes(j.status) && j.status !== 'Refusée' ? `<p class="hint lock">${ic('check')}${j.status === 'Validée' ? (canWriteAd(j) ? 'Besoin validé : rédigez l’offre avec les RH (onglet « Projet d’offre ») ; seuls les RH la valident et la publient.' : 'Besoin validé : l’offre est en cours de rédaction.') : 'Envoyé aux RH : seuls les RH peuvent désormais modifier ce besoin.'}</p>` : '';
    const unread = unreadOf(j), mgr = emp(jobManager(j)), repl = j.replaces && emp(j.replaces), talents = internalTalents(j.title, j.dept);
    const tabs = [['besoin', 'Le besoin'], ['cadrage', 'Fiche de cadrage'], ...(j.status === 'Validée' || j.ad ? [['offre', 'Projet d’offre']] : []), ['validation', 'Validation'], ['echanges', 'Échanges', unread]];
    let body;
    if (tab === 'cadrage') body = `<h4 class="sub">Compétences indispensables</h4>${sc.must.length ? `<ol class="crit-list">${sc.must.map((m) => `<li>${esc(m)}</li>`).join('')}</ol>` : '<p class="muted">À définir.</p>'}
      <h4 class="sub" style="margin-top:16px">Atouts appréciés</h4>${sc.nice.length ? `<div class="tags">${sc.nice.map((m) => `<span class="pill neutral">${esc(m)}</span>`).join('')}</div>` : '<p class="muted">—</p>'}
      <h4 class="sub" style="margin-top:16px">Entretiens prévus</h4><p>${sc.rounds ? plural(sc.rounds, 'entretien', 'entretiens') : '—'}</p><p class="hint">Ces compétences servent à évaluer chaque candidat après ses entretiens.</p>`;
    else if (tab === 'offre') { const a = j.ad;
      body = a ? `<div class="toolbar" style="margin-bottom:10px">${adReady(j) ? '<span class="pill ok">Envoyé aux RH</span>' : '<span class="pill warn">En rédaction</span>'}<small class="muted">Dernière modification par ${esc(fullName(emp(a.by)))} le ${fmtDate(a.at)}</small></div>
        <h4 class="sub">${esc(a.title)}</h4><p class="need-desc" style="white-space:pre-line">${esc(a.description)}</p>
        <p class="hint">Contributions : ${[...new Set((a.edits || []).map((x) => x.by))].map((x) => esc(fullName(emp(x)))).join(', ') || '—'}. Le manager demandeur et les RH rédigent ; seuls les RH valident et publient.</p>`
        : `<p class="muted">Le projet d’offre n’est pas encore commencé. Le manager demandeur et les RH peuvent le rédiger ; seuls les RH le valident et le publient.</p>`;
      if (canWriteAd(j)) body += `<button type="button" class="btn ${a ? 'ghost' : 'primary'} sm" data-act="need-publish" data-id="${j.id}">${ic('edit')}${a ? 'Modifier le projet' : 'Commencer la rédaction'}</button>`; }
    else if (tab === 'validation') body = `${needFlowHTML(j)}${(j.log || []).length ? `<h4 class="sub" style="margin-top:18px">Journal</h4>${historyRows(j.log)}` : ''}`;
    else if (tab === 'echanges') body = `<p class="hint" style="margin:0 0 8px">Échanges internes entre RH et manager ; le candidat ne les voit jamais.</p>${(j.comments || []).map((c) => `<div class="cmt ${c.by === me().id ? 'mine' : ''}">${avatar(emp(c.by), 'sm')}<div><b>${esc(fullName(emp(c.by)))}</b><small>${fmtDate(c.date)}</small><p>${esc(c.text)}</p></div></div>`).join('') || '<p class="muted" style="margin:0 0 8px">Aucun échange pour le moment.</p>'}
      <form data-form="need-comment" data-id="${j.id}" class="cmt-form"><label class="sr" for="nc-${j.id}">Votre commentaire</label><textarea id="nc-${j.id}" name="text" class="input" maxlength="400" placeholder="Une question, une précision…"></textarea><button class="btn primary sm">Envoyer</button></form>`;
    else body = `<p class="need-desc">${esc(j.description) || '<span class="muted">Description à rédiger.</span>'}</p>
      <div class="info-grid"><div><span>Motif</span>${esc(j.reason)}${repl ? ` de ${esc(fullName(repl))}` : ''}</div><div><span>Salaire annuel brut</span><span class="num">${esc(j.budget)}</span></div><div><span>Prévu au budget des effectifs</span>${j.budgeted ? 'Oui' : '<b style="color:var(--warn)">Non</b>'}</div>
        <div><span>Arrivée souhaitée</span>${fmtDate(j.startWanted)}</div><div><span>Demandeur</span>${esc(fullName(emp(j.requestedBy)))} · le ${fmtDate(j.createdAt)}</div><div><span>Manager rattaché</span>${mgr ? esc(fullName(mgr)) : '—'}</div></div>
      <h4 class="sub" style="margin-top:18px">Alternatives étudiées avant de recruter</h4><div class="steps">${Object.entries(ALT_LABELS).map(([k, l]) => `<div class="step ${j.alternatives[k] ? 'done' : ''}"><span class="ckbox" aria-checked="${!!j.alternatives[k]}">${ic('check')}</span><span>${l}</span></div>`).join('')}</div>${j.alternatives.note ? `<q>${esc(j.alternatives.note)}</q>` : ''}
      ${talents.length ? `<div class="callout-info">${talentsHTML(j.title, j.dept)}</div>` : ''}`;
    return `<div class="drawer-h"><div style="min-width:0"><div class="toolbar"><span class="ref num">${jobRef(j)}</span>${jobPill(j)}<span class="pill ${j.priority === 'Urgente' ? 'bad' : j.priority === 'Anticipée' ? 'info' : 'neutral'}">Priorité ${j.priority.toLowerCase()}</span></div>
        <h2 style="margin-top:8px">${esc(j.title)}</h2><p>${esc(j.dept)} · ${esc(j.contract)} · ${esc(j.location)} · arrivée souhaitée le ${fmtDate(j.startWanted)}</p></div>${nav}<button type="button" class="icon-btn drawer-x" data-act="close-drawer" aria-label="Fermer">${ic('x')}</button></div>
      <div class="drawer-b">${banner}${lock}<div class="tabs" role="tablist">${tabs.map(([k, l, n]) => `<button type="button" role="tab" aria-selected="${tab === k}" data-act="need-dtab" data-t="${k}">${l}${n ? `<span class="count num">${n}</span>` : ''}</button>`).join('')}</div><div class="need-tab-b">${body}</div></div>`;
  };
  Object.assign(MOD_ACT, {
    'need-new'() { ui.modal = { type: 'need', step: 0, isNew: true }; render(); },
    'need-edit'(d) { ui.modal = { type: 'need', id: d.id, step: 0 }; render(); },
    'need-open'(d) { ui.drawer = { type: 'need', id: d.id, tab: 'besoin' }; drawerAnim = true; render(); },
    'need-go'(d) { if (d.id) { ui.drawer = { type: 'need', id: d.id, tab: ui.drawer.tab === 'echanges' ? 'besoin' : ui.drawer.tab }; render(); } },
    'need-dtab'(d) { ui.drawer.tab = d.t; if (d.t === 'echanges') { const j = db.jobs.find((x) => x.id === ui.drawer.id); j.seen = Object.assign({}, j.seen, { [me().id]: (j.comments || []).length }); save(); } render(); },
    'need-sort'(d) { if (ui.nSort === d.k) ui.nDir *= -1; else { ui.nSort = d.k; ui.nDir = d.k === 'since' ? -1 : 1; } render(); },
    'open-need'(d) { const j = db.jobs.find((x) => x.id === d.id); Object.assign(ui, { view: 'besoins', stage: null, nq: '', nDept: '', nFrom: '', nStatus: '', drawer: { type: 'need', id: j.id, tab: 'besoin' }, notif: false }); drawerAnim = true; window.scrollTo(0, 0); render(); },
    'search-clear'(d) { ['q', 'Dept', 'Status', 'From'].forEach((k) => { ui[d.p + k] = ''; }); render(); },
    'need-submit'(d) {
      const j = db.jobs.find((x) => x.id === d.id), err = needError(j);
      if (err) { ui.modal = { type: 'need', id: j.id, err }; render(); return; }
      submitNeed(j); toast(ui.profile === 'rh' ? 'Besoin validé' : 'Besoin envoyé aux RH pour validation'); commit();
    },
    'need-decide'(d) { ui.modal = { type: 'need-decide', id: d.id, d: d.d }; render(); },
    'need-publish'(d) { ui.modal = { type: 'need-publish', id: d.id }; render(); },
  });
  Object.assign(MOD_CHG, {
    nDept(v) { ui.nDept = v; render(); }, nFrom(v) { ui.nFrom = v; render(); }, nStatus(v) { ui.nStatus = v; render(); },
  });
  Object.assign(MOD_LIVE, {
    need(form) {
      const fd = new FormData(form), d = ui.modal.data, g = (k) => (fd.has(k) ? fd.get(k) : d[k]), set = (id, h) => { const el = document.getElementById(id); if (el) el.innerHTML = h; };
      const reason = g('reason'), budgeted = fd.has('budgeted') ? fd.get('budgeted') !== 'non' : d.budgeted;
      set('j-flow', flowText(reason, budgeted)); set('j-internal', talentsHTML(g('title'), g('dept'))); set('j-lint', adLintHTML(g('title'), g('description'), false));
      const r = document.getElementById('j-repl'); if (r) r.hidden = reason !== 'Remplacement';
    },
    ad(form) { const fd = new FormData(form); document.getElementById('ad-lint').innerHTML = adLintHTML(fd.get('title'), fd.get('description'), true); },
  });
  Object.assign(MOD_FORMS, {
    'need-decide'(v) {
      const j = db.jobs.find((x) => x.id === ui.modal.id), d = ui.modal.d, comment = v.comment.trim();
      if (d === 'À modifier' && !comment) return formError('Un commentaire est obligatoire pour expliquer la modification attendue.');
      if (d === 'Refusée' && (!v.reason || (v.reason === 'Autre motif' && !comment))) return formError('Choisissez le motif du refus (et précisez-le en commentaire s’il s’agit d’un autre motif).');
      decideNeed(j, d, comment, j.pending === 'direction' ? DIR_ID() : me().id, d === 'Refusée' ? v.reason : '');
      ui.modal = null; toast(d === 'Validée' ? (j.status === 'Validée' ? 'Besoin validé : l’offre peut être rédigée avec le manager' : 'Besoin validé et transmis à la direction') : d === 'À modifier' ? 'Besoin renvoyé au demandeur' : 'Besoin refusé'); commit();
    },
    'need-publish'(v) {
      const j = db.jobs.find((x) => x.id === ui.modal.id), rh = ui.profile === 'rh', go = v.go || 'save'; // Entrée dans un champ : enregistre seulement
      if (!canWriteAd(j)) return formError('Seuls le manager demandeur et les RH peuvent rédiger cette offre.');
      if (!v.title.trim()) return formError('Indiquez l’intitulé de l’offre.');
      if (go === 'publish' && !rh) return formError('Seuls les RH peuvent valider et publier l’offre.');
      const first = !j.ad, a = j.ad = Object.assign({ edits: [] }, j.ad, { title: v.title.trim(), description: v.description.trim(), by: me().id, at: TODAY });
      a.edits.push({ by: me().id, at: TODAY });
      if (go === 'publish') {
        const flagged = lintAd(a.title, a.description).issues.flatMap((x) => x.words);
        a.ready = true; j.title = a.title; j.description = a.description; j.status = 'Ouverte'; j.publishedAt = TODAY;
        j.approvals.push({ step: 'publication', by: me().id, decision: 'Publiée', date: TODAY, comment: '' });
        if (flagged.length) logTo(j, `Publiée malgré ${plural(flagged.length, 'terme signalé', 'termes signalés')} : « ${flagged.join(' », « ')} »`);
        notify(j.requestedBy, `L’offre « ${j.title} » est validée et publiée par les RH : les candidatures peuvent arriver.`);
        Object.assign(ui, { modal: null, recJob: j.id }); toast(`Offre publiée sous la référence ${jobRef(j)} · à suivre dans Recrutement`); commit(); return;
      }
      if (go === 'send') {
        a.ready = true; j.approvals.push({ step: 'redaction', by: me().id, decision: 'Rédigée', date: TODAY, comment: '' }); logTo(j, 'Projet d’offre envoyé aux RH pour validation');
        notify('e1', `${fullName(me())} a terminé le projet d’offre « ${a.title} » : à relire, valider et publier.`);
        ui.modal = null; toast('Projet d’offre envoyé aux RH pour validation'); commit(); return;
      }
      logTo(j, first ? 'Rédaction de l’offre commencée' : 'Projet d’offre modifié');
      if (rh && j.requestedBy !== me().id) notify(j.requestedBy, `Les RH ont modifié le projet d’offre « ${a.title} ».`);
      else if (!rh && adReady(j)) notify('e1', `${fullName(me())} a modifié le projet d’offre « ${a.title} », déjà envoyé pour validation.`);
      ui.modal = null; toast('Projet d’offre enregistré'); commit();
    },
  });
  Object.assign(MOD_FORMS, {
    'need-comment'(v, form) {
      const j = db.jobs.find((x) => x.id === form.dataset.id), text = (v.text || '').trim(); if (!text) { toast('Le commentaire est vide.', 'info'); return; }
      j.comments = j.comments || []; j.comments.push({ by: me().id, date: TODAY, text }); j.seen = Object.assign({}, j.seen, { [me().id]: j.comments.length });
      const to = ui.profile === 'rh' ? jobManager(j) : 'e1'; if (to !== me().id) notify(to, `${fullName(me())} a commenté le besoin « ${j.title} » : ${text}`);
      toast('Commentaire envoyé'); commit();
    },
  });
  const NEED_REFUSALS = ['Hors budget', 'Besoin insuffisamment justifié', 'Une alternative interne est possible', 'Calendrier à revoir', 'Autre motif'];
  // ---- Formulaire en étapes : le poste, la justification et le budget, la fiche de cadrage, les missions, puis un récapitulatif.
  const NEED_STEPS = ['Le poste', 'Justification et budget', 'Fiche de cadrage', 'Missions et annonce', 'Récapitulatif'];
  const toNum = (x) => Number(String(x || '').replace(/\s/g, '')) || 0;
  function needDefaults() {
    const rh = ui.profile === 'rh', dept = rh ? 'Design' : me().dept;
    return { title: '', dept, managerId: rh ? DEPT_HEAD[dept] : me().id, contract: 'CDI', location: 'Paris', priority: 'Normale', startWanted: addDays(TODAY, 60), reason: 'Création de poste', replaces: null,
      salaryMin: '', salaryMax: '', budgeted: true, description: '', alternatives: { mobilite: false, taches: false, interim: false, auto: false, note: '' }, scorecard: { must: [], nice: [], rounds: 2 } };
  }
  const NEED_KEYS = ['title', 'dept', 'managerId', 'contract', 'location', 'priority', 'startWanted', 'reason', 'replaces', 'salaryMin', 'salaryMax', 'budgeted', 'description', 'alternatives', 'scorecard'];
  const needData = (j) => JSON.parse(JSON.stringify(Object.fromEntries(NEED_KEYS.map((k) => [k, j[k]]))));
  function mergeNeedStep(step, v, d) {
    const rh = ui.profile === 'rh';
    if (step === 0) Object.assign(d, { title: (v.title || '').trim(), dept: rh ? v.dept : me().dept, managerId: rh ? v.managerId || DEPT_HEAD[v.dept] : me().id, contract: v.contract, location: v.location, priority: v.priority, startWanted: v.startWanted });
    if (step === 1) Object.assign(d, { reason: v.reason, replaces: v.reason === 'Remplacement' ? v.replaces || null : null, salaryMin: toNum(v.salaryMin), salaryMax: toNum(v.salaryMax), budgeted: v.budgeted !== 'non',
      alternatives: { mobilite: !!v.alt_mobilite, taches: !!v.alt_taches, interim: !!v.alt_interim, auto: !!v.alt_auto, note: (v.altNote || '').trim() } });
    if (step === 2) d.scorecard = { must: [v.must1, v.must2, v.must3, v.must4].map((x) => (x || '').trim()).filter(Boolean), nice: (v.nice || '').split('\n').map((x) => x.trim()).filter(Boolean), rounds: Number(v.rounds) };
    if (step === 3) d.description = (v.description || '').trim();
    d.budget = d.salaryMin ? `${eur0(d.salaryMin).replace(/\s?€/, '')} – ${eur0(d.salaryMax)}` : 'À définir';
  }
  function needStepError(step, d) {
    if (step === 0) { if (!d.title) return 'Indiquez l’intitulé du poste.'; if (!d.startWanted) return 'Indiquez la date d’arrivée souhaitée.'; }
    if (step === 1) {
      if (!(d.salaryMin > 0) || !(d.salaryMax > 0)) return 'Indiquez la fourchette de salaire annuel brut.';
      if (d.salaryMax < d.salaryMin) return 'Le salaire maximum doit être supérieur ou égal au minimum.';
      if (d.reason === 'Remplacement' && !d.replaces) return 'Indiquez la personne remplacée.';
      if (d.reason === 'Création de poste' && !Object.keys(ALT_LABELS).some((k) => d.alternatives[k])) return 'Pour une création de poste, indiquez les alternatives étudiées avant de recruter.';
    }
    if (step === 2 && !d.scorecard.must.length) return 'Indiquez au moins une compétence indispensable.';
    if (step === 3 && (d.description || '').length < 20) return 'Décrivez les missions et le profil recherché (20 caractères au moins).';
    return '';
  }
  const firstBadStep = (d) => [0, 1, 2, 3].find((k) => needStepError(k, d)) ?? -1;
  // Enregistrement automatique du brouillon à chaque étape (sauf pour un besoin déjà envoyé, modifié par les RH).
  function persistNeedDraft(m) {
    const existing = m.id && db.jobs.find((x) => x.id === m.id);
    if ((existing && !draftLike(existing)) || !m.data.title) return false;
    const j = existing || { id: uid('j'), num: Math.max(0, ...db.jobs.map((x) => x.num || 0)) + 1, status: 'Brouillon', createdAt: TODAY, requestedBy: me().id, pending: null, refusedAt: null, approvals: [], comments: [], log: [], reviewers: [] };
    Object.assign(j, JSON.parse(JSON.stringify(m.data)));
    if (!existing) { db.jobs.push(j); logTo(j, 'Brouillon créé'); m.id = j.id; }
    save(); m.savedAt = new Date().toTimeString().slice(0, 5); return true;
  }
  Object.assign(MOD_FORMS, {
    need(v) {
      const m = ui.modal, rh = ui.profile === 'rh', nav = v.nav || 'next', step = m.step || 0;
      mergeNeedStep(step, v, m.data);
      if (nav === 'prev') { m.step = Math.max(0, step - 1); m.err = ''; persistNeedDraft(m); render(); return; }
      if (nav.startsWith('goto-')) { const to = Number(nav.slice(5)), bad = firstBadStep(m.data); m.step = bad >= 0 && bad < to ? bad : to; m.err = bad >= 0 && bad < to ? needStepError(bad, m.data) : ''; persistNeedDraft(m); render(); return; }
      if (nav === 'next') { const err = needStepError(step, m.data); if (err) { m.err = err; render(); return; } m.err = ''; m.step = step + 1; persistNeedDraft(m); render(); return; }
      if (nav === 'draft') { if (!m.data.title) { m.err = 'Indiquez au moins l’intitulé du poste.'; m.step = 0; render(); return; } persistNeedDraft(m); ui.modal = null; toast('Brouillon enregistré'); commit(); return; }
      // Envoi final
      const err = needError(m.data); if (err) { const bad = firstBadStep(m.data); m.step = bad >= 0 ? bad : 4; m.err = err; render(); return; }
      const existing = m.id && db.jobs.find((x) => x.id === m.id), saveOnly = existing && !draftLike(existing);
      const j = existing || { id: uid('j'), num: Math.max(0, ...db.jobs.map((x) => x.num || 0)) + 1, status: 'Brouillon', createdAt: TODAY, requestedBy: me().id, pending: null, refusedAt: null, approvals: [], comments: [], log: [], reviewers: [] };
      Object.assign(j, m.data); if (!existing) db.jobs.push(j);
      logTo(j, saveOnly ? 'Besoin modifié par les RH' : 'Besoin complété');
      if (saveOnly) { if (jobManager(j) !== me().id) notify(jobManager(j), `Les RH ont modifié votre besoin « ${j.title} ».`); } else submitNeed(j);
      Object.assign(ui, { modal: null, view: 'besoins', stage: ui.stage, drawer: { type: 'need', id: j.id, tab: 'besoin' } });
      toast(saveOnly ? 'Modifications enregistrées' : rh ? 'Besoin validé par les RH' : 'Besoin envoyé aux RH pour validation'); commit();
    },
  });
  MODALS.need = (m, shell, formShell, opt, f) => {
    const rh = ui.profile === 'rh', job = m.id && db.jobs.find((x) => x.id === m.id);
    if (!m.data) m.data = job ? needData(job) : needDefaults();
    const j = m.data, step = m.step || 0, sc = j.scorecard, L = 'data-live="need"', saveOnly = job && !draftLike(job);
    const people = db.employees.filter((e) => rh || e.dept === me().dept).map((e) => [e.id, `${fullName(e)} · ${e.title}`]);
    const mgrs = db.employees.filter((e) => isEmployed(e) && (Object.values(DEPT_HEAD).includes(e.id) || db.employees.some((x) => x.managerId === e.id))).map((e) => [e.id, `${fullName(e)} · ${e.dept}`]);
    const wiz = `<ol class="wiz">${NEED_STEPS.map((l, k) => `<li class="${k === step ? 'now' : k < 4 && !needStepError(k, j) ? 'ok' : ''}"><button name="nav" value="goto-${k}" ${k === step ? 'aria-current="step"' : ''}><i class="num">${k + 1}</i>${l}</button></li>`).join('')}</ol>`;
    let body = '';
    if (step === 0) body = `<div class="form-grid">${f('j-title', 'Intitulé du poste *', `<input id="j-title" name="title" class="input" value="${esc(j.title)}" placeholder="Ex. Product Designer H/F" ${L}>`, true)}
      ${f('j-dept', 'Service', rh ? `<select id="j-dept" name="dept" class="select" ${L}>${opt(DEPTS, j.dept)}</select>` : `<input id="j-dept" name="dept" class="input" value="${esc(j.dept)}" readonly>`)}${rh ? f('j-mgr', 'Manager rattaché', `<select id="j-mgr" name="managerId" class="select">${opt(mgrs, j.managerId || DEPT_HEAD[j.dept])}</select>`) : ''}
      ${f('j-contract', 'Contrat', `<select id="j-contract" name="contract" class="select">${opt(['CDI', 'CDD', 'Alternance', 'Stage'], j.contract)}</select>`)}${f('j-loc', 'Lieu', `<select id="j-loc" name="location" class="select">${opt([...SITES(), ...SITES().map((x) => `${x} · hybride`), 'Télétravail'], j.location)}</select>`)}
      ${f('j-prio', 'Priorité', `<select id="j-prio" name="priority" class="select">${opt(['Urgente', 'Normale', 'Anticipée'], j.priority)}</select>`)}${f('j-start', 'Arrivée souhaitée *', `<input id="j-start" name="startWanted" type="date" class="input" value="${esc(j.startWanted)}">`)}</div>`;
    if (step === 1) body = `<div class="form-grid">${f('j-reason', 'Motif', `<select id="j-reason" name="reason" class="select" ${L}>${opt(['Création de poste', 'Remplacement', 'Surcroît d’activité'], j.reason)}</select>`)}
      <div class="field" id="j-repl" ${j.reason === 'Remplacement' ? '' : 'hidden'}><label for="j-replaces">Personne remplacée *</label><select id="j-replaces" name="replaces" class="select"><option value="">Choisir…</option>${opt(people, j.replaces)}</select></div>
      ${f('j-min', 'Salaire annuel brut minimum (€) *', `<input id="j-min" name="salaryMin" type="number" min="0" step="500" class="input num" value="${esc(j.salaryMin)}">`)}${f('j-max', 'Salaire annuel brut maximum (€) *', `<input id="j-max" name="salaryMax" type="number" min="0" step="500" class="input num" value="${esc(j.salaryMax)}">`)}
      <fieldset class="field full radios"><legend>Poste prévu au budget des effectifs ${TODAY.slice(0, 4)} ?</legend><label><input type="radio" name="budgeted" value="oui" ${j.budgeted ? 'checked' : ''} ${L}> Oui</label><label><input type="radio" name="budgeted" value="non" ${j.budgeted ? '' : 'checked'} ${L}> Non</label></fieldset>
      <div class="full" id="j-flow">${flowText(j.reason, j.budgeted)}</div></div>
      <h3 class="sec">Alternatives étudiées avant de recruter</h3><div class="checks">${Object.entries(ALT_LABELS).map(([k, l]) => `<label><input type="checkbox" name="alt_${k}" ${j.alternatives[k] ? 'checked' : ''}> ${l}</label>`).join('')}</div>
      ${f('j-altnote', 'Pourquoi ces alternatives ne suffisent pas (facultatif)', `<input id="j-altnote" name="altNote" class="input" maxlength="200" value="${esc(j.alternatives.note || '')}">`, true)}<div id="j-internal" style="margin-top:12px">${talentsHTML(j.title, j.dept)}</div>`;
    if (step === 2) body = `<p class="hint" style="margin:0 0 12px">Retenez 3 ou 4 compétences indispensables, pas plus : celles qui prédisent vraiment la réussite dans le poste. Elles serviront à évaluer les candidats.</p>
      <div class="form-grid">${[0, 1, 2, 3].map((k) => f(`j-must${k}`, `Indispensable ${k + 1}${k ? '' : ' *'}`, `<input id="j-must${k}" name="must${k + 1}" class="input" value="${esc(sc.must[k] || '')}" placeholder="${['Ex. Recherche utilisateur', 'Ex. Prototypage', 'Ex. Design system', 'Facultatif'][k]}">`)).join('')}
      ${f('j-nice', 'Atouts appréciés (un par ligne)', `<textarea id="j-nice" name="nice" class="input" style="min-height:70px">${esc(sc.nice.join('\n'))}</textarea>`)}${f('j-rounds', 'Nombre d’entretiens prévus', `<select id="j-rounds" name="rounds" class="select">${opt(['1', '2', '3', '4'].map((x) => [x, plural(Number(x), 'entretien', 'entretiens')]), String(sc.rounds))}</select>`)}</div>`;
    if (step === 3) body = `${f('j-desc', 'Missions et profil recherché *', `<textarea id="j-desc" name="description" class="input" style="min-height:170px" placeholder="Missions principales, contexte de l’équipe, profil recherché…" ${L}>${esc(j.description)}</textarea>`, true)}<div id="j-lint" style="margin-top:10px">${adLintHTML(j.title, j.description, false)}</div>`;
    if (step === 4) {
      const row = (l, v) => `<div><span>${l}</span>${v || '<span class="muted">—</span>'}</div>`;
      const sec = (k, t, inner) => `<div class="recap"><div class="recap-h"><h4 class="sub">${t}</h4><button class="btn ghost sm" name="nav" value="goto-${k}">${ic('edit')}Modifier</button></div>${inner}</div>`;
      body = `${sec(0, 'Le poste', `<div class="info-grid">${row('Intitulé', esc(j.title))}${row('Service', esc(j.dept))}${row('Contrat et lieu', `${esc(j.contract)} · ${esc(j.location)}`)}${row('Arrivée souhaitée', fmtDate(j.startWanted))}${row('Priorité', esc(j.priority))}${row('Manager', esc(fullName(emp(j.managerId))))}</div>`)}
        ${sec(1, 'Justification et budget', `<div class="info-grid">${row('Motif', `${esc(j.reason)}${j.replaces ? ` de ${esc(fullName(emp(j.replaces)))}` : ''}`)}${row('Salaire annuel brut', esc(j.budget))}${row('Prévu au budget', j.budgeted ? 'Oui' : 'Non')}${row('Alternatives étudiées', Object.keys(ALT_LABELS).filter((k) => j.alternatives[k]).map((k) => ALT_LABELS[k]).join(', '))}</div><div style="margin-top:10px">${flowText(j.reason, j.budgeted)}</div>`)}
        ${sec(2, 'Fiche de cadrage', `<p style="margin:0">${sc.must.map(esc).join(' · ') || '<span class="muted">—</span>'}</p><p class="hint" style="margin:6px 0 0">${plural(sc.rounds, 'entretien prévu', 'entretiens prévus')}${sc.nice.length ? ` · atouts : ${sc.nice.map(esc).join(', ')}` : ''}</p>`)}
        ${sec(3, 'Missions et annonce', `<p style="margin:0">${esc(j.description) || '<span class="muted">—</span>'}</p><div style="margin-top:10px">${adLintHTML(j.title, j.description, false)}</div>`)}`;
    }
    const last = step === 4, sendLabel = saveOnly ? 'Enregistrer les modifications' : rh ? 'Valider le besoin' : 'Envoyer en validation';
    return shell(job && !m.isNew ? `Modifier le besoin · ${esc(job.title)}` : 'Exprimer un besoin de recrutement', `<form data-form="need" novalidate><button name="nav" value="${step === 4 ? 'send' : 'next'}" class="sr" tabindex="-1" aria-hidden="true"></button>${wiz}<div class="modal-b"><h3 class="sec" style="margin-top:0">${NEED_STEPS[step]}</h3>${body}<p class="err" id="m-err" aria-live="polite">${m.err ? esc(m.err) : ''}</p></div>
      <div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Fermer</button><span class="hint autosave">${m.savedAt ? `${ic('check')}Brouillon enregistré à ${m.savedAt}` : saveOnly ? 'Modifications appliquées à l’enregistrement' : 'Brouillon enregistré à chaque étape'}</span>
        ${step ? '<button class="btn ghost" name="nav" value="prev">Précédent</button>' : ''}${last ? `${saveOnly ? '' : '<button class="btn ghost" name="nav" value="draft">Enregistrer le brouillon</button>'}<button class="btn primary" name="nav" value="send">${sendLabel}</button>` : `<button class="btn primary" name="nav" value="next">Suivant${ic('arrow')}</button>`}</div></form>`, '', true);
  };
  MODALS['need-decide'] = (m, shell, formShell, opt, f) => {
    const j = db.jobs.find((x) => x.id === m.id), dir = j.pending === 'direction';
    const L = { Validée: ['Valider le besoin', 'Valider'], 'À modifier': ['Demander une modification', 'Renvoyer au demandeur'], Refusée: ['Refuser le besoin', 'Refuser'] }[m.d];
    const next = m.d === 'Validée' ? (!dir && needsDirection(j) ? `Le besoin sera ensuite transmis à la direction (${j.reason === 'Création de poste' ? 'création de poste' : 'poste hors budget'}).` : 'Le besoin sera validé : il restera à rédiger et publier l’offre.')
      : m.d === 'À modifier' ? `${esc(fullName(emp(j.requestedBy)))} pourra corriger sa demande et la renvoyer.` : 'Le demandeur sera prévenu du refus et de son motif.';
    return formShell(`${L[0]} · ${esc(j.title)}`, 'need-decide', `${dir ? '<p class="hint" style="margin:0 0 10px">La direction n’a pas de profil dans cette démo : les RH enregistrent la décision de Claire Durand.</p>' : ''}<p style="margin:0 0 12px">${next}</p>
      ${m.d === 'Refusée' ? `<div style="margin-bottom:12px">${f('nd-r', 'Motif du refus *', `<select id="nd-r" name="reason" class="select"><option value="">Choisir…</option>${opt(NEED_REFUSALS)}</select>`, true)}</div>` : ''}
      ${f('nd-c', m.d === 'À modifier' ? 'Commentaire pour le demandeur *' : 'Commentaire (facultatif)', '<textarea id="nd-c" name="comment" class="input" maxlength="300"></textarea>', true)}`, L[1]);
  };
  MODALS['need-publish'] = (m, shell, formShell, opt, f) => {
    const j = db.jobs.find((x) => x.id === m.id), sc = j.scorecard || { must: [], nice: [] }, rh = ui.profile === 'rh', a = j.ad;
    const desc = a ? a.description : `${j.description}${sc.must.length && !j.description.includes('Compétences recherchées') ? `\n\nCompétences recherchées : ${sc.must.join(', ')}.` : ''}${sc.nice.length && !j.description.includes('Atouts') ? `\nAtouts appréciés : ${sc.nice.join(', ')}.` : ''}`, title = a ? a.title : j.title;
    const who = a ? `Dernière modification par ${esc(fullName(emp(a.by)))} le ${fmtDate(a.at)}${adReady(j) ? ' · envoyé aux RH pour validation' : ''}.` : 'Projet préparé à partir du besoin et de la fiche de cadrage.';
    const btns = rh ? '<button class="btn ghost" name="go" value="save">Enregistrer le projet</button><button class="btn primary" name="go" value="publish">Valider et publier l’offre</button>'
      : `<button class="btn ghost" name="go" value="save">Enregistrer le projet</button><button class="btn primary" name="go" value="send">${adReady(j) ? 'Renvoyer aux RH' : 'Envoyer aux RH pour validation'}</button>`;
    return shell(rh ? 'Rédiger, valider et publier l’offre' : 'Rédiger l’offre', `<form data-form="need-publish" novalidate><div class="modal-b">
      <p class="hint" style="margin:0 0 6px">Offre datée du ${fmtDate(TODAY)}, rédigée en français · ${esc(j.dept)} · ${esc(j.contract)} · ${esc(j.location)} · ${esc(j.budget)}</p>
      <p class="hint" style="margin:0 0 12px">${who} Rédaction partagée entre ${esc(fullName(emp(j.requestedBy)))} (demandeur) et les RH ; ${rh ? 'vous seuls pouvez la valider et la publier.' : 'seuls les RH peuvent la valider et la publier.'}</p>
      ${f('ad-title', 'Intitulé de l’offre', `<input id="ad-title" name="title" class="input" value="${esc(title)}" data-live="ad">`, true)}
      <div style="margin-top:12px">${f('ad-desc', 'Texte de l’annonce', `<textarea id="ad-desc" name="description" class="input" style="min-height:150px" data-live="ad">${esc(desc)}</textarea>`, true)}</div>
      <div id="ad-lint" style="margin-top:10px">${adLintHTML(title, desc, true)}</div><p class="err" id="m-err" aria-live="polite"></p></div>
      <div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Annuler</button>${btns}</div></form>`, '', true);
  };

  // ================================================================ Recrutement : entretiens structurés, échanges, proposition, RGPD, indicateurs
  const dayDiff = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
  const nowStamp = () => { const d = new Date(); return `${TODAY}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  let RETENTION_YEARS = 2, ANSWER_DAYS = 7;
  function lastContact(c) {
    return [c.appliedAt, ...(c.messages || []).map((m) => m.date), ...(c.interviews || []).map((iv) => iv.date.slice(0, 10)).filter((d) => d <= TODAY),
      c.refusal && c.refusal.date, c.offer && c.offer.sentAt].filter(Boolean).sort().pop();
  }
  const purgeDate = (c) => addYears(lastContact(c), RETENTION_YEARS);
  // RGPD : un candidat non embauché est supprimé automatiquement 2 ans après le dernier contact.
  function purgeCandidates() {
    const old = db.candidates.filter((c) => c.stage !== 'Embauché' && purgeDate(c) <= TODAY);
    if (!old.length) return;
    db.candidates = db.candidates.filter((c) => !old.includes(c));
    db.purgeLog = [{ date: TODAY, count: old.length }].concat(db.purgeLog || []);
    save();
  }
  const offerStatus = (o) => (o && o.status === 'Envoyée' && o.deadline < TODAY ? 'Expirée' : o && o.status);
  const OFFER_PILL = { Envoyée: 'info', Expirée: 'warn', Acceptée: 'ok', Déclinée: 'bad', Retirée: 'neutral' };
  const waitingDays = (c) => (activeCand(c) && c.stage !== 'Proposition' ? dayDiff(lastContact(c), TODAY) : 0);
  const reachedIdx = (c) => CAND_STAGES.indexOf(c.stage === 'Refusé' ? (c.refusal && c.refusal.from) || 'Reçue' : c.stage);
  const canEval = (iv) => ui.profile === 'rh' || iv.with === me().id;
  function pendingEvals() {
    const now = nowStamp();
    return scopeCandidates().filter(activeCand).flatMap((c) => (c.interviews || []).filter((iv) => !iv.eval && iv.date <= now && canEval(iv)).map((iv) => ({ c, iv })));
  }
  function evalSummary(c, job) {
    const sc = job.scorecard || { must: [], rounds: 0 }, evals = (c.interviews || []).filter((iv) => iv.eval);
    const avg = sc.must.map((m, k) => { const r = evals.map((iv) => iv.eval.ratings[k]).filter(Boolean); return r.length ? r.reduce((s, x) => s + x, 0) / r.length : 0; });
    const recos = evals.reduce((o, iv) => { o[iv.eval.reco] = (o[iv.eval.reco] || 0) + 1; return o; }, {});
    return { sc, evals, avg, recos };
  }
  function recomputeScore(c, job) { const r = evalSummary(c, job).avg.filter(Boolean); if (r.length) c.score = Math.round(r.reduce((s, x) => s + x, 0) / r.length); }
  const RECO_PILL = { Favorable: 'ok', Réservé: 'warn', Défavorable: 'bad' };
  function evalGauge(c, job, short) {
    const rounds = (job.scorecard && job.scorecard.rounds) || 0, done = (c.interviews || []).filter((iv) => iv.eval).length;
    return rounds ? `<span class="gauge" title="${done} entretien(s) évalué(s) sur ${rounds} prévus"><i style="width:${Math.min(100, (done / rounds) * 100)}%"></i></span><small class="num">${done}/${rounds}${short ? '' : ' entretiens évalués'}</small>` : '';
  }

  // Modèles de messages aux candidats (l'envoi est simulé et tracé dans la fiche).
  let RGPD_NOTE = 'Vos données sont utilisées uniquement pour nos recrutements. Elles sont supprimées automatiquement 2 ans après notre dernier échange. Vous pouvez à tout moment demander leur suppression ou vous opposer à leur conservation en écrivant à rh@novastudio.fr.';
  const firstName = (c) => c.name.split(' ')[0];
  let SIGN = '\n\nL’équipe RH de Nova Studio';
  // Les textes viennent des modèles rédigés par les RH (écran « Modèles de documents »).
  const MSG_TPL = {
    ack: ['Accusé de réception', (c, j) => tplMsg('msg-ack', candCtx(c, j))],
    point: ['Point d’étape', (c, j) => tplMsg('msg-point', candCtx(c, j))],
    libre: ['Message libre', (c) => ['', `Bonjour ${firstName(c)},\n\n${SIGN.trim()}`]],
  };
  const convocMsg = (c, j, iv) => tplMsg('msg-convocation', candCtx(c, j, { iv }));
  const refusBody = (c, j, reason, pool) => tplText('msg-refus', candCtx(c, j, { reason, pool }));
  const offerMsg = (c, o) => tplMsg('msg-proposition', candCtx(c, candJob(c), { offer: o }));
  const REFUS_REASONS = ['Les compétences indispensables ne sont pas réunies', 'L’expérience ne correspond pas encore au poste', 'Un autre candidat a été retenu', 'Les prétentions salariales sont hors budget', 'Autre motif'];
  function sendMsg(c, kind, subject, body) { c.messages = c.messages || []; c.messages.push({ date: TODAY, kind, subject, body }); }

  function hireFromOffer(c) {
    const job = db.jobs.find((j) => j.id === c.jobId), o = c.offer, [first, ...rest] = c.name.split(' '), internal = c.empId && emp(c.empId), id = internal ? c.empId : uid('e');
    if (internal) { Object.assign(internal, { title: o.title, dept: job.dept, managerId: o.managerId, salary: o.salary }); db.history.push({ id: uid('h'), empId: id, date: o.startDate, label: 'Mobilité interne', detail: `${o.title} · ${job.dept}` }); }
    else db.employees.push({ id, firstName: first, lastName: rest.join(' ') || first, title: o.title, dept: job.dept, managerId: o.managerId, stage: 2, startDate: o.startDate, contract: o.contract, salary: o.salary,
      email: c.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, '').replace(/ +/g, '.') + `@${COMPANY.domaine}`, phone: c.phone, location: job.location.split(' ')[0], birthDate: '', address: '', emergency: '', cp: 0, rtt: 0, exit: null });
    normalizeEmployees(); Object.assign(o, { status: 'Acceptée', answeredAt: TODAY });
    Object.assign(c, { stage: 'Embauché', empId: id, hiredAt: TODAY });
    job.status = 'Pourvue';
    notify(o.managerId, `${c.name} a accepté la proposition : arrivée le ${fmtDate(o.startDate)} (${o.title}).`);
    if (!internal) notify(id, `Bienvenue chez ${COMPANY.nom} ! Déposez vos documents dans « Mon arrivée » : votre contrat suivra.`);
    logCand(c, 'Proposition acceptée : embauche');
    const others = db.candidates.filter((x) => x.jobId === job.id && activeCand(x)).length;
    toast(`${c.name} passe en pré-embauche et en embauche${others ? ` · pensez à répondre aux ${plural(others, 'autre candidat', 'autres candidats')}` : ''}`);
  }

  // Indicateurs d'une offre (affichés dans le Reporting RH).
  function offerStats(job) {
    const cands = db.candidates.filter((c) => c.jobId === job.id), pub = pubDate(job) || job.createdAt;
    const hired = cands.find((c) => c.stage === 'Embauché'), n = cands.length, reach = (k) => cands.filter((c) => reachedIdx(c) >= k).length;
    const bySrc = {};
    cands.filter((c) => c.score).forEach((c) => { const x = bySrc[c.source] = bySrc[c.source] || { n: 0, sum: 0 }; x.n += 1; x.sum += c.score; });
    const best = Object.entries(bySrc).map(([src, x]) => ({ src, n: x.n, avg: x.sum / x.n })).sort((a, b) => b.avg - a.avg || b.n - a.n)[0];
    return { days: dayDiff(pub, (hired && hired.hiredAt) || TODAY), hired: !!hired, n, active: cands.filter(activeCand).length, toIv: n ? reach(2) / n : 0, best, funnel: [0, 1, 2, 3, 4].map(reach) };
  }
  // Candidats qui attendent une action du profil courant (pastille de l'étape Recrutement).
  // Ce qui attend le profil courant en recrutement, toutes offres confondues (pastille de l'étape et onglet « À traiter »).
  function recTodoGroups() {
    const list = scopeCandidates().filter(activeCand), rh = ui.profile === 'rh';
    const ref = (c) => { const j = candJob(c); return `${jobRef(j)} · ${j.title}`; };
    const groups = [
      ['tri', 'Nouvelles candidatures à trier', list.filter((c) => c.stage === 'Reçue').map((c) => ({ c, sub: `${ref(c)} · reçue le ${fmtDate(c.appliedAt)}`, act: 'Trier' }))],
      ['eval', 'Évaluations à remplir', pendingEvals().map(({ c, iv }) => ({ c, iv, sub: `${ref(c)} · ${iv.kind} du ${fmtShort(iv.date.slice(0, 10))}${iv.with !== me().id ? ` avec ${fullName(emp(iv.with))}` : ''}`, act: 'Évaluer' }))],
    ];
    if (rh) {
      groups.push(['prop', 'Propositions à préparer', list.filter((c) => c.stage === 'Proposition' && (!c.offer || ['Expirée', 'Retirée', 'Déclinée'].includes(offerStatus(c.offer))))
        .map((c) => ({ c, sub: `${ref(c)} · ${offerStatus(c.offer) === 'Expirée' ? `proposition expirée le ${fmtShort(c.offer.deadline)}` : 'candidat choisi, proposition à rédiger'}`, act: 'Préparer' }))]);
      groups.push(['late', `Sans nouvelles depuis plus de ${ANSWER_DAYS} jours`, list.filter((c) => waitingDays(c) > ANSWER_DAYS).map((c) => ({ c, sub: `${ref(c)} · dernier contact le ${fmtDate(lastContact(c))}, il y a ${waitingDays(c)} jours`, act: 'Écrire' }))]);
    }
    return groups.filter((g) => g[2].length);
  }
  function recTodo() { const ids = new Set(); recTodoGroups().forEach(([, , items]) => items.forEach((x) => ids.add(x.c.id))); return ids; }
  const logCand = (c, text) => logTo(c, text);
  const NEXT_STAGE = { Reçue: 'Présélection', Présélection: 'Entretien', Entretien: 'Proposition' };
  const candMatch = (c) => !ui.rq.trim() || c.name.toLowerCase().includes(ui.rq.trim().toLowerCase());
  // Candidats d'une même colonne du tableau, dans l'ordre affiché (navigation par flèches).
  const colList = (c) => db.candidates.filter((x) => x.jobId === c.jobId && x.stage === c.stage && (candMatch(x) || x.id === c.id));
  // Carte candidat : nom, expérience, note, puis une seule ligne d'état (la plus importante).
  function candState(c) {
    const next = (c.interviews || []).filter((iv) => iv.date.slice(0, 10) >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0];
    const w = waitingDays(c), os = offerStatus(c.offer), late = (c.interviews || []).some((iv) => !iv.eval && iv.date <= nowStamp());
    if (c.stage === 'Proposition') return os ? [OFFER_PILL[os], `Proposition ${os.toLowerCase()}`] : ['accent', 'Proposition à préparer'];
    if (late) return ['warn', 'Évaluation à remplir'];
    if (w > ANSWER_DAYS) return ['bad', `Sans nouvelles · ${w} j`];
    if (next) return ['info', `${next.kind} · ${fmtShort(next.date.slice(0, 10))} ${next.date.slice(11, 16)}`];
    if (c.stage === 'Embauché') return ['ok', `Embauché·e le ${fmtShort(c.hiredAt || TODAY)}`];
    if (c.stage === 'Refusé') return ['neutral', c.refusal && c.refusal.declined ? 'A décliné' : 'Non retenu·e'];
    return null;
  }
  function candCard(c) {
    const s = candState(c);
    return `<button type="button" class="kc" draggable="true" data-act="open-cand" data-id="${c.id}"><span class="kc-top"><b>${esc(c.name)}</b>${c.score ? stars(c.score) : ''}</span><small>${esc(c.experience || c.source)}</small>
      ${s ? `<span class="kc-state ${s[0]}">${esc(s[1])}</span>` : ''}</button>`;
  }
  function poolView() {
    const list = db.candidates.filter((c) => c.stage === 'Refusé' && c.pool).sort((a, b) => lastContact(b).localeCompare(lastContact(a)));
    const open = db.jobs.filter((j) => j.status === 'Ouverte'), log = (db.purgeLog || [])[0];
    return card('Vivier de candidats', `<span class="muted num">${plural(list.length, 'dossier', 'dossiers')}</span>`, `<div class="card-b"><p class="hint" style="margin:0 0 6px">Candidats non retenus qui acceptent d’être recontactés. Chaque dossier est supprimé automatiquement ${RETENTION_YEARS} ans après le dernier contact.</p>
      ${log ? `<p class="hint" style="margin:0 0 10px">${ic('check').replace('<svg', '<svg style="width:13px;height:13px;vertical-align:-2px"')} Suppression automatique du ${fmtDate(log.date)} : ${plural(log.count, 'dossier effacé', 'dossiers effacés')}.</p>` : ''}
      ${list.length ? list.map((c) => { const j = db.jobs.find((x) => x.id === c.jobId), pd = purgeDate(c), soon = dayDiff(TODAY, pd) <= 90;
        return `<div class="todo">${avatarName(c.id, c.name, 'sm')}<div class="t"><b>${esc(c.name)}</b><small>${esc(c.experience)} · candidature « ${esc(j ? j.title : '—')} » · dernier contact le ${fmtDate(lastContact(c))}</small>
          <small class="${soon ? 'warn-t' : ''}">Suppression automatique le ${fmtDate(pd)}</small></div>${c.score ? stars(c.score) : ''}
          <label class="sr" for="pp-${c.id}">Proposer pour une offre</label><select id="pp-${c.id}" class="select" data-change="pool-propose" data-id="${c.id}"><option value="">Proposer pour…</option>${open.map((o) => `<option value="${o.id}">${esc(o.title)}</option>`).join('')}</select></div>`; }).join('')
        : '<p class="muted" style="margin:0">Le vivier est vide.</p>'}</div>`);
  }
  const REC_STATUS = [['Ouverte', 'Offre publiée'], ['Pourvue', 'Pourvue'], ['Clôturée', 'Clôturée']];
  const OFFER_SORT = { ref: (j) => j.num || 0, title: (j) => j.title.toLowerCase(), dept: (j) => j.dept, mgr: (j) => fullName(emp(jobManager(j))), active: (j) => db.candidates.filter((c) => c.jobId === j.id && activeCand(c)).length,
    todo: (j) => jobTodo(j), since: (j) => dayDiff(pubDate(j) || j.createdAt, TODAY), status: (j) => ({ Ouverte: 1, Pourvue: 2, Clôturée: 3 })[j.status] };
  const jobTodo = (j) => { const ids = recTodo(); return db.candidates.filter((c) => c.jobId === j.id && ids.has(c.id)).length; };
  const recJobs = () => scopeJobs().filter((j) => !isNeed(j) && (!ui.rStatus || j.status === ui.rStatus) && (jobSearch(j, ui.rq, ui.rDept, ui.rFrom) || (ui.rq.trim() && db.candidates.some((c) => c.jobId === j.id && candMatch(c)) && jobSearch(j, '', ui.rDept, ui.rFrom))))
    .sort((a, b) => { const f = OFFER_SORT[ui.oSort] || OFFER_SORT.status, x = f(a), y = f(b); return (x < y ? -1 : x > y ? 1 : b.createdAt.localeCompare(a.createdAt)) * ui.oDir; });
  function recJobList(jobs) {
    const th = (k, l, cls = '') => `<th class="${cls}" aria-sort="${ui.oSort === k ? (ui.oDir > 0 ? 'ascending' : 'descending') : 'none'}"><button type="button" class="th-sort" data-act="offer-sort" data-k="${k}">${l}<span aria-hidden="true">${ui.oSort === k ? (ui.oDir > 0 ? '▲' : '▼') : ''}</span></button></th>`;
    return jobs.length ? `<table class="need-table"><thead><tr>${th('ref', 'Référence')}${th('title', 'Poste')}${th('dept', 'Service')}${th('mgr', 'Manager')}${th('active', 'Candidats actifs', 'r')}${th('todo', 'À traiter', 'r')}${th('since', 'En ligne depuis', 'r')}${th('status', 'Statut')}</tr></thead><tbody>
      ${jobs.map((j) => { const n = OFFER_SORT.active(j), t = jobTodo(j), hit = ui.rq.trim() ? db.candidates.filter((c) => c.jobId === j.id && candMatch(c)).length : 0;
        return `<tr class="click ${t ? 'mine' : ''}" data-act="open-job" data-id="${j.id}" tabindex="0" aria-label="Ouvrir l’offre ${esc(j.title)}"><td><span class="ref num">${jobRef(j)}</span></td><td><b>${esc(j.title)}</b><br><small class="muted">${esc(j.contract)} · ${esc(j.location)}${hit ? ` · ${plural(hit, 'candidat trouvé', 'candidats trouvés')}` : ''}</small></td>
          <td>${esc(j.dept)}</td><td>${esc(fullName(emp(jobManager(j))))}</td><td class="r num">${n}</td><td class="r num">${t ? `<span class="badge-dot">${t}</span>` : '<span class="muted">—</span>'}</td><td class="r num">${j.status === 'Ouverte' ? plural(OFFER_SORT.since(j), 'jour', 'jours') : '<span class="muted">—</span>'}</td><td>${jobPill(j)}</td></tr>`; }).join('')}</tbody></table>`
      : '<div class="empty">Aucune offre ne correspond à ces critères.</div>';
  }
  function recTodoView() {
    const groups = recTodoGroups(), total = recTodo().size;
    if (!groups.length) return '<div class="card empty">Rien à traiter en recrutement pour le moment.</div>';
    return `<p class="muted" style="margin:0">${plural(total, 'candidat attend', 'candidats attendent')} une action de votre part.</p>${groups.map(([k, title, items]) => card(title, `<span class="pill warn num">${items.length}</span>`, `<div class="card-b">${items.map((x) => `<div class="todo">${avatarName(x.c.id, x.c.name, 'sm')}<div class="t"><b>${esc(x.c.name)}</b><small>${esc(x.sub)}</small></div>
      ${k === 'eval' ? `<button type="button" class="btn primary sm" data-act="iv-eval" data-id="${x.c.id}" data-iv="${x.iv.id}">Évaluer</button>` : ''}<button type="button" class="btn ${k === 'eval' ? 'ghost' : 'primary'} sm" data-act="open-cand" data-id="${x.c.id}">${k === 'eval' ? 'Ouvrir' : x.act}</button></div>`).join('')}</div>`)).join('')}`;
  }
  // Page d'une offre : en-tête sur une ligne, onglets Candidats et L'offre.
  function offerPage(job) {
    const rh = ui.profile === 'rh', cands = db.candidates.filter((c) => c.jobId === job.id && candMatch(c)), sc = job.scorecard || { must: [], nice: [], rounds: 0 };
    const mgr = emp(jobManager(job)), revs = (job.reviewers || []).map(emp).filter(Boolean);
    const candidatesRev = db.employees.filter((e) => isEmployed(e) && e.id !== jobManager(job) && !(job.reviewers || []).includes(e.id) && (e.dept === job.dept || e.dept === 'RH'));
    const invite = rh && job.status === 'Ouverte' ? `<label class="sr" for="rev-add">Inviter un évaluateur</label><select id="rev-add" class="select sm" data-change="rev-add" data-id="${job.id}"><option value="">Inviter un évaluateur…</option>${candidatesRev.map((e) => `<option value="${e.id}">${esc(fullName(e))} · ${esc(e.title)}</option>`).join('')}</select>` : '';
    const team = `<div class="team"><span class="team-l">Manager</span>${mgr ? `<span class="who-chip">${avatar(mgr, 'sm')}${esc(fullName(mgr))}</span>` : '—'}<span class="team-l">Évaluateurs</span>${revs.map((e) => `<span class="who-chip">${avatar(e, 'sm')}${esc(fullName(e))}${rh ? `<button type="button" data-act="rev-del" data-id="${job.id}" data-e="${e.id}" aria-label="Retirer ${esc(fullName(e))}">${ic('x')}</button>` : ''}</span>`).join('') || '<span class="muted">Aucun</span>'}</div>`;
    const menu = rh && job.status === 'Ouverte' ? `<details class="more"><summary class="btn ghost" aria-label="Plus d’actions">•••</summary><div class="more-pop">${invite}<button type="button" class="btn ghost sm" data-act="job-close" data-id="${job.id}">Clôturer l’offre</button></div></details>` : '';
    const head = `<div class="offer-head"><button type="button" class="btn ghost sm" data-act="offer-back">${ic('left')}Toutes les offres</button><span class="ref num">${jobRef(job)}</span><h2>${esc(job.title)}</h2>${jobPill(job)}
      <span class="who-chip">${mgr ? `${avatar(mgr, 'sm')}${esc(fullName(mgr))}` : '—'}</span>${revs.length ? `<span class="muted" style="font-size:13px">+ ${plural(revs.length, 'évaluateur', 'évaluateurs')}</span>` : ''}
      <span class="offer-acts">${job.status === 'Ouverte' ? `<button type="button" class="btn primary" data-act="cand-new" data-id="${job.id}">${ic('plus')}Ajouter un candidat</button>` : ''}${menu}</span></div>`;
    const tab = ui.offerTab === 'offre' ? 'offre' : 'cands';
    const tabs = `<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="${tab === 'cands'}" data-act="offer-tab" data-t="cands">Candidats<span class="count num">${cands.filter(activeCand).length}</span></button><button type="button" role="tab" aria-selected="${tab === 'offre'}" data-act="offer-tab" data-t="offre">L’offre</button></div>`;
    let body;
    if (tab === 'offre') body = `<div class="two">${card('L’offre', '', `<div class="card-b"><p class="need-desc">${esc(job.description)}</p><div class="info-grid"><div><span>Contrat et lieu</span>${esc(job.contract)} · ${esc(job.location)}</div><div><span>Salaire annuel brut</span><span class="num">${esc(job.budget)}</span></div>
        <div><span>Motif</span>${esc(job.reason)}</div><div><span>Publiée le</span>${fmtDate(pubDate(job) || job.createdAt)}</div></div><div class="toolbar" style="margin-top:14px"><button type="button" class="btn ghost sm" data-act="open-need" data-id="${job.id}">Voir le besoin d’origine${ic('arrow')}</button></div></div>`)}
      <div>${card('Fiche de cadrage', '', `<div class="card-b"><h4 class="sub">Compétences indispensables</h4>${sc.must.length ? `<ol class="crit-list">${sc.must.map((m) => `<li>${esc(m)}</li>`).join('')}</ol>` : '<p class="muted">—</p>'}<h4 class="sub" style="margin-top:14px">Atouts appréciés</h4>${sc.nice.length ? `<div class="tags">${sc.nice.map((m) => `<span class="pill neutral">${esc(m)}</span>`).join('')}</div>` : '<p class="muted">—</p>'}<p class="hint" style="margin:12px 0 0">${plural(sc.rounds || 0, 'entretien prévu', 'entretiens prévus')}</p></div>`)}
        <div style="margin-top:14px">${card('Équipe de recrutement', '', `<div class="card-b">${team}${invite ? `<div style="margin-top:12px">${invite.replace('id="rev-add"', 'id="rev-add2"').replace('for="rev-add"', 'for="rev-add2"')}</div>` : ''}</div>`)}</div></div></div>`;
    else {
      const ACTIVE = ['Reçue', 'Présélection', 'Entretien', 'Proposition'], CLOSED = ['Embauché', 'Refusé'];
      const col = (st, closed) => { const list = cands.filter((c) => c.stage === st), open = !closed || (ui.colOpen || {})[st];
        return open ? `<div class="col ${closed ? 'closed-open' : ''}" data-stage="${st}"><h4>${closed ? `<button type="button" class="col-x" data-act="col-toggle" data-s="${st}" aria-label="Replier ${st}">${ic('x')}</button>` : ''}${st}<span class="num">${list.length}</span></h4>${list.map(candCard).join('') || '<p class="col-empty">Aucun candidat</p>'}</div>`
          : `<button type="button" class="col folded" data-stage="${st}" data-act="col-toggle" data-s="${st}" aria-label="Déplier ${st} (${list.length})"><span class="num">${list.length}</span><b>${st}</b></button>`; };
      const cols = ACTIVE.map((s) => col(s, false)).concat(CLOSED.map((s) => col(s, true)));
      const tpl = ACTIVE.map(() => 'minmax(170px, 1fr)').concat(CLOSED.map((s) => ((ui.colOpen || {})[s] ? 'minmax(170px, 1fr)' : '56px'))).join(' ');
      body = `<div class="card"><div class="board" style="grid-template-columns:${tpl}">${cols.join('')}</div><p class="hint" style="padding:0 20px 16px;margin:0">Ouvrez une carte pour lire le CV et la lettre, évaluer le candidat et le faire avancer ; ou glissez-la d’une colonne à l’autre.${rh ? '' : ' Les RH font la proposition d’embauche et les refus.'}</p></div>`;
    }
    return `${head}${tabs}${body}`;
  }
  function viewRecruitment() {
    const rh = ui.profile === 'rh';
    if (!['todo', 'offres', 'vivier'].includes(ui.recTab) || (ui.recTab === 'vivier' && !rh)) ui.recTab = 'todo';
    const job = ui.recTab === 'offres' && ui.recJob && db.jobs.find((j) => j.id === ui.recJob && scopeJobs().includes(j));
    const n = recTodo().size, pool = db.candidates.filter((c) => c.stage === 'Refusé' && c.pool).length;
    const tabs = `<div class="tabs rec-tabs" role="tablist"><button type="button" role="tab" aria-selected="${ui.recTab === 'todo'}" data-act="rec-tab" data-t="todo">À traiter${n ? `<span class="count num warn-c">${n}</span>` : ''}</button>
      <button type="button" role="tab" aria-selected="${ui.recTab === 'offres'}" data-act="rec-tab" data-t="offres">Offres<span class="count num">${scopeJobs().filter((j) => j.status === 'Ouverte').length}</span></button>${rh ? `<button type="button" role="tab" aria-selected="${ui.recTab === 'vivier'}" data-act="rec-tab" data-t="vivier">Vivier<span class="count num">${pool}</span></button>` : ''}</div>`;
    let body;
    if (ui.recTab === 'todo') body = recTodoView();
    else if (ui.recTab === 'vivier') body = poolView();
    else if (job) body = offerPage(job);
    else { const jobs = recJobs(); body = `${searchBar('r', { statuses: REC_STATUS, placeholder: 'Référence, intitulé ou candidat', fromLabel: 'Publiée depuis le' })}<div class="card"><div class="card-h"><h3>${plural(jobs.length, 'offre', 'offres')}</h3></div><div class="table-wrap" id="rec-list">${recJobList(jobs)}</div></div>`; }
    return `${tabs}${body}`;
  }

  // ---- Visionneuse de candidat : documents à gauche, commandes et suivi à droite, flèches pour passer au candidat suivant de la colonne.
  const FILE_KINDS = { cv: 'CV', lm: 'Lettre de motivation', autre: 'Autre document' };
  const hashN = (str, n) => { let h = 0; for (const ch of str) h = (h * 33 + ch.charCodeAt(0)) >>> 0; return h % n; };
  function cvDoc(c, job) {
    const sc = job.scorecard || { must: [], nice: [] }, years = Number((c.experience.match(/(\d+)\s*ans?/) || [])[1]) || 3, field = (c.experience.split('·')[1] || job.dept).trim();
    const COS = ['Atelier Lumen', 'Kairos Digital', 'Studio Nord', 'Helio Conseil', 'Pixel & Co', 'Groupe Vertex', 'Omnia Labs', 'Brique Studio'];
    const SCHOOLS = ['Université Paris Cité', 'Strate École de design', 'INSA Lyon', 'Université Lyon 2', 'ESCP Business School', 'Gobelins Paris', 'IUT de Nantes'];
    const y = Number(TODAY.slice(0, 4)), split = Math.max(1, Math.round(years * 0.6));
    const xp = [[COS[hashN(c.id, COS.length)], `${y - split} – aujourd’hui`, job.title.replace(/\s*H\/F/i, '')], [COS[hashN(c.id + 'b', COS.length)], `${y - years} – ${y - split}`, years > 3 ? `${job.title.split(' ')[0]} confirmé·e` : `${job.title.split(' ')[0]} junior`]];
    return `<div class="paper cv"><header><h2>${esc(c.name)}</h2><p>${esc(job.title.replace(/\s*H\/F/i, ''))} · ${plural(years, 'an', 'ans')} d’expérience</p><small>${esc(c.email)} · ${esc(c.phone)} · ${esc(job.location.split(' ')[0])}</small></header>
      <section><h3>Expérience</h3>${xp.map(([co, when, role]) => `<div class="cv-x"><b>${esc(role)} · ${esc(co)}</b><small>${when}</small><p>${esc(field.charAt(0).toUpperCase() + field.slice(1))} : ${esc((sc.must[hashN(co, Math.max(1, sc.must.length))] || 'projets transverses').toLowerCase())}, travail en équipe pluridisciplinaire.</p></div>`).join('')}</section>
      <section><h3>Compétences</h3><div class="tags">${sc.must.concat(sc.nice).map((m) => `<span class="pill neutral">${esc(m)}</span>`).join('')}</div></section>
      <section><h3>Formation</h3><div class="cv-x"><b>${esc(SCHOOLS[hashN(c.name, SCHOOLS.length)])}</b><small>${y - years - 2}</small><p>Master ou équivalent dans le domaine du poste.</p></div></section>
      <section><h3>Langues</h3><p>Français courant · anglais professionnel</p></section></div>`;
  }
  const lmDoc = (c, job) => `<div class="paper"><header class="lm-h"><b>${esc(c.name)}</b><small>${esc(c.email)}</small><span>Le ${fmtDate(c.appliedAt, { day: 'numeric', month: 'long', year: 'numeric' })}</span></header>
    <p><b>Objet : candidature au poste de ${esc(job.title)}</b></p><p>Madame, Monsieur,</p>
    <p>Votre offre a retenu toute mon attention : ${esc((job.description || '').charAt(0).toLowerCase() + (job.description || '').slice(1))}</p>
    <p>Fort·e de mon expérience (${esc(c.experience || 'parcours en lien avec le poste')}), j’ai développé ${esc(((job.scorecard && job.scorecard.must) || []).slice(0, 2).join(' et ').toLowerCase() || 'les compétences attendues')}. Rejoindre l’équipe ${esc(job.dept)} de ${esc(COMPANY.nom)} serait l’occasion de mettre ces savoir-faire au service de vos projets.</p>
    <p>Je serais heureux·se d’échanger avec vous lors d’un entretien.</p><p>Veuillez agréer, Madame, Monsieur, mes salutations distinguées.</p><p><b>${esc(c.name)}</b></p></div>`;
  function candFileView(c, job, f) {
    if (!f) return '<div class="paper empty">Aucun document de ce type.</div>';
    if (f.data && /^data:image\//.test(f.data)) return `<img class="file-img" src="${f.data}" alt="${esc(f.name)}">`;
    if (f.data) return `<embed class="file-pdf" src="${f.data}" type="application/pdf">`;
    if (f.kind === 'cv' && !f.uploaded) return cvDoc(c, job);
    if (f.kind === 'lm' && !f.uploaded) return lmDoc(c, job);
    return `<div class="paper file-ph">${ic('file')}<b>${esc(f.name)}</b><span>${esc(f.label || FILE_KINDS[f.kind])} joint à la candidature. Aperçu non disponible dans la démonstration.</span></div>`;
  }
  function candDrawer(c) {
    const job = db.jobs.find((j) => j.id === c.jobId), rh = ui.profile === 'rh', os = offerStatus(c.offer), { sc, evals, avg, recos } = evalSummary(c, job), act = activeCand(c);
    const interviewers = db.employees.filter((e) => ((e.dept === job.dept || e.dept === 'RH') && isEmployed(e)) || (job.reviewers || []).includes(e.id)), now = nowStamp(), w = waitingDays(c);
    const offerActive = c.offer && ['Envoyée', 'Expirée'].includes(os);
    const files = c.files || [], cur = files.find((f, k) => `${f.kind}-${k}` === ui.drawer.doc) || files[0], curKey = cur ? `${cur.kind}-${files.indexOf(cur)}` : '';
    const list = colList(c), idx = list.indexOf(c), prev = list[idx - 1], next = list[idx + 1];
    const nav = `<div class="cand-nav"><button type="button" class="icon-btn" data-act="cand-go" data-id="${prev ? prev.id : ''}" ${prev ? '' : 'disabled'} aria-label="Candidat précédent" title="Candidat précédent (←)">${ic('left')}</button><span class="num">${idx + 1} / ${list.length}<small>${esc(c.stage)}</small></span><button type="button" class="icon-btn" data-act="cand-go" data-id="${next ? next.id : ''}" ${next ? '' : 'disabled'} aria-label="Candidat suivant" title="Candidat suivant (→)">${ic('right')}</button></div>`;
    // Prochaine étape : une action principale selon la situation ; la proposition et le refus sont faits par les RH.
    const myEval = (c.interviews || []).filter((iv) => !iv.eval && iv.date <= now && canEval(iv)).sort((a, b) => a.date.localeCompare(b.date))[0];
    const upcoming = (c.interviews || []).filter((iv) => iv.date > now).sort((a, b) => a.date.localeCompare(b.date))[0];
    const b = (actName, label, extra = '', cls = 'ghost sm') => `<button type="button" class="btn ${cls}" data-act="${actName}" data-id="${c.id}" ${extra}>${label}</button>`;
    const refuse = act && rh && !offerActive ? b('cand-move', 'Refuser', 'data-s="Refusé"', 'ghost sm bad-t') : '';
    const write = act && rh ? b('cand-msg', 'Écrire') : '';
    let step = '', why = '', main = '', more = '', cls = '';
    if (c.stage === 'Embauché') { cls = 'done'; step = 'Embauché·e'; why = `Proposition acceptée le ${fmtDate(c.hiredAt || TODAY)}`; main = c.empId ? `<button type="button" class="btn primary" data-act="open-dossier" data-id="${c.empId}">Ouvrir le dossier d’arrivée${ic('arrow')}</button>` : ''; }
    else if (c.stage === 'Refusé') { cls = 'closed'; step = c.refusal && c.refusal.declined ? 'Proposition déclinée' : 'Candidature non retenue'; why = c.refusal ? `${c.refusal.reason} · le ${fmtDate(c.refusal.date)}` : ''; }
    else if (myEval) { cls = 'mine'; step = `Évaluer l’${myEval.kind.toLowerCase()} du ${fmtShort(myEval.date.slice(0, 10))}`; why = 'À vous · notez chaque compétence avec un fait observé'; main = b('iv-eval', 'Évaluer', `data-iv="${myEval.id}"`, 'primary'); more = refuse + write; }
    else if (c.stage === 'Proposition' && rh && offerActive) { cls = 'mine'; step = 'Enregistrer la réponse du candidat'; why = `Proposition ${os.toLowerCase()} · réponse attendue avant le ${fmtDate(c.offer.deadline)}`;
      main = b('offer-accept', `${ic('check')}Acceptée : embaucher`, '', 'primary'); more = b('offer-decline', 'Déclinée') + (os === 'Expirée' ? b('offer-extend', 'Prolonger de 7 jours') : '') + b('offer-withdraw', 'Retirer') + write; }
    else if (c.stage === 'Proposition' && rh) { cls = 'mine'; step = 'Préparer la proposition d’embauche'; why = os ? `Proposition précédente ${os.toLowerCase()}` : 'Candidat choisi'; main = b('offer-new', `${ic('file')}Préparer la proposition`, '', 'primary'); more = refuse + write; }
    else if (c.stage === 'Proposition') { step = 'Proposition d’embauche'; why = 'Candidat choisi : les RH préparent la proposition.'; }
    else if (c.stage === 'Reçue') { cls = 'mine'; step = 'Trier la candidature'; why = `Reçue le ${fmtDate(c.appliedAt)} · lisez le CV et la lettre à gauche`; main = b('cand-next', `Présélectionner${ic('arrow')}`, '', 'primary'); more = refuse + write; }
    else if (upcoming) { step = `${upcoming.kind} le ${fmtDate(upcoming.date.slice(0, 10), { weekday: 'long', day: 'numeric', month: 'long' })} à ${upcoming.date.slice(11, 16)}`; why = `Avec ${fullName(emp(upcoming.with))} · l’évaluation sera demandée après l’entretien`;
      main = b('cand-next', `${rh ? 'Préparer la proposition' : 'Choisir ce candidat'}${ic('arrow')}`); more = b('cand-plan', `${ic('calendar')}Autre entretien`) + refuse + write; }
    else if (c.stage === 'Présélection') { cls = 'mine'; step = 'Planifier un entretien'; why = 'Profil présélectionné'; main = b('cand-plan', `${ic('calendar')}Planifier un entretien`, '', 'primary'); more = b('cand-next', 'Passer à « Entretien »') + refuse + write; }
    else { cls = 'mine'; step = rh ? 'Décider de la suite' : 'Donner votre choix'; why = `${plural(evals.length, 'entretien évalué', 'entretiens évalués')} sur ${sc.rounds || 0} prévus`; main = b('cand-next', `${rh ? 'Préparer la proposition' : 'Choisir ce candidat'}${ic('arrow')}`, '', 'primary'); more = b('cand-plan', `${ic('calendar')}Autre entretien`) + refuse + write; }
    if (w > ANSWER_DAYS && act) why += ` · sans nouvelles depuis ${w} jours`;
    const banner = `<div class="next-step ${cls}"><div><small>${cls === 'done' || cls === 'closed' ? 'CANDIDATURE' : 'PROCHAINE ÉTAPE'}</small><b>${esc(step)}</b>${why ? `<span>${esc(why)}</span>` : ''}</div>${main || more ? `<div class="toolbar">${main}${more}</div>` : ''}</div>`;
    const offerBox = c.offer ? `<div class="offer-box"><div><b>Proposition · ${esc(c.offer.title)} (${esc(c.offer.contract)})</b><small><span class="num">${eur0(c.offer.salary)}</span> bruts annuels · entrée le ${fmtDate(c.offer.startDate)} · réponse avant le ${fmtDate(c.offer.deadline)}</small>
        ${c.offer.salary > job.salaryMax ? `<small class="warn-t">Au-dessus de la fourchette validée (${esc(job.budget)})</small>` : ''}</div><span class="pill ${OFFER_PILL[os]}">${os}</span>${b('offer-doc', `${ic('file')}Voir`)}</div>` : '';
    const tab = ['evaluation', 'entretiens', 'echanges', 'profil', 'historique'].includes(ui.drawer.tab) ? ui.drawer.tab : 'evaluation';
    const tabs = [['evaluation', 'Évaluation'], ['entretiens', 'Entretiens', (c.interviews || []).length], ['echanges', 'Échanges', (c.messages || []).length], ['profil', 'Profil'], ['historique', 'Historique']];
    let body = '';
    if (tab === 'evaluation') body = sc.must.length ? `<div class="toolbar" style="justify-content:space-between;margin-bottom:8px"><span class="muted" style="font-size:13px">${evalGauge(c, job)}</span>${evals.length ? `<div class="tags">${Object.entries(recos).map(([r, n]) => `<span class="pill ${RECO_PILL[r]}">${plural(n, `avis ${r.toLowerCase()}`, `avis ${r.toLowerCase()}s`)}</span>`).join('')}</div>` : ''}</div>
      <div class="crit">${sc.must.map((m, k) => `<div class="crit-row"><span>${esc(m)}</span>${avg[k] ? `<span class="crit-v">${stars(Math.round(avg[k]))}<small class="num">${avg[k].toFixed(1).replace('.', ',')}</small></span>` : '<span class="muted">—</span>'}</div>`).join('')}
      <div class="crit-row total"><span>Note globale</span>${c.score ? stars(c.score) : '<span class="muted">À évaluer</span>'}</div></div>${evals.length ? '' : '<p class="hint" style="margin:10px 0 0">Les notes viennent des évaluations remplies après chaque entretien.</p>'}` : '<p class="muted">Aucune fiche de cadrage pour cette offre.</p>';
    if (tab === 'entretiens') {
      const ivs = (c.interviews || []).slice().sort((a, x) => a.date.localeCompare(x.date)).map((iv) => {
        const past = iv.date <= now, e = iv.eval;
        const state = e ? `<span class="pill ${RECO_PILL[e.reco]}">${e.reco}</span>` : past ? (canEval(iv) && act ? `<button type="button" class="btn primary sm" data-act="iv-eval" data-id="${c.id}" data-iv="${iv.id}">Évaluer</button>` : '<span class="pill warn">Évaluation attendue</span>') : '<span class="pill info">Prévu</span>';
        return `<div class="todo iv"><div class="t"><b>${esc(iv.kind)}</b><small>${fmtDate(iv.date.slice(0, 10), { weekday: 'long', day: 'numeric', month: 'long' })} à ${iv.date.slice(11, 16)} · avec ${esc(fullName(emp(iv.with)))}</small>
          ${e ? `<details><summary>Voir l’évaluation du ${fmtShort(e.date)}</summary>${sc.must.map((m, k) => `<p><b>${esc(m)} · ${e.ratings[k]}/5</b><br>« ${esc(e.evidence[k])} »</p>`).join('')}${e.comment ? `<p class="muted">${esc(e.comment)}</p>` : ''}</details>` : ''}</div>${state}</div>`; }).join('');
      body = `${ivs || '<p class="muted" style="margin:0 0 6px">Aucun entretien planifié.</p>'}
        ${act ? (ui.drawer.plan ? `<form data-form="interview" data-id="${c.id}" class="plan-form" novalidate><div class="form-grid"><div class="field"><label for="iv-date">Date et heure</label><input id="iv-date" name="date" type="datetime-local" class="input" value="${nextMonday(TODAY)}T10:00"></div>
          <div class="field"><label for="iv-with">Avec</label><select id="iv-with" name="with" class="select">${interviewers.map((e) => `<option value="${e.id}" ${e.id === me().id ? 'selected' : ''}>${esc(fullName(e))}</option>`).join('')}</select></div>
          <div class="field"><label for="iv-kind">Type</label><select id="iv-kind" name="kind" class="select">${['Entretien RH', 'Entretien manager', 'Test technique', 'Entretien final'].map((k) => `<option>${k}</option>`).join('')}</select></div>
          <label class="full" style="display:flex;gap:8px;align-items:center;font-size:14px"><input type="checkbox" name="convoc" checked> Envoyer la convocation au candidat</label></div>
          <div class="toolbar" style="margin-top:10px;justify-content:flex-end"><button type="button" class="btn ghost sm" data-act="cand-plan-x">Annuler</button><button class="btn primary sm">${ic('calendar')}Planifier</button></div></form>`
          : `<div class="toolbar" style="margin-top:12px">${b('cand-plan', `${ic('calendar')}Planifier un entretien`)}</div>`) : ''}`;
    }
    if (tab === 'echanges') body = `${rh && act ? `<div class="toolbar" style="margin-bottom:8px">${b('cand-msg', 'Écrire au candidat', '', 'primary sm')}</div>` : ''}${(c.messages || []).slice().reverse().map((m) => `<div class="msg"><div><b>${esc(m.subject || MSG_TPL[m.kind]?.[0] || 'Message')}</b><small>${fmtDate(m.date)}</small></div>${m.body ? `<details><summary>Lire</summary><p>${esc(m.body).replace(/\n/g, '<br>')}</p></details>` : ''}</div>`).join('') || '<p class="muted" style="margin:0">Aucun message envoyé.</p>'}
      <p class="hint rgpd">${ic('check').replace('<svg', '<svg style="width:13px;height:13px;vertical-align:-2px"')} Dernier contact le ${fmtDate(lastContact(c))}${c.stage === 'Embauché' ? ' · dossier rattaché à la fiche collaborateur' : ` · suppression automatique le ${fmtDate(purgeDate(c))}${c.stage === 'Refusé' ? (c.pool ? ' · dans le vivier' : ' · hors vivier') : ''}`}</p>`;
    if (tab === 'profil') body = `<div class="info-grid"><div><span>E-mail</span>${esc(c.email)}</div><div><span>Téléphone</span>${esc(c.phone)}</div><div><span>Source</span>${esc(c.source)}</div><div><span>Candidature reçue le</span>${fmtDate(c.appliedAt)}</div><div style="grid-column:1/-1"><span>Expérience</span>${esc(c.experience) || '—'}</div></div>
      ${act && rh ? `<div class="field" style="margin-top:14px;max-width:260px"><label for="c-stage">Étape (changement direct)</label><select id="c-stage" class="select" data-change="cand-stage" data-id="${c.id}">${CAND_STAGES.filter((x) => x !== 'Embauché').map((x) => `<option ${x === c.stage ? 'selected' : ''}>${x}</option>`).join('')}</select></div>` : ''}
      <form data-form="cand-note" data-id="${c.id}" style="margin-top:16px"><label class="sub" for="c-notes" style="display:block;margin-bottom:6px">Notes</label><textarea id="c-notes" name="notes" class="input" placeholder="Impressions, points forts, points à creuser…">${esc(c.notes)}</textarea><div class="toolbar" style="margin-top:8px;justify-content:flex-end"><button class="btn ghost sm">Enregistrer la note</button></div></form>`;
    if (tab === 'historique') body = historyRows([{ date: c.appliedAt, by: 'e1', text: `Candidature reçue (${c.source})` }].concat(c.log || []));
    const side = `${banner}${offerBox}<div class="tabs" role="tablist">${tabs.map(([k, l, n]) => `<button type="button" role="tab" aria-selected="${tab === k}" data-act="cand-tab" data-t="${k}">${l}${n ? `<span class="count num">${n}</span>` : ''}</button>`).join('')}</div><div class="need-tab-b">${body}</div>`;
    return `<div class="drawer-h">${avatarName(c.id, c.name, 'lg')}<div style="min-width:0"><h2>${esc(c.name)}</h2><p><span class="ref num">${jobRef(job)}</span> ${esc(job.title)}</p><div class="toolbar" style="margin-top:6px"><span class="pill accent">${esc(c.stage)}</span>${w > ANSWER_DAYS ? `<span class="pill bad">Sans nouvelles depuis ${w} jours</span>` : ''}</div></div>
      ${nav}<button type="button" class="icon-btn drawer-x" data-act="close-drawer" aria-label="Fermer">${ic('x')}</button></div>
      <div class="cand-view"><div class="cand-docs"><div class="tabs" role="tablist" aria-label="Documents du candidat">${files.map((f, k) => `<button type="button" role="tab" aria-selected="${`${f.kind}-${k}` === curKey}" data-act="cand-doc" data-k="${f.kind}-${k}">${ic('file')}${esc(f.label || FILE_KINDS[f.kind])}</button>`).join('') || '<span class="muted" style="padding:10px 0">Aucun document joint</span>'}</div>
        <div class="doc-scroll">${cur ? candFileView(c, job, cur) : '<div class="paper empty">Aucun document joint à cette candidature.</div>'}</div></div>
      <div class="drawer-b cand-side">${side}</div></div>`;
  }

  const findCand = (id) => db.candidates.find((x) => x.id === id);
  const candJob = (c) => db.jobs.find((j) => j.id === c.jobId);
  Object.assign(MOD_ACT, {
    'open-pool'() { ui.recTab = 'vivier'; render(); },
    'rec-tab'(d) { ui.recTab = d.t; if (d.t === 'offres') ui.recJob = null; window.scrollTo(0, 0); render(); },
    'offer-back'() { ui.recJob = null; render(); },
    'offer-tab'(d) { ui.offerTab = d.t; render(); },
    'offer-sort'(d) { if (ui.oSort === d.k) ui.oDir *= -1; else { ui.oSort = d.k; ui.oDir = ['active', 'todo', 'since'].includes(d.k) ? -1 : 1; } render(); },
    'col-toggle'(d) { ui.colOpen = Object.assign({}, ui.colOpen, { [d.s]: !(ui.colOpen || {})[d.s] }); render(); },
    'cand-tab'(d) { ui.drawer.tab = d.t; render(); },
    'cand-plan'() { Object.assign(ui.drawer, { tab: 'entretiens', plan: true }); render(); },
    'cand-plan-x'() { ui.drawer.plan = false; render(); },
    'cand-go'(d) { if (d.id) { ui.drawer = { type: 'cand', id: d.id, doc: null, tab: ui.drawer.tab }; render(); } },
    'cand-doc'(d) { ui.drawer.doc = d.k; render(); },
    // Étape suivante depuis la visionneuse : on enchaîne ensuite sur le candidat suivant de la même colonne.
    'cand-next'(d) {
      const c = findCand(d.id), from = c.stage, list = colList(c), k = list.indexOf(c), after = list[k + 1] || list[k - 1];
      moveCandidate(c.id, NEXT_STAGE[from]);
      if (!ui.modal && c.stage !== from && after && ui.drawer) { ui.drawer = { type: 'cand', id: after.id, doc: null, tab: ui.drawer.tab }; render(); }
    },
    'rev-del'(d) { const j = db.jobs.find((x) => x.id === d.id); j.reviewers = (j.reviewers || []).filter((x) => x !== d.e); logTo(j, `Évaluateur retiré : ${fullName(emp(d.e))}`); toast('Évaluateur retiré'); commit(); },
    'go-pay-tab'(d) { Object.assign(ui, { view: 'paie', stage: null, payTab: d.t }); window.scrollTo(0, 0); render(); },
    'go-admin-tab'(d) { Object.assign(ui, { view: 'collaborateurs', stage: null, adminTab: d.t }); window.scrollTo(0, 0); render(); },
    'iv-eval'(d) { ui.modal = { type: 'iv-eval', id: d.id, iv: d.iv }; render(); },
    'cand-msg'(d) { ui.modal = { type: 'cand-msg', id: d.id }; render(); },
    'offer-new'(d) { ui.modal = { type: 'offer', id: d.id }; render(); },
    'offer-doc'(d) { ui.modal = { type: 'offer-doc', id: d.id }; render(); },
    'offer-accept'(d) { hireFromOffer(findCand(d.id)); commit(); },
    'offer-decline'(d) { ui.modal = { type: 'offer-decline', id: d.id }; render(); },
    'offer-extend'(d) { const c = findCand(d.id); Object.assign(c.offer, { deadline: addDays(TODAY, 7), status: 'Envoyée' }); sendMsg(c, 'relance', ...tplMsg('msg-prolongation', candCtx(c, candJob(c)))); toast('Proposition prolongée de 7 jours'); commit(); },
    'offer-withdraw'(d) { const c = findCand(d.id); c.offer.status = 'Retirée'; c.stage = 'Entretien'; sendMsg(c, 'retrait', ...tplMsg('msg-retrait', candCtx(c, candJob(c)))); toast('Proposition retirée'); commit(); },
  });
  Object.assign(MOD_CHG, {
    rDept(v) { ui.rDept = v; render(); }, rStatus(v) { ui.rStatus = v; render(); }, rFrom(v) { ui.rFrom = v; render(); },
    'rev-add'(v, d) {
      if (!v) return; const j = db.jobs.find((x) => x.id === d.id); j.reviewers = (j.reviewers || []).concat([v]); logTo(j, `Évaluateur invité : ${fullName(emp(v))}`);
      notify(v, `Vous êtes invité·e à évaluer les candidats de l’offre « ${j.title} » (${jobRef(j)}).`); toast(`${fullName(emp(v))} peut évaluer les candidats`); commit();
    },
    'pool-propose'(v, d) {
      if (!v) return; const c = findCand(d.id), j = db.jobs.find((x) => x.id === v);
      Object.assign(c, { jobId: v, stage: 'Présélection', refusal: null, interviews: [], offer: null, pool: false, source: `Vivier · ${c.source.replace(/^Vivier · /, '')}` });
      sendMsg(c, 'point', ...tplMsg('msg-opportunite', candCtx(c, j)));
      logCand(c, `Proposé·e depuis le vivier pour « ${j.title} »`); ui.recTab = 'offres'; ui.recJob = v; toast(`${c.name} est proposé·e pour « ${j.title} »`); commit();
    },
  });
  Object.assign(MOD_LIVE, {
    msg(form) { const c = findCand(ui.modal.id), [subj, body] = MSG_TPL[new FormData(form).get('tpl')][1](c, candJob(c)); document.getElementById('ms-subj').value = subj; document.getElementById('ms-body').value = body; },
    refus(form) { const fd = new FormData(form), c = findCand(ui.modal.id), r = fd.get('reason') === 'Autre motif' ? fd.get('other') : fd.get('reason'); document.getElementById('rf-body').value = refusBody(c, candJob(c), r, fd.get('pool') === 'on'); document.getElementById('rf-other').hidden = fd.get('reason') !== 'Autre motif'; },
    offer(form) { const c = findCand(ui.modal.id), j = candJob(c), s = Number(new FormData(form).get('salary')) || 0;
      document.getElementById('of-warn').innerHTML = s > j.salaryMax ? `<p class="lint bad" style="margin:0">Au-dessus de la fourchette validée dans le besoin (${esc(j.budget)}) : prévoyez l’accord de la direction.</p>` : s && s < j.salaryMin ? `<p class="hint" style="margin:0">En dessous de la fourchette validée (${esc(j.budget)}).</p>` : `<p class="hint" style="margin:0">Dans la fourchette validée (${esc(j.budget)}).</p>`; },
  });
  Object.assign(MOD_FORMS, {
    'iv-eval'(v) {
      const c = findCand(ui.modal.id), job = candJob(c), iv = c.interviews.find((x) => x.id === ui.modal.iv), must = job.scorecard.must;
      const ratings = must.map((m, k) => Number(v[`r${k}`]) || 0), evidence = must.map((m, k) => (v[`e${k}`] || '').trim());
      const miss = must.findIndex((m, k) => !ratings[k] || !evidence[k]);
      if (miss >= 0) return formError(`Notez « ${must[miss]} » et justifiez la note par un fait observé.`);
      if (!v.reco) return formError('Donnez votre recommandation.');
      iv.eval = { date: TODAY, ratings, evidence, reco: v.reco, comment: (v.comment || '').trim(), by: me().id };
      recomputeScore(c, job); logCand(c, `${iv.kind} évalué : avis ${v.reco.toLowerCase()}`);
      if (ui.profile !== 'rh') notify('e1', `${fullName(me())} a évalué ${c.name} (${iv.kind}) : avis ${v.reco.toLowerCase()}.`);
      ui.modal = null; toast('Évaluation enregistrée'); commit();
    },
    'cand-msg'(v) {
      const c = findCand(ui.modal.id);
      if (!v.subject.trim() || !v.body.trim()) return formError('Indiquez un objet et un message.');
      sendMsg(c, v.tpl, v.subject.trim(), v.body.trim()); ui.modal = null; toast(`Message envoyé à ${c.name}`); commit();
    },
    'cand-refuse'(v) {
      const c = findCand(ui.modal.id), reason = v.reason === 'Autre motif' ? (v.other || '').trim() : v.reason;
      if (!reason) return formError('Précisez le motif du refus.');
      c.refusal = { date: TODAY, reason, from: c.stage }; c.pool = v.pool === 'on'; c.stage = 'Refusé'; logCand(c, `Candidature non retenue : ${reason}`);
      if (v.send === 'on') sendMsg(c, 'refus', tplMsg('msg-refus', candCtx(c, candJob(c)))[0], v.body.trim());
      ui.modal = null; toast(`${c.name} : candidature non retenue${v.send === 'on' ? ' · réponse envoyée' : ''}`); commit();
    },
    offer(v) {
      const c = findCand(ui.modal.id), j = candJob(c), salary = Number(v.salary);
      if (!(salary > 0)) return formError('Indiquez la rémunération annuelle brute.');
      if (!v.startDate) return formError('Indiquez la date d’entrée.');
      if (!v.deadline || v.deadline < TODAY) return formError('Indiquez une date limite de réponse à venir.');
      c.offer = { title: v.title.trim() || j.title, contract: j.contract, salary, startDate: v.startDate, managerId: v.managerId, deadline: v.deadline, status: 'Envoyée', sentAt: TODAY };
      c.stage = 'Proposition'; logCand(c, `Proposition envoyée : ${eur0(salary)}, entrée le ${fmtDate(v.startDate)}`);
      c.offer.html = fillTpl(tplOf('proposition').body, candCtx(c, j, { offer: c.offer })); c.offer.tplV = tplOf('proposition').v;
      sendMsg(c, 'proposition', ...offerMsg(c, c.offer));
      if (salary > j.salaryMax) notify(DIR_ID(), `Proposition à ${c.name} au-dessus de la fourchette validée pour « ${j.title} » (${eur0(salary)}).`);
      if (v.managerId !== me().id) notify(v.managerId, `Proposition d’embauche envoyée à ${c.name} (${j.title}) : réponse attendue avant le ${fmtDate(v.deadline)}.`);
      ui.modal = null; toast('Proposition envoyée au candidat'); commit();
    },
    'offer-decline'(v) {
      const c = findCand(ui.modal.id);
      c.offer.status = 'Déclinée'; c.offer.answeredAt = TODAY;
      c.refusal = { date: TODAY, reason: `Proposition déclinée par le candidat : ${v.reason.toLowerCase()}`, from: 'Proposition', declined: true }; c.pool = v.pool === 'on'; c.stage = 'Refusé'; logCand(c, 'Proposition déclinée');
      ui.modal = null; toast(`${c.name} a décliné la proposition`); commit();
    },
  });
  MODALS['iv-eval'] = (m, shell, formShell, opt, f) => {
    const c = findCand(m.id), job = candJob(c), iv = c.interviews.find((x) => x.id === m.iv);
    const levels = [['5', '5 · Excellent'], ['4', '4 · Très bon'], ['3', '3 · Conforme aux attentes'], ['2', '2 · En dessous'], ['1', '1 · Insuffisant']];
    return formShell(`Évaluer ${esc(c.name)}`, 'iv-eval', `<p class="hint" style="margin:0 0 12px">${esc(iv.kind)} du ${fmtDate(iv.date.slice(0, 10))} avec ${esc(fullName(emp(iv.with)))}${iv.with !== me().id ? ' · saisie par les RH pour le compte de l’interviewer' : ''}. Chaque note s’appuie sur un fait observé pendant l’entretien.</p>
      ${job.scorecard.must.map((mm, k) => `<div class="eval-row"><b>${esc(mm)}</b><div class="form-grid"><div class="field"><label for="ev-r${k}">Note</label><select id="ev-r${k}" name="r${k}" class="select"><option value="">Choisir…</option>${opt(levels, '')}</select></div>
        <div class="field"><label for="ev-e${k}">Ce qui justifie la note</label><input id="ev-e${k}" name="e${k}" class="input" maxlength="200" placeholder="Ex. a présenté une étude menée auprès de 20 utilisateurs"></div></div></div>`).join('')}
      <fieldset class="field radios" style="margin-top:14px"><legend>Recommandation</legend>${['Favorable', 'Réservé', 'Défavorable'].map((r) => `<label><input type="radio" name="reco" value="${r}"> ${r}</label>`).join('')}</fieldset>
      <div style="margin-top:12px">${f('ev-c', 'Commentaire (facultatif)', '<textarea id="ev-c" name="comment" class="input" style="min-height:70px"></textarea>', true)}</div>`, 'Enregistrer l’évaluation', true);
  };
  MODALS['cand-msg'] = (m, shell, formShell, opt, f) => {
    const c = findCand(m.id), t = ['', ...MSG_TPL.point[1](c, candJob(c))];
    return formShell(`Écrire à ${esc(c.name)}`, 'cand-msg', `<div class="form-grid">${f('ms-tpl', 'Modèle', `<select id="ms-tpl" name="tpl" class="select" data-live="msg">${opt(Object.entries(MSG_TPL).map(([k, x]) => [k, x[0]]), 'point')}</select>`)}
      ${f('ms-subj', 'Objet', `<input id="ms-subj" name="subject" class="input" value="${esc(t[1])}">`)}${f('ms-body', 'Message', `<textarea id="ms-body" name="body" class="input" style="min-height:180px">${esc(t[2])}</textarea>`, true)}</div>
      <p class="hint" style="margin:8px 0 0">Envoyé à ${esc(c.email)} · le message est conservé dans la fiche du candidat.</p>`, 'Envoyer', true);
  };
  MODALS['cand-refuse'] = (m, shell, formShell, opt, f) => {
    const c = findCand(m.id), j = candJob(c);
    return formShell(`Ne pas retenir ${esc(c.name)}`, 'cand-refuse', `<div class="form-grid">${f('rf-reason', 'Motif', `<select id="rf-reason" name="reason" class="select" data-live="refus">${opt(REFUS_REASONS, REFUS_REASONS[0])}</select>`, true)}
      <div class="field full" id="rf-other" hidden><label for="rf-o">Motif précis</label><input id="rf-o" name="other" class="input" maxlength="160" data-live="refus"></div>
      <label class="full" style="display:flex;gap:8px;align-items:center;font-size:14px"><input type="checkbox" name="pool" checked data-live="refus"> Proposer de garder le dossier dans le vivier (le candidat peut s’y opposer)</label>
      <label class="full" style="display:flex;gap:8px;align-items:center;font-size:14px"><input type="checkbox" name="send" checked> Envoyer la réponse au candidat</label>
      ${f('rf-body', 'Message au candidat', `<textarea id="rf-body" name="body" class="input" style="min-height:190px">${esc(refusBody(c, j, REFUS_REASONS[0], true))}</textarea>`, true)}</div>`, 'Confirmer', true);
  };
  MODALS.offer = (m, shell, formShell, opt, f) => {
    const c = findCand(m.id), j = candJob(c), mid = Math.round(((j.salaryMin || 0) + (j.salaryMax || 0)) / 2 / 500) * 500;
    const mgrs = db.employees.filter(isEmployed).map((x) => [x.id, fullName(x)]), start = j.startWanted && j.startWanted > TODAY ? j.startWanted : nextMonday(TODAY, 4);
    return formShell(`Proposition d’embauche · ${esc(c.name)}`, 'offer', `<p class="hint" style="margin:0 0 12px">Une offre qui précise le poste, la rémunération et la date d’entrée engage l’entreprise dès que le candidat l’accepte. Elle peut être retirée tant qu’il n’a pas répondu.</p><div class="form-grid">
      ${f('of-title', 'Poste', `<input id="of-title" name="title" class="input" value="${esc(j.title)}">`)}${f('of-contract', 'Contrat', `<input id="of-contract" class="input" value="${esc(j.contract)}" readonly>`)}
      ${f('of-salary', 'Rémunération annuelle brute (€)', `<input id="of-salary" name="salary" type="number" min="0" step="500" class="input num" value="${mid || ''}" data-live="offer">`)}${f('of-start', 'Date d’entrée', `<input id="of-start" name="startDate" type="date" class="input" value="${start}">`)}
      ${f('of-mgr', 'Manager', `<select id="of-mgr" name="managerId" class="select">${opt(mgrs, DEPT_HEAD[j.dept])}</select>`)}${f('of-deadline', 'Réponse attendue avant le', `<input id="of-deadline" name="deadline" type="date" class="input" value="${addDays(TODAY, 7)}">`)}
      <div class="full" id="of-warn"><p class="hint" style="margin:0">Fourchette validée : ${esc(j.budget)}.</p></div></div>`, 'Envoyer la proposition', true);
  };
  MODALS['offer-doc'] = (m, shell) => {
    const c = findCand(m.id), o = c.offer, j = candJob(c), html = o.html || fillTpl(tplOf('proposition').body, candCtx(c, j, { offer: o }));
    return shell('Proposition d’embauche', `<div class="modal-b"><article class="letter locked"><header><b>${COMPANY.entreprise}</b><span>${COMPANY.ville}, le ${fmtDate(o.sentAt)}</span></header>${unmark(html)}</article></div>`, '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>', true);
  };
  MODALS['offer-decline'] = (m, shell, formShell, opt, f) => formShell(`Proposition déclinée · ${esc(findCand(m.id).name)}`, 'offer-decline', `${f('od-r', 'Raison donnée par le candidat', `<select id="od-r" name="reason" class="select">${opt(['Rémunération insuffisante', 'A accepté une autre offre', 'Projet personnel', 'Autre raison'])}</select>`, true)}
    <label style="display:flex;gap:8px;align-items:center;font-size:14px;margin-top:12px"><input type="checkbox" name="pool" checked> Garder le dossier dans le vivier</label>`, 'Enregistrer');

  // ================================================================ Arrivée : pré-embauche et embauche (en parallèle), puis intégration
  const ARR_DOCS = [['identite', 'Pièce d’identité'], ['secu', 'Attestation de sécurité sociale (carte Vitale)'], ['rib', 'RIB'], ['domicile', 'Justificatif de domicile'], ['diplome', 'Diplômes et certifications'],
    ['cerfa', 'Contrat d’apprentissage (Cerfa) visé par l’école'], ['convention', 'Convention de stage signée par l’école'], ['rcivile', 'Attestation de responsabilité civile'], ['titre', 'Titre de séjour autorisant à travailler']];
  // Pièces demandées selon le type de contrat.
  const BASE_DOCS = ['identite', 'secu', 'rib', 'domicile', 'diplome'];
  const DOCS_BY_CONTRACT = { CDI: BASE_DOCS, CDD: BASE_DOCS, Alternance: BASE_DOCS.concat(['cerfa']), Stage: ['identite', 'secu', 'rib', 'convention', 'rcivile'] };
  const DOC_REFUSALS = ['Document illisible', 'Document expiré', 'Ce n’est pas le document demandé', 'Document incomplet'];
  const PREP_TASKS = [['poste', 'Poste de travail installé', 'manager'], ['ordinateur', 'Ordinateur et logiciels prêts', 'rh'], ['comptes', 'Comptes et adresse e-mail créés', 'rh'], ['badge', 'Badge d’accès commandé', 'rh'], ['bienvenue', 'Message de bienvenue avec le programme du premier jour', 'manager']];
  const planList = () => (db.onboardingPlan || []).map((x) => [x.k, x.label, Number(x.day) || 0, x.owner]);
  const CHECKINS = [['j30', 'Point à 30 jours', 30], ['j60', 'Point à 60 jours', 60], ['j90', 'Point à 90 jours', 90]];
  const OWNER = { manager: 'Manager', rh: 'RH', parrain: 'Parrain' };
  const NOTICE_LABEL = { 1: '24 heures', 2: '48 heures', 14: '2 semaines', 30: '1 mois' };
  function dossier(e) {
    db.onboarding = db.onboarding || {};
    const d = db.onboarding[e.id] = db.onboarding[e.id] || {};
    return Object.assign(d, { docs: d.docs || {}, files: d.files || {}, contract: d.contract || { status: 'À préparer' }, prep: d.prep || {}, plan: d.plan || {}, checkins: d.checkins || {} });
  }
  const needsTitre = (e) => e.zone === 'Hors UE';
  // Nationalités (au féminin, comme « de nationalité française »), regroupées selon le droit au travail en France.
  const NATIONALITIES = [['France', ['Française']], ['Union européenne', ['Allemande', 'Autrichienne', 'Belge', 'Bulgare', 'Chypriote', 'Croate', 'Danoise', 'Espagnole', 'Estonienne', 'Finlandaise', 'Grecque', 'Hongroise', 'Irlandaise', 'Italienne', 'Lettone', 'Lituanienne', 'Luxembourgeoise', 'Maltaise', 'Néerlandaise', 'Polonaise', 'Portugaise', 'Roumaine', 'Slovaque', 'Slovène', 'Suédoise', 'Tchèque']], ['EEE et Suisse (sans titre de séjour)', ['Islandaise', 'Liechtensteinoise', 'Norvégienne', 'Suisse']],
    ['Autres pays (titre de séjour autorisant à travailler)', ['Afghane', 'Albanaise', 'Algérienne', 'Américaine', 'Andorrane', 'Angolaise', 'Argentine', 'Arménienne', 'Australienne', 'Azerbaïdjanaise', 'Bangladaise', 'Béninoise', 'Biélorusse', 'Bolivienne', 'Bosnienne', 'Brésilienne', 'Britannique', 'Burkinabè', 'Burundaise', 'Cambodgienne', 'Camerounaise', 'Canadienne', 'Cap-verdienne', 'Centrafricaine', 'Chilienne', 'Chinoise', 'Colombienne', 'Comorienne', 'Congolaise (Congo)', 'Congolaise (RD Congo)', 'Coréenne', 'Costaricienne', 'Cubaine', 'Djiboutienne', 'Dominicaine', 'Égyptienne', 'Émirienne', 'Équatorienne', 'Érythréenne', 'Éthiopienne', 'Gabonaise', 'Géorgienne', 'Ghanéenne', 'Guatémaltèque', 'Guinéenne', 'Haïtienne', 'Hondurienne', 'Indienne', 'Indonésienne', 'Irakienne', 'Iranienne', 'Israélienne', 'Ivoirienne', 'Jamaïcaine', 'Japonaise', 'Jordanienne', 'Kazakhe', 'Kényane', 'Kosovare', 'Koweïtienne', 'Laotienne', 'Libanaise', 'Libérienne', 'Libyenne', 'Macédonienne', 'Malaisienne', 'Malgache', 'Malienne', 'Marocaine', 'Mauricienne', 'Mauritanienne', 'Mexicaine', 'Moldave', 'Monégasque', 'Mongole', 'Monténégrine', 'Mozambicaine', 'Népalaise', 'Néo-zélandaise', 'Nicaraguayenne', 'Nigériane', 'Nigérienne', 'Ouzbèke', 'Pakistanaise', 'Palestinienne', 'Panaméenne', 'Paraguayenne', 'Péruvienne', 'Philippine', 'Qatarienne', 'Russe', 'Rwandaise', 'Salvadorienne', 'Saoudienne', 'Sénégalaise', 'Serbe', 'Singapourienne', 'Somalienne', 'Soudanaise', 'Sri-lankaise', 'Sud-africaine', 'Syrienne', 'Tadjike', 'Taïwanaise', 'Tanzanienne', 'Tchadienne', 'Thaïlandaise', 'Togolaise', 'Tunisienne', 'Turque', 'Ukrainienne', 'Uruguayenne', 'Vénézuélienne', 'Vietnamienne', 'Yéménite', 'Zambienne', 'Zimbabwéenne', 'Apatride', 'Autre nationalité']]];
  const zoneOf = (n) => (n === 'Française' ? 'France' : NATIONALITIES[1][1].includes(n) || NATIONALITIES[2][1].includes(n) ? 'UE' : n ? 'Hors UE' : null);
  const nationalitySelect = (e, attrs) => { const v = e.nationality || '', known = NATIONALITIES.some(([, l]) => l.includes(v));
    return `<select class="select" ${attrs} data-search="1" data-placeholder="Rechercher une nationalité…"><option value="" ${v ? '' : 'selected'}>Choisir…</option>${!known && v ? `<option selected>${esc(v)}</option>` : ''}${NATIONALITIES.map(([g, l]) => `<optgroup label="${g}">${l.map((x) => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('')}</optgroup>`).join('')}</select>`; };
  const reqDocs = (e) => ARR_DOCS.filter(([k]) => (DOCS_BY_CONTRACT[e.contract] || BASE_DOCS).includes(k) || (k === 'titre' && needsTitre(e)));
  // État d'une pièce : validée par les RH, déposée (à vérifier), refusée (à redéposer) ou manquante.
  const docState = (d, k) => (d.docs[k] ? 'ok' : d.files[k] && d.files[k].refused ? 'refused' : d.files[k] ? 'check' : 'missing');
  // Jours ouvrables : du lundi au samedi.
  function subWorkDays(s, n) { let d = s; while (n > 0) { d = addDays(d, -1); if (parse(d).getDay() !== 0) n -= 1; } return d; }
  function addWorkDays(s, n) { let d = s; while (n > 0) { d = addDays(d, 1); if (parse(d).getDay() !== 0) n -= 1; } return d; }
  function trialInfo(e) {
    const d = dossier(e), alt = e.contract === 'Alternance';
    const cr = CONV().rules, months = e.contract === 'CDI' ? ({ Cadre: cr.essaiC, 'Agent de maîtrise': cr.essaiAM }[e.category] || cr.essaiE) : e.contract === 'CDD' ? 1 : 0;
    if (!months && !alt) return null;
    // CDD (art. L1242-10) : 1 jour par semaine de contrat, 2 semaines au plus si le contrat dure 6 mois ou moins, 1 mois au-delà.
    if (e.contract === 'CDD' && e.endDate && e.endDate <= addDays(addMonths(e.startDate, 6), -1)) {
      const days = Math.min(14, Math.max(1, Math.ceil((dayDiff(e.startDate, e.endDate) + 1) / 7))), end = addDays(e.startDate, days - 1), presence = days;
      const notice = presence > 30 ? 14 : presence >= 8 ? 2 : 1;
      return { end, notice, months: 0, alt: false, decideBy: addDays(end, -notice), renewable: false, label: `${plural(days, 'jour', 'jours')} (1 jour par semaine de contrat, 2 semaines au plus)` };
    }
    let end = alt ? addDays(e.startDate, 44) : addDays(addMonths(e.startDate, months), -1);
    if (d.trialRenewed) end = addDays(addMonths(addDays(end, 1), months), -1);
    const presence = dayDiff(e.startDate, end), notice = alt ? 0 : presence > 90 ? 30 : presence > 30 ? 14 : presence >= 8 ? 2 : 1;
    return { end, notice, months, alt, decideBy: addDays(end, -notice), renewable: e.contract === 'CDI' && !d.trialRenewed && !!cr.renouv,
      label: alt ? '45 jours de formation pratique en entreprise' : `${months} mois${d.trialRenewed ? `, renouvelée de ${months} mois` : ''}` };
  }
  function arrivalSteps(e, stage) {
    const d = dossier(e);
    if (stage === 2) return [reqDocs(e).every(([k]) => d.docs[k]) && (!needsTitre(e) || !!d.titreCheck), d.contract.status === 'Signé', PREP_TASKS.every(([k]) => d.prep[k]) && !!d.buddy];
    if (stage === 3 && isIntern(e)) return [!!d.convention && !!e.registeredAt, true, !!d.assignedAt, true];
    if (stage === 3) return [!!d.dpae && !!e.registeredAt, !!d.info7 && !!d.info1m, !!d.assignedAt, !!d.mutuelle && db.visits.some((v) => v.empId === e.id && /information/i.test(v.kind) && v.date >= addDays(e.startDate, -30))];
    // V2 : la période d'essai (juridique) et l'intégration (managériale) se terminent séparément ; sans période d'essai, seul le bilan clôt l'intégration.
    return planList().map(([k]) => !!d.plan[k]).concat([!!d.checkins.j30, !!d.astonish, trialInfo(e) ? !!d.trialDecision && d.trialDecision !== 'Renouvelée' : !!d.integrationClosed]);
  }
  // Actions qui attendent le profil courant pour une arrivée, sur la page de l'étape i (2 pré-embauche, 3 embauche, 4 intégration).
  function arrivalActions(e, i = e.stage) {
    const d = dossier(e), rh = ui.profile === 'rh', mine = (o) => (rh ? o === 'rh' : o !== 'rh'), out = [], start = e.startDate;
    if (i === 2 && e.stage === 2) {
      const check = reqDocs(e).filter(([k]) => docState(d, k) === 'check').length, miss = reqDocs(e).filter(([k]) => ['missing', 'refused'].includes(docState(d, k))).length;
      if (rh && check) out.push(plural(check, 'pièce à vérifier', 'pièces à vérifier'));
      if (rh && miss && dayDiff(TODAY, start) <= 10) out.push(`${plural(miss, 'pièce manquante', 'pièces manquantes')} à moins de 10 jours de l’arrivée`);
      if (rh && needsTitre(e) && !d.titreCheck) out.push(`vérifier le titre de séjour avant le ${fmtShort(subWorkDays(start, 2))}`);
      if (rh && ['À préparer', 'Prêt'].includes(d.contract.status)) out.push(d.contract.status === 'Prêt' ? 'contrat à envoyer pour signature' : 'contrat à préparer');
      const prep = PREP_TASKS.filter(([k, , o]) => !d.prep[k] && mine(o)).length + (!d.buddy && !rh ? 1 : 0);
      if (prep) out.push(plural(prep, 'tâche de préparation', 'tâches de préparation'));
    } else if (i === 3 && e.stage === 2 && rh && isIntern(e)) {
      if (!d.convention && TODAY >= addDays(start, -10)) out.push(TODAY > start ? 'convention de stage manquante' : 'convention de stage à récupérer signée');
      if (!e.registeredAt && TODAY >= start) out.push('inscription au registre');
      if (!d.assignedAt && TODAY >= addDays(start, -8)) out.push('affectation à confirmer');
    } else if (i === 3 && e.stage === 2 && rh) {
      if (!d.dpae && TODAY >= addDays(start, -8)) out.push(TODAY > start ? 'DPAE en retard' : 'DPAE à faire');
      if (!e.registeredAt && TODAY >= start) out.push('inscription au registre');
      if (!d.info7 && TODAY >= start) out.push(`informations à remettre avant le ${fmtShort(addDays(start, 7))}`);
      else if (d.info7 && !d.info1m && TODAY >= addDays(start, 7)) out.push(`informations complémentaires avant le ${fmtShort(addMonths(start, 1))}`);
      if (!d.mutuelle && TODAY >= addDays(start, -8)) out.push('mutuelle');
      if (!d.assignedAt && TODAY >= addDays(start, -8)) out.push('affectation à confirmer');
    } else if (i === 4 && e.stage === 4) {
      const late = planList().filter(([k, , day, o]) => !d.plan[k] && TODAY >= addDays(start, day) && mine(o)).length;
      if (late) out.push(plural(late, 'action du programme', 'actions du programme'));
      CHECKINS.forEach(([k, l, day]) => { if (!d.checkins[k] && TODAY >= addDays(start, day) && TODAY <= addDays(start, day + 30)) out.push(l.toLowerCase()); });
      const t = trialInfo(e);
      if (rh && t && !d.trialDecision && dayDiff(TODAY, t.decideBy) <= 14) out.push(`décision sur la période d’essai avant le ${fmtShort(t.decideBy)}`);
      if (rh && arrivalSteps(e, 4).every(Boolean)) out.push('intégration à clôturer');
    }
    return out;
  }
  // Pièces que la recrue doit encore déposer depuis son espace.
  const myArrivalTodo = (e) => (e.stage === 2 ? reqDocs(e).filter(([k]) => ['missing', 'refused'].includes(docState(dossier(e), k))).length : 0);
  // Passage automatique en intégration : pré-embauche et embauche terminées, contrat signé.
  function syncArrivals() {
    db.employees.filter((e) => e.stage === 3).forEach((e) => { e.stage = 2; });
    db.employees.filter((e) => e.stage === 2 && arrivalSteps(e, 2).every(Boolean) && arrivalSteps(e, 3).every(Boolean)).forEach((e) => {
      db.journey[e.id] = db.journey[e.id] || {}; db.journey[e.id][2] = STAGES[2].steps.map(() => true); db.journey[e.id][3] = STAGES[3].steps.map(() => true);
      e.stage = 4; notify(e.id, 'Votre pré-embauche et votre embauche sont terminées : place à l’intégration !');
      if (e.managerId) notify(e.managerId, `${fullName(e)} passe en intégration.`);
      if (ui.selPerson === e.id) ui.selPerson = null;
      toast(`${fullName(e)} passe automatiquement en intégration`);
    });
  }
  // Relances : pièces manquantes à J-10 (RH et recrue), rappel du premier jour à J-7 (recrue).
  function arrivalReminders() {
    db.employees.filter((e) => e.stage === 2).forEach((e) => {
      const d = dossier(e), days = dayDiff(TODAY, e.startDate), miss = myArrivalTodo(e);
      if (days >= 0 && days <= 10 && miss && !d.remind10) {
        d.remind10 = TODAY;
        notify('e1', `Relance J-10 : ${plural(miss, 'pièce manquante', 'pièces manquantes')} pour ${fullName(e)}, qui arrive le ${fmtDate(e.startDate)}.`);
        notify(e.id, `Il vous reste ${plural(miss, 'pièce', 'pièces')} à déposer avant votre arrivée le ${fmtDate(e.startDate)}.`);
      }
      if (days >= 0 && days <= 7 && !d.remind7) { d.remind7 = TODAY; notify(e.id, `Votre arrivée approche : rendez-vous le ${fmtDate(e.startDate)}. Votre programme du premier jour est dans « Mon arrivée ».`); }
    });
  }
  function arrivalDossier(e, i) {
    const d = dossier(e), rh = ui.profile === 'rh', mgr = ui.profile === 'manager', can = (o) => rh || (mgr && o !== 'rh');
    const row = (label, sub, state) => `<div class="todo"><div class="t"><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</div>${state}</div>`;
    const ok = (date, txt = 'Fait') => `<span class="pill ok">${txt} · ${fmtShort(date)}</span>`;
    const b = (act, label, extra = '', cls = 'ghost') => `<button type="button" class="btn ${cls} sm" data-act="${act}" data-id="${e.id}" ${extra}>${label}</button>`;
    const pend = (txt = 'À faire', cls = 'warn') => `<span class="pill ${cls}">${txt}</span>`;
    const days = dayDiff(TODAY, e.startDate), start = e.startDate;
    const when = days > 0 ? `Arrivée dans ${plural(days, 'jour', 'jours')}, le ${fmtDate(start)}` : days === 0 ? 'Arrivée aujourd’hui' : `Arrivée le ${fmtDate(start)} · J+${-days}`;
    const sec = (title, body) => `<h4 class="sub" style="margin-top:18px">${title}</h4>${body}`;
    // Le manager ne voit en embauche que l'avancement (les puces), sans le détail administratif.
    if (i === 3 && !rh) return '';
    let html = `<p class="hint" style="margin:12px 0 0">${when} · ${esc(e.contract)} · ${esc(e.title)} · manager : ${e.managerId ? esc(fullName(emp(e.managerId))) : '—'}${d.buddy && emp(d.buddy) ? ` · parrain : ${esc(fullName(emp(d.buddy)))}` : d.buddy === 'none' ? ' · sans parrain' : ''}</p>`;
    if (i === 2) {
      if (rh) {
        const sel = (f, list, v) => `<select class="select" data-change="arr-civ" data-id="${e.id}" data-f="${f}" aria-label="${f}">${list.map((x) => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
        html += sec('État civil (registre du personnel)', `<div class="form-grid civ"><div class="field"><label>Sexe</label>${sel('sex', ['—', 'F', 'H'], e.sex || '—')}</div><div class="field"><label>Nationalité</label>${nationalitySelect(e, `data-change="arr-civ" data-id="${e.id}" data-f="nationality" aria-label="Nationalité"`)}</div>
          <div class="field"><label>Zone</label>${sel('zone', ['France', 'UE', 'Hors UE'], e.zone || 'France')}<small class="field-hint">Déduite de la nationalité ; « Hors UE » demande un titre de séjour</small></div><div class="field"><label>Date de naissance</label><input type="date" class="input" value="${esc(e.birthDate || '')}" data-change="arr-civ" data-id="${e.id}" data-f="birthDate" aria-label="Date de naissance"></div></div>`);
        html += sec(`Pièces du dossier · contrat ${esc(e.contract)}`, `<p class="hint" style="margin:0 0 6px">${esc(e.firstName)} dépose ses pièces depuis son espace ; vous les vérifiez ici.</p>` + reqDocs(e).map(([k, l]) => { const st = docState(d, k), f = d.files[k];
          const file = f ? `<button type="button" class="btn ghost sm" data-act="file-view" data-id="${e.id}" data-k="${k}">${ic('file')}Voir</button>` : '';
          const sub = k === 'titre' ? 'Salarié hors Union européenne : le titre doit autoriser à travailler' : f ? `${esc(f.name)} · déposé le ${fmtShort(f.date)}${f.refused ? ` · refusé : ${esc(f.refused)}` : ''}` : '';
          return row(l, sub, st === 'ok' ? `${ok(d.docs[k], 'Validé')}${file}` : st === 'check' ? `<span class="pill info">À vérifier</span>${file}${b('arr-doc', `${ic('check')}Valider`, `data-k="${k}"`, 'ok')}${b('doc-refuse', 'Refuser', `data-k="${k}"`)}`
            : `${pend(st === 'refused' ? 'À redéposer' : 'En attente du dépôt', st === 'refused' ? 'bad' : 'neutral')}${b('arr-doc', 'Reçu sur papier', `data-k="${k}"`)}`); }).join('')
          + (needsTitre(e) ? row('Vérification du titre auprès de la préfecture', `Au plus tard le ${fmtDate(subWorkDays(start, 2))}, 2 jours ouvrables avant l’embauche (art. R5221-41)`, d.titreCheck ? ok(d.titreCheck, 'Demande envoyée') : b('arr-titre', 'Demande envoyée')) : ''));
        const c = d.contract, st = { 'À préparer': 'neutral', Prêt: 'info', Envoyé: 'warn', Signé: 'ok' }[c.status];
        html += sec('Contrat de travail', row(`Contrat ${esc(e.contract)} · ${esc(e.title)}`, `${e.contract === 'CDD' ? 'À transmettre au plus tard 2 jours ouvrables après l’embauche (art. L1242-13). ' : ''}${c.status === 'Envoyé' ? `Envoyé le ${fmtShort(c.sentAt)} : ${esc(e.firstName)} le signe à la main depuis l’onglet « Contrat de travail » de son espace.` : `Poste, rémunération, durée du travail, période d’essai, ${CONV().mention}.`}`,
          `<span class="pill ${st}">${c.status === 'Envoyé' ? 'En attente de signature' : c.status === 'Signé' ? `${ic('lock')}Signé${c.paper ? ' sur papier' : ''}` : c.status}${c.signedAt ? ` le ${fmtShort(c.signedAt)}` : ''}</span>${c.docId ? docBtn(db.documents.find((x) => x.id === c.docId), c.status === 'Signé' ? 'Voir le contrat signé' : 'Voir') : ''}
          ${c.status === 'À préparer' ? b('arr-contract', 'Générer le contrat', 'data-s="Prêt"', 'primary') : c.status === 'Prêt' ? b('arr-contract', 'Envoyer pour signature', 'data-s="Envoyé"') : c.status === 'Envoyé' ? b('arr-contract', 'Signé sur papier', 'data-s="Signé"') : ''}`));
      }
      // Tout l'effectif présent peut parrainer (sauf la recrue et son manager), en commençant par son service ; « Pas de parrain » est un choix assumé.
      const buddies = db.employees.filter((x) => isEmployed(x) && x.stage >= 4 && x.id !== e.id && x.id !== e.managerId).sort((a, z) => (z.dept === e.dept) - (a.dept === e.dept) || a.lastName.localeCompare(z.lastName, 'fr'));
      const noBuddy = d.buddy === 'none', bd = d.buddy && emp(d.buddy), canB = can('manager');
      html += sec('Préparation de l’arrivée', PREP_TASKS.map(([k, l, o]) => row(l, OWNER[o], d.prep[k] ? ok(d.prep[k]) : can(o) ? b('arr-prep', 'Fait', `data-k="${k}"`) : pend('À faire', 'neutral'))).join('')
        + row('Parrain ou marraine', 'Un collègue qui transmet les codes de l’équipe, distinct du manager', noBuddy ? `<span class="pill neutral">Pas de parrain</span>${canB ? `<button type="button" class="btn ghost sm" data-act="arr-buddy-set" data-id="${e.id}" data-v="">Changer</button>` : ''}`
          : !canB ? (bd ? `<span class="pill ok">${esc(fullName(bd))}</span>` : pend('À désigner')) : `<div class="succ-pick"><select class="select" data-change="arr-buddy" data-id="${e.id}" aria-label="Parrain ou marraine"><option value="">Rechercher un salarié…</option>${buddies.map((x) => `<option value="${x.id}" ${x.id === d.buddy ? 'selected' : ''}>${esc(fullName(x))}</option>`).join('')}</select>
            <label class="agree"><input type="checkbox" data-change="arr-buddy-none" data-id="${e.id}"> Pas de parrain</label></div>`));
      if (mgr) html += `<p class="hint" style="margin:10px 0 0">Les pièces du dossier et le contrat sont gérés par les RH.</p>`;
    }
    if (i === 3) {
      const open = TODAY >= addDays(start, -8);
      if (isIntern(e)) html += sec('Formalités du stage', row('Convention de stage tripartite', 'Signée par l’école, l’entreprise et le stagiaire avant le premier jour. Un stagiaire n’est pas salarié : pas de DPAE ni de contrat de travail.',
          d.convention ? ok(d.convention, 'Signée') : b('arr-conv', 'Convention reçue signée', '', TODAY >= addDays(start, -5) ? 'primary' : 'ghost'))
        + row('Registre unique du personnel', 'Les stagiaires sont inscrits dans une partie spécifique du registre', `${e.registeredAt ? ok(e.registeredAt, 'Inscrit') : b('arr-register', 'Inscrire')}<button type="button" class="btn ghost sm" data-act="register-view">Voir le registre</button>`)
        + row('Tuteur ou tutrice dans l’entreprise', 'Obligatoire ; un tuteur suit au plus 3 stagiaires', e.managerId ? ok(TODAY, esc(fullName(emp(e.managerId)))) : pend('À désigner', 'warn')));
      else html += sec('Formalités', row('Déclaration préalable à l’embauche (DPAE)', 'Auprès de l’Urssaf, au plus tôt 8 jours avant l’embauche et au plus tard avant la prise de poste. Elle vaut aussi adhésion au service de santé au travail.',
        d.dpae ? ok(d.dpae.date, `N° ${esc(d.dpae.ref)}`) : open ? b('arr-dpae', TODAY > start ? 'Faire la DPAE (en retard)' : 'Effectuer la DPAE', '', TODAY > start ? 'bad' : 'primary') : `<span class="pill neutral">Possible dès le ${fmtShort(addDays(start, -8))}</span>`)
        + row('Registre unique du personnel', 'Inscription obligatoire au moment de l’embauche', `${e.registeredAt ? ok(e.registeredAt, 'Inscrit') : b('arr-register', 'Inscrire')}<button type="button" class="btn ghost sm" data-act="register-view">Voir le registre</button>`));
      const info = (k, l, sub, due) => { const doc = d[k + 'Doc'] && db.documents.find((x) => x.id === d[k + 'Doc']);
        return row(l, `${sub} · à remettre avant le ${fmtDate(due)}`, d[k] ? `${ok(d[k], 'Remis')}${docBtn(doc)}` : doc ? `<span class="pill warn">Brouillon</span>${docBtn(doc)}` : b('arr-info', 'Rédiger', `data-k="${k}"`, TODAY > due ? 'bad' : 'ghost')); };
      if (!isIntern(e)) html += sec('Informations obligatoires (décret du 30 octobre 2023)', info('info7', 'Informations essentielles', 'Identité des parties, lieu de travail, emploi, date d’embauche, période d’essai, rémunération, durée du travail', addDays(start, 7))
        + info('info1m', 'Informations complémentaires', 'Congés payés, procédure de rupture et préavis, droit à la formation, protection sociale, convention collective', addMonths(start, 1)));
      const t = trialInfo(e);
      html += sec('Affectation', row(`${esc(e.title)} · ${esc(e.dept)}`, `Manager : ${e.managerId ? esc(fullName(emp(e.managerId))) : '—'} · catégorie ${esc(e.category || '—')} · période d’essai : ${t ? `${t.label}, jusqu’au ${fmtDate(t.end)}` : 'aucune'}`,
        `<select class="select" data-change="arr-civ" data-id="${e.id}" data-f="category" aria-label="Catégorie">${['Cadre', 'Agent de maîtrise', 'Employé'].map((x) => `<option ${x === e.category ? 'selected' : ''}>${x}</option>`).join('')}</select>${d.assignedAt ? ok(d.assignedAt, 'Confirmée') : b('arr-assign', 'Confirmer')}`));
      const vip = db.visits.find((v) => v.empId === e.id && /information/i.test(v.kind) && v.date >= addDays(start, -30));
      if (isIntern(e)) html += sec('Dispositifs', row('Gratification', `Obligatoire au-delà de 2 mois de stage : au moins ${eur(STAGE_FREE)} par mois, exonérée de cotisations`, ok(e.startDate, `${eur0(e.salary / 12)} par mois`)));
      else html += sec('Dispositifs', row('Mutuelle d’entreprise', 'Affiliation obligatoire au contrat collectif, sauf dispense justifiée', `<select class="select" data-change="arr-mutuelle" data-id="${e.id}" aria-label="Mutuelle"><option value="">À choisir</option>${['Affiliation', 'Dispense'].map((x) => `<option ${x === d.mutuelle ? 'selected' : ''}>${x}</option>`).join('')}</select>`)
        + (e.category === 'Cadre' ? row('Prévoyance des cadres', 'Obligatoire : 1,50 % de la tranche A à la charge de l’employeur', d.prevoyance ? ok(d.assignedAt || TODAY, 'Affilié') : b('arr-prev', 'Affilier')) : '')
        + row('Visite d’information et de prévention', `Dans les 3 mois suivant la prise de poste, avant le ${fmtDate(addMonths(start, 3))}`, vip ? `<span class="pill ${vip.status === 'Réalisée' ? 'ok' : 'info'}">${vip.status} · ${fmtShort(vip.date)}</span>` : b('arr-vip', 'Planifier la visite')));
    }
    if (i === 4) {
      html += sec('Programme d’intégration', planList().map(([k, l, day, o]) => { const due = addDays(start, day);
        return row(esc(l), `${OWNER[o]} · J+${day}, le ${fmtShort(due)}`, d.plan[k] ? ok(d.plan[k]) : `${TODAY > due ? pend('En retard', 'bad') : `<span class="pill neutral">Prévu</span>`}${can(o) ? b('arr-plan', 'Fait', `data-k="${k}"`) : ''}`); }).join(''));
      html += sec('Points de suivi', CHECKINS.map(([k, l, day]) => { const due = addDays(start, day), c = d.checkins[k];
        return c ? row(l, `${fmtDate(c.date)} · « ${esc(c.note)} »`, ok(c.date)) : TODAY >= addDays(due, -7) && (rh || mgr)
          ? `<form class="todo checkin" data-form="arr-checkin" data-id="${e.id}" data-k="${k}"><div class="t"><b>${l}</b><small>Prévu le ${fmtDate(due)} · manager et nouvel arrivant</small><label class="sr" for="ck-${k}">Compte rendu</label><input id="ck-${k}" name="note" class="input" placeholder="Ce qui va bien, les points à ajuster, les objectifs suivants"></div><button class="btn ghost sm">Enregistrer</button></form>`
          : row(l, `Prévu le ${fmtDate(due)}`, '<span class="pill neutral">À venir</span>'); }).join(''));
      html += sec('Rapport d’étonnement', d.astonish ? `<q>${esc(d.astonish.text)}</q><p class="hint" style="margin:6px 0 0">Rédigé le ${fmtDate(d.astonish.date)}</p>`
        : '<p class="hint" style="margin:0">Rédigé par le nouvel arrivant depuis son espace, conseillé vers J+30.</p>');
      const t = trialInfo(e);
      if (t) {
        const near = !d.trialDecision && dayDiff(TODAY, t.decideBy) <= 14;
        html += sec('Période d’essai', row(`${t.label} · fin le ${fmtDate(t.end)}`, t.alt ? 'Pour un apprenti, la rupture est libre pendant les 45 premiers jours de formation pratique en entreprise.'
          : `Pour y mettre fin, prévenez le salarié au plus tard le ${fmtDate(t.decideBy)} (délai de prévenance de ${NOTICE_LABEL[t.notice]}).${t.renewable ? ' Renouvellement possible une fois, avec l’accord écrit du salarié avant la fin de la période initiale.' : ''}`,
          d.trialDecision ? `<span class="pill ${d.trialDecision === 'Rompue' ? 'bad' : 'ok'}">${d.trialDecision} · ${fmtShort(d.trialDecisionAt)}</span>${d.trialDoc ? docBtn(db.documents.find((x) => x.id === d.trialDoc)) : ''}` : near ? pend(`Décision avant le ${fmtShort(t.decideBy)}`) : '<span class="pill neutral">En cours</span>')
          + (rh && (!d.trialDecision || d.trialDecision === 'Renouvelée') ? `<div class="toolbar" style="margin-top:10px">${b('arr-trial', `${ic('check')}Confirmer l’embauche`, 'data-v="Confirmée"', 'ok')}${t.renewable ? b('trial-renew', 'Renouveler') : ''}${b('trial-break', 'Mettre fin à la période d’essai', '', 'bad')}</div>` : ''));
      }
      // V2 : fin d'intégration distincte de la période d'essai (un stagiaire n'en a pas).
      const steps = arrivalSteps(e, 4), others = steps.slice(0, -1), left = others.filter((x) => !x).length, trialOk = !t || (d.trialDecision && d.trialDecision !== 'Renouvelée');
      html += sec('Fin de l’intégration', row(t ? 'Bilan d’intégration et passage en poste' : 'Bilan d’intégration (pas de période d’essai)',
        `${left ? `${plural(left, 'point du programme reste', 'points du programme restent')} ouvert${left > 1 ? 's' : ''}. ` : 'Programme terminé. '}${t && !trialOk ? 'La décision sur la période d’essai doit être prise avant.' : 'La personne passe en poste et sort des arrivées.'}`,
        rh ? b('arr-close', `${ic('check')}Clôturer l’intégration`, trialOk ? '' : 'disabled', trialOk && !left ? 'primary' : 'ghost') : pend('Clôture par les RH', 'neutral')));
    }
    return html;
  }
  // Programme d'intégration : modèle unique pour toute l'entreprise, que les RH composent.
  function planConfig() {
    const plan = db.onboardingPlan || [];
    return card('Programme d’intégration · modèle de l’entreprise', `<span class="muted num" style="font-size:13px">${plural(plan.length, 'étape', 'étapes')}</span>`, `<div class="card-b"><p class="hint" style="margin:0 0 12px">S’applique à toutes les nouvelles recrues, triées par jour après l’arrivée. Une étape supprimée disparaît des programmes en cours ; ce qui a déjà été fait reste enregistré.</p>
      <div class="plan-cfg">${plan.map((x, k) => `<div class="plan-row"><span class="plan-n num">${k + 1}</span><label class="sr" for="pl-l-${x.k}">Intitulé de l’étape ${k + 1}</label><input id="pl-l-${x.k}" class="input" value="${esc(x.label)}" maxlength="90" data-change="plan-edit" data-k="${x.k}" data-f="label">
        <label class="plan-day">J+<input class="input num" type="number" min="0" max="180" value="${x.day}" data-change="plan-edit" data-k="${x.k}" data-f="day" aria-label="Jour après l’arrivée"></label>
        <select class="select" data-change="plan-edit" data-k="${x.k}" data-f="owner" aria-label="Responsable">${Object.entries(OWNER).map(([v, l]) => `<option value="${v}" ${v === x.owner ? 'selected' : ''}>${l}</option>`).join('')}</select>
        <button type="button" class="icon-btn" data-act="plan-del" data-k="${x.k}" aria-label="Supprimer l’étape « ${esc(x.label)} »" ${plan.length <= 1 ? 'disabled' : ''}>${ic('x')}</button></div>`).join('')}</div>
      <form class="plan-row add" data-form="plan-add" novalidate><span class="plan-n">${ic('plus')}</span><label class="sr" for="pl-new">Nouvelle étape</label><input id="pl-new" name="label" class="input" maxlength="90" placeholder="Ex. Rencontre avec la direction">
        <label class="plan-day">J+<input class="input num" name="day" type="number" min="0" max="180" value="5" aria-label="Jour après l’arrivée"></label><select class="select" name="owner" aria-label="Responsable">${Object.entries(OWNER).map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select><button class="btn primary sm">Ajouter</button></form></div>`);
  }
  // Espace de la recrue : son programme et son rapport d'étonnement.
  function myIntegration(e) {
    const d = dossier(e);
    return `${card('Mon programme d’intégration', '', `<div class="card-b">${planList().map(([k, l, day, o]) => `<div class="todo"><div class="t"><b>${esc(l)}</b><small>${OWNER[o]} · ${fmtDate(addDays(e.startDate, day), { weekday: 'long', day: 'numeric', month: 'long' })}</small></div>${d.plan[k] ? '<span class="pill ok">Fait</span>' : '<span class="pill neutral">Prévu</span>'}</div>`).join('')}</div>`)}
      ${card('Mon rapport d’étonnement', '', `<div class="card-b">${d.astonish ? `<q>${esc(d.astonish.text)}</q><p class="hint" style="margin:6px 0 0">Envoyé le ${fmtDate(d.astonish.date)}</p>`
        : `<form data-form="arr-astonish" data-id="${e.id}"><label class="sr" for="as-${e.id}">Rapport d’étonnement</label><textarea id="as-${e.id}" name="text" class="input" placeholder="Ce qui m’a surpris, ce que je changerais, ce que j’apprécie déjà…"></textarea><div class="toolbar" style="margin-top:8px"><span class="hint">Conseillé vers J+30 · lu par les RH et votre manager.</span><button class="btn primary sm" style="margin-left:auto">Envoyer</button></div></form>`}</div>`)}`;
  }

  // ---- Espace de la recrue : « Mon arrivée » (pré-embauche) et « Contrat de travail » (embauche)
  function viewArrivee() {
    const e = me(), d = dossier(e), days = dayDiff(TODAY, e.startDate), mgr = e.managerId && emp(e.managerId), buddy = d.buddy && emp(d.buddy);
    const docs = reqDocs(e).map(([k, l]) => { const st = docState(d, k), f = d.files[k];
      const state = st === 'ok' ? '<span class="pill ok">Validé</span>' : st === 'check' ? '<span class="pill info">En cours de vérification</span>' : st === 'refused' ? '<span class="pill bad">À redéposer</span>' : '<span class="pill warn">À déposer</span>';
      const up = st === 'missing' || st === 'refused' ? `<label class="btn ${st === 'refused' ? 'primary' : 'ghost'} sm upload">${ic('plus')}${st === 'refused' ? 'Déposer à nouveau' : mobSal() ? 'Photo ou fichier' : 'Déposer'}<input type="file" accept=".pdf,image/*" data-change="arr-upload" data-k="${k}" aria-label="Déposer : ${esc(l)}"></label>` : '';
      return `<div class="todo"><div class="t"><b>${esc(l)}</b><small>${f ? `${esc(f.name)} · déposé le ${fmtShort(f.date)}${f.refused ? ` · refusé : ${esc(f.refused)}` : ''}` : d.docs[k] ? `Reçu le ${fmtShort(d.docs[k])}` : 'PDF ou photo lisible'}</small></div>${state}${up}</div>`; }).join('');
    const first = planList().filter(([, , day]) => day <= 2);
    const c = d.contract;
    return `<div class="panel stage-page"><div class="card card-b">${stageHead(2)}<p style="margin:14px 0 0">Bienvenue ${esc(e.firstName)} ! ${days > 0 ? `Vous nous rejoignez dans <b class="num">${plural(days, 'jour', 'jours')}</b>, le ${fmtDate(e.startDate, { weekday: 'long', day: 'numeric', month: 'long' })}` : `Vous nous avez rejoints le ${fmtDate(e.startDate)}`}, au poste de ${esc(e.title)} (${esc(e.contract)}).</p>
      ${locked(e) ? '<p class="hint" style="margin:6px 0 0">Les autres rubriques de votre espace s’ouvriront le jour de votre arrivée.</p>' : ''}</div>
      <div class="card"><div class="card-h"><h3>Où en est mon arrivée</h3></div><div class="card-b">${stepsList(arrivalSteps(e, 2), STAGES[2].steps, false)}</div></div>
      ${c.status === 'Envoyé' ? `<div class="card card-b callout"><b>${ic('edit')}Votre contrat de travail est prêt à signer</b><button type="button" class="btn primary sm" data-act="go" data-v="contrat">${mobSal() ? 'Lire mon contrat' : 'Signer mon contrat'}${ic('arrow')}</button></div>` : ''}
      ${card('Mes documents', `<span class="muted num" style="font-size:13px">${plural(reqDocs(e).filter(([k]) => d.docs[k]).length, 'pièce validée', 'pièces validées')} sur ${reqDocs(e).length}</span>`, `<div class="card-b"><p class="hint" style="margin:0 0 6px">Pièces demandées pour un contrat ${esc(e.contract)}. Les RH les vérifient et vous préviennent si l’une doit être redéposée.</p>${docs}</div>`)}
      ${card('Mon premier jour', '', `<div class="card-b"><div class="info-grid"><div><span>Date et lieu</span>${fmtDate(e.startDate, { weekday: 'long', day: 'numeric', month: 'long' })} · ${esc(e.location)}</div><div><span>Manager</span>${mgr ? esc(fullName(mgr)) : '—'}</div><div><span>Parrain ou marraine</span>${buddy ? esc(fullName(buddy)) : d.buddy === 'none' ? 'Pas de parrain prévu : ton manager t’accompagne' : 'Bientôt désigné'}</div><div><span>Contact RH</span>${esc(fullName(emp(db.settings.company.signataire) || emp('e1')))} · rh@${esc(COMPANY.domaine)}</div></div>
        <h4 class="sub" style="margin-top:16px">Au programme</h4>${first.map(([, l, day]) => `<div class="todo"><div class="t"><b>${esc(l)}</b><small>${day ? `J+${day}` : 'Premier jour'}</small></div></div>`).join('') || '<p class="muted" style="margin:0">Le programme sera bientôt disponible.</p>'}</div>`)}</div>`;
  }
  function viewContrat() {
    const e = me(), d = dossier(e), c = d.contract, docs = db.documents.filter((x) => x.empId === e.id && ['contrat', 'avenant'].includes(x.kind) && docVisible(x)).sort((a, b) => a.date.localeCompare(b.date));
    const pending = e.stage === 2 && c.status === 'Envoyé' && c.docId && db.documents.find((x) => x.id === c.docId);
    let main;
    if (pending) main = `<div class="card"><div class="card-h"><h3>Contrat à signer</h3><span class="pill warn">Envoyé le ${fmtShort(c.sentAt)}</span></div><div class="card-b"><article class="letter">${docBody(pending)}</article>
      ${mobSal() ? `<div class="callout-info mob-sign">${ic('lock')}<span>La signature du contrat se fait sur ordinateur, pour le relire sur grand écran. Ouvre Teamora sur ton ordinateur : ton contrat t’y attend.</span></div>` : `<div class="sign-box"><h4 class="sub">Votre signature</h4><p class="hint" style="margin:0 0 8px">Signez à la souris ou au doigt dans le cadre : votre signature sera apposée sur le contrat.</p>
        <canvas id="sig-pad" class="sig-pad" width="560" height="170" aria-label="Zone de signature"></canvas>
        <div class="toolbar" style="margin-top:10px"><button type="button" class="btn ghost sm" data-act="sig-clear">Effacer</button><label class="agree"><input type="checkbox" id="sig-ok"> J’ai lu le contrat et j’en accepte les termes (« lu et approuvé »)</label>
        <button type="button" class="btn primary" data-act="sig-sign" data-id="${pending.id}" style="margin-left:auto">${ic('edit')}Signer le contrat</button></div><p class="err" id="sig-err" aria-live="polite"></p></div>`}</div></div>`;
    else if (e.stage === 2 && c.status !== 'Signé') main = `<div class="card card-b"><p style="margin:0">Votre contrat est en cours de préparation par les RH. Vous serez prévenu·e dès qu’il sera prêt à signer.</p></div>`;
    else main = '';
    return `<div class="panel stage-page"><div class="card card-b">${stageHead(3)}</div>${main}
      ${card('Mes documents contractuels', '', `<div class="card-b">${docs.filter((x) => x !== pending).map((x) => `<div class="todo"><span class="doc-ic">${ic('file')}</span><div class="t"><b>${esc(x.title)}</b><small>${fmtDate(x.date)}${x.signature ? ` · signé le ${fmtDate(x.signature.date)}` : ''}</small></div><button type="button" class="btn ghost sm" data-act="doc-view" data-id="${x.id}">Consulter</button></div>`).join('') || '<p class="muted" style="margin:0">Aucun document signé pour le moment.</p>'}</div>`)}
      ${e.stage === 2 ? card('Où en est mon embauche', '', `<div class="card-b">${stepsList(arrivalSteps(e, 3), STAGES[3].steps, false)}</div>`) : ''}</div>`;
  }
  // Signature manuscrite : tracé à la souris, au stylet ou au doigt.
  function bindSignature() {
    const cv = document.getElementById('sig-pad'); if (!cv) return;
    const ctx = cv.getContext('2d'); let drawing = false; cv._strokes = 0;
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1b2559';
    const pos = (ev) => { const r = cv.getBoundingClientRect(); return [(ev.clientX - r.left) * (cv.width / r.width), (ev.clientY - r.top) * (cv.height / r.height)]; };
    cv.addEventListener('pointerdown', (ev) => { drawing = true; cv.setPointerCapture(ev.pointerId); const [x, y] = pos(ev); ctx.beginPath(); ctx.moveTo(x, y); cv._strokes += 1; });
    cv.addEventListener('pointermove', (ev) => { if (!drawing) return; const [x, y] = pos(ev); ctx.lineTo(x, y); ctx.stroke(); cv._ink = (cv._ink || 0) + 1; });
    const end = () => { drawing = false; };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  }
  function registerHTML() {
    const list = db.employees.filter((e) => e.registeredAt).sort((a, b) => a.registeredAt.localeCompare(b.registeredAt) || a.startDate.localeCompare(b.startDate));
    return `<div class="table-wrap"><table class="register"><thead><tr><th>N°</th><th>Nom et prénoms</th><th>Nationalité</th><th>Naissance</th><th>Sexe</th><th>Emploi</th><th>Qualification</th><th>Contrat</th><th>Entrée</th><th>Sortie</th></tr></thead><tbody>
      ${list.map((e, k) => `<tr><td class="num">${k + 1}</td><td><b>${esc(e.lastName.toUpperCase())}</b> ${esc(e.firstName)}</td><td>${esc(e.nationality || '—')}</td><td class="num">${fmtShort(e.birthDate)}</td><td>${esc(e.sex || '—')}</td><td>${esc(e.title)}</td><td>${esc(e.category || '—')}</td><td>${esc(e.contract)}</td><td class="num">${fmtShort(e.startDate)}</td><td class="num">${e.stage >= 15 && e.exit ? fmtShort(e.exit.lastDay) : '—'}</td></tr>`).join('')}</tbody></table></div>`;
  }
  const arrE = (d) => emp(d.id);
  Object.assign(MOD_ACT, {
    // Pendant l'arrivée, on ouvre la pré-embauche, ou l'embauche (RH) quand la pré-embauche est terminée.
    'open-dossier'(d) { const e = emp(d.id), k = procOf(e);
      if (!k || ui.profile === 'salarie') { const i = e.stage; Object.assign(ui, { view: 'etape', stage: i, selPerson: e.id, drawer: null, notif: false }); }
      else Object.assign(ui, { view: k, stage: PROC[k].node, procTab: e.stage === 15 ? 'apres' : 'cours', procSel: e.id, procPhase: null, drawer: null, notif: false, modal: null });
      window.scrollTo(0, 0); render(); },
    'register-view'() { ui.modal = { type: 'register' }; render(); },
    'arr-doc'(d) { const e = arrE(d), x = dossier(e); x.docs[d.k] = TODAY; if (x.files[d.k]) delete x.files[d.k].refused; toast(x.files[d.k] ? 'Pièce validée' : 'Pièce reçue'); commit(); },
    'doc-refuse'(d) { ui.modal = { type: 'doc-refuse', id: d.id, k: d.k }; render(); },
    'file-view'(d) { ui.modal = { type: 'file-view', id: d.id, k: d.k }; render(); },
    'sig-clear'() { const cv = document.getElementById('sig-pad'); if (cv) { cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); cv._strokes = 0; cv._ink = 0; } },
    'sig-sign'(d) {
      const cv = document.getElementById('sig-pad'), err = document.getElementById('sig-err');
      if (!cv || !(cv._ink > 8)) { err.textContent = 'Tracez votre signature dans le cadre.'; return; }
      if (!document.getElementById('sig-ok').checked) { err.textContent = 'Cochez la case « lu et approuvé » pour signer.'; return; }
      const e = me(), doc = db.documents.find((x) => x.id === d.id), c = dossier(e).contract;
      doc.signature = { img: cv.toDataURL('image/png'), date: TODAY, name: fullName(e) };
      // Signé = figé : le document n'est plus modifiable par personne.
      Object.assign(doc, { status: 'Signé', signedAt: TODAY, html: unmark(doc.html || '') });
      Object.assign(c, { status: 'Signé', signedAt: TODAY });
      notify('e1', `${fullName(e)} a signé son contrat de travail.`); if (e.managerId) notify(e.managerId, `Le contrat de ${fullName(e)} est signé.`);
      ui.modal = { type: 'doc', id: doc.id }; toast('Contrat signé · un exemplaire est disponible dans vos documents'); commit();
    },
    'plan-del'(d) { ui.modal = { type: 'plan-del', k: d.k }; render(); },
    'plan-del-ok'(d) { db.onboardingPlan = db.onboardingPlan.filter((x) => x.k !== d.k); ui.modal = null; toast('Étape supprimée du programme'); commit(); },
    'arr-titre'(d) { dossier(arrE(d)).titreCheck = TODAY; toast('Demande de vérification envoyée à la préfecture'); commit(); },
    'arr-contract'(d) {
      const e = arrE(d), c = dossier(e).contract;
      // Le contrat naît en brouillon depuis le modèle du type de contrat : les RH le relisent et le complètent avant de l'envoyer.
      if (d.s === 'Prêt') { db.documents = db.documents.filter((x) => x.id !== c.docId); c.docId = addDoc(e.id, 'contrat').id; c.status = 'Prêt'; ui.modal = { type: 'doc-edit', id: c.docId }; toast('Contrat créé : complétez-le puis envoyez-le pour signature'); commit(); return; }
      const doc = db.documents.find((x) => x.id === c.docId);
      if (d.s === 'Envoyé') { const err = doc ? issueDoc(doc) : 'Contrat introuvable.'; if (err) { ui.modal = { type: 'doc-edit', id: doc.id, err }; render(); return; } toast(`Contrat envoyé à ${fullName(e)} pour signature`); commit(); return; }
      if (d.s === 'Signé') { c.signedAt = TODAY; c.paper = true; if (doc) Object.assign(doc, { status: 'Signé', signedAt: TODAY, html: unmark(doc.html || '') }); notify(e.managerId, `Le contrat de ${fullName(e)} est signé.`); }
      c.status = d.s; toast('Contrat signé sur papier'); commit();
    },
    'arr-prep'(d) { const e = arrE(d); dossier(e).prep[d.k] = TODAY; toast('Tâche terminée'); commit(); },
    'arr-dpae'(d) { const e = arrE(d); dossier(e).dpae = { date: TODAY, ref: `DPAE-75-${TODAY.slice(0, 4)}-${String(Math.floor(Math.random() * 9000) + 1000)}` }; toast('DPAE transmise à l’Urssaf · accusé de réception reçu'); commit(); },
    'arr-register'(d) { arrE(d).registeredAt = TODAY; toast('Inscrit au registre unique du personnel'); commit(); },
    'arr-info'(d) { const e = arrE(d), x = dossier(e), doc = addDoc(e.id, d.k); x[d.k + 'Doc'] = doc.id; ui.modal = { type: 'doc-edit', id: doc.id }; toast('Brouillon créé : relisez-le avant de le remettre'); commit(); },
    'arr-conv'(d) { const e = arrE(d); dossier(e).convention = TODAY; db.history.push({ id: uid('h'), empId: e.id, date: TODAY, label: 'Convention de stage', detail: 'Convention tripartite reçue signée' }); toast('Convention de stage enregistrée'); commit(); },
    'arr-close'(d) { const e = arrE(d), x = dossier(e), t = trialInfo(e);
      if (t && !(x.trialDecision && x.trialDecision !== 'Renouvelée')) { toast('Décide d’abord de la période d’essai.', 'info'); return; }
      x.integrationClosed = TODAY; e.stage = 5; db.history.push({ id: uid('h'), empId: e.id, date: TODAY, label: 'Fin de l’intégration', detail: t ? 'Période d’essai confirmée, bilan d’intégration fait' : 'Bilan d’intégration fait' });
      notify(e.id, 'Ton intégration est terminée : bienvenue dans l’équipe !'); if (e.managerId) notify(e.managerId, `Intégration de ${fullName(e)} clôturée.`);
      ui.selPerson = null; toast(`${fullName(e)} est en poste`); commit(); },
    'arr-assign'(d) { const e = arrE(d); dossier(e).assignedAt = TODAY; toast('Affectation confirmée'); commit(); },
    'arr-prev'(d) { dossier(arrE(d)).prevoyance = true; toast('Affiliation à la prévoyance enregistrée'); commit(); },
    'arr-vip'(d) { const e = arrE(d), date = addDays(e.startDate > TODAY ? e.startDate : TODAY, 21); db.visits.push({ id: uid('v'), empId: e.id, kind: "Visite d'information et de prévention", date, status: 'Planifiée', result: null }); notify(e.id, `Visite d’information et de prévention prévue le ${fmtDate(date)}.`); toast('Visite planifiée · visible dans Santé & QVT'); commit(); },
    'arr-buddy-set'(d) { dossier(emp(d.id)).buddy = null; render(); setTimeout(() => { const q = document.querySelector('.succ-pick .emp-pick input'); if (q) q.focus(); }, 0); },
    'arr-plan'(d) { dossier(arrE(d)).plan[d.k] = TODAY; toast('Étape du programme terminée'); commit(); },
    'arr-trial'(d) { const e = arrE(d), x = dossier(e), doc = addDoc(e.id, 'essai'); ui.modal = { type: 'doc-edit', id: doc.id }; Object.assign(x, { trialDecision: 'Confirmée', trialDecisionAt: TODAY, trialDoc: doc.id }); notify(e.id, 'Votre période d’essai est confirmée : bienvenue définitivement chez ' + COMPANY.nom + ' !'); if (e.managerId) notify(e.managerId, `Période d’essai de ${fullName(e)} confirmée.`); toast('Période d’essai confirmée'); commit(); },
    'trial-renew'(d) { ui.modal = { type: 'trial-renew', id: d.id }; render(); },
    'trial-break'(d) { ui.modal = { type: 'trial-break', id: d.id }; render(); },
  });
  Object.assign(MOD_CHG, {
    'arr-civ'(v, d) { const e = emp(d.id); e[d.f] = v === '—' ? null : v;
      if (d.f === 'nationality' && zoneOf(v) && zoneOf(v) !== e.zone) { e.zone = zoneOf(v); if (e.zone === 'Hors UE') toast('Nationalité hors UE, EEE et Suisse : titre de séjour autorisant à travailler ajouté aux pièces', 'info'); }
      commit(); },
    'arr-buddy-none'(v, d, t) { if (!t.checked) return; dossier(emp(d.id)).buddy = 'none'; toast('Pas de parrain pour cette arrivée'); commit(); },
    'arr-buddy'(v, d) { const e = emp(d.id); dossier(e).buddy = v || null; if (v) notify(v, `Vous êtes le parrain ou la marraine de ${fullName(e)}, qui arrive le ${fmtDate(e.startDate)}.`); toast(v ? 'Parrain désigné' : 'Parrain retiré'); commit(); },
    'arr-mutuelle'(v, d) { dossier(emp(d.id)).mutuelle = v || null; toast('Mutuelle enregistrée'); commit(); },
    // Dépôt d'une pièce par la recrue : le fichier est gardé dans ce navigateur s'il est léger (aperçu), sinon seul son nom l'est.
    'arr-upload'(v, d, t) {
      const file = t.files && t.files[0]; if (!file) return;
      const e = me(), x = dossier(e), label = ARR_DOCS.find(([k]) => k === d.k)[1];
      const done = (data) => { x.files[d.k] = { name: file.name, date: TODAY, type: file.type, data }; notify('e1', `${fullName(e)} a déposé une pièce à vérifier : ${label}.`); toast('Pièce déposée · les RH vont la vérifier'); commit(); };
      if (file.size <= 700 * 1024 && /^(image\/|application\/pdf)/.test(file.type)) { const r = new FileReader(); r.onload = () => done(r.result); r.onerror = () => done(null); r.readAsDataURL(file); } else done(null);
    },
    'plan-edit'(v, d) {
      const x = db.onboardingPlan.find((p) => p.k === d.k); if (!x) return;
      if (d.f === 'label') { if (!v.trim()) { toast('L’intitulé ne peut pas être vide.', 'info'); render(); return; } x.label = v.trim(); }
      else if (d.f === 'day') x.day = Math.max(0, Math.min(180, Math.round(Number(v) || 0))); else x.owner = v;
      db.onboardingPlan.sort((a, b) => a.day - b.day); toast('Programme mis à jour'); commit();
    },
    'as-mgr'(v) { ui = Object.assign({ profile: ui.selfOf ? 'salarie' : 'manager', selfOf: ui.selfOf, view: 'accueil', stage: null, asEmp: ui.asEmp, asMgr: v }, freshUI()); render(); toast(`Tu vois l’application en tant que ${fullName(emp(v))}${emp(v).managerId ? '' : ' (Direction)'}.`); },
    'as-emp'(v) { ui = Object.assign({ profile: 'salarie', view: 'accueil', stage: null, asEmp: v }, freshUI()); render(); toast(`Vous voyez l’espace de ${fullName(me())}.`); },
  });
  Object.assign(MOD_FORMS, {
    'plan-add'(v) {
      if (!v.label.trim()) { toast('Indiquez l’intitulé de l’étape.', 'info'); return; }
      db.onboardingPlan.push({ k: uid('p'), label: v.label.trim(), day: Math.max(0, Math.min(180, Math.round(Number(v.day) || 0))), owner: v.owner });
      db.onboardingPlan.sort((a, b) => a.day - b.day); toast('Étape ajoutée au programme'); commit();
    },
    'doc-refuse'(v) {
      const e = emp(ui.modal.id), x = dossier(e), why = v.reason === 'Autre' ? (v.other || '').trim() : v.reason, label = ARR_DOCS.find(([k]) => k === ui.modal.k)[1];
      if (!why) return formError('Précisez le motif pour que la recrue sache quoi redéposer.');
      x.files[ui.modal.k].refused = why; delete x.docs[ui.modal.k];
      notify(e.id, `Votre pièce « ${label} » est à redéposer : ${why}.`); ui.modal = null; toast('Pièce refusée · la recrue est prévenue'); commit();
    },
    'arr-checkin'(v, form) { const e = emp(form.dataset.id); if (!v.note.trim()) { toast('Écrivez un court compte rendu.', 'info'); return; } dossier(e).checkins[form.dataset.k] = { date: TODAY, note: v.note.trim(), by: me().id }; toast('Point de suivi enregistré'); commit(); },
    'arr-astonish'(v, form) { const e = emp(form.dataset.id); if (!v.text.trim()) { toast('Le rapport est vide.', 'info'); return; } dossier(e).astonish = { date: TODAY, text: v.text.trim() }; if (ui.profile !== 'rh') notify('e1', `Rapport d’étonnement de ${fullName(e)} disponible.`); toast('Rapport d’étonnement enregistré'); commit(); },
    'trial-renew'(v) {
      const e = emp(ui.modal.id); if (v.agree !== 'on') return formError('Le renouvellement exige l’accord écrit du salarié, obtenu avant la fin de la période initiale.');
      Object.assign(dossier(e), { trialRenewed: true, trialDecision: 'Renouvelée', trialDecisionAt: TODAY }); notify(e.id, `Votre période d’essai est renouvelée jusqu’au ${fmtDate(trialInfo(e).end)}.`);
      ui.modal = null; toast('Période d’essai renouvelée'); commit();
    },
    'trial-break'(v) {
      const e = emp(ui.modal.id), t = trialInfo(e), min = addDays(TODAY, t.notice);
      if (!v.lastDay || v.lastDay < min) return formError(`Avec le délai de prévenance de ${NOTICE_LABEL[t.notice] || 'aucun délai'}, la rupture prend effet au plus tôt le ${fmtDate(min)}.`);
      Object.assign(dossier(e), { trialDecision: 'Rompue', trialDecisionAt: TODAY });
      e.exit = { reason: 'Rupture de la période d’essai', lastDay: v.lastDay, comment: (v.comment || '').trim() }; e.stage = 13;
      db.journey[e.id] = db.journey[e.id] || {}; db.journey[e.id][13] = [true, false, false, false, false];
      notify(e.id, `Fin de votre période d’essai : dernier jour le ${fmtDate(v.lastDay)}.`); if (e.managerId) notify(e.managerId, `Fin de la période d’essai de ${fullName(e)} le ${fmtDate(v.lastDay)}.`);
      ui.modal = null; ui.selPerson = null; toast(`Départ de ${fullName(e)} lancé`); commit();
    },
  });
  MODALS['doc-refuse'] = (m, shell, formShell, opt, f) => formShell(`Refuser la pièce · ${esc(ARR_DOCS.find(([k]) => k === m.k)[1])}`, 'doc-refuse',
    `<div class="form-grid">${f('dr-r', 'Motif communiqué à la recrue', `<select id="dr-r" name="reason" class="select">${opt(DOC_REFUSALS.concat(['Autre']))}</select>`, true)}${f('dr-o', 'Si autre, précisez', '<input id="dr-o" name="other" class="input" maxlength="140">', true)}</div>`, 'Refuser la pièce');
  MODALS['file-view'] = (m, shell) => {
    const e = emp(m.id), x = dossier(e).files[m.k], label = ARR_DOCS.find(([k]) => k === m.k)[1];
    const view = x.data && /^data:image\//.test(x.data) ? `<img class="file-img" src="${x.data}" alt="${esc(label)}">` : x.data ? `<embed class="file-pdf" src="${x.data}" type="application/pdf">`
      : `<div class="file-ph">${ic('file')}<b>${esc(x.name)}</b><span>Déposé le ${fmtDate(x.date)} par ${esc(fullName(e))}. Aperçu non disponible dans la démonstration.</span></div>`;
    return shell(`${esc(label)} · ${esc(fullName(e))}`, `<div class="modal-b">${view}</div>`, '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>', true);
  };
  MODALS['plan-del'] = (m, shell) => { const x = db.onboardingPlan.find((p) => p.k === m.k);
    return shell('Supprimer l’étape du programme', `<div class="modal-b"><p style="margin:0">« ${esc(x.label)} » sera retirée du programme de toutes les recrues en intégration.</p></div>`,
      `<div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Annuler</button><button type="button" class="btn bad" data-act="plan-del-ok" data-k="${x.k}">Supprimer</button></div>`); };
  MODALS.register = (m, shell) => shell('Registre unique du personnel', `<div class="modal-b"><p class="hint" style="margin:0 0 12px">Tenu dès le premier salarié, dans l’ordre des embauches. Les mentions sont conservées 5 ans après le départ du salarié.</p>${registerHTML()}</div>`, '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>', true);
  MODALS['trial-renew'] = (m, shell, formShell) => { const e = emp(m.id), t = trialInfo(e);
    return formShell(`Renouveler la période d’essai · ${esc(fullName(e))}`, 'trial-renew', `<p style="margin:0 0 12px">La période d’essai serait prolongée de ${t.months} mois, jusqu’au ${fmtDate(addDays(addMonths(addDays(t.end, 1), t.months), -1))}. Le renouvellement doit être prévu par le contrat et par la convention collective (${CONV().kind === 'syntec' ? 'Syntec l’autorise' : 'prévu par la convention saisie dans les paramètres'}).</p>
      <label style="display:flex;gap:8px;align-items:center;font-size:14px"><input type="checkbox" name="agree"> J’ai reçu l’accord écrit du salarié, daté d’avant le ${fmtDate(t.end)}</label>`, 'Renouveler'); };
  MODALS['trial-break'] = (m, shell, formShell, opt, f) => { const e = emp(m.id), t = trialInfo(e), min = addDays(TODAY, t.notice);
    return formShell(`Mettre fin à la période d’essai · ${esc(fullName(e))}`, 'trial-break', `<p style="margin:0 0 12px">${t.notice ? `Délai de prévenance : ${NOTICE_LABEL[t.notice]}. La rupture prend effet au plus tôt le ${fmtDate(min)}.` : 'Aucun délai de prévenance.'} Aucune indemnité de rupture n’est due ; la rupture doit être notifiée par écrit.</p>
      <div class="form-grid">${f('tb-day', 'Dernier jour travaillé', `<input id="tb-day" name="lastDay" type="date" class="input" value="${min > t.end ? t.end : min}">`)}${f('tb-c', 'Commentaire interne (facultatif)', '<input id="tb-c" name="comment" class="input" maxlength="140">')}</div>`, 'Confirmer la rupture'); };

  // ================================================================ Vie administrative (étape 6)
  const CHANGE_FIELDS = { address: ['Adresse postale', 'Justificatif de domicile de moins de 3 mois'], iban: ['Coordonnées bancaires (RIB)', 'RIB au nom du salarié'], family: ['Situation familiale', 'Acte ou attestation (mariage, PACS, naissance…)'], lastName: ['Nom d’usage', 'Pièce justificative'] };
  const FAMILY = ['Célibataire', 'Marié·e', 'Pacsé·e', 'Divorcé·e', 'Veuf·ve'];
  const pendingChanges = () => (db.changeReqs || []).filter((r) => r.status === 'En attente' && (ui.profile === 'rh' || r.empId === me().id));
  // Échéancier : tout ce qui arrive à expiration dans les 120 prochains jours (ou déjà dépassé).
  function adminDeadlines(people) {
    const out = [], horizon = addDays(TODAY, 120), push = (e, date, label, sub) => { if (date <= horizon) out.push({ e, date, label, sub }); };
    people.filter((e) => e.stage >= 2 && e.stage < 15).forEach((e) => {
      if (e.titreEnd) push(e, addDays(e.titreEnd, -90), `Titre de séjour : expire le ${fmtDate(e.titreEnd)}`, 'Demander le justificatif de renouvellement et vérifier l’autorisation de travail');
      if (e.contract === 'CDD' && e.endDate) push(e, addDays(e.endDate, -30), `Fin de CDD le ${fmtDate(e.endDate)}`, 'Renouvellement, embauche en CDI ou fin du contrat (indemnité de fin de contrat de 10 %)');
      if (e.contract === 'Alternance' && e.endDate) push(e, addDays(e.endDate, -60), `Fin du contrat d’alternance le ${fmtDate(e.endDate)}`, 'Préparer la suite : embauche ou fin de contrat');
      if (e.stage === 4) { const t = trialInfo(e), d = dossier(e); if (t && !d.trialDecision) push(e, t.decideBy, `Période d’essai : fin le ${fmtDate(t.end)}`, 'Décision à notifier en respectant le délai de prévenance'); }
      if (e.stage === 3) { const d = dossier(e); if (!d.info7) push(e, addDays(e.startDate, 7), 'Informations essentielles à remettre', 'Décret du 30 octobre 2023'); }
    });
    visitsDue(people).forEach((v) => push(v.e, v.deadline, v.kind, v.why));
    return out.sort((a, b) => a.date.localeCompare(b.date));
  }
  function viewAdmin() {
    const rh = ui.profile === 'rh', people = scopeEmployees(), dl = adminDeadlines(people), reqs = pendingChanges();
    const tabs = [['annuaire', rh ? 'Annuaire' : 'Mon équipe'], ['echeances', 'Échéances', dl.filter((x) => x.date <= addDays(TODAY, 30)).length]].concat(rh ? [['demandes', 'Demandes de modification', reqs.length]] : []).concat([['organigramme', 'Organigramme']]);
    if (!tabs.some((t) => t[0] === ui.adminTab)) ui.adminTab = 'annuaire';
    let body = '';
    if (ui.adminTab === 'annuaire') body = viewEmployees();
    else if (ui.adminTab === 'echeances') body = card('Échéancier administratif', '<span class="muted" style="font-size:13px">120 prochains jours</span>', `<div class="card-b">${dl.length ? dl.map((x) => { const late = x.date < TODAY, soon = !late && x.date <= addDays(TODAY, 30);
      return `<div class="todo">${avatar(x.e, 'sm')}<div class="t"><b>${esc(fullName(x.e))} · ${esc(x.label)}</b><small>${esc(x.sub)}</small></div><span class="pill ${late ? 'bad' : soon ? 'warn' : 'neutral'}">${late ? 'Dépassé' : 'À traiter'} · ${fmtShort(x.date)}</span><button type="button" class="btn ghost sm" data-act="open-emp" data-id="${x.e.id}">Ouvrir</button></div>`; }).join('') : '<p class="muted" style="margin:0">Aucune échéance dans les 120 prochains jours.</p>'}</div>`);
    else if (ui.adminTab === 'demandes') {
      const all = (db.changeReqs || []).slice().sort((a, b) => (a.status === 'En attente' ? 0 : 1) - (b.status === 'En attente' ? 0 : 1) || b.createdAt.localeCompare(a.createdAt));
      body = card('Demandes de modification des salariés', '', `<div class="card-b">${all.length ? all.map((r) => { const e = emp(r.empId);
        return `<div class="todo">${avatar(e, 'sm')}<div class="t"><b>${esc(fullName(e))} · ${esc(r.label)}</b><small>${esc(r.from || '—')} → <b>${esc(r.to)}</b> · justificatif : ${esc(r.proof || 'aucun')} · demandé le ${fmtShort(r.createdAt)}</small>${r.reason ? `<small>Motif du refus : ${esc(r.reason)}</small>` : ''}</div>
          ${r.status === 'En attente' ? `<button type="button" class="btn ok sm" data-act="chg-ok" data-id="${r.id}">${ic('check')}Valider</button><button type="button" class="btn bad sm" data-act="chg-ko" data-id="${r.id}">Refuser</button>` : `<span class="pill ${r.status === 'Validée' ? 'ok' : 'bad'}">${r.status}</span>`}</div>`; }).join('') : '<p class="muted" style="margin:0">Aucune demande.</p>'}
        <p class="hint" style="margin:12px 0 0">Les modifications validées mettent à jour la fiche et sont transmises à la paie. Dossier conservé 5 ans après le départ du salarié.</p></div>`);
    } else {
      body = orgChart();
    }
    return `<div class="tabs" role="tablist">${tabs.map(([k, l, n]) => `<button type="button" role="tab" aria-selected="${ui.adminTab === k}" data-act="tab" data-k="adminTab" data-t="${k}">${l}${n ? `<span class="count num">${n}</span>` : ''}</button>`).join('')}</div>${body}`;
  }
  function myChangesHTML(e) {
    const mine = (db.changeReqs || []).filter((r) => r.empId === e.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return `<form class="card" data-form="chg-req" novalidate><div class="card-h"><h3>Demander une modification</h3><span class="muted" style="font-size:13px">Validée par les RH avec un justificatif</span></div><div class="card-b"><div class="form-grid">
        <div class="field"><label for="cr-field">Information</label><select id="cr-field" name="field" class="select">${Object.entries(CHANGE_FIELDS).map(([k, [l]]) => `<option value="${k}">${l}</option>`).join('')}</select></div>
        <div class="field"><label for="cr-to">Nouvelle valeur</label><input id="cr-to" name="to" class="input" placeholder="Ex. nouvelle adresse, nouvel IBAN, Marié·e…"></div>
        <div class="field full"><label for="cr-proof">Justificatif</label><input id="cr-proof" name="proof" type="file" class="input" accept=".pdf,.jpg,.png"></div></div>
        <div class="toolbar" style="margin-top:14px"><span class="err" id="cr-err"></span><button class="btn primary" style="margin-left:auto">Envoyer</button></div>
        ${mine.length ? `<div style="margin-top:14px">${mine.map((r) => `<div class="todo"><div class="t"><b>${esc(r.label)} → ${esc(r.to)}</b><small>Demandé le ${fmtShort(r.createdAt)}${r.reason ? ` · ${esc(r.reason)}` : ''}</small></div><span class="pill ${r.status === 'Validée' ? 'ok' : r.status === 'Refusée' ? 'bad' : 'warn'}">${r.status}</span></div>`).join('')}</div>` : ''}</div></form>`;
  }

  // ================================================================ Temps de travail et absences (étape 7)
  const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const fmtH = (h) => `${String(Math.round(h * 100) / 100).replace('.', ',')} h`;
  const mondayOf = (s) => { let d = s; while (parse(d).getDay() !== 1) d = addDays(d, -1); return d; };
  const isForfait = (e) => e.category === 'Cadre';
  let TT_MAX = 2, FORFAIT_DAYS = 218, HS_QUOTA = 220;
  function weekStats(ts) {
    const total = ts.hours.reduce((s, h) => s + (Number(h) || 0), 0), hs = Math.max(0, total - 35), h25 = Math.min(hs, 8), h50 = Math.max(0, hs - 8), alerts = [];
    ts.hours.forEach((h, k) => { if (h > 10) alerts.push(`${DAYS_FR[k]} : ${fmtH(h)}, au-delà de 10 h par jour`); });
    if (total > 48) alerts.push(`${fmtH(total)} sur la semaine, au-delà de 48 h`);
    return { total, hs, h25, h50, alerts };
  }
  const tsOf = (e) => (db.timesheets || []).filter((t) => t.empId === e.id);
  function yearHS(e, y = TODAY.slice(0, 4)) { return tsOf(e).filter((t) => t.status === 'Validée' && t.week.slice(0, 4) === y).reduce((s, t) => s + weekStats(t).hs, 0); }
  function avg12(e) { const from = addDays(mondayOf(TODAY), -84), list = tsOf(e).filter((t) => t.week >= from && t.status !== 'Brouillon'); return list.length ? list.reduce((s, t) => s + weekStats(t).total, 0) / 12 : 0; }
  function overtimePay(e, m) {
    const hourly = e.salary / 12 / 151.67;
    return tsOf(e).filter((t) => t.status === 'Validée' && t.week.slice(0, 7) === m).reduce((o, t) => { const w = weekStats(t); o.h25 += w.h25; o.h50 += w.h50; o.amount += (w.h25 * 1.25 + w.h50 * 1.5) * hourly; return o; }, { h25: 0, h50: 0, amount: 0 });
  }
  function forfaitDays(e) {
    const from = e.startDate > TODAY.slice(0, 4) + '-01-01' ? e.startDate : TODAY.slice(0, 4) + '-01-01';
    const off = db.leaves.filter((l) => l.empId === e.id && l.status === 'Approuvée' && l.type !== 'Télétravail' && l.end >= from && l.start <= TODAY).reduce((s, l) => s + workDays(l.start < from ? from : l.start, l.end > TODAY ? TODAY : l.end), 0);
    const worked = Math.max(0, workDays(from, TODAY) - off), yearEnd = TODAY.slice(0, 4) + '-12-31';
    const remainingWork = workDays(addDays(TODAY, 1), yearEnd), plannedOff = db.leaves.filter((l) => l.empId === e.id && l.status !== 'Refusée' && l.type !== 'Télétravail' && l.start > TODAY && l.start <= yearEnd).reduce((s, l) => s + l.days, 0);
    return { worked, projected: worked + Math.max(0, remainingWork - plannedOff - e.cp - e.rtt) };
  }
  // Congés : solde N-1 (e.cp) à poser avant le 31 mai, et acquisition en cours depuis le 1er juin (2,08 jours ouvrés par mois).
  function cpAcquiring(e) {
    const y = TODAY.slice(5) >= '06-01' ? Number(TODAY.slice(0, 4)) : Number(TODAY.slice(0, 4)) - 1, from = `${y}-06-01` > e.startDate ? `${y}-06-01` : e.startDate;
    const months = Math.max(0, (parse(TODAY).getFullYear() - parse(from).getFullYear()) * 12 + parse(TODAY).getMonth() - parse(from).getMonth());
    return { acquiring: Math.round(months * 2.08 * 2) / 2, deadline: `${y + 1}-05-31`, period: `${y}-${y + 1}` };
  }
  function mainLeaveMissing(e) {
    const y = TODAY.slice(0, 4); if (e.startDate > `${y}-05-01` || !isEmployed(e)) return false;
    return !db.leaves.some((l) => l.empId === e.id && l.type === 'Congés payés' && l.status !== 'Refusée' && l.start >= `${y}-05-01` && l.start <= `${y}-10-31` && l.days >= 10);
  }
  const pendingSheets = () => (db.timesheets || []).filter((t) => t.status === 'Soumise' && (ui.profile === 'rh' ? true : approverOf(emp(t.empId)).id === me().id)).filter((t) => ui.profile === 'rh' || ui.profile === 'manager');
  function sheetRow(t, actions) {
    const e = emp(t.empId), w = weekStats(t);
    return `<div class="req"><div class="who-cell">${avatar(e)}<div><b>${esc(fullName(e))}</b><small>Semaine du ${fmtShort(t.week)} · ${t.hours.map((h, k) => `${DAYS_FR[k].slice(0, 3)} ${String(h).replace('.', ',')}`).join(' · ')}</small></div></div>
      <div class="what"><b class="num">${fmtH(w.total)}${w.hs ? ` · ${fmtH(w.hs)} sup.` : ''}</b><small>${w.hs ? `${fmtH(w.h25)} à 25 %${w.h50 ? ` · ${fmtH(w.h50)} à 50 %` : ''}` : 'Pas d’heures supplémentaires'}</small>${w.alerts.map((a) => `<small class="warn-t">${esc(a)}</small>`).join('')}</div>
      ${actions ? `<div class="acts"><button type="button" class="btn ok sm" data-act="ts-ok" data-id="${t.id}">${ic('check')}Valider</button><button type="button" class="btn bad sm" data-act="ts-ko" data-id="${t.id}">Refuser</button></div>` : `<span class="pill ${{ Validée: 'ok', Soumise: 'warn', Refusée: 'bad', Brouillon: 'neutral' }[t.status]}">${t.status}</span>`}</div>`;
  }
  function myTimeHTML(e) {
    const a = cpAcquiring(e), bal = (l, v, s) => `<div class="card bal"><span class="l">${l}</span><div class="v num">${v}</div>${s ? `<small class="hint">${s}</small>` : ''}</div>`;
    let html = `<div class="balances four">${bal('Congés à poser', `${e.cp} <small>j</small>`, `avant le ${fmtDate(a.deadline)}`)}${bal('En cours d’acquisition', `${String(a.acquiring).replace('.', ',')} <small>j</small>`, `période ${a.period} · 2,08 j par mois`)}${bal('RTT', `${e.rtt} <small>j</small>`, 'année ' + TODAY.slice(0, 4))}
      ${isForfait(e) ? (() => { const f = forfaitDays(e); return bal('Forfait jours', `${f.worked} <small>/ ${FORFAIT_DAYS}</small>`, `projection fin d’année : ${f.projected} j`); })() : bal('Heures sup. ' + TODAY.slice(0, 4), `${String(yearHS(e)).replace('.', ',')} <small>h</small>`, `contingent annuel : ${HS_QUOTA} h`)}</div>`;
    if (mainLeaveMissing(e)) html += '<p class="lint bad" style="margin:0">Vous n’avez pas encore pris votre congé principal : au moins 12 jours ouvrables continus entre le 1er mai et le 31 octobre.</p>';
    if (!isForfait(e)) {
      const wk = ui.tsWeek || mondayOf(TODAY), t = tsOf(e).find((x) => x.week === wk) || { hours: [0, 0, 0, 0, 0, 0], status: 'Brouillon' }, w = weekStats(t), locked = ['Soumise', 'Validée'].includes(t.status);
      const weeks = [0, 1, 2, 3].map((k) => addDays(mondayOf(TODAY), -7 * k));
      html += `<form class="card" data-form="ts" novalidate><div class="card-h"><h3>Mes heures</h3><div class="toolbar"><label class="sr" for="ts-week">Semaine</label><select id="ts-week" class="select" data-change="ts-week">${weeks.map((x) => `<option value="${x}" ${x === wk ? 'selected' : ''}>Semaine du ${fmtShort(x)}</option>`).join('')}</select><span class="pill ${{ Validée: 'ok', Soumise: 'warn', Refusée: 'bad', Brouillon: 'neutral' }[t.status]}">${t.status}</span></div></div>
        <div class="card-b"><div class="ts-grid">${DAYS_FR.map((d, k) => `<div class="field"><label for="ts-${k}">${d.slice(0, 3)}. ${parse(addDays(wk, k)).getDate()}</label><input id="ts-${k}" name="h${k}" type="number" inputmode="decimal" min="0" max="24" step="0.25" class="input num" value="${t.hours[k] || ''}" placeholder="0" ${locked ? 'disabled' : ''} data-live="ts"></div>`).join('')}</div>
        <div id="ts-sum" style="margin-top:12px">${tsSummary(w)}</div>
        ${locked ? '' : `<div class="toolbar" style="margin-top:12px"><span class="hint">Durée légale 35 h · max. 10 h par jour et 48 h par semaine · repos de 11 h entre deux journées.</span><button class="btn primary" style="margin-left:auto">Soumettre à ${esc(fullName(approverOf(e)))}</button></div>`}</div></form>`;
    }
    return html;
  }
  const tsSummary = (w) => `<b class="num">${fmtH(w.total)}</b>${w.hs ? ` · <span class="num">${fmtH(w.hs)}</span> supplémentaires (${fmtH(w.h25)} à 25 %${w.h50 ? `, ${fmtH(w.h50)} à 50 %` : ''})` : ''}${w.alerts.map((a) => `<p class="lint bad" style="margin:8px 0 0">${esc(a)}</p>`).join('')}`;
  function sickRows() {
    const list = db.leaves.filter((l) => IJ_TYPES.includes(l.type)).sort((a, b) => b.start.localeCompare(a.start));
    return card('Arrêts de travail', '', `<div class="card-b">${list.length ? list.map((l) => { const e = emp(l.empId), late = l.receivedAt && dayDiff(l.start, l.receivedAt) > 2, dsnDue = addDays(l.receivedAt || l.start, 5), seniorYear = dayDiff(e.startDate, l.start) >= 365;
      const ij = l.days > 3 ? `IJSS à partir du ${fmtShort(addDays(l.start, 3))} (3 jours de carence)` : 'Arrêt de 3 jours ou moins : pas d’IJSS (carence)';
      const mt = seniorYear ? (l.days > 7 ? `maintien de salaire employeur à partir du ${fmtShort(addDays(l.start, 7))}` : 'pas de maintien légal avant le 8e jour') : 'moins d’un an d’ancienneté : pas de maintien légal';
      return `<div class="todo">${avatar(e, 'sm')}<div class="t"><b>${esc(fullName(e))} · ${fmtShort(l.start)} → ${fmtShort(l.end)} (${plural(l.days, 'jour', 'jours')})</b><small>Avis d’arrêt reçu le ${fmtShort(l.receivedAt || l.start)}${late ? ' · <span class="warn-t">au-delà de 48 h</span>' : ''} · ${ij} · ${mt}</small>
        <small>Acquisition de congés pendant l’arrêt : 2 jours ouvrables par mois (loi du 22 avril 2024)</small></div>
        ${l.dsnAt ? `<span class="pill ok">Attestation DSN · ${fmtShort(l.dsnAt)}</span>` : `<button type="button" class="btn ${TODAY > dsnDue ? 'bad' : 'primary'} sm" data-act="sick-dsn" data-id="${l.id}">Attestation de salaire (avant le ${fmtShort(dsnDue)})</button>`}
        <label class="sub-tog"><input type="checkbox" data-change="sick-sub" data-id="${l.id}" ${l.subrogation ? 'checked' : ''}> Subrogation</label></div>`; }).join('') : '<p class="muted" style="margin:0">Aucun arrêt enregistré.</p>'}
      <p class="hint" style="margin:12px 0 0">Le salarié transmet son avis d’arrêt sous 48 h. L’employeur envoie l’attestation de salaire via la DSN pour le calcul des indemnités journalières. Avec la subrogation, l’employeur maintient le salaire et perçoit les IJSS.</p></div>`);
  }
  function countersTable() {
    const people = scopeEmployees().filter(isEmployed).sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
    return `<div class="card"><div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th class="r">CP à poser</th><th class="r">CP en cours</th><th class="r">RTT</th><th>Temps de travail</th><th>Alertes</th></tr></thead><tbody>
      ${people.map((e) => { const a = cpAcquiring(e), al = [];
        if (mainLeaveMissing(e)) al.push('Congé principal non pris'); if (e.cp > 20) al.push('Solde de congés élevé');
        let tw;
        if (isForfait(e)) { const f = forfaitDays(e); tw = `Forfait jours : ${f.worked} j · projection ${f.projected} / ${FORFAIT_DAYS}`; if (f.projected > FORFAIT_DAYS) al.push('Dépassement du forfait prévu'); }
        else { const hs = yearHS(e), av = avg12(e); tw = `${String(hs).replace('.', ',')} h sup. / ${HS_QUOTA} h${av ? ` · moyenne 12 sem. ${fmtH(av)}` : ''}`; if (hs > HS_QUOTA * 0.8) al.push('Contingent bientôt atteint'); if (av > 44) al.push('Moyenne au-delà de 44 h'); }
        return `<tr class="click" data-act="open-emp" data-id="${e.id}"><td><div class="who-cell">${avatar(e, 'sm')}<div><b>${esc(fullName(e))}</b><small>${esc(e.category || '')}</small></div></div></td><td class="r num">${e.cp} j</td><td class="r num">${String(a.acquiring).replace('.', ',')} j</td><td class="r num">${e.rtt} j</td><td>${tw}</td><td>${al.map((x) => `<span class="pill warn">${x}</span>`).join(' ') || '—'}</td></tr>`; }).join('')}</tbody></table></div></div>
      <p class="hint">Congés acquis : 2,08 jours ouvrés par mois du 1er juin au 31 mai. Les cadres sont au forfait de ${FORFAIT_DAYS} jours, avec un suivi de leur charge de travail ; les autres salariés déclarent leurs heures chaque semaine.</p>`;
  }

  // ================================================================ Rémunération (étape 8)
  const median = (arr) => { const a = arr.slice().sort((x, y) => x - y), n = a.length; return n ? (n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2) : 0; };
  const RAISE_REASONS = ['Performance', 'Évolution du poste', 'Marché', 'Rattrapage égalité', 'Ancienneté'];
  const raiseEligible = (e) => isEmployed(e) && e.stage < 13 && !e.exit;
  function payGap(list) {
    const cats = {}; list.filter(isEmployed).forEach((e) => { const c = cats[e.category] = cats[e.category] || { F: [], H: [] }; if (e.sex === 'F' || e.sex === 'H') c[e.sex].push(e.salary); });
    return Object.entries(cats).map(([cat, c]) => { const avg = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0), f = avg(c.F), h = avg(c.H);
      return { cat, nF: c.F.length, nH: c.H.length, f, h, gap: f && h ? (h - f) / h : null }; });
  }
  function gapTable(rows) {
    return `<div class="table-wrap"><table><thead><tr><th>Catégorie</th><th class="r">Femmes</th><th class="r">Salaire moyen F</th><th class="r">Hommes</th><th class="r">Salaire moyen H</th><th class="r">Écart</th></tr></thead><tbody>
      ${rows.map((r) => `<tr><td><b>${esc(r.cat)}</b></td><td class="r num">${r.nF}</td><td class="r num">${r.f ? eur0(r.f) : '—'}</td><td class="r num">${r.nH}</td><td class="r num">${r.h ? eur0(r.h) : '—'}</td>
        <td class="r">${r.gap === null ? '—' : `<span class="pill ${Math.abs(r.gap) > 0.05 ? 'bad' : 'ok'} num">${r.gap > 0 ? 'Femmes' : 'Hommes'} −${(Math.abs(r.h - r.f) / Math.max(r.h, r.f) * 100).toFixed(1).replace('.', ',')} %</span>`}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function raiseCampaign() {
    const R = db.raises, rh = ui.profile === 'rh', people = (rh ? db.employees : scopeEmployees()).filter(raiseEligible).sort((a, b) => a.dept.localeCompare(b.dept) || a.lastName.localeCompare(b.lastName, 'fr'));
    const all = db.employees.filter(raiseEligible), masse = all.reduce((s, e) => s + e.salary, 0), env = masse * R.budgetPct / 100;
    const used = Object.entries(R.proposals).filter(([, p]) => p.status !== 'Refusée').reduce((s, [id, p]) => s + (emp(id) ? emp(id).salary * p.pct / 100 : 0), 0);
    const medByCat = {}; all.forEach((e) => { (medByCat[e.category] = medByCat[e.category] || []).push(e.salary); });
    const open = R.status === 'Ouverte', canEdit = (e) => open && (rh || e.managerId === me().id) && (!R.proposals[e.id] || R.proposals[e.id].status !== 'Validée');
    const after = db.employees.map((e) => { const p = R.proposals[e.id]; return p && p.status !== 'Refusée' ? Object.assign({}, e, { salary: e.salary * (1 + p.pct / 100) }) : e; });
    return `<div class="card"><div class="card-h" style="flex-wrap:wrap"><div><h3>Révision salariale ${R.year}</h3><p class="hint" style="margin:2px 0 0">Effet au ${fmtDate(R.effective)} · propositions des managers avant le ${fmtDate(R.deadline)}</p></div><span class="pill ${open ? 'warn' : 'ok'}">${open ? 'Campagne ouverte' : 'Clôturée'}</span>
        ${rh && open ? `<button type="button" class="btn primary" data-act="raise-close">${ic('check')}Clôturer et notifier</button>` : ''}</div>
      <div class="card-b"><div class="rkpis"><div><span>Enveloppe</span><b class="num">${eur0(env)}</b><small>${String(R.budgetPct).replace('.', ',')} % de la masse salariale (${eur0(masse)})</small></div><div><span>Engagé</span><b class="num">${eur0(used)}</b><small>${env ? Math.round((used / env) * 100) : 0} % de l’enveloppe</small></div>
        <div><span>Reste</span><b class="num" style="${used > env ? 'color:var(--bad)' : ''}">${eur0(env - used)}</b><small>${used > env ? 'Enveloppe dépassée' : 'disponible'}</small></div><div><span>Propositions</span><b class="num">${Object.keys(R.proposals).length}</b><small>${Object.values(R.proposals).filter((p) => p.status === 'Validée').length} validées</small></div></div>
        <div class="gauge big"><i style="width:${Math.min(100, env ? (used / env) * 100 : 0)}%;${used > env ? 'background:var(--bad)' : ''}"></i></div></div>
      <div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th class="r">Salaire actuel</th><th class="r">Positionnement</th><th>Dernière évolution</th><th class="r">Augmentation</th><th>Motif</th><th class="r">Nouveau salaire</th><th>Statut</th></tr></thead><tbody>
      ${people.map((e) => { const p = R.proposals[e.id], med = median(medByCat[e.category] || []), last = db.history.filter((h) => h.empId === e.id && /Augmentation|Promotion|Mobilité/.test(h.label)).sort((a, b) => b.date.localeCompare(a.date))[0];
        const ed = canEdit(e);
        return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)} · ${esc(e.category)}</small></div></div></td><td class="r num">${eur0(e.salary)}${e.salaryNext ? `<small class="hint" style="display:block">${eur0(e.salaryNext.amount)} au ${fmtShort(e.salaryNext.from)}</small>` : ''}</td>
          <td class="r"><span class="num ${e.salary < med * 0.9 ? 'warn-t' : ''}" title="Par rapport au salaire médian de la catégorie (${eur0(med)})">${Math.round((e.salary / med) * 100)} %</span></td><td>${last ? `${esc(last.label)} · ${fmtShort(last.date)}` : `Embauche · ${fmtShort(e.startDate)}`}</td>
          <td class="r">${ed ? `<span class="pct-in"><label class="sr" for="rp-${e.id}">Augmentation de ${esc(fullName(e))} (%)</label><input id="rp-${e.id}" class="input cell-input num" type="number" min="0" max="20" step="0.5" value="${p ? p.pct : ''}" placeholder="0" data-change="raise-pct" data-id="${e.id}">%</span>` : p ? `<span class="num">${String(p.pct).replace('.', ',')} %</span>` : '—'}</td>
          <td>${ed && p ? `<select class="select" data-change="raise-reason" data-id="${e.id}" aria-label="Motif">${RAISE_REASONS.map((r) => `<option ${p && p.reason === r ? 'selected' : ''}>${r}</option>`).join('')}</select>` : p ? esc(p.reason) : '—'}</td>
          <td class="r num">${p ? eur0(Math.round(e.salary * (1 + p.pct / 100) / 100) * 100) : '—'}</td>
          <td>${p ? (rh && open && p.status === 'Proposée' ? `<div class="toolbar" style="flex-wrap:nowrap"><button type="button" class="btn ok sm" data-act="raise-ok" data-id="${e.id}">Valider</button><button type="button" class="btn bad sm" data-act="raise-ko" data-id="${e.id}">Refuser</button></div>` : `<span class="pill ${{ Proposée: 'warn', Validée: 'ok', Refusée: 'bad', Appliquée: 'ok' }[p.status]}">${p.status}</span>`) : '<span class="muted">—</span>'}</td></tr>`; }).join('')}</tbody></table></div></div>
      ${card('Effet sur l’égalité femmes-hommes', '<span class="muted" style="font-size:13px">après les propositions en cours</span>', `<div class="card-b">${gapTable(payGap(after))}</div>`)}`;
  }
  function equityView() {
    const rows = payGap(db.employees), n = db.employees.filter(isEmployed).length;
    const reqs = (db.payInfoReqs || []).slice().reverse();
    return `${card('Écarts de rémunération femmes-hommes', '', `<div class="card-b">${gapTable(rows)}
        <p class="hint" style="margin:12px 0 0">Un écart de plus de 5 % entre femmes et hommes d’une même catégorie, non justifié par des critères objectifs, devra être corrigé selon la directive européenne 2023/970 sur la transparence salariale. Sa transposition en France est en cours.</p></div>`)}
      <div class="two">${card('Obligations selon l’effectif', '', `<div class="card-b"><div class="todo"><div class="t"><b>Index de l’égalité professionnelle</b><small>${isOn(50, 'now') ? `Obligatoire : ${esc(COMPANY.nom)} compte ${fmtN(effState().avg12)} salariés en moyenne.` : `Obligatoire à partir de 50 salariés : ${esc(COMPANY.nom)} (${fmtN(effState().avg12)} en moyenne sur 12 mois) n’est pas encore concernée.`}</small></div>${ui.profile === 'rh' ? '<button type="button" class="btn ghost sm" data-act="obl-go" data-t="index">Voir l’index</button>' : `<span class="pill ${isOn(50, 'now') ? 'warn' : 'neutral'}">${isOn(50, 'now') ? 'Applicable' : 'Non applicable'}</span>`}</div>
          <div class="todo"><div class="t"><b>Fourchette de salaire dans les offres</b><small>Déjà validée dans le besoin de recrutement ; l’historique de salaire des candidats n’est pas demandé.</small></div><span class="pill ok">En place</span></div>
          <div class="todo"><div class="t"><b>Droit à l’information des salariés</b><small>Chaque salarié peut demander la rémunération moyenne, par sexe, des salariés de sa catégorie.</small></div><span class="pill ok">En place</span></div></div>`)}
        ${card('Demandes d’information', `<span class="muted num">${reqs.length}</span>`, `<div class="card-b">${reqs.length ? reqs.map((r) => `<div class="todo">${avatar(emp(r.empId), 'sm')}<div class="t"><b>${esc(fullName(emp(r.empId)))} · catégorie ${esc(r.cat)}</b><small>Demandée et transmise le ${fmtShort(r.date)}</small></div><span class="pill ok">Répondue</span></div>`).join('') : '<p class="muted" style="margin:0">Aucune demande pour le moment.</p>'}</div>`)}</div>`;
  }
  const BENEFITS = [['Mutuelle santé', 'Part employeur 60 % (minimum légal 50 %)', 576, true], ['Prévoyance', 'Obligatoire pour les cadres (1,50 % de la tranche A)', 0, true], ['Remboursement des transports en commun', '50 % de l’abonnement, obligatoire', 488, true],
    ['Titres-restaurant', '9 € par jour travaillé, dont 5,40 € à la charge de l’employeur', 1150, false], ['Forfait mobilités durables', 'Vélo, covoiturage : jusqu’à 300 € par an', 300, false]];
  function shareView() {
    const V = db.valueShare, ok = V.years.every(([, ca, b]) => b / ca >= 0.01), people = db.employees.filter((e) => isEmployed(e) && !e.exit);
    const months = payMonths().filter((m) => !(db.payroll[m] && db.payroll[m].closed)), dist = ppvSplit(V.total, V.rule, people);
    return `<div class="two">${card('Partage de la valeur', `<span class="pill ${ok ? 'warn' : 'neutral'}">${ok ? 'Obligatoire' : 'Facultatif'}</span>`, `<div class="card-b"><p class="hint" style="margin:0 0 10px">Entreprises de 11 à 49 salariés : un dispositif est obligatoire depuis 2025 si le bénéfice net atteint au moins 1 % du chiffre d’affaires 3 années de suite (loi du 29 novembre 2023).</p>
        <div class="table-wrap"><table><thead><tr><th>Exercice</th><th class="r">Chiffre d’affaires</th><th class="r">Bénéfice net</th><th class="r">Ratio</th></tr></thead><tbody>${V.years.map(([y, ca, b]) => `<tr><td>${y}</td><td class="r num">${eur0(ca)}</td><td class="r num">${eur0(b)}</td><td class="r"><span class="pill ${b / ca >= 0.01 ? 'ok' : 'neutral'} num">${(b / ca * 100).toFixed(1).replace('.', ',')} %</span></td></tr>`).join('')}</tbody></table></div></div>`)}
      ${card('Avantages sociaux', '', `<div class="card-b">${BENEFITS.map(([l, d, , legal]) => `<div class="todo"><div class="t"><b>${l}</b><small>${d}</small></div><span class="pill ${legal ? 'accent' : 'neutral'}">${legal ? 'Obligatoire' : 'Choix de l’entreprise'}</span></div>`).join('')}</div>`)}</div>
      ${card('Prime de partage de la valeur', V.paidMonth ? `<span class="pill ok">Versée avec la paie de ${monthLabel(V.paidMonth).toLowerCase()}</span>` : '', `<div class="card-b"><div class="form-grid three">
        <div class="field"><label for="pv-total">Montant total (€)</label><input id="pv-total" class="input num" type="number" min="0" step="500" value="${V.total}" data-change="ppv-total" ${V.paidMonth ? 'disabled' : ''}></div>
        <div class="field"><label for="pv-rule">Répartition</label><select id="pv-rule" class="select" data-change="ppv-rule" ${V.paidMonth ? 'disabled' : ''}>${[['uniforme', 'Montant identique'], ['salaire', 'Proportionnelle au salaire'], ['presence', 'Selon la durée de présence']].map(([k, l]) => `<option value="${k}" ${V.rule === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="field"><label for="pv-month">Versement avec la paie de</label><select id="pv-month" class="select" ${V.paidMonth ? 'disabled' : ''}>${months.map((m) => `<option value="${m}">${monthLabel(m)}</option>`).join('')}</select></div></div>
        <div class="table-wrap" style="margin-top:12px"><table><thead><tr><th>Collaborateur</th><th class="r">Salaire</th><th class="r">Présence 12 mois</th><th class="r">Prime</th></tr></thead><tbody>${dist.map(([e, v, pres]) => `<tr><td>${esc(fullName(e))}</td><td class="r num">${eur0(e.salary)}</td><td class="r num">${pres} mois</td><td class="r num"><b>${eur0(v)}</b></td></tr>`).join('')}</tbody></table></div>
        <div class="toolbar" style="margin-top:12px"><span class="hint">Exonérée de cotisations sociales dans les entreprises de moins de 50 salariés (CSG-CRDS dues), dans la limite de 3 000 € par salarié.</span>${V.paidMonth ? '' : `<button type="button" class="btn primary" style="margin-left:auto" data-act="ppv-pay">Intégrer à la paie</button>`}</div></div>`)}`;
  }
  function ppvSplit(total, rule, people) {
    const pres = (e) => Math.min(12, Math.max(0, Math.round(dayDiff(e.startDate > addMonths(TODAY, -12) ? e.startDate : addMonths(TODAY, -12), TODAY) / 30.4)));
    const w = people.map((e) => [e, rule === 'uniforme' ? 1 : rule === 'salaire' ? e.salary : pres(e)]), sum = w.reduce((s, [, x]) => s + x, 0) || 1;
    return w.map(([e, x]) => [e, Math.min(3000, Math.round((total * x) / sum)), pres(e)]);
  }
  function viewRemu() {
    if (ui.profile === 'manager') return `${mgrPayCard()}<p class="hint" style="margin:0">Proposez les augmentations de votre équipe dans l’enveloppe fixée par les RH. Les RH valident avant la date d’effet.</p>${raiseCampaign()}`;
    const R = db.raises, pend = Object.values(R.proposals).filter((p) => p.status === 'Proposée').length;
    const tabs = [['paie', 'Paie du mois'], ['revision', 'Révision salariale', pend], ['egalite', 'Égalité salariale'], ['avantages', 'Avantages et partage de la valeur']];
    if (!tabs.some((t) => t[0] === ui.payTab)) ui.payTab = 'paie';
    const body = ui.payTab === 'paie' ? viewPay() : ui.payTab === 'revision' ? raiseCampaign() : ui.payTab === 'egalite' ? equityView() : shareView();
    return `<div class="tabs" role="tablist">${tabs.map(([k, l, n]) => `<button type="button" role="tab" aria-selected="${ui.payTab === k}" data-act="tab" data-k="payTab" data-t="${k}">${l}${n ? `<span class="count num">${n}</span>` : ''}</button>`).join('')}</div>${body}`;
  }
  function viewMyPay() {
    const e = me(), closed = payMonths().filter((m) => db.payroll[m] && db.payroll[m].closed && inPayroll(e, m)).slice(-12);
    const t = closed.reduce((o, m) => { const p = calcPay(e, m); o.base += p.base; o.bonus += p.bonus; o.ot += p.ot.amount; o.ppv += p.ppv; return o; }, { base: 0, bonus: 0, ot: 0, ppv: 0 });
    const ratio = closed.length / 12, ben = BENEFITS.filter(([l]) => l !== 'Prévoyance' || e.category === 'Cadre').map(([l, , v]) => [l, v * ratio]);
    const total = t.base + t.bonus + t.ot + t.ppv + ben.reduce((s, [, v]) => s + v, 0);
    const req = (db.payInfoReqs || []).filter((r) => r.empId === e.id).slice(-1)[0], row = req && payGap(db.employees).find((r) => r.cat === e.category);
    if (mobSal()) return `${viewPayslips()}${desktopHint('Le détail de ta rémunération, la transparence salariale et le choix du bulletin papier sont')}`;
    return `${viewPayslips()}
      <div class="two">${card('Ma rémunération globale', `<span class="muted" style="font-size:13px">${plural(closed.length, 'mois', 'mois')} de paie</span>`, `<div class="card-b"><div class="crit">
        ${[['Salaire de base brut', t.base], ['Primes', t.bonus], ['Heures supplémentaires', t.ot], ['Prime de partage de la valeur', t.ppv]].filter(([, v]) => v).map(([l, v]) => `<div class="crit-row"><span>${l}</span><b class="num">${eur0(v)}</b></div>`).join('')}
        ${ben.filter(([, v]) => v).map(([l, v]) => `<div class="crit-row"><span>${l} <small class="muted">(part employeur)</small></span><span class="num">${eur0(v)}</span></div>`).join('')}
        <div class="crit-row total"><span>Total</span><b class="num">${eur0(total)}</b></div></div><p class="hint" style="margin:10px 0 0">Avantages estimés sur la période, à titre indicatif.</p></div>`)}
      ${card('Transparence salariale', '', `<div class="card-b"><p style="margin:0 0 10px">Vous pouvez demander la rémunération moyenne des femmes et des hommes de votre catégorie (${esc(e.category)}).</p>
        ${row ? `<div class="crit"><div class="crit-row"><span>Femmes (${row.nF})</span><b class="num">${row.f ? eur0(row.f) : '—'}</b></div><div class="crit-row"><span>Hommes (${row.nH})</span><b class="num">${row.h ? eur0(row.h) : '—'}</b></div></div><p class="hint" style="margin:8px 0 0">Réponse du ${fmtDate(req.date)}.</p>`
          : '<button type="button" class="btn primary" data-act="pay-info">Faire la demande</button>'}</div>`)}</div>`;
  }

  Object.assign(MOD_ACT, {
    'chg-ok'(d) {
      const r = db.changeReqs.find((x) => x.id === d.id), e = emp(r.empId);
      if (r.field === 'iban') e.iban = `FR76 •••• •••• •••• ${r.to.replace(/\s/g, '').slice(-4)}`; else if (r.field === 'lastName') e.lastName = r.to; else e[r.field] = r.to;
      Object.assign(r, { status: 'Validée', decidedAt: TODAY }); tickJourney(e.id, 5, 1); tickJourney(e.id, 5, 3);
      notify(e.id, `Votre demande (${r.label.toLowerCase()}) est validée : votre dossier est à jour.`); toast('Modification appliquée au dossier'); commit();
    },
    'chg-ko'(d) { ui.modal = { type: 'chg-ko', id: d.id }; render(); },
    'ts-ok'(d) { const t = db.timesheets.find((x) => x.id === d.id); Object.assign(t, { status: 'Validée', validatedAt: TODAY, by: me().id }); tickJourney(t.empId, 6, 0); notify(t.empId, `Vos heures de la semaine du ${fmtShort(t.week)} sont validées.`); toast('Heures validées · transmises à la paie'); commit(); },
    'ts-ko'(d) { const t = db.timesheets.find((x) => x.id === d.id); t.status = 'Refusée'; notify(t.empId, `Vos heures de la semaine du ${fmtShort(t.week)} sont à corriger.`); toast('Feuille de temps renvoyée au salarié'); commit(); },
    'sick-dsn'(d) { const l = db.leaves.find((x) => x.id === d.id); l.dsnAt = TODAY; tickJourney(l.empId, 6, 2); toast('Attestation de salaire transmise via la DSN'); commit(); },
    'raise-ok'(d) { db.raises.proposals[d.id].status = 'Validée'; toast('Augmentation validée'); commit(); },
    'raise-ko'(d) { db.raises.proposals[d.id].status = 'Refusée'; notify(db.raises.proposals[d.id].by, `Augmentation proposée pour ${fullName(emp(d.id))} refusée par les RH.`); toast('Proposition refusée'); commit(); },
    'raise-close'() {
      const R = db.raises; let n = 0;
      Object.entries(R.proposals).forEach(([id, p]) => { const e = emp(id); if (!e) return;
        if (p.status === 'Validée') { const old = e.salary, amount = Math.round(old * (1 + p.pct / 100) / 100) * 100; e.salaryNext = { amount, from: R.effective }; db.history.push({ id: uid('h'), empId: id, date: R.effective, label: 'Augmentation', detail: `Salaire ${eur0(old)} → ${eur0(amount)} (+${String(p.pct).replace('.', ',')} %, ${p.reason.toLowerCase()})` });
          p.status = 'Appliquée'; n += 1; tickJourney(id, 7, 0); notify(id, `Votre salaire passera à ${eur0(amount)} bruts annuels au ${fmtDate(R.effective)}.`); }
        else if (p.status === 'Proposée') p.status = 'Refusée'; });
      R.status = 'Clôturée'; toast(`Campagne clôturée · ${plural(n, 'augmentation appliquée', 'augmentations appliquées')}`); commit();
    },
    'ppv-pay'() {
      const V = db.valueShare, m = document.getElementById('pv-month').value, pr = payrollOf(m), people = db.employees.filter((e) => isEmployed(e) && !e.exit);
      pr.ppv = {}; ppvSplit(V.total, V.rule, people).forEach(([e, v]) => { pr.ppv[e.id] = v; tickJourney(e.id, 7, 3); });
      V.paidMonth = m; toast(`Prime de partage de la valeur intégrée à la paie de ${monthLabel(m).toLowerCase()}`); commit();
    },
    'pay-info'() { db.payInfoReqs = db.payInfoReqs || []; db.payInfoReqs.push({ id: uid('pi'), empId: me().id, cat: me().category, date: TODAY }); notify('e1', `${fullName(me())} a demandé les rémunérations moyennes de sa catégorie.`); toast('Information transmise'); commit(); },
  });
  Object.assign(MOD_CHG, {
    'ts-week'(v) { ui.tsWeek = v; render(); },
    'sick-sub'(v, d, el) { const l = db.leaves.find((x) => x.id === d.id); l.subrogation = el.checked; save(); toast(el.checked ? 'Subrogation activée' : 'Subrogation désactivée'); },
    'raise-pct'(v, d) { const R = db.raises, pct = Math.max(0, Math.min(20, Number(v) || 0)); if (!pct) delete R.proposals[d.id]; else R.proposals[d.id] = Object.assign(R.proposals[d.id] || { reason: 'Performance' }, { pct, by: me().id, status: ui.profile === 'rh' ? 'Validée' : 'Proposée', date: TODAY }); commit(); },
    'raise-reason'(v, d) { const p = db.raises.proposals[d.id]; if (p) { p.reason = v; save(); } else toast('Indiquez d’abord un pourcentage.', 'info'); },
    'ppv-total'(v) { db.valueShare.total = Math.max(0, Number(v) || 0); commit(); },
    'ppv-rule'(v) { db.valueShare.rule = v; commit(); },
  });
  Object.assign(MOD_LIVE, {
    ts(form) { const fd = new FormData(form), w = weekStats({ hours: [0, 1, 2, 3, 4, 5].map((k) => Number(fd.get('h' + k)) || 0) }); document.getElementById('ts-sum').innerHTML = tsSummary(w); },
  });
  Object.assign(MOD_FORMS, {
    ts(v) {
      const e = me(), wk = ui.tsWeek || mondayOf(TODAY), hours = [0, 1, 2, 3, 4, 5].map((k) => Number(v['h' + k]) || 0);
      if (!hours.some(Boolean)) { toast('Saisissez vos heures de la semaine.', 'info'); return; }
      let t = db.timesheets.find((x) => x.empId === e.id && x.week === wk);
      if (!t) { t = { id: uid('t'), empId: e.id, week: wk }; db.timesheets.push(t); }
      Object.assign(t, { hours, status: 'Soumise', submittedAt: TODAY }); tickJourney(e.id, 6, 0);
      const w = weekStats(t), ap = approverOf(e); notify(ap.id, `${fullName(e)} a déclaré ${fmtH(w.total)} pour la semaine du ${fmtShort(wk)}${w.alerts.length ? ' (alerte de durée maximale)' : ''}.`);
      toast(`Heures envoyées à ${fullName(ap)}`); commit();
    },
    'chg-req'(v, form) {
      const e = me(), to = (v.to || '').trim(), [label] = CHANGE_FIELDS[v.field], file = form.querySelector('#cr-proof').files[0];
      if (!to) { document.getElementById('cr-err').textContent = 'Indiquez la nouvelle valeur.'; return; }
      if (!file) { document.getElementById('cr-err').textContent = 'Joignez un justificatif.'; return; }
      db.changeReqs = db.changeReqs || [];
      db.changeReqs.push({ id: uid('cr'), empId: e.id, field: v.field, label, from: v.field === 'iban' ? e.iban : e[v.field] || '', to: v.field === 'iban' ? `•••• ${to.replace(/\s/g, '').slice(-4)}` : to, proof: file.name, status: 'En attente', createdAt: TODAY });
      notify('e1', `${fullName(e)} demande une modification : ${label.toLowerCase()}.`); toast('Demande envoyée aux RH'); commit();
    },
    'chg-ko'(v) { const r = db.changeReqs.find((x) => x.id === ui.modal.id); if (!v.reason.trim()) return formError('Indiquez le motif du refus.'); Object.assign(r, { status: 'Refusée', reason: v.reason.trim(), decidedAt: TODAY }); notify(r.empId, `Votre demande (${r.label.toLowerCase()}) est refusée : ${v.reason.trim()}`); ui.modal = null; toast('Demande refusée'); commit(); },
  });
  MODALS['chg-ko'] = (m, shell, formShell, opt, f) => formShell('Refuser la demande', 'chg-ko', f('ck-r', 'Motif communiqué au salarié', '<input id="ck-r" name="reason" class="input" maxlength="160" placeholder="Ex. justificatif illisible ou de plus de 3 mois">', true), 'Refuser');

  // ================================================================ Performance (étape 9) : parcours professionnel et forfait jours
  const ageAt = (e, d = TODAY) => (e.birthDate ? Math.floor(dayDiff(e.birthDate, d) / 365.25) : null);
  function careerMeeting(e) { const a = ageAt(e); if (a === null) return null; if (a >= 44 && a <= 46) return 'Entretien de mi-carrière (45 ans)'; if (a >= 58 && a < 60) return 'Entretien de fin de carrière (avant 60 ans)'; return null; }

  // ================================================================ Formation (étape 10) : financement et évaluation à froid
  const FUNDS = ['Plan de l’entreprise', 'OPCO', 'CPF du salarié'];
  const COLD = { 1: 'Pas mise en pratique', 2: 'Partiellement appliquée', 3: 'Appliquée au quotidien', 4: 'Maîtrisée et transmise' };
  const coldDue = (x) => x.status === 'Terminée' && !x.cold && x.session <= addDays(TODAY, -90);
  function trainingImpact() {
    const ids = ui.profile === 'rh' ? null : scopeSet(), mine = db.enrollments.filter((x) => !ids || ids.has(x.empId));
    const due = mine.filter(coldDue), done = mine.filter((x) => x.cold), hot = mine.filter((x) => x.rating);
    const avg = (a, k) => (a.length ? (a.reduce((s, x) => s + x[k], 0) / a.length).toFixed(1).replace('.', ',') : '—');
    const byFund = FUNDS.map((f) => [f, mine.filter((x) => (x.fund || FUNDS[0]) === f && ['Validée', 'Terminée'].includes(x.status)).reduce((s, x) => s + training(x.trainingId).cost, 0)]);
    return `<div class="kpis">${[['Satisfaction à chaud', `${avg(hot, 'rating')} / 5`, plural(hot.length, 'avis', 'avis')], ['Mise en pratique à 3 mois', `${avg(done, 'cold')} / 4`, plural(done.length, 'évaluation', 'évaluations')], ['Évaluations à froid à faire', due.length, 'Formations terminées depuis plus de 3 mois']].map(([l, v, s2]) => `<div class="card kpi"><span class="l">${l}</span><span class="v num">${v}</span><span class="s">${s2}</span></div>`).join('')}</div>
      ${card('Évaluer la mise en pratique (à froid)', '', `<div class="req-list">${due.length ? due.map((x) => enrRow(x, `<label class="sr" for="cold-${x.id}">Mise en pratique</label><select id="cold-${x.id}" class="select" data-change="train-cold" data-id="${x.id}"><option value="">Mise en pratique…</option>${Object.entries(COLD).map(([k, l]) => `<option value="${k}">${k} · ${l}</option>`).join('')}</select>`)).join('') : '<div class="empty">Aucune évaluation à froid en attente.</div>'}</div>`)}
      ${ui.profile === 'rh' ? card('Financement du plan', '', `<div class="card-b">${byFund.map(([f, v]) => `<div class="crit-row"><span>${f}</span><b class="num">${eur0(v)}</b></div>`).join('')}
        <p class="hint" style="margin:10px 0 0">Entreprise de moins de 50 salariés : le plan de développement des compétences peut être financé par l’OPCO ${CONV().kind === 'syntec' ? '(Atlas pour la convention Syntec)' : 'de la branche'}. La formation d’adaptation au poste reste à la charge de l’employeur.</p></div>
        <div class="req-list">${db.enrollments.filter((x) => ['Validée', 'Terminée', 'Validée manager'].includes(x.status)).map((x) => enrRow(x, `<label class="sr" for="fund-${x.id}">Financement</label><select id="fund-${x.id}" class="select" data-change="train-fund" data-id="${x.id}">${FUNDS.map((f) => `<option ${f === (x.fund || FUNDS[0]) ? 'selected' : ''}>${f}</option>`).join('')}</select>`)).join('')}</div>`) : ''}`;
  }

  // ================================================================ Mobilité (étape 11) : revue des talents et succession
  const BOX = { '3-3': 'Talents clés', '3-2': 'Fort potentiel', '3-1': 'Potentiel à révéler', '2-3': 'Performeurs solides', '2-2': 'Contributeurs clés', '2-1': 'À faire progresser', '1-3': 'Experts confirmés', '1-2': 'Contributeurs fiables', '1-1': 'À accompagner' };
  const RISKS = ['Faible', 'Moyen', 'Élevé'], READY = ['Prêt maintenant', 'D’ici 1 à 2 ans', 'D’ici 3 ans ou plus'];
  function talentOf(e) {
    const t = (db.talent = db.talent || {})[e.id] || {}, r = db.reviews.filter((x) => x.empId === e.id && x.kind === 'Entretien annuel' && (x.mgr || x.self)).sort((a, b) => b.year - a.year)[0];
    const rating = r ? (r.mgr || r.self).rating : 3;
    return { perf: t.perf || (rating >= 4 ? 3 : rating >= 3 ? 2 : 1), pot: t.pot || 2, risk: t.risk || 'Faible', fromReview: !!r && !t.perf };
  }
  function talentReview() {
    const people = (ui.profile === 'rh' ? employed() : scopeEmployees().filter(isEmployed)).filter((e) => e.stage >= 4 && !e.exit);
    const cell = (pot, perf) => { const list = people.filter((e) => { const t = talentOf(e); return t.pot === pot && t.perf === perf; });
      return `<div class="box b${pot}${perf}"><b>${BOX[`${pot}-${perf}`]}</b>${list.map((e) => `<button type="button" class="box-p" data-act="open-emp" data-id="${e.id}" title="${esc(e.title)}">${avatar(e, 'sm')}<span>${esc(e.firstName)}</span></button>`).join('')}</div>`; };
    const sel = (e, k, list, v) => `<select class="select" data-change="talent" data-id="${e.id}" data-k="${k}" aria-label="${k}">${list.map(([x, l]) => `<option value="${x}" ${String(x) === String(v) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
    return `<div class="ninebox-wrap"><div class="ninebox-axis">Potentiel →</div><div class="ninebox">${[3, 2, 1].map((pot) => [1, 2, 3].map((perf) => cell(pot, perf)).join('')).join('')}</div><div class="ninebox-x">Performance (entretien annuel) →</div></div>
      ${card('Positionnement', '<span class="muted" style="font-size:13px">confidentiel · RH et managers</span>', `<div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Performance</th><th>Potentiel</th><th>Risque de départ</th></tr></thead><tbody>
        ${people.map((e) => { const t = talentOf(e); return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)}</small></div></div></td><td>${sel(e, 'perf', [[1, 'En dessous des attentes'], [2, 'Conforme'], [3, 'Au-delà des attentes']], t.perf)}${t.fromReview ? '<small class="hint" style="display:block">d’après l’entretien annuel</small>' : ''}</td>
          <td>${sel(e, 'pot', [[1, 'Limité'], [2, 'Évolutif'], [3, 'Élevé']], t.pot)}</td><td>${sel(e, 'risk', RISKS.map((r) => [r, r]), t.risk)}</td></tr>`; }).join('')}</tbody></table></div>`)}`;
  }
  function successionView() {
    const keys = db.employees.filter((e) => isEmployed(e) && !e.exit && db.employees.some((x) => x.managerId === e.id && x.stage < 15));
    return `<p class="hint" style="margin:0">Postes clés : la direction et les managers. Pour chacun, un successeur identifié et sa maturité, croisés avec le risque de départ du titulaire.</p>
      ${card('Plan de succession', `<span class="muted num">${keys.filter((e) => !(db.succession[e.id] || {}).succ).length} sans successeur</span>`, `<div class="table-wrap"><table><thead><tr><th>Poste clé</th><th>Titulaire</th><th>Risque de départ</th><th>Successeur</th><th>Maturité</th></tr></thead><tbody>
        ${keys.map((e) => { const s = (db.succession = db.succession || {})[e.id] || {}, cands = employed().filter((x) => x.id !== e.id && !x.exit), risk = talentOf(e).risk;
          return `<tr><td><b>${esc(e.title)}</b><small class="hint" style="display:block">${esc(e.dept)}</small></td><td><div class="who-cell">${avatar(e, 'sm')}<b>${esc(fullName(e))}</b></div></td><td><span class="pill ${risk === 'Élevé' ? 'bad' : risk === 'Moyen' ? 'warn' : 'ok'}">${risk}</span></td>
            <td><select class="select" data-change="succ" data-id="${e.id}" data-k="succ" aria-label="Successeur"><option value="">Aucun identifié</option>${cands.map((x) => `<option value="${x.id}" ${x.id === s.succ ? 'selected' : ''}>${esc(fullName(x))}</option>`).join('')}</select></td>
            <td><select class="select" data-change="succ" data-id="${e.id}" data-k="ready" aria-label="Maturité" ${s.succ ? '' : 'disabled'}><option value="">—</option>${READY.map((r) => `<option ${r === s.ready ? 'selected' : ''}>${r}</option>`).join('')}</select></td></tr>`; }).join('')}</tbody></table></div>`)}`;
  }

  // ================================================================ Santé (étape 12) : retours d'absence et DUERP
  const calDays = (a, b) => dayDiff(a, b) + 1;
  function longAbsences() {
    const out = [];
    // Visite de reprise obligatoire : maladie de 60 jours ou plus, accident du travail de 30 jours ou plus, après tout congé de maternité (art. R4624-31).
    db.leaves.filter((l) => l.status === 'Approuvée' && ((l.type === 'Maladie' && calDays(l.start, l.end) >= 30) || (l.type === 'Accident du travail' && calDays(l.start, l.end) >= 30) || l.type === 'Maternité'))
      .forEach((l) => out.push({ e: emp(l.empId), kind: l.type, start: l.start, end: l.end, days: calDays(l.start, l.end), need: l.type !== 'Maladie' || calDays(l.start, l.end) >= 60, src: l }));
    db.incidents.filter((x) => x.kind === 'Accident du travail' && x.stopDays >= 30).forEach((x) => out.push({ e: emp(x.empId), kind: 'Accident du travail', start: x.date, end: addDays(x.date, x.stopDays - 1), days: x.stopDays, need: true, src: x }));
    return out.sort((a, b) => b.end.localeCompare(a.end));
  }
  function returnsView() {
    const list = longAbsences();
    return `<p class="hint" style="margin:0">Au-delà de 30 jours d’absence, un rendez-vous de liaison peut être proposé au salarié. La visite de reprise est obligatoire après 60 jours d’arrêt pour maladie ou 30 jours pour accident du travail, dans les 8 jours qui suivent la reprise.</p>
      ${card('Retours après une longue absence', '', `<div class="card-b">${list.length ? list.map((a) => { const ret = addDays(a.end, 1), due = addDays(ret, 8), v = db.visits.find((x) => x.empId === a.e.id && x.kind === 'Visite de reprise' && x.date >= a.start);
        return `<div class="todo">${avatar(a.e, 'sm')}<div class="t"><b>${esc(fullName(a.e))} · ${a.kind}, ${a.days} jours</b><small>Du ${fmtShort(a.start)} au ${fmtShort(a.end)} · reprise le ${fmtDate(ret)}</small>
          <small>${a.src.liaison ? `Rendez-vous de liaison proposé le ${fmtShort(a.src.liaison)}` : 'Rendez-vous de liaison : non proposé'}</small></div>
          ${a.src.liaison || ret <= TODAY ? '' : `<button type="button" class="btn ghost sm" data-act="liaison" data-k="${a.src.empId && a.src.start ? 'leave' : 'incident'}" data-id="${a.src.id}">Proposer le rendez-vous</button>`}
          ${a.need ? (v ? `<span class="pill ${v.status === 'Réalisée' ? 'ok' : 'info'}">Visite de reprise · ${fmtShort(v.date)}</span>` : `<button type="button" class="btn ${TODAY > due ? 'bad' : 'primary'} sm" data-act="reprise" data-id="${a.e.id}" data-d="${ret}">Visite de reprise (avant le ${fmtShort(due)})</button>`) : '<span class="pill neutral">Visite de reprise non obligatoire</span>'}</div>`; }).join('') : '<p class="muted" style="margin:0">Aucune absence de plus de 30 jours.</p>'}</div>`)}`;
  }
  function duerpCard() {
    const v = (db.duerp || []).slice().sort((a, b) => b.date.localeCompare(a.date)), last = v[0], next = last ? addYears(last.date, 1) : TODAY;
    return card('Mises à jour du document unique', `<span class="pill ${next < TODAY ? 'bad' : 'ok'}">${next < TODAY ? `Mise à jour en retard depuis le ${fmtShort(next)}` : `Prochaine avant le ${fmtShort(next)}`}</span>`, `<div class="card-b">
      <p class="hint" style="margin:0 0 10px">À partir de 11 salariés, le DUERP est mis à jour au moins une fois par an, et à chaque changement important. Chaque version est conservée 40 ans et tenue à disposition des salariés.</p>
      ${v.map((x) => `<div class="todo"><div class="t"><b>Version du ${fmtDate(x.date)}</b><small>${esc(x.note)} · ${esc(fullName(emp(x.by)))} · ${plural(x.count || db.risks.length, 'risque', 'risques')}</small></div><span class="pill neutral">Conservée jusqu’en ${Number(x.date.slice(0, 4)) + 40}</span></div>`).join('')}
      ${ui.profile === 'rh' ? `<div class="toolbar" style="margin-top:10px"><button type="button" class="btn primary sm" data-act="duerp-version">${ic('check')}Enregistrer la mise à jour annuelle</button></div>` : ''}</div>`);
  }

  // ================================================================ Départ (étapes 14 à 16)
  const RETURN_ITEMS = [['ordinateur', 'Ordinateur et chargeur'], ['badge', 'Badge d’accès'], ['telephone', 'Téléphone professionnel']];
  const TRANSFER = [['dossiers', 'Dossiers en cours transmis au successeur'], ['acces', 'Accès partagés et mots de passe transférés'], ['doc', 'Documentation des processus à jour']];
  const EXIT_REASONS = ['Évolution de carrière', 'Rémunération', 'Management', 'Charge de travail', 'Projet personnel', 'Mobilité géographique', 'Autre'];
  function offb(e) { db.offboarding = db.offboarding || {}; const d = db.offboarding[e.id] = db.offboarding[e.id] || {}; return Object.assign(d, { transfer: d.transfer || {}, returned: d.returned || {}, requests: d.requests || [], rc: d.rc || {} }); }
  // V2 : motifs de rupture complets, regroupés par initiative.
  const EXIT_GROUPS = [['À l’initiative du salarié', ['Démission', 'Départ volontaire à la retraite', 'Prise d’acte de la rupture', 'Présomption de démission (abandon de poste)']],
    ['D’un commun accord', ['Rupture conventionnelle']],
    ['À l’initiative de l’employeur', ['Licenciement pour motif personnel', 'Licenciement pour faute grave ou lourde', 'Licenciement économique', 'Mise à la retraite']],
    ['Fin de contrat', ['Fin de CDD', 'Fin du contrat d’apprentissage', 'Fin de stage']], ['Autre', ['Décès du salarié']]];
  const exitDefault = (e) => (e.contract === 'CDD' ? 'Fin de CDD' : e.contract === 'Alternance' ? 'Fin du contrat d’apprentissage' : e.contract === 'Stage' ? 'Fin de stage' : 'Démission');
  function exitHint(e, reason) {
    const f = Object.assign({}, e, { exit: { reason, lastDay: (e.exit && e.exit.lastDay) || addDays(TODAY, 30) } }), n = noticeInfo(f), ind = exitIndemnities(f);
    const extra = { 'Prise d’acte de la rupture': 'Rupture immédiate ; le juge dira si elle produit les effets d’un licenciement ou d’une démission.', 'Présomption de démission (abandon de poste)': 'Mise en demeure de reprendre le travail sous 15 jours minimum avant de constater la démission (art. L1237-1-1).',
      'Licenciement économique': 'Entretien préalable, proposition du contrat de sécurisation professionnelle, priorité de réembauche pendant 1 an.', 'Licenciement pour faute grave ou lourde': 'Ni préavis ni indemnité de licenciement ; procédure disciplinaire dans les 2 mois suivant les faits.',
      'Décès du salarié': 'Le contrat prend fin à la date du décès ; les sommes dues sont versées aux ayants droit.', 'Fin de stage': 'Pas de documents de fin de contrat de travail : attestation de stage à remettre.' }[reason] || '';
    return `Préavis : ${n.label}.${ind.legal ? ` Indemnité de rupture estimée : ${eur0(ind.legal)}.` : ''}${ind.precarite ? ` Indemnité de fin de contrat : ${eur0(ind.precarite)}.` : ''} ${extra}${reason === 'Licenciement économique' ? pseHint(e) : ''}`;
  }
  function noticeInfo(e) {
    const r = (e.exit && e.exit.reason) || '', yrs = dayDiff(e.startDate, TODAY) / 365.25, cadre = e.category === 'Cadre', base = cadre ? 3 : yrs >= 2 ? 2 : 1;
    if (/faute grave/.test(r)) return { months: 0, label: 'aucun (faute grave ou lourde)' };
    if (/Prise d’acte|Décès/.test(r)) return { months: 0, label: 'aucun, la rupture est immédiate' };
    if (/apprentissage|stage/.test(r)) return { months: 0, label: 'aucun, fin au terme prévu' };
    if (/Présomption/.test(r)) return { months: base, label: `${base} mois, comme une démission (souvent non exécuté)` };
    if (/Mise à la retraite/.test(r)) { const m = CONV().kind === 'syntec' ? base : Math.max(yrs >= 2 ? 2 : 1, cadre ? CONV().rules.licC || 0 : CONV().rules.licNC || 0); return { months: m, label: `${m} mois (préavis de licenciement, ${CONV().short})` }; }
    const cv = CONV(), lm = yrs >= 2 ? 2 : yrs >= 0.5 ? 1 : 0;
    if (cv.kind === 'code') {
      if (/Démission/.test(r)) return { months: 1, label: '1 mois selon l’usage (aucune convention collective : à vérifier dans le contrat)' };
      if (/Licenciement/.test(r)) return { months: lm, label: lm ? `${lm} mois de préavis légal de licenciement (art. L1234-1)` : 'selon l’usage (moins de 6 mois d’ancienneté)' }; }
    if (cv.kind === 'other') { const cr = cv.rules, todo = cv.ok ? `convention ${cv.short}` : 'règles de la convention à vérifier';
      if (/Démission/.test(r)) { const m = cadre ? cr.demC : cr.demNC; return { months: m, label: `${m ? `${String(m).replace('.', ',')} mois` : 'aucun'} (${todo})` }; }
      if (/Licenciement/.test(r)) { const m = Math.max(lm, cadre ? cr.licC : cr.licNC); return { months: m, label: m ? `${String(m).replace('.', ',')} mois de préavis de licenciement (${m > lm ? `convention ${cv.short}` : 'minimum légal'}${cv.ok ? '' : ', règles de la convention à vérifier'})` : 'selon l’usage (moins de 6 mois d’ancienneté)' }; } }
    if (/Démission/.test(r)) return { months: base, label: `${base} mois (convention Syntec, ${cadre ? 'cadre' : 'ETAM'})` };
    if (/Licenciement/.test(r)) return { months: base, label: `${base} mois de préavis de licenciement (Syntec)` };
    if (/retraite/i.test(r)) { const m = yrs >= 2 ? 2 : 1; return { months: m, label: `${m} mois (départ volontaire à la retraite)` }; }
    if (/conventionnelle/.test(r)) return { months: 0, rc: true, label: 'Pas de préavis : la date de fin est fixée dans la convention' };
    if (/CDD/.test(r)) return { months: 0, label: 'Fin au terme du contrat' };
    if (/essai/.test(r)) return { months: 0, label: 'Délai de prévenance de la période d’essai' };
    return { months: 0, label: '—' };
  }
  function rcCalendar(d) {
    if (!d.rc.signed) return null;
    const retract = addDays(d.rc.signed, 15), request = addDays(retract, 1), homol = addWorkDays(request, 15);
    return { retract, request, homol, earliest: addDays(homol, 1) };
  }
  function exitIndemnities(e) {
    const x = e.exit || { reason: '', lastDay: TODAY }, r = x.reason, m = e.salary / 12, years = Math.max(0, dayDiff(e.startDate, x.lastDay) / 365.25);
    const legal = /Licenciement|conventionnelle|Mise à la retraite/.test(r) && !/faute grave/.test(r) && years >= 8 / 12 ? m * (Math.min(years, 10) / 4 + Math.max(0, years - 10) / 3) : 0;
    return { years, legal, cpPay: e.cp * (e.salary / 12 / 21.67), precarite: e.contract === 'CDD' && /CDD/.test(r) ? e.salary * years * 0.1 : 0 };
  }
  const exitDocs = (e) => ['certificat', 'solde', 'france-travail'].map((k) => db.documents.find((x) => x.empId === e.id && x.kind === k));
  function departSteps(e, stage) {
    const d = offb(e), all = (o, list) => list.every(([k]) => o[k]);
    if (stage === 13) return [!!e.exit, !!d.noticeOk, !!d.calcOk, exitDocs(e).every(Boolean), !!d.returnPlan];
    if (stage === 14) return [!!d.exitInterview, !!d.successor && all(d.transfer, TRANSFER), all(d.returned, RETURN_ITEMS), !!d.accessOff && !!d.portability, !!d.docsGiven];
    return [!!d.archivedAt, !!d.retentionOk, !d.requests.some((x) => x.status === 'En attente'), d.rehire !== undefined && d.rehire !== null];
  }
  function departActions(e) {
    if (ui.profile !== 'rh') return [];
    const s = departSteps(e, e.stage), d = offb(e);
    const labels = { 13: ['', 'préavis à valider', 'indemnités à chiffrer', 'documents de sortie à préparer', 'restitution à planifier'], 14: ['entretien de départ', 'passation', 'matériel à récupérer', 'accès et portabilité', 'documents à remettre'], 15: ['dossier à archiver', 'durées de conservation', 'demande d’un ancien salarié', 'décision de réembauche'] }[e.stage];
    const out = s.map((v, k) => (v ? '' : labels[k])).filter(Boolean);
    if (e.stage === 14 && e.exit && e.exit.lastDay <= TODAY && !d.accessOff) out.unshift('accès à couper aujourd’hui');
    return out;
  }
  function departDossier(e, i) {
    const d = offb(e), rh = ui.profile === 'rh', x = e.exit || {};
    const row = (label, sub, state) => `<div class="todo"><div class="t"><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</div>${state}</div>`;
    const ok = (date, txt = 'Fait') => `<span class="pill ok">${txt}${date ? ` · ${fmtShort(date)}` : ''}</span>`;
    const b = (act, label, extra = '', cls = 'ghost') => (rh ? `<button type="button" class="btn ${cls} sm" data-act="${act}" data-id="${e.id}" ${extra}>${label}</button>` : '<span class="pill warn">À faire</span>');
    const sec = (title, body) => `<h4 class="sub" style="margin-top:18px">${title}</h4>${body}`;
    let html = `<p class="hint" style="margin:12px 0 0">${esc(x.reason || '—')} · dernier jour ${x.lastDay ? `le ${fmtDate(x.lastDay)}` : 'à fixer'} · ${esc(e.contract)} · ${esc(e.category || '')} · entré·e le ${fmtDate(e.startDate)} (${seniority(e.startDate)})</p>`;
    if (i === 13) {
      const n = noticeInfo(e), rc = rcCalendar(d);
      let notice = row('Préavis', `${n.label}${n.months && d.notifiedAt ? ` · notifié le ${fmtDate(d.notifiedAt)}, fin le ${fmtDate(addDays(addMonths(d.notifiedAt, n.months), -1))}` : ''}. Les congés pris pendant le préavis ne le prolongent pas.`, d.noticeOk ? ok(d.noticeOk, 'Validé') : b('dep-set', 'Valider', 'data-k="noticeOk"'));
      if (n.rc) notice += row('Calendrier de la rupture conventionnelle', rc ? `Signée le ${fmtDate(d.rc.signed)} · rétractation jusqu’au ${fmtDate(rc.retract)} (15 jours calendaires) · demande d’homologation le ${fmtDate(rc.request)} · réponse de la DREETS au plus tard le ${fmtDate(rc.homol)} · fin du contrat au plus tôt le ${fmtDate(rc.earliest)}${x.lastDay < rc.earliest ? ' <b class="warn-t">· la date de fin prévue est trop tôt</b>' : ''}` : 'Entretien(s), puis signature de la convention : les délais de rétractation et d’homologation démarrent à la signature.',
        rc ? ok(d.rc.signed, 'Signée') : `${rh ? `<input type="date" class="input" data-change="rc-signed" data-id="${e.id}" aria-label="Date de signature">` : ''}`);
      html += sec('Motif et préavis', notice);
      const ind = exitIndemnities(e);
      html += sec('Chiffrage de la fin de contrat', row('Indemnités', `${ind.legal ? `Indemnité ${/conventionnelle/.test(x.reason) ? 'de rupture (au moins l’indemnité légale)' : 'légale de licenciement'} : <b class="num">${eur0(ind.legal)}</b> (1/4 de mois par année jusqu’à 10 ans, 1/3 au-delà) · ` : ''}Indemnité compensatrice de congés payés (${e.cp} j) : <b class="num">${eur0(ind.cpPay)}</b>${ind.precarite ? ` · Indemnité de fin de CDD (10 %) : <b class="num">${eur0(ind.precarite)}</b>` : ''}.${CONV().kind === 'code' ? '' : ` Vérifier l’indemnité conventionnelle ${CONV().short} si plus favorable.`}`, d.calcOk ? ok(d.calcOk, 'Validé') : b('dep-set', 'Valider le chiffrage', 'data-k="calcOk"')));
      const docs = exitDocs(e);
      // Un document par ligne : chacun a son propre état et son bouton.
      const DOC_SUB = { certificat: 'Remis au salarié le dernier jour', solde: 'Remis le dernier jour, signé par le salarié (contestable pendant 6 mois)', 'france-travail': 'Transmise via la DSN ; une copie est remise au salarié' };
      const docState = (doc) => (doc.status === 'Brouillon' ? '<span class="pill warn">À relire</span>' : ok(doc.issuedAt || doc.signedAt, doc.status || 'Remis'));
      html += sec('Documents de sortie', docs.every(Boolean) ? docs.map((doc) => row(esc(DOC_LABEL[doc.kind]), DOC_SUB[doc.kind], `${docState(doc)}${docBtn(doc, 'Voir')}`)).join('')
        : row('Certificat de travail, reçu pour solde de tout compte, attestation France Travail', 'Préparés en une fois, puis relus et remis un par un.', b('dep-docs', 'Préparer les documents', '', 'primary')));
      html += sec('Restitution et accès', row('Matériel et accès', `${RETURN_ITEMS.map(([, l]) => l).join(', ')} à récupérer le ${x.lastDay ? fmtDate(x.lastDay) : '—'} ; comptes désactivés le soir même.`, d.returnPlan ? ok(d.returnPlan, 'Planifié') : b('dep-set', 'Planifier', 'data-k="returnPlan"')));
    }
    if (i === 14) {
      const xi = d.exitInterview;
      html += sec('Entretien de départ', xi ? row(`Motif principal : ${esc(xi.reason)} · recommande l’entreprise ${xi.enps}/10 · prêt·e à revenir : ${esc(xi.back)}`, `Points forts : ${esc(xi.good || '—')} · À améliorer : ${esc(xi.improve || '—')}`, ok(xi.date)) : rh ? `<form data-form="exit-int" data-id="${e.id}" class="exit-form"><div class="form-grid">
          <div class="field"><label for="xi-r">Motif principal du départ</label><select id="xi-r" name="reason" class="select">${EXIT_REASONS.map((r) => `<option>${r}</option>`).join('')}</select></div>
          <div class="field"><label for="xi-n">Recommanderiez-vous ${esc(COMPANY.nom)} ? (0 à 10)</label><input id="xi-n" name="enps" type="number" min="0" max="10" class="input num" value="7"></div>
          <div class="field"><label for="xi-g">Ce qui a bien fonctionné</label><input id="xi-g" name="good" class="input"></div><div class="field"><label for="xi-i">Ce qui serait à améliorer</label><input id="xi-i" name="improve" class="input"></div>
          <div class="field"><label for="xi-b">Prêt·e à revenir un jour ?</label><select id="xi-b" name="back" class="select"><option>Oui</option><option>Peut-être</option><option>Non</option></select></div></div>
          <div class="toolbar" style="margin-top:10px"><span class="hint">Mené par les RH plutôt que par le manager, pour des réponses franches.</span><button class="btn primary sm" style="margin-left:auto">Enregistrer</button></div></form>` : row('Entretien de départ', 'Mené par les RH', '<span class="pill neutral">À venir</span>'));
      // Successeur : recherche parmi tout l'effectif présent (hors personnes elles-mêmes sur le départ), ou « aucun successeur ».
      const can = rh || ui.profile === 'manager', none = d.successor === 'none', succ = !none && d.successor ? emp(d.successor) : null;
      const cands = employed().filter((y) => y.id !== e.id && !y.exit && y.stage >= 4).sort((a, z) => (z.dept === e.dept) - (a.dept === e.dept) || a.lastName.localeCompare(z.lastName, 'fr'));
      const change = can ? `<button type="button" class="btn ghost sm" data-act="dep-succ-clear" data-id="${e.id}">Changer</button>` : '';
      const pick = succ ? `<span class="pill ok">${esc(fullName(succ))} · ${esc(succ.title)}</span>${change}` : none ? `<span class="pill neutral">Aucun successeur</span>${change}`
        : can ? `<div class="succ-pick"><select class="select" data-change="dep-succ" data-id="${e.id}" aria-label="Successeur"><option value="">Rechercher un salarié…</option>${cands.map((y) => `<option value="${y.id}">${esc(fullName(y))}</option>`).join('')}</select>
            <label class="agree"><input type="checkbox" data-change="dep-succ-none" data-id="${e.id}"> Aucun successeur</label></div>` : '<span class="pill warn">À désigner</span>';
      html += sec('Transmission', row('Successeur ou relais', none ? 'Le poste n’est pas repris : les dossiers sont archivés ou répartis' : 'Personne qui reprend les dossiers (tout l’effectif, en commençant par le service)', pick)
        + TRANSFER.map(([k, l]) => row(none && k === 'dossiers' ? 'Dossiers en cours archivés ou répartis' : l, '', d.transfer[k] ? ok(d.transfer[k]) : rh || ui.profile === 'manager' ? `<button type="button" class="btn ghost sm" data-act="dep-transfer" data-id="${e.id}" data-k="${k}">Fait</button>` : '')).join(''));
      html += sec('Restitution du matériel', RETURN_ITEMS.map(([k, l]) => row(l, '', d.returned[k] ? ok(d.returned[k], 'Rendu') : b('dep-return', 'Rendu', `data-k="${k}"`))).join(''));
      html += sec('Fin des accès et des dispositifs', row('Comptes, messagerie et accès aux locaux', 'À désactiver le dernier jour, après la passation', d.accessOff ? ok(d.accessOff, 'Désactivés') : b('dep-set', 'Désactiver', 'data-k="accessOff"', x.lastDay && x.lastDay <= TODAY ? 'bad' : 'ghost'))
        + row('Portabilité de la mutuelle et de la prévoyance', 'Maintien gratuit jusqu’à 12 mois si le salarié est indemnisé par France Travail (sauf faute lourde) : notice à remettre', d.portability ? ok(d.portability, 'Notice remise') : b('dep-set', 'Notice remise', 'data-k="portability"')));
      const docs = exitDocs(e);
      html += sec('Documents de fin de contrat', `${docs.filter(Boolean).map((doc) => row(esc(doc.title), doc.kind === 'solde' ? 'Peut être dénoncé par le salarié dans les 6 mois suivant sa signature' : doc.kind === 'france-travail' ? 'Transmise à France Travail via la DSN' : 'Remis le dernier jour', docBtn(doc))).join('') || row('Documents non préparés', 'À générer à l’étape « Préparation du départ »', b('dep-docs', 'Préparer'))}
        ${row('Remise au salarié', '', d.docsGiven ? ok(d.docsGiven, 'Remis') : b('dep-set', 'Remis au salarié', 'data-k="docsGiven"'))}`);
    }
    if (i === 15) {
      const out = x.lastDay || TODAY;
      html += sec('Archivage', row('Dossier du salarié', 'Accès restreint aux RH après archivage', d.archivedAt ? ok(d.archivedAt, 'Archivé') : b('dep-set', 'Archiver le dossier', 'data-k="archivedAt"', 'primary')));
      html += sec('Durées de conservation', [['Contrat, avenants, dossier du personnel', 5], ['Copie des bulletins de paie', 5], ['Registre unique du personnel (mentions)', 5], ['Déclarations d’accident du travail', 10]].map(([l, y]) => row(l, `${y} ans après le départ`, `<span class="pill neutral">Jusqu’au ${fmtShort(addYears(out, y))}</span>`)).join('')
        + row('Application des durées', 'Les pièces sont supprimées automatiquement à l’échéance', d.retentionOk ? ok(d.retentionOk, 'Programmé') : b('dep-set', 'Programmer', 'data-k="retentionOk"')));
      html += sec('Demandes après le départ', d.requests.length ? d.requests.map((r) => row(esc(r.label), `Reçue le ${fmtDate(r.date)}`, r.status === 'Traitée' ? ok(r.doneAt, 'Envoyée') : b('dep-request', 'Générer et envoyer', `data-r="${r.id}"`, 'primary'))).join('') : '<p class="muted" style="margin:0">Aucune demande.</p>');
      const xi = d.exitInterview;
      html += sec('Lien avec l’ancien collaborateur', row('Réembauche possible', `${xi ? `Prêt·e à revenir : ${esc(xi.back)} · ` : ''}Les « salariés boomerang » connaissent déjà la culture de l’entreprise.`, rh ? `<select class="select" data-change="dep-rehire" data-id="${e.id}" aria-label="Réembauche"><option value="">À décider</option>${['Oui', 'Non'].map((y) => `<option ${d.rehire === y ? 'selected' : ''}>${y}</option>`).join('')}</select>` : '')
        + (d.rehire === 'Oui' && rh ? row('Proposer une offre ouverte', 'Ajoute l’ancien collaborateur aux candidats, source « Ancien salarié »', `<select class="select" data-change="boomerang" data-id="${e.id}" aria-label="Offre"><option value="">Choisir une offre…</option>${db.jobs.filter((j) => j.status === 'Ouverte').map((j) => `<option value="${j.id}">${esc(j.title)}</option>`).join('')}</select>`) : ''));
    }
    return html;
  }
  function exitStats() {
    const list = Object.entries(db.offboarding || {}).map(([id, d]) => d.exitInterview).filter(Boolean);
    if (!list.length) return '';
    const counts = {}; list.forEach((x) => { counts[x.reason] = (counts[x.reason] || 0) + 1; });
    const prom = list.filter((x) => x.enps >= 9).length, det = list.filter((x) => x.enps <= 6).length, back = list.filter((x) => x.back === 'Oui').length;
    return card('Enseignements des entretiens de départ', `<span class="muted num">${plural(list.length, 'entretien', 'entretiens')}</span>`, `<div class="card-b"><div class="crit">${Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([r, n]) => `<div class="crit-row"><span>${esc(r)}</span><b class="num">${n}</b></div>`).join('')}
      <div class="crit-row total"><span>eNPS des partants</span><b class="num">${Math.round(((prom - det) / list.length) * 100)}</b></div><div class="crit-row"><span>Prêts à revenir</span><b class="num">${Math.round((back / list.length) * 100)} %</b></div></div></div>`);
  }
  Object.assign(MOD_ACT, {
    workload(d) { const r = db.reviews.find((x) => x.id === d.id); r.workload = TODAY; toast('Volet charge de travail enregistré'); commit(); },
    'dep-set'(d) { const e = emp(d.id);
      if (d.k === 'docsGiven') { const docs = exitDocs(e).filter(Boolean), err = docs.filter((x) => !docLocked(x)).map((x) => issueDoc(x, true)).find(Boolean); if (err) { toast(err, 'info'); commit(); return; } notify(e.id, 'Vos documents de fin de contrat sont disponibles dans vos documents.'); }
      offb(e)[d.k] = TODAY; if (d.k === 'accessOff') notify(e.managerId, `Accès de ${fullName(e)} désactivés.`); toast('Enregistré'); commit(); },
    'dep-docs'(d) { const e = emp(d.id); ['certificat', 'solde', 'france-travail'].forEach((k) => { if (!db.documents.some((x) => x.empId === e.id && x.kind === k)) addDoc(e.id, k); }); offb(e).docsReady = TODAY; toast('Documents de sortie préparés'); commit(); },
    'dep-succ-clear'(d) { offb(emp(d.id)).successor = null; render(); setTimeout(() => { const q = document.querySelector('.succ-pick .emp-pick input'); if (q) q.focus(); }, 0); },
    'dep-transfer'(d) { offb(emp(d.id)).transfer[d.k] = TODAY; toast('Passation enregistrée'); commit(); },
    'dep-return'(d) { offb(emp(d.id)).returned[d.k] = TODAY; toast('Matériel restitué'); commit(); },
    'dep-request'(d) { const e = emp(d.id), r = offb(e).requests.find((x) => x.id === d.r), doc = addDoc(e.id, r.kind, { reqId: r.id }); ui.modal = { type: 'doc-edit', id: doc.id }; toast('Brouillon créé : relisez-le puis remettez-le'); commit(); },
    liaison(d) { const x = (d.k === 'leave' ? db.leaves : db.incidents).find((y) => y.id === d.id); x.liaison = TODAY; notify(x.empId, 'Un rendez-vous de liaison vous est proposé pour préparer votre retour, avec le service de santé au travail.'); toast('Rendez-vous de liaison proposé'); commit(); },
    reprise(d) { const date = d.d > TODAY ? addDays(d.d, 3) : addDays(TODAY, 2); db.visits.push({ id: uid('v'), empId: d.id, kind: 'Visite de reprise', date, status: 'Planifiée', result: null }); notify(d.id, `Visite de reprise prévue le ${fmtDate(date)}.`); toast('Visite de reprise planifiée'); commit(); },
    'duerp-version'() { db.duerp = db.duerp || []; db.duerp.push({ date: TODAY, by: me().id, note: 'Mise à jour annuelle', count: db.risks.length }); toast('Nouvelle version du DUERP enregistrée'); commit(); },
  });
  Object.assign(MOD_CHG, {
    'case-convoc'(v, d) { const c = db.cases.find((x) => x.id === d.id); c.convocAt = v || null; if (v) c.events.push({ date: v, type: 'Convocation envoyée', note: 'Convocation à l’entretien préalable présentée au salarié.', by: me().id, visible: false }); commit(); },
    'train-cold'(v, d) { if (!v) return; const x = db.enrollments.find((y) => y.id === d.id); x.cold = Number(v); x.coldAt = TODAY; toast('Évaluation à froid enregistrée'); commit(); },
    'train-fund'(v, d) { db.enrollments.find((y) => y.id === d.id).fund = v; save(); toast('Financement enregistré'); },
    talent(v, d) { db.talent = db.talent || {}; const t = db.talent[d.id] = db.talent[d.id] || {}; t[d.k] = d.k === 'risk' ? v : Number(v); commit(); },
    succ(v, d) { db.succession = db.succession || {}; const s = db.succession[d.id] = db.succession[d.id] || {}; s[d.k] = v || null; if (d.k === 'succ' && !v) s.ready = null; commit(); },
    'rc-signed'(v, d) { if (!v) return; const x = offb(emp(d.id)); x.rc.signed = v; toast('Date de signature enregistrée'); commit(); },
    'dep-succ-none'(v, d, t) { if (!t.checked) return; offb(emp(d.id)).successor = 'none'; toast('Départ sans successeur'); commit(); },
    'dep-succ'(v, d) { const e = emp(d.id); offb(e).successor = v || null; if (v) { notify(v, `Vous reprenez les dossiers de ${fullName(e)}.`); toast(`${fullName(emp(v))} reprend les dossiers`); } commit(); },
    'dep-rehire'(v, d) { offb(emp(d.id)).rehire = v || null; commit(); },
    boomerang(v, d) {
      if (!v) return; const e = emp(d.id), j = db.jobs.find((x) => x.id === v);
      const c = { id: uid('c'), jobId: v, name: fullName(e), email: e.email.replace(/@.*$/, '@mail.fr'), phone: e.phone, source: 'Ancien salarié', experience: `${e.title} chez Nova Studio de ${e.startDate.slice(0, 4)} à ${(e.exit.lastDay || '').slice(0, 4)}`, stage: 'Présélection', score: 0, notes: '', interviews: [], appliedAt: TODAY, messages: [], offer: null, refusal: null, pool: false };
      db.candidates.push(c); sendMsg(c, 'point', ...tplMsg('msg-opportunite', candCtx(c, j)));
      toast(`${fullName(e)} est proposé·e pour « ${j.title} »`); commit();
    },
  });
  Object.assign(MOD_FORMS, {
    'exit-int'(v, form) { const e = emp(form.dataset.id); offb(e).exitInterview = { date: TODAY, reason: v.reason, enps: Math.max(0, Math.min(10, Number(v.enps) || 0)), good: v.good.trim(), improve: v.improve.trim(), back: v.back }; toast('Entretien de départ enregistré'); commit(); },
  });

  // ================================================================ Reporting RH (profil RH)
  // Graphiques en HTML : barres fines (≤ 24 px), extrémité arrondie, espace de 2 px entre segments,
  // libellés en couleurs de texte, info-bulle au survol et tableau de données sous chaque graphique.
  const pct1 = (v) => `${(v * 100).toFixed(1).replace('.', ',')} %`;
  const monthsBack = (n) => Array.from({ length: n }, (_, k) => shiftMonth(monthKey(TODAY), k - n + 1));
  const dataTable = (head, rows) => `<details class="viz-data"><summary>Voir les données</summary><div class="table-wrap"><table><thead><tr>${head.map((h, k) => `<th class="${k ? 'r' : ''}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, k) => `<td class="${k ? 'r num' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
  const legend = (items) => `<div class="viz-legend">${items.map(([l, k]) => `<span><i style="background:var(--viz-${k})"></i>${l}</span>`).join('')}</div>`;
  function hBars(rows, fmt = (v) => v) {
    const max = Math.max(1, ...rows.map((r) => r[1]));
    return `<div class="hbars">${rows.map(([l, v, tip]) => `<div class="hb" data-tip="${esc(tip || `${l} : ${fmt(v)}`)}"><span class="hb-l">${esc(l)}</span><span class="hb-t"><i style="width:calc((100% - 56px) * ${v / max})"></i><b class="num">${fmt(v)}</b></span></div>`).join('')}</div>`;
  }
  function stackBars(rows, series) {
    return `<div class="hbars">${rows.map(([l, vals]) => { const tot = vals.reduce((s, v) => s + v, 0) || 1;
      return `<div class="hb" data-tip="${esc(`${l} : ${series.map(([n], k) => `${n} ${vals[k]}`).join(' · ')}`)}"><span class="hb-l">${esc(l)}</span><span class="hb-t stack">${vals.map((v, k) => (v ? `<i style="width:${(v / tot) * 100}%;background:var(--viz-${series[k][1]})"></i>` : '')).join('')}</span><b class="num hb-v">${tot}</b></div>`; }).join('')}</div>${legend(series)}`;
  }
  function columns(cols, series, fmt = (v) => v, short) {
    const max = Math.max(1, ...cols.flatMap((c) => c[1]));
    return `<div class="cols">${cols.map(([l, vals]) => `<div class="col-g" data-tip="${esc(`${l} : ${vals.map((v, k) => `${series[k][0]} ${fmt(v)}`).join(' · ')}`)}"><div class="col-b">${vals.map((v, k) => `<i style="height:${Math.max(v ? 2 : 0, (v / max) * 85)}%;background:var(--viz-${series[k][1]})">${v ? `<b class="num">${short ? short(v) : fmt(v)}</b>` : ''}</i>`).join('')}</div><span>${esc(l)}</span></div>`).join('')}</div>${series.length > 1 ? legend(series) : ''}`;
  }
  function lineChart(points, fmt, min, max) {
    const W = 520, H = 150, pad = 26, x = (k) => pad + (k * (W - 2 * pad)) / Math.max(1, points.length - 1), y = (v) => H - pad - ((v - min) / (max - min)) * (H - 2 * pad);
    const valid = points.map((p, k) => [k, p[1]]).filter(([, v]) => v !== null);
    const grid = [min, (min + max) / 2, max].map((g) => `<line x1="${pad}" x2="${W - pad}" y1="${y(g)}" y2="${y(g)}" class="viz-grid"/><text x="${pad - 6}" y="${y(g) + 4}" text-anchor="end" class="viz-tick">${fmt(g)}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="viz-line" role="img" aria-label="Évolution">${grid}
      <polyline points="${valid.map(([k, v]) => `${x(k)},${y(v)}`).join(' ')}" class="viz-l1"/>
      ${valid.map(([k, v]) => `<circle cx="${x(k)}" cy="${y(v)}" r="5" class="viz-dot" data-tip="${esc(`${points[k][0]} : ${fmt(v)}`)}"/>`).join('')}
      ${points.map((p, k) => `<text x="${x(k)}" y="${H - 6}" text-anchor="middle" class="viz-tick">${esc(p[0])}</text>`).join('')}</svg>`;
  }
  const ageBand = (a) => (a === null ? null : a < 25 ? 'Moins de 25 ans' : a < 35 ? '25-34 ans' : a < 45 ? '35-44 ans' : a < 55 ? '45-54 ans' : '55 ans et plus');
  const AGE_BANDS = ['55 ans et plus', '45-54 ans', '35-44 ans', '25-34 ans', 'Moins de 25 ans'];
  function viewReporting() {
    const pop = employed(), n = pop.length, yearAgo = addMonths(TODAY, -12);
    const avg = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
    const entries = db.employees.filter((e) => e.startDate > yearAgo && e.startDate <= TODAY && e.stage >= 3);
    const exitsDone = db.employees.filter((e) => e.exit && e.exit.lastDay > yearAgo && e.exit.lastDay <= TODAY);
    const exitsPlanned = db.employees.filter((e) => e.exit && e.exit.lastDay > TODAY);
    const sickDays = db.leaves.filter((l) => l.type === 'Maladie' && l.status === 'Approuvée' && l.end >= yearAgo && l.start <= TODAY).reduce((s, l) => s + workDays(l.start < yearAgo ? yearAgo : l.start, l.end > TODAY ? TODAY : l.end), 0);
    const absRate = sickDays / Math.max(1, n * 218);
    const tenure = avg(pop.map((e) => dayDiff(e.startDate, TODAY) / 365.25)), age = avg(pop.filter((e) => e.birthDate).map((e) => ageAt(e)));
    const masse = pop.reduce((s, e) => s + e.salary, 0);
    const kpi = (l, v, s2, tip) => `<div class="card kpi" ${tip ? `data-tip="${esc(tip)}"` : ''}><span class="l">${l}</span><span class="v num">${v}</span><span class="s">${s2}</span></div>`;
    // 1. Effectif par service
    const depts = DEPTS.map((d) => [d, pop.filter((e) => e.dept === d).length]).filter(([, v]) => v).sort((a, b) => b[1] - a[1]);
    // 2. Répartition femmes-hommes par catégorie
    const cats = ['Cadre', 'Agent de maîtrise', 'Employé'].map((c) => [c, ['F', 'H'].map((s) => pop.filter((e) => e.category === c && e.sex === s).length)]).filter(([, v]) => v[0] + v[1]);
    // 3. Pyramide des âges
    const pyr = AGE_BANDS.map((b) => [b, ['F', 'H'].map((s) => pop.filter((e) => e.sex === s && ageBand(ageAt(e)) === b).length)]);
    const pmax = Math.max(1, ...pyr.flatMap((r) => r[1]));
    // 4. Mouvements sur 12 mois
    const months = monthsBack(12), ml = (m) => new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(parse(m + '-01')).replace('.', '');
    const moves = months.map((m) => [ml(m), [db.employees.filter((e) => e.startDate.slice(0, 7) === m && e.stage >= 2).length, db.employees.filter((e) => e.exit && e.exit.lastDay.slice(0, 7) === m).length]]);
    // 5. Absences par motif (jours ouvrés, 12 mois)
    const absTypes = ABS_TYPES.map((t) => [t, db.leaves.filter((l) => l.type === t && l.status === 'Approuvée' && l.end >= yearAgo && l.start <= TODAY).reduce((s, l) => s + workDays(l.start < yearAgo ? yearAgo : l.start, l.end > TODAY ? TODAY : l.end), 0)]).filter(([, v]) => v);
    // 6. Masse salariale mensuelle (paie)
    const pm = payMonths(), payroll = pm.map((m) => [monthLabel(m), db.employees.filter((e) => inPayroll(e, m)).reduce((s, e) => s + calcPay(e, m).gross, 0)]);
    // 7. Recrutement
    const sources = {}; db.candidates.forEach((c) => { sources[c.source] = (sources[c.source] || 0) + 1; });
    const filled = db.candidates.filter((c) => c.hiredAt).map((c) => { const j = db.jobs.find((x) => x.id === c.jobId); const pub = j.publishedAt || ((j.approvals || []).find((a) => a.step === 'publication') || {}).date || j.createdAt; return dayDiff(pub, c.hiredAt); });
    // 8. QVT et formation
    const qvt = monthsBack(6).map((m) => { const st = qvtStats(m); return [ml(m), st.n >= 3 ? st.overall : null]; });
    const b = budgetState(), trained = new Set(db.enrollments.filter((x) => ['Terminée', 'Validée'].includes(x.status) && x.session.slice(0, 4) === TODAY.slice(0, 4)).map((x) => x.empId));
    const gap = payGap(db.employees);
    // Indicateurs du jour (anciennement sur l'accueil) et suivi des offres (anciennement en tête de chaque offre).
    const away = pop.filter((e) => { const l = leaveOn(e, TODAY); return l && l.type !== 'Télétravail'; }).length, openJobs = db.jobs.filter((j) => j.status === 'Ouverte');
    const arrivals = db.employees.filter((e) => e.stage === 2), trial = pop.filter((e) => e.stage === 4).length;
    const offers = db.jobs.filter((j) => NEED_OPEN.includes(j.status)).sort((a, c) => (a.status === 'Ouverte' ? 0 : 1) - (c.status === 'Ouverte' ? 0 : 1) || c.createdAt.localeCompare(a.createdAt)).map((j) => [j, offerStats(j)]);
    const fun = ['Reçues', 'Présélection', 'Entretien', 'Proposition', 'Embauche'].map((l, k) => [l, openJobs.reduce((acc, j) => acc + offerStats(j).funnel[k], 0)]);
    const today = `<div class="kpis">${kpi('Absents aujourd’hui', away, fmtDate(TODAY, { weekday: 'long', day: 'numeric', month: 'long' }))}${kpi('Absences à valider', db.leaves.filter((l) => l.status === 'En attente').length, 'Congés, RTT, télétravail')}
      ${kpi('Postes ouverts', openJobs.length, `${plural(db.jobs.filter((j) => j.status === 'En validation').length, 'besoin en attente', 'besoins en attente')} de validation`)}${kpi('Arrivées en cours', arrivals.length, `${plural(trial, 'personne', 'personnes')} en intégration`)}</div>`;
    const offersCard = card('Offres d’emploi', `<span class="muted" style="font-size:13px">${plural(openJobs.length, 'offre ouverte', 'offres ouvertes')}</span>`, `<div class="table-wrap"><table><thead><tr><th>Référence</th><th>Offre</th><th class="r">En ligne · délai</th><th class="r">Candidatures</th><th class="r">Passage en entretien</th><th>Meilleure source</th></tr></thead><tbody>
        ${offers.map(([j, x]) => `<tr><td class="num">${jobRef(j)}</td><td><b>${esc(j.title)}</b><br><small class="muted">${esc(j.dept)} · ${j.status === 'Ouverte' ? 'ouverte' : j.status.toLowerCase()}</small></td><td class="r num">${plural(x.days, 'jour', 'jours')}${x.hired ? '<br><small class="muted">pourvue</small>' : ''}</td><td class="r num">${x.n}<br><small class="muted">${x.active} en cours</small></td><td class="r num">${Math.round(x.toIv * 100)} %</td><td>${x.best ? `${esc(x.best.src)} <small class="muted num">${x.best.avg.toFixed(1).replace('.', ',')}/5</small>` : '—'}</td></tr>`).join('')}</tbody></table></div>
      <div class="card-b"><h4 class="sub">Entonnoir des offres ouvertes</h4>${hBars(fun)}${dataTable(['Étape atteinte', 'Candidats'], fun)}</div>`);
    return `${today}<div class="kpis six">${kpi('Effectif', n, `${plural(exitsPlanned.length, 'départ prévu', 'départs prévus')} · ${plural(db.employees.filter((e) => e.stage === 2 && e.startDate > TODAY).length, 'arrivée prévue', 'arrivées prévues')}`)}
        ${kpi('Entrées sur 12 mois', entries.length, `taux d’entrée ${pct1(entries.length / Math.max(1, n))}`)}${kpi('Turnover sur 12 mois', pct1(exitsDone.length / Math.max(1, n)), `${plural(exitsDone.length, 'sortie', 'sorties')} réalisée${exitsDone.length > 1 ? 's' : ''}`, 'Sorties des 12 derniers mois rapportées à l’effectif')}
        ${kpi('Absentéisme maladie', pct1(absRate), `${plural(sickDays, 'jour ouvré', 'jours ouvrés')} sur 12 mois`, 'Jours d’arrêt maladie rapportés à 218 jours travaillés par salarié')}
        ${kpi('Ancienneté moyenne', `${tenure.toFixed(1).replace('.', ',')} ans`, `âge moyen ${Math.round(age)} ans`)}${kpi('Masse salariale annuelle', eur0(masse), `salaire moyen ${eur0(masse / Math.max(1, n))}`)}</div>
      <div class="viz-grid2">
        ${card('Effectif par service', '', `<div class="card-b">${hBars(depts, (v) => v)}${dataTable(['Service', 'Salariés'], depts)}</div>`)}
        ${card('Femmes et hommes par catégorie', '', `<div class="card-b">${stackBars(cats, [['Femmes', 1], ['Hommes', 2]])}${dataTable(['Catégorie', 'Femmes', 'Hommes'], cats.map(([c, v]) => [c, v[0], v[1]]))}</div>`)}
        ${card('Pyramide des âges', '', `<div class="card-b"><div class="pyr">${pyr.map(([l, v]) => `<div class="pyr-r" data-tip="${esc(`${l} : ${v[0]} femme${v[0] > 1 ? 's' : ''}, ${v[1]} homme${v[1] > 1 ? 's' : ''}`)}"><span class="pyr-s l"><b class="num">${v[0] || ''}</b><i style="width:${(v[0] / pmax) * 100}%;background:var(--viz-1)"></i></span><span class="pyr-l">${l}</span><span class="pyr-s"><i style="width:${(v[1] / pmax) * 100}%;background:var(--viz-2)"></i><b class="num">${v[1] || ''}</b></span></div>`).join('')}</div>
          ${legend([['Femmes', 1], ['Hommes', 2]])}${dataTable(['Tranche d’âge', 'Femmes', 'Hommes'], pyr.map(([l, v]) => [l, v[0], v[1]]))}</div>`)}
        ${card('Entrées et sorties sur 12 mois', '', `<div class="card-b">${columns(moves, [['Entrées', 1], ['Sorties', 2]])}${dataTable(['Mois', 'Entrées', 'Sorties'], moves.map(([l, v]) => [l, v[0], v[1]]))}</div>`)}
        ${card('Absences par motif sur 12 mois', '<span class="muted" style="font-size:13px">jours ouvrés</span>', `<div class="card-b">${hBars(absTypes.sort((a, c) => c[1] - a[1]), (v) => `${v} j`)}${dataTable(['Motif', 'Jours ouvrés'], absTypes)}</div>`)}
        ${card('Masse salariale brute mensuelle', '', `<div class="card-b">${columns(payroll.map(([l, v]) => [l.replace(/ \d{4}$/, ''), [Math.round(v)]]), [['Brut', 1]], eur0, (v) => `${Math.round(v / 1000)} k€`)}${dataTable(['Mois', 'Brut versé'], payroll.map(([l, v]) => [l, eur0(v)]))}</div>`)}
        ${card('Candidatures par source', `<span class="muted" style="font-size:13px">délai moyen de recrutement : ${filled.length ? plural(Math.round(avg(filled)), 'jour', 'jours') : '—'}</span>`, `<div class="card-b">${hBars(Object.entries(sources).sort((a, c) => c[1] - a[1]))}${dataTable(['Source', 'Candidatures'], Object.entries(sources))}</div>`)}
        ${card('Baromètre QVT', '<span class="muted" style="font-size:13px">note globale sur 5 · masquée sous 3 réponses</span>', `<div class="card-b">${lineChart(qvt, (v) => v.toFixed(1).replace('.', ','), 1, 5)}${dataTable(['Mois', 'Note globale'], qvt.map(([l, v]) => [l, v === null ? 'Non publiée' : v.toFixed(1).replace('.', ',')]))}</div>`)}
      </div>
      <div class="two">${card('Formation', '', `<div class="card-b"><div class="crit"><div class="crit-row"><span>Budget ${TODAY.slice(0, 4)}</span><b class="num">${eur0(b.total)}</b></div><div class="crit-row"><span>Réalisé et engagé</span><b class="num">${eur0(b.used + b.engaged)} (${Math.round(((b.used + b.engaged) / b.total) * 100)} %)</b></div>
          <div class="crit-row"><span>Taux d’accès à la formation</span><b class="num">${pct1(trained.size / Math.max(1, n))}</b></div></div></div>`)}
        ${card('Égalité salariale', '', `<div class="card-b"><div class="crit">${gap.map((r) => `<div class="crit-row"><span>${esc(r.cat)}</span><b class="num">${r.gap === null ? '—' : `${r.gap > 0 ? 'Femmes' : 'Hommes'} −${(Math.abs(r.h - r.f) / Math.max(r.h, r.f) * 100).toFixed(1).replace('.', ',')} %`}</b></div>`).join('')}</div><p class="hint" style="margin:10px 0 0">Écart de salaire moyen par catégorie ; détail dans Rémunération.</p></div>`)}</div>
      ${offersCard}
      <p class="hint">Indicateurs calculés sur les salariés en poste au ${fmtDate(TODAY)}, à partir des données du logiciel.</p>`;
  }

  // ---------------------------------------------------------------- Documents RH et modèles
  // Chaque document naît d'un modèle rédigé par les RH : texte libre, champs automatiques {{clé}} remplis depuis le dossier,
  // champs à saisir {{saisie:id}} complétés à la création. Un document reste modifiable par les RH tant qu'il n'est ni remis ni signé.
  const DOC_LABEL = { contrat: 'Contrat de travail', info7: 'Informations essentielles sur la relation de travail', info1m: 'Informations complémentaires sur la relation de travail', essai: 'Confirmation de fin de période d’essai', attestation: 'Attestation employeur', avenant: 'Avenant au contrat', certificat: 'Certificat de travail', solde: 'Reçu pour solde de tout compte', 'france-travail': 'Attestation employeur France Travail' };
  const COMPANY = { entreprise: 'Nova Studio SAS', entreprise_adresse: '12 rue de la Paix, 75002 Paris', siret: '000 000 000 00000 (fictif)', convention: 'nationale des bureaux d’études techniques (Syntec)', ville: 'Paris' };
  const longDate = (s) => (s ? fmtDate(s, { day: 'numeric', month: 'long', year: 'numeric' }) : '');
  // Champs automatiques : [clé, libellé, groupe].
  const TOKENS = [
    ['salarie', 'Nom du salarié', 'Salarié'], ['prenom', 'Prénom', 'Salarié'], ['nom', 'Nom de famille', 'Salarié'], ['naissance', 'Date de naissance', 'Salarié'], ['nationalite', 'Nationalité', 'Salarié'], ['adresse', 'Adresse du salarié', 'Salarié'],
    ['poste', 'Poste', 'Contrat'], ['service', 'Service', 'Contrat'], ['manager', 'Manager', 'Contrat'], ['contrat', 'Type de contrat', 'Contrat'], ['categorie', 'Catégorie', 'Contrat'], ['salaire', 'Salaire annuel brut', 'Contrat'], ['salaire_mensuel', 'Salaire mensuel brut', 'Contrat'],
    ['date_entree', 'Date d’entrée', 'Contrat'], ['date_fin', 'Date de fin du contrat', 'Contrat'], ['lieu', 'Lieu de travail', 'Contrat'], ['essai', 'Durée de la période d’essai', 'Contrat'], ['essai_fin', 'Fin de la période d’essai', 'Contrat'], ['anciennete', 'Ancienneté', 'Contrat'],
    ['nouveau_poste', 'Nouveau poste', 'Avenant'], ['nouveau_service', 'Nouveau service', 'Avenant'], ['nouveau_salaire', 'Nouveau salaire', 'Avenant'], ['date_effet', 'Date d’effet', 'Avenant'],
    ['dernier_jour', 'Dernier jour travaillé', 'Départ'], ['motif_depart', 'Motif de fin de contrat', 'Départ'], ['solde_detail', 'Détail du solde de tout compte (tableau)', 'Départ'], ['solde_total', 'Total du solde de tout compte', 'Départ'],
    ['candidat', 'Nom du candidat', 'Candidat'], ['candidat_prenom', 'Prénom du candidat', 'Candidat'], ['offre', 'Poste de l’offre', 'Candidat'], ['offre_service', 'Service de l’offre', 'Candidat'], ['offre_lieu', 'Lieu de l’offre', 'Candidat'],
    ['entretien_type', 'Type d’entretien', 'Candidat'], ['entretien_date', 'Date de l’entretien', 'Candidat'], ['entretien_heure', 'Heure de l’entretien', 'Candidat'], ['entretien_avec', 'Interlocuteur de l’entretien', 'Candidat'],
    ['motif_refus', 'Motif du refus', 'Candidat'], ['vivier', 'Phrase sur le vivier et la conservation des données', 'Candidat'], ['suppression_donnees', 'Date de suppression des données', 'Candidat'], ['rgpd', 'Information sur les données personnelles', 'Candidat'], ['delai_reponse', 'Délai de réponse annoncé', 'Candidat'],
    ['proposition_contrat', 'Contrat proposé', 'Candidat'], ['proposition_salaire', 'Salaire proposé', 'Candidat'], ['proposition_date_entree', 'Date d’entrée proposée', 'Candidat'], ['proposition_limite', 'Date limite de réponse', 'Candidat'], ['proposition_manager', 'Manager du poste proposé', 'Candidat'],
    ['entreprise', 'Nom de l’entreprise', 'Entreprise'], ['entreprise_adresse', 'Adresse de l’entreprise', 'Entreprise'], ['siret', 'SIRET', 'Entreprise'], ['convention', 'Convention collective', 'Entreprise'], ['signataire', 'Signataire RH', 'Entreprise'], ['signataire_titre', 'Fonction du signataire', 'Entreprise'], ['ville', 'Ville', 'Entreprise'], ['date_jour', 'Date du document', 'Entreprise'],
  ];
  const TOKEN_LABEL = Object.fromEntries(TOKENS.map(([k, l]) => [k, l]));
  const SIG = '<p class="sig">Fait à {{ville}}, le {{date_jour}}<br><b>{{signataire}}</b>, {{signataire_titre}}</p>';
  const paras = (...xs) => xs.map((x) => (/^<(h3|ul|table|p)/.test(x) ? x : `<p>${x}</p>`)).join('');
  const contractCore = (nature, extra) => paras(`Entre la société {{entreprise}}, {{entreprise_adresse}}, SIRET {{siret}}, représentée par {{signataire}}, {{signataire_titre}}, d’une part,`,
    `et {{salarie}}, né·e le {{naissance}}, de nationalité {{nationalite}}, demeurant {{adresse}}, d’autre part,`, `il est conclu ${nature}, régi par la convention collective {{convention}}.`, ...extra,
    '<h3>Lieu et durée du travail</h3>', 'Lieu de travail : {{lieu}}. Durée hebdomadaire : 35 heures, selon les horaires collectifs en vigueur dans l’entreprise.',
    '<h3>Rémunération</h3>', 'Rémunération annuelle brute de {{salaire}}, versée en 12 mensualités de {{salaire_mensuel}}.',
    '<h3>Congés payés</h3>', '2,5 jours ouvrables par mois de travail effectif, dans les conditions légales et conventionnelles.',
    '<h3>Protection sociale</h3>', 'Retraite complémentaire Agirc-Arrco ; mutuelle et prévoyance selon les contrats collectifs de l’entreprise, dont la notice est remise au salarié.') + SIG;
  // Modèles d'origine. kind 'doc' = document mis en page ; 'msg' = message au candidat (texte, avec un objet).
  const DEFAULT_TPL = {
    'contrat-cdi': { label: 'Contrat de travail · CDI', group: 'Documents salariés', kind: 'doc', title: 'Contrat de travail à durée indéterminée',
      body: contractCore('un contrat de travail à durée indéterminée', ['<h3>Engagement</h3>', '{{salarie}} est engagé·e à compter du {{date_entree}} en qualité de {{poste}}, catégorie {{categorie}}, au sein du service {{service}}, sous la responsabilité de {{manager}}.',
        '<h3>Période d’essai</h3>', 'Le contrat ne deviendra définitif qu’à l’issue d’une période d’essai de {{essai}}, renouvelable une fois avec l’accord écrit du salarié. Pendant cette période, chaque partie peut y mettre fin en respectant le délai de prévenance légal.',
        '<h3>Rupture du contrat</h3>', 'Après la période d’essai, le contrat peut être rompu dans les conditions prévues par le Code du travail et la convention collective, notamment quant au préavis.']),
      required: [['salarie', 'Identité du salarié'], ['poste', 'Emploi occupé'], ['date_entree', 'Date d’entrée'], ['salaire', 'Rémunération'], ['lieu', 'Lieu de travail'], ['convention', 'Convention collective']] },
    'contrat-cdd': { label: 'Contrat de travail · CDD', group: 'Documents salariés', kind: 'doc', title: 'Contrat de travail à durée déterminée', fields: [{ id: 'motif', label: 'Motif précis du recours au CDD' }],
      body: contractCore('un contrat de travail à durée déterminée, en application de l’article L1242-2 du Code du travail', ['<h3>Motif du recours</h3>', 'Le présent contrat est conclu pour le motif suivant : {{saisie:motif}}.',
        '<h3>Durée</h3>', 'Le contrat prend effet le {{date_entree}} et prendra fin le {{date_fin}}. {{salarie}} occupe le poste de {{poste}}, catégorie {{categorie}}, au sein du service {{service}}, sous la responsabilité de {{manager}}.',
        '<h3>Période d’essai</h3>', 'Le contrat comporte une période d’essai de {{essai}}.', '<h3>Fin du contrat</h3>', 'À l’échéance, le salarié perçoit une indemnité de fin de contrat égale à 10 % de la rémunération totale brute, sauf exceptions légales.']),
      required: [['salarie', 'Identité du salarié'], ['saisie:motif', 'Motif précis du recours (sinon le contrat est réputé à durée indéterminée)'], ['date_fin', 'Terme du contrat'], ['poste', 'Emploi occupé'], ['salaire', 'Rémunération'], ['convention', 'Convention collective']] },
    'contrat-apprentissage': { label: 'Contrat d’apprentissage', group: 'Documents salariés', kind: 'doc', title: 'Contrat d’apprentissage · conditions d’accueil', fields: [{ id: 'ecole', label: 'Établissement de formation' }, { id: 'maitre', label: 'Maître d’apprentissage' }],
      body: paras('Le contrat d’apprentissage est conclu sur le formulaire Cerfa officiel, visé par l’établissement de formation et transmis à l’OPCO. Le présent document en reprend les conditions pour {{salarie}}.',
        '<h3>Formation</h3>', 'Établissement : {{saisie:ecole}}. Maître d’apprentissage : {{saisie:maitre}}.', '<h3>Durée</h3>', 'Du {{date_entree}} au {{date_fin}}, en qualité de {{poste}} au sein du service {{service}}.',
        '<h3>Rémunération</h3>', 'Rémunération annuelle brute de {{salaire}}, conforme au barème légal de l’apprentissage.', '<h3>Rupture</h3>', 'Pendant les 45 premiers jours de formation pratique en entreprise, le contrat peut être rompu librement par chacune des parties.') + SIG,
      required: [['salarie', 'Identité de l’apprenti'], ['date_fin', 'Fin du contrat'], ['saisie:ecole', 'Établissement de formation'], ['saisie:maitre', 'Maître d’apprentissage']] },
    'convention-stage': { label: 'Convention de stage · conditions d’accueil', group: 'Documents salariés', kind: 'doc', title: 'Conditions d’accueil en stage', fields: [{ id: 'ecole', label: 'Établissement d’enseignement' }, { id: 'tuteur', label: 'Tuteur dans l’entreprise' }],
      body: paras('La convention de stage tripartite est établie par l’établissement d’enseignement ({{saisie:ecole}}). Le présent document récapitule les conditions d’accueil de {{salarie}}.',
        '<h3>Période</h3>', 'Du {{date_entree}} au {{date_fin}}, au sein du service {{service}}. Tuteur : {{saisie:tuteur}}.', '<h3>Gratification</h3>', 'Gratification annuelle de {{salaire}}, au moins égale au minimum légal pour un stage de plus de deux mois.') + SIG,
      required: [['salarie', 'Identité du stagiaire'], ['date_fin', 'Fin du stage'], ['saisie:tuteur', 'Tuteur']] },
    info7: { label: 'Informations essentielles (7 jours)', group: 'Documents salariés', kind: 'doc', title: DOC_LABEL.info7,
      body: paras('Conformément aux articles R1221-34 et suivants du Code du travail, voici les informations essentielles relatives à votre relation de travail.',
        '<ul><li>Employeur : {{entreprise}}, {{entreprise_adresse}} · Salarié : {{salarie}}</li><li>Lieu de travail : {{lieu}}</li><li>Emploi : {{poste}} · catégorie {{categorie}}</li><li>Date d’embauche : {{date_entree}} · contrat {{contrat}}</li><li>Période d’essai : {{essai}}, jusqu’au {{essai_fin}}</li><li>Rémunération : {{salaire}} bruts annuels, versés mensuellement</li><li>Durée du travail : 35 heures par semaine ; heures supplémentaires selon la loi et la convention collective</li></ul>') + SIG,
      required: [['salarie', 'Identité des parties'], ['lieu', 'Lieu de travail'], ['poste', 'Emploi'], ['date_entree', 'Date d’embauche'], ['essai', 'Période d’essai'], ['salaire', 'Rémunération']] },
    info1m: { label: 'Informations complémentaires (1 mois)', group: 'Documents salariés', kind: 'doc', title: DOC_LABEL.info1m,
      body: paras('Informations complémentaires relatives à votre relation de travail (art. R1221-35 du Code du travail).',
        '<ul><li>Congés payés : 2,5 jours ouvrables par mois de travail effectif, période de référence du 1er juin au 31 mai</li><li>Rupture du contrat : procédure et préavis prévus par le Code du travail et la convention collective</li><li>Formation : droit à la formation, compte personnel de formation et entretien de parcours professionnel</li><li>Protection sociale : Urssaf, retraite complémentaire Agirc-Arrco, mutuelle et prévoyance collectives</li><li>Convention collective : {{convention}}, consultable auprès des RH</li></ul>') + SIG,
      required: [['convention', 'Convention collective']] },
    essai: { label: 'Confirmation de fin de période d’essai', group: 'Documents salariés', kind: 'doc', title: DOC_LABEL.essai,
      body: paras('{{salarie}},', 'Nous avons le plaisir de vous confirmer que votre période d’essai au poste de {{poste}} a pris fin avec succès. Votre contrat de travail se poursuit donc de manière définitive.', 'Nous vous remercions pour votre engagement depuis votre arrivée le {{date_entree}}.') + SIG, required: [['salarie', 'Destinataire']] },
    avenant: { label: 'Avenant au contrat', group: 'Documents salariés', kind: 'doc', title: DOC_LABEL.avenant,
      body: paras('Entre la société {{entreprise}} et {{salarie}}, il est convenu ce qui suit.', '<b>Article 1.</b> À compter du {{date_effet}}, {{salarie}} occupe le poste de {{nouveau_poste}} au sein du service {{nouveau_service}}.',
        '<b>Article 2.</b> Sa rémunération annuelle brute est portée à {{nouveau_salaire}}, versée en douze mensualités.', '<b>Article 3.</b> Les autres clauses du contrat de travail demeurent inchangées.') + SIG + '<p class="sig">Signature du collaborateur, précédée de la mention « lu et approuvé »</p>',
      required: [['date_effet', 'Date d’effet'], ['nouveau_poste', 'Poste'], ['nouveau_salaire', 'Rémunération']] },
    attestation: { label: 'Attestation employeur', group: 'Documents salariés', kind: 'doc', title: DOC_LABEL.attestation,
      body: paras('Je soussigné·e {{signataire}}, {{signataire_titre}} de la société {{entreprise}}, atteste que {{salarie}} est employé·e au sein de notre société depuis le {{date_entree}}, en qualité de {{poste}}, dans le cadre d’un contrat {{contrat}}.', 'Cette attestation est délivrée à la demande de l’intéressé·e pour servir et valoir ce que de droit.') + SIG,
      required: [['salarie', 'Salarié'], ['date_entree', 'Date d’entrée'], ['poste', 'Emploi']] },
    certificat: { label: 'Certificat de travail', group: 'Documents salariés', kind: 'doc', title: DOC_LABEL.certificat,
      body: paras('Je soussigné·e {{signataire}}, {{signataire_titre}}, certifie que {{salarie}} a été employé·e par la société {{entreprise}} du {{date_entree}} au {{dernier_jour}}, en qualité de {{poste}}.',
        '{{salarie}} quitte la société libre de tout engagement. Il·elle bénéficie du maintien de ses garanties santé et prévoyance dans les conditions prévues par la loi (portabilité).') + SIG,
      required: [['salarie', 'Salarié'], ['date_entree', 'Date d’entrée'], ['dernier_jour', 'Date de sortie'], ['poste', 'Emploi occupé'], ['kw:portabilité', 'Mention de la portabilité des garanties']] },
    solde: { label: 'Reçu pour solde de tout compte', group: 'Documents salariés', kind: 'doc', title: DOC_LABEL.solde,
      body: paras('Je soussigné·e {{salarie}} reconnais avoir reçu de la société {{entreprise}}, pour solde de tout compte, la somme brute de {{solde_total}}, détaillée ci-dessous :', '{{solde_detail}}',
        'Ce reçu peut être dénoncé dans les six mois qui suivent sa signature, délai au-delà duquel il devient libératoire pour l’employeur pour les sommes qui y sont mentionnées.') + SIG + '<p class="sig">Signature du salarié</p>',
      required: [['solde_detail', 'Détail des sommes versées'], ['kw:six mois', 'Délai de dénonciation de six mois']] },
    'france-travail': { label: 'Attestation employeur France Travail', group: 'Documents salariés', kind: 'doc', title: DOC_LABEL['france-travail'],
      body: paras('Attestation destinée à France Travail concernant {{salarie}}, employé·e du {{date_entree}} au {{dernier_jour}} en qualité de {{poste}}. Motif de fin de contrat : {{motif_depart}}.', 'En pratique, cette attestation est transmise par voie dématérialisée via la DSN.') + SIG,
      required: [['dernier_jour', 'Date de fin de contrat'], ['motif_depart', 'Motif de la rupture']] },
    proposition: { label: 'Proposition d’embauche (lettre)', group: 'Courriers aux candidats', kind: 'doc', title: 'Proposition d’embauche',
      body: paras('<b>À l’attention de {{candidat}}</b>', '<b>Objet : proposition d’embauche – offre de contrat de travail</b>', 'Madame, Monsieur,', 'Suite à nos échanges, nous avons le plaisir de vous proposer de rejoindre {{entreprise}} aux conditions suivantes :',
        '<ul><li>Poste : {{offre}}, au sein du service {{offre_service}}, rattaché à {{proposition_manager}}</li><li>Contrat : {{proposition_contrat}}</li><li>Lieu de travail : {{offre_lieu}}</li><li>Rémunération annuelle brute : {{proposition_salaire}}, versée en 12 mensualités</li><li>Date d’entrée : {{proposition_date_entree}}</li></ul>',
        'Une période d’essai s’appliquera conformément à la convention collective. Cette offre est valable jusqu’au {{proposition_limite}}. Elle peut être retirée tant que vous ne l’avez pas acceptée ; votre acceptation avant cette date vaut conclusion du contrat de travail.', 'Nous serions ravis de vous compter parmi nous.') + '<p class="sig"><b>{{signataire}}</b><br>{{signataire_titre}}</p>',
      required: [['offre', 'Emploi proposé'], ['proposition_salaire', 'Rémunération'], ['proposition_date_entree', 'Date d’entrée'], ['proposition_limite', 'Délai de réponse']] },
    'msg-ack': { label: 'Accusé de réception', group: 'Courriers aux candidats', kind: 'msg', subject: 'Nous avons bien reçu votre candidature',
      body: paras('Bonjour {{candidat_prenom}},', 'Merci pour votre candidature au poste de {{offre}}. Nous l’étudions et reviendrons vers vous sous {{delai_reponse}}.', '{{rgpd}}', 'L’équipe RH de {{entreprise}}'), required: [['rgpd', 'Information sur les données personnelles (RGPD)']] },
    'msg-point': { label: 'Point d’étape', group: 'Courriers aux candidats', kind: 'msg', subject: 'Votre candidature est toujours à l’étude',
      body: paras('Bonjour {{candidat_prenom}},', 'Nous revenons vers vous au sujet de votre candidature au poste de {{offre}} : elle est toujours à l’étude. Nous vous tiendrons informé·e de la suite d’ici une semaine.', 'L’équipe RH de {{entreprise}}') },
    'msg-convocation': { label: 'Convocation à un entretien', group: 'Courriers aux candidats', kind: 'msg', subject: 'Invitation à un entretien',
      body: paras('Bonjour {{candidat_prenom}},', 'Nous avons le plaisir de vous inviter à un {{entretien_type}} pour le poste de {{offre}}, le {{entretien_date}} à {{entretien_heure}}, avec {{entretien_avec}}.', 'Merci de nous confirmer votre disponibilité.', 'L’équipe RH de {{entreprise}}'),
      required: [['entretien_date', 'Date de l’entretien'], ['entretien_heure', 'Heure']] },
    'msg-refus': { label: 'Réponse négative', group: 'Courriers aux candidats', kind: 'msg', subject: 'Votre candidature chez {{entreprise}}',
      body: paras('Bonjour {{candidat_prenom}},', 'Merci pour l’intérêt que vous portez à {{entreprise}}. Après étude, nous ne donnons pas suite à votre candidature au poste de {{offre}}. Motif : {{motif_refus}}.', '{{vivier}}', 'L’équipe RH de {{entreprise}}'),
      required: [['vivier', 'Information sur la conservation des données']] },
    'msg-proposition': { label: 'Envoi de la proposition', group: 'Courriers aux candidats', kind: 'msg', subject: 'Notre proposition d’embauche',
      body: paras('Bonjour {{candidat_prenom}},', 'Nous avons le plaisir de vous proposer le poste de {{offre}} ({{proposition_contrat}}), avec une rémunération annuelle brute de {{proposition_salaire}} et une prise de poste le {{proposition_date_entree}}. Vous trouverez notre proposition détaillée ci-jointe.', 'Merci de nous faire part de votre réponse avant le {{proposition_limite}}.', 'L’équipe RH de {{entreprise}}') },
    'msg-prolongation': { label: 'Prolongation de la proposition', group: 'Courriers aux candidats', kind: 'msg', subject: 'Notre proposition est prolongée',
      body: paras('Bonjour {{candidat_prenom}},', 'Notre proposition reste valable jusqu’au {{proposition_limite}}. N’hésitez pas à nous contacter pour en parler.', 'L’équipe RH de {{entreprise}}') },
    'msg-retrait': { label: 'Retrait de la proposition', group: 'Courriers aux candidats', kind: 'msg', subject: 'Retrait de notre proposition',
      body: paras('Bonjour {{candidat_prenom}},', 'Nous vous informons que nous retirons notre proposition pour le poste de {{offre}}. Nous reviendrons vers vous rapidement.', 'L’équipe RH de {{entreprise}}') },
    'msg-opportunite': { label: 'Nouvelle opportunité (vivier)', group: 'Courriers aux candidats', kind: 'msg', subject: 'Une nouvelle opportunité chez {{entreprise}}',
      body: paras('Bonjour {{candidat_prenom}},', 'Votre profil nous a marqués lors d’un précédent recrutement. Le poste de {{offre}} pourrait vous intéresser : seriez-vous disponible pour en parler ?', 'L’équipe RH de {{entreprise}}') },
  };
  const TPL_GROUPS = ['Documents salariés', 'Courriers aux candidats'];
  // Modèle en vigueur : version enregistrée par les RH, sinon le modèle d'origine.
  function tplOf(key) {
    const base = DEFAULT_TPL[key], own = (db.templates || {})[key];
    return Object.assign({ fields: [], required: [], v: 1, versions: [] }, base, own ? { body: own.body, subject: own.subject ?? base.subject, fields: own.fields, v: own.v, versions: own.versions, title: own.title || base.title } : {});
  }
  const CONTRACT_TPL = { CDI: 'contrat-cdi', CDD: 'contrat-cdd', Alternance: 'contrat-apprentissage', Stage: 'convention-stage' };
  const tplKeyFor = (kind, e) => (kind === 'contrat' ? CONTRACT_TPL[e.contract] || 'contrat-cdi' : kind);
  // Valeurs des champs automatiques pour un salarié (et un document) ou un candidat.
  function docCtx(e, d = {}) {
    const rh = emp(db.settings.company.signataire) || emp('e1'), t = e && trialInfo(e), m = e && e.exit;
    const ctx = Object.assign({}, COMPANY, { signataire: fullName(rh), signataire_titre: rh.title, date_jour: longDate(d.date || TODAY) });
    if (e) Object.assign(ctx, { salarie: fullName(e), prenom: e.firstName, nom: e.lastName, naissance: longDate(e.birthDate), nationalite: e.nationality, adresse: e.address, poste: e.title, service: e.dept, manager: e.managerId ? fullName(emp(e.managerId)) : '',
      contrat: e.contract, categorie: e.category, salaire: eur0(e.salary), salaire_mensuel: eur(e.salary / 12), date_entree: longDate(e.startDate), date_fin: longDate(e.endDate), lieu: e.location, essai: t ? t.label : 'aucune', essai_fin: t ? longDate(t.end) : '',
      anciennete: seniority(e.startDate), dernier_jour: m ? longDate(m.lastDay) : '', motif_depart: m ? m.reason : '' });
    if (d.data) Object.assign(ctx, { nouveau_poste: d.data.title, nouveau_service: d.data.dept, nouveau_salaire: eur0(d.data.salary), date_effet: longDate(d.data.effective) });
    if (e && d.kind === 'solde') {
      const lastM = monthKey(m ? m.lastDay : TODAY), p = calcPay(e, lastM), ind = exitIndemnities(e);
      const rows = [[`Salaire du dernier mois (${monthLabel(lastM).toLowerCase()})`, p.gross], [`Indemnité compensatrice de congés payés (${e.cp} j)`, ind.cpPay]].concat(ind.legal ? [['Indemnité de rupture', ind.legal]] : [], ind.precarite ? [['Indemnité de fin de contrat (10 %)', ind.precarite]] : []);
      const tot = rows.reduce((s, r) => s + r[1], 0);
      ctx.solde_total = eur(tot);
      ctx.solde_detail = { html: `<table><tbody>${rows.map(([l, v]) => `<tr><td>${esc(l)}</td><td class="r num">${eur(v)}</td></tr>`).join('')}<tr><td><b>Total brut</b></td><td class="r num"><b>${eur(tot)}</b></td></tr></tbody></table>` };
    }
    return ctx;
  }
  function candCtx(c, j, x = {}) {
    const o = x.offer || c.offer, iv = x.iv;
    return Object.assign(docCtx(null), { candidat: c.name, candidat_prenom: firstName(c), offre: (o && o.title) || j.title, offre_service: j.dept, offre_lieu: j.location, rgpd: RGPD_NOTE, delai_reponse: `${ANSWER_DAYS} jours`, suppression_donnees: longDate(addYears(TODAY, RETENTION_YEARS)),
      motif_refus: x.reason ? x.reason.charAt(0).toLowerCase() + x.reason.slice(1) : '',
      vivier: x.pool ? `Nous conservons votre dossier dans notre vivier pour vous proposer de futures opportunités. Il sera supprimé automatiquement le ${longDate(addYears(TODAY, RETENTION_YEARS))}, sauf nouvel échange. Vous pouvez vous y opposer en répondant simplement à ce message.`
        : `Nous ne vous recontacterons pas pour d’autres offres. Votre dossier sera supprimé automatiquement au plus tard le ${longDate(addYears(TODAY, RETENTION_YEARS))}.`,
      entretien_type: iv ? iv.kind.toLowerCase() : '', entretien_date: iv ? fmtDate(iv.date.slice(0, 10), { weekday: 'long', day: 'numeric', month: 'long' }) : '', entretien_heure: iv ? iv.date.slice(11, 16) : '', entretien_avec: iv ? fullName(emp(iv.with)) : '',
      proposition_contrat: o ? o.contract : '', proposition_salaire: o ? eur0(o.salary) : '', proposition_date_entree: o ? longDate(o.startDate) : '', proposition_limite: o ? longDate(o.deadline) : '', proposition_manager: o ? fullName(emp(o.managerId)) : '' });
  }
  // Remplace les champs : valeur connue → texte ; valeur manquante ou champ à saisir → zone jaune à compléter.
  function fillTpl(body, ctx, fields = []) {
    return body.replace(/\{\{(saisie:)?([\w-]+)\}\}/g, (all, s, k) => {
      if (s) { const f = fields.find((x) => x.id === k); const l = f ? f.label : k; return `<mark class="fill" data-f="saisie:${k}" data-l="${esc(l)}">[${esc(l)}]</mark>`; }
      const v = ctx[k];
      if (v && typeof v === 'object') return v.html;
      return v ? esc(v) : `<mark class="fill" data-f="${k}" data-l="${esc(TOKEN_LABEL[k] || k)}">[${esc(TOKEN_LABEL[k] || k)}]</mark>`;
    });
  }
  const htmlToText = (h) => { const div = document.createElement('div'); div.innerHTML = h.replace(/<\/(p|h3|li)>/g, '\n\n').replace(/<br\s*\/?>/g, '\n'); return div.textContent.replace(/\n{3,}/g, '\n\n').trim(); };
  // Message au candidat issu de son modèle : [objet, texte].
  const tplMsg = (key, ctx) => { const t = tplOf(key); return [htmlToText(fillTpl(esc(t.subject || ''), ctx)), htmlToText(fillTpl(t.body, ctx, t.fields))]; };
  const tplText = (key, ctx) => tplMsg(key, ctx)[1];
  // Champs requis manquants dans un modèle.
  const tplMissing = (body, req) => req.filter(([k]) => (k.startsWith('kw:') ? !body.toLowerCase().includes(k.slice(3)) : !body.includes(`{{${k}}}`)));

  const docLocked = (d) => ['Remis', 'Signé'].includes(d.status || 'Remis');
  const docVisible = (d) => (d.status || 'Remis') !== 'Brouillon';
  const DOC_STATUS_PILL = { Brouillon: 'warn', Envoyé: 'info', Remis: 'ok', Signé: 'ok' };
  function docBody(d) {
    const e = emp(d.empId), t = tplOf(tplKeyFor(d.kind, e));
    const head = `<header>${COMPANY.logo ? `<img class="doc-logo" src="${COMPANY.logo}" alt="">` : ''}<b>${esc(COMPANY.entreprise)}</b><span>${esc(COMPANY.entreprise_adresse)} · SIRET ${esc(COMPANY.siret)}</span></header><h2>${esc(d.docTitle || t.title || DOC_LABEL[d.kind])}</h2>`;
    return `${head}<div class="doc-body">${d.html || fillTpl(t.body, docCtx(e, d), t.fields)}</div>${d.kind === 'contrat' ? contractSig(d, e) : ''}`;
  }
  // Signature du salarié apposée sur son contrat (tracé manuscrit), ou mention de l'exemplaire signé.
  function contractSig(d, e) {
    if (d.signature) return `<div class="sig-block"><span>Le salarié, « lu et approuvé »</span><img src="${d.signature.img}" alt="Signature de ${esc(d.signature.name)}"><small>Signé par ${esc(d.signature.name)} le ${fmtDate(d.signature.date)}</small></div>`;
    const c = db.onboarding && db.onboarding[e.id] && db.onboarding[e.id].contract;
    if (c && c.docId === d.id && c.status !== 'Signé') return '<div class="sig-block wait"><span>Le salarié, « lu et approuvé »</span><small>Signature en attente</small></div>';
    return `<div class="sig-block"><span>Le salarié, « lu et approuvé »</span><small>Exemplaire signé${c && c.paper ? ' sur papier' : ''}, conservé au dossier du personnel</small></div>`;
  }
  // Nouveau document : le texte du modèle est copié et rempli ; il reste un brouillon modifiable jusqu'à sa remise.
  function addDoc(empId, kind, extra = {}) {
    const e = emp(empId), key = tplKeyFor(kind, e), t = tplOf(key);
    const d = Object.assign({ id: uid('doc'), empId, kind, title: DOC_LABEL[kind], date: TODAY, status: 'Brouillon', tpl: key, tplV: t.v, docTitle: t.title }, extra);
    if (kind === 'contrat') d.title = t.title;
    d.html = fillTpl(t.body, docCtx(e, d), t.fields);
    db.documents.push(d); return d;
  }
  // Un document créé avant les modèles n'a pas de texte enregistré : il reprend celui de son modèle.
  function ensureDocHtml(d) { if (d.html) return; const e = emp(d.empId), t = tplOf(tplKeyFor(d.kind, e)); d.html = fillTpl(t.body, docCtx(e, d), t.fields); d.tpl = d.tpl || tplKeyFor(d.kind, e); d.tplV = d.tplV || t.v; }
  const docGaps = (html) => { const div = document.createElement('div'); div.innerHTML = html; return [...div.querySelectorAll('mark.fill')].filter((m) => !m.textContent.trim() || m.textContent.trim() === `[${m.dataset.l}]`).map((m) => m.dataset.l); };
  const unmark = (html) => html.replace(/<mark class="fill"[^>]*>([\s\S]*?)<\/mark>/g, '$1');
  // Remise (ou envoi pour signature) d'un document : il devient visible du salarié ; une fois remis ou signé, il est figé.
  function issueDoc(d, quiet) {
    ensureDocHtml(d);
    const gaps = docGaps(d.html || ''); if (gaps.length) return `Complétez d’abord : ${gaps.slice(0, 3).join(', ')}${gaps.length > 3 ? '…' : ''}.`;
    const e = emp(d.empId), x = e && db.onboarding && db.onboarding[e.id];
    d.html = unmark(d.html); d.issuedAt = TODAY; d.issuedBy = me().id;
    if (d.kind === 'contrat') { d.status = 'Envoyé'; const c = dossier(e).contract; Object.assign(c, { status: 'Envoyé', sentAt: TODAY }); notify(e.id, 'Votre contrat de travail est prêt : signez-le dans l’onglet « Contrat de travail ».'); return ''; }
    d.status = 'Remis';
    if (['info7', 'info1m'].includes(d.kind) && x) { x[d.kind] = TODAY; x[d.kind + 'Doc'] = d.id; }
    if (d.reqId) { const r = offb(e).requests.find((q) => q.id === d.reqId); if (r) Object.assign(r, { status: 'Traitée', doneAt: TODAY }); }
    if (!quiet) notify(e.id, `${d.title} : document disponible dans vos documents.`);
    return '';
  }
  function docsList(e, canGenerate) {
    const rh = ui.profile === 'rh', list = db.documents.filter((d) => d.empId === e.id && (rh || docVisible(d))).sort((a, b) => b.date.localeCompare(a.date));
    return `${canGenerate ? `<div class="toolbar"><button type="button" class="btn ghost sm" data-act="doc-gen" data-id="${e.id}" data-k="attestation">${ic('plus')}Attestation employeur</button>${rh && e.stage >= 13 ? `<button type="button" class="btn ghost sm" data-act="doc-gen" data-id="${e.id}" data-k="certificat">${ic('plus')}Certificat de travail</button>` : ''}</div>` : ''}
      <div class="card"><div class="req-list">${list.map((d) => `<div class="req"><span class="doc-ic">${ic('file')}</span><div class="what"><b>${esc(d.title)}</b><small>${fmtDate(d.date)}</small></div>${rh ? `<span class="pill ${DOC_STATUS_PILL[d.status || 'Remis']}">${d.status || 'Remis'}</span>` : ''}
        ${rh && !docLocked(d) ? `<button type="button" class="btn primary sm" data-act="doc-edit" data-id="${d.id}">${ic('edit')}Relire et modifier</button>` : `<button type="button" class="btn ghost sm" data-act="doc-view" data-id="${d.id}">Consulter</button>`}</div>`).join('') || '<div class="empty">Aucun document.</div>'}</div></div>`;
  }
  const docBtn = (d, label = 'Voir') => (d ? (ui.profile === 'rh' && !docLocked(d) ? `<button type="button" class="btn ${d.status === 'Brouillon' ? 'primary' : 'ghost'} sm" data-act="doc-edit" data-id="${d.id}">${ic('edit')}${d.status === 'Brouillon' ? 'Relire et remettre' : 'Modifier'}</button>` : `<button type="button" class="btn ghost sm" data-act="doc-view" data-id="${d.id}">${label}</button>`) : '');
  MODALS.doc = (m, shell) => { const d = db.documents.find((x) => x.id === m.id);
    return shell(esc(d.title), `<div class="modal-b"><article class="letter locked">${docBody(d)}</article>${d.issuedAt || d.signedAt ? `<p class="hint" style="margin:10px 0 0">${d.status === 'Signé' ? `${d.signature ? `Signé à la main par ${esc(d.signature.name)}` : 'Signé'} le ${fmtDate(d.signedAt || d.issuedAt)}` : `${d.status === 'Envoyé' ? 'Envoyé pour signature' : 'Remis'} le ${fmtDate(d.issuedAt)}`}${d.tplV ? ` · modèle version ${d.tplV}` : ''} · ${docLocked(d) ? 'document figé' : 'encore modifiable par les RH'}</p>` : ''}</div>`,
      `<div class="modal-f">${ui.profile === 'rh' && !docLocked(d) ? `<button type="button" class="btn ghost" data-act="doc-edit" data-id="${d.id}">${ic('edit')}Modifier</button>` : ''}<button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>`, true); };
  // Édition d'un document par les RH : champs à compléter en haut, texte librement modifiable en dessous.
  MODALS['doc-edit'] = (m, shell, ...rest) => {
    if (docLocked(db.documents.find((x) => x.id === m.id))) return MODALS.doc(m, shell, ...rest);
    const d = db.documents.find((x) => x.id === m.id), e = emp(d.empId), div = document.createElement('div'); ensureDocHtml(d); div.innerHTML = d.html;
    const marks = [...new Map([...div.querySelectorAll('mark.fill')].map((x) => [x.dataset.f, x])).values()];
    const fields = marks.map((x) => { const val = x.textContent.trim() === `[${x.dataset.l}]` ? '' : x.textContent.trim();
      return `<div class="field"><label for="df-${esc(x.dataset.f)}">${esc(x.dataset.l)}</label><input id="df-${esc(x.dataset.f)}" class="input" value="${esc(val)}" data-docf="${esc(x.dataset.f)}" placeholder="À compléter"></div>`; }).join('');
    const issue = d.kind === 'contrat' ? (d.status === 'Envoyé' ? '' : 'Envoyer pour signature') : 'Valider et remettre au salarié';
    return shell(`${esc(d.title)} · ${esc(fullName(e))}`, `<div class="modal-b"><p class="hint" style="margin:0 0 12px">${d.status === 'Envoyé' ? 'Envoyé pour signature : vous pouvez encore le modifier tant que le salarié ne l’a pas signé ; il sera prévenu de la mise à jour.' : 'Brouillon visible des RH seulement. Complétez les zones jaunes et retouchez le texte si besoin ; une fois remis ou signé, le document ne pourra plus être modifié.'}</p>
      ${fields ? `<div class="form-grid doc-fields">${fields}</div>` : ''}<article class="letter doc-ed"><header><b>${COMPANY.entreprise}</b><span>${COMPANY.entreprise_adresse}</span></header><h2>${esc(d.docTitle || d.title)}</h2><div id="doc-ed" contenteditable="true" spellcheck="true">${d.html || ''}</div></article><p class="err" id="m-err" aria-live="polite">${m.err ? esc(m.err) : ''}</p></div>`,
      `<div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Annuler</button><button type="button" class="btn ghost" data-act="doc-save" data-id="${d.id}">Enregistrer</button>${issue ? `<button type="button" class="btn primary" data-act="doc-issue" data-id="${d.id}">${issue}</button>` : ''}</div>`, true);
  };
  function bindDocImages() { const ed = document.getElementById('doc-ed'); if (ed) bindImages(ed, () => {}); }
  function bindDocEditor() {
    const ed = document.getElementById('doc-ed'); if (!ed) return; bindDocImages();
    document.querySelectorAll('[data-docf]').forEach((inp) => inp.addEventListener('input', () => {
      ed.querySelectorAll(`mark.fill[data-f="${CSS.escape(inp.dataset.docf)}"]`).forEach((mk) => { mk.textContent = inp.value.trim() || `[${mk.dataset.l}]`; });
    }));
  }
  function saveDocEditor(d) { const ed = document.getElementById('doc-ed'); if (ed) { const c = ed.cloneNode(true); c.querySelectorAll('.tpl-img-h, .tpl-img-x').forEach((x) => x.remove()); d.html = sanitizeHTML(c.innerHTML); } d.editedAt = TODAY; d.editedBy = me().id; }
  // Ne garde que la mise en forme simple (paragraphes, titres, gras, listes, tableaux, zones à compléter).
  const imgPos = (f) => { const n = (v, d) => { const x = parseFloat(v); return Number.isFinite(x) ? Math.round(x * 10) / 10 : d; }; return { x: Math.min(95, Math.max(0, n(f.style.left, 0))), y: Math.max(0, n(f.style.top, 0)), w: Math.min(100, Math.max(5, n(f.style.width, 30))) }; };
  function sanitizeHTML(html) {
    const OK = new Set(['P', 'H3', 'H4', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'BR', 'TABLE', 'TBODY', 'TR', 'TD', 'TH', 'MARK', 'SPAN', 'DIV', 'Q', 'FIGURE', 'IMG']);
    const root = document.createElement('div'); root.innerHTML = html;
    const walk = (n) => [...n.childNodes].forEach((c) => {
      if (c.nodeType === 8) { c.remove(); return; }
      if (c.nodeType !== 1) return;
      if (!OK.has(c.tagName)) { walk(c); c.replaceWith(...c.childNodes); return; }
      // Images des modèles : seulement des images intégrées, positionnées librement (gauche et largeur en %, haut en px).
      if (c.tagName === 'IMG') { const src = c.getAttribute('src') || ''; if (!src.startsWith('data:image/')) { c.remove(); return; } [...c.attributes].forEach((a) => { if (!['src', 'alt'].includes(a.name)) c.removeAttribute(a.name); }); return; }
      if (c.tagName === 'FIGURE') { const st = imgPos(c); [...c.attributes].forEach((a) => c.removeAttribute(a.name)); c.className = 'tpl-img'; c.setAttribute('contenteditable', 'false'); c.setAttribute('style', `left:${st.x}%;top:${st.y}px;width:${st.w}%`); [...c.children].forEach((k) => { if (k.tagName !== 'IMG') k.remove(); }); walk(c); if (!c.querySelector('img')) c.remove(); return; }
      [...c.attributes].forEach((a) => { if (!['class', 'data-f', 'data-l', 'data-k'].includes(a.name)) c.removeAttribute(a.name); });
      if (c.tagName === 'DIV' && !c.className) { const p = document.createElement('p'); p.append(...c.childNodes); c.replaceWith(p); walk(p); return; }
      walk(c);
    });
    walk(root); return root.innerHTML;
  }
  Object.assign(MOD_ACT, {
    'doc-view'(d) { ui.modal = { type: 'doc', id: d.id }; render(); },
    'doc-edit'(d) { const doc = db.documents.find((x) => x.id === d.id); if (doc && docLocked(doc)) { ui.modal = { type: 'doc', id: doc.id }; toast(doc.status === 'Signé' ? 'Document signé : il ne peut plus être modifié' : 'Document remis : il ne peut plus être modifié', 'info'); render(); return; } ui.modal = { type: 'doc-edit', id: d.id }; render(); },
    'doc-save'(d) { const doc = db.documents.find((x) => x.id === d.id); if (docLocked(doc)) { ui.modal = { type: 'doc', id: doc.id }; render(); return; } saveDocEditor(doc); if (doc.status === 'Envoyé') notify(doc.empId, `Votre ${doc.title.toLowerCase()} a été mis à jour par les RH : relisez-le avant de signer.`); ui.modal = null; toast('Document enregistré'); commit(); },
    'doc-issue'(d) {
      const doc = db.documents.find((x) => x.id === d.id); if (docLocked(doc)) { ui.modal = { type: 'doc', id: doc.id }; render(); return; } ensureDocHtml(doc); saveDocEditor(doc);
      const err = issueDoc(doc); if (err) { ui.modal = { type: 'doc-edit', id: doc.id, err }; save(); render(); return; }
      ui.modal = null; toast(doc.kind === 'contrat' ? 'Contrat envoyé pour signature' : 'Document remis au salarié · il est désormais figé'); commit();
    },
    'doc-gen'(d) {
      const doc = addDoc(d.id, d.k); tickJourney(d.id, 5, 2);
      if (ui.profile === 'salarie') { issueDoc(doc, true); notify('e1', `${fullName(me())} a généré une ${DOC_LABEL[d.k].toLowerCase()}.`); ui.modal = { type: 'doc', id: doc.id }; toast('Document généré'); }
      else { ui.modal = { type: 'doc-edit', id: doc.id }; toast('Brouillon créé : relisez-le avant de le remettre'); }
      commit();
    },
  });

  // ---- Écran « Modèles de documents » (RH)
  function viewTemplates() {
    const keys = Object.keys(DEFAULT_TPL);
    if (!DEFAULT_TPL[ui.tplSel]) ui.tplSel = null;
    // Tous les titres ; un modèle ne s'ouvre que lorsqu'on le sélectionne.
    const list = TPL_GROUPS.map((g) => `<h4 class="sub">${g}</h4>${keys.filter((k) => DEFAULT_TPL[k].group === g).map((k) => `<button type="button" class="tpl-item" data-act="tpl-sel" data-k="${k}" aria-current="${k === ui.tplSel}">${ic('file')}<span>${esc(tplOf(k).label)}</span></button>`).join('')}`).join('');
    if (!ui.tplSel) return `<p class="muted" style="margin:0">Sélectionne un modèle pour le relire et le modifier.</p>${TPL_GROUPS.map((g) => `<section class="tpl-group"><h4 class="sub">${g}</h4><div class="tpl-grid">${keys.filter((k) => DEFAULT_TPL[k].group === g).map((k) => { const x = tplOf(k);
      return `<button type="button" class="tpl-tile" data-act="tpl-sel" data-k="${k}">${ic('file')}<b>${esc(x.label)}</b></button>`; }).join('')}</div></section>`).join('')}`;
    const key = ui.tplSel, t = tplOf(key), draft = ui.tplDraft && ui.tplDraft.key === key ? ui.tplDraft : null;
    const body = draft ? draft.body : t.body, fields = draft ? draft.fields : t.fields, subject = draft ? draft.subject : t.subject;
    const chip = (k) => { const s = k.startsWith('saisie:'), f = s && fields.find((x) => x.id === k.slice(7)); return `<span class="tk ${s ? 'saisie' : ''}" contenteditable="false" data-k="${esc(k)}">${esc(s ? (f ? f.label : k.slice(7)) : TOKEN_LABEL[k] || k)}</span>`; };
    const toChips = (h) => h.replace(/\{\{((?:saisie:)?[\w-]+)\}\}/g, (a, k) => chip(k));
    const groups = [...new Set(TOKENS.map((x) => x[2]))].filter((g) => (t.group === 'Courriers aux candidats' ? !['Salarié', 'Contrat', 'Avenant', 'Départ'].includes(g) : g !== 'Candidat'));
    const miss = tplMissing(body, t.required);
    const versions = (t.versions || []).slice().reverse();
    return `<div class="rec tpl-page"><div class="tpl-list">${list}</div><div class="tpl-main">
      <div class="card"><div class="job-head"><div><div class="toolbar"><span class="pill accent">${t.kind === 'msg' ? 'Message au candidat' : 'Document'}</span><span class="muted" style="font-size:13px">Version ${t.v}${t.versions.length ? ` · enregistrée le ${fmtDate(t.versions[t.versions.length - 1].date)} par ${esc(fullName(emp(t.versions[t.versions.length - 1].by)))}` : ' · modèle d’origine'}</span>${draft ? '<span class="pill warn">Modifications non enregistrées</span>' : ''}</div><h2 style="margin-top:8px">${esc(t.label)}</h2></div>
        <div class="toolbar"><button type="button" class="btn ghost" data-act="tpl-preview">Aperçu</button><button type="button" class="btn ghost" data-act="tpl-cancel">Annuler les modifications</button><button type="button" class="btn primary" data-act="tpl-save">${ic('check')}Enregistrer une nouvelle version</button><button type="button" class="icon-btn" data-act="tpl-close" aria-label="Fermer le modèle" title="Fermer">${ic('x')}</button></div></div>
        <div class="card-b" style="border-top:1px solid var(--line)">
          ${t.kind === 'msg' ? `<div class="field" style="margin-bottom:12px"><label for="tpl-subj">Objet du message</label><input id="tpl-subj" class="input" value="${esc(subject || '')}" data-tpl-subj></div>` : `<div class="field" style="margin-bottom:12px"><label for="tpl-title">Titre du document</label><input id="tpl-title" class="input" value="${esc(draft ? draft.title : t.title)}" data-tpl-title></div>`}
          <div class="ed-bar" role="toolbar" aria-label="Mise en forme">${t.kind === 'msg' ? '' : `<label class="btn ghost sm upload ed-img-btn" title="Insérer une image (logo, tampon, signature…)">${ic('image')}Image<input type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml" data-change="ed-image" aria-label="Insérer une image"></label><span class="ed-sep"></span>`}
            <button type="button" class="btn ghost sm" data-act="ed-cmd" data-c="h3">Titre</button><button type="button" class="btn ghost sm" data-act="ed-cmd" data-c="p">Paragraphe</button><button type="button" class="btn ghost sm" data-act="ed-cmd" data-c="bold"><b>G</b></button><button type="button" class="btn ghost sm" data-act="ed-cmd" data-c="ul">Liste</button>
            <span class="ed-sep"></span><label class="sr" for="ed-token">Insérer un champ automatique</label><select id="ed-token" class="select sm" data-change="ed-token"><option value="">Insérer un champ…</option>${groups.map((g) => `<optgroup label="${g}">${TOKENS.filter((x) => x[2] === g).map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</optgroup>`).join('')}</select>
            <span class="ed-sep"></span><label class="sr" for="ed-field">Nouveau champ à saisir</label><span class="ed-combo"><input id="ed-field" class="input sm" placeholder="Champ à saisir, ex. Horaires" maxlength="60" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="ed-sugg"><ul id="ed-sugg" class="ed-sugg" role="listbox" hidden></ul></span><button type="button" class="btn ghost sm" data-act="ed-field">${ic('plus')}Ajouter</button></div>
          <div id="tpl-ed" class="tpl-ed ${t.kind === 'msg' ? 'msg' : 'letter'}" contenteditable="true" spellcheck="true" data-key="${key}">${toChips(body)}</div>
          <div id="tpl-lint">${tplLintHTML(miss)}</div>
          <p class="hint" style="margin:10px 0 0"><span class="tk sm">Champ automatique</span> rempli depuis le dossier · <span class="tk saisie sm">Champ à saisir</span> complété par les RH à la création du document. Un document déjà remis ou signé garde la version qui a servi.</p></div></div>
      ${card('Versions', `<span class="muted num" style="font-size:13px">${plural(t.v, 'version', 'versions')}</span>`, `<div class="card-b">${versions.map((x) => `<div class="todo"><div class="t"><b>Version ${x.v}${x.v === t.v ? ' · en vigueur' : ''}</b><small>${fmtDate(x.date)} · ${esc(fullName(emp(x.by)))}${x.note ? ` · ${esc(x.note)}` : ''}</small></div>${x.v === t.v ? '' : `<button type="button" class="btn ghost sm" data-act="tpl-restore" data-v="${x.v}">Rétablir</button>`}</div>`).join('')}
        <div class="todo"><div class="t"><b>Version 1 · modèle d’origine</b><small>Fourni avec Teamora</small></div>${t.v === 1 ? '' : '<button type="button" class="btn ghost sm" data-act="tpl-restore" data-v="0">Rétablir</button>'}</div></div>`)}</div></div>`;
  }
  const tplLintHTML = (miss) => (miss.length ? `<div class="lint bad"><b>${ic('x')}Mentions obligatoires manquantes</b>${miss.map(([k, l]) => `<p>${esc(l)}${k.startsWith('kw:') ? ` (mention « ${esc(k.slice(3))} »)` : ''}</p>`).join('')}</div>` : `<div class="lint ok"><b>${ic('check')}Toutes les mentions obligatoires sont présentes</b></div>`);
  // Lecture de l'éditeur : pastilles → {{clé}}.
  function readTplEditor() {
    const ed = document.getElementById('tpl-ed'); if (!ed) return null;
    const clone = ed.cloneNode(true); clone.querySelectorAll('.tk').forEach((s) => s.replaceWith(`{{${s.dataset.k}}}`)); clone.querySelectorAll('.tpl-img-h, .tpl-img-x').forEach((x) => x.remove());
    const prev = ui.tplDraft && ui.tplDraft.key === ed.dataset.key ? ui.tplDraft : tplOf(ed.dataset.key);
    const subj = document.querySelector('[data-tpl-subj]'), title = document.querySelector('[data-tpl-title]');
    return { key: ed.dataset.key, body: sanitizeHTML(clone.innerHTML), fields: (prev.fields || []).slice(), subject: subj ? subj.value : prev.subject, title: title ? title.value : prev.title };
  }
  // Suggestions du champ « Champ à saisir » : champs déjà utilisés dans les modèles, champs courants, et champs automatiques.
  const COMMON_FIELDS = ['Contrat (CDI, CDD, apprentissage, stage)', 'Motif précis du recours au CDD', 'Personne remplacée', 'Horaires de travail', 'Clause de mobilité', 'Clause de non-concurrence', 'Clause de confidentialité',
    'Clause d’exclusivité', 'Avantages en nature', 'Prime d’objectifs', 'Durée du préavis', 'Date de l’entretien préalable', 'Lieu de l’entretien', 'Motif du licenciement', 'Établissement de formation', 'Maître d’apprentissage', 'Tuteur dans l’entreprise', 'Commentaire libre'];
  const fold = (x) => String(x).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const slug = (label) => fold(label).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || uid('f');
  function fieldSuggestions(q) {
    const t = fold(q.trim()); if (!t) return [];
    const used = Object.keys(DEFAULT_TPL).flatMap((k) => tplOf(k).fields.map((f) => f.label));
    const match = (l) => { const f = fold(l); return f.startsWith(t) ? 0 : f.split(/[^a-z0-9]+/).some((w) => w.startsWith(t)) ? 1 : f.includes(t) ? 2 : -1; };
    const saisies = [...new Set(used.concat(COMMON_FIELDS))].map((l) => ({ kind: 'saisie', label: l, rank: match(l) }));
    const autos = TOKENS.map(([k, l]) => ({ kind: 'auto', k, label: l, rank: match(l) }));
    return saisies.concat(autos).filter((x) => x.rank >= 0).sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label, 'fr')).slice(0, 8);
  }
  function addSaisie(label) {
    const r = readTplEditor(), id = slug(label);
    if (!r.fields.some((f) => f.id === id)) r.fields.push({ id, label }); ui.tplDraft = r;
    const s = document.createElement('span'); s.className = 'tk saisie'; s.contentEditable = 'false'; s.dataset.k = `saisie:${id}`; s.textContent = label; insertAtCaret(s);
  }
  function addAuto(k) { const s = document.createElement('span'); s.className = 'tk'; s.contentEditable = 'false'; s.dataset.k = k; s.textContent = TOKEN_LABEL[k]; insertAtCaret(s); }
  function closeSugg() { const ul = document.getElementById('ed-sugg'), inp = document.getElementById('ed-field'); if (ul) { ul.hidden = true; ul.innerHTML = ''; } if (inp) { inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); } }
  function bindFieldCombo() {
    const inp = document.getElementById('ed-field'), ul = document.getElementById('ed-sugg'); if (!inp || !ul) return;
    let list = [], cur = -1;
    const pick = (x) => { if (x.kind === 'auto') addAuto(x.k); else addSaisie(x.label); inp.value = ''; closeSugg(); };
    const draw = () => {
      list = fieldSuggestions(inp.value); cur = list.length ? 0 : -1;
      const q = inp.value.trim(), exact = list.some((x) => x.kind === 'saisie' && fold(x.label) === fold(q));
      ul.innerHTML = list.map((x, k) => `<li id="sg-${k}" role="option" data-k="${k}" aria-selected="${k === cur}" class="${x.kind}"><span>${esc(x.label)}</span><small>${x.kind === 'auto' ? 'Champ automatique' : 'Champ à saisir'}</small></li>`).join('')
        + (q && !exact ? `<li role="option" data-k="new" class="new" aria-selected="${cur === -1}"><span>Créer « ${esc(q)} »</span><small>Nouveau champ à saisir</small></li>` : '');
      ul.hidden = !ul.children.length; inp.setAttribute('aria-expanded', String(!ul.hidden));
    };
    const mark = () => { [...ul.children].forEach((li, k) => li.setAttribute('aria-selected', String(Number(li.dataset.k) === cur || (li.dataset.k === 'new' && cur === list.length)))); };
    inp.addEventListener('input', draw);
    inp.addEventListener('keydown', (ev) => {
      if (ul.hidden) return;
      const max = ul.querySelector('.new') ? list.length : list.length - 1;
      if (ev.key === 'ArrowDown') { ev.preventDefault(); cur = Math.min(max, cur + 1); mark(); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); cur = Math.max(0, cur - 1); mark(); }
      else if (ev.key === 'Enter') { ev.preventDefault(); if (list[cur]) pick(list[cur]); else if (inp.value.trim()) { addSaisie(inp.value.trim()); inp.value = ''; closeSugg(); } }
      else if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); closeSugg(); }
    });
    ul.addEventListener('mousedown', (ev) => { ev.preventDefault(); const li = ev.target.closest('li'); if (!li) return; if (li.dataset.k === 'new') { addSaisie(inp.value.trim()); inp.value = ''; closeSugg(); } else pick(list[Number(li.dataset.k)]); });
    inp.addEventListener('blur', () => setTimeout(closeSugg, 120));
  }
  let edRange = null;
  function bindTplEditor() {
    const ed = document.getElementById('tpl-ed'); if (!ed) return;
    const keep = () => { const s = window.getSelection(); if (s.rangeCount && ed.contains(s.anchorNode)) edRange = s.getRangeAt(0).cloneRange(); };
    ed.addEventListener('keyup', keep); ed.addEventListener('mouseup', keep);
    const sync = () => { const r = readTplEditor(); ui.tplDraft = r; document.getElementById('tpl-lint').innerHTML = tplLintHTML(tplMissing(r.body, tplOf(r.key).required)); };
    ed.addEventListener('input', sync);
    document.querySelectorAll('[data-tpl-subj], [data-tpl-title]').forEach((x) => x.addEventListener('input', sync));
    bindFieldCombo(); bindImages(ed, sync);
  }
  // Images librement placées : glisser pour déplacer, poignée pour redimensionner, × ou Suppr pour retirer, flèches pour ajuster.
  function bindImages(ed, onChange) {
    const tools = (f) => { if (!f.querySelector('.tpl-img-h')) f.insertAdjacentHTML('beforeend', `<span class="tpl-img-h" title="Redimensionner"></span><button type="button" class="tpl-img-x" title="Retirer l’image" aria-label="Retirer l’image">${ic('x')}</button>`); f.tabIndex = 0; };
    ed.querySelectorAll('.tpl-img').forEach(tools);
    const pos = (f) => imgPos(f), set = (f, p) => { f.style.left = `${p.x}%`; f.style.top = `${p.y}px`; f.style.width = `${p.w}%`; };
    if (ed._imgBound) return; ed._imgBound = true;
    let drag = null;
    ed.addEventListener('pointerdown', (ev) => {
      const f = ev.target.closest('.tpl-img'); ed.querySelectorAll('.tpl-img.sel').forEach((x) => x !== f && x.classList.remove('sel')); if (!f) return;
      if (ev.target.closest('.tpl-img-x')) { ev.preventDefault(); f.remove(); onChange(); return; }
      ev.preventDefault(); f.classList.add('sel'); f.focus({ preventScroll: true });
      const r = ed.getBoundingClientRect(), p = pos(f);
      drag = { f, resize: !!ev.target.closest('.tpl-img-h'), x0: ev.clientX, y0: ev.clientY, p, W: r.width, H: ed.scrollHeight }; f.setPointerCapture(ev.pointerId);
    });
    ed.addEventListener('pointermove', (ev) => {
      if (!drag) return; const { f, p, W } = drag, dx = ((ev.clientX - drag.x0) / W) * 100, dy = ev.clientY - drag.y0;
      if (drag.resize) set(f, Object.assign({}, p, { w: Math.round(Math.min(100 - p.x, Math.max(5, p.w + dx)) * 10) / 10 }));
      else set(f, Object.assign({}, p, { x: Math.round(Math.min(100 - p.w, Math.max(0, p.x + dx)) * 10) / 10, y: Math.round(Math.max(0, Math.min(drag.H - 20, p.y + dy))) }));
    });
    const end = () => { if (!drag) return; drag = null; onChange(); };
    ed.addEventListener('pointerup', end); ed.addEventListener('pointercancel', end);
    ed.addEventListener('keydown', (ev) => {
      const f = ev.target.closest && ev.target.closest('.tpl-img'); if (!f) return;
      if (ev.key === 'Delete' || ev.key === 'Backspace') { ev.preventDefault(); f.remove(); onChange(); return; }
      const step = ev.shiftKey ? 10 : 1, p = pos(f), mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step * 4], ArrowDown: [0, step * 4] }[ev.key];
      if (mv) { ev.preventDefault(); set(f, Object.assign(p, { x: Math.min(100 - p.w, Math.max(0, p.x + mv[0])), y: Math.max(0, p.y + mv[1]) })); onChange(); }
    });
  }
  // Une image insérée est réduite (800 px au plus) pour rester légère dans le modèle.
  // Ré-encode une image (data URL) au côté maximal indiqué, en WebP si le navigateur le permet, sinon en JPEG.
  function shrinkImage(src, side) {
    return new Promise((resolve) => { const im = new Image(); im.onerror = () => resolve(src);
      im.onload = () => { const k = Math.min(1, side / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); const w = c.toDataURL('image/webp', 0.85); resolve(/^data:image\/webp/.test(w) ? w : c.toDataURL('image/jpeg', 0.85)); };
      im.src = src; });
  }
  function readImage(file, max = 800) {
    return new Promise((resolve, reject) => {
      if (!/^image\//.test(file.type)) { reject(new Error('Choisis une image (PNG, JPEG, GIF, WebP ou SVG).')); return; }
      const fr = new FileReader(); fr.onerror = () => reject(new Error('Image illisible.'));
      fr.onload = () => { if (file.type === 'image/svg+xml' || file.type === 'image/gif') { resolve(fr.result); return; }
        const im = new Image(); im.onerror = () => reject(new Error('Image illisible.'));
        im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); resolve(file.type === 'image/png' || file.type === 'image/webp' ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.86)); };
        im.src = fr.result; };
      fr.readAsDataURL(file);
    });
  }
  MOD_CHG['ed-image'] = async (v, d, t) => {
    const ed = document.getElementById('tpl-ed') || document.getElementById('doc-ed'), file = t.files && t.files[0]; if (!ed || !file) return;
    try {
      const src = await readImage(file); if (src.length > 900000) { toast('Image trop lourde : choisis une image plus légère.', 'info'); t.value = ''; return; }
      const er = ed.getBoundingClientRect(), r = edRange && ed.contains(edRange.startContainer) ? edRange.getBoundingClientRect() : null;
      const y = Math.max(0, Math.round((r && r.height ? r.top : er.top + 24) - er.top + ed.scrollTop));
      ed.insertAdjacentHTML('beforeend', `<figure class="tpl-img sel" contenteditable="false" style="left:60%;top:${y}px;width:30%"><img src="${src}" alt=""></figure>`);
      const f = ed.lastElementChild; t.value = '';
      bindImages(ed, () => ed.dispatchEvent(new Event('input'))); ed.dispatchEvent(new Event('input'));
      f.focus({ preventScroll: true }); toast('Image ajoutée · fais-la glisser pour la placer');
    } catch (err) { toast(err.message, 'info'); t.value = ''; }
  };
  function insertAtCaret(node) {
    const ed = document.getElementById('tpl-ed'); if (!ed) return;
    let r = edRange && ed.contains(edRange.startContainer) ? edRange : null;
    if (!r) { r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); }
    r.deleteContents(); r.insertNode(node); const sp = document.createTextNode(' '); node.after(sp);
    r.setStartAfter(sp); r.collapse(true); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); edRange = r.cloneRange();
    ed.dispatchEvent(new Event('input'));
  }
  Object.assign(MOD_ACT, {
    'tpl-sel'(d) { if (ui.tplSel === d.k) { ui.tplSel = null; ui.tplDraft = null; render(); return; } if (ui.tplDraft && ui.tplDraft.key !== d.k) ui.tplDraft = null; ui.tplSel = d.k; render(); },
    'tpl-close'() { ui.tplSel = null; ui.tplDraft = null; render(); },
    'tpl-cancel'() { ui.tplDraft = null; render(); },
    'ed-cmd'(d) {
      const ed = document.getElementById('tpl-ed'); if (!ed) return; ed.focus();
      if (edRange) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(edRange); }
      if (d.c === 'bold') document.execCommand('bold'); else if (d.c === 'ul') document.execCommand('insertUnorderedList'); else document.execCommand('formatBlock', false, d.c);
      ed.dispatchEvent(new Event('input'));
    },
    'ed-field'() { const inp = document.getElementById('ed-field'), label = inp.value.trim(); if (!label) { toast('Nommez le champ à saisir.', 'info'); return; } addSaisie(label); inp.value = ''; closeSugg(); },
    'tpl-save'() {
      const r = readTplEditor(), base = tplOf(r.key), miss = tplMissing(r.body, base.required);
      if (miss.length) { toast(`Mention obligatoire manquante : ${miss[0][1]}`, 'info'); return; }
      r.fields = r.fields.filter((f) => r.body.includes(`{{saisie:${f.id}}}`));
      db.templates = db.templates || {};
      const v = base.v + 1, versions = (base.versions || []).concat([{ v, date: TODAY, by: me().id, body: r.body, fields: r.fields, subject: r.subject, title: r.title }]);
      db.templates[r.key] = { body: r.body, fields: r.fields, subject: r.subject, title: r.title, v, versions };
      ui.tplDraft = null; toast(`Version ${v} enregistrée · elle servira aux prochains documents`); commit();
    },
    'tpl-restore'(d) {
      const key = ui.tplSel, base = tplOf(key), from = Number(d.v) ? base.versions.find((x) => x.v === Number(d.v)) : Object.assign({ fields: [] }, DEFAULT_TPL[key]);
      const v = base.v + 1; db.templates = db.templates || {};
      db.templates[key] = { body: from.body, fields: from.fields || [], subject: from.subject, title: from.title, v, versions: base.versions.concat([{ v, date: TODAY, by: me().id, body: from.body, fields: from.fields || [], subject: from.subject, title: from.title, note: `reprise de la version ${Number(d.v) || 1}` }]) };
      ui.tplDraft = null; toast(`Version ${Number(d.v) || 1} rétablie (version ${v})`); commit();
    },
    'tpl-preview'() { const r = readTplEditor(); ui.tplDraft = r; ui.modal = { type: 'tpl-preview' }; render(); },
  });
  Object.assign(MOD_CHG, {
    'ed-token'(v, d, t) { if (!v) return; addAuto(v); t.value = ''; },
  });
  MODALS['tpl-preview'] = (m, shell) => {
    const r = ui.tplDraft, t = tplOf(r.key), sample = r.key === 'avenant' ? emp('e4') : ['certificat', 'solde', 'france-travail'].includes(r.key) ? emp('e21') : r.key === 'contrat-cdd' ? emp('e12') : emp('e3');
    const c = db.candidates.find((x) => x.id === 'c4'), j = candJob(c);
    const ctx = t.group === 'Courriers aux candidats' ? candCtx(c, j, { iv: c.interviews[0], reason: REFUS_REASONS[0], pool: true }) : docCtx(sample, { kind: r.key, date: TODAY, data: r.key === 'avenant' ? { title: 'Lead Designer', dept: 'Design', salary: 60000, effective: '2027-01-01' } : null });
    const html = fillTpl(r.body, ctx, r.fields);
    const who = t.group === 'Courriers aux candidats' ? c.name : fullName(sample);
    return shell(`Aperçu · ${esc(t.label)}`, `<div class="modal-b"><p class="hint" style="margin:0 0 10px">Exemple avec ${esc(who)}. Les zones jaunes seront à compléter à la création du document.</p>${t.kind === 'msg' ? `<div class="msg-prev"><b>${esc(htmlToText(fillTpl(esc(r.subject || ''), ctx)))}</b><p>${esc(htmlToText(html)).replace(/\n/g, '<br>')}</p></div>` : `<article class="letter"><header><b>${COMPANY.entreprise}</b><span>${COMPANY.entreprise_adresse}</span></header><h2>${esc(r.title || t.title)}</h2><div class="doc-body">${html}</div></article>`}</div>`,
      '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>', true);
  };

  // ---------------------------------------------------------------- Modals
  function modalHTML() {
    const m = ui.modal; if (!m) return '';
    const shell = (title, body, foot, wide) => `<div class="modal" data-act="modal-bg"><div class="modal-box ${wide === 'xl' ? 'wide xl' : wide ? 'wide' : ''}" data-act="noop" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-h"><h2>${title}</h2><button type="button" class="icon-btn" data-act="modal-close" aria-label="Fermer">${ic('x')}</button></div>${body}${foot || ''}</div></div>`;
    const formShell = (title, form, fields, submit, wide) => shell(title, `<form data-form="${form}" novalidate><div class="modal-b">${fields}<p class="err" id="m-err" aria-live="polite"></p></div><div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Annuler</button><button class="btn primary">${submit}</button></div></form>`, '', wide);
    const opt = (list, v) => list.map((x) => (Array.isArray(x) ? `<option value="${esc(x[0])}" ${x[0] === v ? 'selected' : ''}>${esc(x[1])}</option>` : `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`)).join('');
    const f = (id, label, input, full) => `<div class="field ${full ? 'full' : ''}"><label for="${id}">${label}</label>${input}</div>`;
    if (MODALS[m.type]) return MODALS[m.type](m, shell, formShell, opt, f);
    if (m.type === 'emp') {
      const e = m.id ? emp(m.id) : { firstName: '', lastName: '', title: '', dept: 'Design', managerId: 'e2', contract: 'CDI', salary: '', startDate: nextMonday(TODAY, 3), phone: '', location: 'Paris', stage: 2 };
      const mgrs = db.employees.filter(isEmployed).map((x) => [x.id, fullName(x)]);
      return formShell(m.id ? `Modifier ${esc(fullName(e))}` : 'Ajouter un collaborateur', 'emp', `<div class="form-grid">
        ${f('e-first', 'Prénom', `<input id="e-first" name="firstName" class="input" value="${esc(e.firstName)}" required>`)}${f('e-last', 'Nom', `<input id="e-last" name="lastName" class="input" value="${esc(e.lastName)}" required>`)}
        ${f('e-title', 'Poste', `<input id="e-title" name="title" class="input" value="${esc(e.title)}" required>`)}${f('e-dept', 'Service', `<select id="e-dept" name="dept" class="select">${opt(DEPTS, e.dept)}</select>`)}
        ${f('e-mgr', 'Manager', `<select id="e-mgr" name="managerId" class="select"><option value="">Aucun</option>${opt(mgrs, e.managerId)}</select>`)}${f('e-contract', 'Contrat', `<select id="e-contract" name="contract" class="select">${opt(['CDI', 'CDD', 'Alternance', 'Stage'], e.contract)}</select>`)}
        ${f('e-salary', 'Salaire annuel brut (€)', `<input id="e-salary" name="salary" type="number" min="0" step="100" class="input num" value="${esc(e.salary)}" required>`)}${f('e-start', 'Date d’entrée', `<input id="e-start" name="startDate" type="date" class="input" value="${esc(e.startDate)}" required>`)}
        ${f('e-phone', 'Téléphone', `<input id="e-phone" name="phone" class="input" value="${esc(e.phone)}">`)}${f('e-loc', 'Lieu de travail', `<select id="e-loc" name="location" class="select">${opt(SITES().concat(['Télétravail majoritaire']), e.location)}</select>`)}
        ${m.id ? '' : f('e-stage', 'Situation', `<select id="e-stage" name="stage" class="select">${opt([[2, 'Arrivée (pré-embauche et embauche)'], [4, 'Intégration']].map(([v, l]) => [String(v), l]), '2')}</select>`, true)}</div>`, m.id ? 'Enregistrer' : 'Ajouter', true);
    }
    if (m.type === 'exit') {
      const e = emp(m.id);
      return formShell(`Départ de ${esc(fullName(e))}`, 'exit', `<p class="muted" style="margin:0">Le départ est lancé : préavis, documents de sortie et restitution du matériel.</p><div class="form-grid">
        ${f('x-reason', 'Motif', `<select id="x-reason" name="reason" class="select" data-live="exit">${EXIT_GROUPS.map(([g, l]) => `<optgroup label="${g}">${l.map((r) => `<option ${r === exitDefault(e) ? 'selected' : ''}>${r}</option>`).join('')}</optgroup>`).join('')}</select>`)}${f('x-day', 'Dernier jour travaillé', `<input id="x-day" name="lastDay" type="date" class="input" value="${addDays(TODAY, 30)}">`)}
        ${f('x-comment', 'Commentaire (facultatif)', '<input id="x-comment" name="comment" class="input" maxlength="140">', true)}</div><p class="hint" id="x-info" style="margin:10px 0 0">${exitHint(e, exitDefault(e))}</p>`, 'Démarrer le départ');
    }
    if (m.type === 'refuse') {
      const l = db.leaves.find((x) => x.id === m.id), e = emp(l.empId);
      return formShell('Refuser la demande', 'refuse', `<p style="margin:0">${esc(fullName(e))} · ${esc(l.type)} du ${fmtShort(l.start)} au ${fmtDate(l.end)} (${plural(l.days, 'jour', 'jours')}).</p>${f('r-why', 'Motif communiqué au collaborateur', '<input id="r-why" name="why" class="input" maxlength="140" placeholder="Ex. période de livraison, merci de décaler d’une semaine">', true)}`, 'Refuser la demande');
    }
    if (m.type === 'payslip') return shell(`Bulletin de paie · ${monthLabel(m.m)}`, `<div class="modal-b">${payslipHTML(emp(m.id), m.m)}</div>`, '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>', 'xl');
    if (m.type === 'cand') {
      return formShell('Ajouter un candidat', 'cand', `<div class="form-grid">${f('k-name', 'Prénom et nom', '<input id="k-name" name="name" class="input" required>', true)}
        ${f('k-email', 'E-mail', '<input id="k-email" name="email" type="email" class="input">')}${f('k-phone', 'Téléphone', '<input id="k-phone" name="phone" class="input">')}
        ${f('k-source', 'Source', `<select id="k-source" name="source" class="select">${opt(['Site carrière', 'Jobboard', 'Réseaux sociaux', 'Cooptation', 'École'])}</select>`)}${f('k-exp', 'Expérience', '<input id="k-exp" name="experience" class="input" placeholder="Ex. 4 ans · agence">')}
        ${f('k-cv', 'CV', '<input id="k-cv" name="f_cv" type="file" class="input file" accept=".pdf,image/*">')}${f('k-lm', 'Lettre de motivation', '<input id="k-lm" name="f_lm" type="file" class="input file" accept=".pdf,image/*">')}
        ${f('k-autre', 'Autre document (portfolio, diplôme…)', '<input id="k-autre" name="f_autre" type="file" class="input file" accept=".pdf,image/*">', true)}</div>
        <label style="display:flex;gap:8px;align-items:center;font-size:14px;margin-top:12px"><input type="checkbox" name="ack" checked> Envoyer l’accusé de réception (avec l’information sur ses données personnelles)</label>`, 'Ajouter');
    }
    if (m.type === 'reset') {
      return shell('Réinitialiser la démo', '<div class="modal-b"><p style="margin:0">Toutes vos modifications (demandes, validations, embauches, paies…) seront effacées et les données de départ seront restaurées.</p></div>',
        '<div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Annuler</button><button type="button" class="btn bad" data-act="reset-ok">Réinitialiser</button></div>');
    }
    return '';
  }
  function formError(msg) { const el = document.getElementById('m-err'); if (el) el.textContent = msg; }

  // ---------------------------------------------------------------- Render
  const VIEWS = { arrivees: () => viewProc('arrivees'), departs: () => viewProc('departs'), accueil: viewHome, reporting: viewReporting, etape: viewStage, besoins: viewNeeds, collaborateurs: viewAdmin, absences: viewAbsences, paie: viewRemu, recrutement: viewRecruitment, profil: viewMyAdmin, bulletins: viewMyPay,
    entretiens: viewReviews, formation: viewTraining, mobilite: viewMobility, sante: viewHealth, relations: viewRelations, arrivee: viewArrivee, contrat: viewContrat, modeles: viewTemplates, parametres: viewSettings, setup: viewSetup, obligations: viewObligations };
  let drawerAnim = false;
  let rendering = false;
  function render() {
    // A field losing focus during a render fires « change », which would render again mid-way: defer it.
    if (rendering) { setTimeout(render, 0); return; }
    rendering = true;
    try { renderNow(); } finally { rendering = false; }
  }
  function renderNow() {
    route();
    if (ui.orgPreview && !orgDrag && !(ui.modal && ui.modal.type === 'org-move')) ui.orgPreview = null;
    const scrollY = window.scrollY;
    const mob = isMob(); if (!mob || ui.profile !== 'salarie') ui.mobMore = false;
    document.getElementById('app').innerHTML = mob && (ui.view === 'setup' || ui.profile !== 'salarie') ? mobGate()
      : mob ? `<div class="app mob">${mobTop()}<main class="view" id="view">${ui.view === 'accueil' || MOB_OFF.includes(ui.view) ? mobHome() : VIEWS[ui.view]()}</main>${footer()}${mobNav()}</div>`
      : ui.view === 'setup' ? `<div class="app setup">${viewSetup()}${footer()}${avisFab()}</div>` : `<div class="app">${topbar()}${stageRail()}<main class="view" id="view">${VIEWS[ui.view]()}</main>${footer()}${avisFab()}</div>`;
    let ov = '';
    if (ui.drawer) {
      const dt = ui.drawer.type, cs = dt === 'case' && db.cases.find((c) => c.id === ui.drawer.id);
      const nj = dt === 'need' && db.jobs.find((x) => x.id === ui.drawer.id);
      const content = dt === 'emp' ? (emp(ui.drawer.id) && empDrawer(emp(ui.drawer.id))) : dt === 'case' ? (cs && DRAWERS.case(cs)) : dt === 'need' ? (nj && DRAWERS.need(nj)) : (db.candidates.find((c) => c.id === ui.drawer.id) && candDrawer(db.candidates.find((c) => c.id === ui.drawer.id)));
      if (content) ov += `<div class="scrim ${drawerAnim ? '' : 'on'}" data-act="close-drawer"></div><aside class="drawer ${dt === 'cand' ? 'wide' : dt === 'need' ? 'mid' : ''} ${drawerAnim ? '' : 'on'}" aria-label="Fiche">${content}</aside>`;
      else ui.drawer = null;
    }
    ov += modalHTML();
    if (ui.mobMore) ov += mobMoreSheet();
    document.getElementById('overlay').innerHTML = ov;
    if (drawerAnim) { drawerAnim = false; requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.scrim, .drawer').forEach((el) => el.classList.add('on')))); }
    window.scrollTo(0, scrollY);
    const cur = document.querySelector('.rail [aria-current]'); if (cur) cur.parentElement.scrollLeft = cur.offsetLeft - 80;
    if (ui.view === 'accueil' && !mob) bindWheel();
    if (ui.view === 'recrutement') bindBoard();
    bindSignature(); bindTplEditor(); bindDocEditor(); bindOrg(); if (tour) requestAnimationFrame(tourPlace);
    saveUI();
  }
  const commit = () => { syncArrivals(); arrivalReminders(); needReminders(); complianceSync(); save(); render(); };
  // Keep (view, stage) consistent with what the profile is allowed to open.
  function route() {
    if (db.settings.setupDone === false || !emp('e1')) { ui.view = 'setup'; ui.stage = null; ui.profile = 'rh'; ui.selfOf = null; return; }
    if (ui.view === 'setup') ui.view = 'accueil';
    if (!ui.selfOf && (!profileOk(ui.profile) || (TENANT === 'new' && ui.profile !== 'rh'))) { ui.profile = 'rh'; ui.selfOf = null; }
    if (ui.view === 'accueil' || !VIEWS[ui.view]) { ui.view = 'accueil'; ui.stage = null; return; }
    if (ui.view === 'reporting' || ui.view === 'modeles' || ui.view === 'parametres' || ui.view === 'obligations') { if (ui.profile !== 'rh') ui.view = 'accueil'; ui.stage = null; return; }
    const vis = visibleStages();
    if (ui.view === 'etape') { if (!vis.includes(ui.stage) || stageView(ui.stage) !== 'etape') { ui.view = 'accueil'; ui.stage = null; } return; }
    if (!vis.includes(ui.stage) || stageView(ui.stage) !== ui.view) ui.stage = vis.find((i) => stageView(i) === ui.view) ?? null;
    if (ui.stage === null) ui.view = 'accueil';
  }

  function bindBoard() {
    document.querySelectorAll('.kc').forEach((el) => {
      el.addEventListener('dragstart', (ev) => { ev.dataTransfer.setData('text/plain', el.dataset.id); ev.dataTransfer.effectAllowed = 'move'; el.classList.add('dragging'); });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));
    });
    document.querySelectorAll('.col').forEach((col) => {
      col.addEventListener('dragover', (ev) => { ev.preventDefault(); col.classList.add('over'); });
      col.addEventListener('dragleave', () => col.classList.remove('over'));
      col.addEventListener('drop', (ev) => { ev.preventDefault(); col.classList.remove('over'); moveCandidate(ev.dataTransfer.getData('text/plain'), col.dataset.stage); });
    });
  }
  function moveCandidate(id, stage) {
    const c = db.candidates.find((x) => x.id === id); if (!c || c.stage === stage) return;
    if (c.stage === 'Embauché') { toast('Ce candidat est déjà embauché.', 'info'); return; }
    if (stage === 'Embauché') { toast('L’embauche se fait quand le candidat accepte la proposition : ouvrez sa fiche.', 'info'); return; }
    if (c.offer && ['Envoyée', 'Expirée'].includes(offerStatus(c.offer))) { toast('Une proposition est en cours : enregistrez la réponse du candidat ou retirez-la.', 'info'); return; }
    if (stage === 'Refusé' && ui.profile !== 'rh') { toast('Le refus d’un candidat est fait par les RH.', 'info'); return; }
    if (stage === 'Refusé') { ui.modal = { type: 'cand-refuse', id }; render(); return; }
    if (stage === 'Proposition' && ui.profile === 'rh') { ui.modal = { type: 'offer', id }; render(); return; }
    if (stage === 'Proposition') notify('e1', `${fullName(me())} a choisi ${c.name} pour « ${candJob(c).title} » : proposition à préparer.`);
    if (c.stage === 'Refusé') c.refusal = null;
    logCand(c, `${c.stage} → ${stage}`); c.stage = stage; toast(stage === 'Proposition' ? `${c.name} est choisi·e · les RH préparent la proposition` : `${c.name} : ${stage}`); commit();
  }

  function advance(id) {
    const e = emp(id); if (!e || e.stage >= 15) return;
    // A departure needs its reason and last day: entering « Préparation du départ » goes through the departure form.
    if (e.stage === 12 && !e.exit) { ui.modal = { type: 'exit', id }; render(); return; }
    db.journey[e.id] = db.journey[e.id] || {};
    db.journey[e.id][e.stage] = stageSteps(e.stage).map(() => true);
    e.stage = inArrival(e) ? 4 : e.stage + 1;
    if (e.stage === 14) ['certificat', 'solde', 'france-travail'].forEach((k) => { if (!db.documents.some((d) => d.empId === e.id && d.kind === k)) addDoc(e.id, k); });
    notify(e.id, `Votre départ : ${STAGES[e.stage].title.toLowerCase()}.`);
    if (e.managerId && e.managerId !== me().id) notify(e.managerId, `Départ de ${fullName(e)} : ${STAGES[e.stage].short.toLowerCase()}.`);
    toast(`Départ de ${fullName(e)} : ${STAGES[e.stage].short.toLowerCase()}`);
    ui.selPerson = null;
    commit();
  }

  // ---------------------------------------------------------------- Actions
  const ACT = {
    noop() {},
    go(d) { ui.view = d.v; ui.stage = null; ui.notif = false; ui.drawer = null; ui.mobMore = false; window.scrollTo(0, 0); render(); },
    persona(d) {
      if (persona() === d.p && !ui.selfOf) return;
      ui = Object.assign({ profile: d.p, view: 'accueil', stage: null, asEmp: ui.asEmp, asMgr: ui.asMgr }, freshUI());
      render(); toast(`Vous voyez maintenant l’application en tant que ${fullName(me())} (${PROFILES[d.p].label}).`);
    },
    space(d) {
      const perso = d.s === 'perso'; if (perso === !!ui.selfOf) return;
      const base = persona(), i = ui.stage;
      ui = Object.assign({ profile: perso ? 'salarie' : base, selfOf: perso ? base : null, view: 'accueil', stage: null, asEmp: ui.asEmp, asMgr: ui.asMgr }, freshUI());
      if (i !== null && i !== undefined && visibleStages().includes(i) && stageView(i)) Object.assign(ui, { view: stageView(i), stage: i });
      window.scrollTo(0, 0); render(); toast(perso ? `Ton espace personnel : ${fullName(me())}` : base === 'rh' ? 'Gestion des salariés' : 'Gestion de ton équipe');
    },
    notif() { ui.notif = !ui.notif; render(); },
    'mob-more'() { ui.mobMore = !ui.mobMore; ui.notif = false; render(); },
    // Actions rapides de l'accueil mobile : un geste pour les trois usages les plus fréquents.
    'mob-quick'(d) {
      const it = (v) => mobItems().find((x) => x.v === v), m = me();
      if (d.k === 'bulletin') { const k = payMonths().filter((x) => db.payroll[x] && db.payroll[x].closed && inPayroll(m, x)).slice(-1)[0]; if (k) { ui.modal = { type: 'payslip', id: m.id, m: k }; render(); } return; }
      const x = it(d.k === 'absence' ? 'absences' : 'relations'); if (!x) return;
      Object.assign(ui, { view: x.v, stage: x.i, notif: false, drawer: null, mobMore: false }); render();
      const f = document.querySelector(d.k === 'absence' ? 'form[data-form="leave"]' : 'form[data-form="case-ask"]');
      if (f) { f.scrollIntoView({ block: 'start' }); window.scrollBy(0, -70); }
    },
    'notif-read'() { db.notifications.forEach((n) => { if (n.to === me().id) n.read = true; }); commit(); },
    hub() { if (ui.wheelOpen && Date.now() - openedAt < 500) return; // a tap fires mouseenter (opens) then click
      if (ui.wheelOpen) closeWheel(); else openWheel(); },
    // A stage of the wheel (or of the strip) opens its module.
    stage(d) {
      const i = Number(d.i), v = stageView(i); if (!v) return;
      if (v === 'recrutement') Object.assign(ui, { recTab: 'todo', recJob: null });
      Object.assign(ui, { view: v, stage: i, selPerson: null, notif: false, drawer: null, mobMore: false });
      window.scrollTo(0, 0); render();
    },
    person(d) { ui.selPerson = ui.selPerson === d.id ? null : d.id; document.getElementById('panel').innerHTML = stagePanel(ui.stage); },
    jcheck(d) {
      const s = Number(d.s), k = Number(d.k);
      db.journey[d.id] = db.journey[d.id] || {};
      const arr = journeyOf(d.id, s); arr[k] = !arr[k]; db.journey[d.id][s] = arr;
      save();
      if (ui.view === 'etape' && !ui.drawer) { document.getElementById('panel').innerHTML = stagePanel(ui.stage); } else render();
    },
    advance(d) { advance(d.id); },
    'open-emp'(d) { ui.drawer = { type: 'emp', id: d.id, tab: 'infos' }; drawerAnim = true; render(); },
    'open-cand'(d) { if (ui.view !== 'recrutement') Object.assign(ui, { view: 'recrutement', stage: null, recTab: 'todo', recJob: null }); ui.drawer = { type: 'cand', id: d.id, tab: 'evaluation' }; drawerAnim = true; render(); },
    'close-drawer'() { ui.drawer = null; render(); },
    dtab(d) { ui.drawer.tab = d.t; render(); },
    sort(d) { if (ui.sort === d.k) ui.sortDir *= -1; else { ui.sort = d.k; ui.sortDir = 1; } render(); },
    'emp-new'() { ui.modal = { type: 'emp' }; render(); },
    'emp-edit'(d) { ui.modal = { type: 'emp', id: d.id }; render(); },
    exit(d) { ui.modal = { type: 'exit', id: d.id }; render(); },
    'modal-close'() { ui.modal = null; render(); },
    'modal-bg'() { ui.modal = null; render(); },
    'abs-tab'(d) { ui.absTab = d.t; render(); },
    plan(d) { ui.planMonth = shiftMonth(ui.planMonth || monthKey(TODAY), Number(d.d)); render(); },
    'leave-ok'(d) {
      const l = db.leaves.find((x) => x.id === d.id), e = emp(l.empId), k = balanceKey(l.type);
      if (e.id === me().id) { toast('Tu ne peux pas valider ta propre demande : elle part à ton responsable.', 'info'); return; }
      if (k && e[k] < l.days) { toast(`Solde insuffisant : ${fullName(e)} n’a plus que ${e[k]} j.`, 'info'); return; }
      if (k) e[k] -= l.days;
      l.status = 'Approuvée'; l.decidedBy = me().id;
      notify(e.id, `${fullName(me())} a validé votre demande : ${l.type} du ${fmtShort(l.start)} au ${fmtShort(l.end)}.`);
      toast(`Demande de ${fullName(e)} validée`); commit();
    },
    'leave-ko'(d) { ui.modal = { type: 'refuse', id: d.id }; render(); },
    'leave-cancel'(d) { db.leaves = db.leaves.filter((l) => l.id !== d.id); toast('Demande annulée'); commit(); },
    'pay-month'(d) { if (d.m) { ui.payMonth = d.m; ui.payStep = null; render(); } },
    payslip(d) { ui.modal = { type: 'payslip', id: d.id, m: d.m }; render(); },
    'open-job'(d) { const j = db.jobs.find((x) => x.id === d.id); if (j && isNeed(j)) { ACT['open-need'](d); return; } Object.assign(ui, { view: 'recrutement', stage: null, recTab: 'offres', recJob: d.id, offerTab: 'cands', drawer: null }); window.scrollTo(0, 0); render(); },
    'job-close'(d) { const j = db.jobs.find((x) => x.id === d.id); j.status = 'Clôturée'; toast('Offre clôturée'); commit(); },
    'cand-new'(d) { ui.modal = { type: 'cand', jobId: d.id }; render(); },
    'cand-move'(d) { moveCandidate(d.id, d.s); },
    reset() { ui.modal = { type: 'reset' }; render(); },
    'reset-ok'() { db = TENANT === 'new' ? blankSeed() : window.TEAMORA_SEED(); normalizeSettings(); applySettings(); normalizeCompliance(); if (TENANT === 'new') ui.wizStep = 'bienvenue'; normalizeEmployees(); ensureSignedContracts(); normalizeDocs(); purgeCandidates(); syncArrivals(); save(); ui = Object.assign({ profile: ui.profile, selfOf: ui.selfOf, view: 'accueil' }, freshUI()); render(); toast('Démo réinitialisée'); },
  };
  const CHG = {
    fDept(v) { ui.fDept = v; render(); },
    fStatus(v) { ui.fStatus = v; render(); },
    histStatus(v) { ui.histStatus = v; render(); },
    'cand-stage'(v, d) { moveCandidate(d.id, v); render(); },
  };
  const INP = {
    nq(v) { ui.nq = v; const el = document.getElementById('need-list'), list = needFiltered(); if (el) el.innerHTML = needTable(list); const c = document.getElementById('need-count'); if (c) c.textContent = plural(list.length, 'besoin', 'besoins'); },
    rq(v) { ui.rq = v; const el = document.getElementById('rec-list'); if (el) el.innerHTML = recJobList(recJobs()); },
    orgq(v) { ui.orgQ = v; refreshOrg(); },
    q(v) { ui.q = v; const list = filteredEmployees(); document.getElementById('emp-table').innerHTML = empTable(list); document.getElementById('emp-count').textContent = plural(list.length, 'collaborateur', 'collaborateurs'); },
  };
  const LIVE = {
    exit(form) { const el = document.getElementById('x-info'); if (el) el.textContent = exitHint(emp(ui.modal.id), form.elements.namedItem('reason').value); },
    leave(form) { const fd = new FormData(form), t = fd.get('type'); document.getElementById('lv-event-f').hidden = t !== 'Événement familial'; document.getElementById('lv-preview').innerHTML = leavePreview(t, fd.get('start'), fd.get('end'), me(), fd.get('event')); },
  };
  const FORMS = {
    leave(v, form) {
      const e = me(), d = workDays(v.start, v.end), k = balanceKey(v.type);
      const err = (msg) => { document.getElementById('lv-preview').innerHTML = `<span class="err">${esc(msg)}</span>`; };
      if (!v.start || !v.end) return err('Choisissez les dates de début et de fin.');
      if (v.end < v.start) return err('La date de fin doit être après la date de début.');
      if (!d) return err('Cette période ne contient aucun jour ouvré.');
      if (k && d > e[k]) return err(`Solde insuffisant : il vous reste ${e[k]} j.`);
      if (db.leaves.some((l) => l.empId === e.id && l.status !== 'Refusée' && l.start <= v.end && l.end >= v.start)) return err('Vous avez déjà une absence sur cette période.');
      if (v.type === 'Événement familial') { const max = (FAMILY_EVENTS.find(([t]) => t === v.event) || FAMILY_EVENTS[0])[1]; if (d > max) return err(`Ce congé est de ${plural(max, 'jour', 'jours')} au plus.`); }
      if (DECLARED.includes(v.type) && v.type !== 'Maladie') {
        db.leaves.push({ id: uid('l'), empId: e.id, type: v.type, start: v.start, end: v.end, days: d, status: 'Approuvée', comment: [v.type === 'Événement familial' ? v.event : '', (v.comment || '').trim()].filter(Boolean).join(' · '), createdAt: TODAY, receivedAt: TODAY, dsnAt: IJ_TYPES.includes(v.type) ? null : undefined, subrogation: false, declared: true });
        notify('e1', `${fullName(e)} déclare : ${v.type.toLowerCase()} du ${fmtShort(v.start)} au ${fmtShort(v.end)}.`); if (e.managerId) notify(e.managerId, `${fullName(e)} sera absent·e du ${fmtShort(v.start)} au ${fmtShort(v.end)} (${v.type.toLowerCase()}).`);
        toast('Absence enregistrée · les RH et ton manager sont prévenus'); form.reset(); commit(); return;
      }
      if (v.type === 'Maladie') {
        db.leaves.push({ id: uid('l'), empId: e.id, type: v.type, start: v.start, end: v.end, days: d, status: 'Approuvée', comment: (v.comment || '').trim() || 'Arrêt de travail', createdAt: TODAY, receivedAt: TODAY, dsnAt: null, subrogation: false });
        tickJourney(e.id, 6, 2); notify('e1', `Arrêt de travail de ${fullName(e)} du ${fmtShort(v.start)} au ${fmtShort(v.end)} : attestation de salaire à transmettre.`); if (e.managerId) notify(e.managerId, `${fullName(e)} est en arrêt de travail du ${fmtShort(v.start)} au ${fmtShort(v.end)}.`);
        toast('Arrêt enregistré · les RH et votre manager sont prévenus'); form.reset(); commit(); return;
      }
      db.leaves.push({ id: uid('l'), empId: e.id, type: v.type, start: v.start, end: v.end, days: d, status: 'En attente', comment: (v.comment || '').trim(), createdAt: TODAY });
      const ap = approverOf(e), bk = backupOf(e);
      notify(ap.id, `${fullName(e)} demande ${plural(d, 'jour', 'jours')} (${v.type}) du ${fmtShort(v.start)} au ${fmtShort(v.end)}.`);
      if (bk) notify(bk.id, `En l’absence de ${fullName(ap)} : ${fullName(e)} demande ${plural(d, 'jour', 'jours')} (${v.type}) du ${fmtShort(v.start)} au ${fmtShort(v.end)}.`);
      toast(`Demande envoyée à ${fullName(ap)}${bk ? ` (absent·e : ${fullName(bk)} peut la valider)` : ''}`); form.reset(); commit();
    },
    refuse(v) {
      const l = db.leaves.find((x) => x.id === ui.modal.id);
      l.status = 'Refusée'; l.refusal = (v.why || '').trim(); l.decidedBy = me().id;
      notify(l.empId, `${fullName(me())} a refusé votre demande du ${fmtShort(l.start)}${l.refusal ? ` : ${l.refusal}` : '.'}`);
      ui.modal = null; toast('Demande refusée'); commit();
    },
    emp(v) {
      const salary = Number(v.salary);
      if (!v.firstName.trim() || !v.lastName.trim() || !v.title.trim()) return formError('Renseignez le prénom, le nom et le poste.');
      if (!(salary > 0)) return formError('Indiquez un salaire annuel brut supérieur à 0 €.');
      if (!v.startDate) return formError('Indiquez une date d’entrée.');
      const data = { firstName: v.firstName.trim(), lastName: v.lastName.trim(), title: v.title.trim(), dept: v.dept, managerId: v.managerId || null, contract: v.contract, salary, startDate: v.startDate, phone: v.phone.trim(), location: v.location };
      if (ui.modal.id && data.managerId && (data.managerId === ui.modal.id || isUnder(data.managerId, ui.modal.id))) return formError('Ce manager fait partie de l’équipe de la personne : ce rattachement créerait une boucle dans l’organigramme.');
      if (ui.modal.id) { Object.assign(emp(ui.modal.id), data); toast('Fiche mise à jour'); }
      else {
        const id = uid('e');
        const email = `${data.firstName}.${data.lastName}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z.]/g, '') + `@${COMPANY.domaine}`;
        db.employees.push(Object.assign({ id, email, birthDate: '', address: '', emergency: '', cp: 0, rtt: 0, exit: null, stage: Number(v.stage), registeredAt: Number(v.stage) >= 3 ? TODAY : null }, data)); normalizeEmployees();
        if (data.managerId) notify(data.managerId, `${data.firstName} ${data.lastName} rejoint votre équipe le ${fmtDate(data.startDate)}.`);
        toast(`${data.firstName} ${data.lastName} ajouté·e (${STAGES[Number(v.stage)].short.toLowerCase()})`);
      }
      ui.modal = null; commit();
    },
    exit(v) {
      if (!v.lastDay) return formError('Indiquez le dernier jour travaillé.');
      const e = emp(ui.modal.id);
      e.exit = { reason: v.reason, lastDay: v.lastDay, comment: (v.comment || '').trim() }; offb(e).notifiedAt = TODAY;
      e.stage = 13; db.journey[e.id] = db.journey[e.id] || {}; db.journey[e.id][13] = [true, false, false, false, false];
      notify(e.id, `Votre départ est enregistré : dernier jour le ${fmtDate(v.lastDay)}.`);
      if (e.managerId) notify(e.managerId, `Départ de ${fullName(e)} (${v.reason}) le ${fmtDate(v.lastDay)}.`);
      ui.modal = null; ui.drawer.tab = 'infos'; toast(`Départ de ${fullName(e)} lancé`); commit();
    },
    async cand(v) {
      if (!v.name.trim()) return formError('Indiquez le nom du candidat.');
      const files = [];
      for (const k of ['cv', 'lm', 'autre']) { const f = v['f_' + k]; if (f && f.name) files.push(Object.assign({ kind: k, uploaded: true }, await readFile(f))); }
      const c = { id: uid('c'), jobId: ui.modal.jobId, name: v.name.trim(), email: v.email.trim() || '—', phone: v.phone.trim() || '—', source: v.source, experience: v.experience.trim(), stage: 'Reçue', score: 0, notes: '', interviews: [], appliedAt: TODAY, messages: [], offer: null, refusal: null, pool: false, files, log: [] };
      db.candidates.push(c); logCand(c, `Candidature ajoutée${files.length ? ` avec ${plural(files.length, 'document', 'documents')}` : ''}`);
      if (v.ack === 'on') sendMsg(c, 'ack', ...MSG_TPL.ack[1](c, candJob(c)));
      ui.modal = null; toast(v.ack === 'on' ? 'Candidat ajouté · accusé de réception envoyé' : 'Candidat ajouté'); commit();
    },
    interview(v, form) {
      const c = db.candidates.find((x) => x.id === form.dataset.id);
      if (!v.date) { toast('Choisissez une date d’entretien.', 'info'); return; }
      const iv = { id: uid('i'), date: v.date, with: v.with, kind: v.kind, eval: null };
      c.interviews = c.interviews || []; c.interviews.push(iv);
      if (v.convoc === 'on') sendMsg(c, 'convocation', ...convocMsg(c, candJob(c), iv));
      if (['Reçue', 'Présélection'].includes(c.stage)) c.stage = 'Entretien';
      if (ui.drawer) ui.drawer.plan = false;
      logCand(c, `${v.kind} planifié le ${fmtDate(v.date.slice(0, 10))} avec ${fullName(emp(v.with))}`);
      if (v.with !== me().id) notify(v.with, `${v.kind} avec ${c.name} le ${fmtDate(v.date.slice(0, 10))} à ${v.date.slice(11, 16)}.`);
      toast('Entretien planifié'); commit();
    },
    'cand-note'(v, form) { const c = db.candidates.find((x) => x.id === form.dataset.id); c.notes = v.notes.trim(); toast('Note enregistrée'); commit(); },
    profile(v) {
      const e = me();
      if (!v.phone.trim()) { document.getElementById('p-err').textContent = 'Le numéro de téléphone est obligatoire.'; return; }
      Object.assign(e, { phone: v.phone.trim(), location: v.location, emergency: v.emergency.trim() });
      db.journey[e.id] = db.journey[e.id] || {};
      if (e.stage === 5) { const arr = journeyOf(e.id, 5); arr[1] = true; db.journey[e.id][5] = arr; }
      notify('e1', `${fullName(e)} a mis à jour ses informations personnelles.`);
      toast('Informations enregistrées · les RH sont prévenus'); commit();
    },
  };

  Object.assign(ACT, MOD_ACT); Object.assign(CHG, MOD_CHG); Object.assign(FORMS, MOD_FORMS); Object.assign(LIVE, MOD_LIVE); Object.assign(INP, MOD_INP);

  // ---------------------------------------------------------------- V2 · journal des actions
  // Chaque action qui modifie un dossier est tracée : qui, quoi, quand, pour quel collaborateur (preuve en cas de litige).
  const JOURNAL = { 'leave-ok': 'Absence validée', refuse: 'Absence refusée', 'leave-cancel': 'Absence annulée', 'doc-issue': 'Document remis ou envoyé', 'doc-save': 'Document modifié', 'arr-contract': 'Contrat de travail',
    'sig-sign': 'Contrat signé par le salarié', 'arr-dpae': 'DPAE effectuée', 'arr-register': 'Inscription au registre du personnel', 'arr-trial': 'Décision sur la période d’essai', 'arr-close': 'Intégration clôturée', 'arr-conv': 'Convention de stage reçue',
    'arr-doc': 'Pièce du dossier validée', 'doc-refuse': 'Pièce du dossier refusée', move: 'Changement de situation', 'org-move': 'Changement de rattachement', exit: 'Départ lancé', advance: 'Étape du départ franchie',
    emp: 'Fiche modifiée', 'chg-ok': 'Demande de modification validée', 'chg-ko': 'Demande de modification refusée', 'pay-var': 'Variable de paie saisie', 'review-refused': 'Refus d’entretien tracé',
    'review-train': 'Formation proposée après entretien', 'review-wish': 'Souhait d’évolution noté', 'review-mgr': 'Évaluation du manager', 'review-sign': 'Entretien signé', 'arr-mutuelle': 'Mutuelle', 'payslip': null };
  function journalEmp(d, modal) {
    const ids = [d && (d.id || d.empId), modal && (modal.id || modal.empId)].filter(Boolean);
    for (const id of ids) { if (emp(id)) return id; const x = ['leaves', 'documents', 'reviews', 'enrollments', 'wishes', 'cases', 'changeReqs'].map((k) => (db[k] || []).find((y) => y.id === id)).find(Boolean); if (x && x.empId) return x.empId; }
    return null;
  }
  function journaled(name, d, run) {
    const label = JOURNAL[name]; if (!label) return run();
    const modal = ui.modal, before = JSON.stringify(db), empId = journalEmp(d, modal);
    run();
    if (!empId || JSON.stringify(db) === before) return;
    db.journal = db.journal || []; const now = new Date();
    db.journal.unshift({ at: `${TODAY} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`, by: me().id, as: ui.profile, empId, label, act: name });
    if (db.journal.length > 1000) db.journal.length = 1000; save();
  }
  function journalTab(e) {
    const list = (db.journal || []).filter((x) => x.empId === e.id);
    return `<div class="card"><div class="req-list">${list.length ? list.map((x) => `<div class="req"><span class="doc-ic">${ic('clock')}</span><div class="what"><b>${esc(x.label)}</b><small>${esc(x.at)} · par ${esc(fullName(emp(x.by)))} (${{ rh: 'RH', manager: 'manager', salarie: 'salarié' }[x.as] || x.as})</small></div></div>`).join('')
      : '<div class="empty">Aucune action enregistrée depuis la mise en service du journal.</div>'}</div></div><p class="hint">Journal en lecture seule, conservé avec le dossier du personnel. L’historique de carrière reste dans l’onglet Informations.</p>`;
  }
  // ---------------------------------------------------------------- Events
  document.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-act]');
    if (!t) { if (ui.notif) { ui.notif = false; render(); } return; }
    if (t.dataset.act !== 'notif' && ui.notif && !t.closest('.notif-pop')) ui.notif = false;
    const fn = ACT[t.dataset.act]; if (fn) journaled(t.dataset.act, t.dataset, () => fn(t.dataset, t, ev));
  });
  // Changement de situation : choisir un service propose son responsable comme manager (modifiable).
  document.addEventListener('change', (ev) => {
    const t = ev.target; if (t.id !== 'mv-dept' && t.id !== 'e-dept') return;
    const f = t.form, who = t.id === 'e-dept' ? ui.modal && ui.modal.id : f && f.elements.empId && f.elements.empId.value, head = DEPT_HEAD[t.value], m = document.getElementById(t.id === 'e-dept' ? 'e-mgr' : 'mv-mgr');
    if (!m || !head || head === who || !emp(head) || m.value === head) return;
    m.value = head; m.dispatchEvent(new Event('change', { bubbles: true })); toast(`Manager proposé : ${fullName(emp(head))}, responsable du service ${t.value}`, 'info');
  });
  const runChange = (t) => {
    if (t.type === 'date' && t.value && Number(t.value.slice(0, 4)) < 1900) { toast('Année incomplète : saisis-la sur 4 chiffres (ex. 1990).', 'info'); return; }
    journaled(t.dataset.change, t.dataset, () => CHG[t.dataset.change](t.value, t.dataset, t));
  };
  // Date en cours de frappe : chaque chiffre produit une date « valide » (année 0001, 0019…). Enregistrer, donc réafficher,
  // couperait la saisie : on enregistre à la sortie du champ ou sur Entrée — après un éventuel clic, pour ne pas l'avaler.
  // Le navigateur signale brièvement « aucun champ actif » quand on passe du jour au mois : on suit le focus nous-mêmes.
  const pendingDates = new WeakSet(); let dateFocus = null;
  document.addEventListener('focusin', (ev) => { if (ev.target.type === 'date') dateFocus = ev.target; });
  document.addEventListener('focusout', (ev) => {
    const t = ev.target; if (t === dateFocus) dateFocus = null; if (!pendingDates.has(t)) return;
    pendingDates.delete(t); const ds = Object.assign({}, t.dataset), v = t.value;
    setTimeout(() => runChange({ type: 'date', value: v, dataset: ds }), 160);
  });
  document.addEventListener('keydown', (ev) => { const t = ev.target; if (ev.key === 'Enter' && pendingDates.has(t)) { ev.preventDefault(); t.blur(); } });
  document.addEventListener('change', (ev) => {
    const t = ev.target;
    if (t.dataset && t.dataset.live) LIVE[t.dataset.live](t.form);
    if (t.dataset && t.dataset.change) {
      if (t.type === 'date' && dateFocus === t) { pendingDates.add(t); return; }
      runChange(t);
    }
  });
  document.addEventListener('input', (ev) => {
    const t = ev.target;
    if (t.dataset && t.dataset.input) INP[t.dataset.input](t.value, t);
    if (t.dataset && t.dataset.live && ['INPUT', 'TEXTAREA'].includes(t.tagName)) LIVE[t.dataset.live](t.form);
  });
  document.addEventListener('submit', (ev) => {
    const f = ev.target.closest('[data-form]'); if (!f) return;
    ev.preventDefault(); const v = Object.fromEntries(new FormData(f, ev.submitter || null)); journaled(f.dataset.form, Object.assign({}, f.dataset, v), () => FORMS[f.dataset.form](v, f));
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && ui.orgFull && !ui.modal && !ui.drawer) { setOrgFull(false); return; }
    if (ev.key === 'Escape') { if (ui.modal) { ui.modal = null; render(); } else if (ui.drawer) { ui.drawer = null; render(); } else if (ui.notif) { ui.notif = false; render(); } return; }
    const t = ev.target;
    if ((ev.key === 'Enter' || ev.key === ' ') && t.matches && t.matches('tr[data-act]')) { ev.preventDefault(); t.click(); }
    // Visionneuse de candidat : flèches gauche/droite pour passer d'un candidat à l'autre de la colonne.
    if (ui.drawer && ['cand', 'need'].includes(ui.drawer.type) && !ui.modal && ['ArrowLeft', 'ArrowRight'].includes(ev.key) && !/INPUT|TEXTAREA|SELECT/.test(t.tagName)) {
      const b = document.querySelectorAll('.cand-nav [data-act$="-go"]')[ev.key === 'ArrowLeft' ? 0 : 1]; if (b && !b.disabled) b.click();
    }
  });
  window.addEventListener('resize', fitWheel);
  // Info-bulle des graphiques : tout élément porteur de data-tip.
  const tip = document.createElement('div'); tip.className = 'viz-tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip);
  document.addEventListener('mouseover', (ev) => { const t = ev.target.closest && ev.target.closest('[data-tip]'); if (!t) { tip.classList.remove('on'); return; } tip.textContent = t.dataset.tip; tip.classList.add('on'); });
  document.addEventListener('mousemove', (ev) => { if (!tip.classList.contains('on')) return; const x = Math.min(ev.clientX + 14, window.innerWidth - tip.offsetWidth - 8); tip.style.transform = `translate(${x}px, ${ev.clientY + 16}px)`; });

  // ================================================================ V2 · Assistant d'aide à la prise en main (démo)
  // Démo : la page publiée interroge Claude via la capacité « sample », sur le compte de la personne qui consulte.
  // En production, ce serait un serveur intermédiaire appelant l'API Claude (la clé ne doit jamais être dans le navigateur).
  const HELP_GUIDE = `GUIDE D'UTILISATION DE TEAMORA (logiciel RH, version 2)

PROFILS. En haut à droite : RH (Olivia Bennett), Manager (Thomas Petit par défaut ; un sélecteur permet de prendre les traits d'un autre manager, dont Claire Durand, Direction), Salarié (Léa Martin, ou une nouvelle recrue via le sélecteur). RH et managers ont un interrupteur « Salariés / Mon équipe » ↔ « Mon espace » pour voir leur propre espace salarié (leurs congés, bulletins, entretiens). Personne ne valide ses propres demandes : elles partent au responsable (la Direction pour Olivia).

NAVIGATION. L'accueil est une roue : survoler ou toucher le cercle central affiche les rubriques ; cliquer une rubrique l'ouvre. Ailleurs, un bandeau de pictogrammes en haut reprend les rubriques ; la maison ramène à la roue. Les pastilles orange comptent ce qui attend le profil. Le bouton « À traiter » (en haut) liste tout ce qui attend, rubrique par rubrique et personne par personne. Le bandeau de gauche donne aussi accès au Reporting RH et aux Modèles de documents (RH). « Nouveautés de la V2 » est en bas de page.

RUBRIQUES ET ACTIONS
- Besoin RH : un manager crée une demande de recrutement en 4 étapes (le besoin, la fiche de cadrage, la validation, l'envoi) ; brouillon enregistré automatiquement. Les RH valident, demandent une modification ou refusent. L'offre est ensuite rédigée à deux : le manager demandeur et les RH peuvent écrire et enregistrer le projet (onglet « Projet d'offre » du besoin), le manager l'envoie aux RH, et seuls les RH la valident et la publient. Référence BES-… puis OFF-… une fois publiée.
- Recrutement : onglets À traiter, Offres, Vivier. Une offre contient ses candidats en colonnes (Reçue, Présélection, Entretien, Proposition, Embauché, Refusé) ; glisser une carte pour changer d'étape. Fiche candidat : bandeau « Prochaine étape », onglets Évaluation, Entretiens, Échanges (messages types), Profil, Historique ; flèches ← → pour passer au candidat suivant. Rédaction d'annonce : les termes potentiellement discriminants sont signalés en orange mais ne bloquent pas la publication. Un candidat embauché devient automatiquement une recrue dans Arrivées.
- Arrivées (RH, managers) : un dossier unique par recrue, liste à gauche, onglets Pré-embauche, Embauche, Intégration. Bouton « Nouvelle arrivée » (RH) pour une entrée hors offre : cooptation, candidature spontanée, réembauche, ancien stagiaire, transfert ; contrôles de date de fin (CDD 18 mois, stage 6 mois) et de gratification. Pré-embauche : pièces déposées par la recrue (Valider / Refuser avec motif / Reçu sur papier), contrat (Générer le contrat → relire → Envoyer pour signature ; la recrue signe à la main dans son espace ; un contrat signé est figé, « Voir le contrat signé »), préparation (poste, ordinateur, comptes, badge, parrain). Embauche : DPAE, registre du personnel, informations obligatoires (décret 2023), affectation, mutuelle, visite d'information et de prévention. Stagiaire : convention de stage tripartite à la place de la DPAE et du contrat, pas de période d'essai. Intégration : programme (modèle commun configurable dans l'onglet « Programme d'intégration »), points à 30 jours, rapport d'étonnement, décision sur la période d'essai (Confirmer / Renouveler / Rompre), puis « Clôturer l'intégration » qui fait passer la personne en poste. Pré-embauche et embauche avancent en parallèle ; la recrue passe en intégration quand les deux sont terminées et le contrat signé.
- Vie administrative : Annuaire (recherche, filtres service et statut ; clic sur une ligne = fiche), Échéances (titres de séjour, fins de CDD, périodes d'essai, visites), Demandes de modification (validées par les RH avec justificatif), Organigramme. Fiche d'un collaborateur : onglets Informations, Absences, Rémunération, Documents, Journal (qui a fait quoi). Boutons « Modifier », « Changement de situation » (poste, service, manager, salaire, temps de travail en une fois, avec date d'effet ; avenant généré seulement si le contrat change) et « Démarrer un départ ». Organigramme : arbre, recherche, filtres, zoom, plein écran ; les RH changent un rattachement en glissant une carte sur un manager (aperçu en vert, confirmation au lâcher).
- Temps & absences : le salarié fait une demande (congés payés, RTT, sans solde, congé parental → validation par le manager) ou déclare un droit (maladie, accident du travail, maternité, paternité, événement familial avec plafond de jours, enfant malade → enregistré directement). Le télétravail est un mode de travail, pas une absence. Le manager valide dans « À valider » ; si un manager est absent, son propre manager peut valider à sa place. RH : onglets Temps de travail, Arrêts de travail (attestation de salaire), Compteurs, Planning, Historique.
- Rémunération / Paie (RH) : paie du mois en 4 étapes : Variables (absences et heures remontées, primes, notes de frais, acomptes ; chaque manager valide celles de son équipe), Contrôles (SMIC, écarts, RIB, DPAE, sorties… chaque point corrigé ou marqué « Vérifié »), Envoi au prestataire (export CSV), Bulletins (journal de paie, puis Diffuser). Aussi : Révision salariale, Égalité salariale, Avantages. Le salarié voit ses bulletins dans « Mes bulletins » et peut demander le papier.
- Performance : entretiens annuels et professionnels (auto-évaluation du salarié, évaluation du manager, signature) ; depuis un entretien, « Proposer une formation » ou « Noter un souhait d'évolution » ; refus d'un entretien professionnel traçable. Objectifs, feedback.
- Formation : catalogue, demandes (validées par le manager puis les RH), plan de formation, efficacité.
- Mobilité : offres internes, souhaits d'évolution, revue des talents, plan de succession.
- Santé & QVT : visites médicales, accidents et incidents, document unique (DUERP), baromètre QVT anonyme, aménagements de poste, retours d'absence longue (visite de reprise).
- Relations individuelles : dossiers (procédure disciplinaire avec délais, entretien, mesure retenue).
- Départs (RH, managers) : lancés depuis la fiche (« Démarrer un départ » : motif parmi 13, dernier jour ; aperçu du préavis et des indemnités). Dossier unique, onglets Préparation (préavis, indemnités, documents), Formalités de sortie (entretien de départ, passation, matériel, accès, portabilité, documents remis), Après le départ (archivage, conservation). Les indemnités de sortie remontent dans la paie du mois.
- Modèles de documents (RH) : chaque modèle (contrats, attestations, certificats, courriers aux candidats) se modifie : champs automatiques, champs à saisir, mentions obligatoires vérifiées, images (bouton « Image » : glisser pour placer, poignée pour redimensionner), versions et retour à une version précédente. Un document remis ou signé ne se modifie plus.
- Obligations selon l'effectif (RH, pictogramme document coché dans le bandeau) : effectif moyen sur 12 mois en équivalent temps plein (hors alternants et stagiaires), historique des années (Paramètres > Entreprise), projection à 12 mois ; obligations par seuil (dès 1, 11, 20, 50, 250, 300, 1 000) avec la règle de franchissement (immédiat, 12 mois consécutifs pour le CSE, 5 années civiles pour la plupart des seuils) et leur état ; alertes dans « À traiter » ; simulation d'effectif pour la démo. Onglets : Dialogue social (élections du CSE, élus, réunions, heures de délégation, consultations, budgets, BDESE, négociations), Index égalité (calcul indicatif, publication avant le 1er mars), Emploi des travailleurs handicapés (6 %), États des lieux (8 ans), Lanceurs d'alerte (canal ouvert aux salariés dans Échanges RH), Affichages, accords et référents (règlement intérieur, participation, partage de la valeur, pénibilité, référents, contributions).
- Reporting RH : indicateurs (effectifs, absences, recrutement, masse salariale…).
- Paramètres (RH, pictogramme engrenage dans le bandeau) : sections Entreprise (nom, raison sociale, adresse, SIRET, NAF, Urssaf, domaine e-mail, signataire, logo affiché en tête des documents), Convention et temps de travail (Syntec ou aucune convention = Code du travail ; durée hebdomadaire 1 à 48 h, forfait jours 218 au plus, télétravail maximum), Sites (adresse, abonnement transport remboursé à 50 %), Services et Direction (responsable de chaque service), Collaborateurs (import d'un fichier CSV : prenom, nom, email, poste, service, contrat, entree, salaire, manager par e-mail, site ; aperçu ligne par ligne avant import), Utilisateurs et droits (administrateurs RH, motif des arrêts visible ou non par les managers, organigramme visible par les salariés), Absences (décompte ouvrés/ouvrables, RTT / sans solde / télétravail activables, remplaçant d'un manager absent), Paie (prestataire, jour de clôture, titres-restaurant, mutuelle avec part employeur d'au moins 50 %, allocation télétravail), Recrutement (conservation 2 ans au plus selon la CNIL, relance), Historique des modifications. La jauge « Espace prêt à … % » et la liste « Reste à régler » indiquent ce qui manque. Une erreur bloquante empêche d'enregistrer une valeur illégale ; un avertissement signale un risque (exonération perdue…).
- Nouvelle entreprise : en bas de page, « Tester l'installation (nouvelle entreprise) » ouvre une entreprise vierge avec l'assistant de démarrage (Bienvenue et compte administrateur, Entreprise, Convention, Sites, Services, Collaborateurs, Paie, Récapitulatif) ; chaque étape peut être passée et complétée plus tard dans Paramètres. « Revenir à la démo Nova Studio » en bas de page.
- Espace salarié : Mon profil (informations, demander une modification avec justificatif, documents, organigramme), Mes absences, Mes bulletins, Mes entretiens, Formations, Mobilité, Santé. Une recrue qui n'est pas encore arrivée ne voit que « Mon arrivée » (pièces à déposer) et « Contrat de travail » (signature).

DONNÉES. Démonstration : les données sont fictives et restent dans le navigateur ; « Réinitialiser la démo » en bas de page remet l'état initial.`;
  const HELP_RULES = `Tu t'appelles Teamo : tu es l'assistant d'aide à la prise en main intégré au logiciel RH Teamora. Ton ton est chaleureux et simple, sans familiarité excessive ni émoji. Réponds en français, en tutoyant, de façon brève et concrète (3 à 6 phrases ou une courte liste d'étapes numérotées), en t'appuyant UNIQUEMENT sur le guide ci-dessous, sur le contexte de l'écran et, pour les RH, sur la section « Obligations selon l'effectif » (effectif réel de l'entreprise, obligations, échéances, alertes : sers-t'en pour répondre précisément, rappelle que les calculs sont indicatifs, et propose le lien obligations). N'invente aucune fonction : si le guide ne couvre pas la question, dis-le simplement et propose de contacter le support. Ne réponds pas aux questions sans rapport avec Teamora ; pour une question de droit du travail, donne au plus l'orientation générale que le logiciel applique et rappelle que seul un professionnel peut valider. Adapte la réponse au profil actuel (un salarié ne voit ni la paie ni les arrivées des autres). Quand c'est utile, ajoute UN lien d'accès vers une rubrique, sous la forme exacte [[aller:CLE|Texte du bouton]], où CLE est une des clés autorisées listées dans le contexte. Mise en forme permise : **gras** et listes avec « - » ou « 1. ». Pas de titres.

${HELP_GUIDE}`;
  const helpState = { open: false, turns: [], busy: false, ctl: null, sample: undefined };
  // Teamo, l'assistant : une bulle de dialogue souriante aux couleurs de Teamora (cligne des yeux, regarde de côté quand il réfléchit).
  let teamoN = 0;
  function teamoSVG(cls = '') {
    const g = `teamo-g${teamoN += 1}`;
    return `<svg class="teamo ${cls}" viewBox="0 0 64 64" role="img" aria-label="Teamo"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f46e5"/><stop offset="1" stop-color="#0ea5c6"/></linearGradient></defs>
      <circle cx="32" cy="32" r="32" fill="url(#${g})"/><path d="M32 10.5v5.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle class="teamo-dot" cx="32" cy="9" r="3.4" fill="#fde68a"/>
      <path d="M13.5 31c0-8.3 7.6-14.5 18.5-14.5S50.5 22.7 50.5 31v5c0 8.3-7.6 13.5-18.5 13.5h-5.6l-7.6 5.6 1.7-7C15.6 45.6 13.5 41.6 13.5 36z" fill="#fff"/>
      <g class="teamo-eyes"><ellipse cx="25" cy="32.5" rx="3.1" ry="3.7" fill="#1e1b4b"/><ellipse cx="39" cy="32.5" rx="3.1" ry="3.7" fill="#1e1b4b"/><circle cx="26.1" cy="31.2" r="1" fill="#fff"/><circle cx="40.1" cy="31.2" r="1" fill="#fff"/></g>
      <path d="M26.5 40.2c3.2 3 7.8 3 11 0" stroke="#1e1b4b" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="20.2" cy="38.6" r="2.3" fill="#f9a8d4" opacity=".85"/><circle cx="43.8" cy="38.6" r="2.3" fill="#f9a8d4" opacity=".85"/></svg>`;
  }
  // V3 · ce que Teamo sait des obligations : uniquement des données agrégées sur l'entreprise (RGPD).
  // Jamais de nom, de salaire, ni de détail sur les obligations sensibles (handicap, signalements, référents, états des lieux individuels).
  const HELP_SAFE = ['dpae', 'registre', 'duerp', 'affichages', 'medical', 'entretienpro', 'mutuelle', 'cse', 'formation1', 'mobilite', 'partage', 'cse50', 'nao', 'index', 'index5', 'ri', 'participation', 'restauration', 'penibilite', 'logement', 'pse', 'alternants', 'cssct', 'gepp', 'rixain'];
  function helpCompliance() {
    if (ui.profile !== 'rh' || ui.selfOf || !db.compliance) return '';
    const st = effState(), obl = obligations(), next = SEUILS.find((n) => st.avg12 < n), safe = (x) => (HELP_SAFE.includes(x.k) ? (x.state.l.replace(/\s*·?\s*≈[^·]*€[^·]*/g, '').trim() || null) : null); // sans les montants estimés (ils révéleraient la masse salariale)
    const stat = (x) => (x.on ? `${PILL_S[x.state.s][1]}${safe(x) ? ` (${safe(x)})` : ''}` : x.soon ? `à venir en ${monthLabel(x.soon.m).toLowerCase()} (${x.soon.why})` : 'non applicable');
    const line = (x) => `- [${x.seuil || 'dès 1'}] ${x.title} · règle : ${RULE_LABEL[x.rule]} · ${stat(x)}`;
    const concerned = obl.filter((x) => !x.seuil || st.avg12 >= x.seuil || x.on || x.soon);
    return `OBLIGATIONS SELON L'EFFECTIF (données agrégées, calcul indicatif à faire valider par un professionnel du droit social)
${st.sim ? `ATTENTION : simulation en cours (effectif simulé de ${fmtN(db.compliance.sim.n)}), pas les données réelles.
` : ''}Effectif moyen sur 12 mois : ${fmtN(st.avg12)} (équivalent temps plein, hors alternants et stagiaires) · aujourd’hui : ${fmtN(st.now)}
Convention collective : ${CONV().kind === 'code' ? 'aucune (Code du travail)' : `${CONV().short} (IDCC ${CONV().idcc})${CONV().ok ? '' : ', règles non encore vérifiées : minima du Code du travail appliqués'}`}
Effectifs moyens par année : ${Object.entries(st.years).map(([y, v]) => `${y} : ${v === null ? 'non renseigné' : fmtN(v)}`).join(' ; ')}
Effectif prévu (arrivées et départs déjà connus) : ${st.proj.filter((x, i) => i % 3 === 2).map((x) => `${monthLabel(x.m).toLowerCase()} : ${fmtN(x.v)}`).join(' ; ')}
Prochain seuil : ${next ? `${next} salariés${projCross(next, st) ? ` (prévu en ${monthLabel(projCross(next, st).m).toLowerCase()})` : ' (pas dans les 12 prochains mois)'}` : 'aucun'}
Obligations qui concernent l'entreprise :
${concerned.map(line).join('\n')}
${next ? `Ce qui arrivera à ${next} salariés :
${obl.filter((x) => x.seuil === next).map((x) => `- ${x.title} (${RULE_LABEL[x.rule]})`).join('\n')}
` : ''}Alertes en cours : ${complianceTodo().filter((x) => !/^al/.test(x.k)).map((x) => { const o = obl.find((y) => y.k === x.k); return o ? `${x.l}${safe(o) ? ` (${safe(o)})` : ''}` : x.l; }).join(' ; ') || 'aucune'}
Pour simuler une embauche : chaque salarié à temps plein en CDI ou CDD compte pour 1 (temps partiel au prorata) ; les alternants et stagiaires ne comptent pas.

`;
  }
  function helpContext() {
    const v = ui.view, title = v === 'etape' ? stageDef(ui.stage).title : (VIEW_LABELS[ui.profile] || {})[v] || v;
    const targets = visibleStages().map((i) => [stageView(i), stageDef(i).short]).concat(ui.profile === 'rh' ? [['reporting', 'Reporting RH'], ['modeles', 'Modèles de documents'], ['obligations', 'Obligations selon l’effectif'], ['parametres', 'Paramètres']] : []).concat([['accueil', 'Accueil (roue)']]);
    const todo = todoItems().map((x) => `${x.name} : ${x.n}`).join(', ') || 'rien';
    return `${helpCompliance()}CONTEXTE DE L'ÉCRAN
Profil : ${PROFILES[persona()].label}${ui.selfOf ? ' (dans son espace personnel)' : ''} · poste de l’utilisateur : ${me().title}
Écran ouvert : ${title}${ui.modal ? ` (fenêtre ouverte : ${ui.modal.type})` : ''}${ui.drawer ? ' (une fiche est ouverte)' : ''}
À traiter pour ce profil : ${todo}
Clés de liens autorisées : ${targets.map(([k, l]) => `${k} = ${l}`).join(' ; ')}`;
  }
  function helpSuggestions() {
    const v = ui.view, p = ui.profile;
    const S = { arrivees: ['Comment envoyer le contrat pour signature ?', 'Comment clôturer une intégration ?'], departs: ['Comment se déroule un départ ?', 'Où voir les indemnités de sortie ?'], absences: p === 'salarie' ? ['Comment poser des congés ?', 'Comment déclarer un arrêt maladie ?'] : ['Comment valider une demande ?', 'Qui valide quand je suis absent ?'],
      paie: ['Comment préparer la paie du mois ?', 'Que faire d’un point de contrôle ?'], collaborateurs: ['Comment changer le manager d’un salarié ?', 'Comment passer quelqu’un à temps partiel ?'], recrutement: ['Comment faire avancer un candidat ?', 'Que signifient les termes en orange ?'],
      modeles: ['Comment ajouter un logo dans un modèle ?', 'Comment revenir à une version précédente ?'], besoins: ['Comment créer une demande de recrutement ?'], profil: ['Comment modifier mon adresse ?', 'Où est l’organigramme ?'], bulletins: ['Comment recevoir mes bulletins en papier ?'] };
    return (S[v] || []).concat(['Par où commencer ?', 'Qu’est-ce qui m’attend ?']).slice(0, 4);
  }
  // Rendu sûr : texte échappé, puis gras, listes, sauts de ligne et boutons de navigation.
  function helpFormat(text) {
    const allowed = new Set(visibleStages().map((i) => stageView(i)).concat(['accueil'], ui.profile === 'rh' ? ['reporting', 'modeles', 'parametres', 'obligations'] : []));
    return esc(text).split(/\n{2,}/).map((block) => {
      const lines = block.split('\n'), list = lines.every((l) => /^\s*(-|\d+\.)\s+/.test(l));
      const fmt = (s) => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[\[aller:([a-z]+)\|([^\]]{1,60})\]\]/g, (m, k, l) => (allowed.has(k) ? `<button type="button" class="btn ghost sm help-go" data-go="${k}">${l}${ic('arrow')}</button>` : l));
      if (list) { const ordered = /^\s*\d+\./.test(lines[0]); return `<${ordered ? 'ol' : 'ul'}>${lines.map((l) => `<li>${fmt(l.replace(/^\s*(-|\d+\.)\s+/, ''))}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`; }
      return `<p>${fmt(lines.join('<br>'))}</p>`;
    }).join('');
  }
  function helpRender() {
    const box = document.getElementById('help'); if (!box) return;
    const s = helpState, think = s.busy && s.turns.length && !s.turns[s.turns.length - 1].content;
    const bot = (inner, extra = '') => `<div class="help-row bot ${extra}"><span class="help-mini">${teamoSVG()}</span><div class="help-msg assistant${extra.includes('err') ? ' err' : ''}">${inner}</div></div>`;
    box.innerHTML = !s.sample ? '' : `<button type="button" class="help-fab ${s.open ? 'on' : ''}" data-help="toggle" aria-expanded="${s.open}" aria-controls="help-panel" aria-label="${s.open ? 'Fermer Teamo' : 'Demander à Teamo'}">${s.open ? ic('x') : `${teamoSVG('fab-av')}<span>Teamo</span>`}</button>
      ${s.open ? `<section class="help-panel" id="help-panel" role="dialog" aria-label="Teamo, assistant Teamora">
        <header><span class="help-av">${teamoSVG(think ? 'think' : '')}</span><div><b>Teamo</b><small><i class="help-on"></i>${think ? 'réfléchit…' : 'Ton assistant Teamora'}</small></div>${s.turns.length ? `<button type="button" class="icon-btn" data-help="reset" title="Nouvelle conversation" aria-label="Nouvelle conversation">${ic('refresh')}</button>` : ''}<button type="button" class="icon-btn" data-help="toggle" title="Fermer" aria-label="Fermer Teamo">${ic('x')}</button></header>
        <div class="help-log" id="help-log" aria-live="polite">${s.turns.length ? s.turns.map((t) => (t.role === 'user' ? `<div class="help-row me"><div class="help-msg user">${esc(t.content)}</div></div>`
            : t.content ? bot(helpFormat(t.content), t.error ? 'err' : '') : bot('<span class="help-typing" aria-label="Teamo réfléchit"><i></i><i></i><i></i></span>', 'typing'))).join('')
          : `<div class="help-hello">${teamoSVG('hello')}<b>Salut ${esc(me().firstName)}, moi c’est Teamo !</b><p>Je t’aide à prendre Teamora en main. Je sais sur quel écran tu es et je peux t’emmener à la bonne rubrique.</p></div>`}</div>
        ${s.turns.length ? '' : `<div class="help-sugg"><small>Pour commencer</small>${helpSuggestions().map((q) => `<button type="button" class="help-chip" data-help="ask" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>`}
        <form class="help-form" data-help-form novalidate><label class="sr" for="help-q">Ta question à Teamo</label><textarea id="help-q" class="input" rows="1" maxlength="600" placeholder="Écris ta question à Teamo…" ${s.busy ? 'disabled' : ''}></textarea>
          ${s.busy ? `<button type="button" class="icon-btn help-send stop" data-help="stop" title="Arrêter" aria-label="Arrêter la réponse"><span class="sq"></span></button>` : `<button class="icon-btn help-send" title="Envoyer" aria-label="Envoyer">${ic('arrow')}</button>`}</form>
        <p class="help-note">Teamo s’appuie sur Claude : ses réponses peuvent contenir des erreurs. Démo sur ton compte Claude.${ui.profile === 'rh' && !ui.selfOf ? ' Teamo voit l’écran ouvert, l’effectif et l’état des obligations, sans aucune donnée individuelle.' : ' Aucune donnée de salarié n’est envoyée.'}</p></section>` : ''}`;
    const log = document.getElementById('help-log'); if (log) log.scrollTop = log.scrollHeight;
  }
  async function helpAsk(q) {
    const s = helpState; q = (q || '').trim(); if (!q || s.busy || !s.sample) return;
    s.turns.push({ role: 'user', content: q }); const reply = { role: 'assistant', content: '' }; s.turns.push(reply); s.busy = true; helpRender();
    const ctl = new AbortController(); s.ctl = ctl;
    // Consignes et guide dans un premier tour « user » toujours conservé ; contexte de l'écran au moment de la question ; 6 derniers échanges.
    const history = s.turns.slice(0, -2).filter((t) => t.content && !t.error).slice(-12).map((t) => ({ role: t.role, content: t.content }));
    const input = [{ role: 'user', content: HELP_RULES }, ...history, { role: 'user', content: `${helpContext()}\n\nQUESTION : ${q}` }];
    try {
      const { text, truncated } = await s.sample(input, { cache: false, modelTier: 'quick', signal: ctl.signal, onText: ({ text: t }) => { reply.content = t; const row = document.querySelector('#help-log .help-row.bot:last-child'); if (row) { row.classList.remove('typing'); row.querySelector('.help-msg').innerHTML = helpFormat(t); const hv = document.querySelector('.help-panel header .teamo'); if (hv) hv.classList.remove('think'); const st = document.querySelector('.help-panel header small'); if (st) st.innerHTML = '<i class="help-on"></i>écrit…'; } const lg = document.getElementById('help-log'); if (lg) lg.scrollTop = lg.scrollHeight; } });
      reply.content = text + (truncated ? '\n\n(Réponse coupée : pose une question plus précise.)' : '');
    } catch (e) {
      const code = e && e.code;
      if (code === 'not_granted' || code === 'sampling_disabled' || code === 'not_declared' || code === 'capability_disabled' || code === 'capability_removed') { reply.content = 'L’assistant n’est pas autorisé dans cette vue. Tu peux l’autoriser depuis le menu Permissions de la page.'; reply.error = true; }
      else if (code === 'cancelled') { reply.content = (e.text || '') + (e.text ? '\n\n(Interrompu.)' : 'Question annulée.'); }
      else if (code === 'rate_limited') { reply.content = 'Trop de questions d’un coup : réessaie dans un instant.'; reply.error = true; }
      else if (code === 'refused') { reply.content = 'Je ne peux pas répondre à cette question. Reformule-la autour de l’utilisation de Teamora.'; reply.error = true; }
      else if (code === 'session_expired') { reply.content = 'Ta session Claude a expiré : reconnecte-toi puis réessaie.'; reply.error = true; }
      else { reply.content = (e && e.text) ? `${e.text}\n\n(Réponse interrompue, réessaie.)` : 'Je n’ai pas pu répondre (problème de connexion). Réessaie.'; reply.error = !(e && e.text); }
    } finally { s.busy = false; s.ctl = null; helpRender(); const ta = document.getElementById('help-q'); if (ta && s.open) ta.focus(); }
  }
  function helpInit() {
    if (DEMO) return; // en démo, Teamo guide la visite (tour) au lieu de répondre aux questions
    let box = document.getElementById('help'); if (!box) { box = document.createElement('div'); box.id = 'help'; document.body.appendChild(box); }
    box.addEventListener('click', (ev) => {
      const t = ev.target.closest('[data-help], .help-go'); if (!t) return;
      const a = t.dataset.help;
      if (a === 'toggle') { helpState.open = !helpState.open; helpRender(); if (helpState.open) { const ta = document.getElementById('help-q'); if (ta) ta.focus(); } }
      else if (a === 'ask') helpAsk(t.dataset.q);
      else if (a === 'stop') { if (helpState.ctl) helpState.ctl.abort(); }
      else if (a === 'reset') { helpState.turns = []; helpRender(); }
      else if (t.classList.contains('help-go')) { const k = t.dataset.go; Object.assign(ui, { modal: null, drawer: null, notif: false });
        if (k === 'accueil' || k === 'reporting' || k === 'modeles' || k === 'parametres' || k === 'obligations') ACT.go({ v: k }); else { const i = visibleStages().find((x) => stageView(x) === k); if (i !== undefined) ACT.stage({ i }); } }
    });
    box.addEventListener('submit', (ev) => { ev.preventDefault(); const ta = document.getElementById('help-q'); const q = ta.value; ta.value = ''; helpAsk(q); });
    box.addEventListener('keydown', (ev) => { if (ev.target.id === 'help-q' && ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); box.querySelector('[data-help-form]').requestSubmit(); } if (ev.key === 'Escape' && helpState.open) { ev.stopPropagation(); helpState.open = false; helpRender(); } });
    helpRender();
    // L'assistant n'apparaît que si la page peut interroger Claude (page publiée sur claude.ai, capacité déclarée).
    const C = window.claude;
    if (!C || typeof C.use !== 'function') { helpState.sample = null; helpRender(); return; }
    C.use('sample').then((fn) => { helpState.sample = fn || null; helpRender(); }).catch(() => { helpState.sample = null; helpRender(); });
  }
  function switchTenant(t, fresh) {
    save(); saveUI(); TENANT = t; try { localStorage.setItem('teamora-v3-tenant', t); } catch (e) { /* ignore */ } setStores();
    db = fresh ? blankSeed() : load(); normalizeSettings(); applySettings(); normalizeCompliance(); normalizeEmployees(); ensureSignedContracts(); normalizeDocs(); syncArrivals(); save();
    ui = Object.assign({ profile: 'rh', view: t === 'new' ? 'setup' : 'accueil', stage: null }, fresh ? {} : loadUI(), freshUI(), { modal: null, wizStep: fresh ? 'bienvenue' : (loadUI().wizStep || 'bienvenue') });
    ui.orgZoom = Number(ui.orgZoom) || 1; ui.orgFold = ui.orgFold || {}; if (!PROFILES[ui.profile]) ui.profile = 'rh';
    window.scrollTo(0, 0); render(); toast(t === 'new' ? 'Nouvelle entreprise : suis l’assistant pour paramétrer Teamora' : 'Retour à la démo Nova Studio');
  }
  normalizeSettings(); applySettings(); normalizeCompliance();
  normalizeEmployees(); ensureSignedContracts(); normalizeDocs(); applyDueSalaries(); applyDueManagers(); applyDueChanges(); purgeCandidates(); syncArrivals(); arrivalReminders(); needReminders(); save();
  // Les nouveautés ne s'ouvrent plus d'elles-mêmes (un testeur arrive directement dans l'application) : bouton « Nouveautés de la V3 » en bas de page.

  // ================================================================ V2 · Recherche de salarié
  // Toute liste déroulante dont les valeurs sont des salariés devient un champ de recherche avec suggestions.
  // La liste d'origine reste dans le formulaire (cachée) : nom du champ, data-change et data-live continuent de fonctionner.
  const pickNorm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function enhanceEmpSelects(root = document) {
    root.querySelectorAll('select:not([data-picked])').forEach((sel) => {
      const opts = [...sel.options], vals = opts.map((o) => o.value).filter(Boolean);
      // Listes de salariés, et toute liste marquée data-search (nationalités…).
      const isEmp = vals.length > 0 && vals.every((v) => emp(v)); if (!isEmp && !sel.dataset.search) return;
      sel.dataset.picked = '1';
      const blank = opts.find((o) => !o.value), placeholder = sel.dataset.placeholder || (blank && /…$/.test(blank.textContent.trim()) ? blank.textContent.trim() : 'Rechercher un salarié…');
      const none = blank && !/…$/.test(blank.textContent.trim()) ? blank.textContent.trim() : null;
      const noMatch = isEmp ? 'Aucun salarié ne correspond' : 'Aucune proposition ne correspond';
      const items = opts.filter((o) => o.value).map((o) => { const t = o.textContent.trim();
        if (!isEmp) { const g = o.dataset.sub || (o.parentElement.tagName === 'OPTGROUP' ? o.parentElement.label : ''); return { v: o.value, t, sub: g, key: pickNorm(`${t} ${g}`), names: pickNorm(t).split(/[\s-]+/) }; }
        const e = emp(o.value); return { v: o.value, t, sub: [e.title, e.dept].filter((x) => x && !t.includes(x)).join(' · '), key: pickNorm(`${t} ${e.title} ${e.dept} ${e.email}`), names: pickNorm(`${e.firstName} ${e.lastName}`).split(/[\s-]+/) }; });
      const wrap = document.createElement('span'); wrap.className = 'emp-pick' + (sel.classList.contains('as-emp') ? ' top' : '') + (sel.classList.contains('sm') ? ' sm' : '');
      const q = document.createElement('input'); q.type = 'search'; q.className = 'input' + (sel.classList.contains('sm') ? ' sm' : ''); q.placeholder = placeholder; q.autocomplete = 'off'; q.disabled = sel.disabled;
      q.setAttribute('role', 'combobox'); q.setAttribute('aria-autocomplete', 'list'); q.setAttribute('aria-expanded', 'false');
      const lab = sel.id && document.querySelector(`label[for="${sel.id}"]`); q.id = `${sel.id || 'pick'}-q${Math.random().toString(36).slice(2, 6)}`;
      if (lab) lab.htmlFor = q.id; q.setAttribute('aria-label', (lab && lab.textContent.trim()) || sel.getAttribute('aria-label') || (isEmp ? 'Salarié' : 'Recherche'));
      const list = document.createElement('div'); list.className = 'pick-list'; list.setAttribute('role', 'listbox'); list.hidden = true;
      const curText = () => { const it = items.find((x) => x.v === sel.value); return it ? it.t : ''; };
      q.value = curText(); let shown = [], hi = -1;
      const draw = () => {
        const n = pickNorm(q.value.trim()), ws = n.split(/\s+/).filter(Boolean), searching = !!n && n !== pickNorm(curText());
        // Les personnes dont le prénom ou le nom commence par la saisie passent devant (poste, service, e-mail ensuite).
        const score = (x) => ws.filter((w) => x.names.some((nm) => nm.startsWith(w))).length;
        const all = searching ? items.filter((x) => ws.every((w) => x.key.includes(w))).sort((a, z) => score(z) - score(a)) : items;
        shown = (none ? [{ v: '', t: none, sub: '' }] : []).concat(all.slice(0, 60));
        if (searching && hi === -2) hi = none && all.length ? 1 : 0; hi = Math.min(Math.max(hi, 0), shown.length - 1);
        list.innerHTML = shown.length ? shown.map((x, i) => `<div class="pick-o ${i === hi ? 'hi' : ''} ${x.v === sel.value ? 'cur' : ''} ${x.v ? '' : 'none'}" role="option" data-i="${i}" aria-selected="${i === hi}"><b>${esc(x.t)}</b>${x.sub ? `<small>${esc(x.sub)}</small>` : ''}</div>`).join('')
          + (all.length > 60 ? `<div class="pick-more">${all.length - 60} autres : précise la recherche</div>` : '') + (all.length ? '' : `<div class="pick-more">${noMatch}</div>`) : `<div class="pick-more">${noMatch}</div>`;
        list.hidden = false; q.setAttribute('aria-expanded', 'true');
        const h = list.querySelector('.hi'); if (h) h.scrollIntoView({ block: 'nearest' });
      };
      const close = () => { list.hidden = true; q.setAttribute('aria-expanded', 'false'); hi = -1; };
      const choose = (x) => { close(); q.value = x.v ? x.t : ''; if (sel.value !== x.v) { sel.value = x.v; sel.dispatchEvent(new Event('change', { bubbles: true })); } };
      q.addEventListener('focus', () => { hi = Math.max(0, shown.findIndex((x) => x.v === sel.value)); q.select(); draw(); });
      q.addEventListener('input', (ev) => { ev.stopPropagation(); hi = -2; draw(); });
      q.addEventListener('change', (ev) => ev.stopPropagation());
      q.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); if (list.hidden) draw(); hi = (hi + (ev.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length; draw(); }
        else if (ev.key === 'Enter') { if (!list.hidden && shown[hi]) { ev.preventDefault(); choose(shown[hi]); } }
        else if (ev.key === 'Escape') { if (!list.hidden) { ev.preventDefault(); ev.stopPropagation(); close(); q.value = curText(); } }
      });
      q.addEventListener('blur', () => { setTimeout(() => { if (document.activeElement === q) return; close(); if (!q.value.trim() && none !== null && sel.value) choose({ v: '', t: none }); else q.value = curText(); }, 120); });
      list.addEventListener('mousedown', (ev) => { ev.preventDefault(); const o = ev.target.closest('.pick-o'); if (o) choose(shown[Number(o.dataset.i)]); });
      sel.addEventListener('change', () => { if (document.activeElement !== q) q.value = curText(); });
      sel.hidden = true; sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
      sel.parentNode.insertBefore(wrap, sel); wrap.append(q, list, sel);
    });
  }
  new MutationObserver(() => enhanceEmpSelects()).observe(document.body, { childList: true, subtree: true });
  if (DEMO && isMob() && ui.profile !== 'salarie') Object.assign(ui, { profile: 'salarie', selfOf: null, view: 'accueil', stage: null });
  render(); helpInit();
  if (DEMO) { let seen = false; try { seen = !!localStorage.getItem(TOUR_KEY); } catch (e) { /* ignore */ } if (!seen) setTimeout(tourStart, 500); }
})();
