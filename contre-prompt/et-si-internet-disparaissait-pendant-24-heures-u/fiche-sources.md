# Fiche de sources — « Et si Internet disparaissait pendant 24 heures ? »

Rédigée à partir de pages **lues** pendant la production. Statuts : **Lu** (passage cité présent sur la page ouverte), **Secondaire** (chiffre lu dans un article qui cite la source primaire, que je n'ai pas pu ouvrir), **Calculé**, **Simplifié**, **Faible** (hypothèse ou source indirecte), **Illustration**.

**Méthode.** Le sujet demandait une « simulation des conséquences ». Une coupure mondiale de 24 h n'a jamais eu lieu : rien ne peut être affirmé sur ses conséquences. La vidéo le dit (« impossible à simuler ») et s'appuie sur des pannes réelles et sur des coupures volontaires mesurées.

## 1. Affirmations de la voix off

| N° | Affirmation | Source | Passage / valeur | Statut |
|---|---|---|---|---|
| V1 | « Impossible à simuler. » | — | Aucune coupure mondiale de 24 h n'est documentée dans mes sources ; absence de preuve, pas preuve d'impossibilité. | **Faible** (cadrage honnête) |
| V2 | « Personne ne peut éteindre tout Internet d'un coup. » | Internet Society, *How It Works* https://www.internetsociety.org/internet/how-it-works/ | « Who's in charge of the Internet? No one is, but everyone is… the global Internet consists of tens of thousands of interconnected networks run by service providers, individual companies, universities, governments… » | **Lu** · **Simplifié** : c'est une conclusion tirée de l'absence de centre. Un État peut couper son propre réseau (V12). |
| V3 | « …des dizaines de milliers de réseaux, et personne n'en est le patron. » | Internet Society (même page) | « tens of thousands of interconnected networks » ; « No one is, but everyone is. » | **Lu** |
| V4 | « En octobre deux mille vingt et un, Facebook, Instagram et WhatsApp sortent d'Internet pendant plus de cinq heures. » | Cloudflare, « Understanding how Facebook disappeared from the Internet » https://blog.cloudflare.com/october-2021-facebook-outage/ | « Facebook and its affiliated services WhatsApp and Instagram were, in fact, all down. » ; « It stopped being available at around 15:50 UTC and returned at 21:20 UTC. » ; « as of 21:28 UTC Facebook appears to be reconnected to the global Internet ». Soit 5 h 30 à 5 h 40. | **Lu** |
| V5 | « La cause : un mauvais réglage, pas une attaque. » | Facebook Engineering, 4 octobre 2021 https://engineering.fb.com/2021/10/04/networking-traffic/outage/ ; 5 octobre https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/ | « configuration changes on the backbone routers… caused issues » ; « there was no malicious activity behind this outage — its root cause was a faulty configuration change on our end ». | **Lu** |
| V6 | « En deux mille dix-huit, ce n'est pas Internet mais le réseau Visa qui tombe. » | Data Center Knowledge, « Visa's UK Network Outage: What You Need to Know » (21 juin 2018) https://datacenterknowledge.com/uptime/visa-s-uk-network-outage-what-you-need-know | « Visa Europe… saw its data center infrastructure fail… The incident, caused by a network-switch failure » ; panne attribuée à un composant matériel d'un commutateur dans un centre de données. | **Secondaire** (cite la lettre de Visa au Parlement britannique, 15 juin 2018, que je n'ai pas pu ouvrir : accès refusé). « Ce n'est pas Internet » est ma caractérisation : c'est un incident interne au système de paiement. |
| V7 | « …sur une dizaine d'heures, plus de cinq millions de paiements échouent en Europe. » | Data Center Knowledge (même article) | « an incident that took the company's operations team about 10 hours to resolve » ; « most of the transactions attempted… (91 percent) went through normally, the rest (5.2 million swipes) failing » ; pics à 35 % d'échecs sur deux périodes (10 min puis 50 min), environ 7 % hors pics. | **Secondaire** · **Simplifié** : les échecs n'ont pas été constants pendant dix heures, d'où « sur une dizaine d'heures ». Le chiffre de 5,2 millions couvre l'Europe (Visa Europe). |
| V8 | « En juillet deux mille vingt-quatre, une mise à jour défectueuse plante huit millions et demi d'ordinateurs. » | Microsoft, « Helping our customers through the CrowdStrike outage » (20 juillet 2024) https://blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-the-crowdstrike-outage/ | « We currently estimate that CrowdStrike's update affected 8.5 million Windows devices, or less than one percent of all Windows machines. » | **Lu** · **Simplifié** : « plante » résume un dysfonctionnement ; ce n'est pas une panne d'Internet. |
| V9 | « Des milliers de vols sont annulés. » | Skift, « One Software Update, a Global Airline Meltdown » (19 juillet 2024) https://skift.com/2024/07/19/one-software-update-a-global-airline-meltdown | « Globally, the outage has caused nearly 4,000 cancellations, and nearly 34,000 delays, according to the latest data from Cirium. » (relevé de l'après-midi du 19 juillet) | **Secondaire** (données Cirium citées). Les totaux varient selon l'heure et la source. |
| V10 | « …au moins deux cent quatre-vingt-seize coupures d'Internet, dans cinquante-quatre pays. » | Access Now, #KeepItOn, *Emboldened offenders, endangered communities: internet shutdowns in 2024* https://www.accessnow.org/press-release/keepiton-internet-shutdowns-2024-en/ | « authorities imposed at least 296 internet shutdowns in 54 countries »; « a 35% increase compared to the previous high in 2022 ». | **Lu** |
| V11 | « Près de six par semaine. » | Calcul : 296 ÷ 52,2 semaines | 5,7 par semaine en moyenne. | **Calculé** · moyenne : toutes les coupures n'ont ni la même durée ni la même étendue. |
| V12 | « On ne s'en aperçoit que quand ça s'arrête. » | — | Réflexion de conclusion, pas une donnée. | Opinion |

## 2. Éléments à l'écran

| Élément | Source | Statut |
|---|---|---|
| « PLUS DE 5 HEURES », horloge de 15 h 50 à 21 h 20 (UTC) | V4 | Lu |
| « UN MAUVAIS RÉGLAGE », « PAS UNE ATTAQUE » | V5 | Lu |
| « PAS INTERNET : LE RÉSEAU VISA », « 5,2 M », « ≈ 10 HEURES » | V6, V7 | Secondaire |
| « 8,5 M D'ORDINATEURS PLANTÉS », « JUILLET 2024 », « DES MILLIERS DE VOLS ANNULÉS » | V8, V9 | Lu · Secondaire |
| « 296 COUPURES EN 2024 », « DANS 54 PAYS », « ≈ 6 PAR SEMAINE » | V10, V11 | Lu · Calculé |
| Réseau de nœuds, carte bancaire, panneau de départs (Paris, Londres, Madrid…), téléphone et icônes | **Illustrations** : schémas, villes et statuts d'exemple, pas des données réelles | Illustration |
| Horloge Facebook | Heures réelles (V4), schéma graphique | Lu |
| Les lumières de la Terre qui s'éteignent | **Illustration** : photo NASA retouchée (lumières atténuées par mes soins), pas des données de coupures géolocalisées | Illustration |

## 3. Questions laissées ouvertes

1. **Que se passerait-il avec 24 h de coupure mondiale ?** Personne ne peut le dire : ce n'est jamais arrivé. Les pannes de la vidéo touchent chacune un morceau, et deux d'entre elles (Visa, mise à jour de logiciel) ne sont pas des pannes d'Internet.
2. **Les coupures volontaires sont-elles comparables entre elles ?** Non : Access Now compte des coupures de durées et d'étendues très différentes (nationales, régionales, blocages de plateformes comptés à part). « Près de six par semaine » est une moyenne, pas un événement hebdomadaire identique.
3. **Part exacte des câbles sous-marins** : non traitée dans la vidéo. Les sources lues donnent 95 %, 98 % ou plus de 99 % du trafic international selon l'année (ICPC, UIT), je n'ai donc rien affirmé.

## 4. Ce que je n'ai pas pu lire

- **Lettre de Visa au Parlement britannique** (15 juin 2018) et **communiqué de la commission du Trésor** : accès refusé (403) ; chiffres repris d'un article qui les cite.
- **Rapport de l'OCDE sur l'Égypte (2011)**, Britannica, Computer Weekly, FinTech Futures : accès refusé ; non utilisés.
- **Cirium** : chiffres lus via Skift, pas sur le site de Cirium.

## 5. Images (libres de droits)

| Élément | Auteur / source | Licence | Lien |
|---|---|---|---|
| Terre de nuit, « Black Marble – City Lights 2012 » | NASA Goddard Space Flight Center, données Suomi NPP (nasa_id GSFC_20171208_Archive_e001593) | Domaine public (NASA) | https://images.nasa.gov/details/GSFC_20171208_Archive_e001593 |
| Police Fredoka | Projet Fredoka | SIL Open Font License 1.1 (`source/fonts/OFL.txt`) | https://github.com/google/fonts/tree/main/ofl/fredoka |

La photo est **recadrée, assombrie et animée** ; elle n'est pas affichée seule en plein écran. Aucun logo de marque n'est reproduit : les noms de sociétés n'apparaissent qu'en texte.
