#!/usr/bin/env python3
"""Estime le debit d'une voix off lue (PAS de synthese vocale) et ecrit timing.json + sous-titres.
Usage: python3 timing.py [--sps 4.6] [--pause 1.0]
       python3 timing.py --asr asr_words.json   # horaires reels (transcription de la voix enregistree)"""
import re, json, sys, argparse
ap=argparse.ArgumentParser()
ap.add_argument("--sps",type=float,default=4.6,help="syllabes par seconde (debit de parole)")
ap.add_argument("--pause",type=float,default=1.0,help="multiplicateur des pauses")
ap.add_argument("--t0",type=float,default=0.25,help="debut de la voix (s)")
ap.add_argument("--asr",default=None,help="JSON [{w,s,e}] : horaires des mots lus (faster-whisper)")
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
t=a.t0; words=[]; cues={}; cue_idx={}; sentences=[]; pending=[]; sent_words=[]
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
        for c in pending: cues[c]=round(t,3); cue_idx[c]=len(words)
        pending=[]
        words.append(w); sent.append(w); t+=d
        last=tok[-1]
        if last in PAUSE: t+=PAUSE[last]*a.pause
    sent_words.append(sent)
    t+=0.15*a.pause
audio_trim=0.0
if a.asr:
    import unicodedata, difflib
    norm=lambda t:"".join(c for c in unicodedata.normalize("NFD",t.lower()) if c.isalnum() and not unicodedata.combining(c))
    toks=[]
    for x in json.load(open(a.asr,encoding="utf8")):
        w=x["w"]
        if toks and (w[:1] in "'’-"): toks[-1]["w"]+=w; toks[-1]["e"]=x["e"]; continue
        toks.append(dict(x))
    sm=difflib.SequenceMatcher(None,[norm(w["text"]) for w in words],[norm(x["w"]) for x in toks],autojunk=False)
    pi=pj=0
    for (i,j,n) in sm.get_matching_blocks():
        if i>pi:   # mots non reconnus (nombres, mots mal transcrits) : on repartit dans l'intervalle
            if j>pj: t0_,t1_=toks[pj]["s"],toks[j-1]["e"]
            else: t0_=toks[pj-1]["e"] if pj>0 else toks[0]["s"]; t1_=toks[j]["s"] if j<len(toks) else toks[-1]["e"]
            ws=words[pi:i]; tot=sum(w["syl"] for w in ws); cur=t0_
            for w in ws: dd=max(0.05,(t1_-t0_))*w["syl"]/tot; w["start"]=cur; w["end"]=cur+dd; cur+=dd
        for k in range(n): words[i+k]["start"]=toks[j+k]["s"]; words[i+k]["end"]=toks[j+k]["e"]
        pi,pj=i+n,j+n
    audio_trim=round(words[0]["start"]-a.t0,3)
    for w in words: w["start"]=round(w["start"]-audio_trim,3); w["end"]=round(w["end"]-audio_trim,3)
    for c,k in cue_idx.items(): cues[c]=words[k]["start"]
    print("alignement : %d mots du script, %d mots lus, %d reconnus tels quels"%(len(words),len(toks),sum(n for _,_,n in sm.get_matching_blocks())))
sentences=[{"text":" ".join(w["text"] for w in sw),"start":sw[0]["start"],"end":sw[-1]["end"]} for sw in sent_words]
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
out={"sps":a.sps,"audio_trim":audio_trim,"voice_end":total,"video_end":round(total+1.6,2),"words":nw,"cues":cues,"sentences":sentences,"subs":subs}
json.dump(out,open("timing.json","w"),ensure_ascii=False,indent=1)
open("timing.js","w",encoding="utf8").write("window.TIMING="+json.dumps(out,ensure_ascii=False)+";")
def ts(x):
    h=int(x//3600);m=int(x%3600//60);s=x%60
    return "%02d:%02d:%06.3f"%(h,m,s)
with open("sous-titres.srt","w",encoding="utf8") as f:
    for i,s in enumerate(subs,1):
        f.write("%d\n%s --> %s\n%s\n\n"%(i,ts(s["start"]).replace(".",","),ts(s["end"]).replace(".",","),s["text"]))
print("mots:",nw,"| voix finie a %.1f s | video %.1f s | %.2f mots/s"%(total,total+1.6,nw/total))
key="couche" if "couche" in cues else ("parents" if "parents" in cues else None)
if key: print("revelation ({%s}) a %.1f s = %.0f%% de la voix"%(key,cues[key],100*cues[key]/total))
for k,v in cues.items(): print("  %-9s %6.2f"%(k,v))
