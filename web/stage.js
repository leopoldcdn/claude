/* Escapade — carnet d'étape : pour chaque étape d'un itinéraire, comment y aller (lignes de train, vols,
 * liens de réservation), où dormir (adresses Wikivoyage selon le budget, hébergements OpenStreetMap,
 * recherches Booking et Airbnb aux bonnes dates), quoi voir et où manger, et les infos pratiques.
 *
 * Sources gratuites, lues dans le navigateur :
 *  - Wikivoyage (français, sinon anglais) : rubriques Se loger, Voir, Faire, Manger, Aller, Circuler ;
 *  - OpenStreetMap (Overpass) : hôtels, auberges, chambres d'hôtes, campings autour de l'étape ;
 *  - Wikidata : site officiel de la ville ;
 *  - data/country-extra.json : prises, tension, conduite, urgences, liens Conseils aux voyageurs et Seat61. */
import { I } from './icons.js';
import { fmtDur, MODE_INFO } from './transit.js';

let C = null;
export function initStage(ctx) { C = ctx; }

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const fmtDay = d => `${JOURS[d.getDay()]} ${d.getDate()}${d.getDate() === 1 ? 'er' : ''} ${MOIS[d.getMonth()]}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

/* ------------------------------------------------------------------ dates du voyage */
/** Date de départ par défaut : le premier samedi du mois choisi (à venir), ou dans une semaine si c'est ce mois-ci. */
export function defaultStart(month) {
  const now = new Date(); now.setHours(12, 0, 0, 0);
  if (month === now.getMonth()) { const d = addDays(now, 7); return addDays(d, (6 - d.getDay() + 7) % 7); }
  const y = now.getFullYear() + (month < now.getMonth() ? 1 : 0);
  const d = new Date(y, month, 1, 12);
  return addDays(d, (6 - d.getDay() + 7) % 7);
}
/** Dates d'arrivée et de départ de chaque étape. */
export function tripDates(trip) {
  const s = trip.input.start ? new Date(trip.input.start + 'T12:00:00') : defaultStart(trip.input.month);
  let cur = s;
  const stops = trip.stops.map(st => { const a = cur; cur = addDays(cur, st.nights); return { arrive: a, leave: cur }; });
  return { start: s, end: addDays(s, trip.input.days - 1), stops, fixed: !!trip.input.start, iso };
}

/* ------------------------------------------------------------------ Wikivoyage */
const WV = new Map();      // cache en mémoire : « lang:lat,lon » -> article analysé
const wvApi = lang => `https://${lang}.wikivoyage.org/w/api.php?format=json&formatversion=2&origin=*&`;

/** Article Wikivoyage de l'étape : par son nom (s'il est bien à moins de 40 km), sinon le plus proche. */
async function findArticle(stop, lang) {
  const api = wvApi(lang);
  const ok = p => p && !p.missing && !p.pageprops?.disambiguation && !/^(Liste|List) /.test(p.title);
  try {
    const r = await C.getJSON(api + 'action=query&redirects=1&prop=coordinates|pageprops&titles=' + encodeURIComponent(stop.name), { timeout: 12000 });
    const p = r.query?.pages?.[0];
    if (ok(p)) {
      const c = p.coordinates?.[0];
      if (!c || C.haversine(c.lat, c.lon, stop.lat, stop.lon) < 40) return p.title;
    }
  } catch {}
  try {
    const r = await C.getJSON(api + `action=query&list=geosearch&gsradius=10000&gslimit=8&gscoord=${stop.lat}|${stop.lon}`, { timeout: 12000 });
    const hit = (r.query?.geosearch || []).find(g => !/^(Liste|List) /.test(g.title));
    return hit?.title || null;
  } catch { return null; }
}
/** Lit les rubriques utiles de l'article (français d'abord, anglais ensuite). */
export async function voyage(stop) {
  const key = `${stop.lat.toFixed(2)},${stop.lon.toFixed(2)}`;
  if (WV.has(key)) return WV.get(key);
  const job = (async () => {
    for (const lang of ['fr', 'en']) {
      const title = await findArticle(stop, lang);
      if (!title) continue;
      try {
        const r = await C.getJSON(wvApi(lang) + 'action=parse&prop=wikitext&redirects=1&page=' + encodeURIComponent(title), { timeout: 15000 });
        const art = parseArticle(r.parse?.wikitext || '', lang);
        art.title = r.parse?.title || title; art.lang = lang;
        art.url = `https://${lang}.wikivoyage.org/wiki/${encodeURIComponent(art.title.replace(/ /g, '_'))}`;
        // un article sans aucune adresse ni texte utile : on tente l'autre langue
        if (art.count || lang === 'en') return art;
      } catch {}
    }
    return null;
  })();
  WV.set(key, job);
  return job;
}

// rubriques (titre de niveau 2) reconnues, en français et en anglais
const SECTION = [
  [/^(se loger|dormir|sleep)/i, 'sleep'], [/^(voir|see)/i, 'see'], [/^(faire|do)$/i, 'do'], [/^(manger|eat)/i, 'eat'],
  [/^(aller|get in)/i, 'getin'], [/^(circuler|get around)/i, 'around'], [/^(comprendre|understand)/i, 'understand'],
];
const TIER = s => /bon march|petit budget|pas cher|budget|économique/i.test(s) ? 'eco' : /moyen|mid/i.test(s) ? 'mid' : /luxe|haut de gamme|splurge|cher/i.test(s) ? 'lux' : '';
const TPL = { 'se loger': 'sleep', sleep: 'sleep', voir: 'see', see: 'see', faire: 'do', do: 'do', manger: 'eat', eat: 'eat', 'boire un verre': 'drink', drink: 'drink', listing: '', 'informations touristiques': 'info' };

