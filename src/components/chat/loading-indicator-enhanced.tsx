/**
 * Enhanced Loading Indicator Component
 *
 * AI応答中のローディング表示コンポーネント（強化版）
 * プログレスバーと推定時間表示を含む
 */

'use client'

import { useEffect, useState } from 'react'

interface LoadingIndicatorEnhancedProps {
  /**
   * 推定時間（秒）
   */
  estimatedTime?: number
}

/**
 * 時間をフォーマットする
 */
function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `約${Math.ceil(seconds)}秒`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return remainingSeconds > 0 ? `約${minutes}分${remainingSeconds}秒` : `約${minutes}分`
}

export function LoadingIndicatorEnhanced({ estimatedTime = 10 }: LoadingIndicatorEnhancedProps) {
  const [elapsed, setElapsed] = useState(0)
  const [progress, setProgress] = useState(0)

  // 経過時間とプログレスを更新
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1
        // プログレスを計算（推定時間に対する割合）
        const progressPercent = Math.min((next / estimatedTime) * 100, 95)
        setProgress(progressPercent)
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [estimatedTime])

  return (
    <div
      className="px-4 py-3 bg-gray-100 border-2 border-black"
      role="status"
      aria-live="polite"
      aria-label="AIが応答を生成中"
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* ドットアニメーション */}
          <div className="flex gap-1" aria-hidden="true">
            <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
          </div>

          {/* テキスト */}
          <p className="text-sm font-medium">AIが考え中...</p>
        </div>

        {/* 経過時間 */}
        <p className="text-xs text-gray-600 font-mono">{elapsed.toFixed(1)}秒経過</p>
      </div>

      {/* プログレスバー */}
      <div className="w-full h-2 bg-white border border-black rounded overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 推定残り時間 */}
      <p className="text-xs text-gray-600 mt-1">
        推定残り時間: {formatTime(Math.max(0, estimatedTime - elapsed))}
      </p>
    </div>
  )
}
