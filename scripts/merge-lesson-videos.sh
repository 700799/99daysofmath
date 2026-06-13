#!/usr/bin/env bash
# Merge each lesson's idea / examples / trap MP4s into a single -lesson.mp4
# so the React side shows ONE "Watch the lesson" tile per lesson instead of
# three competing ones. Stories stay separate.
#
# Driven by the examples mp4 (every lesson has one). For each
# `<stem>-examples.mp4` we look for both `<stem>.mp4` AND `<stem>-idea.mp4`
# (5.F uses the explicit `-idea` suffix; the 6.x decks omit it) as the idea
# source, plus `<stem>-trap.mp4`. Whatever exists gets concatenated in
# idea → examples → trap order into:
#   public/videos/lessons/<stem>-lesson.mp4
#   public/videos/lessons/<stem>-lesson.chapters.json
#
# The chapters sidecar carries the breakpoints between sections so the
# LessonVideo player can pause between segments (kid-paced).
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
LESSONS=$ROOT/public/videos/lessons
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

shopt -s nullglob
# Every lesson that has any sectioned content has an examples mp4.
examples_files=("$LESSONS"/*-examples.mp4)

duration_of() {
  ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$1" 2>/dev/null
}

merge_one() {
  local stem=$1                       # e.g. "5.F-1" or "6.RP-7"
  local out="$LESSONS/${stem}-lesson.mp4"
  local out_ch="$LESSONS/${stem}-lesson.chapters.json"

  # Pick the idea source: prefer <stem>-idea.mp4 (5.F), fall back to
  # <stem>.mp4 (6.x). Either may not exist for lessons that ship without an
  # idea section — we still merge examples + trap into one file.
  local idea=""
  if [ -f "$LESSONS/${stem}-idea.mp4" ]; then
    idea="$LESSONS/${stem}-idea.mp4"
  elif [ -f "$LESSONS/${stem}.mp4" ]; then
    idea="$LESSONS/${stem}.mp4"
  fi
  local examples="$LESSONS/${stem}-examples.mp4"
  local trap="$LESSONS/${stem}-trap.mp4"

  local list="$TMP/${stem}.list"
  : > "$list"
  local checkpoints=()
  local elapsed=0

  local parts=()
  [ -n "$idea" ] && [ -f "$idea" ] && parts+=("$idea")
  [ -f "$examples" ] && parts+=("$examples")
  [ -f "$trap" ] && parts+=("$trap")

  for src in "${parts[@]}"; do
    local d
    d=$(duration_of "$src")
    if [ -z "$d" ]; then
      echo "WARN: no duration for $src" >&2
      continue
    fi
    echo "file '$src'" >> "$list"
    elapsed=$(awk -v a="$elapsed" -v b="$d" 'BEGIN {printf "%.2f", a + b}')
    checkpoints+=("$elapsed")
  done

  if [ ! -s "$list" ]; then
    echo "skip $stem (no parts)" >&2
    return 1
  fi
  local n_parts=$(wc -l < "$list")
  if [ "$n_parts" -lt 2 ]; then
    echo "skip $stem (only $n_parts part)" >&2
    return 1
  fi

  echo "→ $stem ($n_parts parts → ${elapsed}s)"
  ffmpeg -y -f concat -safe 0 -i "$list" -c copy "$out" >/dev/null 2>&1 || {
    ffmpeg -y -f concat -safe 0 -i "$list" -c:v libx264 -preset veryfast -crf 23 "$out" >/dev/null 2>&1
  }

  local total=${checkpoints[-1]}
  unset 'checkpoints[-1]'
  local joined=$(IFS=,; echo "${checkpoints[*]:-}")
  printf '{"checkpoints": [%s], "total": %s}' "$joined" "$total" > "$out_ch"
  return 0
}

count=0
for ex in "${examples_files[@]}"; do
  base=$(basename "$ex")
  stem="${base%-examples.mp4}"
  if merge_one "$stem"; then
    count=$((count + 1))
  fi
done
echo "merged $count lessons; outputs in $LESSONS/*-lesson.mp4"
