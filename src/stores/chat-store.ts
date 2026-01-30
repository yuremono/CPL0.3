/**
 * Chat Store
 *
 * チャットメッセージと送信状態を管理するZustandストア。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 利用可能なAIプロバイダー
 */
export type AIProvider = 'zai' | 'openai' | 'anthropic' | 'google'

/**
 * プロバイダー情報
 */
export const PROVIDER_INFO: Partial<Record<AIProvider, { name: string; model: string; speed: 'fast' | 'medium' | 'slow' }>> = {
  zai: { name: 'GLM-4.7', model: 'glm-4.7', speed: 'medium' },
  // openai: { name: 'OpenAI (GPT-4o)', model: 'gpt-4o', speed: 'medium' },
  // anthropic: { name: 'Anthropic (Claude)', model: 'claude-sonnet-4-20250514', speed: 'medium' },
  google: { name: 'Gemini 2.5 Flash', model: 'gemini-2.5-flash', speed: 'fast' },
}

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

  // 選択されたAIプロバイダー
  selectedProvider: AIProvider

  // アクション
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setSending: (isSending: boolean) => void
  setOpen: (isOpen: boolean) => void
  clearMessages: () => void
  setProvider: (provider: AIProvider) => void
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
 * プロバイダー選択は永続化する。
 */
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isSending: false,
      isOpen: true,
      selectedProvider: 'google', // デフォルトはGoogle

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

      /**
       * プロバイダーを設定
       */
      setProvider: (provider) => {
        set({ selectedProvider: provider })
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        selectedProvider: state.selectedProvider,
        isOpen: state.isOpen,
      }),
    }
  )
)

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
 * 選択されたプロバイダーを取得
 */
export const useSelectedProvider = () => useChatStore((state) => state.selectedProvider)

/**
 * 最後のメッセージを取得
 */
export const useLastMessage = () =>
  useChatStore((state) => {
    const messages = state.messages
    return messages.length > 0 ? messages[messages.length - 1] : null
  })
