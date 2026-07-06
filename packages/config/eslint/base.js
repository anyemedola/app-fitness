/** Base ESLint config shared by every workspace. */
module.exports = {
  root: false,
  env: { es2022: true, node: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    project: false,
  },
  plugins: ["@typescript-eslint", "import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:import/recommended", "prettier"],
  settings: {
    "import/resolver": {
      node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    // TS path resolution is left to `tsc --noEmit` (run separately); ESLint here only
    // checks style/correctness rules, so we don't need eslint-import-resolver-typescript.
    "import/no-unresolved": "off",
    // These rules statically parse every imported module to verify its exports. React
    // Native/Expo's own sources use Flow syntax that the default (non-Flow) parser can't
    // read, and packages with conditional/platform-specific "exports" maps (e.g. firebase)
    // trip up the resolver too, so both misfire with false positives here. TypeScript
    // (`tsc --noEmit`, run separately) already checks that imported names actually exist,
    // so we don't lose real coverage by turning these off.
    "import/namespace": "off",
    "import/default": "off",
    "import/named": "off",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
      },
    ],
  },
  ignorePatterns: ["dist", "build", ".expo", "node_modules", "coverage"],
};
