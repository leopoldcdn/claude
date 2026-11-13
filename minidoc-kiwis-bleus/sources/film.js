// Mini-doc « Pourquoi a-t-on les kiwis bleus ? » — animation en papier découpé.
// Chaque image est un SVG reconstruit à partir du temps t (déterministe).
const W = 1080, H = 1920, FPS = 30;
const C = {
  yel: '#FFC629', cream: '#F6EEDC', ink: '#1A1A1A', brown: '#8C6A3F', brownD: '#5E4526',
  green: '#8DC63F', greenD: '#5E9A1F', blue: '#2456F5', blueD: '#1637A8', red: '#E0263C',
  orange: '#E8590C', navy: '#14213D', kraft: '#C9A46C', kraftL: '#E2C592', kraftD: '#A9834C',
  white: '#FFFFFF', pink: '#E83F8C', teal: '#0E7C86', grey: '#B9B2A3',
};

// ---------- Texte de la voix off (say = ce qui est dit, show = sous-titre) ----------
const CPS = 16.5; // caractères par seconde, débit de lecture visé
const CUES = [
  { id: 'A1', sc: 'A', say: 'Les kiwis bleus :', show: ['Les *kiwis bleus* :'] },
  { id: 'A2', sc: 'A', say: 'tout le monde connaît.', show: ['tout le monde connaît.'] },
  { id: 'A3', sc: 'A', say: 'La science, presque pas.', show: ['La science,', '*presque pas.*'], p: 0.35 },
  { id: 'B1', sc: 'B', say: 'Les kiwis, vous voyez lesquels :', show: ['Les kiwis,', 'vous voyez lesquels :'] },
  { id: 'B2', sc: 'B', say: 'ceux qui vont par deux,', show: ['ceux qui vont *par deux*,'] },
  { id: 'B3', sc: 'B', say: 'sous la ceinture.', show: ['sous la ceinture.'], p: 0.35 },
  { id: 'C1', sc: 'C', say: 'Une excitation qui dure, qui dure,', show: ['Une excitation', 'qui dure, *qui dure*,'] },
  { id: 'C2', sc: 'C', say: "sans aller jusqu'au bout.", show: ["sans aller *jusqu'au bout*."] },
  { id: 'C3', sc: 'C', say: 'Puis une lourdeur, une gêne,', show: ['Puis une lourdeur,', 'une gêne,'] },
  { id: 'C4', sc: 'C', say: 'parfois une vraie douleur.', show: ['parfois une *vraie douleur*.'], p: 0.4 },
  { id: 'D1', sc: 'D', say: 'Rare ? Non.', show: ['Rare ? *Non.*'], p: 0.25 },
  { id: 'D2', sc: 'D', say: 'Dans un sondage en ligne,', show: ['Dans un sondage en ligne,'] },
  { id: 'D3', sc: 'D', say: "plus d'un homme sur deux", show: ["*plus d'un homme sur deux*"] },
  { id: 'D4', sc: 'D', say: "dit l'avoir déjà ressenti.", show: ["dit l'avoir déjà ressenti."] },
  { id: 'D5', sc: 'D', say: 'Souvent léger,', show: ['Souvent *léger*,'] },
  { id: 'D6', sc: 'D', say: 'et ça passe en quelques minutes.', show: ['et ça passe', 'en *quelques minutes*.'], p: 0.4 },
  { id: 'I1', sc: 'I', say: 'Seule alerte :', show: ['Seule alerte :'] },
  { id: 'I2', sc: 'I', say: 'une douleur brutale et forte.', show: ['une douleur', '*brutale et forte*.'] },
  { id: 'I3', sc: 'I', say: 'Là : urgences, tout de suite.', show: ['Là : *urgences*,', 'tout de suite.'], p: 0.4 },
  { id: 'E1', sc: 'E', say: 'Que se passe-t-il, là-dedans ?', show: ['Que se passe-t-il,', '*là-dedans ?*'] },
  { id: 'E2', sc: 'E', say: "L'hypothèse : le sang afflue,", show: ["L'*hypothèse* :", 'le sang afflue,'] },
  { id: 'E3', sc: 'E', say: 'puis repart au ralenti.', show: ['puis repart *au ralenti*.'] },
  { id: 'E4', sc: 'E', say: 'La pression monte.', show: ['La *pression* monte.'] },
  { id: 'E5', sc: 'E', say: 'Nom savant :', show: ['Nom savant :'] },
  { id: 'E6', sc: 'E', say: 'hypertension épididymaire.', show: ['*hypertension*', '*épididymaire.*'], p: 0.4 },
  { id: 'F1', sc: 'F', say: 'Et le bleu ?', show: ['Et le *bleu* ?'], p: 0.2 },
  { id: 'F2', sc: 'F', say: 'Les sources se contredisent :', show: ['Les sources', '*se contredisent* :'] },
  { id: 'F3', sc: 'F', say: 'léger reflet pour certaines,', show: ['léger reflet', 'pour certaines,'] },
  { id: 'F4', sc: 'F', say: "rien du tout pour d'autres.", show: ['*rien du tout*', "pour d'autres."], p: 0.4 },
  { id: 'G1', sc: 'G', say: 'La vraie surprise :', show: ['La vraie surprise :'] },
  { id: 'G2', sc: 'G', say: 'le dossier scientifique est presque vide.', show: ['le dossier scientifique', 'est *presque vide*.'], p: 0.2 },
  { id: 'G3', sc: 'G', say: 'Des entretiens.', show: ['Des *entretiens*.'], p: 0.25 },
  { id: 'G4', sc: 'G', say: 'Un cas décrit.', show: ['Un *cas décrit*.'], p: 0.25 },
  { id: 'G5', sc: 'G', say: "Un sondage en ligne. C'est à peu près tout.", show: ['Un *sondage en ligne*.', "C'est à peu près tout."], p: 0.2 },
  { id: 'G6', sc: 'G', say: 'Le mécanisme ? Jamais mesuré,', show: ['Le mécanisme ?', '*Jamais mesuré*,'] },
  { id: 'G6b', sc: 'G', say: "d'après les auteurs du sondage.", show: ["d'après les auteurs", 'du sondage.'] },
  { id: 'G7', sc: 'G', say: 'Le bleu ? Aucune preuve solide.', show: ['Le bleu ?', '*Aucune preuve solide.*'], p: 0.45 },
  { id: 'H1', sc: 'H', say: 'Dans ce sondage,', show: ['Dans ce sondage,'] },
  { id: 'H2', sc: 'H', say: 'quatre femmes sur dix racontent', show: ['*quatre femmes sur dix*', 'racontent'] },
  { id: 'H3', sc: 'H', say: "qu'on leur a mis la pression", show: ["qu'on leur a", '*mis la pression*'] },
  { id: 'H3b', sc: 'H', say: 'avec cet argument.', show: ['avec cet argument.'] },
  { id: 'H4', sc: 'H', say: 'Or ça passe tout seul.', show: ['Or ça passe *tout seul*.'] },
  { id: 'H5', sc: 'H', say: "Ce n'est donc jamais un argument.", show: ["Ce n'est donc", '*jamais un argument.*'], p: 0.45 },
  { id: 'J1', sc: 'J', say: 'Les kiwis bleus :', show: ['Les *kiwis bleus* :'] },
  { id: 'J2', sc: 'J', say: 'tout le monde connaît.', show: ['tout le monde connaît.'] },
  { id: 'J3', sc: 'J', say: 'La science, elle, commence à peine.', show: ['La science, elle,', '*commence à peine.*'], p: 0.3 },
  { id: 'K1', sc: 'J', say: '', show: [], d: 2.7 }, // appel à l'action à l'écran, sans voix
];
const T = {}; // début de chaque repère
const SC = {}; // début de chaque scène
let DUR = 0;
(function () {
  let t = 0;
  for (const c of CUES) {
    c.t0 = t;
    c.d = c.d != null ? c.d : Math.max(0.8, c.say.length / CPS) + (c.p || 0);
    c.sub = c.d - (c.p || 0);
    T[c.id] = t;
    if (SC[c.sc] == null) SC[c.sc] = t;
    t += c.d;
  }
  DUR = Math.ceil(t * FPS) / FPS;
})();
const SCENE_ORDER = ['A', 'B', 'C', 'D', 'I', 'E', 'F', 'G', 'H', 'J'];

