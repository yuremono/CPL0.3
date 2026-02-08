/**
 * Message Input Component
 *
 * メッセージ入力フォームコンポーネント。
 */

import { useState, KeyboardEvent, FormEvent } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

export interface MessageInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [input, setInput] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enterで送信、Shift+Enterで改行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const trimmed = input.trim()
    if (!trimmed || disabled) {
      return
    }

    onSend(trimmed)
    setInput('')
  }

  return (
    <div className="p-4 border-t-2 border-black">
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="AIに編集を依頼..."
          disabled={disabled}
          rows={3}
          className={`
            w-full px-3 py-2
            border-2 border-black
            bg-white
            resize-none
            focus:outline-none focus:ring-2 focus:ring-accent
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder:text-gray-400
          `}
          aria-label="メッセージ入力"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <p>Enterで送信、Shift+Enterで改行</p>
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className={`
              px-4 py-2
              border-2 border-black
              bg-accent text-white
              font-semibold
              shadow-[2px_2px_0_0_#0A0A0A]
              hover:bg-accent-dark
              active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            aria-label="メッセージを送信"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  )
}
