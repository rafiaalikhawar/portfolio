# Adding a project to The Soft Lab

Everything in the interface — the graph, category cards, search, image
gallery, sidebar, dock, related projects, guided tours, and mobile views —
derives from one registry: `src/content/project-index.ts`. Adding a project
never requires touching a component.

## 1. Create the asset folder

```
public/projects/<slug>/
```

Use a lowercase kebab-case slug (`my-cool-project`). Name assets by role,
not by content (see `docs/IMAGE-GUIDE.md`):

```
hero.webp        thumbnail.webp     screen-01.webp
process.webp     architecture.webp  result.webp
```

Until real images exist, generate a labelled placeholder frame by adding an
entry to `scripts/generate-placeholders.mjs` and running:

```
node scripts/generate-placeholders.mjs
```

## 2. Copy a project template

Copy the closest existing file in `src/content/projects/` — for example
`weather-kg.ts` for engineering work, `fabs-rental.ts` for marketing,
`futera.ts` for games — and rename it to `<slug>.ts`.

## 3. Set the primary category

```ts
primaryCategory: "product",
```

Valid ids: `ai-engineering`, `research`, `product`, `marketing`,
`business`, `games`, `social-impact`. The primary category decides where
the project card appears when a world is opened on the brain map.

## 4. Set secondary categories

```ts
secondaryCategories: ["marketing", "business"],
```

These never appear as permanent lines on the graph. They light up softly —
with temporary curved connection lines — when the project is hovered.

## 5. Add tags (they never become graph nodes)

```ts
tags: ["Knowledge Graphs", "Python", "Data Pipelines"],
```

Tags surface in the right panel, the case study, and search. They are
deliberately kept off the graph and off the collapsed card.

## 6. Set status and work type

```ts
status: "in-progress",        // idea | planning | in-progress | completed | paused | archived
activelyBuilding: true,       // adds the "Currently building" pulse badge
workType: "founded-venture",  // drives the card's left accent + badge
featured: true,               // larger card, star, first in category views
```

`activelyBuilding` also places the project in the sidebar's
**Currently Building** collection automatically.

## 7. Write the case study

Fill only the `caseStudy` fields you actually have (`problem`, `process`,
`decisions`, `tools`, `results`, `learnings`, …). Tabs are generated from
the primary category's template and **empty tabs hide themselves** — a
half-finished case study still looks intentional. See
`docs/CASE-STUDY-GUIDE.md` for which fields feed which tabs.

Never invent results. If something isn't confirmed yet, write
“Details being added”.

## 8. Add gallery images with captions

```ts
gallery: [
  {
    src: "/projects/<slug>/hero.webp",
    alt: "What a screen reader should hear",
    caption: "What the viewer/lightbox should show",
    kind: "ui", // ui | mobile | branding | marketing | research | architecture | process | results | gameplay
    placeholder: true, // remove once the real image lands
    width: 1600,
    height: 1000,
  },
],
```

`kind` powers the Images view filters; captions are indexed by search.

## 9. Add links

```ts
links: { live: "https://…", github: "https://…" },
```

Omit anything that doesn't exist — missing links simply don't render.

## 10. Register the project

In `src/content/project-index.ts`:

```ts
import { myProject } from "./projects/my-project";
// …add to the allProjects array
```

Validation runs at import time: a typo fails immediately in development
with a readable message naming the field.

## 11. Test it

```
npm run test      # schema + content integrity checks pick up the new project
npm run dev       # then check by hand:
```

- **Category view** — open the primary category on the brain map; the card
  appears (featured first).
- **Search** — search the title and a tag.
- **Image search** — Images view; filter by the project.
- **Featured work** — if `featured: true`, it's in the sidebar's Selected Work.
- **Related projects** — open another project that lists it in
  `graph.relatedProjects`.
- **Mobile view** — narrow the window below 820px; check the category list
  and the full-screen case-study sheet.

`npm run verify` (with `npm run dev` running) exercises the whole app in a
real browser if you want the full sweep.
