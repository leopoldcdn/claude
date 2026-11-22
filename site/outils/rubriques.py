"""Carrousel des douze rubriques : contenu, illustrations SVG (style « trait fin ») et génération du HTML.

    python3 site/outils/rubriques.py          met à jour le carrousel dans site/index.html (entre les repères)
                                              et la planche de relecture site/maquettes/carrousel-rubriques.html

Chaque illustration est dessinée à l'encre (traits de 2,5 à 3 px) avec la teinte de sa rubrique sur la roue de
l'application ; la tête jaune du personnage reprend le logo « T humain ». Les textes ne décrivent que ce que fait
le prototype (vérifié dans logiciel-rh-v3/app.js).
"""
import html
import pathlib

ICI = pathlib.Path(__file__).resolve().parent.parent
E = html.escape
INK = '#141834'
HEAD = '#ffd166'
FAMILLES = {'recruter': 'Recruter', 'gerer': 'Gérer', 'developper': 'Développer', 'depart': 'Départ'}

# Ordre de la roue de l'application ; couleurs identiques (STAGE_COLORS de app.js).
RUBRIQUES = [
    ('besoin', 'Besoin RH', 'recruter', '#6366f1',
     'Le manager exprime son besoin, la RH le valide avant toute publication.',
     ['Le manager décrit le besoin en cinq étapes : le poste, la justification et le budget, la fiche de cadrage, les missions et l’annonce, le récapitulatif.',
      'Fourchette de salaire, poste prévu ou non au budget, alternatives étudiées avant de recruter.',
      'La RH ou la direction valide le besoin, ou le refuse avec un motif.'],
     'Pour un CDD, le cas de recours, le motif précis et la durée sont exigés dès le besoin.'),
    ('recrutement', 'Recrutement', 'recruter', '#7c3aed',
     'Offres, candidatures, entretiens et proposition d’embauche, sans tableur.',
     ['Texte d’annonce prêt à diffuser, candidatures rangées par étape.',
      'Relance signalée quand un candidat attend une réponse depuis trop longtemps.',
      'Vivier de candidats pour les recrutements suivants.'],
     'Une candidature non retenue est supprimée au bout de 2 ans, comme le recommande la CNIL.'),
    ('arrivees', 'Arrivées', 'recruter', '#a855f7',
     'Pré-embauche, embauche et intégration réunies dans un seul dossier par recrue.',
     ['Pièces à fournir, DPAE et inscription au registre du personnel suivies une à une.',
      'Contrat de travail généré, puis signé en ligne par la recrue et par l’employeur.',
      'Programme d’intégration et rapport d’étonnement de la recrue.'],
     'La période d’essai suit votre convention collective, renouvellement compris.'),
    ('vie-administrative', 'Vie administrative', 'gerer', '#e11d48',
     'Le dossier de chaque salarié, à jour sans relances.',
     ['Avenants et changements de situation préparés et signés en ligne.',
      'Documents RH rangés dans le dossier et accessibles au salarié.',
      'Alerte avant la fin d’un titre de séjour ou d’un CDD.'],
     'Un changement de contrat ne s’applique qu’à sa date d’effet, une fois signé.'),
    ('temps', 'Temps & absences', 'gerer', '#ea580c',
     'Absences, heures et arrêts validés au même endroit, compteurs à jour.',
     ['Demandes d’absence validées par le manager, soldes de congés et de RTT recalculés.',
      'Feuilles de temps hebdomadaires et heures supplémentaires.',
      'Arrêt de travail : l’attestation de salaire à transmettre est signalée.'],
     'Congés payés : 2,5 jours ouvrables par mois de travail effectif.'),
    ('remuneration', 'Rémunération', 'gerer', '#d97706',
     'Les variables de paie du mois, prêtes pour votre logiciel de paie ou votre cabinet.',
     ['Absences, heures supplémentaires, primes, entrées et sorties rassemblées chaque mois.',
      'Contrôle avant clôture : ce qui manque est signalé avant l’envoi.',
      'Campagne d’augmentations et bulletins mis à disposition des salariés.'],
     'Chaque salaire est comparé au minimum de votre convention collective.'),
    ('performance', 'Performance', 'developper', '#ca8a04',
     'Entretiens annuels, objectifs et entretiens de parcours professionnel.',
     ['Campagne d’entretiens annuels, avec l’auto-évaluation du salarié.',
      'Objectifs suivis au fil de l’année.',
      'États des lieux à 8 ans d’ancienneté préparés à l’avance.'],
     'Entretien de parcours professionnel tous les 4 ans, depuis la loi du 24 octobre 2025.'),
    ('formation', 'Formation', 'developper', '#65a30d',
     'Les demandes, les inscriptions et le suivi des formations.',
     ['Demandes de formation des salariés, validées par le manager et la RH.',
      'Sessions, inscriptions et formations suivies dans chaque dossier.',
      'Évaluation à froid, trois mois après la formation.'],
     'Les formations suivies comptent dans l’état des lieux à 8 ans d’ancienneté.'),
    ('mobilite', 'Mobilité', 'developper', '#16a34a',
     'Les souhaits d’évolution des salariés, étudiés au bon moment.',
     ['Souhaits d’évolution : changement de poste, de service, mobilité géographique.',
      'Un souhait sans réponse remonte dans « À traiter ».',
      'Revue des talents et plan de succession.'],
     ''),
    ('sante', 'Santé & QVT', 'gerer', '#059669',
     'Visites médicales, accidents et prévention suivis avec leurs délais.',
     ['Visite d’information et de prévention à l’embauche, puis suivi périodique.',
      'Accident du travail : la déclaration à faire sous 48 heures est signalée.',
      'Document unique d’évaluation des risques et baromètre de qualité de vie au travail.'],
     'Le document unique est mis à jour au moins une fois par an à partir de 11 salariés.'),
    ('relations', 'Relations individuelles', 'gerer', '#0d9488',
     'Les échanges avec les salariés et les procédures, tracés et datés.',
     ['Demandes d’échange des salariés et signalements des managers.',
      'Procédure disciplinaire guidée : convocation, entretien préalable, notification.',
      'Journal des actions pour garder la trace de chaque étape.'],
     'L’entretien préalable est fixé au moins 5 jours ouvrables après la convocation.'),
    ('departs', 'Départs', 'depart', '#0891b2',
     'Du préavis à l’après-départ, chaque étape est préparée.',
     ['Démission, rupture conventionnelle, licenciement, fin de CDD : le motif fixe les étapes.',
      'Préavis, indemnités et solde de tout compte calculés.',
      'Certificat de travail et attestation France Travail préparés, priorité de réembauche suivie.'],
     'Rupture conventionnelle : 15 jours calendaires de rétractation, puis homologation.'),
]


