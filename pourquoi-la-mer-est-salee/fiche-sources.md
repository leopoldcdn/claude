# Fiche de sources — « Pourquoi la mer est salée ? »

Rédigée à partir de pages **lues** pendant la production (pas de chiffre pris de mémoire). Statuts :

- **Lu** : la page a été ouverte et le passage cité y figure.
- **Calculé** : recalculé par mes soins à partir de données sourcées (script `source/verif_couche_sel.py`).
- **Simplifié** : formulation volontairement simplifiée pour la voix off ; la nuance est donnée.
- **Faible** : source indirecte ou point que je n'ai pas pu confirmer. Signalé en toute franchise.

## 1. Affirmations de la voix off

| N° | Affirmation | Source | Passage / valeur | Statut |
|---|---|---|---|---|
| V1 | « La pluie est douce. Les rivières aussi. » (au sens : pas salées) | USGS, Swenson (1994), *Why is the ocean salty?* https://doi.org/10.3133/70159082 ; USGS Water Science School, *Saline water and salinity* https://www.usgs.gov/water-science-school/science/saline-water-and-salinity | « All water, even rain water, contains dissolved chemicals which scientists call "salts." But not all water tastes salty. » ; eau douce : moins de 1 000 ppm de sels dissous, océan : environ 35 000 ppm. | **Lu** (résumé 1994 et page USGS). **Faible** sur un chiffre précis pour les rivières : je n'ai pas obtenu de moyenne mondiale lue à la source ; l'affirmation reste « pas salées » au sens de la définition USGS. |
| V2 | « …elles finissent dans une mer salée. » | NOAA, *Why is the ocean salty?* https://oceanservice.noaa.gov/facts/whysalty.html | « …ions that are carried away to streams and rivers that eventually feed into the ocean. » | **Lu**. J'ai retiré « toutes » : des rivières finissent dans des lacs fermés (la Caspienne, par exemple). |
| V3 | « En mille sept cent quinze, Edmond Halley, celui de la comète… » | Halley, *Phil. Trans.* vol. 29 (1715), p. 296, extraits reproduits par G. F. Becker, « Halley on the Age of the Ocean », *Scientific American*, 30 avril 1910. https://www.scientificamerican.com/article/halley-on-the-age-of-the-ocean/ | Becker : Halley « was the first to predict correctly the return of a comet, that which is now known by his name » ; l'article de Halley est « On the Cause of the Saltness of the Ocean, and of the Several Lakes that Emit no Rivers… » (1715). | **Lu** |
| V4 | « …remarque que les lacs sans sortie sont salés. » | Halley 1715 (même source) | « all the lakes in the world, properly so called, are found to be salt, some more, some less than the ocean » ; il définit ces lacs comme « standing waters as perpetually receive rivers running into them, and have no exit or evacuation ». | **Lu**. C'est son observation à lui ; je ne dis pas « tous ». |
| V5 | « Les rivières apportent un peu de sel. » | Halley 1715 ; NOAA (voir V2) ; USGS FAQ https://www.usgs.gov/faqs/why-ocean-salty | Halley : les rivières emportent des particules salines « in so small a quantity as not to be perceived ». USGS : « The ions in the runoff are carried to the streams and rivers and then to the ocean. » | **Lu** |
| V6 | « Dans un lac sans sortie, l'eau ne part qu'en s'évaporant : elle monte en vapeur. Le sel, lui, reste. » | Halley 1715 ; Wikipédia (EN) « Endorheic basin » https://en.wikipedia.org/wiki/Endorheic_basin ; « Caspian Sea » https://en.wikipedia.org/wiki/Caspian_Sea | Halley : « the vapors thus exhaled are perfectly fresh ; so that the saline particles brought in by the rivers remain behind ». Endorheic : les sorties se font « chiefly through evaporation and seepage » et le lac peut devenir salin. Caspienne : exutoire principal = évaporation. | **Lu** · **Simplifié** (une petite part part aussi par infiltration) |
| V7 | « La mer, c'est un immense lac sans sortie. » | Halley 1715 | Halley écrit que l'océan « may also be esteemed a lake ». | **Lu** · c'est l'analogie de Halley (voir la question ouverte, § 4). |
| V8 | « D'où vient ce sel ? De la roche. » | NOAA (V2) ; USGS FAQ | NOAA : « Rocks on land are the major source of salts dissolved in seawater. » USGS : « Salt in the ocean comes from rocks on land. » | **Lu** |
| V9 | « La pluie contient du gaz carbonique : un peu acide, elle ronge la roche et la dissout. » | EPA, *What is acid rain?* https://www.epa.gov/acidrain/what-acid-rain ; NOAA ; USGS FAQ | EPA : « Normal rain has a pH of about 5.6; it is slightly acidic because carbon dioxide (CO2) dissolves into it forming weak carbonic acid. » NOAA : « Rainwater that falls on land is slightly acidic, so it erodes rocks. This releases ions… » USGS : the acids « chemically break down the rocks and carries salts and minerals along in a dissolved state as ions ». | **Lu** · **Simplifié** (« dissout » résume érosion physique + dissolution chimique) |
| V10 | « …comme du sucre dans un café. » | — | Image pédagogique, aucune affirmation chiffrée. | Analogie |
| V11 | « Ces minéraux dissous, ce sont des sels. » | USGS (V1) ; NOAA | USGS : « dissolved chemicals which scientists call "salts" » ; NOAA parle d'ions dissous. | **Lu** · **Simplifié** (en chimie, « sel » désigne plus largement un composé ionique) |
| V12 | « Autre source : des cheminées au fond de l'océan, chauffées par la roche en fusion. » | NOAA (V2) | « Another source of salts in the ocean is hydrothermal fluids, which come from vents in the seafloor. Ocean water seeps into cracks in the seafloor and is heated by magma… » | **Lu** · « roche en fusion » = magma |
| V13 | « Imagine tout ce sel, étalé sur toutes les terres du monde. Une couche d'environ cent cinquante mètres. » | USGS FAQ https://www.usgs.gov/faqs/why-ocean-salty ; recalcul : `source/verif_couche_sel.py` | USGS : « By some estimates, if the salt in the ocean could be removed and spread evenly over the Earth's land surface it would form a layer more than 500 feet (166 meters) thick… ». Mon calcul : **148 m** (entre 129 et 161 m selon la densité du sel retenue, entre 144 et 152 m selon la salinité 3,4–3,6 %). | **Calculé** + **Lu**. ⚠ La page USGS écrit « 500 pieds (166 mètres) » mais 500 pieds = 152,4 m : j'ai donc pris « environ 150 m », valeur qui concorde avec 500 pieds et avec mon calcul. Hypothèses du calcul : sel assimilé à de l'halite pleine, étalement uniforme. |
| V14 | « Un immeuble de quarante étages. » | USGS FAQ (V13) | « …about the height of a 40-story office building. » (150 m ÷ 40 = 3,75 m par étage, cohérent.) | **Lu** |
| V15 | « …dis-toi que tu goûtes de la roche. » | NOAA ; USGS | NOAA : le sel vient « primarily from rocks on land and openings in the seafloor ». | **Simplifié** : la majeure partie vient de la roche (V8), une autre partie des cheminées (V12). |
| V16 | « …depuis des millions d'années. Et ça continue. » | *Ocean Chemical Processes*, Gale / *Encyclopedia of Earth Sciences*, repris sur Encyclopedia.com https://www.encyclopedia.com/science/news-wires-white-papers-and-books/ocean-chemical-processes ; NOAA (présent) | « a sodium atom entering the ocean in river water will stay in the ocean for 80 × 10⁶ years before it is removed from sea water » (donc environ 80 millions d'années d'apports pour le sodium actuel). NOAA décrit l'érosion par la pluie au présent. | **Lu**. Les durées de séjour varient selon les sources (voir § 4). |