// ---------- Outils ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, p) => a + (b - a) * p;
function hs(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
const rnd = (id, k = 0) => hs(id + '|' + k);
const step = (t, fps = 15) => Math.floor(t * fps + 1e-6) / fps; // animation « par à-coups »
const pr = (t, t0, d) => clamp((step(t) - t0) / d);
const on = (t, t0) => step(t) >= t0 - 1e-6;
const easeOut = (p) => 1 - Math.pow(1 - p, 3);
const back = (p) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const slam = (t, t0) => (on(t, t0) ? 1 + 0.9 * Math.pow(1 - pr(t, t0, 0.2), 2) : 0);
const pop = (t, t0, d = 0.27) => (on(t, t0) ? Math.max(0.05, back(pr(t, t0, d))) : 0);
function mix(c1, c2, p) {
  const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
  const ch = (s) => Math.round(lerp((a >> s) & 255, (b >> s) & 255, p));
  return '#' + ((1 << 24) + (ch(16) << 16) + (ch(8) << 8) + ch(0)).toString(16).slice(1);
}
let TNOW = 0;
function boil(id, amt = 1) {
  const k = Math.floor(TNOW * 7.5);
  return { r: (rnd(id, k) - 0.5) * 1.5 * amt, x: (rnd(id, k + 0.3) - 0.5) * 4 * amt, y: (rnd(id, k + 0.7) - 0.5) * 4 * amt };
}
// Groupe « morceau de papier » : position, rotation, échelle, tremblement, ombre portée
function G(id, x, y, o, inner) {
  o = o || {};
  const sc = o.sc == null ? 1 : o.sc;
  if (sc <= 0 || !inner) return '';
  const b = boil(id, o.boil == null ? 1 : o.boil);
  const sx = o.sx == null ? sc : o.sx * sc;
  return `<g transform="translate(${(x + b.x).toFixed(1)} ${(y + b.y).toFixed(1)}) rotate(${((o.rot || 0) + b.r).toFixed(2)}) scale(${sx.toFixed(3)} ${sc.toFixed(3)})"${o.sh === false ? '' : ' filter="url(#sh)"'}${o.op != null ? ` opacity="${o.op}"` : ''}>${inner}</g>`;
}
const mctx = document.createElement('canvas').getContext('2d');
function tw(txt, size, font = 'Anton', weight = 400) { mctx.font = `${weight} ${size}px "${font}"`; return mctx.measureText(txt).width; }
function capH(size, font = 'Anton', weight = 400) { mctx.font = `${weight} ${size}px "${font}"`; return mctx.measureText('H').actualBoundingBoxAscent; }
// Étiquette de papier avec texte
function chip(id, txt, cx, cy, size, o) {
  o = o || {};
  const font = o.font || 'Anton', wt = o.wt || 400;
  const padX = o.padX == null ? size * 0.3 : o.padX, padY = o.padY == null ? size * 0.2 : o.padY;
  const ch = capH(size, font, wt);
  const w = tw(txt, size, font, wt) + padX * 2, h = ch + padY * 2;
  const inner = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${o.rx == null ? 5 : o.rx}" fill="${o.bg || C.ink}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 6}"` : ''}/>` +
    `<text x="0" y="${ch / 2}" font-family="${font}" font-weight="${wt}" font-size="${size}" text-anchor="middle" fill="${o.fg || C.cream}">${esc(txt)}</text>`;
  return G(id, cx, cy, o, inner);
}
// Tampon encreur (lignes de texte, cadre, encre irrégulière), option fond papier
function stamp(id, lines, cx, cy, size, o) {
  o = o || {};
  const col = o.col || C.red, ch = capH(size), gap = size * 0.28;
  const w = Math.max(...lines.map((l) => tw(l, size))) + size * 0.7;
  const h = lines.length * ch + (lines.length - 1) * gap + size * 0.62;
  let tx = '';
  lines.forEach((l, i) => { tx += `<text x="0" y="${-h / 2 + size * 0.31 + ch + i * (ch + gap)}" font-family="Anton" font-size="${size}" text-anchor="middle" fill="${col}">${esc(l)}</text>`; });
  const sw = Math.max(8, size * 0.09);
  const inkG = `<g filter="url(#ink)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${size * 0.16}" fill="none" stroke="${col}" stroke-width="${sw}"/>${tx}</g>`;
  const pad = size * 0.28;
  const paper = o.paper ? `<rect x="${-w / 2 - pad}" y="${-h / 2 - pad}" width="${w + pad * 2}" height="${h + pad * 2}" rx="6" fill="${o.paper === true ? C.cream : o.paper}" filter="url(#sh)"/>` : '';
  return G(id, cx, cy, Object.assign({ sh: false }, o), paper + inkG);
}
// ---------- Personnages et objets ----------
function kiwiBody(id, blue) {
  const fill = mix(C.brown, C.blue, blue), dark = mix(C.brownD, C.blueD, blue), light = mix('#B08B55', '#6E92FF', blue);
  let fuzz = '';
  for (let i = 0; i < 64; i++) {
    const a = rnd(id, i) * Math.PI * 2, r = Math.sqrt(rnd(id, i + 100)) * 0.9;
    const x = Math.cos(a) * r * 132, y = Math.sin(a) * r * 168, L = 9 + rnd(id, i + 200) * 12, an = Math.PI / 2 + (rnd(id, i + 300) - 0.5) * 1.1;
    fuzz += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + Math.cos(an) * L).toFixed(1)}" y2="${(y + Math.sin(an) * L).toFixed(1)}" stroke="${i % 3 ? dark : light}" stroke-width="3.2" stroke-linecap="round" opacity="${i % 3 ? 0.45 : 0.6}"/>`;
  }
  return `<ellipse rx="162" ry="198" fill="${C.cream}"/><ellipse rx="148" ry="184" fill="${fill}"/>${fuzz}<ellipse cx="0" cy="-178" rx="20" ry="9" fill="${dark}"/>`;
}
function kiwiFace(face, look) {
  const lx = (look || 0) * 9;
  const eye = (x) => `<circle cx="${x}" cy="-34" r="29" fill="#fff"/><circle cx="${x + lx}" cy="-30" r="12.5" fill="${C.ink}"/>`;
  const shut = (x) => `<path d="M${x - 24} -30 Q${x} -52 ${x + 24} -30" fill="none" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/>`;
  const st = `fill="none" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"`;
  let m = '', e = eye(-50) + eye(50), br = '';
  if (face === 'happy') m = `<path d="M-34 38 Q0 74 34 38" ${st}/>`;
  else if (face === 'neutral') m = `<path d="M-26 48 L26 48" ${st}/>`;
  else if (face === 'oh') m = `<ellipse cx="0" cy="52" rx="17" ry="22" fill="${C.ink}"/>`;
  else if (face === 'worried') { m = `<path d="M-30 58 Q0 36 30 58" ${st}/>`; br = `<path d="M-80 -78 L-30 -66 M80 -78 L30 -66" ${st}/>`; }
  else if (face === 'pain') { e = `<path d="M-74 -52 L-30 -32 L-74 -14 M74 -52 L30 -32 L74 -14" ${st}/>`; m = `<path d="M-38 56 Q-19 36 0 56 Q19 76 38 56" ${st}/>`; }
  else if (face === 'relief') { e = shut(-50) + shut(50); m = `<path d="M-30 40 Q0 70 30 40" ${st}/>`; }
  else if (face === 'ask') { m = `<path d="M-22 54 Q0 44 22 54" ${st}/>`; br = `<path d="M-78 -74 L-30 -82 M78 -86 L30 -70" ${st}/>`; }
  return e + br + m;
}
function kiwi(id, x, y, s, o) {
  o = o || {};
  return G(id, x, y, { sc: s, rot: o.rot || 0, boil: o.boil }, kiwiBody(id, o.blue || 0) + kiwiFace(o.face || 'neutral', o.look));
}
function pair(id, x, y, s, o) {
  o = o || {};
  const bl = o.blueL == null ? (o.blue || 0) : o.blueL, brr = o.blueR == null ? (o.blue || 0) : o.blueR;
  return kiwi(id + 'L', x - 150 * s, y - 12 * s, s, { blue: bl, face: o.faceL || o.face, rot: -7, look: o.look == null ? 0.6 : o.look }) +
    kiwi(id + 'R', x + 150 * s, y + 14 * s, s, { blue: brr, face: o.faceR || o.face, rot: 7, look: o.look == null ? -0.6 : o.look });
}
function slice(id, x, y, r, o) {
  let seeds = '', rays = '';
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + 0.1;
    seeds += `<ellipse cx="${(Math.cos(a) * 0.5).toFixed(3)}" cy="${(Math.sin(a) * 0.5).toFixed(3)}" rx="0.035" ry="0.06" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(0)} ${(Math.cos(a) * 0.5).toFixed(3)} ${(Math.sin(a) * 0.5).toFixed(3)})" fill="${C.ink}"/>`;
    rays += `<line x1="${(Math.cos(a + 0.17) * 0.3).toFixed(3)}" y1="${(Math.sin(a + 0.17) * 0.3).toFixed(3)}" x2="${(Math.cos(a + 0.17) * 0.86).toFixed(3)}" y2="${(Math.sin(a + 0.17) * 0.86).toFixed(3)}" stroke="#C9E86B" stroke-width="0.03"/>`;
  }
  const inner = `<g transform="scale(${r})"><circle r="1.1" fill="${C.cream}"/><circle r="1" fill="${C.brown}"/><circle r="0.92" fill="${C.green}"/>${rays}<circle r="0.26" fill="#F4F1C9"/>${seeds}</g>`;
  return G(id, x, y, o || {}, inner);
}
function person(id, x, y, s, col, fillFrac, col2, o) {
  // pictogramme de signalétique, 120 x 230, origine au centre
  const shape = `<circle cx="0" cy="-86" r="27"/><path d="M-44 -50 Q-44 -56 -38 -56 L38 -56 Q44 -56 44 -50 L44 26 L30 26 L30 112 L4 112 L4 40 L-4 40 L-4 112 L-30 112 L-30 26 L-44 26 Z"/>`;
  const cid = 'cp' + id.replace(/\W/g, '');
  let inner = `<g stroke="${C.cream}" stroke-width="14" stroke-linejoin="round" fill="${C.cream}">${shape}</g><g fill="${col}">${shape}</g>`;
  if (fillFrac > 0) {
    const top = 116 - 232 * fillFrac;
    inner += `<clipPath id="${cid}"><rect x="-60" y="${top}" width="120" height="${116 - top}"/></clipPath><g fill="${col2}" clip-path="url(#${cid})">${shape}</g>`;
  }
  return G(id, x, y, Object.assign({ sc: s }, o || {}), inner);
}
function dymo(id, txt, cx, cy, size, o) {
  o = o || {};
  const w = tw(txt, size, 'JetBrains Mono', 800) + size * 0.9, h = size * 1.5;
  const inner = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="${o.bg || C.ink}"/><rect x="${-w / 2}" y="${-h / 2 + 5}" width="${w}" height="5" fill="#fff" opacity=".12"/>` +
    `<text x="0" y="${size * 0.36}" font-family="JetBrains Mono" font-weight="800" font-size="${size}" text-anchor="middle" fill="#fff">${esc(txt)}</text>`;
  return G(id, cx, cy, o, inner);
}
function bg(col, grid) {
  let g = `<rect width="${W}" height="${H}" fill="${col}"/>`;
  if (grid) { for (let x = 60; x < W; x += 120) g += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${grid}" stroke-width="2"/>`; for (let y = 60; y < H; y += 120) g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${grid}" stroke-width="2"/>`; }
  return g;
}
// Décor hors zones sûres (haut et bas de l'écran) : chutes de papier
function deco(id, cols) {
  let s = '';
  const pts = [[90, 120, 0], [330, 70, 1], [960, 150, 2], [730, 60, 0], [140, 1560, 1], [470, 1700, 2], [860, 1840, 0], [250, 1850, 1], [640, 1540, 2], [990, 1500, 1]];
  pts.forEach((p, i) => {
    const col = cols[p[2] % cols.length], r = 34 + rnd(id, i) * 44, rot = rnd(id, i + 50) * 360;
    const sh = i % 3 === 0 ? `<path d="M${-r} ${r * 0.8} L0 ${-r} L${r} ${r * 0.8} Z" fill="${col}"/>` : i % 3 === 1 ? `<rect x="${-r}" y="${-r * 0.55}" width="${r * 2}" height="${r * 1.1}" rx="8" fill="${col}"/>` : `<circle r="${r * 0.8}" fill="${col}"/>`;
    s += G(id + 'd' + i, p[0], p[1], { rot, boil: 0.6 }, sh);
  });
  s += slice(id + 'sl1', 820, 1650, 105, { rot: 12, boil: 0.6 }) + slice(id + 'sl2', 235, 1385 + 330, 70, { rot: -20, boil: 0.6 });
  return s;
}

