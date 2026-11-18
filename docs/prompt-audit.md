# Prompt : audit complet d'Escapade

> À coller tel quel dans une nouvelle session Claude Code ouverte sur le dépôt `leopoldcdn/claude`, branche `claude/dreamy-cray-8oqcvr`.

---

Tu es à la fois développeur front-end senior, designer d'interface et spécialiste de l'expérience utilisateur. Ta mission : **auditer l'application web Escapade telle qu'elle est aujourd'hui**, puis proposer une liste priorisée d'améliorations sur trois axes : **fonctionnement**, **design** et **expérience utilisateur**. **Ne modifie pas le code pendant cet audit** : tu observes, tu mesures, tu documentes et tu proposes. Réponds en français, dans un langage accessible à quelqu'un qui n'est pas développeur.

## 1. Le produit

Escapade aide à **choisir une destination de vacances** à partir d'un globe 3D. Public visé : des voyageurs francophones, sur ordinateur et sur téléphone. Le projet est aujourd'hui personnel, mais doit à terme devenir un site public.

Parcours principal :
1. Explorer le globe (vue satellite, jour et nuit en temps réel, lumières des villes la nuit, plan 3D en zoomant).
2. Chercher un lieu, cliquer n'importe où sur le globe ou utiliser « Surprends-moi ».
3. Lire la fiche du lieu : photo, faits rapides, onglets Aperçu, Photos, À voir et Infos, calendrier « Quand partir ».
4. Enregistrer le lieu (cœur), puis **créer un itinéraire** : durée, budget vol compris, voyageurs, mois, ville de départ, transport, parcours, rythme, envies.
5. Consulter l'itinéraire (étapes, budget, jour par jour), puis lancer le **survol** : la caméra vole d'étape en étape pendant qu'une bande de photos défile en bas.
6. Retrouver ses coups de cœur et itinéraires dans « Mes voyages ».

## 2. Le code

Le site est statique (HTML, CSS et JavaScript, sans étape de build), dans le dossier `web/` :

| Fichier | Rôle |
|---|---|
| `index.html`, `style.css` | Structure de la page et interface « verre » translucide |
| `app.js` | Carte MapLibre et styles réaliste/cartoon, recherche, fiche lieu, favoris |
| `itinerary.js` | Algorithme d'itinéraire, formulaire, résultat, tracé sur la carte |
| `tour.js` | Survol animé et bande de photos |
| `sun.js` | Position du soleil, ombre de la nuit, protocole de tuiles `dn://` |
| `icons.js` | Icônes |
| `data/` | Base de 850 000 lieux (GeoNames + Wikidata) découpée en cases de 5°, pays, niveaux de prix |
| `tiles/`, `fonts/` | Globe cartoon, polices de la carte |
| `tools/` | Scripts qui régénèrent les données |

Services externes, tous gratuits et sans clé : OpenFreeMap, EOX Sentinel-2, NASA GIBS (lumières de nuit), Terrain Tiles AWS, Photon (géocodage), Wikipédia, Wikivoyage, Wikimedia Commons, Open-Meteo, OSRM (trajets routiers). Les données personnelles (favoris, itinéraires) sont stockées dans le `localStorage` du navigateur.

## 3. Comment tester

- Lancer le site : `cd web && python3 -m http.server 8766`, puis ouvrir http://localhost:8766.
- Piloter un vrai navigateur avec **Playwright** (déjà installé). Pour que WebGL fonctionne sans carte graphique, lancer Chromium avec `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`. L'objet carte est accessible dans la page via `window.escapadeMap`.
- Tester **au moins deux tailles** : ordinateur (1440 × 900) et téléphone (`devices['iPhone 13']`). Prendre des captures à chaque étape et **les regarder** avant de conclure.
- Pièges connus de l'environnement de test, à ne pas confondre avec des bugs du site :
  - Wikipédia et Wikimedia peuvent renvoyer des erreurs 429 (trop de requêtes) depuis le conteneur. Dans ce cas, relayer ces requêtes via `context.route` avec un en-tête `User-Agent` explicite.
  - Open-Meteo peut aussi renvoyer 429 : la météo et le climat manqueront alors.
  - Le rendu logiciel (swiftshader) est lent : laisser du temps au chargement des tuiles avant chaque capture.
- Pour chaque problème, préciser s'il a été **constaté** (capture, message de console, mesure) ou s'il est seulement **supposé** à la lecture du code.

## 4. Ce qu'il faut auditer