## 2. Affirmations lues à l'écran (étiquettes, schémas)

| Élément | Source | Statut |
|---|---|---|
| « 1715 » | Halley 1715 (V3) | Lu |
| Mer Caspienne : « pas de sortie », « SALÉ » | Wikipédia EN, *Caspian Sea* : « Endorheic », exutoire = évaporation, salinité d'environ 1,2 % (12 g/L), soit environ le tiers de l'eau de mer moyenne. Halley cite lui-même la Caspienne comme exemple (V4). | Lu (source secondaire : Wikipédia) |
| « ÉVAPORATION », « VAPEUR = EAU PURE », « LE SEL RESTE » | Halley 1715 (V6) ; NOAA : la salinité dépend de l'évaporation | Lu |
| « GAZ CARBONIQUE (CO₂) », « UN PEU ACIDE » | EPA (V9), pH ≈ 5,6 | Lu |
| « ELLE RONGE » | NOAA (V9) | Lu |
| « MINÉRAUX DISSOUS = DES SELS » | USGS (V11) | Lu |
| « CHEMINÉE AU FOND DE L'OCÉAN / CHAUFFÉE PAR LA ROCHE EN FUSION » | NOAA (V12) | Lu |
| « ≈ 150 m », « 40 ÉTAGES », « COUCHE DE SEL » | V13, V14 | Calculé + Lu |
| Terre dont les continents blanchissent | **Illustration** : la photo NASA est retouchée par mes soins (continents recolorés en blanc sel). Ce n'est pas une carte de la couche de sel réelle. | Illustration |
| « DES MILLIONS D'ANNÉES » | V16 | Lu |
| Le schéma du lac, la dalle de sel et l'immeuble | Schémas simplifiés, pas à l'échelle des cristaux | Illustration |

