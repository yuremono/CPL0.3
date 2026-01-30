/**
 * Google AI Provider Implementation
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIProvider } from '../base-provider'
import type { AIEditRequest, AIEditResponse } from '@/lib/content-projection/types'
import { SYSTEM_PROMPT } from '../base-provider'
import {
  APIKeyMissingError,
  NetworkError,
  TimeoutError,
  InvalidResponseError,
  AuthenticationError,
  ContentPolicyError,
} from '../errors'

export class GoogleProvider implements AIProvider {
  readonly id = 'google'
  readonly name = 'Google AI'

  private readonly client: GoogleGenerativeAI | null

  constructor(apiKey: string) {
    this.client = apiKey ? new GoogleGenerativeAI(apiKey) : null
  }

  isAvailable(): boolean {
    return this.client !== null
  }

  async editContent(request: AIEditRequest): Promise<AIEditResponse> {
    if (!this.client) {
      throw new APIKeyMissingError('Google AI')
    }

    // 利用可能なモデル: gemini-2.5-flash（最も高速）
    const model = this.client.getGenerativeModel({
      model: 'models/gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object' as 'object',
          properties: {
            elementId: {
              type: 'string' as 'string',
              description: '対象の要素ID',
            },
            newContent: {
              type: 'string' as 'string',
              description: '編集後のコンテンツ',
            },
            reason: {
              type: 'string' as 'string',
              description: '変更理由の説明',
            },
            confidence: {
              type: 'number' as 'number',
              description: '確信度（0.0-1.0）',
            },
          },
          required: ['elementId', 'newContent'] as string[],
        } as any, // 型キャストでGoogleGenerativeAIの型定義を回避
        temperature: 0.7,
      },
    })

    const userPrompt = this.buildPrompt(request)

    try {
      const response = await model.generateContent(userPrompt)
      const content = response.response.text()

      return this.parseResponse(content)
    } catch (error) {
      console.error('Google AI API error:', error)

      // エラーメッセージの詳細をログに出力
      if (error instanceof Error) {
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }

      // Google API のエラーを分類
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()

        // 認証エラー
        if (errorMessage.includes('api key') || errorMessage.includes('authentication')) {
          throw new AuthenticationError('Google AI API key is invalid or missing')
        }

        // コンテンツポリシー違反
        if (errorMessage.includes('safety') || errorMessage.includes('policy')) {
          throw new ContentPolicyError('Content was rejected by Google safety filters')
        }

        // レート制限
        if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
          throw new TimeoutError('Google AI quota exceeded. Please try again later')
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

    prompt += '\n\n必ずJSON形式で回答してください。'

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
      console.error('Response content:', content)
      throw new Error('Invalid JSON response from AI')
    }
  }
}
