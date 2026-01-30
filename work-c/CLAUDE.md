# Work Unit C: AI Integration - Claude Settings

このファイルは作業C（AI連携実装）固有のルールと設定です。

## 作業の範囲と目的

AIプロバイダーの抽象化とAPIルートを実装します。複数のAIプロバイダー（OpenAI/Anthropic/Google）に対応します。

### 主な機能
- AIプロバイダーの抽象化レイヤー
- APIルート実装
- 各プロバイダーの実装
- エラーハンドリング

## 使用する型・インターフェース

```typescript
// src/lib/content-projection/types.ts（作業Aで作成）
export interface A11yElementInfo {
  id: string
  role: string
  content: string
  label?: string
  level?: number
  editable: boolean
  context?: {
    section?: string
    position?: string
  }
}

// AI編集リクエスト
export interface AIEditRequest {
  element: A11yElementInfo
  instruction: string
  context?: {
    surroundingContent?: string
    pageContext?: string
  }
}

// AI編集レスポンス
export interface AIEditResponse {
  content: string
  success: boolean
  error?: string
  provider?: string
}
```

## 依存する他の作業

- **作業A**: `A11yElementInfo`型を参照
- **作業D**: 状態管理と連携（統合待ち）

## 作業固有のルールや注意点

### プロバイダー選択の優先順位
1. 環境変数で指定されたプロバイダー
2. デフォルト: OpenAI

### エラーハンドリング
- プロバイダーAPIエラー: ユーザーに分かりやすいエラーメッセージ
- タイムアウト: リトライを試みるか、別のプロバイダーにフォールバック
- レート制限: プロバイダーのレート制限を尊重する

### セキュリティ
- APIキーは環境変数から取得
- ユーザー入力はバリデーション
- ログに出力しない（APIキー、機密情報）

### 不変性の維持
```typescript
// 良い例: 不変性の維持
const newContext = { ...context, additionalInfo }

// 悪い例: 直接変更
context.additionalInfo = value
```

## テストの実行方法

```bash
# AI関連のテスト
npx vitest run --project node src/lib/ai/__tests__/*.test.ts
```

## ビルドの確認方法

```bash
# ビルドを実行
npm run build

# 開発サーバーを起動
npm run dev
```

## 完了条件

1. `base-provider.ts` が実装され、プロバイダー基底クラスが定義されている
2. OpenAIプロバイダーが実装されている
3. Anthropicプロバイダーが実装されている
4. Googleプロバイダーが実装されている
5. `index.ts` が実装され、ファクトリー関数が提供されている
6. `/api/ai/edit` が実装され、AI編集APIが動作する
7. すべてのテストがパスする
8. ビルドが成功する

## 進捗報告

作業完了時または進捗がある場合は、`progress.md` を更新してください。

## マネージャーへの連絡

- 進捗報告: `work-c/progress.md` を更新
- ブロッカー発生: 即座に報告
- セキュリティ懸念点: security-reviewer エージェントを起動
- 質問がある: マネージャー（伝達役経由）に相談

## 作成したファイル

### Provider Files
- `src/lib/ai/base-provider.ts`
- `src/lib/ai/providers/openai.ts`
- `src/lib/ai/providers/anthropic.ts`
- `src/lib/ai/providers/google.ts`
- `src/lib/ai/index.ts`

### API Files
- `src/app/api/ai/edit/route.ts`

### Test Files
- `src/lib/ai/__tests__/base-provider.test.ts`
- `src/lib/ai/__tests__/providers.test.ts`
- `src/lib/ai/__tests__/index.test.ts`

## 実装完了時の状態

作業Cは完了済みです。
- 20テスト全てパス
- ビルド成功
- 複数のAIプロバイダーに対応
