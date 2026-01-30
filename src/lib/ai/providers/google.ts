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

    // 画像要素の場合、画像URLを生成
    const isImageRequest = selectedElement.role === 'image' ||
      userIntent.includes('イラスト') ||
      userIntent.includes('画像') ||
      userIntent.includes('絵') ||
      userIntent.includes('illustration') ||
      userIntent.includes('image')

    if (isImageRequest) {
      // 画像生成用プロンプト（文字列結合を使用）
      const seed = Math.random().toString(36).substring(2, 9)

      let prompt = '画像生成リクエスト\n\n'
      prompt += `要素ID: ${selectedElement.id}\n`
      prompt += `役割: ${selectedElement.role}\n`
      prompt += `説明: ${selectedElement.label || selectedElement.content}\n\n`
      prompt += `ユーザーの意図: ${userIntent}\n\n`
      prompt += `指示:\n`
      prompt += `あなたは画像URL生成アシスタントです。以下の手順で回答してください：\n\n`
      prompt += `1. ユーザーの意図を解析して、適切な画像生成プロンプト（英語）を作成\n`
      prompt += `2. Pollinations.aiの画像URL形式で回答\n\n`
      prompt += `画像URL形式:\n`
      prompt += `https://image.pollinations.ai/prompt/{プロンプト}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true\n\n`
      prompt += `例:\n`
      prompt += `ユーザー: "犬のイラスト" → https://image.pollinations.ai/prompt/cute%20dog%20illustration\n`
      prompt += `ユーザー: "海の写真" → https://image.pollinations.ai/prompt/ocean%20landscape%20photography\n\n`
      prompt += `重要:\n`
      prompt += `- プロンプトは英語に変換してください\n`
      prompt += `- URLのみを回答してください\n`
      prompt += `- 必ずJSON形式で回答してください\n\n`
      prompt += `回答形式: {"elementId": "...", "newContent": "https://image.pollinations.ai/prompt/..."}`

      return prompt
    }

    // テキスト要素の編集（既存のロジック）
    let prompt = '# 編集対象\n\n'
    prompt += `要素ID: ${selectedElement.id}\n`
    prompt += `役割: ${selectedElement.role}\n`
    prompt += `現在のコンテンツ: ${selectedElement.content}`

    if (selectedElement.label) {
      prompt += `\nラベル: ${selectedElement.label}`
    }

    if (selectedElement.level) {
      prompt += `\nレベル: ${selectedElement.level}`
    }

    if (selectedElement.context) {
      prompt += '\n\n# コンテキスト\n'
      if (selectedElement.context.section) {
        prompt += `\nセクション: ${selectedElement.context.section}`
      }
      if (selectedElement.context.position) {
        prompt += `\n位置: ${selectedElement.context.position}`
      }
    }

    prompt += `\n\n# ユーザーの意図\n${userIntent}`

    if (pageContext) {
      prompt += '\n\n# ページコンテキスト\n'
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
