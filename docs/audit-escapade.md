# Audit d'Escapade — fonctionnement, design, expérience utilisateur

*Audit réalisé le 18 novembre 2026, corrections appliquées le même jour (section 0) sur la branche `claude/dreamy-cray-8oqcvr`, en suivant [`docs/prompt-audit.md`](prompt-audit.md). Les captures sont dans [`docs/audit/`](audit/).*

**Méthode.**
- **Navigateur piloté (Playwright).** Sur ordinateur (1440 × 900) : 7 destinations recherchées, un clic en pleine mer, des clics rapides successifs, une recherche sans résultat, le formulaire, l'itinéraire, « Mes voyages ». La mémoire est mesurée après 8 tirages « Surprends-moi ». Viennent ensuite trois scénarios dégradés : réseau lent (3G), services externes coupés, stockage du navigateur indisponible. Sur téléphone (iPhone 13) : le parcours complet, la poignée du panneau, l'écran en paysage.
- **Algorithme d'itinéraire.** Testé seul sur 21 scénarios : 10 destinations, durées de 2 à 21 jours, budgets de 400 à 8 000 €, rythmes, envies, aller simple, 1 à 6 voyageurs.
- **Accessibilité.** Analyse automatique (axe-core) et parcours au clavier.
- **Code.** Relecture de `app.js`, `itinerary.js`, `tour.js`, `sun.js`, `style.css` et vérification des conditions d'utilisation des services.

**À savoir.** Les tests tournent dans un conteneur sans carte graphique (rendu logiciel lent), et Wikipédia comme Open-Meteo y limitent fortement les requêtes. Les temps mesurés sont donc pessimistes, et l'absence de météo sur certaines captures vient de ces limites, pas du site. Chaque constat est marqué **constaté** (vu dans un test, avec une capture ou une mesure) ou **supposé** (déduit de la lecture du code).

---

## 0. Corrections appliquées (18 novembre 2026)

Après l'audit, toutes les actions du plan ont été réalisées, sauf celles qui demandent un choix d'hébergement ou un service payant. Les vérifications ont été refaites : algorithme d'itinéraire sur les 21 scénarios, parcours dans le navigateur sur ordinateur et sur téléphone (portrait et paysage). Les captures « après » sont dans [`docs/audit/apres/`](audit/apres/).

