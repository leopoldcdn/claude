import numpy as np, pandas as pd, itertools, math
from statistics import NormalDist
N01 = NormalDist()
D = 365

def load(pair):
    df = pd.read_csv(f'{pair}_1d.csv')
    df['date'] = pd.to_datetime(df.ts, unit='s').dt.normalize()
    df = df.set_index('date')[['open','high','low','close','volume']].astype(float)
    df = df[df.index < pd.Timestamp('2026-11-03')]          # on retire la bougie du jour (incomplète)
    return df

def weights(c, lookbacks, target_vol, vol_win, band=0.10, vt=True):
    sig = sum((c > c.rolling(L).mean()).astype(float).where(c.rolling(L).mean().notna(), 0.0) for L in lookbacks) / len(lookbacks)
    rv = np.log(c).diff().rolling(vol_win).std() * math.sqrt(D)
    w = sig * (np.minimum(1.0, target_vol / rv) if vt else 1.0)
    w = w.fillna(0.0).clip(0, 1).values
    out = np.zeros_like(w); cur = 0.0
    for i, x in enumerate(w):                                  # hystérésis : on ne retouche la position que si l'écart > band
        if abs(x - cur) >= band or (x == 0 and cur != 0): cur = x
        out[i] = cur
    return pd.Series(out, index=c.index)

def run_asset(df, cost_bps, delay=0, **kw):
    c, o = df.close, df.open
    W = weights(c, **kw).shift(delay).fillna(0)                # W[t] décidé à la clôture t, exécuté à l'ouverture t+1
    w_prev2, w_prev1 = W.shift(2).fillna(0), W.shift(1).fillna(0)
    r = w_prev2 * (o / c.shift(1) - 1) + w_prev1 * (c / o - 1) - (cost_bps / 1e4) * (w_prev1 - w_prev2).abs()
    return r.iloc[2:], (w_prev1 - w_prev2).abs().iloc[2:], w_prev1.iloc[2:]

def portfolio(assets, cost_bps, delay=0, **kw):
    rs, ts, ws = [], [], []
    for df in assets:
        r, t, w = run_asset(df, cost_bps, delay, **kw); rs.append(r); ts.append(t); ws.append(w)
    R = pd.concat(rs, axis=1); T = pd.concat(ts, axis=1); Wt = pd.concat(ws, axis=1)
    return R.mean(axis=1), T.mean(axis=1), Wt.mean(axis=1)    # équipondéré sur les actifs existants ce jour-là

def bh(assets):
    return pd.concat([d.close.pct_change() for d in assets], axis=1).mean(axis=1)

def stats(r, turn=None, expo=None):
    r = r.dropna(); eq = (1 + r).cumprod(); n = len(r)
    cagr = eq.iloc[-1] ** (D / n) - 1; vol = r.std() * math.sqrt(D)
    dd = (eq / eq.cummax() - 1).min(); down = r[r < 0].std() * math.sqrt(D)
    s = dict(CAGR=cagr, Vol=vol, Sharpe=r.mean() / r.std() * math.sqrt(D), Sortino=r.mean() * D / down if down else np.nan,
             MaxDD=dd, Calmar=cagr / abs(dd) if dd else np.nan, Final=eq.iloc[-1])
    if turn is not None: s['Rot/an'] = turn.loc[r.index].sum() / n * D
    if expo is not None: s['Expo'] = expo.loc[r.index].mean()
    return s

def show(rows, title):
    df = pd.DataFrame(rows).T
    fm = {'CAGR':'{:.1%}','Vol':'{:.1%}','Sharpe':'{:.2f}','Sortino':'{:.2f}','MaxDD':'{:.1%}','Calmar':'{:.2f}','Final':'x{:.1f}','Rot/an':'{:.1f}','Expo':'{:.0%}'}
    print('\n' + title); print(df.apply(lambda c: c.map(lambda v: fm[c.name].format(v) if pd.notna(v) else '-')).to_string())

def dsr(r, trial_sharpes):
    """Deflated Sharpe Ratio (Bailey & López de Prado 2014), probabilité que le vrai Sharpe soit > 0 après N essais."""
    r = r.dropna(); T = len(r); sr = r.mean() / r.std()
    sk = ((r - r.mean())**3).mean() / r.std()**3; ku = ((r - r.mean())**4).mean() / r.std()**4
    N = len(trial_sharpes); g = 0.5772156649
    sr0 = np.std(trial_sharpes, ddof=1) * ((1 - g) * N01.inv_cdf(1 - 1/N) + g * N01.inv_cdf(1 - 1/(N * math.e)))
    z = (sr - sr0) * math.sqrt(T - 1) / math.sqrt(1 - sk * sr + (ku - 1) / 4 * sr**2)
    return N01.cdf(z), sr0 * math.sqrt(D)
