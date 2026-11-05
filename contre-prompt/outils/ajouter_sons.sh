#!/bin/bash
# Ajoute musique d'ambiance + bruitages ORIGINAUX (synthetises, sans licence) sous la voix d'un rendu final.
# Usage : ./ajouter_sons.sh <dossier-video> [musique_dB] [bruitages_dB]     (ex. ../pourquoi-la-mer-est-salee, -19, -14)
# Le rendu avec voix seule n'est pas modifie : on cree <nom>_rendu-final_sonore.mp4.
set -e
D="$(cd "$1" && pwd)"; MUS="${2:--19}"; FXDB="${3:--14}"; HERE="$(cd "$(dirname "$0")" && pwd)"
NAME="$(basename "$D")"; SRC="$D/${NAME}_rendu-final.mp4"; OUT="$D/${NAME}_rendu-final_sonore.mp4"; TMP="$(mktemp -d)"
[ -f "$SRC" ] || { echo "pas de rendu final : $SRC"; exit 1; }
node "$HERE/plan_times.js" "$D/source" > "$TMP/plan.json"
python3 "$HERE/sound.py" "$TMP/plan.json" "$TMP/musique.wav" "$TMP/fx.wav"
PRE="[0:a]aformat=sample_fmts=fltp:channel_layouts=stereo,asplit=2[voix][voix_sc];
 [1:a]volume=${MUS}dB[mus];
 [mus][voix_sc]sidechaincompress=threshold=0.02:ratio=10:attack=30:release=600:makeup=1[musd];
 [2:a]volume=${FXDB}dB[fx];
 [voix][musd][fx]amix=inputs=3:normalize=0:duration=first[mix]"
# passe 1 : mesure ; passe 2 : normalisation lineaire a -16 LUFS (reseaux sociaux), crete -1,5 dB
M=$(ffmpeg -nostats -i "$SRC" -i "$TMP/musique.wav" -i "$TMP/fx.wav" -filter_complex "$PRE;[mix]loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json[a]" -map "[a]" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import sys,json;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -loglevel error -i "$SRC" -i "$TMP/musique.wav" -i "$TMP/fx.wav" -filter_complex "$PRE;[mix]loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"
ls -la "$OUT"; ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
rm -rf "$TMP"
