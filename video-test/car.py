import numpy as np, math, subprocess, sys, os, random
from PIL import Image, ImageDraw, ImageFilter
W,H,FPS=1280,720,24
BPM=128; BEAT=60/BPM; NB=20; T=NB*BEAT; NF=int(T*FPS)
STEP=BEAT/4; DRAW_END=7.0
random.seed(4); rng=np.random.default_rng(4)

def bez(p0,p1,p2,p3,n=60):
    t=np.linspace(0,1,n)[:,None]
    return (1-t)**3*np.array(p0)+3*(1-t)**2*t*np.array(p1)+3*(1-t)*t**2*np.array(p2)+t**3*np.array(p3)
def line(a,b,n=20):
    t=np.linspace(0,1,n)[:,None]; return np.array(a)*(1-t)+np.array(b)*t
def arc(c,r,a0,a1,n=60,ry=None):
    a=np.radians(np.linspace(a0,a1,n)); ry=ry or r
    return np.stack([c[0]+r*np.cos(a),c[1]-ry*np.sin(a)],1)

pieces=[]  # (pts, draw)
def add(p,d=True): pieces.append((np.asarray(p,float),d))
# body outline: nose -> hood -> roof -> tail -> underbody
add(np.vstack([
 bez((992,262),(930,222),(820,188),(700,160)),
 bez((700,160),(620,118),(560,66),(470,62)),
 bez((470,62),(380,58),(250,100),(130,148)),
 bez((130,148),(100,156),(70,146),(36,132)),
 bez((36,132),(30,190),(40,250),(55,300)),
 line((55,300),(140,300)),
 arc((220,300),80,180,0,60),
 line((300,300),(745,300)),
 arc((820,300),75,180,0,60),
 line((895,300),(975,298)),
 bez((975,298),(1004,292),(1008,276),(992,262))]))
add(line((992,262),(940,236)),False)
add(bez((940,236),(968,236),(984,246),(992,258)))          # headlight
add(line((992,258),(100,214)),False)
add(bez((100,214),(300,196),(600,196),(940,236)))          # character line
add(line((940,236),(330,140)),False)
add(np.vstack([bez((330,140),(420,96),(480,78),(540,80)),
               bez((540,80),(610,92),(650,122),(695,158)),
               line((695,158),(330,140))]))                 # window
add(line((330,140),(48,176)),False)
add(line((48,176),(118,166)))                               # tail light bar
add(line((118,166),(282,300)),False)
add(arc((220,300),62,0,360)); add(line((282,300),(250,300),4),False); add(arc((220,300),30,0,360,40))
add(line((250,300),(878,300)),False)
add(arc((820,300),58,0,360)); add(line((878,300),(848,300),4),False); add(arc((820,300),28,0,360,40))
pts=[];draw=[]
for p,d in pieces:
    pts.append(p);draw.append(np.full(len(p),d))
pts=np.vstack(pts);draw=np.concatenate(draw)
seg=np.linalg.norm(np.diff(pts,axis=0),axis=1)
# pen-up travel weighted lighter (fast) -> resample by time weight
w=np.where(draw[1:],1.0,0.18)*seg
cum=np.concatenate([[0],np.cumsum(w)]); TOT=cum[-1]

def sm(x): x=min(max(x,0),1); return x*x*(3-2*x)
def stag(t):  # staccato clock in steps
    k=math.floor(t/STEP); f=(t/STEP-k)
    return (k+sm(f/0.45))*STEP
def head_idx(t):
    u=min(max(stag(t)/DRAW_END,0),1)
    u=u**1.12
    return np.searchsorted(cum,u*TOT).clip(0,len(pts)-1)

CAR_C=np.array([530,205.])
def zoom_at(t):
    z0,z1=3.4,1.12
    tr=DRAW_END+0.1
    if t<tr: return z0*(1+0.045*math.exp(-((t%BEAT)/0.07)))
    # reveal: snaps on beats
    k=(t-tr)/BEAT; stepn=math.floor(k); f=k-stepn
    levels=[3.4,2.5,1.8,1.35,1.12,1.12,1.12,1.12]
    a=levels[min(stepn,len(levels)-1)]; b=levels[min(stepn+1,len(levels)-1)]
    return (a+(b-a)*sm(f/0.5))*(1+0.03*math.exp(-((t%BEAT)/0.07)))
def cam_at(t):
    tr=DRAW_END+0.1
    hp=pts[head_idx(max(t-0.07,0))]
    z=zoom_at(t)
    if t<tr: return hp+np.array([20,-8])
    k=sm((t-tr)/(BEAT*3.5))
    return hp*(1-k)+CAR_C*k

def kick(t): return math.exp(-((t%BEAT)/0.10))

