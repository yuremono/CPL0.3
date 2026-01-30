---
description: 作業A（プレビューUI）の実装ワークフロー
---

あなたは作業A（プレビューUI実装）を担当するClaude Codeです。

## 担当の認識

あなたは以下の条件の**いずれか**が満たされたとき、自分が作業A担当であると認識してください：

1. ユーザーから明示的に「作業A担当」「ワークA」「プレビューUI担当」と指示された
2. ユーザーから「マネージャー」と指示された（作業A担当はマネージャーを兼務）

**重要**: 複数のスキルが読み込まれていますが、ユーザーから明示的な指示がない場合は、ユーザーに確認してください。

---

## 作業範囲

プレビューモードの検出、編集可能要素のラッパー、ホバー/クリックによる選択機能を実装します。

### 主な機能
- `?mode=preview` クエリパラメータでプレビューモードを検出
- a11y準拠の属性を生成して要素に付与
- ホバー時に要素をハイライト（黄色半透明の背景）
- クリックで要素を選択
- ダブルクリックで直接編集モード

---

## 担当するファイル

### 編集可能なファイル
- `src/components/content-projection-layer/`
- `src/lib/content-projection/`
- `src/hooks/use-preview-mode.ts`
- `work-a/`

### 編集不可なファイル（絶対ルール）
- `src/components/chat/`（作業B）
- `src/lib/ai/`（作業C）
- `src/stores/`（作業D・ただし `chat-store.ts` は作業B）
- `src/lib/storage/`（作業D）
- `src/hooks/use-selected-element.ts`（作業D）
- `src/hooks/use-auto-save.ts`（作業D）
- 他の作業の `work-{b,c,d}/` ディレクトリ
- `docs/progress-report.md`（マネージャー専用・自分がマネージャーの場合は編集可）

---

## 使用する型・インターフェース

```typescript
// src/lib/content-projection/types.ts
export type PreviewMode = 'preview' | 'edit'
export type EditableElementType = 'text' | 'heading' | 'paragraph' | 'link' | 'image' | 'button' | 'list' | 'listitem'

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
```

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
1. ユーザーから「あなたは作業A担当です」と明示的に指示を受ける

### 2. 実装中

1. **TDDワークフロー**: テストを先に書く
2. **コミットメッセージ**: `feat(preview-ui):` プレフィックスを使用
3. **コミット前**: `git status` で変更内容を確認

### 3. エラー発生時

1. `/build-fix` コマンドを実行
2. 解決できない場合はユーザーに報告

### 4. 完了時

1. `/code-review` コマンドでレビュー
2. `work-a/progress.md` を更新
3. ビルド確認: `npm run build`

---

## マネージャーとしての責務（作業A担当のみ）

作業A担当は**マネージャーを兼務**します：

1. 全体進捗の管理と共有（`docs/progress-report.md` を更新）
2. 各作業の `work-{id}/progress.md` を確認してサマリー化
3. ブロッカーの検出と調整
4. 次のアクションの指示

**注意**: `docs/progress-report.md` はマネージャー（作業A担当）のみが編集できます。

---

## 作成済みファイル（作業完了済み）

作業Aは**完了済み**です。以下のファイルが作成されています：

### ライブラリ
- `src/lib/content-projection/types.ts` - 型定義
- `src/lib/content-projection/generate-id.ts` - ID生成
- `src/lib/content-projection/attributes.ts` - a11y属性生成

### コンポーネント
- `src/components/content-projection-layer/preview-provider.tsx` - プレビューモード制御
- `src/components/content-projection-layer/editable-wrapper.tsx` - 編集可能ラッパー
- `src/components/content-projection-layer/hover-highlight.tsx` - ホバー/クリック機能

### フック
- `src/hooks/use-preview-mode.ts` - プレビューモード検出

### その他
- `src/app/demo/page.tsx` - デモページ

### テスト（24テスト全てパス）
- `src/lib/content-projection/__tests__/attributes.test.ts` (8 tests)
- `src/components/content-projection-layer/__tests__/preview-provider.test.tsx` (3 tests)
- `src/components/content-projection-layer/__tests__/editable-wrapper.test.tsx` (7 tests)
- `src/components/content-projection-layer/__tests__/hover-highlight.test.tsx` (6 tests)

---

## 次のステップ（統合フェーズ）

作業Aは完了しているため、次のフェーズに進みます：

1. **他の作業との統合**: 作業B・C・Dと連携して全体を統合
2. **E2Eテスト**: Playwrightでエンドツーエンドテストを作成
3. **プルリクエスト**: 統合完了後、PRを作成してレビュー依頼

---

## 参照ドキュメント（詳細情報が必要な場合）

- `work-a/CLAUDE.md` - 作業Aの詳細ルール・設定（作業固有の注意点など）
- `docs/parallel-work-plan.md` - 全体の並列作業計画と各作業の概要
