/**
 * Anthropic Provider Implementation
 */

import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider } from '../base-provider'
import type { AIEditRequest, AIEditResponse } from '@/lib/content-projection/types'
import { SYSTEM_PROMPT } from '../base-provider'

export class AnthropicProvider implements AIProvider {
  readonly id = 'anthropic'
  readonly name = 'Anthropic'

  private readonly client: Anthropic | null

  constructor(apiKey: string) {
    // テスト環境（Vitest）では dangerouslyAllowBrowser を有効にする
    const isTestEnvironment = process.env.VITEST === 'true' || process.env.CI === 'true'

    this.client = apiKey
      ? new Anthropic({
          apiKey,
          dangerouslyAllowBrowser: isTestEnvironment
        })
      : null
  }

  isAvailable(): boolean {
    return this.client !== null
  }

  async editContent(request: AIEditRequest): Promise<AIEditResponse> {
    if (!this.client) {
      throw new Error('Anthropic client is not initialized. API key is missing.')
    }

    const userPrompt = this.buildPrompt(request)

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })

      const contentBlock = response.content[0]
      if (contentBlock.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic')
      }

      return this.parseResponse(contentBlock.text)
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw new Error(
        `Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  private buildPrompt(request: AIEditRequest): string {
    const { selectedElement, userIntent, pageContext } = request

    let prompt = `# 編集対象

要素ID: ${selectedElement.id}
役割: ${selectedElement.role}
現在のコンテンツ: ${selectedElement.content}`

    if (selectedElement.label) {
      prompt += `\nラベル: ${selectedElement.label}`
    }

    if (selectedElement.level) {
      prompt += `\nレベル: ${selectedElement.level}`
    }

    if (selectedElement.context) {
      prompt += `\n\n# コンテキスト`
      if (selectedElement.context.section) {
        prompt += `\nセクション: ${selectedElement.context.section}`
      }
      if (selectedElement.context.position) {
        prompt += `\n位置: ${selectedElement.context.position}`
      }
    }

    prompt += `\n\n# ユーザーの意図\n${userIntent}`

    if (pageContext) {
      prompt += `\n\n# ページコンテキスト`
      if (pageContext.pageType) {
        prompt += `\nページタイプ: ${pageContext.pageType}`
      }
      if (pageContext.targetAudience) {
        prompt += `\nターゲットオーディエンス: ${pageContext.targetAudience}`
      }
      if (pageContext.tone) {
        prompt += `\nトーン: ${pageContext.tone}`
      }
    }

    return prompt
  }

  private parseResponse(content: string): AIEditResponse {
    try {
      const parsed = JSON.parse(content)

      // レスポンスのバリデーション
      if (!parsed.elementId || typeof parsed.elementId !== 'string') {
        throw new Error('Invalid response: elementId is required')
      }
      if (!parsed.newContent || typeof parsed.newContent !== 'string') {
        throw new Error('Invalid response: newContent is required')
      }

      return {
        elementId: parsed.elementId,
        newContent: parsed.newContent,
        reason: parsed.reason,
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : undefined
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      throw new Error('Invalid JSON response from AI')
    }
  }
}
