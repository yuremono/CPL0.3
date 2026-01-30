# Z.AI API設定マニュアル

## クイックセットアップ（推奨）

以下のコマンドを実行して、対話形式でセットアップできます：

```bash
chmod +x setup.sh
./setup.sh
```

## 手動セットアップ

### 方法1: 現在のシェルセッションのみ（一時的）

ターミナルで直接実行：

```bash
export ANTHROPIC_AUTH_TOKEN="あなたのZ.AIのAPIキー"
export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
```

### 方法2: シェル設定ファイルに追加（永続的）

#### zshを使用している場合

```bash
echo '' >> ~/.zshrc
echo '# Z.AI API Configuration' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="あなたのZ.AIのAPIキー"' >> ~/.zshrc
echo 'export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"' >> ~/.zshrc
source ~/.zshrc
```

#### bashを使用している場合

```bash
echo '' >> ~/.bashrc
echo '# Z.AI API Configuration' >> ~/.bashrc
echo 'export ANTHROPIC_AUTH_TOKEN="あなたのZ.AIのAPIキー"' >> ~/.bashrc
echo 'export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"' >> ~/.bashrc
source ~/.bashrc
```

### 方法3: .envファイルを使用（プロジェクト単位）

プロジェクトルートに `.env` ファイルを作成：

```bash
cat > .env << EOF
ANTHROPIC_AUTH_TOKEN=あなたのZ.AIのAPIキー
ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
EOF
```

環境変数を読み込む：

```bash
export $(cat .env | xargs)
```

## 動作確認

環境変数が正しく設定されているか確認：

```bash
echo $ANTHROPIC_AUTH_TOKEN
echo $ANTHROPIC_BASE_URL
```

## Claude Codeの起動

環境変数が設定されたら、Claude Codeを起動：

```bash
claude
```
