'use client'

/**
 * 編集可能な要素をラップするコンポーネント
 */

import { useState, isValidElement, cloneElement, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import type { A11yElementInfo } from '@/lib/content-projection/types'
import { useEditContent } from '@/stores/preview-store'

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

  // 編集内容を取得（AI編集後に更新される）
  const editedContent = useEditContent(element.id)

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    onSelect?.(element)
  }

  const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (element.editable && onEditStart) {
      onEditStart(element)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const wrapperClassName = cn(
    'transition-colors duration-150 rounded',
    {
      'hover-highlight': isHovered && element.editable,
      'selected': isSelected,
      'cursor-pointer': element.editable,
    },
    className
  )

  // 編集内容がある場合はchildrenを置換
  const displayChildren = editedContent
    ? replaceTextContent(children, editedContent)
    : children

  return (
    <div
      data-cpl-id={element.id}
      data-cpl-type={element.role}
      data-cpl-editable={String(element.editable)}
      role={element.role}
      aria-label={element.label || element.content}
      aria-level={element.level}
      className={wrapperClassName}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayChildren}
    </div>
  )
}

/**
 * 子要素のテキストコンテンツを置換する
 */
function replaceTextContent(node: ReactNode, newContent: string): ReactNode {
  // 文字列・数値の場合は置換
  if (typeof node === 'string' || typeof node === 'number') {
    return newContent
  }

  // null/undefined/booleanの場合はそのまま返す
  if (node === null || node === undefined || typeof node === 'boolean') {
    return node
  }

  // React要素の場合は再帰的に処理
  if (isValidElement(node)) {
    const element = node as React.ReactElement<any>
    // childrenがある場合は再帰的に置換
    if (element.props.children !== undefined) {
      return cloneElement(
        element,
        {},
        replaceTextContent(element.props.children, newContent)
      )
    }
    return element
  }

  // 配列の場合は各要素を再帰的に処理
  if (Array.isArray(node)) {
    return node.map((child, index) => {
      const replaced = replaceTextContent(child, newContent)
      // React要素の場合はkeyを付与
      if (isValidElement(replaced)) {
        return cloneElement(replaced, { key: index })
      }
      return replaced
    })
  }

  return node
}
