/**
 * E2E Tests: Double Click Edit Mode
 *
 * ダブルクリック編集機能のエンドツーエンドテスト
 *
 * テスト対象機能:
 * 1. ダブルクリックで編集モードに入る
 * 2. テキストを編集できる
 * 3. 保存で編集内容が反映される
 * 4. キャンセルで元に戻る
 * 5. チャットウィンドウも開く
 */

import { test, expect } from '@playwright/test'
import { DemoPage } from '../pages/DemoPage'

test.describe('Double Click Edit Mode', () => {
  let demoPage: DemoPage

  test.beforeEach(async ({ page }) => {
    demoPage = new DemoPage(page)

    // デモページを開く
    await demoPage.goto()

    // プレビューモードを待機
    await demoPage.waitForPreviewMode()

    // 編集可能な要素が存在することを確認
    const editableCount = await demoPage.getEditableElementCount()
    expect(editableCount).toBeGreaterThan(0)
  })

  test.afterEach(async ({ page }) => {
    // 各テスト後にスクリーンショットを保存（失敗時のみ）
    if (test.info().status !== 'passed') {
      await page.screenshot({
        path: `test-results/screenshots/${test.info().title.replace(/\s+/g, '-')}-failed.png`,
        fullPage: true
      })
    }
  })

  test('should enter edit mode when double-clicking an editable element', async ({ page }) => {
    // Arrange: 最初の編集可能要素を取得
    const firstEditable = page.locator('[data-cpl-editable="true"]').first()
    const originalText = await firstEditable.textContent()

    // Act: ダブルクリックで編集モードに入る
    await demoPage.enterEditMode()

    // Assert: 編集モードに入ったことを確認
    expect(await demoPage.isEditModeActive()).toBe(true)

    // テキストエリアが表示されていることを確認
    await expect(demoPage.editTextArea).toBeVisible()

    // テキストエリアに元のテキストが含まれていることを確認
    const textareaValue = await demoPage.editTextArea.inputValue()
    expect(textareaValue.trim()).toBe((originalText || '').trim())

    // 保存ボタンが表示されていることを確認
    await expect(demoPage.saveButton).toBeVisible()

    // キャンセルボタンが表示されていることを確認
    await expect(demoPage.cancelButton).toBeVisible()
  })

  test('should allow editing text in the textarea', async ({ page }) => {
    // Arrange: 編集モードに入る
    await demoPage.enterEditMode()

    // Act: 新しいテキストを入力
    const newText = 'これは編集されたテキストです'
    await demoPage.editText(newText)

    // Assert: テキストエリアの値が更新されたことを確認
    const textareaValue = await demoPage.editTextArea.inputValue()
    expect(textareaValue).toBe(newText)
  })

  test('should save edited content when save button is clicked', async ({ page }) => {
    // Arrange: 編集モードに入る
    const firstEditable = page.locator('[data-cpl-editable="true"]').first()
    const originalText = await firstEditable.textContent()

    await demoPage.enterEditMode()

    // Act: テキストを編集して保存
    const newText = '保存されたテキストです'
    await demoPage.editText(newText)
    await demoPage.saveEdit()

    // Assert: 編集モードが終了したことを確認
    expect(await demoPage.isEditModeActive()).toBe(false)

    // 要素の内容が更新されたことを確認
    await expect(firstEditable).toContainText(newText)

    // 元のテキストと異なることを確認
    const currentText = await firstEditable.textContent()
    expect(currentText).not.toBe(originalText)
  })

  test('should cancel editing and revert to original content', async ({ page }) => {
    // Arrange: 編集モードに入る
    const firstEditable = page.locator('[data-cpl-editable="true"]').first()
    const originalText = await firstEditable.textContent()

    await demoPage.enterEditMode()

    // Act: テキストを編集してキャンセル
    const newText = 'このテキストはキャンセルされます'
    await demoPage.editText(newText)
    await demoPage.cancelEdit()

    // Assert: 編集モードが終了したことを確認
    expect(await demoPage.isEditModeActive()).toBe(false)

    // 要素の内容が元のままであることを確認
    await expect(firstEditable).toContainText((originalText || '').trim())

    // 編集したテキストが含まれていないことを確認
    await expect(firstEditable).not.toContainText(newText)
  })

  test('should open chat sidebar when entering edit mode', async ({ page }) => {
    // Arrange: 最初にチャットサイドバーが閉じている状態にする（可能な場合）
    // 注意: 現在の実装ではプレビューモードで常にチャットが開いている

    // Act: 編集モードに入る
    await demoPage.enterEditMode()

    // Assert: チャットサイドバーが開いていることを確認
    expect(await demoPage.isChatSidebarOpen()).toBe(true)

    // チャットサイドバーが表示されていることを確認
    await expect(demoPage.chatSidebar).toBeVisible()
  })

  test('should handle multiple edits on the same element', async ({ page }) => {
    // Arrange: 最初の編集
    const firstEditable = page.locator('[data-cpl-editable="true"]').first()

    // 1回目の編集
    await demoPage.enterEditMode()
    await demoPage.editText('1回目の編集')
    await demoPage.saveEdit()

    // Assert: 1回目の編集が反映されたことを確認
    await expect(firstEditable).toContainText('1回目の編集')

    // Act: 2回目の編集
    await demoPage.enterEditMode()
    await demoPage.editText('2回目の編集')
    await demoPage.saveEdit()

    // Assert: 2回目の編集が反映されたことを確認
    await expect(firstEditable).toContainText('2回目の編集')
    await expect(firstEditable).not.toContainText('1回目の編集')
  })

  test('should handle editing different elements', async ({ page }) => {
    // Arrange: 複数の編集可能要素が存在することを確認
    const editableCount = await demoPage.getEditableElementCount()
    expect(editableCount).toBeGreaterThan(1)

    // 最初の要素を編集
    const firstEditable = page.locator('[data-cpl-editable="true"]').nth(0)
    await demoPage.enterEditMode(firstEditable)
    await demoPage.editText('最初の要素のテキスト')
    await demoPage.saveEdit()

    // Assert: 最初の要素が更新されたことを確認
    await expect(firstEditable).toContainText('最初の要素のテキスト')

    // 2番目の要素を編集
    const secondEditable = page.locator('[data-cpl-editable="true"]').nth(1)
    await demoPage.enterEditMode(secondEditable)
    await demoPage.editText('2番目の要素のテキスト')
    await demoPage.saveEdit()

    // Assert: 2番目の要素が更新されたことを確認
    await expect(secondEditable).toContainText('2番目の要素のテキスト')

    // 最初の要素が変更されていないことを確認
    await expect(firstEditable).toContainText('最初の要素のテキスト')
  })

  test('should maintain selection state while editing', async ({ page }) => {
    // Arrange: 編集モードに入る
    const firstEditable = page.locator('[data-cpl-editable="true"]').first()

    // Act: ダブルクリックで編集モードに入る
    await demoPage.enterEditMode()

    // Assert: 編集中は選択状態が維持されていることを確認
    // 要素が編集可能な状態にあることを確認
    await expect(demoPage.editTextArea).toBeVisible()
    await expect(demoPage.saveButton).toBeVisible()
    await expect(demoPage.cancelButton).toBeVisible()

    // 編集モードが終了した後も選択状態が維持されていることを確認
    await demoPage.saveEdit()
    // 要素がまだ選択可能であることを確認
    await expect(firstEditable).toBeVisible()
  })

  test('should preserve element attributes after editing', async ({ page }) => {
    // Arrange: 編集モードに入る前に要素の属性を取得
    const firstEditable = page.locator('[data-cpl-editable="true"]').first()
    const elementId = await firstEditable.getAttribute('data-cpl-id')

    // Act: 編集モードに入って保存
    await demoPage.enterEditMode()
    await demoPage.editText('属性を保持したテキスト')
    await demoPage.saveEdit()

    // Assert: 要素の属性が保持されていることを確認
    const preservedId = await firstEditable.getAttribute('data-cpl-id')
    expect(preservedId).toBe(elementId)

    // data-cpl-editable属性がまだtrueであることを確認
    const editableAttr = await firstEditable.getAttribute('data-cpl-editable')
    expect(editableAttr).toBe('true')
  })

  test('should handle empty text edit', async ({ page }) => {
    // Arrange: 編集モードに入る
    const firstEditable = page.locator('[data-cpl-editable="true"]').first()
    const originalText = await firstEditable.textContent()

    // Act: テキストを空にして保存を試みる
    await demoPage.enterEditMode()
    await demoPage.editText('')

    // Assert: 保存ボタンが無効化されていることを確認
    await expect(demoPage.saveButton).toBeDisabled()

    // キャンセルで編集モードを終了
    await demoPage.cancelEdit()

    // 元のテキストが保持されていることを確認
    await expect(firstEditable).toContainText((originalText || '').trim())
  })

  test('should handle special characters in edit', async ({ page }) => {
    // Arrange: 編集モードに入る
    const firstEditable = page.locator('[data-cpl-editable="true"]').first()

    // Act: 特殊文字を含むテキストで編集
    const specialText = '特殊文字テスト: <>&"\'\\n\\t 日本語 Ñé'
    await demoPage.enterEditMode()
    await demoPage.editText(specialText)
    await demoPage.saveEdit()

    // Assert: 特殊文字が正しく反映されていることを確認
    await expect(firstEditable).toContainText('特殊文字テスト')
  })
})
