#!/usr/bin/env bash
# Render every Manim lesson scene and copy the MP4 into public/videos/lessons/.
# Each scene file is `manim/scenes/lesson_<domain>_<unit>.py` with class
# `Lesson<domain><unit>` (dots stripped). E.g. lesson_6_G_1.py → Lesson6G1.

set -euo pipefail

MANIM=${MANIM:-/tmp/manim-venv/bin/manim}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
SCENES_DIR=$ROOT/manim/scenes
OUT_DIR=$ROOT/public/videos/lessons

mkdir -p "$OUT_DIR"

if ! command -v "$MANIM" >/dev/null 2>&1 && [ ! -x "$MANIM" ]; then
  echo "manim not found at $MANIM — set MANIM=/path/to/manim" >&2
  exit 1
fi

cd "$SCENES_DIR"

for f in lesson_*.py; do
  [ -e "$f" ] || continue
  base=${f%.py}                          # lesson_6_G_1
  rest=${base#lesson_}                   # 6_G_1
  IFS=_ read -r domain_major domain_minor unit <<<"$rest"
  domain="${domain_major}.${domain_minor}"  # 6.G
  klass="Lesson${domain_major}${domain_minor}${unit}"  # Lesson6G1
  out_name="${domain}-${unit}.mp4"        # 6.G-1.mp4

  echo "==> rendering $klass → $out_name"
  "$MANIM" -qm --disable_caching -o "$out_name" "$f" "$klass" >/dev/null
  cp "media/videos/${base}/720p30/${out_name}" "$OUT_DIR/$out_name"
done

echo "Done. Videos in $OUT_DIR:"
ls -la "$OUT_DIR"
