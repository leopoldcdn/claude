# Audit du bot Vinted (userscript v2.2)

Méthode : relecture complète du code v2.1, puis tests sur une fausse page simulée (jsdom) qui reproduit le parcours
(annonce → bouton « Acheter » tardif → page de paiement → « Choisir un point relais » → fenêtre → « Confirmer »).
**Aucun test n'a pu être fait sur le vrai site** : Vinted est derrière Cloudflare (une requête simple reçoit un
« challenge »). Les sélecteurs et libellés viennent de vos captures d'écran.

## Faiblesses trouvées et corrections

| # | Gravité | Faiblesse | Statut |
|---|---------|-----------|--------|
| 1 | Haute | **Correction d'horloge fausse.** La date HTTP du serveur est tronquée à la seconde : l'ancienne correction pouvait fausser l'heure de ±1 s, soit pire que l'heure du Mac (NTP, ~20 ms). | Corrigé : l'heure du Mac est la référence. Le serveur ne sert qu'à détecter un Mac déréglé de plus de 1,5 s (alerte + correction). |
| 2 | Haute | **Le script pouvait ne jamais voir le bouton** : il rechargeait la page 500 ms après la fin du chargement, même si le contenu n'était pas encore affiché. | Corrigé : il ne conclut « pas dispo » qu'une fois l'annonce affichée (marqueurs « Marque / État / Ajouté / Faire une offre ») + 700 ms. Repli : 3,5 s. |
| 3 | Haute | **Alerte sonore muette après un rechargement** (Chrome bloque l'audio sans geste utilisateur sur la nouvelle page). | Corrigé : notification système, autorisée une fois au clic sur « Armer ». |
| 4 | Haute | **Un ancien armement pouvait se réveiller** plus tard (état partagé entre onglets/jours). | Corrigé : armement lié à l'onglet + expiration 2 h après l'heure H. |
| 5 | Haute | **Aucun arrêt d'urgence.** | Corrigé : bouton « Stop » et touche Échap. |
| 6 | Haute | **Paiement automatique sans contrôle du prix.** | Corrigé : `MAX_TOTAL` (refuse de payer au-dessus du plafond). Reste désactivé par défaut. |
| 7 | Moyenne | Chrome ralentit les onglets en arrière-plan (jusqu'à 1 réveil/minute après 5 min) et le Mac peut se mettre en veille. | Atténué : avertissement dans le bandeau, verrou d'écran (Wake Lock). **Consigne : onglet au premier plan, Mac branché, veille désactivée.** |
| 8 | Moyenne | `scrollIntoView` animé faussait les coordonnées du clic. | Corrigé : défilement instantané, et seulement si nécessaire. |
| 9 | Moyenne | Recherche de texte lente (calcul de mise en page sur des milliers d'éléments, ralentit aussi Google Maps). | Corrigé en v2.1 (nœuds de texte). |
| 10 | Moyenne | Page de vérification Cloudflare (« Just a moment ») non détectée : le bot aurait continué à recharger. | Corrigé : arrêt immédiat + notification. |
| 11 | Basse | Détection de blocage coûteuse (`innerText`) à chaque cycle. | Corrigé : au plus 1 fois par seconde. |
| 12 | Basse | Impossible de savoir où le temps est perdu. | Ajouté : journal horodaté au centième de seconde, `vbDump()` dans la console. |

## Tests simulés (fausse page)

| Cas | Résultat |
|-----|----------|
| Parcours complet, seul le clic « souris » fonctionne | Clic « Acheter » 1 ms après l'activation du bouton ; « Choisir » 20 ms ; « Confirmer » 7 ms |
| Point relais déjà choisi | Livraison validée immédiatement |
| Minuteur avant l'heure H | Rechargement déclenché à **0 ms** de l'heure H |
| Annonce affichée sans bouton | Rechargement à 1,0 s ; repli à 3,5 s si les marqueurs ne sont pas reconnus |
| `AUTO_PAY` avec plafond 30 € (total 44,65 €) | Ne paie pas (correct) |
| `AUTO_PAY` avec plafond 50 € | Paie (correct) |
| Armé dans un autre onglet / armement expiré | Ne fait rien, propose d'armer |
| Page « Just a moment » | Arrêt immédiat |

## Risques qui restent (non éliminables par le code)

1. **Libellés et structure de Vinted.** S'ils changent, une étape peut échouer. Le bot s'arrête alors proprement et vous reprenez à la main, sans jamais payer à l'aveugle.
2. **Protection anti-bot (Cloudflare).** Des rechargements trop rapprochés peuvent bloquer la session. Le bot s'arrête dans ce cas ; il ne cherche pas à contourner la protection.
3. **3-D Secure.** Le paiement par carte demandera presque sûrement une validation sur votre téléphone : non automatisable. Gardez le téléphone à portée.
4. **Parcours d'un iPhone.** La livraison et les options (par exemple « Vérification du matériel électronique », 5 €, jamais cochée par le bot) peuvent différer de celles de l'article de test. Non vérifié.
5. **Google Maps.** La fenêtre des points relais ne s'affiche qu'après son chargement : ce délai ne dépend pas du script.
6. **Conditions d'utilisation de Vinted.** L'automatisation est interdite : risque pour le compte.
7. **Prix.** Un iPhone récent à 200 € est très en dessous du marché : vérifiez le vendeur et les avis, et ne payez que via Vinted.
8. **Choix délibéré : le rechargement part à H pile, jamais avant.** Arriver avant la publication coûte 1 s ou plus (nouveau cycle), arriver après coûte quelques millisecondes.

## Protocole recommandé

**La veille :** essai complet sur une annonce achetable (voir ci-dessous), puis `vbDump()` pour lire le journal. Vérifier que le Mac est en « Date et heure : réglage automatique ».

**Le jour J, vers 17h50 :** Mac branché, veille désactivée, Chrome au premier plan, onglet de l'annonce seul dans sa fenêtre, son activé, téléphone à portée (3-D Secure). Cliquer sur « Armer » et **autoriser les notifications**.
