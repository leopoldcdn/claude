#!/usr/bin/env python3
"""Cree une bande son ORIGINALE (musique d'ambiance + bruitages) pour un mini-doc, par synthese (numpy), sans aucun son sous licence.
La voix n'est PAS synthetisee : elle est mixee ensuite (ajouter_sons.sh).
Usage : python3 sound.py plan.json musique.wav bruitages.wav [--seed 1]
  plan.json = sortie de plan_times.js  ({wipes:[...], cues:{...}, video_end})"""
import json, sys, wave, numpy as np
SR = 48000
plan = json.load(open(sys.argv[1])); out_music, out_fx = sys.argv[2], sys.argv[3]
seed = int(sys.argv[sys.argv.index("--seed") + 1]) if "--seed" in sys.argv else 1
rng = np.random.default_rng(seed)
dur = plan["video_end"] + 1.0; N = int(dur * SR); t = np.arange(N) / SR
midi = lambda m: 440.0 * 2 ** ((m - 69) / 12)

def lp(x, fc):          # filtre passe-bas simple (un pole)
    a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
def reverb(x, wet=0.28):  # reverb de Schroeder minimale (peignes + decalage stereo)
    L = np.zeros(len(x)); 
    for d, g in ((0.0297, .78), (0.0371, .74), (0.0411, .70), (0.0437, .66)):
        n = int(d * SR); y = x.copy()
        for i in range(n, len(x)): y[i] += g * y[i - n] * 0.5
        L += y
    return x * (1 - wet) + L / 4 * wet * 1.6

# ---------- musique : nappe douce + petites notes pincees (progression Am - F - C - G, 4 s par accord) ----------
CH = [([57, 60, 64], 45), ([53, 57, 60], 41), ([48, 52, 55], 36), ([55, 59, 62], 43)]
pad = np.zeros(N); SEG = 4.0
for k in range(int(dur / SEG) + 2):
    notes, bass = CH[k % 4]; s0 = k * SEG; env = np.clip(np.minimum((t - s0 + 1.2) / 1.6, (s0 + SEG + 1.2 - t) / 1.6), 0, 1)
    env = np.where((t > s0 - 1.2) & (t < s0 + SEG + 1.2), env, 0)
    if not env.any(): continue
    seg = np.zeros(N)
    for m in notes + [bass]:
        f = midi(m)
        for det in (-.07, 0, .07):
            ff = f * 2 ** (det / 12); seg += np.sin(2 * np.pi * ff * t + rng.random() * 6.28) + .35 * np.sin(4 * np.pi * ff * t + rng.random() * 6.28)
    pad += seg * env
pad = lp(pad, 900); pad /= np.max(np.abs(pad)) + 1e-9
pad *= 0.55 + 0.15 * np.sin(2 * np.pi * t / 11.0)                  # respiration lente
pluck = np.zeros(N); step = 0.75; pat = [0, 2, 1, 2, 0, 1, 2, 1]
for i, s0 in enumerate(np.arange(0.5, dur - 1.5, step)):
    notes, _ = CH[int(s0 // SEG) % 4]; m = notes[pat[i % len(pat)]] + 12 + (12 if i % 8 == 5 else 0)
    n = int(1.6 * SR); i0 = int(s0 * SR); tt = np.arange(min(n, N - i0)) / SR; f = midi(m)
    w = (np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt * 9)) * np.exp(-tt * 3.2) * (0.75 + 0.25 * rng.random())
    pluck[i0:i0 + len(tt)] += w
pluck /= np.max(np.abs(pluck)) + 1e-9
mono = pad * 0.8 + pluck * 0.32
mono = reverb(mono)
d = int(0.017 * SR); L = mono.copy(); Rr = np.roll(mono, d); Rr[:d] = 0
music = np.stack([L, Rr], 1); music /= np.max(np.abs(music)) + 1e-9
fade = np.clip(np.minimum(t / 2.0, (dur - t) / 2.5), 0, 1)[:, None]; music *= fade * 0.9

# ---------- bruitages : « woosh » a chaque balayage de papier, petites bulles/pops aux idees ----------
fx = np.zeros((N, 2))
def put(sig, t0, pan=0.0, gain=1.0):
    i0 = int(max(0, t0) * SR); n = min(len(sig), N - i0)
    if n <= 0: return
    fx[i0:i0 + n, 0] += sig[:n] * gain * (1 - max(0, pan)); fx[i0:i0 + n, 1] += sig[:n] * gain * (1 + min(0, pan))
def whoosh(d=0.62):
    n = int(d * SR); x = rng.standard_normal(n); u = np.linspace(0, 1, n)
    y = np.empty(n); s = 0.0; s2 = 0.0
    for i in range(n):                                              # passe-bas dont la coupure monte puis redescend
        fc = 250 + 4200 * np.sin(np.pi * u[i]) ** 1.5; a = 1 - np.exp(-2 * np.pi * fc / SR); s += a * (x[i] - s); s2 += a * (s - s2); y[i] = s2
    y *= np.sin(np.pi * u) ** 1.6; return y / (np.max(np.abs(y)) + 1e-9)
def pop(f0, d=0.16):
    n = int(d * SR); tt = np.arange(n) / SR; f = f0 * (1 + 0.5 * np.exp(-tt * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 28)
wipes = plan["wipes"]
for k, w in enumerate(wipes): put(whoosh(), w - 0.31, pan=(-.25 if k % 2 else .25), gain=0.55)
cues = sorted(plan["cues"].values()); last = -9
for k, c in enumerate(cues):
    if any(abs(c - w) < 0.45 for w in wipes) or c - last < 1.1: continue
    put(pop(520 + 90 * (k % 5)), c + 0.05, pan=((k % 3) - 1) * .3, gain=0.22); last = c
fx /= max(np.max(np.abs(fx)), 1e-9)
def save(p, a):
    a = np.clip(a, -1, 1); b = (a * 32767).astype("<i2").tobytes()
    with wave.open(p, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b)
save(out_music, music); save(out_fx, fx)
print("musique + bruitages : %.1f s, %d balayages, %d pops" % (dur, len(wipes), sum(1 for _ in cues)))
