# Work Unit A: Preview UI - Claude Settings

このファイルは作業A（プレビューUI実装）固有のルールと設定です。

---

## 最も重要なルール

### あなたは作業A担当兼マネージャーです

**あなた（作業A担当エージェント）がマネージャーを兼任しています。**

| 役割 | 誰か | 仕事 |
|------|------|------|
| **ユーザー** | クライアント/オーナー | ・要件定義<br>・計画の承認<br>・進捗確認 |
| **あなた（作業A担当兼マネージャー）** | エージェント（Claude Code） | ・全体の調整・管理<br>・作業A（プレビューUI）の実装<br>・進捗報告 |
| **作業B担当** | エージェント（Claude Code） | ・チャットUIの実装 |
| **作業C担当** | エージェント（Claude Code） | ・AI連携の実装 |
| **作業D担当** | エージェント（Claude Code） | ・状態管理の実装 |

**絶対に遵守してください**:
- ユーザーに「作業を開始してください」と聞かない
- ユーザーにコードを書かせない
- ユーザーにテストを実行させない
- **あなたがすべての実作業を行います**

ユーザーからの指示は「この機能を実装して」「このバグを修正して」という形で来ます。その指示を受けた**あなたが**実行します。

---

## 📋 進捗報告（必ず目を通してください）

### 進捗報告のタイミング
以下の場合は必ず進捗報告を行ってください：
- ✅ 作業完了時
- ✅ 1日以上作業した場合
- ✅ 週の終わり
- ✅ 問題が発生した場合

### 進捗報告の手順
1. **テンプレート確認**: `docs/REPORTING.md` を確認してください
2. **日報作成**: テンプレートに従って進捗を記載してください
3. **提出先**: `docs/PROGRESS.md` と `work-a/progress.md` に報告してください

### 進捗報告テンプレート（簡易版）

作業終了時に以下の形式で報告してください：

```
## 進捗報告 - 作業A ({日付})

### 完了したタスク
- [x] タスク1
- [x] タスク2

### 作成/更新したファイル
- `path/to/file.ts` (変更内容の説明)

### 次のステップ
- 次に行う作業
```

---

## 作業の範囲と目的

プレビューモードの検出、編集可能要素のラッパー、ホバー/クリックによる選択機能を実装します。

### 主な機能
- `?mode=preview` クエリパラメータでプレビューモードを検出
- a11y準拠の属性を生成して要素に付与
- ホバー時に要素をハイライト（色変更）
- クリックで要素を選択
- ダブルクリックで直接編集モード

## 使用する型・インターフェース

```typescript
// src/lib/content-projection/types.ts
export type PreviewMode = 'preview' | 'edit'
export type EditableElementType = 'text' | 'heading' | 'paragraph' | 'link' | 'image' | 'button' | 'list' | 'listitem'

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
```

## 依存する他の作業

なし（この作業は他の作業に依存しない）

## 作業固有のルールや注意点

### a11y属性の構造
```tsx
<div
  data-cpl-id="blk_abc123"
  data-cpl-type="heading"
  data-cpl-editable="true"
  role="heading"
  aria-level="2"
  aria-label="ヒーローセクションのメイン見出し"
>
  <h2>Creative Developer</h2>
</div>
```

### ホバー/クリックの挙動
| 操作 | 挙動 |
|------|------|
| ホバー | 背景色が変更（`bg-yellow-100`の黄色半透明） |
| クリック | 選択状態になり、情報を保存 |
| ダブルクリック | 直接編集モードに切り替え |

## テストの実行方法

```bash
npx vitest run --project node
```

## ビルドの確認方法

```bash
npm run build
npm run dev
```

## 完了条件

1. `attributes.ts` が実装され、a11y属性を生成できる
2. `editable-wrapper.tsx` が実装され、要素をラップできる
3. `hover-highlight.tsx` が実装され、ホバー/クリックが動作する
4. `preview-provider.tsx` が実装され、プレビューモードを制御できる
5. すべてのテストがパスする
6. ビルドが成功する

## 作成したファイル

### Core Library Files
- `src/lib/content-projection/types.ts`
- `src/lib/content-projection/generate-id.ts`
- `src/lib/content-projection/attributes.ts`
- `src/lib/utils.ts`

### Component Files
- `src/components/content-projection-layer/preview-provider.tsx`
- `src/components/content-projection-layer/editable-wrapper.tsx`
- `src/components/content-projection-layer/hover-highlight.tsx`
- `src/components/content-projection-layer/index.ts`

### Hook Files
- `src/hooks/use-preview-mode.ts`

## 実装完了時の状態

作業Aは完了済みです。
- 24テスト全てパス
- ビルド成功
- デモページ作成済み
