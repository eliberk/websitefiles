import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables"
    }
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true
  },
  site: 'https://derivaconnect.com',
  integrations: [tailwind(), sitemap(), mdx(), react()]
});