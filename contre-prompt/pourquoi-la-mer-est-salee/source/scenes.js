/* Scènes : chaque fonction dessine l'image au temps T (absolu), calée sur les repères de la voix off (TIMING.cues). */
'use strict';
const cue = n => TIMING.cues[n];
function camera(s, z0, z1, cx = W / 2, cy = 900, dx = 0, dy = 0) {
  const z = lerp(z0, z1, clamp(s)); ctx.translate(cx + dx * s, cy + dy * s); ctx.scale(z, z); ctx.translate(-cx, -cy);
}
function fillBg(c) { ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); }
function gradBg(c0, c1) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }

/* --- petits dessins réutilisables --- */
function ribbon(pts, wd, fill, upto = 1, o = {}) {          // ruban de papier (rivière) tracé jusqu'à upto (0..1)
  const n = pts.length - 1, m = Math.max(1, Math.floor(n * clamp(upto) + 1e-6)), part = pts.slice(0, m + 1);
  const last = pts[Math.min(m, n)], nxt = pts[Math.min(m + 1, n)], f = clamp(upto) * n - m;
  if (m < n && f > 0) part.push([lerp(last[0], nxt[0], f), lerp(last[1], nxt[1], f)]);
  if (part.length < 2) return;
  const path = () => { ctx.beginPath(); ctx.moveTo(part[0][0], part[0][1]); for (let i = 1; i < part.length - 1; i++) { const a = part[i], b = part[i + 1]; ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); } const e = part[part.length - 1]; ctx.lineTo(e[0], e[1]); };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.translate(4, o.sh == null ? 10 : o.sh); ctx.strokeStyle = 'rgba(6,18,36,.28)'; ctx.lineWidth = wd; path(); ctx.stroke(); ctx.translate(-4, -(o.sh == null ? 10 : o.sh));
  ctx.strokeStyle = fill; ctx.lineWidth = wd; path(); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.38)'; ctx.lineWidth = Math.max(3, wd * .16); ctx.translate(0, -wd * .18); path(); ctx.stroke();
  ctx.restore();
}
function pointOn(pts, u) { const n = pts.length - 1, i = Math.min(n - 1, Math.floor(u * n)), f = u * n - i; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; }
function sunDisc(x, y, r, rot) {
  ctx.save(); ctx.translate(x, y);
  for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate(rot + i * TAU / 12); paper(() => { ctx.beginPath(); ctx.moveTo(r * 1.12, -r * .12); ctx.lineTo(r * 1.62, 0); ctx.lineTo(r * 1.12, r * .12); ctx.closePath(); }, P.sun, { sh: 6 }); ctx.restore(); }
  paper(() => { ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); }, P.sun, { sh: 10 }); ctx.restore();
}
function wisp(x, y, s, a, rot = 0) {                          // volute de vapeur en papier
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a;
  paper(() => { ctx.beginPath(); ctx.moveTo(-s * .5, s * .6); ctx.bezierCurveTo(-s * 1.0, s * .2, -s * .1, 0, -s * .3, -s * .35); ctx.bezierCurveTo(-s * .45, -s * .75, s * .35, -s * .8, s * .3, -s * .3);
    ctx.bezierCurveTo(s * .2, s * .05, s * .8, s * .1, s * .45, s * .6); ctx.closePath(); }, '#f3fbff', { sh: 6, edgec: 'rgba(180,220,240,.6)' });
  ctx.restore();
}
function co2Mol(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  for (const dx of [-1.15, 1.15]) paper(() => { ctx.beginPath(); ctx.arc(dx * s, 0, s * .8, 0, TAU); }, P.coral, { sh: 6 });
  paper(() => { ctx.beginPath(); ctx.arc(0, 0, s, 0, TAU); }, P.ink, { sh: 6 });
  ctx.restore();
}
function co2Text(x, y, size, fg) {
  ctx.save(); font(size); const w1 = ctx.measureText('CO').width; font(size * .62); const w2 = ctx.measureText('2').width;
  const tw = w1 + w2, x0 = x - tw / 2; ctx.fillStyle = fg; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  font(size); ctx.fillText('CO', x0, y); font(size * .62); ctx.fillText('2', x0 + w1 + 2, y + size * .2); ctx.restore();
}
function mountainPath(cx, base, peak, hw, seed, rough = 1) {
  const pts = [[cx - hw, base + 80], [cx - hw * .78, base - (base - peak) * .25], [cx - hw * .45, base - (base - peak) * .62], [cx - hw * .18, base - (base - peak) * .86], [cx, peak], [cx + hw * .2, base - (base - peak) * .8], [cx + hw * .46, base - (base - peak) * .5], [cx + hw * .76, base - (base - peak) * .22], [cx + hw, base + 80]];
  return pts.map((p, i) => [p[0] + jit(seed + i, 1.5 * rough), p[1] + jit(seed + i + 40, 1.5 * rough)]);
}
function polyPath(pts) { return () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }; }
function bubbles(n, seed, x0, x1, speed, color = 'rgba(190,235,255,.55)') {
  ctx.save(); ctx.fillStyle = color;
  for (let i = 0; i < n; i++) { const x = lerp(x0, x1, R(seed + i)), r = 8 + R(seed + i + 9) * 22, y = H + 40 - ((R(seed + i + 5) * H + T * speed * (.6 + R(seed + i + 2))) % (H + 80));
    ctx.beginPath(); ctx.arc(x + Math.sin(T * 2 + i) * 10, y, r, 0, TAU); ctx.fill(); }
  ctx.restore();
}


