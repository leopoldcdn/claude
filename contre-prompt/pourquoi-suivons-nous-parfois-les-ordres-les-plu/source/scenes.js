/* « Pourquoi suivons-nous parfois les ordres les plus absurdes ? » : laboratoire en papier découpé, calé sur la voix off. */
'use strict';
const cue = n => TIMING.cues[n];
const L = { wall: '#d6dee2', wall2: '#bcc8ce', floor: '#8d9ca3', coat: '#b4bec4', coat2: '#8f9ca3', skin: '#f2c9a5', blue: '#2f62ad', blue2: '#214a86', red: '#e5483f', amber: '#ffc247', ink: '#10202e', panel: '#2d3a44', panel2: '#3d4c58', paper: '#fffdf5', green: '#4f9a6b', grey: '#7d8d96' };
function camera(s, z0, z1, cx = W / 2, cy = 900, dx = 0, dy = 0) { const z = lerp(z0, z1, clamp(s)); ctx.translate(cx + dx * s, cy + dy * s); ctx.scale(z, z); ctx.translate(-cx, -cy); }
const fmt = (v, d = 0) => v.toFixed(d).replace('.', ',');
function labBg(t, tone = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, tone ? '#c7d3d9' : L.wall); g.addColorStop(1, tone ? '#9fb0b8' : L.wall2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .1; ctx.fillStyle = '#fff'; for (let i = 0; i < 7; i++) ctx.fillRect(i * 170 + 20, 0, 70, 1500); ctx.restore();
  paper(() => { ctx.beginPath(); ctx.rect(-20, 1255, W + 40, 700); }, L.floor, { sh: 0, edge: false }); ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(0, 1255, W, 10);
}
/* ---------- personnages en papier ---------- */
function person(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); if (o.rot) ctx.rotate(o.rot);
  paper(() => rrect(-38, -78, 32, 78, 10), o.pants || L.ink, { sh: 0, edge: false }); paper(() => rrect(6, -78, 32, 78, 10), o.pants || L.ink, { sh: 0, edge: false });
  paper(() => rrect(-52, -228, 104, 160, 38), o.coat || L.blue, { sh: 8 });
  if (o.lapel) { ctx.fillStyle = o.lapel; ctx.beginPath(); ctx.moveTo(-12, -226); ctx.lineTo(0, -170); ctx.lineTo(12, -226); ctx.closePath(); ctx.fill(); }
  paper(() => { ctx.beginPath(); ctx.arc(0, -276, 44, 0, TAU); }, L.skin, { sh: 6 });
  ctx.fillStyle = o.hair || L.ink; ctx.beginPath(); ctx.arc(0, -282, 44, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
  ctx.fillStyle = L.ink; ctx.beginPath(); ctx.arc(-15, -276, 5, 0, TAU); ctx.arc(15, -276, 5, 0, TAU); ctx.fill();
  ctx.strokeStyle = L.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
  if (o.worry) { ctx.moveTo(-14, -250); ctx.quadraticCurveTo(0, -260, 14, -250); } else if (o.smile) { ctx.moveTo(-14, -255); ctx.quadraticCurveTo(0, -240, 14, -255); } else { ctx.moveTo(-12, -252); ctx.lineTo(12, -252); } ctx.stroke();
  if (o.sweat) { ctx.fillStyle = '#7ec8f0'; for (const [dx, dy, k] of [[-58, -300, 1], [60, -290, .8]]) { const yy = dy + ((T * 60 + dx) % 40); dropPath(dx, yy, 20 * k, 30 * k); ctx.fill(); } }
  ctx.restore();
}
function mini(x, y, s, col, on = 1) {      // petit personnage pour les grilles
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= on;
  paper(() => rrect(-18, -34, 36, 46, 14), col, { sh: 4, edge: false }); paper(() => { ctx.beginPath(); ctx.arc(0, -46, 14, 0, TAU); }, col, { sh: 4, edge: false }); ctx.restore();
}
function bubble(lines, x, y, size, o = {}) {      // bulle de dialogue en papier
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); const k = o.scale == null ? 1 : o.scale; ctx.scale(k, k);
  font(size); const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + size * 1.1, h = lines.length * size * 1.1 + size * .8, tx = o.tx == null ? -w * .25 : o.tx;
  paper(() => { ctx.beginPath(); rrect(-w / 2, -h / 2, w, h, size * .55); ctx.moveTo(tx - 22, h / 2 - 2); ctx.lineTo(tx + (o.tdx == null ? -26 : o.tdx), h / 2 + (o.tl || 54)); ctx.lineTo(tx + 26, h / 2 - 2); ctx.closePath(); }, o.bg || L.paper, { sh: 12 });
  ctx.fillStyle = o.fg || L.ink; font(size); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, 0, -h / 2 + size * .4 + size * 1.1 * (i + .5) + size * .04));
  ctx.restore();
}
function bell(x, y, s, ring) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(T * 14) * .22 * ring); ctx.scale(s, s);
  paper(() => { ctx.beginPath(); ctx.moveTo(-46, 28); ctx.quadraticCurveTo(-46, -50, 0, -56); ctx.quadraticCurveTo(46, -50, 46, 28); ctx.closePath(); }, L.amber, { sh: 6 });
  paper(() => { ctx.beginPath(); ctx.arc(0, 38, 12, 0, TAU); }, L.amber, { sh: 0 }); ctx.restore();
}
/* panneau de commandes : 30 interrupteurs de 15 à 450 volts */
function panel(x, y, w, t, lit, o = {}) {
  ctx.save(); ctx.translate(x, y); const h = o.h || 330;
  paper(() => rrect(-w / 2, -h / 2, w, h, 26), L.panel, { sh: 16 });
  ctx.fillStyle = L.amber; font(32); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('GÉNÉRATEUR DE CHOCS', 0, -h / 2 + 34);
  const cols = 15, gx = (w - 60) / cols;
  for (let i = 0; i < 30; i++) { const r = Math.floor(i / cols), c = i % cols, sx = -w / 2 + 30 + gx * (c + .5), sy = -h / 2 + 110 + r * 90, on = i < lit;
    const col = on ? (i >= 19 ? L.red : L.amber) : L.panel2; ctx.fillStyle = col; rrect(sx - gx * .32, sy - 22, gx * .64, 44, 6); ctx.fill();
    ctx.fillStyle = on ? L.ink : '#8da0ad'; font(Math.min(20, gx * .5)); ctx.fillText(String((i + 1) * 15), sx, sy); }
  ctx.restore();
}
function cross(x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col || L.red; ctx.lineWidth = 22 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-60 * s, -60 * s); ctx.lineTo(60 * s, 60 * s); ctx.moveTo(60 * s, -60 * s); ctx.lineTo(-60 * s, 60 * s); ctx.stroke(); ctx.restore(); }

