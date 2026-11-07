# Procédure Contre-Prompt : comment Claude Code répond au Studio

Le **Studio Contre-Prompt** est un artefact (page privée) relié à la session Claude Code.
Il envoie des messages commençant par `[Studio Contre-Prompt] ACTION=…` et affiche ce que Claude Code écrit dans sa base.

**Canal d'envoi** : les boutons du Studio postent un commentaire sur l'artefact et l'envoient à Claude (fonction « Envoyer à Claude » de claude.ai). La session, qui surveille l'artefact, est réveillée par un tour `[Artifact comment sent to Claude]`. Tous les envois vont dans **un seul fil** (identifiant gardé dans `meta/channel`, champ `threadId`).
À la réception : 1) lire le fil avec `ArtifactComments` (`read`), 2) répondre par un court accusé dans le fil (`reply`), 3) travailler et tenir la base à jour, 4) ne **pas** résoudre le fil, la conversation continue. Un message dépasse rarement 4 Ko : les détails du protocole sont ici, pas dans le message.
(Le connecteur « Claude Code Remote » a été abandonné : il ne se charge pas depuis le compte de Leopold.)

- Artefact : https://claude.ai/artifact/8hLF4hUjzxpN9Z85fKSvaT (copie du code : `contre-prompt/studio/studio.html`)
- Les vidéos vivent dans `contre-prompt/<id>/` (`<id>` = sujet sans accents, en minuscules, séparé par des tirets).
- La première vidéo (`pourquoi-la-mer-est-salee`) est la référence de format et de qualité.

## Règles de fond (venant du brief de Leopold)

- Rigueur : rechercher, ne jamais s'appuyer sur la mémoire pour un chiffre ou une date, ne rien inventer. L'incertain se dit comme une question. Chaque affirmation a sa source dans `fiche-sources.md`.
- Voix off lue par Leopold lui-même (jamais de synthèse vocale) : environ 1 min à 1 min 20 ; dépasser légèrement 1 min 15 n'est pas un problème (Leopold, 2026-11-05) : **la cohérence des propos et la compréhension passent avant la durée**. Ne pas supprimer une explication ou une étape du raisonnement pour tenir le chrono ; viser 1 min 30 au plus, et si le sujet ne tient pas, le dire plutôt que de le survoler. Ton narratif, phrases courtes, tutoiement, termes techniques expliqués, accroche forte dès la première phrase, révélation vers les deux tiers, fin qui ramène au spectateur. Nombres écrits en lettres. Pas de nom de source dans la voix, sauf si la découverte fait partie de l'histoire.
- Vidéo : 9:16, sans voix, sous-titres lisibles, sujet grand à l'écran, image qui change souvent. **La recette complète (accroche, rythme, illustrations, couleurs, images réelles, couverture, textes, mesure) est dans « Recette de création » plus bas : elle s'applique à toute nouvelle vidéo depuis le 2026-11-05.**
- **Appels à l'action (demandés par Leopold le 2026-11-05, pour les vidéos créées à partir de cette date ; ne PAS modifier les quatre vidéos déjà créées : mer salée, flamants, Internet, câbles sous-marins).** Deux phrases, dites par Leopold dans la voix off, tutoiement, ton chaleureux, nombres en lettres :
  1. **Au milieu** (vers 45 à 55 % de la voix, entre deux parties, jamais dans les 15 premières secondes ni juste avant la révélation, qui reste vers les deux tiers) : « Sur cette chaîne, je t'apprends des choses tous les jours. Abonne-toi pour te coucher plus intelligent ce soir. » (environ 6 s.)
  2. **À la fin**, après la phrase qui ramène au spectateur et en tout dernier : « Tu as appris quelque chose ? Commente la vidéo pour me le dire. » (environ 4 s.)
  Ces deux phrases ajoutent environ 10 s : en tenir compte sans sacrifier la compréhension du contenu (voir la règle sur la durée). Écrire dans `script.txt` les repères `{cta1}` et `{cta2}` au début de chaque phrase ; ne pas toucher à la formulation sans que Leopold le demande (on peut seulement l'adapter si elle fait une répétition avec la phrase voisine).
  À l'écran, sans nouvelle scène ni nouveau balayage : une étiquette de papier par-dessus la scène en cours, qui apparaît au repère et reste pendant la phrase. Milieu : « ABONNE-TOI » avec une petite cloche en papier découpé (couleur d'action du projet). Fin : « COMMENTE » avec une bulle de dialogue et « Tu as appris quelque chose ? ». Les sous-titres suivent comme pour le reste. Dans `voix-off.md`, ajouter ces deux phrases au texte et au tableau des repères, et signaler qu'elles sont des appels à l'action. Dans la légende Instagram, rien à ajouter.
