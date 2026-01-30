/**
 * 編集可能な画像要素のラッパー
 *
 * ドラッグ&ドロップで画像を置換
 */

'use client'

import { type ReactElement } from 'react'
import { useImageReplacement, fileToDataURL } from '@/hooks/use-image-replacement'
import { usePreviewStore } from '@/stores/preview-store'
import { cn } from '@/lib/utils'
import type { A11yElementInfo } from '@/lib/content-projection/types'

export interface EditableImageWrapperProps {
  element: A11yElementInfo
  isSelected?: boolean
  onSelect?: (element: A11yElementInfo) => void
  src: string
  alt: string
  className?: string
  children?: ReactElement<'img'>
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
}: EditableImageWrapperProps) {
  const isPreviewMode = usePreviewStore((state) => state.mode === 'preview')
  const updateContent = usePreviewStore((state) => state.updateContent)

  // 編集内容を取得
  const editedContent = usePreviewStore((state) => state.edits[element.id])
  const currentSrc = editedContent || src

  // 元のclassNameを取得（型アサーション）
  const originalClassName = (children as any)?.props?.className || ''

  // 画像置換フック
  const { state, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop, clearPreview, clearError } =
    useImageReplacement(element, async (file, elementId) => {
      // 画像をDataURLに変換
      const dataUrl = await fileToDataURL(file)

      // ストアに保存
      updateContent(elementId, dataUrl)

      // プレビューをクリア
      clearPreview()
    })

  // ホバー時のハイライト
  const showHighlight = isPreviewMode && element.editable && (state.isDragging || state.dragOver)

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

  return (
    <div
      data-cpl-id={element.id}
      data-cpl-type="image"
      data-cpl-editable={element.editable ? 'true' : 'false'}
      role={element.role}
      aria-label={element.label || alt}
      className={cn(
        'relative inline-block',
        className,
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        showHighlight && 'ring-2 ring-yellow-400 ring-offset-2 bg-yellow-50'
      )}
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={isPreviewMode && element.editable ? handleDragOver : undefined}
      onDragLeave={isPreviewMode && element.editable ? handleDragLeave : undefined}
      onDrop={isPreviewMode && element.editable ? handleDrop : undefined}
      draggable={false}
    >
      <img
        src={currentSrc}
        alt={element.content || alt}
        className={cn(
          'w-full h-full object-cover',
          state.dragOver && 'opacity-50',
          originalClassName
        )}
      />

      {/* ドラッグオーバー時のオーバーレイ */}
      {showHighlight && (
        <div className="absolute inset-0 flex items-center justify-center bg-yellow-200/50 border-2 border-dashed border-yellow-600 rounded">
          <p className="text-sm font-medium text-yellow-800 bg-white px-3 py-1 rounded shadow-sm">
            画像をドロップ
          </p>
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
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          選択中
        </div>
      )}
    </div>
  )
}
