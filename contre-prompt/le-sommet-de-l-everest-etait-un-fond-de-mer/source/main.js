'use strict';
async function boot() {
  cv = document.getElementById('c'); ctx = cv.getContext('2d', { alpha: false });
  await new FontFace('Fredoka', 'url(fonts/Fredoka.ttf)', { weight: '300 700' }).load().then(f => document.fonts.add(f));
  await document.fonts.load('700 80px Fredoka');
  const load = (k, src) => new Promise((ok, ko) => { const i = new Image(); i.onload = () => { IMG[k] = i; ok(); }; i.onerror = () => ko(new Error('image ' + src)); i.src = src; });
  await Promise.all([load('sts66', 'assets/everest_sts66.jpg'), load('iss', 'assets/everest_iss.jpg'), load('radar', 'assets/everest_radar_top.jpg'), load('himalaya', 'assets/himalaya_crop.jpg'), load('fossil', 'assets/crinoide_nps.jpg')]);
  window.renderAt = t => { renderFrame(t); return true; };
  window.READY = true;
}
boot().catch(e => { window.BOOT_ERROR = String(e); console.error(e); });
