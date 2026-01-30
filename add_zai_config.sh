#!/bin/bash

# Z.AI API設定を ~/.zshrc に追加するスクリプト

echo "=========================================="
echo "Z.AI API設定を追加します"
echo "=========================================="
echo ""

# 既存の設定をチェック
if grep -q "ANTHROPIC_AUTH_TOKEN" ~/.zshrc 2>/dev/null; then
    echo "⚠️  既にZ.AIの設定が存在します。"
    read -p "上書きしますか？ (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
        echo "キャンセルしました。"
        exit 0
    fi
    # 既存の設定を削除
    sed -i.bak '/# Z.AI API Configuration for Claude Code/,/export ANTHROPIC_BASE_URL/d' ~/.zshrc
fi

echo ""
echo "Z.AIのAPIキーを入力してください："
read -p "APIキー: " API_KEY

if [ -z "$API_KEY" ]; then
    echo "❌ エラー: APIキーが入力されていません"
    exit 1
fi

# 設定を追加
cat >> ~/.zshrc << EOF

# ============================================
# Z.AI API Configuration for Claude Code
# ============================================
export ANTHROPIC_AUTH_TOKEN="$API_KEY"
export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
EOF

echo ""
echo "✅ 設定を ~/.zshrc に追加しました！"
echo ""
echo "設定を反映するには、以下のコマンドを実行してください："
echo "  source ~/.zshrc"
echo ""
echo "または、新しいターミナルウィンドウを開いてください。"
echo ""
