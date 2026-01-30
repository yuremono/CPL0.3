/**
 * Edit History Store
 *
 * Undo/Redo機能を提供するZustandストア。
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { EditOperation } from '@/lib/content-projection/types'
import { createIndexedDBStorage } from '@/lib/storage/indexed-db'

/**
 * 履歴の最大保持数
 */
const MAX_HISTORY_SIZE = 50

/**
 * ストアの状態
 */
interface EditHistoryState {
  // 過去の操作（Undo用）
  past: EditOperation[]

  // 未来の操作（Redo用）
  future: EditOperation[]

  // アクション
  addOperation: (operation: EditOperation) => void
  undo: () => EditOperation | null
  redo: () => EditOperation | null
  canUndo: () => boolean
  canRedo: () => boolean
  clear: () => void
}

/**
 * 編集履歴ストア
 *
 * IndexedDBを使用して永続化される。
 */
export const useEditHistoryStore = create<EditHistoryState>()(
  persist(
    (set, get) => ({
      past: [],
      future: [],

      /**
       * 操作を追加
       *
       * 新しい操作が追加されると、future（Redo用）はクリアされる。
       */
      addOperation: (operation: EditOperation) => {
        const { past, future } = get()

        // 履歴が最大サイズを超える場合は古いものを削除
        const newPast = [...past, operation]
        if (newPast.length > MAX_HISTORY_SIZE) {
          newPast.shift()
        }

        set({
          past: newPast,
          future: [], // 新しい操作でredoをクリア
        })
      },

      /**
       * Undo（元に戻す）
       *
       * 最後の操作をpastからfutureに移動する。
       */
      undo: () => {
        const { past, future } = get()

        if (past.length === 0) {
          return null
        }

        const lastOperation = past[past.length - 1]

        set({
          past: past.slice(0, -1),
          future: [lastOperation, ...future],
        })

        return lastOperation
      },

      /**
       * Redo（やり直す）
       *
       * 次の操作をfutureからpastに移動する。
       */
      redo: () => {
        const { past, future } = get()

        if (future.length === 0) {
          return null
        }

        const nextOperation = future[0]

        set({
          past: [...past, nextOperation],
          future: future.slice(1),
        })

        return nextOperation
      },

      /**
       * Undoが可能かどうか
       */
      canUndo: () => {
        return get().past.length > 0
      },

      /**
       * Redoが可能かどうか
       */
      canRedo: () => {
        return get().future.length > 0
      },

      /**
       * 履歴をクリア
       */
      clear: () => {
        set({
          past: [],
          future: [],
        })
      },
    }),
    {
      name: 'edit-history-storage',
      storage: createJSONStorage(() => createIndexedDBStorage()),
    }
  )
)

/**
 * セレクターフック
 */

/**
 * 過去の操作リストを取得
 */
export const usePastOperations = () => useEditHistoryStore((state) => state.past)

/**
 * 未来の操作リストを取得
 */
export const useFutureOperations = () => useEditHistoryStore((state) => state.future)

/**
 * Undoが可能かどうか
 */
export const useCanUndo = () => useEditHistoryStore((state) => state.canUndo())

/**
 * Redoが可能かどうか
 */
export const useCanRedo = () => useEditHistoryStore((state) => state.canRedo())
