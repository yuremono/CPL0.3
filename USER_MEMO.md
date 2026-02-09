いいですね、それはもう**環境ハック領域**です。
Claude Code 用にそのまま渡せるレベルで、**Next.js（SWCベース）対応の「ソース位置自動注入」実装**を整理します。

---

# 🎯 目的（あなたの課題の正体）

> **ブラウザで見ている要素 → TSX上の位置を特定したい**

つまり必要なのは：

```
UI要素 ＝ ソースファイル + 行番号
```

これを **開発時だけ自動でDOMに埋め込む**。

---

# 🧠 使う技術

| 用語            | 直訳                          | 意味                                      |
| ------------- | --------------------------- | --------------------------------------- |
| SWC           | Speedy Web Compiler         | Next.jsが内部で使う高速コンパイラ                    |
| AST           | Abstract Syntax Tree（抽象構文木） | コード構造を木構造で表現したもの                        |
| JSX Transform | JSX変換                       | `<div>` を `React.createElement` に変換する処理 |

---

# ✅ 実現方法（Next.js開発環境のみ）

NextはBabelよりSWC優先なので、
**Babelカスタムプラグインを開発時のみ有効化**します。

---

## ① Babel有効化

プロジェクトルートに：

### `.babelrc`

```json
{
  "presets": ["next/babel"],
  "env": {
    "development": {
      "plugins": ["./babel-plugin-source-locator.js"]
    }
  }
}
```

---

## ② カスタムBabelプラグイン作成

### `babel-plugin-source-locator.js`

```js
module.exports = function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path, state) {
        const filename = state.file.opts.filename || "unknown"
        const loc = path.node.loc

        if (!loc) return

        const sourceInfo = `${filename.split("/").pop()}:${loc.start.line}`

        const attr = t.jsxAttribute(
          t.jsxIdentifier("data-source"),
          t.stringLiteral(sourceInfo)
        )

        path.node.attributes.push(attr)
      }
    }
  }
}
```

---

## 💡 何が起きる？

あなたのコード：

```tsx
<button>購入</button>
```

開発ビルド時に自動で：

```html
<button data-source="Pricing.tsx:42">購入</button>
```

がDOMに出現。

---

# 🔍 使い方フロー

1️⃣ ブラウザで要素を右クリック
2️⃣ `data-source="Pricing.tsx:42"` を見る
3️⃣ Claude Code に言う：

> Pricing.tsx 42行目の button を角丸にして

終わり。

---

# 🚀 これが強い理由

| 従来の苦労     | 解決後      |
| --------- | -------- |
| div地獄     | 行番号直指定   |
| コンポーネント迷子 | ファイル名直指定 |
| 説明が長い     | 一発指定     |

---

# 🧠 重要ポイント

| 項目      | 内容                       |
| ------- | ------------------------ |
| 本番ビルド   | 含まれない（env:development限定） |
| パフォーマンス | 影響ほぼなし                   |
| 既存コード修正 | 一切不要                     |
| 動的要素    | 問題なし                     |

---

# ✨ Claude Code に渡す用の説明テンプレ

これも一緒に渡すと理解精度が上がる：

```
This project injects a `data-source="File.tsx:LineNumber"` attribute into JSX elements during development builds.

When I reference UI elements, use this attribute to locate the exact source code position.

Do not remove or refactor these attributes.
Only modify styling or layout unless explicitly told.
```

---

# 🧩 結果

あなたはもう

❌ UI説明マン
ではなく
✅ **UI → ソース直リンク型AI編集環境**

になります。

---

必要なら次出せます：

* Vite版
* SWCネイティブ実装（より高速）
* クリックでファイル開くDevTool拡張

これ、地味に見えて**AIコーディング体験を一段上げる仕組み**です。
