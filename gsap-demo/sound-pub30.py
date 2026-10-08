# Bande-son de pub-teamora-30s.html : musique et bruitages générés, calés sur la timeline GSAP.
# Usage : python3 sound-pub30.py sortie.wav
import sys, wave
import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
DUR = 30.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
mix = np.zeros((N, 2))
rev_send = np.zeros((N, 2))

def t_(d): return np.arange(int(SR * d)) / SR
def place(sig, start, gain=1.0, pan=0.0, rev=0.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(sig), 0] += sig * l; mix[i:i + len(sig), 1] += sig * r
    if rev: rev_send[i:i + len(sig), 0] += sig * l * rev; rev_send[i:i + len(sig), 1] += sig * r * rev
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def noise(d): return rng.standard_normal(int(SR * d))
def hz(n): return 440.0 * 2 ** ((n - 69) / 12)  # midi note -> Hz
def saw(f, d, partials=10):
    t = t_(d); s = np.zeros_like(t)
    for k in range(1, partials + 1):
        if f * k > SR / 2.2: break
        s += np.sin(2 * np.pi * f * k * t) / k
    return s

# ---------- instruments ----------
def kick(g=1.0):
    t = t_(0.4); f = 46 + 80 * np.exp(-t * 32); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 8) + 0.3 * np.exp(-t * 300) * lp(rng.standard_normal(len(t)), 4000)) * g
def clap():
    t = t_(0.25); n = bp(noise(0.25), 900, 5000) * (np.exp(-t * 22) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) * 30) * (t > 0.012))
    return n * 0.5 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.3
def hat(o=False):
    d = 0.18 if o else 0.05; t = t_(d); return hp(noise(d), 7000) * np.exp(-t * (14 if o else 70)) * 0.35
def pluck(f, d=0.35):
    t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)) * np.exp(-t * 11)
def bass(f, d=0.24):
    t = t_(d); return lp(saw(f, d, 8), 700) * np.minimum(1, t * 200) * np.exp(-t * 4)
def pad(notes, d, cutoff=1800):
    t = t_(d); s = np.zeros_like(t)
    for n in notes:
        for det in (-0.08, 0, 0.08):
            s += saw(hz(n + det), d, 7)
    s = lp(s / (3 * len(notes)), cutoff)
    env = np.minimum(1, t / 0.25) * np.minimum(1, (d - t) / 0.3)
    return s * np.clip(env, 0, 1)
def ping(f):
    t = t_(0.28); return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t * 16) * np.minimum(1, t * 400)
def ding(f):
    t = t_(0.9); return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.01 * t) + 0.15 * np.sin(2 * np.pi * f * 3 * t)) * np.exp(-t * 5) * np.minimum(1, t * 500)
def whoosh(d=0.5, lo=400, hi=5000, up=True):
    n = noise(d); t = t_(d); out = np.zeros_like(n); seg = 512
    for i in range(0, len(n), seg):
        p = i / len(n); fc = lo + (hi - lo) * (p if up else 1 - p)
        out[i:i + seg] = bp(n[max(0, i - 2048):i + seg], fc * 0.6, min(fc * 1.6, SR / 2.3))[-len(n[i:i + seg]):]
    return out * np.sin(np.pi * t / d) ** 2 * 0.6
def pop():
    t = t_(0.08); f = 900 - 500 * t / 0.08; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 50)

# ---------- 0 → 3.55 : the flood ----------
NRQ, RQ0, RQ1 = 60, 0.15, 3.35
notes = [79, 84, 76, 81, 86, 83]
for k in range(NRQ):
    at = RQ0 + (RQ1 - RQ0) * np.sqrt(k / NRQ)
    place(ping(hz(notes[k % len(notes)])), at, 0.10 + 0.10 * k / NRQ, pan=rng.uniform(-0.8, 0.8), rev=0.15)
# heartbeat, faster and faster
t = 0.35
while t < 3.35:
    p = t / 3.35; place(lp(kick(), 300), t, 0.35 + 0.35 * p); place(lp(kick(), 300), t + 0.14, 0.2 + 0.2 * p); t += 0.75 - 0.5 * p
# riser : noise + rising tone
d = 3.2; tt = t_(d); f = 180 * (8 ** (tt / d))
riser = (lp(noise(d), 2500) * 0.25 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.35) * (tt / d) ** 2.2
place(riser, 0.25, 0.55, rev=0.2)
# the drop falls (whistle) — then silence before the impact
tt = t_(0.5); f = 1700 - 900 * tt / 0.5
place(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, tt * 8) * 0.25, 3.03, 0.6, rev=0.3)

