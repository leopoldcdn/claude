import json, sys, html, csv, datetime
sys.path.insert(0, sys.argv[1]); from naf import DIV, GROUP
raw = json.load(open(sys.argv[1] + '/raw2.json')).values()
IDCC = {'2332':'Architecture','2205':'Notariat','2543':'Géomètres-experts','915':'Expertises en évaluations','3168':'Photographie','1710':'Agences de voyages et de tourisme','1875':'Cabinets et cliniques vétérinaires','3242':'Presse quotidienne et hebdomadaire','3245':'Opérateurs de voyages et guides','1486':'Syntec (bureaux d\'études, numérique, conseil)','1979':'Hôtels, cafés, restaurants','2216':'Commerce de détail et de gros alimentaire','1597':'Bâtiment (ouvriers, + de 10 salariés)','1596':'Bâtiment (ouvriers, jusqu\'à 10 salariés)','2609':'Bâtiment (ETAM)','2420':'Bâtiment (cadres)','3248':'Métallurgie','1516':'Organismes de formation','1501':'Restauration rapide','573':'Commerces de gros','3043':'Propreté','1090':'Services de l\'automobile','2098':'Prestataires de services du tertiaire','1527':'Immobilier','787':'Cabinets d\'expertise comptable','1000':'Cabinets d\'avocats','2264':'Hospitalisation privée','1517':'Commerces de détail non alimentaires','1505':'Commerce de détail fruits et légumes, épicerie','2941':'Aide à domicile','1351':'Prévention et sécurité','2511':'Sport','1480':'Journalistes','2378':'Travail temporaire (permanents)','1043':'Gardiens, concierges','3127':'Services à la personne','2121':'Édition','1018':'Distribution des films','2120':'Banque','1672':'Sociétés d\'assurances','2596':'Coiffure','1702':'Travaux publics (ouvriers)','2614':'Travaux publics (ETAM)','3212':'Travaux publics (cadres)','16':'Transports routiers','1266':'Restauration de collectivités','1747':'Activités industrielles de boulangerie-pâtisserie','2149':'Activités du déchet','2148':'Télécommunications','1555':'Fabrication et commerce des produits pharmaceutiques','2335':'Personnel des agences générales d\'assurances','86':'Publicité','1740':'Bâtiment région parisienne','5021':'Statut des fonctionnaires','2706':'Personnel des administrateurs et mandataires judiciaires','1606':'Bricolage','2156':'Grands magasins','2198':'Vente à distance','1513':'Eaux et boissons sans alcool','493':'Vins, cidres, spiritueux','1659':'Rouissage, teillage du lin','2272':'Assainissement et maintenance industrielle','1404':'Machines agricoles et TP (commerce, réparation)','1412':'Installation sanitaire, chauffage, climatisation','2022':'Mutualité','3109':'Industries de la bijouterie','1388':'Industrie du pétrole','650':'Métallurgie (cadres, ancienne)'}
TR = {'12': '20 à 49', '21': '50 à 99'}
METRO = {'33003','33004','33013','33032','33039','33056','33063','33065','33069','33075','33096','33119','33162','33167','33192','33200','33249','33273','33281','33312','33318','33376','33434','33449','33487','33519','33522','33550'}
rows = []
for r in raw:
    s = r['siege']
    # Siège à Bordeaux ou dans une commune de Bordeaux Métropole (28 communes).
    if s.get('commune') not in METRO: continue
    nj = str(r.get('nature_juridique') or '')
    if not nj.startswith('5'): continue                 # sociétés commerciales seulement (pas d'associations ni d'organismes publics)
    tr = r.get('tranche_effectif_salarie')
    if tr not in TR: continue
    naf = s.get('activite_principale') or r.get('activite_principale') or ''
    div = naf[:2]; grp = GROUP(div) if div in DIV else 'Autres'
    if div in {'84', '94'}: continue
    idcc = [i.lstrip('0') for i in (s.get('liste_idcc') or []) if i and i != '9999']
    ca = None; fin = r.get('finances') or {}
    if fin:
        y = max(fin); ca = (fin[y] or {}).get('ca'); ca_y = y
    tech = grp in {'Numérique et conseil', 'Services aux entreprises'}
    prio = 'A' if tr == '12' and tech else 'B' if tech or tr == '12' else 'C'
    rows.append({ 'nom': r.get('nom_complet') or r.get('nom_raison_sociale'), 'siren': r['siren'], 'tranche': TR[tr], 'annee_eff': r.get('annee_tranche_effectif_salarie') or '',
      'secteur': grp, 'activite': DIV.get(div, naf), 'naf': naf, 'convention': ', '.join(IDCC.get(i, f'IDCC {i}') for i in idcc[:2]), 'syntec': '1486' in idcc,
      'adresse': s.get('adresse') or '', 'ville': (s.get('libelle_commune') or '').title(), 'creation': (r.get('date_creation') or '')[:4], 'ca': ca, 'ca_annee': ca_y if ca else '', 'prio': prio, 'cabinet': naf.startswith('69.20'),
      'fiche': f"https://annuaire-entreprises.data.gouv.fr/entreprise/{r['siren']}" })
rows.sort(key=lambda x: (x['prio'], x['secteur'], x['nom'] or ''))
out = sys.argv[2]
with open(out + '/pme-bordeaux-metropole.csv', 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f, delimiter=';'); w.writerow(['Priorité', 'Entreprise', 'SIREN', 'Salariés', 'Année effectif', 'Secteur', 'Activité', 'Code NAF', 'Convention collective', 'Adresse', 'Création', 'CA (€)', 'Année CA', 'Fiche publique'])
    for x in rows: w.writerow([x['prio'], x['nom'], x['siren'], x['tranche'], x['annee_eff'], x['secteur'], x['activite'], x['naf'], x['convention'], x['adresse'], x['creation'], x['ca'] or '', x['ca_annee'], x['fiche']])
tpl = open(sys.argv[1] + '/page.html', encoding='utf-8').read()
page = tpl.replace('/*DATA*/[]', json.dumps(rows, ensure_ascii=False)).replace('{{DATE}}', datetime.date.today().strftime('%d/%m/%Y'))
open(out + '/pme-bordeaux.html', 'w', encoding='utf-8').write(page)
from collections import Counter
print(len(rows), Counter(x['prio'] for x in rows), Counter(x['tranche'] for x in rows), Counter(x['secteur'] for x in rows).most_common())
