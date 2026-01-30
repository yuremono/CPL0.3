/**
 * AI Provider Base Types and Interfaces
 */

import type { A11yElementInfo, AIEditRequest, AIEditResponse } from '@/lib/content-projection/types'

// AIプロバイダーのインターフェース
export interface AIProvider {
  readonly id: string
  readonly name: string

  // 編集リクエストを処理
  editContent(request: AIEditRequest): Promise<AIEditResponse>

  // 利用可能かチェック
  isAvailable(): boolean
}

// システムプロンプト
export const SYSTEM_PROMPT = `あなたはWebコンテンツの編集アシスタントです。

# ルール
- ユーザーの意図を理解し、適切にコンテンツを編集してください
- 元の構造と意味を維持してください
- 簡潔で分かりやすい表現を心がけてください
- 日本語で回答してください

# 出力形式
以下のJSON形式で回答してください：
{
  "elementId": "対象の要素ID",
  "newContent": "編集後のコンテンツ",
  "reason": "変更理由の説明",
  "confidence": 0.0-1.0
}`

// 型を再エクスポート（他のファイルから使いやすくするため）
export type { A11yElementInfo, AIEditRequest, AIEditResponse }
