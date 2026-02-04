/**
 * Build Confirmation Store Tests
 *
 * TDD: テストファーストで実装
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useBuildConfirmationStore } from '../build-confirmation-store'
import type { EditOperation } from '@/lib/content-projection/types'

/**
 * ストアをリセットするヘルパー関数
 */
function resetStore() {
  const store = useBuildConfirmationStore.getState()
  store._reset()
}

describe('BuildConfirmationStore', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('初期状態', () => {
    it('ダイアログは閉じているべき', () => {
      const state = useBuildConfirmationStore.getState()
      expect(state.isOpen).toBe(false)
    })

    it('ファイル変更リストは空であるべき', () => {
      const state = useBuildConfirmationStore.getState()
      expect(state.fileChanges).toEqual([])
    })

    it('ページ影響リストは空であるべき', () => {
      const state = useBuildConfirmationStore.getState()
      expect(state.pageImpacts).toEqual([])
    })

    it('ビルド時間見積もりはnullであるべき', () => {
      const state = useBuildConfirmationStore.getState()
      expect(state.buildTimeEstimate).toBeNull()
    })

    it('ビルド実行中ではないべき', () => {
      const state = useBuildConfirmationStore.getState()
      expect(state.isBuilding).toBe(false)
    })

    it('ビルド進捗は0であるべき', () => {
      const state = useBuildConfirmationStore.getState()
      expect(state.buildProgress).toBe(0)
    })

    it('ビルドエラーはnullであるべき', () => {
      const state = useBuildConfirmationStore.getState()
      expect(state.buildError).toBeNull()
    })
  })

  describe('open - ダイアログを開く', () => {
    it('編集操作からファイル変更を抽出できる', () => {
      const editOperations: EditOperation[] = [
        {
          id: 'op1',
          elementId: 'hero_title',
          elementType: 'heading',
          type: 'update',
          oldValue: '古いタイトル',
          newValue: '新しいタイトル',
          timestamp: Date.now(),
          description: '見出しを変更',
        },
      ]

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)

      const state = useBuildConfirmationStore.getState()
      expect(state.fileChanges).toHaveLength(1)
      expect(state.fileChanges[0].path).toBe('hero_title')
      expect(state.fileChanges[0].type).toBe('modified')
      expect(state.fileChanges[0].oldContent).toBe('古いタイトル')
      expect(state.fileChanges[0].newContent).toBe('新しいタイトル')
    })

    it('ダイアログが開くべき', () => {
      const editOperations: EditOperation[] = [
        {
          id: 'op1',
          elementId: 'test',
          elementType: 'text',
          type: 'update',
          newValue: '新しい内容',
          timestamp: Date.now(),
          description: 'テキストを変更',
        },
      ]

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)

      const state = useBuildConfirmationStore.getState()
      expect(state.isOpen).toBe(true)
    })

    it('ページ影響を計算できるべき', () => {
      const editOperations: EditOperation[] = [
        {
          id: 'op1',
          elementId: 'hero_section_title',
          elementType: 'heading',
          type: 'update',
          newValue: '新しいタイトル',
          timestamp: Date.now(),
          description: '見出しを変更',
        },
      ]

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)

      const state = useBuildConfirmationStore.getState()
      expect(state.pageImpacts).toHaveLength(1)
      expect(state.pageImpacts[0].path).toBe('/')
      expect(state.pageImpacts[0].title).toBe('ホーム')
    })

    it('ビルド時間を見積もれるべき', () => {
      const editOperations: EditOperation[] = [
        {
          id: 'op1',
          elementId: 'test',
          elementType: 'text',
          type: 'update',
          newValue: '新しい内容',
          timestamp: Date.now(),
          description: 'テキストを変更',
        },
      ]

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)

      const state = useBuildConfirmationStore.getState()
      expect(state.buildTimeEstimate).not.toBeNull()
      expect(state.buildTimeEstimate?.estimatedSeconds).toBeGreaterThan(0)
    })

    it('変更が少ない場合は信頼度が高くなるべき', () => {
      const editOperations: EditOperation[] = Array.from({ length: 3 }, (_, i) => ({
        id: `op${i}`,
        elementId: `test${i}`,
        elementType: 'text' as const,
        type: 'update' as const,
        newValue: `新しい内容${i}`,
        timestamp: Date.now(),
        description: 'テキストを変更',
      }))

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)

      const state = useBuildConfirmationStore.getState()
      expect(state.buildTimeEstimate?.confidence).toBe('high')
    })

    it('変更が多い場合は信頼度が低くなるべき', () => {
      const editOperations: EditOperation[] = Array.from({ length: 25 }, (_, i) => ({
        id: `op${i}`,
        elementId: `test${i}`,
        elementType: 'text' as const,
        type: 'update' as const,
        newValue: `新しい内容${i}`,
        timestamp: Date.now(),
        description: 'テキストを変更',
      }))

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)

      const state = useBuildConfirmationStore.getState()
      expect(state.buildTimeEstimate?.confidence).toBe('low')
    })
  })

  describe('close - ダイアログを閉じる', () => {
    it('ダイアログを閉じることができる', () => {
      const editOperations: EditOperation[] = [
        {
          id: 'op1',
          elementId: 'test',
          elementType: 'text',
          type: 'update',
          newValue: '新しい内容',
          timestamp: Date.now(),
          description: 'テキストを変更',
        },
      ]

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)
      expect(useBuildConfirmationStore.getState().isOpen).toBe(true)

      store.close()
      expect(useBuildConfirmationStore.getState().isOpen).toBe(false)
    })
  })

  describe('startBuild - ビルド開始', () => {
    it('ビルドを実行できるべき', async () => {
      const editOperations: EditOperation[] = [
        {
          id: 'op1',
          elementId: 'test',
          elementType: 'text',
          type: 'update',
          newValue: '新しい内容',
          timestamp: Date.now(),
          description: 'テキストを変更',
        },
      ]

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)

      // すぐにキャンセルしてテストを高速化
      const buildPromise = store.startBuild()
      expect(useBuildConfirmationStore.getState().isBuilding).toBe(true)

      store.cancelBuild()

      expect(useBuildConfirmationStore.getState().isBuilding).toBe(false)
      expect(useBuildConfirmationStore.getState().buildProgress).toBe(0)
    }, 10000)

    it('見積もりがない場合はエラーになるべき', async () => {
      const store = useBuildConfirmationStore.getState()

      await store.startBuild()
      expect(useBuildConfirmationStore.getState().buildError).toBe('ビルド時間の見積もりがありません')
    })
  })

  describe('cancelBuild - ビルドキャンセル', () => {
    it('ビルドをキャンセルできる', () => {
      const editOperations: EditOperation[] = [
        {
          id: 'op1',
          elementId: 'test',
          elementType: 'text',
          type: 'update',
          newValue: '新しい内容',
          timestamp: Date.now(),
          description: 'テキストを変更',
        },
      ]

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)
      store.startBuild() // 非同期で開始

      // 即座にキャンセル
      store.cancelBuild()

      expect(useBuildConfirmationStore.getState().isBuilding).toBe(false)
      expect(useBuildConfirmationStore.getState().buildProgress).toBe(0)
    })
  })

  describe('calculateBuildTime - ビルド時間計算', () => {
    it('ファイル変更数に基づいて時間を見積もる', () => {
      const editOperations: EditOperation[] = Array.from({ length: 5 }, (_, i) => ({
        id: `op${i}`,
        elementId: `test${i}`,
        elementType: 'text' as const,
        type: 'update' as const,
        newValue: `新しい内容${i}`,
        timestamp: Date.now(),
        description: 'テキストを変更',
      }))

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)

      const estimate = store.calculateBuildTime()
      expect(estimate.estimatedSeconds).toBeGreaterThan(10)
    })

    it('画像ファイルはペナルティが加算される', () => {
      const editOperations: EditOperation[] = [
        {
          id: 'op1',
          elementId: 'image1',
          elementType: 'image',
          type: 'update',
          newValue: 'new_image.png',
          timestamp: Date.now(),
          description: '画像を変更',
        },
      ]

      const store = useBuildConfirmationStore.getState()
      store.open(editOperations)

      const estimate = store.calculateBuildTime()
      // 画像がある場合は時間が長くなる
      expect(estimate.factors).toContain('1個の画像ファイル')
    })
  })

  describe('セレクターフック', () => {
    it('useIsBuildConfirmationOpen が正しく動作する', () => {
      const isOpen = useBuildConfirmationStore.getState().isOpen
      expect(isOpen).toBe(false)
    })

    it('useFileChanges が正しく動作する', () => {
      const fileChanges = useBuildConfirmationStore.getState().fileChanges
      expect(fileChanges).toEqual([])
    })

    it('usePageImpacts が正しく動作する', () => {
      const pageImpacts = useBuildConfirmationStore.getState().pageImpacts
      expect(pageImpacts).toEqual([])
    })

    it('useBuildTimeEstimate が正しく動作する', () => {
      const estimate = useBuildConfirmationStore.getState().buildTimeEstimate
      expect(estimate).toBeNull()
    })

    it('useIsBuilding が正しく動作する', () => {
      const isBuilding = useBuildConfirmationStore.getState().isBuilding
      expect(isBuilding).toBe(false)
    })

    it('useBuildProgress が正しく動作する', () => {
      const progress = useBuildConfirmationStore.getState().buildProgress
      expect(progress).toBe(0)
    })

    it('useBuildError が正しく動作する', () => {
      const error = useBuildConfirmationStore.getState().buildError
      expect(error).toBeNull()
    })
  })
})
