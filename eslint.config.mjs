import astroPlugin from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: [
      '.astro/**',
      '.vercel/**',
      'dist/**',
      'node_modules/**',
    ],
  },
  // Base config for JS/TS/JSX/TSX/Astro
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,astro}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  // Astro specific config
  ...astroPlugin.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroPlugin.parser,
      parserOptions: {
        extraFileExtensions: ['.astro'],
      },
    },
  },
];
