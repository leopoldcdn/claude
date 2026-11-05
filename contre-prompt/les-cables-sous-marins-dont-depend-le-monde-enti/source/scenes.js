/* « Les câbles sous-marins » : scènes en papier découpé, coupe de l'océan, calées sur la voix off. */
'use strict';
const SURF = 560;
function camera(s, z0, z1, cx = W / 2, cy = 900, dx = 0, dy = 0) { const z = lerp(z0, z1, clamp(s)); ctx.translate(cx + dx * s, cy + dy * s); ctx.scale(z, z); ctx.translate(-cx, -cy); }
const fmt = (v, d = 0) => v.toFixed(d).replace('.', ',');
const spaced = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/* ---------- décor : coupe de l'océan ---------- */
const seabedY = x => 1160 + 22 * Math.sin(x / 150 + 1) + 14 * Math.sin(x / 61);
function seaBg(t, surf = SURF, ex = 0) {
  let g = ctx.createLinearGradient(0, 0, 0, surf); g.addColorStop(0, '#8fd0ea'); g.addColorStop(1, '#eaf8f6'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, surf + 60);
  g = ctx.createLinearGradient(0, surf, 0, H); g.addColorStop(0, P.sea); g.addColorStop(.3, P.deep); g.addColorStop(1, P.navy); ctx.fillStyle = g; ctx.fillRect(0, surf, W, H - surf);
  ctx.save(); ctx.globalAlpha = .07; ctx.fillStyle = '#fff';
  for (let i = 0; i < 4; i++) { const x = 160 + i * 270 + Math.sin(t * .5 + i) * 30; ctx.beginPath(); ctx.moveTo(x, surf); ctx.lineTo(x + 130, surf); ctx.lineTo(x + 330, 1200); ctx.lineTo(x + 90, 1200); ctx.closePath(); ctx.fill(); } ctx.restore();
  waveBand(surf, 14 + ex, 280, T * 1.3, 'rgba(143,216,234,.6)', { seed: 3, sh: 8 });
  const span = 1150 - surf - 70;
  ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.35)';
  for (let i = 0; i < 16; i++) { const x = R(i * 5 + 1) * W + Math.sin(T + i) * 8, y = 1150 - ((R(i * 5 + 2) * span + T * (45 + R(i * 5 + 3) * 50)) % span), r = 5 + R(i * 5 + 4) * 9; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } ctx.restore();
}
function deepBg(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P.deep); g.addColorStop(1, P.navy); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.3)';
  for (let i = 0; i < 18; i++) { const x = R(i * 5 + 9) * W + Math.sin(T + i) * 8, y = H - ((R(i * 5 + 2) * H + T * (40 + R(i * 5 + 3) * 50)) % H), r = 4 + R(i * 5 + 4) * 9; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } ctx.restore();
}
function seabed() {
  paper(() => { ctx.beginPath(); ctx.moveTo(-40, H + 40); for (let x = -40; x <= W + 40; x += 30) ctx.lineTo(x, seabedY(x) + jit(x, 1.1)); ctx.lineTo(W + 40, H + 40); ctx.closePath(); }, P.rock2, { sh: 12, edgec: 'rgba(255,255,255,.25)' });
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.14)'; for (let i = 0; i < 14; i++) { const x = R(i * 3 + 1) * W, y = seabedY(x) + 60 + R(i * 3 + 2) * 300; ctx.beginPath(); ctx.ellipse(x, y, 30 + R(i * 3) * 50, 12 + R(i * 3 + 7) * 14, 0, 0, TAU); ctx.fill(); } ctx.restore();
}
const cableY = (x, off = -12) => seabedY(x) + off;
function cablePath(a, b, off) { ctx.beginPath(); for (let x = a; x <= b; x += 20) { const y = cableY(x, off); x === a ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.lineTo(b, cableY(b, off)); }
function cable(x0, x1, o = {}) {
  const w = o.w || 22, off = o.off == null ? -12 : o.off, segs = o.cut == null ? [[x0, x1]] : [[x0, o.cut - o.gap / 2], [o.cut + o.gap / 2, x1]];
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [a, b] of segs) { if (b <= a) continue;
    ctx.save(); ctx.translate(3, 8); cablePath(a, b, off); ctx.strokeStyle = 'rgba(6,18,36,.35)'; ctx.lineWidth = w + 8; ctx.stroke(); ctx.restore();
    cablePath(a, b, off); ctx.strokeStyle = P.navy; ctx.lineWidth = w + 7; ctx.stroke();
    cablePath(a, b, off); ctx.strokeStyle = o.col || P.sun; ctx.lineWidth = w - 5; ctx.stroke(); }
  ctx.restore();
}
function packets(x0, x1, speed, n, t0 = 0, gate = null) {
  const L = x1 - x0; ctx.save();
  for (let i = 0; i < n; i++) { const u = ((T - t0) * speed + i * L / n) % L, x = x0 + u; if (T < t0) continue; if (gate && !gate(x)) continue; const y = cableY(x);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(x, y, 20, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); }
  ctx.restore();
}