function mountain(cx, base, peak, hw, seed, cols, o = {}) {
  const n = 9, L = [], Rr = [], hl = hw * (o.asym || 1);
  L.push([cx - hl, base + 80]);
  for (let i = 1; i <= n; i++) { const f = i / (n + 1), h = Math.pow(f, 1.12); L.push([cx - hl * (1 - f) + (R(seed + 20 + i) - .5) * hl * .11, base - (base - peak) * h * (.9 + .2 * R(seed + i)) + jit(seed + i, 1.2)]); }
  const pk = [cx, peak];
  for (let i = n; i >= 1; i--) { const f = i / (n + 1); Rr.push([cx + hw * (1 - f) + (R(seed + 60 + i) - .5) * hw * .11, base - (base - peak) * Math.pow(f, 1.05) * (.86 + .24 * R(seed + 40 + i)) + jit(seed + 40 + i, 1.2)]); }
  Rr.push([cx + hw, base + 80]);
  const outline = [...L, pk, ...Rr], path = polyPath(outline);
  paper(path, cols[0], { sh: o.sh == null ? 16 : o.sh });
  ctx.save(); path(); ctx.clip();
  const y = f => base - (base - peak) * f;
  ctx.fillStyle = cols[1]; ctx.beginPath(); ctx.moveTo(cx, peak); ctx.lineTo(cx + hw * .07, y(.62)); ctx.lineTo(cx - hw * .03, y(.4)); ctx.lineTo(cx + hw * .12, y(.18)); ctx.lineTo(cx + hw * .02, base + 80); ctx.lineTo(cx + hw + 40, base + 80);
  for (let i = Rr.length - 1; i >= 0; i--) ctx.lineTo(Rr[i][0], Rr[i][1]); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,232,196,.30)'; ctx.lineWidth = 9;
  for (let i = 0; i < 4; i++) { const yy = peak + (base - peak) * (.28 + i * .2); ctx.beginPath(); ctx.moveTo(cx - hw - 20, yy + 20); ctx.bezierCurveTo(cx - hw * .4, yy - 30, cx + hw * .4, yy + 40, cx + hw + 20, yy - 10); ctx.stroke(); }
  ctx.restore(); return outline;
}
function puff(x, y, s, a) { ctx.save(); ctx.globalAlpha *= a; paper(() => cloudPath(x, y, s), '#f4fbff', { sh: 6, edge: false }); ctx.restore(); }
function groundBand(y, cols, seed = 3, amp = 14) {
  paper(() => { ctx.beginPath(); ctx.moveTo(-40, H + 40); for (let x = -40; x <= W + 40; x += 40) ctx.lineTo(x, y + amp * Math.sin(x / 150 + seed) + jit(x + seed, 1)); ctx.lineTo(W + 40, H + 40); ctx.closePath(); }, cols[0], { sh: 14 });
  ctx.save(); ctx.strokeStyle = cols[1]; ctx.lineWidth = 8; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, y + i * 120); ctx.bezierCurveTo(300, y + i * 120 - 40, 700, y + i * 120 + 50, W, y + i * 120); ctx.stroke(); } ctx.restore();
}
function foam(y, amp, wl, ph, seed) {
  ctx.save(); ctx.fillStyle = '#f4fbff';
  for (let x = -20; x <= W + 20; x += 54) { const yy = y + amp * Math.sin(x / wl * TAU + ph) + amp * .35 * Math.sin(x / (wl * .43) * TAU - ph * 1.7); ctx.beginPath(); ctx.arc(x, yy + 4, 20 + R(seed + x) * 12, 0, TAU); ctx.fill(); }
  ctx.restore();
}

/* =========================================================================================
   SCÈNE A — Accroche : la pluie est douce, les rivières aussi… la mer est salée
   ========================================================================================= */
function sceneA(t) {
  const c = TIMING.cues, qT = c.q;
  fillBg(P.sky);
  paper(() => { ctx.beginPath(); ctx.arc(880, 330, 120, 0, TAU); }, '#fff0c9', { sh: 0, edge: false });
  cloud(250 + t * 10, 250, 130, '#ffffff'); cloud(820 - t * 8, 190, 100, '#eef5f9');
  rain(30, 880, '#8cc3de', 0, W, 0, 1090, 90, 10, 11);
  const toRiver = E.io(prog(t, c.s1b, .5));
  const dcx = lerp(540, 290, toRiver), dcy = lerp(790 + Math.sin(t * 5) * 10, 700, toRiver), ds = lerp(1, .72, toRiver), sq = 1 + .035 * Math.sin(t * 9);
  const riv = [[290, 960], [300, 1010], [420, 1050], [400, 1110], [540, 1150], [700, 1170], [830, 1220]];
  const rp = prog(t, c.s1b + .15, 1.1); if (rp > 0) ribbon(riv, 74, '#3db2e8', E.out(rp));
  ctx.save(); ctx.translate(dcx, dcy); ctx.scale(ds * sq, ds / sq); ctx.translate(-dcx, -dcy);
  paper(() => dropPath(dcx, dcy, 520, 690), '#3db2e8', { sh: 18 });
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(dcx - 140, dcy + 80, 40, 130, .25, 0, TAU); ctx.fill(); ctx.restore();
  if (t > .2) extruded('DOUCE', dcx, dcy + 90 * ds, 150 * ds, '#ffffff', '#16618f', { rot: -.07, scale: Math.max(.01, pop(t, .22)) });
  if (rp > .45) { const k = pop(t, c.s1b + .7) * (1 - E.in(prog(t, c.s1c - .1, .3))); if (k > 0) tag('RIVIÈRES', 690, 960, 56, { rot: -.07, scale: k, bg: P.sun }); }
  // mer
  const rise = E.io(prog(t, c.s1c, 1.2)) * 170, ph = t * 1.3;
  waveBand(1090 - rise, 16, 460, ph, '#8fd8ea', { seed: 1 });
  waveBand(1155 - rise, 18, 380, -ph * 1.2 + 2, '#2fa4d0', { seed: 2 });
  waveBand(1235 - rise, 20, 520, ph * .9 + 4, '#1f78b4', { seed: 3 });
  waveBand(1340 - rise * .6, 20, 440, -ph + 1, '#0e4a78', { seed: 4 });
  waveBand(1480, 18, 600, ph * .8, '#0a3a60', { seed: 5 });
  waveBand(1640, 18, 520, -ph * .7, '#072c4b', { seed: 6 });
  // cristaux qui montent des profondeurs
  if (t > c.s1c) for (let i = 0; i < 9; i++) { const per = 5, u = (((t - c.s1c) * .5 + i * .55) % per) / per * 1.0; const x = 90 + R(i + 60) * 900 + Math.sin(u * 9 + i) * 24, y = 1900 - u * 600 * 1.3; cube(x, y, 50 + R(i + 70) * 50, u * 5 + i, clamp((1 - u) * 3)); }
  // cristaux qui jaillissent
  for (let i = 0; i < 14; i++) { const t0 = c.s1c + .7 + i * .17, u = (t - t0) / 1.5; if (u < 0 || u > 1) continue; const x0 = 120 + R(100 + i) * 840, vy = 560 + R(200 + i) * 280, g = 1500, tt = u * 1.5;
    cube(x0 + (R(300 + i) - .5) * 160 * tt, 1090 - rise + 20 - (vy * tt - .5 * g * tt * tt), 56 + R(400 + i) * 56, (R(500 + i) - .5) * 2 + tt * 3, 1); }
  const sOut = 1 - prog(t, qT - .12, .18);
  if (t > c.mer - .05 && sOut > 0) extruded('SALÉE', 540, 1090 - rise + 15, 240, '#fffdf5', '#7d9bbd', { scale: Math.max(.01, pop(t, c.mer, .4) * sOut), rot: .03, depth: 16 });
  // titre : la question dès la première image
  const tOut = prog(t, qT - .25, .3);
  if (tOut < 1) { ctx.save(); ctx.translate(0, -tOut * 520);
    extruded('POURQUOI LA MER', 540, 400, 86, P.navy, P.coral, { depth: 8, rot: -.01 }); extruded('EST SALÉE ?', 540, 520, 128, P.navy, P.coral, { depth: 10, rot: .012 }); ctx.restore(); }
  // « ? » géant dont le point est un cristal de sel
  if (t >= qT - .02) {
    const sc = Math.max(.01, pop(t, qT, .42)), wig = Math.sin((t - qT) * 7) * .05;
    ctx.save(); ctx.translate(540, 800); ctx.rotate(wig); ctx.scale(sc, sc); ctx.translate(-540, -800);
    const q = () => { ctx.beginPath(); ctx.arc(540, 580, 190, Math.PI * 1.03, Math.PI * 2.42); ctx.quadraticCurveTo(560, 800, 540, 860); };
    ctx.lineCap = 'round'; ctx.lineWidth = 150; ctx.strokeStyle = 'rgba(6,18,36,.3)'; ctx.save(); ctx.translate(6, 16); q(); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = P.coral; q(); ctx.stroke(); ctx.lineWidth = 22; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.save(); ctx.translate(-26, -26); q(); ctx.stroke(); ctx.restore();
    cube(540, 1040 - Math.abs(Math.sin((t - qT) * 4)) * 30, 200, Math.sin((t - qT) * 3) * .3, 1); ctx.restore();
  }
}

