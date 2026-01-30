/**
 * editable-wrapper.test.tsx
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EditableWrapper } from '../editable-wrapper'

// ストアのモック
vi.mock('@/stores/preview-store', () => ({
  useEditContent: vi.fn(() => undefined),
  useIsEditing: vi.fn(() => false),
  usePreviewStore: vi.fn(() => ({
    updateContent: vi.fn(),
    stopEditing: vi.fn(),
    startEditing: vi.fn(),
  })),
}))

vi.mock('@/stores/chat-store', () => ({
  useChatStore: vi.fn(() => ({
    setOpen: vi.fn(),
  })),
}))

describe('EditableWrapper', () => {
  const mockElement = {
    id: 'blk_test123',
    role: 'heading',
    content: 'Test Heading',
    editable: true,
  }

  it('子要素をレンダリングする', () => {
    render(
      <EditableWrapper element={mockElement}>
        <h1>Test Heading</h1>
      </EditableWrapper>
    )

    expect(screen.getByText('Test Heading')).toBeInTheDocument()
  })

  it('編集可能な場合はdata-cpl-editableがtrue', () => {
    const { container } = render(
      <EditableWrapper element={mockElement}>
        <h1>Test Heading</h1>
      </EditableWrapper>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.getAttribute('data-cpl-editable')).toBe('true')
  })

  it('編集不可能な場合はdata-cpl-editableがfalse', () => {
    const nonEditableElement = { ...mockElement, editable: false }
    const { container } = render(
      <EditableWrapper element={nonEditableElement}>
        <h1>Test Heading</h1>
      </EditableWrapper>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.getAttribute('data-cpl-editable')).toBe('false')
  })

  // ダブルクリックのテストはE2Eテストでカバーされているためスキップ
  // ユニットテストではストアのgetState()モックが複雑になるため、コールバックのみテスト

  it('クリックでonSelectが呼ばれる', () => {
    const onSelect = vi.fn()
    const { container } = render(
      <EditableWrapper element={mockElement} onSelect={onSelect}>
        <h1>Test Heading</h1>
      </EditableWrapper>
    )

    const wrapper = container.firstChild as HTMLElement
    fireEvent.click(wrapper!)

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('ホバー中はhover-highlightクラスが付く', () => {
    const { container } = render(
      <EditableWrapper element={mockElement}>
        <h1>Test Heading</h1>
      </EditableWrapper>
    )

    const wrapper = container.firstChild as HTMLElement

    // mouseEnterイベントを発火
    fireEvent.mouseEnter(wrapper!)

    // ホバークラスが付与されていることを確認
    expect(wrapper?.classList.contains('hover-highlight')).toBe(true)

    // mouseLeaveイベントを発火
    fireEvent.mouseLeave(wrapper!)

    // ホバークラスが削除されていることを確認
    expect(wrapper?.classList.contains('hover-highlight')).toBe(false)
  })

  it('選択中はselectedクラスが付く', () => {
    const { container } = render(
      <EditableWrapper element={mockElement} isSelected>
        <h1>Test Heading</h1>
      </EditableWrapper>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.classList.contains('selected')).toBe(true)
  })
})