/* ---------- objets ---------- */
function envelope(x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  paper(() => rrect(-62, -42, 124, 84, 10), P.salt, { sh: 8 });
  ctx.strokeStyle = P.coral; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-56, -34); ctx.lineTo(0, 8); ctx.lineTo(56, -34); ctx.stroke(); ctx.restore();
}
function phoneS(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  paper(() => rrect(-60, -105, 120, 210, 24), P.navy, { sh: 10 });
  ctx.fillStyle = P.aqua; rrect(-48, -86, 96, 164, 12); ctx.fill();
  ctx.fillStyle = P.salt; rrect(-36, -62, 58, 26, 12); ctx.fill(); ctx.fillStyle = P.sun; rrect(-22, -24, 58, 26, 12); ctx.fill(); ctx.restore();
}
function satellite(x, y, s, rot, col = P.grey) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (const sx of [-1, 1]) paper(() => rrect(sx * 36 + (sx > 0 ? 0 : -110), -26, 110, 52, 6), col, { sh: 6 });
  paper(() => rrect(-32, -32, 64, 64, 10), P.salt, { sh: 8 }); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill(); ctx.restore();
}
function anchor(x, y, s, rot, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = col || P.ink; ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, -72, 14, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -58); ctx.lineTo(0, 60); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-34, -32); ctx.lineTo(34, -32); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 16, 54, .12 * Math.PI, .88 * Math.PI); ctx.stroke(); ctx.restore();
}
function ship(x, y, s, rot, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (o.crane) { ctx.strokeStyle = P.navy; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(120, -20); ctx.lineTo(120, -150); ctx.lineTo(200, -40); ctx.stroke(); }
  paper(() => { ctx.beginPath(); ctx.moveTo(-220, -22); ctx.lineTo(220, -22); ctx.lineTo(165, 62); ctx.lineTo(-175, 62); ctx.closePath(); }, o.hull || P.coral, { sh: 10 });
  paper(() => rrect(-100, -112, 130, 90, 12), P.salt, { sh: 6 });
  ctx.fillStyle = P.sky; for (const dx of [-84, -50, -16]) { rrect(dx, -92, 26, 26, 6); ctx.fill(); }
  paper(() => rrect(-40, -146, 22, 36, 5), o.hull || P.coral, { sh: 4 });
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(-190, 18, 340, 8);
  ctx.restore();
}
function calendar(x, y, s, rot, num, lab) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  paper(() => rrect(-150, -140, 300, 280, 26), P.salt, { sh: 16 });
  ctx.save(); rrect(-150, -140, 300, 280, 26); ctx.clip(); ctx.fillStyle = P.coral; ctx.fillRect(-150, -140, 300, 66); ctx.restore();
  ctx.fillStyle = P.salt; for (const dx of [-80, 80]) { ctx.beginPath(); ctx.arc(dx, -140, 14, 0, TAU); ctx.fill(); }
  ctx.fillStyle = P.salt; font(44); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(lab || 'JOURS', 0, -104);
  ctx.fillStyle = P.navy; font(150); ctx.fillText(String(num), 0, 22); ctx.restore();
}
function earth(x, y, r) { paper(() => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }, P.cobalt, { sh: 8 }); ctx.fillStyle = P.green; ctx.beginPath(); ctx.ellipse(x - r * .25, y - r * .2, r * .38, r * .28, .5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + r * .35, y + r * .35, r * .3, r * .2, -.4, 0, TAU); ctx.fill(); }
function moon(x, y, r) { paper(() => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }, '#dcdde0', { sh: 8 }); ctx.fillStyle = 'rgba(0,0,0,.12)'; for (const [dx, dy, k] of [[-.3, -.2, .25], [.3, .1, .2], [-.05, .4, .17]]) { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, k * r, 0, TAU); ctx.fill(); } }
function polyAt(pts, u) { let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; } let r = clamp(u) * L; for (let i = 0; i < seg.length; i++) { if (r <= seg[i] || i === seg.length - 1) { const k = clamp(r / seg[i]); return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } r -= seg[i]; } return pts[pts.length - 1]; }
function polyStroke(pts, u, col, w, dash) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); const N = 60; for (let i = 1; i <= N; i++) { const p = polyAt(pts, u * i / N); ctx.lineTo(p[0], p[1]); } ctx.stroke(); ctx.restore(); }

