# Suite donnée aux commentaires du 19 novembre 2026 (version f93455e)

Critère de réussite : une personne qui part de Bordeaux avec 800 € pour deux trouve une destination,
comprend le coût annoncé et ouvre son itinéraire sans ressaisir une seule information.

Vérifié dans le navigateur (Bordeaux, juin, 4 jours, 2 personnes, 800 €, plage, Europe) :
Formentera, Olib et Palma en tête ; la liste annonce ≈ 750 à 1 050 € pour 2, l'itinéraire 754 €
(économique, il reste 46 €) ; le formulaire d'itinéraire est déjà rempli (Bordeaux, juin, 4 jours, 2, 800 €, plage).

## 1. Critères gardés jusqu'à l'itinéraire
- `discover.js` (`shareCriteria`) recopie départ, mois, durée, voyageurs, budget et envies dans les réglages
  de l'itinéraire à chaque changement et à l'ouverture d'un résultat ; `itinerary.js` fait l'inverse.
- La fiche d'un lieu ouvert depuis la recherche affiche un encadré « Ta recherche » (prix, trajet, contenu).
- La ville de départ est d'abord cherchée dans la base locale (`top.json`) : un service de géocodage
  indisponible ne fait plus disparaître le trajet du prix ; si la ville reste introuvable, un message le dit.

## 2. Même calcul dans la liste et l'itinéraire
- Nouveau module `cost.js`, utilisé par les deux : accès (mer à traverser = avion ou ferry, jamais le train,
  grâce au masque des terres), hébergement, repas, visites, transports sur place.
- Marseille → Palma (4 jours, juin, 2 pers.) : liste ≈ 971 à 1 272 €, avion ; itinéraire 956 € économique.
- Banc d'essai : `node web/tools/bench/coherence.mjs` (écart de 8 à 25 € sur les courts séjours).
- La liste affiche une fourchette (économique à confort) et ce qu'elle comprend.

## 3. Sans WebGL ou sans carte
- Détection de WebGL avant de créer la carte ; en cas d'échec (WebGL ou chargement), mode « sans globe » :
  l'écran de chargement disparaît, un encadré explique, l'accueil et « Où partir ? » restent utilisables.
- L'écran de chargement ne bloque jamais plus de 12 secondes.

## Accueil et résultats
- Accueil : « Où part-on ensuite ? », puis D'où pars-tu ? Quand ? Combien de temps ? Quel budget total
  (pour N personnes, à côté du montant) et le bouton terre cuite « Explorer les destinations ».
- « Où partir ? » : départ, mois, budget et voyageurs en premier, sans passer par « Modifier ».
- Résultats : trois idées comparables (prix total pour le groupe, temps de trajet depuis le départ,
  phrase « pourquoi »), badge « Coup de cœur » sur la première seulement, puis « Voir N autres idées ».
