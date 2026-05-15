# 99 Days of Math

A Duolingo-style 6th-grade Common Core math practice app. Built for a 5th-grader prepping for the SRVUSD NWEA MAP test.

Live: https://700799.github.io/99daysofmath/

## What it does

- Five trails, one per 6th-grade CCSS domain (6.RP, 6.NS, 6.EE, 6.G, 6.SP)
- Each trail is a chain of units; complete a unit to unlock the next
- Hint, full step-by-step explanation, and alternative answer forms on every problem
- CA-Common-Core-specific and MAP-style items tagged inside the same bank
- Phaser-rendered trail, KaTeX math, runs entirely on GitHub Pages

## Stack

React 18, Vite 5, TypeScript, Tailwind CSS, Framer Motion, Phaser 3, Zustand, DuckDB-WASM reading a static Parquet file built from hand-authored JSON.

## Run locally

```sh
nvm use            # Node 22
npm ci
npm run validate:content
npm run build:content   # writes public/data/problems.parquet
npm run dev             # http://localhost:5173/99daysofmath/
```

## Add or edit problems

Each problem is one JSON file under `content/problems/<domain>/`. See [`content/README.md`](content/README.md) for the schema, LaTeX cheatsheet, and authoring conventions.

After editing:

```sh
npm run validate:content
npm run build:content
git add content/ public/data/problems.parquet
git commit -m "Add N problems to 6.XX"
```

## Tests

```sh
npm test
npm run test:watch
```

## Deploy

Pushes to `main` deploy automatically via GitHub Actions to GitHub Pages. The repo's Pages source must be set to "GitHub Actions" in repo settings.
