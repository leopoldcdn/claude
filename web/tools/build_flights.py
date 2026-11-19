"""Aéroports et liaisons aériennes directes : web/data/flights.json

Sources :
- aéroports : OurAirports (domaine public), https://ourairports.com/data/ — grands et moyens aéroports avec vols
  réguliers et code IATA ;
- liaisons : OpenFlights routes.dat et airlines.dat (ODbL), https://openflights.org/data — vols directs
  (sans escale), compagnies. Attention : la base des liaisons date de 2014 ; certaines lignes ont fermé,
  d'autres ont ouvert depuis. L'application la présente comme « liaisons connues, à vérifier ».

Format : { airports: [[iata, nom, ville, pays, lat, lon, grand(0/1)]], airlines: {code: nom},
           routes: [[i, j, "AF,KL"]] }  (i < j : indices dans airports ; liaison dans un sens ou l'autre)

Usage : python3 web/tools/build_flights.py <airports.csv> <routes.dat> <airlines.dat>
"""
import csv, json, os, sys, collections

OUT = os.path.join(os.path.dirname(__file__), '..', 'data', 'flights.json')
ap_csv, routes_dat, airlines_dat = sys.argv[1:4]

airports, idx = [], {}
for r in csv.DictReader(open(ap_csv, encoding='utf-8')):
    if r['type'] not in ('large_airport', 'medium_airport') or r['scheduled_service'] != 'yes': continue
    code = (r['iata_code'] or '').strip()
    if len(code) != 3 or code in idx: continue
    idx[code] = len(airports)
    airports.append([code, r['name'], r['municipality'] or '', r['iso_country'], round(float(r['latitude_deg']), 4),
                     round(float(r['longitude_deg']), 4), 1 if r['type'] == 'large_airport' else 0])

airlines = {}
for row in csv.reader(open(airlines_dat, encoding='utf-8')):
    if len(row) >= 8 and row[3] and row[3] not in ('\\N', '-', '') and row[7] == 'Y':
        airlines[row[3]] = row[1]

pairs = collections.defaultdict(set)
for row in csv.reader(open(routes_dat, encoding='utf-8')):
    if len(row) < 9 or row[7] != '0': continue          # vols directs uniquement
    a, b, al = row[2], row[4], row[0]
    if a not in idx or b not in idx or a == b: continue
    i, j = sorted((idx[a], idx[b]))
    pairs[(i, j)].add(al)

used_al = {al for s in pairs.values() for al in s}
routes = [[i, j, ','.join(sorted(s))] for (i, j), s in pairs.items()]
json.dump({'airports': airports, 'airlines': {k: v for k, v in airlines.items() if k in used_al}, 'routes': routes},
          open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
print('aéroports', len(airports), 'liaisons', len(routes), 'compagnies', len(used_al))
