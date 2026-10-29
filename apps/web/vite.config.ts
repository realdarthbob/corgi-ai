import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  // '' prefix loads every var from .env, not just VITE_*. These are only read here, in Node,
  // and never exposed to the browser bundle (only VITE_* vars are).
  const env = loadEnv(mode, import.meta.dirname, '');
  const port = Number(env.WEB_PORT ?? 5173);

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    },
    server: {
      port,
      strictPort: true,
      // Forward API calls to the Fastify server in dev, so the browser sees one origin
      proxy: { '/api': env.API_URL ?? 'http://localhost:3000' }
    },
    preview: {
      port,
      strictPort: true
    },
    test: {
      environment: 'jsdom'
    }
  };
});
