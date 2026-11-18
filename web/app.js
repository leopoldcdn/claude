/* Escapade — globe MapLibre + fiches destination à partir de sources ouvertes.
 * Carte : OpenFreeMap (OpenStreetMap / OpenMapTiles), relief : Terrain Tiles (AWS Open Data)
 * Infos : Photon (géocodage), Wikipédia, Wikivoyage, Wikimedia Commons, Open-Meteo
 */
import { registerProtocol, setCartoonBase, nightGrid, phase } from './sun.js';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const DEG = Math.PI / 180;
const isMobile = matchMedia('(max-width:760px)').matches;
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
function haversine(a, b, c, d) {
  const dLat = (c - a) * DEG, dLon = (d - b) * DEG;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a * DEG) * Math.cos(c * DEG) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(x));
}
const fmtLL = (lat, lon) => `${Math.abs(lat).toFixed(3)}° ${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lon).toFixed(3)}° ${lon >= 0 ? 'E' : 'O'}`;
async function getJSON(url, { timeout = 12000, signal } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeout);
  signal?.addEventListener('abort', () => ctl.abort());
  try {
    const r = await fetch(url, { signal: ctl.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}
let toastT;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400); }

/* ============================ Style de carte "cartoon" ============================ */
const BASE = new URL('.', location.href).href;
const NAME_FR = ['coalesce', ['get', 'name:fr'], ['get', 'name:latin'], ['get', 'name']];
const PAINT = {
  background: { 'background-color': '#c4e6a0' },
  water: { 'fill-color': '#3fc1d6' },
  waterway_river: { 'line-color': '#3fc1d6' },
  waterway_other: { 'line-color': '#3fc1d6' },
  park: { 'fill-color': '#93d46c', 'fill-opacity': 0.75, 'fill-outline-color': '#5fb85a' },
  landcover_wood: { 'fill-color': '#5fb85a', 'fill-opacity': 0.6 },
  landcover_grass: { 'fill-color': '#9fdc78', 'fill-opacity': 0.55 },
  landcover_ice: { 'fill-color': '#f3f8fc' },
  landcover_sand: { 'fill-color': '#f2d985' },
  landuse_residential: { 'fill-color': '#f1e8d2', 'fill-opacity': 0.7 },
  building: { 'fill-color': '#f3dfbd' },
  'building-3d': {
    'fill-extrusion-color': ['interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 0], 0, '#f7e8cc', 40, '#f3cf98', 120, '#eaa86e', 250, '#d98a5a'],
    'fill-extrusion-opacity': 0.95
  },
  road_motorway: { 'line-color': '#ffb21e' }, road_motorway_casing: { 'line-color': '#a8610a' },
  road_motorway_link: { 'line-color': '#ffc04d' }, road_motorway_link_casing: { 'line-color': '#a8610a' },
  road_trunk_primary: { 'line-color': '#ffd84d' }, road_trunk_primary_casing: { 'line-color': '#c08f1e' },
  road_secondary_tertiary: { 'line-color': '#fff2a8' }, road_secondary_tertiary_casing: { 'line-color': '#c9b46a' },
  road_minor: { 'line-color': '#ffffff' }, road_minor_casing: { 'line-color': '#cdbf9f' },
  bridge_motorway: { 'line-color': '#ffb21e' }, bridge_trunk_primary: { 'line-color': '#ffd84d' },
  bridge_secondary_tertiary: { 'line-color': '#fff2a8' },
  boundary_2: { 'line-color': '#7a4fc7', 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.2, 5, 1.8, 12, 3.5] },
  boundary_3: { 'line-color': '#a58ad8' },
};
/* ---- style réaliste : image satellite + routes, noms et bâtiments par-dessus ---- */
const HIDE_REAL = /^(park|park_outline|landuse_|landcover_|water$|waterway_|aeroway_fill|road_area_pattern|building$|natural_earth)/;
function realisticLayer(l) {
  if (HIDE_REAL.test(l.id)) return null;
  if (l.id === 'background') l.paint = { 'background-color': '#08131f' };
  if (l.type === 'line' && /^(road|bridge|tunnel)_/.test(l.id)) {
    l.paint = { ...l.paint, 'line-opacity': ['interpolate', ['linear'], ['zoom'], 6, /casing/.test(l.id) ? 0.25 : 0.45, 14, /casing/.test(l.id) ? 0.45 : 0.8] };
  }
  if (/^boundary/.test(l.id)) l.paint = { ...l.paint, 'line-color': 'rgba(255,255,255,0.55)' };
  if (l.id === 'building-3d') l.paint = { ...l.paint, 'fill-extrusion-color': '#d9d3c7', 'fill-extrusion-opacity': 0.88 };
  if (l.type === 'symbol' && l.layout?.['text-field'] && JSON.stringify(l.layout['text-field']).includes('name')) l.layout['text-field'] = NAME_FR;
  if (l.type === 'symbol' && !/shield/.test(l.id)) {
    l.paint = { ...l.paint, 'text-color': /^water|waterway/.test(l.id) ? '#bfe3ff' : '#ffffff', 'text-halo-color': 'rgba(0,0,0,0.75)', 'text-halo-width': 1.6, 'text-halo-blur': 0.5 };
  }
  if (/^label_country/.test(l.id)) { l.layout['text-transform'] = 'uppercase'; l.layout['text-letter-spacing'] = 0.08; }
  if (/^label_(city|town|city_capital)/.test(l.id)) l.layout['text-font'] = ['Noto Sans Bold'];
  return l;
}
let styleMode = LS.get('esc.web.style', 'realiste');
let dayNight = LS.get('esc.web.daynight', true);
const timeBucket = () => Math.floor(Date.now() / 6e5) * 6e5;   // les tuiles jour/nuit sont recalculées toutes les 10 min
const dnParams = () => `?t=${timeBucket()}&on=${dayNight ? 1 : 0}`;
async function buildStyle(mode = styleMode) {
  const style = await getJSON('https://tiles.openfreemap.org/styles/liberty', { timeout: 20000 });
  delete style.sources.ne2_shaded;
  style.sources.cartoon = { type: 'raster', tiles: ['dn://cartoon/{z}/{x}/{y}' + dnParams()], tileSize: 512, maxzoom: 4,
    attribution: 'Globe : NASA Blue Marble, Natural Earth' };
  style.sources.sat = { type: 'raster', tiles: ['dn://sat/{z}/{x}/{y}' + dnParams()], tileSize: 256, maxzoom: 15,
    attribution: '<a href="https://s2maps.eu">Sentinel-2 cloudless</a> by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)' };
  style.sources.lights = { type: 'raster', tiles: ['dn://lights/{z}/{x}/{y}' + dnParams()], tileSize: 256, maxzoom: 8,
    attribution: 'Lumières nocturnes : NASA Black Marble' };
  style.sources.night = { type: 'geojson', data: dayNight ? nightGrid() : { type: 'FeatureCollection', features: [] } };
  const dem = { type: 'raster-dem', tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
    encoding: 'terrarium', tileSize: 256, maxzoom: 14, attribution: '<a href="https://registry.opendata.aws/terrain-tiles/">Terrain Tiles</a>' };
  style.sources.dem = dem;
  style.sources.dem3d = { ...dem };
  const layers = [];
  if (mode === 'realiste') {
    for (const l0 of style.layers) {
      const l = realisticLayer(l0);
      if (!l) continue;
      layers.push(l);
      if (l.id === 'background') layers.push({ id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-fade-duration': 150, 'raster-resampling': 'linear' } });
      if (l.id === 'building-3d') layers.push(...nightLayers());
    }
    style.layers = layers;
    finishStyle(style, mode);
    return style;
  }
  for (const l of style.layers) {
    if (l.id === 'natural_earth') continue;
    if (PAINT[l.id]) l.paint = { ...l.paint, ...PAINT[l.id] };
    if (l.type === 'symbol' && l.layout?.['text-field'] && JSON.stringify(l.layout['text-field']).includes('name')) l.layout['text-field'] = NAME_FR;
    if (l.id === 'tunnel_motorway_link_casing') {
      layers.push({ id: 'hillshade', type: 'hillshade', source: 'dem', minzoom: 4,
        paint: { 'hillshade-shadow-color': '#4f6b3a', 'hillshade-highlight-color': '#fff6d8', 'hillshade-accent-color': '#6d8a4c',
          'hillshade-exaggeration': ['interpolate', ['linear'], ['zoom'], 4, 0.25, 8, 0.45, 14, 0.3] } });
      layers.push({ id: 'cartoon', type: 'raster', source: 'cartoon',
        paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 4.2, 1, 6.5, 0], 'raster-fade-duration': 0, 'raster-resampling': 'linear' } });
    }
    if (/^label_country/.test(l.id)) {
      l.paint = { ...l.paint, 'text-color': '#1d3b53', 'text-halo-color': 'rgba(255,255,255,.9)', 'text-halo-width': 2, 'text-halo-blur': 0.5 };
      l.layout['text-transform'] = 'uppercase'; l.layout['text-letter-spacing'] = 0.08;
    }
    if (/^label_(city|town|city_capital)/.test(l.id)) {
      l.paint = { ...l.paint, 'text-color': '#1f2430', 'text-halo-color': '#fff', 'text-halo-width': 1.8 };
      l.layout['text-font'] = ['Noto Sans Bold'];
    }
    layers.push(l);
    if (l.id === 'building-3d') layers.push(...nightLayers());
  }
  style.layers = layers;
  finishStyle(style, mode);
  return style;
}
function nightLayers() {
  return [
    { id: 'night-shade', type: 'fill', source: 'night', minzoom: 4.4,
      paint: { 'fill-color': '#020817', 'fill-antialias': false, 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 4.4, 0, 5.2, ['*', ['get', 'o'], 0.8]] } },
    { id: 'night-lights', type: 'raster', source: 'lights', minzoom: 4.4,
      paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 4.4, 0, 5.2, 1], 'raster-fade-duration': 0 } }
  ];
}
function finishStyle(style, mode) {
  style.projection = { type: 'globe' };
  style.sky = mode === 'realiste' ? {
    'sky-color': '#2a6fd6', 'horizon-color': '#a9d4ff', 'fog-color': '#cfe6ff',
    'sky-horizon-blend': 0.6, 'horizon-fog-blend': 0.5, 'fog-ground-blend': 0.7,
    'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0]
  } : {
    'sky-color': '#5fb4ff', 'horizon-color': '#cdeeff', 'fog-color': '#e6f6ff',
    'sky-horizon-blend': 0.5, 'horizon-fog-blend': 0.6, 'fog-ground-blend': 0.6,
    'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0]
  };
  style.light = { anchor: 'viewport', color: '#ffffff', intensity: 0.32, position: [1.4, 200, 35] };
}

