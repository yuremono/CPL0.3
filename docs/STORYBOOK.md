# Storybook Guide

**Last Updated**: 2026-02-05
**Version**: 10.2.0

## Overview

Storybook is already installed and configured in the Content Projection Layer project. This document describes the current setup, how to use it, and next steps for building a design system.

---

## Current Status

### Installed Components

Storybook **10.2.0** is installed with the following configuration:

| Component | Version | Purpose |
|-----------|---------|---------|
| `storybook` | ^10.2.0 | Core Storybook framework |
| `@storybook/nextjs-vite` | ^10.2.0 | Next.js integration with Vite |
| `@storybook/addon-a11y` | ^10.2.0 | Accessibility testing |
| `@storybook/addon-docs` | ^10.2.0 | Documentation generation |
| `@storybook/addon-onboarding` | ^10.2.0 | First-run onboarding |
| `@storybook/addon-vitest` | ^10.2.0 | Vitest integration |
| `@chromatic-com/storybook` | ^5.0.0 | Chromatic for visual testing |
| `eslint-plugin-storybook` | ^10.2.0 | ESLint integration |

### Configuration Files

```
.storybook/
├── main.ts              # Main Storybook configuration
├── preview.ts           # Preview configuration
├── preview-head.html    # HTML head additions
└── vitest.setup.ts      # Vitest setup for testing
```

---

## Available Scripts

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook
```

---

## Starting Storybook

### Development Mode

```bash
npm run storybook
```

Storybook will be available at [http://localhost:6006](http://localhost:6006).

### Production Build

```bash
npm run build-storybook
```

The static build will be output to `storybook-static/`.

---

## Creating Stories

### Basic Story Structure

Stories are located in `src/stories/` or alongside components in `*.stories.ts` files.

```typescript
// src/components/Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};
```

### Story Organization

Recommended structure for Content Projection Layer:

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Button.stories.ts
│   │   ├── Dialog.tsx
│   │   └── Dialog.stories.ts
│   ├── chat/
│   │   ├── ChatSidebar.tsx
│   │   └── ChatSidebar.stories.ts
│   └── content-projection-layer/
│       ├── EditableWrapper.tsx
│       └── EditableWrapper.stories.ts
└── stories/
    ├── Introduction.stories.ts
    └── pages/
        ├── HomePage.stories.ts
        └── DemoPage.stories.ts
```

---

## Design System Roadmap

### Phase 1: Core UI Components

Create stories for existing Radix UI components:

- [ ] Button
- [ ] Dialog
- [ ] Dropdown Menu
- [ ] Tabs
- [ ] Other UI components

### Phase 2: Feature Components

Create stories for feature-specific components:

**Chat UI**:
- [ ] ChatSidebar
- [ ] MessageList
- [ ] MessageInput
- [ ] ElementInfoCard
- [ ] LoadingIndicator

**Preview UI**:
- [ ] EditableWrapper
- [ ] HoverHighlight
- [ ] PreviewProvider

### Phase 3: Documentation

- [ ] Component usage guidelines
- [ ] Design tokens documentation
- [ ] Accessibility guidelines
- [ ] Theming documentation

### Phase 4: Visual Testing

- [ ] Configure Chromatic for visual regression testing
- [ ] Set up automated visual testing in CI/CD

---

## Next Steps

To build a comprehensive design system:

1. **Create Component Stories**
   - Start with core UI components (Button, Dialog, etc.)
   - Add documentation using `@storybook/addon-docs`
   - Include accessibility testing with `@storybook/addon-a11y`

2. **Establish Design Tokens**
   - Define colors, spacing, typography
   - Document in Storybook MDX files
   - Consider using CSS variables or Tailwind config

3. **Add Visual Testing**
   - Integrate Chromatic for visual regression testing
   - Add screenshots to CI/CD pipeline

4. **Build Component Library**
   - Document component variants
   - Show real-world usage examples
   - Create interactive playgrounds

---

## Configuration Details

### `.storybook/main.ts`

Main configuration includes:
- Next.js integration via Vite
- Autodocs addon for automatic documentation
- File watching patterns for stories

### `.storybook/preview.ts`

Preview configuration includes:
- Global decorators
- Global parameters
- Theme configuration

---

## Troubleshooting

### Common Issues

**Issue**: Storybook doesn't start

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules/.cache
npm install
npm run storybook
```

**Issue**: Components not rendering correctly

**Solution**: Ensure Tailwind CSS is properly configured in `.storybook/preview-head.html`:
```html
<link href="/tailwind.css" rel="stylesheet">
```

---

## Resources

- [Official Storybook Documentation](https://storybook.js.org/docs/)
- [Storybook for Next.js](https://storybook.js.org/docs/get-started/install/nextjs)
- [Chromatic Documentation](https://www.chromatic.com/docs)

---

## Summary

**Status**: Storybook is installed and configured. Component stories need to be created.

**Priority**:
1. Create stories for core UI components
2. Add feature component stories
3. Build comprehensive documentation
4. Set up visual testing

**Estimated Effort**: 2-3 days for initial component stories, ongoing for design system maintenance.
