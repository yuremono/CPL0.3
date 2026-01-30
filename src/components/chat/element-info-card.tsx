/**
 * Element Info Card Component
 *
 * 選択中の要素情報を表示するカードコンポーネント。
 */

import type { A11yElementInfo } from '@/lib/content-projection/types'
import { XMarkIcon } from '@heroicons/react/24/outline'

export interface ElementInfoCardProps {
  element: A11yElementInfo
  onDeselect?: () => void
}

export function ElementInfoCard({ element, onDeselect }: ElementInfoCardProps) {
  // 要素の型を日本語に変換
  const typeLabel = getTypeLabel(element.role)

  return (
    <div className="p-4 border-b-2 border-black bg-gray-50">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-sm">選択中の要素</h3>
        {onDeselect && (
          <button
            type="button"
            onClick={onDeselect}
            className="p-1 hover:bg-black hover:text-white transition-colors"
            aria-label="選択を解除"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      <dl className="space-y-2 text-sm">
        {/* 要素の型 */}
        <div className="flex">
          <dt className="font-semibold min-w-[80px]">種類:</dt>
          <dd className="flex-1">
            <span className="inline-block px-2 py-1 bg-accent text-white text-xs font-semibold border-2 border-black">
              {typeLabel}
            </span>
          </dd>
        </div>

        {/* 要素ID */}
        <div className="flex">
          <dt className="font-semibold min-w-[80px]">ID:</dt>
          <dd className="flex-1 font-mono text-xs text-gray-600 truncate">
            {element.id}
          </dd>
        </div>

        {/* ラベル */}
        {element.label && (
          <div className="flex">
            <dt className="font-semibold min-w-[80px]">ラベル:</dt>
            <dd className="flex-1">{element.label}</dd>
          </div>
        )}

        {/* レベル（見出しの場合） */}
        {element.level && (
          <div className="flex">
            <dt className="font-semibold min-w-[80px]">レベル:</dt>
            <dd className="flex-1">H{element.level}</dd>
          </div>
        )}

        {/* コンテンツプレビュー */}
        {element.content && (
          <div className="flex">
            <dt className="font-semibold min-w-[80px]">内容:</dt>
            <dd className="flex-1 text-gray-700 line-clamp-3">
              {element.content}
            </dd>
          </div>
        )}

        {/* コンテキスト情報 */}
        {element.context?.section && (
          <div className="flex">
            <dt className="font-semibold min-w-[80px]">セクション:</dt>
            <dd className="flex-1">{element.context.section}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}

/**
 * 要素の型を日本語のラベルに変換
 */
function getTypeLabel(role: string): string {
  const roleLabels: Record<string, string> = {
    heading: '見出し',
    text: 'テキスト',
    paragraph: '段落',
    link: 'リンク',
    image: '画像',
    button: 'ボタン',
    list: 'リスト',
    listitem: 'リスト項目',
  }

  return roleLabels[role] ?? role
}
