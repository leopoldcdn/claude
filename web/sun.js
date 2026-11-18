/* Jour et nuit en temps réel.
 * - position du soleil (point subsolaire) à partir de l'heure UTC ;
 * - protocole de tuiles « dn:// » : assombrit chaque pixel de l'image du globe selon la hauteur du soleil
 *   et y allume les lumières des villes (NASA Black Marble) côté nuit ;
 * - grille GeoJSON d'ombre pour les zooms rapprochés (carte vectorielle).
 */
const DEG = Math.PI / 180;

export function subsolar(date = new Date()) {
  const d = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 864e5;
  const g = (357.529 + 0.98560028 * d) * DEG;
  const q = 280.459 + 0.98564736 * d;
  const L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * DEG;
  const e = (23.439 - 0.00000036 * d) * DEG;
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) / DEG / 15;
  const decl = Math.asin(Math.sin(e) * Math.sin(L)) / DEG;
  const gmst = (18.697374558 + 24.06570982441908 * d) % 24;
  let lon = (ra - gmst) * 15;
  lon = ((lon + 540) % 360) - 180;
  return { lat: decl, lon };
}
/** sinus de la hauteur du soleil au point (lat, lon) */
export function sunSin(lat, lon, sun) {
  return Math.sin(lat * DEG) * Math.sin(sun.lat * DEG) + Math.cos(lat * DEG) * Math.cos(sun.lat * DEG) * Math.cos((lon - sun.lon) * DEG);
}
export function phase(lat, lon, date = new Date()) {
  const a = Math.asin(sunSin(lat, lon, subsolar(date))) / DEG;
  return a > 0 ? 'jour' : a > -6 ? 'crépuscule' : 'nuit';
}
const S_NIGHT = Math.sin(-10 * DEG), S_DAY = Math.sin(3 * DEG);
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* ----------------------------- grille d'ombre ----------------------------- */
export function nightGrid(date = new Date(), step = 1.5) {
  const sun = subsolar(date);
  const feats = [];
  for (let la = -85; la < 85; la += step) {
    for (let lo = -180; lo < 180; lo += step) {
      const s = sunSin(la + step / 2, lo + step / 2, sun);
      const o = 1 - smooth(Math.sin(-12 * DEG), Math.sin(2 * DEG), s);
      if (o < 0.02) continue;
      const t = Math.min(la + step, 85);
      feats.push({ type: 'Feature', properties: { o: Math.round(o * 100) / 100 },
        geometry: { type: 'Polygon', coordinates: [[[lo, la], [lo + step, la], [lo + step, t], [lo, t], [lo, la]]] } });
    }
  }
  return { type: 'FeatureCollection', features: feats };
}

/* ----------------------------- protocole de tuiles ----------------------------- */
const SOURCES = {
  sat: (z, x, y) => `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/${z}/${y}/${x}.jpg`,
  lights: (z, x, y) => `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/${z}/${y}/${x}.png`,
};
let cartoonBase = '';
export function setCartoonBase(url) { cartoonBase = url; }

async function loadBitmap(url, signal) {
  const r = await fetch(url, { signal, mode: 'cors' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return createImageBitmap(await r.blob());
}
function canvas(n) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(n, n);
  const c = document.createElement('canvas'); c.width = c.height = n; return c;
}
async function encode(cv, type) {
  const blob = cv.convertToBlob ? await cv.convertToBlob({ type, quality: 0.9 }) : await new Promise(r => cv.toBlob(r, type, 0.9));
  return blob.arrayBuffer();
}

/** Assombrit une tuile et y ajoute les lumières nocturnes. */
function shade(dayImg, lightsImg, z, x, y, n, date) {
  const cv = canvas(n), ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(dayImg, 0, 0, n, n);
  const day = ctx.getImageData(0, 0, n, n);
  let lights = null;
  if (lightsImg) { ctx.clearRect(0, 0, n, n); ctx.drawImage(lightsImg, 0, 0, n, n); lights = ctx.getImageData(0, 0, n, n).data; }
  const px = day.data, sun = subsolar(date);
  const sinD = Math.sin(sun.lat * DEG), cosD = Math.cos(sun.lat * DEG);
  const world = n * 2 ** z;
  const cosCol = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const lon = ((x * n + i + 0.5) / world) * 360 - 180;
    cosCol[i] = Math.cos((lon - sun.lon) * DEG);
  }
  for (let j = 0; j < n; j++) {
    const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y * n + j + 0.5) / world)));
    const a = Math.sin(lat) * sinD, b = Math.cos(lat) * cosD;
    for (let i = 0; i < n; i++) {
      const s = a + b * cosCol[i];
      const k = (j * n + i) * 4;
      if (s > 0.12) continue;                       // plein jour : pixel inchangé
      const dayF = smooth(S_NIGHT, S_DAY, s);
      const light = 0.07 + 0.93 * dayF;
      const dusk = Math.exp(-(((s - 0.01) / 0.045) ** 2)) * 0.35;  // lueur orangée au crépuscule
      let r = px[k] * light * (1 + dusk * 0.9), g = px[k + 1] * light * (1 + dusk * 0.25), bl = px[k + 2] * light * (1 - dusk * 0.3) + (1 - dayF) * 6;
      if (lights) {
        const nightF = 1 - smooth(S_NIGHT, Math.sin(-1 * DEG), s);
        const l = Math.max(0, (lights[k] * 0.4 + lights[k + 1] * 0.4 + lights[k + 2] * 0.2) - 38) / 217;
        const v = l * l * nightF * 330;
        r += v; g += v * 0.78; bl += v * 0.45;
      }
      px[k] = r > 255 ? 255 : r; px[k + 1] = g > 255 ? 255 : g; px[k + 2] = bl > 255 ? 255 : bl;
    }
  }
  ctx.putImageData(day, 0, 0);
  return cv;
}
/** Tuile transparente qui ne garde que les lumières côté nuit. */
function lightsOnly(img, z, x, y, n, date) {
  const cv = canvas(n), ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, n, n);
  const im = ctx.getImageData(0, 0, n, n), px = im.data, sun = subsolar(date);
  const world = n * 2 ** z;
  for (let j = 0; j < n; j++) {
    const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y * n + j + 0.5) / world))) / DEG;
    for (let i = 0; i < n; i++) {
      const lon = ((x * n + i + 0.5) / world) * 360 - 180;
      const k = (j * n + i) * 4;
      const nightF = 1 - smooth(S_NIGHT, Math.sin(-1 * DEG), sunSin(lat, lon, sun));
      const l = Math.max(0, (px[k] * 0.4 + px[k + 1] * 0.4 + px[k + 2] * 0.2) - 38) / 217;
      px[k] = 255; px[k + 1] = 214; px[k + 2] = 150; px[k + 3] = Math.min(255, l * nightF * 420);
    }
  }
  ctx.putImageData(im, 0, 0);
  return cv;
}

