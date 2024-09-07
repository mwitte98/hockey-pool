// @ts-check
/* eslint-disable import/no-nodejs-modules */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import angularEslint from 'angular-eslint';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier/recommended';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import { config as tsEslintConfig, configs as tsEslintConfigs, parser as tsEslintParser } from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});
function legacyPlugin(name, alias = name) {
  const plugin = compat.plugins(name)[0].plugins?.[alias];

  if (!plugin) {
    throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
  }

  return fixupPluginRules(plugin);
}

export default tsEslintConfig(
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  ...compat.extends('plugin:import/typescript'),
  {
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: import.meta.dirname },
    },
    settings: { 'import/resolver': { typescript: {} } },
    plugins: {
      import: legacyPlugin('eslint-plugin-import', 'import'),
    },
    rules: {
      'import/consistent-type-specifier-style': 'error',
      'import/default': 'error',
      'import/dynamic-import-chunkname': 'error',
      'import/export': 'error',
      'import/extensions': 'error',
      'import/first': 'error',
      'import/max-dependencies': ['error', { max: 30 }],
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-amd': 'error',
      'import/no-anonymous-default-export': 'error',
      'import/no-commonjs': 'error',
      'import/no-cycle': 'error',
      'import/no-default-export': 'error',
      'import/no-duplicates': 'error',
      'import/no-dynamic-require': 'error',
      'import/no-empty-named-blocks': 'error',
      'import/no-extraneous-dependencies': 'error',
      'import/no-import-module-exports': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-named-as-default': 'error',
      'import/no-named-as-default-member': 'error',
      'import/no-named-default': 'error',
      'import/no-named-export': 'error',
      'import/no-namespace': 'error',
      'import/no-nodejs-modules': 'error',
      'import/no-relative-packages': 'error',
      'import/no-restricted-paths': 'error',
      'import/no-self-import': 'error',
      'import/no-unassigned-import': 'error',
      'import/no-unresolved': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type', 'unknown'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/unambiguous': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: { parserOptions: { project: ['tsconfig.json'] } },
    extends: [
      eslint.configs.all,
      ...tsEslintConfigs.all,
      ...angularEslint.configs.tsAll,
      sonarjs.configs.recommended,
      unicorn.configs['flat/all'],
      prettier,
    ],
    processor: angularEslint.processInlineTemplates,
    rules: {
      '@angular-eslint/component-selector': ['error', { prefix: '', style: 'kebab-case', type: 'element' }],
      '@angular-eslint/directive-selector': ['error', { prefix: '', style: 'camelCase', type: 'attribute' }],
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/use-component-selector': 'off',
      '@typescript-eslint/class-methods-use-this': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/max-params': ['error', { max: 8 }],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'static-field',
            'instance-field',
            'constructor',
            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
          ],
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extraneous-class': ['error', { allowEmpty: true }],
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/parameter-properties': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-readonly': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      camelcase: 'off',
      'capitalized-comments': 'off',
      'class-methods-use-this': 'off',
      eqeqeq: ['error', 'smart'],
      'id-length': 'off',
      'max-params': 'off',
      'max-statements': ['error', 15],
      'multiline-comment-style': ['error', 'separate-lines'],
      'new-cap': [
        'error',
        {
          capIsNewExceptions: [
            'Component',
            'HostBinding',
            'Inject',
            'Injectable',
            'Input',
            'NgModule',
            'Optional',
            'Self',
            'ViewChild',
          ],
        },
      ],
      'no-continue': 'off',
      'no-eq-null': 'off',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-ternary': 'off',
      'no-undefined': 'off',
      'one-var': 'off',
      'sonarjs/no-empty-function': 'off',
      'sonarjs/prefer-nullish-coalescing': 'off',
      'sort-imports': ['error', { ignoreCase: true, allowSeparatedGroups: true, ignoreDeclarationSort: true }],
      'sort-keys': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    files: ['**/*.spec.ts'],
    extends: [jest.configs['flat/all']],
    rules: {
      'jest/prefer-importing-jest-globals': 'off',
      'jest/prefer-lowercase-title': ['error', { ignoreTopLevelDescribe: true }],
      'jest/no-hooks': 'off',
      'jest/prefer-expect-assertions': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angularEslint.configs.templateAll, prettier],
    rules: {
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/cyclomatic-complexity': ['error', { maxComplexity: 15 }],
      '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }],
      '@angular-eslint/template/i18n': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/no-call-expression': 'off',
      'prettier/prettier': ['error', { parser: 'angular' }],
    },
  },
);
