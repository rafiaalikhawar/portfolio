# Deployment

The Soft Lab is a static-friendly Next.js App Router app: no database, no
CMS, no server-only APIs. Both routes prerender as static content.

## Local

```
npm install
npm run dev        # http://localhost:3000
```

## Checks before deploying

```
npm run lint       # ESLint
npx tsc --noEmit   # type checking
npm run test       # unit tests (schema, content, search, tabs, stores)
npm run build      # production build
npm run verify     # browser E2E sweep (needs `npm run dev` running)
```

## Vercel (recommended)

1. Push the repository to GitHub.
2. Import it at vercel.com — the defaults (framework: Next.js) are correct.
3. No environment variables are required.

Every push to the production branch redeploys. Because all content lives in
`src/content/`, publishing a new project is: edit content → commit → push.

## Other hosts

Any host that runs `next build` + `next start` works (Netlify, Railway,
Render, a VPS). For a purely static file host, add `output: "export"` to
`next.config.ts` — the app is fully client-side, so exporting works; images
are already served unoptimised-friendly SVG/webp from `/public`.

## Domain

When the real domain exists, update the `domain` placeholder in
`src/config/socialLinks.ts` and set the domain in your host's dashboard.
