/**
 * AI Provider Factory
 */

import type { AIProvider } from './BaseProvider'
import { OpenAIProvider } from './providers/openai'
import { AnthropicProvider } from './providers/anthropic'
import { GoogleProvider } from './providers/google'
import { ZAIProvider } from './providers/zai'

// 環境変数名のマッピング
const API_KEY_NAMES = {
  openai: 'NEXT_PUBLIC_OPENAI_API_KEY',
  anthropic: 'NEXT_PUBLIC_ANTHROPIC_API_KEY',
  google: 'NEXT_PUBLIC_GOOGLE_API_KEY',
  zai: 'NEXT_PUBLIC_ZAI_API_KEY',
} as const

// デフォルトプロバイダー
const DEFAULT_PROVIDER = 'zai'

/**
 * プロバイダーを作成する
 * @param providerId プロバイダーID（省略時はデフォルト）
 * @returns AIプロバイダーインスタンス（利用可能でない場合はnull）
 */
export function createProvider(providerId?: string): AIProvider | null {
  const id = providerId || DEFAULT_PROVIDER
  const envName = API_KEY_NAMES[id as keyof typeof API_KEY_NAMES]

  if (!envName) {
    console.warn(`Unknown provider: ${id}`)
    return null
  }

  const apiKey = process.env[envName]

  if (!apiKey) {
    console.warn(`${envName} is not set`)
    return null
  }

  switch (id) {
    case 'openai':
      return new OpenAIProvider(apiKey)
    case 'anthropic':
      return new AnthropicProvider(apiKey)
    case 'google':
      return new GoogleProvider(apiKey)
    case 'zai':
      return new ZAIProvider(apiKey)
    default:
      console.warn(`Unknown provider: ${id}`)
      return null
  }
}

/**
 * 利用可能なプロバイダーのリストを取得する
 * @returns 利用可能なAIプロバイダーの配列
 */
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = []

  for (const [id, envName] of Object.entries(API_KEY_NAMES)) {
    const apiKey = process.env[envName]
    if (apiKey) {
      const provider = createProvider(id)
      if (provider) {
        providers.push(provider)
      }
    }
  }

  return providers
}

/**
 * デフォルトプロバイダーを取得する
 * @returns デフォルトのAIプロバイダー（利用可能でない場合はnull）
 */
export function getDefaultProvider(): AIProvider | null {
  return createProvider(DEFAULT_PROVIDER)
}

// 型をエクスポート
export type { AIProvider } from './BaseProvider'
export { SYSTEM_PROMPT } from './BaseProvider'
export type { A11yElementInfo, AIEditRequest, AIEditResponse } from '@/lib/content-projection/types'
