/**
 * Edit History Panel Component
 *
 * 編集履歴を表示し、Undo/Redoを可能にするパネルコンポーネント。
 */

import { useEditHistoryStore } from '@/stores/edit-history-store'
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline'
import type { EditOperation } from '@/lib/content-projection/types'

export function EditHistoryPanel() {
  const past = useEditHistoryStore((state) => state.past)
  const future = useEditHistoryStore((state) => state.future)
  const canUndo = useEditHistoryStore((state) => state.canUndo())
  const canRedo = useEditHistoryStore((state) => state.canRedo())
  const undo = useEditHistoryStore((state) => state.undo)
  const redo = useEditHistoryStore((state) => state.redo)
  const clear = useEditHistoryStore((state) => state.clear)

  // 履歴が空の場合は表示しない
  if (past.length === 0 && future.length === 0) {
    return null
  }

  /**
   * タイムスタンプをフォーマット
   */
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  }

  /**
   * 履歴エントリーの説明を生成
   */
  const getDescription = (entry: EditOperation) => {
    if (entry.type === 'update') {
      if (entry.oldValue && entry.newValue) {
        const oldValuePreview =
          entry.oldValue.length > 20 ? entry.oldValue.substring(0, 20) + '...' : entry.oldValue
        const newValuePreview =
          entry.newValue.length > 20 ? entry.newValue.substring(0, 20) + '...' : entry.newValue
        return `"${oldValuePreview}" → "${newValuePreview}"`
      }
      return 'テキストを変更'
    }
    return '編集操作'
  }

  return (
    <div className="border-t-2 border-black">
      {/* ヘッダー */}
      <div className="p-4 bg-gray-50 border-b-2 border-black">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm">編集履歴</h3>
          <button
            onClick={() => clear()}
            className="text-xs underline hover:no-underline text-gray-600 hover:text-black"
            aria-label="履歴をクリア"
          >
            クリア
          </button>
        </div>
      </div>

      {/* 履歴リスト */}
      <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
        {/* 最新の履歴から表示 */}
        {past.length > 0 && (
          <>
            {[...past].reverse().map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className="p-2 bg-white border border-gray-200 rounded flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" title={getDescription(entry)}>
                    {getDescription(entry)}
                  </p>
                  <p className="text-xs text-gray-500">{formatTimestamp(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {/* 未来の履歴（Redo用） */}
        {future.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center mb-1">
              やり直し可能 ({future.length}件)
            </p>
            {future.map((entry, index) => (
              <div
                key={`${entry.timestamp}-future-${index}`}
                className="p-2 bg-gray-50 border border-gray-200 rounded flex items-center justify-between opacity-60"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" title={getDescription(entry)}>
                    {getDescription(entry)}
                  </p>
                  <p className="text-xs text-gray-500">{formatTimestamp(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Undo/Redoボタン（固定） */}
      <div className="p-2 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button
          onClick={() => undo()}
          disabled={!canUndo}
          className="flex-1 px-3 py-2 text-sm font-medium border-2 border-black bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          aria-label="元に戻す"
        >
          <ArrowUturnLeftIcon className="w-4 h-4" />
          Undo
        </button>
        <button
          onClick={() => redo()}
          disabled={!canRedo}
          className="flex-1 px-3 py-2 text-sm font-medium border-2 border-black bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          aria-label="やり直す"
        >
          Redo
          <ArrowUturnRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
