/* Escapade — générateur d'itinéraire.
 *
 * Entrées : destination, durée, budget (vol compris), voyageurs, mois, ville de départ,
 *           transport (proposition / voiture / transports en commun), parcours (boucle / aller simple),
 *           rythme et envies.
 * Étapes  : 1. candidats autour de la destination : même pays, même terre (pas de mer en voiture), pas de noms administratifs
 *           2. intérêt de chaque ville étape : notoriété (Wikidata), guide de voyage (Wikivoyage), sites qui lui « appartiennent »
 *              dans un rayon de 25 km, envies, même région, saison du mois (pluie, froid), variante choisie
 *           3. recherche en faisceau sur des parcours complets : intérêt des étapes × nuits (rendement décroissant)
 *              moins le temps de trajet ; jamais plus de 5 h de trajet par jour ; étapes verrouillées ou écartées
 *           4. ordre le plus court parmi les étapes retenues (boucle ou aller simple)
 *           5. nuits selon l'intérêt et le contenu de chaque étape, journées allégées après un long trajet
 * Qualité  : mesurée par le banc d'essai tools/bench/bench.mjs (règles invariantes, note, itinéraires de référence).
 *           6. trajets réels en voiture (OSRM) ou estimés en transports en commun
 *           7. budget estimé (niveau des prix du pays) et choix du niveau de confort qui rentre dans le budget
 */

import { I } from './icons.js';
import { startTour, stopTour } from './tour.js';
import { loadLand, sameLand, landReady } from './land.js';
import { TIERS, accessCost, stayCost, localTransitCost } from './cost.js';
import { ADVISED_AGAINST } from './discover.js';
import { transitPlan, flightPlan, describe, describeFlight, fmtDur, MODE_INFO } from './transit.js';

let C = null;          // contexte fourni par app.js
export function initItinerary(ctx) { C = ctx; }

const DEG = Math.PI / 180;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const MOIS_L = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/* ------------------------------------------------------------------ données */
const LIKES = {
  plage: { label: '🏖 Plage', kinds: ['plage', 'ile', 'baie', 'lagune', 'cap'] },
  nature: { label: '🌳 Nature', kinds: ['parc', 'lac', 'cascade', 'gorge', 'grotte', 'desert', 'glacier'] },
  montagne: { label: '⛰ Montagne', kinds: ['montagne', 'volcan', 'glacier', 'station'] },
  culture: { label: '🏛 Culture', kinds: ['musee', 'palais', 'chateau', 'monument', 'temple', 'monastere'] },
  histoire: { label: '🏺 Histoire', kinds: ['site antique', 'site historique', 'chateau', 'monument', 'monastere'] },
  villes: { label: '🏙 Villes', kinds: [] },
};
const SITE_KINDS = new Set(Object.values(LIKES).flatMap(l => l.kinds).concat(['point de vue', 'phare', 'parc attractions', 'zoo']));
const BASE_KINDS = new Set(['ville', 'village', 'capitale']);
// pays aux trains rapides : le train reste pertinent même pour de longs trajets
const HSR = new Set(['FR', 'DE', 'IT', 'ES', 'JP', 'CN', 'KR', 'TW', 'AT', 'CH', 'NL', 'BE']);
// noms de circonscriptions administratives : jamais une étape ni une visite
const ADMIN_NAME = /^(kabupaten|kecamatan|kelurahan|kota administrasi|regency|district|municipality|municipalit[yé]|municipio|distrito|provincia|province|prefecture|préfecture|county|comté|gmina|raion|rayon|oblast|okrug|amphoe|tambon|barangay)\b|\b(kabupaten|regency|district|municipality|province|county)$/i;
const RAIL = new Set(['FR', 'DE', 'IT', 'ES', 'CH', 'AT', 'NL', 'BE', 'LU', 'GB', 'JP', 'KR', 'CN', 'TW', 'CZ', 'DK', 'SE', 'PT', 'PL', 'SK', 'HU', 'SI']);
const PACE = {
  calme: { label: 'Tranquille', nightsPerStop: 3.5, perDay: 1 },
  equilibre: { label: 'Équilibré', nightsPerStop: 2.5, perDay: 2 },
  intense: { label: 'Intense', nightsPerStop: 1.6, perDay: 3 },
};
let prices = null;
async function priceLevel(cc) {
  if (!prices) prices = await C.getJSON('data/prices.json').catch(() => ({}));
  return prices[cc] ?? 0.6;
}

/* ------------------------------------------------------------------ algorithme */
function likeBonus(kind, likes) {
  let b = 0;
  for (const l of likes) if (LIKES[l]?.kinds.includes(kind)) b += 1;
  return b;
}
function permutations(arr) {
  if (arr.length <= 1) return [arr.slice()];
  const out = [];
  arr.forEach((x, i) => { for (const p of permutations(arr.slice(0, i).concat(arr.slice(i + 1)))) out.push([x, ...p]); });
  return out;
}
const dist = (a, b) => C.haversine(a.lat, a.lon, b.lat, b.lon);

async function osrm(points, signal) {
  // serveur de démonstration OSRM : on met les trajets en cache pour le solliciter le moins possible
  const coords = points.map(p => `${p.lon.toFixed(4)},${p.lat.toFixed(4)}`).join(';');
  const cache = C.LS.get('esc.web.routes', {});
  if (cache[coords]) return cache[coords];
  const r = await C.getJSON(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=simplified&geometries=geojson`, { signal, timeout: 20000 });
  if (r.code !== 'Ok') throw new Error(r.code);
  const res = { legs: r.routes[0].legs.map(l => ({ km: l.distance / 1000, h: l.duration / 3600 })), geometry: r.routes[0].geometry };
  const keys = Object.keys(cache); if (keys.length > 40) delete cache[keys[0]];
  cache[coords] = res; C.LS.set('esc.web.routes', cache);
  return res;
}
export async function geocodeCity(q, signal) {
  const cache = C.LS.get('esc.web.geocache', {});
  if (cache[q]) return cache[q];
  const local = await C.localCity?.(q).catch(() => null);
  if (local) return local;
  const r = await C.getJSON(`https://photon.komoot.io/api?q=${encodeURIComponent(q)}&lang=fr&limit=1`, { signal });
  const f = r.features?.[0];
  if (!f) return null;
  const res = { name: f.properties.name, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], cc: (f.properties.countrycode || '').toUpperCase() };
  cache[q] = res; C.LS.set('esc.web.geocache', cache);
  return res;
}

