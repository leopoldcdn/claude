const { chromium } = require('playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); const out = process.argv[2];
  const p = await b.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2 });
  await p.route(/fonts|cdnjs/, (r) => r.abort());
  await p.goto('file:///home/user/claude/logiciel-rh-v3/index.html'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('teamora-v3-news', '1'); localStorage.setItem('teamora-ui-v3', JSON.stringify({ profile: 'rh', view: 'obligations' })); }); await p.reload(); await p.waitForTimeout(600);
  await p.fill('#obl-sim-n', '52'); await p.selectOption('#obl-sim-s', '1an'); await p.click('[data-act="obl-sim"]'); await p.waitForTimeout(400);
  await p.addStyleTag({ content: '.toast,.toasts,#toasts,.org-warn,.avis-fab,.help-fab{display:none!important}' }); await p.waitForTimeout(300);
  const box = await p.evaluate(() => { const h = [...document.querySelectorAll('h3,h2,b')].find((x) => x.textContent.trim() === 'Alertes'); let c = h; while (c && !(c.classList && c.classList.contains('card'))) c = c.parentElement; const r = c.getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: 392 }; });
  await p.screenshot({ path: out + '/alertes.jpg', type: 'jpeg', quality: 86, clip: box, fullPage: true });
  const kp = await p.evaluate(() => { const k = [...document.querySelectorAll('*')].find((x) => x.textContent.trim().startsWith('Effectif moyen (12 mois)') && x.children.length > 0 && x.getBoundingClientRect().width < 500); let c = k; while (c && c.parentElement && c.parentElement.getBoundingClientRect().width < 1300) c = c.parentElement; const r = c.parentElement.getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; });
  await p.screenshot({ path: out + '/kpi.png', clip: kp, fullPage: true });
  // Téléphone : accueil de l'espace salarié
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await m.route(/fonts|cdnjs/, (r) => r.abort());
  await m.goto('file:///home/user/claude/logiciel-rh-v3/index.html'); await m.evaluate(() => { localStorage.clear(); localStorage.setItem('teamora-v3-news', '1'); localStorage.setItem('teamora-ui-v3', JSON.stringify({ profile: 'salarie' })); }); await m.reload(); await m.waitForTimeout(700);
  await m.addStyleTag({ content: '.toast,.toasts,#toasts{display:none!important}' });
  await m.screenshot({ path: out + '/mobile.jpg', type: 'jpeg', quality: 84 });
  await b.close(); })();
