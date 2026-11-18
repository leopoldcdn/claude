"""Construit la base de lieux d'Escapade à partir de GeoNames (CC BY 4.0).

Garde :
- les villes et villages de 500 habitants ou plus (plus les chefs-lieux et les lieux habités ayant un article Wikipédia) ;
- les sites notables ayant un article Wikipédia (français ou anglais) : îles, plages, montagnes, volcans, parcs,
  réserves, lacs, cascades, gorges, glaciers, caps, châteaux, palais, sites antiques, monuments, musées, temples…

Sorties dans web/data/ :
- places/<lat>_<lon>.json : un fichier par case de 5° x 5°, chargé à la demande par l'app ;
- top.json : les lieux les plus importants du monde entier (recherche hors ligne, « Au hasard ») ;
- places-meta.json : liste des cases non vides et table des types.

La notoriété vient de Wikidata (nombre d'articles Wikipédia, toutes langues) : fichier ql.tsv obtenu avec
  SELECT ?gn ?sl ?fr WHERE { ?item wdt:P1566 ?gn ; wikibase:sitelinks ?sl . FILTER(?sl >= 3)
    OPTIONAL { ?fr schema:about ?item ; schema:isPartOf <https://fr.wikipedia.org/> } }
sur https://qlever.cs.uni-freiburg.de/api/wikidata (format TSV).

Usage : python3 web/tools/build_places.py <dossier contenant allCountries.zip, alternateNamesV2.zip, admin1CodesASCII.txt, ql.tsv>
"""
import sys, os, io, json, zipfile, collections, math, re
from urllib.parse import unquote

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'data')
CELL = 5

# type -> (code, libellé). Le code est l'index dans KINDS.
KINDS = ['ville', 'village', 'capitale', 'ile', 'plage', 'montagne', 'volcan', 'parc', 'lac', 'cascade', 'gorge',
         'desert', 'glacier', 'cap', 'chateau', 'palais', 'site antique', 'monument', 'site historique', 'musee',
         'temple', 'monastere', 'station', 'parc attractions', 'zoo', 'phare', 'point de vue', 'lagune', 'grotte', 'baie']
K = {k: i for i, k in enumerate(KINDS)}
FCODE = {
    'ISL': 'ile', 'ISLS': 'ile', 'ISLET': 'ile', 'ATOL': 'ile', 'ISLT': 'ile',
    'BCH': 'plage', 'BCHS': 'plage',
    'MT': 'montagne', 'MTS': 'montagne', 'PK': 'montagne', 'PKS': 'montagne', 'VLC': 'volcan',
    'PRK': 'parc', 'RESN': 'parc', 'RESW': 'parc', 'RESF': 'parc',
    'LK': 'lac', 'LKS': 'lac', 'LKN': 'lac', 'FLLS': 'cascade', 'LGN': 'lagune', 'BAY': 'baie', 'COVE': 'baie',
    'CNYN': 'gorge', 'GRGE': 'gorge', 'DSRT': 'desert', 'GLCR': 'glacier', 'CAPE': 'cap', 'CAVE': 'grotte',
    'CSTL': 'chateau', 'PAL': 'palais', 'RUIN': 'site antique', 'ANS': 'site antique', 'AMTH': 'site antique',
    'PYR': 'site antique', 'PYRS': 'site antique', 'MNMT': 'monument', 'HSTS': 'site historique', 'MUS': 'musee',
    'TMPL': 'temple', 'PGDA': 'temple', 'SHRN': 'temple', 'MSTY': 'monastere', 'RSRT': 'station', 'AMUS': 'parc attractions',
    'ZOO': 'zoo', 'LTHSE': 'phare', 'OBPT': 'point de vue',
}
P_SKIP = {'PPLX', 'PPLH', 'PPLQ', 'PPLW', 'PPLCH', 'STLMT'}

# --- 1. noms français et liens Wikipédia
print('noms alternatifs…', flush=True)
fr_name, fr_pref, wiki_fr, wiki_en = {}, {}, {}, set()
with zipfile.ZipFile(os.path.join(SRC, 'alternateNamesV2.zip')) as z:
    with z.open('alternateNamesV2.txt') as f:
        for line in io.TextIOWrapper(f, encoding='utf-8'):
            c = line.rstrip('\n').split('\t')
            lang = c[2]
            if lang == 'fr':
                if c[6] == '1' or c[7] == '1':   # familier ou historique
                    continue
                gid = int(c[1]); pref = c[4] == '1'
                if gid not in fr_name or (pref and not fr_pref.get(gid)):
                    fr_name[gid] = c[3]; fr_pref[gid] = pref
            elif lang == 'link':
                url = c[3]
                if 'fr.wikipedia.org/wiki/' in url:
                    wiki_fr[int(c[1])] = url.split('/wiki/', 1)[1]
                elif 'en.wikipedia.org/wiki/' in url:
                    wiki_en.add(int(c[1]))
