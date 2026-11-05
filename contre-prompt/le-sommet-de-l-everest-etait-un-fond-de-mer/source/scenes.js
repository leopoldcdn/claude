/* « Pourquoi le sommet de l'Everest est-il fait de fonds marins ? » : papier découpé + images réelles (NASA), calé sur la voix off. */
'use strict';
const EV = { sky: '#cfe6f2', sea: '#2fa4d0', seaDeep: '#0e4a78', teal: '#8fd8ea', sand: '#f1dfb6', ochre: '#d9a35b', rock: '#a8683f', rock2: '#8a5232', lime: '#e8e2d2', limeDk: '#c9c0a8', snow: '#f4f8ff', india: '#ff9f43', asia: '#6bbf7a', pink: '#ff8fb1', pink2: '#e0678f' };
function camera(s, z0, z1, cx = W / 2, cy = 900, dx = 0, dy = 0) { const z = lerp(z0, z1, clamp(s)); ctx.translate(cx + dx * s, cy + dy * s); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function bg(top, bot) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function blob(cx, cy, pts, col, seed) { const p = wobblePoly(cx, cy, pts, 3, seed); paper(() => smoothClosed(p), col, { sh: 14 }); }

/* ---------- dessins ---------- */
function crinoid(x, y, s, ph = 0) {          // « lys de mer » avec un visage : y = pied de la tige
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const sway = Math.sin(T * 2 + ph) * 14, tx = sway, ty = -220;
  ctx.strokeStyle = EV.pink2; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sway * .5, -110, tx, ty); ctx.stroke();
  for (let i = -3; i <= 3; i++) { ctx.strokeStyle = i % 2 ? EV.pink2 : EV.pink; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + i * 28, ty - 70, tx + i * 42 + Math.sin(T * 3 + i + ph) * 6, ty - 120 + Math.abs(i) * 12); ctx.stroke(); }
  paper(() => { ctx.beginPath(); ctx.arc(tx, ty, 24, 0, TAU); }, EV.pink, { sh: 4, edge: false });
  ctx.fillStyle = BRAND.ink; ctx.beginPath(); ctx.arc(tx - 9, ty - 4, 3.6, 0, TAU); ctx.arc(tx + 9, ty - 4, 3.6, 0, TAU); ctx.fill(); ctx.strokeStyle = BRAND.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(tx, ty + 3, 8, .2, Math.PI - .2); ctx.stroke(); ctx.restore();
}
function shell(x, y, s, rot, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s);
  paper(() => { ctx.beginPath(); ctx.moveTo(0, 40); ctx.bezierCurveTo(-90, 10, -70, -70, 0, -80); ctx.bezierCurveTo(70, -70, 90, 10, 0, 40); ctx.closePath(); }, col || EV.ochre, { sh: 6 });
  ctx.strokeStyle = 'rgba(0,0,0,.22)'; ctx.lineWidth = 4; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(0, 38); ctx.lineTo(i * 18, -70 + Math.abs(i) * 8); ctx.stroke(); } ctx.restore();
}
function arrow(x, y, ang, len, col, w = 26) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col || BRAND.accent; ctx.beginPath(); ctx.moveTo(-len / 2, -w / 2); ctx.lineTo(len / 2 - w * 1.4, -w / 2); ctx.lineTo(len / 2 - w * 1.4, -w); ctx.lineTo(len / 2, 0); ctx.lineTo(len / 2 - w * 1.4, w); ctx.lineTo(len / 2 - w * 1.4, w / 2); ctx.lineTo(-len / 2, w / 2); ctx.closePath(); ctx.fill(); ctx.restore(); }
/* couches de roche qui se plissent : p = 0 (à plat) → 1 (montagne) */
function strata(cx, base, p, col0) {
  const L = 900 * (1 - .4 * p), H0 = 380 * p, cols = ['#e8e2d2', '#c98a3c', '#d9a35b', '#a8683f', '#8a5232', '#6d3f25'];
  for (let i = cols.length - 1; i >= 0; i--) {
    const yb = base + i * 74; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const path = () => { ctx.beginPath(); for (let k = 0; k <= 40; k++) { const x = cx - L / 2 + L * k / 40, y = yb - H0 * Math.max(0, 1 - Math.abs(x - cx) / (L / 2)) * (1 - i * .09); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } };
    ctx.save(); ctx.translate(5, 10); path(); ctx.strokeStyle = 'rgba(6,18,36,.3)'; ctx.lineWidth = 74; ctx.stroke(); ctx.restore();
    path(); ctx.strokeStyle = i === 0 && col0 ? col0 : cols[i]; ctx.lineWidth = 74; ctx.stroke(); ctx.restore();
  }
  for (let k = 1; k < 10; k++) { const x = cx - L / 2 + L * k / 10, y = base - H0 * Math.max(0, 1 - Math.abs(x - cx) / (L / 2)); ctx.fillStyle = 'rgba(11,37,64,.5)'; ctx.beginPath(); ctx.ellipse(x, y, 10, 6, k, 0, TAU); ctx.fill(); }
}
function mountains(y, o = {}) {
  const kk = o.k || 1; for (const [dx, h0, w0, col, sn] of [[-250, 520, 520, '#7f8fa0', 1], [150, 700, 640, '#6b7c8e', 1], [-40, 440, 460, '#93a3b2', 0]]) {
    const h = h0 * kk, w = w0 * kk, cx = 540 + dx * kk, top = y - h; paper(() => { ctx.beginPath(); ctx.moveTo(cx - w / 2, y); ctx.lineTo(cx, top); ctx.lineTo(cx + w / 2, y); ctx.closePath(); }, col, { sh: 12 });
    if (sn) paper(() => { ctx.beginPath(); ctx.moveTo(cx - w * .13, top + h * .26); ctx.lineTo(cx, top); ctx.lineTo(cx + w * .13, top + h * .26); ctx.lineTo(cx + w * .05, top + h * .22); ctx.lineTo(cx, top + h * .3); ctx.lineTo(cx - w * .06, top + h * .22); ctx.closePath(); }, EV.snow, { sh: 0, edge: false });
  }
}
/* carte : Asie (haut), Inde (bas), océan entre les deux */
function indiaCy(t) { const c = TIMING.cues; if (t < c.cta1 + 1.5) return 1060; if (t < c.choc) return lerp(1060, 1000, E.io(prog(t, c.cta1 + 1.5, c.choc - c.cta1 - 1.5))); return lerp(1000, 790, E.io(prog(t, c.choc + .4, 5.0))); }
function mapScene(t, o = {}) {
  const c = TIMING.cues; bg('#8fd8ea', '#2fa4d0'); waveBand(250, 10, 300, T, 'rgba(255,255,255,.18)', { seed: 2, sh: 0, boil: 0 }); waveBand(900, 14, 320, T * 1.2, 'rgba(14,74,120,.25)', { seed: 6, sh: 0 });
  blob(540, 440, [[-460, -140], [-250, -190], [0, -170], [260, -200], [470, -130], [450, 120], [230, 135], [0, 150], [-230, 130], [-440, 115]], EV.asia, 11);
  const cy = indiaCy(t), hit = prog(t, c.choc + 4.6, .6), sq = hit * 14;
  blob(540, cy, [[-60, -200 + sq], [180, -180 + sq], [250, -60], [210, 90], [90, 200], [20, 215], [-80, 110], [-215, -20], [-190, -120]], EV.india, 4);
  if (hit > 0) { ctx.save(); ctx.strokeStyle = '#2f7a42'; ctx.lineWidth = 8; ctx.lineCap = 'round'; for (let i = 0; i < 9; i++) { const x = 130 + i * 100; ctx.beginPath(); ctx.moveTo(x, 555 - hit * 10); ctx.lineTo(x + 30, 585 + hit * 12 * (i % 2 ? 1 : -1) * 0 + 8); ctx.stroke(); } ctx.restore(); }
  tag('ASIE', 840, 400, 62, { bg: BRAND.paper, fg: BRAND.ink, rot: .03 }); tag('INDE', 420, cy + 20, 62, { bg: BRAND.paper, fg: BRAND.ink, rot: -.03 });
  const lab = o.tethys == null ? 1 : o.tethys; if (lab > 0 && t < c.ocean + .2) { const k = Math.max(.01, pop(t, c.tethys + .3, .35)) * (1 - prog(t, c.cta1 - .3, .4)); if (k > .02) extruded('TÉTHYS', 540, 760, 110, BRAND.paper, EV.seaDeep, { depth: 10, rot: -.02, scale: k }); }
}

