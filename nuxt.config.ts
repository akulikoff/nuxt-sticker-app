// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Enable SSR and modern features
  ssr: true,
  
  // CSS Configuration - simplified
  css: [
    '~/assets/styles/main.scss'
  ],
  
  // TypeScript Configuration - disabled for build stability
  typescript: {
    strict: false,
    typeCheck: false
  },
  
  // App Configuration
  app: {
    head: {
      title: 'Nuxt Sticker App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Interactive animated sticker application built with Nuxt 4' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Runtime Configuration
  runtimeConfig: {
    public: {
      apiBase: 'https://cataas.com'
    }
  },
  
  // Build optimizations
  nitro: {
    preset: 'node-server'
  }
})