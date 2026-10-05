// Teamora — aperçu fonctionnel du logiciel RH (sans base de données).
// Rendu par chaînes HTML + délégation d'événements ; état persistant dans localStorage.
(function () {
  'use strict';

  const STAGES = window.TEAMORA_STAGES;
  const STAGE_COLORS = ['#6366f1', '#7c3aed', '#a855f7', '#c026d3', '#db2777', '#e11d48', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a', '#059669', '#0d9488', '#0891b2', '#0284c7', '#2563eb'];
  const P = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2c2.6-.4 4.4 1.2 5 4.3"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    wallet: '<rect x="2.5" y="6" width="19" height="13" rx="2"/><path d="M2.5 10h19M7 15h3"/>',
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
  const STORE = 'teamora-demo-v1', UI_STORE = 'teamora-ui-v1';
  function load() {
    try { const d = JSON.parse(localStorage.getItem(STORE)); if (d && d.version === 2) return d; } catch (e) { /* ignore */ }
    return window.TEAMORA_SEED();
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) { /* storage unavailable */ } }
  function loadUI() { try { return JSON.parse(localStorage.getItem(UI_STORE)) || {}; } catch (e) { return {}; } }
  function saveUI() { try { localStorage.setItem(UI_STORE, JSON.stringify({ profile: ui.profile, view: ui.view, stage: ui.stage })); } catch (e) { /* ignore */ } }

  let db = load();
  const PROFILES = {
    rh: { emp: 'e1', label: 'RH' },
    manager: { emp: 'e2', label: 'Manager' },
    salarie: { emp: 'e3', label: 'Salarié' },
  };
  const freshUI = () => ({ wheelOpen: false, selPerson: null, q: '', fDept: '', fStatus: '', sort: 'name', sortDir: 1,
    absTab: 'valider', histStatus: '', planMonth: null, payMonth: null, recJob: null, drawer: null, modal: null, notif: false,
    revTab: '', trTab: '', mobTab: '', healthTab: '', qvtMonth: null, caseStatus: '' });
  let ui = Object.assign({ profile: 'rh', view: 'accueil', stage: null }, loadUI(), freshUI());
  if (!PROFILES[ui.profile]) ui.profile = 'rh';

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
  const me = () => emp(PROFILES[ui.profile].emp);
  const fullName = (e) => (e ? `${e.firstName} ${e.lastName}` : '—');
  const initials = (e) => (e.firstName[0] + e.lastName[0]).toUpperCase();
  const AV_COLORS = ['#6366f1', '#db2777', '#0891b2', '#d97706', '#059669', '#7c3aed', '#e11d48', '#0284c7', '#c026d3', '#0d9488'];
  const avColor = (id) => { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return AV_COLORS[h % AV_COLORS.length]; };
  const avatar = (e, cls = '') => `<span class="av ${cls}" style="background:${avColor(e.id)}" aria-hidden="true">${esc(initials(e))}</span>`;
  const avatarName = (id, name, cls = '') => `<span class="av ${cls}" style="background:${avColor(id)}" aria-hidden="true">${esc(name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase())}</span>`;
  const DEPTS = ['Direction', 'RH', 'Design', 'Tech', 'Marketing', 'Sales', 'Finance'];
  const DEPT_HEAD = { Direction: 'e5', RH: 'e1', Design: 'e2', Tech: 'e6', Marketing: 'e7', Sales: 'e8', Finance: 'e9' };
  const stageChip = (i) => `<span class="stage-chip"><i style="background:${STAGE_COLORS[i]}"></i>${esc(STAGES[i].short)}</span>`;

  const leaveOn = (e, day) => db.leaves.find((l) => l.empId === e.id && l.status === 'Approuvée' && l.start <= day && l.end >= day);
  function statusOf(e) {
    if (e.stage >= 15) return ['Sorti', 'neutral'];
    if (e.stage >= 13) return ['Préavis', 'bad'];
    if (e.stage === 2) return ['Pré-embauche', 'accent'];
    if (e.stage <= 4) return ["Période d'essai", 'accent'];
    const l = leaveOn(e, TODAY);
    if (l) return l.type === 'Télétravail' ? ['Télétravail', 'info'] : ['Absent', 'warn'];
    return ['Actif', 'ok'];
  }
  const statusPill = (e) => { const [t, c] = statusOf(e); return `<span class="pill ${c}">${t}</span>`; };
  const isEmployed = (e) => e.stage >= 3 && e.stage < 15;

  function scopeEmployees() {
    const m = me();
    if (ui.profile === 'rh') return db.employees;
    if (ui.profile === 'manager') return db.employees.filter((e) => e.managerId === m.id);
    return [m];
  }
  const scopeJobs = () => (ui.profile === 'rh' ? db.jobs : ui.profile === 'manager' ? db.jobs.filter((j) => j.dept === me().dept) : []);
  const activeCand = (c) => !['Embauché', 'Refusé'].includes(c.stage);
  const scopeCandidates = () => { const ids = new Set(scopeJobs().filter((j) => j.status === 'Ouverte').map((j) => j.id)); return db.candidates.filter((c) => ids.has(c.jobId)); };
  function pendingForMe() {
    if (ui.profile === 'rh') return db.leaves.filter((l) => l.status === 'En attente');
    if (ui.profile === 'manager') { const team = new Set(scopeEmployees().map((e) => e.id)); return db.leaves.filter((l) => l.status === 'En attente' && team.has(l.empId)); }
    return [];
  }
  const approverOf = (e) => (e.managerId ? emp(e.managerId) : emp('e1'));

  function notify(to, text) { if (to) db.notifications.unshift({ id: uid('n'), to, text, date: TODAY, read: false }); }
  function toast(msg, kind = 'ok') {
    const box = document.getElementById('toasts');
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = (kind === 'ok' ? ic('check') : '') + `<span>${esc(msg)}</span>`;
    box.appendChild(t); setTimeout(() => t.remove(), 3600);
  }
  function journeyOf(id, stage) {
    const n = STAGES[stage].steps.length;
    const arr = (db.journey[id] && db.journey[id][stage]) || [];
    return Array.from({ length: n }, (_, k) => !!arr[k]);
  }

  // ---------------------------------------------------------------- Payroll
  const RATES = [['Santé · prévoyance', 0.015], ['Retraite de base et complémentaire', 0.113], ['CSG · CRDS', 0.0904]];
  const TAX_RATE = 0.075;
  const PAY_FIRST = '2026-07';
  function payMonths() { const last = monthKey(TODAY) > '2026-10' ? monthKey(TODAY) : '2026-10'; const out = []; for (let m = PAY_FIRST; m <= last; m = shiftMonth(m, 1)) out.push(m); return out; }
  const payrollOf = (m) => (db.payroll[m] = db.payroll[m] || { closed: false, bonus: {} });
  function inPayroll(e, m) { const start = m + '-01', end = monthEnd(m); if (e.startDate > end) return false; if (e.exit && e.exit.lastDay < start) return false; return e.stage >= 2 || e.startDate <= end; }
  function calcPay(e, m) {
    const start = m + '-01', end = monthEnd(m);
    let base = e.salary / 12;
    if (e.startDate > start) base *= workDays(e.startDate, end) / Math.max(1, workDays(start, end));
    if (e.exit && e.exit.lastDay < end) base *= workDays(start, e.exit.lastDay) / Math.max(1, workDays(start, end));
    const bonus = Number(payrollOf(m).bonus[e.id] || 0);
    const gross = base + bonus;
    const lines = RATES.map(([l, r]) => [l, r, gross * r]);
    const contrib = lines.reduce((s, x) => s + x[2], 0);
    const netBefore = gross - contrib, tax = netBefore * TAX_RATE;
    const leaveDays = db.leaves.filter((l) => l.empId === e.id && l.status === 'Approuvée' && ['Congés payés', 'RTT'].includes(l.type) && l.start <= end && l.end >= start)
      .reduce((s, l) => s + workDays(l.start < start ? start : l.start, l.end > end ? end : l.end), 0);
    return { base, bonus, gross, lines, contrib, netBefore, tax, net: netBefore - tax, leaveDays };
  }

  // ---------------------------------------------------------------- Shell
  // The wheel is the main menu: each stage of the journey opens a module. A profile only sees the stages it needs.
  // 'etape' = the stage page itself (people at this stage and their tasks); 'etape-moi' = shown to an employee on their current stage only.
  const STAGE_VIEW = {
    rh: ['recrutement', 'recrutement', 'etape', 'etape', 'etape', 'collaborateurs', 'absences', 'paie', 'entretiens', 'formation', 'mobilite', 'sante', 'relations', 'etape', 'etape', 'etape'],
    manager: ['recrutement', 'recrutement', 'etape', 'etape', 'etape', 'collaborateurs', 'absences', null, 'entretiens', 'formation', 'mobilite', 'sante', 'relations', 'etape', 'etape', 'etape'],
    salarie: [null, null, 'etape-moi', 'etape-moi', 'etape-moi', 'profil', 'absences', 'bulletins', 'entretiens', 'formation', 'mobilite', 'sante', 'relations', 'etape-moi', 'etape-moi', 'etape-moi'],
  };
  const VIEW_LABELS = {
    rh: { accueil: 'Accueil', collaborateurs: 'Collaborateurs', absences: 'Absences', paie: 'Paie', recrutement: 'Recrutement', entretiens: 'Entretiens', formation: 'Formation', mobilite: 'Mobilité', sante: 'Santé & QVT', relations: 'Relations individuelles' },
    manager: { accueil: 'Accueil', collaborateurs: 'Mon équipe', absences: 'Absences', recrutement: 'Recrutement', entretiens: 'Entretiens', formation: 'Formation', mobilite: 'Mobilité', sante: 'Santé & QVT', relations: 'Signalements' },
    salarie: { accueil: 'Mon parcours', profil: 'Mon profil', absences: 'Mes absences', bulletins: 'Mes bulletins', entretiens: 'Mes entretiens', formation: 'Formations', mobilite: 'Mobilité', sante: 'Santé & QVT', relations: 'Échanges RH' },
  };
  // Stage indexes shown in the wheel for the current profile, in journey order.
  function visibleStages() {
    return STAGES.map((s, i) => i).filter((i) => { const v = STAGE_VIEW[ui.profile][i]; return v === 'etape-moi' ? me().stage === i : !!v; });
  }
  const stageView = (i) => (STAGE_VIEW[ui.profile][i] === 'etape-moi' ? 'etape' : STAGE_VIEW[ui.profile][i]);
  const canView = (v) => v === 'accueil' || (v === 'etape' ? visibleStages().includes(ui.stage) : visibleStages().some((i) => stageView(i) === v));
  function navCount(v) {
    if (v === 'absences') return pendingForMe().length;
    if (v === 'recrutement' && ui.profile === 'rh') return db.jobs.filter((j) => j.status === 'Brouillon').length;
    const p = ui.profile, m = me(), ids = new Set(scopeEmployees().map((e) => e.id));
    if (v === 'entretiens') return db.reviews.filter((r) => (p === 'salarie' ? r.empId === m.id && ['Planifié', 'À signer'].includes(r.status)
      : p === 'manager' ? ids.has(r.empId) && ['À planifier', 'Auto-évaluation faite'].includes(r.status) : r.status === 'À planifier')).length;
    if (v === 'formation') return p === 'rh' ? db.enrollments.filter((x) => x.status === 'Validée manager').length : p === 'manager' ? db.enrollments.filter((x) => x.status === 'Demandée' && ids.has(x.empId)).length : 0;
    if (v === 'mobilite') return p === 'rh' ? db.wishes.filter((w) => w.status === 'Exprimé').length : p === 'manager' ? db.wishes.filter((w) => ids.has(w.empId) && !w.mgrOpinion && ['Exprimé', 'En étude'].includes(w.status)).length : 0;
    if (v === 'sante') return p === 'rh' ? db.incidents.filter((x) => x.status === 'Déclaré').length + db.adjustments.filter((x) => x.status === 'Demandé').length
      : p === 'salarie' && !db.survey.some((x) => x.empId === m.id && x.month === monthKey(TODAY)) ? 1 : 0;
    if (v === 'relations') return p === 'rh' ? db.cases.filter((c) => c.status === 'Ouvert').length : 0;
    return 0;
  }
  // Badge on a stage: people (or needs, candidates) at that stage, or the module's items waiting for me.
  function stageBadge(i) {
    const v = stageView(i);
    if (ui.profile !== 'salarie' && ['etape', 'recrutement', 'collaborateurs'].includes(v)) { const n = stageCount(i); return n ? `<span class="badge num">${n}</span>` : ''; }
    const n = v === 'etape' ? 0 : navCount(v);
    return n ? `<span class="badge todo num" title="À traiter">${n}</span>` : '';
  }
  function topbar() {
    const st = ui.view === 'accueil' ? null : ui.stage;
    const title = ui.view === 'etape' ? esc(STAGES[st].title) : VIEW_LABELS[ui.profile][ui.view];
    const crumb = st === null ? `Nova Studio · ${esc(fullName(me()))}` : `<b style="color:${STAGE_COLORS[st]}">${esc(STAGES[st].title)}</b>`;
    const mine = db.notifications.filter((n) => n.to === me().id);
    const unread = mine.filter((n) => !n.read).length;
    return `<header class="top"><button type="button" class="brand" data-act="go" data-v="accueil" aria-label="Teamora · retour à la roue"><span class="brand-mark">${LOGO}</span><span class="brand-t">Teamora<small>Nova Studio</small></span></button>
      <div class="top-title"><div class="crumb">${crumb}</div><h1>${title}</h1></div>
      <div class="top-right"><div class="persona" role="group" aria-label="Voir l’application en tant que">${Object.entries(PROFILES).map(([k, p]) => { const e = emp(p.emp);
        return `<button type="button" data-act="persona" data-p="${k}" aria-pressed="${ui.profile === k}">${avatar(e)}<span class="who-name">${esc(e.firstName)} ·</span> ${p.label}</button>`; }).join('')}</div>
      <button type="button" class="icon-btn" data-act="notif" aria-label="Notifications (${unread} non lues)" aria-expanded="${ui.notif}">${ic('bell')}${unread ? `<span class="dot num">${unread}</span>` : ''}</button></div>
      ${ui.notif ? `<div class="card notif-pop" data-act="noop"><div class="card-h"><h3>Notifications</h3>${unread ? '<button type="button" class="btn ghost sm" data-act="notif-read">Tout marquer comme lu</button>' : ''}</div>
        ${mine.length ? mine.slice(0, 8).map((n) => `<div class="notif ${n.read ? '' : 'unread'}"><div>${esc(n.text)}<small>${fmtDate(n.date)}</small></div></div>`).join('') : '<div class="empty">Aucune notification.</div>'}</div>` : ''}</header>`;
  }
  // Outside the home page, the wheel's stages stay reachable as a strip, in the same order and colours.
  function stageRail() {
    if (ui.view === 'accueil') return '';
    return `<nav class="rail" aria-label="Étapes du parcours"><button type="button" class="rail-home" data-act="go" data-v="accueil" aria-label="Retour à la roue" title="Retour à la roue">${ic('home')}</button>
      ${visibleStages().map((i) => { const v = stageView(i), name = `${STAGES[i].short}${v === 'etape' ? '' : ` — ${VIEW_LABELS[ui.profile][v]}`}`;
        return `<button type="button" data-act="stage" data-i="${i}" style="--c:${STAGE_COLORS[i]}" aria-label="${esc(name)}" title="${esc(name)}" ${ui.stage === i ? 'aria-current="page"' : ''}>${ic(STAGES[i].icon)}${stageBadge(i)}</button>`; }).join('')}</nav>`;
  }
  const footer = () => `<footer class="foot"><button type="button" class="btn ghost sm" data-act="reset">${ic('refresh')}Réinitialiser la démo</button>
    <p class="demo-note">Aperçu de démonstration : toutes les données sont fictives et enregistrées uniquement dans ce navigateur.</p></footer>`;

  // ---------------------------------------------------------------- Home (wheel)
  const W = { cx: 430, cy: 380, R: 250, LR: 310 };
  let wheelN = 16; // number of stages shown in the wheel for the current profile
  const ang = (k) => (-90 + k * 360 / wheelN) * Math.PI / 180;
  const nodePos = (i, r = W.R) => ({ x: Math.cos(ang(i)) * r, y: Math.sin(ang(i)) * r });
  function stageCount(i) {
    if (i === 0) return scopeJobs().filter((j) => j.status === 'Brouillon').length;
    if (i === 1) return scopeCandidates().filter(activeCand).length;
    return scopeEmployees().filter((e) => e.stage === i).length;
  }
  function kpiStrip() {
    const k = (l, v, s) => `<div class="card kpi"><span class="l">${l}</span><span class="v num">${v}</span><span class="s">${s}</span></div>`;
    if (ui.profile === 'salarie') {
      const e = me(); const closed = payMonths().filter((m) => db.payroll[m] && db.payroll[m].closed && inPayroll(e, m)); const last = closed[closed.length - 1];
      return `<div class="kpis">${k('Congés payés restants', `${e.cp} j`, 'Acquis : 2,08 j par mois')}${k('RTT restants', `${e.rtt} j`, 'Année 2026')}
        ${k('Mon parcours', esc(STAGES[e.stage].short), esc(STAGES[e.stage].title))}${k('Dernier bulletin', last ? eur0(calcPay(e, last).net) : '—', last ? `Net payé · ${monthLabel(last)}` : 'Aucun bulletin')}</div>`;
    }
    const people = scopeEmployees();
    const employed = people.filter(isEmployed);
    const away = employed.filter((e) => { const l = leaveOn(e, TODAY); return l && l.type !== 'Télétravail'; }).length;
    const trial = employed.filter((e) => e.stage <= 4).length;
    if (ui.profile === 'manager') {
      return `<div class="kpis">${k('Mon équipe', employed.length, `${plural(trial, 'personne', 'personnes')} en période d’essai`)}${k('Absents aujourd’hui', away, fmtDate(TODAY, { weekday: 'long', day: 'numeric', month: 'long' }))}
        ${k('Demandes à valider', pendingForMe().length, 'Congés, RTT, télétravail')}${k('Candidats en cours', scopeCandidates().filter(activeCand).length, `Équipe ${esc(me().dept)}`)}</div>`;
    }
    const open = db.jobs.filter((j) => j.status === 'Ouverte').length, drafts = db.jobs.filter((j) => j.status === 'Brouillon').length;
    return `<div class="kpis">${k('Effectif', employed.length, `dont ${trial} en période d’essai · ${db.employees.filter((e) => e.stage === 2).length} arrivées prévues`)}${k('Absents aujourd’hui', away, fmtDate(TODAY, { weekday: 'long', day: 'numeric', month: 'long' }))}
      ${k('Demandes à valider', pendingForMe().length, 'Absences en attente')}${k('Postes ouverts', open, drafts ? `${plural(drafts, 'besoin', 'besoins')} à valider` : 'Aucun besoin en attente')}</div>`;
  }
  function wheelHTML() {
    const sal = ui.profile === 'salarie', m = me(), vis = visibleStages();
    wheelN = vis.length;
    const nodes = vis.map((i) => {
      const s = STAGES[i], cls = sal && i === m.stage ? 'current' : '';
      return `<button type="button" class="node ${cls}" data-act="stage" data-i="${i}" style="background:${STAGE_COLORS[i]}" aria-label="${esc(s.title)} · ${esc(stageView(i) === 'etape' ? 'suivi de l’étape' : VIEW_LABELS[ui.profile][stageView(i)])}" tabindex="${ui.wheelOpen ? 0 : -1}">${ic(s.icon)}${stageBadge(i)}</button>`;
    }).join('');
    const labels = vis.map((i, k) => {
      const s = STAGES[i], v = stageView(i), p = nodePos(k, W.LR), c = Math.cos(ang(k)), sn = Math.sin(ang(k));
      let tr, align;
      if (c > 0.3) { tr = 'translate(0,-50%)'; align = 'left'; } else if (c < -0.3) { tr = 'translate(-100%,-50%)'; align = 'right'; } else { tr = sn < 0 ? 'translate(-50%,-100%)' : 'translate(-50%,0)'; align = 'center'; }
      const mod = v === 'etape' ? '' : VIEW_LABELS[ui.profile][v];
      return `<div class="lab" style="left:${W.cx + p.x}px;top:${W.cy + p.y}px;transform:${tr};text-align:${align}"><div class="lab-in"><b>${esc(s.short)}</b>${mod && mod !== s.short ? `<em>${esc(mod)}</em>` : ''}</div></div>`;
    }).join('');
    const hubText = sal ? `<small>MON PARCOURS</small><b>Étape<br>en cours</b><span class="hub-n">${esc(STAGES[m.stage].short)}</span>`
      : ui.profile === 'manager' ? `<small>PARCOURS</small><b>Équipe ${esc(m.dept)}</b><span class="hub-n num">${plural(scopeEmployees().length, 'personne', 'personnes')}</span>`
        : `<small>PARCOURS</small><b>Collaborateur</b><span class="hub-n num">${plural(db.employees.filter((e) => e.stage < 15).length, 'collaborateur', 'collaborateurs')}</span>`;
    return `<div class="wheel-box" id="wheel-box"><div class="wheel" id="wheel">${labels}${nodes}
      <button type="button" class="hub" data-act="hub" aria-expanded="${ui.wheelOpen}" aria-label="${ui.wheelOpen ? 'Replier' : 'Déplier'} le menu du parcours">${hubText}</button></div></div>
      <p class="wheel-hint" id="wheel-hint">${ui.wheelOpen ? HINT_OPEN : HINT_CLOSED}</p>`;
  }
  const HINT_OPEN = 'Cliquez sur une étape pour ouvrir son module';
  const HINT_CLOSED = 'Survolez ou touchez la roue pour afficher le menu';
  function stepsList(arr, steps, editable, empId, stage) {
    return `<div class="steps">${steps.map((t, k) => `<div class="step ${arr[k] ? 'done' : ''}">${editable
      ? `<button type="button" class="ckbox" role="checkbox" aria-checked="${arr[k]}" data-act="jcheck" data-id="${empId}" data-s="${stage}" data-k="${k}" aria-label="${esc(t)}">${ic('check')}</button>`
      : `<span class="ckbox" aria-checked="${arr[k]}">${ic('check')}</span>`}<span>${esc(t)}</span></div>`).join('')}</div>`;
  }
  function stageHead(i, closable = false) {
    const s = STAGES[i], c = STAGE_COLORS[i];
    return `<div class="stage-head"><span class="stage-ic" style="background:${c}">${ic(s.icon)}</span><div style="flex:1;min-width:0"><small style="color:${c}">ÉTAPE DU PARCOURS</small><h2>${esc(s.title)}</h2></div>
      ${closable ? `<button type="button" class="icon-btn" data-act="stage" data-i="${i}" aria-label="Fermer l’étape">${ic('x')}</button>` : ''}</div>`;
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
    const s = STAGES[i];
    if (ui.profile === 'salarie') {
      const e = me();
      const arr = i < e.stage ? s.steps.map(() => true) : i === e.stage ? journeyOf(e.id, i) : s.steps.map(() => false);
      const state = i < e.stage ? '<span class="pill ok">Terminée</span>' : i === e.stage ? '<span class="pill accent">En cours</span>' : '<span class="pill neutral">À venir</span>';
      return `<div class="card card-b">${stageHead(i)}</div><div class="card"><div class="card-h"><h3>Sous-étapes</h3>${state}</div><div class="card-b">${stepsList(arr, s.steps, false)}</div></div>${moduleBtn(i) ? `<div>${moduleBtn(i)}</div>` : ''}`;
    }
    let body;
    if (i === 0) {
      const drafts = scopeJobs().filter((j) => j.status === 'Brouillon');
      body = `<div class="card"><div class="card-h"><h3>Besoins à valider</h3><span class="pill warn">${drafts.length}</span></div><div class="card-b">${drafts.length ? drafts.map((j) => `<div class="todo"><div class="t"><b>${esc(j.title)}</b><small>${esc(j.dept)} · ${esc(j.contract)} · ${esc(j.reason)}</small></div>
        ${ui.profile === 'rh' ? `<button type="button" class="btn ok sm" data-act="job-validate" data-id="${j.id}">Valider et publier</button>` : '<span class="pill warn">En attente RH</span>'}</div>`).join('') : '<p class="muted" style="margin:0">Aucun besoin en attente.</p>'}</div></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="btn primary" data-act="job-new">${ic('plus')}Exprimer un besoin</button>${moduleBtn(i)}</div>`;
    } else if (i === 1) {
      const jobs = scopeJobs().filter((j) => j.status === 'Ouverte');
      body = `<div class="card"><div class="card-h"><h3>Offres en cours</h3><span class="pill ok">${jobs.length}</span></div><div class="card-b">${jobs.length ? jobs.map((j) => { const cs = db.candidates.filter((c) => c.jobId === j.id && activeCand(c));
        return `<div class="todo"><div class="t"><b>${esc(j.title)}</b><small>${plural(cs.length, 'candidat actif', 'candidats actifs')} · ${cs.filter((c) => c.stage === 'Entretien').length} en entretien</small></div><button type="button" class="btn ghost sm" data-act="open-job" data-id="${j.id}">Ouvrir</button></div>`; }).join('') : '<p class="muted" style="margin:0">Aucune offre ouverte.</p>'}</div></div>${moduleBtn(i)}`;
    } else {
      const people = scopeEmployees().filter((e) => e.stage === i);
      body = `<div class="card"><div class="card-h"><h3>Collaborateurs à cette étape</h3><span class="pill accent num">${people.length}</span></div><div class="card-b"><div class="people">${people.length ? people.map((e) => {
        const arr = journeyOf(e.id, i), done = arr.filter(Boolean).length, open = ui.selPerson === e.id;
        return `<button type="button" class="person-row" data-act="person" data-id="${e.id}" aria-expanded="${open}">${avatar(e)}<span class="who"><b>${esc(fullName(e))}</b><small>${esc(e.title)} · ${done}/${arr.length} tâches</small></span><span class="mini-bar"><i style="width:${(done / arr.length) * 100}%"></i></span></button>
          ${open ? `<div class="card card-b">${stepsList(arr, s.steps, true, e.id, i)}<div class="toolbar" style="margin-top:12px">
            ${ui.profile === 'rh' && i < 15 ? `<button type="button" class="btn primary sm" data-act="advance" data-id="${e.id}">Passer à « ${esc(STAGES[i + 1].short)} »${ic('arrow')}</button>` : ''}
            <button type="button" class="btn ghost sm" data-act="open-emp" data-id="${e.id}">Ouvrir la fiche</button></div>
            ${ui.profile === 'manager' ? '<p class="hint" style="margin:10px 0 0">Les RH font passer le collaborateur à l’étape suivante.</p>' : ''}</div>` : ''}`; }).join('')
        : '<p class="muted" style="margin:0">Aucun collaborateur à cette étape pour le moment.</p>'}</div></div></div>
        <div class="card"><div class="card-h"><h3>Sous-étapes de référence</h3></div><div class="card-b">${stepsList(s.steps.map(() => false), s.steps, false)}</div></div>${moduleBtn(i)}`;
    }
    return `<div class="card card-b">${stageHead(i)}</div>${body}`;
  }
  function defaultPanel() {
    if (ui.profile === 'salarie') {
      const e = me(); const i = e.stage;
      const next = db.leaves.filter((l) => l.empId === e.id && l.end >= TODAY && l.status !== 'Refusée').sort((a, b) => a.start.localeCompare(b.start));
      return `<div class="card card-b">${stageHead(i, false)}</div><div class="card"><div class="card-h"><h3>Où j’en suis</h3><span class="pill accent">En cours</span></div><div class="card-b">${stepsList(journeyOf(e.id, i), STAGES[i].steps, false)}</div></div>
        <div class="card"><div class="card-h"><h3>Mes prochaines absences</h3><button type="button" class="btn primary sm" data-act="go" data-v="absences">${ic('plus')}Poser une absence</button></div><div class="card-b">${next.length ? next.map((l) => `<div class="todo"><div class="t"><b>${esc(l.type)}</b><small>${fmtShort(l.start)} → ${fmtDate(l.end)} · ${plural(l.days, 'jour', 'jours')}</small></div>${leavePill(l)}</div>`).join('') : '<p class="muted" style="margin:0">Aucune absence prévue.</p>'}</div></div>`;
    }
    const todos = [];
    pendingForMe().forEach((l) => { const e = emp(l.empId); todos.push(`<div class="todo">${avatar(e, 'sm')}<div class="t"><b>${esc(fullName(e))} · ${esc(l.type)}</b><small>${fmtShort(l.start)} → ${fmtShort(l.end)} · ${plural(l.days, 'jour', 'jours')}</small></div><button type="button" class="btn ok sm" data-act="leave-ok" data-id="${l.id}">Valider</button><button type="button" class="btn bad sm" data-act="leave-ko" data-id="${l.id}">Refuser</button></div>`); });
    if (ui.profile === 'rh') db.jobs.filter((j) => j.status === 'Brouillon').forEach((j) => todos.push(`<div class="todo"><div class="t"><b>Besoin à valider : ${esc(j.title)}</b><small>${esc(j.dept)} · ${esc(j.contract)}</small></div><button type="button" class="btn ok sm" data-act="job-validate" data-id="${j.id}">Valider</button></div>`));
    scopeCandidates().filter((c) => c.stage === 'Proposition').forEach((c) => { const j = db.jobs.find((x) => x.id === c.jobId); todos.push(`<div class="todo">${avatarName(c.id, c.name, 'sm')}<div class="t"><b>Proposition en cours : ${esc(c.name)}</b><small>${esc(j.title)}</small></div><button type="button" class="btn ghost sm" data-act="open-cand" data-id="${c.id}">Ouvrir</button></div>`); });
    scopeEmployees().filter((e) => e.stage === 13 || e.stage === 14).forEach((e) => todos.push(`<div class="todo">${avatar(e, 'sm')}<div class="t"><b>Départ : ${esc(fullName(e))}</b><small>${e.exit ? `${esc(e.exit.reason)} · dernier jour le ${fmtDate(e.exit.lastDay)}` : 'Départ en préparation'}</small></div><button type="button" class="btn ghost sm" data-act="open-emp" data-id="${e.id}">Ouvrir</button></div>`));
    return `<div class="card"><div class="card-h"><h3>À traiter</h3><span class="pill ${todos.length ? 'warn' : 'ok'} num">${todos.length}</span></div><div class="card-b">${todos.length ? todos.join('') : '<p class="muted" style="margin:0">Rien à traiter pour le moment.</p>'}</div></div>
      <div class="card card-b"><p class="muted" style="margin:0">La roue est le menu de Teamora : chaque étape du parcours collaborateur ouvre le module qui la gère (recrutement, absences, paie, entretiens…). Le chiffre blanc indique combien de personnes, de besoins ou de candidats s’y trouvent ; le chiffre orange, ce qui vous attend.</p></div>`;
  }
  const viewHome = () => `${kpiStrip()}<div class="home"><div class="card wheel-card">${wheelHTML()}</div><div class="panel" id="panel">${defaultPanel()}</div></div>`;
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
    if (window.gsap) return window.gsap.to(el, Object.assign({}, vars, reduce ? { duration: 0, delay: 0 } : {}));
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
    box.addEventListener('mouseenter', () => { clearTimeout(closeTimer); openWheel(); });
    box.addEventListener('mouseleave', () => { closeTimer = setTimeout(closeWheel, 700); });
    box.addEventListener('focusin', () => { clearTimeout(closeTimer); openWheel(); });
    box.querySelectorAll('.node').forEach((n) => {
      n.addEventListener('mouseenter', () => tw(n, { scale: 1.14, duration: 0.2 }));
      n.addEventListener('mouseleave', () => tw(n, { scale: 1, duration: 0.2 }));
    });
  }

  // ---------------------------------------------------------------- Collaborateurs
  function filteredEmployees() {
    const q = ui.q.trim().toLowerCase();
    const list = scopeEmployees().filter((e) => (!q || `${fullName(e)} ${e.title} ${e.email} ${e.dept}`.toLowerCase().includes(q))
      && (!ui.fDept || e.dept === ui.fDept) && (!ui.fStatus || statusOf(e)[0] === ui.fStatus));
    const key = { name: (e) => e.lastName, dept: (e) => e.dept, start: (e) => e.startDate, stage: (e) => pad(e.stage) }[ui.sort];
    return list.sort((a, b) => key(a).localeCompare(key(b), 'fr') * ui.sortDir);
  }
  function empTable(list) {
    if (!list.length) return '<div class="empty">Aucun collaborateur ne correspond à votre recherche.</div>';
    const th = (k, l) => `<th><button type="button" data-act="sort" data-k="${k}">${l}${ui.sort === k ? (ui.sortDir > 0 ? ' ↑' : ' ↓') : ''}</button></th>`;
    return `<table><thead><tr>${th('name', 'Collaborateur')}<th>Poste</th>${th('dept', 'Service')}<th>Statut</th>${th('stage', 'Étape du parcours')}${th('start', 'Entrée')}<th>Manager</th></tr></thead><tbody>
      ${list.map((e) => `<tr class="click" data-act="open-emp" data-id="${e.id}" tabindex="0"><td><div class="who-cell">${avatar(e)}<div><b>${esc(fullName(e))}</b><small>${esc(e.email)}</small></div></div></td>
        <td>${esc(e.title)}</td><td>${esc(e.dept)}</td><td>${statusPill(e)}</td><td>${stageChip(e.stage)}</td><td class="num">${fmtDate(e.startDate)}</td><td>${e.managerId ? esc(fullName(emp(e.managerId))) : '—'}</td></tr>`).join('')}</tbody></table>`;
  }
  function viewEmployees() {
    const list = filteredEmployees();
    const statuses = ['Actif', 'Absent', 'Télétravail', "Période d'essai", 'Pré-embauche', 'Préavis', 'Sorti'];
    return `<div class="toolbar"><div class="search">${ic('search')}<label class="sr" for="emp-q">Rechercher</label><input id="emp-q" class="input" type="search" placeholder="Nom, poste, e-mail…" value="${esc(ui.q)}" data-input="q"></div>
      ${ui.profile === 'rh' ? `<label class="sr" for="f-dept">Service</label><select id="f-dept" class="select" data-change="fDept"><option value="">Tous les services</option>${DEPTS.map((d) => `<option ${ui.fDept === d ? 'selected' : ''}>${d}</option>`).join('')}</select>` : ''}
      <label class="sr" for="f-status">Statut</label><select id="f-status" class="select" data-change="fStatus"><option value="">Tous les statuts</option>${statuses.map((s) => `<option ${ui.fStatus === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <span class="muted" id="emp-count">${plural(list.length, 'collaborateur', 'collaborateurs')}</span>
      ${ui.profile === 'rh' ? `<button type="button" class="btn primary" style="margin-left:auto" data-act="emp-new">${ic('plus')}Ajouter un collaborateur</button>` : ''}</div>
      <div class="card"><div class="table-wrap" id="emp-table">${empTable(list)}</div></div>`;
  }

  function empDrawer(e) {
    const tab = ui.drawer.tab || 'infos', rh = ui.profile === 'rh';
    const tabs = [['infos', 'Informations'], ['parcours', 'Parcours'], ['absences', 'Absences']].concat(rh ? [['remu', 'Rémunération'], ['documents', 'Documents']] : []);
    const mgr = e.managerId ? emp(e.managerId) : null;
    let body = '';
    if (tab === 'infos') {
      body = `<div class="info-grid"><div><span>E-mail</span>${esc(e.email)}</div><div><span>Téléphone</span>${esc(e.phone)}</div><div><span>Poste</span>${esc(e.title)}</div><div><span>Service</span>${esc(e.dept)}</div>
        <div><span>Manager</span>${mgr ? esc(fullName(mgr)) : '—'}</div><div><span>Contrat</span>${esc(e.contract)}</div><div><span>Date d’entrée</span>${fmtDate(e.startDate)}</div><div><span>Ancienneté</span>${seniority(e.startDate)}</div>
        <div><span>Lieu de travail</span>${esc(e.location)}</div>${rh ? `<div><span>Date de naissance</span>${fmtDate(e.birthDate)}</div><div><span>Adresse</span>${esc(e.address) || '—'}</div>` : ''}<div><span>Contact d’urgence</span>${esc(e.emergency) || '—'}</div></div>
        ${(() => { const h = db.history.filter((x) => x.empId === e.id).sort((a, b) => b.date.localeCompare(a.date)); return h.length ? `<div class="card card-b"><b>Historique de carrière</b><ol class="timeline" style="margin-top:10px">${h.map((x) => `<li><small>${fmtDate(x.date)} · ${esc(x.label)}</small><p>${esc(x.detail)}</p></li>`).join('')}</ol></div>` : ''; })()}
        ${e.exit ? `<div class="card card-b"><b>Départ prévu</b><p class="muted" style="margin:4px 0 0">${esc(e.exit.reason)} · dernier jour le ${fmtDate(e.exit.lastDay)}${e.exit.comment ? ` · ${esc(e.exit.comment)}` : ''}</p></div>` : ''}`;
    } else if (tab === 'parcours') {
      const canEdit = rh || (ui.profile === 'manager' && e.managerId === me().id);
      body = `<div class="journey-strip" aria-label="Étape en cours : ${esc(STAGES[e.stage].title)}">${STAGES.map((s, i) => `<i title="${esc(s.title)}" style="${i <= e.stage ? `background:${STAGE_COLORS[i]};` : ''}${i === e.stage ? 'outline:2px solid var(--fg);outline-offset:1px' : ''}"></i>`).join('')}</div>
        <div class="card card-b">${stageHead(e.stage, false)}<div style="margin-top:12px">${stepsList(journeyOf(e.id, e.stage), STAGES[e.stage].steps, canEdit, e.id, e.stage)}</div>
        ${rh && e.stage < 15 ? `<div class="toolbar" style="margin-top:12px"><button type="button" class="btn primary sm" data-act="advance" data-id="${e.id}">Passer à « ${esc(STAGES[e.stage + 1].short)} »${ic('arrow')}</button></div>` : ''}</div>`;
    } else if (tab === 'absences') {
      const ls = db.leaves.filter((l) => l.empId === e.id).sort((a, b) => b.start.localeCompare(a.start));
      body = `<div class="balances"><div class="card bal"><span class="l">Congés payés</span><div class="v num">${e.cp} <small>j</small></div></div><div class="card bal"><span class="l">RTT</span><div class="v num">${e.rtt} <small>j</small></div></div><div class="card bal"><span class="l">Demandes</span><div class="v num">${ls.length}</div></div></div>
        <div class="card"><div class="req-list">${ls.length ? ls.map((l) => `<div class="req"><div class="what"><b>${esc(l.type)}</b><small>${fmtShort(l.start)} → ${fmtDate(l.end)} · ${plural(l.days, 'jour', 'jours')}</small></div>${leavePill(l)}</div>`).join('') : '<div class="empty">Aucune absence enregistrée.</div>'}</div></div>`;
    } else if (tab === 'documents') {
      body = docsList(e, true);
    } else {
      const months = payMonths().filter((m) => db.payroll[m] && db.payroll[m].closed && inPayroll(e, m)).reverse();
      body = `<div class="info-grid"><div><span>Salaire annuel brut</span><span class="num" style="font-size:20px;color:var(--fg);font-weight:700">${eur0(e.salary)}</span></div><div><span>Mensuel brut</span><span class="num" style="font-size:20px;color:var(--fg);font-weight:700">${eur(e.salary / 12)}</span></div></div>
        <div class="card"><div class="card-h"><h3>Bulletins de paie</h3></div><div class="req-list">${months.length ? months.map((m) => `<div class="req"><div class="what"><b>${monthLabel(m)}</b><small class="num">Net payé : ${eur(calcPay(e, m).net)}</small></div><button type="button" class="btn ghost sm" data-act="payslip" data-id="${e.id}" data-m="${m}">Voir le bulletin</button></div>`).join('') : '<div class="empty">Aucun bulletin pour le moment.</div>'}</div></div>`;
    }
    return `<div class="drawer-h">${avatar(e, 'lg')}<div style="min-width:0"><h2>${esc(fullName(e))}</h2><p>${esc(e.title)} · ${esc(e.dept)}</p><div style="margin-top:6px">${statusPill(e)}</div></div>
      <button type="button" class="icon-btn drawer-x" data-act="close-drawer" aria-label="Fermer">${ic('x')}</button></div>
      <div class="drawer-b">${rh ? `<div class="toolbar"><button type="button" class="btn ghost sm" data-act="emp-edit" data-id="${e.id}">${ic('edit')}Modifier</button>${e.stage < 13 ? `<button type="button" class="btn bad sm" data-act="exit" data-id="${e.id}">Démarrer un départ</button>` : ''}</div>` : ''}
      <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" role="tab" aria-selected="${tab === k}" data-act="dtab" data-t="${k}">${l}</button>`).join('')}</div>${body}</div>`;
  }

  // ---------------------------------------------------------------- Absences
  const LEAVE_TYPES = ['Congés payés', 'RTT', 'Télétravail', 'Maladie', 'Sans solde'];
  const TYPE_CLASS = { 'Congés payés': 't-cp', RTT: 't-rtt', Maladie: 't-mal', Télétravail: 't-tt', 'Sans solde': 't-mal' };
  const leavePill = (l) => `<span class="pill ${{ 'En attente': 'warn', Approuvée: 'ok', Refusée: 'bad' }[l.status]}">${l.status}</span>`;
  const balanceKey = (type) => (type === 'Congés payés' ? 'cp' : type === 'RTT' ? 'rtt' : null);
  function reqRow(l, actions) {
    const e = emp(l.empId);
    return `<div class="req"><div class="who-cell">${avatar(e)}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)} · solde CP ${e.cp} j · RTT ${e.rtt} j</small></div></div>
      <div class="what"><b>${esc(l.type)} · ${plural(l.days, 'jour', 'jours')}</b><small>${fmtShort(l.start)} → ${fmtDate(l.end)}${l.comment ? ` · « ${esc(l.comment)} »` : ''}</small></div>
      ${actions ? `<div class="acts"><button type="button" class="btn ok sm" data-act="leave-ok" data-id="${l.id}">${ic('check')}Valider</button><button type="button" class="btn bad sm" data-act="leave-ko" data-id="${l.id}">Refuser</button></div>` : leavePill(l)}</div>`;
  }
  function myAbsences(e) {
    const mine = db.leaves.filter((l) => l.empId === e.id).sort((a, b) => b.start.localeCompare(a.start));
    const taken = mine.filter((l) => l.status === 'Approuvée' && balanceKey(l.type) && l.start.slice(0, 4) === TODAY.slice(0, 4)).reduce((s, l) => s + l.days, 0);
    const start = nextMonday(TODAY, 2), end = addDays(start, 4);
    return `<div class="balances"><div class="card bal"><span class="l">Congés payés restants</span><div class="v num">${e.cp} <small>jours</small></div></div><div class="card bal"><span class="l">RTT restants</span><div class="v num">${e.rtt} <small>jours</small></div></div><div class="card bal"><span class="l">Posés en ${TODAY.slice(0, 4)}</span><div class="v num">${taken} <small>jours</small></div></div></div>
      <form class="card" data-form="leave" novalidate><div class="card-h"><h3>Nouvelle demande</h3><span class="muted" style="font-size:13px">Validée par ${esc(fullName(approverOf(e)))}</span></div><div class="card-b"><div class="form-grid">
        <div class="field"><label for="lv-type">Type d’absence</label><select id="lv-type" name="type" class="select" data-live="leave">${LEAVE_TYPES.map((t) => `<option>${t}</option>`).join('')}</select></div>
        <div class="field"><label for="lv-comment">Commentaire (facultatif)</label><input id="lv-comment" name="comment" class="input" maxlength="120" placeholder="Ex. vacances en famille"></div>
        <div class="field"><label for="lv-start">Du</label><input id="lv-start" name="start" type="date" class="input" value="${start}" data-live="leave"></div>
        <div class="field"><label for="lv-end">Au (inclus)</label><input id="lv-end" name="end" type="date" class="input" value="${end}" data-live="leave"></div></div>
        <div class="toolbar" style="margin-top:16px"><span id="lv-preview" class="hint" aria-live="polite">${leavePreview('Congés payés', start, end, e)}</span><button class="btn primary" style="margin-left:auto">Envoyer la demande</button></div></div></form>
      <div class="card"><div class="card-h"><h3>Mes demandes</h3></div><div class="req-list">${mine.length ? mine.map((l) => `<div class="req"><div class="what"><b>${esc(l.type)} · ${plural(l.days, 'jour', 'jours')}</b><small>${fmtShort(l.start)} → ${fmtDate(l.end)}${l.comment ? ` · « ${esc(l.comment)} »` : ''}${l.refusal ? ` · Motif du refus : ${esc(l.refusal)}` : ''}</small></div>${leavePill(l)}
        ${l.status === 'En attente' ? `<button type="button" class="btn ghost sm" data-act="leave-cancel" data-id="${l.id}">Annuler</button>` : ''}</div>`).join('') : '<div class="empty">Vous n’avez encore fait aucune demande.</div>'}</div></div>`;
  }
  function leavePreview(type, start, end, e) {
    const d = workDays(start, end);
    if (!start || !end) return 'Choisissez les dates de début et de fin.';
    if (end < start) return '<span class="err">La date de fin doit être après la date de début.</span>';
    if (!d) return '<span class="err">Cette période ne contient aucun jour ouvré.</span>';
    const k = balanceKey(type);
    if (k && d > e[k]) return `<span class="err">${plural(d, 'jour ouvré', 'jours ouvrés')} : votre solde (${e[k]} j) est insuffisant.</span>`;
    return `<b class="num">${plural(d, 'jour ouvré', 'jours ouvrés')}</b>${k ? ` · solde après validation : ${e[k] - d} j` : ''}`;
  }
  function planning(people) {
    const m = ui.planMonth || monthKey(TODAY);
    const days = []; for (let s = m + '-01'; s <= monthEnd(m); s = addDays(s, 1)) days.push(s);
    const cols = `minmax(170px, 210px) repeat(${days.length}, minmax(24px, 1fr))`;
    const cover = (e, s) => db.leaves.find((l) => l.empId === e.id && l.status !== 'Refusée' && l.start <= s && l.end >= s);
    let html = `<div class="ph"></div>${days.map((s) => `<div class="ph ${isWork(s) ? '' : 'we'} ${s === TODAY ? 'today' : ''}">${parse(s).getDate()}</div>`).join('')}`;
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
          inner = `<i class="${l.status === 'En attente' ? 't-pend' : TYPE_CLASS[l.type]} ${st} ${en}" title="${esc(fullName(e))} · ${esc(l.type)} (${l.status})"></i>`;
        }
        html += `<div class="pc ${isWork(s) ? '' : 'we'}">${inner}</div>`;
      });
    });
    return `<div class="card"><div class="card-h"><div class="toolbar"><button type="button" class="icon-btn" data-act="plan" data-d="-1" aria-label="Mois précédent">${ic('left')}</button><h3 style="min-width:150px;text-align:center">${monthLabel(m)}</h3><button type="button" class="icon-btn" data-act="plan" data-d="1" aria-label="Mois suivant">${ic('right')}</button></div>
      <div class="legend"><span><i class="t-cp"></i>Congés payés</span><span><i class="t-rtt"></i>RTT</span><span><i class="t-tt"></i>Télétravail</span><span><i class="t-mal"></i>Maladie · sans solde</span><span><i class="t-pend"></i>En attente</span></div></div>
      <div class="planning"><div class="plan-grid" style="grid-template-columns:${cols}">${html}</div></div></div>`;
  }
  function viewAbsences() {
    if (ui.profile === 'salarie') return myAbsences(me());
    const pending = pendingForMe();
    const tabs = ui.profile === 'rh' ? [['valider', 'À valider', pending.length], ['planning', 'Planning'], ['historique', 'Historique']] : [['valider', 'À valider', pending.length], ['planning', 'Planning de l’équipe'], ['moi', 'Mes absences']];
    if (!tabs.some((t) => t[0] === ui.absTab)) ui.absTab = 'valider';
    let body;
    if (ui.absTab === 'valider') body = `<div class="card"><div class="req-list">${pending.length ? pending.sort((a, b) => a.start.localeCompare(b.start)).map((l) => reqRow(l, true)).join('') : '<div class="empty">Toutes les demandes ont été traitées.</div>'}</div></div>`;
    else if (ui.absTab === 'planning') body = planning(scopeEmployees().filter(isEmployed).concat(ui.profile === 'manager' ? [me()] : []));
    else if (ui.absTab === 'moi') body = myAbsences(me());
    else {
      const all = db.leaves.filter((l) => !ui.histStatus || l.status === ui.histStatus).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      body = `<div class="toolbar"><label class="sr" for="h-status">Statut</label><select id="h-status" class="select" data-change="histStatus"><option value="">Tous les statuts</option>${['En attente', 'Approuvée', 'Refusée'].map((s) => `<option ${ui.histStatus === s ? 'selected' : ''}>${s}</option>`).join('')}</select><span class="muted">${plural(all.length, 'demande', 'demandes')}</span></div>
        <div class="card"><div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Type</th><th>Période</th><th class="r">Jours</th><th>Demandée le</th><th>Statut</th></tr></thead><tbody>${all.map((l) => { const e = emp(l.empId);
          return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<b>${esc(fullName(e))}</b></div></td><td>${esc(l.type)}</td><td>${fmtShort(l.start)} → ${fmtDate(l.end)}</td><td class="r num">${l.days}</td><td>${fmtDate(l.createdAt)}</td><td>${leavePill(l)}</td></tr>`; }).join('')}</tbody></table></div></div>`;
    }
    return `<div class="tabs" role="tablist">${tabs.map(([k, l, n]) => `<button type="button" role="tab" aria-selected="${ui.absTab === k}" data-act="abs-tab" data-t="${k}">${l}${n !== undefined ? `<span class="count num">${n}</span>` : ''}</button>`).join('')}</div>${body}`;
  }

  // ---------------------------------------------------------------- Paie
  function viewPay() {
    const months = payMonths();
    const m = ui.payMonth && months.includes(ui.payMonth) ? ui.payMonth : (months.find((x) => !(db.payroll[x] && db.payroll[x].closed)) || months[months.length - 1]);
    ui.payMonth = m;
    const pr = payrollOf(m), closed = pr.closed;
    const people = db.employees.filter((e) => inPayroll(e, m)).sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
    const rows = people.map((e) => [e, calcPay(e, m)]);
    const tot = rows.reduce((s, [, p]) => ({ gross: s.gross + p.gross, contrib: s.contrib + p.contrib, net: s.net + p.net, bonus: s.bonus + p.bonus }), { gross: 0, contrib: 0, net: 0, bonus: 0 });
    const idx = months.indexOf(m);
    return `<div class="card"><div class="card-h" style="flex-wrap:wrap"><div class="toolbar"><button type="button" class="icon-btn" data-act="pay-month" data-m="${months[idx - 1] || ''}" ${idx ? '' : 'disabled'} aria-label="Mois précédent">${ic('left')}</button>
        <h3 style="min-width:170px;text-align:center">Paie de ${monthLabel(m).toLowerCase()}</h3><button type="button" class="icon-btn" data-act="pay-month" data-m="${months[idx + 1] || ''}" ${idx < months.length - 1 ? '' : 'disabled'} aria-label="Mois suivant">${ic('right')}</button>
        <span class="pill ${closed ? 'ok' : 'warn'}">${closed ? 'Validée · bulletins disponibles' : 'En cours de préparation'}</span></div>
        ${closed ? '' : `<button type="button" class="btn primary" data-act="pay-close" data-m="${m}">${ic('check')}Valider la paie et générer les bulletins</button>`}</div>
      <div class="kpis" style="padding:16px 20px">${[['Bulletins', rows.length, 'collaborateurs payés'], ['Masse salariale brute', eur0(tot.gross), `dont ${eur0(tot.bonus)} de primes`], ['Cotisations salariales', eur0(tot.contrib), 'Taux moyen 21,8 %'], ['Net à verser', eur0(tot.net), 'Après prélèvement à la source']].map(([l, v, s]) => `<div class="kpi" style="padding:0"><span class="l">${l}</span><span class="v num">${v}</span><span class="s">${s}</span></div>`).join('')}</div></div>
      <div class="card"><div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Contrat</th><th class="r">Salaire de base</th><th class="r">Prime</th><th class="r">Congés pris</th><th class="r">Brut</th><th class="r">Cotisations</th><th class="r">Net à payer</th><th></th></tr></thead><tbody>
      ${rows.map(([e, p]) => `<tr><td><div class="who-cell">${avatar(e, 'sm')}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)}</small></div></div></td><td>${esc(e.contract)}</td><td class="r num">${eur(p.base)}</td>
        <td class="r">${closed ? `<span class="num">${eur(p.bonus)}</span>` : `<label class="sr" for="b-${e.id}">Prime de ${esc(fullName(e))}</label><input id="b-${e.id}" class="input cell-input num" type="number" min="0" step="50" value="${p.bonus || ''}" placeholder="0" data-change="bonus" data-id="${e.id}">`}</td>
        <td class="r num">${p.leaveDays ? `${p.leaveDays} j` : '—'}</td><td class="r num">${eur(p.gross)}</td><td class="r num">−${eur(p.contrib)}</td><td class="r num"><b>${eur(p.net)}</b></td>
        <td>${closed ? `<button type="button" class="btn ghost sm" data-act="payslip" data-id="${e.id}" data-m="${m}">Bulletin</button>` : ''}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td colspan="5">Total</td><td class="r num">${eur(tot.gross)}</td><td class="r num">−${eur(tot.contrib)}</td><td class="r num">${eur(tot.net)}</td><td></td></tr></tfoot></table></div></div>
      <p class="hint">Simulation : cotisations à taux forfaitaires, prélèvement à la source à 7,5 %. Les arrivées et départs en cours de mois sont proratisés en jours ouvrés.</p>`;
  }
  function payslipHTML(e, m) {
    const p = calcPay(e, m);
    return `<div class="slip"><div class="slip-top"><div><b>Nova Studio SAS</b><span class="muted">12 rue de la Paix, 75002 Paris<br>SIRET 000 000 000 00000 (fictif)</span></div><div><b>${esc(fullName(e))}</b><span class="muted">${esc(e.title)} · ${esc(e.contract)}<br>Entrée le ${fmtDate(e.startDate)}</span></div></div>
      <div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>Élément</th><th class="r">Base</th><th class="r">Taux</th><th class="r">Montant</th></tr></thead><tbody>
      <tr><td>Salaire de base</td><td class="r num">${eur(e.salary / 12)}</td><td></td><td class="r num">${eur(p.base)}</td></tr>
      ${p.bonus ? `<tr><td>Prime exceptionnelle</td><td></td><td></td><td class="r num">${eur(p.bonus)}</td></tr>` : ''}
      <tr><td><b>Salaire brut</b></td><td></td><td></td><td class="r num"><b>${eur(p.gross)}</b></td></tr>
      ${p.lines.map(([l, r, v]) => `<tr><td>${l}</td><td class="r num">${eur(p.gross)}</td><td class="r num">${(r * 100).toFixed(2).replace('.', ',')} %</td><td class="r num">−${eur(v)}</td></tr>`).join('')}
      <tr><td><b>Net à payer avant impôt</b></td><td></td><td></td><td class="r num"><b>${eur(p.netBefore)}</b></td></tr>
      <tr><td>Impôt sur le revenu (prélèvement à la source)</td><td class="r num">${eur(p.netBefore)}</td><td class="r num">7,50 %</td><td class="r num">−${eur(p.tax)}</td></tr></tbody></table></div>
      <div class="net"><span>Net payé · ${monthLabel(m)}</span><b class="num">${eur(p.net)}</b></div>
      <p class="hint" style="margin-top:12px">Congés pris ce mois : ${p.leaveDays} j · Solde de congés payés : ${e.cp} j · Bulletin de démonstration, montants indicatifs.</p></div>`;
  }
  function viewPayslips() {
    const e = me();
    const months = payMonths().filter((m) => db.payroll[m] && db.payroll[m].closed && inPayroll(e, m)).reverse();
    return `<div class="card"><div class="card-h"><h3>Mes bulletins de paie</h3><span class="muted">${plural(months.length, 'bulletin', 'bulletins')}</span></div><div class="req-list">${months.length ? months.map((m) => { const p = calcPay(e, m);
      return `<div class="req"><div class="what"><b>${monthLabel(m)}</b><small class="num">Brut ${eur(p.gross)} · Net payé ${eur(p.net)}</small></div><button type="button" class="btn ghost sm" data-act="payslip" data-id="${e.id}" data-m="${m}">${ic('file')}Voir le bulletin</button></div>`; }).join('') : '<div class="empty">Aucun bulletin disponible.</div>'}</div></div>
      <p class="hint">Le bulletin du mois apparaît ici dès que les RH valident la paie (essayez depuis le profil RH, menu Paie).</p>`;
  }

  // ---------------------------------------------------------------- Recrutement
  const CAND_STAGES = ['Reçue', 'Présélection', 'Entretien', 'Proposition', 'Embauché', 'Refusé'];
  const JOB_PILL = { Brouillon: ['warn', 'Besoin à valider'], Ouverte: ['ok', 'Offre publiée'], Pourvue: ['info', 'Pourvue'], Clôturée: ['neutral', 'Clôturée'] };
  const jobPill = (j) => `<span class="pill ${JOB_PILL[j.status][0]}">${JOB_PILL[j.status][1]}</span>`;
  const stars = (n, id) => `<span class="stars ${id ? 'lg' : ''}" ${id ? 'role="group" aria-label="Note du candidat"' : `aria-label="Note ${n} sur 5"`}>${[1, 2, 3, 4, 5].map((k) => id
    ? `<button type="button" data-act="cand-score" data-id="${id}" data-v="${k}" class="${k <= n ? '' : 'off'}" aria-label="${k} sur 5" aria-pressed="${k === n}">${STAR}</button>` : `<span class="${k <= n ? '' : 'off'}">${STAR}</span>`).join('')}</span>`;
  function viewRecruitment() {
    const order = { Brouillon: 0, Ouverte: 1, Pourvue: 2, Clôturée: 3 };
    const jobs = scopeJobs().slice().sort((a, b) => order[a.status] - order[b.status] || b.createdAt.localeCompare(a.createdAt));
    if (!jobs.find((j) => j.id === ui.recJob)) { const first = jobs.find((j) => j.status === 'Ouverte') || jobs[0]; ui.recJob = first ? first.id : null; }
    const job = db.jobs.find((j) => j.id === ui.recJob);
    let right = '<div class="card empty">Aucune offre pour le moment.</div>';
    if (job) {
      const cands = db.candidates.filter((c) => c.jobId === job.id);
      const rh = ui.profile === 'rh';
      const acts = job.status === 'Brouillon' ? (rh ? `<button type="button" class="btn primary" data-act="job-validate" data-id="${job.id}">${ic('check')}Valider et publier</button>` : '<span class="pill warn">En attente de validation RH</span>')
        : job.status === 'Ouverte' ? `<button type="button" class="btn primary" data-act="cand-new" data-id="${job.id}">${ic('plus')}Ajouter un candidat</button>${rh ? `<button type="button" class="btn ghost" data-act="job-close" data-id="${job.id}">Clôturer l’offre</button>` : ''}` : '';
      const board = job.status === 'Brouillon'
        ? `<div class="card-b" style="border-top:1px solid var(--line)">${stepsList([true, true, false], STAGES[0].steps, false)}<p class="hint">Une fois validé par les RH, le besoin devient une offre publiée et les candidatures peuvent arriver.</p></div>`
        : `<div class="board">${CAND_STAGES.map((s) => { const list = cands.filter((c) => c.stage === s);
          return `<div class="col" data-stage="${s}"><h4>${s}<span class="num">${list.length}</span></h4>${list.map((c) => { const next = (c.interviews || []).filter((iv) => iv.date.slice(0, 10) >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0];
            return `<button type="button" class="kc" draggable="true" data-act="open-cand" data-id="${c.id}"><b>${esc(c.name)}</b><small>${esc(c.experience || c.source)}</small>${c.score ? stars(c.score) : ''}${next ? `<small>${ic('calendar').replace('<svg', '<svg style="width:13px;height:13px;vertical-align:-2px"')} ${fmtShort(next.date.slice(0, 10))} · ${next.date.slice(11, 16)}</small>` : ''}</button>`; }).join('')}</div>`; }).join('')}</div>
          <p class="hint" style="padding:0 20px 16px;margin:0">Glissez une carte d’une colonne à l’autre, ou ouvrez-la pour noter le candidat et planifier un entretien.</p>`;
      right = `<div class="card"><div class="job-head"><div style="min-width:0"><div class="toolbar">${jobPill(job)}<span class="muted" style="font-size:13px">Créée le ${fmtDate(job.createdAt)}</span></div><h2 style="margin-top:8px">${esc(job.title)}</h2>
        <p>${esc(job.dept)} · ${esc(job.contract)} · ${esc(job.location)} · ${esc(job.budget)} · ${esc(job.reason)}</p><p>${esc(job.description)}</p></div><div class="toolbar">${acts}</div></div>${board}</div>`;
    }
    return `<div class="rec"><div class="jobs"><button type="button" class="btn primary" data-act="job-new">${ic('plus')}Exprimer un besoin</button>${jobs.map((j) => { const n = db.candidates.filter((c) => c.jobId === j.id && activeCand(c)).length;
      return `<button type="button" class="job" data-act="open-job" data-id="${j.id}" aria-current="${j.id === ui.recJob}"><b>${esc(j.title)}</b><span class="meta">${jobPill(j)}<span>${esc(j.dept)} · ${esc(j.contract)}</span></span><span class="meta">${plural(n, 'candidat actif', 'candidats actifs')}</span></button>`; }).join('')}</div>${right}</div>`;
  }
  function candDrawer(c) {
    const job = db.jobs.find((j) => j.id === c.jobId), rh = ui.profile === 'rh';
    const interviewers = db.employees.filter((e) => (e.dept === job.dept || e.dept === 'RH') && isEmployed(e));
    return `<div class="drawer-h">${avatarName(c.id, c.name, 'lg')}<div style="min-width:0"><h2>${esc(c.name)}</h2><p>${esc(job.title)}</p><div style="margin-top:6px"><span class="pill accent">${esc(c.stage)}</span></div></div>
      <button type="button" class="icon-btn drawer-x" data-act="close-drawer" aria-label="Fermer">${ic('x')}</button></div>
      <div class="drawer-b"><div class="toolbar"><label class="sr" for="c-stage">Étape</label><select id="c-stage" class="select" data-change="cand-stage" data-id="${c.id}">${CAND_STAGES.map((s) => `<option ${s === c.stage ? 'selected' : ''}>${s}</option>`).join('')}</select>
        ${c.stage === 'Entretien' ? `<button type="button" class="btn ghost sm" data-act="cand-move" data-id="${c.id}" data-s="Proposition">Faire une proposition</button>` : ''}
        ${c.stage === 'Proposition' && rh ? `<button type="button" class="btn primary sm" data-act="hire" data-id="${c.id}">${ic('check')}Embaucher</button>` : ''}
        ${activeCand(c) ? `<button type="button" class="btn bad sm" data-act="cand-move" data-id="${c.id}" data-s="Refusé">Refuser</button>` : ''}</div>
      <div><div class="field"><label>Évaluation</label>${stars(c.score, c.id)}</div></div>
      <div class="info-grid"><div><span>E-mail</span>${esc(c.email)}</div><div><span>Téléphone</span>${esc(c.phone)}</div><div><span>Source</span>${esc(c.source)}</div><div><span>Candidature reçue le</span>${fmtDate(c.appliedAt)}</div><div style="grid-column:1/-1"><span>Expérience</span>${esc(c.experience) || '—'}</div></div>
      <div class="card"><div class="card-h"><h3>Entretiens</h3></div><div class="card-b">${(c.interviews || []).length ? c.interviews.slice().sort((a, b) => a.date.localeCompare(b.date)).map((iv) => `<div class="todo"><div class="t"><b>${esc(iv.kind)}</b><small>${fmtDate(iv.date.slice(0, 10), { weekday: 'long', day: 'numeric', month: 'long' })} à ${iv.date.slice(11, 16)} · avec ${esc(fullName(emp(iv.with)))}</small></div>${iv.date.slice(0, 10) < TODAY ? '<span class="pill neutral">Passé</span>' : '<span class="pill info">Prévu</span>'}</div>`).join('') : '<p class="muted" style="margin:0 0 6px">Aucun entretien planifié.</p>'}
        ${activeCand(c) ? `<form data-form="interview" data-id="${c.id}" style="margin-top:12px" novalidate><div class="form-grid"><div class="field"><label for="iv-date">Date et heure</label><input id="iv-date" name="date" type="datetime-local" class="input" value="${nextMonday(TODAY)}T10:00"></div>
          <div class="field"><label for="iv-with">Avec</label><select id="iv-with" name="with" class="select">${interviewers.map((e) => `<option value="${e.id}" ${e.id === me().id ? 'selected' : ''}>${esc(fullName(e))}</option>`).join('')}</select></div>
          <div class="field"><label for="iv-kind">Type</label><select id="iv-kind" name="kind" class="select">${['Entretien RH', 'Entretien manager', 'Test technique', 'Entretien final'].map((k) => `<option>${k}</option>`).join('')}</select></div>
          <div class="field" style="justify-content:flex-end"><button class="btn ghost">${ic('calendar')}Planifier l’entretien</button></div></div></form>` : ''}</div></div>
      <form class="card" data-form="cand-note" data-id="${c.id}"><div class="card-h"><h3>Notes</h3><button class="btn ghost sm">Enregistrer</button></div><div class="card-b"><label class="sr" for="c-notes">Notes sur le candidat</label><textarea id="c-notes" name="notes" class="input" placeholder="Impressions, points forts, points à creuser…">${esc(c.notes)}</textarea></div></form></div>`;
  }

  // ---------------------------------------------------------------- Mon profil
  function viewProfile() {
    const e = me(), mgr = emp(e.managerId);
    return `<div class="card"><div class="drawer-h" style="padding:22px 24px">${avatar(e, 'lg')}<div><h2>${esc(fullName(e))}</h2><p>${esc(e.title)} · ${esc(e.dept)} · ${statusPill(e)}</p></div></div>
      <div class="card-b" style="border-top:1px solid var(--line)"><div class="info-grid"><div><span>E-mail professionnel</span>${esc(e.email)}</div><div><span>Manager</span>${mgr ? esc(fullName(mgr)) : '—'}</div><div><span>Contrat</span>${esc(e.contract)}</div>
        <div><span>Date d’entrée</span>${fmtDate(e.startDate)} · ${seniority(e.startDate)}</div><div><span>Étape du parcours</span>${stageChip(e.stage)}</div><div><span>Salaire annuel brut</span><span class="num">${eur0(e.salary)}</span></div></div></div></div>
      <form class="card" data-form="profile" novalidate><div class="card-h"><h3>Mes informations personnelles</h3><span class="muted" style="font-size:13px">Les RH sont prévenus de chaque modification</span></div><div class="card-b"><div class="form-grid">
        <div class="field"><label for="p-phone">Téléphone</label><input id="p-phone" name="phone" class="input" value="${esc(e.phone)}" autocomplete="tel"></div>
        <div class="field"><label for="p-loc">Lieu de travail</label><select id="p-loc" name="location" class="select">${['Paris', 'Lyon', 'Télétravail majoritaire'].map((l) => `<option ${l === e.location ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="field full"><label for="p-address">Adresse postale</label><input id="p-address" name="address" class="input" value="${esc(e.address)}" autocomplete="street-address"></div>
        <div class="field full"><label for="p-emerg">Contact d’urgence</label><input id="p-emerg" name="emergency" class="input" value="${esc(e.emergency)}" placeholder="Nom · téléphone"></div></div>
        <div class="toolbar" style="margin-top:16px"><span class="err" id="p-err"></span><button class="btn primary" style="margin-left:auto">Enregistrer</button></div></div></form>
      <h3 style="font-size:16px;margin-top:4px">Mes documents</h3>${docsList(e, true)}`;
  }

  // ================================================================ Modules : développement, suivi, documents
  const MOD_ACT = {}, MOD_CHG = {}, MOD_FORMS = {}, MODALS = {}, DRAWERS = {};
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
  const proDue = (e) => addYears(e.lastPro || e.startDate, 2);
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
      const tabs = [['mon', 'Mes entretiens', todo], ['objectifs', 'Mes objectifs'], ['feedback', 'Feedback']]; pickTab('revTab', tabs);
      let body;
      if (ui.revTab === 'mon') {
        const [st, cls] = proState(m);
        body = `${mine.length ? mine.map((r) => `<div class="card"><div class="card-h"><h3>${r.kind} ${r.year}</h3>${reviewPill(r)}</div><div class="card-b">${stepper(r)}
          <div class="toolbar" style="margin-top:14px"><span class="muted">${r.date ? `Prévu le ${fmtDate(r.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} avec ${esc(fullName(emp(m.managerId)))}` : 'Date à fixer par votre manager'}</span>
          <button type="button" class="btn ${['Planifié', 'À signer'].includes(r.status) ? 'primary' : 'ghost'}" style="margin-left:auto" data-act="review" data-id="${r.id}">${r.status === 'Planifié' ? 'Faire mon auto-évaluation' : r.status === 'À signer' ? 'Relire et signer' : 'Ouvrir'}</button></div></div></div>`).join('') : '<div class="card empty">Aucun entretien programmé.</div>'}
          <div class="card card-b"><b>Entretien professionnel</b><p class="muted" style="margin:4px 0 0">Tous les 2 ans, pour parler de vos perspectives d’évolution et de formation. Dernier : ${m.lastPro ? fmtDate(m.lastPro) : 'aucun'} · prochain avant le ${fmtDate(proDue(m))} <span class="pill ${cls}">${st}</span></p></div>`;
      } else if (ui.revTab === 'objectifs') {
        const list = db.objectives.filter((o) => o.empId === m.id);
        const avg = list.length ? Math.round(list.reduce((s, o) => s + o.progress, 0) / list.length) : 0;
        body = card('Mes objectifs 2026', `<span class="pill ok num">Avancement moyen ${avg} %</span>`, `<div class="card-b">${objectivesList(list, true)}<p class="hint" style="margin:12px 0 0">Faites glisser le curseur pour mettre à jour l’avancement : votre manager le voit aussitôt.</p></div>`);
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
    const tabs = [['campagne', `Campagne ${CAMPAIGN}`], ['pro', 'Entretiens professionnels', late], ['objectifs', 'Objectifs']]; pickTab('revTab', tabs);
    let body;
    if (ui.revTab === 'campagne') {
      const signed = annual.filter((r) => r.status === 'Signé').length;
      body = `<div class="kpis">${[['Entretiens créés', annual.length, missing.length ? `${missing.length} collaborateur(s) sans entretien` : 'Tous les collaborateurs concernés'], ['Signés', signed, `${annual.length ? Math.round((signed / annual.length) * 100) : 0} % de la campagne`],
        ['En cours', annual.filter((r) => !['Signé', 'À planifier'].includes(r.status)).length, 'Auto-évaluation ou signature'], ['À planifier', annual.filter((r) => r.status === 'À planifier').length, 'Date à fixer par le manager']].map(([l, v, s]) => `<div class="card kpi"><span class="l">${l}</span><span class="v num">${v}</span><span class="s">${s}</span></div>`).join('')}</div>
        ${missing.length ? `<div class="card card-b toolbar"><span>${missing.length} collaborateur(s) n’ont pas encore d’entretien annuel ${CAMPAIGN}.</span><button type="button" class="btn primary" style="margin-left:auto" data-act="campaign">${ic('plus')}Lancer la campagne pour eux</button></div>` : ''}
        ${card('Suivi de la campagne', '', `<div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Manager</th><th>Date</th><th>Statut</th><th></th></tr></thead><tbody>${annual.map((r) => { const e = emp(r.empId);
          return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<b>${esc(fullName(e))}</b></div></td><td>${esc(fullName(emp(e.managerId)))}</td><td>${r.date ? fmtDate(r.date) : '—'}</td><td>${reviewPill(r)}</td><td class="r"><button type="button" class="btn ghost sm" data-act="review" data-id="${r.id}">Ouvrir</button></td></tr>`; }).join('') || '<tr><td colspan="5" class="empty">Aucun entretien.</td></tr>'}</tbody></table></div>`)}`;
    } else if (ui.revTab === 'pro') {
      const list = employed().map((e) => [e, proState(e)]).sort((a, b) => proDue(a[0]).localeCompare(proDue(b[0])));
      body = `<p class="hint" style="margin:0">L’entretien professionnel a lieu tous les 2 ans, avec un état des lieux récapitulatif tous les 6 ans (art. L6315-1 du Code du travail).</p>
        ${card('Échéances', '', `<div class="table-wrap"><table><thead><tr><th>Collaborateur</th><th>Dernier entretien</th><th>À réaliser avant le</th><th>Statut</th><th></th></tr></thead><tbody>${list.map(([e, [st, cls]]) => { const open = db.reviews.find((r) => r.empId === e.id && r.kind === 'Entretien professionnel' && r.status !== 'Signé');
          return `<tr><td><div class="who-cell">${avatar(e, 'sm')}<div><b>${esc(fullName(e))}</b><small>${esc(e.title)}</small></div></div></td><td>${e.lastPro ? fmtDate(e.lastPro) : 'Aucun'}</td><td class="num">${fmtDate(proDue(e))}</td><td><span class="pill ${cls}">${st}</span></td>
          <td class="r">${open ? `<button type="button" class="btn ghost sm" data-act="review" data-id="${open.id}">${open.status}</button>` : `<button type="button" class="btn ghost sm" data-act="pro-new" data-id="${e.id}">Programmer</button>`}</td></tr>`; }).join('')}</tbody></table></div>`)}`;
    } else {
      body = `<div class="toolbar"><button type="button" class="btn primary" data-act="objective-new">${ic('plus')}Fixer un objectif</button></div>${employed().filter((e) => db.objectives.some((o) => o.empId === e.id)).map((e) => card(`${avatar(e, 'sm')} ${esc(fullName(e))}`, `<span class="muted">${esc(e.title)} · manager : ${esc(fullName(emp(e.managerId)))}</span>`, `<div class="card-b">${objectivesList(db.objectives.filter((o) => o.empId === e.id), false)}</div>`)).join('')}`;
    }
    return tabsBar('revTab', tabs) + body;
  }
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
      ${r.kind === 'Entretien annuel' ? `<div class="card card-b"><h3 style="font-size:15px;margin-bottom:8px">Objectifs de l’année</h3>${objectivesList(db.objectives.filter((o) => o.empId === e.id), false)}</div>` : ''}</div>`,
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
  function myTrainings(e) {
    const mine = db.enrollments.filter((x) => x.empId === e.id).sort((a, b) => b.session.localeCompare(a.session));
    return card('Mes formations', '', `<div class="req-list">${mine.length ? mine.map((x) => enrRow(x, x.status === 'Terminée'
      ? `<label class="sr" for="tr-${x.id}">Mon évaluation</label><select id="tr-${x.id}" class="select" data-change="train-rate" data-id="${x.id}"><option value="">Évaluer la formation</option>${[5, 4, 3, 2, 1].map((k) => `<option value="${k}" ${x.rating === k ? 'selected' : ''}>${'★'.repeat(k)} ${k}/5</option>`).join('')}</select>`
      : x.status === 'Demandée' ? `<button type="button" class="btn ghost sm" data-act="train-cancel" data-id="${x.id}">Annuler</button>` : '')).join('') : '<div class="empty">Aucune formation pour le moment. Parcourez le catalogue.</div>'}</div>`);
  }
  function viewTraining() {
    const p = ui.profile, m = me();
    let tabs;
    if (p === 'salarie') tabs = [['catalogue', 'Catalogue'], ['mes', 'Mes formations']];
    else if (p === 'manager') { const ids = scopeSet(); tabs = [['valider', 'À valider', db.enrollments.filter((x) => x.status === 'Demandée' && ids.has(x.empId)).length], ['equipe', 'Formations de l’équipe'], ['catalogue', 'Catalogue'], ['mes', 'Mes formations']]; }
    else tabs = [['plan', 'Plan de formation'], ['valider', 'À valider', db.enrollments.filter((x) => ['Demandée', 'Validée manager'].includes(x.status)).length], ['catalogue', 'Catalogue']];
    pickTab('trTab', tabs);
    let body;
    if (ui.trTab === 'catalogue') body = catalogue();
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
    else if (p === 'manager') { const ids = scopeSet(); tabs = [['souhaits', 'Souhaits de l’équipe', db.wishes.filter((w) => ids.has(w.empId) && !w.mgrOpinion && ['Exprimé', 'En étude'].includes(w.status)).length], ['offres', 'Offres internes']]; }
    else tabs = [['souhaits', 'Souhaits d’évolution', db.wishes.filter((w) => w.status === 'Exprimé').length], ['changements', 'Changements de poste'], ['offres', 'Offres internes']];
    pickTab('mobTab', tabs);
    let body;
    if (ui.mobTab === 'offres') body = internalOffers();
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
  MODALS.move = (m, shell, formShell, opt, f) => {
    const e = m.empId ? emp(m.empId) : employed()[0], w = m.wishId ? db.wishes.find((x) => x.id === m.wishId) : null;
    return formShell('Changement de poste', 'move', `<div class="form-grid">
      ${f('mv-emp', 'Collaborateur', m.empId ? `<input class="input" value="${esc(fullName(e))}" readonly><input type="hidden" name="empId" value="${e.id}">` : `<select id="mv-emp" name="empId" class="select">${empOptions(employed(), e.id)}</select>`)}
      ${f('mv-label', 'Type', `<select id="mv-label" name="label" class="select">${opt(['Promotion', 'Mobilité interne', 'Changement de service', 'Augmentation'], w && w.kind === 'Changement de service' ? 'Changement de service' : 'Promotion')}</select>`)}
      ${f('mv-title', 'Nouveau poste', `<input id="mv-title" name="title" class="input" value="${esc(w && w.kind === 'Évolution de poste' ? w.target : e.title)}">`)}${f('mv-dept', 'Service', `<select id="mv-dept" name="dept" class="select">${opt(DEPTS, e.dept)}</select>`)}
      ${f('mv-mgr', 'Manager', `<select id="mv-mgr" name="managerId" class="select"><option value="">Aucun</option>${empOptions(employed(), e.managerId)}</select>`)}${f('mv-salary', 'Salaire annuel brut (€)', `<input id="mv-salary" name="salary" type="number" min="0" step="100" class="input num" value="${Math.round(e.salary * 1.06 / 100) * 100}">`)}
      ${f('mv-date', 'Date d’effet', `<input id="mv-date" name="date" type="date" class="input" value="${shiftMonth(monthKey(TODAY), 1)}-01">`, true)}</div>`, 'Enregistrer et générer l’avenant');
  };
  Object.assign(MOD_ACT, {
    'apply-internal'(d) {
      const j = db.jobs.find((x) => x.id === d.id), e = me();
      db.candidates.push({ id: uid('c'), jobId: j.id, name: fullName(e), email: e.email, phone: e.phone, source: 'Mobilité interne', experience: `${e.title} · ${e.dept} (en interne depuis ${seniority(e.startDate)})`, stage: 'Présélection', score: 0, notes: '', interviews: [], appliedAt: TODAY, empId: e.id });
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
      const parts = [];
      if (v.title.trim() !== e.title) parts.push(`${e.title} → ${v.title.trim()}`);
      if (v.dept !== e.dept) parts.push(`service ${e.dept} → ${v.dept}`);
      if (salary !== e.salary) parts.push(`salaire ${eur0(e.salary)} → ${eur0(salary)}`);
      Object.assign(e, { title: v.title.trim(), dept: v.dept, managerId: v.managerId || null, salary });
      db.history.push({ id: uid('h'), empId: e.id, date: v.date, label: v.label, detail: parts.join(' · ') || 'Mise à jour du contrat' });
      db.documents.push({ id: uid('doc'), empId: e.id, kind: 'avenant', title: `Avenant · ${e.title}`, date: TODAY, data: { title: e.title, dept: e.dept, salary, effective: v.date } });
      if (ui.modal.wishId) db.wishes.find((x) => x.id === ui.modal.wishId).status = 'Réalisé';
      tickJourney(e.id, 10, 2); tickJourney(e.id, 5, 0);
      notify(e.id, `${v.label} à compter du ${fmtDate(v.date)} : votre avenant est disponible dans vos documents.`); if (e.managerId) notify(e.managerId, `${v.label} de ${fullName(e)} au ${fmtDate(v.date)}.`);
      ui.modal = null; toast('Changement enregistré · avenant généré'); commit();
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
    if (p === 'salarie') tabs = [['qvt', 'Baromètre du mois', answered ? 0 : 1], ['visites', 'Mes visites médicales'], ['accidents', 'Accidents et incidents'], ['amenagements', 'Aménagement de poste']];
    else if (p === 'manager') tabs = [['qvt', 'Baromètre de l’équipe'], ['accidents', 'Accidents et incidents'], ['amenagements', 'Aménagements de poste']];
    else tabs = [['visites', 'Visites médicales', visitsDue(db.employees).filter((x) => x.deadline < TODAY).length], ['accidents', 'Accidents et incidents', db.incidents.filter((x) => x.status === 'Déclaré').length], ['risques', 'Document unique (DUERP)'], ['qvt', 'Baromètre QVT'], ['amenagements', 'Aménagements de poste', db.adjustments.filter((x) => x.status === 'Demandé').length]];
    pickTab('healthTab', tabs);
    const ids = p === 'rh' ? null : p === 'manager' ? scopeSet() : new Set([m.id]);
    const inScope = (id) => !ids || ids.has(id) || (p === 'manager' && id === m.id);
    let body;
    if (ui.healthTab === 'qvt') {
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
      return `<form class="card" data-form="case-ask" novalidate><div class="card-h"><h3>Demander un échange avec les RH</h3><span class="muted" style="font-size:13px">Confidentiel · seuls les RH voient votre demande</span></div><div class="card-b"><div class="form-grid">
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
      <div><span>Entretien préalable</span>${c.interview ? fmtDate(c.interview) : 'À fixer'}</div><div><span>Sanction notifiable</span>${c.interview ? `du ${fmtDate(addOuvrables(c.interview, 2))} au ${fmtDate(addMonths(c.interview, 1))}` : '—'}</div></div>
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

  // ---------------------------------------------------------------- Documents RH
  const DOC_LABEL = { contrat: 'Contrat de travail', attestation: 'Attestation employeur', avenant: 'Avenant au contrat', certificat: 'Certificat de travail', solde: 'Reçu pour solde de tout compte', 'france-travail': 'Attestation employeur France Travail' };
  function docBody(d) {
    const e = emp(d.empId), rh = emp('e1');
    const head = `<header><b>Nova Studio SAS</b><span>12 rue de la Paix, 75002 Paris · SIRET 000 000 000 00000 (fictif)</span></header><h2>${DOC_LABEL[d.kind]}</h2>`;
    const sign = `<p class="sig">Fait à Paris, le ${fmtDate(d.date, { day: 'numeric', month: 'long', year: 'numeric' })}<br><b>${esc(fullName(rh))}</b>, ${esc(rh.title)}</p>`;
    const who = `${esc(fullName(e))}`;
    if (d.kind === 'attestation') return `${head}<p>Je soussignée ${esc(fullName(rh))}, ${esc(rh.title)} de la société Nova Studio SAS, atteste que ${who} est employé·e au sein de notre société depuis le ${fmtDate(e.startDate, { day: 'numeric', month: 'long', year: 'numeric' })}, en qualité de ${esc(e.title)}, dans le cadre d’un contrat ${esc(e.contract)}${e.exit ? `, jusqu’au ${fmtDate(e.exit.lastDay)}` : ''}.</p><p>Cette attestation est délivrée à la demande de l’intéressé·e pour servir et valoir ce que de droit.</p>${sign}`;
    if (d.kind === 'avenant') return `${head}<p>Entre la société Nova Studio SAS et ${who}, il est convenu ce qui suit.</p><p><b>Article 1.</b> À compter du ${fmtDate(d.data.effective, { day: 'numeric', month: 'long', year: 'numeric' })}, ${who} occupe le poste de ${esc(d.data.title)} au sein du service ${esc(d.data.dept)}.</p><p><b>Article 2.</b> Sa rémunération annuelle brute est portée à ${eur0(d.data.salary)}, versée en douze mensualités.</p><p><b>Article 3.</b> Les autres clauses du contrat de travail demeurent inchangées.</p>${sign}<p class="sig">Signature du collaborateur, précédée de la mention « lu et approuvé »</p>`;
    if (d.kind === 'contrat') return `${head}<p>Contrat de travail à durée ${e.contract === 'CDI' ? 'indéterminée' : 'déterminée'} conclu entre Nova Studio SAS et ${who}.</p><p><b>Poste :</b> ${esc(e.title)} · <b>Service :</b> ${esc(e.dept)} · <b>Date d’entrée :</b> ${fmtDate(e.startDate)}<br><b>Rémunération annuelle brute :</b> ${eur0(e.salary)} · <b>Lieu de travail :</b> ${esc(e.location)}<br><b>Période d’essai :</b> 4 mois, renouvelable une fois · <b>Convention collective :</b> Syntec (exemple)</p><p class="hint">Extrait de démonstration : le contrat complet comporte l’ensemble des clauses légales et conventionnelles.</p>${sign}`;
    if (d.kind === 'certificat') return `${head}<p>Je soussignée ${esc(fullName(rh))}, ${esc(rh.title)}, certifie que ${who} a été employé·e par la société Nova Studio SAS du ${fmtDate(e.startDate, { day: 'numeric', month: 'long', year: 'numeric' })} au ${fmtDate(e.exit ? e.exit.lastDay : TODAY, { day: 'numeric', month: 'long', year: 'numeric' })}, en qualité de ${esc(e.title)}.</p><p>${who} quitte la société libre de tout engagement. Il·elle bénéficie du maintien de ses garanties santé et prévoyance dans les conditions prévues par la loi (portabilité).</p>${sign}`;
    if (d.kind === 'solde') {
      const lastM = monthKey(e.exit ? e.exit.lastDay : TODAY), p = calcPay(e, lastM), cpDays = e.cp, cpPay = cpDays * (e.salary / 12 / 21.67);
      return `${head}<p>Je soussigné·e ${who} reconnais avoir reçu de la société Nova Studio SAS, pour solde de tout compte, la somme brute de <b>${eur(p.gross + cpPay)}</b>, détaillée ci-dessous :</p>
        <table><tbody><tr><td>Salaire du dernier mois (${monthLabel(lastM).toLowerCase()})</td><td class="r num">${eur(p.gross)}</td></tr><tr><td>Indemnité compensatrice de congés payés (${cpDays} j)</td><td class="r num">${eur(cpPay)}</td></tr><tr><td><b>Total brut</b></td><td class="r num"><b>${eur(p.gross + cpPay)}</b></td></tr></tbody></table>
        <p class="hint">Montants indicatifs de démonstration. Ce reçu peut être dénoncé dans les 6 mois suivant sa signature.</p>${sign}`;
    }
    return `${head}<p>Attestation destinée à France Travail concernant ${who}, employé·e du ${fmtDate(e.startDate)} au ${fmtDate(e.exit ? e.exit.lastDay : TODAY)} en qualité de ${esc(e.title)}. Motif de fin de contrat : ${esc(e.exit ? e.exit.reason : '—')}.</p><p class="hint">En pratique, cette attestation est transmise par voie dématérialisée.</p>${sign}`;
  }
  function addDoc(empId, kind, extra = {}) {
    const d = Object.assign({ id: uid('doc'), empId, kind, title: DOC_LABEL[kind], date: TODAY }, extra);
    db.documents.push(d); return d;
  }
  function docsList(e, canGenerate) {
    const list = db.documents.filter((d) => d.empId === e.id).sort((a, b) => b.date.localeCompare(a.date));
    return `${canGenerate ? `<div class="toolbar"><button type="button" class="btn ghost sm" data-act="doc-gen" data-id="${e.id}" data-k="attestation">${ic('plus')}Attestation employeur</button>${ui.profile === 'rh' && e.stage >= 13 ? `<button type="button" class="btn ghost sm" data-act="doc-gen" data-id="${e.id}" data-k="certificat">${ic('plus')}Certificat de travail</button>` : ''}</div>` : ''}
      <div class="card"><div class="req-list">${list.map((d) => `<div class="req"><span class="doc-ic">${ic('file')}</span><div class="what"><b>${esc(d.title)}</b><small>${fmtDate(d.date)}</small></div><button type="button" class="btn ghost sm" data-act="doc-view" data-id="${d.id}">Consulter</button></div>`).join('') || '<div class="empty">Aucun document.</div>'}</div></div>`;
  }
  MODALS.doc = (m, shell) => { const d = db.documents.find((x) => x.id === m.id); return shell(esc(d.title), `<div class="modal-b"><article class="letter">${docBody(d)}</article></div>`, '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>', true); };
  Object.assign(MOD_ACT, {
    'doc-view'(d) { ui.modal = { type: 'doc', id: d.id }; render(); },
    'doc-gen'(d) { const doc = addDoc(d.id, d.k); tickJourney(d.id, 5, 2); if (ui.profile === 'salarie') notify('e1', `${fullName(me())} a généré une ${DOC_LABEL[d.k].toLowerCase()}.`); ui.modal = { type: 'doc', id: doc.id }; toast('Document généré'); commit(); },
  });

  // ---------------------------------------------------------------- Modals
  function modalHTML() {
    const m = ui.modal; if (!m) return '';
    const shell = (title, body, foot, wide) => `<div class="modal" data-act="modal-bg"><div class="modal-box ${wide ? 'wide' : ''}" data-act="noop" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-h"><h2>${title}</h2><button type="button" class="icon-btn" data-act="modal-close" aria-label="Fermer">${ic('x')}</button></div>${body}${foot || ''}</div></div>`;
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
        ${f('e-phone', 'Téléphone', `<input id="e-phone" name="phone" class="input" value="${esc(e.phone)}">`)}${f('e-loc', 'Lieu de travail', `<select id="e-loc" name="location" class="select">${opt(['Paris', 'Lyon', 'Télétravail majoritaire'], e.location)}</select>`)}
        ${m.id ? '' : f('e-stage', 'Étape du parcours', `<select id="e-stage" name="stage" class="select">${opt([[2, 'Pré-embauche'], [3, 'Embauche'], [4, 'Intégration']].map(([v, l]) => [String(v), l]), '2')}</select>`, true)}</div>`, m.id ? 'Enregistrer' : 'Ajouter', true);
    }
    if (m.type === 'exit') {
      const e = emp(m.id);
      return formShell(`Départ de ${esc(fullName(e))}`, 'exit', `<p class="muted" style="margin:0">Le collaborateur passe à l’étape « Préparation du départ » : préavis, documents de sortie et restitution du matériel.</p><div class="form-grid">
        ${f('x-reason', 'Motif', `<select id="x-reason" name="reason" class="select">${opt(['Démission', 'Rupture conventionnelle', 'Fin de CDD', 'Licenciement', 'Départ à la retraite'])}</select>`)}${f('x-day', 'Dernier jour travaillé', `<input id="x-day" name="lastDay" type="date" class="input" value="${addDays(TODAY, 30)}">`)}
        ${f('x-comment', 'Commentaire (facultatif)', '<input id="x-comment" name="comment" class="input" maxlength="140">', true)}</div>`, 'Démarrer le départ');
    }
    if (m.type === 'refuse') {
      const l = db.leaves.find((x) => x.id === m.id), e = emp(l.empId);
      return formShell('Refuser la demande', 'refuse', `<p style="margin:0">${esc(fullName(e))} · ${esc(l.type)} du ${fmtShort(l.start)} au ${fmtDate(l.end)} (${plural(l.days, 'jour', 'jours')}).</p>${f('r-why', 'Motif communiqué au collaborateur', '<input id="r-why" name="why" class="input" maxlength="140" placeholder="Ex. période de livraison, merci de décaler d’une semaine">', true)}`, 'Refuser la demande');
    }
    if (m.type === 'pay-close') {
      const n = db.employees.filter((e) => inPayroll(e, m.m)).length;
      return shell(`Valider la paie de ${monthLabel(m.m).toLowerCase()}`, `<div class="modal-b"><p style="margin:0">${plural(n, 'bulletin sera généré', 'bulletins seront générés')} et mis à disposition des collaborateurs. Les primes ne seront plus modifiables.</p></div>`,
        `<div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Annuler</button><button type="button" class="btn primary" data-act="pay-close-ok" data-m="${m.m}">Valider la paie</button></div>`);
    }
    if (m.type === 'payslip') return shell(`Bulletin de paie · ${monthLabel(m.m)}`, `<div class="modal-b">${payslipHTML(emp(m.id), m.m)}</div>`, '<div class="modal-f"><button type="button" class="btn primary" data-act="modal-close">Fermer</button></div>', true);
    if (m.type === 'job') {
      const rh = ui.profile === 'rh';
      return formShell('Exprimer un besoin de recrutement', 'job', `<div class="form-grid">
        ${f('j-title', 'Intitulé du poste', '<input id="j-title" name="title" class="input" required placeholder="Ex. Product Designer">', true)}
        ${f('j-dept', 'Service', rh ? `<select id="j-dept" name="dept" class="select">${opt(DEPTS, 'Design')}</select>` : `<input id="j-dept" name="dept" class="input" value="${esc(me().dept)}" readonly>`)}${f('j-contract', 'Contrat', `<select id="j-contract" name="contract" class="select">${opt(['CDI', 'CDD', 'Alternance', 'Stage'])}</select>`)}
        ${f('j-loc', 'Lieu', `<select id="j-loc" name="location" class="select">${opt(['Paris', 'Lyon · hybride', 'Télétravail'])}</select>`)}${f('j-reason', 'Motif', `<select id="j-reason" name="reason" class="select">${opt(['Création de poste', 'Remplacement', 'Surcroît d’activité'])}</select>`)}
        ${f('j-budget', 'Budget annuel brut', '<input id="j-budget" name="budget" class="input" placeholder="Ex. 45 000 – 50 000 €">', true)}
        ${f('j-desc', 'Missions et profil recherché', '<textarea id="j-desc" name="description" class="input" placeholder="Missions principales, compétences attendues…"></textarea>', true)}</div>
        ${rh ? '<label style="display:flex;gap:10px;align-items:center;font-weight:600"><input type="checkbox" name="publish" checked> Valider et publier l’offre immédiatement</label>' : '<p class="hint" style="margin:0">Le besoin sera transmis aux RH pour validation avant publication.</p>'}`, rh ? 'Créer' : 'Envoyer aux RH');
    }
    if (m.type === 'cand') {
      return formShell('Ajouter un candidat', 'cand', `<div class="form-grid">${f('k-name', 'Prénom et nom', '<input id="k-name" name="name" class="input" required>', true)}
        ${f('k-email', 'E-mail', '<input id="k-email" name="email" type="email" class="input">')}${f('k-phone', 'Téléphone', '<input id="k-phone" name="phone" class="input">')}
        ${f('k-source', 'Source', `<select id="k-source" name="source" class="select">${opt(['Site carrière', 'Jobboard', 'Réseaux sociaux', 'Cooptation', 'École'])}</select>`)}${f('k-exp', 'Expérience', '<input id="k-exp" name="experience" class="input" placeholder="Ex. 4 ans · agence">')}</div>`, 'Ajouter');
    }
    if (m.type === 'hire') {
      const c = db.candidates.find((x) => x.id === m.id), job = db.jobs.find((j) => j.id === c.jobId);
      const mgrs = db.employees.filter(isEmployed).map((x) => [x.id, fullName(x)]);
      return formShell(`Embaucher ${esc(c.name)}`, 'hire', `<p class="muted" style="margin:0">${esc(job.title)} · ${esc(job.contract)}. ${esc(c.name.split(' ')[0])} rejoindra la roue du parcours à l’étape « Pré-embauche ».</p><div class="form-grid">
        ${f('h-start', 'Date d’arrivée', `<input id="h-start" name="startDate" type="date" class="input" value="${nextMonday(TODAY, 4)}">`)}${f('h-salary', 'Salaire annuel brut (€)', '<input id="h-salary" name="salary" type="number" min="0" step="100" class="input num" value="46000">')}
        ${f('h-mgr', 'Manager', `<select id="h-mgr" name="managerId" class="select">${opt(mgrs, DEPT_HEAD[job.dept])}</select>`, true)}</div>
        <label style="display:flex;gap:10px;align-items:center;font-weight:600"><input type="checkbox" name="close" checked> Marquer l’offre comme pourvue</label>`, 'Confirmer l’embauche');
    }
    if (m.type === 'reset') {
      return shell('Réinitialiser la démo', '<div class="modal-b"><p style="margin:0">Toutes vos modifications (demandes, validations, embauches, paies…) seront effacées et les données de départ seront restaurées.</p></div>',
        '<div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Annuler</button><button type="button" class="btn bad" data-act="reset-ok">Réinitialiser</button></div>');
    }
    return '';
  }
  function formError(msg) { const el = document.getElementById('m-err'); if (el) el.textContent = msg; }

  // ---------------------------------------------------------------- Render
  const VIEWS = { accueil: viewHome, etape: viewStage, collaborateurs: viewEmployees, absences: viewAbsences, paie: viewPay, recrutement: viewRecruitment, profil: viewProfile, bulletins: viewPayslips,
    entretiens: viewReviews, formation: viewTraining, mobilite: viewMobility, sante: viewHealth, relations: viewRelations };
  let drawerAnim = false;
  function render() {
    route();
    const scrollY = window.scrollY;
    document.getElementById('app').innerHTML = `<div class="app">${topbar()}${stageRail()}<main class="view" id="view">${VIEWS[ui.view]()}</main>${footer()}</div>`;
    let ov = '';
    if (ui.drawer) {
      const dt = ui.drawer.type, cs = dt === 'case' && db.cases.find((c) => c.id === ui.drawer.id);
      const content = dt === 'emp' ? (emp(ui.drawer.id) && empDrawer(emp(ui.drawer.id))) : dt === 'case' ? (cs && DRAWERS.case(cs)) : (db.candidates.find((c) => c.id === ui.drawer.id) && candDrawer(db.candidates.find((c) => c.id === ui.drawer.id)));
      if (content) ov += `<div class="scrim ${drawerAnim ? '' : 'on'}" data-act="close-drawer"></div><aside class="drawer ${drawerAnim ? '' : 'on'}" aria-label="Fiche">${content}</aside>`;
      else ui.drawer = null;
    }
    ov += modalHTML();
    document.getElementById('overlay').innerHTML = ov;
    if (drawerAnim) { drawerAnim = false; requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.scrim, .drawer').forEach((el) => el.classList.add('on')))); }
    window.scrollTo(0, scrollY);
    const cur = document.querySelector('.rail [aria-current]'); if (cur) cur.parentElement.scrollLeft = cur.offsetLeft - 80;
    if (ui.view === 'accueil') bindWheel();
    if (ui.view === 'recrutement') bindBoard();
    saveUI();
  }
  const commit = () => { save(); render(); };
  // Keep (view, stage) consistent with what the profile is allowed to open.
  function route() {
    if (ui.view === 'accueil' || !VIEWS[ui.view]) { ui.view = 'accueil'; ui.stage = null; return; }
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
    if (stage === 'Embauché') {
      if (ui.profile !== 'rh') { toast('Seuls les RH peuvent finaliser une embauche.', 'info'); return; }
      if (c.stage !== 'Proposition') { toast('Passez d’abord le candidat en « Proposition ».', 'info'); return; }
      ui.modal = { type: 'hire', id }; render(); return;
    }
    if (c.stage === 'Embauché') { toast('Ce candidat est déjà embauché.', 'info'); return; }
    c.stage = stage; toast(`${c.name} : ${stage}`); commit();
  }

  function advance(id) {
    const e = emp(id); if (!e || e.stage >= 15) return;
    db.journey[e.id] = db.journey[e.id] || {};
    db.journey[e.id][e.stage] = STAGES[e.stage].steps.map(() => true);
    e.stage += 1;
    if (e.stage === 3 && e.startDate > TODAY) e.startDate = TODAY;
    if (e.stage === 14) ['certificat', 'solde', 'france-travail'].forEach((k) => { if (!db.documents.some((d) => d.empId === e.id && d.kind === k)) addDoc(e.id, k); });
    if (e.stage === 14) notify(e.id, 'Vos documents de fin de contrat sont disponibles dans « Mon profil ».');
    notify(e.id, `Votre parcours passe à l’étape « ${STAGES[e.stage].title} ».`);
    if (e.managerId && e.managerId !== me().id) notify(e.managerId, `${fullName(e)} passe à l’étape « ${STAGES[e.stage].short} ».`);
    toast(`${fullName(e)} passe à l’étape « ${STAGES[e.stage].short} »`);
    ui.selPerson = null;
    commit();
  }

  // ---------------------------------------------------------------- Actions
  const ACT = {
    noop() {},
    go(d) { ui.view = d.v; ui.stage = null; ui.notif = false; ui.drawer = null; window.scrollTo(0, 0); render(); },
    persona(d) {
      if (ui.profile === d.p) return;
      ui = Object.assign({ profile: d.p, view: 'accueil', stage: null }, freshUI());
      render(); toast(`Vous voyez maintenant l’application en tant que ${fullName(me())} (${PROFILES[d.p].label}).`);
    },
    notif() { ui.notif = !ui.notif; render(); },
    'notif-read'() { db.notifications.forEach((n) => { if (n.to === me().id) n.read = true; }); commit(); },
    hub() { if (ui.wheelOpen && Date.now() - openedAt < 500) return; // a tap fires mouseenter (opens) then click
      if (ui.wheelOpen) closeWheel(); else openWheel(); },
    // A stage of the wheel (or of the strip) opens its module.
    stage(d) {
      const i = Number(d.i), v = stageView(i); if (!v) return;
      if (v === 'recrutement') { const j = scopeJobs().find((x) => x.status === (i === 0 ? 'Brouillon' : 'Ouverte')); if (j) ui.recJob = j.id; }
      Object.assign(ui, { view: v, stage: i, selPerson: null, notif: false, drawer: null });
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
    'open-cand'(d) { const c = db.candidates.find((x) => x.id === d.id); if (ui.view !== 'recrutement') { ui.view = 'recrutement'; ui.recJob = c.jobId; } ui.drawer = { type: 'cand', id: d.id }; drawerAnim = true; render(); },
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
      if (k && e[k] < l.days) { toast(`Solde insuffisant : ${fullName(e)} n’a plus que ${e[k]} j.`, 'info'); return; }
      if (k) e[k] -= l.days;
      l.status = 'Approuvée'; l.decidedBy = me().id;
      notify(e.id, `${fullName(me())} a validé votre demande : ${l.type} du ${fmtShort(l.start)} au ${fmtShort(l.end)}.`);
      toast(`Demande de ${fullName(e)} validée`); commit();
    },
    'leave-ko'(d) { ui.modal = { type: 'refuse', id: d.id }; render(); },
    'leave-cancel'(d) { db.leaves = db.leaves.filter((l) => l.id !== d.id); toast('Demande annulée'); commit(); },
    'pay-month'(d) { if (d.m) { ui.payMonth = d.m; render(); } },
    'pay-close'(d) { ui.modal = { type: 'pay-close', m: d.m }; render(); },
    'pay-close-ok'(d) {
      const pr = payrollOf(d.m); pr.closed = true;
      const people = db.employees.filter((e) => inPayroll(e, d.m));
      people.forEach((e) => notify(e.id, `Votre bulletin de paie de ${monthLabel(d.m).toLowerCase()} est disponible.`));
      ui.modal = null; toast(`Paie validée : ${plural(people.length, 'bulletin généré', 'bulletins générés')}`); commit();
    },
    payslip(d) { ui.modal = { type: 'payslip', id: d.id, m: d.m }; render(); },
    'open-job'(d) { ui.view = 'recrutement'; ui.recJob = d.id; ui.drawer = null; render(); },
    'job-new'() { ui.modal = { type: 'job' }; render(); },
    'job-validate'(d) {
      const j = db.jobs.find((x) => x.id === d.id); j.status = 'Ouverte';
      notify(DEPT_HEAD[j.dept], `Votre besoin « ${j.title} » est validé : l’offre est publiée.`);
      toast(`Offre publiée : ${j.title}`); commit();
    },
    'job-close'(d) { const j = db.jobs.find((x) => x.id === d.id); j.status = 'Clôturée'; toast('Offre clôturée'); commit(); },
    'cand-new'(d) { ui.modal = { type: 'cand', jobId: d.id }; render(); },
    'cand-score'(d) { const c = db.candidates.find((x) => x.id === d.id); c.score = Number(d.v); commit(); },
    'cand-move'(d) { moveCandidate(d.id, d.s); },
    hire(d) { ui.modal = { type: 'hire', id: d.id }; render(); },
    reset() { ui.modal = { type: 'reset' }; render(); },
    'reset-ok'() { db = window.TEAMORA_SEED(); save(); ui = Object.assign({ profile: ui.profile, view: 'accueil' }, freshUI()); render(); toast('Démo réinitialisée'); },
  };
  const CHG = {
    fDept(v) { ui.fDept = v; render(); },
    fStatus(v) { ui.fStatus = v; render(); },
    histStatus(v) { ui.histStatus = v; render(); },
    bonus(v, d) { payrollOf(ui.payMonth).bonus[d.id] = Math.max(0, Number(v) || 0); commit(); },
    'cand-stage'(v, d) { moveCandidate(d.id, v); if (ui.modal === null) render(); },
  };
  const INP = {
    q(v) { ui.q = v; const list = filteredEmployees(); document.getElementById('emp-table').innerHTML = empTable(list); document.getElementById('emp-count').textContent = plural(list.length, 'collaborateur', 'collaborateurs'); },
  };
  const LIVE = {
    leave(form) { const fd = new FormData(form); document.getElementById('lv-preview').innerHTML = leavePreview(fd.get('type'), fd.get('start'), fd.get('end'), me()); },
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
      db.leaves.push({ id: uid('l'), empId: e.id, type: v.type, start: v.start, end: v.end, days: d, status: 'En attente', comment: (v.comment || '').trim(), createdAt: TODAY });
      const ap = approverOf(e);
      notify(ap.id, `${fullName(e)} demande ${plural(d, 'jour', 'jours')} (${v.type}) du ${fmtShort(v.start)} au ${fmtShort(v.end)}.`);
      toast(`Demande envoyée à ${fullName(ap)}`); form.reset(); commit();
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
      if (ui.modal.id) { Object.assign(emp(ui.modal.id), data); toast('Fiche mise à jour'); }
      else {
        const id = uid('e');
        const email = `${data.firstName}.${data.lastName}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z.]/g, '') + '@novastudio.fr';
        db.employees.push(Object.assign({ id, email, birthDate: '', address: '', emergency: '', cp: 0, rtt: 0, exit: null, stage: Number(v.stage) }, data));
        if (data.managerId) notify(data.managerId, `${data.firstName} ${data.lastName} rejoint votre équipe le ${fmtDate(data.startDate)}.`);
        toast(`${data.firstName} ${data.lastName} ajouté·e à l’étape « ${STAGES[Number(v.stage)].short} »`);
      }
      ui.modal = null; commit();
    },
    exit(v) {
      if (!v.lastDay) return formError('Indiquez le dernier jour travaillé.');
      const e = emp(ui.modal.id);
      e.exit = { reason: v.reason, lastDay: v.lastDay, comment: (v.comment || '').trim() };
      e.stage = 13; db.journey[e.id] = db.journey[e.id] || {}; db.journey[e.id][13] = [true, false, false, false, false];
      notify(e.id, `Votre départ est enregistré : dernier jour le ${fmtDate(v.lastDay)}.`);
      if (e.managerId) notify(e.managerId, `Départ de ${fullName(e)} (${v.reason}) le ${fmtDate(v.lastDay)}.`);
      ui.modal = null; ui.drawer.tab = 'parcours'; toast(`${fullName(e)} passe à l’étape « Préparation du départ »`); commit();
    },
    job(v) {
      if (!v.title.trim()) return formError('Indiquez l’intitulé du poste.');
      const publish = ui.profile === 'rh' && v.publish === 'on';
      const j = { id: uid('j'), title: v.title.trim(), dept: v.dept, contract: v.contract, location: v.location, status: publish ? 'Ouverte' : 'Brouillon', createdAt: TODAY, budget: v.budget.trim() || 'À définir', reason: v.reason, description: v.description.trim() || 'Description à compléter.' };
      db.jobs.push(j);
      if (!publish) notify('e1', `${fullName(me())} a exprimé un besoin de recrutement : ${j.title} (${j.dept}).`);
      ui.modal = null; ui.view = 'recrutement'; ui.recJob = j.id;
      toast(publish ? `Offre publiée : ${j.title}` : 'Besoin envoyé aux RH pour validation'); commit();
    },
    cand(v) {
      if (!v.name.trim()) return formError('Indiquez le nom du candidat.');
      db.candidates.push({ id: uid('c'), jobId: ui.modal.jobId, name: v.name.trim(), email: v.email.trim() || '—', phone: v.phone.trim() || '—', source: v.source, experience: v.experience.trim(), stage: 'Reçue', score: 0, notes: '', interviews: [], appliedAt: TODAY });
      ui.modal = null; toast('Candidat ajouté'); commit();
    },
    interview(v, form) {
      const c = db.candidates.find((x) => x.id === form.dataset.id);
      if (!v.date) { toast('Choisissez une date d’entretien.', 'info'); return; }
      c.interviews = c.interviews || []; c.interviews.push({ date: v.date, with: v.with, kind: v.kind });
      if (['Reçue', 'Présélection'].includes(c.stage)) c.stage = 'Entretien';
      if (v.with !== me().id) notify(v.with, `${v.kind} avec ${c.name} le ${fmtDate(v.date.slice(0, 10))} à ${v.date.slice(11, 16)}.`);
      toast('Entretien planifié'); commit();
    },
    'cand-note'(v, form) { const c = db.candidates.find((x) => x.id === form.dataset.id); c.notes = v.notes.trim(); toast('Note enregistrée'); commit(); },
    hire(v) {
      const c = db.candidates.find((x) => x.id === ui.modal.id), job = db.jobs.find((j) => j.id === c.jobId), salary = Number(v.salary);
      if (!v.startDate) return formError('Indiquez une date d’arrivée.');
      if (!(salary > 0)) return formError('Indiquez un salaire annuel brut supérieur à 0 €.');
      const [first, ...rest] = c.name.split(' ');
      const id = uid('e');
      db.employees.push({ id, firstName: first, lastName: rest.join(' ') || first, title: job.title, dept: job.dept, managerId: v.managerId, stage: 2, startDate: v.startDate, contract: job.contract, salary,
        email: c.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, '').replace(/ +/g, '.') + '@novastudio.fr', phone: c.phone, location: job.location.split(' ')[0], birthDate: '', address: '', emergency: '', cp: 0, rtt: 0, exit: null });
      c.stage = 'Embauché'; c.empId = id;
      if (v.close === 'on') job.status = 'Pourvue';
      notify(v.managerId, `${c.name} rejoindra votre équipe le ${fmtDate(v.startDate)} (${job.title}).`);
      ui.modal = null; ui.drawer = null;
      toast(`${c.name} est en pré-embauche : retrouvez-le à l’étape « Pré-embauche » de la roue`); commit();
    },
    profile(v) {
      const e = me();
      if (!v.phone.trim()) { document.getElementById('p-err').textContent = 'Le numéro de téléphone est obligatoire.'; return; }
      Object.assign(e, { phone: v.phone.trim(), location: v.location, address: v.address.trim(), emergency: v.emergency.trim() });
      db.journey[e.id] = db.journey[e.id] || {};
      if (e.stage === 5) { const arr = journeyOf(e.id, 5); arr[1] = true; db.journey[e.id][5] = arr; }
      notify('e1', `${fullName(e)} a mis à jour ses informations personnelles.`);
      toast('Informations enregistrées · les RH sont prévenus'); commit();
    },
  };

  Object.assign(ACT, MOD_ACT); Object.assign(CHG, MOD_CHG); Object.assign(FORMS, MOD_FORMS);

  // ---------------------------------------------------------------- Events
  document.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-act]');
    if (!t) { if (ui.notif) { ui.notif = false; render(); } return; }
    if (t.dataset.act !== 'notif' && ui.notif && !t.closest('.notif-pop')) ui.notif = false;
    const fn = ACT[t.dataset.act]; if (fn) fn(t.dataset, t, ev);
  });
  document.addEventListener('change', (ev) => {
    const t = ev.target;
    if (t.dataset && t.dataset.live) LIVE[t.dataset.live](t.form);
    if (t.dataset && t.dataset.change) CHG[t.dataset.change](t.value, t.dataset, t);
  });
  document.addEventListener('input', (ev) => {
    const t = ev.target;
    if (t.dataset && t.dataset.input) INP[t.dataset.input](t.value, t);
    if (t.dataset && t.dataset.live && t.tagName === 'INPUT') LIVE[t.dataset.live](t.form);
  });
  document.addEventListener('submit', (ev) => {
    const f = ev.target.closest('[data-form]'); if (!f) return;
    ev.preventDefault(); FORMS[f.dataset.form](Object.fromEntries(new FormData(f)), f);
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { if (ui.modal) { ui.modal = null; render(); } else if (ui.drawer) { ui.drawer = null; render(); } else if (ui.notif) { ui.notif = false; render(); } return; }
    const t = ev.target;
    if ((ev.key === 'Enter' || ev.key === ' ') && t.matches && t.matches('tr[data-act]')) { ev.preventDefault(); t.click(); }
  });
  window.addEventListener('resize', fitWheel);

  render();
})();