/* ============================ Carte ============================ */
let map;
let relief = false;
registerProtocol(maplibregl, 5);
setCartoonBase(BASE + 'tiles/cartoon/');
async function initMap() {
  const style = await buildStyle();
  // on démarre au-dessus de la longitude de l'utilisateur, déduite de son fuseau horaire
  const homeLon = Math.max(-170, Math.min(170, -new Date().getTimezoneOffset() / 4));
  map = new maplibregl.Map({
    container: 'map', style,
    center: [homeLon, 30], zoom: isMobile ? 1.0 : 2.0, pitch: 0, maxPitch: 78,
    attributionControl: { compact: true },
    canvasContextAttributes: { antialias: true }
  });
  window.escapadeMap = map;   // accès pratique depuis la console du navigateur
  map.on('load', () => {
    $('#loading').style.opacity = 0;
    setTimeout(() => $('#loading').remove(), 900);
    updateReadout();
  });
  map.on('mousemove', e => {
    const ph = phase(e.lngLat.lat, e.lngLat.lng);
    $('#rCoords').textContent = fmtLL(e.lngLat.lat, e.lngLat.lng) + '  ' + (ph === 'jour' ? '☀️' : ph === 'nuit' ? '🌙' : '🌇');
    hoverPlace(e.point);
  });
  map.on('move', updateReadout);
  map.on('click', e => onMapClick(e));
}
function altitudeKm() {
  const c = map.getCenter();
  const mpp = 156543.03 * Math.cos(c.lat * DEG) / 2 ** map.getZoom();
  return mpp * map.getCanvas().clientHeight * 1.5 / 1000;
}
function updateReadout() {
  const a = altitudeKm();
  $('#rAlt').textContent = 'ALT ' + (a > 10 ? Math.round(a).toLocaleString('fr-FR') + ' KM' : Math.round(a * 1000).toLocaleString('fr-FR') + ' M');
}
let hoverRaf = 0;
function hoverPlace(pt) {
  if (hoverRaf) return;
  hoverRaf = requestAnimationFrame(() => {
    hoverRaf = 0;
    const f = map.queryRenderedFeatures(pt, { layers: map.getStyle().layers.filter(l => /^label_|^poi_/.test(l.id)).map(l => l.id) })[0];
    if (f) { $('#rPlace').textContent = f.properties['name:fr'] || f.properties['name:latin'] || f.properties.name || ''; map.getCanvas().style.cursor = 'pointer'; }
    else map.getCanvas().style.cursor = '';
  });
}
function onMapClick(e) {
  const f = map.queryRenderedFeatures(e.point, { layers: map.getStyle().layers.filter(l => /^label_|^poi_/.test(l.id)).map(l => l.id) })[0];
  let lng = e.lngLat.lng, lat = e.lngLat.lat, hint = null;
  if (f && f.geometry.type === 'Point') {
    [lng, lat] = f.geometry.coordinates;
    hint = f.properties['name:fr'] || f.properties['name:latin'] || f.properties.name;
  }
  explore(lat, lng, { hint });
}
function panelPadding() {
  return isMobile ? { top: 40, bottom: innerHeight * 0.7, left: 20, right: 20 } : { top: 60, bottom: 60, left: 60, right: 460 };
}
function goTo(lat, lon, opts = {}) {
  const z = map.getZoom();
  const target = opts.zoom ?? (z < 6 ? 10 : Math.max(z, 10));
  map.flyTo({
    center: [lon, lat], zoom: target, pitch: opts.pitch ?? (target >= 9 ? 50 : 0), bearing: opts.bearing ?? map.getBearing(),
    padding: panelPadding(), duration: opts.duration ?? (z < 6 ? 3800 : 1600), essential: true, curve: 1.5
  });
}

