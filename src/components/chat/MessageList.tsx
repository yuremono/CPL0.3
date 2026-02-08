/**
 * Message List Component
 *
 * チャットメッセージ一覧を表示するコンポーネント。
 */

import { useEffect, useRef } from 'react'
import { useMessages, usePendingPreview } from '@/stores/chat-store'
import type { ChatMessage } from '@/stores/chat-store'
import { EditPreviewActions } from './EditPreviewActions'

interface MessageListProps {
  onApproveEdit: (message: ChatMessage) => void
  onRejectEdit: () => void
  isSending: boolean
}

export function MessageList({ onApproveEdit, onRejectEdit, isSending }: MessageListProps) {
  const messages = useMessages()
  const pendingPreview = usePendingPreview()
  const scrollRef = useRef<HTMLDivElement>(null)

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-center">
            AIアシスタントと対話して、
            <br />
            コンテンツを編集できます。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isPendingPreview={pendingPreview?.messageId === message.id}
          onApproveEdit={onApproveEdit}
          onRejectEdit={onRejectEdit}
          isSending={isSending}
        />
      ))}
    </div>
  )
}

interface MessageItemProps {
  message: ChatMessage
  isPendingPreview: boolean
  onApproveEdit: (message: ChatMessage) => void
  onRejectEdit: () => void
  isSending: boolean
}

function MessageItem({
  message,
  isPendingPreview,
  onApproveEdit,
  onRejectEdit,
  isSending,
}: MessageItemProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  const time = new Date(message.timestamp).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // システムメッセージのスタイル
  const isSystemMessage = isSystem

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      role="listitem"
      aria-label={`${isUser ? 'ユーザー' : isSystem ? 'システム' : 'AI'}のメッセージ`}
    >
      <div className="max-w-[80%]">
        {/* メッセージバブル */}
        <div
          className={`
            px-4 py-2 border-2 border-black
            ${isUser ? 'bg-accent text-white' : isSystem ? 'bg-yellow-100 text-black' : 'bg-gray-100 text-black'}
            shadow-[2px_2px_0_0_#0A0A0A]
          `}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* プレビューアクション（AI応答で関連要素がある場合のみ） */}
        {isPendingPreview && message.role === 'assistant' && message.relatedElementId && (
          <EditPreviewActions
            onApprove={() => onApproveEdit(message)}
            onReject={onRejectEdit}
            disabled={isSending}
          />
        )}

        {/* タイムスタンプ */}
        <p
          className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}
        >
          {time}
        </p>
      </div>
    </div>
  )
}
