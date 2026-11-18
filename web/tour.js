/* Escapade — survol d'un itinéraire.
 * La caméra vole d'étape en étape et, en bas de l'écran, une bande de photos défile pour donner
 * un aperçu de chaque étape (la ville et les visites prévues), avec la progression du voyage.
 * Contrôles : pause / lecture, étape précédente / suivante, arrêt (Espace, ← →, Échap). */
import { I } from './icons.js';

const WIKI = 'https://fr.wikipedia.org/w/api.php?format=json&formatversion=2&origin=*&redirects=1&';
const STAGE_MS = 9000;          // durée d'une étape
const FLY_MS = 3000;            // vol de la caméra au début de l'étape
const isPhoto = u => u && /\.jpe?g/i.test(u);

let T = null;                   // survol en cours

/* ------------------------------------------------------------------ photos */
async function pageImages(C, titles, signal) {
  const out = new Map();
  const uniq = [...new Set(titles.filter(Boolean))];
  for (let i = 0; i < uniq.length; i += 40) {
    const chunk = uniq.slice(i, i + 40);
    const r = await C.getJSON(WIKI + `action=query&prop=pageimages|description&piprop=thumbnail&pithumbsize=720&pilimit=50&titles=${encodeURIComponent(chunk.join('|'))}`, { signal });
    const alias = new Map();
    for (const x of [...(r.query?.normalized || []), ...(r.query?.redirects || [])]) alias.set(x.to, x.from);
    for (const p of r.query?.pages || []) {
      if (!isPhoto(p.thumbnail?.source)) continue;
      const v = { src: p.thumbnail.source, desc: p.description || '' };
      out.set(p.title, v);
      let k = p.title; for (let n = 0; n < 3 && alias.has(k); n++) { k = alias.get(k); out.set(k, v); }
    }
  }
  return out;
}
async function nearbyImages(C, s, signal) {
  const r = await C.getJSON(WIKI + `action=query&generator=geosearch&ggscoord=${s.lat}|${s.lon}&ggsradius=10000&ggslimit=30&prop=pageimages|description|coordinates&piprop=thumbnail&pithumbsize=720&pilimit=30`, { signal });
  return (r.query?.pages || []).filter(p => isPhoto(p.thumbnail?.source))
    .map(p => ({ src: p.thumbnail.source, title: p.title, desc: p.description || '', lat: p.coordinates?.[0]?.lat, lon: p.coordinates?.[0]?.lon }));
}
async function collect(C, trip, signal) {
  const stages = trip.stops.map((s, i) => {
    const items = trip.days.filter(d => d.stop === i).flatMap(d => d.items).filter(it => it.lat != null && it.name);
    return { stop: s, i, items };
  });
  const titles = stages.flatMap(st => [st.stop.p?.[8]?.replace(/_/g, ' '), st.stop.name, ...st.items.map(it => it.wiki?.replace(/_/g, ' ') || it.name)]);
  const imgs = await pageImages(C, titles, signal).catch(() => new Map());
  await Promise.all(stages.map(async st => {
    const list = [];
    const seen = new Set();
    const add = x => { if (x && !seen.has(x.src)) { seen.add(x.src); list.push(x); } };
    const own = imgs.get(st.stop.p?.[8]?.replace(/_/g, ' ')) || imgs.get(st.stop.name);
    if (own) add({ ...own, title: st.stop.name, lat: st.stop.lat, lon: st.stop.lon, main: true });
    for (const it of st.items) {
      const im = imgs.get(it.wiki?.replace(/_/g, ' ')) || imgs.get(it.name);
      if (im) add({ ...im, title: it.name, lat: it.lat, lon: it.lon });
    }
    if (list.length < 5) {
      const more = await nearbyImages(C, st.stop, signal).catch(() => []);
      for (const m of more) { if (list.length >= 8) break; add(m); }
    }
    st.photos = list;
  }));
  return stages;
}

