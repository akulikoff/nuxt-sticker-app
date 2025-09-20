<script setup lang="ts">
// Component for the main animated sticker functionality
const { images, loading, error, refetch } = useCatImages()

// Component state
const isExpanded = ref(false)
const isHovered = ref(false)
const containerRef = ref<HTMLElement>()

// Computed properties
const hasImages = computed(() => images.value.length > 0)
const showContent = computed(() => isExpanded.value && hasImages.value)

// Handle trigger interactions
const handleTriggerClick = async () => {
  if (!hasImages.value && !loading.value) {
    await refetch()
  }
  isExpanded.value = !isExpanded.value
}

const handleMouseEnter = () => {
  isHovered.value = true
  if (!isExpanded.value) {
    isExpanded.value = true
  }
}

const handleMouseLeave = () => {
  isHovered.value = false
  // Keep expanded for a short time to allow interaction
  setTimeout(() => {
    if (!isHovered.value) {
      isExpanded.value = false
    }
  }, 300)
}

// Load images on mount
onMounted(async () => {
  if (!hasImages.value) {
    await refetch()
  }
})

// Handle click outside to close
const handleClickOutside = (event: Event) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isExpanded.value = false
    isHovered.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div 
    ref="containerRef"
    class="animated-sticker"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Trigger Button -->
    <button
      class="animated-sticker__trigger"
      :class="{
        'animated-sticker__trigger--expanded': isExpanded,
        'animated-sticker__trigger--loading': loading,
        'animated-sticker__trigger--error': error
      }"
      @click="handleTriggerClick"
      :aria-label="isExpanded ? 'Close cat sticker' : 'Open cat sticker'"
    >
      <!-- Loading state -->
      <div 
        v-if="loading" 
        class="animated-sticker__trigger-spinner"
      />
      
      <!-- Error state -->
      <svg
        v-else-if="error"
        class="animated-sticker__trigger-icon"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      
      <!-- Normal state - Cat paw icon -->
      <svg
        v-else
        class="animated-sticker__trigger-icon"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M14 19a6 6 0 0 0-12 0" />
        <circle cx="8" cy="9" r="3" />
        <path d="M15 5a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
        <path d="M17 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
        <path d="M5 5a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
        <path d="M3 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
      </svg>
    </button>

    <!-- Content Cards -->
    <div 
      class="animated-sticker__content"
      :class="{ 'animated-sticker__content--expanded': showContent }"
    >
      <div class="animated-sticker__cards">
        <!-- Error message -->
        <div 
          v-if="error && !loading"
          class="animated-sticker__error"
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
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>{{ error }}</span>
          <button 
            @click="refetch"
            class="animated-sticker__retry-btn"
          >
            Retry
          </button>
        </div>
        
        <!-- Loading cards -->
        <div 
          v-else-if="loading"
          class="animated-sticker__loading-cards"
        >
          <div 
            v-for="n in 3" 
            :key="`loading-${n}`"
            class="animated-sticker__loading"
          >
            <div class="animated-sticker__loading-spinner" />
          </div>
        </div>
        
        <!-- Image cards -->
        <StickerCard
          v-for="(image, index) in images"
          :key="image.id"
          :image="image"
          :index="index"
          :is-visible="showContent"
          class="animated-sticker__card"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Styles are defined in the main SCSS architecture
// Using the .animated-sticker class from assets/styles/components/_sticker.scss
</style>