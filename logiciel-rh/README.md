# Teamora — aperçu du logiciel RH

Prototype fonctionnel, sans serveur ni base de données : ouvrez `index.html` dans un navigateur.
Les données de départ (`data.js`) sont fictives ; vos modifications sont conservées dans le navigateur
(localStorage) et le bouton « Réinitialiser la démo » restaure l'état initial.

- **Accueil** : la roue des 16 étapes du parcours collaborateur. Au survol, les étapes sortent du cercle central ;
  un clic ouvre l'étape (collaborateurs concernés, tâches à cocher, passage à l'étape suivante).
- **Collaborateurs** : recherche, filtres, tri, fiche détaillée, ajout/modification, départ.
- **Absences** : demande (jours ouvrés, jours fériés, contrôle du solde), validation/refus, planning mensuel, historique.
- **Paie** : préparation du mois (primes), validation, bulletins générés (simulation, taux forfaitaires).
- **Recrutement** : besoin → validation RH → offre, pipeline en glisser-déposer, entretiens, notes, embauche
  (le candidat rejoint la roue à l'étape « Pré-embauche »).
- **Profils** : RH (Olivia), Manager (Thomas, équipe Design), Salariée (Léa) — chacun voit ses propres écrans.

Le fichier `index.html` n'a pas de `<!doctype>` : il est conçu pour être publié comme Artifact claude.ai,
qui ajoute lui-même l'en-tête HTML. Il s'ouvre aussi tel quel dans un navigateur.
