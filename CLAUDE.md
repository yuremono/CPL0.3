# Content Projection Layer

このファイルはプロジェクトのルールと地図です。Claudeはこの内容を読み取って作業の文脈を理解します。

---

## プロジェクト概要

**Content Projection Layer（CPL）** は、AI主導の編集体験を実現する中間層です。

### コンセプト
- ユーザーはAIチャットボットと対話しながら、ウェブサイトのコンテンツを編集できる
- 知識のないユーザーも、クリックで要素を選択し、AIに編集を依頼できる
- 同時に直接編集（ダブルクリックでテキスト入力、画像のドラッグ&ドロップ）も可能
- 編集結果は自動保存され、ビルドボタンで本番環境に反映（ISR/SSG）

### 技術スタック
- **フレームワーク**: Next.js 16.1.4 + React 19.2.3 + TypeScript
- **スタイリング**: Tailwind CSS 4 + Neo-Brutalism デザイン
- **UIコンポーネント**: Radix UI
- **状態管理**: Zustand
- **AIプロバイダー**: OpenAI / Anthropic / Google（マルチ対応）
- **永続化**: IndexedDB

### レイヤー構造
```
┌─────────────────────────────────────────┐
│ Presentation Layer                     │
│ （Next.jsページ、通常の表示）              │
└─────────────────────────────────────────┘
                  ↑
┌─────────────────────────────────────────┐
│ Content Projection Layer               │
│ （編集・プレビュー・差分管理）              │
└─────────────────────────────────────────┘
                  ↑
┌─────────────────────────────────────────┐
│ Content Source Layer                   │
│ （元のコンテンツ、CMSなど）               │
└─────────────────────────────────────────┘
```

---

## ファイル命名規則

**重要**: このプロジェクトでは、コンポーネントと非コンポーネントで命名規則を明確に分けています。

### アーキテクチャの分類

| 分類 | ディレクトリ | 役割 | ブラウザ上の存在 |
|------|-------------|------|----------------|
| **コンポーネント** | `components/` | UI部品、DOMにレンダリングされる | ✅ あり |
| **カスタムフック** | `hooks/` | Reactフック、状態管理ロジック | ❌ なし |
| **ユーティリティ** | `lib/` | 関数・型定義・AIプロバイダー | ❌ なし |
| **ストア** | `stores/` | Zustand状態管理 | ❌ なし |
| **ページ/レイアウト** | `app/` | Next.jsルーティング | ✅ あり（規約固定） |

### 命名規則

```
components/  → PascalCase (例: EditableWrapper.tsx)
hooks/       → kebab-case (例: use-auto-save.ts)
lib/         → kebab-case (例: generate-id.ts)
stores/      → kebab-case (例: chat-store.ts)
app/         → Next.js規約 (page.tsx, layout.tsx は固定名)
```

### 理由: data-l属性の視認性

**コンポーネントのみパスカルケース**を採用する理由：

1. **data-l属性での視認性**
   - `data-l="EditableWrapper184"` ← 一目でコンポーネント由来とわかる
   - `data-l="Page97"` ← ページ由来と区別がつく

2. **ダブルクリック選択のしやすさ**
   - `EditableWrapper184` ← ユーザーがダブルクリックで選択しやすい
   - `use-auto-save-42` ← 選択されることはない（DOMに存在しない）

3. **ブラウザ開発者ツールでの確認**
   - 要素を検証 → `data-l` 属性を確認 → 即座にファイルと行番号が特定できる

### 覚え方

```
DOMに見えるもの = PascalCase
DOMに見えないもの = kebab-case
```

---

## data-l属性: ソースロケーションシステム

このプロジェクトでは、**開発環境でのみ**全JSX要素に `data-l` 属性を自動注入しています。

### 技術実装

**Babelカスタムプラグイン** (`babel-plugin-source-locator.js`) を使用：

1. `.babelrc` で開発環境のみプラグイン有効化
2. 全JSX要素のオープニングタグを検出
3. 要素名（ファイル名から生成）+ 行番号を `data-l` 属性として注入
4. 属性は他の属性よりも前に配置（要素名の直後）

```javascript
// babel-plugin-source-locator.js
module.exports = function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path, state) {
        const filename = state.file.opts.filename;
        const loc = path.node.loc;

        // ファイル名からコンポーネント名を生成
        // editable-wrapper.tsx → EditableWrapper
        const componentName = filename
          .split('/')
          .pop()
          .replace(/\.(tsx?|jsx?)$/, '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');

        // data-l="EditableWrapper184" を注入
        const attr = t.jsxAttribute(
          t.jsxIdentifier("data-l"),
          t.stringLiteral(`${componentName}${loc.start.line}`)
        );

        path.node.attributes.unshift(attr);
      }
    }
  };
};
```

