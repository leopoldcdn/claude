# Bande-son électro de pub-lea-30s.html (« La vie de Léa ») : 128 BPM, sidechain, montées et drops calés sur la timeline GSAP.
# Usage : python3 sound-lea30.py sortie.wav
import sys, wave
import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
DUR = 30.0
N = int(SR * DUR)
rng = np.random.default_rng(11)
music = np.zeros((N, 2))   # ducked by the kick (sidechain)
dry = np.zeros((N, 2))     # kick and effects, not ducked
rev_send = np.zeros((N, 2))

def t_(d): return np.arange(int(SR * d)) / SR
def place(sig, start, gain=1.0, pan=0.0, rev=0.0, bus='music'):
    i = int(round(start * SR))
    if i >= N or i < 0: return
    sig = sig[: N - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    out = music if bus == 'music' else dry
    out[i:i + len(sig), 0] += sig * l; out[i:i + len(sig), 1] += sig * r
    if rev: rev_send[i:i + len(sig), 0] += sig * l * rev; rev_send[i:i + len(sig), 1] += sig * r * rev
def lp(x, f, o=2): return sosfilt(butter(o, min(f, SR / 2.2), 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, min(hi, SR / 2.2)], 'band', fs=SR, output='sos'), x)
def noise(d): return rng.standard_normal(int(SR * d))
def hz(n): return 440.0 * 2 ** ((n - 69) / 12)
def saw(f, d, partials=24):
    t = t_(d); s = np.zeros_like(t)
    for k in range(1, partials + 1):
        if f * k > SR / 2.3: break
        s += np.sin(2 * np.pi * f * k * t + k) / k
    return s
def square(f, d, partials=15):
    t = t_(d); s = np.zeros_like(t)
    for k in range(1, partials + 1, 2):
        if f * k > SR / 2.3: break
        s += np.sin(2 * np.pi * f * k * t) / k
    return s
def adsr(d, a=0.005, dec=0.1, s=0.6, r=0.05):
    t = t_(d); e = np.where(t < a, t / a, s + (1 - s) * np.exp(-(t - a) / dec))
    return e * np.clip((d - t) / r, 0, 1)

# ---------- instruments ----------
def kick(g=1.0):
    t = t_(0.42); f = 48 + 150 * np.exp(-t * 38); ph = 2 * np.pi * np.cumsum(f) / SR
    k = np.sin(ph) * np.exp(-t * 7.5) + 0.25 * lp(rng.standard_normal(len(t)), 5000) * np.exp(-t * 250)
    return np.tanh(k * 1.8) * g
def clap():
    t = t_(0.3); env = sum(np.exp(-np.maximum(t - o, 0) * 40) * (t >= o) for o in (0, 0.011, 0.022)) + 0.4 * np.exp(-t * 9)
    return bp(noise(0.3), 1000, 6000) * env * 0.45
def snare(pitch=1.0):
    t = t_(0.18); return (bp(noise(0.18), 1500, 8000) * 0.5 + np.sin(2 * np.pi * 200 * pitch * t) * 0.4) * np.exp(-t * 22)
def hat(open_=False):
    d = 0.16 if open_ else 0.04; t = t_(d); return hp(noise(d), 8000) * np.exp(-t * (16 if open_ else 90)) * 0.4
def bassn(f, d):
    return lp(saw(f, d, 12), 900) * adsr(d, 0.003, 0.08, 0.5, 0.02) + np.sin(2 * np.pi * f * t_(d)) * adsr(d, 0.003, 0.15, 0.8, 0.02) * 0.6
def supersaw(notes, d, cut=3500):
    s = np.zeros(int(SR * d))
    for n in notes:
        for det in (-0.12, -0.05, 0, 0.05, 0.12):
            s += saw(hz(n + det), d, 16)
    return lp(s / (5 * len(notes)), cut) * adsr(d, 0.004, 0.09, 0.35, 0.03)
def padsaw(notes, d, cut=1600):
    s = np.zeros(int(SR * d))
    for n in notes:
        for det in (-0.1, 0, 0.1):
            s += saw(hz(n + det), d, 10)
    t = t_(d); return lp(s / (3 * len(notes)), cut) * np.clip(t / 0.4, 0, 1) * np.clip((d - t) / 0.3, 0, 1)
