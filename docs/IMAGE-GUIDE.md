# Image guide

## What a featured project ideally has

- 1 hero cover
- 3–6 project screens
- 1 process or architecture visual
- 1 evidence or result visual
- 1 thumbnail
- Optional demo video or GIF

## Filenames

Name assets by role so replacing them never requires code changes:

```
hero.webp
thumbnail.webp
screen-01.webp
screen-02.webp
process.webp
architecture.webp
result.webp
demo.mp4
```

## Suggested dimensions

| Asset                | Size                  |
| -------------------- | --------------------- |
| Hero                 | 1600×1000             |
| Technical screenshot | 1600×900 or 1600×1000 |
| Marketing portrait   | 1080×1350             |
| Reel / story         | 1080×1920             |
| Game screenshot      | 1920×1080             |
| Thumbnail            | 1200×750              |

Prefer `.webp` (or `.avif`) exports around 100–300 KB. Keep the aspect
ratio of the placeholder you're replacing so the layout doesn't shift.

## Replacing a placeholder — three steps, no interface code

1. Drop the real image into `public/projects/<slug>/` (any name is fine,
   role-names above are recommended).
2. In `src/content/projects/<slug>.ts`, update that gallery item's `src`
   (e.g. `hero.svg` → `hero.webp`), set the real `width`/`height`, and
   delete the `placeholder: true` flag.
3. Refresh. The card thumbnail, case-study galleries, Images view, search
   results, and Preview viewer all pick it up automatically.

## Placeholders

Current placeholder frames are generated SVGs — labelled with the project
name, category, and a “PLACEHOLDER FRAME” caption so nothing ever pretends
to be a real screenshot. Regenerate or add frames via:

```
node scripts/generate-placeholders.mjs
```

In development, the app logs a console warning for any gallery `src` that
doesn't resolve, so a missing file is caught the moment the workspace loads.