### A. Fonctionnement
- **Parcours complets** sur au moins 6 destinations variées : grande ville (Rome, Tokyo), village (Gordes), île (Santorin, Bali), nature isolée (Islande, Patagonie), pays peu touristique, point en pleine mer. Vérifier que la fiche, les photos, « À voir », le climat et l'itinéraire sont **justes et pertinents** : bon lieu, bonne description, étapes cohérentes, pas de lieu absurde.
- **Algorithme d'itinéraire** : faire varier la durée (2, 7, 21 jours), le budget (trop faible, confortable), le rythme, les envies, la boucle ou l'aller simple, le transport. Juger la logique des étapes, les temps de trajet, le réalisme du budget, la clarté des avertissements, et les cas sans solution (île, mer à traverser).
- **Survol** : enchaînement des étapes, pause et reprise, clavier, clic sur une photo, fin du survol, retour à l'itinéraire, pertinence des photos.
- **Robustesse** : service externe indisponible, réseau lent (limiter le débit avec Playwright), recherche sans résultat, double clic rapide, changement de lieu pendant un chargement, `localStorage` indisponible.
- **Erreurs JavaScript** dans la console, requêtes en échec, fuites (marqueurs ou couches non nettoyés, minuteries qui tournent encore).
- **Performance** : temps avant un globe utilisable, poids total téléchargé, nombre de requêtes à l'ouverture d'une fiche, fluidité, mémoire après 10 explorations.
- **Jour/nuit** : ombre placée au bon endroit et à la bonne heure (comparer avec la position réelle du soleil), transitions entre niveaux de zoom.

### B. Design
- Cohérence visuelle : couleurs, polices (Fraunces, Inter), tailles, espacements, rayons, icônes, effet verre.
- Lisibilité de la carte à chaque niveau de zoom : densité des noms, contraste jour et nuit, passage du satellite au plan, routes, bâtiments 3D.
- Hiérarchie dans la fiche et l'itinéraire : est-ce que l'œil va à l'essentiel ?
- États intermédiaires : chargement, vide, erreur, données partielles.
- Rendu sur téléphone : débordements, textes coupés, éléments qui se chevauchent, zones tactiles trop petites.
- Qualité perçue : qu'est-ce qui fait « amateur » ? Qu'est-ce qui ferait « produit premium » ?

### C. Expérience utilisateur
- **Première visite** : comprend-on en 10 secondes à quoi sert le site et quoi faire ?
- **Découvrabilité** : contrôles de la carte, onglets, cœur, itinéraire, survol, raccourcis clavier.
- **Friction** : nombre de clics pour obtenir un itinéraire, valeurs par défaut du formulaire, retours en arrière, perte de contexte.
- **Confiance** : sources citées, estimations présentées comme telles, messages d'erreur compréhensibles.
- **Accessibilité** : navigation au clavier, focus visible, contrastes (WCAG AA), libellés pour les lecteurs d'écran, `prefers-reduced-motion`.
- **Aide à la décision** : le site aide-t-il vraiment à **choisir** entre plusieurs destinations (comparaison, filtres, inspiration) ?
- **Préparation au site public** : mentions légales et crédits des sources, respect des conditions d'utilisation des services gratuits (limites de requêtes, identification), SEO, partage d'un lieu ou d'un itinéraire par lien.

## 5. Livrable attendu

Écris le rapport dans `docs/audit-escapade.md`, avec cette structure :

1. **Résumé en 10 lignes** : état général, 3 forces, 3 problèmes les plus graves.
2. **Tableau des constats**, une ligne par problème : identifiant, axe (Fonctionnement, Design ou UX), écran concerné, description, preuve (capture dans `docs/audit/` ou message de console), gravité (Bloquant, Majeur, Mineur ou Cosmétique), constaté ou supposé.
3. **Propositions d'amélioration**, classées par rapport **impact / effort** :
   - **Gains rapides** (moins d'une demi-journée) ;
   - **Chantiers moyens** ;
   - **Grands chantiers** (nouvelles fonctionnalités, changement de source de données, hébergement, compte utilisateur…).

   Pour chacune : le problème résolu, la solution concrète (fichiers concernés, approche), l'effort estimé et les risques.
4. **Idées nouvelles** qui rendraient le site nettement meilleur pour choisir des vacances. Maximum 8, justifiées.
5. **Plan proposé** : les 10 premières actions dans l'ordre, regroupables en lots cohérents.

Règles :
- Sois **précis et vérifiable** : « le bouton X est caché par Y sur iPhone 13 (capture 04) » plutôt que « l'interface peut être améliorée ».
- **Ne propose rien de payant ou nécessitant une clé** sans le signaler clairement et sans proposer d'alternative gratuite.
- Ne modifie aucun fichier en dehors de `docs/`. Ne fais ni commit ni push sans qu'on te le demande.
- À la fin, donne dans ta réponse le résumé et les 5 actions prioritaires, puis demande lesquelles appliquer.
