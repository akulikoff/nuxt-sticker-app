<script setup lang="ts">
import type { ImageLoaderProps } from '~/types'

interface Props extends ImageLoaderProps {
  src: string
  alt: string
  loading?: 'lazy' | 'eager'
  fallback?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  fallback: '/images/placeholder-cat.jpg', // Default fallback
})

// State management
const isLoaded = ref(false)
const hasError = ref(false)
const imageRef = ref<HTMLImageElement>()

// Handle image load success
const handleLoad = () => {
  isLoaded.value = true
  hasError.value = false
}

// Handle image load error
const handleError = () => {
  hasError.value = true
  isLoaded.value = false
}

// Reset state when src changes
watch(() => props.src, () => {
  isLoaded.value = false
  hasError.value = false
})

// Provide reactive loading state to parent
defineExpose({
  isLoaded: readonly(isLoaded),
  hasError: readonly(hasError),
})
</script>

<template>
  <div class="image-loader">
    <!-- Loading state -->
    <div 
      v-if="!isLoaded && !hasError" 
      class="image-loader__placeholder"
      :class="{ 'image-loader__placeholder--loading': !hasError }"
    >
      <div class="image-loader__spinner" />
    </div>

    <!-- Error state -->
    <div 
      v-else-if="hasError" 
      class="image-loader__error"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="image-loader__error-icon"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span class="image-loader__error-text">Failed to load</span>
    </div>

    <!-- Main image -->
    <img
      ref="imageRef"
      :src="hasError && props.fallback ? props.fallback : props.src"
      :alt="props.alt"
      :loading="props.loading"
      class="image-loader__image"
      :class="{
        'image-loader__image--loaded': isLoaded,
        'image-loader__image--error': hasError
      }"
      @load="handleLoad"
      @error="handleError"
    >
  </div>
</template>

<style lang="scss" scoped>
.image-loader {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;

  &__placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f1f5f9;
    z-index: 1;

    &--loading {
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }
  }

  &__spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #e2e8f0;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fef2f2;
    color: #dc2626;
    z-index: 1;
    gap: 8px;
  }

  &__error-icon {
    width: 32px;
    height: 32px;
    opacity: 0.7;
  }

  &__error-text {
    font-size: 12px;
    font-weight: 500;
    text-align: center;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;

    &--loaded {
      opacity: 1;
    }

    &--error {
      opacity: 0;
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>