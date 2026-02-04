/**
 * Build Time Estimate
 *
 * ビルド時間の見積もりを表示するコンポーネント
 */

'use client'

import type { BuildTimeEstimate as BuildTimeEstimateType } from './types'

interface BuildTimeEstimateProps {
  estimate: BuildTimeEstimateType
}

/**
 * 信頼度に応じたバッジスタイル
 */
function getConfidenceBadge(confidence: BuildTimeEstimateType['confidence']) {
  const styles = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800',
  }
  const labels = {
    high: '高い',
    medium: '中',
    low: '低い',
  }
  return { style: styles[confidence], label: labels[confidence] }
}

/**
 * BuildTimeEstimate コンポーネント
 */
export function BuildTimeEstimate({ estimate }: BuildTimeEstimateProps) {
  const { style, label } = getConfidenceBadge(estimate.confidence)

  // 秒を分:秒に変換
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (minutes > 0) {
      return `${minutes}分${secs}秒`
    }
    return `${secs}秒`
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* 見積もり時間 */}
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">予想所要時間</div>
          <div className="text-4xl font-bold text-blue-600">
            {formatTime(estimate.estimatedSeconds)}
          </div>
          <div className="mt-2">
            <span className={`px-3 py-1 text-sm font-medium rounded ${style}`}>
              信頼度: {label}
            </span>
          </div>
        </div>

        {/* 計算要素 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">計算要素</h3>
          <ul className="space-y-2">
            {estimate.factors.map((factor, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="text-blue-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 注意事項 */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">ご注意:</span>
            これは予想所要時間です。実際のビルド時間は、サーバーの負荷状況や変更内容によって異なる場合があります。
          </p>
        </div>

        {/* ISR/SSG情報 */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">ISR/SSG ビルドについて</h4>
          <p className="text-sm text-blue-800">
            このプロジェクトではIncremental Static Regeneration（ISR）またはStatic Site Generation（SSG）を使用しています。
            変更されたページのみが再生成されます。
          </p>
        </div>
      </div>
    </div>
  )
}
