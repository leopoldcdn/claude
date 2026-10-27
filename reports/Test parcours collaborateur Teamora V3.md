# Test du parcours collaborateur dans Teamora V3 : de l'entrée à la sortie

## 1. Synthèse

Teamora V3 couvre tout le cycle de vie du salarié, du besoin de recrutement à l'archivage après le départ. Les écrans sont clairs et les acteurs (RH, manager, salarié) sont bien répartis. Le logiciel donne des repères légaux utiles.
**Pour une démo, le prototype est convaincant** : le parcours se joue de bout en bout sans impasse majeure, et une PME comprend vite ce que l'outil lui apporte.
**Pour un usage réel, il n'est pas prêt.** Plusieurs calculs sont faux sur des actes à fort risque (solde de tout compte, indemnité de congés payés, accident du travail, calendrier de rupture conventionnelle). Des actes juridiques graves passent sans contrôle (rupture d'essai après la fin de l'essai, mise à la retraite à 45 ans, CDD sans motif ni terme). Aucun courrier ni PDF ne sort de l'outil.

**Constats relevés** : 129 dans les quatre rapports détaillés, soit **8 bloquants, 72 majeurs, 49 mineurs**. Une fois retirés les doublons évidents entre tronçons, il en reste environ 123 (8 bloquants, 69 majeurs, 46 mineurs).

**Trois enseignements majeurs :**
1. **L'outil guide bien mais contrôle peu.** Salaires sous le SMIC, dates passées, âges, motifs de CDD, dates de fin incohérentes : presque tout passe sans alerte.
2. **Les actes importants se font en un clic, sans confirmation ni trace.** On peut accepter une embauche, retirer une offre, passer un salarié en « Sorti » ou cocher un renouvellement d'essai sans document ni preuve. La RH n'a rien à présenter en cas de litige.
3. **La confiance se joue sur les calculs et les délais.** Les erreurs de montants et de dates, les jours fériés ignorés et les bulletins qui changent après leur diffusion sont les premiers défauts à corriger.

## 2. Méthode

