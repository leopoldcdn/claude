# Stratégie du paper trading : recherche, résultats, limites

## Ce que dit la littérature (et ce qu'elle ne dit pas)

- **La tendance existe sur les cryptos, mais elle est fragile dans le temps.** Une étude portant sur plus de 3 100 cryptomonnaies (2013-2018) trouve un fort effet de tendance sur 1 jour à 1 mois, qui semble avoir **disparu après le lancement des contrats à terme sur Bitcoin**. D'autres travaux trouvent un effet de tendance temporelle solide, mais concentré dans les marchés haussiers.
- **Un test hors échantillon d'un praticien** (données jusqu'à début 2022, puis test jusqu'en 2024) indique que certaines règles de tendance ont perdu de leur efficacité, tandis que d'autres (acheter les plus hauts récents) ont tenu. Source non académique.
- **Ajuster la taille de position à la volatilité** réduit surtout les pertes maximales ; l'effet sur le rendement est plus incertain (moins net sur ETH).
- **Le surajustement est le risque n° 1.** Avec assez d'essais, une stratégie sans valeur affiche un bon Sharpe par hasard. Les outils de référence : validation « walk-forward » et Sharpe déflaté (Bailey & López de Prado).
- Les performances annoncées par des fonds ou des fournisseurs (Sharpe de 2 à 5) sont à ignorer : échantillons courts, source commerciale.

Les textes complets des études n'ont pas été lus : les ordres de grandeur sont à vérifier dans les originaux.

## La stratégie retenue (fixée avant les tests)

Suivi de tendance **long uniquement** (jamais de levier, jamais de vente à découvert), sur BTC et ETH, rebalancé une fois par jour.

1. **Signal** : part des 4 tendances (cours au-dessus de sa moyenne mobile 20, 50, 100 et 200 jours) qui sont haussières. On combine plusieurs horizons pour ne pas dépendre d'un réglage chanceux.
2. **Taille** : poids = signal × min(1, 40 % / volatilité des 30 derniers jours). Quand le marché devient très volatil, on réduit.
3. **Hystérésis** : on ne change la position que si le poids cible bouge de 10 points ou plus (limite les frais).
4. **Répartition** : le capital est partagé à parts égales entre BTC et ETH ; la part non investie reste en liquidités (rendement 0 %, hypothèse prudente).
5. **Exécution** : décision à la clôture du jour J, ordre à l'ouverture du jour J+1, avec 0,25 % de frais et glissement par ordre.

## Résultats du backtest (BTC et ETH, Bitstamp, 2015 -> 2 nov. 2026)

| | CAGR | Volatilité | Sharpe | Perte max | Calmar |
|---|---|---|---|---|---|
| Acheter-garder BTC | 58,8 % | 66,9 % | 1,03 | -83,4 % | 0,70 |
| **Candidate** | 42,6 % | 28,0 % | 1,41 | -35,5 % | 1,20 |

**Par période (réglages figés) :**

| | Candidate : CAGR / Sharpe / perte max | BTC acheter-garder |
|---|---|---|
| 2015-2020 | 69,6 % / 1,88 / -24,7 % | 111,7 % / 1,38 / -83,4 % |
| 2021-2026 | 19,4 % / 0,83 / -35,5 % | 18,1 % / 0,58 / -76,7 % |
| 2022-2026 | 14,0 % / 0,67 / -24,0 % | 11,0 % / 0,46 / -67,0 % |
| Baisse 2018 | -15,6 % | -73,4 % |
| Baisse 2022 | -22,1 % | -64,2 % |

