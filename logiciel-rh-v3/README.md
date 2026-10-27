# Teamora V3 — un logiciel RH qui s'adapte à la taille de l'entreprise

> **V3** : Teamora calcule l'effectif à partir des dossiers et fait apparaître les obligations à mesure que l'entreprise
> franchit les seuils (11, 20, 50, 250, 300, 1 000 salariés), avec des alertes avant le franchissement. La V1
> (`logiciel-rh/`) et la V2 (`logiciel-rh-v2/`) sont conservées telles quelles ; chaque version a ses propres données
> dans le navigateur (`teamora-demo-v3`, `teamora-ui-v3`, `teamora-v3-tenant`…). La fenêtre « Nouveautés de la V3 »
> s'ouvre au premier lancement, puis depuis le bas de page.

## Deux versions publiées

- **Version travail** (`index.html`, https://claude.ai/artifact/3eKTwRWJUSKJE93Pw8U8ss) : toutes les options (réinitialiser,
  tester l'installation d'une nouvelle entreprise, nouveautés, Teamo assistant IA). À ne pas partager.
- **Version démo** (`demo.html`, https://claude.ai/artifact/4pHLrU8bBB6Uz6SMuLx7eq) : le lien à partager aux PME testeuses.
  Même code avec `window.TEAMORA_MODE = "demo"` : bas de page réduit à la mention « données fictives », pas d'assistant IA ;
  Teamo y sert de guide : une **visite guidée** se lance à la première ouverture (11 étapes sur ordinateur : roue, points de
  vue, gestion ou espace personnel, à traiter, notifications, barre des rubriques, onglets, obligations selon l'effectif,
  avis, puis « Bientôt : Teamo, ton assistant IA », qui présente ce que fera l'assistant et précise qu'il n'est pas
  disponible dans la démo ; 8 étapes sur téléphone), avec Précédent, Suivant, Passer et Échap, puis se relance avec le bouton « Visite guidée »
  (ou « Revoir la visite guidée » dans le menu Plus sur téléphone). Sur téléphone, la démo s'ouvre dans l'espace salarié.
  La fenêtre des nouveautés ne s'ouvre plus d'elle-même, dans aucune des deux versions.

## Ce qui change par rapport à la V2

### Le socle
- **Effectif** : moyenne des 12 derniers mois en équivalent temps plein (temps partiels au prorata, présence au prorata
  des entrées et sorties), hors apprentis, alternants et stagiaires ; historique des 5 années passées et chiffre
  d'affaires / résultat des 3 dernières années dans Paramètres > Entreprise ; projection à 12 mois à partir des arrivées et
  des départs déjà enregistrés.
- **Règles de franchissement** : immédiate (moyenne sur 12 mois), 12 mois consécutifs (CSE, délégué syndical),
  5 années civiles consécutives (loi PACTE, art. L130-1 du Code de la sécurité sociale) pour la plupart des seuils de
  11, 20, 50 et 250 salariés. Chaque obligation indique sa règle et, si elle n'est pas encore applicable, la date prévue.
- **Page « Obligations selon l'effectif »** (RH, pictogramme document coché dans le bandeau, avec pastille) : effectif,
  courbe des 12 mois passés et prévus, alertes, et toutes les obligations par seuil avec leur état (En place, À faire,
  À vérifier, Information, Non applicable) et un lien vers l'écran qui les traite.
- **Alertes** : seuil qui approche (« Seuil de 20 salariés en novembre 2026 » avec les arrivées prévues), obligation qui
  entre en vigueur (notification aux RH et à la Direction, une seule fois), échéances (fin des mandats du CSE,
  signalement sans accusé de réception…). Elles s'ajoutent à « À traiter ».
- **Simulation (démo)** : simuler un effectif (et depuis quand) pour voir le logiciel s'adapter ; bandeau visible, pas de
  notification pendant la simulation.

- **Teamo connaît l'effectif** (profil RH uniquement) : effectif moyen, années passées, projection, prochain seuil, état de
  chaque obligation qui concerne l'entreprise, obligations du prochain palier et alertes — données agrégées seulement :
  aucun nom, aucun salaire ni montant estimé (qui révélerait la masse salariale), aucun détail sur le handicap, les
  signalements, les référents ou les états des lieux individuels. Une mention dans la fenêtre de Teamo l'indique.

- **Toutes les conventions collectives** (Paramètres > Convention et assistant de démarrage) : champ de recherche parmi
  673 conventions (nom, mot-clé sans accents ou numéro IDCC), plus « Aucune convention : Code du travail ». La liste vient
  de `conventions.js`, extrait du jeu de données KALI de SocialGouv (`@socialgouv/kali-data`, licence Apache-2.0, dernière
  liste complète publiée) ; à remplacer en production par l'API officielle, avec proposition de la convention à partir du
  SIRET (`siret2idcc` / API Recherche d'entreprises). Le nom et l'IDCC apparaissent dans les contrats, la fiche de paie et
  les documents. Syntec (IDCC 1486) garde ses règles intégrées. Pour toute autre convention, Teamora applique les minima du
  Code du travail et affiche « Règles de la convention à vérifier », jusqu'à ce que la RH saisisse dans le panneau
  « Règles de la convention » la période d'essai (par catégorie, renouvellement), les préavis de démission et de
  licenciement (le plus favorable au salarié est retenu) et l'ancienneté requise pour le maintien de salaire (12 mois au
  plus), puis coche « J'ai vérifié ces règles ». Ces règles alimentent la période d'essai, les préavis, la paie
  (maintien de salaire) et la jauge « Espace prêt ». Sans convention, l'essai n'est pas renouvelable.

- **Espace salarié sur téléphone** (écran de 760 px de large ou moins) : barre du haut compacte, onglets Accueil,
  Absences, Paie, Échanges et Plus, accueil en cartes à la place de la roue, fenêtres en plein écran. Fonctions gardées :
  soldes, demandes d'absence et de télétravail, saisie des heures ; bulletins ; coordonnées, demande de modification avec
  justificatif, documents, annuaire ; échanges RH et signalement lanceur d'alerte ; baromètre, visites médicales,
  déclaration d'accident ; pour une nouvelle recrue, dépôt des pièces en photo et programme du premier jour. En
  consultation seule : entretiens et objectifs, formations prévues, contrat à signer (signature sur ordinateur), étapes
  de départ. Sur ordinateur seulement : mobilité interne, aménagement de poste, détail de la rémunération et transparence
  salariale, auto-évaluation et feedback, catalogue de formations, Teamo. Les profils RH et manager voient un écran qui
  les oriente vers l'ordinateur ou leur espace personnel.
  Optimisation (règles d'ergonomie mobile) : zones tactiles de 44 px au moins (Apple 44 pt, Material 48 dp, WCAG 2.5.5),
  champs en 16 px pour éviter le zoom automatique de Safari, textes secondaires de 13,5 px contrastés à 4,5:1 au moins,
  navigation visible en bas d'écran (zone du pouce), trois actions rapides sur l'accueil (poser une absence, dernier
  bulletin, écrire aux RH), demande d'absence placée avant la saisie des heures, boutons d'envoi en pleine largeur, clavier
  téléphonique pour le numéro de téléphone et numérique pour les heures, dépôt de pièces « Photo ou fichier », retour
  visuel au toucher.

- **Donner mon avis** (tests avec des PME) : bouton en bas à gauche sur ordinateur, carte sur l'accueil et entrée du menu
  « Plus » sur téléphone. Le testeur indique l'écran (prérempli), son avis en un mot, l'utilité de 1 à 5, un commentaire,
  et s'il le veut son entreprise et sa taille ; aucun nom n'est enregistré. Les avis sont stockés dans la base de la page
  (`avis/<id du testeur>/r/<avis>`), lisibles par le seul propriétaire, qui les voit avec « Voir les avis reçus ». Quand
  l'enregistrement est impossible (visiteur extérieur à l'organisation, page ouverte hors de claude.ai), l'avis peut être
  publié en commentaire sur la page ou copié pour être envoyé.

- **Rédaction partagée de l'offre** : une fois le besoin validé, le manager demandeur (ou le manager rattaché) et les RH
  rédigent ensemble le projet d'offre (bouton « Rédiger l'offre » et onglet « Projet d'offre » du besoin, auteur et date
  de la dernière modification, liste des contributeurs). Le manager enregistre son projet puis l'envoie aux RH ; seuls les
  RH valident et publient. Le circuit compte une étape « Rédaction de l'offre » avant « Validation et publication », avec
  relance si le manager tarde. Exemple dans la démo : « Illustrateur·rice » (Thomas Petit, Design).

