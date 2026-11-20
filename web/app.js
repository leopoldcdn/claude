/* Escapade — globe MapLibre + fiches destination à partir de sources ouvertes.
 * Carte : OpenFreeMap (OpenStreetMap / OpenMapTiles), relief : Terrain Tiles (AWS Open Data)
 * Infos : Photon (géocodage), Wikipédia, Wikivoyage, Wikimedia Commons, Open-Meteo
 */
import { registerProtocol, setCartoonBase } from './sun.js';
import { initItinerary, openPlanner, clearTrip, redrawAfterStyle, replan, geocodeCity } from './itinerary.js';
import { initDiscover, seasonPicks, searchSummary, openDiscover, clearDiscover, redrawDiscover, discoverActive, backToResults, decodeState, hitDestination } from './discover.js';
import { I } from './icons.js';
import { initTransit } from './transit.js';
import { initProfile, openProfile, getProfile, firstName, syncProfileButton } from './profile.js';
const $ = s => document.querySelector(s);
document.querySelectorAll('[data-i]').forEach(el => el.insertAdjacentHTML('afterbegin', I[el.dataset.i] || ''));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const DEG = Math.PI / 180;
const mqMobile = matchMedia('(max-width:760px)');
const isMobile = () => mqMobile.matches;          // recalculé à chaque usage : suit la rotation et le redimensionnement
const storageOk = (() => { try { localStorage.setItem('esc.t', '1'); localStorage.removeItem('esc.t'); return true; } catch { return false; } })();
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
    // Wikimedia demande aux applications de s'identifier (en-tête autorisé par leur politique CORS)
    const headers = /wiki(pedia|voyage|media)\.org/.test(url) ? { 'Api-User-Agent': 'Escapade/1.0 (site de voyage, globe 3D)' } : undefined;
    const r = await fetch(url, { signal: ctl.signal, headers });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}
let toastT;
function toast(m) { const t = $('#toast'); t.textContent = m.replace(/^[★✓]\s*/, ''); t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400); }

/* ============================ Style de carte "cartoon" ============================ */
const BASE = new URL('.', location.href).href;
// nom français, sinon transcription latine (évite le cyrillique, le thaï… quand le français manque)
const NAME_FR = ['coalesce', ['get', 'name:fr'], ['get', 'name_int'], ['get', 'name:latin'], ['get', 'name']];
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
/* ---- style réaliste ----
 * De loin : image satellite, routes discrètes, peu de noms.
 * De près (zoom 12 → 14,5) : l'image satellite, floue à cette échelle, s'efface au profit d'un plan net
 * aux couleurs douces, avec les bâtiments en 3D. Les textes passent du blanc au gris foncé en même temps. */
const Z0 = 12, Z1 = 14.5;
const fadeIn = v => ['interpolate', ['linear'], ['zoom'], Z0, 0, Z1, v];
const byZoom = (a, b) => ['interpolate', ['linear'], ['zoom'], Z0, a, Z1, b];
const PLAN = {
  background: '#f3efe7', water: '#a9d3ec', park: '#cfe5bd', wood: '#bddcaa', grass: '#d6eac3', sand: '#f3e6c0', ice: '#f7fbfd',
  residential: '#ece6da', building: '#e3dccf', pitch: '#cde7c2', cemetery: '#d9e4cf', hospital: '#f4dcdc', school: '#f2e9d4', aeroway: '#e4e0d8',
};
const LABEL_MINZOOM = { label_village: 11.5, label_other: 13, poi_r1: 15.5, poi_r7: 17, poi_r20: 18, poi_transit: 16, airport: 9,
  'highway-name-major': 14, 'highway-name-minor': 15.5, 'highway-name-path': 16.5, 'highway-shield-non-us': 9, 'highway-shield-us-interstate': 8, road_shield_us: 9,
  water_name_line_label: 11, waterway_line_label: 12, label_state: 5 };
function realisticLayer(l) {
  const id = l.id;
  if (/^(natural_earth|road_area_pattern|park_outline|road_one_way)/.test(id)) return null;
  if (id === 'background') { l.paint = { 'background-color': byZoom('#1d4f6b', PLAN.background) }; return l; }   // bleu océan tant que le satellite charge
  // surfaces du plan, qui apparaissent en zoomant
  const fill = { water: PLAN.water, park: PLAN.park, landcover_wood: PLAN.wood, landcover_grass: PLAN.grass, landcover_sand: PLAN.sand,
    landcover_ice: PLAN.ice, landcover_wetland: PLAN.grass, landuse_residential: PLAN.residential, landuse_pitch: PLAN.pitch, landuse_track: PLAN.pitch,
    landuse_cemetery: PLAN.cemetery, landuse_hospital: PLAN.hospital, landuse_school: PLAN.school, aeroway_fill: PLAN.aeroway, building: PLAN.building }[id];
  if (fill) {
    l.paint = { 'fill-color': fill, 'fill-opacity': fadeIn(id === 'water' ? 1 : 0.95), 'fill-antialias': true };
    if (id === 'building') { l.minzoom = 13; l.maxzoom = 15; }
    return l;
  }
  if (l.type === 'line' && /^waterway_/.test(id)) { l.paint = { ...l.paint, 'line-color': PLAN.water, 'line-opacity': fadeIn(1) }; return l; }
  if (/^aeroway_(runway|taxiway)/.test(id)) { l.paint = { ...l.paint, 'line-color': '#ffffff', 'line-opacity': byZoom(0.35, 1) }; return l; }
  // routes : traits fins et translucides sur le satellite, puis plan classique
  if (l.type === 'line' && /^(road|bridge|tunnel)_/.test(id)) {
    const casing = /casing/.test(id), motorway = /motorway/.test(id), major = /trunk_primary|motorway/.test(id);
    const minor = /minor|service|track|path|pedestrian|link/.test(id), rail = /rail/.test(id);
    if (rail) { l.paint = { ...l.paint, 'line-opacity': byZoom(0, 0.6) }; return l; }
    if (casing) l.paint = { ...l.paint, 'line-color': motorway ? '#e0a95e' : '#d7cfbf', 'line-opacity': fadeIn(1) };
    else l.paint = { ...l.paint,
      'line-color': motorway ? byZoom('rgba(255,222,170,0.85)', '#ffd68a') : byZoom('rgba(255,255,255,0.75)', '#ffffff'),
      'line-opacity': minor ? ['interpolate', ['linear'], ['zoom'], 12.5, 0, 13.5, 1]
        : ['interpolate', ['linear'], ['zoom'], 5, major ? 0.55 : 0, 9, major ? 0.6 : 0.3, Z1, 1] };
    if (/^tunnel_/.test(id)) l.paint['line-opacity'] = fadeIn(0.5);
    return l;
  }
  if (/^boundary/.test(id)) {
    l.paint = { ...l.paint, 'line-color': byZoom('rgba(255,255,255,0.6)', '#a89bc4'), 'line-dasharray': id === 'boundary_2' ? [1, 0] : [2, 2] };
    return l;
  }
  if (id === 'building-3d') {
    l.paint = { ...l.paint, 'fill-extrusion-color': ['interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 0], 0, '#ece6da', 60, '#e2dacb', 200, '#d4cab8'],
      'fill-extrusion-opacity': 0.95, 'fill-extrusion-vertical-gradient': true };
    return l;
  }
  if (l.type === 'symbol') {
    if (LABEL_MINZOOM[id] != null) l.minzoom = Math.max(l.minzoom || 0, LABEL_MINZOOM[id]);
    if (/shield/.test(id)) return l;
    const water = /^water|waterway/.test(id), poi = /^poi_|airport/.test(id);
    // petits libellés (commerces, rues, quartiers) : rien plutôt qu'un alphabet illisible
    const small = poi || /^highway-name|^label_other|^label_village/.test(id);
    if (l.layout?.['text-field'] && JSON.stringify(l.layout['text-field']).includes('name'))
      l.layout['text-field'] = small ? ['coalesce', ['get', 'name:fr'], ['get', 'name_en'], ['get', 'name:en'], ''] : NAME_FR;
    l.paint = { ...l.paint,
      'text-color': water ? byZoom('#cfe9ff', '#3a7cab') : poi ? '#5b5f66' : byZoom('#ffffff', '#30343b'),
      'text-halo-color': byZoom('rgba(5,10,20,0.6)', 'rgba(255,255,255,0.92)'), 'text-halo-width': 1.3, 'text-halo-blur': 0.6 };
    if (/^label_country/.test(id)) {
      l.layout['text-transform'] = 'uppercase'; l.layout['text-letter-spacing'] = 0.12;
      l.paint['text-color'] = 'rgba(255,255,255,0.88)';
    }
    if (/^label_(city|city_capital)$/.test(id)) l.layout['icon-image'] = '';
    if (/^label_(town|village|other|state)$/.test(id)) l.layout['icon-image'] = '';
    if (/^label_state$/.test(id)) { l.layout['text-transform'] = 'uppercase'; l.layout['text-letter-spacing'] = 0.15; l.paint['text-color'] = 'rgba(255,255,255,0.55)'; }
  }
  return l;
}
let styleMode = LS.get('esc.web.style', 'realiste');
// le globe est toujours en plein jour : les tuiles de fond sont servies sans ombre de nuit
const dnParams = () => '?on=0';
async function buildStyle(mode = styleMode) {
  const style = await getJSON('https://tiles.openfreemap.org/styles/liberty', { timeout: 20000 });
  delete style.sources.ne2_shaded;
  style.sources.cartoon = { type: 'raster', tiles: ['dn://cartoon/{z}/{x}/{y}' + dnParams()], tileSize: 512, maxzoom: 4,
    attribution: 'Globe : NASA Blue Marble, Natural Earth' };
  style.sources.sat = { type: 'raster', tiles: ['dn://sat/{z}/{x}/{y}' + dnParams()], tileSize: 256, maxzoom: 15,
    attribution: '<a href="https://s2maps.eu">Sentinel-2 cloudless</a> by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)' };
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
      if (l.id === 'background') layers.push({ id: 'sat', type: 'raster', source: 'sat',
        paint: { 'raster-fade-duration': 150, 'raster-resampling': 'linear', 'raster-opacity': byZoom(1, 0), 'raster-saturation': 0.08, 'raster-contrast': 0.06 } });
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
    }
    layers.push(l);
  }
  style.layers = layers;
  finishStyle(style, mode);
  return style;
}
/* ---- polices de la carte : Inter (noms) et Fraunces italique (mers, fleuves) ----
 * Glyphes fabriqués par tools/build_glyphs.mjs ; pour les écritures absentes (thaï, chinois…),
 * le protocole « glyph » se rabat sur la police Noto d'OpenFreeMap. */
