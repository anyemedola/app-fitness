// pnpm nests packages as node_modules/.pnpm/<pkg>@<version>/node_modules/<pkg>. A plain
// "node_modules/(?!pkg-a|pkg-b)" whitelist regex only checks the segment right after the
// *first* "node_modules/", which under pnpm is ".pnpm", so it always matches (= always
// ignored) and RN/Expo's untranspiled ESM/Flow sources blow up with "Unexpected token".
// Allowing an arbitrary path prefix before the package name in the lookahead fixes that.
const transformModules = [
  "react-native[a-zA-Z0-9_-]*",
  "@react-native[a-zA-Z0-9_/-]*",
  "expo[a-zA-Z0-9_-]*",
  "@expo[a-zA-Z0-9_/-]*",
  "unimodules[a-zA-Z0-9_-]*",
  "@unimodules[a-zA-Z0-9_/-]*",
].join("|");

module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@react-native-async-storage/async-storage$":
      "@react-native-async-storage/async-storage/jest/async-storage-mock",
  },
  transformIgnorePatterns: [`node_modules/(?!(?:.*/)?(?:${transformModules})(?:/|$))`],
  testMatch: ["**/__tests__/**/*.test.tsx", "**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
