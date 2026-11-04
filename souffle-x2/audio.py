import numpy as np, wave
SR=44100; T=39.5; N=int(SR*T); t=np.arange(N)/SR
rng=np.random.default_rng(8)
P=2.7; T0=.3
def sm(x):x=np.clip(x,0,1);return x*x*(3-2*x)
def bp(x,lo,hi):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);m=((f>lo)&(f<hi)).astype(float)
    m=np.convolve(m,np.ones(41)/41,'same');return np.fft.irfft(X*m,len(x))
# --- souffle : même loi que la vidéo (f, S)
u=t-T0; k=np.floor(u/P); ph=u-k*P
valid=(u>=0)&(k<=10)
f=np.zeros(N)
a=valid&(ph<1.2); f[a]=-np.sin(np.pi*ph[a]/1.2)
b=valid&(ph>=1.35); f[b]=np.sin(np.pi*(ph[b]-1.35)/(P-1.35))
S=np.where(valid,2.0**np.clip(k,0,10),1.0); lk=np.log2(S)
inten=np.abs(f)*(.12+.88*np.clip(lk/10,0,1))**1.3
# vent : bruit filtré, plus grave et plus fort quand S grandit
n1=bp(rng.standard_normal(N),250,2200); n2=bp(rng.standard_normal(N),500,5000); n3=bp(rng.standard_normal(N),25,140)
mixw=(1-np.clip(lk/10,0,1))
wind=(n1*(.35+.65*mixw)+n2*.25*(1-mixw*.6))*inten*.5 + n3*inten*np.clip(lk/10,0,1)**1.5*3.0
wind*=(1.0*valid)
# --- nappe calme, qui se tend un peu avec la force puis se résout
tens=np.clip(lk/10,0,1)*valid
pad=np.zeros(N)
for fr,am in [(130.8,1),(196,.6),(261.6,.4),(329.6,.25)]:pad+=am*np.sin(2*np.pi*fr*t+.5*np.sin(2*np.pi*.12*t))
pad+=tens*.5*np.sin(2*np.pi*138.6*t)
calm=sm((t-30.0)/1.5)*(1-sm((t-37)/1.5)); pad*=(.55+.45*np.sin(2*np.pi*.07*t)**2)*(.03+.015*calm)
# --- impacts : mur (15.15), plafond (≈21.05), onde finale (28.65)
def thump(t0,d=1.6,a=.9):
    m=(t>=t0)&(t<t0+d);e=np.zeros(N);tt=t[m]-t0
    nn=bp(rng.standard_normal(N),40,900)[m]
    e[m]=(np.sin(2*np.pi*(52-18*tt)*tt)*1.0+nn*1.6)*np.exp(-tt*4.2)*a;return e
imp=thump(15.15,1.8,.9)+thump(21.05,1.6,.7)+thump(28.65,2.4,1.1)
# --- pop du compteur à chaque doublement
def blip(t0,fr,d=.25,a=.1):
    m=(t>=t0)&(t<t0+d);e=np.zeros(N);tt=t[m]-t0;e[m]=np.sin(2*np.pi*fr*tt)*np.exp(-tt*18)*a;return e
pops=sum(blip(T0+i*P,330*2**(i/12*1.3),a=.08+.01*i) for i in range(11))
# --- feuille qui se pose + swish final
chime=blip(35.9,1318.5,.8,.06)+blip(35.95,1976,.8,.03)
sw=np.zeros(N);m=(t>=36.8)&(t<37.45);tt=t[m]-36.8
nn=bp(rng.standard_normal(N),800,7000);sw[m]=nn[m]*np.sin(np.pi*tt/.65)**2*.5
mix=pad+wind*.9+imp*.9+pops+chime+sw
mix*=np.clip(t/1,0,1)*np.clip((T-t)/1.2,0,1)
mix/=np.abs(mix).max()/.85
L=mix;R=np.roll(mix,70)*.97
st=(np.stack([L,R],1)*32767).astype(np.int16)
with wave.open('ambiance.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(st.tobytes())
print('ok')
