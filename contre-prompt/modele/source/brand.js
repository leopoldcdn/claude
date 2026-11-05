/* Identité Contre-Prompt : couleurs, marges de l'interface, personnages, bulles, appels à l'action, gabarit de couverture.
   Chargé après lib.js. Ne dépend d'aucun sujet. */
'use strict';
const BRAND = { name: 'CONTRE-PROMPT', accent: '#ff6a4d', accent2: '#ffc247', ink: '#0b2540', paper: '#fffdf5' };
/* Marges de l'interface Instagram (sur 1080×1920) : rien d'essentiel au-dessus de SAFE.top ni en dessous de SAFE.bottom ;
   la grille du profil montre le centre 3:4 (y de 240 à 1680) : le titre de couverture doit y tenir. Texte à comprendre : 50 px minimum. */
const SAFE = { top: 250, bottom: 1570, subtitleY: 1352, minText: 50, crop34: [240, 1680] };

/* ---------- personnages et objets de papier ---------- */
function person(x, y, s, o = {}) {      // y = pieds. o : coat, pants, hair, lapel, flip, rot, worry, smile, sweat
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); if (o.rot) ctx.rotate(o.rot);
  paper(() => rrect(-38, -78, 32, 78, 10), o.pants || BRAND.ink, { sh: 0, edge: false }); paper(() => rrect(6, -78, 32, 78, 10), o.pants || BRAND.ink, { sh: 0, edge: false });
  paper(() => rrect(-52, -228, 104, 160, 38), o.coat || '#2f62ad', { sh: 8 });
  if (o.lapel) { ctx.fillStyle = o.lapel; ctx.beginPath(); ctx.moveTo(-12, -226); ctx.lineTo(0, -170); ctx.lineTo(12, -226); ctx.closePath(); ctx.fill(); }
  paper(() => { ctx.beginPath(); ctx.arc(0, -276, 44, 0, TAU); }, '#f2c9a5', { sh: 6 });
  ctx.fillStyle = o.hair || BRAND.ink; ctx.beginPath(); ctx.arc(0, -282, 44, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
  ctx.fillStyle = BRAND.ink; ctx.beginPath(); ctx.arc(-15, -276, 5, 0, TAU); ctx.arc(15, -276, 5, 0, TAU); ctx.fill();
  ctx.strokeStyle = BRAND.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
  if (o.worry) { ctx.moveTo(-14, -250); ctx.quadraticCurveTo(0, -260, 14, -250); } else if (o.smile) { ctx.moveTo(-14, -255); ctx.quadraticCurveTo(0, -240, 14, -255); } else { ctx.moveTo(-12, -252); ctx.lineTo(12, -252); } ctx.stroke();
  if (o.sweat) { ctx.fillStyle = '#7ec8f0'; for (const [dx, dy, k] of [[-58, -300, 1], [60, -290, .8]]) { const yy = dy + ((T * 60 + dx) % 40); dropPath(dx, yy, 20 * k, 30 * k); ctx.fill(); } }
  ctx.restore();
}
function mini(x, y, s, col, on = 1) {      // petit personnage pour les grilles de « combien sur combien »
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= on;
  paper(() => rrect(-18, -34, 36, 46, 14), col, { sh: 4, edge: false }); paper(() => { ctx.beginPath(); ctx.arc(0, -46, 14, 0, TAU); }, col, { sh: 4, edge: false }); ctx.restore();
}
function bubble(lines, x, y, size, o = {}) {      // bulle de dialogue (o : scale, rot, bg, fg, tx, tdx, tl)
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); const k = o.scale == null ? 1 : o.scale; ctx.scale(k, k);
  font(size); const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + size * 1.1, h = lines.length * size * 1.1 + size * .8, tx = o.tx == null ? -w * .25 : o.tx;
  paper(() => { ctx.beginPath(); rrect(-w / 2, -h / 2, w, h, size * .55); ctx.moveTo(tx - 22, h / 2 - 2); ctx.lineTo(tx + (o.tdx == null ? -26 : o.tdx), h / 2 + (o.tl || 54)); ctx.lineTo(tx + 26, h / 2 - 2); ctx.closePath(); }, o.bg || BRAND.paper, { sh: 12 });
  ctx.fillStyle = o.fg || BRAND.ink; font(size); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, 0, -h / 2 + size * .4 + size * 1.1 * (i + .5) + size * .04));
  ctx.restore();
}
function bell(x, y, s, ring) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(T * 14) * .22 * ring); ctx.scale(s, s);
  paper(() => { ctx.beginPath(); ctx.moveTo(-46, 28); ctx.quadraticCurveTo(-46, -50, 0, -56); ctx.quadraticCurveTo(46, -50, 46, 28); ctx.closePath(); }, BRAND.accent2, { sh: 6 });
  paper(() => { ctx.beginPath(); ctx.arc(0, 38, 12, 0, TAU); }, BRAND.accent2, { sh: 0 }); ctx.restore();
}

