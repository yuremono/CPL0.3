'use client'

/**
 * プレビューモードを管理するプロバイダー
 */

import { createContext, useContext, type ReactNode } from 'react'

/**
 * プレビューコンテキストの値
 */
export interface PreviewContextValue {
  isPreviewMode: boolean
}

/**
 * デフォルトのプレビューコンテキスト値
 */
const DEFAULT_CONTEXT: PreviewContextValue = {
  isPreviewMode: false,
}

/**
 * プレビューコンテキスト
 */
const PreviewContext = createContext<PreviewContextValue | null>(null)

/**
 * プレビュープロバイダーのプロパティ
 */
export interface PreviewProviderProps {
  children: ReactNode
  isPreviewMode?: boolean
}

/**
 * プレビューモードを管理するプロバイダー
 */
export function PreviewProvider({ children, isPreviewMode = false }: PreviewProviderProps) {
  const value: PreviewContextValue = {
    isPreviewMode,
  }

  return <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
}

/**
 * プレビューコンテキストを使用するフック
 * @throws PreviewProvider外で使用した場合にエラー
 */
export function usePreviewContext(): PreviewContextValue {
  const context = useContext(PreviewContext)

  if (context === null) {
    throw new Error('usePreviewContext must be used within a PreviewProvider')
  }

  return context
}