/* =========================================================================================
   SCÈNE B — 1715 : Halley et les lacs sans sortie
   ========================================================================================= */
function sceneB(t) {
  const c = TIMING.cues, t0 = c.halley - .1;
  fillBg(P.parch);
  ctx.save(); ctx.translate(790, 560); ctx.rotate(t * .02); ctx.strokeStyle = 'rgba(150,108,60,.28)'; ctx.lineWidth = 4;
  for (let i = 0; i < 24; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i * TAU / 24) * 1400, Math.sin(i * TAU / 24) * 1400); ctx.stroke(); }
  for (const r of [160, 300, 440, 600, 780]) { ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); } ctx.restore();
  // mer dessinée à l'ancienne, en bas
  const ph = t * 1.1; waveBand(1480, 14, 360, ph, '#6fa8c4', { seed: 41, sh: 8 }); waveBand(1580, 16, 300, -ph, '#3f7ea3', { seed: 42, sh: 8 }); waveBand(1690, 16, 420, ph * .8, '#235f86', { seed: 43, sh: 8 }); waveBand(1810, 16, 380, -ph, '#174a6c', { seed: 44, sh: 8 });
  // portrait
  const hin = E.out(prog(t, t0 + .25, .6)), hout = E.io(prog(t, c.remarque - .1, .5));
  const hx = lerp(lerp(-400, 420, hin), 215, hout), hy = lerp(790, 520, hout), hs = lerp(1, .5, hout);
  photoCard(IMG.halley, hx, hy, 600, 750, lerp(-.05, -.07, hout) + jit(2, .004), { scale: hs, fy: .35, seed: 4 });
  const tgi = pop(t, c.astro, .3) * (1 - hout); if (tgi > 0) tag('EDMOND HALLEY', 420, 1235, 64, { bg: P.navy, fg: P.salt, rot: -.03, scale: tgi });
  // 1715 tamponné (sort quand la Caspienne arrive)
  if (t > c.halley + .35) { const p = pop(t, c.halley + .35, .3) * (1 - E.in(prog(t, c.remarque - .15, .3))), sh = prog(t, c.halley + .35, .25) < 1 ? 10 : 0;
    if (p > 0) extruded('1715', 720 + jit(9, sh), 330 + jit(8, sh), 260, P.coral, '#a8321d', { scale: Math.max(.01, p), rot: .1, depth: 18 }); }
  // la comète
  const cp = prog(t, c.comete - .15, 1.1);
  if (cp > 0 && cp < 1) { const x = lerp(1250, -260, cp), y = lerp(180, 1040, cp);
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(860, -1510) + Math.PI);
    [['#fff6d8', 150, 330], ['#ffe08a', 110, 270], ['#ffb84a', 70, 210]].forEach(([col, w, l], i) => paper(() => { ctx.beginPath(); ctx.moveTo(0, -w / 2); ctx.lineTo(l * 1.9, -w * .18 + jit(i, 3)); ctx.lineTo(l * 1.9 + 30, 0); ctx.lineTo(l * 1.9, w * .18 + jit(i + 5, 3)); ctx.lineTo(0, w / 2); ctx.closePath(); }, col, { sh: 8 }));
    ctx.restore(); paper(() => { ctx.beginPath(); ctx.arc(x, y, 62, 0, TAU); }, '#fffbe8', { sh: 10 }); paper(() => { ctx.beginPath(); ctx.arc(x, y, 34, 0, TAU); }, P.sun, { sh: 0, edge: false }); }
  // la mer Caspienne : un lac sans sortie
  const ci = E.out(prog(t, c.remarque, .55));
  if (ci > 0) {
    const cx = lerp(1500, 600, ci), cy = 790;
    photoCard(IMG.caspian, cx, cy, 640, 820, .03 + jit(5, .004), { fx: .5, fy: .52, seed: 8 });
    if (t > c.remarque + .3) tag('MER CASPIENNE', 600, 1260, 58, { bg: P.navy, fg: P.salt, rot: .02, scale: pop(t, c.remarque + .35, .3) });
    if (t > c.remarque + .6) {
      const ap = prog(t, c.remarque + .6, .5);
      for (let i = 0; i < 3; i++) { const bx = 420 + i * 150, by = 360 - (1 - E.out(ap)) * 90; ctx.save(); ctx.translate(bx, by + Math.sin(t * 6 + i) * 8); ctx.rotate(Math.PI / 2);
        paper(() => { ctx.beginPath(); ctx.moveTo(-70, -22); ctx.lineTo(10, -22); ctx.lineTo(10, -50); ctx.lineTo(74, 0); ctx.lineTo(10, 50); ctx.lineTo(10, 22); ctx.lineTo(-70, 22); ctx.closePath(); }, P.sea, { sh: 8 }); ctx.restore(); }
      const k = pop(t, c.remarque + 1.0, .3); ctx.save(); ctx.translate(930, 1010); ctx.scale(k, k);
      paper(() => { ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); }, P.coral, { sh: 8 }); ctx.strokeStyle = P.salt; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-26, -26); ctx.lineTo(26, 26); ctx.moveTo(26, -26); ctx.lineTo(-26, 26); ctx.stroke(); ctx.restore();
      tag('PAS DE SORTIE', 880, 900, 46, { bg: P.salt, fg: P.coral, rot: .1, scale: k });
    }
    if (t > c.lacs - .05) extruded('SALÉ', 770, 560, 210, '#fffdf5', P.coral, { scale: Math.max(.01, pop(t, c.lacs, .32)), rot: -.1, depth: 16 });
  }
}