const LOCAL_FONTS = { 'Inter Medium': 'Noto Sans Regular', 'Inter SemiBold': 'Noto Sans Bold', 'Fraunces Italic': 'Noto Sans Italic' };
maplibregl.addProtocol('glyph', async (params, ctl) => {
  const [, stack, range] = params.url.match(/^glyph:\/\/([^/]+)\/(.+)$/);
  const font = decodeURIComponent(stack).split(',')[0];
  if (LOCAL_FONTS[font]) {
    const r = await fetch(`${BASE}fonts/${encodeURIComponent(font)}/${range}.pbf`, { signal: ctl.signal });
    if (r.ok) return { data: await r.arrayBuffer() };
  }
  const r = await fetch(`https://tiles.openfreemap.org/fonts/${encodeURIComponent(LOCAL_FONTS[font] || font)}/${range}.pbf`, { signal: ctl.signal });
  if (!r.ok) throw new Error('glyphes ' + r.status);
  return { data: await r.arrayBuffer() };
});
function applyFonts(l, mode) {
  if (l.type !== 'symbol' || !l.layout?.['text-field'] || /shield/.test(l.id)) return;
  const id = l.id, water = /^water_name|^waterway_line_label/.test(id);
  const sizeBy = (a, b, c, d) => ['interpolate', ['linear'], ['zoom'], a, b, c, d];
  l.layout['text-font'] = [water ? 'Fraunces Italic' : /^label_(country|city|city_capital|state)/.test(id) ? 'Inter SemiBold' : 'Inter Medium'];
  l.layout['text-letter-spacing'] = 0.02;
  if (water) {
    l.layout['text-transform'] = 'none'; l.layout['text-letter-spacing'] = 0.06;
    if (id === 'water_name_point_label') l.layout['text-size'] = sizeBy(1, 13, 6, 18);
  }
  if (/^label_country/.test(id)) {
    l.layout['text-transform'] = 'uppercase'; l.layout['text-letter-spacing'] = 0.16;
    l.layout['text-size'] = id === 'label_country_1' ? sizeBy(1, 10.5, 5, 15) : id === 'label_country_2' ? sizeBy(2, 9.5, 6, 14) : sizeBy(3, 9, 7, 13);
    l.layout['text-max-width'] = 7;
  }
  if (id === 'label_state') { l.layout['text-transform'] = 'uppercase'; l.layout['text-letter-spacing'] = 0.2; l.layout['text-size'] = sizeBy(4, 9, 8, 12); }
  if (id === 'label_city_capital') l.layout['text-size'] = sizeBy(3, 12, 10, 19);
  if (id === 'label_city') l.layout['text-size'] = sizeBy(3, 11, 10, 17);
  if (id === 'label_other') { l.layout['text-transform'] = 'uppercase'; l.layout['text-letter-spacing'] = 0.14; l.layout['text-size'] = 10.5; }
  if (/^poi_|^airport/.test(id)) l.layout['text-size'] = 12;
  if (mode === 'realiste' && /^label_country/.test(id)) l.paint = { ...l.paint, 'text-halo-color': 'rgba(5,10,20,0.45)', 'text-halo-width': 1, 'text-halo-blur': 1 };
}
function finishStyle(style, mode) {
  style.glyphs = 'glyph://{fontstack}/{range}';
  for (const l of style.layers) applyFonts(l, mode);
  style.projection = { type: 'globe' };
  style.sky = mode === 'realiste' ? {
    'sky-color': '#2a6fd6', 'horizon-color': '#a9d4ff', 'fog-color': '#cfe6ff',
    'sky-horizon-blend': 0.6, 'horizon-fog-blend': 0.5, 'fog-ground-blend': 0.7,
    // à pleine force, l'atmosphère éclairée de face pose un voile laiteux sur tout le globe
    'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.5, 5, 0.5, 7, 0]
  } : {
    'sky-color': '#5fb4ff', 'horizon-color': '#cdeeff', 'fog-color': '#e6f6ff',
    'sky-horizon-blend': 0.5, 'horizon-fog-blend': 0.6, 'fog-ground-blend': 0.6,
    'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.35, 5, 0.35, 7, 0]
  };
  // Toujours en plein jour. MapLibre lit la position de la lumière à l'envers pour l'atmosphère et pour les bâtiments :
  // vue de loin, le soleil est placé du côté de l'observateur (halo bleu régulier, pas de « face cachée éclairée ») ;
  // de près, il repasse au-dessus pour éclairer le toit des bâtiments 3D. Le halo a disparu avant le basculement (zoom 7).
  style.light = { anchor: 'viewport', color: '#ffffff', intensity: 0.32,
    position: ['interpolate', ['linear'], ['zoom'], 6, ['literal', [1.4, 200, 160]], 8, ['literal', [1.4, 200, 35]]] };
}