| Constat | État | Ce qui a été fait | Vérifié |
|---|---|---|---|
| F1 Îles reliées en voiture | ✅ Corrigé | Nouveau masque terre/mer (`data/land.bin`, Natural Earth 1:10m, une terre par polygone, principaux ponts et tunnels comptés comme liaisons). Les étapes restent sur la même terre ; les îles voisines deviennent des **excursions « en bateau »** ; une île donne un séjour en étoile avec un message clair. | Santorin : Fira avec excursions (Akrotiri, Thirassía…). Ubud : Ubud › Singaraja › Negara, tout sur Bali |
| F2 Étapes à l'étranger | ✅ Corrigé | Étapes et visites limitées au pays de la destination. | N'Djamena : Mao, Bol (Tchad) |
| F3 Homonymes dans la recherche | ✅ Corrigé | Classement par type de lieu, taille de l'emprise et nom exact. | « N'Djamena » ouvre la capitale |
| F4 Zoom inadapté | ✅ Corrigé | Cadrage sur l'emprise fournie par la recherche. | Santorin entière à l'écran (`apres/santorin.png`) |
| F5 Noms administratifs | ✅ Corrigé | Kabupaten, District, Municipality… exclus des étapes, des visites et de « À voir » ; départ depuis le lieu qui porte le nom choisi. | Ubud démarre à Ubud |
| F6 Envies peu prises en compte | ✅ Corrigé | Les envies pèsent sur le choix des villes (lieux correspondants à moins de 30 km). | Rome + plage : Monte Argentario ; Gordes + nature : La Grave (Écrins) |
| F7 Trajets trop longs | 🟡 Amélioré | Vérification après la mise en ordre : un trajet de plus d'une très longue journée fait retirer l'étape la moins intéressante. Les trajets de 400 à 460 km restent possibles sur les très longs séjours. | 21 scénarios |
| F8 Étapes banales | 🟡 Amélioré | Seuil de notoriété adaptatif (40 → 25 → 15 → 10 selon le choix disponible). Quelques excursions moyennes subsistent (New York → Trenton). | 21 scénarios |
| F9 Transport | ✅ Corrigé | Les pays à trains rapides (Japon, France, Espagne…) gardent le train même sur de longs trajets ; le trajet depuis la ville de départ passe à l'avion ou au ferry s'il faut traverser la mer. | Tokyo : en train |
| F10 Messages de budget | ✅ Corrigé | « Compte environ X € » ; quand le trajet aller-retour pèse lourd, il est chiffré. | 21 scénarios |
| F11 Climat tropical | ✅ Corrigé | Indice de confort (température + jours de **forte** pluie ≥ 5 mm) ; quand aucun mois n'est confortable (Islande, Sahara), les meilleurs mois du lieu restent « corrects ». | Rome : idéal de mai à octobre ; Paris : mai à août |
| F12 Mois du voyage | ✅ Corrigé | L'alerte de saison de l'itinéraire charge le climat si la fiche ne l'a pas encore fait. | Code |
| F13 Requête climat lourde | ✅ Corrigé | 3 ans au lieu de 5, mise en cache par case de 0,5°. | Code |
| F14 Fausses photos | ✅ Corrigé | Filtre des cartes, drapeaux, blasons, vues satellite (ASTER, MODIS, ISS…), schémas, dans la fiche et le survol. | Santorin : fresque d'Akrotiri au lieu d'une vue satellite |
| F15 Descriptions | 🟡 Amélioré | Prononciations et écritures non latines retirées. Les articles pauvres restent pauvres (Ubud), faute de meilleure source gratuite. | Ubud, Santorin |
| F16 Région en anglais | ✅ Corrigé | Traduction par la base de lieux (« Lisbon » → « Lisbonne »). | Code |
| F17 Mode téléphone figé | ✅ Corrigé | Taille d'écran relue à chaque usage ; règles dédiées au paysage (fiche sur le côté). | `apres/mobile-paysage.png` |
| F18 Conditions et crédits | 🟡 Amélioré | Crédits complets (GeoNames, Wikidata, Photon, OSRM, Open-Meteo, Wikimedia), en-tête `Api-User-Agent`, trajets OSRM mis en cache. **Reste à faire à la mise en ligne** : remplacer le serveur de démonstration OSRM par un service autorisé (le sien, ou openrouteservice avec une clé gratuite). | Code |
| F19 Stockage indisponible | ✅ Corrigé | Message au démarrage si le navigateur bloque le stockage. | Code |
| F20 Liens, icône, aperçu | ✅ Corrigé | Liens `#lieu=` et `#voyage=`, bouton **Partager** (fiche et itinéraire), bouton « précédent » du navigateur, icône d'onglet, balises de partage, titre H1. | Lien direct vers Paris, retour arrière, copie du lien |
| D1 / D2 Nuit trop sombre | ✅ Corrigé | Ombre adoucie en zoomant (100 % vue de l'espace → 45 % en ville), lumières visibles jusqu'au zoom 10,6, noms clairs pendant le déplacement. | `apres/santorin.png`, `apres/ubud-nuit.png` |
| D3 Zones vides | ⏸ Non traité | Dépend des données OpenStreetMap ; un fond sombre remplace le beige pendant le chargement. | — |
| D4 Faits rapides coupés | ✅ Corrigé | Grille sur plusieurs lignes. | `apres/ubud-nuit.png` |
| D5 Itinéraire sur téléphone | ✅ Corrigé | Fiche à moitié repliée, tracé visible, chiffres clés sur une ligne, bouton **Survoler** libellé. | `apres/mobile-itineraire.png` |
| D6 Paysage | ✅ Corrigé | Aucun chevauchement mesuré. | Test automatique |
| D7 Zones tactiles | ✅ Corrigé | 44 px. | Code |
| D8 Icône | ✅ Corrigé | `favicon.svg`. | Code |
| U1 Aide au choix | ⏸ Non traité | Grand chantier : voir l'idée « Où partir en… ? » (section 5). | — |
| U2 Fonctions cachées | 🟡 Amélioré | Bouton « Survoler » libellé, raccourci « / » documenté par l'icône du champ. | — |
| U3 Formulaire | ⏸ Non traité | Les valeurs par défaut restent celles du dernier itinéraire. | — |
| U4 Retour arrière | ✅ Corrigé | Historique du navigateur (voir F20). | Test automatique |
| U5 Accessibilité | ✅ Corrigé | Focus visible partout, zones repérables (`main`, `nav`, `aside`), focus déplacé dans la fiche après une recherche, focus retenu dans « Mes voyages », animations de caméra coupées si l'utilisateur a demandé moins de mouvements. | Test au clavier |
| U6 Aucun résultat | ✅ Corrigé | Message avec suggestions. | `apres/aucun-resultat.png` |
| U7 Chargement lent | ✅ Corrigé | Le globe s'affiche dès que la carte est prête, sans attendre toutes les images. | Code |

**Encore ouvert** : les grands chantiers (« Où partir en… ? », comparateur, compte et synchronisation), le remplacement du serveur OSRM de démonstration au moment de la mise en ligne, et la qualité des descriptions là où Wikipédia est pauvre.

---

## 1. Résumé

Escapade est déjà **une belle démonstration** : un globe réaliste avec le jour et la nuit en temps réel, une fiche riche construite uniquement à partir de sources libres, un générateur d'itinéraire avec budget, et un survol animé avec photos. L'interface « verre » est cohérente et soignée, sur ordinateur comme sur téléphone.

**Forces**
1. Une expérience de découverte immersive et originale : le globe, la nuit en direct, la transition fluide du satellite vers le plan 3D.
2. Une fiche lieu complète et bien hiérarchisée (faits rapides, onglets, calendrier « Quand partir ») qui cite ses sources.
3. Une chaîne de bout en bout rare pour un site gratuit : de l'idée à un itinéraire chiffré, puis à son survol.

**Problèmes les plus graves**
1. **L'itinéraire peut proposer des parcours impossibles ou risqués.** Il enchaîne des îles en voiture (Santorin → Athènes → Héraklion), traverse la mer à Bali et passe la frontière vers des zones déconseillées (N'Djamena → Maiduguri, au Nigeria). C'est la fonction phare, et c'est là que la confiance se joue.
2. **La recherche et le cadrage trompent l'utilisateur.** « N'Djamena » ouvre un village homonyme au lieu de la capitale. Une île ou une région s'ouvre au niveau de la rue, dans un champ.
3. **La nuit réaliste gêne l'exploration.** De nuit, une région entière devient presque noire et les noms de rues sont illisibles. Pour quelqu'un qui cherche une destination, la moitié du globe est donc peu exploitable à tout moment.

