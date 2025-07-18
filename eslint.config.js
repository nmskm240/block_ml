import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginTs from '@typescript-eslint/eslint-plugin'
import parserTs from '@typescript-eslint/parser'
import { globalIgnores } from 'eslint/config'

export default [
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTs,
      ecmaVersion: 2020,
      globals: globals.browser,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    extends: [
      js.configs.recommended,
      'plugin:@typescript-eslint/recommended',
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
  },
]
