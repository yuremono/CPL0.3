# Content Projection Layer

AI主導の編集体験を実現する中間層。ユーザーはAIチャットボットと対話しながら、ウェブサイトのコンテンツを編集できます。

## 概要

**Content Projection Layer（CPL）** は、以下の機能を提供します：

- **AIによる編集**: クリックで要素を選択し、AIに編集を依頼
- **直接編集**: ダブルクリックでテキスト入力、画像のドラッグ&ドロップ
- **自動保存**: 編集内容はIndexedDBに自動保存
- **リアルタイム反映**: 編集結果を即座にプレビュー
- **ビルド機能**: ボタン一つで本番環境に反映（ISR/SSG）

## 技術スタック

- **フレームワーク**: Next.js 16.1.4 + React 19.2.3 + TypeScript
- **スタイリング**: Tailwind CSS 4 + Neo-Brutalism デザイン
- **UIコンポーネント**: Radix UI
- **状態管理**: Zustand
- **AIプロバイダー**: OpenAI / Anthropic / Google（マルチ対応）
- **永続化**: IndexedDB

## プレビュー

ポートフォリオサイトのサンプル実装を含んでいます。

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/yuremono/ContentProjectionLayer.git
cd ContentProjectionLayer
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` にAIプロバイダーのAPIキーを設定：

```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_GOOGLE_API_KEY=...
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いてください。

### 5. プレビューモードの起動

プレビューモードを有効にするには、URLにクエリパラメータを追加：

```
http://localhost:3000?mode=preview
```

## プロジェクト構造

```
src/
├── app/                      # Next.js app router
├── components/
│   ├── ui/                   # Radix UIコンポーネント
│   ├── chat/                 # チャットUI
│   └── content-projection-layer/  # プレビューUI
├── hooks/                    # カスタムフック
├── lib/
│   ├── content-projection/   # CPL共通ライブラリ
│   ├── ai/                   # AIプロバイダー
│   └── storage/              # 永続化
└── stores/                   # Zustandストア
```

## 並列作業

このプロジェクトは並列作業を前提として設計されています。詳細は以下のドキュメントを参照してください：

- [並列作業計画](docs/parallel-work-plan.md)
- [作業A: プレビューUI](docs/plan-a-preview-ui.md)
- [作業B: チャットUI](docs/plan-b-chat-ui.md)
- [作業C: AI連携](docs/plan-c-ai-backend.md)
- [作業D: 状態管理](docs/plan-d-state-management.md)

## 開発

### 使用可能なスクリプト

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動
npm run lint         # ESLint
npm run storybook    # Storybook起動
npm run test         # テスト実行
```

### コード規約

- 不変性（Immutability）を維持する
- 1ファイルあたり200〜400行を目安にする
- a11y（アクセシビリティ）準拠の属性を使用
- TDD（テスト駆動開発）で実装する

詳細は [CLAUDE.md](CLAUDE.md) を参照してください。

## 概念ドキュメント

プロジェクトの概念や設計思想については、以下のドキュメントを参照してください：

- [AI Driven Layer 概念ドキュメント](ai_driven_layer_概念ドキュメント（計画書_仕様書_中間）.md)

## ライセンス

MIT

## 貢献

プルリクエストを歓迎します。大きな変更を提案する場合は、まずIssueを開いて議論してください。

---

**Author**: yuremono
