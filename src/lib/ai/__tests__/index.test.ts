/**
 * AI Provider Factory Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createProvider, getAvailableProviders } from '../index'

describe('AI Provider Factory', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // テスト前に環境変数をリセット
    vi.resetModules()
  })

  afterEach(() => {
    // テスト後に環境変数を復元
    process.env = originalEnv
  })

  describe('createProvider', () => {
    it('should return null for unknown provider', () => {
      const provider = createProvider('unknown')
      expect(provider).toBeNull()
    })

    it('should return null when API key is missing', () => {
      // 環境変数を削除
      delete process.env.NEXT_PUBLIC_OPENAI_API_KEY
      delete process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
      delete process.env.NEXT_PUBLIC_GOOGLE_API_KEY

      expect(createProvider('openai')).toBeNull()
      expect(createProvider('anthropic')).toBeNull()
      expect(createProvider('google')).toBeNull()
    })

    it('should return OpenAI provider when API key exists', () => {
      process.env.NEXT_PUBLIC_OPENAI_API_KEY = 'sk-test-key'
      const provider = createProvider('openai')
      expect(provider).not.toBeNull()
      expect(provider?.id).toBe('openai')
    })

    it('should return Anthropic provider when API key exists', () => {
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY = 'sk-ant-test-key'
      const provider = createProvider('anthropic')
      expect(provider).not.toBeNull()
      expect(provider?.id).toBe('anthropic')
    })

    it('should return Google provider when API key exists', () => {
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY = 'test-key'
      const provider = createProvider('google')
      expect(provider).not.toBeNull()
      expect(provider?.id).toBe('google')
    })

    it('should default to Anthropic when no provider specified', () => {
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY = 'sk-ant-test-key'
      const provider = createProvider()
      expect(provider).not.toBeNull()
      expect(provider?.id).toBe('anthropic')
    })
  })

  describe('getAvailableProviders', () => {
    it('should return empty array when no API keys are set', () => {
      delete process.env.NEXT_PUBLIC_OPENAI_API_KEY
      delete process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
      delete process.env.NEXT_PUBLIC_GOOGLE_API_KEY

      const providers = getAvailableProviders()
      expect(providers).toEqual([])
    })

    it('should return only providers with API keys', () => {
      process.env.NEXT_PUBLIC_OPENAI_API_KEY = 'sk-test-key'
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY = 'sk-ant-test-key'
      // Google key is not set

      const providers = getAvailableProviders()
      expect(providers).toHaveLength(2)
      expect(providers.map((p) => p.id)).toContain('openai')
      expect(providers.map((p) => p.id)).toContain('anthropic')
      expect(providers.map((p) => p.id)).not.toContain('google')
    })
  })
})
