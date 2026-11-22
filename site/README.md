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
- **Un aperçu sans PHP** : `python3 site/build.py --apercu` crée `site/dist-apercu/`, où la démo pointe vers la version
  publiée sur claude.ai et où le formulaire ne s'envoie pas.

Si tu ajoutes un jour un outil de mesure d'audience ou une vidéo hébergée ailleurs, mets à jour la politique de
confidentialité (et, selon l'outil, ajoute un bandeau de consentement).

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html`, `styles.css`, `site.js` | La page d'accueil, sur le fond coloré de l'accueil du logiciel : une barre de navigation flottante, l'accroche (« Toute votre GRH, dans les règles », avec à droite un questionnaire en quatre questions qui prépare la démo), le carrousel des douze rubriques sur toute la largeur (illustrations au trait, teinte de chaque rubrique), l'entrée experts-comptables, les questions, puis « Être recontacté » |
| `mentions-legales.html`, `confidentialite.html` | Pages légales, avec les passages à compléter surlignés |
| `contact.php`, `avis.php`, `envoi.php`, `config.php` | Envoi par e-mail des messages et des avis ; `config.php` est le seul fichier à modifier |
| `.htaccess` | Protections du navigateur, cache, accès interdit aux fichiers de réglages, HTTPS à activer |
| `fonts/`, `vendor/gsap.min.js` | Polices Sora et Plus Jakarta Sans (licence SIL OFL) ; bibliothèque d'animation de la démo (copiée dans `demo/`) |
| `img/` | Image de partage. `img/apercus/` (captures de l'ancienne section « Aperçus », refaites par `outils/apercus.js`) n'est plus affiché ni copié dans `dist/` |
| `build.py` | Assemble `dist/` (site, démo, PHP) ou `dist-apercu/` |
| `outils/` | Scripts de l'image de partage et du carrousel des rubriques (et des captures de l'ancienne section « Aperçus ») |

Les textes reprennent ce que fait réellement le prototype (module Obligations, parcours, espaces). Les règles juridiques
citées (seuils, règles de franchissement de la loi PACTE, entretien de parcours professionnel) sont à faire relire par un
professionnel du droit social avant la mise en ligne.

Le carrousel des douze rubriques (section « De A à Z ») est généré par `site/outils/rubriques.py` : textes, couleurs et
illustrations SVG y sont réunis. Modifie le script puis lance `python3 site/outils/rubriques.py` (il met à jour
`index.html` entre les repères `rubriques:debut` et `rubriques:fin`, et la planche `site/maquettes/carrousel-rubriques.html`).
Les textes décrivent ce que fait réellement le prototype : à mettre à jour quand l'application évolue.
Au survol (ou au focus clavier), une « goutte d'encre » de la teinte de la rubrique part du coin inférieur droit et couvre
la carte, puis se résorbe au départ du pointeur (`.rcarte::before` dans `styles.css`). Elle est désactivée si le visiteur a
demandé à réduire les animations.

Le questionnaire de l'accroche pose quatre questions (effectif, rôle, rubrique à découvrir, adresse e-mail), puis
affiche « Votre démo est prête » et le bouton « Tester Teamora ». Un clic sur une réponse passe à la question suivante.
Les rubriques proposées sont reprises des cartes du carrousel. Le lien vers la démo hébergée porte les réponses
(`demo/?profil=…&rubrique=…&effectif=…`) ; la démo ne les lit pas encore. **Le champ e-mail sert au rendu : rien n'est
envoyé ni enregistré.** Avant de le brancher, ajoute près du champ une mention d'information (finalité, durée de
conservation, droits) et complète la politique de confidentialité.

Les sections « Aperçus » (avec « Pour qui ? » et les cartes paie, tarif et démo), « Garde-fou juridique » et « Exemples »
ont été retirées de la page ; elles restent dans l'historique Git. Si les exemples reviennent, garde-les marqués « Exemple
fictif » tant qu'ils ne sont pas de vrais cas clients (avec l'accord écrit des entreprises).
