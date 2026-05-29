# 99 Days of Math

A Duolingo-style 6th-grade Common Core math practice app. Built for a 5th-grader prepping for the SRVUSD NWEA MAP test.

Live: https://700799.github.io/99daysofmath/

## What it does

- Five trails, one per 6th-grade CCSS domain (6.RP, 6.NS, 6.EE, 6.G, 6.SP)
- Each trail is a chain of units; complete a unit to unlock the next
- Hint, full step-by-step explanation, and alternative answer forms on every problem
- CA-Common-Core-specific and MAP-style items tagged inside the same bank
- Phaser-rendered trail, KaTeX math, runs entirely on GitHub Pages

## Rewards Arcade 🎉

Finishing units earns 🪙 **coins**, which power a **Rewards Arcade** of mini-games
(reachable from the home banner or the coin pill in the header):

- **🎲 Math Party** — a Mario-Party-style board game. Roll the dice and race a CPU
  rival (Foxy 🦊) around a 20-tile loop. Blue tiles pay coins, red tiles cost a few,
  Lucky tiles are wildcards, and **Star tiles** let you spend 10 coins to buy a
  Star — most Stars after 8 rounds wins. Math tiles pop a quick arithmetic
  challenge for bonus coins. Unlocks at 1 ⭐.
- **🏎️ Math Grand Prix** — a real-time kart race. Rivals drive at a steady pace
  while you only move by answering math challenges, so solve fast to take the
  checkered flag. Unlocks at 6 ⭐.

Winning banks more coins and adds 🥇🥈🥉 trophies to your trophy case. Difficulty
(Easy/Medium/Hard) controls the arithmetic in the challenge prompts. All game
rules live in pure, unit-tested modules under [`src/rewards/`](src/rewards); the
Phaser scenes (`src/phaser/MathPartyScene.ts`, `GrandPrixScene.ts`) handle only
rendering and animation.


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
