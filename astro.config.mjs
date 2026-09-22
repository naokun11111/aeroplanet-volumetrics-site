// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages の既定ドメイン。カスタムドメインが決まったら差し替える。
  site: 'https://aeroplanet-volumetrics.pages.dev',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});