# ---------------------------------------------------------------- Dessins (viewBox 340 × 210)
def trait(d, w=2.5, c=INK, extra=''):
    return f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"{extra}/>'


def personnage(x, y, bras):
    """Personnage du logo : tête jaune cerclée d'encre, corps en T ; bras = tracé (coordonnées absolues)."""
    return (f'<circle cx="{x}" cy="{y}" r="14" fill="{HEAD}" stroke="{INK}" stroke-width="2.5"/>'
            + trait(f'M{x} {y + 24}V{y + 88}' + bras, 3))


def fond(h, cx=196, cy=110, r=88):
    return f'<rect width="340" height="210" fill="#fff"/><rect width="340" height="210" fill="{h}" opacity=".07"/><circle cx="{cx}" cy="{cy}" r="{r}" fill="{h}" opacity=".08"/>'


def vague(h, x=50, y=184):
    return trait(f'M{x} {y}q16 -8 34 0t34 0', 2.5, h)


def coche(h, x, y, r=22):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" stroke="{h}" stroke-width="2.5"/>' + trait(f'M{x - 10} {y}l7 7 13-14', 3, h)


def texte(x, y, t, taille=10, c=INK):
    return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="{taille}" fill="{c}">{E(t)}</text>'


def d_besoin(h):
    pts = ''.join(f'<circle cx="{146 + 22 * k}" cy="60" r="5.5" fill="{h if k < 4 else "#fff"}" stroke="{INK}" stroke-width="2"/>' for k in range(5))
    return (fond(h) + f'<rect x="128" y="38" width="124" height="148" rx="14" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            + trait('M146 60H234', 2) + pts + trait('M146 83H212M146 100H232M146 112H214M146 158H232M146 170H200')
            + f'<rect x="146" y="124" width="40" height="19" rx="9.5" fill="none" stroke="{INK}" stroke-width="2"/>' + texte(166, 137.5, 'CDD')
            + f'<rect x="192" y="124" width="42" height="19" rx="9.5" fill="{h}" fill-opacity=".25" stroke="{INK}" stroke-width="2"/>' + texte(213, 137.5, '€', 11)
            + personnage(82, 72, 'M58 124L82 108L122 94') + vague(h) + coche(h, 262, 168))


