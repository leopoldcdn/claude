// Bot d'achat Vinted : prépare la page, attend l'heure H, recharge en boucle
// jusqu'à ce que le bouton "Acheter" soit actif, puis enchaîne jusqu'au paiement.
//
// Usage :
//   npm run login   -> ouvre un navigateur, tu te connectes à Vinted à la main (une seule fois)
//   npm run buy     -> lance l'attente + l'achat selon config.json
import { chromium } from 'playwright';
import fs from 'node:fs';

const PROFILE_DIR = './.profile'; // session Vinted conservée ici (ne jamais commiter)
const mode = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString(), ...a);

const BUY_BUTTON = [
  '[data-testid="item-buy-button"]',
  'button:has-text("Acheter")',
];
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
  log('Connecte-toi à Vinted dans la fenêtre (et enregistre ta carte / adresse de livraison).');
  log('Ferme la fenêtre quand c’est fait.');
  await new Promise((r) => ctx.on('close', r));
}

async function buy() {
  const cfg = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  const saleAt = new Date(cfg.saleTime).getTime();
  if (Number.isNaN(saleAt)) throw new Error('saleTime invalide (format ISO avec fuseau, ex: 2026-11-05T19:00:00+01:00)');

  const ctx = await launch();
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto(cfg.itemUrl, { waitUntil: 'domcontentloaded' });
  log('Page annonce chargée. Vente prévue à', new Date(saleAt).toISOString());

  // Attente passive jusqu'à (H - leadSeconds), en gardant la session vivante.
  const startPolling = saleAt - cfg.leadSeconds * 1000;
  while (Date.now() < startPolling - 60_000) {
    log(`Attente... T-${Math.round((saleAt - Date.now()) / 1000)}s`);
    await sleep(30_000);
  }
  while (Date.now() < startPolling) await sleep(5); // attente fine

  // Boucle de rechargement jusqu'à ce que "Acheter" soit cliquable.
  const deadline = saleAt + cfg.giveUpAfterSeconds * 1000;
  let btn = null;
  while (Date.now() < deadline) {
    btn = await firstEnabled(page, BUY_BUTTON);
    if (btn) break;
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await sleep(cfg.pollIntervalMs);
  }
  if (!btn) {
    log('Bouton "Acheter" jamais devenu actif. Abandon.');
    await page.screenshot({ path: 'failure.png' });
    return;
  }

  log('Bouton Acheter actif -> clic');
  await btn.click();

  // Page de paiement : on attend le bouton final.
  await page.waitForURL(/checkout/, { timeout: 15_000 }).catch(() => {});
  let pay = null;
  for (let i = 0; i < 100 && !pay; i++) {
    pay = await firstEnabled(page, PAY_BUTTON);
    if (!pay) await sleep(100);
  }
  if (!pay) {
    log('Bouton de paiement introuvable : termine manuellement dans la fenêtre.');
    await page.screenshot({ path: 'checkout.png' });
    await new Promise((r) => ctx.on('close', r));
    return;
  }

  if (cfg.autoPay) {
    log('autoPay=true -> paiement');
    await pay.click();
  } else {
    log('Page de paiement prête. Clique toi-même sur "Payer" (autoPay=false).');
  }
  await sleep(2000);
  await page.screenshot({ path: 'result.png' });
  log('Terminé. Ferme la fenêtre une fois la commande vérifiée.');
  await new Promise((r) => ctx.on('close', r));
}

if (mode === 'login') await login();
else if (mode === 'buy') await buy();
else console.log('Usage: node bot.mjs <login|buy>');