# static background floor lines
def render(i):
    t=i/FPS; z=zoom_at(t); c=cam_at(t); kk=kick(t)
    hi=head_idx(t)
    def tos(p): return (np.asarray(p)-c)*z+np.array([W/2,H/2+30])
    # background
    yy=np.linspace(0,1,H)[:,None]
    bg=np.zeros((H,W,3),np.float32)
    bg[...,0]=(4+6*yy)*np.ones((1,W)); bg[...,1]=(6+10*yy); bg[...,2]=(12+20*yy)
    base=Image.fromarray(bg.astype(np.uint8))
    d=ImageDraw.Draw(base)
    # ground reflection grid (world-anchored)
    gy=tos((0,362))[1]
    for gx in range(-2000,3000,100):
        x=tos((gx,0))[0]
        if -50<x<W+50 and gy<H:
            d.line([(x,gy),((x-W/2)*1.8+W/2,H)],fill=(10,26,40),width=1)
    if 0<gy<H: d.line([(0,gy),(W,gy)],fill=(14,40,60),width=2)
    # dust particles (parallax)
    for j in range(40):
        px=(j*977.3+ t*(-30-j%5*10))%2600-300; py=(j*313.7)%700-100
        sx=(px-c[0]*0.4)*z*0.5%W; sy=(py-c[1]*0.4)*z*0.5%H
        a=int(20+30*((j*7)%5)/5); d.point((sx,sy),fill=(a,a*2,a*3))
    L=Image.new('RGB',(W,H),(0,0,0)); ld=ImageDraw.Draw(L)
    idx=np.arange(hi+1)
    sp=tos(pts[:hi+1])
    # trail segments
    n=len(sp); tail=max(1,int(n*0.0)+400)  # comet length in samples
    for s in range(0,n-1):
        if not draw[s+1]: continue
        age=(n-1-s)
        if age<tail: f=1-age/tail; col=(int(60+195*f),int(190+65*f),255)
        else: col=(40,150,210)
        wd=2 if age>=tail else 2+int(3*(1-age/tail))
        a,b=sp[s],sp[s+1]
        if (-80<a[0]<W+80 and -80<a[1]<H+80) or (-80<b[0]<W+80 and -80<b[1]<H+80):
            ld.line([tuple(a),tuple(b)],fill=col,width=wd)
    # head
    hp=sp[-1]
    # reveal fill
    tr=DRAW_END+0.25
    ra=sm((t-tr)/1.5)
    comp=np.asarray(base).astype(np.float32)
    if ra>0:
        F=Image.new('RGB',(W,H),(0,0,0)); fd=ImageDraw.Draw(F)
        body=np.vstack([pieces[0][0]])
        fd.polygon([tuple(p) for p in tos(body)],fill=(14,26,44))
        win=pieces[6][0]; fd.polygon([tuple(p) for p in tos(win)],fill=(20,60,90))
        for cx in (220,820):
            fd.ellipse([*(tos((cx-62,300-62))),*(tos((cx+62,300+62)))],fill=(6,10,16))
        Fa=np.asarray(F).astype(np.float32)
        mask=(Fa.sum(2,keepdims=True)>0)
        comp=np.where(mask,comp*(1-ra)+Fa*ra,comp)
    Ln=np.asarray(L).astype(np.float32)
    g1=np.asarray(L.filter(ImageFilter.GaussianBlur(6))).astype(np.float32)
    g2=np.asarray(L.filter(ImageFilter.GaussianBlur(22))).astype(np.float32)
    pulse=1+0.35*kk
    out=comp+(Ln*1.0+g1*1.6+g2*2.2)*pulse*np.array([0.9,1.0,1.0])
    # head flare while drawing
    if t<DRAW_END+0.1:
        H2=Image.new('RGB',(W,H),(0,0,0)); hd=ImageDraw.Draw(H2)
        r=7+5*kk
        hd.ellipse([hp[0]-r,hp[1]-r,hp[0]+r,hp[1]+r],fill=(255,240,255))
        hb=np.asarray(H2.filter(ImageFilter.GaussianBlur(10))).astype(np.float32)
        out+=np.asarray(H2).astype(np.float32)+hb*3.0
    # final flash on headlight at the end of the reveal
    tf=DRAW_END+0.1+BEAT*4
    if t>tf:
        fl=math.exp(-(t-tf)/0.25)*1.0
        out+=fl*40
    # chromatic shift on kick
    sh=int(4*kk)
    if sh>0:
        out[...,0]=np.roll(out[...,0],sh,1); out[...,2]=np.roll(out[...,2],-sh,1)
    # vignette
    X=np.linspace(-1,1,W)[None,:];Y=np.linspace(-1,1,H)[:,None]
    v=1-0.55*(X**2*0.7+Y**2)
    out*=v[...,None]
    # fade in/out
    fade=min(1,t/0.25)*min(1,(T-t)/0.35)
    out*=fade
    return Image.fromarray(np.clip(out,0,255).astype(np.uint8))

if __name__=='__main__':
    a,b=int(sys.argv[1]),int(sys.argv[2])
    for i in range(a,min(b,NF)):
        render(i).save(f'vid/f{i:04d}.png')
