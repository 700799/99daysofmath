# Manim explainer animations

Short (≈20–30 s) Manim videos that explain each unit's core idea. Authored
with `manim` 0.20+ (Pango/Cairo, no LaTeX). One scene class per lesson,
keyed by `${domain}-${unit}`.

## Rendering one scene

```sh
# Render at 720p30; output ends up under media/videos/<file>/720p30/
/tmp/manim-venv/bin/manim -qm --disable_caching \
  -o 6.G-1.mp4 manim/scenes/lesson_6_G_1.py Lesson6G1

# Copy the result into the app's public assets:
cp manim/scenes/media/videos/lesson_6_G_1/720p30/6.G-1.mp4 \
   public/videos/lessons/6.G-1.mp4
```

## Rendering everything

```sh
./scripts/render-manim.sh
```

renders every `manim/scenes/lesson_*.py` and copies the MP4s into
`public/videos/lessons/`.

## Wiring a video into a lesson

In `src/data/lessons.ts`, set `videoSrc: '<filename>.mp4'` on the relevant
lesson entry. `LessonCard` inserts an "Animation" page between Intro and
the text "Key idea" whenever `videoSrc` is set.

## Math correctness

Every scene includes a docstring listing the numerical claims it makes,
so they are easy to audit. Animations use only plain `Text` and Manim
shapes — no LaTeX — so the build doesn't need TeX installed.
