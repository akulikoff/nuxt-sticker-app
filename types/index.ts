// Type definitions for the Nuxt Sticker App

// Generic Ref type for Vue reactivity
type Ref<T> = {
  value: T
}

// Cat Image Interface
export interface CatImage {
  id: string
  url: string
  timestamp: number
  loaded: boolean
  error?: string
}

// Sticker State Interface
export interface StickerState {
  isExpanded: boolean
  isHovered: boolean
  images: CatImage[]
  loading: boolean
  error: string | null
}

// Animation Configuration Interface
export interface AnimationConfig {
  duration: number
  easing: string
  stagger: number
  transforms: {
    scale: number
    translateX: number
    translateY: number
  }
}

// API Response Interface
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Composable Return Types
export interface CatImagesComposable {
  images: Ref<CatImage[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  refetch: () => Promise<void>
}

// Component Props Types
export interface StickerCardProps {
  image: CatImage
  index: number
  isVisible: boolean
}

export interface ImageLoaderProps {
  src: string
  alt: string
  loading?: 'lazy' | 'eager'
  fallback?: string
}

// Navigation Types
export interface NavigationItem {
  name: string
  path: string
  isActive?: boolean
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Error Types
export interface AppError {
  message: string
  code?: number
  timestamp: number
}