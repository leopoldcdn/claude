/* Escapade — générateur d'itinéraire.
 *
 * Entrées : destination, durée, budget (vol compris), voyageurs, mois, ville de départ,
 *           transport (proposition / voiture / transports en commun), parcours (boucle / aller simple),
 *           rythme et envies.
 * Étapes  : 1. candidats autour de la destination (base de lieux GeoNames + notoriété Wikidata)
 *           2. note de chaque ville étape : notoriété + sites intéressants à moins de 25 km, pondérés par les envies
 *           3. choix des étapes (écartées les unes des autres, reliables en voiture ou en train)
 *           4. ordre optimal (boucle ou aller simple, essai de tous les ordres possibles)
 *           5. répartition des nuits, programme jour par jour
 *           6. trajets réels en voiture (OSRM) ou estimés en transports en commun
 *           7. budget estimé (niveau des prix du pays) et choix du niveau de confort qui rentre dans le budget
 */

import { I } from './icons.js';
import { startTour, stopTour } from './tour.js';

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
const RAIL = new Set(['FR', 'DE', 'IT', 'ES', 'CH', 'AT', 'NL', 'BE', 'LU', 'GB', 'JP', 'KR', 'CN', 'TW', 'CZ', 'DK', 'SE', 'PT', 'PL', 'SK', 'HU', 'SI']);
const PACE = {
  calme: { label: 'Tranquille', nightsPerStop: 3.5, perDay: 1 },
  equilibre: { label: 'Équilibré', nightsPerStop: 2.5, perDay: 2 },
  intense: { label: 'Intense', nightsPerStop: 1.6, perDay: 3 },
};
const TIERS = [
  { id: 'premium', label: 'Premium', lodge: 2.0, food: 1.6, act: 1.5 },
  { id: 'confort', label: 'Confort', lodge: 1.0, food: 1.0, act: 1.0 },
  { id: 'eco', label: 'Économique', lodge: 0.5, food: 0.6, act: 0.6 },
];
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
  const coords = points.map(p => `${p.lon.toFixed(5)},${p.lat.toFixed(5)}`).join(';');
  const r = await C.getJSON(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=simplified&geometries=geojson`, { signal, timeout: 20000 });
  if (r.code !== 'Ok') throw new Error(r.code);
  return { legs: r.routes[0].legs.map(l => ({ km: l.distance / 1000, h: l.duration / 3600 })), geometry: r.routes[0].geometry };
}
async function geocodeCity(q, signal) {
  const cache = C.LS.get('esc.web.geocache', {});
  if (cache[q]) return cache[q];
  const r = await C.getJSON(`https://photon.komoot.io/api?q=${encodeURIComponent(q)}&lang=fr&limit=1`, { signal });
  const f = r.features?.[0];
  if (!f) return null;
  const res = { name: f.properties.name, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], cc: (f.properties.countrycode || '').toUpperCase() };
  cache[q] = res; C.LS.set('esc.web.geocache', cache);
  return res;
}
function flightCost(km, month, rail) {
  if (km < 500 || (rail && km < 800)) return { kind: 'sol', perPerson: Math.round(2 * (25 + km * 0.12)), label: rail ? 'train aller-retour' : 'train ou voiture, aller-retour' };
  const season = [6, 7, 11].includes(month) ? 1.25 : 1;
  const rt = (km < 3000 ? 120 + 0.075 * km : 200 + 0.06 * km) * season;
  return { kind: 'avion', perPerson: Math.round(rt), label: 'avion aller-retour' };
}

