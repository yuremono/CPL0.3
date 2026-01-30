# Work Unit D: State Management - Claude Settings

このファイルは作業D（状態管理実装）固有のルールと設定です。

---

## GitHub操作のルール（絶対遵守）

**あなたは作業D担当です。GitHub操作（git push）は絶対に禁止です。**

| 操作 | 実行可 | あなた |
|------|--------|--------|
| `git add` | ✅ | 実行可 |
| `git commit` | ✅ | 実行可 |
| `git push` | **禁止** | **絶対に実行しないでください** |

作業完了時のフロー:
1. `git add` と `git commit` を実行（ローカルコミットまで）
2. マネージャーに進捗報告
3. マネージャーが `git push` を実行

---

## 📋 進捗報告（必ず目を通してください）

### 進捗報告のタイミング
以下の場合は必ず進捗報告を行ってください：
- ✅ 作業完了時
- ✅ 1日以上作業した場合
- ✅ 週の終わり
- ✅ 問題が発生した場合

### 進捗報告の手順
1. **テンプレート確認**: `docs/REPORTING.md` を確認してください
2. **日報作成**: テンプレートに従って進捗を記載してください
3. **提出先**: `docs/PROGRESS.md` と `work-d/progress.md` に報告してください

### 進捗報告テンプレート（簡易版）

作業終了時に以下の形式で報告してください：

```
## 進捗報告 - 作業D ({日付})

### 完了したタスク
- [x] タスク1
- [x] タスク2

### 作成/更新したファイル
- `path/to/file.ts` (変更内容の説明)

### 次のステップ
- 次に行う作業
```

---

## 作業の範囲と目的

編集状態の管理（Zustand）、自動保存、Undo/Redoを実装します。

### 主な機能
- 選択要素の状態管理
- 編集履歴の管理（Undo/Redo）
- IndexedDBによる永続化
- 自動保存ロジック

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

// 編集操作
export interface EditOperation {
  elementId: string
  type: 'update' | 'insert' | 'delete'
  oldValue?: string
  newValue: string
  timestamp: number
}
```

## 依存する他の作業

- **作業A**: 型定義（`A11yElementInfo`）を使用
- **全作業**: すべての作業単位から利用される

## 作業固有のルールや注意点

### 不変性の維持
```typescript
// 良い例: 不変性の維持
const newEdits = new Map(edits)
newEdits.set(elementId, newContent)

// 悪い例: 直接変更
edits.set(elementId, newContent)
```

### Zustandのミドルウェア
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

### 自動保存のタイミング
| 操作 | タイミング |
|------|----------|
| AI編集完了 | 即座に保存 |
| 直接編集（テキスト） | フォーカス離脱時（blur） |
| 直接編集（画像） | 置き換え完了時 |

### Undo/Redo
- 履歴の最大保持数: 50件
- 履歴が満になると古い履歴から削除

## テストの実行方法

```bash
# 状態管理のテスト
npx vitest run --project node src/stores/__tests__/*.test.ts
```

## ビルドの確認方法

```bash
# ビルドを実行
npm run build

# 開発サーバーを起動
npm run dev
```

## 完了条件

1. `preview-store.ts` が実装され、状態管理ができる
2. `edit-history-store.ts` が実装され、Undo/Redoができる
3. `indexed-db.ts` が実装され、永続化ができる
4. `auto-save.ts` が実装され、自動保存が動作する
5. `use-selected-element.ts` が実装され、選択要素の操作ができる
6. `use-auto-save.ts` が実装され、自動保存のフックが使える
7. すべてのテストがパスする
8. ビルドが成功する

## 進捗報告

作業完了時または進捗がある場合は、`progress.md` を更新してください。

## マネージャーへの連絡

- 進捗報告: `work-d/progress.md` を更新
- ブロッカー発生: 即座に報告
- 質問がある: マネージャー（伝達役経由）に相談

## 作成したファイル

### Store Files
- `src/stores/preview-store.ts`
- `src/stores/edit-history-store.ts`

### Storage Files
- `src/lib/storage/indexed-db.ts`
- `src/lib/storage/auto-save.ts`

### Hook Files
- `src/hooks/use-selected-element.ts`
- `src/hooks/use-auto-save.ts`

## 実装完了時の状態

作業Dは完了済みです。
- ビルド成功
- 状態管理レイヤー実装完了
- 自動保存機能実装完了
- Undo/Redo機能実装完了
