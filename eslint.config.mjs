import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"], // Include JavaScript and TypeScript
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      // General Best Practices
      "no-unused-vars": "warn",
      "no-console": "warn",
      "prefer-const": "error",

      // Import Rules
      "import/no-unresolved": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling"], "index"],
          "newlines-between": "always",
        },
      ],

      // Unused Imports Rules
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],

      // React Rules
      "react/react-in-jsx-scope": "off", // For React 17+
      "react/prop-types": "off",
      "react/no-array-index-key": "warn",
      "react/jsx-uses-react": "off", // For React 17+
      "react/jsx-uses-vars": "warn",

      // React Hooks Rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Accessibility Rules
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
    },
  },
  js.configs.recommended,
  react.configs.flat.recommended,
];
