/**
 * Content Projection Layer - Type Definitions
 */

// プレビューモード
export type PreviewMode = 'preview' | 'edit'

// 編集可能な要素の型
export type EditableElementType =
  | 'text'
  | 'heading'
  | 'paragraph'
  | 'link'
  | 'image'
  | 'button'
  | 'list'
  | 'listitem'

// A11Y準拠の要素情報
export interface A11yElementInfo {
  id: string // data-cpl-id（ref参照用）
  role: string // ARIA role
  content: string // 実際のコンテンツ
  label?: string // aria-label（AI用の意味情報）
  level?: number // 見出しレベルなど
  editable: boolean // 編集可能か
  context?: {
    section?: string // 属するセクション
    position?: string // 配置位置
  }
}

// 編集操作
export interface EditOperation {
  elementId: string
  type: 'update' | 'insert' | 'delete'
  oldValue?: string
  newValue: string
  timestamp: number
}

// AIリクエスト
export interface AIEditRequest {
  selectedElement: A11yElementInfo
  userIntent: string
  pageContext?: {
    pageType?: string
    targetAudience?: string
    tone?: string
  }
}

// AIレスポンス
export interface AIEditResponse {
  elementId: string
  newContent: string
  reason?: string
  confidence?: number
}

// 編集プレビュー
export interface EditPreview {
  elementId: string
  originalContent: string
  previewContent: string
  timestamp: number
  status: 'pending' | 'approved' | 'rejected'
}