/* =========================================================================================
   SCÈNE C — le mécanisme : lac sans sortie, évaporation, le sel reste
   ========================================================================================= */
function saltPile(n, tNow, tStart, per, glow) {
  for (let i = 0; i < n; i++) { const ti = tStart + i * per; if (tNow < ti) continue; const row = Math.floor(i / 9), col = i % 9;
    const x = 330 + col * 46 + (row % 2) * 23 + (R(i) - .5) * 8, yEnd = 1090 - row * 34, f = clamp((tNow - ti) / .45);
    cube(x, lerp(yEnd - 160, yEnd, E.bounce(f)), 54, (R(i + 9) - .5) * .5, 1, glow ? .35 + .25 * Math.sin(tNow * 8 + i) : 0); }
}
function lakeBowl(wx, wy, sc) {
  ctx.save(); ctx.translate(wx, wy); ctx.scale(sc, sc); ctx.translate(-540, -960);
  const bowl = () => { ctx.beginPath(); ctx.moveTo(90, 770); ctx.lineTo(990, 770); ctx.lineTo(990, 900); ctx.quadraticCurveTo(990, 1170, 740, 1170); ctx.lineTo(340, 1170); ctx.quadraticCurveTo(90, 1170, 90, 900); ctx.closePath(); };
  paper(bowl, P.rock3, { sh: 16 });
  ctx.save(); ctx.beginPath(); ctx.moveTo(150, 810); ctx.lineTo(930, 810); ctx.lineTo(930, 900); ctx.quadraticCurveTo(930, 1115, 730, 1115); ctx.lineTo(350, 1115); ctx.quadraticCurveTo(150, 1115, 150, 900); ctx.closePath(); ctx.clip();
  const g = ctx.createLinearGradient(0, 810, 0, 1115); g.addColorStop(0, '#3db2e8'); g.addColorStop(1, '#1f78b4'); ctx.fillStyle = g; ctx.fillRect(100, 790, 880, 340); ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 6; ctx.beginPath();
  for (let x = 150; x <= 930; x += 20) { const y = 812 + Math.sin(x / 55 + T * 3) * 6 + jit(x, 1); x === 150 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
  ctx.restore();
}
function sceneC(t) {
  const c = TIMING.cues, t0 = c.riv - .15;
  gradBg('#0e4a78', '#0a2a4a');
  ctx.save(); ctx.globalAlpha = .12; ctx.fillStyle = '#8fd8ea'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(150 + i * 300 + Math.sin(t * .6 + i) * 20, 330 + (i % 2) * 120, 150, 0, TAU); ctx.fill(); } ctx.restore();
  groundBand(1260, ['#6b4a36', 'rgba(255,220,170,.18)'], 2, 10);
  const zoomOut = E.io(prog(t, c.mer2 - .1, .8));
  if (zoomOut < 1) {
    ctx.save(); ctx.globalAlpha = 1 - zoomOut;
    paper(polyPath(mountainPath(120, 760, 430, 260, 70)), P.rock, { sh: 14 });
    const riv = [[170, 520], [200, 600], [150, 680], [210, 760], [250, 800]];
    ribbon(riv, 46, P.aqua, E.out(prog(t, t0 + .2, .7)));
    if (t > t0 + .4) tag('RIVIÈRE', 335, 600, 44, { bg: P.salt, fg: P.navy, rot: -.05, scale: pop(t, t0 + .4, .3) });
    ctx.restore();
    ctx.save(); ctx.globalAlpha = 1 - zoomOut; lakeBowl(540, 960, 1);
    const arrive = c.riv + .25;
    for (let i = 0; i < 4; i++) { const ti = arrive + i * .75, u = (t - ti) / 1.0; if (u > 0 && u < 1) { const p = pointOn(riv, E.io(u)); cube(p[0] + 4, p[1], 26, u * 2, 1); } }
    saltPile(30, t, arrive + .9, .5, t > c.reste);
    if (t > c.evap) {
      for (let i = 0; i < 7; i++) { const per = 2.4, tt = t - c.evap - i * .34; if (tt < 0) continue; const u = (tt % per) / per; const x = 540 + (i % 4) * 78 + Math.sin(u * 6 + i) * 18, y = 800 - u * 290, a = Math.min(1, u * 6) * (1 - Math.max(0, (u - .7) / .3)); puff(x, y, 34 + u * 18, a); }
    }
    if (t > c.sortie) { const k = pop(t, c.sortie, .3); ctx.save(); ctx.translate(990, 720); ctx.scale(k, k);
      paper(() => { ctx.beginPath(); ctx.arc(0, 0, 64, 0, TAU); }, P.coral, { sh: 8 }); ctx.strokeStyle = P.salt; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-24, -24); ctx.lineTo(24, 24); ctx.moveTo(24, -24); ctx.lineTo(-24, 24); ctx.stroke(); ctx.restore();
      tag('SANS SORTIE', 830, 610, 48, { bg: P.salt, fg: P.coral, rot: .06, scale: pop(t, c.sortie + .15, .3) }); }
    if (t >= c.evap - .4) { const sp = pop(t, c.evap - .4, .35); ctx.save(); ctx.translate(880, 400); ctx.scale(sp, sp); ctx.translate(-880, -400); sunDisc(900, 400, 62, t * .5); ctx.restore(); }
    if (t > c.evap) {
      tag('ÉVAPORATION', 600, 340, 56, { bg: P.sun, fg: P.navy, rot: -.03, scale: pop(t, c.evap + .1, .3) });
    }
    if (t > c.vapeur) tag('VAPEUR = EAU PURE', 610, 430, 42, { bg: P.salt, fg: P.navy, rot: .02, scale: pop(t, c.vapeur, .3) });
    if (t > c.reste) extruded('LE SEL RESTE', 540, 1235, 96, P.salt, P.coral, { scale: pop(t, c.reste, .3), rot: -.02, depth: 9 });
    ctx.restore();
  }
  if (zoomOut > 0) {
    const a = E.out(prog(t, c.mer2, .55));
    lakeBowl(lerp(540, 165, zoomOut), lerp(960, 1000, zoomOut), lerp(1, .3, zoomOut));
    ctx.save(); ctx.translate(640, 690); ctx.scale(a, a); ctx.translate(-640, -690); earthDraw(640, 690, 700, 0); ctx.restore();
    if (a > .6) tag(['UN IMMENSE LAC', 'SANS SORTIE'], 560, 1130, 64, { bg: P.sun, fg: P.navy, rot: -.02, scale: pop(t, c.mer2 + .35, .35) });
    if (a > .8) tag('OCÉAN', 800, 470, 46, { bg: P.salt, fg: P.navy, rot: .08, scale: pop(t, c.mer2 + .6, .3) });
    if (a > .8) tag('LAC', 165, 860, 46, { bg: P.salt, fg: P.navy, rot: -.06, scale: pop(t, c.mer2 + .75, .3) });
  }
}