S'y ajoutent des manques pour un futur site public : **aucun lien partageable**, pas d'icône d'onglet ni d'aperçu de partage, des crédits de sources incomplets, et un service de calcul de routes utilisé hors de ses conditions.

---

## 2. Mesures clés

| Mesure | Valeur | Commentaire |
|---|---|---|
| Premier chargement : poids / requêtes | **3,2 Mo / 94 requêtes** | 72 requêtes rien que pour l'image satellite et les lumières de nuit |
| Temps avant globe utilisable | 18 s (rendu logiciel) | Pessimiste : sur une vraie machine, probablement 2 à 4 s, à mesurer après mise en ligne |
| Ouverture d'une fiche | **80 à 150 requêtes, 0,3 à 5,8 Mo** | Surtout des tuiles de carte et des photos ; Santorin est la plus lourde (150 requêtes, 5,8 Mo) |
| Délai avant que la fiche soit utilisable | 2 à 4 s (Santorin : 10 s) | Rendu logiciel : pessimiste |
| Mémoire après 8 « Surprends-moi » | 71 → 94 Mo, 1 seul marqueur, 109 couches stables | Pas de fuite constatée |
| Base de lieux | 57 Mo sur le serveur, ~0,4 Mo compressé par zone chargée | Chargement à la demande : bon choix |
| Icône d'onglet / aperçu de partage / titre H1 | **absents** (0 / 0 / 0) | Constaté |
| Accessibilité (axe, accueil) | 1 type d'anomalie : contenu hors des zones repérables par les lecteurs d'écran | Voir aussi le focus clavier |
| Focus clavier | **invisible** sur la carte et la barre de recherche | Constaté au parcours avec Tab |

### Scénarios testés dans le navigateur

