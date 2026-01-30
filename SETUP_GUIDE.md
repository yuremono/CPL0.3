# Z.AI API設定ガイド - グローバル設定

## 🎯 セットアップ手順（3ステップ）

### ステップ1: APIキーを準備
Z.AIのAPIキーをコピーしておいてください。

### ステップ2: 以下のコマンドを実行

ターミナルで以下のコマンドを1行ずつ実行してください：

```bash
# Z.AI API設定を追加
cat >> ~/.zshrc << 'EOF'

# ============================================
# Z.AI API Configuration for Claude Code
# ============================================
export ANTHROPIC_AUTH_TOKEN="ここにあなたのZ.AIのAPIキーを貼り付けてください"
export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
EOF
```

### ステップ3: 設定を反映

```bash
source ~/.zshrc
```

### ステップ4: 動作確認

```bash
echo $ANTHROPIC_AUTH_TOKEN
echo $ANTHROPIC_BASE_URL
```

両方のコマンドで値が表示されればOKです。

---

## 📝 手動で設定する場合

もし上記のコマンドがうまくいかない場合は、以下の手順で手動設定できます：

1. `~/.zshrc` ファイルを開く：
   ```bash
   open -e ~/.zshrc
   ```
   または
   ```bash
   nano ~/.zshrc
   ```

2. ファイルの**最後の行**に以下を追加：

   ```bash
   # ============================================
   # Z.AI API Configuration for Claude Code
   # ============================================
   export ANTHROPIC_AUTH_TOKEN="ここにあなたのZ.AIのAPIキーを貼り付けてください"
   export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
   ```

3. ファイルを保存して閉じる

4. 設定を反映：
   ```bash
   source ~/.zshrc
   ```

---

## ✅ 完了後の確認

設定が完了したら、新しいターミナルウィンドウを開いてClaude Codeを起動：

```bash
claude
```

これで、Z.AIのGLMモデルを使用してコーディングを開始できます！

---

## 🔧 トラブルシューティング

### 環境変数が設定されない場合

現在のターミナルセッションで直接設定：

```bash
export ANTHROPIC_AUTH_TOKEN="あなたのAPIキー"
export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
```

### 設定を削除したい場合

`~/.zshrc` から以下の行を削除：

```bash
# Z.AI API Configuration for Claude Code
export ANTHROPIC_AUTH_TOKEN="..."
export ANTHROPIC_BASE_URL="..."
```
