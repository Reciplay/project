import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js + TypeScript 기본 규칙
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended" // ★ Prettier 규칙 ESLint에 통합
  ),
  {
    rules: {
      // 여기에 추가 규칙 작성 가능
      // 예: 세미콜론 강제
      // "semi": ["error", "always"]
    },
  },
];

export default eslintConfig;
