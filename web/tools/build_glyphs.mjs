/* Fabrique les polices de la carte (glyphes SDF au format MapLibre) à partir des polices Google Fonts.
 *
 * Prérequis : npm install fontnik ; pip install fonttools
 * Usage : node web/tools/build_glyphs.mjs <dossier contenant Inter.ttf et FrauncesItalic.ttf> <dossier node_modules contenant fontnik>
 *
 * Sortie : web/fonts/<Nom de police>/<début>-<fin>.pbf, seulement pour les plages de caractères que la police contient.
 * Les autres plages (thaï, chinois…) sont servies par la police Noto d'OpenFreeMap (voir le protocole « glyph » d'app.js).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const [src, nm] = process.argv.slice(2);
const fontnik = createRequire(path.join(nm, 'x.js'))('fontnik');
const OUT = new URL('../fonts/', import.meta.url).pathname;

// police variable → instance statique (fonttools)
const FACES = [
  { name: 'Inter Medium', file: 'Inter.ttf', axes: 'wght=500 opsz=14' },
  { name: 'Inter SemiBold', file: 'Inter.ttf', axes: 'wght=600 opsz=14' },
  { name: 'Fraunces Italic', file: 'FrauncesItalic.ttf', axes: 'wght=420 opsz=24 SOFT=50 WONK=0' },
];
const load = buf => new Promise((res, rej) => fontnik.load(buf, (e, f) => e ? rej(e) : res(f)));
const range = (buf, start, end) => new Promise((res, rej) => fontnik.range({ font: buf, start, end }, (e, d) => e ? rej(e) : res(d)));

for (const f of FACES) {
  const ttf = path.join(src, f.name.replace(/ /g, '') + '.ttf');
  execFileSync('python3', ['-m', 'fontTools.varLib.instancer', path.join(src, f.file), ...f.axes.split(' '), '-o', ttf, '-q']);
  const buf = fs.readFileSync(ttf);
  const [info] = await load(buf);
  const cps = new Set(info.points);
  const dir = path.join(OUT, f.name);
  fs.mkdirSync(dir, { recursive: true });
  let n = 0;
  for (let s = 0; s < 65536; s += 256) {
    let has = false;
    for (let c = s; c < s + 256; c++) if (cps.has(c)) { has = true; break; }
    if (!has) continue;
    fs.writeFileSync(path.join(dir, `${s}-${s + 255}.pbf`), await range(buf, s, s + 255));
    n++;
  }
  console.log(f.name, n, 'plages');
}
