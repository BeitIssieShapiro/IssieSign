module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "object-curly-spacing": ["error", "always"],
    "quotes": ["error", "double"],
    "indent": "off",
    "eol-last": "off",
    "arrow-parens": 0,
    "max-len": 0,
    "camelcase": "off",
  },
};