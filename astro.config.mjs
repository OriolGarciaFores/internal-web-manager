// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  env: {
    schema: {
      INTERNAL_SERVICE_REMINDERS_ENDPOINT: envField.string({
        context: 'server', 
        access: 'public'
      })
    }
  }
});