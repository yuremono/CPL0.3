'use client'

/**
 * 編集可能な要素をラップするコンポーネント
 */

import React, { useState, isValidElement, cloneElement, Fragment, type ReactNode, type MouseEvent, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { A11yElementInfo } from '@/lib/content-projection/types'
import { useEditContent, useIsEditing, usePreviewStore } from '@/stores/preview-store'
import { useChatStore, usePendingPreview } from '@/stores/chat-store'
import { useElementRef } from '@/hooks/use-element-ref'

/**
 * EditableWrapperのプロパティ
 */
export interface EditableWrapperProps {
  children: ReactNode
  element: A11yElementInfo
  isSelected?: boolean
  onSelect?: (element: A11yElementInfo) => void
  onEditStart?: (element: A11yElementInfo) => void
  className?: string
}

/**
 * テキストコンテンツを抽出する
 */
function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string') {
    return node
  }
  if (typeof node === 'number') {
    return String(node)
  }
  if (node === null || node === undefined || typeof node === 'boolean') {
    return ''
  }
  if (isValidElement(node)) {
    const element = node as React.ReactElement<any>
    if (element.props.children) {
      return extractTextContent(element.props.children)
    }
    return ''
  }
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('')
  }
  return ''
}

/**
 * 編集可能な要素をラップするコンポーネント
 * - a11y属性を付与
 * - ダブルクリックで直接編集モード
 * - ホバーでハイライト
 * - クリックで選択
 * - 編集内容を動的に反映
 */
