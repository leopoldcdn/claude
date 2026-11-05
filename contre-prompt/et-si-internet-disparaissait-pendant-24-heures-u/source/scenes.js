/* « Et si Internet disparaissait pendant 24 heures ? » : scènes en papier découpé, nuit électrique, calées sur la voix off. */
'use strict';
const cue = n => TIMING.cues[n];
const N = { night: '#0a1630', night2: '#12254d', cyan: '#3fd4ff', cyanDk: '#1b8fb8', red: '#ff4d6d', amber: '#ffc247', white: '#f4f8ff', gray: '#6c7a96', paper: '#eef3fb', ink: '#0b1a33', green: '#4be3a0' };
const hex = c => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mixc = (a, b, t) => { const A = hex(a), B = hex(b); t = clamp(t); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',') + ')'; };
function camera(s, z0, z1, cx = W / 2, cy = 900, dx = 0, dy = 0) { const z = lerp(z0, z1, clamp(s)); ctx.translate(cx + dx * s, cy + dy * s); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function nightBg(t) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0d1d3f'); g.addColorStop(1, '#060e22'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .08; ctx.strokeStyle = N.cyan; ctx.lineWidth = 2; for (let x = 0; x <= W; x += 90) { ctx.beginPath(); ctx.moveTo(x + Math.sin(t * .4) * 4, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y <= H; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore(); }
function polyPath(pts) { return () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }; }
const fmt = (v, d = 0) => v.toFixed(d).replace('.', ',');

