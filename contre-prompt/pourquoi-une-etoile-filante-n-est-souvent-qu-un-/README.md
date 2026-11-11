# Pourquoi une étoile filante n'est (souvent) qu'un grain de sable ? — mini-doc vertical (9:16)

Quatrième vidéo avec la **recette de création** (`../PROCEDURE.md`, `../AUDIT-contenu.md`) : accroche de 11 mots, scènes de 3 à 8 s, quatre images réelles libres de droits (NASA, équipage de l'ISS, gravure de 1833), couverture au gabarit de la chaîne (sans nom ni signature), appel à l'action de fin en **variante A**.

| Livrable | Fichier |
|---|---|
| Texte de la voix off (à enregistrer par toi), avec les deux appels à l'action | [`voix-off.md`](voix-off.md) |
| Vidéo animée sans voix, 1080×1920, 30 i/s, 1 min 09 (estimation avant ta voix), sous-titres gravés | `pourquoi-une-etoile-filante-n-est-souvent-qu-un-_sans-voix.mp4` |
| Légende Instagram avec sources et crédits d'images | [`legende-instagram.md`](legende-instagram.md) |
| Fiche de sources | [`fiche-sources.md`](fiche-sources.md) |
| Image de couverture 1080×1920 (titre dans le cadrage 3:4) | `couverture.png` |

Partie de `../modele/source/` (moteur papier découpé, `brand.js`). Régénération : `python3 timing.py`, `node render.js video 4`, `./build.sh pourquoi-une-etoile-filante-n-est-souvent-qu-un-`. Après la voix : `./monter_final.sh <id> voix.m4a` puis `../outils/ajouter_sons.sh <dossier> none`.