| Scénario | Résultat | Verdict |
|---|---|---|
| Rome, Tokyo, Gordes, El Chaltén | Bon lieu, bonne description, photos et lieux à voir pertinents (Colisée, palais impérial, Fitz Roy…) | ✅ |
| Santorin | Bon texte, mais zoom au niveau de la rue et carte satellite en photo principale (F4, F14) | ⚠️ |
| Ubud (Bali) | Description administrative ; « Kabupaten de Gianyar » proposé dans « À voir » (F5, F15) | ⚠️ |
| N'Djamena | **Mauvais lieu** : village du Kanem au lieu de la capitale ; photos noires ; 1 seul lieu à voir (F3, F14) | ❌ |
| Clic en pleine mer (Atlantique) | Redirection vers São Miguel (Açores, à 276 km), avec un message clair | ✅ |
| 4 clics rapides successifs | Seul le dernier lieu s'affiche, un seul marqueur : pas de mélange | ✅ |
| Recherche sans résultat (« xqzwvvbn ») | La liste se ferme sans rien dire : **aucun message « aucun résultat »** | ⚠️ (U6) |
| Climat dans les fiches | Absent pour 4 destinations sur 7 (Open-Meteo saturé depuis le conteneur, voir F13) | ⚠️ |
| Échap ferme « Mes voyages » | Oui | ✅ |
| Réseau lent (3G simulée) | Globe affiché après **45 s**, sans indication de progression au-delà de l'animation | ⚠️ (U7) |
| Services externes coupés (recherche, Wikipédia, météo, routes) | La recherche se rabat sur la base locale (avec « Lyon Park, Erevan » en 2ᵉ proposition) ; fiche minimale sans photo ni texte ; itinéraire Lyon → Grenoble → Genève calculé avec des temps estimés et un avertissement | ✅ (dégradé mais utilisable) |
| Stockage du navigateur indisponible | Le site fonctionne, aucune erreur ; les favoris ne sont simplement pas gardés, sans prévenir (F19) | ⚠️ |
| Accessibilité automatique (axe) de la fiche et du formulaire | Aucune anomalie | ✅ |
| Téléphone : poignée du panneau, survol, Mes voyages | Fonctionnent | ✅ |
| Téléphone en paysage | Chevauchements (D6) | ⚠️ |
| Erreurs JavaScript | Aucune erreur de code ; seulement des requêtes refusées (Open-Meteo, Wikipédia : limites du conteneur), une icône de bouclier routier américain manquante et un 404 (pas d'icône d'onglet) | ✅ |

---

## 3. Constats

Gravité : 🔴 Bloquant · 🟠 Majeur · 🟡 Mineur · ⚪ Cosmétique.

### Fonctionnement

