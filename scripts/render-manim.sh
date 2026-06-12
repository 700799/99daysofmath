#!/usr/bin/env bash
# Render every Manim lesson scene and copy the MP4 into public/videos/lessons/.
#
# Scene file naming (underscored), one Scene class per file:
#   lesson_6_G_1.py           → class Lesson6G1          → 6.G-1.mp4
#   lesson_6_G_1_examples.py  → class Lesson6G1Examples  → 6.G-1-examples.mp4
#   lesson_5_F_2_idea.py      → class Lesson5F2Idea      → 5.F-2-idea.mp4
#
# Pass file globs as args to render a subset, e.g.:
#   scripts/render-manim.sh 'lesson_5_F_*.py'

set -euo pipefail

MANIM=${MANIM:-/tmp/manim-venv/bin/manim}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
SCENES_DIR=$ROOT/manim/scenes
OUT_DIR=$ROOT/public/videos/lessons

mkdir -p "$OUT_DIR"

if [ ! -x "$MANIM" ]; then
  echo "manim not found at $MANIM — run scripts/setup-manim.sh first" >&2
  exit 1
fi

cd "$SCENES_DIR"

GLOBS=("$@")
if [ ${#GLOBS[@]} -eq 0 ]; then GLOBS=('lesson_*.py'); fi

shopt -s nullglob
for glob in "${GLOBS[@]}"; do
for f in $glob; do
  [ -e "$f" ] || continue
  base=${f%.py}                            # lesson_6_G_1_examples
  rest=${base#lesson_}                     # 6_G_1_examples
  IFS=_ read -r maj min unit part <<<"$rest"
  domain="${maj}.${min}"                   # 6.G
  if [ -n "${part:-}" ]; then
    # Capitalize the part for the class name (examples → Examples).
    part_cap="$(tr '[:lower:]' '[:upper:]' <<<"${part:0:1}")${part:1}"
    klass="Lesson${maj}${min}${unit}${part_cap}"   # Lesson6G1Examples
    out_name="${domain}-${unit}-${part}.mp4"       # 6.G-1-examples.mp4
  else
    klass="Lesson${maj}${min}${unit}"              # Lesson6G1
    out_name="${domain}-${unit}.mp4"               # 6.G-1.mp4
  fi

  echo "==> rendering $klass → $out_name"
  "$MANIM" -qm --disable_caching -o "$out_name" "$f" "$klass" >/dev/null
  cp "media/videos/${base}/720p30/${out_name}" "$OUT_DIR/$out_name"
done
done

echo "Done. Videos in $OUT_DIR:"
ls "$OUT_DIR" | wc -l
