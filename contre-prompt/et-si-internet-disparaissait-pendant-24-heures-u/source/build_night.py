#!/usr/bin/env python3
"""Fabrique les images « Terre de nuit » a partir de la carte NASA Black Marble 2012 (domaine public) :
- assets/nuit.jpg : recadrage carre sur le globe
- assets/nuit_off.png : les lumieres des villes remplacees par du sombre (alpha = masque des lumieres)
- assets/nuit_order.png : ordre d'extinction (pour l'animation)"""
import numpy as np
from PIL import Image, ImageFilter
src=Image.open("/tmp/bm_orig.jpg").convert("RGB"); W,H=src.size
s=1800/W; src=src.resize((1800,int(H*s)),Image.LANCZOS)
crop=src.crop((440,60,1340,960)); crop.save("assets/nuit.jpg",quality=90)
a=np.asarray(crop).astype(float); R,G,B=a[...,0],a[...,1],a[...,2]
mask=((R>85)&(R>B*1.25)).astype(np.uint8)*255
m=Image.fromarray(mask).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1.6))
dark=crop.filter(ImageFilter.MedianFilter(9)).filter(ImageFilter.GaussianBlur(3))
da=np.asarray(dark).astype(float)*0.55
off=np.dstack([da,np.asarray(m)]).clip(0,255).astype(np.uint8)
Image.fromarray(off,"RGBA").save("assets/nuit_off.png")
H2,W2=mask.shape; yy,xx=np.mgrid[0:H2,0:W2]
rng=np.random.default_rng(11)
seeds=[(470,300),(380,260),(300,640),(560,520)]   # reperes approximatifs : Amerique du Nord, Europe, Amerique du Sud...
d=np.min([np.hypot(xx-sx,yy-sy) for sx,sy in seeds],axis=0)/900
noise=np.asarray(Image.fromarray((rng.random((H2//12+1,W2//12+1))*255).astype(np.uint8)).resize((W2,H2),Image.BICUBIC)).astype(float)/255
order=d*0.55+noise*0.45; order=(order-order.min())/(order.max()-order.min())
Image.fromarray((order*255).astype(np.uint8)).save("assets/nuit_order.png")
print("pixels allumes:",int((mask>0).sum()))
