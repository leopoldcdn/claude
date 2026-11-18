# Escapade — version web

Globe 3D pour choisir une destination de vacances : on part de l'espace et on zoome jusqu'aux rues, avec les bâtiments en 3D.
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
| Globe cartoon des zooms éloignés | tuiles générées par `tools/build_data.py` (NASA Blue Marble, Natural Earth) |
| Relief | [Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) (AWS Open Data) |
| Nom du lieu cliqué, recherche | [Photon](https://photon.komoot.io/) (OpenStreetMap) |
| Description | Wikivoyage et Wikipédia (français) |
| Photos et lieux à voir | Wikipédia (classés par popularité) et Wikimedia Commons |
| Climat par mois, météo du moment | [Open-Meteo](https://open-meteo.com/) |
| Monnaie, langue, capitale | paquet npm `world-countries` |
| Base de lieux (770 000 villes, villages et sites) | [GeoNames](https://www.geonames.org/) (CC BY 4.0), notoriété et articles français via [Wikidata](https://www.wikidata.org/) |

## Fichiers

- `index.html`, `style.css`, `app.js` : l'application
- `data/` : base de lieux (villes, villages, sites — GeoNames + Wikidata) et infos pays
- `tiles/cartoon/` : globe cartoon en tuiles (zooms 0 à 4)
- `tools/build_data.py` : régénère `data/countries.json` et `tiles/`
- `tools/build_places.py` : régénère la base de lieux `data/places/`, `data/top.json`
