/**
 * 画像置換フック
 *
 * ドラッグ&ドロップで画像を置換するためのフック
 */

import { useCallback, useState } from 'react'
import type { A11yElementInfo } from '@/lib/content-projection/types'

export interface ImageReplacementState {
  isDragging: boolean
  dragOver: boolean
  previewUrl: string | null
  error: string | null
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

/**
 * 画像置換フック
 *
 * @param element 画像要素情報
 * @param onReplace 画像置換時のコールバック
 */
export function useImageReplacement(
  element: A11yElementInfo | null,
  onReplace?: (file: File, elementId: string) => Promise<void>
) {
  const [state, setState] = useState<ImageReplacementState>({
    isDragging: false,
    dragOver: false,
    previewUrl: null,
    error: null,
  })

  /**
   * ファイルのバリデーション
   */
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // サイズチェック
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `ファイルサイズは5MB以下にしてください（現在: ${(file.size / 1024 / 1024).toFixed(1)}MB）` }
    }

    // タイプチェック
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'JPEG、PNG、GIF、WebP形式のみ対応しています' }
    }

    return { valid: true }
  }, [])

  /**
   * ドラッグ開始
   */
  const handleDragStart = useCallback(() => {
    setState((prev) => ({ ...prev, isDragging: true, error: null }))
  }, [])

  /**
   * ドラッグ終了
   */
  const handleDragEnd = useCallback(() => {
    setState((prev) => ({ ...prev, isDragging: false, dragOver: false }))
  }, [])

  /**
   * ドラッグオーバー
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, dragOver: true }))
  }, [])

  /**
   * ドラッグリーブ
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, dragOver: false }))
  }, [])

  /**
   * ドロップ処理
   */
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setState((prev) => ({ ...prev, isDragging: false, dragOver: false }))

      if (!element) {
        setState((prev) => ({ ...prev, error: '要素が選択されていません' }))
        return
      }

      const files = e.dataTransfer.files
      if (files.length === 0) {
        return
      }

      const file = files[0]

      // バリデーション
      const validation = validateFile(file)
      if (!validation.valid) {
        setState((prev) => ({ ...prev, error: validation.error || '不明なエラー' }))
        return
      }

      // プレビュー表示
      const previewUrl = URL.createObjectURL(file)
      setState((prev) => ({ ...prev, previewUrl, error: null }))

      // 置換実行
      try {
        if (onReplace) {
          await onReplace(file, element.id)
        }
      } catch (error) {
        setState((prev) => ({ ...prev, error: '画像の置換に失敗しました' }))
        URL.revokeObjectURL(previewUrl)
      }
    },
    [element, onReplace, validateFile]
  )

  /**
   * プレビューのクリア
   */
  const clearPreview = useCallback(() => {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl)
    }
    setState({
      isDragging: false,
      dragOver: false,
      previewUrl: null,
      error: null,
    })
  }, [state.previewUrl])

  /**
   * エラーのクリア
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    state,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearPreview,
    clearError,
  }
}

/**
 * 画像ファイルをDataURLに変換
 */
export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'))
    reader.readAsDataURL(file)
  })
}
