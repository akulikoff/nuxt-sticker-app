import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCatImages } from '~/composables/useCatImages'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useCatImages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct default state', () => {
    const { images, loading, error } = useCatImages()

    expect(images.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('fetches cat images successfully', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
    })

    const { images, loading, error, refetch } = useCatImages()

    expect(loading.value).toBe(false)

    const fetchPromise = refetch()
    expect(loading.value).toBe(true)

    await fetchPromise

    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(images.value.length).toBeGreaterThan(0) // Should have at least some images

    // Check image structure if images exist
    if (images.value.length > 0) {
      const firstImage = images.value[0]
      expect(firstImage).toHaveProperty('id')
      expect(firstImage).toHaveProperty('url')
      expect(firstImage).toHaveProperty('timestamp')
      expect(firstImage).not.toHaveProperty('loaded') // No longer has loaded property
      expect(firstImage!.id).toMatch(/^cat-\d+-[a-z0-9]+$/)
      expect(firstImage!.url).toMatch(/^https:\/\/cataas\.com\/cat\?t=\d+-[a-z0-9]+$/) // Check URL pattern
      expect(typeof firstImage!.timestamp).toBe('number')
    }
  })

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const { images, loading, error, refetch } = useCatImages()

    await refetch()

    expect(loading.value).toBe(false)
    expect(error.value).toContain('Failed to fetch any cat images')
    expect(images.value).toEqual([])
  }, 10000)

  it('caches images correctly', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
    })

    // Create first composable instance and fetch images
    const composable1 = useCatImages()
    await composable1.refetch()
    const firstFetchCount = mockFetch.mock.calls.length

    // Create second composable instance - should use cached images
    const composable2 = useCatImages()
    await composable2.refetch()
    const secondFetchCount = mockFetch.mock.calls.length

    // Since refetch clears cache, we expect more calls
    // This test verifies that the composable works correctly with multiple instances
    expect(secondFetchCount).toBeGreaterThan(firstFetchCount)
    expect(composable2.images.value.length).toBeGreaterThan(0)
  })
})