/* =========================================================================================
   A : « Ton message ne passe presque jamais par le ciel. Il passe au fond de l'océan. »
   ========================================================================================= */
const ROUTE = () => [[170, 470], [170, cableY(170) - 12], [910, cableY(910) - 12], [910, 470]];
function routeScene(t, tagTime) {
  const c = TIMING.cues; seaBg(t); seabed(); cable(-40, W + 40);
  cloud(300, 250, 70, '#ffffff'); cloud(840, 190, 52, 'rgba(255,255,255,.92)');
  phoneS(170, 400, 1.0, -.04); phoneS(910, 400, 1.0, .04);
  return c;
}
function sceneA(t) {
  const c = routeScene(t);
  // le ciel : satellite barré
  const sy = 215 + Math.sin(t * 1.1) * 8; satellite(540, sy, 1.0, .25 * Math.sin(t * .7), P.grey);
  ctx.save(); ctx.setLineDash([16, 18]); ctx.strokeStyle = 'rgba(11,37,64,.45)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(240, 330); ctx.quadraticCurveTo(540, 60, 840, 330); ctx.stroke(); ctx.restore();
  const k = pop(t, c.h1 + 1.3, .3); if (k > 0) { ctx.save(); ctx.translate(540, sy + 4); ctx.scale(k, k); ctx.strokeStyle = P.coral; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-70, -70); ctx.lineTo(70, 70); ctx.moveTo(70, -70); ctx.lineTo(-70, 70); ctx.stroke(); ctx.restore(); }
  if (t > c.h1 + .5) tag('PAS PAR LE CIEL', 540, 705, 62, { bg: P.salt, fg: P.navy, rot: -.03, scale: pop(t, c.h1 + .5, .3) });
  if (t >= c.h2) { const pts = ROUTE(), u = clamp((t - c.h2 - .2) / 3.2); polyStroke(pts, E.io(u), 'rgba(255,255,255,.85)', 7, [4, 20]);
    const p = polyAt(pts, E.io(u)); envelope(p[0], p[1], 1.0, Math.sin(t * 6) * .12);
    if (t > c.h2 + .4) tag("AU FOND DE L'OCÉAN", 540, 860, 66, { bg: P.sun, fg: P.navy, rot: .025, scale: pop(t, c.h2 + .4, .3) }); }
}

/* =========================================================================================
   B : plus de 99 % des données entre pays, environ 500 câbles
   ========================================================================================= */
