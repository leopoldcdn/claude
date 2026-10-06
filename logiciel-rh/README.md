# Teamora — aperçu du logiciel RH

Prototype fonctionnel pour ordinateur (largeur minimale 1 024 px, pas de version mobile), sans serveur ni base de données : ouvrez `index.html` dans un navigateur.
Les données de départ (`data.js`, schéma version 8) sont fictives ; vos modifications sont conservées dans le navigateur
(localStorage) et le bouton « Réinitialiser la démo » restaure l'état initial.

- **La roue est le menu** : il n'y a plus de barre latérale. Chaque étape du parcours collaborateur ouvre le module
  qui la gère : Besoin RH et Recrutement → Recrutement ; Vie administrative → Collaborateurs ; Temps & absences → Absences ;
  Rémunération → Paie ; Performance → Entretiens ; puis Formation, Mobilité, Santé & QVT, Relations individuelles.
  Les étapes Pré-embauche, Embauche, Intégration, Préparation du départ, Départ et Après le départ ouvrent une page
  d'étape (personnes concernées, tâches à cocher, passage à l'étape suivante). Au survol, les étapes sortent du cercle
  central. L'accueil ne montre que la roue, sur un fond en dégradé qui bouge lentement : pas de tableau de bord, tout se
  traite dans la rubrique concernée, et la pastille orange d'une étape est la seule alerte (nombre de sujets qui vous
  attendent). Les indicateurs sont dans le Reporting RH.
  Sur les autres pages, un bandeau reprend les mêmes étapes en pictogrammes (avec leur badge) ; le nom s'affiche au survol,
  et le logo ou la maison ramène à la roue.