/* =========================================================================================
   A : « Le sommet de l'Everest était un fond de mer. Et il y reste des fossiles marins. »
   ========================================================================================= */
function sceneA(t) {
  const c = TIMING.cues; bg(EV.sky, EV.sea);
  photoCard(IMG.sts66, 540, 650, 780, 780, -.03 + Math.sin(t * 1.2) * .004, { seed: 5, scale: 1 + .03 * Math.min(1, t / 3) });
  waveBand(lerp(1500, 1275, E.out(prog(t, .2, 2.6))), 16, 300, T * 1.4, 'rgba(47,164,208,.8)', { seed: 4, sh: 0 });
  tag('ÉTAIT UN FOND DE MER', 540, 1095, 72, { bg: BRAND.accent, fg: '#fff', rot: -.025, scale: Math.max(.01, pop(t, .35, .35)) });
  if (t >= c.h2) tag('ET IL Y RESTE DES FOSSILES', 540, 1215, 52, { bg: BRAND.accent2, fg: BRAND.ink, rot: .02, scale: pop(t, c.h2, .3) });
}
/* B : le sommet est fait de calcaire */
function sceneB(t) {
  const c = TIMING.cues; bg('#e9f3f8', EV.sky);
  extruded('8 848 m', 540, 340, 170, BRAND.paper, '#2f62ad', { depth: 14, rot: -.015, scale: Math.max(.01, pop(t, c.roche, .35)) });
  photoCard(IMG.iss, 540, 800, 800, 620, .02, { seed: 9, scale: 1 + .03 * prog(t, c.roche, 4) });
  if (t > c.roche + 1.4) tag('SOMMET = CALCAIRE', 540, 1180, 64, { bg: BRAND.accent, fg: '#fff', rot: -.02, scale: pop(t, c.roche + 1.4, .3) });
}
/* C : des fossiles dedans */
function sceneC(t) {
  const c = TIMING.cues; bg('#f6efe0', '#e8d9b8');
  photoCard(IMG.fossil, 540, 640, 800, 525, -.02, { seed: 3, scale: 1 + .03 * prog(t, c.fossile, 5) });
  tag(['FOSSILE MARIN, D\'UN AUTRE CALCAIRE', '(EXEMPLE)'], 540, 330, 44, { bg: BRAND.paper, fg: BRAND.ink, rot: .015, scale: Math.max(.01, pop(t, c.fossile, .3)) });
  if (t > c.fossile + 1.4) { const k = pop(t, c.fossile + 1.4, .3); tag('BRACHIOPODES', 330, 1010, 54, { bg: EV.ochre, fg: BRAND.ink, rot: -.03, scale: k }); shell(190, 1160, 1.1 * k, -.1); }
  if (t > c.fossile + 3.0) { const k = pop(t, c.fossile + 3.0, .3); tag('CRINOÏDES', 770, 1010, 54, { bg: EV.pink, fg: BRAND.ink, rot: .03, scale: k }); crinoid(840, 1280, .85 * k, 0); }
}
/* D : une mer chaude et peu profonde, il y a environ 450 millions d'années */
function sceneD(t) {
  const c = TIMING.cues; bg('#bfeaf2', '#2fa4d0');
  ctx.save(); ctx.translate(880, 330); ctx.rotate(t * .3); ctx.fillStyle = BRAND.accent2; for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); rrect(-10, -110, 20, 46, 10); ctx.fill(); } ctx.restore();
  paper(() => { ctx.beginPath(); ctx.arc(880, 330, 62, 0, TAU); }, BRAND.accent2, { sh: 0 });
  waveBand(560, 14, 300, T * 1.1, 'rgba(255,255,255,.35)', { seed: 3, sh: 0 }); waveBand(640, 12, 260, -T, 'rgba(14,74,120,.22)', { seed: 9, sh: 0 });
  paper(() => { ctx.beginPath(); ctx.moveTo(-40, 1300); for (let x = -40; x <= W + 40; x += 40) ctx.lineTo(x, 1150 + 26 * Math.sin(x / 140) + jit(x, 1)); ctx.lineTo(W + 40, 1300); ctx.closePath(); }, EV.sand, { sh: 10 });
  crinoid(230, 1160, 1.0, 0); crinoid(560, 1170, 1.25, 1.7); crinoid(860, 1160, .95, 3.1); shell(390, 1210, .8, .2, EV.ochre); shell(730, 1220, .7, -.25, EV.limeDk);
  extruded('≈ 450 MILLIONS', 540, 360, 100, BRAND.paper, '#2f62ad', { depth: 10, rot: -.015, scale: Math.max(.01, pop(t, c.age, .35)) });
  tag("D'ANNÉES", 540, 470, 56, { bg: BRAND.accent, fg: '#fff', rot: .02, scale: Math.max(.01, pop(t, c.age + .3, .3)) });
  if (t > c.age + 2.2) tag(['MER CHAUDE,', 'PEU PROFONDE'], 540, 760, 62, { bg: BRAND.paper, fg: BRAND.ink, rot: -.02, scale: pop(t, c.age + 2.2, .3) });
}
/* E : « comment ce fond de mer a-t-il fini sur le toit du monde ? » */
function sceneE(t) {
  const c = TIMING.cues; bg('#cfe6f2', '#e9f3f8'); mountains(1260);
  const k = Math.max(.01, pop(t, c.relance, .4)); extruded('?', 540, 560, 520, BRAND.accent2, BRAND.accent, { depth: 24, rot: Math.sin(t * 2) * .03, scale: k });
  if (t > c.relance + 1.0) tag(['FOND DE MER', '→ TOIT DU MONDE ?'], 540, 1010, 62, { bg: BRAND.paper, fg: BRAND.ink, rot: .02, scale: pop(t, c.relance + 1.0, .3) });
}
/* M1 : l'Inde est loin de l'Asie, la Téthys entre les deux */
function sceneM1(t) { mapScene(t); }
/* M2 : appel à s'abonner, l'Inde commence à bouger */
function sceneM2(t) {
  const c = TIMING.cues; mapScene(t); arrow(540, indiaCy(t) - 250, -Math.PI / 2, 150, BRAND.accent, 30);
  ctaSubscribe(t, c.cta1, 800);
}
/* F : la collision, il y a environ 50 millions d'années */
function sceneF(t) {
  const c = TIMING.cues; mapScene(t); arrow(540, indiaCy(t) - 250, -Math.PI / 2, 160 + 30 * Math.sin(t * 8), BRAND.accent, 32);
  if (t > c.choc + 1.0) tag('IL Y A ≈ 50 MILLIONS D\'ANNÉES', 540, 250, 52, { bg: BRAND.accent, fg: '#fff', rot: -.02, scale: pop(t, c.choc + 1.0, .3) });
  if (t > c.choc + 4.6) tag('COLLISION !', 540, 770, 80, { bg: BRAND.accent2, fg: BRAND.ink, rot: .03, scale: pop(t, c.choc + 4.6, .3) });
}
/* G : l'océan se referme, les couches sont écrasées et poussées vers le haut */
function sceneG(t) {
  const c = TIMING.cues; bg('#ffe9d2', '#f7c9a3');
  const p = E.io(prog(t, c.ocean - .2, 4.6));
  strata(540, 830, p); arrow(110 + p * 80, 840, 0, 150, BRAND.accent, 30); arrow(970 - p * 80, 840, Math.PI, 150, BRAND.accent, 30);
  tag("L'OCÉAN SE REFERME", 540, 330, 64, { bg: BRAND.paper, fg: BRAND.ink, rot: -.02, scale: Math.max(.01, pop(t, c.ocean, .3)) });
  if (t > c.plis) tag('COUCHES ÉCRASÉES ET PLISSÉES', 540, 1240, 50, { bg: BRAND.accent, fg: '#fff', rot: .02, scale: pop(t, c.plis, .3) });
}
/* H : le grand moment : un fond de mer devient le point le plus haut de la Terre */
function sceneH(t) {
  const c = TIMING.cues; bg('#cfe6f2', '#ffffff');
  const e = prog(t, c.reveal, 1.1);
  extruded('FOND DE MER', 540, 340, 150, EV.sea, EV.seaDeep, { depth: 14, rot: -.015, scale: Math.max(.01, pop(t, c.reveal, .35)) });
  if (t > c.reveal + 1.2) extruded('TOIT DU MONDE', 540, 500, 130, BRAND.accent, '#a8301a', { depth: 13, rot: .012, scale: Math.max(.01, pop(t, c.reveal + 1.2, .35)) });
  photoCard(IMG.radar, 540, 900, 640, 560, -.025, { seed: 7, scale: 1 + .04 * prog(t, c.reveal, 4.6) });
  if (t > c.reveal + 2.2) tag(['LE SOMMET AUJOURD\'HUI', '(RADAR, NASA)'], 540, 1230, 46, { bg: BRAND.paper, fg: BRAND.ink, rot: .02, scale: pop(t, c.reveal + 2.2, .3) });
  if (e < 1) { ctx.save(); ctx.fillStyle = EV.sea; ctx.globalAlpha = 1 - e; ctx.fillRect(0, 0, W, H * (1 - e * .0) ); ctx.restore(); }
}
/* I : l'Inde pousse toujours, la montagne continue de monter */
function sceneI(t) {
  const c = TIMING.cues; bg('#cfe6f2', '#e9f3f8');
  photoCard(IMG.himalaya, 540, 760, 640, 760, .02, { seed: 5, scale: 1 + .03 * prog(t, c.encore, 5.8) });
  tag("AUJOURD'HUI : L'HIMALAYA", 540, 300, 56, { bg: BRAND.paper, fg: BRAND.ink, rot: -.02, scale: Math.max(.01, pop(t, c.encore, .3)) });
  const k = pop(t, c.encore + 1.2, .35); arrow(95, 800, -Math.PI / 2, 300 * k, BRAND.accent, 36); arrow(985, 800, -Math.PI / 2, 300 * k, BRAND.accent, 36);
  if (t > c.encore + 1.2) tag(["L'INDE POUSSE TOUJOURS"], 540, 1180, 56, { bg: BRAND.accent, fg: '#fff', rot: .02, scale: k });
}
/* J : quelle mer dormait là ? + appel à envoyer */
function sceneJ(t) {
  const c = TIMING.cues; bg('#cfe6f2', '#2fa4d0'); mountains(1120, { k: .72 });
  waveBand(1150, 14, 300, T * 1.2, 'rgba(47,164,208,.9)', { seed: 8, sh: 0 }); waveBand(1230, 12, 260, -T, 'rgba(14,74,120,.55)', { seed: 12, sh: 0 });
  crinoid(150, 1290, .9, 0.6);
  const k = Math.max(.01, pop(t, c.fin + .2, .4)); extruded('QUELLE MER', 540, 380, 140, BRAND.paper, '#2f62ad', { depth: 13, rot: -.015, scale: k });
  if (t > c.fin + 1.5) extruded('DORMAIT LÀ ?', 540, 530, 130, BRAND.accent2, BRAND.accent, { depth: 13, rot: .012, scale: Math.max(.01, pop(t, c.fin + 1.5, .35)) });
}
function sceneJ2(t) { const c = TIMING.cues; sceneJ(t); ctaSend(t, c.cta2, 690, 760); }

