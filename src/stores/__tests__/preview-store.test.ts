/**
 * Preview Store Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  usePreviewStore,
  usePreviewMode,
  useSelectedElement,
  useEdits,
  useEditContent,
  useIsPreviewMode,
  useIsEditMode,
  type PreviewState,
} from '../preview-store'
import type { A11yElementInfo } from '@/lib/content-projection/types'

// IndexedDBのモック
vi.mock('@/lib/storage/indexed-db', () => ({
  createIndexedDBStorage: () => ({
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
  }),
}))

const mockElement: A11yElementInfo = {
  id: 'test-element-1',
  role: 'heading',
  content: 'テスト見出し',
  level: 2,
  label: 'テスト',
  editable: true,
}

describe('PreviewStore', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    usePreviewStore.getState().reset()
  })

  describe('初期状態', () => {
    it('プレビューモードである', () => {
      const { result } = renderHook(() => usePreviewMode())
      expect(result.current).toBe('preview')
    })

    it('選択中の要素がない', () => {
      const { result } = renderHook(() => useSelectedElement())
      expect(result.current).toBeNull()
    })

    it('編集内容が空である', () => {
      const { result } = renderHook(() => useEdits())
      expect(result.current).toEqual({})
    })
  })

  describe('setMode', () => {
    it('モードを切り替えられる', () => {
      const { result } = renderHook(() => usePreviewMode())

      act(() => {
        usePreviewStore.getState().setMode('edit')
      })

      expect(result.current).toBe('edit')
    })
  })

  describe('selectElement', () => {
    it('要素を選択できる', () => {
      const { result } = renderHook(() => useSelectedElement())

      act(() => {
        usePreviewStore.getState().selectElement(mockElement)
      })

      expect(result.current).toEqual(mockElement)
    })

    it('選択を解除できる', () => {
      const { result } = renderHook(() => useSelectedElement())

      act(() => {
        usePreviewStore.getState().selectElement(mockElement)
      })

      expect(result.current).toEqual(mockElement)

      act(() => {
        usePreviewStore.getState().selectElement(null)
      })

      expect(result.current).toBeNull()
    })
  })

  describe('updateContent', () => {
    it('編集内容を保存できる', () => {
      const { result } = renderHook(() => useEdits())

      act(() => {
        usePreviewStore.getState().updateContent('test-id', '新しいコンテンツ')
      })

      expect(result.current).toEqual({
        'test-id': '新しいコンテンツ',
      })
    })

    it('複数の編集内容を保存できる', () => {
      const { result } = renderHook(() => useEdits())

      act(() => {
        usePreviewStore.getState().updateContent('test-id-1', 'コンテンツ1')
        usePreviewStore.getState().updateContent('test-id-2', 'コンテンツ2')
      })

      expect(result.current).toEqual({
        'test-id-1': 'コンテンツ1',
        'test-id-2': 'コンテンツ2',
      })
    })

    it('同じ要素IDで更新すると上書きされる', () => {
      const { result } = renderHook(() => useEdits())

      act(() => {
        usePreviewStore.getState().updateContent('test-id', '古いコンテンツ')
        usePreviewStore.getState().updateContent('test-id', '新しいコンテンツ')
      })

      expect(result.current).toEqual({
        'test-id': '新しいコンテンツ',
      })
    })
  })

  describe('removeEdit', () => {
    it('編集を削除できる', () => {
      const { result } = renderHook(() => useEdits())

      act(() => {
        usePreviewStore.getState().updateContent('test-id-1', 'コンテンツ1')
        usePreviewStore.getState().updateContent('test-id-2', 'コンテンツ2')
        usePreviewStore.getState().removeEdit('test-id-1')
      })

      expect(result.current).toEqual({
        'test-id-2': 'コンテンツ2',
      })
    })

    it('存在しない編集を削除してもエラーにならない', () => {
      const { result } = renderHook(() => useEdits())

      act(() => {
        usePreviewStore.getState().removeEdit('non-existent-id')
      })

      expect(result.current).toEqual({})
    })
  })

  describe('reset', () => {
    it('状態をリセットできる', () => {
      const modeHook = renderHook(() => usePreviewMode())
      const selectedHook = renderHook(() => useSelectedElement())
      const editsHook = renderHook(() => useEdits())

      act(() => {
        usePreviewStore.getState().setMode('edit')
        usePreviewStore.getState().selectElement(mockElement)
        usePreviewStore.getState().updateContent('test-id', 'コンテンツ')
      })

      expect(modeHook.result.current).toBe('edit')
      expect(selectedHook.result.current).toEqual(mockElement)
      expect(editsHook.result.current).toEqual({ 'test-id': 'コンテンツ' })

      act(() => {
        usePreviewStore.getState().reset()
      })

      expect(modeHook.result.current).toBe('preview')
      expect(selectedHook.result.current).toBeNull()
      expect(editsHook.result.current).toEqual({})
    })
  })

  describe('セレクターフック', () => {
    it('useEditContentで特定の要素の編集内容を取得できる', () => {
      const { result } = renderHook(() => useEditContent('test-id'))

      act(() => {
        usePreviewStore.getState().updateContent('test-id', 'テストコンテンツ')
      })

      expect(result.current).toBe('テストコンテンツ')
    })

    it('useEditContentで未編集の要素に対してundefinedを返す', () => {
      const { result } = renderHook(() => useEditContent('non-existent-id'))
      expect(result.current).toBeUndefined()
    })

    it('useIsPreviewModeでプレビューモードかどうかを判定できる', () => {
      const { result } = renderHook(() => useIsPreviewMode())
      expect(result.current).toBe(true)

      act(() => {
        usePreviewStore.getState().setMode('edit')
      })

      expect(result.current).toBe(false)
    })

    it('useIsEditModeで編集モードかどうかを判定できる', () => {
      const { result } = renderHook(() => useIsEditMode())
      expect(result.current).toBe(false)

      act(() => {
        usePreviewStore.getState().setMode('edit')
      })

      expect(result.current).toBe(true)
    })
  })
})
