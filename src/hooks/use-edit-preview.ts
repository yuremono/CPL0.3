/**
 * Edit Preview Hook
 *
 * 編集プレビュー状態を管理するカスタムフック。
 */

import { useState, useCallback } from 'react'
import type { EditPreview } from '@/lib/content-projection/types'

export function useEditPreview() {
  const [previews, setPreviews] = useState<Map<string, EditPreview>>(new Map())

  /**
   * プレビューを作成
   */
  const createPreview = useCallback(
    (elementId: string, originalContent: string, previewContent: string) => {
      const preview: EditPreview = {
        elementId,
        originalContent,
        previewContent,
        timestamp: Date.now(),
        status: 'pending',
      }
      setPreviews((prev) => new Map(prev).set(elementId, preview))
      return preview
    },
    []
  )

  /**
   * プレビューを承認
   */
  const approvePreview = useCallback((elementId: string) => {
    setPreviews((prev) => {
      const preview = prev.get(elementId)
      if (preview) {
        const updated = { ...preview, status: 'approved' as const }
        return new Map(prev).set(elementId, updated)
      }
      return prev
    })
  }, [])

  /**
   * プレビューを拒否
   */
  const rejectPreview = useCallback((elementId: string) => {
    setPreviews((prev) => {
      const preview = prev.get(elementId)
      if (preview) {
        const updated = { ...preview, status: 'rejected' as const }
        return new Map(prev).set(elementId, updated)
      }
      return prev
    })
  }, [])

  /**
   * プレビューをクリア
   */
  const clearPreview = useCallback((elementId: string) => {
    setPreviews((prev) => {
      const next = new Map(prev)
      next.delete(elementId)
      return next
    })
  }, [])

  /**
   * すべてのプレビューをクリア
   */
  const clearAllPreviews = useCallback(() => {
    setPreviews(new Map())
  }, [])

  return {
    previews,
    createPreview,
    approvePreview,
    rejectPreview,
    clearPreview,
    clearAllPreviews,
    getPreview: (elementId: string) => previews.get(elementId),
  }
}