def d_recrutement(h):
    cartes = ''
    for (x, y, on) in [(130, 66, 0), (130, 100, 0), (130, 134, 0), (196, 66, 0), (196, 100, 1), (262, 66, 1)]:
        cartes += (f'<rect x="{x}" y="{y}" width="46" height="26" rx="6" fill="{h if on else "#fff"}" fill-opacity="{.25 if on else 1}" stroke="{INK}" stroke-width="2"/>'
                   f'<circle cx="{x + 11}" cy="{y + 13}" r="5" fill="{HEAD}" stroke="{INK}" stroke-width="1.6"/>' + trait(f'M{x + 21} {y + 13}H{x + 38}', 2))
    return (fond(h, 220, 100, 92) + f'<rect x="120" y="34" width="196" height="148" rx="14" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            + trait('M186 54V172M252 54V172', 1.5, INK, ' opacity=".25"') + trait('M132 48H164M198 48H232M264 48H298')
            + cartes + trait('M244 112q14 -2 18 -16', 2.5, h) + trait('M256 94l6 1 1 6', 2.5, h)
            + personnage(66, 66, 'M44 116L66 102L94 110') + f'<circle cx="104" cy="120" r="14" fill="#fff" stroke="{INK}" stroke-width="3"/>'
            + trait('M114 130L126 142', 4) + vague(h, 30))


def d_arrivees(h):
    cases = ''
    for k, on in enumerate([1, 1, 0]):
        y = 130 + 16 * k
        cases += f'<rect x="100" y="{y}" width="10" height="10" rx="2.5" fill="{h if on else "#fff"}" stroke="{INK}" stroke-width="2"/>' + trait(f'M118 {y + 5}H152', 2)
        if on:
            cases += trait(f'M102.5 {y + 5}l2.5 2.5 4-4.5', 1.8, '#fff')
    return (fond(h, 214, 104, 90) + f'<rect x="156" y="30" width="124" height="152" rx="12" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            + trait('M172 52H236M172 72H262M172 84H250M172 96H258M172 108H240') + trait('M172 158H262', 1.5, INK, ' opacity=".5"')
            + trait('M176 152c6 -14 12 6 18 -6s10 -8 14 4 8 -6 14 0', 2.5, h) + trait('M240 146L270 116', 4) + trait('M240 146l-3 7 7 -3', 2)
            + f'<rect x="90" y="118" width="74" height="62" rx="10" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' + cases
            + personnage(58, 56, 'M30 92H86') + f'<circle cx="300" cy="44" r="4" fill="{h}"/><circle cx="312" cy="62" r="2.5" fill="{h}"/>')


