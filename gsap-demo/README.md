# Démo vidéo GSAP

Animation écrite en HTML + GSAP (`index.html`), rendue en MP4 image par image (`render.js`) :
la timeline GSAP est en pause, Playwright la positionne à chaque instant (`tl.seek`) et fait une capture,
puis ffmpeg assemble les images.

```bash
npm install
node render.js 30 demo.mp4   # fps, fichier de sortie
```

Prérequis : Chromium (chemin configurable via `CHROMIUM_PATH`) et `ffmpeg`.

## Vidéo « Teamora HR »

`hr-system.html` présente un logiciel RH fictif (tableau des employés, recherche, fiche employé, fonctionnalités).
Toutes les données sont inventées.

```bash
node render.js hr-system.html hr-system.mp4 30 4   # page, sortie, fps, workers en parallèle
```

## Vidéo « Parcours collaborateur » (FR)

`parcours-collaborateur.html` raconte l'histoire de Léa dans Teamora, en 4 chapitres :
intégration → paie & absences → entretien annuel → sortie. Données fictives.

```bash
node render.js parcours-collaborateur.html parcours-collaborateur.mp4 30 4
```