export const VARIANTS = { classique: 'Classique', nature: 'Nature', insolite: 'Hors des sentiers battus' };
export async function planTrip(o, signal) {
  const pace = PACE[o.pace] || PACE.equilibre;
  const variant = o.variant || 'classique';
  // variante « nature » : grands espaces et montagne, peu de grandes villes ; « insolite » : moins de lieux très connus
  const likes = variant === 'nature' && !(o.likes || []).length ? ['nature', 'montagne'] : (o.likes || []);
  const exclude = new Set((o.exclude || []).map(x => C.norm(x))), lock = new Set((o.lock || []).map(x => C.norm(x)));
  const nights = Math.max(1, o.days - 1);
  // rayon de recherche : selon la durée et le rythme, plus large là où les trains rapides raccourcissent les distances
  const fast = HSR.has(o.cc || '') && o.mode !== 'car' && o.mode !== 'bus';
  const R = clamp((35 + o.days * 28) * (o.pace === 'intense' ? 1.15 : o.pace === 'calme' ? 0.85 : 1) * (fast ? 1.35 : 1), 60, fast ? 520 : 420);
  const warnings = [];

  // 1. candidats : même pays que la destination, pas de circonscriptions administratives
  const [around] = await Promise.all([C.placesAround(o.lat, o.lon, R), loadLand(C.getBuffer).catch(() => false)]);
  const near0 = around.find(x => BASE_KINDS.has(C.kindOf(x.p)) && x.d < 40);
  const cc = o.cc || near0?.p[3] || '';
  const okPlace = x => (!cc || x.p[3] === cc) && !ADMIN_NAME.test(x.p[0]) && !ADMIN_NAME.test(x.p[1] || '');
  const here = { lat: o.lat, lon: o.lon };
  let otherShore = 0;                       // destinations écartées car de l'autre côté de la mer
  const sites = around.filter(x => SITE_KINDS.has(C.kindOf(x.p)) && x.p[9] >= 4 && okPlace(x)).map(x => x.p);
  const basesAll = around.filter(x => BASE_KINDS.has(C.kindOf(x.p)) && okPlace(x) && (x.p[9] >= 10 || x.p[7] >= 20000));
  const bases = basesAll.filter(x => {
    const ok = sameLand(here, { lat: x.p[5], lon: x.p[6] });
    if (!ok && x.p[9] >= 15) otherShore++;
    return ok;
  }).map(x => x.p);

  // 2. notes — intérêt d'une ville étape : notoriété, guide de voyage (Wikivoyage), sites autour, envies, saison
  // grille spatiale des sites (cases de 0,25°) : le calcul reste rapide même avec des milliers de sites
  const grid = new Map();
  for (const sp of sites) { const k = `${Math.floor(sp[5] * 4)},${Math.floor(sp[6] * 4)}`; if (!grid.has(k)) grid.set(k, []); grid.get(k).push(sp); }
  const sitesNear = (lat, lon, km) => {
    const out = [], dl = Math.ceil(km / 27.7), y0 = Math.floor(lat * 4), x0 = Math.floor(lon * 4);
    const dx = Math.ceil(dl / Math.max(0.2, Math.cos(lat * DEG)));
    for (let y = y0 - dl; y <= y0 + dl; y++) for (let x = x0 - dx; x <= x0 + dx; x++) for (const sp of grid.get(`${y},${x}`) || []) {
      const d = C.haversine(lat, lon, sp[5], sp[6]); if (d < km) out.push([sp, d]);
    }
    return out;
  };
  const fameOf = p => Math.log1p(p[9]) + 1.8 * Math.log1p(p[10] || 0);          // notoriété + guide de voyage
  const toObj = p => ({ p, name: C.pname(p), lat: p[5], lon: p[6] });
  const clim = await stopClimate();
  // chaque site « appartient » à la ville étape la plus pertinente autour de lui (la plus connue, à distance égale) :
  // les banlieues ne profitent plus des monuments de la grande ville voisine
  const owner = new Map();
  const claim = (p) => { for (const [sp, d] of sitesNear(p[5], p[6], 25)) { const v = fameOf(p) - d / 6, cur = owner.get(sp); if (!cur || v > cur.v) owner.set(sp, { p, v }); } };
  const scoreBase = b => {
    let siteScore = 0, likeScore = 0, content = 0;
    const top = [];
    for (const [sp, d] of sitesNear(b.lat, b.lon, 30)) {
      const ow = owner.get(sp); if (ow && ow.p !== b.p) continue;
      const w = fameOf(sp) * (1 - d / 40), bonus = likeBonus(C.kindOf(sp), likes);
      if (d < 25) { siteScore += w * (1 + 1.3 * bonus); content++; top.push([w * (1 + bonus), C.pname(sp), !!bonus]); }
      if (bonus) likeScore += w * bonus;
    }
    const isCity = ['ville', 'capitale'].includes(C.kindOf(b.p));
    const fameW = variant === 'insolite' ? 0.7 : 1.5;
    let sc = fameOf(b.p) * fameW + 0.25 * Math.min(siteScore, 40) + (likes.length ? 0.7 * Math.min(likeScore, 30) : 0)
      + (likes.includes('villes') && isCity ? 3 : 0) + (likes.length && !likes.includes('villes') && b.p[7] > 1e6 ? -2 : 0);
    if (variant === 'insolite' && (b.p[9] > 120 || b.p[7] > 500000)) sc -= 5;                 // on évite les incontournables
    if (variant === 'nature' && b.p[7] > 300000) sc -= 4;
    // pourquoi cette étape : de quoi l'expliquer à l'utilisateur
    top.sort((a, c) => c[0] - a[0]);
    const why = [];
    if ((b.p[10] || 0) >= 3) why.push(`guide de voyage dans ${b.p[10]} langues`);
    if (top.length) why.push(`${top.length} lieu${top.length > 1 ? 'x' : ''} à voir autour, dont ${top.slice(0, 2).map(x => x[1]).join(' et ')}`);
    const liked = top.filter(x => x[2]).length;
    if (likes.length && liked) why.push(`${liked} correspond${liked > 1 ? 'ent' : ''} à tes envies`);
    // saison de l'étape : forte pluie ou froid extrême ce mois-là (normales WorldClim des destinations voisines)
    const c = clim(b.lat, b.lon);
    if (c) { if (c.mm > 300) sc -= 4; else if (c.mm > 200) sc -= 2; if (c.tx < 0 && !(+c.prof[2] >= 6)) sc -= 3; }
    return { score: sc, content, why };
  };
  async function stopClimate() {
    let D = null;
    try { D = await C.getJSON('data/destinations.json'); } catch { return () => null; }
    const near = D.filter(d => C.haversine(o.lat, o.lon, d[2], d[3]) < R + 80);
    return (lat, lon) => {
      let best = null, bd = 60;
      for (const d of near) { const x = C.haversine(lat, lon, d[2], d[3]); if (x < bd) { bd = x; best = d; } }
      return best ? { tx: best[7][o.month], mm: best[8][o.month], prof: best[6] } : null;
    };
  }
  // une banlieue ou un village collé à une ville plus connue n'est pas une étape : on garde la ville
  const all = bases.map(toObj);
  const reach = x => 14 + (x.p[7] > 1e5 ? 16 * Math.log10(x.p[7] / 1e5) : 0);   // une mégapole « absorbe » ses quartiers
  const dominated = b => all.some(x => x !== b && fameOf(x.p) > fameOf(b.p) + 1 && dist(x, b) < reach(x));
  const free = all.filter(b => !dominated(b));
  for (const b of free) claim(b.p);
  let nStops = clamp(Math.round(nights / pace.nightsPerStop + 0.25) + (o.stopDelta || 0), 1, 8);
  // candidats : les plus intéressants (un vrai guide de voyage compte beaucoup), au plus 45
  const scored = free.map(b => ({ ...b, ...scoreBase(b) }));
  // même région que la destination : un voyage cohérent (Toscane, Andalousie, Provence…) plutôt qu'un saut de région en région
  const nameN0 = C.norm(o.name || '');
  const region = (all.find(b => dist(b, o) < 30 && C.norm(b.name) === nameN0) || free.filter(b => dist(b, o) < 30).sort((a, b) => dist(a, o) - dist(b, o))[0])?.p[4] || near0?.p[4] || '';
  for (const b of scored) if (region && b.p[4] === region) { b.score += 2.5; b.why.push('même région'); }
  for (const b of scored) if (lock.has(C.norm(b.name))) b.score += 100;          // étape verrouillée par l'utilisateur
  const ranked = scored.filter(b => b.p[9] >= 8 || (b.p[10] || 0) >= 2).sort((a, b) => b.score - a.score);
  // seuil d'intérêt : pas d'étape « de passage » sans intérêt (moins de 45 % de la note des meilleures)
  const unlocked = ranked.filter(b => !lock.has(C.norm(b.name)));
  const ref = unlocked[Math.min(3, unlocked.length - 1)]?.score || 0;
  const cands = ranked.filter(b => !exclude.has(C.norm(b.name)) && (b.score >= ref * 0.45 || lock.has(C.norm(b.name)))).slice(0, 45);

  // départ : le lieu qui porte le nom choisi (même s'il est proche d'une ville plus grande), sinon une ville à moins
  // de 8 km, sinon le point choisi lui-même
  const nameN = C.norm(o.name || '');
  const named = all.filter(b => dist(b, o) < 30 && (C.norm(b.name) === nameN || C.norm(b.p[0]) === nameN)).sort((a, b) => dist(a, o) - dist(b, o))[0];
  const close = free.filter(b => dist(b, o) < 8).sort((a, b) => dist(a, o) - dist(b, o))[0];
  let start = named || close;
  start = start ? { ...start, ...scoreBase(start) } : { p: null, name: o.name || 'Destination', lat: o.lat, lon: o.lon, score: 5, content: 3, why: [] };
  start.why = ['ta destination', ...(start.why || [])];
  start = { ...start, score: start.score + 4 };     // la destination choisie reste le cœur du voyage

  // 3. parcours : on compare de nombreux parcours complets (recherche en faisceau) et on garde le meilleur compromis
  //    entre l'intérêt des étapes, les nuits qu'elles méritent et le temps passé en transport.
  const prelimMode = o.mode !== 'auto' ? o.mode : RAIL.has(cc) ? 'transit' : 'car';
  const hoursFor = km => prelimMode === 'car' ? km * 1.3 / 70 + 0.3 : prelimMode === 'bus' ? km * 1.3 / 55 + 0.6
    : HSR.has(cc) ? km * 1.25 / 120 + 0.6 : RAIL.has(cc) ? km * 1.3 / 75 + 0.6 : km * 1.3 / 50 + 0.8;
  const MAX_H = o.pace === 'intense' ? 5.5 : 5;                 // jamais plus de 5 h de trajet dans une journée
  const minSep = clamp(R / 8, 20, 45);
  const legH = (a, b) => hoursFor(dist(a, b));
  const gain = n => 1 - Math.pow(0.55, n);                      // une nuit de plus rapporte de moins en moins
  const allocate = seq => {
    const nn = seq.map(() => 1); let rest = nights - seq.length;
    if (rest < 0) return null;
    while (rest-- > 0) {
      let bi = 0, bv = -1;
      seq.forEach((x, k) => { const w = (Math.max(1, x.score) + x.content * 0.3) * (gain(nn[k] + 1) - gain(nn[k])); if (w > bv) { bv = w; bi = k; } });
      nn[bi]++;
    }
    return nn;
  };
  const evaluate = seq => {
    const nn = allocate(seq); if (!nn) return null;
    let travel = 0;
    const full = o.shape !== 'oneway' && seq.length > 1 ? [...seq, seq[0]] : seq;
    for (let k = 1; k < full.length; k++) { const h = legH(full[k - 1], full[k]); if (h > MAX_H) return null; travel += h; }
    const interest = seq.reduce((a, x, k) => a + Math.max(0.5, Math.min(x.score, 60)) * gain(nn[k]) + (lock.has(C.norm(x.name)) ? 50 : 0), 0);
    // le nombre d'étapes visé par le rythme est un repère : s'en écarter coûte un peu
    const pacePen = Math.abs(seq.length - nStops) * 1.2;
    // le trajet coûte, d'autant plus que le séjour est court ; au-delà de 3 h par jour en moyenne, il coûte double
    const w = (o.pace === 'calme' ? 2.2 : o.pace === 'intense' ? 1.3 : 1.7) * Math.sqrt(7 / Math.max(3, o.days));
    const excess = Math.max(0, travel - 3 * o.days);
    return { seq, nn, value: interest - travel * w - excess * w - pacePen, travel };
  };
  let beam = [[start]], best = evaluate([start]);
  for (let depth = 2; depth <= Math.min(8, nStops + 1, nights); depth++) {
    const next = [];
    for (const seq of beam) {
      const last = seq[seq.length - 1];
      for (const c of cands) {
        if (seq.includes(c) || C.norm(c.name) === C.norm(start.name)) continue;
        if (seq.some(x => dist(x, c) < minSep)) continue;
        if (legH(last, c) > MAX_H) continue;
        const ev = evaluate([...seq, c]);
        if (ev) next.push(ev);
      }
    }
    if (!next.length) break;
    next.sort((a, b) => b.value - a.value);
    // faisceau : les 40 meilleurs parcours partiels, sans doublons d'ensemble d'étapes
    const seen = new Set(); beam = [];
    for (const ev of next) { const k = ev.seq.map(x => x.name).slice(1).sort().join('|'); if (seen.has(k)) continue; seen.add(k); beam.push(ev.seq); if (beam.length >= 40) break; }
    if (next[0].value > best.value) best = next[0];
  }
  // ordre final le plus court parmi les étapes retenues
  const bestOrder = list => {
    if (list.length <= 2) return list;
    let b = null, bd = 1e12;
    for (const perm of permutations(list.slice(1))) {
      const seq = [list[0], ...perm]; const ev = evaluate(seq); if (!ev) continue;
      if (ev.travel < bd) { bd = ev.travel; b = seq; }
    }
    return b || list;
  };
  const order = bestOrder(best.seq);
  if (order.length < nStops && nStops > 1) {
    warnings.push(otherShore >= 2 && cands.length < nStops + 3
      ? `Les autres destinations proches sont de l’autre côté de la mer : séjour en étoile depuis ${start.name}, avec des excursions en bateau.`
      : `${order.length} étape${order.length > 1 ? 's' : ''} au lieu de ${nStops} : les autres destinations intéressantes demandent trop de trajet (plus de ${MAX_H} h par jour) ; plus d’excursions à la place.`);
  }
  nStops = order.length;
  const ev = evaluate(order) || best;

  // 5. nuits : selon l'intérêt et le contenu de chaque étape
  const stops = order.map((s, k) => ({ ...s, nights: ev.nn[k] ?? 1 }));

  // 6. trajets
  const pts = stops.map(s => ({ lat: s.lat, lon: s.lon }));
  if (o.shape !== 'oneway' && stops.length > 1) pts.push({ lat: start.lat, lon: start.lon });
  const straight = [];
  for (let i = 1; i < pts.length; i++) straight.push({ km: dist(pts[i - 1], pts[i]) * 1.3, h: dist(pts[i - 1], pts[i]) * 1.3 / 70 });
  let carLegs = straight, geometry = { type: 'LineString', coordinates: pts.map(p => [p.lon, p.lat]) }, routed = false;
  if (pts.length > 1) {
    try { const r = await osrm(pts, signal); carLegs = r.legs; geometry = r.geometry; routed = true; }
    catch { if (o.mode === 'car') warnings.push('Temps de trajet estimés : le service de calcul d’itinéraire routier n’a pas répondu.'); }
  }
  const fastRail = RAIL.has(cc);
  const transitLegs = carLegs.map(l => ({ km: l.km, h: fastRail ? l.km / 115 + 0.5 : l.km / 55 + 0.75 }));
  const totalKm = carLegs.reduce((a, l) => a + l.km, 0);

  // budget
  const pl = await priceLevel(cc);
  const eff = 0.35 + 0.65 * pl, eff2 = 0.5 + 0.5 * pl;
  const carCost = Math.ceil(o.travelers / 5) * (o.days * 42 * eff2 + totalKm * 0.12);
  const transitCost = localTransitCost({ pl, travelers: o.travelers, days: o.days }, totalKm);

  let mode = o.mode, modeReason = '';
  if (mode === 'auto') {
    const longest = Math.max(0, ...carLegs.map(l => l.km));
    const railOk = RAIL.has(cc) && (longest <= 350 || HSR.has(cc));
    if (stops.length === 1) { mode = 'transit'; modeReason = 'Une seule étape : pas besoin de voiture, les transports locaux suffisent.'; }
    else if (railOk && (o.travelers <= 2 || transitCost <= carCost)) { mode = 'transit'; modeReason = `Bon réseau de trains dans ce pays et trajets courts : les transports en commun sont plus reposants${transitCost < carCost ? ' et moins chers' : ''}.`; }
    else { mode = 'car'; modeReason = !RAIL.has(cc) ? 'Les transports en commun sont peu pratiques pour relier ces étapes : la voiture offre plus de liberté.' : `À ${o.travelers}, la voiture revient moins cher que le train.`; }
  }
  // trains, cars et bus réels entre les étapes (horaires des opérateurs via Transitous) ; à défaut, temps estimé
  let legs = mode === 'car' ? carLegs : mode === 'bus' ? carLegs.map(l => ({ km: l.km, h: l.km / 65 + 0.5 })) : transitLegs;
  let routeFC = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { k: mode === 'car' ? 'car' : 'est' }, geometry }] };
  if (mode !== 'car' && pts.length > 1) {
    const plans = await Promise.all(pts.slice(1).map((p, i) => transitPlan(pts[i], p, { signal, busOnly: mode === 'bus' }).catch(e => { if (e.name === 'AbortError') throw e; })));
    legs = legs.map((l, i) => plans[i] ? { km: plans[i].km || l.km, h: plans[i].h, plan: plans[i] } : { ...l, estimated: true, unknown: plans[i] === undefined });
    routeFC = { type: 'FeatureCollection', features: legs.map((l, i) => ({ type: 'Feature',
      properties: { k: l.plan ? (l.plan.rail ? 'rail' : 'bus') : 'est' },
      geometry: { type: 'LineString', coordinates: l.plan ? l.plan.coords : [[pts[i].lon, pts[i].lat], [pts[i + 1].lon, pts[i + 1].lat]] } })) };
    const est = legs.filter(l => l.estimated);
    if (est.length) warnings.push(est.every(l => l.unknown)
      ? 'Le service d’horaires (Transitous) n’a pas répondu : durées de trajet estimées.'
      : `Pas d’horaires connus pour ${est.length === legs.length ? 'ces trajets' : est.length + ' trajet' + (est.length > 1 ? 's' : '')} dans la base Transitous : durées estimées, à vérifier auprès des compagnies locales.`);
  }
  const busCost = o.travelers * (totalKm * 0.06 * eff2 + o.days * 4 * eff);    // le car longue distance coûte environ moitié moins que le train
  const localTransport = mode === 'car' ? carCost : mode === 'bus' ? busCost : transitCost;

  let from = null, flight = null;
  if (o.from) {
    from = o.from;
    const dOut = C.haversine(from.lat, from.lon, start.lat, start.lon);
    const last = stops[stops.length - 1];
    const dBack = o.shape === 'oneway' ? C.haversine(from.lat, from.lon, last.lat, last.lon) : dOut;
    // même calcul que la liste de « Où partir ? » (cost.js) : train sur la même terre, sinon avion ou ferry
    flight = accessCost({ lat: from.lat, lon: from.lon, cc: o.fromCc || cc }, { lat: start.lat, lon: start.lon, cc }, o.month, C.haversine, (dOut + dBack) / 2);
    flight.km = Math.round(dOut);
  }
  // comment rejoindre la première étape depuis la ville de départ : vol réel (liaisons connues) ou train / car réel
  let access = null;
  if (from) {
    if (flight.kind === 'avion') {
      const plan = await flightPlan(from, start).catch(() => null);
      access = { type: 'flight', plan };
      if (plan) { flight.label = plan.stops ? 'avion avec escale, aller-retour' : 'vol direct, aller-retour'; }
    } else {
      const plan = await transitPlan(from, start, { signal }).catch(e => { if (e.name === 'AbortError') throw e; });
      access = { type: 'ground', plan };
    }
  }
  const travelCost = flight ? flight.perPerson * o.travelers : 0;
  const tiers = TIERS.map(t => {
    const { lodging, food, act } = stayCost({ pl, travelers: o.travelers, days: o.days, month: o.month }, t);
    const total = lodging + food + act + localTransport + travelCost;
    return { ...t, lines: { 'Vols / trajet aller-retour': travelCost, 'Hébergement': lodging, 'Repas': food, 'Visites et activités': act, [mode === 'car' ? 'Voiture (location + carburant)' : 'Transports sur place']: localTransport }, total };
  });
  let tier = tiers.find(t => t.total <= o.budget);
  const ok = !!tier;
  if (!tier) tier = tiers[tiers.length - 1];
  const over = Math.round(tier.total - o.budget);
  if (!ok) {
    const fmt = v => (Math.ceil(v / 50) * 50).toLocaleString('fr-FR') + ' €';
    const perDay = (tier.total - travelCost) / o.days;
    const maxDays = Math.floor((o.budget - travelCost) / perDay);
    const heavyTrip = travelCost > 0.4 * tier.total || maxDays < 3;
    warnings.unshift(heavyTrip
      ? `Budget insuffisant de ${over.toLocaleString('fr-FR')} € : le trajet aller-retour coûte à lui seul environ ${fmt(travelCost)}. Compte environ ${fmt(tier.total)} pour ce voyage, ou choisis une destination plus proche.`
      : `Budget trop juste de ${over.toLocaleString('fr-FR')} € : compte environ ${fmt(tier.total)} (niveau économique), ou réduis le séjour à ${maxDays} jours${[6, 7].includes(o.month) ? ', ou pars hors saison' : ''}.`);
  }
  if (o.monthScore === 0) warnings.push(`${MOIS_L[o.month][0].toUpperCase() + MOIS_L[o.month].slice(1)} n’est pas la meilleure période ici (chaleur, froid ou pluie) : regarde le calendrier « Quand partir ».`);

  // 7. programme jour par jour
  if (ADVISED_AGAINST.has(cc)) warnings.unshift('Voyages déconseillés dans ce pays (liste simplifiée des conseils du ministère des Affaires étrangères) : vérifie les conseils aux voyageurs avant de partir.');
  const used = new Set(stops.map(s => C.norm(s.name)));
  if (o.days > 1 && ev.travel / o.days > 3) warnings.push(`Beaucoup de trajet : environ ${Math.round(ev.travel)} h au total pour ${o.days} jours.`);
  // visites : sites notables et villes ou villages connus trop proches pour être une étape (excursion à la journée)
  const towns = basesAll.map(x => x.p).filter(p => (p[9] >= 15 || (p[10] || 0) >= 2) && !all.some(b => b.p === p && dominated(b)));
  const activitiesFor = s => sites.concat(towns).map(p => ({ p, d: C.haversine(s.lat, s.lon, p[5], p[6]), boat: !sameLand(s, { lat: p[5], lon: p[6] }) }))
    // une île sur laquelle on se trouve déjà (Bali depuis Ubud) n'est pas une visite
    .filter(x => !(C.kindOf(x.p) === 'ile' && !x.boat))
    .filter(x => x.d < (x.boat ? 35 : BASE_KINDS.has(C.kindOf(x.p)) ? 75 : 40) && x.d > (BASE_KINDS.has(C.kindOf(x.p)) ? 8 : 0) && !used.has(C.norm(C.pname(x.p))))
    .map(x => ({ ...x, v: BASE_KINDS.has(C.kindOf(x.p))
      ? fameOf(x.p) * 0.75 + (likes.includes('villes') ? 1 : 0) - x.d / 25
      : fameOf(x.p) * (1 + 1.3 * likeBonus(C.kindOf(x.p), likes)) - x.d / 15 }))
    .sort((a, b) => b.v - a.v);
  const days = [];
  const usedTowns = stops.filter(x => x.p).map(x => x.p);
  let dayN = 1;
  stops.forEach((s, i) => {
    const pool = activitiesFor(s);
    const take = n => {
      const out = []; let townToday = false;
      for (let j = 0; j < pool.length && out.length < n; j++) {
        const x = pool[j], isTown = BASE_KINDS.has(C.kindOf(x.p));
        if (used.has(C.norm(C.pname(x.p)))) { pool.splice(j--, 1); continue; }
        if (isTown && (townToday || usedTowns.some(t => C.haversine(t[5], t[6], x.p[5], x.p[6]) < 12))) continue;
        pool.splice(j--, 1); used.add(C.norm(C.pname(x.p)));
        if (isTown) { townToday = true; usedTowns.push(x.p); }
        out.push(activity(x.p, x.d, x.boat));
      }
      return out;
    };
    for (let k = 0; k < s.nights; k++) {
      const items = [];
      if (k === 0) {
        if (i === 0) items.push(accessItem(access, from, flight, s.name));
        else items.push(legItem(legs[i - 1], mode, stops[i - 1].name, s.name));
      }
      if (k === 0 || dayN === 1) items.push({ icon: '🚶', text: `Découverte de ${s.name}`, lat: s.lat, lon: s.lon });
      // journée allégée après un long trajet : arrivée d'un vol long ou plus de 3 h de route ou de train
      const travelH = k > 0 ? 0 : i === 0 ? (access?.plan?.h ?? (flight?.kind === 'avion' ? (flight.km / 780 + 1) : 0)) : (legs[i - 1]?.h || 0);
      const n = Math.max(0, pace.perDay - (k === 0 ? 1 : 0) - (travelH > 6 ? 2 : travelH > 3 ? 1 : 0));
      const acts = take(n);
      items.push(...acts);
      if (!acts.length && k > 0) items.push({ icon: '🌿', text: 'Journée libre : détente, flânerie, marchés et cafés' });
      days.push({ n: dayN++, stop: i, title: s.name, items });
    }
  });
  const lastDay = { n: dayN, stop: stops.length - 1, title: o.shape === 'oneway' || stops.length === 1 ? stops[stops.length - 1].name : `Retour à ${start.name}`, items: [] };
  if (o.shape !== 'oneway' && stops.length > 1) lastDay.items.push(legItem(legs[legs.length - 1], mode, stops[stops.length - 1].name, start.name));
  lastDay.items.push({ icon: flight?.kind === 'avion' ? '✈️' : access?.plan ? '🚆' : '🏠', text: from ? `Retour vers ${from.name}` : 'Fin du voyage',
    sub: access?.plan ? (access.type === 'flight' ? 'même trajet qu’à l’aller' : `même trajet qu’à l’aller · ${fmtDur(access.plan.h)}`) : '' });
  days.push(lastDay);

  return {
    debug: C.debug ? cands.slice().sort((a, b) => b.score - a.score).map(c => ({ name: c.name, score: c.score, d: dist(c, start) })) : undefined,
    input: o, cc, variant, stops, legs, days, mode, modeReason, routed, geometry, routeFC, access, warnings,
    totals: { km: Math.round(totalKm), hours: legs.reduce((a, l) => a + l.h, 0) },
    budget: { tier, tiers, ok, over, budget: o.budget, pl }, flight, from,
  };
}
function activity(p, d, boat) {
  const k = C.kindOf(p);
  const town = BASE_KINDS.has(k);
  return { name: C.pname(p), icon: boat ? '⛴️' : C.KIND_ICON[k] || '📍', text: town ? `Excursion à ${C.pname(p)}` : C.pname(p),
    sub: `${C.KIND_LABEL[k] || k} · ${d < 1 ? 'sur place' : Math.round(d) + ' km'}${boat ? ' · en bateau' : ''}`, lat: p[5], lon: p[6], wiki: p[8] || null };
}
function legItem(l, mode, a, b) {
  if (l.plan) return { icon: MODE_INFO[l.plan.legs[0]?.mode]?.[0] || '🚆', text: `${a} → ${b}`, sub: `${fmtDur(l.plan.h)} · ${describe(l.plan)}`, legs: l.plan.legs };
  return { icon: mode === 'car' ? '🚗' : mode === 'bus' ? '🚌' : '🚆', text: `${a} → ${b}`, sub: `${Math.round(l.km)} km · ${fmtDur(l.h)}${mode === 'car' ? '' : ' (estimé)'}` };
}
function accessItem(access, from, flight, to) {
  if (!from) return { icon: '📍', text: `Arrivée à ${to}` };
  const p = access?.plan;
  if (access?.type === 'flight' && p) return { icon: '✈️', text: `${from.name} → ${to}`, sub: `${describeFlight(p)} · ≈ ${fmtDur(p.h)} de vol` };
  if (access?.type === 'ground' && p) return { icon: MODE_INFO[p.legs[0]?.mode]?.[0] || '🚆', text: `${from.name} → ${to}`, sub: `${fmtDur(p.h)} · ${describe(p)}`, legs: p.legs };
  return { icon: flight?.kind === 'avion' ? '✈️' : '🚆', text: `Arrivée depuis ${from.name}`, sub: `${flight.label}, ${flight.km.toLocaleString('fr-FR')} km` };
}