def d_vie_administrative(h):
    return (fond(h, 190, 112, 90)
            + f'<rect x="128" y="44" width="86" height="62" rx="6" fill="#fff" stroke="{INK}" stroke-width="2.5" transform="rotate(-6 171 75)"/>'
            + f'<rect x="170" y="40" width="86" height="62" rx="6" fill="#fff" stroke="{INK}" stroke-width="2.5" transform="rotate(5 213 71)"/>'
            + trait('M182 58H236M182 70H226', 2, INK, ' transform="rotate(5 213 71)"')
            + f'<path d="M110 74h46l12 14h86a10 10 0 0 1 10 10v74a10 10 0 0 1 -10 10H110a10 10 0 0 1 -10 -10V84a10 10 0 0 1 10 -10z" fill="#fff" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>'
            + f'<rect x="122" y="112" width="62" height="16" rx="8" fill="{h}" fill-opacity=".25" stroke="{INK}" stroke-width="2"/>'
            + trait('M122 144H234M122 158H200')
            + f'<rect x="268" y="114" width="50" height="50" rx="8" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' + trait('M268 130H318', 2)
            + trait('M280 108V118M306 108V118', 2.5) + f'<circle cx="293" cy="147" r="6" fill="{h}"/>'
            + f'<path d="M288 74q0 -22 12 -22t12 22l5 7h-34z" fill="#fff" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>'
            + f'<circle cx="300" cy="86" r="3.5" fill="{h}"/>'
            + personnage(58, 70, 'M34 120L58 106L98 112') + vague(h, 28))


def d_temps(h):
    jours = ''.join(f'<circle cx="{142 + 22 * c}" cy="{80 + 18 * r}" r="3" fill="{INK}" opacity=".35"/>' for r in range(2) for c in range(6))
    return (fond(h, 200, 104, 90) + f'<rect x="124" y="34" width="150" height="146" rx="12" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            + trait('M124 60H274', 2) + trait('M150 28V40M248 28V40', 3) + jours
            + f'<rect x="134" y="110" width="116" height="18" rx="9" fill="{h}" fill-opacity=".3"/>'
            + f'<circle cx="143" cy="119" r="7" fill="{h}"/><circle cx="241" cy="119" r="7" fill="{h}"/>'
            + f'<rect x="138" y="146" width="36" height="19" rx="9.5" fill="#fff" stroke="{INK}" stroke-width="2"/>' + texte(156, 159.5, 'CP')
            + f'<rect x="180" y="146" width="42" height="19" rx="9.5" fill="#fff" stroke="{INK}" stroke-width="2"/>' + texte(201, 159.5, 'RTT')
            + f'<circle cx="296" cy="64" r="24" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' + trait('M296 64V50M296 64L306 70', 3, h)
            + personnage(62, 64, 'M38 114L62 100L90 106')
            + f'<rect x="88" y="94" width="18" height="30" rx="4" fill="{h}" fill-opacity=".3" stroke="{INK}" stroke-width="2.5"/>' + vague(h, 26))


def d_remuneration(h):
    return (fond(h, 200, 108, 90) + f'<rect x="100" y="40" width="130" height="136" rx="12" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            + f'<path d="M100 64V52a12 12 0 0 1 12 -12h106a12 12 0 0 1 12 12v12z" fill="{h}" fill-opacity=".3" stroke="{INK}" stroke-width="2.5"/>'
            + trait('M100 64H230M100 88H230M100 112H230M100 136H230M100 160H230', 1.5, INK, ' opacity=".3"') + trait('M160 64V176', 1.5, INK, ' opacity=".3"')
            + trait('M112 76H146M172 76H210M112 100H140M172 100H200M112 124H148M172 124H214M112 148H136M172 148H204', 2)
            + trait('M238 108H262', 3, h) + trait('M254 100l9 8 -9 8', 3, h)
            + f'<path d="M270 74h34l16 16v52h-50z" fill="#fff" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>' + trait('M304 74v16h16', 2.5)
            + texte(295, 122, 'CSV', 11, h)
            + f'<circle cx="100" cy="172" r="17" fill="{h}" fill-opacity=".3" stroke="{INK}" stroke-width="2.5"/>' + texte(100, 177.5, '€', 15)
            + personnage(52, 58, 'M30 112L52 96L92 86'))


