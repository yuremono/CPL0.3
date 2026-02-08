'use client'

import { useShowEditLayer, useToggleEditLayer } from '@/stores/preview-store'

/**
 * EditLayerToggle コンポーネント
 *
 * 編集レイヤー（枠・ハイライト等）の表示/非表示をトグルするボタン。
 * URLに依存せず、純粋なUI状態として動作します。
 */
export function EditLayerToggle() {
  const showEditLayer = useShowEditLayer()
  const toggleEditLayer = useToggleEditLayer()

  return (
    <button
      type="button"
      onClick={toggleEditLayer}
      className={`px-4 py-2 text-sm font-semibold border-2 border-black transition-colors ${
        showEditLayer
          ? 'bg-accent text-white'
          : 'bg-white text-black hover:bg-gray-50'
      }`}
      aria-pressed={showEditLayer}
      aria-label={showEditLayer ? '編集レイヤーを非表示' : '編集レイヤーを表示'}
    >
      {showEditLayer ? '編集レイヤー ON' : '編集レイヤー OFF'}
    </button>
  )
}
