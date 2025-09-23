// ESLint flat config for ESLint v9
module.exports = [
	{
		ignores: ['node_modules/**', 'dist/**', '.output/**', '.nuxt/**'],
	},
	{
		files: ['**/*.{js,ts,jsx,tsx}'],
		languageOptions: {
			parser: require('@typescript-eslint/parser'),
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			// Formatting (semi/quotes/comma-dangle) is handled by Prettier via prettier/prettier
		},
	},
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: require('vue-eslint-parser'),
			parserOptions: {
				parser: require('@typescript-eslint/parser'),
				ecmaVersion: 2022,
				sourceType: 'module',
			},
		},
		plugins: {
			vue: require('eslint-plugin-vue'),
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			// 'vue/component-tags-order' removed: not available in this plugin version
		},
	},
	// Prettier integration: enable prettier/prettier if plugin is installed
	{
		files: ['**/*.{js,ts,vue,jsx,tsx}'],
		plugins: {
			prettier: (() => {
				try {
					return require('eslint-plugin-prettier');
				} catch (e) {
					return undefined;
				}
			})(),
		},
		rules: (function () {
			try {
				require.resolve('eslint-plugin-prettier');
				return { 'prettier/prettier': 'error' };
			} catch (e) {
				return {};
			}
		})(),
	},
	// Overrides for tests: relax unused-vars to avoid failing generated/test code
	{
		files: ['tests/**/*.{js,ts,jsx,tsx}', '**/*.spec.{js,ts,jsx,tsx}'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
];
