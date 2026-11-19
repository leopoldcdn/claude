/* Banc d'essai de l'algorithme d'itinéraire d'Escapade.
 *
 *   node web/tools/bench/bench.mjs [--quick] [--save nom]
 *
 * - ≈ 170 destinations (2 par pays, les plus connues) × plusieurs scénarios, plus des itinéraires de référence ;
 * - chaque itinéraire est contrôlé par des RÈGLES qui ne doivent jamais être enfreintes ;
 * - une NOTE DE QUALITÉ (0-100) résume l'intérêt des étapes, le temps de transport, les envies, la variété ;
 * - rapport en clair + fichier docs/bench/<nom>.json pour comparer deux versions.
 * Sans réseau : les temps de trajet sont estimés (comme quand les services en ligne ne répondent pas).
 */
import fs from 'node:fs';
import { WEB, ctx, haversine, norm, kindOf } from './context.mjs';

const { initItinerary, planTrip } = await import(WEB + 'itinerary.js');
const { initTransit } = await import(WEB + 'transit.js');
const { loadLand, landId } = await import(WEB + 'land.js');
initItinerary(ctx); initTransit(ctx);
await loadLand(ctx.getBuffer);

const args = process.argv.slice(2);
const QUICK = args.includes('--quick');
const SAVE = args.includes('--save') ? args[args.indexOf('--save') + 1] : null;
const DEST = JSON.parse(fs.readFileSync(new URL('./destinations.json', import.meta.url)));
const REF = JSON.parse(fs.readFileSync(new URL('./references.json', import.meta.url)));
const ADMIN = /^(kabupaten|kecamatan|kelurahan|regency|district|municipality|municipio|distrito|provincia|province|prefecture|county|gmina|raion|oblast|amphoe|tambon|barangay)\b/i;
const PARIS = { name: 'Paris', lat: 48.8566, lon: 2.3522, cc: 'FR' };

const SCEN = [
  { id: '7j', o: { days: 7 } },
  { id: '14j-aller', o: { days: 14, shape: 'oneway' } },
  { id: '4j-calme', o: { days: 4, pace: 'calme' } },
  { id: '10j-nature', o: { days: 10, likes: ['nature', 'montagne'] } },
  { id: '7j-plage', o: { days: 7, likes: ['plage'] } },
  { id: '7j-culture-train', o: { days: 7, likes: ['culture', 'histoire'], mode: 'transit' } },
  { id: '21j-intense', o: { days: 21, pace: 'intense' } },
];
const scen = QUICK ? SCEN.slice(0, 2) : SCEN;
const ONLYREF = args.includes('--ref');

function check(t, input) {
  const v = [], st = t.stops;
  const nights = st.reduce((a, s) => a + s.nights, 0);
  if (nights !== Math.max(1, input.days - 1)) v.push(`nuits ${nights} ≠ ${input.days - 1}`);
  const names = st.map(s => norm(s.name));
  if (new Set(names).size !== names.length) v.push('étape en double');
  for (const s of st) {
    if (ADMIN.test(s.name)) v.push(`nom administratif : ${s.name}`);
    if (s.p && t.cc && s.p[3] !== t.cc) v.push(`étape à l'étranger : ${s.name} (${s.p[3]})`);
  }
  const seq = input.shape !== 'oneway' && st.length > 1 ? [...st, st[0]] : st;
  for (let i = 1; i < seq.length; i++) {
    const a = seq[i - 1], b = seq[i], la = landId(a.lat, a.lon), lb = landId(b.lat, b.lon);
    if (la > 0 && lb > 0 && la !== lb) v.push(`mer traversée : ${a.name} → ${b.name}`);
    const leg = t.legs[i - 1];
    if (leg && leg.h > 6.5) v.push(`trajet de ${leg.h.toFixed(1)} h : ${a.name} → ${b.name}`);
  }
  for (const d of t.days) for (const it of d.items) {
    if (it.lat != null && !/Découverte/.test(it.text)) {
      const s = st[d.stop], dd = haversine(s.lat, s.lon, it.lat, it.lon);
      if (dd > 80) v.push(`visite à ${Math.round(dd)} km : ${it.text}`);
      if (ADMIN.test(it.name || '')) v.push(`visite administrative : ${it.name}`);
    }
  }
  if (!isFinite(t.budget.tier.total) || t.budget.tier.total <= 0) v.push('budget incohérent');
  if (t.days.length !== input.days) v.push(`${t.days.length} jours au programme pour ${input.days}`);
  return v;
}
const LIKE_KINDS = { plage: ['plage', 'ile', 'baie', 'lagune', 'cap'], nature: ['parc', 'lac', 'cascade', 'gorge', 'grotte', 'desert', 'glacier'],
  montagne: ['montagne', 'volcan', 'glacier', 'station'], culture: ['musee', 'palais', 'chateau', 'monument', 'temple', 'monastere'],
  histoire: ['site antique', 'site historique', 'chateau', 'monument', 'monastere'] };