- Quatre tronçons joués par l'interface (clics, formulaires, dépôts de fichiers) : recrutement, arrivée, vie en poste, départ. Démo « Nova Studio » (~20 salariés, Syntec IDCC 1486), version travail `index.html`.
- Trois profils : RH (Olivia Bennett), manager (Thomas Petit, et d'autres managers vus en remplacement), salarié (Léa Martin et les nouvelles recrues). L'espace salarié a aussi été vu sur téléphone (390 px) pendant l'arrivée.
- Date du test : 27 octobre 2026 (date système). Les cas « en retard » ont été recréés avec des dates passées, sans avancer l'horloge.
- Quatre angles : UX, usage RH, cohérence avec la pratique, obligations légales. Gravité notée Bloquant / Majeur / Mineur.
- Limites : DPAE, préfecture, signature, e-mails et diffusion des offres sont simulés. La paie n'existe que jusqu'à octobre 2026. Plusieurs règles Syntec et barèmes 2026 n'ont pas pu être vérifiés sur les textes (voir section 8). L'accessibilité au clavier n'a pas été testée.

## 3. Bilan par angle

**UX : 3/5.** Les assistants sont clairs, les erreurs de saisie sont expliquées et la frise des étapes se retrouve partout. Le dossier unique par recrue et par départ, et la liste « À traiter », aident à savoir quoi faire. Le dépôt de pièces sur téléphone est simple. En revanche, les actions irréversibles n'ont pas de confirmation, les dates n'ont souvent pas d'année, le tutoiement et le vouvoiement se mélangent, et le bouton « Donner mon avis » masque des champs. Certains retours trompent : après « Présélectionner », la fiche passe au candidat suivant. Le salarié qui part ne voit que la liste de tâches interne des RH.

**Usage RH : 2/5.** Le parcours fait gagner du temps sur le suivi : pièces validées ou refusées avec motif, contrats générés depuis un modèle, paie en 4 étapes avec export CSV, budget formation en temps réel. Mais la RH ressaisit beaucoup : candidats tapés à la main, informations de la recrue retapées dans le contrat, deux documents d'information exigés en plus du contrat. Les modules ne se parlent pas : un accident du travail déclaré ne crée ni absence ni variable de paie. La RH ne peut pas enregistrer un arrêt maladie pour un salarié. Le registre ne s'exporte pas. Deux erreurs cassent le travail réel : le changement de situation reprend les données d'un autre salarié, et l'IBAN validé est enregistré tronqué.

**Cohérence avec la pratique : 3/5.** L'ordre des étapes et les acteurs sont justes : besoin, validation, offre, entretiens, proposition, pré-embauche, contrat, intégration, puis préparation, formalités et après le départ. Les cas fréquents de la vie en poste sont présents. Il manque des gestes courants : annuler ou reporter un entretien, enregistrer une démission reçue par le manager, mener la procédure d'un licenciement pour motif personnel, saisir un avis d'inaptitude. Les courriers de sortie, qui sont les plus risqués pour une RH sans juriste, n'existent pas.

**Obligations légales : 2/5.** Plusieurs règles sont bien appliquées : DPAE au plus tôt à J-8, CDD de 18 mois au plus, stage de 6 mois au plus avec gratification, heures supplémentaires à 25 % puis 50 %, préavis cadre Syntec, indemnité légale de licenciement, faute grave, alerte CSE et DREETS pour les licenciements économiques, page Obligations selon l'effectif. Mais les 8 bloquants sont tous juridiques ou de calcul : reçu pour solde de tout compte faux, rupture d'essai après la fin de l'essai, renouvellement après l'échéance, sortie avant l'homologation, calendrier de rupture conventionnelle faux, mise à la retraite sans contrôle d'âge, CDD sans motif ni terme. S'y ajoutent l'accident du travail traité comme une maladie et un RGPD seulement déclaratif. Pour un usage réel, le niveau actuel serait plutôt 1/5.

## 4. Problèmes transversaux

| Problème | Où il apparaît | Risque | Correction recommandée |
|---|---|---|---|
| **Salaires non contrôlés (SMIC, minima Syntec)** | Fourchette du besoin et proposition (20–24 k€, 21 000 €), Nouvelle arrivée (CDI cadre à 12 000 €, CDD à 15 000 €), contrat généré avec ces montants. Proposition hors fourchette envoyée sans accord de la Direction. | Salaire illégal écrit dans le contrat. Inégalité de rémunération. | Contrôle du SMIC et du minimum conventionnel dès la saisie, comme le fait déjà la paie. Accord de la Direction avant l'envoi d'une proposition hors fourchette. |
| **Actions irréversibles en un clic, sans confirmation ni preuve** | « Acceptée : embaucher », « Retirer » la proposition, publier malgré des alertes, « Passer aux… » jusqu'à « Sorti », renouvellement d'essai par une case, dispense de mutuelle, DPAE « transmise », volet forfait jours, clôture d'intégration avec des points ouverts. | Aucune preuve opposable. Erreurs impossibles à corriger. Rupture du contrat avant la date légale. | Confirmation qui rappelle les conséquences. Saisie de la date et du canal réels. Pièce jointe obligatoire (accord écrit, justificatif, lettre). Blocage quand les conditions ne sont pas remplies. |
| **Dates sans année, dates passées ou incohérentes** | Convocation « le mercredi 1 janvier », registre (naissance et entrée sans année), durées de conservation « jusqu'au 28 oct. ». Dates passées acceptées (entretien en 2025, date d'entrée antérieure à la proposition, besoin daté dans le passé). Signature de l'entretien annuel avant sa date. Documents de sortie remis avant la fin du contrat. Dernier jour sans lien avec la fin du préavis. | Courriers ambigus, registre non présentable, délais légaux manqués. | Année dans tous les courriers et registres. Refus ou alerte sur les dates passées. Cohérence imposée entre préavis, dernier jour et remise des documents. |
| **Pas de courriers ni de PDF** | Contrat signé, bulletin, registre et texte de l'offre : ni téléchargement, ni impression, ni export. Pas de lettre de rupture d'essai, d'accord de renouvellement, d'avenant de temps partiel conforme, de convocation, de lettre de licenciement, de convention de rupture, de lettre de mise à la retraite, d'accusé de réception de démission, d'attestation de stage. | Le salarié ne reçoit pas son exemplaire. La RH rédige seule les courriers les plus risqués. | Modèles de courriers pour chaque acte, reliés au dossier. PDF téléchargeable pour tout document figé. Export du registre. |
| **Délais calculés sans week-ends ni jours fériés** | Calendrier de rupture conventionnelle (Toussaint et 11 novembre ignorés, pas de report au jour ouvrable), délai de 5 jours ouvrables de l'entretien préalable (deux fonctions de calcul différentes dans le code), date d'entrée proposée un samedi, échéance CPAM de 48 h, option « jours ouvrables » sans effet. | Date de fin annoncée 4 à 5 jours trop tôt. Procédure irrégulière. | Une seule fonction de calcul des jours ouvrables et ouvrés, avec les jours fériés et le report des délais. La réutiliser partout. |
| **Paie et documents modifiables après diffusion** | Bulletin de septembre recalculé après validation tardive d'heures. Contrat « Envoyé » encore modifiable sans nouvelle signature. Net négatif (−536 €) diffusé. | Bulletin remis différent de celui affiché. On ne sait pas quelle version le salarié a lue. | Figer bulletins et contrats à la diffusion. Régulariser le mois suivant. Nouvelle signature avec historique des versions. Contrôle bloquant sur un net négatif. |
| **CDD sans motif ni terme** | Besoin CDD sans durée ni motif, lettre de proposition sans terme, salarié créé sans date de fin. Motif en champ libre dans le contrat. « Ajouter un collaborateur » crée un CDD sans fin. « Fin de CDD » proposée pour un CDI. | Requalification en CDI. | Motif choisi dans la liste des cas de recours, terme, personne remplacée, demandés dès le besoin et repris partout. |
| **RGPD seulement déclaratif** | Information du candidat liée à une case cochée, mentions incomplètes. Pas de suppression ni d'export à la demande. Vivier coché par défaut. Commentaire discriminant enregistré. Baromètre « anonyme » dont la réponse se déduit. « Archiver » et « Programmer » sans effet réel. E-mail inventé pour le candidat « boomerang ». | Non-conformité, données gardées sans base, réidentification. | Information systématique et complète. Suppression et export tracés. Seuil et publication différée pour le baromètre. Purge réelle et registre des traitements. |
| **Droits trop larges (manager, salarié, ancien salarié)** | Le manager voit le motif « maladie » en paie, les montants d'indemnités de son équipe, la fiche d'un salarié archivé. La RH enregistre une décision « par Claire Durand » sans trace de l'auteur réel. Le salarié change seul son lieu de travail. L'ancien salarié garde tout son espace. | Atteinte au secret médical, défaut de minimisation, traçabilité faussée. | Revoir la matrice des droits écran par écran. Tracer l'auteur réel. Espace réduit et limité dans le temps après la sortie. |
| **Double saisie et modules non reliés** | Candidats saisis à la main, e-mail personnel perdu à l'embauche, informations de la recrue retapées dans le contrat, documents « 7 jours / 1 mois » en plus du contrat, accident du travail et absence séparés, deux calculs de congés différents (écran et bulletin), mesure disciplinaire « Licenciement » qui ne crée pas de départ. | Perte de temps, incohérences entre écrans. | Une seule source par donnée : formulaire de collecte côté recrue, événement unique pour l'accident, procédure reliée au départ. |
| **Catégorie cadre et forfait jours mal gérés** | Pas de catégorie ni de classification dans le besoin. Contrat « 35 heures » pour un cadre. Tout cadre est au forfait 218 jours sans convention individuelle. Volet forfait de l'entretien coché en un clic. | Forfait jours privé d'effet. Heures supplémentaires réclamables. | Attribut « forfait jours » par salarié avec date de la convention, clause dans le contrat, formulaire pour le volet de l'entretien. |
| **Vocabulaire et finitions** | Tutoiement et vouvoiement mélangés dans les quatre tronçons, coquilles (« l'test technique », « aux 1 autre candidat »), bouton « Donner mon avis » qui masque du contenu. | Image peu professionnelle en démo. | Relecture des libellés, un seul registre, bouton d'avis qui ne recouvre rien. |

## 5. Parcours étape par étape

| Étape | Profil | Résultat | Constat clé |
|---|---|---|---|
| Besoin de recrutement | Manager | ✅ | Assistant clair, erreurs bien expliquées, brouillon automatique. Date passée acceptée, pas de catégorie ni de classification. |
| Validation du besoin | RH (pour la Direction) | ⚠️ | Commentaire obligatoire pour demander une modification. La décision saisie par la RH est enregistrée au nom de Claire Durand. |
| Rédaction et publication de l'offre | Manager, RH | ⚠️ | Alerte de discrimination utile, mais lieu de résidence, photo et annonce en anglais non détectés. Fourchette absente de l'annonce. « Publier » ne diffuse rien. |
| Candidats | RH | ⚠️ | Saisie manuelle. Information RGPD envoyée seulement si une case reste cochée. E-mail invalide accepté. Pas de suppression à la demande. |
| Entretiens et évaluation | RH, Manager | ⚠️ | Évaluation structurée rigoureuse. Un entretien non tenu ne s'annule pas et bloque la proposition. Convocation sans année ni lieu. Commentaire discriminant accepté. |
| Proposition d'embauche | RH | ⚠️ | Fourchette contrôlée en direct, mais une proposition hors fourchette part sans accord. Retrait en un clic. Période d'essai sans durée. |
| Acceptation et création de la recrue | RH | ⚠️ | La recrue entre bien dans Arrivées. Clic irréversible, sans date réelle ni preuve. E-mail personnel non repris. |
| CDD issu du recrutement | RH | ❌ | Ni motif ni terme dans le besoin, la lettre et la fiche. |
| Nouvelle arrivée hors offre | RH | ⚠️ | Bons contrôles de durée (CDD, stage). Salaire de 12 000 €/an accepté pour un CDI cadre. |
| Pré-embauche (pièces) | Salarié, RH | ✅ | Circuit dépôt, aperçu, refus motivé, nouveau dépôt, clair des deux côtés. La recrue ne peut saisir ni adresse ni NIR. |
| Contrat de travail | RH, Salarié | ⚠️ | Modèle versionné, zones à compléter bloquantes. 35 h écrites pour un cadre au forfait. Signature du salarié seul, sans PDF. Modifiable après envoi. Pas de signature sur téléphone. |
| DPAE | RH | ❌ | Possible à J-8, retard signalé. DPAE faite sans vérification du titre de séjour d'une salariée hors UE, sans contrôle des données requises. |
| Registre unique du personnel | RH | ❌ | Dates sans année, ordre d'inscription et non d'embauche, inscription 27 jours avant l'embauche, stagiaires mélangés, pas d'export. |
| Informations obligatoires, mutuelle, VIP, prévoyance | RH | ⚠️ | Échéances affichées. Deux documents en plus du contrat. Dispense de mutuelle sans justificatif. VIP planifiée après la limite. Prévoyance cadre hors des étapes. |
| Intégration et période d'essai | RH, Manager, Salarié | ❌ | Points de suivi et rapport d'étonnement partagés, lettre de confirmation générée. Rupture acceptée après la fin de l'essai. Renouvellement accepté 25 jours après l'échéance. Pas de lettre de rupture. |
| Stage | RH | ⚠️ | Convention et tuteur à la place de la DPAE et du contrat. Gratification au taux 2024. Plafond de stagiaires par tuteur non contrôlé. |
| Absences et congés | Salarié, Manager, RH | ⚠️ | Circuit clair, chevauchement refusé. Solde qui ignore les demandes en attente. La RH ne peut pas saisir un arrêt. Maladie pendant les congés refusée. Accident du travail avec carence. |
| Temps de travail | Salarié, Manager | ⚠️ | Heures supplémentaires bien calculées, alertes 10 h et 48 h. Pas de dimanche. Moyenne sur 12 semaines fausse. Forfait jours appliqué d'office aux cadres. |
| Paie | Manager, RH | ❌ | Parcours en 4 étapes lisible, export CSV. Bulletins diffusés recalculés. Net négatif diffusé. Motif « maladie » visible du manager. Heures sup. sans réduction de cotisations. Prélèvement à la source sur l'apprentie et la stagiaire. |
| Entretiens annuels et professionnels | RH, Manager, Salarié | ⚠️ | Campagne lancée en 1 clic. Signature du salarié seul, avant la date de l'entretien. Volet forfait jours coché sans contenu. |
| Formation | Salarié, Manager, RH | ✅ | Circuit à deux niveaux, budget en temps réel, évaluations à chaud et à froid. Session passée validée, CPF choisi sans accord du salarié. |
| Mobilité et changement de situation | RH | ❌ | Les champs gardent les données d'un autre salarié. Avenant de temps partiel sans durée, répartition ni salaire réduit. |
| Vie administrative (RIB, profil) | Salarié, RH | ❌ | Justificatif obligatoire. IBAN enregistré tronqué. Lieu de travail modifiable par le salarié seul. |
| Santé et sécurité | Salarié, RH | ⚠️ | Déclaration d'accident et aménagements possibles. Échéance CPAM dépassée non signalée. Pas d'avis d'inaptitude. Baromètre réidentifiable. Visite de reprise en retard. |
| Relations individuelles et obligations | RH | ⚠️ | Repères de délais disciplinaires utiles, page Obligations bien adaptée à l'effectif. Pas de courrier. « Licenciement » choisi sans garde-fou. |
| Démission (ETAM, cadre) | RH | ⚠️ | Préavis justes (1 mois ETAM, 3 mois cadre). Dernier jour non contrôlé par rapport à la fin du préavis. Date de notification non modifiable. |
| Rupture conventionnelle | RH | ❌ | Calendrier calculé, mais faux (fériés et week-ends ignorés). Passage à « Sorti » avant l'homologation. |
| Licenciement pour motif personnel | RH | ❌ | Aucune procédure (convocation, entretien, lettre). Indemnité conventionnelle non calculée. |
| Licenciement économique | RH | ⚠️ | Alerte CSE et DREETS. Rien sur le CSP, l'ordre des licenciements ou la priorité de réembauche. |
| Faute grave | RH | ✅ | Ni préavis ni indemnité, indemnité de congés payés versée. |
| Retraite (mise à la retraite, départ volontaire) | RH | ❌ | Mise à la retraite à 45 ans acceptée avec 23 717 € d'indemnité, départ volontaire à 36 ans. |
| Fin de CDD | RH | ⚠️ | Indemnité de fin de contrat calculée, mais sur le salaire de base seul. Indemnité de congés à 0 €. Cas d'exclusion absents. |
| Documents de sortie et paie de sortie | RH | ❌ | Reçu pour solde de tout compte avec l'indemnité de congés comptée deux fois. Congés de l'année en cours non payés. Indemnité de rupture invisible sur le bulletin. Attestation France Travail réduite à un texte. |
| Vue du salarié pendant le départ | Salarié, Manager | ❌ | Le salarié ne voit que la checklist interne des RH. Le manager voit les montants. |
| Après le départ | RH, Salarié | ❌ | Archivage et suppression sans effet. L'ancien salarié garde tout son espace. Attestation « est employée » pour une personne sortie. E-mail inventé pour le « boomerang ». |

## 6. Les 15 corrections prioritaires

Effort : S = quelques heures, M = quelques jours, L = plus d'une semaine (estimation de l'auditeur).