/* ------------------------------------------------------------------ interface */
let trip = null, markers = [];
const fmtE = v => Math.round(v).toLocaleString('fr-FR') + ' €';

export function openPlanner(dest, prefill = {}) {
  const saved = C.LS.get('esc.web.plan', {});
  const m = new Date(); m.setMonth(m.getMonth() + 1);
  const v = { days: 7, budget: 2000, travelers: 2, month: m.getMonth(), from: 'Paris', mode: 'auto', shape: 'loop', pace: 'equilibre', likes: [], ...saved, ...prefill };
  const seg = (name, list, cur) => `<div class="seg" role="radiogroup">${list.map(([val, lab, ic]) => `<label><input type="radio" name="${name}" value="${val}" ${String(cur) === String(val) ? 'checked' : ''}><span>${ic ? I[ic] : ''}${lab}</span></label>`).join('')}</div>`;
  const stepper = (name, val, min, max, unit) => `<div class="stepper" data-stepper="${name}" data-min="${min}" data-max="${max}">
      <button type="button" data-d="-1" aria-label="Moins">${I.minus}</button><output><span>${val}</span><small>${unit}</small></output><button type="button" data-d="1" aria-label="Plus">${I.plus}</button>
      <input type="hidden" name="${name}" value="${val}"></div>`;
  C.setPanel(`
    <div class="hero short"><div class="kicker">${I.route} Nouvel itinéraire</div><h2>${C.esc(dest.name)}</h2><div class="sub">Dis-moi comment tu voyages, je te propose un parcours.</div></div>
    <form class="planner" id="planForm" autocomplete="off">
      <div class="row2">
        <div class="fld"><span>Durée</span>${stepper('days', v.days, 2, 30, 'jours')}</div>
        <div class="fld"><span>Voyageurs</span>${stepper('travelers', v.travelers, 1, 8, v.travelers > 1 ? 'personnes' : 'personne')}</div>
      </div>
      <div class="fld"><div class="budget-val"><span>Budget total, vol compris</span><em><input type="number" name="budget" min="200" max="20000" step="50" value="${v.budget}" aria-label="Budget en euros"> €</em></div>
        <input type="range" id="budgetRange" min="300" max="10000" step="50" value="${Math.min(10000, v.budget)}" aria-label="Budget"></div>
      <div class="row2">
        <label class="fld"><span>Départ en</span><div class="textin">${I.calendar}<select name="month">${MOIS_L.map((mm, i) => `<option value="${i}" ${+v.month === i ? 'selected' : ''}>${mm}</option>`).join('')}</select></div></label>
        <label class="fld"><span>Depuis</span><div class="textin">${I.plane}<input type="text" name="from" value="${C.esc(v.from)}" placeholder="Ta ville"></div></label>
      </div>
      <div class="fld"><span>Sur place</span>${seg('mode', [['auto', 'Propose-moi', 'sparkles'], ['car', 'Voiture', 'car'], ['transit', 'Train', 'train'], ['bus', 'Bus, car', 'bus']], v.mode)}</div>
      <div class="fld"><span>Parcours</span>${seg('shape', [['loop', 'Boucle'], ['oneway', 'Aller simple']], v.shape)}</div>
      <div class="fld"><span>Rythme</span>${seg('pace', Object.entries(PACE).map(([k, p]) => [k, p.label]), v.pace)}</div>
      <div class="fld"><span>Envies <small style="color:var(--faint);font-weight:500">facultatif</small></span><div class="chips">${Object.entries(LIKES).map(([k, l]) => `<label class="chip"><input type="checkbox" name="likes" value="${k}" ${v.likes.includes(k) ? 'checked' : ''}><span>${l.label}</span></label>`).join('')}</div></div>
    </form>`,
    `<button class="btn icon" id="planBack" aria-label="Retour à la fiche" title="Retour à la fiche">${I.back}</button><button class="btn primary" id="planGo">${I.sparkles}Créer l’itinéraire</button>`);
  const form = document.getElementById('planForm');
  form.querySelectorAll('[data-stepper]').forEach(st => st.querySelectorAll('button').forEach(b => b.onclick = () => {
    const inp = st.querySelector('input'), out = st.querySelector('output span');
    const val = clamp(+inp.value + +b.dataset.d, +st.dataset.min, +st.dataset.max);
    inp.value = val; out.textContent = val;
    if (st.dataset.stepper === 'travelers') st.querySelector('output small').textContent = val > 1 ? 'personnes' : 'personne';
  }));
  const range = document.getElementById('budgetRange'), num = form.budget;
  const paint = () => range.style.setProperty('--p', ((range.value - range.min) / (range.max - range.min) * 100) + '%');
  range.oninput = () => { num.value = range.value; paint(); };
  num.oninput = () => { range.value = clamp(+num.value || 0, 300, 10000); paint(); };
  paint();
  document.getElementById('planBack').onclick = () => C.backToPlace();
  document.getElementById('planGo').onclick = () => submit(dest);
  form.onsubmit = e => { e.preventDefault(); submit(dest); };
}