/* ---------- dessins ---------- */
function wifi(x, y, s, level, col, ok = true) {
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 3; i >= 1; i--) { const on = i <= level; ctx.strokeStyle = on ? col : 'rgba(255,255,255,.14)'; ctx.lineWidth = 15 * s; ctx.beginPath(); ctx.arc(x, y, i * 36 * s, -Math.PI * .8, -Math.PI * .2); ctx.stroke(); }
  ctx.fillStyle = level > 0 ? col : 'rgba(255,255,255,.14)'; ctx.beginPath(); ctx.arc(x, y, 12 * s, 0, TAU); ctx.fill(); ctx.restore();
}
function phone(x, y, w, h, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  paper(() => rrect(-w / 2, -h / 2, w, h, 70), N.paper, { sh: 22 });
  ctx.fillStyle = o.screen || N.night; rrect(-w / 2 + 26, -h / 2 + 26, w - 52, h - 52, 46); ctx.fill();
  paper(() => rrect(-60, -h / 2 + 14, 120, 18, 9), '#c8d3e6', { sh: 0, edge: false });
  ctx.restore();
}
function icon(kind, x, y, s, col, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (kind === 'bank') { ctx.beginPath(); ctx.moveTo(-70, -22); ctx.lineTo(0, -72); ctx.lineTo(70, -22); ctx.closePath(); ctx.fill(); for (const dx of [-48, 0, 48]) ctx.fillRect(dx - 11, -12, 22, 62); ctx.fillRect(-72, 56, 144, 16); }
  else if (kind === 'plane') { ctx.beginPath(); ctx.moveTo(-70, 8); ctx.lineTo(72, -50); ctx.lineTo(30, 56); ctx.lineTo(8, 14); ctx.closePath(); ctx.fill(); ctx.strokeStyle = N.night; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(72, -50); ctx.lineTo(8, 14); ctx.stroke(); }
  else if (kind === 'chat') { rrect(-72, -52, 144, 96, 30); ctx.fill(); ctx.beginPath(); ctx.moveTo(-30, 40); ctx.lineTo(-44, 80); ctx.lineTo(8, 44); ctx.closePath(); ctx.fill(); ctx.fillStyle = N.night; for (const dx of [-32, 0, 32]) { ctx.beginPath(); ctx.arc(dx, -4, 8, 0, TAU); ctx.fill(); } }
  else if (kind === 'card') { rrect(-76, -50, 152, 100, 16); ctx.fill(); ctx.fillStyle = N.night; ctx.fillRect(-76, -26, 152, 22); ctx.fillStyle = N.night; ctx.fillRect(-56, 18, 54, 12); }
  else if (kind === 'cart') { ctx.beginPath(); ctx.moveTo(-76, -50); ctx.lineTo(-48, -50); ctx.lineTo(-24, 28); ctx.lineTo(56, 28); ctx.lineTo(70, -24); ctx.lineTo(-40, -24); ctx.stroke(); for (const dx of [-14, 44]) { ctx.beginPath(); ctx.arc(dx, 56, 12, 0, TAU); ctx.fill(); } }
  else if (kind === 'cross') { ctx.fillRect(-26, -66, 52, 132); ctx.fillRect(-66, -26, 132, 52); }
  ctx.restore();
}
let NET = null;
function netInit() {
  const pts = []; for (let i = 0; i < 52; i++) pts.push({ x: 110 + R(i * 3 + 1) * 860, y: 320 + R(i * 3 + 2) * 840, r: 11 + R(i * 3 + 3) * 14, fb: false });
  pts.push({ x: 250, y: 520, r: 24, fb: true, name: 'FACEBOOK' }, { x: 380, y: 640, r: 22, fb: true, name: 'INSTAGRAM' }, { x: 230, y: 740, r: 22, fb: true, name: 'WHATSAPP' });
  const edges = []; pts.forEach((p, i) => { const d = pts.map((q, j) => [j, Math.hypot(p.x - q.x, p.y - q.y)]).filter(x => x[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 3); d.forEach(([j]) => { if (!edges.find(e => (e[0] === i && e[1] === j) || (e[0] === j && e[1] === i))) edges.push([i, j]); }); });
  NET = { pts, edges };
}
function drawNet(t, t0, per, o = {}) {
  if (!NET) netInit(); const { pts, edges } = NET; const cut = o.cut == null ? 0 : o.cut;
  const vis = i => clamp((t - t0 - i * per) / .3);
  ctx.save(); ctx.lineCap = 'round';
  for (const [i, j] of edges) {
    const a = pts[i], b = pts[j], v = Math.min(vis(i), vis(j)); if (v <= 0) continue;
    const isfb = a.fb || b.fb, w = isfb ? (1 - cut) : 1; if (w <= 0) continue;
    ctx.globalAlpha = v * w * .85; ctx.strokeStyle = N.cyan; ctx.lineWidth = isfb ? 6 : 5; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  ctx.restore();
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], v = vis(i); if (v <= 0) continue; const k = E.back(v);
    let col = N.cyan, dx = 0, dy = 0; if (p.fb) { col = mixc(N.amber, N.gray, cut); dx = -cut * 60; dy = cut * 40; }
    ctx.save(); ctx.translate(p.x + dx, p.y + dy); ctx.scale(k, k);
    paper(() => { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, TAU); }, col, { sh: 6, edgec: 'rgba(255,255,255,.5)' }); ctx.restore();
  }
}
function card(x, y, s, rot, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  paper(() => rrect(-210, -130, 420, 260, 28), col || '#3b6cff', { sh: 18 });
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-210, -80, 420, 46); ctx.fillStyle = '#ffd36b'; rrect(-170, -4, 70, 54, 10); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.75)'; for (let i = 0; i < 4; i++) ctx.fillRect(-170 + i * 92, 78, 70, 14); ctx.restore();
}
function board(x, y, t, t0, rows) {
  ctx.save(); ctx.translate(x, y);
  paper(() => rrect(-440, -330, 880, 660, 30), '#111a2e', { sh: 20 });
  ctx.fillStyle = N.amber; font(40); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('DÉPARTS', -400, -290); ctx.textAlign = 'right'; ctx.fillText('ÉTAT', 400, -290);
  rows.forEach((r, i) => {
    const yy = -210 + i * 96, flip = prog(t, t0 + i * .42, .3), cancelled = flip > .5;
    ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(-410, yy - 36, 820, 72);
    ctx.fillStyle = N.white; font(44); ctx.textAlign = 'left'; ctx.fillText(r, -390, yy);
    const sc = Math.abs(Math.cos(flip * Math.PI)); ctx.save(); ctx.translate(310, yy); ctx.scale(1, cancelled || flip === 0 ? Math.max(.1, sc) : Math.max(.1, sc));
    ctx.fillStyle = cancelled ? N.red : N.green; rrect(-120, -30, 240, 60, 14); ctx.fill(); ctx.fillStyle = '#fff'; font(34); ctx.textAlign = 'center'; ctx.fillText(cancelled ? 'ANNULÉ' : "À L'HEURE", 0, 2); ctx.restore();
  });
  ctx.restore();
}
/* Terre de nuit : les lumières des villes s'éteignent progressivement */
let NS = null;
function prepNight() {
  const mk = img => { const k = document.createElement('canvas'); k.width = 900; k.height = 900; const g = k.getContext('2d'); g.drawImage(img, 0, 0, 900, 900); return g.getImageData(0, 0, 900, 900); };
  const off = mk(IMG.nuitOff), ord = mk(IMG.nuitOrder), out = document.createElement('canvas'); out.width = 900; out.height = 900; const og = out.getContext('2d');
  NS = { off, ord, out, og, img: og.createImageData(900, 900) };
}
function nightDraw(cx, cy, size, p) {
  if (!NS) prepNight(); const s = size / 900, x0 = cx - size / 2, y0 = cy - size / 2;
  ctx.drawImage(IMG.nuit, x0, y0, size, size);
  if (p > 0) { const f = NS.off.data, od = NS.ord.data, o = NS.img.data, th = p * 1.12;
    for (let i = 0; i < f.length; i += 4) { const a = f[i + 3]; if (!a) { o[i + 3] = 0; continue; } const k = clamp((th - od[i] / 255) * 8); o[i] = f[i]; o[i + 1] = f[i + 1]; o[i + 2] = f[i + 2]; o[i + 3] = a * k; }
    NS.og.putImageData(NS.img, 0, 0); ctx.drawImage(NS.out, x0, y0, size, size); }
}