/* ============================ Marqueurs ============================ */
let wpMarker = null, poiMarker = null;
function placeMarker(lat, lon) {
  if (!wpMarker) {
    const el = document.createElement('div');
    el.className = 'waypoint';
    el.innerHTML = '<div class="beam"></div><div class="ring"></div><div class="dot"></div>';
    wpMarker = new maplibregl.Marker({ element: el, anchor: 'center' });
  }
  wpMarker.setLngLat([lon, lat]).addTo(map);
}
function placePoi(lat, lon) {
  if (!poiMarker) { const el = document.createElement('div'); el.className = 'poi-pin'; poiMarker = new maplibregl.Marker({ element: el }); }
  poiMarker.setLngLat([lon, lat]).addTo(map);
}

/* ============================ Données locales ============================ */
/* Base de lieux (GeoNames + notoriété Wikidata), découpée en cases de 5° chargées à la demande.
 * Un lieu : [nom, nom_fr, type, pays, région, lat, lon, population, article_wikipedia_fr, notoriété] */
let countries = {}, meta = null;
const loadLocal = Promise.all([
  getJSON('data/countries.json').then(d => { countries = d; }),
  getJSON('data/places-meta.json').then(d => { meta = d; })
]).catch(() => {});
const cellCache = new Map();
function loadCell(key) {
  if (!cellCache.has(key)) cellCache.set(key, getJSON(`data/places/${key}.json`, { timeout: 25000 }).catch(() => []));
  return cellCache.get(key);
}
async function placesAround(lat, lon, km) {
  await loadLocal;
  if (!meta) return [];
  const C = meta.cell, cells = new Set(meta.cells);
  const dLat = km / 111, dLon = Math.min(180, km / (111 * Math.max(0.05, Math.cos(lat * DEG))));
  const keys = new Set();
  for (let a = Math.floor((lat - dLat) / C) * C; a <= lat + dLat; a += C)
    for (let b = Math.floor((lon - dLon) / C) * C; b <= lon + dLon; b += C) {
      const k = `${a}_${((b + 180) % 360 + 360) % 360 - 180}`;
      if (cells.has(k)) keys.add(k);
    }
  const lists = await Promise.all([...keys].slice(0, 12).map(loadCell));
  const out = [];
  for (const l of lists) for (const p of l) {
    if (Math.abs(p[5] - lat) > dLat) continue;
    const d = haversine(lat, lon, p[5], p[6]);
    if (d <= km) out.push({ p, d });
  }
  return out.sort((a, b) => a.d - b.d);
}
let topPromise = null;
const loadTop = () => topPromise ||= getJSON('data/top.json', { timeout: 30000 }).catch(() => []);
const pname = p => p[1] || p[0];
const kindOf = p => meta?.kinds?.[p[2]] || '';
const KIND_ICON = { ville: '🏙', village: '🏡', capitale: '⭐', ile: '🏝', plage: '🏖', montagne: '⛰', volcan: '🌋', parc: '🌳', lac: '💧', cascade: '💦',
  gorge: '🏞', desert: '🏜', glacier: '🧊', cap: '🧭', chateau: '🏰', palais: '🏛', 'site antique': '🏺', monument: '🗿', 'site historique': '📜',
  musee: '🖼', temple: '⛩', monastere: '⛪', station: '⛷', 'parc attractions': '🎢', zoo: '🦁', phare: '🗼', 'point de vue': '👀', lagune: '🌊', grotte: '🕳', baie: '⚓' };
const KIND_LABEL = { ile: 'île', musee: 'musée', monastere: 'monastère', chateau: 'château', desert: 'désert', station: 'station touristique', 'parc attractions': "parc d'attractions" };
const notability = p => Math.log1p(p[9]) * 2.2 + Math.log10(p[7] + 10) * 0.8 + (kindOf(p) === 'capitale' ? 3 : 0);
async function bestDestination(lat, lon) {
  let cand = (await placesAround(lat, lon, 150)).filter(x => x.p[9] >= 5 || x.p[7] >= 20000);
  if (!cand.length) {
    const top = await loadTop();
    cand = top.map(p => ({ p, d: haversine(lat, lon, p[5], p[6]) })).sort((a, b) => a.d - b.d).slice(0, 60);
  }
  if (!cand.length) return null;
  const sc = x => notability(x.p) - x.d / 40;
  return cand.reduce((b, x) => sc(x) > sc(b) ? x : b);
}
const dnCurrency = (() => { try { return new Intl.DisplayNames(['fr'], { type: 'currency' }); } catch { return null; } })();
const dnLang = (() => { try { return new Intl.DisplayNames(['fr'], { type: 'language' }); } catch { return null; } })();
const LANG3 = { eng: 'en', fra: 'fr', spa: 'es', por: 'pt', ita: 'it', deu: 'de', nld: 'nl', ara: 'ar', zho: 'zh', jpn: 'ja', kor: 'ko', rus: 'ru',
  ell: 'el', tur: 'tr', tha: 'th', vie: 'vi', ind: 'id', msa: 'ms', hin: 'hi', swa: 'sw', pol: 'pl', ces: 'cs', hrv: 'hr', srp: 'sr', ron: 'ro',
  hun: 'hu', swe: 'sv', nor: 'no', nob: 'nb', dan: 'da', fin: 'fi', isl: 'is', gle: 'ga', heb: 'he', fas: 'fa', urd: 'ur', ben: 'bn', khm: 'km',
  lao: 'lo', mya: 'my', mlg: 'mg', amh: 'am', fil: 'fil', tgl: 'tl', cat: 'ca', slk: 'sk', slv: 'sl', bul: 'bg', ukr: 'uk', est: 'et', lav: 'lv', lit: 'lt', mlt: 'mt' };
function countryInfo(cc) {
  const c = countries[(cc || '').toUpperCase()];
  if (!c) return null;
  const cur = c.cur.map(([code, sym]) => { const n = dnCurrency?.of(code) || code; return n.charAt(0).toUpperCase() + n.slice(1) + (sym ? ` (${sym})` : ''); }).join(', ');
  const lang = c.lang.slice(0, 3).map(l => { const n = dnLang?.of(LANG3[l] || l); return n ? n.charAt(0).toUpperCase() + n.slice(1) : l; }).join(', ');
  return { name: c.n, flag: c.f, cur, lang, cap: c.cap };
}

/* ============================ Sources d'infos ============================ */
const WIKI = 'https://fr.wikipedia.org/w/api.php?format=json&formatversion=2&origin=*&';
const WIKIVOY = 'https://fr.wikivoyage.org/w/api.php?format=json&formatversion=2&origin=*&';
const COMMONS = 'https://commons.wikimedia.org/w/api.php?format=json&formatversion=2&origin=*&';

