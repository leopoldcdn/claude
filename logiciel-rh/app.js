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
    try { const d = JSON.parse(localStorage.getItem(STORE)); if (d && d.version === 1) return d; } catch (e) { /* ignore */ }
    return window.TEAMORA_SEED();
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) { /* storage unavailable */ } }
  function loadUI() { try { return JSON.parse(localStorage.getItem(UI_STORE)) || {}; } catch (e) { return {}; } }
  function saveUI() { try { localStorage.setItem(UI_STORE, JSON.stringify({ profile: ui.profile, view: ui.view })); } catch (e) { /* ignore */ } }

  let db = load();
  const PROFILES = {
    rh: { emp: 'e1', label: 'RH' },
    manager: { emp: 'e2', label: 'Manager' },
    salarie: { emp: 'e3', label: 'Salarié' },
  };
  const freshUI = () => ({ wheelOpen: false, selStage: null, selPerson: null, q: '', fDept: '', fStatus: '', sort: 'name', sortDir: 1,
    absTab: 'valider', histStatus: '', planMonth: null, payMonth: null, recJob: null, drawer: null, modal: null, notif: false });
  let ui = Object.assign({ profile: 'rh', view: 'accueil' }, loadUI(), freshUI());
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
  const stageChip = (i) => `<span class="stage-chip"><i style="background:${STAGE_COLORS[i]}"></i>${pad(i + 1)} · ${esc(STAGES[i].short)}</span>`;

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
  const NAVS = {
    rh: [['accueil', 'Accueil', 'home'], ['collaborateurs', 'Collaborateurs', 'users'], ['absences', 'Absences', 'calendar'], ['paie', 'Paie', 'wallet'], ['recrutement', 'Recrutement', 'briefcase']],
    manager: [['accueil', 'Accueil', 'home'], ['collaborateurs', 'Mon équipe', 'users'], ['absences', 'Absences', 'calendar'], ['recrutement', 'Recrutement', 'briefcase']],
    salarie: [['accueil', 'Mon parcours', 'home'], ['profil', 'Mon profil', 'user'], ['absences', 'Mes absences', 'calendar'], ['bulletins', 'Mes bulletins', 'file']],
  };
  function navCount(v) {
    if (v === 'absences') return pendingForMe().length;
    if (v === 'recrutement' && ui.profile === 'rh') return db.jobs.filter((j) => j.status === 'Brouillon').length;
    return 0;
  }
  function sidebar() {
    return `<aside class="side"><div class="brand"><span class="brand-mark">${LOGO}</span><div>Teamora<small>Nova Studio</small></div></div>
      <nav class="nav" aria-label="Navigation principale">${NAVS[ui.profile].map(([v, l, i]) => { const n = navCount(v);
        return `<button type="button" data-act="go" data-v="${v}" ${ui.view === v ? 'aria-current="page"' : ''}>${ic(i)}<span>${l}</span>${n ? `<span class="count num">${n}</span>` : ''}</button>`; }).join('')}</nav>
      <div class="side-foot"><button type="button" class="btn ghost sm" data-act="reset">${ic('refresh')}Réinitialiser la démo</button>
      <p class="demo-note">Aperçu de démonstration : toutes les données sont fictives et enregistrées uniquement dans ce navigateur.</p></div></aside>`;
  }
  const TITLES = { accueil: 'Accueil', collaborateurs: 'Collaborateurs', absences: 'Absences', paie: 'Paie', recrutement: 'Recrutement', profil: 'Mon profil', bulletins: 'Mes bulletins' };
  function topbar() {
    const title = ui.view === 'accueil' && ui.profile === 'salarie' ? 'Mon parcours' : ui.view === 'collaborateurs' && ui.profile === 'manager' ? 'Mon équipe' : ui.view === 'absences' && ui.profile === 'salarie' ? 'Mes absences' : TITLES[ui.view];
    const mine = db.notifications.filter((n) => n.to === me().id);
    const unread = mine.filter((n) => !n.read).length;
    return `<header class="top"><div><div class="crumb">Nova Studio · ${esc(fullName(me()))}</div><h1>${title}</h1></div>
      <div class="top-right"><div class="persona" role="group" aria-label="Voir l’application en tant que">${Object.entries(PROFILES).map(([k, p]) => { const e = emp(p.emp);
        return `<button type="button" data-act="persona" data-p="${k}" aria-pressed="${ui.profile === k}">${avatar(e)}<span class="who-name">${esc(e.firstName)} ·</span> ${p.label}</button>`; }).join('')}</div>
      <button type="button" class="icon-btn" data-act="notif" aria-label="Notifications (${unread} non lues)" aria-expanded="${ui.notif}">${ic('bell')}${unread ? `<span class="dot num">${unread}</span>` : ''}</button></div>
      ${ui.notif ? `<div class="card notif-pop" data-act="noop"><div class="card-h"><h3>Notifications</h3>${unread ? '<button type="button" class="btn ghost sm" data-act="notif-read">Tout marquer comme lu</button>' : ''}</div>
        ${mine.length ? mine.slice(0, 8).map((n) => `<div class="notif ${n.read ? '' : 'unread'}"><div>${esc(n.text)}<small>${fmtDate(n.date)}</small></div></div>`).join('') : '<div class="empty">Aucune notification.</div>'}</div>` : ''}</header>`;
  }

  // ---------------------------------------------------------------- Home (wheel)
  const W = { cx: 430, cy: 380, R: 250, LR: 310 };
  const ang = (i) => (-90 + i * 22.5) * Math.PI / 180;
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
        ${k('Mon parcours', `${e.stage + 1}<span class="muted" style="font-size:16px"> / 16</span>`, esc(STAGES[e.stage].title))}${k('Dernier bulletin', last ? eur0(calcPay(e, last).net) : '—', last ? `Net payé · ${monthLabel(last)}` : 'Aucun bulletin')}</div>`;
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
    const sal = ui.profile === 'salarie', m = me();
    const nodes = STAGES.map((s, i) => {
      let extra = '', cls = '';
      if (sal) { if (i < m.stage) extra = `<span class="ck">${ic('check')}</span>`; else if (i === m.stage) cls = 'current'; else cls = 'future'; }
      else { const n = stageCount(i); if (n) extra = `<span class="badge num">${n}</span>`; }
      if (ui.selStage === i) cls += ' sel';
      return `<button type="button" class="node ${cls}" data-act="stage" data-i="${i}" style="background:${STAGE_COLORS[i]}" aria-label="Étape ${i + 1} : ${esc(s.title)}" tabindex="${ui.wheelOpen ? 0 : -1}">${ic(s.icon)}${extra}</button>`;
    }).join('');
    const labels = STAGES.map((s, i) => {
      const p = nodePos(i, W.LR), c = Math.cos(ang(i)), sn = Math.sin(ang(i));
      let tr, align;
      if (c > 0.3) { tr = 'translate(0,-50%)'; align = 'left'; } else if (c < -0.3) { tr = 'translate(-100%,-50%)'; align = 'right'; } else { tr = sn < 0 ? 'translate(-50%,-100%)' : 'translate(-50%,0)'; align = 'center'; }
      return `<div class="lab" style="left:${W.cx + p.x}px;top:${W.cy + p.y}px;transform:${tr};text-align:${align}"><div class="lab-in"><small style="color:${STAGE_COLORS[i]}">${pad(i + 1)}</small><b>${esc(s.short)}</b></div></div>`;
    }).join('');
    const hubText = sal ? `<small>MON PARCOURS</small><b>Étape ${m.stage + 1}<br>sur 16</b><span class="hub-n">${esc(STAGES[m.stage].short)}</span>`
      : ui.profile === 'manager' ? `<small>PARCOURS</small><b>Équipe ${esc(m.dept)}</b><span class="hub-n num">${plural(scopeEmployees().length, 'personne', 'personnes')}</span>`
        : `<small>PARCOURS</small><b>Collaborateur</b><span class="hub-n num">${plural(db.employees.filter((e) => e.stage < 15).length, 'collaborateur', 'collaborateurs')}</span>`;
    return `<div class="wheel-box" id="wheel-box"><div class="wheel" id="wheel">${labels}${nodes}
      <button type="button" class="hub" data-act="hub" aria-expanded="${ui.wheelOpen}" aria-label="${ui.wheelOpen ? 'Replier' : 'Déplier'} les étapes du parcours">${hubText}</button></div></div>
      <p class="wheel-hint" id="wheel-hint">${ui.wheelOpen ? 'Cliquez sur une étape pour l’ouvrir' : 'Survolez ou touchez la roue pour afficher les 16 étapes'}</p>`;
  }
  function stepsList(arr, steps, editable, empId, stage) {
    return `<div class="steps">${steps.map((t, k) => `<div class="step ${arr[k] ? 'done' : ''}">${editable
      ? `<button type="button" class="ckbox" role="checkbox" aria-checked="${arr[k]}" data-act="jcheck" data-id="${empId}" data-s="${stage}" data-k="${k}" aria-label="${esc(t)}">${ic('check')}</button>`
      : `<span class="ckbox" aria-checked="${arr[k]}">${ic('check')}</span>`}<span>${esc(t)}</span></div>`).join('')}</div>`;
  }
  function stageHead(i, closable = true) {
    const s = STAGES[i], c = STAGE_COLORS[i];
    return `<div class="stage-head"><span class="stage-ic" style="background:${c}">${ic(s.icon)}</span><div style="flex:1;min-width:0"><small style="color:${c}">ÉTAPE ${pad(i + 1)} / 16</small><h2>${esc(s.title)}</h2></div>
      ${closable ? `<button type="button" class="icon-btn" data-act="stage" data-i="${i}" aria-label="Fermer l’étape">${ic('x')}</button>` : ''}</div>`;
  }
  const MODULE_LINK = { recrutement: ['recrutement', 'Ouvrir le recrutement'], absences: ['absences', 'Ouvrir les absences'], paie: ['paie', 'Ouvrir la paie'], collaborateurs: ['collaborateurs', 'Ouvrir les collaborateurs'] };
  function moduleBtn(i) {
    const mod = STAGES[i].module; if (!mod) return '';
    let [v, label] = MODULE_LINK[mod];
    if (ui.profile === 'salarie') { const map = { absences: ['absences', 'Mes absences'], paie: ['bulletins', 'Mes bulletins'], collaborateurs: ['profil', 'Mon profil'] }; if (!map[mod]) return ''; [v, label] = map[mod]; }
    if (!NAVS[ui.profile].some((n) => n[0] === v)) return '';
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
      <div class="card card-b"><p class="muted" style="margin:0">Survolez la roue pour faire apparaître les 16 étapes du parcours collaborateur. Le nombre sur chaque étape indique combien de personnes (ou de besoins et candidats) s’y trouvent. Cliquez sur une étape pour suivre les tâches de chacun.</p></div>`;
  }
  const viewHome = () => `${kpiStrip()}<div class="home"><div class="card wheel-card">${wheelHTML()}</div><div class="panel" id="panel">${ui.selStage === null ? defaultPanel() : stagePanel(ui.selStage)}</div></div>`;

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
    const hint = document.getElementById('wheel-hint'); if (hint) hint.textContent = 'Cliquez sur une étape pour l’ouvrir';
    const hub = document.querySelector('.hub'); if (hub) { hub.setAttribute('aria-expanded', 'true'); tw(hub, { scale: 1.03, duration: 0.4 }); }
  }
  function closeWheel() {
    if (!ui.wheelOpen) return; ui.wheelOpen = false;
    const nodes = [...document.querySelectorAll('.node')];
    nodes.forEach((n, i) => { n.tabIndex = -1; tw(n, { x: 0, y: 0, opacity: 0, scale: 0.4, duration: 0.45, delay: (15 - i) * 0.02, ease: 'power3.in' }); });
    document.querySelectorAll('.lab-in').forEach((l) => tw(l, { opacity: 0, duration: 0.2 }));
    const hint = document.getElementById('wheel-hint'); if (hint) hint.textContent = 'Survolez ou touchez la roue pour afficher les 16 étapes';
    const hub = document.querySelector('.hub'); if (hub) { hub.setAttribute('aria-expanded', 'false'); tw(hub, { scale: 1, duration: 0.4 }); }
  }
  function fitWheel() { const box = document.getElementById('wheel-box'), w = document.getElementById('wheel'); if (box && w) w.style.transform = `scale(${box.clientWidth / 860})`; }
  function bindWheel() {
    const box = document.getElementById('wheel-box'); if (!box) return;
    fitWheel(); placeWheel();
    box.addEventListener('mouseenter', () => { clearTimeout(closeTimer); openWheel(); });
    box.addEventListener('mouseleave', () => { if (ui.selStage === null) closeTimer = setTimeout(closeWheel, 700); });
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
    const tabs = [['infos', 'Informations'], ['parcours', 'Parcours'], ['absences', 'Absences']].concat(rh ? [['remu', 'Rémunération']] : []);
    const mgr = e.managerId ? emp(e.managerId) : null;
    let body = '';
    if (tab === 'infos') {
      body = `<div class="info"><div><span>E-mail</span>${esc(e.email)}</div><div><span>Téléphone</span>${esc(e.phone)}</div><div><span>Poste</span>${esc(e.title)}</div><div><span>Service</span>${esc(e.dept)}</div>
        <div><span>Manager</span>${mgr ? esc(fullName(mgr)) : '—'}</div><div><span>Contrat</span>${esc(e.contract)}</div><div><span>Date d’entrée</span>${fmtDate(e.startDate)}</div><div><span>Ancienneté</span>${seniority(e.startDate)}</div>
        <div><span>Lieu de travail</span>${esc(e.location)}</div>${rh ? `<div><span>Date de naissance</span>${fmtDate(e.birthDate)}</div><div><span>Adresse</span>${esc(e.address) || '—'}</div>` : ''}<div><span>Contact d’urgence</span>${esc(e.emergency) || '—'}</div></div>
        ${e.exit ? `<div class="card card-b"><b>Départ prévu</b><p class="muted" style="margin:4px 0 0">${esc(e.exit.reason)} · dernier jour le ${fmtDate(e.exit.lastDay)}${e.exit.comment ? ` · ${esc(e.exit.comment)}` : ''}</p></div>` : ''}`;
    } else if (tab === 'parcours') {
      const canEdit = rh || (ui.profile === 'manager' && e.managerId === me().id);
      body = `<div class="journey-strip" aria-label="Étape ${e.stage + 1} sur 16">${STAGES.map((s, i) => `<i title="${esc(s.title)}" style="${i <= e.stage ? `background:${STAGE_COLORS[i]};` : ''}${i === e.stage ? 'outline:2px solid var(--fg);outline-offset:1px' : ''}"></i>`).join('')}</div>
        <div class="card card-b">${stageHead(e.stage, false)}<div style="margin-top:12px">${stepsList(journeyOf(e.id, e.stage), STAGES[e.stage].steps, canEdit, e.id, e.stage)}</div>
        ${rh && e.stage < 15 ? `<div class="toolbar" style="margin-top:12px"><button type="button" class="btn primary sm" data-act="advance" data-id="${e.id}">Passer à « ${esc(STAGES[e.stage + 1].short)} »${ic('arrow')}</button></div>` : ''}</div>`;
    } else if (tab === 'absences') {
      const ls = db.leaves.filter((l) => l.empId === e.id).sort((a, b) => b.start.localeCompare(a.start));
      body = `<div class="balances"><div class="card bal"><span class="l">Congés payés</span><div class="v num">${e.cp} <small>j</small></div></div><div class="card bal"><span class="l">RTT</span><div class="v num">${e.rtt} <small>j</small></div></div><div class="card bal"><span class="l">Demandes</span><div class="v num">${ls.length}</div></div></div>
        <div class="card"><div class="req-list">${ls.length ? ls.map((l) => `<div class="req"><div class="what"><b>${esc(l.type)}</b><small>${fmtShort(l.start)} → ${fmtDate(l.end)} · ${plural(l.days, 'jour', 'jours')}</small></div>${leavePill(l)}</div>`).join('') : '<div class="empty">Aucune absence enregistrée.</div>'}</div></div>`;
    } else {
      const months = payMonths().filter((m) => db.payroll[m] && db.payroll[m].closed && inPayroll(e, m)).reverse();
      body = `<div class="info"><div><span>Salaire annuel brut</span><span class="num" style="font-size:20px;color:var(--fg);font-weight:700">${eur0(e.salary)}</span></div><div><span>Mensuel brut</span><span class="num" style="font-size:20px;color:var(--fg);font-weight:700">${eur(e.salary / 12)}</span></div></div>
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
      <div class="info"><div><span>E-mail</span>${esc(c.email)}</div><div><span>Téléphone</span>${esc(c.phone)}</div><div><span>Source</span>${esc(c.source)}</div><div><span>Candidature reçue le</span>${fmtDate(c.appliedAt)}</div><div style="grid-column:1/-1"><span>Expérience</span>${esc(c.experience) || '—'}</div></div>
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
      <div class="card-b" style="border-top:1px solid var(--line)"><div class="info"><div><span>E-mail professionnel</span>${esc(e.email)}</div><div><span>Manager</span>${mgr ? esc(fullName(mgr)) : '—'}</div><div><span>Contrat</span>${esc(e.contract)}</div>
        <div><span>Date d’entrée</span>${fmtDate(e.startDate)} · ${seniority(e.startDate)}</div><div><span>Étape du parcours</span>${stageChip(e.stage)}</div><div><span>Salaire annuel brut</span><span class="num">${eur0(e.salary)}</span></div></div></div></div>
      <form class="card" data-form="profile" novalidate><div class="card-h"><h3>Mes informations personnelles</h3><span class="muted" style="font-size:13px">Les RH sont prévenus de chaque modification</span></div><div class="card-b"><div class="form-grid">
        <div class="field"><label for="p-phone">Téléphone</label><input id="p-phone" name="phone" class="input" value="${esc(e.phone)}" autocomplete="tel"></div>
        <div class="field"><label for="p-loc">Lieu de travail</label><select id="p-loc" name="location" class="select">${['Paris', 'Lyon', 'Télétravail majoritaire'].map((l) => `<option ${l === e.location ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="field full"><label for="p-address">Adresse postale</label><input id="p-address" name="address" class="input" value="${esc(e.address)}" autocomplete="street-address"></div>
        <div class="field full"><label for="p-emerg">Contact d’urgence</label><input id="p-emerg" name="emergency" class="input" value="${esc(e.emergency)}" placeholder="Nom · téléphone"></div></div>
        <div class="toolbar" style="margin-top:16px"><span class="err" id="p-err"></span><button class="btn primary" style="margin-left:auto">Enregistrer</button></div></div></form>`;
  }

  // ---------------------------------------------------------------- Modals
  function modalHTML() {
    const m = ui.modal; if (!m) return '';
    const shell = (title, body, foot, wide) => `<div class="modal" data-act="modal-bg"><div class="modal-box ${wide ? 'wide' : ''}" data-act="noop" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-h"><h2>${title}</h2><button type="button" class="icon-btn" data-act="modal-close" aria-label="Fermer">${ic('x')}</button></div>${body}${foot || ''}</div></div>`;
    const formShell = (title, form, fields, submit, wide) => shell(title, `<form data-form="${form}" novalidate><div class="modal-b">${fields}<p class="err" id="m-err" aria-live="polite"></p></div><div class="modal-f"><button type="button" class="btn ghost" data-act="modal-close">Annuler</button><button class="btn primary">${submit}</button></div></form>`, '', wide);
    const opt = (list, v) => list.map((x) => (Array.isArray(x) ? `<option value="${esc(x[0])}" ${x[0] === v ? 'selected' : ''}>${esc(x[1])}</option>` : `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`)).join('');
    const f = (id, label, input, full) => `<div class="field ${full ? 'full' : ''}"><label for="${id}">${label}</label>${input}</div>`;
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
  const VIEWS = { accueil: viewHome, collaborateurs: viewEmployees, absences: viewAbsences, paie: viewPay, recrutement: viewRecruitment, profil: viewProfile, bulletins: viewPayslips };
  let drawerAnim = false;
  function render() {
    if (!NAVS[ui.profile].some((n) => n[0] === ui.view)) ui.view = 'accueil';
    const scrollY = window.scrollY;
    document.getElementById('app').innerHTML = `<div class="app">${sidebar()}<div class="main">${topbar()}<main class="view" id="view">${VIEWS[ui.view]()}</main></div></div>`;
    let ov = '';
    if (ui.drawer) {
      const content = ui.drawer.type === 'emp' ? (emp(ui.drawer.id) && empDrawer(emp(ui.drawer.id))) : (db.candidates.find((c) => c.id === ui.drawer.id) && candDrawer(db.candidates.find((c) => c.id === ui.drawer.id)));
      if (content) ov += `<div class="scrim ${drawerAnim ? '' : 'on'}" data-act="close-drawer"></div><aside class="drawer ${drawerAnim ? '' : 'on'}" aria-label="Fiche">${content}</aside>`;
      else ui.drawer = null;
    }
    ov += modalHTML();
    document.getElementById('overlay').innerHTML = ov;
    if (drawerAnim) { drawerAnim = false; requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.scrim, .drawer').forEach((el) => el.classList.add('on')))); }
    window.scrollTo(0, scrollY);
    if (ui.view === 'accueil') bindWheel();
    if (ui.view === 'recrutement') bindBoard();
    saveUI();
  }
  const commit = () => { save(); render(); };

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
    notify(e.id, `Votre parcours passe à l’étape ${e.stage + 1} : ${STAGES[e.stage].title}.`);
    if (e.managerId && e.managerId !== me().id) notify(e.managerId, `${fullName(e)} passe à l’étape « ${STAGES[e.stage].short} ».`);
    toast(`${fullName(e)} passe à l’étape ${e.stage + 1} · ${STAGES[e.stage].short}`);
    ui.selPerson = null;
    if (ui.view === 'accueil' && ui.selStage !== null) ui.selStage = e.stage;
    commit();
  }

  // ---------------------------------------------------------------- Actions
  const ACT = {
    noop() {},
    go(d) { ui.view = d.v; ui.notif = false; ui.drawer = null; window.scrollTo(0, 0); render(); },
    persona(d) {
      if (ui.profile === d.p) return;
      ui = Object.assign({ profile: d.p, view: 'accueil' }, freshUI());
      render(); toast(`Vous voyez maintenant l’application en tant que ${fullName(me())} (${PROFILES[d.p].label}).`);
    },
    notif() { ui.notif = !ui.notif; render(); },
    'notif-read'() { db.notifications.forEach((n) => { if (n.to === me().id) n.read = true; }); commit(); },
    hub() { if (ui.wheelOpen && Date.now() - openedAt < 500) return; // a tap fires mouseenter (opens) then click
      if (ui.wheelOpen) { ui.selStage = null; ui.selPerson = null; closeWheel(); document.getElementById('panel').innerHTML = defaultPanel(); } else openWheel(); },
    stage(d) {
      const i = Number(d.i);
      ui.selStage = ui.selStage === i ? null : i; ui.selPerson = null;
      document.getElementById('panel').innerHTML = ui.selStage === null ? defaultPanel() : stagePanel(i);
      document.querySelectorAll('.node').forEach((n, k) => n.classList.toggle('sel', k === ui.selStage));
      if (window.innerWidth <= 1180 && ui.selStage !== null) document.getElementById('panel').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    },
    person(d) { ui.selPerson = ui.selPerson === d.id ? null : d.id; document.getElementById('panel').innerHTML = stagePanel(ui.selStage); },
    jcheck(d) {
      const s = Number(d.s), k = Number(d.k);
      db.journey[d.id] = db.journey[d.id] || {};
      const arr = journeyOf(d.id, s); arr[k] = !arr[k]; db.journey[d.id][s] = arr;
      save();
      if (ui.view === 'accueil' && !ui.drawer) { document.getElementById('panel').innerHTML = stagePanel(ui.selStage); } else render();
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
      toast(`${c.name} est en pré-embauche : retrouvez-le à l’étape 3 de la roue`); commit();
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