// ---------- Scènes ----------
const SCN = {};

function titleBlock(id, t, t0) {
  return chip(id + 'les', 'LES', 248, 386, 96, { bg: C.ink, fg: C.cream, rot: -5, sc: pop(t, t0) }) +
    chip(id + 'kiw', 'KIWIS', 640, 402, 196, { bg: C.cream, fg: C.ink, rot: 2, sc: pop(t, t0 + 0.07) }) +
    chip(id + 'ble', 'BLEUS', 540, 616, 196, { bg: C.blue, fg: C.white, rot: -3, sc: pop(t, t0 + 0.14) });
}
SCN.A = (t) => {
  const q = (k) => t - (T[k] - SC.A);
  let s = bg(C.yel) + deco('A', [C.blue, C.cream, C.red]);
  const flip = 0.4, isBlue = on(t, flip);
  const ksc = isBlue ? 0.8 * (1 + 0.16 * Math.pow(1 - pr(t, flip, 0.2), 2)) : 0.8;
  if (isBlue && pr(t, flip, 0.34) < 1) { // éclats de papier au moment du changement de couleur
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2, d = 250 + pr(t, flip, 0.34) * 170; s += G('Ab' + i, 540 + Math.cos(a) * d, 900 + Math.sin(a) * d * 0.8, { rot: a * 57 }, `<rect x="-26" y="-9" width="52" height="18" rx="4" fill="${i % 2 ? C.blue : C.cream}"/>`); }
  }
  s += titleBlock('A', t, -1);
  s += pair('Ak', 540, 900, ksc, { blue: isBlue ? 1 : 0, face: isBlue ? 'oh' : 'neutral' });
  s += stamp('As1', ['CONNU DE TOUS'], 300, 1098, 62, { col: C.ink, rot: -5, sc: slam(t, q('A2') > 0 ? SCt('A', 'A2') + 0.25 : 99), paper: C.cream });
  s += stamp('As2', ['LA SCIENCE : ?'], 778, 1102, 62, { col: C.red, rot: 4, sc: slam(t, SCt('A', 'A3') + 0.3), paper: C.cream });
  return s;
};
function SCt(sc, cue) { return T[cue] - SC[sc]; }

