import numpy as np, wave
SR=44100; T=47.0; N=int(SR*T); t=np.arange(N)/SR
rng=np.random.default_rng(5)
P=2.6
def bp(x,lo,hi):                       # filtre passe-bande par FFT
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);m=((f>lo)&(f<hi)).astype(float)
    k=int(SR*0.002);m=np.convolve(m,np.ones(21)/21,'same');return np.fft.irfft(X*m,len(x))
def sm(x):x=np.clip(x,0,1);return x*x*(3-2*x)
# --- drone doux : accord qui devient tendu (S5-S6) puis se résout (S7)
tens=sm((t-24.5)/2)*(1-sm((t-36.5)/1.5))
pad=np.zeros(N)
for f,a in [(110,1),(164.8,.6),(220,.4)]:pad+=a*np.sin(2*np.pi*f*t+0.6*np.sin(2*np.pi*.15*t))
pad+=tens*.7*np.sin(2*np.pi*116.5*t)            # seconde mineure = tension
pad*=.5+.5*np.sin(2*np.pi*.08*t)**2
pad*=0.035
# --- respirations : souffle filtré, enveloppe = remplissage des poumons
def amp(tt):
    d=sm((tt-2.4)/1)*(1-sm((tt-5.2)/.4))+sm((tt-9.9)/.7)*(1-sm((tt-12.6)/.1))
    return .07+.09*d
b=.5-.5*np.cos(2*np.pi*t/P); flow=np.abs(np.gradient(b,1/SR))   # souffle = vitesse du remplissage
active=((t<12.7)|((t>=36.5)&(t<44.2))).astype(float)
active=np.convolve(active,np.ones(2000)/2000,'same')
noise=bp(rng.standard_normal(N),300,2600)
A=np.array([amp(x) if x<12.7 else .07 for x in t[::441]]);A=np.interp(t,t[::441],A)
breath=noise*flow/flow.max()*active*(A/.16)**1.2*0.45
# --- tic d'interface aux apparitions
def blip(t0,f=880,d=.18,a=.12):
    m=(t>=t0)&(t<t0+d);e=np.zeros(N);tt=t[m]-t0;e[m]=np.sin(2*np.pi*f*tt)*np.exp(-tt*22)*a;return e
ticks=sum(blip(x,f) for x,f in [(.25,740),(3.7,988),(5.6,740),(8.6,880),(10.0,1100),(13.0,740),(16.2,988),(18.8,660),(24.8,660),(30.7,520),(33.2,440),(36.8,880),(41.2,988)])
# --- swish final
sw=np.zeros(N);m=(t>=44.3)&(t<44.95);tt=t[m]-44.3
n2=bp(rng.standard_normal(N),800,7000)
sw[m]=(n2[m]*np.sin(np.pi*tt/.65)**2)*.55
mix=pad+breath+ticks+sw
fade=np.clip(t/1,0,1)*np.clip((T-t)/1.2,0,1)
mix*=fade; mix/=np.abs(mix).max()/.85
# léger stéréo
L=mix;R=np.roll(mix,60)*.98
st=(np.stack([L,R],1)*32767).astype(np.int16)
with wave.open('ambiance.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(st.tobytes())
print('ok')