### Les obligations, seuil par seuil
- **Dès le 1er salarié** : DPAE, registre, suivi médical (déjà en place) ; DUERP avec alerte de mise à jour annuelle à
  partir de 11 ; liste des 10 affichages obligatoires ; complémentaire santé (contrôle des 50 %) ; entretien de parcours
  professionnel tous les 4 ans et état des lieux récapitulatif tous les 8 ans (loi du 24 octobre 2025).
- **11** : onglet **Dialogue social** — élections du CSE pas à pas (information, invitation des syndicats, protocole,
  1er et 2nd tours, procès-verbaux, contrôle du délai de 90 jours, carence), mandat de 4 ans, élus, réunions de l'année
  (fréquence attendue selon l'effectif), heures de délégation (barème, dépassement signalé) ; référent harcèlement du
  CSE ; contribution formation 1 % ; versement mobilité (taux dans Paramètres > Paie) ; dispositif de partage de la valeur
  de 11 à 49 salariés (bénéfice ≥ 1 % du chiffre d'affaires 3 ans de suite).
- **20** : onglet **Handicap (6 %)** — bénéficiaires (donnée réservée aux RH), taux, contribution estimée.
- **50** : CSE aux attributions élargies (3 consultations annuelles, budgets de fonctionnement et d'activités sociales,
  BDESE alimentée par Teamora), délégué syndical et négociations annuelles ; onglet **Index égalité** (calcul indicatif à
  4 indicateurs, publication avant le 1er mars) ; règlement intérieur en 5 étapes ; participation ; onglet **Lanceurs
  d'alerte** (canal confidentiel, anonyme possible, dans « Échanges RH » du salarié ; 7 jours et 3 mois) ; abondement du
  CPF ; local de restauration ; pénibilité ; PEEC et FNAL ; alerte de **plan de sauvegarde de l'emploi** au lancement d'un
  départ (licenciements économiques sur 30 jours).
- **250** : index à 5 indicateurs ; référents harcèlement et handicap de l'employeur ; 5 % d'alternants.
- **300** : commissions du CSE (dont CSSCT) ; négociation GEPP.
- **1 000** : écarts femmes-hommes parmi les cadres dirigeants (loi Rixain).

### À faire valider
Les règles de calcul (exclusions, prorata, règle des 5 ans), les règles saisies par convention, les barèmes (index, heures de délégation, contribution
handicap) et les échéances sont des approximations à faire valider par un professionnel du droit social avant toute
commercialisation. Les contributions sont des estimations : le calcul exact reste celui du prestataire de paie.

---

# Teamora V2 (rappel)

> **V2** : cette version applique les recommandations de l'audit RH (logique des étapes et ergonomie). La V1 est conservée
> telle quelle dans `logiciel-rh/`. Les deux versions ont leurs propres données dans le navigateur (`teamora-demo-v1` et
> `teamora-demo-v2`), on peut donc les comparer côte à côte. La fenêtre « Nouveautés de la V2 » (au premier lancement, puis
> en bas de page) liste les évolutions avec un lien vers chacune.

## Ce qui change par rapport à la V1

- **Arrivées et Départs** : pré-embauche, embauche et intégration forment un seul dossier par recrue (liste à gauche,
  dossier à onglets à droite, barres d'avancement par temps) ; préparation, formalités de sortie et après le départ, un
  seul dossier de départ. La roue passe de 16 à 12 rubriques. Le programme d'intégration et l'analyse des départs sont des
  onglets de ces rubriques.
- **« À traiter »** : un bouton en haut rassemble tout ce qui attend le profil, rubrique par rubrique et, pour les arrivées
  et départs, personne par personne. Modèles et Reporting ne sont plus que dans le bandeau de gauche.
- **Statuts réels** : « Arrivée le … », « Essai jusqu'au … », « En intégration », « En poste », « Absent », « Télétravail »,
  « Départ le … · motif », « Sorti » ; les filtres de l'annuaire utilisent ces catégories.
- **Stagiaires** : convention de stage tripartite à la place de la DPAE, du contrat de travail, de la mutuelle et des
  informations obligatoires ; tuteur et gratification ; pas de période d'essai. Une stagiaire (Maëlle Roussel) est ajoutée à
  la démo.
- **Période d'essai d'un CDD** : 1 jour par semaine de contrat, 2 semaines au plus pour 6 mois ou moins, 1 mois au-delà.
- **Fin d'intégration** : la décision sur la période d'essai (juridique) et la clôture de l'intégration (bilan) sont deux
  actions distinctes ; sans période d'essai, le bilan suffit.
- **Absences légales** : maternité, paternité et accueil de l'enfant, événements familiaux (avec plafond par événement),
  enfant malade, accident du travail, congé parental. Les droits sont enregistrés directement, sans validation ; carence
  uniquement pour la maladie ; effets sur la paie. Le télétravail est rangé à part (« Organisation du travail ») et sort du
  reporting d'absentéisme. Visite de reprise proposée après une maternité, un accident du travail de 30 jours ou plus et une
  maladie longue.
- **Direction et remplaçant** : le profil Manager peut être vu sous les traits de n'importe quel manager, dont Claire
  Durand (Direction), qui valide les demandes d'Olivia et des managers. Quand un manager est absent, son propre manager voit
  et valide les demandes de son équipe (« En remplacement de … »).
- **Départs** : 13 motifs regroupés par initiative (démission, retraite, prise d'acte, présomption de démission, rupture
  conventionnelle, licenciements personnel, faute grave, économique, mise à la retraite, fins de CDD, d'apprentissage et
  de stage, décès), avec aperçu du préavis et des indemnités. Le mois de sortie, la paie reprend l'indemnité de congés
  payés, l'indemnité de fin de contrat et l'indemnité de rupture (aussi dans l'export CSV).
- **Changement de situation** : poste, service, manager, salaire et temps de travail se modifient dans un seul formulaire,
  avec date d'effet (le changement entier est programmé si la date est future), historique, et avenant seulement si un
  élément du contrat change.
- **Temps partiel** : quotité sur la fiche, appliquée au salaire de base, au forfait jours et au contrôle du SMIC.
- **Suites d'entretien** : depuis le compte rendu, proposer une formation (envoyée aux RH, déjà validée par le manager) ou
  noter un souhait d'évolution (dans Mobilité) ; le refus d'un entretien professionnel par le salarié est tracé.
- **Journal des actions** : onglet « Journal » de la fiche (RH) — qui a fait quoi, quand, avec quel profil.
- **Teamo, l'assistant d'aide (démo)** : bouton « Teamo » (avatar : bulle souriante aux couleurs de Teamora) en bas à droite de la page publiée sur claude.ai. Il interroge Claude via la
  capacité « sample » de la page (sur le compte Claude de la personne qui consulte, avec son accord) en lui envoyant un guide
  d'utilisation intégré, l'écran ouvert, le profil et le nombre de sujets « À traiter » — aucune donnée de salarié. Les
  réponses peuvent contenir des liens vers les rubriques autorisées pour le profil. Hors claude.ai (fichier ouvert en local),
  le bouton n'apparaît pas. En production, il faudrait un serveur intermédiaire qui appelle l'API Claude : la clé d'API ne
  doit jamais être dans le navigateur.

- **Cohérence services / organigramme** : règle commune aux Paramètres (responsable de chaque service), aux dossiers
  (service et manager) et à l'organigramme — le responsable fait partie de son service, il est en haut de sa branche,
  tous les membres du service sont dans son équipe et chacun remonte jusqu'à la Direction. Le contrôle (Paramètres >
  Services et Direction) liste les écarts avec une correction en un clic ou « Tout corriger » (changements tracés dans
  l'historique) ; l'organigramme affiche une alerte et le nom des services sur la carte qui ouvre chaque branche ; une
  personne peut diriger plusieurs services ; les dossiers en double (même nom) sont détectés, le doublon vide se
  supprime en un clic, et la nouvelle arrivée comme l'import signalent un homonyme ; choisir un service dans un dossier propose son responsable comme manager.
- **Recherche de salarié** : partout où l'on choisit un salarié (manager, successeur, parrain, responsable de service,
  évaluateur, collaborateur concerné…), la liste déroulante devient un champ de recherche : saisie sur le prénom, le nom,
  le poste, le service ou l'e-mail, suggestions au fil de la frappe, flèches et Entrée au clavier, Échap pour annuler.
- **Nouvelle arrivée hors offre** : dans Arrivées, le bouton « Nouvelle arrivée » (RH) crée une recrue sans passer par le
  recrutement (cooptation, candidature spontanée, réembauche, ancien stagiaire ou alternant, recrutement direct, transfert
  de personnel) ; date de fin obligatoire hors CDI, CDD limité à 18 mois, stage à 6 mois, gratification minimale au-delà
  de 2 mois de stage. La recrue entre en pré-embauche et son dossier s'ouvre.
- **Paramètres de l'entreprise** (RH, engrenage dans le bandeau) : tout ce qui était propre à Nova Studio vit désormais
  dans `db.settings` — identité et logo (en tête des documents), signataire, convention (Syntec ou « aucune » = règles du
  Code du travail, qui changent les préavis), durée du travail, forfait jours, télétravail, sites (frais de transport),
  services et responsables, Direction, administrateurs, droits (motif des arrêts masqué aux managers par défaut,
  organigramme visible des salariés), types d'absence optionnels, remplaçant d'un manager absent, paie (prestataire,
  clôture, titres-restaurant, mutuelle, allocation télétravail), recrutement (durée de conservation, relance). Garde-fous :
  erreurs bloquantes pour les valeurs illégales (SIRET à 14 chiffres, 48 h au plus, forfait ≤ 218 jours, mutuelle
  financée à 50 % au moins par l'employeur, conservation des candidatures ≤ 2 ans), avertissements pour les risques
  (clé SIRET, titres-restaurant hors 50–60 %, allocation télétravail au-delà de 2,70 €/jour). Jauge de complétude, liste
  « Reste à régler » et historique des modifications.
- **Import des collaborateurs** : fichier CSV (séparateur `;` ou `,`, en-têtes reconnus même accentués), aperçu avec
  contrôle ligne par ligne (e-mail, doublons, contrat, date), managers reliés par e-mail, services et sites inconnus créés,
  responsables de service et Direction déduits de l'organigramme.
- **Nouvelle entreprise / assistant de démarrage** : en bas de page, « Tester l'installation (nouvelle entreprise) »
  bascule sur une entreprise vierge (`teamora-demo-v2-new`) et ouvre l'assistant en 8 étapes (compte administrateur,
  entreprise, convention, sites, services, collaborateurs, paie, récapitulatif). Ce n'est plus une démo : le sélecteur de
  profils disparaît, l'administrateur garde l'interrupteur « Salariés / Mon espace ». « Revenir à la démo Nova Studio » retrouve la démo intacte (choix mémorisé sous
  `teamora-v2-tenant`).

## Restent à faire (pistes de l'audit non traitées)

Promesse d'embauche formalisée, budget d'effectifs, acquisition des congés pendant un arrêt maladie et fractionnement,
désactivation programmée des accès au dernier jour, questionnaire de départ côté salarié, RQTH, e-mails de notification,
multi-sites (jours fériés, médecine du travail), grilles de classification et minima conventionnels, autres conventions
collectives, import des soldes de congés.

---


Prototype fonctionnel pour ordinateur (largeur minimale 1 024 px, pas de version mobile), sans serveur ni base de données : ouvrez `index.html` dans un navigateur.
Les données de départ (`data.js`, schéma version 8, stockées sous `teamora-demo-v2`) sont fictives ; vos modifications sont conservées dans le navigateur
(localStorage) et le bouton « Réinitialiser la démo » restaure l'état initial.

- **La roue est le menu** : il n'y a plus de barre latérale, ni de parcours chronologique. Chaque rubrique ouvre le module
  qui la gère : Besoin RH et Recrutement → Recrutement ; Vie administrative → Collaborateurs ; Temps & absences → Absences ;
  Rémunération → Paie ; Performance → Entretiens ; puis Formation, Mobilité, Santé & QVT, Relations individuelles.
  Les rubriques Pré-embauche, Embauche, Intégration, Préparation du départ, Départ et Après le départ ouvrent le suivi des
  arrivées et des départs (personnes concernées, points à suivre). Au survol, les rubriques sortent du cercle
  central. L'accueil ne montre que la roue, sur un fond en dégradé qui bouge lentement : pas de tableau de bord, tout se
  traite dans la rubrique concernée, et la pastille orange d'une rubrique est la seule alerte (nombre de sujets qui vous
  attendent). Les indicateurs sont dans le Reporting RH.
  Sur les autres pages, un bandeau reprend les mêmes rubriques en pictogrammes (avec leur badge) ; le nom s'affiche au survol,
  et le logo ou la maison ramène à la roue.
- **Rubriques par profil** : une rubrique n'apparaît que si le profil a besoin de son module. La Manager voit la rubrique
  Rémunération : validation des variables de paie de son équipe et révision salariale (pas d'accès aux bulletins). La Salariée ne voit pas Besoin RH ni Recrutement ; Vie administrative ouvre
  « Mon profil », Rémunération « Mes bulletins », et les rubriques d'arrivée ou de départ n'apparaissent que lorsqu'elle
  est concernée. Il n'y a pas de « parcours » : un collaborateur est en arrivée, en intégration, en poste ou en départ.
  Sa fiche ne montre plus d'étape ; pendant une arrivée, une intégration ou un départ, une carte ouvre le dossier concerné.
- **Deux espaces pour les RH et les managers** : un interrupteur en haut à droite bascule entre la gestion (« Salariés » pour
  les RH, « Mon équipe » pour le manager) et « Mon espace », le menu salarié avec leurs propres congés, bulletins, entretiens
  et documents. La rubrique ouverte est conservée quand elle existe des deux côtés, le choix est mémorisé, et une pastille
  signale ce qui reste à traiter dans l'autre espace. Personne ne valide ses propres demandes : elles partent à son responsable.
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
- **Pré-embauche, Embauche, Intégration** (suivi des arrivées) : la pré-embauche et l'embauche avancent en parallèle, chacune
  avec sa barre de progression ; la recrue passe automatiquement en intégration quand les deux sont terminées et le
  contrat signé. Pré-embauche : côté RH, état civil, pièces demandées selon le contrat (CDI, CDD, alternance, stage)
  que la recrue dépose et que les RH valident ou refusent avec un motif, vérification du titre de séjour en préfecture
  (2 jours ouvrables avant), contrat généré puis envoyé pour signature ; côté manager, seulement la préparation de
  l'arrivée (poste, matériel, comptes, badge, message de bienvenue) et le parrain. Relances : pièces manquantes à J-10
  (RH et recrue), rappel du premier jour à J-7. Le manager ne voit de l'embauche que l'avancement. Embauche : DPAE dans sa fenêtre légale
  (8 jours avant), registre unique du personnel, informations obligatoires à 7 jours et 1 mois (décret du 30 octobre 2023),
  affectation et période d'essai, mutuelle, prévoyance des cadres, visite d'information et de prévention. Intégration :
  programme commun à toute l'entreprise, que les RH composent (ajouter, renommer, dater, attribuer, supprimer une étape), points à 30, 60 et 90 jours, rapport d'étonnement, période d'essai avec délai de prévenance,
  renouvellement (accord écrit) ou rupture. Les points à suivre se cochent tout seuls ; la confirmation de la période d'essai clôt l'intégration.
- **Vie administrative** (Collaborateurs) : annuaire, échéancier (titres de séjour, fins de contrat, périodes d'essai,
  visites médicales), demandes de modification des salariés avec justificatif et validation RH, organigramme.
- **Organigramme** (visible par tous ; le salarié le trouve dans Vie administrative → Organigramme) : arbre de haut en bas,
  équipes sans sous-équipe empilées en colonne, couleur par service, effectifs directs et totaux, équipes repliables
  (mémorisé), recherche et filtres service / site qui mettent en évidence sans casser la hiérarchie, zoom (boutons, Ctrl + molette,
  « Ajuster ») et déplacement à la souris, mode plein écran (bouton en haut à droite, Échap pour sortir). Un clic ouvre la fiche complète pour les RH et le manager de la personne, une fiche
  publique sinon. Les RH changent un rattachement en glissant une carte sur un manager : pendant le glisser, l'arbre se redessine
  avec la personne à sa nouvelle place (carte en pointillés verts « Nouvelle place », liens en vert) ; lâcher sur le manager ouvre la
  confirmation, lâcher ailleurs ou Échap annule. Le bouton « Changer un rattachement » montre le même aperçu :
  date d'effet (immédiate ou programmée), motif, service aligné en option, boucles refusées, notification des trois personnes
  et trace dans l'historique.
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
- **Préparation du départ, Départ, Après le départ** (suivi des départs) : préavis Syntec, calendrier de la rupture
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
- **Profils** : RH (Olivia, 16 rubriques), Manager (Thomas, équipe Design, 16 rubriques), Salariée (Léa, 8 rubriques, ou une recrue) ; les rubriques ne sont pas numérotées à l’écran — chacun voit ses propres écrans.

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
