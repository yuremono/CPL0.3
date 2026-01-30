/**
 * Chat Sidebar Component
 *
 * チャットサイドバーメインコンポーネント。
 * プレビューモード時のみ表示される。
 */

import { type ReactNode } from 'react'
import { usePreviewMode } from '@/stores/preview-store'
import { useIsChatOpen, useChatStore } from '@/stores/chat-store'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ChatSidebarProps {
  children: ReactNode
}

export function ChatSidebar({ children }: ChatSidebarProps) {
  const mode = usePreviewMode()
  const isOpen = useIsChatOpen()
  const setOpen = useChatStore((state) => state.setOpen)

  // プレビューモードでない場合は表示しない
  if (mode !== 'preview') {
    return null
  }

  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* サイドバー */}
      <aside
        className={`
          fixed right-0 top-0 h-full w-80
          bg-white/95 backdrop-blur-md
          border-l-2 border-black
          shadow-[4px_0_0_0_#0A0A0A]
          z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-label="AIアシスタントチャット"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b-2 border-black">
          <h2 className="text-lg font-bold">AIアシスタント</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-black hover:text-white transition-colors"
            aria-label="チャットを閉じる"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-hidden flex flex-col h-[calc(100%-4rem)]">
          {children}
        </div>
      </aside>
    </>
  )
}
