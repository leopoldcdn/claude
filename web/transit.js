/* Escapade — vrais trajets en train, bus et avion.
 *
 * Train, car, bus : Transitous (https://transitous.org), calculateur d'itinéraires libre qui agrège les horaires
 *   officiels (GTFS) des opérateurs : SNCF, Trenitalia, DB, Renfe, Amtrak, JR, FlixBus… Couverture : surtout
 *   l'Europe, l'Amérique du Nord et le Japon. Service bénévole : requêtes peu nombreuses et mises en cache.
 * Avion : aéroports OurAirports et liaisons directes OpenFlights (data/flights.json, liaisons de 2014 à vérifier).
 */
let C = null;
export function initTransit(ctx) { C = ctx; }

const API = 'https://api.transitous.org/api/v1/plan';
export const MODE_INFO = {
  HIGHSPEED_RAIL: ['🚄', 'TGV / grande vitesse'], LONG_DISTANCE: ['🚆', 'Train grandes lignes'], NIGHT_RAIL: ['🛌', 'Train de nuit'],
  REGIONAL_FAST_RAIL: ['🚆', 'Train régional rapide'], REGIONAL_RAIL: ['🚆', 'Train régional'], RAIL: ['🚆', 'Train'],
  SUBURBAN: ['🚈', 'Train de banlieue'], SUBWAY: ['🚇', 'Métro'], METRO: ['🚇', 'Métro'], TRAM: ['🚊', 'Tram'],
  COACH: ['🚌', 'Car longue distance'], BUS: ['🚌', 'Bus'], FERRY: ['⛴️', 'Ferry'], AIRPLANE: ['✈️', 'Avion'],
  FUNICULAR: ['🚠', 'Funiculaire'], AERIAL_LIFT: ['🚡', 'Téléphérique'], CABLE_CAR: ['🚡', 'Téléphérique'], WALK: ['🚶', 'À pied'],
};
const IS_RAIL = m => /RAIL|LONG_DISTANCE|SUBURBAN/.test(m);

