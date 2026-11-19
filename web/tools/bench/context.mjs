/* Contexte « hors navigateur » pour exécuter les modules d'Escapade sous Node (banc d'essai).
 * Données lues sur le disque ; aucun service en ligne (les trajets sont estimés, comme quand les services ne répondent pas). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..') + '/';
globalThis.innerWidth ??= 1440; globalThis.innerHeight ??= 900;

const meta = JSON.parse(fs.readFileSync(WEB + 'data/places-meta.json'));
const DEG = Math.PI / 180;
export const haversine = (a, b, c, d) => { const x = Math.sin((c - a) * DEG / 2) ** 2 + Math.cos(a * DEG) * Math.cos(c * DEG) * Math.sin((d - b) * DEG / 2) ** 2; return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, x))); };
const cache = new Map();
const cell = k => { if (!cache.has(k)) { try { cache.set(k, JSON.parse(fs.readFileSync(WEB + `data/places/${k}.json`))); } catch { cache.set(k, []); } } return cache.get(k); };
export async function placesAround(lat, lon, km) {
  const C5 = meta.cell, cells = new Set(meta.cells), dLat = km / 111, dLon = Math.min(180, km / (111 * Math.max(0.05, Math.cos(lat * DEG))));
  const out = [];
  for (let a = Math.floor((lat - dLat) / C5) * C5; a <= lat + dLat; a += C5) for (let b = Math.floor((lon - dLon) / C5) * C5; b <= lon + dLon; b += C5) {
    const k = `${a}_${((b + 180) % 360 + 360) % 360 - 180}`; if (!cells.has(k)) continue;
    for (const p of cell(k)) { const d = haversine(lat, lon, p[5], p[6]); if (d <= km) out.push({ p, d }); }
  }
  return out.sort((x, y) => x.d - y.d);
}
export const kindOf = p => meta.kinds[p[2]];
export const notability = p => Math.log1p(p[9]) * 2.2 + Math.log10(p[7] + 10) * 0.8 + (kindOf(p) === 'capitale' ? 3 : 0);
export const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const pname = p => p[1] || p[0];
const store = new Map();
export const LS = { get: (k, d) => store.has(k) ? store.get(k) : d, set: (k, v) => store.set(k, v) };
export const ctx = {
  getJSON: async u => { if (u.startsWith('data/')) return JSON.parse(fs.readFileSync(WEB + u)); throw new Error('hors ligne (banc d’essai)'); },
  getBuffer: async u => { const b = fs.readFileSync(WEB + u); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); },
  haversine, placesAround, kindOf, pname, notability, norm, LS, esc: s => s, toast() {}, KIND_ICON: {}, KIND_LABEL: {}, isMobile: () => false,
};
