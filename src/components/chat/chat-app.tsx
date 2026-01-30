/**
 * Chat App Component
 *
 * チャットUIの統合コンポーネント。
 * メッセージ送信、ローディング表示、選択要素情報カードを統合する。
 * AI連携が完了しており、編集リクエストをAPIに送信します。
 */

import { useSelectedElement, usePreviewStore } from '@/stores/preview-store'
import { useEditHistoryStore } from '@/stores/edit-history-store'
import { useChatStore, useIsSending, useSelectedProvider, type AIProvider } from '@/stores/chat-store'
import { ElementInfoCard } from './element-info-card'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { LoadingIndicatorEnhanced } from './loading-indicator-enhanced'
import { ProviderSelector } from './provider-selector'

/**
 * 推定応答時間（秒）- プロバイダー別
 */
const ESTIMATED_TIME: Record<AIProvider, number> = {
  zai: 10,
  openai: 8,
  anthropic: 8,
  google: 5, // Gemini Flashは高速
}

/**
 * チャットアプリコンポーネント
 */
export function ChatApp() {
  const selectedElement = useSelectedElement()
  const mode = usePreviewStore((state) => state.mode)
  const selectElement = usePreviewStore((state) => state.selectElement)
  const updateContent = usePreviewStore((state) => state.updateContent)

  const addOperation = useEditHistoryStore((state) => state.addOperation)

  const isSending = useIsSending()
  const selectedProvider = useSelectedProvider()
  const addMessage = useChatStore((state) => state.addMessage)
  const setSending = useChatStore((state) => state.setSending)

  /**
   * メッセージを送信（AI統合版）
   */
  const handleSendMessage = async (content: string) => {
    // ユーザーメッセージを追加
    addMessage({
      role: 'user',
      content,
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
          userIntent: content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const newContent = data.data.newContent || ''

        // AI応答を追加
        addMessage({
          role: 'assistant',
          content: newContent || '編集が完了しました。',
          relatedElementId: selectedElement.id,
        })

        // 編集内容をストアに保存
        if (newContent) {
          // 編集履歴に記録
          addOperation({
            elementId: selectedElement.id,
            type: 'update',
            oldValue: selectedElement.content,
            newValue: newContent,
            timestamp: Date.now(),
          })

          // プレビューストアに保存
          updateContent(selectedElement.id, newContent)

          // 選択中の要素情報も更新
          selectElement({
            ...selectedElement,
            content: newContent,
          })
        }
      } else {
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

  /**
   * 選択を解除
   */
  const handleDeselect = () => {
    selectElement(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* プロバイダー選択 */}
      <ProviderSelector disabled={isSending} />

      {/* 選択要素情報カード */}
      {selectedElement && (
        <ElementInfoCard element={selectedElement} onDeselect={handleDeselect} />
      )}

      {/* メッセージ一覧 */}
      <MessageList />

      {/* ローディング表示（強化版） */}
      {isSending && <LoadingIndicatorEnhanced estimatedTime={ESTIMATED_TIME[selectedProvider]} />}

      {/* メッセージ入力 */}
      <MessageInput onSend={handleSendMessage} disabled={isSending} />
    </div>
  )
}