/* ============================ Carte ============================ */
let map;
let relief = false;
registerProtocol(maplibregl, -1);   // tuiles de fond, jamais assombries
setCartoonBase(BASE + 'tiles/cartoon/');
async function initMap() {
  const style = await buildStyle();
  // on démarre au-dessus de la longitude de l'utilisateur, déduite de son fuseau horaire
  const homeLon = Math.max(-170, Math.min(170, -new Date().getTimezoneOffset() / 4));
  map = new maplibregl.Map({
    container: 'map', style,
    center: [homeLon, 30], zoom: isMobile() ? 1.0 : 2.0, minZoom: isMobile() ? 0.4 : 1.2, pitch: 0, maxPitch: 78,   // en dessous, le globe n'est plus qu'un point
    attributionControl: { compact: true, customAttribution: 'Lieux <a href="https://www.geonames.org/">GeoNames</a> (CC BY 4.0) et <a href="https://www.wikidata.org/">Wikidata</a> · Recherche <a href="https://photon.komoot.io/">Photon</a> · Trajets <a href="https://project-osrm.org/">OSRM</a>, trains et bus <a href="https://transitous.org/sources/">Transitous</a>, vols <a href="https://openflights.org/data">OpenFlights</a> (ODbL) et <a href="https://ourairports.com/">OurAirports</a> · Météo <a href="https://open-meteo.com/">Open-Meteo</a> et <a href="https://www.worldclim.org/">WorldClim</a> · Textes et photos Wikipédia, Wikivoyage, Wikimedia Commons (CC BY-SA)' },
    canvasContextAttributes: { antialias: true }
  });
  window.escapadeMap = map;   // accès pratique depuis la console du navigateur
  // crédits repliés par défaut (ils sont longs) ; seul un clic sur « i » les déplie
  const attrib = document.querySelector('.maplibregl-ctrl-attrib');
  let attribOpen = false;
  attrib?.querySelector('summary, .maplibregl-ctrl-attrib-button')?.addEventListener('click', () => { attribOpen = !(attrib.open || attrib.classList.contains('maplibregl-compact-show')); });
  const fold = () => { if (attribOpen || !attrib) return; attrib.classList.remove('maplibregl-compact-show'); if (attrib.open) attrib.open = false; };
  fold(); map.on('data', fold); map.on('resize', fold);
  map.once('style.load', () => setTimeout(hideLoading, 400));   // sans attendre toutes les images de la carte
  setTimeout(hideLoading, 12000);   // l'écran de chargement ne bloque jamais l'interface plus de 12 s
  map.on('load', () => {
    hideLoading();
    initWelcome(); autoSpin();
    if (!storageOk) setTimeout(() => toast('Stockage du navigateur désactivé : tes favoris ne seront pas conservés'), 1500);
    openFromHash(true);

    const c0 = map.getCenter();
    $('#rCoords').textContent = fmtLL(c0.lat, c0.lng);
    updateReadout();
  });
  map.on('mousemove', e => {
    $('#rCoords').textContent = fmtLL(e.lngLat.lat, e.lngLat.lng);
    hoverPlace(e.point);
  });
  map.on('mouseout', () => $('#rPlace').classList.remove('show'));
  map.on('pitchend', () => $('#b3d').classList.toggle('on', map.getPitch() > 10));
  map.on('move', updateReadout);
  map.on('zoom', () => document.body.classList.toggle('zoomed', map.getZoom() > 3.2));
  // vue d'ensemble : on redresse la caméra (une inclinaison 3D gardée en dézoomant fait glisser le globe vers le bas)
  map.on('zoomend', () => {
    if (map.getZoom() < 4 && (map.getPitch() > 1 || Math.abs(map.getBearing()) > 1) && !map.isMoving() && !document.body.classList.contains('touring'))
      map.easeTo({ pitch: 0, bearing: 0, duration: 900 });
  });
  map.on('moveend', () => {
    const c = map.getCenter();
    $('#rCoords').textContent = fmtLL(c.lat, c.lng);
  });
  map.on('click', e => onMapClick(e));
}
/* ---- accueil : coups de cœur du mois et globe qui tourne doucement ---- */
function initWelcome() {
  const el = $('#welcome'); if (!el || LS.get('esc.web.welcomeOff', false)) return;
  el.hidden = false; el.classList.add('show');
  $('#wClose').onclick = () => {
    el.classList.remove('show'); LS.set('esc.web.welcomeOff', true); setTimeout(() => { el.hidden = true; }, 500);
  };
  refreshWelcome();
}
// Les trois questions de l'accueil (départ, mois, budget pour N personnes) ouvrent « Où partir ? » avec ces réponses
const MOIS_W = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function fillWelcomeForm() {
  const f = $('#wForm'); if (!f) return;
  const prof = getProfile() || {}, last = LS.get('esc.web.discover', {});
  const next = (new Date().getMonth() + 1) % 12;
  const v = { fromName: prof.from || '', month: next, budget: prof.budget || 2000, travelers: prof.travelers || 2, days: prof.days || 7, ...last };
  f.month.innerHTML = MOIS_W.map((m, i) => `<option value="${i}" ${i === +v.month ? 'selected' : ''}>${m.charAt(0).toUpperCase() + m.slice(1)}</option>`).join('');
  f.travelers.innerHTML = Array.from({ length: 8 }, (_, i) => `<option value="${i + 1}" ${i + 1 === +v.travelers ? 'selected' : ''}>${i + 1} pers.</option>`).join('');
  f.days.innerHTML = [2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 21, 30].map(n => `<option value="${n}" ${n === +v.days ? 'selected' : ''}>${n} jours</option>`).join('');
  if (![...f.days.options].some(o => o.selected)) f.days.insertAdjacentHTML('afterbegin', `<option value="${+v.days}" selected>${+v.days} jours</option>`);
  f.from.value = v.fromName || ''; f.budget.value = v.budget;
  f.onsubmit = e => {
    e.preventDefault();
    openDiscover({ fromName: f.from.value.trim(), month: +f.month.value, days: +f.days.value, budget: Math.max(200, +f.budget.value || 2000), travelers: +f.travelers.value });
  };
}
// Contenu de l'accueil, refait quand le profil change : salutation, coups de cœur selon les envies et le climat aimé
let welcomeReq = 0;
async function refreshWelcome() {
  const el = $('#welcome'); if (!el || el.hidden) return;
  const prof = getProfile(), name = firstName(), req = ++welcomeReq;
  $('#wTitle').innerHTML = name ? `Bonjour ${esc(name)}, où part-on <em>ensuite ?</em>` : 'Où part-on <em>ensuite ?</em>';
  $('#wSub').textContent = prof ? 'Ou laisse-toi inspirer par ces idées choisies pour toi :' : 'Ou laisse-toi inspirer :';
  fillWelcomeForm();
  $('#wProf').hidden = !!prof;
  const cards = $('#wCards'); cards.hidden = false;
  cards.innerHTML = '<i class="w-skel"></i>'.repeat(4);
  try {
    const { month, picks } = await seasonPicks(4, prof);
    if (req !== welcomeReq) return;
    if (!picks.length) throw new Error('aucun');
    $('#wKicker').textContent = prof ? `Pour toi en ${month}` : `Coups de cœur ${/^[aeiou]/i.test(month) ? 'd’' : 'de '}${month}`;   // d’août, de juillet
    cards.innerHTML = picks.map((p, i) => `<button class="w-card" data-i="${i}" title="Découvrir ${esc(p.name)}">
      ${p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}
      ${i === 0 ? '<em class="w-badge">Coup de cœur</em>' : ''}
      <span><b>${esc(p.name)}</b><small>${countryInfo(p.cc)?.flag || ''} ${esc(countryInfo(p.cc)?.name || p.cc)} · ${esc(p.weather.split(' · ')[0])}</small></span></button>`).join('');
    cards.querySelectorAll('.w-card').forEach(b => b.onclick = () => {
      const p = picks[+b.dataset.i];
      explore(p.lat, p.lon, { hint: p.name, label: p.name, zoom: p.kind === 'ile' || p.kind === 'parc' ? 9.5 : 11 });
    });
  } catch { if (req === welcomeReq) cards.hidden = true; }
}
function autoSpin() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || location.hash.length > 1) return;
  let on = true, last = 0;
  const stop = () => { on = false; };
  const box = map.getCanvasContainer();
  for (const ev of ['mousedown', 'touchstart', 'wheel']) box.addEventListener(ev, stop, { once: true, passive: true });
  window.addEventListener('keydown', stop, { once: true });
  const step = t => {
    if (!on || document.body.classList.contains('panel-open')) return;
    // un tour en quatre minutes environ, d'ouest en est comme la vraie Terre
    if (last && map.getZoom() < 3 && !map.isMoving()) { const c = map.getCenter(); map.setCenter([c.lng - (t - last) * 0.0015, c.lat]); }
    last = t; requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function altitudeKm() {
  const c = map.getCenter();
  const mpp = 156543.03 * Math.cos(c.lat * DEG) / 2 ** map.getZoom();
  return mpp * map.getCanvas().clientHeight * 1.5 / 1000;
}
function updateReadout() {
  const a = altitudeKm();
  $('#rAlt').textContent = 'Altitude ' + (a > 10 ? Math.round(a).toLocaleString('fr-FR') + ' km' : Math.round(a * 1000).toLocaleString('fr-FR') + ' m');
}
let hoverRaf = 0;
function hoverPlace(pt) {
  if (hoverRaf) return;
  hoverRaf = requestAnimationFrame(() => {
    hoverRaf = 0;
    const f = map.queryRenderedFeatures(pt, { layers: map.getStyle().layers.filter(l => /^label_|^poi_/.test(l.id)).map(l => l.id) })[0];
    const hl = $('#rPlace');
    if (f) {
      hl.textContent = f.properties['name:fr'] || f.properties['name:latin'] || f.properties.name || '';
      hl.style.transform = `translate(${pt.x + 14}px, ${pt.y + 14}px)`;
      hl.classList.add('show'); map.getCanvas().style.cursor = 'pointer';
    } else { hl.classList.remove('show'); map.getCanvas().style.cursor = ''; }
  });
}
function onMapClick(e) {
  if (hitDestination(e.point)) return;          // clic sur une destination allumée par « Où partir ? »
  const f = map.queryRenderedFeatures(e.point, { layers: map.getStyle().layers.filter(l => /^label_|^poi_/.test(l.id)).map(l => l.id) })[0];
  let lng = e.lngLat.lng, lat = e.lngLat.lat, hint = null;
  if (f && f.geometry.type === 'Point') {
    [lng, lat] = f.geometry.coordinates;
    hint = f.properties['name:fr'] || f.properties['name:latin'] || f.properties.name;
  }
  explore(lat, lng, { hint });
}
function panelPadding() {
  if (isMobile() && innerHeight <= 500 && innerWidth > innerHeight) return { top: 60, bottom: 20, left: 20, right: Math.min(380, innerWidth * 0.56) + 24 };   // téléphone en paysage
  return isMobile() ? { top: 40, bottom: innerHeight * 0.7, left: 20, right: 20 } : { top: 60, bottom: 60, left: 60, right: 460 };
}
function goTo(lat, lon, opts = {}) {
  if (!map) return;   // mode sans globe
  const z = map.getZoom();
  if (opts.bounds) {
    map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });     // sinon les marges des vols précédents s'ajoutent
    const cam = map.cameraForBounds(opts.bounds, { padding: panelPadding(), maxZoom: Math.min(opts.zoom ?? 14, 13) });
    if (cam) { map.flyTo({ ...cam, pitch: cam.zoom >= 10 ? 45 : 0, duration: z < 6 ? 3600 : 1800, curve: 1.5, essential: false }); return; }
  }
  const target = opts.zoom ?? (z < 6 ? 10 : Math.max(z, 10));
  map.flyTo({
    center: [lon, lat], zoom: target, pitch: opts.pitch ?? (target >= 9 ? 50 : 0), bearing: opts.bearing ?? map.getBearing(),
    padding: panelPadding(), duration: opts.duration ?? (z < 6 ? 3800 : 1600), essential: false, curve: 1.5
  });
}

