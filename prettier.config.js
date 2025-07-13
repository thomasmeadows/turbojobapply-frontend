/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  trailingComma: 'none',
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  endOfLine: 'crlf'
};

export default config;
