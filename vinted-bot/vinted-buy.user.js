// ==UserScript==
// @name         Vinted achat à l'heure H
// @namespace    local
// @version      1.0
// @match        https://www.vinted.fr/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(() => {
  'use strict';
  // ======== CONFIG ========
  const SALE_TIME   = '2026-11-04T18:00:00+01:00';
  const ITEM_ID     = '1234567890';  // numéro dans l'URL de l'annonce: /items/1234567890-...
  const AUTO_PAY    = false;         // true = clique aussi sur "Payer"
  const INTERVAL_MS = 2000;          // délai entre deux rechargements (ne pas descendre)
  const MAX_RELOADS = 15;
  // =========================

  const KEY = 'vb_state';
  const saleAt = new Date(SALE_TIME).getTime();
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = (s) => localStorage.setItem(KEY, JSON.stringify(s));
  let st = load();
  let offset = Number(st.offset) || 0;
  const now = () => Date.now() + offset;

  const BUY = ['[data-testid="item-buy-button"]'];
  const PAY = ['[data-testid="single-checkout-order-summary-purchase-button"]'];
  const byText = (re) => [...document.querySelectorAll('button')].find((b) => re.test(b.textContent) && !b.disabled);
  const findBuy = () => BUY.map((s) => document.querySelector(s)).find((b) => b && !b.disabled) || byText(/^\s*acheter\s*$/i);
  const findPay = () => PAY.map((s) => document.querySelector(s)).find((b) => b && !b.disabled) || byText(/^\s*payer/i);

  let ac;
  const beep = (f = 880, d = 0.25) => {
    try {
      ac = ac || new AudioContext();
      const o = ac.createOscillator(); o.frequency.value = f; o.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + d);
    } catch {}
  };
  const blocked = () => /session a été bloquée|activité inhabituelle/i.test(document.body.innerText);

  // Petit bandeau d'état
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;z-index:99999;bottom:12px;right:12px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;font:14px system-ui;max-width:280px';
  document.body.appendChild(box);
  const say = (t) => (box.textContent = t);

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

  let reloadTimer;
  function tick() {
    if (blocked()) return disarm('Page de blocage détectée : arrêt.');
    if (!st.armed) return;

    if (onCheckout()) {
      const p = findPay();
      if (p) {
        beep(1200, 0.5);
        if (AUTO_PAY) { say('Paiement...'); p.click(); disarm('Paiement envoyé.'); }
        else { say('Page de paiement prête : clique sur Payer.'); st.armed = false; save(st); }
        return;
      }
      return setTimeout(tick, 100);
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
      if (Date.now() - pageStart < 1500) return setTimeout(tick, 50); // laisse la page s'afficher
      if (st.attempts >= MAX_RELOADS) return disarm('Bouton jamais actif : arrêt.');
      st.attempts++; save(st);
      say(`Pas encore dispo (tentative ${st.attempts}/${MAX_RELOADS})`);
      reloadTimer = setTimeout(() => location.reload(), INTERVAL_MS);
    }
  }

  const pageStart = Date.now();
  (async () => {
    await syncClock();
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
