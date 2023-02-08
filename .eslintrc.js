module.exports = {
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'react-hooks/rules-of-hooks': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    'eslint-disable-next-line': 'prefer-const',
    'dot-notation': 'off',
    '@typescript-eslint/dot-notation': 'warn',
  },
  extends: [require.resolve('@umijs/lint/dist/config/eslint')],
  globals: {
    page: true,
    REACT_APP_ENV: true,
  },
};