/* =========================================================================================
   SCÈNE D — d'où vient le sel : la pluie légèrement acide ronge la roche
   ========================================================================================= */
const RIV_D = [[640, 1290], [700, 1350], [600, 1410], [760, 1480], [960, 1500], [1120, 1540]];
function sceneD(t) {
  const c = TIMING.cues, t0 = c.dou - .15;
  gradBg('#c3d3dc', '#ecdcbc');
  const rise = 1 - E.out(prog(t, t0 + .2, .7));
  ctx.save(); ctx.translate(0, rise * 520);
  mountain(910, 1330, 800, 420, 160, ['#c18a5e', '#a9724c'], { sh: 10 });
  mountain(150, 1330, 900, 330, 190, ['#c9976a', '#b07a52'], { sh: 10 });
  const mt = mountain(430, 1330, 610, 640, 120, [P.rock3, P.rock2]);
  ctx.restore();
  groundBand(1330, ['#7b5a42', 'rgba(255,220,170,.2)'], 4, 12);
  ribbon(RIV_D, 52, P.sea, 1);
  if (t < c.roche) { extruded("D'OÙ VIENT", 540, 330, 100, P.navy, P.coral, { depth: 9, rot: -.015, scale: Math.max(.01, pop(t, c.dou, .3)) }); extruded('CE SEL ?', 540, 450, 150, P.navy, P.coral, { depth: 11, rot: .015, scale: Math.max(.01, pop(t, c.dou + .1, .3)) }); }
  if (t >= c.roche) extruded('ROCHE', 540, 330, 200, '#fff6e2', '#7a4528', { scale: Math.max(.01, pop(t, c.roche, .3)), rot: -.03, depth: 14 });
  const cl = pop(t, c.co2 - .4, .4);
  if (cl > 0) { ctx.save(); ctx.translate(790, 640); ctx.scale(cl, cl); ctx.translate(-790, -640); cloud(790, 640, 175, '#8ea4b5'); cloud(800, 610, 145, '#a9bccb'); ctx.restore(); }
  if (t >= c.co2 - .1) {
    for (let i = 0; i < 5; i++) { const u = prog(t, c.co2 + i * .42, 1.3), x = lerp(60 + (i % 2) * 90, 780, E.io(u)), y = lerp(430 + i * 90, 640, E.io(u)); if (u > 0 && u < 1) co2Mol(x, y, 28, u * 2 + i); }
    const k = pop(t, c.co2 + .1, .3); tag('GAZ CARBONIQUE', 250, 760, 48, { bg: P.salt, fg: P.navy, rot: -.05, scale: k });
    ctx.save(); ctx.translate(250, 690); ctx.scale(k, k); co2Text(0, 0, 70, P.navy); ctx.restore();
  }
  if (t >= c.acide - .1) {
    for (let i = 0; i < 12; i++) { const per = 1.15, tt = t - c.acide - i * .1; if (tt < 0) continue; const u = (tt % per) / per, x = 640 + (i % 6) * 48 - Math.floor(i / 6) * 22 - u * 150, y = 760 + u * 560; paper(() => dropPath(x, y, 44, 64), '#d8e04a', { sh: 5 }); }
    tag('UN PEU ACIDE', 830, 880, 50, { bg: '#d8e04a', fg: P.navy, rot: .05, scale: pop(t, c.acide, .3) });
  }
  if (t >= c.ronge) {
    for (let i = 0; i < 18; i++) { const ti = c.ronge + i * .09, u = (t - ti) / 1.3; if (u < 0 || u > 1) continue; const sx = 540 + (R(i) - .5) * 260, sy = 900 + R(i + 9) * 260;
      const x = sx + u * (260 + R(i + 3) * 120), y = sy + u * u * 360 + u * 20; ctx.save(); ctx.translate(x, y); ctx.rotate(u * 5 + i); paper(polyPath([[-16, -12], [14, -16], [18, 12], [-12, 16]]), i % 2 ? P.rock3 : P.rock2, { sh: 4 }); ctx.restore(); }
    tag('ELLE RONGE', 290, 1040, 56, { bg: P.coral, fg: P.salt, rot: -.07, scale: pop(t, c.ronge, .3) });
  }
  const iris = prog(t, c.sucre, .35) * (1 - prog(t, c.sels - .45, .3));
  if (iris > 0) {
    const r = 410 * E.io(iris); ctx.save(); ctx.translate(540, 820);
    paper(() => { ctx.beginPath(); ctx.arc(0, 0, r + 22, 0, TAU); }, P.salt, { sh: 18 });
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip();
    ctx.fillStyle = '#f7c9a3'; ctx.fillRect(-500, -500, 1000, 1000); ctx.fillStyle = '#f0a77a'; ctx.beginPath(); ctx.arc(0, 560, 520, 0, TAU); ctx.fill();
    const ts = t - c.sucre - .2; ctx.translate(0, 90);
    paper(() => { ctx.beginPath(); ctx.ellipse(0, 170, 330, 56, 0, 0, TAU); }, '#ffffff', { sh: 10 });
    paper(() => { ctx.beginPath(); ctx.moveTo(-230, -60); ctx.lineTo(230, -60); ctx.lineTo(190, 130); ctx.quadraticCurveTo(0, 190, -190, 130); ctx.closePath(); }, '#ffffff', { sh: 12 });
    ctx.lineWidth = 34; ctx.strokeStyle = '#ffffff'; ctx.beginPath(); ctx.arc(250, 30, 62, -1.2, 1.6); ctx.stroke();
    paper(() => { ctx.beginPath(); ctx.ellipse(0, -60, 230, 34, 0, 0, TAU); }, '#6b3b22', { sh: 0 });
    for (let i = 0; i < 3; i++) { const u = ((t * .6 + i * .33) % 1); puff(-80 + i * 80, -130 - u * 150, 22, Math.sin(u * Math.PI) * .9); }
    if (ts > 0) { const fall = clamp(ts / .55), dis = clamp((ts - .55) / 1.7);
      if (dis < 1) cube(0, lerp(-380, -90, E.in(fall)) + dis * 30, 120 * (1 - dis * .85), ts * 1.2, 1 - dis * .25);
      for (let i = 0; i < 22; i++) { const d = clamp(dis * 1.3 - i * .02); if (d <= 0) continue; const a = R(i) * TAU, rr = d * (30 + R(i + 5) * 190); cube(Math.cos(a) * rr * 1.1, -70 + Math.sin(a) * rr * .12 + d * 40, 18 + R(i + 9) * 12, a, 1 - d * .6); } }
    ctx.restore();
  }
  if (t >= c.sels - .1) {
    for (let i = 0; i < 16; i++) { const tt = t - c.sels - i * .16; if (tt < 0) continue; const u = (tt % 2.6) / 2.6, p = pointOn(RIV_D, u); cube(p[0], p[1] - 4, 30, u * 4 + i, 1); }
    tag('MINÉRAUX DISSOUS', 400, 560, 54, { bg: P.sea, fg: P.salt, rot: -.04, scale: pop(t, c.sels, .3) });
    tag('= DES SELS', 420, 690, 84, { bg: P.salt, fg: P.navy, rot: .03, scale: pop(t, c.sels + .45, .3) });
  }
}