- Livrables par vidéo : `voix-off.md`, vidéo sans voix `.mp4`, `legende-instagram.md` (sources comprises), `fiche-sources.md`, `couverture.png`.

## Recette de création (toute nouvelle vidéo depuis le 2026-11-05)

Elle vient de l'audit `contre-prompt/AUDIT-contenu.md`. **Les vidéos déjà créées (mer salée, flamants, Internet, câbles sous-marins, Milgram) ne sont pas retouchées**, même pour les défauts relevés. Point de départ technique : copier `contre-prompt/modele/source/` vers `contre-prompt/<id>/source/` (moteur papier découpé, `brand.js` : personnages, bulles, appels à l'action, gabarit de couverture, marges de l'interface ; `build.sh` et `monter_final.sh` prennent l'identifiant en argument).

**1. Accroche (0 à 3 s)**
- Première phrase de **12 mots au maximum**, avec une tension : contradiction, chiffre surprenant ou situation à la deuxième personne. Elle ne reprend pas le titre mot pour mot et ne dégonfle pas la promesse (pas de « impossible à… » en première phrase).
- **Un élément visuel fort dès la première seconde** (grand objet, grand chiffre, personnage expressif), pas seulement du texte. Premier événement visuel avant 2 s ; premier balayage de scène vers 5 à 7 s.
- La réponse reste cachée jusqu'à la révélation ou au retournement (vers les deux tiers).

**2. Textes prononcés**
- **Une idée par phrase, 15 mots au plus.** Leopold lit vite (190 à 205 mots par minute mesurés) : phrases courtes, pas de longue subordonnée, une phrase doit se dire d'un souffle. Estimation de `timing.py` × 0,86 ≈ durée réelle de sa lecture.
- **Trois chiffres dits au plus** par vidéo ; les autres vont à l'image. Rapprocher un chiffre d'une chose connue (« deux sur trois », « quatre fois la distance Terre–Lune »).
- **Une phrase de relance toutes les 15 à 20 s** (« Mais ce n'est pas tout. », « Et là, surprise. »).
- **Finir sur une boucle** : la dernière phrase de fond renvoie à l'accroche.
- **Appel à l'action de fin : alterner** d'une vidéo à l'autre. Variante A (Milgram l'a utilisée) : « Tu as appris quelque chose ? Commente la vidéo pour me le dire. » Variante B : « Tu connais quelqu'un qui devrait savoir ça ? Envoie-lui la vidéo. » La prochaine vidéo utilise la **B**, puis on alterne ; indiquer la variante dans `voix-off.md`. Les envois en message privé seraient un signal fort du classement (non vérifié officiellement). Dans la vidéo : `ctaComment` (A) ou `ctaSend` (B) de `brand.js`.
- **Appel à l'action du milieu** : phrase fixe, voir « Règles de fond ». À tester : si les statistiques montrent une chute de visionnage à ce moment, le décaler après la révélation.
- La compréhension passe avant la durée. Si la voix dépasse environ 1 min 30 réelle, **proposer à Leopold de couper en deux épisodes** dans le message de fin ; ne pas décider seul.