async function reverseGeocode(lat, lon, signal) {
  try {
    const r = await getJSON(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&lang=fr&limit=1`, { signal });
    return r.features?.[0]?.properties || null;
  } catch { return null; }
}
async function wikiPages(api, titles, signal, withCoords = true) {
  const t = [...new Set(titles.filter(Boolean))].slice(0, 8);
  if (!t.length) return [];
  const props = ['extracts', 'pageimages', 'info'].concat(withCoords ? ['coordinates'] : []).join('|');
  const url = api + `action=query&prop=${props}&exintro=1&explaintext=1&exlimit=max&piprop=thumbnail|original&pithumbsize=1280&inprop=url&redirects=1&titles=${encodeURIComponent(t.join('|'))}`;
  const r = await getJSON(url, { signal });
  const pages = r.query?.pages || [];
  const redir = {};
  for (const x of [...(r.query?.normalized || []), ...(r.query?.redirects || [])]) redir[x.from] = x.to;
  const resolve = s => { let k = s; for (let i = 0; i < 4 && redir[k]; i++) k = redir[k]; return k; };
  return t.map(title => pages.find(p => p.title === resolve(title))).filter(p => p && !p.missing);
}
function ringPoints(lat, lon, km = 3, n = 6) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI;
    pts.push([lat + (km / 111) * Math.cos(a), lon + (km / (111 * Math.cos(lat * DEG))) * Math.sin(a)]);
  }
  return pts;
}
async function geoSearchMany(api, lat, lon, ns, signal) {
  const qs = [[lat, lon, 10000, 120], ...ringPoints(lat, lon).map(([a, b]) => [a, b, 2000, 40])];
  const res = await Promise.allSettled(qs.map(([a, b, r, l]) => getJSON(api + `action=query&list=geosearch&gscoord=${a.toFixed(5)}|${b.toFixed(5)}&gsradius=${r}&gslimit=${l}&gsnamespace=${ns}`, { signal })));
  const seen = new Map();
  for (const x of res) if (x.status === 'fulfilled') for (const g of x.value.query?.geosearch || []) if (!seen.has(g.title)) seen.set(g.title, { title: g.title, lat: g.lat, lon: g.lon, d: haversine(lat, lon, g.lat, g.lon) });
  return [...seen.values()].sort((a, b) => a.d - b.d);
}
async function wikiInfo(titles, signal) {
  const base = WIKI + `action=query&prop=pageimages|description|info|pageviews&pvipdays=30&inprop=url&piprop=thumbnail&pithumbsize=1280&pilimit=50&titles=${encodeURIComponent(titles.join('|'))}`;
  const info = new Map();
  let cont = null;
  for (let i = 0; i < 4; i++) {
    const r = await getJSON(base + (cont ? '&' + new URLSearchParams(cont) : ''), { signal });
    for (const p of r.query?.pages || []) {
      const prev = info.get(p.title) || {};
      info.set(p.title, { ...prev, ...p, pageviews: { ...(prev.pageviews || {}), ...(p.pageviews || {}) }, thumbnail: p.thumbnail || prev.thumbnail, description: p.description || prev.description });
    }
    if (!r.continue) break;
    cont = r.continue;
  }
  return info;
}
async function wikiNearby(lat, lon, signal) {
  const cand = spread((await geoSearchMany(WIKI, lat, lon, 0, signal)).filter(g => !ADMIN.test(g.title)), 0.1, 200).slice(0, 200);
  if (!cand.length) return [];
  const batches = [];
  for (let i = 0; i < cand.length; i += 50) batches.push(cand.slice(i, i + 50).map(c => c.title));
  const maps = await Promise.all(batches.map(b => wikiInfo(b, signal).catch(() => new Map())));
  const info = new Map(maps.flatMap(m => [...m]));
  const ranked = cand.map(c => {
    const p = info.get(c.title) || {};
    const big = p.thumbnail?.source;
    const views = Object.values(p.pageviews || {}).reduce((a, v) => a + (v || 0), 0);
    return { ...c, desc: p.description || '', big, thumb: big && big.replace(/\/\d+px-/, '/250px-'), url: p.fullurl, views };
  }).filter(c => !ADMIN.test(c.desc) && !ORG.test(c.desc)).sort((a, b) => b.views - a.views);
  return spread(ranked, 0.15, 30);
}
async function commonsPhotos(lat, lon, signal) {
  const cand = spread((await geoSearchMany(COMMONS, lat, lon, 6, signal)).filter(g => /\.jpe?g$/i.test(g.title)), 0.8, 40);
  if (!cand.length) return [];
  const r2 = await getJSON(COMMONS + `action=query&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiextmetadatafilter=Artist|LicenseShortName&iiurlwidth=1280&titles=${encodeURIComponent(cand.map(c => c.title).join('|'))}`, { signal });
  const info = new Map((r2.query?.pages || []).map(p => [p.title, p]));
  return cand.map(c => {
    const ii = info.get(c.title)?.imageinfo?.[0];
    if (!ii || ii.mime !== 'image/jpeg' || ii.width < 900 || ii.width < ii.height * 0.9 || !ii.thumburl) return null;
    const artist = (ii.extmetadata?.Artist?.value || '').replace(/<[^>]+>/g, '').trim();
    return { lat: c.lat, lon: c.lon, src: ii.thumburl, thumb: ii.thumburl.replace(/\/\d+px-/, '/500px-'), page: ii.descriptionurl,
      title: c.title.replace(/^File:|\.jpe?g$/gi, ''), credit: [artist, ii.extmetadata?.LicenseShortName?.value].filter(Boolean).join(' · ') };
  }).filter(Boolean).slice(0, 12);
}
async function climate(lat, lon, signal) {
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&start_date=2019-01-01&end_date=2023-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration&timezone=UTC`;
  const r = await getJSON(url, { signal, timeout: 20000 });
  const d = r.daily; if (!d) return null;
  const acc = Array.from({ length: 12 }, () => ({ tx: 0, tn: 0, rain: 0, sun: 0, n: 0 }));
  for (let i = 0; i < d.time.length; i++) {
    const m = +d.time[i].slice(5, 7) - 1, a = acc[m];
    if (d.temperature_2m_max[i] == null) continue;
    a.tx += d.temperature_2m_max[i]; a.tn += d.temperature_2m_min[i];
    a.rain += (d.precipitation_sum[i] ?? 0) >= 1 ? 1 : 0; a.sun += (d.sunshine_duration[i] ?? 0) / 3600; a.n++;
  }
  const years = 5;
  const months = acc.map(a => a.n ? { tx: a.tx / a.n, tn: a.tn / a.n, rainDays: a.rain / years, sun: a.sun / a.n } : null);
  const score = months.map(m => {
    if (!m) return 0;
    let s = m.tx >= 22 && m.tx <= 31 ? 2 : (m.tx >= 17 && m.tx <= 34 ? 1 : 0);
    if (m.rainDays > 14) s -= 1.2; else if (m.rainDays > 9) s -= 0.6;
    if (m.sun > 8) s += 0.3;
    return Math.max(0, Math.min(2, Math.round(s)));
  });
  return { months, score, elevation: r.elevation };
}
async function weatherNow(lat, lon, signal) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&current=temperature_2m,weather_code,is_day&timezone=auto`;
  return getJSON(url, { signal });
}
const WMO = { 0: ['☀️', 'Ciel dégagé'], 1: ['🌤', 'Peu nuageux'], 2: ['⛅', 'Partiellement nuageux'], 3: ['☁️', 'Couvert'], 45: ['🌫', 'Brouillard'], 48: ['🌫', 'Brouillard'],
  51: ['🌦', 'Bruine'], 53: ['🌦', 'Bruine'], 55: ['🌦', 'Bruine'], 61: ['🌧', 'Pluie'], 63: ['🌧', 'Pluie'], 65: ['🌧', 'Forte pluie'], 71: ['🌨', 'Neige'], 73: ['🌨', 'Neige'],
  75: ['❄️', 'Forte neige'], 80: ['🌦', 'Averses'], 81: ['🌧', 'Averses'], 82: ['⛈', 'Fortes averses'], 95: ['⛈', 'Orage'], 96: ['⛈', 'Orage'], 99: ['⛈', 'Orage'] };

function spread(list, minKm, max) {
  const out = [];
  for (const it of list) {
    if (it.lat != null && out.some(o => o.lat != null && haversine(o.lat, o.lon, it.lat, it.lon) < minKm)) continue;
    out.push(it); if (out.length >= max) break;
  }
  if (out.length < max) for (const it of list) { if (!out.includes(it)) out.push(it); if (out.length >= max) break; }
  return out;
}
const ORG = /association|organisation|entreprise|société|parti politique|journal|équipe|fédération|syndicat|ministère|ambassade|personnalité|famille|groupe|label|festival|émission|film|album|chanson/i;
const ADMIN = /province|commune|région|département|municipalit|circonscription|arrondissement|diocèse|canton|comté|frazione|gare|station|école|lycée|collège|université|entreprise|hôpital|cimetière|club|stade|aéroport|autoroute|route |rue |ligne |tribunal|prison|banque|hôtel de ville|paroisse/i;

/* ============================ Exploration ============================ */
let current = null, reqId = 0, abortCtl = null;
async function explore(lat, lon, opts = {}) {
  const id = ++reqId;
  abortCtl?.abort(); abortCtl = new AbortController();
  const signal = abortCtl.signal;
  placeMarker(lat, lon);
  if (poiMarker) poiMarker.remove();
  if (!opts.noFly) goTo(lat, lon, opts);
  openPanel();
  renderSkeleton(lat, lon, opts.label);
  await loadLocal;

  // 1. Où est-on ?
  let [geo, local] = await Promise.all([opts.geo || reverseGeocode(lat, lon, signal), placesAround(lat, lon, 40)]);
  if (id !== reqId) return;
  let redirect = null;
  if (!geo || (!geo.city && !geo.county && !geo.state && geo.type !== 'city')) {
    // en mer ou zone vide : on part vers la destination notable la plus proche
    const best = await bestDestination(lat, lon);
    if (id !== reqId) return;
    if (best) {
      const bp = best.p;
      redirect = `Pas grand-chose ici${geo ? '' : ' (en pleine mer)'}. Destination la plus proche : <b>${esc(pname(bp))}</b> (${esc(KIND_LABEL[kindOf(bp)] || kindOf(bp))}), à ${Math.round(best.d)} km.`;
      lat = bp[5]; lon = bp[6];
      opts.hint = pname(bp);
      placeMarker(lat, lon); goTo(lat, lon, { zoom: Math.max(map.getZoom(), kindOf(bp) === 'ile' ? 10 : 9) });
      [geo, local] = await Promise.all([reverseGeocode(lat, lon, signal), placesAround(lat, lon, 40)]);
      geo = geo || { name: pname(bp), state: bp[4], countrycode: bp[3] };
      if (id !== reqId) return;
    }
  }
  geo = geo || {};
  const near = local[0] ? { p: local[0].p, d: local[0].d } : null;
  const cc = (geo.countrycode || near?.p[3] || '').toUpperCase();
  const ci = countryInfo(cc);
  const placeName = opts.hint || (['city', 'town', 'village'].includes(geo.osm_value) || geo.type === 'city' ? geo.name : null) || geo.city || geo.name || (near && pname(near.p)) || 'Lieu inconnu';
  const country = ci?.name || geo.country || '';
  // l'entrée de la base qui correspond au lieu donne le titre exact de l'article Wikipédia
  const np = norm(placeName);
  const match = local.find(x => x.d < 25 && (norm(x.p[0]) === np || norm(x.p[1]) === np));
  const wikiTitle = match?.p[8] ? match.p[8].replace(/_/g, ' ') : null;
  const around = local.filter(x => x !== match && norm(pname(x.p)) !== np && x.d > 0.3)
    .map(x => ({ ...x, s: notability(x.p) - x.d / 12 })).sort((a, b) => b.s - a.s).slice(0, 8);
  current = { lat, lon, name: placeName, country, cc, region: geo.state || match?.p[4] || '', ci, redirect, photos: [], climate: null, wiki: null, voy: null,
    around, pop: match?.p[7] || 0 };
  renderPanel();

  // 2. Infos en parallèle, affichées au fil de l'eau
  const titles = [wikiTitle, opts.hint, placeName, geo.city, geo.county, geo.state, country];
  const jobs = [
    wikiPages(WIKI, titles, signal).then(pages => {
      const ok = pages.find(p => !p.coordinates || haversine(lat, lon, p.coordinates[0].lat, p.coordinates[0].lon) < (p.title === country ? 3000 : 120));
      current.wiki = ok || null;
    }).catch(() => {}),
    wikiPages(WIKIVOY, titles, signal, false).then(pages => {
      current.voy = pages.find(p => (p.extract || '').length > 60) || null;
    }).catch(() => {}),
    wikiNearby(lat, lon, signal).catch(() => []).then(async list => {
      list = list.filter(p => p.title !== placeName && p.title !== current.wiki?.title);
      current.nearby = list.slice(0, 8);
      const fromWiki = list.filter(p => p.big && !/\.(svg|png)/i.test(p.big)).slice(0, 12)
        .map(p => ({ src: p.big, thumb: p.big.replace(/\/\d+px-/, '/500px-'), page: p.url, title: p.title, credit: 'Image de l’article Wikipédia' }));
      current.photos = fromWiki;
      if (id === reqId) renderPanel();
      if (fromWiki.length < 9) {
        const more = await commonsPhotos(lat, lon, signal).catch(() => []);
        current.photos = fromWiki.concat(more).slice(0, 12);
      }
    }),
    climate(lat, lon, signal).then(c => { current.climate = c; }).catch(() => { current.climate = false; }),
    weatherNow(lat, lon, signal).then(w => { current.weather = w; }).catch(() => {})
  ];
  for (const j of jobs) j.then(() => { if (id === reqId) renderPanel(); });
  await Promise.allSettled(jobs);
  if (id === reqId) { current.done = true; renderPanel(); }
}

/* ============================ Panneau ============================ */
const panel = $('#panel');
function openPanel() { panel.classList.add('open'); }
function closePanel() { panel.classList.remove('open'); wpMarker?.remove(); poiMarker?.remove(); abortCtl?.abort(); reqId++; }
$('#pClose').onclick = closePanel;
function renderSkeleton(lat, lon, label) {
  $('#pBody').innerHTML = `<div class="hero"><div class="kicker">${esc(fmtLL(lat, lon))}</div><h2>${esc(label || 'Analyse…')}</h2><div class="sub">Recherche des infos de voyage</div></div>
    <div class="sec"><div class="skel" style="width:90%"></div><div class="skel" style="width:75%"></div><div class="skel" style="width:85%"></div><div class="skel" style="width:55%"></div></div>`;
  $('#pActions').innerHTML = '';
}
const MOIS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MOIS_L = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function bestMonthsText(score) {
  const best = score.map((s, i) => s === 2 ? i : -1).filter(i => i >= 0);
  if (!best.length) { const ok = score.map((s, i) => s >= 1 ? i : -1).filter(i => i >= 0); return ok.length ? 'Correct de ' + ranges(ok) + '. Pas de mois idéal côté météo.' : 'Climat rude toute l’année : vérifie la saison selon tes envies (ski, désert…).'; }
  return 'Idéal : ' + ranges(best) + '.';
}
function ranges(arr) {
  const out = []; let s = arr[0], p = arr[0];
  for (let k = 1; k <= arr.length; k++) {
    if (arr[k] === p + 1) { p = arr[k]; continue; }
    out.push(s === p ? MOIS_L[s] : `${MOIS_L[s]} à ${MOIS_L[p]}`); s = p = arr[k];
  }
  return out.join(', ');
}
function clip(t, n) {
  if (t.length <= n) return t;
  const cut = t.slice(0, n); const i = cut.lastIndexOf('. ');
  return (i > n * 0.5 ? cut.slice(0, i + 1) : cut + '…').replace(/\s*\([^)]*$/, '');
}
function heroImage() {
  return current.wiki?.original?.source && /\.jpe?g$/i.test(current.wiki.original.source) && current.wiki.original.width >= 600 ? current.wiki.thumbnail?.source || current.wiki.original.source
    : current.photos[0]?.src || current.wiki?.thumbnail?.source || '';
}
function renderPanel() {
  const c = current; if (!c) return;
  const img = heroImage();
  const w = c.weather?.current;
  const wx = w ? WMO[w.weather_code] || ['🌡', ''] : null;
  let decal = '';
  if (c.weather?.utc_offset_seconds != null) {
    const diff = Math.round((c.weather.utc_offset_seconds / 60 + new Date().getTimezoneOffset()) / 60 * 2) / 2;
    const local = new Date(Date.now() + (c.weather.utc_offset_seconds + new Date().getTimezoneOffset() * 60) * 1000);
    decal = `${local.getHours().toString().padStart(2, '0')}:${local.getMinutes().toString().padStart(2, '0')} sur place · ${diff === 0 ? 'même heure que toi' : (diff > 0 ? '+' : '') + diff + ' h'}`;
  }
  const voyText = c.voy?.extract ? c.voy.extract.split('\n').filter(s => s.trim().length > 30).slice(0, 2).join('\n\n') : '';
  const wikiText = c.wiki?.extract ? clip(c.wiki.extract.split('\n').filter(s => s.trim())[0] || '', 520) : '';
  const clim = c.climate;
  const q = encodeURIComponent(c.name + (c.country ? ', ' + c.country : ''));
  $('#pBody').innerHTML = `
    <div class="hero">${img ? `<img class="bg" src="${esc(img)}" alt="" referrerpolicy="no-referrer">` : ''}
      <div class="kicker">${esc(c.ci?.flag || '')} ${esc(c.country)}${c.region && c.region !== c.name ? ' · ' + esc(c.region) : ''}</div>
      <h2>${esc(c.name)}</h2>
      <div class="sub">${esc(fmtLL(c.lat, c.lon))}${clim?.elevation != null ? ' · ' + Math.round(clim.elevation) + ' m' : ''}</div>
      ${wx ? `<div class="wx"><b>${wx[0]} ${Math.round(w.temperature_2m)}°</b><span>${esc(wx[1])} en ce moment</span></div>` : ''}
    </div>
    ${c.redirect ? `<div class="redir">📍 ${c.redirect}</div>` : ''}
    <div class="sec">
      ${voyText ? `<p class="lead">${esc(voyText.split('\n\n')[0])}</p>${voyText.split('\n\n')[1] ? `<p>${esc(voyText.split('\n\n')[1])}</p>` : ''}<p class="src">Source : <a href="${esc(c.voy.fullurl)}" target="_blank" rel="noopener">Wikivoyage</a></p>` : ''}
      ${wikiText ? `<p>${esc(wikiText)}</p><p class="src">Source : <a href="${esc(c.wiki.fullurl)}" target="_blank" rel="noopener">Wikipédia</a></p>` : ''}
      ${!voyText && !wikiText ? (c.done ? '<p class="muted">Pas de description trouvée pour ce lieu précis. Regarde les lieux à voir autour ou clique sur la ville la plus proche.</p>' : '<div class="skel" style="width:90%"></div><div class="skel" style="width:70%"></div>') : ''}
    </div>
    <div class="sec"><h3>Quand partir</h3>
      ${clim ? `<div class="months">${clim.score.map((s, i) => `<div><i class="s${s}" title="${MOIS_L[i]}"></i>${MOIS[i]}</div>`).join('')}</div>
        <div class="legend"><span><i style="background:var(--acc2)"></i>Idéal</span><span><i style="background:#8a6b1f"></i>Correct</span><span><i style="background:#2a2f37"></i>Bof</span></div>
        <p>${esc(bestMonthsText(clim.score))}</p>
        <table class="clim"><tr><td class="l"></td>${MOIS.map(m => `<th>${m}</th>`).join('')}</tr>
          <tr><td class="l">Max °C</td>${clim.months.map(m => `<td class="${m && m.tx >= 28 ? 'hot' : m && m.tx < 10 ? 'cold' : ''}">${m ? Math.round(m.tx) : '–'}</td>`).join('')}</tr>
          <tr><td class="l">Min °C</td>${clim.months.map(m => `<td>${m ? Math.round(m.tn) : '–'}</td>`).join('')}</tr>
          <tr><td class="l">Jours pluie</td>${clim.months.map(m => `<td>${m ? Math.round(m.rainDays) : '–'}</td>`).join('')}</tr>
          <tr><td class="l">Soleil h/j</td>${clim.months.map(m => `<td>${m ? Math.round(m.sun) : '–'}</td>`).join('')}</tr></table>
        <p class="src" style="margin-top:6px">Moyennes 2019-2023, <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></p>`
      : clim === false ? '<p class="muted">Climat indisponible pour ce point.</p>' : '<div class="skel" style="width:100%;height:40px"></div>'}
    </div>
    ${c.photos.length ? `<div class="sec"><h3>Photos</h3><div class="gallery">${c.photos.slice(0, 9).map((p, i) => `<button data-ph="${i}"><img src="${esc(p.thumb)}" alt="${esc(p.title)}" loading="lazy" referrerpolicy="no-referrer"></button>`).join('')}</div>
      <p class="src" style="margin-top:6px">Lieux dans un rayon de 10 km · <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener">Wikimedia Commons</a></p></div>` : ''}
    ${c.nearby?.length ? `<div class="sec"><h3>À voir autour</h3>${c.nearby.map((p, i) => `<button class="poi" data-poi="${i}">${p.thumb ? `<img src="${esc(p.thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '<span class="ph">📍</span>'}<span><b>${esc(p.title)}</b><small>${esc(p.desc)}</small><em>${p.d < 1 ? Math.round(p.d * 1000) + ' m' : p.d.toFixed(1) + ' km'}</em></span></button>`).join('')}</div>` : ''}
    ${c.around?.length ? `<div class="sec"><h3>Villes, villages et sites proches</h3>${c.around.map((x, i) => `<button class="poi" data-near="${i}"><span class="ph">${KIND_ICON[kindOf(x.p)] || '📍'}</span><span><b>${esc(pname(x.p))}</b><small>${esc(KIND_LABEL[kindOf(x.p)] || kindOf(x.p))}${x.p[7] ? ' · ' + x.p[7].toLocaleString('fr-FR') + ' hab.' : ''}</small><em>${x.d < 1 ? Math.round(x.d * 1000) + ' m' : x.d.toFixed(1) + ' km'}</em></span></button>`).join('')}</div>` : ''}
    <div class="sec"><h3>Infos pratiques</h3><div class="grid2">
      ${c.ci ? `<div class="stat"><span>Monnaie</span><b>${esc(c.ci.cur || '—')}</b></div><div class="stat"><span>Langue</span><b>${esc(c.ci.lang || '—')}</b></div>` : ''}
      ${c.pop ? `<div class="stat" style="grid-column:1/-1"><span>Population</span><b>${c.pop.toLocaleString('fr-FR')} habitants</b></div>` : ''}
      ${decal ? `<div class="stat" style="grid-column:1/-1"><span>Heure locale</span><b>${esc(decal)}</b></div>` : ''}
      ${c.ci?.cap ? `<div class="stat" style="grid-column:1/-1"><span>Capitale du pays</span><b>${esc(c.ci.cap)}</b></div>` : ''}
    </div></div>
    <div class="sec"><h3>Préparer le voyage</h3><div class="links">
      <a href="https://www.google.com/travel/flights?q=${encodeURIComponent('Vols vers ' + c.name)}" target="_blank" rel="noopener">✈ Vols</a>
      <a href="https://www.booking.com/searchresults.fr.html?ss=${q}" target="_blank" rel="noopener">🛏 Hébergement</a>
      <a href="https://fr.wikivoyage.org/w/index.php?search=${encodeURIComponent(c.name)}" target="_blank" rel="noopener">🧭 Guide Wikivoyage</a>
      <a href="https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lon}" target="_blank" rel="noopener">🗺 Google Maps</a>
      <a href="https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/" target="_blank" rel="noopener">🛂 Conseils aux voyageurs</a>
    </div></div>`;
  $('#pBody').querySelectorAll('[data-ph]').forEach(b => b.onclick = () => openViewer(+b.dataset.ph));
  $('#pBody').querySelectorAll('[data-near]').forEach(b => b.onclick = () => {
    const x = c.around[+b.dataset.near];
    explore(x.p[5], x.p[6], { hint: pname(x.p), label: pname(x.p), zoom: kindOf(x.p) === 'village' ? 13 : 12 });
  });
  $('#pBody').querySelectorAll('[data-poi]').forEach(b => b.onclick = () => {
    const p = c.nearby[+b.dataset.poi];
    placePoi(p.lat, p.lon);
    map.flyTo({ center: [p.lon, p.lat], zoom: 16.3, pitch: 62, bearing: map.getBearing() - 20, padding: panelPadding(), duration: 2600, essential: true });
  });
  renderActions();
}

/* ============================ Visionneuse ============================ */
let vIdx = 0;
function openViewer(i) { vIdx = i; showViewer(); $('#viewer').classList.add('open'); }
function showViewer() {
  const p = current.photos[vIdx]; if (!p) return;
  $('#vImg').src = p.src; $('#vImg').referrerPolicy = 'no-referrer';
  $('#vCap').innerHTML = `${esc(p.title)}<br>${esc(p.credit)} · <a href="${esc(p.page)}" target="_blank" rel="noopener">source et licence</a>`;
}
$('#vClose').onclick = () => $('#viewer').classList.remove('open');
$('#vPrev').onclick = () => { vIdx = (vIdx - 1 + current.photos.length) % current.photos.length; showViewer(); };
$('#vNext').onclick = () => { vIdx = (vIdx + 1) % current.photos.length; showViewer(); };
$('#viewer').onclick = e => { if (e.target.id === 'viewer') $('#viewer').classList.remove('open'); };

/* ============================ Favoris ============================ */
const favs = new Map(Object.entries(LS.get('esc.web.favs', {})));
const favKey = c => norm(c.name + '-' + c.country).replace(/[^a-z0-9]+/g, '-');
function saveFavs() { LS.set('esc.web.favs', Object.fromEntries(favs)); $('#favCount').textContent = favs.size; }
function renderActions() {
  const c = current; if (!c) return;
  const on = favs.has(favKey(c));
  $('#pActions').innerHTML = `<button class="btn fav ${on ? 'on' : ''}" id="aFav">${on ? '✓ Dans mes destinations' : '★ Ajouter à mes destinations'}</button>`;
  $('#aFav').onclick = () => {
    const k = favKey(c);
    if (favs.has(k)) { favs.delete(k); toast('Retiré de tes destinations'); }
    else {
      const cm = c.climate?.months?.filter(Boolean) || [];
      favs.set(k, { name: c.name, country: c.country, flag: c.ci?.flag || '', lat: c.lat, lon: c.lon, img: c.photos[0]?.thumb || c.wiki?.thumbnail?.source || '',
        score: c.climate?.score || null, tmax: cm.length ? Math.round(Math.max(...cm.map(m => m.tx))) : null, tmin: cm.length ? Math.round(Math.min(...cm.map(m => m.tn))) : null,
        added: Date.now() });
      toast('★ Ajouté à tes destinations');
    }
    saveFavs(); renderActions();
  };
}
function renderFavs() {
  const arr = [...favs.entries()].sort((a, b) => b[1].added - a[1].added);
  if (!arr.length) { $('#fBody').innerHTML = '<div class="empty">Aucune destination pour l’instant. Clique sur la carte, puis sur « ★ Ajouter à mes destinations ».</div>'; return; }
  const m = new Date().getMonth();
  $('#fBody').innerHTML = `<div style="overflow-x:auto"><table class="cmp"><thead><tr><th>Destination</th><th>Météo par mois</th><th>Ce mois-ci</th><th>Températures</th><th></th></tr></thead><tbody>
    ${arr.map(([k, d]) => `<tr><td class="name" data-k="${esc(k)}">${d.img ? `<img src="${esc(d.img)}" alt="" referrerpolicy="no-referrer">` : ''}<span><b>${esc(d.flag)} ${esc(d.name)}</b><small>${esc(d.country)}</small></span></td>
      <td>${d.score ? `<div class="mini">${d.score.map(s => `<i class="s${s}"></i>`).join('')}</div>` : '—'}</td>
      <td>${d.score ? ['😕 Bof', '🙂 Correct', '😎 Idéal'][d.score[m]] : '—'}</td>
      <td>${d.tmin != null ? `${d.tmin}° à ${d.tmax}°` : '—'}</td>
      <td><button class="rm" data-rm="${esc(k)}" title="Retirer">✕</button></td></tr>`).join('')}
    </tbody></table></div>`;
  $('#fBody').querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { favs.delete(b.dataset.rm); saveFavs(); renderFavs(); });
  $('#fBody').querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const d = favs.get(b.dataset.k); $('#favs').classList.remove('open'); explore(d.lat, d.lon, { hint: d.name }); });
}
$('#bFavs').onclick = () => { renderFavs(); $('#favs').classList.add('open'); };
$('#fClose').onclick = () => $('#favs').classList.remove('open');
$('#favs').onclick = e => { if (e.target.id === 'favs') $('#favs').classList.remove('open'); };
saveFavs();

