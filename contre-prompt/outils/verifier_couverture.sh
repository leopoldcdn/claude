#!/bin/bash
# Verifie une couverture : produit le cadrage 3:4 de la grille du profil et la miniature 300x400 (a regarder : rien de coupe, titre lisible).
# Usage : ./verifier_couverture.sh <dossier-video>        (lit <dossier>/couverture.png, ecrit <dossier>/_couv_3x4.png et _couv_miniature.png, ignores par git)
set -e
D="$1"; [ -f "$D/couverture.png" ] || { echo "pas de $D/couverture.png"; exit 1; }
convert "$D/couverture.png" -crop 1080x1440+0+240 +repage "$D/_couv_3x4.png"
convert "$D/_couv_3x4.png" -resize 300x400 "$D/_couv_miniature.png"
convert "$D/_couv_3x4.png" -resize 360x "$D/_couv_3x4_apercu.png"
echo "A regarder : $D/_couv_3x4.png (cadrage de la grille, 3:4) et $D/_couv_miniature.png (taille d'une vignette)."