/* =========================================================================================
   A : hook — un inconnu en blouse grise te dit de continuer
   ========================================================================================= */
function sceneA(t) {
  const c = TIMING.cues; labBg(t);
  panel(540, 600, 880, t, 12 + Math.floor(prog(t, 1, 5) * 8), { h: 300 });
  person(300, 1250, 1.75, { coat: L.coat, lapel: L.coat2, hair: '#6b6b6b', rot: Math.sin(t * 2) * .01 });
  person(800, 1250, 1.45, { coat: L.blue, hair: '#4a3420', flip: true, worry: t > c.h2 });
  const k = pop(t, .5, .35); if (k > 0) bubble(['CONTINUEZ.'], 430, 300, 96, { scale: k, rot: -.02, tx: -150, tdx: -40, tl: 90 });
  if (t >= c.h2) tag("TU T'ARRÊTES ?", 720, 440, 74, { bg: L.amber, fg: L.ink, rot: .03, scale: pop(t, c.h2, .3) });
}
/* B : Yale, début des années soixante */
function sceneB(t) {
  const c = TIMING.cues; labBg(t, 1);
  const k = Math.max(.01, pop(t, c.lab, .45)); ctx.save(); ctx.translate(540, 760); ctx.scale(k, k);
  paper(() => { ctx.beginPath(); ctx.moveTo(-380, -150); ctx.lineTo(0, -300); ctx.lineTo(380, -150); ctx.closePath(); }, '#e9e1d0', { sh: 14 });
  paper(() => rrect(-380, -150, 760, 40, 8), '#d6ccb6', { sh: 6 });
  for (let i = -3; i <= 3; i++) paper(() => rrect(i * 110 - 30, -110, 60, 330, 14), '#f3ecdc', { sh: 8 });
  paper(() => rrect(-400, 220, 800, 50, 8), '#d6ccb6', { sh: 8 });
  paper(() => rrect(-120, -30, 240, 110, 20), L.blue2, { sh: 0, edge: false }); ctx.fillStyle = '#fff'; font(70); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('YALE', 0, 28); ctx.restore();
  tag('ANNÉES 1960', 300, 330, 64, { bg: L.amber, fg: L.ink, rot: -.04, scale: Math.max(.01, pop(t, c.lab + .3, .3)) });
  if (t > c.lab + 2.4) tag(['« ÉTUDE SUR LA MÉMOIRE »', '(EN APPARENCE)'], 540, 1190, 52, { bg: L.paper, fg: L.ink, rot: .02, scale: pop(t, c.lab + 2.4, .3) });
}
/* C : le professeur monte d'un cran jusqu'à 450 V */
function sceneC(t) {
  const c = TIMING.cues; labBg(t);
  const u = prog(t, c.role + 1.2, 6.2), lit = Math.min(30, Math.floor(u * 30)), v = Math.max(15, lit * 15);
  panel(540, 640, 940, t, lit, { h: 340 });
  paper(() => rrect(-250 + 540, 940, 500, 190), L.ink, { sh: 12 }); ctx.save(); ctx.fillStyle = lit > 19 ? L.red : L.amber; font(150); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(v + ' V', 540, 1038); ctx.restore();
  tag('UN CRAN PLUS HAUT À CHAQUE ERREUR', 540, 1230, 46, { bg: L.paper, fg: L.ink, rot: -.015, scale: pop(t, c.role + .6, .3) });
  tag('PROFESSEUR', 200, 330, 52, { bg: L.blue, fg: '#fff', rot: -.04, scale: pop(t, c.role, .3) });
}
/* D : l'élève est un acteur ; l'expérimentateur insiste */
function sceneD(t) {
  const c = TIMING.cues; labBg(t, 1);
  paper(() => rrect(450, 360, 40, 1130, 6), L.wall2, { sh: 14 });
  person(240, 1250, 1.5, { coat: L.blue, hair: '#4a3420', worry: t > c.prods });
  person(780, 1250, 1.4, { coat: '#8a5ca8', hair: '#2b1b12', smile: true, flip: true });
  tag('PROFESSEUR', 240, 420, 46, { bg: L.blue, fg: '#fff', rot: -.03 });
  tag('« ÉLÈVE » = UN ACTEUR', 780, 420, 46, { bg: '#8a5ca8', fg: '#fff', rot: .03, scale: pop(t, c.actor, .3) });
  if (t > c.actor + 1.0) tag('AUCUN CHOC', 780, 520, 62, { bg: L.amber, fg: L.ink, rot: -.03, scale: pop(t, c.actor + 1.0, .3) });
  if (t >= c.prods) { const k = pop(t, c.prods, .35); bubble(['« L\'EXPÉRIENCE EXIGE', 'QUE VOUS CONTINUIEZ. »'], 540, 690, 54, { scale: k, bg: L.coat, rot: .015, tx: -40, tdx: 10, tl: 50 }); }
}
/* E : la prédiction, environ un sur cent */
function sceneE(t) {
  const c = TIMING.cues; labBg(t, 1);
  for (let i = 0; i < 100; i++) { const r = Math.floor(i / 10), cc = i % 10, x = 150 + cc * 86, y = 520 + r * 82, on = prog(t, c.pred + i * .012, .25); if (on <= 0) continue; mini(x, y, .9, i === 0 && t > c.pred + 1.8 ? L.red : L.grey, on); }
  tag('100 PERSONNES', 300, 330, 60, { bg: L.paper, fg: L.ink, rot: -.03, scale: Math.max(.01, pop(t, c.pred, .3)) });
  if (t > c.pred + 1.8) tag(['PRÉDICTION : ≈ 1 SUR 100', 'IRAIT JUSQU\'AU BOUT'], 540, 1190, 52, { bg: L.red, fg: '#fff', rot: .02, scale: pop(t, c.pred + 1.8, .3) });
  if (t > c.pred + .6) tag('ÉTUDIANTS EN PSYCHOLOGIE', 740, 410, 44, { bg: L.amber, fg: L.ink, rot: .03, scale: pop(t, c.pred + .6, .3) });
}
/* F : le résultat, 26 sur 40, puis l'appel à s'abonner */
function sceneF(t) {
  const c = TIMING.cues; labBg(t, 1);
  for (let i = 0; i < 40; i++) { const r = Math.floor(i / 8), cc = i % 8, x = 160 + cc * 108, y = 470 + r * 112, on = prog(t, c.res - .6 + i * .02, .25); if (on <= 0) continue;
    const obey = i < 26, sh = t > c.tense && obey ? Math.sin(t * 40 + i) * 3 : 0; mini(x + sh, y, 1.25, t > c.res + .6 ? (obey ? L.red : L.grey) : L.grey, on); }
  const k = Math.max(.01, pop(t, c.res + .3, .35)); extruded('26 / 40', 540, 300, 150, L.paper, L.red, { depth: 13, rot: -.015, scale: k });
  if (t > c.res + 1.4) tag(['65 % VONT JUSQU\'À 450 VOLTS'], 540, 1195, 56, { bg: L.red, fg: '#fff', rot: .02, scale: pop(t, c.res + 1.4, .3) });
  if (t >= c.tense && t < c.cta1) tag('ILS TREMBLENT, MAIS CONTINUENT', 540, 1075, 46, { bg: L.paper, fg: L.ink, rot: -.02, scale: pop(t, c.tense, .3) });
  if (t >= c.cta1) { const kk = pop(t, c.cta1, .35); ctx.save(); ctx.translate(540, 1050); ctx.scale(kk, kk); ctx.rotate(-.025);
    paper(() => rrect(-380, -80, 760, 160, 40), L.red, { sh: 14 }); ctx.fillStyle = '#fff'; font(84); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ABONNE-TOI', 40, 4); ctx.restore(); bell(205, 1050, 1.2 * kk, 1); }
}
/* G : les variantes */
function sceneG(t) {
  const c = TIMING.cues; labBg(t, 1);
  const bars = [['ORIGINAL', 65, L.red], ['PAR TÉLÉPHONE', 21, L.amber], ['2 PROFESSEURS REFUSENT', 10, L.blue]];
  bars.forEach(([lab, v, col], i) => { const t0 = i === 0 ? c.var - .2 : i === 1 ? c.var + .2 : c.var + 3.4, e = E.out(prog(t, t0, 1.1)), y = 520 + i * 250, wmax = 760;
    paper(() => rrect(120, y - 58, wmax, 116, 28), 'rgba(255,255,255,.55)', { sh: 6 }); if (e > 0) paper(() => rrect(120, y - 58, Math.max(30, wmax * v / 100 * e), 116, 28), col, { sh: 10 });
    tag(lab, 330, y - 100, 40, { bg: L.paper, fg: L.ink, rot: -.02 }); if (e > .2) extruded(Math.round(v * e) + ' %', 120 + Math.max(30, wmax * v / 100 * e) + 120, y, 76, L.paper, L.ink, { depth: 8 }); });
  if (t > c.var + 3.6) tag('4 SUR 40', 780, 1210, 56, { bg: L.paper, fg: L.ink, rot: .03, scale: pop(t, c.var + 3.6, .3) });
}
/* H : « vous n'avez pas le choix » : tous désobéissent (reproduction récente) */
function sceneH(t) {
  const c = TIMING.cues; labBg(t);
  const k = Math.max(.01, pop(t, c.nuance, .4)); bubble(['« VOUS N\'AVEZ', 'PAS LE CHOIX. »'], 540, 470, 86, { scale: k, bg: L.coat, rot: -.02, tx: -80, tdx: 20, tl: 80 });
  person(540, 1250, 1.65, { coat: L.blue, hair: '#4a3420', worry: true });
  if (t > c.nuance + 2.2) { cross(860, 1130, pop(t, c.nuance + 2.2, .3), L.red); tag('ILS DÉSOBÉISSENT TOUS', 540, 1010, 64, { bg: L.amber, fg: L.ink, rot: .03, scale: pop(t, c.nuance + 2.2, .3) }); }
  tag('REPRODUCTION RÉCENTE', 340, 330, 46, { bg: L.paper, fg: L.ink, rot: -.04, scale: Math.max(.01, pop(t, c.nuance + .4, .3)) });
}
/* I : un doute : la moitié croyait aux chocs */
function sceneI(t) {
  const c = TIMING.cues; labBg(t, 1);
  const k = Math.max(.01, pop(t, c.doubt, .4)); ctx.save(); ctx.translate(540, 700); ctx.scale(k, k);
  paper(() => { ctx.beginPath(); ctx.arc(0, 0, 250, 0, TAU); }, L.grey, { sh: 16 }); paper(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 250, -Math.PI / 2, Math.PI / 2); ctx.closePath(); }, L.red, { sh: 0, edge: false });
  ctx.fillStyle = '#fff'; font(200); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('½', 0, 8); ctx.restore();
  tag('CROYAIT VRAIMENT AUX CHOCS', 540, 1090, 54, { bg: L.paper, fg: L.ink, rot: -.02, scale: pop(t, c.doubt + .8, .3) });
  tag('D\'APRÈS UNE ENQUÊTE DANS LES ARCHIVES', 540, 1190, 40, { bg: L.amber, fg: L.ink, rot: .02, scale: pop(t, c.doubt + 1.8, .3) });
}
/* J : qui décide ? et l'appel à commenter */
function sceneJ(t) {
  const c = TIMING.cues; labBg(t);
  const k = Math.max(.01, pop(t, c.fin, .4)); extruded('QUI DÉCIDE ?', 540, 420, 150, L.paper, L.blue, { depth: 13, rot: -.015, scale: k });
  if (t > c.fin + 3.2 && t < c.cta2) tag('UNE CAUSE IMPORTANTE ?', 540, 560, 56, { bg: L.amber, fg: L.ink, rot: .03, scale: pop(t, c.fin + 3.2, .3) });
  person(540, 1250, 1.7, { coat: L.blue, hair: '#4a3420', smile: t > c.cta2 });
  if (t >= c.cta2) { const kk = pop(t, c.cta2, .35); bubble(['COMMENTE !'], 690, 650, 84, { scale: kk, bg: L.red, fg: '#fff', rot: .03, tx: -120, tdx: -30, tl: 80 }); tag('TU AS APPRIS QUELQUE CHOSE ?', 540, 1160, 50, { bg: L.paper, fg: L.ink, rot: -.02, scale: pop(t, c.cta2 + .3, .3) }); }
}

