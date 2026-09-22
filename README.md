# AeroPlanet Volumetrics — product site

The marketing + documentation site for **AeroPlanet Volumetrics** (社内呼称: Welkin), a UE5.5
plugin for volumetric planetary clouds, atmosphere and orbits developed by Aero Interactive.

Not yet live. The plugin itself is not published on Fab yet (a visual issue is being fixed
before launch), so this site does not link to a Fab purchase page — the "Get the plugin" /
pricing CTAs point at the studio's Discord for launch updates instead. Update these once the
Fab listing is live.

## Tech stack

Deliberately matched to the company site (`../studio-site`) so the two projects share one set
of conventions instead of splitting the toolchain further:

- **Astro 7** + **Tailwind CSS 4** (via `@tailwindcss/vite`, CSS-first config — no
  `tailwind.config.js`)
- **@astrojs/sitemap** for `sitemap-index.xml`
- Static output only (`astro build` → `dist/`), no server runtime
- TypeScript (`astro/tsconfigs/strict`)

## Pages

- `/` — marketing landing page (hero, "how it renders" in 3 steps, feature grid, a comparison
  against typical flat-world sky plugins, pricing preview, support)
- `/docs/` — documentation, written from the plugin's own source (`WelkinStarActor.h`,
  `WelkinCloudComponent.h`, `WelkinAtmosphereTypes.h`): quickstart, an actor/component property
  reference, the cloud-paint workflow, and known limitations (no rings, no eclipse shadows, no
  multiplayer testing — stated plainly rather than glossed over)

Content sources live in `src/data/features.ts` (landing page) and `src/data/docs.ts` (docs
page) so copy edits don't require touching markup.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the production build locally |

## Deployment — Cloudflare Pages via GitHub (continuous deployment)

Following the studio's existing pattern (studio-site → GitHub → Vercel auto-deploy), this site
is meant to deploy the same way but to **Cloudflare Pages**, connected to a GitHub repository
rather than pushed ad hoc with `wrangler pages deploy`:

1. **Create the GitHub repository** (not yet done — needs 代表's go-ahead before pushing).
   Suggested name: `aeroplanet-volumetrics-site`, under the same account as studio-site
   (`naokun11111`), public, matching `studio-site` → `aero-interactive-site`.
2. **Push this local repository** to that remote (`git remote add origin ...` then
   `git push -u origin main`).
3. **Connect Cloudflare Pages to the GitHub repo** (Cloudflare dashboard → Pages → Create a
   project → Connect to Git → pick the repo):
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 22 or newer (`engines.node` in `package.json` requires `>=22.12.0`)
4. Every push to the connected branch then builds and deploys automatically — no manual
   `wrangler` invocation needed for normal updates.

`wrangler.toml` in this repo is **not** the deployment mechanism for step 3 (Cloudflare Pages'
GitHub integration reads its build settings from the dashboard, not from this file). It exists
only so `wrangler pages dev` / a one-off `wrangler pages deploy` can be run locally if ever
needed for a quick preview, matching the documentation style already used in `kies-site`.

### What is intentionally *not* done yet

Per house rules (外向けの公開は代表確認後), the following were deliberately left undone and
need 代表's explicit go-ahead first:

- No GitHub repository has been created.
- Nothing has been pushed anywhere; this project only exists as a local git repository.
- No Cloudflare Pages project has been created or connected.
- No real Fab listing URL exists yet, so none is linked from the site.

## Content accuracy

Every claim on both pages was checked against the plugin's actual source
(`C:\UnrealProjects\WelkinDev\Plugins\Welkin\Source\Welkin\Public\*.h`) rather than written from
the earlier Claude Artifact draft or from memory. Features not present in the code — rings,
eclipse/shadow casting between bodies, multiplayer replication — are explicitly listed under
"Known limitations" on `/docs/` instead of being implied anywhere.
