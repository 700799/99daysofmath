#!/usr/bin/env bash
# Idempotent Manim environment bootstrap. The venv lives in /tmp, which can
# vanish between sessions — run this before scripts/render-manim.sh.

set -euo pipefail

VENV=${VENV:-/tmp/manim-venv}

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "==> installing ffmpeg + cairo/pango build deps"
  apt-get install -y ffmpeg libcairo2-dev libpango1.0-dev pkg-config >/dev/null
fi

if ! command -v latex >/dev/null 2>&1; then
  echo "==> installing minimal LaTeX (needed for Manim NumberLine/Axes labels)"
  apt-get install -y texlive-latex-base texlive-fonts-recommended texlive-latex-extra dvisvgm >/dev/null
fi

if [ ! -x "$VENV/bin/manim" ]; then
  echo "==> creating venv + installing manim"
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install --upgrade pip wheel setuptools --quiet
  "$VENV/bin/pip" install manim --quiet
fi

"$VENV/bin/manim" --version
echo "OK: $VENV/bin/manim ready"
