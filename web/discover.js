/* Escapade — « Où partir en… ? »
 * On choisit un mois, une durée, un budget, une ville de départ et des envies ; chaque destination de
 * data/destinations.json (≈ 5 600 lieux, climat WorldClim mois par mois) reçoit une note et le globe s'allume.
 *
 * Note (0-100) = 45 % météo du mois + 35 % envies + 20 % budget (+ un peu de notoriété).
 *  - météo : confort de température (maximales) et de pluie (cumul mensuel) ; en ski, c'est le froid qui compte ;
 *  - envies : profil du lieu (plage, nature, montagne, culture, histoire, villes) ; la plage exige de la chaleur ;
 *  - budget : vol ou train aller-retour depuis la ville de départ + séjour selon le niveau des prix du pays.
 */
import { I } from './icons.js';

let C = null;
export function initDiscover(ctx) { C = ctx; }

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MOIS_C = ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
const ENVIES = [['plage', '🏖 Plage'], ['nature', '🌳 Nature'], ['montagne', '⛰ Montagne'], ['ski', '⛷ Ski'], ['culture', '🏛 Culture'], ['histoire', '🏺 Histoire'], ['villes', '🏙 Villes']];
const ZONES = [['', 'Partout'], ['EU', 'Europe'], ['AF', 'Afrique'], ['AM', 'Amériques'], ['AS', 'Asie'], ['OC', 'Océanie']];
const ZONE_NAME = { EU: 'Europe', AF: 'Afrique', AM: 'Amériques', AS: 'Asie', OC: 'Océanie' };
const PROFILE = { plage: 0, nature: 1, montagne: 2, culture: 3, histoire: 4, villes: 5 };
// Liste simplifiée des pays où les voyages sont déconseillés (conseils aux voyageurs du ministère français des Affaires
// étrangères, à vérifier avant tout départ) : exclus par défaut, avec une option pour les inclure.
export const ADVISED_AGAINST = new Set(['AF', 'BY', 'BF', 'CF', 'HT', 'IQ', 'IR', 'KP', 'LB', 'LY', 'ML', 'MM', 'NE', 'PS', 'RU', 'SD', 'SO', 'SS', 'SY', 'UA', 'VE', 'YE']);
const RAIL = new Set(['FR', 'DE', 'IT', 'ES', 'CH', 'AT', 'NL', 'BE', 'LU', 'GB', 'JP', 'KR', 'CN', 'TW', 'CZ', 'DK', 'SE', 'PT', 'PL', 'SK', 'HU', 'SI']);

let data = null, prices = null, state = null, results = [], timer = 0, from = null, thumbs = new Map();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ------------------------------------------------------------------ note */
const tempComfort = tx => tx >= 22 && tx <= 30 ? 1 : (tx >= 17 && tx < 22) || (tx > 30 && tx <= 33) ? 0.6 : (tx >= 12 && tx < 17) || (tx > 33 && tx <= 36) ? 0.3 : 0;
// cumul mensuel de pluie : sous 60 mm c'est sec, même sous les tropiques ; au-delà de 250 mm, saison des pluies
const rainComfort = mm => mm <= 60 ? 1 : mm <= 100 ? 0.8 : mm <= 160 ? 0.5 : mm <= 250 ? 0.25 : 0.05;
const warmth = tx => tx >= 26 ? 1 : tx >= 23 ? 0.7 : tx >= 20 ? 0.35 : 0.05;

