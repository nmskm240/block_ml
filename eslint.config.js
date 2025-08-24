import js from '@eslint/js';
import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';

export default [
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTs,
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
      import: eslintPluginImport,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // JS/TS 推奨
      ...js.configs.recommended.rules,
      ...eslintPluginTs.configs.recommended.rules,

      // React Hooks
      ...reactHooks.configs['recommended-latest'].rules,

      // React Refresh (開発用)
      ...reactRefresh.configs.recommended.rules,

      // import 管理
      ...eslintPluginImport.configs.recommended.rules,
      ...eslintPluginImport.configs.typescript.rules,

      'import/no-unresolved': 'off',
      'import/first': 'error',

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          pathGroups: [
            // 副作用のあるインポートをキャッチする
            { pattern: '^\\u0000', group: 'builtin', position: 'before' },
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'next/**', group: 'internal', position: 'before' },
            { pattern: '@/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],

      // Next.js 向けの推奨ルール
      'react/react-in-jsx-scope': 'off',
      'import/no-anonymous-default-export': 'error',
    },
  },
  prettierConfig,
];