/* ---------- appels à l'action : une étiquette par-dessus la scène en cours, sans nouvelle scène ---------- */
function ctaSubscribe(t, t0, y = 1050) {      // « Sur cette chaîne… abonne-toi » : au repère {cta1}
  if (t < t0) return; const k = pop(t, t0, .35); ctx.save(); ctx.translate(540, y); ctx.scale(k, k); ctx.rotate(-.025);
  paper(() => rrect(-380, -80, 760, 160, 40), BRAND.accent, { sh: 14 }); ctx.fillStyle = '#fff'; font(84); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ABONNE-TOI', 40, 4); ctx.restore(); bell(205, y, 1.2 * k, 1);
}
function ctaComment(t, t0, x = 690, y = 650) {      // « Tu as appris quelque chose ? Commente » : au repère {cta2}
  if (t < t0) return; const k = pop(t, t0, .35); bubble(['COMMENTE !'], x, y, 84, { scale: k, bg: BRAND.accent, fg: '#fff', rot: .03, tx: -120, tdx: -30, tl: 80 });
  tag('TU AS APPRIS QUELQUE CHOSE ?', 540, 1160, 50, { bg: BRAND.paper, fg: BRAND.ink, rot: -.02, scale: pop(t, t0 + .3, .3) });
}
function ctaSend(t, t0, x = 690, y = 650) {      // variante « Envoie-la à quelqu'un qui… » : au repère {cta2}
  if (t < t0) return; const k = pop(t, t0, .35); bubble(['ENVOIE-LA !'], x, y, 84, { scale: k, bg: BRAND.accent, fg: '#fff', rot: .03, tx: -120, tdx: -30, tl: 80 });
  tag('À QUELQU\'UN QUI DEVRAIT LE SAVOIR', 540, 1160, 46, { bg: BRAND.paper, fg: BRAND.ink, rot: -.02, scale: pop(t, t0 + .3, .3) });
}

/* ---------- couverture : même gabarit pour toutes les vidéos ----------
   coverTemplate({ kicker: 'POURQUOI', word: 'OBÉIT-ON ?', tagText: "L'EXPÉRIENCE DE MILGRAM", bg: () => {...}, illustration: () => {...} })
   Le titre reste entre y = 330 et y = 800 (dans le cadrage 3:4 de la grille) ; le mot-clé est GROS (lisible en miniature) ;
   un liseré d'accent et le nom de la chaîne sont toujours au même endroit. */
function coverTemplate(o) {
  setTime(.4); K = 7; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
  if (o.bg) o.bg(); else { ctx.fillStyle = '#cfe3ea'; ctx.fillRect(0, 0, W, H); }
  if (o.illustration) o.illustration();
  extruded(o.kicker, 540, 380, 110, BRAND.paper, o.shade || '#2f62ad', { depth: 11, rot: -.012 });
  extruded(o.word, 540, 560, o.wordSize || 190, o.wordColor || BRAND.accent2, BRAND.accent, { depth: 15, rot: .01 });
  if (o.tagText) tag(o.tagText, 540, 760, 52, { bg: BRAND.accent, fg: '#fff', rot: -.02, sh: 12 });
  ctx.save(); ctx.fillStyle = BRAND.accent; ctx.beginPath(); ctx.moveTo(0, 1546); ctx.lineTo(W, 1500); ctx.lineTo(W, 1680); ctx.lineTo(0, 1680); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#fff'; font(54); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(BRAND.name, 540, 1608);
  grain();
}
