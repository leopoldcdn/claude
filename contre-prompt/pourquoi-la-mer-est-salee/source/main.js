'use strict';
async function boot() {
  cv = document.getElementById('c'); ctx = cv.getContext('2d', { alpha: false });
  await new FontFace('Fredoka', 'url(fonts/Fredoka.ttf)', { weight: '300 700' }).load().then(f => document.fonts.add(f));
  await document.fonts.load('700 80px Fredoka');
  const load = (k, src) => new Promise((ok, ko) => { const i = new Image(); i.onload = () => { IMG[k] = i; ok(); }; i.onerror = () => ko(new Error('image ' + src)); i.src = src; });
  await Promise.all([load('halley', 'assets/halley.jpg'), load('smoker', 'assets/smoker.jpg'), load('caspian', 'assets/caspian.jpg'), load('earth', 'assets/earth.jpg'),
    load('earthSalt', 'assets/earth_salt.png'), load('earthOrder', 'assets/earth_order.png')]);
  window.renderAt = t => { renderFrame(t); return true; };
  window.READY = true;
}
boot().catch(e => { window.BOOT_ERROR = String(e); console.error(e); });