# ---------- 3.55 : impact ----------
tt = t_(1.6); boom = np.sin(2 * np.pi * (38 + 40 * np.exp(-tt * 6)) * tt) * np.exp(-tt * 2.6)
place(boom, 3.55, 1.0)
place(lp(noise(0.6), 3000) * np.exp(-t_(0.6) * 9), 3.55, 0.5, rev=0.5)
for k, (f0, dl) in enumerate([(700, 0), (520, 0.07), (900, 0.16)]):
    tt = t_(0.18); f = f0 * np.exp(-tt * 9); place(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14), 3.55 + dl, 0.5, pan=(k - 1) * 0.4, rev=0.4)
place(pad([60, 64, 67, 72, 76], 1.2, 3000), 3.65, 0.35, rev=0.6)        # shimmer as the wave spreads
place(whoosh(0.5, 3000, 300, up=False), 4.05, 0.5)                       # everything is drawn into the hub
place(ding(hz(84)), 4.55, 0.35, rev=0.4); place(ding(hz(91)), 4.7, 0.25, rev=0.4)

# ---------- 4.55 → 27.15 : the groove (120 BPM) ----------
BEAT, T0, T1 = 0.5, 4.55, 27.15
prog = [[53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67], [57, 60, 64, 69]]   # F C G Am
roots = [41, 36, 43, 45]
duck = np.ones(N)
b = 0
while T0 + b * BEAT < T1 - 0.01:
    tb = T0 + b * BEAT; bar = b // 4; beat = b % 4; chord = prog[bar % 4]
    if tb >= 5.05:
        place(kick(), tb, 0.9)
        i = int(tb * SR); L = int(0.3 * SR); duck[i:i + L] = np.minimum(duck[i:i + L], 1 - 0.55 * np.exp(-np.arange(min(L, N - i)) / SR * 9))
    if tb >= 6.8 and beat in (1, 3): place(clap(), tb, 0.55, rev=0.25)
    if tb >= 6.8: place(hat(), tb + 0.25, 0.8, pan=0.3); place(hat(), tb, 0.35, pan=-0.3)
    if tb >= 5.05:
        for e in (0, 0.25): place(bass(hz(roots[bar % 4] + (12 if e else 0))), tb + e, 0.55)
    if beat == 0: place(pad(chord, 2.0), tb, 0.32, rev=0.35)
    if 11.65 <= tb < 24.5:
        for s in range(4):
            place(pluck(hz(chord[(beat * 4 + s) % 4] + 24)), tb + s * 0.125, 0.12, pan=0.5 * np.sin(b + s), rev=0.3)
    b += 1
mix[:, 0] *= duck; mix[:, 1] *= duck   # sidechain everything placed so far except what follows

# transitions, validations, captions
for tw in (6.35, 11.45, 16.35, 21.2, 24.5): place(whoosh(0.55, 300, 6000), tw - 0.2, 0.55)
for td, n in ((8.95, 88), (10.95, 91), (14.85, 88), (15.7, 91), (20.6, 93), (25.55, 86)): place(ding(hz(n)), td, 0.3, rev=0.35)
for tp in (7.1, 12.0, 16.9, 21.7, 24.75): place(pop(), tp, 0.25)
for k, tk in enumerate([17.3, 18.1, 19.1, 19.85]): place(pluck(hz(76 + k * 3)), tk, 0.25, rev=0.3)
for k in range(16): place(pluck(hz(72 + (k % 8) * 2)), 22.1 + k * 0.1, 0.10, rev=0.2)   # headcount climbing

# ---------- 27.15 → 30 : signature ----------
place(kick(1.2), 27.15, 0.9)
place(pad([48, 55, 60, 64, 67, 72], 2.8, 2600), 27.15, 0.5, rev=0.6)
place(bass(hz(36), 1.5), 27.15, 0.7)
for k, n in enumerate([84, 88, 91, 96]): place(ding(hz(n)), 27.15 + k * 0.07, 0.28, rev=0.5)
place(pop(), 28.05, 0.4); place(ding(hz(96)), 28.1, 0.2, rev=0.5)

# ---------- reverb send + master ----------
ir_t = t_(1.6); ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t * 3.2)[:, None]
for c in range(2):
    w = np.fft.irfft(np.fft.rfft(rev_send[:, c], N + len(ir_t)) * np.fft.rfft(ir[:, c], N + len(ir_t)))[:N]
    mix[:, c] += lp(w, 6000) * 0.012
fade = np.ones(N); fl = int(1.2 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 1.5
mix *= fade[:, None]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix /= np.max(np.abs(mix)) / 0.89
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'pub-teamora-30s.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
