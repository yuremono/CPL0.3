# ブランチ戦略

**作成日**: 2026-02-04
**対象**: 全開発者

## 概要

Content Projection Layer プロジェクトは、並列作業を前提とした開発体制を採用しています。本ドキュメントでは、ブランチ戦略と運用ルールを定義します。

---

## ブランチ命名規則

### メインブランチ

| ブランチ名 | 用途 |
|-----------|------|
| `main` | 本番環境向けの安定版 |

### 作業ブランチ

| プレフィックス | 用途 | 例 |
|--------------|------|-----|
| `feature/` | 新機能開発 | `feature/integration`, `feature/chat-ui` |
| `fix/` | バグ修正 | `fix/preview-highlight` |
| `hotfix/` | 緊急修正 | `hotfix/critical-memory-leak` |

---

## ブランチ運用ルール

### 並列作業方式（統合ブランチ方式）

本プロジェクトでは、**同じMacの同じプロジェクトフォルダ**で複数のターミナルを開いて並列作業を行います。

**重要**: `.git` は1つしか存在しないため、1つのターミナルでブランチを切り替えると、全てのターミナルで同じブランチが有効になります。

### 統合ブランチの使用

全てのターミナルで **`feature/integration`** ブランチを使用し、ファイル単位で担当を分けます。

#### 作業開始時の手順

```bash
# 1回だけ実行（どれか1つのターミナルで）
git checkout main
git pull origin main
git checkout -b feature/integration
```

**各ターミナルで行うこと**:
1. 担当するファイルのみを編集
2. コミットは各担当者が行う
3. プッシュはマネージャーのみが行う

### ファイル単位の担当分け

| 作業 | 担当ファイル |
|------|-------------|
| A: プレビューUI | `src/components/content-projection-layer/`, `src/lib/content-projection/`, `src/hooks/use-preview-mode.ts` |
| B: チャットUI | `src/components/chat/`, `src/stores/chat-store.ts` |
| C: AI連携 | `src/lib/ai/`, `src/app/api/ai/` |
| D: 状態管理 | `src/stores/`（`chat-store.ts` 除く）, `src/lib/storage/`, `src/hooks/use-selected-element.ts`, `src/hooks/use-auto-save.ts` |

---

## マージ戦略

### 推奨方式: Squash and Merge

ブランチをマージする際は、**Squash and Merge** を使用します。

**理由**:
- 履歴がシンプルになる
- 複数のコミットを1つの論理的な変更にまとめられる
- メインブランチの履歴が汚れない

### マージのフロー

```bash
# 1. 最新の状態に同期
git checkout feature/integration
git pull origin feature/integration

# 2. マージ先のブランチに切り替え
git checkout main
git pull origin main

# 3. マージ実行（Squash and Merge）
git merge --squash feature/integration
git commit -m "feat: 統合ブランチの変更をマージ"

# 4. リモートにプッシュ
git push origin main
```

---

## コミット前の同期手順

### 定期的な同期

並列作業中は、定期的にリモートと同期してください。

```bash
# リモートの最新を取得
git fetch origin

# 統合ブランチにマージ
git checkout feature/integration
git merge origin/feature/integration

# 競合があれば解決
git status
# 競合ファイルを編集して解決後
git add .
git commit -m "chore: リモートとの同期"
```

### Rebase による履歴整理

```bash
# 最新の main に rebase
git checkout feature/integration
git fetch origin
git rebase origin/main

# 競合があれば解決
# 続行: git rebase --continue
# 中止: git rebase --abort
```

---

## PR作成フロー

### プルリクエストの作成

機能が完成したら、プルリクエストを作成します。

```bash
# GitHub CLI を使用する場合
gh pr create \
  --title "feat: チャットUIの実装" \
  --body "実装内容の説明" \
  --base main \
  --head feature/integration
```

### PRテンプレート

```markdown
## 概要
<!-- 何を実装したか -->

## 変更内容
- 変更1
- 変更2
- 変更3

## 関連 issue
<!-- 関連する issue 番号 -->

## テスト計画
- [ ] ユニットテスト
- [ ] 結合テスト
- [ ] E2Eテスト

## スクリーンショット（UI変更の場合）
<!-- 変更前後のスクリーンショット -->
```