| # | Correction | Gravité | Effort | Écran concerné |
|---|---|---|---|---|
| 1 | Reçu pour solde de tout compte : ne plus compter deux fois l'indemnité de congés payés (le salaire du dernier mois la contient déjà). | Bloquant | S | Départs > Documents de sortie |
| 2 | Période d'essai : dernier jour de rupture au plus tard à la fin de l'essai, avec indemnité de prévenance si le délai n'est pas tenu. Bloquer renouvellement et rupture d'essai une fois l'essai terminé. Ajouter la rupture à l'initiative du salarié. | Bloquant | M | Arrivées > Intégration |
| 3 | Dates du départ : bloquer « Sorti » avant le dernier jour, avant l'homologation d'une rupture conventionnelle et tant que les documents ne sont pas prêts, avec confirmation. Proposer un dernier jour égal à la fin du préavis. Rendre la date de notification modifiable. | Bloquant | S | Départs > « Passer aux… », formulaire de départ |
| 4 | Une seule fonction de jours ouvrables et ouvrés avec jours fériés et report des délais, utilisée pour la rupture conventionnelle, l'entretien préalable, les 48 h CPAM et les dates proposées. | Bloquant | M | Départs > Rupture conventionnelle, Relations individuelles, Santé |
| 5 | Mise à la retraite et départ à la retraite : contrôler l'âge à partir de la date de naissance. | Bloquant | S | Formulaire de départ |
| 6 | CDD : motif choisi dans la liste des cas de recours, terme, personne remplacée, demandés dès le besoin et repris dans l'offre, la lettre, la fiche et le contrat. Date de fin obligatoire dans « Ajouter un collaborateur ». | Bloquant | M | Besoin, Proposition, Nouvelle arrivée, Annuaire, Contrat |
| 7 | Changement de situation : recharger poste, service, manager et salaire du salarié choisi. | Bloquant | S | Mobilité > Changements de poste |
| 8 | Contrôle du SMIC et des minima Syntec à chaque saisie de salaire. Accord de la Direction pour une proposition hors fourchette. | Majeur | S | Besoin, Proposition, Nouvelle arrivée, Contrat |
| 9 | Paie : figer les bulletins diffusés et régulariser le mois suivant. Contrôle bloquant si l'acompte dépasse le net ou si le net est négatif. | Majeur | M | Paie > Contrôles, Bulletins |
| 10 | Indemnités de sortie : payer les congés de l'année en cours, comparer maintien et dixième, afficher l'indemnité de rupture sur le bulletin, calculer l'indemnité conventionnelle Syntec. | Majeur | M | Paie, Départs > Chiffrage |
| 11 | Accident du travail : pas de carence et journée de l'accident payée. Accepter un arrêt maladie pendant les congés. Permettre à la RH d'enregistrer un arrêt pour un salarié. Relier déclaration, absence et paie. | Majeur | M | Absences > Arrêts de travail, Santé > Accidents |
| 12 | DPAE et embauche : nationalité obligatoire, vérification du titre de séjour avant DPAE, contrôle des données requises, copie remise au salarié. | Majeur | S | Arrivées > Embauche |
| 13 | Vie administrative : garder l'IBAN complet (chiffré) pour la RH et la paie, et permettre d'ouvrir le justificatif avant validation. | Majeur | S | Vie admin. > Demandes de modification |
| 14 | Forfait jours : attribut individuel avec date de la convention, clause dans le contrat (fin du « 35 heures » pour les cadres au forfait), formulaire pour le volet de l'entretien annuel. | Majeur | M | Contrat, Compteurs, Performance |
| 15 | Courriers et PDF : modèles pour la rupture d'essai, le renouvellement, le temps partiel, la procédure de licenciement, la convention de rupture, la mise à la retraite, la démission, le certificat de travail d'un ancien salarié. PDF téléchargeable du contrat et du bulletin, export du registre avec années. | Majeur | L | Modèles, Arrivées, Départs, Paie, Registre |

