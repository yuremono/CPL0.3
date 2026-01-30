/**
 * AI Provider Tests
 * モックを使用したテスト - 実際のAPI呼び出しは行わない
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AIProvider, AIEditRequest, AIEditResponse } from '../base-provider'

// モックプロバイダーの作成
class MockProvider implements AIProvider {
  readonly id = 'mock'
  readonly name = 'Mock Provider'

  async editContent(request: AIEditRequest): Promise<AIEditResponse> {
    return {
      elementId: request.selectedElement.id,
      newContent: `Edited: ${request.userIntent}`,
      reason: 'Mock response',
      confidence: 1.0
    }
  }

  isAvailable(): boolean {
    return true
  }
}

describe('AIProvider', () => {
  describe('MockProvider', () => {
    it('should have correct id and name', () => {
      const provider = new MockProvider()
      expect(provider.id).toBe('mock')
      expect(provider.name).toBe('Mock Provider')
    })

    it('should return edit response with correct structure', async () => {
      const provider = new MockProvider()
      const request: AIEditRequest = {
        selectedElement: {
          id: 'test-id',
          role: 'heading',
          content: 'Original Content',
          editable: true
        },
        userIntent: 'make it more professional',
        pageContext: {
          tone: 'professional'
        }
      }

      const response = await provider.editContent(request)

      expect(response.elementId).toBe('test-id')
      expect(response.newContent).toContain('make it more professional')
      expect(response.reason).toBeDefined()
      expect(response.confidence).toBeGreaterThanOrEqual(0)
      expect(response.confidence).toBeLessThanOrEqual(1)
    })

    it('should be available', () => {
      const provider = new MockProvider()
      expect(provider.isAvailable()).toBe(true)
    })
  })
})
