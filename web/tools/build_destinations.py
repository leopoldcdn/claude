"""Destinations pour « Où partir en… ? » : data/destinations.json

Pour chaque destination notable du monde (villes connues, villages célèbres, îles, plages, parcs, stations…),
espacées d'au moins 22 km, on calcule :
- son profil d'envies (plage, nature, montagne, culture, histoire, villes), d'après les sites notables à moins de 30 km ;
- son climat mois par mois : température maximale moyenne et précipitations (WorldClim 2.1, normales 1970-2000,
  résolution 10 minutes d'arc, CC BY 4.0 — https://www.worldclim.org/).

Format : liste de [nom, pays, lat, lon, notoriété, type, profil, tmax×12, pluie×12, article_wikipedia_fr]
  profil = 6 chiffres 0-9 dans l'ordre plage, nature, montagne, culture, histoire, villes.

Usage : python3 web/tools/build_destinations.py <dossier WorldClim contenant tmax/ et prec/>
"""
import json, math, os, sys, glob
import numpy as np
import tifffile

ROOT = os.path.join(os.path.dirname(__file__), '..')
WC = sys.argv[1]
meta = json.load(open(os.path.join(ROOT, 'data', 'places-meta.json')))
K = meta['kinds']
kind = lambda p: K[p[2]]

# --- climat
def load(var):
    return np.stack([tifffile.imread(os.path.join(WC, var, f'wc2.1_10m_{var}_{m:02d}.tif')) for m in range(1, 13)])
TX, PR = load('tmax'), load('prec')
NH, NW = TX.shape[1:]
valid = TX[0] > -1000
def clim(lat, lon):
    y, x = int((90 - lat) / 180 * NH), int((lon + 180) / 360 * NW)
    for r in range(0, 5):                          # petites îles : cellule terrestre la plus proche
        best = None
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                yy, xx = y + dy, (x + dx) % NW
                if 0 <= yy < NH and valid[yy, xx]:
                    d = dy * dy + dx * dx
                    if best is None or d < best[0]: best = (d, yy, xx)
        if best:
            _, yy, xx = best
            return [int(round(v)) for v in TX[:, yy, xx]], [int(round(v)) for v in PR[:, yy, xx]]
    return None

# --- côte : distance à la mer (masque terre data/land.bin, ≈ 4,6 km par pixel)
import struct
_b = open(os.path.join(ROOT, 'data', 'land.bin'), 'rb').read()
LW, LH = struct.unpack('<HH', _b[4:8])
LAND = np.zeros((LH, LW), dtype=bool)
_o = 8
for _y in range(LH):
    _n = struct.unpack('<H', _b[_o:_o + 2])[0]; _o += 2
    for _i in range(_n):
        _a, _e, _ = struct.unpack('<HHI', _b[_o:_o + 8]); _o += 8
        LAND[_y, _a:_e] = True
from scipy import ndimage as ndi
SEA_DIST = ndi.distance_transform_edt(LAND) * (40075 / LW)      # km jusqu'à la mer (approx. à l'équateur)
def coast_km(lat, lon):
    y, x = int((90 - lat) / 180 * LH), int((lon + 180) / 360 * LW) % LW
    return SEA_DIST[min(LH - 1, y), x] * max(0.2, math.cos(math.radians(lat)))

# --- lieux
rows = []
for f in glob.glob(os.path.join(ROOT, 'data', 'places', '*.json')):
    rows.extend(json.load(open(f)))
print('lieux', len(rows))

CATS = {
    'plage': {'plage', 'baie', 'lagune', 'cap'},            # les îles ne comptent que pour elles-mêmes (pas les îles du Nil)
    'nature': {'parc', 'lac', 'cascade', 'gorge', 'grotte', 'desert', 'glacier'},
    'montagne': {'montagne', 'volcan', 'glacier', 'station'},
    'culture': {'musee', 'palais', 'chateau', 'monument', 'temple', 'monastere'},
    'histoire': {'site antique', 'site historique', 'chateau', 'monument', 'monastere'},
}
import re
NATIONAL = re.compile(r'national|nacional|nazionale|naturel|natural|nature|réserve|reserve|reserva|riserva|parque natural|nationalpark|biosph', re.I)
# noms tirés d'un titre d'article qui ne désignent pas le lieu lui-même (« Géographie de la Dominique »)
BAD_NAME = re.compile(r'^(géographie|histoire|liste|démographie|économie|politique|culture) ', re.I)
BAD_EN = re.compile(r'^(windward|leeward) islands$|^(spratly|paracel)', re.I)
TOURIST = {'ile', 'plage', 'parc', 'station', 'volcan', 'cascade', 'site antique', 'desert', 'lagune', 'gorge', 'glacier', 'baie', 'temple', 'chateau', 'palais', 'monastere', 'site historique'}
sites = [p for p in rows if kind(p) not in ('ville', 'village', 'capitale') and p[9] >= 8]

