import numpy as np, wave
SR=44100; BPM=128; B=60/BPM; NB=43; T=NB*B
n=int(SR*T); out=np.zeros(n); rng=np.random.default_rng(1)
def add(x,t0,g=1.0):
    i=int(t0*SR); j=min(n,i+len(x))
    if i<n: out[i:j]+=x[:j-i]*g
def env(l,a=0.002,d=0.1):
    t=np.arange(l)/SR; return np.minimum(t/a,1)*np.exp(-t/d)
def kick():
    l=int(SR*0.35); t=np.arange(l)/SR
    f=45+110*np.exp(-t*30); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t*9)+0.3*np.sin(2*ph)*np.exp(-t*25)
def hat(o=False):
    l=int(SR*(0.12 if o else 0.04)); x=rng.standard_normal(l); x=np.diff(x,prepend=0)
    return x*np.exp(-np.arange(l)/SR/(0.04 if o else 0.012))*0.5
def clap():
    l=int(SR*0.18); x=rng.standard_normal(l)*np.exp(-np.arange(l)/SR/0.05); return x*0.6
def saw(f,l,det=(0,)):
    t=np.arange(l)/SR; y=0
    for d in det: y=y+2*((t*f*(1+d))%1)-1
    return y/len(det)
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); s=0
    for i in range(len(x)): s=(1-a)*x[i]+a*s; y[i]=s
    return y
notes=[55,55,65.41,49]  # A1 A1 C2 G1 -ish bass roots per bar
for b in range(NB):
    t0=b*B
    add(kick(),t0,1.0)
    if b>=2:  # offbeat bass pulses
        f=notes[(b//4)%4]
        l=int(SR*B*0.45); add(lp(saw(f*(1 if b%2 else 1),l),500)*env(l,0.003,0.18),t0+B/2,0.7)
    if b>=1: add(hat(True),t0+B/2,0.5)
    if b>=3:
        for k in range(4): add(hat(),t0+k*B/4,0.25)
    if b%2==1 and b>=4: add(clap(),t0,0.5)
# staccato arp (16ths) trance
scale=[220,261.63,329.63,392,440,392,329.63,261.63]
for s in range(NB*4):
    if s<32: continue
    f=scale[(s*3)%8]*(2 if (s//4)%2 else 1); l=int(SR*B/4*0.8)
    add(lp(saw(f,l,(-0.006,0,0.006)),3500)*env(l,0.002,0.07),s*B/4,0.28)
# riser beats 11-15, then drop
r0,r1=31*B,36*B; l=int((r1-r0)*SR); t=np.arange(l)/SR
nz=rng.standard_normal(l)*(t/t[-1])**2*0.35
sw=np.sin(2*np.pi*np.cumsum(200+1800*(t/t[-1])**2)/SR)*(t/t[-1])*0.2
add(nz+sw,r0,1.0)
# drop: crash + supersaw chord from beat 15
l=int(SR*5*B); cr=rng.standard_normal(l)*np.exp(-np.arange(l)/SR/0.9); cr=np.diff(cr,prepend=0)
add(cr,36*B,0.5)
for f in (220,261.63,329.63):
    l=int(SR*7*B); add(lp(saw(f,l,(-0.01,-0.004,0,0.004,0.01)),2500)*np.exp(-np.arange(l)/SR/3),36*B,0.22)
# end tail fade, normalise
out*=np.minimum(1,(T-np.arange(n)/SR)/0.5)
out/=np.abs(out).max()*1.05
w=wave.open('aud3.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out*32767).astype('<i2').tobytes()); w.close()
