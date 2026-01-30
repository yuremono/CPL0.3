/**
 * Chat Toggle Button E2E Test
 *
 * チャット開閉ボタンのE2Eテスト
 *
 * 注意: デモページではプレビューモード時にチャットが自動的に開く仕様となっています。
 */

import { test, expect } from '@playwright/test'

test.describe('Chat Toggle Button', () => {

  test('should show chat toggle button in bottom right corner', async ({ page }) => {
    // デモページを開く（プレビューモードではチャットが自動的に開く）
    await page.goto('/demo?mode=preview')
    await page.waitForLoadState('networkidle')

    // チャットトグルボタンが表示されることを確認
    // 固定ボタン（fixed）で識別して、右下のボタンを取得
    const toggleButton = page.locator('button.fixed[aria-label="チャットを閉じる"]')
    await expect(toggleButton).toBeVisible()
    await page.screenshot({ path: 'test-results/screenshots/chat-toggle-visible.png' })

    // ボタンが右下に配置されていることを確認
    const boundingBox = await toggleButton.boundingBox()
    expect(boundingBox).not.toBeNull()

    if (boundingBox) {
      // 右下にあることの確認（x座標が大きく、y座標が大きい）
      expect(boundingBox.x).toBeGreaterThan(100) // 画面の右側
      expect(boundingBox.y).toBeGreaterThan(400) // 画面の下側
    }
  })

  test('should close chat when toggle button is clicked', async ({ page }) => {
    // デモページを開く（チャットが開いている状態）
    await page.goto('/demo?mode=preview')
    await page.waitForLoadState('networkidle')

    // チャットが開いていることを確認
    const chatSidebar = page.locator('aside[aria-label="AIアシスタントチャット"]')
    await expect(chatSidebar).toHaveClass(/translate-x-0/)

    // 閉じるボタンをクリック（固定ボタンを識別）
    const toggleButton = page.locator('button.fixed[aria-label="チャットを閉じる"]')
    await toggleButton.click()
    await page.waitForTimeout(300) // アニメーション完了を待機
    await page.screenshot({ path: 'test-results/screenshots/chat-closed-by-toggle.png' })

    // チャットが閉じていることを確認
    await expect(chatSidebar).toHaveClass(/translate-x-full/)

    // 開くボタンが表示されることを確認
    const openButton = page.locator('button.fixed[aria-label="チャットを開く"]')
    await expect(openButton).toBeVisible()
  })

  test('should open chat when toggle button is clicked after closing', async ({ page }) => {
    // デモページを開く（チャットが開いている状態）
    await page.goto('/demo?mode=preview')
    await page.waitForLoadState('networkidle')

    // まずチャットを閉じる
    const toggleButton = page.locator('button.fixed[aria-label="チャットを閉じる"]')
    await toggleButton.click()
    await page.waitForTimeout(300)

    // チャットが閉じていることを確認
    const chatSidebar = page.locator('aside[aria-label="AIアシスタントチャット"]')
    await expect(chatSidebar).toHaveClass(/translate-x-full/)

    // 開くボタンをクリック
    const openButton = page.locator('button.fixed[aria-label="チャットを開く"]')
    await openButton.click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'test-results/screenshots/chat-opened-by-toggle.png' })

    // チャットが開いていることを確認
    await expect(chatSidebar).toHaveClass(/translate-x-0/)
  })

  test('should not blur content area when chat is open', async ({ page }) => {
    // デモページを開く（チャットが開いている状態）
    await page.goto('/demo?mode=preview')
    await page.waitForLoadState('networkidle')

    // コンテンツエリアにオーバーレイ（ぼかし）がないことを確認
    // オーバーレイは削除されているので存在しないはず
    const overlay = page.locator('.fixed.inset-0.bg-black\\/20.backdrop-blur-sm')
    await expect(overlay).toHaveCount(0)

    // ページ全体のスクリーンショットを撮ってぼかしがないことを確認
    await page.screenshot({ path: 'test-results/screenshots/no-blur-when-chat-open.png', fullPage: true })
  })

  test('should toggle button icon change between chat and close icons', async ({ page }) => {
    // デモページを開く（チャットが開いている状態）
    await page.goto('/demo?mode=preview')
    await page.waitForLoadState('networkidle')

    // 初期状態：閉じるボタンが表示されていることを確認
    const closeButton = page.locator('button.fixed[aria-label="チャットを閉じる"]')
    await expect(closeButton).toBeVisible()

    // チャットを閉じる
    await closeButton.click()
    await page.waitForTimeout(300)

    // 開くボタンが表示されていることを確認
    const openButton = page.locator('button.fixed[aria-label="チャットを開く"]')
    await expect(openButton).toBeVisible()
    await expect(closeButton).not.toBeVisible()
  })
})