function quality(t, input) {
  const st = t.stops.filter(s => s.p);
  const fame = st.length ? st.reduce((a, s) => a + Math.min(1, Math.log1p(s.p[9]) / Math.log(150)), 0) / st.length : 0;
  const bland = st.filter(s => s.p[9] < 25 && !(s.p[10] >= 3)).length;     // peu connue et sans vrai guide de voyage
  const travelH = t.legs.reduce((a, l) => a + l.h, 0);
  const travelShare = travelH / (input.days * 10);           // part des heures éveillées passées en transport
  const visits = t.days.flatMap(d => d.items.filter(i => i.lat != null && !/Découverte/.test(i.text)));
  const free = t.days.filter(d => d.items.some(i => /Journée libre/.test(i.text))).length;
  let likeMatch = null;
  if (input.likes?.length) {
    const kinds = new Set(input.likes.flatMap(k => LIKE_KINDS[k] || []));
    const m = visits.filter(i => kinds.has((i.sub || '').split(' · ')[0])).length;
    likeMatch = visits.length ? m / visits.length : 0;
  }
  const score = 100 * (0.35 * fame + 0.2 * Math.max(0, 1 - travelShare * 4) + 0.15 * (1 - bland / Math.max(1, st.length))
    + 0.15 * Math.min(1, visits.length / Math.max(1, input.days * 1.3)) + 0.15 * (likeMatch ?? 0.6) - 0.02 * free);
  return { score: Math.round(score), fame: +fame.toFixed(2), bland, travelH: +travelH.toFixed(1), visits: visits.length, free, likeMatch: likeMatch == null ? null : +likeMatch.toFixed(2) };
}

const results = [];
const t0 = Date.now();
const runs = [];
if (!ONLYREF) for (const [name, cc, lat, lon] of DEST) for (const s of scen) runs.push({ name, cc, lat, lon, sid: s.id, o: s.o });
for (const r of REF) runs.push({ name: r.name, cc: r.cc, lat: r.lat, lon: r.lon, sid: 'ref', o: r.o, expect: r.expect });
for (const r of runs) {
  const input = { days: 7, travelers: 2, budget: 2500, month: 5, from: PARIS, fromCc: 'FR', mode: 'auto', shape: 'loop', pace: 'equilibre', likes: [], ...r.o, lat: r.lat, lon: r.lon, name: r.name, cc: r.cc };
  try {
    const t = await planTrip(input);
    const v = check(t, input), q = quality(t, input);
    let recall = null;
    if (r.expect) { const got = new Set(t.stops.map(s => norm(s.name))); recall = r.expect.filter(e => e.split('|').some(x => got.has(norm(x)))).length / r.expect.length; }
    results.push({ dest: r.name, cc: r.cc, sc: r.sid, stops: t.stops.map(s => `${s.name}(${s.nights})`).join(' › '), mode: t.mode, violations: v, ...q, recall });
  } catch (e) { results.push({ dest: r.name, cc: r.cc, sc: r.sid, error: e.message, violations: ['ERREUR ' + e.message] }); }
}
const ok = results.filter(r => !r.error);
const avg = k => +(ok.reduce((a, r) => a + (r[k] ?? 0), 0) / ok.length).toFixed(2);
const viol = results.filter(r => r.violations.length);
const byType = {};
for (const r of viol) for (const v of r.violations) { const k = v.split(/[:\d]/)[0].trim(); byType[k] = (byType[k] || 0) + 1; }
const refs = results.filter(r => r.sc === 'ref');
const lm = ok.filter(r => r.likeMatch != null);
const summary = {
  itineraires: results.length, erreurs: results.filter(r => r.error).length, avecViolation: viol.length,
  tauxSansViolation: +(100 * (1 - viol.length / results.length)).toFixed(1), violationsParType: byType,
  noteMoyenne: avg('score'), notoriete: avg('fame'), etapesBanales: avg('bland'), heuresTrajet: avg('travelH'), joursLibres: avg('free'),
  envies: lm.length ? +(lm.reduce((a, r) => a + r.likeMatch, 0) / lm.length).toFixed(2) : null,
  rappelReferences: refs.length ? +(refs.reduce((a, r) => a + (r.recall ?? 0), 0) / refs.length).toFixed(2) : null,
  duree: ((Date.now() - t0) / 1000).toFixed(0) + ' s',
};
console.log('\n=== RÉSUMÉ ===');
console.log(JSON.stringify(summary, null, 1));
console.log('\n=== RÉFÉRENCES ===');
for (const r of refs) console.log(`${(r.recall ?? 0).toFixed(2)}  ${r.dest.padEnd(14)} ${r.stops}`);
console.log('\n=== EXEMPLES DE VIOLATIONS ===');
for (const r of viol.slice(0, 25)) console.log(`• ${r.dest} [${r.sc}] ${r.violations.slice(0, 3).join(' ; ')}`);
console.log('\n=== NOTES LES PLUS BASSES ===');
for (const r of ok.slice().sort((a, b) => a.score - b.score).slice(0, 12)) console.log(`${r.score}  ${r.dest} [${r.sc}] ${r.stops}`);
if (SAVE) {
  fs.mkdirSync(WEB + '../docs/bench', { recursive: true });
  fs.writeFileSync(WEB + `../docs/bench/${SAVE}.json`, JSON.stringify({ summary, results }, null, 1));
  console.log('\nenregistré : docs/bench/' + SAVE + '.json');
}
