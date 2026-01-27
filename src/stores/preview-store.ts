/**
 * Preview Store
 *
 * プレビューモードと編集状態を管理するZustandストア。
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { A11yElementInfo } from '@/lib/content-projection/types'
import type { PreviewMode } from '@/lib/content-projection/types'
import { createIndexedDBStorage } from '@/lib/storage/indexed-db'

/**
 * 編集内容のマップ型
 * key: elementId, value: newContent
 */
export type EditContentMap = Map<string, string>

/**
 * ストアの状態
 */
export interface PreviewState {
  // プレビューモード
  mode: PreviewMode

  // 選択中の要素
  selectedElement: A11yElementInfo | null

  // 編集内容（elementId -> newContent）
  edits: Record<string, string>

  // アクション
  setMode: (mode: PreviewMode) => void
  selectElement: (element: A11yElementInfo | null) => void
  updateContent: (elementId: string, newContent: string) => void
  removeEdit: (elementId: string) => void
  reset: () => void
}

/**
 * 初期状態
 */
const initialState: Omit<PreviewState, 'setMode' | 'selectElement' | 'updateContent' | 'removeEdit' | 'reset'> = {
  mode: 'preview',
  selectedElement: null,
  edits: {},
}

/**
 * プレビューストア
 *
 * IndexedDBを使用して永続化される。
 */
export const usePreviewStore = create<PreviewState>()(
  persist(
    (set) => ({
      ...initialState,

      /**
       * プレビューモードを設定
       */
      setMode: (mode: PreviewMode) => {
        set({ mode })
      },

      /**
       * 要素を選択
       */
      selectElement: (element: A11yElementInfo | null) => {
        set({ selectedElement: element })
      },

      /**
       * コンテンツを更新
       */
      updateContent: (elementId: string, newContent: string) => {
        set((state) => ({
          edits: {
            ...state.edits,
            [elementId]: newContent,
          },
        }))
      },

      /**
       * 編集を削除
       */
      removeEdit: (elementId: string) => {
        set((state) => {
          const newEdits = { ...state.edits }
          delete newEdits[elementId]
          return { edits: newEdits }
        })
      },

      /**
       * 状態をリセット
       */
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'preview-storage',
      storage: createJSONStorage(() => createIndexedDBStorage()),
      // 選択中の要素は永続化しない（リロード時に選択状態はリセット）
      partialize: (state) => ({
        mode: state.mode,
        edits: state.edits,
      }),
    }
  )
)

/**
 * セレクターフック
 */

/**
 * プレビューモードを取得
 */
export const usePreviewMode = () => usePreviewStore((state) => state.mode)

/**
 * 選択中の要素を取得
 */
export const useSelectedElement = () => usePreviewStore((state) => state.selectedElement)

/**
 * 編集内容を取得
 */
export const useEdits = () => usePreviewStore((state) => state.edits)

/**
 * 特定の要素の編集内容を取得
 */
export const useEditContent = (elementId: string) =>
  usePreviewStore((state) => state.edits[elementId])

/**
 * プレビューモードかどうか
 */
export const useIsPreviewMode = () => usePreviewStore((state) => state.mode === 'preview')

/**
 * 編集モードかどうか
 */
export const useIsEditMode = () => usePreviewStore((state) => state.mode === 'edit')