/* =========================================================================================
   A : « Et si Internet disparaissait pendant vingt-quatre heures ? »
   ========================================================================================= */
function sceneA(t) {
  const c = TIMING.cues; nightBg(t);
  const lose = prog(t, c.h2 - .2, 1.6), lvl = lose < .25 ? 3 : lose < .5 ? 2 : lose < .75 ? 1 : 0;
  phone(540, 980, 560, 900, { rot: Math.sin(t * 1.2) * .01 + (lose > .75 ? Math.sin(t * 30) * .004 : 0) });
  wifi(540, 1090, 2.0, lvl, N.cyan);
  if (lose > .75) { ctx.save(); ctx.strokeStyle = N.red; ctx.lineWidth = 34; ctx.lineCap = 'round'; const k = E.back(prog(lose, .75, .25)); ctx.globalAlpha = Math.min(1, k); ctx.beginPath(); ctx.moveTo(400, 890); ctx.lineTo(400 + 280 * k, 890 + 280 * k); ctx.moveTo(680, 890); ctx.lineTo(680 - 280 * k, 890 + 280 * k); ctx.stroke(); ctx.restore(); }
  // horloge 24 h
  const k = Math.max(.01, pop(t, .25, .35)); ctx.save(); ctx.translate(540, 700); ctx.scale(k, k);
  extruded('24 H', 0, 0, 150, N.white, N.cyanDk, { depth: 12, rot: -.02 }); ctx.restore();
  const tOut = prog(t, c.surprise - .3, .3);
  if (tOut < 1) { ctx.save(); ctx.translate(0, -tOut * 400); extruded('ET SI INTERNET', 540, 300, 84, N.white, N.cyanDk, { depth: 8, rot: -.012 }); extruded('DISPARAISSAIT ?', 540, 410, 100, N.cyan, '#0a5a78', { depth: 9, rot: .01 }); ctx.restore(); }
  if (t > c.h2 + 1.2) tag('IMPOSSIBLE À SIMULER', 540, 1215, 54, { bg: N.amber, fg: N.ink, rot: -.03, scale: pop(t, c.h2 + 1.2, .3) });
}

