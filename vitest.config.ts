import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/e2e/**', // Exclude e2e tests from vitest
    ],
    // you can optionally set Nuxt-specific environment options
    // environmentOptions: {
    //   nuxt: {
    //     rootDir: fileURLToPath(new URL('.', import.meta.url)),
    //     domEnvironment: 'happy-dom', // 'happy-dom' (default) or 'jsdom'
    //     overrides: {
    //       // other Nuxt config you want to pass
    //     }
    //   }
    // }
  },
})
