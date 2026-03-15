const {FlatCompat} = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const files = ['src/**/*.{ts,tsx}'];

module.exports = [
  ...compat
      .config({
        env: {
          browser: true,
          es2021: true,
        },
        extends: [
          'plugin:react/recommended',
          'google',
        ],
        parser: '@typescript-eslint/parser',
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        plugins: [
          'react',
          '@typescript-eslint',
        ],
        settings: {
          react: {
            version: 'detect',
          },
        },
        rules: {
          'max-len': 'off',
          'require-jsdoc': 'off',
        },
      })
      .map((config) => ({
        ...config,
        files,
        rules: {
          ...config.rules,
          'valid-jsdoc': 'off',
        },
      })),
];