/* ------------------------------------------------------------------ outils */
/** Décode une polyligne encodée (format Google, précision 5 à 7). Renvoie des [lon, lat]. */
export function decodePolyline(str, precision = 7) {
  const f = 10 ** precision, out = [];
  let i = 0, lat = 0, lon = 0;
  while (i < str.length) {
    for (const k of [0, 1]) {
      let shift = 0, res = 0, b;
      do { b = str.charCodeAt(i++) - 63; res |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      const d = res & 1 ? ~(res >> 1) : res >> 1;
      if (k === 0) lat += d; else lon += d;
    }
    out.push([lon / f, lat / f]);
  }
  return out;
}
/** Grand cercle entre deux points (tracé d'un vol), en [lon, lat]. */
export function greatCircle(a, b, n = 64) {
  const R = Math.PI / 180, D = 180 / Math.PI;
  const [φ1, λ1, φ2, λ2] = [a.lat * R, a.lon * R, b.lat * R, b.lon * R];
  const d = 2 * Math.asin(Math.sqrt(Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2));
  if (d < 1e-6) return [[a.lon, a.lat], [b.lon, b.lat]];
  const out = [];
  let prev = null;
  for (let k = 0; k <= n; k++) {
    const t = k / n, A = Math.sin((1 - t) * d) / Math.sin(d), B = Math.sin(t * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    let lon = Math.atan2(y, x) * D;
    if (prev != null) while (lon - prev > 180) lon -= 360;   // continuité à l'antiméridien
    if (prev != null) while (lon - prev < -180) lon += 360;
    prev = lon;
    out.push([lon, Math.atan2(z, Math.hypot(x, y)) * D]);
  }
  return out;
}
/** Date de référence pour les horaires : un mardi, une semaine au moins après aujourd'hui, à 8 h. */
function refDate() {
  const d = new Date(); d.setDate(d.getDate() + 7 + ((2 - d.getDay() + 7) % 7)); d.setHours(8, 0, 0, 0);
  return d.toISOString().slice(0, 19) + 'Z';
}
export const fmtDur = h => { const t = Math.round(h * 60), hh = Math.floor(t / 60), mm = t % 60; return hh ? `${hh} h ${String(mm).padStart(2, '0')}` : `${mm} min`; };

/* ------------------------------------------------------------------ train, car, bus (Transitous) */
/** Meilleur trajet en transports en commun entre deux lieux, ou null si aucun horaire n'est connu. */
export async function transitPlan(a, b, { signal, busOnly = false } = {}) {
  const key = `${a.lat.toFixed(3)},${a.lon.toFixed(3)}>${b.lat.toFixed(3)},${b.lon.toFixed(3)}${busOnly ? 'b' : ''}`;
  const cache = C.LS.get('esc.web.transit', {});
  if (key in cache && Date.now() - cache[key].t < 7 * 864e5) return cache[key].v;
  const url = `${API}?fromPlace=${a.lat.toFixed(5)},${a.lon.toFixed(5)}&toPlace=${b.lat.toFixed(5)},${b.lon.toFixed(5)}&time=${refDate()}`
    + `&maxTransfers=4&numItineraries=5${busOnly ? '&transitModes=BUS,COACH' : ''}`;
  let v = null;
  try {
    const r = await C.getJSON(url, { signal, timeout: 25000 });
    v = pick(r.itineraries || []);
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    return undefined;                                   // service indisponible : on n'enregistre rien
  }
  const keys = Object.keys(cache); if (keys.length > 60) delete cache[keys[0]];
  cache[key] = { t: Date.now(), v }; C.LS.set('esc.web.transit', cache);
  return v;
}
function pick(its) {
  const useful = its.map(it => {
    const legs = it.legs.filter(l => l.mode !== 'WALK' || l.duration > 600);
    const ride = it.legs.filter(l => l.mode !== 'WALK');
    if (!ride.length) return null;
    const walk = it.legs.filter(l => l.mode === 'WALK').reduce((s, l) => s + l.duration, 0);
    // on préfère le plus rapide, en pénalisant les correspondances et la marche
    return { it, legs, cost: it.duration + it.transfers * 900 + walk * 0.5 };
  }).filter(Boolean).sort((x, y) => x.cost - y.cost);
  if (!useful.length) return null;
  const { it } = useful[0];
  const legs = it.legs.map(l => ({
    mode: l.mode, name: l.routeShortName || l.displayName || l.tripShortName || '', agency: l.agencyName || '',
    from: l.from.name === 'START' ? '' : l.from.name, to: l.to.name === 'END' ? '' : l.to.name,
    dep: l.startTime, arr: l.endTime, h: l.duration / 3600,
    coords: l.legGeometry?.points ? decodePolyline(l.legGeometry.points, l.legGeometry.precision || 7) : [[l.from.lon, l.from.lat], [l.to.lon, l.to.lat]],
  }));
  // les petits trajets en ville (métro, bus urbain, marche) se résument ; on garde les trajets principaux
  const main = legs.filter(l => l.mode !== 'WALK' && (IS_RAIL(l.mode) || l.mode === 'COACH' || l.mode === 'FERRY' || l.h > 0.6));
  const shown = main.length ? main : legs.filter(l => l.mode !== 'WALK');
  return {
    h: it.duration / 3600, transfers: it.transfers, legs: shown,
    km: shown.reduce((s, l) => s + lineKm(l.coords), 0),
    coords: legs.flatMap(l => l.coords),
    rail: shown.some(l => IS_RAIL(l.mode)), bus: shown.some(l => /BUS|COACH/.test(l.mode)),
  };
}
function lineKm(cs) {
  let s = 0;
  for (let i = 1; i < cs.length; i++) s += C.haversine(cs[i - 1][1], cs[i - 1][0], cs[i][1], cs[i][0]);
  return s;
}
/** Résumé lisible d'un trajet : « TGV INOUI 6155 (SNCF Voyageurs) » ; « + 1 correspondance ». */
export function describe(p) {
  const parts = p.legs.map(l => `${MODE_INFO[l.mode]?.[0] || '🚆'} ${l.name || MODE_INFO[l.mode]?.[1] || ''}${l.agency ? ` (${titleCase(l.agency)})` : ''}`);
  return parts.join(' → ') + (p.transfers ? ` · ${p.transfers} correspondance${p.transfers > 1 ? 's' : ''}` : ' · direct');
}
const titleCase = s => s.length > 4 && s === s.toUpperCase() ? s.toLowerCase().replace(/(^|\s|-)\S/g, c => c.toUpperCase()) : s;

/* ------------------------------------------------------------------ avion (OurAirports + OpenFlights) */
let F = null;
async function flights() {
  if (F) return F;
  const d = await C.getJSON('data/flights.json', { timeout: 30000 });
  const adj = new Map();
  for (const [i, j, al] of d.routes) {
    if (!adj.has(i)) adj.set(i, new Map()); if (!adj.has(j)) adj.set(j, new Map());
    adj.get(i).set(j, al); adj.get(j).set(i, al);
  }
  F = { ...d, adj };
  return F;
}
function nearAirports(f, p, km = 160) {
  return f.airports.map((a, i) => ({ i, a, d: C.haversine(p.lat, p.lon, a[4], a[5]) }))
    .filter(x => x.d <= km && f.adj.has(x.i)).sort((x, y) => (x.d - y.d) - (y.a[6] - x.a[6]) * 40 - ((f.adj.get(y.i)?.size || 0) - (f.adj.get(x.i)?.size || 0)) * 0.05).slice(0, 5);
}
/** Vol entre deux lieux : direct si possible, sinon avec une escale (la plus courte). */
export async function flightPlan(a, b) {
  const f = await flights();
  const A = nearAirports(f, a), B = nearAirports(f, b);
  if (!A.length || !B.length) return null;
  // nom affiché : la ville de départ ou d'arrivée quand l'aéroport la dessert, sinon la commune (« Paris (Orly…) » → « Paris »)
  const ap = (i, near) => {
    const r = f.airports[i], lat = r[4], lon = r[5];
    const city = near && C.haversine(near.lat, near.lon, lat, lon) < 70 ? near.name : (r[2] || r[1]).split(/\s*[(,]/)[0];
    return { code: r[0], name: r[1], city, lat, lon };
  };
  const al = s => s.split(',').map(c => f.airlines[c] || c).filter(n => !/cargo|freight|fret/i.test(n)).slice(0, 4);
  const dist = (i, j) => C.haversine(f.airports[i][4], f.airports[i][5], f.airports[j][4], f.airports[j][5]);
  let best = null;
  for (const x of A) for (const y of B) {
    const s = f.adj.get(x.i)?.get(y.i);
    if (s) { const c = x.d + y.d + dist(x.i, y.i); if (!best || best.stops > 0 || c < best.c) best = { c, stops: 0, path: [x.i, y.i], als: [s] }; }
  }
  if (!best) {
    for (const x of A) for (const [h, s1] of f.adj.get(x.i)) for (const y of B) {
      const s2 = f.adj.get(h)?.get(y.i); if (!s2) continue;
      const c = x.d + y.d + dist(x.i, h) + dist(h, y.i) + 400;      // une escale coûte du temps
      if (!best || c < best.c) best = { c, stops: 1, path: [x.i, h, y.i], als: [s1, s2] };
    }
  }
  if (!best) return null;
  const pts = best.path.map((i, k) => ap(i, k === 0 ? a : k === best.path.length - 1 ? b : null));
  const segs = pts.slice(1).map((p, k) => ({ from: pts[k], to: p, airlines: al(best.als[k]), km: C.haversine(pts[k].lat, pts[k].lon, p.lat, p.lon) }));
  const km = segs.reduce((s, x) => s + x.km, 0);
  return {
    stops: best.stops, segs, km,
    h: segs.reduce((s, x) => s + x.km / 780 + 0.5, 0) + best.stops * 1.5,
    coords: segs.flatMap(s => greatCircle(s.from, s.to)),
    airports: pts,
  };
}
export function describeFlight(p) {
  const s = p.segs;
  const route = [s[0].from, ...s.map(x => x.to)].map(a => `${a.city || a.name} (${a.code})`).join(' → ');
  const als = [...new Set(s.flatMap(x => x.airlines))].slice(0, 3).join(', ');
  return `${route} · ${p.stops ? `1 escale` : 'vol direct'}${als ? ` · ${als}` : ''}`;
}
