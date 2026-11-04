/* « Pourquoi les flamants sont roses ? » : scènes en papier découpé, calées sur les repères de la voix off (TIMING.cues). */
'use strict';
const cue = n => TIMING.cues[n];
const Q = { pink: '#ff7f9f', pinkDeep: '#f2527d', pale: '#fff3ee', gray: '#bcbfc8', grayDk: '#8e929e', teal: '#2aa7a1', tealDeep: '#0f6a70', tealLt: '#7fd6cf', sand: '#f6dcc2', peach: '#ffe3d1', milk: '#e1252f', carrot: '#ff8a2b', algae: '#5fbf6a', shrimp: '#ff9150', ink: '#0b2540', sun: '#ffc247', cream: '#fffaf2' };
const hex = c => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mixc = (a, b, t) => { const A = hex(a), B = hex(b); t = clamp(t); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',') + ')'; };
function camera(s, z0, z1, cx = W / 2, cy = 900, dx = 0, dy = 0) { const z = lerp(z0, z1, clamp(s)); ctx.translate(cx + dx * s, cy + dy * s); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function fillBg(c) { ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); }
function gradBg(c0, c1) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function polyPath(pts) { return () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }; }

/* ---------- dessins : flamant, poussin, algues, crevette, carotte ---------- */
// Le flamant est dessiné autour du centre du corps ; 1 unité = 1 px à l'échelle 1 (hauteur totale ≈ 700).
function flamingo(x, y, s, o = {}) {
  const body = o.body || Q.pink, leg = o.leg || Q.pinkDeep, beak = o.beak || '#ffd9de', flip = o.flip ? -1 : 1, sway = Math.sin(T * 1.6 + (o.ph || 0)) * 0.012;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s); ctx.rotate(sway);
  const stroke = (pts, w, col, shift = 0) => { ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.translate(shift * .4, shift); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i += 3) ctx.bezierCurveTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], pts[i + 2][0], pts[i + 2][1]); ctx.stroke(); ctx.restore(); };
  // pattes
  const legA = [[-18, 60], [-14, 130], [-24, 210], [-18, 300]], legB = [[22, 60], [30, 120], [58, 190], [36, 300]];
  for (const L of [legB, legA]) { stroke(L, 15, 'rgba(6,18,36,.25)', 8); stroke(L, 13, leg); ctx.fillStyle = leg; ctx.beginPath(); ctx.ellipse(L[3][0] + 14, 304, 34, 8, 0, 0, TAU); ctx.fill(); }
  // cou en S (derrière le corps)
  const neck = [[96, -30], [190, -110], [10, -190], [78, -290], [100, -330], [130, -345], [138, -388]];
  stroke(neck, 44, 'rgba(6,18,36,.22)', 9); stroke(neck, 40, body);
  // corps
  const bodyPath = () => { ctx.beginPath(); ctx.moveTo(-165, 14); ctx.quadraticCurveTo(-95, -84, 20, -74); ctx.quadraticCurveTo(140, -70, 138, 8); ctx.quadraticCurveTo(120, 92, 10, 96); ctx.quadraticCurveTo(-85, 96, -165, 14); ctx.closePath(); };
  paper(bodyPath, body, { sh: 10, edgec: 'rgba(255,255,255,.35)' });
  // aile et rémiges noires
  ctx.save(); bodyPath(); ctx.clip();
  ctx.fillStyle = mixc(body, '#ffffff', .22); ctx.beginPath(); ctx.moveTo(-120, 4); ctx.quadraticCurveTo(-40, -52, 70, -26); ctx.quadraticCurveTo(100, 20, 20, 54); ctx.quadraticCurveTo(-60, 62, -120, 4); ctx.fill();
  ctx.fillStyle = '#2b2630'; ctx.beginPath(); ctx.moveTo(-150, 20); ctx.lineTo(-30, 56); ctx.lineTo(40, 52); ctx.lineTo(10, 96); ctx.lineTo(-120, 96); ctx.closePath(); ctx.fill();
  ctx.restore();
  // tête et bec
  paper(() => { ctx.beginPath(); ctx.arc(138, -396, 31, 0, TAU); }, body, { sh: 6 });
  const beakPath = () => { ctx.beginPath(); ctx.moveTo(158, -414); ctx.quadraticCurveTo(232, -412, 240, -352); ctx.lineTo(210, -366); ctx.quadraticCurveTo(190, -388, 160, -380); ctx.closePath(); };
  paper(beakPath, beak, { sh: 5 }); ctx.save(); beakPath(); ctx.clip(); ctx.fillStyle = '#2b2630'; ctx.beginPath(); ctx.moveTo(212, -420); ctx.lineTo(250, -420); ctx.lineTo(250, -340); ctx.lineTo(212, -350); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.fillStyle = Q.cream; ctx.beginPath(); ctx.arc(150, -402, 7.5, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(152, -402, 3.6, 0, TAU); ctx.fill();
  ctx.restore();
}
function chick(x, y, s, o = {}) {
  const col = o.col || Q.gray, dk = mixc(col, '#000000', .1), flip = o.flip ? -1 : 1, bob = Math.sin(T * 5 + (o.ph || 0)) * 3;
  ctx.save(); ctx.translate(x, y + bob); ctx.scale(s * flip, s);
  for (const dx of [-24, 26]) { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = o.leg || '#d7b3ba'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(dx, 70); ctx.lineTo(dx + 4, 175); ctx.stroke(); ctx.fillStyle = o.leg || '#d7b3ba'; ctx.beginPath(); ctx.ellipse(dx + 16, 178, 28, 8, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  const fluff = (cx, cy, r, n, seed) => () => { ctx.beginPath(); for (let i = 0; i < n; i++) { const a = i / n * TAU, rr = r + 6 * Math.sin(i * 3 + seed); ctx.moveTo(cx + Math.cos(a) * (r - 6) + rr * .34, cy + Math.sin(a) * (r - 6)); ctx.arc(cx + Math.cos(a) * (r - 6), cy + Math.sin(a) * (r - 6), rr * .34, 0, TAU); } ctx.moveTo(cx + r - 6, cy); ctx.arc(cx, cy, r - 6, 0, TAU); };
  paper(fluff(0, 0, 100, 16, 1), col, { sh: 9, edge: false });
  paper(fluff(78, -98, 56, 12, 4), col, { sh: 7, edge: false });
  ctx.fillStyle = dk; ctx.globalAlpha = .25; ctx.beginPath(); ctx.ellipse(-20, 20, 62, 44, .4, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
  paper(() => { ctx.beginPath(); ctx.moveTo(122, -108); ctx.lineTo(172, -96); ctx.lineTo(122, -80); ctx.closePath(); }, o.beak || '#f3c2c8', { sh: 4 });
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(94, -108, 8, 0, TAU); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(96, -108, 4, 0, TAU); ctx.fill();
  ctx.restore();
}
function algae(x, y, s, a = 1) { ctx.save(); ctx.globalAlpha *= a; for (let i = 0; i < 9; i++) { const ang = i / 9 * TAU + 1, r = 18 + (i % 3) * 14; paper(() => { ctx.beginPath(); ctx.arc(x + Math.cos(ang) * r * s, y + Math.sin(ang) * r * s, (13 + (i % 4) * 3) * s, 0, TAU); }, mixc(Q.algae, '#2f8f4a', (i % 3) / 3), { sh: 4, edge: false }); } ctx.restore(); }
function shrimp(x, y, s, rot = 0, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  for (const [col, w, off] of [['rgba(6,18,36,.25)', 34, 6], [Q.shrimp, 30, 0]]) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(off * .5, off, 60, -2.4, 1.2); ctx.stroke(); }
  ctx.strokeStyle = Q.shrimp; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(52, 35); ctx.lineTo(80, 62); ctx.moveTo(52, 35); ctx.lineTo(86, 44); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-46, -34, 5, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#ffc7a0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-52, -44); ctx.quadraticCurveTo(-90, -80, -120, -60); ctx.stroke(); ctx.restore();
}
function carrot(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (const a of [-.5, 0, .5]) { ctx.save(); ctx.rotate(a); paper(() => { ctx.beginPath(); ctx.ellipse(0, -150, 14, 46, 0, 0, TAU); }, Q.algae, { sh: 4, edge: false }); ctx.restore(); }
  paper(() => { ctx.beginPath(); ctx.moveTo(-42, -110); ctx.quadraticCurveTo(0, -130, 42, -110); ctx.quadraticCurveTo(26, 40, 0, 170); ctx.quadraticCurveTo(-26, 40, -42, -110); ctx.closePath(); }, Q.carrot, { sh: 9 });
  ctx.strokeStyle = 'rgba(160,70,0,.4)'; ctx.lineWidth = 4; for (const yy of [-70, -20, 30, 80]) { ctx.beginPath(); ctx.moveTo(-18 + yy * .05, yy); ctx.lineTo(14 - yy * .05, yy + 6); ctx.stroke(); } ctx.restore();
}
function magnifier(x, y, r, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(6,18,36,.3)'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(x + r * .72 + 5, y + r * .72 + 9); ctx.lineTo(x + r * 1.5 + 5, y + r * 1.5 + 9); ctx.stroke(); ctx.strokeStyle = '#3a4756'; ctx.beginPath(); ctx.moveTo(x + r * .72, y + r * .72); ctx.lineTo(x + r * 1.5, y + r * 1.5); ctx.stroke(); ctx.lineWidth = 16; ctx.strokeStyle = '#3a4756'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore(); }
function milkDrop(x, y, s = 1, a = 1) { ctx.save(); ctx.globalAlpha *= a; paper(() => dropPath(x, y, 34 * s, 48 * s), Q.milk, { sh: 4, edgec: 'rgba(255,255,255,.5)' }); ctx.restore(); }
function lagoon(t, top, cols = [Q.tealLt, Q.teal, Q.tealDeep]) { const ph = t * 1.1; waveBand(top, 14, 520, ph, cols[0], { seed: 61 }); waveBand(top + 70, 16, 420, -ph * 1.2 + 1, cols[1], { seed: 62 }); waveBand(top + 170, 18, 560, ph * .9 + 3, cols[2], { seed: 63 }); waveBand(top + 330, 18, 640, -ph, mixc(cols[2], '#000000', .25), { seed: 64 }); }
function sunset(t) { gradBg('#ffe8d6', '#ffb9a5'); paper(() => { ctx.beginPath(); ctx.arc(820, 520, 150, 0, TAU); }, '#ffd17a', { sh: 0, edge: false }); }
const qmark = (cx, cy, s, col, t, k) => {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.sin((t - k) * 7) * .05); ctx.scale(s, s);
  const q = () => { ctx.beginPath(); ctx.arc(0, -150, 130, Math.PI * 1.03, Math.PI * 2.42); ctx.quadraticCurveTo(20, 20, 0, 70); };
  ctx.lineCap = 'round'; ctx.lineWidth = 110; ctx.strokeStyle = 'rgba(6,18,36,.3)'; ctx.save(); ctx.translate(5, 13); q(); ctx.stroke(); ctx.restore();
  ctx.strokeStyle = col; q(); ctx.stroke(); ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.save(); ctx.translate(-20, -20); q(); ctx.stroke(); ctx.restore();
  paper(() => dropPath(0, 160 - Math.abs(Math.sin((t - k) * 4)) * 18, 90, 120), Q.pinkDeep, { sh: 8 }); ctx.restore();
};

/* =========================================================================================
   A : « Un flamant rose n'est pas né rose. »
   ========================================================================================= */
function sceneA(t) {
  const c = TIMING.cues;
  sunset(t); cloud(230 + t * 8, 300, 110, '#fff'); cloud(880 - t * 6, 220, 85, '#fff6f0');
  lagoon(t, 1210, [Q.tealLt, Q.teal, Q.tealDeep]);
  const swap = prog(t, c.h2 - .25, .45);
  // flamant adulte (vraie photo NASA) puis poussin gris
  if (swap < 1) { const out = E.in(swap); ctx.save(); ctx.globalAlpha = 1 - out; photoCard(IMG.flamant1, 540, 960, 780, 860, -.03 + jit(2, .004), { zoom: 1.5, fx: .44, fy: .58, scale: 1 - out * .25, seed: 4 }); ctx.restore(); }
  if (t > c.h1 + .55 && swap < 1) tag('PAS NÉ ROSE', 740, 1150, 66, { bg: P.salt, fg: Q.pinkDeep, rot: .05, scale: pop(t, c.h1 + .55, .3) * (1 - swap) });
  if (swap > 0) {
    const p = pop(t, c.h2 - .15, .4); ctx.save(); ctx.translate(540, 900); ctx.scale(Math.max(.01, p), Math.max(.01, p)); ctx.translate(-540, -900);
    chick(520, 860, 2.05, { col: Q.gray }); ctx.restore();
    if (t > c.h2 + .3) tag('DUVET GRIS CLAIR', 540, 1180, 62, { bg: P.salt, fg: Q.ink, rot: -.03, scale: pop(t, c.h2 + .3, .3) });
  }
  const tOut = prog(t, c.q - .25, .3);
  if (tOut < 1) { ctx.save(); ctx.translate(0, -tOut * 520); extruded('POURQUOI LES', 540, 330, 92, Q.ink, Q.pinkDeep, { depth: 8, rot: -.01 }); extruded('FLAMANTS SONT ROSES ?', 540, 440, 76, Q.ink, Q.pinkDeep, { depth: 7, rot: .01 }); ctx.restore(); }
  if (t >= c.q - .02) { const sc = Math.max(.01, pop(t, c.q, .4)); qmark(540, 640, sc * 1.3, Q.pinkDeep, t, c.q); }
}

/* =========================================================================================
   B : « Il vient de son assiette. » algues, crevettes, caroténoïdes
   ========================================================================================= */
function sceneB(t) {
  const c = TIMING.cues, t0 = c.assiette - .1;
  gradBg('#7fd6cf', '#2aa7a1'); ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(120 + i * 230 + Math.sin(t + i) * 14, 300 + (i % 2) * 150, 130, 0, TAU); ctx.fill(); } ctx.restore();
  // assiette
  const pl = pop(t, c.assiette, .4), tow = E.io(prog(t, c.tete - .1, .5));
  const px = 540, py = 760, ps = 1 - tow;
  if (pl > 0 && ps > .02) { ctx.save(); ctx.translate(px, py); ctx.scale(pl * ps, pl * ps); paper(() => { ctx.beginPath(); ctx.arc(0, 0, 330, 0, TAU); }, Q.cream, { sh: 16 }); paper(() => { ctx.beginPath(); ctx.arc(0, 0, 230, 0, TAU); }, '#f1e6d6', { sh: 0, edgec: 'rgba(0,0,0,.08)' });
    for (let i = 0; i < 7; i++) algae(Math.cos(i * 1.7) * 130, Math.sin(i * 2.1) * 110, .9); for (let i = 0; i < 4; i++) shrimp(Math.cos(i * 2.4 + 1) * 120, Math.sin(i * 1.9) * 95, .8, i); ctx.restore(); }
  if (t < c.tete - .2 && t > c.assiette + .2) tag('SON ASSIETTE', 540, 1180, 74, { bg: P.salt, fg: Q.ink, rot: -.03, scale: pop(t, c.assiette + .2, .3) });
  // la tête à l'envers : vraie photo
  const ph = E.out(prog(t, c.tete, .55));
  if (ph > 0 && t < c.carot) photoCard(IMG.flamant2, lerp(1400, 540, ph), 790, 800, 900, .025 + jit(3, .004), { zoom: 1.5, fx: .45, fy: .55, seed: 5 });
  if (t > c.tete + .4 && t < c.algues) tag(['LA TÊTE', "À L'ENVERS"], 560, 1290, 62, { bg: Q.sun, fg: Q.ink, rot: .03, scale: pop(t, c.tete + .4, .3) });
  // algues + crevettes
  if (t >= c.algues - .1) {
    const a1 = pop(t, c.algues, .35), a2 = pop(t, c.algues + 1.4, .35), hide = prog(t, c.carotte + 1.2, .3);
    ctx.save(); ctx.globalAlpha = 1 - hide;
    if (t < c.voyage + .2) {
      ctx.save(); ctx.translate(300, 760); ctx.scale(a1, a1); paper(() => { ctx.beginPath(); ctx.arc(0, 0, 220, 0, TAU); }, '#d9f4ef', { sh: 14 }); algae(0, 0, 3.1); magnifier(-110, -100, 150); ctx.restore();
      ctx.save(); ctx.translate(790, 760); ctx.scale(a2, a2); paper(() => { ctx.beginPath(); ctx.arc(0, 0, 200, 0, TAU); }, '#d9f4ef', { sh: 14 }); shrimp(-30, -6, 1.9, .2); shrimp(70, 50, 1.2, -.7); ctx.restore();
      if (t > c.algues + .3) tag(['ALGUES', 'MICROSCOPIQUES'], 300, 1060, 50, { bg: P.salt, fg: Q.ink, rot: -.04, scale: pop(t, c.algues + .3, .3) });
      if (t > c.algues + 1.7 && t < c.carotte) tag(['MINUSCULES', 'CREVETTES'], 790, 1030, 50, { bg: P.salt, fg: Q.ink, rot: .04, scale: pop(t, c.algues + 1.7, .3) });
    }
    ctx.restore();
  }
  // caroténoïdes : pigments orange qui sortent des algues
  if (t >= c.carot && t < c.voyage - .1) {
    for (let i = 0; i < 18; i++) { const tt = t - c.carot - i * .12; if (tt < 0) continue; const u = (tt % 2) / 2, a = R(i) * TAU, rr = u * (140 + R(i + 5) * 220); paper(() => { ctx.beginPath(); ctx.arc(300 + Math.cos(a) * rr * 1.2, 760 + Math.sin(a) * rr * .8 - u * 60, 12 + R(i + 9) * 9, 0, TAU); }, Q.carrot, { sh: 3, edge: false }); }
    tag('CAROTÉNOÏDES', 540, 340, 70, { bg: Q.carrot, fg: P.salt, rot: -.03, scale: pop(t, c.carot, .3) });
    if (t > c.carot + 1.8) tag('= PIGMENTS, MATIÈRES COLORÉES', 540, 440, 40, { bg: P.salt, fg: Q.ink, rot: .02, scale: pop(t, c.carot + 1.8, .3) });
  }
  // la carotte
  if (t >= c.carotte && t < c.voyage - .1) { const k = pop(t, c.carotte, .35); ctx.save(); ctx.translate(800, 800); ctx.scale(k, k); ctx.translate(-800, -800); paper(() => { ctx.beginPath(); ctx.arc(800, 800, 215, 0, TAU); }, '#fff0dc', { sh: 12 }); carrot(800, 790, 1.05, .3 + Math.sin(t * 3) * .04); ctx.restore(); tag('COMME LA CAROTTE', 790, 1060, 50, { bg: Q.sun, fg: Q.ink, rot: .04, scale: k }); }
  // le voyage de la couleur : algue → crevette → flamant
  if (t >= c.voyage - .1) {
    const k = prog(t, c.voyage - .1, .4), kk = E.out(k);
    const nodes = [[200, 820], [540, 820], [880, 820]]; paper(() => rrect(40, 560, 1000, 520, 40), 'rgba(255,255,255,.5)', { sh: 10, edge: false });
    ctx.save(); ctx.globalAlpha = kk;
    ctx.save(); ctx.translate(200, 820); paper(() => { ctx.beginPath(); ctx.arc(0, 0, 130, 0, TAU); }, '#d9f4ef', { sh: 10 }); algae(0, 0, 2); ctx.restore();
    ctx.save(); ctx.translate(540, 820); paper(() => { ctx.beginPath(); ctx.arc(0, 0, 130, 0, TAU); }, '#d9f4ef', { sh: 10 }); shrimp(-14, -4, 1.3, .2); ctx.restore();
    ctx.save(); ctx.translate(880, 820); paper(() => { ctx.beginPath(); ctx.arc(0, 0, 130, 0, TAU); }, '#d9f4ef', { sh: 10 }); flamingo(-20, 20, .28, { ph: 1 }); ctx.restore();
    for (const [x0, x1] of [[335, 405], [675, 745]]) { paper(() => { ctx.beginPath(); ctx.moveTo(x0, 800); ctx.lineTo(x1 - 24, 800); ctx.lineTo(x1 - 24, 770); ctx.lineTo(x1 + 14, 820); ctx.lineTo(x1 - 24, 870); ctx.lineTo(x1 - 24, 840); ctx.lineTo(x0, 840); ctx.closePath(); }, Q.sun, { sh: 6 }); }
    ctx.restore();
    const u = prog(t, c.voyage + .5, 2.6), px2 = lerp(200, 880, E.io(u)), sz = lerp(16, 30, u); if (u > 0) paper(() => { ctx.beginPath(); ctx.arc(px2, 700 + Math.sin(u * 9) * 10, sz, 0, TAU); }, mixc(Q.carrot, Q.pinkDeep, u), { sh: 4, edgec: 'rgba(255,255,255,.6)' });
    if (t > c.voyage + .3) tag('LA COULEUR VOYAGE', 540, 460, 66, { bg: P.salt, fg: Q.ink, rot: -.02, scale: pop(t, c.voyage + .3, .3) });
  }
}

/* =========================================================================================
   C : « …et petit à petit, il rosit. Il lui faut plusieurs années. »
   ========================================================================================= */
function sceneC(t) {
  const c = TIMING.cues, t0 = c.digere - .1;
  gradBg('#ffe3d1', '#ffc9b8'); lagoon(t, 1300, [Q.tealLt, Q.teal, Q.tealDeep]);
  const fill = prog(t, c.digere, c.annees - c.digere - .3);               // la couleur monte des pattes vers la tête
  const mv = E.io(prog(t, c.annees - .15, .6));
  const fx = lerp(540, 770, mv), fs = lerp(1.3, .95, mv), fy = lerp(780, 840, mv);
  // flamant gris puis rose : on dessine la version grise, puis la rose coupée à la hauteur de la couleur
  ctx.save(); ctx.translate(fx, fy); ctx.scale(fs, fs); ctx.translate(-fx, -fy);
  flamingo(fx, fy, 1, { body: Q.gray, leg: '#d2b0b8', beak: '#e8d0d3', ph: 2 });
  ctx.save(); const yy = lerp(fy + 340, fy - 450, E.io(fill)); ctx.beginPath(); ctx.rect(fx - 400, yy, 800, 1000); ctx.clip(); flamingo(fx, fy, 1, { ph: 2 }); ctx.restore(); ctx.restore();
  if (t < c.rosit) { const k = pop(t, c.digere + .2, .3); tag(['IL LES DIGÈRE'], 300, 400, 62, { bg: P.salt, fg: Q.ink, rot: -.04, scale: k }); }
  if (t >= c.digere + 1.2 && t < c.annees - .2) { for (let i = 0; i < 12; i++) { const tt = t - c.digere - 1 - i * .18; if (tt < 0) continue; const u = (tt % 1.8) / 1.8; paper(() => { ctx.beginPath(); ctx.arc(fx - 20 + Math.sin(u * 8 + i) * 40, fy + 90 - u * 480, 11, 0, TAU); }, Q.carrot, { sh: 3, edge: false }); } }
  if (t >= c.rosit) tag('PETIT À PETIT', 330, 400, 64, { bg: Q.pinkDeep, fg: P.salt, rot: -.04, scale: pop(t, c.rosit, .3) });
  // plusieurs années : trois âges
  if (t >= c.annees - .1) {
    const u = pop(t, c.annees, .35); ctx.save(); ctx.translate(250, 560); ctx.scale(u, u);
    chick(0, 0, .55, { col: Q.gray, ph: 1 }); ctx.restore();
    ctx.save(); ctx.translate(250, 840); ctx.scale(pop(t, c.annees + .5, .35), pop(t, c.annees + .5, .35)); flamingo(0, 0, .34, { body: mixc(Q.gray, Q.pink, .55), leg: '#e8a9b6', ph: 3 }); ctx.restore();
    tag(['PLUSIEURS', 'ANNÉES'], 250, 1160, 56, { bg: Q.sun, fg: Q.ink, rot: -.03, scale: pop(t, c.annees + .9, .3) });
    for (const [y0, y1] of [[640, 700]]) { ctx.save(); ctx.translate(250, 0); paper(() => { ctx.beginPath(); ctx.moveTo(-24, y0 + 10); ctx.lineTo(24, y0 + 10); ctx.lineTo(24, y0 + 50); ctx.lineTo(44, y0 + 50); ctx.lineTo(0, y1 + 40); ctx.lineTo(-44, y0 + 50); ctx.lineTo(-24, y0 + 50); ctx.closePath(); }, Q.sun, { sh: 5, edge: false }); ctx.restore(); }
  }
}

/* =========================================================================================
   D : « Mais un poussin ne mange pas d'algues. Pas encore. Comment fait-il pour rosir ? »
   ========================================================================================= */
function sceneD(t) {
  const c = TIMING.cues, t0 = c.mais - .1;
  gradBg('#ffe8d6', '#ffcdbd'); lagoon(t, 1340, [Q.tealLt, Q.teal, Q.tealDeep]);
  const k = pop(t, c.mais, .4);
  chick(400, 880, 2.0 * Math.max(.01, k), { col: Q.gray });
  // assiette barrée
  const a2 = pop(t, c.mais + .5, .35); ctx.save(); ctx.translate(800, 920); ctx.scale(a2, a2);
  paper(() => { ctx.beginPath(); ctx.arc(0, 0, 200, 0, TAU); }, Q.cream, { sh: 14 }); for (let i = 0; i < 4; i++) algae(Math.cos(i * 1.7) * 80, Math.sin(i * 2.1) * 70, .7); shrimp(40, 20, .6, .4);
  ctx.strokeStyle = Q.milk; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-170, -170); ctx.lineTo(170, 170); ctx.moveTo(170, -170); ctx.lineTo(-170, 170); ctx.stroke(); ctx.restore();
  if (t > c.mais + .3) tag("PAS D'ALGUES", 830, 610, 58, { bg: P.salt, fg: Q.milk, rot: .05, scale: pop(t, c.mais + .3, .3) });
  if (t > c.mais + 1.9 && t < c.com) tag('PAS ENCORE', 420, 560, 58, { bg: Q.sun, fg: Q.ink, rot: -.05, scale: pop(t, c.mais + 1.9, .3) });
  if (t >= c.com) qmark(420, 450, Math.max(.01, pop(t, c.com, .4)) * 1.05, Q.pinkDeep, t, c.com);
}

