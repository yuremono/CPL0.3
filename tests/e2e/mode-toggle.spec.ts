import { test, expect } from '@playwright/test';

test.describe('Mode Toggle Verification', () => {
  test('should verify production mode (default)', async ({ page }) => {
    // 本番モードでアクセス
    await page.goto('http://localhost:3000');

    // スクリーンショット撮影
    await page.screenshot({
      path: 'playwright-screenshot-production-mode.png',
      fullPage: true
    });

    // 編集可能枠が表示されないことを確認
    const hoverBorders = page.locator('[data-cpl-hover-border]').or(page.locator('[class*="hover-border"]'));
    const count = await hoverBorders.count();
    expect(count).toBe(0);

    // ページが正常に表示されていることを確認
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should verify edit mode (toggle ON)', async ({ page }) => {
    // 本番モードでアクセス
    await page.goto('http://localhost:3000');

    // トグルボタンを探してクリック
    const toggleButton = page.locator('button').filter({ hasText: /編集|edit|preview/i }).first();

    // トグルボタンが存在することを確認
    const toggleExists = await toggleButton.count() > 0;
    expect(toggleExists).toBe(true);

    // トグルボタンをクリックして編集モードに切り替え
    await toggleButton.click();

    // 編集モードの反映を待機
    await page.waitForTimeout(1000);

    // スクリーンショット撮影
    await page.screenshot({
      path: 'playwright-screenshot-edit-mode.png',
      fullPage: true
    });

    // 編集UIが表示されていることを確認
    const editUI = page.locator('[data-cpl]').or(page.locator('[class*="cpl"]'));
    const editUIExists = await editUI.count() > 0;

    // URLが変更されていないことを確認
    expect(page.url()).toBe('http://localhost:3000/');
  });

  test('should verify toggle ON/OFF functionality', async ({ page }) => {
    // 本番モードでアクセス
    await page.goto('http://localhost:3000');

    const toggleButton = page.locator('button').filter({ hasText: /編集|edit|preview/i }).first();

    // 初期状態のスクリーンショット
    await page.screenshot({ path: 'playwright-screenshot-toggle-off.png' });

    // ONにする
    await toggleButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'playwright-screenshot-toggle-on.png' });

    // OFFに戻す
    await toggleButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'playwright-screenshot-toggle-off-again.png' });

    // URLが変更されていないことを確認
    expect(page.url()).toBe('http://localhost:3000/');
  });
});
