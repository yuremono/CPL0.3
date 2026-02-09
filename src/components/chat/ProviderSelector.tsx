/**
 * Provider Selector Component
 *
 * AIプロバイダーを選択するコンポーネント
 */

'use client'

import { PROVIDER_INFO, type AIProvider, useSelectedProvider, useChatStore } from '@/stores/chat-store'
import { cn } from '@/lib/utils'

interface ProviderSelectorProps {
  disabled?: boolean
}

/**
 * プロバイダー選択コンポーネント
 */
export function ProviderSelector({ disabled = false }: ProviderSelectorProps) {
  const selectedProvider = useSelectedProvider()
  const setProvider = useChatStore((state) => state.setProvider)

  return (
    <div className="px-4 py-3 bg-white border-b-2 border-black">
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(PROVIDER_INFO) as AIProvider[])
          .map((provider) => ({ provider, info: PROVIDER_INFO[provider] }))
          .filter(({ info }) => info != null)
          .map(({ provider, info }) => {
          const isSelected = provider === selectedProvider

          return (
            <button
              key={provider}
              type="button"
              disabled={disabled}
              onClick={() => setProvider(provider)}
              className={cn(
                'px-3 py-2 text-sm font-medium border-2 border-black transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isSelected
                  ? 'bg-accent text-white'
                  : 'bg-white text-black hover:bg-gray-50'
              )}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-semibold">{info!.name}</span>
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <span>{info!.model}</span>
                  {/* 速度ラベルは非表示
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-xs font-medium',
                      info.speed === 'fast'
                        ? 'bg-green-100 text-green-800'
                        : info.speed === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    )}
                  >
                    {info.speed === 'fast' ? '高速' : info.speed === 'medium' ? '中速' : '低速'}
                  </span>
                  */}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
