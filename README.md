# Escapade — Globe des vacances

Globe terrestre 3D (style jeu vidéo réaliste) pour explorer le monde et choisir une destination de vacances.

- `globe/index.html` : l'application (Three.js, sans build).
- `globe/assets/` : textures de la Terre (NASA Blue Marble via three-globe), nuages, frontières (world-atlas / Natural Earth), villes (Natural Earth populated places).

Cliquer n'importe où sur le globe → la page demande à Claude une fiche de voyage (description, meilleure période, budget, lieux à voir, infos pratiques). Si le point exact n'a pas d'intérêt, Claude redirige vers la destination la plus proche.

## Lancer en local

```bash
cd globe && python3 -m http.server 8000
```

puis ouvrir http://localhost:8000. En local, l'IA n'est pas disponible (elle passe par la fonction `sample` des artefacts claude.ai) : la fiche affiche alors les villes les plus proches.
