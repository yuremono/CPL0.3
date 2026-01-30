/**
 * Chat App Component
 *
 * チャットUIの統合コンポーネント。
 * メッセージ送信、ローディング表示、選択要素情報カードを統合する。
 * AI連携が完了しており、編集リクエストをAPIに送信します。
 */

import { useSelectedElement, usePreviewStore } from '@/stores/preview-store'
import { useEditHistoryStore } from '@/stores/edit-history-store'
import { useChatStore, useIsSending, useMessages } from '@/stores/chat-store'
import { ElementInfoCard } from './element-info-card'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { LoadingIndicator } from './loading-indicator'

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
          selectedElement,
          userIntent: content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const newContent = data.data.content || ''

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
      {/* 選択要素情報カード */}
      {selectedElement && (
        <ElementInfoCard element={selectedElement} onDeselect={handleDeselect} />
      )}

      {/* メッセージ一覧 */}
      <MessageList />

      {/* ローディング表示 */}
      {isSending && <LoadingIndicator />}

      {/* メッセージ入力 */}
      <MessageInput onSend={handleSendMessage} disabled={isSending} />
    </div>
  )
}
