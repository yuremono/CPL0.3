/**
 * Chat Toggle Button Component
 *
 * チャットサイドバーを開閉するための固定ボタン。
 * 右下に配置され、チャットの開閉状態に応じてアイコンが変化する。
 */

import { useIsChatOpen, useChatStore } from '@/stores/chat-store'
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline'

/**
 * チャット開閉ボタン
 */
export function ChatToggleButton() {
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
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        w-14 h-14
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
        <XMarkIcon className="w-7 h-7" aria-hidden="true" />
      ) : (
        <ChatBubbleLeftRightIcon className="w-7 h-7" aria-hidden="true" />
      )}
    </button>
  )
}
