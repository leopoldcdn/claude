/* Escapade — profil voyageur.
 * Enregistré seulement dans ce navigateur (localStorage), sans compte ni envoi à un serveur.
 * Il sert à pré-remplir « Où partir ? » et le formulaire d'itinéraire, et à personnaliser l'accueil
 * (salutation, coups de cœur choisis selon les envies et le climat aimé). */
import { I } from './icons.js';

let C = null;
export function initProfile(ctx) { C = ctx; }

const KEY = 'esc.web.profile';
export const ENVIES = [['plage', '🏖 Plage'], ['nature', '🌳 Nature'], ['montagne', '⛰ Montagne'], ['ski', '⛷ Ski'], ['culture', '🏛 Culture'], ['histoire', '🏺 Histoire'], ['villes', '🏙 Villes']];
const WITH = [['solo', 'Seul·e', 1], ['couple', 'En couple', 2], ['famille', 'En famille', 4], ['amis', 'Entre amis', 4]];
const CLIMATES = [['chaud', '☀️ Chaleur'], ['doux', '🌤 Douceur'], ['frais', '🍃 Fraîcheur'], ['', 'Peu importe']];
const PACES = [['calme', 'Tranquille'], ['equilibre', 'Équilibré'], ['intense', 'Intense']];
const MODES = [['auto', 'Propose-moi', 'sparkles'], ['car', 'Voiture', 'car'], ['transit', 'Train', 'train'], ['bus', 'Bus, car', 'bus']];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** Profil enregistré, ou null. */
export function getProfile() {
  const p = C?.LS.get(KEY, null);
  return p && typeof p === 'object' ? p : null;
}
export const firstName = () => (getProfile()?.name || '').trim();

/** Bouton de l'en-tête : l'initiale du prénom quand le profil existe. */
export function syncProfileButton() {
  const b = document.getElementById('bProfile'); if (!b) return;
  const n = firstName();
  b.innerHTML = n ? `<span class="avatar">${C.esc(n.charAt(0).toUpperCase())}</span>` : I.people;
  b.classList.toggle('on', !!getProfile());
  b.setAttribute('aria-label', n ? `Mon profil (${n})` : 'Créer mon profil');
  b.title = n ? `Mon profil : ${n}` : 'Créer mon profil voyageur';
}

