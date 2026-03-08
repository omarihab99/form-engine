import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'core',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/packages/core'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'packages/core/tsconfig.json' }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/packages/core/src/$1',
      },
    },
    {
      displayName: 'react',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/packages/react'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'packages/react/tsconfig.json' }],
      },
      moduleNameMapper: {
        '^@omarihab/form-engine-core$': '<rootDir>/packages/core/src/index.ts',
        '^@omarihab/form-engine-core/(.*)$': '<rootDir>/packages/core/src/$1',
      },
    },
    {
      displayName: 'spfx',
      testEnvironment: 'node',
      roots: ['<rootDir>/packages/spfx'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'packages/spfx/tsconfig.json' }],
      },
      moduleNameMapper: {
        '^@omarihab/form-engine-core$': '<rootDir>/packages/core/src/index.ts',
        '^@omarihab/form-engine-core/(.*)$': '<rootDir>/packages/core/src/$1',
      },
    },
  ],
};

export default config;