---

## GitHub操作のルール

### 権限の分離

| 操作 | 誰が行うか |
|------|-----------|
| `git add` / `git commit` | 各作業担当エージェント |
| `git push` | **マネージャー（作業A担当）のみ** |
| `git pull` | マネージャーのみ |

### 作業完了時のフロー

**各作業担当者（B・C・D）**:
```bash
# 変更を確認
git status

# 担当ファイルのみをステージ
git add src/components/chat/

# ローカルコミット（担当を明記）
git commit -m "feat(chat-ui): サイドバーコンポーネント実装"
# プッシュはしない！
```

**マネージャー（作業A担当）**:
```bash
# 全変更を確認
git status

# リモートと同期
git pull origin feature/integration

# 全てのローカルコミットをプッシュ
git push origin feature/integration
```

---

## コミットメッセージ規約

### Conventional Commits 形式

```
<type>: <description>

[optional body]
```

### 種類（Types）

| 種類 | 用途 | 例 |
|------|------|-----|
| `feat` | 新機能 | `feat(chat-ui): サイドバーコンポーネント実装` |
| `fix` | バグ修正 | `fix(preview): ハイライト表示の修正` |
| `refactor` | リファクタリング | `refactor(store): 状態管理の整理` |
| `docs` | ドキュメントのみの変更 | `docs: READMEの更新` |
| `test` | テストの追加・修正 | `test(attributes): a11y属性のテスト追加` |
| `chore` | ビルドプロセスやライブラリの更新など | `chore: 依存ライブラリの更新` |
| `perf` | パフォーマンス改善 | `perf(storage): IndexedDBのクエリ最適化` |
| `ci` | CI設定の変更 | `ci: GitHub Actionsの設定追加` |

### 作業単位の明記

コミットメッセージには、必ず作業単位を明記してください。

```
<type>(<scope>): <description>
```

- `<scope>`: 担当作業（例: `chat-ui`, `ai-backend`, `state-management`）
- `<description>: 簡潔な説明

**良い例**:
```
feat(chat-ui): メッセージ一覧コンポーネント実装
fix(ai-backend): APIエラーハンドリングの修正
refactor(state-management): Undo/Redoのロジック整理
```

---

## よくある質問（FAQ）

### Q1: 同じファイルを複数のターミナルで編集したい場合

**A**: マネージャーに相談してください。基本的には、1つのファイルは1人の担当者が編集します。どうしても必要な場合は、マネージャーが調整します。

### Q2: ブランチを切り替えると他のターミナルにも影響しますか？

**A**: はい。同じ `.git` ディレクトリを共有しているため、1つのターミナルで `git checkout` すると、全てのターミナルで同じブランチが有効になります。これが並列作業では統合ブランチ方式を使用する理由です。

### Q3: 競合が発生したらどうすればよいですか？

**A**: 以下の手順で解決してください。

```bash
# 1. 競合の状態を確認
git status

# 2. 競合ファイルを編集して解決
# <<<<<<< と >>>>>>> のマーカーを削除

# 3. 解決済みのファイルをステージ
git add <解決したファイル>

# 4. コミット
git commit -m "chore: 競合を解決"
```

### Q4: マネージャー以外がプッシュする必要がある場合は？

**A**: 基本的にはプッシュはマネージャーのみが行います。緊急時や例外的な場合は、マネージャーの許可を得てからプッシュしてください。

### Q5: 作業が途中で完了しない場合どうすればよいですか？

**A**: 以下の手順で途中経過を保存してください。

```bash
# 変更をステージ
git add .

# 作業中であることを明記してコミット
git commit -m "WIP(chat-ui): サイドバー実装中"
```

### Q6: 他の作業の進捗を知りたい場合

**A**: `docs/parallel-work-plan.md` と `docs/PROGRESS.md` を参照してください。また、マネージャーに確認することもできます。

---

## 関連ドキュメント

- `docs/parallel-work-plan.md` - 並列作業計画の詳細
- `CLAUDE.md` - プロジェクト全体のルールと設定
- `docs/PROGRESS.md` - 全体の進捗管理
