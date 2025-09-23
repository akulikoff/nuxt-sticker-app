import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AnimatedSticker from '~/components/AnimatedSticker.vue'
import type { CatImage } from '~/types'

// Mock the useCatImages composable
const mockRefetch = vi.fn().mockResolvedValue(undefined)
const mockImages = ref<CatImage[]>([])
const mockLoading = ref(false)
const mockError = ref<string | null>(null)

vi.mock('~/composables/useCatImages', () => ({
  useCatImages: () => ({
    images: readonly(mockImages),
    loading: readonly(mockLoading),
    error: readonly(mockError),
    refetch: mockRefetch,
  }),
}))

// Mock StickerCard component
vi.mock('~/components/StickerCard.vue', () => ({
  default: {
    name: 'StickerCard',
    props: ['image', 'index', 'isVisible'],
    template: '<div class="sticker-card-mock">{{ image.id }}</div>',
  },
}))

describe('AnimatedSticker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockImages.value = []
    mockLoading.value = false
    mockError.value = null
  })

  it('renders trigger button correctly', () => {
    const wrapper = mount(AnimatedSticker)

    const trigger = wrapper.find('.animated-sticker__trigger')
    expect(trigger.exists()).toBe(true)
    expect(trigger.attributes('aria-label')).toBe('Open cat sticker')
  })

  it('shows loading state correctly', async () => {
    mockLoading.value = true

    const wrapper = mount(AnimatedSticker)

    expect(wrapper.find('.animated-sticker__trigger--loading').exists()).toBe(true)
    expect(wrapper.find('.animated-sticker__trigger-spinner').exists()).toBe(true)
  })

  it('shows error state correctly', async () => {
    mockError.value = 'Failed to fetch images'

    const wrapper = mount(AnimatedSticker)

    expect(wrapper.find('.animated-sticker__trigger--error').exists()).toBe(true)
  })

  it('displays error message and retry button when expanded with error', async () => {
    mockError.value = 'Network error'

    const wrapper = mount(AnimatedSticker)

    // Click trigger to expand
    await wrapper.find('.animated-sticker__trigger').trigger('click')

    expect(wrapper.find('.animated-sticker__error').exists()).toBe(true)
    expect(wrapper.text()).toContain('Network error')

    const retryButton = wrapper.find('.animated-sticker__retry-btn')
    expect(retryButton.exists()).toBe(true)

    await retryButton.trigger('click')
    expect(mockRefetch).toHaveBeenCalled()
  })

  it('displays images correctly with direct URLs', async () => {
    const testImages: CatImage[] = [
      {
        id: 'cat-1',
        url: 'https://cataas.com/cat?t=123-abc',
        timestamp: Date.now(),
      },
      {
        id: 'cat-2',
        url: 'https://cataas.com/cat?t=456-def',
        timestamp: Date.now(),
      },
    ]

    mockImages.value = testImages

    const wrapper = mount(AnimatedSticker)

    // Click trigger to expand
    await wrapper.find('.animated-sticker__trigger').trigger('click')

    const stickerCards = wrapper.findAll('.sticker-card-mock')
    expect(stickerCards).toHaveLength(2)
    expect(stickerCards[0]!.text()).toBe('cat-1')
    expect(stickerCards[1]!.text()).toBe('cat-2')
  })

  it('calls refetch when expanding with no images', async () => {
    const wrapper = mount(AnimatedSticker)

    await wrapper.find('.animated-sticker__trigger').trigger('click')

    expect(mockRefetch).toHaveBeenCalled()
  })

  it('calls refetch on mouse enter when no images', async () => {
    const wrapper = mount(AnimatedSticker)

    await wrapper.trigger('mouseenter')

    expect(mockRefetch).toHaveBeenCalled()
  })

  it('toggles expanded state correctly', async () => {
    // Mock Date.now before mounting to control initial state
    const mockNow = vi.spyOn(Date, 'now')
    mockNow.mockReturnValue(0) // Initial time for mount

    const wrapper = mount(AnimatedSticker)
    await wrapper.vm.$nextTick()

    const trigger = wrapper.find('.animated-sticker__trigger')

    // Initially not expanded
    expect(trigger.attributes('aria-label')).toBe('Open cat sticker')

    // First click - mock the two Date.now calls in handleTriggerClick
    mockNow.mockReturnValueOnce(1000) // For debounce check
    mockNow.mockReturnValueOnce(1000) // For lastTapTime assignment

    // Click to expand
    await trigger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(trigger.attributes('aria-label')).toBe('Close cat sticker')

    // Second click - after debounce delay
    mockNow.mockReturnValueOnce(1400) // For debounce check (400ms later)
    mockNow.mockReturnValueOnce(1400) // For lastTapTime assignment

    // Click to collapse
    await trigger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(trigger.attributes('aria-label')).toBe('Open cat sticker')

    mockNow.mockRestore()
  })

  it('handles mouse leave correctly', async () => {
    const wrapper = mount(AnimatedSticker)

    // Mouse enter to expand
    await wrapper.trigger('mouseenter')

    // Mouse leave should start collapse timer
    await wrapper.trigger('mouseleave')

    // Wait for timeout
    await new Promise(resolve => setTimeout(resolve, 350))

    const trigger = wrapper.find('.animated-sticker__trigger')
    expect(trigger.attributes('aria-label')).toBe('Open cat sticker')
  })
})
