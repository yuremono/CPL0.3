# Content Projection Layer

このファイルはプロジェクトのルールと地図です。Claudeはこの内容を読み取って作業の文脈を理解します。

---

## 最も重要なルール

### ユーザーとエージェントの役割分担

**ユーザーはマネージャーであり、実際の作業を行うわけではありません。**

| 役割 | 誰か | 仕事 |
|------|------|------|
| **ユーザー** | マネージャー | ・計画の承認/修正<br>・進捗確認<br>・方向性の指示 |
| **作業A担当** | エージェント（Claude Code） | ・プレビューUIの実装<br>・コード作成<br>・テスト実行 |
| **作業B担当** | エージェント（Claude Code） | ・チャットUIの実装<br>・コード作成<br>・テスト実行 |
| **作業C担当** | エージェント（Claude Code） | ・AI連携の実装<br>・コード作成<br>・テスト実行 |
| **作業D担当** | エージェント（Claude Code） | ・状態管理の実装<br>・コード作成<br>・テスト実行 |

**絶対に遵守してください**:
- ユーザーはコードを書きません
- ユーザーはテストを実行しません
- ユーザーはファイルを編集しません
- **すべての実作業はエージェントが行います**

ユーザーが「4つのターミナルを開く」というのは、「4つのエージェントを並列で起動する」ことを意味します。

---

## 並列作業のワーク固有設定

各作業単位（A・B・C・D）にはワーク固有の設定ファイルがあります：
- `work-a/CLAUDE.md` - 作業A（プレビューUI）の固有設定
- `work-b/CLAUDE.md` - 作業B（チャットUI）の固有設定
- `work-c/CLAUDE.md` - 作業C（AI連携）の固有設定
- `work-d/CLAUDE.md` - 作業D（状態管理）の固有設定

**各作業担当者は、自分の作業固有設定を必ず参照してください。**

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

## 並列作業について

このプロジェクトは**並列作業**を前提として設計されています。

### 環境設定

**前提**: ユーザーは同じMacの同じプロジェクトフォルダで、4つ以上ののターミナルウィンドウを開いてclaude codeを並列で立ち上げます。

```
~/Desktop/ContentProjectionLayer/
```

### 自動読み込みされるスキル

プロジェクト固有のスキルファイルが `.claude/skills/` に配置されており、自動的に読み込まれます：

- `.claude/skills/start-work-a.md` - 作業A（プレビューUI）のワークフロー
- `.claude/skills/start-work-b.md` - 作業B（チャットUI）のワークフロー
- `.claude/skills/start-work-c.md` - 作業C（AI連携）のワークフロー
- `.claude/skills/start-work-d.md` - 作業D（状態管理）のワークフロー

**スキルファイルの役割**: 各作業の担当範囲、編集権限、ワークフローを定義します。担当は「ユーザーからの明示的な指示」で認識します。

### 進捗管理
- **全体進捗**: `docs/progress-report.md` - まずはここを確認（全体の進捗サマリー）
- **各作業進捗**: `work-{id}/progress.md` - 各作業の詳細進捗

### 並列作業計画
詳細は `docs/parallel-work-plan.md` を参照してください。

### 作業単位の分割

| 作業 | 内容 | 担当ファイル | 依存 |
|------|------|-------------|------|
| **A** | プレビューUI（ホバー/選択/ハイライト） | `src/components/content-projection-layer/`, `src/lib/content-projection/` | なし |
| **B** | チャットUI（サイドバー/メッセージ） | `src/components/chat/`, `src/stores/chat-store.ts` | A |
| **C** | AI連携（プロバイダー/API） | `src/lib/ai/`, `src/app/api/ai/` | A・D |
| **D** | 状態管理（Zustand/保存/Undo） | `src/stores/`, `src/lib/storage/`, `src/hooks/use-*.ts` | A |

### 並列実行のフロー
```
フェーズ1: 作業Aを先行完了（型定義・基本構造）
    ↓
フェーズ2: 作業B・C・Dを並列実行
    ↓
フェーズ3: 全作業の統合
```

### 並列作業時の注意点（同じフォルダで作業する場合）

1. **編集権限の遵守**: 各作業担当者は自分の担当ファイルのみ編集可
   - **編集可**: 担当する実装ファイル、`work-{id}/progress.md`
   - **編集不可**: 他の作業の実装ファイル、`docs/progress-report.md`

2. **ファイル単位での担当分け**: 同じファイルを複数のターミナルで編集しない

3. **コミット前の同期**: コミット前に `git status` で他の作業による変更を確認

4. **型定義の変更**: 作業Aでの型変更は、他の作業に影響するため事前に調整

5. **コミットメッセージ**: Conventional Commits形式（`feat:`, `fix:`, `refactor:`, `test:`等）を使用

### ファイル編集権限一覧

| 担当者 | 編集可能 | 編集不可 |
|------|----------|----------|
| 全員 | `work-{id}/progress.md` | 他の作業の実装ファイル、`docs/progress-report.md` |
| マネージャーのみ | `docs/progress-report.md` | 全員 |

**ルール**: 他の作業の実装ファイルを編集しない。進捗報告は `work-{id}/progress.md` のみ更新する。

### Git ワークフロー（統合ブランチ方式）

同じフォルダで並列作業する場合、**統合ブランチ方式**を使用します：

```bash
# 全ターミナル共通：統合ブランチを作成
git checkout main
git pull origin main
git checkout -b feature/integration

# 各ターミナルで、担当ファイルを編集
# コミットは誰でも行えるが、編集中のファイルは重複しないように注意
```

**コミット時の注意**:
- コミット前に `git status` で変更内容を確認
- 他の作業が編集中のファイルを含んでいないか確認
- コミットメッセージに担当作業を明記（例: `feat(chat-ui): サイドバーコンポーネント実装`）

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

- `docs/parallel-work-plan.md` - **並列作業計画（必読）**
- `ai_driven_layer_概念ドキュメント（計画書_仕様書_中間）.md` - 概念ドキュメント
- 各作業の詳細計画:
  - `docs/plan-a-preview-ui.md`
  - `docs/plan-b-chat-ui.md`
  - `docs/plan-c-ai-backend.md`
  - `docs/plan-d-state-management.md`