export async function planTrip(o, signal) {
  const pace = PACE[o.pace] || PACE.equilibre;
  const likes = o.likes || [];
  const nights = Math.max(1, o.days - 1);
  const R = clamp((35 + o.days * 28) * (o.pace === 'intense' ? 1.15 : o.pace === 'calme' ? 0.85 : 1), 60, 420);
  const warnings = [];

  // 1. candidats
  const around = await C.placesAround(o.lat, o.lon, R);
  const sites = around.filter(x => SITE_KINDS.has(C.kindOf(x.p)) && x.p[9] >= 4).map(x => x.p);
  const bases = around.filter(x => BASE_KINDS.has(C.kindOf(x.p)) && (x.p[9] >= 10 || x.p[7] >= 20000 || (C.kindOf(x.p) === 'village' && x.p[9] >= 18)))
    .map(x => x.p);

  // 2. notes
  const toObj = p => ({ p, name: C.pname(p), lat: p[5], lon: p[6] });
  const scoreBase = b => {
    let siteScore = 0;
    for (const s of sites) {
      const d = C.haversine(b.lat, b.lon, s[5], s[6]);
      if (d < 25) siteScore += Math.log1p(s[9]) * (1 + 1.3 * likeBonus(C.kindOf(s), likes)) * (1 - d / 35);
    }
    const isCity = ['ville', 'capitale'].includes(C.kindOf(b.p));
    return C.notability(b.p) * 1.4 + 0.35 * Math.min(siteScore, 25) + (likes.includes('villes') && isCity ? 3 : 0)
      + (likes.length && !likes.includes('villes') && b.p[7] > 1e6 ? -2 : 0)
      + (o.cc && b.p[3] !== o.cc ? -2.5 : 0);
  };
  // une banlieue ou un village collé à une ville plus connue n'est pas une étape : on garde la ville
  const all = bases.map(toObj);
  const reach = x => 14 + (x.p[7] > 1e5 ? 10 * Math.log10(x.p[7] / 1e5) : 0);   // une mégapole « absorbe » ses quartiers
  const dominated = b => all.some(x => x !== b && C.notability(x.p) > C.notability(b.p) + 1.5 && dist(x, b) < reach(x));
  const cands = all.filter(b => !dominated(b)).map(b => ({ ...b, score: scoreBase(b) }));

  // départ : la ville étape la plus proche de la destination choisie (de préférence celle qui porte son nom)
  const nameN = C.norm(o.name || '');
  let start = cands.filter(b => dist(b, o) < 30).sort((a, b) => (C.norm(b.name) === nameN) - (C.norm(a.name) === nameN) || dist(a, o) - dist(b, o))[0];
  if (!start) start = { p: null, name: o.name || 'Destination', lat: o.lat, lon: o.lon, score: 5 };
  start = { ...start, score: start.score + 4 };     // la destination choisie reste le cœur du voyage

  // 3. choix des étapes
  let nStops = clamp(Math.round(nights / pace.nightsPerStop + 0.25), 1, 8);
  const minSep = clamp(R / 5, 25, 90);
  const maxLeg = o.mode === 'transit' ? 320 : 260;
  const chosen = [start];
  while (chosen.length < nStops) {
    let best = null, bestS = -1e9;
    for (const c of cands) {
      if (chosen.some(s => dist(s, c) < minSep)) continue;
      const nearest = Math.min(...chosen.map(s => dist(s, c)));
      if (nearest > maxLeg) continue;
      const s = c.score - (dist(c, start) / R) * (o.shape === 'oneway' ? 1 : 2.5) - nearest / maxLeg;
      if (s > bestS) { bestS = s; best = c; }
    }
    if (!best) break;
    chosen.push(best);
  }
  if (chosen.length < nStops) {
    if (nStops > 1) warnings.push(`Peu de destinations notables autour : ${chosen.length} étape${chosen.length > 1 ? 's' : ''} au lieu de ${nStops}.`);
    nStops = chosen.length;
  }

  // 4. ordre
  let order = chosen;
  if (chosen.length > 2) {
    let best = null, bestD = 1e12;
    for (const perm of permutations(chosen.slice(1))) {
      const seq = [start, ...perm];
      let d = 0;
      for (let i = 1; i < seq.length; i++) d += dist(seq[i - 1], seq[i]);
      if (o.shape !== 'oneway') d += dist(seq[seq.length - 1], start);
      if (d < bestD) { bestD = d; best = seq; }
    }
    order = best;
  }

  // 5. nuits : au moins une par étape, le reste selon l'intérêt de l'étape
  const stops = order.map(s => ({ ...s, nights: 1 }));
  let rest = nights - stops.length;
  if (rest < 0) { stops.length = nights; rest = 0; }
  while (rest > 0) {
    const w = stops.map(s => s.score / (s.nights + 0.5));
    stops[w.indexOf(Math.max(...w))].nights++; rest--;
  }

  // 6. trajets
  const pts = stops.map(s => ({ lat: s.lat, lon: s.lon }));
  if (o.shape !== 'oneway' && stops.length > 1) pts.push({ lat: start.lat, lon: start.lon });
  const straight = [];
  for (let i = 1; i < pts.length; i++) straight.push({ km: dist(pts[i - 1], pts[i]) * 1.3, h: dist(pts[i - 1], pts[i]) * 1.3 / 70 });
  let carLegs = straight, geometry = { type: 'LineString', coordinates: pts.map(p => [p.lon, p.lat]) }, routed = false;
  if (pts.length > 1) {
    try { const r = await osrm(pts, signal); carLegs = r.legs; geometry = r.geometry; routed = true; }
    catch { warnings.push('Temps de route estimés (calcul d’itinéraire routier indisponible, ou traversée en bateau nécessaire).'); }
  }
  const fastRail = RAIL.has(o.cc);
  const transitLegs = carLegs.map(l => ({ km: l.km, h: fastRail ? l.km / 115 + 0.5 : l.km / 55 + 0.75 }));
  const totalKm = carLegs.reduce((a, l) => a + l.km, 0);

  // budget
  const pl = await priceLevel(o.cc || start.p?.[3] || '');
  const eff = 0.35 + 0.65 * pl, eff2 = 0.5 + 0.5 * pl;
  const rooms = Math.ceil(o.travelers / 2);
  const season = [6, 7].includes(o.month) ? 1.2 : o.month === 11 ? 1.1 : 1;
  const carCost = Math.ceil(o.travelers / 5) * (o.days * 42 * eff2 + totalKm * 0.12);
  const transitCost = o.travelers * (totalKm * 0.11 * eff2 + o.days * 4 * eff);

  let mode = o.mode, modeReason = '';
  if (mode === 'auto') {
    const longest = Math.max(0, ...carLegs.map(l => l.km));
    const railOk = RAIL.has(o.cc) && longest <= 350;
    if (stops.length === 1) { mode = 'transit'; modeReason = 'Une seule étape : pas besoin de voiture, les transports locaux suffisent.'; }
    else if (railOk && (o.travelers <= 2 || transitCost <= carCost)) { mode = 'transit'; modeReason = `Bon réseau de trains dans ce pays et trajets courts : les transports en commun sont plus reposants${transitCost < carCost ? ' et moins chers' : ''}.`; }
    else { mode = 'car'; modeReason = !RAIL.has(o.cc) ? 'Les transports en commun sont peu pratiques pour relier ces étapes : la voiture offre plus de liberté.' : `À ${o.travelers}, la voiture revient moins cher que le train.`; }
  }
  const legs = mode === 'car' ? carLegs : transitLegs;
  const localTransport = mode === 'car' ? carCost : transitCost;

  let from = null, flight = null;
  if (o.from) {
    from = o.from;
    const dOut = C.haversine(from.lat, from.lon, start.lat, start.lon);
    const last = stops[stops.length - 1];
    const dBack = o.shape === 'oneway' ? C.haversine(from.lat, from.lon, last.lat, last.lon) : dOut;
    flight = flightCost((dOut + dBack) / 2, o.month, RAIL.has(o.cc) && RAIL.has(o.fromCc || o.cc));
    flight.km = Math.round(dOut);
  }
  const travelCost = flight ? flight.perPerson * o.travelers : 0;
  const tiers = TIERS.map(t => {
    const lodging = rooms * nights * 120 * eff * season * t.lodge;
    const food = o.travelers * o.days * 45 * eff * t.food;
    const act = o.travelers * o.days * 25 * eff * t.act;
    const total = lodging + food + act + localTransport + travelCost;
    return { ...t, lines: { 'Vols / trajet aller-retour': travelCost, 'Hébergement': lodging, 'Repas': food, 'Visites et activités': act, [mode === 'car' ? 'Voiture (location + carburant)' : 'Transports sur place']: localTransport }, total };
  });
  let tier = tiers.find(t => t.total <= o.budget);
  const ok = !!tier;
  if (!tier) tier = tiers[tiers.length - 1];
  const over = Math.round(tier.total - o.budget);
  if (!ok) {
    const perDay = (tier.total - travelCost) / o.days;
    const maxDays = Math.floor((o.budget - travelCost) / perDay);
    warnings.unshift(maxDays >= 2
      ? `Budget trop juste de ${over.toLocaleString('fr-FR')} € : il faudrait réduire à ${maxDays} jours, ou partir hors saison.`
      : `Budget insuffisant de ${over.toLocaleString('fr-FR')} € : le vol absorbe l’essentiel du budget. Une destination plus proche serait plus adaptée.`);
  }
  if (o.monthScore === 0) warnings.push(`${MOIS_L[o.month][0].toUpperCase() + MOIS_L[o.month].slice(1)} n’est pas la meilleure période ici (chaleur, froid ou pluie) : regarde le calendrier « Quand partir ».`);

  // 7. programme jour par jour
  const used = new Set(stops.map(s => C.norm(s.name)));
  // visites : sites notables et villes ou villages connus trop proches pour être une étape (excursion à la journée)
  const towns = all.filter(b => b.p[9] >= 15 && !dominated(b)).map(b => b.p);
  const activitiesFor = s => sites.concat(towns).map(p => ({ p, d: C.haversine(s.lat, s.lon, p[5], p[6]) }))
    .filter(x => x.d < (BASE_KINDS.has(C.kindOf(x.p)) ? 75 : 40) && x.d > (BASE_KINDS.has(C.kindOf(x.p)) ? 8 : 0) && !used.has(C.norm(C.pname(x.p))))
    .map(x => ({ ...x, v: BASE_KINDS.has(C.kindOf(x.p))
      ? Math.log1p(x.p[9]) * 1.15 + (likes.includes('villes') ? 1 : 0) - x.d / 25
      : Math.log1p(x.p[9]) * (1 + 1.3 * likeBonus(C.kindOf(x.p), likes)) - x.d / 15 }))
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
        out.push(activity(x.p, x.d));
      }
      return out;
    };
    for (let k = 0; k < s.nights; k++) {
      const items = [];
      if (k === 0) {
        if (i === 0) items.push({ icon: flight?.kind === 'avion' ? '✈️' : '🚆', text: from ? `Arrivée depuis ${from.name} (${flight.label}, ${flight.km.toLocaleString('fr-FR')} km)` : `Arrivée à ${s.name}` });
        else items.push(legItem(legs[i - 1], mode, stops[i - 1].name, s.name));
      }
      if (k === 0 || dayN === 1) items.push({ icon: '🚶', text: `Découverte de ${s.name}`, lat: s.lat, lon: s.lon });
      const n = Math.max(0, pace.perDay - (k === 0 ? 1 : 0) - (i === 0 && k === 0 ? 0 : 0));
      const acts = take(n);
      items.push(...acts);
      if (!acts.length && k > 0) items.push({ icon: '🌿', text: 'Journée libre : détente, flânerie, marchés et cafés' });
      days.push({ n: dayN++, stop: i, title: s.name, items });
    }
  });
  const lastDay = { n: dayN, stop: stops.length - 1, title: o.shape === 'oneway' || stops.length === 1 ? stops[stops.length - 1].name : `Retour à ${start.name}`, items: [] };
  if (o.shape !== 'oneway' && stops.length > 1) lastDay.items.push(legItem(legs[legs.length - 1], mode, stops[stops.length - 1].name, start.name));
  lastDay.items.push({ icon: flight?.kind === 'avion' ? '✈️' : '🏠', text: from ? `Retour vers ${from.name}` : 'Fin du voyage' });
  days.push(lastDay);

  return {
    debug: C.debug ? cands.slice().sort((a, b) => b.score - a.score).map(c => ({ name: c.name, score: c.score, d: dist(c, start) })) : undefined,
    input: o, stops, legs, days, mode, modeReason, routed, geometry, warnings,
    totals: { km: Math.round(totalKm), hours: legs.reduce((a, l) => a + l.h, 0) },
    budget: { tier, tiers, ok, over, budget: o.budget, pl }, flight, from,
  };
}
function activity(p, d) {
  const k = C.kindOf(p);
  const town = BASE_KINDS.has(k);
  return { name: C.pname(p), icon: C.KIND_ICON[k] || '📍', text: town ? `Excursion à ${C.pname(p)}` : C.pname(p), sub: `${C.KIND_LABEL[k] || k} · ${d < 1 ? 'sur place' : Math.round(d) + ' km'}`, lat: p[5], lon: p[6], wiki: p[8] || null };
}
function legItem(l, mode, a, b) {
  const h = Math.floor(l.h), m = Math.round((l.h - h) * 60 / 5) * 5;
  return { icon: mode === 'car' ? '🚗' : '🚆', text: `${a} → ${b}`, sub: `${Math.round(l.km)} km · ${h ? h + ' h ' : ''}${String(m).padStart(h ? 2 : 1, '0')}${h ? '' : ' min'}${mode === 'car' ? '' : ' (estimé)'}` };
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
      <div class="fld"><span>Sur place</span>${seg('mode', [['auto', 'Propose-moi', 'sparkles'], ['car', 'Voiture', 'car'], ['transit', 'Train, bus', 'train']], v.mode)}</div>
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
  planCtl?.abort(); planCtl = new AbortController();
  C.setPanel(`<div class="hero short"><div class="kicker">${I.route} Itinéraire</div><h2>${C.esc(dest.name)}</h2><div class="sub">Je cherche le meilleur parcours…</div></div>
    <div class="kpis">${'<div class="kpi" style="height:64px"></div>'.repeat(4)}</div>
    <div class="sec"><div class="skel" style="width:90%"></div><div class="skel" style="width:70%"></div><div class="skel" style="width:80%"></div></div>`, '');
  try {
    const from = o.fromName ? await geocodeCity(o.fromName, planCtl.signal).catch(() => null) : null;
    if (o.fromName && !from) C.toast(`Ville de départ « ${o.fromName} » introuvable : vol non compté`);
    trip = await planTrip({ ...o, from, fromCc: from?.cc, lat: dest.lat, lon: dest.lon, name: dest.name, cc: dest.cc, monthScore: dest.monthScores?.[o.month] }, planCtl.signal);
    trip.dest = dest;
    renderTrip();
    drawTrip();
  } catch (e) {
    if (e.name === 'AbortError') return;
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
      <div class="route">${t.stops.map((s, i) => `<button class="stop" data-stop="${i}"><b>${i + 1}</b><span>${C.esc(s.name)}<small>${s.nights} nuit${s.nights > 1 ? 's' : ''}</small></span></button>`).join('')}
        ${loop ? `<button class="stop" data-stop="0"><b>↩</b><span>${C.esc(t.stops[0].name)}<small>retour</small></span></button>` : ''}</div>
      <div class="mode">${t.mode === 'car' ? I.car : I.train}<span><b>${t.mode === 'car' ? 'En voiture' : 'En train et en bus'}</b>${t.modeReason ? '<br>' + C.esc(t.modeReason) : ''}</span></div>
    </div>
    <div class="sec"><h3>Budget estimé</h3><div class="card">
      <p class="btot"><b>${fmtE(b.tier.total)}</b><span class="tier">${b.tier.label}</span>${b.ok ? `<span class="okk">il reste ${fmtE(b.budget - b.tier.total)}</span>` : `<span class="ko">${fmtE(b.over)} de trop</span>`}</p>
      <div class="bbar"><div class="fill ${b.ok ? '' : 'over'}" style="width:${b.tier.total / max * 100}%"></div><div class="mark" style="left:${b.budget / max * 100}%" title="Ton budget"></div></div>
      <table class="blines">${lines.map(([k, v]) => `<tr><td>${C.esc(k)}</td><td>${fmtE(v)}</td></tr>`).join('')}</table>
      <p class="src" style="margin:0">Estimation selon le niveau des prix du pays (Banque mondiale) et la distance du vol, pas des prix réels. Le niveau de confort est le plus élevé qui rentre dans ton budget.</p>
    </div></div>
    <div class="sec"><h3>Jour par jour</h3>${t.days.map((d, k) => `<details class="day" ${k === 0 ? 'open' : ''}><summary><span class="dn">Jour<b>${d.n}</b></span><span class="dt">${C.esc(d.title)}<small>${visits(d) ? visits(d) + ' visite' + (visits(d) > 1 ? 's' : '') : d.items.find(it => /→/.test(it.text)) ? 'Trajet' : 'Journée libre'}</small></span><span class="chev">${I.next}</span></summary>
      <div class="items">${d.items.map(it => `<div class="it ${it.lat != null ? 'go' : ''}" ${it.lat != null ? `data-lat="${it.lat}" data-lon="${it.lon}"` : ''}><span class="ic">${it.icon}</span><span>${C.esc(it.text)}${it.sub ? `<small>${C.esc(it.sub)}</small>` : ''}${it.wiki ? `<a href="https://fr.wikipedia.org/wiki/${encodeURIComponent(it.wiki)}" target="_blank" rel="noopener">Wikipédia</a>` : ''}</span></div>`).join('')}</div></details>`).join('')}
      <p class="src">${t.routed ? 'Trajets routiers calculés avec OSRM (OpenStreetMap). ' : ''}Étapes et visites tirées de GeoNames et Wikidata.</p></div>`,
    `<button class="btn icon" id="tEdit" aria-label="Modifier" title="Modifier">${I.edit}</button><button class="btn icon play" id="tTour" aria-label="Survoler le parcours en images" title="Survoler le parcours en images">${I.play}</button><button class="btn primary" id="tSave">${I.heart}Enregistrer</button>`);
  const panel = document.getElementById('pBody');
  panel.querySelectorAll('[data-stop]').forEach(b => b.onclick = () => { const s = t.stops[+b.dataset.stop]; C.map().flyTo({ center: [s.lon, s.lat], zoom: 11, pitch: 50, padding: C.padding(), duration: 2200 }); });
  panel.querySelectorAll('.it.go').forEach(b => b.onclick = () => C.map().flyTo({ center: [+b.dataset.lon, +b.dataset.lat], zoom: 13.5, pitch: 55, padding: C.padding(), duration: 2200 }));
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

/* ------------------------------------------------------------------ carte */
const ROUTE_SRC = 'trip-route';
export function drawTrip() {
  const map = C.map();
  if (!map || !trip) return;
  const data = { type: 'Feature', properties: {}, geometry: trip.geometry };
  if (map.getSource(ROUTE_SRC)) map.getSource(ROUTE_SRC).setData(data);
  else {
    map.addSource(ROUTE_SRC, { type: 'geojson', data });
    const before = map.getStyle().layers.find(l => l.type === 'symbol')?.id;
    map.addLayer({ id: 'trip-glow', type: 'line', source: ROUTE_SRC, layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#ffb21e', 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 6, 12, 14], 'line-opacity': 0.25, 'line-blur': 4 } }, before);
    map.addLayer({ id: 'trip-line', type: 'line', source: ROUTE_SRC, layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#ffb21e', 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2.5, 12, 5], 'line-dasharray': trip.mode === 'car' ? [1, 0] : [2, 1.5] } }, before);
  }
  if (map.getLayer('trip-line')) map.setPaintProperty('trip-line', 'line-dasharray', trip.mode === 'car' ? [1, 0] : [2, 1.5]);
  markers.forEach(m => m.remove());
  markers = trip.stops.map((s, i) => {
    const el = document.createElement('div');
    el.className = 'stop-pin'; el.textContent = i + 1; el.title = s.name;
    return new maplibregl.Marker({ element: el }).setLngLat([s.lon, s.lat]).addTo(map);
  });
  const lons = trip.geometry.coordinates.map(c => c[0]), lats = trip.geometry.coordinates.map(c => c[1]);
  // cadrage sur tout le parcours ; les marges laissent la place au panneau (à droite, ou en bas sur téléphone)
  const bounds = [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]];
  const mobile = innerWidth < 760;
  const want = mobile ? { top: 70, bottom: Math.round(innerHeight * 0.62), left: 30, right: 30 } : { top: 90, bottom: 90, left: 110, right: 490 };
  map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });   // sinon les marges des vols précédents s'ajoutent
  const cam = map.cameraForBounds(bounds, { padding: want, maxZoom: 9 }) || map.cameraForBounds(bounds, { padding: 20, maxZoom: 9 });
  if (cam) map.flyTo({ ...cam, pitch: 30, bearing: 0, duration: 2200, essential: true });
}
export function clearTrip() {
  const map = C.map();
  stopTour(C);
  markers.forEach(m => m.remove()); markers = [];
  for (const id of ['trip-line', 'trip-glow']) if (map?.getLayer(id)) map.removeLayer(id);
  if (map?.getSource(ROUTE_SRC)) map.removeSource(ROUTE_SRC);
  trip = null;
}
export function redrawAfterStyle() { if (trip) drawTrip(); }
function tour() { startTour(C, trip); }
export const LIKE_KEYS = Object.keys(LIKES);
export function replan(dest, input) { openPlanner(dest, { ...input, from: input.fromName ?? input.from }); submit(dest); }