/* ============================ Marqueurs ============================ */
let wpMarker = null, poiMarker = null;
function placeMarker(lat, lon) {
  if (!map) return;
  if (!wpMarker) {
    const el = document.createElement('div');
    el.className = 'waypoint';
    el.innerHTML = '<div class="beam"></div><div class="ring"></div><div class="dot"></div>';
    wpMarker = new maplibregl.Marker({ element: el, anchor: 'center' });
  }
  wpMarker.setLngLat([lon, lat]).addTo(map);
}
function placePoi(lat, lon) {
  if (!map) return;
  if (!poiMarker) { const el = document.createElement('div'); el.className = 'poi-pin'; poiMarker = new maplibregl.Marker({ element: el }); }
  poiMarker.setLngLat([lon, lat]).addTo(map);
}

/* ============================ Données locales ============================ */
/* Base de lieux (GeoNames + notoriété Wikidata), découpée en cases de 5° chargées à la demande.
 * Un lieu : [nom, nom_fr, type, pays, région, lat, lon, population, article_wikipedia_fr, notoriété] */
let countries = {}, meta = null;
const loadLocal = Promise.all([
  getJSON('data/countries.json?v=5').then(d => { countries = d; }),
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
// Ville de départ trouvée dans la base locale (19 000 lieux connus) : pas besoin du service en ligne, ni de connexion
async function localCity(q) {
  const n = norm(q).replace(/\s*,.*$/, '').trim(); if (!n) return null;
  const top = await loadTop();
  let best = null;
  for (const p of top) {
    const k = kindOf(p); if (k && !['ville', 'capitale', 'village'].includes(k)) continue;
    if (norm(p[0]) !== n && norm(p[1] || '') !== n && norm(p[8] || '') !== n) continue;
    if (!best || p[7] > best[7]) best = p;
  }
  return best && { name: pname(best), lat: best[5], lon: best[6], cc: best[3] };
}
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
    return r.features?.[0]?.properties || null;      // null : rien ici (mer, désert…)
  } catch { return undefined; }                       // undefined : service indisponible
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
    if (!ii || ii.mime !== 'image/jpeg' || ii.width < 900 || ii.width < ii.height * 0.9 || !ii.thumburl || !isTravelPhoto(ii.url || ii.thumburl)) return null;
    const artist = (ii.extmetadata?.Artist?.value || '').replace(/<[^>]+>/g, '').trim();
    return { lat: c.lat, lon: c.lon, src: ii.thumburl, thumb: ii.thumburl.replace(/\/\d+px-/, '/500px-'), page: ii.descriptionurl,
      title: c.title.replace(/^File:|\.jpe?g$/gi, ''), credit: [artist, ii.extmetadata?.LicenseShortName?.value].filter(Boolean).join(' · ') };
  }).filter(Boolean).slice(0, 12);
}
/* « Quand partir » : moyennes mensuelles sur 3 ans (requête allégée, mise en cache par case de 0,5°) et indice de
 * confort qui combine température et pluie. La règle marche aussi sous les tropiques, où c'est la saison sèche
 * qui compte (Bali : avril à octobre) et pas la température, toujours chaude. */
