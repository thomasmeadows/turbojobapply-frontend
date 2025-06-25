// eslint.config.mjs
import pluginVue from 'eslint-plugin-vue';
import { globalIgnores } from 'eslint/config';
import {
  defineConfigWithVueTs,
  vueTsConfigs,
  configureVueProject
} from '@vue/eslint-config-typescript';
import tailwind from 'eslint-plugin-tailwindcss';

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
    'js'
  ],
  rootDir: import.meta.dirname
});

const custom = {
  name: 'custom',
  rules: {
    // Your custom requirements
    '@typescript-eslint/no-explicit-any': 'off',
    'max-lines': [
      'error',
      { max: 2000, skipBlankLines: true, skipComments: true }
    ],
    'max-lines-per-function': [
      'error',
      { max: 110, skipBlankLines: true, skipComments: true }
    ],
    'max-len': [
      'error',
      { code: 600, tabWidth: 2, ignoreUrls: true, ignoreStrings: true }
    ],
    'tailwindcss/no-custom-classname': 'off'
  }
};

const config = defineConfigWithVueTs(
  globalIgnores([
    '!node_modules/', // unignore `node_modules/` directory
    'node_modules/*', // ignore its content
    '!node_modules/mylibrary/', // unignore `node_modules/mylibrary` directory
    'dist/*'
  ]),
  tailwind.configs['flat/recommended'],
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommendedTypeChecked,
  custom
);

export default config;
