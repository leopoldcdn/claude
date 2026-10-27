# Tronçon 2 : l'arrivée, de l'embauche à la fin de la période d'essai

> Copie du rapport de test. Les captures marquées d'un lien sont copiées dans `captures/` ; les autres sont restées dans le dossier de travail du test et ne sont pas jointes.

Test joué le 27 octobre 2026 (date système) sur `index.html`, démo Nova Studio (Syntec, IDCC 1486), avec Chromium et playwright-core, à 1440×900 puis à 390×844 (isMobile). Les scripts sont dans `audit/arr/` (`s2.js` à `s13.js`). L'état a été gardé d'un script à l'autre grâce à un profil de navigateur persistant. Les seuls retours en arrière ont été des restaurations de ce profil, jamais des modifications de l'état interne.

Recrues créées pour le test : **Hugo Lambert** (CDI cadre), **Chloé Garnier** (CDD de 6 mois), **Tom Girard** (stage de 5,7 mois), **Léna Petitjean** et **Zoé Marchand** (stages courts), **Paul Retard** (CDI dont la date d'arrivée est déjà passée). J'ai aussi utilisé les recrues de la démo : Aisha (hors UE), Nathan, Emma et Maëlle.

## 1. Parcours réalisé

| # | Étape | Profil | Résultat |
|---|---|---|---|
| 1 | Ouvrir Arrivées depuis la roue (il faut d'abord déplier le « hub ») | RH | ✅ |
| 2 | « Nouvelle arrivée » envoyée vide : message d'erreur clair | RH | ✅ |
| 3 | CDI cadre Hugo Lambert avec un salaire de **12 000 €/an** : **accepté sans aucun avertissement** | RH | ❌ |
| 4 | CDD Chloé : fin manquante, 19 mois, fin avant le début → tous refusés. 6 mois à **15 000 €/an** → accepté. **Aucun champ motif** | RH | ⚠️ |
| 5 | Stage Tom : 7,7 mois refusé ; gratification de 0 € puis de 500 €/mois refusée ; 660 €/mois acceptée. Stage de 2 mois sans gratification accepté | RH | ✅ |
| 6 | Homonyme « Léa Martin » repéré | RH | ⚠️ message hors sujet |
| 7 | La recrue Hugo (`#as-emp`) ne voit que « Mon arrivée » et « Contrat de travail ». Elle dépose 5 pièces (PNG, PDF, faux PDF de 1 Mo) | Salarié | ✅ |
| 8 | Côté RH : aperçu des pièces, 3 validées, RIB refusé (« Ce n'est pas le document demandé »), justificatif de domicile refusé (« Autre », motif obligatoire) | RH | ✅ |
| 9 | La recrue voit les deux refus avec leur motif (pastille et notification), puis redépose le RIB | Salarié | ✅ |
| 10 | Génération du contrat CDI : zones jaunes, envoi bloqué tant qu'elles sont vides, puis envoi pour signature | RH | ✅ procédure / ❌ contenu (35 h pour un cadre au forfait, 12 000 €) |
| 11 | La recrue signe au canvas `#sig-pad`. Sans tracé ou sans la case « lu et approuvé », la signature est refusée. Le contrat signé est figé | Salarié | ✅ / ⚠️ pas de téléchargement, pas de signature employeur |
| 12 | Contrat CDD : le motif est un champ libre obligatoire. **Un contrat déjà envoyé reste modifiable (« Modifier »)** | RH | ⚠️ |
| 13 | DPAE de Hugo : « possible dès le 15 nov. » (J-8) | RH | ✅ |
| 14 | DPAE d'Aisha faite avec 2 pièces sur 5 et **sans vérification du titre de séjour** | RH | ❌ |
| 15 | Hugo inscrit au registre 27 jours avant son embauche ; registre sans année, mal ordonné, sans export | RH | ❌ |
| 16 | Informations obligatoires à 7 jours et à 1 mois (Nathan) : modèles corrects, remis en retard sans blocage | RH | ✅ / ⚠️ |
| 17 | Mutuelle mise en « Dispense » **sans justificatif ni demande écrite** | RH | ❌ |
| 18 | VIP planifiée automatiquement à J+21 ; pour Paul, **après la date limite** | RH | ⚠️ |
| 19 | Nathan passe automatiquement en intégration, alors que la **prévoyance cadre n'est pas faite** | RH | ⚠️ |
| 20 | Emma : rupture de l'essai le dernier jour refusée ; **rupture fixée 11 jours après la fin de l'essai acceptée** | RH | ❌ |
| 21 | Nathan : renouvellement 4 + 4 mois, validé par une simple case à cocher | RH | ⚠️ |
| 22 | Paul : **renouvellement accepté 25 jours après la fin de l'essai** | RH | ❌ |
| 23 | Emma : point à 60 jours (RH), rapport d'étonnement (salariée), suivi par le manager | RH / Salarié / Manager | ✅ |
| 24 | Emma : confirmation de l'essai (lettre générée), puis clôture → « en poste » | RH | ✅ |
| 25 | Stagiaire Tom : pré-embauche et embauche ; 3 stagiaires pour un même tuteur ; Maëlle peut être clôturée sans période d'essai | RH | ⚠️ |
| 26 | Téléphone (Chloé) : dépôt « Photo ou fichier » (44 px), pas de débordement ; contrat en lecture seule, **pas de signature possible** | Salarié | ✅ / ⚠️ |
| 27 | Téléphone (Hugo) : consultation du contrat signé, sans téléchargement | Salarié | ⚠️ |

## 2. Constats

| # | Gravité | Angle | Écran | Constat | Attendu (pratique ou loi) |
|---|---|---|---|---|---|
| 1 | Bloquant | Légal | Intégration > Mettre fin à la période d'essai | Emma : essai jusqu'au 30 oct., délai de prévenance de 2 semaines. Le formulaire propose le 30 oct. puis le refuse (« au plus tôt le 10 nov. »). Il accepte ensuite un dernier jour au 10 nov., soit **après la fin de l'essai**, toujours appelé « rupture de période d'essai ». Il n'existe aucune borne supérieure. | L1221-25 : l'essai, renouvellement compris, ne peut pas être prolongé par le délai de prévenance. Si ce délai n'est pas respecté, l'employeur verse une indemnité compensatrice. Une rupture qui prend effet après la fin de l'essai s'analyse en licenciement. Il faut imposer un dernier jour au plus tard à la fin de l'essai et calculer l'indemnité de prévenance. |
| 2 | Bloquant | Légal | Intégration > Renouveler | Paul (essai terminé le 2 oct.) : renouvellement accepté le 27 oct., essai reporté au 2 déc. Seule une case « accord daté d'avant le 2 oct. » est demandée. Le dossier n'indique jamais « essai terminé, contrat définitif ». | L1221-21 et L1221-23 : le renouvellement doit intervenir avant la fin de la période initiale. Après cette date, le contrat est définitif : il faut bloquer le renouvellement et la rupture d'essai. |
| 3 | Majeur | Légal | Nouvelle arrivée | CDI cadre à temps plein enregistré à 12 000 €/an (1 000 €/mois) et CDD à 15 000 €/an, sans alerte. Le contrat généré reprend ces montants. | SMIC (L3231-2) et minima Syntec : il faut une alerte bloquante ou au moins un avertissement dès la saisie. |
| 4 | Majeur | Légal | Nouvelle arrivée (CDD) + contrat CDD | Pas de motif à la création, pas de liste des cas de recours. Le motif n'est qu'un champ libre dans le contrat (j'ai pu y saisir une adresse). Rien sur la personne remplacée, le terme imprécis ou la clause de renouvellement. | L1242-2 (cas de recours). L1242-12 : motif précis, nom et qualification de la personne remplacée, durée minimale, conditions de renouvellement, caisse de retraite complémentaire et prévoyance (nom et adresse). |
| 5 | Majeur | Légal | Contrat CDI / CDD, informations à 7 jours | « Durée hebdomadaire : 35 heures » est écrit en dur, y compris pour un cadre, alors que le logiciel traite les cadres en forfait de 218 jours (paie, temps). Aucune clause de forfait. | L3121-55 : le forfait en jours exige l'accord écrit du salarié (convention individuelle). La durée réelle doit aussi figurer dans les informations essentielles (R1221-34). |
| 6 | Majeur | Légal | Embauche > Mutuelle | « Dispense » s'enregistre d'un clic : ni motif, ni demande écrite du salarié, ni justificatif, ni date de fin. | L911-7 CSS et cas de dispense réglementaires (D911-2 CSS, à vérifier) : la dispense est demandée par écrit par le salarié, avec un justificatif. |
| 7 | Majeur | Légal | Pré-embauche / Embauche | Aisha (hors UE) : DPAE faite alors que la vérification du titre en préfecture n'a pas été faite et que 2 pièces sur 5 seulement étaient validées. Pour toute autre recrue, la zone vaut « France » par défaut : sans nationalité saisie, aucun titre n'est demandé. | R5221-41 : vérification 2 jours ouvrables avant l'embauche. Il faut une nationalité obligatoire, aucune zone par défaut, et un blocage ou une alerte avant DPAE et embauche. |
| 8 | Majeur | Légal | Embauche > DPAE | DPAE « transmise, accusé de réception reçu » d'un clic, sans contrôler les données requises (NIR, date et lieu de naissance). Chloé, sans date de naissance, pourra la faire. Aucune copie n'est remise au salarié. | R1221-1 : liste des mentions. R1221-9 : remise d'une copie au salarié, ou mention dans le contrat. |
| 9 | Majeur | Légal | Registre unique du personnel | Dates de naissance et d'entrée sans année (« 1 janv. », « 14 janv. »). Ordre suivant la date d'inscription et non celle d'embauche : Hugo, qui entre le 23 nov., porte le n° 21 avant Nathan, entré le 1er oct. Inscription possible 27 jours avant l'embauche. Stagiaires dans la même liste. Rien sur le titre des étrangers. Pas d'export ni d'impression. | L1221-13 : inscription dans l'ordre des embauches, partie spécifique pour les stagiaires. D1221-23 et D1221-24 (à vérifier) : mentions complètes, dont le type et le numéro du titre. Le registre doit pouvoir être présenté à l'inspection. |
| 10 | Majeur | Légal / Usage RH | Contrat signé | Seul le salarié signe (tracé non authentifié, sans horodatage ni empreinte du document). L'employeur n'apparaît que par son nom tapé. Ni la recrue ni la RH ne peuvent télécharger ou imprimer le PDF : la fenêtre n'a que « Fermer ». | Contrat signé par les deux parties, exemplaire remis au salarié. Signature électronique fiable (art. 1367 C. civ., eIDAS ; niveau requis à vérifier). |
| 11 | Majeur | Légal | Contrat « Envoyé » | La RH peut encore « Modifier » le contrat envoyé, avant signature. Le salarié est seulement « prévenu de la mise à jour » : on ne sait pas quelle version il a lue. | Une modification devrait renvoyer à une nouvelle signature, avec historique des versions. |
| 12 | Majeur | Légal | Renouvellement | Aucun document d'accord de renouvellement n'est généré, ni à faire signer dans l'espace salarié. Seule une case est cochée côté RH. | L1221-23 : accord exprès et écrit du salarié. La preuve est à la charge de l'employeur, d'où l'intérêt d'un avenant signé comme le contrat. |
| 13 | Majeur | Légal | Rupture de l'essai | Aucune lettre de rupture générée. On ne peut pas dire qui rompt : la rupture par le salarié (48 h, ou 24 h avant 8 jours de présence) n'existe pas. Le texte « aucune indemnité n'est due » oublie l'indemnité de congés payés et l'éventuelle indemnité de prévenance. | L1221-25 et L1221-26. Écrit recommandé ou remis en main propre. |
| 14 | Majeur | Légal | Embauche > VIP | VIP toujours planifiée à J+21 à partir du jour du clic. Pour Paul (entré le 3 août), elle tombe le 17 nov., après la limite du 3 nov., sans alerte. Une VIP « Planifiée » suffit à valider l'étape. Les visites préalables (travail de nuit, moins de 18 ans, suivi renforcé) ne sont pas prévues. | R4624-10 : VIP dans les 3 mois suivant la prise effective du poste, avant l'affectation dans certains cas (R4624-18, R4624-24, à vérifier). |
| 15 | Majeur | Légal | Embauche > Dispositifs | Nathan (cadre) passe en intégration avec la prévoyance cadre « Affilier » toujours à faire : elle ne fait pas partie des étapes. | Prévoyance cadres de 1,50 % TA (ANI du 17 nov. 2017). Elle devrait faire partie des étapes. |
| 16 | Majeur | Pratique | Téléphone > Contrat | La recrue ne peut pas signer sur téléphone : « Ouvre Teamora sur ton ordinateur ». Pour un profil terrain sans ordinateur, c'est une impasse (contrat bloqué). | Signature sur mobile avec lecture complète ; ou relance RH « signer sur papier » proposée d'emblée. |
| 17 | Mineur | Légal | Gratification de stage | Minimum de 659,76 €/mois (4,35 €/h × 151,67 h), soit le taux de 2024. Le seuil de « plus de 2 mois » est calculé en mois calendaires. « Exonérée de cotisations » sans réserve. | L124-6 C. éduc. : 15 % du plafond horaire SS, soit 4,50 €/h en 2025 (taux 2026 à vérifier). Seuil de 2 mois apprécié en présence (44 jours ou 308 h, à vérifier). Exonération limitée à la fraction minimale. |
| 18 | Mineur | Légal | Stage | Un tuteur peut suivre 3 stagiaires (James Carter) : la règle s'affiche mais n'est pas contrôlée. 4 stagiaires simultanés pour environ 20 salariés, sans alerte sur le plafond de l'entreprise. Création possible sans tuteur, pourtant « obligatoire ». | R124-10 et R124-13 C. éduc. (à vérifier) : plafonds par entreprise et par tuteur. |
| 19 | Mineur | Légal | Embauche > DPAE | Libellé « Elle vaut aussi adhésion au service de santé au travail ». | La DPAE vaut demande de visite. L'adhésion au service de prévention et de santé au travail est une démarche distincte (à vérifier). |
| 20 | Majeur | Usage RH | Embauche > Informations obligatoires | Deux documents « informations à 7 jours / à 1 mois » sont exigés pour terminer l'embauche, même quand le contrat signé contient déjà ces informations. C'est une double saisie systématique. | Le décret 2023-1004 permet de remettre les informations dans le contrat : il faudrait cocher « informations contenues dans le contrat ». |
| 21 | Majeur | Usage RH | Pré-embauche | La recrue ne peut saisir ni son adresse, ni son NIR, ni son lieu de naissance, ni son contact d'urgence. La RH les retape dans les zones jaunes du contrat. Aucun contrôle de format : une adresse a été acceptée comme nationalité, date de naissance et motif de CDD. | Formulaire de « collecte des informations » côté recrue, avec contrôles (NIR, dates), qui remplit le contrat, la DPAE et le registre. |
| 22 | Mineur | Usage RH | Pré-embauche (recrue) | Une pièce déposée par erreur ne peut être ni remplacée ni supprimée par la recrue tant que la RH ne l'a pas refusée. La consigne est générique (« PDF ou photo lisible »), alors qu'il faudrait par exemple un RIB à son nom ou un justificatif de moins de 3 mois. | Bouton « Remplacer » et consigne pour chaque pièce. |
| 23 | Mineur | Pratique | Stage, pré-embauche | Le bloc s'appelle « Contrat de travail · Contrat Stage · période d'essai, convention Syntec », alors que l'embauche indique « pas de contrat de travail ». La convention est demandée deux fois (pièce déposée et « Convention reçue signée »). L'embauche d'un stagiaire affiche 2/4 avant toute action. | Vocabulaire propre au stage et une seule source pour la convention. |
| 24 | Mineur | Pratique | Liste des recrues | Paul (entré le 3 août, pré-embauche 0/3) apparaît « En intégration ». | Statut cohérent avec l'avancement. |
| 25 | Mineur | UX | Nouvelle arrivée | En cas d'homonyme, le message dit « Pour lui confier un service de plus, désigne-le responsable… », hors sujet pour une embauche, et met « le » au masculin pour Léa. Le toast « date passée » s'affiche alors que rien n'a été créé. | Proposer « réembauche de cette personne ? » et lier le dossier. |
| 26 | Mineur | UX | Contrat | « né·e », « engagé·e » alors que le sexe est connu ; « nationalité Française » avec une majuscule. | Accord selon le sexe saisi. |
| 27 | Mineur | UX | Signature | Le message « Cochez la case » reste affiché une fois la case cochée. | Effacer l'erreur dès la correction. |
| 28 | Mineur | UX | Espace recrue | Tutoiement et vouvoiement mélangés sur un même écran (« Vous nous rejoignez… » et « Ouvre Teamora sur ton ordinateur », « Dépose tes documents »). Les intitulés changent selon l'endroit : rail « Pré-embauche / Embauche », titres « Mon arrivée / Contrat de travail ». | Un seul registre et un seul vocabulaire. |
| 29 | Mineur | UX | Toutes les pages | Le bouton flottant « Donner mon avis » masque du contenu en bas à gauche (une ligne de pièce, une recrue de la liste). Sur téléphone, l'encart « Votre contrat est prêt à signer » se tasse sur une colonne étroite. | Réserver la place ou réduire le bouton. |
| 30 | Mineur | UX | Roue (RH) | Il faut déplier le « hub » avant de pouvoir cliquer sur une rubrique : le clic direct est intercepté. | La rubrique doit être cliquable directement. |
| 31 | Mineur | Pratique | Données démo, Maëlle | Point à 30 jours affiché « — · « » Fait · — » (compte rendu vide marqué fait). | Ne pas marquer un point comme fait sans contenu. |
| 32 | Mineur | Usage RH | Intégration | L'intégration peut être clôturée avec des points ouverts (le bouton est seulement « ghost »), sans confirmation. | Demander une confirmation qui liste les points restants. |

## 3. Points forts

- Un dossier unique par recrue, avec trois onglets (pré-embauche, embauche, intégration) et des compteurs. Le passage automatique en intégration fonctionne.
- Les contrôles à la création tiennent pour les durées : fin obligatoire hors CDI, CDD de 18 mois au plus, stage de 6 mois au plus, gratification au-delà de 2 mois.
- Le circuit des pièces est bien fait : dépôt, aperçu, validation, refus avec motif obligatoire, notification à la recrue, nouveau dépôt, « Reçu sur papier ». Le tout est clair des deux côtés.
- Le contrat est généré depuis un modèle versionné. Les zones jaunes bloquent l'envoi tant qu'elles sont vides. Le contrat signé est figé, avec la signature apposée et la mention « modèle version 1 · document figé ».
- La DPAE n'est possible qu'à partir de J-8, et un bouton rouge signale une DPAE en retard. Les échéances des informations à 7 jours et à 1 mois s'affichent. Le délai de prévenance de l'essai suit la durée de présence. La période d'essai du CDD (1 jour par semaine, 2 semaines au plus) est juste.
- Le stage remplace correctement la DPAE, la mutuelle et la période d'essai par la convention et le tuteur. La clôture se fait sans décision d'essai.
- Sur téléphone, le dépôt « Photo ou fichier » est simple, les zones tactiles font 44 px et rien ne déborde à 390 px.
- Le rapport d'étonnement et les points de suivi sont partagés entre RH, manager et salarié. La lettre de confirmation de l'essai est générée.

## 4. Captures (`audit/shots/`)

- `arr_00_hub.png` : roue RH dépliée.
- `arr_01_liste.png` : liste des recrues de la démo.
- `arr_02_form_vide.png` : formulaire « Nouvelle arrivée » (pas de motif CDD, pas de durée du travail).
- [arr_03_cdi_rempli.png](captures/arr_03_cdi_rempli.png) : CDI cadre saisi à 12 000 €.
- `arr_04_cdi_cree.png` : dossier de pré-embauche de Hugo, créé sans alerte de salaire.
- `arr_05_cdd_rempli.png` : CDD à 15 000 €, sans champ motif.
- `arr_06_stage_rempli.png` : stage avec gratification de 660 €/mois.
- `arr_10_recrue_accueil.png` : accueil de la recrue (2 rubriques).
- `arr_11_mon_arrivee_vide.png` : « Mon arrivée » avant les dépôts.
- `arr_12_mon_arrivee_depose.png` : pièces « en cours de vérification » ; le bouton « Donner mon avis » masque une ligne.
- `arr_13_rh_voir_piece.png` : aperçu d'une pièce côté RH.
- `arr_14_refus_modal.png` : refus d'une pièce avec liste de motifs.
- `arr_15_rh_pieces_apres.png` : pièces validées ou refusées côté RH.
- `arr_16_recrue_refus.png` : la recrue voit le motif du refus et « Déposer à nouveau ».
- `arr_20_contrat_brouillon.png` : brouillon du CDI (35 h pour un cadre, 12 000 €).
- `arr_21_contrat_envoi_refuse.png` : envoi bloqué tant que l'adresse manque.
- `arr_22_recrue_contrat_a_signer.png` : contrat à signer côté recrue.
- `arr_23_signature_tracee.png` : signature tracée, erreur « Cochez la case » restée affichée.
- `arr_24_contrat_signe_modal.png` : contrat signé figé, sans téléchargement.
- `arr_25_rh_contrat_signe.png` : vue RH du contrat signé.
- `arr_30_cdd_brouillon.png` : brouillon du CDD (motif libre, rien sur la caisse de retraite).
- `arr_40_hugo_embauche.png` : embauche de Hugo (DPAE possible dès le 15 nov.).
- `arr_41_aisha_embauche.png` : embauche d'Aisha (DPAE possible sans titre vérifié).
- `arr_42_nathan_embauche.png` : embauche de Nathan avant traitement.
- [arr_43_registre.png](captures/arr_43_registre.png) : registre (dates sans année, stagiaires mélangés, sans export).
- `arr_44_info7.png` : modèle des informations essentielles.
- `arr_45_nathan_dispositifs.png` : mutuelle en dispense sans justificatif.
- `arr_50_emma_integration.png` : intégration d'Emma, essai à 3 jours de sa fin.
- [arr_51_emma_rupture_modal.png](captures/arr_51_emma_rupture_modal.png) : fenêtre de rupture qui impose une date après la fin de l'essai.
- `arr_52_emma_apres_rupture.png` : état juste après cette rupture acceptée (annulé ensuite en restaurant le profil).
- `arr_53_nathan_integration.png` : période d'essai de Nathan avant le renouvellement.
- `arr_54_renouvellement_modal.png` : renouvellement validé par une case à cocher.
- `arr_55_emma_salariee_integration.png` : programme et rapport d'étonnement côté salariée.
- `arr_56_manager_emma.png` : vue manager de l'intégration.
- `arr_57_confirmation_essai.png` : lettre de confirmation de l'essai.
- `arr_58_emma_avant_cloture.png` : essai confirmé, avant clôture.
- `arr_60_tom_preembauche.png` : stagiaire, bloc « Contrat de travail » inadapté.
- `arr_61_tom_embauche.png` : formalités du stage (convention, tuteur, gratification).
- `arr_62_paul_dpae_retard.png` : bouton « Faire la DPAE (en retard) ».
- [arr_63_paul_essai_echu.png](captures/arr_63_paul_essai_echu.png) : essai terminé le 2 oct., « Renouveler » toujours proposé.
- `arr_70_mob_depart.png` : écran téléphone au départ.
- `arr_70b_mob_menu.png` : menu « Plus » avec le choix du salarié.
- `arr_71_mob_accueil_recrue.png` : accueil de la recrue sur téléphone.
- `arr_72_mob_mon_arrivee.png` : dépôt « Photo ou fichier » sur téléphone.
- `arr_73_mob_apres_depot.png` : après un dépôt sur téléphone.
- `arr_74_mob_contrat.png` : contrat en lecture seule sur téléphone, signature renvoyée à l'ordinateur.
- `arr_75_mob_contrat_signe.png` : contrat signé consulté sur téléphone, sans téléchargement.

## 5. Limites du test

- La date est celle du système (27 oct. 2026). Les cas temporels (essai terminé, DPAE en retard) ont été recréés par une arrivée à date passée (Paul), pas en avançant le temps. Les relances J-10 et J-7 n'ont été vues que dans les notifications de la démo (Aisha).
- La DPAE, la vérification en préfecture et la signature sont simulées par la démo. Je juge les contrôles et le parcours, pas un échange réel avec l'Urssaf.
- L'alternance (contrat d'apprentissage, Cerfa, 45 jours) n'a pas été jouée en détail, faute de temps.
- Je n'ai pas vérifié si le salaire de 12 000 € déclenche plus tard une alerte dans la paie (tronçon Rémunération).
- Les durées d'essai et de renouvellement de Syntec (2, 3 et 4 mois, renouvelables d'autant) n'ont pas été comparées au texte de la convention en vigueur : à vérifier.
- Les dates s'affichent au format mm/dd/yyyy dans les champs, à cause de la langue du Chromium de test, pas du logiciel.
- Les informations à 7 jours et à 1 mois de Chloé ont été remplies par erreur de script (une même adresse dans les quatre zones). Cela montre l'absence de contrôle, mais ce contrat CDD n'est pas une référence de contenu.
