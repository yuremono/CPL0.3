/**
 * Chat Sidebar Component
 *
 * チャットサイドバーメインコンポーネント。
 * プレビューモード時のみ表示される。
 * 左端のドラッグハンドルで幅を変更可能。
 */

import { type ReactNode, useRef, useState, useCallback } from 'react'
import { usePreviewMode } from '@/stores/preview-store'
import { useIsChatOpen, useChatStore, useSidebarWidth } from '@/stores/chat-store'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ChatSidebarProps {
  children: ReactNode
}

const MIN_WIDTH = 320
const MAX_WIDTH_RATIO = 0.5

export function ChatSidebar({ children }: ChatSidebarProps) {
  const mode = usePreviewMode()
  const isOpen = useIsChatOpen()
  const sidebarWidth = useSidebarWidth()
  const setOpen = useChatStore((state) => state.setOpen)
  const setSidebarWidth = useChatStore((state) => state.setSidebarWidth)

  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // プレビューモードでない場合は表示しない
  if (mode !== 'preview') {
    return null
  }

  /**
   * リサイズ開始
   */
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)

    const startX = e.clientX
    const startWidth = sidebarWidth

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX
      const newWidth = startWidth + deltaX
      const maxWidth = window.innerWidth * MAX_WIDTH_RATIO
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(newWidth, maxWidth))
      setSidebarWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [sidebarWidth, setSidebarWidth])

  return (
    <>
      {/* サイドバー */}
      <aside
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className={`
          fixed right-0 top-0 h-full
          bg-white/95 backdrop-blur-md
          border-l-2 border-black
          shadow-[4px_0_0_0_#0A0A0A]
          z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-label="AIアシスタントチャット"
      >
        {/* ドラッグハンドル */}
        {isOpen && (
          <div
            onMouseDown={handleResizeStart}
            className={`
              absolute left-0 top-0 bottom-0 w-1
              bg-black hover:bg-gray-700
              cursor-col-resize
              transition-colors
              group
              ${isResizing ? 'bg-gray-700' : ''}
            `}
            aria-label="サイドバーの幅を調整"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
                <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
              </div>
            </div>
          </div>
        )}

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
