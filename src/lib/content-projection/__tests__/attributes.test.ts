/**
 * attributes.ts のテスト
 */

import { describe, it, expect } from 'vitest'
import { generateA11yAttributes, type GenerateAttributesOptions } from '../attributes'

describe('generateA11yAttributes', () => {
  it('基本的なa11y属性を生成する', () => {
    const options: GenerateAttributesOptions = {
      id: 'blk_test123',
      type: 'heading',
      content: 'Test Heading',
    }

    const result = generateA11yAttributes(options)

    expect(result).toEqual({
      'data-cpl-id': 'blk_test123',
      'data-cpl-type': 'heading',
      'data-cpl-editable': 'true',
      'role': 'heading',
      'aria-label': '',
    })
  })

  it('heading型の要素にlevel属性を含める', () => {
    const options: GenerateAttributesOptions = {
      id: 'blk_heading1',
      type: 'heading',
      content: 'Main Title',
      level: 2,
      label: 'メインタイトル',
    }

    const result = generateA11yAttributes(options)

    expect(result['aria-level']).toBe('2')
    expect(result['role']).toBe('heading')
    expect(result['aria-label']).toBe('メインタイトル')
  })

  it('image型の要素にはimgロールを設定', () => {
    const options: GenerateAttributesOptions = {
      id: 'blk_image1',
      type: 'image',
      content: 'photo.jpg',
      label: 'サムネイル画像',
    }

    const result = generateA11yAttributes(options)

    expect(result['role']).toBe('img')
    expect(result['aria-label']).toBe('サムネイル画像')
  })

  it('link型の要素にはlinkロールを設定', () => {
    const options: GenerateAttributesOptions = {
      id: 'blk_link1',
      type: 'link',
      content: 'Click here',
      label: '詳細ページへのリンク',
    }

    const result = generateA11yAttributes(options)

    expect(result['role']).toBe('link')
    expect(result['aria-label']).toBe('詳細ページへのリンク')
  })

  it('text型の要素にはtextロールを設定', () => {
    const options: GenerateAttributesOptions = {
      id: 'blk_text1',
      type: 'text',
      content: 'Some text content',
    }

    const result = generateA11yAttributes(options)

    expect(result['role']).toBe('text')
  })

  it('editableがfalseの場合はdata-cpl-editableがfalse', () => {
    const options: GenerateAttributesOptions = {
      id: 'blk_static',
      type: 'text',
      content: 'Static content',
      editable: false,
    }

    const result = generateA11yAttributes(options)

    expect(result['data-cpl-editable']).toBe('false')
  })

  it('sectionを指定するとaria-labelに含める', () => {
    const options: GenerateAttributesOptions = {
      id: 'blk_hero',
      type: 'heading',
      content: 'Hero Title',
      section: 'hero',
    }

    const result = generateA11yAttributes(options)

    expect(result['data-cpl-section']).toBe('hero')
  })

  it('labelとsectionが両方ある場合は両方反映', () => {
    const options: GenerateAttributesOptions = {
      id: 'blk_nav',
      type: 'link',
      content: 'Home',
      label: 'ホームへ',
      section: 'navigation',
    }

    const result = generateA11yAttributes(options)

    expect(result['aria-label']).toBe('ホームへ')
    expect(result['data-cpl-section']).toBe('navigation')
  })
})
