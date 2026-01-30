/**
 * Edit History Store Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useEditHistoryStore,
  usePastOperations,
  useFutureOperations,
  useCanUndo,
  useCanRedo,
  useCanUndoValue,
  useCanRedoValue,
} from '../edit-history-store'
import type { EditOperation } from '@/lib/content-projection/types'

// IndexedDBのモック
vi.mock('@/lib/storage/indexed-db', () => ({
  createIndexedDBStorage: () => ({
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
  }),
}))

const createMockOperation = (
  id: string,
  content: string,
  elementType: 'text' | 'heading' | 'paragraph' | 'link' | 'image' | 'button' | 'list' | 'listitem' = 'text'
): EditOperation => ({
  id: `hist_${id}`,
  elementId: id,
  elementType,
  type: 'update',
  oldValue: '古いコンテンツ',
  newValue: content,
  timestamp: Date.now(),
  description: elementType === 'heading' ? '見出しを変更' : 'テキストを変更',
})

const addOperation = (elementId: string, content: string, elementType?: 'text' | 'heading') => {
  useEditHistoryStore.getState().addOperation({
    elementId,
    elementType: elementType || 'text',
    type: 'update',
    oldValue: '古いコンテンツ',
    newValue: content,
  })
}

describe('EditHistoryStore', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    useEditHistoryStore.getState().clear()
  })

  describe('初期状態', () => {
    it('過去の操作が空である', () => {
      const { result } = renderHook(() => usePastOperations())
      expect(result.current).toEqual([])
    })

    it('未来の操作が空である', () => {
      const { result } = renderHook(() => useFutureOperations())
      expect(result.current).toEqual([])
    })

    it('Undoができない', () => {
      const { result } = renderHook(() => useCanUndo())
      expect(result.current).toBe(false)
    })

    it('Redoができない', () => {
      const { result } = renderHook(() => useCanRedo())
      expect(result.current).toBe(false)
    })

    it('UI用: Undoができない（値）', () => {
      const { result } = renderHook(() => useCanUndoValue())
      expect(result.current).toBe(false)
    })

    it('UI用: Redoができない（値）', () => {
      const { result } = renderHook(() => useCanRedoValue())
      expect(result.current).toBe(false)
    })
  })

  describe('addOperation', () => {
    it('操作を追加できる', () => {
      const { result } = renderHook(() => usePastOperations())

      act(() => {
        addOperation('test-id', '新しいコンテンツ')
      })

      expect(result.current).toHaveLength(1)
      const operation = result.current[0]
      expect(operation).toMatchObject({
        elementId: 'test-id',
        elementType: 'text',
        type: 'update',
        newValue: '新しいコンテンツ',
      })
      // 自動生成されるフィールドを確認
      expect(operation.id).toMatch(/^hist[a-zA-Z0-9]+$/)
      expect(operation.description).toBe('テキストを変更')
      expect(operation.timestamp).toBeLessThanOrEqual(Date.now())
    })

    it('複数の操作を追加できる', () => {
      const { result } = renderHook(() => usePastOperations())

      act(() => {
        addOperation('test-id-1', 'コンテンツ1')
        addOperation('test-id-2', 'コンテンツ2')
      })

      expect(result.current).toHaveLength(2)
    })

    it('見出しの操作を追加できる', () => {
      const { result } = renderHook(() => usePastOperations())

      act(() => {
        addOperation('heading-id', '新しい見出し', 'heading')
      })

      expect(result.current).toHaveLength(1)
      const operation = result.current[0]
      expect(operation.elementType).toBe('heading')
      expect(operation.description).toBe('見出しを変更')
    })

    it('新しい操作を追加するとRedo用の履歴がクリアされる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())

      act(() => {
        addOperation('test-id-1', 'コンテンツ1')
      })

      act(() => {
        useEditHistoryStore.getState().undo()
      })

      expect(futureHook.result.current).toHaveLength(1)

      act(() => {
        addOperation('test-id-2', 'コンテンツ2')
      })

      expect(futureHook.result.current).toHaveLength(0)
    })
  })

  describe('undo', () => {
    it('最後の操作を元に戻せる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())

      act(() => {
        addOperation('test-id', '新しいコンテンツ')
      })

      expect(pastHook.result.current).toHaveLength(1)
      expect(futureHook.result.current).toHaveLength(0)

      act(() => {
        useEditHistoryStore.getState().undo()
      })

      expect(pastHook.result.current).toHaveLength(0)
      expect(futureHook.result.current).toHaveLength(1)
    })

    it('操作がない場合はnullを返す', () => {
      const result = useEditHistoryStore.getState().undo()
      expect(result).toBeNull()
    })

    it('複数回Undoできる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())

      act(() => {
        addOperation('test-id-1', 'コンテンツ1')
        addOperation('test-id-2', 'コンテンツ2')
        addOperation('test-id-3', 'コンテンツ3')
      })

      expect(pastHook.result.current).toHaveLength(3)

      act(() => {
        useEditHistoryStore.getState().undo()
      })

      expect(pastHook.result.current).toHaveLength(2)
      expect(futureHook.result.current).toHaveLength(1)

      act(() => {
        useEditHistoryStore.getState().undo()
      })

      expect(pastHook.result.current).toHaveLength(1)
      expect(futureHook.result.current).toHaveLength(2)
    })

    it('Undo後にUI用セレクターが更新される', () => {
      const canUndoHook = renderHook(() => useCanUndoValue())
      const canRedoHook = renderHook(() => useCanRedoValue())

      expect(canUndoHook.result.current).toBe(false)
      expect(canRedoHook.result.current).toBe(false)

      act(() => {
        addOperation('test-id', 'コンテンツ')
      })

      expect(canUndoHook.result.current).toBe(true)
      expect(canRedoHook.result.current).toBe(false)

      act(() => {
        useEditHistoryStore.getState().undo()
      })

      expect(canUndoHook.result.current).toBe(false)
      expect(canRedoHook.result.current).toBe(true)
    })
  })

  describe('redo', () => {
    it('元に戻した操作をやり直せる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())

      act(() => {
        addOperation('test-id', '新しいコンテンツ')
      })

      act(() => {
        useEditHistoryStore.getState().undo()
      })

      expect(pastHook.result.current).toHaveLength(0)
      expect(futureHook.result.current).toHaveLength(1)

      act(() => {
        useEditHistoryStore.getState().redo()
      })

      expect(pastHook.result.current).toHaveLength(1)
      expect(futureHook.result.current).toHaveLength(0)
    })

    it('操作がない場合はnullを返す', () => {
      const result = useEditHistoryStore.getState().redo()
      expect(result).toBeNull()
    })

    it('複数回Redoできる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())

      act(() => {
        addOperation('test-id-1', 'コンテンツ1')
        addOperation('test-id-2', 'コンテンツ2')
        addOperation('test-id-3', 'コンテンツ3')
      })

      act(() => {
        useEditHistoryStore.getState().undo()
        useEditHistoryStore.getState().undo()
      })

      expect(pastHook.result.current).toHaveLength(1)
      expect(futureHook.result.current).toHaveLength(2)

      act(() => {
        useEditHistoryStore.getState().redo()
      })

      expect(pastHook.result.current).toHaveLength(2)
      expect(futureHook.result.current).toHaveLength(1)

      act(() => {
        useEditHistoryStore.getState().redo()
      })

      expect(pastHook.result.current).toHaveLength(3)
      expect(futureHook.result.current).toHaveLength(0)
    })
  })

  describe('canUndo / canRedo', () => {
    it('操作がある場合Undoができる', () => {
      const { result } = renderHook(() => useCanUndo())

      expect(result.current).toBe(false)

      act(() => {
        addOperation('test-id', 'コンテンツ')
      })

      expect(result.current).toBe(true)
    })

    it('Undo後にRedoができる', () => {
      const canUndoHook = renderHook(() => useCanUndo())
      const canRedoHook = renderHook(() => useCanRedo())

      expect(canUndoHook.result.current).toBe(false)
      expect(canRedoHook.result.current).toBe(false)

      act(() => {
        addOperation('test-id', 'コンテンツ')
      })

      expect(canUndoHook.result.current).toBe(true)
      expect(canRedoHook.result.current).toBe(false)

      act(() => {
        useEditHistoryStore.getState().undo()
      })

      expect(canUndoHook.result.current).toBe(false)
      expect(canRedoHook.result.current).toBe(true)
    })
  })

  describe('最大履歴保持数', () => {
    it('50件を超えると古い履歴が削除される', () => {
      const { result } = renderHook(() => usePastOperations())

      act(() => {
        // 51件の操作を追加
        for (let i = 0; i < 51; i++) {
          addOperation(`test-id-${i}`, `コンテンツ${i}`)
        }
      })

      // 最大50件に制限されている
      expect(result.current).toHaveLength(50)
      // 最後の50件が残っている（最初の1件が削除されている）
      expect(result.current[0].elementId).toBe('test-id-1')
      expect(result.current[49].elementId).toBe('test-id-50')
    })
  })

  describe('clear', () => {
    it('履歴をクリアできる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())
      const canUndoHook = renderHook(() => useCanUndo())
      const canRedoHook = renderHook(() => useCanRedo())

      act(() => {
        addOperation('test-id-1', 'コンテンツ1')
        addOperation('test-id-2', 'コンテンツ2')
        useEditHistoryStore.getState().undo()
      })

      expect(pastHook.result.current).toHaveLength(1)
      expect(futureHook.result.current).toHaveLength(1)
      expect(canUndoHook.result.current).toBe(true)
      expect(canRedoHook.result.current).toBe(true)

      act(() => {
        useEditHistoryStore.getState().clear()
      })

      expect(pastHook.result.current).toHaveLength(0)
      expect(futureHook.result.current).toHaveLength(0)
      expect(canUndoHook.result.current).toBe(false)
      expect(canRedoHook.result.current).toBe(false)
    })

    it('クリア時にUI用セレクターも更新される', () => {
      const canUndoHook = renderHook(() => useCanUndoValue())
      const canRedoHook = renderHook(() => useCanRedoValue())

      act(() => {
        addOperation('test-id', 'コンテンツ')
      })

      expect(canUndoHook.result.current).toBe(true)

      act(() => {
        useEditHistoryStore.getState().clear()
      })

      expect(canUndoHook.result.current).toBe(false)
      expect(canRedoHook.result.current).toBe(false)
    })
  })
})
