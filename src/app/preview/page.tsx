'use client';

/**
 * プレビューページ
 *
 * 編集内容を反映した最終的なプレビューを表示するページ
 */

import { Suspense } from 'react'

function PreviewContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-4">プレビューページ</h1>
        <p className="text-lg text-gray-600 mb-8">
          ここに編集内容を反映したプレビューが表示されます。
        </p>
        <div className="bg-white border-2 border-black p-8 rounded-lg shadow-[4px_4px_0_0_#0A0A0A]">
          <p className="text-gray-500">
            プレビュー機能は現在開発中です。
          </p>
          <a
            href="<Link/>"
            className="inline-block mt-6 px-6 py-3 bg-accent text-white font-semibold border-2 border-black rounded-lg hover:bg-accent/90 transition-colors"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