let planCtl = null;
async function submit(dest) {
  const f = new FormData(document.getElementById('planForm'));
  const o = {
    days: clamp(+f.get('days') || 7, 2, 30), travelers: clamp(+f.get('travelers') || 2, 1, 8), budget: Math.max(100, +f.get('budget') || 2000),
    month: +f.get('month'), fromName: String(f.get('from') || '').trim(), mode: f.get('mode'), shape: f.get('shape'), pace: f.get('pace'), likes: f.getAll('likes'),
  };
  C.LS.set('esc.web.plan', { ...o, from: o.fromName });
  // et dans l'autre sens : une prochaine recherche « Où partir ? » repart de ces critères
  const disc = C.LS.get('esc.web.discover', {});
  C.LS.set('esc.web.discover', { ...disc, month: o.month, days: o.days, travelers: o.travelers, budget: o.budget, ...(o.fromName ? { fromName: o.fromName } : {}),
    likes: [...o.likes, ...((disc.likes || []).includes('ski') ? ['ski'] : [])] });
  return run(dest, o);
}
/** Recalcule l'itinéraire affiché avec des changements (variante, étape verrouillée, retirée ou remplacée). */
function recompute(patch) {
  if (!trip) return;
  const o = { ...trip.input, ...patch };
  for (const k of ['from', 'fromCc', 'lat', 'lon', 'name', 'cc', 'monthScore']) delete o[k];
  return run(trip.dest, o, true);
}
async function run(dest, o, keep) {
  planCtl?.abort(); planCtl = new AbortController();
  if (keep) { document.getElementById('pBody')?.classList.add('busy'); } else C.setPanel(`<div class="hero short"><div class="kicker">${I.route} Itinéraire</div><h2>${C.esc(dest.name)}</h2><div class="sub">Je cherche le meilleur parcours…</div></div>
    <div class="kpis">${'<div class="kpi" style="height:64px"></div>'.repeat(4)}</div>
    <div class="sec"><div class="skel" style="width:90%"></div><div class="skel" style="width:70%"></div><div class="skel" style="width:80%"></div></div>`, '');
  try {
    const from = o.fromName ? await geocodeCity(o.fromName, planCtl.signal).catch(() => null) : null;
    if (o.fromName && !from) C.toast(`Ville de départ « ${o.fromName} » introuvable : vol non compté`);
    let scores = dest.monthScores;
    if (!scores && C.climate) scores = (await C.climate(dest.lat, dest.lon, planCtl.signal).catch(() => null))?.score;
    trip = await planTrip({ ...o, from, fromCc: from?.cc, lat: dest.lat, lon: dest.lon, name: dest.name, cc: dest.cc, monthScore: scores?.[o.month] }, planCtl.signal);
    trip.dest = dest;
    const scrollEl = document.querySelector('#panel .scroll'), keepScroll = keep ? scrollEl.scrollTop : 0;
    renderTrip();
    document.getElementById('pBody')?.classList.remove('busy');
    if (keep) scrollEl.scrollTop = keepScroll;
    if (C.isMobile?.()) document.getElementById('panel').classList.add('peek');   // sur téléphone, on voit le tracé
    drawTrip();
    C.route?.(dest, o);
  } catch (e) {
    if (e.name === 'AbortError') return;
    document.getElementById('pBody')?.classList.remove('busy');
    console.error(e);
    C.setPanel(`<div class="hero short"><div class="kicker">Itinéraire</div><h2>${C.esc(dest.name)}</h2></div><div class="note warn">${I.warn}<span>Impossible de calculer l’itinéraire (${C.esc(e.message)}). Vérifie ta connexion et réessaie.</span></div>`, `<button class="btn primary" id="planBack2">${I.back}Revenir au formulaire</button>`);
    document.getElementById('planBack2').onclick = () => openPlanner(dest, o);
  }
}

