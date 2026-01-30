'use client'

/**
 * 編集可能な要素をラップするコンポーネント
 */

import { useState, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import type { A11yElementInfo } from '@/lib/content-projection/types'

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
      {children}
    </div>
  )
}
