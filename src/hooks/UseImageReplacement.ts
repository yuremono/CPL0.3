/**
 * 画像置換フック
 *
 * ドラッグ&ドロップとファイル選択で画像を置換するためのフック
 * 自動で画像のリサイズと圧縮を行います。
 */

import { useCallback, useState, useRef } from 'react'
import type { A11yElementInfo } from '@/lib/content-projection/types'
import { getOptimizedImageDataUrl, formatFileSize } from '@/lib/image/ImageOptimizer'

export interface ImageReplacementState {
  isDragging: boolean
  dragOver: boolean
  previewUrl: string | null
  error: string | null
  previewMode: boolean
  selectedFile: File | null
  originalFileSize?: number
  optimizedFileSize?: number
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB（最適化前）
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']

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
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [state, setState] = useState<ImageReplacementState>({
    isDragging: false,
    dragOver: false,
    previewUrl: null,
    error: null,
    previewMode: false,
    selectedFile: null,
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
    // 子要素からのdragleaveを無視するため、relatedTargetをチェック
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    // 要素外に移動した場合のみドラッグオーバーを解除
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setState((prev) => ({ ...prev, dragOver: false }))
    }
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

      try {
        // 画像を最適化してDataURLを取得
        const optimizedDataUrl = await getOptimizedImageDataUrl(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.85,
          format: 'image/webp',
        })

        // プレビューモードに入る
        const previewUrl = URL.createObjectURL(file)
        setState((prev) => ({
          ...prev,
          previewUrl,
          previewMode: true,
          selectedFile: file,
          originalFileSize: file.size,
          optimizedFileSize: Math.round(optimizedDataUrl.length * 0.75), // DataURLの概算サイズ
          error: null,
        }))
      } catch (error) {
        setState((prev) => ({ ...prev, error: '画像の処理に失敗しました' }))
      }
    },
    [element, validateFile]
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
      previewMode: false,
      selectedFile: null,
    })
    // inputをリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [state.previewUrl])

  /**
   * エラーのクリア
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  /**
   * ファイル選択ダイアログを開く
   */
  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /**
   * ファイル選択ハンドラー
   */
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) {
        return
      }

      if (!element) {
        setState((prev) => ({ ...prev, error: '要素が選択されていません' }))
        return
      }

      const file = files[0]

      // バリデーション
      const validation = validateFile(file)
      if (!validation.valid) {
        setState((prev) => ({ ...prev, error: validation.error || '不明なエラー' }))
        // inputをリセット
        e.target.value = ''
        return
      }

      try {
        // 画像を最適化してDataURLを取得
        const optimizedDataUrl = await getOptimizedImageDataUrl(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.85,
          format: 'image/webp',
        })

        // プレビューモードに入る
        const previewUrl = URL.createObjectURL(file)
        setState((prev) => ({
          ...prev,
          previewUrl,
          previewMode: true,
          selectedFile: file,
          originalFileSize: file.size,
          optimizedFileSize: Math.round(optimizedDataUrl.length * 0.75),
          error: null,
        }))
      } catch (error) {
        setState((prev) => ({ ...prev, error: '画像の処理に失敗しました' }))
        e.target.value = ''
      }
    },
    [element, validateFile]
  )

  /**
   * プレビューを確定して置換を実行
   */
  const confirmPreview = useCallback(async () => {
    if (!state.selectedFile || !element) {
      return
    }

    try {
      // 画像を最適化してDataURLを取得
      const optimizedDataUrl = await getOptimizedImageDataUrl(state.selectedFile, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        format: 'image/webp',
      })

      // 最適化済みDataURLを保存
      if (onReplace) {
        // FileオブジェクトではなくDataURLを渡すように、コールバックの型を変更
        // ここではDataURLを直接保存する
        const previewStore = await import('@/stores/preview-store')
        previewStore.usePreviewStore.getState().updateContent(element.id, optimizedDataUrl)
      }
      // 置換成功後にプレビューをクリア
      clearPreview()
    } catch (error) {
      setState((prev) => ({ ...prev, error: '画像の処理に失敗しました' }))
    }
  }, [state.selectedFile, element, onReplace, clearPreview])

  /**
   * プレビューをキャンセル
   */
  const cancelPreview = useCallback(() => {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl)
    }
    setState((prev) => ({
      ...prev,
      previewMode: false,
      previewUrl: null,
      selectedFile: null,
      error: null,
    }))
    // inputをリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [state.previewUrl])

  return {
    state,
    fileInputRef,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearPreview,
    clearError,
    openFileSelector,
    handleFileSelect,
    confirmPreview,
    cancelPreview,
    formatFileSize,
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