print('  noms fr', len(fr_name), 'liens fr', len(wiki_fr), 'liens en', len(wiki_en), flush=True)

# notoriété Wikidata
sitelinks = {}
for line in open(os.path.join(SRC, 'ql.tsv'), encoding='utf-8'):
    c = line.rstrip('\n').split('\t')
    if len(c) < 2 or not c[0].startswith('"'):
        continue
    try:
        gid = int(c[0].strip('"')); sl = int(c[1])
    except ValueError:
        continue
    if sl > sitelinks.get(gid, (0,))[0]:
        t = c[2].strip('<>').split('/wiki/', 1)[1] if len(c) > 2 and '/wiki/' in c[2] else ''
        sitelinks[gid] = (sl, unquote(t))
for gid, (sl, t) in sitelinks.items():
    if t:
        wiki_fr[gid] = t
print('  notoriété wikidata', len(sitelinks), flush=True)

admin1 = {}
for line in open(os.path.join(SRC, 'admin1CodesASCII.txt'), encoding='utf-8'):
    c = line.rstrip('\n').split('\t')
    admin1[c[0]] = c[1]

# --- 2. lieux
print('lieux…', flush=True)
rows = []
stats = collections.Counter()
with zipfile.ZipFile(os.path.join(SRC, 'allCountries.zip')) as z:
    with z.open('allCountries.txt') as f:
        for line in io.TextIOWrapper(f, encoding='utf-8'):
            c = line.rstrip('\n').split('\t')
            fcl, fco = c[6], c[7]
            gid = int(c[0])
            sl = sitelinks.get(gid, (0, ''))[0]
            linked = sl >= 3 or gid in wiki_fr or gid in wiki_en
            pop = int(c[14] or 0)
            kind = None
            if fcl == 'P' and fco not in P_SKIP:
                if fco == 'PPLC':
                    kind = 'capitale'
                elif pop >= 500 or fco.startswith('PPLA') or linked:
                    kind = 'ville' if pop >= 10000 else 'village'
            elif fco in FCODE and linked:
                kind = FCODE[fco]
            if not kind:
                continue
            stats[kind] += 1
            name = c[1]
            nfr = fr_name.get(gid)
            if not nfr and gid in wiki_fr:
                nfr = re.sub(r'\s*\(.*\)$', '', unquote(wiki_fr[gid]).replace('_', ' '))
            nfr = nfr if nfr and nfr != name else 0
            adm = admin1.get(f'{c[8]}.{c[10]}', '')
            rows.append([name, nfr, K[kind], c[8], adm, round(float(c[4]), 3), round(float(c[5]), 3), pop,
                         wiki_fr.get(gid, 0), sl])
print('  ', len(rows), dict(stats.most_common()), flush=True)

# --- 3. écriture
os.makedirs(os.path.join(OUT, 'places'), exist_ok=True)
for fn in os.listdir(os.path.join(OUT, 'places')):
    os.remove(os.path.join(OUT, 'places', fn))
cells = collections.defaultdict(list)
for r in rows:
    la = math.floor(r[5] / CELL) * CELL; lo = math.floor(r[6] / CELL) * CELL
    cells[f'{la}_{lo}'].append(r)
for key, lst in cells.items():
    lst.sort(key=lambda r: (-(r[9] * 20000 + r[7])))
    with open(os.path.join(OUT, 'places', key + '.json'), 'w', encoding='utf-8') as f:
        json.dump(lst, f, ensure_ascii=False, separators=(',', ':'))

# top : grandes villes, capitales, sites touristiques ayant un article Wikipédia
TOURIST = {'ile', 'plage', 'volcan', 'parc', 'cascade', 'gorge', 'desert', 'chateau', 'palais', 'site antique', 'monument',
           'site historique', 'temple', 'monastere', 'station', 'parc attractions', 'lagune', 'grotte', 'point de vue', 'phare'}
def top_ok(r):
    k = KINDS[r[2]]
    if k == 'capitale': return True
    if k == 'ville': return r[7] >= 100000
    if k == 'village': return False
    return r[9] >= 8 and k in TOURIST
top = [r for r in rows if top_ok(r)]
top.sort(key=lambda r: (-r[9], -r[7]))
with open(os.path.join(OUT, 'top.json'), 'w', encoding='utf-8') as f:
    json.dump(top, f, ensure_ascii=False, separators=(',', ':'))
with open(os.path.join(OUT, 'places-meta.json'), 'w', encoding='utf-8') as f:
    json.dump({'cell': CELL, 'cells': sorted(cells), 'kinds': KINDS,
               'fields': ['nom', 'nom_fr', 'type', 'pays', 'region', 'lat', 'lon', 'population', 'wiki_fr', 'notoriete'],
               'source': 'GeoNames (CC BY 4.0), https://www.geonames.org/'}, f, ensure_ascii=False)
print('cases', len(cells), 'max', max(len(v) for v in cells.values()), 'top', len(top),
      'top par type', dict(collections.Counter(KINDS[r[2]] for r in top).most_common()))
