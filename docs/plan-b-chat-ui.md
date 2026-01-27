# 作業B: フロントエンド（チャットUI）

## 概要
サイドバーチャットインターフェースを実装する。ユーザーはAIと対話してコンテンツを編集できる。

## スコープ
- サイドバーチャットインターフェース
- メッセージ表示エリア（ユーザー・AI）
- 入力フォーム
- 選択要素の情報表示カード
- ローディング表示

## 作成するファイル

```
src/
└── components/chat/
    ├── chat-sidebar.tsx              # サイドバーメイン
    ├── message-list.tsx              # メッセージ一覧表示
    ├── message-input.tsx             # 入力フォーム
    ├── element-info-card.tsx         # 選択要素の情報表示
    ├── loading-indicator.tsx         # AI応答中のローディング
    └── index.ts                      # エクスポート
```

## 実装タスク

### タスク1: サイドバーメイン
**ファイル**: `src/components/chat/chat-sidebar.tsx`

- 固定位置またはスライド式サイドバー
- 半透明の背景
- 開閉ボタン
- プレビューモード時のみ表示

### タスク2: メッセージ一覧表示
**ファイル**: `src/components/chat/message-list.tsx`

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  relatedElementId?: string
}
```

### タスク3: 入力フォーム
**ファイル**: `src/components/chat/message-input.tsx`

- テキストエリア
- 送信ボタン
- エンターキーで送信（Shift+Enterで改行）

### タスク4: 選択要素の情報表示
**ファイル**: `src/components/chat/element-info-card.tsx`

```typescript
interface ElementInfoProps {
  element: A11yElementInfo
  onDeselect?: () => void
}
```

表示内容：
- 要素の型（heading/text/image...）
- 現在のコンテンツ
- ラベル/説明

### タスク5: ローディング表示
**ファイル**: `src/components/chat/loading-indicator.tsx`

- AI応答中のアニメーション
- 「考えています...」のようなテキスト

## UIデザイン

### サイドバーの構造
```tsx
<div className="fixed right-0 top-0 h-full w-80 bg-white/90 backdrop-blur shadow-lg">
  {/* ヘッダー */}
  <div className="p-4 border-b">
    <h2>AI アシスタント</h2>
  </div>

  {/* 選択要素の情報カード */}
  {selectedElement && <ElementInfoCard element={selectedElement} />}

  {/* メッセージ一覧 */}
  <div className="flex-1 overflow-y-auto">
    <MessageList messages={messages} />
  </div>

  {/* 入力フォーム */}
  <div className="p-4 border-t">
    <MessageInput onSend={handleSend} />
  </div>
</div>
```

### メッセージのスタイル
```tsx
// ユーザーメッセージ
<div className="flex justify-end">
  <div className="bg-blue-500 text-white rounded-lg px-4 py-2">
    {message.content}
  </div>
</div>

// AIメッセージ
<div className="flex justify-start">
  <div className="bg-gray-100 rounded-lg px-4 py-2">
    {message.content}
  </div>
</div>
```

## 依存関係
- **作業A** から `A11yElementInfo` 型を使用
- **作業D** の状態管理（ストア）と連携

## コンポーネント間の連携

```typescript
// 作業Dのストアから選択要素を取得
const selectedElement = usePreviewStore((state) => state.selectedElement)

// AI応答を受け取って表示
const { messages, addMessage } = useChatStore()

// 送信処理
const handleSend = async (text: string) => {
  addMessage({ role: 'user', content: text })
  const response = await fetch('/api/ai/edit', { ... })
  addMessage({ role: 'assistant', content: response.content })
}
```

## 期待される成果物
- サイドバーがプレビューモード時のみ表示される
- 選択した要素の情報が表示される
- メッセージの送受信ができる
- AI応答中はローディングが表示される

## テスト項目
- [ ] プレビューモード時のみサイドバーが表示される
- [ ] 選択した要素の情報が正しく表示される
- [ ] メッセージを送信できる
- [ ] メッセージが正しく表示される
- [ ] ローディングが表示される

## 完了条件
1. `chat-sidebar.tsx` が実装され、サイドバーが表示される
2. `element-info-card.tsx` が実装され、選択要素が表示される
3. `message-input.tsx` が実装され、メッセージを送信できる
4. `message-list.tsx` が実装され、メッセージが表示される
5. 作業A・Dと連携して動作する

## 次のステップ
この作業が完了したら：
- 作業CのAPIと連携して、AI応答を表示できる
- 作業Aの選択機能と連携して、要素情報を表示できる
