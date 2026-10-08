import numpy as np, math, pickle, sys, cv2
from PIL import Image, ImageDraw, ImageFilter
from skimage.morphology import remove_small_objects
W,H,FPS=1280,720,24
BPM=128; BEAT=60/BPM; NB=24; T=NB*BEAT; NF=int(T*FPS)
DRAW_END=8.4; REV=2.5
strokes,(CW,CH)=pickle.load(open('strokes.pkl','rb'))
CC=np.array([500.,200.])
def sm(x): x=min(max(x,0),1); return x*x*(3-2*x)

# ---- smooth, resample, order strokes into one continuous light path
def smooth(s,k=7):
    if len(s)<k+2: return s
    p=np.pad(s,((k//2,k//2),(0,0)),mode='edge'); ker=np.ones(k)/k
    o=np.stack([np.convolve(p[:,i],ker,'valid') for i in range(2)],1); o[0]=s[0]; o[-1]=s[-1]; return o
def resample(s,step):
    d=np.r_[0,np.cumsum(np.linalg.norm(np.diff(s,axis=0),axis=1))]
    if d[-1]<step: return s
    t=np.arange(0,d[-1],step); t=np.r_[t,d[-1]]
    return np.stack([np.interp(t,d,s[:,0]),np.interp(t,d,s[:,1])],1)
S=[resample(smooth(smooth(s)),2.0) for s in strokes]
rem=list(range(len(S))); cur=np.array([30.,270.])
pts=[];drw=[]
while rem:
    best=None
    for i in rem:
        for rev in (0,1):
            e=S[i][-1] if rev else S[i][0]; d=np.linalg.norm(e-cur)
            if best is None or d<best[0]: best=(d,i,rev)
    d,i,rev=best; rem.remove(i); s=S[i][::-1] if rev else S[i]
    if pts:
        if d<22: g=resample(np.vstack([cur,s[0]]),2.0); pts.append(g); drw.append(np.ones(len(g),bool))
        else:
            g=resample(np.vstack([cur,s[0]]),5.0); pts.append(g); drw.append(np.zeros(len(g),bool))
    pts.append(s); drw.append(np.ones(len(s),bool)); cur=s[-1]
pts=np.vstack(pts); drw=np.concatenate(drw)
seg=np.linalg.norm(np.diff(pts,axis=0),axis=1)
wgt=np.where(drw[1:],1.0,0.5)*seg
cum=np.r_[0,np.cumsum(wgt)]; TOT=cum[-1]
def head_idx(t):
    x=min(max(t/DRAW_END,0),1)
    u=0.35*(x*x*(3-2*x))+0.65*x           # soft start/end, otherwise steady
    u+=0.012*math.sin(2*math.pi*x*5)       # slight breathing
    return int(np.searchsorted(cum,min(max(u,0),1)*TOT).clip(0,len(pts)-1))

# ---- camera (pre-simulated, smooth follow)
def zoom_at(t):
    z0,z1=2.5,1.12
    return z0+(z1-z0)*sm((t-DRAW_END)/REV)
cams=[]; c=pts[0].copy()
for i in range(NF):
    t=i/FPS; hp=pts[head_idx(t)]
    k=sm((t-DRAW_END+0.2)/REV)
    tgt=hp*(1-k)+CC*k
    c=c+(tgt-c)*(0.10 if t<DRAW_END else 0.12)
    cams.append(c.copy())

# ---- car silhouette (inside the contour), rim, lights
msk=np.zeros((CH,CW),np.uint8)
for s in strokes: cv2.polylines(msk,[s.astype(np.int32)],False,255,3)
msk=cv2.dilate(msk,np.ones((5,5),np.uint8))
ff=msk.copy(); pad=cv2.copyMakeBorder(ff,1,1,1,1,cv2.BORDER_CONSTANT,value=0)
cv2.floodFill(pad,None,(0,0),128)
inside=(pad[1:-1,1:-1]!=128)
inside=cv2.morphologyEx(inside.astype(np.uint8),cv2.MORPH_OPEN,np.ones((5,5),np.uint8))>0
dist=cv2.distanceTransform(inside.astype(np.uint8),cv2.DIST_L2,5)
rim=np.exp(-dist/9.0)*inside
XX,YY=np.meshgrid(np.arange(CW,dtype=np.float32),np.arange(CH,dtype=np.float32))
LIGHTS=[((-170,-130),(255,196,90),2.6),((1180,-130),(255,164,52),4.0),((-170,520),(255,232,176),5.6),((1180,520),(255,142,40),7.0)]
def light_i(k,t):
    t0=LIGHTS[k][2]; a=sm((t-t0)/0.9)
    if 0<t-t0<0.45: a*=0.55+0.45*(math.sin((t-t0)*70)>0)   # fluorescent stutter
    return a
GROUND=392
def lit_car(t,ra):
    img=np.zeros((CH,CW,3),np.float32)
    base=np.array([12,10,10],np.float32)
    img[:]=base*(0.7+0.5*(1-YY/CH))[...,None]
    for k,(p,col,_) in enumerate(LIGHTS):
        a=light_i(k,t)
        d2=((XX-p[0])**2+(YY-p[1])**2)/(360.0**2)
        f=a/(1+d2)**1.6
        img+=f[...,None]*np.array(col,np.float32)*0.4
    ang=-0.5; pos=(t-DRAW_END)*260-250
    q=(XX*math.cos(ang)+YY*math.sin(ang)-pos*1.0)
    band=np.exp(-(q/28.0)**2)*sm((t-DRAW_END)/0.4)
    img+=band[...,None]*np.array([255,225,150],np.float32)*0.45
    img+=rim[...,None]*np.array([255,190,90],np.float32)*0.55*(0.4+0.6*sum(light_i(k,t) for k in range(4))/4)
    return img*inside[...,None]

def beams(t,inv_x,inv_y):
    out=np.zeros((H,W,3),np.float32)
    for k,(p,col,_) in enumerate(LIGHTS):
        a=light_i(k,t)
        if a<=0.01: continue
        d=np.array(CC)-np.array(p); L=np.linalg.norm(d); d/=L; n=np.array([-d[1],d[0]])
        rx=inv_x-p[0]; ry=inv_y-p[1]
        al=rx*d[0]+ry*d[1]; q=rx*n[0]+ry*n[1]
        w=30+al*0.16
        f=np.exp(-(q/w)**2)*np.clip(al/120,0,1)*np.exp(-np.clip(al,0,None)/1100)
        f*=0.75+0.25*math.sin(t*1.7+k*2)
        out+=(f*a*0.34)[...,None]*np.array(col,np.float32)
    return out
rng=np.random.default_rng(5)
DUST=rng.uniform([-400,-300],[1400,700],(160,2)); DV=rng.uniform(-6,6,(160,2)); DB=rng.uniform(0.3,1,160)

def render(i):
    t=i/FPS; z=zoom_at(t); c=cams[i]; hi=head_idx(t)
    ox,oy=W/2,H/2+25
    tos=lambda P:(np.asarray(P)-c)*z+np.array([ox,oy])
    # background
    yy=np.linspace(0,1,H,dtype=np.float32)[:,None]
    bg=np.zeros((H,W,3),np.float32)
    bg[...,0]=(5+5*yy);bg[...,1]=(4+4*yy);bg[...,2]=(3+3*yy)
    ix=((np.arange(W,dtype=np.float32)-ox)/z+c[0])[None,:]*np.ones((H,1),np.float32)
    iy=((np.arange(H,dtype=np.float32)-oy)/z+c[1])[:,None]*np.ones((1,W),np.float32)
    bg+=beams(t,ix,iy)
    # floor pool of light
    pool=np.exp(-(((ix-500)/620)**2+((iy-GROUND-10)/42)**2))
    li=sum(light_i(k,t) for k in range(4))/4
    bg+=(pool*li*60)[...,None]*np.array([1,0.72,0.3],np.float32)
    # lit car
    ra=sm((t-DRAW_END+0.4)/1.8)
    if ra>0:
        car=lit_car(t,ra)
        M=np.float32([[z,0,ox-z*c[0]],[0,z,oy-z*c[1]]])
        w=cv2.warpAffine(car,M,(W,H),flags=cv2.INTER_LINEAR,borderValue=0)
        bg=bg*(1-0.0)+w*ra
    # dust
    dp=(DUST+DV*t)
    ds=tos(dp); 
    base=Image.fromarray(np.clip(bg,0,255).astype(np.uint8)); d=ImageDraw.Draw(base)
    for j in range(len(ds)):
        x,y=ds[j]
        if 0<=x<W and 0<=y<H:
            b=DB[j]*(0.6+0.4*math.sin(t*2+j))*li*160
            d.point((x,y),fill=(int(b),int(b*0.72),int(b*0.35)))
    # trail
    L=Image.new('RGB',(W,H),(0,0,0)); ld=ImageDraw.Draw(L)
    sp=tos(pts[:hi+1]); n=len(sp); tail=260
    wd=2 if z<1.8 else 3
    cut=max(0,n-tail)
    run=[]
    for s in range(0,cut):
        if drw[s+1]:
            run.append(tuple(sp[s]))
        else:
            if len(run)>1: ld.line(run+[tuple(sp[s])],fill=(205,128,28),width=wd,joint='curve')
            run=[]
    if len(run)>1: ld.line(run,fill=(205,128,28),width=wd,joint='curve')
    for s in range(cut,n-1):
        if not drw[s+1]: continue
        f=(s-cut)/max(1,n-1-cut)
        col=(int(205+50*f),int(128+112*f),int(28+170*f)); ld.line([tuple(sp[s]),tuple(sp[s+1])],fill=col,width=wd+int(2*f))
    hp=sp[-1]
    Ln=np.asarray(L).astype(np.float32)
    g1=np.asarray(L.filter(ImageFilter.GaussianBlur(6))).astype(np.float32)
    g2=np.asarray(L.filter(ImageFilter.GaussianBlur(22))).astype(np.float32)
    pulse=1+0.12*math.exp(-((t%BEAT)/0.12))
    out=np.asarray(base).astype(np.float32)+(Ln+g1*1.5+g2*2.0)*pulse
    if t<DRAW_END+0.3:
        H2=Image.new('RGB',(W,H),(0,0,0)); hd=ImageDraw.Draw(H2); r=7
        hd.ellipse([hp[0]-r,hp[1]-r,hp[0]+r,hp[1]+r],fill=(255,245,215))
        out+=np.asarray(H2).astype(np.float32)+np.asarray(H2.filter(ImageFilter.GaussianBlur(11))).astype(np.float32)*3.2
    X=np.linspace(-1,1,W)[None,:];Y=np.linspace(-1,1,H)[:,None]
    out*=(1-0.5*(X**2*0.7+Y**2))[...,None]
    out*=min(1,t/0.4)*min(1,(T-t)/0.5)
    return Image.fromarray(np.clip(out,0,255).astype(np.uint8))

if __name__=='__main__':
    a,b=int(sys.argv[1]),int(sys.argv[2])
    for i in range(a,min(b,NF)): render(i).save(f'vid2/f{i:04d}.png')
