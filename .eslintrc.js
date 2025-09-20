module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Disable some rules for development convenience
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    // Custom rules for project consistency
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
  },
}