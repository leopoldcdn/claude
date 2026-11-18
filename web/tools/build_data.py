"""Prépare les données statiques de la version web.

- data/countries.json : infos pays (nom FR, monnaies, langues, capitale) depuis le paquet npm world-countries
- data/places.json    : villes (Natural Earth), copié depuis globe/assets
- tiles/cartoon/{z}/{x}/{y}.jpg : globe cartoon en tuiles Web Mercator (zooms 0 à 4, 512 px),
  reprojeté depuis globe/assets/style-cartoon-8k.jpg (généré par globe/tools/make_styles.py)

Usage : python3 web/tools/build_data.py chemin/vers/countries.json
"""
import json, os, sys, math, shutil
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.join(os.path.dirname(__file__), '..')
GLOBE = os.path.join(ROOT, '..', 'globe', 'assets')

# --- pays
wc = json.load(open(sys.argv[1]))
out = {}
for c in wc:
    out[c['cca2']] = {
        'n': c['translations'].get('fra', {}).get('common') or c['name']['common'],
        'cur': [[k, v.get('symbol', '')] for k, v in (c.get('currencies') or {}).items()],
        'lang': list((c.get('languages') or {}).keys()),
        'cap': (c.get('capital') or [''])[0],
        'f': c.get('flag', ''),
    }
json.dump(out, open(os.path.join(ROOT, 'data', 'countries.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
shutil.copy(os.path.join(GLOBE, 'places.json'), os.path.join(ROOT, 'data', 'places.json'))
print('pays', len(out))

# --- tuiles cartoon
src = np.asarray(Image.open(os.path.join(GLOBE, 'style-cartoon-8k.jpg')).convert('RGB'), np.float32)
H, W, _ = src.shape
T = 512
for z in range(0, 5):
    n = 2 ** z
    for ty in range(n):
        py = (ty * T + np.arange(T) + 0.5) / (n * T)
        lat = np.degrees(np.arctan(np.sinh(np.pi * (1 - 2 * py))))
        for tx in range(n):
            px = (tx * T + np.arange(T) + 0.5) / (n * T)
            lon = px * 360 - 180
            yy = ((90 - lat) / 180 * H - 0.5)[:, None] * np.ones((1, T))
            xx = ((lon + 180) / 360 * W - 0.5)[None, :] * np.ones((T, 1))
            tile = np.stack([ndi.map_coordinates(src[..., k], [yy, xx], order=1, mode='wrap') for k in range(3)], -1)
            d = os.path.join(ROOT, 'tiles', 'cartoon', str(z), str(tx)); os.makedirs(d, exist_ok=True)
            Image.fromarray(np.clip(tile, 0, 255).astype(np.uint8)).save(os.path.join(d, f'{ty}.jpg'), quality=84)
    print('zoom', z, 'ok')