/* =========================================================================================
   SCÈNE E — cheminées au fond de l'océan
   ========================================================================================= */
function sceneE(t) {
  const c = TIMING.cues, t0 = c.chem - .1, s = prog(t, t0, c.imagine - t0);
  gradBg('#0a2a4a', '#050f1c');
  bubbles(26, 31, 0, W, 130);
  ctx.save(); camera(s, 1.0, 1.06, 540, 800);
  const a = E.out(prog(t, t0 + .25, .55));
  photoCard(IMG.smoker, 540, lerp(1500, 800, a), 660, 930, .02 + jit(3, .004), { fy: .35, zoom: 1.0 + s * .12, seed: 6, filter: 'saturate(1.15)' });
  if (t > t0 + .8) { const m = pop(t, t0 + .8, .4); ctx.save(); ctx.translate(540, 1290); ctx.scale(m, m);
    paper(() => { ctx.beginPath(); ctx.moveTo(-360, 40); ctx.quadraticCurveTo(-200, -70, 0, -40); ctx.quadraticCurveTo(220, -80, 360, 40); ctx.lineTo(320, 100); ctx.lineTo(-320, 100); ctx.closePath(); }, '#2a1a1a', { sh: 12 });
    paper(() => { ctx.beginPath(); ctx.moveTo(-280, 40); ctx.quadraticCurveTo(-120, -30, 0, -10); ctx.quadraticCurveTo(130, -40, 280, 40); ctx.closePath(); }, P.coral, { sh: 0, edge: false });
    paper(() => { ctx.beginPath(); ctx.moveTo(-170, 40); ctx.quadraticCurveTo(-60, 0, 0, 8); ctx.quadraticCurveTo(80, 0, 170, 40); ctx.closePath(); }, P.sun, { sh: 0, edge: false }); ctx.restore(); }
  tag(['CHEMINÉE AU FOND', "DE L'OCÉAN"], 540, 310, 58, { bg: P.sun, fg: P.navy, rot: -.025, scale: pop(t, t0 + .45, .3) });
  if (t > c.chem + 1.6) tag(['CHAUFFÉE PAR LA', 'ROCHE EN FUSION'], 560, 1130, 52, { bg: P.coral, fg: P.salt, rot: .03, scale: pop(t, c.chem + 1.6, .3) });
  ctx.restore();
}

/* =========================================================================================
   SCÈNE F — la révélation : environ cent cinquante mètres de sel
   ========================================================================================= */
