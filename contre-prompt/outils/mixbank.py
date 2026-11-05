#!/usr/bin/env python3
"""Prepare la bande son d'un mini-doc a partir de SONS DE BANQUE libres de droits (voir sons/SOURCES.md).
Ecrit musique.wav (piste prete, fondue, egalisee) et fx.wav (bruitages places sur la video).
Usage : python3 mixbank.py plan.json piste_musique.mp3 musique.wav fx.wav [--seed 3]
plan.json = sortie de plan_times.js ({wipes, cues, video_end, voice_end})."""
import json, sys, subprocess, wave, os, numpy as np
SR = 48000; HERE = os.path.dirname(os.path.abspath(__file__)); SFX = os.path.join(HERE, "sons", "sfx")
plan = json.load(open(sys.argv[1])); track, out_music, out_fx = sys.argv[2], sys.argv[3], sys.argv[4]
seed = int(sys.argv[sys.argv.index("--seed") + 1]) if "--seed" in sys.argv else 3
rng = np.random.default_rng(seed)
dur = plan["video_end"] + 0.5; N = int(dur * SR)

# ---- musique : coupee a la duree, fondu entree/sortie, un peu moins de mediums (la place de la voix), niveau cible -24 LUFS ----
fo = max(dur - 3.2, 1)
if track.endswith("none.mp3"):                            # option « sans musique » : piste muette, bruitages seuls
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=%d:cl=stereo" % SR, "-t", "%.2f" % dur, out_music], check=True)
else:
  subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", track, "-t", "%.2f" % dur, "-ac", "2", "-ar", str(SR),
    "-af", "equalizer=f=2200:t=q:w=0.9:g=-4,afade=t=in:d=1.5,afade=t=out:st=%.2f:d=3.2,loudnorm=I=-24:TP=-3:LRA=7" % fo, out_music], check=True)

# ---- bruitages ----
def load(name):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(SFX, name + ".mp3"), "-ac", "2", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, "<i2").astype(np.float64).reshape(-1, 2) / 32768
    a /= max(np.abs(a).max(), 1e-9); return a            # chaque son ramene a une crete de 0 dB
def peak_t(a): e = np.convolve(np.abs(a).mean(1), np.ones(1200) / 1200, "same"); return np.argmax(e) / SR
fx = np.zeros((N, 2))
def put(a, t_peak, gain_db, pan=0.0, tail=None):
    a = a.copy(); 
    if tail:
        a = a[: int(tail * SR)]; nf = min(len(a), int(.25 * SR)); a[-nf:] *= np.linspace(1, 0, nf)[:, None]
    i0 = int((t_peak - peak_t(a if not tail else a)) * SR); g = 10 ** (gain_db / 20)
    l, r = g * (1 - max(0, pan)), g * (1 + min(0, pan))
    s = max(0, -i0); e = min(len(a), N - i0)
    if e > s: fx[i0 + s:i0 + e, 0] += a[s:e, 0] * l; fx[i0 + s:i0 + e, 1] += a[s:e, 1] * r
WH = ["166", "1490", "175", "3115", "1492", "3161"]; TRIM = {"3161": -7}
ACC = ["2519", "3123", "2577", "2624"]   # TRIM : correction de niveau par son (le swoosh 3161 est tres plein, il est ramene au niveau des autres)
wipes = plan["wipes"]; whs = [load(n) for n in WH]; accs = [load(n) for n in ACC]
order = list(rng.permutation(len(WH)))
for k, w in enumerate(wipes):                           # un balayage de papier = un « woosh », jamais deux fois le meme de suite
    idx = order[k % len(order)]; put(whs[idx], w, -16 + TRIM.get(WH[idx], 0) + rng.uniform(-1.2, 1.2), pan=rng.uniform(-.25, .25), tail=1.6)
vend = plan.get("voice_end", plan["video_end"] - 1.5); cues = sorted(plan["cues"].values())
rev = [c for c in cues if 0.55 * vend <= c <= 0.80 * vend]
rev_t = min(rev, key=lambda c: abs(c - 0.667 * vend)) if rev else None
last = -9; n = 0
for c in cues:                                          # petits accents : rares (3,5 s mini), jamais sur un balayage ni sur la revelation
    if any(abs(c - w) < 0.6 for w in wipes) or (rev_t and abs(c - rev_t) < 1.5) or c - last < 3.5 or c < 1.0: continue
    put(accs[n % len(accs)], c + 0.06, -22 + rng.uniform(-1, 1), pan=rng.uniform(-.3, .3), tail=0.9); last = c; n += 1
if rev_t: put(load("2919"), rev_t, -14, tail=3.8)       # montee puis impact : la revelation
n_acc = n
def save(p, a):
    a = np.clip(a, -1, 1); b = (a * 32767).astype("<i2").tobytes()
    with wave.open(p, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b)
save(out_fx, fx)
print("%d balayages (%d sons differents), %d accents, revelation a %s" % (len(wipes), len(set(order[:len(wipes)])), n_acc, ("%.1f s" % rev_t) if rev_t else "—"))
