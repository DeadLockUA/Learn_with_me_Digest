#!/usr/bin/env bash
# Usage: tools/duck/process_clip.sh <input video> <name> [crop_scale]
# Center-crops to a square (crop_scale = fraction of the short side, default 1.0),
# scales to 400x400, trims to 4 s, writes assets/duck/clips/<name>.webm and .mp4.
# For name "idle" it also writes assets/duck/poster.png (first frame).
set -euo pipefail
in="$1"; name="$2"; k="${3:-1.0}"
root="$(cd "$(dirname "$0")/../.." && pwd)"
out="$root/assets/duck/clips"; mkdir -p "$out"
vf="crop='min(iw,ih)*$k':'min(iw,ih)*$k',scale=400:400:flags=lanczos,fps=24,format=yuv420p"
ffmpeg -v error -y -i "$in" -t 4 -an -vf "$vf" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 "$out/$name.webm"
ffmpeg -v error -y -i "$in" -t 4 -an -vf "$vf" -c:v libx264 -crf 26 -preset slow -movflags +faststart "$out/$name.mp4"
if [ "$name" = "idle" ]; then
  ffmpeg -v error -y -i "$in" -frames:v 1 -vf "${vf%,format=yuv420p}" "$root/assets/duck/poster.png"
fi
for f in "$out/$name.webm" "$out/$name.mp4"; do
  size=$(wc -c < "$f")
  [ "$size" -le 614400 ] || echo "WARN: $f is $size bytes (> 600 KB)"
  echo "$f $size"
done
