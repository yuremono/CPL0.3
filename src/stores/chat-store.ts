/**
 * Chat Store
 *
 * チャットメッセージと送信状態を管理するZustandストア。
 */

import { create } from 'zustand'

/**
 * メッセージの役割
 */
export type MessageRole = 'user' | 'assistant' | 'system'

/**
 * チャットメッセージ
 */
export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  relatedElementId?: string
}

/**
 * ストアの状態
 */
export interface ChatState {
  // メッセージ一覧
  messages: ChatMessage[]

  // 送信中かどうか
  isSending: boolean

  // サイドバーの開閉状態
  isOpen: boolean

  // アクション
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setSending: (isSending: boolean) => void
  setOpen: (isOpen: boolean) => void
  clearMessages: () => void
}

/**
 * メッセージIDを生成
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * チャットストア
 *
 * メッセージは永続化しない（セッションごとにクリア）。
 */
export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isSending: false,
  isOpen: true,

  /**
   * メッセージを追加
   */
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateMessageId(),
      timestamp: Date.now(),
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }))
  },

  /**
   * 送信状態を設定
   */
  setSending: (isSending) => {
    set({ isSending })
  },

  /**
   * サイドバーの開閉状態を設定
   */
  setOpen: (isOpen) => {
    set({ isOpen })
  },

  /**
   * メッセージをクリア
   */
  clearMessages: () => {
    set({ messages: [] })
  },
}))

/**
 * セレクターフック
 */

/**
 * メッセージ一覧を取得
 */
export const useMessages = () => useChatStore((state) => state.messages)

/**
 * 送信中かどうかを取得
 */
export const useIsSending = () => useChatStore((state) => state.isSending)

/**
 * サイドバーの開閉状態を取得
 */
export const useIsChatOpen = () => useChatStore((state) => state.isOpen)

/**
 * 最後のメッセージを取得
 */
export const useLastMessage = () =>
  useChatStore((state) => {
    const messages = state.messages
    return messages.length > 0 ? messages[messages.length - 1] : null
  })
