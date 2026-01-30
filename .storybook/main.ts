import type { StorybookConfig } from '@storybook/nextjs-vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// ES Module で __dirname を再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": {
    name: "@storybook/nextjs-vite",
    options: {}
  },
  "staticDirs": [
    "../public"
  ],
  async viteFinal(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, '../src'),
    };
    return config;
  }
};
export default config;