let ES = null;
function prepEarth() {
  const mk = (img) => { const k = document.createElement('canvas'); k.width = 1000; k.height = 1000; const g = k.getContext('2d'); g.drawImage(img, 0, 0, 1000, 1000); return g.getImageData(0, 0, 1000, 1000); };
  const salt = mk(IMG.earthSalt), order = mk(IMG.earthOrder), out = document.createElement('canvas'); out.width = 1000; out.height = 1000; const og = out.getContext('2d');
  ES = { salt, order, out, og, img: og.createImageData(1000, 1000) };
}
const EDISC = { cx: 498.4, cy: 497.5, r: 448.6 };
function earthDraw(cx, cy, diam, p) {
  if (!ES) prepEarth();
  const s = diam / (2 * EDISC.r), x0 = cx - EDISC.cx * s, y0 = cy - EDISC.cy * s;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, diam / 2 * .985, 0, TAU); ctx.fillStyle = '#05101e'; ctx.fill(); ctx.clip();
  ctx.drawImage(IMG.earth, x0, y0, 1000 * s, 1001 * s);
  if (p > 0) { const sd = ES.salt.data, od = ES.order.data, o = ES.img.data, th = p * 1.15;
    for (let i = 0; i < sd.length; i += 4) { const a = sd[i + 3]; if (!a) { o[i + 3] = 0; continue; } const f = clamp((th - od[i] / 255) * 9); o[i] = sd[i]; o[i + 1] = sd[i + 1]; o[i + 2] = sd[i + 2]; o[i + 3] = a * f; }
    ES.og.putImageData(ES.img, 0, 0); ctx.drawImage(ES.out, x0, y0, 1000 * s, 1001 * s); }
  ctx.restore();
  ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(cx, cy, diam / 2 * .985, 0, TAU); ctx.stroke(); ctx.restore();
}
function sceneF1(t) {          // « Imagine tout ce sel, étalé sur toutes les terres du monde. »
  const c = TIMING.cues, t0 = c.imagine - .1;
  gradBg('#0b2a4a', '#051225');
  if (t < c.etale) {
    const ph = t * 1.2; waveBand(1050, 18, 520, ph, '#1f78b4', { seed: 21 }); waveBand(1150, 20, 420, -ph, '#0e4a78', { seed: 22 }); waveBand(1270, 20, 600, ph * .8, '#0a3a60', { seed: 23 }); waveBand(1420, 20, 500, -ph, '#072c4b', { seed: 24 });
    for (let i = 0; i < 46; i++) { const tt = t - (t0 + .15 + i * .045); if (tt < 0) continue; const u = (tt % 2.2) / 2.2, x = 70 + R(i) * 940 + Math.sin(u * 4 + i) * 40, y = lerp(1130, 330, E.out(u));
      cube(x, y, 60 + R(i + 40) * 80, u * 4 + i, 1 - Math.max(0, u - .8) * 5); }
    extruded('IMAGINE…', 540, 300, 160, P.salt, P.coral, { depth: 12, rot: -.02, scale: Math.max(.01, pop(t, t0 + .15, .3)) });
  } else {
    const a = E.out(prog(t, c.etale, .5)); ctx.save(); ctx.translate(540, 740); ctx.scale(a, a); ctx.translate(-540, -740);
    earthDraw(540, 740, 960, prog(t, c.etale + .25, 1.9)); ctx.restore();
    for (let i = 0; i < 9; i++) { const tt = t - (c.etale + .05 + i * .1); if (tt < 0) continue; const u = (tt % 1.2) / 1.2; cube(220 + R(i) * 640, lerp(220, 700, u), 70 + R(i + 9) * 40, u * 5, 1 - Math.max(0, u - .7) * 3); }
    if (a > .7) tag(['SUR TOUTES', 'LES TERRES'], 540, 1200, 62, { bg: P.sun, fg: P.navy, rot: .02, scale: pop(t, c.etale + .4, .3) });
  }
}
function sceneF2(t) {          // la coupe : une couche de sel face à un immeuble de quarante étages
  const c = TIMING.cues, ground = 1240, hgt = 700, top = ground - hgt;
  gradBg('#d3e7ef', '#b7d3df');
  cloud(90 + t * 6, 190, 70, '#ffffff'); cloud(990 - t * 5, 230, 60, '#eef5f9');
  groundBand(ground, [P.rock2, 'rgba(255,230,190,.25)'], 6, 4);
  const rise = E.out(prog(t, c.couche, 1.3)), sh = hgt * rise, sx0 = 520, sx1 = 1020;
  paper(() => { ctx.beginPath(); ctx.moveTo(sx0, ground + 6); ctx.lineTo(sx0, ground - sh); for (let x = sx0; x <= sx1; x += 26) ctx.lineTo(x, ground - sh + jit(x, 1.5) + Math.sin(x / 40) * 4); ctx.lineTo(sx1, ground + 6); ctx.closePath(); }, '#fffdf8', { sh: 14 });
  ctx.save(); ctx.beginPath(); ctx.rect(sx0, ground - sh - 10, sx1 - sx0, sh + 10); ctx.clip(); ctx.strokeStyle = 'rgba(160,190,220,.4)'; ctx.lineWidth = 3;
  for (let x = sx0; x < sx1; x += 56) { ctx.beginPath(); ctx.moveTo(x, ground - sh); ctx.lineTo(x, ground); ctx.stroke(); } for (let y = ground; y > ground - sh; y -= 56) { ctx.beginPath(); ctx.moveTo(sx0, y); ctx.lineTo(sx1, y); ctx.stroke(); } ctx.restore();
  for (let i = 0; i < 14; i++) { const u = prog(t, c.couche + .1 + i * .06, .4); if (u > 0 && u < 1) cube(sx0 + 40 + R(i) * 440, ground - sh - 60 * (1 - u) - 30, 56, u * 4, 1 - u); }
  const bT = c.immeuble - .05, bp = E.out(prog(t, bT, .7));
  if (bp > 0) { const bx = 80, bw = 320, bh = hgt * bp, floors = 40, fh = hgt / floors;
    paper(() => { ctx.beginPath(); ctx.rect(bx, ground - bh, bw, bh + 6); }, P.navy, { sh: 14 });
    ctx.save(); ctx.beginPath(); ctx.rect(bx, ground - bh, bw, bh); ctx.clip();
    for (let f = 0; f < floors; f++) { const y = ground - (f + 1) * fh; if (y + fh < ground - bh) continue; for (let k = 0; k < 4; k++) { ctx.fillStyle = (R(f * 7 + k) > .35) ? '#ffd86b' : '#2f5a85'; ctx.fillRect(bx + 26 + k * 68, y + fh * .2, 44, fh * .58); } } ctx.restore();
    if (bp > .9) tag('40 ÉTAGES', bx + bw / 2, top - 60, 58, { bg: P.salt, fg: P.navy, rot: -.03, scale: pop(t, bT + .6, .3) }); }
  if (t > c.couche + .5) { ctx.save(); ctx.globalAlpha = fade(t, c.couche + .5, .3); ctx.strokeStyle = P.coral; ctx.lineWidth = 10; ctx.lineCap = 'round'; const bx = 470;
    ctx.beginPath(); ctx.moveTo(bx - 24, ground - sh); ctx.lineTo(bx, ground - sh); ctx.lineTo(bx, ground); ctx.lineTo(bx - 24, ground); ctx.stroke(); ctx.restore();
    extruded('≈ 150 m', 540, 330, 230, P.coral, '#8e2a17', { depth: 16, rot: -.03, scale: Math.max(.01, pop(t, c.couche + .3, .35)) });
    tag('COUCHE DE SEL', 770, top - 60, 52, { bg: P.salt, fg: P.navy, rot: .03, scale: pop(t, c.couche + 1.0, .3) }); }
}
function sceneF3(t) {          // « Partout. »
  const c = TIMING.cues, t0 = c.partout - .3;
  gradBg('#0b2a4a', '#051225');
  const a = Math.max(.01, pop(t, t0, .4));
  ctx.save(); ctx.translate(540, 740); ctx.scale(a, a); ctx.rotate((1 - Math.min(1, a)) * -.3); ctx.translate(-540, -740); earthDraw(540, 740, 960, 1); ctx.restore();
  extruded('PARTOUT', 540, 1190, 190, P.salt, P.coral, { depth: 14, rot: -.02, scale: Math.max(.01, pop(t, t0 + .25, .3)) });
}

/* =========================================================================================
   SCÈNE G — retour à toi : la tasse, la roche, grain après grain
   ========================================================================================= */
