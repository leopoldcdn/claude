/* Masque terre / mer (data/land.bin, généré par tools/build_landmask.py).
 * landId(lat, lon) donne le numéro de la terre (continent ou île) sous un point, ou 0 en mer.
 * Deux lieux sur la même terre sont reliables par la route ; sinon il faut un bateau ou un avion. */
let rows = null, W = 0, H = 0, loading = null;

/* Principales liaisons fixes (ponts, tunnels, digues) : les terres qu'elles relient comptent comme une seule.
 * Chaque paire donne un point de chaque côté. Les liaisons par ferry ne sont pas listées : elles demandent un bateau. */
const LINKS = [
  [[45.44, 12.33], [45.49, 12.24]],                         // Venise – Mestre
  [[55.68, 12.57], [55.40, 10.39]], [[55.40, 10.39], [56.15, 10.20]], [[55.68, 12.57], [55.60, 13.00]], // Danemark, Øresund
  [[51.50, -0.12], [48.85, 2.35]],                          // tunnel sous la Manche
  [[33.96, 130.94], [33.88, 130.88]], [[34.65, 133.92], [34.34, 134.05]], [[40.82, 140.74], [41.77, 140.73]], // Japon
  [[5.41, 100.33], [5.40, 100.36]], [[7.88, 98.39], [8.45, 98.53]], [[1.35, 103.82], [1.49, 103.74]],        // Penang, Phuket, Singapour
  [[22.28, 114.16], [22.32, 114.17]], [[22.26, 113.95], [22.32, 114.17]],                                   // Hong Kong
  [[40.78, -73.97], [40.73, -74.17]], [[40.65, -73.95], [40.78, -73.97]], [[40.58, -74.15], [40.65, -73.95]], // New York
  [[45.50, -73.57], [45.45, -73.45]], [[45.50, -73.57], [45.60, -73.75]],                                   // Montréal
  [[46.20, -1.40], [46.16, -1.15]], [[45.93, -1.30], [45.94, -0.96]], [[46.98, -2.25], [46.90, -2.05]],     // Ré, Oléron, Noirmoutier
  [[54.42, 13.43], [54.31, 13.09]], [[53.95, 14.05], [53.90, 13.80]],                                       // Rügen, Usedom
  [[24.55, -81.78], [25.76, -80.19]], [[26.07, 50.55], [26.30, 50.15]],                                     // Keys, Bahreïn
  [[59.33, 18.07], [59.40, 17.95]], [[60.17, 24.94], [60.25, 24.90]], [[53.40, -6.25], [53.35, -6.30]],     // Stockholm, Helsinki, Dublin
];
const parent = new Map();
const find = a => { while (parent.has(a) && parent.get(a) !== a) a = parent.get(a); return a; };

export function loadLand(fetchBuffer) {
  if (rows) return Promise.resolve(true);
  if (!loading) loading = fetchBuffer('data/land.bin').then(buf => {
    const v = new DataView(buf);
    if (String.fromCharCode(v.getUint8(0), v.getUint8(1), v.getUint8(2), v.getUint8(3)) !== 'LND2') throw new Error('masque terre invalide');
    W = v.getUint16(4, true); H = v.getUint16(6, true);
    const r = new Array(H);
    let o = 8;
    for (let y = 0; y < H; y++) {
      const n = v.getUint16(o, true); o += 2;
      const runs = new Uint32Array(n * 3);
      for (let i = 0; i < n; i++) { runs[i * 3] = v.getUint16(o, true); runs[i * 3 + 1] = v.getUint16(o + 2, true); runs[i * 3 + 2] = v.getUint32(o + 4, true); o += 8; }
      r[y] = runs;
    }
    rows = r;
    for (const [a, b] of LINKS) {
      const x = find(raw(...a)), y = find(raw(...b));
      if (x && y && x !== y) parent.set(x, y);
    }
    return true;
  }).catch(e => { loading = null; throw e; });
  return loading;
}
export const landReady = () => !!rows;

function at(x, y) {
  if (y < 0 || y >= H) return 0;
  x = ((x % W) + W) % W;
  const runs = rows[y];
  let lo = 0, hi = runs.length / 3 - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1, a = runs[mid * 3], b = runs[mid * 3 + 1];
    if (x < a) hi = mid - 1; else if (x >= b) lo = mid + 1; else return runs[mid * 3 + 2];
  }
  return 0;
}
/** Numéro de terre sous le point ; un point côtier tombé « en mer » est rattaché à la terre la plus proche (≈ 10 km). */
export function landId(lat, lon) {
  if (!rows) return -1;                       // masque pas encore chargé : inconnu
  return find(raw(lat, lon));
}
function raw(lat, lon) {
  const x = Math.floor((lon + 180) / 360 * W), y = Math.floor((90 - lat) / 180 * H);
  const id = at(x, y);
  if (id) return id;
  for (let r = 1; r <= 2; r++)
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const v = at(x + dx, y + dy); if (v) return v;
    }
  return 0;
}
/** true si les deux lieux sont sur la même terre (ou si on ne peut pas le savoir). */
export function sameLand(a, b) {
  const x = landId(a.lat, a.lon), y = landId(b.lat, b.lon);
  return x < 0 || y < 0 || (x !== 0 && x === y);
}
