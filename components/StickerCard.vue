<template>
  <div 
    class="sticker-card"
    :class="{
      'sticker-card--visible': isVisible,
      'sticker-card--hovered': isHovered,
      'sticker-card--focused': isFocused
    }"
    :style="{ animationDelay }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown.enter="handleInteraction"
    @keydown.space.prevent="handleInteraction"
    tabindex="0"
    role="img"
    :aria-label="`Cat image ${index + 1} of ${totalImages}. Click to view`"
    :aria-describedby="isHovered || isFocused ? `sticker-info-${image.id}` : undefined"
  >
    <!-- Image Container -->
    <div class="sticker-card__content">
      <div 
        v-if="!imageLoaded" 
        class="sticker-card__placeholder"
        :class="{ 'sticker-card__placeholder--fade': imageLoaded }"
      >
        <div class="sticker-card__spinner"></div>
      </div>
      <NuxtImg
        :src="image.url"
        :alt="`Cute cat photo ${index + 1}`"
        width="120"
        height="120"
        format="jpeg"
        quality="85"
        :loading="index === 0 ? 'eager' : 'lazy'"
        decoding="async"
        :fetchpriority="index === 0 ? 'high' : 'auto'"
        sizes="120px"
        preset="sticker"
        class="sticker-card__image"
        :class="{ 'sticker-card__image--loaded': imageLoaded }"
        @load="onImageLoad"
        @error="onImageError"
      />
      
      <!-- Overlay with image info -->
      <div 
        v-if="isHovered || isFocused" 
        class="sticker-card__overlay"
        :id="`sticker-info-${image.id}`"
        role="tooltip"
      >
        <div class="sticker-card__info">
          <span class="sticker-card__id">ID: {{ image.id.slice(-8) }}</span>
          <span class="sticker-card__timestamp">
            {{ formatTimestamp(image.timestamp) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Note: Loading and error states are now handled by NuxtImg built-in functionality -->
  </div>
</template>

<script setup lang="ts">
import type { CatImage } from '~/types'

interface Props {
  image: CatImage
  index: number
  isVisible: boolean
  totalImages?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalImages: 3
})

// Animation delay based on index
const animationDelay = computed(() => `${props.index * 100}ms`)

// Handle image interactions
const isHovered = ref(false)
const isFocused = ref(false)
const imageLoaded = ref(false)

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false  
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

const handleInteraction = () => {
  // Handle keyboard interaction (space or enter)
  // Could emit an event or perform some action
  console.log('Image interacted with:', props.image.id)
}

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Image loading handlers
const onImageLoad = () => {
  setTimeout(() => {
    imageLoaded.value = true
  }, 100) // Small delay for smooth transition
}

const onImageError = () => {
  console.warn('Failed to load image:', props.image.url)
  imageLoaded.value = true // Show even if failed to avoid infinite loading
}

// Start loading immediately when component mounts
onMounted(() => {
  // Set a timeout to show image even if it takes too long
  setTimeout(() => {
    if (!imageLoaded.value) {
      imageLoaded.value = true
    }
  }, 2000) // Show after 2 seconds max
})
</script>

<style lang="scss" scoped>
.sticker-card {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  opacity: 0;
  transform: translateX(20px) scale(0.9);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  &--visible {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  
  &--hovered,
  &--focused {
    transform: translateX(0) scale(1.05);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
  
  &--focused {
    outline: 2px solid rgba(59, 130, 246, 0.6);
    outline-offset: 2px;
  }
  
  &__content {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  
  &__image {
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0;
    
    &--loaded {
      opacity: 1;
    }
  }

  &__placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    transition: opacity 0.3s ease;
    z-index: 1;
    
    &--fade {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e2e8f0;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  &--hovered &__image,
  &--focused &__image {
    transform: scale(1.1);
  }
  
  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
    display: flex;
    align-items: flex-end;
    padding: 8px;
    animation: fadeIn 0.2s ease;
  }
  
  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    color: white;
    font-size: 10px;
    font-weight: 500;
  }
  
  &__id {
    opacity: 0.9;
    font-family: monospace;
  }
  
  &__timestamp {
    opacity: 0.7;
    font-size: 9px;
  }
  
  // Loading and error states are now handled by NuxtImg built-in functionality
  
  // Mobile adjustments
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    
    &__info {
      font-size: 9px;
    }
    
    &__timestamp {
      font-size: 8px;
    }
  }
}

// Screen reader only content
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>