def lead(f, d, cut=4500): return lp(square(f, d), cut) * adsr(d, 0.002, 0.06, 0.3, 0.02)
def bell(f):
    t = t_(0.8); return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.01 * t) + 0.2 * np.sin(2 * np.pi * f * 3.98 * t)) * np.exp(-t * 6) * np.minimum(1, t * 600)
def sweep(d, lo, hi, up=True):
    n = noise(d); out = np.zeros_like(n); seg = 512
    for i in range(0, len(n), seg):
        p = i / len(n); fc = lo * (hi / lo) ** (p if up else 1 - p)
        out[i:i + seg] = bp(n[max(0, i - 2048):i + seg], fc * 0.7, fc * 1.5)[-len(n[i:i + seg]):]
    t = t_(d); return out * (t / d if up else 1 - t / d) ** 1.5
def zap():
    t = t_(0.14); f = 2400 * np.exp(-t * 28) + 120; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 16)
def impact():
    t = t_(1.4); boom = np.sin(2 * np.pi * (36 + 70 * np.exp(-t * 9)) * t) * np.exp(-t * 2.4)
    return np.tanh((boom + 0.5 * lp(noise(1.4), 2500) * np.exp(-t * 7)) * 1.5)

# ---------- timeline (same values as pub-lea-30s.html) ----------
DURS = [2.1, 2.2, 2.2, 0.3, 2.1, 2.0, 2.0, 0.3, 2.1, 2.2, 0.3, 2.3]   # 0.3 = rubric ticked without a card
START = list(np.cumsum([4.45] + DURS[:-1])); B = START[-1] + DURS[-1]; E = B + 2.4
BPM = 128; BEAT = 60 / BPM; BAR = 4 * BEAT
DROP1 = 4.45                                   # the wheel opens
GRID0 = DROP1 - 8 * BEAT                       # intro grid, so that the drop lands on a downbeat
PROG = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]   # Am F C G
ROOT = [33, 29, 36, 31]

