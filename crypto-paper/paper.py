"""Moteur de PAPER TRADING (argent fictif). Aucune clé API, aucun ordre réel : ce programme ne peut pas dépenser d'argent.

Commandes :
  python paper.py init [--capital 10000]   crée le portefeuille fictif
  python paper.py run                      traite le jour courant (à lancer une fois par jour, après 00:05 UTC)
  python paper.py status                   état du portefeuille et comparaison avec « acheter-garder »
  python paper.py replay [--from 2018-01-01]   rejoue l'historique avec ce même moteur
  python paper.py selftest                 vérifie l'absence de regard sur le futur
"""
import argparse, csv, json, math, os, random, sys
import numpy as np, pandas as pd
import data, strategy

HERE = os.path.dirname(os.path.abspath(__file__))
STATE, JOURNAL = os.path.join(HERE, 'state.json'), os.path.join(HERE, 'journal.csv')
ASSETS = ['BTC', 'ETH']
FEE_BPS = 25            # frais + glissement par ordre, en points de base du montant échangé (aligné sur le backtest)
REBAL_BAND = 0.05       # on ne retouche une position que si l'écart au poids cible dépasse 5 % du budget
MAX_DD_HALT = 0.40      # coupe-circuit : tout vendre et s'arrêter si le portefeuille perd 40 % depuis son plus haut
MAX_JUMP = 0.50         # garde-fou de données : on refuse un prix qui bouge de plus de 50 % en un jour

def new_state(capital): return dict(capital0=capital, cash=capital, qty={a: 0.0 for a in ASSETS}, last_day=None, peak=capital, halted=False)
def load_state():
    if not os.path.exists(STATE): sys.exit("Pas de portefeuille : lancez d'abord  python paper.py init")
    return json.load(open(STATE))
def save_state(s): json.dump(s, open(STATE, 'w'), indent=1)
def equity(s, px): return s['cash'] + sum(s['qty'][a] * px[a] for a in px)

def rebalance(s, px, W, avail, day, journal):
    """Ramène chaque position vers son poids cible. Ventes d'abord, puis achats limités au cash disponible."""
    eq = equity(s, px); budget = eq / len(avail); fee = FEE_BPS / 1e4
    orders = []
    for a in avail:
        cur = s['qty'][a] * px[a]; target = budget * (0.0 if s['halted'] else W[a])
        if abs(target - cur) / budget < REBAL_BAND and not (target == 0 and cur > 0): continue
        orders.append((a, target - cur))
    for a, diff in sorted(orders, key=lambda o: o[1]):            # les ventes (diff < 0) passent en premier
        if diff < 0:
            q = min(s['qty'][a], -diff / px[a]); notional = q * px[a]
            s['qty'][a] -= q; s['cash'] += notional * (1 - fee); journal.append((day, a, 'VENTE', q, px[a], notional * fee))
        else:
            notional = min(diff, s['cash'] / (1 + fee))
            if notional <= 1e-9: continue
            q = notional / px[a]; s['qty'][a] += q; s['cash'] -= notional * (1 + fee); journal.append((day, a, 'ACHAT', q, px[a], notional * fee))

def check_halt(s, eq):
    s['peak'] = max(s['peak'], eq)
    if not s['halted'] and eq < s['peak'] * (1 - MAX_DD_HALT):
        s['halted'] = True; return True
    return False

def write_journal(rows, eq):
    new = not os.path.exists(JOURNAL)
    with open(JOURNAL, 'a', newline='') as f:
        w = csv.writer(f)
        if new: w.writerow(['jour', 'actif', 'sens', 'quantite', 'prix', 'frais', 'equite_apres'])
        for d, a, sens, q, p, fee in rows: w.writerow([d, a, sens, f'{q:.8f}', f'{p:.2f}', f'{fee:.2f}', f'{eq:.2f}'])

def cmd_run(_):
    s = load_state()
    for a in ASSETS: data.update(data.PAIRS[a])
    full = {a: data.load(data.PAIRS[a], include_today=True) for a in ASSETS}
    done = {a: df[df.index < pd.Timestamp.now('UTC').tz_localize(None).normalize()] for a, df in full.items()}
    today = pd.Timestamp.now('UTC').tz_localize(None).normalize(); yday = today - pd.Timedelta(days=1)
    if s['last_day'] == str(yday.date()): return print(f'Jour {yday.date()} déjà traité : rien à faire.')
    for a in ASSETS:                                                   # garde-fous sur les données
        if done[a].index[-1] != yday: sys.exit(f'DONNÉES PÉRIMÉES pour {a} (dernière bougie : {done[a].index[-1].date()}). Aucune décision prise.')
        if abs(done[a].close.iloc[-1] / done[a].close.iloc[-2] - 1) > MAX_JUMP: sys.exit(f'PRIX SUSPECT pour {a} : variation > {MAX_JUMP:.0%} en un jour. Aucune décision prise.')
    W = {a: float(strategy.target_weights(done[a]).iloc[-1]) for a in ASSETS}
    px = {a: float(full[a].open.loc[today]) for a in ASSETS}           # prix d'exécution = ouverture du jour (comme dans le backtest)
    eq0 = equity(s, px)
    if check_halt(s, eq0): print(f'COUPE-CIRCUIT : perte de {MAX_DD_HALT:.0%} depuis le plus haut. Tout est vendu, plus aucun achat.')
    journal = []; rebalance(s, px, W, ASSETS, str(today.date()), journal)
    s['last_day'] = str(yday.date()); eq = equity(s, px); s['peak'] = max(s['peak'], eq); save_state(s); write_journal(journal, eq)
    print(f'{today.date()} | poids cibles : ' + ', '.join(f'{a} {W[a]:.0%}' for a in ASSETS) + f' | équité {eq:,.2f} | ordres : {len(journal)}')
    for d, a, sens, q, p, fee in journal: print(f'  {sens} {q:.6f} {a} à {p:,.2f} (frais {fee:.2f})')

