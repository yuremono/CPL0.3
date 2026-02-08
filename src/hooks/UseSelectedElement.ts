/**
 * useSelectedElement Hook
 *
 * 選択中の要素を取得・操作するためのフック。
 */

import { usePreviewStore } from '@/stores/preview-store'
import type { A11yElementInfo } from '@/lib/content-projection/types'

/**
 * 選択中の要素を取得・操作するフック
 *
 * @returns 選択要素と操作関数
 */
export function useSelectedElement() {
  const selectedElement = usePreviewStore((state) => state.selectedElement)
  const selectElement = usePreviewStore((state) => state.selectElement)
  const mode = usePreviewStore((state) => state.mode)

  /**
   * 要素を選択
   */
  const handleSelect = (element: A11yElementInfo | null) => {
    selectElement(element)
  }

  /**
   * 選択を解除
   */
  const handleDeselect = () => {
    selectElement(null)
  }

  /**
   * 指定したIDの要素が選択されているかどうか
   */
  const isSelected = (elementId: string): boolean => {
    return selectedElement?.id === elementId
  }

  return {
    selectedElement,
    selectElement: handleSelect,
    deselectElement: handleDeselect,
    isSelected,
    isEditMode: mode === 'edit',
  }
}

/**
 * 要素を選択可能かどうかを判定するフック
 */
export function useElementSelectable() {
  const mode = usePreviewStore((state) => state.mode)

  /**
   * 指定した要素が選択可能かどうか
   */
  const isSelectable = (element: A11yElementInfo): boolean => {
    return mode === 'edit' && element.editable !== false
  }

  return {
    isSelectable,
    isEditMode: mode === 'edit',
  }
}
