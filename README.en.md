# Content Projection Layer

An intermediate layer that enables AI-driven editing experiences. Users can edit website content while conversing with an AI chatbot.

## Overview

**Content Projection Layer (CPL)** provides the following features:

- **AI-powered editing**: Click to select elements and request edits from AI
- **Direct editing**: Double-click for text input, drag & drop for images
- **Auto-save**: Edits are automatically saved to IndexedDB
- **Real-time preview**: See edit results immediately
- **Build functionality**: Deploy to production with one click (ISR/SSG)

## Tech Stack

- **Framework**: Next.js 16.1.4 + React 19.2.3 + TypeScript
- **Styling**: Tailwind CSS 4 + Neo-Brutalism design
- **UI Components**: Radix UI
- **State Management**: Zustand
- **AI Providers**: OpenAI / Anthropic / Google (multi-vendor support)
- **Persistence**: IndexedDB

## Preview

Includes a sample implementation of a portfolio website.

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yuremono/ContentProjectionLayer.git
cd ContentProjectionLayer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Set AI provider API keys in `.env.local`:

```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_GOOGLE_API_KEY=...
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Enable Preview Mode

To enable preview mode, add a query parameter to the URL:

```
http://localhost:3000?mode=preview
```

### 6. Try the Demo Page

To experience Content Projection Layer features, visit the demo page:

```
# Normal mode
http://localhost:3000/demo

# Preview mode (editable)
http://localhost:3000/demo?mode=preview
```

On the demo page, you can experience:
- Elements highlight on hover
- Click to select elements
- Verify a11y attributes are applied

For details, see the [Quick Start Guide](docs/QUICKSTART.md).

## Project Structure

```
src/
├── app/                      # Next.js app router
├── components/
│   ├── ui/                   # Radix UI components
│   ├── chat/                 # Chat UI
│   └── content-projection-layer/  # Preview UI
├── hooks/                    # Custom hooks
├── lib/
│   ├── content-projection/   # CPL common libraries
│   ├── ai/                   # AI providers
│   └── storage/              # Persistence
└── stores/                   # Zustand stores
```

## Parallel Development

This project is designed for parallel development. For details, refer to the following documents:

- **[Manager Instructions](docs/instructions.md)** - Specific instructions for each terminal (latest)
- **[Overall Progress Report](docs/progress-report.md)** - Overall progress status
- [Parallel Work Plan](docs/parallel-work-plan.md) - Branch strategy and workflow
- [Work A: Preview UI](docs/plan-a-preview-ui.md)
- [Work B: Chat UI](docs/plan-b-chat-ui.md)
- [Work C: AI Integration](docs/plan-c-ai-backend.md)
- [Work D: State Management](docs/plan-d-state-management.md)

### Branch Strategy

Each work unit operates on an independent feature branch:

| Work | Branch Name |
|------|-------------|
| Work A: Preview UI | `feature/preview-ui` |
| Work B: Chat UI | `feature/chat-ui` |
| Work C: AI Integration | `feature/ai-integration` |
| Work D: State Management | `feature/state-management` |

### Starting Work

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create work branch
git checkout -b feature/{work-name}

# 3. Implementation work (refer to each work plan)

# 4. Periodic sync (every 30-60 minutes)
git fetch origin
git rebase origin/main

# 5. When work is complete
git push -u origin feature/{work-name}
# Create PR on GitHub
```

### Pull Request Flow

1. Implement on each work branch
2. After testing is complete, create PR
3. Receive code review
4. Merge to main branch (Squash and Merge recommended)
5. Delete branch after merge

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run storybook    # Start Storybook
npm run test         # Run tests
```

### Code Conventions

- Maintain immutability
- Aim for 200-400 lines per file
- Use a11y-compliant attributes
- Implement with TDD (Test-Driven Development)

For details, see [CLAUDE.md](CLAUDE.md).

## Concept Documentation

For project concepts and design philosophy, refer to:

- [AI Driven Layer Concept Document](ai_driven_layer_概念ドキュメント（計画書_仕様書_中間）.md)

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss.

---

**Author**: yuremono