function renderTrip() {
  const t = trip, b = t.budget;
  const hours = t.totals.hours, hh = Math.floor(hours), mm = Math.round((hours - hh) * 60);
  const lines = Object.entries(b.tier.lines).filter(([, v]) => v > 0);
  const max = Math.max(b.tier.total, b.budget) * 1.04;
  const loop = t.input.shape !== 'oneway' && t.stops.length > 1;
  const visits = d => d.items.filter(it => it.lat != null).length;
  C.setPanel(`
    <div class="hero short"><div class="kicker">${I.route} Itinéraire · ${t.input.travelers} voyageur${t.input.travelers > 1 ? 's' : ''}</div><h2>${C.esc(t.dest.name)}</h2>
      <div class="sub">${loop ? 'En boucle' : 'Aller simple'} · ${MOIS_L[t.input.month]}${t.from ? ' · depuis ' + C.esc(t.from.name) : ''}</div></div>
    <div class="kpis">
      <div class="kpi"><b>${t.input.days}</b><span>jours</span></div>
      <div class="kpi"><b>${t.stops.length}</b><span>étape${t.stops.length > 1 ? 's' : ''}</span></div>
      <div class="kpi"><b>${t.totals.km.toLocaleString('fr-FR')}</b><span>km</span></div>
      <div class="kpi"><b>${hh}h${String(mm).padStart(2, '0')}</b><span>de trajets</span></div>
    </div>
    ${t.warnings.map(w => `<div class="note warn">${I.warn}<span>${C.esc(w)}</span></div>`).join('')}
    <div class="sec"><h3>Le parcours</h3>
      <div class="seg variants" role="radiogroup" aria-label="Variante">${Object.entries(VARIANTS).map(([k, l]) => `<label><input type="radio" name="variant" value="${k}" ${t.variant === k ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>
      <div class="route">${t.stops.map((s, i) => { const locked = (t.input.lock || []).some(x => C.norm(x) === C.norm(s.name));
        return `<div class="stop-row"><button class="stop" data-stop="${i}"><b>${i + 1}</b><span>${C.esc(s.name)}<small>${s.nights} nuit${s.nights > 1 ? 's' : ''}${s.why?.length ? ' · ' + C.esc(s.why.slice(0, 2).join(' · ')) : ''}</small></span></button>
          ${i > 0 ? `<span class="stop-act"><button class="mini ${locked ? 'on' : ''}" data-lock="${i}" title="${locked ? 'Déverrouiller' : 'Garder cette étape quoi qu’il arrive'}" aria-label="${locked ? 'Déverrouiller' : 'Verrouiller'} ${C.esc(s.name)}">${locked ? '🔒' : '🔓'}</button><button class="mini" data-swap="${i}" title="Proposer une autre étape à la place" aria-label="Remplacer ${C.esc(s.name)}">↻</button><button class="mini" data-drop="${i}" title="Retirer cette étape" aria-label="Retirer ${C.esc(s.name)}">✕</button></span>` : ''}</div>`; }).join('')}
        ${loop ? `<div class="stop-row"><button class="stop" data-stop="0"><b>↩</b><span>${C.esc(t.stops[0].name)}<small>retour</small></span></button></div>` : ''}</div>
      ${(t.input.exclude || []).length ? `<p class="src">Étapes écartées : ${t.input.exclude.map(C.esc).join(', ')} · <button class="more" id="tReset" type="button">tout rétablir</button></p>` : ''}
      <div class="mode">${t.mode === 'car' ? I.car : t.mode === 'bus' ? I.bus : I.train}<span><b>${t.mode === 'car' ? 'En voiture' : t.mode === 'bus' ? 'En bus et en car' : 'En train (et bus si besoin)'}</b>${t.modeReason ? '<br>' + C.esc(t.modeReason) : ''}</span></div>
      ${t.mode !== 'car' ? `<div class="legs">${t.legs.map((l, i) => { const a = t.stops[i].name, b = (t.stops[i + 1] || t.stops[0]).name;
        return `<div class="leg ${l.plan ? '' : 'est'}"><div class="leg-h"><b>${C.esc(a)} → ${C.esc(b)}</b><span>${fmtDur(l.h)}${l.plan ? '' : ' · estimé'}</span></div>
          ${l.plan ? l.plan.legs.map(x => `<div class="leg-l"><span class="ic">${MODE_INFO[x.mode]?.[0] || '🚆'}</span><span>${C.esc(x.name || MODE_INFO[x.mode]?.[1] || '')}${x.agency ? ` <small>${C.esc(x.agency)}</small>` : ''}<small>${C.esc(x.from)} → ${C.esc(x.to)} · ${fmtDur(x.h)}</small></span></div>`).join('')
            : `<div class="leg-l muted"><span class="ic">❔</span><span><small>${l.unknown ? 'Service d’horaires indisponible : durée estimée.' : 'Pas d’horaires dans la base Transitous pour ce trajet.'}</small></span></div>`}</div>`; }).join('')}</div>` : ''}
    </div>
    ${accessHtml(t)}
    <div class="sec"><h3>Budget estimé</h3><div class="card">
      <p class="btot"><b>${fmtE(b.tier.total)}</b><span class="tier">${b.tier.label}</span>${b.ok ? `<span class="okk">il reste ${fmtE(b.budget - b.tier.total)}</span>` : `<span class="ko">${fmtE(b.over)} de trop</span>`}</p>
      <div class="bbar"><div class="fill ${b.ok ? '' : 'over'}" style="width:${b.tier.total / max * 100}%"></div><div class="mark" style="left:${b.budget / max * 100}%" title="Ton budget"></div></div>
      <table class="blines">${lines.map(([k, v]) => `<tr><td>${C.esc(k)}</td><td>${fmtE(v)}</td></tr>`).join('')}</table>
      <p class="src" style="margin:0">Estimation selon le niveau des prix du pays (Banque mondiale) et la distance du vol, pas des prix réels. Le niveau de confort est le plus élevé qui rentre dans ton budget.</p>
    </div></div>
    <div class="sec"><h3>Jour par jour</h3>${t.days.map((d, k) => `<details class="day" ${k === 0 ? 'open' : ''}><summary><span class="dn">Jour<b>${d.n}</b></span><span class="dt">${C.esc(d.title)}<small>${visits(d) ? visits(d) + ' visite' + (visits(d) > 1 ? 's' : '') : d.items.find(it => /→/.test(it.text)) ? 'Trajet' : 'Journée libre'}</small></span><span class="chev">${I.next}</span></summary>
      <div class="items">${d.items.map(it => `<div class="it ${it.lat != null ? 'go' : ''}" ${it.lat != null ? `data-lat="${it.lat}" data-lon="${it.lon}"` : ''}><span class="ic">${it.icon}</span><span>${C.esc(it.text)}${it.sub ? `<small>${C.esc(it.sub)}</small>` : ''}${it.wiki ? `<a href="https://fr.wikipedia.org/wiki/${encodeURIComponent(it.wiki)}" target="_blank" rel="noopener">Wikipédia</a>` : ''}</span></div>`).join('')}</div></details>`).join('')}
      <p class="src">${t.routed ? 'Trajets routiers calculés avec OSRM (OpenStreetMap). ' : ''}Étapes et visites tirées de GeoNames et Wikidata.</p></div>`,
    `<button class="btn icon" id="tEdit" aria-label="Modifier" title="Modifier">${I.edit}</button><button class="btn icon" id="tShare" aria-label="Partager l’itinéraire" title="Copier le lien de l’itinéraire">${I.share}</button><button class="btn grow play" id="tTour" title="Survoler le parcours en images">${I.play}Survoler</button><button class="btn primary" id="tSave" aria-label="Enregistrer">${I.heart}<span class="lbl">Enregistrer</span></button>`);
  document.getElementById('tAccess')?.addEventListener('click', () => showAccess());
  const panel = document.getElementById('pBody');
  panel.querySelectorAll('input[name=variant]').forEach(r => r.onchange = () => recompute({ variant: r.value }));
  const nameAt = i => t.stops[+i].name;
  panel.querySelectorAll('[data-lock]').forEach(b => b.onclick = () => {
    const n = nameAt(b.dataset.lock), lk = t.input.lock || [];
    recompute({ lock: lk.some(x => C.norm(x) === C.norm(n)) ? lk.filter(x => C.norm(x) !== C.norm(n)) : [...lk, n] });
  });
  panel.querySelectorAll('[data-swap]').forEach(b => b.onclick = () => {
    const n = nameAt(b.dataset.swap);
    recompute({ exclude: [...(t.input.exclude || []), n], lock: (t.input.lock || []).filter(x => C.norm(x) !== C.norm(n)) });
  });
  panel.querySelectorAll('[data-drop]').forEach(b => b.onclick = () => {
    const n = nameAt(b.dataset.drop);
    recompute({ exclude: [...(t.input.exclude || []), n], lock: (t.input.lock || []).filter(x => C.norm(x) !== C.norm(n)), stopDelta: (t.input.stopDelta || 0) - 1 });
  });
  document.getElementById('tReset')?.addEventListener('click', () => recompute({ exclude: [], lock: [], stopDelta: 0 }));
  document.getElementById('tShare').onclick = () => C.share?.(`Itinéraire ${t.dest.name}`);
  panel.querySelectorAll('[data-stop]').forEach(b => b.onclick = () => { const s = t.stops[+b.dataset.stop]; C.map()?.flyTo({ center: [s.lon, s.lat], zoom: 11, pitch: 50, padding: C.padding(), duration: 2200 }); });
  panel.querySelectorAll('.it.go').forEach(b => b.onclick = () => C.map()?.flyTo({ center: [+b.dataset.lon, +b.dataset.lat], zoom: 13.5, pitch: 55, padding: C.padding(), duration: 2200 }));
  document.getElementById('tEdit').onclick = () => openPlanner(t.dest, { ...t.input, from: t.input.fromName });
  document.getElementById('tTour').onclick = tour;
  document.getElementById('tSave').onclick = () => {
    const trips = C.LS.get('esc.web.trips', []);
    trips.unshift({ id: Date.now(), name: t.dest.name, days: t.input.days, stops: t.stops.map(s => s.name), total: Math.round(b.tier.total), dest: t.dest, input: t.input });
    C.LS.set('esc.web.trips', trips.slice(0, 30));
    C.onSaved?.();
    C.toast('Itinéraire enregistré dans « Mes voyages »');
  };
}

function accessHtml(t) {
  if (!t.from) return '';
  const a = t.access, p = a?.plan;
  let body;
  if (a?.type === 'flight' && p) {
    body = p.segs.map(sg => `<div class="leg-l"><span class="ic">✈️</span><span>${C.esc(sg.from.city || sg.from.name)} (${sg.from.code}) → ${C.esc(sg.to.city || sg.to.name)} (${sg.to.code})
      <small>${C.esc(sg.airlines.join(', ') || 'compagnie inconnue')} · ${Math.round(sg.km).toLocaleString('fr-FR')} km · ≈ ${fmtDur(sg.km / 780 + 0.5)}</small></span></div>`).join('')
      + `<p class="src">Liaisons aériennes connues (OpenFlights, 2014) et aéroports OurAirports : vérifie les vols actuels avant de réserver.</p>`;
  } else if (a?.type === 'ground' && p) {
    body = p.legs.map(x => `<div class="leg-l"><span class="ic">${MODE_INFO[x.mode]?.[0] || '🚆'}</span><span>${C.esc(x.name || MODE_INFO[x.mode]?.[1] || '')}${x.agency ? ` <small>${C.esc(x.agency)}</small>` : ''}<small>${C.esc(x.from)} → ${C.esc(x.to)} · ${fmtDur(x.h)}</small></span></div>`).join('')
      + `<p class="src">Horaires des opérateurs via <a href="https://transitous.org/sources/" target="_blank" rel="noopener">Transitous</a> (un mardi type).</p>`;
  } else {
    body = `<p class="muted">${a?.type === 'flight' ? 'Pas de liaison aérienne connue entre les aéroports proches : un vol avec plusieurs escales sera nécessaire.' : 'Pas d’horaires connus pour ce trajet : vérifie auprès des compagnies.'}</p>`;
  }
  return `<div class="sec"><h3>Comment y aller <small>depuis ${C.esc(t.from.name)}</small></h3><div class="card access">
    <div class="leg-h"><b>${a?.type === 'flight' ? (p ? (p.stops ? 'Avion, 1 escale' : 'Vol direct') : 'Avion') : 'Train ou car'}</b><span>${p ? '≈ ' + fmtDur(p.h) : ''}</span></div>${body}
    ${p ? `<button class="more" id="tAccess" type="button">Voir le trajet sur la carte ${I.next}</button>` : ''}</div></div>`;
}

/* ------------------------------------------------------------------ carte */
const ROUTE_SRC = 'trip-route', ACCESS_SRC = 'trip-access-src';
/** Cadre la carte sur le trajet depuis la ville de départ (vol ou train). */
function showAccess() {
  const map = C.map(), p = trip?.access?.plan; if (!map || !p) return;
  const cs = p.coords.concat([[trip.from.lon, trip.from.lat]]);
  const lons = cs.map(c => c[0]), lats = cs.map(c => c[1]);
  map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
  const mobile = innerWidth < 760;
  const cam = map.cameraForBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]],
    { padding: mobile ? { top: 70, bottom: Math.round(innerHeight * 0.5), left: 30, right: 30 } : { top: 90, bottom: 90, left: 110, right: 490 }, maxZoom: 8 });
  if (cam) map.flyTo({ ...cam, pitch: 0, bearing: 0, duration: 2200, essential: false });
  if (mobile) document.getElementById('panel').classList.add('peek');
}
export function drawTrip() {
  const map = C.map();
  if (!map || !trip) return;
  // trajets : trait plein pour la route et le train réels, tirets pour les durées estimées, pointillés pour l'accès
  const data = trip.routeFC || { type: 'Feature', properties: { k: 'car' }, geometry: trip.geometry };
  const acc = trip.access?.plan ? { type: 'Feature', properties: { k: trip.access.type }, geometry: { type: 'LineString', coordinates: trip.access.plan.coords } }
    : { type: 'FeatureCollection', features: [] };
  const before = map.getStyle().layers.find(l => l.type === 'symbol')?.id;
  if (map.getSource(ACCESS_SRC)) map.getSource(ACCESS_SRC).setData(acc);
  else {
    map.addSource(ACCESS_SRC, { type: 'geojson', data: acc });
    map.addLayer({ id: 'trip-access', type: 'line', source: ACCESS_SRC, layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': ['match', ['get', 'k'], 'flight', '#9fd0ff', '#d6c2ff'], 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.6, 10, 3], 'line-dasharray': [1, 2], 'line-opacity': 0.9 } }, before);
  }
  if (map.getSource(ROUTE_SRC)) map.getSource(ROUTE_SRC).setData(data);
  else {
    map.addSource(ROUTE_SRC, { type: 'geojson', data });
    const color = ['match', ['get', 'k'], 'rail', '#ffb21e', 'bus', '#5fdba7', 'est', '#ffb21e', '#ffb21e'];
    map.addLayer({ id: 'trip-glow', type: 'line', source: ROUTE_SRC, layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': color, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 6, 12, 14], 'line-opacity': 0.25, 'line-blur': 4 } }, before);
    map.addLayer({ id: 'trip-line', type: 'line', source: ROUTE_SRC, filter: ['!=', ['get', 'k'], 'est'], layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': color, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2.5, 12, 5] } }, before);
    map.addLayer({ id: 'trip-line-est', type: 'line', source: ROUTE_SRC, filter: ['==', ['get', 'k'], 'est'], layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': color, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2.5, 12, 5], 'line-dasharray': [2, 1.5] } }, before);
  }
  markers.forEach(m => m.remove());
  markers = trip.stops.map((s, i) => {
    const el = document.createElement('div');
    el.className = 'stop-pin'; el.textContent = i + 1; el.title = s.name;
    return new maplibregl.Marker({ element: el }).setLngLat([s.lon, s.lat]).addTo(map);
  });
  const all = (trip.routeFC ? trip.routeFC.features.flatMap(f => f.geometry.coordinates) : trip.geometry.coordinates).concat(trip.stops.map(s => [s.lon, s.lat]));
  const lons = all.map(c => c[0]), lats = all.map(c => c[1]);
  // cadrage sur tout le parcours ; les marges laissent la place au panneau (à droite, ou en bas sur téléphone)
  const bounds = [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]];
  const mobile = innerWidth < 760;
  const want = mobile ? { top: 70, bottom: Math.round(innerHeight * 0.5), left: 30, right: 30 } : { top: 90, bottom: 90, left: 110, right: 490 };
  map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });   // sinon les marges des vols précédents s'ajoutent
  const cam = map.cameraForBounds(bounds, { padding: want, maxZoom: 9 }) || map.cameraForBounds(bounds, { padding: 20, maxZoom: 9 });
  if (cam) map.flyTo({ ...cam, pitch: 30, bearing: 0, duration: 2200, essential: false });
}
export function clearTrip() {
  const map = C.map();
  stopTour(C);
  markers.forEach(m => m.remove()); markers = [];
  for (const id of ['trip-line', 'trip-line-est', 'trip-glow', 'trip-access']) if (map?.getLayer(id)) map.removeLayer(id);
  for (const id of [ROUTE_SRC, ACCESS_SRC]) if (map?.getSource(id)) map.removeSource(id);
  trip = null;
}
export function redrawAfterStyle() { if (trip) drawTrip(); }
function tour() { if (!C.map()) { C.toast('Le survol a besoin du globe 3D, indisponible sur cet appareil'); return; } startTour(C, trip); }
export const LIKE_KEYS = Object.keys(LIKES);
export function replan(dest, input) { openPlanner(dest, { ...input, from: input.fromName ?? input.from }); submit(dest); }
