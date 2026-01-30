/**
 * Chat Store Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useChatStore, useMessages, useIsSending, useIsChatOpen } from '../chat-store'

describe('ChatStore', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    useChatStore.getState().clearMessages()
    useChatStore.getState().setSending(false)
    useChatStore.getState().setOpen(true)
  })

  describe('初期状態', () => {
    it('空のメッセージ配列を持つ', () => {
      const messages = useMessages()
      expect(messages).toEqual([])
    })

    it('送信中でない', () => {
      const isSending = useIsSending()
      expect(isSending).toBe(false)
    })

    it('サイドバーが開いている', () => {
      const isOpen = useIsChatOpen()
      expect(isOpen).toBe(true)
    })
  })

  describe('addMessage', () => {
    it('メッセージを追加できる', () => {
      const store = useChatStore.getState()

      store.addMessage({
        role: 'user',
        content: 'こんにちは',
      })

      const currentState = useChatStore.getState()
      expect(currentState.messages).toHaveLength(1)
      expect(currentState.messages[0]).toMatchObject({
        role: 'user',
        content: 'こんにちは',
      })
      expect(currentState.messages[0].id).toMatch(/^msg_\d+_\w+$/)
      expect(currentState.messages[0].timestamp).toBeLessThanOrEqual(Date.now())
    })

    it('複数のメッセージを追加できる', () => {
      const store = useChatStore.getState()

      store.addMessage({
        role: 'user',
        content: 'こんにちは',
      })
      store.addMessage({
        role: 'assistant',
        content: 'はい、どうしましたか？',
      })

      const currentState = useChatStore.getState()
      expect(currentState.messages).toHaveLength(2)
      expect(currentState.messages[0].role).toBe('user')
      expect(currentState.messages[1].role).toBe('assistant')
    })

    it('relatedElementIdを含むメッセージを追加できる', () => {
      const store = useChatStore.getState()

      store.addMessage({
        role: 'user',
        content: 'この要素を編集して',
        relatedElementId: 'blk_abc123',
      })

      const currentState = useChatStore.getState()
      expect(currentState.messages[0].relatedElementId).toBe('blk_abc123')
    })
  })

  describe('setSending', () => {
    it('送信状態を設定できる', () => {
      const store = useChatStore.getState()

      expect(store.isSending).toBe(false)

      store.setSending(true)

      expect(useChatStore.getState().isSending).toBe(true)

      store.setSending(false)

      expect(useChatStore.getState().isSending).toBe(false)
    })
  })

  describe('setOpen', () => {
    it('サイドバーの開閉状態を設定できる', () => {
      const store = useChatStore.getState()

      expect(store.isOpen).toBe(true)

      store.setOpen(false)

      expect(useChatStore.getState().isOpen).toBe(false)

      store.setOpen(true)

      expect(useChatStore.getState().isOpen).toBe(true)
    })
  })

  describe('clearMessages', () => {
    it('メッセージをクリアできる', () => {
      const store = useChatStore.getState()

      store.addMessage({ role: 'user', content: 'メッセージ1' })
      store.addMessage({ role: 'user', content: 'メッセージ2' })

      expect(useChatStore.getState().messages).toHaveLength(2)

      store.clearMessages()

      expect(useChatStore.getState().messages).toHaveLength(0)
    })
  })

  describe('セレクターフック', () => {
    it('useMessagesでメッセージ一覧を取得できる', () => {
      const store = useChatStore.getState()

      store.addMessage({ role: 'user', content: 'テスト' })

      const messages = useMessages()
      expect(messages).toHaveLength(1)
    })

    it('useIsSendingで送信状態を取得できる', () => {
      const store = useChatStore.getState()

      store.setSending(true)

      const isSending = useIsSending()
      expect(isSending).toBe(true)
    })

    it('useIsChatOpenで開閉状態を取得できる', () => {
      const store = useChatStore.getState()

      store.setOpen(false)

      const isOpen = useIsChatOpen()
      expect(isOpen).toBe(false)
    })
  })
})
