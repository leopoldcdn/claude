"""Stratégie : suivi de tendance long-seulement, multi-horizons, taille de position ajustée à la volatilité.
Paramètres fixés à partir de la littérature AVANT les tests (voir RESEARCH.md)."""
import math
import numpy as np, pandas as pd

PARAMS = dict(lookbacks=[20, 50, 100, 200], target_vol=0.40, vol_win=30, band=0.10)
D = 365

def target_weights(df, p=PARAMS):
    """Poids cible (0..1) décidé à la CLÔTURE de chaque jour. N'utilise que des données passées."""
    c = df.close
    sig = sum((c > c.rolling(L).mean()).astype(float).where(c.rolling(L).mean().notna(), 0.0) for L in p['lookbacks']) / len(p['lookbacks'])
    rv = np.log(c).diff().rolling(p['vol_win']).std() * math.sqrt(D)
    w = (sig * np.minimum(1.0, p['target_vol'] / rv)).fillna(0.0).clip(0, 1).values
    out, cur = np.zeros_like(w), 0.0
    for i, x in enumerate(w):                       # hystérésis : évite de trader pour de petites variations
        if abs(x - cur) >= p['band'] or (x == 0 and cur != 0): cur = x
        out[i] = cur
    return pd.Series(out, index=c.index)
