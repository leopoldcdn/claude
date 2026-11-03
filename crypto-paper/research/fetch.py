import json, time, sys, urllib.request, ssl, os, csv
ctx = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt')
def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'paper-trading-research/0.1'})
    with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
        return json.load(r)
def fetch(pair, start):
    rows, since = {}, start
    while True:
        d = get(f'https://www.bitstamp.net/api/v2/ohlc/{pair}/?step=86400&limit=1000&start={since}')['data']['ohlc']
        if not d: break
        new = 0
        for c in d:
            t = int(c['timestamp'])
            if t not in rows: rows[t] = c; new += 1
        last = int(d[-1]['timestamp'])
        if new == 0 or last <= since or last > time.time(): break
        since = last + 86400
        time.sleep(1.0)
    return [rows[t] for t in sorted(rows)]
for pair, start in [('btcusd', 1315872000), ('ethusd', 1502928000)]:
    data = fetch(pair, start)
    with open(f'{pair}_1d.csv', 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['ts','open','high','low','close','volume'])
        for c in data: w.writerow([c['timestamp'], c['open'], c['high'], c['low'], c['close'], c['volume']])
    print(pair, len(data), 'bougies', time.strftime('%Y-%m-%d', time.gmtime(int(data[0]['timestamp']))), '->', time.strftime('%Y-%m-%d', time.gmtime(int(data[-1]['timestamp']))))
