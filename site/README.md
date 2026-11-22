# Site de présentation de Teamora

Une page d'accueil, les mentions légales, la politique de confidentialité, la démo hébergée dans `demo/` et deux petits
scripts PHP : `contact.php` (formulaire de contact) et `avis.php` (bouton « Donner mon avis » de la démo). Les messages
partent par e-mail ; rien n'est enregistré sur le serveur. Aucun cookie, aucune mesure d'audience, aucun service tiers :
polices et bibliothèque d'animation sont hébergées avec le site.

## Ce qu'il faut chez l'hébergeur

Un hébergement mutualisé avec PHP 7.4 ou plus récent et la fonction `mail()` active (c'est le cas par défaut chez la plupart
des hébergeurs français), plus un nom de domaine. Si l'hébergeur bloque `mail()`, il faudra passer par un envoi SMTP.

## Mettre le site en ligne

1. **Avant d'acheter le nom de domaine**, vérifie qu'il est libre et que la marque « Teamora » n'est pas déjà déposée
   pour des logiciels (base des marques de l'INPI).
2. **Assemble le dossier** : `python3 site/build.py --zip teamora-site.zip`. Le dossier `site/dist/` (et l'archive) contient
   tout ce qu'il faut déposer. Pour remplir l'adresse du site dans l'image de partage et créer le plan du site, renseigne
   d'abord `ADRESSE_DU_SITE` en haut de `build.py`.
3. **Règle l'envoi des messages** dans `config.php` : l'adresse qui reçoit les messages, et une adresse d'expédition de ton
   propre nom de domaine (sinon les messages risquent d'arriver dans les indésirables).
4. **Complète les passages surlignés** dans `mentions-legales.html` et `confidentialite.html` : éditeur, adresse de contact,
   hébergeur, date. Les mentions légales sont obligatoires pour un site professionnel.
5. **Dépose le contenu** du dossier (pas le dossier lui-même) à la racine du site chez l'hébergeur (`www/` ou
   `public_html/`), avec le gestionnaire de fichiers de l'hébergeur ou un logiciel FTP comme FileZilla. Le fichier caché
   `.htaccess` doit être déposé aussi.
6. **Active le certificat SSL** (gratuit chez la plupart des hébergeurs), puis retire les `#` du dernier bloc de `.htaccess`
   pour forcer le passage en HTTPS.
7. **Teste** : envoie-toi une demande par le formulaire « Être recontacté », puis donne un avis dans la démo.

## Mettre à jour

- **La démo** : après une modification de `logiciel-rh-v3`, relance `build.py` et redépose le dossier `demo/`.
- **L'image de partage** (aperçu sur LinkedIn et dans les messageries) : `node site/outils/partage.js`.
- **Les aperçus animés** (section « Teamora, tel qu’il est ») : `node site/outils/apercus.js` refait les captures de la
  démo et la position des boutons (`site/img/apercus/`). À relancer quand l’apparence de la démo change ; les textes et
  l’enchaînement des étapes sont dans `site.js` (objet `CH`).
- **Un aperçu sans PHP** : `python3 site/build.py --apercu` crée `site/dist-apercu/`, où la démo pointe vers la version
  publiée sur claude.ai et où le formulaire ne s'envoie pas.

Si tu ajoutes un jour un outil de mesure d'audience ou une vidéo hébergée ailleurs, mets à jour la politique de
confidentialité (et, selon l'outil, ajoute un bandeau de consentement).

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html`, `styles.css`, `site.js` | La page d'accueil : l'accroche, les aperçus animés (vraies captures de la démo), paie, tarif et démo en trois cartes, les étapes cliquables à côté de la roue, le garde-fou juridique, l'entrée experts-comptables, les questions, puis « Être recontacté » |
| `mentions-legales.html`, `confidentialite.html` | Pages légales, avec les passages à compléter surlignés |
| `contact.php`, `avis.php`, `envoi.php`, `config.php` | Envoi par e-mail des messages et des avis ; `config.php` est le seul fichier à modifier |
| `.htaccess` | Protections du navigateur, cache, accès interdit aux fichiers de réglages, HTTPS à activer |
| `fonts/`, `vendor/gsap.min.js` | Polices Sora et Plus Jakarta Sans (licence SIL OFL) et bibliothèque d'animation (aperçus du site et démo) |
| `img/` | Image de partage ; `img/apercus/` : captures de la démo pour les aperçus animés et position des boutons (`images.js`) |
| `build.py` | Assemble `dist/` (site, démo, PHP) ou `dist-apercu/` |
| `outils/` | Scripts de l'image de partage et des captures des aperçus |

Les textes reprennent ce que fait réellement le prototype (module Obligations, parcours, espaces). Les règles juridiques
citées (seuils, règles de franchissement de la loi PACTE, entretien de parcours professionnel) sont à faire relire par un
professionnel du droit social avant la mise en ligne.

Le texte des douze étapes (section « De A à Z ») est directement dans `index.html`, un bloc `<article class="detail">` par
rubrique : il décrit ce que fait réellement le prototype. Mets-le à jour quand l'application évolue.