/* =========================================================================================
   E : la révélation, les parents donnent leur couleur
   ========================================================================================= */
function sceneE(t) {
  const c = TIMING.cues, t0 = c.parents - .1;
  sunset(t); lagoon(t, 1340, [Q.tealLt, Q.teal, Q.tealDeep]);
  // la couleur passe des parents au poussin : p de 0 à 1 entre « lait » et « blancs »
  const p = E.io(prog(t, c.lait, c.blancs + 2.2 - c.lait)), parentCol = mixc(Q.pink, '#fdf1ee', p * .94), parentLeg = mixc(Q.pinkDeep, '#f3d9d9', p * .9), chickCol = mixc(Q.gray, Q.pink, p), beak = mixc('#ffd9de', '#fff3f0', p);
  const ent = E.out(prog(t, c.parents, .6));
  flamingo(lerp(-300, 330, ent), 600, 1.0, { body: parentCol, leg: parentLeg, beak, ph: 1, flip: false });
  chick(lerp(1400, 760, ent), 1060, 1.5, { col: chickCol, leg: mixc('#d7b3ba', '#f08aa6', p), beak: mixc('#f3c2c8', '#ff9db4', p), flip: true });
  // le lait rouge, bec à bec
  if (t >= c.lait - .2) for (let i = 0; i < 10; i++) { const tt = t - c.lait - i * .35; if (tt < 0) continue; const u = (tt % 2.3) / 2.3; milkDrop(lerp(590, 650, u) + Math.sin(u * 7 + i) * 14, lerp(250, 880, E.in(u) * .8 + u * .2) + 120, 1.1 - u * .3, 1 - Math.max(0, (u - .85) * 6)); }
  if (t >= c.parents + .4 && t < c.lait) tag('LEUR COULEUR', 740, 330, 74, { bg: Q.pinkDeep, fg: P.salt, rot: -.03, scale: pop(t, c.parents + .4, .35) });
  if (t >= c.lait) tag(['LAIT ROUGE VIF'], 770, 330, 66, { bg: Q.milk, fg: P.salt, rot: -.03, scale: pop(t, c.lait, .35) });
  if (t >= c.repas) tag(['LE ROSE QUITTE LES PARENTS'], 760, 430, 40, { bg: P.salt, fg: Q.ink, rot: .02, scale: pop(t, c.repas, .3) });
  if (t >= c.blancs) {
    tag(['PARENT : PRESQUE BLANC'], 300, 1010, 44, { bg: P.salt, fg: Q.ink, rot: -.03, scale: pop(t, c.blancs, .3) });
    tag(['POUSSIN : DE PLUS', 'EN PLUS ROSE'], 800, 790, 44, { bg: Q.pinkDeep, fg: P.salt, rot: .03, scale: pop(t, c.blancs + .6, .3) });
  }
}

