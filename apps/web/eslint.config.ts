import base from '@corgi-ai/config/eslint';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default defineConfig(base, reactHooks.configs.flat.recommended, reactRefresh.configs.vite, {
  languageOptions: {
    globals: globals.browser,
    parserOptions: { tsconfigRootDir: import.meta.dirname }
  }
});
