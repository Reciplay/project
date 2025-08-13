// eslint.config.mjs
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import nextPlugin from "eslint-plugin-next";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint"; // ★ 추가

export default [
  // 무시 경로
  { ignores: [".next/", "node_modules/", "dist/", "build/", "coverage/"] },

  // JS 권장
  js.configs.recommended,

  // 공통(Next/React/Import/Prettier)
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      import: importPlugin,
      prettier: prettierPlugin,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: "detect" },
      // import/resolver 설정이 필요하면 여기에 추가 가능
    },
    rules: {
      // Next 권장
      ...nextPlugin.configs["core-web-vitals"].rules,

      // import 정렬/일관성
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-unresolved": "off", // TS가 해결

      // React 19
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",

      // Prettier 불일치 = 에러
      "prettier/prettier": "error",
    },
  },

  // ★ TS/TSX 전용 규칙 (any 금지 등)
  {
    files: ["**/*.ts", "**/*.tsx"],
    // ts-eslint 파서/플러그인 적용
    ...tseslint.configs.recommended, // 기본 TS 권장
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json", // 타입 정보 기반 규칙까지 쓰려면 필요
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error", // ★ 명시적 any 금지
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      // 필요시 추가:
      // "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
