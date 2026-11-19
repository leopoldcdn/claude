/* Banc d'essai : la liste de « Où partir ? » et l'itinéraire détaillé annoncent-ils le même prix et le même trajet ?
 * Usage : node web/tools/bench/coherence.mjs   (hors ligne, données du disque) */
import fs from 'node:fs';
import { WEB, ctx } from './context.mjs';
const { initItinerary, planTrip } = await import(WEB + 'itinerary.js');
const disc = await import(WEB + 'discover.js');
const { estimateTrip } = await import(WEB + 'cost.js');
const { loadLand } = await import(WEB + 'land.js');
initItinerary(ctx);
await loadLand(ctx.getBuffer);
const prices = JSON.parse(fs.readFileSync(WEB + 'data/prices.json'));
const dest = JSON.parse(fs.readFileSync(WEB + 'data/destinations.json'));
const CASES = [
  { from: { name: 'Marseille', lat: 43.2965, lon: 5.3698, cc: 'FR' }, to: 'Palma', month: 5, days: 4, travelers: 2, budget: 850 },
  { from: { name: 'Bordeaux', lat: 44.8378, lon: -0.5792, cc: 'FR' }, to: 'Barcelone', month: 5, days: 4, travelers: 2, budget: 800 },
  { from: { name: 'Bordeaux', lat: 44.8378, lon: -0.5792, cc: 'FR' }, to: 'Tarragone', month: 5, days: 4, travelers: 2, budget: 800 },
  { from: { name: 'Paris', lat: 48.853, lon: 2.349, cc: 'FR' }, to: 'Ajaccio', month: 6, days: 7, travelers: 2, budget: 2000 },
  { from: { name: 'Paris', lat: 48.853, lon: 2.349, cc: 'FR' }, to: 'Lisbonne', month: 4, days: 5, travelers: 2, budget: 1500 },
  { from: { name: 'Lyon', lat: 45.764, lon: 4.8357, cc: 'FR' }, to: 'Bangkok', month: 1, days: 12, travelers: 2, budget: 4000 },
];
for (const c of CASES) {
  const d = dest.find(x => x[0] === c.to); if (!d) { console.log(c.to, 'absent'); continue; }
  const e = estimateTrip({ from: c.from, to: { lat: d[2], lon: d[3], cc: d[1] }, pl: prices[d[1]] ?? 0.6, travelers: c.travelers, days: c.days, month: c.month, haversine: ctx.haversine });
  const t = await planTrip({ name: d[0], lat: d[2], lon: d[3], cc: d[1], days: c.days, budget: c.budget, travelers: c.travelers, month: c.month, from: c.from, fromCc: c.from.cc, mode: 'auto', shape: 'loop', pace: 'equilibre', likes: [] });
  const eco = t.budget.tiers.find(x => x.id === 'eco').total, conf = t.budget.tiers.find(x => x.id === 'confort').total;
  console.log(`${c.from.name} → ${d[0]} : liste ${e.access.kind} ${Math.round(e.low)}–${Math.round(e.high)} € | itinéraire ${t.flight.kind} éco ${Math.round(eco)} confort ${Math.round(conf)} € | écart éco ${Math.round(eco - e.low)} € | budget ${c.budget} : liste ${e.low <= c.budget ? 'OK' : 'trop cher'}, itinéraire ${t.budget.ok ? 'OK' : 'trop cher'}`);
}
