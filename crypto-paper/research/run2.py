from bt import *
btc, eth = load('btcusd'), load('ethusd')
S, E = pd.Timestamp('2015-01-01'), pd.Timestamp('2026-11-02')
cut = lambda s, a=S, b=E: s.loc[a:b]
CAND = dict(lookbacks=[20,50,100,200], target_vol=0.40, vol_win=30)

# 1) Découpage par période, réglages FIGÉS à l'avance
rows = {}
for name, a, b in [('2015-2020', '2015-01-01', '2020-12-31'), ('2021-2026', '2021-01-01', '2026-11-02'), ('2022-2026 (marché plus mature)', '2022-01-01', '2026-11-02'), ('Marché baissier 2018', '2018-01-01', '2018-12-31'), ('Marché baissier 2022', '2022-01-01', '2022-12-31')]:
    A, B = pd.Timestamp(a), pd.Timestamp(b)
    r, t, w = portfolio([btc, eth], 25, **CAND)
    rows[f'Candidate {name}'] = stats(cut(r, A, B), t, w)
    rows[f'  B&H BTC {name}'] = stats(cut(btc.close.pct_change(), A, B))
show(rows, '=== Par période (réglages fixés avant les tests) ===')

# 2) Grille de réglages : la candidate est-elle un pic de chance ?
LB = {'[100]': [100], '[50,200]': [50,200], '[20,50,100,200]': [20,50,100,200], '[10,20,50,100,150,200]': [10,20,50,100,150,200]}
grid = []
for (ln, lb), tv, vw in itertools.product(LB.items(), (0.30, 0.40, 0.60), (20, 30, 60)):
    r, t, w = portfolio([btc, eth], 25, lookbacks=lb, target_vol=tv, vol_win=vw)
    rr = cut(r); st = stats(rr)
    grid.append(dict(lb=ln, tv=tv, vw=vw, Sharpe=st['Sharpe'], Calmar=st['Calmar'], MaxDD=st['MaxDD'], CAGR=st['CAGR'], sr_d=rr.mean()/rr.std()))
G = pd.DataFrame(grid)
print(f'\n=== Grille : {len(G)} réglages testés ===')
print(f"Sharpe  min {G.Sharpe.min():.2f} | médiane {G.Sharpe.median():.2f} | max {G.Sharpe.max():.2f}   (acheter-garder BTC : 1.03)")
print(f"Calmar  min {G.Calmar.min():.2f} | médiane {G.Calmar.median():.2f} | max {G.Calmar.max():.2f}   (acheter-garder BTC : 0.70)")
print(f"MaxDD   pire {G.MaxDD.min():.1%} | médian {G.MaxDD.median():.1%} | meilleur {G.MaxDD.max():.1%}   (acheter-garder BTC : -83.4%)")
print(f"Réglages battant acheter-garder en Sharpe : {(G.Sharpe > 1.03).mean():.0%} | en Calmar : {(G.Calmar > 0.70).mean():.0%}")
print(G.groupby('lb')[['Sharpe','Calmar','MaxDD']].mean().round(2).to_string())
r, t, w = portfolio([btc, eth], 25, **CAND); rr = cut(r)
p, sr0 = dsr(rr, G.sr_d.values)
print(f"\nSharpe déflaté (DSR) pour {len(G)} essais : seuil de chance SR0 = {sr0:.2f} annualisé ; probabilité que le vrai Sharpe soit > 0 : {p:.1%}")

# 3) Walk-forward : chaque année, on choisit le meilleur réglage SUR LE PASSÉ UNIQUEMENT (Sharpe), puis on l'applique à l'année suivante
cache = {}
for (ln, lb), tv, vw in itertools.product(LB.items(), (0.30, 0.40, 0.60), (20, 30, 60)):
    cache[(ln, tv, vw)] = portfolio([btc, eth], 25, lookbacks=lb, target_vol=tv, vol_win=vw)[0]
oos, picks = [], {}
for y in range(2018, 2027):
    past = {k: v.loc['2015-01-01':f'{y-1}-12-31'] for k, v in cache.items()}
    best = max(past, key=lambda k: past[k].mean() / past[k].std())
    picks[y] = best; oos.append(cache[best].loc[f'{y}-01-01':f'{y}-12-31' if y < 2026 else '2026-11-02'])
oos = pd.concat(oos)
rows = {'Walk-forward (hors échantillon, 2018-2026)': stats(oos), 'Candidate fixe (même période)': stats(cache[('[20,50,100,200]', 0.4, 30)].loc['2018-01-01':E]),
        'Acheter-garder BTC (même période)': stats(btc.close.pct_change().loc['2018-01-01':E])}
show(rows, '=== Walk-forward : réglages choisis sur le passé seulement ===')
print('Réglages choisis par année :', {y: f'{k[0]} vol{k[1]:.0%}/{k[2]}j' for y, k in picks.items()})

# 4) Bootstrap par blocs : incertitude sur le Sharpe et probabilité de battre acheter-garder
rng = np.random.default_rng(7)
a = rr.values; b = btc.close.pct_change().loc[rr.index].values; n = len(a); blk = 30; res = []
for _ in range(2000):
    idx = np.concatenate([(s + np.arange(blk)) % n for s in rng.integers(0, n, n // blk + 1)])[:n]
    x, z = a[idx], b[idx]; res.append((x.mean()/x.std()*math.sqrt(D), z.mean()/z.std()*math.sqrt(D)))
res = np.array(res)
print(f"\nBootstrap (blocs de 30 j, 2000 tirages) : Sharpe candidate IC95 % [{np.percentile(res[:,0],2.5):.2f} ; {np.percentile(res[:,0],97.5):.2f}] | acheter-garder [{np.percentile(res[:,1],2.5):.2f} ; {np.percentile(res[:,1],97.5):.2f}]")
print(f"Probabilité que le Sharpe de la candidate dépasse celui d'acheter-garder : {(res[:,0] > res[:,1]).mean():.0%}")
