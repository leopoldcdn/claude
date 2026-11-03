"""Données de marché PUBLIQUES (aucune clé API) : bougies journalières Bitstamp, mises en cache en local."""
import csv, json, os, ssl, time, urllib.request
import pandas as pd

PAIRS = {'BTC': 'btcusd', 'ETH': 'ethusd'}
FIRST_TS = {'btcusd': 1315872000, 'ethusd': 1502928000}
DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
os.makedirs(DIR, exist_ok=True)

def _get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'crypto-paper-trading/0.1'})
    ctx = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE')) if os.environ.get('SSL_CERT_FILE') else ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
        return json.load(r)

def _path(pair): return os.path.join(DIR, f'{pair}_1d.csv')

def update(pair):
    """Télécharge seulement les jours manquants (1 requête/s max, bien en dessous des limites publiques)."""
    rows = {}
    if os.path.exists(_path(pair)):
        with open(_path(pair)) as f:
            for r in csv.DictReader(f): rows[int(r['ts'])] = r
    since = (max(rows) - 86400) if rows else FIRST_TS[pair]       # on rechargera aussi la dernière bougie (incomplète la veille)
    while True:
        d = _get(f'https://www.bitstamp.net/api/v2/ohlc/{pair}/?step=86400&limit=1000&start={since}')['data']['ohlc']
        if not d: break
        for c in d: rows[int(c['timestamp'])] = {'ts': c['timestamp'], 'open': c['open'], 'high': c['high'], 'low': c['low'], 'close': c['close'], 'volume': c['volume']}
        last = int(d[-1]['timestamp'])
        if last <= since or last >= time.time() - 86400: break
        since = last + 86400
        time.sleep(1.0)
    with open(_path(pair), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['ts', 'open', 'high', 'low', 'close', 'volume'])
        for t in sorted(rows): w.writerow([rows[t][k] for k in ('ts', 'open', 'high', 'low', 'close', 'volume')])

def load(pair, include_today=False):
    if not os.path.exists(_path(pair)):
        print(f'Premier lancement : téléchargement de l\'historique {pair} (environ 1 minute)...', flush=True)
        update(pair)
    df = pd.read_csv(_path(pair))
    df['date'] = pd.to_datetime(df.ts, unit='s').dt.normalize()
    df = df.set_index('date')[['open', 'high', 'low', 'close', 'volume']].astype(float)
    today = pd.Timestamp.now('UTC').tz_localize(None).normalize()
    return df if include_today else df[df.index < today]       # par défaut : bougies COMPLÈTES uniquement
