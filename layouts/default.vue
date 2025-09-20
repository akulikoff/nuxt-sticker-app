<script setup lang="ts">
// Import main SCSS styles
import '~/assets/styles/main.scss'

// Navigation items
const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Sticker Demo', path: '/sticker' }
]

// Get current route for active state
const route = useRoute()
</script>

<template>
  <div class="app-layout">
    <!-- Navigation -->
    <nav class="navigation">
      <div class="navigation__container">
        <div class="navigation__content">
          <!-- Logo -->
          <NuxtLink to="/" class="navigation__logo">
            Nuxt Sticker
          </NuxtLink>

          <!-- Desktop Menu -->
          <div class="navigation__menu">
            <NuxtLink
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              class="navigation__link"
              :class="{ 'navigation__link--active': route.path === item.path }"
            >
              {{ item.name }}
            </NuxtLink>
          </div>

          <!-- Mobile Menu Toggle (future implementation) -->
          <button class="navigation__mobile-toggle" aria-label="Toggle menu">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>