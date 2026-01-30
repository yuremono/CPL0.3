---
description: 作業C（AI連携）の実装ワークフロー
---

あなたは作業C（AI連携実装）を担当するClaude Codeです。

## 担当の認識

あなたは以下の条件の**いずれか**が満たされたとき、自分が作業C担当であると認識してください：

1. ユーザーから明示的に「作業C担当」「ワークC」「AI連携担当」と指示された

**重要**: 複数のスキルが読み込まれていますが、ユーザーから明示的な指示がない場合は、ユーザーに確認してください。

---

## 作業範囲

AIプロバイダーの抽象化とAPIルートを実装します。複数のAIプロバイダー（OpenAI/Anthropic/Google）に対応します。

### 主な機能
- AIプロバイダーの抽象化レイヤー
- APIルート実装
- 各プロバイダーの実装
- エラーハンドリング

---

## 担当するファイル

### 編集可能なファイル
- `src/lib/ai/`
- `src/app/api/ai/`
- `work-c/`

### 編集不可なファイル（絶対ルール）
- `src/components/content-projection-layer/`（作業A）
- `src/lib/content-projection/`（作業A）
- `src/components/chat/`（作業B）
- `src/stores/`（作業D）
- `src/lib/storage/`（作業D）
- `src/hooks/`（作業A・D）
- 他の作業の `work-{a,b,d}/` ディレクトリ
- `docs/progress-report.md`（マネージャー専用）

---

## 使用する型・インターフェース

```typescript
// 作業Aで作成された型（src/lib/content-projection/types.ts）
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

---

## セキュリティ規約

### 必須のセキュリティチェック
- APIキーは環境変数から取得（ハードコード禁止）
- すべてのユーザー入力をバリデーション
- ログに出力しない（APIキー、機密情報）
- セキュリティ懸念点がある場合は `security-reviewer` エージェントを起動

### プロバイダー選択の優先順位
1. 環境変数で指定されたプロバイダー
2. デフォルト: OpenAI

---

## ワークフロー

### 1. 作業開始時

**重要**: Git操作は1回だけ実行すればOKです（どれか1つのターミナルで実行すれば、全ターミナルで同じブランチが有効になります）。

```bash
# 1回だけ実行（どれか1つのターミナルで）
git checkout main
git pull origin main
git checkout feature/integration
```

**あなたのターミナルで行うこと**:
1. ユーザーから「あなたは作業C担当です」と明示的に指示を受ける

### 2. 実装中

1. **TDDワークフロー**: テストを先に書く
2. **コミットメッセージ**: `feat(ai-integration):` プレフィックスを使用
3. **コミット前**: `git status` で変更内容を確認
4. **セキュリティ意識**: 常にセキュリティを意識して実装

### 3. エラー発生時

1. `/build-fix` コマンドを実行
2. セキュリティ関連の場合は `security-reviewer` エージェントを起動
3. 解決できない場合はユーザーに報告

### 4. 完了時

1. `/code-review` コマンドでレビュー
2. セキュリティレビューを実施
3. `work-c/progress.md` を更新
4. ビルド確認: `npm run build`
5. **ローカルコミット**（プッシュはしない！）

### Git操作の手順（作業C担当）

**重要**: GitHubへのプッシュはマネージャー（作業A担当）が一元化します。あなたはローカルコミットまでを行います。

```bash
# 変更を確認
git status

# 変更をステージ（担当ファイルのみ）
git add src/lib/ai/

# ローカルコミット（担当を明記）
git commit -m "feat(ai-integration): OpenAIプロバイダー実装"
# プッシュはしない！マネージャーが行います
```

**コミット後**: マネージャーに「作業C完了」を報告してください

---

## 作成済みファイル（作業完了済み）

作業Cは**完了済み**です。以下のファイルが作成されています：

### プロバイダー
- `src/lib/ai/base-provider.ts` - プロバイダー基底クラス
- `src/lib/ai/providers/openai.ts` - OpenAIプロバイダー
- `src/lib/ai/providers/anthropic.ts` - Anthropicプロバイダー
- `src/lib/ai/providers/google.ts` - Googleプロバイダー
- `src/lib/ai/index.ts` - ファクトリー関数

### API
- `src/app/api/ai/edit/route.ts` - AI編集API

### テスト（20テスト全てパス）
- `src/lib/ai/__tests__/base-provider.test.ts`
- `src/lib/ai/__tests__/providers.test.ts`
- `src/lib/ai/__tests__/index.test.ts`

---

## エラーハンドリングの仕様

| エラー種類 | 対応 |
|-----------|------|
| プロバイダーAPIエラー | ユーザーに分かりやすいエラーメッセージ |
| タイムアウト | リトライを試みるか、別のプロバイダーにフォールバック |
| レート制限 | プロバイダーのレート制限を尊重する |

---

## 次のステップ（統合フェーズ）

作業Cは完了しているため、次のフェーズに進みます：

1. **作業Dとの統合**: 状態管理と連携
2. **作業Bとの統合**: チャットUIからAI APIを呼び出し
3. **エンドツーエンドテスト**: 実際にAIが編集を行うフローをテスト

---

## 参照ドキュメント（詳細情報が必要な場合）

- `work-c/CLAUDE.md` - 作業Cの詳細ルール・設定
- `docs/parallel-work-plan.md` - 全体の並列作業計画と各作業の概要
