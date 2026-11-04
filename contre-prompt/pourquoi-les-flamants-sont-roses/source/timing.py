#!/usr/bin/env python3
"""Estime le debit d'une voix off lue (PAS de synthese vocale) et ecrit timing.json + sous-titres.
Usage: python3 timing.py [--sps 4.6] [--pause 1.0]"""
import re, json, sys, argparse
ap=argparse.ArgumentParser()
ap.add_argument("--sps",type=float,default=4.6,help="syllabes par seconde (debit de parole)")
ap.add_argument("--pause",type=float,default=1.0,help="multiplicateur des pauses")
ap.add_argument("--t0",type=float,default=0.25,help="debut de la voix (s)")
a=ap.parse_args()
VOW="aeiouyàâäéèêëîïôöùûüœ"
def syl(w):
    w=w.lower().replace("’","'")
    w=re.sub(r"[^a-zàâäéèêëîïôöùûüœ]","",w)
    if not w: return 0
    n=len(re.findall(r"[%s]+"%VOW,w))
    if len(w)>2 and w.endswith("es") and n>1: n-=1
    elif len(w)>2 and w.endswith("e") and n>1 and w[-2] not in VOW: n-=1
    elif w.endswith("ent") and n>1 and len(w)>4: n-=1
    return max(n,1)
PAUSE={".":0.45,"?":0.50,"!":0.45,":":0.30,",":0.18,";":0.25}
raw=open("script.txt",encoding="utf8").read().strip().split("\n")
t=a.t0; words=[]; cues={}; sentences=[]; pending=[]
for line in raw:
    # tokenise en conservant les marqueurs {x}
    toks=re.findall(r"\{[a-z0-9]+\}|[^\s{]+",line)
    sent=[]
    for tok in toks:
        m=re.fullmatch(r"\{([a-z0-9]+)\}",tok)
        if m: pending.append(m.group(1)); continue
        # sous-mots separes par apostrophe : meme mot parle
        n=syl(re.sub(r"^.*'","",tok)) + sum(syl(p) for p in tok.split("'")[:-1])
        n=max(n,1)
        d=n/a.sps
        w={"text":tok,"start":round(t,3),"end":round(t+d,3),"syl":n}
        for c in pending: cues[c]=round(t,3)
        pending=[]
        words.append(w); sent.append(w); t+=d
        last=tok[-1]
        if last in PAUSE: t+=PAUSE[last]*a.pause
    sentences.append({"text":" ".join(w["text"] for w in sent),"start":sent[0]["start"],"end":sent[-1]["end"]})
    t+=0.15*a.pause
total=round(words[-1]["end"],2)
# sous-titres : groupes de 2 a 4 mots, coupes aux ponctuations
chunks=[]; cur=[]
def flush():
    global cur
    if cur: chunks.append(cur); cur=[]
for w in words:
    cur.append(w)
    txt=" ".join(x["text"] for x in cur)
    if w["text"][-1] in ".?!:;," or len(cur)>=4 or len(txt)>=24:
        flush()
flush()
# fusionne les groupes d'un seul mot court avec le suivant
merged=[]; i=0
while i<len(chunks):
    c=chunks[i]
    if len(c)==1 and len(c[0]["text"])<=5 and c[0]["text"][-1] not in ".?!" and i+1<len(chunks):
        chunks[i+1]=c+chunks[i+1]; i+=1; continue
    merged.append(c); i+=1
subs=[]
for k,c in enumerate(merged):
    s=c[0]["start"]; e=(merged[k+1][0]["start"] if k+1<len(merged) else c[-1]["end"]+0.5)
    e=min(e,c[-1]["end"]+0.9)
    subs.append({"text":" ".join(x["text"] for x in c),"start":s,"end":round(e,3)})
nw=len(words)
out={"sps":a.sps,"voice_end":total,"video_end":round(total+1.6,2),"words":nw,"cues":cues,"sentences":sentences,"subs":subs}
json.dump(out,open("timing.json","w"),ensure_ascii=False,indent=1)
open("timing.js","w",encoding="utf8").write("window.TIMING="+json.dumps(out,ensure_ascii=False)+";")
def ts(x):
    h=int(x//3600);m=int(x%3600//60);s=x%60
    return "%02d:%02d:%06.3f"%(h,m,s)
with open("sous-titres.srt","w",encoding="utf8") as f:
    for i,s in enumerate(subs,1):
        f.write("%d\n%s --> %s\n%s\n\n"%(i,ts(s["start"]).replace(".",","),ts(s["end"]).replace(".",","),s["text"]))
print("mots:",nw,"| voix finie a %.1f s | video %.1f s | %.2f mots/s"%(total,total+1.6,nw/total))
print("revelation ({parents}) a %.1f s = %.0f%% de la voix"%(cues["parents"],100*cues["parents"]/total))
for k,v in cues.items(): print("  %-9s %6.2f"%(k,v))
