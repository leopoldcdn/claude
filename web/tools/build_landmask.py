"""Masque terre / mer du monde pour l'itinéraire (détection des traversées en mer).

Source : Natural Earth 1:10m (terres + petites îles), domaine public.
Sortie : web/data/land.bin — grille équirectangulaire de 8640 × 4320 (2,5 minutes d'arc ≈ 4,6 km à l'équateur),
codée ligne par ligne en plages de terre, chaque plage portant le numéro de sa terre (continent ou île : un
numéro par polygone de Natural Earth) : en-tête « LND2 » + largeur, hauteur (uint16), puis pour chaque ligne le nombre de
plages (uint16) suivi, pour chacune, de début, fin (uint16, fin exclue) et numéro de terre (uint32).
Deux lieux sur la même terre sont reliables par la route ; sinon il faut un bateau ou un avion.

Usage : python3 web/tools/build_landmask.py <ne_10m_land.geojson> <ne_10m_minor_islands.geojson>
"""
import json, os, struct, sys
import numpy as np
from PIL import Image, ImageDraw

Image.MAX_IMAGE_PIXELS = None
W, H = 8640, 4320
OUT = os.path.join(os.path.dirname(__file__), '..', 'data', 'land.bin')

# chaque polygone de Natural Earth est une terre distincte (île ou continent) : on le dessine avec son propre numéro.
# (Déduire les terres des pixels voisins souderait les îles séparées par un détroit plus étroit qu'un pixel,
# comme Bali et Java.)
img = Image.new('I', (W, H), 0)
d = ImageDraw.Draw(img)
px = lambda c: ((c[0] + 180) / 360 * W, (90 - c[1]) / 180 * H)
nid = 1
for path in sys.argv[1:]:
    for f in json.load(open(path))['features']:
        g = f['geometry']
        polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
        for poly in polys:
            nid += 1
            d.polygon([px(c) for c in poly[0]], fill=nid, outline=nid)
            for hole in poly[1:]:
                d.polygon([px(c) for c in hole], fill=0)
lab = np.asarray(img, dtype=np.int64).copy()
lab[-int(H * 0.06):, :][lab[-int(H * 0.06):, :] == 0] = 1          # Antarctique
m = (lab > 0).astype(np.uint8)
print('terres distinctes', nid)
out = bytearray(b'LND2' + struct.pack('<HH', W, H))
runs_total = 0
for y in range(H):
    row = lab[y]
    cuts = np.where(np.diff(row) != 0)[0] + 1
    bounds = np.concatenate(([0], cuts, [W]))
    runs = [(a, b, int(row[a])) for a, b in zip(bounds[:-1], bounds[1:]) if row[a]]
    out += struct.pack('<H', len(runs))
    for a, b, v in runs:
        out += struct.pack('<HHI', a, b, v)
    runs_total += len(runs)
open(OUT, 'wb').write(out)
print('plages', runs_total, 'taille', len(out) // 1024, 'Ko', 'terres', round(m.mean(), 3))
