/**
 * editable-wrapper.test.tsx
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EditableWrapper } from '../editable-wrapper'

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

  it('ダブルクリックでonEditStartが呼ばれる', () => {
    const onEditStart = vi.fn()
    const { container } = render(
      <EditableWrapper element={mockElement} onEditStart={onEditStart}>
        <h1>Test Heading</h1>
      </EditableWrapper>
    )

    const wrapper = container.firstChild as HTMLElement
    fireEvent.doubleClick(wrapper!)

    expect(onEditStart).toHaveBeenCalledTimes(1)
  })

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

  it('ホバー中はisHoveredクラスが付く', () => {
    const { container } = render(
      <EditableWrapper element={mockElement}>
        <h1>Test Heading</h1>
      </EditableWrapper>
    )

    const wrapper = container.firstChild as HTMLElement
    fireEvent.mouseEnter(wrapper!)

    expect(wrapper?.classList.contains('hover-highlight')).toBe(true)

    fireEvent.mouseLeave(wrapper!)
    expect(wrapper?.classList.contains('hover-highlight')).toBe(false)
  })

  it('選択中はisSelectedクラスが付く', () => {
    const { container } = render(
      <EditableWrapper element={mockElement} isSelected>
        <h1>Test Heading</h1>
      </EditableWrapper>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.classList.contains('selected')).toBe(true)
  })
})
