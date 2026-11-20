# Escapade — version web

Globe 3D pour choisir une destination de vacances : on part de l'espace et on zoome jusqu'aux rues, avec les bâtiments en 3D.
Le bouton **« Où partir ? »** propose les meilleures destinations pour un mois, un budget, une durée et des envies : le globe s'allume sur les lieux idéaux.

Le bouton « Itinéraire » d'une fiche propose un parcours autour de la destination selon la durée, le budget
(vol compris), le nombre de voyageurs, le mois, la ville de départ, le transport, le type de parcours, le rythme et les envies.

Le globe est toujours affiché en plein jour.
Un clic n'importe où ouvre une fiche avec une description, les photos, les lieux à voir, la météo par mois et les infos pratiques.

Site statique (HTML, CSS et JavaScript, sans build) : il suffit de servir ce dossier.

```bash
cd web && python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Sources (toutes gratuites, sans clé)

| Quoi | Source |
|---|---|
| Moteur de carte et globe | [MapLibre GL JS](https://maplibre.org/) |
| Carte détaillée (rues, bâtiments, noms) | [OpenFreeMap](https://openfreemap.org/) — données © OpenStreetMap |
| Vue satellite (style réaliste, par défaut) | [Sentinel-2 cloudless 2016](https://s2maps.eu) par EOX (CC BY 4.0) |
| Globe cartoon des zooms éloignés | tuiles générées par `tools/build_data.py` (NASA Blue Marble, Natural Earth) |
| Relief | [Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) (AWS Open Data) |
| Nom du lieu cliqué, recherche | [Photon](https://photon.komoot.io/) (OpenStreetMap) |
| Description | Wikivoyage et Wikipédia (français) |
| Photos et lieux à voir | Wikipédia (classés par popularité) et Wikimedia Commons |
| Climat par mois, météo du moment | [Open-Meteo](https://open-meteo.com/) |
| Carnet d'étape : où dormir, à voir, manger | [Wikivoyage](https://fr.wikivoyage.org/) (CC BY-SA), hébergements [OpenStreetMap](https://www.openstreetmap.org/copyright) via Overpass (ODbL) |
| Infos pratiques par pays | Wikidata (prises, tension, urgences, conduite), [Conseils aux voyageurs](https://www.diplomatie.gouv.fr/), [The Man in Seat 61](https://www.seat61.com/) — `tools/build_country_extra.py` |
| Climat mois par mois (« Où partir ? ») | [WorldClim 2.1](https://www.worldclim.org/), normales 1970-2000 (CC BY 4.0) |
| Terres et mers (itinéraires) | [Natural Earth](https://www.naturalearthdata.com/) 1:10m, domaine public |
| Trains, cars et bus (horaires réels, tracés) | [Transitous](https://transitous.org/sources/) — service bénévole : réservé aux projets libres et non commerciaux, usage léger |
| Aéroports | [OurAirports](https://ourairports.com/data/) (domaine public) |
| Liaisons aériennes directes et compagnies | [OpenFlights](https://openflights.org/data) (ODbL) — données de 2014, à vérifier |
| Temps de route des itinéraires | [OSRM](https://project-osrm.org/) (OpenStreetMap) |
| Niveau des prix par pays (budget) | Banque mondiale, PPA / taux de change (CC BY 4.0) — `tools/build_prices.py` |
| Monnaie, langue, capitale | paquet npm `world-countries` |
| Base de lieux (770 000 villes, villages et sites) | [GeoNames](https://www.geonames.org/) (CC BY 4.0), notoriété et articles français via [Wikidata](https://www.wikidata.org/) |

## Fichiers

- `index.html`, `style.css`, `app.js` : l'application (interface « verre » translucide au-dessus du globe)
- `icons.js` : icônes au trait de l'interface
- `transit.js` : vrais trajets en train, car et bus (Transitous) et en avion (aéroports et liaisons directes)
- `discover.js` : « Où partir ? » — note de chaque destination selon le mois, les envies et le budget, et globe allumé
- `tour.js` : survol animé d'un itinéraire, avec une bande de photos de chaque étape
- `itinerary.js` : générateur d'itinéraire (étapes, ordre, programme jour par jour, budget)
- `stage.js` : carnet d'étape — trains (ligne, compagnie, horaires types, lien de réservation), vols, où dormir (adresses Wikivoyage selon le budget, hébergements OpenStreetMap, recherches Booking et Airbnb aux bonnes dates), à voir et où manger, infos pratiques
- `cost.js` : estimation du coût d'un voyage, la même pour « Où partir ? » et l'itinéraire
- `profile.js` : profil voyageur enregistré dans le navigateur
- `land.js` : masque terre/mer (une terre par île ou continent) pour que les itinéraires ne traversent pas la mer en voiture
- `sun.js` : service des tuiles de fond (satellite et cartoon) ; garde aussi le calcul du soleil, inutilisé
- `data/` : base de lieux (villes, villages, sites — GeoNames + Wikidata) et infos pays
- `tiles/cartoon/` : globe cartoon en tuiles (zooms 0 à 4)
- `tools/build_data.py` : régénère `data/countries.json` et `tiles/`
- `tools/build_flights.py` : régénère `data/flights.json` (aéroports OurAirports, liaisons OpenFlights)
- `tools/build_destinations.py` : régénère `data/destinations.json` (≈ 5 200 destinations, climat mois par mois)
- `tools/build_landmask.py` : régénère `data/land.bin` à partir de Natural Earth 1:10m
- `tools/build_glyphs.mjs` : polices de la carte (Inter, Fraunces)
- `tools/build_prices.py` : niveaux de prix par pays
- `tools/build_places.py` : régénère la base de lieux `data/places/`, `data/top.json`

## Banc d'essai de l'algorithme d'itinéraire

```bash
node web/tools/bench/bench.mjs            # ≈ 1 200 itinéraires (≈ 12 min)
node web/tools/bench/bench.mjs --ref      # seulement les 16 itinéraires de référence (quelques secondes)
node web/tools/bench/bench.mjs --save nom # enregistre docs/bench/nom.json pour comparer deux versions
```

Chaque itinéraire est contrôlé par des règles qui ne doivent jamais être enfreintes (nuits, doublons, étranger, mer
traversée, trajets de plus de 6 h 30, visites lointaines, noms administratifs, budget) et reçoit une note de qualité.
Les itinéraires de référence (Toscane, Andalousie, Japon, Écosse…) mesurent la part des étapes classiques retrouvées.
