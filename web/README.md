# Escapade — version web

Globe 3D pour choisir une destination de vacances : on part de l'espace et on zoome jusqu'aux rues, avec les bâtiments en 3D.
Le bouton « Itinéraire » d'une fiche propose un parcours autour de la destination selon la durée, le budget
(vol compris), le nombre de voyageurs, le mois, la ville de départ, le transport, le type de parcours, le rythme et les envies.

Le jour et la nuit s'affichent en temps réel, avec les lumières des villes côté nuit.
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
| Lumières des villes la nuit | NASA Black Marble (VIIRS), via [NASA GIBS](https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api) |
| Globe cartoon des zooms éloignés | tuiles générées par `tools/build_data.py` (NASA Blue Marble, Natural Earth) |
| Relief | [Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) (AWS Open Data) |
| Nom du lieu cliqué, recherche | [Photon](https://photon.komoot.io/) (OpenStreetMap) |
| Description | Wikivoyage et Wikipédia (français) |
| Photos et lieux à voir | Wikipédia (classés par popularité) et Wikimedia Commons |
| Climat par mois, météo du moment | [Open-Meteo](https://open-meteo.com/) |
| Terres et mers (itinéraires) | [Natural Earth](https://www.naturalearthdata.com/) 1:10m, domaine public |
| Temps de route des itinéraires | [OSRM](https://project-osrm.org/) (OpenStreetMap) |
| Niveau des prix par pays (budget) | Banque mondiale, PPA / taux de change (CC BY 4.0) — `tools/build_prices.py` |
| Monnaie, langue, capitale | paquet npm `world-countries` |
| Base de lieux (770 000 villes, villages et sites) | [GeoNames](https://www.geonames.org/) (CC BY 4.0), notoriété et articles français via [Wikidata](https://www.wikidata.org/) |

## Fichiers

- `index.html`, `style.css`, `app.js` : l'application (interface « verre » translucide au-dessus du globe)
- `icons.js` : icônes au trait de l'interface
- `tour.js` : survol animé d'un itinéraire, avec une bande de photos de chaque étape
- `itinerary.js` : générateur d'itinéraire (étapes, ordre, programme jour par jour, budget)
- `land.js` : masque terre/mer (une terre par île ou continent) pour que les itinéraires ne traversent pas la mer en voiture
- `sun.js` : position du soleil en temps réel, ombre de la nuit et lumières des villes
- `data/` : base de lieux (villes, villages, sites — GeoNames + Wikidata) et infos pays
- `tiles/cartoon/` : globe cartoon en tuiles (zooms 0 à 4)
- `tools/build_data.py` : régénère `data/countries.json` et `tiles/`
- `tools/build_landmask.py` : régénère `data/land.bin` à partir de Natural Earth 1:10m
- `tools/build_glyphs.mjs` : polices de la carte (Inter, Fraunces)
- `tools/build_prices.py` : niveaux de prix par pays
- `tools/build_places.py` : régénère la base de lieux `data/places/`, `data/top.json`
