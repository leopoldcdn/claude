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
- Voix off lue par Leopold lui-même (jamais de synthèse vocale) : 45 s à 1 min 15, ton narratif, phrases courtes, tutoiement, termes techniques expliqués, accroche forte dès la première phrase, révélation vers les deux tiers, fin qui ramène au spectateur. Nombres écrits en lettres. Pas de nom de source dans la voix, sauf si la découverte fait partie de l'histoire.
- Vidéo : 9:16, sans voix, sous-titres lisibles, sujet grand à l'écran, image qui change souvent. Images réelles seulement si libres de droits (Wikimedia Commons, NASA, NOAA, domaine public), intégrées dans l'animation, jamais plein écran. Pas de personnes privées.
- Livrables par vidéo : `voix-off.md`, vidéo sans voix `.mp4`, `legende-instagram.md` (sources comprises), `fiche-sources.md`, `couverture.png`.

## Base de données de l'artefact

Lecture et écriture avec l'outil `ArtifactData` (url de l'artefact ci-dessus). Chaque écriture sur un document existant demande `if_version` (lire d'abord).

| Collection / document | Écrit par | Contenu |
|---|---|---|
| `videos/<id>` | page (et Claude pour `stage`, `summary`, `duration`, `words`, `format`) | `title`, `summary`, `angle`, `stage` (0 à 5), `checks{voix,video,legende,sources,couverture}`, `note`, `folder`, `audio{name,type,size,chunks,uploadedAt}`, `createdAt`, `updatedAt` (ms) |
| `jobs/<id>` | **Claude seul** | `creation` et `montage` : `{state: running\|done\|error, pct 0-100, step, steps:[{label, state: todo\|doing\|done}], message?, updatedAt}` |
| `media/<id>` | Claude | `previewUrl`, `coverUrl`, `finalUrl` (adresses `/_blob/<id>` des fichiers déposés), `hq{video, final, cover, dossier}` (liens GitHub), `updatedAt` |
| `texts/<id>` | Claude | `voix` (texte à lire seul), `legende` (bloc à copier), `sources` (markdown complet) |
| `ideas/<id>` | Claude (création), page (statut) | `title` (la question), `hook`, `angle`, `why`, `check`, `status: proposed\|chosen\|dismissed`, `batch`, `createdAt`, `videoId?` |
| `audio/<id>-<n>` | page | morceaux base64 (`b64`) de l'enregistrement de Leopold, `videoId`, `n`, `total`, `type` |
| `requests/*` | page | journal des messages envoyés |
| `meta/channel` | page | `threadId` du fil de commentaires utilisé pour parler à Claude |

Étapes (`stage`) : 0 Sujet choisi · 1 En création · 2 À relire · 3 Attente audio · 4 Montage final · 5 Rendu prêt · 6 Publiée (posé sur Instagram, marqué à la main par Leopold ; `publishedAt` est renseigné par la page, Claude n'y touche pas).

## ACTION=proposer_sujets

Proposer 6 sujets (questions du quotidien, une révélation nette, émerveillement ou surprise, montrables). Ne pas répéter les sujets déjà faits ni écartés. Écrire un document `ideas/<slug>` par sujet avec `status="proposed"`. Les accroches sont des hypothèses tant que rien n'est vérifié ; `check` dit ce qu'il faudra vérifier.

## ACTION=creer_video

1. Mettre `jobs/<id>.creation` à `running`, `pct 0`. Mettre à jour la barre **à chaque étape** :

   | Étape | pct |
   |---|---|
   | Recherche et vérification des sources | 0 à 25 |
   | Écriture de la voix off | 25 à 40 |
   | Animation et rendu de la vidéo sans voix | 40 à 85 |
   | Légende, fiche de sources, couverture | 85 à 95 |
   | Dépôt des fichiers | 95 à 100 |

2. Production : réutiliser le moteur de `contre-prompt/pourquoi-la-mer-est-salee/source/` (`lib.js` : papier découpé, cubes de sel, étiquettes, sous-titres ; `render.js` + `build.sh` ; `timing.py` pour estimer le débit). Écrire de nouvelles scènes pour le sujet dans `contre-prompt/<id>/source/`. Le style peut changer d'un sujet à l'autre tant qu'il reste cohérent avec le sujet.
3. Aperçu : encoder une version allégée (720×1280, CRF 29, moins de 20 Mo) et la couverture en JPEG, les déposer avec l'outil `Artifact` (`url`, `asset: true`, `file_paths`), puis écrire `media/<id>`.
4. Écrire `texts/<id>`, pousser les fichiers sur la branche, puis `jobs/<id>.creation` → `done`, `pct 100`, et `videos/<id>.stage = 2` (+ `duration`, `words`, `format`, `summary`).
5. En cas d'erreur : `state="error"`, `message` clair, `stage` inchangé.

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

## À savoir

- Le message arrive dans la session comme un tour ; l'état de la session est visible dans la pastille du Studio.
- Les chiffres de la fiche de sources doivent venir de pages lues pendant la production, avec un statut : lu, calculé, simplifié, faible.
