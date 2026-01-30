/**
 * a11y準拠の属性生成ユーティリティ
 */

import type { EditableElementType } from './types'

/**
 * a11y属性生成のオプション
 */
export interface GenerateAttributesOptions {
  id: string
  type: EditableElementType
  content: string
  label?: string
  level?: number
  section?: string
  editable?: boolean
}

/**
 * 要素型からARIAロールへのマッピング
 */
const TYPE_TO_ROLE: Record<EditableElementType, string> = {
  text: 'text',
  heading: 'heading',
  paragraph: 'paragraph',
  link: 'link',
  image: 'img',
  button: 'button',
  list: 'list',
  listitem: 'listitem',
}

/**
 * a11y準拠の属性を生成する
 * @param options 属性生成オプション
 * @returns a11y属性オブジェクト（Reactのpropsに使用可能）
 */
export function generateA11yAttributes(options: GenerateAttributesOptions): Record<string, string> {
  const { id, type, content, label = '', level, section, editable = true } = options

  const attributes: Record<string, string> = {
    'data-cpl-id': id,
    'data-cpl-type': type,
    'data-cpl-editable': String(editable),
    'role': TYPE_TO_ROLE[type] || 'text',
    'aria-label': label,
  }

  // 見出しレベル
  if (level !== undefined) {
    attributes['aria-level'] = String(level)
  }

  // セクション情報
  if (section) {
    attributes['data-cpl-section'] = section
  }

  return attributes
}

/**
 * a11y属性から要素情報を抽出する
 * @param element DOM要素
 * @returns A11yElementInfo または null
 */
export function extractA11yInfo(element: HTMLElement): Record<string, string> | null {
  const id = element.getAttribute('data-cpl-id')
  if (!id) {
    return null
  }

  return {
    'data-cpl-id': id,
    'data-cpl-type': element.getAttribute('data-cpl-type') || 'text',
    'data-cpl-editable': element.getAttribute('data-cpl-editable') || 'true',
    'role': element.getAttribute('role') || '',
    'aria-label': element.getAttribute('aria-label') || '',
    'aria-level': element.getAttribute('aria-level') || '',
    'data-cpl-section': element.getAttribute('data-cpl-section') || '',
  }
}
