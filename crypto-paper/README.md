# Paper trading crypto (argent fictif)

Ce programme **ne peut pas dépenser d'argent** : il n'utilise aucune clé API, ne se connecte à aucun compte et n'envoie aucun ordre.
Il télécharge des cours publics (Bitstamp) et tient un portefeuille fictif de 10 000 € selon la stratégie décrite dans `RESEARCH.md`.

## Installation (une fois)

```bash
cd crypto-paper
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

## Utilisation

Vérifier que le moteur est sain (aucun regard sur le futur) :
```bash
python paper.py selftest
```

Rejouer l'historique avec ce moteur (doit donner ~+19 %/an, Sharpe ~0,83, perte max ~-35 % depuis 2021) :
```bash
python paper.py replay --from 2021-01-01
```

Créer le portefeuille fictif, puis traiter le jour courant (télécharge les cours manquants au premier lancement, environ 1 minute) :
```bash
python paper.py init --capital 10000
python paper.py run
```

Voir l'état :
```bash
python paper.py status
```

`run` est **idempotent** : le relancer le même jour ne fait rien. Chaque ordre fictif est écrit dans `journal.csv`.

## Automatiser (macOS)

La bougie journalière se clôture à 00:00 UTC. Lancez `run` une fois par jour après 00:05 UTC, par exemple à 02:10 heure de Paris toute l'année :

```bash
crontab -e
```
puis ajoutez la ligne (adaptez le chemin) :
```
10 2 * * * cd /chemin/vers/crypto-paper && .venv/bin/python paper.py run >> run.log 2>&1
```
Le Mac doit être allumé à cette heure. Si un jour est manqué, rien de grave : le moteur recalcule la cible avec les cours à jour.

## Garde-fous intégrés

- **Données périmées** : si la dernière bougie n'est pas celle d'hier, aucune décision n'est prise.
- **Prix suspect** : variation de plus de 50 % en un jour, aucune décision n'est prise.
- **Coupe-circuit** : si le portefeuille perd 40 % depuis son plus haut, tout est vendu et plus rien n'est acheté.
- **Pas de levier, pas de vente à découvert** : au maximum 100 % du capital investi.

## Passer à l'argent réel ?

Ce projet ne le permet pas, volontairement. Ne l'envisagez qu'après **au moins 6 mois** de paper trading conformes au critère de `RESEARCH.md`. Cela demanderait un module séparé, des clés API limitées au trading sans droit de retrait et restreintes à votre IP, un plafond de capital que vous êtes prêt à perdre entièrement, et la prise en compte de la fiscalité des plus-values.
