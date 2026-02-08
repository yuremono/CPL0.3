'use client'

/**
 * ホバー時のハイライトを制御するコンポーネント
 */

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * HoverHighlightのプロパティ
 */
export interface HoverHighlightProps {
  children: ReactNode
  isHovered?: boolean
  isSelected?: boolean
  className?: string
}

/**
 * ホバー時のハイライトを制御するコンポーネント
 * - ホバー時に背景色を変更
 * - 選択時に枠線を表示
 */
export function HoverHighlight({
  children,
  isHovered = false,
  isSelected = false,
  className,
}: HoverHighlightProps) {
  return (
    <span
      className={cn(
        'inline-block transition-all duration-150 rounded',
        {
          'hover-highlight': isHovered,
          'selected': isSelected,
        },
        className
      )}
    >
      {children}
    </span>
  )
}
