#!/usr/bin/env python3
"""Fabrique les images 'Terre salee' a partir de la photo NASA (Apollo 17, domaine public) :
- assets/earth_salt.png : les terres emergees en blanc sel (alpha = masque des terres)
- assets/earth_order.png : ordre d'apparition (pour l'animation de propagation)"""
import numpy as np
from PIL import Image, ImageFilter
im=Image.open("assets/earth.jpg").convert("RGB"); W,H=im.size
a=np.asarray(im).astype(float); R,G,B=a[...,0],a[...,1],a[...,2]; lum=a.mean(2)
yy,xx=np.mgrid[0:H,0:W]
disc=(lum>14); ys,xs=np.where(disc); cx,cy=xs.mean(),ys.mean(); r=np.sqrt(disc.sum()/np.pi)
inside=((xx-cx)**2+(yy-cy)**2)<(r*0.95)**2
# terres : tons bruns/ocre/verts. L'ocean est nettement plus bleu que rouge ; les nuages sont neutres.
ocean=(B>R+22)
landish=((R>B+2)|((G>B-6)&(lum<175)))&~ocean&inside
m=Image.fromarray((landish*255).astype(np.uint8))
m=m.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MedianFilter(7)).filter(ImageFilter.GaussianBlur(2.2))
land=np.asarray(m)/255.0
shade=(lum/lum[inside].max())
salt=np.stack([252-16*(1-shade),252-12*(1-shade),248-6*(1-shade)],-1)
rgba=np.dstack([salt,land*255]).clip(0,255).astype(np.uint8)
Image.fromarray(rgba,"RGBA").save("assets/earth_salt.png")
rng=np.random.default_rng(7)
seeds=[(cx+0.05*r,cy+0.35*r),(cx-0.1*r,cy-0.25*r),(cx+0.45*r,cy-0.1*r)]
d=np.min([np.hypot(xx-sx,yy-sy) for sx,sy in seeds],axis=0)/r
noise=np.asarray(Image.fromarray((rng.random((H//16+1,W//16+1))*255).astype(np.uint8)).resize((W,H),Image.BICUBIC)).astype(float)/255
order=(d/d.max())*0.8+noise*0.2
order=(order-order.min())/(order.max()-order.min())
Image.fromarray((order*255).astype(np.uint8)).save("assets/earth_order.png")
open("assets/earth_disc.txt","w").write("%f %f %f"%(cx,cy,r))
Image.alpha_composite(im.convert("RGBA"),Image.fromarray(rgba,"RGBA")).resize((600,600)).save("/tmp/claude-0/-home-user-claude/2ab96b93-8b5f-5e82-a562-fb436d969c4a/scratchpad/img/earth_salt_prev.png")
print("land fraction inside disc: %.2f"%(land[inside].mean()))
