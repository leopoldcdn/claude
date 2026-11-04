#!/bin/bash
# Assemble la video silencieuse 1080x1920, 30 i/s, a partir des images rendues (15 i/s, doublees).
set -e
cd "$(dirname "$0")/.."
ffmpeg -y -loglevel error -framerate 15 -i _frames/f%05d.jpg -vf "fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 23 -maxrate 10M -bufsize 20M -movflags +faststart -an \
  "pourquoi-la-mer-est-salee_sans-voix.mp4"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,duration:format=size -of default=nw=1 "pourquoi-la-mer-est-salee_sans-voix.mp4"
