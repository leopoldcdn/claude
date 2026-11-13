# Mini-doc « Pourquoi a-t-on les kiwis bleus ? »

Reel vertical (Instagram, TikTok, YouTube Shorts), produit le 13 novembre 2026.

| Fichier | Contenu |
|---|---|
| `video-sans-voix.mp4` | Vidéo 1080 × 1920, 30 images par seconde, 76,8 secondes, sous-titres incrustés, bruitages seuls (pas de voix, pas de musique) |
| `voix-off.md` | Texte à lire, repères de temps phrase par phrase, conseils de lecture |
| `couverture.png` | Couverture 1080 × 1920, titre placé dans le cadrage 3:4 de la grille |
| `legende-instagram.md` | Légende prête à coller, avec sources, crédits et hashtags |
| `fiche-sources.md` | Chaque affirmation reliée à sa source et à un statut ; liste de ce qui n'a pas pu être lu |
| `brief-de-style.md` | Étude des formats et choix du style |
| `titre-et-moderation.md` | Trois titres, titre retenu, règles de Meta et risques |
| `bruitages-seuls.wav` | Piste des bruitages, pour le mixage avec la voix |
| `controle/` | Planches d'images extraites de la vidéo finale et cadrages de la couverture |
| `sources/` | Code de l'animation, pour corriger un texte ou un repère et relancer le rendu |

## Ajouter la voix

Enregistrer la voix en regardant la vidéo (les sous-titres servent de prompteur), puis la poser sur la piste des bruitages dans n'importe quel logiciel de montage. Les bruitages plafonnent à -6 dB : la voix doit passer nettement au-dessus.

## Refaire le rendu

Depuis `sources/`, avec Node, Playwright, Python (numpy) et ffmpeg :

```bash
node render.js info > info.json
```

```bash
python3 sfx.py info.json sfx.wav
```

```bash
node render.js range images 0 2304
```

```bash
ffmpeg -framerate 30 -i images/f%05d.jpg -i sfx.wav -c:v libx264 -preset slow -crf 22 -maxrate 6M -bufsize 12M -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest ../video-sans-voix.mp4
```

Le texte, les durées et les sous-titres se règlent dans le tableau `CUES` au début de `sources/film.js`.
