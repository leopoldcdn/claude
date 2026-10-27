# Tronçon 1 : le recrutement, du besoin à l'embauche (Teamora V3)

> Copie du rapport de test. Les captures marquées d'un lien sont copiées dans `captures/` ; les autres sont restées dans le dossier de travail du test et ne sont pas jointes.

Test du 27 octobre 2026 sur `index.html` (version travail), 1440×900, démo réinitialisée au départ. Tout le parcours est passé par l'interface (clics, saisies, envoi de fichier). L'état était sauvegardé entre les scripts.
Scripts : `/tmp/claude-0/-home-user-claude/69e089e5-50a3-5376-b0ed-78374a160077/scratchpad/audit/rec/s1.js` à `s9.js`. Captures : `/tmp/claude-0/-home-user-claude/69e089e5-50a3-5376-b0ed-78374a160077/scratchpad/audit/shots/rec_*.png`.
Cas joué : le besoin **« Directeur artistique »** (Design, CDI, Paris), demandé par Thomas Petit. Contre-test : un besoin CDD « Assistant·e de production » émis par les RH, jusqu'à l'embauche.

## 1. Parcours réalisé

| # | Étape | Profil | Résultat |
|---|---|---|---|
| 1 | « Mes demandes » : une carte par besoin, avec la frise Demande → RH → Direction → Offre → Publication | Manager | ✅ |
| 2 | « Exprimer un besoin » : l'assistant compte 5 étapes (Le poste, Justification et budget, Fiche de cadrage, Missions et annonce, Récapitulatif) | Manager | ✅ |
| 3 | Erreurs de saisie : intitulé vide, fourchette inversée (52 000 > 45 000), création de poste sans alternative, missions trop courtes. Chaque fois, un message clair bloque l'étape | Manager | ✅ |
| 4 | Date d'arrivée souhaitée dans le passé (5 janv. 2026) : acceptée sans avertissement | Manager | ⚠️ |
| 5 | Brouillon : il s'enregistre à chaque étape. Le besoin est fermé à l'étape 3 et retrouvé en « Brouillon · À vous ». Il se rouvre à l'étape 1, pas là où on s'était arrêté | Manager | ✅ / ⚠️ |
| 6 | Récapitulatif puis envoi : BES-2026-011 passe « En validation ». Le circuit annoncé est RH → Direction (création de poste), le poste étant hors budget | Manager | ✅ |
| 7 | Demande de modification : un commentaire est obligatoire (vérifié). Le besoin repasse « À modifier » et Thomas est notifié | RH | ✅ |
| 8 | Correction de la fourchette (50–58 k€) puis renvoi. Commentaire dans « Échanges », qui apparaît non lu côté RH | Manager | ✅ |
| 9 | La RH valide le besoin, qui part à la Direction. La RH saisit ensuite « pour la direction » la décision de Claire Durand, avec un commentaire | RH | ⚠️ |
| 10 | Rédaction de l'offre par le manager, avec 13 formulations discriminantes : 9 termes signalés en orange. Projet enregistré puis envoyé aux RH | Manager | ✅ / ⚠️ |
| 11 | Relecture RH : mêmes alertes. Correction partielle, puis publication en OFF-2026-011 ; le journal garde « Publiée malgré 1 terme signalé : « jeune » » | RH | ✅ / ⚠️ |
| 12 | Ajout de 3 candidats : Sophie Roche avec un CV PDF, Marc Dubois avec un e-mail invalide et sans accusé de réception, Inès Haddad (cooptation) | RH | ✅ / ⚠️ |
| 13 | Présélection. Le bouton fait passer automatiquement au candidat suivant de la colonne | RH | ✅ / ⚠️ |
| 14 | Entretiens : un entretien manager aujourd'hui 9 h et un test technique daté du 1er janvier 2025 (accepté). Convocations envoyées | RH | ⚠️ |
| 15 | Refus de Marc : motif, message prérempli, case vivier décochée, mention de la suppression au 27 oct. 2028 | RH | ✅ |
| 16 | Messages types (Point d'étape, Message libre ; un message vide est refusé) | RH | ✅ |
| 17 | Évaluation structurée depuis « À traiter » : chaque compétence exige une note et un fait observé, puis un avis. Un commentaire discriminant passe sans réaction | Manager | ✅ / ⚠️ |
| 18 | « Choisir ce candidat » avec 1 entretien évalué sur 2 : pas d'avertissement. La RH est notifiée | Manager | ✅ / ⚠️ |
| 19 | Préparer la proposition : impossible tant que le test technique de 2025, qui n'a jamais eu lieu, n'est pas « évalué ». Aucun moyen d'annuler un entretien | RH | ❌ (contourné par une fausse évaluation) |
| 20 | Proposition : contrôle de la fourchette en direct (en dessous / dans / au-dessus). Une date limite passée est refusée. Proposition envoyée à 62 000 € (hors fourchette) avec une date d'entrée passée (1er sept. 2026) et une réponse attendue le jour même : tout est accepté. La Direction est notifiée | RH | ⚠️ |
| 21 | Lettre de proposition générée et consultable | RH | ✅ / ⚠️ |
| 22 | « Retirer » la proposition : un clic, sans confirmation. Message de retrait envoyé | RH | ⚠️ |
| 23 | Nouvelle proposition à 55 000 € (dans la fourchette), puis « Acceptée : embaucher ». Sophie entre dans Arrivées (pré-embauche 0/3, embauche 0/4) et l'offre passe « Pourvue » | RH | ✅ |
| 24 | Refus d'Inès (« un autre candidat a été retenu »), versée au vivier, puis proposée depuis le vivier sur une autre offre | RH | ✅ / ⚠️ |
| 25 | Reporting RH (offres, entonnoir, sources), fenêtre « À traiter », notifications RH et manager | RH, Manager | ✅ |
| 26 | Espace de la recrue (profil Salarié > Sophie) : « Mon arrivée J-97 » | Salarié | ✅ |
| 27 | « Nouvelle arrivée » hors offre (cooptation) : contrôle des champs vides, du CDD sans date de fin, du CDD de plus de 18 mois, d'un e-mail invalide et des homonymes. Un salaire de 12 000 €/an est accepté | RH | ✅ / ⚠️ |
| 28 | Contre-test CDD par le recrutement : aucun champ de durée ni de motif. Le salarié créé n'a pas de date de fin et la lettre ne mentionne pas de terme | RH | ❌ |

## 2. Constats

| # | Gravité | Angle | Écran | Constat | Attendu (pratique ou loi) |
|---|---|---|---|---|---|
| 1 | Bloquant | Légal | Besoin, proposition, embauche (CDD) | Un besoin CDD ne demande ni durée, ni terme, ni motif de recours. La lettre de proposition indique « Contrat : CDD » sans terme. Le salarié créé à l'acceptation a `endDate` vide (contre-test Nora Belkacem, [capture 40](captures/rec_40_lettre_cdd_sans_terme.png)). « Nouvelle arrivée », elle, exige une date de fin. | Un CDD comporte un terme et un motif précis, par écrit (L1242-12) ; sinon, risque de requalification en CDI (L1245-1). Demander le motif et la durée dès le besoin, les reprendre dans l'offre et dans la fiche. |
| 2 | Majeur | Légal | Proposition | Le texte d'aide et la lettre disent : « Elle peut être retirée tant que vous ne l'avez pas acceptée ». Le bouton « Retirer » agit en un clic, sans confirmation, même avant la date limite. | Une offre assortie d'un délai ne peut pas être rétractée avant l'expiration de ce délai (art. 1116 C. civ.). Une rétractation fautive engage la responsabilité de l'employeur (Cass. soc. 21 sept. 2017). Corriger le texte et confirmer le retrait en rappelant ce risque. |
| 3 | Majeur | Usage RH / Légal | Proposition | Une proposition au-dessus de la fourchette validée (62 000 € pour 50–58 k€) part immédiatement : un bandeau rouge et une notification à la Direction, sans accord préalable. | Accord de la Direction avant l'envoi (le besoin a été validé avec cette fourchette). C'est aussi une question d'égalité de rémunération. |
| 4 | Majeur | Légal | Besoin, proposition, Nouvelle arrivée | Aucun contrôle du SMIC ni des minima de la convention. Fourchette de 20–24 k€ acceptée pour un temps plein, proposition à 21 000 €, « Nouvelle arrivée » CDD à 12 000 €/an : créés sans alerte. | Contrôle du SMIC annuel (≈ 21 600 € bruts pour un temps plein en 2025, valeur 2026 à vérifier) et du minimum conventionnel Syntec, comme le module Paie le fait déjà. |
| 5 | Majeur | Pratique | Besoin (étape « Le poste ») | Pas de catégorie (cadre / non-cadre), de classification Syntec, de durée du travail ni de forfait jours. La RH a demandé « précisez la catégorie (cadre) » : le manager n'a aucun champ pour répondre. La catégorie est ensuite déduite à l'embauche. | Ces éléments conditionnent le salaire minimum, la période d'essai et la convention de forfait. Ils doivent figurer dans le besoin et dans l'offre. |
| 6 | Majeur | Légal | Rédaction de l'offre | L'annonce ne contient pas la fourchette de salaire par défaut. Elle n'apparaît que dans une ligne d'aide grise de la fenêtre de rédaction et dans l'onglet interne « L'offre ». | Directive (UE) 2023/970, art. 5 : informer le candidat de la rémunération initiale ou de sa fourchette avant l'entretien (transposition attendue au 7 juin 2026 ; état du texte français à vérifier). Insérer la fourchette dans le texte et alerter si elle manque. |
| 7 | Majeur | Légal | Alerte discriminations | Non détectés : « vous habitez Paris intra-muros » (lieu de résidence), « joindre une photo », « disponible », une annonce entièrement en anglais (« Art Director… Young and dynamic »). Les titres au masculin (« Directeur artistique ») ne donnent qu'un conseil, alors que « assistante », « vendeuse » ou « développeuse » sont signalés : traitement asymétrique. | Critères de L1132-1 (lieu de résidence, apparence physique…). Offre rédigée en français (L5331-4, à vérifier), sans limite d'âge (L5331-2, à vérifier). Signaler les mêmes risques au masculin et au féminin. |
| 8 | Majeur | Usage RH | Publication | « Publier » ne fait que changer le statut : pas de page carrière, pas d'export du texte, pas de diffusion vers France Travail ou les jobboards. Les candidats sont saisis à la main par la RH. | Une offre publiée doit être diffusable (lien, copie formatée, multidiffusion). Sinon, il faut ressaisir chaque candidature. |
| 9 | Majeur | Usage RH | Entretiens | Un entretien ne peut être ni annulé, ni déplacé, ni marqué « non tenu ». Le test technique planifié par erreur bloquait « Préparer la proposition » (bandeau « Évaluer l'test technique du 1 janv. »). Seul contournement : inventer une évaluation. | Annuler ou reporter un entretien, avec un message type au candidat. Ne pas bloquer la proposition pour un entretien non tenu. |
| 10 | Majeur | Pratique | Entretiens, proposition | Les dates passées sont acceptées : entretien au 1er janvier 2025, date d'entrée au 1er septembre 2026 (antérieure à la proposition), réponse attendue le jour même. La convocation dit « le mercredi 1 janvier », sans l'année. | Refuser ou signaler les dates passées. Imposer un délai de réponse raisonnable (au moins 1 jour). Écrire l'année dans les courriers. |
| 11 | Majeur | Légal | Convocation | La convocation n'indique ni le lieu ni le lien de visio, ni la nature de l'épreuve pour un « Test technique ». | Le candidat est informé au préalable des méthodes et techniques d'aide au recrutement (L1221-8). |
| 12 | Majeur | Légal (RGPD) | Ajout de candidat, accusé de réception | L'information RGPD n'est envoyée que si la case « accusé de réception » reste cochée : Marc Dubois n'a rien reçu. Le texte ne donne ni le responsable du traitement, ni la finalité précise, ni la base légale, ni les droits d'accès, de rectification et de réclamation auprès de la CNIL. L'e-mail « marc.dubois » est accepté. | Art. 13 RGPD : informer chaque candidat au moment de la collecte, quelle que soit la source (L1221-9). Contrôler le format de l'e-mail, comme le fait déjà « Nouvelle arrivée ». |
| 13 | Majeur | Légal (RGPD) | Fiche candidat | Aucun bouton pour supprimer un candidat à sa demande, ni pour exporter ses données. Le message de refus dit pourtant « vous pouvez vous y opposer en répondant à ce message ». Pas de détection des doublons de candidature. | Droits d'accès et d'effacement (art. 15 et 17 RGPD) : action « Supprimer à la demande du candidat », tracée, et export de son dossier. |
| 14 | Majeur | Légal | Évaluation, notes | Le commentaire d'évaluation « vérifier son projet familial (enfants en bas âge ?) » est enregistré sans alerte. Le champ « Notes » est libre lui aussi, sans contrôle. | L1132-1 (situation de famille). Appliquer aux notes et aux commentaires l'analyse déjà faite sur l'offre. Rappeler que le candidat peut demander ces données (art. 15 RGPD). |
| 15 | Majeur | Usage RH / Légal | Acceptation | « Acceptée : embaucher » : un clic, irréversible, sans confirmation. La date d'acceptation est forcément aujourd'hui et on ne peut joindre aucune preuve (e-mail ou lettre signée). | L'acceptation forme le contrat (Cass. soc. 21 sept. 2017) : saisir la date et le canal de la réponse, joindre la preuve, confirmer avant de créer la recrue. |
| 16 | Majeur | Pratique | Validation Direction | La RH saisit la décision « de Claire Durand ». Le circuit et les données enregistrent « Validée par Claire Durand » (`by: e5`), alors qu'Olivia a cliqué. Claire ne reçoit rien. Le profil Manager peut pourtant être vu en Claire Durand. | Tracer l'auteur réel (« saisi par Olivia Bennett pour Claire Durand ») ou laisser la Direction valider elle-même. |
| 17 | Majeur | Usage RH | Embauche | L'e-mail personnel du candidat n'est pas repris sur la recrue : seule une adresse `@novastudio.fr`, pas encore créée, existe. Le message « Bienvenue… déposez vos documents » n'a donc pas de destinataire réel. « Nouvelle arrivée », elle, demande l'e-mail personnel. | Reprendre `email` → `personalEmail` du candidat et envoyer l'invitation à l'espace. |
| 18 | Mineur | Pratique | Lettre de proposition | « Une période d'essai s'appliquera conformément à la convention collective » : aucune durée, et rien sur la classification, la durée du travail ou le forfait. | La période d'essai doit être expressément stipulée dans la lettre d'engagement ou le contrat (L1221-23). Préciser sa durée. |
| 19 | Mineur | Usage RH | Fiche recrue | Le titre de poste garde « H/F » (« Directeur artistique H/F ») dans la fiche, le registre et le contrat. Des valeurs sont inventées par défaut (`family: 'Célibataire'`). | Retirer « H/F » à l'embauche. Laisser vides les champs non renseignés. |
| 20 | Mineur | Légal (RGPD) | Refus | La case « garder dans le vivier » est cochée par défaut. Sans vivier, le dossier est quand même gardé 2 ans (« supprimé au plus tard le 27 octobre 2028 »). | CNIL, référentiel recrutement : conservation de 2 ans au plus après le dernier contact, candidat informé et sans opposition de sa part (modalités à vérifier). Hors vivier, justifier ou raccourcir la durée. |
| 21 | Mineur | Pratique | Vivier | « Proposer pour… » place le candidat directement en Présélection d'une autre offre, avant qu'il ait répondu. Le refus et les entretiens de la candidature précédente sont effacés. La source devient « Vivier · Cooptation », une catégorie de plus dans le reporting. | Garder l'historique des candidatures. Attendre la réponse avant d'inscrire le candidat. Séparer la source et le canal. |
| 22 | Mineur | Pratique | Fiche candidat | Le manager peut « choisir » un candidat avec 1 entretien évalué sur 2, sans avertissement. On peut aussi passer à « Proposition » sans aucun entretien (« Étape (changement direct) »). | Avertir quand l'évaluation n'est pas terminée. |
| 23 | Mineur | Légal | Publication | Publier malgré des alertes ne demande aucune confirmation : la trace n'existe que dans le journal. | Faire confirmer explicitement « Publier malgré N alertes ». |
| 24 | Mineur | UX | Fiche candidat | Après « Présélectionner », la fiche passe toute seule au candidat suivant (Sophie → Marc) : on peut croire que l'action a échoué. | Afficher un retour clair ou rester sur le candidat. |
| 25 | Mineur | UX | Divers | Coquilles : « Évaluer l'test technique », « pensez à répondre aux 1 autre candidat », mélange du « tu » (annonce de démo, Nouvelle arrivée : « Renseigne… ») et du « vous ». | Relecture des libellés. |
| 26 | Mineur | UX | Besoin | Un brouillon se rouvre à l'étape 1. Le journal affiche deux fois « Besoin complété », sans dire ce qui a changé (fourchette 45–52 → 50–58 k€). | Rouvrir à la dernière étape. Montrer l'écart entre deux versions. |
| 27 | Mineur | UX / Technique | CV | Le visualiseur affiche « pdf;base64,JVBER… » à la place du nom du fichier. Un fichier de plus de 700 Ko est gardé sans contenu, sans prévenir. Une sauvegarde qui échoue (stockage plein) ne signale rien. | Afficher le nom du fichier. Prévenir quand un fichier est trop lourd ou qu'une sauvegarde échoue. |
| 28 | Mineur | Pratique | Proposition | La date d'entrée proposée par défaut tombe un samedi 26 décembre (arrivée souhaitée par défaut = J+60). La liste des managers contient tous les salariés (20). La liste des interviewers inclut une stagiaire et une salariée. | Proposer un jour ouvré. Filtrer les listes. |
| 29 | Mineur | Usage RH | Reporting | Délai de recrutement de « 0 jour » pour une offre pourvue le jour de sa publication. Pas de répartition femmes-hommes des candidats ni des embauches. L'entonnoir ne porte que sur les offres ouvertes. | Indicateurs d'égalité dans le recrutement, utiles pour la future directive. |

## 3. Points forts

- L'assistant du besoin est clair : les étapes sont contrôlées une par une, les messages d'erreur sont précis, le brouillon s'enregistre automatiquement et le récapitulatif a des liens « Modifier » par section.
- Le circuit s'adapte au motif (création de poste ou poste hors budget → Direction) et reste visible partout : frise, onglet Validation, « Prochaine étape · À vous ».
- Un commentaire est obligatoire pour demander une modification ; un motif est obligatoire pour refuser.
- Les talents internes (souhaits de mobilité) sont proposés dès la demande.
- La rédaction partagée de l'offre fonctionne : auteur, contributions, envoi aux RH, publication réservée aux RH.
- L'alerte de discrimination signale bien les cas classiques (âge, tranche « 25-35 ans », langue maternelle, nationalité, « bonne présentation », « sans enfants »). Elle ne bloque pas, et la publication malgré alerte est journalisée.
- L'évaluation structurée est rigoureuse : la fiche de cadrage sert de grille, chaque note exige un fait observé, puis vient un avis. La note globale en découle.
- Les messages types aux candidats sont modifiables par les RH. Chaque fiche affiche la date de suppression RGPD. La purge automatique à 2 ans fonctionne et le vivier peut être relancé sur une autre offre.
- La lettre de proposition qualifie correctement l'offre de contrat : son acceptation vaut conclusion du contrat. La fourchette est contrôlée en direct.
- À l'acceptation, la recrue est créée et entre dans Arrivées, avec son espace « Mon arrivée ». Le manager est notifié et un rappel invite à répondre aux autres candidats.
- « Nouvelle arrivée » hors offre a de bons garde-fous : CDD de 18 mois au plus, date de fin obligatoire, e-mail, homonymes.

## 4. Captures

| Fichier | Contenu |
|---|---|
| rec_01_mgr_mes_demandes.png | « Mes demandes » de Thomas, avec les frises par besoin. |
| rec_02_wiz_err_titre.png | Étape 1 : erreur « Indiquez l'intitulé du poste ». |
| rec_03_wiz_err_alternatives.png | Étape 2 : création de poste sans alternative refusée, talent interne proposé. |
| rec_04_mgr_brouillon.png | Le brouillon BES-2026-011 dans « Mes demandes ». |
| rec_05_wiz_recap.png | Récapitulatif avec les liens « Modifier » par section. |
| rec_06_mgr_besoin_envoye.png | Besoin envoyé, en attente de la validation RH. |
| rec_07_rh_besoins_table.png | Tableau des besoins côté RH. |
| rec_08_rh_modif_demandee.png | Circuit après la demande de modification. |
| rec_09_mgr_notifs.png | Notification de la demande de modification au manager. |
| rec_10_rh_decision_direction.png | La RH saisit la décision « pour la direction ». |
| rec_11_besoin_valide_circuit.png | Circuit complet, attribué à Claire Durand. |
| rec_12_mgr_redaction_offre_alertes.png | Projet d'offre du manager avec 9 termes signalés. |
| rec_13_mgr_projet_envoye.png | Projet envoyé aux RH. |
| [rec_14_rh_relecture_alertes.png](captures/rec_14_rh_relecture_alertes.png) | Relecture RH : alertes ; « habitez Paris », « photo » et l'anglais ne sont pas signalés. |
| rec_15_rh_offre_publiee.png | Après la publication (OFF-2026-011). |
| rec_16_offre_onglet.png | Onglet « L'offre » : texte publié, fourchette seulement en interne. |
| rec_17_ajout_candidat_cv.png | Formulaire d'ajout de candidat avec le CV. |
| rec_18_board_3_candidats.png | Tableau de l'offre avec 3 candidats reçus. |
| rec_19_fiche_sophie_cv.png | Fiche candidate : CV PDF (titre en base64), « Prochaine étape ». |
| rec_20_accuse_reception_rgpd.png | Accusé de réception avec l'information RGPD. |
| rec_21_convocation.png | Convocations (date sans année, sans lieu). |
| rec_22_refus_rgpd.png | Fenêtre de refus : motif, vivier, message. |
| rec_23_message_type.png | Message « Point d'étape ». |
| rec_24_mgr_a_traiter_eval.png | « À traiter » du manager : évaluations à remplir. |
| rec_25_eval_structuree.png | Évaluation structurée avec un commentaire discriminant accepté. |
| rec_26_mgr_fiche_sophie.png | Note par compétence, « Choisir ce candidat ». |
| rec_27_rh_a_traiter.png | « À traiter » de la RH (tri, évaluations, propositions, sans nouvelles). |
| rec_27b_blocage_entretien_non_tenu.png | Proposition bloquée par un entretien jamais tenu. |
| rec_28_proposition_hors_fourchette.png | Proposition au-dessus de la fourchette : simple avertissement. |
| rec_29_lettre_proposition.png | Lettre de proposition (retrait possible, date d'entrée passée). |
| rec_30_proposition_envoyee.png | Seconde proposition envoyée. |
| rec_31_embauche.png | « Embauché·e », lien vers le dossier d'arrivée. |
| rec_32_offre_pourvue.png | Offre pourvue ; Inès encore active. |
| rec_33_vivier.png | Vivier avec les dates de suppression. |
| rec_34_reporting_offres.png | Reporting : offres, entonnoir, sources. |
| rec_35_a_traiter_rh.png | Fenêtre « À traiter » globale (Sophie : contrat à préparer). |
| rec_36_arrivees_sophie.png | Arrivées : Sophie Roche, arrivée le 1er février. |
| rec_37_dossier_sophie.png | Dossier d'arrivée (état civil vide, pièces attendues). |
| rec_38_nouvelle_arrivee_cooptation.png | Nouvelle arrivée hors offre : détection d'un homonyme. |
| rec_39_espace_recrue_sophie.png | Espace de la recrue, « Mon arrivée J-97 ». |
| [rec_40_lettre_cdd_sans_terme.png](captures/rec_40_lettre_cdd_sans_terme.png) | Lettre de proposition d'un CDD sans terme ni motif. |

## 5. Limites du test

- La diffusion réelle de l'offre, les e-mails aux candidats et le portail candidat n'existent pas dans le prototype : la réception des messages n'a pas pu être testée.
- Le visualiseur PDF de Chromium sans interface reste noir : le rendu du CV dans un vrai navigateur n'a pas été vu.
- Le glisser-déposer des cartes entre colonnes n'a pas été joué ; seuls les boutons l'ont été. Je n'ai lu que le code du blocage du refus par le manager.
- Pas de test des cas « Déclinée », « Expirée » ni « Prolonger de 7 jours », ni de l'invitation d'un évaluateur externe au service.
- La Direction n'a pas de profil propre pour les besoins : la décision a été saisie par la RH, comme le prévoit la démo.
- Les relances au-delà de 5 jours ouvrés et de 7 jours sans nouvelles ont été observées sur les données de démo (notifications « Relance : … ») mais pas provoquées.
- Références à vérifier : numérotation exacte de L5331-1 à L5331-4 (offres d'emploi), modalités du référentiel CNIL sur la conservation, état de la transposition française de la directive 2023/970 et montant du SMIC 2026.
