/**
 * Preview Mode Toggle Component
 *
 * プレビューモードと編集モードを切り替えるトグルボタン。
 */

'use client'

import { usePreviewStore } from '@/stores/preview-store'
import type { PreviewMode } from '@/lib/content-projection/types'
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline'

/**
 * モード選択肢
 */
const MODE_OPTIONS: Array<{
  value: PreviewMode
  label: string
  icon: React.ReactNode
}> = [
  {
    value: 'preview',
    label: 'プレビュー',
    icon: <EyeIcon className="w-5 h-5" />,
  },
  {
    value: 'edit',
    label: '編集モード',
    icon: <PencilIcon className="w-5 h-5" />,
  },
]

/**
 * プレビューモードのトグルボタン
 */
export function PreviewModeToggle() {
  const mode = usePreviewStore((state) => state.mode)
  const setMode = usePreviewStore((state) => state.setMode)

  // モード変更ハンドラー（ストアのみ更新）
  const handleModeChange = (newMode: PreviewMode) => {
    setMode(newMode)
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className="flex items-center gap-1 p-1 bg-white border-2 border-black shadow-[4px_4px_0_0_#0A0A0A] rounded-lg"
        role="radiogroup"
        aria-label="表示モード"
      >
        {MODE_OPTIONS.map((option) => {
          const isActive = mode === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleModeChange(option.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm
                transition-all duration-150
                ${
                  isActive
                    ? 'bg-accent text-white shadow-[2px_2px_0_0_#0A0A0A]'
                    : 'hover:bg-gray-100'
                }
              `}
              role="radio"
              aria-checked={isActive}
              aria-label={option.label}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