def d_performance(h):
    return (fond(h, 170, 112, 92)
            + f'<rect x="112" y="40" width="70" height="36" rx="12" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' + trait('M126 82l-4 10 14 -10', 2.5) + trait('M126 54H168M126 64H156', 2)
            + f'<rect x="166" y="78" width="70" height="36" rx="12" fill="{h}" fill-opacity=".25" stroke="{INK}" stroke-width="2.5"/>' + trait('M222 120l4 10 -14 -10', 2.5) + trait('M180 92H222M180 102H206', 2)
            + trait('M124 166H218', 3) + trait('M136 166V184M206 166V184', 2.5)
            + personnage(90, 74, 'M66 124L90 110L120 120') + personnage(252, 74, 'M276 124L252 110L222 120')
            + f'<path d="M300 34l5.4 11 12.1 1.8 -8.8 8.5 2.1 12 -10.8 -5.7 -10.8 5.7 2.1 -12 -8.8 -8.5 12.1 -1.8z" fill="{h}" stroke="{INK}" stroke-width="2" stroke-linejoin="round"/>')


def d_formation(h):
    return (fond(h, 214, 100, 90) + f'<rect x="150" y="36" width="156" height="104" rx="10" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            + trait('M196 140L182 180M260 140L274 180', 2.5)
            + trait('M168 60H232M168 74H220', 2) + f'<circle cx="172" cy="96" r="4" fill="{h}"/><circle cx="172" cy="114" r="4" fill="{h}"/>' + trait('M182 96H224M182 114H214', 2)
            + f'<rect x="246" y="98" width="12" height="26" rx="2" fill="{h}" fill-opacity=".35" stroke="{INK}" stroke-width="2"/><rect x="264" y="84" width="12" height="40" rx="2" fill="{h}" fill-opacity=".6" stroke="{INK}" stroke-width="2"/><rect x="282" y="70" width="12" height="54" rx="2" fill="{h}" stroke="{INK}" stroke-width="2"/>'
            + personnage(88, 72, 'M64 122L88 108L140 92')
            + f'<path d="M68 60L88 52L108 60L88 68z" fill="{h}" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>' + trait('M104 62v10', 2)
            + vague(h, 40))


def d_mobilite(h):
    noeuds = ''.join(f'<circle cx="{x}" cy="{y}" r="8" fill="{f}" stroke="{INK}" stroke-width="2.5"/>' for x, y, f in [(70, 176, '#fff'), (140, 144, '#fff'), (210, 122, '#fff'), (280, 70, h)])
    return (fond(h, 190, 112, 92) + trait('M70 176L140 144L210 122L280 70', 3) + trait('M270 60l14 6 -4 15', 3)
            + noeuds + trait('M128 166H152M198 144H222', 2, INK, ' opacity=".6"')
            + personnage(210, 30, 'M190 76L210 62L232 52')
            + f'<path d="M300 176c-12 -14 -18 -22 -18 -32a18 18 0 0 1 36 0c0 10 -6 18 -18 32z" fill="{h}" fill-opacity=".3" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>'
            + f'<circle cx="300" cy="144" r="6" fill="#fff" stroke="{INK}" stroke-width="2"/>')


def d_sante(h):
    return (fond(h, 190, 110, 90)
            + f'<path d="M190 162C142 130 130 100 152 80C168 66 184 72 190 84C196 72 212 66 228 80C250 100 238 130 190 162Z" fill="{h}" fill-opacity=".2" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>'
            + trait('M142 112H170L178 96L188 130L198 102L204 112H238', 3, h)
            + f'<rect x="262" y="66" width="56" height="78" rx="8" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            + f'<rect x="278" y="58" width="24" height="14" rx="4" fill="{h}" stroke="{INK}" stroke-width="2"/>'
            + ''.join(f'<rect x="272" y="{86 + 16 * k}" width="9" height="9" rx="2" fill="{h if k < 2 else "#fff"}" stroke="{INK}" stroke-width="2"/>' + trait(f'M288 {90.5 + 16 * k}H308', 2) for k in range(3))
            + personnage(70, 64, 'M42 104H98') + vague(h, 36))


def d_relations(h):
    return (fond(h, 170, 110, 92)
            + f'<rect x="96" y="40" width="80" height="40" rx="12" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' + trait('M108 86l-4 12 16 -12', 2.5) + trait('M110 56H160M110 66H146', 2)
            + f'<rect x="166" y="72" width="80" height="40" rx="12" fill="{h}" fill-opacity=".25" stroke="{INK}" stroke-width="2.5"/>' + trait('M234 118l4 12 -16 -12', 2.5) + trait('M180 88H230M180 98H214', 2)
            + trait('M112 176H228', 2.5)
            + ''.join(f'<circle cx="{x}" cy="176" r="7" fill="{f}" stroke="{INK}" stroke-width="2.5"/>' for x, f in [(112, h), (170, h), (228, '#fff')])
            + personnage(66, 82, 'M44 130L66 116L88 128') + personnage(276, 82, 'M298 130L276 116L254 128'))


