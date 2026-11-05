#!/usr/bin/env python3
"""Cherche des images REELLES libres de droits pour un mini-doc (NASA, Wikimedia Commons).
Usage : python3 chercher_images.py "mot cle" [--n 8] [--dl dossier]
Affiche, pour chaque image : source, titre, licence, credit a donner, page, lien direct.
Regle : ne garder que domaine public / CC0 / CC BY / CC BY-SA (credit obligatoire pour CC BY et CC BY-SA), et
VERIFIER la page avant usage (la licence affichee est celle declaree par la source). Jamais de personne privee identifiable."""
import sys, json, urllib.parse, urllib.request, re, os, html
UA = {"User-Agent": "ContrePromptImageSearch/1.0 (usage educatif; contact: voir depot)"}
def get(u):
    r = urllib.request.Request(u, headers=UA)
    with urllib.request.urlopen(r, timeout=40) as f: return json.loads(f.read().decode("utf8"))
q = sys.argv[1]; n = int(sys.argv[sys.argv.index("--n") + 1]) if "--n" in sys.argv else 8
dl = sys.argv[sys.argv.index("--dl") + 1] if "--dl" in sys.argv else None
res = []
try:   # NASA : domaine public (sauf mention contraire sur la page de l'image)
    d = get("https://images-api.nasa.gov/search?media_type=image&q=" + urllib.parse.quote(q))
    for it in d["collection"]["items"][:n]:
        m = it["data"][0]; nid = m["nasa_id"]
        try: assets = get("https://images-api.nasa.gov/asset/" + urllib.parse.quote(nid))["collection"]["items"]; links = [a["href"] for a in assets]
        except Exception: links = []
        big = next((l for l in links if "~large" in l or "~medium" in l), (links[0] if links else it["links"][0]["href"] if it.get("links") else ""))
        res.append(dict(src="NASA", titre=m.get("title", ""), licence="Domaine public (NASA) : verifier la page", credit="NASA" + ("/" + m["photographer"] if m.get("photographer") else (" / " + m["secondary_creator"] if m.get("secondary_creator") else "")) + " (" + m.get("center", "") + ")", page="https://images.nasa.gov/details/" + nid, url=big, desc=(m.get("description") or "")[:160]))
except Exception as e: print("NASA : erreur", e, file=sys.stderr)
try:   # Wikimedia Commons : licence lue dans les metadonnees
    u = "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=%d&gsrsearch=%s&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=1200" % (n * 2, urllib.parse.quote(q + " filetype:bitmap"))
    d = get(u)
    for p in sorted(d.get("query", {}).get("pages", {}).values(), key=lambda x: x.get("index", 0)):
        ii = p["imageinfo"][0]; em = ii.get("extmetadata", {}); lic = em.get("LicenseShortName", {}).get("value", "?")
        if not re.search(r"public domain|pd|cc0|cc by|cc-by", lic, re.I): continue
        au = re.sub(r"<[^>]+>", "", em.get("Artist", {}).get("value", "?")); cr = html.unescape(au).strip()
        res.append(dict(src="Commons", titre=p["title"].replace("File:", ""), licence=lic + ("  (CREDIT OBLIGATOIRE)" if "BY" in lic.upper() else ""), credit=cr + " / Wikimedia Commons / " + lic, page=ii["descriptionurl"], url=ii.get("thumburl") or ii["url"], desc=html.unescape(re.sub(r"<[^>]+>", "", em.get("ImageDescription", {}).get("value", "")))[:160]))
except Exception as e: print("Commons : erreur", e, file=sys.stderr)
for i, r in enumerate(res[:n * 2], 1):
    print("%2d. [%s] %s\n    licence : %s\n    credit  : %s\n    page    : %s\n    image   : %s\n    %s\n" % (i, r["src"], r["titre"], r["licence"], r["credit"], r["page"], r["url"], r["desc"]))
if dl:
    os.makedirs(dl, exist_ok=True)
    for i, r in enumerate(res[:n * 2], 1):
        try:
            ext = os.path.splitext(urllib.parse.urlparse(r["url"]).path)[1] or ".jpg"; p = os.path.join(dl, "%02d_%s%s" % (i, re.sub(r"\W+", "_", r["titre"])[:40], ext))
            urllib.request.urlretrieve(urllib.request.Request(r["url"], headers=UA).full_url, p)
        except Exception as e: print("telechargement", i, "echec", e, file=sys.stderr)
