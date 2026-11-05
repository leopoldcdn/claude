#!/bin/bash
# Ajoute musique de banque + bruitages (Mixkit, voir sons/SOURCES.md) sous la voix d'un rendu final, avec baisse automatique de la musique sous la voix.
# Usage : ./ajouter_sons.sh <dossier-video> <id-musique> [niveau_musique_dB=-10] [niveau_bruitages_dB=0]
#   ids de musique disponibles : voir sons/musique/ (ex. 1167, 90, 506, 69) ; "none" = bruitages seuls, sans musique
# Le rendu avec voix seule n'est pas modifie : on cree <nom>_rendu-final_sonore_<id>.mp4.
set -e
D="$(cd "$1" && pwd)"; MID="$2"; MUS="${3:--10}"; FXDB="${4:-0}"; HERE="$(cd "$(dirname "$0")" && pwd)"
NAME="$(basename "$D")"; SRC="$D/${NAME}_rendu-final.mp4"; OUT="$D/${NAME}_rendu-final_sonore_${MID}.mp4"; TMP="$(mktemp -d)"
[ -f "$SRC" ] || { echo "pas de rendu final : $SRC"; exit 1; }
node "$HERE/plan_times.js" "$D/source" > "$TMP/plan.json"
python3 "$HERE/mixbank.py" "$TMP/plan.json" "$HERE/sons/musique/$MID.mp3" "$TMP/musique.wav" "$TMP/fx.wav"
PRE="[0:a]aformat=sample_fmts=fltp:channel_layouts=stereo,asplit=2[voix][voix_sc];
 [1:a]volume=${MUS}dB[mus];
 [mus][voix_sc]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=450:makeup=1[musd];
 [2:a]volume=${FXDB}dB[fx];
 [voix][musd][fx]amix=inputs=3:normalize=0:duration=first[mix]"
M=$(ffmpeg -nostats -i "$SRC" -i "$TMP/musique.wav" -i "$TMP/fx.wav" -filter_complex "$PRE;[mix]loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json[a]" -map "[a]" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import sys,json;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -loglevel error -i "$SRC" -i "$TMP/musique.wav" -i "$TMP/fx.wav" -filter_complex "$PRE;[mix]loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"
ffmpeg -y -loglevel error -i "$OUT" -vf scale=720:-2 -c:v libx264 -preset slow -crf 27 -c:a aac -b:a 128k -movflags +faststart "${OUT%.mp4}_web.mp4"
ls -la "$OUT" "${OUT%.mp4}_web.mp4"
rm -rf "$TMP"