/** Tuile transparente d'ombre nocturne, sans image source : dégradé lisse quel que soit le zoom. */
function shadeOnly(z, x, y, n, date) {
  const cv = canvas(n), ctx = cv.getContext('2d');
  const im = ctx.createImageData(n, n), px = im.data, sun = subsolar(date);
  const sinD = Math.sin(sun.lat * DEG), cosD = Math.cos(sun.lat * DEG), world = n * 2 ** z;
  const cosCol = new Float32Array(n);
  for (let i = 0; i < n; i++) cosCol[i] = Math.cos((((x * n + i + 0.5) / world) * 360 - 180 - sun.lon) * DEG);
  for (let j = 0; j < n; j++) {
    const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y * n + j + 0.5) / world)));
    const a = Math.sin(lat) * sinD, b = Math.cos(lat) * cosD;
    for (let i = 0; i < n; i++) {
      const s = a + b * cosCol[i], k = (j * n + i) * 4;
      const dark = 1 - smooth(S_NIGHT, S_DAY, s);
      const dusk = Math.exp(-(((s - 0.01) / 0.05) ** 2));
      px[k] = 4 + 120 * dusk; px[k + 1] = 10 + 40 * dusk; px[k + 2] = 30;
      px[k + 3] = Math.max(dark * 228, dusk * 45);
    }
  }
  ctx.putImageData(im, 0, 0);
  return cv;
}

/**
 * dn://<sat|cartoon|lights|shade>/{z}/{x}/{y}?t=<horodatage>&on=<0|1>
 * Les tuiles de zoom ≤ darkMax sont assombries ici ; au-delà, c'est la grille d'ombre qui s'en charge.
 */
export function registerProtocol(maplibregl, darkMax = 5) {
  maplibregl.addProtocol('dn', async (params, abortController) => {
    const u = new URL(params.url.replace(/^dn:\/\//, 'http://dn/'));
    const [kind, zs, xs, ys] = u.pathname.split('/').filter(Boolean);
    const z = +zs, x = +xs, y = +ys;
    const on = u.searchParams.get('on') !== '0';
    const date = new Date(+u.searchParams.get('t') || Date.now());
    const signal = abortController.signal;
    if (kind === 'shade') {
      if (!on) return { data: await encode(canvas(1), 'image/png') };
      return { data: await encode(shadeOnly(z, x, y, 256, date), 'image/png') };
    }
    if (kind === 'lights') {
      if (!on) return { data: await encode(canvas(1), 'image/png') };
      const img = await loadBitmap(SOURCES.lights(z, x, y), signal);
      return { data: await encode(lightsOnly(img, z, x, y, 256, date), 'image/png') };
    }
    const url = kind === 'cartoon' ? `${cartoonBase}${z}/${x}/${y}.jpg` : SOURCES.sat(z, x, y);
    const zMax = darkMax;
    if (!on || z > zMax) {
      const r = await fetch(url, { signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return { data: await r.arrayBuffer() };
    }
    const n = kind === 'cartoon' ? 512 : 256;
    const [dayImg, lightsImg] = await Promise.all([
      loadBitmap(url, signal),
      loadBitmap(SOURCES.lights(Math.min(z, 8), x, y), signal).catch(() => null)
    ]);
    return { data: await encode(shade(dayImg, lightsImg, z, x, y, n, date), 'image/jpeg') };
  });
}

