'use client'

/**
 * Content Projection Layer - デモページ
 *
 * このページはContent Projection Layerの機能をデモします。
 * ?mode=preview クエリパラメータでプレビューモードが有効になります。
 */

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PreviewProvider, EditLayerToggle } from '@/components/content-projection-layer'
import { EditableWrapper } from '@/components/content-projection-layer'
import { EditableImageWrapper } from '@/components/content-projection-layer'
import { generateId } from '@/lib/content-projection/GenerateId'
import { usePreviewStore } from '@/stores/preview-store'
import { useEditHistoryStore } from '@/stores/edit-history-store'
import { useAutoSave } from '@/hooks/UseAutoSave'
import {
  ChatSidebar,
  ChatToggleButton,
  MessageList,
  MessageInput,
  ElementInfoCard,
  ProviderSelector,
  LoadingIndicatorEnhanced,
  EditHistoryPanel,
  useChatStore,
  useSelectedProvider,
  type AIProvider,
  type ChatMessage,
} from '@/components/chat'

function DemoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode')
  const isPreviewMode = mode === 'preview'

  // モード切り替えハンドラー（クライアントサイドで実行）
  const handleModeToggle = () => {
    const newMode = isPreviewMode ? '' : 'preview'
    const url = newMode ? `/demo?mode=${newMode}` : '/demo'
    router.push(url)
  }

  // 状態管理統合: 選択機能
  const selectElement = usePreviewStore((state) => state.selectElement)
  const selectedElement = usePreviewStore((state) => state.selectedElement)
  const updateContent = usePreviewStore((state) => state.updateContent)
  const setMode = usePreviewStore((state) => state.setMode)
  const edits = usePreviewStore((state) => state.edits)

  // 編集履歴統合
  const addOperation = useEditHistoryStore((state) => state.addOperation)

  // 自動保存統合
  useAutoSave()

  // チャットストア初期化（作業B統合）
  const setIsChatOpen = useChatStore((state) => state.setOpen)
  const addMessage = useChatStore((state) => state.addMessage)
  const setSending = useChatStore((state) => state.setSending)
  const isSending = useChatStore((state) => state.isSending)
  const setPendingPreview = useChatStore((state) => state.setPendingPreview)
  const clearPendingPreview = useChatStore((state) => state.clearPendingPreview)
  const selectedProvider = useSelectedProvider()

  useEffect(() => {
    // preview-storeのモードを設定
    setMode(isPreviewMode ? 'preview' : 'edit')

    // チャットUIの開閉を設定
    if (isPreviewMode) {
      setIsChatOpen(true)
    }
  }, [isPreviewMode, setIsChatOpen, setMode])

  // AI連携統合: メッセージ送信でAI APIを呼び出し
  const handleSendMessage = async (message: string) => {
    // ユーザーメッセージを追加
    addMessage({
      role: 'user',
      content: message,
      relatedElementId: selectedElement?.id,
    })

    // 選択中の要素がない場合はエラーメッセージ
    if (!selectedElement) {
      addMessage({
        role: 'assistant',
        content: '編集する要素が選択されていません。編集したい要素をクリックして選択してください。',
      })
      return
    }

    // 編集不可能な要素の場合
    if (!selectedElement.editable) {
      addMessage({
        role: 'assistant',
        content: 'この要素は編集不可能に設定されています。',
      })
      return
    }

    // AI APIを呼び出し
    setSending(true)
    try {
      const response = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          selectedElement,
          userIntent: message,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const newContent = data.data.newContent || ''

        // AI応答を追加（生成されたメッセージIDを取得）
        const addedMessage = addMessage({
          role: 'assistant',
          content: newContent || '編集が完了しました。',
          relatedElementId: selectedElement.id,
        })

        // プレビュー状態を設定（即座に更新しない）
        if (newContent) {
          setPendingPreview({
            messageId: addedMessage.id,
            elementId: selectedElement.id,
            previewContent: newContent,
          })
        }
      } else {
        // デバッグ: エラーレスポンスを確認
        console.log('[AI API エラーレスポンス]', {
          success: data.success,
          error: data.error,
          fullResponse: data,
        })

        addMessage({
          role: 'assistant',
          content: `エラー: ${data.error}`,
        })
      }
    } catch (error) {
      console.error('AI API error:', error)
      addMessage({
        role: 'assistant',
        content: 'AI編集の処理中にエラーが発生しました。',
      })
    } finally {
      setSending(false)
    }
  }

  const handleSelectElement = (element: Parameters<typeof selectElement>[0]) => {
    selectElement(element)
  }

  /**
   * プレビューを承認（OKボタン）
   */
  const handleApproveEdit = (message: ChatMessage) => {
    if (!message.relatedElementId || !message.content) return

    // プレビュー内容を確定
    updateContent(message.relatedElementId, message.content)

    // 編集履歴に記録
    if (selectedElement) {
      addOperation({
        elementId: message.relatedElementId,
        elementType: 'text',
        type: 'update',
        oldValue: selectedElement.content,
        newValue: message.content,
      })

      // 選択中の要素情報も更新
      selectElement({
        ...selectedElement,
        content: message.content,
      })
    }

    // プレビュー状態をクリア
    clearPendingPreview()

    // システムメッセージを追加
    addMessage({
      role: 'system',
      content: '編集を確定しました。',
    })
  }

  /**
   * プレビューを拒否（NGボタン）
   */
  const handleRejectEdit = () => {
    // プレビューをキャンセル（何も変更しない）
    clearPendingPreview()

    // システムメッセージを追加
    addMessage({
      role: 'system',
      content: 'プレビューをキャンセルしました。',
    })
  }

  return (
    <PreviewProvider isPreviewMode={isPreviewMode}>
      <div className="min-h-screen bg-white relative">
        {/* チャットUI（作業B統合） */}
        <ChatSidebar>
          {/* プロバイダー選択 */}
          <ProviderSelector disabled={isSending} />

          {/* 選択中の要素情報カード */}
          {selectedElement && (
            <ElementInfoCard
              element={selectedElement}
              onDeselect={() => selectElement(null)}
            />
          )}

          {/* メッセージ一覧 */}
          <MessageList
            onApproveEdit={handleApproveEdit}
            onRejectEdit={handleRejectEdit}
            isSending={isSending}
          />

          {/* ローディング表示（強化版） */}
          {isSending && (
            <LoadingIndicatorEnhanced
              estimatedTime={
                selectedProvider === 'google'
                  ? 5
                  : selectedProvider === 'zai'
                    ? 10
                    : selectedProvider === 'openai'
                      ? 8
                      : 8
              }
            />
          )}

          {/* 入力フォーム */}
          <MessageInput onSend={handleSendMessage} disabled={isSending} />

          {/* 編集履歴パネル */}
          <EditHistoryPanel />
        </ChatSidebar>

        {/* チャット開閉ボタン */}
        <ChatToggleButton />

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
              {/* 編集レイヤートグルボタン（URLに依存しない） */}
              <EditLayerToggle />

              {/* URLモード切り替えボタン（従来通り） */}
              <button
                type="button"
                onClick={handleModeToggle}
                className={`px-4 py-2 text-sm font-semibold border-2 border-black ${
                  isPreviewMode
                    ? 'bg-accent text-white'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                {isPreviewMode ? 'URL: プレビュー' : 'URL: 通常'}
              </button>
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
                ※ 現在、作業A（プレビューUI）+ 作業D（状態管理）が統合されています。
                チャットUI、AI連携は今後の統合となります。
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
                id: 'demo-heading-1',
                role: 'heading',
                content: 'これは編集可能な見出しです',
                level: 2,
                label: 'メイン見出し',
                editable: true,
                context: { section: 'demo' },
              }}
              isSelected={selectedElement?.id === 'demo-heading-1'}
              onSelect={handleSelectElement}
            >
              <h2 className="text-4xl font-bold">これは編集可能な見出しです</h2>
            </EditableWrapper>

            {/* 段落の例 */}
            <EditableWrapper
              element={{
                id: 'demo-paragraph-1',
                role: 'paragraph',
                content: 'これは編集可能な段落です。ホバーするとハイライトされ、クリックで選択できます。',
                label: '説明段落',
                editable: true,
              }}
              isSelected={selectedElement?.id === 'demo-paragraph-1'}
              onSelect={handleSelectElement}
            >
              <p className="text-lg leading-relaxed">
                これは編集可能な段落です。ホバーするとハイライトされ、クリックで選択できます。
              </p>
            </EditableWrapper>

            {/* リンクの例 */}
            <EditableWrapper
              element={{
                id: 'demo-link-1',
                role: 'link',
                content: 'これは編集可能なリンクです',
                label: 'デモリンク',
                editable: true,
              }}
              onSelect={handleSelectElement}
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
                  id: 'demo-paragraph-fixed',
                  role: 'paragraph',
                  content: 'この要素は編集不可能に設定されています',
                  label: '固定テキスト',
                  editable: false,
                }}
                isSelected={selectedElement?.id === 'demo-paragraph-fixed'}
                onSelect={handleSelectElement}
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
                    id: 'demo-subheading-1',
                    role: 'heading',
                    content: 'サブ見出し1',
                    level: 3,
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === 'demo-subheading-1'}
                  onSelect={handleSelectElement}
                >
                  <h3 className="text-2xl font-bold">サブ見出し1</h3>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: 'demo-paragraph-2',
                    role: 'paragraph',
                    content: '対応する段落1',
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === 'demo-paragraph-2'}
                  onSelect={handleSelectElement}
                >
                  <p>対応する段落1</p>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: 'demo-subheading-2',
                    role: 'heading',
                    content: 'サブ見出し2',
                    level: 3,
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === 'demo-subheading-2'}
                  onSelect={handleSelectElement}
                >
                  <h3 className="text-2xl font-bold">サブ見出し2</h3>
                </EditableWrapper>

                <EditableWrapper
                  element={{
                    id: 'demo-paragraph-3',
                    role: 'paragraph',
                    content: '対応する段落2',
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === 'demo-paragraph-3'}
                  onSelect={handleSelectElement}
                >
                  <p>対応する段落2</p>
                </EditableWrapper>
              </div>
            </div>

            {/* 画像編集機能のデモ */}
            <div className="pt-8 border-t-2 border-black">
              <h3 className="text-xl font-bold mb-4">画像編集機能</h3>
              <p className="text-gray-600 mb-4">
                ドラッグ&ドロップで画像を置換できます。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <EditableImageWrapper
                  element={{
                    id: generateId('demo-image-1'),
                    role: 'image',
                    content: 'プロフィール画像',
                    label: 'デモ画像1',
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === 'demo-image-1'}
                  onSelect={handleSelectElement}
                  src="https://placehold.co/400x300/e2e8f0/0d47a1?text=Sample+Image+1"
                  alt="サンプル画像1"
                  className="w-full h-48 rounded"
                >
                  <img
                    src="https://placehold.co/400x300/e2e8f0/0d47a1?text=Sample+Image+1"
                    alt="サンプル画像1"
                    className="w-full h-48 rounded"
                  />
                </EditableImageWrapper>

                <EditableImageWrapper
                  element={{
                    id: generateId('demo-image-2'),
                    role: 'image',
                    content: 'サムネイル画像',
                    label: 'デモ画像2',
                    editable: true,
                  }}
                  isSelected={selectedElement?.id === 'demo-image-2'}
                  onSelect={handleSelectElement}
                  src="https://placehold.co/400x300/fef3c7/0d47a1?text=Sample+Image+2"
                  alt="サンプル画像2"
                  className="w-full h-48 rounded"
                >
                  <img
                    src="https://placehold.co/400x300/fef3c7/0d47a1?text=Sample+Image+2"
                    alt="サンプル画像2"
                    className="w-full h-48 rounded"
                  />
                </EditableImageWrapper>
              </div>
            </div>

            {/* デバッグ情報（プレビューモード時のみ） */}
            {isPreviewMode && (
              <div className="mt-8 p-4 bg-gray-100 border-2 border-black rounded">
                <h3 className="font-bold mb-2">デバッグ情報</h3>
                <p className="text-sm text-gray-700">
                  プレビューモードが有効です。編集可能な要素にホバーするとハイライト表示されます。
                  要素をクリックすると、選択状態が保存されます。
                </p>

                {/* 選択中の要素 */}
                {selectedElement && (
                  <div className="mt-3 p-3 bg-white border border-black rounded">
                    <p className="text-sm font-semibold">選択中の要素:</p>
                    <pre className="text-xs mt-2 overflow-auto">
                      {JSON.stringify(selectedElement, null, 2)}
                    </pre>
                  </div>
                )}

                {/* 編集内容ストア */}
                {Object.keys(edits).length > 0 && (
                  <div className="mt-3 p-3 bg-white border border-black rounded">
                    <p className="text-sm font-semibold">編集内容ストア (edits):</p>
                    <pre className="text-xs mt-2 overflow-auto">
                      {JSON.stringify(edits, null, 2)}
                    </pre>
                  </div>
                )}

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
