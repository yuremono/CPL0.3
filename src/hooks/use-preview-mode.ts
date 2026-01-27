'use client'

import { useSearchParams } from 'next/navigation'
import type { PreviewMode } from '@/lib/content-projection/types'

/**
 * プレビューモードを管理するフック
 */
export function usePreviewMode() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') as PreviewMode | null

  return {
    isPreviewMode: mode === 'preview',
    mode: mode || 'preview',
  }
}

/**
 * プレビューモードのURLを生成
 */
export function buildPreviewUrl(baseUrl: string, mode: PreviewMode = 'preview'): string {
  const url = new URL(baseUrl)
  url.searchParams.set('mode', mode)
  return url.toString()
}
