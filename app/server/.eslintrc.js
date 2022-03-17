module.exports = {
  // env: {
  //   browser: true,
  //   es2021: true
  // },
  extends: [
    'standard-with-typescript'
  ],
  // parser: '@typescript-eslint/parser',
  parserOptions: {
    // ecmaVersion: 'latest',
    // sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/triple-slash-reference': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/restrict-template-expressions': 0
  }
}
