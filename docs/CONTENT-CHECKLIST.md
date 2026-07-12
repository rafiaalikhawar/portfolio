# Content checklist

Run through this before publishing a project (or the site).

## Per project

- [ ] `id` and `slug` are lowercase kebab-case and unique
- [ ] One primary category, correctly chosen (decides its home on the map)
- [ ] Secondary categories listed (they highlight on hover, no clutter)
- [ ] Tags added — in the data only, never as graph nodes
- [ ] `workType` set (drives the card accent + badge)
- [ ] `status` truthful; `activelyBuilding` only if genuinely being built
- [ ] `featured` only for work that should lead its category
- [ ] `cardLine` reads well at a glance (≤ 90 chars)
- [ ] Results contain **only verified facts** — no invented metrics
- [ ] Unknowns marked “Details being added”, not guessed
- [ ] Every gallery item has real `alt` text and a caption
- [ ] Placeholder frames flagged with `placeholder: true`
- [ ] Links point somewhere real, or are omitted
- [ ] `npm run test` passes (schema + integrity checks)

## Site-wide

- [ ] `src/config/socialLinks.ts` — LinkedIn/email/domain placeholders
      replaced when available (they render as “soon” until then)
- [ ] `public/Rafia-Ali-Resume.pdf` replaced with the real resume
- [ ] Pookie Enterprises categories confirmed
      (`src/content/projects/pookie-enterprises.ts`)
- [ ] No fake statistics, testimonials, or company logos anywhere
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` all green
- [ ] `npm run verify` (against `npm run dev`) passes
