"""Génère les textures stylisées du globe (cartoon, carte de jeu, vintage).

Entrées : globe/assets/countries-50m.json (côtes nettes), earth-blue-marble.jpg (biomes),
earth-topology.png (relief), earth-water.png (lacs).
Sorties : globe/assets/style-<nom>-8k.jpg et -4k.jpg

Usage : python3 globe/tools/make_styles.py
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

Image.MAX_IMAGE_PIXELS = None
A = os.path.join(os.path.dirname(__file__), '..', 'assets')
W, H = 8192, 4096


def hexc(h):
    h = h.lstrip('#'); return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], np.float32) / 255


# ---------- 1. Masque des terres à partir des polygones (côtes nettes) ----------
def decode_topo(t):
    sx, sy = t['transform']['scale']; tx, ty = t['transform']['translate']
    arcs = []
    for arc in t['arcs']:
        x = y = 0; pts = []
        for dx, dy in arc:
            x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)

    def ring(idx):
        out = []
        for i in idx:
            pts = arcs[i] if i >= 0 else arcs[~i][::-1]
            out.extend(pts if not out else pts[1:])
        return out
    polys = []
    for g in t['objects']['countries']['geometries']:
        if g['type'] == 'Polygon':
            polys.append([ring(r) for r in g['arcs']])
        elif g['type'] == 'MultiPolygon':
            for p in g['arcs']:
                polys.append([ring(r) for r in p])
    return polys


def land_mask():
    t = json.load(open(os.path.join(A, 'countries-50m.json')))
    img = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(img)
    px = lambda p: ((p[0] + 180) / 360 * W, (90 - p[1]) / 180 * H)
    for poly in decode_topo(t):
        for k, r in enumerate(poly):
            pts = [px(p) for p in r]
            # anneaux qui sautent l'antiméridien : on les découpe
            xs = [p[0] for p in pts]
            if max(xs) - min(xs) > W * 0.6 and not (min(p[1] for p in pts) > H * 0.93):
                left = [(x if x < W / 2 else x - W, y) for x, y in pts]
                right = [(x if x >= W / 2 else x + W, y) for x, y in pts]
                d.polygon(left, fill=255 if k == 0 else 0); d.polygon(right, fill=255 if k == 0 else 0)
            else:
                d.polygon(pts, fill=255 if k == 0 else 0)
    m = np.asarray(img) > 127
    m[-int(H * 0.035):, :] = True          # pôle Sud = Antarctique
    # lacs intérieurs (à partir du masque d'eau basse résolution, loin des côtes)
    water = np.asarray(Image.open(os.path.join(A, 'earth-water.png')).convert('L').resize((W, H), Image.BILINEAR)) / 255
    inland = ndi.distance_transform_edt(m) > 10
    lakes = ndi.binary_opening((water > 0.6) & inland, iterations=2)
    lab, n = ndi.label(lakes)
    sizes = ndi.sum(lakes, lab, range(1, n + 1))
    lakes = np.isin(lab, 1 + np.nonzero(sizes > 400)[0])
    return m & ~lakes


# ---------- 2. Biomes à partir des couleurs satellites ----------
def biomes(land):
    bm = Image.open(os.path.join(A, 'earth-blue-marble.jpg')).convert('RGB').resize((W, H), Image.BICUBIC)
    c = np.asarray(bm, np.float32) / 255
    c = ndi.gaussian_filter(c, sigma=(4, 4, 0))
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    lum = 0.3 * r + 0.59 * g + 0.11 * b
    mx, mn = c.max(-1), c.min(-1)
    sat = (mx - mn) / (mx + 1e-4)
    lat = np.linspace(90, -90, H)[:, None] * np.ones((1, W))
    cls = np.full((H, W), 3, np.uint8)                 # 3 = prairie
    cls[(g >= r * 0.95) & (lum < 0.25)] = 4            # 4 = forêt
    cls[(r > g * 1.02) & (lum > 0.28)] = 2             # 2 = sec / savane
    cls[(r > g * 1.06) & (lum > 0.42)] = 1             # 1 = désert
    cls[((lum > 0.62) & (sat < 0.2)) | (lat < -62)] = 0  # 0 = neige / glace
    # lissage : formes arrondies façon dessin animé
    onehot = np.stack([ndi.gaussian_filter((cls == k).astype(np.float32), 7) for k in range(5)], -1)
    cls = onehot.argmax(-1).astype(np.uint8)
    cls[~land] = 255
    return cls


def relief():
    t = Image.open(os.path.join(A, 'earth-topology.png')).convert('L').resize((W, H), Image.BICUBIC)
    h = ndi.gaussian_filter(np.asarray(t, np.float32) / 255, 7)
    gy, gx = np.gradient(h)
    gx *= 1400; gy *= 1400
    n = np.stack([-gx, gy, np.ones_like(h)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    L = np.array([-0.6, 0.6, 0.55]); L /= np.linalg.norm(L)
    shade = (n @ L)                                     # ~0.5..1
    return h, shade


def save(name, rgb):
    img = Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8))
    img.save(os.path.join(A, f'style-{name}-8k.jpg'), quality=86, optimize=True)
    img.resize((4096, 2048), Image.LANCZOS).save(os.path.join(A, f'style-{name}-4k.jpg'), quality=86, optimize=True)
    print('ok', name)


def paint(cls, pal):
    out = np.zeros((H, W, 3), np.float32)
    for k, col in pal.items():
        out[cls == k] = hexc(col)
    return out


def main():
    land = land_mask(); print('terres', land.mean())
    cls = biomes(land); print('biomes')
    h, shade = relief(); print('relief')
    dsea = ndi.distance_transform_edt(~land)            # distance à la côte, côté mer (px)
    dland = ndi.distance_transform_edt(land)
    lat = np.linspace(90, -90, H)[:, None]
    lon = np.linspace(-180, 180, W)[None, :]

    # ===== CARTOON : couleurs franches, relief en aplats, contour foncé =====
    rgb = paint(cls, {0: '#f3f7fb', 1: '#f2d57e', 2: '#c8c561', 3: '#7cc653', 4: '#3f9a45'})
    toon = np.where(shade > 0.97, 1.08, np.where(shade > 0.55, 1.0, 0.84))[..., None]
    rgb = np.where(land[..., None], rgb * toon, 0)
    sea = np.select([(dsea < 6)[..., None], (dsea < 26)[..., None], (dsea < 80)[..., None]],
                    [hexc('#7ee6df'), hexc('#3fc1d6'), hexc('#24a0d0')], hexc('#1a86c6')).astype(np.float32)
    rgb = np.where(land[..., None], rgb, sea)
    foam = (~land) & (dsea >= 2) & (dsea < 3.5)
    rgb[foam] = hexc('#e9fbff')
    rgb[land & (dland < 2.2)] = hexc('#24435a')
    save('cartoon', rgb)

    # ===== CARTE DE JEU : mer sombre, terres sourdes, courbes de niveau, grille =====
    rgb = paint(cls, {0: '#d5dbe0', 1: '#b7a98a', 2: '#99977a', 3: '#7d9172', 4: '#5f7a5b'})
    rgb = np.where(land[..., None], rgb * (0.82 + 0.22 * shade[..., None]), 0)
    contour = land & (np.abs(((h * 14) % 1) - 0.5) > 0.47) & (h > 0.06)
    rgb[contour] *= 0.82
    sea = np.where((dsea < 30)[..., None], hexc('#2c4558'), hexc('#223849'))
    sea = np.where((dsea < 8)[..., None], hexc('#355369'), sea)
    rgb = np.where(land[..., None], rgb, sea)
    grid = (np.abs(((lat + 90) / 15) % 1 - 0.5) > 0.4985) | (np.abs(((lon + 180) / 15) % 1 - 0.5) > 0.4985 * np.ones_like(lat))
    rgb[grid & ~land] = hexc('#3d5a70')
    rgb[land & (dland < 1.6)] = hexc('#c9d6df')
    save('carte', rgb)

    # ===== VINTAGE : carte au trésor, parchemin et sépia =====
    rgb = paint(cls, {0: '#f1e6cc', 1: '#e8cf98', 2: '#d9c48d', 3: '#c9c08a', 4: '#a9a974'})
    rgb = np.where(land[..., None], rgb * (0.84 + 0.2 * shade[..., None]), 0)
    sea = np.where((dsea < 14)[..., None], hexc('#b9c7b4'), hexc('#a4b6ac'))
    hatch = (~land) & (dsea > 6) & (dsea < 40) & (np.abs((dsea / 7) % 1 - 0.5) > 0.42)
    rgb = np.where(land[..., None], rgb, sea)
    rgb[hatch] *= 0.9
    rgb[land & (dland < 2.2)] = hexc('#5a3e24')
    grid = (np.abs(((lat + 90) / 15) % 1 - 0.5) > 0.4985) | (np.abs(((lon + 180) / 15) % 1 - 0.5) > 0.4985 * np.ones_like(lat))
    rgb[grid] = rgb[grid] * 0.85
    # grain de papier
    rng = np.random.default_rng(1)
    noise = ndi.gaussian_filter(rng.random((H // 4, W // 4)).astype(np.float32), 2)
    noise = np.asarray(Image.fromarray(((noise - noise.min()) / (np.ptp(noise)) * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), np.float32) / 255
    rgb *= (0.92 + 0.1 * noise)[..., None]
    save('vintage', rgb)


if __name__ == '__main__':
    main()
