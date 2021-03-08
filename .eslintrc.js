module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-non-null-assertion': 0,
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  // extends: ['plugin:prettier/recommended'],

  overrides: [
    {
      files: ['**/*.vue'],
      extends: ['plugin:prettier/recommended', 'plugin:vue/vue3-essential'],
    },
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      // extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint'],
      extends: ['prettier/@typescript-eslint'],
      rules: {
        'no-useless-escape': 'off',

        // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
        'default-case': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
        'no-dupe-class-members': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
        'no-undef': 'off',

        // Add TypeScript specific rules (and turn off ESLint equivalents)
        'no-array-constructor': 'off',
        'no-redeclare': 'off',
        'no-use-before-define': 'off',
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'none',
            ignoreRestSiblings: true,
          },
        ],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'warn',
      },
    },
    {
      files: ['**/*.spec.{j,t}s'],
      env: {
        jest: true,
      },
    },
  ],
}
