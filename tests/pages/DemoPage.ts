/**
 * Demo Page Object Model
 *
 * デモページのPage Object Model
 */

import { Page, Locator } from '@playwright/test'

export class DemoPage {
  readonly page: Page

  // ロケーター定義
  readonly url: string
  readonly previewModeToggle: Locator
  readonly heading: Locator
  readonly editableParagraph: Locator
  readonly chatSidebar: Locator
  readonly providerButtons: Locator
  readonly messageInput: Locator
  readonly sendButton: Locator
  readonly messageList: Locator
  readonly elementInfoCard: Locator
  readonly loadingIndicator: Locator

  // ダブルクリック編集用のロケーター
  readonly editableElements: Locator
  readonly editTextArea: Locator
  readonly saveButton: Locator
  readonly cancelButton: Locator
  readonly editModeOverlay: Locator

  constructor(page: Page) {
    this.page = page
    this.url = '/demo?mode=preview'

    // デモページの主要なロケーター
    this.previewModeToggle = page.locator('button', { hasText: /プレビューに切り替え/ })
    this.heading = page.locator('h2:has-text("これは編集可能な見出しです")')
    this.editableParagraph = page.locator('p:has-text("これは編集可能な段落です。")')

    // チャットUIのロケーター
    this.chatSidebar = page.locator('aside[aria-label="AIアシスタントチャット"]')
    // プロバイダーボタン（個別に取得するメソッドを使用）
    this.providerButtons = page.locator('aside[aria-label="AIアシスタントチャット"] button')
    this.messageInput = page.locator('textarea[placeholder="AIに編集を依頼..."]')
    this.sendButton = page.locator('button:has-text("送信")')
    this.messageList = page.locator('[role="list"]')
    this.elementInfoCard = page.locator('text=選択中の要素')
    this.loadingIndicator = page.locator('text=/AIが考え中|編集中/')

    // ダブルクリック編集用のロケーター
    this.editableElements = page.locator('[data-cpl-editable="true"]')
    this.editTextArea = page.locator('[data-testid="edit-textarea"]')
    this.saveButton = page.locator('[data-testid="edit-save-button"]')
    this.cancelButton = page.locator('[data-testid="edit-cancel-button"]')
    this.editModeOverlay = page.locator('[data-testid="edit-mode-overlay"]')
  }

  /**
   * デモページを開く
   */
  async goto() {
    await this.page.goto(this.url)
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * プレビューモードが有効になっていることを確認
   */
  async waitForPreviewMode() {
    await this.page.waitForURL(/mode=preview/)
    await this.chatSidebar.waitFor({ state: 'visible' })
  }

  /**
   * プロバイダーを選択する
   * @param provider プロバイダー名 ('zai', 'openai', 'anthropic', 'google')
   */
  async selectProvider(provider: string): Promise<void> {
    const providerNames: Record<string, string> = {
      zai: 'ZAI',
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      google: 'Google'
    }

    const providerName = providerNames[provider]
    if (!providerName) {
      throw new Error(`Unknown provider: ${provider}`)
    }

    // チャットサイドバー内のプロバイダーボタンをクリック
    const providerButton = this.chatSidebar.locator(`button:has-text("${providerName}")`).first()
    await providerButton.click()

    // 選択状態になるまで待機
    await this.page.waitForTimeout(500)
  }

  /**
   * 編集可能な要素をクリックして選択する
   */
  async selectEditableElement(elementLocator?: Locator): Promise<void> {
    const target = elementLocator || this.editableParagraph
    await target.click()
    await this.elementInfoCard.waitFor({ state: 'visible' })
  }

  /**
   * メッセージを送信する
   * @param message メッセージ内容
   */
  async sendMessage(message: string): Promise<void> {
    await this.messageInput.fill(message)
    await this.sendButton.click()
  }

  /**
   * AI応答を待機する
   * @param timeout タイムアウト時間（ミリ秒）
   */
  async waitForAIResponse(timeout: number = 30000): Promise<void> {
    // アシスタントメッセージが表示されるまで待機
    await this.page.waitForSelector('div:has-text("AI") >> div', { timeout })
  }

  /**
   * メッセージ一覧から最新のアシスタントメッセージを取得
   */
  async getLastAssistantMessage(): Promise<string> {
    const messages = this.page.locator('[role="listitem"]').all()
    const count = await (await messages).length

    if (count === 0) {
      return ''
    }

    // 最後のメッセージを取得
    const lastMessage = this.page.locator('[role="listitem"]').last()
    const textContent = await lastMessage.textContent()
    return textContent || ''
  }

  /**
   * 要素の内容が変更されたことを確認
   * @param elementLocator 要素ロケーター
   * @param originalContent 元の内容
   */
  async verifyContentChanged(elementLocator: Locator, originalContent: string): Promise<boolean> {
    const newContent = await elementLocator.textContent()
    return newContent !== originalContent
  }

  /**
   * スクリーンショットを保存
   * @param name ファイル名
   */
  async saveScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true
    })
  }

  /**
   * ダブルクリック編集モードに入る
   * @param elementLocator 編集する要素（指定しない場合は最初の編集可能要素）
   */
  async enterEditMode(elementLocator?: Locator): Promise<void> {
    const target = elementLocator || this.editableElements.first()
    await target.dblclick()
    // 編集モードのUIが表示されるまで待機
    await this.editTextArea.waitFor({ state: 'visible', timeout: 5000 })
  }

  /**
   * 編集モードに入っていることを確認
   */
  async isEditModeActive(): Promise<boolean> {
    return await this.editTextArea.isVisible()
  }

  /**
   * テキストを編集する
   * @param newText 新しいテキスト
   */
  async editText(newText: string): Promise<void> {
    await this.editTextArea.fill(newText)
  }

  /**
   * 編集内容を保存する
   */
  async saveEdit(): Promise<void> {
    await this.saveButton.click()
    // 編集モードが終了するまで待機
    await this.editTextArea.waitFor({ state: 'hidden', timeout: 5000 })
  }

  /**
   * 編集をキャンセルする
   */
  async cancelEdit(): Promise<void> {
    await this.cancelButton.click()
    // 編集モードが終了するまで待機
    await this.editTextArea.waitFor({ state: 'hidden', timeout: 5000 })
  }

  /**
   * 要素の現在のテキストを取得
   * @param elementLocator 要素ロケーター
   */
  async getElementText(elementLocator?: Locator): Promise<string> {
    const target = elementLocator || this.editableElements.first()
    const text = await target.textContent()
    return text || ''
  }

  /**
   * 編集可能な要素の数を取得
   */
  async getEditableElementCount(): Promise<number> {
    return await this.editableElements.count()
  }

  /**
   * チャットサイドバーが開いていることを確認
   */
  async isChatSidebarOpen(): Promise<boolean> {
    return await this.chatSidebar.isVisible()
  }
}
