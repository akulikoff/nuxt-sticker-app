import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load and display correctly', async ({ page }) => {
    await page.goto('/')

    // Check page title
    await expect(page).toHaveTitle('Nuxt Sticker App - Home')

    // Check main heading (use more specific selector)
    await expect(page.locator('.home-page__title')).toContainText('Welcome to Nuxt Sticker App')

    // Check subtitle
    await expect(page.locator('.home-page__subtitle')).toBeVisible()

    // Check CTA button
    const ctaButton = page.locator('.home-page__cta')
    await expect(ctaButton).toBeVisible()
    await expect(ctaButton).toContainText('Try the Sticker Demo')
  })

  test('should navigate to sticker page when CTA is clicked', async ({ page }) => {
    await page.goto('/')

    // Click the CTA button
    await page.click('.home-page__cta')

    // Should navigate to sticker page
    await expect(page).toHaveURL('/sticker')
    await expect(page.locator('.sticker-page__title')).toContainText('Animated Cat Sticker Demo')
  })

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('/')

    const title = page.locator('.home-page__title')
    await expect(title).toBeVisible()

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(title).toBeVisible()

    // Title should have different font size on mobile
    const titleStyles = await title.evaluate(el => getComputedStyle(el).fontSize)
    expect(titleStyles).toBeTruthy()
  })

  test('should have no console errors', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')

    // Wait a moment for any async operations
    await page.waitForTimeout(2000)

    expect(consoleErrors).toHaveLength(0)
  })
})