SCN.B = (t) => {
  const c = (k) => SCt('B', k);
  let s = bg(C.cream, '#EADFC6') + deco('B', [C.yel, C.blue, C.green]);
  // pictogramme
  const man = `<g fill="${C.navy}"><circle cx="0" cy="-300" r="78"/><path d="M-128 -196 Q-128 -212 -112 -212 L112 -212 Q128 -212 128 -196 L128 60 L88 60 L88 330 L12 330 L12 96 L-12 96 L-12 330 L-88 330 L-88 60 L-128 60 Z"/></g>`;
  const drop = lerp(-60, 0, easeOut(pr(t, 0.07, 0.27)));
  if (on(t, 0.07)) s += G('Bman', 290, 700 + drop, { boil: 0.5 }, `<g stroke="${C.cream}" stroke-width="18" stroke-linejoin="round">${man}</g>` + man);
  // ceinture
  if (on(t, c('B3'))) s += G('Bbelt', 290, 742, { sc: slam(t, c('B3')), boil: 0.5 }, `<rect x="-138" y="-22" width="276" height="44" rx="6" fill="${C.yel}"/><rect x="-30" y="-30" width="60" height="60" rx="8" fill="${C.ink}"/><rect x="-16" y="-16" width="32" height="32" rx="4" fill="${C.yel}"/>`);
  // pointillés vers la loupe
  const pd = pr(t, c('B1') + 0.35, 0.5);
  if (pd > 0) { let d = ''; const n = Math.round(pd * 7); for (let i = 0; i < n; i++) { const p = i / 7; d += `<circle cx="${lerp(330, 520, p)}" cy="${lerp(800, 760, p) - Math.sin(p * Math.PI) * 40}" r="11" fill="${C.ink}"/>`; } s += d; }
  // loupe
  const lsc = pop(t, c('B1') + 0.75);
  if (lsc > 0) {
    s += G('Bloupe', 740, 700, { sc: lsc, boil: 0.5 }, `<rect x="150" y="150" width="70" height="230" rx="30" transform="rotate(-45 185 185)" fill="${C.ink}"/><circle r="262" fill="${C.ink}"/><circle r="232" fill="${C.yel}"/>`);
    if (lsc > 0.9) s += pair('Bk', 740, 705, 0.56, { face: on(t, c('B2')) ? 'happy' : 'neutral', look: 0 });
  }
  s += chip('Bc1', 'LES KIWIS', 740, 368, 104, { bg: C.ink, fg: C.cream, rot: 3, sc: pop(t, c('B1') + 0.95) });
  s += chip('Bc2', 'PAR DEUX', 760, 1040, 92, { bg: C.blue, fg: C.white, rot: -4, sc: slam(t, c('B2') + 0.15) });
  s += chip('Bc3', 'SOUS LA CEINTURE', 330, 1100, 60, { bg: C.yel, fg: C.ink, rot: -3, sc: pop(t, c('B3') + 0.25), stroke: C.ink, sw: 6 });
  return s;
};

SCN.C = (t) => {
  const c = (k) => SCt('C', k);
  let s = bg(C.yel) + deco('C', [C.red, C.cream, C.blue]);
  // jauge
  const rise = pr(t, 0.2, c('C2') - 0.3);
  const gh = 640, fill = gh * (0.12 + 0.88 * rise);
  s += G('Cg', 200, 760, { boil: 0.4 }, `<rect x="-62" y="${-gh / 2 - 14}" width="124" height="${gh + 28}" rx="62" fill="${C.cream}"/><rect x="-40" y="${gh / 2 - fill}" width="80" height="${fill}" rx="40" fill="${C.red}"/>` +
    [0.25, 0.5, 0.75].map((p) => `<rect x="20" y="${gh / 2 - gh * p}" width="40" height="8" fill="${C.ink}"/>`).join(''));
  s += chip('Cc0', 'EXCITATION', 270, 352, 76, { bg: C.ink, fg: C.cream, rot: -3, sc: pop(t, 0.1) });
  // horloge qui tourne (« qui dure, qui dure »)
  const ang = step(t, 10) * 420;
  s += G('Cclk', 490, 500, { sc: pop(t, 0.5), boil: 0.4 }, `<circle r="118" fill="${C.ink}"/><circle r="98" fill="${C.cream}"/><rect x="-7" y="-80" width="14" height="86" rx="7" fill="${C.ink}" transform="rotate(${ang})"/><rect x="-6" y="-56" width="12" height="60" rx="6" fill="${C.red}" transform="rotate(${ang / 12})"/><circle r="13" fill="${C.ink}"/>`);
  // stop
  const stp = slam(t, c('C2') + 0.2);
  if (stp > 0) { let oct = ''; for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; oct += `${i ? 'L' : 'M'}${(Math.cos(a) * 150).toFixed(1)} ${(Math.sin(a) * 150).toFixed(1)} `; } s += G('Cstop', 250, 600, { sc: stp, rot: -8 }, `<path d="${oct}Z" fill="${C.cream}"/><path d="${oct}Z" fill="${C.red}" transform="scale(.9)"/><text y="42" font-family="Anton" font-size="112" text-anchor="middle" fill="#fff">STOP</text>`); }
  // kiwis
  const heavy = on(t, c('C3'));
  const sag = heavy ? lerp(0, 96, easeOut(pr(t, c('C3'), 0.2))) : 0;
  const face = on(t, c('C4')) ? 'pain' : heavy ? 'worried' : on(t, c('C2')) ? 'ask' : 'neutral';
  s += pair('Ck', 800, 640 + sag, 0.56, { face, look: on(t, c('C2')) ? 0 : -1 });
  if (heavy) s += G('Canv', 800, 480 + sag, { sc: slam(t, c('C3')), boil: 0.5 }, `<path d="M-150 -50 L150 -50 L120 0 L60 14 L60 44 L110 70 L-110 70 L-60 44 L-60 14 L-120 0 Z" fill="${C.cream}"/><path d="M-132 -40 L132 -40 L112 -6 L48 8 L48 50 L88 60 L-88 60 L-48 50 L-48 8 L-112 -6 Z" fill="${C.ink}"/>`);
  s += chip('Cc1', 'LOURDEUR', 560, 945, 84, { bg: C.ink, fg: C.cream, rot: -4, sc: slam(t, c('C3') + 0.2) });
  s += chip('Cc2', 'GÊNE', 915, 960, 84, { bg: C.cream, fg: C.ink, rot: 5, sc: slam(t, c('C3') + 1.0) });
  s += chip('Cc3', 'DOULEUR', 720, 1092, 104, { bg: C.red, fg: C.white, rot: -2, sc: slam(t, c('C4') + 0.55) });
  return s;
};

