import { chromium } from 'playwright';
import { exec } from 'node:child_process';
import fs from 'node:fs';

const PROFILE_DIR = './.profile';
const mode = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString(), ...a);
const beep = () => exec('afplay /System/Library/Sounds/Glass.aiff'); // macOS

const BUY_BUTTON = ['[data-testid="item-buy-button"]', 'button:has-text("Acheter")'];
const PAY_BUTTON = [
  '[data-testid="single-checkout-order-summary-purchase-button"]',
  'button:has-text("Payer")',
];

async function firstEnabled(page, selectors) {
  for (const sel of selectors) {
    const loc = page.locator(sel).first();
    if ((await loc.count()) && (await loc.isVisible()) && (await loc.isEnabled())) return loc;
  }
  return null;
}

async function isBlocked(page) {
  const txt = (await page.locator('body').innerText().catch(() => '')) || '';
  return /session a été bloquée|activité inhabituelle|automatisée/i.test(txt);
}

// Écart entre l'horloge du Mac et celle de Vinted (en ms), via l'en-tête HTTP Date.
async function clockOffset(ctx) {
  try {
    const t0 = Date.now();
    const res = await ctx.request.head('https://www.vinted.fr/');
    const t1 = Date.now();
    const server = new Date(res.headers()['date']).getTime();
    return server - (t0 + t1) / 2;
  } catch {
    return 0;
  }
}

async function launch() {
  return chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
    locale: 'fr-FR',
  });
}

async function login() {
  const ctx = await launch();
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto('https://www.vinted.fr/');
  log('Connecte-toi à Vinted (carte + adresse enregistrées), puis ferme la fenêtre.');
  await new Promise((r) => ctx.on('close', r));
}

async function buy() {
  const cfg = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  const saleAt = new Date(cfg.saleTime).getTime();
  if (Number.isNaN(saleAt)) throw new Error('saleTime invalide, ex: 2026-11-04T18:00:00+01:00');
  const interval = Math.max(2000, cfg.pollIntervalMs ?? 2000); // jamais plus rapide que 2 s
  const maxReloads = Math.min(15, cfg.maxReloads ?? 15);

  const ctx = await launch();
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto(cfg.itemUrl, { waitUntil: 'domcontentloaded' });
  if (await isBlocked(page)) {
    log('Vinted affiche la page de blocage. Arrêt : change de réseau ou réessaie plus tard.');
    beep();
    return;
  }

  const offset = await clockOffset(ctx);
  log(`Écart d'horloge Mac/Vinted : ${Math.round(offset)} ms (corrigé automatiquement)`);
  const now = () => Date.now() + offset;

  while (now() < saleAt - 10_000) {
    log(`Attente... T-${Math.round((saleAt - now()) / 1000)}s`);
    await sleep(Math.min(30_000, saleAt - now() - 10_000));
  }
  beep();
  log('T-10s : prépare-toi.');
  while (now() < saleAt) await sleep(5);

  let btn = null;
  for (let i = 0; i <= maxReloads && !btn; i++) {
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    if (await isBlocked(page)) {
      log('Page de blocage détectée : arrêt immédiat pour ne pas aggraver.');
      beep();
      return;
    }
    btn = await firstEnabled(page, BUY_BUTTON);
    if (!btn) await sleep(interval);
  }
  if (!btn) {
    log('Bouton "Acheter" non actif après toutes les tentatives.');
    await page.screenshot({ path: 'failure.png' });
    beep();
    await new Promise((r) => ctx.on('close', r));
    return;
  }

  log('Bouton Acheter actif -> clic');
  await btn.click();
  await page.waitForURL(/checkout/, { timeout: 15_000 }).catch(() => {});

  let pay = null;
  for (let i = 0; i < 100 && !pay; i++) {
    pay = await firstEnabled(page, PAY_BUTTON);
    if (!pay) await sleep(100);
  }
  beep();
  if (!pay) {
    log('Bouton de paiement introuvable : termine à la main dans la fenêtre.');
    await page.screenshot({ path: 'checkout.png' });
  } else if (cfg.autoPay) {
    log('autoPay=true -> paiement');
    await pay.click();
  } else {
    log('Page de paiement prête : clique sur "Payer".');
  }
  await sleep(2000);
  await page.screenshot({ path: 'result.png' });
  await new Promise((r) => ctx.on('close', r));
}

if (mode === 'login') await login();
else if (mode === 'buy') await buy();
else console.log('Usage: node bot.mjs <login|buy>');
