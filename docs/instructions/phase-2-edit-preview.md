# フェーズ2: 編集プレビュー機能 - 実装指示書

## 担当
- 作業B（チャットUI）
- 作業C（AI連携）

## 目的
AIが回答したテキストの出力結果の下にOKボタンとNGボタンを設置し、ユーザーがプレビューを確認してから確定できるようにする。

---

## 仕様

### OKボタン
- 押下時：プレビュー内容を確定し、コンテンツを書き換える
- `EditableWrapper` の内容を更新
- `preview-store.ts` の `edits` に保存
- `edit-history-store.ts` に履歴を追加

### NGボタン
- 押下時：プレビューをキャンセル
- 何も変更しない
- AI応答メッセージは残す

---

## 実装タスク

### タスク1: プレビュー状態の型定義追加
**ファイル**: `src/lib/content-projection/types.ts`

```typescript
// 追加
export interface EditPreview {
  elementId: string
  originalContent: string
  previewContent: string
  timestamp: number
  status: 'pending' | 'approved' | 'rejected'
}
```

---

### タスク2: プレビュー状態管理フックの実装
**新規ファイル**: `src/hooks/use-edit-preview.ts`

```typescript
import { useState, useCallback } from 'react'
import type { EditPreview } from '@/lib/content-projection/types'

export function useEditPreview() {
  const [previews, setPreviews] = useState<Map<string, EditPreview>>(new Map())

  const createPreview = useCallback((elementId: string, originalContent: string, previewContent: string) => {
    const preview: EditPreview = {
      elementId,
      originalContent,
      previewContent,
      timestamp: Date.now(),
      status: 'pending',
    }
    setPreviews(prev => new Map(prev).set(elementId, preview))
    return preview
  }, [])

  const approvePreview = useCallback((elementId: string) => {
    setPreviews(prev => {
      const preview = prev.get(elementId)
      if (preview) {
        const updated = { ...preview, status: 'approved' as const }
        return new Map(prev).set(elementId, updated)
      }
      return prev
    })
  }, [])

  const rejectPreview = useCallback((elementId: string) => {
    setPreviews(prev => {
      const preview = prev.get(elementId)
      if (preview) {
        const updated = { ...preview, status: 'rejected' as const }
        return new Map(prev).set(elementId, updated)
      }
      return prev
    })
  }, [])

  const clearPreview = useCallback((elementId: string) => {
    setPreviews(prev => {
      const next = new Map(prev)
      next.delete(elementId)
      return next
    })
  }, [])

  return {
    previews,
    createPreview,
    approvePreview,
    rejectPreview,
    clearPreview,
    getPreview: (elementId: string) => previews.get(elementId),
  }
}
```

---

### タスク3: OK/NGボタンコンポーネントの実装
**新規ファイル**: `src/components/chat/edit-preview-actions.tsx`

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface EditPreviewActionsProps {
  onApprove: () => void
  onReject: () => void
  disabled?: boolean
  loading?: boolean
}

export function EditPreviewActions({
  onApprove,
  onReject,
  disabled = false,
  loading = false,
}: EditPreviewActionsProps) {
  return (
    <div className="flex gap-2 mt-2">
      <Button
        onClick={onApprove}
        disabled={disabled || loading}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
      >
        <CheckIcon className="w-4 h-4 mr-1" />
        OK
      </Button>
      <Button
        onClick={onReject}
        disabled={disabled || loading}
        variant="outline"
        className="flex-1"
      >
        <XMarkIcon className="w-4 h-4 mr-1" />
        NG
      </Button>
    </div>
  )
}
```

---

### タスク4: chat-store.tsの拡張
**ファイル**: `src/stores/chat-store.ts`

```typescript
// 追加: プレビュー状態
interface ChatState {
  // ... 既存のフィールド

  // 新規: プレビュー状態
  pendingPreview: {
    messageId: string
    elementId: string
    previewContent: string
  } | null
}

interface ChatStore {
  // ... 既存のアクション

  // 新規: プレビュー関連
  setPendingPreview: (preview: { messageId: string; elementId: string; previewContent: string } | null) => void
  clearPendingPreview: () => void
}
```

---

### タスク5: ChatAppへのプレビューボタン統合
**ファイル**: `src/components/chat/chat-app.tsx`

AI応答メッセージにOK/NGボタンを表示：

```typescript
// AI応答メッセージにプレビューボタンを追加
{message.role === 'assistant' && message.relatedElementId && (
  <EditPreviewActions
    onApprove={() => handleApproveEdit(message)}
    onReject={() => handleRejectEdit(message)}
    disabled={isSending}
  />
)}
```

OK押下時のハンドラー：

```typescript
const handleApproveEdit = async (message: ChatMessage) => {
  if (!message.relatedElementId || !message.content) return

  // プレビュー内容を確定
  updateContent(message.relatedElementId, message.content)

  // 編集履歴に記録
  const selectedElement = usePreviewStore.getState().selectedElement
  if (selectedElement) {
    addOperation({
      elementId: message.relatedElementId,
      type: 'update',
      oldValue: selectedElement.content,
      newValue: message.content,
      timestamp: Date.now(),
    })
  }

  // プレビュー状態をクリア
  clearPendingPreview()
}

const handleRejectEdit = (message: ChatMessage) => {
  // プレビューをキャンセル（何も変更しない）
  clearPendingPreview()

  // 通知メッセージを追加
  addMessage({
    role: 'system',
    content: 'プレビューをキャンセルしました。',
  })
}
```

---

### タスク6: EditableWrapperのプレビュー対応
**ファイル**: `src/components/content-projection-layer/editable-wrapper.tsx`

プレビュー状態を表示・更新：

```typescript
// プレビュー状態の取得
const pendingPreview = useChatStore((state) => state.pendingPreview)
const isPreviewing = pendingPreview?.elementId === element.id

// プレビュー内容を表示
const displayContent = isPreviewing
  ? pendingPreview.previewContent
  : (editedContent ?? extractTextContent(children))
```

---

## 依存関係

- **作業C**: `src/app/api/ai/edit/route.ts` - APIは既に実装済み
- **作業B**: `src/components/chat/chat-app.tsx` - メイン統合
- **作業B**: `src/stores/chat-store.ts` - 状態管理

---

## 完了基準

- [ ] AI応答メッセージにOK/NGボタンが表示される
- [ ] OKボタン押下でコンテンツが更新される
- [ ] NGボタン押下でキャンセルされる（何も変わらない）
- [ ] 編集履歴が正しく記録される
- [ ] テストがパスする

---

## 連携先

- 作業A（マネージャー）に進捗報告
- 作業D（状態管理）と編集履歴の連携を確認