/* ---------- orchestration ---------- */
function plan() {
  const c = TIMING.cues;
  return [{ t: 0, f: sceneA }, { t: c.roche - .1, f: sceneB, wipe: 1 }, { t: c.fossile - .1, f: sceneC, wipe: 1 }, { t: c.age - .1, f: sceneD, wipe: 1 }, { t: c.relance - .1, f: sceneE, wipe: 1 },
    { t: c.tethys - .1, f: sceneM1, wipe: 1 }, { t: c.cta1 - .1, f: sceneM2, wipe: 1 }, { t: c.choc - .1, f: sceneF, wipe: 1 }, { t: c.ocean - .1, f: sceneG, wipe: 1 }, { t: c.reveal - .1, f: sceneH, wipe: 1 },
    { t: c.encore - .1, f: sceneI, wipe: 1 }, { t: c.fin - .1, f: sceneJ, wipe: 1 }, { t: c.cta2 - .1, f: sceneJ2, wipe: 1 }];
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
  coverTemplate({ kicker: "SOMMET DE L'EVEREST", word: 'FOND DE MER ?', wordSize: 128, kickerSize: 80, tagText: 'DES FOSSILES MARINS AU SOMMET',
    bg: () => bg('#cfe6f2', '#2fa4d0'), illustration: () => { photoCard(IMG.sts66, 540, 1150, 680, 680, -.03, { seed: 5 }); } });
}
