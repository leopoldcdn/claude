"""Assemble le site de Teamora, prêt à déposer chez un hébergeur (PHP).

    python3 site/build.py                    site/dist/ : le site, la démo (dossier demo/) et les scripts PHP
    python3 site/build.py --zip teamora.zip  idem, plus une archive du dossier
    python3 site/build.py --apercu           site/dist-apercu/ : aperçu sans PHP, démo en lien vers claude.ai

Deux réglages ci-dessous : l'adresse du site (image de partage, plan du site) et la démo publiée sur claude.ai.
"""
import argparse
import pathlib
import shutil
import zipfile

ADRESSE_DU_SITE = ''  # ex. 'https://www.votre-domaine.fr', sans « / » final ; vide = liens relatifs et pas de sitemap.xml
DEMO_EN_LIGNE = 'https://claude.ai/artifact/4pHLrU8bBB6Uz6SMuLx7eq'  # utilisée seulement par l'aperçu

ICI = pathlib.Path(__file__).resolve().parent
APPLI = ICI.parent / 'logiciel-rh-v3'
PAGES = ['index.html', 'mentions-legales.html', 'confidentialite.html']
FICHIERS = ['styles.css', 'site.js', 'favicon.svg']
DOSSIERS = ['fonts', 'img', 'vendor']
PHP = ['contact.php', 'avis.php', 'envoi.php', 'config.php', '.htaccess']
DEMO = ['app.js', 'data.js', 'conventions.js', 'styles.css']


def remplacer(texte, avant, apres, fichier):
    if avant not in texte:
        raise SystemExit(f'{fichier} : passage introuvable, la page a changé : {avant[:60]!r}')
    return texte.replace(avant, apres)


def page(nom, apercu):
    t = (ICI / nom).read_text(encoding='utf-8')
    if ADRESSE_DU_SITE:
        t = t.replace('content="img/partage.png"', f'content="{ADRESSE_DU_SITE}/img/partage.png"')
        if nom == 'index.html':
            t = remplacer(t, '<link rel="icon"', f'<link rel="canonical" href="{ADRESSE_DU_SITE}/">\n<meta property="og:url" content="{ADRESSE_DU_SITE}/">\n<link rel="icon"', nom)
    if apercu:
        t = remplacer(t, '<html lang="fr">', '<html lang="fr" data-apercu>', nom)
        t = t.replace('href="demo/"', f'href="{DEMO_EN_LIGNE}"')
    return t


def demo_hebergee(dest):
    """Copie la démo dans demo/ : polices et animation servies par le site, avis envoyés à avis.php, lien de retour vers « Être recontacté »."""
    d = dest / 'demo'
    d.mkdir()
    for f in DEMO:
        shutil.copy2(APPLI / f, d / f)
    shutil.copy2(ICI / 'vendor' / 'gsap.min.js', d / 'gsap.min.js')
    t = (APPLI / 'demo.html').read_text(encoding='utf-8')
    google = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
              '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
              '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@600;700&display=swap">')
    t = remplacer(t, google, '<link rel="stylesheet" href="../fonts/polices.css">\n<meta name="robots" content="noindex">', 'demo.html')
    t = remplacer(t, '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>', '<script src="gsap.min.js"></script>', 'demo.html')
    t = remplacer(t, '<script>window.TEAMORA_MODE = "demo";</script>', '<script>window.TEAMORA_MODE = "demo"; window.TEAMORA_AVIS_URL = "../avis.php"; window.TEAMORA_RETOUR = "../#contact";</script>', 'demo.html')
    if not t.lstrip().lower().startswith('<!doctype'):
        t = '<!DOCTYPE html>\n<html lang="fr">\n' + t
    (d / 'index.html').write_text(t, encoding='utf-8')


def construire(apercu=False):
    dest = ICI / ('dist-apercu' if apercu else 'dist')
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir()
    for nom in PAGES:
        (dest / nom).write_text(page(nom, apercu), encoding='utf-8')
    for f in FICHIERS:
        shutil.copy2(ICI / f, dest / f)
    for d in DOSSIERS:
        shutil.copytree(ICI / d, dest / d)
    robots = 'User-agent: *\nAllow: /\n'
    if not apercu:
        for f in PHP:
            shutil.copy2(ICI / f, dest / f)
        demo_hebergee(dest)
        if ADRESSE_DU_SITE:
            urls = ''.join(f'  <url><loc>{ADRESSE_DU_SITE}/{"" if p == "index.html" else p}</loc></url>\n' for p in PAGES)
            (dest / 'sitemap.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n', encoding='utf-8')
            robots += f'Sitemap: {ADRESSE_DU_SITE}/sitemap.xml\n'
    (dest / 'robots.txt').write_text(robots, encoding='utf-8')
    return dest


if __name__ == '__main__':
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument('--apercu', action='store_true', help='aperçu sans PHP, démo en lien vers claude.ai')
    a.add_argument('--zip', help='chemin d’une archive .zip à créer à partir du dossier assemblé')
    o = a.parse_args()
    dest = construire(o.apercu)
    n = sum(1 for f in dest.rglob('*') if f.is_file())
    print(f'{dest.relative_to(ICI.parent)} : {n} fichiers')
    if o.zip:
        with zipfile.ZipFile(o.zip, 'w', zipfile.ZIP_DEFLATED) as z:
            for f in sorted(dest.rglob('*')):
                if f.is_file():
                    z.write(f, pathlib.Path('teamora-site') / f.relative_to(dest))
        print(f'archive : {o.zip}')
