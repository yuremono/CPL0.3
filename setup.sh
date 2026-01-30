#!/bin/bash

# Z.AI API設定スクリプト
# このスクリプトを実行して環境変数を設定してください

echo "Z.AI GLM Coding Plan セットアップ"
echo "================================"
echo ""

# APIキーの入力
read -p "Z.AIのAPIキーを入力してください: " API_KEY

if [ -z "$API_KEY" ]; then
    echo "エラー: APIキーが入力されていません"
    exit 1
fi

# 環境変数の設定
export ANTHROPIC_AUTH_TOKEN="$API_KEY"
export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"

echo ""
echo "環境変数が設定されました:"
echo "ANTHROPIC_AUTH_TOKEN=$ANTHROPIC_AUTH_TOKEN"
echo "ANTHROPIC_BASE_URL=$ANTHROPIC_BASE_URL"
echo ""

# シェル設定ファイルへの追加を提案
read -p "環境変数を永続的に設定しますか？ (y/n): " ADD_TO_SHELL

if [ "$ADD_TO_SHELL" = "y" ] || [ "$ADD_TO_SHELL" = "Y" ]; then
    SHELL_CONFIG=""
    if [ -f "$HOME/.zshrc" ]; then
        SHELL_CONFIG="$HOME/.zshrc"
    elif [ -f "$HOME/.bashrc" ]; then
        SHELL_CONFIG="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
        SHELL_CONFIG="$HOME/.bash_profile"
    fi
    
    if [ -n "$SHELL_CONFIG" ]; then
        # 既存の設定を削除（あれば）
        sed -i.bak '/ANTHROPIC_AUTH_TOKEN/d' "$SHELL_CONFIG"
        sed -i.bak '/ANTHROPIC_BASE_URL/d' "$SHELL_CONFIG"
        
        # 新しい設定を追加
        echo "" >> "$SHELL_CONFIG"
        echo "# Z.AI API Configuration" >> "$SHELL_CONFIG"
        echo "export ANTHROPIC_AUTH_TOKEN=\"$API_KEY\"" >> "$SHELL_CONFIG"
        echo "export ANTHROPIC_BASE_URL=\"https://api.z.ai/api/anthropic\"" >> "$SHELL_CONFIG"
        
        echo "設定を $SHELL_CONFIG に追加しました"
        echo "変更を反映するには、以下のコマンドを実行してください:"
        echo "source $SHELL_CONFIG"
    else
        echo "シェル設定ファイルが見つかりませんでした"
    fi
fi

echo ""
echo "セットアップが完了しました！"
echo "Claude Codeを起動するには 'claude' コマンドを実行してください"