export function openProfile() {
  const p = { name: '', age: '', with: 'couple', travelers: 2, from: '', likes: [], climate: '', budget: 2000, days: 7, pace: 'equilibre', mode: 'auto', ...(getProfile() || {}) };
  const isNew = !getProfile();
  const seg = (name, list, cur) => `<div class="seg" role="radiogroup">${list.map(([val, lab, ic]) => `<label><input type="radio" name="${name}" value="${val}" ${String(cur) === String(val) ? 'checked' : ''}><span>${ic && I[ic] ? I[ic] : ''}${lab}</span></label>`).join('')}</div>`;
  const stepper = (name, val, min, max, unit, unit1) => `<div class="stepper" data-stepper="${name}" data-min="${min}" data-max="${max}" data-u="${unit}" data-u1="${unit1 || unit}">
      <button type="button" data-d="-1" aria-label="Moins">${I.minus}</button><output><span>${val}</span><small>${val > 1 ? unit : unit1 || unit}</small></output><button type="button" data-d="1" aria-label="Plus">${I.plus}</button>
      <input type="hidden" name="${name}" value="${val}"></div>`;
  C.setPanel(`
    <div class="hero short prof-hero"><div class="kicker">${I.people} Profil voyageur</div>
      <h2>${isNew ? 'Dis-moi qui tu es' : `Bonjour ${C.esc(p.name || 'voyageur')}`}</h2>
      <div class="sub">Tes réponses pré-remplissent « Où partir ? » et tes itinéraires. Tout reste sur cet appareil.</div></div>
    <form class="planner" id="profForm" autocomplete="off">
      <div class="row2">
        <label class="fld"><span>Prénom</span><div class="textin">${I.people}<input type="text" name="name" maxlength="40" value="${C.esc(p.name)}" placeholder="Ton prénom"></div></label>
        <label class="fld"><span>Âge</span><div class="textin">${I.calendar}<input type="number" name="age" min="1" max="120" inputmode="numeric" value="${C.esc(String(p.age || ''))}" placeholder="—"></div></label>
      </div>
      <div class="fld"><span>Tu voyages</span>${seg('with', WITH, p.with)}</div>
      <div class="row2">
        <div class="fld"><span>Nombre de voyageurs</span>${stepper('travelers', p.travelers, 1, 8, 'personnes', 'personne')}</div>
        <label class="fld"><span>Ville de départ</span><div class="textin">${I.plane}<input type="text" name="from" value="${C.esc(p.from)}" placeholder="Paris, Lyon…"></div></label>
      </div>
      <div class="fld"><span>Ce que tu aimes</span><div class="chips">${ENVIES.map(([k, l]) => `<label class="chip"><input type="checkbox" name="likes" value="${k}" ${p.likes.includes(k) ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></div>
      <div class="fld"><span>Ton climat idéal</span>${seg('climate', CLIMATES, p.climate)}</div>
      <div class="fld"><div class="budget-val"><span>Budget habituel, vol compris</span><em><input type="number" name="budget" min="200" max="20000" step="50" value="${p.budget}" aria-label="Budget en euros"> €</em></div>
        <input type="range" id="profRange" min="300" max="10000" step="50" value="${Math.min(10000, p.budget)}" aria-label="Budget"></div>
      <div class="fld"><span>Durée habituelle</span>${stepper('days', p.days, 2, 30, 'jours', 'jour')}</div>
      <div class="fld"><span>Rythme</span>${seg('pace', PACES, p.pace)}</div>
      <div class="fld"><span>Pour te déplacer sur place</span>${seg('mode', MODES, p.mode)}</div>
      <p class="src">Ton profil est enregistré seulement dans ce navigateur : il n’est envoyé nulle part et tu peux l’effacer à tout moment.</p>
    </form>`,
    `${isNew ? '' : `<button class="btn icon" id="profDel" aria-label="Effacer mon profil" title="Effacer mon profil">${I.trash}</button>`}<button class="btn primary" id="profSave">${I.heart}${isNew ? 'Créer mon profil' : 'Enregistrer'}</button>`);

  const form = document.getElementById('profForm');
  form.querySelectorAll('[data-stepper]').forEach(st => st.querySelectorAll('button').forEach(b => b.onclick = () => {
    const inp = st.querySelector('input'), v = clamp(+inp.value + +b.dataset.d, +st.dataset.min, +st.dataset.max);
    inp.value = v; st.querySelector('output span').textContent = v;
    st.querySelector('output small').textContent = v > 1 ? st.dataset.u : st.dataset.u1;
  }));
  // « en couple » = 2, « seul·e » = 1… : le nombre de voyageurs suit, et reste modifiable
  form.querySelectorAll('input[name=with]').forEach(r => r.onchange = () => {
    const n = WITH.find(w => w[0] === r.value)?.[2]; const st = form.querySelector('[data-stepper=travelers]');
    if (!n || !st) return;
    st.querySelector('input').value = n; st.querySelector('output span').textContent = n; st.querySelector('output small').textContent = n > 1 ? 'personnes' : 'personne';
  });
  const range = document.getElementById('profRange'), num = form.budget;
  const paint = () => range.style.setProperty('--p', ((range.value - range.min) / (range.max - range.min) * 100) + '%');
  range.oninput = () => { num.value = range.value; paint(); };
  num.oninput = () => { range.value = clamp(+num.value || 0, 300, 10000); paint(); };
  paint();
  form.onsubmit = e => { e.preventDefault(); save(); };
  document.getElementById('profSave').onclick = save;
  const del = document.getElementById('profDel');
  if (del) del.onclick = () => {
    if (!confirm('Effacer ton profil de cet appareil ?')) return;
    localStorage.removeItem(KEY);
    syncProfileButton(); C.onChange?.(); C.toast('Profil effacé'); C.closePanel();
  };
}

function save() {
  const f = new FormData(document.getElementById('profForm'));
  const age = parseInt(f.get('age'), 10);
  const p = {
    name: String(f.get('name') || '').trim().slice(0, 40),
    age: age >= 1 && age <= 120 ? age : '',
    with: String(f.get('with') || 'couple'),
    travelers: clamp(+f.get('travelers') || 2, 1, 8),
    from: String(f.get('from') || '').trim(),
    likes: f.getAll('likes').map(String),
    climate: String(f.get('climate') || ''),
    budget: clamp(+f.get('budget') || 2000, 200, 20000),
    days: clamp(+f.get('days') || 7, 2, 30),
    pace: String(f.get('pace') || 'equilibre'),
    mode: String(f.get('mode') || 'auto'),
    saved: Date.now(),
  };
  C.LS.set(KEY, p);
  applyToForms(p);
  syncProfileButton(); C.onChange?.();
  C.toast(p.name ? `C’est noté, ${p.name} : tes recherches partent de ton profil` : 'Profil enregistré : tes recherches partent de ton profil');
  C.closePanel();
}

/** Recopie le profil dans les réglages mémorisés de « Où partir ? » et de l'itinéraire (ils restent modifiables ensuite). */
function applyToForms(p) {
  const common = { travelers: p.travelers, budget: p.budget, days: p.days };
  const from = p.from ? { from: p.from } : {};
  C.LS.set('esc.web.discover', { ...C.LS.get('esc.web.discover', {}), ...common, likes: p.likes, climate: p.climate, ...(p.from ? { fromName: p.from } : {}) });
  // l'itinéraire ne connaît pas le ski (ce n'est pas un type d'étape)
  C.LS.set('esc.web.plan', { ...C.LS.get('esc.web.plan', {}), ...common, ...from, pace: p.pace, mode: p.mode, likes: p.likes.filter(k => k !== 'ski') });
}
