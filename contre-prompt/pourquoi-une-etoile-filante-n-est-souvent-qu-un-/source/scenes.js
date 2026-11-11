/* « Pourquoi une étoile filante n'est (souvent) qu'un grain de sable ? » : papier découpé + images réelles (NASA, ISS, gravure de 1833), calé sur la voix off. */
'use strict';
const NS = { top: '#060d24', bot: '#1c2f60', hot: '#ffc247', fire: '#ff6a4d', white: '#fffdf5', pea: '#7cc46a', pea2: '#b4e39d', pebble: '#8d8a86', pebble2: '#b3afa8' };
function camera(s, z0, z1, cx = W / 2, cy = 900, dx = 0, dy = 0) { const z = lerp(z0, z1, clamp(s)); ctx.translate(cx + dx * s, cy + dy * s); ctx.scale(z, z); ctx.translate(-cx, -cy); }

/* ---------- décor ---------- */
function nightBg(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, NS.top); g.addColorStop(1, NS.bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 120; i++) {
    const x = R(i * 3 + 1) * W, y = R(i * 3 + 2) * H, r = 1.6 + R(i * 3 + 3) * 3.2, a = .35 + .65 * (.5 + .5 * Math.sin(t * 2.2 + i * 1.7));
    ctx.globalAlpha = a; ctx.fillStyle = NS.white; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function glow(x, y, r, col, a = 1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,160,60,0)'); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); }
function streak(x0, y0, x1, y1, p, tail, w = 14, a = 1) {
  if (p <= 0) return; const hx = lerp(x0, x1, p), hy = lerp(y0, y1, p), dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, tl = Math.min(tail, p * L);
  const g = ctx.createLinearGradient(hx - ux * tl, hy - uy * tl, hx, hy); g.addColorStop(0, 'rgba(255,194,71,0)'); g.addColorStop(1, 'rgba(255,230,160,1)');
  ctx.save(); ctx.globalAlpha *= a; glow(hx, hy, w * 5, 'rgba(255,200,110,.9)'); ctx.lineCap = 'round'; ctx.strokeStyle = g; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(hx - ux * tl, hy - uy * tl); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.fillStyle = NS.white; ctx.beginPath(); ctx.arc(hx, hy, w * .75, 0, TAU); ctx.fill(); ctx.restore();
}
function earth(topY, t) {            // Terre vue de côté : grande boule bleue avec une fine couche d'air
  const cy = topY + 1000, r = 1000;
  ctx.save(); ctx.strokeStyle = 'rgba(95,184,255,.28)'; ctx.lineWidth = 120; ctx.beginPath(); ctx.arc(540, cy, r + 60, 0, TAU); ctx.stroke();
  ctx.strokeStyle = 'rgba(140,210,255,.5)'; ctx.lineWidth = 46; ctx.beginPath(); ctx.arc(540, cy, r + 22, 0, TAU); ctx.stroke(); ctx.restore();
  paper(() => { ctx.beginPath(); ctx.arc(540, cy, r, 0, TAU); }, '#14518f', { sh: 0, edgec: 'rgba(255,255,255,.25)' });
  for (let i = 0; i < 9; i++) { const x = 120 + i * 105 + Math.sin(t * .4 + i) * 12, y = topY + 90 + (i % 3) * 120 + R(i) * 50; ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(x, y, 90, 24, 0, 0, TAU); ctx.fill(); }
}
function pea(x, y, r, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  paper(() => { ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); }, NS.pea, { sh: 14 });
  ctx.fillStyle = NS.pea2; ctx.beginPath(); ctx.ellipse(-r * .3, -r * .35, r * .32, r * .2, -.6, 0, TAU); ctx.fill(); ctx.restore();
}
function pebble(x, y, r, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); const p = wobblePoly(0, 0, [[-r, 0], [-r * .6, -r * .8], [r * .3, -r * .9], [r, -r * .1], [r * .7, r * .7], [-r * .3, r * .85]], 4, 7);
  paper(() => smoothClosed(p), NS.pebble, { sh: 12 }); ctx.fillStyle = NS.pebble2; ctx.beginPath(); ctx.ellipse(-r * .25, -r * .3, r * .3, r * .16, -.5, 0, TAU); ctx.fill(); ctx.restore();
}
function shell(x, y, s, sc = 1) {      // obus : forme d'ogive en papier
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  paper(() => { ctx.beginPath(); ctx.moveTo(-45, 130); ctx.lineTo(-45, 0); ctx.quadraticCurveTo(-45, -95, 0, -150); ctx.quadraticCurveTo(45, -95, 45, 0); ctx.lineTo(45, 130); ctx.closePath(); }, '#7b8a5a', { sh: 12 });
  ctx.fillStyle = '#c98a3c'; ctx.fillRect(-45, 82, 90, 26); ctx.fillStyle = '#a8703a'; ctx.fillRect(-45, 112, 90, 14); ctx.restore();
}
function ring(x, y, r, t) { ctx.save(); ctx.strokeStyle = NS.fire; ctx.lineWidth = 8; const k = 1 + .15 * Math.sin(t * 8); ctx.beginPath(); ctx.arc(x, y, r * k, 0, TAU); ctx.stroke(); ctx.restore(); }

