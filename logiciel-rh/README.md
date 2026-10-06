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
- **Paie** (Teamora prépare, un prestataire calcule) : 4 étapes par mois — *Variables* (absences, heures sup., entrées-sorties
  remontées automatiquement ; primes, notes de frais, acomptes saisis ; transport 50 %, titres-restaurant, forfait télétravail ;
  validation des variables par chaque manager), *Contrôles* (SMIC, minimum conventionnel, écart > 20 %, RIB/DPAE des entrants,
  sorties, absences en attente, arrêts sans attestation, heures non validées), *Envoi au prestataire* (export CSV) et *Bulletins*
  (journal de paie, diffusion aux salariés). Bulletin clarifié au format papier : cotisations salariales et patronales par rubrique,
  réduction générale, maladie (carence, IJSS en subrogation, maintien Syntec), net social, PAS au taux personnalisé, cumuls annuels,
  congés N-1/N, mentions légales. Le salarié peut refuser le bulletin électronique (art. L3243-2). Taux de démonstration.
- **Besoins de recrutement** (étape « Besoin RH ») : côté RH, un tableau triable (référence, poste, service, demandeur,
  statut, personne attendue, délai en jours ouvrés, priorité) avec une seule barre de recherche et de filtres ; la vue
  par défaut montre ce qui vous attend. Côté manager, « Mes demandes » : une carte par besoin avec la frise Demande → RH →
  Direction → Publication et la personne attendue. Un besoin s'ouvre dans un panneau latéral (flèches ← → pour passer au
  suivant) : bandeau « Prochaine étape » avec l'action principale, puis les onglets Le besoin, Fiche de cadrage,
  Validation (circuit et journal) et Échanges (commentaires RH ↔ manager, non lus signalés). Création et modification en
  4 étapes avec récapitulatif, brouillon enregistré à chaque étape. Relance automatique de la personne attendue (et du
  manager) au-delà de 5 jours ouvrés. Référence `BES-AAAA-NNN`, puis `OFF-AAAA-NNN` une fois l'offre publiée ; le
  manager modifie son besoin tant qu'il est en brouillon ou « À modifier », ensuite seuls les RH le modifient ; motif
  obligatoire en cas de refus. Demande complète (motif, personne remplacée, fourchette de salaire,
  date d'arrivée, priorité, poste prévu ou non au budget), alternatives étudiées avant de recruter avec les talents internes
  issus des souhaits de mobilité, fiche de cadrage (3 à 4 compétences indispensables, atouts, nombre d'entretiens).
  Circuit de validation : RH, puis direction pour une création de poste ou un poste hors budget (la RH saisit la décision
  de la direction dans la démo) ; chaque décision (valider, demander une modification, refuser avec commentaire obligatoire)
  est historisée. À la rédaction de l'offre, les termes potentiellement discriminatoires (âge, sexe, origine, santé,
  situation de famille) sont signalés en orange, sans bloquer la publication : l'analyse automatique peut se tromper
  (« React Native » n'est plus signalé). Une offre publiée malgré une alerte le garde dans son historique ; conseil « H/F ».
- **Recrutement** : trois onglets. « À traiter » (vue par défaut) regroupe les actions qui vous attendent, toutes offres
  confondues : candidatures à trier, évaluations à remplir, propositions à préparer, candidats sans nouvelles depuis plus
  de 7 jours ; son total est la pastille de la roue. « Offres » : tableau triable (référence, poste, service, manager,
  candidats actifs, à traiter, en ligne depuis, statut) avec recherche par référence, intitulé ou nom de candidat. Une
  offre s'ouvre sur toute la largeur : en-tête sur une ligne, onglets Candidats (tableau en colonnes, « Embauché » et
  « Refusé » repliées) et L'offre (description, fiche de cadrage, équipe de recrutement). « Vivier » (RH). Le manager à
  l'origine du besoin est rattaché à l'offre ; les RH peuvent inviter d'autres évaluateurs ; le manager évalue et fait
  avancer, les RH font la proposition et les refus. La fiche d'un candidat montre ses documents à gauche (CV, lettre,
  autre document, flèches ← → pour passer au suivant de la colonne) et, à droite, un bandeau « Prochaine étape » avec
  l'action principale (trier, planifier un entretien, évaluer, préparer la proposition, enregistrer la réponse), puis les
  onglets Évaluation, Entretiens, Échanges, Profil et Historique. Les indicateurs par offre sont dans le Reporting RH. Entretiens structurés : après chaque entretien,
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
- **Modèles de documents** (profil RH, bouton « Modèles ») : les RH rédigent eux-mêmes chaque document et chaque
  courrier aux candidats : contrats (CDI, CDD, apprentissage, stage), informations à 7 jours et à 1 mois, fin de période
  d'essai, avenant, attestation employeur, certificat de travail, solde de tout compte, attestation France Travail,
  proposition d'embauche et 8 messages aux candidats (accusé de réception, convocation, refus…). Éditeur avec titres,
  gras et listes ; champs automatiques insérés d'un clic (nom, poste, salaire, dates…), remplis depuis le dossier ;
  champs à saisir créés par les RH (ex. motif du CDD), complétés à la création du document. Les mentions obligatoires
  manquantes sont signalées et bloquent l'enregistrement. Chaque enregistrement crée une version ; on peut prévisualiser
  avec un exemple et rétablir une version précédente ou le modèle d'origine.
- **Documents RH** : chaque document naît en brouillon, visible des RH seulement : zones jaunes à compléter, texte
  modifiable. Remis au salarié (ou signé pour un contrat), il est figé et garde la version du modèle qui a servi.
  Un contrat envoyé pour signature reste modifiable jusqu'à la signature (le salarié est prévenu). Les documents de
  sortie sont préparés en brouillon et remis ensemble au dernier jour.
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