# ---------- intro (0 → 4.45) : filtered beat, build-up, snare roll ----------
place(bell(hz(88)), 0.15, 0.3, rev=0.5); place(bell(hz(95)), 0.27, 0.2, rev=0.5)       # new application ping
for b in range(8):
    tb = GRID0 + b * BEAT
    place(lp(kick(), 400 + 220 * b), tb, 0.55 + 0.04 * b, bus='dry')
    place(hat(), tb + BEAT / 2, 0.25 + 0.05 * b, pan=0.3)
    chord = PROG[(b // 4) % 4]
    for s in range(4):
        place(lead(hz(chord[s % 3] + 24), BEAT / 4, 900 + 500 * b), tb + s * BEAT / 4, 0.10 + 0.012 * b, pan=0.35 * np.sin(b * 4 + s), rev=0.3)
place(padsaw([57, 60, 64, 69], 4.3, 900), 0.1, 0.25, rev=0.5)
# snare roll : 8ths → 16ths → 32nds, rising
t, step = DROP1 - 4 * BEAT, BEAT / 2
while t < DROP1 - 0.02:
    p = 1 - (DROP1 - t) / (4 * BEAT); place(snare(1 + p * 0.8), t, 0.18 + 0.4 * p, rev=0.2)
    t += step; step = BEAT / 2 if p < 0.5 else BEAT / 4 if p < 0.8 else BEAT / 8
place(sweep(3.2, 300, 9000, up=True), DROP1 - 3.2, 0.45, rev=0.3)
tt = t_(2.0); place(np.sin(2 * np.pi * np.cumsum(220 * 4 ** (tt / 2.0)) / SR) * (tt / 2.0) ** 2 * 0.3, DROP1 - 2.0, 1.0)
for tp in (0.9, 2.05): place(zap(), tp, 0.18, bus='dry')

# ---------- drops : full groove from the wheel to the end card ----------
def groove(t0, t1, intensity=1.0, build_end=None):
    b = 0
    while t0 + b * BEAT < t1 - 0.01:
        tb = t0 + b * BEAT; bar = b // 4; beat = b % 4; ci = bar % 4; chord = PROG[ci]
        place(kick(), tb, 0.95, bus='dry')
        if beat in (1, 3): place(clap(), tb, 0.6 * intensity, rev=0.15)
        place(hat(True), tb + BEAT / 2, 0.55 * intensity, pan=0.25)
        for s in (1, 3): place(hat(), tb + s * BEAT / 4, 0.35 * intensity, pan=-0.3)
        for s in (1, 2, 3):                                     # rolling bass between the kicks
            place(bassn(hz(ROOT[ci] + (12 if s == 2 else 0)), BEAT / 4 * 0.9), tb + s * BEAT / 4, 0.6)
        place(supersaw([n + 12 for n in chord], BEAT / 2 * 0.8), tb + BEAT / 2, 0.42 * intensity, rev=0.2)   # off-beat stabs
        arp = [chord[0], chord[1], chord[2], chord[1] + 12]
        for s in range(4):
            place(lead(hz(arp[(beat + s) % 4] + 24), BEAT / 4 * 0.9), tb + s * BEAT / 4, 0.09 * intensity, pan=0.45 * np.sin(b + s), rev=0.25)
        b += 1
groove(DROP1, B - 2 * BEAT, 1.0)
# second build before Léa comes back
t, step = B - 2 * BEAT, BEAT / 4
while t < B - 0.02:
    p = 1 - (B - t) / (2 * BEAT); place(snare(1.2 + p), t, 0.5 + 0.6 * p, rev=0.2); t += step if p < 0.5 else BEAT / 8
place(sweep(1.2, 500, 10000, up=True), B - 1.2, 0.8)
for b in range(2): place(lp(kick(), 600), B - 2 * BEAT + b * BEAT, 0.7, bus='dry')
groove(B, E, 1.3)
place(padsaw([57, 60, 64, 69, 72], E - B, 2400), B, 0.35, rev=0.5)

# ---------- effects on the picture ----------
place(impact(), DROP1, 0.9, bus='dry'); place(sweep(1.0, 9000, 200, up=False), DROP1, 0.35, rev=0.4)
scale = [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96, 98]
for k, s in enumerate(START):
    place(zap(), s - 0.03, 0.16 if DURS[k] > 1 else 0.1, bus='dry')
    place(bell(hz(scale[k])), s + 0.18, 0.16 if DURS[k] > 1 else 0.1, rev=0.4)
for k, (dt, n) in {1: (0.8, 91), 5: (0.25, 93), 8: (0.3, 96), 9: (0.3, 88), 11: (0.3, 98)}.items():
    place(bell(hz(n)), START[k] + dt, 0.22, rev=0.5); place(bell(hz(n + 7)), START[k] + dt + 0.07, 0.14, rev=0.5)
place(impact(), B, 0.9, bus='dry')

# ---------- end card : last hit, chord, tail ----------
place(impact(), E, 1.0, bus='dry'); place(kick(1.2), E, 0.9, bus='dry')
place(supersaw([45, 57, 60, 64, 69], 2.6, 5000) * np.exp(-t_(2.6) * 1.1), E, 0.5, rev=0.7)
place(padsaw([57, 60, 64, 69, 76], 3.0, 2600), E, 0.35, rev=0.6)
for k, n in enumerate([84, 88, 91, 96]): place(bell(hz(n)), E + 0.6 + k * 0.07, 0.2, rev=0.5)
for b in range(5): place(hat(), E + 1.0 + b * BEAT, 0.2 - 0.03 * b, pan=0.3)
place(zap(), E + 1.4, 0.2, bus='dry')

# ---------- sidechain, reverb, master ----------
duck = np.ones(N); kt = []
x = GRID0
while x < E + 0.01: kt.append(x); x += BEAT
for tk in kt:
    i = int(tk * SR); L = int(BEAT * SR)
    if i >= N: break
    seg = np.arange(min(L, N - i)) / SR
    depth = 0.25 if tk < DROP1 else 0.7
    duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], 1 - depth * np.exp(-seg * 11))
music *= duck[:, None]
mix = music + dry
ir_t = t_(1.4); ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t * 3.6)[:, None]
for c in range(2):
    w = np.fft.irfft(np.fft.rfft(rev_send[:, c], N + len(ir_t)) * np.fft.rfft(ir[:, c], N + len(ir_t)))[:N]
    mix[:, c] += lp(hp(w, 300), 7000) * 0.012 * duck
fade = np.ones(N); fl = int(1.0 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 1.5
mix *= fade[:, None]
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
mix /= np.max(np.abs(mix)) / 0.89
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'pub-lea-30s.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok')
