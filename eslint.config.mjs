// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended, // tseslint.configs.recommended is an array
  // If you want to include type-aware rules, you'd use tseslint.configs.recommendedTypeChecked
  // and provide languageOptions.parserOptions.project
  {
    // files: ['**/*.ts', '**/*.tsx'], // You can specify file patterns if needed
    // languageOptions: { // Already handled by tseslint.configs.recommended for TS files
    //   parser: tseslint.parser,
    // },
    // plugins: { // Already handled by tseslint.configs.recommended
    //   '@typescript-eslint': tseslint.plugin,
    // },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Add other custom rules here
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }]
    },
  }
  // If you had specific globals for node and es2021 not covered, you could add them:
  // {
  //   languageOptions: {
  //     globals: {
  //       // ...require('globals').node, // if you install 'globals' package
  //       // ...require('globals').es2021,
  //     }
  //   }
  // }
);
