/**
 * Google AI Provider Implementation
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIProvider } from '../base-provider'
import type { AIEditRequest, AIEditResponse } from '@/lib/content-projection/types'
import { SYSTEM_PROMPT } from '../base-provider'

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
      throw new Error('Google AI client is not initialized. API key is missing.')
    }

    const model = this.client.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const userPrompt = this.buildPrompt(request)
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`

    try {
      const response = await model.generateContent(fullPrompt)
      const content = response.response.text()
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const jsonContent = jsonMatch[1] || jsonMatch[0]
      return this.parseResponse(jsonContent)
    } catch (error) {
      console.error('Google AI API error:', error)
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
      throw new Error('Invalid JSON response from AI')
    }
  }
}
