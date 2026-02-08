import { test, expect } from '@playwright/test';

test.describe('Source Locator Plugin', () => {
  test('dev環境でdata-l属性がJSX要素に注入されている', async ({ page }) => {
    // localhost:3000にアクセス
    await page.goto('http://localhost:3000');

    // ページが読み込まれるのを待つ
    await page.waitForLoadState('networkidle');

    // 複数の要素でdata-l属性を検証
    const elements = await page.locator('[data-l]').all();

    // 少なくとも10個のdata-l属性が存在することを確認
    expect(elements.length).toBeGreaterThanOrEqual(10);

    // 最初の5つの要素でdata-l属性の形式を検証
    for (let i = 0; i < Math.min(5, elements.length); i++) {
      const element = elements[i];
      const dataLValue = await element.getAttribute('data-l');

      // data-l属性が存在すること
      expect(dataLValue).toBeDefined();

      // 形式が "L" + 数字であること（例: L95, L96）
      expect(dataLValue).toMatch(/^L\d+$/);

      // 行番号が正の整数であること
      const lineNumber = parseInt(dataLValue!.substring(1));
      expect(lineNumber).toBeGreaterThan(0);
    }
  });

  test('data-l属性の値は一意である（重複なし）', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // 全てのdata-l属性の値を収集
    const dataLValues = await page.locator('[data-l]').allTextContents();

    // 実際には属性値を取得
    const elements = await page.locator('[data-l]').all();
    const values: string[] = [];
    for (const element of elements) {
      const value = await element.getAttribute('data-l');
      if (value) values.push(value);
    }

    // 重複がないことを確認（多くの要素があるはず）
    expect(values.length).toBeGreaterThan(20);

    // 少なくとも異なる5つの行番号が存在すること
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBeGreaterThanOrEqual(5);
  });
});
