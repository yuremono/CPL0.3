# フェーズ4: 編集履歴UI - 実装指示書

## 担当
- 作業B（チャットUI）
- 作業D（状態管理）

## 目的
編集履歴を視覚的に表示し、各履歴エントリーからUndo/Redoを可能にするUIパネルを実装する。

---

## 仕様

### 編集履歴パネル
- チャットサイドバー内に表示
- 履歴リストを時系列順に表示（最新が上）
- 各履歴エントリーに以下を表示：
  - タイムスタンプ
  - 変更内容の概要
  - Undoボタン
  - Redoボタン（可能な場合）

### 操作
- Undo: 最後の編集を取り消す
- Redo: 取り消した編集をやり直す
- 履歴エントリーをクリックしてその時点の状態を確認（オプション）

---

## 実装タスク

### タスク1: 編集履歴ストアの拡張
**ファイル**: `src/stores/edit-history-store.ts`

```typescript
// 追加: UI用の情報
interface HistoryEntry {
  id: string
  elementId: string
  elementType: string
  type: 'update' | 'insert' | 'delete'
  oldValue?: string
  newValue: string
  timestamp: number
  description: string // 例: "見出しを「XXX」に変更"
}

// 追加: UI用セレクター
const entries = useEditHistoryStore((state) => state.entries)
const canUndo = useEditHistoryStore((state) => state.canUndo)
const canRedo = useEditHistoryStore((state) => state.canRedo)
```

---

### タスク2: 編集履歴パネルコンポーネントの実装
**新規ファイル**: `src/components/chat/edit-history-panel.tsx`

```typescript
'use client'

import { useEditHistoryStore } from '@/stores/edit-history-store'
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline'

export function EditHistoryPanel() {
  const { past, future, canUndo, canRedo, undo, redo, clear } = useEditHistoryStore()

  // 履歴が空の場合は表示しない
  if (past.length === 0) {
    return null
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  }

  const getDescription = (entry: HistoryEntry) => {
    const elementType = entry.elementType === 'heading' ? '見出し' : 'テキスト'
    if (entry.type === 'update') {
      return `${elementType}を変更`
    }
    return `${elementType}を編集`
  }

  return (
    <div className="border-t-2 border-black">
      <div className="p-4 bg-gray-50 border-b-2 border-black">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm">編集履歴</h3>
          <button
            onClick={() => clear()}
            className="text-xs underline hover:no-underline"
          >
            クリア
          </button>
        </div>
      </div>

      <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
        {/* 最新の履歴から表示 */}
        {[...past].reverse().map((entry, index) => (
          <div
            key={entry.id || index}
            className="p-2 bg-white border border-gray-200 rounded flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {getDescription(entry)}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimestamp(entry.timestamp)}
              </p>
            </div>
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => undo()}
                className="p-1 hover:bg-gray-100 rounded"
                title="元に戻す"
              >
                <ArrowUturnLeftIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* 未来の履歴（Redo用） */}
        {future.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center mb-1">
              やり直し可能 ({future.length}件)
            </p>
            {future.map((entry, index) => (
              <div
                key={entry.id || index}
                className="p-2 bg-gray-50 border border-gray-200 rounded flex items-center justify-between opacity-60"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {getDescription(entry)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(entry.timestamp)}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => redo()}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="やり直す"
                  >
                    <ArrowUturnRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Undo/Redoボタン（固定） */}
      <div className="p-2 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button
          onClick={() => undo()}
          disabled={!canUndo}
          className="flex-1 px-3 py-2 text-sm font-medium border-2 border-black bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          <ArrowUturnLeftIcon className="w-4 h-4" />
          Undo
        </button>
        <button
          onClick={() => redo()}
          disabled={!canRedo}
          className="flex-1 px-3 py-2 text-sm font-medium border-2 border-black bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          Redo
          <ArrowUturnRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
```

---

### タスク3: ChatSidebarへの履歴パネル統合
**ファイル**: `src/components/chat/chat-sidebar.tsx`

チャットUIと編集履歴パネルを統合：

```typescript
import { EditHistoryPanel } from './edit-history-panel'

// ChatSidebar内の適切な位置に追加
<ChatSidebar>
  {/* 既存のチャットUI */}
  <ProviderSelector disabled={isSending} />
  <ElementInfoCard element={selectedElement} onDeselect={() => selectElement(null)} />
  <MessageList />
  <MessageInput onSend={handleSendMessage} disabled={isSending} />

  {/* 編集履歴パネルを追加 */}
  <EditHistoryPanel />
</ChatSidebar>
```

---

### タスク4: エクスポートの更新
**ファイル**: `src/components/chat/index.ts`

```typescript
export { EditHistoryPanel } from './edit-history-panel'
```

---

## 依存関係

- **作業D**: `src/stores/edit-history-store.ts` - 既に実装済み
- **作業B**: `src/components/chat/chat-sidebar.tsx` - メイン統合

---

## 完了基準

- [ ] 編集履歴パネルが表示される
- [ ] 各履歴エントリーが表示される（タイムスタンプ、説明）
- [ ] Undoボタンで最後の編集を取り消せる
- [ ] Redoボタンで取り消しをやり直せる
- [ ] 履歴が空の場合はパネルが表示されない
- [ ] テストがパスする

---

## 連携先

- マネージャー（作業A）に進捗報告
- 作業D（状態管理）と履歴データの連携を確認
