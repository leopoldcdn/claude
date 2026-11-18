"""Niveau des prix par pays (1 = États-Unis), pour estimer le budget sur place.

Calcul : facteur de conversion PPA (PA.NUS.PPP) / taux de change officiel (PA.NUS.FCRF), Banque mondiale (CC BY 4.0),
dernière année disponible entre 2018 et 2024. Les codes ISO3 sont convertis en ISO2 avec le paquet npm world-countries.

Usage : python3 web/tools/build_prices.py chemin/vers/world-countries/countries.json
"""
import json, os, sys, urllib.request

OUT = os.path.join(os.path.dirname(__file__), '..', 'data', 'prices.json')

def indicator(code):
    url = f'https://api.worldbank.org/v2/country/all/indicator/{code}?format=json&per_page=20000&date=2018:2024'
    rows = json.load(urllib.request.urlopen(url, timeout=60))[1]
    best = {}
    for r in rows:
        k = r['countryiso3code']
        if r['value'] is None or not k:
            continue
        if k not in best or r['date'] > best[k][0]:
            best[k] = (r['date'], r['value'])
    return {k: v for k, (_, v) in best.items()}

ppp, fx = indicator('PA.NUS.PPP'), indicator('PA.NUS.FCRF')
iso2 = {c['cca3']: c['cca2'] for c in json.load(open(sys.argv[1]))}
out = {iso2[k]: round(ppp[k] / fx[k], 3) for k in ppp if k in fx and fx[k] and k in iso2}
json.dump(out, open(OUT, 'w'), separators=(',', ':'), sort_keys=True)
print(len(out), 'pays')
