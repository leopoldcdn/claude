"""Infos pratiques par pays pour le carnet d'étape : data/country-extra.json

- Wikidata (via le service QLever) : types de prises, tension, côté de conduite, indicatif, numéros d'urgence,
  nom anglais (pour Seat61).
- Liens vérifiés un par un (une requête HEAD, avec une pause) :
  * Conseils aux voyageurs du ministère des Affaires étrangères : /fr/information-par-pays/<slug>/
  * Guide du train de The Man in Seat 61 : https://www.seat61.com/<Country>.htm

Usage : python3 web/tools/build_country_extra.py
"""
import json, os, re, sys, time, unicodedata, urllib.parse, urllib.request

ROOT = os.path.join(os.path.dirname(__file__), '..')
UA = {'User-Agent': 'Escapade/0.1 (projet personnel de site de voyage)'}
QLEVER = 'https://qlever.dev/api/wikidata'

# prises : élément Wikidata -> lettre de la norme internationale
PLUG = {'Q24288454': 'A', 'Q24288456': 'B', 'Q1378312': 'C', 'Q1383497': 'D', 'Q2335536': 'E', 'Q1123613': 'F',
        'Q1528507': 'G', 'Q1266396': 'H', 'Q2335539': 'I', 'Q2335530': 'J', 'Q1502017': 'K', 'Q1520890': 'L', 'Q1653438': 'N'}
LEFT = 'Q11920728'   # circulation à gauche

QUERY = '''PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?iso ?en ?plug ?volt ?side ?call ?emerg WHERE {
  ?c wdt:P297 ?iso . ?c rdfs:label ?en . FILTER(LANG(?en) = "en")
  OPTIONAL { ?c wdt:P2853 ?plug }
  OPTIONAL { ?c wdt:P2884 ?volt }
  OPTIONAL { ?c wdt:P1622 ?side }
  OPTIONAL { ?c wdt:P474 ?call }
  OPTIONAL { ?c wdt:P2852 ?e . ?e wdt:P1329 ?emerg }
}'''


def sparql(q):
    req = urllib.request.Request(QLEVER, data=urllib.parse.urlencode({'query': q}).encode(),
                                 headers={**UA, 'Accept': 'application/sparql-results+json'})
    return json.load(urllib.request.urlopen(req, timeout=180))['results']['bindings']


def status(url):
    req = urllib.request.Request(url, method='HEAD', headers={**UA, 'User-Agent': 'Mozilla/5.0 (Escapade)'})
    try:
        return urllib.request.urlopen(req, timeout=30).status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0


def slug(name):
    s = unicodedata.normalize('NFD', name.lower())
    s = ''.join(ch for ch in s if unicodedata.category(ch) != 'Mn')
    s = re.sub(r"[’'`]", '-', s)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


countries = json.load(open(os.path.join(ROOT, 'data', 'countries.json'), encoding='utf-8'))
out = {cc: {'plugs': set(), 'volt': set(), 'emerg': set()} for cc in countries}
for b in sparql(QUERY):
    cc = b['iso']['value']
    if cc not in out:
        continue
    o = out[cc]
    o['en'] = b['en']['value']
    if 'plug' in b:
        letter = PLUG.get(b['plug']['value'].rsplit('/', 1)[-1])
        if letter: o['plugs'].add(letter)
    if 'volt' in b:
        v = round(float(b['volt']['value']))
        if 90 <= v <= 260: o['volt'].add(v)
    if 'side' in b: o['left'] = b['side']['value'].endswith(LEFT)
    if 'call' in b: o['call'] = b['call']['value']
    if 'emerg' in b and re.fullmatch(r'\d{2,4}', b['emerg']['value']): o['emerg'].add(b['emerg']['value'])

check = '--no-links' not in sys.argv
for i, (cc, c) in enumerate(sorted(countries.items())):
    o = out[cc]
    if check:
        s = slug(c['n'])
        code = status(f'https://www.diplomatie.gouv.fr/fr/information-par-pays/{s}/')
        if code in (200, 301, 302): o['mae'] = s
        if o.get('en'):
            page = o['en'].replace(' ', '_')
            if status(f'https://www.seat61.com/{page}.htm') == 200: o['seat61'] = page
        time.sleep(0.25)
        if i % 25 == 0: print(i, cc, o.get('mae'), o.get('seat61'), flush=True)

res = {}
for cc, o in out.items():
    e = {k: v for k, v in o.items() if k not in ('plugs', 'volt', 'emerg', 'en')}
    if o['plugs']: e['plugs'] = ''.join(sorted(o['plugs']))
    if o['volt']: e['volt'] = sorted(o['volt'])
    if o['emerg']:
        em = sorted(o['emerg'], key=lambda x: (x != '112', len(x), x))
        e['emerg'] = em[:3]
    if e: res[cc] = e
json.dump(res, open(os.path.join(ROOT, 'data', 'country-extra.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('pays', len(res), '· conseils', sum('mae' in v for v in res.values()), '· seat61', sum('seat61' in v for v in res.values()))
