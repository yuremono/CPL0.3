/**
 * Loading Indicator Component
 *
 * AI応答中のローディング表示コンポーネント。
 */

export function LoadingIndicator() {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-2 border-black"
      role="status"
      aria-live="polite"
      aria-label="AIが応答を生成中"
    >
      {/* ドットアニメーション */}
      <div className="flex gap-1" aria-hidden="true">
        <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
      </div>

      {/* テキスト */}
      <p className="text-sm font-medium">考え中...</p>
    </div>
  )
}

/**
 * コンパクトなローディング表示（インライン用）
 */
export function LoadingIndicatorCompact() {
  return (
    <div
      className="inline-flex items-center gap-2"
      role="status"
      aria-live="polite"
      aria-label="処理中"
    >
      <div className="flex gap-1" aria-hidden="true">
        <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
      </div>
    </div>
  )
}
