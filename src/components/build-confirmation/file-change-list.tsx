/**
 * File Change List
 *
 * ファイル変更一覧を表示するコンポーネント
 */

'use client'

import { useState } from 'react'
import type { FileChange } from './types'

interface FileChangeListProps {
  changes: FileChange[]
}

/**
 * 変更タイプに応じたバッジスタイル
 */
function getChangeTypeBadge(type: FileChange['type']) {
  const styles = {
    modified: 'bg-blue-100 text-blue-800',
    created: 'bg-green-100 text-green-800',
    deleted: 'bg-red-100 text-red-800',
  }
  const labels = {
    modified: '変更',
    created: '新規',
    deleted: '削除',
  }
  return { style: styles[type], label: labels[type] }
}

/**
 * FileChangeList コンポーネント
 */
export function FileChangeList({ changes }: FileChangeListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  /**
   * アイテムの展開/折りたたみを切り替え
   */
  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedItems(newExpanded)
  }

  if (changes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>変更されたファイルはありません</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <ul className="space-y-3">
        {changes.map((change) => {
          const { style, label } = getChangeTypeBadge(change.type)
          const isExpanded = expandedItems.has(change.path)
          const hasDiff = change.oldContent !== undefined || change.newContent !== undefined

          return (
            <li
              key={change.path}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* ヘッダー */}
              <button
                type="button"
                onClick={() => hasDiff && toggleExpand(change.path)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left ${
                  hasDiff ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
                } transition-colors`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {change.isImage && (
                    <span className="text-purple-500" aria-label="画像ファイル">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                  )}
                  <span className="font-mono text-sm truncate">{change.path}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${style}`}>
                  {label}
                </span>
                {hasDiff && (
                  <span className="ml-2 text-gray-400">
                    <svg
                      className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                )}
              </button>

              {/* 差分表示 */}
              {isExpanded && hasDiff && (
                <div className="border-t bg-gray-50">
                  {(change.oldContent !== undefined || change.newContent !== undefined) && (
                    <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                      {/* 変更前 */}
                      {change.oldContent !== undefined && (
                        <div>
                          <div className="font-medium text-red-600 mb-2">変更前</div>
                          <div className="bg-red-50 border border-red-200 rounded p-3 whitespace-pre-wrap break-words font-mono text-xs">
                            {change.oldContent || '(空)'}
                          </div>
                        </div>
                      )}
                      {/* 変更後 */}
                      {change.newContent !== undefined && (
                        <div>
                          <div className="font-medium text-green-600 mb-2">変更後</div>
                          <div className="bg-green-50 border border-green-200 rounded p-3 whitespace-pre-wrap break-words font-mono text-xs">
                            {change.newContent || '(空)'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
