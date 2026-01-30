#!/bin/bash
set -e

echo "=== Node.js インストールスクリプト ==="

# Homebrew のインストール確認
if ! command -v brew &> /dev/null; then
    echo "Homebrew をインストールします..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Apple Silicon Mac の場合
    if [ -d "/opt/homebrew" ]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    echo "Homebrew は既にインストールされています"
fi

# Node.js のインストール確認
if ! command -v node &> /dev/null; then
    echo "Node.js をインストールします..."
    brew install node
else
    echo "Node.js は既にインストールされています: $(node --version)"
fi

echo "=== インストール完了 ==="
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
