/* Bibliothèque « papier découpé » : formes, ombres, texte, cristaux de sel.
   Tout est déterministe : le rendu d'une image ne dépend que du temps t. */
'use strict';
const W = 1080, H = 1920, FPS = 15;           // animation « à la double » : 15 images uniques/s (rendues en 30 i/s)
const TAU = Math.PI * 2;
const P = {
  navy: '#0b2540', deep: '#0e4a78', cobalt: '#1f78b4', sea: '#2fa4d0', aqua: '#8fd8ea', foam: '#eaf8f6',
  salt: '#fffdf5', coral: '#ff6a4d', sun: '#ffc247', parch: '#f3e4c4', parch2: '#e4cf9f', ink: '#0a1c2e',
  rock: '#a8683f', rock2: '#8a5232', rock3: '#cf9059', sky: '#d3e7ef', grey: '#7d92a3', green: '#4f9a6b'
};
let cv, ctx, K = 0, T = 0, CUR_SCENE = 0;
const IMG = {};

/* ---------- maths ---------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, t0, d) => clamp((t - t0) / d);
const E = {
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  back: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  bounce: t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; }
};
function rnd(a) { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
const R = (seed) => rnd(seed * 9973 + 17);                       // aléa fixe par graine
const jit = (seed, amp) => (rnd(seed * 7919 + K * 104729 + 3) - .5) * 2 * amp; // « boil » : change à chaque image
const C = () => TIMING.cues;

/* ---------- état d'image ---------- */
function setTime(t) { K = Math.floor(t * FPS + 1e-6); T = K / FPS; return T; }

/* ---------- chemins ---------- */
function smoothClosed(pts) {           // courbe lisse passant près des points (milieux de segments)
  const n = pts.length; ctx.beginPath();
  let mx = (pts[n - 1][0] + pts[0][0]) / 2, my = (pts[n - 1][1] + pts[0][1]) / 2; ctx.moveTo(mx, my);
  for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
  ctx.closePath();
}
function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function dropPath(cx, cy, w, h) {
  const t = cy - h / 2, b = cy + h / 2; ctx.beginPath(); ctx.moveTo(cx, t);
  ctx.bezierCurveTo(cx + w * .10, cy - h * .24, cx + w * .5, cy - h * .02, cx + w * .5, cy + h * .17);
  ctx.bezierCurveTo(cx + w * .5, cy + h * .38, cx + w * .27, b, cx, b);
  ctx.bezierCurveTo(cx - w * .27, b, cx - w * .5, cy + h * .38, cx - w * .5, cy + h * .17);
  ctx.bezierCurveTo(cx - w * .5, cy - h * .02, cx - w * .10, cy - h * .24, cx, t); ctx.closePath();
}
function cloudPath(cx, cy, s) {
  ctx.beginPath();
  const c = [[-.9, .1, .5], [-.4, -.25, .62], [.2, -.4, .7], [.75, -.05, .55], [.15, .15, .62], [-.35, .2, .5], [.45, .22, .45]];
  for (const [dx, dy, r] of c) { ctx.moveTo(cx + dx * s + r * s, cy + dy * s); ctx.arc(cx + dx * s, cy + dy * s, r * s, 0, TAU); }
}

/* ---------- papier : ombre portée + corps + arête claire ---------- */
function paper(pathFn, fill, o = {}) {
  const sh = o.sh == null ? 12 : o.sh;
  ctx.save();
  if (sh > 0) { ctx.translate(sh * .45, sh); ctx.fillStyle = o.shc || 'rgba(6,18,36,.30)'; pathFn(); ctx.fill(); ctx.translate(-sh * .45, -sh); }
  ctx.fillStyle = fill; pathFn(); ctx.fill();
  if (o.edge !== false) { ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.edgec || 'rgba(255,255,255,.38)'; ctx.lineJoin = 'round'; pathFn(); ctx.stroke(); }
  ctx.restore();
}
function wobblePoly(cx, cy, pts, amp, seed) {      // polygone aux bords « découpés aux ciseaux »
  return pts.map((p, i) => [cx + p[0] + jit(seed + i, amp), cy + p[1] + jit(seed + i + 50, amp)]);
}

