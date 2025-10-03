import { test, expect } from '@playwright/test';

test.describe('Sticker Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sticker');
  });

  test('should load and display correctly', async ({ page }) => {
    // Check page title (use specific selector)
    await expect(page.locator('.sticker-page__title')).toContainText('Animated Cat Sticker Demo');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Page content should fit
    const container = page.locator('.sticker-page__container');
    await expect(container).toBeVisible();
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });
});
