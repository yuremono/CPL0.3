/**
 * ZAI Provider Implementation
 *
 * ZAI Coding Plan APIを使用したプロバイダー
 * ドキュメント: https://docs.z.ai/guides/overview/quick-start
 */

import OpenAI from 'openai'
import type { AIProvider } from '../BaseProvider'
import type { AIEditRequest, AIEditResponse } from '@/lib/content-projection/types'
import { SYSTEM_PROMPT } from '../BaseProvider'
import {
  APIKeyMissingError,
  NetworkError,
  TimeoutError,
  InvalidResponseError,
  AuthenticationError,
} from '../errors'

export class ZAIProvider implements AIProvider {
  readonly id = 'zai'
  readonly name = 'ZAI'

  private readonly client: OpenAI | null

  constructor(apiKey: string) {
    // テスト環境（Vitest）では dangerouslyAllowBrowser を有効にする
    const isTestEnvironment = process.env.VITEST === 'true' || process.env.CI === 'true'

    this.client = apiKey
      ? new OpenAI({
          apiKey,
          baseURL: 'https://api.z.ai/api/coding/paas/v4',
          dangerouslyAllowBrowser: isTestEnvironment,
        })
      : null
  }

  isAvailable(): boolean {
    return this.client !== null
  }

  async editContent(request: AIEditRequest): Promise<AIEditResponse> {
    if (!this.client) {
      throw new APIKeyMissingError('ZAI')
    }

    const userPrompt = this.buildPrompt(request)

    try {
      const response = await this.client.chat.completions.create({
        model: 'glm-4.7',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response content from ZAI')
      }

      return this.parseResponse(content)
    } catch (error) {
      console.error('ZAI API error:', error)

      // エラーメッセージの詳細をログに出力
      if (error instanceof Error) {
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
      }

      // ZAI API のエラーを分類
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()

        // 認証エラー
        if (errorMessage.includes('api key') || errorMessage.includes('authentication') || errorMessage.includes('unauthorized')) {
          throw new AuthenticationError('ZAI API key is invalid or missing')
        }

        // レート制限
        if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
          throw new TimeoutError('ZAI rate limit exceeded. Please try again later')
        }

        // タイムアウト
        if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
          throw new TimeoutError('ZAI request timed out')
        }
      }

      // ネットワークエラー
      throw new NetworkError(
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