**Robustesse :**
- 36 réglages testés (4 combinaisons d'horizons x 3 cibles de volatilité x 3 fenêtres) : **tous** battent acheter-garder en Sharpe (1,15 à 1,55) et en Calmar. La candidate n'est pas un pic de chance.
- **Walk-forward** (réglages choisis chaque année sur le passé seul, 2018-2026) : +22,8 %/an, Sharpe 1,11, perte max -27 %, contre 0,63 et -81 % pour acheter-garder.
- Coûts : Sharpe 1,48 (0,10 %), 1,41 (0,25 %), 1,29 (0,50 %), **1,05 (1,00 %)**.
- Exécution retardée de 1 à 2 jours : Sharpe 1,37 et 1,33.
- Bootstrap par blocs : Sharpe de la candidate entre 0,74 et 2,05 (intervalle à 95 %) ; 95 % de chances de dépasser acheter-garder.
- Moteur de paper trading rejoué sur 2021-2026 : +19,5 %/an, Sharpe 0,83, perte max -35,6 % (le backtest annonce 19,4 % / 0,83 / -35,5 %). Test de causalité : 80/80, aucun regard sur le futur.

## Ce qu'il faut en conclure, honnêtement

1. **Le bénéfice récent est surtout une baisse du risque, pas un meilleur rendement.** Depuis 2021, la candidate rapporte à peu près comme acheter-garder (+19 % contre +18 %) mais avec une perte maximale deux fois moindre. Les rendements spectaculaires de 2015-2020 viennent d'un marché de jeunesse qu'on ne reverra sans doute pas.
2. **Attendez-vous à un Sharpe de 0,5 à 0,8, pas 1,4.** Les années 2015-2020 tirent la moyenne.
3. **Elle sous-performe fortement dans les phases haussières** (par exemple +49 % en 2024 contre +121 % pour BTC). C'est le prix de la protection.
4. **Le Sharpe déflaté (100 %) est trop indulgent** ici : les 36 réglages sont des variantes d'une même idée, très corrélées.
5. **Hypothèses favorables** : pas d'impôt, pas de rendement sur le cash, exécution parfaite à l'ouverture, une seule plateforme (Bitstamp), BTC et ETH n'ayant pas fait faillite sur la période (biais de survie).
6. **Des mois d'observation sont nécessaires** pour juger : la stratégie ne trade que quelques dizaines de fois par an.

## Critère d'évaluation fixé à l'avance

Après **6 mois au minimum** de paper trading, on compare à « acheter-garder » sur la **perte maximale** et la **cohérence avec le backtest**, pas sur le gain du moment. Une stratégie de tendance perd normalement de l'argent pendant des phases de marché sans direction : cela ne l'invalide pas.

## Reproduire les chiffres

Les scripts sont dans `research/` (`fetch.py` télécharge les données, `run1.py` et `run2.py` produisent les tableaux).

## Sources

- [Rotterdam Brown Bag Seminars in Finance](https://utilities.tinbergen.nl/?p=66235)
- [Revisiting Trend-following and Mean-reversion Strategies in Bitcoin (Quantpedia)](https://quantpedia.com/revisiting-trend-following-and-mean-reversion-strategies-in-bitcoin/)
- [Time Series and Cross Sectional Momentum in the Cryptocurrency Market](https://acfr.aut.ac.nz/__data/assets/pdf_file/0009/918729/Time_Series_and_Cross_Sectional_Momentum_in_the_Cryptocurrency_Market_with_IA.pdf)
- [Bitcoin Intraday Time-Series Momentum](https://reading-9.eprints-hosting.org/100181/3/21Sep2021Bitcoin%20Intraday%20Time-Series%20Momentum.R2.pdf)
- [Talyxion : Risk Managed Crypto Portfolio Allocation (arXiv)](https://arxiv.org/pdf/2511.13239)
- [Interpretable Hypothesis-Driven Trading : Walk-Forward Validation (arXiv)](https://arxiv.org/pdf/2512.12924)
- [Backtesting & Research Methodology (tradingstrategy.ai)](https://tradingstrategy.ai/docs/learn/backtesting.html)
- [Kraken : historical data](https://docs.kraken.com/exchange/guides/general/historical-data)
