import globals from "globals";
import pluginJs from "@eslint/js";
import jest from 'eslint-plugin-jest';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // global config
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    ...pluginJs.configs.recommended,
  },
  // jest plugin
  {
    files: ["**/*.test.js"], ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  },
  // allow unused var for interface files
  {
    files: [
      "**/*Repository.js",
      "**/*Manager.js",
      "**/*Hash.js",
    ],
    rules: {
      "no-unused-vars": "off",
    },
  },
];