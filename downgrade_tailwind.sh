#!/bin/bash
# Tailwind CSS v4 から v3 にダウングレード

cd /Users/yanoseiji/Desktop/Z.AI-coding-on-claude-code

echo "=== Tailwind CSS v3 にダウングレード ==="

# Tailwind CSS v4 をアンインストール
npm uninstall tailwindcss @tailwindcss/postcss

# Tailwind CSS v3 をインストール
npm install -D tailwindcss@^3 postcss autoprefixer

# tailwind.config.ts を作成
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#4A6FA5',
          light: '#6B8DB8',
          dark: '#3A5A8A',
        },
      },
    },
  },
  plugins: [],
};
export default config;
EOF

# postcss.config.mjs を更新
cat > postcss.config.mjs << 'EOF'
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;
EOF

# globals.css を v3 用に更新
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-white: #FFFFFF;
  --color-black: #0A0A0A;
  --color-accent: #4A6FA5;
  --color-accent-light: #6B8DB8;
  --color-accent-dark: #3A5A8A;

  --border-width: 2px;
  --border-thick: 3px;
}

* {
  box-sizing: border-box;
}

body {
  background: var(--color-white);
  color: var(--color-black);
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
}

/* Neo-Brutalism Borders */
.brutal-border {
  border: var(--border-width) solid var(--color-black);
}

.brutal-border-thick {
  border: var(--border-thick) solid var(--color-black);
}

/* Neo-Brutalism Shadow */
.brutal-shadow {
  box-shadow: 4px 4px 0 0 var(--color-black);
}

.brutal-shadow-lg {
  box-shadow: 6px 6px 0 0 var(--color-black);
}

.brutal-shadow-sm {
  box-shadow: 2px 2px 0 0 var(--color-black);
}
EOF

echo "=== 完了 ==="
echo "Storybook を再起動してください: npm run storybook"