**3. Rythme visuel**
- **Scène de 5 à 7 s** (jamais plus de 10 s) et **un événement visuel net toutes les 2 à 4 s** : zoom, nouveau décor, personnage qui apparaît, chiffre qui change d'échelle. Règle de fond : l'image change quand l'idée change.
- **Un grand moment image à la révélation** (élément qui change d'échelle, chiffre géant, contraste de couleur), pas seulement un texte qui apparaît.
- Balayage de papier constant entre les scènes (déjà dans `lib.js`).

**4. Illustrations et couleurs**
- **Personnages avec une émotion** (yeux, bouche, réactions, petits mouvements) : `person` de `brand.js`, ou des animaux et objets expressifs.
- **Remplir la composition** : éléments entre y = 250 et y = 1 300, pas de grande bande vide (fond marin, sol) ; ne rien mettre d'essentiel au-dessus de y = 250 ni sous y = 1 570 (interface Instagram) ; **la zone y ≥ 1 280 est réservée aux sous-titres** : aucune étiquette ne doit passer dessous.
- **Texte à comprendre : 50 px minimum** (un texte plus petit est du décor).
- **Couleur d'accent fixe** : le corail `#ff6a4d` (`BRAND.accent`) pour ce qu'il faut regarder en premier ; un élément saturé sur fond plus calme dès la première image ; palette sombre seulement si le sujet l'impose ; pas de grande surface grise ou brune unie.

**5. Images réelles : au minimum une par vidéo, et le plus possible**
- **Chaque vidéo contient au minimum une image réelle libre de droits, et on en ajoute autant que possible** : chaque fois qu'une photo, un document d'archive ou une image satellite montre ou prouve mieux qu'un dessin, on l'utilise. Viser 3 à 5 images réelles pour une vidéo d'une minute, davantage si les sources le permettent. Une vidéo sans image réelle n'est livrée que si aucune image libre n'existe, et la fiche de sources dit alors ce qui a été cherché.
- **Chercher avant d'écrire les scènes**, pas après : `python3 contre-prompt/outils/chercher_images.py "mot clé"` (NASA, Wikimedia Commons ; Commons répond parfois 429 : réessayer plus tard). Autres sources à consulter : NOAA, Library of Congress, Smithsonian Open Access, Europeana, Internet Archive.
- **Licences admises** : domaine public, CC0, CC BY, CC BY-SA (avec crédit). Vérifier la page de l'image avant usage. **Jamais** de personne privée identifiable, de logo de marque ni de photo d'une œuvre protégée.
- **Intégrer l'image** dans l'animation (`photoCard` : cadre, ruban adhésif, léger mouvement, recadrage), au moment de la preuve ou de la révélation ; jamais en plein écran.
- **Crédits** : dans le tableau « Images » de `fiche-sources.md` (auteur, source, licence, lien) et dans la légende (ligne « Images : … »).

**6. Couverture**
- Gabarit unique : `coverTemplate` de `brand.js` (mot-clé GROS lisible en miniature, titre entre y = 330 et y = 800, étiquette d'accent ; aucune signature ni nom de chaîne sur la couverture). Lancer `contre-prompt/outils/verifier_couverture.sh <dossier>` et regarder `_couv_3x4.png` (rien de coupé dans le cadrage de la grille) et `_couv_miniature.png` (titre lisible à 300×400).

**7. Légende**
- Première ligne = la question, avec les mots qu'on tape ; au plus 2 200 caractères, sources et crédits d'images compris ; six hashtags au plus.

**8. Choix des sujets (`ACTION=proposer_sujets`)**
- Chaque sujet proposé coche au moins 3 critères sur 4 : une contradiction ou un chiffre surprenant en une phrase ; un lien avec la vie quotidienne ; **une image montrable, dont au moins une image réelle libre déjà repérée** ; une réponse vérifiable dans des sources lisibles. Écrire dans `why` ce qui est coché et dans `check` ce qu'il faut vérifier **et les images réelles candidates**.

## Base de données de l'artefact

Lecture et écriture avec l'outil `ArtifactData` (url de l'artefact ci-dessus). Chaque écriture sur un document existant demande `if_version` (lire d'abord).

| Collection / document | Écrit par | Contenu |
|---|---|---|
| `videos/<id>` | page (et Claude pour `stage`, `summary`, `duration`, `words`, `format`) | `title`, `summary`, `angle`, `stage` (0 à 5), `checks{voix,video,legende,sources,couverture}`, `stats` (saisi par Leopold à l'étape Publiée, voir `ACTION=bilan_stats`), `publishedAt`, `note`, `folder`, `audio{name,type,size,chunks,uploadedAt}`, `createdAt`, `updatedAt` (ms) |
| `jobs/<id>` | **Claude seul** | `creation` et `montage` : `{state: running\|done\|error, pct 0-100, step, steps:[{label, state: todo\|doing\|done}], message?, updatedAt}` |
| `media/<id>` | Claude | `previewUrl`, `coverUrl`, `finalUrl` (adresses `/_blob/<id>` des fichiers déposés), `hq{video, final, cover, dossier}` (liens GitHub), `updatedAt` |
| `texts/<id>` | Claude | `voix` (texte à lire seul), `legende` (bloc à copier), `sources` (markdown complet) |
| `ideas/<id>` | Claude (création), page (statut) | `title` (la question), `hook`, `angle`, `why`, `check`, `status: proposed\|chosen\|dismissed`, `batch`, `createdAt`, `videoId?` |
| `audio/<id>-<n>` | page | morceaux base64 (`b64`) de l'enregistrement de Leopold, `videoId`, `n`, `total`, `type` |
| `requests/*` | page | journal des messages envoyés |
| `meta/channel` | page | `threadId` du fil de commentaires utilisé pour parler à Claude |

Étapes (`stage`) : 0 Sujet choisi · 1 En création · 2 À relire · 3 Attente audio · 4 Montage final · 5 Rendu prêt · 6 Publiée (posé sur Instagram, marqué à la main par Leopold ; `publishedAt` est renseigné par la page, Claude n'y touche pas).

## ACTION=proposer_sujets

Proposer 6 sujets (questions du quotidien, une révélation nette, émerveillement ou surprise, montrables). Ne pas répéter les sujets déjà faits ni écartés. Écrire un document `ideas/<slug>` par sujet avec `status="proposed"`. Les accroches sont des hypothèses tant que rien n'est vérifié ; `check` dit ce qu'il faudra vérifier. **Appliquer la grille de la recette (point 8)** : trois critères sur quatre au moins, dont une image réelle libre repérée (`outils/chercher_images.py`).

## ACTION=creer_video

1. Mettre `jobs/<id>.creation` à `running`, `pct 0`. Mettre à jour la barre **à chaque étape** :

   | Étape | pct |
   |---|---|
   | Recherche et vérification des sources | 0 à 25 |
   | Écriture de la voix off | 25 à 40 |
   | Animation et rendu de la vidéo sans voix | 40 à 85 |
   | Légende, fiche de sources, couverture | 85 à 95 |
   | Dépôt des fichiers | 95 à 100 |

2. Production : **suivre la « Recette de création »** ci-dessus (accroche, textes, rythme, illustrations, images réelles, couverture, légende). Partir de `contre-prompt/modele/source/` (moteur, `brand.js`, `build.sh <id>`, `monter_final.sh <id>`). Ordre de travail : sources lues, **recherche d'images réelles libres**, voix off (avec les deux appels à l'action), scènes, rendu, couverture (+ `outils/verifier_couverture.sh`), légende, fiche de sources (tableau « Images » avec crédits). Le style peut changer d'un sujet à l'autre tant qu'il reste cohérent avec le sujet et avec l'accent corail de la chaîne.
3. Aperçu : encoder une version allégée (720×1280, CRF 29, moins de 20 Mo) et la couverture en JPEG, les déposer avec l'outil `Artifact` (`url`, `asset: true`, `file_paths`), puis écrire `media/<id>`.
4. Écrire `texts/<id>`, pousser les fichiers sur la branche, puis `jobs/<id>.creation` → `done`, `pct 100`, et `videos/<id>.stage = 2` (+ `duration`, `words`, `format`, `summary`).
5. **Message de fin** (dans la réponse à Leopold) : nombre d'images réelles utilisées, variante de l'appel à l'action de fin, durée estimée de la voix et de la vidéo, proposition de couper en deux épisodes si la voix dépasse environ 1 min 30, et tout ce qui n'a pas pu être vérifié.
6. En cas d'erreur : `state="error"`, `message` clair, `stage` inchangé.

## ACTION=changements

Corriger selon les notes, mettre à jour fichiers, aperçu (`media`), `texts`, la barre `creation`, puis `stage = 2`.

## ACTION=validee

Prendre acte. Rien à modifier. Leopold enregistre sa voix.

## ACTION=monter_rendu_final

1. Lire `audio/<id>-0` à `audio/<id>-<chunks-1>` (`ArtifactData list`, `out_dir`), concaténer les `b64` dans l'ordre de `n`, décoder, enregistrer le fichier.
   Méthode éprouvée sur « Pourquoi la mer est salée ? » (fichier `.m4a`, 58 s) :
   - transcription avec horaires mot à mot : `pip install --target ./pylib faster-whisper`, modèle `small` (téléchargé depuis Hugging Face), audio passé en tableau numpy 16 kHz (`wave` + `numpy`) car PyAV du conteneur est trop ancien ; sortie `asr_words.json` ;
   - recalage : `python3 timing.py --asr asr_words.json` aligne les mots lus sur ceux de `script.txt` (nombres et mots mal reconnus répartis dans leur intervalle), décale tout pour que la voix démarre à 0,25 s (`audio_trim`) ;
   - rendu des images puis `source/monter_final.sh` : coupe le silence de départ, passe-haut 70 Hz, normalisation −16 LUFS, version web 720p ≤ 20 Mo.
2. Mesurer le rythme réel : `ffmpeg silencedetect` pour retrouver les pauses entre phrases (ou une transcription si disponible), faire correspondre aux phrases de `script.txt`, produire un `timing.json` réel.
3. Recaler l'animation sur ce timing, rendre à nouveau, assembler vidéo et voix (`ffmpeg`), normaliser le volume, vérifier la durée.
4. Déposer la version haute qualité sur GitHub, une version web (≤ 20 Mo) en fichier de l'artefact, puis `media/<id>.finalUrl` et `hq.final`.
5. Barre : `jobs/<id>.montage` (réception 0 à 10, analyse du rythme 10 à 35, recalage et rendu 35 à 85, assemblage 85 à 95, dépôt 95 à 100). À la fin : `videos/<id>.stage = 5`.

## Bouton « Enregistrer le dossier (couverture + légende) » (page seule, Claude n'y touche pas)

À partir de l'étape « Rendu prêt », la page propose un bouton qui assemble un fichier `.zip` dans le navigateur et l'enregistre : `aaaa-jj-mm - Mini-doc - nom du doc.zip` (la date est celle du jour de l'enregistrement, ordre année-jour-mois comme demandé). Il contient seulement la couverture en pleine qualité (`media/<id>.coverHqUrl`, PNG ; sinon `coverUrl`) et la légende (`texts/<id>.legende`, en `.txt`). Leopold récupère le rendu final lui-même sur GitHub (`media/<id>.hq.final`) et l'ajoute à la main au dossier.

**Consigne pour Claude** : à chaque vidéo, déposer la couverture PNG comme fichier de l'artefact (`media/<id>.coverHqUrl`), garder `texts/<id>.legende` à jour, et faire pointer `media/<id>.hq.final` vers le rendu final le plus récent sur la branche (version avec bruitages : `<id>_rendu-final_sonore.mp4`, voir `outils/ajouter_sons.sh`).

## ACTION=bilan_stats

Quand Leopold le demande (ou après 5 vidéos mesurées), lire `videos/*` qui ont `stats` : `stats.j1` et `stats.j7` = `{vues, duree_moy_s, pct_fin, envois, enregistrements, abonnes}` (24 h et 7 jours après la publication). Comparer les vidéos : accroche, durée, nombre de scènes, nombre d'images réelles, palette, variante d'appel à l'action, sujet. **Ne conclure qu'avec au moins 5 vidéos mesurées** et tester **une variable à la fois**. Écrire un bilan court (ce qui marche, ce qui ne marche pas, trois changements à essayer) et mettre à jour cette recette.

## À savoir

- Le message arrive dans la session comme un tour ; l'état de la session est visible dans la pastille du Studio.
- Les chiffres de la fiche de sources doivent venir de pages lues pendant la production, avec un statut : lu, calculé, simplifié, faible.
