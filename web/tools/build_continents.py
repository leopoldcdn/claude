"""Ajoute le continent de chaque pays (champ « ct ») à data/countries.json, pour le filtre « Où » de « Où partir ? ».

Source : countryInfo.txt de GeoNames (https://download.geonames.org/export/dump/countryInfo.txt, CC BY 4.0).
Codes : EU Europe, AF Afrique, AM Amériques (NA + SA réunis), AS Asie (Moyen-Orient compris), OC Océanie.

Usage : python3 web/tools/build_continents.py chemin/vers/countryInfo.txt
"""
import json, os, sys

ROOT = os.path.join(os.path.dirname(__file__), '..')
path = os.path.join(ROOT, 'data', 'countries.json')
cont = {}
for line in open(sys.argv[1], encoding='utf-8'):
    if line.startswith('#') or not line.strip():
        continue
    f = line.rstrip('\n').split('\t')
    cont[f[0]] = {'NA': 'AM', 'SA': 'AM'}.get(f[8], f[8])
data = json.load(open(path, encoding='utf-8'))
missing = []
for cc, c in data.items():
    if cc in cont:
        c['ct'] = cont[cc]
    else:
        missing.append(cc)
json.dump(data, open(path, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('pays', len(data), 'sans continent', missing)