/* ------------------------------------------------------------------ interface */
function bar() {
  let el = document.getElementById('tourbar');
  if (!el) {
    el = document.createElement('div');
    el.id = 'tourbar';
    el.className = 'glass-strong';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Survol de l’itinéraire');
    document.body.appendChild(el);
  }
  return el;
}
function renderShell(C) {
  const n = T.stages.length;
  bar().innerHTML = `
    <div class="tb-prog">${T.stages.map((_, i) => `<span><i></i></span>`).join('')}</div>
    <div class="tb-body">
      <div class="tb-info">
        <div class="tb-step"><b class="tb-num">1</b><span class="tb-count">Étape 1 / ${n}</span></div>
        <h3 class="tb-name"></h3>
        <p class="tb-sub"></p>
        <div class="tb-ctrl">
          <button class="round" data-a="prev" aria-label="Étape précédente" title="Étape précédente (←)">${I.back}</button>
          <button class="round tb-play" data-a="play" aria-label="Pause" title="Pause (Espace)"></button>
          <button class="round" data-a="next" aria-label="Étape suivante" title="Étape suivante (→)">${I.next}</button>
          <button class="round" data-a="stop" aria-label="Arrêter le survol" title="Arrêter (Échap)">${I.close}</button>
        </div>
      </div>
      <div class="tb-strip"><div class="tb-track"></div></div>
    </div>`;
  const b = bar();
  b.querySelector('[data-a=prev]').onclick = () => go(C, T.idx - 1);
  b.querySelector('[data-a=next]').onclick = () => go(C, T.idx + 1);
  b.querySelector('[data-a=play]').onclick = () => (T.paused ? resume(C) : pause(C));
  b.querySelector('[data-a=stop]').onclick = () => stopTour(C);
  syncPlay();
  requestAnimationFrame(() => b.classList.add('show'));
}
function syncPlay() {
  const b = bar().querySelector('.tb-play');
  if (!b || !T) return;
  b.innerHTML = T.paused ? I.play : `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="3.6" height="14" rx="1.2"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.2"/></svg>`;
  b.setAttribute('aria-label', T.paused ? 'Lecture' : 'Pause');
  bar().classList.toggle('paused', T.paused);
}
function renderStage(C) {
  const st = T.stages[T.idx], b = bar();
  const nights = st.stop.nights, visits = st.items.length;
  b.querySelector('.tb-num').textContent = st.i + 1;
  b.querySelector('.tb-count').textContent = `Étape ${st.i + 1} / ${T.stages.length}`;
  b.querySelector('.tb-name').textContent = st.stop.name;
  b.querySelector('.tb-sub').textContent = `${nights} nuit${nights > 1 ? 's' : ''}${visits ? ` · ${visits} visite${visits > 1 ? 's' : ''}` : ''}`;
  const strip = b.querySelector('.tb-strip');
  const old = strip.querySelector('.tb-track');
  const track = document.createElement('div');
  track.className = 'tb-track entering';
  track.innerHTML = st.photos.length
    ? st.photos.map((p, k) => `<button class="tb-ph${p.main ? ' main' : ''}" data-k="${k}" title="${C.esc(p.title)}${p.desc ? ' — ' + C.esc(p.desc) : ''}">
        <img src="${C.esc(p.src)}" alt="" loading="eager" referrerpolicy="no-referrer"><span>${C.esc(p.title)}</span></button>`).join('')
    : `<div class="tb-empty">${I.image}<span>Pas de photo trouvée pour cette étape</span></div>`;
  strip.appendChild(track);
  track.querySelectorAll('.tb-ph').forEach(btn => btn.onclick = () => {
    const p = st.photos[+btn.dataset.k];
    pause(C);
    if (p.lat != null) C.map().flyTo({ center: [p.lon, p.lat], zoom: 15.5, pitch: 60, padding: pad(), duration: 2200, essential: true });
  });
  requestAnimationFrame(() => track.classList.remove('entering'));
  if (old) { old.classList.add('leaving'); setTimeout(() => old.remove(), 600); }
  b.querySelectorAll('.tb-prog span').forEach((s, i) => s.classList.toggle('done', i < T.idx));
  T.track = track;
}
const pad = () => (innerWidth < 760 ? { top: 60, bottom: 300, left: 20, right: 20 } : { top: 80, bottom: 250, left: 60, right: 60 });