### data-l属性の形式

```
data-l="{コンポーネント名}{行番号}"
```

| 例 | ファイル | 行番号 |
|----|---------|--------|
| `EditableWrapper184` | `EditableWrapper.tsx` | 184 |
| `Page463` | `page.tsx` | 463 |
| `ChatSidebar60` | `ChatSidebar.tsx` | 60 |
| `Layout95` | `layout.tsx` | 95 |

### AIへの指示方法

```
「EditableWrapper184のボタンを削除して」
「Page463の見出しを『新製品』に変更して」
```

data-l値を指定することで、即座にファイルと行番号が特定できます。

---

## 重要なルール

### 1. コード構成
- 巨大なファイルよりも、小さく分割された多数のファイルを優先する
- 高凝集・低結合
- 1ファイルあたり200〜400行が目安、最大800行
- 機能/ドメイン別に整理する

### 2. コードスタイル
- コード、コメント、ドキュメントに絵文字を使用しない
- **常に不変性（Immutability）を維持する** - オブジェクトや配列を直接変更しない
- 本番コードに `console.log` を残さない
- `try/catch` による適切なエラーハンドリング
- Zodなどを用いた入力バリデーション

### 3. a11y（アクセシビリティ）
- **a11yツリー（アクセシビリティツリー）** の考え方を採用
- AIが理解しやすい属性（role, aria-*）を付与
- 要素を「意味のある部品」として扱う

```tsx
// 例: a11y準拠の属性
<div
  data-cpl-id="blk_abc123"
  data-cpl-type="heading"
  role="heading"
  aria-level="2"
  aria-label="ヒーローセクションのメイン見出し"
>
  <h2>Creative Developer</h2>
</div>
```

### 4. テスト規約
- TDD: テストを先に書く
- 最小カバレッジ 80% を維持する
- ユーティリティにはユニットテスト、APIには結合テストを書く

### 5. セキュリティ
- シークレット情報をハードコードしない
- 環境変数を使用する
- すべてのユーザー入力をバリデーションする

---

## Git AIによる履歴追跡

このプロジェクトでは**git-aiによるAI vs Human属性の追跡**を採用しています。コードを編集した後は必ずコミットしてください。

### AI作業後の必須コミット

```bash
# Git Aliasが設定済みの場合（推奨）
git ai

# または手動でコミット
git add -A && git commit -m "ai: <変更内容の説明>"
```

### コミットが不要な場合
- 単純な説明や質問への回答
- コードの編集を伴わない場合

### コミットが推奨される場合
- コードを生成・編集した場合
- ファイルを作成・削除した場合
- リファクタリングを行った場合

### コミットメッセージの形式
- Conventional Commits形式: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- AI作業時はプレフィックス `ai:` を使用

---

## ディレクトリ構造

```
src/
├── app/                      # Next.js app router
│   ├── page.tsx             # メインページ（ポートフォリオ）
│   ├── layout.tsx
│   └── api/                 # APIルート
│       └── ai/
│           └── edit/        # AI編集API（作業C）
├── components/
│   ├── ui/                  # Radix UIコンポーネント
│   ├── chat/                # チャットUI（作業B）
│   └── content-projection-layer/  # プレビューUI（作業A）
├── hooks/                   # カスタムフック
│   ├── use-preview-mode.ts  # プレビューモード検出（作業A）
│   ├── use-selected-element.ts  # 選択要素操作（作業D）
│   └── use-auto-save.ts     # 自動保存フック（作業D）
├── lib/
│   ├── content-projection/  # CPL共通ライブラリ（作業A）
│   │   ├── types.ts         # 型定義
│   │   ├── generate-id.ts   # ID生成
│   │   └── attributes.ts    # a11y属性生成
│   ├── ai/                  # AIプロバイダー（作業C）
│   │   ├── base-provider.ts
│   │   ├── providers/
│   │   └── index.ts
│   └── storage/             # 永続化（作業D）
│       ├── indexed-db.ts
│       └── auto-save.ts
├── stores/                  # Zustandストア（作業D）
│   ├── chat-store.ts        # チャット状態（作業B）
│   ├── preview-store.ts
│   └── edit-history-store.ts
└── stories/                 # Storybook
```

---

## 使用可能なコマンド

- `/tdd` - テスト駆動開発ワークフロー
- `/plan` - 実装計画の作成
- `/code-review` - コード品質のレビュー
- `/build-fix` - ビルドエラーの修正

---

## 環境変数

```env
# .env.local
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_GOOGLE_API_KEY=...
```

---

## 関連ドキュメント


- `ai_driven_layer_概念ドキュメント（計画書_仕様書_中間）.md` - 概念ドキュメント