function crowd(id, t, t0, col, col2, nFull, frac, tFill, y0) {
  let s = '';
  for (let i = 0; i < 10; i++) {
    const x = 200 + (i % 5) * 170, y = y0 + Math.floor(i / 5) * 252;
    const ap = t0 + i * 0.05;
    let f = 0;
    if (tFill != null) { const ti = tFill + i * 0.13; if (on(t, ti)) f = i < nFull ? 1 : i === nFull ? frac : 0; }
    s += person(id + i, x, y, pop(t, ap) * (f > 0 && pr(t, tFill + i * 0.13, 0.14) < 1 ? 1.12 : 1), col, f, col2, { boil: 0.6 });
  }
  return s;
}
SCN.D = (t) => {
  const c = (k) => SCt('D', k);
  let s = bg(C.cream, '#EADFC6') + deco('D', [C.yel, C.blue, C.red]);
  const part2 = on(t, c('D5'));
  if (!on(t, c('D2'))) {
    s += chip('Dr', 'RARE ?', 540, 560, 250, { bg: C.ink, fg: C.cream, rot: -4, sc: pop(t, 0.05) });
    s += stamp('Dn', ['NON.'], 600, 860, 220, { col: C.red, rot: 8, sc: slam(t, 0.62) });
  } else if (!part2) {
    s += stamp('Ds', ['SONDAGE EN LIGNE'], 540, 352, 76, { col: C.orange, rot: -3, sc: slam(t, c('D2') + 0.1) });
    s += crowd('Dp', t, c('D2') + 0.3, C.grey, C.blue, 5, 0.6, c('D3'), 560);
    s += chip('Dpc', '56 %', 330, 1065, 150, { bg: C.blue, fg: C.white, rot: -4, sc: slam(t, c('D3') + 0.75) });
    s += chip('Dre', 'DÉJÀ RESSENTI', 750, 1075, 70, { bg: C.ink, fg: C.cream, rot: 3, sc: pop(t, c('D4') + 0.15) });
  } else {
    s += chip('Dl', 'SOUVENT LÉGER', 540, 372, 124, { bg: C.green, fg: C.ink, rot: -3, sc: slam(t, c('D5') + 0.1) });
    s += pair('Dk', 400, 760, 0.62, { face: on(t, c('D6')) ? 'relief' : 'happy', look: 0.4 });
    // minuteur
    const tm = pop(t, c('D6') + 0.1), a = pr(t, c('D6') + 0.2, 1.6) * 300;
    s += G('Dtm', 830, 760, { sc: tm, boil: 0.4 }, `<rect x="-26" y="-190" width="52" height="46" rx="8" fill="${C.ink}"/><circle r="158" fill="${C.ink}"/><circle r="132" fill="${C.cream}"/><path d="M0 0 L0 -132 A132 132 0 ${a > 180 ? 1 : 0} 1 ${(Math.sin(a * Math.PI / 180) * 132).toFixed(1)} ${(-Math.cos(a * Math.PI / 180) * 132).toFixed(1)} Z" fill="${C.red}"/><rect x="-7" y="-120" width="14" height="126" rx="7" fill="${C.ink}" transform="rotate(${a})"/><circle r="16" fill="${C.ink}"/>`);
    s += chip('Dm', 'QUELQUES MINUTES', 540, 1078, 92, { bg: C.ink, fg: C.cream, rot: 2, sc: slam(t, c('D6') + 0.7) });
  }
  return s;
};

