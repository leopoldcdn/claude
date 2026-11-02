// ==UserScript==
// @name         Vinted achat à l'heure H
// @namespace    local
// @version      1.8
// @match        https://www.vinted.fr/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(() => {
  'use strict';
  console.log('[Vinted bot] script chargé');

  // ======== CONFIG ========
  const SALE_TIME    = '2026-11-04T18:00:00+01:00';
  const ITEM_ID      = '10586050613';
  const AUTO_PAY     = false;   // true = clique aussi sur "Payer"
  const RELAY_KEYWORD = '';     // '' = garde le point relais présélectionné ; sinon ex: 'LIDL' ou 'PORTMANN'
  const INTERVAL_MS  = 2000;
  const MAX_RELOADS  = 15;
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

  // Recherche d'un élément visible par son texte (le plus court = le plus précis)
  const visible = (e) => {
    const r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(e);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
  };
  const findByText = (re, sel = 'button,[role="button"],[role="radio"],label,li,div,span,p,a') =>
    [...document.querySelectorAll(sel)]
      .filter((e) => visible(e) && re.test(e.textContent || ''))
      .sort((a, b) => a.textContent.length - b.textContent.length)[0];
  const log = (...a) => console.log('[Vinted bot]', ...a);
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
    while (Date.now() - t < ms) { const r = fn(); if (r) return r; await sleep(100); }
    return null;
  };
  // Clique sur un élément jusqu'à ce que `done()` soit vrai ; remonte aux parents si besoin
  async function clickUntil(getEl, done, ms = 1500, maxUp = 0) {
    let el = getEl();
    for (let i = 0; i <= maxUp && el; i++) {
      log('clic niveau', i, el.tagName);
      el.click();
      if (await waitFor(done, ms)) return true;
      realClick(el);
      if (await waitFor(done, ms)) return true;
      el = el.parentElement;
      if (el && (el.textContent || '').length > 150) break;
    }
    return false;
  }
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let ac;
  const beep = (f = 880, d = 0.25) => {
    try {
      ac = ac || new AudioContext();
      const o = ac.createOscillator(); o.frequency.value = f; o.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + d);
    } catch {}
  };
  const blocked = () => /session a été bloquée|activité inhabituelle/i.test(document.body.innerText);

  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;z-index:99999;bottom:12px;right:12px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;font:14px system-ui;max-width:280px';
  document.body.appendChild(box);
  const say = (t) => (box.textContent = t);
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

  // Livraison : point relais + confirmation
  const delivery = { started: false, done: false, ok: false };
  const CHOSEN_RE = /Disponible au point relais sous/i;
  const CHOOSE_RE = /(Choisir|Sélectionner|Selectionner)\s+(un\s+|le\s+)?point/i;
  const CONFIRM_RE = /^\s*Confirmer\s*$/i;
  const MODAL_RE = /^\s*Point de retrait et de dépôt\s*$/i;
  const modalOpen = () => findByText(MODAL_RE) || findByText(CONFIRM_RE);
  // "choose" prioritaire : tant que la ligne "Choisir un point relais" est visible, aucun point n'est choisi
  const deliveryState = () => (findByText(CHOOSE_RE) ? 'choose' : findByText(CHOSEN_RE) ? 'chosen' : null);

  async function pickInModal() {
    // le bouton Confirmer n'apparaît qu'une fois la carte et la liste chargées
    const confirm = await waitFor(() => findByText(CONFIRM_RE), 12000);
    if (!confirm) throw new Error('bouton Confirmer introuvable (fenêtre ouverte)');
    log('Confirmer visible');
    await sleep(800);
    if (RELAY_KEYWORD) {
      const item = findByText(new RegExp(escapeRe(RELAY_KEYWORD), 'i'), 'div,li,button,span,p');
      if (!item) throw new Error(`point relais "${RELAY_KEYWORD}" introuvable`);
      realClick(item);
      await sleep(500);
    }
    const closed = await clickUntil(() => findByText(CONFIRM_RE), () => !modalOpen(), 4000, 0);
    log('Confirmer cliqué, fenêtre fermée :', closed);
  }

  async function chooseDelivery() {
    try {
      say('Réglage de la livraison...');
      await waitFor(() => findByText(/Détails de la livraison/i), 5000);
      await sleep(500);
      let state = await waitFor(deliveryState, 3000);
      log('état livraison :', state);
      if (!state) {
        const opt = findByText(/Envoi au point relais/i);
        if (opt) realClick(opt);
        state = await waitFor(deliveryState, 4000);
        log('état après clic option :', state);
      }
      if (state === 'choose') {
        const opened = modalOpen() || await clickUntil(() => findByText(CHOOSE_RE), modalOpen, 6000, 1);
        if (!opened) throw new Error('fenêtre point relais introuvable');
        log('fenêtre ouverte');
        await pickInModal();
        const gone = await waitFor(() => !findByText(CHOOSE_RE), 4000);
        if (!gone) throw new Error('le point relais n\'a pas été enregistré');
        return true;
      }
      if (state === 'chosen') return true;
      throw new Error('option point relais introuvable');
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
      const p = findPay();
      if (!p) return setTimeout(tick, 100);
      if (!delivery.started) {
        delivery.started = true;
        chooseDelivery().then((ok) => { delivery.ok = ok; delivery.done = true; tick(); });
        return;
      }
      if (!delivery.done) return;
      if (!delivery.ok) { st.armed = false; save(st); return; } // on garde le message d'erreur, aucun paiement
      const pay = findPay() || p;
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

    if (st.phase === 'live') {
      const b = findBuy();
      if (b) { say('Achat !'); beep(1000, 0.3); b.click(); return setTimeout(tick, 100); }
      if (Date.now() - pageStart < 1500) return setTimeout(tick, 50);
      if (st.attempts >= MAX_RELOADS) return disarm('Bouton jamais actif : arrêt.');
      st.attempts++; save(st);
      say(`Pas encore dispo (tentative ${st.attempts}/${MAX_RELOADS})`);
      setTimeout(() => location.reload(), INTERVAL_MS);
    }
  }

  const pageStart = Date.now();
  (async () => {
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