def is_dest(p):
    k = kind(p)
    if BAD_EN.match(p[0]): return False
    if p[3] == 'AQ': return False
    if k == 'capitale': return p[9] >= 30
    if k == 'ville': return p[9] >= 70 or (p[9] >= 45 and bool(p[8]))
    if k == 'village': return p[9] >= 45 and bool(p[8])
    return k in TOURIST and p[9] >= 35
# intérêt touristique : la notoriété, renforcée pour les petits lieux très connus (Gordes passe devant une ville
# moyenne voisine) et pour les capitales
def tourism(p):
    small = max(0.0, 5 - math.log10(p[7] + 10)) if kind(p) in ('ville', 'village') else 1.5
    return p[9] * (1 + 0.35 * small) + (15 if kind(p) == 'capitale' else 0)
cands = sorted((p for p in rows if is_dest(p)), key=lambda p: -tourism(p))
print('candidats', len(cands))

# grille pour les recherches de voisinage (cases de 1°)
grid = {}
def gkey(lat, lon): return (math.floor(lat), math.floor(lon))
def near(lat, lon, km, pool):
    out = []
    dl = km / 111 + 1e-9
    dL = km / (111 * max(0.1, math.cos(math.radians(lat))))
    for a in range(math.floor(lat - dl), math.floor(lat + dl) + 1):
        for b in range(math.floor(lon - dL), math.floor(lon + dL) + 1):
            for q in pool.get((a, ((b + 180) % 360) - 180), ()):
                d = hav(lat, lon, q[5], q[6])
                if d <= km: out.append((d, q))
    return out
def hav(a, b, c, d):
    x = math.sin(math.radians(c - a) / 2) ** 2 + math.cos(math.radians(a)) * math.cos(math.radians(c)) * math.sin(math.radians(d - b) / 2) ** 2
    return 12742 * math.asin(math.sqrt(min(1, x)))
site_grid = {}
for s in sites: site_grid.setdefault(gkey(s[5], s[6]), []).append(s)

# une île, une plage ou un site sans aucun lieu habité autour (îles Spratley, île Europa…) n'est pas une destination
town_grid = {}
for q in rows:
    if kind(q) in ('ville', 'village', 'capitale') and q[7] >= 800: town_grid.setdefault(gkey(q[5], q[6]), []).append(q)
cands = [p for p in cands if kind(p) in ('ville', 'village', 'capitale') or near(p[5], p[6], 25, town_grid)]
kept, kept_grid = [], {}
for p in cands:
    big = kind(p) in ('ville', 'capitale') and p[7] >= 100000
    # deux grandes villes : 22 km minimum ; un village ou un site : 10 km suffisent
    if any(d < (22 if big and kind(q) in ('ville', 'capitale') and q[7] >= 100000 else 10) for d, q in near(p[5], p[6], 22, kept_grid)): continue
    kept.append(p); kept_grid.setdefault(gkey(p[5], p[6]), []).append(p)
# les plus touristiques, avec un plafond par pays pour garder un monde équilibré (Wikipédia en français a un article
# pour chaque commune française), dans la limite de 6 000 (fichier ≈ 300 Ko compressé)
per = {}
sel = []
for p in sorted(kept, key=lambda p: -tourism(p)):
    if per.get(p[3], 0) >= 140: continue
    per[p[3]] = per.get(p[3], 0) + 1
    sel.append(p)
kept = sel[:6000]
print('destinations espacées', len(kept))

out = []
for p in kept:
    c = clim(p[5], p[6])
    if not c: continue
    around = near(p[5], p[6], 30, site_grid)
    prof = []
    for cat, kinds in CATS.items():
        # les parcs urbains (Hyde Park…) ne font pas une destination nature : seulement les parcs nationaux et réserves
        ok = lambda q: kind(q) in kinds and not (kind(q) == 'parc' and not NATIONAL.search((q[1] or '') + ' ' + q[0]))
        v = sum(math.log1p(q[9]) * (1 - d / 40) for d, q in around if ok(q))
        if kind(p) in kinds or (cat == 'plage' and kind(p) == 'ile'): v += math.log1p(p[9]) * 1.5
        if cat == 'plage':
            ck = coast_km(p[5], p[6])
            if ck < 12: v += 14 if ck < 5 else 8          # au bord de la mer : la plage est à portée
        prof.append(min(9, int(round(v / 2.2))))
    k = kind(p)
    prof.append(9 if k == 'capitale' and p[7] > 500000 else min(9, int(round(math.log10(p[7] + 1) * 1.6 - 4))) if k in ('ville', 'capitale') else 0)
    name = p[1] if p[1] and not BAD_NAME.match(p[1]) else p[0]
    out.append([name, p[3], round(p[5], 3), round(p[6], 3), p[9], k, ''.join(str(max(0, v)) for v in prof), c[0], c[1], p[8] or 0])
json.dump(out, open(os.path.join(ROOT, 'data', 'destinations.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('écrit', len(out), 'destinations')