/* ------------------------------------------------------------------ déroulé */
function fly(C, st) {
  const map = C.map();
  T.bearing = (T.bearing ?? map.getBearing()) - 35;
  map.flyTo({ center: [st.stop.lon, st.stop.lat], zoom: 11.2, pitch: 58, bearing: T.bearing, padding: pad(), duration: FLY_MS, essential: true, curve: 1.6 });
  map.once('moveend', () => orbit(C));
}
function orbit(C) {
  if (!T || T.paused) return;
  const left = Math.max(0, STAGE_MS - T.elapsed);
  if (left < 400) return;
  T.bearing -= left / 1000 * 3;          // lente rotation autour de l'étape
  C.map().easeTo({ bearing: T.bearing, duration: left, easing: t => t, essential: true });
}
function go(C, idx) {
  if (!T) return;
  if (idx >= T.stages.length) return finish(C);
  T.idx = Math.max(0, idx);
  T.elapsed = 0;
  renderStage(C);
  if (!T.paused) fly(C, T.stages[T.idx]);
  else { const s = T.stages[T.idx].stop; C.map().jumpTo({ center: [s.lon, s.lat], zoom: 11.2, pitch: 58 }); }
}
function frame(C, now) {
  if (!T) return;
  const dt = Math.min(250, now - (T.last ?? now));
  T.last = now;
  if (!T.paused) {
    T.elapsed += dt;
    if (T.elapsed >= STAGE_MS) { go(C, T.idx + 1); if (!T) return; }
  }
  const f = Math.min(1, T.elapsed / STAGE_MS);
  const seg = bar().querySelectorAll('.tb-prog span i')[T.idx];
  if (seg) seg.style.transform = `scaleX(${f})`;
  // défilement continu de la bande de photos pendant l'étape
  const strip = bar().querySelector('.tb-strip');
  if (T.track && strip) {
    const extra = T.track.scrollWidth - strip.clientWidth;
    const e = f < 0.08 ? 0 : (f - 0.08) / 0.92;
    T.track.style.transform = `translateX(${extra > 0 ? -extra * e : 0}px)`;
  }
  T.raf = requestAnimationFrame(t => frame(C, t));
}
function pause(C) { if (!T || T.paused) return; T.paused = true; C.map().stop(); syncPlay(); }
function resume(C) {
  if (!T || !T.paused) return;
  T.paused = false; syncPlay();
  const s = T.stages[T.idx].stop, c = C.map().getCenter();
  if (C.haversine(c.lat, c.lng, s.lat, s.lon) > 3 || C.map().getZoom() > 13) fly(C, T.stages[T.idx]); else orbit(C);
}
function finish(C) {
  stopTour(C);
  C.toast('Fin du survol — bon voyage !');
}
function onKey(e) {
  if (!T || e.target.tagName === 'INPUT') return;
  const C = T.C;
  if (e.key === ' ') { e.preventDefault(); T.paused ? resume(C) : pause(C); }
  else if (e.key === 'ArrowRight') go(C, T.idx + 1);
  else if (e.key === 'ArrowLeft') go(C, T.idx - 1);
  else if (e.key === 'Escape') stopTour(C);
  else return;
  e.stopPropagation();
}

/* ------------------------------------------------------------------ public */
export async function startTour(C, trip) {
  stopTour(C, true);
  const ctl = new AbortController();
  T = { C, ctl, stages: trip.stops.map((s, i) => ({ stop: s, i, items: [], photos: [] })), idx: 0, elapsed: 0, paused: false };
  document.body.classList.add('touring');
  document.getElementById('panel')?.classList.add('away');
  renderShell(C);
  const b = bar();
  b.querySelector('.tb-name').textContent = 'Préparation du survol…';
  b.querySelector('.tb-track').innerHTML = '<div class="tb-load">' + '<i></i>'.repeat(5) + '</div>';
  T.paused = true; syncPlay();
  const stages = await collect(C, trip, ctl.signal).catch(() => null);
  if (!T || T.ctl !== ctl) return;
  if (stages) T.stages = stages;
  // précharge les premières photos pour un départ fluide
  await Promise.race([Promise.all(T.stages[0].photos.slice(0, 4).map(p => new Promise(r => { const im = new Image(); im.referrerPolicy = 'no-referrer'; im.onload = im.onerror = r; im.src = p.src; }))), new Promise(r => setTimeout(r, 2500))]);
  if (!T || T.ctl !== ctl) return;
  T.paused = false; syncPlay();
  addEventListener('keydown', onKey, true);
  go(C, 0);
  T.raf = requestAnimationFrame(t => frame(C, t));
}
export function stopTour(C, silent) {
  if (!T) return;
  T.ctl.abort();
  cancelAnimationFrame(T.raf);
  removeEventListener('keydown', onKey, true);
  C.map()?.stop();
  T = null;
  document.body.classList.remove('touring');
  document.getElementById('panel')?.classList.remove('away');
  const b = document.getElementById('tourbar');
  if (b) { b.classList.remove('show'); setTimeout(() => { if (!T) b.remove(); }, 450); }
}
export const touring = () => !!T;
