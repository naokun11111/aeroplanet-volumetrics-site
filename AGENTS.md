## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Content accuracy

Feature and documentation copy must match the actual plugin source
(`C:\UnrealProjects\WelkinDev\Plugins\Welkin\Source\Welkin\Public\*.h`), not memory or an
earlier draft. If the plugin's source changes, update `src/data/features.ts` and
`src/data/docs.ts` to match — do not invent capabilities (rings, eclipse shadows, multiplayer,
etc.) that aren't actually implemented there.

## Deployment

GitHub repo: https://github.com/naokun11111/aeroplanet-volumetrics-site (pushed).
Live snapshot: https://aeroplanet-volumetrics.pages.dev (Cloudflare Pages, direct-upload —
deployed manually via `wrangler pages deploy dist`, does not auto-update on push).

The intended end state is Cloudflare Pages connected to the GitHub repo for continuous
deployment, matching studio-site's GitHub → Vercel pattern — but this is currently blocked on
a one-time browser-based GitHub App authorization that only a human with Cloudflare dashboard
access (`aerointeractive2026@gmail.com`) can complete (confirmed via the Cloudflare API:
error `8000011` creating a Git-sourced project, error `8000069` trying to attach Git to the
existing direct-upload project). See `README.md`'s Deployment section for the exact remaining
steps and for why this can't be finished via CLI/API alone.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
