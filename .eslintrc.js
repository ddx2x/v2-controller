module.exports = {
  rules: {
    // Note: you must disable the base rule as it can report incorrect errors
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
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
};
