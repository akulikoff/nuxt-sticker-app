import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import StickerCard from '~/components/StickerCard.vue'
import type { CatImage } from '~/types'

// Mock NuxtImg component
const NuxtImg = {
  name: 'NuxtImg',
  template: '<img :src="src" :alt="alt" :loading="loading" class="nuxt-img" />',
  props: [
    'src',
    'alt',
    'loading',
    'width',
    'height',
    'quality',
    'format',
    'sizes',
    'densities',
    'placeholder',
  ],
}

describe('StickerCard', () => {
  const mockImage: CatImage = {
    id: 'test-cat-123',
    url: 'https://example.com/cat.jpg',
    timestamp: Date.now(),
  }

  let wrapper: VueWrapper<InstanceType<typeof StickerCard>>

  beforeEach(() => {
    wrapper = mount(StickerCard, {
      props: {
        image: mockImage,
        index: 0,
        isVisible: true,
      },
      global: {
        components: {
          NuxtImg,
        },
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('sticker-card')
  })

  it('applies visible class when isVisible is true', () => {
    expect(wrapper.classes()).toContain('sticker-card--visible')
  })

  it('does not apply visible class when isVisible is false', async () => {
    await wrapper.setProps({ isVisible: false })
    expect(wrapper.classes()).not.toContain('sticker-card--visible')
  })

  it('delegates loading and error states to NuxtImg component', () => {
    // Loading and error states are now handled by the NuxtImg component
    // This test verifies that the NuxtImg is properly integrated
    const nuxtImg = wrapper.findComponent({ name: 'NuxtImg' })
    expect(nuxtImg.exists()).toBe(true)
    // Check that placeholder div exists when image is not loaded
    const placeholder = wrapper.find('.sticker-card__placeholder')
    expect(placeholder.exists()).toBe(true)
  })

  it('computes animation delay correctly', () => {
    const delayStyle = (wrapper.vm as any).animationDelay
    expect(delayStyle).toBe('0ms')

    // Test with different index
    wrapper = mount(StickerCard, {
      props: {
        image: mockImage,
        index: 2,
        isVisible: true,
      },
      global: {
        components: {
          NuxtImg,
        },
      },
    })
    expect((wrapper.vm as any).animationDelay).toBe('200ms')
  })

  it('handles mouse enter and leave events', async () => {
    expect((wrapper.vm as any).isHovered).toBe(false)

    await wrapper.trigger('mouseenter')
    expect((wrapper.vm as any).isHovered).toBe(true)
    expect(wrapper.classes()).toContain('sticker-card--hovered')

    await wrapper.trigger('mouseleave')
    expect((wrapper.vm as any).isHovered).toBe(false)
    expect(wrapper.classes()).not.toContain('sticker-card--hovered')
  })

  it('shows overlay with image info on hover', async () => {
    await wrapper.trigger('mouseenter')

    const overlay = wrapper.find('.sticker-card__overlay')
    expect(overlay.exists()).toBe(true)

    const imageId = wrapper.find('.sticker-card__id')
    expect(imageId.exists()).toBe(true)
    expect(imageId.text()).toContain(mockImage.id.slice(-8))

    const timestamp = wrapper.find('.sticker-card__timestamp')
    expect(timestamp.exists()).toBe(true)
  })

  it('passes correct props to NuxtImg', () => {
    const nuxtImg = wrapper.findComponent({ name: 'NuxtImg' })
    expect(nuxtImg.exists()).toBe(true)
    expect(nuxtImg.props('src')).toBe(mockImage.url)
    expect(nuxtImg.props('alt')).toContain('Cute cat photo')
    expect(nuxtImg.props('loading')).toBe('eager')
    expect(nuxtImg.props('width')).toBe('120')
    expect(nuxtImg.props('height')).toBe('120')
    expect(nuxtImg.props('format')).toBe('jpeg')
    expect(nuxtImg.props('quality')).toBe('85')
  })
})
