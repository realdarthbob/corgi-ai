import { defineConfig } from 'eslint/config';
import globals from 'globals';
import base from './eslint.base.ts';

export default defineConfig(base, {
  languageOptions: {
    globals: globals.node,
    parserOptions: { tsconfigRootDir: import.meta.dirname }
  }
});
