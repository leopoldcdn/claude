# Tronçon 3 : la vie du collaborateur en poste (Teamora V3)

> Copie du rapport de test. Les captures marquées d'un lien sont copiées dans `captures/` ; les autres sont restées dans le dossier de travail du test et ne sont pas jointes.

Test réalisé le 27 octobre 2026 (date système) sur `index.html`, Chromium 1440×900, démo réinitialisée au départ puis état conservé d'un script à l'autre (profil navigateur persistant). J'ai joué le parcours par l'interface (clics, saisies, envoi de fichiers) en alternant Léa Martin (salariée, ETAM), Thomas Petit (manager Design) et Olivia Bennett (RH). Pour comprendre certains résultats, j'ai lu le code de `app.js` sans le modifier. Scripts : `/tmp/claude-0/-home-user-claude/69e089e5-50a3-5376-b0ed-78374a160077/scratchpad/audit/vie/`.

## 1. Parcours réalisé

| # | Étape | Profil | Résultat |
|---|---|---|---|
| 1 | Demande de congés payés du 16 au 20 nov. (5 j, solde affiché ensuite) | Salariée | ✅ |
| 2 | Demande qui chevauche une absence déjà posée (18-19 nov.) | Salariée | ✅ refusée : « Vous avez déjà une absence sur cette période » |
| 3 | Congés payés qui dépassent le solde (27 j pour un solde de 20) | Salariée | ✅ bloqué au moment de la demande |
| 4 | Deux autres demandes de CP (9 j + 10 j) alors que la première est en attente : 24 j demandés pour 20 j de solde | Salariée | ⚠️ les trois demandes passent ; le solde ne tient pas compte des demandes en attente |
| 5 | Télétravail 3 j dans une semaine (la charte en autorise 2) | Salariée | ✅ avertissement, la demande part quand même |
| 6 | Congé pour mariage (événement familial), enregistré de droit | Salariée | ✅ (le justificatif est demandé, mais il n'y a aucun champ pour le joindre) |
| 7 | Saisie des heures : 46 h dans la semaine, dont 11 h un mercredi | Salariée | ✅ calcul 8 h à 25 % + 3 h à 50 %, alerte au-delà de 10 h ; ⚠️ pas de dimanche dans la grille, et on peut déclarer des jours pas encore travaillés |
| 8 | Validation des CP par le manager, la 3e demande étant bloquée faute de solde | Manager | ⚠️ seul un message temporaire s'affiche ; la demande reste « En attente » sans fin |
| 9 | Refus du télétravail avec un motif laissé vide | Manager | ⚠️ accepté sans motif |
| 10 | Validation de 3 feuilles de temps, dont une de septembre | Manager | ⚠️ **le bulletin de septembre, déjà diffusé, change** (voir C3) |
| 11 | Planning et compteurs de l'équipe | Manager | ✅ / ⚠️ la « moyenne sur 12 semaines » est fausse |
| 12 | Onglets RH : à valider, temps, arrêts, compteurs, planning, historique | RH | ✅ lisibles ; ⚠️ demandes passées restées « En attente » sans alerte |
| 13 | Enregistrer un arrêt maladie ou un congé familial **pour un salarié** | RH | ❌ aucun écran ne le permet ; seul le salarié peut déclarer |
| 14 | Arrêt maladie déclaré par la salariée pendant ses CP ; arrêt maladie a posteriori ; enfant malade 5 j ; accident du travail 1 j | Salariée | ❌ maladie pendant les CP refusée ; ⚠️ 5 j d'enfant malade acceptés (droit de 3 j) ; ❌ carence appliquée à l'accident du travail |
| 15 | Paie d'octobre : validation des variables par le manager, prime de 500 €, acompte de 3 000 € | Manager, RH | ✅ ; ⚠️ le manager voit le mot « maladie » |
| 16 | Contrôles (12 points), puis envoi, export CSV, réception, diffusion | RH | ✅ parcours clair ; ❌ un **net à payer négatif (−536 €)** est diffusé sans alerte |
| 17 | Lecture du bulletin d'octobre et des bulletins de juillet à septembre (maintien de salaire) | Salariée, RH | ⚠️ plusieurs écarts (voir C4, C6, C9 à C12) |
| 18 | Option bulletin papier, rémunération globale | Salariée | ✅ |
| 19 | Campagne d'entretiens annuels lancée en 1 clic (10 entretiens créés) | RH | ✅ |
| 20 | Auto-évaluation, évaluation du manager, signature | Salariée, Manager | ⚠️ une seule signature (la salariée), donnée 3 semaines **avant** la date prévue de l'entretien, sans espace pour ses commentaires |
| 21 | Suite d'entretien : le manager propose une formation | Manager | ✅ ; ⚠️ formation déjà suivie en avril, aucun avertissement |
| 22 | Échéancier des entretiens de parcours professionnel, état des lieux à 8 ans (page Obligations) | RH | ⚠️ voir C27 |
| 23 | Volet « forfait jours » de l'entretien | RH | ❌ un seul clic sur un bouton dont le libellé ressemble à un statut marque le volet « fait » ; aucun contenu n'est saisi |
| 24 | Demande de formation au catalogue, validation du manager puis des RH, budget | Salariée, Manager, RH | ✅ circuit à deux niveaux et budget (réalisé, engagé, restant) ; ⚠️ inscription validée pour une session déjà passée |
| 25 | Financement par le CPF choisi par la RH | RH | ⚠️ possible sans aucun accord du salarié |
| 26 | Évaluation à chaud (salariée) et à froid (manager) | Salariée, Manager | ✅ |
| 27 | Souhait d'évolution, avis du manager | Salariée, Manager | ✅ |
| 28 | Changement de situation depuis Mobilité : choix d'un salarié, passage à temps partiel | RH | ❌ **les champs gardent les valeurs du premier salarié de la liste** (voir C1) |
| 29 | Passage à 50 % depuis la fiche de Hugo, avenant | RH | ❌ l'avenant ne dit rien du temps partiel ; aucune alerte sur les 24 h |
| 30 | Demande de modification du RIB avec justificatif, validation RH | Salariée, RH | ✅ justificatif obligatoire ; ❌ **l'IBAN enregistré est tronqué** (•••• 0890) ; la RH ne peut pas ouvrir le justificatif |
| 31 | Changement du lieu de travail directement dans « Mes informations » | Salariée | ⚠️ appliqué sans aucune validation (Paris → Lyon) |
| 32 | Réponse au baromètre QVT | Salariée | ✅ ; ❌ on peut retrouver la réponse individuelle par différence |
| 33 | Déclaration d'accident du travail, échéance CPAM | Salariée, RH | ⚠️ échéance dépassée non signalée ; aucun lien avec l'absence ni la paie |
| 34 | Demande d'aménagement de poste | Salariée | ✅ |
| 35 | Retour après une longue absence, visite de reprise | RH | ⚠️ visite fixée d'office au 29 oct., retard d'un mois non signalé ; pas de résultat « inapte » |
| 36 | Échange RH confidentiel ; signalement par un manager | Salariée, Manager | ✅ |
| 37 | Procédure disciplinaire : repères de délais, convocation, mesure | RH | ✅ repères L1332-2 et L1332-4 ; ⚠️ aucun courrier, et on peut choisir « Licenciement » sans garde-fou |
| 38 | Lanceur d'alerte | Salariée | ✅ absent sous 50 salariés (conforme) ; canal vu seulement dans la simulation à 60 |
| 39 | Page Obligations : réel, simulation à 60 (depuis 5 ans et depuis quelques mois), à 300 | RH | ✅ ; ⚠️ « 5 % d'alternants : En place » à 300 avec 1 alternant |
| 40 | Paramètres : convention, temps de travail, absences, paie, droits | RH | ✅ ; ❌ le choix « jours ouvrables » n'a aucun effet |

## 2. Constats

| # | Gravité | Angle | Écran | Constat | Attendu (pratique ou loi) |
|---|---|---|---|---|---|
| C1 | Bloquant | Usage RH | Mobilité > Changements de poste > « Enregistrer un changement de poste » | Quand on change de collaborateur dans la liste, le poste, le service, le manager et le salaire **ne se mettent pas à jour** : ils restent ceux d'Olivia (« Responsable RH », RH, Claire Durand, 62 000 €). Vérifié en tapant « Hugo » puis Entrée dans la recherche. Résultat : j'ai programmé pour Léa un passage « Responsable RH à 62 000 € » au 1er déc., avec un avenant dans ce sens ([capture vie_32](captures/vie_32_picker.png)). Dans le code, la fenêtre ne se recalcule pas au changement de `#mv-emp`. | Recharger les données du salarié choisi, ou imposer le passage par sa fiche. |
| C2 | Majeur | Légal | Avenant de passage à temps partiel | L'avenant à 50 % ne mentionne ni la durée du travail, ni sa répartition, ni la rémunération réduite : il indique « rémunération portée à 54 000 € ». Aucune alerte sous 24 h par semaine. La modification s'applique le jour même, avant la signature du salarié, et le bouton s'appelle « Valider et remettre au salarié ». | L3123-6 : mentions obligatoires du contrat à temps partiel. L3123-27 : 24 h minimum, sauf dérogation. La modification du contrat exige l'accord écrit du salarié. Pour un cadre au forfait, réduire le nombre de jours. |
| C3 | Majeur | Légal / Usage RH | Paie > bulletins déjà diffusés | Les bulletins clôturés sont **recalculés à chaque affichage**. En validant le 27 oct. une feuille de temps de la semaine du 28 sept., le bulletin de septembre de Léa, déjà diffusé, est passé de 3 h sup. (net 2 569,19 €) à 9 h (net 2 696,96 €). Vérifié en comparant avec une démo vierge. | Un bulletin remis est figé. Les heures validées en retard se régularisent sur le mois suivant, et la DSN déjà déposée ne bouge pas. |
| C4 | Majeur | Usage RH | Paie > Contrôles / Bulletins | Un acompte de 3 000 € sur un net d'environ 2 460 € passe les contrôles : bulletin diffusé avec un **net payé de −536,23 €**, visible par la salariée. | Contrôle bloquant si l'acompte dépasse le net, ou si le net est négatif. |
| C5 | Majeur | Usage RH | Absences (profil RH) et fiche du salarié | La RH **ne peut pas saisir un arrêt maladie, un accident du travail ou un congé familial** pour un salarié. Seul l'intéressé le déclare dans son espace. | En pratique, la RH reçoit l'avis d'arrêt (papier ou mail) et l'enregistre. Il faut un « Enregistrer une absence pour… ». |
| C6 | Majeur | Légal | Absences > Arrêts de travail, et bulletin | L'accident du travail est traité comme une maladie. L'écran affiche « pas d'IJSS (carence) · pas de maintien légal avant le 8e jour », alors que l'aperçu côté salarié disait « sans délai de carence ». Sur le bulletin, la journée du 26 oct. est retenue (156,82 €) puis complétée à 103,50 €. | Accident du travail : pas de carence pour les indemnités journalières, et la journée de l'accident est payée intégralement par l'employeur (L433-1 CSS). Pas de délai de 7 jours pour le maintien de salaire (D1226-3). |
| C7 | Majeur | Légal / Pratique | Nouvelle demande (maladie) | Un arrêt maladie qui tombe pendant des congés payés déjà validés est refusé : « Vous avez déjà une absence sur cette période ». | Le salarié malade pendant ses congés a droit au report des jours concernés (jurisprudence CJUE et Cass. soc. de septembre 2025, à vérifier). Il faut accepter l'arrêt, puis recréditer les congés. |
| C8 | Majeur | Usage RH | Absences : solde de congés | Le solde ne tient pas compte des demandes en attente : 24 j demandés pour 20 j de solde, avec « solde après validation : 10 j » affiché. À la validation, la 3e demande est bloquée par un message temporaire, puis reste « En attente » indéfiniment, sans que la salariée soit prévenue. | Afficher le solde prévisionnel (solde − demandes en attente) et bloquer dès la demande, ou refuser automatiquement avec un motif. |
| C9 | Majeur | Légal | Bulletin (maintien Syntec) | Le complément employeur vaut « retenue − IJSS » sans limite de durée. Camille Roux (75 jours d'arrêt) est maintenue à 100 % pendant 2,5 mois (bulletins de juillet à septembre). Le code n'a aucun barème de durée ni de taux. | Le maintien dépend de la convention : durées et taux par ancienneté et catégorie dans Syntec (à vérifier). Le maintien légal (L1226-1, D1226-1) est de 90 % pendant 30 jours puis 66,66 %. |
| C10 | Majeur | Légal | Bulletin (heures supplémentaires) | Aucune réduction de cotisations salariales ni exonération d'impôt sur les heures sup. (« Allègements 0,00 », net imposable non réduit). Pas de déduction forfaitaire patronale non plus, alors que l'effectif est d'environ 16 ETP. | L241-17 CSS (réduction salariale), art. 81 quater CGI (exonération d'IR dans la limite annuelle), L241-18 CSS (déduction patronale sous 20 salariés). |
| C11 | Majeur | Légal | Bulletins de l'apprentie et de la stagiaire | Prélèvement à la source de 119,79 € pour Julie (apprentie, 1 750 €) et de 49,50 € pour Maëlle (gratification de 660 €). | Salaire d'apprenti et gratification de stage exonérés d'IR dans la limite du SMIC annuel (art. 81 bis CGI) : PAS à 0. |
| C12 | Majeur | Légal / Pratique | Paie > Variables (manager) | Le manager voit « 6 j maladie » pour Léa, alors que le paramètre « Les managers voient le motif des arrêts » est décoché et que le module Absences affiche bien « Absence ». L'accident du travail y est en plus compté comme maladie. | Masquer le motif partout, secret médical oblige : « 6 j d'absence ». |
| C13 | Majeur | Usage RH | Vie admin. > Demandes de modification (RIB) | La demande stocke le nouvel IBAN sous forme masquée (« •••• 0890 ») ; après validation, la fiche ne contient plus qu'un IBAN tronqué, et le virement de salaire devient impossible. Le justificatif n'est qu'un nom de fichier, que la RH ne peut pas ouvrir. | Garder l'IBAN complet (chiffré) pour la RH et la paie, masqué ailleurs. Permettre d'ouvrir la pièce avant de valider. |
| C14 | Majeur | Pratique | Performance > signature de l'entretien annuel | Une seule signature (le salarié), sans signature du manager, et pas de champ « commentaires du salarié » ni de mention « signature valant prise de connaissance ». La signature a été possible le 27 oct. pour un entretien prévu le 18 nov. Le manager peut aussi rédiger son évaluation avant l'entretien. | Bloquer avant la date de l'entretien. Double signature, commentaire final du salarié, mention de prise de connaissance. |
| C15 | Majeur | Légal | Performance > campagne (cadres au forfait) | « Volet forfait jours fait » est un bouton dont le libellé ressemble à un statut. Un clic marque le volet comme fait, sans rien saisir. Je l'ai coché par erreur pour Hugo. | L3121-65 : entretien annuel sur la charge de travail, l'organisation, l'articulation avec la vie personnelle et la rémunération. Il faut un formulaire, une trace et une confirmation. |
| C16 | Majeur | Légal | Absences / Compteurs (forfait jours) | Tout salarié de catégorie « Cadre » est automatiquement au forfait de 218 jours (`isForfait = category === 'Cadre'`), sans convention individuelle. 8 cadres sur 9 ont une projection supérieure à 218 j. | L3121-55 et L3121-63 : accord collectif et convention individuelle écrite. Il faut un attribut « forfait jours » par salarié, avec la date de la convention. |
| C17 | Majeur | Légal / Pratique | Santé > Accidents | Les échéances CPAM dépassées (Léa : « avant le 26 oct. » ; Lucas : « avant le 5 oct. ») restent au statut « Déclaré », sans couleur ni alerte. Le délai part de la date de l'accident et non du jour où l'employeur l'apprend. Il n'y a aucune option de réserves motivées. | R441-3 CSS : 48 h à compter de la connaissance de l'accident (dimanches et fériés exclus). Signaler le retard. Réserves possibles (R441-6). |
| C18 | Majeur | Usage RH | Santé > Accidents ↔ Absences ↔ Paie | La déclaration d'accident (3 jours d'arrêt) ne crée ni absence ni variable de paie. À l'inverse, un « Accident du travail » posé dans Absences ne crée pas de déclaration à faire sous 48 h. Il y a deux saisies qui ne se parlent pas. | Un seul événement, qui alimente la déclaration, l'arrêt, l'attestation de salaire et la paie. |
| C19 | Majeur | Légal (RGPD) | Santé > Baromètre QVT | Par service, la moyenne s'affiche dès 3 répondants. Design passe de 4,0 (3 réponses) à 3,5 (4 réponses) après celle de Léa : sa réponse se déduit exactement (4 × 3,5 − 3 × 4,0 = 2). L'écran promet pourtant « anonyme ». | Pas de mise à jour au fil de l'eau (résultats à la clôture du mois), seuil plus élevé (5) ou arrondi. |
| C20 | Majeur | Légal | Santé > Visites (résultats) | Les seuls résultats proposés sont « Apte » et « Apte avec aménagement » : pas d'avis d'inaptitude. Une visite d'information et de prévention (VIP) est notée « Apte ». | La VIP donne une attestation de suivi (R4624-14), pas un avis d'aptitude. Il faut pouvoir saisir l'inaptitude, qui déclenche le reclassement et le délai d'un mois (L1226-2 et L1226-4). |
| C21 | Majeur | Pratique | Santé > Retours d'absence | La visite de reprise de Camille (reprise le 19 sept., date limite le 27 sept.) est créée d'office au 29 oct., un mois en retard, sans alerte ni choix de date. Le rendez-vous de liaison n'apparaît que comme « non proposé ». | R4624-31 : visite dans les 8 jours qui suivent la reprise, retard signalé en rouge. L'employeur doit informer le salarié de la possibilité d'un rendez-vous de liaison (L1226-5-1, à vérifier). |
| C22 | Majeur | Usage RH | Paramètres > Absences | Le choix « ouvrables » est enregistré mais sans effet : l'écran affiche toujours « 5 jours ouvrés » et 2,08 j par mois. | En jours ouvrables : 2,5 j par mois (L3141-3) et samedi décompté. Sinon, retirer l'option. |
| C23 | Majeur | Légal | Compteurs de congés | L'acquisition ignore les absences : congé parental, sans solde et maladie au-delà des droits ne sont pas retirés. La phrase « 2 jours ouvrables par mois pendant l'arrêt (loi du 22 avril 2024) » est affichée sans être calculée. L'écran indique 8,5 j acquis, le bulletin 10,40 j pour la même période. | L3141-5 et L3141-5-1 : périodes assimilées. Un seul calcul, le même à l'écran et sur le bulletin. |
| C24 | Mineur | Légal | Compteurs / Bulletins | La stagiaire acquiert des CP (2 j) et a un compteur d'heures sup. Elle figure aussi dans la révision salariale (positionnement 19 %), dans la revue des talents et dans les entretiens de parcours. | Le stagiaire n'est pas salarié (règles du Code de l'éducation). L'exclure de ces écrans. |
| C25 | Mineur | Usage RH | Compteurs (heures) | « Moyenne 12 sem. » divise toujours par 12, même avec 3 semaines saisies : Léa à 10,42 h, Marc à 7,63 h. Le contrôle des 44 h en moyenne ne peut donc jamais se déclencher. | Diviser par le nombre de semaines réellement saisies (L3121-22). |
| C26 | Mineur | Légal | Heures sup. / Paramètres | Contingent fixé à 220 h, non paramétrable, alors que la convention est Syntec (contingent conventionnel à vérifier). Pas de contrepartie en repos au-delà du contingent, ni de repos compensateur de remplacement. | L3121-30 et L3121-33 : contingent et contrepartie fixés par accord, sinon 220 h (L3121-39). |
| C27 | Mineur | Légal | Entretiens de parcours professionnel | Léa, embauchée en novembre 2024, n'a aucun entretien prévu avant novembre 2028. Mehdi, déjà parti, reste « En retard ». La stagiaire et l'alternante sont listées. | Loi du 24 oct. 2025 : vérifier s'il faut un premier entretien dans l'année qui suit l'embauche (à vérifier). Exclure les salariés sortis et les stagiaires. |
| C28 | Mineur | Légal | Formation > Financement | La RH peut choisir « CPF du salarié » pour une formation (Hugo), sans aucun accord du salarié. | Le CPF ne peut être mobilisé qu'avec l'accord du titulaire (L6323-2). |
| C29 | Mineur | Pratique | Formation | Validation par les RH d'une session déjà passée (Inès, 22 oct.). Le manager propose à Léa une formation qu'elle a déjà suivie en avril, sans avertissement. Le catalogue ne montre pas le prix au salarié et ne permet aucune demande hors catalogue. | Contrôle des dates et des doublons, demande libre. |
| C30 | Mineur | Usage RH | Absences | Demandes passées restées « En attente » (Emma 8-9 oct., Inès 16 oct., Hugo 26-30 oct. en cours) : pas de relance ni de statut « à régulariser ». Le manager ne voit pas qui d'autre est absent au moment de valider. | Relance, et chevauchements de l'équipe affichés dans la ligne de demande. |
| C31 | Mineur | Légal | Événement familial / enfant malade | 5 j d'« enfant malade » acceptés alors que l'aperçu annonce 3 j par an, sans contrôle annuel. Les durées familiales sont comptées en jours ouvrés, alors que le commentaire du code parle de « jours ouvrables ramenés en ouvrés », sans conversion. Pas de champ pour joindre le justificatif demandé. | L1225-61 : 3 j, ou 5 j si l'enfant a moins d'un an ou si le salarié a 3 enfants ou plus de moins de 16 ans. L3142-4 pour les durées. Pièce jointe. |
| C32 | Mineur | Légal | Arrêts de travail | Durées affichées en jours ouvrés (« 54 jours » pour 75 jours calendaires). Plafond des IJSS calculé à 1,8 SMIC dans le code. Taux maladie réduit appliqué jusqu'à 2,5 SMIC. SMIC à 1 801,80 €. | Les IJ et le maintien se comptent en jours calendaires. Plafond à 1,4 SMIC depuis avril 2025, seuil du taux réduit à 2,25 SMIC depuis 2025, SMIC 2026 à mettre à jour (à vérifier). |
| C33 | Mineur | Usage RH | Mon profil | Le salarié change seul son « Lieu de travail » (Paris, Lyon, télétravail majoritaire). Cela touche le contrat, les frais de transport et la médecine du travail. | Passer par une demande validée par les RH. |
| C34 | Mineur | Usage RH | Paie > Contrôles | Pas de contrôle sur une prime sans nature (« Prime exceptionnelle » imposée), ni sur les feuilles de temps manquantes (Léa n'a rien saisi du 5 au 19 oct.). Clôture des variables au 20 oct. dépassée sans alerte. | Libellé ou nature de la prime, semaines non déclarées, retard de clôture. |
| C35 | Mineur | Pratique | Relations > procédure disciplinaire | On peut choisir « Licenciement » comme mesure dans une liste, sans courrier, sans mise à pied conservatoire et sans contrôle de la procédure. Aucun modèle de convocation ni de notification dans « Modèles ». Un entretien fixé avant le délai de 5 jours ouvrables est seulement mentionné, pas signalé comme non conforme. | L1332-1 à L1332-3, L1232-2 et L1232-6 : lettres types, garde-fous, alerte rouge. |
| C36 | Mineur | Usage RH | Temps de travail | Grille de saisie du lundi au samedi, sans dimanche. Repos de 11 h annoncé mais impossible à contrôler (pas d'horaires). Saisie possible pour des jours futurs. | Ajouter le dimanche, les horaires de début et de fin (L3131-1), et bloquer les jours futurs. |
| C37 | Mineur | UX | Partout | Tutoiement et vouvoiement mélangés (« Ton bulletin… », « Votre bulletin… », « tu peux t'y opposer », « Vous pouvez demander »). Double point dans « votre demande du 2 nov.. ». Le bouton « Donner mon avis » recouvre le champ « Du » de la demande d'absence (capture vie_01). « À traiter 60 » pour la RH, ce qui noie les priorités. | Un seul registre, et un bouton d'avis qui ne masque pas les champs. |
| C38 | Mineur | UX | Mes bulletins | Pas de téléchargement en PDF ni d'impression du bulletin pour le salarié. « Forfait mobilités durables 100 € » figure dans la rémunération globale mais sur aucun bulletin. | PDF téléchargeable et montants cohérents. |
| C39 | Mineur | Usage RH | Obligations (simulation 300) | « 5 % d'alternants : En place » avec 1 alternant pour 300. Les montants PEEC et FNAL ne changent pas avec l'effectif simulé. | Rapprocher les indicateurs de l'effectif simulé, ou les marquer « non simulé ». |

## 3. Points forts

- Le circuit des absences est clair : solde après validation, refus d'un chevauchement, plafond par événement familial, droits légaux enregistrés sans validation, remplaçant si le manager est absent.
- Le calcul des heures sup. par semaine est juste (25 % de la 36e à la 43e heure, 50 % au-delà, L3121-36) et les alertes 10 h et 48 h sont visibles. Les compteurs (CP, RTT, heures, forfait, congé principal non pris) sont utiles.
- La paie en 4 étapes est lisible : validation des variables par les managers avec relance, contrôles à lever avant l'envoi, export CSV complet, journal de paie, diffusion. Le bulletin est très complet : net social, PAS, cumuls, subrogation, mentions, refus du format électronique (L3243-2).
- Formation : circuit manager puis RH, budget en temps réel, évaluation à chaud et à froid, lien depuis l'entretien annuel.
- La demande de modification avec justificatif obligatoire est bien pensée. Le dossier confidentiel RH a une chronologie et des entrées visibles ou non du salarié.
- Les repères légaux de la procédure disciplinaire (prescription de 2 mois, 2 jours ouvrables et 1 mois, 5 jours ouvrables pour un licenciement) et les règles de reprise (60 jours maladie, 30 jours accident du travail, 8 jours) sont bien rappelés. Le lanceur d'alerte n'apparaît pas sous 50 salariés, ce qui est correct.
- La page Obligations s'adapte bien selon l'effectif et l'ancienneté du seuil (12 mois, 5 ans), avec la date d'application prévue.

## 4. Captures (`/tmp/claude-0/-home-user-claude/69e089e5-50a3-5376-b0ed-78374a160077/scratchpad/audit/shots/`)

- `vie_01_sal_absences.png` : espace absences de la salariée ; le bouton « Donner mon avis » masque le champ « Du ».
- `vie_02_sal_heures_demandes.png` : saisie de 46 h, alerte 10 h, demandes en cours.
- `vie_03_mgr_valider.png` : file de validation du manager, demandes passées toujours en attente.
- `vie_04_mgr_refus.png` : fenêtre de refus, motif facultatif.
- `vie_05_mgr_temps.png` : feuilles de temps de l'équipe.
- `vie_06_mgr_planning.png` : planning de l'équipe, octobre.
- `vie_07_rh_arrets.png`, [vie_08_rh_arrets.png](captures/vie_08_rh_arrets.png) : arrêts de travail ; carence appliquée à l'accident du travail.
- `vie_07_rh_compteurs.png` : compteurs RH, moyenne sur 12 semaines erronée, forfait pour tous les cadres.
- `vie_09_rh_paie_variables.png` : variables d'octobre.
- `vie_10_mgr_paie.png` : variables vues par le manager, motif « maladie » visible.
- `vie_11_rh_paie_controles.png` : contrôles avant envoi.
- `vie_12_rh_paie_envoi.png` : envoi au prestataire.
- `vie_13_rh_paie_bulletins.png` : journal de paie avec le net négatif de Léa.
- `vie_14_bulletin_lea_oct.png` : bulletin d'octobre (maladie, accident du travail, heures sup., acompte, net négatif).
- `vie_15_bulletin_camille_aout.png` : bulletin d'août d'un autre salarié (Yanis, prise par erreur de matricule) ; sans intérêt, à ignorer.
- [vie_16_sal_bulletins.png](captures/vie_16_sal_bulletins.png) : liste des bulletins côté salariée, net payé −536,23 €.
- `vie_17_rh_entretiens_campagne.png`, `_pro.png`, `_objectifs.png` : campagne, échéancier des entretiens de parcours, objectifs.
- `vie_18_sal_entretiens.png`, `vie_19_sal_autoeval.png` : entretiens et auto-évaluation côté salariée.
- `vie_20_mgr_eval.png` : évaluation du manager, possible avant la date de l'entretien.
- `vie_21_sal_signature.png` : signature par la salariée seule, sans commentaire.
- `vie_22_mgr_suite_formation.png` : proposition de formation à la suite de l'entretien.
- `vie_23_sal_formation.png`, `vie_24_sal_demande_formation.png` : catalogue et demande de formation.
- `vie_25_mgr_formation.png` : validation par le manager.
- `vie_26_rh_formation_plan.png`, `_valider.png`, `_impact.png` : plan, validations, financement (dont le CPF).
- `vie_27_mgr_froid.png` : évaluation à froid.
- `vie_28_sal_mobilite.png`, `vie_29_sal_souhait_form.png` : offres internes et souhait d'évolution.
- `vie_30_rh_changement_form.png`, `vie_31_rh_tp_50.png`, [vie_32_picker.png](captures/vie_32_picker.png) : changement de situation ; les champs restent ceux d'Olivia après le choix d'un autre salarié.
- `vie_33_avenant_tp.png` : avenant de passage à 50 % sans clause de temps partiel.
- `vie_34_sal_profil.png` : profil de la salariée (lieu de travail modifiable seul).
- `vie_35_rh_demandes_modif.png` : demandes de modification, IBAN tronqué.
- `vie_36_rh_sante_*.png` : visites, accidents, DUERP, baromètre, aménagements, retours d'absence.
- `vie_37_sal_declaration_at.png` : formulaire de déclaration d'accident (peu de champs).
- `vie_38_rh_accidents.png` : échéances CPAM dépassées sans alerte.
- `vie_40_rh_relations.png`, `vie_41_rh_disciplinaire.png`, `vie_42_rh_disciplinaire_convoc.png` : dossiers confidentiels et procédure disciplinaire.
- `vie_43_sal_echanges.png` : échange RH confidentiel côté salariée.
- `vie_45_obligations_reel.png`, `vie_46_obligations_60.png`, `vie_47_obligations_300.png` : obligations selon l'effectif réel, simulé à 60 et à 300.
- `vie_48_parametres.png`, `vie_49_param_convention.png` : paramètres, convention et temps de travail.
- `vie_39_rh_reprise.png`, `vie_44_obligations.png`, `vie_50_forfait_volet.png` : sans intérêt (pas de fenêtre ouverte, ou accueil affiché à la place de la page).

## 5. Limites du test

- Le profil persistant fait que les étapes s'enchaînent sur un même état. Des données que j'ai créées faussent la suite : le changement erroné programmé pour Léa au 1er déc., le volet forfait de Hugo coché par erreur, son passage à 50 %, et le décompte remis en « ouvrés ».
- Dates saisies avec la langue anglaise du navigateur (mm/jj/aaaa) : une saisie au clavier a produit l'année 92026. C'est un effet du test, mais l'appli n'a pas contrôlé l'année.
- Non joué : congé maternité ou paternité jusqu'au bout, temps partiel thérapeutique, inaptitude (option absente), canal lanceur d'alerte (seulement aperçu dans la simulation à 60), révision salariale, vue téléphone, Teamo.
- Les règles Syntec (maintien, contingent, durées des événements familiaux), la loi du 24 octobre 2025 et les barèmes 2026 (SMIC, plafond des IJSS, seuils de cotisations) sont signalés « à vérifier » : je n'ai pas eu accès aux textes pendant le test.
- Les calculs de paie sont annoncés comme « taux de démonstration ». Je n'ai relevé que les écarts de principe, pas les centimes.
