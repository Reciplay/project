// // eslint.config.mjs
// import js from "@eslint/js";
// import importPlugin from "eslint-plugin-import";
// import nextPlugin from "eslint-plugin-next";
// import prettierPlugin from "eslint-plugin-prettier";
// import reactPlugin from "eslint-plugin-react";
// import reactHooks from "eslint-plugin-react-hooks";
// import tseslint from "typescript-eslint"; // ★ 추가

// export default [
//   // 무시 경로
//   { ignores: [".next/", "node_modules/", "dist/", "build/", "coverage/"] },

//   // JS 권장
//   js.configs.recommended,

//   // 공통(Next/React/Import/Prettier)
//   {
//     plugins: {
//       react: reactPlugin,
//       "react-hooks": reactHooks,
//       import: importPlugin,
//       prettier: prettierPlugin,
//       "@next/next": nextPlugin,
//     },
//     languageOptions: {
//       ecmaVersion: "latest",
//       sourceType: "module",
//       parserOptions: { ecmaFeatures: { jsx: true } },
//     },
//     settings: {
//       react: { version: "detect" },
//       // import/resolver 설정이 필요하면 여기에 추가 가능
//     },
//     rules: {
//       // Next 권장
//       ...nextPlugin.configs["core-web-vitals"].rules,

//       // import 정렬/일관성
//       "import/order": [
//         "error",
//         {
//           groups: [
//             "builtin",
//             "external",
//             "internal",
//             ["parent", "sibling", "index"],
//           ],
//           "newlines-between": "always",
//           alphabetize: { order: "asc", caseInsensitive: true },
//         },
//       ],
//       "import/no-unresolved": "off", // TS가 해결

//       // React 19
//       "react/react-in-jsx-scope": "off",
//       "react/jsx-uses-react": "off",
//       "react/prop-types": "off",

//       // Prettier 불일치 = 에러
//       "prettier/prettier": "error",
//     },
//   },

//   // ★ TS/TSX 전용 규칙 (any 금지 등)
//   {
//     files: ["**/*.ts", "**/*.tsx"],
//     // ts-eslint 파서/플러그인 적용
//     ...tseslint.configs.recommended, // 기본 TS 권장
//     languageOptions: {
//       parser: tseslint.parser,
//       parserOptions: {
//         project: "./tsconfig.json", // 타입 정보 기반 규칙까지 쓰려면 필요
//         tsconfigRootDir: process.cwd(),
//       },
//     },
//     plugins: {
//       "@typescript-eslint": tseslint.plugin,
//     },
//     rules: {
//       "@typescript-eslint/no-explicit-any": "error", // ★ 명시적 any 금지
//       "@typescript-eslint/consistent-type-imports": [
//         "error",
//         { prefer: "type-imports" },
//       ],
//       // 필요시 추가:
//       // "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
//     },
//   },
// ];
// eslint.config.mjs
// eslint.config.mjs
import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  // 전역 기본
  js.configs.recommended,

  // 타입 정보 없이도 돌아가는 TS 권장 세트 (느슨)
  ...tseslint.configs.recommended, // 필요 시 type-checked preset으로 변경 가능

  // Next 권장(코어 웹 바이탈) — 일부 규칙만 완화/해제
  {
    plugins: { "@next/next": next },
    rules: {
      ...next.configs["core-web-vitals"].rules,
      // Next 13+ / React 17+에서는 불필요
      "react/react-in-jsx-scope": "off",
      // app 라우터에서는 pages 규칙이 과도할 수 있어 완화
      "@next/next/no-html-link-for-pages": "off",
    },
  },

  // React / Hooks
  {
    plugins: { react, "react-hooks": reactHooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // 구성 요소 이름/PropTypes 등 엄격도 낮춤
      "react/prop-types": "off",
      "react/display-name": "off",
    },
  },

  // 공통 적용 범위 & 규칙
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "public/**",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        // ➜ 나중에 타입기반 규칙 강화하려면 아래 주석 해제
        // project: ["./tsconfig.json"],
        // tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      // 사용성/가독성 위주 — 에러 폭발 방지용 기본값
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "off",

      // TS와 중복될 수 있는 룰은 완화
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/ban-ts-comment": "off",

      // 스타일성 규칙은 기본 off (Prettier 쓰면 더 깔끔)
      quotes: "off",
      semi: "off",
      "comma-dangle": "off",
      indent: "off",
    },
  },

  // (선택) 테스트/스토리 파일에 더 느슨하게
  {
    files: ["**/*.{spec,test}.{ts,tsx,js,jsx}", "**/*.stories.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
];
