# Souffle ×2 — reel fantastique vertical 1080×1920 (39,5 s)

- `souffle-x2.mp4` : vidéo finale (ambiance sonore incluse, sans voix)
- `ambiance.wav` : bande son seule pour remixer avec ta voix
- `cover.png` : couverture
- `Texte voix off.md`, `Légende et vérification.md`
- Sources : `scene.html` (Three.js + GSAP, simulation physique déterministe, tout piloté par `window.seek(t)`), `render.mjs` (Playwright), `audio.py` (numpy)

Refaire le rendu :
```bash
npm i gsap@3.12.5 three@0.160.0 && npm i -D playwright
node render.mjs frames 0 1185 frames
python3 audio.py
ffmpeg -framerate 30 -i frames/f%05d.jpg -i ambiance.wav -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -shortest souffle-x2.mp4
```
