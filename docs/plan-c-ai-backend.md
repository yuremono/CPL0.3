# 作業C: バックエンド（AI連携）

## 概要
AIプロバイダーの抽象化とAPIルートを実装する。複数のAIプロバイダー（OpenAI/Anthropic/Google）に対応する。

## スコープ
- AIプロバイダーの抽象化レイヤー
- APIルート実装
- 各プロバイダーの実装
- エラーハンドリング

## 作成するファイル

```
src/
├── lib/ai/
│   ├── base-provider.ts              # プロバイダー基底クラス
│   ├── providers/
│   │   ├── openai.ts                 # OpenAIプロバイダー
│   │   ├── anthropic.ts              # Anthropicプロバイダー
│   │   └── google.ts                 # Googleプロバイダー
│   └── index.ts                      # ファクトリー・エクスポート
└── app/api/ai/
    └── edit/route.ts                 # 編集APIエンドポイント
```

## 実装タスク

### タスク1: プロバイダー基底クラス
**ファイル**: `src/lib/ai/base-provider.ts`

```typescript
export interface AIProvider {
  readonly id: string
  readonly name: string

  // 編集リクエストを処理
  editContent(request: AIEditRequest): Promise<AIEditResponse>

  // 利用可能かチェック
  isAvailable(): boolean
}

export interface AIEditRequest {
  selectedElement: A11yElementInfo
  userIntent: string
  pageContext?: PageContext
}

export interface AIEditResponse {
  elementId: string
  newContent: string
  reason?: string
  confidence?: number
}
```

### タスク2: OpenAIプロバイダー
**ファイル**: `src/lib/ai/providers/openai.ts`

```typescript
import OpenAI from 'openai'

export class OpenAIProvider implements AIProvider {
  readonly id = 'openai'
  readonly name = 'OpenAI'

  async editContent(request: AIEditRequest): Promise<AIEditResponse> {
    // OpenAI APIを呼び出す実装
  }
}
```

### タスク3: Anthropicプロバイダー
**ファイル**: `src/lib/ai/providers/anthropic.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk'

export class AnthropicProvider implements AIProvider {
  readonly id = 'anthropic'
  readonly name = 'Anthropic'

  async editContent(request: AIEditRequest): Promise<AIEditResponse> {
    // Anthropic APIを呼び出す実装
  }
}
```

### タスク4: Googleプロバイダー
**ファイル**: `src/lib/ai/providers/google.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

export class GoogleProvider implements AIProvider {
  readonly id = 'google'
  readonly name = 'Google AI'

  async editContent(request: AIEditRequest): Promise<AIEditResponse> {
    // Google APIを呼び出す実装
  }
}
```

### タスク5: APIルート
**ファイル**: `src/app/api/ai/edit/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createProvider } from '@/lib/ai'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const provider = createProvider(body.provider || 'anthropic')

  const response = await provider.editContent(body)

  return NextResponse.json(response)
}
```

## AIプロンプト設計

### システムプロンプト
```typescript
const SYSTEM_PROMPT = `あなたはWebコンテンツの編集アシスタントです。

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
```

## 依存関係
- **作業A** から `A11yElementInfo` 型を使用
- **作業D** の状態管理と連携（編集結果を保存）

## プロバイダー選択ロジック

```typescript
// src/lib/ai/index.ts
export function createProvider(providerId: string): AIProvider | null {
  const apiKey = process.env[`NEXT_PUBLIC_${providerId.toUpperCase()}_API_KEY`]

  if (!apiKey) {
    console.warn(`${providerId} API key not found`)
    return null
  }

  switch (providerId) {
    case 'openai':
      return new OpenAIProvider(apiKey)
    case 'anthropic':
      return new AnthropicProvider(apiKey)
    case 'google':
      return new GoogleProvider(apiKey)
    default:
      return null
  }
}
```

## 環境変数

```env
# .env.local
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_GOOGLE_API_KEY=...
```

## 必要なパッケージ

```bash
npm install openai @anthropic-ai/sdk @google/generative-ai
```

## 期待される成果物
- 複数のAIプロバイダーを切り替えて使用できる
- API経由でAI編集リクエストを処理できる
- エラーハンドリングが適切に行われる

## テスト項目
- [ ] OpenAIプロバイダーで編集できる
- [ ] Anthropicプロバイダーで編集できる
- [ ] Googleプロバイダーで編集できる
- [ ] APIキーがない場合に適切にエラー処理される
- [ ] 編集結果が正しく返される

## 完了条件
1. `base-provider.ts` が実装され、プロバイダーインターフェースが定義される
2. 3つのプロバイダー（OpenAI/Anthropic/Google）が実装される
3. `edit/route.ts` が実装され、APIが動作する
4. 作業A・Dと連携して、編集結果が正しく反映される

## 次のステップ
この作業が完了したら：
- 作業BのチャットUIからAPIを呼び出せる
- 作業Dの状態管理に編集結果を保存できる
