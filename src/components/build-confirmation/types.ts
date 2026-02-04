/**
 * Build Confirmation - Type Definitions
 *
 * ビルド確認画面で使用する型定義
 */

import type { EditOperation } from '@/lib/content-projection/types'

/**
 * ファイル変更の種類
 */
export type FileChangeType = 'modified' | 'created' | 'deleted'

/**
 * ファイル変更情報
 */
export interface FileChange {
  path: string // ファイルパス
  type: FileChangeType // 変更種類
  oldContent?: string // 変更前の内容
  newContent?: string // 変更後の内容
  isImage?: boolean // 画像ファイルかどうか
}

/**
 * ページ影響情報
 */
export interface PageImpact {
  path: string // ページパス
  title: string // ページタイトル
  affectedChanges: number // 影響を受ける変更数
}

/**
 * ビルド時間見積もり
 */
export interface BuildTimeEstimate {
  estimatedSeconds: number // 見積もり時間（秒）
  confidence: 'high' | 'medium' | 'low' // 信頼度
  factors: string[] // 見積もりに使用した要素
}

/**
 * ビルド確認ダイアログの状態
 */
export interface BuildConfirmationState {
  isOpen: boolean // ダイアログの開閉状態
  fileChanges: FileChange[] // ファイル変更一覧
  pageImpacts: PageImpact[] // ページ影響一覧
  buildTimeEstimate: BuildTimeEstimate | null // ビルド時間見積もり
  isBuilding: boolean // ビルド実行中かどうか
  buildProgress: number // ビルド進捗（0-100）
  buildError: string | null // ビルドエラーメッセージ
}

/**
 * ビルド確認ダイアログのアクション
 */
export interface BuildConfirmationActions {
  open: (editOperations: EditOperation[]) => void
  close: () => void
  startBuild: () => Promise<void>
  cancelBuild: () => void
  calculateBuildTime: () => BuildTimeEstimate
}
