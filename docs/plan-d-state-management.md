# 作業D: 状態管理

## 概要
編集状態の管理（Zustand）、自動保存、Undo/Redoを実装する。

## スコープ
- 編集状態の管理（Zustand）
- 選択要素の状態
- 自動保存機能（IndexedDB）
- Undo/Redo

## 作成するファイル

```
src/
├── stores/
│   ├── preview-store.ts              # プレビュー状態の管理
│   └── edit-history-store.ts         # 編集履歴の管理
├── lib/storage/
│   ├── indexed-db.ts                 # IndexedDBラッパー
│   └── auto-save.ts                  # 自動保存ロジック
└── hooks/
    ├── use-selected-element.ts       # 選択要素の取得
    └── use-auto-save.ts              # 自動保存のフック
```

## 実装タスク

### タスク1: プレビューストア
**ファイル**: `src/stores/preview-store.ts`

```typescript
interface PreviewState {
  // プレビューモード
  mode: PreviewMode

  // 選択中の要素
  selectedElement: A11yElementInfo | null

  // 編集内容（elementId -> newContent）
  edits: Map<string, string>

  // アクション
  setMode: (mode: PreviewMode) => void
  selectElement: (element: A11yElementInfo | null) => void
  updateContent: (elementId: string, newContent: string) => void
  reset: () => void
}
```

### タスク2: 編集履歴ストア
**ファイル**: `src/stores/edit-history-store.ts`

```typescript
interface EditHistoryState {
  past: EditOperation[]
  future: EditOperation[]

  addOperation: (operation: EditOperation) => void
  undo: () => EditOperation | null
  redo: () => EditOperation | null
  canUndo: () => boolean
  canRedo: () => boolean
}
```

### タスク3: IndexedDBラッパー
**ファイル**: `src/lib/storage/indexed-db.ts`

```typescript
export function createIndexedDBStorage() {
  return {
    async getItem(key: string): Promise<string | null>
    async setItem(key: string, value: string): Promise<void>
    async removeItem(key: string): Promise<void>
  }
}
```

### タスク4: 自動保存ロジック
**ファイル**: `src/lib/storage/auto-save.ts`

```typescript
export function setupAutoSave(store: PreviewStore) {
  // 編集内容が変更されたら自動保存
  store.subscribe((state) => {
    if (state.edits.size > 0) {
      saveToIndexedDB(state.edits)
    }
  })
}
```

## ストアの永続化

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

## 自動保存のタイミング

| 操作 | タイミング |
|------|----------|
| AI編集完了 | 即座に保存 |
| 直接編集（テキスト） | フォーカス離脱時（blur） |
| 直接編集（画像） | 置き換え完了時 |

## Undo/Redoの実装

```typescript
// 操作を追加
function addOperation(operation: EditOperation) {
  const { past, future } = get()

  set({
    past: [...past, operation],
    future: [] // 新しい操作でredoをクリア
  })
}

// Undo
function undo() {
  const { past, future } = get()
  const lastOperation = past[past.length - 1]

  if (!lastOperation) return null

  set({
    past: past.slice(0, -1),
    future: [lastOperation, ...future]
  })

  return lastOperation
}

// Redo
function redo() {
  const { past, future } = get()
  const nextOperation = future[0]

  if (!nextOperation) return null

  set({
    past: [...past, nextOperation],
    future: future.slice(1)
  })

  return nextOperation
}
```

## 依存関係
- **作業A** から `A11yElementInfo` 型を使用
- **作業B** から選択要素を参照
- **作業C** から編集結果を受け取る

## コンポーネントからの使用

```typescript
// 選択要素の取得
const { selectedElement, selectElement } = usePreviewStore()

// 編集内容の更新
const { updateContent } = usePreviewStore()
updateContent(elementId, newContent)

// Undo/Redo
const { undo, redo, canUndo, canRedo } = useEditHistoryStore()
```

## 期待される成果物
- 選択要素が状態管理される
- 編集内容が保存される
- 自動保存が機能する
- Undo/Redoが動作する
- リロード後も状態が復元される

## テスト項目
- [ ] 要素を選択すると状態が更新される
- [ ] 編集内容が保存される
- [ ] 自動保存が動作する
- [ ] Undoで元に戻る
- [ ] Redoでやり直せる
- [ ] リロード後も状態が復元される

## 完了条件
1. `preview-store.ts` が実装され、状態管理ができる
2. `edit-history-store.ts` が実装され、Undo/Redoができる
3. `indexed-db.ts` が実装され、永続化ができる
4. `auto-save.ts` が実装され、自動保存が動作する
5. すべての作業単位と連携して動作する

## 次のステップ
この作業が完了したら：
- 作業Aの選択機能と連携して、選択状態を管理できる
- 作業BのチャットUIと連携して、AI編集結果を保存できる
- 作業CのAPIと連携して、編集内容を永続化できる