## 7. Points forts à conserver

- Un dossier unique par recrue et par départ, découpé en trois temps avec des barres d'avancement, et la liste « À traiter » par personne.
- L'assistant du besoin : étapes contrôlées, messages précis, brouillon automatique, récapitulatif modifiable par section.
- L'alerte de discrimination dans l'offre, non bloquante et journalisée.
- L'évaluation structurée des candidats : une note exige un fait observé.
- Le circuit des pièces de pré-embauche : dépôt, refus avec motif, nouveau dépôt, aussi sur téléphone.
- Les contrôles de durée à la création (CDD, stage, gratification) et la DPAE à J-8.
- Le calcul des heures supplémentaires et la paie en 4 étapes avec export CSV.
- Le circuit de formation à deux niveaux avec budget en temps réel.
- Les repères légaux de la procédure disciplinaire et des visites de reprise.
- La page Obligations selon l'effectif.
- Le préavis cadre Syntec, l'indemnité légale de licenciement et la faute grave.

## 8. Points juridiques à faire valider par un juriste

Les références ci-dessous sont reprises telles que les rapports détaillés les donnent. Celles que les testeurs ont marquées « à vérifier » le sont aussi ici. Les montants recalculés à la main par les testeurs sont à confirmer.

**Recrutement**
- Numérotation exacte des articles sur les offres d'emploi (L5331-1 à L5331-4) : offre rédigée en français (L5331-4, à vérifier), sans limite d'âge (L5331-2, à vérifier).
- Directive (UE) 2023/970, art. 5 (fourchette de salaire avant l'entretien) : état de la transposition française, attendue au 7 juin 2026, à vérifier.
- Montant du SMIC 2026 : les rapports citent ≈ 21 600 € bruts annuels pour 2025 et un SMIC de 1 801,80 € dans le code. Valeur 2026 à vérifier.
- Durée de conservation des candidatures (référentiel CNIL, 2 ans après le dernier contact) : modalités à vérifier, en particulier hors vivier.
- Rétractation de l'offre avant l'expiration du délai (art. 1116 C. civ., Cass. soc. 21 sept. 2017) : citée sans réserve par le testeur, à confirmer pour le texte de l'aide et de la lettre.

**Arrivée**
- Cas de dispense de mutuelle : L911-7 CSS et D911-2 CSS (à vérifier).
- Mentions du registre unique, dont le type et le numéro du titre de séjour : D1221-23 et D1221-24 (à vérifier).
- Niveau de signature électronique requis pour le contrat (art. 1367 C. civ., eIDAS) : à vérifier.
- Visites préalables à l'affectation (travail de nuit, moins de 18 ans, suivi renforcé) : R4624-18 et R4624-24 (à vérifier).
- Gratification de stage : taux 2026 à vérifier (4,50 €/h cité pour 2025). Seuil de « plus de 2 mois » apprécié en présence, 44 jours ou 308 heures (à vérifier).
- Plafonds de stagiaires par entreprise et par tuteur : R124-10 et R124-13 C. éduc. (à vérifier).
- Le libellé « la DPAE vaut adhésion au service de santé au travail » : le testeur pense qu'il s'agit d'une démarche distincte (à vérifier).
- Durées d'essai et de renouvellement Syntec (2, 3 et 4 mois) : non comparées au texte en vigueur, à vérifier.

**Vie en poste**
- Arrêt maladie pendant les congés payés et report des jours (jurisprudence CJUE et Cass. soc. de septembre 2025) : à vérifier.
- Maintien de salaire Syntec (durées et taux selon ancienneté et catégorie) : à vérifier.
- Rendez-vous de liaison (L1226-5-1) : à vérifier.
- Loi du 24 octobre 2025 : faut-il un premier entretien de parcours dans l'année qui suit l'embauche ? À vérifier.
- Contingent d'heures supplémentaires Syntec (220 h dans le logiciel) : à vérifier.
- Durées Syntec des événements familiaux : à vérifier.
- Barèmes 2026 : plafond des IJSS à 1,4 SMIC depuis avril 2025, seuil du taux réduit maladie à 2,25 SMIC depuis 2025, SMIC 2026 (à vérifier). Le testeur n'avait pas accès aux textes.

**Départ**
- Report d'un délai qui expire un samedi, un dimanche ou un jour férié : art. R1231-1 (à vérifier). Le calendrier recalculé à la main (fin au plus tôt vers le 23 ou 24 novembre au lieu du 19) est à recalculer par un juriste.
- Délai de 5 jours ouvrables avant l'entretien préalable : selon le testeur, ils doivent être entiers, ce qui placerait l'entretien au 5 novembre et non au 4 (à vérifier).
- Contribution patronale de 30 % sur l'indemnité de rupture conventionnelle (CSS, à vérifier).
- Indemnité conventionnelle Syntec pour un cadre de 4 ans 3 mois : environ 7 300 € selon le testeur, contre 5 588 € d'indemnité légale (à vérifier).
- Préavis Syntec d'un ETAM qui démissionne après 2 ans : à vérifier.
- Mention des emplois successifs sur le certificat de travail : art. D1234-6 (à vérifier).
- Délai du signalement DSN de fin de contrat : à vérifier.
- Congés fixés avant la notification : décalent-ils la fin du préavis ? À vérifier.
- Indemnité de départ volontaire à la retraite : art. L1237-9 et D1237-1, montants à vérifier.

## 9. Annexes

**Rapports détaillés**
- [Tronçon 1 : recrutement](test-v3/1_recrutement.md)
- [Tronçon 2 : arrivée](test-v3/2_arrivee.md)
- [Tronçon 3 : vie en poste](test-v3/3_vie.md)
- [Tronçon 4 : départ](test-v3/4_depart.md)

**Captures retenues** (12 sur environ 200 prises pendant le test)
- [rec_14_rh_relecture_alertes.png](test-v3/captures/rec_14_rh_relecture_alertes.png) : alertes de discrimination dans l'offre ; « habitez Paris intra-muros », « photo » et l'anglais ne sont pas signalés.
- [rec_40_lettre_cdd_sans_terme.png](test-v3/captures/rec_40_lettre_cdd_sans_terme.png) : lettre de proposition d'un CDD sans terme ni motif, entrée un samedi 26 décembre.
- [arr_03_cdi_rempli.png](test-v3/captures/arr_03_cdi_rempli.png) : CDI cadre saisi à 12 000 €/an, accepté ensuite sans alerte.
- [arr_43_registre.png](test-v3/captures/arr_43_registre.png) : registre unique du personnel, dates de naissance sans année.
- [arr_51_emma_rupture_modal.png](test-v3/captures/arr_51_emma_rupture_modal.png) : rupture de l'essai qui impose une date après la fin de l'essai.
- [arr_63_paul_essai_echu.png](test-v3/captures/arr_63_paul_essai_echu.png) : essai terminé le 2 octobre, « Renouveler » et « Mettre fin à la période d'essai » toujours proposés.
- [vie_08_rh_arrets.png](test-v3/captures/vie_08_rh_arrets.png) : arrêts de travail ; carence appliquée à l'accident du travail du 26 octobre.
- [vie_16_sal_bulletins.png](test-v3/captures/vie_16_sal_bulletins.png) : bulletins de la salariée, net payé de −536,23 € en octobre.
- [vie_32_picker.png](test-v3/captures/vie_32_picker.png) : changement de situation de Hugo, avec les données d'Olivia (RH, Claire Durand, 62 000 €).
- [dep_32_doc_1.png](test-v3/captures/dep_32_doc_1.png) : reçu pour solde de tout compte, indemnité de congés payés comptée deux fois.
- [dep_52_ines_rc.png](test-v3/captures/dep_52_ines_rc.png) : calendrier de rupture conventionnelle (rétractation un samedi, demande un 1er novembre).
- [dep_57_form_retraite.png](test-v3/captures/dep_57_form_retraite.png) : mise à la retraite d'une salariée de 45 ans, indemnité estimée à 23 717 €.