- **Étapes par profil** : une étape n'apparaît que si le profil a besoin de son module. La Manager voit l'étape
  Rémunération réduite à la révision salariale de son équipe (pas d'accès à la paie). La Salariée ne voit pas Besoin RH ni Recrutement ; Vie administrative ouvre
  « Mon profil », Rémunération « Mes bulletins », et les étapes d'arrivée ou de départ n'apparaissent que lorsque c'est
  son étape en cours.
- **Espace d'une nouvelle recrue** : il est créé dès que le candidat accepte la proposition. Dans le profil Salarié, la
  liste en haut à droite permet de voir l'espace de Léa ou d'une recrue (Aisha, Nathan…). Avant son premier jour, la
  recrue ne voit que « Mon arrivée » (pré-embauche : dépôt de ses pièces, premier jour) et « Contrat de travail »
  (embauche : signature à la main dans un cadre, apposée sur le contrat) ; les autres rubriques s'ouvrent le jour de son
  arrivée. « Contrat de travail » reste ensuite consultable par tout salarié (contrat et avenants).
- **Collaborateurs** : recherche, filtres, tri, fiche détaillée, ajout/modification, départ.
- **Absences** : demande (jours ouvrés, jours fériés, contrôle du solde), validation/refus, planning mensuel, historique.
- **Paie** : préparation du mois (primes), validation, bulletins générés (simulation, taux forfaitaires).
- **Besoins de recrutement** (étape « Besoin RH ») : le manager ne voit que ses besoins et leur statut ; les RH voient tous
  les besoins, avec des compteurs par statut (émis, en attente de validation, à modifier, validés, publiés, refusés) qui
  servent aussi de filtre, et une recherche par référence, intitulé, service et date d'émission ou de publication.
  Référence `BES-AAAA-NNN`, qui devient `OFF-AAAA-NNN` une fois l'offre publiée. Le manager modifie son besoin tant
  qu'il est en brouillon ou « À modifier » ; une fois envoyé, seuls les RH le modifient (jusqu'à la publication).
  Commentaires internes RH ↔ manager, historique de chaque action, motif obligatoire en cas de refus. Une offre publiée
  reste consultable dans Besoins et se suit dans Recrutement. Demande complète (motif, personne remplacée, fourchette de salaire,
  date d'arrivée, priorité, poste prévu ou non au budget), alternatives étudiées avant de recruter avec les talents internes
  issus des souhaits de mobilité, fiche de cadrage (3 à 4 compétences indispensables, atouts, nombre d'entretiens).
  Circuit de validation : RH, puis direction pour une création de poste ou un poste hors budget (la RH saisit la décision
  de la direction dans la démo) ; chaque décision (valider, demander une modification, refuser avec commentaire obligatoire)
  est historisée. À la publication, l'annonce est vérifiée : mentions discriminatoires interdites (âge, sexe, origine,
  santé, situation de famille) bloquantes, conseil « H/F ».
- **Recrutement** : offres publiées (recherche par référence, intitulé, nom de candidat, service, statut, date de
  publication) et pipeline en glisser-déposer. Le manager à l'origine du besoin est rattaché automatiquement à l'offre ;
  les RH peuvent inviter d'autres évaluateurs. Le manager et les RH traitent les candidatures ensemble : le manager
  évalue et fait avancer, les RH font la proposition et les refus. Un clic sur un candidat ouvre sa visionneuse : CV,
  lettre de motivation et autre document à gauche, flèches (ou ← →) pour passer aux autres candidats de la colonne,
  commandes à droite (étape suivante, entretien, message, refus) et historique. Les indicateurs par offre sont dans le
  Reporting RH. Entretiens structurés : après chaque entretien,
  l'interviewer note chaque compétence de la fiche de cadrage avec une preuve et donne un avis (favorable, réservé,
  défavorable) ; la note du candidat en découle. Échanges tracés avec le candidat (accusé de réception avec information
  RGPD, convocation, point d'étape, refus motivé) et alerte au-delà de 7 jours sans nouvelles. Proposition d'embauche
  (poste, rémunération, date d'entrée, délai de réponse, alerte hors fourchette validée), lettre générée, statuts envoyée,
  expirée, acceptée, déclinée, retirée ; l'acceptation fait entrer le candidat en pré-embauche et en embauche. Vivier des
  candidats non retenus ; tout dossier non embauché est supprimé automatiquement 2 ans après le dernier contact.
- **Pré-embauche, Embauche, Intégration** (pages d'étape) : la pré-embauche et l'embauche avancent en parallèle, chacune
  avec sa barre de progression ; la recrue passe automatiquement en intégration quand les deux sont terminées et le
  contrat signé. Pré-embauche : côté RH, état civil, pièces demandées selon le contrat (CDI, CDD, alternance, stage)
  que la recrue dépose et que les RH valident ou refusent avec un motif, vérification du titre de séjour en préfecture
  (2 jours ouvrables avant), contrat généré puis envoyé pour signature ; côté manager, seulement la préparation de
  l'arrivée (poste, matériel, comptes, badge, message de bienvenue) et le parrain. Relances : pièces manquantes à J-10
  (RH et recrue), rappel du premier jour à J-7. Le manager ne voit de l'embauche que l'avancement. Embauche : DPAE dans sa fenêtre légale
  (8 jours avant), registre unique du personnel, informations obligatoires à 7 jours et 1 mois (décret du 30 octobre 2023),
  affectation et période d'essai, mutuelle, prévoyance des cadres, visite d'information et de prévention. Intégration :
  programme commun à toute l'entreprise, que les RH composent (ajouter, renommer, dater, attribuer, supprimer une étape), points à 30, 60 et 90 jours, rapport d'étonnement, période d'essai avec délai de prévenance,
  renouvellement (accord écrit) ou rupture. Les sous-étapes de la roue se cochent toutes seules.
- **Vie administrative** (Collaborateurs) : annuaire, échéancier (titres de séjour, fins de contrat, périodes d'essai,
  visites médicales), demandes de modification des salariés avec justificatif et validation RH, organigramme.
- **Temps de travail** (Absences) : compteurs de congés (solde à poser avant le 31 mai, acquisition en cours), feuilles de
  temps hebdomadaires avec contrôle des durées maximales, heures supplémentaires majorées et payées, contingent de 220 h,
  forfait de 218 jours pour les cadres, quota de télétravail, arrêts de travail (48 h, carence, maintien, attestation DSN,
  subrogation), alerte sur le congé principal.
- **Rémunération** (Paie) : paie du mois avec heures supplémentaires et prime de partage de la valeur, campagne de
  révision salariale (enveloppe, propositions des managers, validation RH, application), écarts femmes-hommes par
  catégorie (seuil de 5 %), partage de la valeur pour les 11-49 salariés, avantages sociaux. Côté salarié : rémunération
  globale et demande d'information sur les salaires moyens de sa catégorie.
- **Performance** : entretien de parcours professionnel tous les 4 ans (loi du 24 octobre 2025), rendez-vous de
  mi-carrière (45 ans) et de fin de carrière (avant 60 ans), volet charge de travail obligatoire pour les cadres au forfait.
- **Formation** : efficacité (satisfaction à chaud, mise en pratique à 3 mois) et financement (plan, OPCO, CPF).
- **Mobilité** : revue des talents (matrice performance × potentiel, risque de départ) et plan de succession des postes clés.
- **Santé** : retours après une longue absence (rendez-vous de liaison, visite de reprise dans les 8 jours) et versions
  annuelles du DUERP conservées 40 ans.
- **Relations individuelles** : date de présentation de la convocation et contrôle du délai de 5 jours ouvrables.
- **Préparation du départ, Départ, Après le départ** (pages d'étape) : préavis Syntec, calendrier de la rupture
  conventionnelle (rétractation, homologation), chiffrage des indemnités, documents de sortie, restitution ; entretien de
  départ et enseignements, passation, fin des accès, portabilité ; archivage, durées de conservation, demandes des anciens
  salariés, réembauche (« boomerang ») vers une offre ouverte.
- **Entretiens** : campagne d'entretiens annuels (planification, auto-évaluation, évaluation manager, signature),
  échéances des entretiens professionnels (tous les 2 ans), objectifs avec avancement, feedback entre collègues.
- **Formation** : catalogue, demande, double validation manager puis RH, budget du plan (réalisé, engagé, restant), évaluation.
- **Mobilité** : offres internes (la candidature arrive dans le pipeline de recrutement), souhaits d'évolution avec avis
  du manager, changement de poste qui met à jour la fiche, l'historique et génère un avenant.
- **Santé & QVT** : visites médicales à organiser (VIP sous 3 mois, périodique sous 5 ans), accidents avec échéance
  CPAM de 48 h, document unique des risques, baromètre QVT anonyme (masqué sous 3 réponses), aménagements de poste.
- **Relations individuelles** : dossiers confidentiels RH avec chronologie et repères de procédure disciplinaire,
  signalements des managers, demandes d'échange des salariés avec réponses.
- **Documents RH** : attestation employeur, avenant, et documents de sortie (certificat de travail, solde de tout
  compte, attestation France Travail) générés au passage à l'étape « Départ ».
- **Reporting RH** (profil RH, bouton en haut à droite et dans le bandeau) : indicateurs du jour (absents, absences à
  valider, postes ouverts, arrivées en cours), suivi des offres (délai, candidatures, passage en entretien, meilleure
  source, entonnoir), effectif, entrées, turnover, absentéisme,
  ancienneté, masse salariale ; graphiques par service, femmes-hommes par catégorie, pyramide des âges, entrées et
  sorties, absences par motif, masse salariale mensuelle, sources de candidatures, baromètre QVT, formation et égalité
  salariale. Info-bulle au survol et tableau de données sous chaque graphique.
- **Profils** : RH (Olivia, 16 étapes), Manager (Thomas, équipe Design, 16 étapes), Salariée (Léa, 8 étapes, ou une recrue) ; les étapes ne sont pas numérotées à l’écran — chacun voit ses propres écrans.

## Matrice des droits

| Rubrique | RH | Manager | Salarié |
| --- | --- | --- | --- |
| Besoins | Voit et modifie tous les besoins jusqu'à la publication, valide, refuse, publie | Crée et voit ses besoins ; modifie en brouillon ou « À modifier » | — |
| Recrutement | Toutes les offres ; évalue, fait avancer, propose, refuse, écrit au candidat, invite des évaluateurs | Offres de ses besoins ou où il est invité ; évalue, planifie, fait avancer, choisit | — |
| Pré-embauche | Pièces, état civil, titre de séjour, contrat, préparation | Préparation de l'arrivée et parrain | La recrue dépose ses pièces (« Mon arrivée ») |
| Embauche | Formalités, registre, informations obligatoires, affectation, dispositifs | Avancement seulement | La recrue signe son contrat (« Contrat de travail ») |
| Intégration | Programme de l'entreprise, suivi, période d'essai | Actions du programme, points de suivi | Son programme, son rapport d'étonnement |
| Reporting RH | Oui | — | — |

Une recrue n'accède qu'à « Mon arrivée » et « Contrat de travail » jusqu'à son premier jour.

Le fichier `index.html` n'a pas de `<!doctype>` : il est conçu pour être publié comme Artifact claude.ai,
qui ajoute lui-même l'en-tête HTML. Il s'ouvre aussi tel quel dans un navigateur.