| # | Écran | Constat | Preuve | Gravité | Statut |
|---|---|---|---|---|---|
| F1 | Itinéraire | **Étapes sur d'autres îles reliées en voiture** : Santorin → Athènes (299 km) → Héraklion (418 km) en voiture. Ubud → Mataram (île de Lombok) → Malang (île de Java). Aucune notion de mer à traverser. | Test de l'algorithme, scénarios Santorin et Bali | 🔴 | Constaté |
| F2 | Itinéraire | **Étapes dans un pays voisin**, y compris des zones déconseillées : N'Djamena (Tchad) → Maiduguri (Nigeria) → Maroua (Cameroun). Le changement de pays n'est qu'une petite pénalité dans la note. | Test de l'algorithme, scénario N'Djamena | 🔴 | Constaté |
| F3 | Recherche | **Homonymes mal classés** : le service de recherche (Photon) renvoie d'abord deux villages « N'Djamena ». La capitale n'arrive qu'en 4ᵉ position, et l'application prend la première. Même risque pour toutes les villes qui ont des homonymes. | `08-ndjamena.png`, réponse de Photon | 🟠 | Constaté |
| F4 | Recherche | **Zoom inadapté** : une île, une région, un parc ou un lac s'ouvre au zoom 14 (niveau de la rue). Santorin s'ouvre dans un champ. Photon fournit pourtant l'emprise de chaque lieu (`extent`), qui n'est pas utilisée. | `05-santorin.png`, `app.js` fonction `choose` | 🟠 | Constaté |
| F5 | Itinéraire | **Étape de départ mal nommée** : « Kabupaten de Klungkung » (une circonscription administrative) au lieu d'Ubud. | Test de l'algorithme, scénario Bali | 🟠 | Constaté |
| F6 | Itinéraire | **Les envies influencent peu les étapes** : Rome + « plage » donne les mêmes étapes que sans envie (Naples, L'Aquila, ville de montagne). Gordes + « nature » donne Monaco puis Marseille. Les envies jouent surtout sur les visites du jour, pas sur le choix des villes. | Test de l'algorithme | 🟠 | Constaté |
| F7 | Itinéraire | **Trajets trop longs et ordre peu naturel** : Rome 21 jours avec un trajet de 460 km (Venise → L'Aquila), une boucle Venise → L'Aquila → Naples → Rome, un aller simple Naples → Florence de 532 km. La distance maximale n'est vérifiée qu'au moment du choix des étapes, pas après leur mise en ordre. | Test de l'algorithme | 🟠 | Constaté |
| F8 | Itinéraire | **Étapes et excursions peu attractives** : Plainfield et Trenton depuis New York, Río Turbio et Gobernador Gregores en Patagonie, Massaguet au Tchad. Dans les régions où il y a peu de données touristiques, le classement retombe sur la simple population. | Test de l'algorithme | 🟡 | Constaté |
| F9 | Itinéraire | **Choix du transport discutable** : voiture proposée au Japon (dès qu'un trajet dépasse 350 km) et dans les îles grecques. Le choix ne tient compte ni des ferries ni des trains à grande vitesse. | Test de l'algorithme | 🟡 | Constaté |
| F10 | Itinéraire | **Messages de budget incohérents** : « Il faudrait réduire à 2 jours » pour Tokyo 10 jours ou pour un groupe de 6, alors que c'est le vol ou le nombre de voyageurs qui pèse. Un message plus utile proposerait une destination plus proche, moins de voyageurs ou un budget conseillé. | Test de l'algorithme | 🟡 | Constaté |
| F11 | Fiche | **« Quand partir » est faux sous les tropiques** : Bali est « correct toute l'année, pas de mois idéal », alors que la saison sèche (avril à octobre) est la bonne période. La règle actuelle (température maximale entre 22 et 31 °C, peu de jours de pluie) pénalise toute la zone tropicale. | `06-bali.png`, `app.js` fonction `climate` | 🟠 | Constaté |
| F12 | Fiche / itinéraire | « **Ce mois-ci** » utilise le mois en cours, pas celui du voyage prévu. L'alerte de mauvaise saison n'existe que si le climat a fini de charger dans la fiche. | `app.js` ligne 721, `itinerary.js` ligne 362 | 🟡 | Supposé |
| F13 | Fiche | **Requête climat lourde** : 5 années de données jour par jour (environ 1 800 lignes) pour chaque clic. Depuis le conteneur, aucune réponse en 12 s (ou erreur 429, trop de requêtes). C'est la donnée la plus souvent absente des fiches. | Mesure directe | 🟡 | Constaté |
| F14 | Fiche | **Photos peu pertinentes** : la photo principale de Santorin est une carte satellite, et celles de N'Djamena sont des images noires prises de nuit depuis l'espace. Rien ne filtre les cartes, plans, blasons ou images sombres. | `05-santorin.png`, `08-ndjamena.png` | 🟡 | Constaté |
| F15 | Fiche | **Description pauvre ou administrative** quand Wikivoyage manque (Ubud : « est une kelurahan (commune) »), avec des écritures non latines dans le texte. | `06-bali.png` | 🟡 | Constaté |
| F16 | Fiche | La région s'affiche parfois en anglais (« Portugal · **Lisbon** »). | `22-mobile-fiche-repliee.png` | ⚪ | Constaté |
| F17 | Global | Le mode téléphone est **figé au chargement** (`isMobile`) : tourner l'écran ou redimensionner la fenêtre ne recalcule pas la mise en page côté JavaScript. | `28-mobile-paysage.png`, `app.js` ligne 13 | 🟡 | Constaté |
| F18 | Conformité | **Services utilisés hors de leurs conditions ou sans crédit** : le serveur OSRM est une démo, interdite en production. Photon public est limité à un usage raisonnable. Wikimedia demande un en-tête `Api-User-Agent`. Les crédits ne citent ni GeoNames (licence CC BY qui impose la mention), ni Wikidata, ni Photon, ni Open-Meteo, ni OSRM. Open-Meteo gratuit est réservé à un usage non commercial. | Relecture du code | 🟠 | Constaté |
| F19 | Données | Favoris et itinéraires **uniquement dans le navigateur** : ils disparaissent si on vide le navigateur et ne passent pas d'un appareil à l'autre. Sans stockage disponible, rien n'est enregistré et rien ne le signale. | `app.js` objet `LS` | 🟡 | Constaté |
| F20 | Public | **Aucun lien partageable** (ni pour un lieu, ni pour un itinéraire), pas d'icône d'onglet, pas d'aperçu de partage, une seule page générée en JavaScript : invisible pour les moteurs de recherche. | Mesures de la section 2 | 🟠 | Constaté |

### Design

| # | Écran | Constat | Preuve | Gravité | Statut |
|---|---|---|---|---|---|
| D1 | Carte | **Nuit trop sombre pour explorer** : à l'échelle d'une région où il fait nuit, la carte est presque noire (Bali, Samara). Les lumières des villes disparaissent dès le zoom 8,6. On ne voit plus ni le relief ni les côtes. | `06-bali.png` | 🟠 | Constaté |
| D2 | Carte | **Plan illisible la nuit** : noms gris foncé sur fond sombre (Santorin). Le passage aux noms clairs n'a lieu qu'en fin de déplacement et au-delà du zoom 11. | `05-santorin.png` | 🟠 | Constaté |
| D3 | Carte | Grandes zones **vides et grises** dans les régions peu cartographiées (N'Djamena). Fond beige ou gris pendant le chargement des images. | `08-ndjamena.png` | 🟡 | Constaté |
| D4 | Fiche | La rangée des **faits rapides est coupée** à droite (« Indonésie… ») sans indice qu'elle défile. | `06-bali.png` | 🟡 | Constaté |
| D5 | Itinéraire (téléphone) | Le panneau couvre 78 % de l'écran : **le tracé du parcours n'est pas visible** sur la carte, et les 4 chiffres clés occupent tout l'espace. | `25-mobile-itineraire.png` | 🟡 | Constaté |
| D6 | Téléphone en paysage | **Chevauchements** : « Mes voyages » sur la barre de recherche, contrôles sur le logo, « Surprends-moi » sur la puce d'infos. | `28-mobile-paysage.png` | 🟡 | Constaté |
| D7 | Global | Zones tactiles un peu petites : contrôles de 42 px et bouton fermer de 40 px, pour 44 px recommandés. | Mesure automatique sur téléphone | ⚪ | Constaté |
| D8 | Global | Pas d'icône d'onglet ni d'icône d'application : le site n'a pas d'identité dans les onglets et les favoris. | Section 2 | ⚪ | Constaté |

### Expérience utilisateur

| # | Écran | Constat | Preuve | Gravité | Statut |
|---|---|---|---|---|---|
| U1 | Global | **Peu d'aide pour choisir** : on part d'un lieu qu'on connaît déjà. Rien pour répondre à « où partir en mars avec 1 500 € pour de la plage ? » (filtres, suggestions sur le globe, comparaison côte à côte). | Parcours complet | 🟠 | Constaté |
| U2 | Global | **Fonctions cachées** : le survol (icône ▶ sans texte), le relief, la vue 3D et les raccourcis (« / », R, Espace) ne s'expliquent nulle part. L'astuce de départ ne s'affiche qu'une fois. | Captures 11 et 25 | 🟡 | Constaté |
| U3 | Formulaire | Valeurs par défaut arbitraires (départ de Paris, mois suivant, 2 000 €), pas de dates précises, et aucun repère pour savoir si un budget est réaliste avant de valider. | `10-formulaire.png` | 🟡 | Constaté |
| U4 | Navigation | **Pas de retour arrière** : ouvrir un lieu proche depuis une fiche remplace la fiche sans possibilité de revenir. Le bouton « précédent » du navigateur quitte le site. | Parcours | 🟡 | Constaté |
| U5 | Accessibilité | Focus clavier invisible sur la carte et la recherche. L'ouverture d'un panneau ne déplace pas le focus. La fenêtre « Mes voyages » ne retient pas le focus. Les vols de caméra ignorent la préférence « réduire les animations ». | Parcours au clavier, analyse axe | 🟡 | Constaté |
| U6 | Recherche | **Aucun message quand une recherche ne trouve rien** : la liste disparaît simplement. | Scénario « xqzwvvbn » | 🟡 | Constaté |
| U7 | Chargement | Sur réseau lent, **45 s avant le globe** sans progression visible ; le chargement attend toutes les données avant d'afficher quoi que ce soit. | `13-reseau-lent.png` | 🟡 | Constaté |

---

## 4. Propositions d'amélioration

### Gains rapides (moins d'une demi-journée chacun)

| Proposition | Résout | Comment | Effort | Risque |
|---|---|---|---|---|
| **Classer les résultats de recherche par importance** | F3 | Reclasser les suggestions de Photon : capitales et grandes villes d'abord, en s'appuyant sur la notoriété de notre base de lieux ou sur le type (`city` avant `village`). Écarter les doublons du même pays. | 1 h | Faible |
| **Cadrer sur l'emprise du lieu** | F4 | Dans `choose()`, si Photon fournit `extent`, ajuster la vue sur ces limites (`fitBounds`) au lieu d'un zoom fixe. | 1 h | Faible |
| **Interdire l'étranger et la mer dans l'itinéraire** | F1, F2 | Ne garder que les étapes du même pays que la destination. Refuser les étapes sur une autre île (même île vérifiée via le calcul de route : pas de route = pas d'étape). En dernier recours, proposer un séjour « en étoile » autour d'une seule base. | 2 h | Moyen (moins d'étapes dans certains pays) |
| **Écarter les noms administratifs** | F5 | Exclure de la base les lieux dont le nom commence par Kabupaten, Kecamatan, District, Municipality, etc. Partir alors de la ville la plus proche du lieu choisi. | 30 min | Faible |
| **Nuit « confortable » pour explorer** | D1, D2 | Plafonner l'ombre à environ 55 % au-delà du zoom 6, et 35 % en mode plan. Garder les lumières jusqu'au zoom 10. Basculer les noms clairs/sombres pendant le déplacement et selon l'opacité réelle de l'ombre. | 2 h | Faible |
| **Filtrer les photos** | F14 | Exclure les fichiers dont le nom contient map, carte, karte, locator, flag, coat of arms, satellite, ISS, ainsi que les images très sombres (luminosité moyenne mesurée sur une miniature). | 1 h | Faible |
| **Crédits complets et `Api-User-Agent`** | F18 | Ajouter GeoNames, Wikidata, Photon, OSRM, Open-Meteo et Wikimedia dans les crédits de la carte (et dans une page « À propos »). Envoyer l'en-tête `Api-User-Agent` à Wikimedia. | 30 min | Nul |
| **Icône d'onglet, aperçu de partage, titre** | D8, F20 | `favicon.svg` (le soleil du logo), balises `og:` et `twitter:`, un titre de niveau 1 caché visuellement. | 30 min | Nul |
| **Focus visible et zones repérables** | U5, D7 | Style `:focus-visible` (anneau orange) sur tous les éléments interactifs, balises `main`, `nav` et `aside`, contrôles portés à 44 px. Déplacer le focus dans le panneau à son ouverture et le retenir dans « Mes voyages ». | 1 h 30 | Faible |
| **Messages de budget utiles** | F10 | Si le vol dépasse 40 % du budget, proposer une destination plus proche. Sinon, afficher le budget conseillé (« Compte environ 3 100 € »), plutôt qu'un nombre de jours absurde. | 1 h | Faible |
| **Message « aucun résultat » et chargement progressif** | U6, U7 | Afficher « Aucun lieu trouvé » avec une suggestion ; montrer le globe dès que le style est prêt, sans attendre la base de lieux, avec une barre de progression réelle. | 1 h | Nul |
| **Faits rapides lisibles** | D4 | Passer sur deux lignes (grille) au lieu d'un défilement horizontal caché. | 20 min | Nul |
| **Mise en page qui suit l'écran** | F17, D6 | Remplacer la constante `isMobile` par une lecture à chaque besoin (`matchMedia` avec écoute du changement). Ajouter une règle pour les écrans peu hauts (`max-height: 500px`). | 1 h | Faible |

### Chantiers moyens (1 à 3 jours)

| Proposition | Résout | Comment | Effort |
|---|---|---|---|
| **Liens partageables** | F20, U4 | Une adresse par vue : `#lieu=43.61,3.88,Montpellier` ou `#voyage=` suivi de l'itinéraire compressé. Gérer le bouton précédent du navigateur et ajouter un bouton « Copier le lien ». | 1 j |
| **Itinéraire v2 : envies, ordre, transport** | F6, F7, F8, F9 | Envies pondérées dans le choix **des villes** (proximité de plages, montagnes, parcs). Ordre par tournée optimisée, puis vérification de la distance maximale **après** la mise en ordre. Transport choisi selon le pays (liste des pays à bons réseaux de train, îles = ferry). Seuil de notoriété adaptatif pour éviter les villes banales. | 2 à 3 j |
| **« Quand partir » fiable** | F11, F12, F13 | Utiliser les normales mensuelles (une seule requête légère, ou une table précalculée par case de 1° pour tout le globe) et des règles par type de climat (tropical : saison sèche ; montagne ; désert). Mettre le résultat en cache. Afficher le mois du voyage prévu. | 1,5 j |
| **Itinéraire sur téléphone** | D5 | Panneau à moitié replié par défaut, tracé visible, chiffres clés sur une seule ligne compacte, bouton « Survoler » mis en avant. | 0,5 j |
| **Descriptions plus riches** | F15, F16 | Ordre des sources : Wikivoyage, puis Wikipédia, puis description Wikidata. Retirer les écritures non latines entre parenthèses. Traduire la région grâce à notre base. | 0,5 j |
| **Aide à la découverte** | U2, U3 | Visite guidée en 3 bulles au premier lancement, libellé « Survoler » visible, aide des raccourcis (« ? »), départ par défaut déduit du fuseau ou de la dernière recherche. | 1 j |

### Grands chantiers

| Proposition | Résout | Comment | Effort | Coût |
|---|---|---|---|---|
| **Mise en ligne propre** | F18, F20 | Héberger sur Vercel ou GitHub Pages. Héberger son propre serveur de routes (ou utiliser un service gratuit avec clé, comme openrouteservice) et son propre géocodage si le trafic augmente. Compression des fichiers et cache longue durée. | 2 à 3 j | Gratuit au départ |
| **Compte et synchronisation** | F19 | Connexion facultative, favoris et itinéraires dans une base de données (Supabase, déjà connecté à ce compte). | 2 j | Offre gratuite |
| **« Où partir ? » (recherche inversée)** | U1 | Voir les idées ci-dessous : c'est la fonctionnalité qui transformerait le site en vrai outil de choix. | 3 à 5 j | Gratuit |

---

## 5. Idées nouvelles

1. **« Où partir en… ? »** : on choisit un mois, un budget et des envies, et **le globe s'allume** sur les destinations idéales (pastilles colorées selon la météo du mois et le coût). C'est le cœur de « choisir une destination » ; les données (climat précalculé, niveau des prix, notoriété) existent presque déjà.
2. **Comparateur côte à côte** de 2 ou 3 destinations : météo du mois, budget estimé, durée du vol, photos, points forts.
3. **Carnet de voyage exportable** : l'itinéraire jour par jour en PDF ou ajouté à l'agenda (fichier `.ics`), avec liens vers les réservations.
4. **Ferries et trains réels** : relier les îles (Grèce, Indonésie, Croatie) grâce aux lignes de ferry d'OpenStreetMap, et afficher les trains à grande vitesse en Europe et en Asie.
5. **Prévisions météo** quand le départ est dans moins de 14 jours (Open-Meteo), à la place des moyennes.
6. **Fiche pays** : sécurité, visa, santé, prises électriques, conduite. Lien vers France Diplomatie, plus une fiche synthétique précalculée.
7. **Mode « journée type »** : pour une étape, une proposition matin / après-midi / soir à partir des lieux à voir et des distances à pied.
8. **Résumé rédigé par une IA** (facultatif, **payant** : nécessite une clé d'API, par exemple Claude). Il produirait une description et des conseils personnalisés. L'alternative gratuite est d'améliorer la chaîne Wikivoyage → Wikipédia → Wikidata.

---

## 6. Plan proposé — les 10 premières actions

| Ordre | Action | Constats | Lot |
|---|---|---|---|
| 1 | Interdire l'étranger et la mer dans l'itinéraire | F1, F2 | **A — Fiabilité de l'itinéraire** |
| 2 | Écarter les noms administratifs | F5 | A |
| 3 | Messages de budget utiles | F10 | A |
| 4 | Classer les résultats de recherche et cadrer sur l'emprise | F3, F4 | **B — Recherche** |
| 5 | Nuit confortable et noms lisibles la nuit | D1, D2 | **C — Lisibilité** |
| 6 | Filtrer les photos et enrichir les descriptions | F14, F15, F16 | C |
| 7 | Crédits complets, icône, aperçu de partage, focus visible | F18, D8, U5 | **D — Prêt pour le public** |
| 8 | Liens partageables et bouton précédent | F20, U4 | D |
| 9 | « Quand partir » fiable | F11, F12, F13 | **E — Qualité des infos** |
| 10 | Itinéraire v2 (envies, ordre, transport) | F6 à F9 | E |

Les lots A, B et C peuvent être faits en une journée environ et corrigent l'essentiel de ce qui fait perdre confiance. Le lot D prépare la mise en ligne. Le lot E améliore en profondeur la qualité des conseils.
