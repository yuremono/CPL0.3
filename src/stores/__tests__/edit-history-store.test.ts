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

const createMockOperation = (id: string, content: string): EditOperation => ({
  elementId: id,
  type: 'update',
  oldValue: '古いコンテンツ',
  newValue: content,
  timestamp: Date.now(),
})

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
  })

  describe('addOperation', () => {
    it('操作を追加できる', () => {
      const { result } = renderHook(() => usePastOperations())

      act(() => {
        useEditHistoryStore.getState().addOperation(
          createMockOperation('test-id', '新しいコンテンツ')
        )
      })

      expect(result.current).toHaveLength(1)
      expect(result.current[0]).toMatchObject({
        elementId: 'test-id',
        type: 'update',
        newValue: '新しいコンテンツ',
      })
    })

    it('複数の操作を追加できる', () => {
      const { result } = renderHook(() => usePastOperations())

      act(() => {
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-1', 'コンテンツ1'))
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-2', 'コンテンツ2'))
      })

      expect(result.current).toHaveLength(2)
    })

    it('新しい操作を追加するとRedo用の履歴がクリアされる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())

      act(() => {
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-1', 'コンテンツ1'))
      })

      act(() => {
        useEditHistoryStore.getState().undo()
      })

      expect(futureHook.result.current).toHaveLength(1)

      act(() => {
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-2', 'コンテンツ2'))
      })

      expect(futureHook.result.current).toHaveLength(0)
    })
  })

  describe('undo', () => {
    it('最後の操作を元に戻せる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())
      const operation = createMockOperation('test-id', '新しいコンテンツ')

      act(() => {
        useEditHistoryStore.getState().addOperation(operation)
      })

      expect(pastHook.result.current).toHaveLength(1)
      expect(futureHook.result.current).toHaveLength(0)

      act(() => {
        useEditHistoryStore.getState().undo()
      })

      expect(pastHook.result.current).toHaveLength(0)
      expect(futureHook.result.current).toHaveLength(1)
      expect(futureHook.result.current[0]).toEqual(operation)
    })

    it('操作がない場合はnullを返す', () => {
      const result = useEditHistoryStore.getState().undo()
      expect(result).toBeNull()
    })

    it('複数回Undoできる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())

      act(() => {
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-1', 'コンテンツ1'))
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-2', 'コンテンツ2'))
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-3', 'コンテンツ3'))
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
  })

  describe('redo', () => {
    it('元に戻した操作をやり直せる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())
      const operation = createMockOperation('test-id', '新しいコンテンツ')

      act(() => {
        useEditHistoryStore.getState().addOperation(operation)
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
      expect(pastHook.result.current[0]).toEqual(operation)
    })

    it('操作がない場合はnullを返す', () => {
      const result = useEditHistoryStore.getState().redo()
      expect(result).toBeNull()
    })

    it('複数回Redoできる', () => {
      const pastHook = renderHook(() => usePastOperations())
      const futureHook = renderHook(() => useFutureOperations())

      act(() => {
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-1', 'コンテンツ1'))
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-2', 'コンテンツ2'))
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-3', 'コンテンツ3'))
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
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id', 'コンテンツ'))
      })

      expect(result.current).toBe(true)
    })

    it('Undo後にRedoができる', () => {
      const canUndoHook = renderHook(() => useCanUndo())
      const canRedoHook = renderHook(() => useCanRedo())

      expect(canUndoHook.result.current).toBe(false)
      expect(canRedoHook.result.current).toBe(false)

      act(() => {
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id', 'コンテンツ'))
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
          useEditHistoryStore.getState().addOperation(
            createMockOperation(`test-id-${i}`, `コンテンツ${i}`)
          )
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
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-1', 'コンテンツ1'))
        useEditHistoryStore.getState().addOperation(createMockOperation('test-id-2', 'コンテンツ2'))
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
  })
})