const tempComfort = tx => tx >= 22 && tx <= 30 ? 1 : (tx >= 17 && tx < 22) || (tx > 30 && tx <= 33) ? 0.6 : (tx >= 12 && tx < 17) || (tx > 33 && tx <= 36) ? 0.3 : 0;
// jours de forte pluie (≥ 5 mm) : le modèle météo compte presque tous les jours tropicaux comme « pluvieux » au seuil de 1 mm
const rainComfort = d => d <= 4 ? 1 : d <= 7 ? 0.7 : d <= 11 ? 0.4 : 0.1;
function scoreMonths(months) {
  const comfort = months.map(m => m ? 0.55 * tempComfort(m.tx) + 0.45 * rainComfort(m.rainDays) + (m.sun > 7 ? 0.05 : 0) : -1);
  const score = comfort.map(c => c >= 0.75 ? 2 : c >= 0.5 ? 1 : 0);
  // climat rude toute l'année (Islande, Sahara…) : les meilleurs mois du lieu restent « corrects »
  if (Math.max(...score) === 0) { const best = Math.max(...comfort); comfort.forEach((c, i) => { if (c >= 0 && c >= best - 0.08) score[i] = 1; }); }
  return score;
}
async function climate(lat, lon, signal) {
  const key = `${(Math.round(lat * 2) / 2).toFixed(1)},${(Math.round(lon * 2) / 2).toFixed(1)}`;
  const cache = LS.get('esc.web.climate2', {});
  if (cache[key]) return { ...cache[key], score: scoreMonths(cache[key].months) };
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}&start_date=2021-01-01&end_date=2023-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration&timezone=UTC`;
  const r = await getJSON(url, { signal, timeout: 20000 });
  const d = r.daily; if (!d) return null;
  const acc = Array.from({ length: 12 }, () => ({ tx: 0, tn: 0, rain: 0, sun: 0, n: 0 }));
  for (let i = 0; i < d.time.length; i++) {
    const m = +d.time[i].slice(5, 7) - 1, a = acc[m];
    if (d.temperature_2m_max[i] == null) continue;
    a.tx += d.temperature_2m_max[i]; a.tn += d.temperature_2m_min[i];
    a.rain += (d.precipitation_sum[i] ?? 0) >= 5 ? 1 : 0; a.sun += (d.sunshine_duration[i] ?? 0) / 3600; a.n++;
  }
  const r1 = v => Math.round(v * 10) / 10;
  const months = acc.map(a => a.n ? { tx: r1(a.tx / a.n), tn: r1(a.tn / a.n), rainDays: r1(a.rain / a.n * 30.4), sun: r1(a.sun / a.n) } : null);
  const res = { months, elevation: r.elevation };
  const keys = Object.keys(cache); if (keys.length > 80) delete cache[keys[0]];
  cache[key] = res; LS.set('esc.web.climate2', cache);
  return { ...res, score: scoreMonths(months) };
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
const ADMIN = /kabupaten|kelurahan|kecamatan|regency|province|commune|région|département|municipalit|circonscription|arrondissement|diocèse|canton|comté|frazione|gare|station|école|lycée|collège|université|entreprise|hôpital|cimetière|club|stade|aéroport|autoroute|route |rue |ligne |tribunal|prison|banque|hôtel de ville|paroisse/i;

// fichiers qui ne sont pas des photos de voyage : cartes, drapeaux, blasons, vues satellite, schémas…
const NOT_PHOTO = /(^|[\/_\- (])(map|maps|carte|karte|mapa|locator|location[_ ]map|flag|drapeau|coat[_ ]of[_ ]arms|blason|armoiries|wappen|escudo|satellite|landsat|sentinel|aster|modis|nasa|copernicus|from[_ ]space|orbit|iss\d|sts-\d|expedition[_ ]\d|diagram|schéma|logo|chart|graph|relief|topographic|admin)/i;
const isTravelPhoto = u => !!u && /\.jpe?g/i.test(u) && !NOT_PHOTO.test(decodeURIComponent(u.split('/').slice(-2).join('/')));
// retire les parenthèses de prononciation et d'écritures non latines (« Ubud (balinais : ᬳᬸᬩᬸᬤ᭄) »)
function cleanText(t) {
  return String(t || '').replace(/\s*\(([^()]|\([^()]*\))*\)/g, m => /[^\u0000-\u024F\u1E00-\u1EFF\u2000-\u206F\u20AC°’«»]|prononc|\[|API|écoute/i.test(m) ? '' : m)
    .replace(/\s+([,.;])/g, '$1').replace(/\s{2,}/g, ' ').trim();
}

/* ============================ Exploration ============================ */
let current = null, reqId = 0, abortCtl = null;
async function explore(lat, lon, opts = {}) {
  const id = ++reqId;
  abortCtl?.abort(); abortCtl = new AbortController();
  clearTrip(); panelMode = 'place'; tab = 'apercu';
  $('#panel .scroll').scrollTop = 0;
  const signal = abortCtl.signal;
  placeMarker(lat, lon);
  if (poiMarker) poiMarker.remove();
  if (!opts.noFly) goTo(lat, lon, opts);
  if (isMobile() && !panel.classList.contains('open')) panel.classList.add('peek');
  openPanel();
  renderSkeleton(lat, lon, opts.label);
  await loadLocal;

  // 1. Où est-on ?
  let [geo, local] = await Promise.all([opts.geo || reverseGeocode(lat, lon, signal), placesAround(lat, lon, 40)]);
  if (id !== reqId) return;
  let redirect = null;
  if (geo === undefined && local[0]?.d < 30) {
    // service de localisation indisponible : on s'appuie sur la base locale, sans parler de pleine mer
    const p = local[0].p; geo = { name: pname(p), city: pname(p), state: p[4], countrycode: p[3] };
  }
  if (!geo || (!geo.city && !geo.county && !geo.state && geo.type !== 'city')) {
    // en mer ou zone vide : on part vers la destination notable la plus proche
    const best = await bestDestination(lat, lon);
    if (id !== reqId) return;
    if (best) {
      const bp = best.p;
      redirect = `Pas grand-chose ici${geo === null ? ' (en pleine mer)' : ''}. Destination la plus proche : <b>${esc(pname(bp))}</b> (${esc(KIND_LABEL[kindOf(bp)] || kindOf(bp))}), à ${Math.round(best.d)} km.`;
      lat = bp[5]; lon = bp[6];
      opts.hint = pname(bp);
      placeMarker(lat, lon); goTo(lat, lon, { zoom: Math.max(map?.getZoom() ?? 0, kindOf(bp) === 'ile' ? 10 : 9) });
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
  // région : nom français quand la base le connaît (« Lisbon » → « Lisbonne »)
  let region = geo.state || match?.p[4] || '';
  const regFr = local.find(x => x.p[1] && norm(x.p[0]) === norm(region));
  if (regFr) region = regFr.p[1];
  setRoute(`lieu=${lat.toFixed(4)},${lon.toFixed(4)},${placeName}`);
  current = { lat, lon, name: placeName, country, cc, region, ci, redirect, photos: [], climate: null, wiki: null, voy: null,
    around, pop: match?.p[7] || 0 };
  renderPanel();

  // 2. Infos en parallèle, affichées au fil de l'eau
  // seulement le lieu lui-même (et sa ville) : jamais la page du pays ou de la région à la place du lieu
  const isAdmin = t => t && (norm(t) === norm(country) || norm(t) === norm(geo.state));
  const titles = [wikiTitle, opts.hint, placeName, geo.city].filter(t => t && (!isAdmin(t) || norm(t) === norm(placeName)));
  const jobs = [
    wikiPages(WIKI, titles, signal).then(pages => {
      const ok = pages.find(p => !p.coordinates || haversine(lat, lon, p.coordinates[0].lat, p.coordinates[0].lon) < 60);
      current.wiki = ok || null;
    }).catch(() => {}),
    wikiPages(WIKIVOY, titles, signal, false).then(pages => {
      current.voy = pages.find(p => (p.extract || '').length > 60) || null;
    }).catch(() => {}),
    wikiNearby(lat, lon, signal).catch(() => []).then(async list => {
      list = list.filter(p => p.title !== placeName && p.title !== current.wiki?.title);
      current.nearby = list.slice(0, 8);
      const fromWiki = list.filter(p => isTravelPhoto(p.big)).slice(0, 12)
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

/* ============================ Liens partageables ============================
 * #lieu=lat,lon,Nom  ou  #voyage=<itinéraire encodé>. Chaque lieu ouvert crée une entrée d'historique :
 * le bouton « précédent » du navigateur revient au lieu d'avant au lieu de quitter le site. */
function setRoute(hash) {
  const cur = decodeURIComponent(location.hash.slice(1));
  if (cur === hash) return;
  const key = h => h.split(',').slice(0, 2).join(',');            // mêmes coordonnées : on remplace au lieu d'empiler
  const replace = hash && cur && key(cur) === key(hash);
  history[replace ? 'replaceState' : 'pushState'](null, '', location.pathname + location.search + (hash ? '#' + encodeURIComponent(hash).replace(/%2C/g, ',').replace(/%3D/g, '=') : ''));
}
const encodeTrip = (dest, input) => btoa(unescape(encodeURIComponent(JSON.stringify({ d: { name: dest.name, lat: +dest.lat.toFixed(4), lon: +dest.lon.toFixed(4), cc: dest.cc },
  i: { days: input.days, travelers: input.travelers, budget: input.budget, month: input.month, fromName: input.fromName, mode: input.mode, shape: input.shape, pace: input.pace, likes: input.likes } })))).replace(/=+$/, '');
function openFromHash(first) {
  const h = decodeURIComponent(location.hash.slice(1));
  try {
    if (h.startsWith('lieu=')) {
      const [la, lo, ...n] = h.slice(5).split(',');
      if (isFinite(+la) && isFinite(+lo) && (!current || Math.abs(current.lat - la) > 1e-3 || Math.abs(current.lon - lo) > 1e-3 || panelMode !== 'place'))
        explore(+la, +lo, { hint: n.join(',') || null, label: n.join(',') || null, zoom: 11 });
    } else if (h.startsWith('partir=')) {
      openDiscover(decodeState(h.slice(7)));
    } else if (h.startsWith('voyage=')) {
      const t = JSON.parse(decodeURIComponent(escape(atob(h.slice(7)))));
      replan(t.d, t.i);
    } else if (!first && panel.classList.contains('open')) closePanel(true);
  } catch (e) { console.warn('Adresse non reconnue', e); }
}
addEventListener('popstate', () => openFromHash(false));
async function share(title) {
  const url = location.href;
  try {
    if (navigator.share && isMobile()) { await navigator.share({ title: `${title} — Escapade`, url }); return; }
    await navigator.clipboard.writeText(url);
    toast('Lien copié : colle-le pour partager');
  } catch (e) { if (e?.name !== 'AbortError') toast('Copie impossible : le lien est dans la barre d’adresse'); }
}

/* ============================ Panneau ============================ */
const panel = $('#panel');
let panelMode = 'place';     // 'place' : fiche du lieu, 'trip' : itinéraire
function openPanel() {
  panel.classList.add('open'); document.body.classList.add('panel-open');
  $('#hint').classList.add('gone'); LS.set('esc.web.hinted', true);
}
const NO_PAD = { top: 0, bottom: 0, left: 0, right: 0 };
// La place laissée au panneau (padding) reste mémorisée par la carte : sans cette remise à zéro, le globe resterait
// décentré après la fermeture et tous les zooms se feraient autour d'un point excentré.
function resetPadding() {
  if (!map) return;
  const p = map.getPadding();
  if (p.top || p.bottom || p.left || p.right) map.easeTo({ padding: NO_PAD, duration: 600 });
}
function closePanel(fromRoute) { if (fromRoute !== true) setRoute(''); resetPadding(); clearDiscover(); panel.classList.remove('open', 'peek'); document.body.classList.remove('panel-open'); wpMarker?.remove(); poiMarker?.remove(); abortCtl?.abort(); reqId++; clearTrip(); panelMode = 'place'; }
if (LS.get('esc.web.hinted', false)) $('#hint').classList.add('gone');
if (isMobile()) $('#hint').lastChild.textContent = 'Touche le globe, ou demande « Où partir ? »';
// téléphone : la poignée replie, déplie ou ferme le panneau
{
  let y0 = null;
  const g = $('#grab');
  g.addEventListener('pointerdown', e => { y0 = e.clientY; g.setPointerCapture(e.pointerId); });
  g.addEventListener('pointerup', e => {
    if (y0 == null) return;
    const dy = e.clientY - y0; y0 = null;
    if (dy > 120 && panel.classList.contains('peek')) closePanel();
    else if (dy > 40) panel.classList.add('peek');
    else if (dy < -40) panel.classList.remove('peek');
    else panel.classList.toggle('peek');
  });
}
function setPanel(body, actions) {
  panelMode = 'trip';
  $('#pBody').innerHTML = body; $('#pActions').innerHTML = actions;
  $('#panel .scroll').scrollTop = 0;
  openPanel();
}
$('#pClose').onclick = () => closePanel();
$('#panel .scroll').addEventListener('scroll', e => {
  const tabs = $('#pBody .tabs');
  panel.classList.toggle('stuck', !!tabs && e.target.scrollTop > tabs.offsetTop - 20);
}, { passive: true });
function renderSkeleton(lat, lon, label) {
  $('#pBody').innerHTML = `<div class="hero"><div class="kicker">${esc(fmtLL(lat, lon))}</div><h2>${esc(label || 'Exploration…')}</h2><div class="sub">Recherche des infos de voyage</div></div>
    <div class="facts">${'<div class="fact" style="width:110px;height:48px"></div>'.repeat(3)}</div>
    <div class="sec"><div class="skel" style="width:92%"></div><div class="skel" style="width:78%"></div><div class="skel" style="width:85%"></div><div class="skel" style="width:60%"></div></div>`;
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
  const w = current.wiki;
  if (w?.original?.source && isTravelPhoto(w.original.source) && w.original.width >= 600) return w.thumbnail?.source || w.original.source;
  return current.photos[0]?.src || (isTravelPhoto(w?.thumbnail?.source) ? w.thumbnail.source : '');
}
let tab = 'apercu';
const distTxt = d => d < 1 ? Math.round(d * 1000) + ' m' : d < 10 ? d.toFixed(1).replace('.', ',') + ' km' : Math.round(d) + ' km';
function renderPanel() {
  const c = current; if (!c || panelMode !== 'place') return;
  const scrollEl = $('#panel .scroll'), keep = scrollEl.scrollTop;
  const img = heroImage();
  const w = c.weather?.current;
  const wx = w ? WMO[w.weather_code] || ['🌡', ''] : null;
  let localTime = '', diffTxt = '';
  if (c.weather?.utc_offset_seconds != null) {
    const diff = Math.round((c.weather.utc_offset_seconds / 60 + new Date().getTimezoneOffset()) / 60 * 2) / 2;
    const local = new Date(Date.now() + (c.weather.utc_offset_seconds + new Date().getTimezoneOffset() * 60) * 1000);
    localTime = `${String(local.getHours()).padStart(2, '0')}:${String(local.getMinutes()).padStart(2, '0')}`;
    diffTxt = diff === 0 ? 'même heure' : (diff > 0 ? '+' : '') + String(diff).replace('.', ',') + ' h';
  }
  const HATNOTE = /^(pour (les autres|l['’]article|des articles)|ne doit pas être confondu|cet article|voir aussi|« .* » redirige)/i;
  const voyParas = c.voy?.extract ? c.voy.extract.split('\n').map(x => cleanText(x)).filter(x => x.length > 30 && !HATNOTE.test(x)).slice(0, 2) : [];
  const wikiText = c.wiki?.extract ? clip(cleanText(c.wiki.extract.split('\n').map(x => x.trim()).filter(x => x && !HATNOTE.test(x))[0] || ''), 520) : '';
  const clim = c.climate, m = new Date().getMonth();
  const best = clim ? bestMonthsText(clim.score) : '';
  const q = encodeURIComponent(c.name + (c.country ? ', ' + c.country : ''));
  const nPhotos = c.photos.length, nSee = (c.nearby?.length || 0) + (c.around?.length || 0);
  const facts = [
    wx && [I.thermo, 'Maintenant', `${wx[0]} ${Math.round(w.temperature_2m)}°`],
    localTime && [I.clock, 'Heure locale', `${localTime} · ${diffTxt}`],
    clim && [I.calendar, 'Ce mois-ci', ['À éviter', 'Correct', 'Idéal'][clim.score[m]]],
    c.ci?.cur && [I.coins, 'Monnaie', c.ci.cur.split(' (')[0]],
    c.ci?.lang && [I.chat, 'Langue', c.ci.lang.split(',')[0]],
  ].filter(Boolean);
  const placeRow = (x, i) => `<button class="row" data-near="${i}"><span class="th">${KIND_ICON[kindOf(x.p)] || '📍'}</span><span class="tx"><b>${esc(pname(x.p))}</b><small>${esc(KIND_LABEL[kindOf(x.p)] || kindOf(x.p))}${x.p[7] ? ' · ' + x.p[7].toLocaleString('fr-FR') + ' hab.' : ''}</small></span><span class="dist">${distTxt(x.d)}</span></button>`;
  const poiRow = (p, i) => `<button class="row" data-poi="${i}">${p.thumb ? `<img class="th" src="${esc(p.thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '<span class="th">📍</span>'}<span class="tx"><b>${esc(p.title)}</b><small>${esc(p.desc)}</small></span><span class="dist">${distTxt(p.d)}</span></button>`;
  const panes = {
    apercu: `
      ${c.redirect ? `<div class="note info">${I.pin}<span>${c.redirect}</span></div>` : ''}
      <div class="sec">
        ${voyParas[0] ? `<p class="lead">${esc(voyParas[0])}</p>${voyParas[1] ? `<p>${esc(voyParas[1])}</p>` : ''}` : ''}
        ${wikiText ? `<p>${esc(wikiText)}</p>` : ''}
        ${voyParas.length || wikiText ? `<p class="src">Sources : ${c.voy ? `<a href="${esc(c.voy.fullurl)}" target="_blank" rel="noopener">Wikivoyage</a>` : ''}${c.voy && c.wiki ? ' · ' : ''}${c.wiki ? `<a href="${esc(c.wiki.fullurl)}" target="_blank" rel="noopener">Wikipédia</a>` : ''}</p>`
          : c.done ? '<p class="muted">Pas de description pour ce point précis. Regarde l’onglet « À voir » pour les lieux autour.</p>' : '<div class="skel" style="width:92%"></div><div class="skel" style="width:74%"></div><div class="skel" style="width:84%"></div>'}
      </div>
      <div class="sec"><h3>Quand partir</h3>
        ${clim ? `<div class="card">
          <div class="months">${clim.score.map((sc, i) => `<div class="${i === m ? 'now' : ''}"><i class="s${sc}" title="${MOIS_L[i]}"></i>${MOIS[i]}</div>`).join('')}</div>
          <div class="legend"><span><i style="background:#5cb89c"></i>Idéal</span><span><i style="background:var(--saffron)"></i>Correct</span><span><i style="background:rgba(18,59,74,.1)"></i>Moins bien</span></div>
          <p class="best">${esc(best)}</p>
          <details class="more-clim"><summary>Températures, pluie et soleil mois par mois</summary>
            <table class="clim"><tr><td class="l"></td>${MOIS.map(x => `<th>${x}</th>`).join('')}</tr>
              <tr><td class="l">Max °C</td>${clim.months.map(x => `<td class="${x && x.tx >= 28 ? 'hot' : x && x.tx < 10 ? 'cold' : ''}">${x ? Math.round(x.tx) : '–'}</td>`).join('')}</tr>
              <tr><td class="l">Min °C</td>${clim.months.map(x => `<td>${x ? Math.round(x.tn) : '–'}</td>`).join('')}</tr>
              <tr><td class="l" title="Jours avec au moins 5 mm de pluie">Forte pluie (j)</td>${clim.months.map(x => `<td>${x ? Math.round(x.rainDays) : '–'}</td>`).join('')}</tr>
              <tr><td class="l">Soleil (h)</td>${clim.months.map(x => `<td>${x ? Math.round(x.sun) : '–'}</td>`).join('')}</tr></table>
            <p class="src" style="margin-top:8px">Moyennes 2021-2023, <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></p></details></div>`
        : clim === false ? '<p class="muted">Climat indisponible pour ce point.</p>' : '<div class="skel" style="width:100%;height:70px;border-radius:16px"></div>'}
      </div>
      ${nPhotos ? `<div class="sec"><h3>En images <button class="more" data-tab="photos">Tout voir ${I.next}</button></h3><div class="gallery">${c.photos.slice(0, 4).map((p, i) => `<button data-ph="${i}"><img src="${esc(p.thumb)}" alt="${esc(p.title)}" loading="lazy" referrerpolicy="no-referrer"></button>`).join('')}</div></div>` : ''}
      ${c.nearby?.length ? `<div class="sec"><h3>Incontournables <button class="more" data-tab="voir">Tout voir ${I.next}</button></h3><div class="list">${c.nearby.slice(0, 3).map(poiRow).join('')}</div></div>` : ''}`,
    photos: nPhotos ? `<div class="sec"><div class="gallery">${c.photos.map((p, i) => `<button data-ph="${i}"><img src="${esc(p.thumb)}" alt="${esc(p.title)}" loading="lazy" referrerpolicy="no-referrer"></button>`).join('')}</div>
      <p class="src">Photos des lieux dans un rayon de 10 km · Wikipédia et <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener">Wikimedia Commons</a></p></div>`
      : `<div class="sec"><p class="muted">${c.done ? 'Pas de photo trouvée autour de ce point.' : 'Recherche des photos…'}</p></div>`,
    voir: `${c.nearby?.length ? `<div class="sec"><h3>Incontournables <small>les plus consultés sur Wikipédia</small></h3><div class="list">${c.nearby.map(poiRow).join('')}</div></div>` : ''}
      ${c.around?.length ? `<div class="sec"><h3>Villes, villages et sites proches</h3><div class="list">${c.around.map(placeRow).join('')}</div></div>` : ''}
      ${!nSee ? `<div class="sec"><p class="muted">${c.done ? 'Rien de notable trouvé autour.' : 'Recherche des lieux…'}</p></div>` : ''}`,
    infos: `<div class="sec"><h3>En pratique</h3><div class="grid2">
        ${c.ci ? `<div class="stat">${I.coins}<span>Monnaie<b>${esc(c.ci.cur || '—')}</b></span></div><div class="stat">${I.chat}<span>Langue<b>${esc(c.ci.lang || '—')}</b></span></div>` : ''}
        ${localTime ? `<div class="stat">${I.clock}<span>Heure locale<b>${localTime} (${esc(diffTxt)})</b></span></div>` : ''}
        ${c.pop ? `<div class="stat">${I.people}<span>Population<b>${c.pop.toLocaleString('fr-FR')} hab.</b></span></div>` : ''}
        ${c.ci?.cap ? `<div class="stat">${I.star}<span>Capitale du pays<b>${esc(c.ci.cap)}</b></span></div>` : ''}
        ${clim?.elevation != null ? `<div class="stat">${I.mountain}<span>Altitude<b>${Math.round(clim.elevation)} m</b></span></div>` : ''}
      </div></div>
      <div class="sec"><h3>Préparer le voyage</h3><div class="links">
        <a href="https://www.google.com/travel/flights?q=${encodeURIComponent('Vols vers ' + c.name)}" target="_blank" rel="noopener">${I.plane}Vols</a>
        <a href="https://www.booking.com/searchresults.fr.html?ss=${q}" target="_blank" rel="noopener">${I.bed}Hébergement</a>
        <a href="https://fr.wikivoyage.org/w/index.php?search=${encodeURIComponent(c.name)}" target="_blank" rel="noopener">${I.book}Guide Wikivoyage</a>
        <a href="https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lon}" target="_blank" rel="noopener">${I.map}Google Maps</a>
        <a href="https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/" target="_blank" rel="noopener">${I.shield}Conseils aux voyageurs</a>
      </div></div>`,
  };
  const TABS = [['apercu', 'Aperçu'], ['photos', 'Photos', nPhotos], ['voir', 'À voir', nSee], ['infos', 'Infos']];
  $('#pBody').innerHTML = `
    <div class="hero">${img ? `<img class="bg" src="${esc(img)}" alt="" referrerpolicy="no-referrer">` : ''}
      <div class="kicker"><span class="flag">${esc(c.ci?.flag || '')}</span>${esc(c.country)}${c.region && c.region !== c.name && c.region !== c.country ? ' · ' + esc(c.region) : ''}</div>
      <h2>${esc(c.name)}</h2>
      <div class="sub">${esc(fmtLL(c.lat, c.lon))}</div>
    </div>
    ${searchSummary(c.lat, c.lon)}
    ${facts.length ? `<div class="facts">${facts.map(([ic, k, v]) => `<div class="fact">${ic}<span><small>${k}</small><b>${esc(v)}</b></span></div>`).join('')}</div>` : ''}
    <div class="tabs" role="tablist">${TABS.map(([id, lab, n]) => `<button class="tab ${tab === id ? 'on' : ''}" role="tab" data-tab="${id}">${lab}${n ? `<sup>${n}</sup>` : ''}</button>`).join('')}</div>
    <div class="pane" data-pane="${tab}">${panes[tab]}</div>`;
  scrollEl.scrollTop = keep;
  const body = $('#pBody');
  body.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => {
    tab = b.dataset.tab; renderPanel();
    const tabs = body.querySelector('.tabs'); if (scrollEl.scrollTop > tabs.offsetTop) scrollEl.scrollTop = tabs.offsetTop;
  });
  body.querySelectorAll('[data-ph]').forEach(b => b.onclick = () => openViewer(+b.dataset.ph));
  body.querySelectorAll('[data-near]').forEach(b => b.onclick = () => {
    const x = c.around[+b.dataset.near];
    explore(x.p[5], x.p[6], { hint: pname(x.p), label: pname(x.p), zoom: kindOf(x.p) === 'village' ? 13 : 12 });
  });
  body.querySelectorAll('[data-poi]').forEach(b => b.onclick = () => {
    const p = c.nearby[+b.dataset.poi];
    placePoi(p.lat, p.lon);
    if (isMobile()) panel.classList.add('peek');
    map?.flyTo({ center: [p.lon, p.lat], zoom: 16.3, pitch: 62, bearing: map.getBearing() - 20, padding: panelPadding(), duration: 2600, essential: false });
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
function saveFavs() {
  LS.set('esc.web.favs', Object.fromEntries(favs));
  const n = favs.size + LS.get('esc.web.trips', []).length;
  $('#favCount').textContent = n || ''; $('#favCount').dataset.n = n;
}
function renderActions() {
  const c = current; if (!c || panelMode !== 'place') return;
  const on = favs.has(favKey(c));
  $('#pActions').innerHTML = (discoverActive() ? `<button class="btn icon" id="aBack" aria-label="Retour aux suggestions" title="Retour aux suggestions « Où partir ? »">${I.back}</button>` : '') + `<button class="btn icon fav ${on ? 'on' : ''}" id="aFav" aria-label="${on ? 'Retirer de mes voyages' : 'Enregistrer'}" title="${on ? 'Retirer de mes voyages' : 'Enregistrer dans mes voyages'}">${on ? I.heartFill : I.heart}</button><button class="btn icon" id="aShare" aria-label="Partager ce lieu" title="Copier le lien de ce lieu">${I.share}</button><button class="btn primary" id="aTrip">${I.route}Créer un itinéraire</button>`;
  $('#aShare').onclick = () => share(c.name);
  $('#aBack')?.addEventListener('click', backToResults);
  $('#aTrip').onclick = () => openPlanner({ name: c.name, lat: c.lat, lon: c.lon, cc: c.cc, monthScores: c.climate?.score });
  $('#aFav').onclick = () => {
    const k = favKey(c);
    if (favs.has(k)) { favs.delete(k); toast('Retiré de tes voyages'); }
    else {
      const cm = c.climate?.months?.filter(Boolean) || [];
      favs.set(k, { name: c.name, country: c.country, flag: c.ci?.flag || '', lat: c.lat, lon: c.lon, img: c.photos[0]?.src || heroImage() || '',
        score: c.climate?.score || null, tmax: cm.length ? Math.round(Math.max(...cm.map(x => x.tx))) : null, tmin: cm.length ? Math.round(Math.min(...cm.map(x => x.tn))) : null,
        added: Date.now() });
      toast('Ajouté à tes voyages');
    }
    saveFavs(); renderActions();
  };
}
function renderFavs() {
  const arr = [...favs.entries()].sort((a, b) => b[1].added - a[1].added);
  const trips = LS.get('esc.web.trips', []);
  const m = new Date().getMonth();
  const SEASON = ['Pas idéal ce mois-ci', 'Correct ce mois-ci', 'Idéal ce mois-ci'];
  $('#fBody').innerHTML = (!arr.length && !trips.length)
    ? `<div class="empty">${I.heart}<b>Rien pour l’instant</b>Clique sur un lieu du globe, puis sur le cœur pour l’enregistrer, ou crée un itinéraire.</div>`
    : `${arr.length ? `<h3 class="mtitle">Destinations</h3><div class="cards">${arr.map(([k, d]) => `<div class="pcard" data-k="${esc(k)}" role="button" tabindex="0">
          ${d.img ? `<img src="${esc(d.img)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}
          <button class="round rm" data-rm="${esc(k)}" aria-label="Retirer" title="Retirer">${I.trash}</button>
          <div class="pc-tx"><b>${esc(d.name)}</b><small>${esc(d.flag)} ${esc(d.country)}${d.tmin != null ? ` · ${d.tmin}° à ${d.tmax}°` : ''}</small>
          ${d.score ? `<span class="season s${d.score[m]}">${SEASON[d.score[m]]}</span>` : ''}</div></div>`).join('')}</div>` : ''}
      ${trips.length ? `<h3 class="mtitle">Itinéraires</h3><div class="trips">${trips.map((t, i) => `<div class="trip-row" data-trip="${i}" role="button" tabindex="0">${I.route}
          <span class="tx"><b>${esc(t.name)} · ${t.days} jours</b><small>${esc(t.stops.join(' › '))}</small></span><span class="price">${t.total.toLocaleString('fr-FR')} €</span>
          <button class="round rm" data-rmtrip="${i}" aria-label="Supprimer" title="Supprimer">${I.trash}</button></div>`).join('')}</div>` : ''}`;
  const fb = $('#fBody');
  fb.querySelectorAll('[data-rm]').forEach(b => b.onclick = e => { e.stopPropagation(); favs.delete(b.dataset.rm); saveFavs(); renderFavs(); });
  fb.querySelectorAll('[data-rmtrip]').forEach(b => b.onclick = e => {
    e.stopPropagation(); const t = LS.get('esc.web.trips', []); t.splice(+b.dataset.rmtrip, 1); LS.set('esc.web.trips', t); saveFavs(); renderFavs();
  });
  fb.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const d = favs.get(b.dataset.k); $('#favs').classList.remove('open'); explore(d.lat, d.lon, { hint: d.name }); });
  fb.querySelectorAll('[data-trip]').forEach(b => b.onclick = () => {
    const t = LS.get('esc.web.trips', [])[+b.dataset.trip]; if (!t) return;
    $('#favs').classList.remove('open'); replan(t.dest, t.input);
  });
}
function openFavs() { renderFavs(); $('#favs').classList.add('open'); $('#fClose').focus(); }
function closeFavs() { $('#favs').classList.remove('open'); $('#bFavs').focus({ preventScroll: true }); }
$('#bFavs').onclick = openFavs;
$('#fClose').onclick = closeFavs;
$('#favs').onclick = e => { if (e.target.id === 'favs') closeFavs(); };
// la tabulation reste dans la fenêtre « Mes voyages » tant qu'elle est ouverte
$('#favs').addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const f = [...$('#favs').querySelectorAll('button, [tabindex="0"], a[href]')].filter(x => x.offsetParent);
  if (!f.length) return;
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
});
saveFavs();

/* ============================ Recherche ============================ */
const q = $('#q'), sugg = $('#sugg');
let results = [], sel = -1, searchT, searchCtl, pendingEnter = false;
// importance d'un résultat : capitales et grandes villes avant les villages homonymes (N'Djamena la capitale avant
// les villages du même nom), grâce au type de lieu et à la taille de son emprise
const TYPE_W = { country: 9, state: 6, region: 6, city: 5, island: 5, archipelago: 4.5, town: 3, county: 3, national_park: 4, peak: 3, volcano: 3,
  beach: 3, lake: 3, village: 1, municipality: 2, district: 1, suburb: 0.5, hamlet: 0, locality: 0.3, neighbourhood: 0.2, residential: 0 };
function searchRank(p, q) {
  let r = TYPE_W[p.osm_value] ?? TYPE_W[p.type] ?? 1.5;
  if (p.extent) {
    const [x0, y1, x1, y0] = p.extent;
    const area = Math.abs((x1 - x0) * (y1 - y0)) * 111 * 111 * Math.cos(((y0 + y1) / 2) * DEG);
    r += Math.log10(area + 1) * 1.1;
  }
  if (norm(p.name) === norm(q)) r += 1.5;
  if (p.countrycode === 'FR') r += 0.3;
  return r;
}
q.addEventListener('input', () => {
  clearTimeout(searchT);
  const s = q.value.trim();
  pendingEnter = false; results = [];
  if (s.length < 2) { sugg.style.display = 'none'; return; }
  searchT = setTimeout(async () => {
    searchCtl?.abort(); searchCtl = new AbortController();
    try {
      const r = await getJSON(`https://photon.komoot.io/api?q=${encodeURIComponent(s)}&lang=fr&limit=12`, { signal: searchCtl.signal });
      const seen = new Set();
      results = (r.features || []).map(f => ({ p: f.properties, lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] }))
        .filter(x => { const k = norm([x.p.name, x.p.state, x.p.country].join('|')); if (seen.has(k)) return false; seen.add(k); return true; })
        .map((x, i) => ({ ...x, rank: searchRank(x.p, s) - i * 0.15 }))
        .sort((a, b) => b.rank - a.rank).slice(0, 7);
    } catch { results = []; }
    if (!results.length) {
      const n = norm(s), top = await loadTop();
      results = top.filter(p => norm(p[0]).startsWith(n) || norm(p[1]).startsWith(n)).slice(0, 7)
        .map(p => ({ p: { name: pname(p), state: p[4], country: countryInfo(p[3])?.name || p[3], type: kindOf(p) === 'ville' || kindOf(p) === 'capitale' ? 'city' : 'poi' }, lat: p[5], lon: p[6] }));
    }
    sel = -1;
    if (!results.length) {
      sugg.innerHTML = `<div class="sugg-empty">${I.search}<span><b>Aucun lieu trouvé pour « ${esc(s)} »</b><small>Vérifie l’orthographe, essaie le nom d’une ville proche, ou clique directement sur le globe.</small></span></div>`;
      sugg.style.display = 'block';
      return;
    }
    sugg.innerHTML = results.map((r, i) => `<button data-i="${i}" role="option">${I.pin}<span><b>${esc(r.p.name)}</b><small>${esc([r.p.state, r.p.country].filter(x => x && x !== r.p.name).join(', ') || 'Lieu')}</small></span></button>`).join('');
    sugg.style.display = results.length ? 'block' : 'none';
    sugg.querySelectorAll('button').forEach(b => b.onclick = () => choose(results[+b.dataset.i]));
    if (pendingEnter && results.length) { pendingEnter = false; choose(results[0]); }
  }, 250);
});
q.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault(); sel = Math.max(0, Math.min(results.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1)));
    sugg.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === sel));
  } else if (e.key === 'Enter') { if (results.length) choose(results[Math.max(0, sel)]); else pendingEnter = true; }
  else if (e.key === 'Escape') { sugg.style.display = 'none'; q.blur(); }
});
function choose(r) {
  if (!r) return;
  sugg.style.display = 'none'; q.value = r.p.name;
  panel.focus({ preventScroll: true });          // au clavier, on continue dans la fiche
  const t = r.p.osm_value || r.p.type;
  const zoom = t === 'country' ? 5 : t === 'state' ? 7 : ['city', 'town'].includes(t) ? 11 : 14;
  // l'emprise fournie par la recherche cadre le lieu entier (une île, une région, un parc), sinon zoom selon le type
  const e = r.p.extent;
  const bounds = e && Math.abs(e[2] - e[0]) > 0.005 ? [[e[0], e[3]], [e[2], e[1]]] : null;
  explore(r.lat, r.lon, { zoom, bounds, hint: r.p.name, label: r.p.name, pitch: zoom >= 11 ? 50 : 0 });
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
$('#bDiscover').onclick = () => openDiscover();
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
/* ---- style ---- */
function syncButtons() {
  $('#bStyle').dataset.tip = styleMode === 'realiste' ? 'Passer en style cartoon' : 'Passer en vue satellite';
}
$('#bStyle').onclick = async () => {
  styleMode = styleMode === 'realiste' ? 'cartoon' : 'realiste'; LS.set('esc.web.style', styleMode); syncButtons();
  toast(styleMode === 'realiste' ? 'Vue satellite réaliste' : 'Vue cartoon');
  const st = await buildStyle(styleMode);
  map.setStyle(st);
  map.once('style.load', () => { if (relief) map.setTerrain({ source: 'dem3d', exaggeration: 1.4 }); redrawAfterStyle(); redrawDiscover(); });
};
syncButtons();
$('#bGlobe').onclick = () => { closePanel(); map.flyTo({ center: map.getCenter(), zoom: isMobile() ? 1.0 : 2.0, pitch: 0, bearing: 0, duration: 2600, padding: NO_PAD }); };
addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'Escape') { if ($('#viewer').classList.contains('open')) $('#viewer').classList.remove('open'); else if ($('#favs').classList.contains('open')) closeFavs(); else closePanel(); }
  if ($('#viewer').classList.contains('open')) { if (e.key === 'ArrowLeft') $('#vPrev').click(); if (e.key === 'ArrowRight') $('#vNext').click(); return; }
  if (e.key === 'r' || e.key === 'R') randomTrip();
  if (e.key === 'o' || e.key === 'O') openDiscover();
  if (e.key === '/') { e.preventDefault(); q.focus(); }
});

