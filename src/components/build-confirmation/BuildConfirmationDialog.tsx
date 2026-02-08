/**
 * Build Confirmation Dialog
 *
 * ビルド確認ダイアログコンポーネント
 * 編集内容を確認し、ビルドを実行する前に差分や影響範囲を表示する
 */

'use client'

import { useState } from 'react'
import {
  useBuildConfirmationStore,
  useIsBuildConfirmationOpen,
  useFileChanges,
  usePageImpacts,
  useBuildTimeEstimate,
  useIsBuilding,
  useBuildProgress,
  useBuildError,
} from '@/stores/build-confirmation-store'
import { FileChangeList } from './file-change-list'
import { PageImpactList } from './page-impact-list'
import { BuildTimeEstimate } from './build-time-estimate'

/**
 * BuildConfirmationDialog コンポーネント
 */
export function BuildConfirmationDialog() {
  const isOpen = useIsBuildConfirmationOpen()
  const fileChanges = useFileChanges()
  const pageImpacts = usePageImpacts()
  const buildTimeEstimate = useBuildTimeEstimate()
  const isBuilding = useIsBuilding()
  const buildProgress = useBuildProgress()
  const buildError = useBuildError()

  const [selectedTab, setSelectedTab] = useState<'changes' | 'impact' | 'estimate'>('changes')

  const store = useBuildConfirmationStore()

  /**
   * ダイアログを閉じる
   */
  const handleClose = () => {
    if (isBuilding) return
    store.close()
  }

  /**
   * ビルドを開始
   */
  const handleStartBuild = async () => {
    await store.startBuild()
  }

  /**
   * ビルドをキャンセル
   */
  const handleCancelBuild = () => {
    store.cancelBuild()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">ビルド確認</h2>
          <p className="text-sm text-gray-600 mt-1">
            編集内容を確認し、ビルドを実行してください
          </p>
        </div>

        {/* タブ */}
        <div className="border-b">
          <nav className="flex">
            <button
              type="button"
              onClick={() => setSelectedTab('changes')}
              disabled={isBuilding}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'changes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              } ${isBuilding ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              変更ファイル ({fileChanges.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('impact')}
              disabled={isBuilding}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'impact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              } ${isBuilding ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              影響ページ ({pageImpacts.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('estimate')}
              disabled={isBuilding}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'estimate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              } ${isBuilding ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              見積もり
            </button>
          </nav>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {selectedTab === 'changes' && <FileChangeList changes={fileChanges} />}
          {selectedTab === 'impact' && <PageImpactList impacts={pageImpacts} />}
          {selectedTab === 'estimate' && buildTimeEstimate && (
            <BuildTimeEstimate estimate={buildTimeEstimate} />
          )}
        </div>

        {/* ビルド進捗 */}
        {isBuilding && (
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">ビルド実行中...</span>
              <span className="text-sm text-gray-600">{buildProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${buildProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* エラー表示 */}
        {buildError && (
          <div className="px-6 py-4 bg-red-50 border-b">
            <p className="text-sm text-red-600">{buildError}</p>
          </div>
        )}

        {/* フッター */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          {!isBuilding ? (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleStartBuild}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                ビルド実行
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCancelBuild}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
