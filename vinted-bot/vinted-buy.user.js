// ==UserScript==
// @name         Vinted achat à l'heure H
// @namespace    local
// @version      2.1
// @match        https://www.vinted.fr/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
  'use strict';
  const T0 = Date.now();
  const log = (...a) => console.log('[Vinted bot]', `+${Date.now() - T0}ms`, ...a);
  log('script chargé');

  // ======== CONFIG ========
  const SALE_TIME     = '2026-11-04T18:00:00+01:00';
  const ITEM_ID       = '10586050613';
  const AUTO_PAY      = false;   // true = clique aussi sur "Payer"
  const RELAY_KEYWORD = '';      // '' = point relais présélectionné ; sinon ex: 'LIDL' ou 'PORTMANN'
  const INTERVAL_MS   = 2000;    // délai mini entre deux rechargements (ne pas descendre)
  const MAX_RELOADS   = 15;
  // =========================

  const KEY = 'vb_state';
  const saleAt = new Date(SALE_TIME).getTime();
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = (s) => localStorage.setItem(KEY, JSON.stringify(s));
  let st = load();
  let offset = Number(st.offset) || 0;
  const now = () => Date.now() + offset;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
  const realClick = (el) => {
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const target = document.elementFromPoint(x, y) || el;
    const base = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, button: 0, pointerId: 1, pointerType: 'mouse', isPrimary: true };
    for (const [type, buttons] of [['pointerdown', 1], ['mousedown', 1], ['pointerup', 0], ['mouseup', 0], ['click', 0]]) {
      const Ev = type.startsWith('pointer') ? PointerEvent : MouseEvent;
      target.dispatchEvent(new Ev(type, { ...base, buttons }));
    }
    log('clic envoyé sur', target.tagName, Math.round(x), Math.round(y));
  };
  const waitFor = async (fn, ms) => {
    const t = Date.now();
    while (Date.now() - t < ms) { const r = fn(); if (r) return r; await sleep(30); }
    return null;
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

  let ac;
  const beep = (f = 880, d = 0.25) => {
    try {
      ac = ac || new AudioContext();
      const o = ac.createOscillator(); o.frequency.value = f; o.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + d);
    } catch {}
  };
  const blocked = () => /session a été bloquée|activité inhabituelle/i.test(document.body?.innerText || '');

  // Bandeau d'état (monté dès que le <body> existe)
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;z-index:99999;bottom:12px;right:12px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;font:14px system-ui;max-width:280px';
  const mount = () => { if (document.body && !box.isConnected) document.body.appendChild(box); };
  document.addEventListener('DOMContentLoaded', mount);
  const say = (t) => { box.textContent = t; mount(); };
  say('Vinted bot chargé');

  async function syncClock() {
    try {
      const t0 = Date.now();
      const r = await fetch('/', { method: 'HEAD', cache: 'no-store' });
      const t1 = Date.now();
      const server = new Date(r.headers.get('date')).getTime();
      if (server) { offset = server - (t0 + t1) / 2; st.offset = offset; save(st); }
    } catch {}
  }

  const onItem = () => location.pathname.includes(ITEM_ID);
  const onCheckout = () => /checkout/.test(location.pathname);

  function disarm(msg) { st = { offset }; save(st); say(msg); beep(300, 0.6); }

  function arm() {
    st = { armed: true, phase: 'waiting', attempts: 0, offset };
    save(st); beep(); tick();
  }

  // ---------- Phase "live" : surveillance rapide du bouton Acheter ----------
  let firstClick = 0, lastClick = 0;
  const waitCheckout = () => {
    if (onCheckout()) return tick();
    const t = Date.now();
    if (t - firstClick > 8000) { if (onItem() && st.armed) location.reload(); return; }
    if (t - lastClick > 800) { // si la page n'était pas encore prête, on reclique
      const b = findBuy();
      if (b) { lastClick = t; b.click(); log('reclic Acheter'); }
    }
    setTimeout(waitCheckout, 20);
  };

  function liveWatch() {
    let done = false;
    const stop = () => { done = true; clearInterval(iv); mo.disconnect(); };
    const attempt = () => {
      if (done) return;
      const b = findBuy();
      if (!b) return;
      stop();
      say('Achat !'); beep(1000, 0.3);
      firstClick = lastClick = Date.now();
      log('clic Acheter');
      b.click();
      waitCheckout();
    };
    const iv = setInterval(attempt, 25);
    const mo = new MutationObserver(attempt);
    mo.observe(document, { childList: true, subtree: true, attributes: true });
    // Pas de bouton après INTERVAL_MS : on recharge (jamais plus vite)
    setTimeout(() => {
      if (done) return;
      stop();
      if (blocked()) return disarm('Page de blocage détectée : arrêt.');
      if (st.attempts >= MAX_RELOADS) return disarm('Bouton jamais actif : arrêt.');
      st.attempts++; save(st);
      say(`Pas encore dispo (tentative ${st.attempts}/${MAX_RELOADS})`);
      location.reload();
    }, INTERVAL_MS);
  }

  // ---------- Livraison : point relais + confirmation ----------
  const delivery = { started: false, done: false, ok: false };
  const CHOSEN_RE = /Disponible au point relais sous/i;
  const CHOOSE_RE = /(Choisir|Sélectionner|Selectionner)\s+(un\s+|le\s+)?point/i;
  const CONFIRM_RE = /^\s*Confirmer\s*$/i;
  const MODAL_RE = /^\s*Point de retrait et de dépôt\s*$/i;
  const modalOpen = () => matchAny([MODAL_RE, CONFIRM_RE]);
  const timed = (label, t0) => log(`${label} (${Date.now() - t0} ms)`);

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
      log('ERREUR', e.message);
      say('Livraison à régler à la main : ' + e.message);
      beep(300, 0.6);
      return false;
    }
  }

  function tick() {
    if (blocked()) return disarm('Page de blocage détectée : arrêt.');
    if (!st.armed) return;

    if (onCheckout()) {
      if (!delivery.started) { // la livraison démarre tout de suite, sans attendre le bouton Payer
        delivery.started = true;
        chooseDelivery().then((ok) => { delivery.ok = ok; delivery.done = true; log('livraison terminée :', ok); tick(); });
        return;
      }
      if (!delivery.done) return;
      if (!delivery.ok) { st.armed = false; save(st); return; } // on garde le message d'erreur, aucun paiement
      const pay = findPay();
      if (!pay) return setTimeout(tick, 50);
      beep(1200, 0.5);
      if (AUTO_PAY) { say('Paiement...'); pay.click(); disarm('Paiement envoyé.'); }
      else { say('Livraison réglée. Vérifie le récapitulatif puis clique sur Payer.'); st.armed = false; save(st); }
      return;
    }

    if (!onItem()) return;

    if (st.phase === 'waiting') {
      const left = (saleAt - now()) / 1000;
      if (left > 0) {
        say(`Armé. T-${Math.ceil(left)}s`);
        if (left < 10 && Math.ceil(left) <= 3) beep(660, 0.1);
        return setTimeout(tick, left > 1 ? 250 : 5);
      }
      st.phase = 'live'; st.attempts = 0; save(st);
      return location.reload();
    }
  }

  (async () => {
    // Chemins rapides : aucune attente réseau avant d'agir
    if (st.armed && onCheckout()) { tick(); return; }
    if (st.armed && st.phase === 'live' && onItem()) { liveWatch(); syncClock(); return; }

    await syncClock();
    if (!onItem() && !onCheckout()) say('Script actif, mais ITEM_ID absent de cette URL');
    if (onItem() && !st.armed) {
      const btn = document.createElement('button');
      btn.textContent = `Armer pour ${new Date(saleAt).toLocaleTimeString('fr-FR')}`;
      btn.style.cssText = 'margin-left:8px;padding:6px 10px;border:0;border-radius:6px;background:#09b1ba;color:#fff;cursor:pointer';
      btn.onclick = () => { btn.remove(); arm(); };
      say(`Prêt (écart ${Math.round(offset)} ms). `);
      box.appendChild(btn);
    } else {
      tick();
    }
  })();
})();