export function EditableWrapper({
  children,
  element,
  isSelected = false,
  onSelect,
  onEditStart,
  className,
}: EditableWrapperProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [editValue, setEditValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isEditing = useIsEditing(element.id)
  const updateContent = usePreviewStore((state) => state.updateContent)
  const stopEditing = usePreviewStore((state) => state.stopEditing)
  const setOpen = useChatStore((state) => state.setOpen)

  // 編集内容を取得（AI編集後に更新される）
  const editedContent = useEditContent(element.id)

  // プレビュー状態を取得
  const pendingPreview = usePendingPreview()
  const isPreviewing = pendingPreview?.elementId === element.id

  // 短い参照IDを生成
  const ref = useElementRef(element.id)

  // 編集モード開始時にテキストを抽出
  useEffect(() => {
    if (isEditing) {
      const text = editedContent || extractTextContent(children)
      setEditValue(text)
      // テキストエリアにフォーカス
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 0)
    }
  }, [isEditing, editedContent, children])

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    // 編集中はクリックを無視
    if (isEditing) {
      e.stopPropagation()
      return
    }
    e.stopPropagation()
    onSelect?.(element)
  }

  const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!element.editable) return

    console.log('[EditableWrapper] Double click detected:', { id: element.id, editable: element.editable })

    // 編集モードを開始
    const startEditing = usePreviewStore.getState().startEditing
    startEditing(element.id)

    // チャットウィンドウを開く
    setOpen(true)

    onEditStart?.(element)
  }

  const handleSave = () => {
    if (editValue.trim()) {
      updateContent(element.id, editValue)
    }
    stopEditing()
  }

  const handleCancel = () => {
    stopEditing()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave()
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const wrapperClassName = cn(
    'transition-colors duration-150 rounded relative',
    {
      'hover-highlight': isHovered && element.editable && !isEditing,
      'selected': isSelected && !isEditing,
      'cursor-pointer': element.editable && !isEditing,
      'cursor-default': isEditing,
    },
    className
  )

  // 編集内容がある場合はchildrenを置換
  // プレビュー状態の場合はプレビュー内容を優先表示
  const displayContent = isPreviewing && pendingPreview?.previewContent
    ? pendingPreview.previewContent
    : (editedContent ?? extractTextContent(children))

  const displayChildren = !isEditing && (isPreviewing || editedContent)
    ? replaceTextContent(children, displayContent)
    : children

  return (
    <div
      data-ref={ref}
      data-id={element.id}
      data-cpl-editable={element.editable ? 'true' : 'false'}
      role={element.role}
      aria-label={element.label || element.content}
      aria-level={element.level}
      className={wrapperClassName}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isEditing ? (
        // 編集モードUI
        <div
          data-testid="edit-mode-overlay"
          className="relative w-full"
        >
          <textarea
            ref={textareaRef}
            data-testid="edit-textarea"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[80px] p-3 border-2 border-black rounded-md bg-white text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="テキストを編集..."
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              data-testid="edit-save-button"
              onClick={handleSave}
              disabled={!editValue.trim()}
              className={cn(
                'px-4 py-2 rounded-md font-medium text-sm transition-colors',
                'bg-accent text-white hover:bg-accent/90',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              保存
            </button>
            <button
              type="button"
              data-testid="edit-cancel-button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-md font-medium text-sm border-2 border-black text-gray-700 hover:bg-gray-100 transition-colors"
            >
              キャンセル
            </button>
            <span className="text-xs text-gray-500 ml-auto">
              Ctrl+Enterで保存 / Escでキャンセル
            </span>
          </div>
        </div>
      ) : (
        displayChildren
      )}
    </div>
  )
}

/**
 * 子要素のテキストコンテンツを置換する
 * 元の要素のprops（classNameなど）を保持しつつ、テキストのみを置換
 *
 * 重要: 配列内のテキスト要素に対して、newContentの対応する行を適用する
 */
function replaceTextContent(node: ReactNode, newContent: string): ReactNode {
  // 文字列・数値の場合は置換（改行を保持）
  if (typeof node === 'string') {
    // 改行コードを<br/>に変換して返す
    const lines = newContent.split('\n')
    if (lines.length === 1) {
      return lines[0]
    }
    return lines.map((line, index) => (
      <Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </Fragment>
    ))
  }

  if (typeof node === 'number') {
    return newContent
  }

  // null/undefined/booleanの場合はそのまま返す
  if (node === null || node === undefined || typeof node === 'boolean') {
    return node
  }

  // React要素の場合は再帰的に処理
  if (isValidElement(node)) {
    const element = node as React.ReactElement<any>
    const type = element.type

    // <br/>要素は保持
    if (type === 'br') {
      return element
    }

    // childrenがある場合は再帰的に置換
    if (element.props.children !== undefined) {
      const newChildren = replaceTextContent(element.props.children, newContent)
      return cloneElement(element, { children: newChildren })
    }
    return element
  }

  // 配列の場合: テキストノードを抽出し、newContentの行を対応させる
  if (Array.isArray(node)) {
    // テキストノードのインデックスを収集
    const textIndices: number[] = []
    node.forEach((child, index) => {
      if (typeof child === 'string' || typeof child === 'number') {
        textIndices.push(index)
      }
    })

    // テキストノードがない場合、全体をnewContentで置換
    if (textIndices.length === 0) {
      const lines = newContent.split('\n')
      if (lines.length === 1) {
        return lines[0]
      }
      return lines.flatMap((line, index) => [
        line,
        index < lines.length - 1 ? <br key={index} /> : null,
      ]).filter(Boolean)
    }

    // テキストノードが1つだけの場合、そのノードをnewContentで置換
    if (textIndices.length === 1) {
      return node.map((child, index) => {
        if (index === textIndices[0]) {
          const lines = newContent.split('\n')
          if (lines.length === 1) {
            return lines[0]
          }
          return lines.flatMap((line, lineIndex) => [
            line,
            lineIndex < lines.length - 1 ? <br key={lineIndex} /> : null,
          ]).filter(Boolean)
        }
        return child
      })
    }

    // 複数のテキストノードがある場合、newContentの行を対応させる
    const lines = newContent.split('\n')
    return node.map((child, index) => {
      const textIndex = textIndices.indexOf(index)
      if (textIndex !== -1 && textIndex < lines.length) {
        return lines[textIndex]
      }
      return child
    })
  }

  return node
}