/* =========================================================================================
   F : retour à toi
   ========================================================================================= */
function sceneF(t) {
  const c = TIMING.cues, t0 = c.fin - .1;
  sunset(t); lagoon(t, 1360, [Q.tealLt, Q.teal, Q.tealDeep]);
  const e = E.out(prog(t, c.fin, .6));
  flamingo(lerp(-250, 400, e), 700, 1.05, { body: '#fdeeea', leg: '#f1d4d6', beak: '#fff3f0', ph: 4 });
  const k = Math.max(.01, pop(t, c.plains - .2, .4));
  chick(790, 1190, 1.15 * k, { col: Q.pink, leg: '#f08aa6', beak: '#ff9db4', flip: true });
  // un cœur de papier part du parent vers le petit
  if (t >= c.donne - .2) { const u = prog(t, c.donne - .2, 1.6); for (let i = 0; i < 3; i++) { const uu = clamp(u * 1.4 - i * .25); if (uu <= 0 || uu >= 1) continue; const x = lerp(520, 770, E.io(uu)), y = lerp(470, 980, E.io(uu)) - Math.sin(uu * Math.PI) * 120, s = 1 - uu * .3;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(uu * 6 + i) * .2); paper(() => { ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -40, -60, 0, -28); ctx.bezierCurveTo(40, -60, 60, -10, 0, 30); }, Q.pinkDeep, { sh: 6 }); ctx.restore(); } }
  if (t >= c.fin + .3 && t < c.plains) tag(['UN FLAMANT', 'TOUT PÂLE'], 760, 330, 62, { bg: P.salt, fg: Q.ink, rot: -.03, scale: pop(t, c.fin + .3, .3) });
  if (t >= c.donne) tag('PEUT-ÊTRE', 760, 330, 80, { bg: Q.pinkDeep, fg: P.salt, rot: .03, scale: pop(t, c.donne, .35) });
}

