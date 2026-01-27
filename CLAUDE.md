# Content Projection Layer

このファイルはプロジェクトのルールと地図です。Claudeはこの内容を読み取って作業の文脈を理解します。

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

## 並列作業について

このプロジェクトは**並列作業**を前提として設計されています。

### 並列作業計画
詳細は `docs/parallel-work-plan.md` を参照してください。

### 作業単位の分割

| 作業 | 内容 | ファイル | 依存 |
|------|------|----------|------|
| **A** | プレビューUI（ホバー/選択/ハイライト） | `docs/plan-a-preview-ui.md` | なし |
| **B** | チャットUI（サイドバー/メッセージ） | `docs/plan-b-chat-ui.md` | A |
| **C** | AI連携（プロバイダー/API） | `docs/plan-c-ai-backend.md` | A・D |
| **D** | 状態管理（Zustand/保存/Undo） | `docs/plan-d-state-management.md` | A |

### 並列実行のフロー
```
フェーズ1: 作業Aを先行完了（型定義・基本構造）
    ↓
フェーズ2: 作業B・C・Dを並列実行
    ↓
フェーズ3: 全作業の統合
```

### 並列作業時の注意点
1. **型定義の変更**: 作業Aでの型変更は、他の作業に影響するため事前に調整
2. **Gitコンフリクト**: 異なる作業単位は異なるファイルを扱うため、コンフリクトは最小限
3. **定期的な同期**: 30分〜1時間ごとに進捗を共有

---

## ディレクトリ構造

```
src/
├── app/                      # Next.js app router
│   ├── page.tsx             # メインページ（ポートフォリオ）
│   ├── layout.tsx
│   └── api/                 # APIルート
│       └── ai/
│           └── edit/        # AI編集API
├── components/
│   ├── ui/                  # Radix UIコンポーネント
│   ├── chat/                # チャットUI（作業B）
│   └── content-projection-layer/  # プレビューUI（作業A）
├── hooks/                   # カスタムフック
│   ├── use-preview-mode.ts  # プレビューモード検出
│   ├── use-selected-element.ts
│   └── use-auto-save.ts
├── lib/
│   ├── content-projection/  # CPL共通ライブラリ
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

## Git ワークフロー

- Conventional Commits を使用: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- `main` ブランチに直接コミットしない
- プルリクエストにはレビューを必須とする

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

- `docs/parallel-work-plan.md` - **並列作業計画（必読）**
- `ai_driven_layer_概念ドキュメント（計画書_仕様書_中間）.md` - 概念ドキュメント
- 各作業の詳細計画:
  - `docs/plan-a-preview-ui.md`
  - `docs/plan-b-chat-ui.md`
  - `docs/plan-c-ai-backend.md`
  - `docs/plan-d-state-management.md`
