import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";
// import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import stylisticJs from "@stylistic/eslint-plugin";

export default [
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
  // eslintPluginPrettierRecommended,
  {
    rules: {
      "no-unused-vars": "warn",
    },
  },
  {
    ignores: ["dist/*", "coverage/*"],
  },
  {
    files: ["**/*.test.js"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off",
      // "jest/expect-expect": "error", // Test has no assertions for start.test.js - not a error now
      "@stylistic/quotes": ["error", "single"],
    },
  },
  {
    plugins: {
      "@stylistic": stylisticJs,
    }
  }
];