/* ---------- orchestration ---------- */
function plan() {
  const c = TIMING.cues;
  return [{ t: 0, f: sceneA }, { t: c.assiette - .1, f: sceneB, wipe: 1 }, { t: c.digere - .1, f: sceneC, wipe: 1 }, { t: c.mais - .1, f: sceneD, wipe: 1 }, { t: c.parents - .1, f: sceneE, wipe: 1 }, { t: c.fin - .1, f: sceneF, wipe: 1 }];
}
function renderFrame(t) {
  setTime(t); const pl = plan(); let i = 0; while (i + 1 < pl.length && T >= pl[i + 1].t) i++;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H); ctx.save();
  const s0 = pl[i].t, s1 = i + 1 < pl.length ? pl[i + 1].t : TIMING.video_end;
  camera((T - s0) / Math.max(.1, s1 - s0), 1.0, 1.04, W / 2, 900, 0, -14);
  pl[i].f(T); ctx.restore();
  grain(); subtitles(T);
  for (const p of pl) if (p.wipe) wipeSheets(T, p.t);
}
function renderCover() {
  setTime(.4); K = 7; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
  sunset(0); cloud(230, 300, 110, '#fff'); cloud(870, 230, 85, '#fff6f0'); lagoon(0, 1330, [Q.tealLt, Q.teal, Q.tealDeep]);
  extruded('POURQUOI LES', 540, 440, 112, Q.ink, Q.pinkDeep, { depth: 10, rot: -.012 }); extruded('FLAMANTS', 540, 590, 150, Q.ink, Q.pinkDeep, { depth: 12, rot: .01 }); extruded('SONT ROSES ?', 540, 730, 130, Q.ink, Q.pinkDeep, { depth: 11, rot: -.008 });
  flamingo(330, 1150, .84, { ph: 1 }); chick(790, 1260, 1.05, { col: Q.gray, flip: true });
  tag(['PAS NÉ ROSE'], 800, 1030, 60, { bg: P.salt, fg: Q.pinkDeep, rot: .05, sh: 12 });
  grain();
}
