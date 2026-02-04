/**
 * Page Impact List
 *
 * 影響を受けるページの一覧を表示するコンポーネント
 */

'use client'

import type { PageImpact } from './types'

interface PageImpactListProps {
  impacts: PageImpact[]
}

/**
 * PageImpactList コンポーネント
 */
export function PageImpactList({ impacts }: PageImpactListProps) {
  if (impacts.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>影響を受けるページはありません</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <ul className="space-y-3">
        {impacts.map((impact) => (
          <li
            key={impact.path}
            className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{impact.title}</div>
              <div className="text-sm text-gray-500 font-mono mt-1">{impact.path}</div>
            </div>
            <div className="text-sm text-gray-600">
              {impact.affectedChanges}件の変更
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">注意:</span>
          {impacts.length > 1
            ? ` これら${impacts.length}ページのビルドが実行されます。`
            : ' このページのビルドが実行されます。'}
        </p>
      </div>
    </div>
  )
}
