import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // Prettier integration
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // Turn off rules that conflict with Prettier
  prettierConfig,

  // Custom configuration
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
        es2021: true,
      },
    },
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
      },
      {
        files: ["jest.config.js"],
        env: {
          node: true,
        },
        parserOptions: {
          sourceType: "script",
        },
      },
    ],
    rules: {
      "no-unused-vars": [
        "error",
        { vars: "all", args: "after-used", ignoreRestSiblings: false },
      ],
      "no-console": "warn",
      eqeqeq: "error",
    },
  },
];
