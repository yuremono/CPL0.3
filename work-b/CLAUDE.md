# Work Unit B: Chat UI - Claude Settings

このファイルは作業B（チャットUI実装）固有のルールと設定です。

## 作業の範囲と目的

サイドバーチャットインターフェースを実装します。ユーザーはAIと対話してコンテンツを編集できます。

### 主な機能
- プレビューモード時のみ表示されるサイドバー
- 選択中の要素情報を表示するカード
- メッセージ送信・受信のUI
- AI応答中のローディング表示

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

// src/stores/chat-store.ts（作業Bで作成）
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

## 依存する他の作業

- **作業A** の `A11yElementInfo` 型を使用
- **作業D** の `preview-store.ts` と連携（選択要素の取得）

## 作業固有のルールや注意点

### サイドバーの開閉状態
- 初期状態は開いている（`isOpen: true`）
- 閉じるボタンで非表示
- オーバーレイクリックでも閉じる

### メッセージのスタイル
| 役割 | 背景色 | 配置 |
|------|--------|------|
| ユーザー | アクセント色（`bg-accent`） | 右寄せ |
| AI | グレー（`bg-gray-100`） | 左寄せ |

### 入力フォームの挙動
- Enterで送信
- Shift+Enterで改行
- 空メッセージは送信不可
- 送信中は入力・ボタン無効化

### 不変性の維持
```typescript
// 良い例: 不変性の維持
const newMessages = [...messages, newMessage]

// 悪い例: 直接変更
messages.push(newMessage)
```

## テストの実行方法

```bash
# チャットストアのテスト
npx vitest run --project node src/stores/__tests__/chat-store.test.ts
```

## ビルドの確認方法

```bash
# ビルドを実行
npm run build

# 開発サーバーを起動
npm run dev
```

## 完了条件

1. `chat-store.ts` が実装され、メッセージ状態を管理できる
2. `chat-sidebar.tsx` が実装され、サイドバーが表示される
3. `message-list.tsx` が実装され、メッセージが表示される
4. `message-input.tsx` が実装され、メッセージを送信できる
5. `element-info-card.tsx` が実装され、選択要素が表示される
6. `loading-indicator.tsx` が実装され、ローディングが表示される
7. すべてのテストがパスする
8. ビルドが成功する

## 作成したファイル

### Store Files
- `src/stores/chat-store.ts`
- `src/stores/__tests__/chat-store.test.ts`

### Component Files
- `src/components/chat/chat-sidebar.tsx`
- `src/components/chat/message-list.tsx`
- `src/components/chat/message-input.tsx`
- `src/components/chat/element-info-card.tsx`
- `src/components/chat/loading-indicator.tsx`
- `src/components/chat/index.ts`

## 実装完了時の状態

作業Bは完了済みです。
- ビルド成功
- チャットUIレイヤー実装完了
- メッセージ送受信機能実装完了
