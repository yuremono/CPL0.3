# 作業A: フロントエンド（プレビューUI）

## 概要
プレビューモードの検出、編集可能要素のラッパー、ホバー/クリックによる選択機能を実装する。

## スコープ
- ✅ プレビューモードの検出と切り替え（完了）
- ✅ 型定義（完了）
- ✅ ID生成ユーティリティ（完了）
- ⚪ a11y準拠の属性付与
- ⚪ 編集可能ラッパーコンポーネント
- ⚪ ホバー/クリックによる選択機能
- ⚪ ハイライト表示

## 作成するファイル

### 既に作成済み
```
✅ src/lib/content-projection/types.ts
✅ src/lib/content-projection/generate-id.ts
✅ src/hooks/use-preview-mode.ts
```

### 新規作成
```
src/
├── lib/content-projection/
│   └── attributes.ts                 # a11y属性生成
├── components/content-projection-layer/
│   ├── preview-provider.tsx          # プレビューモードのプロバイダー
│   ├── editable-wrapper.tsx          # 編集可能なラッパー
│   ├── hover-highlight.tsx           # ホバー時のハイライト
│   └── index.ts                      # エクスポート
```

## 実装タスク

### タスク1: a11y属性生成ユーティリティ
**ファイル**: `src/lib/content-projection/attributes.ts`

```typescript
/**
 * a11y準拠の属性を生成する
 */

interface GenerateAttributesOptions {
  id: string
  type: EditableElementType
  content: string
  label?: string
  level?: number
  section?: string
}

export function generateA11yAttributes(options: GenerateAttributesOptions) {
  // 実装
}
```

### タスク2: プレビュープロバイダー
**ファイル**: `src/components/content-projection-layer/preview-provider.tsx`

- URLパラメータ `?mode=preview` を監視
- プレビューモードの状態を提供
- 全ページをラップする

### タスク3: 編集可能ラッパー
**ファイル**: `src/components/content-projection-layer/editable-wrapper.tsx`

- a11y属性を付与
- ダブルクリックで直接編集モード
- ホバーでハイライト
- クリックで選択

### タスク4: ホバー/クリック機能
**ファイル**: `src/components/content-projection-layer/hover-highlight.tsx`

- ホバー時に要素をハイライト（色変更）
- クリック時に選択状態を切り替え
- 選択状態をZustandストアに保存

## 実装の詳細

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
| ホバー | 背景色が変更（例: `bg-yellow-100`） |
| クリック | 選択状態になり、サイドバーに情報を送信 |
| ダブルクリック | 直接編集モードに切り替え |
| 選択状態でクリック | 選択解除 |

## 依存関係
- 他の作業単位に依存しない
- 独立して完了可能

## 期待される成果物
- `?mode=preview` でプレビューモードに切り替え可能
- 要素のホバー/クリックで選択可能
- a11y属性が正しく付与される
- 選択した要素の情報が状態管理に保存される

## テスト項目
- [ ] `?mode=preview` でプレビューモードになる
- [ ] ホバー時に要素がハイライトされる
- [ ] クリックで要素が選択される
- [ ] ダブルクリックで入力モードになる（テキスト要素）
- [ ] a11y属性が正しく付与されている

## 完了条件
1. `attributes.ts` が実装され、a11y属性を生成できる
2. `editable-wrapper.tsx` が実装され、要素をラップできる
3. `hover-highlight.tsx` が実装され、ホバー/クリックが動作する
4. `preview-provider.tsx` が実装され、プレビューモードを制御できる
5. page.tsx に適用し、動作を確認できる

## 次のステップ
この作業が完了したら、以下の作業が並列で開始可能になる：
- 作業B: チャットUI（選択要素の表示）
- 作業C: AI連携（a11y情報を渡す）
- 作業D: 状態管理（選択状態の保存）
