/* Modèle de scènes : copier ce dossier source/ vers contre-prompt/<id>/source/, puis remplacer script.txt, les scènes et la couverture.
   Règles de la recette (voir ../../PROCEDURE.md) : accroche ≤ 12 mots avec un élément visuel fort dès la 1re seconde, scènes de 5 à 7 s,
   un événement visuel toutes les 2 à 4 s, texte à comprendre ≥ 50 px, au moins une image réelle (photoCard) et le plus possible. */
'use strict';
function camera(s, z0, z1, cx = W / 2, cy = 900, dx = 0, dy = 0) { const z = lerp(z0, z1, clamp(s)); ctx.translate(cx + dx * s, cy + dy * s); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function sceneDemo(t) {
  const c = TIMING.cues; ctx.fillStyle = '#cfe3ea'; ctx.fillRect(0, 0, W, H);
  person(540, 1250, 1.7, { coat: '#2f62ad', smile: true });
  tag('EXEMPLE D\'ÉTIQUETTE', 540, 420, 62, { bg: BRAND.accent2, fg: BRAND.ink, rot: -.03, scale: pop(t, .4, .3) });
  if (c.cta1 != null) ctaSubscribe(t, c.cta1); if (c.cta2 != null) ctaComment(t, c.cta2);
}
function plan() { return [{ t: 0, f: sceneDemo }]; }
function renderFrame(t) {
  setTime(t); const pl = plan(); let i = 0; while (i + 1 < pl.length && T >= pl[i + 1].t) i++;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H); ctx.save();
  const s0 = pl[i].t, s1 = i + 1 < pl.length ? pl[i + 1].t : TIMING.video_end;
  camera((T - s0) / Math.max(.1, s1 - s0), 1.0, 1.04, W / 2, 900, 0, -12);
  pl[i].f(T); ctx.restore();
  grain(); subtitles(T);
  for (const p of pl) if (p.wipe) wipeSheets(T, p.t);
}
function renderCover() { coverTemplate({ kicker: 'POURQUOI', word: 'EXEMPLE ?', tagText: 'TITRE DE LA VIDÉO', illustration: () => person(540, 1300, 1.9, { smile: true }) }); }