initTransit({ getJSON, LS, haversine });
initProfile({ LS, esc, setPanel, toast, closePanel: () => closePanel(), onChange: () => refreshWelcome() });
syncProfileButton();
$('#bProfile').onclick = () => openProfile();
$('#wProf').onclick = () => openProfile();
const getBuffer = async u => { const r = await fetch(u); if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); };
initDiscover({
  getJSON, getBuffer, LS, esc, haversine, countryInfo, continentOf: cc => countries[(cc || '').toUpperCase()]?.ct, isTravelPhoto, geocodeCity, isMobile, setPanel,
  map: () => map, padding: panelPadding, explore: (lat, lon, o) => explore(lat, lon, o), route: h => setRoute(h),
});
initItinerary({
  getJSON, getBuffer, localCity, countryInfo, haversine, placesAround, kindOf, pname, notability, norm, LS, esc, toast, KIND_ICON, KIND_LABEL,
  map: () => map, padding: panelPadding, setPanel, onSaved: () => saveFavs(), share, isMobile,
  route: (dest, input) => setRoute('voyage=' + encodeTrip(dest, input)), climate,
  backToPlace: () => { clearTrip(); panelMode = 'place'; renderPanel(); },
});
// Sans WebGL (vieux navigateur, machine virtuelle, réglage de sécurité) ou si la carte ne se charge pas,
// le site reste utilisable : accueil, recherche « Où partir ? », fiches et itinéraires, sans le globe.
function hideLoading() { const l = $('#loading'); if (!l || l.dataset.gone) return; l.dataset.gone = 1; l.style.opacity = 0; setTimeout(() => l.remove(), 900); }
function webglOk() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
function startWithoutMap(why) {
  if (map) { try { map.remove(); } catch {} map = null; }
  document.body.classList.add('no-map');
  hideLoading();
  $('#noMapWhy').textContent = why;
  $('#noMap').hidden = false;
  $('#noMapGo').onclick = () => openDiscover();
  initWelcome();
  openFromHash(true);
}
if (!webglOk()) startWithoutMap('Ton navigateur ne peut pas afficher le globe 3D (WebGL indisponible).');
else initMap().catch(err => {
  console.error(err);
  startWithoutMap(/webgl/i.test(err.message) ? 'Ton navigateur ne peut pas afficher le globe 3D (WebGL indisponible).' : 'La carte n’a pas pu se charger (connexion lente ou service indisponible).');
});
