#!/bin/bash
# Montage final : images rendues (15 i/s) + voix enregistree -> rendu final 1080x1920 avec son.
# Usage : ./monter_final.sh voix.m4a   (utilise audio_trim et video_end de timing.json)
set -e
cd "$(dirname "$0")/.."
AUDIO="${1:-source/voix-leopold.m4a}"
TRIM=$(python3 -c "import json;print(json.load(open('source/timing.json'))['audio_trim'])")
END=$(python3 -c "import json;print(json.load(open('source/timing.json'))['video_end'])")
# voix : on coupe le silence de depart, filtre les graves parasites, normalise le volume pour les reseaux (-16 LUFS), complete par du silence jusqu'a la fin
AF="highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11,apad"
ffmpeg -y -loglevel error -framerate 15 -i _frames/f%05d.jpg -ss "$TRIM" -i "$AUDIO" \
  -vf "fps=30,format=yuv420p" -af "$AF" -c:v libx264 -preset slow -crf 23 -maxrate 10M -bufsize 20M -c:a aac -b:a 192k -ar 48000 -ac 2 -t "$END" -movflags +faststart \
  "pourquoi-la-mer-est-salee_rendu-final.mp4"
# version web allegee (720x1280) pour la relecture dans le Studio
ffmpeg -y -loglevel error -i "pourquoi-la-mer-est-salee_rendu-final.mp4" -vf "scale=720:-2" -c:v libx264 -preset slow -crf 27 -maxrate 3M -bufsize 6M -c:a aac -b:a 128k -movflags +faststart "_rendu-final_web.mp4"
ls -la pourquoi-la-mer-est-salee_rendu-final.mp4 _rendu-final_web.mp4
ffprobe -v error -show_entries stream=codec_name,width,height,duration -of default=nw=1 "pourquoi-la-mer-est-salee_rendu-final.mp4"
