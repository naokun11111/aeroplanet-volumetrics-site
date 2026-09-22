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

This site deploys to Cloudflare Pages via a GitHub-connected continuous deployment, not a
one-off `wrangler pages deploy`. See `README.md` for the exact setup steps and for what has
and hasn't been done yet (as of this writing: nothing has been pushed to GitHub and no
Cloudflare Pages project exists — both require 代表's go-ahead first).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
