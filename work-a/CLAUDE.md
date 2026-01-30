# Work Unit A: Preview UI - Claude Settings

このファイルは作業A（プレビューUI実装）固有のルールと設定です。

## 作業の範囲と目的

プレビューモードの検出、編集可能要素のラッパー、ホバー/クリックによる選択機能を実装します。

### 主な機能
- `?mode=preview` クエリパラメータでプレビューモードを検出
- a11y準拠の属性を生成して要素に付与
- ホバー時に要素をハイライト（色変更）
- クリックで要素を選択
- ダブルクリックで直接編集モード（開発中）

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
// プレビューモード時に付与する属性例
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

### CSSクラス
- `.hover-highlight`: ホバー時のハイライト（黄色の背景と点線）
- `.selected`: 選択時のハイライト（青色の背景と実線）

### 不変性の維持
```typescript
// 良い例: 不変性の維持
const newElements = [...elements, newElement]

// 悪い例: 直接変更
elements.push(newElement)
```

## テストの実行方法

```bash
# すべてのテストを実行
npx vitest run --project node

# 特定のテストファイルを実行
npx vitest run --project node src/components/content-projection-layer/__tests__/preview-provider.test.tsx
```

## ビルドの確認方法

```bash
# ビルドを実行
npm run build

# 開発サーバーを起動
npm run dev
```

## 完了条件

1. `attributes.ts` が実装され、a11y属性を生成できる
2. `editable-wrapper.tsx` が実装され、要素をラップできる
3. `hover-highlight.tsx` が実装され、ホバー/クリックが動作する
4. `preview-provider.tsx` が実装され、プレビューモードを制御できる
5. すべてのテストがパスする（24テスト）
6. ビルドが成功する

## 進捗報告

作業完了時または進捗がある場合は、`progress.md` を更新してください。

## マネージャーへの連絡

- 進捗報告: `work-a/progress.md` を更新
- ブロッカー発生: 即座に報告
- 質問がある: マネージャー（伝達役経由）に相談

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

### Test Files
- `src/lib/content-projection/__tests__/attributes.test.ts` (8 tests)
- `src/components/content-projection-layer/__tests__/preview-provider.test.tsx` (3 tests)
- `src/components/content-projection-layer/__tests__/editable-wrapper.test.tsx` (7 tests)
- `src/components/content-projection-layer/__tests__/hover-highlight.test.tsx` (6 tests)

## 実装完了時の状態

作業Aは完了済みです。
- 24テスト全てパス
- ビルド成功
- デモページ作成済み
