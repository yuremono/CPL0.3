/**
 * Chat Toggle Button Component
 *
 * チャットサイドバーを開閉するための固定ボタン。
 * 右上に配置され、チャットの開閉状態に応じてアイコンが変化する。
 *
 * NOTE: 常に編集モードで使用するため、モード切り替え機能は削除
 */

"use client";

import { useIsChatOpen, useChatStore } from "@/stores/chat-store";
import { ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * チャット開閉ボタン
 */

/**
 * チャット開閉ボタン
 */
export function ChatToggleButton() {
	const isOpen = useIsChatOpen();
	const setOpen = useChatStore((state) => state.setOpen);

	const handleToggle = () => {
		setOpen(!isOpen);
	};

	return (
		<div className="fixed top-0 right-0 z-50">
			{/* チャット開閉ボタン */}
			<button
				data-id="chat-toggle-button"
				type="button"
				onClick={handleToggle}
				className={`w-[var(--header-height)] h-[var(--header-height)]
          flex items-center justify-center
          border-2 border-black
          bg-accent text-white
          hover:shadow-[2px_2px_0_0_#0A0A0A]
          hover:translate-x-[2px] hover:translate-y-[2px]
          active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
          transition-all duration-150
          
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
        `}
				aria-label={isOpen ? "チャットを閉じる" : "チャットを開く"}
				aria-expanded={isOpen}
			>
				{isOpen ? (
					<XMarkIcon className="w-7 h-7" aria-hidden="true" />
				) : (
					<ChatBubbleLeftRightIcon className="w-7 h-7" aria-hidden="true" />
				)}
			</button>
		</div>
	);
}
