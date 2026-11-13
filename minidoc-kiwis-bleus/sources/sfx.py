"""Piste de bruitages, entièrement synthétisée (aucun son importé).
usage : python3 sfx.py info.json sortie.wav"""
import sys, json, wave
import numpy as np
SR = 48000
d = json.load(open(sys.argv[1]))
dur = d['info']['DUR']
out = np.zeros(int(SR * (dur + 0.5)))
rng = np.random.default_rng(11)

def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))
def env_exp(n, tau): return np.exp(-np.arange(n) / (tau * SR))
def tone(f0, f1, dur_s, tau):
    n = int(dur_s * SR); f = np.linspace(f0, f1, n); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env_exp(n, tau)
def noise(dur_s, lo, hi, tau):
    n = int(dur_s * SR); return band(rng.normal(0, 1, n), lo, hi) * env_exp(n, tau)

def make(kind):
    if kind == 'whoosh':
        n = int(0.3 * SR); e = np.sin(np.linspace(0, np.pi, n)) ** 2
        return band(rng.normal(0, 1, n), 350, 3200) * e * 0.5
    if kind == 'paper':
        n = int(0.24 * SR); e = np.sin(np.linspace(0, np.pi, n)) ** 1.5 * (0.6 + 0.4 * rng.random(n // 400 + 1).repeat(400)[:n])
        return band(rng.normal(0, 1, n), 1800, 9000) * e * 0.45
    if kind == 'pop': return tone(420, 980, 0.09, 0.03) * 0.5
    if kind == 'tap': return (tone(1300, 900, 0.04, 0.01) * 0.3 + np.pad(noise(0.02, 2000, 8000, 0.005), (0, int(0.02 * SR))) * 0.25)
    if kind == 'tick': return tone(2100, 2000, 0.03, 0.006) * 0.28
    if kind == 'stamp':
        a = tone(130, 52, 0.22, 0.06) * 0.9; b = noise(0.06, 500, 5000, 0.012) * 0.45
        a[:len(b)] += b; return a
    if kind == 'thud':
        a = tone(95, 38, 0.36, 0.1) * 1.0; b = noise(0.05, 200, 2500, 0.015) * 0.3
        a[:len(b)] += b; return a
    if kind == 'ding': return (tone(1318, 1318, 0.9, 0.22) + 0.4 * tone(2637, 2637, 0.9, 0.12)) * 0.22
    if kind == 'rise':
        n = int(0.9 * SR); x = tone(190, 620, 0.9, 5) * np.sin(np.linspace(0, np.pi, n)) ** 0.7
        return x * (0.75 + 0.25 * np.sin(2 * np.pi * 14 * np.arange(n) / SR)) * 0.2
    if kind == 'alarm':
        n = int(0.3 * SR); e = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (0.02 * SR))
        a = np.sin(2 * np.pi * 880 * np.arange(n) / SR) * e; b = np.sin(2 * np.pi * 660 * np.arange(n) / SR) * e
        return np.concatenate([a, b, a, b]) * 0.13
    raise ValueError(kind)

for ev in d['sfx']:
    x = make(ev['type']) * ev.get('g', 1)
    i = int(ev['t'] * SR)
    if i < 0 or i >= len(out): continue
    x = x[:len(out) - i]; out[i:i + len(x)] += x
out = out[:int(SR * dur)]
peak = np.max(np.abs(out)); out = out / peak * 0.5  # crête à -6 dBFS : la voix passera au-dessus
st = np.stack([out, out], 1)
w = wave.open(sys.argv[2], 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st * 32767).astype('<i2').tobytes()); w.close()
print('ok', len(d['sfx']), 'bruitages', round(dur, 2), 's')
