/**
 * preview-provider.test.tsx
 */

import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { PreviewProvider, usePreviewContext } from '../preview-provider'

describe('PreviewProvider', () => {
  it('プレビューモードの状態を提供する', () => {
    const { result } = renderHook(() => usePreviewContext(), {
      wrapper: ({ children }) => (
        <PreviewProvider isPreviewMode={true}>
          {children}
        </PreviewProvider>
      ),
    })

    expect(result.current.isPreviewMode).toBe(true)
  })

  it('デフォルト値はfalse', () => {
    const { result } = renderHook(() => usePreviewContext(), {
      wrapper: ({ children }) => (
        <PreviewProvider isPreviewMode={false}>
          {children}
        </PreviewProvider>
      ),
    })

    expect(result.current.isPreviewMode).toBe(false)
  })

  it('コンテキスト外でusePreviewContextを呼ぶとエラー', () => {
    // エラーメッセージを監視
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => usePreviewContext())
    }).toThrow('usePreviewContext must be used within a PreviewProvider')

    consoleSpy.mockRestore()
  })
})
