<script setup lang="ts">
// Set page metadata
useHead({
  title: 'Sticker Demo - Nuxt Sticker App',
  meta: [
    {
      name: 'description',
      content: 'Interactive cat sticker demo showcasing Vue 3 Composition API and smooth animations',
    },
  ],
})
</script>

<template>
  <div class="sticker-page">
    <div class="sticker-page__container">
      <!-- Page Header -->
      <header class="sticker-page__header">
        <h1 class="sticker-page__title">
          Animated Cat Sticker Demo
        </h1>
        <p class="sticker-page__description">
          Hover over the floating sticker on the right to see the magic! 
          This interactive component fetches cat images from an external API and displays them with smooth animations.
        </p>
      </header>

      <!-- Main Content -->
      <div class="sticker-page__content">
        <!-- Demo Information -->
        <section class="sticker-page__demo-info">
          <h2 class="sticker-page__demo-info-title">
            🐱 Interactive Demo
          </h2>
          <p class="sticker-page__demo-info-text">
            Look for the animated sticker button on the right side of your screen. 
            Hover over it to reveal adorable cat images fetched in real-time!
          </p>
        </section>

        <!-- Feature Section 1 -->
        <section class="sticker-page__section">
          <h2 class="sticker-page__section-title">
            Advanced Vue 3 Features
          </h2>
          <p class="sticker-page__text">
            This application demonstrates the power of Vue 3's Composition API combined with Nuxt 4's 
            modern architecture. The sticker component uses reactive state management, 
            <span class="sticker-page__highlight">composables for API integration</span>, 
            and sophisticated animation techniques.
          </p>
          <p class="sticker-page__text">
            Key features include automatic image preloading, error handling with retry mechanisms, 
            and memory-efficient blob URL management to prevent memory leaks.
          </p>
        </section>

        <!-- Feature Section 2 -->
        <section class="sticker-page__section">
          <h2 class="sticker-page__section-title">
            Smooth Animations & Interactions
          </h2>
          <p class="sticker-page__text">
            The sticker component features <span class="sticker-page__highlight">carefully crafted animations</span> 
            using CSS3 transforms and transitions. Each card appears with a staggered animation delay, 
            creating a delightful cascade effect.
          </p>
          <p class="sticker-page__text">
            Hover interactions include scaling effects, shadow enhancements, and overlay information display. 
            The component responds to both mouse and touch interactions for optimal mobile experience.
          </p>
        </section>

        <!-- Feature Section 3 -->
        <section class="sticker-page__section">
          <h2 class="sticker-page__section-title">
            TypeScript Integration
          </h2>
          <p class="sticker-page__text">
            Every component is built with <span class="sticker-page__highlight">strict TypeScript</span> 
            for enhanced developer experience and runtime safety. Custom interfaces define the shape 
            of data throughout the application.
          </p>
          <p class="sticker-page__text">
            The type system ensures API responses are properly validated, component props are correctly typed, 
            and state management follows predictable patterns.
          </p>
        </section>

        <!-- Feature Section 4 -->
        <section class="sticker-page__section">
          <h2 class="sticker-page__section-title">
            SCSS Architecture
          </h2>
          <p class="sticker-page__text">
            Styles are organized using a scalable SCSS architecture with design tokens, 
            <span class="sticker-page__highlight">reusable mixins</span>, and component-scoped styling. 
            The design system ensures consistency across all components.
          </p>
          <p class="sticker-page__text">
            Responsive breakpoints, animation timing, and color schemes are all centrally managed 
            through SCSS variables, making theme customization straightforward.
          </p>
        </section>

        <!-- Performance Section -->
        <section class="sticker-page__section">
          <h2 class="sticker-page__section-title">
            Performance Optimizations
          </h2>
          <p class="sticker-page__text">
            Images are fetched concurrently and preloaded before display to ensure smooth user experience. 
            <span class="sticker-page__highlight">Lazy loading</span> and proper cleanup prevent memory leaks.
          </p>
          <p class="sticker-page__text">
            The component uses efficient event listeners, debounced interactions, and optimal re-rendering 
            strategies to maintain 60fps animations even on lower-end devices.
          </p>
        </section>

        <!-- Scroll Content -->
        <section class="sticker-page__section">
          <h2 class="sticker-page__section-title">
            Scrollable Content Demo
          </h2>
          <p class="sticker-page__text">
            This page demonstrates how the fixed sticker component works alongside scrollable content. 
            The sticker remains perfectly positioned during scroll events and maintains its interactive behavior.
          </p>
          <p class="sticker-page__text">
            Try scrolling up and down while interacting with the sticker. Notice how it stays in place 
            and responds consistently regardless of the page's scroll position.
          </p>
        </section>

        <!-- Technology Stack -->
        <section class="sticker-page__section">
          <h2 class="sticker-page__section-title">
            Technology Stack
          </h2>
          <p class="sticker-page__text">
            Built with cutting-edge web technologies: <span class="sticker-page__highlight">Nuxt 4</span>, 
            Vue 3 Composition API, TypeScript, SCSS, and modern CSS features like CSS Grid and Flexbox.
          </p>
          <p class="sticker-page__text">
            Development tools include ESLint for code quality, Prettier for formatting, 
            and comprehensive error handling throughout the application stack.
          </p>
        </section>
      </div>
    </div>

    <!-- Animated Sticker Component -->
    <AnimatedSticker />
  </div>
</template>

<style lang="scss" scoped>
// Styles are imported from main SCSS architecture
// Using .sticker-page classes from assets/styles/pages/_sticker-page.scss
</style>