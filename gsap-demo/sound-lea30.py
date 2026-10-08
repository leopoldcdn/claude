# Bande-son de pub-lea-30s.html (« La vie de Léa ») : musique et bruitages générés, calés sur la timeline GSAP.
# Usage : python3 sound-lea30.py sortie.wav
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

# ---------- timeline (same values as pub-lea-30s.html) ----------
DURS = [2.1, 2.2, 2.2, 0.3, 2.1, 2.0, 2.0, 0.3, 2.1, 2.2, 0.3, 2.3]   # 0.3 = rubric ticked without a card
START = list(np.cumsum([4.45] + DURS[:-1])); B = START[-1] + DURS[-1]; E = B + 2.4

# ---------- 0 → 4.55 : hook, Léa appears ----------
place(ping(hz(84)), 0.15, 0.35, rev=0.3); place(ping(hz(88)), 0.27, 0.25, rev=0.3)
for k, n in enumerate([72, 76, 79]): place(pluck(hz(n), 1.2), 0.75 + k * 0.12, 0.35, rev=0.5)
place(pad([60, 64, 67, 71], 3.6, 1400), 0.8, 0.22, rev=0.5)
for tp in (0.9, 2.05): place(pop(), tp, 0.22)
place(whoosh(0.5, 400, 4000), 3.2, 0.4)
place(ding(hz(84)), 3.5, 0.3, rev=0.5)
for k in range(12): place(pluck(hz(72 + [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19][k]), 0.4), 3.85 + k * 0.035, 0.12, pan=np.sin(k), rev=0.4)

# ---------- 4.55 → B : warm groove, one tick per moment, one rising note per year ----------
BEAT, T0 = 0.5, 4.55
prog = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67]]   # Am F C G
roots = [45, 41, 36, 43]
duck = np.ones(N); b = 0
while T0 + b * BEAT < B - 0.01:
    tb = T0 + b * BEAT; bar = b // 4; beat = b % 4; chord = prog[bar % 4]
    place(kick(0.8), tb, 0.75)
    i = int(tb * SR); L = int(0.3 * SR); duck[i:i + L] = np.minimum(duck[i:i + L], 1 - 0.45 * np.exp(-np.arange(min(L, N - i)) / SR * 9))
    if beat in (1, 3) and tb > 6.0: place(clap(), tb, 0.35, rev=0.3)
    place(hat(), tb + 0.25, 0.6, pan=0.3)
    place(bass(hz(roots[bar % 4])), tb, 0.5); place(bass(hz(roots[bar % 4] + 12)), tb + 0.25, 0.3)
    if beat == 0: place(pad(chord, 2.0, 1500), tb, 0.3, rev=0.4)
    for s in range(2): place(pluck(hz(chord[(beat * 2 + s) % 4] + 12), 0.5), tb + s * 0.25, 0.13, pan=0.4 * np.sin(b + s), rev=0.35)
    b += 1
mix[:, 0] *= duck; mix[:, 1] *= duck
scale = [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96, 98]
for k, s in enumerate(START):
    place(whoosh(0.3, 800, 5000), s - 0.1, 0.22 if DURS[k] > 1 else 0.12)   # the hand moves on
    place(ding(hz(scale[k])), s + 0.18, 0.22 if DURS[k] > 1 else 0.13, rev=0.45)   # a new step, a higher note
key = {1: (0.8, 91), 5: (0.25, 93), 8: (0.3, 96), 9: (0.3, 88), 11: (0.3, 98)}
for k, (dt, n) in key.items():
    place(ding(hz(n)), START[k] + dt, 0.3, rev=0.5); place(ding(hz(n + 7)), START[k] + dt + 0.08, 0.18, rev=0.5)
for k in range(10): place(pop(), START[11] + 0.3 + k * 0.05, 0.12, pan=np.sin(k * 2))   # confetti

# ---------- B → E : the loop closes, Léa comes back ----------
place(whoosh(0.6, 6000, 400, up=False), B - 0.05, 0.5)
place(pad([45, 52, 57, 60, 64, 69], 2.4, 2400), B + 0.2, 0.45, rev=0.7)
for k, n in enumerate([81, 84, 88, 91]): place(ding(hz(n)), B + 0.4 + k * 0.12, 0.22, rev=0.6)

# ---------- E → 30 : signature ----------
place(kick(1.1), E, 0.8)
place(pad([48, 55, 60, 64, 67, 72], 3.0, 2600), E, 0.5, rev=0.6)
place(bass(hz(36), 1.5), E, 0.6)
for k, n in enumerate([84, 88, 91, 96]): place(ding(hz(n)), E + 0.6 + k * 0.07, 0.26, rev=0.5)
place(pop(), E + 1.4, 0.35); place(ding(hz(96)), E + 1.45, 0.18, rev=0.5)

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
