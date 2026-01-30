---
description: 作業D（状態管理）の実装ワークフロー
---

あなたは作業D（状態管理実装）を担当するClaude Codeです。

## 担当の認識

あなたは以下の条件の**いずれか**が満たされたとき、自分が作業D担当であると認識してください：

1. ユーザーから明示的に「作業D担当」「ワークD」「状態管理担当」と指示された

**重要**: 複数のスキルが読み込まれていますが、ユーザーから明示的な指示がない場合は、ユーザーに確認してください。

---

## 作業範囲

編集状態の管理（Zustand）、自動保存、Undo/Redoを実装します。

### 主な機能
- 選択要素の状態管理
- 編集履歴の管理（Undo/Redo）
- IndexedDBによる永続化
- 自動保存ロジック

---

## 担当するファイル

### 編集可能なファイル
- `src/stores/`（ただし `chat-store.ts` は作業B）
- `src/lib/storage/`
- `src/hooks/use-selected-element.ts`
- `src/hooks/use-auto-save.ts`
- `work-d/`

### 編集不可なファイル（絶対ルール）
- `src/components/content-projection-layer/`（作業A）
- `src/lib/content-projection/`（作業A）
- `src/components/chat/`（作業B）
- `src/stores/chat-store.ts`（作業B）
- `src/lib/ai/`（作業C）
- `src/app/api/ai/`（作業C）
- `src/hooks/use-preview-mode.ts`（作業A）
- 他の作業の `work-{a,b,c}/` ディレクトリ
- `docs/progress-report.md`（マネージャー専用）

**重要**: この作業は**全ての作業単位から利用される**ため、慎重に実装してください。

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

// 編集操作
export interface EditOperation {
  elementId: string
  type: 'update' | 'insert' | 'delete'
  oldValue?: string
  newValue: string
  timestamp: number
}
```

---

## 不変性の維持（最重要）

```typescript
// 良い例: 不変性の維持
const newEdits = new Map(edits)
newEdits.set(elementId, newContent)

// 悪い例: 直接変更
edits.set(elementId, newContent)
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
1. ユーザーから「あなたは作業D担当です」と明示的に指示を受ける

### 2. 実装中

1. **TDDワークフロー**: テストを先に書く
2. **コミットメッセージ**: `feat(state-management):` プレフィックスを使用
3. **コミット前**: `git status` で変更内容を確認
4. **不変性の維持**: 常に不変性を意識して実装

### 3. エラー発生時

1. `/build-fix` コマンドを実行
2. 解決できない場合はユーザーに報告

### 4. 完了時

1. `/code-review` コマンドでレビュー
2. `work-d/progress.md` を更新
3. ビルド確認: `npm run build`
4. **ローカルコミット**（プッシュはしない！）

### Git操作の手順（作業D担当）

**重要**: GitHubへのプッシュはマネージャー（作業A担当）が一元化します。あなたはローカルコミットまでを行います。

```bash
# 変更を確認
git status

# 変更をステージ（担当ファイルのみ）
git add src/stores/

# ローカルコミット（担当を明記）
git commit -m "feat(state-management): プレビューストア実装"
# プッシュはしない！マネージャーが行います
```

**コミット後**: マネージャーに「作業D完了」を報告してください

**注意**: この作業は全ての作業単位から利用されるため、慎重に実装してください。

---

## 作成済みファイル（作業完了済み）

作業Dは**完了済み**です。以下のファイルが作成されています：

### ストア
- `src/stores/preview-store.ts` - プレビュー状態管理
- `src/stores/edit-history-store.ts` - 編集履歴管理

### ストレージ
- `src/lib/storage/indexed-db.ts` - IndexedDBラッパー
- `src/lib/storage/auto-save.ts` - 自動保存ロジック

### フック
- `src/hooks/use-selected-element.ts` - 選択要素操作
- `src/hooks/use-auto-save.ts` - 自動保存フック

---

## 仕様詳細

### 自動保存のタイミング
| 操作 | タイミング |
|------|----------|
| AI編集完了 | 即座に保存 |
| 直接編集（テキスト） | フォーカス離脱時（blur） |
| 直接編集（画像） | 置き換え完了時 |

### Undo/Redo
- 履歴の最大保持数: 50件
- 履歴が満になると古い履歴から削除

### Zustandのミドルウェア構成
```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const usePreviewStore = create<PreviewState>()(
  persist(
    (set, get) => ({
      // ストアの実装
    }),
    {
      name: 'preview-storage',
      storage: createJSONStorage(() => createIndexedDBStorage())
    }
  )
)
```

---

## 次のステップ（統合フェーズ）

作業Dは完了しているため、次のフェーズに進みます：

1. **全作業との統合**: 作業A・B・Cから状態管理を利用できるようにする
2. **統合テスト**: 全ての機能が連携して動作することを確認
3. **プルリクエスト**: 統合完了後、PRを作成してレビュー依頼

---

## 参照ドキュメント（詳細情報が必要な場合）

- `work-d/CLAUDE.md` - 作業Dの詳細ルール・設定
- `docs/parallel-work-plan.md` - 全体の並列作業計画と各作業の概要
