/**
 * 編集可能な画像要素のラッパー
 *
 * ドラッグ&ドロップとファイル選択で画像を置換
 */

'use client'

import { useState, useRef, type ReactElement } from 'react'
import { useImageReplacement, fileToDataURL } from '@/hooks/use-image-replacement'
import { usePreviewStore } from '@/stores/preview-store'
import { usePendingPreview } from '@/stores/chat-store'
import { cn } from '@/lib/utils'
import type { A11yElementInfo } from '@/lib/content-projection/types'
import { useElementRef } from '@/hooks/use-element-ref'

export interface EditableImageWrapperProps {
  element: A11yElementInfo
  isSelected?: boolean
  onSelect?: (element: A11yElementInfo) => void
  src: string
  alt: string
  className?: string
  children?: ReactElement<'img'>
  onOpenFileSelector?: () => void
}

/**
 * 編集可能な画像要素をラップするコンポーネント
 */
export function EditableImageWrapper({
  element,
  isSelected = false,
  onSelect,
  src,
  alt,
  className,
  children,
  onOpenFileSelector,
}: EditableImageWrapperProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isPreviewMode = usePreviewStore((state) => state.mode === 'preview')
  const updateContent = usePreviewStore((state) => state.updateContent)
  const dragHighlightTimer = useRef<NodeJS.Timeout | null>(null)

  // 編集内容を取得
  const editedContent = usePreviewStore((state) => state.edits[element.id])

  // プレビュー状態を取得
  const pendingPreview = usePendingPreview()
  const isPreviewing = pendingPreview?.elementId === element.id

  // 元のclassNameを取得（型アサーション）
  const originalClassName = (children as any)?.props?.className || ''

  // 短い参照IDを生成
  const ref = useElementRef(element.id)

  // 画像置換フック
  const {
    state,
    fileInputRef,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearPreview,
    clearError,
    openFileSelector: hookOpenFileSelector,
    handleFileSelect,
    confirmPreview,
    cancelPreview,
  } = useImageReplacement(element, async (file, elementId) => {
    // 画像をDataURLに変換
    const dataUrl = await fileToDataURL(file)

    // ストアに保存
    updateContent(elementId, dataUrl)
  })

  // 表示する画像URL: ローカルプレビュー > AIプレビュー > 編集済み > 元のsrc
  const displaySrc = state.previewMode && state.previewUrl
    ? state.previewUrl
    : (isPreviewing && pendingPreview?.previewContent
      ? pendingPreview.previewContent
      : (editedContent || src))

  // ファイル選択ボタンハンドラー
  const handleOpenFileSelector = () => {
    if (onOpenFileSelector) {
      onOpenFileSelector()
    } else {
      hookOpenFileSelector()
    }
  }

  // ドラッグエンターハンドラー（ドラッグ中は常時ハイライト表示）
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // タイマーをクリア
    if (dragHighlightTimer.current) {
      clearTimeout(dragHighlightTimer.current)
      dragHighlightTimer.current = null
    }
  }

  // ドラッグリーブ（要素から完全に離れた場合のみ解除）
  const handleDragLeaveWrapper = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // 子要素からのdragleaveを無視するための処理はフック内で行う
  }

  // ホバー時の薄いハイライト（プレビューモード時のみ）
  const showHoverHighlight = isPreviewMode && element.editable && isHovered && !isSelected && !state.previewMode

  // ドラッグ中のハイライト（ドラッグ中は常時表示）
  const showDragHighlight = isPreviewMode && element.editable && (state.dragOver || state.isDragging) && !state.previewMode

  // クリックハンドラー
  const handleClick = () => {
    if (isPreviewMode && onSelect && element.editable) {
      onSelect(element)
    }
  }

  // エラーのクリア
  const handleErrorClear = () => {
    clearError()
  }

  // マウスイベントハンドラー
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return (
    <div
      data-ref={ref}
      data-id={element.id}
      role={element.role}
      aria-label={element.label || alt}
      className={cn(
        'relative inline-block',
        className,
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        showHoverHighlight && 'ring-2 ring-yellow-300 ring-offset-2',
        showDragHighlight && 'ring-2 ring-yellow-500 ring-offset-2'
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragEnter={isPreviewMode && element.editable ? handleDragEnter : undefined}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={isPreviewMode && element.editable ? handleDragOver : undefined}
      onDragLeave={isPreviewMode && element.editable ? handleDragLeaveWrapper : undefined}
      onDrop={isPreviewMode && element.editable ? handleDrop : undefined}
      draggable={false}
    >
      <img
        src={displaySrc}
        alt={element.content || alt}
        className={cn(
          'w-full h-full object-cover',
          state.dragOver && 'opacity-50',
          originalClassName
        )}
      />

      {/* プレビューインジケーター */}
      {isPreviewing && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow-sm flex items-center gap-1">
          <span className="animate-pulse">●</span>
          プレビュー
        </div>
      )}

      {/* ドラッグオーバー時のオーバーレイ（色付きの幕） */}
      {showDragHighlight && (
        <div className="absolute inset-0 flex items-center justify-center bg-yellow-300/80 border-2 border-dashed border-yellow-600 rounded z-10">
          <p className="text-sm font-medium text-yellow-900 bg-white px-3 py-1 rounded shadow-sm">
            画像をドロップ
          </p>
        </div>
      )}

      {/* ファイル選択ボタン（プレビューモードかつホバー時） */}
      {showHoverHighlight && !state.previewMode && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleOpenFileSelector()
            }}
            className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded shadow-lg text-sm font-medium transition-colors"
            type="button"
          >
            画像を選択
          </button>
        </div>
      )}

      {/* プレビューモードのオーバーレイ */}
      {state.previewMode && state.previewUrl && (
        <div className="absolute inset-0 z-20">
          {/* プレビュー画像 */}
          <img
            src={state.previewUrl}
            alt="プレビュー"
            className="w-full h-full object-cover"
          />

          {/* プレビューモードの幕 */}
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4 p-4">
            <p className="text-white text-sm font-medium bg-black/70 px-3 py-1 rounded">
              画像を置換します
            </p>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  confirmPreview()
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                type="button"
              >
                OK
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  cancelPreview()
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium transition-colors"
                type="button"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* エラーメッセージ */}
      {state.error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-2">
          <div className="flex items-center justify-between gap-2">
            <span>{state.error}</span>
            <button
              onClick={handleErrorClear}
              className="underline hover:no-underline"
              type="button"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* 選択インジケーター */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
          選択中
        </div>
      )}

      {/* 隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="画像ファイルを選択"
      />
    </div>
  )
}
