<script setup lang="ts">
import type { StickerCardProps } from '~/types'

interface Props extends StickerCardProps {
  image: {
    id: string
    url: string
    timestamp: number
    loaded: boolean
    error?: string
  }
  index: number
  isVisible: boolean
}

const props = defineProps<Props>()

// Animation delay based on index
const animationDelay = computed(() => `${props.index * 100}ms`)

// Handle image interactions
const isHovered = ref(false)

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false  
}
</script>

<template>
  <div 
    class="sticker-card"
    :class="{
      'sticker-card--visible': isVisible,
      'sticker-card--hovered': isHovered,
      'sticker-card--error': image.error
    }"
    :style="{ animationDelay }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Image Container -->
    <div class="sticker-card__content">
      <ImageLoader
        :src="image.url"
        :alt="`Cat image ${index + 1}`"
        loading="eager"
        class="sticker-card__image"
      />
      
      <!-- Overlay with image info -->
      <div 
        v-if="isHovered" 
        class="sticker-card__overlay"
      >
        <div class="sticker-card__info">
          <span class="sticker-card__id">ID: {{ image.id.slice(-8) }}</span>
          <span class="sticker-card__timestamp">
            {{ new Date(image.timestamp).toLocaleTimeString() }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div 
      v-if="!image.loaded && !image.error"
      class="sticker-card__loading"
    >
      <div class="sticker-card__spinner" />
    </div>
    
    <!-- Error state -->
    <div 
      v-if="image.error"
      class="sticker-card__error"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      <span>Failed</span>
    </div>
  </div>
</template>

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
  
  &--hovered {
    transform: translateX(0) scale(1.05);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
  
  &--error {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
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
    transition: transform 0.3s ease;
  }
  
  &--hovered &__image {
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
  
  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8fafc;
    z-index: 1;
  }
  
  &__spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e2e8f0;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  &__error {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #dc2626;
    font-size: 10px;
    font-weight: 500;
    gap: 4px;
    z-index: 1;
  }
  
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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