<template>
  <section class="sticker-page__features">
    <h2 class="sticker-page__features-title">✨ Features</h2>

    <ul class="sticker-page__features-list">
      <li
        v-for="feature in features"
        :key="feature.name"
        class="sticker-page__features-item"
      >
        <span class="sticker-page__features-icon">{{ feature.icon }}</span>
        <div class="sticker-page__features-content">
          <h3 class="sticker-page__features-name">{{ feature.name }}</h3>
          <p class="sticker-page__features-description">{{ feature.description }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
interface FeatureItem {
  icon: string;
  name: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: '📱',
    name: 'Responsive Design',
    description: 'Works perfectly on desktop, tablet, and mobile devices with optimized breakpoints.',
  },
  {
    icon: '🎨',
    name: 'Smooth Animations',
    description: 'CSS-based animations with hardware acceleration for silky-smooth interactions.',
  },
  {
    icon: '🔄',
    name: 'Real-time API',
    description: 'Fetches fresh cat images from external API with retry and caching mechanisms.',
  },
  {
    icon: '⚡',
    name: 'Optimized Performance',
    description: 'Lazy loading, preloading strategies, and efficient reactivity ensure great performance.',
  },
  {
    icon: '♿',
    name: 'Accessibility',
    description: 'Semantic HTML, ARIA labels, and keyboard support for inclusive UX.',
  },
  {
    icon: '🧠',
    name: 'TypeScript',
    description: 'Strict typing across components and composables for safer, clearer code.',
  },
];
</script>

<style lang="scss" scoped>
/* Presentation styles live in global SCSS; class names follow BEM */
</style>