/* ============================ Recherche ============================ */
const q = $('#q'), sugg = $('#sugg');
let results = [], sel = -1, searchT, searchCtl;
q.addEventListener('input', () => {
  clearTimeout(searchT);
  const s = q.value.trim();
  if (s.length < 2) { sugg.style.display = 'none'; return; }
  searchT = setTimeout(async () => {
    searchCtl?.abort(); searchCtl = new AbortController();
    try {
      const r = await getJSON(`https://photon.komoot.io/api?q=${encodeURIComponent(s)}&lang=fr&limit=7`, { signal: searchCtl.signal });
      results = (r.features || []).map(f => ({ p: f.properties, lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] }));
    } catch { results = []; }
    if (!results.length) {
      const n = norm(s), top = await loadTop();
      results = top.filter(p => norm(p[0]).startsWith(n) || norm(p[1]).startsWith(n)).slice(0, 7)
        .map(p => ({ p: { name: pname(p), state: p[4], country: countryInfo(p[3])?.name || p[3], type: kindOf(p) === 'ville' || kindOf(p) === 'capitale' ? 'city' : 'poi' }, lat: p[5], lon: p[6] }));
    }
    sel = -1;
    sugg.innerHTML = results.map((r, i) => `<button data-i="${i}">${esc(r.p.name)}<small>${esc([r.p.state, r.p.country].filter(x => x && x !== r.p.name).join(', '))}</small></button>`).join('');
    sugg.style.display = results.length ? 'block' : 'none';
    sugg.querySelectorAll('button').forEach(b => b.onclick = () => choose(results[+b.dataset.i]));
  }, 250);
});
q.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault(); sel = Math.max(0, Math.min(results.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1)));
    sugg.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === sel));
  } else if (e.key === 'Enter' && results.length) choose(results[Math.max(0, sel)]);
  else if (e.key === 'Escape') { sugg.style.display = 'none'; q.blur(); }
});
function choose(r) {
  sugg.style.display = 'none'; q.value = r.p.name; q.blur();
  const t = r.p.osm_value || r.p.type;
  const zoom = t === 'country' ? 5 : t === 'state' ? 7 : ['city', 'town'].includes(t) ? 11 : 14;
  explore(r.lat, r.lon, { zoom, hint: r.p.name, label: r.p.name, pitch: zoom >= 11 ? 50 : 0 });
}

