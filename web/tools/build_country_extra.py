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


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None       # une redirection suffit à prouver que la page existe (le site renvoie parfois vers http://)


OPENER = urllib.request.build_opener(NoRedirect)


def status(url):
    req = urllib.request.Request(url, method='HEAD', headers={**UA, 'User-Agent': 'Mozilla/5.0 (Escapade)'})
    try:
        return OPENER.open(req, timeout=30).status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0


def slug(name):
    s = unicodedata.normalize('NFD', name.lower())
    s = ''.join(ch for ch in s if unicodedata.category(ch) != 'Mn')
    s = re.sub(r"[’'`]", '-', s)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


# noms de page du ministère qui diffèrent du nom du pays
MAE_ALIAS = {'CZ': 'republique-tcheque', 'VN': 'vietnam', 'MU': 'maurice', 'CV': 'cap-vert', 'KG': 'kirghizstan', 'GW': 'guinee-bissao',
             'SZ': 'eswatini', 'SR': 'suriname', 'CD': 'republique-democratique-du-congo'}


def mae_slug(cc, name):
    for s in [MAE_ALIAS.get(cc), slug(name)]:
        if not s:
            continue
        for _ in range(2):      # une seconde tentative si le site n'a pas répondu
            code = status(f'https://www.diplomatie.gouv.fr/fr/information-par-pays/{s}/')
            if code in (200, 301, 302, 308): return s
            if code == 404: break
            time.sleep(1)
    return None


countries = json.load(open(os.path.join(ROOT, 'data', 'countries.json'), encoding='utf-8'))
if '--mae-only' in sys.argv:
    path = os.path.join(ROOT, 'data', 'country-extra.json')
    res = json.load(open(path, encoding='utf-8'))
    for i, (cc, c) in enumerate(sorted(countries.items())):
        if 'mae' in res.get(cc, {}) and cc not in MAE_ALIAS: continue
        s = mae_slug(cc, c['n'])
        if s: res.setdefault(cc, {})['mae'] = s
        time.sleep(0.2)
    json.dump(res, open(path, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('conseils', sum('mae' in v for v in res.values()), '/', len(countries))
    sys.exit(0)
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
        s = mae_slug(cc, c['n'])
        if s: o['mae'] = s
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