def d_departs(h):
    return (fond(h, 214, 108, 92) + f'<rect x="200" y="34" width="90" height="148" rx="6" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            + f'<path d="M200 34L246 46V170L200 182Z" fill="{h}" fill-opacity=".3" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>'
            + f'<circle cx="236" cy="110" r="3.5" fill="{INK}"/>'
            + personnage(152, 60, 'M128 110L152 96L182 84') + trait('M152 148L140 176M152 148L166 174', 3)
            + f'<rect x="40" y="110" width="62" height="74" rx="8" fill="#fff" stroke="{INK}" stroke-width="2.5" transform="rotate(-5 71 147)"/>'
            + f'<rect x="54" y="104" width="62" height="74" rx="8" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' + trait('M66 124H104M66 136H98M66 148H102', 2)
            + coche(h, 112, 172, 15)
            + f'<rect x="38" y="36" width="72" height="22" rx="11" fill="#fff" stroke="{INK}" stroke-width="2"/>' + texte(74, 51, 'Préavis', 10.5)
            + f'<circle cx="310" cy="60" r="4" fill="{h}"/>')


DESSINS = {'besoin': d_besoin, 'recrutement': d_recrutement, 'arrivees': d_arrivees, 'vie-administrative': d_vie_administrative,
           'temps': d_temps, 'remuneration': d_remuneration, 'performance': d_performance, 'formation': d_formation,
           'mobilite': d_mobilite, 'sante': d_sante, 'relations': d_relations, 'departs': d_departs}
ALT = {
    'besoin': 'Un manager présente une fiche de besoin en cinq étapes, avec CDD et budget ; une coche indique la validation.',
    'recrutement': 'Un tableau de candidatures en colonnes, une loupe, une candidature qui passe à l’étape suivante.',
    'arrivees': 'Une recrue accueillie bras ouverts, un contrat signé et une liste de formalités cochées.',
    'vie-administrative': 'Un dossier de salarié avec ses documents, un calendrier et une cloche d’alerte.',
    'temps': 'Un calendrier avec une période de congés, des compteurs CP et RTT, une horloge et un téléphone.',
    'remuneration': 'Un tableau de variables de paie transformé en fichier CSV, une pièce marquée €.',
    'performance': 'Deux personnes en entretien de part et d’autre d’une table, une étoile.',
    'formation': 'Une personne coiffée d’une toque d’étudiant devant un tableau de formation.',
    'mobilite': 'Un chemin qui monte d’étape en étape, une personne en route et un repère de lieu.',
    'sante': 'Un cœur traversé d’un tracé de pouls et une liste de prévention cochée.',
    'relations': 'Deux personnes échangent ; une frise de trois étapes datées.',
    'departs': 'Une personne passe une porte ; documents de sortie cochés et préavis.',
}


def svg(k, h):
    return f'<svg viewBox="0 0 340 210" role="img" aria-label="{E(ALT[k])}">{DESSINS[k](h)}</svg>'


def svg_deco(k, h):
    return f'<svg viewBox="0 0 340 210" aria-hidden="true" focusable="false">{DESSINS[k](h)}</svg>'


