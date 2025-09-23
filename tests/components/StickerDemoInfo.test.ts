import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StickerDemoInfo from '~/components/StickerDemoInfo.vue'

describe('StickerDemoInfo', () => {
  it('renders correctly', () => {
    const wrapper = mount(StickerDemoInfo)

    expect(wrapper.find('.sticker-page__demo-info').exists()).toBe(true)
    expect(wrapper.find('section').exists()).toBe(true)
  })

  it('displays the correct title with emoji', () => {
    const wrapper = mount(StickerDemoInfo)

    const title = wrapper.find('.sticker-page__demo-info-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('🐱 Interactive Demo')
    expect(title.element.tagName).toBe('H2')
  })

  it('displays the correct demo information text', () => {
    const wrapper = mount(StickerDemoInfo)

    const text = wrapper.find('.sticker-page__demo-info-text')
    expect(text.exists()).toBe(true)
    expect(text.text()).toContain(
      'Look for the animated sticker button on the right side of your screen'
    )
    expect(text.text()).toContain(
      'Hover over it to reveal adorable cat images fetched in real-time!'
    )
    expect(text.element.tagName).toBe('P')
  })

  it('has the correct semantic structure', () => {
    const wrapper = mount(StickerDemoInfo)

    // Should be wrapped in a section element
    const section = wrapper.find('section')
    expect(section.exists()).toBe(true)
    expect(section.classes()).toContain('sticker-page__demo-info')

    // Should have proper heading hierarchy
    const h2 = wrapper.find('h2')
    expect(h2.exists()).toBe(true)
    expect(h2.classes()).toContain('sticker-page__demo-info-title')

    // Should have descriptive paragraph
    const p = wrapper.find('p')
    expect(p.exists()).toBe(true)
    expect(p.classes()).toContain('sticker-page__demo-info-text')
  })

  it('has the correct CSS classes', () => {
    const wrapper = mount(StickerDemoInfo)

    expect(wrapper.find('.sticker-page__demo-info').exists()).toBe(true)
    expect(wrapper.find('.sticker-page__demo-info-title').exists()).toBe(true)
    expect(wrapper.find('.sticker-page__demo-info-text').exists()).toBe(true)
  })

  it('is accessible', () => {
    const wrapper = mount(StickerDemoInfo)

    // Check for proper semantic HTML
    expect(wrapper.find('section').exists()).toBe(true)

    // Check for proper heading structure
    const h2 = wrapper.find('h2')
    expect(h2.exists()).toBe(true)

    // Check for descriptive content
    const text = wrapper.find('p')
    expect(text.exists()).toBe(true)
    expect(text.text().length).toBeGreaterThan(50) // Has meaningful content
  })

  it('renders as a presentational component', () => {
    const wrapper = mount(StickerDemoInfo)

    // Should not have any interactive elements
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)

    // Should be purely presentational
    expect(wrapper.vm).toBeDefined()
  })

  it('contains instructional content', () => {
    const wrapper = mount(StickerDemoInfo)

    const text = wrapper.find('.sticker-page__demo-info-text').text()

    // Should provide clear instructions
    expect(text).toContain('Look for')
    expect(text).toContain('Hover over')
    expect(text).toContain('right side')
    expect(text).toContain('real-time')
  })
})