function sceneB(t) {
  const c = TIMING.cues; deepBg(t);
  const u = E.out(prog(t, c.num + .3, 1.6)), cx = 540, cy = 560, r = 250;
  ctx.save(); ctx.lineCap = 'butt'; ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 62; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
  ctx.strokeStyle = P.sun; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * .99 * u); ctx.stroke(); ctx.restore();
  if (t > c.num) extruded('99 %', cx, cy + 10, 190, P.salt, P.cobalt, { depth: 14, rot: -.015, scale: Math.max(.01, pop(t, c.num, .35)) });
  tag('PLUS DE', cx, 250, 54, { bg: P.aqua, fg: P.navy, rot: -.04, scale: Math.max(.01, pop(t, c.num, .3)) });
  if (t > c.num + 1.2) tag(['DES DONNÉES QUI PASSENT', "D'UN PAYS À L'AUTRE"], cx, 930, 50, { bg: P.salt, fg: P.navy, rot: .02, scale: pop(t, c.num + 1.2, .3) });
  if (t >= c.num2) {
    const nL = 36, e = prog(t, c.num2, 1.6);
    ctx.save(); ctx.lineCap = 'round'; for (let i = 0; i < nL; i++) { const a = clamp(e * 1.4 - i / nL * .4); if (a <= 0) continue; const y0 = 1020 + (i % 12) * 20 + R(i) * 6; ctx.globalAlpha = a * .8; ctx.strokeStyle = i % 3 ? P.sun : P.coral; ctx.lineWidth = 7; ctx.beginPath(); for (let x = -20; x <= W + 20; x += 24) { const y = y0 + Math.sin(x / 140 + i * .9 + t * .8) * 16; x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); } ctx.restore();
    extruded(Math.round(500 * E.out(prog(t, c.num2, 1.4))) + '+', 540, 1170, 120, P.salt, P.coral, { depth: 11, rot: .015, scale: Math.max(.01, pop(t, c.num2, .35)) });
    tag('CÂBLES', 800, 1090, 52, { bg: P.sun, fg: P.navy, rot: .05, scale: pop(t, c.num2 + .3, .3) });
  }
}

/* =========================================================================================
   C : plus d'un million sept cent mille kilomètres = plus de 4 fois Terre-Lune
   ========================================================================================= */
function sceneC(t) {
  const c = TIMING.cues; deepBg(t);
  const k = Math.max(.01, pop(t, c.len, .35));
  extruded(spaced(1700000 * E.out(prog(t, c.len, 1.6))), 540, 300, 150, P.salt, P.cobalt, { depth: 13, rot: -.015, scale: k });
  tag("KM DE CÂBLE, BOUT À BOUT", 540, 440, 54, { bg: P.sun, fg: P.navy, rot: .02, scale: k });
  const X0 = 150, LEN = 780;
  for (let i = 0; i < 5; i++) {
    const y = 640 + i * 108, on = t - (i === 0 ? c.len + 1.6 : c.len2 + (i - 1) * .45); if (on < 0) continue; const frac = i < 4 ? 1 : .42, e = E.out(clamp(on / .5));
    earth(X0, y, 44);
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = P.navy; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(X0 + 44, y); ctx.lineTo(X0 + 44 + (LEN - 90) * frac * e, y); ctx.stroke(); ctx.strokeStyle = P.sun; ctx.lineWidth = 10; ctx.stroke(); ctx.restore();
    if (i < 4) moon(X0 + LEN, y, 34, ); else if (e > .95) { tag('0,4', X0 + 44 + (LEN - 90) * frac + 80, y, 40, { bg: P.aqua, fg: P.navy, rot: .04 }); }
  }
  if (t > c.len + 2.2 && t <= c.len2 + 2.4) tag('TERRE–LUNE : 384 400 KM', 540, 1200, 56, { bg: P.aqua, fg: P.navy, rot: .02, scale: pop(t, c.len + 2.2, .3) });
  if (t > c.len2 + 2.4) tag('PLUS DE 4 FOIS TERRE–LUNE', 540, 1200, 56, { bg: P.coral, fg: '#fff', rot: -.025, scale: pop(t, c.len2 + 2.4, .3) });
}

/* =========================================================================================
   D : un câble = à peu près un tuyau d'arrosage
   ========================================================================================= */
