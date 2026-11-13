"""Écrit voix-off.md à partir des repères réels de la vidéo.
usage : python3 make_voixoff.py info.json ../voix-off.md"""
import json, re, sys

d = json.load(open(sys.argv[1]))['info']
cues, T = d['cues'], d['T']


def tc(t):
    return '%d:%04.1f' % (int(t // 60), t % 60)


words = sum(len(re.findall(r"[\wàâéèêëîïôùûçœ'’-]+", c['say'])) for c in cues)
voice_end = T['K1']
blocks = [('A', 'Accroche'), ('B', 'De quoi on parle'), ('C', 'Le scénario'), ('D', 'Relance 1 : est-ce rare ?'),
          ('I', "Le signal d'alerte"), ('E', 'Relance 2 : le mécanisme supposé'), ('F', 'Relance 3 : la couleur'),
          ('G', 'Révélation : le dossier'), ('H', 'Ce que ça change'), ('J', 'Boucle')]
vis = {
    'A1': 'Titre ; les deux kiwis passent au bleu à 0:00,4', 'A2': 'Tampon « CONNU DE TOUS »', 'A3': 'Tampon « LA SCIENCE : ? »',
    'B1': 'Pictogramme, pointillés, loupe avec les deux kiwis', 'B2': 'Étiquette « PAR DEUX »', 'B3': 'La ceinture se pose',
    'C1': "La jauge monte, l'horloge tourne", 'C2': 'Panneau STOP', 'C3': "Enclume, les kiwis s'affaissent ; « LOURDEUR », « GÊNE »",
    'C4': 'Étiquette « DOULEUR »', 'D1': '« RARE ? » puis tampon « NON. »', 'D2': 'Tampon « SONDAGE EN LIGNE », dix pictogrammes',
    'D3': 'Cinq pictogrammes et demi passent au bleu, « 56 % »', 'D4': 'Étiquette « DÉJÀ RESSENTI »',
    'D5': '« SOUVENT LÉGER », kiwis soulagés', 'D6': 'Minuteur, « QUELQUES MINUTES »',
    'I1': "Fond rouge, triangle d'alerte", 'I2': '« DOULEUR BRUTALE » puis « ET FORTE »', 'I3': '« → URGENCES » clignote',
    'E1': '« LÀ-DEDANS ? », la loupe grossit', 'E2': 'Tampon « HYPOTHÈSE », gros tuyau rouge qui arrive',
    'E3': 'Petit tuyau de sortie, escargot', 'E4': 'Manomètre dans le rouge, le kiwi gonfle', 'E5': 'Étiquette « NOM SAVANT »',
    'E6': 'Ruban « HYPERTENSION » puis « ÉPIDIDYMAIRE »', 'F1': '« ET LE BLEU ? »',
    'F2': 'Deux fiches arrivent : Healthy Male, Cleveland Clinic', 'F3': 'La fiche de gauche bouge, les kiwis bleuissent',
    'F4': 'La fiche de droite bouge, ils redeviennent bruns ; tampon « QUESTION OUVERTE »',
    'G1': 'Le dossier tombe sur la table', 'G2': "Il s'ouvre : un papillon s'en échappe, « PRESQUE VIDE »",
    'G3': 'Feuille « 1954, DES ENTRETIENS »', 'G4': 'Feuille « 2000, UN CAS DÉCRIT »', 'G5': 'Feuille « 2023, UN SONDAGE EN LIGNE »',
    'G6': 'Tampon « MÉCANISME : JAMAIS MESURÉ »', 'G6b': '(le tampon reste)', 'G7': 'Tampon « LE BLEU : AUCUNE PREUVE SOLIDE »',
    'H1': 'Tampon « MÊME SONDAGE », dix pictogrammes', 'H2': 'Quatre passent au rose, « 4 SUR 10 »',
    'H3': "« ON M'A MIS LA PRESSION »", 'H3b': '(la citation reste)', 'H4': '« ÇA PASSE TOUT SEUL », kiwis sereins',
    'H5': 'Gros tampon « JAMAIS UN ARGUMENT »', 'J1': 'Retour du titre et des kiwis bleus', 'J2': 'Tampon « CONNU DE TOUS »',
    'J3': 'Tampon « LA SCIENCE : À SUIVRE »',
}
o = []
o.append('# Voix off : « Pourquoi a-t-on les kiwis bleus ? »\n')
o.append('Texte à lire soi-même, sans voix synthétique. Les nombres sont écrits en lettres.\n')
o.append(f'- **Longueur** : {words} mots.')
o.append(f"- **Durée de la voix** : environ {round(voice_end)} secondes (dernier mot à {tc(voice_end)}), pour une vidéo de {d['DUR']:.1f} secondes. "
         "Les dernières secondes sont sans voix : l'appel à l'action est à l'écran.")
o.append('- **Débit visé** : seize à dix-sept caractères par seconde, soit environ cent soixante-cinq mots par minute, pauses comprises. '
         "C'est un débit posé : inutile d'accélérer.")
o.append('- **Accroche** : onze mots.')
o.append(f"- **Relances** : à {tc(T['D1'])} (« Rare ? »), {tc(T['I1'])} (« Seule alerte »), {tc(T['E1'])} (« Que se passe-t-il ? ») et {tc(T['F1'])} (« Et le bleu ? »).")
o.append(f"- **Révélation** : elle s'ouvre à {tc(T['G1'])}, soit {round(100 * T['G1'] / voice_end)} % de la voix, et se termine par les deux tampons "
         f"entre {tc(T['G6'])} et {tc(T['G7'] + 1.9)}. Son centre tombe aux deux tiers.")
o.append('- **Boucle** : la dernière phrase reprend la première, et la dernière image est identique à la première.\n')
o.append('## Texte continu\n')
for k, name in blocks:
    txt = ' '.join(c['say'] for c in cues if c['sc'] == k and c['say'])
    t0 = min(c['t0'] for c in cues if c['sc'] == k)
    o.append(f'**[{tc(t0)}] {name}**\n\n{txt}\n')
o.append(f"*De {tc(T['K1'])} à la fin, à l'écran seulement : « Envoie ça à quelqu'un qui dit encore “les kiwis bleus”. » "
         'Si tu préfères le dire, il faut le caser en deux secondes et demie.*\n')
o.append("## Repères pour l'enregistrement\n")
o.append("Chaque ligne correspond à un sous-titre incrusté. Pour rester calé, enregistre en regardant la vidéo "
         "et commence chaque phrase quand son sous-titre apparaît.\n")
o.append("| Début | Fin | Phrase | À l'image |\n|---|---|---|---|")
for c in cues:
    if c['say']:
        o.append(f"| {tc(c['t0'])} | {tc(c['t0'] + c['sub'])} | {c['say']} | {vis.get(c['id'], '')} |")
o.append(f"| {tc(T['K1'])} | {tc(d['DUR'])} | *(sans voix)* | Appel à l'action, puis retour à l'image de départ |")
o.append('\n## Conseils de lecture\n')
o.append('- Marquer un vrai temps avant « La vraie surprise » : c\'est le pivot.')
o.append('- « Épididymaire » se prononce é-pi-di-di-mère. Le dire lentement : le nom savant est un ressort comique.')
o.append("- Ton d'un ami qui a lu les études, pas d'un médecin qui sermonne. Sourire sur les kiwis, sérieux sur « jamais un argument » et sur les urgences.")
o.append('- Le mot « kiwis » remplace partout le terme anatomique. Ne pas en employer d\'autre, même en improvisant.')
open(sys.argv[2], 'w', encoding='utf-8').write('\n'.join(o) + '\n')
print(words, 'mots ; voix', round(voice_end, 1), 's ; vidéo', round(d['DUR'], 1), 's')