def cmd_status(_):
    s = load_state(); full = {a: data.load(data.PAIRS[a], include_today=True) for a in ASSETS}
    px = {a: float(full[a].close.iloc[-1]) for a in ASSETS}; eq = equity(s, px)
    print(f"Capital initial {s['capital0']:,.2f} | équité {eq:,.2f} ({eq / s['capital0'] - 1:+.1%}) | plus haut {s['peak']:,.2f} | coupe-circuit : {'ACTIVÉ' if s['halted'] else 'non'}")
    for a in ASSETS: print(f"  {a}: {s['qty'][a]:.6f} = {s['qty'][a] * px[a]:,.2f}  ({s['qty'][a] * px[a] / eq:.0%})")
    print(f"  Cash: {s['cash']:,.2f} ({s['cash'] / eq:.0%})")

def stats(eq):
    r = eq.pct_change().dropna(); n = len(r); cagr = (eq.iloc[-1] / eq.iloc[0]) ** (365 / n) - 1
    dd = (eq / eq.cummax() - 1).min()
    return dict(CAGR=cagr, Vol=r.std() * math.sqrt(365), Sharpe=r.mean() / r.std() * math.sqrt(365), MaxDD=dd, Calmar=cagr / abs(dd), Final=eq.iloc[-1] / eq.iloc[0])

def cmd_replay(a):
    dfs = {x: data.load(data.PAIRS[x]) for x in ASSETS}; wts = {x: strategy.target_weights(dfs[x]) for x in ASSETS}
    s = new_state(10000.0); curve = {}; trades = 0; one = pd.Timedelta(days=1)
    for T in pd.date_range(a.start, min(df.index[-1] for df in dfs.values())):
        avail = [x for x in ASSETS if T in dfs[x].index and (T - one) in dfs[x].index]
        if not avail: continue
        pxo = {x: dfs[x].open.loc[T] for x in avail}; W = {x: wts[x].loc[T - one] for x in avail}
        check_halt(s, equity(s, pxo)); j = []; rebalance(s, pxo, W, avail, T, j); trades += len(j)
        curve[T] = equity(s, {x: dfs[x].close.loc[T] for x in avail})
    eq = pd.Series(curve); btc = dfs['BTC'].close.loc[eq.index[0]:eq.index[-1]]
    fm = lambda d: ' | '.join(f'{k} {v:.1%}' if k in ('CAGR', 'Vol', 'MaxDD') else f'{k} {v:.2f}' if k != 'Final' else f'x{v:.1f}' for k, v in d.items())
    print(f'Rejeu {eq.index[0].date()} -> {eq.index[-1].date()} | {trades} ordres | coupe-circuit : {"ACTIVÉ" if s["halted"] else "non"}')
    print('  Moteur paper :', fm(stats(eq))); print('  BTC acheter-garder :', fm(stats(btc / btc.iloc[0] * 10000)))

def cmd_selftest(_):
    """Aucun regard sur le futur : la décision prise avec les données jusqu'au jour i doit être identique à celle calculée avec tout l'historique."""
    random.seed(1); bad = 0; n = 0
    for a in ASSETS:
        df = data.load(data.PAIRS[a]); full = strategy.target_weights(df)
        for i in random.sample(range(250, len(df) - 1), 40):
            n += 1
            if abs(strategy.target_weights(df.iloc[:i + 1]).iloc[-1] - full.iloc[i]) > 1e-12: bad += 1
    print(f'Causalité : {n - bad}/{n} contrôles identiques', '-> OK, aucun regard sur le futur.' if not bad else '-> ÉCHEC !'); sys.exit(1 if bad else 0)

if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); sp = p.add_subparsers(dest='cmd', required=True)
    i = sp.add_parser('init'); i.add_argument('--capital', type=float, default=10000.0)
    sp.add_parser('run'); sp.add_parser('status'); sp.add_parser('selftest')
    r = sp.add_parser('replay'); r.add_argument('--from', dest='start', default='2018-01-01')
    a = p.parse_args()
    if a.cmd == 'init':
        if os.path.exists(STATE): sys.exit('Un portefeuille existe déjà (state.json). Supprimez-le pour recommencer.')
        save_state(new_state(a.capital)); print(f'Portefeuille fictif créé : {a.capital:,.2f}')
    else: {'run': cmd_run, 'status': cmd_status, 'replay': cmd_replay, 'selftest': cmd_selftest}[a.cmd](a)
