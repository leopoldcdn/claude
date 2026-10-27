# Tronçon 4 : sortie du collaborateur et après-départ (Teamora V3)

> Copie du rapport de test. Les captures marquées d'un lien sont copiées dans `captures/` ; les autres sont restées dans le dossier de travail du test et ne sont pas jointes.

Test du 27 octobre 2026 (date système), `index.html` (version travail), viewport 1440×900, démo réinitialisée avant chaque série. Tout a été joué par l'interface : fiche, « Démarrer un départ », dossier Départs, Paie, Relations individuelles, avec les profils RH, Manager et Salarié. Scripts : `/tmp/claude-0/-home-user-claude/69e089e5-50a3-5376-b0ed-78374a160077/scratchpad/audit/dep/s1.js` à `s9.js`.

Cas joués :
- démission d'une ETAM (Léa Martin, 1 an 11 mois) et d'un cadre (Hugo Laurent, 5 ans) ;
- rupture conventionnelle (Inès Haddad, et Mehdi Bouaziz dans la démo) ;
- licenciement pour motif personnel (Lucas Silva, cadre, 4 ans 3 mois) ;
- 3 licenciements économiques (Sarah Cohen, Noah Williams, Camille Roux) ;
- faute grave (Liam O'Connor) ;
- mise à la retraite (Claire Durand, 45 ans) et départ volontaire à la retraite (Marc Dupont, 36 ans) ;
- fin de CDD (Paul Testcdd, CDD créé pour l'occasion).

## 1. Parcours réalisé

| # | Étape | Profil | Résultat |
|---|---|---|---|
| 1 | Fiche de Léa, « Démarrer un départ » : formulaire Motif (13 motifs en 5 groupes), Dernier jour, Commentaire, aperçu du préavis et des indemnités | RH | ✅ clair et rapide (2 clics) |
| 2 | Démission ETAM : préavis affiché « 1 mois (Syntec, ETAM) » ; j'ai saisi un dernier jour au 28 oct. alors que le préavis va jusqu'au 26 nov. | RH | ⚠️ accepté sans alerte, dates contradictoires dans le dossier |
| 3 | Préparation : valider le préavis, le chiffrage, préparer les 3 documents, planifier la restitution | RH | ✅ |
| 4 | Formalités : entretien de départ (formulaire RH), successeur (Hugo), passation (3 cases), matériel (3 objets), accès coupés, notice de portabilité, « Remis au salarié » | RH | ✅ simple ; ⚠️ documents remis la veille du dernier jour, sans contrôle |
| 5 | Documents de sortie : certificat, reçu pour solde de tout compte, attestation France Travail | RH | ❌ solde de tout compte faux (ICCP comptée deux fois) |
| 6 | Paie d'octobre : sortie signalée dans les contrôles, ICCP et indemnités dans le CSV, bulletins diffusés | RH | ⚠️ remontée OK ; ❌ bulletin de Mehdi sans ligne d'indemnité de rupture ; ❌ congés N non payés |
| 7 | Après le départ : archivage, durées de conservation, « Programmer » la suppression, réembauche « Oui », boomerang vers « UX Designer Senior » | RH | ⚠️ boutons sans effet réel ; dates de conservation sans année ; e-mail du boomerang inventé |
| 8 | Vue salariée de Léa pendant et après le départ | Salarié | ❌ ne voit que la liste de tâches internes des RH ; garde l'accès complet après la sortie (congés à poser 20 j, feuilles d'heures) |
| 9 | Vue manager (Thomas, puis James Carter) : liste de l'équipe, dossier, notification | Manager | ⚠️ voit les montants (ICCP, indemnité légale) ; ne peut pas déclarer une démission reçue |
| 10 | Démission cadre (Hugo) : 3 mois affichés, dernier jour proposé par défaut = aujourd'hui + 30 jours | RH | ⚠️ incohérence non signalée |
| 11 | Rupture conventionnelle (Inès) : saisie de la date de signature (16 oct.), calendrier calculé, alerte « date de fin trop tôt » | RH | ⚠️ calendrier faux (week-end et fériés ignorés) ; ❌ passage à « Sorti » possible avant l'homologation |
| 12 | Licenciement pour motif personnel (Lucas) : départ lancé directement, aucune procédure demandée | RH | ❌ procédure absente du départ |
| 13 | Relations individuelles : dossier disciplinaire, convocation le 29 oct., entretien les 3 puis 4 nov., mesure « Licenciement » | RH | ⚠️ repères de délai utiles ; décompte des 5 jours ouvrables à vérifier ; la mesure n'engage aucun départ |
| 14 | 3 licenciements économiques : avertissement « consultation du CSE et information de la DREETS » dès le 2ᵉ | RH | ✅ alerte ; ❌ rien sur le CSP, l'ordre des licenciements ou la priorité de réembauche |
| 15 | Faute grave (Liam) : pas de préavis ni d'indemnité, ICCP versée | RH | ✅ |
| 16 | Mise à la retraite d'une salariée de 45 ans, départ volontaire à 36 ans | RH | ❌ acceptés sans contrôle d'âge, avec une indemnité de 23 717 € pour la mise à la retraite |
| 17 | Fin de CDD : CDD créé par « Ajouter un collaborateur » sans date de fin, puis départ « Fin de CDD » au 30 oct. | RH | ⚠️ indemnité de fin de contrat calculée ; ❌ ICCP à 0 € ; ❌ cas d'exclusion absents |
| 18 | « À traiter » : 13 départs listés avec les tâches restantes | RH | ✅ ; ⚠️ « accès à couper aujourd'hui » pour Mehdi, parti depuis 18 jours |
| 19 | Demande d'un ancien salarié (Clara) : « Générer et envoyer » une attestation employeur | RH | ❌ le texte dit « est employée depuis… » pour une personne sortie en 2025 |
| 20 | Questionnaire de départ côté salarié, DSN de fin de contrat, demande post-départ par l'ancien salarié | Salarié / RH | ❌ absents |

## 2. Constats

| # | Gravité | Angle | Écran | Constat | Attendu (pratique ou loi) |
|---|---|---|---|---|---|
| 1 | Bloquant | Légal | Documents > Reçu pour solde de tout compte | Pour Léa : « Salaire du dernier mois 6 320,49 € » (ce brut contient déjà l'ICCP de 3 184,13 €), puis une ligne « ICCP 3 184,13 € ». Total 9 504,61 € : l'ICCP est comptée deux fois. Même logique pour tous les sortants. | Inventaire exact des sommes versées (art. L1234-20). Un reçu faux n'a pas d'effet libératoire et ouvre un litige. |
| 2 | Bloquant | Légal | Départs > bouton « Passer aux… » | Le bouton reste actif même quand rien n'est fait. Deux clics mettent Inès en « Sorti » le 27 oct., alors que son dernier jour est le 10 nov., que la rupture n'est pas homologuée (fin au plus tôt le 19 nov. selon l'outil) et que ses 3 documents sont encore en brouillon. Aucune confirmation n'est demandée. Léa aussi passe « Sorti » avant son dernier jour. | Le contrat ne peut pas prendre fin avant le lendemain de l'homologation (art. L1237-13). Il faut bloquer le passage, ou au moins confirmer avec alerte, et rester « en départ » jusqu'au dernier jour. |
| 3 | Bloquant | Légal | Calendrier de la rupture conventionnelle | Signature le ven. 16 oct. L'outil affiche : rétractation jusqu'au sam. 31 oct., demande le dim. 1ᵉʳ nov. (Toussaint), réponse au plus tard le 18 nov., fin au plus tôt le 19 nov. `addWorkDays` ignore les jours fériés (dont le 11 nov.) et aucun délai n'est reporté quand il finit un week-end. | Délai qui expire un samedi, un dimanche ou un jour férié : reporté au jour ouvrable suivant (art. R1231-1, à vérifier). Rétractation jusqu'au lun. 2 nov., instruction de 15 jours ouvrables hors fériés à compter de la réception (art. L1237-14), fin au plus tôt vers le 23 ou 24 nov. (à recalculer). L'outil annonce une date 4 à 5 jours trop tôt, ce qui expose à une rupture avant homologation. |
| 4 | Bloquant | Légal | Formulaire de départ > Mise à la retraite | Mise à la retraite d'une salariée de 45 ans acceptée, avec une « indemnité de rupture estimée 23 717 € ». Départ volontaire à la retraite accepté à 36 ans. Aucun âge n'est contrôlé. | Mise à la retraite à 70 ans, ou dès 67 ans avec l'accord du salarié (art. L1237-5). Faite avant, elle est requalifiée en licenciement nul ou sans cause. Il faut contrôler la date de naissance. |
| 5 | Majeur | Légal | Paie > bulletin de Mehdi (oct.) | Brut 2 934 € et net payé 7 781 € : l'indemnité de rupture conventionnelle (5 607 €) entre dans le net, mais aucune ligne ne l'affiche (le tableau `extras` n'est jamais rendu). Pas de contribution patronale spécifique non plus. | Le bulletin doit faire apparaître chaque somme versée. L'indemnité de rupture conventionnelle supporte une contribution patronale de 30 % (CSS, à vérifier). |
| 6 | Majeur | Légal | Paie / Chiffrage > ICCP | L'ICCP ne paie que le solde N-1 (Léa 20 j, Mehdi 9 j). Les congés N acquis (10,4 j, affichés sur le bulletin) sont perdus. Le calcul (`cp × salaire/12/21,67`) ne compare pas avec la règle du dixième. Pour le CDD de 6 mois : ICCP à 0 €. | Indemnité pour tous les congés acquis et non pris (art. L3141-28), au montant le plus favorable entre maintien et dixième (art. L3141-24). |
| 7 | Majeur | Légal | Formulaire de départ / Préavis | Pas de contrôle entre « Dernier jour » et la fin du préavis. Hugo (cadre, 3 mois) reçoit par défaut un dernier jour à J+30 ; Léa au 28 oct. pour un préavis qui finit le 26 nov. Les deux dates s'affichent côte à côte sans alerte. Aucun champ pour la dispense (à la demande de qui ? payée ou non ?). | Dernier jour proposé = fin du préavis. Si l'employeur dispense, le contrat court jusqu'au terme et une indemnité compensatrice est due (art. L1234-5) ; si le salarié demande la dispense, il faut l'accord écrit. |
| 8 | Majeur | Légal | Formulaire de départ / Préavis | La date de notification vaut toujours la date de saisie (`notifiedAt = TODAY`) et ne se modifie pas : ni date de réception de la démission, ni date de présentation de la lettre de licenciement. | Le préavis court à la présentation de la lettre de licenciement (art. L1234-3) ou selon la date de la démission. |
| 9 | Majeur | Pratique / Légal | Départ « Licenciement pour motif personnel » | Le départ se lance sans aucune étape : ni convocation, ni entretien préalable, ni lettre motivée, ni contrôle des 2 jours ouvrables avant l'envoi. La procédure de « Relations individuelles » n'existe que pour le disciplinaire, et choisir la mesure « Licenciement » ne crée aucun départ (Lucas reste « En poste »). | Convocation (art. L1232-2), entretien 5 jours ouvrables au moins après la présentation, lettre motivée envoyée 2 jours ouvrables au moins après l'entretien (art. L1232-6), avec le parcours relié au départ. |
| 10 | Majeur | Légal | Relations individuelles > Repères | Convocation présentée le jeu. 29 oct. : l'outil indique un entretien « au plus tôt le 4 nov. » et accepte le 4 nov. sans alerte. Selon la jurisprudence, les 5 jours ouvrables doivent être entiers, ce qui place l'entretien au 6ᵉ jour, le 5 nov. (à vérifier). Les deux fonctions de jours ouvrables du code diffèrent : l'une ignore les fériés, l'autre non. | Un décompte unique et juste du délai (art. L1232-2). |
| 11 | Majeur | Légal | Chiffrage des indemnités | L'indemnité conventionnelle Syntec n'est jamais calculée (seulement « Vérifier… si plus favorable »). Pour Lucas (cadre, 4 ans 3 mois) : légale 5 588 € ; Syntec, à 1/3 de mois par année, environ 7 300 € (à vérifier). Le salaire de référence est le fixe/12, sans primes. L'ancienneté s'arrête au dernier jour travaillé, pas à la fin du préavis. | Verser la plus favorable entre légale et conventionnelle (art. L1234-9). Salaire de référence le plus favorable entre la moyenne des 12 et celle des 3 derniers mois (art. R1234-4). Ancienneté arrêtée à la fin du préavis. |
| 12 | Majeur | Légal | Fin de CDD | Aucun cas d'exclusion de l'indemnité de fin de contrat (CDI proposé et refusé, embauche en CDI, rupture anticipée par le salarié, faute grave, CDD saisonnier ou d'usage, jeune pendant les vacances scolaires). L'indemnité ne porte que sur le salaire de base. « Fin de CDD » se choisit aussi pour un CDI. Un CDD créé par « Ajouter un collaborateur » n'a pas de date de fin. | Indemnité de 10 % de la rémunération brute totale (art. L1243-8), exclusions de l'art. L1243-10, terme obligatoire (art. L1242-12). |
| 13 | Majeur | Légal | Licenciement économique | L'alerte CSE / DREETS / PSE est présente, mais rien sur le contrat de sécurisation professionnelle (proposition, délai de réflexion), les critères d'ordre des licenciements ou la priorité de réembauche. Quand une offre s'ouvre, aucun licencié éco n'est signalé. | Priorité de réembauche pendant 1 an, à mentionner dans la lettre (art. L1233-45), CSP (art. L1233-66), critères d'ordre (art. L1233-5). |
| 14 | Majeur | Légal | Documents de sortie | Certificat et attestation sont datés et « remis » le 27 oct. pour une fin au 28 oct. : rien n'empêche de remettre les documents avant la fin du contrat. La date de sortie du certificat est le « dernier jour travaillé », donc fausse en cas de dispense de préavis par l'employeur. Le certificat ne liste pas les emplois successifs (l'historique des changements existe pourtant). | Certificat remis à l'expiration du contrat (art. L1234-19), avec les dates d'entrée et de sortie et les emplois successifs (art. D1234-6, à vérifier). |
| 15 | Majeur | Légal / Usage RH | Attestation France Travail, DSN | L'« attestation » est un paragraphe de texte sans salaires, et l'outil dit « transmise via la DSN » sans suivre l'envoi (ni date, ni accusé). La DSN de fin de contrat n'apparaît nulle part. | Attestation produite par le signalement DSN de fin de contrat et remise au salarié (art. R1234-9). Il faut suivre ce signalement (délai à vérifier). |
| 16 | Majeur | Légal (RGPD) | Après le départ > Archivage / Conservation | « Archiver » et « Programmer » ne font que poser une date. Le manager voit encore la fiche de Léa (contact d'urgence compris), et aucune suppression n'existe pour les salariés. Pas de registre des traitements. Les dates de conservation n'ont pas d'année : « Jusqu'au 28 oct. » pour 5 ans comme pour 10 ans. | Durées appliquées : registre unique 5 ans (art. R1221-26), bulletins 5 ans (art. L3243-4), etc. Accès limité après archivage, purge réelle et tracée, registre RGPD. |
| 17 | Majeur | Usage RH / Légal | Espace salarié après la sortie | Léa, sortie et avec ses accès « désactivés », garde tout son espace : « Congés à poser 20 j » (pourtant payés), feuilles d'heures, demande de modification du RIB. Elle ne peut pas demander un document après son départ (les demandes post-départ n'existent que dans la démo). | Accès limité aux bulletins et documents, avec une durée définie. Formulaire de demande pour les anciens salariés. Soldes remis à zéro. |
| 18 | Majeur | UX / Pratique | Espace salarié > Préparation du départ | Le salarié voit la checklist interne des RH (« Organisation de la fin de contrat », « Archivage du dossier »…) sans sa date de fin, son préavis, les documents à venir, le matériel à rendre ou un contact. Pas de questionnaire de départ à remplir : l'entretien de départ n'est saisi que par les RH. | Une page salarié utile : dates, étapes qui le concernent, documents, restitution, portabilité, questionnaire de départ (déjà dans les « restent à faire » du README). |
| 19 | Majeur | Légal (RGPD) | Dossier de départ, profil Manager | Le manager voit l'ICCP et l'indemnité légale de chaque membre de son équipe, alors qu'il n'a pas accès aux bulletins. | Minimisation : le manager n'a besoin que des dates et de la passation. |
| 20 | Majeur | Légal (RGPD) / Usage RH | Après le départ > Proposer une offre (boomerang) | Le candidat est créé avec un e-mail inventé (`lea.martin@mail.fr`) et un message « Nouvelle opportunité » part tout de suite, sans adresse personnelle connue ni accord de la personne. | Utiliser l'e-mail personnel déclaré et recueillir l'accord avant d'inscrire la personne dans le vivier. |
| 21 | Majeur | Légal | Demandes après le départ > Attestation employeur (Clara) | Le brouillon dit « atteste que Clara Fontaine est employée au sein de notre société depuis le 4 janvier 2021 » alors qu'elle est sortie le 30 juin 2025. | Un modèle pour ancien salarié (« a été employée du … au … »). |
| 22 | Majeur | Usage RH | Modèles | Aucun courrier de sortie : accusé de réception de démission, accord de dispense de préavis, convocation à l'entretien préalable, lettre de licenciement, convention de rupture, lettre de mise à la retraite, notice de portabilité, attestation de stage (pourtant annoncée par l'aperçu « Fin de stage »). | Ce sont les courriers les plus risqués pour une RH sans juriste. |
| 23 | Mineur | Usage RH | Fin des accès / Portabilité | « Portabilité » se limite à une case « Notice remise ». Rien pour informer l'organisme assureur ni pour mentionner la durée (celle du dernier contrat, 12 mois au plus). Le texte omet cette limite. | Art. L911-8 CSS : maintien gratuit, durée égale à celle du dernier contrat dans la limite de 12 mois. |
| 24 | Mineur | Pratique | Rupture conventionnelle | Pas de date d'entretien (la donnée existe dans la démo, mais aucun champ ne la saisit). Pas de suivi de l'envoi TéléRC, de la réponse ou de l'homologation tacite, ni de la remise d'un exemplaire au salarié. L'alerte « date de fin trop tôt » n'apparaît qu'une fois la signature saisie. | Entretien(s) (art. L1237-12), exemplaire remis au salarié, demande d'homologation (art. L1237-14). |
| 25 | Mineur | Légal | Bloc « Préavis » | « Les congés pris pendant le préavis ne le prolongent pas » s'affiche partout, même pour la rupture conventionnelle, la faute grave et la fin de CDD, et ne dit pas tout : des congés fixés avant la notification décalent la fin du préavis (à vérifier). | Mention ciblée et juste. |
| 26 | Mineur | Légal | Départ volontaire à la retraite | Pas d'indemnité de départ à la retraite calculée (le cas de 10 ans d'ancienneté ou plus n'est pas traité). | Art. L1237-9 et D1237-1 (montants à vérifier). |
| 27 | Mineur | UX | Formulaire de départ | L'aperçu des indemnités ne tient pas compte de la date saisie (calcul à J+30) : 2 030 € dans le formulaire contre 1 764 € dans le dossier pour le CDD, 3 574 € contre 3 531 € pour la rupture conventionnelle. Libellé « Dernier jour travaillé » ambigu face à la fin du contrat. | Mise à jour de l'aperçu à chaque changement de date ; distinguer « dernier jour travaillé » et « fin du contrat ». |
| 28 | Mineur | UX | À traiter | « Accès à couper aujourd'hui » pour Mehdi, parti le 9 oct. Aucun retard n'est signalé sur ses documents de sortie non remis 18 jours après. | « En retard depuis le 9 oct. », mis en avant. |
| 29 | Mineur | UX | Après le départ | Les étapes « Gestion des demandes » sont cochées sans demande, d'où 1/4 dès l'arrivée. Les messages de confirmation s'empilent et cachent le menu des offres du boomerang. L'ancienneté est calculée à aujourd'hui, pas à la date de sortie. | Compteurs et anciennetés justes. |

## 3. Points forts
- Un dossier unique par départ, en 3 temps, avec des barres d'avancement ; « À traiter » regroupe tout, personne par personne.
- 13 motifs regroupés par initiative, avec un aperçu immédiat du préavis et des indemnités. Faute grave correcte : ni préavis ni indemnité, ICCP versée.
- Préavis Syntec cadre (3 mois) et indemnité légale conformes : 1/4 puis 1/3 de mois par année, à partir de 8 mois d'ancienneté (art. L1234-9, R1234-2).
- Il existe un calendrier de rupture conventionnelle qui alerte quand la date de fin est trop tôt, et une alerte CSE / DREETS / PSE pour les licenciements économiques.
- Mentions obligatoires contrôlées dans les modèles (portabilité sur le certificat, 6 mois sur le reçu) ; documents figés une fois remis.
- Les sorties remontent dans les contrôles de paie et dans l'export CSV (motif, ICCP, indemnités).
- Entretien de départ structuré (motif, eNPS, retour possible) et analyse des départs ; recherche du successeur ; notification au manager et au successeur.

## 4. Captures
Dans `/tmp/claude-0/-home-user-claude/69e089e5-50a3-5376-b0ed-78374a160077/scratchpad/audit/shots/` :
- `dep_00_home.png` : roue RH au démarrage.
- `dep_01_departs_list.png` : Départs, liste de la démo.
- `dep_02_yanis.png` : dossier de démission ETAM de la démo (préparation).
- `dep_03_mehdi.png` : rupture conventionnelle de Mehdi, sorti le 9 oct. et toujours en formalités.
- `dep_10_fiche_lea.png`, `dep_11_form_exit_default.png` : fiche et formulaire « Démarrer un départ ».
- `dep_12_lea_after_launch.png`, `dep_13_lea_dossier.png` : départ lancé, dernier jour avant la fin du préavis, sans alerte.
- `dep_14_lea_salarie_home.png`, `dep_15_lea_salarie_depart.png`, `dep_16_lea_notifs.png` : vue salariée (checklist interne seulement) et notification.
- `dep_17_mgr_lea.png` : vue manager du dossier (montants visibles).
- `dep_20_lea_prep_done.png`, `dep_22_lea_formal.png` : préparation et formalités terminées.
- `dep_23_paie_vars.png`, `dep_24_paie_ctrl.png` : variables et contrôles de paie avec les sorties.
- `dep_25_lea_apres.png`, `dep_40_lea_apres_done.png` : après le départ (dates de conservation sans année).
- `dep_30_lea_fiche_sortie.png`, `dep_31_lea_docs.png` : fiche « Sorti » et documents.
- `dep_32_doc_0.png`, [dep_32_doc_1.png](captures/dep_32_doc_1.png), `dep_32_doc_2.png` : certificat, reçu pour solde (ICCP en double), attestation France Travail.
- `dep_33_bulletin_mehdi.png` : bulletin sans ligne d'indemnité de rupture, net payé 7 781 €.
- `dep_34_bulletin_lea.png` : bulletin de sortie (congés N non payés).
- `dep_41_clara_apres.png` : ancienne salariée avec une demande en attente.
- `dep_42_lea_fiche_archived.png`, `dep_43_mgr_lea_archived.png` : après archivage, le manager voit toujours la fiche.
- `dep_44_lea_salarie_after.png`, `dep_45_lea_salarie_apres.png`, `dep_46_lea_salarie_profil.png` : l'ancienne salariée garde son espace complet.
- `dep_50_form_hugo.png`, `dep_51_hugo_dossier.png` : cadre, 3 mois de préavis, dernier jour à J+30.
- [dep_52_ines_rc.png](captures/dep_52_ines_rc.png) : calendrier de rupture conventionnelle (dates fausses).
- `dep_53_form_lucas.png`, `dep_54_lucas.png` : licenciement sans procédure, indemnité légale seule.
- `dep_55_form_eco2.png`, `dep_56_form_eco3.png` : alerte CSE / DREETS pour les licenciements économiques.
- [dep_57_form_retraite.png](captures/dep_57_form_retraite.png) : mise à la retraite à 45 ans acceptée, 23 717 €.
- `dep_58_liam_faute.png` : faute grave.
- `dep_59_add_cdd.png`, `dep_60_form_cdd.png`, `dep_61_cdd_dossier.png` : CDD sans terme, fin de CDD, ICCP à 0.
- `dep_62_departs_list.png`, `dep_63_a_traiter.png` : 12 départs en cours, liste « À traiter ».
- `dep_70_bul_Paul.png`, `dep_70_bul_Liam.png` : bulletins de sortie du CDD et de la faute grave.
- `dep_71_mgr_departs.png`, `dep_72_mgr_hugo.png`, `dep_73_mgr_james_lucas.png` : vues des managers.
- `dep_80_case_4nov.png`, `dep_81_case_3nov.png`, `dep_82_case_licenciement.png` : repères de la procédure disciplinaire et mesure « Licenciement » sans suite.
- `dep_90_ines_sortie_sans_homolog.png` : Inès « Sortie » avant l'homologation.
- `dep_91_clara_request.png` : attestation « est employée depuis… » pour une ancienne salariée.

## 5. Limites du test
- La paie n'existe que jusqu'au mois courant (octobre 2026). Les sorties de novembre et de janvier (Hugo, Lucas, licenciements éco) n'ont pas pu être vérifiées en bulletin. Pour tester la remontée en paie, les sorties de Léa (28 oct.), Paul (30 oct.) et Liam (27 oct.) ont été placées en octobre.
- Le sélecteur « Espace du collaborateur » ne propose que Léa et les nouvelles recrues. La vue salariée d'un départ n'a donc été jouée qu'avec Léa.
- Le CDD a été créé par « Ajouter un collaborateur » : la démo n'en contient aucun.
- Le PSE (10 licenciements ou plus, 50 salariés ou plus) n'a pas été déclenché : l'effectif de la démo (~20) ne le permet pas sans simulation. La logique a été lue dans le code (`pseHint`).
- Les montants Syntec (indemnité conventionnelle, préavis ETAM en démission après 2 ans) et certains délais (report des délais, 5 jours ouvrables « entiers ») sont marqués « à vérifier ». Mes calculs de calendrier de rupture conventionnelle sont faits à la main et sont à confirmer par un juriste.
- Pas de test d'accessibilité au clavier ni de la version téléphone sur ce tronçon.