## 3. Chiffres et constantes utilisés pour le calcul des 150 m

| Donnée | Valeur | Source |
|---|---|---|
| Volume des océans | 1 335 000 000 km³ | NOAA, *How much water is in the ocean?* https://oceanservice.noaa.gov/facts/oceanwater.html (estimation du NGDC) — **Lu** |
| Salinité moyenne | environ 35 ‰, soit 3,5 % de la masse | NOAA (V2) ; USGS : environ 35 000 ppm — **Lu** |
| Densité moyenne de l'eau de mer en surface | 1,025 kg/L | Wikipédia EN, *Seawater* https://en.wikipedia.org/wiki/Seawater — **Lu** (secondaire) |
| Densité du sel (halite) | 2,17 | Wikipédia EN, *Halite* https://en.wikipedia.org/wiki/Halite — **Lu** (secondaire) |
| Surface des terres émergées | 148 940 000 km² | Wikipédia EN, *Earth* https://en.wikipedia.org/wiki/Earth — **Lu** (secondaire) |
| Résultat | 4,79 × 10¹⁹ kg de sel → **148 m** | `source/verif_couche_sel.py` |

## 4. Questions laissées ouvertes (non affirmées dans la vidéo, posées dans la légende)

1. **La mer devient-elle de plus en plus salée ?** NOAA écrit que « many of the dissolved ions are used by organisms… and removed. Others are not removed, so their concentrations increase over time ». D'autres références décrivent, pour le sodium et le chlorure, un état d'équilibre où les apports égalent les pertes (Encyclopedia.com : « The ocean is at steady state for a particular element if that element is added and removed at the same rate ») et un séjour d'environ 80 millions d'années pour le sodium. Je ne tranche pas.
2. **Halley et Joly.** Halley proposait de mesurer la salinité pour dater le monde (« a proposal… to discover the age of the world »). John Joly a calculé en 1899-1900 un âge des océans d'environ 80 à 100 millions d'années (Wikipédia EN, *Age of Earth* https://en.wikipedia.org/wiki/Age_of_Earth — **Lu**, secondaire), alors que l'âge de la Terre est d'environ 4,54 milliards d'années (même page, datations Pb-Pb de météorites). **Question que je pose, sans l'affirmer** : ce chiffre de Joly ressemble à la durée de séjour du sodium (environ 80 millions d'années) ; a-t-il mesuré, sans le savoir, le temps qu'un grain de sel reste dans la mer plutôt que l'âge de la Terre ? Le calcul de départ (quantité de sodium ÷ apport annuel) est bien celui d'une durée de séjour.
3. **Part exacte des cheminées et des roches** : NOAA parle de « source majeure » pour les roches et d'« autre source » pour les cheminées, sans pourcentage ; je n'en ai pas donné.

## 5. Ce que je n'ai pas pu lire (donc non utilisé comme source)

- Britannica, *Why is the ocean salty?* : refusé (403).
- WHOI, *What makes the ocean salty?* : service indisponible (503).
- Chiffre moyen de salinité des rivières (≈ 120 mg/L cité dans la littérature) : non retrouvé dans une page lue, donc non utilisé.

## 6. Images, polices (libres de droits)

| Élément | Auteur / source | Licence | Lien |
|---|---|---|---|
| Portrait d'Edmond Halley | Thomas Murray (vers 1687-1690, selon les sources) ; reproduction fidèle d'une œuvre du domaine public | Domaine public | https://commons.wikimedia.org/wiki/File:Edmund_Halley.gif |
| Cheminée hydrothermale (« black smoker ») | P. Rona / OAR / National Undersea Research Program (NURP), NOAA | Domaine public (œuvre d'un agent fédéral américain) | https://commons.wikimedia.org/wiki/File:Blacksmoker_in_Atlantic_Ocean.jpg |
| Mer Caspienne vue de l'espace (11 juin 2003) | Jeff Schmaltz, MODIS Rapid Response Team, NASA/GSFC | Domaine public (NASA) | https://commons.wikimedia.org/wiki/File:Caspian_Sea_from_orbit.jpg |
| Terre (« Blue Marble », Apollo 17) | NASA / équipage d'Apollo 17 | Domaine public (NASA) | https://commons.wikimedia.org/wiki/File:The_Earth_seen_from_Apollo_17.jpg |
| Police Fredoka | Projet Fredoka | SIL Open Font License 1.1 (`source/fonts/OFL.txt`) | https://github.com/google/fonts/tree/main/ofl/fredoka |

Les photos sont **découpées, collées, retouchées et animées** (cartes de papier, scotch, continents blanchis) ; aucune n'est affichée seule en plein écran. Aucune personne privée n'apparaît ; le seul visage est le portrait d'Edmond Halley (1656-1742), peint vers 1687-1690.