/* ---------- orchestration ---------- */
function plan() {
  const c = TIMING.cues;
  return [{ t: 0, f: sceneA }, { t: c.lab - .1, f: sceneB, wipe: 1 }, { t: c.role - .1, f: sceneC, wipe: 1 }, { t: c.actor - .1, f: sceneD, wipe: 1 }, { t: c.pred - .1, f: sceneE, wipe: 1 }, { t: c.res - .1, f: sceneF, wipe: 1 }, { t: c.var - .1, f: sceneG, wipe: 1 }, { t: c.nuance - .1, f: sceneH, wipe: 1 }, { t: c.doubt - .1, f: sceneI, wipe: 1 }, { t: c.fin - .1, f: sceneJ, wipe: 1 }];
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
  labBg(0); panel(540, 1000, 880, 0, 30, { h: 300 });
  person(300, 1250, 1.8, { coat: L.coat, lapel: L.coat2, hair: '#6b6b6b' }); person(800, 1250, 1.5, { coat: L.blue, hair: '#4a3420', flip: true, worry: true });
  extruded('POURQUOI', 540, 300, 130, L.paper, L.blue, { depth: 12, rot: -.012 }); extruded('OBÉIT-ON ?', 540, 470, 170, L.amber, L.red, { depth: 14, rot: .01 });
  tag("L'EXPÉRIENCE DE MILGRAM", 540, 650, 54, { bg: L.red, fg: '#fff', rot: -.02, sh: 12 });
  grain();
}
