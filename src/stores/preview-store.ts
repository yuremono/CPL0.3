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

  // 編集レイヤー表示フラグ（URLに依存しない純粋なUIトグル）
  showEditLayer: boolean

  // 選択中の要素
  selectedElement: A11yElementInfo | null

  // 編集中の要素ID
  editingElementId: string | null

  // 編集内容（elementId -> newContent）
  edits: Record<string, string>

  // アクション
  setMode: (mode: PreviewMode) => void
  toggleEditLayer: () => void
  setShowEditLayer: (show: boolean) => void
  selectElement: (element: A11yElementInfo | null) => void
  updateContent: (elementId: string, newContent: string) => void
  removeEdit: (elementId: string) => void
  reset: () => void
  startEditing: (elementId: string) => void
  stopEditing: () => void
}

/**
 * 初期状態
 *
 * NOTE: 常に編集モードで使用するため、初期値は 'edit' に固定
 */
const initialState: Omit<PreviewState, 'setMode' | 'toggleEditLayer' | 'setShowEditLayer' | 'selectElement' | 'updateContent' | 'removeEdit' | 'reset' | 'startEditing' | 'stopEditing'> = {
  mode: 'edit',
  showEditLayer: false,
  selectedElement: null,
  editingElementId: null,
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
       * 編集レイヤー表示をトグル
       */
      toggleEditLayer: () => {
        set((state) => ({ showEditLayer: !state.showEditLayer }))
      },

      /**
       * 編集レイヤー表示を設定
       */
      setShowEditLayer: (show: boolean) => {
        set({ showEditLayer: show })
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

      /**
       * 編集モードを開始
       */
      startEditing: (elementId: string) => {
        set({ editingElementId: elementId })
      },

      /**
       * 編集モードを終了
       */
      stopEditing: () => {
        set({ editingElementId: null })
      },
    }),
    {
      name: 'preview-storage',
      storage: createJSONStorage(() => createIndexedDBStorage()),
      // 選択中の要素も永続化（モード切り替え時に選択を保持）
      partialize: (state) => ({
        mode: state.mode,
        showEditLayer: state.showEditLayer,
        selectedElement: state.selectedElement,
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

/**
 * 編集レイヤー表示状態を取得
 */
export const useShowEditLayer = () => usePreviewStore((state) => state.showEditLayer)

/**
 * 編集レイヤートグルアクションを取得
 */
export const useToggleEditLayer = () => usePreviewStore((state) => state.toggleEditLayer)

/**
 * 編集中の要素IDを取得
 */
export const useEditingElementId = () => usePreviewStore((state) => state.editingElementId)

/**
 * 特定の要素が編集中かどうか
 */
export const useIsEditing = (elementId: string) =>
  usePreviewStore((state) => state.editingElementId === elementId)
