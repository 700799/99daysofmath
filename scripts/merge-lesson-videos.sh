#!/usr/bin/env bash
# Merge each lesson's idea / examples / trap MP4s into a single -lesson.mp4
# so the React side shows ONE "Watch the lesson" tile per lesson instead of
# three competing ones. Stories stay separate.
#
# For each `<domain>-<unit>.mp4` we look for `<domain>-<unit>-examples.mp4`
# and `<domain>-<unit>-trap.mp4`. If any of the three exist, we concat them
# in idea → examples → trap order and write:
#   public/videos/lessons/<domain>-<unit>-lesson.mp4
#   public/videos/lessons/<domain>-<unit>-lesson.chapters.json
#
# The chapters sidecar carries the breakpoints between sections so the
# LessonVideo player can pause between segments (kid-paced).
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
LESSONS=$ROOT/public/videos/lessons
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# Find every "idea" mp4 (no suffix). For each, see what siblings exist.
shopt -s nullglob
ideas=("$LESSONS"/*-[0-9].mp4 "$LESSONS"/*-[0-9][0-9].mp4)

duration_of() {
  ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$1" 2>/dev/null
}

merge_one() {
  local idea=$1
  local base="${idea%.mp4}"          # full path without .mp4
  local stem=$(basename "$base")     # e.g. "6.RP-1"
  local examples="$LESSONS/${stem}-examples.mp4"
  local trap="$LESSONS/${stem}-trap.mp4"
  local out="$LESSONS/${stem}-lesson.mp4"
  local out_ch="$LESSONS/${stem}-lesson.chapters.json"

  local list="$TMP/${stem}.list"
  : > "$list"
  local checkpoints=()
  local elapsed=0

  for src in "$idea" "$examples" "$trap"; do
    if [ -f "$src" ]; then
      local d=$(duration_of "$src")
      if [ -z "$d" ]; then
        echo "WARN: no duration for $src" >&2
        continue
      fi
      echo "file '$src'" >> "$list"
      elapsed=$(awk -v a="$elapsed" -v b="$d" 'BEGIN {printf "%.2f", a + b}')
      checkpoints+=("$elapsed")
    fi
  done

  if [ ! -s "$list" ]; then
    echo "skip $stem (no parts)" >&2
    return
  fi
  # Need at least 2 parts to be worth merging.
  local n_parts=$(wc -l < "$list")
  if [ "$n_parts" -lt 2 ]; then
    echo "skip $stem (only $n_parts part)" >&2
    return
  fi

  echo "→ $stem ($n_parts parts → ${elapsed}s)"
  # -c copy is fastest but needs identical codecs; manim's outputs all match
  # (h264 480p15), so concat without re-encoding works.
  ffmpeg -y -f concat -safe 0 -i "$list" -c copy "$out" >/dev/null 2>&1 || {
    # Fall back to re-encoding if stream copy fails.
    ffmpeg -y -f concat -safe 0 -i "$list" -c:v libx264 -preset veryfast -crf 23 "$out" >/dev/null 2>&1
  }

  # The last entry of checkpoints is the total — drop it from checkpoints,
  # use as "total".
  local total=${checkpoints[-1]}
  unset 'checkpoints[-1]'
  local joined=$(IFS=,; echo "${checkpoints[*]:-}")
  printf '{"checkpoints": [%s], "total": %s}' "$joined" "$total" > "$out_ch"
}

count=0
for idea in "${ideas[@]}"; do
  # Skip story videos that happen to match the glob (we exclude them by name).
  case "$(basename "$idea")" in
    *-story.mp4|*-examples.mp4|*-trap.mp4|*-lesson.mp4) continue ;;
  esac
  merge_one "$idea"
  count=$((count + 1))
done
echo "merged $count lessons; outputs in $LESSONS/*-lesson.mp4"