SCN.E = (t) => {
  const c = (k) => SCt('E', k);
  let s = bg(C.teal) + deco('E', [C.yel, C.cream, C.red]);
  if (!on(t, c('E2'))) {
    s += chip('Eq', 'LÀ-DEDANS ?', 540, 380, 170, { bg: C.cream, fg: C.ink, rot: -3, sc: pop(t, 0.08) });
    const z = 0.62 + 0.42 * easeOut(pr(t, 0.3, c('E2') - 0.5));
    s += kiwi('Ek0', 540, 800, z * 1.1, { face: 'ask', look: 0 });
    s += G('Elp', 540, 800, { sc: z, boil: 0.5, sh: false }, `<rect x="210" y="210" width="80" height="250" rx="36" transform="rotate(-45 250 250)" fill="${C.ink}"/><circle r="318" fill="none" stroke="${C.ink}" stroke-width="40"/>`);
    return s;
  }
  const named = on(t, c('E5'));
  const ky = 770, press = pr(t, c('E4'), 0.9);
  // tuyau d'arrivée (large, rouge)
  const inP = easeOut(pr(t, c('E2') + 0.25, 0.3));
  if (inP > 0) {
    let ch = ''; const off = (step(t, 10) * 260) % 110;
    for (let x = -80 + off; x < 440 * inP - 40; x += 110) ch += `<path d="M${x} -34 L${x + 34} 0 L${x} 34" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += G('Ein', 0, ky, { boil: 0.3 }, `<rect x="-30" y="-66" width="${450 * inP + 30}" height="132" fill="${C.cream}"/><rect x="-30" y="-52" width="${450 * inP + 20}" height="104" fill="${C.red}"/>${ch}`);
  }
  // tuyau de sortie (étroit), escargot
  const outP = easeOut(pr(t, c('E3') + 0.1, 0.3));
  if (outP > 0) {
    let ch = ''; const off = (step(t, 10) * 30) % 90;
    for (let x = 660 + off; x < 660 + 420 * outP - 20; x += 90) ch += `<path d="M${x} -12 L${x + 12} 0 L${x} 12" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`;
    s += G('Eout', 0, ky, { boil: 0.3 }, `<rect x="650" y="-30" width="${440 * outP}" height="60" fill="${C.cream}"/><rect x="650" y="-18" width="${440 * outP}" height="36" fill="${C.blueD}"/>${ch}`);
    const sx = 800 + step(t, 6) * 9 - c('E3') * 9;
    s += G('Esn', Math.min(sx, 980), ky - 62, { sc: pop(t, c('E3') + 0.4), boil: 0.5 }, `<path d="M-70 30 Q-70 6 -40 6 L60 6 Q84 6 84 30 Z" fill="${C.cream}"/><path d="M62 10 L80 -34 M74 10 L98 -26" stroke="${C.cream}" stroke-width="9" stroke-linecap="round"/><circle cx="-14" cy="-22" r="50" fill="${C.yel}"/><circle cx="-14" cy="-22" r="50" fill="none" stroke="${C.ink}" stroke-width="8"/><path d="M-14 -22 m-26 0 a26 26 0 1 1 26 26" fill="none" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/>`);
  }
  s += kiwi('Ek', 540, ky, 0.74 * (1 + 0.16 * press), { face: press > 0.3 ? 'pain' : on(t, c('E3')) ? 'worried' : 'oh', look: 0 });
  s += stamp('Eh', ['HYPOTHÈSE'], named ? 300 : 540, named ? 340 : 400, named ? 78 : 136, { col: C.orange, rot: -5, sc: named ? 1 : slam(t, c('E2') + 0.05), paper: C.cream });
  if (!named) {
    s += chip('El1', 'LE SANG AFFLUE', 205, 965, 56, { bg: C.red, fg: C.white, rot: -3, sc: pop(t, c('E2') + 0.7) });
    s += chip('El2', 'AU RALENTI', 870, 950, 62, { bg: C.blueD, fg: C.white, rot: 3, sc: pop(t, c('E3') + 0.55) });
  }
  // manomètre
  const dsc = pop(t, c('E4') + 0.05);
  if (dsc > 0 && !named) {
    const na = lerp(-80, 78, easeOut(press));
    s += G('Edial', 540, 1085, { sc: dsc, boil: 0.4 }, `<path d="M-150 0 A150 150 0 0 1 150 0 Z" fill="${C.ink}"/><path d="M-126 0 A126 126 0 0 1 126 0 Z" fill="${C.cream}"/><path d="M63 -109 A126 126 0 0 1 126 0 L0 0 Z" fill="${C.red}"/><rect x="-7" y="-112" width="14" height="118" rx="7" fill="${C.ink}" transform="rotate(${na})"/><circle r="17" fill="${C.ink}"/>`);
    s += chip('Epr', 'PRESSION', 540, 1140, 66, { bg: C.ink, fg: C.cream, rot: -2, sc: pop(t, c('E4') + 0.3) });
  }
  if (named) {
    s += chip('Ens', 'NOM SAVANT', 770, 348, 72, { bg: C.ink, fg: C.cream, rot: 3, sc: pop(t, c('E5') + 0.05) });
    s += dymo('Ed1', 'HYPERTENSION', 520, 985, 88, { rot: -3, sc: slam(t, c('E6') + 0.05) });
    s += dymo('Ed2', 'ÉPIDIDYMAIRE', 560, 1105, 88, { rot: -1.5, sc: slam(t, c('E6') + 0.55) });
  }
  return s;
};

SCN.F = (t) => {
  const c = (k) => SCt('F', k);
  let s = bg(C.yel) + deco('F', [C.blue, C.cream, C.red]);
  s += chip('Fa', 'ET LE', 235, 352, 110, { bg: C.ink, fg: C.cream, rot: -4, sc: pop(t, 0.05) });
  s += chip('Fb', 'BLEU ?', 665, 420, 200, { bg: C.blue, fg: C.white, rot: 3, sc: slam(t, 0.2) });
  let blue = 0.5;
  if (on(t, c('F4'))) blue = 0; else if (on(t, c('F3'))) blue = 0.55; else if (on(t, c('F2'))) blue = Math.floor(step(t, 5) * 5) % 2 ? 0.5 : 0.08;
  const ver = on(t, c('F4') + 0.95);
  const fbig = !on(t, c('F2'));
  s += pair('Fk', 540, fbig ? 830 : 715, fbig ? 0.78 : 0.5, { blue: ver ? 0.28 : blue, face: ver ? 'ask' : 'worried', look: on(t, c('F4')) ? 1 : on(t, c('F3')) ? -1 : 0 });
  const card = (id, x, title, l1, l2, t0, bump, col) => {
    const sl = on(t, t0) ? lerp(x < 540 ? -620 : 620, 0, easeOut(pr(t, t0, 0.27))) : 9999;
    const b = on(t, bump) && pr(t, bump, 0.2) < 1 ? -26 : 0;
    return G(id, x + sl, 1012 + b, { rot: x < 540 ? -3 : 3, boil: 0.5 }, `<rect x="-238" y="-146" width="476" height="292" rx="8" fill="${C.cream}"/><rect x="-238" y="-146" width="476" height="84" rx="8" fill="${col}"/><text x="0" y="-84" font-family="Anton" font-size="54" text-anchor="middle" fill="#fff">${title}</text><text x="0" y="6" font-family="Caveat" font-weight="700" font-size="74" text-anchor="middle" fill="${C.ink}">${l1}</text><text x="0" y="84" font-family="Caveat" font-weight="700" font-size="74" text-anchor="middle" fill="${C.ink}">${l2}</text>`);
  };
  s += card('Fc1', 268, 'HEALTHY MALE', 'parfois, une', 'légère teinte', c('F2') + 0.1, c('F3') + 0.1, C.blue);
  s += card('Fc2', 812, 'CLEVELAND CLINIC', 'ça ne devient', 'pas bleu', c('F2') + 0.35, c('F4') + 0.1, C.brownD);
  s += stamp('Fs', ['QUESTION', 'OUVERTE'], 540, 720, 108, { col: C.red, rot: -9, sc: slam(t, c('F4') + 0.95), paper: C.cream });
  return s;
};

SCN.G = (t) => {
  const c = (k) => SCt('G', k);
  let s = bg(C.navy) + deco('G', [C.yel, C.cream, C.red]);
  const fx = 540, fy = 740, fw = 900, fh = 780;
  const dy = on(t, 0.07) ? lerp(-140, 0, back(pr(t, 0.07, 0.3))) : -3000;
  const open = pr(t, c('G2') + 0.25, 0.34);
  // fond du dossier
  s += G('Gback', fx, fy + dy, { boil: 0.3 }, `<path d="M${-fw / 2} ${-fh / 2 - 56} L${-fw / 2 + 300} ${-fh / 2 - 56} L${-fw / 2 + 340} ${-fh / 2} L${fw / 2} ${-fh / 2} L${fw / 2} ${fh / 2} L${-fw / 2} ${fh / 2} Z" fill="${C.kraftD}"/><rect x="${-fw / 2 + 22}" y="${-fh / 2 + 22}" width="${fw - 44}" height="${fh - 44}" rx="6" fill="${C.kraftL}"/>`);
  if (open >= 1) {
    // papillon de nuit
    const mp = pr(t, c('G2') + 0.6, 1.5);
    if (mp > 0 && mp < 1) { const flap = Math.floor(step(t, 15) * 15) % 2 ? 1 : 0.35; s += G('Gmoth', 500 + mp * 420 + Math.sin(mp * 14) * 50, 800 - mp * 520 + Math.cos(mp * 11) * 40, { rot: 20, boil: 0 }, `<path d="M0 0 L-58 ${-52 * flap} L-44 ${24 * flap} Z M0 0 L58 ${-52 * flap} L44 ${24 * flap} Z" fill="${C.cream}"/><ellipse rx="9" ry="26" fill="${C.ink}"/>`); }
    if (!on(t, c('G3'))) s += chip('Gv', 'PRESQUE VIDE', 560, 760, 140, { bg: C.ink, fg: C.cream, rot: -5, sc: slam(t, c('G2') + 0.85) });
    const sheet = (id, y, year, txt, t0, rot, col) => {
      const sl = on(t, t0) ? lerp(1100, 0, easeOut(pr(t, t0, 0.27))) : 9999;
      return G(id, 560 + sl, y, { rot, boil: 0.5 }, `<rect x="-410" y="-92" width="820" height="184" rx="6" fill="${C.cream}"/><rect x="-386" y="-66" width="250" height="132" rx="6" fill="${col}"/><text x="-261" y="44" font-family="Anton" font-size="110" text-anchor="middle" fill="#fff">${year}</text><text x="-106" y="27" font-family="Anton" font-size="${txt.length > 15 ? 60 : 68}" fill="${C.ink}">${txt}</text>`);
    };
    s += sheet('Gs1', 500, '1954', 'DES ENTRETIENS', c('G3') + 0.1, -2.5, C.brownD);
    s += sheet('Gs2', 720, '2000', 'UN CAS DÉCRIT', c('G4') + 0.1, 2, C.blue);
    s += sheet('Gs3', 940, '2023', 'UN SONDAGE EN LIGNE', c('G5') + 0.1, -1.5, C.orange);
    s += stamp('Gt1', ['MÉCANISME :', 'JAMAIS MESURÉ'], 500, 600, 96, { col: C.red, rot: -6, sc: slam(t, c('G6') + 0.25), paper: C.cream });
    s += stamp('Gt2', ['LE BLEU :', 'AUCUNE PREUVE SOLIDE'], 580, 935, 80, { col: C.red, rot: 4, sc: slam(t, c('G7') + 0.25), paper: C.cream });
  }
  if (open < 1) {
    const sx = lerp(1, 0.06, easeOut(open));
    s += `<g transform="translate(${fx - fw / 2} ${fy + dy})">` + G('Gcov', 0, 0, { sx, boil: 0.2 }, `<rect x="0" y="${-fh / 2}" width="${fw}" height="${fh}" rx="8" fill="${C.kraft}"/><rect x="${fw / 2 - 350}" y="-190" width="700" height="350" rx="6" fill="${C.cream}"/><text x="${fw / 2}" y="-40" font-family="Anton" font-size="124" text-anchor="middle" fill="${C.ink}">DOSSIER</text><text x="${fw / 2}" y="104" font-family="Anton" font-size="112" text-anchor="middle" fill="${C.red}">SCIENTIFIQUE</text>`) + '</g>';
  }
  return s;
};

SCN.H = (t) => {
  const c = (k) => SCt('H', k);
  let s = bg(C.cream, '#EADFC6') + deco('H', [C.yel, C.pink, C.blue]);
  if (!on(t, c('H4'))) {
    s += stamp('Hs', ['MÊME SONDAGE'], 540, 352, 76, { col: C.orange, rot: -3, sc: slam(t, 0.1) });
    s += crowd('Hp', t, 0.25, C.grey, C.pink, 4, 0, c('H2'), 560);
    s += chip('Hn', '4 SUR 10', 540, 1040, 130, { bg: C.pink, fg: C.white, rot: -3, sc: on(t, c('H3')) ? 0 : slam(t, c('H2') + 0.6) });
    s += chip('Hq1', '« ON M\'A MIS', 440, 1010, 84, { bg: C.ink, fg: C.cream, rot: -3, sc: slam(t, c('H3') + 0.1) });
    s += chip('Hq2', 'LA PRESSION »', 640, 1110, 84, { bg: C.ink, fg: C.cream, rot: 2, sc: slam(t, c('H3') + 0.3) });
  } else {
    s += chip('Ht', 'ÇA PASSE TOUT SEUL', 540, 372, 104, { bg: C.green, fg: C.ink, rot: -3, sc: slam(t, c('H4') + 0.08) });
    const big = on(t, c('H5') + 0.2);
    s += pair('Hk', 540, 800, 0.72, { face: big ? 'oh' : 'relief', look: 0 });
    s += stamp('Hst', ['JAMAIS', 'UN ARGUMENT'], 540, 790, 158, { col: C.red, rot: -8, sc: slam(t, c('H5') + 0.2), paper: C.cream });
  }
  return s;
};

SCN.I = (t) => {
  const c = (k) => SCt('I', k);
  const fl = Math.floor(step(t, 6) * 6) % 2;
  let s = bg(C.red) + deco('I', [C.cream, C.yel, C.ink]);
  s += G('Itri', 540, 500, { sc: slam(t, 0.08), boil: 0.6 }, `<path d="M0 -210 L236 190 L-236 190 Z" fill="${C.ink}" stroke="${C.ink}" stroke-width="44" stroke-linejoin="round"/><path d="M0 -180 L206 172 L-206 172 Z" fill="${fl ? C.yel : C.cream}" stroke="${fl ? C.yel : C.cream}" stroke-width="22" stroke-linejoin="round"/><rect x="-22" y="-98" width="44" height="170" rx="20" fill="${C.ink}"/><circle cy="118" r="27" fill="${C.ink}"/>`);
  s += chip('Ia', 'DOULEUR BRUTALE', 540, 800, 104, { bg: C.cream, fg: C.ink, rot: -3, sc: slam(t, c('I2') + 0.1) });
  s += chip('Ib', 'ET FORTE', 540, 925, 104, { bg: C.cream, fg: C.ink, rot: 2, sc: slam(t, c('I2') + 0.75) });
  s += chip('Ic', '→ URGENCES', 540, 1082, 132, { bg: C.ink, fg: fl ? C.yel : C.white, rot: -2, sc: slam(t, c('I3') + 0.25) });
  return s;
};

SCN.J = (t) => {
  const c = (k) => SCt('J', k);
  const end = DUR - SC.J; // retour à l'image de départ dans les dernières images
  const cta = on(t, c('K1') + 0.05), back0 = on(t, end - 0.4);
  let s = bg(C.yel) + deco('A', [C.blue, C.cream, C.red]);
  s += titleBlock('A', t, 0.05);
  const blue = on(t, end - 0.2) ? 0 : 1;
  const ky = cta && !back0 ? 838 : 900, ks = cta && !back0 ? 0.5 : 0.8;
  s += pair('Ak', 540, ky, ks, { blue, face: blue ? (on(t, c('J3')) ? 'happy' : 'oh') : 'neutral' });
  if (!cta) {
    s += stamp('As1', ['CONNU DE TOUS'], 262, 1094, 62, { col: C.ink, rot: -5, sc: slam(t, c('J2') + 0.2), paper: C.cream });
    s += stamp('Js2', ['LA SCIENCE : À SUIVRE'], 775, 1108, 52, { col: C.red, rot: 4, sc: slam(t, c('J3') + 0.5), paper: C.cream });
  } else if (!back0) {
    const k = c('K1');
    s += chip('Jc1', 'ENVOIE ÇA À QUELQU\'UN', 540, 1012, 84, { bg: C.ink, fg: C.cream, rot: -2, sc: slam(t, k + 0.1) });
    s += chip('Jc2', 'QUI DIT ENCORE', 370, 1116, 66, { bg: C.cream, fg: C.ink, rot: 2, sc: slam(t, k + 0.35) });
    s += chip('Jc3', '« LES KIWIS BLEUS »', 600, 1216, 76, { bg: C.blue, fg: C.white, rot: -2, sc: slam(t, k + 0.6) });
  }
  return s;
};

// ---------- Sous-titres ----------
function subtitles(t) {
  let cue = null;
  for (const c of CUES) if (t >= c.t0 && t < c.t0 + c.sub && c.show.length) cue = c;
  if (!cue) return '';
  const size = 60, lh = 92, n = cue.show.length;
  let s = '';
  cue.show.forEach((ln, i) => {
    const parts = ln.split('*'); const plain = parts.join('');
    const w = tw(plain, size, 'Inter', 800) + 56, cy = 1290 + (i - (n - 1) / 2) * lh;
    let x = -w / 2 + 28, tx = '';
    parts.forEach((p, j) => { if (!p) return; tx += `<text x="${x}" y="${21}" font-family="Inter" font-weight="800" font-size="${size}" fill="${j % 2 ? C.yel : '#fff'}" xml:space="preserve">${esc(p)}</text>`; x += tw(p, size, 'Inter', 800); });
    const rot = (rnd(cue.id, i) - 0.5) * 2.4;
    s += `<g transform="translate(500 ${cy}) rotate(${rot.toFixed(2)})" filter="url(#sh)"><rect x="${-w / 2}" y="-42" width="${w}" height="84" rx="6" fill="${C.ink}"/>${tx}</g>`;
  });
  return s;
}

// ---------- Rendu d'une image ----------
const DEFS = `<defs>
<filter id="sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="6" dy="11" stdDeviation="6" flood-color="#000" flood-opacity=".32"/></filter>
<filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.045 0.07" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.7 1.95" result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/></filter>
<pattern id="grain" width="512" height="512" patternUnits="userSpaceOnUse"><image href="assets/grain.png" width="512" height="512"/></pattern>
</defs>`;
function sceneAt(t) { let k = 'A'; for (const s of SCENE_ORDER) if (t >= SC[s] - 1e-6) k = s; return k; }
function frameSVG(t) {
  TNOW = t;
  const k = sceneAt(t), i = SCENE_ORDER.indexOf(k), lt = t - SC[k];
  let body;
  const TR = 0.2; // transition : la nouvelle feuille glisse par-dessus l'ancienne
  if (i > 0 && lt < TR) {
    const pk = SCENE_ORDER[i - 1];
    const p = easeOut(pr(t, SC[k], TR)), dir = i % 3;
    const off = (1 - p);
    const tr = dir === 0 ? `translate(${W * off} 0)` : dir === 1 ? `translate(0 ${H * off})` : `translate(${-W * off} 0)`;
    body = SCN[pk](SC[k] - SC[pk] - 0.001) + `<g transform="${tr} rotate(${(off * 3).toFixed(2)} 540 960)"><g filter="url(#sh)"><rect width="${W}" height="${H}" fill="#000"/></g>${SCN[k](lt)}</g>`;
  } else body = SCN[k](lt);
  const gk = Math.floor(t * 7.5);
  const grain = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#grain)" transform="translate(${Math.round(rnd('g', gk) * 400 - 200)} ${Math.round(rnd('g', gk + 0.5) * 400 - 200)})" style="mix-blend-mode:multiply" opacity=".85"/>`;
  return DEFS + body + subtitles(t) + grain;
}
window.renderAt = (t) => { document.getElementById('stage').innerHTML = frameSVG(t); };
window.renderFrame = (n) => window.renderAt(n / FPS);
window.INFO = () => ({ DUR, frames: Math.round(DUR * FPS), T, SC, cues: CUES.map((c) => ({ id: c.id, sc: c.sc, say: c.say, show: c.show, t0: c.t0, d: c.d, sub: c.sub })) });
// Liste des bruitages (temps, type), exportée pour la piste son
window.SFX = () => {
  const e = [], a = (k, off, type, g) => e.push({ t: +(T[k] + (off || 0)).toFixed(3), type, g: g || 1 });
  SCENE_ORDER.slice(1).forEach((s) => e.push({ t: +SC[s].toFixed(3), type: 'whoosh', g: 1 }));
  a('A1', 0.4, 'pop'); a('A2', 0.25, 'stamp'); a('A3', 0.3, 'stamp');
  a('B1', 0.75, 'pop'); a('B2', 0.15, 'stamp', 0.7); a('B3', 0, 'tap'); a('B3', 0.25, 'pop', 0.6);
  a('C1', 0.5, 'tick'); a('C1', 0.9, 'tick'); a('C1', 1.3, 'tick'); a('C1', 1.7, 'tick'); a('C2', 0.2, 'stamp'); a('C3', 0, 'thud'); a('C3', 0.2, 'tap'); a('C3', 1.0, 'tap'); a('C4', 0.55, 'stamp');
  a('D1', 0.05, 'pop'); a('D1', 0.62, 'stamp'); a('D2', 0.1, 'stamp', 0.7); for (let i = 0; i < 6; i++) a('D3', i * 0.13, 'tap', 0.8); a('D3', 0.75, 'stamp'); a('D4', 0.15, 'pop', 0.6); a('D5', 0.1, 'stamp', 0.8); a('D6', 0.1, 'pop'); a('D6', 0.7, 'stamp', 0.8); a('D6', 1.8, 'ding');
  a('E1', 0.08, 'pop'); a('E2', 0.05, 'stamp'); a('E2', 0.7, 'pop', 0.6); a('E3', 0.55, 'pop', 0.6); a('E4', 0.05, 'rise'); a('E5', 0.05, 'pop', 0.6); a('E6', 0.05, 'stamp'); a('E6', 0.55, 'stamp');
  a('F1', 0.2, 'stamp'); a('F2', 0.1, 'tap'); a('F2', 0.35, 'tap'); a('F3', 0.1, 'pop', 0.6); a('F4', 0.1, 'pop', 0.6); a('F4', 0.95, 'stamp');
  a('G1', 0.1, 'thud'); a('G2', 0.25, 'paper'); a('G2', 0.85, 'stamp'); a('G3', 0.1, 'paper'); a('G4', 0.1, 'paper'); a('G5', 0.1, 'paper'); a('G6', 0.25, 'stamp'); a('G7', 0.25, 'stamp');
  a('H1', 0.1, 'stamp', 0.7); for (let i = 0; i < 4; i++) a('H2', i * 0.13, 'tap', 0.8); a('H2', 0.6, 'stamp', 0.8); a('H3', 0.1, 'stamp', 0.7); a('H3', 0.3, 'stamp', 0.7); a('H4', 0.08, 'stamp', 0.8); a('H5', 0.2, 'stamp', 1.2);
  a('I1', 0.08, 'stamp'); a('I1', 0.08, 'alarm'); a('I2', 0.1, 'stamp', 0.8); a('I2', 0.75, 'stamp', 0.8); a('I3', 0.25, 'stamp', 1.1);
  a('J1', 0.05, 'pop'); a('J2', 0.2, 'stamp'); a('J3', 0.5, 'stamp'); a('K1', 0.1, 'stamp', 0.8); a('K1', 0.35, 'stamp', 0.7); a('K1', 0.6, 'stamp', 0.8);
  e.push({ t: +(DUR - 0.2).toFixed(3), type: 'pop', g: 0.7 });
  return e.sort((x, y) => x.t - y.t);
};
Promise.all(['400 100px Anton', '700 60px Caveat', '800 60px Inter', '800 60px "JetBrains Mono"'].map((f) => document.fonts.load(f, 'ÉÀéÇ kiwis 1954'))).then(() => { window.READY = true; });

// ---------- Couverture (image fixe 1080 x 1920, titre dans le cadrage 3:4 de la grille) ----------
window.renderCover = () => {
  TNOW = 0.5;
  let s = bg(C.yel) + deco('A', [C.blue, C.cream, C.red]);
  s += chip('cv1', 'POURQUOI A-T-ON', 540, 395, 118, { bg: C.ink, fg: C.cream, rot: -3 });
  s += chip('cv2', 'LES KIWIS', 540, 610, 200, { bg: C.cream, fg: C.ink, rot: 2 });
  s += chip('cv3', 'BLEUS ?', 540, 870, 250, { bg: C.blue, fg: C.white, rot: -3 });
  s += pair('cvk', 540, 1180, 0.66, { blue: 1, face: 'oh', look: 0 });
  s += stamp('cvs', ['DOSSIER MÉDICAL :', 'PRESQUE VIDE'], 540, 1475, 86, { col: C.red, rot: -4, paper: C.cream });
  const grain = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#grain)" style="mix-blend-mode:multiply" opacity=".85"/>`;
  document.getElementById('stage').innerHTML = DEFS + s + grain;
};
