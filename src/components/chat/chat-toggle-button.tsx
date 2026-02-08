/**
 * Chat Toggle Button Component
 *
 * チャットサイドバーを開閉するためのボタン。
 * inHeaderプロップでheader内配置か固定配置かを切り替え。
 */

import { useIsChatOpen, useChatStore } from '@/stores/chat-store'
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ChatToggleButtonProps {
  inHeader?: boolean
}

/**
 * チャット開閉ボタン
 */
export function ChatToggleButton({ inHeader = false }: ChatToggleButtonProps) {
  const isOpen = useIsChatOpen()
  const setOpen = useChatStore((state) => state.setOpen)

  const handleToggle = () => {
    setOpen(!isOpen)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`
        ${inHeader ? 'relative' : 'fixed bottom-6 right-6'} z-50
        flex items-center justify-center
        w-10 h-10
        border-2 border-black
        bg-accent text-white
        shadow-[4px_4px_0_0_#0A0A0A]
        hover:shadow-[2px_2px_0_0_#0A0A0A]
        hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
        transition-all duration-150
        rounded-full
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
      `}
      aria-label={isOpen ? 'チャットを閉じる' : 'チャットを開く'}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <XMarkIcon className="w-5 h-5" aria-hidden="true" />
      ) : (
        <ChatBubbleLeftRightIcon className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  )
}