/* =========================================================================================
   B : personne ne peut éteindre tout Internet d'un coup
   ========================================================================================= */
function sceneB(t) {
  const c = TIMING.cues; nightBg(t);
  drawNet(t, c.surprise, .06);
  if (t > c.surprise + .2 && t < c.isoc) { const k = pop(t, c.surprise + .2, .35); ctx.save(); ctx.translate(540, 780); ctx.scale(k, k);
    paper(() => rrect(-170, -120, 340, 240, 36), N.paper, { sh: 16 }); ctx.fillStyle = N.ink; ctx.fillRect(-50, -70, 100, 140); ctx.fillStyle = N.red; ctx.fillRect(-30, -40, 60, 40);
    ctx.strokeStyle = N.red; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-150, -110); ctx.lineTo(150, 110); ctx.stroke(); ctx.restore();
    tag("PAS D'INTERRUPTEUR", 540, 1010, 62, { bg: N.paper, fg: N.red, rot: .03, scale: k }); }
  if (t >= c.isoc) { tag(['DES DIZAINES DE MILLIERS', 'DE RÉSEAUX'], 540, 330, 54, { bg: N.cyan, fg: N.ink, rot: -.02, scale: pop(t, c.isoc, .3) });
    if (t > c.isoc + 2.0) tag("PERSONNE N'EN EST LE PATRON", 540, 1180, 52, { bg: N.paper, fg: N.ink, rot: .02, scale: pop(t, c.isoc + 2.0, .3) }); }
}

/* =========================================================================================
   C : Facebook sort d'Internet, plus de cinq heures
   ========================================================================================= */
function sceneC(t) {
  const c = TIMING.cues; nightBg(t);
  const cut = E.io(prog(t, c.fb + .3, 1.3));
  drawNet(t, -10, .0, { cut });
  if (!NET) netInit(); NET.pts.filter(p => p.fb).forEach(p => { if (cut > .3) { const a = prog(cut, .3, .5); ctx.save(); ctx.globalAlpha = a; const dx = -cut * 60, dy = cut * 40; tag(p.name, p.x + dx + (p.name === 'WHATSAPP' ? 0 : 100), p.y + dy - 50, 34, { bg: N.gray, fg: N.white, rot: -.02, scale: 1 }); ctx.restore(); } });
  if (t >= c.fb2) {
    const k = pop(t, c.fb2, .35); ctx.save(); ctx.translate(780, 330); ctx.scale(k, k);
    paper(() => { ctx.beginPath(); ctx.arc(0, 0, 150, 0, TAU); }, N.paper, { sh: 16 });
    const u = prog(t, c.fb2 + .3, 3.6), a0 = (15.83 % 12) / 12 * TAU - Math.PI / 2, a1 = a0 + (5.5 / 12) * TAU * u;
    ctx.strokeStyle = N.red; ctx.lineWidth = 26; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.arc(0, 0, 112, a0, a1); ctx.stroke();
    ctx.strokeStyle = N.ink; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a1) * 90, Math.sin(a1) * 90); ctx.stroke(); ctx.fillStyle = N.ink; ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill(); ctx.restore();
    tag('PLUS DE 5 HEURES', 780, 540, 50, { bg: N.red, fg: '#fff', rot: .03, scale: k });
  }
  if (t >= c.fbcause) { tag('UN MAUVAIS RÉGLAGE', 540, 1020, 64, { bg: N.amber, fg: N.ink, rot: -.03, scale: pop(t, c.fbcause, .3) }); tag('PAS UNE ATTAQUE', 540, 1140, 56, { bg: N.paper, fg: N.ink, rot: .02, scale: pop(t, c.fbcause + .9, .3) }); }
}

