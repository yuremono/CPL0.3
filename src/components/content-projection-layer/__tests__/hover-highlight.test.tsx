/**
 * hover-highlight.test.tsx
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HoverHighlight } from '../HoverHighlight'

describe('HoverHighlight', () => {
  it('子要素をレンダリングする', () => {
    render(
      <HoverHighlight>
        <div>Test Content</div>
      </HoverHighlight>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('isHoveredがtrueのときハイライトクラスが付く', () => {
    const { container } = render(
      <HoverHighlight isHovered>
        <div>Test Content</div>
      </HoverHighlight>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.classList.contains('hover-highlight')).toBe(true)
  })

  it('isHoveredがfalseのときハイライトクラスが付かない', () => {
    const { container } = render(
      <HoverHighlight isHovered={false}>
        <div>Test Content</div>
      </HoverHighlight>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.classList.contains('hover-highlight')).toBe(false)
  })

  it('isSelectedがtrueのとき選択クラスが付く', () => {
    const { container } = render(
      <HoverHighlight isSelected>
        <div>Test Content</div>
      </HoverHighlight>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.classList.contains('selected')).toBe(true)
  })

  it('isHoveredとisSelectedが両方trueのとき両方のクラスが付く', () => {
    const { container } = render(
      <HoverHighlight isHovered isSelected>
        <div>Test Content</div>
      </HoverHighlight>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.classList.contains('hover-highlight')).toBe(true)
    expect(wrapper?.classList.contains('selected')).toBe(true)
  })

  it('カスタムクラスをマージできる', () => {
    const { container } = render(
      <HoverHighlight className="custom-class">
        <div>Test Content</div>
      </HoverHighlight>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.classList.contains('custom-class')).toBe(true)
  })
})
