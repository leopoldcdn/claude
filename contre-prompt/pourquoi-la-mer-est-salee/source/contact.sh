#!/bin/bash
# planche contact des images de controle : contact.sh sortie.png img1 img2 ...
out="$1"; shift
convert "$@" -resize 360x640 -bordercolor '#222' -border 4 +append "$out"