/* =========================================================================================
   D : Visa, 2018 : pas Internet, mais le réseau de paiement
   ========================================================================================= */
function sceneD(t) {
  const c = TIMING.cues; nightBg(t);
  const e = E.out(prog(t, c.visa, .6));
  card(lerp(1500, 540, e), 640, 1.35, -.07 + Math.sin(t * 2) * .01, '#3b6cff');
  const st = pop(t, c.visa + 1.0, .3); if (st > 0) { ctx.save(); ctx.translate(560, 700); ctx.rotate(-.18); ctx.scale(st, st); ctx.strokeStyle = N.red; ctx.lineWidth = 18; rrect(-190, -62, 380, 124, 20); ctx.stroke(); ctx.fillStyle = N.red; font(96); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('REFUSÉ', 0, 6); ctx.restore(); }
  if (t > c.visa + .6) tag('PAS INTERNET : LE RÉSEAU VISA', 540, 975, 46, { bg: N.paper, fg: N.ink, rot: .02, scale: pop(t, c.visa + .6, .3) });
  if (t >= c.visa2) { const u = E.out(prog(t, c.visa2 + .2, 2.6)); extruded(fmt(5.2 * u, 1) + ' M', 540, 1085, 160, N.white, N.red, { depth: 14, rot: -.02, scale: Math.max(.01, pop(t, c.visa2, .3)) });
    tag('PAIEMENTS ÉCHOUÉS', 540, 1195, 50, { bg: N.red, fg: '#fff', rot: .03, scale: pop(t, c.visa2 + .3, .3) });
    tag('≈ 10 HEURES', 810, 420, 56, { bg: N.amber, fg: N.ink, rot: .06, scale: pop(t, c.visa2 + .1, .3) }); }
}

/* =========================================================================================
   E : CrowdStrike, juillet 2024 : des vols annulés
   ========================================================================================= */
function sceneE(t) {
  const c = TIMING.cues; nightBg(t);
  const e = E.out(prog(t, c.crowd, .6)); board(540, lerp(-200, 640, e), t, c.crowd + .9, ['PARIS', 'LONDRES', 'MADRID', 'ROME', 'BERLIN', 'LISBONNE']);
  if (t > c.crowd + .3) tag('JUILLET 2024', 540, 1000, 48, { bg: N.paper, fg: N.ink, rot: -.03, scale: pop(t, c.crowd + .3, .3) });
  if (t >= c.crowd1 && t < c.crowd2) { const k = pop(t, c.crowd1, .35); tag('TRAFIC AÉRIEN BOULEVERSÉ', 540, 1125, 56, { bg: N.amber, fg: N.ink, rot: -.02, scale: k }); }
  if (t >= c.crowd + 1.4 && t < c.crowd1) { const k = pop(t, c.crowd + 1.4, .35); extruded('8,5 M', 540, 1125, 130, N.white, N.cyanDk, { depth: 12, scale: k, rot: .01 }); tag("D'ORDINATEURS PLANTÉS", 540, 1215, 44, { bg: N.cyan, fg: N.ink, rot: -.02, scale: k }); }
  if (t >= c.crowd2) { const k = pop(t, c.crowd2, .35); extruded('DES MILLIERS', 540, 1125, 106, N.white, N.red, { depth: 12, scale: k, rot: -.01 }); tag('DE VOLS ANNULÉS', 540, 1215, 50, { bg: N.red, fg: '#fff', rot: .02, scale: k }); }
}

/* =========================================================================================
   F : la révélation, 296 coupures volontaires en 2024
   ========================================================================================= */
