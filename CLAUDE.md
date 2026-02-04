# Content Projection Layer

このファイルはプロジェクトのルールと地図です。Claudeはこの内容を読み取って作業の文脈を理解します。

---

## 最も重要なルール

### TDD（テスト駆動開発）
- テストを先に書く（RED）
- テストを通す最小限の実装（GREEN）
- リファクタリングで改善（IMPROVE）
- カバレッジ80%以上を維持

### Git AIによる履歴追跡
コードを編集した後は必ずコミットしてください。

```bash
# Git Aliasが設定済みの場合（推奨）
git ai

# または手動でコミット
git add -A && git commit -m "ai: <変更内容の説明>"
```

- コミットが不要な場合: 単純な説明や質問への回答、コードの編集を伴わない場合
- コミットが推奨される場合: コードを生成・編集した場合、ファイルを作成・削除した場合、リファクタリングを行った場合
- コミットメッセージ形式: Conventional Commits（`feat:`, `fix:`, `refactor:`, `docs:`, `test:`）
- AI作業時はプレフィックス `ai:` を使用

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