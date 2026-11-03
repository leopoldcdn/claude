// ==UserScript==
// @name         Vinted achat à l'heure H
// @namespace    local
// @version      2.2
// @match        https://www.vinted.fr/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
  'use strict';
  const T0 = Date.now();
  const log = (...a) => console.log('[Vinted bot]', `+${Date.now() - T0}ms`, ...a);

  // ======== CONFIG ========
  const SALE_TIME     = '2026-11-04T18:00:00+01:00';
  const ITEM_ID       = '10586050613';
  const AUTO_PAY      = false;   // true = clique aussi sur "Payer"
  const MAX_TOTAL     = 0;       // en €. 0 = pas de plafond. Avec AUTO_PAY : refuse de payer au-dessus de ce total
  const RELAY_KEYWORD = '';      // '' = point relais présélectionné ; sinon ex: 'LIDL' ou 'PORTMANN'
  const MIN_GAP_MS    = 1000;    // délai mini entre deux rechargements (ne pas descendre trop bas : risque de blocage)
  const SETTLE_MS     = 700;     // une fois le contenu de l'annonce affiché, attente avant de conclure "pas encore dispo"
  const MAX_WAIT_MS   = 3500;    // attente maximale par tentative
  const MAX_RELOADS   = 40;
  const ARM_TTL_MIN   = 120;     // l'armement expire X minutes après l'heure H
  // =========================

  const KEY = 'vb_state', LOGKEY = 'vb_log';
  const saleAt = new Date(SALE_TIME).getTime();
  const TAB = (() => {
    try {
      let t = sessionStorage.getItem('vb_tab');
      if (!t) { t = Math.random().toString(36).slice(2); sessionStorage.setItem('vb_tab', t); }
      return t;
    } catch { return 'x'; }
  })();
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
  let st = load();
  let offset = Number(st.offset) || 0;
  const now = () => Date.now() + offset;
  // Armé = armé DANS CET ONGLET, et pas expiré (évite qu'un ancien armement se réveille plus tard)
  const armed = () => !!st.armed && st.tab === TAB && now() < saleAt + ARM_TTL_MIN * 60000;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Journal horodaté qui survit aux rechargements : tapez vbDump() dans la console après un essai
  const ev = (n, x) => {
    try {
      const a = JSON.parse(localStorage.getItem(LOGKEY) || '[]');
      a.push({ heure: new Date(now()).toISOString().slice(11, 23), evt: n, info: x ?? '' });
      localStorage.setItem(LOGKEY, JSON.stringify(a.slice(-300)));
    } catch {}
  };
  const note = (n, x) => { log(n, x ?? ''); ev(n, x); };
  window.vbDump = () => console.table(JSON.parse(localStorage.getItem(LOGKEY) || '[]'));
  log('script chargé');

  const BUY = ['[data-testid="item-buy-button"]'];
  const PAY = ['[data-testid="single-checkout-order-summary-purchase-button"]'];
  const byText = (re) => [...document.querySelectorAll('button')].find((b) => re.test(b.textContent) && !b.disabled);
  const findBuy = () => BUY.map((s) => document.querySelector(s)).find((b) => b && !b.disabled) || byText(/^\s*acheter\s*$/i);
  const findPay = () => PAY.map((s) => document.querySelector(s)).find((b) => b && !b.disabled) || byText(/^\s*payer/i);

  const visible = (e) => {
    const r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(e);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
  };
  const findByText = (re, sel = 'button,[role="button"],[role="radio"],label,li,div,span,p,a') =>
    [...document.querySelectorAll(sel)]
      .filter((e) => re.test(e.textContent || '') && visible(e))
      .sort((a, b) => a.textContent.length - b.textContent.length)[0];

  // Clic "souris" complet, aux coordonnées réelles de l'élément (ce que fait un vrai clic)
  const realClick = (el) => {
    let r = el.getBoundingClientRect();
    const inView = r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
    if (!inView) { // on ne fait défiler que si nécessaire, et sans animation (sinon les coordonnées seraient fausses)
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      r = el.getBoundingClientRect();
    }
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const target = document.elementFromPoint(x, y) || el;
    const base = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, button: 0, pointerId: 1, pointerType: 'mouse', isPrimary: true };
    for (const [type, buttons] of [['pointerdown', 1], ['mousedown', 1], ['pointerup', 0], ['mouseup', 0], ['click', 0]]) {
      const Ev = type.startsWith('pointer') && window.PointerEvent ? PointerEvent : MouseEvent;
      target.dispatchEvent(new Ev(type, { ...base, buttons }));
    }
    log('clic envoyé sur', target.tagName, Math.round(x), Math.round(y));
  };

  // Recherche rapide par nœud de texte (aucun calcul de mise en page sur toute la page)
  function findText(re) {
    const root = document.body || document.documentElement;
    if (!root) return null;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (re.test(n.nodeValue)) {
        const el = n.parentElement;
        if (el && visible(el)) return el;
      }
    }
    return null;
  }
  const matchAny = (res) => {
    for (const re of res) { const el = findText(re); if (el) return { el, re }; }
    return null;
  };
  // Attend qu'une condition devienne vraie : réagit à chaque changement de la page (+ filet 40 ms)
  const until = (fn, ms) => new Promise((resolve) => {
    let fin = false;
    const done = (v) => { if (fin) return; fin = true; mo.disconnect(); clearInterval(iv); clearTimeout(to); resolve(v); };
    const check = () => { if (fin) return; try { const r = fn(); if (r) done(r); } catch {} };
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement || document, { childList: true, subtree: true, characterData: true, attributes: true });
    const iv = setInterval(check, 40);
    const to = setTimeout(() => done(null), ms);
    check();
  });
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // ---------- Alertes : son + notification système ----------
  // Le son seul est souvent bloqué par Chrome après un rechargement (pas de geste utilisateur sur la nouvelle page) :
  // la notification, autorisée une fois au clic sur "Armer", reste fiable.
  let ac;
  const beep = (f = 880, d = 0.25) => {
    try {
      ac = ac || new AudioContext();
      if (ac.state === 'suspended') ac.resume();
      const o = ac.createOscillator(); o.frequency.value = f; o.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + d);
    } catch {}
  };
  const notify = (msg) => { try { if (Notification.permission === 'granted') new Notification('Vinted bot', { body: msg, requireInteraction: true }); } catch {} };
  const alertUser = (msg, f = 1200) => { beep(f, 0.5); notify(msg); };

  // ---------- Détection de blocage / vérification anti-bot (vérifiée au plus 1 fois par seconde) ----------
  const BLOCK_BODY = /session a été bloquée|activité inhabituelle|verify you are human|vérifiez que vous êtes/i;
  const BLOCK_TITLE = /just a moment|un instant|attention required/i;
  let lastBlockCheck = 0, lastBlockVal = false;
  const blocked = () => {
    const t = Date.now();
    if (t - lastBlockCheck < 1000) return lastBlockVal;
    lastBlockCheck = t;
    lastBlockVal = BLOCK_TITLE.test(document.title || '') || BLOCK_BODY.test(document.body?.innerText || '');
    return lastBlockVal;
  };

  // ---------- Bandeau d'état ----------
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;z-index:99999;bottom:12px;right:12px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;font:14px system-ui;max-width:300px';
  const txt = document.createElement('span');
  const actions = document.createElement('div');
  actions.style.cssText = 'margin-top:6px';
  box.append(txt, actions);
  const mount = () => { if (document.body && !box.isConnected) document.body.appendChild(box); };
  document.addEventListener('DOMContentLoaded', mount);
  const say = (t) => { txt.textContent = t; mount(); };
  const clearBtns = () => { actions.textContent = ''; };
  const addBtn = (label, color, fn) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText = `margin-right:6px;padding:5px 9px;border:0;border-radius:6px;background:${color};color:#fff;cursor:pointer`;
    b.onclick = fn;
    actions.appendChild(b);
  };
  say('Vinted bot chargé');

  // ---------- Horloge ----------
  // L'heure du Mac (synchronisée par NTP, précision ~20 ms) est la référence. On la contrôle seulement
  // via l'en-tête Date du serveur (résolution 1 s) pour détecter un Mac franchement déréglé (> 1,5 s).
  let skewTxt = '';
  async function checkClock() {
    try {
      const t0 = Date.now();
      const r = await fetch('/', { method: 'HEAD', cache: 'no-store' });
      const t1 = Date.now();
      const server = new Date(r.headers.get('date')).getTime();
      if (!server) return;
      const skew = server + 500 - (t0 + t1) / 2; // la date HTTP est tronquée à la seconde : on centre l'estimation
      st.skew = Math.round(skew);
      if (Math.abs(skew) > 1500) {
        offset = skew; st.offset = skew;
        skewTxt = ` ⚠ Mac décalé de ~${(skew / 1000).toFixed(1)} s (corrigé) : activez l'heure automatique`;
      } else { offset = 0; st.offset = 0; }
      save(st);
    } catch {}
  }

  const onItem = () => location.pathname.includes(ITEM_ID);
  const onCheckout = () => /checkout/.test(location.pathname);

  function disarm(msg) {
    st = { offset: st.offset || 0, skew: st.skew };
    save(st); clearBtns(); say(msg); beep(300, 0.6); notify(msg);
    note('désarmé', msg);
  }

  // Empêche la mise en veille de l'écran pendant l'attente
  let wake;
  const keepAwake = async () => { try { wake = await navigator.wakeLock.request('screen'); } catch {} };
  document.addEventListener('visibilitychange', () => { if (!document.hidden && armed()) keepAwake(); });
  // Interrupteur d'urgence : touche Échap
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && armed()) disarm('Arrêté manuellement (Échap).'); });

  function arm() {
    st = { armed: true, tab: TAB, phase: 'waiting', attempts: 0, offset, skew: st.skew };
    save(st);
    try { localStorage.removeItem(LOGKEY); } catch {}
    clearBtns();
    addBtn('Stop', '#c0392b', () => disarm('Arrêté manuellement.'));
    keepAwake();
    try { if (Notification.permission === 'default') Notification.requestPermission(); } catch {}
    beep();
    note('armé', `H=${SALE_TIME}`);
    tick();
  }

  // ---------- Attente jusqu'à l'heure H, puis rechargement ----------
  let waitingStarted = false;
  async function waiting() {
    const cd = setInterval(() => {
      if (!armed()) return clearInterval(cd);
      const left = saleAt - now();
      say(`Armé. T-${Math.max(0, Math.ceil(left / 1000))}s${document.hidden ? ' ⚠ onglet en arrière-plan : mettez-le au premier plan' : ''}`);
      if (left < 10500 && left > 9750) beep(660, 0.1);
    }, 250);
    for (;;) {
      if (!armed()) { clearInterval(cd); return; }
      const left = saleAt - now();
      if (left <= 0) break;
      if (left > 1000) { await sleep(Math.min(left - 900, 1000)); continue; }
      if (left > 30) { await sleep(left - 25); continue; }
      while (now() < saleAt) { /* attente active, au plus ~25 ms */ }
      break;
    }
    clearInterval(cd);
    if (!armed()) return;
    st.phase = 'live'; st.attempts = 0; save(st);
    note('H atteinte → rechargement', `retard timer ${now() - saleAt} ms`);
    location.reload();
  }

  // ---------- Phase "live" : surveillance rapide du bouton Acheter ----------
  let firstClick = 0, lastClick = 0;
  const waitCheckout = () => {
    if (!armed()) return;
    if (onCheckout()) return tick();
    const t = Date.now();
    if (t - firstClick > 8000) { if (onItem()) location.reload(); return; }
    if (t - lastClick > 800) { // si la page n'était pas encore prête, on reclique
      const b = findBuy();
      if (b) { lastClick = t; b.click(); log('reclic Acheter'); }
    }
    setTimeout(waitCheckout, 20);
  };

  function liveWatch() {
    let done = false, renderedAt = 0;
    // Marqueur "le contenu de l'annonce est affiché" (libellés du tableau de détails ou bouton d'offre)
    const RENDERED_RE = /^\s*(Marque|État|Ajouté|Faire une offre)\s*$/i;
    const stop = () => { done = true; clearInterval(iv); mo.disconnect(); };
    const giveUp = () => {
      stop();
      if (blocked()) return disarm('Blocage / vérification anti-bot détecté(e) : arrêt.');
      if (st.attempts >= MAX_RELOADS) return disarm('Bouton jamais actif : arrêt.');
      st.attempts++; save(st);
      say(`Pas encore dispo (tentative ${st.attempts}/${MAX_RELOADS})`);
      note('pas de bouton → rechargement', `#${st.attempts}`);
      location.reload();
    };
    const attempt = () => {
      if (done) return;
      if (!armed()) return stop();
      const b = findBuy();
      if (b) {
        stop();
        firstClick = lastClick = Date.now();
        b.click(); // le clic d'abord, le reste ensuite
        say('Achat !'); beep(1000, 0.3);
        note('clic Acheter', `tentative ${st.attempts}, ${Date.now() - T0} ms après le début du chargement`);
        return waitCheckout();
      }
      // Pas de bouton : on ne conclut qu'une fois l'annonce affichée ET stabilisée
      // (sinon on couperait la page avant que le bouton ait le temps de s'afficher).
      const age = Date.now() - T0;
      if (!renderedAt && findText(RENDERED_RE)) renderedAt = Date.now();
      if (age >= MAX_WAIT_MS || (age >= MIN_GAP_MS && renderedAt && Date.now() - renderedAt >= SETTLE_MS)) giveUp();
    };
    const iv = setInterval(attempt, 25);
    const mo = new MutationObserver(attempt);
    mo.observe(document, { childList: true, subtree: true, attributes: true });
  }

  // ---------- Livraison : point relais + confirmation ----------
  const delivery = { started: false, done: false, ok: false };
  const CHOSEN_RE = /Disponible au point relais sous/i;
  const CHOOSE_RE = /(Choisir|Sélectionner|Selectionner)\s+(un\s+|le\s+)?point/i;
  const CONFIRM_RE = /^\s*Confirmer\s*$/i;
  const MODAL_RE = /^\s*Point de retrait et de dépôt\s*$/i;
  const modalOpen = () => matchAny([MODAL_RE, CONFIRM_RE]);
  const timed = (label, t0) => note(label, `${Date.now() - t0} ms`);

  // Ouvre la fenêtre : clic souris d'abord (celui qui fonctionne), clic natif en secours
  async function openModal() {
    for (let i = 0; i < 3; i++) {
      const row = findText(CHOOSE_RE);
      if (!row) return !!modalOpen();
      const t0 = Date.now();
      realClick(row);
      if (await until(modalOpen, 2500)) { timed('fenêtre ouverte (clic souris)', t0); return true; }
      row.click();
      if (await until(modalOpen, 2500)) { timed('fenêtre ouverte (clic natif)', t0); return true; }
    }
    return false;
  }

  // Clique sur Confirmer à l'instant où il apparaît
  async function confirmPoint() {
    const t0 = Date.now();
    if (!(await until(() => findText(CONFIRM_RE), 15000))) throw new Error('bouton Confirmer introuvable (fenêtre ouverte)');
    timed('Confirmer apparu', t0);
    if (RELAY_KEYWORD) {
      const item = findByText(new RegExp(escapeRe(RELAY_KEYWORD), 'i'), 'div,li,button,span,p');
      if (!item) throw new Error(`point relais "${RELAY_KEYWORD}" introuvable`);
      realClick(item);
      await sleep(300);
    }
    for (let i = 0; i < 4; i++) {
      const b = findText(CONFIRM_RE);
      if (!b) return;
      const t1 = Date.now();
      realClick(b);
      if (await until(() => !modalOpen(), 1500)) { timed('fenêtre fermée (clic souris)', t1); return; }
      const b2 = findText(CONFIRM_RE);
      if (!b2) return;
      b2.click();
      if (await until(() => !modalOpen(), 1500)) { timed('fenêtre fermée (clic natif)', t1); return; }
    }
    throw new Error('Confirmer sans effet');
  }

  async function chooseDelivery() {
    try {
      say('Réglage de la livraison...');
      const t0 = Date.now();
      // clique dès que la ligne "Choisir un point relais" (ou un point déjà choisi) apparaît
      let first = await until(() => matchAny([CHOOSE_RE, CHOSEN_RE]), 8000);
      if (!first) {
        const opt = findText(/Envoi au point relais/i);
        if (opt) realClick(opt);
        first = await until(() => matchAny([CHOOSE_RE, CHOSEN_RE]), 5000);
      }
      if (!first) throw new Error('option point relais introuvable');
      timed(first.re === CHOOSE_RE ? 'ligne "Choisir" apparue' : 'point déjà choisi', t0);
      if (first.re === CHOSEN_RE) return true;
      if (!(await openModal())) throw new Error('fenêtre point relais introuvable');
      await confirmPoint();
      const saved = await until(() => !findText(CHOOSE_RE), 4000);
      if (!saved) throw new Error('le point relais n\'a pas été enregistré');
      return true;
    } catch (e) {
      note('ERREUR livraison', e.message);
      say('Livraison à régler à la main : ' + e.message);
      alertUser('Livraison à régler à la main : ' + e.message, 300);
      return false;
    }
  }

  // Lit "Total à payer 44,65 €" (null si introuvable)
  function readTotal() {
    const m = (document.body?.innerText || '').match(/Total à payer\s*[:\n]?\s*([\d \s.]*\d,\d{2})\s*€/i);
    return m ? parseFloat(m[1].replace(/[\s .]/g, '').replace(',', '.')) : null;
  }
  const fmt = (n) => n.toFixed(2).replace('.', ',');

  function tick() {
    if (blocked()) return disarm('Blocage / vérification anti-bot détecté(e) : arrêt.');
    if (!armed()) return;

    if (onCheckout()) {
      if (!delivery.started) { // la livraison démarre tout de suite, sans attendre le bouton Payer
        delivery.started = true;
        chooseDelivery().then((ok) => { delivery.ok = ok; delivery.done = true; note('livraison terminée', ok); tick(); });
        return;
      }
      if (!delivery.done) return;
      if (!delivery.ok) { st.armed = false; save(st); clearBtns(); return; } // on garde le message d'erreur, aucun paiement
      const pay = findPay();
      if (!pay) return setTimeout(tick, 30);
      const total = readTotal();
      note('page de paiement prête', total != null ? `${fmt(total)} €` : 'total ?');
      if (AUTO_PAY && !(MAX_TOTAL > 0 && (total == null || total > MAX_TOTAL))) {
        pay.click();
        note('Payer cliqué');
        disarm('Paiement envoyé. Validez le 3-D Secure sur votre téléphone si demandé.');
      } else {
        const why = AUTO_PAY ? ` (total ${total != null ? fmt(total) : '?'} € > plafond ${MAX_TOTAL} €)` : '';
        say(`Livraison réglée${total != null ? ` · total ${fmt(total)} €` : ''}${why}. Clique sur Payer.`);
        alertUser('Page de paiement prête : clique sur Payer');
        st.armed = false; save(st); clearBtns();
      }
      return;
    }

    if (!onItem()) return;
    if (st.phase === 'waiting' && !waitingStarted) { waitingStarted = true; waiting(); }
  }

  (async () => {
    // Chemins rapides : aucune attente réseau avant d'agir
    if (armed() && onCheckout()) { tick(); return; }
    if (armed() && st.phase === 'live' && onItem()) { liveWatch(); return; }

    await checkClock();
    if (!onItem() && !onCheckout()) say('Script actif, mais ITEM_ID absent de cette URL');
    if (onItem() && !armed()) {
      say(`Prêt.${skewTxt}`);
      addBtn(`Armer pour ${new Date(saleAt).toLocaleTimeString('fr-FR')}`, '#09b1ba', arm);
    } else {
      if (armed()) { clearBtns(); addBtn('Stop', '#c0392b', () => disarm('Arrêté manuellement.')); }
      tick();
    }
  })();
})();