function sceneD(t) {
  const c = TIMING.cues; deepBg(t);
  const k = Math.max(.01, pop(t, c.hose, .4)), cx = 540, cy = 520;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.rotate(Math.sin(t * .8) * .03);
  paper(() => { ctx.beginPath(); ctx.arc(0, 0, 210, 0, TAU); }, '#2b3a4d', { sh: 18 });
  ctx.strokeStyle = '#8fa0b3'; ctx.lineWidth = 26; ctx.setLineDash([22, 14]); ctx.beginPath(); ctx.arc(0, 0, 168, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  paper(() => { ctx.beginPath(); ctx.arc(0, 0, 122, 0, TAU); }, '#c98a3c', { sh: 6 });
  paper(() => { ctx.beginPath(); ctx.arc(0, 0, 76, 0, TAU); }, P.salt, { sh: 4 });
  ctx.fillStyle = P.aqua; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; ctx.beginPath(); ctx.arc(Math.cos(a) * 34, Math.sin(a) * 34, 12, 0, TAU); ctx.fill(); } ctx.restore();
  if (t > c.hose + .5) {
    const kk = pop(t, c.hose + .5, .4); ctx.save(); ctx.translate(540, 1010); ctx.scale(kk, kk);
    for (let i = 0; i < 3; i++) { const y = i * 52 - 40; ctx.strokeStyle = '#1d6b3f'; ctx.lineWidth = 56; ctx.beginPath(); ctx.ellipse(0, y, 250 - i * 14, 78, 0, 0, TAU); ctx.stroke(); ctx.strokeStyle = P.green; ctx.lineWidth = 42; ctx.beginPath(); ctx.ellipse(0, y, 250 - i * 14, 78, 0, 0, TAU); ctx.stroke(); }
    ctx.restore();
    tag("≈ UN TUYAU D'ARROSAGE", 540, 800, 58, { bg: P.sun, fg: P.navy, rot: -.025, scale: kk });
  }
}

/* =========================================================================================
   E : 150 à 200 pannes par an, sept à huit fois sur dix un accident (ancre, filet)
   ========================================================================================= */
function sceneE(t) {
  const c = TIMING.cues; seaBg(t); seabed();
  const CUT = 640, snap = c.fail2 + 2.6, cut = t >= snap;
  cable(-40, W + 40, cut ? { cut: CUT, gap: 70 } : {});
  const ts = prog(t, c.fail2, 2.6), shipX = lerp(210, CUT + 5, E.io(ts)), shipY = SURF - 8 + Math.sin(t * 2.1) * 5;
  if (t >= c.fail2 - .3) {
    const ax = shipX + 20, ay = lerp(SURF + 90, cableY(shipX) - 40, E.out(prog(t, c.fail2, 1.0)));
    ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 6; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(shipX + 20, shipY + 40); ctx.lineTo(ax, ay - 70); ctx.stroke(); ctx.restore();
    anchor(ax, ay, 1.0, -.1 + Math.sin(t * 3) * .05, P.ink);
  }
  ship(shipX, shipY, .9, Math.sin(t * 1.7) * .02, { hull: P.navy });
  if (cut) { const e = prog(t, snap, .6); ctx.save(); ctx.globalAlpha = 1 - e; ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.lineCap = 'round'; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r0 = 30 + e * 40, r1 = r0 + 36; ctx.beginPath(); ctx.moveTo(CUT + Math.cos(a) * r0, cableY(CUT) + Math.sin(a) * r0); ctx.lineTo(CUT + Math.cos(a) * r1, cableY(CUT) + Math.sin(a) * r1); ctx.stroke(); } ctx.restore(); }
  if (t < c.fail2) { const k = Math.max(.01, pop(t, c.fail, .35)); extruded('150 – 200', 540, 300, 150, P.salt, P.cobalt, { depth: 13, rot: -.015, scale: k }); tag('PANNES PAR AN', 540, 420, 54, { bg: P.coral, fg: '#fff', rot: .02, scale: k }); }
  else { tag(['7 À 8 FOIS SUR 10 :', 'UN ACCIDENT'], 540, 770, 56, { bg: P.salt, fg: P.navy, rot: -.02, scale: pop(t, c.fail2 + .2, .3) });
    if (t > c.fail2 + 1.2) tag('ANCRE · FILET DE PÊCHE', 540, 940, 46, { bg: P.sun, fg: P.navy, rot: .02, scale: pop(t, c.fail2 + 1.2, .3) }); }
}

