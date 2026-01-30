/**
 * API Health Check Tests
 * AIプロバイダーの健全性を監視するテスト
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createProvider, getAvailableProviders, getDefaultProvider } from '../index'
import { GoogleProvider } from '../providers/google'
import { ZAIProvider } from '../providers/zai'

describe('AI Provider Health Checks', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // 環境変数をリセット
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  describe('createProvider', () => {
    it('GoogleプロバイダーがAPIキーありで作成できる', () => {
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY = 'test-google-key'
      const provider = createProvider('google')

      expect(provider).toBeInstanceOf(GoogleProvider)
      expect(provider?.id).toBe('google')
      expect(provider?.isAvailable()).toBe(true)
    })

    it('ZAIプロバイダーがAPIキーありで作成できる', () => {
      process.env.NEXT_PUBLIC_ZAI_API_KEY = 'test-zai-key'
      const provider = createProvider('zai')

      expect(provider).toBeInstanceOf(ZAIProvider)
      expect(provider?.id).toBe('zai')
      expect(provider?.isAvailable()).toBe(true)
    })

    it('APIキーなしでnullを返す', () => {
      delete process.env.NEXT_PUBLIC_GOOGLE_API_KEY
      const provider = createProvider('google')

      expect(provider).toBeNull()
    })

    it('無効なプロバイダーIDでnullを返す', () => {
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY = 'test-key'
      const provider = createProvider('invalid-provider')

      expect(provider).toBeNull()
    })

    it('プロバイダーID省略時にデフォルトプロバイダーを返す', () => {
      process.env.NEXT_PUBLIC_ZAI_API_KEY = 'test-zai-key'
      const provider = createProvider()

      expect(provider).toBeInstanceOf(ZAIProvider)
      expect(provider?.id).toBe('zai')
    })
  })

  describe('getAvailableProviders', () => {
    it('利用可能なプロバイダーリストを返す', () => {
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY = 'google-key'
      process.env.NEXT_PUBLIC_ZAI_API_KEY = 'zai-key'
      delete process.env.NEXT_PUBLIC_OPENAI_API_KEY
      delete process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY

      const providers = getAvailableProviders()

      expect(providers).toHaveLength(2)
      expect(providers.map((p) => p.id)).toContain('google')
      expect(providers.map((p) => p.id)).toContain('zai')
    })

    it('APIキーが設定されていない場合は空配列を返す', () => {
      delete process.env.NEXT_PUBLIC_GOOGLE_API_KEY
      delete process.env.NEXT_PUBLIC_ZAI_API_KEY
      delete process.env.NEXT_PUBLIC_OPENAI_API_KEY
      delete process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY

      const providers = getAvailableProviders()

      expect(providers).toHaveLength(0)
    })

    it('すべてのプロバイダーが利用可能な場合は4つ返す', () => {
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY = 'google-key'
      process.env.NEXT_PUBLIC_ZAI_API_KEY = 'zai-key'
      process.env.NEXT_PUBLIC_OPENAI_API_KEY = 'openai-key'
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY = 'anthropic-key'

      const providers = getAvailableProviders()

      expect(providers).toHaveLength(4)
    })
  })

  describe('getDefaultProvider', () => {
    it('デフォルトプロバイダーを返す', () => {
      process.env.NEXT_PUBLIC_ZAI_API_KEY = 'test-zai-key'
      const provider = getDefaultProvider()

      expect(provider).toBeInstanceOf(ZAIProvider)
      expect(provider?.id).toBe('zai')
    })

    it('APIキーがない場合はnullを返す', () => {
      delete process.env.NEXT_PUBLIC_ZAI_API_KEY
      const provider = getDefaultProvider()

      expect(provider).toBeNull()
    })
  })

  describe('Provider Availability', () => {
    it('GoogleプロバイダーのisAvailableが正しく動作', () => {
      const providerWithKey = new GoogleProvider('test-key')
      const providerWithoutKey = new GoogleProvider('')

      expect(providerWithKey.isAvailable()).toBe(true)
      expect(providerWithoutKey.isAvailable()).toBe(false)
    })

    it('ZAIプロバイダーのisAvailableが正しく動作', () => {
      const providerWithKey = new ZAIProvider('test-key')
      const providerWithoutKey = new ZAIProvider('')

      expect(providerWithKey.isAvailable()).toBe(true)
      expect(providerWithoutKey.isAvailable()).toBe(false)
    })
  })

  describe('Environment Variable Validation', () => {
    it('Google APIキーが設定されているかチェック', () => {
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY = 'test-key'

      expect(process.env.NEXT_PUBLIC_GOOGLE_API_KEY).toBeDefined()
      expect(process.env.NEXT_PUBLIC_GOOGLE_API_KEY).toBeTruthy()
    })

    it('ZAI APIキーが設定されているかチェック', () => {
      process.env.NEXT_PUBLIC_ZAI_API_KEY = 'test-key'

      expect(process.env.NEXT_PUBLIC_ZAI_API_KEY).toBeDefined()
      expect(process.env.NEXT_PUBLIC_ZAI_API_KEY).toBeTruthy()
    })

    it('空文字列のAPIキーは無効', () => {
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY = ''

      const provider = createProvider('google')
      expect(provider).toBeNull()
    })
  })
})
