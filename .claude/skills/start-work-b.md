---
description: 作業B（チャットUI）の実装ワークフロー
---

あなたは作業B（チャットUI実装）を担当するClaude Codeです。

## 担当の認識

あなたは以下の条件の**いずれか**が満たされたとき、自分が作業B担当であると認識してください：

1. ユーザーから明示的に「作業B担当」「ワークB」「チャットUI担当」と指示された

**重要**: 複数のスキルが読み込まれていますが、ユーザーから明示的な指示がない場合は、ユーザーに確認してください。

---

## 作業範囲

サイドバーチャットインターフェースを実装します。ユーザーはAIと対話してコンテンツを編集できます。

### 主な機能
- プレビューモード時のみ表示されるサイドバー
- 選択中の要素情報を表示するカード
- メッセージ送信・受信のUI
- AI応答中のローディング表示

---

## 担当するファイル

### 編集可能なファイル
- `src/components/chat/`
- `src/stores/chat-store.ts`
- `work-b/`

### 編集不可なファイル（絶対ルール）
- `src/components/content-projection-layer/`（作業A）
- `src/lib/content-projection/`（作業A）
- `src/lib/ai/`（作業C）
- `src/app/api/ai/`（作業C）
- `src/stores/`（作業D・ただし `chat-store.ts` は作業B）
- `src/lib/storage/`（作業D）
- `src/hooks/use-selected-element.ts`（作業D）
- `src/hooks/use-auto-save.ts`（作業D）
- 他の作業の `work-{a,c,d}/` ディレクトリ
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

// 作業Bで作成する型
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  relatedElementId?: string
}

export interface ChatState {
  messages: ChatMessage[]
  isSending: boolean
  isOpen: boolean
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
1. ユーザーから「あなたは作業B担当です」と明示的に指示を受ける

### 2. 実装中

1. **TDDワークフロー**: テストを先に書く
2. **コミットメッセージ**: `feat(chat-ui):` プレフィックスを使用
3. **コミット前**: `git status` で変更内容を確認

### 3. エラー発生時

1. `/build-fix` コマンドを実行
2. 解決できない場合はユーザーに報告

### 4. 完了時

1. `/code-review` コマンドでレビュー
2. `work-b/progress.md` を更新
3. ビルド確認: `npm run build`

---

## UIスタイルの仕様

### サイドバー
- 初期状態は開いている（`isOpen: true`）
- 閉じるボタンで非表示
- オーバーレイクリックでも閉じる

### メッセージのスタイル
| 役割 | 背景色 | 配置 |
|------|--------|------|
| ユーザー | アクセント色（`bg-accent`） | 右寄せ |
| AI | グレー（`bg-gray-100`） | 左寄せ |

### 入力フォーム
- Enterで送信
- Shift+Enterで改行
- 空メッセージは送信不可
- 送信中は入力・ボタン無効化

---

## 作成済みファイル（作業完了済み）

作業Bは**完了済み**です。以下のファイルが作成されています：

### ストア
- `src/stores/chat-store.ts` - チャット状態管理

### コンポーネント
- `src/components/chat/chat-sidebar.tsx` - サイドバーメイン
- `src/components/chat/message-list.tsx` - メッセージ一覧
- `src/components/chat/message-input.tsx` - 入力フォーム
- `src/components/chat/element-info-card.tsx` - 要素情報カード
- `src/components/chat/loading-indicator.tsx` - ローディング表示

---

## 次のステップ（統合フェーズ）

作業Bは完了しているため、次のフェーズに進みます：

1. **作業Dとの統合**: 状態管理を連携
2. **作業Aとの統合**: 選択要素の情報をチャットに表示
3. **作業Cとの統合**: AI応答をチャットに表示

---

## 参照ドキュメント（詳細情報が必要な場合）

- `work-b/CLAUDE.md` - 作業Bの詳細ルール・設定
- `docs/parallel-work-plan.md` - 全体の並列作業計画と各作業の概要
