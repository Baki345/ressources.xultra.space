import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    // Les tests du Worker vivent dans leur propre config (vitest.workers.config.ts)
    // et tournent dans le vrai runtime Workers, pas ici en jsdom.
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
