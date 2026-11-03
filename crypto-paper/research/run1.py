from bt import *
btc, eth = load('btcusd'), load('ethusd')
print('BTC', btc.index[0].date(), '->', btc.index[-1].date(), len(btc), 'jours | trous :', (btc.index.to_series().diff().dt.days > 1).sum(), '| volumes nuls :', (btc.volume == 0).sum())
print('ETH', eth.index[0].date(), '->', eth.index[-1].date(), len(eth), 'jours | trous :', (eth.index.to_series().diff().dt.days > 1).sum(), '| volumes nuls :', (eth.volume == 0).sum())
print('rendements journaliers extrêmes BTC :', btc.close.pct_change().abs().nlargest(3).round(3).to_dict())
START, END = pd.Timestamp('2015-01-01'), pd.Timestamp('2026-11-02')
cut = lambda s: s.loc[START:END]
CAND = dict(lookbacks=[20,50,100,200], target_vol=0.40, vol_win=30)

rows = {}
rows['Acheter-garder BTC'] = stats(cut(btc.close.pct_change()))
rows['Acheter-garder BTC+ETH'] = stats(cut(bh([btc, eth])))
r, t, w = portfolio([btc], 25, **{**CAND, 'vt': False, 'lookbacks': [200]}); rows['BTC > SMA200 (tout ou rien)'] = stats(cut(r), t, w)
r, t, w = portfolio([btc, eth], 25, **{**CAND, 'vt': False}); rows['Tendance multi-horizons, sans cible vol'] = stats(cut(r), t, w)
r, t, w = portfolio([btc, eth], 25, **CAND); rows['CANDIDATE : tendance + cible vol 40 %'] = stats(cut(r), t, w)
show(rows, f'=== 2015-01-01 -> 2026-11-02 | coûts 25 pb par échange (0,25 %), sans levier, cash à 0 % ===')
r_c, t_c, w_c = r, t, w

# Par année
yr = pd.DataFrame({'Candidate': cut(r_c).groupby(cut(r_c).index.year).apply(lambda x: (1+x).prod()-1),
                   'BTC acheter-garder': cut(btc.close.pct_change()).groupby(cut(btc.close.pct_change()).index.year).apply(lambda x: (1+x).prod()-1)})
print('\nRendement par année :'); print(yr.map(lambda v: f'{v:+.0%}').to_string())

# Coûts et retard d'exécution
rows = {}
for cb in (10, 25, 50, 100):
    r, t, w = portfolio([btc, eth], cb, **CAND); rows[f'Coûts {cb} pb'] = stats(cut(r), t, w)
for d in (1, 2):
    r, t, w = portfolio([btc, eth], 25, delay=d, **CAND); rows[f'Exécution retardée de {d} jour(s)'] = stats(cut(r), t, w)
show(rows, '=== Sensibilité aux coûts et au retard ===')