function sceneF(t) {
  const c = TIMING.cues; nightBg(t);
  const e = E.out(prog(t, c.coupures, .6)), off = prog(t, c.ak + .4, c.six + 2.2 - c.ak - .4);
  ctx.save(); ctx.translate(540, 700); ctx.scale(e, e); ctx.translate(-540, -700); ctx.save(); ctx.beginPath(); ctx.arc(540, 700, 458, 0, TAU); ctx.clip(); nightDraw(540, 700, 960, E.io(off)); ctx.restore(); ctx.restore();
  if (t >= c.ak) { const u = E.out(prog(t, c.ak, 3.0)), k = Math.max(.01, pop(t, c.ak, .3)); extruded(String(Math.round(296 * u)), 540, 1130, 180, N.white, N.red, { depth: 14, rot: -.02, scale: k });
    if (t > c.ak + 1.0) tag('COUPURES EN 2024', 540, 1235, 48, { bg: N.red, fg: '#fff', rot: .03, scale: pop(t, c.ak + 1.0, .3) }); }
  if (t >= c.ak + 3.2 && t < c.six) tag('DANS 54 PAYS', 540, 330, 66, { bg: N.amber, fg: N.ink, rot: -.03, scale: pop(t, c.ak + 3.2, .3) });
  if (t >= c.six) { tag(['≈ 6 PAR SEMAINE'], 540, 330, 74, { bg: N.cyan, fg: N.ink, rot: .03, scale: pop(t, c.six, .35) }); }
}

/* =========================================================================================
   G : retour à toi : tout s'éteint avec le wifi
   ========================================================================================= */
function sceneG(t) {
  const c = TIMING.cues; nightBg(t);
  const e = E.out(prog(t, c.fin, .6)), lose = prog(t, c.fin3 - .2, 2.8);
  phone(540, 760, 460, 760, { rot: Math.sin(t * 1.2) * .01 }); wifi(540, 850, 1.6, lose < .3 ? 3 : lose < .55 ? 2 : lose < .8 ? 1 : 0, N.cyan);
  const ics = [['bank', 190, 360], ['plane', 540, 300], ['chat', 890, 360], ['card', 150, 1010], ['cart', 540, 1130], ['cross', 930, 1010]];
  ics.forEach(([k, x, y], i) => { const on = lose < (i + 1) / 7.5; const pp = pop(t, c.fin + .2 + i * .12, .3); icon(k, x, y, 1.0 * Math.max(.01, pp), on ? N.cyan : '#344260', 1); });
  if (t >= c.fin2) tag('ON NE LE VOIT QUE QUAND ÇA S\'ARRÊTE', 540, 1195, 38, { bg: N.paper, fg: N.ink, rot: -.02, scale: pop(t, c.fin2, .3) });
}

/* ---------- orchestration ---------- */
function plan() {
  const c = TIMING.cues;
  return [{ t: 0, f: sceneA }, { t: c.surprise - .1, f: sceneB, wipe: 1 }, { t: c.fb - .1, f: sceneC, wipe: 1 }, { t: c.visa - .1, f: sceneD, wipe: 1 }, { t: c.crowd - .1, f: sceneE, wipe: 1 }, { t: c.coupures - .1, f: sceneF, wipe: 1 }, { t: c.fin - .1, f: sceneG, wipe: 1 }];
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
  nightBg(0); phone(540, 1010, 520, 840, { rot: -.02 }); wifi(540, 1120, 1.8, 0, N.cyan);
  ctx.save(); ctx.strokeStyle = N.red; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(420, 900); ctx.lineTo(660, 1140); ctx.moveTo(660, 900); ctx.lineTo(420, 1140); ctx.stroke(); ctx.restore();
  extruded('ET SI INTERNET', 540, 420, 100, N.white, N.cyanDk, { depth: 10, rot: -.012 }); extruded('DISPARAISSAIT', 540, 550, 118, N.cyan, '#0a5a78', { depth: 11, rot: .01 }); extruded('24 HEURES ?', 540, 690, 130, N.white, N.red, { depth: 12, rot: -.01 });
  tag('DE VRAIES PANNES', 540, 1400, 56, { bg: N.amber, fg: N.ink, rot: -.03, sh: 12 });
  grain();
}