/* =========================================================================================
   F : réparer prend du temps, une vingtaine de navires, 51 jours en moyenne
   ========================================================================================= */
function sceneF(t) {
  const c = TIMING.cues; seaBg(t); seabed(); cable(-40, W + 40, { cut: 640, gap: 90, col: P.sun });
  ctx.save(); ctx.fillStyle = P.coral; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(640 + sx * 45, cableY(640 + sx * 45), 15, 0, TAU); ctx.fill(); } ctx.restore();
  const e = E.out(prog(t, c.ship, 1.0)), sx = lerp(1300, 600, e), sy = SURF - 10 + Math.sin(t * 2) * 5;
  const hook = prog(t, c.ship + 1.0, 2.0);
  ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(sx + 130, sy - 40); ctx.lineTo(sx + 130 + 10, lerp(sy, cableY(640) - 20, E.io(hook))); ctx.stroke(); ctx.restore();
  ship(sx, sy, .95, Math.sin(t * 1.6) * .02, { hull: P.coral, crane: true });
  if (t > c.ship + .9) tag(['≈ 20 NAVIRES', 'POUR RÉPARER'], 540, 720, 58, { bg: P.salt, fg: P.navy, rot: -.025, scale: pop(t, c.ship + .9, .3) });
  if (t >= c.ship2) { const u = E.out(prog(t, c.ship2 + .3, 2.8)); calendar(220, 985, Math.max(.01, pop(t, c.ship2, .35)), -.05, Math.round(51 * u), 'JOURS'); tag(['EN MOYENNE,', 'EN 2024'], 700, 985, 56, { bg: P.sun, fg: P.navy, rot: .04, scale: pop(t, c.ship2 + .4, .3) }); }
}

/* =========================================================================================
   G : Tonga, janvier 2022 : 38 jours
   ========================================================================================= */
