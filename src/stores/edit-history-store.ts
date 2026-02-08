/**
 * Edit History Store
 *
 * Undo/Redo機能を提供するZustandストア。
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { EditOperation, EditableElementType } from '@/lib/content-projection/types'
import { generateId } from '@/lib/content-projection/generate-id'
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
  addOperation: (operation: Omit<EditOperation, 'id' | 'timestamp' | 'description'>) => void
  undo: () => EditOperation | null
  redo: () => EditOperation | null
  canUndo: () => boolean
  canRedo: () => boolean
  clear: () => void

  // UI用セレクター（値を直接返す）
  canUndoValue: boolean
  canRedoValue: boolean
}

/**
 * 要素型の日本語名を取得
 */
const getElementTypeName = (type: EditableElementType): string => {
  const typeNames: Record<EditableElementType, string> = {
    text: 'テキスト',
    heading: '見出し',
    paragraph: '段落',
    link: 'リンク',
    image: '画像',
    button: 'ボタン',
    list: 'リスト',
    listitem: 'リスト項目',
  }
  return typeNames[type] || '要素'
}

/**
 * 操作の説明文を生成
 */
const generateDescription = (
  type: 'update' | 'insert' | 'delete',
  elementType: EditableElementType,
  newValue?: string
): string => {
  const elementName = getElementTypeName(elementType)

  if (type === 'update') {
    return `${elementName}を変更`
  }
  if (type === 'insert') {
    return `${elementName}を挿入`
  }
  if (type === 'delete') {
    return `${elementName}を削除`
  }

  return `${elementName}を編集`
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
      canUndoValue: false,
      canRedoValue: false,

      /**
       * 操作を追加
       *
       * 新しい操作が追加されると、future（Redo用）はクリアされる。
       * ID、タイムスタンプ、説明文は自動生成される。
       */
      addOperation: (operation) => {
        const { past, future } = get()

        // EditOperationを構築
        const fullOperation: EditOperation = {
          id: generateId('hist'),
          timestamp: Date.now(),
          description: generateDescription(operation.type, operation.elementType, operation.newValue),
          ...operation,
        }

        // 履歴が最大サイズを超える場合は古いものを削除
        const newPast = [...past, fullOperation]
        if (newPast.length > MAX_HISTORY_SIZE) {
          newPast.shift()
        }

        set({
          past: newPast,
          future: [], // 新しい操作でredoをクリア
          canUndoValue: newPast.length > 0,
          canRedoValue: false,
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
        const newPast = past.slice(0, -1)
        const newFuture = [lastOperation, ...future]

        set({
          past: newPast,
          future: newFuture,
          canUndoValue: newPast.length > 0,
          canRedoValue: newFuture.length > 0,
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
        const newPast = [...past, nextOperation]
        const newFuture = future.slice(1)

        set({
          past: newPast,
          future: newFuture,
          canUndoValue: newPast.length > 0,
          canRedoValue: newFuture.length > 0,
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
          canUndoValue: false,
          canRedoValue: false,
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
 * Undoが可能かどうか（メソッド）
 */
export const useCanUndo = () => useEditHistoryStore((state) => state.canUndo())

/**
 * Redoが可能かどうか（メソッド）
 */
export const useCanRedo = () => useEditHistoryStore((state) => state.canRedo())

/**
 * UI用: Undoが可能かどうか（値）
 */
export const useCanUndoValue = () => useEditHistoryStore((state) => state.canUndoValue)

/**
 * UI用: Redoが可能かどうか（値）
 */
export const useCanRedoValue = () => useEditHistoryStore((state) => state.canRedoValue)
