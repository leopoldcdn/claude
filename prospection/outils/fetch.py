import json, time, urllib.request, os
store = 'raw2.json'
import sys
SEC = sys.argv[1] if len(sys.argv) > 1 else ''
out = json.load(open(store)) if os.path.exists(store) else {}
state = {}
for tr in ['12', '21']:
    page, pages = state.get(tr, 1), 10**6
    while page <= pages:
        url = f"https://recherche-entreprises.api.gouv.fr/search?code_commune=33063&tranche_effectif_salarie={tr}&etat_administratif=A&categorie_entreprise=PME{('&section_activite_principale=' + SEC) if SEC else ''}&per_page=25&page={page}"
        d = None
        for a in range(10):
            try:
                d = json.load(urllib.request.urlopen(url, timeout=30)); break
            except Exception as e:
                print('attente', tr, page, type(e).__name__, flush=True); time.sleep(15 + 10 * a)
        if d is None: print('abandon', tr, page, flush=True); raise SystemExit(1)
        pages = d.get('total_pages', 1)
        for r in d['results']: out[r['siren']] = r
        page += 1; state[tr] = page
        json.dump(out, open(store, 'w')); json.dump(state, open('state.json', 'w'))
        print(tr, page - 1, '/', pages, len(out), flush=True)
        time.sleep(2.5)
print('FIN', len(out), flush=True)