function costOf(d, s) {
  const pl = prices[d[1]] ?? 0.6;
  const eff = 0.35 + 0.65 * pl;
  const nights = Math.max(1, s.days - 1), rooms = Math.ceil(s.travelers / 2);
  const stay = rooms * nights * 120 * eff + s.travelers * s.days * 70 * eff + s.travelers * s.days * 12 * (0.5 + 0.5 * pl);
  const km = from ? C.haversine(from.lat, from.lon, d[2], d[3]) : 1500;
  const ground = km < 500 || (km < 800 && RAIL.has(d[1]) && RAIL.has(from?.cc));
  const season = [6, 7, 11].includes(s.month) ? 1.25 : 1;
  const trip = ground ? 2 * (25 + km * 0.12) : (km < 3000 ? 120 + 0.075 * km : 200 + 0.06 * km) * season;
  const hours = ground ? km / 110 + 0.5 : km / 780 + 1.2;
  return { comfort: stay + trip * s.travelers, eco: stay * 0.6 + trip * s.travelers, km, hours, ground };
}
function score(d, s) {
  const m = s.month, tx = d[7][m], mm = d[8][m], prof = d[6];
  const p = k => +prof[PROFILE[k]] / 9;
  const ski = s.likes.includes('ski');
  // ski : relief marqué et froid (températures maximales de la cellule, qui tiennent compte de l'altitude)
  const skiOk = p('montagne') >= 0.65 && tx <= 3;
  // à la plage, la chaleur est recherchée : 24 à 34 °C conviennent
  const tc = s.likes.includes('plage') && !s.likes.some(k => k !== 'plage') ? (tx >= 24 && tx <= 34 ? 1 : tx >= 21 && tx <= 36 ? 0.6 : tempComfort(tx)) : tempComfort(tx);
  let w = 0.5 * tc + 0.5 * rainComfort(mm);
  if (ski) w = skiOk ? 0.9 : 0;
  const fame = Math.min(1, Math.log1p(d[4]) / Math.log(300));
  // sans envie : les lieux à la fois connus et attirants (plages, nature, montagne, culture, histoire autour)
  const attract = Math.max(p('plage') * warmth(tx), p('nature'), p('montagne'), p('culture'), p('histoire'));
  let e = 0.2 + 0.35 * fame + 0.45 * attract;
  if (s.likes.length) {
    const parts = s.likes.map(k => k === 'ski' ? (skiOk ? 1 : 0) : k === 'plage' ? p('plage') * warmth(tx) : p(k));
    // la meilleure envie compte double : un lieu n'a pas besoin de tout cocher
    e = (Math.max(...parts) * 2 + parts.reduce((a, b) => a + b, 0)) / (parts.length + 2);
  }
  const c = costOf(d, s);
  const b = c.comfort <= s.budget ? 1 : c.eco <= s.budget ? 0.6 : 0;
  const total = (0.45 * w + 0.35 * e + 0.2 * b + 0.08 * fame) / 1.08;   // 0 à 1
  return { total, w, e, b, cost: c, tx, mm };
}
let cheapest = 0, overBudget = {};
const zoneOf = d => C.continentOf?.(d[1]) || '';
function compute(s) {
  const out = [];
  cheapest = Infinity; overBudget = {};
  for (const d of data) {
    if (!s.risky && ADVISED_AGAINST.has(d[1])) continue;
    if (s.zone && zoneOf(d) !== s.zone) continue;
    if (from && C.haversine(from.lat, from.lon, d[2], d[3]) < 40) continue;      // pas la ville de départ elle-même
    const r = score(d, s);
    if (r.w < 0.45 || (s.likes.length && r.e < 0.25)) continue;
    if (r.b === 0) {
      // trop cher : on retient, par continent, combien de lieux sont écartés et à partir de quel budget
      cheapest = Math.min(cheapest, r.cost.eco);
      const z = zoneOf(d); (overBudget[z] ||= []).push(r.cost.eco);
      continue;
    }
    out.push({ d, ...r });
  }
  return diversify(out.sort((a, b) => b.total - a.total));
}
// La liste ne doit pas aligner Venise puis Chioggia à 25 km, ni dix villes du même pays : en tête de liste,
// 3 lieux au plus par pays et 80 km au moins entre deux lieux ; les autres suivent, dans l'ordre de la note.
function diversify(list, head = 30) {
  const top = [], rest = [], perCountry = {};
  for (const r of list) {
    const ok = top.length < head && (perCountry[r.d[1]] || 0) < 3
      && !top.some(t => C.haversine(t.d[2], t.d[3], r.d[2], r.d[3]) < 80);
    if (ok) { top.push(r); perCountry[r.d[1]] = (perCountry[r.d[1]] || 0) + 1; } else rest.push(r);
  }
  return top.concat(rest);
}

