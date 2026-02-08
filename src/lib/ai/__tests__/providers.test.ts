/**
 * AI Provider Implementation Tests
 * モックを使用したテスト - 実際のAPI呼び出しは行わない
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OpenAIProvider } from '../providers/openai'
import { AnthropicProvider } from '../providers/anthropic'
import { GoogleProvider } from '../providers/google'
import { AIEditRequest } from '../base-provider'

describe('AI Providers', () => {
  const mockRequest: AIEditRequest = {
    selectedElement: {
      id: 'test-id',
      role: 'heading',
      content: 'Original Content',
      label: 'Main heading',
      editable: true
    },
    userIntent: 'make it more professional',
    pageContext: {
      tone: 'professional'
    }
  }

  describe('OpenAIProvider', () => {
    it('should have correct id and name', () => {
      const provider = new OpenAIProvider('test-api-key')
      expect(provider.id).toBe('openai')
      expect(provider.name).toBe('OpenAI')
    })

    it('should not be available without API key', () => {
      const provider = new OpenAIProvider('')
      expect(provider.isAvailable()).toBe(false)
    })

    it('should be available with API key', () => {
      const provider = new OpenAIProvider('sk-test-key')
      expect(provider.isAvailable()).toBe(true)
    })
  })

  describe('AnthropicProvider', () => {
    it('should have correct id and name', () => {
      const provider = new AnthropicProvider('test-api-key')
      expect(provider.id).toBe('anthropic')
      expect(provider.name).toBe('Anthropic')
    })

    it('should not be available without API key', () => {
      const provider = new AnthropicProvider('')
      expect(provider.isAvailable()).toBe(false)
    })

    it('should be available with API key', () => {
      const provider = new AnthropicProvider('sk-ant-test-key')
      expect(provider.isAvailable()).toBe(true)
    })
  })

  describe('GoogleProvider', () => {
    it('should have correct id and name', () => {
      const provider = new GoogleProvider('test-api-key')
      expect(provider.id).toBe('google')
      expect(provider.name).toBe('Google AI')
    })

    it('should not be available without API key', () => {
      const provider = new GoogleProvider('')
      expect(provider.isAvailable()).toBe(false)
    })

    it('should be available with API key', () => {
      const provider = new GoogleProvider('test-api-key')
      expect(provider.isAvailable()).toBe(true)
    })
  })
})
