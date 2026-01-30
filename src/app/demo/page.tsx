'use client'

/**
 * Content Projection Layer - デモページ
 *
 * このページはContent Projection Layerの機能をデモします。
 * ?mode=preview クエリパラメータでプレビューモードが有効になります。
 */

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PreviewProvider } from '@/components/content-projection-layer'
import { EditableWrapper } from '@/components/content-projection-layer'
import { generateId } from '@/lib/content-projection/generate-id'

function DemoContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const isPreviewMode = mode === 'preview'

  return (
    <PreviewProvider isPreviewMode={isPreviewMode}>
      <div className="min-h-screen bg-white">
        {/* モード表示ヘッダー */}
        <div className="sticky top-0 z-50 border-b-2 border-black bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">Content Projection Layer - デモ</h1>
              <p className="text-sm text-gray-600">
                現在のモード: <span className="font-mono font-semibold">{isPreviewMode ? 'プレビュー（編集可能）' : '通常表示'}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="/demo?mode=preview"
                className="px-4 py-2 text-sm font-semibold border-2 border-black bg-accent text-white hover:bg-accent-dark"
              >
                プレビューモード
              </a>
              <a
                href="/demo"
                className="px-4 py-2 text-sm font-semibold border-2 border-black bg-white text-black hover:bg-gray-50"
              >
                通常モード
              </a>
            </div>
          </div>
        </div>

        {/* 説明セクション */}
        <section className="border-b-2 border-black bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">このデモについて</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Content Projection Layerは、AI主導の編集体験を実現する中間層です。
                以下の機能を体験できます：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>ホバー</strong>: プレビューモード時、編集可能な要素にホバーするとハイライト表示</li>
                <li><strong>クリック</strong>: 要素をクリックして選択（現在はコンソールに出力）</li>
                <li><strong>ダブルクリック</strong>: 直接編集モード（開発中）</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                ※ 現在、作業A（プレビューUI）の機能のみ実装されています。
                チャットUI、AI連携、状態管理は今後の実装となります。
              </p>
            </div>
          </div>
        </section>

        {/* デモコンテンツエリア */}
        <section className="p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold">編集可能な要素</h2>

            {/* 見出しの例 */}
            <EditableWrapper
              element={{
                id: generateId(),
                role: 'heading',
                content: 'これは編集可能な見出しです',
                level: 2,
                label: 'メイン見出し',
                editable: true,
                context: { section: 'demo' },
              }}
              onSelect={(el) => console.log('選択された要素:', el)}
            >
              <h2 className="text-4xl font-bold">これは編集可能な見出しです</h2>
            </EditableWrapper>

            {/* 段落の例 */}
            <EditableWrapper
              element={{
                id: generateId(),
                role: 'paragraph',
                content: 'これは編集可能な段落です。ホバーするとハイライトされ、クリックで選択できます。',
                label: '説明段落',
                editable: true,
              }}
              onSelect={(el) => console.log('選択された要素:', el)}
            >
              <p className="text-lg leading-relaxed">
                これは編集可能な段落です。ホバーするとハイライトされ、クリックで選択できます。
              </p>
            </EditableWrapper>

            {/* リンクの例 */}
            <EditableWrapper
              element={{
                id: generateId(),
                role: 'link',
                content: 'これは編集可能なリンクです',
                label: 'デモリンク',
                editable: true,
              }}
              onSelect={(el) => console.log('選択された要素:', el)}
            >
              <a
                href="#"
                className="text-accent underline hover:text-accent-dark"
                onClick={(e) => e.preventDefault()}
              >
                これは編集可能なリンクです
              </a>
            </EditableWrapper>

            {/* 編集不可能な要素の例 */}
            <div className="pt-8 border-t-2 border-black">
              <h3 className="text-xl font-bold mb-4">編集不可能な要素</h3>
              <EditableWrapper
                element={{
                  id: generateId(),
                  role: 'paragraph',
                  content: 'この要素は編集不可能に設定されています',
                  label: '固定テキスト',
                  editable: false,
                }}
                onSelect={(el) => console.log('選択された要素:', el)}
              >
                <p className="text-gray-600">
                  この要素は編集不可能に設定されています。ホバーしてもハイライトされません。
                </p>
              </EditableWrapper>
            </div>

            {/* 複数の要素を含むセクション */}
            <div className="pt-8 border-t-2 border-black">
              <h3 className="text-xl font-bold mb-4">複数の編集可能要素</h3>
              <div className="space-y-4">
                <EditableWrapper
                  element={{
                    id: generateId(),
                    role: 'heading',
                    content: 'サブ見出し1',
                    level: 3,
                    editable: true,
                  }}
                  onSelect={(el) => console.log('選択された要素:', el)}
                >
                  <h3 className="text-2xl font-bold">サブ見出し1</h3>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: generateId(),
                    role: 'paragraph',
                    content: '対応する段落1',
                    editable: true,
                  }}
                  onSelect={(el) => console.log('選択された要素:', el)}
                >
                  <p>対応する段落1</p>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: generateId(),
                    role: 'heading',
                    content: 'サブ見出し2',
                    level: 3,
                    editable: true,
                  }}
                  onSelect={(el) => console.log('選択された要素:', el)}
                >
                  <h3 className="text-2xl font-bold">サブ見出し2</h3>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: generateId(),
                    role: 'paragraph',
                    content: '対応する段落2',
                    editable: true,
                  }}
                  onSelect={(el) => console.log('選択された要素:', el)}
                >
                  <p>対応する段落2</p>
                </EditableWrapper>
              </div>
            </div>

            {/* デバッグ情報（プレビューモード時のみ） */}
            {isPreviewMode && (
              <div className="mt-8 p-4 bg-gray-100 border-2 border-black rounded">
                <h3 className="font-bold mb-2">デバッグ情報</h3>
                <p className="text-sm text-gray-700">
                  プレビューモードが有効です。編集可能な要素にホバーするとハイライト表示されます。
                  要素をクリックすると、ブラウザのコンソールに要素情報が出力されます。
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  コンソールを開く: <code className="bg-white px-1 border">F12</code> または <code className="bg-white px-1 border">Cmd+Option+I</code>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* フッター */}
        <footer className="border-t-2 border-black p-8">
          <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
            <p>Content Projection Layer - デモページ</p>
            <p className="mt-2">
              <a href="/" className="text-accent hover:underline">
                トップページに戻る
              </a>
            </p>
          </div>
        </footer>
      </div>
    </PreviewProvider>
  )
}

// Suspenseでラップして、useSearchParams()のエラーを回避
export default function DemoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    }>
      <DemoContent />
    </Suspense>
  )
}