function parseArticle(w, lang) {
  const out = { sleep: [], see: [], do: [], eat: [], info: [], text: {}, count: 0 };
  // découpe en rubriques : on garde le titre de niveau 2 et de niveau 3 courants
  const re = /^(={2,4})\s*(.*?)\s*\1\s*$/gm;
  const marks = []; let m;
  while ((m = re.exec(w))) marks.push({ at: m.index, end: re.lastIndex, lvl: m[1].length, title: clean(m[2]) });
  let h2 = '', h3 = '';
  const chunks = [];
  for (let i = 0; i < marks.length; i++) {
    const mk = marks[i];
    if (mk.lvl === 2) { h2 = mk.title; h3 = ''; } else if (mk.lvl === 3) h3 = mk.title;
    chunks.push({ h2, h3, body: w.slice(mk.end, marks[i + 1]?.at ?? w.length) });
  }
  for (const ch of chunks) {
    const sec = SECTION.find(([r]) => r.test(ch.h2))?.[1] || '';
    // texte libre (avant les adresses) : « Se loger », « Aller > En train », « Circuler »
    const prose = clean(stripListings(ch.body)).replace(/\n{2,}/g, '\n').trim();
    if (prose && sec) {
      const k = sec === 'getin' ? (/train|rail/i.test(ch.h3) ? 'train' : /avion|air|plane/i.test(ch.h3) ? 'air' : /bus|car|autocar/i.test(ch.h3) ? 'bus' : /bateau|boat|ferry/i.test(ch.h3) ? 'boat' : 'getin') : sec;
      if (!out.text[k]) out.text[k] = prose.split('\n').filter(l => l.length > 30 && !/^[*#:]/.test(l)).slice(0, 2).join(' ').replace(/^(.{380}\S*)\s[\s\S]+$/, '$1…');   // coupé à la fin d'un mot
    }
    for (const t of templates(ch.body)) {
      const name = t.name.toLowerCase();
      let type = TPL[name]; if (type === undefined) continue;
      if (type === '') type = TPL[(t.p.type || '').toLowerCase()] ?? '';
      if (/informations touristiques|tourist information|office/i.test(ch.h3 + ' ' + (t.p.nom || t.p.name || ''))) type = 'info';
      if (!type) type = sec === 'sleep' ? 'sleep' : sec === 'eat' ? 'eat' : sec === 'see' ? 'see' : sec === 'do' ? 'do' : '';
      if (!type || !out[type]) continue;
      const L = listing(t.p, lang); if (!L.name) continue;
      L.tier = TIER(ch.h3);
      out[type].push(L); out.count++;
    }
  }
  return out;
}
/** Le texte sans les fiches d'adresses (modèles imbriqués compris), pour en garder la prose. */
function stripListings(s) {
  let out = '', i = 0;
  while (i < s.length) {
    const k = s.indexOf('{{', i);
    if (k < 0) { out += s.slice(i); break; }
    out += s.slice(i, k);
    let depth = 0, j = k;
    for (; j < s.length - 1; j++) {
      if (s[j] === '{' && s[j + 1] === '{') { depth++; j++; } else if (s[j] === '}' && s[j + 1] === '}') { depth--; j++; if (!depth) break; }
    }
    const tpl = s.slice(k, j + 1);
    if (!/^\{\{\s*(se loger|voir|faire|manger|listing|sleep|see|do|eat|drink|boire|acheter|buy|sortir|info|go)\b/i.test(tpl)) out += tpl;
    i = j + 1;
  }
  return out;
}
/** Modèles {{...}} de premier niveau d'un texte, avec leurs paramètres. */
function templates(s) {
  const res = [];
  for (let i = s.indexOf('{{'); i >= 0; i = s.indexOf('{{', i)) {
    let depth = 0, j = i;
    for (; j < s.length - 1; j++) {
      if (s[j] === '{' && s[j + 1] === '{') { depth++; j++; } else if (s[j] === '}' && s[j + 1] === '}') { depth--; j++; if (!depth) break; }
    }
    const inner = s.slice(i + 2, j - 1);
    const parts = []; let d = 0, sq = 0, cur = '';
    for (let k = 0; k < inner.length; k++) {
      const c = inner[k], n = inner[k + 1];
      if (c === '{' && n === '{') { d++; cur += '{{'; k++; continue; }
      if (c === '}' && n === '}') { d--; cur += '}}'; k++; continue; }
      if (c === '[' && n === '[') { sq++; cur += '[['; k++; continue; }
      if (c === ']' && n === ']') { sq--; cur += ']]'; k++; continue; }
      if (c === '|' && !d && !sq) { parts.push(cur); cur = ''; continue; }
      cur += c;
    }
    parts.push(cur);
    const p = {};
    for (const x of parts.slice(1)) { const e = x.indexOf('='); if (e > 0) p[x.slice(0, e).trim().toLowerCase()] = x.slice(e + 1).trim(); }
    res.push({ name: parts[0].trim(), p });
    i = j + 1;
  }
  return res;
}
function listing(p, lang) {
  const g = (...k) => { for (const x of k) if (p[x]) return clean(p[x]); return ''; };
  const lat = parseFloat(p.latitude || p.lat), lon = parseFloat(p.longitude || p.long || p.lon);
  let url = (p.url || '').trim(); if (url && !/^https?:\/\//.test(url)) url = 'https://' + url.replace(/^\/\//, '');
  return {
    name: g('nom', 'name'), alt: g('alt'), url, address: g('adresse', 'address'), dir: g('direction', 'directions'),
    phone: g('téléphone', 'phone'), price: g('prix', 'price'), hours: g('horaire', 'horaires', 'hours'),
    checkin: g('arrivée', 'checkin'), desc: g('description', 'content'),
    lat: isFinite(lat) ? lat : null, lon: isFinite(lon) ? lon : null, lang,
  };
}
/** Texte lisible depuis le wikicode : liens, gras, modèles courants (Heure, Unité, Prix…), balises. */
function clean(s) {
  let t = String(s || '');
  for (let n = 0; n < 4 && /\{\{/.test(t); n++)
    t = t.replace(/\{\{([^{}]*)\}\}/g, (_, inner) => {
      const [name, ...args] = inner.split('|').map(x => x.trim());
      const a = args.filter(x => !x.includes('='));
      if (/^heure$/i.test(name)) return a[0] ? `${a[0]} h${a[1] ? ' ' + a[1] : ''}` : '';
      if (/^(unité|unit|prix|price|formatnum|nobr|lang|langue|date)$/i.test(name)) return a.slice(name.match(/^lang/i) ? 1 : 0, 2).join(' ');
      if (/^(euro|€)$/i.test(name)) return (a[0] || '') + ' €';
      return a.length === 1 ? a[0] : '';
    });
  // images et fichiers : retirés avec leur légende (qui peut contenir des liens)
  for (let n = 0; n < 3; n++) t = t.replace(/\[\[(?:fichier|file|image|media):(?:[^\[\]]|\[\[[^\]]*\]\])*\]\]/gi, '');
  return t.replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1').replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, '$1').replace(/\[https?:\/\/[^\]]+\]/g, '')
    .replace(/'{2,}/g, '').replace(/<br\s*\/?>/gi, ' ').replace(/<ref[\s\S]*?(<\/ref>|\/>)/gi, '').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/[ \t]{2,}/g, ' ').trim();
}

/* ------------------------------------------------------------------ OpenStreetMap */
const OSM = new Map();
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const OSM_KIND = { hotel: 'Hôtel', hostel: 'Auberge de jeunesse', guest_house: 'Chambre d’hôtes', motel: 'Motel', apartment: 'Appartement', camp_site: 'Camping', chalet: 'Chalet', alpine_hut: 'Refuge' };
/** Hébergements autour de l'étape (3 km en ville, 8 km pour un village). undefined si le service ne répond pas. */
export async function osmLodging(stop) {
  const key = `${stop.lat.toFixed(3)},${stop.lon.toFixed(3)}`;
  if (OSM.has(key)) return OSM.get(key);
  const job = (async () => {
    for (const R of [3000, 8000]) {
      const q = `[out:json][timeout:20];nwr[tourism~"^(hotel|hostel|guest_house|motel|apartment|camp_site|chalet|alpine_hut)$"][name](around:${R},${stop.lat},${stop.lon});out center tags 80;`;
      let r = null;
      for (const ep of OVERPASS) {
        try { r = await C.getJSON(ep + '?data=' + encodeURIComponent(q), { timeout: 22000 }); break; } catch {}
      }
      if (!r) return undefined;
      const list = (r.elements || []).map(e => {
        const t = e.tags || {}, lat = e.lat ?? e.center?.lat, lon = e.lon ?? e.center?.lon;
        let url = t.website || t['contact:website'] || ''; if (url && !/^https?:/.test(url)) url = 'https://' + url;
        return { name: t.name, kind: OSM_KIND[t.tourism] || 'Hébergement', stars: parseInt(t.stars, 10) || 0, url,
          address: [t['addr:housenumber'], t['addr:street']].filter(Boolean).join(' '), lat, lon, d: C.haversine(stop.lat, stop.lon, lat, lon) };
      }).filter(x => x.name && x.lat != null);
      if (list.length >= 4 || R === 8000) {
        // d'abord ceux qui ont un site, des étoiles, et qui sont proches du centre
        return list.sort((a, b) => (!!b.url - !!a.url) * 2 + (b.stars > 0) - (a.stars > 0) || a.d - b.d).slice(0, 14);
      }
    }
    return [];
  })();
  OSM.set(key, job);
  return job;
}

/* ------------------------------------------------------------------ Wikidata : site officiel */
const SITE = new Map();
async function officialSite(art) {
  if (!art) return null;
  const k = art.lang + ':' + art.title;
  if (SITE.has(k)) return SITE.get(k);
  const job = C.getJSON(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&origin=*&props=claims|sitelinks&sites=${art.lang}wikivoyage&titles=${encodeURIComponent(art.title)}`, { timeout: 12000 })
    .then(r => {
      const e = Object.values(r.entities || {})[0]; if (!e || e.missing !== undefined) return null;
      const url = e.claims?.P856?.[0]?.mainsnak?.datavalue?.value || null;
      return { url, wiki: e.sitelinks?.frwiki?.title || null };
    }).catch(() => null);
  SITE.set(k, job);
  return job;
}

/* ------------------------------------------------------------------ infos pays */
let extra = null;
async function countryExtra(cc) {
  if (!extra) extra = await C.getJSON('data/country-extra.json').catch(() => ({}));
  return extra[cc] || {};
}

/* ------------------------------------------------------------------ liens de réservation */
// compagnie (nom donné par Transitous) -> site où acheter le billet
const OPERATORS = [
  [/ouigo/i, 'OUIGO', 'https://www.ouigo.com/'],
  [/sncf|ter\b|inoui|intercit|lyria|tgv/i, 'SNCF Connect', 'https://www.sncf-connect.com/'],
  [/eurostar|thalys/i, 'Eurostar', 'https://www.eurostar.com/fr-fr'],
  [/renfe|ave\b|avlo|alvia|rodalies|cercan/i, 'Renfe', 'https://www.renfe.com/es/es'],
  [/iryo/i, 'iryo', 'https://iryo.eu/fr'],
  [/italo/i, 'Italo', 'https://www.italotreno.com/fr'],
  [/trenitalia|frecc|regionale|trenord/i, 'Trenitalia', 'https://www.trenitalia.com/fr.html'],
  [/\bdb\b|deutsche bahn|db fernverkehr|db regio|\bice\b/i, 'DB', 'https://int.bahn.de/fr'],
  [/öbb|oebb|railjet|nightjet/i, 'ÖBB', 'https://www.oebb.at/fr/'],
  [/sbb|cff|ffs/i, 'CFF', 'https://www.sbb.ch/fr'],
  [/\bns\b|nederlandse/i, 'NS', 'https://www.nsinternational.com/fr'],
  [/sncb|nmbs/i, 'SNCB', 'https://www.belgiantrain.be/fr'],
  [/comboios|\bcp\b/i, 'CP', 'https://www.cp.pt/passageiros/en'],
  [/flixbus|flixtrain/i, 'FlixBus', 'https://www.flixbus.fr/'],
  [/blablacar/i, 'BlaBlaCar Bus', 'https://www.blablacar.fr/bus'],
  [/alsa/i, 'ALSA', 'https://www.alsa.com/en/'],
  [/\bjr\b|shinkansen|japan railways/i, 'JR (réservation en ligne)', 'https://www.eki-net.com/en/jreast-train-reservation/Top/Index'],
  [/srt|state railway of thailand/i, 'SRT', 'https://dticket.railway.co.th/'],
  [/pkp|intercity/i, 'PKP Intercity', 'https://www.intercity.pl/en/'],
  [/české dráhy|ceske drahy|\bčd\b/i, 'České dráhy', 'https://www.cd.cz/en/'],
];
const ASIA = new Set(['TH', 'VN', 'KH', 'LA', 'MY', 'ID', 'PH', 'MM', 'SG']);
function operatorLinks(legs, cc) {
  const seen = new Map();
  for (const l of legs) {
    const txt = `${l.agency} ${l.name}`;
    const op = OPERATORS.find(([re]) => re.test(txt));
    if (op && !seen.has(op[1])) seen.set(op[1], op[2]);
  }
  return [...seen].map(([name, url]) => ({ name, url }));
}
const rome2rio = (a, b) => `https://www.rome2rio.com/fr/map/${encodeURIComponent(a)}/${encodeURIComponent(b)}`;
const yymmdd = d => iso(d).slice(2).replace(/-/g, '');
export const bookingLinks = (stop, arrive, leave, travelers) => {
  const q = encodeURIComponent(stop.name), ci = iso(arrive), co = iso(leave);
  return [
    { name: 'Booking.com', url: `https://www.booking.com/searchresults.fr.html?ss=${q}&latitude=${stop.lat}&longitude=${stop.lon}&checkin=${ci}&checkout=${co}&group_adults=${travelers}&no_rooms=${Math.ceil(travelers / 2)}&group_children=0` },
    { name: 'Airbnb', url: `https://www.airbnb.fr/s/${q}/homes?checkin=${ci}&checkout=${co}&adults=${travelers}` },
    { name: 'Hostelworld', url: `https://www.hostelworld.com/fr/search?search_keywords=${q}&date_from=${ci}&date_to=${co}&number_of_guests=${travelers}` },
  ];
};

/* ------------------------------------------------------------------ affichage */
const esc = s => C.esc(s);
const ext = (url, label, cls = '') => url ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>` : '';
const shortUrl = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
const TIER_OF = { eco: 'eco', confort: 'mid', premium: 'lux' };
const TIER_LABEL = { eco: 'Bon marché', mid: 'Prix moyen', lux: 'Haut de gamme', '': 'Autres adresses' };

let S = null;          // état de la vue : { trip, i, tab, data }
let markers = [];
export function clearStageMarkers() { markers.forEach(m => m.remove()); markers = []; }

/** Ouvre le carnet de l'étape i. */
export function openStage(trip, i, tab = 'aller') {
  S = { trip, i, tab, data: {} };
  document.getElementById('panel')?.classList.remove('peek');   // sur téléphone : le carnet s'ouvre en grand
  render();
  const st = trip.stops[i];
  const map = C.map();
  map?.flyTo({ center: [st.lon, st.lat], zoom: 12, pitch: 40, padding: C.padding(), duration: 1800, essential: false });
  load(trip, i);
}
async function load(trip, i) {
  const st = trip.stops[i], mine = S;
  const upd = () => { if (S === mine) render(); };
  const country = trip.stops[i].cc || trip.cc;
  countryExtra(country).then(x => { mine.data.extra = x; upd(); });
  voyage(st).then(async art => {
    mine.data.art = art || false; upd();
    mine.data.site = await officialSite(art); upd();
    drawMarkers();
  });
  osmLodging(st).then(list => { mine.data.osm = list === undefined ? false : list; upd(); drawMarkers(); });
}
function drawMarkers() {
  const map = C.map(); if (!map || !S) return;
  clearStageMarkers();
  const pts = [];
  const tier = TIER_OF[S.trip.budget.tier.id] || 'mid';
  for (const l of (S.data.art?.sleep || [])) if (l.lat != null && (l.tier === tier || !l.tier)) pts.push({ ...l, src: 'wv' });
  for (const l of (S.data.osm || [])) if (!pts.some(p => p.lat != null && C.haversine(p.lat, p.lon, l.lat, l.lon) < 0.08)) pts.push({ ...l, src: 'osm' });
  markers = pts.slice(0, 20).map(p => {
    const el = document.createElement('button');
    el.className = 'bed-pin' + (p.src === 'wv' ? ' wv' : ''); el.title = p.name; el.innerHTML = '🛏';
    el.onclick = () => { S.tab = 'dormir'; render(); };
    return new maplibregl.Marker({ element: el }).setLngLat([p.lon, p.lat]).addTo(map);
  });
}

function render() {
  if (!S) return;
  const { trip, i, tab, data } = S, st = trip.stops[i], n = trip.stops.length;
  const dates = tripDates(trip), dd = dates.stops[i];
  const tabs = [['aller', 'Y aller'], ['dormir', 'Dormir'], ['voir', 'À voir'], ['pratique', 'Pratique']];
  const body = { aller: tabAller, dormir: tabDormir, voir: tabVoir, pratique: tabPratique }[tab](trip, i, dd, data);
  C.setPanel(`
    <div class="hero short stage-hero"><div class="kicker">${I.book} Carnet d’étape · ${i + 1} sur ${n}</div><h2>${esc(st.name)}</h2>
      <div class="sub">${st.nights} nuit${st.nights > 1 ? 's' : ''} · du ${fmtDay(dd.arrive)} au ${fmtDay(dd.leave)}${dates.fixed ? '' : ' (dates à ajuster)'}</div></div>
    <div class="tabs stage-tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab ${tab === k ? 'on' : ''}" role="tab" data-stab="${k}">${l}</button>`).join('')}</div>
    <div class="pane">${body}</div>`,
    `<button class="btn icon" id="stBack" aria-label="Retour à l’itinéraire" title="Retour à l’itinéraire">${I.back}</button>
     ${i > 0 ? `<button class="btn grow" id="stPrev" title="${esc(trip.stops[i - 1].name)}">${I.back}<span class="lbl">Étape ${i}</span></button>` : ''}
     ${i < n - 1 ? `<button class="btn grow" id="stNext" title="${esc(trip.stops[i + 1].name)}"><span class="lbl">Étape ${i + 2} · ${esc(trip.stops[i + 1].name)}</span>${I.next}</button>` : `<button class="btn grow" id="stDone">${I.route}<span class="lbl">Tout l’itinéraire</span></button>`}`);
  const p = document.getElementById('pBody');
  p.querySelectorAll('[data-stab]').forEach(b => b.onclick = () => { S.tab = b.dataset.stab; render(); });
  p.querySelectorAll('[data-fly]').forEach(b => b.onclick = () => { const [la, lo] = b.dataset.fly.split(',').map(Number); C.map()?.flyTo({ center: [lo, la], zoom: 16, pitch: 50, padding: C.padding(), duration: 1800 }); });
  p.querySelectorAll('[data-more]').forEach(b => b.onclick = () => { b.closest('.st-group').classList.add('all'); b.remove(); });
  document.getElementById('stBack').onclick = () => { clearStageMarkers(); S = null; C.backToTrip(); };
  document.getElementById('stPrev')?.addEventListener('click', () => openStage(trip, i - 1, tab));
  document.getElementById('stNext')?.addEventListener('click', () => openStage(trip, i + 1, tab));
  document.getElementById('stDone')?.addEventListener('click', () => document.getElementById('stBack').click());
}

const loading = what => `<div class="sec"><div class="skel" style="width:55%"></div><div class="skel" style="width:90%;height:60px;border-radius:14px"></div><p class="src">${what}</p></div>`;
const card = (L, opts = {}) => `<div class="st-item">
  <div class="st-h"><b>${esc(L.name)}</b>${L.stars ? `<span class="st-stars" title="${L.stars} étoiles">${'★'.repeat(Math.min(5, L.stars))}</span>` : ''}${L.kind ? `<small>${esc(L.kind)}</small>` : ''}</div>
  ${L.price ? `<div class="st-price">${I.coins}${esc(L.price)}</div>` : ''}
  ${L.hours ? `<div class="st-meta">${I.clock}${esc(L.hours)}</div>` : ''}
  ${L.desc ? `<p class="st-desc">${esc(L.desc)}</p>` : ''}
  ${L.address || L.dir ? `<div class="st-meta">${I.pin}${esc([L.address, L.dir].filter(Boolean).join(' · '))}</div>` : ''}
  <div class="st-links">${ext(L.url, `${I.share}${esc(shortUrl(L.url) || 'Site web')}`)}${L.lat != null ? `<button class="more" data-fly="${L.lat},${L.lon}" type="button">${I.map}Sur la carte</button>` : ''}${opts.d != null ? `<small>${opts.d < 1 ? Math.round(opts.d * 1000) + ' m' : opts.d.toFixed(1).replace('.', ',') + ' km'} du centre</small>` : ''}</div>
</div>`;
const group = (title, items, max = 4, sub = '') => items.length ? `<div class="st-group"><h4>${title}${sub ? ` <small>${sub}</small>` : ''}</h4>
  ${items.map((x, k) => `<div class="${k >= max ? 'st-hide' : ''}">${x}</div>`).join('')}
  ${items.length > max ? `<button class="more" data-more type="button">Voir les ${items.length - max} autres ${I.next}</button>` : ''}</div>` : '';
const wvCredit = art => art ? `<p class="src">Adresses et conseils : <a href="${esc(art.url)}" target="_blank" rel="noopener">Wikivoyage, « ${esc(art.title)} »</a>${art.lang === 'en' ? ' (en anglais)' : ''}, licence CC BY-SA. Vérifie prix et horaires avant de partir.</p>` : '';

function tabAller(trip, i, dd) {
  const st = trip.stops[i], prev = i === 0 ? null : trip.stops[i - 1];
  let html = '';
  if (i === 0 && trip.from) {
    const a = trip.access, p = a?.plan;
    html += `<div class="sec"><h3>Depuis ${esc(trip.from.name)} <small>${fmtDay(dd.arrive)}</small></h3>`;
    if (a?.type === 'flight') {
      const codes = p ? [p.segs[0].from.code, p.segs[p.segs.length - 1].to.code] : null;
      html += p ? `<div class="card">${p.segs.map(s => `<div class="leg-l"><span class="ic">✈️</span><span><b>${esc(s.from.city || s.from.name)} (${esc(s.from.code)}) → ${esc(s.to.city || s.to.name)} (${esc(s.to.code)})</b>
          <small>${s.airlines.length ? esc(s.airlines.join(', ')) : 'compagnie à vérifier'} · ≈ ${fmtDur(s.km / 780 + 0.5)} de vol</small></span></div>`).join('')}
          <p class="src" style="margin:6px 0 0">Liaisons et compagnies d’après OpenFlights (2014) : certaines ont changé, vérifie les vols actuels avec les liens ci-dessous.</p></div>` : `<p class="muted">Pas de liaison aérienne directe connue : un vol avec escale sera nécessaire.</p>`;
      const ret = iso(addDays(dd.arrive, trip.input.days - 1));
      html += `<div class="st-links big">
        ${codes ? ext(`https://www.skyscanner.fr/transport/vols/${codes[0].toLowerCase()}/${codes[1].toLowerCase()}/${yymmdd(dd.arrive)}/${yymmdd(addDays(dd.arrive, trip.input.days - 1))}/?adultsv2=${trip.input.travelers}`, `${I.plane}Comparer les vols (Skyscanner)`, 'btn') : ''}
        ${ext(`https://www.google.com/travel/flights?q=${encodeURIComponent(`vols ${codes ? codes[0] : trip.from.name} vers ${codes ? codes[1] : st.name} le ${iso(dd.arrive)} retour le ${ret}`)}&hl=fr`, `${I.plane}Google Vols`, 'btn')}
      </div>`;
    } else html += legDetail(p, trip.from.name, st.name, trip.cc);
    html += `</div>`;
  } else if (prev) {
    const l = trip.legs[i - 1];
    html += `<div class="sec"><h3>Depuis ${esc(prev.name)} <small>${fmtDay(dd.arrive)}</small></h3>`;
    if (trip.mode === 'car') {
      html += `<div class="card"><div class="leg-l"><span class="ic">🚗</span><span><b>${Math.round(l.km)} km de route</b><small>≈ ${fmtDur(l.h)} sans les pauses</small></span></div></div>
        <div class="st-links big">${ext(`https://www.google.com/maps/dir/?api=1&origin=${prev.lat},${prev.lon}&destination=${st.lat},${st.lon}&travelmode=driving`, `${I.map}Itinéraire routier (Google Maps)`, 'btn')}</div>`;
    } else html += legDetail(l.plan, prev.name, st.name, trip.cc, l);
    html += `</div>`;
  }
  const art = S.data.art, ex = S.data.extra;
  const tips = art ? [['train', '🚆 En train'], ['bus', '🚌 En car'], ['air', '✈️ En avion'], ['boat', '⛴️ En bateau'], ['getin', '🧭 Pour arriver']].filter(([k]) => art.text[k]) : [];
  if (tips.length) html += `<div class="sec"><h3>Bon à savoir <small>selon Wikivoyage${art.lang === 'en' ? ' (en anglais)' : ''}</small></h3>${tips.slice(0, 3).map(([k, l]) => `<div class="st-tip"><b>${l}</b><p>${esc(art.text[k])}</p></div>`).join('')}</div>`;
  else if (art === undefined) html += loading('Recherche des conseils pour arriver…');
  if (ex?.seat61) html += `<div class="sec"><div class="note info">${I.train}<span>Voyager en train dans ce pays : le guide très complet de <a href="https://www.seat61.com/${esc(ex.seat61)}.htm" target="_blank" rel="noopener">The Man in Seat 61</a> (en anglais) explique les lignes, les tarifs et comment réserver.</span></div></div>`;
  return html || `<div class="sec"><p class="muted">Première étape du voyage.</p></div>`;
}
/** Détail d'un trajet en train ou en car : chaque tronçon, avec ligne, compagnie, gares et horaires types. */
function legDetail(p, a, b, cc, est) {
  if (!p) return `<div class="card"><p class="muted" style="margin:0">Pas d’horaires connus pour ce trajet${est?.h ? ` (≈ ${fmtDur(est.h)} estimées)` : ''}.</p></div>
    <div class="st-links big">${ext(rome2rio(a, b), `${I.route}Toutes les façons d’y aller (Rome2Rio)`, 'btn')}</div>`;
  const t = x => x ? new Date(x).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
  const ops = operatorLinks(p.legs, cc);
  return `<div class="card">${p.legs.map(x => `<div class="leg-l"><span class="ic">${MODE_INFO[x.mode]?.[0] || '🚆'}</span><span>
      <b>${esc(x.name || MODE_INFO[x.mode]?.[1] || 'Train')}</b>${x.agency ? ` <small>${esc(x.agency)}</small>` : ''}
      <small>${esc(x.from || a)} ${t(x.dep)} → ${esc(x.to || b)} ${t(x.arr)} · ${fmtDur(x.h)}</small></span></div>`).join('')}
    <p class="src" style="margin:6px 0 0">${p.transfers ? `${p.transfers} correspondance${p.transfers > 1 ? 's' : ''} · ` : 'Direct · '}${fmtDur(p.h)} au total. Horaires d’un jour de semaine type (Transitous) : vérifie ceux de ta date.</p></div>
    <div class="st-links big">${ops.map(o => ext(o.url, `${I.train}Réserver sur ${esc(o.name)}`, 'btn')).join('')}${ext(rome2rio(a, b), `${I.route}Comparer (Rome2Rio)`, 'btn')}</div>`;
}

function tabDormir(trip, i, dd, data) {
  const st = trip.stops[i], tier = TIER_OF[trip.budget.tier.id] || 'mid';
  const perNight = Math.round(trip.budget.tier.lines['Hébergement'] / Math.max(1, trip.input.days - 1) / 10) * 10;
  let html = `<div class="sec"><div class="st-when">${I.bed}<span><b>${st.nights} nuit${st.nights > 1 ? 's' : ''}, du ${fmtDay(dd.arrive)} au ${fmtDay(dd.leave)}</b>
      ${trip.input.travelers} voyageur${trip.input.travelers > 1 ? 's' : ''} · ton budget vise le niveau <b>${esc(trip.budget.tier.label.toLowerCase())}</b>, environ ${perNight} € la nuit${trip.input.travelers > 2 ? ' (toutes chambres)' : ''}</span></div>
    <div class="st-links big">${bookingLinks(st, dd.arrive, dd.leave, trip.input.travelers).filter(l => l.name !== 'Hostelworld' || tier === 'eco').map(l => ext(l.url, `${I.bed}${l.name}`, 'btn')).join('')}</div>
    <p class="src">Recherches déjà remplies avec tes dates et le nombre de voyageurs : les prix et disponibilités réels s’y affichent.</p></div>`;
  const art = data.art;
  if (art === undefined) html += loading('Recherche des adresses Wikivoyage…');
  else if (art) {
    if (art.text.sleep) html += `<div class="sec"><div class="st-tip"><b>💡 Conseil</b><p>${esc(art.text.sleep)}</p></div></div>`;
    const by = k => art.sleep.filter(l => l.tier === k).map(l => card(l));
    const order = [tier, ...['eco', 'mid', 'lux', ''].filter(k => k !== tier)];
    const groups = order.map(k => group(`${TIER_LABEL[k]}${k === tier ? ' · pour ton budget' : ''}`, by(k), k === tier ? 4 : 2)).join('');
    if (groups) html += `<div class="sec"><h3>Adresses recommandées <small>par des voyageurs</small></h3>${groups}${wvCredit(art)}</div>`;
  }
  if (data.osm === undefined) html += loading('Recherche des hébergements autour…');
  else if (data.osm === false) html += `<div class="sec"><p class="muted">La liste des hébergements d’OpenStreetMap n’a pas répondu : réessaie plus tard, ou utilise les recherches ci-dessus.</p></div>`;
  else if (data.osm.length) html += `<div class="sec"><h3>Autour du centre <small>${data.osm.length} hébergements</small></h3>
      ${group('Sur la carte', data.osm.map(l => card(l, { d: l.d })), 5)}
      <p class="src">Hébergements © les contributeurs d’<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> (ODbL).</p></div>`;
  if (art === false && data.osm && !data.osm.length) html += `<div class="sec"><p class="muted">Peu d’adresses connues ici : les recherches Booking et Airbnb ci-dessus restent le plus sûr.</p></div>`;
  return html;
}

function tabVoir(trip, i, dd, data) {
  const st = trip.stops[i], art = data.art;
  const day = trip.days.filter(d => d.stop === i).flatMap(d => d.items).filter(it => it.lat != null && it.name);
  let html = '';
  if (day.length) html += `<div class="sec"><h3>Au programme <small>de ton itinéraire</small></h3><div class="list">${day.map(it => `<button class="row" data-fly="${it.lat},${it.lon}"><span class="th">${it.icon}</span><span class="tx"><b>${esc(it.text)}</b><small>${esc(it.sub || '')}</small></span></button>`).join('')}</div></div>`;
  if (art === undefined) return html + loading('Recherche des visites et restaurants…');
  if (!art) return html + `<div class="sec"><p class="muted">Pas de guide Wikivoyage pour ${esc(st.name)}.</p></div>`;
  const tier = TIER_OF[trip.budget.tier.id] || 'mid';
  html += group(`${I.star} À voir`, art.see.map(l => card(l)), 5) ? `<div class="sec">${group('À voir', art.see.map(l => card(l)), 5)}</div>` : '';
  if (art.do.length) html += `<div class="sec">${group('À faire', art.do.map(l => card(l)), 4)}</div>`;
  if (art.eat.length) {
    const eat = [...art.eat.filter(l => l.tier === tier), ...art.eat.filter(l => l.tier !== tier)];
    html += `<div class="sec">${group('Où manger', eat.map(l => card(l)), 4, art.eat.some(l => l.tier === tier) ? 'd’abord pour ton budget' : '')}</div>`;
  }
  return html + `<div class="sec">${wvCredit(art)}</div>`;
}

// France et outre-mer : pas de page « Conseils aux voyageurs », ni de formalités
const FRANCE = new Set(['FR', 'GP', 'MQ', 'GF', 'RE', 'YT', 'PM', 'BL', 'MF', 'NC', 'PF', 'WF']);
function tabPratique(trip, i, dd, data) {
  const st = trip.stops[i], art = data.art, ex = data.extra || {}, site = data.site;
  const cc = st.cc || trip.cc, ci = C.countryInfo(cc);
  const office = art?.info?.[0];
  let html = `<div class="sec"><h3>Sites à consulter</h3><div class="links">
    ${site?.url ? ext(site.url, `${I.star}Site officiel`) : ''}
    ${office?.url ? ext(office.url, `${I.info}Office de tourisme`) : ''}
    ${art ? ext(art.url, `${I.book}Guide Wikivoyage`) : ''}
    ${ext(`https://fr.wikipedia.org/wiki/${encodeURIComponent((site?.wiki || st.wiki || st.p?.[8] || st.name).replace(/ /g, '_'))}`, `${I.book}Wikipédia`)}
    ${ext(`https://www.google.com/maps/search/?api=1&query=${st.lat},${st.lon}`, `${I.map}Google Maps`)}
    ${FRANCE.has(cc) ? '' : ex.mae ? ext(`https://www.diplomatie.gouv.fr/fr/information-par-pays/${ex.mae}/`, `${I.shield}Conseils aux voyageurs`) : ext('https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/', `${I.shield}Conseils aux voyageurs`)}
  </div>${art === undefined ? '<p class="src">Recherche du site officiel…</p>' : ''}</div>`;
  if (office && (office.address || office.phone || office.hours)) html += `<div class="sec"><h3>Office de tourisme</h3>${card(office)}</div>`;
  if (art?.text?.around) html += `<div class="sec"><h3>Se déplacer sur place</h3><div class="st-tip"><p>${esc(art.text.around)}</p></div></div>`;
  const facts = [
    ci?.cur && [I.coins, 'Monnaie', ci.cur],
    ci?.lang && [I.chat, 'Langue', ci.lang],
    ex.plugs && [I.info, 'Prises électriques', `type${ex.plugs.length > 1 ? 's' : ''} ${ex.plugs.split('').join(', ')}${ex.volt ? ' · ' + ex.volt.join(' / ') + ' V' : ''}${/^[CEF]+$/.test(ex.plugs) ? ' (comme en France)' : ' (adaptateur à prévoir)'}`],
    ex.left !== undefined && [I.car, 'Conduite', ex.left ? 'à gauche' : 'à droite'],
    ex.emerg && [I.warn, 'Urgences', ex.emerg.join(' · ')],
    ex.call && [I.chat, 'Indicatif', ex.call],
  ].filter(Boolean);
  if (facts.length) html += `<div class="sec"><h3>Le pays en bref <small>${esc(ci?.name || cc)}</small></h3><div class="grid2">${facts.map(([ic, k, v]) => `<div class="stat">${ic}<span>${k}<b>${esc(v)}</b></span></div>`).join('')}</div>
    <p class="src">${FRANCE.has(cc) ? '' : 'Formalités d’entrée (passeport, visa), santé et sécurité : consulte les Conseils aux voyageurs avant de réserver. '}Données pays : Wikidata.</p></div>`;
  return html;
}
