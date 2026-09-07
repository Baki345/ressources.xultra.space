import { cloudflareTest } from '@cloudflare/vitest-pool-workers'
import { defineConfig } from 'vitest/config'

// Config Vitest séparée pour les tests du Worker : tourne dans le vrai
// runtime Workers (via Miniflare/workerd), pas dans jsdom — indispensable
// pour tester fidèlement le comportement réseau/edge, contrairement aux
// scripts jsdom ad hoc utilisés côté worker.js historique.
export default defineConfig({
  plugins: [cloudflareTest({ wrangler: { configPath: './wrangler.jsonc' } })],
  test: {
    include: ['worker/**/*.test.ts'],
  },
})
