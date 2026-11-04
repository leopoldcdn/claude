# Pourquoi la mer est salée ? — mini-doc vertical (9:16)

| Livrable | Fichier |
|---|---|
| Texte de la voix off (à enregistrer par toi) | [`voix-off.md`](voix-off.md) |
| Vidéo animée sans voix, 1080×1920, 30 i/s, 1 min 08, sous-titres gravés | `pourquoi-la-mer-est-salee_sans-voix.mp4` |
| Légende Instagram avec sources (+ version courte) | [`legende-instagram.md`](legende-instagram.md) |
| Fiche de sources (chaque affirmation, sa source, son statut) | [`fiche-sources.md`](fiche-sources.md) |
| Image de couverture 1080×1920 (titre dans le cadrage central 3:4) | `couverture.png` |
| **Rendu final avec ta voix** (1080×1920, 58 s, −16 LUFS) | `pourquoi-la-mer-est-salee_rendu-final.mp4` |

## Le choix visuel

**Papier découpé en stop-motion** : des formes de papier avec ombres portées et grain, animées « à la double » (15 images uniques par seconde) pour l'effet fait main. Le cristal de sel cubique est le motif qui revient partout : point d'interrogation, sucre qui fond, dalle de 150 m. Les photos libres de droits (Halley, mer Caspienne, cheminée hydrothermale, Terre) sont des cartes de papier collées au scotch dans l'animation, jamais plein écran.

## Pas de voix de synthèse

La vidéo n'a **aucune piste audio**. Le calage vient d'une estimation de débit (≈ 2,7 mots/s) : voir « Repères pour caler ta lecture » dans `voix-off.md`.

## Régénérer la vidéo (dossier `source/`)

```bash
cd source
python3 timing.py                 # estime les temps de la voix (option --sps pour changer le débit)
python3 -I build_earth_salt.py    # (déjà fait) images « Terre salée » depuis la photo NASA
node render.js video 4            # rend les images (Playwright + Chromium), 4 processus
./build.sh                        # assemble le MP4 avec ffmpeg
node render.js cover ../couverture.png
python3 verif_couche_sel.py       # recalcul des ≈150 m
```

Fichiers : `script.txt` (texte avec repères `{nom}` pour le calage), `lib.js` + `scenes.js` (moteur et scènes), `assets/` (images libres de droits), `fonts/` (Fredoka, licence OFL).
