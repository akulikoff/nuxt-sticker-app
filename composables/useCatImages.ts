import type { CatImage, CatImagesComposable } from '~/types'

/**
 * Composable for fetching cat images from the cataas.com API
 * Provides reactive state management and error handling
 */
export function useCatImages(): CatImagesComposable {
  const images = ref<CatImage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch a single cat image with retry logic
   */
  const fetchSingleCatImage = async (retries = 3): Promise<CatImage | null> => {
    try {
      const response = await fetch('https://cataas.com/cat')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      if (!blob) {
        throw new Error('No image data received')
      }

      // Create blob URL for the image
      const imageUrl = URL.createObjectURL(blob)
      
      return {
        id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        timestamp: Date.now(),
        loaded: false,
      }
    } catch (err) {
      console.warn('Failed to fetch cat image:', err)
      
      if (retries > 0) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000))
        return fetchSingleCatImage(retries - 1)
      }
      
      return null
    }
  }

  /**
   * Preload image to ensure it's loaded before displaying
   */
  const preloadImage = (catImage: CatImage): Promise<CatImage> => {
    return new Promise((resolve) => {
      const img = new Image()
      
      img.onload = () => {
        catImage.loaded = true
        resolve(catImage)
      }
      
      img.onerror = () => {
        catImage.error = 'Failed to load image'
        resolve(catImage)
      }
      
      img.src = catImage.url
    })
  }

  /**
   * Fetch multiple cat images concurrently
   */
  const fetchCatImages = async (count = 3): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      // Fetch images concurrently
      const fetchPromises = Array.from({ length: count }, () => fetchSingleCatImage())
      const results = await Promise.all(fetchPromises)
      
      // Filter out failed requests
      const validImages = results.filter((img): img is CatImage => img !== null)
      
      if (validImages.length === 0) {
        throw new Error('Failed to fetch any cat images')
      }
      
      // Preload all images
      const preloadedImages = await Promise.all(
        validImages.map(img => preloadImage(img))
      )
      
      images.value = preloadedImages
    } catch (err) {
      console.error('Error fetching cat images:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch cat images'
      images.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Cleanup blob URLs to prevent memory leaks
   */
  const cleanup = () => {
    images.value.forEach(image => {
      if (image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url)
      }
    })
    images.value = []
  }

  /**
   * Refetch images (public API)
   */
  const refetch = async (): Promise<void> => {
    cleanup()
    await fetchCatImages()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    images: readonly(images),
    loading: readonly(loading),
    error: readonly(error),
    refetch,
  }
}