function sceneG(t) {
  const c = TIMING.cues, t0 = c.tasse - .1, ph = t * 1.1;
  gradBg('#ffd9b0', '#ff9c78');
  sunDisc(800, 560, 110, t * .25);
  const mp = prog(t, c.roche2, .6), erode = prog(t, c.rongee, c.encore - c.rongee + 1.2), mtop = lerp(480, 660, E.io(erode));
  if (mp > 0) { ctx.save(); ctx.translate(0, (1 - E.out(mp)) * 800); mountain(330, 1290, mtop, 520, 210, [P.rock3, P.rock2]); ctx.restore(); }
  if (t >= c.roche2) extruded('DE LA ROCHE', 540, 330, 120, '#fff6e2', '#7a4528', { depth: 11, rot: -.02, scale: Math.max(.01, pop(t, c.roche2, .32)) });
  if (t >= c.rongee - .3) rain(24, 760, '#ffffffaa', 80, 1000, 300, 1250, 80, 9, 41, .1);
  if (t >= c.rongee) for (let i = 0; i < 32; i++) { const tt = t - (c.rongee + i * .19); if (tt < 0) continue; const u = (tt % 1.7) / 1.7, sx = 200 + R(i) * 360, sy = lerp(mtop + 80, 1200, R(i + 7));
    cube(sx + u * (160 + R(i + 3) * 120), sy + u * u * (1300 - sy) + u * 40, 30 + R(i + 5) * 16, u * 6, 1 - Math.max(0, u - .8) * 5); }
  // la mer vient vers toi : houle puis éclaboussures
  const sw = Math.sin(Math.PI * prog(t, t0, c.roche2 - t0 + .3)), up = sw * 560;
  waveBand(1330 - up, 24, 520, ph, '#2fa4d0', { seed: 31 }); foam(1330 - up, 24, 520, ph, 7);
  waveBand(1400 - up * .85, 24, 420, -ph * 1.2 + 1, '#1f78b4', { seed: 32 });
  waveBand(1500 - up * .6, 24, 560, ph * .9 + 3, '#0e4a78', { seed: 33 });
  waveBand(1630 - up * .3, 24, 640, -ph + 2, '#0a3a60', { seed: 34 });
  waveBand(1780, 20, 600, ph, '#072c4b', { seed: 35 });
  for (let i = 0; i < 16; i++) { const tt = t - (t0 + .35 + i * .06); if (tt < 0 || tt > 1.5) continue; const u = tt / 1.5, x = 120 + R(i) * 840;
    paper(() => { ctx.beginPath(); ctx.arc(x + (R(i + 5) - .5) * 260 * u, 1180 - up * .6 - Math.sin(u * Math.PI) * (300 + R(i + 9) * 260) + u * 180, 16 + u * 30 + R(i + 3) * 14, 0, TAU); }, '#f4fbff', { sh: 4 }); }
  if (t >= c.millions) tag(['DES MILLIONS', "D'ANNÉES"], 640, 760, 72, { bg: P.salt, fg: P.navy, rot: -.03, scale: pop(t, c.millions, .3) });
  if (t >= c.encore) { const u = prog(t, c.encore, .9), y = lerp(520, 1330, E.in(u));
    if (u < 1) paper(() => dropPath(540, y, 90, 120), '#3db2e8', { sh: 6 });
    else { const r = (t - c.encore - .9) * 260; ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(540, 1340, r, r * .26, 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
}

/* =========================================================================================
   Orchestration : choix de la scène, balayages de papier, sous-titres, grain
   ========================================================================================= */
function plan() {
  const c = TIMING.cues;
  return [{ t: 0, f: sceneA }, { t: c.halley - .1, f: sceneB, wipe: 1 }, { t: c.riv - .15, f: sceneC, wipe: 1 }, { t: c.dou - .15, f: sceneD, wipe: 1 }, { t: c.chem - .1, f: sceneE, wipe: 1 },
    { t: c.imagine - .1, f: sceneF1, wipe: 1 }, { t: c.couche - .04, f: sceneF2 }, { t: c.partout - .3, f: sceneF3 }, { t: c.tasse - .1, f: sceneG, wipe: 1 }];
}
function renderFrame(t) {
  setTime(t); const pl = plan(); let i = 0; while (i + 1 < pl.length && T >= pl[i + 1].t) i++;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H); ctx.save();
  const s0 = pl[i].t, s1 = i + 1 < pl.length ? pl[i + 1].t : TIMING.video_end;
  camera((T - s0) / Math.max(.1, s1 - s0), 1.0, 1.045, W / 2, 900, 0, -16);
  pl[i].f(T); ctx.restore();
  grain(); subtitles(T);
  for (const p of pl) if (p.wipe) wipeSheets(T, p.t);
}

/* ---------- couverture (image fixe 1080x1920 ; le titre reste dans le cadrage central 3:4) ---------- */
function renderCover() {
  setTime(.4); K = 7;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
  fillBg(P.sky);
  paper(() => { ctx.beginPath(); ctx.arc(880, 330, 130, 0, TAU); }, '#fff0c9', { sh: 0, edge: false });
  cloud(230, 330, 130, '#ffffff'); cloud(830, 250, 100, '#eef5f9');
  rain(26, 0, '#8cc3de', 0, W, 200, 1200, 90, 10, 17);
  extruded('POURQUOI LA MER', 540, 470, 112, P.navy, P.coral, { depth: 10, rot: -.012 });
  extruded('EST SALÉE ?', 540, 640, 176, P.navy, P.coral, { depth: 14, rot: .012 });
  paper(() => dropPath(540, 1020, 560, 740), '#3db2e8', { sh: 20 });
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(380, 1090, 46, 150, .25, 0, TAU); ctx.fill();
  tag(['ÇA COMMENCE PAR', 'UNE GOUTTE DE PLUIE'], 540, 1010, 56, { bg: P.sun, fg: P.navy, rot: -.04, sh: 12 });
  waveBand(1300, 20, 480, 1.2, '#8fd8ea', { seed: 1 }); waveBand(1370, 22, 400, 2.4, '#2fa4d0', { seed: 2 }); waveBand(1460, 22, 540, 3.9, '#1f78b4', { seed: 3 }); waveBand(1580, 22, 460, 1, '#0e4a78', { seed: 4 }); waveBand(1730, 20, 600, 2, '#0a3a60', { seed: 5 });
  [[170, 1290, 110, .4], [330, 1240, 70, -.3], [800, 1270, 120, .2], [940, 1210, 76, -.5], [640, 1330, 60, .8], [480, 1350, 52, 1.2]].forEach(([x, y, z, r]) => cube(x, y, z, r, 1));
  grain();
}