/* ---------- scènes ---------- */
function sceneA(t) {            // accroche : le ciel, une vraie trace, « ce n'était pas une étoile »
  const c = TIMING.cues; nightBg(t);
  photoCard(IMG.p1, 540, 770, 900, 640, -.02 + Math.sin(t * 1.2) * .004, { seed: 5, scale: 1 + .03 * Math.min(1, t / 3) });
  streak(120, 480, 960, 980, E.out(prog(t, .6, .9)), 520, 18, 1 - prog(t, 1.6, .6));
  tag('ÉTOILE FILANTE ?', 540, 330, 92, { bg: NS.white, fg: BRAND.ink, rot: -.025, scale: pop(t, .3, .3) });
  tag('PAS UNE ÉTOILE !', 540, 1170, 80, { bg: BRAND.accent, fg: '#fff', rot: .02, scale: pop(t, c.h1 + 2.9, .3) });
}
function sceneB(t) {            // caillou plus petit qu'un petit pois
  const c = TIMING.cues; nightBg(t);
  tag(['SOUVENT PLUS PETIT', 'QU\'UN PETIT POIS'], 540, 380, 70, { bg: BRAND.accent2, fg: BRAND.ink, rot: -.02, scale: pop(t, c.h2 + .1, .3) });
  pebble(770, 820, 62, pop(t, c.h2 + .3, .3)); tag('UN CAILLOU', 770, 1010, 52, { rot: .02, scale: pop(t, c.h2 + .7, .3) });
  pea(380, 800, 170, pop(t, c.h2 + 1.5, .35)); tag('UN PETIT POIS', 380, 1070, 52, { rot: -.02, scale: pop(t, c.h2 + 1.9, .3) });
}
function sceneC(t) {            // comète et miettes
  const c = TIMING.cues; nightBg(t); const p = E.io(prog(t, c.comete - .1, 4.6)), x0 = 930, y0 = 520, x1 = 330, y1 = 860, hx = lerp(x0, x1, p), hy = lerp(y0, y1, p);
  for (let i = 0; i < 36; i++) { const u = (i / 36) * p; if (u > p - .02) continue; const rx = (R(i + 20) - .5) * 70, ry = (R(i + 50) - .5) * 70 + (t - c.comete) * 14 * R(i + 80);
    ctx.fillStyle = i % 2 ? NS.hot : '#e4cf9f'; ctx.beginPath(); ctx.arc(lerp(x0, x1, u) + rx + 40, lerp(y0, y1, u) + ry - 20, 5 + R(i + 5) * 9, 0, TAU); ctx.fill(); }
  glow(hx, hy, 180, 'rgba(160,220,255,.75)'); paper(() => { ctx.beginPath(); ctx.arc(hx, hy, 62, 0, TAU); }, '#dff3ff', { sh: 10 });
  ctx.fillStyle = 'rgba(190,230,255,.35)'; ctx.beginPath(); ctx.moveTo(hx, hy - 45); ctx.lineTo(hx + 560, hy - 250); ctx.lineTo(hx + 560, hy - 40); ctx.lineTo(hx, hy + 45); ctx.closePath(); ctx.fill();
  tag('UNE COMÈTE', 540, 330, 84, { bg: NS.white, fg: BRAND.ink, rot: -.02, scale: pop(t, c.comete + .1, .3) });
  tag(['ELLE LAISSE', 'DES MIETTES'], 540, 1130, 64, { bg: BRAND.accent2, fg: BRAND.ink, rot: .02, scale: pop(t, c.comete + 2.6, .3) });
}
function sceneD1(t) {           // la Terre traverse les miettes : gravure de 1833
  const c = TIMING.cues; nightBg(t);
  photoCard(IMG.leo, 540, 850, 600, 800, -.02 + Math.sin(t * 1.2) * .004, { seed: 4, scale: 1 + .03 * prog(t, c.entree, 4), fy: .15 });
  tag(['LA TERRE TRAVERSE', 'LES MIETTES'], 540, 330, 66, { bg: NS.white, fg: BRAND.ink, rot: -.02, scale: pop(t, c.entree + .1, .3) });
  tag('GRAVURE DE 1833', 800, 560, 50, { bg: BRAND.accent, fg: '#fff', rot: .05, scale: pop(t, c.entree + 1.6, .3) });
}
function sceneD2(t) {           // un grain fonce vers l'air
  const c = TIMING.cues; nightBg(t); earth(1230, t);
  const p = E.in(prog(t, c.fonce, c.relance - c.fonce - .4));
  streak(990, 380, 520, 1215, p, 520, 22);
  tag(['JUSQU\'À', '72 KM/S'], 360, 340, 82, { bg: BRAND.accent, fg: '#fff', rot: -.03, scale: pop(t, c.fonce + .9, .3) });
  if (p >= 1) glow(520, 1215, 140 * (1 + .2 * Math.sin(t * 10)), 'rgba(255,230,160,.9)');
}
function sceneE(t) {            // relance : comment un si petit grain brille-t-il autant ?
  const c = TIMING.cues; nightBg(t);
  photoCard(IMG.p2, 540, 780, 880, 640, .02, { seed: 7, zoom: 2.2, fx: .62, fy: .59, scale: 1 + .03 * prog(t, c.relance, 3.7) });
  tag(['UN SI PETIT GRAIN...'], 540, 340, 66, { bg: NS.white, fg: BRAND.ink, rot: -.02, scale: pop(t, c.relance + .1, .3) });
  tag('BRILLER AUTANT ?', 540, 1170, 80, { bg: BRAND.accent, fg: '#fff', rot: .02, scale: pop(t, c.relance + 1.9, .3) });
}
function sceneF(t) {            // l'air autour du grain devient brûlant
  const c = TIMING.cues; nightBg(t); earth(1240, t);
  const p = E.io(prog(t, c.chauffe, c.cta1 - c.chauffe)), gx = lerp(780, 600, p), gy = lerp(480, 990, p), a = -2.0;
  glow(gx, gy, 140 + 260 * p, 'rgba(255,150,60,.85)'); glow(gx, gy, 70 + 110 * p, 'rgba(255,240,190,.95)');
  ctx.save(); ctx.translate(gx, gy); ctx.rotate(Math.atan2(510, -180) - Math.PI / 2 + Math.PI); ctx.strokeStyle = 'rgba(170,225,255,.85)'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, 0, 120 + i * 48, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } ctx.restore();
  paper(() => { ctx.beginPath(); ctx.arc(gx, gy, 28, 0, TAU); }, '#e4cf9f', { sh: 4 });
  tag(['L\'AIR AUTOUR', 'DEVIENT BRÛLANT'], 540, 340, 70, { bg: BRAND.accent, fg: '#fff', rot: -.02, scale: pop(t, c.chauffe + .2, .3) });
  const ay = 1000; ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 5; ctx.setLineDash([22, 16]); ctx.beginPath(); ctx.moveTo(80, ay + 90); ctx.lineTo(1000, ay + 90); ctx.stroke(); ctx.restore();
  tag('PLUS DE 80 KM D\'ALTITUDE', 540, 1180, 62, { bg: NS.white, fg: BRAND.ink, rot: .015, scale: pop(t, c.chauffe + 3.4, .3) });
}
function sceneG(t) {            // le grain se vaporise : étincelles
  const c = TIMING.cues; nightBg(t); const s = t - c.cta1; const cx = 560, cy = 760;
  glow(cx, cy, 260 * (.6 + .4 * Math.min(1, s / 1.5)), 'rgba(255,170,70,.7)');
  for (let i = 0; i < 34; i++) { const ang = R(i + 3) * TAU, sp = 160 + R(i + 9) * 380, d = Math.min(s, 3.2) * sp * .5 + 20, x = cx + Math.cos(ang) * d, y = cy + Math.sin(ang) * d * .8, r = Math.max(2, (4 + R(i + 1) * 9) * (1 - prog(s, 0, 4.5) * .6));
    ctx.fillStyle = i % 3 ? NS.hot : NS.fire; ctx.globalAlpha = 1 - prog(s, 2.6, 2.4) * .8; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = 1; paper(() => { ctx.beginPath(); ctx.arc(cx, cy, Math.max(0, 26 * (1 - prog(s, 0, 1.6))), 0, TAU); }, '#e4cf9f', { sh: 0 });
  tag('IL SE VAPORISE', 540, 340, 84, { bg: NS.white, fg: BRAND.ink, rot: -.02, scale: pop(t, c.cta1 + .1, .3) });
  ctaSubscribe(t, c.cta1 + .1, 1120);
}
function sceneH(t) {            // la révélation : ce qui brille, c'est l'air chauffé
  const c = TIMING.cues; nightBg(t); const cx = 540, cy = 790, g = pop(t, c.reveal + 1.9, .5);
  tag(['CE N\'EST PAS LE GRAIN', 'QUI BRILLE'], 540, 340, 66, { bg: BRAND.accent, fg: '#fff', rot: -.02, scale: pop(t, c.reveal + .1, .3) });
  glow(cx, cy, 380 * g * (1 + .05 * Math.sin(t * 9)), 'rgba(255,200,120,.95)'); glow(cx, cy, 170 * g, 'rgba(255,250,225,1)');
  paper(() => { ctx.beginPath(); ctx.arc(cx, cy, 14, 0, TAU); }, '#e4cf9f', { sh: 3 });
  tag('LE GRAIN : MINUSCULE', 540, 1080, 52, { bg: NS.white, fg: BRAND.ink, rot: .02, scale: pop(t, c.reveal + .8, .3) });
  tag('L\'AIR CHAUD : ÇA BRILLE', 540, 1190, 52, { bg: BRAND.accent2, fg: BRAND.ink, rot: -.02, scale: pop(t, c.reveal + 2.4, .3) });
}
function sceneI(t) {            // l'énergie : un petit pois ≈ un obus
  const c = TIMING.cues; nightBg(t);
  tag('AUTANT D\'ÉNERGIE', 540, 380, 84, { bg: BRAND.accent2, fg: BRAND.ink, rot: -.02, scale: pop(t, c.energie + .1, .3) });
  pea(270, 800, 100, pop(t, c.energie + .4, .35)); tag(['UN GRAIN', 'DE LA TAILLE', 'D\'UN POIS'], 270, 1010, 50, { rot: -.02, scale: pop(t, c.energie + .9, .3) });
  extruded('=', 540, 800, 190, BRAND.accent2, BRAND.accent, { depth: 12, rot: .01 });
  shell(810, 800, 1.7, pop(t, c.energie + 2.0, .35)); tag(['UN OBUS', 'D\'ARTILLERIE'], 810, 1075, 50, { rot: .02, scale: pop(t, c.energie + 2.5, .3) });
}
function sceneJ(t) {            // quelques secondes : la vraie photo depuis l'orbite
  const c = TIMING.cues; nightBg(t); const w = 900, h = 640, u = .749, v = .522;
  photoCard(IMG.iss, 540, 780, w, h, -.015, { seed: 6, zoom: 1.0, fx: .5, fy: .5, scale: 1 + .03 * prog(t, c.fin, 5.5), draw: () => { ring(-w / 2 + u * w, -h / 2 + v * h, 50, t); } });
  tag('QUELQUES SECONDES', 540, 340, 82, { bg: NS.white, fg: BRAND.ink, rot: -.02, scale: pop(t, c.fin + .1, .3) });
  tag('VU DEPUIS L\'ORBITE', 540, 1190, 58, { bg: BRAND.accent, fg: '#fff', rot: .02, scale: pop(t, c.fin + 1.6, .3) });
}
function sceneK(t) {            // boucle : on revient au ciel du début
  const c = TIMING.cues; nightBg(t);
  photoCard(IMG.p1, 540, 770, 900, 640, .02 + Math.sin(t * 1.2) * .004, { seed: 5, scale: 1.02 });
  const k = prog(t, c.boucle + 1.2, 2.2); streak(120, 480, 960, 980, 1, 520, 18 * (1 - k), 1 - k);
  tag(['UN PETIT GRAIN', 'QUI S\'ÉTEINT'], 540, 340, 76, { bg: NS.white, fg: BRAND.ink, rot: -.02, scale: pop(t, c.boucle + .1, .3) });
}
function sceneK2(t) { sceneK(t); const c = TIMING.cues; ctaComment(t, c.cta2, 690, 560); }

/* ---------- orchestration ---------- */
function plan() {
  const c = TIMING.cues;
  return [{ t: 0, f: sceneA }, { t: c.h2 - .1, f: sceneB, wipe: 1 }, { t: c.comete - .1, f: sceneC, wipe: 1 }, { t: c.entree - .1, f: sceneD1, wipe: 1 }, { t: c.fonce - .1, f: sceneD2, wipe: 1 },
    { t: c.relance - .1, f: sceneE, wipe: 1 }, { t: c.chauffe - .1, f: sceneF, wipe: 1 }, { t: c.cta1 - .1, f: sceneG, wipe: 1 }, { t: c.reveal - .1, f: sceneH, wipe: 1 },
    { t: c.energie - .1, f: sceneI, wipe: 1 }, { t: c.fin - .1, f: sceneJ, wipe: 1 }, { t: c.boucle - .1, f: sceneK, wipe: 1 }, { t: c.cta2 - .1, f: sceneK2 }];
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
  coverTemplate({ kicker: 'ÉTOILE FILANTE', word: 'UN GRAIN ?', wordSize: 160, kickerSize: 96, tagText: 'SOUVENT PLUS PETIT QU\'UN POIS',
    bg: () => nightBg(.4), illustration: () => { photoCard(IMG.p1, 540, 1180, 800, 600, -.03, { seed: 5 }); streak(150, 980, 900, 1280, 1, 480, 18); } });
}
