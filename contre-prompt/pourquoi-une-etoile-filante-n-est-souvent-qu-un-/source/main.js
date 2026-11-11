'use strict';
async function boot() {
  cv = document.getElementById('c'); ctx = cv.getContext('2d', { alpha: false });
  await new FontFace('Fredoka', 'url(fonts/Fredoka.ttf)', { weight: '300 700' }).load().then(f => document.fonts.add(f));
  await document.fonts.load('700 80px Fredoka');
  const load = (k, src) => new Promise((ok, ko) => { const i = new Image(); i.onload = () => { IMG[k] = i; ok(); }; i.onerror = () => ko(new Error('image ' + src)); i.src = src; });
  await Promise.all([load('p1', 'assets/perseides_nasa.jpg'), load('p2', 'assets/perseides_alphacap_nasa.jpg'), load('iss', 'assets/vu_de_orbite_iss.jpg'), load('leo', 'assets/leonides_1833.jpg')]);
  window.renderAt = t => { renderFrame(t); return true; };
  window.READY = true;
}
boot().catch(e => { window.BOOT_ERROR = String(e); console.error(e); });