/* ------------------------------------------------------------------ interface */
function stepper(name, val, min, max, unit) {
  return `<div class="stepper" data-stepper="${name}" data-min="${min}" data-max="${max}">
    <button type="button" data-d="-1" aria-label="Moins">${I.minus}</button><output><span>${val}</span><small>${unit}</small></output><button type="button" data-d="1" aria-label="Plus">${I.plus}</button>
    <input type="hidden" name="${name}" value="${val}"></div>`;
}
const fmtE = v => (Math.round(v / 50) * 50).toLocaleString('fr-FR') + ' €';
const fmtH = h => h < 1.5 ? `${Math.round(h * 60 / 10) * 10} min` : `${Math.round(h)} h`;
const weatherTxt = (tx, mm) => `${tx >= 26 ? '☀️' : tx >= 18 ? '🌤' : tx >= 8 ? '⛅' : '❄️'} ${tx}° · ${mm <= 40 ? 'sec' : mm <= 100 ? 'peu de pluie' : mm <= 200 ? 'averses' : 'saison des pluies'}`;

export async function openDiscover(prefill = {}) {
  const saved = C.LS.get('esc.web.discover', {});
  const next = (new Date().getMonth() + 1) % 12;
  state = { month: next, days: 7, travelers: 2, budget: 2000, fromName: C.LS.get('esc.web.plan', {}).from || 'Paris', likes: [], zone: '', risky: false, ...saved, ...prefill };
  C.setPanel(`
    <div class="hero short disc-hero"><div class="kicker">${I.calendar} Où partir ?</div><h2 id="dTitle">En ${MOIS[state.month]}</h2>
      <div class="sub">Choisis tes envies : le globe s’allume sur les destinations idéales.</div></div>
    <form class="planner" id="discForm" autocomplete="off">
      <div class="fld"><span>Mois de départ</span><div class="months-pick">${MOIS_C.map((m, i) => `<label class="chip"><input type="radio" name="month" value="${i}" ${i === state.month ? 'checked' : ''}><span>${m}</span></label>`).join('')}</div></div>
      <div class="fld"><span>Où</span><div class="chips">${ZONES.map(([k, l]) => `<label class="chip"><input type="radio" name="zone" value="${k}" ${k === (state.zone || '') ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></div>
      <div class="fld"><span>Envies</span><div class="chips">${ENVIES.map(([k, l]) => `<label class="chip"><input type="checkbox" name="likes" value="${k}" ${state.likes.includes(k) ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></div>
      <details class="disc-more"><summary><span id="dSum"></span><b>Modifier</b></summary><div class="disc-more-in">
      <div class="row2">
        <div class="fld"><span>Durée</span>${stepper('days', state.days, 2, 30, 'jours')}</div>
        <div class="fld"><span>Voyageurs</span>${stepper('travelers', state.travelers, 1, 8, state.travelers > 1 ? 'personnes' : 'personne')}</div>
      </div>
      <div class="fld"><div class="budget-val"><span>Budget total, vol compris</span><em><input type="number" name="budget" min="200" max="20000" step="50" value="${state.budget}" aria-label="Budget en euros"> €</em></div>
        <input type="range" id="dRange" min="300" max="10000" step="50" value="${Math.min(10000, state.budget)}" aria-label="Budget"></div>
      <label class="fld"><span>Depuis</span><div class="textin">${I.plane}<input type="text" name="from" value="${C.esc(state.fromName)}" placeholder="Ta ville"></div></label>
      <label class="toggle"><input type="checkbox" name="risky" ${state.risky ? 'checked' : ''}><span></span>Inclure les pays où les voyages sont déconseillés</label>
      </div></details>
    </form>
    <div class="sec disc-res" id="dRes"><div class="skel" style="width:60%"></div><div class="skel" style="width:90%;height:70px;border-radius:16px"></div></div>`,
    `<button class="btn grow" id="dGlobe">${I.globe}Voir sur le globe</button>`);
  const form = document.getElementById('discForm');
  form.querySelectorAll('[data-stepper]').forEach(st => st.querySelectorAll('button').forEach(b => b.onclick = () => {
    const inp = st.querySelector('input'), out = st.querySelector('output span');
    const v = clamp(+inp.value + +b.dataset.d, +st.dataset.min, +st.dataset.max);
    inp.value = v; out.textContent = v;
    if (st.dataset.stepper === 'travelers') st.querySelector('output small').textContent = v > 1 ? 'personnes' : 'personne';
    changed();
  }));
  const range = document.getElementById('dRange'), num = form.budget;
  const paint = () => range.style.setProperty('--p', ((range.value - range.min) / (range.max - range.min) * 100) + '%');
  range.oninput = () => { num.value = range.value; paint(); changed(); };
  num.oninput = () => { range.value = clamp(+num.value || 0, 300, 10000); paint(); changed(); };
  paint();
  form.addEventListener('change', changed);
  form.from.addEventListener('input', () => changed(700));
  form.onsubmit = e => { e.preventDefault(); changed(0); };
  document.getElementById('dGlobe').onclick = () => { overview(); if (C.isMobile()) document.getElementById('panel').classList.add('peek'); };
  try {
    [data, prices] = await Promise.all([data || C.getJSON('data/destinations.json', { timeout: 30000 }), prices || C.getJSON('data/prices.json')]);
  } catch (e) {
    document.getElementById('dRes').innerHTML = `<div class="note warn">${I.warn}<span>Impossible de charger les destinations (${C.esc(e.message)}). Vérifie ta connexion.</span></div>`;
    return;
  }
  await update();
  overview();
}
function readForm() {
  const f = document.getElementById('discForm'); if (!f) return null;
  const fd = new FormData(f);
  return { month: +fd.get('month'), days: +fd.get('days'), travelers: +fd.get('travelers'), budget: Math.max(200, +fd.get('budget') || 2000),
    fromName: String(fd.get('from') || '').trim(), likes: fd.getAll('likes'), zone: String(fd.get('zone') || ''), risky: !!fd.get('risky') };
}
function changed(delay = 250) { clearTimeout(timer); timer = setTimeout(update, delay); }
async function update() {
  const s = readForm(); if (!s || !data) return;
  state = s;
  C.LS.set('esc.web.discover', s);
  document.getElementById('dTitle').textContent = `En ${MOIS[s.month]}`;
  document.getElementById('dSum').textContent = `${s.days} jours · ${s.travelers} pers. · ${s.budget.toLocaleString('fr-FR')} €${s.fromName ? ' · depuis ' + s.fromName : ''}`;
  if (s.fromName && (!from || from.q !== s.fromName)) {
    const g = await C.geocodeCity(s.fromName).catch(() => null);
    from = g ? { ...g, q: s.fromName } : null;
  } else if (!s.fromName) from = null;
  results = compute(s);
  render();
  draw();
  C.route?.('partir=' + encodeState(s));
}
const encodeState = s => [s.month, s.days, s.travelers, s.budget, s.likes.join('+'), s.risky ? 1 : 0, encodeURIComponent(s.fromName), s.zone || ''].join(',');
export function decodeState(str) {
  const [month, days, travelers, budget, likes, risky, fromName, zone] = str.split(',');
  return { month: +month, days: +days, travelers: +travelers, budget: +budget, likes: likes ? likes.split('+') : [], risky: risky === '1', fromName: decodeURIComponent(fromName || ''),
    zone: ZONE_NAME[zone] ? zone : '' };
}

// Les destinations lointaines écartées par le budget : on le dit, plutôt que de laisser croire qu'il n'y a rien ailleurs.
function budgetNote(s) {
  const zones = Object.entries(overBudget).filter(([z, c]) => z && c.length >= 3 && (s.zone || z !== (C.continentOf?.(from?.cc) || 'EU')))
    .sort((a, b) => Math.min(...a[1]) - Math.min(...b[1]));
  if (!zones.length) return '';
  const costs = zones.flatMap(([, c]) => c), n = costs.length, need = unlock(costs);
  const names = zones.map(([z]) => ZONE_NAME[z]).filter(Boolean);
  const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' et ' + names.at(-1) : names[0];
  const who = s.travelers > 1 ? `pour ${s.travelers} personnes` : 'pour une personne';
  return `<div class="note">${I.wallet}<span>${n.toLocaleString('fr-FR')} autres destinations (${list}) dépassent ton budget : les vols aller-retour ${who} pèsent lourd.
    ${budgetBtn(need)}</span></div>`;
}
// budget qui ouvre une dizaine de destinations de plus (pas une seule)
const unlock = costs => { const c = [...costs].sort((a, b) => a - b); return Math.ceil(c[Math.min(9, c.length - 1)] / 100) * 100; };
const budgetBtn = v => `<button type="button" class="linkbtn" data-budget="${v}">Voir à partir de ${fmtE(v)}</button>`;
function setBudget(v) {
  const f = document.getElementById('discForm'); if (!f) return;
  f.budget.value = v; const r = document.getElementById('dRange');
  if (r) { r.value = clamp(v, 300, 10000); r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); }
  changed(0);
}
function render() {
  const el = document.getElementById('dRes'); if (!el) return;
  const s = state, top = results.slice(0, 30);
  if (!top.length) {
    el.innerHTML = `<div class="empty">${I.calendar}<b>Aucune destination ne coche tout</b>${isFinite(cheapest)
      ? `Avec ces envies en ${MOIS[s.month]}${s.zone ? ' (' + ZONE_NAME[s.zone] + ')' : ''}, compte au moins <b style="display:inline;font:inherit;color:var(--acc)">${fmtE(cheapest)}</b> pour ${s.travelers} (niveau économique). ${budgetBtn(unlock(Object.values(overBudget).flat()))}`
      : 'Essaie un autre mois ou moins d’envies à la fois.'}</div>`;
    el.querySelector('[data-budget]')?.addEventListener('click', e => setBudget(+e.currentTarget.dataset.budget));
    return;
  }
  el.innerHTML = `<h3>${results.length > 30 ? `Les 30 meilleures sur ${results.length.toLocaleString('fr-FR')}` : `${results.length} destination${results.length > 1 ? 's' : ''}`} <small>pour ${s.travelers} · ${s.days} jours</small></h3>
    ${budgetNote(s)}
    <div class="list">${top.map((r, i) => {
      const d = r.d, flag = C.countryInfo(d[1])?.flag || '', tags = Object.keys(PROFILE).filter(k => +d[6][PROFILE[k]] >= 5).slice(0, 3);
      const th = thumbs.get(d[9]);
      return `<button class="row disc-row" data-i="${i}">
        ${th ? `<img class="th" src="${C.esc(th)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<span class="th">${flag || '📍'}</span>`}
        <span class="tx"><b>${C.esc(d[0])}</b><small>${flag} ${C.esc(C.countryInfo(d[1])?.name || d[1])} · ${weatherTxt(r.tx, r.mm)}</small>
          <small class="disc-meta">${r.cost.ground ? '🚆' : '✈'} ${fmtH(r.cost.hours)} · ≈ ${fmtE(r.b === 1 ? r.cost.comfort : r.cost.eco)}${r.b < 1 ? ' (économique)' : ''}${tags.length ? ' · ' + tags.join(', ') : ''}</small></span>
        <span class="disc-score" style="--s:${Math.round(r.total * 100)}">${Math.round(r.total * 100)}</span></button>`;
    }).join('')}</div>
    <p class="src">Climat : normales WorldClim 1970-2000 (températures maximales et pluie du mois). Coûts estimés selon le niveau des prix du pays et la distance, pas des prix réels. ${s.risky ? '' : 'Pays où les voyages sont déconseillés exclus (liste simplifiée : vérifie les <a href="https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/" target="_blank" rel="noopener">conseils aux voyageurs</a>).'}</p>`;
  el.querySelectorAll('.disc-row').forEach(b => b.onclick = () => openResult(top[+b.dataset.i]));
  el.querySelector('[data-budget]')?.addEventListener('click', e => setBudget(+e.currentTarget.dataset.budget));
  loadThumbs(top);
}
async function loadThumbs(top) {
  const titles = top.map(r => r.d[9]).filter(t => t && !thumbs.has(t)).slice(0, 30);
  if (!titles.length) return;
  try {
    const r = await C.getJSON('https://fr.wikipedia.org/w/api.php?format=json&formatversion=2&origin=*&redirects=1&action=query&prop=pageimages&piprop=thumbnail&pithumbsize=200&pilimit=50&titles=' + encodeURIComponent(titles.map(t => t.replace(/_/g, ' ')).join('|')));
    const alias = new Map();
    for (const x of [...(r.query?.normalized || []), ...(r.query?.redirects || [])]) alias.set(x.to, x.from);
    for (const p of r.query?.pages || []) {
      if (!p.thumbnail || !C.isTravelPhoto(p.thumbnail.source)) continue;
      let k = p.title; const keys = [k];
      for (let n = 0; n < 3 && alias.has(k); n++) { k = alias.get(k); keys.push(k); }
      for (const t of keys) thumbs.set(t.replace(/ /g, '_'), p.thumbnail.source);
    }
    for (const t of titles) if (!thumbs.has(t)) thumbs.set(t, '');
    render();
  } catch {}
}
function openResult(r) {
  const d = r.d;
  C.explore(d[2], d[3], { hint: d[0], label: d[0], zoom: d[5] === 'ile' || d[5] === 'parc' ? 9.5 : 11, fromDiscover: true });
}
export function backToResults() { openDiscover(state || {}); }

/* ------------------------------------------------------------------ globe */
const SRC = 'discover';
export function draw() {
  const map = C.map(); if (!map) return;
  // le style peut être prêt alors que des images chargent encore : on dessine dès que le style existe
  if (!map.style?._loaded) { map.once('style.load', draw); return; }
  const feats = results.slice(0, 250).map((r, i) => ({ type: 'Feature', properties: { i, name: r.d[0], s: Math.round(r.total * 100), top: i < 12 ? 1 : 0 },
    geometry: { type: 'Point', coordinates: [r.d[3], r.d[2]] } }));
  const data = { type: 'FeatureCollection', features: feats };
  if (map.getSource(SRC)) { map.getSource(SRC).setData(data); return; }
  map.addSource(SRC, { type: 'geojson', data });
  const before = map.getStyle().layers.find(l => l.type === 'symbol')?.id;
  const color = ['interpolate', ['linear'], ['get', 's'], 55, '#ffb547', 75, '#ffd166', 90, '#5fdba7'];
  map.addLayer({ id: 'disc-glow', type: 'circle', source: SRC, paint: { 'circle-color': color, 'circle-blur': 1,
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, ['+', 6, ['*', ['get', 'top'], 8]], 6, ['+', 16, ['*', ['get', 'top'], 14]]], 'circle-opacity': 0.55 } }, before);
  map.addLayer({ id: 'disc-dot', type: 'circle', source: SRC, paint: { 'circle-color': color, 'circle-stroke-color': '#fff', 'circle-stroke-width': ['case', ['==', ['get', 'top'], 1], 2, 1],
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, ['+', 2.5, ['*', ['get', 'top'], 2.5]], 6, ['+', 5, ['*', ['get', 'top'], 3]]] } });
  map.addLayer({ id: 'disc-label', type: 'symbol', source: SRC, filter: ['==', ['get', 'top'], 1],
    layout: { 'text-field': ['get', 'name'], 'text-font': ['Inter SemiBold'], 'text-size': 13, 'text-offset': [0, 1.1], 'text-anchor': 'top', 'text-optional': true },
    paint: { 'text-color': '#fff', 'text-halo-color': 'rgba(5,10,20,0.85)', 'text-halo-width': 1.6 } });
  map.on('click', 'disc-dot', e => { const f = e.features?.[0]; if (f) { e.originalEvent.stopPropagation(); e.preventDefault?.(); openResult(results[f.properties.i]); } });
  map.on('mouseenter', 'disc-dot', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'disc-dot', () => { map.getCanvas().style.cursor = ''; });
}
export function clearDiscover() {
  const map = C.map(); results = [];
  for (const id of ['disc-label', 'disc-dot', 'disc-glow']) if (map?.getLayer(id)) map.removeLayer(id);
  if (map?.getSource(SRC)) map.removeSource(SRC);
}
export const discoverActive = () => results.length > 0;
export function redrawDiscover() { if (results.length) { const r = results; clearDiscover(); results = r; draw(); } }
function overview() {
  const map = C.map(); const top = results.slice(0, 12); if (!top.length || !map) return;
  const lon = top.reduce((a, r) => a + r.d[3], 0) / top.length, lat = top.reduce((a, r) => a + r.d[2], 0) / top.length;
  map.flyTo({ center: [lon, clamp(lat, -50, 60)], zoom: C.isMobile() ? 1.1 : 1.9, pitch: 0, bearing: 0, padding: C.padding(), duration: 2400, essential: false });
}
/** Clic sur le globe pendant « Où partir » : true si le clic visait une destination allumée (déjà gérée). */
export function hitDestination(point) {
  const map = C.map();
  return !!(map?.getLayer('disc-dot') && map.queryRenderedFeatures([[point.x - 6, point.y - 6], [point.x + 6, point.y + 6]], { layers: ['disc-dot'] }).length);
}
