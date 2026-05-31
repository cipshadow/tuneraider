import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => {
  // PostHog credentials are provisioned by Stripe Projects into the monorepo-root
  // .env (POSTHOG_ANALYTICS_*). Inject them as build-time constants; the project
  // API key is a public client-side key, safe to embed. A local VITE_POSTHOG_*
  // override wins if set.
  const rootEnv = loadEnv(mode, resolve(__dirname, '..'), '')
  const localEnv = loadEnv(mode, __dirname, '')
  const posthogKey = localEnv.VITE_POSTHOG_KEY || rootEnv.POSTHOG_ANALYTICS_API_KEY || ''
  const posthogHost = localEnv.VITE_POSTHOG_HOST || rootEnv.POSTHOG_ANALYTICS_HOST || ''

  return {
  define: {
    __POSTHOG_KEY__: JSON.stringify(posthogKey),
    __POSTHOG_HOST__: JSON.stringify(posthogHost),
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // Existing pages (keep for backward compatibility)
        embed: resolve(__dirname, 'embed.html'),
        models: resolve(__dirname, 'models.html'),
        // Sharing trial pages
        play: resolve(__dirname, 'play.html'),
        ux_test: resolve(__dirname, 'ux-test.html'),
        // V2 Game Boy Sound Engine (isolated from v1)
        v2: resolve(__dirname, 'v2.html'),
        v2_test: resolve(__dirname, 'v2-test.html'),
        v2_diagnostic: resolve(__dirname, 'v2-diagnostic.html'),
        // Credits page
        credits: resolve(__dirname, 'credits.html'),
      },
    },
  },
  }
})