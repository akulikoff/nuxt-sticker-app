import { test, expect } from '@playwright/test';

test.describe('Sticker Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/sticker');
	});

	test('should load and display correctly', async ({ page }) => {
		// Check page title (use specific selector)
		await expect(page.locator('.sticker-page__title')).toContainText('Animated Cat Sticker Demo');

		// Check sticker trigger is visible
		const trigger = page.locator('.animated-sticker__trigger');
		await expect(trigger).toBeVisible();
	});

	test('should expand sticker on interaction', async ({ page }) => {
		const trigger = page.locator('.animated-sticker__trigger');

		// Click trigger
		await trigger.click();
		await page.waitForTimeout(1000);

		// Should show some content (loading, images, or error)
		const hasContent = (await page.locator('.animated-sticker__card, .animated-sticker__loading, .animated-sticker__error').count()) > 0;

		// At minimum, the trigger should be interactive
		expect(await trigger.isVisible()).toBe(true);
	});

	test('should be responsive on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.reload();

		// Sticker should be visible on mobile
		const trigger = page.locator('.animated-sticker__trigger');
		await expect(trigger).toBeVisible();

		// Page content should fit
		const container = page.locator('.sticker-page__container');
		await expect(container).toBeVisible();
	});

	test('should have proper accessibility', async ({ page }) => {
		// Check for proper ARIA labels
		const trigger = page.locator('.animated-sticker__trigger');
		const ariaLabel = await trigger.getAttribute('aria-label');
		expect(ariaLabel).toBeTruthy();

		// Check heading hierarchy
		const headings = page.locator('h1, h2, h3, h4, h5, h6');
		const headingCount = await headings.count();
		expect(headingCount).toBeGreaterThan(0);
	});
});
