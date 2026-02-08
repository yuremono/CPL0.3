import { test, expect } from '@playwright/test';

test.describe('0205CPL0.3 Smoke Test', () => {
  test('should display homepage', async ({ page }) => {
    // ページを開く
    await page.goto('http://localhost:3000');

    // ページタイトルを確認
    await expect(page).toHaveTitle(/Portfolio/);

    // スクリーンショットを撮影
    await page.screenshot({
      path: 'playwright-screenshot-homepage.png',
      fullPage: true
    });

    // メインコンテンツが表示されていることを確認
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should display demo page', async ({ page }) => {
    // デモページを開く
    await page.goto('http://localhost:3000/demo');

    // ページタイトルを確認
    await expect(page).toHaveTitle(/Demo/);

    // スクリーンショットを撮影
    await page.screenshot({
      path: 'playwright-screenshot-demo.png',
      fullPage: true
    });

    // デモページのコンテンツが表示されていることを確認
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
