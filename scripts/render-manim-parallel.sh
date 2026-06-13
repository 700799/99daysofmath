#!/usr/bin/env bash
# Parallel render of every Manim scene that doesn't already have an mp4 on disk.
# Uses N=$(nproc) workers; renders at -ql for speed.
set -euo pipefail

MANIM=${MANIM:-/tmp/manim-venv/bin/manim}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
SCENES_DIR=$ROOT/manim/scenes
OUT_DIR=$ROOT/public/videos/lessons
N=${PARALLEL:-$(nproc)}

mkdir -p "$OUT_DIR"
cd "$SCENES_DIR"

render_one() {
  local f=$1
  local base=${f%.py}
  local rest=${base#lesson_}
  IFS=_ read -r maj min unit part <<<"$rest"
  local domain="${maj}.${min}"
  local klass out_name
  if [ -n "${part:-}" ]; then
    local cap="$(tr '[:lower:]' '[:upper:]' <<<"${part:0:1}")${part:1}"
    klass="Lesson${maj}${min}${unit}${cap}"
    out_name="${domain}-${unit}-${part}.mp4"
  else
    klass="Lesson${maj}${min}${unit}"
    out_name="${domain}-${unit}.mp4"
  fi
  if [ -f "$OUT_DIR/$out_name" ]; then return 0; fi
  echo "→ $out_name"
  "$MANIM" -ql --disable_caching -o "$out_name" "$f" "$klass" >/dev/null 2>&1
  cp "media/videos/${base}/480p15/${out_name}" "$OUT_DIR/$out_name" 2>/dev/null || echo "FAIL: $out_name"
}
export -f render_one
export MANIM OUT_DIR

# Build the file list.
shopt -s nullglob
files=()
for glob in lesson_6_RP_[1-9].py lesson_6_RP_10.py lesson_6_NS_[1-9].py lesson_6_NS_10.py lesson_6_EE_[1-9].py lesson_6_EE_10.py lesson_6_G_[1-9].py lesson_6_G_10.py lesson_6_SP_[1-9].py lesson_6_SP_10.py lesson_*_examples.py lesson_*_trap.py lesson_5_F_*_idea.py; do
  for f in $glob; do
    files+=("$f")
  done
done
echo "Total scenes considered: ${#files[@]}, workers: $N"

printf '%s\n' "${files[@]}" | xargs -P "$N" -I{} bash -c 'render_one "$@"' _ {}

echo "Done. Videos in $OUT_DIR:"
ls "$OUT_DIR" | wc -l
