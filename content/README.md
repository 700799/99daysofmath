# Content authoring guide

Each problem is one JSON file under `content/problems/<domain>/`, validated against `problems.schema.json`.

## After editing problems

```sh
npm run validate:content
npm run build:content   # rebuilds public/data/problems.parquet
```

Commit both the JSON sources **and** `public/data/problems.parquet` (the runtime reads the Parquet, not the JSON).

## File naming

`NNN-short-slug.json` where `NNN` is the next available 3-digit number within the domain.

## Field summary

- `id` — e.g. `"6.RP.001"`. Must be unique across the whole bank.
- `domain` — one of `6.RP`, `6.NS`, `6.EE`, `6.G`, `6.SP`.
- `unit` — integer 1+. Problems with the same `unit` are grouped into one trail stop.
- `orderInUnit` — sort order within a unit.
- `standard` — full CCSS code, e.g. `"6.NS.A.1"`.
- `difficulty` — 1 (easy), 2 (medium), 3 (challenge).
- `prompt` — text with inline LaTeX between `$...$` (rendered by KaTeX).
- `diagram` (optional) — one of:
  - `{ "kind": "svg-asset", "src": "diagrams/_primitives/rect.svg", "alt": "..." }`
  - `{ "kind": "inline-svg", "svg": "<svg>...</svg>", "alt": "..." }`
  - `{ "kind": "ascii", "art": "..." }`
- `answerType` — `numeric` | `fraction` | `expression` | `multiple-choice` | `short-text`.
- `choices` (only for `multiple-choice`) — array of `{id, label, correct}`. Exactly one must be correct.
- `primaryAnswer` — canonical answer. For MC, the **id** of the correct choice (e.g. `"B"`).
- `alternativeAnswers` — equivalent forms you also want accepted (e.g. `"1/2"` and `"0.5"`).
- `acceptanceMode`:
  - `"normalized"` — numeric values are parsed and compared (handles fractions, decimals, percents, mixed numbers).
  - `"exact"` — string equality after cleanup. Use when the **form** of the answer matters (e.g. "express as a percent").
  - `"numeric-tolerance"` — pair with `numericTolerance` for inexact decimals (π ≈ 3.14).
- `hint` — one short nudge, text with optional `$...$` LaTeX.
- `explanation` — array of step strings. One per line / numbered.
- `tags` — free-form. Use `"CA"` for California-specific items and `"MAP-practice"` for items mirroring NWEA MAP style.
- `estimatedSeconds` — UI pacing hint.

## LaTeX cheatsheet

| Want | Write |
| --- | --- |
| Fraction | `$\frac{3}{4}$` |
| Mixed number | `$1\frac{1}{2}$` |
| Multiplication | `$3 \times 4$` |
| Division | `$12 \div 4$` |
| Exponent | `$x^2$` |
| Subscript | `$x_1$` |
| Less than or equal | `$x \le 5$` |
| Negative | `$-3$` |
| Ratio | `$3:4$` |

## Reusable SVG primitives

In `public/diagrams/_primitives/`:

- `number-line.svg`
- `rect.svg`
- `fraction-bar.svg`
- `dot-plot.svg`

Reference them via `{"kind": "svg-asset", "src": "diagrams/_primitives/rect.svg", "alt": "..."}`.

For one-off diagrams, drop a new SVG under `public/diagrams/<domain>/foo.svg` and reference by that path.

## Watch list

- Problems asking the student to "express as a percent" must use `acceptanceMode: "exact"` and list both `"50%"` and `"50 %"` in `alternativeAnswers`. Otherwise `0.5` would silently be accepted.
- For multiple-choice, set `primaryAnswer` to the correct choice **id** (`"A"`, `"B"`, `"C"`, `"D"`), not the label text.
- Negative answers: list both `"-3"` and the user might type `−3` (unicode minus); the normalizer handles both, but if you go with `acceptanceMode: "exact"`, list both forms.
