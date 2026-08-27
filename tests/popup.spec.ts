import { test, expect } from '@playwright/test';

test.describe('Popup', async () => {
  test('applies MapLibre default max width when maxWidth is not set', async ({ page }) => {
    await page.goto('/tests/standalone-popup');

    const popup = page.locator('.maplibregl-popup');
    await expect(popup).toBeVisible();
    await expect(popup).toHaveCSS('max-width', '240px');
  });
});