/* ---------- cristal de sel (cube isométrique) ---------- */
function cube(x, y, s, rot = 0, a = 1, glow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a;
  const u = s / 2, v = s * .29;
  if (glow > 0) { ctx.save(); ctx.globalAlpha *= glow; ctx.fillStyle = '#fff6c9'; ctx.beginPath(); ctx.arc(0, 0, s * .95, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = 'rgba(6,18,36,.28)'; ctx.beginPath(); ctx.moveTo(-u + 3, -v + 7); ctx.lineTo(0 + 3, -v * 2 + 7); ctx.lineTo(u + 3, -v + 7); ctx.lineTo(u + 3, v + 7); ctx.lineTo(0 + 3, v * 2 + 7); ctx.lineTo(-u + 3, v + 7); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(0, -v * 2); ctx.lineTo(u, -v); ctx.lineTo(0, 0); ctx.lineTo(-u, -v); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#dbe6f1'; ctx.beginPath(); ctx.moveTo(-u, -v); ctx.lineTo(0, 0); ctx.lineTo(0, v * 2); ctx.lineTo(-u, v); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#bccddf'; ctx.beginPath(); ctx.moveTo(u, -v); ctx.lineTo(0, 0); ctx.lineTo(0, v * 2); ctx.lineTo(u, v); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/* ---------- texte ---------- */
function font(size, w = 700) { ctx.font = `${w} ${size}px Fredoka, sans-serif`; }
function textW(txt, size) { font(size); return ctx.measureText(txt).width; }
function extruded(txt, x, y, size, fill, side, o = {}) {
  const depth = o.depth == null ? Math.round(size * .07) : o.depth;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(o.sx || o.scale || 1, o.sy || o.scale || 1);
  font(size); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(6,18,36,.32)'; ctx.fillText(txt, depth * .5, depth * 1.9 + 2);
  ctx.fillStyle = side; for (let i = depth; i > 0; i -= 2) ctx.fillText(txt, 0, i);
  ctx.fillStyle = fill; ctx.fillText(txt, 0, 0);
  ctx.restore();
}
function tag(txt, x, y, size, o = {}) {      // étiquette en bande de papier
  const px = o.px == null ? size * .42 : o.px, py = o.py == null ? size * .26 : o.py;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(o.scale == null ? 1 : o.scale, o.scale == null ? 1 : o.scale);
  const lines = Array.isArray(txt) ? txt : [txt]; font(size);
  const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + px * 2, lh = size * 1.08, h = lines.length * lh + py * 2;
  const bg = o.bg || P.salt, fg = o.fg || P.navy;
  paper(() => rrect(-w / 2, -h / 2, w, h, o.r == null ? size * .3 : o.r), bg, { sh: o.sh == null ? 9 : o.sh });
  ctx.fillStyle = fg; font(size); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, 0, -h / 2 + py + lh * (i + .5) + size * .03));
  ctx.restore(); return { w, h };
}
const pop = (t, t0, d = .33) => { const p = prog(t, t0, d); return p <= 0 ? 0 : E.back(p); };   // échelle avec rebond
const fade = (t, t0, d = .25) => prog(t, t0, d);

/* ---------- vagues, nuages, pluie ---------- */
function waveBand(y, amp, wl, ph, fill, o = {}) {
  const seed = o.seed || 1, step = 30;
  const path = () => {
    ctx.beginPath(); ctx.moveTo(-40, H + 60);
    for (let x = -40; x <= W + 40; x += step) {
      const yy = y + amp * Math.sin(x / wl * TAU + ph) + amp * .35 * Math.sin(x / (wl * .43) * TAU - ph * 1.7) + jit(seed + x, o.boil == null ? 1.2 : o.boil);
      ctx.lineTo(x, yy);
    }
    ctx.lineTo(W + 40, H + 60); ctx.closePath();
  };
  paper(path, fill, { sh: o.sh == null ? 14 : o.sh, edgec: 'rgba(255,255,255,.5)', lw: 4 });
}
function cloud(cx, cy, s, fill) { paper(() => cloudPath(cx, cy, s), fill, { sh: 14, edge: false }); }
function rain(n, speed, color, x0 = 0, x1 = W, y0 = 0, y1 = H, len = 80, wd = 9, seed = 5, slant = .12) {
  ctx.save(); ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const rx = R(seed + i * 3), ry = R(seed + i * 3 + 1), sp = .7 + R(seed + i * 3 + 2) * .6;
    const x = lerp(x0, x1, rx), span = y1 - y0 + len * 2, y = y0 - len + ((ry * span + T * speed * sp) % span);
    ctx.save(); ctx.translate(x - (y - y0) * slant, y); ctx.rotate(-slant); rrect(-wd / 2, -len / 2, wd, len, wd / 2); ctx.fill(); ctx.restore();
  }
  ctx.restore();
}

