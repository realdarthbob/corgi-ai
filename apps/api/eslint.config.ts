import base from '@corgi-ai/config/eslint';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig(base, {
  languageOptions: {
    globals: globals.node,
    parserOptions: { tsconfigRootDir: import.meta.dirname }
  }
});
