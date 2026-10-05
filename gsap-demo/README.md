# Démo vidéo GSAP

Animation écrite en HTML + GSAP (`index.html`), rendue en MP4 image par image (`render.js`) :
la timeline GSAP est en pause, Playwright la positionne à chaque instant (`tl.seek`) et fait une capture,
puis ffmpeg assemble les images.

```bash
npm install
node render.js 30 demo.mp4   # fps, fichier de sortie
```

Prérequis : Chromium (chemin configurable via `CHROMIUM_PATH`) et `ffmpeg`.
