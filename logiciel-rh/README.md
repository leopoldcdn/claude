# Teamora — aperçu du logiciel RH

Prototype fonctionnel, sans serveur ni base de données : ouvrez `index.html` dans un navigateur.
Les données de départ (`data.js`, schéma version 3) sont fictives ; vos modifications sont conservées dans le navigateur
(localStorage) et le bouton « Réinitialiser la démo » restaure l'état initial.

- **La roue est le menu** : il n'y a plus de barre latérale. Chaque étape du parcours collaborateur ouvre le module
  qui la gère : Besoin RH et Recrutement → Recrutement ; Vie administrative → Collaborateurs ; Temps & absences → Absences ;
  Rémunération → Paie ; Performance → Entretiens ; puis Formation, Mobilité, Santé & QVT, Relations individuelles.
  Les étapes Pré-embauche, Embauche, Intégration, Préparation du départ, Départ et Après le départ ouvrent une page
  d'étape (personnes concernées, tâches à cocher, passage à l'étape suivante). Au survol, les étapes sortent du cercle
  central ; badge blanc = personnes, besoins ou candidats à l'étape, badge orange = éléments qui vous attendent.
  Sur les autres pages, un bandeau reprend les mêmes étapes en pictogrammes (avec leur badge) ; le nom s'affiche au survol,
  et le logo ou la maison ramène à la roue.
- **Étapes par profil** : une étape n'apparaît que si le profil a besoin de son module. La Manager n'a pas l'étape
  Rémunération (pas d'accès à la paie). La Salariée ne voit pas Besoin RH ni Recrutement ; Vie administrative ouvre
  « Mon profil », Rémunération « Mes bulletins », et les étapes d'arrivée ou de départ n'apparaissent que lorsque c'est
  son étape en cours.
- **Collaborateurs** : recherche, filtres, tri, fiche détaillée, ajout/modification, départ.
- **Absences** : demande (jours ouvrés, jours fériés, contrôle du solde), validation/refus, planning mensuel, historique.
- **Paie** : préparation du mois (primes), validation, bulletins générés (simulation, taux forfaitaires).
- **Besoins de recrutement** (étape « Besoin RH ») : demande complète (motif, personne remplacée, fourchette de salaire,
  date d'arrivée, priorité, poste prévu ou non au budget), alternatives étudiées avant de recruter avec les talents internes
  issus des souhaits de mobilité, fiche de cadrage (3 à 4 compétences indispensables, atouts, nombre d'entretiens).
  Circuit de validation : RH, puis direction pour une création de poste ou un poste hors budget (la RH saisit la décision
  de la direction dans la démo) ; chaque décision (valider, demander une modification, refuser avec commentaire obligatoire)
  est historisée. À la publication, l'annonce est vérifiée : mentions discriminatoires interdites (âge, sexe, origine,
  santé, situation de famille) bloquantes, conseil « H/F ».
- **Recrutement** : offres publiées, pipeline en glisser-déposer, évaluation des candidats selon la fiche de cadrage, entretiens, notes, embauche
  (le candidat rejoint la roue à l'étape « Pré-embauche »).
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
- **Profils** : RH (Olivia, 16 étapes), Manager (Thomas, équipe Design, 15 étapes), Salariée (Léa, 8 étapes) ; les étapes ne sont pas numérotées à l’écran — chacun voit ses propres écrans.

Le fichier `index.html` n'a pas de `<!doctype>` : il est conçu pour être publié comme Artifact claude.ai,
qui ajoute lui-même l'en-tête HTML. Il s'ouvre aussi tel quel dans un navigateur.
