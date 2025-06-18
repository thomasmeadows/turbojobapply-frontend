// eslint.config.mjs
import pluginVue from 'eslint-plugin-vue';
import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs, configureVueProject } from '@vue/eslint-config-typescript';
import tailwind from 'eslint-plugin-tailwindcss';
import prettier from 'eslint-plugin-prettier/recommended';
import vueConfigPrettier from '@vue/eslint-config-prettier';

configureVueProject({
  tsSyntaxInTemplates: true,

  // Optional: specify the script langs in `.vue` files
  // Defaults to `['ts']`.
  scriptLangs: [
    'ts',

    // [!DISCOURAGED]
    // Include 'js' to allow plain `<script>` or `<script setup>` blocks.
    // This might result-in false positive or negatives in some rules for `.vue` files.
    // Note you also need to configure `allowJs: true` and `checkJs: true`
    // in corresponding `tsconfig.json` files.
    'js',
  ],
  rootDir: import.meta.dirname,
});

const custom = {
  name: 'custom',
  rules: {
    ...vueConfigPrettier.rules,
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
      },
    ],
    // Your custom requirements
    '@typescript-eslint/no-explicit-any': 'off',
    'max-lines': ['error', { max: 2000, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
    'max-len': ['error', { code: 600, tabWidth: 2, ignoreUrls: true, ignoreStrings: true }],
    'tailwindcss/no-custom-classname': 'off',
  },
};

const config = defineConfigWithVueTs(
  tailwind.configs['flat/recommended'],
  pluginVue.configs['flat/essential'],
  globalIgnores([
    '!node_modules/', // unignore `node_modules/` directory
    'node_modules/*', // ignore its content
    '!node_modules/mylibrary/', // unignore `node_modules/mylibrary` directory
    'dist/*',
  ]),

  // prettier
  prettier,
  // We STRONGLY RECOMMEND you to start with `recommended` or `recommendedTypeChecked`.
  // But if you are determined to configure all rules by yourself,
  // you can start with `base`, and then turn on/off the rules you need.
  vueTsConfigs.recommendedTypeChecked,
  custom,
);

export default config;
