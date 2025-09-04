// chat-backend/eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  // Ignore build artifacts
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },

  // Base JS rules
  js.configs.recommended,

  // Type-aware TS rules (needs parserOptions.projectService: true)
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier integration
  eslintPluginPrettierRecommended,

  // Project-specific options & rules
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        // enables type-aware rules without hardcoding tsconfig path
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  }
);
