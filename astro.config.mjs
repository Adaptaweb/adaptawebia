import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://adaptaweb.cl',
  integrations: [
    react(),
    sitemap({
      // enemies y rpg son paginas de descarga ocultas: ya responden
      // noindex y no se enlazan desde ningun lado.
      filter: (pagina) => !/\/(enemies|rpg)\/?$/.test(pagina),
      // El canonical de BaseLayout no lleva barra final; si el sitemap la
      // pusiera, cada pagina se anunciaria con dos direcciones distintas.
      serialize: (entrada) => {
        const url = new URL(entrada.url);
        if (url.pathname !== '/' && url.pathname.endsWith('/')) {
          url.pathname = url.pathname.slice(0, -1);
        }
        return { ...entrada, url: url.href };
      },
    }),
  ],
  adapter: vercel(),
  output: 'server',
});