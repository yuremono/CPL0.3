/**
 * Build Confirmation Store
 *
 * ビルド確認画面の状態を管理するZustandストア
 */

import { create } from 'zustand'
import type {
  BuildConfirmationState,
  BuildConfirmationActions,
  FileChange,
  PageImpact,
  BuildTimeEstimate,
} from '@/components/build-confirmation/types'
import type { EditOperation } from '@/lib/content-projection/types'

/**
 * ストアの状態（内部使用）
 */
interface InternalBuildConfirmationState extends BuildConfirmationState {
  // アクション
  open: (editOperations: EditOperation[]) => void
  close: () => void
  startBuild: () => Promise<void>
  cancelBuild: () => void
  calculateBuildTime: () => BuildTimeEstimate
  _reset: () => void
}

/**
 * 初期状態
 */
const initialState: BuildConfirmationState = {
  isOpen: false,
  fileChanges: [],
  pageImpacts: [],
  buildTimeEstimate: null,
  isBuilding: false,
  buildProgress: 0,
  buildError: null,
}

/**
 * 編集操作からファイル変更を抽出
 */
function extractFileChanges(editOperations: EditOperation[]): FileChange[] {
  const changesMap = new Map<string, FileChange>()

  editOperations.forEach((op) => {
    const key = op.elementId
    const existing = changesMap.get(key)

    if (existing) {
      existing.newContent = op.newValue
    } else {
      changesMap.set(key, {
        path: op.elementId,
        type: op.type === 'insert' ? 'created' : op.type === 'delete' ? 'deleted' : 'modified',
        oldContent: op.oldValue,
        newContent: op.newValue,
        isImage: op.elementType === 'image',
      })
    }
  })

  return Array.from(changesMap.values())
}

/**
 * 影響を受けるページを計算
 */
function calculatePageImpacts(fileChanges: FileChange[]): PageImpact[] {
  // Next.jsのページ構造に基づいて影響ページを推定
  const impactedPaths = new Set<string>()

  fileChanges.forEach((change) => {
    // メインページに影響
    if (change.path.includes('hero') || change.path.includes('section')) {
      impactedPaths.add('/')
    }
  })

  return Array.from(impactedPaths).map((path) => ({
    path,
    title: path === '/' ? 'ホーム' : path,
    affectedChanges: fileChanges.length,
  }))
}

/**
 * ビルド時間を見積もり
 */
function calculateBuildTime(fileChanges: FileChange[]): BuildTimeEstimate {
  const baseTime = 10 // ベースライン10秒
  const perChangeTime = 0.5 // 変更あたり0.5秒
  const imagePenalty = fileChanges.filter((c) => c.isImage).length * 2

  const estimatedSeconds = baseTime + fileChanges.length * perChangeTime + imagePenalty

  let confidence: 'high' | 'medium' | 'low' = 'medium'
  if (fileChanges.length < 5) {
    confidence = 'high'
  } else if (fileChanges.length > 20) {
    confidence = 'low'
  }

  const factors: string[] = [`${fileChanges.length}件の変更`]
  if (imagePenalty > 0) {
    factors.push(`${imagePenalty / 2}個の画像ファイル`)
  }

  return {
    estimatedSeconds: Math.ceil(estimatedSeconds),
    confidence,
    factors,
  }
}

/**
 * ビルド確認ストア
 */
export const useBuildConfirmationStore = create<InternalBuildConfirmationState>()((set, get) => ({
  ...initialState,

  /**
   * ビルド確認ダイアログを開く
   */
  open: (editOperations: EditOperation[]) => {
    const fileChanges = extractFileChanges(editOperations)
    const pageImpacts = calculatePageImpacts(fileChanges)
    const buildTimeEstimate = calculateBuildTime(fileChanges)

    set({
      isOpen: true,
      fileChanges,
      pageImpacts,
      buildTimeEstimate,
      buildProgress: 0,
      buildError: null,
    })
  },

  /**
   * ビルド確認ダイアログを閉じる
   */
  close: () => {
    set({ isOpen: false })
  },

  /**
   * ビルドを開始
   */
  startBuild: async () => {
    set({ isBuilding: true, buildProgress: 0, buildError: null })

    // ビルド進捗をシミュレート
    const estimate = get().buildTimeEstimate
    if (!estimate) {
      set({ isBuilding: false, buildError: 'ビルド時間の見積もりがありません' })
      return
    }

    const totalSteps = 100
    const stepTime = (estimate.estimatedSeconds * 1000) / totalSteps

    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepTime))
      set({ buildProgress: i })
    }

    set({ isBuilding: false, buildProgress: 100 })
  },

  /**
   * ビルドをキャンセル
   */
  cancelBuild: () => {
    set({ isBuilding: false, buildProgress: 0 })
  },

  /**
   * ビルド時間を見積もり
   */
  calculateBuildTime: () => {
    const { fileChanges } = get()
    return calculateBuildTime(fileChanges)
  },

  /**
   * 状態をリセット（テスト用）
   */
  _reset: () => {
    set(initialState)
  },
}))

/**
 * セレクターフック
 */

/**
 * ダイアログの開閉状態を取得
 */
export const useIsBuildConfirmationOpen = () =>
  useBuildConfirmationStore((state) => state.isOpen)

/**
 * ファイル変更一覧を取得
 */
export const useFileChanges = () =>
  useBuildConfirmationStore((state) => state.fileChanges)

/**
 * ページ影響一覧を取得
 */
export const usePageImpacts = () =>
  useBuildConfirmationStore((state) => state.pageImpacts)

/**
 * ビルド時間見積もりを取得
 */
export const useBuildTimeEstimate = () =>
  useBuildConfirmationStore((state) => state.buildTimeEstimate)

/**
 * ビルド実行中かどうかを取得
 */
export const useIsBuilding = () =>
  useBuildConfirmationStore((state) => state.isBuilding)

/**
 * ビルド進捗を取得
 */
export const useBuildProgress = () =>
  useBuildConfirmationStore((state) => state.buildProgress)

/**
 * ビルドエラーを取得
 */
export const useBuildError = () =>
  useBuildConfirmationStore((state) => state.buildError)