function sceneG(t) {
  const c = TIMING.cues, er = c.tonga + 1.0, big = prog(t, er, 1.2) * (1 - prog(t, er + 3, 3) * .6);
  seaBg(t, SURF, big * 40); seabed(); cable(-40, W + 40, t > er ? { cut: 400, gap: 80 } : {});
  // île + volcan
  const vx = 740, vy = SURF + 4;
  paper(() => { ctx.beginPath(); ctx.moveTo(vx - 250, vy + 10); ctx.lineTo(vx - 60, vy - 190); ctx.lineTo(vx + 60, vy - 190); ctx.lineTo(vx + 250, vy + 10); ctx.closePath(); }, P.rock, { sh: 14 });
  ctx.fillStyle = P.green; ctx.beginPath(); ctx.ellipse(vx - 150, vy - 20, 80, 22, 0, 0, TAU); ctx.fill();
  if (t > er) { const a = t - er;
    for (let i = 0; i < 46; i++) { const ph = (a * .9 + R(i) * 1.3) % 1.6, ang = -Math.PI / 2 + (R(i + 40) - .5) * 1.5, sp = 260 + R(i + 80) * 380, x = vx + Math.cos(ang) * sp * ph * .7 + (R(i + 5) - .5) * 40, y = vy - 190 + Math.sin(ang) * sp * ph + 380 * ph * ph, k = ph / 1.6;
      ctx.fillStyle = k < .35 ? P.coral : k < .6 ? P.sun : 'rgba(90,100,115,.85)'; ctx.beginPath(); ctx.arc(x, y, (k < .6 ? 11 : 24) * (1 - k * .4), 0, TAU); ctx.fill(); }
    ctx.save(); ctx.globalAlpha = clamp(a / 1.2) * .9; for (const [dx, dy, r] of [[0, -330, 110], [-110, -290, 90], [120, -310, 95], [20, -420, 100]]) { paper(() => { ctx.beginPath(); ctx.arc(vx + dx, vy + dy - a * 14, r * (1 + a * .06), 0, TAU); }, '#6c7684', { sh: 8, edge: false }); } ctx.restore(); }
  if (t > er) { const e = prog(t, er + .1, .5); ctx.save(); ctx.globalAlpha = 1 - prog(t, er + .6, .5); ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.lineCap = 'round'; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r0 = 30 + e * 40; ctx.beginPath(); ctx.moveTo(400 + Math.cos(a) * r0, cableY(400) + Math.sin(a) * r0); ctx.lineTo(400 + Math.cos(a) * (r0 + 36), cableY(400) + Math.sin(a) * (r0 + 36)); ctx.stroke(); } ctx.restore(); }
  tag('TONGA · JANVIER 2022', 330, 330, 46, { bg: P.salt, fg: P.navy, rot: -.03, scale: Math.max(.01, pop(t, c.tonga, .3)) });
  if (t > c.tonga + 2.6 && t < c.tonga2) tag('ÉRUPTION + TSUNAMI', 330, 440, 44, { bg: P.coral, fg: '#fff', rot: .03, scale: pop(t, c.tonga + 2.6, .3) });
  if (t >= c.tonga2) { const u = E.out(prog(t, c.tonga2, 3.2)); calendar(300, 800, Math.max(.01, pop(t, c.tonga2, .35)), -.04, Math.round(38 * u), 'JOURS');
    satellite(700, 850, .9, .2, P.grey); ctx.save(); ctx.strokeStyle = P.salt; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.setLineDash([2, 16]); ctx.beginPath(); ctx.moveTo(700, 920); ctx.lineTo(740, 1050); ctx.stroke(); ctx.restore();
    tag(['CONNEXIONS', 'DE FORTUNE'], 700, 1100, 48, { bg: P.sun, fg: P.navy, rot: .03, scale: pop(t, c.tonga2 + .6, .3) }); }
}

/* =========================================================================================
   H : ailleurs, les données prennent un autre chemin
   ========================================================================================= */
function sceneH(t) {
  const c = TIMING.cues; deepBg(t);
  const N = { a: [190, 520], b: [540, 360], c: [890, 520], d: [320, 900], e: [760, 900] };
  const ed = [['a', 'b'], ['b', 'c'], ['a', 'd'], ['d', 'e'], ['e', 'c'], ['b', 'e']];
  const cutT = c.reroute + 2.0, cutNow = t >= cutT;
  ctx.save(); ctx.lineCap = 'round';
  for (const [p, q] of ed) { const isCut = p === 'b' && q === 'c'; if (isCut && cutNow) continue; const a = N[p], b = N[q];
    ctx.strokeStyle = P.navy; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.strokeStyle = P.sun; ctx.lineWidth = 11; ctx.stroke(); }
  ctx.restore();
  if (cutNow) { const m = [(N.b[0] + N.c[0]) / 2, (N.b[1] + N.c[1]) / 2], k = pop(t, cutT, .3); ctx.save(); ctx.translate(m[0], m[1]); ctx.scale(k, k); ctx.strokeStyle = P.coral; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-40, -40); ctx.lineTo(40, 40); ctx.moveTo(40, -40); ctx.lineTo(-40, 40); ctx.stroke(); ctx.restore(); }
  const route = cutNow ? [N.a, N.d, N.e, N.c] : [N.a, N.b, N.c], cyc = 2.4, base = cutNow ? cutT : c.reroute;
  if (t >= c.reroute) { const u = clamp(((t - base) % cyc) / cyc * 1.15); const p = polyAt(route, E.io(Math.min(u, 1))); envelope(p[0], p[1], .8, Math.sin(t * 6) * .12); }
  for (const k of Object.keys(N)) { const [x, y] = N[k]; paper(() => { ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); }, k === 'a' || k === 'c' ? P.salt : P.aqua, { sh: 8 }); }
  tag('TOI', N.a[0], N.a[1] - 80, 42, { bg: P.salt, fg: P.navy, rot: -.03 }); tag("L'AUTRE BOUT", N.c[0], N.c[1] - 80, 40, { bg: P.salt, fg: P.navy, rot: .03 });
  if (cutNow) tag(['LE RÉSEAU', 'CONTOURNE'], 540, 1130, 60, { bg: P.sun, fg: P.navy, rot: -.02, scale: pop(t, cutT + .3, .3) });
}

