import numpy as np, cv2, pickle
from skimage.morphology import skeletonize, remove_small_objects
from PIL import Image
im=np.array(Image.open('../images/1.webp').convert('L')).astype(np.float32)
box=(270,530,1270,925)  # hero 3/4 view
c=im[box[1]:box[3],box[0]:box[2]]
mask=c<110
mask=cv2.dilate(mask.astype(np.uint8),np.ones((3,3),np.uint8))>0   # close hairline gaps
mask=remove_small_objects(mask,60)
sk=skeletonize(mask)
print(mask.sum(),sk.sum())
# graph walk -> strokes
H,W=sk.shape
ys,xs=np.nonzero(sk)
pix=set(zip(ys,xs))
nb=lambda p:[(p[0]+dy,p[1]+dx) for dy in(-1,0,1) for dx in(-1,0,1) if (dy or dx) and (p[0]+dy,p[1]+dx) in pix]
deg={p:len(nb(p)) for p in pix}
visited_edges=set(); strokes=[]
def key(a,b): return (a,b) if a<b else (b,a)
nodes=[p for p in pix if deg[p]!=2]
def walk(start,nxt):
    path=[start,nxt]; visited_edges.add(key(start,nxt)); prev,cur=start,nxt
    while deg[cur]==2:
        n=[q for q in nb(cur) if q!=prev and key(cur,q) not in visited_edges]
        if not n: break
        prev,cur=cur,n[0]; visited_edges.add(key(prev,cur)); path.append(cur)
    return path
for s in nodes:
    for n in nb(s):
        if key(s,n) not in visited_edges: strokes.append(walk(s,n))
# loops (pure cycles)
for p in list(pix):
    for n in nb(p):
        if key(p,n) not in visited_edges: strokes.append(walk(p,n))
strokes=[np.array([(x,y) for y,x in s],float) for s in strokes if len(s)>=8]
print(len(strokes),sum(len(s) for s in strokes))
pickle.dump((strokes,(W,H)),open('strokes.pkl','wb'))
prev=np.full((H,W,3),245,np.uint8)
rng=np.random.default_rng(2)
for s in strokes:
    col=tuple(int(v) for v in rng.integers(0,200,3))
    cv2.polylines(prev,[s.astype(np.int32)],False,col,2)
Image.fromarray(prev).save('vid/strokes_prev.png')