# ---------------------------------------------------------------- HTML du carrousel
def carrousel():
    cartes = '\n'.join(f'''          <button type="button" class="rcarte" data-step="{k}" style="--c:{c}" aria-pressed="{"true" if i == 0 else "false"}" aria-controls="etape-{k}">
            <span class="rcarte-ill">{svg_deco(k, c)}</span>
            <span class="rcarte-b"><span class="reye"><i></i>{FAMILLES[f]} · {i + 1} sur 12</span><span class="rcarte-t">{E(n)}</span><span class="rcarte-p">{E(lead)}</span><span class="rcarte-more">Voir le détail <span aria-hidden="true">→</span></span></span>
          </button>''' for i, (k, n, f, c, lead, pts, regle) in enumerate(RUBRIQUES))
    details = '\n'.join(f'''        <article class="detail" id="etape-{k}" data-step="{k}" style="--c:{c}">
          <div class="detail-tete">
            <p class="reye"><i></i>{FAMILLES[f]} · rubrique {i + 1} sur 12</p>
            <h3>{E(n)}</h3>
            <p class="detail-lead">{E(lead)}</p>
          </div>
          <div class="detail-txt">
            <p class="detail-h">Ce que fait Teamora</p>
            <ul>{''.join(f'<li>{E(p)}</li>' for p in pts)}</ul>{f'{chr(10)}            <p class="rule"><b>La règle appliquée</b>{E(regle)}</p>' if regle else ''}
            <a class="btn btn-primary" href="demo/">Essayer dans la démo</a>
          </div>
        </article>''' for i, (k, n, f, c, lead, pts, regle) in enumerate(RUBRIQUES))
    return f'''      <!-- rubriques:debut (généré par site/outils/rubriques.py : modifier le script, pas ce bloc) -->
      <div class="carrousel" id="carrousel">
        <div class="rtrack-wrap">
          <button type="button" class="rnav prev" aria-label="Rubrique précédente"><span aria-hidden="true">←</span></button>
          <div class="rtrack" tabindex="0" role="group" aria-label="Cartes des rubriques, défilement horizontal">
{cartes}
          </div>
          <button type="button" class="rnav next" aria-label="Rubrique suivante"><span aria-hidden="true">→</span></button>
        </div>
      </div>
      <div class="details" aria-live="polite">
{details}
      </div>
      <!-- rubriques:fin -->'''


def maj_index():
    p = ICI / 'index.html'
    s = p.read_text(encoding='utf-8')
    a, b = s.index('      <!-- rubriques:debut'), s.index('<!-- rubriques:fin -->') + len('<!-- rubriques:fin -->')
    p.write_text(s[:a] + carrousel() + s[b:], encoding='utf-8')


def planche():
    cartes = ''.join(f'''<div class="pc" style="--c:{c}"><div class="pi">{svg(k, c)}</div><p><i></i>{FAMILLES[f]} · {i + 1} sur 12</p><b>{E(n)}</b></div>'''
                     for i, (k, n, f, c, *_r) in enumerate(RUBRIQUES))
    page = f'''<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>Carrousel des rubriques : les douze illustrations</title>
<link rel="stylesheet" href="../fonts/polices.css">
<style>
  body {{ margin: 0; background: #f5f5fa; color: {INK}; font: 400 15px/1.5 "Plus Jakarta Sans", sans-serif; }}
  .page {{ width: 1280px; padding: 40px 48px; box-sizing: border-box; }}
  h1 {{ font: 700 26px/1.2 Sora, sans-serif; margin: 0 0 6px; }} .sub {{ margin: 0 0 24px; color: #565c80; }}
  .grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }}
  .pc {{ background: #fff; border: 1px solid #dfe1ee; border-radius: 18px; overflow: hidden; padding-bottom: 12px; }}
  .pi svg {{ display: block; width: 100%; height: auto; }}
  .pc p {{ margin: 10px 14px 0; display: flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 700; color: #565c80; }}
  .pc p i {{ width: 9px; height: 9px; border-radius: 50%; background: var(--c); }}
  .pc b {{ display: block; margin: 2px 14px 0; font: 700 18px/1.2 Sora, sans-serif; }}
</style></head>
<body><div class="page"><h1>Les douze illustrations du carrousel (style « trait fin »)</h1><p class="sub">Chaque carte prend la teinte de sa rubrique sur la roue de l’application ; la tête jaune reprend le logo.</p><div class="grid">{cartes}</div></div></body></html>
'''
    (ICI / 'maquettes' / 'carrousel-rubriques.html').write_text(page, encoding='utf-8')


if __name__ == '__main__':
    import sys
    planche()
    if '--planche' not in sys.argv:
        maj_index()
    print('ok')