/* =========================================================================================
   I : retour à toi : un tuyau posé au fond de l'eau
   ========================================================================================= */
function sceneI(t) {
  const c = TIMING.cues; seaBg(t); seabed(); cable(-40, W + 40);
  cloud(300, 250, 70, '#ffffff'); cloud(840, 190, 52, 'rgba(255,255,255,.92)');
  const lift = E.out(prog(t, c.fin, .6)); phoneS(170, 400, 1.0, -.04); phoneS(910, 400, 1.0, .04);
  const pts = ROUTE(), u = ((t - c.fin) / 3.4) % 1; polyStroke(pts, 1, 'rgba(255,255,255,.55)', 7, [4, 20]);
  const p = polyAt(pts, E.io(clamp(u))); envelope(p[0], p[1], 1.0, Math.sin(t * 6) * .12);
  tag("À L'ÉTRANGER ?", 540, 700, 56, { bg: P.salt, fg: P.navy, rot: -.03, scale: Math.max(.01, pop(t, c.fin, .3)) });
  if (t >= c.fin2) { const k = Math.max(.01, pop(t, c.fin2, .35)); extruded('UN TUYAU', 540, 880, 120, P.salt, P.cobalt, { depth: 11, rot: -.015, scale: k }); extruded("AU FOND DE L'EAU", 540, 1000, 78, P.sun, P.coral, { depth: 9, rot: .012, scale: k }); }
}

/* ---------- orchestration ---------- */
function plan() {
  const c = TIMING.cues;
  return [{ t: 0, f: sceneA }, { t: c.num - .1, f: sceneB, wipe: 1 }, { t: c.len - .1, f: sceneC, wipe: 1 }, { t: c.hose - .1, f: sceneD, wipe: 1 }, { t: c.fail - .1, f: sceneE, wipe: 1 }, { t: c.ship - .1, f: sceneF, wipe: 1 }, { t: c.tonga - .1, f: sceneG, wipe: 1 }, { t: c.reroute - .1, f: sceneH, wipe: 1 }, { t: c.fin - .1, f: sceneI, wipe: 1 }];
}
function renderFrame(t) {
  setTime(t); const pl = plan(); let i = 0; while (i + 1 < pl.length && T >= pl[i + 1].t) i++;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H); ctx.save();
  const s0 = pl[i].t, s1 = i + 1 < pl.length ? pl[i + 1].t : TIMING.video_end;
  camera((T - s0) / Math.max(.1, s1 - s0), 1.0, 1.04, W / 2, 900, 0, -12);
  pl[i].f(T); ctx.restore();
  grain(); subtitles(T);
  for (const p of pl) if (p.wipe) wipeSheets(T, p.t);
}
function renderCover() {
  setTime(.4); K = 7; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
  seaBg(0); seabed(); cable(-40, W + 40, { w: 34 }); packets(-40, W + 40, 0, 0);
  cloud(250, 260, 70, '#ffffff'); cloud(870, 200, 55, 'rgba(255,255,255,.92)');
  extruded('LES CÂBLES', 540, 380, 150, P.salt, P.cobalt, { depth: 14, rot: -.012 }); extruded('SOUS-MARINS', 540, 540, 128, P.sun, P.coral, { depth: 12, rot: .01 });
  tag(['PLUS DE 99 % DES DONNÉES', "ENTRE PAYS PASSENT ICI"], 540, 800, 54, { bg: P.salt, fg: P.navy, rot: -.025, sh: 12 });
  envelope(300, cableY(300) - 120, 1.3, -.2);
  grain();
}
