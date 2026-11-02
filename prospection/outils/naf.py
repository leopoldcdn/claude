# Libellés des divisions NAF rév. 2 (2 premiers chiffres), regroupées pour le filtrage.
DIV = {
 '01':'Agriculture','02':'Sylviculture','03':'Pêche','10':'Industrie alimentaire','11':'Boissons (vins, spiritueux)','13':'Textile','14':'Habillement','16':'Bois','17':'Papier, carton','18':'Imprimerie','20':'Chimie','21':'Pharmacie','22':'Caoutchouc, plastique','23':'Minéraux non métalliques','24':'Métallurgie','25':'Produits métalliques','26':'Électronique','27':'Équipements électriques','28':'Machines','29':'Automobile','30':'Autres matériels de transport (aéronautique, naval)','31':'Meubles','32':'Autres industries','33':'Réparation et installation de machines','35':'Énergie','36':'Eau','37':'Assainissement','38':'Déchets','39':'Dépollution',
 '41':'Construction de bâtiments','42':'Génie civil','43':'Travaux de construction spécialisés','45':'Commerce et réparation automobile','46':'Commerce de gros','47':'Commerce de détail','49':'Transport terrestre','50':'Transport par eau','51':'Transport aérien','52':'Entreposage, logistique','53':'Poste et courrier','55':'Hébergement','56':'Restauration',
 '58':'Édition (dont logiciels)','59':'Audiovisuel','60':'Radio, télévision','61':'Télécommunications','62':'Programmation, conseil informatique','63':'Services d\'information','64':'Services financiers','65':'Assurance','66':'Auxiliaires financiers','68':'Immobilier',
 '69':'Juridique, comptabilité','70':'Conseil de gestion, sièges sociaux','71':'Architecture, ingénierie','72':'Recherche-développement','73':'Publicité, études de marché','74':'Design, photo, autres services spécialisés','75':'Vétérinaire',
 '77':'Location','78':'Emploi, intérim','79':'Voyages','80':'Sécurité','81':'Nettoyage, services aux bâtiments','82':'Services administratifs aux entreprises',
 '84':'Administration publique','85':'Enseignement, formation','86':'Santé','87':'Hébergement médico-social','88':'Action sociale','90':'Arts, spectacles','91':'Culture, patrimoine','92':'Jeux','93':'Sport, loisirs','94':'Organisations associatives','95':'Réparation','96':'Autres services personnels',
}
GROUP = lambda d: ('Numérique et conseil' if d in {'58','62','63','70','71','72','73','74'} else
  'Services aux entreprises' if d in {'69','77','78','80','81','82','64','65','66','68'} else
  'Commerce' if d in {'45','46','47'} else
  'Hôtellerie, restauration, tourisme' if d in {'55','56','79'} else
  'BTP' if d in {'41','42','43'} else
  'Industrie et vins' if d <= '39' else
  'Transport et logistique' if d in {'49','50','51','52','53'} else
  'Santé, social, enseignement' if d in {'75','85','86','87','88'} else 'Autres')
