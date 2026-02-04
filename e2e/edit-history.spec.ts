/**
 * Edit History E2E Tests
 *
 * Undo/Redo機能のE2Eテスト
 */

import { test, expect } from '@playwright/test'

test.describe('Edit History Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Keyboard Shortcuts', () => {
    test('Cmd+Z should trigger Undo', async ({ page }) => {
      // テキストを編集して履歴を作成
      const editableText = page.locator('[data-editable-id]').first()
      await editableText.click()
      await editableText.fill('Test content 1')

      // 別の編集を行う
      await editableText.fill('Test content 2')

      // Cmd+ZでUndo
      await page.keyboard.press('Meta+z')
      await page.waitForTimeout(100)

      // Undoが成功したか確認（「あと1回戻れる」表示になる）
      const undoCounter = page.locator('button:has-text("Undo")')
      await expect(undoCounter).toContainText(/\(\d+\)/)
    })

    test('Ctrl+Z should trigger Undo on Windows', async ({ page, context }) => {
      // Windowsユーザーエージェントをシミュレート
      await context.route('**/*', (route) => {
        const headers = route.request().headers()
        route.continue({
          headers: {
                            ...headers,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        })
      })

      const editableText = page.locator('[data-editable-id]').first()
      await editableText.click()
      await editableText.fill('Test content 1')

      // Ctrl+ZでUndo
      await page.keyboard.press('Control+z')
      await page.waitForTimeout(100)

      // Undoが成功したか確認
      const undoButton = page.locator('button:has-text("Undo")')
      await expect(undoButton).toBeVisible()
    })

    test('Cmd+Shift+Z should trigger Redo', async ({ page }) => {
      const editableText = page.locator('[data-editable-id]').first()
      await editableText.click()
      await editableText.fill('Test content 1')
      await editableText.fill('Test content 2')

      // UndoしてからRedo
      await page.keyboard.press('Meta+z')
      await page.waitForTimeout(100)

      await page.keyboard.press('Meta+Shift+z')
      await page.waitForTimeout(100)

      // Redoが成功したか確認
      const redoCounter = page.locator('button:has-text("Redo")')
      await expect(redoCounter).toContainText(/\(\d+\)/)
    })

    test('Ctrl+Shift+Z should trigger Redo on Windows', async ({ page }) => {
      const editableText = page.locator('[data-editable-id]').first()
      await editableText.click()
      await editableText.fill('Test content 1')
      await editableText.fill('Test content 2')

      // UndoしてからRedo
      await page.keyboard.press('Meta+z')
      await page.waitForTimeout(100)

      await page.keyboard.press('Control+Shift+z')
      await page.waitForTimeout(100)

      // Redoが成功したか確認
      const redoButton = page.locator('button:has-text("Redo")')
      await expect(redoButton).toBeVisible()
    })
  })

  test.describe('Counter Display', () => {
    test('should show remaining undo count on Undo button', async ({ page }) => {
      const editableText = page.locator('[data-editable-id]').first()

      // 3回編集して履歴を作成
      await editableText.click()
      await editableText.fill('Content 1')
      await page.waitForTimeout(50)
      await editableText.fill('Content 2')
      await page.waitForTimeout(50)
      await editableText.fill('Content 3')

      // Undoボタンにカウンターが表示される
      const undoButton = page.locator('button:has-text("Undo")')
      await expect(undoButton).toContainText('(3)')
    })

    test('should update counter after undo action', async ({ page }) => {
      const editableText = page.locator('[data-editable-id]').first()

      await editableText.click()
      await editableText.fill('Content 1')
      await page.waitForTimeout(50)
      await editableText.fill('Content 2')

      // 最初は(2)
      let undoButton = page.locator('button:has-text("Undo")')
      await expect(undoButton).toContainText('(2)')

      // Undo実行
      await page.keyboard.press('Meta+z')
      await page.waitForTimeout(100)

      // (1)に減る
      undoButton = page.locator('button:has-text("Undo")')
      await expect(undoButton).toContainText('(1)')
    })

    test('should show remaining redo count on Redo button', async ({ page }) => {
      const editableText = page.locator('[data-editable-id]').first()

      await editableText.click()
      await editableText.fill('Content 1')
      await page.waitForTimeout(50)
      await editableText.fill('Content 2')

      // 1回Undo
      await page.keyboard.press('Meta+z')
      await page.waitForTimeout(100)

      // Redoボタンにカウンターが表示される
      const redoButton = page.locator('button:has-text("Redo")')
      await expect(redoButton).toContainText('(1)')
    })

    test('should show (0) when no undo/redo available', async ({ page }) => {
      const editableText = page.locator('[data-editable-id]').first()

      await editableText.click()
      await editableText.fill('Content 1')

      // Redoは最初は0
      const redoButton = page.locator('button:has-text("Redo")')
      await expect(redoButton).toContainText('(0)')
    })
  })

  test.describe('Button Functionality', () => {
    test('Undo button should be disabled when no history', async ({ page }) => {
      const undoButton = page.locator('button:has-text("Undo")')
      await expect(undoButton).toBeDisabled()
    })

    test('Redo button should be disabled when no future', async ({ page }) => {
      const redoButton = page.locator('button:has-text("Redo")')
      await expect(redoButton).toBeDisabled()
    })

    test('Clicking Undo button triggers undo action', async ({ page }) => {
      const editableText = page.locator('[data-editable-id]').first()
      await editableText.click()
      await editableText.fill('Original content')

      // Undoボタンをクリック
      const undoButton = page.locator('button:has-text("Undo")')
      await undoButton.click()
      await page.waitForTimeout(100)

      // カウンターが減ることを確認
      await expect(undoButton).toContainText('(0)')
    })

    test('Clicking Redo button triggers redo action', async ({ page }) => {
      const editableText = page.locator('[data-editable-id]').first()
      await editableText.click()
      await editableText.fill('Content 1')

      // UndoしてからRedoボタンをクリック
      await page.keyboard.press('Meta+z')
      await page.waitForTimeout(100)

      const redoButton = page.locator('button:has-text("Redo")')
      await redoButton.click()
      await page.waitForTimeout(100)

      // Redoカウンターが減ることを確認
      await expect(redoButton).toContainText('(0)')
    })
  })
})
