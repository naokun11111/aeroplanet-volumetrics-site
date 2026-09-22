# AeroPlanet Volumetrics — product site

The marketing + documentation site for **AeroPlanet Volumetrics** (社内呼称: Welkin), a UE5.5
plugin for volumetric planetary clouds, atmosphere and orbits developed by Aero Interactive.

Live (as a manual snapshot) at https://aeroplanet-volumetrics.pages.dev — see "Deployment"
below for the current state. The **plugin itself** is not published on Fab yet (a visual issue
is being fixed before launch), so the site doesn't link to a Fab purchase page — the "Get the
plugin" / pricing CTAs point at the studio's Discord for launch updates instead. Update these
once the Fab listing is live.

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

## Deployment — GitHub repo done, live URL up, Git-connected continuous deploy still blocked

Status as of 2026-09-22 (代表 approved "aeroplanet-volumetrics-site でいい, 進めていいよ"):

- **GitHub repository**: created and pushed —
  [`naokun11111/aeroplanet-volumetrics-site`](https://github.com/naokun11111/aeroplanet-volumetrics-site)
  (public, default branch `main`).
- **Live production URL (right now)**: https://aeroplanet-volumetrics.pages.dev — a Cloudflare
  Pages **direct-upload** project (`aeroplanet-volumetrics`), deployed once with
  `wrangler pages deploy dist`. This does **not** auto-update on push; it's a manual snapshot.
- **GitHub-connected continuous deployment (the actual goal)**: **not yet possible via
  CLI/API.** Attempting to create a Pages project with `source.type = "github"` on the
  `aerointeractive2026@gmail.com` Cloudflare account returns error `8000011` ("internal issue
  with your Cloudflare Pages Git installation"), and attempting to attach a GitHub source to
  the existing direct-upload project returns `8000069` ("You cannot update the `source` object
  in a Direct Uploads project"). Both together mean: **this Cloudflare account has never
  authorized the Cloudflare Pages GitHub App**, and that authorization is a one-time
  **browser-based OAuth step that only a human with dashboard access can complete** — there is
  no API path around it.

### The one remaining manual step

Whoever can access the Cloudflare dashboard as `aerointeractive2026@gmail.com`:

1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Create** → the **Pages** tab →
   **Connect to Git**.
2. Authorize the **Cloudflare Pages** GitHub App for the `naokun11111` account (scope it to
   just `aeroplanet-volumetrics-site`, or "all repositories" if that's more convenient going
   forward).
3. Select the `aeroplanet-volumetrics-site` repository.
4. Set: **Production branch** `main`, **Build command** `npm run build`, **Build output
   directory** `dist`. (Framework preset "Astro" fills these in automatically if offered.)
   Use a **different project name** than `aeroplanet-volumetrics` (e.g.
   `aeroplanet-volumetrics-site`) — Cloudflare won't let a Git-connected project reuse a name
   already taken by a direct-upload project, and the existing `aeroplanet-volumetrics` project
   can't be converted in place.
5. Save and deploy. From then on, every push to `main` builds and deploys automatically.

Once that one-time authorization exists, the rest can be done non-interactively again (via the
same Cloudflare API calls that failed above, or by repeating step 3/4 in the dashboard for any
future project) — worth asking 代表窓口 (web) to finish the wiring at that point rather than
redoing the browser flow from scratch.

`wrangler.toml` in this repo documents the direct-upload project's settings; it is **not** read
by Cloudflare Pages' GitHub integration (that reads its build settings from the dashboard/API
project config, not from a file in the repo).

## Content accuracy

Every claim on both pages was checked against the plugin's actual source
(`C:\UnrealProjects\WelkinDev\Plugins\Welkin\Source\Welkin\Public\*.h`) rather than written from
the earlier Claude Artifact draft or from memory. Features not present in the code — rings,
eclipse/shadow casting between bodies, multiplayer replication — are explicitly listed under
"Known limitations" on `/docs/` instead of being implied anywhere.
