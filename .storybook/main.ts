import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../packages/react/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@omarihab/form-engine-core': new URL('../packages/core/src/index.ts', import.meta.url).pathname,
      '@omarihab/form-engine-react': new URL('../packages/react/src/index.ts', import.meta.url).pathname,
    };
    return config;
  },
};

export default config;