/* ---------- photo collée (carte de papier + adhésif) ---------- */
function photoCard(img, cx, cy, w, h, rot, o = {}) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); const sc = o.scale == null ? 1 : o.scale; ctx.scale(sc, sc);
  const b = o.border == null ? 18 : o.border;
  const outer = wobblePoly(0, 0, [[-w / 2 - b, -h / 2 - b], [0, -h / 2 - b - 2], [w / 2 + b, -h / 2 - b], [w / 2 + b + 2, 0], [w / 2 + b, h / 2 + b], [0, h / 2 + b + 2], [-w / 2 - b, h / 2 + b], [-w / 2 - b - 2, 0]], 1.4, o.seed || 3);
  paper(() => smoothClosed(outer.map(p => [p[0] * 1, p[1] * 1])), P.salt, { sh: 18, edgec: 'rgba(255,255,255,0)' });
  ctx.save(); rrect(-w / 2, -h / 2, w, h, o.r == null ? 10 : o.r); ctx.clip();
  const iw = img.width, ih = img.height, z = (o.zoom || 1), fx = o.fx == null ? .5 : o.fx, fy = o.fy == null ? .5 : o.fy;
  const s = Math.max(w / iw, h / ih) * z, dw = iw * s, dh = ih * s;
  const dx = -w / 2 - (dw - w) * fx, dy = -h / 2 - (dh - h) * fy;
  if (o.filter) ctx.filter = o.filter;
  ctx.drawImage(img, dx, dy, dw, dh); ctx.filter = 'none';
  if (o.draw) o.draw(); ctx.restore();
  if (o.tape !== false) for (const [tx, ty, tr] of [[-w / 2 - 6, -h / 2 - 8, -.6], [w / 2 + 6, -h / 2 - 8, .6]]) {
    ctx.save(); ctx.translate(tx, ty); ctx.rotate(tr); ctx.fillStyle = 'rgba(255,194,71,.88)'; ctx.fillRect(-70, -22, 140, 44);
    ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(-70, -22, 140, 8); ctx.restore();
  }
  ctx.restore();
}

/* ---------- transition « balayage de papier » ---------- */
function wipeSheets(t, tb, d = .62) {
  const p = (t - (tb - d / 2)) / d; if (p <= 0 || p >= 1) return;
  const cols = [P.sun, P.coral, P.salt]; const sheetH = H + 700;
  cols.forEach((c, i) => {
    const pp = clamp(p * 1.15 - i * .07); const top = lerp(H + 60, -sheetH + 40, pp);
    paper(() => { ctx.beginPath(); ctx.moveTo(-60, top + sheetH); ctx.lineTo(-60, top);
      for (let x = -60; x <= W + 60; x += 40) ctx.lineTo(x, top + 26 * Math.sin(x / 130 + i * 2) + jit(x + i * 99, 3));
      ctx.lineTo(W + 60, top); ctx.lineTo(W + 60, top + sheetH); ctx.closePath(); }, c, { sh: 22 });
  });
}

/* ---------- grain du papier + vignette ---------- */
let GRAIN = null;
function makeGrain() {
  GRAIN = document.createElement('canvas'); GRAIN.width = 540; GRAIN.height = 960; const g = GRAIN.getContext('2d');
  const id = g.createImageData(540, 960);
  for (let i = 0; i < id.data.length; i += 4) { const v = 200 + rnd(i * .25 + 7) * 55; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
  g.putImageData(id, 0, 0);
}
function grain() {
  if (!GRAIN) makeGrain();
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .34;
  const ox = -Math.floor(rnd(K * 3 + 1) * 80), oy = -Math.floor(rnd(K * 3 + 2) * 80);
  ctx.drawImage(GRAIN, ox, oy, 1080 + 160, 1920 + 160); ctx.restore();
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .78); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(4,12,26,.28)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

/* ---------- sous-titres (bandes de papier marine, texte blanc) ---------- */
function wrapLines(txt, size, maxW) {
  font(size); const words = txt.split(' '); const lines = []; let cur = '';
  for (const w of words) { const t2 = cur ? cur + ' ' + w : w; if (ctx.measureText(t2).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t2; }
  if (cur) lines.push(cur); return lines;
}
function subtitles(t) {
  const subs = TIMING.subs; let s = null;
  for (const x of subs) if (t >= x.start - .02 && t < x.end) s = x;
  if (!s) return;
  const size = 68, lines = wrapLines(s.text, size, 860);
  const a = pop(t, s.start, .26);
  const k = subs.indexOf(s); const rot = (rnd(k * 11 + 1) - .5) * .022 + jit(k, .002);
  ctx.save(); ctx.translate(W / 2 - 20, 1352); ctx.scale(.9 + .1 * a, .9 + .1 * a); ctx.rotate(rot); ctx.globalAlpha = clamp(a * 2);
  const out = prog(t, s.end - .08, .08); ctx.globalAlpha *= 1 - out;
  const wmax = Math.max(...lines.map(l => textW(l, size))) + 66, lh = size * 1.12, h = lines.length * lh + 34;
  paper(() => rrect(-wmax / 2, -h / 2, wmax, h, 30), 'rgba(9,31,56,.94)', { sh: 10, edgec: 'rgba(255,255,255,.18)', lw: 2 });
  ctx.fillStyle = '#fffdf5'; font(size); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, 0, -h / 2 + 17 + lh * (i + .5) + 2));
  ctx.restore();
}