/* ============================ Boutons ============================ */
async function randomTrip() {
  const top = await loadTop();
  if (!top.length) return;
  // tirage pondéré par la notoriété : surtout des lieux connus, parfois une pépite
  const w = top.map(p => Math.sqrt(p[9] + 1));
  let r = Math.random() * w.reduce((a, b) => a + b, 0), i = 0;
  while ((r -= w[i]) > 0 && i < top.length - 1) i++;
  const p = top[i];
  explore(p[5], p[6], { hint: pname(p), label: pname(p), zoom: ['ville', 'capitale'].includes(kindOf(p)) ? 11 : 12 });
}
$('#bRandom').onclick = randomTrip;
$('#b3d').onclick = () => {
  const tilted = map.getPitch() > 10;
  map.easeTo({ pitch: tilted ? 0 : 60, bearing: tilted ? 0 : map.getBearing() - 20, zoom: tilted ? map.getZoom() : Math.max(map.getZoom(), 14), duration: 1400 });
};
$('#bRelief').onclick = () => {
  relief = !relief;
  map.setTerrain(relief ? { source: 'dem3d', exaggeration: 1.4 } : null);
  $('#bRelief').classList.toggle('on', relief);
  if (relief && map.getPitch() < 30) map.easeTo({ pitch: 60, duration: 1200 });
  toast(relief ? 'Relief 3D activé : incline la vue pour voir les montagnes' : 'Relief 3D désactivé');
};
/* ---- jour / nuit et style ---- */
let lastBucket = timeBucket();
function refreshDayNight(force) {
  if (!map?.getSource('night')) return;
  map.getSource('night').setData(dayNight ? nightGrid() : { type: 'FeatureCollection', features: [] });
  if (force || timeBucket() !== lastBucket) {
    lastBucket = timeBucket();
    for (const [id, kind] of [['sat', 'sat'], ['cartoon', 'cartoon'], ['lights', 'lights']]) map.getSource(id)?.setTiles([`dn://${kind}/{z}/{x}/{y}` + dnParams()]);
  }
}
setInterval(() => refreshDayNight(false), 60000);
function syncButtons() {
  $('#bSun').textContent = dayNight ? '🌗 Jour/nuit : réel' : '☀️ Toujours jour';
  $('#bSun').classList.toggle('on', dayNight);
  $('#bStyle').textContent = styleMode === 'realiste' ? '🎨 Style cartoon' : '🛰 Style réaliste';
}
$('#bSun').onclick = () => {
  dayNight = !dayNight; LS.set('esc.web.daynight', dayNight); syncButtons(); refreshDayNight(true);
  toast(dayNight ? 'Jour et nuit en temps réel' : 'Toujours en plein jour');
};
$('#bStyle').onclick = async () => {
  styleMode = styleMode === 'realiste' ? 'cartoon' : 'realiste'; LS.set('esc.web.style', styleMode); syncButtons();
  toast(styleMode === 'realiste' ? 'Vue satellite réaliste' : 'Vue cartoon');
  map.setStyle(await buildStyle(styleMode));
  if (relief) map.once('style.load', () => map.setTerrain({ source: 'dem3d', exaggeration: 1.4 }));
};
syncButtons();
$('#bGlobe').onclick = () => { closePanel(); map.flyTo({ center: map.getCenter(), zoom: isMobile ? 1.0 : 2.0, pitch: 0, bearing: 0, duration: 2600, padding: { top: 0, bottom: 0, left: 0, right: 0 } }); };
addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'Escape') { if ($('#viewer').classList.contains('open')) $('#viewer').classList.remove('open'); else if ($('#favs').classList.contains('open')) $('#favs').classList.remove('open'); else closePanel(); }
  if ($('#viewer').classList.contains('open')) { if (e.key === 'ArrowLeft') $('#vPrev').click(); if (e.key === 'ArrowRight') $('#vNext').click(); return; }
  if (e.key === 'r' || e.key === 'R') randomTrip();
});

initMap().catch(err => {
  console.error(err);
  $('#loading').innerHTML = `<div class="logo">Esca<span>pade</span></div><p style="color:#ccc;font-family:var(--hud);letter-spacing:.06em">Impossible de charger la carte (${esc(err.message)}). Vérifie ta connexion et recharge la page.</p>`;
});
