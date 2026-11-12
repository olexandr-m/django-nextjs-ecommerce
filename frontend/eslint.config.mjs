import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "perfectionist/sort-jsx-props": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          groups: ["id", "className", "dimensions", "unknown", "callback"],
          customGroups: [
            {
              groupName: "id",
              elementNamePattern: "^id$",
            },
            {
              groupName: "className",
              elementNamePattern: "^className$",
            },
            {
              groupName: "dimensions",
              elementNamePattern: "^(width|height)$",
            },
            {
              groupName: "callback",
              elementNamePattern: "^on[A-Z]",
            },
          ],
        },
      ],
    },
  },
  prettier,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
