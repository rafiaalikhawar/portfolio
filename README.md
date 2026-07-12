# The Soft Lab ☁️

**Rafia Ali's living portfolio and second brain.**

An Obsidian-inspired map of Rafia's creative and professional worlds:
visitors start on a clean brain map, open a world to reveal its project
note cards, and read each case study inside a draggable Mac-style browser
window — with Google-inspired search, an image gallery, guided tours,
Daylight/Starlight themes, a command palette, and a dock.

## Run it

```
npm install
npm run dev        # http://localhost:3000
```

## Checks

```
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test       # 40 unit tests (schema, content, search, tabs, stores)
npm run build      # production build
npm run verify     # 20 browser E2E checks (needs dev server running)
```

## Where things live

```
src/content/    ← projects, categories, copy, tours (edit content HERE)
src/config/     ← social links, site identity, work-type tokens
src/lib/        ← schema validation, search index, tab generation, motion
src/stores/     ← zustand state (workspace, windows, theme, search, viewer)
src/components/ ← brain-graph, category-focus, project-cards, mac-window,
                  case-study, search, image-gallery, command-palette,
                  navigation, sidebar, dock, tour, mobile, ui
docs/           ← ADDING-A-PROJECT, CASE-STUDY-GUIDE, IMAGE-GUIDE,
                  CONTENT-CHECKLIST, DEPLOYMENT
```

## Adding a project

Create `src/content/projects/<slug>.ts`, register it in
`src/content/project-index.ts`, drop assets in `public/projects/<slug>/`.
The graph, search, gallery, sidebar, tours, and mobile views update
automatically — full walkthrough in `docs/ADDING-A-PROJECT.md`.

## Placeholders to replace

- `public/Rafia-Ali-Resume.pdf` — placeholder PDF
- LinkedIn / email / domain in `src/config/socialLinks.ts`
- Pookie Enterprises details in `src/content/projects/pookie-enterprises.ts`
- All `*.svg` frames under `public/projects/` (labelled placeholder frames;
  see `docs/IMAGE-GUIDE.md`)
