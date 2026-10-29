"""Assemble le pitch en un seul fichier HTML : les images {{img:chemin}} de source.html sont intégrées en base64."""
import base64
import pathlib
import re

ici = pathlib.Path(__file__).parent
MIME = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml'}


def integre(m):
    f = ici / m.group(1)
    return f'data:{MIME[f.suffix.lower()]};base64,' + base64.b64encode(f.read_bytes()).decode()


html = re.sub(r'\{\{img:([^}]+)\}\}', integre, (ici / 'source.html').read_text(encoding='utf-8'))
(ici / 'pitch-teamora.html').write_text(html, encoding='utf-8')
print(f'pitch-teamora.html : {len(html) // 1024} Ko')
